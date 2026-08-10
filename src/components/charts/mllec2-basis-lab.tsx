'use client'

/**
 * Lecture 2, parts 14 to 17 — generating set, span, basis, dimension, and the
 * example the deck leaves hanging on its last slide.
 *
 * The last lab is the one that matters most. Slide 41 poses a question and the
 * deck stops there, so the answer on this page is worked out here — the
 * elimination runs in exact fractions on every render, and the redundant
 * vector is rebuilt from the others and compared component by component. If
 * the arithmetic ever stopped agreeing, the page would say so instead of
 * printing the old answer.
 */

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelNote, ReadOut, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { fr, frStr, type Fr } from '@/lib/model/fraction'
import { detM, inverseOf, mulM, rrefOf, toFr, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

const TEAL = '#0d9488'
const ORANGE = '#d97706'
const RED = '#dc2626'
const SPAN = 5
const snap = (v: number) => Math.round(v * 2) / 2
const num = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2))

type Pt = { x: number; y: number }

/* ========================================================================== */
/* Part 14 — generating set and span                                          */
/* ========================================================================== */

export function SpanLab() {
  const [g1, setG1] = useState<Pt>({ x: 2, y: 1 })
  const [g2, setG2] = useState<Pt>({ x: -1, y: 2 })
  const [third, setThird] = useState(false)

  const det = g1.x * g2.y - g1.y * g2.x
  const g1Zero = Math.abs(g1.x) < 1e-9 && Math.abs(g1.y) < 1e-9
  const g2Zero = Math.abs(g2.x) < 1e-9 && Math.abs(g2.y) < 1e-9

  // The dimension of the span, worked out from the vectors rather than stored.
  const spanDim = Math.abs(det) > 1e-9 ? 2 : g1Zero && g2Zero ? 0 : 1
  const count = third ? 3 : 2
  const generates = spanDim === 2
  // A generating set is minimal — and therefore a basis — when it has no more
  // members than the span has dimensions.
  const minimal = generates && count === spanDim

  // The third generator is deliberately built from the other two, so it can
  // never add reach.
  const g3 = { x: g1.x + g2.x, y: g1.y + g2.y }

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    if (spanDim === 2) {
      g.fillStyle = 'rgba(79,70,229,0.09)'
      g.fillRect(f.L, f.T, f.R - f.L, f.B - f.T)
    } else if (spanDim === 1) {
      const d = g1Zero ? g2 : g1
      g.strokeStyle = 'rgba(79,70,229,0.4)'
      g.lineWidth = 10
      g.beginPath()
      g.moveTo(f.px(-d.x * 20), f.py(-d.y * 20))
      g.lineTo(f.px(d.x * 20), f.py(d.y * 20))
      g.stroke()
    } else {
      g.beginPath()
      g.arc(f.px(0), f.py(0), 8, 0, Math.PI * 2)
      g.fillStyle = 'rgba(79,70,229,0.4)'
      g.fill()
    }

    arrow(g, f.px(0), f.py(0), f.px(g1.x), f.py(g1.y), acc)
    arrow(g, f.px(0), f.py(0), f.px(g2.x), f.py(g2.y), TEAL)
    if (third) arrow(g, f.px(0), f.py(0), f.px(g3.x), f.py(g3.y), ORANGE, 2)

    grip(g, f.px(g1.x), f.py(g1.y), acc)
    grip(g, f.px(g2.x), f.py(g2.y), TEAL)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('x₁', f.px(g1.x) + 9, f.py(g1.y) - 8)
    g.fillText('x₂', f.px(g2.x) + 9, f.py(g2.y) - 8)
    if (third) {
      g.fillStyle = ORANGE
      g.fillText('x₃ = x₁ + x₂', f.px(g3.x) + 9, f.py(g3.y) + 14)
    }
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
          targets={{ ax: g1.x, ay: g1.y, bx: g2.x, by: g2.y }}
          handles={(f) => [
            { id: 'g1', px: f.px(g1.x), py: f.py(g1.y), label: 'The generator x₁' },
            { id: 'g2', px: f.px(g2.x), py: f.py(g2.y), label: 'The generator x₂' },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: clamp(snap(x), -SPAN, SPAN), y: clamp(snap(y), -SPAN, SPAN) }
            if (id === 'g1') setG1(p)
            else setG2(p)
          }}
          caption="Drag the two generators. The shaded region is everything they can reach — line them up and watch the whole plane collapse to a line."
        />
      }
      panel={
        <>
          <ReadOut
            label="span[𝒜]"
            value={spanDim === 2 ? 'the whole plane' : spanDim === 1 ? 'a line' : 'just the origin'}
            note={`dimension ${spanDim}, from ${count} generators`}
            tone={spanDim === 2 ? TEAL : ORANGE}
          />

          <ReadOutGrid
            items={[
              { label: 'x₁', value: `(${num(g1.x)}, ${num(g1.y)})` },
              { label: 'x₂', value: `(${num(g2.x)}, ${num(g2.y)})` },
              { label: 'det', value: num(det) },
              { label: '|𝒜|', value: String(count) },
            ]}
          />

          <label className="flex cursor-pointer items-start gap-2 text-[13px]/[1.5] text-zinc-700">
            <input
              type="checkbox"
              checked={third}
              onChange={(e) => setThird(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer"
            />
            <span>Add a third generator, x₃ = x₁ + x₂</span>
          </label>

          <div className="flex flex-col gap-2">
            <Verdict ok={generates}>
              {generates ? (
                <>𝒜 is a generating set of ℝ²: every vector in the plane is some λ₁x₁ + λ₂x₂.</>
              ) : (
                <>
                  𝒜 is not a generating set of ℝ². It spans {spanDim === 1 ? 'only a line' : 'only the origin'}, so most
                  of the plane is out of reach.
                </>
              )}
            </Verdict>
            <Verdict ok={minimal}>
              {minimal ? (
                <>
                  And it is minimal — remove either one and the span drops to a line. A linearly independent generating
                  set is exactly what slide 34 calls a basis.
                </>
              ) : third && generates ? (
                <>
                  Still a generating set, but no longer minimal: x₃ is already reachable from the other two, so dropping
                  it costs nothing. A generating set with a spare member is not a basis.
                </>
              ) : (
                <>Not minimal, so not a basis.</>
              )}
            </Verdict>
          </div>

          <PanelNote>
            span[𝒜] is the set of <em>all</em> linear combinations of the members of 𝒜 — every mixture, not just the
            ones you happen to try.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Part 15 — three bases of ℝ³, and the four characterisations                */
/* ========================================================================== */

interface BasisChoice {
  id: string
  label: string
  cols: Fr[][]
  note: string
}

/** Slide 36's three bases, written as exact fractions so nothing rounds. */
const BASES: BasisChoice[] = [
  {
    id: 'canon',
    label: 'The canonical basis',
    cols: [
      [fr(1), fr(0), fr(0)],
      [fr(0), fr(1), fr(0)],
      [fr(0), fr(0), fr(1)],
    ],
    note: 'The obvious one. Its coordinates are the components themselves, which is exactly why it feels like it is not a choice at all.',
  },
  {
    id: 'stair',
    label: 'The staircase basis',
    cols: [
      [fr(1), fr(0), fr(0)],
      [fr(1), fr(1), fr(0)],
      [fr(1), fr(1), fr(1)],
    ],
    note: 'Slide 36’s second example. Same space, completely different coordinates for the same vector.',
  },
  {
    id: 'odd',
    label: 'The awkward basis',
    cols: [
      [fr(1, 2), fr(4, 5), fr(2, 5)],
      [fr(9, 5), fr(3, 10), fr(3, 10)],
      [fr(-11, 5), fr(-33, 10), fr(3, 2)],
    ],
    note: 'Slide 36’s third example, the one with no pattern to it. It is still a basis — nothing about the definition asks a basis to look tidy.',
  },
]

export function BasisLab() {
  const [pick, setPick] = useState('canon')
  const [v, setV] = useState([2, -1, 3])

  const choice = BASES.find((b) => b.id === pick)!
  // Columns are the basis vectors, so B c = v and c holds the coordinates.
  const B: FMat = [0, 1, 2].map((i) => choice.cols.map((col) => col[i]))
  const det = detM(B)
  const isBasis = det !== null && det.n !== 0

  const inv = inverseOf(B)
  const coords = inv
    ? mulM(
        inv,
        v.map((x) => [fr(x)])
      )
    : null

  // Rebuild v from the coordinates, to prove the coordinates are right rather
  // than to assert it.
  const rebuilt = coords ? mulM(B, coords) : null
  const rebuiltOk = rebuilt !== null && rebuilt.every((row, i) => row[0].n === v[i] * row[0].d)

  // Slide 35's "maximal independent set": add v as a fourth column and the
  // rank cannot go up, because three vectors already span the whole space.
  const withV: FMat = B.map((row, i) => [...row, fr(v[i])])
  const rank3 = rrefOf(B).rank
  const rank4 = rrefOf(withV).rank

  return (
    <LabBox>
      <Presets items={BASES.map((b) => ({ id: b.id, label: b.label }))} at={pick} onPick={setPick} />

      <div className="flex flex-wrap items-start gap-5 overflow-x-auto">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            B — the basis vectors as columns
          </div>
          <FrBox m={B} width={56} />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The vector to write down
          </div>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {v.map((x, i) => (
              <input
                key={i}
                value={x}
                inputMode="numeric"
                aria-label={`vector component ${i + 1}`}
                onChange={(e) => {
                  const raw = e.target.value.trim()
                  const n = raw === '' || raw === '-' ? 0 : Number(raw)
                  if (Number.isFinite(n)) setV((old) => old.map((o, j) => (j === i ? n : o)))
                }}
                className="w-[56px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none hover:bg-zinc-950/[0.04]"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Its coordinates in this basis
          </div>
          {coords ? <FrBox m={coords} width={56} tone="var(--acc)" /> : <PanelNote>No unique answer.</PanelNote>}
        </div>
      </div>

      {coords && (
        <div className="overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-zinc-700">
          v = {coords.map((c, i) => `${i > 0 ? ' + ' : ''}(${frStr(c[0])})b${'₁₂₃'[i]}`).join('')} ={' '}
          {rebuilt ? `(${rebuilt.map((r) => frStr(r[0])).join(', ')})` : ''} {rebuiltOk ? '✓ checked' : '✗ mismatch'}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {[
          {
            name: 'B is a basis of ℝ³',
            ok: isBasis,
            live: `det B = ${det ? frStr(det) : '—'}, so the three columns are ${isBasis ? '' : 'not '}independent.`,
          },
          {
            name: 'B is a minimal generating set',
            ok: isBasis && rank3 === 3,
            live: `rank B = ${rank3}. Three vectors reaching a three-dimensional space cannot have a spare among them.`,
          },
          {
            name: 'B is a maximal independent set',
            ok: isBasis && rank4 === 3,
            live: `Add the vector above as a fourth column and the rank stays ${rank4} — anything you add is already reachable, so the set becomes dependent.`,
          },
          {
            name: 'Every vector is a unique combination',
            ok: rebuiltOk,
            live: rebuiltOk
              ? 'The coordinates above rebuild the vector exactly, and being invertible means B c = v has exactly one solution.'
              : 'No unique set of coordinates here.',
          },
        ].map((row) => (
          <div
            key={row.name}
            className="rounded-lg border px-3.5 py-2.5"
            style={
              row.ok
                ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)' }
                : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }
            }
          >
            <div className="text-[13px] font-semibold" style={{ color: row.ok ? '#115e59' : '#991b1b' }}>
              {row.ok ? '✓' : '✗'} {row.name}
            </div>
            <div className="mt-0.5 text-[12.5px]/[1.6] text-zinc-700">{row.live}</div>
          </div>
        ))}
      </div>

      <LabNote>
        {choice.note} Slide 35 says these four statements are equivalent — switch basis and watch all four move
        together, and watch the coordinates change while the vector itself does not.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — dimension is not the number of components                        */
/* ========================================================================== */

interface SubspaceChoice {
  id: string
  label: string
  name: string
  /** The basis of the subspace, as vectors in ℝ². */
  basis: Pt[]
}

const SUBSPACES: SubspaceChoice[] = [
  {
    id: 'deck',
    label: 'span{(0, 1)}',
    name: 'The deck’s own example on slide 39',
    basis: [{ x: 0, y: 1 }],
  },
  { id: 'slant', label: 'span{(2, 1)}', name: 'A slanted line through the origin', basis: [{ x: 2, y: 1 }] },
  {
    id: 'plane',
    label: 'span{(1, 0), (0, 1)}',
    name: 'The whole plane',
    basis: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
  },
  { id: 'zero', label: 'span{ } = {0}', name: 'The smallest subspace there is', basis: [] },
]

export function DimensionLab() {
  const [pick, setPick] = useState('deck')
  const [t, setT] = useState(2)
  const [s, setS] = useState(1)

  const sub = SUBSPACES.find((x) => x.id === pick)!
  const dim = sub.basis.length

  // The point is built from the basis and the coordinates — never stored, so it
  // can never sit off the subspace it is supposed to be in.
  const point = sub.basis.reduce(
    (acc, b, i) => {
      const c = i === 0 ? t : s
      return { x: acc.x + c * b.x, y: acc.y + c * b.y }
    },
    { x: 0, y: 0 }
  )

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    if (dim === 2) {
      g.fillStyle = 'rgba(79,70,229,0.09)'
      g.fillRect(f.L, f.T, f.R - f.L, f.B - f.T)
    } else if (dim === 1) {
      const b = sub.basis[0]
      g.strokeStyle = 'rgba(79,70,229,0.4)'
      g.lineWidth = 10
      g.beginPath()
      g.moveTo(f.px(-b.x * 20), f.py(-b.y * 20))
      g.lineTo(f.px(b.x * 20), f.py(b.y * 20))
      g.stroke()
    }

    for (const b of sub.basis) arrow(g, f.px(0), f.py(0), f.px(b.x), f.py(b.y), TEAL, 2)
    arrow(g, f.px(0), f.py(0), f.px(point.x), f.py(point.y), acc, 3)
    grip(g, f.px(point.x), f.py(point.y), acc)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('v', f.px(point.x) + 10, f.py(point.y) - 8)
    return f
  }

  /** Drag lands on the nearest point of the subspace, in its own coordinates. */
  function place(x: number, y: number) {
    if (dim === 0) return
    const b0 = sub.basis[0]
    if (dim === 1) {
      const len2 = b0.x * b0.x + b0.y * b0.y
      setT(clamp(snap((x * b0.x + y * b0.y) / len2), -SPAN, SPAN))
      return
    }
    setT(clamp(snap(x), -SPAN, SPAN))
    setS(clamp(snap(y), -SPAN, SPAN))
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={370}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ px: point.x, py: point.y }}
          jumpKey={pick}
          handles={(f) => [
            {
              id: 'p',
              px: f.px(point.x),
              py: f.py(point.y),
              grab: 'anywhere',
              label: 'A vector in the subspace — press anywhere and it slides to the nearest point of it',
            },
          ]}
          onDragTo={(_id, x, y) => place(x, y)}
          caption="Press anywhere on the plot. The arrow can never leave the shaded subspace — that is the whole point."
        />
      }
      panel={
        <>
          <Presets items={SUBSPACES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />
          <PanelNote>{sub.name}</PanelNote>

          <ReadOutGrid
            items={[
              { label: 'the vector v', value: `(${num(point.x)}, ${num(point.y)})` },
              { label: 'components', value: '2' },
              { label: 'dim(𝒰)', value: String(dim) },
              { label: 'numbers needed', value: String(dim) },
            ]}
          />

          <Verdict ok={dim < 2}>
            {dim === 0 ? (
              <>
                Every vector here has two components and there is only one vector — the zero vector. dim = 0, and the
                basis is the empty set.
              </>
            ) : dim === 1 ? (
              <>
                Two components, one dimension. You need two numbers to write v down in the usual way, but only{' '}
                <strong>one</strong> number — the coordinate {num(t)} — to say which vector of this subspace it is. That
                gap is what dimension measures.
              </>
            ) : (
              <>
                Here the two do agree: two components and two dimensions. That agreement is the special case, not the
                rule, and it is why slide 39 goes out of its way to warn about it.
              </>
            )}
          </Verdict>

          <LabNote>
            dim(𝒰) counts the vectors in a basis of 𝒰, not the numbers inside each vector. Slide 38 adds the rest: 𝒰 ⊆ 𝒱
            forces dim(𝒰) ≤ dim(𝒱), and the two are equal only when 𝒰 is the whole of 𝒱.
          </LabNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Part 17 — finding a basis, and slide 41's unanswered example               */
/* ========================================================================== */

/** Slide 41's four spanning vectors of 𝒰 ⊆ ℝ⁵. */
const X5: number[][] = [
  [1, 2, -1, -1, -1],
  [2, -1, 1, 2, -2],
  [3, -4, 3, 5, -3],
  [-1, 8, -5, -6, 1],
]

const STEPS = [
  'Write the spanning vectors as the columns of a matrix A.',
  'Work out the row-echelon form of A.',
  'The spanning vectors at the pivot columns are a basis of 𝒰.',
]

export function FindBasisLab() {
  const [step, setStep] = useState(0)

  // Columns are x₁ … x₄, rows are the five components.
  const A: FMat = toFr([0, 1, 2, 3, 4].map((i) => X5.map((x) => x[i])))
  const { R, ref, pivots, rank } = rrefOf(A)

  const basisIdx = pivots
  const freeIdx = [0, 1, 2, 3].filter((j) => !pivots.includes(j))
  const independent = rank === 4

  /**
   * A non-pivot column of the reduced form reads off directly as a recipe for
   * that spanning vector in terms of the pivot ones. Rebuilt component by
   * component below, then compared against the original.
   */
  const recipes = freeIdx.map((j) => {
    const coeffs = basisIdx.map((_, r) => R[r][j])
    const rebuilt = [0, 1, 2, 3, 4].map((i) =>
      basisIdx.reduce((sum, b, r) => sum + (coeffs[r].n / coeffs[r].d) * X5[b][i], 0)
    )
    const matches = rebuilt.every((v, i) => Math.abs(v - X5[j][i]) < 1e-9)
    return { j, coeffs, rebuilt, matches }
  })

  const allChecked = recipes.length > 0 && recipes.every((r) => r.matches)

  return (
    <LabBox>
      <div className="flex flex-col gap-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left hover:bg-zinc-950/[0.02]"
            style={
              step >= i
                ? { borderColor: 'var(--acc)', background: 'var(--acc-12)' }
                : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff' }
            }
          >
            <span
              className="mt-px grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
              style={
                step >= i
                  ? { background: 'var(--acc)', color: '#fff' }
                  : { background: 'rgba(9,9,11,0.06)', color: '#71717a' }
              }
            >
              {i + 1}
            </span>
            <span className="text-[13px]/[1.6] text-zinc-800">{s}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-5 overflow-x-auto">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            A — x₁ x₂ x₃ x₄ as columns
          </div>
          <FrBox m={A} width={46} />
        </div>
        {step >= 1 && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Row-echelon form
            </div>
            <FrBox m={ref} width={46} />
          </div>
        )}
        {step >= 2 && (
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Reduced, to read the recipe off
            </div>
            <FrBox m={R} width={46} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn primary onClick={() => setStep((s) => Math.min(s + 1, 2))} disabled={step === 2}>
          {step === 0 ? 'Eliminate' : step === 1 ? 'Read off the pivots' : 'Done'}
        </Btn>
        <Btn onClick={() => setStep(0)} disabled={step === 0}>
          Back to the start
        </Btn>
      </div>

      {step >= 2 && (
        <>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Which spanning vectors got a pivot
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((j) => (
                <Chip
                  key={j}
                  on={pivots.includes(j)}
                  label={`x${'₁₂₃₄'[j]}${pivots.includes(j) ? ' · in the basis' : ' · redundant'}`}
                />
              ))}
            </div>
          </div>

          <ReadOutGrid
            items={[
              { label: 'rank A', value: String(rank) },
              { label: 'dim 𝒰', value: String(rank) },
              { label: 'vectors given', value: '4' },
              { label: 'a basis?', value: independent ? 'yes' : 'no' },
            ]}
          />

          <Verdict ok={independent}>
            {independent ? (
              <>All four columns are pivot columns, so x₁, x₂, x₃, x₄ are independent and do form a basis of 𝒰.</>
            ) : (
              <>
                The deck asks whether x₁, x₂, x₃, x₄ are a basis of 𝒰 and stops there. The answer is <strong>no</strong>
                : elimination gives rank {rank}, with pivots in columns {pivots.map((p) => p + 1).join(', ')}. So {'{'}
                {basisIdx.map((b) => `x${'₁₂₃₄'[b]}`).join(', ')}
                {'}'} is a basis of 𝒰, dim 𝒰 = {rank}, and the remaining vector is already reachable from the others.
              </>
            )}
          </Verdict>

          {recipes.map((r) => (
            <div key={r.j} className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
              <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                Checking the redundant one by substituting back
              </div>
              <div className="overflow-x-auto font-mono text-[12.5px]/[1.8] whitespace-pre text-zinc-800">
                {`x${'₁₂₃₄'[r.j]} = ${basisIdx.map((b, i) => `${i > 0 ? ' + ' : ''}(${frStr(r.coeffs[i])})·x${'₁₂₃₄'[b]}`).join('')}\n\n` +
                  basisIdx.map((b, i) => `  (${frStr(r.coeffs[i])})·(${X5[b].join(', ')})\n`).join('') +
                  `\n  gives  (${r.rebuilt.map((v) => (Object.is(v, -0) ? 0 : v)).join(', ')})\n` +
                  `  and x${'₁₂₃₄'[r.j]} is  (${X5[r.j].join(', ')})`}
              </div>
              <div className="mt-2">
                <Verdict ok={r.matches}>
                  {r.matches
                    ? 'All five components agree, so the recipe is right. This is the check, not a claim — the numbers above were rebuilt from the basis vectors just now.'
                    : 'The rebuilt vector does not match. Do not trust this answer.'}
                </Verdict>
              </div>
            </div>
          ))}

          {allChecked && (
            <LabNote>
              The slides give no answer to this one, so it was worked out here and checked by substitution. Note what
              elimination did <em>not</em> do: it never said x₃ was the “wrong” vector. Pivots go to the leftmost
              columns that earn them, so {'{'}x₁, x₂, x₄{'}'} is <em>a</em> basis, not <em>the</em> basis.
            </LabNote>
          )}
        </>
      )}
    </LabBox>
  )
}
