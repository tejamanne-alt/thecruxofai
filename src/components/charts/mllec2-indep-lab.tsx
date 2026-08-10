'use client'

/**
 * Lecture 2, parts 7 to 13 — linear combination, independence, and the
 * elimination that decides it.
 *
 * Every matrix printed here is computed by applying row operations to the
 * starting matrix, never typed in as an answer. Where the deck prints the
 * result, the lab compares its own working against the deck's printed matrix
 * and says whether they agree, so the page cannot quietly drift away from the
 * slides later.
 */

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelNote, RangeInput, ReadOut, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { fr, frAdd, frMul, type Fr } from '@/lib/model/fraction'
import { cloneM, mulM, rrefOf, toFr, type FMat } from '@/lib/model/matrix'
import { useMemo, useState } from 'react'

const TEAL = '#0d9488'
const ORANGE = '#d97706'
const RED = '#dc2626'
const SPAN = 5
const snap = (v: number) => Math.round(v * 2) / 2
const num = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2))
const vec = (x: number, y: number) => `(${num(x)}, ${num(y)})`

type Pt = { x: number; y: number }

/* ========================================================================== */
/* Part 7 — linear combination: what can you reach?                           */
/* ========================================================================== */

const GENERATORS: Array<{ id: string; label: string; a: Pt; b: Pt; note: string }> = [
  {
    id: 'indep',
    label: 'Two features that disagree',
    a: { x: 2, y: 1 },
    b: { x: -1, y: 2 },
    note: 'These two point in genuinely different directions, so mixing them reaches every point of the plane. Exactly one mixture reaches any given target.',
  },
  {
    id: 'dep',
    label: 'One feature recorded twice',
    a: { x: 2, y: 1 },
    b: { x: 4, y: 2 },
    note: 'The second is twice the first — the same measurement in different units. Every mixture lands on one line, so most targets can never be reached, and the ones that can be reached can be reached in endlessly many ways.',
  },
  {
    id: 'near',
    label: 'Two features that nearly agree',
    a: { x: 2, y: 1 },
    b: { x: 2.5, y: 1.5 },
    note: 'Not on the slides. These are independent, so every target is reachable — but the coefficients get large and jumpy, which is what near-collinear features do to a fitted model.',
  },
]

export function ReachLab() {
  const [pick, setPick] = useState('indep')
  const [l1, setL1] = useState(1)
  const [l2, setL2] = useState(1)
  const [target, setTarget] = useState<Pt>({ x: 3, y: 3 })

  const gen = GENERATORS.find((g) => g.id === pick)!
  const { a, b } = gen

  const combo = { x: l1 * a.x + l2 * b.x, y: l1 * a.y + l2 * b.y }
  const gap = Math.hypot(combo.x - target.x, combo.y - target.y)
  const hit = gap < 1e-9

  // The 2 × 2 determinant decides whether a mixture exists at all.
  const det = a.x * b.y - a.y * b.x
  const spans = Math.abs(det) > 1e-9

  // Cramer's rule, worked out here rather than remembered.
  const solved = spans
    ? { l1: (target.x * b.y - target.y * b.x) / det, l2: (a.x * target.y - a.y * target.x) / det }
    : null

  // With a dependent pair, the target is reachable only if it lies on the line
  // the pair spans.
  const onLine = !spans && Math.abs(a.x * target.y - a.y * target.x) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // Shade what the pair can reach: the whole plane, or one line.
    if (spans) {
      g.fillStyle = 'rgba(79,70,229,0.07)'
      g.fillRect(f.L, f.T, f.R - f.L, f.B - f.T)
    } else {
      g.strokeStyle = 'rgba(79,70,229,0.35)'
      g.lineWidth = 10
      g.beginPath()
      g.moveTo(f.px(-a.x * 20), f.py(-a.y * 20))
      g.lineTo(f.px(a.x * 20), f.py(a.y * 20))
      g.stroke()
    }

    // The two scaled generators, laid nose to tail, so the mixture is visibly a mixture.
    const s1 = { x: l1 * a.x, y: l1 * a.y }
    g.setLineDash([5, 4])
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(s1.x), f.py(s1.y))
    g.lineTo(f.px(combo.x), f.py(combo.y))
    g.stroke()
    g.setLineDash([])

    arrow(g, f.px(0), f.py(0), f.px(a.x), f.py(a.y), acc)
    arrow(g, f.px(0), f.py(0), f.px(b.x), f.py(b.y), TEAL)
    arrow(g, f.px(0), f.py(0), f.px(combo.x), f.py(combo.y), hit ? '#16a34a' : ORANGE, 3)

    // The target, drawn as a ring so it never looks like an arrow.
    g.beginPath()
    g.arc(f.px(target.x), f.py(target.y), 9, 0, Math.PI * 2)
    g.strokeStyle = RED
    g.lineWidth = 2.5
    g.stroke()
    grip(g, f.px(target.x), f.py(target.y), RED, 3)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('x₁', f.px(a.x) + 9, f.py(a.y) - 8)
    g.fillText('x₂', f.px(b.x) + 9, f.py(b.y) - 8)
    g.fillText('λ₁x₁ + λ₂x₂', f.px(combo.x) + 9, f.py(combo.y) + 14)
    g.fillStyle = RED
    g.fillText('target', f.px(target.x) + 13, f.py(target.y) - 10)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ cx: combo.x, cy: combo.y, tx: target.x, ty: target.y }}
          jumpKey={pick}
          handles={(f) => [
            {
              id: 't',
              px: f.px(target.x),
              py: f.py(target.y),
              grab: 'anywhere',
              label: 'The target vector — press anywhere on the plot to move it',
            },
          ]}
          onDragTo={(_id, x, y) => setTarget({ x: clamp(snap(x), -SPAN, SPAN), y: clamp(snap(y), -SPAN, SPAN) })}
          caption="Press anywhere to move the red target. The two sliders mix x₁ and x₂; the orange arrow is the mixture, and it turns green when it lands exactly on the target."
        />
      }
      panel={
        <>
          <Presets items={GENERATORS.map((g) => ({ id: g.id, label: g.label }))} at={pick} onPick={setPick} />

          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>λ₁</span>
              <span className="text-zinc-500">{num(l1)}</span>
            </div>
            <RangeInput label="λ₁" value={l1} min={-3} max={3} step={0.25} onChange={setL1} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>λ₂</span>
              <span className="text-zinc-500">{num(l2)}</span>
            </div>
            <RangeInput label="λ₂" value={l2} min={-3} max={3} step={0.25} onChange={setL2} />
          </div>

          <ReadOutGrid
            items={[
              { label: 'mixture', value: vec(combo.x, combo.y) },
              { label: 'target', value: vec(target.x, target.y) },
              { label: 'gap', value: num(gap) },
              { label: 'det', value: num(det) },
            ]}
          />

          {solved ? (
            <>
              <Btn
                primary
                onClick={() => {
                  setL1(solved.l1)
                  setL2(solved.l2)
                }}
              >
                Solve it: λ = ({num(solved.l1)}, {num(solved.l2)})
              </Btn>
              <PanelNote>
                The determinant is {num(det)}, which is not zero, so exactly one pair of coefficients reaches this
                target — and every other target too. That is what makes these two a basis of the plane.
              </PanelNote>
            </>
          ) : (
            <Verdict ok={onLine}>
              {onLine ? (
                <>
                  The target happens to sit on the line, so it is reachable — but in endlessly many ways, because you
                  can always add a bit of x₁ and take the same amount off x₂ in disguise.
                </>
              ) : (
                <>
                  The determinant is 0, so every mixture lands on the shaded line and this target is out of reach. No
                  slider setting will ever close the gap.
                </>
              )}
            </Verdict>
          )}

          <LabNote>{gen.note}</LabNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Part 8 — linear (in)dependence, and the three facts of slide 17            */
/* ========================================================================== */

export function IndependenceLab() {
  const [v1, setV1] = useState<Pt>({ x: 3, y: 1 })
  const [v2, setV2] = useState<Pt>({ x: -1, y: 2 })
  const [withZero, setWithZero] = useState(false)

  const det = v1.x * v2.y - v1.y * v2.x
  const parallel = Math.abs(det) < 1e-9
  const v1Zero = Math.abs(v1.x) < 1e-9 && Math.abs(v1.y) < 1e-9
  const v2Zero = Math.abs(v2.x) < 1e-9 && Math.abs(v2.y) < 1e-9
  const anyZero = v1Zero || v2Zero || withZero

  // The zero vector in the set forces dependence whatever the others do.
  const independent = !withZero && !parallel

  // When they are parallel and v1 is not zero, v2 is a multiple of v1 — and
  // this is the multiple, worked out from whichever component is non-zero.
  const ratio = !v1Zero ? (Math.abs(v1.x) > 1e-9 ? v2.x / v1.x : v2.y / v1.y) : null

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    if (parallel && !v1Zero) {
      g.strokeStyle = 'rgba(220,38,38,0.28)'
      g.lineWidth = 10
      g.beginPath()
      g.moveTo(f.px(-v1.x * 20), f.py(-v1.y * 20))
      g.lineTo(f.px(v1.x * 20), f.py(v1.y * 20))
      g.stroke()
    }

    arrow(g, f.px(0), f.py(0), f.px(v1.x), f.py(v1.y), acc)
    arrow(g, f.px(0), f.py(0), f.px(v2.x), f.py(v2.y), TEAL)
    grip(g, f.px(v1.x), f.py(v1.y), acc)
    grip(g, f.px(v2.x), f.py(v2.y), TEAL)

    if (withZero) {
      g.beginPath()
      g.arc(f.px(0), f.py(0), 8, 0, Math.PI * 2)
      g.fillStyle = ORANGE
      g.fill()
      g.fillStyle = ORANGE
      g.textAlign = 'left'
      g.fillText('x₃ = 0', f.px(0) + 12, f.py(0) + 16)
    }

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('x₁', f.px(v1.x) + 9, f.py(v1.y) - 8)
    g.fillText('x₂', f.px(v2.x) + 9, f.py(v2.y) - 8)
    return f
  }

  const facts: Array<{ text: React.ReactNode; live: string }> = [
    {
      text: (
        <>
          There is no third option. A set of vectors is either linearly independent or linearly dependent, never
          somewhere in between.
        </>
      ),
      live: independent ? 'Right now: independent.' : 'Right now: dependent.',
    },
    {
      text: (
        <>
          If any one of them is the zero vector, the set is dependent. Give the zero vector a coefficient of 1 and every
          other vector a coefficient of 0 — that is a non-trivial combination reaching 0.
        </>
      ),
      live: anyZero
        ? 'A zero vector is in the set, so the set is dependent whatever the others do.'
        : 'No zero vector in the set, so this fact does not decide anything here.',
    },
    {
      text: (
        <>
          If none of them is zero, they are dependent exactly when one of them is a linear combination of the others.
          That one is carrying nothing the rest do not already carry.
        </>
      ),
      live:
        !anyZero && parallel && ratio !== null
          ? `x₂ = ${num(ratio)} × x₁, so x₂ adds nothing. Drop it and you lose no reach at all.`
          : !anyZero
            ? 'Neither is a multiple of the other, so each one reaches somewhere the other cannot.'
            : 'Turn the zero vector off to test this one.',
    },
  ]

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ ax: v1.x, ay: v1.y, bx: v2.x, by: v2.y }}
          handles={(f) => [
            { id: 'v1', px: f.px(v1.x), py: f.py(v1.y), label: 'The vector x₁' },
            { id: 'v2', px: f.px(v2.x), py: f.py(v2.y), label: 'The vector x₂' },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: clamp(snap(x), -SPAN, SPAN), y: clamp(snap(y), -SPAN, SPAN) }
            if (id === 'v1') setV1(p)
            else setV2(p)
          }}
          caption="Drag either arrow onto the other one's line and watch the verdict flip. The red band appears the moment they are parallel."
        />
      }
      panel={
        <>
          <ReadOut
            label="Are they independent?"
            value={independent ? 'Yes' : 'No'}
            note={
              withZero
                ? 'the zero vector is in the set'
                : parallel
                  ? 'they lie on one line'
                  : 'they point genuinely different ways'
            }
            tone={independent ? TEAL : RED}
          />

          <ReadOutGrid
            items={[
              { label: 'x₁', value: vec(v1.x, v1.y) },
              { label: 'x₂', value: vec(v2.x, v2.y) },
              { label: 'det', value: num(det) },
              { label: 'rank', value: String(withZero || parallel ? (v1Zero && v2Zero ? 0 : 1) : 2) },
            ]}
          />

          <label className="flex cursor-pointer items-start gap-2 text-[13px]/[1.5] text-zinc-700">
            <input
              type="checkbox"
              checked={withZero}
              onChange={(e) => setWithZero(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer"
            />
            <span>Add the zero vector as a third member of the set</span>
          </label>

          <div className="flex flex-col gap-2">
            {facts.map((f, i) => (
              <div key={i} className="rounded-lg border border-zinc-950/10 bg-white px-3 py-2.5">
                <div className="text-[12.5px]/[1.6] text-zinc-700">{f.text}</div>
                <div className="mt-1 text-[12px]/[1.5] font-semibold" style={{ color: 'var(--acc)' }}>
                  {f.live}
                </div>
              </div>
            ))}
          </div>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Row operations on exact fractions, shared by the two elimination labs      */
/* ========================================================================== */

type Move =
  | { kind: 'swap'; i: number; j: number; note: string }
  | { kind: 'scale'; i: number; k: Fr; note: string }
  | { kind: 'addMul'; i: number; j: number; k: Fr; note: string }

function applyMove(m: FMat, mv: Move): FMat {
  const R = cloneM(m)
  if (mv.kind === 'swap') {
    const t = R[mv.i]
    R[mv.i] = R[mv.j]
    R[mv.j] = t
  } else if (mv.kind === 'scale') {
    R[mv.i] = R[mv.i].map((v) => frMul(v, mv.k))
  } else {
    R[mv.i] = R[mv.i].map((v, c) => frAdd(v, frMul(mv.k, R[mv.j][c])))
  }
  return R
}

/** Every intermediate matrix, so a step counter can index straight into it. */
function runMoves(start: FMat, moves: Move[]): FMat[] {
  const out = [cloneM(start)]
  for (const mv of moves) out.push(applyMove(out[out.length - 1], mv))
  return out
}

/** Which columns hold a leading entry, read off a staircase. */
function pivotCols(m: FMat): number[] {
  const cols: number[] = []
  let from = 0
  for (const row of m) {
    for (let c = from; c < row.length; c++) {
      if (row[c].n !== 0) {
        cols.push(c)
        from = c + 1
        break
      }
    }
  }
  return cols
}

function sameMatrix(a: FMat, b: FMat) {
  return (
    a.length === b.length &&
    a.every((row, i) => row.length === b[i].length && row.every((v, j) => v.n === b[i][j].n && v.d === b[i][j].d))
  )
}

function PivotStrip({ cols, total }: { cols: number[]; total: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }, (_, c) => (
        <Chip key={c} on={cols.includes(c)} label={`col ${c + 1}${cols.includes(c) ? ' · pivot' : ''}`} />
      ))}
    </div>
  )
}

/* ========================================================================== */
/* Part 9 — the deck's 2 × 3 example                                          */
/* ========================================================================== */

const SMALL = toFr([
  [1, 2, 3],
  [2, 4, 4],
])

const SMALL_MOVES: Move[] = [{ kind: 'addMul', i: 1, j: 0, k: fr(-2), note: 'R2 ← R2 − 2 × R1' }]

/** The row-echelon form slide 19 prints, to check the lab's own working against. */
const SMALL_DECK = toFr([
  [1, 2, 3],
  [0, 0, -2],
])

export function PivotLab() {
  const [step, setStep] = useState(0)
  const [c, setC] = useState(1)

  const frames = useMemo(() => runMoves(SMALL, SMALL_MOVES), [])
  const at = frames[step]
  const done = step === SMALL_MOVES.length
  const cols = pivotCols(at)
  const matchesDeck = done && sameMatrix(at, SMALL_DECK)

  // Column 2 against c × column 1, in the original matrix.
  const col1 = [1, 2]
  const col2 = [2, 4]
  const scaled = col1.map((v) => v * c)
  const equal = scaled.every((v, i) => Math.abs(v - col2[i]) < 1e-9)

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-5">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            {step === 0 ? 'The matrix' : `After ${step} of ${SMALL_MOVES.length}`}
          </div>
          <FrBox m={at} />
        </div>
        <div className="self-center">
          <div className="font-mono text-[12.5px] text-zinc-600">
            {done ? 'row echelon form' : SMALL_MOVES[step].note}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn primary onClick={() => setStep((s) => Math.min(s + 1, SMALL_MOVES.length))} disabled={done}>
          Do the row move
        </Btn>
        <Btn onClick={() => setStep(0)} disabled={step === 0}>
          Back to the start
        </Btn>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Pivot columns</div>
        <PivotStrip cols={cols} total={3} />
      </div>

      {done && (
        <Verdict ok={matchesDeck}>
          {matchesDeck ? (
            <>
              This is the matrix slide 19 prints, worked out here by doing the move rather than by copying it. The
              pivots are in columns 1 and 3, so x₁ and x₃ are the independent ones — and they are on the left, as the
              slide says they always are.
            </>
          ) : (
            <>The working here does not match the matrix printed on slide 19. Do not trust this page until it does.</>
          )}
        </Verdict>
      )}

      <div className="border-t border-zinc-950/[0.08] pt-3">
        <LabNote>
          Slide 19 then says column 2 is a combination of the pivot columns to its left — just twice the first. Find the
          multiple yourself:
        </LabNote>
        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>c, in column 2 = c × column 1</span>
            <span className="text-zinc-500">{c}</span>
          </div>
          <RangeInput label="c, in column 2 = c × column 1" value={c} min={-3} max={3} step={1} onChange={setC} />
        </div>
        <div className="mt-2 font-mono text-[12.5px] text-zinc-700">
          {c} × ({col1.join(', ')}) = ({scaled.join(', ')}) {equal ? '=' : '≠'} ({col2.join(', ')})
        </div>
        {equal && (
          <Verdict ok>
            c = {c}. Column 2 carries nothing column 1 does not already carry, which is exactly why elimination refused
            to give it a pivot.
          </Verdict>
        )}
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — three vectors in ℝ⁴, by two different legal routes               */
/* ========================================================================== */

const FOUR_BY_THREE = toFr([
  [1, 1, -1],
  [2, 1, -2],
  [-3, 0, 1],
  [4, 2, 1],
])

/** Slide 21's printed row-echelon form, for the lab to check itself against. */
const FOUR_DECK = toFr([
  [1, 1, -1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0],
])

const ROUTE_DECK: Move[] = [
  { kind: 'addMul', i: 1, j: 0, k: fr(-2), note: 'R2 ← R2 − 2 × R1' },
  { kind: 'addMul', i: 2, j: 0, k: fr(3), note: 'R3 ← R3 + 3 × R1' },
  { kind: 'addMul', i: 3, j: 0, k: fr(-4), note: 'R4 ← R4 − 4 × R1' },
  { kind: 'scale', i: 1, k: fr(-1), note: 'R2 ← −1 × R2, to make the lead a 1' },
  { kind: 'addMul', i: 2, j: 1, k: fr(-3), note: 'R3 ← R3 − 3 × R2' },
  { kind: 'addMul', i: 3, j: 1, k: fr(2), note: 'R4 ← R4 + 2 × R2' },
  { kind: 'scale', i: 2, k: fr(-1, 2), note: 'R3 ← −½ × R3, to make the lead a 1' },
  { kind: 'addMul', i: 3, j: 2, k: fr(-5), note: 'R4 ← R4 − 5 × R3' },
]

const ROUTE_PLAIN: Move[] = [
  { kind: 'addMul', i: 1, j: 0, k: fr(-2), note: 'R2 ← R2 − 2 × R1' },
  { kind: 'addMul', i: 2, j: 0, k: fr(3), note: 'R3 ← R3 + 3 × R1' },
  { kind: 'addMul', i: 3, j: 0, k: fr(-4), note: 'R4 ← R4 − 4 × R1' },
  { kind: 'addMul', i: 2, j: 1, k: fr(3), note: 'R3 ← R3 + 3 × R2' },
  { kind: 'addMul', i: 3, j: 1, k: fr(-2), note: 'R4 ← R4 − 2 × R2' },
  { kind: 'addMul', i: 3, j: 2, k: fr(5, 2), note: 'R4 ← R4 + 5⁄2 × R3' },
]

export function EliminationRouteLab() {
  const [route, setRoute] = useState<'deck' | 'plain'>('deck')
  const [step, setStep] = useState(0)

  const moves = route === 'deck' ? ROUTE_DECK : ROUTE_PLAIN
  const frames = useMemo(() => runMoves(FOUR_BY_THREE, moves), [moves])
  const at = frames[Math.min(step, moves.length)]
  const done = step >= moves.length
  const cols = pivotCols(at)

  const endDeck = runMoves(FOUR_BY_THREE, ROUTE_DECK).at(-1)!
  const endPlain = runMoves(FOUR_BY_THREE, ROUTE_PLAIN).at(-1)!
  const deckAgrees = sameMatrix(endDeck, FOUR_DECK)
  const samePivots = pivotCols(endDeck).join() === pivotCols(endPlain).join()

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'deck' as const, label: 'The deck’s route (leads scaled to 1)' },
          { id: 'plain' as const, label: 'Plain elimination, nothing scaled' },
        ]}
        at={route}
        onPick={(id) => {
          setRoute(id)
          setStep(0)
        }}
      />

      <div className="flex flex-wrap items-start gap-5">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            {step === 0 ? 'The three vectors as columns' : `After ${Math.min(step, moves.length)} of ${moves.length}`}
          </div>
          <FrBox m={at} width={48} />
        </div>
        <div className="self-center font-mono text-[12.5px] text-zinc-600">
          {done ? 'row echelon form' : moves[step].note}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn primary onClick={() => setStep((s) => Math.min(s + 1, moves.length))} disabled={done}>
          Next row move
        </Btn>
        <Btn onClick={() => setStep(moves.length)} disabled={done}>
          Run the rest
        </Btn>
        <Btn onClick={() => setStep(0)} disabled={step === 0}>
          Back to the start
        </Btn>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Pivot columns</div>
        <PivotStrip cols={cols} total={3} />
      </div>

      {done && (
        <Verdict ok={cols.length === 3}>
          {cols.length === 3 ? (
            <>
              All three columns are pivot columns, so the only way to combine x₁, x₂ and x₃ and reach the zero vector is
              to take all three λs to be zero. The three vectors are linearly independent.
            </>
          ) : (
            <>Only {cols.length} pivot columns, so the vectors are dependent.</>
          )}
        </Verdict>
      )}

      <div className="border-t border-zinc-950/[0.08] pt-3">
        <LabNote>
          The two routes end on different matrices — the deck’s has 1s down the staircase, the plain one has −1 and −2 —
          and both are correct row-echelon forms.{' '}
          {samePivots
            ? 'The pivot columns are the same either way'
            : 'The pivot columns disagree, which should be impossible'}
          , which is why the verdict does not depend on the route you take.{' '}
          {deckAgrees
            ? 'The deck’s route reproduces the matrix printed on slide 21 exactly.'
            : 'Warning: the deck’s route does not reproduce slide 21 here.'}
        </LabNote>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — testing the coefficients instead of the vectors                  */
/* ========================================================================== */

const B_START = [
  [1, 0, 1],
  [1, 1, 0],
  [0, 1, 1],
]
const LAM_START = [
  [1, 0, 2],
  [0, 1, 1],
  [2, 1, 0],
]

export function CoordsLab() {
  const [B, setB] = useState(B_START)
  const [L, setL] = useState(LAM_START)

  const Bf = toFr(B)
  const Lf = toFr(L)
  const Xf = mulM(Bf, Lf)

  const rankB = rrefOf(Bf).rank
  const rankL = rrefOf(Lf).rank
  const rankX = Xf ? rrefOf(Xf).rank : 0

  const bIndep = rankB === 3
  const agree = rankX === rankL

  const edit = (m: number[][], set: (v: number[][]) => void) => (i: number, j: number, v: number) => {
    const next = m.map((r) => [...r])
    next[i][j] = v
    set(next)
  }

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-5 overflow-x-auto">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            B — the b vectors as columns
          </div>
          <NumBox m={B} onEdit={edit(B, setB)} width={46} name="B" />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Λ — the λ vectors as columns
          </div>
          <NumBox m={L} onEdit={edit(L, setL)} width={46} name="Lambda" />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            X = BΛ — the x vectors
          </div>
          {Xf && <FrBox m={Xf} width={46} />}
        </div>
      </div>

      <ReadOutGrid
        items={[
          { label: 'rank B', value: String(rankB) },
          { label: 'rank Λ', value: String(rankL) },
          { label: 'rank X', value: String(rankX) },
          { label: 'x’s independent?', value: rankX === 3 ? 'yes' : 'no' },
        ]}
      />

      <Verdict ok={bIndep && agree}>
        {bIndep ? (
          <>
            The b vectors are independent (rank B = 3), and rank X = rank Λ = {rankL}. That is slide 25 in one line:
            with independent b’s, the x’s are independent exactly when the λ’s are, so you can throw the b’s away and
            test the coefficients instead.
          </>
        ) : (
          <>
            rank B = {rankB}, so the b vectors are <strong>not</strong> independent — and the theorem no longer applies.
            Here rank Λ = {rankL} but rank X = {rankX}. Dependent b’s can collapse independent coefficients, which is
            why slide 22 insists the b’s be independent before any of this starts.
          </>
        )}
      </Verdict>

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setB(B_START)
            setL(LAM_START)
          }}
        >
          Reset both
        </Btn>
        <Btn
          onClick={() =>
            setB([
              [1, 2, 3],
              [1, 2, 3],
              [0, 1, 1],
            ])
          }
        >
          Break B: make its columns dependent
        </Btn>
      </div>

      <LabNote>
        Type into either box. X is never typed — it is B times Λ, recomputed on every keystroke, so the three ranks can
        never disagree with the matrices above them.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — the four-vector example of slides 26 to 29                       */
/* ========================================================================== */

/** Slide 27's four λ vectors, written as the columns of slide 28's matrix A. */
const DECK_A = [
  [1, -4, 2, 17],
  [-2, -2, 3, -10],
  [1, 0, -1, 11],
  [-1, 4, -3, 1],
]

/** The reduced row-echelon form slide 29 prints. */
const DECK_RREF = toFr([
  [1, 0, 0, -7],
  [0, 1, 0, -15],
  [0, 0, 1, -18],
  [0, 0, 0, 0],
])

export function FourXLab() {
  const [psi, setPsi] = useState([1, 0, 0, 0])

  const Af = toFr(DECK_A)
  const { R, pivots, rank } = rrefOf(Af)
  const agrees = sameMatrix(R, DECK_RREF)

  // ψ₁c₁ + ψ₂c₂ + ψ₃c₃ + ψ₄c₄, one row at a time.
  const rowSums = DECK_A.map((row) => row.reduce((s, v, j) => s + v * psi[j], 0))
  const allZero = rowSums.every((v) => Math.abs(v) < 1e-9)
  const trivial = psi.every((v) => v === 0)

  const setAt = (j: number, v: number) => setPsi((p) => p.map((old, i) => (i === j ? v : old)))

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-5 overflow-x-auto">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            A — the four λ vectors as columns (slide 28)
          </div>
          <FrBox m={Af} width={46} />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Reduced row-echelon form
          </div>
          <FrBox m={R} width={46} />
        </div>
      </div>

      <Verdict ok={agrees}>
        {agrees ? (
          <>
            Computed here, and it is the matrix slide 29 prints. Rank {rank}, with pivots in columns{' '}
            {pivots.map((c) => c + 1).join(', ')} — so column 4 has no pivot, and the last column of the reduced form
            reads off the combination that kills it.
          </>
        ) : (
          <>This does not match slide 29. Do not trust the rest of this page until it does.</>
        )}
      </Verdict>

      <div className="border-t border-zinc-950/[0.08] pt-3">
        <LabNote>
          Now try to reach the zero vector with coefficients that are not all zero. Each box is one ψ, and the four
          numbers under them are the four rows of ψ₁c₁ + ψ₂c₂ + ψ₃c₃ + ψ₄c₄.
        </LabNote>

        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3">
          {psi.map((v, j) => (
            <label key={j} className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-semibold text-zinc-950">ψ{'₁₂₃₄'[j]}</span>
              <input
                value={v}
                inputMode="numeric"
                aria-label={`psi ${j + 1}`}
                onChange={(e) => {
                  const raw = e.target.value.trim()
                  const n = raw === '' || raw === '-' ? 0 : Number(raw)
                  if (Number.isFinite(n)) setAt(j, n)
                }}
                className="w-[70px] rounded-md border border-zinc-950/10 bg-white px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none hover:bg-zinc-950/[0.03]"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {DECK_A.map(
            (row, i) =>
              `row ${i + 1}:  ${row.map((v, j) => `${psi[j] < 0 ? '−' : '+'}${Math.abs(psi[j])}(${v})`).join(' ')}  =  ${rowSums[i]}\n`
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn primary onClick={() => setPsi([7, 15, 18, 1])}>
            Load the deck’s answer: 7, 15, 18, 1
          </Btn>
          <Btn onClick={() => setPsi([0, 0, 0, 0])}>All zeros</Btn>
        </div>

        <div className="mt-3">
          <Verdict ok={allZero && !trivial}>
            {allZero && !trivial ? (
              <>
                Every row cancels to 0 with coefficients that are not all zero. That is a non-trivial linear combination
                reaching the zero vector, so x₁, x₂, x₃, x₄ are <strong>not</strong> linearly independent — the
                conclusion of slide 29.
              </>
            ) : trivial ? (
              <>
                All the ψs are zero. That reaches 0, but it always does, for any vectors at all — the trivial
                combination proves nothing.
              </>
            ) : (
              <>
                The rows come to ({rowSums.join(', ')}), not all zero. Keep going, or press the deck’s answer to see the
                combination it found.
              </>
            )}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13 — when the shape alone settles it                                  */
/* ========================================================================== */

export function ShapeLab() {
  const [k, setK] = useState(3)
  const [m, setM] = useState(5)

  // A pivot needs its own row and its own column, so this is the ceiling.
  const maxPivots = Math.min(k, m)
  const forced = m > k
  const freeCols = m - maxPivots

  return (
    <LabBox>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>k — how many independent b vectors</span>
            <span className="text-zinc-500">{k}</span>
          </div>
          <RangeInput label="k, the number of b vectors" value={k} min={1} max={8} step={1} onChange={setK} />
          <p className="mt-1.5 text-xs text-zinc-500">The ingredients. This is the number of rows of the matrix.</p>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>m — how many x vectors you build</span>
            <span className="text-zinc-500">{m}</span>
          </div>
          <RangeInput label="m, the number of x vectors" value={m} min={1} max={8} step={1} onChange={setM} />
          <p className="mt-1.5 text-xs text-zinc-500">The things being tested. This is the number of columns.</p>
        </div>
      </div>

      {/* A schematic of the k × m coefficient matrix: one square per entry. */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
          {Array.from({ length: k }, (_, i) => (
            <div key={i} className="flex gap-1">
              {Array.from({ length: m }, (_, j) => {
                const isPivot = i === j && i < maxPivots
                return (
                  <span
                    key={j}
                    className="size-6 rounded"
                    style={{
                      background: isPivot
                        ? 'var(--acc)'
                        : j >= maxPivots
                          ? 'rgba(220,38,38,0.18)'
                          : 'rgba(9,9,11,0.07)',
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <ReadOutGrid
        items={[
          { label: 'shape', value: `${k} × ${m}` },
          { label: 'pivots, at most', value: String(maxPivots) },
          { label: 'columns with no pivot', value: String(freeCols) },
          { label: 'verdict', value: forced ? 'dependent' : 'undecided' },
        ]}
      />

      <Verdict ok={!forced}>
        {forced ? (
          <>
            m = {m} is bigger than k = {k}, so at least {freeCols} column{freeCols === 1 ? '' : 's'} can never get a
            pivot. Each one is a combination of the pivot columns to its left, which hands you a non-trivial way to
            reach 0. The x vectors are dependent — and you knew it from the shape alone, without looking at a single
            number.
          </>
        ) : (
          <>
            m = {m} is not bigger than k = {k}, so the shape does not decide anything. Every column could get a pivot,
            or not. You have to do the elimination and look.
          </>
        )}
      </Verdict>

      <LabNote>
        A pivot needs a row of its own and a column of its own, so there can never be more than min(k, m) of them. That
        one sentence is the whole of slides 30 and 31 — and it is why more features than samples always leaves a linear
        model with directions it cannot pin down.
      </LabNote>
    </LabBox>
  )
}
