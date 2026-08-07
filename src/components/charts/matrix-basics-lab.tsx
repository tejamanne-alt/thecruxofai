'use client'

import { PanelNote, RangeInput } from '@/components/sessions/session-parts'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
type Grid = number[][]

const sub = (n: number) => '₀₁₂₃₄₅₆₇₈₉'[n] ?? String(n)

/* ========================================================================== */
/* What a matrix is: rows, columns, and the name of each slot                 */
/* ========================================================================== */

export function MatrixShapeLab() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
  const [at, setAt] = useState<{ i: number; j: number } | null>({ i: 1, j: 2 })

  const shapeWord =
    rows === 1 && cols === 1
      ? 'a single number'
      : rows === 1
        ? 'a row vector — one row, laid flat'
        : cols === 1
          ? 'a column vector — one column, standing up'
          : rows === cols
            ? 'a square matrix'
            : 'a rectangular matrix'

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <Stepper label="Rows" value={rows} onChange={setRows} />
        <Stepper label="Columns" value={cols} onChange={setCols} />
        <div className="text-[13px]">
          <span className="text-zinc-600">This one is </span>
          <span className="font-mono font-semibold text-zinc-950">
            {rows} × {cols}
          </span>
          <span className="text-zinc-600"> — {shapeWord}.</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-1">
              {Array.from({ length: cols }, (_, j) => {
                const on = at?.i === i && at?.j === j
                const near = at && (at.i === i || at.j === j)
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setAt({ i, j })}
                    className={clsx(
                      'w-[54px] cursor-pointer rounded px-2 py-2 text-center font-mono text-[13px]',
                      on ? 'font-bold' : near ? '' : 'hover:bg-zinc-950/[0.05]'
                    )}
                    style={
                      on
                        ? { background: 'var(--acc)', color: '#fff' }
                        : near
                          ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                          : undefined
                    }
                  >
                    a{sub(i + 1)}
                    {sub(j + 1)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {at && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 text-[13px]/[1.65] text-zinc-700">
          You clicked{' '}
          <span className="font-mono font-semibold text-zinc-950">
            a{sub(at.i + 1)}
            {sub(at.j + 1)}
          </span>
          . The first number is the <strong>row</strong> and the second is the <strong>column</strong>. So this one is
          in row {at.i + 1}, column {at.j + 1}. Row always comes first — in the name of a slot, and in the shape of the
          whole matrix. That trips up nearly everyone at least once.
        </div>
      )}

      <PanelNote>
        Set the columns to 1. You now have a column vector. Vectors are not a different thing from matrices — they are
        just very thin ones.
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* Adding matrices, and scaling one                                           */
/* ========================================================================== */

export function MatrixAddLab() {
  const [a, setA] = useState<Grid>([
    [1, 4, 2],
    [0, 3, 5],
  ])
  const [b, setB] = useState<Grid>([
    [2, 1, 0],
    [6, 2, 1],
  ])
  const [tall, setTall] = useState(false)
  const [k, setK] = useState(2)

  const fits = !tall
  const sum: Grid = fits ? a.map((r, i) => r.map((v, j) => v + b[i][j])) : []
  const scaled: Grid = a.map((r) => r.map((v) => v * k))

  const bShown: Grid = tall
    ? [
        [2, 1],
        [6, 2],
        [0, 1],
      ]
    : b

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap items-start gap-5">
        <Titled title={`A — 2 × 3`}>
          <Cells
            grid={a}
            onEdit={(i, j, v) => setA(a.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
          />
        </Titled>
        <Sign>+</Sign>
        <Titled title={`B — ${bShown.length} × ${bShown[0].length}`}>
          <Cells
            grid={bShown}
            readOnly={tall}
            onEdit={(i, j, v) => setB(b.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
          />
        </Titled>
        <Sign>=</Sign>
        <Titled title={fits ? 'A + B' : 'cannot be done'}>
          {fits ? (
            <Cells grid={sum} readOnly highlight />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-4 text-[12.5px] text-red-600">
              The shapes are different.
              <br />
              Some numbers have no partner.
            </div>
          )}
        </Titled>
      </div>

      <p className="text-[13px]/[1.65] text-zinc-700">
        {fits
          ? 'Adding is exactly what it looks like: line the two boxes up and add each pair of numbers that sit on top of each other. Change any number in A or B and one number in the answer changes with it.'
          : 'To add two matrices they must be the same shape, because each number needs a partner sitting in the same slot. Here one box is 2 × 3 and the other is 3 × 2, so there is nothing to pair up.'}
      </p>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-[12.5px] text-zinc-700">
        <input type="checkbox" checked={tall} onChange={(e) => setTall(e.target.checked)} className="cursor-pointer" />
        Make B the wrong shape and see what happens
      </label>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Multiplying by a plain number
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-zinc-600">multiply A by</span>
            <RangeInput
              label="scale factor"
              min={-3}
              max={5}
              step={1}
              value={k}
              onChange={setK}
              className="w-[150px]"
            />
            <span className="font-mono font-semibold">{k}</span>
          </div>
          <Cells grid={scaled} readOnly highlight />
        </div>
        <p className="mt-2 text-[13px]/[1.65] text-zinc-700">
          Every single number gets multiplied. Nothing clever happens. Set it to 0 and the whole box goes to zero.
        </p>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* Transpose: tip the box over                                                */
/* ========================================================================== */

export function TransposeLab() {
  const [m, setM] = useState<Grid>([
    [1, 4, 2],
    [0, 3, 5],
  ])
  const [at, setAt] = useState<{ i: number; j: number } | null>({ i: 0, j: 2 })
  const t: Grid = m[0].map((_, j) => m.map((r) => r[j]))

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="flex flex-wrap items-start gap-6">
        <Titled title={`A — ${m.length} × ${m[0].length}`}>
          <Cells
            grid={m}
            onEdit={(i, j, v) => setM(m.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
            onHover={setAt}
            mark={at}
          />
        </Titled>
        <Sign>→</Sign>
        <Titled title={`Aᵀ — ${t.length} × ${t[0].length}`}>
          <Cells
            grid={t}
            readOnly
            onHover={(p) => setAt(p ? { i: p.j, j: p.i } : null)}
            mark={at ? { i: at.j, j: at.i } : null}
          />
        </Titled>
      </div>

      <p className="text-[13px]/[1.65] text-zinc-700">
        The transpose tips the box over. Row 1 becomes column 1, row 2 becomes column 2, and so on. A 2 × 3 box turns
        into a 3 × 2 one. Hover a number and its partner lights up on the other side.
        {at && (
          <>
            {' '}
            The number in row {at.i + 1}, column {at.j + 1} of A sits in row {at.j + 1}, column {at.i + 1} of Aᵀ.
          </>
        )}
      </p>

      <PanelNote>
        Tip it over twice and you are back where you started. That is the rule (Aᵀ)ᵀ = A, and it really is just that
        obvious.
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* The same system, written both ways                                         */
/* ========================================================================== */

export function SystemMatrixLab() {
  const [a, setA] = useState<Grid>([
    [2, 3, 5],
    [4, -2, -7],
    [9, 5, -3],
  ])
  const [b, setB] = useState([1, 8, 2])
  const [row, setRow] = useState<number | null>(0)

  const names = ['x₁', 'x₂', 'x₃']
  const term = (v: number, name: string, first: boolean) => {
    const sign = v < 0 ? '− ' : first ? '' : '+ '
    const mag = Math.abs(v) === 1 ? '' : String(Math.abs(v))
    return `${sign}${mag}${name}`
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="grid items-start gap-5 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Written out in full
          </div>
          <div className="flex flex-col gap-1.5">
            {a.map((r, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setRow(i)}
                onFocus={() => setRow(i)}
                onClick={() => setRow(i)}
                className="cursor-pointer rounded-md px-2 py-1.5 text-left font-mono text-[13px]"
                style={row === i ? { background: 'var(--acc-12)', color: 'var(--acc)' } : undefined}
              >
                {r.map((v, j) => `${term(v, names[j], j === 0)} `).join('')}= {b[i]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The short way: Ax = b
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Cells
              grid={a}
              onEdit={(i, j, v) => setA(a.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
              onHover={(p) => setRow(p ? p.i : null)}
              markRow={row}
            />
            <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2 font-mono text-[13px]">
              {names.map((n) => (
                <span key={n} className="w-[42px] px-2 py-1.5 text-center">
                  {n}
                </span>
              ))}
            </div>
            <Sign>=</Sign>
            <Cells
              grid={b.map((v) => [v])}
              onEdit={(i, _j, v) => setB(b.map((x, k) => (k === i ? v : x)))}
              markRow={row}
            />
          </div>
        </div>
      </div>

      <p className="text-[13px]/[1.65] text-zinc-700">
        These two are the same thing. Hover a row on either side and its partner lights up. <strong>A</strong> holds the
        numbers in front of the unknowns, one row per equation. <strong>x</strong> is the column of unknowns.{' '}
        <strong>b</strong> is what each row has to add up to. Change any number and both sides change together.
      </p>

      <PanelNote>
        Row 1 of A meets the column x, giving {a[0].map((v, j) => `${term(v, names[j], j === 0)} `).join('')}— and that
        has to equal {b[0]}. Which is exactly what the long version says.
      </PanelNote>
    </div>
  )
}

/* ------------------------------------------------------------------ bits */

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px]">
      <span className="text-zinc-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
        aria-label={`fewer ${label}`}
      >
        −
      </button>
      <span className="w-4 text-center font-mono font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(5, value + 1))}
        className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
        aria-label={`more ${label}`}
      >
        +
      </button>
    </div>
  )
}

function Titled({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

function Sign({ children }: { children: React.ReactNode }) {
  return <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">{children}</div>
}

function Cells({
  grid,
  onEdit,
  onHover,
  readOnly,
  highlight,
  mark,
  markRow,
}: {
  grid: Grid
  onEdit?: (i: number, j: number, v: number) => void
  onHover?: (p: { i: number; j: number } | null) => void
  readOnly?: boolean
  highlight?: boolean
  mark?: { i: number; j: number } | null
  markRow?: number | null
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
      {grid.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((v, j) => {
            const on = (mark?.i === i && mark?.j === j) || markRow === i
            const style = on
              ? { background: 'var(--acc-12)', color: 'var(--acc)' }
              : highlight
                ? { color: TEAL }
                : undefined
            return readOnly ? (
              <span
                key={j}
                onMouseEnter={() => onHover?.({ i, j })}
                onMouseLeave={() => onHover?.(null)}
                className={clsx(
                  'w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums',
                  on && 'font-bold'
                )}
                style={style}
              >
                {v}
              </span>
            ) : (
              <input
                key={j}
                value={v}
                onMouseEnter={() => onHover?.({ i, j })}
                onMouseLeave={() => onHover?.(null)}
                onChange={(e) => {
                  const raw = e.target.value
                  const n = raw === '' || raw === '-' ? 0 : Number(raw)
                  if (Number.isFinite(n)) onEdit?.(i, j, n)
                }}
                inputMode="numeric"
                aria-label={`row ${i + 1} column ${j + 1}`}
                className={clsx(
                  'w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none',
                  on ? 'font-bold' : 'hover:bg-zinc-950/[0.04]'
                )}
                style={style}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
