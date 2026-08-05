'use client'

import { CHART_NOTES, TemplateChart } from '@/components/charts/template-chart'
import { CheatSheetTab } from '@/components/tabs/cheat-sheet-tab'
import { ExamTab } from '@/components/tabs/exam-tab'
import { QuizTab } from '@/components/tabs/quiz-tab'
import { PageHeader } from '@/components/ui/page-header'
import { useCustom } from '@/lib/custom/store'
import { courseById, groupById } from '@/lib/data/curriculum'
import { scopeForCustom } from '@/lib/scope'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

/**
 * A user-created session. Client-rendered, because the record lives in this
 * browser's localStorage and nowhere else — see the backend notes in the README.
 */
export default function CustomSessionPage() {
  const { id } = useParams<{ id: string }>()
  const tab = useSearchParams().get('tab') ?? 'overview'
  const router = useRouter()
  const { sessions, remove, admin } = useCustom()

  if (sessions === null) {
    return <p className="text-[13px] text-zinc-500">Loading your sessions…</p>
  }

  const item = sessions.find((s) => s.id === id)
  if (!item) {
    return (
      <div>
        <PageHeader
          eyebrow="Not found"
          title="That session is not in this browser"
          intro="Sessions you add are stored in this browser only. Open the site in the browser you wrote it in, or add it again."
        />
        <Link href="/" className="text-[13px] font-semibold" style={{ color: 'var(--acc)' }}>
          ← Back to home
        </Link>
      </div>
    )
  }

  const course = courseById[item.courseId]
  const kicker = `${groupById[item.group]?.label ?? ''} · ${course?.name ?? ''}`
  const scope = scopeForCustom(item.id, item.title, kicker, item.math)

  if (tab === 'cheat') return <CheatSheetTab scope={scope} />
  if (tab === 'quiz') return <QuizTab scope={scope} />
  if (tab === 'exam') return <ExamTab scope={scope} />

  const legend = scope.cheat

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <PageHeader eyebrow={kicker} title={item.title} />
        </div>
        {admin && (
          <button
            type="button"
            onClick={() => {
              remove(item.id)
              router.push('/')
            }}
            className="shrink-0 cursor-pointer rounded-lg border border-zinc-950/[0.12] bg-white px-3.5 py-2 text-[12.5px] font-medium hover:border-red-600 hover:text-red-600"
          >
            Delete session
          </button>
        )}
      </div>

      <p className="crux-prose mb-7 max-w-[720px] text-[14.5px]/[1.7] whitespace-pre-wrap text-zinc-700">
        {item.summary || 'No write-up yet — add one by recreating this session.'}
      </p>

      {item.chart !== 'none' && (
        <>
          <TemplateChart chart={item.chart} />
          <p className="mt-2 text-[11.5px] text-zinc-400">{CHART_NOTES[item.chart]}</p>
        </>
      )}

      {item.image && (
        // Intentionally a plain <img>: the source is a data: URL held in
        // localStorage, which next/image cannot optimise.
        <img
          src={item.image}
          alt={`Uploaded material for ${item.title}`}
          className="mt-6 max-h-[520px] w-auto max-w-full rounded-lg border border-zinc-950/10"
        />
      )}

      {legend.length > 0 && (
        <div className="mt-7 rounded-lg border border-zinc-950 bg-zinc-950 p-5 text-zinc-50">
          <h3 className="mb-1 text-sm font-semibold">Symbols from this session</h3>
          <p className="mb-3.5 text-xs/[1.6] text-zinc-400">
            Built from the <code className="font-mono">symbol = meaning</code> lines in the write-up form.
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
            {legend.map((l, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-[13px] py-[11px]"
              >
                <span className="font-mono text-[13.5px] break-words text-zinc-50">{l.formula}</span>
                <span className="text-[12px]/[1.5] text-zinc-400">{l.why || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.files.length > 0 && (
        <div className="mt-7">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Source material
          </div>
          <ul className="flex flex-col gap-1">
            {item.files.map((f) => (
              <li key={f} className="text-[12.5px] text-zinc-600">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-2 max-w-[560px] text-[11.5px]/[1.6] text-zinc-400">
            Filenames are recorded as the source. PDF and PPTX contents are not read in the browser — parsing those
            server-side, to pre-fill the write-up, is the biggest genuine upgrade this site has left.
          </p>
        </div>
      )}
    </div>
  )
}
