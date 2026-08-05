import { rowToSession, type CustomSession } from '@/lib/custom/session'
import { supabaseConfigured } from '@/lib/supabase/env'
import { getSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Every session, for the sidebar tree. Read on the server so the tree is
 * complete on first paint rather than popping in after hydration.
 *
 * A database that is unreachable must not take the site down — the four built
 * sessions and the whole curriculum are static and still worth reading. So
 * failures degrade to an empty list.
 */
export async function fetchSessions(): Promise<CustomSession[]> {
  if (!supabaseConfigured) return []
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from('sessions').select('*').order('created_at', { ascending: true })
    if (error || !data) return []
    return data.map(rowToSession)
  } catch {
    return []
  }
}

export async function fetchSession(id: string): Promise<CustomSession | null> {
  if (!supabaseConfigured) return null
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from('sessions').select('*').eq('id', id).maybeSingle()
    if (error || !data) return null
    return rowToSession(data)
  } catch {
    return null
  }
}
