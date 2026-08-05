'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { dot, drawAxes, halo, palette, type Frame } from '@/lib/chart/frame'
import { kmData, seedCentroids, type Point } from '@/lib/model/dataset'
import { assignToCentroids, inertiaOf, moveCentroids } from '@/lib/model/math'
import { useState } from 'react'
import {
  ChartRow,
  Explainers,
  MathBlock,
  PanelButton,
  PanelButtons,
  PanelNote,
  SessionHeader,
  Slider,
} from './session-parts'

const NAMES = ['A', 'B', 'C', 'D', 'E']

export function KMeansSession() {
  const [k, setK] = useState(3)
  const [cents, setCents] = useState<Point[]>(() => seedCentroids(3))
  const [assign, setAssign] = useState<number[] | null>(null)
  const [phase, setPhase] = useState<'assign' | 'move'>('assign')
  const [iter, setIter] = useState(0)
  // Bumped whenever the layout changes structurally, so the chart snaps
  // instead of easing between two unrelated pictures.
  const [jump, setJump] = useState(0)

  const inertia = inertiaOf(assign, cents)

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 10, ymin: 0, ymax: 10, xlab: 'feature 1', ylab: 'feature 2' })
    const pal = palette()
    const shown = cents.map((c, i) => ({ x: disp[`c${i}x`] ?? c.x, y: disp[`c${i}y`] ?? c.y }))

    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    // Spokes from each point to the flag it joined.
    if (assign) {
      kmData.forEach((p, j) => {
        const c = shown[assign[j]]
        if (!c) return
        g.strokeStyle = pal[assign[j] % pal.length] + '40'
        g.lineWidth = 1
        g.beginPath()
        g.moveTo(f.px(p.x), f.py(p.y))
        g.lineTo(f.px(c.x), f.py(c.y))
        g.stroke()
      })
    }

    kmData.forEach((p, j) => {
      const x = f.px(p.x)
      const y = f.py(p.y)
      dot(g, x, y, 4.5, assign ? pal[assign[j] % pal.length] : '#a1a1aa')
      if (hover?.kind === 'pt' && hover.i === j) halo(g, x, y, 4.5)
    })

    // Centroids are crosses, not dots — they are not real data points.
    shown.forEach((c, i) => {
      const x = f.px(c.x)
      const y = f.py(c.y)
      g.strokeStyle = '#fff'
      g.lineWidth = 5
      g.beginPath()
      g.moveTo(x - 9, y)
      g.lineTo(x + 9, y)
      g.moveTo(x, y - 9)
      g.lineTo(x, y + 9)
      g.stroke()
      g.strokeStyle = pal[i % pal.length]
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x - 9, y)
      g.lineTo(x + 9, y)
      g.moveTo(x, y - 9)
      g.lineTo(x, y + 9)
      g.stroke()
      if (hover?.kind === 'cent' && hover.i === i) halo(g, x, y, 9)
    })
    g.restore()
    return f
  }

  const candidates = (f: Frame) => {
    const out: HitTarget[] = kmData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))
    cents.forEach((c, i) => out.push({ kind: 'cent', i, px: f.px(c.x), py: f.py(c.y) }))
    return out
  }

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'pt') {
      const p = kmData[hit.i]
      const rows: Array<[string, string]> = [
        ['feature 1 (x)', p.x.toFixed(2)],
        ['feature 2 (y)', p.y.toFixed(2)],
      ]
      if (assign) {
        const j = assign[hit.i]
        const c = cents[j]
        const dist = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2)
        const ranked = cents
          .map((cc, idx) => ({ idx, d: Math.sqrt((p.x - cc.x) ** 2 + (p.y - cc.y) ** 2) }))
          .sort((a, b) => a.d - b.d)
        rows.push(['cᵢ — flag it joined', `cluster ${NAMES[j]}`])
        rows.push(['distance to its flag', dist.toFixed(2)])
        if (ranked[1]) rows.push(['next nearest flag', `cluster ${NAMES[ranked[1].idx]} at ${ranked[1].d.toFixed(2)}`])
        rows.push(['its share of the spread J', (dist * dist).toFixed(2)])
      } else {
        rows.push(['status', 'not assigned yet — press “Do it”'])
      }
      return { title: 'One data point', rows }
    }
    const c = cents[hit.i]
    if (!c) return null
    let members = 0
    if (assign) assign.forEach((j) => j === hit.i && members++)
    return {
      title: `μ${hit.i + 1} — centroid of cluster ${NAMES[hit.i]}`,
      rows: [
        ['position', `(${c.x.toFixed(2)}, ${c.y.toFixed(2)})`],
        ['members |Cⱼ|', assign ? `${members} points` : 'no members yet'],
        ['what it is', 'the average position of its followers'],
        ['note', 'not a real data point — an invented centre'],
      ] as Array<[string, string]>,
    }
  }

  const targets: Record<string, number> = {}
  cents.forEach((c, i) => {
    targets[`c${i}x`] = c.x
    targets[`c${i}y`] = c.y
  })

  function changeK(nk: number) {
    setK(nk)
    setCents(seedCentroids(nk))
    setAssign(null)
    setPhase('assign')
    setIter(0)
    setJump((v) => v + 1)
  }

  function step() {
    if (phase === 'assign') {
      setAssign(assignToCentroids(cents))
      setPhase('move')
    } else {
      setCents(moveCentroids(assign!, cents))
      setPhase('assign')
      setIter((v) => v + 1)
    }
  }

  function settle() {
    let a = assign
    let c = cents
    for (let i = 0; i < 12; i++) {
      a = assignToCentroids(c)
      c = moveCentroids(a, c)
    }
    setCents(c)
    setAssign(assignToCentroids(c))
    setPhase('move')
    setIter((v) => v + 12)
  }

  function reseed() {
    setCents(seedCentroids(k))
    setAssign(null)
    setPhase('assign')
    setIter(0)
    setJump((v) => v + 1)
  }

  return (
    <div>
      <SessionHeader
        eyebrow="Unsupervised learning"
        title="k-means clustering"
        intro="Nobody labelled this data. You drop k flags on the map, everyone joins their nearest flag, then each flag moves to the middle of its crowd. Repeat until nothing moves. Step through it below."
      />

      <ChartRow
        chart={<ChartCanvas draw={draw} candidates={candidates} tooltip={tooltip} targets={targets} jumpKey={jump} />}
        panel={
          <>
            <Slider
              label="Number of flags (k)"
              value={k}
              display={String(k)}
              min={2}
              max={5}
              step={1}
              hint="This data really has 3 blobs. See what k = 2 and k = 5 do to it."
              onChange={(v) => changeK(v)}
            />
            <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Next move</div>
              <div className="text-[15px]/[1.45] font-semibold text-zinc-950">
                {phase === 'assign'
                  ? 'Everyone joins their nearest flag'
                  : 'Each flag moves to the middle of its crowd'}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Full rounds done: {iter} · spread {inertia ? inertia.toFixed(1) : '—'}
              </div>
            </div>
            <PanelButtons>
              <PanelButton primary onClick={step}>
                Do it
              </PanelButton>
              <PanelButton onClick={settle}>Settle it</PanelButton>
              <PanelButton onClick={reseed}>New flags</PanelButton>
            </PanelButtons>
            <PanelNote>
              Press “New flags” a few times and settle it each time — the answer can change depending on where the flags
              started. That&rsquo;s the famous weakness.
            </PanelNote>
          </>
        }
      />

      <Explainers
        plain="Two moves, forever alternating: everyone picks a leader, then every leader moves to the centre of their followers. Each move can only tighten the crowds, so it always stops."
        breaks="It assumes round, similar-sized blobs and it never questions your k. Crescent-shaped clusters defeat it entirely — that's when you switch to DBSCAN or spectral clustering."
      >
        <MathBlock
          intro="Three lines: the score being minimised, and the two alternating moves. Every symbol is unpacked in the legend."
          formulas={[
            {
              formula: (
                <>
                  J = Σ<sub>j=1..k</sub> Σ<sub>i ∈ Cⱼ</sub> ‖xᵢ − μⱼ‖²
                </>
              ),
              reading:
                '“For every flag, take each of its followers, measure the distance to the flag, square it, and total everything.” This is the spread number shown in the panel — lower is tighter.',
            },
            {
              formula: (
                <>
                  Step 1 — assign:&nbsp; cᵢ = argmin<sub>j</sub> ‖xᵢ − μⱼ‖²
                </>
              ),
              reading:
                '“Each point looks at all k flags and writes down the number of the closest one.” argmin means “the index that gives the smallest value”, not the value itself.',
            },
            {
              formula: (
                <>
                  Step 2 — update:&nbsp; μⱼ = (1/|Cⱼ|) Σ<sub>i ∈ Cⱼ</sub> xᵢ
                </>
              ),
              reading:
                '“Each flag walks to the average position of its own followers.” Both steps can only lower J, which is why it always stops — but only at a local minimum.',
            },
          ]}
          legend={[
            {
              sym: 'k',
              name: 'How many clusters you asked for',
              note: 'You choose this — the algorithm never questions it. The number of flags on the map.',
              val: `k = ${k} (data has 3 blobs)`,
            },
            {
              sym: 'xᵢ',
              name: 'One data point',
              note: 'A pair of feature values — one dot. The i just numbers the dots.',
              val: `${kmData.length} dots`,
            },
            {
              sym: 'μⱼ',
              name: 'Mu-j — the centroid',
              note: 'Cluster j’s flag: the average position of its members. Not a real data point.',
              val: `${k} crosses on the chart`,
            },
            {
              sym: 'Cⱼ',
              name: 'Cluster j — the membership list',
              note: 'The set of points currently assigned to flag j. Shown by dot colour.',
              val: 'the coloured groups',
            },
            {
              sym: '|Cⱼ|',
              name: 'Size of cluster j',
              note: 'Bars around a set mean “how many things are in it”. Used to take the average.',
              val: 'members per flag',
            },
            {
              sym: 'cᵢ',
              name: 'The label given to point i',
              note: 'Which flag number this dot chose. This is the output you actually get.',
              val: assign ? 'assigned' : 'not assigned yet',
            },
            {
              sym: '‖·‖',
              name: 'Norm — straight-line distance',
              note: 'Double bars mean Euclidean distance: √(Δx² + Δy²). Squared, so no square root needed.',
              val: 'the thin connecting lines',
            },
            {
              sym: 'argmin',
              name: '“Which one gives the smallest”',
              note: 'Returns the index of the winner, not the winning distance. min gives the value, argmin gives the identity.',
              val: 'picks the nearest flag',
            },
            {
              sym: 'J',
              name: 'Inertia — total within-cluster spread',
              note: 'The score being minimised. Always drops as k rises, which is why bigger k is not automatically better.',
              val: inertia ? inertia.toFixed(1) : 'run a step',
            },
            {
              sym: 'Σ Σ',
              name: 'A double sum',
              note: 'Outer loop over the k clusters, inner loop over the points inside each one. A loop inside a loop.',
              val: 'every point, once',
            },
          ]}
        />
      </Explainers>
    </div>
  )
}
