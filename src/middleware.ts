import type { Database } from '@/lib/supabase/database.types'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/lib/supabase/env'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase auth token on every request and writes the rotated
 * cookies back onto the response. Without this, Server Components eventually
 * read an expired session and the page renders as signed-out.
 *
 * This middleware only refreshes — it never redirects. Every page on the site
 * is readable signed-out by design; what you can *write* is enforced by
 * row-level security in Postgres, not by route guards here.
 */
export async function middleware(request: NextRequest) {
  // The site is fully usable without a database, so an unconfigured deployment
  // should pass straight through rather than 500 on every request.
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // Do not remove: this call is what triggers the refresh.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Everything except Next's own assets and image files — those never carry a
     * session and refreshing on them is wasted work.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
}
