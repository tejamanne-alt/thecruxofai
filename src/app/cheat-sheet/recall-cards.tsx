'use client'

import { recallCards } from '@/lib/data/programme'
import { useState } from 'react'

/** Say the answer out loud first, then click. */
export function RecallCards() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
      {recallCards.map(([question, answer], i) => {
        const open = !!flipped[i]
        return (
          <button
            key={i}
            type="button"
            onClick={() => setFlipped((s) => ({ ...s, [i]: !s[i] }))}
            className="flex min-h-[120px] cursor-pointer flex-col gap-2 rounded-lg border border-zinc-950/10 p-4 text-left hover:border-zinc-950/30"
            style={open ? { background: '#09090b', color: '#fafafa' } : { background: '#fff', color: '#09090b' }}
          >
            <span className="text-[10.5px] font-semibold tracking-[0.06em] uppercase opacity-60">
              {open ? 'Answer' : 'Question'}
            </span>
            <span className="text-[13.5px]/[1.6]">{open ? answer : question}</span>
          </button>
        )
      })}
    </div>
  )
}
