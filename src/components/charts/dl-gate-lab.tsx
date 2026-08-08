'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/** Slide 53: strictly above zero fires, everything else — including zero — does not. */
const activate = (z: number) => (z > 0 ? 1 : -1)

/* ========================================================================== */
/* The gates, in the ±1 encoding the deck rewrites them into                  */
/* ========================================================================== */

interface Gate {
  id: string
  name: string
  /** [x₁, x₂, t]; x₂ absent for the one-input NOT gate. */
  rows: Array<[number, number, number]>
  /** The answer the deck prints, where it prints one. */
  deck?: [number, number, number]
  deckNote: string
}

const AND_GATE: Gate = {
  id: 'and',
  name: 'AND',
  rows: [
    [-1, -1, -1],
    [-1, 1, -1],
    [1, -1, -1],
    [1, 1, 1],
  ],
  deck: [-1, 2, 2],
  deckNote: 'Slide 58 gives w₁ = w₂ = 2, w₀ = −1.',
}

const OR_GATE: Gate = {
  id: 'or',
  name: 'OR',
  rows: [
    [-1, -1, -1],
    [-1, 1, 1],
    [1, -1, 1],
    [1, 1, 1],
  ],
  deck: [2, 2, 2],
  deckNote: 'Slide 61 gives w₀ = w₁ = w₂ = 2.',
}

const NOR_GATE: Gate = {
  id: 'nor',
  name: 'NOR',
  rows: [
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
    [1, 1, -1],
  ],
  deckNote:
    'Slide 60 asks for this one and prints no answer. Worked out here, and checked against all four rows by the table above.',
}

const NAND_GATE: Gate = {
  id: 'nand',
  name: 'NAND',
  rows: [
    [-1, -1, 1],
    [-1, 1, 1],
    [1, -1, 1],
    [1, 1, -1],
  ],
  deckNote: 'Also from slide 60, also unanswered on the slides. Worked out here and checked the same way.',
}

/** Answers worked out on the page, then confirmed row by row by the lab itself. */
const WORKED: Record<string, [number, number, number]> = {
  nor: [-2, -2, -2],
  nand: [1, -2, -2],
}

function GateBoard({
  gates,
  initial,
  showDeck,
  showWorked,
}: {
  gates: Gate[]
  initial: [number, number, number]
  showDeck: boolean
  showWorked: boolean
}) {
  const [pick, setPick] = useState(gates[0].id)
  const [w, setW] = useState<[number, number, number]>(initial)
  const [revealed, setRevealed] = useState(false)
  const g0 = gates.find((x) => x.id === pick)!

  const results = g0.rows.map(([x1, x2, t]) => {
    const z = w[0] + w[1] * x1 + w[2] * x2
    const h = activate(z)
    return { x1, x2, t, z, h, ok: h === t }
  })
  const right = results.filter((r) => r.ok).length
  const solved = right === results.length

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawPlane(g, W, H, 2)
    const acc = accentColour()
    const step = 10
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    for (let px = f.L; px < f.R; px += step) {
      for (let py = f.T; py < f.B; py += step) {
        const z = w[0] + w[1] * f.ux(px) + w[2] * f.uy(py)
        g.fillStyle = w[1] === 0 && w[2] === 0 ? 'rgba(9,9,11,0.03)' : z > 0 ? acc + '1f' : '#dc262614'
        g.fillRect(px, py, step, step)
      }
    }
    if (w[1] !== 0 || w[2] !== 0) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      if (Math.abs(w[2]) > 1e-9) {
        g.moveTo(f.px(-4), f.py(-(w[0] + w[1] * -4) / w[2]))
        g.lineTo(f.px(4), f.py(-(w[0] + w[1] * 4) / w[2]))
      } else {
        g.moveTo(f.px(-w[0] / w[1]), f.T)
        g.lineTo(f.px(-w[0] / w[1]), f.B)
      }
      g.stroke()
    }
    g.restore()

    arrow(g, f.px(0), f.py(0), f.px(w[1]), f.py(w[2]), TEAL, 2.5)
    results.forEach((r) => {
      dot(g, f.px(r.x1), f.py(r.x2), 8, r.t > 0 ? '#18181b' : '#fff', r.t > 0 ? null : '#18181b')
      if (!r.ok) {
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        g.arc(f.px(r.x1), f.py(r.x2), 13, 0, Math.PI * 2)
        g.stroke()
      }
    })
    grip(g, f.px(w[1]), f.py(w[2]), TEAL)
    return f
  }

  const answer = showDeck ? g0.deck : WORKED[g0.id]

  return (
    <LabBox>
      {gates.length > 1 && (
        <Presets
          items={gates.map((x) => ({ id: x.id, label: `${x.name} gate` }))}
          at={pick}
          onPick={(id) => {
            setPick(id)
            setW(initial)
            setRevealed(false)
          }}
        />
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            <table className="w-full font-mono text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] tracking-[0.05em] text-zinc-500 uppercase">
                  <th className="pb-1.5 text-left">x₁</th>
                  <th className="pb-1.5 text-left">x₂</th>
                  <th className="pb-1.5 text-left">t</th>
                  <th className="pb-1.5 text-left">z = w₀ + w₁x₁ + w₂x₂</th>
                  <th className="pb-1.5 text-left">h</th>
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
                      {w[0]} + ({w[1]})({r.x1}) + ({w[2]})({r.x2}) = {r.z}
                    </td>
                    <td className="py-1.5 tabular-nums">{r.h}</td>
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
            height={330}
            caption="Filled dot means the target is +1, hollow means −1. A red ring means this row is still wrong. Drag the teal arrow to turn the boundary."
            handles={(f: Frame) => [{ id: 'w', px: f.px(w[1]), py: f.py(w[2]), grab: 'anywhere' as const }]}
            onDragTo={(_id, x, y) =>
              setW(([b]) => [b, Math.round(clamp(x, -4, 4) * 2) / 2, Math.round(clamp(y, -4, 4) * 2) / 2])
            }
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Rows satisfied"
            value={`${right} of ${results.length}`}
            note={solved ? 'this is a correct set of weights' : 'keep going'}
            tone={solved ? TEAL : RED}
          />
          <Slider
            label="w₀ (bias)"
            value={w[0]}
            display={String(w[0])}
            min={-4}
            max={4}
            step={0.5}
            hint="Slides the boundary."
            onChange={(v) => setW(([, a, b]) => [v, a, b])}
          />
          <Slider
            label="w₁"
            value={w[1]}
            display={String(w[1])}
            min={-4}
            max={4}
            step={0.5}
            hint="Weight on the first input."
            onChange={(v) => setW(([a, , b]) => [a, v, b])}
          />
          <Slider
            label="w₂"
            value={w[2]}
            display={String(w[2])}
            min={-4}
            max={4}
            step={0.5}
            hint="Weight on the second."
            onChange={(v) => setW(([a, b]) => [a, b, v])}
          />
          <Verdict ok={solved}>
            {solved
              ? `All ${results.length} rows agree. w = (${w[0]}, ${w[1]}, ${w[2]}) represents ${g0.name}.`
              : `${results.length - right} row${results.length - right === 1 ? '' : 's'} still disagree. The ringed dots are the ones to fix.`}
          </Verdict>

          {answer && (
            <>
              <div className="flex flex-wrap gap-2">
                <Btn
                  primary
                  onClick={() => {
                    setW(answer)
                    setRevealed(true)
                  }}
                >
                  {showWorked ? 'Show the worked answer' : 'Use the deck’s answer'}
                </Btn>
                <Btn onClick={() => setW(initial)}>Clear</Btn>
              </div>
              {revealed && (
                <PanelNote>
                  w = ({answer[0]}, {answer[1]}, {answer[2]}). {g0.deckNote}
                </PanelNote>
              )}
            </>
          )}
          {!answer && <PanelNote>{g0.deckNote}</PanelNote>}
          <PanelNote>
            More than one answer is right. Any weights putting all four dots on the correct side of the line work — the
            truth table gives inequalities, not equations, so the solutions form a whole region.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

export function AndOrLab() {
  return <GateBoard gates={[AND_GATE, OR_GATE]} initial={[0, 0, 0]} showDeck showWorked={false} />
}

export function GateExerciseLab() {
  return <GateBoard gates={[NOR_GATE, NAND_GATE]} initial={[0, 0, 0]} showDeck={false} showWorked />
}

/* ========================================================================== */
/* The NOT gate: two rows, two inequalities                                   */
/* ========================================================================== */

export function NotGateLab() {
  const [w0, setW0] = useState(0)
  const [w1, setW1] = useState(0)

  const rows: Array<{ x1: number; t: number }> = [
    { x1: -1, t: 1 },
    { x1: 1, t: -1 },
  ]
  const results = rows.map((r) => {
    const z = w0 + w1 * r.x1
    return { ...r, z, h: activate(z), ok: activate(z) === r.t }
  })
  const solved = results.every((r) => r.ok)

  return (
    <LabBox>
      <LabNote>
        The NOT gate has one input, so the perceptron has two weights: w₀ riding on the constant input x₀ = 1, and w₁ on
        the real input. Two rows of the truth table become two conditions on those weights.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The truth table, rewritten as slide 55 rewrites it
            </div>
            <table className="w-full font-mono text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] tracking-[0.05em] text-zinc-500 uppercase">
                  <th className="pb-1.5 text-left">x₁</th>
                  <th className="pb-1.5 text-left">t</th>
                  <th className="pb-1.5 text-left">z = w₀ + w₁x₁</th>
                  <th className="pb-1.5 text-left">what it forces</th>
                  <th className="pb-1.5 text-left">h</th>
                  <th className="pb-1.5 text-left">ok</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-zinc-950/[0.06]">
                    <td className="py-1.5 tabular-nums">{r.x1}</td>
                    <td className="py-1.5 tabular-nums">{r.t}</td>
                    <td className="py-1.5 text-zinc-600">
                      {w0} + ({w1})({r.x1}) = {r.z}
                    </td>
                    <td className="py-1.5 text-zinc-600">{r.t > 0 ? 'w₀ − w₁ > 0' : 'w₀ + w₁ ≤ 0'}</td>
                    <td className="py-1.5 tabular-nums">{r.h}</td>
                    <td className="py-1.5 font-semibold" style={{ color: r.ok ? TEAL : RED }}>
                      {r.ok ? '✓' : '✗'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The number line the neuron actually sees
            </div>
            <div className="relative h-16">
              <div className="absolute top-8 right-0 left-0 h-0.5 bg-zinc-300" />
              {[-4, -2, 0, 2, 4].map((v) => (
                <span
                  key={v}
                  className="absolute top-10 -translate-x-1/2 font-mono text-[11px] text-zinc-400"
                  style={{ left: `${((v + 5) / 10) * 100}%` }}
                >
                  {v}
                </span>
              ))}
              <span
                className="absolute top-4 bottom-4 w-0.5"
                style={{ left: '50%', background: '#18181b' }}
                title="the threshold"
              />
              {results.map((r, i) => (
                <span
                  key={i}
                  className="absolute top-5 grid size-6 -translate-x-1/2 place-items-center rounded-full text-[11px] font-semibold text-white"
                  style={{
                    left: `${((clamp(r.z, -5, 5) + 5) / 10) * 100}%`,
                    background: r.ok ? TEAL : RED,
                  }}
                >
                  {r.t > 0 ? '+' : '−'}
                </span>
              ))}
            </div>
            <p className="text-[12.5px]/[1.65] text-zinc-600">
              The black bar is zero. The row wanting +1 has to land strictly right of it; the row wanting −1 has to land
              on it or to its left.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Rows satisfied"
            value={`${results.filter((r) => r.ok).length} of 2`}
            tone={solved ? TEAL : RED}
            note={solved ? `w₀ = ${w0}, w₁ = ${w1} works` : 'not there yet'}
          />
          <Slider
            label="w₀"
            value={w0}
            display={String(w0)}
            min={-4}
            max={4}
            step={1}
            hint="On the constant input x₀ = 1."
            onChange={setW0}
          />
          <Slider
            label="w₁"
            value={w1}
            display={String(w1)}
            min={-4}
            max={4}
            step={1}
            hint="On the real input."
            onChange={setW1}
          />
          <ReadOutGrid
            items={[
              { label: 'w₀ − w₁', value: String(w0 - w1) },
              { label: 'needs', value: '> 0' },
              { label: 'w₀ + w₁', value: String(w0 + w1) },
              { label: 'needs', value: '≤ 0' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn
              primary
              onClick={() => {
                setW0(1)
                setW1(-1)
              }}
            >
              The deck’s answer
            </Btn>
            <Btn
              onClick={() => {
                setW0(2)
                setW1(-2)
              }}
            >
              Twice the deck’s answer
            </Btn>
            <Btn
              onClick={() => {
                setW0(0)
                setW1(0)
              }}
            >
              Clear
            </Btn>
          </div>
          <PanelNote>
            Slide 56 writes the second condition as w₀ + w₁ {'<'} 0 and then gives w₀ = 1, w₁ = −1, which makes it
            exactly 0. It still works, because slide 53 sends z = 0 to −1 — so the condition the slide means is w₀ + w₁
            ≤ 0. Press the second button and see that doubling both weights satisfies the same two conditions.
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* The update rule                                                            */
/* ========================================================================== */

export function UpdateRuleLab() {
  const [eta, setEta] = useState(0.5)
  const [w, setW] = useState<[number, number, number]>([0, 0.5, -1])
  const [x1, setX1] = useState(1.4)
  const [x2, setX2] = useState(1.2)
  const [t, setT] = useState(1)

  const z = w[0] + w[1] * x1 + w[2] * x2
  const o = activate(z)
  const err = t - o
  const dw: [number, number, number] = [eta * err * 1, eta * err * x1, eta * err * x2]
  const after: [number, number, number] = [w[0] + dw[0], w[1] + dw[1], w[2] + dw[2]]
  const zAfter = after[0] + after[1] * x1 + after[2] * x2

  const draw = (g: CanvasRenderingContext2D, W: number, H: number): Frame => {
    const f = drawPlane(g, W, H, 3)
    const line = (ww: [number, number, number], colour: string, dash: boolean) => {
      if (ww[1] === 0 && ww[2] === 0) return
      g.strokeStyle = colour
      g.lineWidth = 2.5
      g.setLineDash(dash ? [5, 4] : [])
      g.beginPath()
      if (Math.abs(ww[2]) > 1e-9) {
        g.moveTo(f.px(-6), f.py(-(ww[0] + ww[1] * -6) / ww[2]))
        g.lineTo(f.px(6), f.py(-(ww[0] + ww[1] * 6) / ww[2]))
      } else {
        g.moveTo(f.px(-ww[0] / ww[1]), f.T)
        g.lineTo(f.px(-ww[0] / ww[1]), f.B)
      }
      g.stroke()
      g.setLineDash([])
    }
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    line(w, 'rgba(9,9,11,0.35)', true)
    line(after, accentColour(), false)
    g.restore()
    arrow(g, f.px(0), f.py(0), f.px(after[1]), f.py(after[2]), TEAL, 2.5)
    dot(g, f.px(x1), f.py(x2), 8, t > 0 ? '#18181b' : '#fff', t > 0 ? null : '#18181b')
    grip(g, f.px(x1), f.py(x2), o === t ? TEAL : RED, 12)
    return f
  }

  return (
    <LabBox>
      <LabNote>
        One training example and one update. Drag the example around; the dashed line is the boundary now, the solid one
        is where it would be after applying Δw.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="flex flex-col gap-3">
          <ChartCanvas
            draw={draw}
            candidates={() => []}
            tooltip={() => null}
            targets={{ x1, x2, a0: after[0], a1: after[1], a2: after[2] }}
            height={330}
            caption="Press anywhere to move the training example. Filled means its target is +1."
            handles={(f: Frame) => [{ id: 'x', px: f.px(x1), py: f.py(x2), grab: 'anywhere' as const }]}
            onDragTo={(_id, x, y) => {
              setX1(Math.round(clamp(x, -3, 3) * 10) / 10)
              setX2(Math.round(clamp(y, -3, 3) * 10) / 10)
            }}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4 font-mono text-[12.5px]/[1.9] text-zinc-800">
            <div>
              z = {w[0].toFixed(2)} + {w[1].toFixed(2)}×{x1.toFixed(1)} + {w[2].toFixed(2)}×{x2.toFixed(1)} ={' '}
              {z.toFixed(3)}
            </div>
            <div>
              o = sign(z) = {o}, t = {t}, so (t − o) = {err}
            </div>
            <div>
              Δw₀ = η(t − o)x₀ = {eta} × {err} × 1 = {dw[0].toFixed(3)}
            </div>
            <div>
              Δw₁ = η(t − o)x₁ = {eta} × {err} × {x1.toFixed(1)} = {dw[1].toFixed(3)}
            </div>
            <div>
              Δw₂ = η(t − o)x₂ = {eta} × {err} × {x2.toFixed(1)} = {dw[2].toFixed(3)}
            </div>
            <div className="border-t border-zinc-950/[0.08] pt-1" style={{ color: 'var(--acc)' }}>
              z after the update would be {zAfter.toFixed(3)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="t − o"
            value={String(err)}
            note={err === 0 ? 'right answer — nothing moves' : 'wrong answer — every weight moves'}
            tone={err === 0 ? TEAL : RED}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={t === 1} label="target +1" onClick={() => setT(1)} />
            <Chip on={t === -1} label="target −1" onClick={() => setT(-1)} />
          </div>
          <Slider
            label="Learning rate η"
            value={eta}
            display={eta.toFixed(2)}
            min={0.05}
            max={1.5}
            step={0.05}
            hint="Scales the whole update. It never changes its direction."
            onChange={setEta}
          />
          <ReadOutGrid
            items={[
              { label: 'Δw₀', value: dw[0].toFixed(3) },
              { label: 'Δw₁', value: dw[1].toFixed(3) },
              { label: 'Δw₂', value: dw[2].toFixed(3) },
              { label: 'moves z by', value: (zAfter - z).toFixed(3) },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setW(after)}>
              Apply the update
            </Btn>
            <Btn onClick={() => setW([0, 0.5, -1])}>Reset weights</Btn>
          </div>
          <Verdict ok={err === 0 || Math.sign(zAfter - z) === Math.sign(err)}>
            {err === 0
              ? 'The output already matches the target, so t − o is 0 and Δw is 0 for every weight. The perceptron rule only ever learns from mistakes.'
              : `The update pushes z ${err > 0 ? 'up' : 'down'} by ${Math.abs(zAfter - z).toFixed(3)} — towards the side the target wanted. One step may not be enough to cross zero; that is why the algorithm loops.`}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* The deck's own trace, reproduced                                           */
/* ========================================================================== */

const ETA = 1
const TRACE_ROWS: Array<{ x1: number; t: number }> = [
  { x1: -1, t: 1 },
  { x1: 1, t: -1 },
]

/** What slides 68 and 69 print, so the lab can be held against it. */
const DECK_TRACE = [
  { x1: -1, t: 1, w1: 0, w0: 0, z: 0, h: -1, equal: false, dw1: -2, dw0: 2, n1: -2, n0: 2 },
  { x1: 1, t: -1, w1: -2, w0: 2, z: 0, h: -1, equal: true, dw1: 0, dw0: 0, n1: -2, n0: 2 },
  { x1: -1, t: 1, w1: -2, w0: 2, z: 4, h: 1, equal: true, dw1: 0, dw0: 0, n1: -2, n0: 2 },
]

export function TraceLab() {
  const [steps, setSteps] = useState(0)

  // Rebuilt from scratch on every render, so the table can never hold a value
  // the rule did not produce.
  const trace: typeof DECK_TRACE = []
  let w0 = 0
  let w1 = 0
  for (let i = 0; i < steps; i++) {
    const { x1, t } = TRACE_ROWS[i % TRACE_ROWS.length]
    const z = w0 + w1 * x1
    const h = activate(z)
    const dw1 = ETA * (t - h) * x1
    const dw0 = ETA * (t - h) * 1
    trace.push({ x1, t, w1, w0, z, h, equal: t === h, dw1, dw0, n1: w1 + dw1, n0: w0 + dw0 })
    w1 += dw1
    w0 += dw0
  }

  const matches = trace.every((r, i) => {
    const d = DECK_TRACE[i]
    return !d || (r.z === d.z && r.h === d.h && r.dw0 === d.dw0 && r.dw1 === d.dw1 && r.n0 === d.n0 && r.n1 === d.n1)
  })
  const settled = trace.length >= 2 && trace.slice(-2).every((r) => r.equal)

  return (
    <LabBox>
      <LabNote>
        Start with w₀ = w₁ = 0 and η = 1, exactly as slide 68 sets it up, then press <strong>Next row</strong>. Each row
        is worked from the rule and nothing is stored, so what appears is what the rule produces.
      </LabNote>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          {trace.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-zinc-500">
              Nothing yet. Press Next row to take the first training example.
            </p>
          ) : (
            <table className="w-full font-mono text-[12px]">
              <thead>
                <tr className="text-[10px] tracking-[0.05em] text-zinc-500 uppercase">
                  <th className="pr-2 pb-1.5 text-left">x₁</th>
                  <th className="pr-2 pb-1.5 text-left">t</th>
                  <th className="pr-2 pb-1.5 text-left">w₁</th>
                  <th className="pr-2 pb-1.5 text-left">w₀</th>
                  <th className="pr-2 pb-1.5 text-left">z</th>
                  <th className="pr-2 pb-1.5 text-left">h</th>
                  <th className="pr-2 pb-1.5 text-left">t = h?</th>
                  <th className="pr-2 pb-1.5 text-left">Δw</th>
                  <th className="pr-2 pb-1.5 text-left">new w</th>
                  <th className="pb-1.5 text-left">deck</th>
                </tr>
              </thead>
              <tbody>
                {trace.map((r, i) => {
                  const d = DECK_TRACE[i]
                  const same =
                    d &&
                    r.z === d.z &&
                    r.h === d.h &&
                    r.dw0 === d.dw0 &&
                    r.dw1 === d.dw1 &&
                    r.n0 === d.n0 &&
                    r.n1 === d.n1
                  return (
                    <tr key={i} className="border-t border-zinc-950/[0.06]">
                      <td className="py-1.5 pr-2 tabular-nums">{r.x1}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.t}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.w1}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.w0}</td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {r.w0} + ({r.w1})({r.x1}) = {r.z}
                      </td>
                      <td className="py-1.5 pr-2 tabular-nums">{r.h}</td>
                      <td className="py-1.5 pr-2" style={{ color: r.equal ? TEAL : RED }}>
                        {r.equal ? 'Yes' : 'No'}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        Δw₁ = {r.dw1}, Δw₀ = {r.dw0}
                      </td>
                      <td className="py-1.5 pr-2 tabular-nums">
                        w₁ = {r.n1}, w₀ = {r.n0}
                      </td>
                      <td className="py-1.5 font-semibold" style={{ color: d ? (same ? TEAL : RED) : '#a1a1aa' }}>
                        {d ? (same ? '✓ matches' : '✗ differs') : 'not printed'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Weights now"
            value={`w₀ = ${w0}, w₁ = ${w1}`}
            note={`after ${steps} row${steps === 1 ? '' : 's'}`}
          />
          <div className="flex flex-wrap gap-2">
            <Btn primary onClick={() => setSteps((s) => Math.min(s + 1, 8))}>
              Next row
            </Btn>
            <Btn onClick={() => setSteps(3)}>Jump to the deck’s last row</Btn>
            <Btn onClick={() => setSteps(0)}>Reset</Btn>
          </div>
          <Verdict ok={matches}>
            {matches
              ? 'Every row the deck prints is reproduced here by running the rule, not by copying the numbers.'
              : 'A row does not match the deck. That is a bug on this page, not in the deck.'}
          </Verdict>
          <ReadOutGrid
            items={[
              { label: 'η', value: String(ETA) },
              { label: 'rows done', value: String(steps) },
              { label: 'w₀', value: String(w0) },
              { label: 'w₁', value: String(w1) },
            ]}
          />
          <PanelNote>
            {settled
              ? 'Two rows in a row with t = h and no change to the weights: the algorithm has converged, and w₀ = 2, w₁ = −2 is the answer. That is twice the hand solution from the earlier page — the same boundary, written at twice the scale.'
              : 'Keep pressing. When a whole pass over the data changes nothing, the algorithm has converged.'}
          </PanelNote>
        </div>
      </div>
    </LabBox>
  )
}
