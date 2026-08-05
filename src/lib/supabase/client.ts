'use client'

import type { Database } from '@/lib/supabase/database.types'
import { requireSupabaseEnv } from '@/lib/supabase/env'
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * The browser client, created once and reused. A second instance would keep its
 * own copy of the auth state and the two would drift apart after a sign-in.
 */
export function getSupabaseBrowserClient() {
  if (client) return client
  const { url, key } = requireSupabaseEnv()
  client = createBrowserClient<Database>(url, key)
  return client
}
