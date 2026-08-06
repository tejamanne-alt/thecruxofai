'use client'

import { PanelButton, PanelButtons, PanelNote } from '@/components/sessions/session-parts'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'

/* ========================================================================== */
/* Spot the pivots                                                            */
/* ========================================================================== */

const PUZZLES = [
  {
    id: 'a',
    name: 'A tidy one',
    vars: ['x₁', 'x₂', 'x₃', 'x₄'],
    rows: [
      [1, -2, 1, -1, 0],
      [0, 0, 1, -1, -2],
      [0, 0, 0, 1, 1],
    ],
    echelon: true,
  },
  {
    id: 'b',
    name: 'A messy one',
    vars: ['x₁', 'x₂', 'x₃'],
    rows: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [0, 1, 1, 2],
    ],
    echelon: false,
  },
  {
    id: 'c',
    name: 'One with a dead row',
    vars: ['x₁', 'x₂', 'x₃', 'x₄'],
    rows: [
      [1, 3, 0, 2, 5],
      [0, 0, 1, 4, 1],
      [0, 0, 0, 0, 0],
    ],
    echelon: true,
  },
] as const

/** The first number in each row that is not zero — the real pivots. */
function leadsOf(rows: readonly (readonly number[])[], vars: number) {
  return rows.map((r) => {
    for (let c = 0; c < vars; c++) if (r[c] !== 0) return c
    return -1
  })
}

function isEchelon(rows: readonly (readonly number[])[], vars: number) {
  const lead = leadsOf(rows, vars)
  let prev = -1
  let seenZero = false
  for (const c of lead) {
    if (c === -1) {
      seenZero = true
      continue
    }
    if (seenZero || c <= prev) return false
    prev = c
  }
  return true
}

/**
 * Pivots are easy to define and easy to get wrong, so the reader clicks the
 * ones they think are pivots and finds out at once. Being told "the first
 * non-zero in the row" does far less than picking three and getting one wrong.
 */
export function PivotLab() {
  const [id, setId] = useState<string>('a')
  const puzzle = PUZZLES.find((p) => p.id === id) ?? PUZZLES[0]
  const [picked, setPicked] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const vars = puzzle.vars.length
  const lead = leadsOf(puzzle.rows, vars)
  const truth = lead.map((c, i) => (c === -1 ? null : `${i},${c}`)).filter(Boolean) as string[]

  const right = picked.filter((p) => truth.includes(p))
  const wrong = picked.filter((p) => !truth.includes(p))
  const missed = truth.filter((t) => !picked.includes(t))
  const perfect = wrong.length === 0 && missed.length === 0

  const pivotCols = truth.map((t) => Number(t.split(',')[1]))
  const freeCols = Array.from({ length: vars }, (_, c) => c).filter((c) => !pivotCols.includes(c))

  function load(next: string) {
    setId(next)
    setPicked([])
    setChecked(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap gap-2">
        {PUZZLES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => load(p.id)}
            className={clsx(
              'cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] font-semibold',
              p.id === id
                ? 'border-zinc-950/90 bg-zinc-900 text-white'
                : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="text-[13px]/[1.65] text-zinc-700">
        Click every number you think is a <strong>pivot</strong> — the first number in its row that is not zero. Then
        press Check.
      </p>

      <div className="overflow-x-auto">
        <table className="font-mono text-[13px]">
          <tbody>
            {puzzle.rows.map((row, i) => (
              <tr key={i}>
                <td className="pr-3 text-[11px] font-semibold text-zinc-400">R{i + 1}</td>
                {row.map((v, c) => {
                  const key = `${i},${c}`
                  const isPicked = picked.includes(key)
                  const isTruth = truth.includes(key)
                  let style: React.CSSProperties | undefined
                  if (checked) {
                    if (isPicked && isTruth) style = { background: 'rgba(13,148,136,0.18)', color: TEAL }
                    else if (isPicked) style = { background: 'rgba(220,38,38,0.14)', color: RED }
                    else if (isTruth) style = { outline: `2px dashed ${TEAL}` }
                  } else if (isPicked) {
                    style = { background: 'var(--acc-12)', color: 'var(--acc)' }
                  }
                  return (
                    <td key={c} className={c === vars ? 'border-l-2 border-zinc-300 pl-3' : ''}>
                      <button
                        type="button"
                        disabled={c === vars}
                        onClick={() => setPicked((p) => (p.includes(key) ? p.filter((q) => q !== key) : [...p, key]))}
                        className={clsx(
                          'min-w-[44px] rounded px-2 py-1.5 text-right tabular-nums',
                          c === vars ? 'text-zinc-400' : 'cursor-pointer hover:bg-zinc-950/[0.05]'
                        )}
                        style={style}
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

      <PanelButtons>
        <PanelButton primary onClick={() => setChecked(true)}>
          Check my picks
        </PanelButton>
        <PanelButton onClick={() => load(id)}>Clear</PanelButton>
      </PanelButtons>

      {checked && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 text-[13px]/[1.65]">
          <div className="mb-1 font-semibold" style={{ color: perfect ? TEAL : RED }}>
            {perfect ? 'All correct.' : `${right.length} right, ${wrong.length} wrong, ${missed.length} missed.`}
          </div>
          {!isEchelon(puzzle.rows, vars) ? (
            <p className="text-zinc-700">
              This one is not in staircase shape yet — two rows start in the same column. So counting pivots here tells
              you nothing about how many answers there are. You have to tidy it up first.
            </p>
          ) : (
            <p className="text-zinc-700">
              This one is a proper staircase, so the pivots do mean something. Columns{' '}
              <span className="font-mono font-semibold">{pivotCols.map((c) => puzzle.vars[c]).join(', ')}</span> have a
              pivot, so those unknowns are <strong>forced</strong>.{' '}
              {freeCols.length === 0 ? (
                <>Nothing is left over, so there is exactly one answer.</>
              ) : (
                <>
                  <span className="font-mono font-semibold">{freeCols.map((c) => puzzle.vars[c]).join(', ')}</span>{' '}
                  {freeCols.length === 1 ? 'has' : 'have'} no pivot, so you get to pick{' '}
                  {freeCols.length === 1 ? 'it' : 'them'} — which means endless answers.
                </>
              )}
            </p>
          )}
        </div>
      )}

      <PanelNote>
        A row of all zeros has no pivot at all. That is fine — it just means that equation repeated something the others
        already said.
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* Reading the zero-recipes off a tidy matrix                                 */
/* ========================================================================== */

const RREF = [
  [1, 3, 0, 0, 3],
  [0, 0, 1, 0, 9],
  [0, 0, 0, 1, -4],
]
const RREF_PIVOTS = [0, 2, 3]
const RREF_FREE = [1, 4]

/**
 * The last step of the lecture: once the matrix is fully tidy, each column that
 * has no pivot hands you a recipe that adds up to nothing. Clicking the column
 * and watching the recipe assemble beats staring at the finished vector.
 */
export function NullspaceLab() {
  const [col, setCol] = useState<number | null>(1)

  // Every free column is a mix of the pivot columns to its left.
  const recipeFor = (free: number) => {
    const r = Array(5).fill(0)
    RREF_PIVOTS.forEach((pc, k) => {
      if (pc < free) r[pc] = RREF[k][free]
    })
    r[free] = -1
    return r
  }

  const recipe = col === null ? null : recipeFor(col)
  const check = recipe ? RREF.map((row) => row.reduce((s, v, j) => s + v * recipe[j], 0)) : null

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <p className="text-[13px]/[1.65] text-zinc-700">
        This matrix is as tidy as it gets: every pivot is a 1, and it is the only number that is not zero in its column.
        Click one of the two <strong>orange</strong> columns — the ones with no pivot.
      </p>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="flex gap-1 pl-7">
            {[0, 1, 2, 3, 4].map((c) => {
              const free = RREF_FREE.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!free}
                  onClick={() => setCol(c)}
                  className={clsx(
                    'w-[54px] rounded px-2 py-1 text-center text-[10.5px] font-semibold tracking-[0.04em] uppercase',
                    free ? 'cursor-pointer' : 'text-zinc-400'
                  )}
                  style={
                    free
                      ? {
                          color: col === c ? '#fff' : '#d97706',
                          background: col === c ? '#d97706' : 'rgba(217,119,6,0.12)',
                        }
                      : undefined
                  }
                >
                  {free ? 'free' : 'pivot'}
                </button>
              )
            })}
          </div>
          {RREF.map((row, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-6 text-[11px] font-semibold text-zinc-400">R{i + 1}</span>
              {row.map((v, c) => (
                <span
                  key={c}
                  className={clsx(
                    'w-[54px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums',
                    RREF_PIVOTS[i] === c && 'font-bold'
                  )}
                  style={
                    col === c
                      ? { background: 'rgba(217,119,6,0.18)' }
                      : RREF_PIVOTS[i] === c
                        ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                        : undefined
                  }
                >
                  {v}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {recipe && col !== null && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The recipe that adds up to nothing
          </div>
          <p className="mb-2 text-[13px]/[1.65] text-zinc-700">
            Column {col + 1} is made out of the pivot columns to its left. So take that much of each of them, then take
            one whole column {col + 1} away. Everything cancels.
          </p>
          <div className="overflow-x-auto font-mono text-[13px] whitespace-nowrap">
            {recipe.map((v, j) =>
              v === 0 ? null : (
                <span key={j}>
                  {v > 0 ? ' + ' : ' − '}
                  {Math.abs(v)} × c{j + 1}
                </span>
              )
            )}
            <span className="text-zinc-400"> = 0</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[12.5px]">
            <span className="text-zinc-600">As a column:</span>
            <span className="font-mono font-semibold">({recipe.join(', ')})</span>
            <span className="text-zinc-600">Check A × that =</span>
            <span className="font-mono font-semibold" style={{ color: check!.every((v) => v === 0) ? TEAL : RED }}>
              ({check!.join(', ')})
            </span>
          </div>
        </div>
      )}

      <PanelNote>
        One free column, one recipe. Two free columns, two recipes. Add any amount of them to an answer you already
        have, and you land on another answer.
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* The shape of the whole method                                              */
/* ========================================================================== */

const STAGES = [
  {
    label: 'Where you start',
    note: 'A full box of numbers. Nothing is zero yet.',
    zeros: [] as string[],
    ones: [] as string[],
  },
  {
    label: 'Clear under the first pivot',
    note: 'Use row 1 to knock out everything below it in column 1.',
    zeros: ['1,0', '2,0'],
    ones: [],
  },
  {
    label: 'Clear under the second pivot',
    note: 'Now use row 2 on column 2. The bottom-left corner is empty.',
    zeros: ['1,0', '2,0', '2,1'],
    ones: [],
  },
  {
    label: 'Now go back upwards',
    note: 'Use the last row to clear its column above, then the next one up.',
    zeros: ['1,0', '2,0', '2,1', '0,2', '1,2', '0,1'],
    ones: [],
  },
  {
    label: 'Scale the pivots to 1',
    note: 'Only the diagonal is left. Divide each row by its pivot and you have the identity.',
    zeros: ['1,0', '2,0', '2,1', '0,2', '1,2', '0,1'],
    ones: ['0,0', '1,1', '2,2'],
  },
]

/** A schematic of the two sweeps. No arithmetic — just where the zeros appear. */
export function SweepLab() {
  const [stage, setStage] = useState(0)
  const s = STAGES[stage]

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <PanelButtons>
          <PanelButton primary onClick={() => setStage((v) => Math.min(STAGES.length - 1, v + 1))}>
            Next stage
          </PanelButton>
          <PanelButton onClick={() => setStage(0)}>Back to the start</PanelButton>
        </PanelButtons>
        <span className="text-[12px] text-zinc-500">
          Stage {stage + 1} of {STAGES.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-1">
              {[0, 1, 2].map((j) => {
                const key = `${i},${j}`
                const zero = s.zeros.includes(key)
                const one = s.ones.includes(key)
                const pivot = i === j
                return (
                  <span
                    key={j}
                    className="grid size-[46px] place-items-center rounded font-mono text-[14px] transition-colors duration-200"
                    style={
                      zero
                        ? { background: 'rgba(9,9,11,0.05)', color: '#a1a1aa' }
                        : one
                          ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 }
                          : pivot
                            ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                            : { background: 'rgba(13,148,136,0.12)', color: TEAL }
                    }
                  >
                    {zero ? '0' : one ? '1' : pivot ? '◆' : '•'}
                  </span>
                )
              })}
            </div>
          ))}
        </div>

        <div className="max-w-[360px]">
          <div className="text-[14px] font-semibold text-zinc-950">{s.label}</div>
          <p className="mt-1 text-[13px]/[1.65] text-zinc-700">{s.note}</p>
        </div>
      </div>

      <PanelNote>
        Every one of those moves is one of the three legal ones. So the answers were never at risk at any point — that
        is the whole reason this method is allowed to work.
      </PanelNote>
    </div>
  )
}
