'use client'

import { NavTree } from '@/components/shell/nav-tree'
import { TopBar } from '@/components/shell/top-bar'
import { useCustom } from '@/lib/custom/store'
import type { GroupId } from '@/lib/data/curriculum'
import * as Headless from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { AddSessionDialog } from './add-session-dialog'
import { AuthDialog } from './auth-dialog'

function Brand() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-zinc-950/[0.08] px-2 pb-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-950 text-[13px] font-bold tracking-[-0.02em] text-white">
        AI
      </span>
      <span className="flex min-w-0 flex-col leading-[1.25]">
        <span className="text-sm font-semibold">The Crux of AI</span>
        <span className="text-[11.5px] text-zinc-500">The AIML Learning Lab</span>
      </span>
    </div>
  )
}

function SidebarContent({
  onNavigate,
  onAddSession,
  onAccountClick,
}: {
  onNavigate?: () => void
  onAddSession: (g: GroupId) => void
  onAccountClick: () => void
}) {
  const { user, ready, isAdmin } = useCustom()
  const signedIn = !!user

  return (
    <div className="flex h-full flex-col overflow-hidden py-4 pr-2 pl-4">
      <Brand />
      <NavTree onNavigate={onNavigate} onAddSession={onAddSession} />
      <div className="shrink-0 border-t border-zinc-950/[0.08] pt-3">
        <button
          type="button"
          onClick={onAccountClick}
          className="flex w-full cursor-pointer items-center gap-[9px] rounded-lg border px-2.5 py-2 text-left text-[12.5px] font-medium hover:border-zinc-950/30"
          style={
            isAdmin
              ? { background: 'var(--acc-12)', borderColor: 'var(--acc-35)', color: '#09090b' }
              : { background: '#fff', borderColor: 'rgba(9,9,11,0.12)', color: '#3f3f46' }
          }
        >
          <span
            className="grid size-5 shrink-0 place-items-center rounded-md text-[10px]"
            style={
              isAdmin
                ? { background: 'var(--acc)', color: '#fff' }
                : { background: 'rgba(9,9,11,0.08)', color: '#52525b' }
            }
          >
            {isAdmin ? '✓' : '⚿'}
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate">
              {!ready ? 'Checking session…' : signedIn ? (user.email ?? 'Signed in') : 'Sign in'}
            </span>
            {/* Signed in without maintainer rights is a real state, and a
                confusing one if the UI stays silent about it. */}
            {signedIn && !isAdmin && (
              <span className="truncate text-[10.5px] font-normal text-zinc-500">Read-only — not a maintainer</span>
            )}
          </span>
          {signedIn && <span className="shrink-0 self-center text-[10.5px] text-zinc-500">Sign out</span>}
        </button>
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-zinc-600">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

/**
 * Two columns: a 288px sidebar that owns the whole viewport height, and a main
 * column under a fixed 63px bar. The 63 matches the sidebar header's divider so
 * the two rules meet.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useCustom()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [login, setLogin] = useState(false)
  const [addGroup, setAddGroup] = useState<GroupId | null>(null)

  const onAccountClick = async () => {
    if (!user) {
      setLogin(true)
      return
    }
    await signOut()
    // The layout renders server-side with the request's cookies, so re-fetch it
    // rather than leaving a stale signed-in tree on screen.
    router.refresh()
  }

  return (
    <div className="flex min-h-svh w-full bg-zinc-100">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-72 shrink-0 lg:block">
        <SidebarContent onAddSession={setAddGroup} onAccountClick={onAccountClick} />
      </aside>

      {/* Mobile sidebar */}
      <Headless.Dialog open={mobileOpen} onClose={setMobileOpen} className="lg:hidden">
        <Headless.DialogBackdrop
          transition
          className="fixed inset-0 z-30 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <Headless.DialogPanel
          transition
          className="fixed inset-y-0 z-30 w-full max-w-80 bg-zinc-100 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <SidebarContent
            onNavigate={() => setMobileOpen(false)}
            onAddSession={(g) => {
              setMobileOpen(false)
              setAddGroup(g)
            }}
            onAccountClick={onAccountClick}
          />
        </Headless.DialogPanel>
      </Headless.Dialog>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden pt-[71px] pr-2 pb-2">
        <Suspense
          fallback={<div className="fixed inset-x-0 top-0 z-20 h-[63px] border-b border-zinc-950/10 bg-white" />}
        >
          <TopBar />
        </Suspense>
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-30 grid size-9 place-items-center rounded-lg hover:bg-zinc-950/5 lg:hidden"
        >
          <MenuIcon />
        </button>

        <main className="min-h-[calc(100svh-79px)] rounded-lg bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-zinc-950/[0.06] lg:p-10">
          <div className="mx-auto max-w-[1120px]">{children}</div>
        </main>
      </div>

      <AuthDialog open={login} onClose={() => setLogin(false)} />
      <AddSessionDialog open={addGroup !== null} group={addGroup ?? 's1'} onClose={() => setAddGroup(null)} />
    </div>
  )
}
