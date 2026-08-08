'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/* ========================================================================== */
/* Part 1 — the course itself                                                 */
/* ========================================================================== */

const MODULES = [
  {
    id: 'M1',
    name: 'Introduction',
    note: 'This session. What ML is, when to use it, and the kinds of it.',
    kind: 'framing',
  },
  {
    id: 'M2',
    name: 'Machine learning workflow',
    note: 'The eight steps from a question to a model on a test set. Part 20 of this chapter.',
    kind: 'framing',
  },
  {
    id: 'M3',
    name: 'Linear models for regression',
    note: 'Predicting a number. Lab 2 of the course pairs this with gradient descent.',
    kind: 'supervised',
  },
  {
    id: 'M4',
    name: 'Linear models for classification',
    note: 'Predicting a label. Logistic regression is lab 3.',
    kind: 'supervised',
  },
  { id: 'M5', name: 'Decision tree', note: 'A series of yes/no questions. Lab 4.', kind: 'supervised' },
  {
    id: 'M6',
    name: 'Instance based learning',
    note: 'Keep the examples and compare against them. Part 17 of this chapter previews it.',
    kind: 'supervised',
  },
  {
    id: 'M7',
    name: 'Support vector machine',
    note: 'The boundary that leaves the widest gap. Reference book R3 is devoted to it.',
    kind: 'supervised',
  },
  {
    id: 'M8',
    name: 'Bayesian learning',
    note: 'Probability applied to learning. Naïve Bayes is lab 5.',
    kind: 'supervised',
  },
  { id: 'M9', name: 'Ensemble learning', note: 'Many weak models voting. Random forest is lab 6.', kind: 'supervised' },
  {
    id: 'M10',
    name: 'Unsupervised learning',
    note: 'No labels at all. Part 13 of this chapter introduces it.',
    kind: 'unsupervised',
  },
  {
    id: 'M11',
    name: 'Model evaluation / comparison',
    note: 'How you know a model is any good, and which of two is better.',
    kind: 'framing',
  },
] as const

const MARKS = [
  { id: 'quiz', label: 'Quizzes', pct: 10, note: 'Two of them, 10% together.' },
  {
    id: 'assign',
    label: 'Assignment',
    pct: 20,
    note: 'Progressive — it builds across the semester rather than landing all at once.',
  },
  { id: 'mid', label: 'Mid-semester exam', pct: 30, note: 'Covers the first half of the module list.' },
  { id: 'comp', label: 'Comprehensive exam', pct: 40, note: 'The whole course. The single biggest piece.' },
] as const

export function CourseMapLab() {
  const [pick, setPick] = useState<string>('M1')
  const m = MODULES.find((x) => x.id === pick)!
  const total = MARKS.reduce((s, x) => s + x.pct, 0)

  return (
    <LabBox>
      <Presets items={MODULES.map((x) => ({ id: x.id, label: `${x.id} ${x.name}` }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            {m.id} ·{' '}
            {m.kind === 'supervised' ? 'supervised methods' : m.kind === 'unsupervised' ? 'unsupervised' : 'framing'}
          </div>
          <div className="mb-2 text-[17px] font-semibold text-zinc-950">{m.name}</div>
          <p className="crux-prose text-[13.5px]/[1.7] text-zinc-700">{m.note}</p>

          <div className="mt-5 mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Where the marks come from
          </div>
          <div className="flex flex-col gap-2">
            {MARKS.map((x) => (
              <div key={x.id} className="flex items-center gap-3">
                <span className="w-[150px] shrink-0 text-[13px] font-semibold text-zinc-800">{x.label}</span>
                <span className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-950/[0.07]">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${(x.pct / 40) * 100}%`, background: '#4f46e5', backgroundColor: 'var(--acc)' }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right font-mono text-[13px] font-semibold text-zinc-900">
                  {x.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'modules', value: String(MODULES.length) },
              { label: 'labs', value: '6' },
              { label: 'exam weight', value: '70%' },
              { label: 'total', value: `${total}%` },
            ]}
          />
          <PanelNote>
            Seventy per cent of the mark is the two exams, so understanding beats memorising a library API. That is why
            the deck lists the mathematical prerequisites on slide 8.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        The course says plainly what it is <strong>not</strong> about: unstructured data and time-series or sequence
        data. It assumes the data is structured and IID — independent and identically distributed, meaning each row is
        drawn separately from the same underlying process and none of them influence each other.
      </LabNote>
      <LabNote>
        The prerequisites on slide 8 map onto the other course in this semester: vector and matrix manipulation, partial
        derivatives, common distributions and Bayes’ rule, and mean/median/mode with maximum likelihood.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — data science, AI, ML                                              */
/* ========================================================================== */

const FIELDS = [
  {
    id: 'ds',
    label: 'Data science',
    r: 1,
    body: 'Collection, preparation and analysis of data. Leverages AI and ML, plus research, industry expertise and statistics, to make business decisions. The outer circle: it is a way of working, not one technique.',
  },
  {
    id: 'ai',
    label: 'Artificial intelligence',
    r: 0.72,
    body: 'Technology for machines to understand and interpret, to learn, and to make “intelligent” decisions. It includes machine learning among many other fields — search, planning and logic are AI without being ML.',
  },
  {
    id: 'ml',
    label: 'Machine learning',
    r: 0.3,
    body: 'Algorithms that help machines improve through supervised, unsupervised and reinforcement learning. A subset of AI, and one of the tools data science uses. This course sits here.',
  },
] as const

export function NestedFieldsLab() {
  const [pick, setPick] = useState<string>('ml')
  const f = FIELDS.find((x) => x.id === pick)!

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(W, H) / 2 - 20
    const acc = accentColour()
    for (const x of FIELDS) {
      const on = x.id === pick
      g.beginPath()
      // nested circles, all touching the bottom so the containment reads clearly
      const r = R * x.r
      g.arc(cx, cy + R - r, r, 0, Math.PI * 2)
      g.fillStyle = on ? 'rgba(79,70,229,0.22)' : 'rgba(9,9,11,0.05)'
      g.fill()
      g.strokeStyle = on ? acc : 'rgba(9,9,11,0.28)'
      g.lineWidth = on ? 2.5 : 1.2
      g.stroke()
      g.fillStyle = on ? '#312e81' : '#52525b'
      g.font = `${on ? '600' : '400'} 13px ui-sans-serif, system-ui`
      g.textAlign = 'center'
      g.fillText(x.label, cx, cy + R - 2 * r + 20)
    }
    g.textAlign = 'left'
    return {
      L: 0,
      R: W,
      T: 0,
      B: H,
      px: (v) => v,
      py: (v) => v,
      ux: (p) => p,
      uy: (p) => p,
    }
  }

  return (
    <LabBox>
      <Presets items={FIELDS.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          caption="Slide 11. Each circle sits inside the one before it — machine learning is part of AI, and AI is one of the things data science draws on."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 text-[13px] font-semibold text-zinc-950">{f.label}</div>
            <p className="crux-prose text-[13px]/[1.65] text-zinc-700">{f.body}</p>
          </div>
          <PanelNote>
            The nesting is the point. Every ML method is an AI method, but plenty of AI is not ML — a chess engine that
            searches ahead without learning anything is AI and not machine learning.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        The deck opens with where ML already touches you: fraud detection and email filtering, Siri and Alexa and the
        chatbots behind customer support, and the recommendation engines on Amazon, Netflix, IMDb, Zomato and
        Booking.com. None of these were written as a list of rules by hand.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — traditional programming vs machine learning                       */
/* ========================================================================== */

/** One labelled box in the two flow diagrams. Declared out here so React does
 *  not treat it as a brand-new component on every render. */
function FlowBox({ children, tone }: { children: React.ReactNode; tone?: 'in' | 'out' }) {
  return (
    <span
      className="grid min-w-[92px] place-items-center rounded-lg border px-3 py-2.5 text-[13px] font-semibold"
      style={
        tone === 'out'
          ? { borderColor: TEAL, background: 'rgba(13,148,136,0.10)', color: '#115e59' }
          : { borderColor: 'rgba(9,9,11,0.15)', background: '#fff', color: '#18181b' }
      }
    >
      {children}
    </span>
  )
}

function FlowArrow() {
  return <span className="text-[18px] text-zinc-400">→</span>
}

export function TraditionalVsMlLab() {
  const [ml, setMl] = useState(false)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!ml} label="Traditional programming" onClick={() => setMl(false)} />
        <Chip on={ml} label="Machine learning" onClick={() => setMl(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-6">
          <div className="flex flex-wrap items-center gap-3">
            {ml ? (
              <>
                <FlowBox>Data</FlowBox>
                <FlowBox>Output</FlowBox>
                <FlowArrow />
                <FlowBox>Computer</FlowBox>
                <FlowArrow />
                <FlowBox tone="out">Program</FlowBox>
              </>
            ) : (
              <>
                <FlowBox>Data</FlowBox>
                <FlowBox>Program</FlowBox>
                <FlowArrow />
                <FlowBox>Computer</FlowBox>
                <FlowArrow />
                <FlowBox tone="out">Output</FlowBox>
              </>
            )}
          </div>
          <p className="crux-prose mt-5 text-[13.5px]/[1.7] text-zinc-700">
            {ml ? (
              <>
                You supply the <strong>data</strong> and the <strong>answers you wanted</strong>, and the computer works
                out the program. That program is what everyone calls a “model”.
              </>
            ) : (
              <>
                You supply the <strong>data</strong> and the <strong>program</strong>, and the computer produces the
                output. Somebody had to know the rule in advance and write it down.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'you provide', value: ml ? 'data + output' : 'data + program' },
              { label: 'computer gives', value: ml ? 'program' : 'output' },
              { label: 'who knows the rule', value: ml ? 'nobody, yet' : 'the programmer' },
              { label: 'called', value: ml ? 'training' : 'running' },
            ]}
          />
          <PanelNote>
            Two boxes swap places, and that is the whole idea on slide 16. Machine learning is programming by example
            rather than by instruction.
          </PanelNote>
        </div>
      </div>

      <LabNote>
        The deck gives three definitions and they get progressively sharper. Arthur Samuel’s: the field of study that
        gives computers the ability to learn <em>without being explicitly programmed</em>. A working one: the science
        and art of programming computers so they can learn from data. And Tom Mitchell’s engineering version, which the
        next part takes apart: algorithms that improve their performance P at some task T with experience E.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — the ⟨T, P, E⟩ definition                                          */
/* ========================================================================== */

const TPE = [
  {
    id: 'hand',
    label: 'Handwriting',
    T: 'Recognising hand-written words',
    P: 'Percentage of words correctly classified',
    E: 'Database of human-laboured images of handwritten words',
    badP: 'Number of words looked at',
    why: 'Counting how many words it looked at rewards being fast, not being right. A model that guesses instantly would score perfectly.',
  },
  {
    id: 'spam',
    label: 'Spam',
    T: 'Categorising email messages as spam or legitimate',
    P: 'Percentage of email messages correctly classified',
    E: 'Database of emails, some with human-given labels',
    badP: 'Number of emails marked as spam',
    why: 'Maximising the count of spam marks is trivially won by marking everything as spam — including every message you wanted.',
  },
  {
    id: 'checkers',
    label: 'Checkers',
    T: 'Playing checkers',
    P: 'Percentage of games won against opponents',
    E: 'Games played against itself',
    badP: 'Number of pieces captured',
    why: 'Capturing pieces is not winning. A player can take plenty of pieces and still lose the game.',
  },
  {
    id: 'drive',
    label: 'Driving',
    T: 'Driving on public four-lane highways using vision sensors',
    P: 'Average distance travelled before an error, as judged by a human',
    E: 'A sequence of images and steering commands recorded while observing a human driver',
    badP: 'Distance travelled',
    why: 'Distance alone, with no mention of errors, is maximised by driving fast and badly. The phrase "before an error" is doing all the work.',
  },
] as const

/** One revealable line of the ⟨T, P, E⟩ card. Hoisted out of TpeLab so React
 *  keeps the same component identity between renders. */
function TpeRow({
  letter,
  name,
  value,
  shown,
  onToggle,
}: {
  letter: string
  name: string
  value: string
  shown: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-zinc-950/10 bg-white p-3 text-left hover:border-zinc-950/25"
    >
      <span
        className="grid size-7 shrink-0 place-items-center rounded-md font-mono text-[13px] font-semibold"
        style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
      >
        {letter}
      </span>
      <span>
        <span className="block text-[11px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">{name}</span>
        <span className="block text-[13.5px]/[1.6] text-zinc-800">{shown ? value : 'press to reveal'}</span>
      </span>
    </button>
  )
}

export function TpeLab() {
  const [pick, setPick] = useState<string>('hand')
  const [usebad, setUseBad] = useState(false)
  const [reveal, setReveal] = useState<Record<string, boolean>>({})
  const ex = TPE.find((x) => x.id === pick)!
  const key = (s: string) => `${pick}:${s}`

  return (
    <LabBox>
      <Presets items={TPE.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-2.5">
          <TpeRow
            letter="T"
            name="Task — what it has to do"
            value={ex.T}
            shown={!!reveal[key('T')]}
            onToggle={() => setReveal((r) => ({ ...r, [key('T')]: !r[key('T')] }))}
          />
          <TpeRow
            letter="P"
            name="Performance — how you score it"
            value={usebad ? ex.badP : ex.P}
            shown={!!reveal[key('P')]}
            onToggle={() => setReveal((r) => ({ ...r, [key('P')]: !r[key('P')] }))}
          />
          <TpeRow
            letter="E"
            name="Experience — what it learns from"
            value={ex.E}
            shown={!!reveal[key('E')]}
            onToggle={() => setReveal((r) => ({ ...r, [key('E')]: !r[key('E')] }))}
          />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div className="flex flex-wrap gap-2">
            <Chip on={!usebad} label="the deck’s P" onClick={() => setUseBad(false)} />
            <Chip on={usebad} label="a tempting but bad P" onClick={() => setUseBad(true)} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'example', value: ex.label },
              { label: 'P is', value: usebad ? 'broken' : 'sound' },
            ]}
          />
          <PanelNote>
            Press T, P and E to reveal them one at a time — worth doing from memory before you look, since this is
            standard exam material.
          </PanelNote>
          <Btn onClick={() => setReveal({})}>Hide them all again</Btn>
        </div>
      </div>

      <Verdict ok={!usebad}>
        {usebad ? (
          <>
            <strong>This P can be gamed.</strong> {ex.why}
          </>
        ) : (
          <>
            A well-defined learning task is given by <strong>⟨T, P, E⟩</strong>. All three are needed: without T there
            is nothing to do, without E there is nothing to learn from, and without a sound P you cannot tell whether
            learning happened at all.
          </>
        )}
      </Verdict>

      <LabNote>
        Mitchell’s wording is worth memorising exactly: a program is said to learn from experience E with respect to
        some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P,{' '}
        <strong>improves with experience E</strong>. The improvement is the part that makes it learning rather than just
        running.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — spam, both ways                                                   */
/* ========================================================================== */

const TRICKS = [
  { id: 't1', label: '“4U” becomes “4 U”', beats: 1 },
  { id: 't2', label: '“free” becomes “fr33”', beats: 1 },
  { id: 't3', label: '“credit card” becomes “cr€dit card”', beats: 1 },
  { id: 't4', label: 'the whole message is an image', beats: 2 },
] as const

export function SpamLab() {
  const [on, setOn] = useState<string[]>([])
  const [ml, setMl] = useState(false)

  const toggle = (id: string) => setOn((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  const broken = on.reduce((s, id) => s + (TRICKS.find((t) => t.id === id)?.beats ?? 0), 0)

  // Hand-written rules: each trick defeats rules and forces new ones to be written.
  const handRules = 4 + on.length * 3
  const handCaught = Math.max(0, 4 - broken)
  const handPct = Math.round((handCaught / 4) * 100)
  // A learned filter re-trains on the new mail, so it recovers — but not for free.
  const mlPct = on.length === 0 ? 95 : Math.max(70, 95 - on.length * 4)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={!ml} label="Rules written by hand" onClick={() => setMl(false)} />
        <Chip on={ml} label="A filter that learns" onClick={() => setMl(true)} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Tricks the spammers start using
          </div>
          <div className="flex flex-col gap-2">
            {TRICKS.map((t) => (
              <label key={t.id} className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-zinc-800">
                <input
                  type="checkbox"
                  checked={on.includes(t.id)}
                  onChange={() => toggle(t.id)}
                  className="cursor-pointer"
                />
                {t.label}
              </label>
            ))}
          </div>
          <pre className="mt-4 overflow-x-auto font-mono text-[12.5px]/[1.9] text-zinc-800">
            {ml
              ? `THE LEARNING FILTER

it is not given any words to look for.
it counts which patterns turn up unusually often
in spam compared with "ham" (real mail),
and works the list out for itself.

when the spammers change tactics:
    the new mail is simply more training data
    the filter re-learns the new patterns
    NOBODY EDITS ANY RULES

caught right now:  ${mlPct}%
rules a human maintains:  0`
              : `THE HAND-WRITTEN FILTER

rule 1   contains "4U"          → spam
rule 2   contains "credit card" → spam
rule 3   contains "free"        → spam
rule 4   contains "amazing"     → spam
${on.length ? `\n...and ${on.length * 3} more rules bolted on to cover the\ntricks you ticked, each of which someone had\nto notice, write, test and keep working.` : ''}

caught right now:  ${handPct}%
rules a human maintains:  ${handRules}`}
          </pre>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'tricks in use', value: String(on.length) },
              { label: 'hand-written catches', value: `${handPct}%` },
              { label: 'learned filter catches', value: `${mlPct}%` },
              { label: 'rules to maintain', value: ml ? '0' : String(handRules) },
            ]}
          />
          <PanelNote>
            Tick a trick and watch the hand-written filter fall over while its rule list grows. Then switch to the
            learning filter and see the same tricks handled by retraining.
          </PanelNote>
          <Btn onClick={() => setOn([])}>Clear the tricks</Btn>
        </div>
      </div>

      <LabNote>
        The deck’s wording for the traditional approach is worth keeping: write a detection algorithm for frequently
        appearing patterns, then <em>test and update the rules until it is good enough</em>. The challenge it names is
        not that the rules fail — it is that they become “a long list of complex rules, hard to maintain”.
      </LabNote>
      <LabNote>
        The learned filter is described as <strong>shorter, easier to maintain and most likely more accurate</strong>.
        Note the hedge in “most likely”. Learning is not guaranteed to win; it wins when the pattern is real but too
        fiddly to write down.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 6 — when to use ML                                                    */
/* ========================================================================== */

const PROBLEMS = [
  {
    id: 'p1',
    text: 'Working out this month’s payroll from hours and rates',
    ml: false,
    why: 'The rule is known exactly and written in a contract. There is nothing to learn — the deck names this one directly.',
  },
  {
    id: 'p2',
    text: 'Navigating a rover on Mars',
    ml: true,
    why: 'Human expertise does not exist. Nobody has driven there to be copied.',
  },
  {
    id: 'p3',
    text: 'Recognising a face from a photograph',
    ml: true,
    why: 'Humans do it perfectly and cannot explain how. The deck files biometrics under "humans can’t explain their expertise".',
  },
  {
    id: 'p4',
    text: 'Converting a temperature from Celsius to Fahrenheit',
    ml: false,
    why: 'A formula exists and is exact. Learning it from examples would only add error.',
  },
  {
    id: 'p5',
    text: 'Suggesting a treatment tuned to one patient’s history',
    ml: true,
    why: 'Models must be customised. Personalised medicine is the deck’s example.',
  },
  {
    id: 'p6',
    text: 'Sorting a list of names alphabetically',
    ml: false,
    why: 'Solved analytically, and provably. The workflow question "can I solve it analytically?" stops here.',
  },
  {
    id: 'p7',
    text: 'Reading a handwritten digit',
    ml: true,
    why: 'The task can only be defined by examples. Slide 26 asks what distinguishes a 2 from a 7 — and nobody can say.',
  },
  {
    id: 'p8',
    text: 'Spotting which of a million transactions are fraudulent',
    ml: true,
    why: 'Hidden relationships in data too large for a human to encode explicitly.',
  },
] as const

export function WhenMlLab() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const done = Object.keys(answers).length
  const right = PROBLEMS.filter((p) => answers[p.id] !== undefined && answers[p.id] === p.ml).length

  return (
    <LabBox>
      <div className="flex flex-col gap-2.5">
        {PROBLEMS.map((p) => {
          const given = answers[p.id]
          const answered = given !== undefined
          const ok = answered && given === p.ml
          return (
            <div
              key={p.id}
              className="rounded-lg border p-3"
              style={{
                borderColor: answered ? (ok ? 'rgba(13,148,136,0.45)' : 'rgba(220,38,38,0.4)') : 'rgba(9,9,11,0.10)',
                background: answered ? (ok ? 'rgba(13,148,136,0.06)' : 'rgba(220,38,38,0.05)') : '#fff',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13.5px] text-zinc-800">{p.text}</span>
                <span className="flex gap-2">
                  <Btn primary={given === true} onClick={() => setAnswers((a) => ({ ...a, [p.id]: true }))}>
                    learn it
                  </Btn>
                  <Btn primary={given === false} onClick={() => setAnswers((a) => ({ ...a, [p.id]: false }))}>
                    just program it
                  </Btn>
                </span>
              </div>
              {answered && (
                <p className="crux-prose mt-2 text-[12.5px]/[1.6] text-zinc-700">
                  <strong style={{ color: ok ? '#115e59' : '#991b1b' }}>{ok ? '✓ ' : '✗ '}</strong>
                  {p.why}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Btn onClick={() => setAnswers({})}>Start again</Btn>
        <span className="font-mono text-[13px] text-zinc-600">
          {right} right out of {done} answered
        </span>
      </div>

      <LabNote>
        Slide 25 gives three reasons to reach for learning: human expertise <strong>does not exist</strong>, humans{' '}
        <strong>cannot explain</strong> the expertise they have, or the model <strong>must be customised</strong> to
        each case. And it gives the counter-example in one line — there is no need to “learn” to calculate payroll.
      </LabNote>
      <LabNote>
        Slide 26 adds two more: relationships hidden in data too large for a person to encode by hand, and knowledge
        that keeps arriving, so any fixed rule set goes stale.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — what makes a 2                                                    */
/* ========================================================================== */

const RULES = [
  {
    id: 'r1',
    label: 'has a closed loop',
    catches2: false,
    catches7: false,
    note: 'Some 2s have a little loop at the bottom left and most do not. A 7 has none either, so this separates nothing.',
  },
  {
    id: 'r2',
    label: 'has a horizontal stroke at the bottom',
    catches2: true,
    catches7: false,
    note: 'Good for tidy 2s. But plenty of hurried 2s end in a curve with no flat base at all.',
  },
  {
    id: 'r3',
    label: 'has a horizontal stroke at the top',
    catches2: true,
    catches7: true,
    note: 'Catches 2s — and catches every 7 as well, which is exactly the confusion you were trying to avoid.',
  },
  {
    id: 'r4',
    label: 'is taller than it is wide',
    catches2: true,
    catches7: true,
    note: 'True of almost every digit. A rule that fires on everything tells you nothing.',
  },
  {
    id: 'r5',
    label: 'has a crossing bar in the middle',
    catches2: false,
    catches7: true,
    note: 'That is the continental 7. Adding it makes things worse, not better.',
  },
] as const

export function DigitRuleLab() {
  const [on, setOn] = useState<string[]>([])
  const toggle = (id: string) => setOn((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))

  const chosen = RULES.filter((r) => on.includes(r.id))
  // A 2 is accepted only if every chosen rule that identifies 2s fires.
  const twosCaught = chosen.length === 0 ? 0 : chosen.filter((r) => r.catches2).length
  const sevensCaught = chosen.filter((r) => r.catches7).length
  const clean = chosen.length > 0 && twosCaught > 0 && sevensCaught === 0
  const allTwos = chosen.length > 0 && chosen.every((r) => r.catches2)

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Try to write a rule that catches every 2 and no 7
          </div>
          <div className="flex flex-col gap-2">
            {RULES.map((r) => (
              <label key={r.id} className="flex cursor-pointer items-start gap-2.5 text-[13.5px] text-zinc-800">
                <input
                  type="checkbox"
                  checked={on.includes(r.id)}
                  onChange={() => toggle(r.id)}
                  className="mt-1 cursor-pointer"
                />
                <span>
                  {r.label}
                  {on.includes(r.id) && <span className="block text-[12px]/[1.6] text-zinc-500">{r.note}</span>}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'rules chosen', value: String(chosen.length) },
              { label: 'rules that catch 2s', value: String(twosCaught) },
              { label: 'rules that also catch 7s', value: String(sevensCaught) },
              { label: 'clean separation?', value: clean && allTwos ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            Every rule that reliably catches a 2 also catches a 7, or misses the untidy 2s. That is the point — there is
            no short description that works.
          </PanelNote>
          <Btn onClick={() => setOn([])}>Clear</Btn>
        </div>
      </div>

      <Verdict ok={false}>
        {chosen.length === 0 ? (
          <>Tick some rules and see how far you get.</>
        ) : sevensCaught > 0 ? (
          <>
            <strong>{sevensCaught} of your rules also fire on a 7.</strong> Whatever you add to catch more 2s tends to
            catch more 7s with it.
          </>
        ) : (
          <>
            <strong>No 7s caught — but you are missing 2s.</strong> The rules that are safe are the ones that only
            describe neat handwriting, and most handwriting is not neat.
          </>
        )}
      </Verdict>

      <LabNote>
        This is Geoffrey Hinton’s example, and slide 27 puts it in one line:{' '}
        <strong>it is very hard to say what makes a 2</strong>. Look at a page of handwritten digits and you can label
        every one instantly, while being unable to write down the rule you used.
      </LabNote>
      <LabNote>
        That gap — you can do it, you cannot explain it — is precisely the second of the three reasons on slide 25. It
        is why the task can only be defined by examples, and why learning from examples is the only approach left.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 8 — features and the target                                           */
/* ========================================================================== */

const TABLES = [
  {
    id: 'job',
    label: 'Employability prediction',
    cols: ['CGPA', 'Communication skills', 'Aptitude', 'Programming skills', 'Job offered?'],
    target: 4,
    rows: [
      ['9.1', 'Average', 'Good', 'Excellent', 'Yes'],
      ['8.4', 'Good', 'Good', 'Good', 'Yes'],
      ['8.3', 'Poor', 'Average', 'Average', 'No'],
      ['7.1', 'Average', 'Good', 'Average', 'No'],
      ['8.2', 'Good', 'Excellent', 'Excellent', 'No'],
    ],
    kind: 'classification — the target is Yes or No',
  },
  {
    id: 'car',
    label: 'Used car price',
    cols: ['Brand', 'Year (Mfg)', 'Engine capacity', 'Mileage', 'Distance travelled', 'Cab?', 'Price (Rs.)'],
    target: 6,
    rows: [['Honda City ZX', '2008', '1100', '10.5', '45000', 'N', '3,50,000']],
    kind: 'regression — the target is a number',
  },
  {
    id: 'market',
    label: 'Market segmentation',
    cols: ['Zip code', 'Family income', '# visits in a month', 'Average money spent in a month'],
    target: -1,
    rows: [['500078', '11,50,000', '4', '8,000']],
    kind: 'unsupervised — there is no target column at all',
  },
] as const

export function FeatureTableLab() {
  const [pick, setPick] = useState<string>('job')
  const [guess, setGuess] = useState<number | null>(null)
  const t = TABLES.find((x) => x.id === pick)!
  const correct = guess !== null && guess === t.target

  return (
    <LabBox>
      <Presets
        items={TABLES.map((x) => ({ id: x.id, label: x.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setGuess(null)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[12px] text-zinc-500">
            Press the column you think is the <strong>target</strong> — the thing being predicted. Everything else is a
            feature.
          </div>
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {t.cols.map((c, i) => (
                  <th key={c} className="p-0">
                    <button
                      type="button"
                      onClick={() => setGuess(i)}
                      className="w-full cursor-pointer rounded-md border px-2 py-1.5 text-left font-semibold"
                      style={
                        guess === i
                          ? i === t.target
                            ? { borderColor: TEAL, background: 'rgba(13,148,136,0.14)', color: '#115e59' }
                            : { borderColor: RED, background: 'rgba(220,38,38,0.10)', color: '#991b1b' }
                          : { borderColor: 'rgba(9,9,11,0.12)', background: '#fafafa', color: '#3f3f46' }
                      }
                    >
                      {c}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-zinc-700"
                      style={ci === t.target && guess !== null ? { background: 'rgba(13,148,136,0.07)' } : undefined}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'columns', value: String(t.cols.length) },
              { label: 'features', value: t.target === -1 ? String(t.cols.length) : String(t.cols.length - 1) },
              { label: 'target', value: t.target === -1 ? 'none' : (t.cols[t.target] ?? 'none') },
              { label: 'so this is', value: t.target === -1 ? 'unsupervised' : 'supervised' },
            ]}
          />
          <PanelNote>
            The deck calls the input columns <strong>features</strong>, <strong>attributes</strong> or{' '}
            <strong>predictors</strong> — three names for one thing. You will meet all three.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={t.target === -1 ? guess === null : correct}>
        {t.target === -1 ? (
          <>
            Careful — this table has <strong>no target column</strong>. Every column is a feature, and there is nothing
            to predict. That is what makes market segmentation an <strong>unsupervised</strong> problem: you are looking
            for groups, not for an answer somebody already wrote down.
          </>
        ) : correct ? (
          <>
            <strong>{t.cols[t.target]}</strong> is the target, so this is {t.kind}. The other {t.cols.length - 1}{' '}
            columns are the features.
          </>
        ) : guess === null ? (
          <>Press a column heading.</>
        ) : (
          <>
            <strong>{t.cols[guess]}</strong> is an input you already have before you predict anything, so it is a
            feature. The target is the column you would not know for a new case.
          </>
        )}
      </Verdict>

      <LabNote>
        A useful test for telling them apart: for a brand-new case, which column would you <em>not</em> know? For a
        graduate you have not hired, you know the CGPA and you do not know whether a job was offered. That unknown
        column is the target.
      </LabNote>
    </LabBox>
  )
}
