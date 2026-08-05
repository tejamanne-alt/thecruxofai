'use client'

import type { CustomSession } from '@/lib/custom/session'
import { useCustom } from '@/lib/custom/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Shown to any maintainer, not just whoever wrote the page — the site is kept
 * by a small trusted group who all edit the same content. The button being
 * hidden is a courtesy; the actual rule is the delete policy on the sessions
 * table, so a crafted request from a non-admin fails at the database.
 */
export function DeleteSessionButton({ session }: { session: CustomSession }) {
  const { isAdmin, remove } = useCustom()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!isAdmin) return null

  async function onDelete() {
    setBusy(true)
    const err = await remove(session.id)
    setBusy(false)
    if (err) {
      setError(err)
      setConfirming(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-zinc-600">Delete for everyone?</span>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-60"
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="cursor-pointer rounded-lg border border-zinc-950/[0.12] bg-white px-3 py-1.5 text-[12.5px] font-medium"
          >
            Keep
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="cursor-pointer rounded-lg border border-zinc-950/[0.12] bg-white px-3.5 py-2 text-[12.5px] font-medium hover:border-red-600 hover:text-red-600"
        >
          Delete session
        </button>
      )}
      {error && <span className="text-[11.5px] text-red-600">{error}</span>}
    </div>
  )
}
