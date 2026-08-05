'use client'

import { PageHeader } from '@/components/ui/page-header'
import type { Scope } from '@/lib/scope'
import clsx from 'clsx'
import { useState } from 'react'
import { EmptyState } from './cheat-sheet-tab'

/**
 * Answer first, then read why. Each question locks after the first click —
 * changing your answer once you have seen the explanation teaches nothing.
 */
export function QuizTab({ scope }: { scope: Scope }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})

  // Switching scope resets the run; a half-finished score from another course
  // sitting at the top of the page would just be confusing. Adjusted during
  // render rather than in an effect, so the reset paints in the same pass.
  const [lastKey, setLastKey] = useState(scope.key)
  if (lastKey !== scope.key) {
    setLastKey(scope.key)
    setAnswers({})
  }

  const answered = Object.keys(answers).length
  const correct = scope.quiz.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0)

  return (
    <div>
      <PageHeader eyebrow={scope.kicker} title={`${scope.name} — quiz`} />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <p className="crux-prose max-w-[600px] min-w-[260px] flex-1 text-[15px]/[1.6] text-zinc-700">
          Answer first, then read why. Getting one wrong here is cheaper than getting it wrong in the exam hall.
        </p>
        {scope.quiz.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-zinc-800">
              {answered ? `${correct} of ${answered} right` : `${scope.quiz.length} questions`}
            </span>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="cursor-pointer rounded-lg border border-zinc-950/[0.12] bg-white px-[13px] py-[7px] text-[12.5px] font-medium hover:border-zinc-950/30"
            >
              Start again
            </button>
          </div>
        )}
      </div>

      {scope.quiz.length === 0 ? (
        <EmptyState
          title="No quiz yet"
          body="Quiz questions are written after the sessions, from what the faculty actually emphasised. This course has none attached yet."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {scope.quiz.map((q, i) => {
            const picked = answers[i]
            const locked = picked !== undefined
            return (
              <div key={i} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-5">
                <div className="mb-1 flex items-baseline gap-2.5">
                  <span className="text-[10.5px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                    Q{i + 1}
                  </span>
                  <span className="text-[10.5px] text-zinc-400">{q.from}</span>
                </div>
                <p className="mb-3.5 text-[15px]/[1.5] font-medium text-zinc-950">{q.q}</p>

                <div className="flex flex-col gap-2">
                  {q.options.map((opt, oi) => {
                    const isAnswer = oi === q.answer
                    const isPicked = picked === oi
                    const show = locked && (isAnswer || isPicked)
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={locked}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                        className={clsx(
                          'flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[13.5px]/[1.5]',
                          !locked && 'cursor-pointer border-zinc-950/10 bg-white hover:border-zinc-950/30',
                          locked && !show && 'border-zinc-950/[0.06] bg-white text-zinc-400',
                          locked && isAnswer && 'border-green-600 bg-green-600/[0.07] text-zinc-950',
                          locked && isPicked && !isAnswer && 'border-red-600 bg-red-600/[0.07] text-zinc-950'
                        )}
                      >
                        <span
                          className={clsx(
                            'mt-px grid size-[18px] shrink-0 place-items-center rounded-full border text-[11px] font-semibold',
                            locked && isAnswer && 'border-green-600 bg-green-600 text-white',
                            locked && isPicked && !isAnswer && 'border-red-600 bg-red-600 text-white',
                            (!locked || (!isAnswer && !isPicked)) && 'border-zinc-950/20 text-transparent'
                          )}
                        >
                          {locked && isAnswer ? '✓' : locked && isPicked ? '✕' : '·'}
                        </span>
                        <span className="min-w-0">{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {locked && (
                  <div className="mt-3 rounded-lg bg-zinc-950 p-4 text-zinc-300">
                    <div
                      className="mb-1 text-[12.5px] font-semibold"
                      style={{ color: picked === q.answer ? '#4ade80' : '#fca5a5' }}
                    >
                      {picked === q.answer ? 'Right.' : 'Not quite.'}
                    </div>
                    <p className="text-[12.5px]/[1.6]">{q.explain}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
