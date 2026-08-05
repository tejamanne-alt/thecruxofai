import type React from 'react'

/** The three-line opening every page shares: eyebrow, h1, one paragraph. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  large,
}: {
  eyebrow: string
  title: string
  intro?: React.ReactNode
  large?: boolean
}) {
  return (
    <>
      <p className="mb-1.5 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">{eyebrow}</p>
      <h1
        className={
          large
            ? 'mb-2.5 text-[32px]/[1.2] font-semibold tracking-[-0.02em] text-zinc-950'
            : 'mb-2.5 text-[28px]/[1.2] font-semibold tracking-[-0.02em] text-zinc-950'
        }
      >
        {title}
      </h1>
      {intro && <p className="crux-prose mb-7 max-w-[700px] text-[15px]/[1.6] text-zinc-700">{intro}</p>}
    </>
  )
}
