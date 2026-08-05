/**
 * The two public Supabase values. Both are safe to ship in the browser bundle —
 * the publishable key carries no privileges of its own, and every table it can
 * reach is guarded by row-level security. The *secret* key is a different thing
 * entirely and must never appear in a NEXT_PUBLIC_ variable.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * The site is useful without a database — the four built sessions, the whole
 * curriculum, the cheat sheets and quizzes are all static. So a missing config
 * degrades to "you cannot add your own sessions" rather than a white screen.
 */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)

export function requireSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — see .env.example.'
    )
  }
  return { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY }
}
