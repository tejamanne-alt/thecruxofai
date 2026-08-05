import { PageHeader } from '@/components/ui/page-header'
import { wholeCourseFormulas } from '@/lib/data/programme'
import type { Metadata } from 'next'
import { RecallCards } from './recall-cards'

export const metadata: Metadata = { title: 'Exam cheat sheet' }

export default function CheatSheetPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Night before the exam"
        title="Cheat sheet"
        large
        intro="One card per idea: the formula, and the sentence that makes it obvious. Then flip the recall cards until you stop hesitating."
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {wholeCourseFormulas.map((f) => (
          <div
            key={f.topic}
            className="flex flex-col gap-2 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-[18px]"
          >
            <span className="text-[10.5px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{f.topic}</span>
            <span className="overflow-x-auto font-mono text-sm text-zinc-950">{f.formula}</span>
            <span className="text-[12.5px]/[1.6] text-zinc-600">{f.why}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-1.5 text-lg font-semibold tracking-[-0.02em]">Recall cards</h2>
      <p className="mb-4 text-[14px]/[1.6] text-zinc-600">Answer out loud first, then click.</p>
      <RecallCards />
    </div>
  )
}
