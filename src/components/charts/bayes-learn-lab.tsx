'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { clamp, type Frame } from '@/lib/chart/frame'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

function frac(n: number, d: number) {
  if (d === 0) return '—'
  if (n === 0) return '0'
  const g = gcd(Math.abs(n), Math.abs(d))
  const dd = d / g
  return dd === 1 ? String(n / g) : `${n / g}/${dd}`
}

/* ========================================================================== */
/* 8 · h_MAP and h_ML                                                         */
/* ========================================================================== */

const HYP = ['h₁', 'h₂', 'h₃', 'h₄']

export function MapMlLab() {
  const [prior, setPrior] = useState([4, 3, 2, 1])
  const [lik, setLik] = useState([0.2, 0.45, 0.7, 0.85])
  const [flat, setFlat] = useState(false)

  const n = 4
  const raw = flat ? [1, 1, 1, 1] : prior
  const sw = raw.reduce((a, v) => a + v, 0)
  const pri = raw.map((v) => v / sw)
  const score = pri.map((p, i) => p * lik[i])
  const pD = score.reduce((a, v) => a + v, 0)
  const post = score.map((s) => (pD > 0 ? s / pD : 0))
  const map = score.indexOf(Math.max(...score))
  const ml = lik.slice(0, n).indexOf(Math.max(...lik.slice(0, n)))

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 34
    const boxW = W - pad * 2
    const rowH = (H - pad * 2 - 24) / 3
    const colW = boxW / n
    const rows: Array<[string, number[], string, number]> = [
      ['P(h) — prior', pri, '#a1a1aa', -1],
      ['P(D | h) — likelihood', lik.slice(0, n), '#f59e0b', ml],
      ['P(D | h)·P(h) — what MAP maximises', score, '#4f46e5', map],
    ]
    rows.forEach(([label, vals, col, mark], r) => {
      const top = pad + r * rowH
      const base = top + rowH - 20
      const hi = Math.max(...vals, 1e-9)
      g.fillStyle = '#71717a'
      g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'left'
      g.fillText(label, pad, top + 10)
      for (let i = 0; i < n; i++) {
        const h = (vals[i] / (r === 2 ? hi : 1)) * (rowH - 38)
        g.fillStyle = i === mark ? '#4f46e5' : col
        g.globalAlpha = i === mark ? 1 : 0.8
        g.fillRect(pad + i * colW + 10, base - h, colW - 20, h)
        g.globalAlpha = 1
        g.fillStyle = '#3f3f46'
        g.font = '600 11px ui-sans-serif, system-ui, sans-serif'
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
      g.fillStyle = i === map ? '#4f46e5' : '#09090b'
      g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText(HYP[i] + (i === map ? '  ← MAP' : ''), pad + i * colW + colW / 2, H - 10)
    }

    const rowMid = pad + rowH
    return {
      L: pad,
      R: pad + boxW,
      T: rowMid,
      B: rowMid + rowH - 20,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => rowMid + rowH - 20 - v * (rowH - 38),
      ux: (p: number) => (p - pad) / boxW,
      uy: (p: number) => (rowMid + rowH - 20 - p) / (rowH - 38),
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={370}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ flat: flat ? 1 : 0, l0: lik[0], l1: lik[1], l2: lik[2], l3: lik[3] }}
          jumpKey={flat ? 'flat' : 'weighted'}
          handles={(f: Frame) =>
            Array.from({ length: n }, (_, i) => ({
              id: `l${i}`,
              px: f.px((i + 0.5) / n),
              py: f.py(lik[i]),
              label: `likelihood P(D | ${HYP[i]})`,
            }))
          }
          onDragTo={(id, _x, y) => {
            const i = Number(id.slice(1))
            setLik((old) => old.map((v, j) => (j === i ? clamp(y, 0.01, 1) : v)))
          }}
          caption="Drag a middle bar to change how well that hypothesis explains the data. The bottom row is likelihood times prior — the thing h_MAP takes the biggest of."
        />
      }
      panel={
        <>
          <ReadOutGrid
            items={[
              { label: 'h_MAP', value: HYP[map] },
              { label: 'h_ML', value: HYP[ml] },
            ]}
          />
          <ReadOut
            label={`P(${HYP[map]} | D)`}
            value={post[map].toFixed(4)}
            tone="var(--acc)"
            note={`P(D) = ${pD.toFixed(4)} is the same for every hypothesis, so it cannot change which one wins.`}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={flat} label={flat ? 'Priors flattened' : 'Flatten every prior'} onClick={() => setFlat(!flat)} />
            <Btn onClick={() => setLik([0.2, 0.45, 0.7, 0.85])}>Reset the likelihoods</Btn>
          </div>
          {!flat &&
            Array.from({ length: n }, (_, i) => (
              <Slider
                key={i}
                label={`prior weight for ${HYP[i]}`}
                value={prior[i]}
                display={`${prior[i]} → ${pri[i].toFixed(3)}`}
                min={0}
                max={8}
                step={1}
                hint={i === 0 ? 'Weights are rescaled to add to 1.' : ' '}
                onChange={(v) => setPrior(prior.map((x, j) => (j === i ? v : x)))}
              />
            ))}
          <Verdict ok={map === ml}>
            {map === ml
              ? `h_MAP and h_ML agree on ${HYP[map]} right now.`
              : `h_MAP says ${HYP[map]} and h_ML says ${HYP[ml]}. The prior is the only thing separating them.`}
          </Verdict>
          <PanelNote>
            Press <strong>Flatten every prior</strong> and the bottom row becomes a scaled copy of the middle one, so
            h_MAP always lands on h_ML. That is exactly the condition the slide states: assume P(hᵢ) = P(hⱼ) and MAP
            simplifies to maximum likelihood.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 9 · Example 5 — fourteen days, one feature                                 */
/* ========================================================================== */

/*
 * Slide 21's fourteen rows, in order. Everything the lab prints — the frequency
 * table on slide 22, the row and column totals on slide 23, and the two answers
 * 0.60 and 0.40 — is counted out of this array, so the page cannot drift away
 * from the deck.
 */
const WEATHER_ROWS: Array<[string, boolean]> = [
  ['Sunny', false],
  ['Overcast', true],
  ['Rainy', true],
  ['Sunny', true],
  ['Sunny', true],
  ['Overcast', true],
  ['Rainy', false],
  ['Rainy', false],
  ['Sunny', true],
  ['Rainy', true],
  ['Sunny', false],
  ['Overcast', true],
  ['Overcast', true],
  ['Rainy', false],
]
const WKINDS = ['Sunny', 'Overcast', 'Rainy']
const WSTEPS = [
  'Step 1 — the raw data',
  'Step 2 — the frequency table',
  'Step 3 — row and column probabilities',
  'Step 4 — Bayes',
]

export function WeatherLab() {
  const [given, setGiven] = useState('Sunny')
  const [step, setStep] = useState(4)

  const N = WEATHER_ROWS.length
  const yes = WEATHER_ROWS.filter(([, p]) => p).length
  const no = N - yes
  const cell = (w: string, p: boolean) => WEATHER_ROWS.filter(([ww, pp]) => ww === w && pp === p).length
  const rowTot = (w: string) => cell(w, true) + cell(w, false)

  const gYes = cell(given, true)
  const gNo = cell(given, false)
  const gTot = gYes + gNo
  // P(Yes | w) = P(w | Yes)·P(Yes) / P(w). Both the deck and the lab work it
  // that way round rather than reading gYes/gTot straight off, because the
  // point of the example is that Bayes reproduces the obvious count.
  const pYesGiven = gTot > 0 ? gYes / gTot : 0
  const pNoGiven = gTot > 0 ? gNo / gTot : 0

  return (
    <LabBox>
      <Presets items={WSTEPS.map((s, i) => ({ id: i + 1, label: s }))} at={step} onPick={setStep} />

      {step === 1 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">#</th>
                <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">
                  Weather
                </th>
                <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">
                  Play
                </th>
              </tr>
            </thead>
            <tbody>
              {WEATHER_ROWS.map(([w, p], i) => (
                <tr key={i} className={w === given ? 'bg-indigo-50/70' : undefined}>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1 text-zinc-400">{i + 1}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1 font-semibold">{w}</td>
                  <td
                    className="border-b border-zinc-950/5 px-2.5 py-1 font-semibold"
                    style={{ color: p ? TEAL : RED }}
                  >
                    {p ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {step >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                  Weather
                </th>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">No</th>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">Yes</th>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                  Row total
                </th>
                {step >= 3 && (
                  <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                    P(weather)
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {WKINDS.map((w) => (
                <tr key={w} className={w === given ? 'bg-indigo-50/70' : undefined}>
                  <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">{w}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{cell(w, false)}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{cell(w, true)}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{rowTot(w)}</td>
                  {step >= 3 && (
                    <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{rowTot(w)}/14</td>
                  )}
                </tr>
              ))}
              <tr>
                <td className="px-2.5 py-2 font-semibold text-zinc-500">Column total</td>
                <td className="px-2.5 py-2 text-right font-mono font-semibold">{no}</td>
                <td className="px-2.5 py-2 text-right font-mono font-semibold">{yes}</td>
                <td className="px-2.5 py-2 text-right font-mono font-semibold">{N}</td>
                {step >= 3 && <td className="px-2.5 py-2 text-right text-zinc-400">—</td>}
              </tr>
              {step >= 3 && (
                <tr>
                  <td className="px-2.5 py-1 text-[12px] text-zinc-500">P(play)</td>
                  <td className="px-2.5 py-1 text-right font-mono text-[12px] text-zinc-500">{no}/14</td>
                  <td className="px-2.5 py-1 text-right font-mono text-[12px] text-zinc-500">{yes}/14</td>
                  <td className="px-2.5 py-1" />
                  <td className="px-2.5 py-1" />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {WKINDS.map((w) => (
          <Chip key={w} on={given === w} label={`Today is ${w}`} onClick={() => setGiven(w)} />
        ))}
      </div>

      {step >= 4 && (
        <>
          <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
            {`P(Yes | ${given}) = P(${given} | Yes)·P(Yes) / P(${given})
              = (${cell(given, true)}/${yes}) × (${yes}/14)  ÷  (${gTot}/14)
              = ${frac(cell(given, true), gTot)}  =  ${pYesGiven.toFixed(2)}

P(No  | ${given}) = P(${given} | No)·P(No) / P(${given})
              = (${cell(given, false)}/${no}) × (${no}/14)  ÷  (${gTot}/14)
              = ${frac(cell(given, false), gTot)}  =  ${pNoGiven.toFixed(2)}`}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOut label={`P(Yes | ${given})`} value={pYesGiven.toFixed(2)} tone={TEAL} />
            <ReadOut label={`P(No | ${given})`} value={pNoGiven.toFixed(2)} tone={RED} />
          </div>
          <Verdict ok={pYesGiven >= pNoGiven}>
            {pYesGiven === pNoGiven
              ? 'The two are equal, so this weather tells you nothing at all.'
              : pYesGiven > pNoGiven
                ? `P(Yes | ${given}) > P(No | ${given}). The player will play.`
                : `P(No | ${given}) > P(Yes | ${given}). The player will not play.`}
          </Verdict>
        </>
      )}

      <LabNote>
        The 14 counted rows above are the deck’s own, and with <strong>Sunny</strong> chosen the lab lands on the deck’s
        0.60 and 0.40. Notice the 14 cancels: the answer is 3/5, the Sunny column read on its own.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* 10 · From theorem to classifier                                            */
/* ========================================================================== */

const CLS = ['C₁', 'C₂', 'C₃']

export function ClassifierLab() {
  const [score, setScore] = useState([0.036, 0.012, 0.004])
  const [normalise, setNormalise] = useState(true)

  const total = score.reduce((a, v) => a + v, 0)
  const post = score.map((s) => (total > 0 ? s / total : 0))
  const shown = normalise ? post : score
  const win = score.indexOf(Math.max(...score))

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 36
    const boxW = W - pad * 2
    const boxH = H - pad * 2 - 20
    const colW = boxW / CLS.length
    const hi = Math.max(...shown, 1e-9)
    g.fillStyle = '#71717a'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'left'
    g.fillText(normalise ? 'P(Cᵢ | X) — divided by P(X)' : 'P(X | Cᵢ)·P(Cᵢ) — the raw score', pad, pad - 10)
    for (let i = 0; i < CLS.length; i++) {
      const h = (shown[i] / hi) * (boxH - 30)
      g.fillStyle = i === win ? '#4f46e5' : '#a1a1aa'
      g.fillRect(pad + i * colW + 14, pad + boxH - h, colW - 28, h)
      g.fillStyle = '#3f3f46'
      g.font = '600 12px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText(
        normalise ? shown[i].toFixed(3) : shown[i].toExponential(2),
        pad + i * colW + colW / 2,
        pad + boxH - h - 6
      )
      g.fillStyle = i === win ? '#4f46e5' : '#09090b'
      g.fillText(CLS[i], pad + i * colW + colW / 2, pad + boxH + 18)
    }
    g.strokeStyle = 'rgba(9,9,11,0.18)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(pad, pad + boxH)
    g.lineTo(pad + boxW, pad + boxH)
    g.stroke()
    return {
      L: pad,
      R: pad + boxW,
      T: pad,
      B: pad + boxH,
      px: (v: number) => pad + v * boxW,
      py: (v: number) => pad + boxH - (v / hi) * (boxH - 30),
      ux: (p: number) => (p - pad) / boxW,
      uy: (p: number) => ((pad + boxH - p) / (boxH - 30)) * hi,
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
          targets={{ n: normalise ? 1 : 0, s0: score[0], s1: score[1], s2: score[2] }}
          jumpKey={normalise ? 'norm' : 'raw'}
          handles={(f: Frame) =>
            score.map((s, i) => ({
              id: `s${i}`,
              px: f.px((i + 0.5) / CLS.length),
              py: f.py(normalise ? post[i] : s),
              label: `score for class ${CLS[i]}`,
            }))
          }
          onDragTo={(id, _x, y) => {
            const i = Number(id.slice(1))
            // Whichever view is showing, the raw score is what actually moves.
            // In the normalised view the dragged height is a posterior, so it is
            // inverted exactly rather than scaled by a total that includes the
            // value being replaced.
            const others = total - score[i]
            const target = normalise
              ? (clamp(y, 0.002, 0.97) * others) / (1 - clamp(y, 0.002, 0.97))
              : clamp(y, 0.0005, 1)
            setScore((old) => old.map((v, j) => (j === i ? target : v)))
          }}
          caption="Drag a bar. Switching between the raw score and the normalised posterior rescales every bar by the same factor — so the tallest one never changes."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(X) — the normaliser"
            value={total.toExponential(3)}
            tone={TEAL}
            note="Σ P(X | Cᵢ)·P(Cᵢ). One number, shared by every class."
          />
          <ReadOut
            label="Σ P(Cᵢ | X)"
            value={post.reduce((a, v) => a + v, 0).toFixed(6)}
            tone="var(--acc)"
            note="Exactly 1 — the classes are mutually exclusive and exhaustive, so dividing by P(X) has to land here."
          />
          <div className="flex flex-wrap gap-2">
            <Chip
              on={normalise}
              label={normalise ? 'Showing P(Cᵢ | X)' : 'Showing the raw score'}
              onClick={() => setNormalise(!normalise)}
            />
            <Btn onClick={() => setScore([0.036, 0.012, 0.004])}>Reset</Btn>
          </div>
          <Verdict ok>
            {CLS[win]} wins in both views. Dividing every score by the same P(X) cannot reorder them, which is why a
            classifier is allowed to skip the denominator entirely.
          </Verdict>
          <PanelNote>
            You still need the denominator if you want a <strong>probability</strong> rather than a decision — a
            calibrated 0.83 rather than “bigger than the other one”. Threshold tuning, cost-sensitive decisions and
            anything that reports a confidence all need the normalised row.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 11 · Conditional independence                                              */
/* ========================================================================== */

export function CondIndepLab() {
  const [n, setN] = useState(4)
  const [pTrue, setPTrue] = useState(60) // P(X₁ | X₂ = true, Y)
  const [pFalse, setPFalse] = useState(60) // P(X₁ | X₂ = false, Y)

  const full = Math.pow(2, n) - 1
  const naive = n
  const holds = pTrue === pFalse

  return (
    <LabBox>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="Without the assumption"
          value={full.toLocaleString()}
          tone={RED}
          note={`2^${n} − 1 numbers per class, because every combination of ${n} yes/no features needs its own.`}
        />
        <ReadOut
          label="With it"
          value={String(naive)}
          tone={TEAL}
          note={`One number per feature. ${n === 1 ? '' : `${full} down to ${naive}.`}`}
        />
      </div>

      <Slider
        label="How many yes/no features"
        value={n}
        display={String(n)}
        min={1}
        max={16}
        step={1}
        hint="Drag it up. The left number is doubling every step; the right one is going up by one."
        onChange={setN}
      />

      <LabNote>
        Now the assumption itself. The slide writes it as P(X₁ | X₂, Y) = P(X₁ | Y): once you know the class, the second
        feature tells you nothing more about the first. Set the two conditionals apart and it stops being true.
      </LabNote>

      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          label="P(X₁ | X₂ = yes, Y)"
          value={pTrue}
          display={`${pTrue}%`}
          min={0}
          max={100}
          step={5}
          hint="What X₁ does when X₂ happened."
          onChange={setPTrue}
        />
        <Slider
          label="P(X₁ | X₂ = no, Y)"
          value={pFalse}
          display={`${pFalse}%`}
          min={0}
          max={100}
          step={5}
          hint="What X₁ does when X₂ did not."
          onChange={setPFalse}
        />
      </div>

      <Verdict ok={holds}>
        {holds
          ? 'Equal, so X₁ is conditionally independent of X₂ given Y. This is the case Naive Bayes assumes — and P(X₁ | Y) is that same shared value.'
          : `Not equal — ${pTrue}% against ${pFalse}%. X₂ is still telling you something about X₁ after the class is known, so the product P(X₁ | Y)·P(X₂ | Y) is not the right joint here.`}
      </Verdict>

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setPTrue(60)
            setPFalse(60)
          }}
        >
          Make the assumption hold
        </Btn>
        <Btn
          onClick={() => {
            setPTrue(90)
            setPFalse(20)
          }}
        >
          Break it badly
        </Btn>
      </div>

      <LabNote>
        The slide’s own example of the assumption holding: P(Thunder | Rain, Lightning) = P(Thunder | Lightning). Once
        you know there was lightning, being told it also rained does not change how likely thunder is.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* 12 · The rule, built one factor at a time                                  */
/* ========================================================================== */

/*
 * The starting numbers are the play-tennis ones from slide 38, so this page and
 * part 15 have to agree: prior 9/14 against 5/14, and four conditionals each.
 * Stopping at k = 4 reproduces the deck's 0.021 and 0.005 exactly.
 */
const NB_FEATURES = ['Outlook = Sunny', 'Temp = Hot', 'Humidity = Normal', 'Windy = False']
const NB_YES = [3 / 9, 2 / 9, 6 / 9, 6 / 9]
const NB_NO = [2 / 5, 2 / 5, 1 / 5, 2 / 5]
const NB_YES_F = ['3/9', '2/9', '6/9', '6/9']
const NB_NO_F = ['2/5', '2/5', '1/5', '2/5']

export function NbRuleLab() {
  const [k, setK] = useState(4)
  const [logs, setLogs] = useState(false)

  const runYes = [9 / 14]
  const runNo = [5 / 14]
  for (let i = 0; i < 4; i++) {
    runYes.push(runYes[i] * NB_YES[i])
    runNo.push(runNo[i] * NB_NO[i])
  }
  const y = runYes[k]
  const nn = runNo[k]
  const fmt = (v: number) => (logs ? Math.log(v).toFixed(4) : v < 0.001 ? v.toExponential(3) : v.toFixed(5))

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                Factor multiplied in
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                Y = Yes
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                running score
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">Y = No</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                running score
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={k >= 0 ? undefined : 'opacity-30'}>
              <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">P(Y) — the prior</td>
              <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">9/14</td>
              <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{fmt(runYes[0])}</td>
              <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">5/14</td>
              <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{fmt(runNo[0])}</td>
            </tr>
            {NB_FEATURES.map((f, i) => (
              <tr key={f} className={clsx(i < k ? undefined : 'opacity-30', i === k - 1 && 'bg-indigo-50/70')}>
                <td className="border-b border-zinc-950/5 px-2.5 py-2">
                  P(X{i + 1} | Y) — {f}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{NB_YES_F[i]}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{fmt(runYes[i + 1])}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{NB_NO_F[i]}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{fmt(runNo[i + 1])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Slider
        label="How many features have been multiplied in"
        value={k}
        display={`${k} of 4`}
        min={0}
        max={4}
        step={1}
        hint="At 0 the answer is just the prior. Each step multiplies one more conditional in."
        onChange={setK}
      />

      <div className="flex flex-wrap gap-2">
        <Chip on={logs} label={logs ? 'Showing log scores' : 'Switch to log scores'} onClick={() => setLogs(!logs)} />
        <Btn onClick={() => setK(4)}>All four features</Btn>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut label="score for Yes" value={fmt(y)} tone={y >= nn ? TEAL : '#a1a1aa'} />
        <ReadOut label="score for No" value={fmt(nn)} tone={nn > y ? RED : '#a1a1aa'} />
      </div>

      <Verdict ok={y >= nn}>
        {y >= nn ? `argmax picks Yes: ${fmt(y)} against ${fmt(nn)}.` : `argmax picks No: ${fmt(nn)} against ${fmt(y)}.`}
      </Verdict>

      <LabNote>
        With all four in, the two scores are 0.021 and 0.005 — the deck’s own answers on slide 38. Switch to log scores
        and the numbers stop shrinking: adding logs is the same comparison, and it is what every implementation does,
        because a product of a few hundred small numbers underflows to zero in floating point.
      </LabNote>
    </LabBox>
  )
}
