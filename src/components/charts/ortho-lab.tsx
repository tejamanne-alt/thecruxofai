'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2
const fmt = (v: number) => (Math.abs(v) < 1e-10 ? '0' : Number.isInteger(v) ? String(v) : v.toFixed(3))
const pad = (s: string, n: number) => s.padStart(n)

type Pt = { x: number; y: number }

const dotOf = (a: Pt, b: Pt) => a.x * b.x + a.y * b.y
const lenOf = (a: Pt) => Math.sqrt(dotOf(a, a))

/* ========================================================================== */
/* Part 15 — orthogonal matrices                                              */
/* ========================================================================== */

export function RotationLab() {
  const [deg, setDeg] = useState(35)
  const [x, setX] = useState<Pt>({ x: 3, y: 1 })
  const [y, setY] = useState<Pt>({ x: -1, y: 2.5 })
  const [scaleBreak, setScaleBreak] = useState(false)

  const th = (deg * Math.PI) / 180
  // A 2-D rotation: the deck's example of an orthogonal matrix (slide 18).
  // The "broken" variant scales one axis, so it stops being orthogonal.
  const k = scaleBreak ? 1.6 : 1
  const A = [
    [Math.cos(th), -Math.sin(th)],
    [k * Math.sin(th), k * Math.cos(th)],
  ]
  const ap = (p: Pt): Pt => ({ x: A[0][0] * p.x + A[0][1] * p.y, y: A[1][0] * p.x + A[1][1] * p.y })

  const Ax = ap(x)
  const Ay = ap(y)

  // AᵀA, computed rather than assumed
  const ATA = [
    [A[0][0] * A[0][0] + A[1][0] * A[1][0], A[0][0] * A[0][1] + A[1][0] * A[1][1]],
    [A[0][1] * A[0][0] + A[1][1] * A[1][0], A[0][1] * A[0][1] + A[1][1] * A[1][1]],
  ]
  const isOrth =
    Math.abs(ATA[0][0] - 1) < 1e-9 &&
    Math.abs(ATA[1][1] - 1) < 1e-9 &&
    Math.abs(ATA[0][1]) < 1e-9 &&
    Math.abs(ATA[1][0]) < 1e-9

  const angBefore = (Math.acos(clamp(dotOf(x, y) / (lenOf(x) * lenOf(y)), -1, 1)) * 180) / Math.PI
  const angAfter = (Math.acos(clamp(dotOf(Ax, Ay) / (lenOf(Ax) * lenOf(Ay)), -1, 1)) * 180) / Math.PI

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    // before: faint. after: solid.
    g.globalAlpha = 0.3
    arrow(g, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 2)
    arrow(g, f.px(0), f.py(0), f.px(y.x), f.py(y.y), ORANGE, 2)
    g.globalAlpha = 1
    arrow(g, f.px(0), f.py(0), f.px(Ax.x), f.py(Ax.y), acc, 3)
    arrow(g, f.px(0), f.py(0), f.px(Ay.x), f.py(Ay.y), ORANGE, 3)
    // the unit circle, to make length preservation visible
    g.strokeStyle = 'rgba(9,9,11,0.14)'
    g.lineWidth = 1.5
    g.beginPath()
    g.arc(f.px(0), f.py(0), f.px(1) - f.px(0), 0, Math.PI * 2)
    g.stroke()
    grip(g, f.px(x.x), f.py(x.y), acc, 6)
    grip(g, f.px(y.x), f.py(y.y), ORANGE, 6)
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!scaleBreak} label="a true rotation" onClick={() => setScaleBreak(false)} />
        <Chip on={scaleBreak} label="rotation with one axis stretched" onClick={() => setScaleBreak(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={String(scaleBreak)}
          handles={(f) => [
            { id: 'x', px: f.px(x.x), py: f.py(x.y) },
            { id: 'y', px: f.px(y.x), py: f.py(y.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) }
            if (id === 'x') setX(p)
            else setY(p)
          }}
          caption="Faint arrows are the originals, solid ones are after multiplying by A. Drag either original, or turn the dial."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>θ, the angle of rotation</span>
              <span className="text-zinc-500">{deg}°</span>
            </div>
            <RangeInput label="theta" value={deg} min={0} max={360} step={5} onChange={setDeg} />
          </div>
          <ReadOutGrid
            items={[
              { label: '‖x‖ before', value: fmt(lenOf(x)) },
              { label: '‖Ax‖ after', value: fmt(lenOf(Ax)) },
              { label: 'angle before', value: `${angBefore.toFixed(1)}°` },
              { label: 'angle after', value: `${angAfter.toFixed(1)}°` },
            ]}
          />
          <PanelNote>
            Turn the dial through a full circle. With a true rotation the top two rows always match, and so do the
            bottom two — whatever θ you choose and wherever you drag the arrows.
          </PanelNote>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
        {`A = [ ${pad(fmt(A[0][0]), 7)}  ${pad(fmt(A[0][1]), 7)} ]        AᵀA = [ ${pad(fmt(ATA[0][0]), 6)}  ${pad(fmt(ATA[0][1]), 6)} ]
    [ ${pad(fmt(A[1][0]), 7)}  ${pad(fmt(A[1][1]), 7)} ]              [ ${pad(fmt(ATA[1][0]), 6)}  ${pad(fmt(ATA[1][1]), 6)} ]

‖Ax‖² = (Ax)ᵀ(Ax) = xᵀAᵀAx = xᵀ${isOrth ? 'I' : '(AᵀA)'}x${isOrth ? ' = xᵀx = ‖x‖²' : '  ← and AᵀA is not I, so nothing cancels'}`}
      </pre>

      <Verdict ok={isOrth}>
        {isOrth ? (
          <>
            AᵀA came out as the identity, so A is <strong>orthogonal</strong> and Aᵀ = A⁻¹. That single fact is why
            lengths survive: ‖Ax‖² = xᵀAᵀAx = xᵀIx = xᵀx. Angles survive for the same reason — the numerator and both
            lengths in cos ω are each left alone.
          </>
        ) : (
          <>
            <strong>Not orthogonal.</strong> AᵀA is not the identity, so xᵀAᵀAx does not collapse back to xᵀx and
            lengths change. Watch the top two read-outs disagree as you turn the dial.
          </>
        )}
      </Verdict>

      <LabNote>
        Two names for one thing, and the deck uses both. A matrix is called <strong>orthogonal</strong> when its columns
        are <strong>orthonormal</strong> — mutually at right angles <em>and</em> each of length 1. The name is a
        historical accident: “orthogonal matrix” really does require the stronger, orthonormal condition.
      </LabNote>
      <LabNote>
        Why are the rows orthonormal too? Because AᵀA = I says Aᵀ is a left inverse and AAᵀ = I says it is a right
        inverse, and for a square matrix those must be the same matrix. So AAᵀ = I as well, which is the same statement
        about rows.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — orthonormal basis                                                */
/* ========================================================================== */

const BASES: Array<{ id: string; label: string; b1: Pt; b2: Pt; note: string }> = [
  {
    id: 'canon',
    label: 'The canonical basis',
    b1: { x: 1, y: 0 },
    b2: { x: 0, y: 1 },
    note: 'e₁ and e₂. Orthonormal, and the one everybody pictures by default.',
  },
  {
    id: 'rot',
    label: 'A rotated pair',
    b1: { x: 0.6, y: 0.8 },
    b2: { x: -0.8, y: 0.6 },
    note: 'Still orthonormal — rotate an orthonormal basis and it stays one. So a basis of this kind is far from unique.',
  },
  {
    id: 'orthonly',
    label: 'Orthogonal, but not unit length',
    b1: { x: 3, y: 1 },
    b2: { x: -1, y: 3 },
    note: 'At right angles, but neither has length 1. This is an orthogonal basis, not an orthonormal one.',
  },
  {
    id: 'neither',
    label: 'A basis that is neither',
    b1: { x: 3, y: 1 },
    b2: { x: 2, y: 2 },
    note: 'Perfectly good as a basis — independent and spanning — but the coordinates now take real work to find.',
  },
]

export function OrthonormalBasisLab() {
  const [pick, setPick] = useState('canon')
  const [v, setV] = useState<Pt>({ x: 2.5, y: 2 })

  const b = BASES.find((x) => x.id === pick)!
  const b1 = b.b1
  const b2 = b.b2

  const d11 = dotOf(b1, b1)
  const d22 = dotOf(b2, b2)
  const d12 = dotOf(b1, b2)
  const orthogonal = Math.abs(d12) < 1e-9
  const unit = Math.abs(d11 - 1) < 1e-9 && Math.abs(d22 - 1) < 1e-9
  const orthonormal = orthogonal && unit

  // Coordinates of v. With an orthonormal basis they are just inner products;
  // otherwise the 2×2 system has to be solved properly.
  const det = b1.x * b2.y - b2.x * b1.y
  const c1 = Math.abs(det) < 1e-12 ? 0 : (v.x * b2.y - b2.x * v.y) / det
  const c2 = Math.abs(det) < 1e-12 ? 0 : (b1.x * v.y - v.x * b1.y) / det
  const shortcut1 = dotOf(v, b1)
  const shortcut2 = dotOf(v, b2)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    // the grid this basis induces
    g.strokeStyle = 'rgba(79,70,229,0.16)'
    g.lineWidth = 1
    for (let i = -6; i <= 6; i++) {
      g.beginPath()
      g.moveTo(f.px(b1.x * i - b2.x * 8), f.py(b1.y * i - b2.y * 8))
      g.lineTo(f.px(b1.x * i + b2.x * 8), f.py(b1.y * i + b2.y * 8))
      g.stroke()
      g.beginPath()
      g.moveTo(f.px(b2.x * i - b1.x * 8), f.py(b2.y * i - b1.y * 8))
      g.lineTo(f.px(b2.x * i + b1.x * 8), f.py(b2.y * i + b1.y * 8))
      g.stroke()
    }
    arrow(g, f.px(0), f.py(0), f.px(b1.x), f.py(b1.y), TEAL, 3)
    arrow(g, f.px(0), f.py(0), f.px(b2.x), f.py(b2.y), ORANGE, 3)
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), acc, 3)
    grip(g, f.px(v.x), f.py(v.y), acc, 7)
    return f
  }

  return (
    <LabBox>
      <Presets items={BASES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [{ id: 'v', px: f.px(v.x), py: f.py(v.y), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) => setV({ x: snap(clamp(px, -SPAN, SPAN)), y: snap(clamp(py, -SPAN, SPAN)) })}
          caption="Teal and orange are the basis vectors, blue is the vector being described, and the faint grid is the coordinate system they set up. Press anywhere to move the blue arrow."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: '⟨b₁, b₁⟩', value: fmt(d11) },
              { label: '⟨b₂, b₂⟩', value: fmt(d22) },
              { label: '⟨b₁, b₂⟩', value: fmt(d12) },
              { label: 'orthonormal?', value: orthonormal ? 'yes' : 'no' },
              { label: 'true c₁', value: fmt(c1) },
              { label: '⟨v, b₁⟩', value: fmt(shortcut1) },
              { label: 'true c₂', value: fmt(c2) },
              { label: '⟨v, b₂⟩', value: fmt(shortcut2) },
            ]}
          />
          <PanelNote>{b.note}</PanelNote>
        </div>
      </div>

      <Verdict ok={orthonormal}>
        {orthonormal ? (
          <>
            <strong>Orthonormal.</strong> ⟨bᵢ, bⱼ⟩ = 0 when i ≠ j and 1 when i = j — and look what that buys you: the
            coordinates of v are just ⟨v, b₁⟩ and ⟨v, b₂⟩. The last four read-outs agree in pairs, with no system to
            solve.
          </>
        ) : orthogonal ? (
          <>
            <strong>Orthogonal but not orthonormal.</strong> The two are at right angles, so ⟨b₁, b₂⟩ = 0, but their
            lengths are not 1. The shortcut is now wrong by exactly that length squared — divide ⟨v, bᵢ⟩ by ⟨bᵢ, bᵢ⟩ and
            it comes right again.
          </>
        ) : (
          <>
            <strong>Neither.</strong> ⟨b₁, b₂⟩ = {fmt(d12)}, so the axes are not at right angles and the shortcut fails
            badly — compare the last four rows. Finding coordinates here means solving a system.
          </>
        )}
      </Verdict>

      <LabNote>
        This is the whole reason to want an orthonormal basis. In any basis, finding coordinates means solving a system
        of equations; in an orthonormal one it collapses to taking one inner product per coordinate. For n = 1000 that
        is the difference between a serious computation and an afternoon’s arithmetic.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 17 — Gram–Schmidt, the deck's way                                     */
/* ========================================================================== */

type Row = number[]

/**
 * FORWARD elimination only, on [AᵀA | Aᵀ], recorded step by step.
 *
 * It has to be forward only, and that is the whole subtlety of the method. The
 * elimination is applying L⁻¹, and L⁻¹ is lower triangular — it clears entries
 * *below* each pivot and nothing else. Carrying on into Gauss–Jordan and
 * clearing above the pivots as well would apply an upper-triangular operator
 * too, and the proof QᵀQ = U(L⁻¹)ᵀ no longer holds.
 *
 * This is not a stylistic choice, it is a correctness one. On the deck's own
 * v₁ = (3,1), v₂ = (2,2) the forward-only result is (3/10, 1/10) and
 * (−1/4, 3/4), whose inner product is exactly 0. Continue to the identity and
 * the first row becomes (1/2, −1/2), whose inner product with the second is
 * −1/2 — no longer orthogonal, and the method is destroyed.
 *
 * So the left half finishes as an upper-triangular U with 1s on the diagonal,
 * never as the identity.
 */
function eliminate(rows: Row[]): { steps: Array<{ note: string; rows: Row[] }> } {
  const R = rows.map((r) => [...r])
  const steps: Array<{ note: string; rows: Row[] }> = [
    { note: 'the augmented matrix [ AᵀA | Aᵀ ]', rows: R.map((r) => [...r]) },
  ]
  const n = R.length
  for (let c = 0; c < n; c++) {
    const p = R[c][c]
    if (Math.abs(p) > 1e-12 && Math.abs(p - 1) > 1e-12) {
      R[c] = R[c].map((v) => v / p)
      steps.push({ note: `divide row ${c + 1} by ${fmt(p)} to make the pivot 1`, rows: R.map((r) => [...r]) })
    }
    for (let r = c + 1; r < n; r++) {
      const f = R[r][c]
      if (Math.abs(f) < 1e-12) continue
      R[r] = R[r].map((v, i) => v - f * R[c][i])
      steps.push({
        note: `row ${r + 1} − (${fmt(f)}) × row ${c + 1}, clearing BELOW the pivot in column ${c + 1}`,
        rows: R.map((x) => [...x]),
      })
    }
  }
  return { steps }
}

export function GramSchmidtLab() {
  // The deck's own vectors, slide 22.
  const [v1, setV1] = useState<Pt>({ x: 3, y: 1 })
  const [v2, setV2] = useState<Pt>({ x: 2, y: 2 })
  const [at, setAt] = useState(0)

  // A has the basis vectors as its COLUMNS.
  const A = [
    [v1.x, v2.x],
    [v1.y, v2.y],
  ]
  const AT = [
    [A[0][0], A[1][0]],
    [A[0][1], A[1][1]],
  ]
  const ATA = [
    [AT[0][0] * A[0][0] + AT[0][1] * A[1][0], AT[0][0] * A[0][1] + AT[0][1] * A[1][1]],
    [AT[1][0] * A[0][0] + AT[1][1] * A[1][0], AT[1][0] * A[0][1] + AT[1][1] * A[1][1]],
  ]
  const aug: Row[] = [
    [ATA[0][0], ATA[0][1], AT[0][0], AT[0][1]],
    [ATA[1][0], ATA[1][1], AT[1][0], AT[1][1]],
  ]
  const { steps } = eliminate(aug)
  const step = steps[Math.min(at, steps.length - 1)]
  const done = at >= steps.length - 1

  const out1: Pt = { x: step.rows[0][2], y: step.rows[0][3] }
  const out2: Pt = { x: step.rows[1][2], y: step.rows[1][3] }
  const orthNow = Math.abs(dotOf(out1, out2)) < 1e-9
  const u1: Pt = lenOf(out1) > 1e-12 ? { x: out1.x / lenOf(out1), y: out1.y / lenOf(out1) } : out1
  const u2: Pt = lenOf(out2) > 1e-12 ? { x: out2.x / lenOf(out2), y: out2.y / lenOf(out2) } : out2

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, 4)
    const acc = accentColour()
    g.globalAlpha = 0.32
    arrow(g, f.px(0), f.py(0), f.px(v1.x), f.py(v1.y), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(v2.x), f.py(v2.y), ORANGE, 2.5)
    g.globalAlpha = 1
    if (done) {
      arrow(g, f.px(0), f.py(0), f.px(u1.x), f.py(u1.y), TEAL, 3)
      arrow(g, f.px(0), f.py(0), f.px(u2.x), f.py(u2.y), '#7c3aed', 3)
      g.strokeStyle = 'rgba(9,9,11,0.14)'
      g.lineWidth = 1.5
      g.beginPath()
      g.arc(f.px(0), f.py(0), f.px(1) - f.px(0), 0, Math.PI * 2)
      g.stroke()
    }
    grip(g, f.px(v1.x), f.py(v1.y), acc, 7)
    grip(g, f.px(v2.x), f.py(v2.y), ORANGE, 7)
    return f
  }

  const fmtRow = (r: Row) => `[ ${pad(fmt(r[0]), 7)} ${pad(fmt(r[1]), 7)} | ${pad(fmt(r[2]), 7)} ${pad(fmt(r[3]), 7)} ]`

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
          ← back
        </Btn>
        <Btn primary onClick={() => setAt(Math.min(steps.length - 1, at + 1))} disabled={done}>
          next step →
        </Btn>
        <Btn
          onClick={() => {
            setV1({ x: 3, y: 1 })
            setV2({ x: 2, y: 2 })
            setAt(0)
          }}
        >
          Reset to slide 22
        </Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${v1.x},${v1.y},${v2.x},${v2.y},${at}`}
          handles={(f) => [
            { id: 'v1', px: f.px(v1.x), py: f.py(v1.y) },
            { id: 'v2', px: f.px(v2.x), py: f.py(v2.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: snap(clamp(px, -4, 4)), y: snap(clamp(py, -4, 4)) }
            if (id === 'v1') setV1(p)
            else setV2(p)
            setAt(0)
          }}
          caption="Faint arrows are the basis you started with. Once the elimination finishes, the teal and purple arrows are the orthonormal basis it produced."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'step', value: `${Math.min(at, steps.length - 1) + 1} of ${steps.length}` },
              { label: 'right row 1', value: `(${fmt(out1.x)}, ${fmt(out1.y)})` },
              { label: 'right row 2', value: `(${fmt(out2.x)}, ${fmt(out2.y)})` },
              { label: 'their inner product', value: fmt(dotOf(out1, out2)) },
            ]}
          />
          <PanelNote>
            Drag either faint arrow to change the starting basis, and the whole elimination is redone from scratch on
            your numbers.
          </PanelNote>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
        {`v₁ = (${fmt(v1.x)}, ${fmt(v1.y)})   v₂ = (${fmt(v2.x)}, ${fmt(v2.y)})   as the COLUMNS of A

${step.note}

${fmtRow(step.rows[0])}
${fmtRow(step.rows[1])}
${
  done
    ? `
the two rows on the right are now orthogonal:
    (${fmt(out1.x)}, ${fmt(out1.y)}) · (${fmt(out2.x)}, ${fmt(out2.y)}) = ${fmt(dotOf(out1, out2))}

normalise each to length 1:
    u₁ = (${fmt(u1.x)}, ${fmt(u1.y)})
    u₂ = (${fmt(u2.x)}, ${fmt(u2.y)})`
    : ''
}`}
      </pre>

      <Verdict ok={done && orthNow}>
        {!done ? (
          <>Keep pressing “next step” — the right-hand half is not finished yet.</>
        ) : orthNow ? (
          <>
            The two rows on the right came out with inner product <strong>{fmt(dotOf(out1, out2))}</strong>, so they are
            orthogonal. Normalise them and you have an orthonormal basis for the same space.
          </>
        ) : (
          <>
            These two starting vectors are not independent, so AᵀA is singular and the method has nothing to work with.
            Drag them apart.
          </>
        )}
      </Verdict>

      <LabNote>
        On the deck’s own numbers the elimination ends at <span className="font-mono">[1 0.8 | 0.3 0.1]</span> and{' '}
        <span className="font-mono">[0 1 | −0.25 0.75]</span>, which is what slide 22 prints. Those right-hand rows are
        (3/10, 1/10) and (−1/4, 3/4); their dot product is −3/40 + 3/40 = 0 exactly, and they normalise to (3/√10,
        1/√10) and (−1/√10, 3/√10).
      </LabNote>
      <LabNote>
        Notice the first output is just v₁ pointing the same way. That is Gram–Schmidt’s signature: the first vector is
        kept, and each later one has the part along the earlier ones removed.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 18 — elementary matrices                                              */
/* ========================================================================== */

export function ElementaryMatrixLab() {
  const [target, setTarget] = useState(1)
  const [source, setSource] = useState(0)
  const [mult, setMult] = useState(-2)

  const A = [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2],
  ]
  const E = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : i === target && j === source ? mult : 0)))
  const EA = E.map((row) => [0, 1, 2].map((j) => row.reduce((s, v, k) => s + v * A[k][j], 0)))
  const valid = target !== source

  const sub = (m: number[][]) => m.map((r) => `[ ${r.map((v) => pad(fmt(v), 5)).join(' ')} ]`).join('\n')

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <pre className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-5 font-mono text-[12.5px]/[1.9] text-zinc-800">
          {`E — an identity matrix with ONE extra entry

${sub(E)}

A — the matrix being reduced

${sub(A)}

E·A — the row operation, already done

${sub(EA)}

what happened:  row ${target + 1}  ←  row ${target + 1} ${mult < 0 ? '−' : '+'} ${fmt(Math.abs(mult))} × row ${source + 1}`}
        </pre>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>the row being changed</span>
              <span className="text-zinc-500">row {target + 1}</span>
            </div>
            <RangeInput label="target row" value={target} min={0} max={2} step={1} onChange={setTarget} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>the row being used</span>
              <span className="text-zinc-500">row {source + 1}</span>
            </div>
            <RangeInput label="source row" value={source} min={0} max={2} step={1} onChange={setSource} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>how much of it</span>
              <span className="text-zinc-500">{mult}</span>
            </div>
            <RangeInput label="multiplier" value={mult} min={-3} max={3} step={1} onChange={setMult} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'E is lower triangular?', value: target > source ? 'yes' : target === source ? '—' : 'no' },
              { label: 'det E', value: '1' },
              { label: 'E is invertible?', value: 'always' },
            ]}
          />
          <PanelNote>
            Set the multiplier to −2, the target to row 2 and the source to row 1, and you have slide 25 exactly.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={valid}>
        {valid ? (
          <>
            Multiplying by E did the row operation for you. Every step of Gaussian elimination is a matrix like this
            one, and det E = 1 always, so E can never destroy information — its inverse is the same matrix with the
            multiplier negated.
          </>
        ) : (
          <>
            With the target and source the same row, this is no longer an elementary matrix of the subtraction kind — it
            just scales a row. Move one of the dials.
          </>
        )}
      </Verdict>

      <LabNote>
        The point of the whole detour is this: a row operation, which feels like a procedure you carry out, is really
        just <em>multiplication by a matrix</em>. Once you see that, a sequence of operations becomes a product of
        matrices, and products of matrices are things algebra can reason about.
      </LabNote>
      <LabNote>
        Keep the extra entry <strong>below</strong> the diagonal — target row bigger than source row — and E is lower
        triangular. That fact is doing all the work on the next page.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 19 — A = LU                                                           */
/* ========================================================================== */

export function LuLab() {
  const [a, setA] = useState(4)
  const A = [
    [2, 1, 1],
    [a, -6, 0],
    [-2, 7, 2],
  ]

  // Plain elimination without row swaps, recording the multipliers into L.
  const U = A.map((r) => [...r])
  const L = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  let singular = false
  for (let c = 0; c < 3; c++) {
    if (Math.abs(U[c][c]) < 1e-12) {
      singular = true
      break
    }
    for (let r = c + 1; r < 3; r++) {
      const f = U[r][c] / U[c][c]
      L[r][c] = f
      for (let j = 0; j < 3; j++) U[r][j] -= f * U[c][j]
    }
  }
  const LU = L.map((row) => [0, 1, 2].map((j) => row.reduce((s, v, k) => s + v * U[k][j], 0)))
  const matches = !singular && LU.every((row, i) => row.every((v, j) => Math.abs(v - A[i][j]) < 1e-9))

  const sub = (m: number[][]) => m.map((r) => `[ ${r.map((v) => pad(fmt(v), 7)).join(' ')} ]`).join('\n')

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <pre className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-5 font-mono text-[12.5px]/[1.9] text-zinc-800">
          {singular
            ? `A =
${sub(A)}

A zero turned up in a pivot position, so plain elimination
cannot continue without swapping rows — and a swap is not a
lower-triangular operation. This A has no LU factorisation
of this simple kind. Move the dial.`
            : `A =
${sub(A)}

L — the multipliers, collected           U — the staircase
${sub(L)}     ${''}
${sub(U)}

L · U =
${sub(LU)}          ${matches ? '← the same as A ✓' : '← MISMATCH'}`}
        </pre>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>a₂₁, to change the matrix</span>
              <span className="text-zinc-500">{a}</span>
            </div>
            <RangeInput label="a21" value={a} min={-6} max={6} step={1} onChange={setA} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'L lower triangular?', value: singular ? '—' : 'yes' },
              { label: 'U upper triangular?', value: singular ? '—' : 'yes' },
              { label: 'L·U = A?', value: singular ? 'no factorisation' : matches ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            L holds exactly the multipliers you used, with 1s down the diagonal. Nothing is calculated twice — the
            factorisation is a by-product of the elimination you were doing anyway.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={matches}>
        {matches ? (
          <>
            <strong>A = LU.</strong> Every elimination step was a lower-triangular elementary matrix; their product is
            lower triangular, and so is its inverse. So L⁻¹A = U rearranges to A = LU, which is slide 26 in one line.
          </>
        ) : (
          <>
            No factorisation of this kind here — a pivot hit zero, which needs a row swap, and swaps are not lower
            triangular. In general one writes PA = LU, with P recording the swaps. That is beyond this deck.
          </>
        )}
      </Verdict>

      <LabNote>
        Two facts carry the argument, and both are worth remembering on their own. The product of lower-triangular
        matrices is lower triangular. And the inverse of a lower-triangular matrix is lower triangular. Together they
        say the entire elimination collapses into one lower-triangular L.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 20 — the closing argument                                             */
/* ========================================================================== */

export function FinalArgumentLab() {
  const [v1, setV1] = useState<Pt>({ x: 3, y: 1 })
  const [v2, setV2] = useState<Pt>({ x: 2, y: 2 })

  const A = [
    [v1.x, v2.x],
    [v1.y, v2.y],
  ]
  const AT = [
    [A[0][0], A[1][0]],
    [A[0][1], A[1][1]],
  ]
  const ATA = [
    [AT[0][0] * A[0][0] + AT[0][1] * A[1][0], AT[0][0] * A[0][1] + AT[0][1] * A[1][1]],
    [AT[1][0] * A[0][0] + AT[1][1] * A[1][0], AT[1][0] * A[0][1] + AT[1][1] * A[1][1]],
  ]
  const aug: Row[] = [
    [ATA[0][0], ATA[0][1], AT[0][0], AT[0][1]],
    [ATA[1][0], ATA[1][1], AT[1][0], AT[1][1]],
  ]
  const { steps } = eliminate(aug)
  const last = steps[steps.length - 1].rows
  // Qᵀ is the right-hand half; Q therefore has those rows as its columns.
  const q1: Pt = { x: last[0][2], y: last[0][3] }
  const q2: Pt = { x: last[1][2], y: last[1][3] }
  const QTQ = [
    [dotOf(q1, q1), dotOf(q1, q2)],
    [dotOf(q2, q1), dotOf(q2, q2)],
  ]
  const offDiagZero = Math.abs(QTQ[0][1]) < 1e-9 && Math.abs(QTQ[1][0]) < 1e-9

  const sub = (m: number[][]) => m.map((r) => `[ ${r.map((v) => pad(fmt(v), 8)).join(' ')} ]`).join('\n')

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <pre className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-5 font-mono text-[12.5px]/[1.9] text-zinc-800">
          {`the rows of Qᵀ, straight off the elimination

    q₁ = (${fmt(q1.x)}, ${fmt(q1.y)})
    q₂ = (${fmt(q2.x)}, ${fmt(q2.y)})

QᵀQ =
${sub(QTQ)}

THE ARGUMENT, in three lines
  1.  QᵀQ = L⁻¹Aᵀ A (L⁻¹)ᵀ = U(L⁻¹)ᵀ
      an upper triangular times an upper triangular,
      so QᵀQ is UPPER TRIANGULAR.
  2.  QᵀQ is also SYMMETRIC, because (QᵀQ)ᵀ = QᵀQ
      for any matrix Q at all.
  3.  the only matrices that are both are DIAGONAL.
      so the off-diagonal entries are 0 —
      which is precisely to say the columns of Q
      are orthogonal.        off-diagonal here = ${fmt(QTQ[0][1])}`}
        </pre>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'q₁ · q₂', value: fmt(QTQ[0][1]) },
              { label: 'q₂ · q₁', value: fmt(QTQ[1][0]) },
              { label: 'symmetric?', value: Math.abs(QTQ[0][1] - QTQ[1][0]) < 1e-9 ? 'yes' : 'no' },
              { label: 'diagonal?', value: offDiagZero ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            Drag the two starting vectors on the previous part and come back — whatever independent pair you start from,
            the off-diagonal entries land on zero.
          </PanelNote>
          <div className="grid grid-cols-2 gap-2">
            <Btn
              onClick={() => {
                setV1({ x: 3, y: 1 })
                setV2({ x: 2, y: 2 })
              }}
            >
              Slide 22
            </Btn>
            <Btn onClick={() => setV1({ x: 1, y: 4 })}>Another v₁</Btn>
            <Btn onClick={() => setV2({ x: -3, y: 1 })}>Another v₂</Btn>
            <Btn onClick={() => setV2({ x: 5, y: 2 })}>And another</Btn>
          </div>
        </div>
      </div>

      <Verdict ok={offDiagZero}>
        {offDiagZero ? (
          <>
            The off-diagonal entry is <strong>{fmt(QTQ[0][1])}</strong>, so QᵀQ really is diagonal and the columns of Q
            really are orthogonal. Press the buttons to try other starting vectors — it never fails, because the
            argument never used which vectors they were.
          </>
        ) : (
          <>
            The two starting vectors are dependent, so AᵀA is singular and there is no elimination to speak of. Pick a
            different pair.
          </>
        )}
      </Verdict>

      <LabNote>
        Step 3 is the clever one and it is worth saying slowly. A symmetric matrix has aᵢⱼ = aⱼᵢ. An upper triangular
        matrix has aᵢⱼ = 0 whenever i {'>'} j. Put the two together: below the diagonal everything is 0, and symmetry
        copies those zeros above the diagonal. Nothing is left but the diagonal.
      </LabNote>
    </LabBox>
  )
}
