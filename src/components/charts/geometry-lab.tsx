'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawAxes, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const RED = '#dc2626'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(3))

type Pt = { x: number; y: number }
type Mat = [[number, number], [number, number]]

/** ⟨x, y⟩ = xᵀAy — the general inner product this whole lecture is built on. */
const ip = (A: Mat, u: Pt, v: Pt) => u.x * (A[0][0] * v.x + A[0][1] * v.y) + u.y * (A[1][0] * v.x + A[1][1] * v.y)
const nrm = (A: Mat, u: Pt) => Math.sqrt(Math.max(0, ip(A, u, u)))

/**
 * Sylvester's criterion for a 2×2: symmetric, with a positive top-left entry
 * and a positive determinant. Derived here rather than stored, so editing A
 * can never leave a stale verdict on the page.
 */
function spdOf(A: Mat) {
  const symmetric = Math.abs(A[0][1] - A[1][0]) < 1e-12
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
  const posdef = symmetric && A[0][0] > 0 && det > 0
  return { symmetric, det, posdef }
}

const IDENT: Mat = [
  [1, 0],
  [0, 1],
]
const DECK_A: Mat = [
  [2, 0],
  [0, 1],
]

/* ========================================================================== */
/* Part 1 — a vector space cannot measure anything on its own                 */
/* ========================================================================== */

export function GeometryAddsLab() {
  const [on, setOn] = useState(false)
  const [a, setA] = useState<Pt>({ x: 3, y: 1 })
  const [b, setB] = useState<Pt>({ x: -1, y: 2 })

  const dotv = ip(IDENT, a, b)
  const la = nrm(IDENT, a)
  const lb = nrm(IDENT, b)
  const cos = la > 0 && lb > 0 ? dotv / (la * lb) : 0
  const deg = (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    if (on) {
      // the angle wedge, drawn only once there is an inner product to define it
      const aA = Math.atan2(a.y, a.x)
      const aB = Math.atan2(b.y, b.x)
      g.fillStyle = 'rgba(13,148,136,0.18)'
      g.beginPath()
      g.moveTo(f.px(0), f.py(0))
      g.arc(f.px(0), f.py(0), 46, -aA, -aB, aB > aA ? false : true)
      g.closePath()
      g.fill()
    }
    arrow(g, f.px(0), f.py(0), f.px(a.x), f.py(a.y), acc, 3)
    arrow(g, f.px(0), f.py(0), f.px(b.x), f.py(b.y), ORANGE, 3)
    grip(g, f.px(a.x), f.py(a.y), acc, 7)
    grip(g, f.px(b.x), f.py(b.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!on} label="vector space only" onClick={() => setOn(false)} />
        <Chip on={on} label="with an inner product" onClick={() => setOn(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={String(on)}
          handles={(f) => [
            { id: 'a', px: f.px(a.x), py: f.py(a.y) },
            { id: 'b', px: f.px(b.x), py: f.py(b.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) }
            if (id === 'a') setA(p)
            else setB(p)
          }}
          caption="The same two arrows both ways round. Only the right-hand switch lets the page say anything about size or angle."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'a', value: `(${fmt(a.x)}, ${fmt(a.y)})` },
              { label: 'b', value: `(${fmt(b.x)}, ${fmt(b.y)})` },
              { label: 'a + b', value: `(${fmt(a.x + b.x)}, ${fmt(a.y + b.y)})` },
              { label: '2a', value: `(${fmt(2 * a.x)}, ${fmt(2 * a.y)})` },
              { label: 'how long is a?', value: on ? fmt(la) : 'no answer' },
              { label: 'angle between?', value: on ? `${deg.toFixed(1)}°` : 'no answer' },
            ]}
          />
          <PanelNote>
            The first four rows are everything a plain vector space can tell you: which vectors you get by adding and by
            stretching. They keep working however you drag. The last two need an inner product, and without one they
            have no answer at all.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        This is worth pausing on. Lecture 2 gave you adding and stretching, and that was enough for span, independence,
        basis and dimension — a great deal of structure with no ruler and no protractor anywhere in it. Analytic
        geometry is the lecture that hands you both.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Parts 5 and 6 — what makes a mapping an inner product, and ⟨x,y⟩ = x̂ᵀAŷ    */
/* ========================================================================== */

const A_PRESETS: Array<{ id: string; label: string; A: Mat; note: string }> = [
  {
    id: 'dot',
    label: 'A = I — the plain dot product',
    A: IDENT,
    note: 'The identity gives back the ordinary dot product, so the geometry is the familiar one.',
  },
  {
    id: 'deck',
    label: "A = [[2,0],[0,1]] — the deck's",
    A: DECK_A,
    note: 'Slide 15’s matrix. It weights the first coordinate twice as heavily, so it stretches the plane horizontally.',
  },
  {
    id: 'corr',
    label: 'A = [[2,1],[1,2]] — with cross terms',
    A: [
      [2, 1],
      [1, 2],
    ],
    note: 'Off-diagonal entries make the two coordinates interact, which tilts what "at right angles" means.',
  },
  {
    id: 'notsym',
    label: 'A = [[1,2],[0,1]] — not symmetric',
    A: [
      [1, 2],
      [0, 1],
    ],
    note: 'Bilinear, but ⟨x, y⟩ ≠ ⟨y, x⟩. Symmetry is a genuinely separate requirement.',
  },
  {
    id: 'notpd',
    label: 'A = [[1,0],[0,−1]] — not positive definite',
    A: [
      [1, 0],
      [0, -1],
    ],
    note: 'Symmetric, but ⟨x, x⟩ goes negative — so the square root that defines length has nothing to work with.',
  },
]

export function InnerProductAxiomLab() {
  const [pick, setPick] = useState('dot')
  const [x, setX] = useState<Pt>({ x: 2, y: 1 })

  const preset = A_PRESETS.find((p) => p.id === pick)!
  const A = preset.A
  const { symmetric, det, posdef } = spdOf(A)

  const y: Pt = { x: -1, y: 2 }
  const selfIp = ip(A, x, x)
  const canTakeRoot = selfIp >= 0

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // ⟨v, v⟩ = 1 — the set this inner product calls "length one".
    g.strokeStyle = posdef ? 'rgba(13,148,136,0.85)' : 'rgba(220,38,38,0.5)'
    g.lineWidth = 2
    g.beginPath()
    let started = false
    for (let t = 0; t <= 360; t += 1) {
      const ang = (t * Math.PI) / 180
      const d = { x: Math.cos(ang), y: Math.sin(ang) }
      const q = ip(A, d, d)
      if (q <= 1e-9) {
        started = false
        continue
      }
      const s = 1 / Math.sqrt(q)
      const px = f.px(d.x * s)
      const py = f.py(d.y * s)
      if (!started) {
        g.moveTo(px, py)
        started = true
      } else g.lineTo(px, py)
    }
    g.stroke()

    arrow(g, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 3)
    grip(g, f.px(x.x), f.py(x.y), acc, 7)
    return f
  }

  return (
    <LabBox>
      <Presets items={A_PRESETS.map((p) => ({ id: p.id, label: p.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [{ id: 'x', px: f.px(x.x), py: f.py(x.y), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) => setX({ x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) })}
          caption="The ring is every vector this inner product calls length 1. When the ring is missing or broken, the definition has failed and there is no such set."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'bilinear?', value: 'always' },
              { label: 'symmetric?', value: symmetric ? 'yes' : 'no' },
              { label: 'det A', value: fmt(det) },
              { label: 'a₁₁', value: fmt(A[0][0]) },
              { label: '⟨x, x⟩', value: fmt(selfIp) },
              { label: '⟨x, y⟩', value: fmt(ip(A, x, y)) },
              { label: '⟨y, x⟩', value: fmt(ip(A, y, x)) },
              { label: '‖x‖ = √⟨x,x⟩', value: canTakeRoot ? fmt(Math.sqrt(selfIp)) : 'undefined' },
            ]}
          />
          <PanelNote>{preset.note}</PanelNote>
        </div>
      </div>

      <Verdict ok={posdef}>
        {posdef ? (
          <>
            This <strong>is</strong> an inner product. It is bilinear because it is xᵀAy, symmetric because a₁₂ = a₂₁,
            and positive definite because a₁₁ = {fmt(A[0][0])} {'>'} 0 and det A = {fmt(det)} {'>'} 0.
          </>
        ) : !symmetric ? (
          <>
            <strong>Not an inner product — symmetry fails.</strong> ⟨x, y⟩ = {fmt(ip(A, x, y))} but ⟨y, x⟩ ={' '}
            {fmt(ip(A, y, x))}. It is still perfectly bilinear; bilinear alone is not enough.
          </>
        ) : (
          <>
            <strong>Not an inner product — positive definiteness fails.</strong> Drag x into the region where ⟨x, x⟩
            turns negative and the length would need the square root of a negative number. det A = {fmt(det)}, which is
            the test that catches it.
          </>
        )}
      </Verdict>

      <LabNote>
        The theorem on slide 5 says this is the whole story: on a finite-dimensional space with a fixed basis,{' '}
        <strong>every</strong> inner product is xᵀAy for some symmetric positive-definite A, and every such A gives one.
        So choosing an inner product and choosing an SPD matrix are the same act.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — what an SPD matrix cannot help being                              */
/* ========================================================================== */

export function SpdFactsLab() {
  const [a11, setA11] = useState(3)
  const [a12, setA12] = useState(1)
  const [a22, setA22] = useState(2)

  const A: Mat = [
    [a11, a12],
    [a12, a22],
  ]
  const det = a11 * a22 - a12 * a12
  const posdef = a11 > 0 && det > 0
  const rank = det !== 0 ? 2 : a11 !== 0 || a12 !== 0 || a22 !== 0 ? 1 : 0

  // ⟨eᵢ, A eᵢ⟩ is exactly the i-th diagonal entry — the slide's argument.
  const e1: Pt = { x: 1, y: 0 }
  const e2: Pt = { x: 0, y: 1 }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            A symmetric matrix you control
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {[
              [a11, setA11, 'a₁₁'],
              [a12, setA12, 'a₁₂ = a₂₁'],
              [a22, setA22, 'a₂₂'],
            ].map(([v, set, name]) => (
              <label key={name as string} className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-zinc-500">{name as string}</span>
                <input
                  type="number"
                  value={v as number}
                  step={1}
                  onChange={(e) => (set as (n: number) => void)(Number(e.target.value) || 0)}
                  className="w-16 rounded-md border border-zinc-950/15 px-2 py-1 text-center font-mono text-[13px]"
                  aria-label={name as string}
                />
              </label>
            ))}
          </div>
          <pre className="overflow-x-auto font-mono text-[12.5px]/[1.9] text-zinc-800">
            {`A = [ ${String(a11).padStart(3)}  ${String(a12).padStart(3)} ]
    [ ${String(a12).padStart(3)}  ${String(a22).padStart(3)} ]

FACT 1 — the diagonal must be strictly positive
    put x = e₁ = (1, 0):   e₁ᵀAe₁ = a₁₁ = ${fmt(ip(A, e1, e1))}
    put x = e₂ = (0, 1):   e₂ᵀAe₂ = a₂₂ = ${fmt(ip(A, e2, e2))}
    positive definite demands xᵀAx > 0 for every non-zero x,
    and eᵢ is non-zero, so every aᵢᵢ > 0.

FACT 2 — it must have full rank
    xᵀAx > 0 for every x ≠ 0 means no non-zero x has Ax = 0,
    because Ax = 0 would give xᵀAx = 0.
    So the nullspace holds only 0, its dimension is 0,
    and rank = n − 0 = ${rank === 2 ? '2  (full)' : `${rank}  (not full)`}`}
          </pre>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'a₁₁ > 0?', value: a11 > 0 ? 'yes' : 'no' },
              { label: 'a₂₂ > 0?', value: a22 > 0 ? 'yes' : 'no' },
              { label: 'det A', value: fmt(det) },
              { label: 'rank A', value: String(rank) },
              { label: 'nullspace dim', value: String(2 - rank) },
              { label: 'positive definite?', value: posdef ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            Try to build a positive-definite matrix with a zero or negative entry on the diagonal. You cannot — the
            first fact rules it out before you start.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={posdef}>
        {posdef ? (
          <>
            Positive definite, so both consequences hold: the diagonal is strictly positive ({fmt(a11)} and {fmt(a22)}),
            and rank A = 2, which is full.
          </>
        ) : a11 <= 0 || a22 <= 0 ? (
          <>
            <strong>Not positive definite</strong>, and the diagonal shows it immediately. eᵢᵀAeᵢ picks out aᵢᵢ, so a
            non-positive diagonal entry is a counterexample you can write down without any work.
          </>
        ) : (
          <>
            <strong>Not positive definite.</strong> The diagonal is positive but det A = {fmt(det)} ≤ 0, so some
            direction still gives xᵀAx ≤ 0. A positive diagonal alone is not enough — that is the trap.
          </>
        )}
      </Verdict>

      <LabNote>
        Both facts come from the same line, xᵀAx {'>'} 0 for every non-zero x. Fact 1 substitutes a basis vector into
        it; fact 2 argues that nothing can be sent to zero. Exam answers that quote the definition and then substitute
        get the marks.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 9 — Cauchy–Schwarz                                                    */
/* ========================================================================== */

/**
 * The proof on slide 8 is one parabola. ‖u − αv‖² is a quadratic in α that can
 * never dip below zero, and the α that minimises it is the one the slide picks.
 * Dragging α *is* the proof, so the plot draws the quadratic itself.
 */
export function CauchyLab() {
  const [u, setU] = useState<Pt>({ x: 3, y: 1 })
  const [v, setV] = useState<Pt>({ x: 1, y: 2 })
  const [alpha, setAlpha] = useState(1)

  const uu = ip(IDENT, u, u)
  const uv = ip(IDENT, u, v)
  const vv = ip(IDENT, v, v)
  const q = (t: number) => uu - 2 * t * uv + t * t * vv
  const best = vv > 1e-12 ? uv / vv : 0
  const minVal = q(best)

  const lhs = uu * vv
  const rhs = uv * uv
  const holds = lhs >= rhs - 1e-9
  const equality = Math.abs(lhs - rhs) < 1e-6

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: -1.5,
      xmax: 3.5,
      ymin: -1,
      ymax: Math.max(6, q(-1.5), q(3.5)),
      xlab: 'α',
      ylab: '‖u − αv‖²',
    })
    const acc = accentColour()

    // the zero line — the whole argument is that the curve never crosses it
    g.strokeStyle = 'rgba(220,38,38,0.5)'
    g.lineWidth = 1.5
    g.setLineDash([5, 4])
    g.beginPath()
    g.moveTo(f.L, f.py(0))
    g.lineTo(f.R, f.py(0))
    g.stroke()
    g.setLineDash([])

    g.strokeStyle = acc
    g.lineWidth = 2.5
    g.beginPath()
    for (let i = 0; i <= 240; i++) {
      const t = -1.5 + (i / 240) * 5
      const px = f.px(t)
      const py = f.py(q(t))
      if (i === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.stroke()

    // the minimising α from the slide
    g.strokeStyle = TEAL
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(best), f.py(0))
    g.lineTo(f.px(best), f.py(minVal))
    g.stroke()

    grip(g, f.px(alpha), f.py(q(alpha)), acc, 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${u.x},${u.y},${v.x},${v.y}`}
          handles={(f) => [{ id: 'a', px: f.px(alpha), py: f.py(q(alpha)), grab: 'anywhere' }]}
          onDragTo={(_id, px) => setAlpha(Math.round(clamp(px, -1.5, 3.5) * 20) / 20)}
          caption="Press anywhere to slide α. The curve is ‖u − αv‖², a squared length, so it can never go below the dashed red line. The teal mark is the α the proof chooses."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-zinc-500">u₁</span>
              <input
                type="number"
                value={u.x}
                onChange={(e) => setU({ ...u, x: Number(e.target.value) || 0 })}
                className="w-14 rounded-md border border-zinc-950/15 px-2 py-1 text-center font-mono text-[13px]"
                aria-label="u1"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-zinc-500">u₂</span>
              <input
                type="number"
                value={u.y}
                onChange={(e) => setU({ ...u, y: Number(e.target.value) || 0 })}
                className="w-14 rounded-md border border-zinc-950/15 px-2 py-1 text-center font-mono text-[13px]"
                aria-label="u2"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-zinc-500">v₁</span>
              <input
                type="number"
                value={v.x}
                onChange={(e) => setV({ ...v, x: Number(e.target.value) || 0 })}
                className="w-14 rounded-md border border-zinc-950/15 px-2 py-1 text-center font-mono text-[13px]"
                aria-label="v1"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-zinc-500">v₂</span>
              <input
                type="number"
                value={v.y}
                onChange={(e) => setV({ ...v, y: Number(e.target.value) || 0 })}
                className="w-14 rounded-md border border-zinc-950/15 px-2 py-1 text-center font-mono text-[13px]"
                aria-label="v2"
              />
            </label>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>α</span>
              <span className="text-zinc-500">{alpha.toFixed(2)}</span>
            </div>
            <RangeInput label="alpha" value={alpha} min={-1.5} max={3.5} step={0.05} onChange={setAlpha} />
          </div>
          <ReadOutGrid
            items={[
              { label: '‖u − αv‖²', value: fmt(q(alpha)) },
              { label: 'best α = uᵀv/vᵀv', value: fmt(best) },
              { label: 'value there', value: fmt(minVal) },
              { label: '(uᵀu)(vᵀv)', value: fmt(lhs) },
              { label: '(uᵀv)²', value: fmt(rhs) },
              { label: 'gap', value: fmt(lhs - rhs) },
            ]}
          />
          <Btn primary onClick={() => setAlpha(Math.round(best * 20) / 20)}>
            Jump α to the minimum
          </Btn>
        </div>
      </div>

      <Verdict ok={holds}>
        {equality ? (
          <>
            <strong>Equality.</strong> (uᵀu)(vᵀv) = (uᵀv)² exactly, and the curve just touches zero. This happens
            precisely when u and v lie along the same line — try it with v = (1, 2) and u = (2, 4).
          </>
        ) : (
          <>
            (uᵀu)(vᵀv) = {fmt(lhs)} ≥ {fmt(rhs)} = (uᵀv)². The gap is {fmt(lhs - rhs)}, and it is exactly vᵀv times the
            lowest point of the curve — which cannot be negative, because the curve is a squared length.
          </>
        )}
      </Verdict>

      <LabNote>
        Read the proof off the picture. ‖u − αv‖² ≥ 0 holds for <em>every</em> α, so it holds for the worst one. Put α =
        uᵀv/vᵀv, the bottom of the parabola, and the inequality becomes uᵀu − (uᵀv)²/vᵀv ≥ 0. Multiply by vᵀv and you
        have Cauchy–Schwarz.
      </LabNote>
      <LabNote>
        Nothing in that argument used the dot product specifically. It used bilinearity, symmetry and ⟨w, w⟩ ≥ 0 — so it
        holds for every inner product, which is why the slide says so at the end.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — distance and the metric properties                               */
/* ========================================================================== */

export function MetricLab() {
  const [x, setX] = useState<Pt>({ x: -2, y: 1 })
  const [y, setY] = useState<Pt>({ x: 3, y: 2 })
  const [z, setZ] = useState<Pt>({ x: 1, y: -2 })

  const d = (p: Pt, q: Pt) => Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2)
  const dxy = d(x, y)
  const dyz = d(y, z)
  const dxz = d(x, z)
  const triangle = dxz <= dxy + dyz + 1e-9
  const innerXY = ip(IDENT, x, y)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    const seg = (p: Pt, q: Pt, colour: string, width: number) => {
      g.strokeStyle = colour
      g.lineWidth = width
      g.beginPath()
      g.moveTo(f.px(p.x), f.py(p.y))
      g.lineTo(f.px(q.x), f.py(q.y))
      g.stroke()
    }
    seg(x, y, 'rgba(9,9,11,0.3)', 2)
    seg(y, z, 'rgba(9,9,11,0.3)', 2)
    seg(x, z, triangle ? TEAL : RED, 3)

    // x − y drawn as an arrow from the origin, since the distance IS its length
    g.setLineDash([4, 4])
    arrow(g, f.px(0), f.py(0), f.px(x.x - y.x), f.py(x.y - y.y), ORANGE, 2)
    g.setLineDash([])

    grip(g, f.px(x.x), f.py(x.y), acc, 7)
    grip(g, f.px(y.x), f.py(y.y), ORANGE, 7)
    grip(g, f.px(z.x), f.py(z.y), '#7c3aed', 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey="metric"
          handles={(f) => [
            { id: 'x', px: f.px(x.x), py: f.py(x.y) },
            { id: 'y', px: f.px(y.x), py: f.py(y.y) },
            { id: 'z', px: f.px(z.x), py: f.py(z.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) }
            if (id === 'x') setX(p)
            else if (id === 'y') setY(p)
            else setZ(p)
          }}
          caption="Three points. The thick line is the direct route x → z; the two thin ones are the detour through y. The dashed arrow is the vector x − y, whose length is the distance."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'd(x, y)', value: fmt(dxy) },
              { label: 'd(y, x)', value: fmt(d(y, x)) },
              { label: 'd(x, z) direct', value: fmt(dxz) },
              { label: 'via y', value: fmt(dxy + dyz) },
              { label: 'd(x, x)', value: fmt(d(x, x)) },
              { label: '⟨x, y⟩', value: fmt(innerXY) },
            ]}
          />
          <PanelNote>
            d(x, y) and d(y, x) are always the same number — that is symmetry. d(x, x) is always 0, and only ever 0 when
            the two points coincide.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={triangle}>
        The triangle inequality holds: {fmt(dxz)} ≤ {fmt(dxy + dyz)}. Drag y anywhere you like — you will never make the
        direct route longer than the detour. Put y exactly on the segment from x to z and the two become equal.
      </Verdict>

      <LabNote>
        The last row is the contrast slide 10 draws, and it catches people out. Slide x and y on top of each other: the
        <strong> distance</strong> goes to 0 while the <strong>inner product</strong> gets large. They are almost
        opposite measures — small distance means similar, small inner product means unrelated. Do not read one as the
        other.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Parts 11 and 13 — angle, and orthogonality under a chosen inner product    */
/* ========================================================================== */

export function AngleLab({ fixedA }: { fixedA?: Mat } = {}) {
  const [pick, setPick] = useState(fixedA ? 'deck' : 'dot')
  const [x, setX] = useState<Pt>({ x: 3, y: 1 })
  const [y, setY] = useState<Pt>({ x: -1, y: 2 })

  const A = fixedA ?? A_PRESETS.find((p) => p.id === pick)!.A
  const { posdef } = spdOf(A)

  const num = ip(A, x, y)
  const lx = nrm(A, x)
  const ly = nrm(A, y)
  const ratio = lx > 1e-9 && ly > 1e-9 ? num / (lx * ly) : 0
  const inRange = ratio >= -1.000001 && ratio <= 1.000001
  const omega = Math.acos(clamp(ratio, -1, 1))
  const deg = (omega * 180) / Math.PI
  const orth = Math.abs(num) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // the unit ring of this inner product, so the reader can see the geometry
    if (posdef) {
      g.strokeStyle = 'rgba(9,9,11,0.16)'
      g.lineWidth = 1.5
      g.beginPath()
      for (let t = 0; t <= 360; t += 2) {
        const ang = (t * Math.PI) / 180
        const dir = { x: Math.cos(ang), y: Math.sin(ang) }
        const s = 2 / Math.sqrt(ip(A, dir, dir))
        const px = f.px(dir.x * s)
        const py = f.py(dir.y * s)
        if (t === 0) g.moveTo(px, py)
        else g.lineTo(px, py)
      }
      g.closePath()
      g.stroke()
    }

    arrow(g, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 3)
    arrow(g, f.px(0), f.py(0), f.px(y.x), f.py(y.y), ORANGE, 3)

    // a right-angle tick when this inner product says they are orthogonal
    if (orth) {
      g.fillStyle = TEAL
      g.font = '600 13px ui-sans-serif, system-ui'
      g.fillText('⊥', f.px(0) + 12, f.py(0) - 12)
    }

    grip(g, f.px(x.x), f.py(x.y), acc, 7)
    grip(g, f.px(y.x), f.py(y.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      {!fixedA && (
        <Presets
          items={A_PRESETS.filter((p) => spdOf(p.A).posdef).map((p) => ({ id: p.id, label: p.label }))}
          at={pick}
          onPick={setPick}
        />
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [
            { id: 'x', px: f.px(x.x), py: f.py(x.y) },
            { id: 'y', px: f.px(y.x), py: f.py(y.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) }
            if (id === 'x') setX(p)
            else setY(p)
          }}
          caption="The faint ring shows what this inner product treats as one fixed distance from the origin. Drag either arrow; ⊥ appears the moment the inner product hits exactly zero."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: '⟨x, y⟩', value: fmt(num) },
              { label: '‖x‖', value: fmt(lx) },
              { label: '‖y‖', value: fmt(ly) },
              { label: 'the ratio', value: fmt(ratio) },
              { label: 'ω in radians', value: fmt(omega) },
              { label: 'ω in degrees', value: `${deg.toFixed(1)}°` },
            ]}
          />
          <PanelNote>
            The ratio is what Cauchy–Schwarz pins between −1 and 1. That is the only reason cos⁻¹ may be applied to it
            at all — outside that range the angle would not exist.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={inRange}>
        {orth ? (
          <>
            <strong>Orthogonal under this inner product.</strong> ⟨x, y⟩ = 0 exactly, so ω = 90°, and we write x ⊥ y.
            Switch to a different A above and watch that verdict change without either arrow moving.
          </>
        ) : (
          <>
            The ratio is {fmt(ratio)}, comfortably inside [−1, 1], so ω = cos⁻¹({fmt(ratio)}) = {deg.toFixed(1)}°.{' '}
            {ratio > 0 ? 'Positive, so the two lean the same way.' : 'Negative, so they lean apart — an obtuse angle.'}
          </>
        )}
      </Verdict>

      <LabNote>
        Being at right angles is <strong>not</strong> a property of two arrows on their own. It is a property of two
        arrows <em>and</em> a chosen inner product. The same picture, judged by a different A, gives a different answer
        — which is exactly what the deck’s worked example is built to show.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — high dimensions                                                  */
/* ========================================================================== */

/** A small deterministic generator, so the histogram is reproducible. */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Box–Muller: two uniforms in, one standard normal out. */
function gauss(rnd: () => number) {
  const u = Math.max(rnd(), 1e-12)
  const v = rnd()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function HighDimLab() {
  const [dim, setDim] = useState(2)
  const [seed, setSeed] = useState(7)

  const SAMPLES = 600
  const rnd = makeRng(seed * 9176 + dim * 131)
  const cosines: number[] = []
  for (let s = 0; s < SAMPLES; s++) {
    let dotp = 0
    let na = 0
    let nb = 0
    for (let i = 0; i < dim; i++) {
      const a = gauss(rnd)
      const b = gauss(rnd)
      dotp += a * b
      na += a * a
      nb += b * b
    }
    const den = Math.sqrt(na * nb)
    cosines.push(den > 1e-12 ? dotp / den : 0)
  }

  const BINS = 41
  const hist = new Array(BINS).fill(0)
  for (const c of cosines) {
    const idx = Math.min(BINS - 1, Math.max(0, Math.floor(((c + 1) / 2) * BINS)))
    hist[idx]++
  }
  const peak = Math.max(...hist, 1)
  const mean = cosines.reduce((a, b) => a + b, 0) / cosines.length
  const sd = Math.sqrt(cosines.reduce((a, b) => a + (b - mean) ** 2, 0) / cosines.length)
  const near90 = cosines.filter((c) => Math.abs(c) < 0.1).length / cosines.length

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: -1,
      xmax: 1,
      ymin: 0,
      ymax: 1,
      xlab: 'cos ω between two random vectors',
      ylab: 'how often',
    })
    const acc = accentColour()
    const bw = (f.R - f.L) / BINS
    for (let i = 0; i < BINS; i++) {
      const h = hist[i] / peak
      const px = f.L + i * bw
      g.fillStyle = acc
      g.globalAlpha = 0.75
      g.fillRect(px + 1, f.py(h), Math.max(1, bw - 2), f.py(0) - f.py(h))
      g.globalAlpha = 1
    }
    // the 90° line — cos ω = 0
    g.strokeStyle = TEAL
    g.lineWidth = 2
    g.setLineDash([5, 4])
    g.beginPath()
    g.moveTo(f.px(0), f.T)
    g.lineTo(f.px(0), f.B)
    g.stroke()
    g.setLineDash([])
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${dim}-${seed}`}
          caption="600 pairs of random vectors in n dimensions, each component an independent standard normal. The dashed line marks a right angle."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>n, the number of dimensions</span>
              <span className="text-zinc-500">{dim}</span>
            </div>
            <RangeInput label="dimensions" value={dim} min={2} max={200} step={1} onChange={setDim} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'average cos ω', value: mean.toFixed(4) },
              { label: 'spread (sd)', value: sd.toFixed(4) },
              { label: '1/√n for comparison', value: (1 / Math.sqrt(dim)).toFixed(4) },
              { label: 'within 6° of 90°', value: `${(near90 * 100).toFixed(0)}%` },
            ]}
          />
          <Btn onClick={() => setSeed(seed + 1)}>Draw a fresh sample</Btn>
          <PanelNote>
            Push n up and watch the histogram collapse onto the dashed line. The spread shrinks like 1/√n — compare the
            two middle rows.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        This is the program slide 13 asks you to write. In two dimensions the angle between two random vectors is
        anything at all. By n = 100 almost every pair is within a few degrees of perpendicular. High-dimensional space
        is mostly empty and mostly at right angles, and that is not an illusion — it is what the arithmetic says.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — the deck's worked example                                        */
/* ========================================================================== */

export function DeckAngleLab() {
  const [useA, setUseA] = useState(false)
  const x: Pt = { x: 1, y: 1 }
  const y: Pt = { x: -1, y: 1 }
  const A = useA ? DECK_A : IDENT

  const num = ip(A, x, y)
  const lx = nrm(A, x)
  const ly = nrm(A, y)
  const ratio = num / (lx * ly)
  const deg = (Math.acos(clamp(ratio, -1, 1)) * 180) / Math.PI

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, 3)
    const acc = accentColour()
    g.strokeStyle = 'rgba(9,9,11,0.16)'
    g.lineWidth = 1.5
    g.beginPath()
    for (let t = 0; t <= 360; t += 2) {
      const ang = (t * Math.PI) / 180
      const dir = { x: Math.cos(ang), y: Math.sin(ang) }
      const s = 1 / Math.sqrt(ip(A, dir, dir))
      const px = f.px(dir.x * s)
      const py = f.py(dir.y * s)
      if (t === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.closePath()
    g.stroke()
    arrow(g, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 3)
    arrow(g, f.px(0), f.py(0), f.px(y.x), f.py(y.y), ORANGE, 3)
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!useA} label="⟨x, y⟩ = xᵀy, the dot product" onClick={() => setUseA(false)} />
        <Chip on={useA} label="⟨x, y⟩ = xᵀAy with A = [[2,0],[0,1]]" onClick={() => setUseA(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={String(useA)}
          caption="The arrows never move. Only the definition of the inner product changes, and with it the faint ring of unit vectors — and the angle."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: '⟨x, y⟩', value: fmt(num) },
              { label: '⟨x, x⟩', value: fmt(ip(A, x, x)) },
              { label: '⟨y, y⟩', value: fmt(ip(A, y, y)) },
              { label: 'cos ω', value: fmt(ratio) },
              { label: 'ω', value: `${deg.toFixed(1)}°` },
              { label: 'orthogonal?', value: Math.abs(num) < 1e-9 ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>x = (1, 1) and y = (−1, 1) throughout, exactly as on slide 15.</PanelNote>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
        {useA
          ? `⟨x, y⟩ = xᵀAy   with   A = [ 2  0 ]
                             [ 0  1 ]

xᵀAy = 2x₁y₁ + x₂y₂ = 2(1)(−1) + (1)(1) = ${fmt(num)}
xᵀAx = 2x₁² + x₂²   = 2(1) + 1          = ${fmt(ip(A, x, x))}
yᵀAy = 2y₁² + y₂²   = 2(1) + 1          = ${fmt(ip(A, y, y))}

              xᵀAy                 ${fmt(num)}
cos ω = ───────────────── = ───────── = ${fmt(ratio)}
        √(xᵀAx) √(yᵀAy)        √(3·3)

so ω = ${deg.toFixed(1)}°  —  NOT a right angle any more.`
          : `⟨x, y⟩ = xᵀy   (the ordinary dot product)

xᵀy = (1)(−1) + (1)(1) = −1 + 1 = ${fmt(num)}

The inner product is exactly 0, so x ⊥ y
and ω = ${deg.toFixed(1)}°.`}
      </pre>

      <Verdict ok={!useA}>
        {useA ? (
          <>
            Under this inner product cos ω = <strong>−1/3</strong>, so the two vectors are{' '}
            <strong>no longer orthogonal</strong> — exactly the conclusion on slide 16. Nothing about the arrows
            changed; only the ruler did.
          </>
        ) : (
          <>Under the dot product ⟨x, y⟩ = 0, so x ⊥ y. Now press the other button and watch that fact disappear.</>
        )}
      </Verdict>

      <LabNote>
        Both read-outs are computed by the same code that runs every other lab on this page, from the vectors and the
        matrix — so the −1/3 you see is calculated, not typed in. It agrees with slide 16.
      </LabNote>
    </LabBox>
  )
}
