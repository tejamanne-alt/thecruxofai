'use client'

import { PageHeader } from '@/components/ui/page-header'
import type { Scope } from '@/lib/scope'
import { useState } from 'react'
import { EmptyState } from './cheat-sheet-tab'

/** Accordion rows: the question, then what a full answer has to cover. */
export function ExamTab({ scope }: { scope: Scope }) {
  const [open, setOpen] = useState<Record<number, boolean>>({})

  // Collapse everything when the scope changes, during render so it lands in
  // the same paint as the new questions.
  const [lastKey, setLastKey] = useState(scope.key)
  if (lastKey !== scope.key) {
    setLastKey(scope.key)
    setOpen({})
  }

  return (
    <div>
      <PageHeader
        eyebrow={scope.kicker}
        title={`${scope.name} — exam questions`}
        intro="The shape these come in, and the marking points a full answer has to hit. Write your version first, then open the model answer."
      />

      {scope.exam.length === 0 ? (
        <EmptyState
          title="No exam questions yet"
          body="These are written after the sessions, from what the faculty actually emphasised and from past papers. Nothing has been attached to this course yet."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {scope.exam.map((q, i) => (
            <div key={i} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-5">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                <span className="text-[10.5px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Q{i + 1}</span>
                <div className="min-w-[240px] flex-1">
                  <p className="text-[14.5px]/[1.55] font-medium text-zinc-950">{q.q}</p>
                  <p className="mt-1 text-xs text-zinc-500">{q.meta}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
                  className="shrink-0 cursor-pointer text-[12.5px] font-semibold"
                  style={{ color: 'var(--acc)' }}
                >
                  {open[i] ? 'Hide model answer' : 'Model answer →'}
                </button>
              </div>

              {open[i] && (
                <div className="mt-3.5 rounded-lg bg-zinc-950 p-4 text-zinc-300">
                  <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                    What a full answer covers
                  </div>
                  <ul className="flex flex-col gap-2">
                    {q.points.map((p, pi) => (
                      <li key={pi} className="flex gap-2.5 text-[12.5px]/[1.6]">
                        <span className="mt-[7px] size-1 shrink-0 rounded-full" style={{ background: 'var(--acc)' }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
