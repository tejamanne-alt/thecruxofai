'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, drawNumberLine, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/*
 * Labs for parts 15–18 — the two outlier rules, sampling, and class imbalance.
 *
 * The IQR lab reproduces the lecture's worked exercise exactly, and offers the
 * other quartile convention alongside it, because the slide prints an answer
 * from one method and a formula box from the other.
 */

/* ========================================================================== */
/* Quartiles, both ways                                                       */
/* ========================================================================== */

/** The median of an already-sorted array. */
function medianOf(xs: number[]) {
  const n = xs.length
  if (!n) return NaN
  const mid = n >> 1
  return n % 2 ? xs[mid]! : (xs[mid - 1]! + xs[mid]!) / 2
}

/**
 * Tukey's method: split the sorted values in half, ignoring the middle one if
 * the count is odd, and take the median of each half. This is the method that
 * reproduces the lecture's printed Q1 = 11 and Q3 = 14.5.
 */
function quartilesByHalves(sorted: number[]) {
  const n = sorted.length
  const half = n >> 1
  const lower = sorted.slice(0, half)
  const upper = sorted.slice(n % 2 ? half + 1 : half)
  return { q1: medianOf(lower), q2: medianOf(sorted), q3: medianOf(upper) }
}

/**
 * The formula printed in the box on the same slide: Q1 is the (n+1)/4-th term
 * and Q3 the 3(n+1)/4-th, interpolating between neighbours. It gives a
 * different Q3 on this data, which the page says out loud.
 */
function quartilesByPosition(sorted: number[]) {
  const n = sorted.length
  const at = (pos: number) => {
    const p = clamp(pos, 1, n)
    const lo = Math.floor(p)
    const hi = Math.ceil(p)
    return sorted[lo - 1]! + (p - lo) * (sorted[hi - 1]! - sorted[lo - 1]!)
  }
  return { q1: at((n + 1) / 4), q2: medianOf(sorted), q3: at((3 * (n + 1)) / 4) }
}

/* ========================================================================== */
/* Part 15 — the IQR                                                          */
/* ========================================================================== */

const IQR_DATA = [10, 12, 11, 15, 11, 14, 13, 17, 12, 22, 14, 11]

export function IqrLab() {
  const [vals, setVals] = useState(IQR_DATA)
  const [method, setMethod] = useState<'halves' | 'formula'>('halves')

  const sorted = [...vals].sort((a, b) => a - b)
  const q = method === 'halves' ? quartilesByHalves(sorted) : quartilesByPosition(sorted)
  const iqr = q.q3 - q.q1
  const lo = q.q1 - 1.5 * iqr
  const hi = q.q3 + 1.5 * iqr
  const outliers = sorted.filter((v) => v < lo || v > hi)

  const isDeckCase = vals.length === IQR_DATA.length && vals.every((v, i) => v === IQR_DATA[i])
  const matchesDeck =
    isDeckCase && method === 'halves' && q.q1 === 11 && q.q3 === 14.5 && iqr === 3.5 && lo === 5.75 && hi === 19.75

  const xmin = Math.min(0, Math.floor(Math.min(...sorted, lo) - 2))
  const xmax = Math.ceil(Math.max(...sorted, hi) + 2)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawNumberLine(g, W, H, { xmin, xmax, xlab: 'value', stacks: 5 })
    const acc = accentColour()

    // The fence band, drawn first so the dots sit on top of it.
    g.fillStyle = 'rgba(13,148,136,0.08)'
    g.fillRect(f.px(lo), f.T, f.px(hi) - f.px(lo), f.B - f.T)
    for (const [x, label, colour] of [
      [lo, `Q1 − 1.5·IQR = ${lo}`, '#0d9488'],
      [hi, `Q3 + 1.5·IQR = ${hi}`, '#0d9488'],
    ] as Array<[number, string, string]>) {
      g.strokeStyle = colour
      g.setLineDash([4, 3])
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(f.px(x), f.T)
      g.lineTo(f.px(x), f.B)
      g.stroke()
      g.setLineDash([])
      g.fillStyle = colour
      g.font = '600 10.5px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(label, f.px(x), f.T - 4)
    }

    for (const [x, label] of [
      [q.q1, 'Q1'],
      [q.q2, 'Q2'],
      [q.q3, 'Q3'],
    ] as Array<[number, string]>) {
      g.strokeStyle = 'rgba(9,9,11,0.35)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(f.px(x), f.py(0))
      g.lineTo(f.px(x), f.py(4.4))
      g.stroke()
      g.fillStyle = '#52525b'
      g.font = '600 11px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(`${label} = ${x}`, f.px(x), f.py(4.7))
    }

    // One dot per value, stacked where values repeat.
    const seen = new Map<number, number>()
    for (const v of vals) {
      const k = seen.get(v) ?? 0
      seen.set(v, k + 1)
      const out = v < lo || v > hi
      dot(g, f.px(v), f.py(k * 0.55 + 0.35), 5, out ? '#dc2626' : acc, '#fff')
    }
    // A grip on each value, so it reads as something you can pick up.
    const seen2 = new Map<number, number>()
    for (const v of vals) {
      const k = seen2.get(v) ?? 0
      seen2.set(v, k + 1)
      grip(g, f.px(v), f.py(k * 0.55 + 0.35), v < lo || v > hi ? '#dc2626' : acc, 5)
    }
    return f
  }

  function handles(f: Frame) {
    const seen = new Map<number, number>()
    return vals.map((v, i) => {
      const k = seen.get(v) ?? 0
      seen.set(v, k + 1)
      return { id: String(i), px: f.px(v), py: f.py(k * 0.55 + 0.35), label: `value ${i + 1}, currently ${v}` }
    })
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'halves' as const, label: 'Median of each half (the lecture’s answer)' },
          { id: 'formula' as const, label: 'The (n+1)/4 formula in the box' },
        ]}
        at={method}
        onPick={setMethod}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={300}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${method}-${vals.length}`}
          handles={handles}
          onDragTo={(id, x) => {
            const i = Number(id)
            const v = Math.round(clamp(x, xmin, xmax))
            setVals(vals.map((old, j) => (j === i ? v : old)))
          }}
          caption="Drag any dot along the line, or focus one and use the arrow keys. The quartiles, the fences and the verdict all recompute."
        />

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Outliers"
            value={outliers.length ? outliers.join(', ') : 'none'}
            tone={outliers.length ? '#dc2626' : '#0d9488'}
            note={`outside ${lo} … ${hi}`}
          />
          <ReadOutGrid
            items={[
              { label: 'Q1', value: String(q.q1) },
              { label: 'Q2 (median)', value: String(q.q2) },
              { label: 'Q3', value: String(q.q3) },
              { label: 'IQR', value: String(iqr) },
            ]}
          />
          <Btn onClick={() => setVals(IQR_DATA)}>Back to the lecture’s numbers</Btn>
          <PanelNote>Sorted: {sorted.join(', ')}</PanelNote>
        </div>
      </div>

      <Verdict ok={matchesDeck}>
        {matchesDeck ? (
          <>
            Every printed number reproduced: Q1 = 11, Q2 = 12.5, Q3 = 14.5, IQR = 3.5, Min = 5.75, Max = 19.75, and{' '}
            <strong>the outlier is 22</strong>.
          </>
        ) : isDeckCase && method === 'formula' ? (
          <>
            Same data, other method — and Q3 comes out at <strong>14.75</strong>, not the 14.5 the slide prints. See the
            note below: the answer on the slide and the formula in the box on the slide do not use the same convention.
          </>
        ) : (
          <>You have moved a value, so this is no longer the lecture’s exercise. Press the button to put it back.</>
        )}
      </Verdict>

      <div
        className="rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <div>
          <strong>Two things on slide 39 disagree, and it is worth knowing which to trust.</strong> The worked answer
          gives Q3 = 14.5, which is what you get by taking the median of the upper half, 13, 14, 14, 15, 17, 22. The
          “Quartile Formula” box beside it says Q3 is the 3(n+1)/4-th term, which for n = 12 is the 9.75th term and
          works out at 14.75. Switch the buttons above and you can see both. It does not change the answer to the
          question — <strong>22 is an outlier either way</strong>, since 22 exceeds 19.75 and also exceeds 20.375 — but
          if you are asked to show working, use the method the lecture’s own answer used.
        </div>
        <div className="mt-2">
          The same box also prints “Quartile Formula for Q2 = Q3 − Q1 (Equivalent to Median)”. Q3 − Q1 is the
          interquartile range, not the median; the median of this data is 12.5 while Q3 − Q1 is 3.5. Take that line as a
          slip in the slide rather than a definition.
        </div>
      </div>

      <LabNote>
        The rule itself is short enough to memorise: <strong>IQR = Q3 − Q1</strong>, and anything below{' '}
        <strong>Q1 − 1.5 × IQR</strong> or above <strong>Q3 + 1.5 × IQR</strong> is called an outlier. The deck’s second
        example is the easy one to check in your head — Q1 = 10, Q3 = 20, so IQR = 10, and the fences land on −5 and 35.
      </LabNote>
      <LabNote>
        Why 1.5? The deck does not say, and neither will this page beyond the honest answer: it is a convention, chosen
        because on data that really is normally distributed it flags roughly one point in 150 rather than one in three.
        Nothing derives it.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — three sigma                                                      */
/* ========================================================================== */

/** Abramowitz and Stegun 7.1.26 — good to about 1.5e−7, which is plenty here. */
function erf(x: number) {
  const s = x < 0 ? -1 : 1
  const a = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * a)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a)
  return s * y
}

/** P(|Z| < k) for a standard normal. */
function within(k: number) {
  return erf(k / Math.SQRT2)
}

export function SigmaLab() {
  const [mu, setMu] = useState(50)
  const [sd, setSd] = useState(5)
  const [k, setK] = useState(3)
  const [test, setTest] = useState(67)

  const lo = mu - k * sd
  const hi = mu + k * sd
  const isOut = test < lo || test > hi
  const z = sd === 0 ? NaN : (test - mu) / sd
  const cover = within(k) * 100
  const matchesDeck = mu === 50 && sd === 5 && k === 3 && lo === 35 && hi === 65

  const xmin = mu - 5 * sd
  const xmax = mu + 5 * sd
  const peak = 1 / (sd * Math.sqrt(2 * Math.PI))

  function pdf(x: number) {
    const t = (x - mu) / sd
    return Math.exp(-0.5 * t * t) / (sd * Math.sqrt(2 * Math.PI))
  }

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin, xmax, ymin: 0, ymax: peak * 1.15, xlab: 'value', ylab: 'density' })
    const acc = accentColour()

    // Shade what falls inside the fences.
    g.beginPath()
    g.moveTo(f.px(lo), f.py(0))
    for (let i = 0; i <= 200; i++) {
      const x = lo + (i / 200) * (hi - lo)
      g.lineTo(f.px(x), f.py(pdf(x)))
    }
    g.lineTo(f.px(hi), f.py(0))
    g.closePath()
    g.fillStyle = 'rgba(13,148,136,0.14)'
    g.fill()

    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = xmin + (i / 300) * (xmax - xmin)
      const px = f.px(x)
      const py = f.py(pdf(x))
      if (i === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.strokeStyle = '#18181b'
    g.lineWidth = 1.8
    g.stroke()

    for (const [x, label] of [
      [lo, `μ − ${k}σ = ${lo}`],
      [hi, `μ + ${k}σ = ${hi}`],
    ] as Array<[number, string]>) {
      g.strokeStyle = '#0d9488'
      g.setLineDash([4, 3])
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(f.px(x), f.T)
      g.lineTo(f.px(x), f.B)
      g.stroke()
      g.setLineDash([])
      g.fillStyle = '#0d9488'
      g.font = '600 10.5px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(label, f.px(x), f.T + 10)
    }

    dot(g, f.px(test), f.py(pdf(test)), 6, isOut ? '#dc2626' : acc, '#fff')
    grip(g, f.px(test), f.py(pdf(test)), isOut ? '#dc2626' : acc, 7)
    g.fillStyle = isOut ? '#dc2626' : '#3f3f46'
    g.font = '600 11.5px ui-sans-serif, system-ui'
    g.textAlign = 'center'
    g.fillText(`${test.toFixed(1)}`, f.px(test), f.py(pdf(test)) - 16)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${mu}-${sd}-${k}`}
          handles={(f) => [
            {
              id: 'test',
              px: f.px(test),
              py: f.py(pdf(test)),
              grab: 'anywhere',
              label: `the value being tested, ${test.toFixed(1)}`,
            },
          ]}
          onDragTo={(_id, x) => setTest(Math.round(clamp(x, xmin, xmax) * 10) / 10)}
          caption="Press anywhere on the plot to move the value being tested, or focus it and use the arrow keys."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label={`Is ${test.toFixed(1)} an outlier?`}
            value={isOut ? 'Yes' : 'No'}
            tone={isOut ? '#dc2626' : '#0d9488'}
            note={`z = ${Number.isFinite(z) ? z.toFixed(2) : '—'}`}
          />
          <Slider
            label="Mean, μ"
            value={mu}
            display={String(mu)}
            min={0}
            max={100}
            step={1}
            hint="The deck’s example uses 50."
            onChange={setMu}
          />
          <Slider
            label="Standard deviation, σ"
            value={sd}
            display={String(sd)}
            min={1}
            max={20}
            step={1}
            hint="The deck’s example uses 5."
            onChange={setSd}
          />
          <Slider
            label="How many sigma"
            value={k}
            display={`${k}σ`}
            min={1}
            max={4}
            step={1}
            hint="The rule is three. Try the others."
            onChange={setK}
          />
          <ReadOutGrid
            items={[
              { label: 'lower bound', value: String(lo) },
              { label: 'upper bound', value: String(hi) },
            ]}
          />
        </div>
      </div>

      <Verdict ok={matchesDeck}>
        {matchesDeck ? (
          <>
            The deck’s example, reproduced: μ = 50, σ = 5, so the bounds are 50 − 3 × 5 = <strong>35</strong> and 50 + 3
            × 5 = <strong>65</strong>, and anything below 35 or above 65 is an outlier.
          </>
        ) : (
          <>Set μ = 50, σ = 5 and 3σ to get back the deck’s worked example with its bounds of 35 and 65.</>
        )}
      </Verdict>

      <div className="rounded-lg border border-dashed border-zinc-950/20 bg-white px-4 py-3 text-[12.5px]/[1.7] text-zinc-700">
        <strong className="text-zinc-900">How much does ±{k}σ actually cover?</strong> This page works it out from the
        normal distribution rather than quoting it: <strong>{cover.toFixed(2)}%</strong> of the values lie inside. For
        the three-sigma rule that is 99.73%, and the slide rounds it to “99%”. Both are the same claim; if an exam wants
        a figure, 99.7% is the one textbooks print.
      </div>

      <LabNote>
        The two rules answer the same question differently, and the difference matters. The IQR uses{' '}
        <strong>quartiles</strong>, which barely move when you add one extreme value. Three sigma uses the{' '}
        <strong>mean and standard deviation</strong>, and both of those are dragged by the very outlier you are trying
        to find — so a single huge value inflates σ, widens the fences, and can hide itself.
      </LabNote>
      <LabNote>
        The deck is explicit that the sigma rule is “based on the properties of a normal distribution”. On income, which
        is skewed, it is the wrong tool: the deck’s own advice on slide 47 is that income is the example of a skewed
        attribute. Use the IQR there, or take a log first.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 17 — sampling                                                         */
/* ========================================================================== */

const SPECIES = ['Setosa', 'Versicolor', 'Virginica'] as const
const PER_SPECIES = 50
const TRAIN_N = 100

/** The split the deck actually prints for random subsampling. */
const DECK_TRAIN = [38, 28, 34]

/** A deterministic shuffle, so a given seed always gives the same split. */
function splitAt(seed: number) {
  const items: number[] = []
  for (let s = 0; s < 3; s++) for (let i = 0; i < PER_SPECIES; i++) items.push(s)
  // Fisher–Yates driven by the seeded hash.
  for (let i = items.length - 1; i > 0; i--) {
    const r = Math.abs(Math.sin(seed * 977.13 + i * 31.7)) % 1
    const j = Math.floor(r * (i + 1))
    const t = items[i]!
    items[i] = items[j]!
    items[j] = t
  }
  const train = [0, 0, 0]
  for (let i = 0; i < TRAIN_N; i++) train[items[i]!]! += 1
  return train
}

function stratifiedTrain() {
  // 2/3 of 50 is 33.33 per class, which cannot be whole. Take 33 of each and
  // give the remaining place to the last class, so the totals still add to 100.
  const base = Math.floor((PER_SPECIES * TRAIN_N) / (PER_SPECIES * 3))
  const out = [base, base, base]
  let left = TRAIN_N - base * 3
  for (let i = 2; left > 0; i--, left--) out[i]! += 1
  return out
}

export function SamplingLab() {
  const [mode, setMode] = useState<'deck' | 'random' | 'strat'>('deck')
  const [seed, setSeed] = useState(4)

  const train = mode === 'deck' ? DECK_TRAIN : mode === 'strat' ? stratifiedTrain() : splitAt(seed)
  const test = train.map((t) => PER_SPECIES - t)
  const ideal = (PER_SPECIES * TRAIN_N) / (PER_SPECIES * 3)
  const worst = Math.max(...train.map((t) => Math.abs(t - ideal)))

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 3, ymin: 0, ymax: 50, xlab: '', ylab: 'flowers' })
    const acc = accentColour()

    // The proportional level the split should hit, if it were representative.
    g.strokeStyle = 'rgba(9,9,11,0.30)'
    g.setLineDash([5, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.L, f.py(ideal))
    g.lineTo(f.R, f.py(ideal))
    g.stroke()
    g.setLineDash([])
    g.fillStyle = '#71717a'
    g.font = '600 10.5px ui-sans-serif, system-ui'
    g.textAlign = 'left'
    g.fillText(`representative share = ${ideal.toFixed(1)}`, f.L + 6, f.py(ideal) - 5)

    const bw = (f.R - f.L) / 3
    for (let s = 0; s < 3; s++) {
      const x0 = f.L + s * bw + bw * 0.2
      const w = bw * 0.28
      g.fillStyle = acc
      g.fillRect(x0, f.py(train[s]!), w, f.py(0) - f.py(train[s]!))
      g.fillStyle = 'rgba(9,9,11,0.28)'
      g.fillRect(x0 + w + 6, f.py(test[s]!), w, f.py(0) - f.py(test[s]!))

      g.fillStyle = '#3f3f46'
      g.font = '600 11px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(String(train[s]), x0 + w / 2, f.py(train[s]!) - 5)
      g.fillText(String(test[s]), x0 + w * 1.5 + 6, f.py(test[s]!) - 5)
      g.fillStyle = '#71717a'
      g.font = '11px ui-sans-serif, system-ui'
      g.fillText(SPECIES[s]!, f.L + s * bw + bw / 2, f.B + 14)
    }
    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillRect(f.R - 96, f.T + 4, 9, 9)
    g.fillStyle = '#3f3f46'
    g.font = '10.5px ui-sans-serif, system-ui'
    g.fillText('training', f.R - 82, f.T + 12)
    g.fillStyle = 'rgba(9,9,11,0.28)'
    g.fillRect(f.R - 42, f.T + 4, 9, 9)
    g.fillStyle = '#3f3f46'
    g.fillText('test', f.R - 28, f.T + 12)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'deck' as const, label: 'The deck’s own split' },
          { id: 'random' as const, label: 'Simple random, your seed' },
          { id: 'strat' as const, label: 'Stratified' },
        ]}
        at={mode}
        onPick={setMode}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${mode}-${seed}`}
          caption="150 irises, 50 of each. Two thirds go to training and one third to test — the question is which two thirds."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Worst class, off by"
            value={worst.toFixed(1)}
            tone={worst > 2 ? '#dc2626' : '#0d9488'}
            note="flowers away from a representative share"
          />
          <ReadOutGrid
            items={[
              { label: 'training', value: train.join(' / ') },
              { label: 'test', value: test.join(' / ') },
            ]}
          />
          {mode === 'random' && (
            <Slider
              label="Draw a different random sample"
              value={seed}
              display={`seed ${seed}`}
              min={1}
              max={40}
              step={1}
              hint="Every seed is a different honest random split."
              onChange={setSeed}
            />
          )}
          <PanelNote>
            {mode === 'deck'
              ? 'The deck’s numbers: 38 Setosa, 28 Versicolor, 34 Virginica in training, and 12, 22, 16 in test. Each class still adds to 50 — nothing was lost, only misallocated.'
              : mode === 'strat'
                ? 'Stratified sampling draws the two thirds within each class, so the balance is right by construction. These counts are worked out here; the deck names the method but prints no numbers for it.'
                : 'Move the seed and watch the counts wander. Nothing is wrong with any of these draws — that wandering is what “sampling noise” means.'}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={mode === 'strat'}>
        {mode === 'strat' ? (
          <>Every class is within half a flower of its share. The test set now measures what you think it measures.</>
        ) : (
          <>
            Versicolor is over-represented in test and under-represented in training. A model trained on this sees fewer
            Versicolor than it will be judged on — and the deck’s heading for the slide is exactly this: “Issues with
            Subsampling (Independence Violation)”.
          </>
        )}
      </Verdict>

      <LabNote>
        The key principle, in the deck’s own words: using a sample will work almost as well as using the entire data set{' '}
        <strong>if the sample is representative</strong> — and a sample is representative if it has approximately the
        same properties of interest as the original set of data. Everything else on the slide is a way of getting there.
      </LabNote>
      <LabNote>
        The two failure modes are different and the deck separates them. A small sample gives{' '}
        <strong>sampling noise</strong>, and the cure is more data — the deck shows the same picture at 8000, 2000 and
        500 points, and the shape dissolves. A <strong>flawed sampling process</strong> gives{' '}
        <strong>sampling bias</strong>, and more data does not help at all: you just get a bigger sample of the wrong
        people.
      </LabNote>
      <LabNote>
        The three named methods are <strong>simple random</strong>, <strong>stratified</strong> — draw within each group
        so the proportions hold — and <strong>clustered</strong>, where you sample whole groups at a time because
        reaching individuals is impractical.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 18 — imbalanced training sets                                         */
/* ========================================================================== */

export function ImbalanceLab() {
  const [majority, setMajority] = useState(950)
  const [minority, setMinority] = useState(50)
  const [fix, setFix] = useState<'none' | 'under' | 'over'>('none')

  const maj = fix === 'under' ? minority : majority
  const min = fix === 'over' ? majority : minority
  const total = maj + min
  const share = total ? (min / total) * 100 : 0
  // A classifier that always says "majority" scores exactly the majority share.
  const lazy = total ? (maj / total) * 100 : 0

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const top = Math.max(majority, minority, maj, min) * 1.15
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 2, ymin: 0, ymax: top, xlab: '', ylab: 'training rows' })
    const acc = accentColour()
    const bw = (f.R - f.L) / 2
    const bars: Array<[string, number, string]> = [
      ['majority class', maj, 'rgba(9,9,11,0.30)'],
      ['rare class', min, acc],
    ]
    bars.forEach(([label, v, colour], i) => {
      const x0 = f.L + i * bw + bw * 0.25
      const w = bw * 0.5
      g.fillStyle = colour
      g.fillRect(x0, f.py(v), w, f.py(0) - f.py(v))
      g.fillStyle = '#3f3f46'
      g.font = '600 12px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(String(Math.round(v)), x0 + w / 2, f.py(v) - 6)
      g.fillStyle = '#71717a'
      g.font = '11px ui-sans-serif, system-ui'
      g.fillText(label, f.L + i * bw + bw / 2, f.B + 14)
    })
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'none' as const, label: 'Leave it alone' },
          { id: 'under' as const, label: 'Under sample the majority class' },
          { id: 'over' as const, label: 'Over sample the rare class' },
        ]}
        at={fix}
        onPick={setFix}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={300}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${fix}-${majority}-${minority}`}
          caption="The deck’s scenario: building classifiers with an imbalanced training set."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="A classifier that always says “majority”"
            value={`${lazy.toFixed(1)}%`}
            tone={lazy > 90 ? '#dc2626' : undefined}
            note="accuracy, having learnt nothing at all"
          />
          <ReadOutGrid
            items={[
              { label: 'rare class share', value: `${share.toFixed(1)}%` },
              { label: 'rows used', value: String(Math.round(total)) },
            ]}
          />
          <Slider
            label="Majority rows collected"
            value={majority}
            display={String(majority)}
            min={100}
            max={2000}
            step={50}
            hint="Ordinary transactions, say."
            onChange={setMajority}
          />
          <Slider
            label="Rare rows collected"
            value={minority}
            display={String(minority)}
            min={5}
            max={500}
            step={5}
            hint="Fraudulent ones."
            onChange={setMinority}
          />
        </div>
      </div>

      <Verdict ok={Math.abs(share - 50) < 5}>
        {fix === 'none' && (
          <>
            At {share.toFixed(1)}% rare, a model can score {lazy.toFixed(1)}% by never predicting the rare class at all.
            Accuracy is now useless as a measure, and any optimiser pointed at it will happily take that deal.
          </>
        )}
        {fix === 'under' && (
          <>
            Balanced, and you have thrown away {Math.round(majority - minority)} rows of real data to get there. Cheap
            and lossy — fine when the majority class is huge, wasteful when it is not.
          </>
        )}
        {fix === 'over' && (
          <>
            Balanced, and no data was discarded — but the rare rows are now repeated about{' '}
            {(majority / Math.max(1, minority)).toFixed(1)} times each. The model can memorise those few individuals
            instead of learning what makes them rare.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck’s instruction is one line:{' '}
        <strong>
          modify the distribution of training data so that the rare class is well-represented in the training set
        </strong>
        , by under-sampling the majority or over-sampling the rare class. Both are on offer above, and neither is free.
      </LabNote>
      <LabNote>
        One rule the deck does not state and that costs marks: resampling belongs to the <em>training</em> set only.
        Balance the test set as well and you have thrown away the very thing you were trying to measure — how the model
        behaves on the real mix it will meet.
      </LabNote>
    </LabBox>
  )
}
