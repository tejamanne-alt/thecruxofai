'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Chip, LabBox, LabNote, NumBox, Presets } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/**
 * xᵀAx for a symmetric 2 × 2 A, drawn as a map of the plane.
 *
 * The lecture states the test and completes the square once. Seeing the shading
 * turn red somewhere is what makes "positive definite" mean something: it is a
 * promise about every single x, and one red patch breaks it.
 */

const PRESETS = [
  { id: 'pd', label: 'A = [2 6; 6 20]', a: 2, b: 6, d: 20 },
  { id: 'psd', label: 'A = [2 6; 6 18]', a: 2, b: 6, d: 18 },
  { id: 'ind', label: 'A = [2 6; 6 10]', a: 2, b: 6, d: 10 },
  { id: 'eye', label: 'A = [1 0; 0 1]', a: 1, b: 0, d: 1 },
  { id: 'nd', label: 'A = [−2 0; 0 −5]', a: -2, b: 0, d: -5 },
] as const
type PresetId = (typeof PRESETS)[number]['id'] | ''

const SPAN = 3

export function PositiveDefiniteLab() {
  const [pick, setPick] = useState<PresetId>('pd')
  const [a, setA] = useState(2)
  const [b, setB] = useState(6)
  const [d, setD] = useState(20)
  const [x, setX] = useState({ x1: 1, x2: 0.6 })

  const q = (x1: number, x2: number) => a * x1 * x1 + 2 * b * x1 * x2 + d * x2 * x2
  const here = q(x.x1, x.x2)
  const det = a * d - b * b

  const verdict =
    a > 0 && det > 0
      ? { kind: 'pd', head: 'Positive definite', note: 'xᵀAx is above zero for every x except the origin.' }
      : a >= 0 && d >= 0 && det === 0
        ? { kind: 'psd', head: 'Positive semi-definite', note: 'Never negative — but there is a whole line where it is exactly zero.' }
        : a < 0 && det > 0
          ? { kind: 'nd', head: 'Negative definite', note: 'Below zero for every x except the origin. The mirror image of the first case.' }
          : { kind: 'ind', head: 'Indefinite', note: 'Positive in some directions and negative in others. Neither test passes.' }

  // Completing the square, the way slide 17 does it: pull the cross term into a
  // bracket and see what is left over.
  const rest = a !== 0 ? d - (b * b) / a : 0
  const ratio = a !== 0 ? b / a : 0
  const nice = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, ''))
  const squared =
    a === 0
      ? '(the top-left is 0, so you cannot complete the square this way)'
      : `${nice(a)}(x₁ ${ratio < 0 ? '−' : '+'} ${nice(Math.abs(ratio))}x₂)² ${rest < 0 ? '−' : '+'} ${nice(Math.abs(rest))}x₂²`

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // Shade the plane by the sign of xᵀAx. Coarse cells keep the drag smooth.
    const cell = 6
    const scale = Math.max(1, Math.abs(q(SPAN, SPAN)), Math.abs(q(SPAN, -SPAN)))
    for (let px = f.L; px < f.R; px += cell) {
      for (let py = f.T; py < f.B; py += cell) {
        const v = q(f.ux(px + cell / 2), f.uy(py + cell / 2))
        const alpha = Math.min(0.34, (Math.abs(v) / scale) * 0.4)
        if (alpha < 0.012) continue
        g.fillStyle = v > 0 ? `rgba(13,148,136,${alpha})` : `rgba(220,38,38,${alpha})`
        g.fillRect(px, py, cell, cell)
      }
    }

    // Where xᵀAx is exactly zero. For a 2 × 2 that is one or two lines through
    // the origin, so solve the quadratic in the direction rather than tracing.
    const roots: number[] = []
    if (d !== 0) {
      const disc = 4 * b * b - 4 * d * a
      if (disc >= 0) {
        const s = Math.sqrt(disc)
        roots.push((-2 * b + s) / (2 * d), (-2 * b - s) / (2 * d))
      }
    } else {
      roots.push(0)
    }
    g.strokeStyle = 'rgba(9,9,11,0.45)'
    g.setLineDash([5, 4])
    g.lineWidth = 1.5
    for (const t of roots) {
      // x₂ = t·x₁ along the zero line (or x₂ = 0 when d is 0).
      g.beginPath()
      g.moveTo(f.px(-SPAN), f.py(-SPAN * t))
      g.lineTo(f.px(SPAN), f.py(SPAN * t))
      g.stroke()
    }
    g.setLineDash([])

    arrow(g, f.px(0), f.py(0), f.px(x.x1), f.py(x.x2), here >= 0 ? '#0d9488' : '#dc2626', 2.5)
    grip(g, f.px(x.x1), f.py(x.x2), acc, 7)
    return f
  }

  const setFrom = (id: PresetId) => {
    const p = PRESETS.find((v) => v.id === id)
    if (!p) return
    setPick(id)
    setA(p.a)
    setB(p.b)
    setD(p.d)
  }

  return (
    <LabBox>
      <Presets items={PRESETS.map((p) => ({ id: p.id as PresetId, label: p.label }))} at={pick} onPick={setFrom} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${a}-${b}-${d}`}
          handles={(f) => [{ id: 'x', px: f.px(x.x1), py: f.py(x.x2), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) => setX({ x1: clamp(px, -SPAN, SPAN), x2: clamp(py, -SPAN, SPAN) })}
          caption="Press anywhere to move x. Teal means xᵀAx came out above zero there, red means below. The dashed lines are where it is exactly zero."
        />

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              A (kept symmetric)
            </div>
            <NumBox
              m={[
                [a, b],
                [b, d],
              ]}
              name="A"
              width={48}
              onEdit={(i, j, v) => {
                setPick('')
                if (i === 0 && j === 0) setA(v)
                else if (i === 1 && j === 1) setD(v)
                else setB(v)
              }}
            />
          </div>

          <ReadOutGrid
            items={[
              { label: 'x', value: `(${x.x1.toFixed(2)}, ${x.x2.toFixed(2)})` },
              { label: 'xᵀAx', value: here.toFixed(2) },
              { label: 'top-left', value: String(a) },
              { label: 'det A', value: String(det) },
            ]}
          />

          <div
            className="rounded-lg border px-3 py-2.5 text-[13px]/[1.6]"
            style={
              verdict.kind === 'pd'
                ? { borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.08)', color: '#115e59' }
                : verdict.kind === 'ind' || verdict.kind === 'nd'
                  ? { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#991b1b' }
                  : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#3f3f46' }
            }
          >
            <strong className="font-semibold">{verdict.head}.</strong> {verdict.note}
          </div>

          <PanelNote>
            The quick test for a 2 × 2: the top-left number and the determinant must <em>both</em>{' '}be above zero. Here
            they are {a} and {det}.
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The same thing with the square completed
        </div>
        <div className="overflow-x-auto font-mono text-[13px]/[1.9] text-zinc-800">
          xᵀAx = {nice(a)}x₁² {2 * b < 0 ? '−' : '+'} {nice(Math.abs(2 * b))}x₁x₂ {d < 0 ? '−' : '+'} {nice(Math.abs(d))}
          x₂²
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {squared}
        </div>
        <p className="mt-2 text-[13px]/[1.6] text-zinc-600">
          {a > 0 && rest > 0
            ? 'Two squares, both with a positive number in front. A square is never negative, so the whole thing can only be zero when both brackets are zero — which only happens at the origin. That is the proof, and it is short.'
            : a > 0 && rest === 0
              ? 'Only one square left. It hits zero along a whole line, not just at the origin — which is exactly what “semi” means. Drag x onto the dashed line and watch the read-out land on 0.'
              : 'The leftover piece has the wrong sign, so the two parts fight each other. Drag x into the red region and the read-out goes negative.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={a > 0} label={`top-left > 0 ${a > 0 ? '✓' : '✗'}`} />
        <Chip on={det > 0} label={`det > 0 ${det > 0 ? '✓' : '✗'}`} />
        <Chip on={here > 0} label={`xᵀAx at this x: ${here.toFixed(2)}`} />
      </div>

      <LabNote>
        Why anyone cares: a positive definite matrix means an optimisation problem has one bottom and no dead flat
        directions. Every training run that behaves itself is leaning on this.
      </LabNote>
    </LabBox>
  )
}
