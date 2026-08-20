'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, NumBox, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'
import { bce, DECK_ETA, gradBatch, gradOne, HOURS_X, HOURS_Y, logit, sigmoid, totalLoss } from './dl4-lab'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'
const INDIGO = '#4f46e5'
const GREY = '#71717a'

const f2 = (v: number) => v.toFixed(2)
const f3 = (v: number) => v.toFixed(3)
const f4 = (v: number) => v.toFixed(4)
const sgn = (v: number) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12px]/[1.8] text-zinc-700">
      {children}
    </div>
  )
}

/** One row of a small table, hoisted so typing into a sibling never remounts it. */
function TRow({ cells, tone, head }: { cells: React.ReactNode[]; tone?: string; head?: boolean }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-b border-zinc-950/[0.06] last:border-0">
      {cells.map((c, i) => (
        <span
          key={i}
          className={
            head
              ? 'px-2 py-1.5 text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase'
              : 'px-2 py-1.5 font-mono text-[12.5px] tabular-nums'
          }
          style={head ? undefined : { color: tone ?? '#3f3f46' }}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

/** A signed bar, so the sign of a gradient entry is visible and not just read. */
function SignedBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.min(50, (Math.abs(value) / max) * 50) : 0
  const neg = value < 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 font-mono text-[11.5px] text-zinc-600">{label}</span>
      <span className="relative h-4 flex-1 overflow-hidden rounded bg-zinc-100">
        <span className="absolute inset-y-0 left-1/2 w-px bg-zinc-400" />
        <span
          className="absolute inset-y-0 rounded"
          style={{
            width: `${pct}%`,
            [neg ? 'right' : 'left']: '50%',
            background: neg ? RED : TEAL,
          }}
        />
      </span>
      <span className="w-16 shrink-0 text-right font-mono text-[11.5px] text-zinc-800 tabular-nums">
        {value.toFixed(3)}
      </span>
    </div>
  )
}

/* ========================================================================== */
/* 9 — batch against stochastic (slides 24–25, 28)                            */
/* ========================================================================== */

/**
 * A deterministic shuffle. `Math.random` would make the chart disagree with
 * itself between two renders of the same state, so the seed is the state and
 * the shuffle is a plain linear congruential generator.
 */
function shuffled(n: number, seed: number) {
  const idx = Array.from({ length: n }, (_, i) => i)
  let s = (seed * 2654435761) % 2147483647
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648
    const j = s % (i + 1)
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

function batchPath(epochs: number, eta: number) {
  let w = [0, 0]
  const path: number[][] = [w]
  for (let e = 0; e < epochs; e++) {
    const g = gradBatch(HOURS_X, HOURS_Y, w)
    w = [w[0] - eta * g[0], w[1] - eta * g[1]]
    path.push(w)
  }
  return path
}

function sgdPath(epochs: number, eta: number, seed: number) {
  let w = [0, 0]
  const path: number[][] = [w]
  for (let e = 0; e < epochs; e++) {
    for (const i of shuffled(HOURS_X.length, seed + e)) {
      const g = gradOne(HOURS_X[i], HOURS_Y[i], w)
      w = [w[0] - eta * g[0], w[1] - eta * g[1]]
      path.push(w)
    }
  }
  return path
}

export function SgdVsBatchLab() {
  const [epochs, setEpochs] = useState(12)
  const [seed, setSeed] = useState(1)
  const bp = batchPath(epochs, DECK_ETA)
  const sp = sgdPath(epochs, DECK_ETA, seed)
  const bEnd = bp[bp.length - 1]
  const sEnd = sp[sp.length - 1]

  function draw(g: CanvasRenderingContext2D, W: number, H: number) {
    const f = drawAxes(g, W, H, { xmin: -6, xmax: 1, ymin: -0.6, ymax: 3, xlab: 'w₀', ylab: 'w₁' })

    // The loss surface, so both paths can be seen going downhill.
    const step = 8
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const J = totalLoss(HOURS_X, HOURS_Y, [f.ux(px), f.uy(py)])
        const t = clamp(J / 1.2, 0, 1)
        g.fillStyle = `rgba(79,70,229,${0.03 + t * 0.22})`
        g.fillRect(px, py, step, step)
      }
    }

    const line = (path: number[][], colour: string, width: number) => {
      g.strokeStyle = colour
      g.lineWidth = width
      g.beginPath()
      path.forEach((w, i) => (i === 0 ? g.moveTo(f.px(w[0]), f.py(w[1])) : g.lineTo(f.px(w[0]), f.py(w[1]))))
      g.stroke()
      path.forEach((w) => dot(g, f.px(w[0]), f.py(w[1]), 2.5, colour))
    }
    line(sp, AMBER, 1.6)
    line(bp, INDIGO, 2.4)

    dot(g, f.px(0), f.py(0), 6, '#09090b')
    g.fillStyle = '#09090b'
    g.textAlign = 'left'
    g.fillText('w⁽⁰⁾ = 0', f.px(0) + 8, f.py(0))
    g.fillStyle = INDIGO
    g.fillText('batch GD', f.L + 10, f.T + 12)
    g.fillStyle = AMBER
    g.fillText('SGD', f.L + 10, f.T + 28)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Both runs start at w = 0, use the deck’s η = 0.5, and see the same four students — the only difference is how
        much data goes into one step. Batch GD takes one step per epoch; SGD takes four. Slide the epoch count and watch
        the two paths separate.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          targets={{ epochs, seed }}
          candidates={() => []}
          tooltip={() => null}
          jumpKey={`${epochs}-${seed}`}
          caption="The shading is the loss J(w): darker is worse. Both paths run downhill from the same start."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <Slider
            label="Epochs"
            value={epochs}
            display={String(epochs)}
            min={1}
            max={30}
            step={1}
            hint="One epoch is one full pass over the four examples."
            onChange={(v) => setEpochs(Math.round(v))}
          />
          <ReadOutGrid
            items={[
              { label: 'batch updates', value: String(epochs) },
              { label: 'SGD updates', value: String(epochs * 4) },
              { label: 'J after batch', value: f4(totalLoss(HOURS_X, HOURS_Y, bEnd)) },
              { label: 'J after SGD', value: f4(totalLoss(HOURS_X, HOURS_Y, sEnd)) },
            ]}
          />
          <PanelNote>
            SGD is ahead here, and the reason is arithmetic rather than magic: with N = 4 it has taken four times as
            many steps for the same number of passes over the data. Each of its steps used a quarter of the information,
            which is exactly why its path wanders.
          </PanelNote>
          <PanelNote>
            The wandering is the trade. The deck lists it as a benefit — noise can carry you out of a poor minimum — and
            as a challenge, because the path oscillates near the bottom instead of settling.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setSeed((s) => s + 1)}>Reshuffle the order</Btn>
            <Btn onClick={() => setEpochs(1)}>One epoch</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 10 — the gradient is (ŷ − y)x (slide 26)                                   */
/* ========================================================================== */

export function GradLab() {
  const [z, setZ] = useState(0.8)
  const [y, setY] = useState(1)
  const [x1, setX1] = useState(3)
  const yhat = sigmoid(z)
  const err = yhat - y
  const x = [1, x1]
  const g = x.map((xj) => err * xj)
  const big = Math.max(1e-6, ...g.map(Math.abs))

  return (
    <LabBox>
      <LabNote>
        Slide 26 in one line: ∇ℓ = (ŷ − y)x. Two numbers decide everything — the error, which sets the size and the
        sign, and the input, which decides how that error is shared out between the weights.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Slider
              label="logit z = wᵀx"
              value={z}
              display={f2(z)}
              min={-5}
              max={5}
              step={0.1}
              hint="What the current weights say before the squash."
              onChange={setZ}
            />
            <Slider
              label="feature x₁"
              value={x1}
              display={f2(x1)}
              min={-4}
              max={6}
              step={0.5}
              hint="The bias input x₀ is fixed at 1."
              onChange={setX1}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip on={y === 1} label="true label y = 1" onClick={() => setY(1)} />
            <Chip on={y === 0} label="true label y = 0" onClick={() => setY(0)} />
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Each entry of the gradient
            </div>
            <SignedBar label="∂ℓ/∂w₀" value={g[0]} max={big} />
            <SignedBar label="∂ℓ/∂w₁" value={g[1]} max={big} />
            <div className="mt-1 font-mono text-[12px]/[1.7] text-zinc-600">
              (ŷ − y) = {sgn(err)} · x = [1, {f2(x1)}]
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Error ŷ − y"
            value={sgn(err)}
            note={`ŷ = ${f4(yhat)}, y = ${y}`}
            tone={Math.abs(err) > 0.5 ? RED : TEAL}
          />
          <ReadOutGrid
            items={[
              { label: '∂ℓ/∂w₀', value: sgn(g[0]) },
              { label: '∂ℓ/∂w₁', value: sgn(g[1]) },
              { label: 'loss ℓ', value: f3(bce(yhat, y)) },
              { label: '|∇ℓ|', value: f3(Math.hypot(g[0], g[1])) },
            ]}
          />
          <PanelNote>
            Set x₁ to 0 and the second entry becomes exactly 0, however wrong the prediction is. A feature that is not
            present cannot be blamed for the mistake — which is also why the bias, whose input is always 1, is updated
            on every single example.
          </PanelNote>
          <PanelNote>
            Notice there is no σ′ anywhere. Cross-entropy and the sigmoid were chosen together, and the σ(1 − σ) that
            the chain rule produces cancels against the 1/ŷ from the log. That cancellation is the deck’s “well-behaved
            gradients”, and it is why this looks identical to the regression gradient of session 3.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 11 — the algorithm, line by line (slides 27–29)                            */
/* ========================================================================== */

const ALGO_LINES = [
  'Initialise w⁽⁰⁾ = 0 (or small random values)',
  'for epoch = 1 to T do',
  '    Shuffle the dataset D',
  '    for each example (x⁽ⁱ⁾, y⁽ⁱ⁾) in D do',
  '        Compute prediction:  ŷ⁽ⁱ⁾ = σ(wᵀx⁽ⁱ⁾)',
  '        Compute gradient:    ∇ℓ = (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)x⁽ⁱ⁾',
  '        Update weights:      w ← w − η∇ℓ',
  '        Optional: compute J(w) for monitoring',
  'return w',
]

export function SgdAlgoLab() {
  // One press = one example, so the reader walks the inner loop themselves.
  const [step, setStep] = useState(0)
  const eta = DECK_ETA
  const order = [0, 2, 1, 3]

  let w = [0, 0]
  const done: Array<{ i: number; yhat: number; grad: number[]; w: number[] }> = []
  for (let s = 0; s < step; s++) {
    const i = order[s % 4]
    const yhat = sigmoid(logit(w, HOURS_X[i]))
    const grad = gradOne(HOURS_X[i], HOURS_Y[i], w)
    w = [w[0] - eta * grad[0], w[1] - eta * grad[1]]
    done.push({ i, yhat, grad, w })
  }
  const last = done[done.length - 1]
  const nextI = order[step % 4]
  const line = step === 0 ? 0 : step >= 8 ? 8 : 4 + ((step - 1) % 3)

  return (
    <LabBox>
      <LabNote>
        The pseudocode of slide 27, run on the deck’s four students with η = 0.5. Each press does one example — the
        inner loop’s three lines — so eight presses is two full epochs. The highlighted line is the one that just ran.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-3">
            {ALGO_LINES.map((l, i) => (
              <div
                key={i}
                className="rounded px-2 py-1 font-mono text-[12px]/[1.75] whitespace-pre"
                style={
                  i === line
                    ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                    : { color: '#52525b' }
                }
              >
                {String(i + 1).padStart(2, ' ')} {l}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <TRow head cells={['step', 'example', 'ŷ', '∇ℓ', 'w after']} />
            {done.length === 0 ? (
              <TRow cells={['—', 'nothing run yet', '—', '—', 'w = (0, 0)']} tone={GREY} />
            ) : (
              done.map((r, s) => (
                <TRow
                  key={s}
                  cells={[
                    String(s + 1),
                    `x⁽${r.i + 1}⁾, y = ${HOURS_Y[r.i]}`,
                    f3(r.yhat),
                    `(${sgn(r.grad[0])}, ${sgn(r.grad[1])})`,
                    `(${f3(r.w[0])}, ${f3(r.w[1])})`,
                  ]}
                />
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="J(w) now"
            value={f4(totalLoss(HOURS_X, HOURS_Y, w))}
            note={`after ${step} updates`}
            tone={INDIGO}
          />
          <ReadOutGrid
            items={[
              { label: 'epoch', value: String(Math.floor(step / 4) + (step % 4 === 0 && step > 0 ? 0 : 1)) },
              { label: 'w₀', value: f3(w[0]) },
              { label: 'w₁', value: f3(w[1]) },
              { label: 'next example', value: `x⁽${nextI + 1}⁾` },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setStep((s) => Math.min(8, s + 1))}>
              Run one example
            </Btn>
            <Btn onClick={() => setStep(0)}>Reset</Btn>
          </div>
          {step >= 8 && (
            <Verdict ok>
              Two full epochs done. J has fallen from 0.693 — the value w = 0 always gives — to{' '}
              {f4(totalLoss(HOURS_X, HOURS_Y, w))}.
            </Verdict>
          )}
          <PanelNote>
            Line 3 is the one that looks like housekeeping and is not. Without the shuffle, SGD sees the examples in the
            same order every epoch, so the same correlations between neighbouring examples are applied again and again
            and the path can cycle instead of settling.
          </PanelNote>
          {last && (
            <Mono>
              <div>
                last: x⁽{last.i + 1}⁾ = [1, {HOURS_X[last.i][1]}]
              </div>
              <div>
                ŷ = {f4(last.yhat)}, y = {HOURS_Y[last.i]}
              </div>
              <div>
                ∇ℓ = ({f3(last.grad[0])}, {f3(last.grad[1])})
              </div>
            </Mono>
          )}
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 12 — the worked example (slides 31–35)                                     */
/* ========================================================================== */

/** The deck picks example 1 first and example 3 second, slides 33 and 34. */
const PICKS = [0, 2]

const STAGE_TITLES = [
  'Set up: w⁽⁰⁾ = 0, so every ŷ is σ(0) = 0.5',
  'Step 1 — forward pass: z = x⁽ⁱ⁾·w, then ŷ = σ(z)',
  'Step 2 — the error: ŷ − y',
  'Step 3 — the gradient: ∇ℓ = (ŷ − y)x⁽ⁱ⁾',
  'Step 4 — the update: w ← w − η∇ℓ',
]

export function WorkedBinaryLab() {
  // 0 = setup; 1–4 = iteration 1; 5–8 = iteration 2.
  const [at, setAt] = useState(0)
  const eta = DECK_ETA

  // Recomputed from scratch every render — nothing about the run is stored.
  const w0 = [0, 0]
  const i1 = PICKS[0]
  const z1 = logit(w0, HOURS_X[i1])
  const yh1 = sigmoid(z1)
  const e1 = yh1 - HOURS_Y[i1]
  const g1 = [e1 * HOURS_X[i1][0], e1 * HOURS_X[i1][1]]
  const w1 = [w0[0] - eta * g1[0], w0[1] - eta * g1[1]]

  const i2 = PICKS[1]
  const z2 = logit(w1, HOURS_X[i2])
  const yh2 = sigmoid(z2)
  const e2 = yh2 - HOURS_Y[i2]
  const g2 = [e2 * HOURS_X[i2][0], e2 * HOURS_X[i2][1]]
  const w2 = [w1[0] - eta * g2[0], w1[1] - eta * g2[1]]

  const iter = at === 0 ? 0 : at <= 4 ? 1 : 2
  const stage = at === 0 ? 0 : ((at - 1) % 4) + 1
  const w = at === 0 ? w0 : at <= 4 ? (at === 4 ? w1 : w0) : at === 8 ? w2 : w1
  const cur =
    iter === 2
      ? { i: i2, z: z2, yh: yh2, e: e2, g: g2, wNew: w2, wOld: w1 }
      : { i: i1, z: z1, yh: yh1, e: e1, g: g1, wNew: w1, wOld: w0 }

  const preds = HOURS_X.map((x) => sigmoid(logit(w, x)))

  function draw(g: CanvasRenderingContext2D, W: number, H: number) {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 5, ymin: -0.08, ymax: 1.08, xlab: 'hours studied', ylab: 'P(pass)' })
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.22)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.L, f.py(0.5))
    g.lineTo(f.R, f.py(0.5))
    g.stroke()
    g.setLineDash([])

    g.strokeStyle = INDIGO
    g.lineWidth = 2.75
    g.beginPath()
    for (let px = f.L; px <= f.R; px += 2) {
      const v = sigmoid(w[0] + w[1] * f.ux(px))
      px === f.L ? g.moveTo(px, f.py(v)) : g.lineTo(px, f.py(v))
    }
    g.stroke()

    HOURS_X.forEach((x, i) => {
      const on = at > 0 && i === cur.i
      dot(g, f.px(x[1]), f.py(HOURS_Y[i]), on ? 8 : 6, HOURS_Y[i] === 1 ? TEAL : '#3f3f46', on ? AMBER : null)
      dot(g, f.px(x[1]), f.py(preds[i]), 4, INDIGO)
      g.strokeStyle = 'rgba(79,70,229,0.35)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(f.px(x[1]), f.py(HOURS_Y[i]))
      g.lineTo(f.px(x[1]), f.py(preds[i]))
      g.stroke()
    })
    g.fillStyle = GREY
    g.textAlign = 'left'
    g.fillText('ŷ = σ(w₀ + w₁ · hours)', f.L + 8, f.T + 12)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slides 31 to 35, one press at a time. The dataset is four students; η = 0.5 and w starts at zero. Every number
        below is computed here from X, y and η — none of them is copied off the slide, so the page cannot drift away
        from the deck later.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <ChartCanvas
            height={280}
            draw={draw}
            targets={{ a: w[0], b: w[1] }}
            candidates={() => []}
            tooltip={() => null}
            jumpKey={at}
            caption="Dots on the top and bottom lines are the true labels; the small blue dots on the curve are the current predictions."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--acc)' }}>
              {at === 0 ? STAGE_TITLES[0] : `Iteration ${iter} · ${STAGE_TITLES[stage]}`}
            </div>
            {at === 0 && (
              <Mono>
                <div>X = [[1,1],[1,2],[1,3],[1,4]] y = [0,0,1,1]</div>
                <div>w⁽⁰⁾ = (0, 0) η = 0.5 N = 4</div>
                <div className="mt-1">z = 0 for every row, so ŷ = σ(0) = 0.5 four times.</div>
              </Mono>
            )}
            {at > 0 && stage >= 1 && (
              <Mono>
                <div>
                  chosen: (x⁽{cur.i + 1}⁾, y⁽{cur.i + 1}⁾) = ([1, {HOURS_X[cur.i][1]}], {HOURS_Y[cur.i]})
                </div>
                <div>
                  z = [1, {HOURS_X[cur.i][1]}]·({f3(cur.wOld[0])}, {f3(cur.wOld[1])}) = {f3(cur.z)}
                </div>
                <div>
                  ŷ = σ({f3(cur.z)}) = {f4(cur.yh)}
                </div>
                {stage >= 2 && (
                  <div style={{ color: RED }}>
                    error = {f4(cur.yh)} − {HOURS_Y[cur.i]} = {sgn(cur.e)}
                  </div>
                )}
                {stage >= 3 && (
                  <div style={{ color: AMBER }}>
                    ∇ℓ = {sgn(cur.e)} · [1, {HOURS_X[cur.i][1]}] = ({f3(cur.g[0])}, {f3(cur.g[1])})
                  </div>
                )}
                {stage >= 4 && (
                  <div style={{ color: TEAL }}>
                    w = ({f3(cur.wOld[0])}, {f3(cur.wOld[1])}) − 0.5 · ({f3(cur.g[0])}, {f3(cur.g[1])}) = (
                    {f3(cur.wNew[0])}, {f3(cur.wNew[1])})
                  </div>
                )}
              </Mono>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOutGrid
            items={[
              { label: 'w₀', value: f4(w[0]) },
              { label: 'w₁', value: f4(w[1]) },
              { label: 'J(w)', value: f4(totalLoss(HOURS_X, HOURS_Y, w)) },
              { label: 'updates done', value: String(Math.floor(at / 4) + (at % 4 === 0 ? 0 : at > 4 ? 1 : 0)) },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((s) => Math.min(8, s + 1))} disabled={at >= 8}>
              Next step
            </Btn>
            <Btn onClick={() => setAt(0)}>Start again</Btn>
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <TRow head cells={['hours', 'y', 'ŷ now']} />
            {HOURS_X.map((x, i) => (
              <TRow
                key={i}
                cells={[String(x[1]), String(HOURS_Y[i]), f3(preds[i])]}
                tone={(preds[i] >= 0.5 ? 1 : 0) === HOURS_Y[i] ? TEAL : RED}
              />
            ))}
          </div>
          {at >= 8 && (
            <>
              <Verdict ok>
                w⁽²⁾ = ({f3(w2[0])}, {f3(w2[1])}), which is the (0.116, 0.847) printed on slide 34, and the four
                predictions match slide 35: {preds.map((p) => f3(p)).join(', ')}.
              </Verdict>
              <Verdict ok={false}>
                The sentence on slide 35 does not. It ticks “examples 1, 2 (true label 0): predictions moving toward 0”,
                but those two predictions started at 0.5 and are now {f3(preds[0])} and {f3(preds[1])} — they have moved
                <em> away</em> from 0. Only examples 3 and 4 improved. Two updates out of a single sweep is simply too
                few, and the deck’s own numbers say so.
              </Verdict>
            </>
          )}
          <PanelNote>
            Watch which weight moves most. The gradient is the error times the input, and the chosen example has x₁ = 3,
            so w₁ receives three times the push that w₀ does. Larger features move their weights harder — which is the
            whole argument for scaling them first.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 13 — the computational graph (slides 36, 44)                               */
/* ========================================================================== */

const GRAPH_NODES = [
  {
    id: 'w',
    label: 'w⁽ᵗ⁾',
    what: 'Weights',
    note: 'What the model knows so far. This is the only thing training changes.',
  },
  { id: 'x', label: 'x⁽ⁱ⁾', what: 'Input', note: 'One example, with its leading 1 for the bias.' },
  { id: 'mul', label: '×', what: 'Weighted sum', note: 'z = wᵀx. The only place the weights and the data meet.' },
  { id: 'z', label: 'z', what: 'The logit', note: 'A score in (−∞, ∞). Not yet a probability.' },
  { id: 'sig', label: 'σ', what: 'Sigmoid', note: 'Squashes the logit into (0, 1) so it can be read as P(y = 1 | x).' },
  { id: 'yhat', label: 'ŷ', what: 'Prediction', note: 'The probability the model assigns to class 1.' },
  { id: 'y', label: 'y⁽ⁱ⁾', what: 'Label', note: 'The truth. It enters the graph only here, at the subtraction.' },
  {
    id: 'err',
    label: 'e',
    what: 'The error',
    note: 'e = ŷ − y. Everything the backward pass needs is already in this one number.',
  },
  {
    id: 'loss',
    label: 'ℓ',
    what: 'Loss',
    note: 'ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)]. Reported, but not needed to take the step.',
  },
  { id: 'grad', label: '∇ℓ', what: 'Gradient', note: '∇ℓ = e · x. The backward pass in its entirety, for this model.' },
  { id: 'wnew', label: 'w⁽ᵗ⁺¹⁾', what: 'Updated weights', note: 'w − η∇ℓ. The next forward pass starts from here.' },
]

export function CompGraphLab() {
  const [pick, setPick] = useState<string | null>('mul')
  const [i, setI] = useState(2)
  const w = [-0.25, -0.25]
  const x = HOURS_X[i]
  const y = HOURS_Y[i]
  const z = logit(w, x)
  const yhat = sigmoid(z)
  const e = yhat - y
  const grad = [e * x[0], e * x[1]]
  const wNew = [w[0] - DECK_ETA * grad[0], w[1] - DECK_ETA * grad[1]]

  const values: Record<string, string> = {
    w: `(${f2(w[0])}, ${f2(w[1])})`,
    x: `[1, ${x[1]}]`,
    mul: `${f3(z)}`,
    z: f3(z),
    sig: `σ(${f2(z)})`,
    yhat: f4(yhat),
    y: String(y),
    err: sgn(e),
    loss: f4(bce(yhat, y)),
    grad: `(${f3(grad[0])}, ${f3(grad[1])})`,
    wnew: `(${f3(wNew[0])}, ${f3(wNew[1])})`,
  }
  const node = GRAPH_NODES.find((n) => n.id === pick)

  return (
    <LabBox>
      <LabNote>
        Slide 36’s picture, carrying real numbers. The weights are the (−0.25, −0.25) the worked example reaches after
        its first update, so pressing example 3 reproduces slide 34 exactly. Press any node to see what flows through
        it.
      </LabNote>
      <Presets
        items={HOURS_X.map((r, k) => ({
          id: k,
          label: `example ${k + 1}: ${r[1]} hour${r[1] === 1 ? '' : 's'}, y = ${HOURS_Y[k]}`,
        }))}
        at={i}
        onPick={setI}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Forward — left to right
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['w', 'x', 'mul', 'z', 'sig', 'yhat', 'y', 'err', 'loss'].map((id, k) => (
              <span key={id} className="flex items-center gap-1.5">
                {k > 0 && <span className="font-mono text-[13px] text-zinc-300">→</span>}
                <button
                  type="button"
                  onClick={() => setPick(id)}
                  className="cursor-pointer rounded-lg border px-2.5 py-2 text-center"
                  style={
                    pick === id
                      ? { borderColor: 'var(--acc)', background: 'var(--acc-12)' }
                      : { borderColor: 'rgba(9,9,11,0.12)', background: '#fafafa' }
                  }
                >
                  <span className="block font-mono text-[13px] font-semibold text-zinc-950">
                    {GRAPH_NODES.find((n) => n.id === id)!.label}
                  </span>
                  <span className="block font-mono text-[11px] text-zinc-500 tabular-nums">{values[id]}</span>
                </button>
              </span>
            ))}
          </div>
          <div className="mt-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Backward — the dashed arrows
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['err', 'grad', 'wnew'].map((id, k) => (
              <span key={id} className="flex items-center gap-1.5">
                {k > 0 && <span className="font-mono text-[13px] text-zinc-300">→</span>}
                <button
                  type="button"
                  onClick={() => setPick(id)}
                  className="cursor-pointer rounded-lg border px-2.5 py-2 text-center"
                  style={
                    pick === id
                      ? { borderColor: 'var(--acc)', background: 'var(--acc-12)' }
                      : { borderColor: 'rgba(217,119,6,0.35)', background: 'rgba(217,119,6,0.07)' }
                  }
                >
                  <span className="block font-mono text-[13px] font-semibold text-zinc-950">
                    {GRAPH_NODES.find((n) => n.id === id)!.label}
                  </span>
                  <span className="block font-mono text-[11px] text-zinc-500 tabular-nums">{values[id]}</span>
                </button>
              </span>
            ))}
            <span className="ml-1 font-mono text-[11.5px] text-zinc-500">e · x, then −η</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          {node ? (
            <>
              <ReadOut label={node.what} value={values[node.id]} note={node.label} tone={INDIGO} />
              <PanelNote>{node.note}</PanelNote>
            </>
          ) : (
            <PanelNote>Press a node.</PanelNote>
          )}
          <PanelNote>
            The loss box is a dead end. Nothing downstream of ℓ feeds the update — the gradient is built from e, which
            is computed before the loss is. You could delete the loss node entirely and still train; you just would not
            know how it was going.
          </PanelNote>
          <PanelNote>
            Slide 44 draws the same thing as a loop: data → model → loss → SGD → back to the model. This is one turn of
            it, for one example.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 14 — the split and the confusion matrix (slides 38–39)                     */
/* ========================================================================== */

/** Twenty scored examples. Fixed, so the matrix is reproducible on every load. */
const SCORED: Array<{ p: number; y: number }> = [
  { p: 0.97, y: 1 },
  { p: 0.94, y: 1 },
  { p: 0.91, y: 1 },
  { p: 0.85, y: 0 },
  { p: 0.8, y: 1 },
  { p: 0.74, y: 1 },
  { p: 0.68, y: 1 },
  { p: 0.61, y: 0 },
  { p: 0.57, y: 1 },
  { p: 0.52, y: 0 },
  { p: 0.48, y: 1 },
  { p: 0.44, y: 0 },
  { p: 0.39, y: 1 },
  { p: 0.33, y: 0 },
  { p: 0.28, y: 0 },
  { p: 0.22, y: 1 },
  { p: 0.17, y: 0 },
  { p: 0.11, y: 0 },
  { p: 0.06, y: 0 },
  { p: 0.02, y: 0 },
]

export function ConfusionLab() {
  const [thr, setThr] = useState(0.5)
  const TP = SCORED.filter((s) => s.p >= thr && s.y === 1).length
  const FP = SCORED.filter((s) => s.p >= thr && s.y === 0).length
  const FN = SCORED.filter((s) => s.p < thr && s.y === 1).length
  const TN = SCORED.filter((s) => s.p < thr && s.y === 0).length

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 1,
      ymin: -0.5,
      ymax: 1.5,
      xlab: 'ŷ — the model’s probability',
      ylab: '',
    })
    const t = ctx.disp.thr ?? thr

    g.fillStyle = 'rgba(13,148,136,0.07)'
    g.fillRect(f.px(t), f.T, f.R - f.px(t), f.B - f.T)
    g.strokeStyle = AMBER
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.px(t), f.T)
    g.lineTo(f.px(t), f.B)
    g.stroke()
    g.fillStyle = AMBER
    g.textAlign = 'center'
    g.fillText('threshold', f.px(t), f.T + 10)

    g.fillStyle = GREY
    g.textAlign = 'left'
    g.fillText('actually 1', f.L + 6, f.py(1) - 16)
    g.fillText('actually 0', f.L + 6, f.py(0) - 16)

    SCORED.forEach((s) => {
      const right = (s.p >= t ? 1 : 0) === s.y
      dot(g, f.px(s.p), f.py(s.y), 6.5, s.y === 1 ? TEAL : '#3f3f46', right ? null : RED)
    })
    grip(g, f.px(t), f.py(0.5), AMBER, 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Twenty test examples, each with the probability the model gave it. Drag the threshold — or press anywhere in the
        plot. Everything to its right is predicted positive. The four boxes below are the confusion matrix of slide 39,
        and they are just counts of dots on each side.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <ChartCanvas
            height={250}
            draw={draw}
            targets={{ thr }}
            candidates={() => []}
            tooltip={() => null}
            handles={(f: Frame) => [
              { id: 't', px: f.px(thr), py: f.py(0.5), grab: 'anywhere', label: 'the decision threshold' },
            ]}
            onDragTo={(_id, x) => setThr(clamp(Math.round(x * 100) / 100, 0.01, 0.99))}
          />
          <div className="overflow-x-auto">
            <div className="inline-grid grid-cols-[auto_1fr_1fr] gap-px rounded-lg border border-zinc-950/10 bg-zinc-200">
              <span className="bg-zinc-50 px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase">
                actual \ predicted
              </span>
              <span className="bg-zinc-50 px-3 py-2 text-center text-[11px] font-semibold text-zinc-500 uppercase">
                positive (1)
              </span>
              <span className="bg-zinc-50 px-3 py-2 text-center text-[11px] font-semibold text-zinc-500 uppercase">
                negative (0)
              </span>
              <span className="bg-zinc-50 px-3 py-2 text-[12px] font-semibold text-zinc-700">positive (1)</span>
              <span className="px-3 py-3 text-center" style={{ background: 'rgba(13,148,136,0.1)' }}>
                <span className="block font-mono text-[19px] font-semibold" style={{ color: '#0f766e' }}>
                  {TP}
                </span>
                <span className="block text-[11px] text-zinc-600">TP</span>
              </span>
              <span className="px-3 py-3 text-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
                <span className="block font-mono text-[19px] font-semibold" style={{ color: '#991b1b' }}>
                  {FN}
                </span>
                <span className="block text-[11px] text-zinc-600">FN — type II</span>
              </span>
              <span className="bg-zinc-50 px-3 py-2 text-[12px] font-semibold text-zinc-700">negative (0)</span>
              <span className="px-3 py-3 text-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
                <span className="block font-mono text-[19px] font-semibold" style={{ color: '#991b1b' }}>
                  {FP}
                </span>
                <span className="block text-[11px] text-zinc-600">FP — type I</span>
              </span>
              <span className="px-3 py-3 text-center" style={{ background: 'rgba(13,148,136,0.1)' }}>
                <span className="block font-mono text-[19px] font-semibold" style={{ color: '#0f766e' }}>
                  {TN}
                </span>
                <span className="block text-[11px] text-zinc-600">TN</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Threshold" value={f2(thr)} note={`${TP + FP} predicted positive`} tone={AMBER} />
          <ReadOutGrid
            items={[
              { label: 'accuracy', value: f3((TP + TN) / 20) },
              { label: 'errors', value: String(FP + FN) },
              { label: 'false alarms', value: String(FP) },
              { label: 'misses', value: String(FN) },
            ]}
          />
          <PanelNote>
            The four counts always add to 20, whatever the threshold. Moving it does not remove mistakes — it trades one
            kind for the other. Drag it left and the misses turn into false alarms; drag it right and they turn back.
          </PanelNote>
          <PanelNote>
            The names are worth saying out loud once. A <strong>false positive</strong> is the model shouting when
            nothing is there; a <strong>false negative</strong> is it staying quiet when something is. Which one you
            fear decides the threshold, and no amount of training decides it for you.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setThr(0.5)}>Back to 0.5</Btn>
            <Btn onClick={() => setThr(0.2)}>Catch everything</Btn>
            <Btn onClick={() => setThr(0.85)}>Only if certain</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 15 — accuracy, precision, recall, F1 (slides 40–43)                        */
/* ========================================================================== */

const METRIC_PRESETS = [
  { id: 'deck', label: 'The deck’s example, slide 43', counts: [3, 3, 1, 1] },
  { id: 'rare', label: 'Rare disease: 2 in 100, model says “no” always', counts: [0, 98, 0, 2] },
  { id: 'shout', label: 'Model says “yes” to everything', counts: [20, 0, 80, 0] },
  { id: 'good', label: 'A genuinely good classifier', counts: [45, 48, 3, 4] },
]

export function MetricsLab() {
  // [TP, TN, FP, FN]
  const [c, setC] = useState([3, 3, 1, 1])
  const [TP, TN, FP, FN] = c
  const total = TP + TN + FP + FN
  const acc = total ? (TP + TN) / total : NaN
  const prec = TP + FP ? TP / (TP + FP) : NaN
  const rec = TP + FN ? TP / (TP + FN) : NaN
  const f1 = prec + rec > 0 && Number.isFinite(prec) && Number.isFinite(rec) ? (2 * prec * rec) / (prec + rec) : NaN
  const show = (v: number) => (Number.isFinite(v) ? f3(v) : 'undefined')

  return (
    <LabBox>
      <LabNote>
        Type the four counts, or press a preset. Every metric is recomputed from them, and a metric whose denominator is
        zero says <em>undefined</em> rather than inventing a number — precision genuinely has no value when the model
        never predicts positive.
      </LabNote>
      <Presets
        items={METRIC_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
        at={METRIC_PRESETS.find((p) => p.counts.every((v, i) => v === c[i]))?.id ?? 'custom'}
        onPick={(id) => setC(METRIC_PRESETS.find((p) => p.id === id)!.counts)}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              TP, TN, FP, FN — type into any of them
            </div>
            <NumBox
              m={[c]}
              onEdit={(_i, j, v) => setC((old) => old.map((x, xi) => (xi === j ? Math.max(0, Math.round(v)) : x)))}
              name="counts"
              width={62}
            />
            <div className="mt-1 flex gap-1 font-mono text-[11px] text-zinc-500">
              <span className="w-[62px] px-2 text-right">TP</span>
              <span className="w-[62px] px-2 text-right">TN</span>
              <span className="w-[62px] px-2 text-right">FP</span>
              <span className="w-[62px] px-2 text-right">FN</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Mono>
              <div>Accuracy = (TP + TN) / (TP + TN + FP + FN)</div>
              <div>
                = ({TP} + {TN}) / {total} = <strong>{show(acc)}</strong>
              </div>
            </Mono>
            <Mono>
              <div>Precision = TP / (TP + FP)</div>
              <div>
                = {TP} / {TP + FP} = <strong>{show(prec)}</strong>
              </div>
            </Mono>
            <Mono>
              <div>Recall = TP / (TP + FN)</div>
              <div>
                = {TP} / {TP + FN} = <strong>{show(rec)}</strong>
              </div>
            </Mono>
            <Mono>
              <div>F1 = 2 · (Precision × Recall) / (Precision + Recall)</div>
              <div>
                = <strong>{show(f1)}</strong>
              </div>
            </Mono>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOutGrid
            items={[
              { label: 'accuracy', value: show(acc) },
              { label: 'precision', value: show(prec) },
              { label: 'recall', value: show(rec) },
              { label: 'F1', value: show(f1) },
            ]}
          />
          <Verdict ok={Number.isFinite(f1) && f1 > 0.6}>
            {!Number.isFinite(prec)
              ? 'Precision is undefined: the model never predicts positive, so there is no set of positive predictions to be right about. Accuracy still looks fine, which is the trap.'
              : !Number.isFinite(rec)
                ? 'Recall is undefined: there are no actual positives in this test set at all.'
                : f1 > 0.6
                  ? 'Precision and recall are both reasonable, so F1 is too.'
                  : 'F1 is low. Because it is the harmonic mean, one bad number drags it down — being excellent at one and useless at the other scores badly, which is the point of using it.'}
          </Verdict>
          <PanelNote>
            Try the rare-disease preset. A model that says “no illness” to all 100 patients scores 98% accuracy and
            finds not one sick person. That is slide 42’s warning about imbalanced data, and it is why recall is the
            metric that matters in medicine.
          </PanelNote>
          <PanelNote>
            F1 is the <strong>harmonic</strong> mean, not the ordinary one. Precision 1.0 with recall 0.1 averages to
            0.55 the usual way but gives F1 = 0.18 — the harmonic mean refuses to be impressed by one good half.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
