import { CHART_NOTES, TemplateChart } from '@/components/charts/template-chart'
import { CheatSheetTab } from '@/components/tabs/cheat-sheet-tab'
import { ExamTab } from '@/components/tabs/exam-tab'
import { QuizTab } from '@/components/tabs/quiz-tab'
import { PageHeader } from '@/components/ui/page-header'
import { fetchSession } from '@/lib/custom/queries'
import { imageUrl } from '@/lib/custom/session'
import { courseById, groupById } from '@/lib/data/curriculum'
import { scopeForCustom } from '@/lib/scope'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeleteSessionButton } from './delete-session-button'

/**
 * A user-written session. Rendered on the server now that the record lives in
 * Postgres rather than one browser's localStorage — which is what makes these
 * pages linkable and shareable with classmates.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const session = await fetchSession(id)
  if (!session) return {}
  return {
    title: session.title,
    description: session.summary.slice(0, 200) || undefined,
  }
}

export default async function CustomSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
  const session = await fetchSession(id)
  if (!session) notFound()

  const course = courseById[session.courseId]
  const kicker = `${groupById[session.group]?.label ?? ''} · ${course?.name ?? ''}`
  const scope = scopeForCustom(session.id, session.title, kicker, session.math)

  if (tab === 'cheat') return <CheatSheetTab scope={scope} />
  if (tab === 'quiz') return <QuizTab scope={scope} />
  if (tab === 'exam') return <ExamTab scope={scope} />

  const legend = scope.cheat
  const src = imageUrl(session.imagePath)

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <PageHeader eyebrow={kicker} title={session.title} />
        </div>
        <DeleteSessionButton session={session} />
      </div>

      <p className="crux-prose mb-7 max-w-[720px] text-[14.5px]/[1.7] whitespace-pre-wrap text-zinc-700">
        {session.summary || 'No write-up yet — add one by recreating this session.'}
      </p>

      {session.chart !== 'none' && (
        <>
          <TemplateChart chart={session.chart} />
          <p className="mt-2 text-[11.5px] text-zinc-400">{CHART_NOTES[session.chart]}</p>
        </>
      )}

      {src && (
        // A plain <img>: the object is served straight from Supabase Storage's
        // public CDN endpoint, which next/image would only proxy again.
        <img
          src={src}
          alt={`Uploaded material for ${session.title}`}
          className="mt-6 max-h-[520px] w-auto max-w-full rounded-lg border border-zinc-950/10"
        />
      )}

      {legend.length > 0 && (
        <div className="mt-7 rounded-lg border border-zinc-950 bg-zinc-950 p-5 text-zinc-50">
          <h3 className="mb-1 text-sm font-semibold">Symbols from this session</h3>
          <p className="mb-3.5 text-xs/[1.6] text-zinc-400">
            Built from the <code className="font-mono">symbol = meaning</code>{' '}lines in the write-up form.
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

      {session.files.length > 0 && (
        <div className="mt-7">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Source material
          </div>
          <ul className="flex flex-col gap-1">
            {session.files.map((f) => (
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
