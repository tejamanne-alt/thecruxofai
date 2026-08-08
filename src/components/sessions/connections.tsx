import {
  builtOn,
  CONNECTIONS,
  LINK_KINDS,
  resolveAnchor,
  usedLater,
  type LinkKind,
  type ResolvedLink,
} from '@/lib/data/connections'
import { courseOfTopic, type TopicId } from '@/lib/data/curriculum'
import Link from 'next/link'

/**
 * The cross-course links, rendered from `connections.ts`.
 *
 * Both directions come out of the same data, so a page that is leaned on is
 * told about it without anyone editing that page. That is the point: the
 * Lecture 0b dot-product page now says a neuron is one, and nothing in
 * `lec0b/parts.tsx` had to change for it to.
 */

const TONE: Record<LinkKind, { bg: string; fg: string; border: string }> = {
  'builds-on': { bg: 'rgba(79,70,229,0.08)', fg: '#4338ca', border: 'rgba(79,70,229,0.25)' },
  'used-by': { bg: 'rgba(13,148,136,0.08)', fg: '#0f766e', border: 'rgba(13,148,136,0.25)' },
  'same-idea': { bg: 'rgba(217,119,6,0.08)', fg: '#b45309', border: 'rgba(217,119,6,0.25)' },
  contrast: { bg: 'rgba(220,38,38,0.07)', fg: '#b91c1c', border: 'rgba(220,38,38,0.22)' },
}

function LinkCard({ l }: { l: ResolvedLink }) {
  const t = TONE[l.kind]
  return (
    <Link
      href={l.href}
      className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-4 hover:border-zinc-950/30"
    >
      <span className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tracking-[0.05em] uppercase"
          style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
        >
          {l.heading}
        </span>
        <span className="font-mono text-[11.5px] text-zinc-500">{l.carries}</span>
      </span>
      <span className="text-[13.5px] font-semibold text-zinc-950">{l.title}</span>
      <span className="text-[11px] text-zinc-400">{l.where}</span>
      <span className="crux-prose text-[12.5px]/[1.65] text-zinc-600">{l.detail}</span>
    </Link>
  )
}

function Block({ title, blurb, links }: { title: string; blurb: string; links: ResolvedLink[] }) {
  if (links.length === 0) return null
  return (
    <div className="mt-6">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-950">{title}</h2>
      <p className="mt-0.5 mb-3 max-w-[680px] text-[12.5px]/[1.6] text-zinc-500">{blurb}</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {links.map((l) => (
          <LinkCard key={`${l.href}:${l.carries}`} l={l} />
        ))}
      </div>
    </div>
  )
}

/**
 * What this page leans on, and where it turns up again. Rendered on every part
 * page, so no chapter has to remember to carry it.
 */
export function Connections({ topic, part }: { topic: TopicId; part?: string }) {
  const out = builtOn(topic, part)
  const back = usedLater(topic, part)
  if (out.length === 0 && back.length === 0) return null
  return (
    <div className="mt-9 border-t border-zinc-950/[0.08] pt-1">
      <Block
        title="What this page is built on"
        blurb="The pages this one borrows from, and the exact thing it borrows. Nothing here is a see-also — if a page is listed, something on this page came from it."
        links={out}
      />
      <Block
        title="Where this comes back"
        blurb="Later pages that use this idea by name. Worth a look before an exam: it is how you find out whether something you skipped is load-bearing."
        links={back}
      />
    </div>
  )
}

/**
 * The whole web for one chapter, on its front page. A part-by-part list would
 * repeat the pages; grouping by the course being drawn on answers the question
 * a reader actually has — "how much of the maths course does this need?"
 */
export function ConnectionMap({ topic }: { topic: TopicId }) {
  const rows = CONNECTIONS.filter((c) => c.from.topic === topic)
  if (rows.length === 0) return null

  const byCourse = new Map<string, Array<{ from: ResolvedLink | null; to: ResolvedLink | null; c: (typeof rows)[0] }>>()
  for (const c of rows) {
    const course = courseOfTopic(c.to.topic)
    const name = course?.name ?? 'Elsewhere'
    const from = resolveAnchor(c.from)
    const to = resolveAnchor(c.to)
    if (!from || !to) continue
    const list = byCourse.get(name) ?? []
    list.push({
      from: { ...from, kind: c.kind, heading: LINK_KINDS[c.kind].forward, carries: c.carries, detail: c.detail },
      to: { ...to, kind: c.kind, heading: LINK_KINDS[c.kind].forward, carries: c.carries, detail: c.detail },
      c,
    })
    byCourse.set(name, list)
  }

  return (
    <div className="mt-9">
      <h2 className="mb-1.5 text-lg font-semibold tracking-[-0.02em]">What this chapter is standing on</h2>
      <p className="mb-4 max-w-[700px] text-[14px]/[1.6] text-zinc-600">
        Every row is a real dependency, not a topic that happens to sound related: the left column is the page in this
        chapter, the right is the page it borrows from, and the line between them says what is borrowed. The same links
        appear on both pages, and the earlier page is told it is being used.
      </p>
      <div className="flex flex-col gap-5">
        {[...byCourse.entries()].map(([course, list]) => (
          <div key={course}>
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              {course} · {list.length} link{list.length === 1 ? '' : 's'}
            </div>
            <div className="flex flex-col gap-2">
              {list.map(({ from, to, c }, i) => {
                const t = TONE[c.kind]
                return (
                  <div
                    key={i}
                    className="grid gap-2 rounded-lg border border-zinc-950/10 bg-white p-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
                  >
                    <div className="flex flex-col gap-1">
                      <Link
                        href={from?.href ?? '#'}
                        className="text-[13.5px] font-semibold text-zinc-950 hover:underline"
                      >
                        {from?.title}
                      </Link>
                      <span
                        className="w-fit rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tracking-[0.05em] uppercase"
                        style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
                      >
                        {LINK_KINDS[c.kind].forward} · {c.carries}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link href={to?.href ?? '#'} className="text-[13.5px] font-semibold hover:underline">
                        <span style={{ color: 'var(--acc)' }}>→ {to?.title}</span>
                      </Link>
                      <span className="text-[11px] text-zinc-400">{to?.where}</span>
                      <span className="crux-prose text-[12.5px]/[1.6] text-zinc-600">{c.detail}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
