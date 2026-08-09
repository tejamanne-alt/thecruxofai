'use client'

import { LabBox } from '@/components/charts/matrix-ui'
import clsx from 'clsx'
import { useState } from 'react'

/**
 * Matrix multiplication is the one rule everybody is told and nobody is shown.
 * Clicking a cell of the answer lights up the row and the column that made it,
 * and writes out the sum in full. After four clicks the rule explains itself.
 */
const TEAL = '#0d9488'

type Grid = number[][]

const A0: Grid = [
  [1, 0, 2],
  [3, 1, -1],
]
const B0: Grid = [
  [2, 1],
  [0, 4],
  [1, -2],
]

function multiply(a: Grid, b: Grid): Grid {
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)))
}

export function MatrixProductLab() {
  const [a, setA] = useState<Grid>(A0)
  const [b, setB] = useState<Grid>(B0)
  const [sel, setSel] = useState<{ i: number; j: number } | null>({ i: 0, j: 0 })

  const c = multiply(a, b)
  const inner = a[0].length

  const terms = sel ? a[sel.i].map((v, k) => ({ v, w: b[k][sel.j] })) : []
  const total = terms.reduce((s, t) => s + t.v * t.w, 0)

  const edit = (g: Grid, set: (g: Grid) => void, i: number, j: number, raw: string) => {
    const n = raw === '' || raw === '-' ? 0 : Number(raw)
    if (!Number.isFinite(n)) return
    set(g.map((row, ri) => row.map((v, ci) => (ri === i && ci === j ? n : v))))
  }

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Labelled title={`A — ${a.length} rows × ${a[0].length} columns`}>
          <Editable grid={a} onEdit={(i, j, v) => edit(a, setA, i, j, v)} highlightRow={sel?.i ?? null} />
        </Labelled>
        <Labelled title={`B — ${b.length} rows × ${b[0].length} columns`}>
          <Editable grid={b} onEdit={(i, j, v) => edit(b, setB, i, j, v)} highlightCol={sel?.j ?? null} />
        </Labelled>
        <Labelled title={`AB — ${c.length} × ${c[0].length}. Click a number.`}>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {c.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => {
                  const on = sel?.i === i && sel?.j === j
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setSel({ i, j })}
                      className={clsx(
                        'w-[52px] cursor-pointer rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums',
                        on ? 'font-bold' : 'hover:bg-zinc-950/[0.05]'
                      )}
                      style={on ? { background: 'var(--acc-12)', color: 'var(--acc)' } : undefined}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </Labelled>
      </div>

      {sel && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Where that number came from
          </div>
          <p className="mb-2 text-[13px]/[1.6] text-zinc-700">
            Take row {sel.i + 1} of A and column {sel.j + 1} of B. Multiply them together a pair at a time, then add
            everything up.
          </p>
          <div className="overflow-x-auto font-mono text-[13px] whitespace-nowrap text-zinc-800">
            {terms.map((t, k) => (
              <span key={k}>
                {k > 0 && <span className="text-zinc-400"> + </span>}
                <span style={{ color: 'var(--acc)' }}>{t.v}</span>
                <span className="text-zinc-400">×</span>
                <span style={{ color: TEAL }}>{t.w}</span>
              </span>
            ))}
            <span className="text-zinc-400"> = </span>
            <span className="font-bold">{total}</span>
          </div>
        </div>
      )}

      <p className="text-[12.5px]/[1.65] text-zinc-600">
        The row of A and the column of B have to be the same length, or the pairs do not match up and there is nothing
        to add. That is the only shape rule there is. Here both are {inner} long, so AB works.{' '}
        {a.length === b[0].length
          ? 'BA happens to work too, and it gives a different answer — order matters.'
          : `BA does not work at all: a row of B is ${b[0].length} long but a column of A is ${a.length} long.`}
      </p>
    </LabBox>
  )
}

/* ------------------------------------------------------------ 2×2 inverse */

export function InverseExplorer() {
  const [m, setM] = useState<Grid>([
    [2, 1],
    [1, 1],
  ])
  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0]
  const singular = det === 0

  const inv: Grid = singular
    ? [
        [0, 0],
        [0, 0],
      ]
    : [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det],
      ]

  const show = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2))

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Labelled title="A — change any number">
          <Editable
            grid={m}
            onEdit={(i, j, raw) => {
              const n = raw === '' || raw === '-' ? 0 : Number(raw)
              if (!Number.isFinite(n)) return
              setM(m.map((row, ri) => row.map((v, ci) => (ri === i && ci === j ? n : v))))
            }}
          />
        </Labelled>
        <Labelled title={singular ? 'A⁻¹ — does not exist' : 'A⁻¹ — the undo matrix'}>
          {singular ? (
            <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-5 text-[12.5px] text-red-600">
              There isn’t one.
            </div>
          ) : (
            <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2 font-mono text-[13px]">
              {inv.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <span key={j} className="w-[62px] px-2 py-1.5 text-right tabular-nums">
                      {show(v)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Labelled>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="font-mono text-[13px] text-zinc-800">
          determinant = ({m[0][0]} × {m[1][1]}) − ({m[0][1]} × {m[1][0]}) ={' '}
          <span className="font-bold" style={{ color: singular ? '#dc2626' : '#09090b' }}>
            {det}
          </span>
        </div>
        <p className="mt-2 text-[13px]/[1.65] text-zinc-700">
          {singular
            ? 'It came out zero, so there is no inverse. The two columns lie along one line: the matrix squashes the whole plane onto that line, and nothing can un-squash it, because everything on the plane got piled onto the same few points.'
            : 'It is not zero, so an inverse exists. Every number in A⁻¹ is one of A’s own numbers, shuffled and divided by this. That division is why a zero here ruins everything.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip
          onClick={() =>
            setM([
              [2, 1],
              [1, 1],
            ])
          }
        >
          A normal one
        </Chip>
        <Chip
          onClick={() =>
            setM([
              [2, 4],
              [1, 2],
            ])
          }
        >
          Make it break
        </Chip>
        <Chip
          onClick={() =>
            setM([
              [1, 0],
              [0, 1],
            ])
          }
        >
          The do-nothing matrix
        </Chip>
      </div>
    </LabBox>
  )
}

/* ------------------------------------------------------------------ bits */

function Labelled({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

function Editable({
  grid,
  onEdit,
  highlightRow,
  highlightCol,
}: {
  grid: Grid
  onEdit: (i: number, j: number, v: string) => void
  highlightRow?: number | null
  highlightCol?: number | null
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
      {grid.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((v, j) => {
            const on = highlightRow === i || highlightCol === j
            return (
              <input
                key={j}
                value={v}
                onChange={(e) => onEdit(i, j, e.target.value)}
                inputMode="numeric"
                aria-label={`row ${i + 1} column ${j + 1}`}
                className={clsx(
                  'w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none',
                  on ? 'font-bold' : 'hover:bg-zinc-950/[0.04]'
                )}
                style={on ? { background: 'var(--acc-12)', color: 'var(--acc)' } : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-[12px] font-semibold hover:bg-zinc-950/[0.04]"
    >
      {children}
    </button>
  )
}
