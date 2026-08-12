'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { LabBox } from '@/components/charts/matrix-ui'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/* ========================================================================== */
/* Two events as two circles, where area really is probability                */
/* ========================================================================== */

/**
 * The overlap is not a number typed into a box — it is the actual overlapping
 * area of two circles you drag. So P(A ∪ B) = P(A) + P(B) − P(A ∩ B) stops
 * being a formula to remember and becomes a thing you can see: the middle bit
 * got counted twice, so take it off once.
 */
export function lensArea(r1: number, r2: number, d: number) {
  if (d >= r1 + r2) return 0
  if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2
  const a = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1))
  const b = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2))
  const c = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2))
  return a + b - c
}

export function VennLab({ mode = 'addition' }: { mode?: 'addition' | 'exclusive' | 'solve' }) {
  const [pa, setPa] = useState(0.4)
  const [pb, setPb] = useState(0.3)
  const [ax, setAx] = useState(0.36)
  const [bx, setBx] = useState(0.62)

  // The whole box is the sample space, so its area stands for probability 1.
  // A circle of probability p therefore needs area p, and radius √(p/π) in the
  // same units. Drag the circles and the overlap is a real geometric area.
  const rA = Math.sqrt(pa / Math.PI)
  const rB = Math.sqrt(pb / Math.PI)
  const d = Math.abs(bx - ax)
  const both = lensArea(rA, rB, d)
  const either = pa + pb - both
  const onlyA = pa - both
  const onlyB = pb - both
  const neither = Math.max(0, 1 - either)

  const exclusive = both < 1e-4
  const independentish = Math.abs(both - pa * pb) < 0.005

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 22
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    // One probability unit of area maps to the whole box.
    const scale = Math.sqrt((boxW * boxH) / 1)
    const cy = pad + boxH / 2

    g.fillStyle = 'rgba(9,9,11,0.035)'
    g.fillRect(pad, pad, boxW, boxH)
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'left'
    g.fillText('S — everything that could happen', pad + 8, pad + 14)

    const cxA = pad + ax * boxW
    const cxB = pad + bx * boxW
    const rAp = rA * scale
    const rBp = rB * scale

    g.save()
    g.beginPath()
    g.rect(pad, pad, boxW, boxH)
    g.clip()

    g.globalAlpha = 0.4
    g.fillStyle = acc
    g.beginPath()
    g.arc(cxA, cy, rAp, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = TEAL
    g.beginPath()
    g.arc(cxB, cy, rBp, 0, Math.PI * 2)
    g.fill()
    g.globalAlpha = 1

    g.lineWidth = 2.5
    g.strokeStyle = acc
    g.beginPath()
    g.arc(cxA, cy, rAp, 0, Math.PI * 2)
    g.stroke()
    g.strokeStyle = TEAL
    g.beginPath()
    g.arc(cxB, cy, rBp, 0, Math.PI * 2)
    g.stroke()
    g.restore()

    g.textAlign = 'center'
    g.font = 'bold 15px Inter, sans-serif'
    g.fillStyle = acc
    g.fillText('A', cxA - rAp * 0.45, cy)
    g.fillStyle = TEAL
    g.fillText('B', cxB + rBp * 0.45, cy)
    g.font = '11px Inter, sans-serif'

    if (both > 0.004) {
      g.fillStyle = '#18181b'
      g.fillText('A ∩ B', (cxA + cxB) / 2, cy + rAp * 0.15 + 26)
    }

    const fr: Frame = {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v) => pad + v * boxW,
      py: () => cy,
      ux: (p) => (p - pad) / boxW,
      uy: () => 0,
    }
    return fr
  }

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pa, pb, ax, bx }}
          handles={(f: Frame) => [
            { id: 'a', px: f.px(ax), py: f.B / 2 + f.T / 2 },
            { id: 'b', px: f.px(bx), py: f.B / 2 + f.T / 2 },
          ]}
          onDragTo={(id, x) => {
            const v = clamp(x, 0.08, 0.92)
            if (id === 'a') setAx(Math.min(v, bx))
            else setBx(Math.max(v, ax))
          }}
          caption="Drag either circle sideways. The area of each one is its probability, so the bit where they overlap is P(A ∩ B) — a real area, not a number someone typed in."
        />
      }
      panel={
        <>
          {mode === 'exclusive' ? (
            <ReadOut
              label="Are they mutually exclusive?"
              value={exclusive ? 'Yes' : 'No'}
              tone={exclusive ? TEAL : '#09090b'}
              note={
                exclusive
                  ? 'The circles do not touch. There is no outcome that is in both, so P(A ∩ B) = 0.'
                  : 'They overlap, so some outcomes are in both. Pull them apart until they separate.'
              }
            />
          ) : (
            <ReadOut
              label="P(A ∪ B) — A or B or both"
              value={pct(either)}
              note="Add the two circles, then take the overlap off once because you counted it twice."
            />
          )}

          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The addition rule, live
            </div>
            <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`P(A)      = ${pct(pa).padStart(6)}
P(B)      = ${pct(pb).padStart(6)}
P(A ∩ B)  = ${pct(both).padStart(6)}   ← counted twice
──────────────────────
P(A ∪ B)  = ${pct(pa).replace('%', '')} + ${pct(pb).replace('%', '')} − ${pct(both).replace('%', '')}
          = ${pct(either)}`}
            </div>
          </div>

          <Slider
            label="P(A)"
            value={pa}
            display={pct(pa)}
            min={0.05}
            max={0.6}
            step={0.01}
            hint="Bigger probability, bigger circle."
            onChange={setPa}
          />
          <Slider
            label="P(B)"
            value={pb}
            display={pct(pb)}
            min={0.05}
            max={0.6}
            step={0.01}
            hint="Same again for the teal one."
            onChange={setPb}
          />

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]">
            {[
              ['A but not B', pct(onlyA)],
              ['B but not A', pct(onlyB)],
              ['both', pct(both)],
              ['neither', pct(neither)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-600">{k}</span>
                <span className="font-mono font-semibold text-zinc-950">{v}</span>
              </div>
            ))}
            <div className="mt-1 border-t border-zinc-950/[0.08] pt-1.5 text-[11.5px]/[1.5] text-zinc-500">
              Those four add up to 100%, whatever you drag. Every outcome is in exactly one of them.
            </div>
          </div>

          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setAx(0.36)
                setBx(0.62)
                setPa(0.4)
                setPb(0.3)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton
              onClick={() => {
                setAx(0.22)
                setBx(0.78)
              }}
            >
              Pull them apart
            </PanelButton>
          </PanelButtons>

          <PanelNote>
            {mode === 'exclusive' ? (
              <>
                When they do not touch, the overlap is zero and the rule loses its last term:{' '}
                <strong>P(A ∪ B) = P(A) + P(B)</strong>. That is the only thing “mutually exclusive” buys you.
              </>
            ) : independentish ? (
              <>
                Right now the overlap happens to be about P(A) × P(B) = {pct(pa * pb)}, so these two are roughly{' '}
                <strong>independent</strong>. Notice they still overlap — independent is not the same as mutually
                exclusive.
              </>
            ) : (
              <>
                If you had just added P(A) and P(B) you would have got {pct(pa + pb)}, which is too big. The middle bit
                went in twice. Taking it off once fixes it.
              </>
            )}
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Classical vs empirical: run it enough times and they meet                   */
/* ========================================================================== */

const TRIALS = [
  { id: 'coin', name: 'Flip a coin — heads?', sides: 2, wanted: 1, exact: '1/2' },
  { id: 'die', name: 'Roll a die — a six?', sides: 6, wanted: 1, exact: '1/6' },
  { id: 'even', name: 'Roll a die — an even number?', sides: 6, wanted: 3, exact: '1/2' },
  { id: 'card', name: 'Draw a card — a heart?', sides: 4, wanted: 1, exact: '1/4' },
]

/**
 * The classical definition says count the outcomes; the empirical one says run
 * it and see. They are two different definitions and students often assume one
 * is "the real one". Watching the empirical line wander and then settle onto
 * the classical value shows how they are related without anybody claiming a
 * proof.
 */
export function ConvergeLab() {
  const [pick, setPick] = useState('die')
  const t = TRIALS.find((x) => x.id === pick) ?? TRIALS[1]
  const truth = t.wanted / t.sides

  const [runs, setRuns] = useState(0)
  const [hits, setHits] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const [seed, setSeed] = useState(12345)

  function go(times: number) {
    let s = seed
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648
      return s / 2147483648
    }
    let h = hits
    let r = runs
    const hist = [...history]
    for (let i = 0; i < times; i++) {
      r++
      if (Math.floor(rnd() * t.sides) < t.wanted) h++
      if (r % Math.max(1, Math.floor(times / 200)) === 0 || times === 1) hist.push(h / r)
    }
    setSeed(s)
    setRuns(r)
    setHits(h)
    setHistory(hist.slice(-400))
  }

  function reset(id?: string) {
    if (id) setPick(id)
    setRuns(0)
    setHits(0)
    setHistory([])
  }

  const observed = runs ? hits / runs : 0

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const L = 44
    const R = W - 16
    const T = 18
    const B = H - 30
    const yOf = (p: number) => B - p * (B - T)

    g.strokeStyle = 'rgba(9,9,11,0.08)'
    g.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = T + (i / 4) * (B - T)
      g.beginPath()
      g.moveTo(L, y)
      g.lineTo(R, y)
      g.stroke()
      g.fillStyle = '#a1a1aa'
      g.textAlign = 'right'
      g.fillText(`${(100 - i * 25).toFixed(0)}%`, L - 8, y)
    }

    g.strokeStyle = TEAL
    g.lineWidth = 2
    g.setLineDash([6, 4])
    g.beginPath()
    g.moveTo(L, yOf(truth))
    g.lineTo(R, yOf(truth))
    g.stroke()
    g.setLineDash([])
    g.fillStyle = TEAL
    g.textAlign = 'left'
    g.fillText(`counting says ${t.exact} = ${(truth * 100).toFixed(1)}%`, L + 6, yOf(truth) - 7)

    if (history.length > 1) {
      g.strokeStyle = acc
      g.lineWidth = 2.5
      g.beginPath()
      history.forEach((p, i) => {
        const x = L + (i / (history.length - 1)) * (R - L)
        if (i) g.lineTo(x, yOf(p))
        else g.moveTo(x, yOf(p))
      })
      g.stroke()
    }

    g.fillStyle = '#71717a'
    g.textAlign = 'center'
    g.fillText(runs ? `${runs} runs so far` : 'press “Run it once” to start', (L + R) / 2, B + 18)

    const fr: Frame = { L, R, T, B, px: (v) => v, py: (v) => v, ux: (p) => p, uy: (p) => p }
    return fr
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ observed }}
          jumpKey={pick}
          caption="The dashed line is what counting the outcomes says. The solid line is what actually happened, run by run."
        />
      }
      panel={
        <>
          <ReadOut
            label="What actually happened"
            value={runs ? `${(observed * 100).toFixed(1)}%` : '—'}
            tone={runs && Math.abs(observed - truth) < 0.02 ? TEAL : '#09090b'}
            note={
              runs === 0
                ? 'Nothing run yet.'
                : `${hits} hits out of ${runs} runs. Counting says ${(truth * 100).toFixed(1)}%.`
            }
          />
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The experiment</div>
            {TRIALS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => reset(x.id)}
                className={
                  'cursor-pointer rounded-md border px-2.5 py-2 text-left text-[12px] font-semibold ' +
                  (x.id === pick
                    ? 'border-zinc-950/90 bg-zinc-900 text-white'
                    : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]')
                }
              >
                {x.name}
              </button>
            ))}
          </div>
          <PanelButtons>
            <PanelButton primary onClick={() => go(1)}>
              Run it once
            </PanelButton>
            <PanelButton onClick={() => go(1000)}>Run 1000</PanelButton>
          </PanelButtons>
          <PanelButtons>
            <PanelButton onClick={() => reset()}>Start over</PanelButton>
          </PanelButtons>
          <PanelNote>
            Run it once and the answer is 0% or 100% — useless. Run it a few times and it lurches about. Run it a
            thousand times and it settles onto the counted answer. That is the difference between the{' '}
            <strong>empirical</strong> and the <strong>classical</strong> definitions, and why one needs a lot of data.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Is this a permissible assignment of probability?                            */
/* ========================================================================== */

const CASES = [
  { id: 'a', label: '(a)', vals: [0.38, 0.16, 0.11, 0.35], txt: ['0.38', '0.16', '0.11', '0.35'] },
  { id: 'b', label: '(b)', vals: [0.31, 0.27, 0.28, 0.16], txt: ['0.31', '0.27', '0.28', '0.16'] },
  { id: 'c', label: '(c)', vals: [0.32, 0.27, -0.06, 0.47], txt: ['0.32', '0.27', '−0.06', '0.47'] },
  { id: 'd', label: '(d)', vals: [1 / 2, 1 / 4, 1 / 8, 1 / 16], txt: ['1/2', '1/4', '1/8', '1/16'] },
  { id: 'e', label: '(e)', vals: [5 / 8, 1 / 6, 1 / 3, 2 / 9], txt: ['5/8', '1/6', '1/3', '2/9'] },
]

/**
 * Example 1 from the slides, made checkable. Each case fails a specific axiom,
 * and naming which one is the actual skill being taught — "NOT permissible" on
 * its own teaches nothing.
 */
export function AxiomLab() {
  const [pick, setPick] = useState('a')
  const c = CASES.find((x) => x.id === pick) ?? CASES[0]
  const total = c.vals.reduce((s, v) => s + v, 0)
  const negative = c.vals.some((v) => v < 0)
  const overOne = c.vals.some((v) => v > 1)
  const sumOk = Math.abs(total - 1) < 1e-9
  const ok = !negative && !overOne && sumOk

  return (
    <LabBox>
      <p className="text-[13px]/[1.65] text-zinc-700">
        An experiment has four outcomes A, B, C and D, and no two can happen together. Pick an assignment and see
        whether it is allowed — and if not, which rule it breaks.
      </p>

      <div className="flex flex-wrap gap-2">
        {CASES.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setPick(x.id)}
            className={
              'cursor-pointer rounded-md border px-2.5 py-1.5 font-mono text-[12px] font-semibold ' +
              (x.id === pick
                ? 'border-zinc-950/90 bg-zinc-900 text-white'
                : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]')
            }
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['A', 'B', 'C', 'D'].map((name, i) => (
          <div
            key={name}
            className="min-w-[92px] rounded-lg border p-3"
            style={
              c.vals[i] < 0 || c.vals[i] > 1
                ? { borderColor: RED, background: 'rgba(220,38,38,0.07)' }
                : { borderColor: 'rgba(9,9,11,0.1)', background: '#fff' }
            }
          >
            <div className="text-[11px] font-semibold text-zinc-500">P({name})</div>
            <div className="font-mono text-[16px] font-semibold text-zinc-950">{c.txt[i]}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-2 font-mono text-[13px] text-zinc-800">
          they add up to {total.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
        </div>
        <div className="flex flex-col gap-1.5 text-[13px]/[1.6]">
          <Check ok={!negative && !overOne} text="Every probability is between 0 and 1" />
          <Check ok={sumOk} text="They add up to exactly 1" />
        </div>
        <div className="mt-3 text-[14px] font-semibold" style={{ color: ok ? TEAL : RED }}>
          {ok ? 'Permissible.' : 'Not permissible.'}
        </div>
        <p className="mt-1 text-[13px]/[1.65] text-zinc-700">
          {ok
            ? 'Nothing is negative, nothing is over 1, and the four add up to exactly 1. Since the outcomes cover everything and cannot happen together, that is all that is required.'
            : negative
              ? 'One of them is negative. Probability measures how likely something is, and nothing can be less likely than impossible, so a negative value is meaningless.'
              : overOne
                ? 'One of them is bigger than 1, which would be more certain than certain.'
                : total > 1
                  ? `They add up to ${total.toFixed(3)}, which is more than 1. The four outcomes are everything that can happen, so their probabilities have to come to exactly 1 — no more.`
                  : `They only add up to ${total.toFixed(3)}. The four outcomes are everything that can happen, so something is missing: where does the other ${(1 - total).toFixed(3)} go?`}
        </p>
      </div>

      <PanelNote>
        These are the axioms in action. P(S) = 1, every P(E) sits between 0 and 1, and for events that cannot happen
        together the probabilities simply add. Everything else in probability is built on those three.
      </PanelNote>
    </LabBox>
  )
}

function Check({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid size-[18px] shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
        style={{ background: ok ? TEAL : RED }}
      >
        {ok ? '✓' : '✕'}
      </span>
      <span className="text-zinc-700">{text}</span>
    </div>
  )
}
