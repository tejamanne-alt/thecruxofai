'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, NumBox, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'
const INDIGO = '#4f46e5'
const GREY = '#71717a'

/* ========================================================================== */
/* The arithmetic of session 4, written once                                  */
/* ========================================================================== */

/** σ(z) = 1/(1 + e⁻ᶻ), slide 13. Split at zero so a huge |z| cannot overflow. */
export function sigmoid(z: number) {
  return z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z))
}
/** σ′(z) = σ(z)(1 − σ(z)), slide 13. */
export function dsigmoid(z: number) {
  const s = sigmoid(z)
  return s * (1 - s)
}
/** ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)], slide 21. Clipped so log(0) is finite. */
export function bce(yhat: number, y: number) {
  const p = clamp(yhat, 1e-12, 1 - 1e-12)
  return -(y * Math.log(p) + (1 - y) * Math.log(1 - p))
}
/** z = wᵀx for one augmented example. */
export const logit = (w: number[], x: number[]) => w.reduce((s, wj, j) => s + wj * x[j], 0)
/** J(w), the average cross-entropy over a dataset, slide 22. */
export function totalLoss(X: number[][], y: number[], w: number[]) {
  return X.reduce((s, x, i) => s + bce(sigmoid(logit(w, x)), y[i]), 0) / X.length
}
/** ∇ℓ = (ŷ − y)x for one example, slide 26. */
export function gradOne(x: number[], y: number, w: number[]) {
  const e = sigmoid(logit(w, x)) - y
  return x.map((xj) => e * xj)
}
/** The batch gradient, for the comparison in part 9. */
export function gradBatch(X: number[][], y: number[], w: number[]) {
  const g = w.map(() => 0)
  X.forEach((x, i) => {
    const e = sigmoid(logit(w, x)) - y[i]
    x.forEach((xj, j) => (g[j] += (e * xj) / X.length))
  })
  return g
}

/** Slide 31: four students, hours studied against pass or fail. */
export const HOURS_X: number[][] = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
]
export const HOURS_Y = [0, 0, 1, 1]
/** The learning rate the deck uses, slide 32. */
export const DECK_ETA = 0.5

const f2 = (v: number) => v.toFixed(2)
const f3 = (v: number) => v.toFixed(3)
const f4 = (v: number) => v.toFixed(4)

/* --------------------------------------------------------- small helpers */
/*
 * Hoisted, never written inside a lab body: a component defined during render
 * is a new type on every render, so React throws the subtree away and a typed
 * number box loses focus mid-keystroke.
 */

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12px]/[1.8] text-zinc-700">
      {children}
    </div>
  )
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-950/[0.06] py-1.5 last:border-0">
      <span className="text-[12.5px] text-zinc-600">{k}</span>
      <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: tone ?? '#09090b' }}>
        {v}
      </span>
    </div>
  )
}

/* ========================================================================== */
/* 1 — what classification is (slides 4–6)                                    */
/* ========================================================================== */

const KIND_TASKS = [
  {
    id: 'spam',
    name: 'Is this email spam?',
    out: 'Spam or Not Spam',
    kind: 'binary',
    why: 'The deck’s first example, slide 5. Two labels, and every email gets exactly one of them, so y ∈ {0, 1}.',
  },
  {
    id: 'disease',
    name: 'Does this patient have the disease?',
    out: 'Present or absent',
    kind: 'binary',
    why: 'Slide 5 again. Two labels — which is why recall matters so much here: a missed positive is a missed illness.',
  },
  {
    id: 'digit',
    name: 'Which digit is in this image?',
    out: 'One of 0–9',
    kind: 'multi-class',
    why: 'Ten labels and exactly one is right, so K = 10. Slide 6 lists digit recognition as the standard multi-class example.',
  },
  {
    id: 'sentiment',
    name: 'Is this review positive, negative or neutral?',
    out: 'One of three',
    kind: 'multi-class',
    why: 'Slide 5. Three labels, one answer per review. K = 3, and softmax gives three probabilities adding to 1.',
  },
  {
    id: 'genre',
    name: 'Which genres does this film belong to?',
    out: 'Any number of genres',
    kind: 'multi-label',
    why: 'Slide 6. A film can be action *and* comedy at once, so the labels are not exclusive — the probabilities need not add to 1, and you use one sigmoid per genre rather than a softmax.',
  },
  {
    id: 'tags',
    name: 'Which tags apply to this document?',
    out: 'Any subset of tags',
    kind: 'multi-label',
    why: 'Slide 6’s second multi-label example. Same shape as the film genres: several answers can be true together.',
  },
  {
    id: 'price',
    name: 'What will this house sell for?',
    out: 'A price',
    kind: 'not classification',
    why: 'Not on this slide — carried over from session 3 as the contrast. The target is a continuous number, so this is regression, and none of the three classification boxes fits it.',
  },
]

const KIND_CHOICES = ['binary', 'multi-class', 'multi-label', 'not classification']

export function TaskKindLab() {
  const [pick, setPick] = useState('spam')
  const [guess, setGuess] = useState<string | null>(null)
  const t = KIND_TASKS.find((x) => x.id === pick)!

  return (
    <LabBox>
      <LabNote>
        Classification predicts a <strong>discrete class label</strong> from a feature vector: x in ℝᵈ in, y in {'{'}1,
        2, …, K{'}'} out. Slide 6 splits it three ways by how many labels an example may carry. Pick a task and decide
        which box it lands in.
      </LabNote>

      <Presets
        items={KIND_TASKS.map((x) => ({ id: x.id, label: x.name }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setGuess(null)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The output is</div>
          <div className="mb-4 text-[17px] font-semibold text-zinc-950">{t.out}</div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">So the task is</div>
          <div className="flex flex-wrap gap-2">
            {KIND_CHOICES.map((k) => (
              <Chip key={k} on={guess === k} label={k} onClick={() => setGuess(k)} />
            ))}
          </div>
          {guess && (
            <div className="mt-3">
              <Verdict ok={guess === t.kind}>
                {guess === t.kind ? `Yes — ${t.kind}.` : `Not quite. This one is ${t.kind}.`}
              </Verdict>
              <p className="crux-prose mt-2 text-[13px]/[1.7] text-zinc-700">{t.why}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="This task is"
            value={guess ? t.kind : 'not answered'}
            tone={guess === t.kind ? TEAL : guess ? RED : GREY}
          />
          <Mono>
            <div>x ∈ ℝᵈ — the feature vector</div>
            <div>
              y ∈ {'{'}1, 2, …, K{'}'} — a discrete label
            </div>
            <div>
              learn f : ℝᵈ → {'{'}1, …, K{'}'}
            </div>
          </Mono>
          <PanelNote>
            The test is only ever about the output. Binary is K = 2, multi-class is K {'>'} 2 with exactly one answer,
            and multi-label drops the “exactly one” — which changes the last layer from a softmax to K separate
            sigmoids.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 2 — why not linear regression (slides 8–10)                                */
/* ========================================================================== */

/** The exact least-squares line through 1-D points, so nothing is eyeballed. */
function fitLine(xs: number[], ys: number[]) {
  const n = xs.length
  const mx = xs.reduce((s, v) => s + v, 0) / n
  const my = ys.reduce((s, v) => s + v, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  const slope = den < 1e-12 ? 0 : num / den
  return { slope, intercept: my - slope * mx }
}

const BASE_X = [1, 2, 3, 6, 7]
const BASE_Y = [0, 0, 0, 1, 1]

export function WhyNotLinearLab() {
  // The last point's position is the one degree of freedom; everything shown is
  // recomputed from it rather than stored.
  const [far, setFar] = useState(8)
  const xs = [...BASE_X, far]
  const ys = [...BASE_Y, 1]
  const { slope, intercept } = fitLine(xs, ys)
  const at = (x: number) => intercept + slope * x
  const lo = at(0)
  const hi = at(14)
  const outside = lo < 0 || hi > 1
  // Where the regression line crosses 0.5 — the boundary a linear fit implies.
  const cross = Math.abs(slope) < 1e-9 ? NaN : (0.5 - intercept) / slope
  const wrong = xs.filter((x, i) => (at(x) >= 0.5 ? 1 : 0) !== ys[i]).length

  function draw(g: CanvasRenderingContext2D, W: number, H: number) {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 14, ymin: -0.6, ymax: 1.8, xlab: 'x', ylab: 'y' })

    // The band a probability is allowed to live in.
    g.fillStyle = 'rgba(13,148,136,0.07)'
    g.fillRect(f.L, f.py(1), f.R - f.L, f.py(0) - f.py(1))
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(13,148,136,0.55)'
    g.lineWidth = 1
    for (const v of [0, 1]) {
      g.beginPath()
      g.moveTo(f.L, f.py(v))
      g.lineTo(f.R, f.py(v))
      g.stroke()
    }
    g.setLineDash([])
    g.fillStyle = '#0f766e'
    g.textAlign = 'left'
    g.fillText('y = 1', f.L + 6, f.py(1) - 9)
    g.fillText('y = 0', f.L + 6, f.py(0) + 11)

    // The fitted line, red wherever it has left [0, 1].
    g.lineWidth = 2.5
    for (let px = f.L; px < f.R; px += 2) {
      const x = f.ux(px)
      const v = at(x)
      g.strokeStyle = v < 0 || v > 1 ? RED : INDIGO
      g.beginPath()
      g.moveTo(px, f.py(at(f.ux(px))))
      g.lineTo(px + 2, f.py(at(f.ux(px + 2))))
      g.stroke()
    }

    if (Number.isFinite(cross) && cross > 0 && cross < 14) {
      g.setLineDash([3, 3])
      g.strokeStyle = 'rgba(217,119,6,0.8)'
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(f.px(cross), f.T)
      g.lineTo(f.px(cross), f.B)
      g.stroke()
      g.setLineDash([])
      g.fillStyle = AMBER
      g.textAlign = 'center'
      g.fillText('line crosses 0.5', f.px(cross), f.T + 10)
    }

    xs.forEach((x, i) => {
      const isDrag = i === xs.length - 1
      dot(g, f.px(x), f.py(ys[i]), isDrag ? 0 : 5.5, ys[i] === 1 ? TEAL : '#3f3f46')
      if (isDrag) grip(g, f.px(x), f.py(ys[i]), TEAL, 8)
    })
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 10’s objection, made concrete. These six points have labels of 0 and 1 only, and the line below is the
        exact least-squares fit to them. Drag the right-hand point further out — the label stays 1, but the line has to
        tilt to reach it, and the predictions leave the shaded band.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          targets={{ far }}
          candidates={() => []}
          tooltip={() => null}
          handles={(f: Frame) => [{ id: 'far', px: f.px(far), py: f.py(1), grab: 'anywhere', label: 'the far point' }]}
          onDragTo={(_id, x) => setFar(clamp(Math.round(x * 2) / 2, 7.5, 13.5))}
          caption="Drag the ringed point along the top line, or press anywhere in the plot to send it there. Tab to it and the arrow keys move it too."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Prediction at x = 14"
            value={f3(hi)}
            note={hi > 1 ? 'above 1 — not a probability' : 'inside [0, 1]'}
            tone={hi > 1 ? RED : TEAL}
          />
          <ReadOutGrid
            items={[
              { label: 'at x = 0', value: f3(lo) },
              { label: 'slope', value: f3(slope) },
              { label: 'crosses 0.5 at', value: Number.isFinite(cross) ? f2(cross) : '—' },
              { label: 'misclassified', value: `${wrong} of 6` },
            ]}
          />
          <Verdict ok={!outside}>
            {outside
              ? 'The fitted line predicts values outside [0, 1]. Those cannot be read as probabilities.'
              : 'Every prediction happens to sit inside [0, 1] here — but nothing in the model guarantees it.'}
          </Verdict>
          <PanelNote>
            Watch the amber line as well as the red. Dragging one far-away point of the class it already gets right
            still moves the implied boundary, because squared error charges the line for being “too correct” at that
            point. A classifier should not care how far past the boundary a correct example sits.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 3 — the sigmoid (slides 12–14)                                             */
/* ========================================================================== */

export function SigmoidLab() {
  const [z, setZ] = useState(0)
  const s = sigmoid(z)
  const d = dsigmoid(z)
  const mirror = sigmoid(-z)

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, { xmin: -6, xmax: 6, ymin: -0.05, ymax: 1.05, xlab: 'z', ylab: 'σ(z) and σ′(z)' })
    const zd = ctx.disp.z ?? z

    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.L, f.py(0.5))
    g.lineTo(f.R, f.py(0.5))
    g.moveTo(f.px(0), f.T)
    g.lineTo(f.px(0), f.B)
    g.stroke()
    g.setLineDash([])

    // σ′, drawn first so σ sits on top of it.
    g.strokeStyle = AMBER
    g.lineWidth = 2
    g.beginPath()
    for (let px = f.L; px <= f.R; px += 2) {
      const v = dsigmoid(f.ux(px))
      px === f.L ? g.moveTo(px, f.py(v)) : g.lineTo(px, f.py(v))
    }
    g.stroke()

    g.strokeStyle = INDIGO
    g.lineWidth = 2.75
    g.beginPath()
    for (let px = f.L; px <= f.R; px += 2) {
      const v = sigmoid(f.ux(px))
      px === f.L ? g.moveTo(px, f.py(v)) : g.lineTo(px, f.py(v))
    }
    g.stroke()

    // The mirror point, so σ(−z) = 1 − σ(z) is visible rather than asserted.
    dot(g, f.px(-zd), f.py(sigmoid(-zd)), 5, 'rgba(79,70,229,0.35)')
    g.fillStyle = 'rgba(79,70,229,0.75)'
    g.textAlign = 'center'
    g.fillText('σ(−z)', f.px(-zd), f.py(sigmoid(-zd)) - 12)

    dot(g, f.px(zd), f.py(dsigmoid(zd)), 5, AMBER)
    grip(g, f.px(zd), f.py(sigmoid(zd)), INDIGO, 8)

    g.fillStyle = INDIGO
    g.textAlign = 'left'
    g.fillText('σ(z)', f.R - 46, f.py(0.93))
    g.fillStyle = AMBER
    g.fillText('σ′(z)', f.R - 46, f.py(0.12))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The whole of slides 13 and 14 in one picture. Drag the marker along the blue curve — or press anywhere in the
        plot. The amber curve is the derivative, the faint dot is σ(−z), and the panel checks the two identities the
        slide states.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          targets={{ z }}
          candidates={() => []}
          tooltip={() => null}
          handles={(f: Frame) => [
            { id: 'z', px: f.px(z), py: f.py(sigmoid(z)), grab: 'anywhere', label: 'the input z' },
          ]}
          onDragTo={(_id, x) => setZ(clamp(Math.round(x * 20) / 20, -6, 6))}
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="σ(z)" value={f4(s)} note={`z = ${f2(z)}`} tone={INDIGO} />
          <ReadOutGrid
            items={[
              { label: 'σ′(z)', value: f4(d) },
              { label: 'σ(z)(1−σ(z))', value: f4(s * (1 - s)) },
              { label: 'σ(−z)', value: f4(mirror) },
              { label: '1 − σ(z)', value: f4(1 - s) },
            ]}
          />
          <Verdict ok>
            Both identities hold at every z: the derivative equals σ(1 − σ), and σ(−z) equals 1 − σ(z). Neither is an
            approximation — they are exact.
          </Verdict>
          <PanelNote>
            Push z past ±5 and σ′ all but vanishes. That is the saturation the deck warns about: a badly scaled feature
            drives z far from zero, the derivative goes to nothing, and the weight stops moving even though the answer
            is wrong.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setZ(0)}>z = 0</Btn>
            <Btn onClick={() => setZ(-1)}>z = −1</Btn>
            <Btn onClick={() => setZ(5)}>z = 5</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 4 — the four components, and the data in matrix form (slides 16–17)        */
/* ========================================================================== */

const COMPONENTS = [
  {
    id: 'data',
    name: 'Data',
    fill: 'd-dimensional input vectors and binary labels y ∈ {0, 1}',
    breaks:
      'There is nothing to learn from. Every other component is defined in terms of examples, so without data none of them can even be evaluated once.',
  },
  {
    id: 'model',
    name: 'Model',
    fill: 'a single neuron with a sigmoid activation',
    breaks:
      'No ŷ, so no loss and no gradient. The model is the only thing here that has parameters, so with it removed there is nothing for the learning algorithm to move.',
  },
  {
    id: 'obj',
    name: 'Objective function',
    fill: 'binary cross-entropy loss',
    breaks:
      'You can still make predictions, but you cannot say whether they are any good — and “better” has no meaning, so training has no direction to go in.',
  },
  {
    id: 'algo',
    name: 'Learning algorithm',
    fill: 'stochastic gradient descent',
    breaks:
      'The loss can be computed but never reduced. The weights sit wherever they were initialised, which for w = 0 means predicting 0.5 for everything for ever.',
  },
]

export function ComponentsLab() {
  const [off, setOff] = useState<string | null>(null)
  const missing = COMPONENTS.find((c) => c.id === off)

  return (
    <LabBox>
      <LabNote>
        Slide 16’s checklist. Two of the four boxes changed from session 3 — the model gained a sigmoid and the loss
        became cross-entropy — and one changed how it is run: gradient descent became <em>stochastic</em>. Press a card
        to take that component away and read what stops.
      </LabNote>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {COMPONENTS.map((c, i) => {
          const gone = off === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setOff(gone ? null : c.id)}
              className="cursor-pointer rounded-lg border p-3.5 text-left"
              style={
                gone
                  ? { borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.06)' }
                  : { borderColor: 'rgba(9,9,11,0.1)', background: '#fff' }
              }
            >
              <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                {i + 1}. {c.name}
              </div>
              <div
                className="text-[13px]/[1.55] font-semibold"
                style={{ color: gone ? '#991b1b' : '#09090b', textDecoration: gone ? 'line-through' : 'none' }}
              >
                {c.fill}
              </div>
            </button>
          )
        })}
      </div>
      {missing ? (
        <Verdict ok={false}>
          <strong>Without the {missing.name.toLowerCase()}: </strong>
          {missing.breaks}
        </Verdict>
      ) : (
        <Verdict ok>
          All four present. Data feeds the model, the model produces ŷ, the objective turns ŷ and y into one number, and
          the learning algorithm moves the weights to make that number smaller.
        </Verdict>
      )}
      <PanelNote>
        The deck adds a note under this slide: SGD is used here “for learning purposes only”, in place of the batch
        gradient descent of session 3. Part 21 puts the compromise everyone actually ships — mini-batch — back in.
      </PanelNote>
    </LabBox>
  )
}

export function ClassDataLab() {
  const [rows, setRows] = useState<number[][]>([
    [2, 3],
    [4, 1],
    [1, 5],
  ])
  const [labels, setLabels] = useState([0, 1, 0])

  const N = rows.length
  const d = 2
  const setCell = (i: number, j: number, v: number) =>
    setRows((r) => r.map((row, ri) => (ri === i ? row.map((c, ci) => (ci === j ? v : c)) : row)))

  return (
    <LabBox>
      <LabNote>
        Slide 17’s three objects, built from whatever you type. The 1 at the front of every row is not a feature — it is
        the seat the bias w₀ sits in, exactly as in session 3. The one thing that changed from regression is the label
        column: it may now only hold 0 or 1.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Type the features
            </div>
            <NumBox m={rows} onEdit={setCell} name="features" />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Press to flip each label
            </div>
            <div className="flex flex-wrap gap-2">
              {labels.map((y, i) => (
                <Chip
                  key={i}
                  on={y === 1}
                  label={`example ${i + 1}: y = ${y}`}
                  onClick={() => setLabels((l) => l.map((v, vi) => (vi === i ? 1 - v : v)))}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The design matrix X, with the ones column
            </div>
            <NumBox m={rows.map((r) => [1, ...r])} readOnly name="design matrix" />
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Shape of X" value={`${N} × ${d + 1}`} note={`N = ${N}, d = ${d}`} />
          <ReadOutGrid
            items={[
              { label: 'w has', value: `${d + 1} entries` },
              { label: 'y ∈', value: '{0, 1}ᴺ' },
              { label: 'positives', value: String(labels.filter((v) => v === 1).length) },
              { label: 'negatives', value: String(labels.filter((v) => v === 0).length) },
            ]}
          />
          <Mono>
            <div>X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾</div>
            <div>y = [{labels.join(', ')}]ᵀ</div>
            <div>w = [w₀, w₁, …, w_d]ᵀ</div>
          </Mono>
          <PanelNote>
            The parameter count is the column count of X, not the row count. Adding examples never adds a weight —
            adding a feature does.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 5 — logistic regression as one neuron (slides 18–19)                       */
/* ========================================================================== */

export function LogisticNeuronLab() {
  const [w, setW] = useState([-3, 1, 0.5])
  const [x, setX] = useState([2, 2])
  const z = w[0] + w[1] * x[0] + w[2] * x[1]
  const yhat = sigmoid(z)
  const cls = yhat >= 0.5 ? 1 : 0

  const setWj = (j: number, v: number) => setW((old) => old.map((c, ci) => (ci === j ? v : c)))
  const setXj = (j: number, v: number) => setX((old) => old.map((c, ci) => (ci === j ? v : c)))

  return (
    <LabBox>
      <LabNote>
        The neuron of slide 18, wired up. Move any slider and follow the number through the three boxes: the weighted
        sum z, the squash σ(z), and the class the decision rule picks. Nothing in the first box knows it is doing
        classification — only the last two do.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-stretch gap-2">
            <div className="min-w-[130px] flex-1 rounded-lg border border-zinc-950/10 bg-zinc-50 p-3">
              <div className="mb-1 text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">Inputs</div>
              <div className="font-mono text-[12.5px]/[1.7] text-zinc-800">
                <div>x₀ = 1 (bias seat)</div>
                <div>x₁ = {f2(x[0])}</div>
                <div>x₂ = {f2(x[1])}</div>
              </div>
            </div>
            <div className="grid place-items-center px-1 font-mono text-[18px] text-zinc-400">→</div>
            <div
              className="min-w-[130px] flex-1 rounded-lg border p-3"
              style={{ borderColor: 'rgba(79,70,229,0.35)', background: 'rgba(79,70,229,0.06)' }}
            >
              <div className="mb-1 text-[10.5px] font-semibold tracking-[0.05em] uppercase" style={{ color: INDIGO }}>
                Σ — the weighted sum
              </div>
              <div className="font-mono text-[12px]/[1.6] text-zinc-700">
                {f2(w[0])} {w[1] >= 0 ? '+' : '−'} {f2(Math.abs(w[1]))}·{f2(x[0])} {w[2] >= 0 ? '+' : '−'}{' '}
                {f2(Math.abs(w[2]))}·{f2(x[1])}
              </div>
              <div className="mt-1 font-mono text-[19px] font-semibold" style={{ color: INDIGO }}>
                z = {f3(z)}
              </div>
            </div>
            <div className="grid place-items-center px-1 font-mono text-[18px] text-zinc-400">→</div>
            <div
              className="min-w-[130px] flex-1 rounded-lg border p-3"
              style={{ borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.07)' }}
            >
              <div className="mb-1 text-[10.5px] font-semibold tracking-[0.05em] uppercase" style={{ color: TEAL }}>
                σ — the squash
              </div>
              <div className="font-mono text-[12px]/[1.6] text-zinc-700">1 / (1 + e^−z)</div>
              <div className="mt-1 font-mono text-[19px] font-semibold" style={{ color: TEAL }}>
                ŷ = {f4(yhat)}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Slider
              label="w₀ (bias)"
              value={w[0]}
              display={f2(w[0])}
              min={-8}
              max={8}
              step={0.1}
              hint="Slides the whole boundary without tilting it."
              onChange={(v) => setWj(0, v)}
            />
            <Slider
              label="w₁"
              value={w[1]}
              display={f2(w[1])}
              min={-4}
              max={4}
              step={0.1}
              hint="How much feature 1 pushes towards class 1."
              onChange={(v) => setWj(1, v)}
            />
            <Slider
              label="w₂"
              value={w[2]}
              display={f2(w[2])}
              min={-4}
              max={4}
              step={0.1}
              hint="Same for feature 2. A weight of 0 means the feature is ignored."
              onChange={(v) => setWj(2, v)}
            />
            <Slider
              label="x₁"
              value={x[0]}
              display={f2(x[0])}
              min={-5}
              max={5}
              step={0.1}
              hint="The example being classified."
              onChange={(v) => setXj(0, v)}
            />
            <Slider
              label="x₂"
              value={x[1]}
              display={f2(x[1])}
              min={-5}
              max={5}
              step={0.1}
              hint="Its second feature."
              onChange={(v) => setXj(1, v)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="P(y = 1 | x)"
            value={f4(yhat)}
            note={`predicted class ${cls}`}
            tone={cls === 1 ? TEAL : GREY}
          />
          <ReadOutGrid
            items={[
              { label: 'logit z', value: f3(z) },
              { label: 'σ′(z)', value: f4(dsigmoid(z)) },
              { label: 'P(y = 0 | x)', value: f4(1 - yhat) },
              { label: 'the two sum to', value: f3(yhat + (1 - yhat)) },
            ]}
          />
          <PanelNote>
            The two probabilities always add to exactly 1, because 1 − σ(z) is the only other option. A binary
            classifier really does have two outputs — it just never has to compute the second one.
          </PanelNote>
          <PanelNote>
            Note the word <strong>logit</strong> for z. It is the pre-activation score, and it is the thing the model is
            really linear in: doubling every weight doubles z, but it does not double ŷ.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 6 — the decision rule and the boundary (slide 20)                          */
/* ========================================================================== */

const PTS: Array<{ x: number; y: number; c: number }> = [
  { x: 1.2, y: 1.4, c: 0 },
  { x: 2.1, y: 0.9, c: 0 },
  { x: 1.6, y: 2.4, c: 0 },
  { x: 0.8, y: 2.9, c: 0 },
  { x: 2.6, y: 2.1, c: 0 },
  { x: 4.2, y: 3.6, c: 1 },
  { x: 3.6, y: 4.4, c: 1 },
  { x: 4.7, y: 2.8, c: 1 },
  { x: 3.1, y: 3.9, c: 1 },
  { x: 4.9, y: 4.3, c: 1 },
]

export function BoundaryLab() {
  // Two degrees of freedom, both draggable: the tilt and the offset.
  const [w, setW] = useState([-6, 1, 1])
  const wrong = PTS.filter((p) => (sigmoid(w[0] + w[1] * p.x + w[2] * p.y) >= 0.5 ? 1 : 0) !== p.c).length
  const acc = (PTS.length - wrong) / PTS.length
  const norm = Math.hypot(w[1], w[2]) || 1

  // A point on the line, and the direction along it, so the handles can sit on
  // the boundary rather than in mid-air.
  const cx = (-w[0] * w[1]) / (norm * norm)
  const cy = (-w[0] * w[2]) / (norm * norm)

  function draw(g: CanvasRenderingContext2D, W: number, H: number) {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 6, ymin: 0, ymax: 6, xlab: 'x₁', ylab: 'x₂' })

    // Shade by probability, so "the boundary is where σ = 0.5" is visible.
    const step = 7
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const p = sigmoid(w[0] + w[1] * f.ux(px) + w[2] * f.uy(py))
        g.fillStyle = p >= 0.5 ? `rgba(13,148,136,${(p - 0.5) * 0.5})` : `rgba(63,63,70,${(0.5 - p) * 0.4})`
        g.fillRect(px, py, step, step)
      }
    }

    // The line w₀ + w₁x₁ + w₂x₂ = 0, drawn by walking along its direction.
    const dx = -w[2] / norm
    const dy = w[1] / norm
    g.strokeStyle = '#09090b'
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(cx - dx * 20), f.py(cy - dy * 20))
    g.lineTo(f.px(cx + dx * 20), f.py(cy + dy * 20))
    g.stroke()

    PTS.forEach((p) => {
      const pred = sigmoid(w[0] + w[1] * p.x + w[2] * p.y) >= 0.5 ? 1 : 0
      dot(g, f.px(p.x), f.py(p.y), 6, p.c === 1 ? TEAL : '#3f3f46', pred === p.c ? null : RED)
    })

    grip(g, f.px(cx), f.py(cy), '#09090b', 8)
    grip(g, f.px(cx + dx * 1.6), f.py(cy + dy * 1.6), AMBER, 7)
    g.fillStyle = GREY
    g.textAlign = 'left'
    g.fillText('σ ≥ 0.5 → class 1', f.R - 116, f.T + 12)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 20 says the two tests are the same one: ŷ ≥ 0.5 exactly when wᵀx ≥ 0. Drag the black grip to slide the
        boundary and the amber one to tilt it. Rings mark the points the current weights get wrong.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={360}
          draw={draw}
          targets={{ a: w[0], b: w[1], c: w[2] }}
          candidates={() => []}
          tooltip={() => null}
          handles={(f: Frame) => {
            const dx = -w[2] / norm
            const dy = w[1] / norm
            return [
              { id: 'move', px: f.px(cx), py: f.py(cy), label: 'the boundary’s position' },
              { id: 'tilt', px: f.px(cx + dx * 1.6), py: f.py(cy + dy * 1.6), label: 'the boundary’s tilt' },
            ]
          }}
          onDragTo={(id, x, y) => {
            if (id === 'move') {
              // Keep the direction, move the offset so the line passes through here.
              setW((old) => [-(old[1] * x + old[2] * y), old[1], old[2]])
            } else {
              // Point the line at the dragged spot, keeping it through the same point.
              const ux = x - cx
              const uy = y - cy
              const len = Math.hypot(ux, uy)
              if (len < 0.2) return
              const nx = uy / len
              const ny = -ux / len
              setW([-(nx * cx + ny * cy), nx, ny])
            }
          }}
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Accuracy"
            value={`${(acc * 100).toFixed(0)}%`}
            note={`${wrong} of ${PTS.length} wrong`}
            tone={wrong === 0 ? TEAL : RED}
          />
          <Mono>
            <div>w₀ = {f2(w[0])}</div>
            <div>w₁ = {f2(w[1])}</div>
            <div>w₂ = {f2(w[2])}</div>
            <div className="mt-1 text-zinc-500">boundary: w₀ + w₁x₁ + w₂x₂ = 0</div>
          </Mono>
          <PanelNote>
            The boundary is a <strong>hyperplane</strong> — a line here, a plane with three features, a flat (d −
            1)-dimensional slice in general. It is straight no matter how curved the shading looks, because z is linear
            in x and σ only relabels the values of z.
          </PanelNote>
          <PanelNote>
            Multiplying all three weights by 10 leaves the boundary exactly where it is and makes the shading much
            sharper. Same decisions, far more confident probabilities — which is worth remembering when a model’s
            confidence looks impressive.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setW([-6, 1, 1])}>Reset</Btn>
            <Btn onClick={() => setW([-60, 10, 10])}>×10 the weights</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 7 — binary cross-entropy (slides 21–22)                                    */
/* ========================================================================== */

export function BceLab() {
  const [yhat, setYhat] = useState(0.5)
  const [y, setY] = useState(1)
  const loss = bce(yhat, y)
  const other = bce(yhat, 1 - y)

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 1,
      ymin: 0,
      ymax: 5,
      xlab: 'ŷ — the predicted P(y = 1)',
      ylab: 'loss',
    })
    const p = ctx.disp.yhat ?? yhat

    for (const label of [1, 0]) {
      const on = label === y
      g.strokeStyle = on ? (label === 1 ? TEAL : '#3f3f46') : 'rgba(9,9,11,0.16)'
      g.lineWidth = on ? 2.75 : 1.5
      g.beginPath()
      let started = false
      for (let px = f.L + 1; px <= f.R; px += 2) {
        const v = bce(f.ux(px), label)
        if (v > 5) {
          started = false
          continue
        }
        started ? g.lineTo(px, f.py(v)) : g.moveTo(px, f.py(v))
        started = true
      }
      g.stroke()
    }

    g.setLineDash([3, 3])
    g.strokeStyle = 'rgba(9,9,11,0.2)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.px(p), f.T)
    g.lineTo(f.px(p), f.B)
    g.stroke()
    g.setLineDash([])

    const v0 = Math.min(5, bce(p, 0))
    const v1 = Math.min(5, bce(p, 1))
    dot(g, f.px(p), f.py(v0), 5, y === 0 ? '#3f3f46' : 'rgba(63,63,70,0.3)')
    dot(g, f.px(p), f.py(v1), 5, y === 1 ? TEAL : 'rgba(13,148,136,0.3)')
    grip(g, f.px(p), f.py(Math.min(5, bce(p, y))), y === 1 ? TEAL : '#3f3f46', 8)

    g.fillStyle = TEAL
    g.textAlign = 'right'
    g.fillText('y = 1: −log ŷ', f.R - 8, f.py(4.4))
    g.fillStyle = '#3f3f46'
    g.textAlign = 'left'
    g.fillText('y = 0: −log(1 − ŷ)', f.L + 8, f.py(4.4))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        One formula with two branches, slide 21. Press the buttons to change the true label and drag the marker to
        change what the model said. The solid curve is the branch that is actually being used; the faint one is what the
        same prediction would have cost under the opposite label.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          targets={{ yhat }}
          candidates={() => []}
          tooltip={() => null}
          jumpKey={y}
          handles={(f: Frame) => [
            {
              id: 'p',
              px: f.px(yhat),
              py: f.py(Math.min(5, bce(yhat, y))),
              grab: 'anywhere',
              label: 'the predicted probability',
            },
          ]}
          onDragTo={(_id, x) => setYhat(clamp(Math.round(x * 100) / 100, 0.01, 0.99))}
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="flex flex-wrap gap-2">
            <Chip on={y === 1} label="true label y = 1" onClick={() => setY(1)} />
            <Chip on={y === 0} label="true label y = 0" onClick={() => setY(0)} />
          </div>
          <ReadOut
            label="Loss ℓ"
            value={f4(loss)}
            note={y === 1 ? '−log(ŷ)' : '−log(1 − ŷ)'}
            tone={loss > 1 ? RED : TEAL}
          />
          <ReadOutGrid
            items={[
              { label: 'ŷ', value: f2(yhat) },
              { label: 'if y were ' + (1 - y), value: f3(other) },
              { label: 'ℓ at ŷ = 0.5', value: f3(bce(0.5, y)) },
              { label: 'perfect ℓ', value: '0.000' },
            ]}
          />
          <PanelNote>
            The other branch is always multiplied by zero, never deleted. Writing the loss with both terms and a (1 − y)
            in front of the second is what lets one line of code handle both labels — and what makes the derivative come
            out the same for both.
          </PanelNote>
          <PanelNote>
            ℓ at ŷ = 0.5 is log 2 ≈ 0.693 whatever the label. A model that has learnt nothing has this loss on every
            example, so J ≈ 0.693 is the number to compare a fresh training run against.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 8 — why cross-entropy and not squared error (slide 23)                     */
/* ========================================================================== */

export function WhyCeLab() {
  const [yhat, setYhat] = useState(0.05)
  const ce = bce(yhat, 1)
  const sq = 0.5 * (yhat - 1) ** 2
  // The slopes, which is what actually drives training.
  const dce = -1 / Math.max(yhat, 1e-9)
  const dsq = yhat - 1

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 1,
      ymin: 0,
      ymax: 3,
      xlab: 'ŷ, when the true label is 1',
      ylab: 'loss',
    })
    const p = ctx.disp.yhat ?? yhat

    g.strokeStyle = AMBER
    g.lineWidth = 2.25
    g.beginPath()
    for (let px = f.L; px <= f.R; px += 2) {
      const v = 0.5 * (f.ux(px) - 1) ** 2
      px === f.L ? g.moveTo(px, f.py(v)) : g.lineTo(px, f.py(v))
    }
    g.stroke()

    g.strokeStyle = TEAL
    g.lineWidth = 2.75
    g.beginPath()
    let started = false
    for (let px = f.L + 1; px <= f.R; px += 2) {
      const v = bce(f.ux(px), 1)
      if (v > 3) {
        started = false
        continue
      }
      started ? g.lineTo(px, f.py(v)) : g.moveTo(px, f.py(v))
      started = true
    }
    g.stroke()

    dot(g, f.px(p), f.py(Math.min(3, 0.5 * (p - 1) ** 2)), 5, AMBER)
    grip(g, f.px(p), f.py(Math.min(3, bce(p, 1))), TEAL, 8)

    g.fillStyle = TEAL
    g.textAlign = 'left'
    g.fillText('cross-entropy', f.L + 10, f.py(2.55))
    g.fillStyle = AMBER
    g.fillText('squared error', f.L + 10, f.py(0.62))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Both losses agree that ŷ = 1 is perfect and that smaller is better. Drag the marker down towards ŷ = 0 — a
        confidently wrong prediction — and watch how differently the two react. The true label is 1 throughout.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          targets={{ yhat }}
          candidates={() => []}
          tooltip={() => null}
          handles={(f: Frame) => [
            {
              id: 'p',
              px: f.px(yhat),
              py: f.py(Math.min(3, bce(yhat, 1))),
              grab: 'anywhere',
              label: 'the predicted probability',
            },
          ]}
          onDragTo={(_id, x) => setYhat(clamp(Math.round(x * 100) / 100, 0.01, 0.99))}
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOutGrid
            items={[
              { label: 'cross-entropy', value: f3(ce) },
              { label: 'squared error', value: f3(sq) },
              { label: 'its slope', value: f2(dce) },
              { label: 'its slope', value: f2(dsq) },
            ]}
          />
          <ReadOut
            label="Ratio of the two slopes"
            value={`${Math.abs(dce / dsq).toFixed(1)}×`}
            note="how much harder cross-entropy pushes"
            tone={INDIGO}
          />
          <Verdict ok={yhat > 0.15}>
            {yhat > 0.15
              ? 'Both losses are still pushing in the same direction, and by comparable amounts.'
              : 'Confidently wrong. Squared error has almost stopped caring — its largest possible value is 0.5 — while cross-entropy is still climbing without limit.'}
          </Verdict>
          <PanelNote>
            The cap is the point. Squared error can never charge more than 0.5 for a mistake, however certain the model
            was, so a handful of confident errors barely move it. Cross-entropy has no ceiling, so being sure and wrong
            is the most expensive thing a model can do.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setYhat(0.99)}>Nearly right</Btn>
            <Btn onClick={() => setYhat(0.5)}>No idea</Btn>
            <Btn onClick={() => setYhat(0.01)}>Confidently wrong</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}
