'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, drawNumberLine, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* The four core components                                                   */
/* ========================================================================== */

const PIECES = [
  {
    id: 'data',
    name: 'The data',
    slide: 'the data that we can learn from',
    have: 'A pile of examples, each already turned into numbers, and — if the problem is supervised — a label beside each one.',
    without:
      'Nothing to learn from. A model with no data is a program with its numbers still blank, and the objective function has nothing to be evaluated on. This is the component that most often ends a real project, because the data either does not exist or cannot legally be used.',
  },
  {
    id: 'model',
    name: 'The model',
    slide: 'a model of how to transform the data',
    have: 'The computational machinery: something that takes an input of one type and produces an output of possibly another type, with parameters left blank.',
    without:
      'Nothing to score and nothing to adjust. The data sits there, the loss has no predictions to compare against, and the optimiser has no parameters to move. "Deep" is a statement about this component only — many successive transformations chained together.',
  },
  {
    id: 'objective',
    name: 'The objective function',
    slide: 'quantifies how well (or badly) the model is doing',
    have: 'One number, lower being better by convention, computed from the model’s predictions and the data.',
    without:
      'No way to tell two settings of the parameters apart, so no way to prefer one. Worse, an objective that measures the wrong thing does not stop the machine — it makes it confidently optimise the wrong thing, which is the failure the ML course warned about when it talked about a badly chosen P.',
  },
  {
    id: 'algorithm',
    name: 'The optimisation algorithm',
    slide: 'adjust the model’s parameters to optimize the objective',
    have: 'A procedure that searches for parameter values making the objective as small as it can. In deep learning, almost always some form of gradient descent.',
    without:
      'A well-posed problem nobody can solve. You could in principle try every setting of the parameters, and for a network with millions of them you cannot. This is the component the whole of Module 4 is about.',
  },
]

export function ComponentsLab() {
  const [off, setOff] = useState<string | null>(null)
  const missing = PIECES.find((p) => p.id === off)

  return (
    <LabBox>
      <LabNote>
        Slide 30 lists four things every deep learning problem has. Press one to take it away, and read what stops
        working — that is a faster way to learn the list than reciting it.
      </LabNote>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIECES.map((p, i) => {
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

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          {missing ? (
            <>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: RED }}>
                Without {missing.name.toLowerCase()}
              </div>
              <p className="crux-prose text-[13.5px]/[1.75] text-zinc-800">{missing.without}</p>
            </>
          ) : (
            <>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                All four present
              </div>
              <div className="flex flex-col gap-2">
                {PIECES.map((p) => (
                  <div key={p.id} className="flex gap-3">
                    <span className="w-[170px] shrink-0 text-[13px] font-semibold text-zinc-900">{p.name}</span>
                    <span className="text-[12.5px]/[1.6] text-zinc-600">{p.have}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Components present"
            value={`${PIECES.length - (missing ? 1 : 0)} of 4`}
            tone={missing ? RED : TEAL}
            note={missing ? `${missing.name} is missing` : 'a well-posed learning problem'}
          />
          <Verdict ok={!missing}>
            {missing
              ? 'Not a learning problem any more — one of the four is gone.'
              : 'Data, model, objective, algorithm. This is a learning problem you could actually run.'}
          </Verdict>
          <PanelNote>
            The picture on slide 30 puts three of them in a row — data goes into a learning algorithm with the loss
            function inside it, and a model comes out. That drawing hides the fact that the model shape is chosen before
            any of it starts.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Data: from the world to a fixed-length vector                              */
/* ========================================================================== */

const THINGS = [
  {
    id: 'house',
    name: 'A house',
    fixed: true,
    features: ['area in m²', 'bedrooms', 'age in years', 'distance to station in km'],
    rows: [
      [86, 2, 31, 1.2],
      [142, 4, 9, 3.4],
      [64, 1, 55, 0.4],
    ],
    label: 'price',
    note: 'Every house has the same four columns, so every example is a vector of length 4. This is the "Std NN" row of the applications table.',
  },
  {
    id: 'image',
    name: 'A 4 × 4 grey image',
    fixed: true,
    features: ['pixel 1', 'pixel 2', '…', 'pixel 16'],
    rows: [
      [0, 12, 240, 255],
      [3, 9, 250, 251],
      [255, 240, 8, 2],
    ],
    label: 'digit',
    note: 'The deck gives an image as its example of fixed-length data. Sixteen pixels, always sixteen, so the vector length never changes — which is exactly what lets a whole batch be one matrix.',
  },
  {
    id: 'patient',
    name: 'A patient record',
    fixed: true,
    features: ['age', 'blood pressure', 'BMI', 'glucose'],
    rows: [
      [54, 138, 27.4, 96],
      [31, 118, 21.9, 84],
      [67, 152, 31.1, 141],
    ],
    label: 'diagnosis',
    note: 'Four measurements per person. The units are wildly different, which is a problem — but a problem about scaling, not about length.',
  },
  {
    id: 'text',
    name: 'A sentence',
    fixed: false,
    features: ['word 1', 'word 2', 'word 3', '…'],
    rows: [
      [17, 4, 902, 0],
      [17, 4, 902, 66],
      [88, 0, 0, 0],
    ],
    label: 'sentiment',
    note: 'Slide 32 singles this out: text data has varying-length data. Padding with zeros, as here, is one fix and it is not free — the network has to learn to ignore the padding.',
  },
]

export function DataMatrixLab() {
  const [pick, setPick] = useState('house')
  const [m, setM] = useState(3)
  const t = THINGS.find((x) => x.id === pick)!
  const n = t.features.length
  const rows = Array.from({ length: m }, (_, i) => t.rows[i % t.rows.length])

  return (
    <LabBox>
      <LabNote>
        A dataset is a set of m examples, each with n features. Change either and watch the shape of the matrix — the
        same m × n shape you met in Lecture 0a.
      </LabNote>

      <Presets items={THINGS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr>
                <th className="pr-3 pb-1.5 text-left text-[10.5px] font-semibold tracking-[0.05em] text-zinc-400 uppercase">
                  example
                </th>
                {t.features.map((f) => (
                  <th
                    key={f}
                    className="px-2 pb-1.5 text-right text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    {f}
                  </th>
                ))}
                <th
                  className="pb-1.5 pl-3 text-right text-[10.5px] font-semibold tracking-[0.05em] uppercase"
                  style={{ color: 'var(--acc)' }}
                >
                  {t.label}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-zinc-950/[0.06]">
                  <td className="py-1.5 pr-3 font-mono text-zinc-400">x⁽{i + 1}⁾</td>
                  {r.map((v, j) => (
                    <td key={j} className="px-2 py-1.5 text-right font-mono text-zinc-800 tabular-nums">
                      {v}
                    </td>
                  ))}
                  <td className="py-1.5 pl-3 text-right font-mono text-zinc-400">t⁽{i + 1}⁾</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12.5px]/[1.7] text-zinc-600">{t.note}</p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Shape of X" value={`${m} × ${n}`} note="m examples, n features" />
          <ReadOutGrid
            items={[
              { label: 'm (examples)', value: String(m) },
              { label: 'n (dimensionality)', value: String(n) },
              { label: 'numbers in X', value: String(m * n) },
              { label: 'labels t', value: String(m) },
            ]}
          />
          <Slider
            label="How many examples"
            value={m}
            display={String(m)}
            min={1}
            max={12}
            step={1}
            hint="m grows down the page. n does not move — that is the whole point."
            onChange={(v) => setM(Math.round(v))}
          />
          <Verdict ok={t.fixed}>
            {t.fixed
              ? 'Fixed-length vectors. The constant length is what slide 32 calls the dimensionality of the data.'
              : 'Not fixed-length. Two sentences of different lengths are not two points of the same ℝⁿ, so something has to be done before a plain network can accept them.'}
          </Verdict>
          <PanelNote>
            D = {'{'}X, t{'}'} on slide 31 is exactly this table: X is the block of features, t is the column of labels.
            In an unsupervised problem the t column is simply absent.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Model: a program with its numbers left blank                               */
/* ========================================================================== */

const FAMILIES = [
  {
    id: 'linear',
    name: 'ŷ = w₀ + w₁x',
    params: 2,
    note: 'A straight line. Two numbers decide everything it can ever do.',
    f: (w: number[], x: number) => w[0] + w[1] * x,
  },
  {
    id: 'threshold',
    name: 'ŷ = sign(w₀ + w₁x)',
    params: 2,
    note: 'The same line, then a decision. Same two parameters, a completely different set of programs — this is the perceptron in one input.',
    f: (w: number[], x: number) => (w[0] + w[1] * x > 0 ? 1 : -1),
  },
  {
    id: 'quad',
    name: 'ŷ = w₀ + w₁x + w₂x²',
    params: 3,
    note: 'One more parameter buys a bend. Every straight line is still in here — set w₂ to 0 — so this family contains the first one.',
    f: (w: number[], x: number) => w[0] + w[1] * x + w[2] * x * x,
  },
]

export function ModelFamilyLab() {
  const [fam, setFam] = useState('linear')
  const [w0, setW0] = useState(0.2)
  const [w1, setW1] = useState(0.8)
  const [w2, setW2] = useState(0)
  const F = FAMILIES.find((x) => x.id === fam)!
  const w = [w0, w1, w2]

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -2, xmax: 2, ymin: -2, ymax: 2, xlab: 'input x', ylab: 'output ŷ' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    let first = true
    for (let i = 0; i <= 200; i++) {
      const x = -2 + (i / 200) * 4
      const y = F.f(w, x)
      const px = f.px(x)
      const py = f.py(y)
      // sign() jumps; lifting the pen keeps the jump from being drawn as a line.
      if (first || (F.id === 'threshold' && i > 0 && F.f(w, -2 + ((i - 1) / 200) * 4) !== y)) {
        g.moveTo(px, py)
        first = false
      } else g.lineTo(px, py)
    }
    g.stroke()
    g.restore()
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 39 defines a <strong>model family</strong> as every program you can produce just by changing the
        parameters. Pick a family, move its parameters, and watch one family produce endlessly many programs.
      </LabNote>

      <Presets items={FAMILIES.map((x) => ({ id: x.id, label: x.name }))} at={fam} onPick={setFam} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0, w1, w2 }}
          jumpKey={fam}
          height={330}
          caption="The curve is the program. The sliders are the parameters that pick which program out of the family."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Parameters" value={String(F.params)} note={F.name} />
          <Slider
            label="w₀"
            value={w0}
            display={w0.toFixed(2)}
            min={-2}
            max={2}
            step={0.05}
            hint="The flat part — where the program sits when x is 0."
            onChange={setW0}
          />
          <Slider
            label="w₁"
            value={w1}
            display={w1.toFixed(2)}
            min={-2}
            max={2}
            step={0.05}
            hint="How hard the output follows the input."
            onChange={setW1}
          />
          {F.params === 3 && (
            <Slider
              label="w₂"
              value={w2}
              display={w2.toFixed(2)}
              min={-2}
              max={2}
              step={0.05}
              hint="The bend. Set it to 0 and you are back in the straight-line family."
              onChange={setW2}
            />
          )}
          <ReadOutGrid
            items={[
              { label: 'ŷ at x = −1', value: F.f(w, -1).toFixed(2) },
              { label: 'ŷ at x = 0', value: F.f(w, 0).toFixed(2) },
              { label: 'ŷ at x = 1', value: F.f(w, 1).toFixed(2) },
              { label: 'ŷ at x = 2', value: F.f(w, 2).toFixed(2) },
            ]}
          />
          <PanelNote>{F.note}</PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Objective: squared error against error rate                                */
/* ========================================================================== */

const TRUE_LABELS = [1, 1, 1, 0, 0]
const MODEL_A = [0.9, 0.9, 0.4, 0.1, 0.1]
const MODEL_B = [0.6, 0.6, 0.6, 0.45, 0.45]

function squaredError(scores: number[]) {
  return scores.reduce((s, p, i) => s + (p - TRUE_LABELS[i]) ** 2, 0)
}
function errorRate(scores: number[], thr: number) {
  return scores.reduce((s, p, i) => s + ((p >= thr ? 1 : 0) === TRUE_LABELS[i] ? 0 : 1), 0) / scores.length
}

export function LossCompareLab() {
  const [scores, setScores] = useState<number[]>(MODEL_A)
  const [thr, setThr] = useState(0.5)

  const se = squaredError(scores)
  const er = errorRate(scores, thr)

  const aSe = squaredError(MODEL_A)
  const bSe = squaredError(MODEL_B)
  const aEr = errorRate(MODEL_A, thr)
  const bEr = errorRate(MODEL_B, thr)
  const sePrefers = aSe < bSe ? 'A' : bSe < aSe ? 'B' : 'neither'
  const erPrefers = aEr < bEr ? 'A' : bEr < aEr ? 'B' : 'neither'
  const disagree = sePrefers !== erPrefers && sePrefers !== 'neither' && erPrefers !== 'neither'

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawNumberLine(g, W, H, { xmin: 0, xmax: 1, xlab: 'the score the model gives this example', stacks: 6 })
    g.strokeStyle = 'rgba(9,9,11,0.55)'
    g.setLineDash([4, 4])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(thr), f.T)
    g.lineTo(f.px(thr), f.B)
    g.stroke()
    g.setLineDash([])
    g.fillStyle = '#71717a'
    g.textAlign = 'center'
    g.fillText('threshold', f.px(thr), f.T + 6)

    scores.forEach((s, i) => {
      const truth = TRUE_LABELS[i]
      const said = s >= thr ? 1 : 0
      const y = f.py(1 + i * 0.85)
      // The bar from the score to the truth is the thing squared error measures.
      g.strokeStyle = 'rgba(9,9,11,0.2)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(s), y)
      g.lineTo(f.px(truth), y)
      g.stroke()
      dot(g, f.px(truth), y, 4, truth === 1 ? 'rgba(13,148,136,0.35)' : 'rgba(220,38,38,0.3)')
      grip(g, f.px(s), y, said === truth ? TEAL : RED)
      g.fillStyle = '#a1a1aa'
      g.textAlign = 'left'
      g.fillText(`true ${truth}`, f.R - 44, y)
    })
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Five examples, each with a true label of 0 or 1, and a model that gives each one a score. Drag any score. The
        grey bar is the distance squared error measures; the threshold is what error rate measures against.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ thr, ...Object.fromEntries(scores.map((s, i) => [`s${i}`, s])) }}
          height={280}
          caption="Drag a ringed marker to change that model's score. Drag the dashed line to move the threshold."
          handles={(f: Frame) => [
            ...scores.map((s, i) => ({ id: `s${i}`, px: f.px(s), py: f.py(1 + i * 0.85) })),
            { id: 'thr', px: f.px(thr), py: f.T + 20 },
          ]}
          onDragTo={(id, x) => {
            if (id === 'thr') setThr(clamp(x, 0.02, 0.98))
            else {
              const i = Number(id.slice(1))
              setScores((s) => s.map((v, j) => (j === i ? clamp(x, 0, 1) : v)))
            }
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Squared error" value={se.toFixed(3)} note="sum of (score − truth)², lower is better" />
          <ReadOut
            label="Error rate"
            value={`${(er * 100).toFixed(0)}%`}
            note={`${Math.round(er * scores.length)} of ${scores.length} on the wrong side`}
            tone={er === 0 ? TEAL : RED}
          />
          <Slider
            label="Threshold"
            value={thr}
            display={thr.toFixed(2)}
            min={0.02}
            max={0.98}
            step={0.01}
            hint="Error rate depends on this. Squared error does not."
            onChange={setThr}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setScores(MODEL_A)}>Model A</Btn>
            <Btn onClick={() => setScores(MODEL_B)}>Model B</Btn>
          </div>
          <ReadOutGrid
            items={[
              { label: 'A squared error', value: aSe.toFixed(3) },
              { label: 'B squared error', value: bSe.toFixed(3) },
              { label: 'A error rate', value: `${(aEr * 100).toFixed(0)}%` },
              { label: 'B error rate', value: `${(bEr * 100).toFixed(0)}%` },
            ]}
          />
          <Verdict ok={!disagree}>
            {disagree
              ? `They disagree: squared error prefers model ${sePrefers}, error rate prefers model ${erPrefers}.`
              : 'At this threshold both measures pick the same model.'}
          </Verdict>
          <PanelNote>
            Leave the threshold at 0.5 and press the two buttons in turn. That is the exam point in one gesture: the two
            objectives on slide 35 are different objectives, and “which model is better” is not a question you can
            answer until you say which one you meant.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Generalisation and overfitting                                             */
/* ========================================================================== */

/** Twelve training points and eight held-back ones, from a fixed recipe. */
function makePoints(n: number, seed: number) {
  const pts: Array<{ x: number; y: number }> = []
  let s = seed
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
  for (let i = 0; i < n; i++) {
    const x = -1 + (2 * i) / (n - 1)
    pts.push({ x, y: Math.sin(2.2 * x) * 0.7 + (rnd() - 0.5) * 0.5 })
  }
  return pts
}
const TRAIN = makePoints(12, 7)
const TEST = makePoints(8, 991)

/** Least squares by Gaussian elimination on the normal equations. */
function fitPoly(pts: Array<{ x: number; y: number }>, deg: number) {
  const k = deg + 1
  const A: number[][] = Array.from({ length: k }, () => new Array(k + 1).fill(0))
  for (const p of pts) {
    const pow: number[] = [1]
    for (let d = 1; d < k; d++) pow.push(pow[d - 1] * p.x)
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) A[i][j] += pow[i] * pow[j]
      A[i][k] += pow[i] * p.y
    }
  }
  for (let c = 0; c < k; c++) {
    let piv = c
    for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r
    if (Math.abs(A[piv][c]) < 1e-12) continue
    ;[A[c], A[piv]] = [A[piv], A[c]]
    for (let r = 0; r < k; r++) {
      if (r === c) continue
      const f = A[r][c] / A[c][c]
      for (let j = c; j <= k; j++) A[r][j] -= f * A[c][j]
    }
  }
  return Array.from({ length: k }, (_, i) => (Math.abs(A[i][i]) < 1e-12 ? 0 : A[i][k] / A[i][i]))
}
const evalPoly = (co: number[], x: number) => co.reduce((s, c, i) => s + c * x ** i, 0)
const mse = (co: number[], pts: Array<{ x: number; y: number }>) =>
  pts.reduce((s, p) => s + (evalPoly(co, p.x) - p.y) ** 2, 0) / pts.length

export function OverfitLab() {
  const [deg, setDeg] = useState(3)
  const co = fitPoly(TRAIN, deg)
  const trainMse = mse(co, TRAIN)
  const testMse = mse(co, TEST)

  // Which degree actually generalises best — recomputed, never stored.
  const sweep = Array.from({ length: 10 }, (_, d) => ({ d, test: mse(fitPoly(TRAIN, d), TEST) }))
  const bestDeg = sweep.reduce((a, b) => (b.test < a.test ? b : a)).d

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -1.1, xmax: 1.1, ymin: -1.4, ymax: 1.4, xlab: 'x', ylab: 'y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = -1.1 + (i / 300) * 2.2
      const y = evalPoly(co, x)
      if (i === 0) g.moveTo(f.px(x), f.py(y))
      else g.lineTo(f.px(x), f.py(y))
    }
    g.stroke()
    g.restore()
    for (const p of TRAIN) dot(g, f.px(p.x), f.py(p.y), 5, '#18181b')
    for (const p of TEST) dot(g, f.px(p.x), f.py(p.y), 5, '#fff', RED)
    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('● training', f.L + 6, f.T + 10)
    g.fillStyle = RED
    g.fillText('○ held back', f.L + 70, f.T + 10)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Twelve black points the curve is allowed to see, and eight red ones it is not. Turn up the degree and watch the
        curve chase the black points through the red ones.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ deg }}
          jumpKey={deg}
          height={340}
          caption="Both sets of points come from the same recipe with different noise — they are made up, not measured."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Loss on the training data" value={trainMse.toFixed(4)} note="what the fit minimises" />
          <ReadOut
            label="Loss on data it never saw"
            value={testMse.toFixed(4)}
            note="what you actually care about"
            tone={testMse > trainMse * 3 ? RED : TEAL}
          />
          <Slider
            label="Degree of the polynomial"
            value={deg}
            display={String(deg)}
            min={0}
            max={9}
            step={1}
            hint="More degree, more flexibility, more parameters to overfit with."
            onChange={(v) => setDeg(Math.round(v))}
          />
          <Verdict ok={testMse <= trainMse * 3}>
            {testMse > trainMse * 3
              ? 'Overfitting: the training loss keeps falling while the unseen loss climbs. Slide 36’s exact definition.'
              : 'Training loss and unseen loss are still moving together.'}
          </Verdict>
          <PanelNote>
            Sweeping every degree from 0 to 9 and scoring each on the held-back points, the best is degree{' '}
            <strong>{bestDeg}</strong>. Push past it and the training number carries on improving — which is why the
            deck says doing well on the training data does not guarantee doing well on unseen data.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* The optimisation algorithm                                                 */
/* ========================================================================== */

const lossAt = (w: number) => (w - 2) ** 2 + 1
const slopeAt = (w: number) => 2 * (w - 2)

export function DescentLab() {
  const [eta, setEta] = useState(0.3)
  const [path, setPath] = useState<number[]>([-2.5])

  const w = path[path.length - 1]
  const diverging = path.length > 2 && Math.abs(path[path.length - 1] - 2) > Math.abs(path[0] - 2)

  const step = () => setPath((p) => [...p, p[p.length - 1] - eta * slopeAt(p[p.length - 1])])
  const run = () =>
    setPath((p) => {
      const out = [...p]
      for (let i = 0; i < 12; i++) out.push(out[out.length - 1] - eta * slopeAt(out[out.length - 1]))
      return out
    })

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -4, xmax: 8, ymin: 0, ymax: 20, xlab: 'parameter w', ylab: 'loss L(w)' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const x = -4 + (i / 200) * 12
      if (i === 0) g.moveTo(f.px(x), f.py(lossAt(x)))
      else g.lineTo(f.px(x), f.py(lossAt(x)))
    }
    g.stroke()

    g.strokeStyle = accentColour()
    g.lineWidth = 1.5
    g.beginPath()
    path.forEach((p, i) => {
      const px = f.px(p)
      const py = f.py(lossAt(p))
      if (i === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    })
    g.stroke()
    for (const p of path) dot(g, f.px(p), f.py(lossAt(p)), 3.5, accentColour())
    g.restore()

    grip(g, f.px(w), f.py(lossAt(w)), accentColour(), 7)
    dot(g, f.px(2), f.py(1), 4, TEAL)
    g.fillStyle = TEAL
    g.textAlign = 'center'
    g.fillText('minimum', f.px(2), f.py(1) + 16)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        One parameter, one bowl-shaped loss. Press <strong>Step</strong> and the parameter moves downhill by η times the
        slope. This is the family slide 37 says every deep learning optimiser belongs to.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w }}
          jumpKey={path.length}
          height={330}
          caption="Press or drag anywhere on the plot to move the parameter by hand, then step from there."
          handles={(f: Frame) => [{ id: 'w', px: f.px(w), py: f.py(lossAt(w)), grab: 'anywhere' as const }]}
          onDragTo={(_id, x) => setPath([clamp(x, -4, 8)])}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Loss now"
            value={lossAt(w).toFixed(3)}
            note={`w = ${w.toFixed(3)}`}
            tone={diverging ? RED : TEAL}
          />
          <ReadOutGrid
            items={[
              { label: 'slope', value: slopeAt(w).toFixed(3) },
              { label: 'next step', value: (-eta * slopeAt(w)).toFixed(3) },
              { label: 'steps taken', value: String(path.length - 1) },
              { label: 'distance to min', value: Math.abs(w - 2).toFixed(3) },
            ]}
          />
          <Slider
            label="Learning rate η"
            value={eta}
            display={eta.toFixed(2)}
            min={0.05}
            max={1.3}
            step={0.05}
            hint="Above 1 the steps overshoot further than they started. Try 1.1."
            onChange={setEta}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={step} primary>
              Step
            </Btn>
            <Btn onClick={run}>Run 12</Btn>
            <Btn onClick={() => setPath([-2.5])}>Reset</Btn>
          </div>
          <Verdict ok={!diverging}>
            {diverging
              ? 'Diverging — each step lands further from the minimum than the last. η is too big.'
              : 'Converging, or at least not getting worse.'}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* The brain arithmetic                                                       */
/* ========================================================================== */

export function BrainStepsLab() {
  const [switchMs, setSwitchMs] = useState(1)
  const [sceneS, setSceneS] = useState(1)
  const [connExp, setConnExp] = useState(4)

  const steps = (sceneS * 1000) / switchMs
  const neurons = 1e10
  const connections = neurons * 10 ** connExp

  return (
    <LabBox>
      <LabNote>
        Slide 45’s numbers, made into the division it is really making. If a neuron takes about a millisecond to switch
        and a scene is recognised in about a second, how many switches deep can the chain be?
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="font-mono text-[13px]/[2] text-zinc-800">
            <div>time to recognise a scene ÷ time for one neuron to switch</div>
            <div>
              = {sceneS} s ÷ {switchMs} ms
            </div>
            <div>
              = {(sceneS * 1000).toFixed(0)} ms ÷ {switchMs} ms
            </div>
            <div className="font-semibold" style={{ color: 'var(--acc)' }}>
              = {steps.toLocaleString(undefined, { maximumFractionDigits: 0 })} steps, one after another
            </div>
          </div>

          <div className="mt-4 border-t border-zinc-950/[0.08] pt-3 font-mono text-[13px]/[2] text-zinc-800">
            <div>neurons ≈ 10¹⁰</div>
            <div>connections per neuron ≈ 10{connExp === 4 ? '⁴' : '⁵'}</div>
            <div className="font-semibold" style={{ color: 'var(--acc)' }}>
              total connections ≈ 10{connExp === 4 ? '¹⁴' : '¹⁵'} = {connections.toExponential(0)}
            </div>
          </div>

          <p className="crux-prose mt-4 text-[13px]/[1.75] text-zinc-700">
            Whichever number you land on, the argument is the same: a few hundred or a few thousand steps in sequence is
            nothing like enough for what the brain does in that second. So it cannot be working through a long chain —
            it must be doing an enormous amount at once. That is the observation the whole architecture is copied from.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Steps available"
            value={steps.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            note="switches in sequence, not in parallel"
          />
          <Slider
            label="Neuron switching time"
            value={switchMs}
            display={`${switchMs} ms`}
            min={0.5}
            max={5}
            step={0.5}
            hint="Slide 45 says about 0.001 second, which is 1 ms."
            onChange={setSwitchMs}
          />
          <Slider
            label="Scene recognition time"
            value={sceneS}
            display={`${sceneS} s`}
            min={0.1}
            max={2}
            step={0.1}
            hint="Slide 45 prints 1 second. Set it to 0.1 to see where the slide's own '100 steps' comes from."
            onChange={(v) => setSceneS(Math.round(v * 10) / 10)}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={connExp === 4} label="10⁴ connections" onClick={() => setConnExp(4)} />
            <Chip on={connExp === 5} label="10⁵ connections" onClick={() => setConnExp(5)} />
          </div>
          <Verdict ok={Math.abs(steps - 100) < 1}>
            {Math.abs(steps - 100) < 1
              ? 'This is the setting that gives the slide’s figure of 100 inference steps: 0.1 s ÷ 1 ms.'
              : `At these settings the division gives ${steps.toLocaleString(undefined, { maximumFractionDigits: 0 })}, not the 100 the slide states.`}
          </Verdict>
          <PanelNote>
            The slide is inconsistent with itself: 1 second divided by 1 millisecond is 1000, and the same slide says
            100. Mitchell’s Chapter 4 — the reference the deck gives on its last slide — uses 0.1 second for scene
            recognition, which is where 100 comes from. Both are shown here and neither is presented as the answer.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
