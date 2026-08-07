import { ISM1_PARTS } from '@/components/sessions/ism1/parts'
import { ISM2_PARTS } from '@/components/sessions/ism2/parts'
import { LEC0A_PARTS } from '@/components/sessions/lec0a/parts'
import { LEC0B_PARTS } from '@/components/sessions/lec0b/parts'
import { LEC1_PARTS } from '@/components/sessions/lec1/parts'
import { LEC2_PARTS } from '@/components/sessions/lec2/parts'
import { PartShell } from '@/components/sessions/session-parts'
import { CheatSheetTab } from '@/components/tabs/cheat-sheet-tab'
import { ExamTab } from '@/components/tabs/exam-tab'
import { QuizTab } from '@/components/tabs/quiz-tab'
import { isTopicId, sessionById } from '@/lib/data/curriculum'
import { LECTURE_PARTS, partsOf } from '@/lib/data/lecture-parts'
import { scopeForSession } from '@/lib/scope'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

/** One body per part id. Only chapters have these. */
const BODIES: Record<string, Record<string, React.ReactNode>> = {
  lec0a: LEC0A_PARTS,
  lec0b: LEC0B_PARTS,
  lec1: LEC1_PARTS,
  lec2: LEC2_PARTS,
  ism1: ISM1_PARTS,
  ism2: ISM2_PARTS,
}

export function generateStaticParams() {
  return Object.entries(LECTURE_PARTS).flatMap(([sessionId, parts]) =>
    (parts ?? []).map((p) => ({ sessionId, partId: p.id }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionId: string; partId: string }>
}): Promise<Metadata> {
  const { sessionId, partId } = await params
  if (!isTopicId(sessionId)) return {}
  const part = partsOf(sessionId).find((p) => p.id === partId)
  if (!part) return {}
  return { title: `${part.title} · ${sessionById[sessionId].label}`, description: part.teaser }
}

export default async function PartPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string; partId: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { sessionId, partId } = await params
  const { tab } = await searchParams
  if (!isTopicId(sessionId)) notFound()

  const parts = partsOf(sessionId)
  const at = parts.findIndex((p) => p.id === partId)
  const body = BODIES[sessionId]?.[partId]
  if (at === -1 || !body) notFound()

  // The tabs act on the whole chapter, not on one part of it. A cheat sheet
  // for a single part would be four lines long and useless before an exam.
  const scope = scopeForSession(sessionId)
  if (tab === 'cheat') return <CheatSheetTab scope={scope} />
  if (tab === 'quiz') return <QuizTab scope={scope} />
  if (tab === 'exam') return <ExamTab scope={scope} />

  const part = parts[at]
  const prev = at > 0 ? parts[at - 1] : undefined
  const next = at < parts.length - 1 ? parts[at + 1] : undefined

  return (
    <PartShell
      chapter={sessionById[sessionId].label}
      chapterHref={`/session/${sessionId}`}
      title={part.title}
      teaser={part.teaser}
      slides={part.slides}
      index={at + 1}
      total={parts.length}
      prev={prev ? { href: `/session/${sessionId}/${prev.id}`, title: prev.title } : undefined}
      next={next ? { href: `/session/${sessionId}/${next.id}`, title: next.title } : undefined}
    >
      {body}
    </PartShell>
  )
}
