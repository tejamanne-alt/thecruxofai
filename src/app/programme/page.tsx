import { PageHeader } from '@/components/ui/page-header'
import { delivery, objectives, progFacts, tools } from '@/lib/data/programme'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Programme' }

export default function ProgrammePage() {
  return (
    <div>
      <PageHeader
        eyebrow="BITS Pilani WILP"
        title="The programme, in plain terms"
        large
        intro="A four-semester M.Tech in Artificial Intelligence and Machine Learning for people who keep their day job. Twelve taught courses, four per semester for the first three, then a dissertation or capstone drawn from real work."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {progFacts.map((f) => (
          <div key={f.k} className="flex flex-col gap-1 rounded-lg border border-zinc-950/10 bg-zinc-50 p-[18px]">
            <span className="text-[10.5px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{f.k}</span>
            <span className="text-lg font-semibold tracking-[-0.02em] text-zinc-950">{f.v}</span>
            <span className="text-[12.5px]/[1.55] text-zinc-600">{f.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="mb-3.5 text-lg font-semibold tracking-[-0.02em]">How the teaching actually works</h2>
          <div className="flex flex-col gap-2.5">
            {delivery.map((d) => (
              <div key={d.title} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
                <div className="mb-1 text-[13.5px] font-semibold text-zinc-950">{d.title}</div>
                <p className="text-[13px]/[1.6] text-zinc-600">{d.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3.5 text-lg font-semibold tracking-[-0.02em]">What the programme is aiming at</h2>
          <div className="mb-9 flex flex-col gap-2.5">
            {objectives.map((o) => (
              <div key={o} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: 'var(--acc)' }} />
                <span className="text-[13.5px]/[1.6] text-zinc-700">{o}</span>
              </div>
            ))}
          </div>

          <h2 className="mb-3.5 text-lg font-semibold tracking-[-0.02em]">Toolchains you end up in</h2>
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-zinc-950/[0.08] bg-zinc-950/[0.08]">
            {tools.map((t) => (
              <div key={t.area} className="bg-white p-3.5">
                <div className="text-[12.5px] font-semibold text-zinc-950">{t.area}</div>
                <div className="mt-0.5 text-xs/[1.6] text-zinc-600">{t.list}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
