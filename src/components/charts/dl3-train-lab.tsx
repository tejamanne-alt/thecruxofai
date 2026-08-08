'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'
import { DECK_X, DECK_Y, gradJ, lambdaMax, lossJ, N, normalEq, predict } from './dl3-lab'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

const ETA_CRIT = 2 / lambdaMax(DECK_X)

/** One run of batch gradient descent from w⁰ = 0, recomputed on every render. */
function descend(eta: number, steps: number) {
  const path: number[][] = [[0, 0]]
  for (let i = 0; i < steps; i++) {
    const w = path[path.length - 1]
    const g = gradJ(DECK_X, DECK_Y, w)
    path.push([w[0] - eta * g[0], w[1] - eta * g[1]])
  }
  return path
}

/* ========================================================================== */
/* 10 — the idea of gradient descent                                          */
/* ========================================================================== */

export function GdIdeaLab() {
  const [w1, setW1] = useState(0.2)
  const [eta, setEta] = useState(0.2)
  const [path, setPath] = useState<number[]>([0.2])

  // A one-parameter slice: fix the intercept at its best value and vary the slope.
  const opt = normalEq(DECK_X, DECK_Y)
  const sliceJ = (b: number) => lossJ(DECK_X, DECK_Y, [opt[0], b])
  const sliceG = (b: number) => gradJ(DECK_X, DECK_Y, [opt[0], b])[1]

  const here = path[path.length - 1]

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.5, xmax: 3.5, ymin: 0, ymax: 6, xlab: 'w₁, the slope', ylab: 'J(w)' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const b = -0.5 + (i / 200) * 4
      if (i === 0) g.moveTo(f.px(b), f.py(sliceJ(b)))
      else g.lineTo(f.px(b), f.py(sliceJ(b)))
    }
    g.stroke()
    g.strokeStyle = accentColour()
    g.lineWidth = 1.5
    g.beginPath()
    path.forEach((p, i) => (i === 0 ? g.moveTo(f.px(p), f.py(sliceJ(p))) : g.lineTo(f.px(p), f.py(sliceJ(p)))))
    g.stroke()
    for (const p of path) dot(g, f.px(p), f.py(sliceJ(p)), 3.5, accentColour())
    // The tangent, which is the thing the step is read off.
    const s = sliceG(here)
    g.strokeStyle = RED
    g.setLineDash([4, 3])
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(here - 0.7), f.py(sliceJ(here) - 0.7 * s))
    g.lineTo(f.px(here + 0.7), f.py(sliceJ(here) + 0.7 * s))
    g.stroke()
    g.setLineDash([])
    g.restore()
    grip(g, f.px(here), f.py(sliceJ(here)), accentColour(), 7)
    dot(g, f.px(opt[1]), f.py(sliceJ(opt[1])), 4, TEAL)
    g.fillStyle = TEAL
    g.textAlign = 'center'
    g.fillText('global cost minimum', f.px(opt[1]), f.py(sliceJ(opt[1])) + 16)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        One parameter at a time, so the picture is the deck’s: a bowl, a starting weight, and a gradient that points the
        way out. The dashed red line is the slope at the marker — the only information a step ever uses.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ here }}
          jumpKey={path.length}
          height={320}
          caption="Press or drag anywhere to put the weight there, then step from it."
          handles={(f: Frame) => [{ id: 'w', px: f.px(here), py: f.py(sliceJ(here)), grab: 'anywhere' as const }]}
          onDragTo={(_id, x) => {
            const v = Math.round(clamp(x, -0.5, 3.5) * 100) / 100
            setW1(v)
            setPath([v])
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="J at this weight" value={sliceJ(here).toFixed(4)} note={`w₁ = ${here.toFixed(3)}`} />
          <ReadOutGrid
            items={[
              { label: 'gradient', value: sliceG(here).toFixed(3) },
              { label: 'step', value: (-eta * sliceG(here)).toFixed(3) },
              { label: 'steps taken', value: String(path.length - 1) },
              { label: 'best w₁', value: opt[1].toFixed(3) },
            ]}
          />
          <Slider
            label="Learning rate η"
            value={eta}
            display={eta.toFixed(2)}
            min={0.02}
            max={0.7}
            step={0.01}
            hint="η > 0 is the step size. Try 0.6."
            onChange={setEta}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setPath((p) => [...p, p[p.length - 1] - eta * sliceG(p[p.length - 1])])}>
              Step downhill
            </Btn>
            <Btn onClick={() => setPath([w1])}>Reset</Btn>
          </div>
          <Verdict ok={Math.abs(sliceG(here)) < 0.05}>
            {Math.abs(sliceG(here)) < 0.05
              ? 'The gradient is nearly zero, so the steps have nearly stopped. This is the bottom.'
              : `The gradient is ${sliceG(here) > 0 ? 'positive, so the step goes left' : 'negative, so the step goes right'} — always against the slope.`}
          </Verdict>
          <PanelNote>
            The minus sign in w ← w − η∇J is doing the work. The gradient points uphill, so subtracting it goes down.
            Getting that sign wrong is one of the four entries on the debugging checklist later in this deck.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 11 — the batch algorithm, line by line                                     */
/* ========================================================================== */

const ALGO_LINES = [
  {
    n: 1,
    code: 'Initialise w⁽⁰⁾ = 0 (or random)',
    note: 'Zero is fine for linear regression — there is only one unit, so there is no symmetry to break. A network could not do this.',
  },
  {
    n: 2,
    code: 't ← 0',
    note: 'The iteration counter. Nothing to do with the target t elsewhere in the deck, which is an unfortunate clash of letters.',
  },
  {
    n: 3,
    code: 'while not converged do',
    note: 'The loop. What counts as converged is line 6 — and, in practice, also a cap on iterations.',
  },
  {
    n: 4,
    code: '∇J(w⁽ᵗ⁾) = (1/N) Xᵀ(Xw⁽ᵗ⁾ − y)',
    note: 'One pass over the whole dataset. "Batch" means exactly this: every example contributes to every step.',
  },
  {
    n: 5,
    code: 'w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η ∇J(w⁽ᵗ⁾)',
    note: 'The step. Every parameter moves at once, each against its own slope.',
  },
  {
    n: 6,
    code: 'if ‖∇J(w⁽ᵗ⁺¹⁾)‖ < ε then break',
    note: 'Stop when the gradient is small — that is, when the surface has gone flat, which for a convex problem means you are at the bottom.',
  },
  { n: 7, code: 't ← t + 1', note: 'Next iteration.' },
  { n: 8, code: 'return w⁽ᵗ⁺¹⁾', note: 'The learned weights. For this problem they will be close to 2/3 and 3/2.' },
]

export function BatchAlgoLab() {
  const [at, setAt] = useState(0)
  const [t, setT] = useState(0)
  const eta = 0.1
  const path = descend(eta, t)
  const w = path[path.length - 1]
  const g = gradJ(DECK_X, DECK_Y, w)
  const gnorm = Math.hypot(g[0], g[1])
  const line = ALGO_LINES[at]

  return (
    <LabBox>
      <LabNote>
        The nine lines of Algorithm 1, with the state beside them. Step through the lines and watch each variable take
        its value.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            {ALGO_LINES.map((l, i) => (
              <button
                key={l.n}
                type="button"
                onClick={() => setAt(i)}
                className="flex w-full cursor-pointer items-start gap-3 rounded px-2 py-1.5 text-left"
                style={i === at ? { background: 'var(--acc-12)' } : undefined}
              >
                <span className="w-5 shrink-0 text-right font-mono text-[11px] text-zinc-400">{l.n}</span>
                <span
                  className="font-mono text-[12.5px]"
                  style={{ color: i === at ? 'var(--acc)' : '#3f3f46', fontWeight: i === at ? 700 : 400 }}
                >
                  {l.code}
                </span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Line {line.n}
            </div>
            <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{line.note}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label={`w after ${t} iteration${t === 1 ? '' : 's'}`}
            value={`(${w[0].toFixed(3)}, ${w[1].toFixed(3)})`}
            note={`J = ${lossJ(DECK_X, DECK_Y, w).toFixed(4)}`}
          />
          <ReadOutGrid
            items={[
              { label: '∇J₀', value: g[0].toFixed(3) },
              { label: '∇J₁', value: g[1].toFixed(3) },
              { label: '‖∇J‖', value: gnorm.toFixed(4) },
              { label: 'η', value: eta.toFixed(2) },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((v) => (v + 1) % ALGO_LINES.length)}>
              Next line
            </Btn>
            <Btn onClick={() => setT((v) => v + 1)}>Run one iteration</Btn>
            <Btn onClick={() => setT((v) => v + 25)}>Run 25</Btn>
            <Btn onClick={() => setT(0)}>Reset</Btn>
          </div>
          <Verdict ok={gnorm < 1e-4}>
            {gnorm < 1e-4
              ? 'Line 6 fires: the gradient is below ε = 10⁻⁴, so the loop breaks and the weights are returned.'
              : `Line 6 does not fire yet — ‖∇J‖ is ${gnorm.toFixed(5)}, still above ε = 10⁻⁴.`}
          </Verdict>
          <PanelNote>
            Every iteration reads all {N} examples. That is what <strong>batch</strong> means, and it is why the
            gradient is exact but each step is expensive — on a million rows, one step costs a million evaluations.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 12 — computing the gradient                                                */
/* ========================================================================== */

export function GradientLab() {
  const [w0, setW0] = useState(0)
  const [w1, setW1] = useState(0)
  const w = [w0, w1]
  const yhat = predict(DECK_X, w)
  const e = yhat.map((p, i) => p - DECK_Y[i])
  const g = gradJ(DECK_X, DECK_Y, w)
  // The same gradient the other way round — as a sum over examples, slide 22.
  const gSum = [DECK_X.reduce((s, r, i) => s + e[i] * r[0], 0) / N, DECK_X.reduce((s, r, i) => s + e[i] * r[1], 0) / N]
  const agree = Math.abs(g[0] - gSum[0]) < 1e-12 && Math.abs(g[1] - gSum[1]) < 1e-12

  return (
    <LabBox>
      <LabNote>
        Slide 22 gives the gradient twice — once as a sum over examples and once as a matrix product. They are the same
        thing, and the lab computes both so you can watch them agree.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
          <div className="mb-1 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            1 — predictions
          </div>
          {DECK_X.map((r, i) => (
            <div key={i}>
              ŷ⁽{i + 1}⁾ = {r[0]}({w0.toFixed(3)}) + {r[1]}({w1.toFixed(3)}) = {yhat[i].toFixed(3)}
            </div>
          ))}

          <div className="mt-3 mb-1 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            2 — the error vector e = Xw − y
          </div>
          <div>e = [{e.map((v) => v.toFixed(3)).join(', ')}]ᵀ</div>

          <div className="mt-3 mb-1 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            3 — as a sum over examples
          </div>
          <div>
            ∇J₀ = (1/{N})[{e.map((v, i) => `${v.toFixed(2)}×${DECK_X[i][0]}`).join(' + ')}] = {gSum[0].toFixed(4)}
          </div>
          <div>
            ∇J₁ = (1/{N})[{e.map((v, i) => `${v.toFixed(2)}×${DECK_X[i][1]}`).join(' + ')}] = {gSum[1].toFixed(4)}
          </div>

          <div className="mt-3 mb-1 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            4 — as a matrix product, (1/N)Xᵀe
          </div>
          <div>
            Xᵀ is ({DECK_X[0].length} × {N}), e is ({N} × 1), so ∇J is ({DECK_X[0].length} × 1)
          </div>
          <div className="font-semibold" style={{ color: 'var(--acc)' }}>
            ∇J = [{g.map((v) => v.toFixed(4)).join(', ')}]ᵀ
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="‖∇J‖" value={Math.hypot(g[0], g[1]).toFixed(4)} note="how steep the surface is here" />
          <Slider label="w₀" value={w0} display={w0.toFixed(2)} min={-2} max={3} step={0.05} hint="" onChange={setW0} />
          <Slider label="w₁" value={w1} display={w1.toFixed(2)} min={-1} max={3} step={0.05} hint="" onChange={setW1} />
          <div className="flex flex-wrap gap-2">
            <Btn
              primary
              onClick={() => {
                setW0(0)
                setW1(0)
              }}
            >
              The deck’s starting point
            </Btn>
            <Btn
              onClick={() => {
                const o = normalEq(DECK_X, DECK_Y)
                setW0(Math.round(o[0] * 100) / 100)
                setW1(Math.round(o[1] * 100) / 100)
              }}
            >
              The minimum
            </Btn>
          </div>
          <Verdict ok={agree}>
            {agree
              ? 'The sum and the matrix product agree to the last digit, as they must — the matrix form is the sum, written in a way a computer can run in one call.'
              : 'They disagree, which would be a bug on this page.'}
          </Verdict>
          <PanelNote>
            At the minimum every entry of ∇J is zero. That is not a coincidence of this example — it is the definition
            of a minimum on a smooth surface, and it is what line 6 of the algorithm is testing for.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 13 — the update rule and what η does                                       */
/* ========================================================================== */

export function UpdateEtaLab() {
  const [eta, setEta] = useState(0.1)
  const [steps, setSteps] = useState(20)
  const path = descend(eta, steps)
  const w = path[path.length - 1]
  const J = lossJ(DECK_X, DECK_Y, w)
  const finite = Number.isFinite(J)
  const opt = normalEq(DECK_X, DECK_Y)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -1, xmax: 3, ymin: -0.5, ymax: 3, xlab: 'w₀', ylab: 'w₁' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    const st = 7
    for (let px = f.L; px < f.R; px += st) {
      for (let py = f.T; py < f.B; py += st) {
        const v = lossJ(DECK_X, DECK_Y, [f.ux(px), f.uy(py)])
        const t = Math.min(1, Math.log10(1 + v) / 1.2)
        g.fillStyle = `rgba(79,70,229,${0.05 + (Math.floor(t * 9) / 9) * 0.45})`
        g.fillRect(px, py, st, st)
      }
    }
    g.strokeStyle = RED
    g.lineWidth = 1.8
    g.beginPath()
    path.forEach((p, i) => {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return
      if (i === 0) g.moveTo(f.px(p[0]), f.py(p[1]))
      else g.lineTo(f.px(p[0]), f.py(p[1]))
    })
    g.stroke()
    for (const p of path) if (Number.isFinite(p[0])) dot(g, f.px(p[0]), f.py(p[1]), 3, RED)
    g.restore()
    dot(g, f.px(opt[0]), f.py(opt[1]), 5, TEAL)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The path gradient descent takes across the loss surface, for the learning rate you choose. Push η up slowly and
        watch the path stop curving inwards and start bouncing.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ eta, steps }}
          jumpKey={`${eta}-${steps}`}
          height={330}
          caption="Red is the path from w = 0. The teal dot is the minimum."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Loss after these steps"
            value={finite ? J.toFixed(5) : 'overflowed'}
            tone={!finite || J > 7.5 ? RED : J < 0.05 ? TEAL : undefined}
            note={
              finite ? `w = (${w[0].toFixed(3)}, ${w[1].toFixed(3)})` : 'the numbers grew past what a float can hold'
            }
          />
          <Slider
            label="Learning rate η"
            value={eta}
            display={eta.toFixed(3)}
            min={0.005}
            max={0.5}
            step={0.005}
            hint="The deck uses 0.1. Try 0.37."
            onChange={setEta}
          />
          <Slider
            label="Iterations"
            value={steps}
            display={String(steps)}
            min={0}
            max={200}
            step={1}
            hint=""
            onChange={(v) => setSteps(Math.round(v))}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setEta(0.1)}>η = 0.1</Btn>
            <Btn onClick={() => setEta(0.01)}>η = 0.01</Btn>
            <Btn onClick={() => setEta(0.4)}>η = 0.4</Btn>
          </div>
          <Verdict ok={finite && J <= 7.5}>
            {!finite || J > 7.5
              ? 'Diverging — each step lands further out than the last, and the loss is now worse than it was at w = 0.'
              : 'Converging. The path spirals in towards the bottom of the bowl.'}
          </Verdict>
          <PanelNote>
            For this problem the exact turning point can be worked out: descent converges when η is below 2 divided by
            the largest eigenvalue of XᵀX/N, which is <strong>{ETA_CRIT.toFixed(4)}</strong> here. The lab computes that
            from the data rather than quoting it — set η either side of it and watch.
          </PanelNote>
          <PanelNote>
            Too small is not safe either, only slow. At η = 0.005 the loss after 200 steps is still well above its floor
            — you have not gone wrong, you have simply not arrived.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 14 — the deck's worked numerical example                                   */
/* ========================================================================== */

const STAGES = [
  'Setup: X, y and w⁽⁰⁾',
  'Initial predictions and loss',
  'The error vector',
  'The gradient',
  'The weight update',
  'The new predictions and loss',
]

export function WorkedExampleLab() {
  const [at, setAt] = useState(0)
  const eta = 0.1
  const w0 = [0, 0]
  const yhat0 = predict(DECK_X, w0)
  const J0 = lossJ(DECK_X, DECK_Y, w0)
  const e0 = yhat0.map((p, i) => p - DECK_Y[i])
  const g0 = gradJ(DECK_X, DECK_Y, w0)
  const w1 = [w0[0] - eta * g0[0], w0[1] - eta * g0[1]]
  const yhat1 = predict(DECK_X, w1)
  const e1 = yhat1.map((p, i) => p - DECK_Y[i])
  const J1 = lossJ(DECK_X, DECK_Y, w1)
  const drop = (1 - J1 / J0) * 100

  const rows: React.ReactNode[] = [
    <>
      <div>X = [[1, 1], [1, 2], [1, 3]] — three houses, sizes 1, 2, 3</div>
      <div>y = [{DECK_Y.join(', ')}]ᵀ — their prices</div>
      <div>
        w⁽⁰⁾ = [0, 0]ᵀ, η = {eta}, N = {N}
      </div>
    </>,
    <>
      <div>ŷ⁽⁰⁾ = Xw⁽⁰⁾ = [{yhat0.join(', ')}]ᵀ</div>
      <div>
        J(w⁽⁰⁾) = (1/2N)‖Xw − y‖² = (1/6)({DECK_Y.map((v) => v * v).join(' + ')}) = {J0.toFixed(1)}
      </div>
    </>,
    <>
      <div>e⁽⁰⁾ = ŷ⁽⁰⁾ − y = [{e0.join(', ')}]ᵀ</div>
    </>,
    <>
      <div>∇J(w⁽⁰⁾) = (1/N) Xᵀe⁽⁰⁾</div>
      <div>
        = (1/{N}) [ {e0.join(' + ')} , {e0.map((v, i) => `${v}×${DECK_X[i][1]}`).join(' + ')} ]ᵀ
      </div>
      <div>
        = (1/{N}) [{e0.reduce((s, v) => s + v, 0)}, {e0.reduce((s, v, i) => s + v * DECK_X[i][1], 0)}]ᵀ = [
        {g0.map((v) => v.toFixed(2)).join(', ')}]ᵀ
      </div>
    </>,
    <>
      <div>w⁽¹⁾ = w⁽⁰⁾ − η∇J(w⁽⁰⁾)</div>
      <div>
        = [0, 0]ᵀ − {eta}[{g0.map((v) => v.toFixed(2)).join(', ')}]ᵀ = [{w1.map((v) => v.toFixed(3)).join(', ')}]ᵀ
      </div>
      <div>ŷ⁽¹⁾ = Xw⁽¹⁾ = [{yhat1.map((v) => v.toFixed(2)).join(', ')}]ᵀ</div>
    </>,
    <>
      <div>e⁽¹⁾ = ŷ⁽¹⁾ − y = [{e1.map((v) => v.toFixed(2)).join(', ')}]ᵀ</div>
      <div>
        J(w⁽¹⁾) = (1/6)({e1.map((v) => (v * v).toFixed(2)).join(' + ')}) = {J1.toFixed(2)}
      </div>
      <div style={{ color: 'var(--acc)' }}>
        7.5 → {J1.toFixed(2)}, a {drop.toFixed(0)}% reduction in one iteration
      </div>
    </>,
  ]

  return (
    <LabBox>
      <LabNote>
        Slides 26 to 30, one stage at a time. Every number below is computed from X, y and η by the same functions the
        rest of this chapter uses — none of it is copied off the slide.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setAt(i)}
                className="cursor-pointer rounded-md border px-2.5 py-1.5 text-[11.5px] font-semibold"
                style={
                  i === at
                    ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                    : i < at
                      ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)', color: '#0f766e' }
                      : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#71717a' }
                }
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[2] text-zinc-800">
            {rows[at]}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Loss"
            value={at >= 5 ? J1.toFixed(2) : J0.toFixed(1)}
            note={at >= 5 ? 'after one iteration' : 'before any training'}
            tone={at >= 5 ? TEAL : RED}
          />
          <ReadOutGrid
            items={[
              { label: 'J(w⁰)', value: J0.toFixed(1) },
              { label: 'J(w¹)', value: J1.toFixed(2) },
              { label: '∇J₀', value: g0[0].toFixed(2) },
              { label: '∇J₁', value: g0[1].toFixed(2) },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((v) => Math.min(v + 1, STAGES.length - 1))}>
              Next stage →
            </Btn>
            <Btn onClick={() => setAt(0)}>Back to the start</Btn>
          </div>
          <Verdict ok={Math.abs(J0 - 7.5) < 1e-9 && Math.abs(J1 - 1.51) < 0.005}>
            {Math.abs(J0 - 7.5) < 1e-9 && Math.abs(J1 - 1.51) < 0.005
              ? 'Both of the deck’s printed losses come out: 7.5 before, 1.51 after. Reproduced by running the formulas, not by copying them.'
              : 'The numbers do not match the deck — that would be a bug on this page.'}
          </Verdict>
          <PanelNote>
            The deck stops here. One more thing worth knowing: the exact answer for this data, from the normal
            equations, is w = (2/3, 3/2) with a loss of 1/36 ≈ 0.0278. So one iteration got 80% of the way in loss, and
            there is still a long way to go in weights.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 15 — the computational graph                                               */
/* ========================================================================== */

const NODES = [
  {
    id: 'w',
    label: 'w⁽ᵗ⁾',
    kind: 'param',
    x: 0.1,
    y: 0.2,
    note: 'The parameters. Everything else on the graph is computed; these are the only things training changes.',
  },
  {
    id: 'X',
    label: 'X',
    kind: 'data',
    x: 0.42,
    y: 0.1,
    note: 'The design matrix. Fixed — it comes from the data and is never updated.',
  },
  { id: 'y', label: 'y', kind: 'data', x: 0.78, y: 0.1, note: 'The targets. Also fixed.' },
  {
    id: 'yhat',
    label: 'ŷ',
    kind: 'calc',
    x: 0.55,
    y: 0.38,
    note: 'ŷ = Xw. The forward pass, and the only place the parameters are used.',
  },
  {
    id: 'e',
    label: 'e',
    kind: 'calc',
    x: 0.78,
    y: 0.55,
    note: 'e = ŷ − y. The error vector — one number per example.',
  },
  {
    id: 'J',
    label: 'J(w)',
    kind: 'loss',
    x: 0.9,
    y: 0.8,
    note: 'The loss, a single number. Everything to the left produced it; everything below flows back from it.',
  },
  {
    id: 'grad',
    label: '∇J',
    kind: 'grad',
    x: 0.28,
    y: 0.72,
    note: '∇J = (1/N)Xᵀe. The backward pass — the error, weighted by the inputs that caused it.',
  },
  {
    id: 'wnew',
    label: 'w⁽ᵗ⁺¹⁾',
    kind: 'param',
    x: 0.1,
    y: 0.5,
    note: 'w − η∇J. The updated parameters, ready for the next pass round the graph.',
  },
]
const EDGES: Array<[string, string, boolean]> = [
  ['w', 'yhat', false],
  ['X', 'yhat', false],
  ['yhat', 'e', false],
  ['y', 'e', false],
  ['e', 'J', false],
  ['e', 'grad', true],
  ['grad', 'wnew', true],
]
const KIND_COLOUR: Record<string, string> = {
  param: '#0d9488',
  data: '#2563eb',
  calc: '#7c3aed',
  loss: '#dc2626',
  grad: '#d97706',
}

export function CompGraphLab() {
  const [at, setAt] = useState('w')
  const node = NODES.find((n) => n.id === at)!

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f: Frame = { L: 0, R: W, T: 0, B: H, px: (v) => v, py: (v) => v, ux: (p) => p, uy: (p) => p }
    const pos = Object.fromEntries(NODES.map((n) => [n.id, { x: n.x * (W - 70) + 35, y: n.y * (H - 50) + 25 }]))
    for (const [a, b, back] of EDGES) {
      const A = pos[a]
      const B = pos[b]
      const live = a === at || b === at
      g.strokeStyle = live ? accentColour() : back ? 'rgba(217,119,6,0.35)' : 'rgba(9,9,11,0.2)'
      g.lineWidth = live ? 2.5 : 1.5
      g.setLineDash(back ? [5, 4] : [])
      g.beginPath()
      g.moveTo(A.x, A.y)
      g.lineTo(B.x, B.y)
      g.stroke()
      g.setLineDash([])
    }
    for (const n of NODES) {
      const p = pos[n.id]
      const on = n.id === at
      g.fillStyle = on ? KIND_COLOUR[n.kind] : '#fff'
      g.fillRect(p.x - 26, p.y - 14, 52, 28)
      g.strokeStyle = KIND_COLOUR[n.kind]
      g.lineWidth = 2
      g.strokeRect(p.x - 26, p.y - 14, 52, 28)
      g.fillStyle = on ? '#fff' : KIND_COLOUR[n.kind]
      g.textAlign = 'center'
      g.fillText(n.label, p.x, p.y)
    }
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'left'
    g.fillText('solid = forwards, dashed = backwards', 8, H - 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The whole iteration as a graph. Solid arrows go forwards to the loss; dashed ones carry the gradient back to the
        weights. Press a node to see what it is.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ n: NODES.findIndex((n) => n.id === at) }}
          jumpKey={at}
          height={300}
          caption="Nothing here is animated — press the buttons on the right to move around the graph."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label={node.label} value={node.kind} tone={KIND_COLOUR[node.kind]} note="press another node below" />
          <p className="crux-prose text-[13px]/[1.7] text-zinc-700">{node.note}</p>
          <div className="flex flex-wrap gap-1.5">
            {NODES.map((n) => (
              <Chip key={n.id} on={n.id === at} label={n.label} onClick={() => setAt(n.id)} />
            ))}
          </div>
          <PanelNote>
            This graph is exactly what an autograd library builds. Every operation records what it did on the way
            forwards so the chain rule can be applied on the way back — which is what <code>loss.backward()</code>{' '}
            walks, and what module 3 generalises to many layers.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 16 — training error against test error                                     */
/* ========================================================================== */

const ALL_X = Array.from({ length: 20 }, (_, i) => (i * 10) / 19)
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return (s / 2147483648 - 0.5) * 3
  }
}
const RN = seeded(4)
const ALL_Y = ALL_X.map((x) => 1.4 * x + 2 + RN())

export function TrainTestLab() {
  const [split, setSplit] = useState(80)
  const [deg, setDeg] = useState(1)

  const nTrain = Math.max(2, Math.round((split / 100) * ALL_X.length))
  const idx = ALL_X.map((_, i) => i)
  const trainIdx = idx.filter((i) => i % ALL_X.length < nTrain)
  const testIdx = idx.filter((i) => !trainIdx.includes(i))

  const build = (ix: number[]) => ix.map((i) => Array.from({ length: deg + 1 }, (_, p) => ALL_X[i] ** p))
  const Xtr = build(trainIdx)
  const ytr = trainIdx.map((i) => ALL_Y[i])

  // Least squares by elimination on the normal equations.
  const k = deg + 1
  const A: number[][] = Array.from({ length: k }, () => new Array(k + 1).fill(0))
  Xtr.forEach((row, r) => {
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) A[i][j] += row[i] * row[j]
      A[i][k] += row[i] * ytr[r]
    }
  })
  for (let i = 0; i < k; i++) A[i][i] += 1e-9
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
  const co = Array.from({ length: k }, (_, i) => (Math.abs(A[i][i]) < 1e-12 ? 0 : A[i][k] / A[i][i]))
  const evalAt = (x: number) => co.reduce((s, c, i) => s + c * x ** i, 0)
  const mse = (ix: number[]) => ix.reduce((s, i) => s + (evalAt(ALL_X[i]) - ALL_Y[i]) ** 2, 0) / Math.max(1, ix.length)
  const Jtr = mse(trainIdx)
  const Jte = mse(testIdx)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.5, xmax: 10.5, ymin: -2, ymax: 20, xlab: 'x', ylab: 'y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const x = -0.5 + (i / 200) * 11
      if (i === 0) g.moveTo(f.px(x), f.py(evalAt(x)))
      else g.lineTo(f.px(x), f.py(evalAt(x)))
    }
    g.stroke()
    g.restore()
    for (const i of trainIdx) dot(g, f.px(ALL_X[i]), f.py(ALL_Y[i]), 5, '#18181b')
    for (const i of testIdx) dot(g, f.px(ALL_X[i]), f.py(ALL_Y[i]), 5, '#fff', RED)
    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('● training', f.L + 6, f.T + 10)
    g.fillStyle = RED
    g.fillText('○ test', f.L + 70, f.T + 10)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The same formula on two different sets of rows. The deck says training is typically 90–99% of the data and test
        1–10% — move the split and see what that costs.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ split, deg }}
          jumpKey={`${split}-${deg}`}
          height={320}
          caption="Black points are used to fit; hollow red ones are held back. The data is made up, from a straight line plus noise."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="J train" value={Jtr.toFixed(3)} note={`${trainIdx.length} rows`} />
          <ReadOut
            label="J test"
            value={testIdx.length ? Jte.toFixed(3) : '—'}
            note={`${testIdx.length} rows`}
            tone={testIdx.length && Jte > Jtr * 2 ? RED : TEAL}
          />
          <Slider
            label="Training share"
            value={split}
            display={`${split}%`}
            min={20}
            max={95}
            step={5}
            hint="The deck suggests 90–99%."
            onChange={(v) => setSplit(Math.round(v / 5) * 5)}
          />
          <Slider
            label="Degree of the model"
            value={deg}
            display={String(deg)}
            min={1}
            max={8}
            step={1}
            hint="1 is the linear model this session is about."
            onChange={(v) => setDeg(Math.round(v))}
          />
          <Verdict ok={!testIdx.length || Jte <= Jtr * 2}>
            {!testIdx.length
              ? 'No test rows left — with nothing held back there is no way to tell whether the model generalises.'
              : Jte > Jtr * 2
                ? 'The test error is far above the training error. The model has learnt something about these rows that is not true of the others.'
                : 'Training and test error are in the same range, which is what you want.'}
          </Verdict>
          <PanelNote>
            Turn the degree up to 8 with a small training share. The training error falls towards zero and the test
            error climbs — the same overfitting from session 1, now with two numbers you can read side by side.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 17 & 18 — MSE, RMSE, MAE and R²                                            */
/* ========================================================================== */

const M_X = [1, 2, 3, 4, 5, 6]
const M_BASE = [2.2, 3.9, 6.1, 8.2, 9.8, 12.1]

export function MetricsLab() {
  const [last, setLast] = useState(12.1)
  const [withR2, setWithR2] = useState(false)

  const ys = [...M_BASE.slice(0, 5), last]
  const X = M_X.map((x) => [1, x])
  const w = normalEq(X, ys)
  const pred = M_X.map((x) => w[0] + w[1] * x)
  const err = pred.map((p, i) => p - ys[i])
  const mse = err.reduce((s, e) => s + e * e, 0) / err.length
  const rmse = Math.sqrt(mse)
  const mae = err.reduce((s, e) => s + Math.abs(e), 0) / err.length
  const ybar = ys.reduce((s, v) => s + v, 0) / ys.length
  const ssRes = err.reduce((s, e) => s + e * e, 0)
  const ssTot = ys.reduce((s, v) => s + (v - ybar) ** 2, 0)
  const r2 = 1 - ssRes / ssTot

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 7, ymin: -2, ymax: 30, xlab: 'x', ylab: 'y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    if (withR2) {
      g.strokeStyle = 'rgba(9,9,11,0.35)'
      g.setLineDash([5, 4])
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(0), f.py(ybar))
      g.lineTo(f.px(7), f.py(ybar))
      g.stroke()
      g.setLineDash([])
      g.fillStyle = '#71717a'
      g.textAlign = 'left'
      g.fillText('ȳ — the baseline R² compares against', f.L + 6, f.py(ybar) - 8)
    }
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(w[0]))
    g.lineTo(f.px(7), f.py(w[0] + w[1] * 7))
    g.stroke()
    M_X.forEach((x, i) => {
      g.strokeStyle = 'rgba(220,38,38,0.45)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(x), f.py(ys[i]))
      g.lineTo(f.px(x), f.py(pred[i]))
      g.stroke()
    })
    g.restore()
    M_X.forEach((x, i) => dot(g, f.px(x), f.py(ys[i]), 5, '#2563eb'))
    grip(g, f.px(6), f.py(last), '#2563eb', 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Four scores computed from the same six errors. Drag the last point far away and watch which of them react calmly
        and which do not.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ last }}
          height={330}
          caption="Press or drag anywhere to move the last point."
          handles={(f: Frame) => [{ id: 'p', px: f.px(6), py: f.py(last), grab: 'anywhere' as const }]}
          onDragTo={(_id, _x, y) => setLast(Math.round(clamp(y, -2, 29) * 10) / 10)}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOutGrid
            items={[
              { label: 'MSE', value: mse.toFixed(3) },
              { label: 'RMSE', value: rmse.toFixed(3) },
              { label: 'MAE', value: mae.toFixed(3) },
              { label: 'R²', value: r2.toFixed(3) },
            ]}
          />
          <Slider
            label="Last point’s y"
            value={last}
            display={last.toFixed(1)}
            min={-2}
            max={29}
            step={0.1}
            hint="It starts at 12.1, on the trend."
            onChange={setLast}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setLast(12.1)}>On the trend</Btn>
            <Btn onClick={() => setLast(26)}>Far off</Btn>
            <Btn onClick={() => setWithR2((v) => !v)}>{withR2 ? 'Hide the baseline' : 'Show R²’s baseline'}</Btn>
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[11.5px]/[1.8] text-zinc-700">
            <div>MSE = (1/N) Σ (ŷ − y)² = {mse.toFixed(4)}</div>
            <div>RMSE = √MSE = {rmse.toFixed(4)} — back in the units of y</div>
            <div>MAE = (1/N) Σ |y − ŷ| = {mae.toFixed(4)}</div>
            <div>
              R² = 1 − SS_res/SS_tot = 1 − {ssRes.toFixed(2)}/{ssTot.toFixed(2)} = {r2.toFixed(4)}
            </div>
          </div>
          <Verdict ok={rmse >= mae - 1e-9}>
            {rmse >= mae - 1e-9
              ? `RMSE (${rmse.toFixed(2)}) is at least MAE (${mae.toFixed(2)}), and the gap grows as the errors get more uneven. That gap is a measure of how lopsided your errors are.`
              : 'RMSE below MAE would be impossible — a bug on this page.'}
          </Verdict>
          <PanelNote>
            The deck marks MAE as <strong>less sensitive to outliers than MSE</strong>, and this is that sentence made
            visible: drag the point to 26 and MSE roughly quadruples while MAE roughly doubles. RMSE is the one to
            report to a person, because it is in the same units as the thing being predicted.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

export function R2Lab() {
  const [slope, setSlope] = useState(2)
  const [intercept, setIntercept] = useState(0)

  const ys = M_BASE
  const pred = M_X.map((x) => intercept + slope * x)
  const ybar = ys.reduce((s, v) => s + v, 0) / ys.length
  const ssRes = ys.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0)
  const ssTot = ys.reduce((s, v) => s + (v - ybar) ** 2, 0)
  const r2 = 1 - ssRes / ssTot
  const best = normalEq(
    M_X.map((x) => [1, x]),
    ys
  )
  const bestR2 = 1 - ys.reduce((s, v, i) => s + (v - (best[0] + best[1] * M_X[i])) ** 2, 0) / ssTot

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 7, ymin: -4, ymax: 18, xlab: 'x', ylab: 'y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.4)'
    g.setLineDash([5, 4])
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.px(0), f.py(ybar))
    g.lineTo(f.px(7), f.py(ybar))
    g.stroke()
    g.setLineDash([])
    g.strokeStyle = r2 >= 0 ? accentColour() : RED
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(intercept))
    g.lineTo(f.px(7), f.py(intercept + slope * 7))
    g.stroke()
    g.restore()
    M_X.forEach((x, i) => dot(g, f.px(x), f.py(ys[i]), 5, '#2563eb'))
    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('ȳ, the baseline', f.L + 6, f.py(ybar) - 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        R² compares your model against one particular rival: always predicting the mean. Move the line and watch the
        score — and find the settings that push it below zero.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ slope, intercept }}
          height={320}
          caption="The dashed line is the baseline. Your line turns red when it is doing worse than that."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="R²"
            value={r2.toFixed(3)}
            tone={r2 > 0.7 ? TEAL : r2 > 0 ? AMBER : RED}
            note={
              r2 >= 0.999
                ? 'perfect fit'
                : r2 > 0
                  ? 'better than the mean'
                  : r2 === 0
                    ? 'exactly as good as the mean'
                    : 'worse than the mean'
            }
          />
          <Slider
            label="Slope"
            value={slope}
            display={slope.toFixed(2)}
            min={-2}
            max={4}
            step={0.05}
            hint=""
            onChange={setSlope}
          />
          <Slider
            label="Intercept"
            value={intercept}
            display={intercept.toFixed(2)}
            min={-4}
            max={6}
            step={0.05}
            hint=""
            onChange={setIntercept}
          />
          <div className="flex flex-wrap gap-2">
            <Btn
              primary
              onClick={() => {
                setSlope(Math.round(best[1] * 100) / 100)
                setIntercept(Math.round(best[0] * 100) / 100)
              }}
            >
              Best line (R² = {bestR2.toFixed(3)})
            </Btn>
            <Btn
              onClick={() => {
                setSlope(0)
                setIntercept(Math.round(ybar * 100) / 100)
              }}
            >
              Predict the mean
            </Btn>
            <Btn
              onClick={() => {
                setSlope(-1)
                setIntercept(12)
              }}
            >
              Worse than useless
            </Btn>
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]/[1.7] text-zinc-700">
            <div>
              <strong>R² = 1</strong> — every point on the line.
            </div>
            <div>
              <strong>R² = 0</strong> — no better than predicting ȳ for everything.
            </div>
            <div>
              <strong>R² {'<'} 0</strong> — worse than that. The deck notes this is possible on a test set.
            </div>
            <div>
              <strong>0.7 to 0.9</strong> — the deck’s rule of thumb for a good fit.
            </div>
          </div>
          <PanelNote>
            Press <strong>Predict the mean</strong>: a flat line at ȳ gives exactly R² = 0, because the numerator and
            denominator become the same sum. That is what the score is built around — it is not an accuracy, it is a
            comparison.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 19 — scaling, and what it does to convergence                              */
/* ========================================================================== */

export function ScalingLab() {
  const [scale, setScale] = useState(1)
  const [standardise, setStandardise] = useState(false)

  // The same three houses, with the size column multiplied by `scale`.
  const raw = DECK_X.map((r) => [1, r[1] * scale])
  const col = raw.map((r) => r[1])
  const mu = col.reduce((s, v) => s + v, 0) / col.length
  const sd = Math.sqrt(col.reduce((s, v) => s + (v - mu) ** 2, 0) / col.length) || 1
  const X = standardise ? raw.map((r) => [1, (r[1] - mu) / sd]) : raw

  const lam = lambdaMax(X)
  const etaMax = 2 / lam
  // Condition number of XᵀX/N — how stretched the bowl is.
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
  const lmin = (tr - Math.sqrt(Math.max(0, tr * tr - 4 * det))) / 2
  const cond = lmin > 1e-12 ? lam / lmin : Infinity

  // How many steps at a safe learning rate to get the loss within 1% of its floor.
  const eta = 0.9 * etaMax
  const opt = normalEq(X, DECK_Y)
  const floor = lossJ(X, DECK_Y, opt)
  let w = [0, 0]
  let steps = 0
  const start = lossJ(X, DECK_Y, w)
  while (steps < 20000 && lossJ(X, DECK_Y, w) - floor > 0.01 * (start - floor)) {
    const g = gradJ(X, DECK_Y, w)
    w = [w[0] - eta * g[0], w[1] - eta * g[1]]
    steps++
  }

  return (
    <LabBox>
      <LabNote>
        The deck’s three houses again, with the size column multiplied by a number you choose. Nothing about the problem
        changes — the same line still fits — and everything about the training changes.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
          <div className="mb-2 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The design matrix
          </div>
          {X.map((r, i) => (
            <div key={i}>[ {r.map((v) => v.toFixed(3).padStart(9)).join('  ')} ]</div>
          ))}
          <div className="mt-3 mb-1 font-sans text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            What that does to the bowl
          </div>
          <div>largest eigenvalue of XᵀX/N = {lam.toFixed(4)}</div>
          <div>smallest = {lmin.toFixed(6)}</div>
          <div>ratio (condition number) = {Number.isFinite(cond) ? cond.toFixed(1) : '∞'}</div>
          <div className="mt-2">
            largest safe η = 2 / {lam.toFixed(3)} = {etaMax.toFixed(5)}
          </div>
          <div className="font-semibold" style={{ color: 'var(--acc)' }}>
            steps to get within 1% of the best loss: {steps >= 20000 ? 'more than 20 000' : steps}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Iterations needed"
            value={steps >= 20000 ? '20 000+' : String(steps)}
            tone={steps < 50 ? TEAL : steps < 1000 ? AMBER : RED}
            note={`condition number ${Number.isFinite(cond) ? cond.toFixed(0) : '∞'}`}
          />
          <Slider
            label="Multiply the size column by"
            value={scale}
            display={`× ${scale}`}
            min={1}
            max={200}
            step={1}
            hint="Metres to centimetres is × 100."
            onChange={(v) => setScale(Math.round(v))}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={!standardise} label="raw features" onClick={() => setStandardise(false)} />
            <Chip on={standardise} label="standardised (z-score)" onClick={() => setStandardise(true)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setScale(1)}>× 1</Btn>
            <Btn onClick={() => setScale(100)}>× 100</Btn>
          </div>
          <Verdict ok={steps < 200}>
            {steps < 200
              ? 'Converges in a sensible number of steps.'
              : 'The bowl is stretched so far that gradient descent crawls. The learning rate is limited by the steep direction, and the shallow one then takes forever.'}
          </Verdict>
          <PanelNote>
            Press <strong>× 100</strong>, then switch to <strong>standardised</strong>. The deck gives two recipes —
            min-max scaling to [0, 1] and the z-score, subtract the mean and divide by the standard deviation — and this
            is what they buy: a rounder bowl, a larger usable η, and far fewer steps.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 20 — the debugging checklist                                               */
/* ========================================================================== */

const SYMPTOMS = [
  {
    id: 'nan',
    name: 'Loss is NaN or Inf',
    eta: 0.45,
    steps: 60,
    causes: ['Learning rate too large', 'Numerical overflow — check feature scales'],
    fix: 'Decrease η, scale the features',
  },
  {
    id: 'osc',
    name: 'Loss oscillating',
    eta: 0.35,
    steps: 40,
    causes: ['Learning rate too large'],
    fix: 'Decrease η, or use a learning-rate decay',
  },
  {
    id: 'slow',
    name: 'Loss not decreasing',
    eta: 0.002,
    steps: 40,
    causes: [
      'Learning rate too small',
      'Bug in the gradient — check signs',
      'Wrong sign in the update rule; it should be minus',
    ],
    fix: 'Increase η, verify the code',
  },
  {
    id: 'gap',
    name: 'Training fine, test error high',
    eta: 0.1,
    steps: 60,
    causes: ['Overfitting — too many features relative to data'],
    fix: 'Regularisation, more data, or a simpler model',
  },
]

export function DebugLab() {
  const [pick, setPick] = useState('nan')
  const s = SYMPTOMS.find((x) => x.id === pick)!
  const path = descend(s.eta, s.steps)
  const losses = path.map((w) => lossJ(DECK_X, DECK_Y, w))

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const finite = losses.filter((v) => Number.isFinite(v))
    const top = Math.min(50, Math.max(10, Math.max(...finite.slice(0, 12), 10)))
    const f = drawAxes(g, W, H, { xmin: 0, xmax: s.steps, ymin: 0, ymax: top, xlab: 'iteration', ylab: 'J(w)' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    let started = false
    losses.forEach((v, i) => {
      if (!Number.isFinite(v)) return
      const py = f.py(Math.min(v, top * 1.5))
      if (!started) {
        g.moveTo(f.px(i), py)
        started = true
      } else g.lineTo(f.px(i), py)
    })
    g.stroke()
    losses.forEach((v, i) => {
      if (Number.isFinite(v) && v <= top) dot(g, f.px(i), f.py(v), 3, accentColour())
    })
    g.restore()
    const bad = losses.findIndex((v) => !Number.isFinite(v))
    if (bad > 0) {
      g.fillStyle = RED
      g.textAlign = 'left'
      g.fillText(`NaN from iteration ${bad}`, f.L + 8, f.T + 12)
    }
    return f
  }

  const finalLoss = losses[losses.length - 1]

  return (
    <LabBox>
      <LabNote>
        Four symptoms from the deck’s checklist, each produced here by actually breaking the training run rather than by
        drawing a picture of it. Pick one and watch the loss curve it gives.
      </LabNote>

      <Presets items={SYMPTOMS.map((x) => ({ id: x.id, label: x.name }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ n: s.steps }}
          jumpKey={pick}
          height={300}
          caption="The loss against iteration, from w = 0 on the deck's three houses."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Loss after the run"
            value={Number.isFinite(finalLoss) ? finalLoss.toFixed(4) : 'NaN'}
            tone={!Number.isFinite(finalLoss) || finalLoss > 1 ? RED : TEAL}
            note={`η = ${s.eta}, ${s.steps} iterations`}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The deck’s causes
            </div>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-[12.5px]/[1.6] text-zinc-700">
              {s.causes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="mt-2 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: TEAL }}>
              Solution
            </div>
            <div className="text-[12.5px]/[1.6] text-zinc-800">{s.fix}</div>
          </div>
          <PanelNote>
            The first three are all the learning rate, at three different distances from the edge. Above{' '}
            {ETA_CRIT.toFixed(3)} this problem diverges; just below it, it oscillates on the way in; far below it, it
            crawls. Only the fourth symptom has nothing to do with η.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 21 — the whole loop                                                        */
/* ========================================================================== */

const LOOP = [
  { id: 'data', name: '1. Data & initialisation', detail: 'D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}, w⁽⁰⁾ = 0' },
  { id: 'model', name: '2. Model', detail: 'ŷ = Xw, a single neuron with a linear activation' },
  { id: 'obj', name: '3. Objective', detail: 'J(w) = (1/2N)‖Xw − y‖², the MSE loss' },
  { id: 'learn', name: '4. Learning', detail: 'w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η∇J, then round again' },
]

export function LoopLab() {
  const [t, setT] = useState(0)
  const [stage, setStage] = useState(0)
  const eta = 0.1
  const path = descend(eta, t)
  const w = path[path.length - 1]
  const J = lossJ(DECK_X, DECK_Y, w)
  const opt = normalEq(DECK_X, DECK_Y)
  const floor = lossJ(DECK_X, DECK_Y, opt)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 4, ymin: -1, ymax: 8, xlab: 'size x₁', ylab: 'price y' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(13,148,136,0.5)'
    g.setLineDash([5, 4])
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.px(0), f.py(opt[0]))
    g.lineTo(f.px(4), f.py(opt[0] + opt[1] * 4))
    g.stroke()
    g.setLineDash([])
    g.strokeStyle = accentColour()
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(0), f.py(w[0]))
    g.lineTo(f.px(4), f.py(w[0] + w[1] * 4))
    g.stroke()
    DECK_X.forEach((r, i) => {
      g.strokeStyle = 'rgba(220,38,38,0.45)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(r[1]), f.py(DECK_Y[i]))
      g.lineTo(f.px(r[1]), f.py(w[0] + w[1] * r[1]))
      g.stroke()
    })
    g.restore()
    DECK_X.forEach((r, i) => dot(g, f.px(r[1]), f.py(DECK_Y[i]), 6, '#2563eb'))
    g.fillStyle = TEAL
    g.textAlign = 'left'
    g.fillText('dashed = the best line there is', f.L + 6, f.T + 10)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The deck’s closing diagram, running. Press <strong>One turn of the loop</strong> and watch the line walk towards
        the dashed one — which is the exact least-squares answer, computed here for comparison.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ a: w[0], b: w[1] }}
            height={300}
            caption="The red bars are what the current line gets wrong."
          />
          <div className="grid gap-2 sm:grid-cols-4">
            {LOOP.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setStage(i)}
                className="cursor-pointer rounded-lg border p-3 text-left"
                style={
                  i === stage
                    ? { borderColor: 'var(--acc)', background: 'var(--acc-12)' }
                    : { borderColor: 'rgba(9,9,11,0.1)', background: '#fff' }
                }
              >
                <div className="text-[12px] font-semibold text-zinc-950">{l.name}</div>
                <div className="mt-0.5 font-mono text-[11px]/[1.5] text-zinc-600">{l.detail}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="J(w)"
            value={J.toFixed(5)}
            note={`floor is ${floor.toFixed(5)}`}
            tone={J - floor < 0.001 ? TEAL : undefined}
          />
          <ReadOutGrid
            items={[
              { label: 'iterations', value: String(t) },
              { label: 'w₀', value: w[0].toFixed(4) },
              { label: 'w₁', value: w[1].toFixed(4) },
              { label: 'above the floor', value: (J - floor).toFixed(5) },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setT((v) => v + 1)}>
              One turn of the loop
            </Btn>
            <Btn onClick={() => setT((v) => v + 50)}>Fifty turns</Btn>
            <Btn onClick={() => setT(0)}>Reset</Btn>
          </div>
          <Verdict ok={J - floor < 0.001}>
            {J - floor < 0.001
              ? `Settled. w = (${w[0].toFixed(3)}, ${w[1].toFixed(3)}), against the exact answer (${opt[0].toFixed(3)}, ${opt[1].toFixed(3)}).`
              : 'Still moving — the loop has not converged yet.'}
          </Verdict>
          <PanelNote>
            The deck’s last line on that diagram is the important one:{' '}
            <em>this framework extends to more complex models — neural networks, deep learning</em>. Nothing about the
            loop changes in module 3. Only the model box gets bigger, and the gradient gets harder to compute — which is
            what backpropagation is for.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
