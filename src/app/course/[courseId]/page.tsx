import { CheatSheetTab } from '@/components/tabs/cheat-sheet-tab'
import { ExamTab } from '@/components/tabs/exam-tab'
import { QuizTab } from '@/components/tabs/quiz-tab'
import { PageHeader } from '@/components/ui/page-header'
import { courseById, courses, groupById, sessionById } from '@/lib/data/curriculum'
import { scopeForCourse } from '@/lib/scope'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return courses.map((c) => ({ courseId: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params
  const course = courseById[courseId]
  return course ? { title: course.name } : {}
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { courseId } = await params
  const { tab } = await searchParams
  const course = courseById[courseId]
  if (!course) notFound()

  const scope = scopeForCourse(course)
  if (tab === 'cheat') return <CheatSheetTab scope={scope} />
  if (tab === 'quiz') return <QuizTab scope={scope} />
  if (tab === 'exam') return <ExamTab scope={scope} />

  const hasTopics = course.topics.length > 0

  return (
    <div>
      <PageHeader
        eyebrow={groupById[course.group]?.label ?? ''}
        title={course.name}
        intro={
          hasTopics
            ? 'Sessions from this course that have already been rebuilt as interactive pages are listed on the right.'
            : 'Here is the official scope of this course, kept exactly as published, so the menu never lies about what the programme covers.'
        }
      />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Syllabus, as published
          </div>
          <p className="crux-prose text-[14px]/[1.7] text-zinc-700">{course.syllabus}</p>
          {course.syllabusIsPlaceholder && (
            <p className="mt-3 text-xs/[1.6] text-zinc-500">
              Nothing above is invented — the brochure genuinely prints this course by title only.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {hasTopics ? (
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                Interactive pages from this course
              </div>
              {course.topics.map((t) => (
                <Link
                  key={t}
                  href={`/session/${t}`}
                  className="flex flex-col gap-1 rounded-lg border border-zinc-950/10 bg-white p-3.5 hover:border-zinc-950/30"
                >
                  <span className="text-[13.5px] font-semibold text-zinc-950">{sessionById[t].label}</span>
                  <span className="text-[12.5px]/[1.55] text-zinc-600">{sessionById[t].blurb}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-950/15 bg-zinc-50 p-4">
              <div className="mb-1 text-sm font-semibold">No interactive page yet</div>
              <p className="text-[13px]/[1.6] text-zinc-600">
                This course hasn&rsquo;t been taught to me yet, so there is nothing here I could honestly explain. The
                syllabus above is the official scope. It fills in the weekend the sessions start.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              How this course is assessed
            </div>
            <p className="text-[12.5px]/[1.6] text-zinc-600">
              Quizzes and assignments online through the LMS, then a mid-semester and a comprehensive exam in person.{' '}
              <Link href="/assessment" className="font-medium" style={{ color: 'var(--acc)' }}>
                Full assessment detail →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
