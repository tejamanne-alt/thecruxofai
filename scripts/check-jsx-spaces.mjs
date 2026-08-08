/**
 * Finds words that get glued together when JSX is compiled.
 *
 * JSX throws away some of the whitespace around a line break inside a text
 * node. So this, which reads perfectly well in the editor:
 *
 *     The <strong>Manhattan norm</strong> ‖x‖₁ adds up the absolute values
 *     of the components.
 *
 * compiles to "The Manhattan norm‖x‖₁ adds up …". The space is gone. Nothing
 * warns you: the page builds, the types check, and the mistake only shows up
 * when you read the sentence — usually the night before an exam.
 *
 * Prettier re-wraps prose every time it runs, so any line can become the line
 * that loses its space. That makes this a class of bug rather than a typo.
 *
 * WHY THIS COMPILES THE FILE INSTEAD OF READING IT
 *
 * An earlier version of this script modelled the whitespace rule by hand and
 * reported the file clean while the built page really did say "norm‖x‖₁". The
 * hand-written model and the compiler disagreed, and the compiler is the one
 * that ships. So this now runs the file through the very SWC that Next builds
 * with, and inspects the children arrays it emits. Whatever the rule turns out
 * to be in this SWC version, the check follows it exactly, by construction.
 *
 * The fix is always the same: write the space as {' '} so it survives.
 *
 * Two kinds of join get reported:
 *
 *   ERROR — text glued to an element, as above. A space was meant.
 *   note  — text glued to a {...} expression, like "carr{plural}" or "{d}x₂²".
 *           Gluing is nearly always the point there, so these never fail.
 *
 *   node scripts/check-jsx-spaces.mjs
 */
import swc from 'next/dist/build/swc/index.js'
import { globSync, readFileSync, writeFileSync } from 'node:fs'

const files = globSync('src/**/*.tsx').sort()

/** Characters after which, or before which, a reader expects a space. Greek
 *  letters and ℝ are already \p{L}; ‖, ⟨ and √ are not, but they open a word
 *  as far as a reader is concerned. Leaving those out is how "norm‖x‖₁" got
 *  through the first time. */
const MATH_OPENERS = '‖⟨√∑∏∫∀∃∈∉⊆⊂⊥∅∂∇±∓¬'
const WORDY_END = /[\p{L}\p{N}\p{M}.,;:!?%)\]}’”‖⟩]$/u
const WORDY_START = new RegExp(`^[\\p{L}\\p{N}\\p{M}(\\[{‘“${MATH_OPENERS}]`, 'u')

/** Tags that attach to the word beside them, so "a<sub>11</sub>" reads as a₁₁
 *  and is not a missing space. */
const ATTACHED = new Set(['sub', 'sup'])

await swc.loadBindings()

const errors = []
const notes = []

/** The tag name of a compiled _jsx("tag", {...}) / _jsx(Component, {...}) call. */
function calleeTag(node) {
  if (node?.type !== 'CallExpression') return null
  const a = node.arguments?.[0]?.expression
  if (!a) return null
  if (a.type === 'StringLiteral') return a.value
  if (a.type === 'Identifier') return a.value
  return null
}

/** The `children` value of a compiled jsx call, if it has one. */
function childrenOf(node) {
  const props = node?.arguments?.[1]?.expression
  if (props?.type !== 'ObjectExpression') return null
  for (const p of props.properties ?? []) {
    const k = p.key
    const name = k?.value ?? k?.name
    if (name === 'children') return p.value
  }
  return null
}

/**
 * What a compiled child contributes at one of its edges. Strings give their own
 * text; elements are followed into their children; anything else renders some
 * value we cannot know statically, so it counts as a word.
 */
function edge(node, side) {
  if (!node) return ''
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'TemplateLiteral') {
    const q = side === 'end' ? node.quasis[node.quasis.length - 1] : node.quasis[0]
    return q?.cooked ?? 'x'
  }
  if (node.type === 'CallExpression') {
    const kids = childrenOf(node)
    if (!kids) return ''
    return edge(kids, side)
  }
  if (node.type === 'ArrayExpression') {
    const els = node.elements ?? []
    for (let i = 0; i < els.length; i++) {
      const e = side === 'end' ? els[els.length - 1 - i] : els[i]
      const t = edge(e?.expression ?? e, side)
      if (t !== '') return t
    }
    return ''
  }
  if (node.type === 'ParenthesisExpression') return edge(node.expression, side)
  if (node.type === 'CondExpression') {
    const a = edge(node.consequent, side)
    const b = edge(node.alternate, side)
    return side === 'end' ? (WORDY_END.test(a) ? a : b) : WORDY_START.test(a) ? a : b
  }
  if (node.type === 'BinaryExpression') {
    if (node.operator === '&&') return edge(node.right, side)
    if (node.operator === '||' || node.operator === '??') {
      const a = edge(node.left, side)
      return a !== '' ? a : edge(node.right, side)
    }
  }
  return 'x'
}

/** True when this compiled child came from a {...} expression rather than an
 *  element — those joins are deliberate far more often than not. */
function isExpressionChild(node) {
  if (!node) return false
  if (node.type === 'StringLiteral' || node.type === 'TemplateLiteral') return false
  if (node.type === 'CallExpression' && calleeTag(node)) return false
  return true
}

function walk(node, file, onPair) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const n of node) walk(n, file, onPair)
    return
  }
  if (node.type === 'CallExpression' && calleeTag(node)) {
    const kids = childrenOf(node)
    if (kids?.type === 'ArrayExpression') {
      const els = (kids.elements ?? []).map((e) => e?.expression ?? e).filter(Boolean)
      for (let i = 0; i + 1 < els.length; i++) onPair(els[i], els[i + 1])
    }
  }
  for (const k of Object.keys(node)) {
    if (k === 'span') continue
    walk(node[k], file, onPair)
  }
}

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  let compiled
  try {
    compiled = await swc.transform(src, {
      filename: file,
      jsc: {
        parser: { syntax: 'typescript', tsx: true },
        target: 'es2022',
        transform: { react: { runtime: 'automatic' } },
      },
    })
  } catch (e) {
    console.log(`could not compile ${file}: ${String(e).split('\n')[0]}`)
    process.exitCode = 1
    continue
  }
  const ast = await swc.parse(compiled.code, {
    filename: file.replace(/\.tsx$/, '.compiled.js'),
    jsc: { parser: { syntax: 'ecmascript', jsx: false }, target: 'es2022' },
  })

  walk(ast, file, (a, b) => {
    // Only raw text can lose whitespace. Two adjacent elements — <h2/> then
    // <p/> — never had a meaningful space between them, and flagging those
    // buries the real findings under a thousand false ones.
    const isText = (n) => n?.type === 'StringLiteral' || n?.type === 'TemplateLiteral'
    if (!isText(a) && !isText(b)) return

    const before = edge(a, 'end')
    const after = edge(b, 'start')
    if (before === '' || after === '') return
    if (!WORDY_END.test(before) || !WORDY_START.test(after)) return
    const tagA = calleeTag(a)
    const tagB = calleeTag(b)
    if (ATTACHED.has(tagA) || ATTACHED.has(tagB)) return
    const glued = `${before.slice(-22)}|${after.slice(0, 22)}`
    const list = isExpressionChild(a) || isExpressionChild(b) ? notes : errors
    list.push({ file, glued, tail: before.slice(-22), head: after.slice(0, 22) })
  })
}

/**
 * Locate a reported join in the source, so the report is clickable and a fix
 * can be applied. The compiled output has no source positions to hand, so this
 * searches the file for the last word before the join and the first word after
 * it, separated by whitespace and at most one closing tag.
 */
function locate(file, tail, head) {
  const raw = readFileSync(file, 'utf8')
  // Blank out comments and template literals so a match can never land in one.
  // Offsets are preserved by replacing each character with a space.
  const blanked = raw.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:[^`\\]|\\.)*`/g, (m) => m.replace(/[^\n]/g, ' '))
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const a = esc(tail.trim().split(/\s+/).pop() ?? '')
  const b = esc(head.trim().split(/\s+/)[0] ?? '')
  if (!a || !b) return null
  const re = new RegExp(`${a}(</[A-Za-z][\\w.]*>|)(\\s+)(?=${b})`, 'g')
  const hits = []
  let m
  while ((m = re.exec(blanked)) !== null) {
    hits.push({ at: m.index + m[0].length - m[2].length, gapLen: m[2].length })
  }
  // Only act when there is exactly one candidate. Two identical phrases in one
  // file is rare, and guessing between them would corrupt the good one.
  if (hits.length !== 1) return hits.length ? { ambiguous: hits.length } : null
  const h = hits[0]
  return { ...h, line: raw.slice(0, h.at).split('\n').length }
}

for (const n of notes) console.log(`note  ${n.file}  ${n.glued}`)
for (const e of errors) {
  const loc = locate(e.file, e.tail, e.head)
  e.loc = loc
  const where = loc?.ambiguous
    ? ` (${loc.ambiguous} candidates — fix by hand)`
    : loc
      ? ':' + loc.line
      : ' (not located)'
  console.log(`ERROR ${e.file}${where}  ${e.glued}`)
}

if (process.argv.includes('--fix')) {
  const byFile = new Map()
  for (const e of errors) {
    if (!e.loc || e.loc.ambiguous || e.loc.at === undefined) continue
    if (!byFile.has(e.file)) byFile.set(e.file, [])
    byFile.get(e.file).push(e.loc)
  }
  let n = 0
  for (const [file, locs] of byFile) {
    let text = readFileSync(file, 'utf8')
    for (const l of [...locs].sort((x, y) => y.at - x.at)) {
      text = text.slice(0, l.at) + "{' '}" + text.slice(l.at + l.gapLen)
      n++
    }
    writeFileSync(file, text)
  }
  console.log(`\ninserted ${n} missing {' '} across ${byFile.size} file(s) — run the formatter, then check again`)
  process.exit(0)
}

if (errors.length === 0) {
  console.log(`\nno glued words in ${files.length} .tsx files (${notes.length} deliberate join(s) noted)`)
  process.exit(process.exitCode ?? 0)
}
console.log(`\n${errors.length} place(s) where JSX glues two words together. Write the space as {' '}.`)
process.exit(1)
