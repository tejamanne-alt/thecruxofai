'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, drawNumberLine, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

/* ========================================================================== */
/* Part 16 — expectation                                                      */
/* ========================================================================== */

const TOSSES = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT']
const headsIn = (s: string) => s.split('').filter((c) => c === 'H').length

export function ExpectationLab() {
  const [w, setW] = useState([1, 3, 3, 1])
  const [fromCoin, setFromCoin] = useState(true)

  const coin = [0, 1, 2, 3].map((v) => TOSSES.filter((s) => headsIn(s) === v).length)
  const raw = fromCoin ? coin : w
  const total = raw.reduce((a, b) => a + b, 0) || 1
  const p = raw.map((v) => v / total)
  const mu = p.reduce((acc, pv, i) => acc + i * pv, 0)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: -0.6, xmax: 3.6, ymin: 0, ymax: 0.6, xlab: 'x', ylab: 'p(x)' })
    const acc = accentColour()
    const bw = (f.R - f.L) / 9
    p.forEach((pv, i) => {
      g.fillStyle = acc
      g.fillRect(f.px(i) - bw / 2, f.py(pv), bw, f.py(0) - f.py(pv))
      g.fillStyle = '#3f3f46'
      g.textAlign = 'center'
      g.fillText(pv.toFixed(3), f.px(i), f.py(pv) - 10)
    })

    // The balance point. A see-saw pivoting here would sit level.
    const bx = f.px(mu)
    g.strokeStyle = '#09090b'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(bx, f.py(0) + 2)
    g.lineTo(bx - 9, f.py(0) + 17)
    g.lineTo(bx + 9, f.py(0) + 17)
    g.closePath()
    g.fillStyle = '#09090b'
    g.fill()
    g.fillStyle = '#09090b'
    g.textAlign = 'center'
    g.fillText(`μ = ${mu.toFixed(3)}`, bx, f.py(0) + 30)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: true as const, label: 'The coin, tossed 3 times' },
          { id: false as const, label: 'Set the weights yourself' },
        ]}
        at={fromCoin}
        onPick={setFromCoin}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={String(fromCoin)}
          caption="The black wedge is the balance point. Load one side and watch it slide."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          {!fromCoin &&
            raw.map((v, i) => (
              <Slider
                key={i}
                label={`weight on x = ${i}`}
                value={v}
                display={p[i].toFixed(3)}
                min={0}
                max={8}
                step={1}
                hint=""
                onChange={(nv) => setW(w.map((x, j) => (j === i ? nv : x)))}
              />
            ))}
          <ReadOutGrid
            items={[
              { label: 'E[X] = μ', value: mu.toFixed(3) },
              { label: 'Σ p(x)', value: p.reduce((a, b) => a + b, 0).toFixed(3) },
              { label: 'most likely x', value: String(p.indexOf(Math.max(...p))) },
              { label: 'is μ a value?', value: Number.isInteger(mu) ? 'yes, this time' : 'no' },
            ]}
          />
          <PanelNote>
            {fromCoin
              ? 'For three tosses of a fair coin the answer is 1.5 heads — which is not a number of heads you can ever actually get. An expectation is a balance point, not a prediction.'
              : 'Pile the weight onto one value and the balance point slides towards it. That is all the formula Σ x p(x) is doing.'}
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Worked out term by term
        </div>
        <div className="overflow-x-auto font-mono text-[13px]/[1.9] text-zinc-800">
          E[X] = {p.map((pv, i) => `${i}×${pv.toFixed(3)}`).join(' + ')} = <strong>{mu.toFixed(3)}</strong>
        </div>
      </div>

      <LabNote>
        <strong>Expectation</strong> is the average you would settle towards if you ran the experiment forever. Each
        value is weighted by how likely it is, which is exactly what Σ x p(x) says. For a continuous variable the sum
        becomes an integral, ∫ x f(x) dx, but the idea does not change.
      </LabNote>
      <LabNote>
        Slide 31 works one out for Uniform(0, 1): E[X] = ∫₀¹ x·1 dx = [x²/2]₀¹ = <strong>1/2</strong>. Which is the
        middle of the interval, as you would hope.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 17 — variance                                                         */
/* ========================================================================== */

const SLIDE_DATA = [2, 4, 6, 8]

export function VarianceLab() {
  const [xs, setXs] = useState<number[]>([...SLIDE_DATA])
  const [at, setAt] = useState(0)

  const m = mean(xs)
  const devs = xs.map((x) => x - m)
  const sq = devs.map((d) => d * d)
  const ss = sq.reduce((a, b) => a + b, 0)
  const variance = ss / xs.length
  const sd = Math.sqrt(variance)
  const isSlide = xs.length === SLIDE_DATA.length && xs.every((v, i) => v === SLIDE_DATA[i])

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawNumberLine(g, W, H, { xmin: -2, xmax: 12, xlab: 'value', stacks: 6 })
    const acc = accentColour()

    // Each squared deviation drawn as an actual square, which is where the
    // name comes from and why one far-out value dominates everything.
    const scale = (f.R - f.L) / 14
    xs.forEach((x, i) => {
      const d = Math.abs(x - m)
      const side = d * scale
      const x0 = Math.min(f.px(x), f.px(m))
      g.fillStyle = i === at ? 'rgba(13,148,136,0.3)' : 'rgba(9,9,11,0.07)'
      g.fillRect(x0, f.py(0) - side, side, side)
      g.strokeStyle = i === at ? TEAL : 'rgba(9,9,11,0.18)'
      g.lineWidth = 1
      g.strokeRect(x0, f.py(0) - side, side, side)
    })

    g.strokeStyle = 'rgba(9,9,11,0.5)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(m), f.T)
    g.lineTo(f.px(m), f.py(0))
    g.stroke()
    g.setLineDash([])
    g.fillStyle = '#3f3f46'
    g.textAlign = 'center'
    g.fillText(`mean ${m.toFixed(2)}`, f.px(m), f.T + 8)

    xs.forEach((x, i) => {
      grip(g, f.px(x), f.py(0), i === at ? TEAL : acc, i === at ? 8 : 6)
    })
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          handles={(f) => xs.map((x, i) => ({ id: String(i), px: f.px(x), py: f.py(0) }))}
          onDragTo={(id, x) => {
            const i = Number(id)
            setAt(i)
            setXs(xs.map((v, j) => (j === i ? Math.round(clamp(x, -2, 12) * 2) / 2 : v)))
          }}
          caption="Drag any dot. Each shaded square is one squared distance from the mean — the thing the formula adds up."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'mean x̄', value: m.toFixed(3) },
              { label: 'Σ(x − x̄)²', value: ss.toFixed(3) },
              { label: 'variance σ²', value: variance.toFixed(3) },
              { label: 'sd σ', value: sd.toFixed(3) },
            ]}
          />
          <Btn onClick={() => setXs([...SLIDE_DATA])}>Load slide 33’s data</Btn>
          <PanelNote>
            Drag one dot far out to the right. Its square grows much faster than the others, and it ends up dominating
            the total on its own. That is squaring doing its job — and also its main weakness.
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Every step, on the numbers currently on screen
        </div>
        <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`data      ${xs.map((v) => String(v).padStart(7)).join('')}
x − x̄     ${devs.map((v) => v.toFixed(2).padStart(7)).join('')}
(x − x̄)²  ${sq.map((v) => v.toFixed(2).padStart(7)).join('')}

x̄  = ${xs.join(' + ')} over ${xs.length} = ${m.toFixed(3)}
σ² = (${sq.map((v) => v.toFixed(2)).join(' + ')}) / ${xs.length} = ${variance.toFixed(3)}
σ  = √${variance.toFixed(3)} = ${sd.toFixed(3)}`}
        </div>
      </div>

      {isSlide && (
        <Verdict ok>
          These are slide 33’s numbers, and it gets variance = 5 and standard deviation ≈ 2.236 — which is what the
          read-out says.
        </Verdict>
      )}

      <LabNote>
        Careful with the divisor. This lecture divides by <strong>n</strong>, because it is describing the whole
        collection you have. When you are treating your numbers as a <em>sample</em> from something bigger — which is
        what the Statistics course does — you divide by n − 1 instead, and the answer comes out slightly larger. Both
        are correct; they answer different questions.
      </LabNote>
      <LabNote>
        The <strong>standard deviation</strong> is the square root of the variance, and the reason to bother taking that
        root is units. If your data is in metres, the variance is in square metres, which means nothing. The standard
        deviation is back in metres.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 18 — covariance                                                       */
/* ========================================================================== */

const COV_PRESETS = [
  {
    id: 'slide',
    label: 'Slide 35 — a perfect line',
    pts: [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
      { x: 4, y: 8 },
    ],
  },
  {
    id: 'down',
    label: 'Going the other way',
    pts: [
      { x: 1, y: 8 },
      { x: 2, y: 6 },
      { x: 3, y: 4 },
      { x: 4, y: 2 },
    ],
  },
  {
    id: 'none',
    label: 'No pattern at all',
    pts: [
      { x: 1, y: 5 },
      { x: 2, y: 2 },
      { x: 3, y: 8 },
      { x: 4, y: 5 },
    ],
  },
] as const
type CovId = (typeof COV_PRESETS)[number]['id']

export function CovarianceLab() {
  const [pick, setPick] = useState<CovId>('slide')
  const [pts, setPts] = useState<Array<{ x: number; y: number }>>([...COV_PRESETS[0].pts])

  const mx = mean(pts.map((p) => p.x))
  const my = mean(pts.map((p) => p.y))
  const terms = pts.map((p) => ({ dx: p.x - mx, dy: p.y - my, prod: (p.x - mx) * (p.y - my) }))
  const sum = terms.reduce((a, t) => a + t.prod, 0)
  const cov = sum / pts.length
  const isSlide = pick === 'slide'

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 5, ymin: 0, ymax: 10, xlab: 'x', ylab: 'y' })
    const acc = accentColour()

    // The four quadrants around the pair of means. Top-right and bottom-left
    // push the covariance up; the other two pull it down.
    g.fillStyle = 'rgba(13,148,136,0.07)'
    g.fillRect(f.px(mx), f.T, f.R - f.px(mx), f.py(my) - f.T)
    g.fillRect(f.L, f.py(my), f.px(mx) - f.L, f.B - f.py(my))
    g.fillStyle = 'rgba(220,38,38,0.06)'
    g.fillRect(f.L, f.T, f.px(mx) - f.L, f.py(my) - f.T)
    g.fillRect(f.px(mx), f.py(my), f.R - f.px(mx), f.B - f.py(my))

    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.2
    g.beginPath()
    g.moveTo(f.px(mx), f.T)
    g.lineTo(f.px(mx), f.B)
    g.moveTo(f.L, f.py(my))
    g.lineTo(f.R, f.py(my))
    g.stroke()
    g.setLineDash([])

    // One rectangle per point: its area is |(x − x̄)(y − ȳ)|, the term being added.
    pts.forEach((p) => {
      const x0 = Math.min(f.px(p.x), f.px(mx))
      const y0 = Math.min(f.py(p.y), f.py(my))
      const w = Math.abs(f.px(p.x) - f.px(mx))
      const h = Math.abs(f.py(p.y) - f.py(my))
      const positive = (p.x - mx) * (p.y - my) >= 0
      g.strokeStyle = positive ? 'rgba(13,148,136,0.55)' : 'rgba(220,38,38,0.5)'
      g.lineWidth = 1.5
      g.strokeRect(x0, y0, w, h)
    })

    pts.forEach((p) => grip(g, f.px(p.x), f.py(p.y), acc, 7))
    dot(g, f.px(mx), f.py(my), 4, '#09090b')
    return f
  }

  return (
    <LabBox>
      <Presets
        items={COV_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setPts([...COV_PRESETS.find((s) => s.id === id)!.pts])
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => pts.map((p, i) => ({ id: String(i), px: f.px(p.x), py: f.py(p.y) }))}
          onDragTo={(id, x, y) => {
            const i = Number(id)
            setPts(pts.map((p, j) => (j === i ? { x: p.x, y: Math.round(clamp(y, 0, 10) * 2) / 2 } : p)))
            setPick('' as CovId)
          }}
          caption="Drag any point up or down. Teal rectangles push the covariance up, red ones pull it down, and the answer is their signed average."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'x̄', value: mx.toFixed(2) },
              { label: 'ȳ', value: my.toFixed(2) },
              { label: 'Σ products', value: sum.toFixed(2) },
              { label: 'cov(X, Y)', value: cov.toFixed(3) },
            ]}
          />
          <PanelNote>
            {cov > 0.01
              ? 'Positive: when x is above its mean, y tends to be above its mean too. The two move together.'
              : cov < -0.01
                ? 'Negative: when x is above its mean, y tends to be below its. They move in opposite directions.'
                : 'About zero: the teal and red rectangles cancel out, so there is no straight-line pattern either way.'}
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Every term, the way slide 35 lays it out
        </div>
        <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`   x       y     x − x̄    y − ȳ    product
${pts
  .map(
    (p, i) =>
      `${String(p.x).padStart(4)}${String(p.y).padStart(8)}${terms[i].dx.toFixed(1).padStart(9)}${terms[i].dy
        .toFixed(1)
        .padStart(9)}${terms[i].prod.toFixed(2).padStart(11)}`
  )
  .join('\n')}

x̄ = ${mx.toFixed(2)},  ȳ = ${my.toFixed(2)}
cov(X, Y) = (${terms
            .map((t) => t.prod.toFixed(2))
            .join(' + ')
            .replace(/\+ -/g, '− ')}) / ${pts.length} = ${cov.toFixed(3)}`}
        </div>
      </div>

      {isSlide && (
        <Verdict ok>
          Slide 35’s data. The four products are 4.5, 0.5, 0.5 and 4.5, which add to 10, and dividing by n = 4 gives{' '}
          <strong>cov(X, Y) = 2.5</strong>.
        </Verdict>
      )}

      <LabNote>
        <strong>Covariance</strong> asks one question: when x is above its average, is y usually above its average too?
        Multiply the two distances-from-average for each point. Both above or both below gives a positive product; one
        above and one below gives a negative one. Average those products and you have it.
      </LabNote>
      <LabNote>
        The catch is that the number has units — here it would be (units of x)×(units of y) — so its size on its own
        tells you very little. Dividing by the two standard deviations fixes that and gives the{' '}
        <strong>correlation</strong>, which always sits between −1 and 1. That is the next course’s job.
      </LabNote>
    </LabBox>
  )
}
