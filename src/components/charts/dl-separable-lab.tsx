'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const PINK = '#e11d48'

/* ========================================================================== */
/* Slides 74–76 — thirteen points and one line                                */
/* ========================================================================== */

/** Exactly the table on slide 74. "white" is the ⊗ mark, "pink" the square. */
const DECK_POINTS: Array<{ x: number; y: number; white: boolean }> = [
  { x: 1, y: 9, white: true },
  { x: 10, y: 9, white: true },
  { x: 4, y: 7, white: true },
  { x: 4, y: 5, white: false },
  { x: 5, y: 3, white: false },
  { x: 8, y: 9, white: true },
  { x: 4, y: 2, white: false },
  { x: 2, y: 5, white: false },
  { x: 7, y: 1, white: false },
  { x: 2, y: 10, white: true },
  { x: 8, y: 5, white: true },
  { x: 1, y: 2, white: false },
  { x: 8, y: 2, white: false },
]

const DECK_W: [number, number, number] = [-25, 2, 3]

export function SeparableLab() {
  const [w, setW] = useState<[number, number, number]>([-25, 2, 3])
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)

  const score = (x: number, y: number) => w[0] + w[1] * x + w[2] * y
  const results = DECK_POINTS.map((p) => ({ ...p, z: score(p.x, p.y), ok: score(p.x, p.y) > 0 === p.white }))
  const right = results.filter((r) => r.ok).length
  const testZ = score(tx, ty)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 11, ymin: 0, ymax: 11, xlab: 'x₁', ylab: 'x₂' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    const acc = accentColour()
    const step = 10
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const z = score(f.ux(px), f.uy(py))
        g.fillStyle = z > 0 ? acc + '14' : '#e11d4810'
        g.fillRect(px, py, step, step)
      }
    }
    if (Math.abs(w[2]) > 1e-9) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(f.px(0), f.py(-(w[0] + w[1] * 0) / w[2]))
      g.lineTo(f.px(11), f.py(-(w[0] + w[1] * 11) / w[2]))
      g.stroke()
    }
    g.restore()

    for (const r of results) {
      if (r.white) {
        dot(g, f.px(r.x), f.py(r.y), 7, '#fff', '#1e3a8a')
        g.strokeStyle = '#1e3a8a'
        g.lineWidth = 1.5
        g.beginPath()
        g.moveTo(f.px(r.x) - 5, f.py(r.y) - 5)
        g.lineTo(f.px(r.x) + 5, f.py(r.y) + 5)
        g.moveTo(f.px(r.x) + 5, f.py(r.y) - 5)
        g.lineTo(f.px(r.x) - 5, f.py(r.y) + 5)
        g.stroke()
      } else {
        g.fillStyle = PINK
        g.fillRect(f.px(r.x) - 5, f.py(r.y) - 5, 10, 10)
      }
      if (!r.ok) {
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        g.arc(f.px(r.x), f.py(r.y), 13, 0, Math.PI * 2)
        g.stroke()
      }
    }

    grip(g, f.px(tx), f.py(ty), testZ > 0 ? '#1e3a8a' : PINK, 8)
    g.fillStyle = '#52525b'
    g.textAlign = 'left'
    g.fillText('new point', f.px(tx) + 11, f.py(ty))
    return f
  }

  return (
    <LabBox>
      <LabNote>
        All thirteen points from the table on slide 74, and the line the slide gives on slide 75. Press anywhere to move
        the <strong>new point</strong> and the lab tells you which interior it lands in.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0: w[0], w1: w[1], w2: w[2], tx, ty }}
          height={380}
          caption="⊗ is white, ■ is pink — the deck's own two marks. A red ring means that point is on the wrong side of the current line."
          handles={(f: Frame) => [{ id: 't', px: f.px(tx), py: f.py(ty), grab: 'anywhere' as const }]}
          onDragTo={(_id, x, y) => {
            setTx(Math.round(clamp(x, 0, 11) * 10) / 10)
            setTy(Math.round(clamp(y, 0, 11) * 10) / 10)
          }}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Correctly separated"
            value={`${right} of 13`}
            tone={right === 13 ? TEAL : RED}
            note={right === 13 ? 'this line separates the data' : 'ringed points are wrong'}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12.5px]/[1.8] text-zinc-800">
            <div>
              new point ({tx}, {ty})
            </div>
            <div>
              {w[1]}({tx}) + {w[2]}({ty}) {w[0] < 0 ? '−' : '+'} {Math.abs(w[0])} = {testZ.toFixed(1)}
            </div>
            <div className="font-semibold" style={{ color: testZ > 0 ? '#1e3a8a' : PINK }}>
              {testZ > 0 ? 'white interior' : 'pink interior'}
            </div>
          </div>
          <Slider
            label="w₁ (on x₁)"
            value={w[1]}
            display={String(w[1])}
            min={-6}
            max={6}
            step={0.5}
            hint="The deck uses 2."
            onChange={(v) => setW(([a, , c]) => [a, v, c])}
          />
          <Slider
            label="w₂ (on x₂)"
            value={w[2]}
            display={String(w[2])}
            min={-6}
            max={6}
            step={0.5}
            hint="The deck uses 3."
            onChange={(v) => setW(([a, b]) => [a, b, v])}
          />
          <Slider
            label="w₀ (bias)"
            value={w[0]}
            display={String(w[0])}
            min={-45}
            max={10}
            step={0.5}
            hint="The deck uses −25, which is where the 25 in the line equation comes from."
            onChange={(v) => setW(([, b, c]) => [v, b, c])}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setW(DECK_W)}>
              The deck’s line
            </Btn>
            <Btn
              onClick={() => {
                setTx(0)
                setTy(0)
              }}
            >
              New point (0, 0)
            </Btn>
            <Btn
              onClick={() => {
                setTx(10)
                setTy(10)
              }}
            >
              New point (10, 10)
            </Btn>
          </div>
          <ReadOutGrid
            items={[
              { label: 'white points', value: `${DECK_POINTS.filter((p) => p.white).length}` },
              { label: 'pink points', value: `${DECK_POINTS.filter((p) => !p.white).length}` },
              { label: 'wrong now', value: String(13 - right) },
              { label: '2x₁ + 3x₂ at new pt', value: (2 * tx + 3 * ty).toFixed(1) },
            ]}
          />
          <PanelNote>
            Slide 76 draws exactly this as a perceptron: a constant input weighted −25, x₁ weighted 2, x₂ weighted 3,
            and a sign at the end. The line equation and the neuron are the same three numbers.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Slides 77–79 — the four points no line can split                           */
/* ========================================================================== */

const XOR_POINTS: Array<{ x: number; y: number; t: number }> = [
  { x: 0, y: 0, t: 0 },
  { x: 0, y: 1, t: 1 },
  { x: 1, y: 0, t: 1 },
  { x: 1, y: 1, t: 0 },
]

/** How many of the four a given line gets right. Recomputed, never stored. */
function xorScore(w: [number, number, number]) {
  return XOR_POINTS.filter((p) => (w[0] + w[1] * p.x + w[2] * p.y > 0 ? 1 : 0) === p.t).length
}

const DIRECTIONS = 360
const OFFSETS = 401

/** Sweep every direction and every offset, finely, and report the best found. */
function bestPossible() {
  let best = 0
  for (let a = 0; a < DIRECTIONS; a++) {
    const th = (a * Math.PI) / 180
    const w1 = Math.cos(th)
    const w2 = Math.sin(th)
    for (let k = 0; k < OFFSETS; k++) {
      const s = xorScore([(k - (OFFSETS - 1) / 2) / 100, w1, w2])
      if (s > best) best = s
    }
  }
  return best
}
const BEST = bestPossible()
const SWEPT = DIRECTIONS * OFFSETS

export function XorLab() {
  const [w, setW] = useState<[number, number, number]>([-0.5, 1, 1])
  const [tries, setTries] = useState(0)
  const [bestSeen, setBestSeen] = useState(xorScore([-0.5, 1, 1]))

  const right = xorScore(w)

  /** Every change goes through here, so the record can never miss one. */
  const apply = (next: [number, number, number]) => {
    setW(next)
    setBestSeen((b) => Math.max(b, xorScore(next)))
    setTries((t) => t + 1)
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawAxes(g, W, H, { xmin: -0.4, xmax: 1.4, ymin: -0.4, ymax: 1.4, xlab: 'x₁', ylab: 'x₂' })
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    const acc = accentColour()
    for (let px = f.L; px < f.R; px += 10) {
      for (let py = f.T; py < f.B; py += 10) {
        const z = w[0] + w[1] * f.ux(px) + w[2] * f.uy(py)
        g.fillStyle = z > 0 ? acc + '18' : '#dc262612'
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
    // The midpoint both diagonals share — the whole reason no line can work.
    dot(g, f.px(0.5), f.py(0.5), 4, '#a1a1aa')
    g.strokeStyle = 'rgba(9,9,11,0.18)'
    g.setLineDash([3, 3])
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.px(0), f.py(0))
    g.lineTo(f.px(1), f.py(1))
    g.moveTo(f.px(0), f.py(1))
    g.lineTo(f.px(1), f.py(0))
    g.stroke()
    g.setLineDash([])
    g.restore()

    for (const p of XOR_POINTS) {
      const said = w[0] + w[1] * p.x + w[2] * p.y > 0 ? 1 : 0
      dot(g, f.px(p.x), f.py(p.y), 8, p.t === 1 ? '#18181b' : '#fff', p.t === 1 ? null : '#18181b')
      if (said !== p.t) {
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        g.arc(f.px(p.x), f.py(p.y), 14, 0, Math.PI * 2)
        g.stroke()
      }
    }
    arrow(g, f.px(0.5), f.py(0.5), f.px(0.5 + w[1] * 0.25), f.py(0.5 + w[2] * 0.25), TEAL, 2)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The XOR truth table as four points. Filled dots want +1, hollow dots want 0. Drag the teal arrow to swing the
        line anywhere you like — the lab keeps score.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ w0: w[0], w1: w[1], w2: w[2] }}
          height={360}
          caption="The grey dot is (0.5, 0.5) — the midpoint of both dashed diagonals at once. That coincidence is the whole obstruction."
          handles={(f: Frame) => [
            { id: 'w', px: f.px(0.5 + w[1] * 0.25), py: f.py(0.5 + w[2] * 0.25), grab: 'anywhere' as const },
          ]}
          onDragTo={(_id, x, y) => apply([w[0], (x - 0.5) * 4, (y - 0.5) * 4])}
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Rows correct"
            value={`${right} of 4`}
            tone={right === 4 ? TEAL : RED}
            note={`best you have reached: ${bestSeen}`}
          />
          <Slider
            label="w₀ (bias)"
            value={w[0]}
            display={w[0].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint="Slides the line back and forth."
            onChange={(v) => apply([v, w[1], w[2]])}
          />
          <Slider
            label="w₁"
            value={w[1]}
            display={w[1].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint="Weight on the first input."
            onChange={(v) => apply([w[0], v, w[2]])}
          />
          <Slider
            label="w₂"
            value={w[2]}
            display={w[2].toFixed(2)}
            min={-3}
            max={3}
            step={0.05}
            hint="Weight on the second."
            onChange={(v) => apply([w[0], w[1], v])}
          />
          <ReadOutGrid
            items={[
              { label: 'lines you have tried', value: String(tries) },
              { label: 'lines swept below', value: SWEPT.toLocaleString('en-GB') },
              { label: 'best ever found', value: `${BEST} of 4` },
              { label: 'best you found', value: `${bestSeen} of 4` },
            ]}
          />
          <Verdict ok={false}>
            Sweeping {DIRECTIONS} directions against {OFFSETS} offsets each — {SWEPT.toLocaleString('en-GB')} lines —
            the best any of them manages is {BEST} of 4. That search runs in your browser when this page loads; the
            number is not typed in.
          </Verdict>
          <PanelNote>
            The search is evidence, not a proof. The proof is on the page above and takes two lines: any linear z is an
            average-preserving function, and both diagonals of the square have the same midpoint.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Slides 80–81 — the hidden layer that fixes it                              */
/* ========================================================================== */

/** The network exactly as slide 80 draws it. th is the node's threshold. */
const NET = {
  n1: { w: [1, 1], th: 1, name: 'n₁' },
  n2: { w: [-1, -1], th: -1, name: 'n₂' },
  n3: { w: [1, 1], th: 2, name: 'n₃' },
}
/** Slide 81's rule: fire when the weighted sum reaches the threshold. */
const fire = (sum: number, th: number) => (sum >= th ? 1 : 0)

function forward(x1: number, x2: number) {
  const s1 = NET.n1.w[0] * x1 + NET.n1.w[1] * x2
  const n1 = fire(s1, NET.n1.th)
  const s2 = NET.n2.w[0] * x1 + NET.n2.w[1] * x2
  const n2 = fire(s2, NET.n2.th)
  const s3 = NET.n3.w[0] * n1 + NET.n3.w[1] * n2
  const n3 = fire(s3, NET.n3.th)
  return { s1, n1, s2, n2, s3, n3 }
}

const XOR_TRUTH = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
]

export function MlpLab() {
  const [x1, setX1] = useState(0)
  const [x2, setX2] = useState(1)
  const st = forward(x1, x2)

  const allMatch = XOR_TRUTH.every(([a, b, want]) => forward(a, b).n3 === want)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    // A diagram, not a plot: the frame is the identity so nothing hit-tests.
    const f: Frame = { L: 0, R: W, T: 0, B: H, px: (v) => v, py: (v) => v, ux: (p) => p, uy: (p) => p }
    const acc = accentColour()
    const col = [W * 0.16, W * 0.5, W * 0.84]
    const nodes = [
      { x: col[0], y: H * 0.3, label: 'x₁', on: x1 === 1, sub: String(x1) },
      { x: col[0], y: H * 0.7, label: 'x₂', on: x2 === 1, sub: String(x2) },
      { x: col[1], y: H * 0.3, label: 'n₁ 1', on: st.n1 === 1, sub: `sum ${st.s1}` },
      { x: col[1], y: H * 0.7, label: 'n₂ −1', on: st.n2 === 1, sub: `sum ${st.s2}` },
      { x: col[2], y: H * 0.5, label: 'n₃ 2', on: st.n3 === 1, sub: `sum ${st.s3}` },
    ]
    const edges = [
      { a: 0, b: 2, w: 1, live: x1 === 1 },
      { a: 1, b: 2, w: 1, live: x2 === 1 },
      { a: 0, b: 3, w: -1, live: x1 === 1 },
      { a: 1, b: 3, w: -1, live: x2 === 1 },
      { a: 2, b: 4, w: 1, live: st.n1 === 1 },
      { a: 3, b: 4, w: 1, live: st.n2 === 1 },
    ]
    for (const e of edges) {
      const A = nodes[e.a]
      const B = nodes[e.b]
      g.strokeStyle = e.live ? acc : 'rgba(9,9,11,0.18)'
      g.lineWidth = e.live ? 2.5 : 1.5
      g.beginPath()
      g.moveTo(A.x + 24, A.y)
      g.lineTo(B.x - 24, B.y)
      g.stroke()
      g.fillStyle = e.live ? acc : '#a1a1aa'
      g.textAlign = 'center'
      // The two crossing wires share a midpoint exactly, so labelling both
      // there stacks them on top of each other. Slide the label along the wire
      // by a fraction that depends on which way it slopes.
      const t = A.y < B.y ? 0.34 : 0.66
      g.fillText(String(e.w), A.x + (B.x - A.x) * t, A.y + (B.y - A.y) * t - 9)
    }
    for (const n of nodes) {
      g.beginPath()
      g.arc(n.x, n.y, 24, 0, Math.PI * 2)
      g.fillStyle = n.on ? acc + '22' : '#fafafa'
      g.fill()
      g.strokeStyle = n.on ? acc : 'rgba(9,9,11,0.2)'
      g.lineWidth = 2
      g.stroke()
      g.fillStyle = n.on ? acc : '#52525b'
      g.textAlign = 'center'
      g.fillText(n.label, n.x, n.y - 4)
      g.fillStyle = '#a1a1aa'
      g.fillText(n.sub, n.x, n.y + 9)
    }
    g.fillStyle = '#71717a'
    g.textAlign = 'center'
    g.fillText('Input Layer', col[0], H - 8)
    g.fillText('Hidden Layer', col[1], H - 8)
    g.fillText('Output Layer', col[2], H - 8)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        The network from slide 80, with the numbers inside the circles being each node’s threshold. Choose an input and
        watch the signal light up — a wire is lit when the thing it comes from is firing.
      </LabNote>

      <div className="flex flex-wrap gap-2">
        {XOR_TRUTH.map(([a, b]) => (
          <Chip
            key={`${a}${b}`}
            on={x1 === a && x2 === b}
            label={`x₁ = ${a}, x₂ = ${b}`}
            onClick={() => {
              setX1(a)
              setX2(b)
            }}
          />
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ x1, x2 }}
            jumpKey={`${x1}${x2}`}
            height={300}
            caption="Nothing here is trained — slide 80 hands you the weights and the thresholds, and the lab only runs them."
          />
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            <table className="w-full font-mono text-[12px]">
              <thead>
                <tr className="text-[10px] tracking-[0.05em] text-zinc-500 uppercase">
                  <th className="pr-2 pb-1.5 text-left">x₁</th>
                  <th className="pr-2 pb-1.5 text-left">x₂</th>
                  <th className="pr-2 pb-1.5 text-left">n₁ (th 1)</th>
                  <th className="pr-2 pb-1.5 text-left">n₂ (th −1)</th>
                  <th className="pr-2 pb-1.5 text-left">n₃ (th 2)</th>
                  <th className="pr-2 pb-1.5 text-left">x₁ xor x₂</th>
                  <th className="pb-1.5 text-left">ok</th>
                </tr>
              </thead>
              <tbody>
                {XOR_TRUTH.map(([a, b, want]) => {
                  const s = forward(a, b)
                  const here = a === x1 && b === x2
                  return (
                    <tr
                      key={`${a}${b}`}
                      className="border-t border-zinc-950/[0.06]"
                      style={here ? { background: 'var(--acc-12)' } : undefined}
                    >
                      <td className="py-1.5 pr-2 tabular-nums">{a}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{b}</td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {a}·1 + {b}·1 = {s.s1} {s.s1 >= 1 ? '≥' : '<'} 1 → {s.n1}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {a}·(−1) + {b}·(−1) = {s.s2} {s.s2 >= -1 ? '≥' : '<'} −1 → {s.n2}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {s.n1} + {s.n2} = {s.s3} {s.s3 >= 2 ? '≥' : '<'} 2 → {s.n3}
                      </td>
                      <td className="py-1.5 pr-2 tabular-nums">{want}</td>
                      <td className="py-1.5 font-semibold" style={{ color: s.n3 === want ? TEAL : RED }}>
                        {s.n3 === want ? '✓' : '✗'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Output n₃"
            value={String(st.n3)}
            note={`x₁ xor x₂ = ${x1 ^ x2}`}
            tone={st.n3 === (x1 ^ x2) ? TEAL : RED}
          />
          <ReadOutGrid
            items={[
              { label: 'n₁ sum', value: String(st.s1) },
              { label: 'n₁ fires', value: st.n1 ? 'yes' : 'no' },
              { label: 'n₂ sum', value: String(st.s2) },
              { label: 'n₂ fires', value: st.n2 ? 'yes' : 'no' },
            ]}
          />
          <Verdict ok={allMatch}>
            {allMatch
              ? 'All four rows reproduce slide 81 exactly, computed by running the network rather than by copying the table.'
              : 'A row disagrees with slide 81 — that would be a bug on this page.'}
          </Verdict>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]/[1.7] text-zinc-700">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What the hidden units are
            </div>
            <div className="font-mono">
              n₁ fires when x₁ + x₂ ≥ 1 — that is <strong>OR</strong>
              <br />
              n₂ fires when x₁ + x₂ ≤ 1 — that is <strong>NAND</strong>
              <br />
              n₃ fires when both do — that is <strong>AND</strong>
            </div>
            <p className="mt-2">
              So XOR is OR and NAND. Each hidden unit is a gate you already solved by hand two pages ago, and the output
              unit is a third. Nothing new was needed except permission to stack them.
            </p>
          </div>
          <PanelNote>
            Press each of the four input buttons in turn and watch n₂ go dark only on the last one. That single dark
            node is the whole difference between OR and XOR.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
