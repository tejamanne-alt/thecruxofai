'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, dot, drawAxes, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* The learning algorithm, run on a gate in the deck's own encoding           */
/* ========================================================================== */

const GATES: Record<string, { name: string; rows: Array<[number, number, number]> }> = {
  and: {
    name: 'AND',
    rows: [
      [0, 0, 0],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  or: {
    name: 'OR',
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
  },
  nand: {
    name: 'NAND',
    rows: [
      [0, 0, 1],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
  },
  nor: {
    name: 'NOR',
    rows: [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
  },
  xor: {
    name: 'XOR',
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
  },
}

/**
 * Weights are kept as integer multiples of η.
 *
 * Every update adds η·(t − ŷ)·xᵢ, and with 0/1 inputs and 0/1 targets that is
 * always 0 or ±η — so if the run starts on a multiple of η it stays on one.
 * Integers mean no floating-point drift, which matters here because the run
 * lands on z exactly 0 several times and the firing rule turns on that.
 */
interface Step {
  epoch: number
  row: number
  x1: number
  x2: number
  t: number
  before: [number, number, number]
  z: number
  y: number
  ok: boolean
  after: [number, number, number]
}

function runPla(gate: string, start: [number, number, number], maxEpochs: number) {
  const rows = GATES[gate].rows
  const steps: Step[] = []
  let k: [number, number, number] = [...start]
  let converged = false
  for (let e = 0; e < maxEpochs && !converged; e++) {
    let changed = false
    for (let r = 0; r < rows.length; r++) {
      const [x1, x2, t] = rows[r]
      const zk = k[0] + k[1] * x1 + k[2] * x2
      const y = zk >= 0 ? 1 : 0
      const before: [number, number, number] = [...k]
      if (y !== t) {
        const d = t - y
        k = [k[0] + d, k[1] + d * x1, k[2] + d * x2]
        changed = true
      }
      steps.push({ epoch: e + 1, row: r + 1, x1, x2, t, before, z: zk, y, ok: y === t, after: [...k] })
    }
    if (!changed) converged = true
  }
  return { steps, final: k, converged }
}

export function PlaRunLab() {
  const [gate, setGate] = useState('and')
  const [eta, setEta] = useState(0.1)
  const [start, setStart] = useState<[number, number, number]>([0, 0, 0])
  const [shown, setShown] = useState(0)

  const { steps, converged } = runPla(gate, start, 30)
  const visible = steps.slice(0, shown)
  const k = visible.length ? visible[visible.length - 1].after : start
  const w = k.map((v) => v * eta) as [number, number, number]
  const updates = visible.filter((s) => !s.ok).length
  const doneEpochs = visible.length ? visible[visible.length - 1].epoch : 0

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.4, xmax: 1.4, ymin: -0.4, ymax: 1.4, xlab: 'x₁', ylab: 'x₂' })
    const acc = accentColour()
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    for (let px = f.L; px < f.R; px += 10) {
      for (let py = f.T; py < f.B; py += 10) {
        const z = k[0] + k[1] * f.ux(px) + k[2] * f.uy(py)
        g.fillStyle = k[1] === 0 && k[2] === 0 ? 'rgba(9,9,11,0.03)' : z >= 0 ? acc + '1c' : '#dc262612'
        g.fillRect(px, py, 10, 10)
      }
    }
    if (Math.abs(k[2]) > 1e-9) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(f.px(-1), f.py(-(k[0] + k[1] * -1) / k[2]))
      g.lineTo(f.px(2), f.py(-(k[0] + k[1] * 2) / k[2]))
      g.stroke()
    } else if (Math.abs(k[1]) > 1e-9) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(f.px(-k[0] / k[1]), f.T)
      g.lineTo(f.px(-k[0] / k[1]), f.B)
      g.stroke()
    }
    g.restore()
    for (const [x1, x2, t] of GATES[gate].rows) {
      const z = k[0] + k[1] * x1 + k[2] * x2
      const ok = (z >= 0 ? 1 : 0) === t
      dot(g, f.px(x1), f.py(x2), 8, t === 1 ? '#18181b' : '#fff', t === 1 ? null : '#18181b')
      if (!ok) {
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        g.arc(f.px(x1), f.py(x2), 14, 0, Math.PI * 2)
        g.stroke()
      }
    }
    const last = visible[visible.length - 1]
    if (last) {
      g.strokeStyle = last.ok ? TEAL : RED
      g.lineWidth = 2
      g.beginPath()
      g.arc(f.px(last.x1), f.py(last.x2), 19, 0, Math.PI * 2)
      g.stroke()
    }
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The algorithm from page 32, run one training row at a time. The bias updates on its own line, exactly as the
        slide writes it — <span className="font-mono">b += η(t − ŷ)</span> — because there is no x₀ to carry it here.
      </LabNote>

      <Presets
        items={Object.entries(GATES).map(([id, g]) => ({ id, label: `${g.name} gate` }))}
        at={gate}
        onPick={(id) => {
          setGate(id)
          setShown(0)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ a: k[0], b: k[1], c: k[2] }}
            jumpKey={`${gate}-${shown}`}
            height={280}
            caption="The ringed dot is the row just visited. A red ring on any dot means that row is still wrong."
          />
          <div className="max-h-[280px] overflow-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            {visible.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-zinc-500">
                Nothing yet. Press <strong>Next row</strong> to take the first training example.
              </p>
            ) : (
              <table className="w-full font-mono text-[11.5px]">
                <thead>
                  <tr className="text-[10px] tracking-[0.05em] text-zinc-500 uppercase">
                    <th className="pr-2 pb-1.5 text-left">ep</th>
                    <th className="pr-2 pb-1.5 text-left">x</th>
                    <th className="pr-2 pb-1.5 text-left">t</th>
                    <th className="pr-2 pb-1.5 text-left">z</th>
                    <th className="pr-2 pb-1.5 text-left">ŷ</th>
                    <th className="pr-2 pb-1.5 text-left">t = ŷ?</th>
                    <th className="pb-1.5 text-left">new (b, w₁, w₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s, i) => (
                    <tr key={i} className="border-t border-zinc-950/[0.06]">
                      <td className="py-1 pr-2 text-zinc-400 tabular-nums">{s.epoch}</td>
                      <td className="py-1 pr-2 tabular-nums">
                        ({s.x1}, {s.x2})
                      </td>
                      <td className="py-1 pr-2 tabular-nums">{s.t}</td>
                      <td className="py-1 pr-2 text-zinc-600 tabular-nums">{(s.z * eta).toFixed(2)}</td>
                      <td className="py-1 pr-2 tabular-nums">{s.y}</td>
                      <td className="py-1 pr-2" style={{ color: s.ok ? TEAL : RED }}>
                        {s.ok ? 'yes' : 'no'}
                      </td>
                      <td className="py-1 tabular-nums">
                        ({(s.after[0] * eta).toFixed(2)}, {(s.after[1] * eta).toFixed(2)},{' '}
                        {(s.after[2] * eta).toFixed(2)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Weights now"
            value={`(${w[0].toFixed(2)}, ${w[1].toFixed(2)}, ${w[2].toFixed(2)})`}
            note={`${updates} update${updates === 1 ? '' : 's'} in ${visible.length} row${visible.length === 1 ? '' : 's'}`}
          />
          <Slider
            label="Learning rate η"
            value={eta}
            display={eta.toFixed(2)}
            min={0.05}
            max={1}
            step={0.05}
            hint="The deck initialises it to 0.1."
            onChange={setEta}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setShown((s) => Math.min(s + 1, steps.length))}>
              Next row
            </Btn>
            <Btn onClick={() => setShown((s) => Math.min(s + 4, steps.length))}>Next epoch</Btn>
            <Btn onClick={() => setShown(steps.length)}>Run to the end</Btn>
            <Btn onClick={() => setShown(0)}>Reset</Btn>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip
              on={start[0] === 0 && start[1] === 0 && start[2] === 0}
              label="start at zero"
              onClick={() => {
                setStart([0, 0, 0])
                setShown(0)
              }}
            />
            <Chip
              on={start[1] === 3}
              label="start elsewhere"
              onClick={() => {
                setStart([2, 3, -3])
                setShown(0)
              }}
            />
          </div>
          <Verdict ok={converged}>
            {converged
              ? `Converges after ${steps[steps.length - 1].epoch} epoch${steps[steps.length - 1].epoch === 1 ? '' : 's'} — a whole pass with no update.`
              : 'Still updating after 30 epochs. On XOR it never stops, because no weights are correct and there is always a mistake to react to.'}
          </Verdict>
          <PanelNote>
            Change η and watch the <strong>decisions</strong> stay identical while every number scales. From a start
            that is a multiple of η, each update adds ±η, so η rescales the whole run without changing which rows are
            wrong. That is special to this setup — press <strong>start elsewhere</strong> and it still holds, because
            that start is a multiple of η too.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* The NOT-gate trace, and the deck's own contradiction about sign(0)         */
/* ========================================================================== */

/** The deck's two examples, in the ±1 encoding of page 33. */
const NOT_ROWS: Array<{ x1: number; t: number; label: string }> = [
  { x1: -1, t: 1, label: 'Eg:1' },
  { x1: 1, t: -1, label: 'Eg:2' },
]

interface NotStep {
  epoch: number
  label: string
  x1: number
  t: number
  /** The weights this row was judged with, before any update. */
  w0: number
  w1: number
  h: number
  y: number
  ok: boolean
  nw0: number
  nw1: number
}

function runNot(zeroGivesPlus: boolean, maxEpochs = 4) {
  const rows: NotStep[] = []
  let w0 = 0
  let w1 = 0
  let settled = false
  for (let e = 0; e < maxEpochs && !settled; e++) {
    let changed = false
    for (const r of NOT_ROWS) {
      const used0 = w0
      const used1 = w1
      const h = used0 + used1 * r.x1
      const y = h > 0 ? 1 : h < 0 ? -1 : zeroGivesPlus ? 1 : -1
      const ok = y === r.t
      if (!ok) {
        // η = 1, and x₀ = 1 carries the bias, exactly as page 34 writes it.
        w1 += (r.t - y) * r.x1
        w0 += r.t - y
        changed = true
      }
      rows.push({ epoch: e + 1, label: r.label, x1: r.x1, t: r.t, w0: used0, w1: used1, h, y, ok, nw0: w0, nw1: w1 })
    }
    if (!changed) settled = true
  }
  return { rows, w0, w1, settled }
}

export function NotTraceLab() {
  const [zeroPlus, setZeroPlus] = useState(false)
  const [shown, setShown] = useState(0)

  const a = runNot(false)
  const b = runNot(true)
  const run = zeroPlus ? b : a
  const visible = run.rows.slice(0, shown)
  const w0 = visible.length ? visible[visible.length - 1].nw0 : 0
  const w1 = visible.length ? visible[visible.length - 1].nw1 : 0

  return (
    <LabBox>
      <LabNote>
        The deck’s worked example: w₀ = w₁ = 0, η = 1, two training rows. Everything below is produced by running the
        rule, so the numbers can only be the ones the rule gives.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            {visible.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-zinc-500">
                Press <strong>Next step</strong> to take the first example.
              </p>
            ) : (
              <table className="w-full font-mono text-[12px]">
                <thead>
                  <tr className="text-[10px] tracking-[0.05em] text-zinc-500 uppercase">
                    <th className="pr-2 pb-1.5 text-left">epoch</th>
                    <th className="pr-2 pb-1.5 text-left">example</th>
                    <th className="pr-2 pb-1.5 text-left">x₁</th>
                    <th className="pr-2 pb-1.5 text-left">t</th>
                    <th className="pr-2 pb-1.5 text-left">h = w₀ + w₁x₁</th>
                    <th className="pr-2 pb-1.5 text-left">ŷ</th>
                    <th className="pr-2 pb-1.5 text-left">t = ŷ?</th>
                    <th className="pb-1.5 text-left">new w</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r, i) => (
                    <tr key={i} className="border-t border-zinc-950/[0.06]">
                      <td className="py-1.5 pr-2 text-zinc-400 tabular-nums">{r.epoch}</td>
                      <td className="py-1.5 pr-2 text-zinc-500">{r.label}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.x1}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.t}</td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {r.w0} + ({r.w1})({r.x1}) = {r.h}
                      </td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.y}</td>
                      <td className="py-1.5 pr-2" style={{ color: r.ok ? TEAL : RED }}>
                        {r.ok ? 'YES' : 'NO'}
                      </td>
                      <td className="py-1.5 tabular-nums">
                        w₀ = {r.nw0}, w₁ = {r.nw1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-lg border p-3.5"
              style={{
                borderColor: zeroPlus ? 'rgba(9,9,11,0.1)' : 'rgba(79,70,229,0.35)',
                background: zeroPlus ? '#fff' : 'rgba(79,70,229,0.05)',
              }}
            >
              <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                If sign(0) = −1
              </div>
              <div className="font-mono text-[13px] font-semibold text-zinc-950">
                w₀ = {a.w0}, w₁ = {a.w1}
              </div>
              <p className="mt-1 text-[12px]/[1.6] text-zinc-600">
                What the deck’s own arithmetic does, on page 35. Its printed answer.
              </p>
            </div>
            <div
              className="rounded-lg border p-3.5"
              style={{
                borderColor: zeroPlus ? 'rgba(79,70,229,0.35)' : 'rgba(9,9,11,0.1)',
                background: zeroPlus ? 'rgba(79,70,229,0.05)' : '#fff',
              }}
            >
              <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                If h = 0 gives +1
              </div>
              <div className="font-mono text-[13px] font-semibold text-zinc-950">
                w₀ = {b.w0}, w₁ = {b.w1}
              </div>
              <p className="mt-1 text-[12px]/[1.6] text-zinc-600">
                What page 33’s printed definition says. A different answer, also correct.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Weights now"
            value={`w₀ = ${w0}, w₁ = ${w1}`}
            note={`after ${shown} step${shown === 1 ? '' : 's'}`}
          />
          <div className="flex flex-wrap gap-2">
            <Chip
              on={!zeroPlus}
              label="sign(0) = −1"
              onClick={() => {
                setZeroPlus(false)
                setShown(0)
              }}
            />
            <Chip
              on={zeroPlus}
              label="h = 0 gives +1"
              onClick={() => {
                setZeroPlus(true)
                setShown(0)
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setShown((s) => Math.min(s + 1, run.rows.length))}>
              Next step
            </Btn>
            <Btn onClick={() => setShown(run.rows.length)}>Run to the end</Btn>
            <Btn onClick={() => setShown(0)}>Reset</Btn>
          </div>
          <ReadOutGrid
            items={[
              { label: 'steps taken', value: String(shown) },
              { label: 'updates', value: String(visible.filter((r) => !r.ok).length) },
              { label: 'boundary at x₁ =', value: w1 === 0 ? '—' : (-w0 / w1).toFixed(2) },
              { label: 'converged', value: run.settled ? 'yes' : 'no' },
            ]}
          />
          <Verdict ok={false}>
            The two buttons give different answers because the deck contradicts itself. Page 33 defines ŷ = 1 when h ≥
            0; page 35 computes sign(0) = −1 twice. Both runs converge and both give a correct NOT gate — but only one
            matches the deck’s printed weights.
          </Verdict>
          <PanelNote>
            Look at the boundary read-out in each case. With w = (2, −2) it sits at x₁ = 1, exactly on the second
            training point; with w = (−2, −2) it sits at x₁ = −1, exactly on the first. Starting from zero with η = 1 on
            two points, the answer lands on a data point either way — and is only correct because of how the tie is
            broken.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* XOR, and how many Boolean functions a perceptron can do at all             */
/* ========================================================================== */

const CORNERS: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
]

/** Sweep directions and offsets; report whether this labelling is separable. */
const DIRS = 720
const OFFS = 401
function separable(bits: number) {
  const t = CORNERS.map((_, i) => (bits >> i) & 1)
  for (let a = 0; a < DIRS; a++) {
    const th = (a * Math.PI * 2) / DIRS
    const w1 = Math.cos(th)
    const w2 = Math.sin(th)
    for (let kk = 0; kk < OFFS; kk++) {
      const b = (kk - (OFFS - 1) / 2) / 100
      let ok = true
      for (let i = 0; i < 4 && ok; i++) {
        const z = b + w1 * CORNERS[i][0] + w2 * CORNERS[i][1]
        if ((z >= 0 ? 1 : 0) !== t[i]) ok = false
      }
      if (ok) return true
    }
  }
  return false
}
const SEP = Array.from({ length: 16 }, (_, b) => separable(b))
const SEP_COUNT = SEP.filter(Boolean).length
const NAMES: Record<number, string> = {
  0b1000: 'AND',
  0b1110: 'OR',
  0b0111: 'NAND',
  0b0001: 'NOR',
  0b0110: 'XOR',
  0b1001: 'XNOR',
}
const bitsOf = (t: number[]) => t.reduce((s, v, i) => s | (v << i), 0)

export function Xor01Lab() {
  const [w, setW] = useState<[number, number, number]>([-0.5, 1, 1])
  const [target, setTarget] = useState<number[]>([0, 1, 1, 0])
  const bits = bitsOf(target)
  const right = CORNERS.filter((c, i) => (w[0] + w[1] * c[0] + w[2] * c[1] >= 0 ? 1 : 0) === target[i]).length

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.4, xmax: 1.4, ymin: -0.4, ymax: 1.4, xlab: 'x₁', ylab: 'x₂' })
    const acc = accentColour()
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    for (let px = f.L; px < f.R; px += 10) {
      for (let py = f.T; py < f.B; py += 10) {
        const z = w[0] + w[1] * f.ux(px) + w[2] * f.uy(py)
        g.fillStyle = z >= 0 ? acc + '1c' : '#dc262612'
        g.fillRect(px, py, 10, 10)
      }
    }
    if (Math.abs(w[2]) > 1e-9) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(f.px(-1), f.py(-(w[0] + w[1] * -1) / w[2]))
      g.lineTo(f.px(2), f.py(-(w[0] + w[1] * 2) / w[2]))
      g.stroke()
    }
    g.restore()
    CORNERS.forEach((c, i) => {
      const said = w[0] + w[1] * c[0] + w[2] * c[1] >= 0 ? 1 : 0
      dot(g, f.px(c[0]), f.py(c[1]), 8, target[i] === 1 ? '#18181b' : '#fff', target[i] === 1 ? null : '#18181b')
      if (said !== target[i]) {
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        g.arc(f.px(c[0]), f.py(c[1]), 14, 0, Math.PI * 2)
        g.stroke()
      }
    })
    arrow(g, f.px(0.5), f.py(0.5), f.px(0.5 + w[1] * 0.22), f.py(0.5 + w[2] * 0.22), TEAL, 2)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        Press the four dots below to set any target you like — all sixteen Boolean functions of two inputs are
        reachable. Then try to find a line for it. The lab has already checked every one of the sixteen.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ a: w[0], b: w[1], c: w[2] }}
            height={320}
            caption="Drag the teal arrow to swing the boundary. Filled means the target is 1."
            handles={(f: Frame) => [
              { id: 'w', px: f.px(0.5 + w[1] * 0.22), py: f.py(0.5 + w[2] * 0.22), grab: 'anywhere' as const },
            ]}
            onDragTo={(_id, x, y) => setW(([b0]) => [b0, (x - 0.5) * 4.5, (y - 0.5) * 4.5])}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Set the target for each corner
            </div>
            <div className="flex flex-wrap gap-2">
              {CORNERS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTarget((t) => t.map((v, j) => (j === i ? 1 - v : v)))}
                  className="cursor-pointer rounded-lg border px-3 py-2 font-mono text-[12.5px] font-semibold"
                  style={
                    target[i] === 1
                      ? { borderColor: '#18181b', background: '#18181b', color: '#fff' }
                      : { borderColor: 'rgba(9,9,11,0.2)', background: '#fff', color: '#52525b' }
                  }
                >
                  ({c[0]}, {c[1]}) → {target[i]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Corners correct"
            value={`${right} of 4`}
            tone={right === 4 ? TEAL : RED}
            note={NAMES[bits] ? `this target is ${NAMES[bits]}` : 'one of the sixteen'}
          />
          <Verdict ok={SEP[bits]}>
            {SEP[bits]
              ? 'This function is linearly separable — some line does it, so keep looking.'
              : 'This function is not linearly separable. No line exists, so no amount of dragging will reach 4 of 4.'}
          </Verdict>
          <Slider
            label="w₀ (bias)"
            value={w[0]}
            display={w[0].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint=""
            onChange={(v) => setW(([, b, c]) => [v, b, c])}
          />
          <Slider
            label="w₁"
            value={w[1]}
            display={w[1].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint=""
            onChange={(v) => setW(([a, , c]) => [a, v, c])}
          />
          <Slider
            label="w₂"
            value={w[2]}
            display={w[2].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint=""
            onChange={(v) => setW(([a, b]) => [a, b, v])}
          />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => setTarget([0, 1, 1, 0])}>XOR</Btn>
            <Btn onClick={() => setTarget([1, 0, 0, 1])}>XNOR</Btn>
            <Btn onClick={() => setTarget([0, 0, 0, 1])}>AND</Btn>
            <Btn onClick={() => setTarget([0, 1, 1, 1])}>OR</Btn>
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]/[1.7] text-zinc-700">
            <strong>{SEP_COUNT} of the 16</strong> Boolean functions of two inputs can be done by one perceptron. The{' '}
            {16 - SEP_COUNT} that cannot are the two you can press above: XOR and XNOR. That count is worked out in your
            browser when this page loads, by sweeping {(DIRS * OFFS).toLocaleString('en-GB')} lines against each of the
            sixteen — it is not a number typed in.
          </div>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Separability: (n − 1) dimensions, and infinitely many separators           */
/* ========================================================================== */

const BLUE: Array<[number, number]> = [
  [-2.4, 1.9],
  [-1.7, 2.6],
  [-2.9, 1.1],
  [-1.2, 2.1],
  [-2.1, 3.0],
]
const ORANGE: Array<[number, number]> = [
  [2.0, -1.6],
  [2.7, -0.9],
  [1.4, -2.4],
  [2.9, -2.1],
  [1.8, -0.8],
]

const DIM_TEXT: Record<number, { boundary: string; note: string }> = {
  1: { boundary: 'a point', note: 'One number to compare against. n − 1 = 0 dimensions.' },
  2: { boundary: 'a line', note: 'What the plot shows. n − 1 = 1 dimension.' },
  3: { boundary: 'a plane', note: 'The last one you can draw. n − 1 = 2 dimensions.' },
  10: { boundary: 'a 9-dimensional flat slice', note: 'No picture, identical algebra.' },
}

export function SeparableCountLab() {
  const [angle, setAngle] = useState(45)
  const [offset, setOffset] = useState(0)
  const [dim, setDim] = useState(2)

  const th = (angle * Math.PI) / 180
  const w1 = Math.cos(th)
  const w2 = Math.sin(th)
  const score = (p: [number, number]) => w1 * p[0] + w2 * p[1] - offset
  const ok = BLUE.every((p) => score(p) < 0) && ORANGE.every((p) => score(p) > 0)

  // How many of a fixed grid of candidate lines separate the two sets. The
  // grid is a sample, not the whole family — the family is infinite.
  const GRID_A = 180
  const GRID_O = 121
  let works = 0
  for (let a = 0; a < GRID_A; a++) {
    const t2 = (a * Math.PI * 2) / GRID_A
    const c1 = Math.cos(t2)
    const c2 = Math.sin(t2)
    for (let o = 0; o < GRID_O; o++) {
      const off = -3 + (6 * o) / (GRID_O - 1)
      if (BLUE.every((p) => c1 * p[0] + c2 * p[1] - off < 0) && ORANGE.every((p) => c1 * p[0] + c2 * p[1] - off > 0))
        works++
    }
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -4, xmax: 4, ymin: -4, ymax: 4, xlab: 'x₁', ylab: 'x₂' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    // A sample of the separating family, drawn faintly.
    for (let a = 0; a < GRID_A; a += 3) {
      const t2 = (a * Math.PI * 2) / GRID_A
      const c1 = Math.cos(t2)
      const c2 = Math.sin(t2)
      for (let o = 0; o < GRID_O; o += 4) {
        const off = -3 + (6 * o) / (GRID_O - 1)
        if (
          BLUE.every((p) => c1 * p[0] + c2 * p[1] - off < 0) &&
          ORANGE.every((p) => c1 * p[0] + c2 * p[1] - off > 0)
        ) {
          g.strokeStyle = 'rgba(13,148,136,0.12)'
          g.lineWidth = 1
          g.beginPath()
          if (Math.abs(c2) > 1e-6) {
            g.moveTo(f.px(-5), f.py((off - c1 * -5) / c2))
            g.lineTo(f.px(5), f.py((off - c1 * 5) / c2))
          } else {
            g.moveTo(f.px(off / c1), f.T)
            g.lineTo(f.px(off / c1), f.B)
          }
          g.stroke()
        }
      }
    }
    g.strokeStyle = ok ? '#18181b' : RED
    g.lineWidth = 2.5
    g.beginPath()
    if (Math.abs(w2) > 1e-6) {
      g.moveTo(f.px(-5), f.py((offset - w1 * -5) / w2))
      g.lineTo(f.px(5), f.py((offset - w1 * 5) / w2))
    } else {
      g.moveTo(f.px(offset / w1), f.T)
      g.lineTo(f.px(offset / w1), f.B)
    }
    g.stroke()
    g.restore()
    for (const p of BLUE) dot(g, f.px(p[0]), f.py(p[1]), 6, '#2563eb')
    for (const p of ORANGE) dot(g, f.px(p[0]), f.py(p[1]), 6, AMBER)
    return f
  }

  const d = DIM_TEXT[dim]

  return (
    <LabBox>
      <LabNote>
        Two clouds that a straight line can split. The faint teal lines behind are a sample of the ones that work — move
        yours anywhere inside that band and it works too.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ angle, offset }}
          height={340}
          caption="Your line is black when it separates the two colours and red when it does not."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Your line"
            value={ok ? 'separates them' : 'does not'}
            tone={ok ? TEAL : RED}
            note={`${BLUE.length} blue, ${ORANGE.length} orange`}
          />
          <Slider
            label="Direction"
            value={angle}
            display={`${angle}°`}
            min={0}
            max={359}
            step={1}
            hint="Turns the line."
            onChange={(v) => setAngle(Math.round(v))}
          />
          <Slider
            label="Offset"
            value={offset}
            display={offset.toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint="Slides it along its own normal."
            onChange={setOffset}
          />
          <ReadOutGrid
            items={[
              { label: 'grid searched', value: (GRID_A * GRID_O).toLocaleString('en-GB') },
              { label: 'of those, separating', value: works.toLocaleString('en-GB') },
              { label: 'in the real family', value: 'infinitely many' },
              { label: 'you need', value: 'exactly one' },
            ]}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              In n dimensions
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {[1, 2, 3, 10].map((n) => (
                <Chip key={n} on={n === dim} label={`n = ${n}`} onClick={() => setDim(n)} />
              ))}
            </div>
            <p className="text-[12.5px]/[1.65] text-zinc-700">
              The separator is <strong>{d.boundary}</strong>. {d.note}
            </p>
          </div>
          <PanelNote>
            The grid above is a finite sample of a family the deck says is infinite, and the count changes if you sample
            differently — which is the point. What matters for the perceptron is that at least one exists; which one you
            land on depends entirely on where you started.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* h = wᵀx, and the four output conventions                                   */
/* ========================================================================== */

export function VectorFormLab() {
  const [n, setN] = useState(3)
  const [w, setW] = useState([-1, 0.75, 0.75, 0.5, -0.25])
  const [x, setX] = useState([1, 1, 1, 0.5, 2])

  const terms = Array.from({ length: n + 1 }, (_, i) => w[i] * (i === 0 ? 1 : x[i]))
  const h = terms.reduce((s, t) => s + t, 0)

  return (
    <LabBox>
      <LabNote>
        Two columns of numbers, and one number out. Transposing w turns a column into a row so the shapes line up: a 1 ×
        (n + 1) row times an (n + 1) × 1 column is a single number.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">w</div>
              <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
                {Array.from({ length: n + 1 }, (_, i) => (
                  <span
                    key={i}
                    className="w-14 rounded px-2 py-1 text-right font-mono text-[13px] text-zinc-800 tabular-nums"
                  >
                    {w[i]}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-center font-mono text-[11px] text-zinc-400">{n + 1} × 1</div>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">x</div>
              <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
                {Array.from({ length: n + 1 }, (_, i) => (
                  <span
                    key={i}
                    className="w-14 rounded px-2 py-1 text-right font-mono text-[13px] tabular-nums"
                    style={i === 0 ? { color: '#a1a1aa' } : { color: '#27272a' }}
                  >
                    {i === 0 ? 1 : x[i]}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-center font-mono text-[11px] text-zinc-400">{n + 1} × 1</div>
            </div>
            <div className="flex-1">
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">h = wᵀx</div>
              <div className="font-mono text-[12.5px]/[1.9] text-zinc-700">
                {terms.map((t, i) => (
                  <div key={i}>
                    {w[i]} × {i === 0 ? 1 : x[i]} = {t.toFixed(3)}
                    {i === 0 && <span className="ml-2 text-zinc-400">← the bias, riding on a constant 1</span>}
                  </div>
                ))}
                <div className="border-t border-zinc-950/[0.08] pt-1 font-semibold" style={{ color: 'var(--acc)' }}>
                  h = {h.toFixed(3)}
                </div>
              </div>
              <div className="mt-2 font-mono text-[11.5px] text-zinc-400">
                (1 × {n + 1}) · ({n + 1} × 1) = 1 × 1
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut label="h" value={h.toFixed(3)} note="one number, whatever n is" />
          <Slider
            label="Number of features n"
            value={n}
            display={String(n)}
            min={1}
            max={4}
            step={1}
            hint="The vectors grow; the answer stays a single number."
            onChange={(v) => setN(Math.round(v))}
          />
          {Array.from({ length: n + 1 }, (_, i) => (
            <Slider
              key={i}
              label={`w${i}`}
              value={w[i]}
              display={String(w[i])}
              min={-3}
              max={3}
              step={0.25}
              hint={i === 0 ? 'The bias, written as the zeroth weight.' : ''}
              onChange={(v) => setW((p) => p.map((q, j) => (j === i ? v : q)))}
            />
          ))}
          <PanelNote>
            This is the same object as the dot product from the maths course, written with a transpose instead of a dot.
            wᵀx and ⟨w, x⟩ and Σ wᵢxᵢ are three notations for one number, and all three appear in this course.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Four conventions in one table                                              */
/* ========================================================================== */

const CONVENTIONS = [
  {
    id: 's1',
    where: 'Session 1, slide 53',
    inputs: '±1',
    rule: 'h = +1 if z > 0, else −1',
    fires: (z: number) => (z > 0 ? '+1' : '−1'),
    zero: '−1',
    note: 'Strictly above zero. Zero itself goes to −1, which is what makes that session’s NOT-gate answer work.',
  },
  {
    id: 's2def',
    where: 'Session 2, page 21',
    inputs: '0/1',
    rule: 'ŷ = 1 if z ≥ 0, else 0',
    fires: (z: number) => (z >= 0 ? '1' : '0'),
    zero: '1',
    note: 'Zero or above fires, and the off state is 0 rather than −1. Both halves differ from session 1.',
  },
  {
    id: 's2not',
    where: 'Session 2, page 33',
    inputs: '±1',
    rule: 'ŷ = 1 if h ≥ 0, −1 if h < 0',
    fires: (z: number) => (z >= 0 ? '+1' : '−1'),
    zero: '+1',
    note: 'The NOT-gate slide. ±1 outputs like session 1, but firing at zero like page 21 — a third combination.',
  },
  {
    id: 's2run',
    where: 'Session 2, page 35',
    inputs: '±1',
    rule: 'sign(0) taken as −1',
    fires: (z: number) => (z > 0 ? '+1' : '−1'),
    zero: '−1',
    note: 'What the worked arithmetic actually does, twice — contradicting the definition two slides earlier.',
  },
]

export function EncodingsLab() {
  const [z, setZ] = useState(0)
  const disagree = new Set(CONVENTIONS.map((c) => c.fires(z))).size > 1

  return (
    <LabBox>
      <LabNote>
        One weighted sum, four rules for turning it into an answer, all four from this course. Move z and watch how
        often they agree.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[10.5px] tracking-[0.05em] text-zinc-500 uppercase">
                <th className="pr-3 pb-2 text-left">Where</th>
                <th className="pr-3 pb-2 text-left">Inputs</th>
                <th className="pr-3 pb-2 text-left">Rule</th>
                <th className="pr-3 pb-2 text-left">at z = 0</th>
                <th className="pb-2 text-left">at z = {z.toFixed(2)}</th>
              </tr>
            </thead>
            <tbody>
              {CONVENTIONS.map((c) => (
                <tr key={c.id} className="border-t border-zinc-950/[0.06]">
                  <td className="py-2 pr-3 font-semibold text-zinc-900">{c.where}</td>
                  <td className="py-2 pr-3 font-mono text-zinc-600">{c.inputs}</td>
                  <td className="py-2 pr-3 font-mono text-[12px] text-zinc-600">{c.rule}</td>
                  <td className="py-2 pr-3 font-mono font-semibold text-zinc-500">{c.zero}</td>
                  <td className="py-2 font-mono text-[14px] font-semibold" style={{ color: 'var(--acc)' }}>
                    {c.fires(z)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-col gap-2 border-t border-zinc-950/[0.08] pt-3">
            {CONVENTIONS.map((c) => (
              <p key={c.id} className="text-[12px]/[1.6] text-zinc-600">
                <strong className="text-zinc-800">{c.where}:</strong> {c.note}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Do they agree?"
            value={disagree ? 'no' : 'yes'}
            tone={disagree ? RED : TEAL}
            note={disagree ? 'the same sum, different answers' : 'away from zero the sign is all that matters'}
          />
          <Slider
            label="z"
            value={z}
            display={z.toFixed(2)}
            min={-2}
            max={2}
            step={0.05}
            hint="Set it to exactly 0 and all four answers differ in some way."
            onChange={setZ}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setZ(0)}>
              Set z to exactly 0
            </Btn>
            <Btn onClick={() => setZ(1)}>z = 1</Btn>
            <Btn onClick={() => setZ(-1)}>z = −1</Btn>
          </div>
          <Verdict ok={!disagree}>
            {disagree
              ? 'At this z the four conventions do not all say the same thing.'
              : 'Away from zero, the two ±1 rules agree with each other and the two 0/1 rules agree with each other — only the labels differ.'}
          </Verdict>
          <PanelNote>
            Everything turns on z = 0, and that is not a rare accident: the gate answers in both sessions land on it,
            and so do both NOT-gate training runs. In an exam, write down which convention you are using before you
            start, and the marks look after themselves.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
