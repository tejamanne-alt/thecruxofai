'use client'

import { LabBox } from '@/components/charts/matrix-ui'
import { PanelButton, PanelButtons, PanelNote, Slider } from '@/components/sessions/session-parts'
import { useState } from 'react'

/**
 * The furniture workshop from the slides, made into something you operate.
 * Sliders set how many of each kit to build; the bars show what that uses up
 * against what you have. The lesson lands when you try to fix one bar and
 * knock two others out — which is exactly why guessing does not scale.
 */
const RESOURCES = [
  { name: 'Wood', per: [1, 2, 1], have: 9, unit: 'units' },
  { name: 'Labour', per: [2, 1, 1], have: 8, unit: 'hours' },
  { name: 'Machine time', per: [1, 1, 2], have: 7, unit: 'hours' },
  { name: 'Shipping', per: [3, 1, 2], have: 11, unit: 'units' },
]

const KITS = ['Chair kits', 'Table kits', 'Cabinet kits']
const TEAL = '#0d9488'
const RED = '#dc2626'
const AMBER = '#d97706'

export function WorkshopLab() {
  const [x, setX] = useState([1, 1, 1])

  const used = RESOURCES.map((r) => r.per[0] * x[0] + r.per[1] * x[1] + r.per[2] * x[2])
  const allExact = used.every((u, i) => u === RESOURCES[i].have)

  const set = (i: number, v: number) => setX(x.map((old, j) => (j === i ? v : old)))

  return (
    <LabBox layout="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          What your plan uses up
        </div>

        {RESOURCES.map((r, i) => {
          const u = used[i]
          const over = u > r.have
          const exact = u === r.have
          const colour = exact ? TEAL : over ? RED : AMBER
          const pct = Math.min(100, (u / (r.have * 1.5)) * 100)
          const mark = (r.have / (r.have * 1.5)) * 100
          return (
            <div key={r.name}>
              <div className="mb-1 flex items-baseline justify-between text-[12.5px]">
                <span className="font-semibold text-zinc-800">{r.name}</span>
                <span className="font-mono" style={{ color: colour }}>
                  used {u} of {r.have} {r.unit}
                  {exact ? ' ✓' : over ? ` — ${u - r.have} too many` : ` — ${r.have - u} left over`}
                </span>
              </div>
              <div className="relative h-[22px] overflow-hidden rounded-md bg-zinc-950/[0.05]">
                <div
                  className="h-full transition-[width] duration-150"
                  style={{ width: `${pct}%`, background: colour, opacity: 0.85 }}
                />
                {/* The line you have to land exactly on. */}
                <div className="absolute inset-y-0 w-[2px] bg-zinc-900" style={{ left: `${mark}%` }} />
              </div>
              <div className="mt-1 font-mono text-[11px] text-zinc-500">
                {r.per[0]}×{x[0]} + {r.per[1]}×{x[1]} + {r.per[2]}×{x[2]} = {u}
              </div>
            </div>
          )
        })}

        <p className="mt-1 text-[12.5px]/[1.6] text-zinc-600">
          The black line on each bar is the amount you have. You need to land on <strong>all four</strong> lines at the
          same time. Nudge one slider and watch three bars move at once.
        </p>
      </div>

      <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Your plan</div>
          <div className="text-[20px] font-semibold tracking-[-0.02em]" style={{ color: allExact ? TEAL : '#09090b' }}>
            {allExact ? 'All four match' : `${used.filter((u, i) => u === RESOURCES[i].have).length} of 4 match`}
          </div>
          <div className="mt-1 text-[12px]/[1.55] text-zinc-600">
            {allExact
              ? 'Nothing left over and nothing short. This is the answer to the system.'
              : 'Keep going, or press “Show me the answer”.'}
          </div>
        </div>

        {KITS.map((k, i) => (
          <Slider
            key={k}
            label={k}
            value={x[i]}
            display={String(x[i])}
            min={0}
            max={6}
            step={1}
            hint={`Uses ${RESOURCES.map((r) => `${r.per[i]} ${r.name.toLowerCase()}`).join(', ')} each.`}
            onChange={(v) => set(i, v)}
          />
        ))}

        <PanelButtons>
          <PanelButton primary onClick={() => setX([2, 3, 1])}>
            Show me the answer
          </PanelButton>
          <PanelButton onClick={() => setX([1, 1, 1])}>Reset</PanelButton>
        </PanelButtons>

        <PanelNote>
          Try to find 2, 3, 1 by hand first. It is fiddly with three sliders and four rules. With ten unknowns it would
          be hopeless — which is why the rest of this chapter builds a method.
        </PanelNote>
      </div>
    </LabBox>
  )
}
