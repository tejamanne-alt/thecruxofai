import { PageHeader } from '@/components/ui/page-header'
import { coursesInGroup, groups, sessionById } from '@/lib/data/curriculum'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Curriculum' }

export default function CurriculumPage() {
  return (
    <div>
      <PageHeader
        eyebrow="12 courses + dissertation"
        title="Full curriculum"
        large
        intro="Semesters 1 and 2 are largely fixed; from semester 2 onwards you choose electives, six of them in total. Click any course to read its published scope and whatever notes exist."
      />

      <div className="flex flex-col gap-9">
        {groups.map((g) => (
          <div key={g.id} id={g.id} className="scroll-mt-20">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.02em]">{g.label}</h2>
              <span className="text-[12.5px] text-zinc-500">{g.meta}</span>
              <span className="rounded-full bg-zinc-950/[0.06] px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.04em] text-zinc-600 uppercase">
                {g.hint}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
              {coursesInGroup(g.id).map((c) => (
                <Link
                  key={c.id}
                  href={`/course/${c.id}`}
                  className="flex items-start justify-between gap-3 rounded-lg border border-zinc-950/10 bg-white p-3.5 hover:border-zinc-950/30"
                >
                  <span className="text-[13.5px]/[1.45] font-medium text-zinc-950">{c.name}</span>
                  {c.topics.length > 0 ? (
                    <span
                      className="shrink-0 text-[9.5px] font-semibold tracking-[0.04em] uppercase"
                      style={{ color: 'var(--acc)' }}
                      title={c.topics.map((t) => sessionById[t].label).join(', ')}
                    >
                      {c.topics.length} {c.topics.length === 1 ? 'page' : 'pages'}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[9.5px] font-semibold tracking-[0.04em] text-zinc-400 uppercase">
                      syllabus
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
