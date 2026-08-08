'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* Part 1 — what the course is                                                */
/* ========================================================================== */

const MODULES = [
  'Fundamentals of Neural Network',
  'Multilayer Perceptron',
  'Deep Feedforward Neural Network',
  'Improve the DNN performance by Optimization and Regularization',
  'Convolutional Neural Networks',
  'Sequence Models',
  'Attention Mechanism',
  'Neural Network Search',
  'Time series Modelling and Forecasting',
  'Other Learning Techniques',
]

const LABS = [
  'L1 Introduction to PyTorch',
  'L2 Deep Neural Network with Back-propagation and optimization',
  'L3 CNN',
  'L4 RNN',
  'L5 LSTM',
  'L6 Auto-encoders',
]

/**
 * The evaluation table from slide 6, made arithmetic.
 *
 * The interesting part is the asterisk: the printed weights add to 105%, and
 * "best of two" on the quizzes is what brings it back to 100. Rather than
 * asserting that, the lab does the sum in front of you and drops the lower
 * quiz, so the 100 is visible rather than claimed.
 */
export function CourseShapeLab() {
  const [q1, setQ1] = useState(70)
  const [q2, setQ2] = useState(40)
  const [a1, setA1] = useState(80)
  const [a2, setA2] = useState(75)
  const [mid, setMid] = useState(60)
  const [comp, setComp] = useState(65)

  const keptQuiz = q1 >= q2 ? 'Quiz I' : 'Quiz II'
  const keptScore = Math.max(q1, q2)

  const rows = [
    { label: keptQuiz, weight: 5, score: keptScore },
    { label: 'Assignment 01', weight: 10, score: a1 },
    { label: 'Assignment 02', weight: 15, score: a2 },
    { label: 'Mid-sem exam', weight: 30, score: mid },
    { label: 'Comprehensive exam', weight: 40, score: comp },
  ]
  const effectiveWeight = rows.reduce((s, r) => s + r.weight, 0)
  const printedWeight = effectiveWeight + 5
  const total = rows.reduce((s, r) => s + (r.weight * r.score) / 100, 0)

  // What the comprehensive alone would have to be to reach 60 overall.
  const withoutComp = total - (40 * comp) / 100
  const needed = ((60 - withoutComp) / 40) * 100

  return (
    <LabBox>
      <LabNote>
        Six components, from slide 6. Move any of them and the weighted total moves. The lower of the two quizzes is
        dropped, because the table marks both with an asterisk reading “Best of Two”.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            What counts, and for how much
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Quiz I', weight: 5, score: q1, dropped: keptQuiz !== 'Quiz I' },
              { label: 'Quiz II', weight: 5, score: q2, dropped: keptQuiz !== 'Quiz II' },
              { label: 'Assignment 01', weight: 10, score: a1, dropped: false },
              { label: 'Assignment 02', weight: 15, score: a2, dropped: false },
              { label: 'Mid-sem exam (closed book)', weight: 30, score: mid, dropped: false },
              { label: 'Comprehensive exam (open book)', weight: 40, score: comp, dropped: false },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span
                  className={`w-[210px] shrink-0 text-[12.5px] font-semibold ${r.dropped ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}
                >
                  {r.label}
                </span>
                <span className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-950/[0.07]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(r.weight / 40) * 100}%`,
                      background: r.dropped ? '#d4d4d8' : '#4f46e5',
                      backgroundColor: r.dropped ? '#d4d4d8' : 'var(--acc)',
                    }}
                  />
                </span>
                <span
                  className={`w-20 shrink-0 text-right font-mono text-[12.5px] ${r.dropped ? 'text-zinc-400' : 'text-zinc-900'}`}
                >
                  {r.weight}% × {r.score}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-950/[0.08] pt-3 font-mono text-[12.5px]/[1.8] text-zinc-700">
            <div>5 + 5 + 10 + 15 + 30 + 40 = {printedWeight} ← the weights as printed</div>
            <div>drop the lower quiz (−5) = {effectiveWeight} ← what actually adds up</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Weighted total"
            value={`${total.toFixed(1)}%`}
            note={`${keptQuiz} counted; the other dropped`}
            tone={total >= 60 ? TEAL : RED}
          />
          <Slider
            label="Quiz I"
            value={q1}
            display={`${q1}`}
            min={0}
            max={100}
            step={1}
            hint="30 minutes, online."
            onChange={setQ1}
          />
          <Slider
            label="Quiz II"
            value={q2}
            display={`${q2}`}
            min={0}
            max={100}
            step={1}
            hint="Also 30 minutes. Only the better of the two counts."
            onChange={setQ2}
          />
          <Slider
            label="Assignment 01"
            value={a1}
            display={`${a1}`}
            min={0}
            max={100}
            step={1}
            hint="Four weeks."
            onChange={setA1}
          />
          <Slider
            label="Assignment 02"
            value={a2}
            display={`${a2}`}
            min={0}
            max={100}
            step={1}
            hint="Four weeks, and worth half again as much as the first."
            onChange={setA2}
          />
          <Slider
            label="Mid-sem exam"
            value={mid}
            display={`${mid}`}
            min={0}
            max={100}
            step={1}
            hint="Two hours, closed book."
            onChange={setMid}
          />
          <Slider
            label="Comprehensive exam"
            value={comp}
            display={`${comp}`}
            min={0}
            max={100}
            step={1}
            hint="Two and a half hours, open book."
            onChange={setComp}
          />
          <PanelNote>
            With everything else where it is, the comprehensive would have to be{' '}
            <strong>
              {needed <= 0 ? 'anything at all' : needed > 100 ? 'more than 100 — out of reach' : needed.toFixed(0)}
            </strong>{' '}
            to reach 60 overall. That 40% is why the last four modules matter as much as the first.
          </PanelNote>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Ten modules</div>
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-[12.5px]/[1.6] text-zinc-700">
            {MODULES.map((m, i) => (
              <li key={m} className={i === 0 ? 'font-semibold text-zinc-950' : undefined}>
                {m}
                {i === 0 ? ' — this session' : ''}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Six labs</div>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-[12.5px]/[1.6] text-zinc-700">
            {LABS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-3 text-[12px]/[1.6] text-zinc-500">
            Textbook: Dive into Deep Learning, Zhang, Lipton, Li and Smola. Reference: Deep Learning, Goodfellow, Bengio
            and Courville.
          </p>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — what makes learning deep                                          */
/* ========================================================================== */

/** Illustrative only — the deck says "increasingly meaningful", never what of. */
const FACE_STACK = [
  'raw pixel brightness',
  'short edges at various angles',
  'corners and blobs made of those edges',
  'eyes, noses, mouths',
  'whole faces',
]

export function DepthStackLab() {
  const [depth, setDepth] = useState(4)
  const [named, setNamed] = useState(false)

  const isDeep = depth >= 3

  return (
    <LabBox>
      <LabNote>
        Slide 12 gives five definitions of deep learning. Only one of them is a test you can apply to a network in front
        of you: three or more layers. Move the slider and see where the word starts to apply.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The stack, bottom to top
          </div>
          {Array.from({ length: depth })
            .map((_, i) => depth - 1 - i)
            .map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
                style={{
                  borderColor: 'rgba(9,9,11,0.1)',
                  background: `rgba(79,70,229,${0.04 + (i / Math.max(1, depth - 1)) * 0.12})`,
                }}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-zinc-900 font-mono text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-[13px] text-zinc-800">
                  {named && depth <= FACE_STACK.length
                    ? FACE_STACK[i]
                    : `representation ${i + 1} — more meaningful than representation ${i}`}
                </span>
              </div>
            ))}
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-950/15 px-3.5 py-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-zinc-200 font-mono text-[11px] font-semibold text-zinc-600">
              0
            </span>
            <span className="text-[13px] text-zinc-500">the data as it arrives</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Depth" value={String(depth)} note="layers that contribute to modelling the data" />
          <Slider
            label="Number of layers"
            value={depth}
            display={String(depth)}
            min={1}
            max={5}
            step={1}
            hint="Slide 15 calls this the depth of the model."
            onChange={(v) => setDepth(Math.round(v))}
          />
          <Verdict ok={isDeep}>
            {isDeep
              ? `${depth} layers — deep, by the "three or more layers" definition on slide 12.`
              : `${depth} layer${depth === 1 ? '' : 's'} — a neural network, but not a deep one by that definition.`}
          </Verdict>
          <Btn onClick={() => setNamed((v) => !v)}>
            {named ? 'Back to generic labels' : 'Show an illustrative example'}
          </Btn>
          <PanelNote>
            The example labels are <strong>not</strong> from the deck. The slides say each layer is more meaningful than
            the one below without ever saying what of, so those five lines are an illustration, not a claim about what a
            real network learns.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — the four rings                                                    */
/* ========================================================================== */

type Ring = 'ai' | 'ml' | 'nn' | 'dl'

const RING_LABEL: Record<Ring, string> = {
  ai: 'Artificial Intelligence',
  ml: 'Machine Learning',
  nn: 'Neural Networks',
  dl: 'Deep Learning',
}

const THINGS: Array<{ id: string; label: string; ring: Ring; why: string; source: string }> = [
  {
    id: 'robot',
    label: 'A robot that cleans a room',
    ring: 'ai',
    why: 'Slide 14 gives this as the example of AI: making a machine perform a human task. If the cleaning route is a set of rules somebody wrote, nothing about it learns, so it never reaches the machine learning ring.',
    source: 'Slide 14',
  },
  {
    id: 'kmeans',
    label: 'k-means clustering',
    ring: 'ml',
    why: 'It learns from experience — the centroids move as it sees the data — so it is machine learning. It has no neurons and no layers, so it stops at the second ring.',
    source: 'Machine Learning course',
  },
  {
    id: 'linreg',
    label: 'Linear regression',
    ring: 'ml',
    why: 'A model whose parameters are fitted to data. Machine learning, and not a neural network — though the next module of this course will point out that a single linear neuron computes exactly the same function.',
    source: 'Machine Learning course',
  },
  {
    id: 'perceptron',
    label: 'A single perceptron',
    ring: 'nn',
    why: 'One artificial neuron with weights it learns. That is a neural network, but with one layer it is not deep by slide 12’s three-or-more test.',
    source: 'Slides 52–53',
  },
  {
    id: 'mlp1',
    label: 'A network with one hidden layer',
    ring: 'nn',
    why: 'Input, one hidden layer, output. It solves XOR, which no single perceptron can — but by the deck’s own counting rule it is still short of deep.',
    source: 'Slide 80',
  },
  {
    id: 'alexnet',
    label: 'A convolutional network with eight layers',
    ring: 'dl',
    why: 'Many successive layers each producing a more meaningful representation than the last. This is the innermost ring, and it is the 2012 AlexNet entry on the timeline.',
    source: 'Slides 15, 19',
  },
]

export function NestingLab() {
  const [pick, setPick] = useState('robot')
  const t = THINGS.find((x) => x.id === pick)!
  const order: Ring[] = ['ai', 'ml', 'nn', 'dl']
  const depth = order.indexOf(t.ring)

  return (
    <LabBox>
      <LabNote>
        Slide 13 draws four circles inside one another, with data science overlapping from the side. Pick something and
        watch how far in it goes — the rings light up down to the one it belongs in, and no further.
      </LabNote>

      <Presets items={THINGS.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative mx-auto aspect-square w-full max-w-[380px] rounded-lg border border-zinc-950/10 bg-white p-2">
          {order.map((r, i) => {
            const on = i <= depth
            const inset = i * 11
            return (
              <div
                key={r}
                className="absolute rounded-full border-2 transition-colors"
                style={{
                  inset: `${inset}%`,
                  borderColor: on ? 'var(--acc)' : 'rgba(9,9,11,0.12)',
                  background: on ? `rgba(79,70,229,${0.05 + i * 0.03})` : 'transparent',
                  backgroundColor: on ? undefined : 'transparent',
                }}
              >
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-center text-[11px] font-semibold whitespace-nowrap"
                  style={{ top: 6, color: on ? 'var(--acc)' : '#a1a1aa' }}
                >
                  {RING_LABEL[r]}
                </span>
              </div>
            )
          })}
          <div
            className="absolute rounded-full border-2 border-dashed"
            style={{
              // Kept clear of the innermost ring on purpose: slide 13 has data
              // science reaching into the outer rings, not into deep learning.
              right: '-10%',
              top: '30%',
              width: '42%',
              height: '42%',
              borderColor: 'rgba(217,119,6,0.5)',
              background: 'rgba(217,119,6,0.06)',
            }}
          >
            <span
              className="absolute inset-0 grid place-items-center text-center text-[11px] font-semibold"
              style={{ color: AMBER }}
            >
              Data
              <br />
              Science
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Innermost ring it reaches" value={RING_LABEL[t.ring]} note={`from ${t.source}`} />
          <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{t.why}</p>
          <ReadOutGrid
            items={order.map((r, i) => ({ label: RING_LABEL[r], value: i <= depth ? 'inside' : 'outside' }))}
          />
          <PanelNote>
            Data science is drawn overlapping rather than nested, and that is deliberate: plenty of data science does no
            learning at all, and plenty of deep learning is nobody’s idea of data science.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — scale drives progress                                             */
/* ========================================================================== */

const CURVES = [
  { id: 'trad', name: 'Traditional learning algorithms', ceiling: 0.55, rate: 8.3, colour: RED },
  { id: 'small', name: 'Small neural network', ceiling: 0.68, rate: 4.55, colour: AMBER },
  { id: 'medium', name: 'Medium neural network', ceiling: 0.82, rate: 2.63, colour: '#2563eb' },
  { id: 'large', name: 'Large neural network', ceiling: 0.97, rate: 1.61, colour: TEAL },
]

/** Derived on every render — nothing about a curve is ever stored. */
function perf(c: (typeof CURVES)[number], m: number) {
  return c.ceiling * (1 - Math.exp(-c.rate * m))
}

export function ScaleLab() {
  const [m, setM] = useState(0.6)

  const scores = CURVES.map((c) => ({ ...c, y: perf(c, m) })).sort((a, b) => b.y - a.y)
  const best = scores[0]
  const gap = best.y - scores[1].y
  // The slide annotates the left-hand end "small training sets" precisely
  // because the ordering there is not reliable. Say so rather than pick a winner.
  const tooEarly = m < 0.12 || gap < 0.02

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 1,
      ymin: 0,
      ymax: 1,
      xlab: 'amount of labelled data (m) — no units on the slide',
      ylab: 'performance — no units',
    })

    // The region the slide brackets and calls "small training sets".
    g.fillStyle = 'rgba(9,9,11,0.05)'
    g.fillRect(f.L, f.T, f.px(0.12) - f.L, f.B - f.T)
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'left'
    g.fillText('small training sets', f.L + 4, f.T + 12)

    for (const c of CURVES) {
      g.strokeStyle = c.colour
      g.lineWidth = 2.2
      g.beginPath()
      for (let i = 0; i <= 120; i++) {
        const x = i / 120
        const y = perf(c, x)
        if (i === 0) g.moveTo(f.px(x), f.py(y))
        else g.lineTo(f.px(x), f.py(y))
      }
      g.stroke()
      g.fillStyle = c.colour
      g.textAlign = 'right'
      g.fillText(c.name.replace(' neural network', ' NN'), f.R - 4, f.py(perf(c, 1)) - 9)
    }

    g.strokeStyle = 'rgba(9,9,11,0.45)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(m), f.T)
    g.lineTo(f.px(m), f.B)
    g.stroke()
    g.setLineDash([])
    grip(g, f.px(m), f.B, accentColour())

    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 18 is a hand-drawn sketch by Andrew Ng with no numbers on either axis. This redraws its shape — four
        curves that all rise and flatten, with the bigger networks flattening later and higher. No values are invented,
        because the slide has none to reproduce; what it does show is the order in which the curves cross.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ m }}
          height={340}
          caption="Press or drag anywhere along the plot to move the amount of data."
          handles={(f: Frame) => [{ id: 'm', px: f.px(m), py: f.B, grab: 'anywhere' as const }]}
          onDragTo={(_id, x) => setM(clamp(x, 0, 1))}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Best at this much data"
            value={tooEarly ? 'Too early to say' : best.name.replace(' neural network', ' NN')}
            note={
              tooEarly
                ? 'the curves are too close to separate here'
                : `ahead by ${(gap * 100).toFixed(0)} on the unlabelled scale`
            }
            tone={tooEarly ? '#71717a' : best.colour}
          />
          <Slider
            label="Amount of labelled data"
            value={m}
            display={m.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            hint="The slide writes this m, and marks each example (x, y) — labelled data, not just data."
            onChange={setM}
          />
          <ReadOutGrid
            items={CURVES.map((c) => ({
              label: c.name.replace(' neural network', ' NN'),
              value: perf(c, m).toFixed(2),
            }))}
          />
          <PanelNote>
            Drag all the way left and the read-out refuses to name a winner. That is the slide’s own point: in the
            bracketed region it labels “small training sets”, which method wins depends on hand-engineered features and
            not on the size of the network.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — the timeline                                                      */
/* ========================================================================== */

const EVENTS = [
  { year: 1943, name: 'Artificial Neuron', note: 'McCulloch and Pitts. A neuron written down as arithmetic.' },
  { year: 1950, name: 'Turing Test', note: 'A test for machine intelligence stated without any machine to run it on.' },
  { year: 1956, name: 'Birth of AI', note: 'The field gets its name.' },
  { year: 1957, name: 'Perceptron', note: 'Rosenblatt. The unit this whole session is about, and a rule to train it.' },
  { year: 1959, name: 'ADALINE', note: 'A neuron trained on the sum of squared errors rather than on mistakes alone.' },
  { year: 1969, name: 'XOR Problem', note: 'Minsky and Papert. The limit you will meet in part 23 of this chapter.' },
  { year: 1980, name: 'Neocognitron', note: 'Layered, position-tolerant vision. The ancestor of the CNN.' },
  {
    year: 1986,
    name: 'Backpropagation',
    note: 'A way to train the hidden layers the XOR fix needs. Module 3 of this course.',
  },
  {
    year: 1989,
    name: 'UAT',
    note: 'The universal approximation theorem: one hidden layer, wide enough, can fit anything continuous.',
  },
  {
    year: 1995,
    name: 'SVMs',
    note: 'A rival with better theory and less appetite for data. The second winter starts here.',
  },
  { year: 1998, name: 'CNN', note: 'LeCun. Convolution made to work on real digits.' },
  { year: 2006, name: 'RBM Initialization', note: 'A way to start deep networks off well enough to train at all.' },
  {
    year: 2012,
    name: 'AlexNet',
    note: 'Deep learning wins an image competition outright, and the field never looks back.',
  },
  { year: 2014, name: 'GAN', note: 'Two networks trained against each other.' },
  { year: 2017, name: 'Transformer', note: 'Attention alone. Module 7 of this course.' },
  { year: 2020, name: 'GPT-3', note: 'Scale as a research programme.' },
  { year: 2022, name: 'ChatGPT', note: 'The last mark on the deck’s timeline.' },
]

/**
 * The deck draws five bands but prints no boundary years, so the boundaries
 * here are set at the labelled events they sit against on the slide. The lab
 * says so rather than presenting them as printed facts.
 */
const AGES = [
  { from: 1940, to: 1957, name: 'Before the first golden age', golden: false },
  { from: 1957, to: 1969, name: 'First Golden Age', golden: true },
  { from: 1969, to: 1986, name: 'First Dark Age', golden: false },
  { from: 1986, to: 1995, name: 'Second Golden Age', golden: true },
  { from: 1995, to: 2006, name: 'Second Dark Age', golden: false },
  { from: 2006, to: 2026, name: 'Third Golden Age', golden: true },
]

export function TimelineLab() {
  const [year, setYear] = useState(1969)

  const nearest = EVENTS.reduce((best, e) => (Math.abs(e.year - year) < Math.abs(best.year - year) ? e : best))
  const age = AGES.find((a) => year >= a.from && year < a.to) ?? AGES[AGES.length - 1]
  const onEvent = Math.abs(nearest.year - year) <= 1

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const L = 30
    const R = W - 20
    const B = H - 30
    const T = 20
    const f: Frame = {
      L,
      R,
      T,
      B,
      px: (v) => L + ((v - 1940) / (2026 - 1940)) * (R - L),
      py: () => B,
      ux: (p) => 1940 + ((p - L) / (R - L)) * (2026 - 1940),
      uy: () => 0,
    }

    for (const a of AGES) {
      g.fillStyle = a.golden ? 'rgba(217,119,6,0.10)' : 'rgba(9,9,11,0.05)'
      g.fillRect(f.px(a.from), T, f.px(a.to) - f.px(a.from), B - T - 22)
      g.fillStyle = a.golden ? '#b45309' : '#a1a1aa'
      g.textAlign = 'center'
      const mid = (f.px(a.from) + f.px(a.to)) / 2
      if (f.px(a.to) - f.px(a.from) > 60) g.fillText(a.name, mid, T + 10)
    }

    g.fillStyle = '#18181b'
    g.fillRect(L, B - 20, R - L, 18)
    for (let y = 1940; y <= 2020; y += 10) {
      g.fillStyle = '#fafafa'
      g.textAlign = 'center'
      g.fillText(String(y), f.px(y), B - 11)
    }

    for (const e of EVENTS) {
      const x = f.px(e.year)
      const hot = e.year === nearest.year
      g.strokeStyle = hot ? accentColour() : 'rgba(9,9,11,0.35)'
      g.lineWidth = hot ? 2.5 : 1
      g.beginPath()
      g.moveTo(x, B - 22)
      g.lineTo(x, T + 22)
      g.stroke()
      if (hot) {
        g.fillStyle = accentColour()
        g.textAlign = 'center'
        g.fillText(`${e.name} ${e.year}`, Math.max(L + 50, Math.min(x, R - 50)), T + 16)
      }
    }

    const xh = f.px(year)
    g.strokeStyle = 'rgba(9,9,11,0.55)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(xh, T)
    g.lineTo(xh, B)
    g.stroke()
    g.setLineDash([])
    grip(g, xh, B - 11, accentColour())
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Seventeen dated marks from slide 19. Drag along the bar; the nearest one is named, and the band you are standing
        in is read back to you.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ year }}
          height={220}
          caption="Press anywhere on the bar to jump there, then drag."
          handles={(f: Frame) => [{ id: 'y', px: f.px(year), py: f.B - 11, grab: 'anywhere' as const }]}
          onDragTo={(_id, x) => setYear(Math.round(clamp(x, 1940, 2026)))}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Year" value={String(year)} note={age.name} tone={age.golden ? AMBER : '#71717a'} />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              {onEvent ? 'You are standing on' : 'Nearest mark'}
            </div>
            <div className="text-[15px] font-semibold text-zinc-950">
              {nearest.name} {nearest.year}
            </div>
            <p className="mt-1 text-[12.5px]/[1.6] text-zinc-600">{nearest.note}</p>
          </div>
          <Slider
            label="Year"
            value={year}
            display={String(year)}
            min={1940}
            max={2026}
            step={1}
            hint="Every year on the deck's timeline, and the gaps between them."
            onChange={(v) => setYear(Math.round(v))}
          />
          <PanelNote>
            The deck marks the golden and dark ages as bands without printing where they start and stop. The boundaries
            used here are placed at the labelled events they sit against on the slide — 1957, 1969, 1986, 1995, 2006 —
            so they can be checked against the picture rather than taken on trust.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 6 — applications                                                      */
/* ========================================================================== */

type Shape = 'number' | 'category' | 'structured'

const SHAPE_LABEL: Record<Shape, string> = {
  number: 'One number out',
  category: 'One category out',
  structured: 'Something structured — neither',
}

const APPS: Array<{
  id: string
  app: string
  input: string
  output: string
  net: string
  shape: Shape
  why: string
}> = [
  {
    id: 'estate',
    app: 'Real Estate',
    input: 'House features',
    output: 'House Price',
    net: 'Std NN',
    shape: 'number',
    why: 'A price is a real number, so this is regression by the definition from the ML course: the target is numerical. "Std NN" on the slide means an ordinary stack of fully connected layers — no convolution, no recurrence.',
  },
  {
    id: 'tagging',
    app: 'Photo Tagging',
    input: 'Image',
    output: 'Text',
    net: 'CNN',
    shape: 'category',
    why: 'A tag is one of a fixed list of labels, so it is classification. The network is convolutional because the input is an image and neighbouring pixels belong together.',
  },
  {
    id: 'detect',
    app: 'Object detection',
    input: 'Image',
    output: 'Bounding box',
    net: 'CNN',
    shape: 'structured',
    why: 'A bounding box is four numbers plus a label, and there may be several boxes per image. Forcing it into "classification" or "regression" loses that — it is both at once, on a variable number of objects.',
  },
  {
    id: 'speech',
    app: 'Speech Recognition',
    input: 'Audio',
    output: 'Text transcript',
    net: 'RNN',
    shape: 'structured',
    why: 'The output is a sequence of words whose length is not known in advance. The network is recurrent because the input arrives in order and the order carries meaning.',
  },
  {
    id: 'translate',
    app: 'Translation',
    input: 'English Text',
    output: 'French Text',
    net: 'RNN',
    shape: 'structured',
    why: 'Sequence in, sequence out, and the two are not even the same length. This is the problem Module 6 and then Module 7 of this course are built around.',
  },
  {
    id: 'driving',
    app: 'Autonomous driving',
    input: 'Image, Sensors, Radars',
    output: 'Position of other cars, objects, signals',
    net: 'Hybrid NN',
    shape: 'structured',
    why: 'Several kinds of input at once and several kinds of output at once, which is what "Hybrid" means in the last column: more than one architecture wired together.',
  },
]

export function AppTypeLab() {
  const [pick, setPick] = useState('estate')
  const [guess, setGuess] = useState<Shape | null>(null)
  const a = APPS.find((x) => x.id === pick)!

  return (
    <LabBox>
      <LabNote>
        The table on slide 27, one row at a time. The first three columns are the deck’s. The question underneath is
        not: which of the output shapes from the Machine Learning course is this, really?
      </LabNote>

      <Presets
        items={APPS.map((x) => ({ id: x.id, label: x.app }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setGuess(null)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
            {[
              ['Application', a.app],
              ['Input', a.input],
              ['Output', a.output],
              ['Neural Network', a.net],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3">
                <div className="text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">{k}</div>
                <div className="mt-0.5 text-[13px]/[1.5] font-semibold text-zinc-950">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            What shape is the output?
          </div>
          <div className="flex flex-wrap gap-2">
            {(['number', 'category', 'structured'] as Shape[]).map((s) => (
              <Chip key={s} on={guess === s} label={SHAPE_LABEL[s]} onClick={() => setGuess(s)} />
            ))}
          </div>

          {guess && (
            <div className="mt-3">
              <Verdict ok={guess === a.shape}>
                {guess === a.shape
                  ? `Yes — ${SHAPE_LABEL[a.shape].toLowerCase()}.`
                  : `Not quite. It is ${SHAPE_LABEL[a.shape].toLowerCase()}.`}
              </Verdict>
              <p className="crux-prose mt-2 text-[13px]/[1.7] text-zinc-700">{a.why}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Network on the slide" value={a.net} note={`for ${a.app.toLowerCase()}`} />
          <ReadOutGrid
            items={[
              { label: 'Answered', value: guess ? 'yes' : 'not yet' },
              { label: 'Correct', value: guess ? (guess === a.shape ? 'yes' : 'no') : '—' },
            ]}
          />
          <PanelNote>
            Four of the six rows are neither plain classification nor plain regression, and that is the honest answer
            rather than a failure of the question. The two-way split from the ML course covers a single fixed-size
            output; most of the applications people actually build do not have one.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
