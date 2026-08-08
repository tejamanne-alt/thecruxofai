'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* 1 — what changed between session 1 and session 2                           */
/* ========================================================================== */

type Status = 'same' | 'new' | 'changed'

const CHANGES: Array<{ id: string; topic: string; status: Status; s1: string; s2: string }> = [
  {
    id: 'brain',
    topic: 'The brain observation',
    status: 'same',
    s1: 'Slide 45: 10¹⁰ neurons, 10⁴–10⁵ connections each, 0.001 s switching, 1 s to recognise a scene.',
    s2: 'The same slide, word for word, including the same arithmetic problem — 1 s ÷ 1 ms is 1000, and the slide says 100.',
  },
  {
    id: 'bio',
    topic: 'The biological neuron',
    status: 'changed',
    s1: 'Slide 47 labels eight parts, including the myelin sheath and the nodes of Ranvier.',
    s2: 'Four parts only — dendrites, soma, axon, synapses — with a signal-flow arrow. Shorter, and pointed at the artificial version.',
  },
  {
    id: 'formula',
    topic: 'The neuron’s formula',
    status: 'changed',
    s1: 'z = Σᵢ₌₀ⁿ wᵢxᵢ with x₀ = 1, so the bias hides inside the sum as w₀.',
    s2: 'z = Σᵢ₌₁ⁿ wᵢxᵢ + b, with the bias written separately, and ŷ = f(z) for a general activation f.',
  },
  {
    id: 'compare',
    topic: 'Biological against artificial',
    status: 'new',
    s1: 'Not in session 1 at all.',
    s2: 'A six-row comparison table: biochemical against mathematical, analog against digital, fault tolerant against deterministic.',
  },
  {
    id: 'connectionism',
    topic: 'Connectionism',
    status: 'changed',
    s1: 'Slide 48: neural networks are connectionist machines, and knowledge lives in the connections.',
    s2: 'The same, plus four named principles — intelligence emerges from simple units, knowledge is in the weights, learning modifies them, processing is parallel and distributed.',
  },
  {
    id: 'encoding',
    topic: 'The gate encoding',
    status: 'changed',
    s1: 'Rewrites the truth tables into ±1 and fires strictly above zero. AND is (−1, 2, 2).',
    s2: 'Keeps 0 and 1, and fires at zero or above. AND is (−1, 0.75, 0.75). Neither answer works in the other’s encoding.',
  },
  {
    id: 'pla',
    topic: 'The learning algorithm',
    status: 'changed',
    s1: 'Δwᵢ = η(t − o)xᵢ, with x₀ = 1 carrying the bias, so one line covers every weight.',
    s2: 'The same rule split in two: wᵢ += η(t − ŷ)xᵢ and b += η(t − ŷ). Also η = 0.1 and random initial weights rather than zeros.',
  },
  {
    id: 'ann',
    topic: 'The network picture',
    status: 'new',
    s1: 'One neuron, then the two-unit hidden layer for XOR.',
    s2: 'A full diagram — input, three hidden layers, output — and the note that connections can be forward, recursive or self-looping.',
  },
  {
    id: 'sep',
    topic: 'Linear separability',
    status: 'changed',
    s1: 'Slide 72: a perceptron is a hyperplane in the n-dimensional space of examples.',
    s2: 'Stated as a definition: separable if an (n − 1)-dimensional hyperplane separates them — and there are infinitely many such hyperplanes.',
  },
  {
    id: 'xor',
    topic: 'XOR',
    status: 'same',
    s1: 'Slides 77–81: not separable, then fixed with a hidden layer.',
    s2: 'Not separable, and the fix is named as multilayer perceptron — but the network itself is left to module 2’s later sessions.',
  },
]

const STATUS_LABEL: Record<Status, string> = {
  same: 'the same',
  new: 'new here',
  changed: 'changed',
}
const STATUS_TONE: Record<Status, string> = { same: '#71717a', new: TEAL, changed: AMBER }

export function ModuleDiffLab() {
  const [pick, setPick] = useState('formula')
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const shown = CHANGES.filter((c) => filter === 'all' || c.status === filter)
  const c = CHANGES.find((x) => x.id === pick)!

  return (
    <LabBox>
      <LabNote>
        Session 2 covers a lot of the same ground as session 1, and the parts that are <em>not</em> the same are where
        the marks are. Filter by what happened to each topic, then press one to see both versions side by side.
      </LabNote>

      <div className="flex flex-wrap gap-2">
        {(['all', 'same', 'changed', 'new'] as const).map((f) => (
          <Chip
            key={f}
            on={filter === f}
            label={
              f === 'all'
                ? `all ${CHANGES.length}`
                : `${STATUS_LABEL[f]} — ${CHANGES.filter((x) => x.status === f).length}`
            }
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      <Presets items={shown.map((x) => ({ id: x.id, label: x.topic }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Session 1 said
            </div>
            <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{c.s1}</p>
          </div>
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: STATUS_TONE[c.status] + '55', background: '#fff' }}
          >
            <div
              className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase"
              style={{ color: STATUS_TONE[c.status] }}
            >
              Session 2 says — {STATUS_LABEL[c.status]}
            </div>
            <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{c.s2}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Status" value={STATUS_LABEL[c.status]} tone={STATUS_TONE[c.status]} note={c.topic} />
          <ReadOutGrid
            items={[
              { label: 'the same', value: String(CHANGES.filter((x) => x.status === 'same').length) },
              { label: 'changed', value: String(CHANGES.filter((x) => x.status === 'changed').length) },
              { label: 'new here', value: String(CHANGES.filter((x) => x.status === 'new').length) },
              { label: 'topics', value: String(CHANGES.length) },
            ]}
          />
          <PanelNote>
            Press <strong>changed</strong> and read only those four. Every one of them is a place where quoting the
            wrong session’s answer in an exam would cost you the mark.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 2 — the biological neuron, and what each part became                       */
/* ========================================================================== */

const BIO_PARTS = [
  {
    id: 'dendrite',
    name: 'Dendrites',
    role: 'Receive signals from other neurons',
    artificial: 'The inputs x₁ … xₙ',
    note: 'Many arrive at once. A neuron with a thousand dendrites is a neuron with a thousand inputs, and each arriving signal has its own strength.',
  },
  {
    id: 'synapse',
    name: 'Synapses',
    role: 'Connection points between neurons',
    artificial: 'The weights w₁ … wₙ',
    note: 'This is where learning happens. A synapse can be strong or weak, and the strength is what changes with experience — which is exactly what a weight is.',
  },
  {
    id: 'soma',
    name: 'Cell body (soma)',
    role: 'Processes incoming signals',
    artificial: 'The sum Σ and the activation f',
    note: 'Everything arriving is combined, and the cell decides whether to fire. Two artificial parts, because the deck splits combining from deciding.',
  },
  {
    id: 'axon',
    name: 'Axon',
    role: 'Transmits output signal',
    artificial: 'The single output ŷ',
    note: 'One axon, one output. It branches at the far end, so the same value reaches many places — which is why one unit’s ŷ can be an input to several units in the next layer.',
  },
]

export function BioNeuronLab() {
  const [at, setAt] = useState(0)
  const p = BIO_PARTS[at]

  return (
    <LabBox>
      <LabNote>
        Four parts, and a signal travelling left to right through all of them. Press <strong>Next</strong> to follow it,
        and watch which piece of the artificial neuron each one turns into.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            {BIO_PARTS.map((b, i) => (
              <span key={b.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAt(i)}
                  className="cursor-pointer rounded-lg border px-3 py-2 text-[12.5px] font-semibold"
                  style={
                    i === at
                      ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                      : i < at
                        ? {
                            borderColor: 'rgba(13,148,136,0.35)',
                            background: 'rgba(13,148,136,0.07)',
                            color: '#0f766e',
                          }
                        : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#71717a' }
                  }
                >
                  {b.name}
                </button>
                {i < BIO_PARTS.length - 1 && <span style={{ color: i < at ? TEAL : '#d4d4d8' }}>→</span>}
              </span>
            ))}
          </div>

          <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What the deck says it does
            </div>
            <div className="mb-3 text-[15px] font-semibold text-zinc-950">{p.role}</div>
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--acc)' }}>
              Becomes, in the artificial neuron
            </div>
            <div className="mb-2 font-mono text-[14px] font-semibold text-zinc-950">{p.artificial}</div>
            <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{p.note}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Signal is at" value={p.name} note={`step ${at + 1} of ${BIO_PARTS.length}`} />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((v) => (v + 1) % BIO_PARTS.length)}>
              Next →
            </Btn>
            <Btn onClick={() => setAt(0)}>Back to the start</Btn>
          </div>
          <PanelNote>
            The deck’s own arrow reads “electrical impulses travel from dendrites through cell body to axon terminals”.
            One direction only — which is why the default network is called <em>feed-forward</em>, and why the recursive
            and self-looping connections on the next page need saying separately.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 3 — the neuron, with weights as importance                                 */
/* ========================================================================== */

const FEATURES = [
  { name: 'rooms', unit: '', lo: 1, hi: 8, start: 3 },
  { name: 'area (100 m²)', unit: '', lo: 0.4, hi: 4, start: 1.2 },
  { name: 'age (decades)', unit: '', lo: 0, hi: 8, start: 3 },
]

export function NeuronImportanceLab() {
  const [x, setX] = useState(FEATURES.map((f) => f.start))
  const [w, setW] = useState([0.6, 2.4, -0.5])
  const [b, setB] = useState(1)

  const terms = x.map((xi, i) => w[i] * xi)
  const z = terms.reduce((s, t) => s + t, 0) + b
  const biggest = terms.reduce((best, t, i) => (Math.abs(t) > Math.abs(terms[best]) ? i : best), 0)
  const span = Math.max(1, ...terms.map((t) => Math.abs(t)), Math.abs(b))

  return (
    <LabBox>
      <LabNote>
        The deck says the weight wᵢ <strong>shows the importance of feature xᵢ</strong>. That is a claim you can check:
        each bar below is one term wᵢxᵢ, and the longest bar is the feature currently deciding the answer.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Each term, wᵢ × xᵢ
          </div>
          <div className="flex flex-col gap-2.5">
            {FEATURES.map((f, i) => (
              <div key={f.name} className="flex items-center gap-3">
                <span className="w-[120px] shrink-0 text-[12.5px] font-semibold text-zinc-800">{f.name}</span>
                <span className="relative h-5 flex-1 rounded bg-zinc-950/[0.05]">
                  <span className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-950/20" />
                  <span
                    className="absolute top-0 bottom-0 rounded"
                    style={{
                      background: terms[i] >= 0 ? '#4f46e5' : '#dc2626',
                      backgroundColor: terms[i] >= 0 ? 'var(--acc)' : '#dc2626',
                      left: terms[i] >= 0 ? '50%' : `${50 - (Math.abs(terms[i]) / span) * 50}%`,
                      width: `${(Math.abs(terms[i]) / span) * 50}%`,
                      opacity: i === biggest ? 1 : 0.45,
                    }}
                  />
                </span>
                <span className="w-[130px] shrink-0 text-right font-mono text-[12px] text-zinc-700 tabular-nums">
                  {w[i].toFixed(1)} × {x[i].toFixed(1)} = {terms[i].toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 border-t border-zinc-950/[0.08] pt-2.5">
              <span className="w-[120px] shrink-0 text-[12.5px] font-semibold text-zinc-500">bias b</span>
              <span className="relative h-5 flex-1 rounded bg-zinc-950/[0.05]">
                <span className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-950/20" />
                <span
                  className="absolute top-0 bottom-0 rounded bg-zinc-400"
                  style={{
                    left: b >= 0 ? '50%' : `${50 - (Math.abs(b) / span) * 50}%`,
                    width: `${(Math.abs(b) / span) * 50}%`,
                  }}
                />
              </span>
              <span className="w-[130px] shrink-0 text-right font-mono text-[12px] text-zinc-700 tabular-nums">
                {b.toFixed(1)}
              </span>
            </div>
          </div>
          <div
            className="mt-3 border-t border-zinc-950/[0.08] pt-3 font-mono text-[13px] font-semibold"
            style={{ color: 'var(--acc)' }}
          >
            z = {terms.map((t) => t.toFixed(2)).join(' + ')} + {b.toFixed(1)} = {z.toFixed(2)}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Deciding this answer"
            value={FEATURES[biggest].name}
            note={`term = ${terms[biggest].toFixed(2)}`}
          />
          {FEATURES.map((f, i) => (
            <Slider
              key={f.name}
              label={`w for ${f.name}`}
              value={w[i]}
              display={w[i].toFixed(1)}
              min={-3}
              max={3}
              step={0.1}
              hint={i === 2 ? 'Negative means this feature argues against.' : ''}
              onChange={(v) => setW((p) => p.map((q, j) => (j === i ? v : q)))}
            />
          ))}
          <Slider
            label="bias b"
            value={b}
            display={b.toFixed(1)}
            min={-5}
            max={5}
            step={0.5}
            hint="Rides on nothing. It shifts z whatever the inputs are."
            onChange={setB}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setX(FEATURES.map((f) => f.lo))}>Small house</Btn>
            <Btn onClick={() => setX(FEATURES.map((f) => f.hi))}>Large house</Btn>
            <Btn onClick={() => setX(FEATURES.map((f) => f.start))}>Reset inputs</Btn>
          </div>
          <PanelNote>
            A large weight on its own does not mean an important feature — <strong>the term is the product</strong>. Set
            the weight on area to 3 and press <strong>Small house</strong>: the biggest weight stops being the biggest
            bar. That is why features are scaled before training.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 4 — z and the activation f                                                 */
/* ========================================================================== */

const ACTIVATIONS = [
  {
    id: 'step',
    name: 'step (this deck)',
    fn: (z: number) => (z >= 0 ? 1 : 0),
    formula: 'f(z) = 1 if z ≥ 0, else 0',
    deck: true,
    note: 'What page 21 defines. Note it fires at exactly zero, unlike session 1’s rule.',
  },
  {
    id: 'sign',
    name: 'sign (session 1)',
    fn: (z: number) => (z > 0 ? 1 : -1),
    formula: 'f(z) = +1 if z > 0, else −1',
    deck: true,
    note: 'Session 1 slide 53. Strictly above zero, and −1 rather than 0 for the other case.',
  },
  {
    id: 'identity',
    name: 'identity (session 3)',
    fn: (z: number) => z,
    formula: 'f(z) = z',
    deck: true,
    note: 'Session 3’s choice. It changes nothing at all, which is exactly what regression needs.',
  },
  {
    id: 'relu',
    name: 'ReLU',
    fn: (z: number) => Math.max(0, z),
    formula: 'f(z) = max(0, z)',
    deck: false,
    note: 'Not in this deck. The cheapest useful bend, and the default inside hidden layers.',
  },
  {
    id: 'sigmoid',
    name: 'sigmoid',
    fn: (z: number) => 1 / (1 + Math.exp(-z)),
    formula: 'f(z) = 1 / (1 + e⁻ᶻ)',
    deck: false,
    note: 'Not in this deck either. A step with the corner rounded off, so it has a slope to follow.',
  },
]

export function ActivationPickLab() {
  const [pick, setPick] = useState('step')
  const [z, setZ] = useState(0)
  const a = ACTIVATIONS.find((x) => x.id === pick)!

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -4, xmax: 4, ymin: -1.5, ymax: 2.5, xlab: 'z, the weighted sum', ylab: 'f(z)' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    let prev = a.fn(-4)
    g.moveTo(f.px(-4), f.py(prev))
    for (let i = 1; i <= 400; i++) {
      const zv = -4 + (i / 400) * 8
      const yv = a.fn(zv)
      // A jump gets the pen lifted rather than drawn as a near-vertical line.
      if (Math.abs(yv - prev) > 0.5 && Math.abs(zv) < 0.05) g.moveTo(f.px(zv), f.py(yv))
      else g.lineTo(f.px(zv), f.py(yv))
      prev = yv
    }
    g.stroke()
    g.restore()
    grip(g, f.px(z), f.py(a.fn(z)), TEAL, 7)
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.setLineDash([4, 4])
    g.beginPath()
    g.moveTo(f.px(z), f.B)
    g.lineTo(f.px(z), f.py(a.fn(z)))
    g.stroke()
    g.setLineDash([])
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Equation (1) gives z. Equation (2) puts z through f. Change f and the same z becomes a completely different
        answer — which is why the activation is a design decision and not an afterthought.
      </LabNote>

      <Presets items={ACTIVATIONS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ z }}
          jumpKey={pick}
          height={320}
          caption="Press or drag anywhere on the plot to move z."
          handles={(f: Frame) => [{ id: 'z', px: f.px(z), py: f.py(a.fn(z)), grab: 'anywhere' as const }]}
          onDragTo={(_id, x) => setZ(Math.round(clamp(x, -4, 4) * 20) / 20)}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="ŷ = f(z)" value={a.fn(z).toFixed(3)} note={a.formula} />
          <Slider
            label="z"
            value={z}
            display={z.toFixed(2)}
            min={-4}
            max={4}
            step={0.05}
            hint="Set it to exactly 0 and compare the first two activations."
            onChange={setZ}
          />
          <ReadOutGrid items={ACTIVATIONS.map((x) => ({ label: x.name.split(' ')[0], value: x.fn(z).toFixed(2) }))} />
          <Verdict ok={a.deck}>
            {a.deck
              ? 'This activation appears in the course decks.'
              : 'Not on these slides — included so the general f in equation (2) has more than two examples.'}
          </Verdict>
          <PanelNote>{a.note}</PanelNote>
          <PanelNote>
            Set z to exactly 0. The step says 1, sign says −1, identity says 0. Three different answers to the same sum
            — and all three conventions appear in this one course.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 5 — biological against artificial                                          */
/* ========================================================================== */

const ROWS = [
  {
    bio: 'Complex biochemical processes',
    art: 'Simple mathematical model',
    kind: 'simplification',
    why: 'A real synapse involves neurotransmitters, receptors and timing. A weight is one number. The artificial version is not a smaller version of the biology — it is a different thing that happens to be useful.',
  },
  {
    bio: 'Analog signal processing',
    art: 'Digital computation',
    kind: 'difference',
    why: 'Real neurons communicate in spikes with timing that carries information. Artificial ones pass a single real number, and that number is a floating-point approximation.',
  },
  {
    bio: 'Adaptive synaptic strengths',
    art: 'Adjustable weights',
    kind: 'likeness',
    why: 'This is the row that carries the whole analogy. Learning in both systems means changing connection strengths, and nothing else changes.',
  },
  {
    bio: 'Parallel processing',
    art: 'Parallel computation possible',
    kind: 'likeness',
    why: 'Note the hedge — "possible". Units in one layer are independent, so they can be computed at once, but whether they actually are depends on your hardware.',
  },
  {
    bio: 'Learning through experience',
    art: 'Learning through algorithms',
    kind: 'difference',
    why: 'A brain learns continuously from whatever arrives. A network learns when someone runs a training loop over a dataset somebody assembled, with a loss somebody chose.',
  },
  {
    bio: 'Fault tolerant',
    art: 'Deterministic behavior',
    kind: 'difference',
    why: 'These are not opposites, which makes the row the odd one out. Networks are in fact fairly fault tolerant — see the next page — and "deterministic" is about repeatability, not robustness.',
  },
]

const KIND_TONE: Record<string, string> = { likeness: TEAL, simplification: AMBER, difference: RED }

export function CompareNeuronsLab() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [at, setAt] = useState(0)
  const r = ROWS[at]
  const given = answers[at]
  const done = Object.keys(answers).length
  const right = ROWS.filter((row, i) => answers[i] === row.kind).length

  return (
    <LabBox>
      <LabNote>
        Six rows from the comparison table. For each one, decide what it really is: a genuine likeness, a
        simplification, or a plain difference. Then read why.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {ROWS.map((row, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAt(i)}
                className="size-7 cursor-pointer rounded-md border text-[11.5px] font-semibold"
                style={
                  i === at
                    ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                    : answers[i]
                      ? {
                          borderColor: answers[i] === row.kind ? 'rgba(13,148,136,0.4)' : 'rgba(220,38,38,0.35)',
                          background: answers[i] === row.kind ? 'rgba(13,148,136,0.08)' : 'rgba(220,38,38,0.06)',
                          color: answers[i] === row.kind ? '#0f766e' : '#b91c1c',
                        }
                      : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#71717a' }
                }
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3.5">
              <div className="text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">
                Biological neuron
              </div>
              <div className="mt-0.5 text-[14px] font-semibold text-zinc-950">{r.bio}</div>
            </div>
            <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3.5">
              <div className="text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">
                Artificial neuron
              </div>
              <div className="mt-0.5 text-[14px] font-semibold text-zinc-950">{r.art}</div>
            </div>
          </div>

          <div className="mt-4 mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Which is it?
          </div>
          <div className="flex flex-wrap gap-2">
            {['likeness', 'simplification', 'difference'].map((k) => (
              <Chip key={k} on={given === k} label={k} onClick={() => setAnswers((a) => ({ ...a, [at]: k }))} />
            ))}
          </div>
          {given && (
            <div className="mt-3">
              <Verdict ok={given === r.kind}>
                {given === r.kind ? `Yes — a ${r.kind}.` : `Not quite. This row is a ${r.kind}.`}
              </Verdict>
              <p className="crux-prose mt-2 text-[13px]/[1.7] text-zinc-700">{r.why}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Answered"
            value={`${right} of ${done}`}
            note={`${ROWS.length - done} rows left`}
            tone={KIND_TONE[r.kind]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((v) => (v + 1) % ROWS.length)}>
              Next row →
            </Btn>
            <Btn onClick={() => setAnswers({})}>Clear answers</Btn>
          </div>
          <PanelNote>
            Only one row is a real likeness, and it is the third: learning is changing connection strengths, in both. Be
            able to say that in an exam and the rest of the table is decoration.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 6 — building a network, and counting its parameters                        */
/* ========================================================================== */

export function AnnBuilderLab() {
  const [inputs, setInputs] = useState(6)
  const [hidden, setHidden] = useState(3)
  const [width, setWidth] = useState(5)
  const [outputs, setOutputs] = useState(2)

  const sizes = [inputs, ...Array<number>(hidden).fill(width), outputs]
  // Every layer after the input has (fan-in + 1) parameters per unit. Derived
  // on every render — a stored count would go stale the moment a slider moves.
  const perLayer = sizes.slice(1).map((n, i) => n * (sizes[i] + 1))
  const total = perLayer.reduce((s, n) => s + n, 0)
  const weights = sizes.slice(1).reduce((s, n, i) => s + n * sizes[i], 0)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f: Frame = { L: 0, R: W, T: 0, B: H, px: (v) => v, py: (v) => v, ux: (p) => p, uy: (p) => p }
    const acc = accentColour()
    const pad = 34
    const colX = sizes.map((_, i) => pad + (i / Math.max(1, sizes.length - 1)) * (W - pad * 2))
    const pos = sizes.map((n, c) =>
      Array.from({ length: n }, (_, j) => ({ x: colX[c], y: ((j + 1) / (n + 1)) * (H - 26) + 6 }))
    )
    g.lineWidth = 0.6
    g.strokeStyle = 'rgba(79,70,229,0.18)'
    for (let c = 0; c < pos.length - 1; c++) {
      for (const a of pos[c]) {
        for (const b of pos[c + 1]) {
          g.beginPath()
          g.moveTo(a.x, a.y)
          g.lineTo(b.x, b.y)
          g.stroke()
        }
      }
    }
    pos.forEach((col, c) => {
      const fill = c === 0 ? '#bfdbfe' : c === pos.length - 1 ? '#bbf7d0' : '#fecaca'
      for (const p of col) {
        g.beginPath()
        g.arc(p.x, p.y, Math.max(3, Math.min(8, 90 / Math.max(...sizes))), 0, Math.PI * 2)
        g.fillStyle = fill
        g.fill()
        g.strokeStyle = 'rgba(9,9,11,0.25)'
        g.lineWidth = 1
        g.stroke()
      }
      g.fillStyle = c === 0 || c === pos.length - 1 ? '#52525b' : acc
      g.textAlign = 'center'
      g.fillText(c === 0 ? 'Input' : c === pos.length - 1 ? 'Output' : `Hidden ${c}`, colX[c], H - 6)
    })
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The deck’s network picture, with the sliders it does not have. Every unit after the input layer holds one weight
        per incoming connection plus a bias, and the count is worked out below rather than stated.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ inputs, hidden, width, outputs }}
          jumpKey={`${inputs}-${hidden}-${width}-${outputs}`}
          height={300}
          caption="Every line is one weight. The picture gets unreadable long before a real network gets interesting."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Parameters to learn"
            value={total.toLocaleString('en-GB')}
            note={`${weights.toLocaleString('en-GB')} weights + ${(total - weights).toLocaleString('en-GB')} biases`}
          />
          <Slider
            label="Input features"
            value={inputs}
            display={String(inputs)}
            min={1}
            max={20}
            step={1}
            hint="One per column of your data."
            onChange={(v) => setInputs(Math.round(v))}
          />
          <Slider
            label="Hidden layers"
            value={hidden}
            display={String(hidden)}
            min={0}
            max={6}
            step={1}
            hint="The deck draws three. Three or more layers earns the word deep."
            onChange={(v) => setHidden(Math.round(v))}
          />
          <Slider
            label="Units per hidden layer"
            value={width}
            display={String(width)}
            min={1}
            max={16}
            step={1}
            hint="Width, as opposed to depth."
            onChange={(v) => setWidth(Math.round(v))}
          />
          <Slider
            label="Outputs"
            value={outputs}
            display={String(outputs)}
            min={1}
            max={10}
            step={1}
            hint="One for a number, one per class for a category."
            onChange={(v) => setOutputs(Math.round(v))}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3 font-mono text-[11.5px]/[1.7] text-zinc-700">
            {sizes.slice(1).map((n, i) => (
              <div key={i}>
                layer {i + 1}: {n} × ({sizes[i]} + 1) = {perLayer[i]}
              </div>
            ))}
            <div className="border-t border-zinc-950/[0.08] pt-1 font-semibold" style={{ color: 'var(--acc)' }}>
              total = {total}
            </div>
          </div>
          <Verdict ok={hidden >= 3}>
            {hidden >= 3
              ? `${hidden} hidden layers — deep by the three-or-more test from session 1.`
              : `${hidden} hidden layer${hidden === 1 ? '' : 's'} — a neural network, but not a deep one.`}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 7 — when to consider a neural network                                      */
/* ========================================================================== */

const CRITERIA = [
  { id: 'highdim', text: 'Input is high-dimensional, discrete or real-valued' },
  { id: 'noisy', text: 'Data is possibly noisy, with lots of errors' },
  { id: 'output', text: 'Output is discrete, real-valued, or a vector of values' },
  { id: 'unknown', text: 'The form of the target function is unknown' },
  { id: 'explain', text: 'Explainability of the result is unimportant' },
]

const PROBLEMS = [
  {
    id: 'phoneme',
    name: 'Speech phoneme recognition',
    met: ['highdim', 'noisy', 'output', 'unknown', 'explain'],
    note: 'One of the deck’s own three examples. Thousands of audio samples in, a phoneme out, no known formula, and nobody needs the reason.',
  },
  {
    id: 'image',
    name: 'Image classification',
    met: ['highdim', 'noisy', 'output', 'unknown', 'explain'],
    note: 'Also the deck’s. A megapixel image is as high-dimensional as it gets, and no one can write the rule for “this is a cat”.',
  },
  {
    id: 'finance',
    name: 'Financial prediction',
    met: ['highdim', 'noisy', 'output', 'unknown'],
    note: 'The deck’s third example. Everything fits except explainability — in regulated finance you often have to justify a decision, which is the one condition this method cannot meet.',
  },
  {
    id: 'loan',
    name: 'Approving a loan application',
    met: ['noisy', 'output', 'unknown'],
    note: 'Not on the slides. A dozen features is not high-dimensional, and an applicant refused credit may be legally entitled to a reason. Two conditions fail, and the second is the one that should stop you.',
  },
  {
    id: 'area',
    name: 'Computing the area of a rectangle',
    met: [],
    note: 'Not on the slides. The target function is known exactly, so there is nothing to learn. Not one condition is met.',
  },
]

export function WhenAnnLab() {
  const [pick, setPick] = useState('phoneme')
  const p = PROBLEMS.find((x) => x.id === pick)!
  const score = p.met.length

  return (
    <LabBox>
      <LabNote>
        Five conditions from the deck. Pick a problem and see how many it meets — and, more usefully, which ones it does
        not.
      </LabNote>

      <Presets items={PROBLEMS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 bg-white p-4">
          {CRITERIA.map((c) => {
            const ok = p.met.includes(c.id)
            return (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg border px-3.5 py-2.5"
                style={{
                  borderColor: ok ? 'rgba(13,148,136,0.3)' : 'rgba(220,38,38,0.25)',
                  background: ok ? 'rgba(13,148,136,0.06)' : 'rgba(220,38,38,0.05)',
                }}
              >
                <span className="text-[14px] font-semibold" style={{ color: ok ? TEAL : RED }}>
                  {ok ? '✓' : '✗'}
                </span>
                <span className="text-[13px]/[1.6] text-zinc-800">{c.text}</span>
              </div>
            )
          })}
          <p className="crux-prose mt-2 text-[13px]/[1.7] text-zinc-700">{p.note}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Conditions met"
            value={`${score} of 5`}
            tone={score === 5 ? TEAL : score >= 3 ? AMBER : RED}
            note={score === 5 ? 'a natural fit' : score >= 3 ? 'possible, with care' : 'look elsewhere'}
          />
          <Verdict ok={p.met.includes('explain')}>
            {p.met.includes('explain')
              ? 'Explainability is genuinely unimportant here.'
              : 'Explainability matters here — and the deck lists “explainability is unimportant” as a condition, not a bonus. This is the one that rules a network out however well the others score.'}
          </Verdict>
          <PanelNote>
            The fifth condition is phrased as a requirement and reads like a warning, because it is one. The knowledge
            is spread across every weight, so there is no single place to point at when someone asks why.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 8 — connectionism: knock a unit out                                        */
/* ========================================================================== */

const UNITS = 12
/** Fixed bump positions across the input range — the "hidden layer". */
const CENTRES = Array.from({ length: UNITS }, (_, i) => -3 + (6 * i) / (UNITS - 1))
const WIDTH = 0.75
const basis = (x: number, c: number) => Math.exp(-((x - c) ** 2) / (2 * WIDTH * WIDTH))
const target = (x: number) => Math.sin(1.3 * x)

/** Least squares fit of the bump weights, solved once at module load. */
function fitWeights() {
  const xs = Array.from({ length: 120 }, (_, i) => -3 + (6 * i) / 119)
  const k = UNITS
  const A: number[][] = Array.from({ length: k }, () => new Array(k + 1).fill(0))
  for (const x of xs) {
    const phi = CENTRES.map((c) => basis(x, c))
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) A[i][j] += phi[i] * phi[j]
      A[i][k] += phi[i] * target(x)
    }
  }
  for (let i = 0; i < k; i++) A[i][i] += 1e-6
  for (let c = 0; c < k; c++) {
    let piv = c
    for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r
    ;[A[c], A[piv]] = [A[piv], A[c]]
    if (Math.abs(A[c][c]) < 1e-12) continue
    for (let r = 0; r < k; r++) {
      if (r === c) continue
      const fac = A[r][c] / A[c][c]
      for (let j = c; j <= k; j++) A[r][j] -= fac * A[c][j]
    }
  }
  return Array.from({ length: k }, (_, i) => (Math.abs(A[i][i]) < 1e-12 ? 0 : A[i][k] / A[i][i]))
}
const W_FIT = fitWeights()

export function ConnectionismLab() {
  const [off, setOff] = useState<number[]>([])

  const predict = (x: number) => CENTRES.reduce((s, c, i) => (off.includes(i) ? s : s + W_FIT[i] * basis(x, c)), 0)
  const rms = Math.sqrt(
    Array.from({ length: 120 }, (_, i) => -3 + (6 * i) / 119).reduce((s, x) => s + (predict(x) - target(x)) ** 2, 0) /
      120
  )

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -3, xmax: 3, ymin: -1.6, ymax: 1.6, xlab: 'input x', ylab: 'output' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.setLineDash([5, 4])
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const x = -3 + (i / 200) * 6
      if (i === 0) g.moveTo(f.px(x), f.py(target(x)))
      else g.lineTo(f.px(x), f.py(target(x)))
    }
    g.stroke()
    g.setLineDash([])
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const x = -3 + (i / 200) * 6
      if (i === 0) g.moveTo(f.px(x), f.py(predict(x)))
      else g.lineTo(f.px(x), f.py(predict(x)))
    }
    g.stroke()
    g.restore()
    CENTRES.forEach((c, i) => {
      dot(g, f.px(c), f.B - 8, 4, off.includes(i) ? '#d4d4d8' : accentColour())
    })
    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('dashed = what it should be', f.L + 6, f.T + 10)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Twelve units, each contributing a little to the answer, with weights fitted once when the page loaded. Switch
        units off and watch what happens — the point is how <em>little</em> happens, until quite a few are gone.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ n: off.length }}
          jumpKey={off.join(',')}
          height={320}
          caption="The dots along the bottom are the units. Grey means switched off."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Error"
            value={rms.toFixed(4)}
            note={`${UNITS - off.length} of ${UNITS} units alive`}
            tone={rms < 0.05 ? TEAL : rms < 0.2 ? AMBER : RED}
          />
          <div className="flex flex-wrap gap-1.5">
            {CENTRES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOff((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}
                className="size-8 cursor-pointer rounded-md border text-[11px] font-semibold"
                style={
                  off.includes(i)
                    ? { borderColor: 'rgba(9,9,11,0.12)', background: '#f4f4f5', color: '#a1a1aa' }
                    : { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setOff([])}>All on</Btn>
            <Btn onClick={() => setOff([5])}>Kill one</Btn>
            <Btn onClick={() => setOff([2, 5, 8])}>Kill three</Btn>
            <Btn onClick={() => setOff(CENTRES.map((_, i) => i).filter((i) => i % 2 === 0))}>Kill half</Btn>
          </div>
          <PanelNote>
            Kill one unit and the curve barely moves. That is what “all world knowledge is stored in the connections”
            buys you: no single unit holds the answer, so no single unit can lose it. It is also exactly why you cannot
            open a network up and read out what it knows.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 9 — the gates, in this deck's 0/1 encoding                                 */
/* ========================================================================== */

/** Page 21: fire at zero or above. This is not session 1's rule. */
const fire01 = (z: number) => (z >= 0 ? 1 : 0)

interface Gate01 {
  id: string
  name: string
  rows: Array<[number, number, number]>
  answer?: [number, number, number]
  note: string
}

const AND01: Gate01 = {
  id: 'and',
  name: 'AND',
  rows: [
    [0, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  answer: [-1, 0.75, 0.75],
  note: 'The deck’s answer: w₀ = −1, w₁ = w₂ = 0.75. The three zero rows need a sum below 0 and the last needs 0 or above.',
}
const OR01: Gate01 = {
  id: 'or',
  name: 'OR',
  rows: [
    [0, 0, 0],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  answer: [-1, 2, 2],
  note: 'The deck’s answer: w₀ = −1, w₁ = w₂ = 2. Same bias as AND, and weights big enough that one input alone clears it.',
}
const NOR01: Gate01 = {
  id: 'nor',
  name: 'NOR',
  rows: [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  answer: [1, -2, -2],
  note: 'Not answered on the slides. Got by negating every weight of the deck’s OR answer, then checked against all four rows by the table above. Negation is only safe because none of OR’s four sums is exactly zero.',
}
const NAND01: Gate01 = {
  id: 'nand',
  name: 'NAND',
  rows: [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
  answer: [1, -0.75, -0.75],
  note: 'Also unanswered on the slides. Negate every weight of the deck’s AND answer — again safe, because none of AND’s four sums is exactly zero — and check all four rows.',
}

function GateBoard01({ gates, label }: { gates: Gate01[]; label: string }) {
  const [pick, setPick] = useState(gates[0].id)
  const [w, setW] = useState<[number, number, number]>([0, 0, 0])
  const [shown, setShown] = useState(false)
  const g0 = gates.find((x) => x.id === pick)!

  const results = g0.rows.map(([x1, x2, t]) => {
    const z = w[0] + w[1] * x1 + w[2] * x2
    const y = fire01(z)
    return { x1, x2, t, z, y, ok: y === t }
  })
  const right = results.filter((r) => r.ok).length
  const solved = right === 4

  const draw = (gg: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(gg, W, H, { xmin: -0.4, xmax: 1.4, ymin: -0.4, ymax: 1.4, xlab: 'x₁', ylab: 'x₂' })
    const acc = accentColour()
    gg.save()
    gg.beginPath()
    gg.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    gg.clip()
    for (let px = f.L; px < f.R; px += 10) {
      for (let py = f.T; py < f.B; py += 10) {
        const z = w[0] + w[1] * f.ux(px) + w[2] * f.uy(py)
        gg.fillStyle = w[1] === 0 && w[2] === 0 ? 'rgba(9,9,11,0.03)' : z >= 0 ? acc + '1c' : '#dc262612'
        gg.fillRect(px, py, 10, 10)
      }
    }
    if (Math.abs(w[2]) > 1e-9) {
      gg.strokeStyle = '#18181b'
      gg.lineWidth = 2.5
      gg.beginPath()
      gg.moveTo(f.px(-1), f.py(-(w[0] + w[1] * -1) / w[2]))
      gg.lineTo(f.px(2), f.py(-(w[0] + w[1] * 2) / w[2]))
      gg.stroke()
    } else if (Math.abs(w[1]) > 1e-9) {
      gg.strokeStyle = '#18181b'
      gg.lineWidth = 2.5
      gg.beginPath()
      gg.moveTo(f.px(-w[0] / w[1]), f.T)
      gg.lineTo(f.px(-w[0] / w[1]), f.B)
      gg.stroke()
    }
    gg.restore()
    for (const r of results) {
      dot(gg, f.px(r.x1), f.py(r.x2), 8, r.t === 1 ? '#18181b' : '#fff', r.t === 1 ? null : '#18181b')
      if (!r.ok) {
        gg.strokeStyle = RED
        gg.lineWidth = 2.5
        gg.beginPath()
        gg.arc(f.px(r.x1), f.py(r.x2), 14, 0, Math.PI * 2)
        gg.stroke()
      }
    }
    arrow(gg, f.px(0.5), f.py(0.5), f.px(0.5 + w[1] * 0.2), f.py(0.5 + w[2] * 0.2), TEAL, 2)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The inputs are <strong>0 and 1</strong>, not ±1, and the neuron fires when the sum reaches{' '}
        <strong>zero or above</strong>. Both differ from session 1, so its answers will not work here — try them and
        see.
      </LabNote>

      {gates.length > 1 && (
        <Presets
          items={gates.map((x) => ({ id: x.id, label: `${x.name} gate` }))}
          at={pick}
          onPick={(id) => {
            setPick(id)
            setW([0, 0, 0])
            setShown(false)
          }}
        />
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            <table className="w-full font-mono text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] tracking-[0.05em] text-zinc-500 uppercase">
                  <th className="pb-1.5 text-left">x₁</th>
                  <th className="pb-1.5 text-left">x₂</th>
                  <th className="pb-1.5 text-left">t</th>
                  <th className="pb-1.5 text-left">z = w₀ + w₁x₁ + w₂x₂</th>
                  <th className="pb-1.5 text-left">z ≥ 0?</th>
                  <th className="pb-1.5 text-left">ŷ</th>
                  <th className="pb-1.5 text-left">ok</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-zinc-950/[0.06]">
                    <td className="py-1.5 tabular-nums">{r.x1}</td>
                    <td className="py-1.5 tabular-nums">{r.x2}</td>
                    <td className="py-1.5 tabular-nums">{r.t}</td>
                    <td className="py-1.5 text-zinc-600">
                      {w[0]} + {w[1]}({r.x1}) + {w[2]}({r.x2}) = {r.z}
                    </td>
                    <td className="py-1.5 text-zinc-600">{r.z >= 0 ? 'yes' : 'no'}</td>
                    <td className="py-1.5 tabular-nums">{r.y}</td>
                    <td className="py-1.5 font-semibold" style={{ color: r.ok ? TEAL : RED }}>
                      {r.ok ? '✓' : '✗'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ w0: w[0], w1: w[1], w2: w[2] }}
            jumpKey={pick}
            height={300}
            caption="Filled dot means the target is 1. Drag the teal arrow to turn the boundary."
            handles={(f: Frame) => [
              { id: 'w', px: f.px(0.5 + w[1] * 0.2), py: f.py(0.5 + w[2] * 0.2), grab: 'anywhere' as const },
            ]}
            onDragTo={(_id, x, y) =>
              setW(([b]) => [b, Math.round((x - 0.5) * 5 * 4) / 4, Math.round((y - 0.5) * 5 * 4) / 4])
            }
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Rows satisfied"
            value={`${right} of 4`}
            tone={solved ? TEAL : RED}
            note={solved ? 'a correct set of weights' : 'ringed dots are wrong'}
          />
          <Slider
            label="w₀ (bias)"
            value={w[0]}
            display={String(w[0])}
            min={-3}
            max={3}
            step={0.25}
            hint=""
            onChange={(v) => setW(([, a, b]) => [v, a, b])}
          />
          <Slider
            label="w₁"
            value={w[1]}
            display={String(w[1])}
            min={-3}
            max={3}
            step={0.25}
            hint=""
            onChange={(v) => setW(([a, , b]) => [a, v, b])}
          />
          <Slider
            label="w₂"
            value={w[2]}
            display={String(w[2])}
            min={-3}
            max={3}
            step={0.25}
            hint=""
            onChange={(v) => setW(([a, b]) => [a, b, v])}
          />
          <div className="flex flex-wrap gap-2">
            {g0.answer && (
              <Btn
                primary
                onClick={() => {
                  setW(g0.answer!)
                  setShown(true)
                }}
              >
                {label}
              </Btn>
            )}
            <Btn onClick={() => setW([-1, 2, 2])}>Session 1’s AND answer</Btn>
            <Btn onClick={() => setW([0, 0, 0])}>Clear</Btn>
          </div>
          {shown && g0.answer && (
            <PanelNote>
              w = ({g0.answer[0]}, {g0.answer[1]}, {g0.answer[2]}). {g0.note}
            </PanelNote>
          )}
          <PanelNote>
            Press <strong>Session 1’s AND answer</strong>. In the ±1 encoding w = (−1, 2, 2) is AND; here the very same
            three numbers are <strong>OR</strong>, and on the AND board they get a row wrong. The weights are not
            mistaken — they answer a different question, because both the inputs and the firing rule changed.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

export function AndGate01Lab() {
  return <GateBoard01 gates={[AND01]} label="The deck’s answer" />
}
export function OrGate01Lab() {
  return <GateBoard01 gates={[OR01, AND01]} label="The deck’s answer" />
}
export function Exercise01Lab() {
  return <GateBoard01 gates={[NOR01, NAND01]} label="Show the worked answer" />
}
