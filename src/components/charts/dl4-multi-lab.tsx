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
const CLASS_TONES = [INDIGO, TEAL, AMBER]

const f2 = (v: number) => v.toFixed(2)
const f3 = (v: number) => v.toFixed(3)
const f4 = (v: number) => v.toFixed(4)
const sgn = (v: number) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))

/* ========================================================================== */
/* The multi-class arithmetic, written once                                   */
/* ========================================================================== */

/** softmax(z)ₖ = e^{zₖ} / Σⱼ e^{zⱼ}, slide 57, with the max subtracted (slide 91). */
export function softmax(z: number[]) {
  const c = Math.max(...z)
  const e = z.map((v) => Math.exp(v - c))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((v) => v / s)
}
/** The naive version, kept so part 26 can show it overflowing. */
export function softmaxNaive(z: number[]) {
  const e = z.map((v) => Math.exp(v))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((v) => v / s)
}
/** z = Wᵀx for one example: one entry per class, slide 56. */
export const logits = (W: number[][], x: number[]) => W[0].map((_, k) => W.reduce((s, row, j) => s + row[k] * x[j], 0))
/** −Σₖ yₖ log ŷₖ for one example, slide 61. Only the true class contributes. */
export const catLoss = (yhat: number[], y: number[]) =>
  -y.reduce((s, yk, k) => s + (yk === 0 ? 0 : yk * Math.log(Math.max(yhat[k], 1e-12))), 0)
export const argmax = (v: number[]) => v.reduce((best, x, i) => (x > v[best] ? i : best), 0)

/** Slides 73–74: four points, three classes, with the bias column already in. */
export const MC_X: number[][] = [
  [1, 1, 2],
  [1, 2, 1],
  [1, 2, 3],
  [1, 3, 2],
]
export const MC_CLASS = [1, 2, 1, 3]
export const MC_Y = MC_CLASS.map((c) => [0, 1, 2].map((k) => (k === c - 1 ? 1 : 0)))
export const MC_W0: number[][] = [
  [0.1, -0.1, 0.2],
  [0.2, 0.1, -0.1],
  [-0.1, 0.2, 0.1],
]
export const MC_ETA = 0.1

/* --------------------------------------------------------- small helpers */

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12px]/[1.8] text-zinc-700">
      {children}
    </div>
  )
}

/** A row of probability bars. Hoisted: defining it inline would remount it. */
function ProbBars({ p, labels, mark }: { p: number[]; labels?: string[]; mark?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {p.map((v, k) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-[11.5px] text-zinc-600">{labels?.[k] ?? `class ${k + 1}`}</span>
          <span className="relative h-4 flex-1 overflow-hidden rounded bg-zinc-100">
            <span
              className="absolute inset-y-0 left-0 rounded"
              style={{ width: `${Math.max(0, Math.min(100, v * 100))}%`, background: CLASS_TONES[k % 3] }}
            />
          </span>
          <span
            className="w-14 shrink-0 text-right font-mono text-[11.5px] tabular-nums"
            style={{ color: mark === k ? CLASS_TONES[k % 3] : '#3f3f46', fontWeight: mark === k ? 700 : 400 }}
          >
            {v.toFixed(3)}
          </span>
        </div>
      ))}
    </div>
  )
}

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

/** A read-only grid of numbers with a title, for the matrices this half is full of. */
function MatBox({ m, title, note, mark }: { m: number[][]; title: string; note?: string; mark?: [number, number] }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</span>
        {note && <span className="text-[11px] text-zinc-400">{note}</span>}
      </div>
      <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
        {m.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((v, j) => {
              const on = mark?.[0] === i && mark?.[1] === j
              return (
                <span
                  key={j}
                  className="w-[62px] rounded px-2 py-1.5 text-right font-mono text-[12.5px] tabular-nums"
                  style={on ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 } : undefined}
                >
                  {Number.isFinite(v) ? v.toFixed(3) : String(v)}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========================================================================== */
/* 16 — what multi-class classification is (slides 47–49)                     */
/* ========================================================================== */

const regionLogits = (x1: number, x2: number) => [
  1.2 * (x2 - 3),
  1.2 * (-0.866 * (x1 - 3) - 0.5 * (x2 - 3)),
  1.2 * (0.866 * (x1 - 3) - 0.5 * (x2 - 3)),
]

export function MultiClassLab() {
  const [pt, setPt] = useState({ x: 3.8, y: 4.4 })
  const z = regionLogits(pt.x, pt.y)
  const p = softmax(z)
  const win = argmax(p)

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 6, ymin: 0, ymax: 6, xlab: 'x₁', ylab: 'x₂' })
    const step = 7
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const q = softmax(regionLogits(f.ux(px), f.uy(py)))
        const k = argmax(q)
        // Fade towards white where the model is unsure, so the boundaries show.
        const conf = clamp((q[k] - 1 / 3) / (2 / 3), 0, 1)
        g.fillStyle = `${CLASS_TONES[k]}${Math.round(20 + conf * 45)
          .toString(16)
          .padStart(2, '0')}`
        g.fillRect(px, py, step, step)
      }
    }
    for (let k = 0; k < 3; k++) {
      const c = [
        [3, 5.2],
        [1.2, 2],
        [4.8, 2],
      ][k]
      g.fillStyle = CLASS_TONES[k]
      g.textAlign = 'center'
      g.fillText(`class ${k + 1}`, f.px(c[0]), f.py(c[1]))
    }
    const px = ctx.disp.x ?? pt.x
    const py = ctx.disp.y ?? pt.y
    grip(g, f.px(px), f.py(py), '#09090b', 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Slide 49, made live. Three classes, three linear models, and the winner is whichever score is largest. Drag the
        black marker — or press anywhere — and watch the three probabilities trade off. They always add to exactly 1,
        which is the property slide 47 insists on.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={350}
          draw={draw}
          targets={{ x: pt.x, y: pt.y }}
          candidates={() => []}
          tooltip={() => null}
          handles={(f: Frame) => [
            { id: 'p', px: f.px(pt.x), py: f.py(pt.y), grab: 'anywhere', label: 'the example being classified' },
          ]}
          onDragTo={(_id, x, y) => setPt({ x: clamp(x, 0, 6), y: clamp(y, 0, 6) })}
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Predicted class"
            value={`class ${win + 1}`}
            note={`${(p[win] * 100).toFixed(1)}% confident`}
            tone={CLASS_TONES[win]}
          />
          <ProbBars p={p} mark={win} />
          <ReadOutGrid
            items={[
              { label: 'they sum to', value: f4(p.reduce((a, b) => a + b, 0)) },
              { label: 'largest logit', value: f2(Math.max(...z)) },
              { label: 'runner-up', value: `class ${argmax(p.map((v, i) => (i === win ? -1 : v))) + 1}` },
              { label: 'margin', value: f3(p[win] - Math.max(...p.filter((_, i) => i !== win))) },
            ]}
          />
          <PanelNote>
            Stand on a boundary and two probabilities meet at about 0.5 each; stand where all three meet — near the
            centre — and all three sit near 1/3. That triple point is where the model is least certain, and there is
            exactly one of them for three linear classes.
          </PanelNote>
          <PanelNote>
            Each example belongs to exactly one class, so there is one arg max and one answer. Multi-<em>label</em>{' '}
            problems drop that rule, and with it the softmax: a separate sigmoid per label lets several be near 1 at
            once.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 17 — one-hot labels (slides 51–53)                                         */
/* ========================================================================== */

export function OneHotLab() {
  const [cls, setCls] = useState([3, 1, 2, 1, 3])
  const K = 4
  const Y = cls.map((c) => Array.from({ length: K }, (_, k) => (k === c - 1 ? 1 : 0)))

  return (
    <LabBox>
      <LabNote>
        Slide 53. Press the class of each example and watch its row of Y build itself: all zeros except a single 1, in
        the position of the class. The integer column on the left is the same information — the point is what the two
        forms <em>imply</em>.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          {cls.map((c, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <span className="w-20 shrink-0 font-mono text-[12px] text-zinc-500">example {i + 1}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((k) => (
                  <Chip
                    key={k}
                    on={c === k}
                    label={String(k)}
                    onClick={() => setCls((old) => old.map((v, vi) => (vi === i ? k : v)))}
                  />
                ))}
              </div>
              <span className="font-mono text-[13px] tabular-nums" style={{ color: CLASS_TONES[(c - 1) % 3] }}>
                [{Y[i].join(', ')}]
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Shape of Y" value={`${cls.length} × ${K}`} note="one row per example, one column per class" />
          <Mono>
            <div>y = [{cls.join(', ')}]ᵀ — integer encoding</div>
            <div className="mt-1">{'Y ∈ {0, 1}ᴺˣᴷ — one-hot'}</div>
            <div>every row sums to 1</div>
          </Mono>
          <PanelNote>
            The integer form quietly claims that class 3 is three times class 1, and that class 2 sits between them.
            None of that is true for cat, dog and car. One-hot says nothing at all about order, which is why it is the
            form every framework wants.
          </PanelNote>
          <PanelNote>
            It also happens to be the shape softmax produces — K numbers per example — so the loss can compare the two
            row by row without any conversion. That is the second reason on the slide, and the practical one.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 18 — the weight matrix and the K logits (slides 54–56)                     */
/* ========================================================================== */

export function WeightMatrixLab() {
  const [W, setW] = useState(MC_W0.map((r) => [...r]))
  const [row, setRow] = useState(0)
  const x = MC_X[row]
  const z = logits(W, x)
  const [hover, setHover] = useState<number | null>(null)

  const setCell = (i: number, j: number, v: number) =>
    setW((old) => old.map((r, ri) => (ri === i ? r.map((c, ci) => (ci === j ? v : c)) : r)))

  return (
    <LabBox>
      <LabNote>
        W has one <strong>column per class</strong>, so K linear models sit side by side in a single matrix. Type into
        it, or press a class below to highlight the column that belongs to it. The starting values are the deck’s own
        W⁽⁰⁾ from slide 74.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-start gap-5">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                W ∈ ℝ⁽ᵈ⁺¹⁾ˣᴷ — row 0 is the biases
              </div>
              <NumBox m={W} onEdit={setCell} markCol={hover} name="weight matrix" />
              <div className="mt-1 flex gap-1 font-mono text-[11px] text-zinc-500">
                {[1, 2, 3].map((k) => (
                  <span key={k} className="w-[54px] px-2 text-right">
                    w{k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                z = Wᵀx for the chosen row
              </div>
              <div className="flex flex-col gap-1.5">
                {z.map((v, k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setHover(hover === k ? null : k)}
                    className="cursor-pointer rounded-lg border px-3 py-2 text-left"
                    style={
                      hover === k
                        ? { borderColor: 'var(--acc)', background: 'var(--acc-12)' }
                        : { borderColor: 'rgba(9,9,11,0.12)', background: '#fafafa' }
                    }
                  >
                    <span className="font-mono text-[12px] text-zinc-500">
                      z{k + 1} = w{k + 1}ᵀx ={' '}
                    </span>
                    <span className="font-mono text-[14px] font-semibold text-zinc-950">{f3(v)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Presets
            items={MC_X.map((r, k) => ({ id: k, label: `row ${k + 1}: x = [1, ${r[1]}, ${r[2]}]` }))}
            at={row}
            onPick={setRow}
          />
          <MatBox
            m={MC_X.map((r) => logits(W, r))}
            title="Z = XW — every example at once"
            note="one row per example, one column per class"
          />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Parameters in W" value={String(W.length * W[0].length)} note="(d + 1) × K = 3 × 3" />
          <ReadOutGrid
            items={[
              { label: 'largest logit', value: f3(Math.max(...z)) },
              { label: 'would predict', value: `class ${argmax(z) + 1}` },
              { label: 'shape of Z', value: `${MC_X.length} × 3` },
              { label: 'binary needed', value: 'd + 1' },
            ]}
          />
          <PanelNote>
            Nothing couples the columns yet. Each class has its own weight vector and its own score, and a score can be
            any real number — the deck calls them <strong>logits</strong> and says plainly that they are not
            probabilities. Softmax is what ties them together in the next part.
          </PanelNote>
          <PanelNote>
            Z = XW does the whole dataset in one matrix product. That single line is the reason mini-batches are fast:
            the hardware is doing one big multiply instead of B small ones.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 19 — the softmax function (slides 57–59)                                   */
/* ========================================================================== */

export function SoftmaxLab() {
  const [z, setZ] = useState([2.0, 1.0, 0.1])
  const [shift, setShift] = useState(0)
  const zz = z.map((v) => v + shift)
  const exps = zz.map((v) => Math.exp(v))
  const sum = exps.reduce((a, b) => a + b, 0)
  const p = exps.map((v) => v / sum)
  const setZk = (k: number, v: number) => setZ((old) => old.map((c, ci) => (ci === k ? v : c)))

  return (
    <LabBox>
      <LabNote>
        The three steps of slide 59, done on whatever logits you set. It opens on the deck’s own z = [2.0, 1.0, 0.1].
        The shift slider adds the same constant to all three — property 4 on slide 58 says that must change nothing at
        all, and the bars are where you check it.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {z.map((v, k) => (
              <Slider
                key={k}
                label={`z${k + 1}`}
                value={v}
                display={f2(v)}
                min={-4}
                max={4}
                step={0.1}
                hint={`Score for class ${k + 1}.`}
                onChange={(nv) => setZk(k, nv)}
              />
            ))}
          </div>
          <Slider
            label="Add c to every logit"
            value={shift}
            display={shift >= 0 ? `+${f2(shift)}` : f2(shift)}
            min={-6}
            max={6}
            step={0.5}
            hint="Property 4: softmax(z) = softmax(z + c). Watch the probabilities refuse to move."
            onChange={setShift}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((k) => (
              <div key={k} className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3 font-mono text-[12px]/[1.7]">
                <div className="text-zinc-500">step 1</div>
                <div>
                  e^{f2(zz[k])} = {exps[k].toFixed(4)}
                </div>
                <div className="mt-1 text-zinc-500">step 3</div>
                <div style={{ color: CLASS_TONES[k] }}>
                  {exps[k].toFixed(3)} / {sum.toFixed(3)} = <strong>{f3(p[k])}</strong>
                </div>
              </div>
            ))}
          </div>
          <ProbBars p={p} mark={argmax(p)} />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Step 2 — the total" value={sum.toFixed(4)} note="Σⱼ e^{zⱼ}, the normaliser" tone={INDIGO} />
          <ReadOutGrid
            items={[
              { label: 'ŷ₁', value: f3(p[0]) },
              { label: 'ŷ₂', value: f3(p[1]) },
              { label: 'ŷ₃', value: f3(p[2]) },
              { label: 'they sum to', value: f4(p.reduce((a, b) => a + b, 0)) },
            ]}
          />
          <Verdict ok>
            Predicted class {argmax(p) + 1} — the arg max of the probabilities, which is always the arg max of the
            logits too, because e^z is increasing. Property 3 on slide 58: softmax preserves order.
          </Verdict>
          <PanelNote>
            Why exponentiate at all? Because logits can be negative and probabilities cannot. e^z is positive for every
            z, so dividing by the total is guaranteed to give numbers in (0, 1) — and never exactly 0 or 1, which is
            what keeps the log in the loss finite.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn
              onClick={() => {
                setZ([2.0, 1.0, 0.1])
                setShift(0)
              }}
            >
              The deck’s example
            </Btn>
            <Btn
              onClick={() => {
                setZ([0, 0, 0])
                setShift(0)
              }}
            >
              All equal
            </Btn>
            <Btn
              onClick={() => {
                setZ([4, 0, -4])
                setShift(0)
              }}
            >
              Very sure
            </Btn>
          </div>
          <PanelNote>
            Press “all equal”: three identical logits give exactly 1/3 each, which is what an untrained model with W = 0
            says about everything. That is the multi-class version of the 0.5 the binary half started from.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 20 — the forward pass and categorical cross-entropy (slides 60–63)         */
/* ========================================================================== */

/** Slide 62's four rows, with the deck's own losses to check against. */
const CE_ROWS = [
  { name: 'Good', y1: 0.1, y2: 0.8 },
  { name: 'Medium', y1: 0.3, y2: 0.5 },
  { name: 'Bad', y1: 0.7, y2: 0.2 },
  { name: 'Very bad', y1: 0.9, y2: 0.05 },
]

export function CatCeLab() {
  const [ptrue, setPtrue] = useState(0.8)
  const loss = -Math.log(Math.max(ptrue, 1e-12))
  // The other two classes share whatever is left, so the row still sums to 1.
  const rest = (1 - ptrue) / 2
  const p = [rest, ptrue, rest]
  const y = [0, 1, 0]

  function draw(g: CanvasRenderingContext2D, W: number, H: number, ctx: { disp: Record<string, number> }) {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 1,
      ymin: 0,
      ymax: 4,
      xlab: 'ŷ on the true class',
      ylab: 'loss = −log ŷ',
    })
    const t = ctx.disp.p ?? ptrue
    g.strokeStyle = TEAL
    g.lineWidth = 2.75
    g.beginPath()
    let started = false
    for (let px = f.L + 1; px <= f.R; px += 2) {
      const v = -Math.log(f.ux(px))
      if (v > 4) {
        started = false
        continue
      }
      started ? g.lineTo(px, f.py(v)) : g.moveTo(px, f.py(v))
      started = true
    }
    g.stroke()

    CE_ROWS.forEach((r) => {
      const v = -Math.log(r.y2)
      dot(g, f.px(r.y2), f.py(Math.min(4, v)), 4.5, 'rgba(79,70,229,0.55)')
      g.fillStyle = 'rgba(79,70,229,0.8)'
      g.textAlign = 'center'
      g.fillText(r.name, f.px(r.y2), f.py(Math.min(4, v)) - 12)
    })
    grip(g, f.px(t), f.py(Math.min(4, -Math.log(t))), TEAL, 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Categorical cross-entropy reads exactly one number: the probability the model gave the <em>true</em> class. Drag
        the marker down the curve and watch the loss climb. The four blue dots are slide 62’s own rows, and the marker
        lands on each of them at 0.8, 0.5, 0.2 and 0.05.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <ChartCanvas
            height={300}
            draw={draw}
            targets={{ p: ptrue }}
            candidates={() => []}
            tooltip={() => null}
            handles={(f: Frame) => [
              {
                id: 'p',
                px: f.px(ptrue),
                py: f.py(Math.min(4, -Math.log(ptrue))),
                grab: 'anywhere',
                label: 'the probability on the true class',
              },
            ]}
            onDragTo={(_id, x) => setPtrue(clamp(Math.round(x * 100) / 100, 0.01, 0.99))}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              True class is 2, so y = [0, 1, 0]
            </div>
            <ProbBars p={p} mark={1} />
            <div className="mt-3 font-mono text-[12px]/[1.8] text-zinc-700">
              <div>ℓ = −(0·log ŷ₁ + 1·log ŷ₂ + 0·log ŷ₃)</div>
              <div>
                = −log({f2(ptrue)}) = <strong>{f3(loss)}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Loss"
            value={f3(loss)}
            note={`ŷ on the true class = ${f2(ptrue)}`}
            tone={loss > 1 ? RED : TEAL}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <TRow head cells={['prediction', 'ŷ₂', '−log ŷ₂']} />
            {CE_ROWS.map((r) => (
              <TRow key={r.name} cells={[r.name, f2(r.y2), (-Math.log(r.y2)).toFixed(2)]} />
            ))}
          </div>
          <PanelNote>
            The two zero terms are not ignored — they are multiplied by zero. That is what one-hot buys: the sum over K
            classes collapses to a single −log ŷ for whichever class was right, and nothing has to branch on the label.
          </PanelNote>
          <PanelNote>
            With K = 2 this is the binary loss again. Put y = [1 − y, y] and ŷ = [1 − ŷ, ŷ] into −Σ yₖ log ŷₖ and you
            get −[y log ŷ + (1 − y) log(1 − ŷ)] back, exactly as slide 63 claims.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            {CE_ROWS.map((r) => (
              <Btn key={r.name} onClick={() => setPtrue(r.y2)}>
                {r.name}
              </Btn>
            ))}
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 21 — batch, iteration, epoch (slides 65–67)                                */
/* ========================================================================== */

export function MiniBatchLab() {
  const [N, setN] = useState(60000)
  const [B, setB] = useState(128)
  const [epochs, setEpochs] = useState(10)
  const perEpoch = Math.ceil(N / B)
  const total = perEpoch * epochs
  const lastBatch = N % B === 0 ? B : N % B

  return (
    <LabBox>
      <LabNote>
        Three words that get mixed up in exams, and one formula that separates them. An <strong>iteration</strong> is
        one weight update; an <strong>epoch</strong> is one full pass over the data; the batch size decides how many of
        the first fit into the second. The sliders open on slide 67’s own numbers.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <Slider
            label="N — training examples"
            value={N}
            display={N.toLocaleString('en-GB')}
            min={100}
            max={100000}
            step={100}
            hint="MNIST has 60 000."
            onChange={(v) => setN(Math.round(v))}
          />
          <Slider
            label="B — batch size"
            value={B}
            display={String(B)}
            min={1}
            max={1024}
            step={1}
            hint="Powers of 2 are conventional; the deck suggests 32 to 512."
            onChange={(v) => setB(Math.round(v))}
          />
          <Slider
            label="T — epochs"
            value={epochs}
            display={String(epochs)}
            min={1}
            max={100}
            step={1}
            hint="The deck suggests 10 to 100."
            onChange={(v) => setEpochs(Math.round(v))}
          />
          <div className="flex flex-wrap gap-2">
            <Btn
              onClick={() => {
                setN(60000)
                setB(128)
                setEpochs(10)
              }}
            >
              Slide 67’s example
            </Btn>
            <Btn onClick={() => setB(1)}>B = 1, plain SGD</Btn>
            <Btn onClick={() => setB(N)}>B = N, batch GD</Btn>
          </div>
          <Mono>
            <div>iterations per epoch = ⌈N / B⌉</div>
            <div>
              = ⌈{N.toLocaleString('en-GB')} / {B}⌉ = <strong>{perEpoch.toLocaleString('en-GB')}</strong>
            </div>
            <div className="mt-1">
              after {epochs} epochs: {perEpoch.toLocaleString('en-GB')} × {epochs} ={' '}
              <strong>{total.toLocaleString('en-GB')}</strong> weight updates
            </div>
          </Mono>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Updates per epoch"
            value={perEpoch.toLocaleString('en-GB')}
            note={`total ${total.toLocaleString('en-GB')}`}
            tone={INDIGO}
          />
          <ReadOutGrid
            items={[
              { label: 'examples seen', value: (N * epochs).toLocaleString('en-GB') },
              { label: 'per update', value: String(B) },
              { label: 'last batch has', value: String(lastBatch) },
              { label: 'kind', value: B === 1 ? 'SGD' : B >= N ? 'batch GD' : 'mini-batch' },
            ]}
          />
          <Verdict ok={B > 1 && B < N}>
            {B === 1
              ? 'B = 1 is plain SGD: the most updates possible, and the noisiest gradient of all.'
              : B >= N
                ? 'B = N is batch gradient descent: one update per epoch, using the exact gradient.'
                : 'Mini-batch — the middle ground everything in modern deep learning actually uses.'}
          </Verdict>
          <PanelNote>
            The number of examples seen is the same however you set B. What changes is how often the weights are allowed
            to move — and therefore how much progress one pass over the data buys.
          </PanelNote>
          <PanelNote>
            The ceiling matters: unless B divides N exactly, the final batch of each epoch is short. Averaging its
            gradient over its own true size, rather than over B, is a real and easily missed bug.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 22 — the mini-batch gradient and the update (slides 68–71)                 */
/* ========================================================================== */

export function MbGradLab() {
  const [cell, setCell] = useState<[number, number] | null>([0, 0])
  const XB = MC_X.slice(0, 2)
  const YB = MC_Y.slice(0, 2)
  const B = XB.length
  const ZB = XB.map((x) => logits(MC_W0, x))
  const YH = ZB.map(softmax)
  const E = YH.map((r, i) => r.map((v, k) => v - YB[i][k]))
  const G = MC_W0.map((_, j) => E[0].map((_, k) => XB.reduce((s, x, i) => s + x[j] * E[i][k], 0) / B))

  const explain = cell
    ? XB.map((x, i) => `${x[cell[0]]} × ${E[i][cell[1]].toFixed(3)}`).join('  +  ') +
      `  =  ${XB.reduce((s, x, i) => s + x[cell[0]] * E[i][cell[1]], 0).toFixed(3)},  ÷ B = ${G[cell[0]][cell[1]].toFixed(3)}`
    : ''

  return (
    <LabBox>
      <LabNote>
        ∇J = (1/B)X<sub>B</sub>ᵀ(Ŷ<sub>B</sub> − Y<sub>B</sub>), slide 68, on the deck’s own first mini-batch. Press any
        entry of the gradient and the sum that produced it is written out underneath — that is all a matrix product is.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-start gap-4">
            <MatBox m={XB} title="X_B" note="B × (d + 1)" mark={cell ? [0, cell[0]] : undefined} />
            <MatBox m={E} title="Ŷ_B − Y_B" note="the errors, B × K" mark={cell ? [0, cell[1]] : undefined} />
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              ∇J — press an entry
            </div>
            <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
              {G.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setCell([i, j])}
                      className="w-[70px] cursor-pointer rounded px-2 py-1.5 text-right font-mono text-[12.5px] tabular-nums hover:bg-zinc-950/[0.04]"
                      style={
                        cell?.[0] === i && cell?.[1] === j
                          ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                          : undefined
                      }
                    >
                      {v.toFixed(3)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {cell && (
            <Mono>
              <div className="text-zinc-500">
                ∇J[{cell[0]}][{cell[1]}] — column {cell[0]} of X_B against column {cell[1]} of the errors
              </div>
              <div>{explain}</div>
            </Mono>
          )}
          <MatBox
            m={MC_W0.map((row, i) => row.map((v, j) => v - MC_ETA * G[i][j]))}
            title="W after one update"
            note="W ← W − η∇J, with η = 0.1"
          />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Batch size B" value={String(B)} note="two examples, so ÷ 2" tone={INDIGO} />
          <ReadOutGrid
            items={[
              { label: 'shape of ∇J', value: `${G.length} × ${G[0].length}` },
              { label: 'shape of W', value: `${MC_W0.length} × ${MC_W0[0].length}` },
              { label: 'J on this batch', value: f4(YH.reduce((s, r, i) => s + catLoss(r, YB[i]), 0) / B) },
              { label: 'η', value: String(MC_ETA) },
            ]}
          />
          <Verdict ok>
            ∇J has exactly the shape of W, which is the check to run in an exam before going any further. X_Bᵀ is (d +
            1) × B, the error block is B × K, so the product is (d + 1) × K — one number per weight.
          </Verdict>
          <PanelNote>
            The 1/B is what makes the step size independent of the batch size. Leave it out and doubling B doubles every
            gradient, which silently doubles the learning rate as well — one of the quieter ways a training run goes
            wrong.
          </PanelNote>
          <PanelNote>
            Notice the error block does all the work: X only decides how each example’s error is shared out between the
            weights. It is the same (ŷ − y)x as the binary case, stacked.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 23 — the multi-class worked example (slides 73–79)                         */
/* ========================================================================== */

/** What slides 75–78 print, so the page can compare rather than assert. */
const DECK_Z = [
  [0.1, 0.4, 0.3],
  [0.4, 0.2, 0.1],
]
const DECK_YH = [
  [0.28, 0.378, 0.342],
  [0.387, 0.315, 0.298],
]
const DECK_GRAD = [
  [-0.167, -0.154, 0.32],
  [-0.024, -0.496, 0.469],
  [-0.527, 0.036, 0.491],
]

const MC_STAGES = [
  'Set up — X, the one-hot Y, W⁽⁰⁾, B = 2 and η = 0.1',
  'Step 1 — the logits:  Z_B = X_B W⁽⁰⁾',
  'Step 2 — softmax, row by row:  Ŷ_B',
  'Step 3 — the gradient:  ∇J = (1/B) X_Bᵀ(Ŷ_B − Y_B)',
  'Step 4 — the update:  W⁽¹⁾ = W⁽⁰⁾ − η∇J',
]

export function McWorkedLab() {
  const [at, setAt] = useState(0)
  const [compare, setCompare] = useState(false)

  const XB = MC_X.slice(0, 2)
  const YB = MC_Y.slice(0, 2)
  const ZB = XB.map((x) => logits(MC_W0, x))
  const YH = ZB.map(softmax)
  const E = YH.map((r, i) => r.map((v, k) => v - YB[i][k]))
  const G = MC_W0.map((_, j) => E[0].map((_, k) => XB.reduce((s, x, i) => s + x[j] * E[i][k], 0) / 2))
  const W1 = MC_W0.map((row, i) => row.map((v, j) => v - MC_ETA * G[i][j]))

  return (
    <LabBox>
      <LabNote>
        Slides 73 to 78, one press at a time. Every number is computed here from the deck’s X, Y, W⁽⁰⁾, B and η —
        nothing is copied off the slide. Turn on the comparison to put the printed values beside the computed ones.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--acc)' }}>
            {MC_STAGES[at]}
          </div>
          {at === 0 && (
            <div className="flex flex-wrap items-start gap-4">
              <MatBox m={MC_X} title="X" note="4 × 3, bias column first" />
              <MatBox m={MC_Y} title="Y" note={`one-hot: classes ${MC_CLASS.join(', ')}`} />
              <MatBox m={MC_W0} title="W⁽⁰⁾" note="3 × 3" />
            </div>
          )}
          {at >= 1 && (
            <div className="flex flex-wrap items-start gap-4">
              <MatBox m={XB} title="X_B" note="the first two rows" />
              {at >= 1 && <MatBox m={ZB} title="Z_B = X_B W⁽⁰⁾" note="computed here" />}
              {compare && at >= 1 && <MatBox m={DECK_Z} title="Z_B as printed" note="slide 75" />}
            </div>
          )}
          {at >= 2 && (
            <div className="flex flex-wrap items-start gap-4">
              <MatBox m={YH} title="Ŷ_B = softmax(Z_B)" note="computed here" />
              {compare && <MatBox m={DECK_YH} title="Ŷ_B as printed" note="slide 76" />}
            </div>
          )}
          {at >= 3 && (
            <div className="flex flex-wrap items-start gap-4">
              <MatBox m={E} title="Ŷ_B − Y_B" note="the errors" />
              <MatBox m={G} title="∇J" note="computed here" />
              {compare && <MatBox m={DECK_GRAD} title="∇J as printed" note="slide 77" />}
            </div>
          )}
          {at >= 4 && (
            <div className="flex flex-wrap items-start gap-4">
              <MatBox m={W1} title="W⁽¹⁾" note="computed here" />
              <MatBox
                m={MC_W0.map((row, i) => row.map((v, j) => v - MC_ETA * DECK_GRAD[i][j]))}
                title="W⁽¹⁾ from the printed ∇J"
                note="slide 78"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setAt((s) => Math.min(4, s + 1))} disabled={at >= 4}>
              Next step
            </Btn>
            <Btn onClick={() => setAt(0)}>Start again</Btn>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip on={compare} label="Show the deck’s printed values" onClick={() => setCompare(!compare)} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'batch loss', value: f4(YH.reduce((s, r, i) => s + catLoss(r, YB[i]), 0) / 2) },
              { label: 'B', value: '2' },
              { label: 'η', value: '0.1' },
              { label: 'batches left', value: '1' },
            ]}
          />
          {at >= 2 && (
            <Verdict ok={false}>
              Three printed numbers do not follow from the deck’s own inputs. Row 2 of Z_B should be [0.400, 0.300,
              0.100], not [0.4, 0.2, 0.1] — check it: [1, 2, 1] against column 2 of W⁽⁰⁾ is −0.1 + 0.2 + 0.2 = 0.3. Ŷ_B
              row 2 then becomes [0.378, 0.342, 0.280]. And ∇J[1][0] is +0.018 rather than −0.024; even from the deck’s
              own Ŷ_B it would be +0.027, so the sign is wrong either way. The other fifteen entries agree to three
              decimal places.
            </Verdict>
          )}
          <PanelNote>
            Softmax of [0.4, 0.3, 0.1] is the same three numbers as softmax of [0.1, 0.4, 0.3], just moved around —
            those two logit rows are permutations of each other. That is a quick way to check row 2 without a
            calculator.
          </PanelNote>
          <PanelNote>
            The method is not in doubt, and it is the method the exam asks for: logits, softmax, subtract the one-hot
            labels, multiply by X_Bᵀ, divide by B, step. Only three arithmetic slips are.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 24 — inference (slides 81–82)                                              */
/* ========================================================================== */

export function InferenceLab() {
  const [z, setZ] = useState([1.2, 2.5, 0.8])
  const p = softmax(z)
  const k = argmax(p)
  const sorted = [...p].sort((a, b) => b - a)
  const margin = sorted[0] - sorted[1]
  const setZk = (i: number, v: number) => setZ((old) => old.map((c, ci) => (ci === i ? v : c)))

  return (
    <LabBox>
      <LabNote>
        Slide 82’s example, live: a trained model, a new input, and the three steps that turn it into an answer. It
        opens on the deck’s z = [1.2, 2.5, 0.8] and reproduces its 68.7%. Then pull the logits together and watch the
        confidence collapse while the answer stays the same.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {z.map((v, i) => (
              <Slider
                key={i}
                label={`z${i + 1}`}
                value={v}
                display={f2(v)}
                min={-3}
                max={5}
                step={0.1}
                hint={`wᵀ for class ${i + 1}, times the new x.`}
                onChange={(nv) => setZk(i, nv)}
              />
            ))}
          </div>
          <Mono>
            <div>step 1 z = Wᵀx_new = [{z.map((v) => f2(v)).join(', ')}]ᵀ</div>
            <div>step 2 ŷ = softmax(z) = [{p.map((v) => f3(v)).join(', ')}]ᵀ</div>
            <div style={{ color: CLASS_TONES[k] }}>step 3 k̂ = arg maxₖ ŷₖ = {k + 1}</div>
          </Mono>
          <ProbBars p={p} mark={k} />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Answer"
            value={`class ${k + 1}`}
            note={`${(p[k] * 100).toFixed(1)}% confidence`}
            tone={CLASS_TONES[k]}
          />
          <ReadOutGrid
            items={[
              { label: 'runner-up gap', value: f3(margin) },
              { label: 'sum of ŷ', value: f4(p.reduce((a, b) => a + b, 0)) },
              { label: 'lowest possible', value: f3(1 / 3) },
              { label: 'loss if right', value: f3(-Math.log(p[k])) },
            ]}
          />
          <Verdict ok={margin > 0.1}>
            {margin > 0.1
              ? 'A clear winner: the top probability is well ahead of the second.'
              : 'Too close to call. The arg max still returns an answer, and it would be reckless to act on it — this is what a confidence score is for.'}
          </Verdict>
          <PanelNote>
            Arg max never abstains. It returns a class even when the three probabilities are 0.34, 0.33 and 0.33, so a
            deployed system usually adds a rule of its own: answer only if the top probability clears some bar, and
            otherwise pass the case to a person.
          </PanelNote>
          <PanelNote>
            For the answer alone you never need the softmax at all — arg max of the logits gives the same class, because
            the exponential preserves order. You need it for the confidence, and for training.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setZ([1.2, 2.5, 0.8])}>Slide 82</Btn>
            <Btn onClick={() => setZ([1.2, 1.3, 1.25])}>Barely sure</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 25 — multi-class metrics (slides 84–88)                                    */
/* ========================================================================== */

/** Slide 85's own matrix, so the 84.7% on the slide can be reproduced. */
const DECK_CM = [
  [45, 3, 2],
  [5, 38, 7],
  [2, 4, 44],
]

export function McMetricsLab() {
  const [cm, setCm] = useState(DECK_CM.map((r) => [...r]))
  const [avg, setAvg] = useState<'macro' | 'weighted'>('macro')

  const total = cm.flat().reduce((a, b) => a + b, 0)
  const correct = cm.reduce((s, r, i) => s + r[i], 0)
  const acc = total ? correct / total : NaN
  const per = cm.map((row, k) => {
    const TP = cm[k][k]
    const FN = row.reduce((a, b) => a + b, 0) - TP
    const FP = cm.reduce((a, r) => a + r[k], 0) - TP
    const prec = TP + FP ? TP / (TP + FP) : NaN
    const rec = TP + FN ? TP / (TP + FN) : NaN
    const f1 = Number.isFinite(prec) && Number.isFinite(rec) && prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : NaN
    return { TP, FP, FN, prec, rec, f1, n: row.reduce((a, b) => a + b, 0) }
  })
  const mean = (pick: (r: (typeof per)[number]) => number) => {
    const vals = per.map(pick)
    if (vals.some((v) => !Number.isFinite(v))) return NaN
    return avg === 'macro'
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : vals.reduce((a, v, i) => a + (v * per[i].n) / total, 0)
  }
  const show = (v: number) => (Number.isFinite(v) ? f3(v) : '—')

  return (
    <LabBox>
      <LabNote>
        Slide 85’s 3 × 3 matrix, and every number on slides 84 to 87 read off it. The diagonal is what the model got
        right; a row is what a class really was; a column is what the model said. Type into any cell — the counts do not
        have to stay balanced.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              rows = actual class, columns = predicted class
            </div>
            <NumBox
              m={cm}
              onEdit={(i, j, v) =>
                setCm((old) =>
                  old.map((r, ri) => (ri === i ? r.map((c, ci) => (ci === j ? Math.max(0, Math.round(v)) : c)) : r))
                )
              }
              name="confusion matrix"
            />
          </div>
          <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3">
            <TRow head cells={['class', 'TP', 'FP', 'FN', 'precision', 'recall', 'F1']} />
            {per.map((r, k) => (
              <TRow
                key={k}
                cells={[String(k + 1), String(r.TP), String(r.FP), String(r.FN), show(r.prec), show(r.rec), show(r.f1)]}
                tone={CLASS_TONES[k]}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip on={avg === 'macro'} label="macro-average" onClick={() => setAvg('macro')} />
            <Chip on={avg === 'weighted'} label="weighted average" onClick={() => setAvg('weighted')} />
            <Btn onClick={() => setCm(DECK_CM.map((r) => [...r]))}>Slide 85’s matrix</Btn>
            <Btn
              onClick={() =>
                setCm([
                  [90, 5, 5],
                  [3, 2, 0],
                  [4, 0, 1],
                ])
              }
            >
              A badly imbalanced set
            </Btn>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="Accuracy" value={show(acc)} note={`${correct} of ${total} on the diagonal`} tone={TEAL} />
          <ReadOutGrid
            items={[
              { label: `precision (${avg})`, value: show(mean((r) => r.prec)) },
              { label: `recall (${avg})`, value: show(mean((r) => r.rec)) },
              { label: `F1 (${avg})`, value: show(mean((r) => r.f1)) },
              { label: 'classes', value: '3' },
            ]}
          />
          <PanelNote>
            Macro treats the three classes as equally important; weighted multiplies each by how common it is. On slide
            85’s matrix the two barely differ, because the classes are the same size — 50 each. Press the imbalanced
            preset and they come apart sharply.
          </PanelNote>
          <PanelNote>
            Each class is scored one-vs-all: for class k, everything in row k that is not on the diagonal is a missed
            positive, and everything in column k that is not on the diagonal is a false alarm. The same four counts as
            the binary case, read off in two directions.
          </PanelNote>
          <PanelNote>
            Top-K accuracy, slide 88, is the same idea loosened: count it right if the true class is anywhere in the
            model’s top K guesses. It cannot be read off a confusion matrix at all, because the matrix has already
            thrown away everything but the winner.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 26 — numerical stability (slide 91)                                        */
/* ========================================================================== */

export function StabilityLab() {
  const [mag, setMag] = useState(2)
  const z = [mag, mag - 1, mag - 2]
  const naive = softmaxNaive(z)
  const stable = softmax(z)
  const broke = naive.some((v) => !Number.isFinite(v))
  const raw = z.map((v) => Math.exp(v))
  const fmt = (v: number) => (Number.isFinite(v) ? (v > 1e6 ? v.toExponential(2) : v.toFixed(4)) : String(v))

  return (
    <LabBox>
      <LabNote>
        The two versions of softmax on slide 91, side by side on the same logits. The three scores keep the same gaps
        the whole way — only their size changes — so the right answer never moves. Slide the magnitude up and watch one
        of the two implementations stop working.
      </LabNote>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-4">
          <Slider
            label="How large the logits are"
            value={mag}
            display={f2(mag)}
            min={-1000}
            max={1000}
            step={10}
            hint="z = [m, m − 1, m − 2]. The differences never change, so the answer should not either."
            onChange={setMag}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-lg border p-3.5"
              style={{
                borderColor: broke ? 'rgba(220,38,38,0.4)' : 'rgba(9,9,11,0.1)',
                background: broke ? 'rgba(220,38,38,0.05)' : '#fafafa',
              }}
            >
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                naive: e^zₖ / Σ e^zⱼ
              </div>
              <div className="font-mono text-[11.5px]/[1.8] text-zinc-600">
                {raw.map((v, k) => (
                  <div key={k}>
                    e^{f2(z[k])} = {fmt(v)}
                  </div>
                ))}
              </div>
              <div className="mt-2 font-mono text-[13px] font-semibold" style={{ color: broke ? RED : '#09090b' }}>
                [{naive.map((v) => (Number.isFinite(v) ? f3(v) : 'NaN')).join(', ')}]
              </div>
            </div>
            <div
              className="rounded-lg border p-3.5"
              style={{ borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.06)' }}
            >
              <div
                className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase"
                style={{ color: '#0f766e' }}
              >
                stable: subtract c = maxₖ zₖ first
              </div>
              <div className="font-mono text-[11.5px]/[1.8] text-zinc-600">
                {z.map((v, k) => (
                  <div key={k}>
                    e^({f2(v)} − {f2(Math.max(...z))}) = {fmt(Math.exp(v - Math.max(...z)))}
                  </div>
                ))}
              </div>
              <div className="mt-2 font-mono text-[13px] font-semibold" style={{ color: '#0f766e' }}>
                [{stable.map((v) => f3(v)).join(', ')}]
              </div>
            </div>
          </div>
          <ProbBars p={stable} mark={argmax(stable)} />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Naive version"
            value={broke ? 'NaN' : f3(naive[0])}
            note={broke ? 'overflowed or underflowed' : 'still fine'}
            tone={broke ? RED : TEAL}
          />
          <Verdict ok={!broke}>
            {broke
              ? mag > 0
                ? 'e^z has overflowed to Infinity, and Infinity ÷ Infinity is NaN. The logits are perfectly ordinary numbers — it is only the exponential that cannot hold them.'
                : 'Every e^z has underflowed to 0, so the sum is 0 and every probability is 0 ÷ 0.'
              : 'Both versions agree here. Note they agree exactly, not approximately: subtracting the max is not a numerical fudge, it is property 4 of slide 58.'}
          </Verdict>
          <ReadOutGrid
            items={[
              { label: 'max logit', value: f2(Math.max(...z)) },
              { label: 'largest exp', value: fmt(Math.max(...raw)) },
              { label: 'stable max', value: '1.0000' },
              { label: 'stable sums to', value: f4(stable.reduce((a, b) => a + b, 0)) },
            ]}
          />
          <PanelNote>
            After subtracting the largest logit, the biggest exponent is e⁰ = 1 and the rest are smaller. The sum is
            therefore between 1 and K, and nothing can overflow — for any logits at all, however a badly scaled feature
            produced them.
          </PanelNote>
          <PanelNote>
            The same reasoning gives log(σ(z)) rather than log of the sigmoid’s output, and the log-sum-exp trick for
            the loss. All three are the same move: rearrange so the exponential never sees a large positive number.
          </PanelNote>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setMag(2)}>Ordinary</Btn>
            <Btn onClick={() => setMag(1000)}>Huge</Btn>
            <Btn onClick={() => setMag(-1000)}>Tiny</Btn>
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 27 — the debugging checklist (slide 92)                                    */
/* ========================================================================== */

const SYMPTOMS = [
  {
    id: 'nan',
    name: 'The loss becomes NaN or Inf',
    causes: ['η is too large', 'log(0) in the loss', 'features not scaled', 'the naive softmax overflowed'],
    decoys: ['too many epochs', 'the test set is too small'],
    fix: 'Decrease η, scale the features, and use the stable softmax with the max subtracted. A log(0) means a probability reached exactly 0 or 1, which the stable version prevents.',
  },
  {
    id: 'same',
    name: 'It predicts the same class for everything',
    causes: [
      'the classes are badly imbalanced',
      'a bug in the softmax or the loss',
      'η is too small',
      'the one-hot encoding is wrong',
    ],
    decoys: ['η is too large', 'the batch size is too large'],
    fix: 'Check the class balance first — predicting the majority class is what a model does when it has learnt nothing useful. Then verify the encoding and that the loss is reading the true class.',
  },
  {
    id: 'osc',
    name: 'The loss goes up and down instead of settling',
    causes: ['η is too large', 'the batches are too small'],
    decoys: ['the features are one-hot encoded', 'not enough epochs', 'the model is too simple'],
    fix: 'Decrease η, use larger mini-batches so the gradient is less noisy, or decay the learning rate as training goes on.',
  },
  {
    id: 'flat',
    name: 'The loss barely moves at all',
    causes: ['η is too small', 'a wrong sign in the gradient', 'features not scaled', 'the data is not being shuffled'],
    decoys: ['the softmax is stable', 'the classes are balanced'],
    fix: 'Increase η first, since that is the cheapest thing to test. Then check the gradient by hand on one example — a plus where the update should subtract looks exactly like this.',
  },
  {
    id: 'sum',
    name: 'The softmax outputs do not add up to 1',
    causes: ['an implementation bug', 'floating-point precision'],
    decoys: ['η is too large', 'overfitting', 'the classes are imbalanced'],
    fix: 'This is always code, never data. Normalising over the wrong axis of the matrix is the usual culprit; use the stable softmax and check the sum along each row.',
  },
  {
    id: 'gap',
    name: 'Training accuracy is high, test accuracy is low',
    causes: ['overfitting'],
    decoys: ['η is too large', 'log(0) in the loss', 'the data is not shuffled', 'the softmax is unstable'],
    fix: 'Add regularisation, get more training data, or use a simpler model. Note this is the only symptom on the slide that is not an optimisation problem — the training run itself went fine.',
  },
]

export function DebugLab() {
  const [pick, setPick] = useState('nan')
  const [chosen, setChosen] = useState<string[]>([])
  const s = SYMPTOMS.find((x) => x.id === pick)!
  const options = [...s.causes, ...s.decoys].sort()
  const right = chosen.length > 0 && chosen.every((c) => s.causes.includes(c))
  const complete = right && chosen.length === s.causes.length

  return (
    <LabBox>
      <LabNote>
        Slide 92’s checklist, as a diagnosis. Pick a symptom, then choose every cause the slide gives for it — some of
        the options below belong to a different symptom entirely. Nothing is marked until you have chosen at least one.
      </LabNote>
      <Presets
        items={SYMPTOMS.map((x) => ({ id: x.id, label: x.name }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setChosen([])
        }}
      />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Which of these cause it?
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <Chip
                key={o}
                on={chosen.includes(o)}
                label={o}
                onClick={() => setChosen((c) => (c.includes(o) ? c.filter((x) => x !== o) : [...c, o]))}
              />
            ))}
          </div>
          {chosen.length > 0 && (
            <Verdict ok={complete}>
              {complete
                ? `All ${s.causes.length} of the slide's causes, and nothing that does not belong.`
                : right
                  ? `Right so far — the slide gives ${s.causes.length} causes for this one and you have ${chosen.length}.`
                  : `At least one of those belongs to a different symptom: ${chosen.filter((c) => !s.causes.includes(c)).join(', ')}.`}
            </Verdict>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Found"
            value={`${chosen.filter((c) => s.causes.includes(c)).length} of ${s.causes.length}`}
            tone={complete ? TEAL : GREY}
          />
          {complete && <PanelNote>{s.fix}</PanelNote>}
          <PanelNote>
            The order to work in: look at the <strong>training</strong> loss on its own first. Five of these six
            symptoms are optimisation problems and show up there. Only once the training loss falls smoothly does the
            gap to the test score mean anything.
          </PanelNote>
          <PanelNote>
            The slide’s sanity checks are worth doing before any of this: train on a tiny dataset and demand 100%
            accuracy, check every ŷ is in [0, 1], check each row of Ŷ sums to 1, and print the confusion matrix rather
            than one accuracy number.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 28 — the comparison tables (slides 94–97)                                  */
/* ========================================================================== */

const TASK_ROWS = [
  {
    id: 'reg',
    label: 'Regression',
    rows: {
      Output: 'a continuous y ∈ ℝ',
      Activation: 'identity, f(z) = z',
      'Loss function': 'mean squared error',
      'Output range': '(−∞, ∞)',
      Interpretation: 'the predicted value itself',
      'Output neurons': '1',
      Weights: 'a vector w ∈ ℝᵈ⁺¹',
      Evaluation: 'MSE, RMSE, R²',
      Learning: 'batch GD or SGD',
      Examples: 'house prices, temperature',
    },
  },
  {
    id: 'bin',
    label: 'Binary classification',
    rows: {
      Output: 'a discrete y ∈ {0, 1}',
      Activation: 'sigmoid, σ(z)',
      'Loss function': 'binary cross-entropy',
      'Output range': '[0, 1]',
      Interpretation: 'P(y = 1 | x)',
      'Output neurons': '1',
      Weights: 'a vector w ∈ ℝᵈ⁺¹',
      Evaluation: 'accuracy, precision, recall, F1',
      Learning: 'SGD or mini-batch',
      Examples: 'spam detection, diagnosis',
    },
  },
  {
    id: 'multi',
    label: 'Multi-class classification',
    rows: {
      Output: 'a discrete y ∈ {1, …, K}',
      Activation: 'softmax, SM(z)',
      'Loss function': 'categorical cross-entropy',
      'Output range': '[0, 1]ᴷ, summing to 1',
      Interpretation: 'P(y = k | x) for every k',
      'Output neurons': 'K',
      Weights: 'a matrix W ∈ ℝ⁽ᵈ⁺¹⁾ˣᴷ',
      Evaluation: 'confusion matrix, top-K',
      Learning: 'mini-batch SGD',
      Examples: 'digit recognition, ImageNet',
    },
  },
]

const ROW_KEYS = Object.keys(TASK_ROWS[0].rows) as Array<keyof (typeof TASK_ROWS)[0]['rows']>

export function CompareLab() {
  const [at, setAt] = useState('bin')
  const [row, setRow] = useState<string | null>('Activation')
  const t = TASK_ROWS.find((x) => x.id === at)!

  return (
    <LabBox>
      <LabNote>
        Slide 97’s table, one column at a time, with slides 94 to 96 folded in. Press a task to switch column, and press
        any row to compare that one line across all three at once. Everything else in the three models is identical —
        which is the point the whole session has been building to.
      </LabNote>
      <Presets items={TASK_ROWS.map((x) => ({ id: x.id, label: x.label }))} at={at} onPick={setAt} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-2">
          {ROW_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setRow(row === k ? null : k)}
              className="flex w-full cursor-pointer items-baseline justify-between gap-3 rounded border-b border-zinc-950/[0.06] px-2.5 py-2 text-left last:border-0 hover:bg-zinc-950/[0.02]"
              style={row === k ? { background: 'var(--acc-12)' } : undefined}
            >
              <span className="text-[12px] font-semibold text-zinc-600">{k}</span>
              <span className="text-right font-mono text-[12.5px] text-zinc-950">{t.rows[k]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          {row ? (
            <>
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                {row}, across all three
              </div>
              {TASK_ROWS.map((x, i) => (
                <div key={x.id} className="rounded-lg border border-zinc-950/10 bg-white p-3">
                  <div className="text-[11px] font-semibold" style={{ color: CLASS_TONES[i] }}>
                    {x.label}
                  </div>
                  <div className="font-mono text-[12.5px] text-zinc-800">{x.rows[row as keyof typeof x.rows]}</div>
                </div>
              ))}
            </>
          ) : (
            <PanelNote>Press a row to compare it across the three tasks.</PanelNote>
          )}
          <PanelNote>
            Only three lines actually change: the activation, the loss and the number of output neurons. The weighted
            sum, the gradient descent loop, the design matrix and the train/test split are the same in all three
            columns.
          </PanelNote>
          <PanelNote>
            The activation and the loss are chosen together, not separately. Sigmoid with binary cross-entropy, and
            softmax with categorical cross-entropy, are the pairs whose derivatives cancel to leave ŷ − y — which is why
            every framework offers them as a single fused operation.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
