'use client'

import type { ChartKind, GroupId } from '@/lib/data/curriculum'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export interface CustomSession {
  id: string
  title: string
  group: GroupId
  courseId: string
  summary: string
  /** One `symbol = meaning` per line. Parsed into a legend on the page. */
  math: string
  chart: ChartKind | 'none'
  /** A data URL for images under 3.5 MB, embedded straight into the record. */
  image: string | null
  /** Filenames + sizes of everything uploaded, kept as the source list. */
  files: string[]
  createdAt: number
}

const STORE = 'aiml-lab-sessions-v1'
const PIN = 'aiml-lab-pin-v1'
const SESSION_FLAG = 'aiml-lab-admin-v1'

function obfuscate(s: string) {
  try {
    return btoa(unescape(encodeURIComponent('aiml:' + s)))
  } catch {
    return 'aiml:' + s
  }
}

interface CustomContextValue {
  /** null until the browser store has been read, so pages can avoid flashing. */
  sessions: CustomSession[] | null
  add: (s: Omit<CustomSession, 'id' | 'createdAt'>) => CustomSession
  remove: (id: string) => void
  admin: boolean
  hasPin: boolean
  /** Returns an error string, or null on success. */
  signIn: (code: string) => string | null
  signOut: () => void
}

const CustomContext = createContext<CustomContextValue | null>(null)

export function CustomProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<CustomSession[] | null>(null)
  const [admin, setAdmin] = useState(false)
  const [hasPin, setHasPin] = useState(false)

  // localStorage does not exist during SSR, so this genuinely has to happen
  // after mount — reading it during render would break hydration. `sessions`
  // stays null until then so pages can hold off instead of flashing "not found".
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessions(raw ? (JSON.parse(raw) as CustomSession[]) : [])
      setHasPin(!!localStorage.getItem(PIN))
      setAdmin(sessionStorage.getItem(SESSION_FLAG) === '1')
    } catch {
      setSessions([])
    }
  }, [])

  const persist = useCallback((list: CustomSession[]) => {
    setSessions(list)
    try {
      localStorage.setItem(STORE, JSON.stringify(list))
    } catch {
      // Quota is the usual culprit — an embedded image can be large. The page
      // keeps working for this tab either way.
    }
  }, [])

  const add = useCallback(
    (s: Omit<CustomSession, 'id' | 'createdAt'>) => {
      const item: CustomSession = { ...s, id: String(Date.now()), createdAt: Date.now() }
      persist([...(sessions ?? []), item])
      return item
    },
    [sessions, persist]
  )

  const remove = useCallback((id: string) => persist((sessions ?? []).filter((s) => s.id !== id)), [sessions, persist])

  const signIn = useCallback((code: string) => {
    const trimmed = code.trim()
    if (trimmed.length < 4) return 'Use at least four characters.'
    try {
      const stored = localStorage.getItem(PIN)
      if (!stored) {
        localStorage.setItem(PIN, obfuscate(trimmed))
        setHasPin(true)
      } else if (stored !== obfuscate(trimmed)) {
        return 'That passcode does not match.'
      }
      sessionStorage.setItem(SESSION_FLAG, '1')
      setAdmin(true)
      return null
    } catch {
      return 'This browser is blocking local storage, so admin mode cannot be set.'
    }
  }, [])

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_FLAG)
    } catch {
      // ignore
    }
    setAdmin(false)
  }, [])

  const value = useMemo(
    () => ({ sessions, add, remove, admin, hasPin, signIn, signOut }),
    [sessions, add, remove, admin, hasPin, signIn, signOut]
  )

  return <CustomContext.Provider value={value}>{children}</CustomContext.Provider>
}

export function useCustom() {
  const ctx = useContext(CustomContext)
  if (!ctx) throw new Error('useCustom must be used inside CustomProvider')
  return ctx
}
