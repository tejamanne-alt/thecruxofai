import { AlgebraSession } from '@/components/sessions/algebra'
import { GradientDescentSession } from '@/components/sessions/gradient-descent'
import { Ism1Overview } from '@/components/sessions/ism1/overview'
import { Ism2Overview } from '@/components/sessions/ism2/overview'
import { KMeansSession } from '@/components/sessions/kmeans'
import { Lecture0aOverview } from '@/components/sessions/lec0a/overview'
import { Lecture0bOverview } from '@/components/sessions/lec0b/overview'
import { Lecture1Overview } from '@/components/sessions/lec1/overview'
import { Lecture2Overview } from '@/components/sessions/lec2/overview'
import { LinearAlgebraSession } from '@/components/sessions/linear-algebra'
import { LinearRegressionSession } from '@/components/sessions/linear-regression'
import { DeterminantConcept, MatrixMultiplyConcept, RankConcept } from '@/components/sessions/matrix-concepts'
import { PerceptronSession } from '@/components/sessions/perceptron'
import { BasisConcept, VectorSpaceConcept } from '@/components/sessions/space-concepts'
import {
  CentreConcept,
  EventsConcept,
  OutliersConcept,
  ProbabilityConcept,
  SpreadConcept,
} from '@/components/sessions/stats-concepts'
import { CovarianceConcept, DotProductConcept } from '@/components/sessions/vector-concepts'
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
  matmul: MatrixMultiplyConcept,
  determinant: DeterminantConcept,
  rank: RankConcept,
  dotproduct: DotProductConcept,
  covariance: CovarianceConcept,
  vectorspace: VectorSpaceConcept,
  basis: BasisConcept,
  lec0a: Lecture0aOverview,
  lec0b: Lecture0bOverview,
  lec1: Lecture1Overview,
  lec2: Lecture2Overview,
  ism1: Ism1Overview,
  ism2: Ism2Overview,
  centre: CentreConcept,
  spread: SpreadConcept,
  outliers: OutliersConcept,
  probability: ProbabilityConcept,
  events: EventsConcept,
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
