'use client'

import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { useState } from 'react'

/*
 * Labs for parts 1–7 of ML Lecture 2 — what an algorithm is made of, what data
 * is, and the four types an attribute can have.
 *
 * Every table and every annotation below is copied from the deck. Where a
 * number is worked out rather than printed, the lab says so on the page.
 */

/* ========================================================================== */
/* Shared furniture                                                           */
/* ========================================================================== */

/** One row of a small read-only table. Hoisted: a helper defined inside a lab
 *  is a new component type every render, and React throws the subtree away. */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase">
      {children}
    </th>
  )
}

function Td({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 text-zinc-700" style={{ color: tone }}>
      {children}
    </td>
  )
}

/** A small labelled swatch used wherever a lab names an attribute type. */
function TypeTag({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10.5px] font-semibold whitespace-nowrap"
      style={{ background: `${tone}1a`, color: tone }}
    >
      {label}
    </span>
  )
}

const NOMINAL = '#7c3aed'
const ORDINAL = '#d97706'
const INTERVAL = '#0d9488'
const RATIO = '#db2777'

/* ========================================================================== */
/* Part 1 — ML in a nutshell, and ML in practice                              */
/* ========================================================================== */

const COMPONENTS = [
  {
    id: 'rep',
    name: 'Data representation',
    blurb: 'How a case is written down so an algorithm can read it: which columns, in what units, encoded how.',
  },
  {
    id: 'opt',
    name: 'Parameter optimization',
    blurb: 'How the numbers inside the model are chosen. Every fitting method on this course is one of these.',
  },
  {
    id: 'eval',
    name: 'Model evaluation, selection',
    blurb: 'How you decide the result is any good, and which of several candidates to keep.',
  },
] as const

const LOOP = [
  {
    n: 1,
    step: 'Understand domain, prior knowledge, and goals',
    feeds: 'rep',
    why: 'Nothing can be represented until you know what question is being asked. This step decides which columns are even worth collecting.',
  },
  {
    n: 2,
    step: 'Data integration, selection, cleaning, pre-processing, etc.',
    feeds: 'rep',
    why: 'This is the whole of this lecture. Every part after this one lives inside this single line of slide 6.',
  },
  {
    n: 3,
    step: 'Learn optimal parameter of the models',
    feeds: 'opt',
    why: 'The only step that is the algorithm. It is one line out of five, and the deck spends no time on it here.',
  },
  {
    n: 4,
    step: 'Interpret results',
    feeds: 'eval',
    why: 'Reading what came out, and deciding whether it means anything. Module M11 is devoted to this.',
  },
  {
    n: 5,
    step: 'Consolidate and deploy discovered knowledge',
    feeds: 'eval',
    why: 'Putting it into use — and then the arrow on the slide goes back to the top, because deployed models go stale.',
  },
] as const

export function NutshellLab() {
  const [at, setAt] = useState(0)
  const s = LOOP[at]!
  const comp = COMPONENTS.find((c) => c.id === s.feeds)!

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The loop on slide 6
            </span>
            <span className="text-[11px] text-zinc-400">press a step</span>
          </div>
          <div className="flex flex-col gap-2">
            {LOOP.map((x, i) => (
              <button
                key={x.n}
                type="button"
                onClick={() => setAt(i)}
                className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-left"
                style={{
                  borderColor: i === at ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                  background: i === at ? 'var(--acc-12)' : '#fff',
                }}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                  style={{ background: 'rgba(9,9,11,0.07)', color: '#3f3f46' }}
                >
                  {x.n}
                </span>
                <span className="text-[13.5px]/[1.5] text-zinc-800">{x.step}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-dashed border-zinc-950/20 px-3 py-2 text-[12.5px] text-zinc-600">
            ↻ and then round again — the slide draws an arrow from the bottom back to the top.
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut label="Feeds which component" value={comp.name} />
          <PanelNote>{comp.blurb}</PanelNote>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12.5px]/[1.6] text-zinc-700">
            {s.why}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
              ← back
            </Btn>
            <Btn primary onClick={() => setAt(Math.min(LOOP.length - 1, at + 1))} disabled={at === LOOP.length - 1}>
              next →
            </Btn>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {COMPONENTS.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border p-3"
            style={{
              borderColor: c.id === s.feeds ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
              background: c.id === s.feeds ? 'var(--acc-12)' : '#fff',
            }}
          >
            <div className="text-[13px] font-semibold text-zinc-950">{c.name}</div>
            <div className="mt-1 text-[12px]/[1.55] text-zinc-600">{c.blurb}</div>
          </div>
        ))}
      </div>

      <LabNote>
        Four of the five steps are not the algorithm. That proportion is the point of the whole session: “tens of
        thousands of machine learning algorithms, hundreds new every year” — and almost none of your time will be spent
        choosing between them.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — objects and attributes                                            */
/* ========================================================================== */

const TID_COLS = ['Tid', 'Refund', 'Marital Status', 'Taxable Income', 'Cheat'] as const

const TID_ROWS: Array<[string, string, string, string, string]> = [
  ['1', 'Yes', 'Single', '125K', 'No'],
  ['2', 'No', 'Married', '100K', 'No'],
  ['3', 'No', 'Single', '70K', 'No'],
  ['4', 'Yes', 'Married', '120K', 'No'],
  ['5', 'No', 'Divorced', '95K', 'Yes'],
  ['6', 'No', 'Married', '60K', 'No'],
  ['7', 'Yes', 'Divorced', '220K', 'No'],
  ['8', 'No', 'Single', '85K', 'Yes'],
  ['9', 'No', 'Married', '75K', 'No'],
  ['10', 'No', 'Single', '90K', 'Yes'],
]

const OBJECT_WORDS = 'record, point, case, sample, entity, instance'
const ATTR_WORDS = 'variable, field, characteristic, dimension, feature'

export function DataObjectsLab() {
  const [cell, setCell] = useState<{ r: number; c: number } | null>({ r: 4, c: 2 })

  const row = cell ? TID_ROWS[cell.r]! : null
  const value = cell && row ? row[cell.c]! : null
  const colName = cell ? TID_COLS[cell.c]! : null

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {TID_COLS.map((h, c) => (
                  <th
                    key={h}
                    className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] uppercase"
                    style={{ color: cell?.c === c ? 'var(--acc)' : '#71717a' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TID_ROWS.map((r, ri) => (
                <tr key={ri}>
                  {r.map((v, ci) => {
                    const inRow = cell?.r === ri
                    const inCol = cell?.c === ci
                    const exact = inRow && inCol
                    return (
                      <td key={ci} className="border-t border-zinc-950/[0.07] p-0">
                        <button
                          type="button"
                          onClick={() => setCell({ r: ri, c: ci })}
                          className="w-full cursor-pointer px-2 py-1.5 text-left font-mono text-[12px] hover:bg-zinc-950/[0.04]"
                          style={{
                            background: exact ? 'var(--acc-12)' : inRow || inCol ? 'rgba(9,9,11,0.035)' : 'transparent',
                            color: exact ? 'var(--acc)' : '#3f3f46',
                            fontWeight: exact ? 700 : 400,
                          }}
                        >
                          {v}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          {cell ? (
            <>
              <ReadOut label="The value you pressed" value={value ?? '—'} />
              <ReadOutGrid
                items={[
                  { label: 'object (row)', value: `#${cell.r + 1}` },
                  { label: 'attribute (col)', value: colName ?? '—' },
                ]}
              />
              <PanelNote>
                One value sits at the crossing of one <strong>object</strong> and one <strong>attribute</strong>. The
                row is object number {cell.r + 1}; the column is the attribute “{colName}”.
              </PanelNote>
              <div className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12px]/[1.6] text-zinc-600">
                <div className="mb-1 font-semibold text-zinc-800">Other names for the row</div>
                {OBJECT_WORDS}
                <div className="mt-2 mb-1 font-semibold text-zinc-800">Other names for the column</div>
                {ATTR_WORDS}
              </div>
            </>
          ) : (
            <PanelNote>Press any cell.</PanelNote>
          )}
        </div>
      </div>

      <LabNote>
        The deck gives eleven words for two things. That is not padding: different books and different libraries use
        different ones, and an exam question may say “instance” where the lecture said “object”, or “feature” where it
        said “attribute”. They mean the same thing.
      </LabNote>
      <LabNote>
        The last column, <strong>Cheat</strong>, is the one you would not know for a new person. Lecture 1 called that
        the <strong>target</strong>; the other four are the features.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — the four attribute types                                          */
/* ========================================================================== */

/**
 * The four properties are cumulative — the deck lists them as a ladder, and a
 * column that supports ratios necessarily supports the three below it. So the
 * tick boxes are wired that way: ticking one turns on everything beneath, and
 * clearing one clears everything above.
 */
const PROPS = [
  { id: 0, name: 'Distinctness', ops: '=  ≠', ask: 'Can you say two values are the same or different?' },
  { id: 1, name: 'Order', ops: '<  >', ask: 'Can you say one value is bigger than another?' },
  { id: 2, name: 'Differences are meaningful', ops: '+  −', ask: 'Does “ten more” mean the same thing everywhere?' },
  { id: 3, name: 'Ratios are meaningful', ops: '*  /', ask: 'Does “twice as much” mean anything?' },
] as const

const LEVELS = [
  {
    name: 'Nominal',
    tone: NOMINAL,
    family: 'Categorical / Qualitative',
    stats: 'mode, entropy, contingency correlation, χ² test',
  },
  {
    name: 'Ordinal',
    tone: ORDINAL,
    family: 'Categorical / Qualitative',
    stats: 'median, percentiles, rank correlation, run tests, sign tests',
  },
  {
    name: 'Interval',
    tone: INTERVAL,
    family: 'Numeric / Quantitative',
    stats: 'mean, standard deviation, Pearson’s correlation, t and F tests',
  },
  {
    name: 'Ratio',
    tone: RATIO,
    family: 'Numeric / Quantitative',
    stats: 'geometric mean, harmonic mean, percent variation',
  },
] as const

const ATTR_EXAMPLES = [
  { id: 'zip', label: 'Zip codes', level: 0 },
  { id: 'eye', label: 'Eye colour', level: 0 },
  { id: 'empid', label: 'Employee ID numbers', level: 0 },
  { id: 'sex', label: 'Sex: {male, female}', level: 0 },
  { id: 'hard', label: 'Hardness of minerals', level: 1 },
  { id: 'grades', label: 'Grades', level: 1 },
  { id: 'street', label: 'Street numbers', level: 1 },
  { id: 'chips', label: 'Taste of potato chips, 1–10', level: 1 },
  { id: 'dates', label: 'Calendar dates', level: 2 },
  { id: 'celsius', label: 'Temperature in Celsius', level: 2 },
  { id: 'fahr', label: 'Temperature in Fahrenheit', level: 2 },
  { id: 'kelvin', label: 'Temperature in Kelvin', level: 3 },
  { id: 'money', label: 'Monetary quantities', level: 3 },
  { id: 'counts', label: 'Counts', level: 3 },
  { id: 'age', label: 'Age', level: 3 },
  { id: 'mass', label: 'Mass', level: 3 },
  { id: 'length', label: 'Length', level: 3 },
  { id: 'race', label: 'Time to run a race', level: 3 },
] as const

export function AttributeTypeLab() {
  const [depth, setDepth] = useState(1)
  const [pick, setPick] = useState<string | null>(null)

  // depth 0 means nothing is ticked, which is not a level — say so rather than
  // reading off the end of the ladder.
  const level = depth >= 1 ? LEVELS[depth - 1]! : null
  const example = ATTR_EXAMPLES.find((e) => e.id === pick)
  const correct = example ? example.level + 1 === depth : null

  function toggle(i: number) {
    // Cumulative: ticking property i turns the ladder on up to i; clicking the
    // top one that is already on turns it back off.
    setDepth(depth === i + 1 ? i : i + 1)
    setPick(null)
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Which operations does the column allow?
          </div>
          <div className="flex flex-col gap-2">
            {PROPS.map((p, i) => {
              const on = depth > i
              return (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5"
                  style={{
                    borderColor: on ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                    background: on ? 'var(--acc-12)' : '#fff',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(i)}
                    className="mt-0.5 size-4 cursor-pointer accent-current"
                    aria-label={p.name}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[13.5px] font-semibold text-zinc-950">{p.name}</span>
                      <span className="font-mono text-[12px] text-zinc-500">{p.ops}</span>
                    </span>
                    <span className="text-[12px]/[1.5] text-zinc-600">{p.ask}</span>
                  </span>
                </label>
              )
            })}
          </div>
          <p className="mt-3 text-[12px]/[1.6] text-zinc-500">
            They stack. A column whose ratios mean something can obviously also be ordered and compared, so ticking one
            turns on every box beneath it.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Attribute type"
            value={level ? level.name : 'none of the four'}
            tone={level ? level.tone : '#a1a1aa'}
          />
          <ReadOutGrid
            items={[
              { label: 'family', value: level ? level.family.split(' / ')[0]! : '—' },
              { label: 'properties', value: `${depth} of 4` },
            ]}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Statistics you may use
            </div>
            <div className="text-[12px]/[1.6] text-zinc-700">
              {level
                ? level.stats
                : 'Nothing at all. A column whose values cannot even be told apart carries no information, which is why the ladder starts at distinctness rather than below it.'}
            </div>
          </div>
          <PanelNote>
            The list of legal statistics is the reason the classification matters. Taking a mean of zip codes is not
            wrong-ish — it is meaningless.
          </PanelNote>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Now try one of the deck’s examples
        </div>
        <div className="flex flex-wrap gap-2">
          {ATTR_EXAMPLES.map((e) => (
            <Chip key={e.id} on={pick === e.id} label={e.label} onClick={() => setPick(e.id)} />
          ))}
        </div>
      </div>

      {example && (
        <Verdict ok={correct === true}>
          {correct ? (
            <>
              Right. <strong>{example.label}</strong> is {LEVELS[example.level]!.name.toLowerCase()}, and that is what
              the boxes above say.
            </>
          ) : (
            <>
              Not with those boxes ticked. <strong>{example.label}</strong> is{' '}
              <strong>{LEVELS[example.level]!.name.toLowerCase()}</strong> — set the ladder to {example.level + 1}{' '}
              propert{example.level === 0 ? 'y' : 'ies'} and it agrees.
            </>
          )}
        </Verdict>
      )}

      <LabNote>
        The classification is due to <strong>S. S. Stevens</strong>, and the deck names him on both table slides. It is
        the same four levels the statistics course teaches in its own first lecture, under the name{' '}
        <em>levels of measurement</em>.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — where zero is                                                     */
/* ========================================================================== */

/**
 * The deck asks whether 10° is twice 5°, and answers it by scale. The honest
 * way to show it is to convert both readings to an absolute scale — Kelvin,
 * whose zero really is "no heat" — and print the ratio that comes out. Nothing
 * is asserted; the arithmetic is done in front of the reader.
 */
const SCALES = [
  { id: 'C', label: 'Celsius', toAbs: (v: number) => v + 273.15, unit: '°C', zero: 'the freezing point of water' },
  {
    id: 'F',
    label: 'Fahrenheit',
    toAbs: (v: number) => ((v - 32) * 5) / 9 + 273.15,
    unit: '°F',
    zero: 'a brine mixture Fahrenheit had to hand',
  },
  { id: 'K', label: 'Kelvin', toAbs: (v: number) => v, unit: 'K', zero: 'no thermal energy at all' },
] as const

const HEIGHT_MEAN = 66

export function ScaleZeroLab() {
  const [mode, setMode] = useState<'temp' | 'height'>('temp')
  const [scale, setScale] = useState<'C' | 'F' | 'K'>('C')
  const [a, setA] = useState(5)
  const [b, setB] = useState(10)

  const sc = SCALES.find((s) => s.id === scale)!
  const claimed = a === 0 ? NaN : b / a

  // On the height reading the arbitrary zero is the average, so the absolute
  // scale is the height itself.
  const absA = mode === 'temp' ? sc.toAbs(a) : HEIGHT_MEAN + a
  const absB = mode === 'temp' ? sc.toAbs(b) : HEIGHT_MEAN + b
  const real = absA === 0 ? NaN : absB / absA
  const holds = Number.isFinite(claimed) && Number.isFinite(real) && Math.abs(claimed - real) < 1e-9

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'temp' as const, label: 'Temperature' },
          { id: 'height' as const, label: 'Height above average' },
        ]}
        at={mode}
        onPick={(m) => {
          setMode(m)
          if (m === 'height') {
            setA(3)
            setB(6)
          } else {
            setA(5)
            setB(10)
          }
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-5">
          {mode === 'temp' && (
            <div className="flex flex-wrap gap-2">
              {SCALES.map((s) => (
                <Chip key={s.id} on={scale === s.id} label={s.label} onClick={() => setScale(s.id)} />
              ))}
            </div>
          )}

          <Slider
            label={mode === 'temp' ? `First reading (${sc.unit})` : 'Bill: inches above average'}
            value={a}
            display={`${a}${mode === 'temp' ? ` ${sc.unit}` : '″'}`}
            min={mode === 'temp' ? 1 : 1}
            max={mode === 'temp' ? 60 : 12}
            step={1}
            hint={mode === 'temp' ? 'The deck uses 5°.' : 'The deck uses three inches.'}
            onChange={setA}
          />
          <Slider
            label={mode === 'temp' ? `Second reading (${sc.unit})` : 'Bob: inches above average'}
            value={b}
            display={`${b}${mode === 'temp' ? ` ${sc.unit}` : '″'}`}
            min={mode === 'temp' ? 1 : 1}
            max={mode === 'temp' ? 60 : 12}
            step={1}
            hint={mode === 'temp' ? 'The deck uses 10°.' : 'The deck uses six inches.'}
            onChange={setB}
          />

          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3.5 font-mono text-[12.5px]/[1.9] text-zinc-800">
            <div>
              the claim: {b} ÷ {a} = {Number.isFinite(claimed) ? claimed.toFixed(3) : '—'} ×
            </div>
            <div className="mt-1 text-zinc-500">
              {mode === 'temp' ? 'on an absolute scale (K):' : 'as actual heights (inches):'}
            </div>
            <div>
              {absB.toFixed(2)} ÷ {absA.toFixed(2)} = {Number.isFinite(real) ? real.toFixed(3) : '—'} ×
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Does the ratio hold?"
            value={holds ? 'Yes' : 'No'}
            tone={holds ? INTERVAL : '#dc2626'}
            note={holds ? 'zero means “none of it”' : 'the zero is arbitrary'}
          />
          <ReadOutGrid
            items={[
              { label: 'ratio claimed', value: Number.isFinite(claimed) ? `${claimed.toFixed(2)}×` : '—' },
              { label: 'ratio really', value: Number.isFinite(real) ? `${real.toFixed(2)}×` : '—' },
            ]}
          />
          <PanelNote>
            {mode === 'temp' ? (
              <>
                Zero on this scale means <strong>{sc.zero}</strong>.
              </>
            ) : (
              <>
                Zero here means <strong>exactly average</strong> — a person of average height, not a person of no
                height.
              </>
            )}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={holds}>
        {holds ? (
          <>
            Kelvin is a <strong>ratio</strong> scale: its zero is a real absence, so “twice” means twice. This is the
            only one of the three scales for which the deck’s question gets a yes.
          </>
        ) : (
          <>
            {mode === 'temp' ? (
              <>
                {sc.label} is an <strong>interval</strong> scale. Differences are fine — 10° minus 5° really is five
                degrees of extra heat — but the ratio is an artefact of where somebody put the zero.
              </>
            ) : (
              <>
                Height above average is an <strong>interval</strong> reading for the same reason, which is the deck’s
                own answer to “is this situation analogous to that of temperature?” — it is.
              </>
            )}
          </>
        )}
      </Verdict>

      <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          What you may do to a scale without breaking it — slide 12
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Legal transformation</Th>
                <Th>Why it does not matter</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td tone={NOMINAL}>Nominal</Td>
                <Td>Any permutation of values</Td>
                <Td>If every employee ID were reassigned, would it make any difference?</Td>
              </tr>
              <tr>
                <Td tone={ORDINAL}>Ordinal</Td>
                <Td>new_value = f(old_value), f monotonic</Td>
                <Td>
                  Good, better, best works as {'{'}1, 2, 3{'}'} or as {'{'}0.5, 1, 10{'}'}.
                </Td>
              </tr>
              <tr>
                <Td tone={INTERVAL}>Interval</Td>
                <Td>new_value = a × old_value + b</Td>
                <Td>Celsius and Fahrenheit differ in where zero is and in the size of a degree.</Td>
              </tr>
              <tr>
                <Td tone={RATIO}>Ratio</Td>
                <Td>new_value = a × old_value</Td>
                <Td>Length can be measured in metres or in feet — but never with an offset.</Td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12px]/[1.6] text-zinc-500">
          Notice the one difference between the last two rows: the ratio scale loses the <code>+ b</code>. Adding an
          offset is exactly what would move the zero, and the zero is the thing a ratio scale is not allowed to lose.
        </p>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — discrete, continuous, and the shape of a dataset                  */
/* ========================================================================== */

const DC_EXAMPLES = [
  { id: 'zip', label: 'Zip codes', discrete: true, note: 'A finite set of codes. Stored as integers.' },
  { id: 'counts', label: 'Counts', discrete: true, note: 'Countably infinite: 0, 1, 2, … and nothing in between.' },
  {
    id: 'words',
    label: 'The set of words in a collection of documents',
    discrete: true,
    note: 'The deck’s own third example, and the reason document data is so sparse.',
  },
  { id: 'binary', label: 'A yes/no column', discrete: true, note: 'Binary attributes are a special case of discrete.' },
  { id: 'temp', label: 'Temperature', discrete: false, note: 'Real-valued. Stored as floating point.' },
  { id: 'height', label: 'Height', discrete: false, note: 'Real-valued, however few digits you actually record.' },
  { id: 'weight', label: 'Weight', discrete: false, note: 'Real-valued.' },
] as const

export function DataShapeLab() {
  const [pick, setPick] = useState<string>('temp')
  const [dims, setDims] = useState(2)
  const e = DC_EXAMPLES.find((x) => x.id === pick)!

  // 1000 points spread over 10 buckets per axis. The count per cell is the
  // honest way to show what "increasingly sparse" means — it is recomputed,
  // never stored.
  const points = 1000
  const cells = Math.pow(10, dims)
  const perCell = points / cells

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-5">
          <div>
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Discrete or continuous?
            </div>
            <div className="flex flex-wrap gap-2">
              {DC_EXAMPLES.map((x) => (
                <Chip key={x.id} on={pick === x.id} label={x.label} onClick={() => setPick(x.id)} />
              ))}
            </div>
            <div
              className="mt-3 rounded-lg border px-3.5 py-2.5 text-[13px]/[1.6]"
              style={
                e.discrete
                  ? { borderColor: 'rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.07)', color: '#5b21b6' }
                  : { borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.08)', color: '#115e59' }
              }
            >
              <strong>{e.discrete ? 'Discrete. ' : 'Continuous. '}</strong>
              {e.note}
            </div>
          </div>

          <div className="border-t border-zinc-950/[0.08] pt-4">
            <Slider
              label="Dimensionality — how many attributes"
              value={dims}
              display={`${dims} attribute${dims === 1 ? '' : 's'}`}
              min={1}
              max={6}
              step={1}
              hint="A thousand rows, and each attribute split into ten buckets."
              onChange={setDims}
            />
            <div className="mt-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-3.5 font-mono text-[12.5px]/[1.9] text-zinc-800">
              <div>
                cells = 10^{dims} = {cells.toLocaleString('en-GB')}
              </div>
              <div>
                rows per cell = 1000 ÷ {cells.toLocaleString('en-GB')} ={' '}
                {perCell >= 1 ? perCell.toFixed(perCell >= 10 ? 0 : 1) : perCell.toExponential(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Rows per cell"
            value={perCell >= 1 ? perCell.toFixed(perCell >= 10 ? 0 : 2) : perCell.toExponential(1)}
            tone={perCell < 1 ? '#dc2626' : undefined}
            note={perCell < 1 ? 'most cells are now empty' : 'still something to learn from'}
          />
          <PanelNote>
            The <strong>Sparsity</strong> line on slide 14 and the curse of dimensionality on slide 51 are the same fact
            seen twice. Nothing has been added to the data — only columns — and yet the neighbours each row used to have
            are gone.
          </PanelNote>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12px]/[1.6] text-zinc-600">
            <strong className="text-zinc-800">Resolution:</strong> the same ten buckets per attribute are a choice. Make
            them coarser and patterns appear that finer buckets hide, and the other way round.
          </div>
        </div>
      </div>

      <LabNote>
        Slide 14 names four things worth asking about any dataset: how many attributes (<strong>dimensionality</strong>
        ), how much of it is nothing (<strong>sparsity</strong>, where only presence counts), at what scale you are
        looking (<strong>resolution</strong>), and how much of it there is (<strong>size</strong>, which decides what
        analysis is even affordable).
      </LabNote>
      <LabNote>
        The arithmetic above is worked out here, not printed in the deck — the deck states that data becomes
        increasingly sparse as dimensionality rises and leaves it at that. The 10-bucket split is chosen to make the
        effect countable.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 6 — the seven kinds of data                                           */
/* ========================================================================== */

interface Kind {
  id: string
  name: string
  what: string
  cols: string[]
  rows: string[][]
  marks?: Array<{ col: number; label: string; tone: string }>
  note: string
}

const KINDS: Kind[] = [
  {
    id: 'rel',
    name: 'Relational / Object',
    what: 'One row per thing, the same columns for every row. The ordinary table.',
    cols: ['', 'ServiceRating', 'IsPriorityCustomer', 'CardType', 'CreditScore', 'isMultipleAccountHolder'],
    rows: [
      ['Jack', '5', 'Yes', 'Platinum', '7.5', 'Yes'],
      ['Jill', '2', 'Yes', 'Gold', '8.2', 'No'],
      ['John', '9', 'No', 'Gold', '7', 'Yes'],
    ],
    marks: [
      { col: 1, label: 'Discrete Numeric', tone: RATIO },
      { col: 2, label: 'Asymmetric Binary', tone: NOMINAL },
      { col: 3, label: 'Ordinal', tone: ORDINAL },
      { col: 4, label: 'Continuous Numeric', tone: INTERVAL },
      { col: 5, label: 'Symmetric Binary', tone: NOMINAL },
    ],
    note: 'The deck labels five of these columns itself. Note that two yes/no columns get different names — see the note below the table.',
  },
  {
    id: 'trans',
    name: 'Transactional Data',
    what: 'A basket per event. The row is a set of items, and the sets are different lengths.',
    cols: ['', 'Items Bought'],
    rows: [
      ['Transaction 1', 'Paper, Pen, Medicine'],
      ['Transaction 2', 'Rice, Medicine, Vegetable, Milk'],
      ['Transaction 3', 'Milk, Bread, Egg, Milk'],
      ['Transaction 4', 'Bread, Jam, Butter, Jam'],
    ],
    note: 'The deck shows the same data twice: once as Jack/Jill/John with a Purchase 1 and Purchase 2 column, and once flattened into one transaction per row.',
  },
  {
    id: 'doc',
    name: 'Document Data',
    what: 'One row per document, one column per term, and the value is how often the term appears.',
    cols: ['', 'Trend', 'Data', 'Story', 'Mining', 'Cloth'],
    rows: [
      ['Document 1', '5', '10', '4', '8', '0'],
      ['Document 2', '5', '5', '8', '0', '7'],
      ['Document 3', '2', '8', '2', '4', '0'],
    ],
    note: 'Most of a real term-document table is zeros — the sparsity of slide 14, in its purest form. A vocabulary of 50,000 words gives 50,000 columns and a handful of non-zero entries per row.',
  },
  {
    id: 'web',
    name: 'Web & Social Network Data',
    what: 'Objects plus the links between them. The links are data too.',
    cols: ['', 'Work-Field', 'Purpose of Connect', 'Domain of work', 'No. of Connections', 'Link to parent'],
    rows: [
      ['John', 'Industry', 'Job-Search', 'Analyst', '1', 'Jack'],
      ['Mary', 'Education', 'Data-Analysis', 'Mathematics', '2', 'Jack, Jill'],
    ],
    marks: [
      { col: 1, label: 'Categorical Nominal', tone: NOMINAL },
      { col: 2, label: 'Categorical Nominal', tone: NOMINAL },
      { col: 3, label: 'Categorical Nominal', tone: NOMINAL },
    ],
    note: 'The deck draws Jack, Jill, John and Mary as circles joined by lines, and then shows the same thing as a table. The Link to parent column is what makes it a network rather than a plain table.',
  },
  {
    id: 'spatial',
    name: 'Spatial Data',
    what: 'Every row carries a position, so nearness is part of the meaning.',
    cols: ['User', 'Call Type', 'Call Duration', 'Time Stamp', 'Tower Cell ID', 'Latitude', 'Longitude'],
    rows: [
      ['9341959679262440000', 'Voice', '10', '2019-11-20 14:15:01', '123456', '12.97', '77.58'],
      ['9341959679262440000', 'Text', '0', '2019-11-19 11:10:09', '123456', '12.73', '77.82'],
      ['9221959659362440000', 'Voice', '10', '2019-11-20 14:15:01', '324576', '19.07', '72.87'],
    ],
    note: 'Latitude and longitude look like ordinary numbers and are not: the distance between two of them depends on where on the globe you are.',
  },
  {
    id: 'time',
    name: 'Time Series',
    what: 'The same measurements over and over, and the order of the rows is the point.',
    cols: ['', 'Profit%', 'EmployeeAttritionRate', 'CreditScore'],
    rows: [
      ['Jan 18', '28.5', '10', '20'],
      ['April 18', '35.9', '42', '50'],
      ['July 18', '46.8', '45', '40'],
      ['Oct 18', '50.7', '5', '45'],
      ['Jan 19', '70.25', '8', '45'],
      ['April 19', '75.85', '45', '20'],
      ['July 19', '90.5', '47', '50'],
    ],
    note: 'Shuffle these rows and you have destroyed the data. That is the test for a time series — and it is also why lecture 1 put time-series analysis out of scope for this course.',
  },
  {
    id: 'seq',
    name: 'Sequence Data',
    what: 'An ordered run of symbols with no clock attached. Position matters, elapsed time does not.',
    cols: ['Read', 'Sequence'],
    rows: [
      ['180–230', 'T A T T G T A T T A A T G T C C T G T T A T A T'],
      ['270–320', 'A A A T T T C A A A T A C C G T T A T G T A A A A T A'],
      ['360–410', 'G G G T T A A A A C A C C T G G A G G A A A T A'],
    ],
    note: 'The deck shows a DNA chromatogram. A sequence differs from a time series in that there are no timestamps — only an order.',
  },
]

export function DataKindsLab() {
  const [at, setAt] = useState('rel')
  const k = KINDS.find((x) => x.id === at)!

  return (
    <LabBox>
      <Presets items={KINDS.map((x) => ({ id: x.id, label: x.name }))} at={at} onPick={setAt} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {k.cols.map((c, i) => (
                  <th
                    key={i}
                    className="border-b border-zinc-950/10 px-2 py-2 text-left align-bottom text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    <span className="flex flex-col gap-1">
                      {k.marks?.find((m) => m.col === i) && (
                        <TypeTag
                          label={k.marks.find((m) => m.col === i)!.label}
                          tone={k.marks.find((m) => m.col === i)!.tone}
                        />
                      )}
                      <span>{c}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {k.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((v, ci) => (
                    <td
                      key={ci}
                      className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-[11.5px] whitespace-nowrap text-zinc-700"
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut label="Kind" value={`${KINDS.findIndex((x) => x.id === at) + 1} of 7`} />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <div className="mb-1 text-[13px] font-semibold text-zinc-950">{k.name}</div>
            <div className="text-[12.5px]/[1.6] text-zinc-700">{k.what}</div>
          </div>
          <PanelNote>{k.note}</PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-zinc-950/20 bg-white px-4 py-3 text-[12.5px]/[1.7] text-zinc-700">
        <strong className="text-zinc-900">Symmetric or asymmetric binary?</strong> Both columns hold Yes and No, and the
        deck labels them differently. A <em>symmetric</em> binary attribute is one where both outcomes matter equally —
        holding several accounts and holding one are both ordinary states. An <em>asymmetric</em> binary attribute is
        one where only the rare “yes” carries information; being a priority customer says something, not being one is
        just the default. This distinction is not spelled out on the slide, so it is given here as background — the
        labels themselves are the deck’s.
      </div>

      <LabNote>
        Worth keeping straight: these labels — Discrete Numeric, Ordinal, Symmetric Binary — are not the same list as
        the four types in the previous part. Nominal, ordinal, interval and ratio say what the <em>values mean</em>;
        discrete against continuous says how they are <em>stored</em>; symmetric against asymmetric says which outcome
        carries the information. A column has an answer on all three, and “Discrete Numeric” on its own does not tell
        you the Stevens level.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — the bank case study                                               */
/* ========================================================================== */

type Lvl = 'nominal' | 'ordinal' | 'interval' | 'ratio'

const LVL_META: Record<Lvl, { name: string; tone: string }> = {
  nominal: { name: 'Nominal', tone: NOMINAL },
  ordinal: { name: 'Ordinal', tone: ORDINAL },
  interval: { name: 'Interval', tone: INTERVAL },
  ratio: { name: 'Ratio', tone: RATIO },
}

const BANK_COLS: Array<{
  name: string
  values: string[]
  answer: Lvl
  /**
   * True when the answer follows from a column the deck itself names on the
   * matching slide-15 table. Slide 15 labels five columns, but on a different
   * axis — numeric/categorical and discrete/continuous, not Stevens' four
   * levels — so a label there does not always settle the level.
   */
  fromDeck: boolean
  /**
   * Set where the deck gives no way to decide. Those columns are shown, and
   * excluded from the score, rather than answered on a guess.
   */
  unsettled?: boolean
  why: string
}> = [
  {
    name: 'Name',
    values: ['Jack', 'Jill', 'John', 'Mary'],
    answer: 'nominal',
    fromDeck: false,
    why: 'A label and nothing else — you can only ask whether two are the same. The deck’s own table lists employee ID numbers and eye colour as nominal, and a name is the same kind of thing.',
  },
  {
    name: 'Gender',
    values: ['Male', 'Female', 'Male', 'Male'],
    answer: 'nominal',
    fromDeck: false,
    why: 'Slide 11 gives “sex: {male, female}” as its example of a nominal attribute. Coded as one binary column it is the symmetric binary of slide 15.',
  },
  {
    name: 'Service Rating',
    values: ['5', '2', '9', '6'],
    answer: 'ordinal',
    fromDeck: false,
    why: 'Slide 15 marks this column Discrete Numeric, which is a statement about the values being whole numbers, not about the Stevens level. On the Stevens ladder it is ordinal, and the deck settles that elsewhere: slide 8 gives “taste of potato chips on a scale from 1 to 10” as its example of an ordinal attribute. 9 is better than 5; the step from 5 to 6 need not equal the step from 8 to 9.',
  },
  {
    name: 'Is Priority Customer?',
    values: ['Yes', 'Yes', 'No', 'No'],
    answer: 'nominal',
    fromDeck: true,
    why: 'Slide 15 marks it Asymmetric Binary. Binary attributes are nominal — two categories, no order.',
  },
  {
    name: 'Card Type',
    values: ['Platinum', 'Gold', 'Gold', 'Gold'],
    answer: 'ordinal',
    fromDeck: true,
    why: 'Slide 15 marks this Ordinal. Platinum outranks Gold, but “how much better” is not a number.',
  },
  {
    name: 'Credit Score',
    values: ['7.5', '8.2', '7', '6.0'],
    answer: 'interval',
    fromDeck: false,
    unsettled: true,
    why: 'Slide 15 marks this Continuous Numeric, and that is all it says. Interval or ratio turns entirely on whether a score of 0 would mean “no creditworthiness whatever” — and nothing in the deck, or in the four values printed, tells you that. So no level is claimed here. Say in an exam that it is continuous numeric, and that the interval-or-ratio question needs the scale definition.',
  },
  {
    name: 'Is Multiple Account Holder',
    values: ['Yes', 'No', 'Yes', 'No'],
    answer: 'nominal',
    fromDeck: true,
    why: 'Slide 15 marks it Symmetric Binary. Still nominal: two categories with no order between them.',
  },
  {
    name: 'Income Level',
    values: ['Upper', 'Middle', 'Lower', 'Lower'],
    answer: 'ordinal',
    fromDeck: false,
    why: 'Upper, Middle, Lower is exactly the shape of the deck’s own ordinal example {good, better, best} — an order with no arithmetic.',
  },
  {
    name: 'Region',
    values: ['BGLR', 'DELHI', 'BGLR', 'BGLR'],
    answer: 'nominal',
    fromDeck: false,
    why: 'A place name. The deck lists zip codes as nominal, and a city code is the same thing.',
  },
]

export function BankTableLab() {
  const [picks, setPicks] = useState<Record<string, Lvl | undefined>>({})
  const [show, setShow] = useState(false)

  // The unsettled column is not marked, so it is not part of the total either.
  const gradable = BANK_COLS.filter((c) => !c.unsettled)
  const answered = gradable.filter((c) => picks[c.name]).length
  const right = gradable.filter((c) => picks[c.name] === c.answer).length

  return (
    <LabBox>
      <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <Th>Column</Th>
              <Th>What is in it</Th>
              <Th>Your answer</Th>
              {show && <Th>Type</Th>}
            </tr>
          </thead>
          <tbody>
            {BANK_COLS.map((c) => {
              const p = picks[c.name]
              const ok = p === c.answer
              return (
                <tr key={c.name}>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 font-semibold text-zinc-900">{c.name}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2 font-mono text-[11.5px] text-zinc-600">
                    {c.values.join(', ')}
                  </td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(Object.keys(LVL_META) as Lvl[]).map((l) => (
                        <button
                          key={l}
                          type="button"
                          aria-label={`${c.name}: ${LVL_META[l].name}`}
                          onClick={() => setPicks({ ...picks, [c.name]: p === l ? undefined : l })}
                          className="cursor-pointer rounded border px-1.5 py-1 text-[10.5px] font-semibold"
                          style={
                            p === l
                              ? {
                                  borderColor: LVL_META[l].tone,
                                  background: `${LVL_META[l].tone}1a`,
                                  color: LVL_META[l].tone,
                                }
                              : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#a1a1aa' }
                          }
                        >
                          {LVL_META[l].name}
                        </button>
                      ))}
                    </div>
                  </td>
                  {show && (
                    <td className="border-t border-zinc-950/[0.07] px-2 py-2">
                      {c.unsettled ? (
                        <span className="flex flex-col gap-1">
                          <TypeTag label="not settled" tone="#a16207" />
                          <span className="text-[11px] text-zinc-400">the deck does not decide this one</span>
                        </span>
                      ) : (
                        <span className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5">
                            <TypeTag label={LVL_META[c.answer].name} tone={LVL_META[c.answer].tone} />
                            {p && <span className="text-[13px]">{ok ? '✓' : '✗'}</span>}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {c.fromDeck ? 'the deck types this column' : 'follows from the deck’s own examples'}
                          </span>
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="flex flex-wrap gap-2">
          <Btn primary onClick={() => setShow(!show)}>
            {show ? 'Hide the answers' : 'Show the answers'}
          </Btn>
          <Btn
            onClick={() => {
              setPicks({})
              setShow(false)
            }}
          >
            Clear
          </Btn>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'answered', value: `${answered} of ${gradable.length}` },
              { label: 'right', value: show ? `${right}` : '—' },
            ]}
          />
          <PanelNote>
            Eight columns are marked. The ninth, Credit Score, is not — the deck gives no way to tell interval from
            ratio there, so it prints no answer instead of guessing one.
          </PanelNote>
        </div>
      </div>

      {show && (
        <div className="flex flex-col gap-2">
          {BANK_COLS.map((c) => (
            <div key={c.name} className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12.5px]/[1.65]">
              <span className="font-semibold text-zinc-900">{c.name} — </span>
              <span className="text-zinc-700">{c.why}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <strong>One thing the case study asks that its own data cannot answer.</strong> The brief says the bank wants to
        target “high income level possessing Titanium card types”, and the table contains no Titanium row — only
        Platinum and Gold. Nothing here can tell you whether Titanium ranks above Platinum or below Gold, so this page
        prints no ordering for it. The question is worth keeping; the missing rank is not worth guessing.
      </div>
    </LabBox>
  )
}
