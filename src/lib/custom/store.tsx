'use client'

import { IMAGE_BUCKET, MAX_IMAGE_BYTES, rowToSession, type CustomSession } from '@/lib/custom/session'
import type { ChartKind, GroupId } from '@/lib/data/curriculum'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { supabaseConfigured } from '@/lib/supabase/env'
import type { User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type { CustomSession }

export interface NewSession {
  title: string
  group: GroupId
  courseId: string
  summary: string
  math: string
  chart: ChartKind | 'none'
  files: string[]
  /** Uploaded to storage before the row is inserted. */
  imageFile: File | null
}

interface CustomContextValue {
  sessions: CustomSession[]
  /**
   * Whether the signed-in user maintains this site. The site is kept by a small
   * trusted group who all edit the same content, so this is not per-session —
   * an admin may change anything, including pages someone else wrote.
   *
   * Reading it here only decides whether to *show* the editing controls. The
   * rule that matters is the policy on the table; hiding a button protects
   * nothing on its own.
   */
  isAdmin: boolean
  user: User | null
  /** False until the auth state has been read, so the UI can avoid flicker. */
  ready: boolean
  configured: boolean
  add: (draft: NewSession) => Promise<{ id: string } | { error: string }>
  remove: (id: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const CustomContext = createContext<CustomContextValue | null>(null)

export function CustomProvider({
  children,
  initialSessions,
}: {
  children: React.ReactNode
  /** Fetched on the server so the sidebar tree is correct on first paint. */
  initialSessions: CustomSession[]
}) {
  const [sessions, setSessions] = useState<CustomSession[]>(initialSessions)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(!supabaseConfigured)

  // useState only reads its initial value once, so a router.refresh() — which
  // re-runs the layout's server fetch — would otherwise be dropped on the
  // floor. Adopt the new server list whenever its identity actually changes.
  const [lastInitial, setLastInitial] = useState(initialSessions)
  if (lastInitial !== initialSessions) {
    setLastInitial(initialSessions)
    setSessions(initialSessions)
  }

  useEffect(() => {
    if (!supabaseConfigured) return
    const supabase = getSupabaseBrowserClient()
    let cancelled = false

    // is_admin() takes no arguments and reports only on the caller, so there is
    // no way to probe anyone else's role with it. anon cannot call it at all.
    async function resolve(nextUser: User | null) {
      if (!nextUser) {
        if (!cancelled) {
          setUser(null)
          setIsAdmin(false)
          setReady(true)
        }
        return
      }
      const { data, error } = await supabase.rpc('is_admin')
      if (cancelled) return
      setUser(nextUser)
      setIsAdmin(!error && data === true)
      setReady(true)
    }

    // getUser() revalidates against the auth server rather than trusting the
    // cookie, which is what makes it safe to gate the editing UI on.
    supabase.auth.getUser().then(({ data }) => resolve(data.user ?? null))

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session?.user ?? null)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) return
    const { data } = await getSupabaseBrowserClient()
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setSessions(data.map(rowToSession))
  }, [])

  const add = useCallback(async (draft: NewSession): Promise<{ id: string } | { error: string }> => {
    if (!supabaseConfigured) return { error: 'Supabase is not configured for this deployment.' }
    const supabase = getSupabaseBrowserClient()

    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return { error: 'You are signed out. Sign in again and retry.' }

    // The image goes up first: a row pointing at an object that failed to
    // upload would render a broken page, whereas an orphaned object is
    // invisible. Storage RLS requires the uid prefix on the path.
    let imagePath: string | null = null
    if (draft.imageFile) {
      if (draft.imageFile.size > MAX_IMAGE_BYTES) {
        return { error: 'That image is over 3.5 MB. Shrink it and try again.' }
      }
      const ext = draft.imageFile.name.split('.').pop()?.toLowerCase() ?? 'png'
      const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, draft.imageFile, { contentType: draft.imageFile.type, upsert: false })
      if (error) return { error: `The image could not be uploaded: ${error.message}` }
      imagePath = path
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        title: draft.title.trim() || 'Untitled session',
        group_id: draft.group,
        course_id: draft.courseId,
        summary: draft.summary,
        math: draft.math,
        chart: draft.chart,
        image_path: imagePath,
        files: draft.files,
        author_id: auth.user.id,
      })
      .select()
      .single()

    if (error || !data) {
      // Do not leave the just-uploaded object behind if the row failed.
      if (imagePath) await supabase.storage.from(IMAGE_BUCKET).remove([imagePath])
      return { error: error?.message ?? 'The session could not be saved.' }
    }

    setSessions((list) => [...list, rowToSession(data)])
    return { id: data.id }
  }, [])

  const remove = useCallback(
    async (id: string): Promise<string | null> => {
      if (!supabaseConfigured) return 'Supabase is not configured for this deployment.'
      const supabase = getSupabaseBrowserClient()
      const target = sessions.find((s) => s.id === id)

      const { error } = await supabase.from('sessions').delete().eq('id', id)
      if (error) return error.message

      if (target?.imagePath) await supabase.storage.from(IMAGE_BUCKET).remove([target.imagePath])
      setSessions((list) => list.filter((s) => s.id !== id))
      return null
    },
    [sessions]
  )

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email, password })
      if (error) return error.message
      await refresh()
      return null
    },
    [refresh]
  )

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await getSupabaseBrowserClient().auth.signUp({ email, password })
    if (error) return { error: error.message, needsConfirmation: false }
    // With email confirmation on, Supabase returns a user but no session.
    return { error: null, needsConfirmation: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    await getSupabaseBrowserClient().auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }, [])

  const value = useMemo(
    () => ({
      sessions,
      isAdmin,
      user,
      ready,
      configured: supabaseConfigured,
      add,
      remove,
      signIn,
      signUp,
      signOut,
    }),
    [sessions, isAdmin, user, ready, add, remove, signIn, signUp, signOut]
  )

  return <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
}

export function useCustom() {
  const ctx = useContext(CustomContext)
  if (!ctx) throw new Error('useCustom must be used inside CustomProvider')
  return ctx
}
