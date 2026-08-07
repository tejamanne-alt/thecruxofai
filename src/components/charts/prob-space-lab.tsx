'use client'

import { PanelButton, PanelButtons, PanelNote, RangeInput } from '@/components/sessions/session-parts'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

/* ========================================================================== */
/* Sample space, events, and the complement                                   */
/* ========================================================================== */

const EXPERIMENTS = [
  { id: 'die', name: 'Roll a die', outcomes: ['1', '2', '3', '4', '5', '6'] },
  { id: 'coin2', name: 'Flip a coin twice', outcomes: ['HH', 'HT', 'TH', 'TT'] },
  { id: 'chip', name: 'Test a chip', outcomes: ['accepted', 'rejected'] },
  {
    id: 'calls',
    name: 'Three phone calls: voice or data',
    outcomes: ['vvv', 'vvd', 'vdv', 'vdd', 'dvv', 'dvd', 'ddv', 'ddd'],
  },
]

/**
 * An event is "a subset of the sample space", which is a sentence that means
 * nothing until you have built one. Here you click outcomes to make an event,
 * and the probability appears as the count over the total — the classical
 * definition, assembled by hand rather than quoted.
 */
export function SampleSpaceLab({ showComplement = false }: { showComplement?: boolean }) {
  const [pick, setPick] = useState('die')
  const exp = EXPERIMENTS.find((e) => e.id === pick) ?? EXPERIMENTS[0]
  const [chosen, setChosen] = useState<string[]>(['4', '5', '6'])
  const [comp, setComp] = useState(false)

  const inA = exp.outcomes.filter((o) => chosen.includes(o))
  const notA = exp.outcomes.filter((o) => !chosen.includes(o))
  const shown = comp ? notA : inA
  const p = shown.length / exp.outcomes.length

  const load = (id: string) => {
    setPick(id)
    setChosen([])
    setComp(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap gap-2">
        {EXPERIMENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => load(e.id)}
            className={clsx(
              'cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] font-semibold',
              e.id === pick
                ? 'border-zinc-950/90 bg-zinc-900 text-white'
                : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
            )}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          S — the sample space. Click outcomes to build an event A.
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg border-2 border-zinc-300 p-3">
          {exp.outcomes.map((o) => {
            const on = chosen.includes(o)
            const lit = comp ? !on : on
            return (
              <button
                key={o}
                type="button"
                onClick={() => setChosen((c) => (c.includes(o) ? c.filter((x) => x !== o) : [...c, o]))}
                className={clsx(
                  'min-w-[54px] cursor-pointer rounded-md px-3 py-2 text-center font-mono text-[13px]',
                  lit ? 'font-bold' : 'text-zinc-500 hover:bg-zinc-950/[0.05]'
                )}
                style={
                  lit
                    ? comp
                      ? { background: 'rgba(217,119,6,0.16)', color: AMBER }
                      : { background: 'var(--acc-12)', color: 'var(--acc)' }
                    : undefined
                }
              >
                {o}
              </button>
            )
          })}
        </div>
        <p className="mt-1.5 text-[11.5px] text-zinc-500">
          |S| = {exp.outcomes.length} — that is how many things could possibly happen.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="font-mono text-[13px]/[1.9] text-zinc-800">
          <div>S = &#123; {exp.outcomes.join(', ')} &#125;</div>
          <div style={{ color: 'var(--acc)' }}>A = &#123; {inA.join(', ') || ' '} &#125;</div>
          {showComplement && <div style={{ color: AMBER }}>Aᶜ = &#123; {notA.join(', ') || ' '} &#125;</div>}
          <div className="mt-1.5">
            P({comp ? 'Aᶜ' : 'A'}) = {shown.length} / {exp.outcomes.length} ={' '}
            <strong>{exp.outcomes.length ? p.toFixed(3) : '—'}</strong>
          </div>
          {showComplement && (
            <div>
              P(A) + P(Aᶜ) = {(inA.length / exp.outcomes.length).toFixed(3)} +{' '}
              {(notA.length / exp.outcomes.length).toFixed(3)} = <strong>1</strong>
            </div>
          )}
        </div>
      </div>

      <PanelButtons>
        {showComplement && (
          <PanelButton primary onClick={() => setComp((c) => !c)}>
            {comp ? 'Show A again' : 'Show the complement Aᶜ'}
          </PanelButton>
        )}
        <PanelButton onClick={() => setChosen([...exp.outcomes])}>Pick everything</PanelButton>
        <PanelButton onClick={() => setChosen([])}>Pick nothing</PanelButton>
      </PanelButtons>

      <PanelNote>
        {showComplement ? (
          <>
            The complement is everything in S that is <em>not</em>{' '}in A. Between them they cover S exactly once, so
            their probabilities always add to 1. That is often the quickest route to an answer: work out the easy side
            and subtract.
          </>
        ) : (
          <>
            Press <strong>Pick everything</strong> and you get P(S) = 1. Press <strong>Pick nothing</strong>{' '}and you get
            0. Those are the two extremes, and every event sits somewhere between them.
          </>
        )}
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* Two dice — Example 2 from the slides                                       */
/* ========================================================================== */

const CONDITIONS = [
  { id: 'gt8', name: 'sum greater than 8', test: (a: number, b: number) => a + b > 8 },
  { id: 'lt6', name: 'sum less than 6', test: (a: number, b: number) => a + b < 6 },
  { id: 'not711', name: 'sum is neither 7 nor 11', test: (a: number, b: number) => a + b !== 7 && a + b !== 11 },
  { id: 'eq7', name: 'sum is exactly 7', test: (a: number, b: number) => a + b === 7 },
  { id: 'double', name: 'a double', test: (a: number, b: number) => a === b },
]

/** Simplify a fraction so the answer reads like the one on the slide. */
function frac(n: number, d: number) {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a)
  const k = g(n, d) || 1
  return `${n / k}/${d / k}`
}

/**
 * All 36 outcomes laid out as a grid. Counting favourable outcomes is the
 * classical definition, and on a grid you can literally see the count — which
 * beats trusting an arithmetic you did in your head.
 */
export function DiceLab() {
  const [cond, setCond] = useState('gt8')
  const c = CONDITIONS.find((x) => x.id === cond) ?? CONDITIONS[0]
  const cells: Array<[number, number]> = []
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) cells.push([a, b])
  const hits = cells.filter(([a, b]) => c.test(a, b))

  return (
    <div className="grid items-start gap-5 rounded-lg border border-zinc-950/10 p-4 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="overflow-x-auto">
        <table className="border-collapse font-mono text-[12px]">
          <thead>
            <tr>
              <th className="p-1" />
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <th key={b} className="p-1 text-[11px] font-semibold text-zinc-400">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((a) => (
              <tr key={a}>
                <th className="p-1 text-[11px] font-semibold text-zinc-400">{a}</th>
                {[1, 2, 3, 4, 5, 6].map((b) => {
                  const on = c.test(a, b)
                  return (
                    <td key={b} className="p-[3px]">
                      <div
                        className="grid size-[46px] place-items-center rounded-md text-[11.5px] transition-colors duration-150"
                        style={
                          on
                            ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 }
                            : { background: 'rgba(9,9,11,0.04)', color: '#a1a1aa' }
                        }
                      >
                        {a + b}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-zinc-500">
          Every square is one of the 36 equally likely outcomes. The number in it is the sum.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The probability</div>
          <div className="font-mono text-[26px] font-semibold tracking-[-0.02em] text-zinc-950">
            {frac(hits.length, 36)}
          </div>
          <div className="mt-0.5 text-[12px] text-zinc-600">
            {hits.length} favourable out of 36 = {(hits.length / 36).toFixed(4)}
          </div>
        </div>

        <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The condition</div>
        {CONDITIONS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setCond(x.id)}
            className={clsx(
              'cursor-pointer rounded-md border px-2.5 py-2 text-left text-[12px] font-semibold',
              x.id === cond
                ? 'border-zinc-950/90 bg-zinc-900 text-white'
                : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
            )}
          >
            {x.name}
          </button>
        ))}

        <PanelNote>
          Two dice give 36 outcomes, not 11. That is the mistake to avoid: a sum of 7 happens six different ways and a
          sum of 12 only one, so the sums are not equally likely — but the 36 squares are.
        </PanelNote>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* Independent vs mutually exclusive                                          */
/* ========================================================================== */

/**
 * The two ideas get confused constantly, so this puts them side by side on the
 * same numbers. You set the overlap, and the panel says which of the two labels
 * currently applies — and shows that they can almost never apply at once.
 */
export function IndependenceLab() {
  const [pa, setPa] = useState(0.5)
  const [pb, setPb] = useState(0.4)
  const [both, setBoth] = useState(0.2)

  const maxBoth = Math.min(pa, pb)
  const minBoth = Math.max(0, pa + pb - 1)
  const clamped = Math.min(maxBoth, Math.max(minBoth, both))
  const product = pa * pb
  const independent = Math.abs(clamped - product) < 0.005
  const exclusive = clamped < 0.005

  const cells = [
    ['both A and B', clamped],
    ['A but not B', pa - clamped],
    ['B but not A', pb - clamped],
    ['neither', 1 - pa - pb + clamped],
  ] as const

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <div className="grid items-start gap-5 rounded-lg border border-zinc-950/10 p-4 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {cells.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-zinc-950/10 bg-white p-3">
              <div className="text-[11.5px] text-zinc-600">{k}</div>
              <div className="font-mono text-[18px] font-semibold text-zinc-950">{pct(v)}</div>
              <div className="mt-1 h-[8px] overflow-hidden rounded-full bg-zinc-950/[0.06]">
                <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: 'var(--acc)' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The two tests</div>
          <div className="flex flex-col gap-2 font-mono text-[12.5px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-[130px] font-sans text-zinc-600">mutually exclusive?</span>
              <span>P(A ∩ B) = 0</span>
              <span className="text-zinc-400">→</span>
              <span style={{ color: exclusive ? TEAL : RED, fontWeight: 700 }}>
                {pct(clamped)} {exclusive ? '— yes' : '— no'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-[130px] font-sans text-zinc-600">independent?</span>
              <span>P(A)·P(B) = {pct(product)}</span>
              <span className="text-zinc-400">vs</span>
              <span style={{ color: independent ? TEAL : RED, fontWeight: 700 }}>
                {pct(clamped)} {independent ? '— yes' : '— no'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[13px]/[1.65] text-zinc-700">
          {exclusive && !independent ? (
            <>
              These are <strong>mutually exclusive</strong> but <strong>not independent</strong>. And that is normal: if
              A happening means B cannot happen, then knowing A tells you a great deal about B. Being exclusive is about
              as dependent as two events get.
            </>
          ) : independent && !exclusive ? (
            <>
              These are <strong>independent</strong> but <strong>not mutually exclusive</strong>. They overlap perfectly
              happily — knowing A happened just does not change how likely B is.
            </>
          ) : independent && exclusive ? (
            <>
              Both at once, which only happens when one of the events is impossible. Set P(A) or P(B) above zero and the
              two labels part company again.
            </>
          ) : (
            <>
              Right now these are <strong>neither</strong>. They overlap, so not exclusive; and the overlap is not
              P(A)·P(B), so knowing one does change the odds of the other.
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        {[
          ['P(A)', pa, setPa, 0.05, 0.9],
          ['P(B)', pb, setPb, 0.05, 0.9],
        ].map(([label, val, set, lo, hi]) => (
          <div key={label as string}>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>{label as string}</span>
              <span className="text-zinc-500">{pct(val as number)}</span>
            </div>
            <RangeInput
              label={label as string}
              min={lo as number}
              max={hi as number}
              step={0.01}
              value={val as number}
              onChange={set as (v: number) => void}
            />
          </div>
        ))}
        <div>
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>P(A ∩ B) — the overlap</span>
            <span className="text-zinc-500">{pct(clamped)}</span>
          </div>
          <RangeInput
            label="overlap"
            min={minBoth}
            max={maxBoth}
            step={0.005}
            value={clamped}
            onChange={setBoth}
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            It cannot go below {pct(minBoth)} or above {pct(maxBoth)} — the four boxes have to stay positive.
          </p>
        </div>
        <PanelButtons>
          <PanelButton primary onClick={() => setBoth(product)}>
            Make them independent
          </PanelButton>
          <PanelButton onClick={() => setBoth(0)}>Make them exclusive</PanelButton>
        </PanelButtons>
        <PanelNote>
          Press each button in turn. They are two completely different conditions, and with P(A) and P(B) both above
          zero you can never satisfy both at the same time.
        </PanelNote>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* Choosing a committee — Example 8                                           */
/* ========================================================================== */

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

/**
 * Example 8 asks for "a majority of women", which means adding up several
 * separate cases. Laying every split out in a row makes it obvious which ones
 * to add, and stops the usual mistake of answering only one of them.
 */
export function CommitteeLab() {
  const [men, setMen] = useState(8)
  const [women, setWomen] = useState(4)
  const [size, setSize] = useState(5)

  const total = choose(men + women, size)
  const rows = []
  for (let w = 0; w <= Math.min(women, size); w++) {
    const m = size - w
    if (m < 0 || m > men) continue
    rows.push({ w, m, ways: choose(women, w) * choose(men, m) })
  }
  const majority = rows.filter((r) => r.w > size / 2)
  const wanted = majority.reduce((s, r) => s + r.ways, 0)

  const g = (a: number, b: number): number => (b ? g(b, a % b) : a)
  const k = g(wanted, total) || 1

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap gap-4">
        {[
          ['Men', men, setMen, 12],
          ['Women', women, setWomen, 12],
          ['Committee size', size, setSize, Math.min(8, men + women)],
        ].map(([label, val, set, max]) => (
          <div key={label as string} className="flex items-center gap-1.5 text-[12.5px]">
            <span className="text-zinc-600">{label as string}</span>
            <button
              type="button"
              onClick={() => (set as (v: number) => void)(Math.max(1, (val as number) - 1))}
              className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
              aria-label={`fewer ${label}`}
            >
              −
            </button>
            <span className="w-5 text-center font-mono font-semibold">{val as number}</span>
            <button
              type="button"
              onClick={() => (set as (v: number) => void)(Math.min(max as number, (val as number) + 1))}
              className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
              aria-label={`more ${label}`}
            >
              +
            </button>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] text-[12.5px]">
          <thead>
            <tr className="border-b border-zinc-950/10 text-left text-zinc-500">
              <th className="py-1.5 pr-3 font-semibold">Split</th>
              <th className="py-1.5 pr-3 font-semibold">Ways to pick it</th>
              <th className="py-1.5 pr-3 font-semibold">Chance</th>
              <th className="py-1.5 font-semibold">Counts?</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((r) => {
              const on = r.w > size / 2
              return (
                <tr
                  key={r.w}
                  className="border-b border-zinc-950/[0.06]"
                  style={on ? { background: 'var(--acc-12)' } : undefined}
                >
                  <td className="py-1.5 pr-3">
                    {r.m}M and {r.w}W
                  </td>
                  <td className="py-1.5 pr-3">
                    C({women},{r.w}) × C({men},{r.m}) = {choose(women, r.w)} × {choose(men, r.m)} = {r.ways}
                  </td>
                  <td className="py-1.5 pr-3">{total ? (r.ways / total).toFixed(4) : '—'}</td>
                  <td className="py-1.5 font-sans" style={{ color: on ? 'var(--acc)' : '#a1a1aa' }}>
                    {on ? 'yes — women in the majority' : 'no'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="font-mono text-[13px]/[1.9] text-zinc-800">
          <div>
            total ways to choose {size} from {men + women} = C({men + women},{size}) = {total}
          </div>
          <div>
            ways with women in the majority = {majority.map((r) => r.ways).join(' + ') || '0'} = {wanted}
          </div>
          <div className="mt-1.5 text-[15px] font-bold">
            P = {wanted}/{total} = {k > 1 ? `${wanted / k}/${total / k} = ` : ''}
            {total ? (wanted / total).toFixed(4) : '—'}
          </div>
        </div>
      </div>

      <PanelNote>
        The lecture&rsquo;s version is 8 men, 4 women, a committee of 5, and the answer is 5/33. Majority means more
        than half, so with 5 seats that is 3 or more women — two separate splits, and you add them because they cannot
        both happen at once.
      </PanelNote>
    </div>
  )
}
