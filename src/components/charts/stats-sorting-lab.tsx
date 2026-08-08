'use client'

import { PanelButton, PanelButtons, PanelNote } from '@/components/sessions/session-parts'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/* ========================================================================== */
/* Sorting things into the right kind of data                                 */
/* ========================================================================== */

interface Item {
  q: string
  answer: string
  why: string
}

/**
 * Data types and measurement levels are lists to memorise until you have got a
 * few wrong. So both of these are games: pick an answer, find out at once, and
 * read why. The explanation is the real content — the buttons are just what
 * makes you read it.
 */
function Sorter({
  intro,
  options,
  items,
  note,
}: {
  intro: string
  options: Array<{ id: string; label: string; hint: string }>
  items: Item[]
  note: React.ReactNode
}) {
  const [at, setAt] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState({ right: 0, done: 0 })

  const item = items[at]
  const correct = picked === item.answer

  function choose(id: string) {
    if (picked) return
    setPicked(id)
    setScore((s) => ({ right: s.right + (id === item.answer ? 1 : 0), done: s.done + 1 }))
  }

  function next() {
    setPicked(null)
    setAt((a) => (a + 1) % items.length)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px]/[1.65] text-zinc-700">{intro}</p>
        <span className="text-[12px] text-zinc-500">
          {score.right} right out of {score.done}
        </span>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Question {at + 1} of {items.length}
        </div>
        <div className="text-[16px]/[1.5] font-semibold text-zinc-950">{item.q}</div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const isAnswer = o.id === item.answer
          const isPick = o.id === picked
          let style: React.CSSProperties | undefined
          if (picked) {
            if (isAnswer) style = { background: 'rgba(13,148,136,0.14)', borderColor: TEAL, color: TEAL }
            else if (isPick) style = { background: 'rgba(220,38,38,0.10)', borderColor: RED, color: RED }
          }
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              disabled={!!picked}
              className={clsx(
                'rounded-lg border border-zinc-950/10 bg-white px-3 py-2.5 text-left',
                !picked && 'cursor-pointer hover:border-zinc-950/30 hover:bg-zinc-950/[0.02]'
              )}
              style={style}
            >
              <div className="text-[13px] font-semibold">{o.label}</div>
              <div className="mt-0.5 text-[11.5px]/[1.5] text-zinc-500">{o.hint}</div>
            </button>
          )
        })}
      </div>

      {picked && (
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-1 text-[13px] font-semibold" style={{ color: correct ? TEAL : RED }}>
            {correct ? 'That is right.' : `Not quite — it is ${options.find((o) => o.id === item.answer)?.label}.`}
          </div>
          <p className="text-[13px]/[1.65] text-zinc-700">{item.why}</p>
        </div>
      )}

      <PanelButtons>
        <PanelButton primary onClick={next}>
          {picked ? 'Next one' : 'Skip this one'}
        </PanelButton>
        <PanelButton
          onClick={() => {
            setAt(0)
            setPicked(null)
            setScore({ right: 0, done: 0 })
          }}
        >
          Start again
        </PanelButton>
      </PanelButtons>

      <PanelNote>{note}</PanelNote>
    </div>
  )
}

export function DataTypeSorter() {
  return (
    <Sorter
      intro="Have a go at each one. You find out straight away, and the reason matters more than the score."
      options={[
        { id: 'cat', label: 'Categorical', hint: 'A label or a group, not a number you would do sums with.' },
        { id: 'disc', label: 'Numerical — discrete', hint: 'A count. You can list the possible values.' },
        {
          id: 'cont',
          label: 'Numerical — continuous',
          hint: 'A measurement. Between any two values there is another.',
        },
      ]}
      items={[
        {
          q: 'Eye colour',
          answer: 'cat',
          why: 'Brown, blue, green are names of groups. There is no sense in which brown plus blue equals anything.',
        },
        {
          q: 'Number of children in a family',
          answer: 'disc',
          why: 'You count them, and the answers are whole numbers. Nobody has 2.4 children, however often the average says so.',
        },
        {
          q: 'Your weight in kilograms',
          answer: 'cont',
          why: 'You measure it, and you could always measure more precisely. Between 70 and 71 kg there is 70.5, and between those there is 70.25.',
        },
        {
          q: 'Marital status',
          answer: 'cat',
          why: 'Single, married, divorced are groups. There is no order and no arithmetic.',
        },
        {
          q: 'Defects coming off a production line per hour',
          answer: 'disc',
          why: 'A count again. It is a number you can do sums with, but only whole ones.',
        },
        {
          q: 'Voltage across a component',
          answer: 'cont',
          why: 'Measured, not counted. A better instrument gives you more decimal places.',
        },
        {
          q: 'Which party someone voted for',
          answer: 'cat',
          why: 'Names of groups. Numbering the parties 1, 2, 3 for a spreadsheet does not make party 3 three times party 1.',
        },
        {
          q: 'How many magazines you subscribe to',
          answer: 'disc',
          why: 'Zero, one, two, three. Countable, with a finite list of likely answers.',
        },
      ]}
      note={
        <>
          The quick test: if you <strong>count</strong> it, it is discrete. If you <strong>measure</strong> it, it is
          continuous. If you can do neither and are just naming a group, it is categorical.
        </>
      }
    />
  )
}

export function MeasurementLevelLab() {
  return (
    <Sorter
      intro="Four levels, each one adding something the one before it did not have. Work down the three questions in the note below if you get stuck."
      options={[
        { id: 'nom', label: 'Nominal', hint: 'Just names. No order at all.' },
        { id: 'ord', label: 'Ordinal', hint: 'There is an order, but the gaps are not equal or measurable.' },
        { id: 'int', label: 'Interval', hint: 'Gaps are meaningful, but zero does not mean "none".' },
        { id: 'rat', label: 'Ratio', hint: 'Gaps are meaningful and zero really means none.' },
      ]}
      items={[
        {
          q: 'Gender',
          answer: 'nom',
          why: 'Only names of groups. Nothing comes before or after anything else.',
        },
        {
          q: 'Product satisfaction: unsatisfied, neutral, satisfied',
          answer: 'ord',
          why: 'There is a clear order. But the step from unsatisfied to neutral is not necessarily the same size as neutral to satisfied, so you cannot subtract them.',
        },
        {
          q: 'Temperature in degrees Celsius',
          answer: 'int',
          why: 'The gaps are real: 20° to 30° is the same jump as 30° to 40°. But 0°C does not mean "no temperature", so 40°C is not twice as hot as 20°C.',
        },
        {
          q: 'Weight in kilograms',
          answer: 'rat',
          why: 'Gaps are real and 0 kg genuinely means nothing there. So 40 kg really is twice 20 kg.',
        },
        {
          q: 'Student grades: A, B, C, D, F',
          answer: 'ord',
          why: 'A beats B beats C, so there is an order. But the gap between A and B is not a measurable quantity.',
        },
        {
          q: 'Months of the year',
          answer: 'int',
          why: 'They are ordered and evenly spaced, but there is no month zero. January is not twice June.',
        },
        {
          q: 'Annual salary',
          answer: 'rat',
          why: 'Zero salary means no salary at all, so ratios make sense: £60,000 is twice £30,000.',
        },
        {
          q: 'Medals won: gold, silver, bronze',
          answer: 'ord',
          why: 'Ranked, but the difference between gold and silver is not a number you can put your finger on.',
        },
      ]}
      note={
        <>
          Three questions, in order. <strong>Can you put them in order?</strong> No, and it is nominal.{' '}
          <strong>Are the gaps equal and meaningful?</strong> No, and it is ordinal.{' '}
          <strong>Does zero mean “none of it”?</strong> No, and it is interval. Yes to all three, and it is ratio.
        </>
      }
    />
  )
}

/* ========================================================================== */
/* What the course covers                                                     */
/* ========================================================================== */

const MODULES = [
  {
    n: 1,
    name: 'Basic probability and statistics',
    now: true,
    blurb:
      'Where this lecture sits. Describing a set of numbers: its centre, its spread, its shape, and anything odd in it.',
  },
  {
    n: 2,
    name: 'Conditional probability and Bayes’ theorem',
    now: false,
    blurb: 'How knowing one thing changes the chance of another. The engine behind spam filters and medical tests.',
  },
  {
    n: 3,
    name: 'Probability distributions',
    now: false,
    blurb: 'The standard shapes that data tends to come in, and what each one is good for.',
  },
  {
    n: 4,
    name: 'Hypothesis testing',
    now: false,
    blurb: 'Deciding whether a difference you can see is real or just luck.',
  },
  {
    n: 5,
    name: 'Prediction and forecasting',
    now: false,
    blurb: 'Using what happened so far to say something about what happens next.',
  },
  {
    n: 6,
    name: 'Forecasting, Gaussian mixtures and EM',
    now: false,
    blurb: 'More forecasting, plus a way of fitting several overlapping groups at once.',
  },
]

const MARKS = [
  { name: 'Quiz 1 and Quiz 2', kind: 'Online', pct: 10, ec: 'EC 1' },
  { name: 'Assignment 1', kind: 'Online', pct: 10, ec: 'EC 1' },
  { name: 'Situated learning', kind: 'Online', pct: 10, ec: 'EC 1' },
  { name: 'Mid-semester exam', kind: 'Closed book', pct: 30, ec: 'EC 2' },
  { name: 'Comprehensive exam', kind: 'Open book', pct: 40, ec: 'EC 3' },
]

export function CourseMapLab() {
  const [open, setOpen] = useState(1)

  return (
    <div className="grid items-start gap-5 rounded-lg border border-zinc-950/10 p-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The six modules — click one
        </div>
        {MODULES.map((m) => (
          <button
            key={m.n}
            type="button"
            onClick={() => setOpen(m.n)}
            className={clsx(
              'cursor-pointer rounded-lg border p-3 text-left',
              m.n === open ? 'border-zinc-950/25' : 'border-zinc-950/10 hover:border-zinc-950/20'
            )}
            style={m.n === open ? { background: 'var(--acc-12)' } : { background: '#fff' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                style={
                  m.n === open
                    ? { background: 'var(--acc)', color: '#fff' }
                    : { background: 'rgba(9,9,11,0.07)', color: '#52525b' }
                }
              >
                {m.n}
              </span>
              <span className="text-[13.5px] font-semibold text-zinc-950">{m.name}</span>
              {m.now && (
                <span
                  className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] uppercase"
                  style={{ background: TEAL, color: '#fff' }}
                >
                  you are here
                </span>
              )}
            </div>
            {m.n === open && <p className="mt-1.5 pl-7 text-[12.5px]/[1.6] text-zinc-700">{m.blurb}</p>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">How you are marked</div>
        {MARKS.map((m) => (
          <div key={m.name}>
            <div className="flex items-baseline justify-between text-[12.5px]">
              <span className="text-zinc-700">{m.name}</span>
              <span className="font-mono font-semibold text-zinc-950">{m.pct}%</span>
            </div>
            <div className="mt-0.5 h-[10px] overflow-hidden rounded-full bg-zinc-950/[0.06]">
              <div
                className="h-full rounded-full"
                style={{ width: `${(m.pct / 40) * 100}%`, background: m.pct >= 30 ? 'var(--acc)' : TEAL }}
              />
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-500">
              {m.kind} · {m.ec}
            </div>
          </div>
        ))}
        <p className="mt-1 text-xs/[1.55] text-zinc-600">
          70% of your mark is the two exams. The other 30% is spread over quizzes, an assignment and situated learning,
          all done online.
        </p>
      </div>
    </div>
  )
}
