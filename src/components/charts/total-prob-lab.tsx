'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets } from '@/components/charts/matrix-ui'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const SLICE = ['#0d9488', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6']

/* ========================================================================== */
/* 12 · Cutting the sample space into slices                                  */
/* ========================================================================== */

/**
 * The partition picture on slide 27, but with the cuts in the reader's hands.
 *
 * B is a circle, so the slice areas are worked out in closed form rather than
 * counted off pixels: the area of a disc to the left of a vertical line has an
 * exact expression, and differencing it at the two cuts gives P(B ∩ Aᵢ)
 * exactly. That matters here, because the whole point of the picture is that
 * the pieces add back up to P(B) with nothing left over.
 */
function discLeftOf(x: number, cx: number, r: number) {
  const s = clamp(x - cx, -r, r)
  return s * Math.sqrt(Math.max(0, r * r - s * s)) + r * r * Math.asin(s / r) + (Math.PI * r * r) / 2
}

export function PartitionLab() {
  const [cuts, setCuts] = useState([0.3, 0.55, 0.78])
  const [k, setK] = useState(4)

  // Only the first k−1 cuts are in play, and they are kept in order so a slice
  // can never end up with negative width.
  const active = cuts.slice(0, k - 1)
  const bounds = [0, ...active, 1]
  const widths = bounds.slice(1).map((b, i) => b - bounds[i])

  // B is a fixed disc; its probability is its area, so it is the same number
  // however the cuts move — which is exactly what the lab is demonstrating.
  const BR = Math.sqrt(0.22 / Math.PI)
  const BCX = 0.5
  const pieces = bounds.slice(1).map((b, i) => discLeftOf(b, BCX, BR) - discLeftOf(bounds[i], BCX, BR))
  const pB = pieces.reduce((a, v) => a + v, 0)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 26
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cy = pad + boxH / 2
    // Area on screen has to mean probability, so the disc is scaled by the
    // geometric mean of the box sides, the same convention as the Venn labs.
    const scale = Math.sqrt(boxW * boxH)

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    for (let i = 0; i < k; i++) {
      g.fillStyle = SLICE[i % SLICE.length]
      g.globalAlpha = 0.16
      g.fillRect(pad + bounds[i] * boxW, pad, widths[i] * boxW, boxH)
      g.globalAlpha = 1
      g.fillStyle = SLICE[i % SLICE.length]
      g.textAlign = 'center'
      g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
      if (widths[i] > 0.06) g.fillText(`A${i + 1}`, pad + (bounds[i] + widths[i] / 2) * boxW, pad + 18)
    }

    // B, drawn over the slices, then re-drawn slice by slice so each piece
    // takes its slice's colour — that is the picture the proof needs.
    const bcx = pad + BCX * boxW
    const br = BR * scale
    for (let i = 0; i < k; i++) {
      g.save()
      g.beginPath()
      g.rect(pad + bounds[i] * boxW, pad, widths[i] * boxW, boxH)
      g.clip()
      g.beginPath()
      g.arc(bcx, cy, br, 0, Math.PI * 2)
      g.fillStyle = SLICE[i % SLICE.length]
      g.globalAlpha = 0.72
      g.fill()
      g.restore()
      g.globalAlpha = 1
    }
    g.beginPath()
    g.arc(bcx, cy, br, 0, Math.PI * 2)
    g.strokeStyle = '#09090b'
    g.lineWidth = 2
    g.stroke()
    g.fillStyle = '#09090b'
    g.font = '600 14px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillText('B', bcx, cy - br - 9)

    for (let i = 1; i < k; i++) {
      const x = pad + bounds[i] * boxW
      g.strokeStyle = '#09090b'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(x, pad)
      g.lineTo(x, pad + boxH)
      g.stroke()
    }

    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)
    g.fillStyle = '#71717a'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'left'
    g.fillText('S — the slices cover all of it and never overlap', pad + 6, pad + boxH - 8)

    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: () => cy,
      ux: (p: number) => (p - pad) / boxW,
      uy: () => 0,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ k, c0: bounds[1] ?? 0, c1: bounds[2] ?? 0, c2: bounds[3] ?? 0 }}
          jumpKey={k}
          handles={(f: Frame) =>
            active.map((c, i) => ({
              id: `c${i}`,
              px: f.px(c),
              py: (f.T + f.B) / 2,
              label: `cut ${i + 1} between A${i + 1} and A${i + 2}`,
            }))
          }
          onDragTo={(id, x) => {
            const i = Number(id.slice(1))
            setCuts((old) => {
              const next = [...old]
              const lo = i === 0 ? 0.04 : next[i - 1] + 0.04
              const hi = i >= k - 2 ? 0.96 : next[i + 1] - 0.04
              next[i] = clamp(x, lo, Math.max(lo, hi))
              return next
            })
          }}
          caption="Drag a cut. B does not move and its area never changes — but the way it is carved up does, and the pieces always add back to the same total."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(B), added up from the pieces"
            value={pB.toFixed(4)}
            tone={TEAL}
            note="Move any cut and the individual pieces change while this does not."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Slice by slice
            </div>
            <div className="font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
              {widths
                .map((w, i) => `A${i + 1}:  P = ${w.toFixed(3)}   P(B ∩ A${i + 1}) = ${pieces[i].toFixed(4)}`)
                .join('\n')}
              {`\n────────────────────────────────\nsum   ${widths.reduce((a, v) => a + v, 0).toFixed(3)}                ${pB.toFixed(4)}`}
            </div>
          </div>
          <Slider
            label="How many slices"
            value={k}
            display={String(k)}
            min={2}
            max={4}
            step={1}
            hint="Any number will do, so long as they cover S and none of them overlap."
            onChange={setK}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setCuts([0.3, 0.55, 0.78])
                setK(4)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton onClick={() => setCuts([0.08, 0.14, 0.2])}>Squash them left</PanelButton>
          </PanelButtons>
          <PanelNote>
            The two conditions have names worth learning. <strong>Mutually exclusive</strong> is that no two slices
            overlap; <strong>exhaustive</strong> is that together they leave nothing out. Break either one and the sum
            below stops matching P(B) — which is the whole reason the theorem needs both.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 13 · The proof, one line at a time                                         */
/* ========================================================================== */

const PROOF: Array<{ line: string; why: string; note: string }> = [
  {
    line: 'S = A₁ ∪ A₂ ∪ … ∪ Aₖ,   Aᵢ ∩ Aⱼ = ∅',
    why: 'given',
    note: 'This is all the theorem assumes. The slices cover everything and never overlap — that is what a partition is.',
  },
  {
    line: 'B = B ∩ S',
    why: 'because B is inside S',
    note: 'A free move that looks like it does nothing. It is the whole trick: it lets the partition into the expression.',
  },
  {
    line: 'B = B ∩ (A₁ ∪ A₂ ∪ … ∪ Aₖ)',
    why: 'substitute the first line',
    note: 'Now S has been replaced by the slices, and the rest is set algebra.',
  },
  {
    line: 'B = (B ∩ A₁) ∪ (B ∩ A₂) ∪ … ∪ (B ∩ Aₖ)',
    why: 'distributive law',
    note: 'Board page 10 draws this one for two slices: intersecting with a union is the same as taking the unions of the intersections.',
  },
  {
    line: 'P(B) = P(B ∩ A₁) + P(B ∩ A₂) + … + P(B ∩ Aₖ)',
    why: 'third axiom',
    note: 'Allowed only because the pieces are mutually exclusive. Board page 13 proves that: an outcome in two pieces would put A₁ and A₂ in the same place, and they are disjoint.',
  },
  {
    line: 'P(B) = Σ P(Aᵢ) · P(B | Aᵢ)',
    why: 'multiplication rule on each term',
    note: 'The last step swaps each intersection for the product from part 3. That is the form you actually use, because a question gives you the branch probabilities, not the overlaps.',
  },
]

export function TotalProofLab() {
  const [at, setAt] = useState(1)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 22
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cy = pad + boxH / 2
    const scale = Math.sqrt(boxW * boxH)
    const bounds = [0, 0.28, 0.55, 0.8, 1]
    const BR = Math.sqrt(0.2 / Math.PI) * scale
    const bcx = pad + 0.5 * boxW

    // Which of the six lines is showing decides what the picture emphasises:
    // the slices alone, then B on top, then B carved up.
    const showSlices = at >= 1
    const showB = at >= 2
    const carved = at >= 4

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    if (showSlices) {
      for (let i = 0; i < 4; i++) {
        g.fillStyle = SLICE[i % SLICE.length]
        g.globalAlpha = 0.15
        g.fillRect(pad + bounds[i] * boxW, pad, (bounds[i + 1] - bounds[i]) * boxW, boxH)
        g.globalAlpha = 1
        g.fillStyle = SLICE[i % SLICE.length]
        g.textAlign = 'center'
        g.font = '600 12.5px ui-sans-serif, system-ui, sans-serif'
        g.fillText(`A${i + 1}`, pad + ((bounds[i] + bounds[i + 1]) / 2) * boxW, pad + 17)
      }
    }
    if (showB) {
      if (carved) {
        for (let i = 0; i < 4; i++) {
          g.save()
          g.beginPath()
          g.rect(pad + bounds[i] * boxW, pad, (bounds[i + 1] - bounds[i]) * boxW, boxH)
          g.clip()
          g.beginPath()
          g.arc(bcx, cy, BR, 0, Math.PI * 2)
          g.fillStyle = SLICE[i % SLICE.length]
          g.globalAlpha = 0.75
          g.fill()
          g.restore()
          g.globalAlpha = 1
        }
      } else {
        g.beginPath()
        g.arc(bcx, cy, BR, 0, Math.PI * 2)
        g.fillStyle = 'rgba(9,9,11,0.16)'
        g.fill()
      }
      g.beginPath()
      g.arc(bcx, cy, BR, 0, Math.PI * 2)
      g.strokeStyle = '#09090b'
      g.lineWidth = 2
      g.stroke()
      g.fillStyle = '#09090b'
      g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText('B', bcx, cy - BR - 8)
    }
    if (showSlices) {
      for (let i = 1; i < 4; i++) {
        g.strokeStyle = '#09090b'
        g.lineWidth = 1.5
        g.beginPath()
        g.moveTo(pad + bounds[i] * boxW, pad)
        g.lineTo(pad + bounds[i] * boxW, pad + boxH)
        g.stroke()
      }
    }
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)

    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: () => cy,
      ux: (p: number) => (p - pad) / boxW,
      uy: () => 0,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={260}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ at }}
          jumpKey={at}
          caption="The picture keeps up with the algebra: the slices first, then B laid over them, then B carved into the pieces the proof adds up."
        />
      }
      panel={
        <>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Line {at} of {PROOF.length}
            </div>
            <div className="overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {PROOF.slice(0, at)
                .map((s, i) => `${i + 1}.  ${s.line}`)
                .join('\n')}
            </div>
          </div>
          <ReadOut label="Justified by" value={PROOF[at - 1].why} note={PROOF[at - 1].note} />
          <PanelButtons>
            <PanelButton primary onClick={() => setAt((v) => Math.min(PROOF.length, v + 1))}>
              {at < PROOF.length ? 'Next line' : 'Proof complete'}
            </PanelButton>
            <PanelButton onClick={() => setAt(1)}>Start again</PanelButton>
          </PanelButtons>
          <PanelNote>
            Two of the six lines are the ones people drop in an exam. Line 2 looks like it achieves nothing, and line 5
            is only legal because the pieces are disjoint. Say both out loud and the proof is yours.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 14 · Total probability, on the lecture's own numbers                       */
/* ========================================================================== */

interface Branch {
  name: string
  pa: number
  pba: number
}
interface Case {
  id: string
  label: string
  event: string
  branches: Branch[]
  /** What the deck prints as the answer, so the lab can be checked against it. */
  printed: number
}

const CASES: Case[] = [
  {
    id: 'gas',
    label: 'Petrol station',
    event: 'fills the tank',
    branches: [
      { name: 'regular', pa: 0.4, pba: 0.3 },
      { name: 'plus', pa: 0.35, pba: 0.6 },
      { name: 'premium', pa: 0.25, pba: 0.5 },
    ],
    printed: 0.455,
  },
  {
    id: 'ads',
    label: 'Ad clicks by device',
    event: 'clicks the ad',
    branches: [
      { name: 'desktop', pa: 0.5, pba: 0.04 },
      { name: 'tablet', pa: 0.2, pba: 0.06 },
      { name: 'mobile', pa: 0.3, pba: 0.1 },
    ],
    printed: 0.062,
  },
  {
    id: 'forest',
    label: 'Poisonous plants',
    event: 'the plant is poisonous',
    branches: [
      { name: 'forest A', pa: 0.5, pba: 0.2 },
      { name: 'forest B', pa: 0.3, pba: 0.4 },
      { name: 'forest C', pa: 0.2, pba: 0.7 },
    ],
    printed: 0.36,
  },
  {
    id: 'mining',
    label: 'Mining job on time',
    event: 'finished on time',
    branches: [
      { name: 'it rains', pa: 0.45, pba: 0.42 },
      { name: 'it does not', pa: 0.55, pba: 0.9 },
    ],
    printed: 0.684,
  },
]

export function TotalProbLab() {
  const [at, setAt] = useState('gas')
  const [branches, setBranches] = useState<Branch[]>(CASES[0].branches)

  const cse = CASES.find((c) => c.id === at) ?? CASES[0]
  const terms = branches.map((b) => b.pa * b.pba)
  const pB = terms.reduce((a, v) => a + v, 0)
  const massSum = branches.reduce((a, b) => a + b.pa, 0)
  const partitionOk = Math.abs(massSum - 1) < 0.0005

  const pick = (id: string) => {
    const c = CASES.find((x) => x.id === id)
    if (!c) return
    setAt(id)
    setBranches(c.branches.map((b) => ({ ...b })))
  }
  const edit = (i: number, key: 'pa' | 'pba', v: number) =>
    setBranches((old) => old.map((b, j) => (j === i ? { ...b, [key]: v } : b)))

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 26
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const n = branches.length
    const rootX = pad + 14
    const midX = pad + boxW * 0.44
    const endX = pad + boxW - 76
    const cy = pad + boxH / 2

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    g.fillStyle = '#09090b'
    g.beginPath()
    g.arc(rootX, cy, 5, 0, Math.PI * 2)
    g.fill()

    for (let i = 0; i < n; i++) {
      const y = pad + 34 + ((boxH - 68) * i) / Math.max(1, n - 1)
      const colour = SLICE[i % SLICE.length]
      g.strokeStyle = colour
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(rootX, cy)
      g.lineTo(midX, y)
      g.stroke()
      g.fillStyle = colour
      g.textAlign = 'center'
      g.font = '11.5px ui-monospace, monospace'
      g.fillText(branches[i].pa.toFixed(2), (rootX + midX) / 2, (cy + y) / 2 - 6)

      g.textAlign = 'left'
      g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
      g.fillStyle = '#3f3f46'
      g.fillText(branches[i].name, midX + 6, y - 7)

      g.strokeStyle = acc
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(midX, y)
      g.lineTo(endX, y)
      g.stroke()
      g.fillStyle = acc
      g.textAlign = 'center'
      g.font = '11.5px ui-monospace, monospace'
      g.fillText(branches[i].pba.toFixed(2), (midX + endX) / 2, y + 15)

      g.textAlign = 'left'
      g.fillStyle = '#09090b'
      g.font = '600 12px ui-monospace, monospace'
      g.fillText(terms[i].toFixed(4), endX + 8, y + 4)
    }

    g.textAlign = 'left'
    g.fillStyle = '#a1a1aa'
    g.font = '11px ui-sans-serif, system-ui, sans-serif'
    g.fillText('P(Aᵢ)', (rootX + midX) / 2 - 12, pad + 12)
    g.fillText('P(B | Aᵢ)', (midX + endX) / 2 - 20, pad + 12)
    g.fillText('product', endX + 8, pad + 12)

    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => pad + v * boxH,
      ux: (p: number) => (p - pad) / boxW,
      uy: (p: number) => (p - pad) / boxH,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={300}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ n: branches.length, sum: pB }}
          jumpKey={`${at}-${branches.length}`}
          caption="One route to the event per branch. Multiply along each route, then add the routes up — that is the whole theorem."
        />
      }
      panel={
        <>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Which example
            </div>
            <Presets items={CASES.map((c) => ({ id: c.id, label: c.label }))} at={at} onPick={pick} />
          </div>
          <ReadOut
            label={`P(${cse.event})`}
            value={pB.toFixed(4)}
            tone={TEAL}
            note={`The slides print ${cse.printed} for this one.`}
          />
          {branches.map((b, i) => (
            <Slider
              key={b.name}
              label={`P(${cse.event} | ${b.name})`}
              value={b.pba}
              display={b.pba.toFixed(2)}
              min={0}
              max={1}
              step={0.01}
              hint={`Weighted by P(${b.name}) = ${b.pa.toFixed(2)}, contributing ${terms[i].toFixed(4)}.`}
              onChange={(v) => edit(i, 'pba', v)}
            />
          ))}
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The sum</div>
            <div className="overflow-x-auto font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
              {branches.map((b, i) => `${b.pa.toFixed(2)} × ${b.pba.toFixed(2)} = ${terms[i].toFixed(4)}`).join('\n')}
              {`\n────────────────────\n            ${pB.toFixed(4)}`}
            </div>
          </div>
          <PanelNote>
            {partitionOk ? (
              <>
                The branch probabilities add to {massSum.toFixed(2)}, so this really is a partition and the theorem
                applies. The answer sits between the smallest and the largest conditional — a weighted average always
                does, which is a quick way to catch a slip.
              </>
            ) : (
              <>
                The branch probabilities add to {massSum.toFixed(2)}, not 1, so the slices no longer cover S. Whatever
                this sum is, it is not P({cse.event}).
              </>
            )}
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 15 · Bayes, on the binary channel                                          */
/* ========================================================================== */

/**
 * Slides 33 to 36 in one place. The channel is the clearest case of the thing
 * Bayes is for: the sender's behaviour is known forwards, P(received | sent),
 * and the receiver needs it backwards. The two bars are the point — the prior
 * is where you start, the posterior is where the evidence leaves you.
 */
/** A probability drawn as a filled bar, so prior and posterior can be compared by eye. */
function Bar({ label, v, colour }: { label: string; v: number; colour: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px]">
        <span className="text-zinc-600">{label}</span>
        <span className="font-mono font-semibold text-zinc-950">{v.toFixed(4)}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(9,9,11,0.08)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, background: colour }}
        />
      </div>
    </div>
  )
}

export function BayesLab() {
  const [prior, setPrior] = useState(0.4)
  const [hit1, setHit1] = useState(0.95)
  const [hit0, setHit0] = useState(0.9)
  const [received, setReceived] = useState<'1' | '0'>('1')

  const pA = prior
  const pAbar = 1 - prior
  // P(receive 1 | sent 0) is whatever is left over from getting a 0 right.
  const pB1givenA = hit1
  const pB1givenAbar = 1 - hit0
  const forward = received === '1' ? [pB1givenA, pB1givenAbar] : [1 - pB1givenA, 1 - pB1givenAbar]
  const joint = [pA * forward[0], pAbar * forward[1]]
  const pB = joint[0] + joint[1]
  const post = pB > 0 ? joint[0] / pB : null

  return (
    <LabBox>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              At the far end of the wire I see a…
            </div>
            <div className="flex gap-2">
              <Chip on={received === '1'} label="1 received" onClick={() => setReceived('1')} />
              <Chip on={received === '0'} label="0 received" onClick={() => setReceived('0')} />
            </div>
          </div>
          <Slider
            label="P(1 is transmitted) — the prior"
            value={prior}
            display={prior.toFixed(2)}
            min={0.01}
            max={0.99}
            step={0.01}
            hint="The slides use 0.4. This is what you believed before anything arrived."
            onChange={setPrior}
          />
          <Slider
            label="P(1 received | 1 sent)"
            value={hit1}
            display={hit1.toFixed(2)}
            min={0.5}
            max={1}
            step={0.01}
            hint="The slides use 0.95. How reliably a 1 survives the wire."
            onChange={setHit1}
          />
          <Slider
            label="P(0 received | 0 sent)"
            value={hit0}
            display={hit0.toFixed(2)}
            min={0.5}
            max={1}
            step={0.01}
            hint="The slides use 0.90, which leaves P(1 received | 0 sent) = 0.10."
            onChange={setHit0}
          />
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <Bar label="Prior — P(1 was sent)" v={pA} colour="#a1a1aa" />
            <Bar label={`Posterior — P(1 was sent | ${received} received)`} v={post ?? 0} colour={TEAL} />
            <p className="text-[12px]/[1.55] text-zinc-500">
              The gap between the two bars is everything the arriving symbol told you. Set both reliabilities to 0.50
              and the bars line up: a channel that is pure noise carries no information at all.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ReadOut
            label={`P(${received} received)`}
            value={pB.toFixed(4)}
            note="Total probability first. Bayes cannot start without this denominator."
          />
          <ReadOut
            label={`P(1 was sent | ${received} received)`}
            value={post === null ? '—' : post.toFixed(4)}
            tone={TEAL}
            note="The answer that matters to whoever is holding the receiver."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Both steps, in full
            </div>
            <div className="overflow-x-auto font-mono text-[11.5px]/[1.85] whitespace-pre text-zinc-800">
              {`P(B) = P(B|A)P(A) + P(B|Ā)P(Ā)
     = ${forward[0].toFixed(2)}(${pA.toFixed(2)}) + ${forward[1].toFixed(2)}(${pAbar.toFixed(2)})
     = ${pB.toFixed(4)}

P(A|B) = P(B|A)P(A) / P(B)
       = ${forward[0].toFixed(2)}(${pA.toFixed(2)}) / ${pB.toFixed(4)}
       = ${post === null ? '—' : post.toFixed(4)}`}
            </div>
          </div>
          <Btn
            primary
            onClick={() => {
              setPrior(0.4)
              setHit1(0.95)
              setHit0(0.9)
              setReceived('1')
            }}
          >
            The slides: 0.4, 0.95, 0.90
          </Btn>
          <LabNote>
            At those settings this reads 0.44 and 0.8636 — slide 36 prints 0.44 and 0.863. Notice the posterior 0.86 is
            well above the prior 0.40 but nowhere near the 0.95 reliability of the channel: a rare symbol needs strong
            evidence to become likely, and that gap is the whole of the base-rate problem.
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 16 · The practice problems                                                 */
/* ========================================================================== */

interface Practice {
  id: string
  label: string
  q: React.ReactNode
  given: string
  /** Printed on the slide. Null where the slide prints none. */
  printed: string | null
  /** Set when the lab can reproduce the printed figure. */
  working: string | null
  /** Set instead when it cannot, and says why. */
  unsettled: React.ReactNode | null
}

const PRACTICE: Practice[] = [
  {
    id: 'p1',
    label: '1 · Secretaries',
    q: 'Four secretaries handle 20%, 60%, 15% and 5% of the files. They misfile with probabilities 0.05, 0.1, 0.1 and 0.05. Find the probability that a misfiled report can be blamed on the first secretary.',
    given: 'P(S₁)=0.20, P(S₂)=0.60, P(S₃)=0.15, P(S₄)=0.05\nP(M|S₁)=0.05, P(M|S₂)=0.10, P(M|S₃)=0.10, P(M|S₄)=0.05',
    printed: '0.1143',
    working: `total probability first:
P(M) = 0.20(0.05) + 0.60(0.10) + 0.15(0.10) + 0.05(0.05)
     = 0.0100 + 0.0600 + 0.0150 + 0.0025
     = 0.0875

then Bayes:
P(S₁|M) = 0.0100 / 0.0875
        = 0.1143   ✓ matches the slide`,
    unsettled: null,
  },
  {
    id: 'p2',
    label: '2 · Irregular students',
    q: 'In a class 70% are boys and 30% are girls. 5% of the boys and 3% of the girls are irregular. What is the probability that a student picked at random is irregular, and what is the probability that the irregular student is a girl?',
    given: 'P(boy)=0.70, P(girl)=0.30\nP(irregular|boy)=0.05, P(irregular|girl)=0.03',
    printed: '0.044, and 0.009',
    working: `P(irregular) = 0.70(0.05) + 0.30(0.03)
             = 0.035 + 0.009
             = 0.044     ✓ matches the slide

P(irregular ∩ girl) = 0.30(0.03)
                    = 0.009     ✓ matches the slide`,
    unsettled: (
      <>
        Both printed figures check out, but read the second question again. “The probability that the irregular student
        is a girl” asks for P(girl | irregular), and the answer key gives P(irregular <em>and</em> girl) — it says so in
        its own label. The two are different questions, and the slide does not answer the one it asked, so nothing is
        printed here for it.
      </>
    ),
  },
  {
    id: 'p3',
    label: '3 · Three machines',
    q: 'Machines A, B and C make 60%, 30% and 10% of the items, with 2%, 3% and 4% defective. (i) Find the probability that the item was not defective and produced by machine C. (ii) What is the probability that the item was produced by machine C or B?',
    given: 'P(A)=0.60, P(B)=0.30, P(C)=0.10\nP(defective|A)=0.02, P(defective|B)=0.03, P(defective|C)=0.04',
    printed: '0.096 and 0.4',
    working: `(i) P(not defective ∩ C) = 0.10 × (1 − 0.04)
                        = 0.10 × 0.96
                        = 0.096   ✓ matches the slide

(ii) P(B or C) = 0.30 + 0.10
               = 0.40    ✓ matches the slide
     (B and C are mutually exclusive — an item
      comes off one machine)`,
    unsettled: (
      <>
        One thing to notice rather than to answer. The question stem says the item “is found to be defective”, but both
        parts are worked without that condition — part (i) even asks about an item that is <em>not</em> defective. The
        printed answers match the working above, which ignores the stem, so the stem and the answer key disagree.
      </>
    ),
  },
  {
    id: 'p4',
    label: '4 · An incomplete deck',
    q: 'A card is drawn from a deck with the ace of diamonds missing. What is the probability that it is a club? That it is a queen? Are “clubs” and “queen” independent?',
    given: '51 cards: 13 clubs, 4 queens, 1 queen of clubs',
    printed: '13/51, 4/51, and not independent',
    working: `P(club)  = 13/51 = 0.2549   ✓
P(queen) =  4/51 = 0.0784   ✓

independence test:
P(club ∩ queen) = 1/51           = 0.019608
P(club)·P(queen) = (13/51)(4/51) = 0.019992

0.019608 ≠ 0.019992, so they are NOT
independent   ✓ matches the slide

(a full deck would give 1/52 = (13/52)(4/52)
 exactly — removing one card is what breaks it)`,
    unsettled: null,
  },
  {
    id: 'p5',
    label: '5 · Splitting production',
    q: 'Company A makes 30% of the tools, of which 98% are not defective. Companies B and C make the remaining 70%, at 95% and 97% not defective. What split between B and C makes a tool picked at random 96% likely to be non-defective?',
    given: 'P(A)=0.30 at 0.98 good; P(B)+P(C)=0.70 at 0.95 and 0.97 good\ntarget: overall 0.96 good',
    printed: '0.164',
    working: null,
    unsettled: (
      <>
        This one is left without an answer on purpose. Writing b and c for the shares of B and C, the conditions are
        0.30(0.98) + 0.95b + 0.97c = 0.96 and b + c = 0.70, which has exactly one solution: b = 0.65 and c = 0.05
        (check: 0.294 + 0.6175 + 0.0485 = 0.96). The slide prints 0.164, and there is no reading of the question on
        which 0.164 satisfies the conditions it states. Since the printed answer cannot be reproduced and the intended
        question is not clear, no answer is given here.
      </>
    ),
  },
  {
    id: 'p6',
    label: '6 · Shopping for clothing',
    q: 'Of 500 respondents: 136 men and 224 women enjoy shopping for clothing; 104 men and 36 women do not. (a) Given the respondent is female, what is the probability she does not enjoy it? (b) Given the respondent enjoys it, what is the probability the individual is male?',
    given:
      'enjoys: 136 male, 224 female (360)\ndoes not: 104 male, 36 female (140)\ntotals: 240 male, 260 female, 500 in all',
    printed: '0.1384 and 0.56',
    working: `(a) P(does not enjoy | female)
      = 36 / 260
      = 0.13846   ✓ the slide prints 0.1384`,
    unsettled: (
      <>
        Part (b) is left unanswered. It asks for P(male | enjoys), whose denominator is the 360 people who enjoy
        shopping. The printed 0.56 is 136/240 — the same 136 measured against the 240 men, which is P(enjoys | male),
        the other way round. The slide has answered a different question from the one it asked, so the printed figure
        cannot settle this part.
      </>
    ),
  },
  {
    id: 'p7',
    label: '7 · Two cards off the top',
    q: 'From a shuffled 52-card deck you take the first two cards without replacement. (a) Both queens? (b) First a 10 and second a 5 or 6? (c) Part (a) again, but sampling with replacement.',
    given: '52 cards: 4 queens, 4 tens, 8 cards that are a 5 or a 6',
    printed: '0.0045, 0.012, 0.0059',
    working: `(a) (4/52)(3/51) = 12/2652
                = 0.004525   ✓ slide: 0.0045

(b) (4/52)(8/51) = 32/2652
                = 0.012066   ✓ slide: 0.012

(c) (4/52)(4/52) = 16/2704
                = 0.005917   ✓ slide: 0.0059

(a) is smaller than (c): taking the first queen
out leaves only 3 of 51, not 4 of 52`,
    unsettled: null,
  },
]

export function PracticeLab() {
  const [at, setAt] = useState('p1')
  const [shown, setShown] = useState(false)

  const p = PRACTICE.find((x) => x.id === at) ?? PRACTICE[0]

  return (
    <LabBox>
      <Presets
        items={PRACTICE.map((x) => ({ id: x.id, label: x.label }))}
        at={at}
        onPick={(id) => {
          setAt(id)
          setShown(false)
        }}
      />

      <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The question</div>
        <p className="crux-prose mb-3 text-[13.5px]/[1.7] text-zinc-800">{p.q}</p>
        <div className="overflow-x-auto rounded-md bg-zinc-50 p-3 font-mono text-[12px]/[1.7] whitespace-pre text-zinc-700">
          {p.given}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn primary onClick={() => setShown((s) => !s)}>
          {shown ? 'Hide the working' : 'Show the working'}
        </Btn>
        <span className="text-[12.5px] text-zinc-500">
          {p.printed === null ? 'The slide prints no answer.' : `The slide prints: ${p.printed}`}
        </span>
      </div>

      {shown && p.working && (
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Worked out, and checked against the slide
          </div>
          <div className="overflow-x-auto font-mono text-[12px]/[1.8] whitespace-pre text-zinc-800">{p.working}</div>
        </div>
      )}

      {shown && p.unsettled && (
        <div
          className="rounded-lg border px-4 py-3 text-[13px]/[1.7]"
          style={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)', color: '#7f1d1d' }}
        >
          <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: RED }}>
            {p.working ? 'One part is left unanswered' : 'No answer is given here'}
          </div>
          <div className="crux-prose">{p.unsettled}</div>
        </div>
      )}

      <LabNote>
        Five of the seven check out against the slides exactly. Two do not, and both are printed above with the reason
        rather than quietly corrected — a revision page that guesses is worse than one that says it does not know.
      </LabNote>
    </LabBox>
  )
}
