'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const ORANGE = '#d97706'
const fmt1 = (v: number) => v.toFixed(1)

/* ========================================================================== */
/* Part 9 — the taxonomy                                                      */
/* ========================================================================== */

const BRANCHES = [
  {
    id: 'sup',
    label: 'Supervised',
    feedback: 'Feedback',
    definition: 'The machine learns by using labelled data.',
    problems: 'Regression and classification',
    data: 'Labelled data',
    training: 'External supervision',
    approach: 'Maps the labelled inputs to the known outputs',
    leaves: [
      { target: 'Continuous target variable', method: 'Regression', use: 'Housing price prediction' },
      { target: 'Categorical target variable', method: 'Classification', use: 'Medical imaging' },
    ],
  },
  {
    id: 'unsup',
    label: 'Unsupervised',
    feedback: 'No feedback',
    definition: 'The machine is trained on unlabelled data without any guidance.',
    problems: 'Association and clustering',
    data: 'Unlabelled data',
    training: 'No supervision',
    approach: 'Understands patterns and discovers the output',
    leaves: [
      { target: 'Target variable not available', method: 'Clustering', use: 'Customer segmentation' },
      { target: 'Target variable not available', method: 'Association', use: 'Market basket analysis' },
    ],
  },
  {
    id: 'semi',
    label: 'Semi-supervised',
    feedback: 'Some feedback',
    definition: 'Combines unsupervised and supervised algorithms, on partially laboured data.',
    problems: 'Classification and clustering',
    data: 'A little labelled data and a lot of unlabelled data',
    training: 'Partial supervision',
    approach: 'Uses the few labels to organise the many unlabelled points',
    leaves: [
      { target: 'Categorical target variable', method: 'Classification', use: 'Text classification' },
      { target: 'Categorical target variable', method: 'Clustering', use: 'Lane-finding on GPS data' },
    ],
  },
  {
    id: 'rl',
    label: 'Reinforcement',
    feedback: 'Delayed feedback (rewards / penalty)',
    definition: 'An agent interacts with its environment by performing actions and learning from errors or rewards.',
    problems: 'Reward-based',
    data: 'No predefined data',
    training: 'No supervision',
    approach: 'Follows the trial-and-error method',
    leaves: [
      { target: 'Categorical target variable', method: 'Classification', use: 'Optimised marketing' },
      { target: 'Target variable not available', method: 'Control', use: 'Driverless cars' },
    ],
  },
] as const

export function TypesTreeLab() {
  const [pick, setPick] = useState<string>('sup')
  const b = BRANCHES.find((x) => x.id === pick)!

  return (
    <LabBox>
      <Presets items={BRANCHES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Machine learning types → {b.label} learning
          </div>
          <p className="crux-prose mb-4 text-[13.5px]/[1.7] text-zinc-800">{b.definition}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {b.leaves.map((l) => (
              <div key={l.method} className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3">
                <div className="text-[11px] text-zinc-500">{l.target}</div>
                <div className="my-1 text-[15px] font-semibold text-zinc-950">{l.method}</div>
                <div className="text-[12.5px] text-zinc-600">↳ {l.use}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'feedback', value: b.feedback },
              { label: 'type of data', value: b.data },
              { label: 'type of problems', value: b.problems },
              { label: 'training', value: b.training },
            ]}
          />
          <PanelNote>
            <strong>Approach:</strong> {b.approach}
          </PanelNote>
        </div>
      </div>

      <LabNote>
        Slide 29 sorts the types by one question: <strong>what feedback does the learner get?</strong> Supervised gets
        feedback — the right answer is attached to every example. Unsupervised gets none. Reinforcement gets{' '}
        <strong>delayed</strong> feedback, in the form of rewards and penalties that may arrive long after the action
        that earned them.
      </LabNote>
      <LabNote>
        Notice the same method name appears under different branches. Classification turns up under supervised,
        semi-supervised <em>and</em> reinforcement — the branch is decided by what data you have, not by which algorithm
        you eventually run.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — classification                                                   */
/* ========================================================================== */

/** The deck's tumour-size example: one feature, a binary label. */
const TUMOURS = [
  { x: 1.0, y: 0 },
  { x: 1.4, y: 0 },
  { x: 1.8, y: 0 },
  { x: 2.1, y: 0 },
  { x: 2.6, y: 0 },
  { x: 3.0, y: 0 },
  { x: 2.9, y: 1 },
  { x: 3.4, y: 1 },
  { x: 3.8, y: 1 },
  { x: 4.3, y: 1 },
  { x: 4.9, y: 1 },
  { x: 5.4, y: 1 },
]

export function TumourClassifyLab() {
  const [thr, setThr] = useState(3.2)

  const wrong = TUMOURS.filter((p) => (p.x >= thr ? 1 : 0) !== p.y)
  const missed = TUMOURS.filter((p) => p.y === 1 && p.x < thr).length // called benign, actually malignant
  const falseAlarm = TUMOURS.filter((p) => p.y === 0 && p.x >= thr).length
  const acc = Math.round(((TUMOURS.length - wrong.length) / TUMOURS.length) * 100)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0.5, xmax: 6, ymin: -0.4, ymax: 1.4, xlab: 'Tumour size (x)', ylab: 'Cancer' })
    const acc2 = accentColour()

    // the decision threshold
    g.strokeStyle = acc2
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(thr), f.T)
    g.lineTo(f.px(thr), f.B)
    g.stroke()
    g.fillStyle = 'rgba(79,70,229,0.07)'
    g.fillRect(f.px(thr), f.T, f.R - f.px(thr), f.B - f.T)

    g.font = '11px ui-sans-serif, system-ui'
    g.fillStyle = '#71717a'
    g.fillText('called benign', f.L + 8, f.T + 16)
    g.fillText('called malignant', f.px(thr) + 8, f.T + 16)

    for (const p of TUMOURS) {
      const predicted = p.x >= thr ? 1 : 0
      const ok = predicted === p.y
      dot(g, f.px(p.x), f.py(p.y), 7, p.y === 1 ? RED : TEAL, ok ? '#fff' : '#18181b')
    }
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey="tumour"
          handles={(f) => [{ id: 't', px: f.px(thr), py: (f.T + f.B) / 2, grab: 'anywhere' }]}
          onDragTo={(_id, px) => setThr(Math.round(clamp(px, 0.6, 5.9) * 10) / 10)}
          caption="Teal is benign (y = 0), red is malignant (y = 1). Press anywhere to move the threshold. A dot with a dark ring is one the rule gets wrong."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>threshold</span>
              <span className="text-zinc-500">{fmt1(thr)}</span>
            </div>
            <RangeInput label="threshold" value={thr} min={0.6} max={5.9} step={0.1} onChange={setThr} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'accuracy', value: `${acc}%` },
              { label: 'total wrong', value: String(wrong.length) },
              { label: 'missed cancers', value: String(missed) },
              { label: 'false alarms', value: String(falseAlarm) },
            ]}
          />
          <PanelNote>
            There is no threshold that gets everything right — the two groups overlap. Every choice trades a missed
            cancer against a false alarm.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={wrong.length === 0}>
        {wrong.length === 0 ? (
          <>Everything classified correctly.</>
        ) : (
          <>
            <strong>{wrong.length} wrong</strong> at this threshold: {missed} malignant called benign, and {falseAlarm}{' '}
            benign called malignant. Slide the threshold left and the missed cancers fall while the false alarms rise.
            Which mistake matters more is a <em>medical</em> question, not a mathematical one — and that is why accuracy
            alone is a poor performance measure here.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck writes the setup precisely: given (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ), learn a function{' '}
        <strong>f(x)</strong> to predict y given x, where <strong>y is categorical</strong>. The goal it states is about
        data you have not seen: <em>previously unseen records should be assigned a class as accurately as possible</em>.
      </LabNote>
      <LabNote>
        Slide 36 makes the important extension: x can be <strong>multi-dimensional</strong>, with each dimension a
        different attribute — clump thickness, uniformity of cell size, uniformity of cell shape, age, and so on. The
        threshold here becomes a boundary in many dimensions, but the idea does not change.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — regression                                                       */
/* ========================================================================== */

/**
 * A downward trend with a line the reader fits by hand. The deck's own chart is
 * September Arctic sea ice extent, and it prints no table of values — so these
 * points are illustrative and the page says so rather than inventing data.
 */
const TREND = [
  { x: 1980, y: 7.8 },
  { x: 1984, y: 7.2 },
  { x: 1988, y: 7.5 },
  { x: 1992, y: 7.6 },
  { x: 1996, y: 7.9 },
  { x: 2000, y: 6.3 },
  { x: 2004, y: 6.1 },
  { x: 2008, y: 4.7 },
  { x: 2012, y: 3.6 },
  { x: 2016, y: 4.7 },
]

export function TrendRegressionLab() {
  const [slope, setSlope] = useState(-0.06)
  const [intercept, setIntercept] = useState(7.4)

  const at = (x: number) => intercept + slope * (x - 1980)
  const sse = TREND.reduce((s, p) => s + (p.y - at(p.x)) ** 2, 0)
  const mse = sse / TREND.length

  // least squares, computed so the "best" read-out cannot drift from the data
  const n = TREND.length
  const mx = TREND.reduce((s, p) => s + (p.x - 1980), 0) / n
  const my = TREND.reduce((s, p) => s + p.y, 0) / n
  const sxy = TREND.reduce((s, p) => s + (p.x - 1980 - mx) * (p.y - my), 0)
  const sxx = TREND.reduce((s, p) => s + (p.x - 1980 - mx) ** 2, 0)
  const bestSlope = sxy / sxx
  const bestInt = my - bestSlope * mx
  const bestMse = TREND.reduce((s, p) => s + (p.y - (bestInt + bestSlope * (p.x - 1980))) ** 2, 0) / n

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 1978, xmax: 2020, ymin: 0, ymax: 9, xlab: 'Year', ylab: 'Extent' })
    const acc = accentColour()
    // residuals first, so the dots sit on top
    g.strokeStyle = 'rgba(220,38,38,0.45)'
    g.lineWidth = 1.5
    for (const p of TREND) {
      g.beginPath()
      g.moveTo(f.px(p.x), f.py(p.y))
      g.lineTo(f.px(p.x), f.py(at(p.x)))
      g.stroke()
    }
    g.strokeStyle = acc
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(1978), f.py(at(1978)))
    g.lineTo(f.px(2020), f.py(at(2020)))
    g.stroke()
    for (const p of TREND) dot(g, f.px(p.x), f.py(p.y), 6, '#18181b', '#fff')
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey="trend"
          handles={(f) => [{ id: 'l', px: f.px(1999), py: f.py(at(1999)), grab: 'anywhere' }]}
          onDragTo={(_id, _px, py) => setIntercept(Math.round((py - slope * 19) * 100) / 100)}
          caption="Press anywhere to slide the line up and down; use the dial for its tilt. The red bars are the errors the fit is trying to shrink."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>slope, per year</span>
              <span className="text-zinc-500">{slope.toFixed(3)}</span>
            </div>
            <RangeInput label="slope" value={slope} min={-0.2} max={0.1} step={0.005} onChange={setSlope} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'mean squared error', value: mse.toFixed(3) },
              { label: 'best possible', value: bestMse.toFixed(3) },
              { label: 'best slope', value: bestSlope.toFixed(3) },
              { label: 'best intercept', value: bestInt.toFixed(2) },
            ]}
          />
          <Btn
            primary
            onClick={() => {
              setSlope(Math.round(bestSlope * 200) / 200)
              setIntercept(Math.round(bestInt * 100) / 100)
            }}
          >
            Snap to the best line
          </Btn>
          <PanelNote>
            The error is worked out from the points on screen every time you move something — it is never stored, so it
            cannot fall out of step with the line.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={mse < bestMse * 1.05}>
        {mse < bestMse * 1.05 ? (
          <>
            You are within 5% of the best straight line these points allow. That line has slope {bestSlope.toFixed(3)}.
          </>
        ) : (
          <>
            Mean squared error is {mse.toFixed(3)}; the best any straight line can do here is {bestMse.toFixed(3)}. Keep
            adjusting, or press the button to jump there.
          </>
        )}
      </Verdict>

      <LabNote>
        The definition is <em>word for word the same</em> as classification, with one change. Given (x₁, y₁), …, (xₙ,
        yₙ), learn f(x) to predict y — except now <strong>y is real-valued</strong>. That single difference is what
        separates the two halves of supervised learning.
      </LabNote>
      <LabNote>
        Slide 39 uses September Arctic sea ice extent from 1979 onward, taken from G. Witt,{' '}
        <em>Journal of Statistics Education</em>, volume 21 number 1 (2013). The deck prints the chart but no table of
        numbers, so the points above are <strong>illustrative rather than the deck’s data</strong> — they show the shape
        of the problem, which is a clear downward trend, without putting figures on the page that cannot be checked.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — the supervised workflow                                          */
/* ========================================================================== */

const FLOW = [
  {
    id: 0,
    phase: 'Training',
    label: 'Training images and their labels',
    note: 'You start with examples where somebody has already written down the answer. This is the E in ⟨T, P, E⟩.',
  },
  {
    id: 1,
    phase: 'Training',
    label: 'Feature extraction',
    note: 'Turn each raw image into a list of numbers. This step decides what the model is even able to notice.',
  },
  {
    id: 2,
    phase: 'Training',
    label: 'Training',
    note: 'The learning step. Features and labels go in; a model comes out.',
  },
  {
    id: 3,
    phase: 'Training',
    label: 'Learned model',
    note: 'The program the computer wrote. This is the "Program" box that traditional programming got as an input.',
  },
  {
    id: 4,
    phase: 'Testing',
    label: 'A test image the model has never seen',
    note: 'Held back deliberately. Testing on data the model trained on tells you nothing about how it will behave in use.',
  },
  {
    id: 5,
    phase: 'Testing',
    label: 'The same feature extraction',
    note: 'It must be exactly the same as in training. A different recipe here is one of the most common real-world bugs.',
  },
  {
    id: 6,
    phase: 'Testing',
    label: 'Learned model → prediction',
    note: 'The model sees only the features and returns a label. The true answer is used to score it, never to help it.',
  },
] as const

export function SupervisedFlowLab() {
  const [at, setAt] = useState(0)
  const step = FLOW[Math.min(at, FLOW.length - 1)]!

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
          ← back
        </Btn>
        <Btn primary onClick={() => setAt(Math.min(FLOW.length - 1, at + 1))} disabled={at === FLOW.length - 1}>
          next step →
        </Btn>
        <Btn onClick={() => setAt(0)}>Start again</Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="flex flex-col gap-2">
            {FLOW.map((s) => {
              const on = s.id === at
              const done = s.id < at
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setAt(s.id)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left"
                  style={{
                    borderColor: on ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                    background: on ? 'var(--acc-12)' : done ? 'rgba(13,148,136,0.06)' : '#fff',
                  }}
                >
                  <span
                    className="grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                    style={{
                      background: s.phase === 'Training' ? 'rgba(79,70,229,0.14)' : 'rgba(13,148,136,0.16)',
                      color: s.phase === 'Training' ? '#312e81' : '#115e59',
                    }}
                  >
                    {s.id + 1}
                  </span>
                  <span className="text-[13.5px] text-zinc-800">{s.label}</span>
                  <span className="ml-auto text-[10.5px] tracking-[0.05em] text-zinc-400 uppercase">{s.phase}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'step', value: `${at + 1} of ${FLOW.length}` },
              { label: 'phase', value: step.phase },
            ]}
          />
          <PanelNote>{step.note}</PanelNote>
        </div>
      </div>

      <LabNote>
        The two halves are deliberately mirrored: the <strong>same</strong> feature extraction runs in training and in
        testing, and only the model differs — being built in one and used in the other. Slide 38 draws them as two
        parallel rows for exactly that reason.
      </LabNote>
      <LabNote>
        Slide 37 lists the supervised techniques the course will cover: linear regression, logistic regression, naïve
        Bayes classifiers, support vector machines, decision trees and random forests, and neural networks. Every one of
        them slots into the “Training” box above without changing anything else in the picture.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13 — unsupervised                                                     */
/* ========================================================================== */

const CUSTOMERS = [
  { x: 1.2, y: 1.4 },
  { x: 1.6, y: 1.1 },
  { x: 1.1, y: 2.0 },
  { x: 2.0, y: 1.6 },
  { x: 1.5, y: 1.8 },
  { x: 4.6, y: 4.2 },
  { x: 5.0, y: 4.6 },
  { x: 4.2, y: 4.8 },
  { x: 5.2, y: 4.0 },
  { x: 4.8, y: 5.1 },
  { x: 1.0, y: 4.6 },
  { x: 1.4, y: 5.0 },
  { x: 1.8, y: 4.4 },
]

export function ClusterLab() {
  const [c1, setC1] = useState({ x: 2, y: 2 })
  const [c2, setC2] = useState({ x: 4.5, y: 4.5 })
  const [test, setTest] = useState<{ x: number; y: number } | null>(null)

  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y)
  const assign = (p: { x: number; y: number }) => (d(p, c1) <= d(p, c2) ? 0 : 1)

  const g1 = CUSTOMERS.filter((p) => assign(p) === 0)
  const g2 = CUSTOMERS.filter((p) => assign(p) === 1)
  const within = g1.reduce((s, p) => s + d(p, c1) ** 2, 0) + g2.reduce((s, p) => s + d(p, c2) ** 2, 0)
  const between = d(c1, c2)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 6,
      ymin: 0,
      ymax: 6,
      xlab: '# visits in a month',
      ylab: 'money spent',
    })
    for (const p of CUSTOMERS) {
      const k = assign(p)
      const c = k === 0 ? c1 : c2
      g.strokeStyle = k === 0 ? 'rgba(79,70,229,0.30)' : 'rgba(217,119,6,0.30)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(f.px(p.x), f.py(p.y))
      g.lineTo(f.px(c.x), f.py(c.y))
      g.stroke()
      dot(g, f.px(p.x), f.py(p.y), 6, k === 0 ? accentColour() : ORANGE, '#fff')
    }
    g.strokeStyle = 'rgba(9,9,11,0.5)'
    g.setLineDash([5, 4])
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.px(c1.x), f.py(c1.y))
    g.lineTo(f.px(c2.x), f.py(c2.y))
    g.stroke()
    g.setLineDash([])
    for (const [c, col] of [
      [c1, accentColour()],
      [c2, ORANGE],
    ] as const) {
      g.beginPath()
      g.arc(f.px(c.x), f.py(c.y), 10, 0, Math.PI * 2)
      g.fillStyle = col
      g.fill()
      g.strokeStyle = '#fff'
      g.lineWidth = 2.5
      g.stroke()
    }
    if (test) {
      const k = assign(test)
      g.font = '600 15px ui-sans-serif, system-ui'
      g.fillStyle = k === 0 ? accentColour() : ORANGE
      g.fillText('✕', f.px(test.x) - 5, f.py(test.y) + 5)
    }
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
          jumpKey="cluster"
          handles={(f) => [
            { id: 'c1', px: f.px(c1.x), py: f.py(c1.y) },
            { id: 'c2', px: f.px(c2.x), py: f.py(c2.y) },
          ]}
          onDragTo={(id, px, py) => {
            const p = { x: Math.round(clamp(px, 0, 6) * 10) / 10, y: Math.round(clamp(py, 0, 6) * 10) / 10 }
            if (id === 'c1') setC1(p)
            else setC2(p)
          }}
          caption="Drag the two big circles. Every customer joins the nearer one, and no point carries a label — nobody ever said which group is which."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'in group 1', value: String(g1.length) },
              { label: 'in group 2', value: String(g2.length) },
              { label: 'within-cluster (want small)', value: within.toFixed(2) },
              { label: 'between-centres (want big)', value: between.toFixed(2) },
              { label: 'new customer', value: test ? `(${test.x}, ${test.y})` : 'none yet' },
              {
                label: 'predicted group',
                value: test ? (assign(test) === 0 ? 'group 1' : 'group 2') : '—',
              },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Btn onClick={() => setTest({ x: 3.2, y: 3.4 })}>Add a new customer</Btn>
            <Btn onClick={() => setTest(null)}>Remove</Btn>
          </div>
          <PanelNote>
            The deck’s goal, in its own words: intra-cluster distances minimised and inter-cluster distances maximised.
            Those are the two read-outs above.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={within < 12 && between > 3}>
        {within < 12 && between > 3 ? (
          <>
            Tight groups that sit well apart — within-cluster {within.toFixed(2)}, between-centres {between.toFixed(2)}.
            That is what the goal asks for.
          </>
        ) : (
          <>
            Within-cluster distance is {within.toFixed(2)} and the centres are {between.toFixed(2)} apart. Drag the
            circles into the two obvious clumps and watch the first number fall while the second rises.
          </>
        )}
      </Verdict>

      <LabNote>
        Unsupervised learning is given x₁, x₂, …, xₙ <strong>without labels</strong>, and asked to output the hidden
        structure behind them. There is no y anywhere in the definition, which is why there is no such thing as an
        accuracy score here.
      </LabNote>
      <LabNote>
        Slide 43 makes a point that is easy to miss: unsupervised learning can still have a <strong>test phase</strong>.
        Press “Add a new customer” — a point the model never saw gets assigned to a group by asking which centre is
        closer. That is prediction, done without a single label.
      </LabNote>
      <LabNote>
        The techniques the deck names: k-means, hierarchical cluster analysis and expectation maximisation for
        clustering; and for visualisation and dimensionality reduction, PCA, kernel PCA, locally-linear embedding (LLE)
        and t-SNE.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — reinforcement learning                                           */
/* ========================================================================== */

const RL_STEPS = [
  { n: 1, label: 'Observe', note: 'The agent looks at the environment and reads its current state, sₜ.' },
  {
    n: 2,
    label: 'Select action using policy',
    note: 'The policy is the agent’s current rule for choosing. Early on it is close to guessing.',
  },
  { n: 3, label: 'Action!', note: 'The agent does something, aₜ, and the environment changes because of it.' },
  {
    n: 4,
    label: 'Get reward or penalty',
    note: 'A number, rₜ. Positive for a good action, negative for a bad one. This is the only teaching signal there is.',
  },
  {
    n: 5,
    label: 'Update policy (learning step)',
    note: 'The reward is used to make the good choice more likely next time. This is where learning actually happens.',
  },
  {
    n: 6,
    label: 'Iterate until an optimal policy is found',
    note: 'Repeat, thousands or millions of times. Nothing ever told the agent the right answer — it worked it out by trying.',
  },
] as const

export function RlLoopLab() {
  const [at, setAt] = useState(0)
  const [runs, setRuns] = useState(0)
  const step = RL_STEPS[at]!
  // A made-up but honest picture of learning: the score improves and then flattens.
  const score = Math.round(100 * (1 - Math.exp(-runs / 6)))

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
            <span className="rounded-md border border-zinc-950/15 bg-zinc-50 px-3 py-2 font-semibold">agent</span>
            <span className="text-zinc-400">— action aₜ →</span>
            <span className="rounded-md border border-zinc-950/15 bg-zinc-50 px-3 py-2 font-semibold">environment</span>
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
            <span className="rounded-md border border-zinc-950/15 bg-zinc-50 px-3 py-2 font-semibold">agent</span>
            <span className="text-zinc-400">← observation oₜ, reward rₜ, next state sₜ₊₁ —</span>
            <span className="rounded-md border border-zinc-950/15 bg-zinc-50 px-3 py-2 font-semibold">environment</span>
          </div>
          <div className="flex flex-col gap-2">
            {RL_STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setAt(i)}
                className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left"
                style={{
                  borderColor: i === at ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                  background: i === at ? 'var(--acc-12)' : '#fff',
                }}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(9,9,11,0.08)', color: '#3f3f46' }}
                >
                  {s.n}
                </span>
                <span className="text-[13.5px] text-zinc-800">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <PanelNote>{step.note}</PanelNote>
          <ReadOutGrid
            items={[
              { label: 'step', value: `${step.n} of 6` },
              { label: 'episodes run', value: String(runs) },
              { label: 'how good the policy is', value: `${score}%` },
              { label: 'labels used', value: '0' },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Btn
              primary
              onClick={() => {
                setAt((a) => (a + 1) % RL_STEPS.length)
                if (at === RL_STEPS.length - 1) setRuns((r) => r + 1)
              }}
            >
              Next step
            </Btn>
            <Btn
              onClick={() => {
                setRuns(0)
                setAt(0)
              }}
            >
              Reset
            </Btn>
          </div>
          <PanelNote>
            Go round the loop and the episode counter ticks up. The score curve is illustrative — it shows the shape of
            learning, fast at first and then flattening, not a measurement of anything.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        The deck describes RL as <strong>feedback-based</strong>: the agent learns automatically from feedback{' '}
        <em>without any labelled data</em>, unlike supervised learning. For each good action it gets positive feedback,
        and for each bad one a penalty.
      </LabNote>
      <LabNote>
        The key phrase on slide 44 is that RL solves problems where{' '}
        <strong>decision making is sequential and the goal is long-term</strong> — game playing and robotics being the
        examples. That is what makes the feedback <em>delayed</em>: the move that lost you the game may have been forty
        moves ago.
      </LabNote>
      <LabNote>
        Slide 45’s analogy is a good one to keep. It is similar to the way we learn new things: the agent faces a
        game-like situation, must make a series of decisions, and through trial and error learns what to do and what not
        to do. Every reward <em>reinforces</em> the behaviour that earned it — which is where the name comes from.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15 — semi-supervised                                                  */
/* ========================================================================== */

const SEMI = [
  { x: 1.3, y: 1.5, c: 0 },
  { x: 1.8, y: 2.2, c: 0 },
  { x: 1.1, y: 2.8, c: 0 },
  { x: 2.2, y: 1.2, c: 0 },
  { x: 1.6, y: 3.3, c: 0 },
  { x: 2.6, y: 2.4, c: 0 },
  { x: 4.4, y: 3.9, c: 1 },
  { x: 5.0, y: 4.4, c: 1 },
  { x: 4.0, y: 4.8, c: 1 },
  { x: 4.8, y: 3.4, c: 1 },
  { x: 5.3, y: 4.9, c: 1 },
  { x: 3.9, y: 3.2, c: 1 },
]

export function SemiSupervisedLab() {
  const [labelled, setLabelled] = useState(0)

  // The first `labelled` points of each class carry a label; the rest are grey.
  const isLabelled = (i: number) => {
    const inClass = SEMI.slice(0, i).filter((p) => p.c === SEMI[i]!.c).length
    return inClass < labelled
  }
  const shown = SEMI.filter((_, i) => isLabelled(i)).length
  const canSeparate = labelled >= 1

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 6, ymin: 0, ymax: 6, xlab: 'Feature 1', ylab: 'Feature 2' })
    if (canSeparate) {
      g.strokeStyle = 'rgba(9,9,11,0.35)'
      g.setLineDash([6, 5])
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(0), f.py(5.6))
      g.lineTo(f.px(6), f.py(0.6))
      g.stroke()
      g.setLineDash([])
    }
    SEMI.forEach((p, i) => {
      const lab = isLabelled(i)
      dot(g, f.px(p.x), f.py(p.y), lab ? 7 : 5, lab ? (p.c === 0 ? TEAL : ORANGE) : '#a1a1aa', lab ? '#fff' : null)
    })
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
          jumpKey={String(labelled)}
          caption="Grey dots are unlabelled. Coloured ones have a label. The dashed line is the boundary the few labels make possible."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>labels per class</span>
              <span className="text-zinc-500">{labelled}</span>
            </div>
            <RangeInput label="labels" value={labelled} min={0} max={6} step={1} onChange={setLabelled} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'points', value: String(SEMI.length) },
              { label: 'labelled', value: String(shown) },
              { label: 'unlabelled', value: String(SEMI.length - shown) },
              { label: 'can name the groups?', value: canSeparate ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            At 0 labels this is unsupervised — you can see two clumps but cannot say which is which. One label per class
            is enough to name them both.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={canSeparate}>
        {canSeparate ? (
          <>
            With just {shown} labels out of {SEMI.length}, every point can be assigned. The unlabelled points did the
            hard work of showing where the groups are; the labels only had to say which was which.
          </>
        ) : (
          <>
            No labels at all. The structure is visible — there are clearly two clumps — but nothing tells you what to
            call them. Add one label per class and watch how little it takes.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck defines it as <strong>combining unsupervised and supervised algorithms</strong> on partially labelled
        data — some labelled and a lot of unlabelled. Its example is a photo hosting service such as Google Photos: it
        groups faces by itself, and you name each group once.
      </LabNote>
      <LabNote>
        This matters commercially more than it might sound. Unlabelled data is usually cheap and plentiful; labelled
        data needs a person and is expensive. Semi-supervised learning is what you reach for when you have a warehouse
        of the first and a handful of the second.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — batch, mini-batch, online                                        */
/* ========================================================================== */

const MODES = [
  {
    id: 'batch',
    label: 'Batch',
    chunk: 100,
    memory: 'All of it at once',
    when: 'Data fits in memory and does not change often.',
    note: 'Uses all available data at a time during training. The most stable, and the most expensive — every update looks at everything.',
  },
  {
    id: 'mini',
    label: 'Mini-batch',
    chunk: 10,
    memory: 'One chunk at a time',
    when: 'The usual choice in practice, and what nearly every deep learning framework does by default.',
    note: 'Uses a subset of the available data at a time. A compromise: steadier than one point at a time, cheaper than all of it.',
  },
  {
    id: 'online',
    label: 'Online (incremental)',
    chunk: 1,
    memory: 'One instance at a time',
    when: 'Data arrives continuously and the model must keep up — prices, click streams, sensor feeds.',
    note: 'Uses a single training instance at a time. Can learn from data that never stops arriving, and can never re-examine what it has already seen.',
  },
] as const

export function BatchOnlineLab() {
  const [pick, setPick] = useState<string>('mini')
  const [seen, setSeen] = useState(0)
  const m = MODES.find((x) => x.id === pick)!
  const TOTAL = 100
  const updates = Math.ceil(TOTAL / m.chunk)
  const pct = Math.min(100, seen)

  return (
    <LabBox>
      <Presets
        items={MODES.map((x) => ({ id: x.id, label: x.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setSeen(0)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            100 training examples, fed in {m.label.toLowerCase()} style
          </div>
          <div className="mb-4 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
            {Array.from({ length: TOTAL }, (_, i) => (
              <span
                key={i}
                className="aspect-square rounded-[3px]"
                style={{
                  background:
                    i < pct
                      ? 'var(--acc)'
                      : i < pct + m.chunk && pct < TOTAL
                        ? 'rgba(79,70,229,0.30)'
                        : 'rgba(9,9,11,0.08)',
                }}
              />
            ))}
          </div>
          <pre className="overflow-x-auto font-mono text-[12.5px]/[1.9] text-zinc-800">
            {`examples per update   ${m.chunk}
updates per pass      ${updates}
memory needed         ${m.memory}
examples seen         ${pct} of ${TOTAL}`}
          </pre>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'chunk size', value: String(m.chunk) },
              { label: 'updates', value: String(updates) },
              { label: 'seen', value: `${pct}%` },
              { label: 'can learn live?', value: m.id === 'online' ? 'yes' : 'no' },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Btn primary onClick={() => setSeen((s) => Math.min(TOTAL, s + m.chunk))} disabled={pct >= TOTAL}>
              Feed a chunk
            </Btn>
            <Btn onClick={() => setSeen(0)}>Reset</Btn>
          </div>
          <PanelNote>{m.when}</PanelNote>
        </div>
      </div>

      <LabNote>{m.note}</LabNote>
      <LabNote>
        The trade-off runs one way along the row. Batch gives the steadiest updates and needs the most memory; online
        needs almost none and can keep learning forever, but each update is noisy because it is based on a single
        example. Mini-batch sits between them, which is why it is what almost everybody actually uses.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 17 — instance-based vs model-based                                    */
/* ========================================================================== */

const POINTS = [
  { x: 1.2, y: 4.4, c: 0 },
  { x: 1.8, y: 3.8, c: 0 },
  { x: 2.4, y: 4.6, c: 0 },
  { x: 1.5, y: 5.0, c: 0 },
  { x: 2.9, y: 3.9, c: 0 },
  { x: 2.2, y: 5.2, c: 0 },
  { x: 3.5, y: 4.4, c: 0 },
  { x: 3.8, y: 1.6, c: 1 },
  { x: 4.4, y: 2.2, c: 1 },
  { x: 5.0, y: 1.4, c: 1 },
  { x: 4.1, y: 2.8, c: 1 },
  { x: 5.3, y: 2.4, c: 1 },
  { x: 4.7, y: 1.0, c: 1 },
]

export function InstanceVsModelLab() {
  const [model, setModel] = useState(false)
  const [p, setP] = useState({ x: 3.4, y: 3.0 })

  const dists = POINTS.map((q) => ({ q, d: Math.hypot(q.x - p.x, q.y - p.y) })).sort((a, b) => a.d - b.d)
  const k = 3
  const near = dists.slice(0, k)
  const votes = near.filter((n) => n.q.c === 0).length
  const instanceSays = votes > k / 2 ? 0 : 1
  // The model is one straight boundary: y = x - 0.4 (above it is class 0).
  const modelSays = p.y > p.x - 0.4 ? 0 : 1

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 6, ymin: 0, ymax: 6, xlab: 'Feature 1', ylab: 'Feature 2' })
    if (model) {
      g.strokeStyle = 'rgba(9,9,11,0.55)'
      g.setLineDash([7, 5])
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(f.px(0), f.py(-0.4))
      g.lineTo(f.px(6), f.py(5.6))
      g.stroke()
      g.setLineDash([])
      g.font = '11px ui-sans-serif, system-ui'
      g.fillStyle = '#71717a'
      g.fillText('Model', f.px(4.4), f.py(4.6))
    } else {
      for (const n of near) {
        g.strokeStyle = 'rgba(9,9,11,0.45)'
        g.lineWidth = 1.5
        g.beginPath()
        g.moveTo(f.px(p.x), f.py(p.y))
        g.lineTo(f.px(n.q.x), f.py(n.q.y))
        g.stroke()
      }
    }
    for (const q of POINTS) dot(g, f.px(q.x), f.py(q.y), 6, q.c === 0 ? TEAL : ORANGE, '#fff')
    const says = model ? modelSays : instanceSays
    g.font = '700 16px ui-sans-serif, system-ui'
    g.fillStyle = says === 0 ? TEAL : ORANGE
    g.fillText('✕', f.px(p.x) - 6, f.py(p.y) + 6)
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!model} label="Instance based" onClick={() => setModel(false)} />
        <Chip on={model} label="Model based" onClick={() => setModel(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={String(model)}
          handles={(f) => [{ id: 'p', px: f.px(p.x), py: f.py(p.y), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) =>
            setP({ x: Math.round(clamp(px, 0.2, 5.8) * 10) / 10, y: Math.round(clamp(py, 0.2, 5.8) * 10) / 10 })
          }
          caption="Press anywhere to move the new instance. Instance-based draws lines to its nearest neighbours; model-based draws one boundary and forgets the points."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'this method says', value: (model ? modelSays : instanceSays) === 0 ? 'class A' : 'class B' },
              { label: 'the other says', value: (model ? instanceSays : modelSays) === 0 ? 'class A' : 'class B' },
              { label: 'agree?', value: modelSays === instanceSays ? 'yes' : 'no' },
              { label: 'stores', value: model ? 'one boundary' : `${POINTS.length} points` },
            ]}
          />
          <PanelNote>
            Drag the ✕ into the gap between the two groups and the two methods start disagreeing. Near the middle,
            neither is obviously right.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={modelSays === instanceSays}>
        {modelSays === instanceSays ? (
          <>Both methods agree here. Away from the boundary they usually do.</>
        ) : (
          <>
            <strong>The two methods disagree.</strong> Instance-based looks only at the {k} nearest examples;
            model-based applies one rule fitted to all of them. Close to the boundary, that difference shows.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck’s definitions are one line each. <strong>Instance based:</strong> compare new data points to known data
        points. <strong>Model based:</strong> detect patterns in the training data and build a predictive model.
      </LabNote>
      <LabNote>
        The practical difference is where the cost sits. Instance-based learning does almost nothing at training time
        and all the work when a prediction is asked for — it has to search the stored examples. Model-based does the
        work once, up front, and then predicts almost instantly. It also throws the training data away, which can be a
        feature or a problem depending on who is asking.
      </LabNote>
    </LabBox>
  )
}
