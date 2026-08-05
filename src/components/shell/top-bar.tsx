'use client'

import { useCustom } from '@/lib/custom/store'
import { courseById, isTopicId, sessionById } from '@/lib/data/curriculum'
import { scopeForCourseId, scopeForCustom, scopeForSession, type Scope } from '@/lib/scope'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const GLOBAL_LABELS: Record<string, string> = {
  '/': 'Home',
  '/programme': 'Programme',
  '/curriculum': 'Curriculum',
  '/assessment': 'Assessment',
  '/cheat-sheet': 'Exam cheat sheet',
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'cheat', label: 'Cheat sheet' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam questions' },
] as const

/**
 * The label alone, not a full breadcrumb — that was tried in the prototype and
 * reverted. The tabs to its right act on whatever the tree has selected.
 */
export function TopBar() {
  const pathname = usePathname()
  const params = useSearchParams()
  const { sessions } = useCustom()
  const tab = params.get('tab') ?? 'overview'

  let label = GLOBAL_LABELS[pathname] ?? ''
  let scope: Scope | null = null

  const sessionMatch = /^\/session\/([^/]+)$/.exec(pathname)
  const courseMatch = /^\/course\/([^/]+)$/.exec(pathname)
  const customMatch = /^\/my\/([^/]+)$/.exec(pathname)

  if (sessionMatch && isTopicId(sessionMatch[1])) {
    label = sessionById[sessionMatch[1]].label
    scope = scopeForSession(sessionMatch[1])
  } else if (courseMatch) {
    label = courseById[courseMatch[1]]?.name ?? ''
    scope = scopeForCourseId(courseMatch[1])
  } else if (customMatch) {
    const mine = sessions.find((s) => s.id === customMatch[1])
    if (mine) {
      label = mine.title
      scope = scopeForCustom(mine.id, mine.title, courseById[mine.courseId]?.name ?? '', mine.math)
    }
  }

  const counts: Record<string, number> = scope
    ? { overview: 0, cheat: scope.cheat.length, quiz: scope.quiz.length, exam: scope.exam.length }
    : {}

  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex h-[63px] items-stretch gap-6 border-b border-zinc-950/10 bg-white pr-4 pl-14 lg:left-72 lg:px-6">
      {/* With tabs present there is no room for both on a phone, and the h1
          immediately below already carries the title. */}
      <div
        className={clsx(
          'min-w-0 flex-1 items-center truncate text-sm font-semibold text-zinc-950',
          scope ? 'hidden sm:flex' : 'flex'
        )}
      >
        {label}
      </div>
      {scope && (
        <nav className="flex shrink-0 items-stretch gap-4 overflow-x-auto sm:gap-[26px]">
          {TABS.map((t) => {
            const active = tab === t.id
            const count = counts[t.id]
            return (
              <Link
                key={t.id}
                href={t.id === 'overview' ? pathname : `${pathname}?tab=${t.id}`}
                scroll={false}
                className={clsx(
                  '-mb-px flex items-center gap-[7px] border-b-2 text-[13.5px] whitespace-nowrap hover:text-zinc-950',
                  active ? 'border-zinc-950 font-semibold text-zinc-950' : 'border-transparent text-zinc-500'
                )}
              >
                <span>{t.label}</span>
                {count > 0 && (
                  <span className="text-[10.5px] font-semibold" style={{ color: active ? 'var(--acc)' : '#a1a1aa' }}>
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
