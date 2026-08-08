'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const RED = '#dc2626'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2

type Pt = { x: number; y: number }

const n1 = (p: Pt) => Math.abs(p.x) + Math.abs(p.y)
const n2 = (p: Pt) => Math.sqrt(p.x * p.x + p.y * p.y)
const nInf = (p: Pt) => Math.max(Math.abs(p.x), Math.abs(p.y))
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(3))

/* ========================================================================== */
/* Part 2 — the three promises a norm has to make                             */
/* ========================================================================== */

type AxiomId = 'homog' | 'triangle' | 'posdef'

/**
 * Each axiom is checked on the reader's own x, y and λ, and each can be
 * switched to a broken stand-in so the reader can see what the rule is
 * actually keeping out. The broken versions are deliberately plausible —
 * that is the point.
 */
const BROKEN = [
  { id: 'ok', label: '‖·‖₂, the real one', f: n2, breaks: null as AxiomId | null },
  { id: 'sq', label: 'x₁² + x₂² (forgot the root)', f: (p: Pt) => p.x * p.x + p.y * p.y, breaks: 'homog' as AxiomId },
  { id: 'sum', label: 'x₁ + x₂ (forgot the bars)', f: (p: Pt) => p.x + p.y, breaks: 'posdef' as AxiomId },
  { id: 'max2', label: '2·max|xᵢ| … squared', f: (p: Pt) => 4 * nInf(p) * nInf(p), breaks: 'homog' as AxiomId },
] as const

export function NormAxiomLab() {
  const [pick, setPick] = useState<string>('ok')
  const [x, setX] = useState<Pt>({ x: 3, y: 1 })
  const [y, setY] = useState<Pt>({ x: -1, y: 2.5 })
  const [lam, setLam] = useState(2)

  const norm = BROKEN.find((b) => b.id === pick)!
  const N = norm.f

  const sum = { x: x.x + y.x, y: x.y + y.y }
  const scaled = { x: lam * x.x, y: lam * x.y }

  // Absolute homogeneity: ‖λx‖ must equal |λ|·‖x‖.
  const lhsH = N(scaled)
  const rhsH = Math.abs(lam) * N(x)
  const okHomog = Math.abs(lhsH - rhsH) < 1e-9

  // Triangle inequality: ‖x + y‖ ≤ ‖x‖ + ‖y‖.
  const lhsT = N(sum)
  const rhsT = N(x) + N(y)
  const okTriangle = lhsT <= rhsT + 1e-9

  // Positive definite: ‖x‖ ≥ 0 always, and 0 only for the zero vector.
  const okPosDef = N(x) >= -1e-9 && N(y) >= -1e-9 && Math.abs(N({ x: 0, y: 0 })) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    arrow(g, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(y.x), f.py(y.y), ORANGE, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), okTriangle ? TEAL : RED, 3)
    // the detour x → x+y, which is what the triangle inequality compares against
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(x.x), f.py(x.y))
    g.lineTo(f.px(sum.x), f.py(sum.y))
    g.stroke()
    g.setLineDash([])
    grip(g, f.px(x.x), f.py(x.y), acc, 7)
    grip(g, f.px(y.x), f.py(y.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets items={BROKEN.map((b) => ({ id: b.id, label: b.label }))} at={pick} onPick={setPick} />

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
          caption="Blue is x, orange is y, and the thick arrow is x + y. The dashed line is the detour: go along x first, then along y."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>λ, the number to stretch by</span>
              <span className="text-zinc-500">{lam}</span>
            </div>
            <RangeInput label="lambda" value={lam} min={-3} max={3} step={0.5} onChange={setLam} />
          </div>
          <ReadOutGrid
            items={[
              { label: '‖x‖', value: fmt(N(x)) },
              { label: '‖y‖', value: fmt(N(y)) },
              { label: '‖λx‖', value: fmt(lhsH) },
              { label: '|λ|·‖x‖', value: fmt(rhsH) },
              { label: '‖x + y‖', value: fmt(lhsT) },
              { label: '‖x‖ + ‖y‖', value: fmt(rhsT) },
            ]}
          />
          <PanelNote>
            Drag either arrow. Two rows that should match but do not are a broken promise, and the verdict below says
            which one.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={okHomog && okTriangle && okPosDef}>
        {okHomog && okTriangle && okPosDef ? (
          <>
            All three hold on these numbers, so this really is a norm. Homogeneity: {fmt(lhsH)} = {fmt(rhsH)}. Triangle:{' '}
            {fmt(lhsT)} ≤ {fmt(rhsT)}. And it is never negative.
          </>
        ) : !okHomog ? (
          <>
            <strong>Absolute homogeneity fails.</strong> ‖λx‖ came out {fmt(lhsH)} but |λ|·‖x‖ is {fmt(rhsH)}. Doubling
            a vector has to double its length; this one does not, so it cannot be called a length at all.
          </>
        ) : !okPosDef ? (
          <>
            <strong>Positive definiteness fails.</strong> This one can return a negative number, or give 0 for a vector
            that is not the zero vector. A length below zero is meaningless.
          </>
        ) : (
          <>
            <strong>The triangle inequality fails.</strong> ‖x + y‖ came out {fmt(lhsT)}, which is bigger than ‖x‖ + ‖y‖
            = {fmt(rhsT)}. The direct route is longer than the detour, which no sensible notion of distance allows.
          </>
        )}
      </Verdict>

      <LabNote>
        The triangle inequality is the one with a picture. Walking straight from the origin to x + y can never be longer
        than walking to x first and then along y. If a formula lets it be longer, that formula is not measuring
        distance.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — Manhattan and Euclidean                                           */
/* ========================================================================== */

const BALLS = [
  { id: 'l2', label: 'Euclidean ‖·‖₂', f: n2, note: 'The straight-line distance. Its unit ball is a circle.' },
  {
    id: 'l1',
    label: 'Manhattan ‖·‖₁',
    f: n1,
    note: 'Add the absolute values. Its unit ball is a diamond, because you may only travel along the grid.',
  },
  {
    id: 'linf',
    label: 'Maximum ‖·‖∞',
    f: nInf,
    note: 'Beyond this lecture: take the biggest component. Its unit ball is a square.',
  },
] as const

export function NormBallLab() {
  const [pick, setPick] = useState<string>('l2')
  const [p, setP] = useState<Pt>({ x: 3, y: 2 })
  const ball = BALLS.find((b) => b.id === pick)!

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // Every point at distance r from the origin, for r = 1, 2, 3.
    for (const r of [1, 2, 3, 4]) {
      g.strokeStyle = r === 1 ? 'rgba(79,70,229,0.55)' : 'rgba(9,9,11,0.13)'
      g.lineWidth = r === 1 ? 2 : 1
      g.beginPath()
      let first = true
      for (let t = 0; t <= 360; t += 2) {
        const a = (t * Math.PI) / 180
        const d = { x: Math.cos(a), y: Math.sin(a) }
        const s = r / ball.f(d) // scale the direction out to distance r
        const px = f.px(d.x * s)
        const py = f.py(d.y * s)
        if (first) {
          g.moveTo(px, py)
          first = false
        } else g.lineTo(px, py)
      }
      g.closePath()
      g.stroke()
    }

    // the Manhattan route, drawn as the two legs you would actually walk
    if (pick === 'l1') {
      g.strokeStyle = 'rgba(217,119,6,0.85)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(f.px(0), f.py(0))
      g.lineTo(f.px(p.x), f.py(0))
      g.lineTo(f.px(p.x), f.py(p.y))
      g.stroke()
    }

    arrow(g, f.px(0), f.py(0), f.px(p.x), f.py(p.y), acc, 3)
    grip(g, f.px(p.x), f.py(p.y), acc, 7)
    return f
  }

  return (
    <LabBox>
      <Presets items={BALLS.map((b) => ({ id: b.id, label: b.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [{ id: 'p', px: f.px(p.x), py: f.py(p.y), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) => setP({ x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) })}
          caption="Press anywhere to move the arrow. The bold ring is every point this norm calls distance 1 from the origin — the unit ball."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'the point', value: `(${fmt(p.x)}, ${fmt(p.y)})` },
              { label: 'this norm', value: fmt(ball.f(p)) },
              { label: '‖·‖₁ Manhattan', value: fmt(n1(p)) },
              { label: '‖·‖₂ Euclidean', value: fmt(n2(p)) },
            ]}
          />
          <PanelNote>{ball.note}</PanelNote>
        </div>
      </div>

      <LabNote>
        Both are honest lengths — they each keep all three promises. They simply disagree about how far away things are,
        and the shape of the unit ball is that disagreement made visible. Notice ‖·‖₁ is never smaller than ‖·‖₂: the
        grid route cannot beat the straight line.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — bilinear                                                          */
/* ========================================================================== */

/**
 * Ω(x, y) = xᵀAy for an editable A, checked for linearity in the first slot
 * and then the second. Both sides are computed from the same code path, so the
 * two columns cannot drift apart.
 */
export function BilinearLab() {
  const [a11, setA11] = useState(2)
  const [a12, setA12] = useState(0)
  const [a21, setA21] = useState(0)
  const [a22, setA22] = useState(1)
  const [lam, setLam] = useState(2)
  const [psi, setPsi] = useState(-1)
  const [slot, setSlot] = useState<'first' | 'second'>('first')

  const A = [
    [a11, a12],
    [a21, a22],
  ]
  const om = (u: Pt, v: Pt) => u.x * (A[0][0] * v.x + A[0][1] * v.y) + u.y * (A[1][0] * v.x + A[1][1] * v.y)

  const x: Pt = { x: 1, y: 2 }
  const y: Pt = { x: 3, y: -1 }
  const z: Pt = { x: -2, y: 1 }
  const mix = (u: Pt, v: Pt): Pt => ({ x: lam * u.x + psi * v.x, y: lam * u.y + psi * v.y })

  const lhs = slot === 'first' ? om(mix(x, y), z) : om(z, mix(x, y))
  const rhs = slot === 'first' ? lam * om(x, z) + psi * om(y, z) : lam * om(z, x) + psi * om(z, y)
  const ok = Math.abs(lhs - rhs) < 1e-9

  const symmetric = a12 === a21

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={slot === 'first'} label="linear in the first slot" onClick={() => setSlot('first')} />
        <Chip on={slot === 'second'} label="linear in the second slot" onClick={() => setSlot('second')} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Ω(x, y) = xᵀAy, with A yours to edit
          </div>
          <div className="mb-4 grid w-fit grid-cols-2 gap-2">
            {[
              [a11, setA11, 'a₁₁'],
              [a12, setA12, 'a₁₂'],
              [a21, setA21, 'a₂₁'],
              [a22, setA22, 'a₂₂'],
            ].map(([v, set, name]) => (
              <label key={name as string} className="flex items-center gap-2">
                <span className="w-8 font-mono text-[12px] text-zinc-500">{name as string}</span>
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
          <pre className="overflow-x-auto font-mono text-[12.5px]/[1.85] text-zinc-800">
            {slot === 'first'
              ? `x = (1, 2)   y = (3, −1)   z = (−2, 1)

LEFT   Ω(λx + ψy, z)
       λx + ψy = (${fmt(mix(x, y).x)}, ${fmt(mix(x, y).y)})
       Ω(that, z)        = ${fmt(lhs)}

RIGHT  λ·Ω(x, z) + ψ·Ω(y, z)
       Ω(x, z) = ${fmt(om(x, z))}   Ω(y, z) = ${fmt(om(y, z))}
       ${fmt(lam)}·${fmt(om(x, z))} + ${fmt(psi)}·${fmt(om(y, z))} = ${fmt(rhs)}`
              : `x = (1, 2)   y = (3, −1)   z = (−2, 1)

LEFT   Ω(z, λx + ψy)
       λx + ψy = (${fmt(mix(x, y).x)}, ${fmt(mix(x, y).y)})
       Ω(z, that)        = ${fmt(lhs)}

RIGHT  λ·Ω(z, x) + ψ·Ω(z, y)
       Ω(z, x) = ${fmt(om(z, x))}   Ω(z, y) = ${fmt(om(z, y))}
       ${fmt(lam)}·${fmt(om(z, x))} + ${fmt(psi)}·${fmt(om(z, y))} = ${fmt(rhs)}`}
          </pre>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>λ</span>
              <span className="text-zinc-500">{lam}</span>
            </div>
            <RangeInput label="lambda" value={lam} min={-3} max={3} step={1} onChange={setLam} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>ψ</span>
              <span className="text-zinc-500">{psi}</span>
            </div>
            <RangeInput label="psi" value={psi} min={-3} max={3} step={1} onChange={setPsi} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'left side', value: fmt(lhs) },
              { label: 'right side', value: fmt(rhs) },
              { label: 'symmetric?', value: symmetric ? 'yes' : 'no' },
              { label: 'Ω(x, y) − Ω(y, x)', value: fmt(om(x, y) - om(y, x)) },
            ]}
          />
          <PanelNote>
            Change any entry of A, λ or ψ. The two sides stay equal whatever you pick — that is what bilinear means, and
            it holds for every matrix A.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={ok}>
        {ok ? (
          <>
            Both sides come to <strong>{fmt(lhs)}</strong>. Ω is linear in the {slot} slot, and no choice of A will
            break it — pulling numbers out in front is exactly what a matrix product does.
          </>
        ) : (
          <>The two sides disagree, which should not be possible for xᵀAy. Please report this.</>
        )}
      </Verdict>

      <LabNote>
        Bilinear is <em>two</em> promises, not one: hold the second slot still and the first behaves linearly, then hold
        the first still and the second does too. It is <strong>not</strong> the same as being linear in both at once —
        Ω(λx, λy) is λ²Ω(x, y), not λΩ(x, y).
      </LabNote>
      <LabNote>
        Symmetry is a separate matter, and the panel shows it: Ω(x, y) equals Ω(y, x) exactly when a₁₂ = a₂₁. Set them
        to different values and the last read-out stops being zero.
      </LabNote>
    </LabBox>
  )
}
