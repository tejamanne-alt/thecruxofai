'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, dot, drawAxes, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/* ========================================================================== */
/* Part 18 — the tools the deck names                                         */
/* ========================================================================== */

const TOOLS = [
  {
    name: 'Scikit Learn',
    platform: 'Linux, Mac OS, Windows',
    lang: 'Python, C, C++',
    does: 'Classification, regression, clustering, preprocessing, model selection, dimensionality reduction',
    tags: ['classification', 'regression', 'clustering'],
  },
  {
    name: 'PyTorch',
    platform: 'Linux, Mac OS, Windows',
    lang: 'Python, C++',
    does: 'Autograd module, optimisation module, NN module',
    tags: ['neural nets'],
  },
  {
    name: 'TensorFlow',
    platform: 'Linux, Mac OS, Windows',
    lang: 'Python, C++',
    does: 'A library for dataflow programming',
    tags: ['neural nets'],
  },
  {
    name: 'Weka',
    platform: 'Linux, Mac OS, Windows',
    lang: 'Java',
    does: 'Data preparation, classification, regression, clustering, visualisation, association rules mining',
    tags: ['classification', 'regression', 'clustering'],
  },
  {
    name: 'Colab',
    platform: 'Cloud service',
    lang: '—',
    does: 'Supports libraries of PyTorch, Keras, TensorFlow and OpenCV',
    tags: ['neural nets'],
  },
  {
    name: 'Apache Mahout',
    platform: 'Cross-platform',
    lang: 'Java, Scala',
    does: 'Preprocessors, regression, clustering, recommenders, distributed linear algebra',
    tags: ['regression', 'clustering'],
  },
  {
    name: 'Accord.Net',
    platform: 'Cross-platform',
    lang: 'C#',
    does: 'Classification, regression, distribution, clustering, hypothesis tests and kernel methods, image, audio, signal and vision',
    tags: ['classification', 'regression', 'clustering'],
  },
  {
    name: 'Shogun',
    platform: 'Windows, Linux, UNIX, Mac OS',
    lang: 'C++',
    does: 'Regression, classification, clustering, support vector machines, dimensionality reduction, online learning',
    tags: ['classification', 'regression', 'clustering'],
  },
  {
    name: 'Keras.io',
    platform: 'Cross-platform',
    lang: 'Python',
    does: 'API for neural networks',
    tags: ['neural nets'],
  },
] as const

const FILTERS = [
  { id: 'all', label: 'All nine' },
  { id: 'classification', label: 'Does classification' },
  { id: 'regression', label: 'Does regression' },
  { id: 'clustering', label: 'Does clustering' },
  { id: 'neural nets', label: 'Neural networks' },
] as const

export function ToolsLab() {
  const [pick, setPick] = useState<string>('all')
  const shown = TOOLS.filter((t) => pick === 'all' || (t.tags as readonly string[]).includes(pick))
  const pythonish = shown.filter((t) => t.lang.includes('Python')).length

  return (
    <LabBox>
      <Presets items={FILTERS.map((f) => ({ id: f.id, label: f.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="text-left">
                {['Tool', 'Platform', 'Language', 'What it does'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-zinc-950/10 px-2 py-2 text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((t) => (
                <tr key={t.name}>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 font-semibold text-zinc-900">{t.name}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 text-zinc-600">{t.platform}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 font-mono text-zinc-700">{t.lang}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 text-zinc-700">{t.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'shown', value: `${shown.length} of ${TOOLS.length}` },
              { label: 'usable from Python', value: String(pythonish) },
            ]}
          />
          <PanelNote>
            Filter by what you need to do. Notice how many of the general-purpose ones cover classification, regression
            and clustering together — the three tasks the earlier parts introduced.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        For this course the practical answer is <strong>Scikit Learn</strong>: it is Python, it covers all six labs on
        slide 9, and it is the one the lab plan is built around. PyTorch, TensorFlow and Keras become interesting once
        the course reaches neural networks.
      </LabNote>
      <LabNote>
        Worth noticing that the language column is mostly Python or has a Python interface, and that several tools are
        wrappers over the same underlying C and C++ numerical libraries. The choice of tool matters much less than
        understanding what you are asking it to do.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 19 — accuracy against interpretability                                */
/* ========================================================================== */

/**
 * Slide 55's chart, reproduced with its own warning attached. Positions are read
 * off the deck's figure and are qualitative — the slide itself is labelled
 * "unscientific and opinionated", so the page must not present it as measured.
 */
const ALGOS = [
  { name: 'Lasso', acc: 0.18, interp: 0.9 },
  { name: 'Linear / Logistic regression', acc: 0.1, interp: 0.82 },
  { name: 'Decision trees', acc: 0.35, interp: 0.72 },
  { name: 'Naïve Bayes', acc: 0.28, interp: 0.62 },
  { name: 'Bagging', acc: 0.45, interp: 0.6 },
  { name: 'Random forest', acc: 0.86, interp: 0.62 },
  { name: 'Splines', acc: 0.3, interp: 0.45 },
  { name: 'Nearest neighbours', acc: 0.42, interp: 0.4 },
  { name: 'Gaussian / Dirichlet processes', acc: 0.5, interp: 0.3 },
  { name: 'Boosting', acc: 0.66, interp: 0.42 },
  { name: 'Neural nets', acc: 0.55, interp: 0.2 },
  { name: 'SVMs', acc: 0.7, interp: 0.22 },
  { name: 'Deep learning', acc: 0.9, interp: 0.14 },
] as const

export function TradeoffLab() {
  const [sel, setSel] = useState<string | null>(null)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlab: 'Accuracy →', ylab: 'Interpretability →' })
    const acc = accentColour()
    g.strokeStyle = 'rgba(9,9,11,0.12)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.px(0.5), f.T)
    g.lineTo(f.px(0.5), f.B)
    g.moveTo(f.L, f.py(0.5))
    g.lineTo(f.R, f.py(0.5))
    g.stroke()

    for (const a of ALGOS) {
      const on = a.name === sel
      dot(g, f.px(a.acc), f.py(a.interp), on ? 8 : 5, on ? acc : '#71717a', '#fff')
      if (on) {
        g.font = '600 12px ui-sans-serif, system-ui'
        g.fillStyle = '#18181b'
        g.fillText(a.name, f.px(a.acc) + 12, f.py(a.interp) + 4)
      }
    }
    return f
  }

  const a = ALGOS.find((x) => x.name === sel)

  return (
    <LabBox>
      <div
        className="mb-4 rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <strong>The slide carries its own warning:</strong> “Unscientific & opinionated!”, and “on real-world data
        sets”. Treat every position below as one practitioner’s rough impression, not a measurement. It is on the page
        because the shape of the trade-off is worth knowing, not because the coordinates are.
      </div>

      <div className="flex flex-wrap gap-2">
        {ALGOS.map((x) => (
          <Chip
            key={x.name}
            on={x.name === sel}
            label={x.name}
            onClick={() => setSel(x.name === sel ? null : x.name)}
          />
        ))}
      </div>

      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={sel ?? 'none'}
          caption="Press a name to find it on the chart. Top-left is easy to explain and less accurate; bottom-right is accurate and hard to explain."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'selected', value: a ? a.name.split(' ')[0]! : '—' },
              {
                label: 'quadrant',
                value: a ? `${a.acc > 0.5 ? 'high' : 'low'} acc, ${a.interp > 0.5 ? 'high' : 'low'} interp` : '—',
              },
            ]}
          />
          <PanelNote>
            The two exceptions are the interesting part. Random forest sits high on both axes, and deep learning buys
            the last of its accuracy with almost all of its interpretability.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        The rough rule is a diagonal: as accuracy rises, interpretability falls. Linear and logistic regression sit at
        the explainable end — you can read the weights and say what the model is doing. Deep learning sits at the other,
        where the honest answer to “why did it decide that?” is often that nobody knows.
      </LabNote>
      <LabNote>
        This matters more than it sounds. In medicine, credit and law you may be <em>required</em> to explain a
        decision, which rules out the bottom-right corner however accurate it is. Module M11 of this course, model
        evaluation and comparison, is where you learn to make that choice deliberately.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 20 — the workflow                                                     */
/* ========================================================================== */

const STEPS = [
  {
    n: 1,
    q: 'Should I use ML on this problem at all?',
    car: 'Do I really need a model to price a used car, or does a price guide already exist?',
    note: 'The deck puts this first for a reason. The cheapest model is the one you did not build.',
  },
  {
    n: 2,
    q: 'Is there a pattern to detect?',
    car: 'Does price actually depend on mileage and age? If the answer is noise, no algorithm will find a signal.',
    note: 'If there is no pattern, learning cannot invent one. It will happily fit the noise and report success.',
  },
  {
    n: 3,
    q: 'Can I solve it analytically?',
    car: 'Is there a formula? For depreciation there are rules of thumb, but they are crude across brands.',
    note: 'An exact solution beats a learned approximation every time. This is the payroll question from part 6.',
  },
  {
    n: 4,
    q: 'Do I have data?',
    car: 'Survey data and past purchase records — the deck names both.',
    note: 'No data, no learning. Everything after this step assumes you cleared it.',
  },
  {
    n: 5,
    q: 'Gather and organise data',
    car: 'Assemble the survey and purchase history into one table, one car per row.',
    note: 'Usually the longest step in a real project, and the least talked about.',
  },
  {
    n: 6,
    q: 'Preprocess, clean, visualise',
    car: 'Split into a training set and a test set; decide how brand and “is it a cab?” become numbers; plot the data first.',
    note: 'The deck calls this representation of input features and output, plus exploratory data analysis. The train/test split happens here — before you look at the test set, not after.',
  },
  {
    n: 7,
    q: 'Choose a model, a loss and a regulariser',
    car: 'Linear regression, with squared error as the objective function.',
    note: 'Three separate choices. The model says what shapes are allowed, the loss says what counts as a bad fit, and the regulariser says how much complexity you will tolerate.',
  },
  {
    n: 8,
    q: 'Optimise, search hyper-parameters, then analyse and iterate',
    car: 'Set the parameters that minimise the objective, then evaluate on the held-out test set — that is generalisation.',
    note: 'And then go back. The deck says explicitly: analyse performance and mistakes, and iterate back to step 5, or even step 3.',
  },
] as const

export function WorkflowLab() {
  const [at, setAt] = useState(0)
  const [carMode, setCarMode] = useState(true)
  const s = STEPS[at]!

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={carMode} label="With the car-price example" onClick={() => setCarMode(true)} />
        <Chip on={!carMode} label="The general question only" onClick={() => setCarMode(false)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="flex flex-col gap-2">
            {STEPS.map((x, i) => (
              <button
                key={x.n}
                type="button"
                onClick={() => setAt(i)}
                className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-left"
                style={{
                  borderColor: i === at ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                  background: i === at ? 'var(--acc-12)' : i < at ? 'rgba(13,148,136,0.05)' : '#fff',
                }}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                  style={{ background: 'rgba(9,9,11,0.07)', color: '#3f3f46' }}
                >
                  {x.n}
                </span>
                <span className="text-[13.5px]/[1.5] text-zinc-800">{carMode ? x.car : x.q}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Step {s.n} of {STEPS.length}
            </div>
            <div className="mb-2 text-[14px] font-semibold text-zinc-950">{s.q}</div>
            <p className="crux-prose text-[13px]/[1.65] text-zinc-700">{s.note}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
              ← back
            </Btn>
            <Btn primary onClick={() => setAt(Math.min(STEPS.length - 1, at + 1))} disabled={at === STEPS.length - 1}>
              next →
            </Btn>
          </div>
          <PanelNote>
            The first four steps are all questions with a possible answer of “no”. Only after clearing them does any
            modelling start.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={at === STEPS.length - 1}>
        {at === STEPS.length - 1 ? (
          <>
            And then you go round again. The workflow is a <strong>loop</strong>, not a line — the deck says to iterate
            back to step 5, or to step 3 if the model choice itself was wrong.
          </>
        ) : (
          <>
            {STEPS.length - 1 - at} step{STEPS.length - 1 - at === 1 ? '' : 's'} to go. Press through them in order —
            the ordering is the lesson.
          </>
        )}
      </Verdict>

      <LabNote>
        Notice how little of this is the algorithm. One step out of eight picks the model; the rest is deciding whether
        to bother, finding data, cleaning it, and checking honestly whether the result works. That proportion is
        accurate to real projects.
      </LabNote>
      <LabNote>
        The final word on slide 58 is <strong>generalisation</strong> — evaluating on the test set. A model that does
        well on data it trained on has proved nothing at all; the only interesting question is how it behaves on records
        it has never seen, which is the same phrase the classification and regression slides both used.
      </LabNote>
    </LabBox>
  )
}
