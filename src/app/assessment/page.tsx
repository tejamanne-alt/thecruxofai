import { PageHeader } from '@/components/ui/page-header'
import { assessCards, examRules } from '@/lib/data/programme'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Assessment' }

export default function AssessmentPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Marks, exams, logistics"
        title="How you are assessed"
        large
        intro="Nothing here is a surprise if you read it once at the start of the semester. Continuous assessment through the term, two in-person exams per course, and a project in the final semester."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {assessCards.map((a) => (
          <div key={a.title} className="flex flex-col gap-2 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-5">
            <span className="text-sm font-semibold text-zinc-950">{a.title}</span>
            <span className="text-[13px]/[1.6] text-zinc-600">{a.body}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-3.5 text-lg font-semibold tracking-[-0.02em]">The rules worth remembering</h2>
      <div className="flex max-w-[760px] flex-col gap-2.5">
        {examRules.map((r) => (
          <div key={r} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: 'var(--acc)' }} />
            <span className="text-[13.5px]/[1.6] text-zinc-700">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
