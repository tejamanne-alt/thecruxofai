/*
 * Prove every part page has an interactive that actually works.
 *
 * "Works" means the same thing here as it does in the working agreements: a
 * real click, drag or key press changes what the page says. Counting elements
 * is not evidence — a lab can render every control it owns and still be wired
 * to nothing, and that is precisely the failure this is looking for.
 *
 * The awkward case, and the reason this exists as a committed script rather
 * than a throwaway one, is the chart. A chart is operated by dragging a mark
 * drawn on a canvas, and a canvas has no elements inside it, so a driver that
 * hunts for buttons and sliders sees an empty page and cannot tell a
 * drag-only lab from a broken one. Four labs on the site are drag-only. They
 * now expose one focusable element per handle — see `crux-handle` in
 * tailwind.css — which is what a keyboard user needs anyway, and what this
 * drives.
 *
 * Needs a server already running:
 *
 *   npm run build && npx next start -p 3000
 *   BASE=http://localhost:3000 node scripts/check-labs.mjs
 */
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = (process.env.BASE ?? 'http://localhost:3000').replace(/\/$/, '')
const ONLY = process.argv[2] ?? ''

const src = readFileSync(new URL('../src/lib/data/lecture-parts.ts', import.meta.url), 'utf8')

/** Every /session/<chapter>/<part> route, straight out of the data file. */
const routes = []
for (const chapter of src.matchAll(/^ {2}(\w+): \[$/gm)) {
  const start = chapter.index
  const end = src.indexOf('\n  ],', start)
  for (const part of src.slice(start, end).matchAll(/id: '([^']+)'/g)) {
    routes.push(`/session/${chapter[1]}/${part[1]}`)
  }
}
const wanted = ONLY ? routes.filter((r) => r.includes(ONLY)) : routes

/* Buttons every part page carries whether or not it has a lab. Clicking one
 * navigates, which would change the text and pass the check for the wrong
 * reason. */
const FURNITURE = /^(sign in|sign out|cheat sheet|cheat|quiz|exam|overview|menu|close|open main menu)$/i

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

const consoleErrors = []
page.on('pageerror', (e) => consoleErrors.push(`${page.url()} :: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${page.url()} :: ${m.text()}`))

const body = () => page.locator('main').first().innerText()
const failures = []
const byKind = {}

for (const route of wanted) {
  const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
  if (resp.status() !== 200) {
    failures.push(`${route}: HTTP ${resp.status()}`)
    continue
  }
  // Hydration has to have happened, or nothing responds and every page "fails".
  await page.waitForTimeout(250)

  const before = await body()
  let how = null

  /* 1. Canvas handles, through the keyboard layer laid over the canvas. */
  const handles = page.locator('main [data-handle]')
  for (let i = 0; i < (await handles.count()) && !how; i++) {
    const h = handles.nth(i)
    await h.scrollIntoViewIfNeeded().catch(() => {})
    await h.focus().catch(() => {})
    for (const key of ['ArrowRight', 'ArrowRight', 'ArrowUp', 'ArrowUp', 'ArrowLeft', 'ArrowDown']) {
      await page.keyboard.press(key)
      await page.waitForTimeout(60)
      if ((await body()) !== before) {
        how = `handle "${await h.getAttribute('data-handle')}" + ${key}`
        break
      }
    }
  }

  /* 2. Sliders. Click near one end, then the other, so a slider already at the
   * clicked position still registers a change. */
  const sliders = page.locator('main input[type=range]')
  for (let i = 0; i < (await sliders.count()) && !how; i++) {
    const el = sliders.nth(i)
    await el.scrollIntoViewIfNeeded().catch(() => {})
    const box = await el.boundingBox()
    if (!box) continue
    for (const at of [0.15, 0.85]) {
      await page.mouse.click(box.x + box.width * at, box.y + box.height / 2)
      await page.waitForTimeout(80)
      if ((await body()) !== before) {
        how = 'slider'
        break
      }
    }
  }

  /* 3. Tick boxes and radios. These take a click, not a value — `fill` throws
   * on them, which is how the one lab driven entirely by check boxes came to
   * look broken when it was not. */
  const ticks = page.locator('main input[type=checkbox], main input[type=radio]')
  for (let i = 0; i < (await ticks.count()) && !how; i++) {
    const el = ticks.nth(i)
    await el.scrollIntoViewIfNeeded().catch(() => {})
    await el.click({ timeout: 2500, force: true }).catch(() => {})
    await page.waitForTimeout(80)
    if ((await body()) !== before) how = 'tick box'
  }

  /* 4. Number boxes. */
  const nums = page.locator('main input:not([type=range]):not([type=checkbox]):not([type=radio])')
  for (let i = 0; i < (await nums.count()) && !how; i++) {
    const el = nums.nth(i)
    if (!(await el.isEditable().catch(() => false))) continue
    await el.scrollIntoViewIfNeeded().catch(() => {})
    const was = await el.inputValue().catch(() => '')
    await el.fill(String((Number(was) || 0) + 3)).catch(() => {})
    await page.waitForTimeout(80)
    if ((await body()) !== before) how = 'number box'
  }

  /* 5. Buttons, last, because a lab that has one usually has several and the
   * first is not always the interesting one. */
  const buttons = page.locator('main button:not([disabled])')
  for (let i = 0; i < (await buttons.count()) && !how; i++) {
    const b = buttons.nth(i)
    if (await b.getAttribute('data-handle')) continue
    const label = ((await b.innerText().catch(() => '')) || '').trim()
    if (!label || FURNITURE.test(label)) continue
    await b.scrollIntoViewIfNeeded().catch(() => {})
    await b.click({ timeout: 2500 }).catch(() => {})
    await page.waitForTimeout(90)
    if ((await body()) !== before) how = `button “${label}”`
  }

  if (how) {
    byKind[how.split(' ')[0]] = (byKind[how.split(' ')[0]] ?? 0) + 1
    console.log(` ok   ${route.padEnd(34)} ${how}`)
  } else {
    failures.push(`${route}: nothing on the page changed anything`)
    console.log(`FAIL  ${route}`)
  }
}

console.log(`\n${wanted.length} part routes driven`)
console.log(
  Object.entries(byKind)
    .map(([k, n]) => `  ${n} via ${k}`)
    .join('\n')
)

if (consoleErrors.length) {
  failures.push(`${consoleErrors.length} console error(s), first: ${consoleErrors[0]}`)
}

await browser.close()
if (failures.length) {
  console.log(`\nFAILURES (${failures.length}):`)
  for (const f of failures) console.log('  ' + f)
  process.exit(1)
}
console.log('\nevery part page has a working interactive')
