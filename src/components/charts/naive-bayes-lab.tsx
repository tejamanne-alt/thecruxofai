'use client'

import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/**
 * A posterior as an exact fraction.
 *
 * Naive Bayes multiplies one small fraction per word, so a five-word message in
 * floating point is already at 1e-7 and a real one underflows. Everything here
 * stays in whole numbers until the moment it is printed: the two scores are put
 * over one common denominator, reduced, and only then turned into a decimal.
 * That is what lets the lab print the deck's 140/157 rather than 0.8917.
 *
 * Messages are capped at six words, which keeps every intermediate under 10¹²
 * and so exactly representable — a longer one would silently start rounding.
 */
function ratio(nA: number, nB: number) {
  const tot = nA + nB
  if (tot === 0) return { frac: '—', dec: 0 }
  const g = gcd(Math.abs(nA), tot) || 1
  const num = nA / g
  const den = tot / g
  return { frac: den === 1 ? String(num) : `${num}/${den}`, dec: nA / tot }
}

function ipow(base: number, n: number) {
  let r = 1
  for (let i = 0; i < n; i++) r *= base
  return r
}

/* ========================================================================== */
/* 13 & 14 · The Dear / Friend word table                                     */
/* ========================================================================== */

/*
 * Slide 31's frequency table, which is itself counted off slide 30's twenty-four
 * training words. The column totals 17, 7 and 24 are the deck's, and the deck
 * uses them as the class priors — a word-level prior rather than a
 * document-level one, which is worth noticing but is reproduced here as it
 * stands, because reproducing what the deck does is the point.
 */
const WORDS = ['Dear', 'Friend', 'Lunch', 'Money']
const COUNT_N = [8, 5, 3, 1]
const COUNT_S = [2, 1, 0, 4]

function tally(msg: number[]) {
  return WORDS.map((_, i) => msg.filter((w) => w === i).length)
}

/** Both scores over one common denominator, as exact integers. */
function scores(msg: number[], k: number) {
  const cN = COUNT_N.map((c) => c + k)
  const cS = COUNT_S.map((c) => c + k)
  const totN = cN.reduce((a, v) => a + v, 0)
  const totS = cS.reduce((a, v) => a + v, 0)
  const m = msg.length
  let prodN = 1
  let prodS = 1
  for (const w of msg) {
    prodN *= cN[w]
    prodS *= cS[w]
  }
  // score_N = (totN/grand)·Π(cN/totN), score_S likewise; the shared grand total
  // cancels, and the two are put over totN^m · totS^m.
  const a = totN * prodN * ipow(totS, m)
  const b = totS * prodS * ipow(totN, m)
  return { a, b, totN, totS, cN, cS }
}

export function DearFriendLab() {
  const [msg, setMsg] = useState([0, 1])

  const { a, b, totN, totS } = scores(msg, 0)
  const grand = totN + totS
  const rN = ratio(a, b)
  const rS = ratio(b, a)
  const counts = tally(msg)
  const isDeck = msg.length === 2 && counts[0] === 1 && counts[1] === 1

  let rawN = totN / grand
  let rawS = totS / grand
  for (const w of msg) {
    rawN *= COUNT_N[w] / totN
    rawS *= COUNT_S[w] / totS
  }

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Word</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">normal</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">spam</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                row total
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                in the message
              </th>
            </tr>
          </thead>
          <tbody>
            {WORDS.map((w, i) => (
              <tr key={w} className={counts[i] > 0 ? 'bg-indigo-50/70' : undefined}>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">{w}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{COUNT_N[i]}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">{COUNT_S[i]}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono text-zinc-500">
                  {COUNT_N[i] + COUNT_S[i]}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                  {counts[i] > 0 ? `× ${counts[i]}` : '—'}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2.5 py-2 font-semibold text-zinc-500">Column total</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{totN}</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{totS}</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{grand}</td>
              <td className="px-2.5 py-2" />
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <LabNote>Build a message. Press a word to add it; press Clear to start again.</LabNote>
        <div className="mt-2 flex flex-wrap gap-2">
          {WORDS.map((w, i) => (
            <Btn key={w} onClick={() => setMsg((old) => (old.length >= 6 ? old : [...old, i]))}>
              + {w}
            </Btn>
          ))}
          <Btn onClick={() => setMsg([])}>Clear</Btn>
          <Btn primary onClick={() => setMsg([0, 1])}>
            “Dear Friend”
          </Btn>
        </div>
        <p className="mt-2 font-mono text-[13px] text-zinc-700">
          message: {msg.length === 0 ? '(empty)' : msg.map((w) => WORDS[w]).join(' ')}
        </p>
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`P(N) · ${msg.map((w) => `P(${WORDS[w][0]}|N)`).join(' · ') || '1'}  =  ${rawN.toExponential(4)}
P(S) · ${msg.map((w) => `P(${WORDS[w][0]}|S)`).join(' · ') || '1'}  =  ${rawS.toExponential(4)}`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(Normal | message)"
          value={rN.frac}
          tone={rN.dec >= 0.5 ? TEAL : '#a1a1aa'}
          note={`= ${rN.dec.toFixed(4)}`}
        />
        <ReadOut
          label="P(Spam | message)"
          value={rS.frac}
          tone={rS.dec > 0.5 ? RED : '#a1a1aa'}
          note={`= ${rS.dec.toFixed(4)}`}
        />
      </div>

      <Verdict ok={rN.dec >= rS.dec}>
        {msg.length === 0
          ? 'An empty message gets the prior back: 17/24 against 7/24.'
          : rN.dec >= rS.dec
            ? `Normal wins — ${rN.dec.toFixed(4)} against ${rS.dec.toFixed(4)}.`
            : `Spam wins — ${rS.dec.toFixed(4)} against ${rN.dec.toFixed(4)}.`}
      </Verdict>

      {isDeck && (
        <PanelNote>
          This is the deck’s own message. It prints 0.891 and 0.109, having rounded the two scores to 0.098 and 0.012
          and their total to 0.11 before dividing. Carried through as fractions the answers are 140/157 = 0.8917 and
          17/157 = 0.1083. Same verdict, and the same arithmetic — only the rounding differs.
        </PanelNote>
      )}
    </LabBox>
  )
}

export function LaplaceLab() {
  const [k, setK] = useState(0)
  const [msg, setMsg] = useState([2, 3, 3, 3, 3])

  const { a, b, totN, totS, cN, cS } = scores(msg, k)
  const rN = ratio(a, b)
  const rS = ratio(b, a)
  const counts = tally(msg)
  const grand = totN + totS

  let rawN = totN / grand
  let rawS = totS / grand
  for (const w of msg) {
    rawN *= cN[w] / totN
    rawS *= cS[w] / totS
  }
  const dead = rawN === 0 && rawS === 0

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Word</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">normal</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">spam</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(word | normal)
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(word | spam)
              </th>
            </tr>
          </thead>
          <tbody>
            {WORDS.map((w, i) => (
              <tr key={w} className={counts[i] > 0 ? 'bg-indigo-50/70' : undefined}>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">
                  {w}
                  {counts[i] > 1 ? ` × ${counts[i]}` : ''}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                  {k === 0 ? COUNT_N[i] : `${COUNT_N[i]}+${k}`}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                  {k === 0 ? COUNT_S[i] : `${COUNT_S[i]}+${k}`}
                </td>
                <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                  {cN[i]}/{totN}
                </td>
                <td
                  className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono"
                  style={cS[i] === 0 ? { color: RED, fontWeight: 600 } : undefined}
                >
                  {cS[i]}/{totS}
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-2.5 py-2 font-semibold text-zinc-500">Column total</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{totN}</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{totS}</td>
              <td className="px-2.5 py-2 text-right font-mono text-zinc-500">grand {grand}</td>
              <td className="px-2.5 py-2" />
            </tr>
          </tbody>
        </table>
      </div>

      <Slider
        label="Laplace smoothing — add k to every cell"
        value={k}
        display={`k = ${k}`}
        min={0}
        max={3}
        step={1}
        hint="k = 0 is the raw table. The deck adds 1, which is what makes the totals 21 and 11."
        onChange={setK}
      />

      <div className="flex flex-wrap gap-2">
        <Btn primary onClick={() => setMsg([2, 3, 3, 3, 3])}>
          “Lunch Money Money Money Money”
        </Btn>
        <Btn onClick={() => setMsg([0, 1])}>“Dear Friend”</Btn>
        <Btn onClick={() => setMsg([2])}>Just “Lunch”</Btn>
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`P(N)·P(L|N)·P(M|N)⁴ = ${rawN === 0 ? '0' : rawN.toExponential(4)}
P(S)·P(L|S)·P(M|S)⁴ = ${rawS === 0 ? '0' : rawS.toExponential(4)}`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(Normal | message)"
          value={dead ? '—' : rN.frac}
          tone={dead ? '#a1a1aa' : rN.dec >= 0.5 ? TEAL : '#a1a1aa'}
          note={dead ? 'both scores are zero' : `= ${rN.dec.toFixed(5)}`}
        />
        <ReadOut
          label="P(Spam | message)"
          value={dead ? '—' : rS.frac}
          tone={dead ? '#a1a1aa' : rS.dec > 0.5 ? RED : '#a1a1aa'}
          note={dead ? 'both scores are zero' : `= ${rS.dec.toFixed(5)}`}
        />
      </div>

      <Verdict ok={k > 0 && rawS > 0}>
        {k === 0 && rawS === 0
          ? 'P(Lunch | spam) = 0/7, so the spam score is exactly zero however many times Money appears. The message is classified Normal by default, not by evidence — this is the deck’s “issue with the Naïve Bayes classifier”.'
          : k === 0
            ? 'No smoothing yet. Any word with a zero count wipes out its whole class.'
            : `With k = ${k} every cell is non-zero, so both classes can still speak. The verdict is ${rS.dec > rN.dec ? 'Spam' : 'Normal'}.`}
      </Verdict>

      <LabNote>
        With the deck’s message and k = 1 the two scores are 0.00001 and 0.00133, exactly as slide 35 has them, and the
        answer flips from Normal to Spam. Nothing was learned in between: the only change was refusing to believe that a
        count of zero means a probability of zero.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* 15 · Play tennis, four attributes                                          */
/* ========================================================================== */

/*
 * Slide 36's fourteen rows. Every fraction on slide 37 and both scores on slide
 * 38 are counted out of this array rather than typed in, so a mistyped row
 * would show up as a wrong frequency table rather than hiding inside an answer.
 */
type TennisRow = { outlook: string; temp: string; humidity: string; windy: string; play: boolean }
const TENNIS: TennisRow[] = [
  { outlook: 'Rainy', temp: 'Hot', humidity: 'High', windy: 'False', play: false },
  { outlook: 'Rainy', temp: 'Hot', humidity: 'High', windy: 'True', play: false },
  { outlook: 'Overcast', temp: 'Hot', humidity: 'High', windy: 'False', play: true },
  { outlook: 'Sunny', temp: 'Mild', humidity: 'High', windy: 'False', play: true },
  { outlook: 'Sunny', temp: 'Cool', humidity: 'Normal', windy: 'False', play: true },
  { outlook: 'Sunny', temp: 'Cool', humidity: 'Normal', windy: 'True', play: false },
  { outlook: 'Overcast', temp: 'Cool', humidity: 'Normal', windy: 'True', play: true },
  { outlook: 'Rainy', temp: 'Mild', humidity: 'High', windy: 'False', play: false },
  { outlook: 'Rainy', temp: 'Cool', humidity: 'Normal', windy: 'False', play: true },
  { outlook: 'Sunny', temp: 'Mild', humidity: 'Normal', windy: 'False', play: true },
  { outlook: 'Rainy', temp: 'Mild', humidity: 'Normal', windy: 'True', play: true },
  { outlook: 'Overcast', temp: 'Mild', humidity: 'High', windy: 'True', play: true },
  { outlook: 'Overcast', temp: 'Hot', humidity: 'Normal', windy: 'False', play: true },
  { outlook: 'Sunny', temp: 'Mild', humidity: 'High', windy: 'True', play: false },
]
const TENNIS_ATTRS: Array<{ key: keyof Omit<TennisRow, 'play'>; label: string; values: string[] }> = [
  { key: 'outlook', label: 'Outlook', values: ['Sunny', 'Overcast', 'Rainy'] },
  { key: 'temp', label: 'Temp', values: ['Hot', 'Mild', 'Cool'] },
  { key: 'humidity', label: 'Humidity', values: ['High', 'Normal'] },
  { key: 'windy', label: 'Windy', values: ['True', 'False'] },
]

export function TennisLab() {
  const [pick, setPick] = useState<Record<string, string>>({
    outlook: 'Sunny',
    temp: 'Hot',
    humidity: 'Normal',
    windy: 'False',
  })

  const yes = TENNIS.filter((r) => r.play).length
  const no = TENNIS.length - yes
  const cnt = (key: keyof Omit<TennisRow, 'play'>, v: string, play: boolean) =>
    TENNIS.filter((r) => r[key] === v && r.play === play).length

  let sYes = yes / TENNIS.length
  let sNo = no / TENNIS.length
  const linesYes: string[] = [`${yes}/14`]
  const linesNo: string[] = [`${no}/14`]
  for (const a of TENNIS_ATTRS) {
    const v = pick[a.key]
    sYes *= cnt(a.key, v, true) / yes
    sNo *= cnt(a.key, v, false) / no
    linesYes.push(`${cnt(a.key, v, true)}/${yes}`)
    linesNo.push(`${cnt(a.key, v, false)}/${no}`)
  }
  const tot = sYes + sNo
  const isDeck = pick.outlook === 'Sunny' && pick.temp === 'Hot' && pick.humidity === 'Normal' && pick.windy === 'False'

  return (
    <LabBox>
      <div className="grid gap-3 sm:grid-cols-2">
        {TENNIS_ATTRS.map((a) => (
          <div key={a.key}>
            <div className="mb-1.5 text-[12px] font-semibold text-zinc-500">{a.label}</div>
            <Presets
              items={a.values.map((v) => ({ id: v, label: v }))}
              at={pick[a.key]}
              onPick={(v) => setPick({ ...pick, [a.key]: v })}
            />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                Attribute
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Value</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(value | Yes)
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(value | No)
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(value)
              </th>
            </tr>
          </thead>
          <tbody>
            {TENNIS_ATTRS.flatMap((a) =>
              a.values.map((v) => {
                const on = pick[a.key] === v
                return (
                  <tr key={`${a.key}-${v}`} className={on ? 'bg-indigo-50/70' : undefined}>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-zinc-500">
                      {v === a.values[0] ? a.label : ''}
                    </td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 font-semibold">{v}</td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">
                      {cnt(a.key, v, true)}/{yes}
                    </td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">
                      {cnt(a.key, v, false)}/{no}
                    </td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono text-zinc-500">
                      {cnt(a.key, v, true) + cnt(a.key, v, false)}/14
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`Yes:  ${linesYes.join(' × ')}  =  ${sYes.toFixed(5)}
No :  ${linesNo.join(' × ')}  =  ${sNo.toFixed(5)}`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut label="score for Yes" value={sYes.toFixed(3)} tone={sYes >= sNo ? TEAL : '#a1a1aa'} />
        <ReadOut label="score for No" value={sNo.toFixed(3)} tone={sNo > sYes ? RED : '#a1a1aa'} />
      </div>
      <ReadOut
        label="P(Yes | today), after dividing by the total"
        value={tot > 0 ? (sYes / tot).toFixed(4) : '—'}
        tone="var(--acc)"
        note="The deck stops at the two scores, because the comparison is all a classifier needs."
      />

      <Verdict ok={sYes >= sNo}>
        {sYes >= sNo
          ? 'P(Yes | X) > P(No | X). The player will play tennis.'
          : 'P(No | X) > P(Yes | X). The player will not play tennis.'}
      </Verdict>

      {isDeck && (
        <LabNote>
          These are the deck’s own choices — Sunny, Hot, Normal, False — and the two scores are its 0.021 and 0.005. Try{' '}
          <strong>Overcast</strong>: the No score drops to exactly zero, because no overcast day in the fourteen ended
          in No. That is the same zero-count problem as the last part, arriving from a different direction.
        </LabNote>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* 16 · Which species is it?                                                  */
/* ========================================================================== */

/*
 * Slide 39's eight specimens. The frequency table on slide 40 is counted from
 * them here, which is what exposes the one cell where the deck's printed table
 * and the deck's own data disagree — see the Height row for S1.
 */
type Bug = { colour: string; legs: string; height: string; smelly: string; sp: string }
const BUGS: Bug[] = [
  { colour: 'White', legs: '3', height: 'Short', smelly: 'Yes', sp: 'S1' },
  { colour: 'Green', legs: '2', height: 'Tall', smelly: 'No', sp: 'S1' },
  { colour: 'Green', legs: '3', height: 'Short', smelly: 'Yes', sp: 'S1' },
  { colour: 'White', legs: '3', height: 'Short', smelly: 'Yes', sp: 'S1' },
  { colour: 'Green', legs: '2', height: 'Short', smelly: 'No', sp: 'S2' },
  { colour: 'White', legs: '2', height: 'Tall', smelly: 'No', sp: 'S2' },
  { colour: 'White', legs: '2', height: 'Tall', smelly: 'No', sp: 'S2' },
  { colour: 'White', legs: '2', height: 'Short', smelly: 'Yes', sp: 'S2' },
]
const BUG_ATTRS: Array<{ key: keyof Omit<Bug, 'sp'>; label: string; values: string[] }> = [
  { key: 'colour', label: 'Colour', values: ['White', 'Green'] },
  { key: 'legs', label: 'Legs', values: ['2', '3'] },
  { key: 'height', label: 'Height', values: ['Tall', 'Short'] },
  { key: 'smelly', label: 'Smelly', values: ['Yes', 'No'] },
]

export function SpeciesLab() {
  const [pick, setPick] = useState<Record<string, string>>({
    colour: 'Green',
    legs: '2',
    height: 'Tall',
    smelly: 'No',
  })
  const [asPrinted, setAsPrinted] = useState(false)

  const n1 = BUGS.filter((b) => b.sp === 'S1').length
  const n2 = BUGS.length - n1
  const cnt = (key: keyof Omit<Bug, 'sp'>, v: string, sp: string) =>
    BUGS.filter((b) => b[key] === v && b.sp === sp).length

  /*
   * The one disputed cell. Slide 40 prints P(Height = Tall | S1) = 3/4 and
   * P(Short | S1) = 1/4; the eight rows above give 1/4 and 3/4. Slide 41 then
   * computes with 3/4. The toggle shows both readings rather than picking one.
   */
  const numer = (key: keyof Omit<Bug, 'sp'>, v: string, sp: string) => {
    if (asPrinted && key === 'height' && sp === 'S1') return v === 'Tall' ? 3 : 1
    return cnt(key, v, sp)
  }

  let s1 = n1 / BUGS.length
  let s2 = n2 / BUGS.length
  const l1 = [`${n1}/8`]
  const l2 = [`${n2}/8`]
  for (const a of BUG_ATTRS) {
    const v = pick[a.key]
    s1 *= numer(a.key, v, 'S1') / n1
    s2 *= numer(a.key, v, 'S2') / n2
    l1.push(`${numer(a.key, v, 'S1')}/${n1}`)
    l2.push(`${numer(a.key, v, 'S2')}/${n2}`)
  }
  const isDeck = pick.colour === 'Green' && pick.legs === '2' && pick.height === 'Tall' && pick.smelly === 'No'
  const heightMatters = pick.height === 'Tall' || pick.height === 'Short'

  return (
    <LabBox>
      <div className="grid gap-3 sm:grid-cols-2">
        {BUG_ATTRS.map((a) => (
          <div key={a.key}>
            <div className="mb-1.5 text-[12px] font-semibold text-zinc-500">{a.label}</div>
            <Presets
              items={a.values.map((v) => ({ id: v, label: v }))}
              at={pick[a.key]}
              onPick={(v) => setPick({ ...pick, [a.key]: v })}
            />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                Attribute
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Value</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">S1</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">S2</th>
            </tr>
          </thead>
          <tbody>
            {BUG_ATTRS.flatMap((a) =>
              a.values.map((v) => {
                const on = pick[a.key] === v
                const disputed = a.key === 'height'
                return (
                  <tr key={`${a.key}-${v}`} className={on ? 'bg-indigo-50/70' : undefined}>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-zinc-500">
                      {v === a.values[0] ? a.label : ''}
                    </td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 font-semibold">{v}</td>
                    <td
                      className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono"
                      style={disputed ? { color: RED, fontWeight: 600 } : undefined}
                    >
                      {numer(a.key, v, 'S1')}/{n1}
                    </td>
                    <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">
                      {numer(a.key, v, 'S2')}/{n2}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={!asPrinted} label="Height counted from the eight rows" onClick={() => setAsPrinted(false)} />
        <Chip on={asPrinted} label="Height as slide 40 prints it" onClick={() => setAsPrinted(true)} />
      </div>

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`S1:  ${l1.join(' × ')}  =  ${s1.toFixed(5)}
S2:  ${l2.join(' × ')}  =  ${s2.toFixed(5)}`}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut label="score for S1" value={s1.toFixed(4)} tone={s1 >= s2 ? TEAL : '#a1a1aa'} />
        <ReadOut label="score for S2" value={s2.toFixed(4)} tone={s2 > s1 ? '#4f46e5' : '#a1a1aa'} />
      </div>

      <Verdict ok={s2 >= s1}>
        {s2 >= s1 ? 'The new instance is classified as S2.' : 'The new instance is classified as S1.'}
      </Verdict>

      {isDeck && (
        <LabNote>
          {heightMatters ? (
            <>
              The deck’s own instance. Its printed answer is 0.0117 for S1 and 0.047 for S2, and the 0.0117 needs the
              printed Height row. Counted from the eight specimens instead, S1 scores 0.0039. The two readings cannot
              both be right — but S2 wins under either, because the S2 column does not touch the disputed cell.
            </>
          ) : (
            <>The deck’s own instance, with the deck’s answer of 0.047 for S2.</>
          )}
        </LabNote>
      )}
    </LabBox>
  )
}
