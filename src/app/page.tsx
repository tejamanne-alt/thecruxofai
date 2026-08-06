import { PageHeader } from '@/components/ui/page-header'
import { courseOfTopic, sessions } from '@/lib/data/curriculum'
import { howToUse, semCards } from '@/lib/data/programme'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Weekend session log · M.Tech AIML"
        title="Machine learning, one knob at a time"
        large
        intro="Notes from a four-semester M.Tech in AI & ML, turned into things you can drag. The left menu follows the real course list — 12 courses across three semesters, then a dissertation. Every class I sit in becomes a page you can play with."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {semCards.map((c) => (
          <Link
            key={c.group}
            href={`/curriculum#${c.group}`}
            className="flex flex-col gap-1 rounded-lg border p-[18px] hover:border-zinc-950/30"
            style={
              c.dark
                ? { background: '#09090b', color: '#fafafa', borderColor: '#09090b' }
                : { background: '#fff', color: '#09090b', borderColor: 'rgba(9,9,11,0.1)' }
            }
          >
            <span className="text-[10.5px] font-semibold tracking-[0.06em] uppercase opacity-60">{c.kicker}</span>
            <span className="text-base font-semibold">{c.title}</span>
            <span className="text-[12.5px]/[1.55] opacity-70">{c.detail}</span>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-1.5 text-lg font-semibold tracking-[-0.02em]">Interactive sessions so far</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        {sessions.length} built from semester 1 and 2 material, starting with the ones everything else leans on. The
        rest of the course list is in the menu, waiting for its weekend.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {sessions.map((s) => {
          const course = courseOfTopic(s.id)
          return (
            <Link
              key={s.id}
              href={`/session/${s.id}`}
              className="flex h-full flex-col gap-2 rounded-lg border border-zinc-950/10 bg-white p-5 hover:border-zinc-950/25 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <span className="w-fit rounded-full bg-zinc-950/[0.06] px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.04em] text-zinc-600 uppercase">
                {course?.name ?? 'session'}
              </span>
              <span className="text-[15px] font-semibold text-zinc-950">{s.label}</span>
              <span className="text-[13px]/[1.6] text-zinc-600">{s.blurb}</span>
              <span className="mt-auto pt-1 text-[12.5px] font-semibold" style={{ color: 'var(--acc)' }}>
                Open the session →
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-7 border-t border-zinc-950/[0.08] pt-7">
        {howToUse.map((h) => (
          <div key={h.title}>
            <h3 className="mb-1.5 text-sm font-semibold">{h.title}</h3>
            <p className="text-[13px]/[1.6] text-zinc-600">{h.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
