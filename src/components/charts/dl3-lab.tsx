'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* The deck's tiny dataset, and the linear-regression arithmetic on it        */
/* ========================================================================== */

/** Slide 26: three houses, size against price. */
export const DECK_X: number[][] = [
  [1, 1],
  [1, 2],
  [1, 3],
]
export const DECK_Y = [2, 4, 5]
export const N = 3

export const predict = (X: number[][], w: number[]) => X.map((r) => r[0] * w[0] + r[1] * w[1])
export const errors = (X: number[][], y: number[], w: number[]) => predict(X, w).map((p, i) => p - y[i])
/** J(w) = (1/2N)‖Xw − y‖², slide 18. */
export const lossJ = (X: number[][], y: number[], w: number[]) =>
  errors(X, y, w).reduce((s, e) => s + e * e, 0) / (2 * X.length)
/** ∇J = (1/N)Xᵀ(Xw − y), slide 22. */
export const gradJ = (X: number[][], y: number[], w: number[]) => {
  const e = errors(X, y, w)
  return [X.reduce((s, r, i) => s + r[0] * e[i], 0) / X.length, X.reduce((s, r, i) => s + r[1] * e[i], 0) / X.length]
}
/** Exact least-squares answer by the normal equations, for checking against. */
export function normalEq(X: number[][], y: number[]) {
  let a = 0,
    b = 0,
    c = 0,
    p = 0,
    q = 0
  for (let i = 0; i < X.length; i++) {
    a += X[i][0] * X[i][0]
    b += X[i][0] * X[i][1]
    c += X[i][1] * X[i][1]
    p += X[i][0] * y[i]
    q += X[i][1] * y[i]
  }
  const det = a * c - b * b
  if (Math.abs(det) < 1e-12) return [0, 0]
  return [(c * p - b * q) / det, (a * q - b * p) / det]
}
/** Largest eigenvalue of XᵀX/N — the thing that decides how large η may be. */
export function lambdaMax(X: number[][]) {
  let a = 0,
    b = 0,
    c = 0
  for (const r of X) {
    a += r[0] * r[0]
    b += r[0] * r[1]
    c += r[1] * r[1]
  }
  a /= X.length
  b /= X.length
  c /= X.length
  const tr = a + c
  const det = a * c - b * b
  return (tr + Math.sqrt(Math.max(0, tr * tr - 4 * det))) / 2
}

/* ========================================================================== */
/* 1 — what regression is                                                     */
/* ========================================================================== */

const TASKS = [
  {
    id: 'price',
    name: 'House price from size and rooms',
    target: 'price in rupees',
    kind: 'regression',
    why: 'A price can be any positive number, and 4 200 001 is meaningfully different from 4 200 000. Continuous target, so regression.',
  },
  {
    id: 'temp',
    name: 'Tomorrow’s temperature',
    target: 'degrees',
    kind: 'regression',
    why: 'The deck’s second example. Temperature is continuous and ordered — being wrong by half a degree is nearly right, which is exactly what a continuous target means.',
  },
  {
    id: 'stock',
    name: 'Tomorrow’s stock price',
    target: 'price',
    kind: 'regression',
    why: 'The deck’s third. Note it is regression whether or not it is a good idea — the shape of the task and the wisdom of attempting it are separate questions.',
  },
  {
    id: 'spam',
    name: 'Is this email spam?',
    target: 'spam or not',
    kind: 'classification',
    why: 'Two labels with no order and no in-between. There is no such thing as being 0.3 spam, so this is classification and needs a different last layer and a different loss.',
  },
  {
    id: 'digit',
    name: 'Which digit is in this image?',
    target: 'one of ten labels',
    kind: 'classification',
    why: 'Ten categories. The labels happen to be numbers, which is a trap — 7 is not "more" than 3, so treating it as regression would train the model to predict 5 for everything.',
  },
  {
    id: 'age',
    name: 'How old is the person in this photo?',
    target: 'years',
    kind: 'regression',
    why: 'Not on the slides. Age is continuous and ordered, so guessing 31 for a 30-year-old is nearly right — which classification into 100 separate year-labels would not know.',
  },
]

export function RegressionKindLab() {
  const [pick, setPick] = useState('price')
  const [guess, setGuess] = useState<string | null>(null)
  const t = TASKS.find((x) => x.id === pick)!

  return (
    <LabBox>
      <LabNote>
        Regression predicts a <strong>continuous-valued output</strong> from input features: x in ℝᵈ, y in ℝ, and a
        function f to learn. The test is entirely about the target — pick a task and decide.
      </LabNote>

      <Presets
        items={TASKS.map((x) => ({ id: x.id, label: x.name }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setGuess(null)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The target is</div>
          <div className="mb-4 text-[17px] font-semibold text-zinc-950">{t.target}</div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">So the task is</div>
          <div className="flex flex-wrap gap-2">
            {['regression', 'classification'].map((k) => (
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
            tone={guess === t.kind ? TEAL : guess ? RED : '#71717a'}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12px]/[1.8] text-zinc-700">
            <div>x ∈ ℝᵈ — the feature vector</div>
            <div>y ∈ ℝ — the real-valued target</div>
            <div>learn f : ℝᵈ → ℝ with y ≈ f(x)</div>
          </div>
          <PanelNote>
            The trap is a categorical target whose labels happen to be numbers. Digits 0 to 9 are ten names, not ten
            quantities, and a squared-error loss over them would train the model to sit near the middle.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 2 — what makes it linear                                                   */
/* ========================================================================== */

const TRUTHS = [
  {
    id: 'lin',
    name: 'Truly linear',
    f: (x: number) => 1.4 * x + 2,
    note: 'A straight line fits perfectly, and the residuals are pure noise.',
  },
  {
    id: 'curve',
    name: 'Curved',
    f: (x: number) => 0.35 * x * x + 0.2 * x + 2,
    note: 'The straight line does its honest best and is wrong in a pattern — high at the ends, low in the middle. A pattern left in the errors is the signature of a model that is too simple.',
  },
  {
    id: 'step',
    name: 'A jump',
    f: (x: number) => (x > 5 ? 12 : 3),
    note: 'No straight line comes close. The fit splits the difference everywhere and is wrong everywhere.',
  },
]

const XS = Array.from({ length: 22 }, (_, i) => (i * 10) / 21)
function noisy(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return (s / 2147483648 - 0.5) * 1.6
  }
}

export function LinearityLab() {
  const [pick, setPick] = useState('lin')
  const t = TRUTHS.find((x) => x.id === pick)!
  const rnd = noisy(11)
  const ys = XS.map((x) => t.f(x) + rnd())
  const X = XS.map((x) => [1, x])
  const w = normalEq(X, ys)
  const res = errors(X, ys, w)
  const rms = Math.sqrt(res.reduce((s, e) => s + e * e, 0) / res.length)
  // A pattern left in the residuals: do neighbouring ones share a sign?
  let runs = 1
  for (let i = 1; i < res.length; i++) if (Math.sign(res[i]) !== Math.sign(res[i - 1])) runs++
  const patterned = runs < res.length / 3

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.5, xmax: 10.5, ymin: -2, ymax: 40, xlab: 'feature x', ylab: 'target y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(-0.5), f.py(w[0] + w[1] * -0.5))
    g.lineTo(f.px(10.5), f.py(w[0] + w[1] * 10.5))
    g.stroke()
    XS.forEach((x, i) => {
      g.strokeStyle = 'rgba(220,38,38,0.35)'
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(f.px(x), f.py(ys[i]))
      g.lineTo(f.px(x), f.py(w[0] + w[1] * x))
      g.stroke()
    })
    g.restore()
    XS.forEach((x, i) => dot(g, f.px(x), f.py(ys[i]), 4.5, '#2563eb'))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Linear regression assumes the output is a <strong>linear combination of the input features</strong>. Change what
        the truth actually is and watch the best straight line cope, or fail to.
      </LabNote>

      <Presets items={TRUTHS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ a: w[0], b: w[1] }}
          jumpKey={pick}
          height={320}
          caption="The red bars are the residuals — what the line got wrong at each point. The points are made up, with the same noise each time."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Best fitting line"
            value={`y = ${w[0].toFixed(2)} + ${w[1].toFixed(2)}x`}
            note={`typical error ${rms.toFixed(2)}`}
          />
          <ReadOutGrid
            items={[
              { label: 'w₀', value: w[0].toFixed(3) },
              { label: 'w₁', value: w[1].toFixed(3) },
              { label: 'sign changes', value: `${runs} of ${res.length}` },
              { label: 'RMS error', value: rms.toFixed(3) },
            ]}
          />
          <Verdict ok={!patterned}>
            {patterned
              ? 'The residuals change sign only a few times, so they run in long blocks — a pattern the line has not captured. Linear is the wrong assumption here.'
              : 'The residuals flip sign constantly, which is what noise looks like. Nothing systematic is left over.'}
          </Verdict>
          <PanelNote>{t.note}</PanelNote>
          <PanelNote>
            This is the real diagnostic and it costs nothing: plot what the model got wrong. Noise scatters; a missing
            term leaves a shape.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 3 — the four components, for regression                                    */
/* ========================================================================== */

const REG_PIECES = [
  {
    id: 'data',
    name: 'Data',
    slide: 'd-dimensional input vectors and target outputs',
    here: 'Three houses: size 1, 2, 3 and price 2, 4, 5. Stacked into X and y.',
    without:
      'No X and no y, so the prediction Xw has nothing to be compared against and the loss cannot even be evaluated.',
  },
  {
    id: 'model',
    name: 'Model',
    slide: 'single neuron implementing a linear function',
    here: 'ŷ = f(wᵀx) with f the identity, so ŷ = w₀ + w₁x.',
    without:
      'Nothing turns a size into a price. The loss has no ŷ, and there are no parameters for the algorithm to move.',
  },
  {
    id: 'obj',
    name: 'Objective function',
    slide: 'measures prediction error',
    here: 'J(w) = (1/2N)‖Xw − y‖², the mean squared error with a ½ in front.',
    without:
      'Two sets of weights cannot be compared, so "better" has no meaning and gradient descent has no surface to descend.',
  },
  {
    id: 'alg',
    name: 'Learning algorithm',
    slide: 'gradient descent to optimize weights',
    here: 'w ← w − η(1/N)Xᵀ(Xw − y), repeated until the gradient is small.',
    without:
      'A well-posed problem you cannot solve. For this tiny example the normal equations would do it exactly — for a real network nothing but descent is available.',
  },
]

export function RegComponentsLab() {
  const [off, setOff] = useState<string | null>(null)
  const missing = REG_PIECES.find((p) => p.id === off)

  return (
    <LabBox>
      <LabNote>
        The same four components as session 1, with this session’s answers written into them. Press one to take it away
        and read what stops working.
      </LabNote>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {REG_PIECES.map((p, i) => {
          const gone = off === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setOff(gone ? null : p.id)}
              className="flex cursor-pointer flex-col gap-1.5 rounded-lg border p-3.5 text-left"
              style={{
                borderColor: gone ? 'rgba(220,38,38,0.35)' : 'rgba(9,9,11,0.1)',
                background: gone ? 'rgba(220,38,38,0.06)' : '#fff',
                opacity: gone ? 0.75 : 1,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="grid size-5 place-items-center rounded-md text-[11px] font-semibold"
                  style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
                >
                  {i + 1}
                </span>
                <span className="text-[13.5px] font-semibold text-zinc-950">{p.name}</span>
              </span>
              <span className="text-[12px]/[1.55] text-zinc-600">{p.slide}</span>
              <span className="mt-1 text-[11px] font-semibold" style={{ color: gone ? RED : '#a1a1aa' }}>
                {gone ? 'taken away — press to put back' : 'press to take away'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          {missing ? (
            <>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: RED }}>
                Without {missing.name.toLowerCase()}
              </div>
              <p className="crux-prose text-[13.5px]/[1.75] text-zinc-800">{missing.without}</p>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {REG_PIECES.map((p) => (
                <div key={p.id} className="flex gap-3">
                  <span className="w-[150px] shrink-0 text-[13px] font-semibold text-zinc-900">{p.name}</span>
                  <span className="font-mono text-[12.5px]/[1.7] text-zinc-600">{p.here}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Components present" value={`${4 - (missing ? 1 : 0)} of 4`} tone={missing ? RED : TEAL} />
          <PanelNote>
            The only component that changes between the perceptron and linear regression is the third and, through it,
            the fourth. Same data shape, same single neuron — a different activation and a different loss.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 4 — the design matrix                                                      */
/* ========================================================================== */

export function DesignMatrixLab() {
  const [rows, setRows] = useState(3)
  const [feats, setFeats] = useState(1)
  const [ones, setOnes] = useState(true)

  const data = [
    [1, 2, 60],
    [2, 4, 72],
    [3, 5, 55],
    [4, 4, 91],
    [5, 8, 43],
  ]
  const ys = [2, 4, 5, 4, 8]
  const X = data.slice(0, rows).map((r) => (ones ? [1, ...r.slice(0, feats)] : r.slice(0, feats)))
  const cols = feats + (ones ? 1 : 0)

  return (
    <LabBox>
      <LabNote>
        Slide 12 does one small thing with big consequences: it glues a column of ones onto the front of the data. After
        that the bias is an ordinary weight and every formula in the session gets shorter.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                X — the design matrix
              </div>
              <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
                {X.map((r, i) => (
                  <div key={i} className="flex gap-1">
                    {r.map((v, j) => (
                      <span
                        key={j}
                        className="w-14 rounded px-2 py-1 text-right font-mono text-[13px] tabular-nums"
                        style={
                          ones && j === 0
                            ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                            : { color: '#27272a' }
                        }
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-1 text-center font-mono text-[11px] text-zinc-400">
                {rows} × {cols}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">y</div>
              <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
                {ys.slice(0, rows).map((v, i) => (
                  <span
                    key={i}
                    className="w-14 rounded px-2 py-1 text-right font-mono text-[13px] text-zinc-800 tabular-nums"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-center font-mono text-[11px] text-zinc-400">{rows} × 1</div>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">w</div>
              <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
                {Array.from({ length: cols }, (_, i) => (
                  <span key={i} className="w-14 rounded px-2 py-1 text-right font-mono text-[13px] text-zinc-500">
                    w{ones ? i : i + 1}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-center font-mono text-[11px] text-zinc-400">{cols} × 1</div>
            </div>
          </div>
          <div className="mt-4 border-t border-zinc-950/[0.08] pt-3 font-mono text-[12.5px]/[1.8] text-zinc-700">
            <div>
              ŷ = X w — ({rows} × {cols}) · ({cols} × 1) = ({rows} × 1)
            </div>
            <div className="text-zinc-500">
              the inner dimensions {cols} and {cols} match, so the product exists
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Shape of X"
            value={`${rows} × ${cols}`}
            note={ones ? 'N × (d + 1), with the ones column' : 'N × d, no bias'}
          />
          <Slider
            label="Examples N"
            value={rows}
            display={String(rows)}
            min={1}
            max={5}
            step={1}
            hint="Rows. One per training example."
            onChange={(v) => setRows(Math.round(v))}
          />
          <Slider
            label="Features d"
            value={feats}
            display={String(feats)}
            min={1}
            max={3}
            step={1}
            hint="Real columns, before the ones column is added."
            onChange={(v) => setFeats(Math.round(v))}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={ones} label="with the ones column" onClick={() => setOnes(true)} />
            <Chip on={!ones} label="without it" onClick={() => setOnes(false)} />
          </div>
          <Verdict ok={ones}>
            {ones
              ? 'The bias is now w₀, an ordinary weight on a column that happens to be all ones. Every line of algebra after this is shorter for it.'
              : 'No ones column, so no bias. Every line the model can draw is forced through the origin — the same restriction that made even the NOT gate impossible in session 2.'}
          </Verdict>
          <PanelNote>
            The deck writes the augmented example as x̃ = [1, x₁, … x_d]ᵀ. The tilde is there only to say “this one has
            the 1 on the front”, and it is dropped again as soon as nobody could be confused.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 5 — the linear model as a neuron, against the perceptron                   */
/* ========================================================================== */

export function LinearNeuronLab() {
  const [w0, setW0] = useState(0.5)
  const [w1, setW1] = useState(1.2)
  const [x, setX] = useState(2)

  const z = w0 + w1 * x
  const identity = z
  const step = z >= 0 ? 1 : 0

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -3, xmax: 5, ymin: -3, ymax: 7, xlab: 'input x', ylab: 'output' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(-3), f.py(w0 + w1 * -3))
    g.lineTo(f.px(5), f.py(w0 + w1 * 5))
    g.stroke()
    g.strokeStyle = AMBER
    g.lineWidth = 2.5
    g.beginPath()
    const cross = w1 === 0 ? null : -w0 / w1
    if (cross !== null) {
      g.moveTo(f.px(-3), f.py(w1 > 0 ? 0 : 1))
      g.lineTo(f.px(cross), f.py(w1 > 0 ? 0 : 1))
      g.moveTo(f.px(cross), f.py(w1 > 0 ? 1 : 0))
      g.lineTo(f.px(5), f.py(w1 > 0 ? 1 : 0))
    }
    g.stroke()
    g.restore()
    grip(g, f.px(x), f.py(identity), accentColour(), 7)
    dot(g, f.px(x), f.py(step), 6, AMBER)
    g.fillStyle = accentColour()
    g.textAlign = 'left'
    g.fillText('identity — regression', f.L + 6, f.T + 10)
    g.fillStyle = AMBER
    g.fillText('step — perceptron', f.L + 6, f.T + 24)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Same inputs, same weights, same sum. The only difference between session 2’s perceptron and this session’s
        linear regression is the box at the end — and it changes what the unit can say.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0, w1, x }}
          height={320}
          caption="Press or drag anywhere to move the input x. The round marker is the perceptron's answer; the grip is the regression's."
          handles={(f: Frame) => [{ id: 'x', px: f.px(x), py: f.py(identity), grab: 'anywhere' as const }]}
          onDragTo={(_id, v) => setX(Math.round(clamp(v, -3, 5) * 10) / 10)}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Regression says" value={identity.toFixed(2)} note="ŷ = z, any real number" />
          <ReadOut label="Perceptron says" value={String(step)} note="ŷ = 1 if z ≥ 0, else 0" tone={AMBER} />
          <Slider label="w₀" value={w0} display={w0.toFixed(2)} min={-3} max={3} step={0.1} hint="" onChange={setW0} />
          <Slider label="w₁" value={w1} display={w1.toFixed(2)} min={-3} max={3} step={0.1} hint="" onChange={setW1} />
          <Slider
            label="input x"
            value={x}
            display={x.toFixed(1)}
            min={-3}
            max={5}
            step={0.1}
            hint=""
            onChange={setX}
          />
          <PanelNote>
            Drag x slowly across the crossing point. The perceptron’s answer jumps from 0 to 1 with nothing in between,
            and the regression’s slides smoothly through it. The perceptron throws away everything except the sign; the
            regression keeps the whole number.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 6 — the identity activation, and its derivative                            */
/* ========================================================================== */

const ACTS = [
  {
    id: 'identity',
    name: 'identity',
    f: (z: number) => z,
    d: () => 1,
    dtext: 'f′(z) = 1, everywhere',
    ok: true,
    note: 'Constant gradient of 1, so the gradient reaches the weights unchanged. This is why regression uses it.',
  },
  {
    id: 'step',
    name: 'step',
    f: (z: number) => (z >= 0 ? 1 : 0),
    d: (z: number) => (Math.abs(z) < 1e-9 ? NaN : 0),
    dtext: 'f′(z) = 0 everywhere it exists',
    ok: false,
    note: 'Flat on both sides of the jump. A gradient of zero tells the weights nothing at all, so gradient descent cannot move.',
  },
  {
    id: 'relu',
    name: 'ReLU',
    f: (z: number) => Math.max(0, z),
    d: (z: number) => (z > 0 ? 1 : 0),
    dtext: 'f′(z) = 1 for z > 0, else 0',
    ok: true,
    note: 'Not in this deck. Half of it passes the gradient through unchanged, which is enough — and the bend is what stops layers collapsing.',
  },
]

export function IdentityLab() {
  const [pick, setPick] = useState('identity')
  const [z, setZ] = useState(1)
  const a = ACTS.find((x) => x.id === pick)!

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -4, xmax: 4, ymin: -2, ymax: 4, xlab: 'z', ylab: 'f(z) and f′(z)' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    let prev = a.f(-4)
    g.moveTo(f.px(-4), f.py(prev))
    for (let i = 1; i <= 400; i++) {
      const zv = -4 + (i / 400) * 8
      const yv = a.f(zv)
      if (Math.abs(yv - prev) > 0.5) g.moveTo(f.px(zv), f.py(yv))
      else g.lineTo(f.px(zv), f.py(yv))
      prev = yv
    }
    g.stroke()
    g.strokeStyle = TEAL
    g.lineWidth = 2
    g.setLineDash([5, 4])
    g.beginPath()
    let pd = a.d(-4)
    g.moveTo(f.px(-4), f.py(Number.isNaN(pd) ? 0 : pd))
    for (let i = 1; i <= 400; i++) {
      const zv = -4 + (i / 400) * 8
      const dv = a.d(zv)
      const v = Number.isNaN(dv) ? 0 : dv
      if (Math.abs(v - pd) > 0.5) g.moveTo(f.px(zv), f.py(v))
      else g.lineTo(f.px(zv), f.py(v))
      pd = v
    }
    g.stroke()
    g.setLineDash([])
    g.restore()
    grip(g, f.px(z), f.py(a.f(z)), accentColour(), 7)
    g.fillStyle = accentColour()
    g.textAlign = 'left'
    g.fillText('f(z)', f.L + 6, f.T + 10)
    g.fillStyle = TEAL
    g.fillText('f ′(z), dashed', f.L + 6, f.T + 24)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The solid line is the activation, the dashed one its derivative. The derivative is the part that decides whether
        the unit can be trained at all.
      </LabNote>

      <Presets items={ACTS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ z }}
          jumpKey={pick}
          height={320}
          caption="Press or drag anywhere on the plot to move z."
          handles={(f: Frame) => [{ id: 'z', px: f.px(z), py: f.py(a.f(z)), grab: 'anywhere' as const }]}
          onDragTo={(_id, v) => setZ(Math.round(clamp(v, -4, 4) * 20) / 20)}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="f(z)" value={a.f(z).toFixed(3)} note={`at z = ${z.toFixed(2)}`} />
          <ReadOut
            label="f ′(z)"
            value={Number.isNaN(a.d(z)) ? 'undefined' : a.d(z).toFixed(3)}
            note={a.dtext}
            tone={a.d(z) > 0 ? TEAL : RED}
          />
          <Slider label="z" value={z} display={z.toFixed(2)} min={-4} max={4} step={0.05} hint="" onChange={setZ} />
          <Verdict ok={a.ok}>
            {a.ok
              ? 'Non-zero gradient somewhere, so training can move the weights.'
              : 'Gradient zero everywhere it exists. Nothing gets back to the weights — this is why the perceptron needs its own rule and cannot use gradient descent.'}
          </Verdict>
          <PanelNote>{a.note}</PanelNote>
          <PanelNote>
            The deck lists five properties of the identity: continuous output, differentiable everywhere with f′ = 1,
            any real value allowed, gradient flows unchanged, and no information lost between input and output. The last
            two are the same fact seen forwards and backwards.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 7 — the loss, per example and in total                                     */
/* ========================================================================== */

export function LossLab() {
  const [w0, setW0] = useState(0)
  const [w1, setW1] = useState(0)
  const [ys, setYs] = useState<number[]>([...DECK_Y])

  const w = [w0, w1]
  const preds = predict(DECK_X, w)
  const errs = preds.map((p, i) => p - ys[i])
  const per = errs.map((e) => 0.5 * e * e)
  const J = per.reduce((s, v) => s + v, 0) / N

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 4, ymin: -1, ymax: 8, xlab: 'size x₁', ylab: 'price y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(w0))
    g.lineTo(f.px(4), f.py(w0 + w1 * 4))
    g.stroke()
    DECK_X.forEach((r, i) => {
      g.strokeStyle = 'rgba(220,38,38,0.5)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(r[1]), f.py(ys[i]))
      g.lineTo(f.px(r[1]), f.py(preds[i]))
      g.stroke()
      // The squared error, drawn as the square it is.
      const side = Math.abs(f.py(ys[i]) - f.py(preds[i]))
      g.fillStyle = 'rgba(220,38,38,0.10)'
      g.fillRect(f.px(r[1]), Math.min(f.py(ys[i]), f.py(preds[i])), side, side)
    })
    g.restore()
    DECK_X.forEach((r, i) => grip(g, f.px(r[1]), f.py(ys[i]), '#2563eb', 7))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Each red bar is one example’s error, and the faint square beside it is that error squared — literally the
        square. The loss is the average of the squares, halved.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ w0, w1, y0: ys[0], y1: ys[1], y2: ys[2] }}
            height={300}
            caption="Drag a blue point up or down to change that house's price, and watch its square grow."
            handles={(f: Frame) => DECK_X.map((r, i) => ({ id: `y${i}`, px: f.px(r[1]), py: f.py(ys[i]) }))}
            onDragTo={(id, _x, y) => {
              const i = Number(id.slice(1))
              setYs((p) => p.map((v, j) => (j === i ? Math.round(clamp(y, -1, 8) * 10) / 10 : v)))
            }}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
            {DECK_X.map((r, i) => (
              <div key={i}>
                ℓ⁽{i + 1}⁾ = ½(ŷ − y)² = ½({preds[i].toFixed(2)} − {ys[i]})² = {per[i].toFixed(3)}
              </div>
            ))}
            <div className="border-t border-zinc-950/[0.08] pt-1 font-semibold" style={{ color: 'var(--acc)' }}>
              J(w) = (1/{N}) × {per.map((p) => p.toFixed(2)).join(' + ')} = {J.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="J(w)"
            value={J.toFixed(4)}
            note="mean of the halved squares"
            tone={J < 0.1 ? TEAL : undefined}
          />
          <Slider
            label="w₀ (intercept)"
            value={w0}
            display={w0.toFixed(2)}
            min={-2}
            max={4}
            step={0.05}
            hint=""
            onChange={setW0}
          />
          <Slider
            label="w₁ (slope)"
            value={w1}
            display={w1.toFixed(2)}
            min={-1}
            max={3}
            step={0.05}
            hint=""
            onChange={setW1}
          />
          <div className="flex flex-wrap gap-2">
            <Btn
              primary
              onClick={() => {
                const b = normalEq(DECK_X, ys)
                setW0(Math.round(b[0] * 100) / 100)
                setW1(Math.round(b[1] * 100) / 100)
              }}
            >
              Best possible line
            </Btn>
            <Btn
              onClick={() => {
                setW0(0)
                setW1(0)
              }}
            >
              w = 0
            </Btn>
            <Btn onClick={() => setYs([...DECK_Y])}>Reset prices</Btn>
          </div>
          <ReadOutGrid
            items={[
              { label: 'largest single ℓ', value: Math.max(...per).toFixed(3) },
              { label: 'its share of J', value: `${((Math.max(...per) / (J * N)) * 100 || 0).toFixed(0)}%` },
              { label: 'ŷ at x = 2', value: preds[1].toFixed(2) },
              { label: 'error there', value: errs[1].toFixed(2) },
            ]}
          />
          <PanelNote>
            The ½ is there so that the derivative comes out clean: differentiating ½e² gives e, with no stray 2. It
            scales the loss and moves nothing — the weights that minimise J are the same either way.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 8 — why squared error                                                      */
/* ========================================================================== */

export function WhySquaredLab() {
  const [outlier, setOutlier] = useState(5)
  const ys = [2, 4, outlier]

  const wSq = normalEq(DECK_X, ys)
  // Absolute-error fit by a dense search — no closed form, which is itself a
  // point in favour of squared error.
  let wAbs = [0, 0]
  let best = Infinity
  for (let a = -2; a <= 6; a += 0.02) {
    for (let b = -1; b <= 5; b += 0.02) {
      const s = DECK_X.reduce((acc, r, i) => acc + Math.abs(a + b * r[1] - ys[i]), 0)
      if (s < best - 1e-12) {
        best = s
        wAbs = [a, b]
      }
    }
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 4, ymin: -1, ymax: 16, xlab: 'size x₁', ylab: 'price y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(wSq[0]))
    g.lineTo(f.px(4), f.py(wSq[0] + wSq[1] * 4))
    g.stroke()
    g.strokeStyle = AMBER
    g.setLineDash([6, 4])
    g.beginPath()
    g.moveTo(f.px(0), f.py(wAbs[0]))
    g.lineTo(f.px(4), f.py(wAbs[0] + wAbs[1] * 4))
    g.stroke()
    g.setLineDash([])
    g.restore()
    DECK_X.forEach((r, i) => dot(g, f.px(r[1]), f.py(ys[i]), 6, '#2563eb'))
    grip(g, f.px(3), f.py(outlier), '#2563eb', 8)
    g.fillStyle = accentColour()
    g.textAlign = 'left'
    g.fillText('squared error', f.L + 6, f.T + 10)
    g.fillStyle = AMBER
    g.fillText('absolute error, dashed', f.L + 6, f.T + 24)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Drag the third house’s price upwards and watch the two fits part company. Squared error chases the outlier;
        absolute error largely ignores it.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ outlier }}
          height={320}
          caption="Press or drag anywhere to move the last point."
          handles={(f: Frame) => [{ id: 'o', px: f.px(3), py: f.py(outlier), grab: 'anywhere' as const }]}
          onDragTo={(_id, _x, y) => setOutlier(Math.round(clamp(y, 0, 15) * 10) / 10)}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Squared-error slope" value={wSq[1].toFixed(3)} note={`intercept ${wSq[0].toFixed(3)}`} />
          <ReadOut
            label="Absolute-error slope"
            value={wAbs[1].toFixed(2)}
            note={`intercept ${wAbs[0].toFixed(2)}`}
            tone={AMBER}
          />
          <Slider
            label="Third house’s price"
            value={outlier}
            display={outlier.toFixed(1)}
            min={0}
            max={15}
            step={0.1}
            hint="The deck’s value is 5."
            onChange={setOutlier}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]/[1.7] text-zinc-700">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The deck’s four reasons
            </div>
            <div>
              <strong>Differentiable</strong> — smooth everywhere, so gradient descent works. Absolute error has a
              corner at zero.
            </div>
            <div>
              <strong>Convex</strong> — one global minimum for a linear model, so there is nowhere else to get stuck.
            </div>
            <div>
              <strong>Penalises large errors</strong> — quadratic growth. Which is the whole of what you are watching.
            </div>
            <div>
              <strong>Statistical interpretation</strong> — it is the maximum likelihood fit if the noise is Gaussian.
            </div>
          </div>
          <PanelNote>
            The third reason is a feature and a weakness at once. Doubling an error quadruples its contribution, so one
            bad label can drag the whole line — and the mean is what squared error predicts, exactly as in the
            statistics course.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 9 — the error surface                                                      */
/* ========================================================================== */

export function SurfaceLab() {
  const [w0, setW0] = useState(0)
  const [w1, setW1] = useState(0)

  const w = [w0, w1]
  const J = lossJ(DECK_X, DECK_Y, w)
  const opt = normalEq(DECK_X, DECK_Y)
  const Jmin = lossJ(DECK_X, DECK_Y, opt)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, {
      xmin: -2,
      xmax: 3.5,
      ymin: -0.5,
      ymax: 3.5,
      xlab: 'w₀ (intercept)',
      ylab: 'w₁ (slope)',
    })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    const step = 6
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const v = lossJ(DECK_X, DECK_Y, [f.ux(px), f.uy(py)])
        // Bands rather than a smooth ramp, so the contour shape is readable.
        const t = Math.min(1, Math.log10(1 + v) / 1.2)
        const band = Math.floor(t * 9) / 9
        g.fillStyle = `rgba(79,70,229,${0.06 + band * 0.5})`
        g.fillRect(px, py, step, step)
      }
    }
    g.restore()
    dot(g, f.px(opt[0]), f.py(opt[1]), 5, TEAL)
    g.fillStyle = TEAL
    g.textAlign = 'left'
    g.fillText('minimum', f.px(opt[0]) + 9, f.py(opt[1]))
    grip(g, f.px(w0), f.py(w1), '#fff', 8)
    return f
  }

  const drawFit = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 4, ymin: -1, ymax: 8, xlab: 'size x₁', ylab: 'price y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(w0))
    g.lineTo(f.px(4), f.py(w0 + w1 * 4))
    g.stroke()
    DECK_X.forEach((r, i) => {
      g.strokeStyle = 'rgba(220,38,38,0.5)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(r[1]), f.py(DECK_Y[i]))
      g.lineTo(f.px(r[1]), f.py(w0 + w1 * r[1]))
      g.stroke()
    })
    g.restore()
    DECK_X.forEach((r, i) => dot(g, f.px(r[1]), f.py(DECK_Y[i]), 6, '#2563eb'))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Every pair of weights is one point on the left plot, and the shade is the loss there. Move the marker and watch
        the line on the right follow — the two pictures are the same thing seen from two sides.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0, w1 }}
          height={300}
          caption="Darker is worse. Press anywhere to move the weights there, or Tab to the marker and use the arrow keys."
          handles={(f: Frame) => [
            {
              id: 'w',
              label: `The weights, w₀ = ${w0.toFixed(2)} and w₁ = ${w1.toFixed(2)}`,
              px: f.px(w0),
              py: f.py(w1),
              grab: 'anywhere' as const,
            },
          ]}
          onDragTo={(_id, x, y) => {
            setW0(Math.round(clamp(x, -2, 3.5) * 100) / 100)
            setW1(Math.round(clamp(y, -0.5, 3.5) * 100) / 100)
          }}
        />
        <ChartCanvas
          draw={drawFit}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0, w1 }}
          height={300}
          caption="The same weights, drawn as a line through the deck's three houses."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
          <div>
            w = ({w0.toFixed(2)}, {w1.toFixed(2)})
          </div>
          <div>J(w) = {J.toFixed(4)}</div>
          <div className="text-zinc-500">
            minimum at w = ({opt[0].toFixed(4)}, {opt[1].toFixed(4)}), J = {Jmin.toFixed(5)}
          </div>
          <div className="text-zinc-500">
            those are 2/3 and 3/2 exactly, from the normal equations — computed here, not looked up
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Distance from the minimum"
            value={Math.hypot(w0 - opt[0], w1 - opt[1]).toFixed(3)}
            note={`J is ${(J - Jmin).toFixed(4)} above its floor`}
            tone={J - Jmin < 0.01 ? TEAL : undefined}
          />
          <Verdict ok={true}>
            The surface is <strong>convex</strong>: it has exactly one bottom, and there is no valley to get trapped in.
            That is a property of a linear model with squared error, and it is why this session can promise gradient
            descent will work.
          </Verdict>
          <PanelNote>
            The bands are elongated, not circular. That stretch is what makes gradient descent zig-zag, and it is the
            reason feature scaling appears later in the deck — scaling the features makes the bowl rounder.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
