'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, LabBox, LabNote, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/** The deck's activation, slide 53: strictly greater than zero fires. */
const activate = (z: number) => (z > 0 ? 1 : -1)

/** Paint the two half-planes a weight vector cuts the plane into. */
function shadeSides(g: CanvasRenderingContext2D, f: Frame, w0: number, w1: number, w2: number) {
  const acc = accentColour()
  const step = 10
  g.save()
  g.beginPath()
  g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
  g.clip()
  for (let px = f.L; px < f.R; px += step) {
    for (let py = f.T; py < f.B; py += step) {
      const z = w0 + w1 * f.ux(px) + w2 * f.uy(py)
      g.fillStyle = w1 === 0 && w2 === 0 ? 'rgba(9,9,11,0.03)' : z > 0 ? acc + '1f' : '#dc262614'
      g.fillRect(px, py, step, step)
    }
  }
  // The boundary itself.
  if (w1 !== 0 || w2 !== 0) {
    g.strokeStyle = '#18181b'
    g.lineWidth = 2.5
    g.beginPath()
    if (Math.abs(w2) > 1e-9) {
      g.moveTo(f.px(-10), f.py(-(w0 + w1 * -10) / w2))
      g.lineTo(f.px(10), f.py(-(w0 + w1 * 10) / w2))
    } else {
      g.moveTo(f.px(-w0 / w1), f.T)
      g.lineTo(f.px(-w0 / w1), f.B)
    }
    g.stroke()
  }
  g.restore()
}

/* ========================================================================== */
/* Part 14 — the artificial neuron                                            */
/* ========================================================================== */

export function NeuronLab() {
  const [w0, setW0] = useState(-1)
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(1)
  const [x1, setX1] = useState(1.5)
  const [x2, setX2] = useState(0.5)

  const t0 = w0 * 1
  const t1 = w1 * x1
  const t2 = w2 * x2
  const z = t0 + t1 + t2
  const h = activate(z)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawPlane(g, W, H, 3)
    shadeSides(g, f, w0, w1, w2)
    arrow(g, f.px(0), f.py(0), f.px(w1), f.py(w2), TEAL, 2.5)
    g.fillStyle = TEAL
    g.textAlign = 'left'
    g.fillText('w = (w₁, w₂)', f.px(w1) + 6, f.py(w2) - 8)
    grip(g, f.px(x1), f.py(x2), h > 0 ? accentColour() : RED, 7)
    g.fillStyle = '#52525b'
    g.fillText('x', f.px(x1) + 10, f.py(x2) + 10)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The neuron on slide 49, doing its arithmetic in the open. Drag the input <strong>x</strong> anywhere in the
        plane; the shading is the neuron’s answer everywhere, and the teal arrow is the weight vector.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0, w1, w2, x1, x2 }}
          height={360}
          caption="Press anywhere in the plane to move the input there, then drag. Indigo means the neuron outputs 1; red means −1."
          handles={(f: Frame) => [{ id: 'x', px: f.px(x1), py: f.py(x2), grab: 'anywhere' as const }]}
          onDragTo={(_id, x, y) => {
            setX1(Math.round(clamp(x, -3, 3) * 10) / 10)
            setX2(Math.round(clamp(y, -3, 3) * 10) / 10)
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Output ŷ"
            value={h > 0 ? '+1' : '−1'}
            note={`because z = ${z.toFixed(2)}`}
            tone={h > 0 ? undefined : RED}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12.5px]/[1.9] text-zinc-800">
            <div>
              w₀·x₀ = {w0.toFixed(1)} × 1 = {t0.toFixed(2)}
            </div>
            <div>
              w₁·x₁ = {w1.toFixed(1)} × {x1.toFixed(1)} = {t1.toFixed(2)}
            </div>
            <div>
              w₂·x₂ = {w2.toFixed(1)} × {x2.toFixed(1)} = {t2.toFixed(2)}
            </div>
            <div className="border-t border-zinc-950/[0.08] pt-1 font-semibold" style={{ color: 'var(--acc)' }}>
              z = {z.toFixed(2)}
            </div>
          </div>
          <Slider
            label="w₀ (the bias)"
            value={w0}
            display={w0.toFixed(1)}
            min={-3}
            max={3}
            step={0.1}
            hint="Rides on x₀, which is always 1. It slides the boundary without turning it."
            onChange={setW0}
          />
          <Slider
            label="w₁"
            value={w1}
            display={w1.toFixed(1)}
            min={-3}
            max={3}
            step={0.1}
            hint="How much the first input counts."
            onChange={setW1}
          />
          <Slider
            label="w₂"
            value={w2}
            display={w2.toFixed(1)}
            min={-3}
            max={3}
            step={0.1}
            hint="How much the second counts."
            onChange={setW2}
          />
          <ReadOutGrid
            items={[
              { label: 'z', value: z.toFixed(2) },
              { label: 'ŷ', value: h > 0 ? '+1' : '−1' },
              { label: '‖w‖', value: Math.hypot(w1, w2).toFixed(2) },
              { label: 'x', value: `(${x1.toFixed(1)}, ${x2.toFixed(1)})` },
            ]}
          />
          <PanelNote>
            Set w₁ and w₂ both to 0 and the shading goes flat grey: with no direction to look along, z is just the bias
            and the neuron says the same thing about every input in the world.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15 — the perceptron and its threshold                                 */
/* ========================================================================== */

const POINTS: Array<[number, number]> = [
  [-2.2, 1.6],
  [-1.4, 2.4],
  [-2.6, -0.4],
  [-0.6, 1.2],
  [1.8, -1.4],
  [2.4, 0.6],
  [1.2, -2.4],
  [0.4, -1.8],
]

export function PerceptronThresholdLab() {
  // The boundary as its closest point to the origin. One handle, two degrees of
  // freedom, and no way to end up with a degenerate normal.
  const [nx, setNx] = useState(0.6)
  const [ny, setNy] = useState(0.6)
  const [onBoundary, setOnBoundary] = useState<number | null>(null)

  const len = Math.hypot(nx, ny) || 1e-9
  const w1 = nx / len
  const w2 = ny / len
  const w0 = -len

  const zs = POINTS.map(([a, b]) => w0 + w1 * a + w2 * b)
  const pos = zs.filter((z) => z > 0).length
  const neg = zs.length - pos
  const closest = zs.reduce((best, z, i) => (Math.abs(z) < Math.abs(zs[best]) ? i : best), 0)

  const putOnBoundary = (i: number) => {
    // Move the boundary so this point sits exactly on it, keeping the direction.
    const [a, b] = POINTS[i]
    const d = a * w1 + b * w2
    setNx(w1 * d)
    setNy(w2 * d)
    setOnBoundary(i)
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawPlane(g, W, H, 3)
    shadeSides(g, f, w0, w1, w2)
    arrow(g, f.px(0), f.py(0), f.px(nx), f.py(ny), TEAL, 2.5)
    POINTS.forEach(([a, b], i) => {
      const z = zs[i]
      const exact = Math.abs(z) < 1e-9
      dot(g, f.px(a), f.py(b), 6, exact ? '#18181b' : z > 0 ? accentColour() : RED, exact ? '#fafafa' : null)
    })
    grip(g, f.px(nx), f.py(ny), TEAL)
    return f
  }

  const exactCount = zs.filter((z) => Math.abs(z) < 1e-9).length

  return (
    <LabBox>
      <LabNote>
        Slide 53 in one picture. Press anywhere to move the boundary — the teal arrow points at the side that fires, and
        every dot is recoloured by the sign of its own z.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ nx, ny }}
          height={360}
          caption="The teal grip is the boundary's closest point to the origin. Dragging it turns the boundary and slides it at the same time."
          handles={(f: Frame) => [{ id: 'n', px: f.px(nx), py: f.py(ny), grab: 'anywhere' as const }]}
          onDragTo={(_id, x, y) => {
            setNx(clamp(x, -3, 3))
            setNy(clamp(y, -3, 3))
            setOnBoundary(null)
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Fires (+1)" value={`${pos} of ${POINTS.length}`} note={`${neg} give −1`} />
          <ReadOutGrid
            items={[
              { label: 'w₁', value: w1.toFixed(3) },
              { label: 'w₂', value: w2.toFixed(3) },
              { label: 'w₀ (bias)', value: w0.toFixed(3) },
              { label: 'exactly on it', value: String(exactCount) },
            ]}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Nearest point to the boundary
            </div>
            <div className="font-mono text-[12.5px]/[1.7] text-zinc-800">
              <div>
                x = ({POINTS[closest][0]}, {POINTS[closest][1]})
              </div>
              <div>z = {zs[closest].toFixed(4)}</div>
              <div>
                h = {zs[closest] > 0 ? '+1' : '−1'} {Math.abs(zs[closest]) < 1e-9 ? '  ← z is exactly 0' : ''}
              </div>
            </div>
          </div>
          <Btn onClick={() => putOnBoundary(closest)} primary>
            Put the boundary exactly on that point
          </Btn>
          <Verdict ok={onBoundary === null || exactCount === 0}>
            {exactCount > 0
              ? 'z is exactly 0 for that point, and the deck’s rule sends it to −1: h = 1 only when the sum is strictly greater than 0.'
              : 'No point sits exactly on the boundary at the moment.'}
          </Verdict>
          <PanelNote>
            The ≤ in the second line of slide 53 is not decoration. A point exactly on the boundary has to go somewhere,
            and the deck sends it to −1 — which is also why the NOT gate’s hand solution works even though it makes one
            of its two inequalities an equality.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 21 — the hyperplane, and what ‖w‖ does not do                         */
/* ========================================================================== */

const DIMS = [
  { n: 1, boundary: 'a point', example: 'a single threshold on one measurement' },
  { n: 2, boundary: 'a line', example: 'the picture on this page' },
  { n: 3, boundary: 'a plane', example: 'three features — the last one you can draw' },
  { n: 4, boundary: 'a 3-dimensional flat slice', example: 'four features, and no picture from here on' },
  { n: 784, boundary: 'a 783-dimensional flat slice', example: 'one 28 × 28 image per example' },
]

export function HyperplaneLab() {
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(0.6)
  const [b, setB] = useState(-0.8)
  const [dim, setDim] = useState(2)

  const norm = Math.hypot(w1, w2) || 1e-9
  const distance = -b / norm
  const d = DIMS.find((x) => x.n === dim)!

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawPlane(g, W, H, 3)
    shadeSides(g, f, b, w1, w2)
    arrow(g, f.px(0), f.py(0), f.px(w1), f.py(w2), TEAL, 3)
    // The foot of the perpendicular from the origin: how far the boundary sits.
    const fx = (w1 / norm) * distance
    const fy = (w2 / norm) * distance
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(0))
    g.lineTo(f.px(fx), f.py(fy))
    g.stroke()
    g.setLineDash([])
    dot(g, f.px(fx), f.py(fy), 4, '#18181b')
    grip(g, f.px(w1), f.py(w2), TEAL)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 72: a perceptron is one flat surface cutting the space in two. Drag the teal arrow — the surface stays at
        right angles to it, always.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w1, w2, b }}
          height={360}
          caption="The dashed segment is the perpendicular from the origin to the boundary. Its length is −b ÷ ‖w‖."
          handles={(f: Frame) => [{ id: 'w', px: f.px(w1), py: f.py(w2), grab: 'anywhere' as const }]}
          onDragTo={(_id, x, y) => {
            setW1(Math.round(clamp(x, -3, 3) * 100) / 100)
            setW2(Math.round(clamp(y, -3, 3) * 100) / 100)
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Distance from the origin" value={distance.toFixed(3)} note="−b ÷ ‖w‖" />
          <ReadOutGrid
            items={[
              { label: '‖w‖', value: norm.toFixed(3) },
              { label: 'unit normal', value: `(${(w1 / norm).toFixed(2)}, ${(w2 / norm).toFixed(2)})` },
              { label: 'b', value: b.toFixed(2) },
              { label: 'w · w', value: (norm * norm).toFixed(3) },
            ]}
          />
          <Slider
            label="b (the bias)"
            value={b}
            display={b.toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint="Slides the surface along the arrow without turning it."
            onChange={setB}
          />
          <div className="flex flex-wrap gap-2">
            <Btn
              onClick={() => {
                setW1((v) => v * 2)
                setW2((v) => v * 2)
                setB((v) => v * 2)
              }}
              primary
            >
              Double every weight
            </Btn>
            <Btn
              onClick={() => {
                setW1(1)
                setW2(0.6)
                setB(-0.8)
              }}
            >
              Reset
            </Btn>
          </div>
          <PanelNote>
            Press <strong>Double every weight</strong> and watch: ‖w‖ doubles, w · w quadruples, and the boundary does
            not move a pixel. Scaling all the weights scales z for every input at once, and the sign of z — which is the
            only thing the perceptron reports — is untouched.
          </PanelNote>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              In n dimensions
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {DIMS.map((x) => (
                <button
                  key={x.n}
                  type="button"
                  onClick={() => setDim(x.n)}
                  className="cursor-pointer rounded-md border px-2 py-1 font-mono text-[11.5px] font-semibold"
                  style={
                    x.n === dim
                      ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                      : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#71717a' }
                  }
                >
                  n = {x.n}
                </button>
              ))}
            </div>
            <p className="text-[12.5px]/[1.65] text-zinc-700">
              With n = {d.n} the boundary is <strong>{d.boundary}</strong> — {d.example}. It always has one dimension
              fewer than the space it sits in, which is what the word hyperplane means.
            </p>
          </div>
        </div>
      </div>
    </LabBox>
  )
}
