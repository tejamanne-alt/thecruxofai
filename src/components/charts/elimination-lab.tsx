'use client'

import { LabBox } from '@/components/charts/matrix-ui'
import { PanelButton, PanelButtons, PanelNote } from '@/components/sessions/session-parts'
import {
  addRow,
  equationsOf,
  leadingCols,
  runToEnd,
  scaleRow,
  startFrom,
  step,
  swapRows,
  verdictOf,
  type ElimState,
} from '@/lib/model/elimination'
import { frParse, frStr } from '@/lib/model/fraction'
import clsx from 'clsx'
import { useState } from 'react'

/** The systems the lecture actually worked through, so the notes match the class. */
const PRESETS = [
  {
    id: 'one',
    name: 'One answer',
    note: 'The lecture’s “modified example”. It settles on x₁ = x₂ = x₃ = 1.',
    names: ['x₁', 'x₂', 'x₃'],
    rows: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [0, 1, 1, 2],
    ],
  },
  {
    id: 'none',
    name: 'No answer',
    note: 'Rows 1 and 2 already add up to something row 3 flatly contradicts.',
    names: ['x₁', 'x₂', 'x₃'],
    rows: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [2, 0, 3, 1],
    ],
  },
  {
    id: 'many',
    name: 'Endless answers',
    note: 'Same as above but row 3 now agrees with rows 1 and 2, so it adds nothing new.',
    names: ['x₁', 'x₂', 'x₃'],
    rows: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [2, 0, 3, 5],
    ],
  },
  {
    id: 'factory',
    name: 'The furniture factory',
    note: 'Four resources, three kits. It comes out at 2 chairs, 3 tables, 1 cabinet.',
    names: ['x₁', 'x₂', 'x₃'],
    rows: [
      [1, 2, 1, 9],
      [2, 1, 1, 8],
      [1, 1, 2, 7],
      [3, 1, 2, 11],
    ],
  },
  {
    id: 'big',
    name: 'The big one from the slides',
    note: 'The five-variable example, with a set to −1 so it holds together. Two variables end up free.',
    names: ['x₁', 'x₂', 'x₃', 'x₄', 'x₅'],
    rows: [
      [-2, 4, -2, -1, 4, -3],
      [4, -8, 3, -3, 1, 2],
      [1, -2, 1, -1, 1, 0],
      [1, -2, 0, -3, 4, -1],
    ],
  },
] as const

export function EliminationLab() {
  const [presetId, setPresetId] = useState<string>('one')
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  const [past, setPast] = useState<ElimState[]>([])
  const [state, setState] = useState<ElimState>(() =>
    startFrom([...preset.rows.map((r) => [...r])], preset.names.length)
  )

  // Manual controls.
  const [ri, setRi] = useState(0)
  const [rj, setRj] = useState(1)
  const [k, setK] = useState('-1')
  const [warn, setWarn] = useState<string | null>(null)

  const rowCount = state.rows.length
  const lead = leadingCols(state)
  const verdict = verdictOf(state)
  const equations = equationsOf(state, [...preset.names])

  function apply(next: ElimState) {
    if (next === state) return
    setPast((p) => [...p, state])
    setState(next)
    setWarn(null)
  }

  function load(id: string) {
    const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]
    setPresetId(id)
    setPast([])
    setState(startFrom([...p.rows.map((r) => [...r])], p.names.length))
    setRi(0)
    setRj(1)
    setWarn(null)
  }

  function undo() {
    setPast((p) => {
      if (!p.length) return p
      setState(p[p.length - 1])
      return p.slice(0, -1)
    })
    setWarn(null)
  }

  const rowOptions = Array.from({ length: rowCount }, (_, i) => i)

  return (
    <LabBox>
      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Pick a system to work on
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => load(p.id)}
              className={clsx(
                'cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] font-semibold',
                p.id === presetId
                  ? 'border-zinc-950/90 bg-zinc-900 text-white'
                  : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12.5px]/[1.6] text-zinc-600">{preset.note}</p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          {/* ------------------------------------------------ the matrix itself */}
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-2.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The augmented matrix
            </div>
            <table className="font-mono text-[13px]">
              <tbody>
                {state.rows.map((row, i) => (
                  <tr key={i}>
                    <td className="pr-3 text-[11px] font-semibold text-zinc-400">R{i + 1}</td>
                    {row.map((v, c) => (
                      <td
                        key={c}
                        className={clsx(
                          'min-w-[46px] px-2 py-1.5 text-right tabular-nums',
                          c === preset.names.length && 'border-l-2 border-zinc-300 pl-3',
                          lead[i] === c && 'rounded font-bold'
                        )}
                        style={lead[i] === c ? { background: 'var(--acc-12)', color: 'var(--acc)' } : undefined}
                      >
                        {frStr(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2.5 text-[11.5px]/[1.6] text-zinc-500">
              The bar separates the numbers in front of the variables from the answers on the right. A highlighted
              number is a <strong>pivot</strong> — the first number in its row that is not zero.
            </p>
          </div>

          {/* --------------------------------------------- what it now says */}
          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Which is the same as saying
            </div>
            <div className="flex flex-col gap-1 font-mono text-[12.5px] text-zinc-800">
              {equations.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
            <p className="mt-2.5 text-[11.5px]/[1.6] text-zinc-500">
              Every button below changes the numbers but never changes which values of x make these true. That is the
              whole trick.
            </p>
          </div>

          {/* --------------------------------------------------- do it yourself */}
          <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Do a move yourself
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="w-[92px] text-zinc-600">Swap two rows</span>
              <RowPick value={ri} onChange={setRi} options={rowOptions} />
              <span className="text-zinc-500">↔</span>
              <RowPick value={rj} onChange={setRj} options={rowOptions} />
              <Go onClick={() => apply(swapRows(state, ri, rj))} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="w-[92px] text-zinc-600">Scale a row</span>
              <RowPick value={ri} onChange={setRi} options={rowOptions} />
              <span className="text-zinc-500">×</span>
              <Num value={k} onChange={setK} />
              <Go
                onClick={() => {
                  const f = frParse(k)
                  if (!f) return setWarn('Type a whole number or a fraction like 1/3.')
                  if (f.n === 0)
                    return setWarn('Multiplying a row by zero wipes out an equation, so it is not allowed.')
                  apply(scaleRow(state, ri, f))
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="w-[92px] text-zinc-600">Add rows</span>
              <RowPick value={ri} onChange={setRi} options={rowOptions} />
              <span className="text-zinc-500">←</span>
              <span className="text-zinc-500">R{ri + 1} +</span>
              <Num value={k} onChange={setK} />
              <span className="text-zinc-500">×</span>
              <RowPick value={rj} onChange={setRj} options={rowOptions} />
              <Go
                onClick={() => {
                  const f = frParse(k)
                  if (!f) return setWarn('Type a whole number or a fraction like 1/3.')
                  if (ri === rj) return setWarn('Pick two different rows for this one.')
                  apply(addRow(state, ri, f, rj))
                }}
              />
            </div>

            {warn && <p className="text-[12px] text-red-600">{warn}</p>}
          </div>
        </div>

        {/* ------------------------------------------------------------ panel */}
        <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Where it stands</div>
            <div
              className="text-[20px] font-semibold tracking-[-0.02em]"
              style={{
                color:
                  verdict.kind === 'none'
                    ? '#dc2626'
                    : verdict.kind === 'many'
                      ? '#0d9488'
                      : verdict.kind === 'unknown'
                        ? '#a1a1aa'
                        : '#09090b',
              }}
            >
              {verdict.headline}
            </div>
            <div className="mt-1 text-[12px]/[1.55] text-zinc-600">{verdict.detail}</div>
            {verdict.freeVars.length > 0 && (
              <div className="mt-2 text-[12px] text-zinc-600">
                Free to pick:{' '}
                <span className="font-mono font-semibold text-zinc-950">
                  {verdict.freeVars.map((c) => preset.names[c]).join(', ')}
                </span>
              </div>
            )}
          </div>

          <PanelButtons>
            <PanelButton primary onClick={() => apply(step(state))}>
              Next step
            </PanelButton>
            <PanelButton onClick={() => apply(runToEnd(state))}>Finish it</PanelButton>
          </PanelButtons>
          <PanelButtons>
            <PanelButton onClick={undo}>Undo</PanelButton>
            <PanelButton onClick={() => load(presetId)}>Start over</PanelButton>
          </PanelButtons>

          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Moves so far ({state.history.length})
            </div>
            {state.history.length === 0 ? (
              <p className="text-[12px] text-zinc-500">Nothing yet. Press “Next step” and watch one row change.</p>
            ) : (
              <ol className="flex max-h-[220px] flex-col gap-1 overflow-y-auto font-mono text-[11.5px] text-zinc-700">
                {state.history.map((h, i) => (
                  <li key={i}>
                    <span className="text-zinc-400">{i + 1}.</span> {h}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="text-xs/[1.55] text-zinc-600">
            {state.phase === 'done'
              ? 'Finished. Every step of the staircase is a 1, and it is the only number that is not zero in its column. You can read the answers straight off.'
              : 'Keep pressing “Next step”. Watch the bottom-left fill with zeros first, then the top-right.'}
          </p>
        </div>
      </div>
    </LabBox>
  )
}

function RowPick({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: number[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="cursor-pointer rounded-md border border-zinc-950/15 bg-white px-1.5 py-1 font-mono text-[12px]"
      aria-label="row"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          R{o + 1}
        </option>
      ))}
    </select>
  )
}

function Num({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-[62px] rounded-md border border-zinc-950/15 bg-white px-1.5 py-1 text-center font-mono text-[12px]"
      aria-label="how much"
    />
  )
}

function Go({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-zinc-950/15 bg-white px-2.5 py-1 text-[12px] font-semibold hover:bg-zinc-950/[0.04]"
    >
      Do it
    </button>
  )
}

/* ========================================================================== */
/* Getting the inverse out of the same method                                 */
/* ========================================================================== */

const INV_START = [
  [2, 1, 1],
  [1, 3, 2],
  [1, 0, 0],
]

/**
 * Put A next to the identity and run the very same procedure. When the left
 * half turns into the identity, the right half has quietly become A inverse.
 * Doing it in one grid is far more convincing than being told it works.
 */
export function InverseByElimination() {
  const [a, setA] = useState<number[][]>(INV_START)
  const n = a.length

  const build = (m: number[][]) =>
    startFrom(
      m.map((row, i) => [...row, ...m.map((_, j) => (i === j ? 1 : 0))]),
      n
    )

  const [state, setState] = useState<ElimState>(() => build(INV_START))
  const det =
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])

  const leftIsIdentity = state.rows.every((row, i) =>
    row.slice(0, n).every((v, j) => frStr(v) === (i === j ? '1' : '0'))
  )

  function edit(i: number, j: number, raw: string) {
    const v = raw === '' || raw === '-' ? 0 : Number(raw)
    if (!Number.isFinite(v)) return
    const next = a.map((row, ri) => row.map((x, ci) => (ri === i && ci === j ? v : x)))
    setA(next)
    setState(build(next))
  }

  return (
    <LabBox>
      <p className="text-[13px]/[1.65] text-zinc-700">
        The left half starts as your matrix A and the right half starts as the identity. Press <strong>Run it</strong>{' '}
        and watch them swap jobs.
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
        <table className="font-mono text-[13px]">
          <tbody>
            {state.rows.map((row, i) => (
              <tr key={i}>
                <td className="pr-3 text-[11px] font-semibold text-zinc-400">R{i + 1}</td>
                {row.map((v, c) => (
                  <td key={c} className={c === n ? 'border-l-2 border-zinc-300 pl-3' : ''}>
                    <span
                      className="inline-block min-w-[50px] rounded px-2 py-1.5 text-right tabular-nums"
                      style={
                        c >= n && leftIsIdentity
                          ? { background: 'rgba(13,148,136,0.14)', color: '#0d9488', fontWeight: 700 }
                          : undefined
                      }
                    >
                      {frStr(v)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex gap-8 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          <span>{leftIsIdentity ? 'now the identity' : 'starts as A'}</span>
          <span>{leftIsIdentity ? 'now A⁻¹' : 'starts as the identity'}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Change A and try again
          </div>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {a.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <input
                    key={j}
                    value={v}
                    onChange={(e) => edit(i, j, e.target.value)}
                    inputMode="numeric"
                    aria-label={`A row ${i + 1} column ${j + 1}`}
                    className="w-[50px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none hover:bg-zinc-950/[0.04]"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <PanelButtons>
            <PanelButton primary onClick={() => setState((s) => runToEnd(s))}>
              Run it
            </PanelButton>
            <PanelButton onClick={() => setState((s) => step(s))}>One step</PanelButton>
            <PanelButton onClick={() => setState(build(a))}>Start over</PanelButton>
          </PanelButtons>
          <div className="text-[12.5px]">
            <span className="text-zinc-600">determinant of A: </span>
            <span className="font-mono font-semibold" style={{ color: det === 0 ? '#dc2626' : '#09090b' }}>
              {det}
            </span>
          </div>
          <p className="max-w-[320px] text-[12.5px]/[1.6] text-zinc-600">
            {det === 0
              ? 'This one is zero, so there is no inverse. Run it anyway: the left half will never turn into the identity, because one column never gets a pivot.'
              : leftIsIdentity
                ? 'The left half is the identity, so the right half is A⁻¹. Multiply it by A on paper and you will get the identity back.'
                : 'Not finished yet. Keep pressing.'}
          </p>
        </div>
      </div>

      <PanelNote>
        Why does this work? Each column of A⁻¹ answers the little system Ax = (one column of the identity). They all
        share the same A, so they need the same row moves — and doing them side by side does all of them at once.
      </PanelNote>
    </LabBox>
  )
}
