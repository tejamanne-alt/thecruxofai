import type { Database } from '@/lib/supabase/database.types'
import { requireSupabaseEnv } from '@/lib/supabase/env'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side client for Server Components, Route Handlers and Server Actions.
 * Must be created per request — it reads the caller's auth cookies, so a shared
 * instance would hand one visitor's session to another.
 */
export async function getSupabaseServerClient() {
  const { url, key } = requireSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components cannot set cookies. The middleware refreshes the
          // session on every request, so it is safe to ignore here.
        }
      },
    },
  })
}
