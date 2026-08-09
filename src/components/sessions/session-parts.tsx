'use client'

import type { TopicId } from '@/lib/data/curriculum'
import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'
import { Connections } from './connections'

/* ---------------------------------------------------------------- headings */

export function SessionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: React.ReactNode }) {
  return (
    <>
      <p className="mb-1.5 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">{eyebrow}</p>
      <h1 className="mb-2.5 text-[28px]/[1.2] font-semibold tracking-[-0.02em] text-zinc-950">{title}</h1>
      <p className="crux-prose mb-5 max-w-[660px] text-[15px]/[1.6] text-zinc-700">{intro}</p>
    </>
  )
}

/* ------------------------------------------------------- the analogy block */

/**
 * Every session leads with the concrete story before any symbol appears. The
 * three-column grid maps each control on the chart to something in the story.
 */
export function AnalogyCallout({
  paragraphs,
  mappings,
  footnote,
}: {
  paragraphs: React.ReactNode[]
  mappings: Array<{ title: string; body: string }>
  footnote: string
}) {
  return (
    <div className="mb-7 flex max-w-[780px] flex-col gap-3 rounded-lg border border-l-[3px] border-zinc-950/10 border-l-zinc-900 bg-zinc-50 px-[22px] py-5">
      <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        The story behind this chart
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="crux-prose text-[14px]/[1.65] text-zinc-800">
          {p}
        </p>
      ))}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 border-t border-zinc-950/[0.08] pt-3">
        {mappings.map((m) => (
          <div key={m.title}>
            <div className="text-[13px] font-semibold text-zinc-950">{m.title}</div>
            <div className="text-[12.5px]/[1.55] text-zinc-600">{m.body}</div>
          </div>
        ))}
      </div>
      <p className="text-[12.5px]/[1.6] text-zinc-500">{footnote}</p>
    </div>
  )
}

/* -------------------------------------------------------- chart + controls */

/**
 * A chart with its read-out panel beside it. The other lab root, alongside
 * `LabBox` — the older chapters were built on this one and never went through
 * `LabBox` at all, which is why they carried no `data-lab` and a check could
 * not tell their controls from the tabs and the previous/next links.
 *
 * The marker goes here rather than the layout being changed to sit inside a
 * `LabBox`: that would wrap a second border and 16px of padding around every
 * chart on six chapters, which is a redesign, not a fix.
 */
export function ChartRow({ chart, panel }: { chart: React.ReactNode; panel: React.ReactNode }) {
  return (
    <div data-lab className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      {chart}
      <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">{panel}</div>
    </div>
  )
}

/**
 * The one range input on the site.
 *
 * The grey bar and the filled part are real elements underneath a transparent
 * input, rather than a background painted on the browser's own track. See the
 * note in `tailwind.css` for why: the pseudo-element version rendered no bar at
 * all in Edge. Going through here also means no call site works out its own
 * percentage, so the fill can never disagree with the value.
 */
export function RangeInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = 'w-full',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  className?: string
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <span className={clsx('crux-range', className)}>
      <span className="crux-range-track" aria-hidden="true">
        <span className="crux-range-fill" style={{ width: `${clamp01(pct)}%` }} />
      </span>
      <input
        type="range"
        className="crux-range-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
      />
    </span>
  )
}

/** A value dragged past its own range would otherwise overflow the track. */
function clamp01(pct: number) {
  return pct < 0 ? 0 : pct > 100 ? 100 : pct
}

export function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  hint,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  hint: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
        <span>{label}</span>
        <span className="text-zinc-500">{display}</span>
      </div>
      <RangeInput label={label} value={value} min={min} max={max} step={step} onChange={onChange} />
      <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
    </div>
  )
}

/** A big live number in a white well — the panel read-out. */
export function ReadOut({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
      <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{label}</div>
      <div className="text-[26px] font-semibold tracking-[-0.02em]" style={{ color: tone ?? '#09090b' }}>
        {value}
      </div>
      {note && <div className="text-xs text-zinc-500">{note}</div>}
    </div>
  )
}

/** A compact grid of small read-outs, for the panels that show four at once. */
export function ReadOutGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-zinc-950/10 bg-white p-2.5">
          <div className="text-[10.5px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">{it.label}</div>
          <div className="font-mono text-[15px] font-semibold text-zinc-950">{it.value}</div>
        </div>
      ))}
    </div>
  )
}

export function PanelNote({ children }: { children: React.ReactNode }) {
  return <p className="text-xs/[1.55] text-zinc-600">{children}</p>
}

export function PanelButtons({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

export function PanelButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex-1 cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap',
        primary
          ? 'border border-zinc-950/90 bg-zinc-900 text-white hover:bg-zinc-800'
          : 'border border-zinc-950/10 bg-white text-zinc-950 hover:bg-zinc-950/[0.04]'
      )}
    >
      {children}
    </button>
  )
}

/* --------------------------------------------------- expandable sub-sections */

export interface SubSectionItem {
  id: string
  /** What this part is called. Keep it short and plain. */
  title: string
  /** One line, shown even when the section is shut, so you can find things fast. */
  teaser: string
  /** Which slides in the lecture this came from. */
  slides?: string
  body: React.ReactNode
}

/**
 * A chapter is long, so it opens as a list of shut drawers with the first one
 * open. You read one part, shut it, open the next. Before an exam you can open
 * them all and scroll.
 */
export function SubSections({ items }: { items: SubSectionItem[] }) {
  const [open, setOpen] = useState<string[]>(items.length ? [items[0].id] : [])

  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))

  return (
    <div className="mt-7 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">What the lecture covered, part by part</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(items.map((i) => i.id))}
            className="cursor-pointer rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-[12px] font-semibold hover:bg-zinc-950/[0.04]"
          >
            Open all
          </button>
          <button
            type="button"
            onClick={() => setOpen([])}
            className="cursor-pointer rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-[12px] font-semibold hover:bg-zinc-950/[0.04]"
          >
            Shut all
          </button>
        </div>
      </div>

      {items.map((it, i) => {
        const isOpen = open.includes(it.id)
        return (
          <div key={it.id} className="overflow-hidden rounded-lg border border-zinc-950/10 bg-white">
            <button
              type="button"
              onClick={() => toggle(it.id)}
              aria-expanded={isOpen}
              aria-controls={`sub-${it.id}`}
              className="flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left hover:bg-zinc-950/[0.02]"
            >
              <span
                className="mt-px flex size-6 shrink-0 items-center justify-center rounded-md text-[12px] font-semibold"
                style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
              >
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[14.5px] font-semibold text-zinc-950">{it.title}</span>
                  {it.slides && <span className="text-[11px] text-zinc-400">{it.slides}</span>}
                </span>
                <span className="text-[12.5px]/[1.5] text-zinc-600">{it.teaser}</span>
              </span>
              {/* A CSS triangle, so the site still ships no icon library. */}
              <span
                className={clsx(
                  'mt-1.5 size-0 shrink-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-zinc-400 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div id={`sub-${it.id}`} className="border-t border-zinc-950/[0.08] px-4 py-4">
                {it.body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * One part of a chapter, on its own page. The header says where you are in the
 * lecture, and the footer moves you on — a chapter read start to finish should
 * never need the left menu.
 */
export function PartShell({
  topic,
  part,
  chapter,
  chapterHref,
  title,
  teaser,
  slides,
  index,
  total,
  prev,
  next,
  children,
}: {
  /** Which page this is, so the cross-course links can be looked up. */
  topic: TopicId
  part: string
  chapter: string
  chapterHref: string
  title: string
  teaser: string
  slides?: string
  index: number
  total: number
  prev?: { href: string; title: string }
  next?: { href: string; title: string }
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        <a href={chapterHref} className="font-semibold tracking-[0.06em] text-zinc-500 uppercase hover:text-zinc-800">
          {chapter}
        </a>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-500">
          Part {index} of {total}
        </span>
        {slides && <span className="text-zinc-400">· {slides}</span>}
      </div>

      <h1 className="mb-2.5 text-[28px]/[1.2] font-semibold tracking-[-0.02em] text-zinc-950">{title}</h1>
      <p className="crux-prose mb-6 max-w-[660px] text-[15px]/[1.6] text-zinc-700">{teaser}</p>

      {children}

      {/*
       * Driven entirely by connections.ts, so an older lecture is told it is
       * being used by a later one without its own file changing.
       */}
      <Connections topic={topic} part={part} />

      <div className="mt-10 grid gap-3 border-t border-zinc-950/[0.08] pt-5 sm:grid-cols-2">
        {prev ? (
          <a
            href={prev.href}
            className="flex flex-col gap-1 rounded-lg border border-zinc-950/10 bg-white p-4 hover:border-zinc-950/25"
          >
            <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">← Before this</span>
            <span className="text-[14px] font-semibold text-zinc-950">{prev.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a
            href={next.href}
            className="flex flex-col gap-1 rounded-lg border border-zinc-950/10 bg-white p-4 text-right hover:border-zinc-950/25"
          >
            <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--acc)' }}>
              Next →
            </span>
            <span className="text-[14px] font-semibold text-zinc-950">{next.title}</span>
          </a>
        )}
      </div>
    </div>
  )
}

/** Plain paragraphs inside a sub-section. */
export function Para({ children }: { children: React.ReactNode }) {
  return <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700 last:mb-0">{children}</p>
}

/**
 * The words that make a lecture hard to follow. Each one gets a plain meaning
 * and, where it helps, how to say it out loud.
 */
export function Terms({ items }: { items: Array<{ term: string; say?: string; def: React.ReactNode }> }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Words used here</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2">
        {items.map((t) => (
          <div key={t.term} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-[13px] font-semibold text-zinc-950">{t.term}</span>
              {t.say && <span className="text-[11px] text-zinc-500">say “{t.say}”</span>}
            </div>
            <div className="mt-1 text-[12.5px]/[1.6] text-zinc-600">{t.def}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A worked example, kept visually apart from the explaining around it. */
export function Worked({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.8] whitespace-pre text-zinc-800">
        {children}
      </div>
    </div>
  )
}

/**
 * What the idea on this page is actually for, once you stop doing maths and
 * start training something. Every part carries one: this is a course in maths
 * *for* machine learning, and the connection is the reason any of it is being
 * learnt. `method` names the thing that uses it — a loss, a kernel, a layer —
 * so the link is concrete rather than a vague gesture at "used in AI".
 */
export function WhyAiml({ method, children }: { method: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-lg border border-teal-600/25 bg-teal-50/60 p-4">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-teal-800 uppercase">
          Why machine learning cares
        </span>
        <span className="font-mono text-[11.5px] text-teal-700">{method}</span>
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-800">{children}</div>
    </div>
  )
}

/** The one thing to remember from a sub-section. */
export function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-4 rounded-lg border border-l-[3px] border-zinc-950/10 px-4 py-3 text-[13px]/[1.65] text-zinc-800"
      style={{ borderLeftColor: 'var(--acc)', background: 'var(--acc-12)' }}
    >
      <strong className="font-semibold">Worth remembering: </strong>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------- explainers */

export function Explainers({
  plain,
  breaks,
  children,
}: {
  plain: React.ReactNode
  breaks: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-[18px]">
        <h3 className="mb-1.5 text-sm font-semibold">In plain English</h3>
        <p className="text-[13px]/[1.6] text-zinc-700">{plain}</p>
      </div>
      <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-[18px]">
        <h3 className="mb-1.5 text-sm font-semibold">Where it breaks</h3>
        <p className="text-[13px]/[1.6] text-zinc-700">{breaks}</p>
      </div>
      {children}
    </div>
  )
}

/* -------------------------------------------------------- the maths block */

export interface LegendEntry {
  sym: React.ReactNode
  name: string
  note: string
  /** Live — recomputed from the chart state on every render. */
  val: string
}

export function MathBlock({
  intro,
  formulas,
  legend,
}: {
  intro: string
  formulas: Array<{ formula: React.ReactNode; reading: React.ReactNode }>
  legend: LegendEntry[]
}) {
  return (
    <div className="col-span-full rounded-lg border border-zinc-950 bg-zinc-950 p-5 text-zinc-50">
      <h3 className="mb-1 text-sm font-semibold">The math, symbol by symbol</h3>
      <p className="mb-3.5 text-xs/[1.6] text-zinc-400">{intro}</p>

      <div className="mb-[18px] flex flex-col gap-2">
        {formulas.map((f, i) => (
          <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-3">
            <div className="overflow-x-auto font-mono text-[15px] text-zinc-50">{f.formula}</div>
            <div className="mt-1 text-xs/[1.55] text-zinc-400">{f.reading}</div>
          </div>
        ))}
      </div>

      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Legend</div>
      {/* 1px gaps over a zinc-800 background fake the hairlines between cells. */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
        {legend.map((l, i) => (
          <div key={i} className="flex gap-3 bg-zinc-950 px-[13px] py-[11px]">
            <span className="w-11 shrink-0 font-mono text-sm text-zinc-50">{l.sym}</span>
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="text-[12.5px]/[1.5] text-zinc-200">{l.name}</span>
              <span className="text-[11.5px]/[1.5] text-zinc-400">{l.note}</span>
              <span className="font-mono text-[11.5px]" style={{ color: 'var(--acc)' }}>
                {l.val}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
