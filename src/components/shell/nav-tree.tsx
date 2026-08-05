'use client'

import { useCustom } from '@/lib/custom/store'
import { courses, groups, sessionById, type Course, type GroupId, type TopicId } from '@/lib/data/curriculum'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const ROOT_LINKS = [
  { href: '/', badge: '⌂', label: 'Home' },
  { href: '/programme', badge: '◆', label: 'Programme' },
  { href: '/curriculum', badge: '▤', label: 'Curriculum' },
  { href: '/assessment', badge: '✓', label: 'Assessment' },
  { href: '/cheat-sheet', badge: '★', label: 'Whole-course cheat sheet' },
]

/**
 * A CSS-triangle chevron inside a fixed 12px box. The fixed box is what keeps
 * the glyph optically centred in both the closed and open state.
 */
function Caret({ open, size = 5 }: { open: boolean; size?: number }) {
  return (
    <span className="grid size-3 shrink-0 place-items-center">
      <span
        className="transition-transform duration-150"
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size}px solid #52525b`,
          borderTop: `${size * 0.7}px solid transparent`,
          borderBottom: `${size * 0.7}px solid transparent`,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      />
    </span>
  )
}

/** Which course a URL belongs to, so the tree can reveal it. */
function courseForPath(pathname: string, custom: Array<{ id: string; courseId: string }>): Course | undefined {
  const session = /^\/session\/([^/]+)/.exec(pathname)
  if (session) return courses.find((c) => c.topics.includes(session[1] as TopicId))

  const course = /^\/course\/([^/]+)/.exec(pathname)
  if (course) return courses.find((c) => c.id === course[1])

  const mine = /^\/my\/([^/]+)/.exec(pathname)
  if (mine) {
    const owner = custom.find((s) => s.id === mine[1])
    return owner ? courses.find((c) => c.id === owner.courseId) : undefined
  }
  return undefined
}

export function NavTree({
  onNavigate,
  onAddSession,
}: {
  onNavigate?: () => void
  onAddSession?: (group: GroupId) => void
}) {
  const pathname = usePathname()
  const { sessions: custom, user } = useCustom()

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ s1: true, s2: true })
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({
    ml: true,
    mathfound: true,
    dnn: true,
  })

  // Landing straight on a deep link should reveal that row, not hide it. Done
  // during render on a path change so the row is already open on first paint.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    const course = courseForPath(pathname, custom)
    if (course) {
      setOpenGroups((g) => ({ ...g, [course.group]: true }))
      setOpenCourses((c) => ({ ...c, [course.id]: true }))
    }
  }

  const customByCourse = new Map<string, typeof custom>()
  for (const s of custom) {
    const list = customByCourse.get(s.courseId) ?? []
    list.push(s)
    customByCourse.set(s.courseId, list)
  }

  function childrenOf(course: Course) {
    const built = course.topics.map((t) => ({
      href: `/session/${t}`,
      label: sessionById[t].label,
      tag: '',
    }))
    const mine = (customByCourse.get(course.id) ?? []).map((s) => ({
      href: `/my/${s.id}`,
      label: s.title,
      tag: 'yours',
    }))
    return [...built, ...mine]
  }

  return (
    <div className="crux-scroll flex min-h-0 flex-1 flex-col gap-[18px] overflow-x-hidden overflow-y-auto py-3.5 pr-0.5 pb-6">
      {/* Level 0 — flat root links */}
      <nav className="flex flex-col gap-0.5">
        {ROOT_LINKS.map((n) => {
          const active = pathname === n.href
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              className={clsx(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] font-medium',
                active ? 'text-zinc-950' : 'text-zinc-800 hover:bg-zinc-950/[0.06]'
              )}
              style={active ? { background: 'var(--acc-12)' } : undefined}
            >
              <span
                className="grid size-5 shrink-0 place-items-center rounded-md text-[10px] font-bold"
                style={
                  active
                    ? { background: 'var(--acc)', color: '#fff' }
                    : { background: 'rgba(9,9,11,0.08)', color: '#52525b' }
                }
              >
                {n.badge}
              </span>
              <span className="min-w-0 truncate">{n.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* The curriculum tree. Three levels, each a step down the grey ramp. */}
      <div className="flex flex-col gap-1">
        <div className="px-2.5 text-[10.5px] font-semibold tracking-[0.08em] text-zinc-600 uppercase">
          Programme curriculum
        </div>

        {groups.map((g) => {
          const open = !!openGroups[g.id]
          const items = courses.filter((c) => c.group === g.id)
          return (
            <div key={g.id} className="flex flex-col">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setOpenGroups((s) => ({ ...s, [g.id]: !s[g.id] }))}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-[7px] rounded-lg py-1.5 pr-1 pl-2.5 text-left text-[13px] font-semibold tracking-[-0.01em] text-zinc-950 hover:bg-zinc-950/[0.05]"
                >
                  <Caret open={open} />
                  <span className="min-w-0 flex-1 truncate">{g.label}</span>
                  <span className="shrink-0 text-[10.5px] font-medium text-zinc-500">{g.meta}</span>
                </button>
                {user && onAddSession && (
                  <button
                    type="button"
                    title="Add a session to this section"
                    onClick={() => onAddSession(g.id)}
                    className="mr-1.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border border-zinc-950/[0.12] bg-white text-sm/none text-zinc-700 hover:border-zinc-950/35 hover:text-zinc-950"
                  >
                    +
                  </button>
                )}
              </div>

              {open && (
                <div className="mt-0.5 mb-1.5 ml-[18px] flex flex-col gap-px border-l border-zinc-950/[0.18] pl-2.5">
                  {items.map((c) => {
                    const kids = childrenOf(c)
                    const courseOpen = !!openCourses[c.id]
                    const isCurrent = pathname === `/course/${c.id}`
                    const childActive = kids.some((k) => pathname === k.href)
                    return (
                      <div key={c.id} className="flex flex-col">
                        <div
                          className="flex items-start gap-0.5 rounded-md"
                          style={isCurrent ? { background: 'var(--acc-12)' } : undefined}
                        >
                          {kids.length > 0 ? (
                            <button
                              type="button"
                              aria-label={`Toggle sessions in ${c.name}`}
                              onClick={() => setOpenCourses((s) => ({ ...s, [c.id]: !s[c.id] }))}
                              className="grid h-[29px] w-[18px] shrink-0 cursor-pointer items-start justify-items-center border-0 bg-none pt-1.5 hover:opacity-60"
                            >
                              <span className="grid h-[17px] place-items-center">
                                <Caret open={courseOpen} size={4.5} />
                              </span>
                            </button>
                          ) : (
                            <span className="w-[18px] shrink-0" />
                          )}
                          <Link
                            href={`/course/${c.id}`}
                            onClick={onNavigate}
                            className={clsx(
                              'flex min-w-0 flex-1 items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[12.5px]/[1.35] hover:text-zinc-950',
                              isCurrent || childActive ? 'font-semibold text-zinc-950' : 'font-normal',
                              !isCurrent && !childActive && (kids.length ? 'text-zinc-800' : 'text-zinc-600')
                            )}
                          >
                            <span className="min-w-0 flex-1">{c.name}</span>
                            {kids.length > 0 && (
                              <span
                                className="shrink-0 text-[9.5px] font-semibold tracking-[0.04em] uppercase"
                                style={{ color: 'var(--acc)' }}
                              >
                                {kids.length} {kids.length === 1 ? 'page' : 'pages'}
                              </span>
                            )}
                          </Link>
                        </div>

                        {courseOpen && kids.length > 0 && (
                          <div className="mt-px mb-1 ml-[18px] flex flex-col gap-px border-l border-zinc-950/[0.08] pl-2.5">
                            {kids.map((s) => {
                              const active = pathname === s.href
                              return (
                                <Link
                                  key={s.href}
                                  href={s.href}
                                  onClick={onNavigate}
                                  className={clsx(
                                    'flex w-full items-center gap-[7px] rounded-md px-2 py-[5px] text-left text-xs',
                                    active
                                      ? 'font-semibold text-zinc-950'
                                      : 'font-normal text-zinc-700 hover:bg-zinc-950/[0.05]'
                                  )}
                                  style={active ? { background: 'var(--acc-12)' } : undefined}
                                >
                                  <span
                                    className="size-[5px] shrink-0 rounded-full"
                                    style={{ background: active ? 'var(--acc)' : 'rgba(9,9,11,0.25)' }}
                                  />
                                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                                  {s.tag && (
                                    <span className="shrink-0 text-[9px] font-semibold tracking-[0.04em] text-zinc-400 uppercase">
                                      {s.tag}
                                    </span>
                                  )}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
