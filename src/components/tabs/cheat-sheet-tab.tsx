import { PageHeader } from '@/components/ui/page-header'
import type { Scope } from '@/lib/scope'

/** Formula cards. At course scope this aggregates every session under it. */
export function CheatSheetTab({ scope }: { scope: Scope }) {
  const isCourse = scope.key.startsWith('course:')

  return (
    <div>
      <PageHeader
        eyebrow={scope.kicker}
        title={`${scope.name} — cheat sheet`}
        intro={`Every formula from ${scope.name}, with the sentence that makes it obvious. ${
          isCourse ? 'Collected from every session in this course.' : 'Scoped to this session only.'
        }`}
      />

      {scope.cheat.length === 0 ? (
        <EmptyState
          title="No cheat sheet yet"
          body="A cheat sheet appears once this course has sessions with formulas attached. Until then the Overview tab holds its published scope."
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {scope.cheat.map((c, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-[18px]">
              <span className="text-[10.5px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{c.from}</span>
              <span className="overflow-x-auto font-mono text-sm text-zinc-950">{c.formula}</span>
              {c.why && <span className="text-[12.5px]/[1.6] text-zinc-600">{c.why}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-[560px] rounded-lg border border-dashed border-zinc-950/15 bg-zinc-50 p-6">
      <div className="mb-1.5 text-sm font-semibold">{title}</div>
      <p className="text-[13px]/[1.6] text-zinc-600">{body}</p>
    </div>
  )
}
