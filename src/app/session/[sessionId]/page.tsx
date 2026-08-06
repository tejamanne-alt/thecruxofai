import { AlgebraSession } from '@/components/sessions/algebra'
import { GradientDescentSession } from '@/components/sessions/gradient-descent'
import { KMeansSession } from '@/components/sessions/kmeans'
import { Lecture1Overview } from '@/components/sessions/lec1/overview'
import { LinearAlgebraSession } from '@/components/sessions/linear-algebra'
import { LinearRegressionSession } from '@/components/sessions/linear-regression'
import { PerceptronSession } from '@/components/sessions/perceptron'
import { CheatSheetTab } from '@/components/tabs/cheat-sheet-tab'
import { ExamTab } from '@/components/tabs/exam-tab'
import { QuizTab } from '@/components/tabs/quiz-tab'
import { isTopicId, sessionById, sessions, type TopicId } from '@/lib/data/curriculum'
import { scopeForSession } from '@/lib/scope'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const OVERVIEWS: Record<TopicId, () => React.ReactElement> = {
  algebra: AlgebraSession,
  linalg: LinearAlgebraSession,
  regression: LinearRegressionSession,
  gradient: GradientDescentSession,
  kmeans: KMeansSession,
  perceptron: PerceptronSession,
  lec1: Lecture1Overview,
}

export function generateStaticParams() {
  return sessions.map((s) => ({ sessionId: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ sessionId: string }> }): Promise<Metadata> {
  const { sessionId } = await params
  if (!isTopicId(sessionId)) return {}
  return { title: sessionById[sessionId].label, description: sessionById[sessionId].blurb }
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { sessionId } = await params
  const { tab } = await searchParams
  if (!isTopicId(sessionId)) notFound()

  const scope = scopeForSession(sessionId)
  if (tab === 'cheat') return <CheatSheetTab scope={scope} />
  if (tab === 'quiz') return <QuizTab scope={scope} />
  if (tab === 'exam') return <ExamTab scope={scope} />

  const Overview = OVERVIEWS[sessionId]
  return <Overview />
}
