'use client'

/**
 * The bits every Lecture 0a lab draws: a bracketed box of numbers, a label over
 * it, and the odd × or = sign between two of them. Kept in one place because a
 * dozen labs show a matrix and they should all look the same.
 */
import { frStr, type Fr } from '@/lib/model/fraction'
import type { FMat } from '@/lib/model/matrix'
import clsx from 'clsx'

export const TEAL = '#0d9488'
export const RED = '#dc2626'

export type Cell = { i: number; j: number }

export function Titled({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</span>
        {note && <span className="text-[11px] text-zinc-400">{note}</span>}
      </div>
      {children}
    </div>
  )
}

export function Sign({ children }: { children: React.ReactNode }) {
  return <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">{children}</div>
}

/** A read-only box of exact fractions. */
export function FrBox({
  m,
  mark,
  markRow,
  markCol,
  tone,
  width = 54,
}: {
  m: FMat
  mark?: Cell | null
  markRow?: number | null
  markCol?: number | null
  tone?: string
  width?: number
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
      {m.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((v, j) => {
            const on = (mark?.i === i && mark?.j === j) || markRow === i || markCol === j
            return (
              <span
                key={j}
                style={{ width, ...(on ? { background: 'var(--acc-12)', color: 'var(--acc)' } : { color: tone }) }}
                className={clsx('rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums', on && 'font-bold')}
              >
                {frStr(v)}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** A box of whole numbers the reader can type into. */
export function NumBox({
  m,
  onEdit,
  onHover,
  mark,
  markRow,
  markCol,
  readOnly,
  tone,
  width = 54,
  name = 'matrix',
}: {
  m: number[][]
  onEdit?: (i: number, j: number, v: number) => void
  onHover?: (c: Cell | null) => void
  mark?: Cell | null
  markRow?: number | null
  markCol?: number | null
  readOnly?: boolean
  tone?: string
  width?: number
  name?: string
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
      {m.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((v, j) => {
            const on = (mark?.i === i && mark?.j === j) || markRow === i || markCol === j
            const style = on ? { background: 'var(--acc-12)', color: 'var(--acc)', width } : { color: tone, width }
            return readOnly ? (
              <span
                key={j}
                onMouseEnter={() => onHover?.({ i, j })}
                onMouseLeave={() => onHover?.(null)}
                style={style}
                className={clsx('rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums', on && 'font-bold')}
              >
                {v}
              </span>
            ) : (
              <input
                key={j}
                value={v}
                inputMode="numeric"
                aria-label={`${name} row ${i + 1} column ${j + 1}`}
                onMouseEnter={() => onHover?.({ i, j })}
                onMouseLeave={() => onHover?.(null)}
                onChange={(e) => {
                  const raw = e.target.value.trim()
                  const n = raw === '' || raw === '-' ? 0 : Number(raw)
                  if (Number.isFinite(n)) onEdit?.(i, j, n)
                }}
                style={style}
                className={clsx(
                  'rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none',
                  on ? 'font-bold' : 'hover:bg-zinc-950/[0.04]'
                )}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

/**
 * The frame every lab sits in. `data-lab` marks it so a verification run can
 * find the interactive part of a page and tell its controls apart from the
 * page furniture — the tabs and the previous/next links, which are on every
 * part whether or not it has a lab.
 *
 * Twenty labs in the older chapters drew this same frame by hand, so they
 * carried no marker and nothing could scope a check to them. The frame — the
 * border, the radius, the padding — belongs here. `layout` stays at the call
 * site, because whether a lab stacks or splits into chart-and-panel is about
 * that lab, not about being a lab.
 */
export function LabBox({ children, layout }: { children: React.ReactNode; layout?: string }) {
  return (
    <div data-lab className={clsx('rounded-lg border border-zinc-950/10 p-4', layout ?? 'flex flex-col gap-4')}>
      {children}
    </div>
  )
}

export function LabNote({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px]/[1.65] text-zinc-700">{children}</p>
}

/** A yes/no answer with a colour, used wherever a lab passes judgement. */
export function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border px-3.5 py-2.5 text-[13px]/[1.6]"
      style={
        ok
          ? { borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.08)', color: '#115e59' }
          : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#991b1b' }
      }
    >
      <strong className="font-semibold">{ok ? '✓ ' : '✗ '}</strong>
      {children}
    </div>
  )
}

export function Chip({ on, label, onClick }: { on: boolean; label: React.ReactNode; onClick?: () => void }) {
  const cls = 'rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold'
  const style = on
    ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
    : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#71717a' }
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={clsx(cls, 'cursor-pointer hover:bg-zinc-950/[0.04]')}
      style={style}
    >
      {label}
    </button>
  ) : (
    <span className={cls} style={style}>
      {label}
    </span>
  )
}

export function Btn({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-lg px-3 py-2 text-[13px] font-semibold whitespace-nowrap',
        disabled
          ? 'cursor-not-allowed border border-zinc-950/10 bg-zinc-100 text-zinc-400'
          : primary
            ? 'cursor-pointer border border-zinc-950/90 bg-zinc-900 text-white hover:bg-zinc-800'
            : 'cursor-pointer border border-zinc-950/10 bg-white text-zinc-950 hover:bg-zinc-950/[0.04]'
      )}
    >
      {children}
    </button>
  )
}

/** A row of preset buttons — the honest alternative to a slider that cannot reach every case. */
export function Presets<T>({
  items,
  at,
  onPick,
}: {
  items: Array<{ id: T; label: string }>
  at: T
  onPick: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <Chip key={String(it.id)} on={it.id === at} label={it.label} onClick={() => onPick(it.id)} />
      ))}
    </div>
  )
}

export const frTone = (v: Fr) => (v.n === 0 ? '#a1a1aa' : undefined)
