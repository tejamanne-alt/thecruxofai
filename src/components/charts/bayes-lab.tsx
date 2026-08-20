'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { clamp, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const SLICE = ['#4f46e5', '#0d9488', '#f59e0b', '#ec4899', '#14b8a6']

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** n/d in lowest terms, so 12/46 reads as 6/23 rather than as 0.2609. */
function frac(n: number, d: number) {
  if (d === 0) return '—'
  if (n === 0) return '0'
  const g = gcd(Math.abs(n), Math.abs(d))
  const dd = d / g
  return dd === 1 ? String(n / g) : `${n / g}/${dd}`
}

/* ========================================================================== */
/* 1 · Bayes' theorem: the statement                                          */
/* ========================================================================== */

/**
 * Slide 5's picture, with the cuts and the event A in the reader's hands.
 *
 * A is an ellipse, so the slice areas are worked out in closed form rather than
 * counted off pixels: the area of an ellipse to the left of a vertical line has
 * an exact expression, and differencing it at the two cuts gives P(A ∩ Eᵢ)
 * exactly. That matters, because the point of the picture is that the posteriors
 * add back to exactly 1 with nothing left over.
 */
function ellipseLeftOf(x: number, cx: number, a: number, b: number) {
  const u = clamp((x - cx) / a, -1, 1)
  return a * b * (u * Math.sqrt(Math.max(0, 1 - u * u)) + Math.asin(u) + Math.PI / 2)
}

export function BayesStatementLab() {
  const [cuts, setCuts] = useState([0.26, 0.52, 0.76])
  const [k, setK] = useState(4)
  const [acx, setAcx] = useState(0.5)

  const active = cuts.slice(0, k - 1)
  const bounds = [0, ...active, 1]
  const widths = bounds.slice(1).map((b, i) => b - bounds[i])

  // A is a fixed-size ellipse that slides left and right. Its own probability
  // never changes — only which slices it is spread across does.
  const AA = 0.34
  const AB = 0.26 / (Math.PI * AA)
  const joint = bounds.slice(1).map((b, i) => ellipseLeftOf(b, acx, AA, AB) - ellipseLeftOf(bounds[i], acx, AA, AB))
  const pA = joint.reduce((a, v) => a + v, 0)
  const post = joint.map((j) => (pA > 0 ? j / pA : 0))
  const best = post.indexOf(Math.max(...post))

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 26
    const boxW = W - pad * 2
    const boxH = H - pad * 2 - 54
    const cy = pad + boxH / 2
    const scale = Math.sqrt(boxW * boxH)

    for (let i = 0; i < k; i++) {
      g.fillStyle = SLICE[i % SLICE.length]
      g.globalAlpha = 0.14
      g.fillRect(pad + bounds[i] * boxW, pad, widths[i] * boxW, boxH)
      g.globalAlpha = 1
      if (widths[i] > 0.06) {
        g.fillStyle = SLICE[i % SLICE.length]
        g.textAlign = 'center'
        g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
        g.fillText(`E${i + 1}`, pad + (bounds[i] + widths[i] / 2) * boxW, pad + 18)
      }
    }

    // A, drawn slice by slice so each piece takes its slice's colour — that is
    // the picture the theorem needs.
    const cx = pad + acx * boxW
    const ra = AA * scale
    const rb = AB * scale
    for (let i = 0; i < k; i++) {
      g.save()
      g.beginPath()
      g.rect(pad + bounds[i] * boxW, pad, widths[i] * boxW, boxH)
      g.clip()
      g.beginPath()
      g.ellipse(cx, cy, ra, rb, 0, 0, Math.PI * 2)
      g.fillStyle = SLICE[i % SLICE.length]
      g.globalAlpha = 0.68
      g.fill()
      g.restore()
      g.globalAlpha = 1
    }
    g.beginPath()
    g.ellipse(cx, cy, ra, rb, 0, 0, Math.PI * 2)
    g.strokeStyle = '#09090b'
    g.lineWidth = 2
    g.stroke()
    g.fillStyle = '#09090b'
    g.font = '600 14px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillText('A', cx, cy + 5)

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

    // The posterior, as a stacked bar under the box. Every segment is a slice's
    // share of A, so the bar is always exactly full.
    const barY = pad + boxH + 22
    let at = pad
    for (let i = 0; i < k; i++) {
      const w = post[i] * boxW
      g.fillStyle = SLICE[i % SLICE.length]
      g.fillRect(at, barY, w, 22)
      if (w > 34) {
        g.fillStyle = '#fff'
        g.font = '600 11px ui-sans-serif, system-ui, sans-serif'
        g.textAlign = 'center'
        g.fillText(post[i].toFixed(2), at + w / 2, barY + 15)
      }
      at += w
    }
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1
    g.strokeRect(pad, barY, boxW, 22)
    g.fillStyle = '#71717a'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'left'
    g.fillText('P(Eᵢ | A) — the answer Bayes gives, always adding to 1', pad, barY + 38)

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
          height={400}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ k, acx, c0: bounds[1] ?? 0, c1: bounds[2] ?? 0, c2: bounds[3] ?? 0 }}
          jumpKey={k}
          handles={(f: Frame) => [
            ...active.map((c, i) => ({
              id: `c${i}`,
              px: f.px(c),
              py: (f.T + f.B) / 2,
              label: `cut ${i + 1}, between E${i + 1} and E${i + 2}`,
            })),
            { id: 'a', px: f.px(acx), py: (f.T + f.B) / 2, grab: 'anywhere' as const, label: 'the event A' },
          ]}
          onDragTo={(id, x) => {
            if (id === 'a') {
              setAcx(clamp(x, AA, 1 - AA))
              return
            }
            const i = Number(id.slice(1))
            setCuts((old) => {
              const next = [...old]
              const lo = i === 0 ? 0.05 : next[i - 1] + 0.05
              const hi = i >= k - 2 ? 0.95 : next[i + 1] - 0.05
              next[i] = clamp(x, lo, Math.max(lo, hi))
              return next
            })
          }}
          caption="Press anywhere to move A; drag a cut to resize the slices. P(A) barely changes as A slides — but which slice it is mostly sitting in changes a great deal, and that is what the bar underneath reports."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(A), added up over the slices"
            value={pA.toFixed(4)}
            tone={TEAL}
            note="Σ P(Eᵢ)·P(A | Eᵢ) — the denominator of the theorem, and nothing else."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Slice by slice
            </div>
            <div className="font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
              {widths
                .map(
                  (w, i) =>
                    `E${i + 1}  P=${w.toFixed(3)}  P(A|E${i + 1})=${(w > 0 ? joint[i] / w : 0).toFixed(3)}  →  ${post[i].toFixed(3)}`
                )
                .join('\n')}
              {`\n──────────────────────────────────────\nposteriors add to  ${post.reduce((a, v) => a + v, 0).toFixed(4)}`}
            </div>
          </div>
          <Verdict ok>
            The evidence points hardest at E{best + 1} — it holds {(post[best] * 100).toFixed(1)}% of A.
          </Verdict>
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
                setCuts([0.26, 0.52, 0.76])
                setK(4)
                setAcx(0.5)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton onClick={() => setCuts([0.08, 0.16, 0.24])}>Squash them left</PanelButton>
          </PanelButtons>
          <PanelNote>
            Squash the cuts to the left and E4 becomes almost the whole of S. Its prior goes up, it swallows most of A,
            and its posterior follows. A big prior is hard to argue away — which is the whole lesson of the examples
            that come next.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 2 · The proof, one line at a time                                          */
/* ========================================================================== */

const PROOF: Array<{ line: string; why: string; note: string; stage: number }> = [
  {
    line: 'E₁, E₂, … Eₙ are mutually exclusive,  P(Eᵢ) > 0,  A ⊆ ⋃ᵢ₌₁ⁿ Eᵢ',
    why: 'given',
    note: 'The whole of the hypothesis. The slices never overlap, none of them is impossible, and A does not stick out beyond them.',
    stage: 0,
  },
  {
    line: 'A = A ∩ ( ⋃ᵢ₌₁ⁿ Eᵢ )',
    why: 'because A sits inside the union',
    note: 'A free move that looks like it does nothing. It is the trick of the whole proof: it lets the slices into the expression.',
    stage: 1,
  },
  {
    line: 'A = (A ∩ E₁) ∪ (A ∩ E₂) ∪ … ∪ (A ∩ Eₙ)',
    why: 'distributive law',
    note: 'Intersecting with a union is the same as taking the union of the intersections. Now A is in pieces, one per slice.',
    stage: 2,
  },
  {
    line: '(A ∩ Eᵢ) ∩ (A ∩ Eⱼ) = ∅   for i ≠ j',
    why: 'the Eᵢ are mutually exclusive',
    note: 'The pieces cannot overlap either: anything in two of them would have to be in Eᵢ and Eⱼ at once, and those are disjoint.',
    stage: 2,
  },
  {
    line: 'P(A) = P(A ∩ E₁) + P(A ∩ E₂) + … + P(A ∩ Eₙ)',
    why: 'third axiom — disjoint events add',
    note: 'Allowed only because of the line above. This is why the proof spends a whole line establishing that the pieces are disjoint.',
    stage: 3,
  },
  {
    line: 'P(A ∩ Eᵢ) = P(Eᵢ) · P(A | Eᵢ)',
    why: 'multiplication rule',
    note: 'From Lecture 3. It swaps an overlap you are never given for two numbers a question does give you.',
    stage: 3,
  },
  {
    line: 'P(A) = Σᵢ₌₁ⁿ P(Eᵢ) · P(A | Eᵢ)      … (3)',
    why: 'substitute',
    note: 'The rule of total probability, which the deck also calls the rule of elimination. Everything so far has been building this one line.',
    stage: 3,
  },
  {
    line: 'P(Eᵢ | A) = P(Eᵢ ∩ A) / P(A)      … (4)',
    why: 'definition of conditional probability',
    note: 'The reverse conditional, written out. Both parts of the fraction are now things the previous lines can supply.',
    stage: 4,
  },
  {
    line: 'P(Eᵢ | A) = P(Eᵢ)·P(A | Eᵢ) / Σⱼ P(Eⱼ)·P(A | Eⱼ)',
    why: 'substitute the two lines above',
    note: 'Bayes’ theorem. The top is one route to A; the bottom is every route to A. A posterior is a route as a share of all routes.',
    stage: 4,
  },
]

export function BayesProofLab() {
  const [at, setAt] = useState(1)
  const step = PROOF[at - 1]

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 22
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cy = pad + boxH / 2
    const scale = Math.sqrt(boxW * boxH)
    const bounds = [0, 0.27, 0.53, 0.79, 1]
    const AA = 0.3
    const AB = 0.24 / (Math.PI * AA)
    const ra = AA * scale
    const rb = AB * scale
    const cx = pad + 0.5 * boxW
    const st = step.stage

    for (let i = 0; i < 4; i++) {
      g.fillStyle = SLICE[i % SLICE.length]
      g.globalAlpha = st === 0 ? 0.24 : 0.12
      g.fillRect(pad + bounds[i] * boxW, pad, (bounds[i + 1] - bounds[i]) * boxW, boxH)
      g.globalAlpha = 1
      g.fillStyle = SLICE[i % SLICE.length]
      g.textAlign = 'center'
      g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
      g.fillText(`E${i + 1}`, pad + ((bounds[i] + bounds[i + 1]) / 2) * boxW, pad + 18)
    }

    if (st >= 1) {
      // From line 3 on, A is drawn in pieces so the split is visible; before
      // that it is one solid shape, which is what line 2 is claiming.
      if (st >= 2) {
        for (let i = 0; i < 4; i++) {
          g.save()
          g.beginPath()
          const gap = st >= 3 ? 3 : 0
          g.rect(pad + bounds[i] * boxW + gap, pad, (bounds[i + 1] - bounds[i]) * boxW - gap * 2, boxH)
          g.clip()
          g.beginPath()
          g.ellipse(cx, cy, ra, rb, 0, 0, Math.PI * 2)
          g.fillStyle = SLICE[i % SLICE.length]
          g.globalAlpha = 0.72
          g.fill()
          g.restore()
          g.globalAlpha = 1
        }
      } else {
        g.beginPath()
        g.ellipse(cx, cy, ra, rb, 0, 0, Math.PI * 2)
        g.fillStyle = 'rgba(9,9,11,0.14)'
        g.fill()
      }
      g.beginPath()
      g.ellipse(cx, cy, ra, rb, 0, 0, Math.PI * 2)
      g.strokeStyle = '#09090b'
      g.lineWidth = 2
      g.stroke()
      g.fillStyle = '#09090b'
      g.font = '600 14px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText('A', cx, cy + 5)
    }

    for (let i = 1; i < 4; i++) {
      g.strokeStyle = '#09090b'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(pad + bounds[i] * boxW, pad)
      g.lineTo(pad + bounds[i] * boxW, pad + boxH)
      g.stroke()
    }
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)

    g.fillStyle = '#71717a'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'left'
    const cap =
      st === 0
        ? 'The slices, before A has been mentioned'
        : st === 1
          ? 'A, sitting inside the union of the slices'
          : st === 2
            ? 'A, cut into one piece per slice'
            : st === 3
              ? 'The pieces pulled apart — disjoint, so their probabilities simply add'
              : 'One piece over the whole of A: that ratio is the posterior'
    g.fillText(cap, pad + 6, pad + boxH - 8)

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
          height={300}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ at }}
          jumpKey={at}
          handles={(f: Frame) => [
            {
              id: 'step',
              px: f.L + ((at - 1) / (PROOF.length - 1)) * (f.R - f.L),
              py: f.B - 10,
              grab: 'anywhere',
              label: 'which line of the proof is showing',
            },
          ]}
          onDragTo={(_id, x) => setAt(clamp(Math.round(x * (PROOF.length - 1)) + 1, 1, PROOF.length))}
          caption="Drag anywhere left or right to move through the proof, or use the buttons. The picture changes at the four moments where the argument does."
        />
      }
      panel={
        <>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Line {at} of {PROOF.length}
            </div>
            <div className="font-mono text-[12.5px]/[1.7] break-words text-zinc-950">{step.line}</div>
            <div className="mt-1.5 text-[11.5px] font-semibold" style={{ color: 'var(--acc)' }}>
              {step.why}
            </div>
          </div>
          <PanelNote>{step.note}</PanelNote>
          <PanelButtons>
            <PanelButton onClick={() => setAt((v) => Math.max(1, v - 1))}>← Back</PanelButton>
            <PanelButton primary onClick={() => setAt((v) => Math.min(PROOF.length, v + 1))}>
              Next line →
            </PanelButton>
          </PanelButtons>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 3 · Example 1 — the three managers                                         */
/* ========================================================================== */

/*
 * Slides 9 and 10, in exact arithmetic. Every prior on the board is a ninth and
 * every likelihood is a tenth, so the whole example lives in integers: P(A) is
 * Σ kᵢmᵢ over 90, and the posterior is one product over that sum. Nothing is
 * rounded until it is printed, which is why 12/46 comes out of the lab as the
 * board's 6/23 rather than as 0.2609.
 */
const MGR = ['X', 'Y', 'Z']

export function ManagersLab() {
  const [k, setK] = useState([4, 2, 3]) // priors, in ninths
  const [m, setM] = useState([3, 5, 8]) // likelihoods, in tenths
  const [ask, setAsk] = useState(0)

  const k3 = 9 - k[0] - k[1]
  const ks = [k[0], k[1], k3]
  const prod = ks.map((kk, i) => kk * m[i])
  const total = prod.reduce((a, v) => a + v, 0)
  const post = prod.map((p) => (total > 0 ? p / total : 0))
  const isDeck = k[0] === 4 && k[1] === 2 && m[0] === 3 && m[1] === 5 && m[2] === 8

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                Candidate
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(Eᵢ) — becomes manager
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(A | Eᵢ) — brings the bonus
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(Eᵢ)·P(A | Eᵢ)
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(Eᵢ | A)
              </th>
            </tr>
          </thead>
          <tbody>
            {MGR.map((name, i) => (
              <tr key={name} className={i === ask ? 'bg-indigo-50/70' : undefined}>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">
                  E{i + 1} — {name}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{frac(ks[i], 9)}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{frac(m[i], 10)}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{frac(prod[i], 90)}</td>
                <td
                  className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono font-semibold"
                  style={{ color: i === ask ? 'var(--acc)' : undefined }}
                >
                  {frac(prod[i], total)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2.5 py-2 font-semibold text-zinc-500">Total</td>
              <td className="px-2.5 py-2 text-right font-mono text-zinc-500">1</td>
              <td className="px-2.5 py-2 text-right text-zinc-400">—</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold" style={{ color: TEAL }}>
                {frac(total, 90)}
              </td>
              <td className="px-2.5 py-2 text-right font-mono text-zinc-500">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {MGR.map((name, i) => (
          <Chip key={name} on={ask === i} label={`If the bonus came, was it ${name}?`} onClick={() => setAsk(i)} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="(i) P(A) — the bonus scheme arrives"
          value={frac(total, 90)}
          note={`= ${(total / 90).toFixed(4)}. Every route to the bonus, added up.`}
          tone={TEAL}
        />
        <ReadOut
          label={`(ii) P(E${ask + 1} | A) — it was ${MGR[ask]}`}
          value={frac(prod[ask], total)}
          note={`= ${post[ask].toFixed(4)}. ${MGR[ask]}'s route as a share of all of them.`}
          tone="var(--acc)"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <LabNote>Priors, in ninths. The third is whatever is left, so they always add to 1.</LabNote>
          <Slider
            label="P(E1) — X becomes manager"
            value={k[0]}
            display={`${k[0]}/9`}
            min={0}
            max={9 - k[1]}
            step={1}
            hint="The board has 4/9."
            onChange={(v) => setK([v, Math.min(k[1], 9 - v)])}
          />
          <Slider
            label="P(E2) — Y becomes manager"
            value={k[1]}
            display={`${k[1]}/9`}
            min={0}
            max={9 - k[0]}
            step={1}
            hint={`The board has 2/9, leaving ${frac(k3, 9)} for Z.`}
            onChange={(v) => setK([k[0], v])}
          />
        </div>
        <div>
          <LabNote>Likelihoods, in tenths. These are free — they are three separate questions.</LabNote>
          {MGR.map((name, i) => (
            <Slider
              key={name}
              label={`P(A | E${i + 1}) — bonus if ${name}`}
              value={m[i]}
              display={frac(m[i], 10)}
              min={0}
              max={10}
              step={1}
              hint={i === 0 ? 'The board has 3/10.' : i === 1 ? 'The board has 1/2.' : 'The board has 4/5.'}
              onChange={(v) => setM(m.map((x, j) => (j === i ? v : x)))}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setK([4, 2])
            setM([3, 5, 8])
          }}
        >
          Restore the board’s numbers
        </Btn>
        <Btn onClick={() => setM([8, 5, 3])}>Swap X and Z around</Btn>
      </div>

      <Verdict ok={isDeck}>
        {isDeck
          ? 'These are the board’s own numbers, and the lab reproduces both of its answers: P(A) = 23/45 and P(E1 | A) = 6/23.'
          : `Changed from the board. Put them back to see 23/45 and 6/23 again — right now P(A) = ${frac(total, 90)}.`}
      </Verdict>
    </LabBox>
  )
}

/* ========================================================================== */
/* 4 · Example 2 — flu or measles                                             */
/* ========================================================================== */

/*
 * Slides 11 and 12. Percentages are held as integers so the answer comes out
 * as an exact fraction: with the deck's 90, 8 and 95 that is 720/1670 = 72/167,
 * which is 0.4311 and the 0.43 the deck prints.
 */
export function RashLab() {
  const [pf, setPf] = useState(90) // P(flu), as a percentage
  const [rf, setRf] = useState(8) // P(rash | flu)
  const [rm, setRm] = useState(95) // P(rash | measles)

  const pm = 100 - pf
  const viaF = pf * rf
  const viaM = pm * rm
  const total = viaF + viaM
  const post = total > 0 ? viaF / total : 0
  const isDeck = pf === 90 && rf === 8 && rm === 95

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 30
    const boxW = W - pad * 2
    const boxH = H - pad * 2 - 46
    // A unit square: the flu column is P(F) wide, and the rash band inside each
    // column is that column's conditional. Area is probability throughout, so
    // the two shaded rectangles are P(R ∩ F) and P(R ∩ M) to scale.
    const fw = (pf / 100) * boxW
    const parts: Array<[number, number, number, string, string]> = [
      [pad, fw, rf / 100, '#4f46e5', 'flu'],
      [pad + fw, boxW - fw, rm / 100, '#f59e0b', 'measles'],
    ]
    for (const [x, w, h, col, name] of parts) {
      g.fillStyle = col
      g.globalAlpha = 0.12
      g.fillRect(x, pad, w, boxH)
      g.globalAlpha = 0.75
      g.fillRect(x, pad + boxH * (1 - h), w, boxH * h)
      g.globalAlpha = 1
      if (w > 44) {
        g.fillStyle = '#09090b'
        g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
        g.textAlign = 'center'
        g.fillText(name, x + w / 2, pad + 16)
        g.fillStyle = h > 0.16 ? '#fff' : '#3f3f46'
        g.font = '600 11.5px ui-sans-serif, system-ui, sans-serif'
        g.fillText('rash', x + w / 2, pad + boxH * (1 - h) + (h > 0.16 ? 16 : -6))
      }
    }
    g.strokeStyle = '#09090b'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(pad + fw, pad)
    g.lineTo(pad + fw, pad + boxH)
    g.stroke()
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)

    const barY = pad + boxH + 20
    const w1 = total > 0 ? (viaF / total) * boxW : 0
    g.fillStyle = '#4f46e5'
    g.fillRect(pad, barY, w1, 20)
    g.fillStyle = '#f59e0b'
    g.fillRect(pad + w1, barY, boxW - w1, 20)
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1
    g.strokeRect(pad, barY, boxW, 20)
    g.fillStyle = '#71717a'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'left'
    g.fillText('of the children with a rash: flu on the left, measles on the right', pad, barY + 36)

    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => pad + boxH * (1 - v),
      ux: (p: number) => (p - pad) / boxW,
      uy: (p: number) => 1 - (p - pad) / boxH,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pf, rf, rm }}
          handles={(f: Frame) => [
            { id: 'pf', px: f.px(pf / 100), py: (f.T + f.B) / 2, label: 'how many children have flu' },
            { id: 'rf', px: f.px(pf / 200), py: f.py(rf / 100), label: 'rash rate among the flu cases' },
            {
              id: 'rm',
              px: f.px((pf + 100) / 200),
              py: f.py(rm / 100),
              label: 'rash rate among the measles cases',
            },
          ]}
          onDragTo={(id, x, y) => {
            if (id === 'pf') setPf(Math.round(clamp(x, 0.02, 0.98) * 100))
            if (id === 'rf') setRf(Math.round(clamp(y, 0, 1) * 100))
            if (id === 'rm') setRm(Math.round(clamp(y, 0, 1) * 100))
          }}
          caption="Drag the middle line to change how common flu is; drag either rash line up or down. The bar underneath splits the children who have a rash between the two illnesses."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(F | R) — rash, and it is flu"
            value={post.toFixed(4)}
            tone="var(--acc)"
            note={`exactly ${frac(viaF, total)}`}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12px]/[1.85] whitespace-pre text-zinc-800">
            {`P(F)   = ${(pf / 100).toFixed(2)}      P(M)   = ${(pm / 100).toFixed(2)}
P(R|F) = ${(rf / 100).toFixed(2)}      P(R|M) = ${(rm / 100).toFixed(2)}

P(R∩F) = ${(viaF / 10000).toFixed(4)}
P(R∩M) = ${(viaM / 10000).toFixed(4)}
P(R)   = ${(total / 10000).toFixed(4)}`}
          </div>
          <Slider
            label="P(F) — children with flu"
            value={pf}
            display={`${pf}%`}
            min={2}
            max={98}
            step={1}
            hint="The slide has 90%."
            onChange={setPf}
          />
          <Slider
            label="P(R | F) — flu gives a rash"
            value={rf}
            display={`${rf}%`}
            min={0}
            max={100}
            step={1}
            hint="The slide has 8%."
            onChange={setRf}
          />
          <Slider
            label="P(R | M) — measles gives a rash"
            value={rm}
            display={`${rm}%`}
            min={0}
            max={100}
            step={1}
            hint="The slide has 95%."
            onChange={setRm}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setPf(90)
                setRf(8)
                setRm(95)
              }}
            >
              The slide’s numbers
            </PanelButton>
            <PanelButton onClick={() => setPf(50)}>Make them equally common</PanelButton>
          </PanelButtons>
          {isDeck ? (
            <Verdict ok>The slide’s numbers, and the slide’s answer: 0.4311, which it writes as 0.43.</Verdict>
          ) : (
            <PanelNote>
              Set flu to 50% and the answer collapses to 0.078: with the two illnesses equally common, the rash rates
              decide on their own. It is the 90% that was holding flu up.
            </PanelNote>
          )}
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 5 · Example 3 — flagged as spam, and innocent                              */
/* ========================================================================== */

export function SpamTrapLab() {
  const [base, setBase] = useState(50) // P(spam), percent
  const [tp, setTp] = useState(99) // P(flagged | spam)
  const [fp, setFp] = useState(5) // P(flagged | not spam)

  const clean = 100 - base
  const viaClean = fp * clean
  const viaSpam = tp * base
  const total = viaClean + viaSpam
  const post = total > 0 ? viaClean / total : 0
  const isDeck = base === 50 && tp === 99 && fp === 5

  return (
    <LabBox>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(not spam | flagged) — good mail thrown away"
          value={total > 0 ? post.toFixed(4) : '—'}
          tone={RED}
          note={`exactly ${frac(viaClean, total)}`}
        />
        <ReadOut
          label="P(spam | flagged) — correctly caught"
          value={total > 0 ? (1 - post).toFixed(4) : '—'}
          tone={TEAL}
          note={`exactly ${frac(viaSpam, total)}`}
        />
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`P(B) = ${(base / 100).toFixed(2)}   P(Bᶜ) = ${(clean / 100).toFixed(2)}
P(A | B)  = ${(tp / 100).toFixed(2)}      caught
P(A | Bᶜ) = ${(fp / 100).toFixed(2)}      false positive

            P(A | Bᶜ)·P(Bᶜ)          ${(viaClean / 10000).toFixed(4)}
P(Bᶜ|A) = ─────────────────────── = ─────────  = ${total > 0 ? post.toFixed(4) : '—'}
          P(A|B)P(B) + P(A|Bᶜ)P(Bᶜ)   ${(total / 10000).toFixed(4)}`}
      </div>

      <Slider
        label="P(B) — how much mail is spam"
        value={base}
        display={`${base}%`}
        min={1}
        max={99}
        step={1}
        hint="The slide has 50%."
        onChange={setBase}
      />
      <Slider
        label="P(A | B) — spam it detects"
        value={tp}
        display={`${tp}%`}
        min={1}
        max={100}
        step={1}
        hint="The slide has 99%."
        onChange={setTp}
      />
      <Slider
        label="P(A | Bᶜ) — good mail it flags anyway"
        value={fp}
        display={`${fp}%`}
        min={0}
        max={100}
        step={1}
        hint="The slide has 5%."
        onChange={setFp}
      />

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setBase(50)
            setTp(99)
            setFp(5)
          }}
        >
          The slide’s numbers
        </Btn>
        <Btn onClick={() => setBase(5)}>Now only 5% is spam</Btn>
      </div>

      <Verdict ok={isDeck}>
        {isDeck
          ? 'The slide’s numbers, and the slide’s answer: 5/104 = 0.0481. About one flagged message in twenty-one is innocent.'
          : `P(not spam | flagged) is now ${frac(viaClean, total)} = ${post.toFixed(4)}. The detector has not changed at all — only how much spam there is to detect.`}
      </Verdict>
      <LabNote>
        Drop the base rate to 5% and the same filter throws away roughly half of everything it flags. That is the whole
        of the base-rate lesson: a test is only as good as the population you point it at.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* 6 · Prior, likelihood, evidence, posterior                                 */
/* ========================================================================== */

const HNAME = ['H₁', 'H₂', 'H₃', 'H₄']

export function HypothesisLab() {
  const [w, setW] = useState([3, 2, 1, 1]) // prior weights
  const [lik, setLik] = useState([0.7, 0.35, 0.2, 0.9])
  const [n, setN] = useState(3)

  const ws = w.slice(0, n)
  const sw = ws.reduce((a, v) => a + v, 0)
  const prior = ws.map((v) => v / sw)
  const joint = prior.map((p, i) => p * lik[i])
  const pE = joint.reduce((a, v) => a + v, 0)
  const post = joint.map((j) => (pE > 0 ? j / pE : 0))
  const sum = post.reduce((a, v) => a + v, 0)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 34
    const boxW = W - pad * 2
    const rowH = (H - pad * 2 - 26) / 3
    const colW = boxW / n

    const rows: Array<[string, number[], string]> = [
      ['prior  P(Hᵢ)', prior, '#a1a1aa'],
      ['likelihood  P(E | Hᵢ)', lik.slice(0, n), '#f59e0b'],
      ['posterior  P(Hᵢ | E)', post, '#4f46e5'],
    ]
    rows.forEach(([label, vals, col], r) => {
      const top = pad + r * rowH
      const base = top + rowH - 22
      g.fillStyle = '#71717a'
      g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'left'
      g.fillText(label, pad, top + 10)
      for (let i = 0; i < n; i++) {
        const h = Math.max(0, vals[i]) * (rowH - 40)
        g.fillStyle = col
        g.globalAlpha = 0.85
        g.fillRect(pad + i * colW + 10, base - h, colW - 20, h)
        g.globalAlpha = 1
        g.fillStyle = '#3f3f46'
        g.font = '600 11.5px ui-sans-serif, system-ui, sans-serif'
        g.textAlign = 'center'
        g.fillText(vals[i].toFixed(3), pad + i * colW + colW / 2, base - h - 5)
      }
      g.strokeStyle = 'rgba(9,9,11,0.18)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(pad, base)
      g.lineTo(pad + boxW, base)
      g.stroke()
    })
    for (let i = 0; i < n; i++) {
      g.fillStyle = '#09090b'
      g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText(HNAME[i], pad + i * colW + colW / 2, H - 12)
    }

    const rowH2 = rowH
    return {
      L: pad,
      R: pad + boxW,
      T: pad + rowH2,
      B: pad + 2 * rowH2 - 22,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => pad + 2 * rowH2 - 22 - v * (rowH2 - 40),
      ux: (p: number) => (p - pad) / boxW,
      uy: (p: number) => (pad + 2 * rowH2 - 22 - p) / (rowH2 - 40),
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ n, l0: lik[0], l1: lik[1], l2: lik[2], l3: lik[3] }}
          jumpKey={n}
          handles={(f: Frame) =>
            Array.from({ length: n }, (_, i) => ({
              id: `l${i}`,
              px: f.px((i + 0.5) / n),
              py: f.py(lik[i]),
              label: `likelihood P(E | ${HNAME[i]})`,
            }))
          }
          onDragTo={(id, _x, y) => {
            const i = Number(id.slice(1))
            setLik((old) => old.map((v, j) => (j === i ? clamp(y, 0, 1) : v)))
          }}
          caption="Drag any middle bar: that is a likelihood, how well a hypothesis explains the evidence. The bottom row is what Bayes makes of it, and it always fills exactly 1."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(E) — the evidence"
            value={pE.toFixed(4)}
            tone={TEAL}
            note="Σ P(Hᵢ)·P(E | Hᵢ). It is the same number for every hypothesis, which is why it only rescales."
          />
          <ReadOut
            label="Σ P(Hᵢ | E)"
            value={sum.toFixed(6)}
            tone="var(--acc)"
            note="Exactly 1, however you drag — dividing by P(E) is what forces it."
          />
          <Slider
            label="How many hypotheses"
            value={n}
            display={String(n)}
            min={2}
            max={4}
            step={1}
            hint="They have to be mutually exclusive and exhaustive for the sum to be 1."
            onChange={setN}
          />
          {Array.from({ length: n }, (_, i) => (
            <Slider
              key={i}
              label={`prior weight for ${HNAME[i]}`}
              value={w[i]}
              display={`${w[i]} → ${prior[i].toFixed(3)}`}
              min={0}
              max={8}
              step={1}
              hint={i === 0 ? 'Weights are rescaled to add to 1, so a prior is always a share.' : ' '}
              onChange={(v) => setW(w.map((x, j) => (j === i ? v : x)))}
            />
          ))}
          <PanelNote>
            Set every likelihood to the same value and the posterior row becomes a copy of the prior row. Evidence that
            all the hypotheses explain equally well is not evidence at all — it cancels top and bottom.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 7 · Example 4 — the word "offer"                                           */
/* ========================================================================== */

export function OfferLab() {
  const [spam, setSpam] = useState(30) // P(Spam), percent
  const [ls, setLs] = useState(80) // P(offer | Spam)
  const [ln, setLn] = useState(10) // P(offer | Not spam)

  const notSpam = 100 - spam
  const viaSpam = spam * ls
  const viaNot = notSpam * ln
  const total = viaSpam + viaNot
  const post = total > 0 ? viaSpam / total : 0
  const isDeck = spam === 30 && ls === 80 && ln === 10

  return (
    <LabBox>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(offer) — any email contains it"
          value={(total / 10000).toFixed(4)}
          tone={TEAL}
          note={`= ${(ls / 100).toFixed(2)}×${(spam / 100).toFixed(2)} + ${(ln / 100).toFixed(2)}×${(notSpam / 100).toFixed(2)}`}
        />
        <ReadOut
          label="P(Spam | offer)"
          value={total > 0 ? post.toFixed(4) : '—'}
          tone="var(--acc)"
          note={`exactly ${frac(viaSpam, total)}`}
        />
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`                    P(offer | Spam)·P(Spam)        ${(viaSpam / 10000).toFixed(4)}
P(Spam | offer) = ───────────────────────────── = ────────  = ${total > 0 ? post.toFixed(4) : '—'}
                            P(offer)               ${(total / 10000).toFixed(4)}`}
      </div>

      <Slider
        label="P(Spam) — the prior"
        value={spam}
        display={`${spam}%`}
        min={1}
        max={99}
        step={1}
        hint="The slide has 30%."
        onChange={setSpam}
      />
      <Slider
        label="P(offer | Spam)"
        value={ls}
        display={`${ls}%`}
        min={0}
        max={100}
        step={1}
        hint="The slide has 80%."
        onChange={setLs}
      />
      <Slider
        label="P(offer | Not spam)"
        value={ln}
        display={`${ln}%`}
        min={0}
        max={100}
        step={1}
        hint="The slide has 10%."
        onChange={setLn}
      />

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setSpam(30)
            setLs(80)
            setLn(10)
          }}
        >
          The slide’s numbers
        </Btn>
        <Btn onClick={() => setLn(80)}>Make the word useless</Btn>
      </div>

      <Verdict ok={isDeck}>
        {isDeck
          ? 'The slide’s numbers, and the slide’s answer: P(offer) = 0.31 and P(Spam | offer) = 0.774, which it reads as a 77.4% chance.'
          : `P(Spam | offer) is now ${post.toFixed(4)}. Set both likelihoods equal and it falls back to the prior — a word that appears equally often in both kinds of mail carries no information.`}
      </Verdict>
    </LabBox>
  )
}
