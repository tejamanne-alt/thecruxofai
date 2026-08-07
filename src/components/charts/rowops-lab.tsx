'use client'

import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { fr, frAdd, frIsZero, frMul, frStr, type Fr } from '@/lib/model/fraction'
import {
  cloneM,
  isRef,
  isRref,
  leadOf,
  ncols,
  nrows,
  refOnly,
  rrefOf,
  toFr,
  varName,
  type FMat,
} from '@/lib/model/matrix'
import { useState } from 'react'

/* ------------------------------------------------------------ shared bits */

/** The three legal moves, done to a copy. */
const swap = (m: FMat, i: number, j: number): FMat => {
  const r = cloneM(m)
  const t = r[i]
  r[i] = r[j]
  r[j] = t
  return r
}
const scale = (m: FMat, i: number, k: Fr): FMat =>
  m.map((row, ri) => (ri === i ? row.map((v) => frMul(v, k)) : [...row]))
const combine = (m: FMat, i: number, k: Fr, j: number): FMat =>
  m.map((row, ri) => (ri === i ? row.map((v, c) => frAdd(v, frMul(k, m[j][c]))) : [...row]))

/** Reads an augmented matrix back out as equations, for the "nothing changed" check. */
function describeSolution(m: FMat, vars: number) {
  const { R, pivots, rank } = rrefOf(m, vars)
  const lead = leadOf(R, vars)
  const bad = R.some((row, i) => lead[i] === -1 && !frIsZero(row[vars]))
  if (bad) return { text: 'no answer at all', kind: 'none' as const }
  const free = vars - rank
  if (free > 0) return { text: `endless answers, with ${free} free to choose`, kind: 'many' as const }
  const values = pivots.map((c, i) => `${varName(c)} = ${frStr(R[i][vars])}`)
  return { text: values.join(',  '), kind: 'one' as const }
}

function StepBar({ at, total, onSet }: { at: number; total: number; onSet: (v: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Btn onClick={() => onSet(0)} disabled={at === 0}>
        ⏮ Start
      </Btn>
      <Btn onClick={() => onSet(Math.max(0, at - 1))} disabled={at === 0}>
        ← Back
      </Btn>
      <Btn primary onClick={() => onSet(Math.min(total, at + 1))} disabled={at >= total}>
        Next step →
      </Btn>
      <Btn onClick={() => onSet(total)} disabled={at >= total}>
        Run to the end ⏭
      </Btn>
      <span className="text-[12.5px] text-zinc-500">
        step {at} of {total}
      </span>
    </div>
  )
}

/* ========================================================================== */
/* Part 8 — the three moves, and the one that is not allowed                  */
/* ========================================================================== */

/**
 * A system with one clear answer where the three unknowns take three different
 * values. That matters: the point of this lab is that a legal move leaves the
 * answer alone and an illegal one changes it, and you can only see that if the
 * answer is something you would notice moving.
 */
const START: number[][] = [
  [2, 1, -1, 8],
  [-3, -1, 2, -11],
  [-2, 1, 2, -3],
]

export function RowOpsLab() {
  const [m, setM] = useState<FMat>(toFr(START))
  const [past, setPast] = useState<FMat[]>([])
  const [log, setLog] = useState<string[]>([])
  const [i, setI] = useState(0)
  const [j, setJ] = useState(1)
  const [k, setK] = useState(-1)

  const vars = 3
  const now = describeSolution(m, vars)
  const original = describeSolution(toFr(START), vars)
  const unchanged = now.text === original.text

  function apply(next: FMat, note: string) {
    setPast((p) => [...p, m])
    setLog((l) => [...l, note])
    setM(next)
  }

  const rowPick = (value: number, onChange: (v: number) => void, label: string) => (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
      className="cursor-pointer rounded-md border border-zinc-950/15 bg-white px-2 py-1 font-mono text-[12.5px]"
    >
      {[0, 1, 2].map((r) => (
        <option key={r} value={r}>
          R{r + 1}
        </option>
      ))}
    </select>
  )

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The augmented matrix" note="first three columns are the unknowns">
          <FrBox m={m} />
        </Titled>
        <Titled title="What it says">
          <div className="flex flex-col gap-1 pt-1 font-mono text-[13px]/[1.9] text-zinc-800">
            {m.map((row, r) => (
              <span key={r}>
                {row
                  .slice(0, vars)
                  .map((v, c) =>
                    frIsZero(v)
                      ? ''
                      : `${v.n < 0 ? '− ' : c > 0 ? '+ ' : ''}${Math.abs(v.n) === 1 && v.d === 1 ? '' : frStr(fr(Math.abs(v.n), v.d))}${varName(c)} `
                  )
                  .join('') || '0 '}
                = {frStr(row[vars])}
              </span>
            ))}
          </div>
        </Titled>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Move 1 — swap</span>
          <div className="flex items-center gap-1.5">
            {rowPick(i, setI, 'first row to swap')}
            <span className="text-zinc-400">↔</span>
            {rowPick(j, setJ, 'second row to swap')}
          </div>
          <Btn onClick={() => i !== j && apply(swap(m, i, j), `R${i + 1} ↔ R${j + 1}`)}>Do it</Btn>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Move 2 — multiply a row
          </span>
          <div className="flex items-center gap-1.5 text-[12.5px]">
            {rowPick(i, setI, 'row to multiply')}
            <span className="text-zinc-400">← k ×</span>
            <input
              value={k}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (Number.isFinite(v)) setK(v)
              }}
              aria-label="the number k"
              className="w-12 rounded-md border border-zinc-950/15 px-2 py-1 text-right font-mono text-[12.5px] outline-none"
            />
          </div>
          <Btn onClick={() => k !== 0 && apply(scale(m, i, fr(k)), `R${i + 1} ← ${k} × R${i + 1}`)} disabled={k === 0}>
            {k === 0 ? 'k cannot be 0' : 'Do it'}
          </Btn>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Move 3 — add a multiple
          </span>
          <div className="flex items-center gap-1.5 text-[12.5px] text-zinc-500">
            R{i + 1} ← R{i + 1} + {k} × R{j + 1}
          </div>
          <Btn
            onClick={() => i !== j && apply(combine(m, i, fr(k), j), `R${i + 1} ← R${i + 1} + ${k} × R${j + 1}`)}
            disabled={i === j}
          >
            {i === j ? 'pick two different rows' : 'Do it'}
          </Btn>
        </div>
      </div>

      <Verdict ok={unchanged}>
        {unchanged
          ? `The answer is still ${original.text}. That is the whole point: these three moves rearrange the writing without touching what it means.`
          : `The answer has changed to “${now.text}”. It started as “${original.text}”. Something illegal happened.`}
      </Verdict>

      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            // Swapping two columns is exactly what you may not do, so the lab
            // lets the reader do it and watch the answer move.
            apply(
              m.map((row) => [row[1], row[0], row[2], row[3]]),
              'columns 1 and 2 swapped — not allowed!'
            )
          }}
        >
          Try the illegal one: swap columns 1 and 2
        </Btn>
        <Btn
          onClick={() => {
            const p = past[past.length - 1]
            if (!p) return
            setM(p)
            setPast(past.slice(0, -1))
            setLog(log.slice(0, -1))
          }}
          disabled={past.length === 0}
        >
          Undo
        </Btn>
        <Btn
          onClick={() => {
            setM(toFr(START))
            setPast([])
            setLog([])
          }}
        >
          Reset
        </Btn>
      </div>

      {log.length > 0 && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3 font-mono text-[12.5px]/[1.8] text-zinc-700">
          {log.map((l, n) => (
            <div key={n}>
              {n + 1}. {l}
            </div>
          ))}
        </div>
      )}

      <LabNote>
        Swapping two <strong>rows</strong> just writes the equations in a different order, so nothing can change.
        Swapping two <strong>columns</strong> silently renames your unknowns — column 1 was x₁ and now it is x₂ — so the
        answer you read off at the end is for a different question. Press the illegal button and watch x₁ and x₂ trade
        places in the verdict. That is why the rules say rows only.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 9 — the lecture's own march to row echelon form                       */
/* ========================================================================== */

const REF_START: number[][] = [
  [0, 1, 2, 0, -1],
  [-2, 2, 0, 3, 2],
  [2, 8, 20, 0, 6],
]

/** Exactly the three moves the slide makes, in the slide's order. */
const REF_SCRIPT: Array<{ note: string; why: string; m: number[][] }> = [
  {
    note: 'Swap R1 and R2',
    why: 'The top-left slot is 0, and you cannot use a zero as a pivot. Row 2 starts with −2, so bring it up.',
    m: [
      [-2, 2, 0, 3, 2],
      [0, 1, 2, 0, -1],
      [2, 8, 20, 0, 6],
    ],
  },
  {
    note: 'R3 ← R3 + 1 × R1',
    why: 'Row 3 starts with 2 and row 1 starts with −2. Adding one lot of row 1 knocks that 2 out.',
    m: [
      [-2, 2, 0, 3, 2],
      [0, 1, 2, 0, -1],
      [0, 10, 20, 3, 8],
    ],
  },
  {
    note: 'R3 ← R3 + (−10) × R2',
    why: 'Now clear the 10 under the second pivot. Row 2 has a 1 there, so ten lots of it is what you take off.',
    m: [
      [-2, 2, 0, 3, 2],
      [0, 1, 2, 0, -1],
      [0, 0, 0, 3, 18],
    ],
  },
]

export function EchelonWalkLab() {
  const [at, setAt] = useState(0)
  const frames = [{ note: 'The matrix as given', why: 'Nothing done yet.', m: REF_START }, ...REF_SCRIPT]
  const cur = frames[at]
  const M = toFr(cur.m)
  const lead = leadOf(M)
  const ref = isRef(M)

  return (
    <LabBox>
      <StepBar at={at} total={frames.length - 1} onSet={setAt} />

      <div className="flex flex-wrap items-start gap-6">
        <Titled title={at === 0 ? 'Start' : cur.note}>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {M.map((row, r) => (
              <div key={r} className="flex gap-1">
                {row.map((v, c) => {
                  const isLead = lead[r] === c
                  return (
                    <span
                      key={c}
                      className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                      style={isLead ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                    >
                      {frStr(v)}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </Titled>
        <div className="max-w-[320px] pt-6 text-[13px]/[1.7] text-zinc-700">{cur.why}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {M.map((_, r) => (
          <Chip
            key={r}
            on={lead[r] !== -1}
            label={lead[r] === -1 ? `R${r + 1}: all zeros` : `R${r + 1}: starts in column ${lead[r] + 1}`}
          />
        ))}
      </div>

      <Verdict ok={ref}>
        {ref
          ? `A staircase. Each row starts further right than the one above it, so this is in row echelon form. ${at === frames.length - 1 ? 'Three non-zero rows, so the rank is 3.' : ''}`
          : 'Not a staircase yet. Row 3 still starts in the same column as a row above it, so there is more to do.'}
      </Verdict>

      <LabNote>
        The coloured number in each row is its <strong>leading entry</strong> — the first one that is not zero. Row
        echelon form means one thing only: every leading entry sits strictly further right than the one above it. Watch
        the chips above change as you step forward.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — all the way to reduced row echelon form, and its uniqueness      */
/* ========================================================================== */

const RREF_PRESETS = [
  { id: 'lec', label: 'The REF example', m: REF_START },
  {
    id: 'q2',
    label: 'Practice Q2',
    m: [
      [1, 2, 3, 4],
      [2, 4, 7, 10],
      [1, 2, 4, 6],
    ],
  },
  {
    id: 'q10',
    label: 'Practice Q10',
    m: [
      [1, 2, 3],
      [2, 5, 8],
      [3, 8, 13],
    ],
  },
] as const
type RrefId = (typeof RREF_PRESETS)[number]['id']

export function RrefLab() {
  const [pick, setPick] = useState<RrefId>('lec')
  const [g, setG] = useState<number[][]>(REF_START)
  const [at, setAt] = useState(0)
  const [scrambled, setScrambled] = useState(false)

  // Starting from a different row order is the honest way to show uniqueness:
  // the path is different, the destination is not.
  const base = scrambled ? [...g].reverse() : g
  const A = toFr(base)
  const { R, steps, rank } = rrefOf(A)
  const shown = at === 0 ? A : steps[Math.min(at, steps.length) - 1].R
  const note = at === 0 ? 'as given' : steps[Math.min(at, steps.length) - 1].note

  const ref = refOnly(A)
  const finished = at >= steps.length

  return (
    <LabBox>
      <Presets
        items={RREF_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(RREF_PRESETS.find((p) => p.id === id)!.m as unknown as number[][])
          setAt(0)
        }}
      />

      <div className="flex flex-wrap items-start gap-5">
        <Titled title="Type over anything">
          <NumBox
            m={g}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setAt(0)
              setPick('lec')
            }}
          />
        </Titled>
        <Titled title={`Step ${at}: ${note}`}>
          <FrBox m={shown} />
        </Titled>
      </div>

      <StepBar at={Math.min(at, steps.length)} total={steps.length} onSet={setAt} />

      <label className="flex w-fit cursor-pointer items-center gap-2 text-[12.5px] text-zinc-700">
        <input
          type="checkbox"
          checked={scrambled}
          onChange={(e) => {
            setScrambled(e.target.checked)
            setAt(0)
          }}
          className="cursor-pointer"
        />
        Start from the rows in the opposite order — a completely different path
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Row echelon form (REF)
          </div>
          <FrBox m={ref} />
          <p className="mt-2 text-[12.5px]/[1.6] text-zinc-600">
            Just a staircase. There are many correct REFs for one matrix — it depends which moves you pick.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Reduced row echelon form (RREF)
          </div>
          <FrBox m={R} tone="#0d9488" />
          <p className="mt-2 text-[12.5px]/[1.6] text-zinc-600">
            Every step is a 1, and its whole column is otherwise zero. There is exactly <strong>one</strong> of these
            for any matrix, whichever route you take.
          </p>
        </div>
      </div>

      <Verdict ok={finished ? isRref(shown) : false}>
        {finished
          ? `Finished in ${steps.length} moves. Rank ${rank}. Tick the box above and step through again — the route changes, the last picture does not.`
          : `${steps.length - Math.min(at, steps.length)} move${steps.length - Math.min(at, steps.length) === 1 ? '' : 's'} still to go.`}
      </Verdict>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — rank                                                             */
/* ========================================================================== */

const RANK_PRESETS = [
  {
    id: 'slide24',
    label: 'Slide 24',
    m: [
      [3, 0, 2, 2],
      [-6, 42, 24, 54],
      [21, -21, 0, -15],
    ],
    says: 'The slide works this one to two non-zero rows, so rank A = 2.',
  },
  {
    id: 'slide25',
    label: 'Slide 25 — the 5 × 5',
    m: [
      [1, 2, 1, 3, 1],
      [2, 4, 0, 6, 2],
      [3, 6, 1, 9, 3],
      [1, 1, 0, 2, 1],
      [2, 3, 1, 5, 2],
    ],
    says: 'Five rows, but three of them are repeats in disguise.',
  },
  {
    id: 'slide22',
    label: 'The REF example',
    m: REF_START,
    says: 'Slide 23 counts three non-zero rows here, so rank 3.',
  },
  {
    id: 'full',
    label: 'A full-rank 3 × 3',
    m: [
      [1, 2, 3],
      [0, 4, 5],
      [1, 0, 6],
    ],
    says: 'Nothing repeats, so every row survives and the rank is as big as it can be.',
  },
] as const
type RankId = (typeof RANK_PRESETS)[number]['id']

export function RankLab() {
  const [pick, setPick] = useState<RankId>('slide24')
  const [g, setG] = useState<number[][]>(RANK_PRESETS[0].m as unknown as number[][])

  const A = toFr(g)
  const ref = refOnly(A)
  const lead = leadOf(ref)
  const rank = lead.filter((c) => c !== -1).length
  const meta = RANK_PRESETS.find((p) => p.id === pick)
  const full = Math.min(nrows(A), ncols(A))

  return (
    <LabBox>
      <Presets
        items={RANK_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(RANK_PRESETS.find((p) => p.id === id)!.m as unknown as number[][])
        }}
      />

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title="A" note="type over anything">
          <NumBox
            m={g}
            width={48}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setPick('slide24')
            }}
          />
        </Titled>
        <Titled title="Row echelon form">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {ref.map((row, r) => (
              <div key={r} className="flex gap-1" style={{ opacity: lead[r] === -1 ? 0.35 : 1 }}>
                {row.map((v, c) => (
                  <span
                    key={c}
                    className="w-[48px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                    style={lead[r] === c ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                  >
                    {frStr(v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">rank A</div>
            <div className="text-[32px] font-semibold" style={{ color: 'var(--acc)' }}>
              {rank}
            </div>
            <div className="text-[12px] text-zinc-500">
              {rank === full ? 'as big as it can be' : `${full - rank} row${full - rank === 1 ? '' : 's'} went to zero`}
            </div>
          </div>
        </div>
      </div>

      <LabNote>
        Rank is a count: how many rows are still alive once you have tidied up. The faded rows above collapsed to all
        zeros, which means they were saying nothing the other rows had not already said.{' '}
        {meta ? meta.says : 'Change a number and watch the count move.'}
      </LabNote>

      <LabNote>
        A useful thing to try: take any preset and make row 2 an exact copy of row 1. The rank drops by one every time.
        That is the whole idea — <strong>rank counts genuinely different rows</strong>, not rows on the page.
      </LabNote>
    </LabBox>
  )
}
