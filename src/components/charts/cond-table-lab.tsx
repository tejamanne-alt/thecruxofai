'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, type Frame } from '@/lib/chart/frame'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** n/d in lowest terms, so 20/156 reads as 5/39 rather than as 0.1282. */
function frac(n: number, d: number) {
  if (d === 0) return '—'
  if (n === 0) return '0'
  const g = gcd(n, d)
  return `${n / g}/${d / g}`
}

/* ========================================================================== */
/* 4 · The loan-default table                                                 */
/* ========================================================================== */

/*
 * Slide 10's table, to the digit. Every number the lab prints is a ratio of
 * two of these integers — nothing is rounded until the very last step — so
 * the boxed answer on board page 5, 27368/32219, comes out of the lab as that
 * fraction and not as a decimal that has drifted.
 */
const CELL = [
  [10503, 27368, 259],
  [3586, 4851, 120],
]
const AGES = ['Young', 'Middle-aged', 'Senior citizens']
const ROWS = ['Did not default', 'Defaulted']

type Sel = 'all' | 'row0' | 'row1' | 'col0' | 'col1' | 'col2'

const SEL_LABEL: Record<Sel, string> = {
  all: 'nothing yet',
  row0: 'they did not default',
  row1: 'they defaulted',
  col0: 'they are young',
  col1: 'they are middle-aged',
  col2: 'they are a senior citizen',
}

/** Does cell (r, c) belong to this selection? */
function inSel(sel: Sel, r: number, c: number) {
  if (sel === 'all') return true
  if (sel === 'row0') return r === 0
  if (sel === 'row1') return r === 1
  return c === Number(sel.slice(3))
}

function countOf(sel: Sel, other?: Sel) {
  let n = 0
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      if (inSel(sel, r, c) && (other === undefined || inSel(other, r, c))) n += CELL[r][c]
    }
  }
  return n
}

export function LoanTableLab() {
  const [given, setGiven] = useState<Sel>('col1')
  const [want, setWant] = useState<Sel>('row0')

  const total = countOf('all')
  const givenN = countOf(given)
  const wantN = countOf(want)
  const bothN = countOf(want, given)
  const cond = givenN === 0 ? null : bothN / givenN

  const opts: Array<{ id: Sel; label: string }> = [
    { id: 'row0', label: 'did not default' },
    { id: 'row1', label: 'defaulted' },
    { id: 'col0', label: 'young' },
    { id: 'col1', label: 'middle-aged' },
    { id: 'col2', label: 'senior' },
  ]

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                Loan default
              </th>
              {AGES.map((a, c) => (
                <th
                  key={a}
                  className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold"
                  style={inSel(given, 0, c) && given.startsWith('col') ? { color: 'var(--acc)' } : undefined}
                >
                  {a}
                </th>
              ))}
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((label, r) => (
              <tr key={label}>
                <td
                  className="border-b border-zinc-950/[0.06] px-2.5 py-2 font-semibold"
                  style={given === `row${r}` ? { color: 'var(--acc)' } : undefined}
                >
                  {label}
                </td>
                {CELL[r].map((v, c) => {
                  const inGiven = inSel(given, r, c)
                  const inWant = inSel(want, r, c)
                  return (
                    <td
                      key={c}
                      className={clsx(
                        'border-b border-zinc-950/[0.06] px-2.5 py-2 text-right font-mono tabular-nums',
                        inGiven && inWant ? 'font-bold' : 'text-zinc-500'
                      )}
                      style={
                        inGiven && inWant
                          ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                          : inGiven
                            ? { background: 'rgba(9,9,11,0.04)', color: '#3f3f46' }
                            : undefined
                      }
                    >
                      {v.toLocaleString('en-GB')}
                    </td>
                  )
                })}
                <td className="border-b border-zinc-950/[0.06] px-2.5 py-2 text-right font-mono text-zinc-500 tabular-nums">
                  {countOf(`row${r}` as Sel).toLocaleString('en-GB')}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2.5 py-2 font-semibold text-zinc-500">Total</td>
              {[0, 1, 2].map((c) => (
                <td key={c} className="px-2.5 py-2 text-right font-mono text-zinc-500 tabular-nums">
                  {countOf(`col${c}` as Sel).toLocaleString('en-GB')}
                </td>
              ))}
              <td className="px-2.5 py-2 text-right font-mono font-semibold text-zinc-700 tabular-nums">
                {total.toLocaleString('en-GB')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              I am told that…
            </div>
            <Presets items={opts} at={given} onPick={setGiven} />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What is the chance that…
            </div>
            <Presets items={opts} at={want} onPick={setWant} />
          </div>
          <LabNote>
            The shaded block is everyone the news leaves standing — {givenN.toLocaleString('en-GB')} of the{' '}
            {total.toLocaleString('en-GB')} people. The bold cells inside it are the ones that also match the question.
            The grand total 46,687 never appears in the answer: it cancels.
          </LabNote>
        </div>

        <div className="flex flex-col gap-3">
          <ReadOut
            label={`P( ${want === 'all' ? 'anything' : SEL_LABEL[want].replace('they are ', '').replace('they ', '')} | ${SEL_LABEL[given].replace('they are ', '').replace('they ', '')} )`}
            value={cond === null ? '—' : cond.toFixed(4)}
            note={`= ${bothN.toLocaleString('en-GB')} / ${givenN.toLocaleString('en-GB')}`}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Why the total cancels
            </div>
            <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
              {`P(both)  = ${bothN.toLocaleString('en-GB')} / ${total.toLocaleString('en-GB')}
P(given) = ${givenN.toLocaleString('en-GB')} / ${total.toLocaleString('en-GB')}
─────────────────────────
divide     ${bothN.toLocaleString('en-GB')} / ${givenN.toLocaleString('en-GB')} = ${cond === null ? '—' : cond.toFixed(4)}`}
            </div>
          </div>
          <ReadOutGrid
            items={[
              { label: 'Unconditional', value: (wantN / total).toFixed(4) },
              { label: 'Given the news', value: cond === null ? '—' : cond.toFixed(4) },
            ]}
          />
          <Btn
            primary
            onClick={() => {
              setGiven('col1')
              setWant('row0')
            }}
          >
            The lecture’s question
          </Btn>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 6 · Three numbers, four answers                                            */
/* ========================================================================== */

/**
 * Example 3 hands you P(A), P(B) and P(A ∩ B) and asks four questions, and
 * every one of them is the same definition with a different piece of algebra
 * in front of it. The two identities doing the work — board page 6's
 * P(A ∩ B′) = P(A) − P(A ∩ B) and board page 7's A ∩ (A ∪ B) = A — are printed
 * as the working, not just used silently.
 */
export function CardPairLab() {
  const [pa, setPa] = useState(0.5)
  const [pb, setPb] = useState(0.5)
  const [both, setBoth] = useState(0.25)

  const maxBoth = Math.min(pa, pb)
  const minBoth = Math.max(0, pa + pb - 1)
  const ab = clamp(both, minBoth, maxBoth)
  const either = pa + pb - ab

  const bGivenA = pa > 0 ? ab / pa : null
  const bcGivenA = pa > 0 ? (pa - ab) / pa : null
  const acGivenB = pb > 0 ? (pb - ab) / pb : null
  const aGivenEither = either > 0 ? pa / either : null

  const rows: Array<[string, string, number | null]> = [
    ['a.', 'P(B | A)', bGivenA],
    ['b.', 'P(B′ | A)', bcGivenA],
    ['c.', 'P(A′ | B)', acGivenB],
    ['d.', 'P(A | A ∪ B)', aGivenEither],
  ]

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3.5">
          <Slider
            label="P(A) — has a Visa card"
            value={pa}
            display={pa.toFixed(2)}
            min={0.05}
            max={0.95}
            step={0.01}
            hint="The slides use 0.5."
            onChange={setPa}
          />
          <Slider
            label="P(B) — has a MasterCard"
            value={pb}
            display={pb.toFixed(2)}
            min={0.05}
            max={0.95}
            step={0.01}
            hint="The slides use 0.5 here too."
            onChange={setPb}
          />
          <Slider
            label="P(A ∩ B) — has both"
            value={ab}
            display={ab.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            hint="The slides use 0.25. It cannot exceed either card on its own."
            onChange={setBoth}
          />
          <Btn
            primary
            onClick={() => {
              setPa(0.5)
              setPb(0.5)
              setBoth(0.25)
            }}
          >
            Back to the slides: 0.5, 0.5, 0.25
          </Btn>
          <LabNote>
            Only three numbers go in. Everything on the right is worked out from them each time you move a slider, so
            nothing here can fall out of step with the sliders above.
          </LabNote>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {rows.map(([tag, label, v]) => (
              <div key={label} className="rounded-lg border border-zinc-950/10 bg-white p-3">
                <div className="text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">
                  {tag} {label}
                </div>
                <div className="font-mono text-[17px] font-semibold text-zinc-950">
                  {v === null ? '—' : v.toFixed(4)}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The two identities that do the work
            </div>
            <div className="overflow-x-auto font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
              {`P(A ∩ B′) = P(A) − P(A ∩ B)          [board 6]
          = ${pa.toFixed(2)} − ${ab.toFixed(2)} = ${(pa - ab).toFixed(2)}

A ∩ (A ∪ B) = A                       [board 7]
so  P(A | A ∪ B) = P(A) / P(A ∪ B)
                 = ${pa.toFixed(2)} / ${either.toFixed(2)} = ${aGivenEither === null ? '—' : aGivenEither.toFixed(4)}

P(A ∪ B) = ${pa.toFixed(2)} + ${pb.toFixed(2)} − ${ab.toFixed(2)} = ${either.toFixed(2)}`}
            </div>
          </div>
          <LabNote>
            Parts (a), (b) and (c) all read 0.5 at the slides’ numbers, which is a coincidence of those numbers and not
            a rule — move any slider and they separate immediately. Part (d) is the one that answers something
            different: 0.67, because being told the person holds at least one card is a smaller world than being told
            nothing.
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 9 · At least one                                                           */
/* ========================================================================== */

/**
 * Board page 9 works "at least one right-handed" by writing out the sample
 * space of three draws and taking LLL off S. The lab lists those outcomes so
 * the subtraction is a thing you can point at: one row out of eight goes, and
 * the seven that remain are what "at least one" means.
 */
export function AtLeastOneLab() {
  const [right, setRight] = useState(272)
  const [n, setN] = useState(3)

  const TOTAL = 300
  const p = right / TOTAL
  const q = 1 - p
  const allRight = p ** n
  const allLeft = q ** n
  const atLeastOneRight = 1 - allLeft

  // Every string of R and L of length n, in the order the board wrote them.
  const outcomes: string[] = []
  for (let i = 0; i < 2 ** n; i++) {
    let s = ''
    for (let b = n - 1; b >= 0; b--) s += (i >> b) & 1 ? 'R' : 'L'
    outcomes.push(s)
  }
  const allL = 'L'.repeat(n)

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The whole sample space of {n} draws — {outcomes.length} outcomes
            </div>
            <div className="flex flex-wrap gap-1.5">
              {outcomes.map((o) => {
                const isAllLeft = o === allL
                return (
                  <span
                    key={o}
                    className="rounded-md border px-2 py-1.5 font-mono text-[12.5px] font-semibold"
                    style={
                      isAllLeft
                        ? { borderColor: RED, background: 'rgba(220,38,38,0.08)', color: RED }
                        : { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                    }
                  >
                    {o}
                  </span>
                )
              })}
            </div>
            <p className="mt-2 text-[12.5px]/[1.6] text-zinc-600">
              The red one is the only outcome with no right-hander in it. “At least one right-handed” is every other
              box, and there is no need to add up {outcomes.length - 1} of them when one subtraction does it.
            </p>
          </div>
          <Slider
            label="Right-handed adults, out of 300"
            value={right}
            display={`${right} / 300`}
            min={0}
            max={300}
            step={1}
            hint="The slides use 272. Drag it down and watch the red outcome stop being negligible."
            onChange={setRight}
          />
          <Slider
            label="How many adults are picked"
            value={n}
            display={String(n)}
            min={1}
            max={6}
            step={1}
            hint="Picked with replacement, so each draw is independent of the ones before it."
            onChange={setN}
          />
        </div>

        <div className="flex flex-col gap-3">
          <ReadOut
            label={`P(at least one right-handed)`}
            value={atLeastOneRight.toFixed(4)}
            tone={TEAL}
            note="1 minus the single red outcome. This is the whole trick."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Worked the slides’ way
            </div>
            <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
              {`P(one right) = ${right}/300 = ${p.toFixed(3)}
P(one left)  = ${TOTAL - right}/300 = ${q.toFixed(3)}

P(all ${n} right) = ${p.toFixed(3)}^${n} = ${allRight.toFixed(4)}
P(all ${n} left)  = ${q.toFixed(3)}^${n} = ${allLeft.toFixed(4)}
P(at least 1 R) = 1 − ${allLeft.toFixed(4)}
                = ${atLeastOneRight.toFixed(4)}`}
            </div>
          </div>
          <LabNote>
            At the slides’ numbers this gives 0.907, 0.093, 0.745, 0.0008 and 0.9992 — the five figures printed on
            slides 20 and 21.
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 10 · Two independent features, as a unit square                            */
/* ========================================================================== */

/**
 * Independence has a picture: cut a unit square once vertically and once
 * horizontally and the four rectangles are the four joint probabilities. It
 * works precisely because the cuts do not bend — a vertical cut at P(A) that
 * had to shift depending on which side of the horizontal cut you were on is
 * exactly what dependence looks like.
 */
export function SpamLab() {
  const [pa, setPa] = useState(0.6)
  const [pb, setPb] = useState(0.4)

  const both = pa * pb
  const either = pa + pb - both
  const neither = (1 - pa) * (1 - pb)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 34
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cutX = pad + pa * boxW
    const cutY = pad + pb * boxH

    const cells: Array<[number, number, number, number, string, string, number]> = [
      [pad, pad, cutX - pad, cutY - pad, acc, 'A and B', both],
      [cutX, pad, pad + boxW - cutX, cutY - pad, 'rgba(13,148,136,0.30)', 'B only', (1 - pa) * pb],
      [pad, cutY, cutX - pad, pad + boxH - cutY, 'rgba(220,38,38,0.28)', 'A only', pa * (1 - pb)],
      [cutX, cutY, pad + boxW - cutX, pad + boxH - cutY, 'rgba(9,9,11,0.06)', 'neither', neither],
    ]
    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    for (const [x, y, w, h, colour, name, v] of cells) {
      g.fillStyle = colour
      g.fillRect(x, y, w, h)
      if (w > 54 && h > 34) {
        g.fillStyle = '#18181b'
        g.textAlign = 'center'
        g.font = '600 12.5px ui-sans-serif, system-ui, sans-serif'
        g.fillText(name, x + w / 2, y + h / 2 - 2)
        g.font = '12px ui-monospace, monospace'
        g.fillText(v.toFixed(3), x + w / 2, y + h / 2 + 15)
      }
    }

    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)
    g.strokeStyle = RED
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(cutX, pad)
    g.lineTo(cutX, pad + boxH)
    g.stroke()
    g.strokeStyle = TEAL
    g.beginPath()
    g.moveTo(pad, cutY)
    g.lineTo(pad + boxW, cutY)
    g.stroke()

    g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
    g.fillStyle = RED
    g.textAlign = 'center'
    g.fillText(`P(A) = ${pa.toFixed(2)}`, pad + (cutX - pad) / 2, pad - 10)
    g.fillStyle = TEAL
    g.textAlign = 'right'
    g.fillText(`P(B) = ${pb.toFixed(2)}`, pad - 8, pad + (cutY - pad) / 2)

    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => pad + v * boxH,
      ux: (q: number) => (q - pad) / boxW,
      uy: (q: number) => (q - pad) / boxH,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pa, pb }}
          handles={(f: Frame) => [
            { id: 'a', px: f.px(pa), py: f.T + 14, grab: 'anywhere', label: 'P(A), the vertical cut' },
            { id: 'b', px: f.L + 14, py: f.py(pb), grab: 'anywhere', label: 'P(B), the horizontal cut' },
          ]}
          onDragTo={(id, x, y) => {
            if (id === 'a') setPa(Math.round(clamp(x, 0.03, 0.97) * 100) / 100)
            else setPb(Math.round(clamp(y, 0.03, 0.97) * 100) / 100)
          }}
          caption="Press anywhere to move a cut. The whole square is 1, and each rectangle is one of the four things that can happen to an email."
        />
      }
      panel={
        <>
          <ReadOut
            label="a · P(A ∩ B) — both clues"
            value={both.toFixed(3)}
            note="Multiply, and only because the two clues are independent."
          />
          <ReadOut
            label="b · P(A ∪ B) — at least one"
            value={either.toFixed(3)}
            note="Add the two, take the overlap off once."
          />
          <ReadOut
            label="c · P(neither)"
            value={neither.toFixed(3)}
            note="The bottom-right rectangle, and also 1 minus the answer above it."
          />
          <Slider
            label="P(A) — contains the word offer"
            value={pa}
            display={pa.toFixed(2)}
            min={0.03}
            max={0.97}
            step={0.01}
            hint="The slides use 0.6."
            onChange={setPa}
          />
          <Slider
            label="P(B) — contains a suspicious link"
            value={pb}
            display={pb.toFixed(2)}
            min={0.03}
            max={0.97}
            step={0.01}
            hint="The slides use 0.4."
            onChange={setPb}
          />
          <PanelNote>
            At 0.6 and 0.4 the three answers are 0.24, 0.76 and 0.24 — the ones printed on slide 23. That the first and
            the third agree is a fluke of these numbers: move either cut and they part company.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 11 · With replacement, and without                                         */
/* ========================================================================== */

type JarId = 'marbles' | 'bulbs'
const JARS: Record<JarId, { label: string; good: number; total: number; want: string; draws: number }> = {
  marbles: { label: '5 red, 6 blue, 2 white', good: 5, total: 13, want: 'red', draws: 2 },
  bulbs: { label: '6400 bulbs, 80 defective', good: 6320, total: 6400, want: 'good', draws: 12 },
}

/**
 * Putting the marble back is the whole difference between the two answers,
 * and the lab shows it as a changing denominator rather than as two formulas.
 * The without-replacement figure is also checked a second way, by counting
 * ordered pairs of labelled marbles — see the note in the panel.
 */
export function ReplacementLab() {
  const [jar, setJar] = useState<JarId>('marbles')
  const [replace, setReplace] = useState(false)
  const [draws, setDraws] = useState(2)

  const j = JARS[jar]
  const k = Math.min(draws, j.good)

  // Stage by stage, so the shrinking denominator is visible rather than
  // hidden inside a power or a binomial coefficient.
  const stages: Array<{ n: number; d: number }> = []
  for (let i = 0; i < draws; i++) {
    stages.push(replace ? { n: j.good, d: j.total } : { n: j.good - i, d: j.total - i })
  }
  const p = stages.reduce((acc, s) => acc * (s.d > 0 ? s.n / s.d : 0), 1)

  // The same answer counted differently: ordered selections of `draws` items.
  const ordered = (top: number, m: number) => {
    let out = 1
    for (let i = 0; i < m; i++) out *= top - i
    return out
  }
  const checkNum = replace ? j.good ** draws : ordered(j.good, draws)
  const checkDen = replace ? j.total ** draws : ordered(j.total, draws)

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What is in the container
            </div>
            <Presets
              items={[
                { id: 'marbles' as JarId, label: 'Jar: 5 red, 6 blue, 2 white' },
                { id: 'bulbs' as JarId, label: 'Batch: 6400 bulbs, 80 bad' },
              ]}
              at={jar}
              onPick={(id) => {
                setJar(id)
                setDraws(JARS[id].draws)
              }}
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              After each draw I…
            </div>
            <div className="flex gap-2">
              <Chip on={replace} label="put it back" onClick={() => setReplace(true)} />
              <Chip on={!replace} label="keep it out" onClick={() => setReplace(false)} />
            </div>
          </div>
          <Slider
            label="How many I draw"
            value={draws}
            display={String(draws)}
            min={1}
            max={jar === 'bulbs' ? 12 : 5}
            step={1}
            hint={`Every one of them has to be ${j.want}.`}
            onChange={setDraws}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Draw by draw</div>
            <div className="overflow-x-auto font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
              {stages.map((s, i) => `draw ${i + 1}:  ${s.n} ${j.want} left of ${s.d}   → ${s.n}/${s.d}`).join('\n')}
            </div>
          </div>
          {k < draws && (
            <LabNote>
              There are only {j.good} {j.want} items in there, so drawing {draws} of them without putting any back
              cannot happen at all.
            </LabNote>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <ReadOut
            label={`P(all ${draws} are ${j.want})`}
            value={p < 0.0001 && p > 0 ? p.toExponential(2) : p.toFixed(4)}
            note={
              replace ? 'Every draw sees the same container.' : 'Each draw leaves the next one a smaller container.'
            }
          />
          {jar === 'marbles' && draws === 2 && (
            <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
              <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                Checked a second way
              </div>
              <div className="font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
                {`label all 13 marbles and count
ordered pairs:

  red-then-red   ${checkNum}
  any-then-any   ${checkDen}
  ────────────────────────
  ${frac(checkNum, checkDen)} = ${(checkNum / checkDen).toFixed(4)}`}
              </div>
            </div>
          )}
          <LabNote>
            The slides set both of these as practice and print no answers, so the two figures above are worked here
            rather than copied. The marble one is checked by counting ordered pairs, which is the second panel; the two
            routes agree.
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 11b · Testing independence from a table                                    */
/* ========================================================================== */

/**
 * The third miscellaneous question asks whether two events are independent and
 * hands you a table rather than probabilities, which is how it is nearly always
 * asked. The counts are editable so the reader can break the independence and
 * watch the verdict change — a fixed table would only ever show one answer.
 */
/** One editable count in the survey table, clamped so the totals stay sane. */
function Num({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-[12.5px]">
      <span className="text-zinc-600">{label}</span>
      <input
        type="number"
        value={value}
        min={0}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (Number.isFinite(v)) onChange(Math.max(0, Math.min(max, Math.round(v))))
        }}
        className="w-20 rounded-md border border-zinc-950/15 px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none focus-visible:border-zinc-950/40"
      />
    </label>
  )
}

export function AirportIndepLab() {
  const [aLate, setALate] = useState(9)
  const [aTotal, setATotal] = useState(45)
  const [bLate, setBLate] = useState(11)
  const TOTAL = 100

  const bTotal = TOTAL - aTotal
  const late = aLate + bLate
  const pA = aTotal / TOTAL
  const pLate = late / TOTAL
  const pBoth = aLate / TOTAL
  const product = pA * pLate
  const independent = Math.abs(pBoth - product) < 1e-9
  const lateGivenA = aTotal > 0 ? aLate / aTotal : null

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[380px] border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                    Of 100 flights
                  </th>
                  <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                    Late
                  </th>
                  <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                    On time
                  </th>
                  <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Airport A', aLate, aTotal - aLate, aTotal],
                  ['Airport B', bLate, bTotal - bLate, bTotal],
                  ['Total', late, TOTAL - late, TOTAL],
                ].map(([label, l, o, t]) => (
                  <tr key={String(label)}>
                    <td className="border-b border-zinc-950/[0.06] px-2.5 py-2 font-semibold text-zinc-700">{label}</td>
                    <td className="border-b border-zinc-950/[0.06] px-2.5 py-2 text-right font-mono tabular-nums">
                      {l}
                    </td>
                    <td className="border-b border-zinc-950/[0.06] px-2.5 py-2 text-right font-mono text-zinc-500 tabular-nums">
                      {o}
                    </td>
                    <td className="border-b border-zinc-950/[0.06] px-2.5 py-2 text-right font-mono text-zinc-500 tabular-nums">
                      {t}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <Num label="Flights from airport A" value={aTotal} max={100} onChange={setATotal} />
            <Num label="…of which late" value={aLate} max={aTotal} onChange={setALate} />
            <Num label="Late flights from airport B" value={bLate} max={bTotal} onChange={setBLate} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The independence test
            </div>
            <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
              {`P(A)          = ${aTotal}/100 = ${pA.toFixed(3)}
P(late)       = ${late}/100 = ${pLate.toFixed(3)}
P(A ∩ late)   = ${aLate}/100 = ${pBoth.toFixed(3)}
P(A)·P(late)  = ${product.toFixed(3)}`}
            </div>
          </div>
          <Verdict ok={independent}>
            {independent
              ? 'The two sides match exactly, so departing from A and departing late are independent.'
              : 'The two sides differ, so which airport you fly from does change how likely a delay is.'}
          </Verdict>
          <ReadOut
            label="P(late | from A)"
            value={lateGivenA === null ? '—' : lateGivenA.toFixed(3)}
            note={`Compare with P(late) = ${pLate.toFixed(3)}. Independence is exactly these two agreeing.`}
          />
          <Btn
            primary
            onClick={() => {
              setATotal(45)
              setALate(9)
              setBLate(11)
            }}
          >
            The slides’ numbers
          </Btn>
        </div>
      </div>
    </LabBox>
  )
}
