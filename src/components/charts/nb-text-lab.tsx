'use client'

import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/* ========================================================================== */
/* Shared: a bag-of-words corpus with Laplace smoothing                       */
/* ========================================================================== */

interface Corpus {
  docs: Array<{ text: string; words: string[]; tag: 0 | 1 }>
  vocab: string[]
  names: [string, string]
}

function counts(c: Corpus, tag: 0 | 1) {
  const m = new Map<string, number>()
  for (const w of c.vocab) m.set(w, 0)
  for (const d of c.docs) if (d.tag === tag) for (const w of d.words) m.set(w, (m.get(w) ?? 0) + 1)
  return m
}

function totalWords(c: Corpus, tag: 0 | 1) {
  return c.docs.filter((d) => d.tag === tag).reduce((a, d) => a + d.words.length, 0)
}

/** P(class) · Π P(word | class), with add-k smoothing over the whole vocabulary. */
function score(c: Corpus, tag: 0 | 1, sentence: string[], k: number) {
  const m = counts(c, tag)
  const tot = totalWords(c, tag)
  const nDocs = c.docs.filter((d) => d.tag === tag).length
  let s = nDocs / c.docs.length
  for (const w of sentence) s *= ((m.get(w) ?? 0) + k) / (tot + k * c.vocab.length)
  return s
}

/* ========================================================================== */
/* 17 · Naive Bayes for text — the sports example                             */
/* ========================================================================== */

/*
 * Slides 44–47. The five tagged sentences are the deck's; the fourteen-word
 * vocabulary is the list it prints on slide 46. Every count in the table below
 * is tallied from the sentences rather than typed in, so the 2+1/11+14 on slide
 * 47 has to come out of the data or the table is visibly wrong.
 */
const SPORTS: Corpus = {
  names: ['Sports', 'Not sports'],
  vocab: [
    'a',
    'great',
    'very',
    'over',
    'it',
    'but',
    'game',
    'election',
    'clean',
    'close',
    'the',
    'was',
    'forgettable',
    'match',
  ],
  docs: [
    { text: '“A great game”', words: ['a', 'great', 'game'], tag: 0 },
    { text: '“The election was over”', words: ['the', 'election', 'was', 'over'], tag: 1 },
    { text: '“Very clean match”', words: ['very', 'clean', 'match'], tag: 0 },
    { text: '“A clean but forgettable game”', words: ['a', 'clean', 'but', 'forgettable', 'game'], tag: 0 },
    { text: '“It was a close election”', words: ['it', 'was', 'a', 'close', 'election'], tag: 1 },
  ],
}

export function TextClassLab() {
  const [sentence, setSentence] = useState(['a', 'very', 'close', 'game'])
  const [k, setK] = useState(1)

  const c0 = counts(SPORTS, 0)
  const c1 = counts(SPORTS, 1)
  const t0 = totalWords(SPORTS, 0)
  const t1 = totalWords(SPORTS, 1)
  const V = SPORTS.vocab.length
  const s0 = score(SPORTS, 0, sentence, k)
  const s1 = score(SPORTS, 1, sentence, k)
  const tot = s0 + s1
  const isDeck = sentence.join(' ') === 'a very close game' && k === 1

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[380px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">Text</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">Tag</th>
            </tr>
          </thead>
          <tbody>
            {SPORTS.docs.map((d) => (
              <tr key={d.text}>
                <td className="border-b border-zinc-950/5 px-2.5 py-1">{d.text}</td>
                <td
                  className="border-b border-zinc-950/5 px-2.5 py-1 font-semibold"
                  style={{ color: d.tag === 0 ? TEAL : RED }}
                >
                  {SPORTS.names[d.tag]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <LabNote>
          Build a sentence out of the {V}-word vocabulary the deck lists. Word order is thrown away — that is what “bag
          of words” means — so only which words appear, and how often, can matter.
        </LabNote>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SPORTS.vocab.map((w) => (
            <Chip
              key={w}
              on={sentence.includes(w)}
              label={w}
              onClick={() => setSentence((old) => (old.length >= 7 ? old : [...old, w]))}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn onClick={() => setSentence([])}>Clear</Btn>
          <Btn primary onClick={() => setSentence(['a', 'very', 'close', 'game'])}>
            “A very close game”
          </Btn>
        </div>
        <p className="mt-2 font-mono text-[13px] text-zinc-700">
          sentence: {sentence.length === 0 ? '(empty)' : sentence.join(' ')}
        </p>
      </div>

      <Slider
        label="Laplace smoothing k"
        value={k}
        display={`k = ${k}`}
        min={0}
        max={3}
        step={1}
        hint={`Adds k to every count and k × ${V} to every total, so the fractions still add to 1.`}
        onChange={setK}
      />

      {sentence.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Word</th>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                  P(word | Sports)
                </th>
                <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                  P(word | Not sports)
                </th>
              </tr>
            </thead>
            <tbody>
              {sentence.map((w, i) => (
                <tr key={`${w}-${i}`}>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 font-semibold">{w}</td>
                  <td
                    className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono"
                    style={k === 0 && (c0.get(w) ?? 0) === 0 ? { color: RED, fontWeight: 600 } : undefined}
                  >
                    {k === 0 ? `${c0.get(w)}/${t0}` : `${c0.get(w)}+${k} / ${t0}+${k * V}`}
                  </td>
                  <td
                    className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono"
                    style={k === 0 && (c1.get(w) ?? 0) === 0 ? { color: RED, fontWeight: 600 } : undefined}
                  >
                    {k === 0 ? `${c1.get(w)}/${t1}` : `${c1.get(w)}+${k} / ${t1}+${k * V}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(Sports) × Π P(word | Sports)"
          value={s0 === 0 ? '0' : s0.toExponential(3)}
          tone={s0 >= s1 ? TEAL : '#a1a1aa'}
          note={`prior 3/5, ${t0} words of training text`}
        />
        <ReadOut
          label="P(Not sports) × Π P(word | Not sports)"
          value={s1 === 0 ? '0' : s1.toExponential(3)}
          tone={s1 > s0 ? RED : '#a1a1aa'}
          note={`prior 2/5, ${t1} words of training text`}
        />
      </div>

      <Verdict ok={tot > 0}>
        {tot === 0
          ? 'Both scores are zero, so the classifier cannot choose. Raise k above 0 and it can.'
          : `${s0 >= s1 ? 'Sports' : 'Not sports'} wins, with P = ${(Math.max(s0, s1) / tot).toFixed(4)} after normalising.`}
      </Verdict>

      {isDeck && (
        <LabNote>
          The deck’s own sentence and its own k = 1: 2.76 × 10⁻⁵ against 0.572 × 10⁻⁵, so “A very close game” is tagged
          Sports. Slide k back to 0 and the Sports score collapses to exactly zero, because “close” never appears in a
          sports sentence — the failure slide 45 warns about.
        </LabNote>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* 18 · Movie-review sentiment                                                */
/* ========================================================================== */

/*
 * Slides 48–53. The word table on slide 51 is counted from these five reviews,
 * and the ten distinct words are the vocabulary that makes the denominators
 * 14 + 10 and 6 + 10.
 */
const REVIEWS: Corpus = {
  names: ['Positive', 'Negative'],
  vocab: ['i', 'loved', 'the', 'movie', 'hated', 'a', 'great', 'poor', 'acting', 'good'],
  docs: [
    { text: 'I LOVED THE MOVIE', words: ['i', 'loved', 'the', 'movie'], tag: 0 },
    { text: 'I HATED THE MOVIE', words: ['i', 'hated', 'the', 'movie'], tag: 1 },
    { text: 'A GREAT MOVIE, GOOD MOVIE', words: ['a', 'great', 'movie', 'good', 'movie'], tag: 0 },
    { text: 'POOR ACTING', words: ['poor', 'acting'], tag: 1 },
    { text: 'GREAT ACTING, A GOOD MOVIE', words: ['great', 'acting', 'a', 'good', 'movie'], tag: 0 },
  ],
}

export function SentimentLab() {
  const [sentence, setSentence] = useState(['i', 'hated', 'the', 'poor', 'acting'])

  const c0 = counts(REVIEWS, 0)
  const c1 = counts(REVIEWS, 1)
  const t0 = totalWords(REVIEWS, 0)
  const t1 = totalWords(REVIEWS, 1)
  const V = REVIEWS.vocab.length
  const s0 = score(REVIEWS, 0, sentence, 1)
  const s1 = score(REVIEWS, 1, sentence, 1)
  const tot = s0 + s1
  const isDeck = sentence.join(' ') === 'i hated the poor acting'

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">Doc</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">Text</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-1.5 text-left font-semibold text-zinc-500">Tag</th>
            </tr>
          </thead>
          <tbody>
            {REVIEWS.docs.map((d, i) => (
              <tr key={d.text}>
                <td className="border-b border-zinc-950/5 px-2.5 py-1 text-zinc-400">{i + 1}</td>
                <td className="border-b border-zinc-950/5 px-2.5 py-1">{d.text}</td>
                <td
                  className="border-b border-zinc-950/5 px-2.5 py-1 font-semibold"
                  style={{ color: d.tag === 0 ? TEAL : RED }}
                >
                  {REVIEWS.names[d.tag]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">Word</th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                positive
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                negative
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(w | +)
              </th>
              <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                P(w | −)
              </th>
            </tr>
          </thead>
          <tbody>
            {REVIEWS.vocab.map((w) => {
              const on = sentence.includes(w)
              return (
                <tr key={w} className={on ? 'bg-indigo-50/70' : undefined}>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 font-semibold">{w}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">{c0.get(w)}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">{c1.get(w)}</td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">
                    {((c0.get(w) ?? 0) + 1) / (t0 + V) === 0 ? '0' : (((c0.get(w) ?? 0) + 1) / (t0 + V)).toFixed(4)}
                  </td>
                  <td className="border-b border-zinc-950/5 px-2.5 py-1.5 text-right font-mono">
                    {(((c1.get(w) ?? 0) + 1) / (t1 + V)).toFixed(4)}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td className="px-2.5 py-2 font-semibold text-zinc-500">Totals</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{t0}</td>
              <td className="px-2.5 py-2 text-right font-mono font-semibold">{t1}</td>
              <td className="px-2.5 py-2 text-right font-mono text-zinc-500">÷ {t0 + V}</td>
              <td className="px-2.5 py-2 text-right font-mono text-zinc-500">÷ {t1 + V}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <LabNote>Press words to build the new review. Every count above already has Laplace’s 1 added to it.</LabNote>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {REVIEWS.vocab.map((w) => (
            <Chip
              key={w}
              on={sentence.includes(w)}
              label={w}
              onClick={() => setSentence((old) => (old.length >= 8 ? old : [...old, w]))}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Btn onClick={() => setSentence([])}>Clear</Btn>
          <Btn primary onClick={() => setSentence(['i', 'hated', 'the', 'poor', 'acting'])}>
            “I hated the poor acting”
          </Btn>
          <Btn onClick={() => setSentence(['a', 'great', 'movie'])}>“A great movie”</Btn>
        </div>
        <p className="mt-2 font-mono text-[13px] text-zinc-700">
          new text: {sentence.length === 0 ? '(empty)' : sentence.join(' ')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOut
          label="P(+ | x)  ∝"
          value={s0.toExponential(2)}
          tone={s0 >= s1 ? TEAL : '#a1a1aa'}
          note="prior 3/5 — three of the five reviews are positive"
        />
        <ReadOut label="P(− | x)  ∝" value={s1.toExponential(2)} tone={s1 > s0 ? RED : '#a1a1aa'} note="prior 2/5" />
      </div>

      <Verdict ok={tot > 0}>
        {tot === 0
          ? 'Nothing to classify yet.'
          : `${s0 >= s1 ? 'Positive' : 'Negative'} class, by a factor of ${(Math.max(s0, s1) / Math.min(s0, s1)).toFixed(1)}.`}
      </Verdict>

      {isDeck && (
        <LabNote>
          The deck’s own new text, and its own answers: 6.03 × 10⁻⁷ for positive against 1.22 × 10⁻⁵ for negative, so
          the review is Negative. Notice how it got there — every negative word has the same 0.125, because the negative
          class has only six training words and Laplace has flattened it almost completely.
        </LabNote>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* 19 · What the assumption costs                                             */
/* ========================================================================== */

const ISSUES: Array<{ id: string; label: string; body: string }> = [
  {
    id: 'priors',
    label: 'It needs many probabilities up front',
    body: 'Slide 56: Bayesian learning requires initial knowledge of many probabilities. They are usually estimated from background knowledge, from data you already have, or from an assumption about the shape of the underlying distribution — and an estimate made from four training rows is not worth much.',
  },
  {
    id: 'cost',
    label: 'The optimal hypothesis is expensive',
    body: 'Slide 56: finding the Bayes optimal hypothesis in the general case costs significantly, linear in the number of candidate hypotheses. Naive Bayes is cheap precisely because it gives that up and scores each class with a single product instead.',
  },
  {
    id: 'when',
    label: 'When it is the right tool',
    body: 'Slide 55: a moderate or large training set, and attributes that are conditionally independent given the class. The deck lists diagnosis and classifying text documents as the successful applications, alongside decision trees and neural networks as the other practical learners.',
  },
  {
    id: 'zero',
    label: 'A single zero count',
    body: 'Slide 34: a word never seen with a class makes that class score exactly zero, whatever else the message contains. Laplace smoothing on slide 35 is the deck’s answer, and it flipped the verdict from Normal to Spam.',
  },
]

export function AssumptionCostLab() {
  const [dup, setDup] = useState(1)
  const [open, setOpen] = useState('zero')

  // The Dear/Friend table again — repeating one word is the cleanest way to see
  // what the independence assumption is worth, because repeating a word adds no
  // information at all and yet the product keeps moving.
  const N = [8, 5]
  const S = [2, 1]
  const totN = 17
  const totS = 7
  let sN = totN / 24
  let sS = totS / 24
  for (let i = 0; i < dup; i++) {
    sN *= N[0] / totN
    sS *= S[0] / totS
  }
  sN *= N[1] / totN
  sS *= S[1] / totS
  const post = sN / (sN + sS)

  return (
    <LabBox>
      <LabNote>
        Slide 27 is careful about this:{' '}
        <strong>Naive Bayes assumes conditional independence where Bayes theorem does not</strong>. Here is the bill.
        The message is “Dear Friend” from the earlier example, and the only change is how many times the word Dear is
        counted.
      </LabNote>

      <Slider
        label="How many times the word “Dear” is counted"
        value={dup}
        display={dup === 1 ? 'once — the honest message' : `${dup} times`}
        min={1}
        max={5}
        step={1}
        hint="Nothing new is being said. The same word is simply repeated, or counted twice by two features that mean the same thing."
        onChange={setDup}
      />

      <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
        {`P(N)·P(D|N)${dup > 1 ? `^${dup}` : ''}·P(F|N)  =  ${sN.toExponential(4)}
P(S)·P(D|S)${dup > 1 ? `^${dup}` : ''}·P(F|S)  =  ${sS.toExponential(4)}`}
      </div>

      <ReadOut
        label="P(Normal | message)"
        value={post.toFixed(4)}
        tone={dup === 1 ? TEAL : RED}
        note={
          dup === 1
            ? 'The honest answer, 140/157 — the same one part 13 gets.'
            : `Counting one word ${dup} times has pushed the answer to ${post.toFixed(4)} without adding a single new fact.`
        }
      />

      <Verdict ok={dup === 1}>
        {dup === 1
          ? 'One count per word. This is the number the training data supports.'
          : 'Overconfident. Two features that say the same thing get multiplied in twice, and the classifier treats the repetition as independent confirmation.'}
      </Verdict>

      <LabNote>
        This is why Naive Bayes is famous for ranking well and calibrating badly: correlated features push the winning
        score towards 1 and the losers towards 0, so the <em>order</em> survives and the <em>number</em> does not. If
        you only need the argmax, that costs nothing. If you are going to threshold on the probability, it matters.
      </LabNote>

      <div className="flex flex-wrap gap-2">
        {ISSUES.map((it) => (
          <Chip key={it.id} on={open === it.id} label={it.label} onClick={() => setOpen(it.id)} />
        ))}
      </div>
      <PanelNote>{ISSUES.find((i) => i.id === open)?.body}</PanelNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* 20 · The practice problems                                                 */
/* ========================================================================== */

interface Slice {
  name: string
  prior: number
  lik: number
}
interface Practice {
  id: string
  title: string
  question: string
  slides: string
  /** Named cases, for the problems that ask about two different pieces of evidence. */
  cases: Array<{ label: string; evidence: string; slices: Slice[] }>
  /** What the deck prints, so the lab can be checked against it. */
  deck: string
  ask: string
}

const PRACTICE: Practice[] = [
  {
    id: 'p1',
    title: 'Practice 1 — the board of directors',
    slides: 'Slides 58–59',
    question:
      'Two sets of candidates compete for places on a company board. The first wins with probability 0.6, the second with 0.4. If the first set wins, a new product is introduced with probability 0.8; if the second wins, 0.3. What is the probability that the product is introduced?',
    cases: [
      {
        label: 'the product is introduced',
        evidence: 'E',
        slices: [
          { name: 'E₁ — first set wins', prior: 0.6, lik: 0.8 },
          { name: 'E₂ — second set wins', prior: 0.4, lik: 0.3 },
        ],
      },
    ],
    deck: 'P(E) = 0.6 × 0.8 + 0.4 × 0.3 = 0.48 + 0.12 = 0.6.',
    ask: 'This one only asks for the denominator — the rule of total probability on its own, with no reversal.',
  },
  {
    id: 'p2',
    title: 'Practice 2 — the bolt factory',
    slides: 'Slides 60–62',
    question:
      'Machines A, B and C make 25%, 35% and 40% of the bolts. Of their output, 5%, 4% and 2% are defective. A bolt drawn at random is defective. What is the probability it came from (i) machine A, (ii) machine B or C?',
    cases: [
      {
        label: 'the bolt is defective',
        evidence: 'E',
        slices: [
          { name: 'E₁ — machine A', prior: 0.25, lik: 0.05 },
          { name: 'E₂ — machine B', prior: 0.35, lik: 0.04 },
          { name: 'E₃ — machine C', prior: 0.4, lik: 0.02 },
        ],
      },
    ],
    deck: 'P(E) = 0.0345; P(E₁ | E) = 0.36, P(E₂ | E) = 0.41, P(E₃ | E) = 0.23, so B or C = 0.64.',
    ask: 'Machine C makes the most bolts and is still the least likely culprit: its defect rate is low enough to outweigh its size.',
  },
  {
    id: 'p3',
    title: 'Practice 3 — the skyscraper fire',
    slides: 'Slides 63–64',
    question:
      'An expert puts the probability of a short circuit at 0.8 and of an LPG cylinder explosion at 0.2. A fire follows a short circuit 30% of the time and an LPG explosion 95% of the time. There was a fire. Which cause is more probable?',
    cases: [
      {
        label: 'there was a fire',
        evidence: 'E',
        slices: [
          { name: 'E₁ — short circuit', prior: 0.8, lik: 0.3 },
          { name: 'E₂ — LPG explosion', prior: 0.2, lik: 0.95 },
        ],
      },
    ],
    deck: 'P(E₁ | E) = 24/43 ≈ 0.558 and P(E₂ | E) = 19/43 ≈ 0.442, so the short circuit is the more probable cause.',
    ask: 'The LPG explosion is far more likely to start a fire, and still loses — because it was four times less likely to happen at all.',
  },
  {
    id: 'p4',
    title: 'Practice 4 — the Vice Chancellor',
    slides: 'Slides 65–66',
    question:
      'An academic, a businessman and a politician become Vice Chancellor with probabilities 0.5, 0.3 and 0.2. Each promotes research with probability 0.8, 0.6 and 0.4. Research has been promoted. What is the chance the VC is the academic?',
    cases: [
      {
        label: 'research was promoted',
        evidence: 'X',
        slices: [
          { name: 'academic', prior: 0.5, lik: 0.8 },
          { name: 'businessman', prior: 0.3, lik: 0.6 },
          { name: 'politician', prior: 0.2, lik: 0.4 },
        ],
      },
    ],
    deck: 'P(X) = 0.66 and P(academic | X) = 0.4 / 0.66 = 0.6061.',
    ask: 'Both the prior and the likelihood favour the academic, so the posterior 0.61 is higher than the prior 0.5.',
  },
  {
    id: 'p5',
    title: 'Practice 5 — the four technicians',
    slides: 'Slides 67–68',
    question:
      'Janet services 20% of breakdowns and repairs incompletely 1 time in 20; Tom 60% and 1 in 10; Georgia 15% and 1 in 10; Peter 5% and 1 in 20. A problem is traced to an incomplete initial repair. What is the probability it was Janet’s?',
    cases: [
      {
        label: 'the repair was incomplete',
        evidence: 'A',
        slices: [
          { name: 'B₁ — Janet', prior: 0.2, lik: 0.05 },
          { name: 'B₂ — Tom', prior: 0.6, lik: 0.1 },
          { name: 'B₃ — Georgia', prior: 0.15, lik: 0.1 },
          { name: 'B₄ — Peter', prior: 0.05, lik: 0.05 },
        ],
      },
    ],
    deck: 'P(B₁ | A) = 0.114 — and the deck’s own comment: Janet botches only 1 job in 20, yet more than 11% of the incomplete repairs are hers.',
    ask: 'That comment is the whole point of the problem. A low failure rate on a large share of the work still produces a lot of failures.',
  },
  {
    id: 'p6',
    title: 'Practice 6 — the missing aircraft',
    slides: 'Slides 69–70',
    question:
      'Seventy percent of light aircraft that disappear are later discovered. Of those discovered, 60% have an emergency locator; of those not discovered, 90% do not. An aircraft has disappeared. (a) If it has a locator, what is the probability it will not be discovered? (b) If it has no locator, what is the probability it will be discovered?',
    cases: [
      {
        label: '(a) it has a locator',
        evidence: 'L',
        slices: [
          { name: 'discovered', prior: 0.7, lik: 0.6 },
          { name: 'not discovered', prior: 0.3, lik: 0.1 },
        ],
      },
      {
        label: '(b) it has no locator',
        evidence: 'Lᶜ',
        slices: [
          { name: 'discovered', prior: 0.7, lik: 0.4 },
          { name: 'not discovered', prior: 0.3, lik: 0.9 },
        ],
      },
    ],
    deck: 'The deck stops after one line: P(discovered and has a locator) = (0.7)(0.6) = 0.42. Neither (a) nor (b) is answered on the slide.',
    ask: 'The two conditionals it does not give come from the complement rule: 40% of discovered aircraft have no locator, and 10% of undiscovered ones do.',
  },
]

export function PracticeLab() {
  const [at, setAt] = useState('p1')
  const [caseAt, setCaseAt] = useState(0)
  const [seven, setSeven] = useState(9) // P(W bids), in twelfths

  const p = PRACTICE.find((x) => x.id === at)
  const cs = p?.cases[Math.min(caseAt, (p?.cases.length ?? 1) - 1)]
  const joint = cs?.slices.map((s) => s.prior * s.lik) ?? []
  const tot = joint.reduce((a, v) => a + v, 0)
  const post = joint.map((j) => (tot > 0 ? j / tot : 0))

  // Practice 7. The question says W bids with probability 3/4; the printed
  // solution computes with 1/3. Both are shown as the reader moves the slider,
  // and no answer is asserted, because the two cannot both be what was meant.
  const pw = seven / 12
  const pv = (1 / 3) * pw + (3 / 4) * (1 - pw)
  const matchesSolution = seven === 4
  const matchesQuestion = seven === 9

  return (
    <LabBox>
      <Presets
        items={[
          ...PRACTICE.map((x) => ({ id: x.id, label: x.title.split(' — ')[0] })),
          { id: 'p7', label: 'Practice 7' },
        ]}
        at={at}
        onPick={(id) => {
          setAt(id)
          setCaseAt(0)
        }}
      />

      {at === 'p7' ? (
        <>
          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3.5 text-[13px]/[1.7] text-zinc-800">
            <strong className="mr-1.5">Practice 7 — two firms bidding.</strong> Firms V and W consider bidding for a
            road-building job. V submits a bid and gets the job with probability 3/4 provided W does not bid. The
            probability that W bids is 3/4, and if it does, V gets the job with probability only 1/3. (a) What is the
            probability V gets the job? (b) If V gets the job, what is the probability that W did not bid?{' '}
            <span className="mt-1.5 block text-[11.5px] text-zinc-500">Slides 71–72</span>
          </div>

          <Slider
            label="P(W bids) — the one number the deck contradicts itself on"
            value={seven}
            display={`${seven}/12`}
            min={0}
            max={12}
            step={1}
            hint="The question says 3/4, which is 9/12. The printed solution computes with 1/3, which is 4/12."
            onChange={setSeven}
          />

          <div className="font-mono text-[12px]/[1.9] whitespace-pre text-zinc-800">
            {`P(W)  = ${pw.toFixed(4)}      P(W′) = ${(1 - pw).toFixed(4)}
P(V|W)  = 1/3        P(V|W′) = 3/4

P(V) = P(V|W)P(W) + P(V|W′)P(W′) = ${pv.toFixed(4)}`}
          </div>

          <ReadOut
            label="P(V), at the setting you have chosen"
            value={pv.toFixed(4)}
            tone={matchesSolution || matchesQuestion ? 'var(--acc)' : '#a1a1aa'}
            note={
              matchesSolution
                ? 'This is 11/18 — the number the printed solution reaches, using P(W) = 1/3.'
                : matchesQuestion
                  ? 'This is 7/16 — what the question’s own 3/4 gives.'
                  : 'Neither of the deck’s two readings.'
            }
          />

          <div className="rounded-lg border border-red-500/30 bg-red-50/60 p-3.5 text-[13px]/[1.7] text-zinc-800">
            <span className="mr-1.5 text-[11px] font-semibold tracking-[0.06em] text-red-700 uppercase">
              No answer printed
            </span>{' '}
            The question states that W bids with probability 3/4. The printed solution lists P(W) = 1/3 and P(W′) = 2/3
            and reaches 11/18 and 9/11. Those two readings cannot both be right, and nothing in the deck says which was
            intended — so this page prints no answer for either part. Slide the value above to see exactly where the
            deck’s 11/18 comes from, and what its own question would have given instead.
          </div>
        </>
      ) : (
        p &&
        cs && (
          <>
            <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3.5 text-[13px]/[1.7] text-zinc-800">
              <strong className="mr-1.5">{p.title.split(' — ')[1]}.</strong>
              {p.question}
              <span className="mt-1.5 block text-[11.5px] text-zinc-500">{p.slides}</span>
            </div>

            {p.cases.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {p.cases.map((c, i) => (
                  <Chip key={c.label} on={caseAt === i} label={c.label} onClick={() => setCaseAt(i)} />
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-zinc-950/10 px-2.5 py-2 text-left font-semibold text-zinc-500">
                      Slice
                    </th>
                    <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                      prior
                    </th>
                    <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                      P({cs.evidence} | slice)
                    </th>
                    <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                      product
                    </th>
                    <th className="border-b border-zinc-950/10 px-2.5 py-2 text-right font-semibold text-zinc-500">
                      posterior
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cs.slices.map((s, i) => (
                    <tr key={s.name}>
                      <td className="border-b border-zinc-950/5 px-2.5 py-2 font-semibold">{s.name}</td>
                      <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                        {s.prior.toFixed(2)}
                      </td>
                      <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                        {s.lik.toFixed(2)}
                      </td>
                      <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono">
                        {joint[i].toFixed(4)}
                      </td>
                      <td className="border-b border-zinc-950/5 px-2.5 py-2 text-right font-mono font-semibold">
                        {post[i].toFixed(4)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-2.5 py-2 font-semibold text-zinc-500">P({cs.evidence})</td>
                    <td className="px-2.5 py-2" />
                    <td className="px-2.5 py-2" />
                    <td className="px-2.5 py-2 text-right font-mono font-semibold" style={{ color: TEAL }}>
                      {tot.toFixed(4)}
                    </td>
                    <td className="px-2.5 py-2 text-right font-mono text-zinc-500">1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <LabNote>
              <strong>What the deck prints:</strong> {p.deck}
            </LabNote>
            <PanelNote>{p.ask}</PanelNote>

            {p.id === 'p6' && (
              <Verdict ok>
                No answer is printed on the slide for either part, so these were worked out here and checked: the four
                joint probabilities are 0.42, 0.28, 0.03 and 0.27, which add to exactly 1. (a) P(not discovered |
                locator) = 0.03 / 0.45 = 1/15 ≈ 0.0667. (b) P(discovered | no locator) = 0.28 / 0.55 = 28/55 ≈ 0.5091.
              </Verdict>
            )}
          </>
        )
      )}
    </LabBox>
  )
}
