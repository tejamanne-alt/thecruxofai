'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { PanelButton, PanelButtons, PanelNote, Slider } from '@/components/sessions/session-parts'
import { accentColour, dot, drawAxes, halo, palette, type Frame } from '@/lib/chart/frame'
import type { ChartKind } from '@/lib/data/curriculum'
import { kmData, lrData, pcData, seedCentroids, type Point } from '@/lib/model/dataset'
import { assignToCentroids, grad, inertiaOf, loss, moveCentroids, trainEpoch } from '@/lib/model/math'
import { useState } from 'react'

export const CHART_NOTES: Record<ChartKind, string> = {
  line: 'A generic line-through-points template on sample data — drag the two knobs to show what the fit is doing.',
  bowl: 'A generic loss-surface template on a sample bowl — step the ball and change the step size.',
  clusters: 'A generic grouping template on sample blobs — alternate the two moves and watch the flags settle.',
  boundary: 'A generic split-the-plane template on sample classes — train a pass and watch the line rotate.',
}

/**
 * The same four graphics as the built sessions, on the same sample data, but
 * with neutral axis labels — the story belongs to whoever wrote the session.
 */
export function TemplateChart({ chart }: { chart: ChartKind }) {
  if (chart === 'line') return <LineTemplate />
  if (chart === 'bowl') return <BowlTemplate />
  if (chart === 'clusters') return <ClustersTemplate />
  return <BoundaryTemplate />
}

function Shell({ chart, panel }: { chart: React.ReactNode; panel: React.ReactNode }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      {chart}
      <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Controls</div>
        {panel}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- line */

function LineTemplate() {
  const [w, setW] = useState(1.1)
  const [b, setB] = useState(14)

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 10, ymin: 0, ymax: 45, xlab: 'feature x', ylab: 'target y' })
    const dw = disp.w ?? w
    const db = disp.b ?? b
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1
    g.setLineDash([3, 3])
    for (const p of lrData) {
      g.beginPath()
      g.moveTo(f.px(p.x), f.py(p.y))
      g.lineTo(f.px(p.x), f.py(dw * p.x + db))
      g.stroke()
    }
    g.setLineDash([])
    g.strokeStyle = accentColour()
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(f.px(0), f.py(db))
    g.lineTo(f.px(10), f.py(dw * 10 + db))
    g.stroke()
    lrData.forEach((p, i) => {
      const on = hover?.kind === 'pt' && hover.i === i
      dot(g, f.px(p.x), f.py(p.y), on ? 6 : 4.5, '#18181b', on ? '#fff' : null)
      if (on) halo(g, f.px(p.x), f.py(p.y), 6)
    })
    g.restore()
    return f
  }

  const tooltip = (hit: HitTarget) => {
    const p = lrData[hit.i]
    if (!p) return null
    const pred = w * p.x + b
    return {
      title: `Sample point #${hit.i + 1}`,
      rows: [
        ['x — the input', p.x.toFixed(2)],
        ['y — the true value', p.y.toFixed(1)],
        ['ŷ — what the line predicts', pred.toFixed(1)],
        ['residual (ŷ − y)', `${pred - p.y >= 0 ? '+' : ''}${(pred - p.y).toFixed(1)}`],
      ] as Array<[string, string]>,
    }
  }

  return (
    <Shell
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={(f: Frame) => lrData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))}
          tooltip={tooltip}
          targets={{ w, b }}
        />
      }
      panel={
        <>
          <Slider
            label="Slope"
            value={w}
            display={w.toFixed(2)}
            min={-2}
            max={8}
            step={0.05}
            hint="Tilt of the line."
            onChange={setW}
          />
          <Slider
            label="Intercept"
            value={b}
            display={b.toFixed(2)}
            min={-10}
            max={25}
            step={0.25}
            hint="Where it crosses x = 0."
            onChange={setB}
          />
          <PanelNote>The dashed hairs are the residuals — the gap between the line and each point.</PanelNote>
        </>
      }
    />
  )
}

/* --------------------------------------------------------------- bowl */

function BowlTemplate() {
  const [w, setW] = useState(-1.2)
  const [lr, setLr] = useState(0.15)
  const [trail, setTrail] = useState<number[]>([-1.2])

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: -2, xmax: 8, ymin: 0, ymax: 30, xlab: 'parameter', ylab: 'loss' })
    const acc = accentColour()
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    g.strokeStyle = 'rgba(9,9,11,0.55)'
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const wv = -2 + (i / 200) * 10
      i ? g.lineTo(f.px(wv), f.py(loss(wv))) : g.moveTo(f.px(wv), f.py(loss(wv)))
    }
    g.stroke()
    trail.forEach((wv, i) => {
      if (i < trail.length - 1) {
        dot(g, f.px(wv), f.py(loss(wv)), 3.5, 'rgba(9,9,11,0.28)')
        if (hover?.kind === 'step' && hover.i === i) halo(g, f.px(wv), f.py(loss(wv)), 3.5)
      }
    })
    const cw = disp.w ?? w
    dot(g, f.px(cw), f.py(loss(cw)), 8, acc, '#fff')
    g.restore()
    return f
  }

  return (
    <Shell
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={(f: Frame) => trail.map((wv, i) => ({ kind: 'step', i, px: f.px(wv), py: f.py(loss(wv)) }))}
          tooltip={(hit: HitTarget) => {
            const wv = trail[hit.i]
            if (wv === undefined) return null
            return {
              title: `Step ${hit.i}`,
              rows: [
                ['parameter', wv.toFixed(3)],
                ['loss', loss(wv).toFixed(3)],
                ['slope', grad(wv).toFixed(2)],
              ] as Array<[string, string]>,
            }
          }}
          targets={{ w }}
        />
      }
      panel={
        <>
          <Slider
            label="Step size"
            value={lr}
            display={lr.toFixed(2)}
            min={0.01}
            max={1.2}
            step={0.01}
            hint="Past ~1.0 it climbs out."
            onChange={setLr}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                const nw = w - lr * grad(w)
                setW(nw)
                setTrail((t) => [...t, nw].slice(-40))
              }}
            >
              One step
            </PanelButton>
            <PanelButton
              onClick={() => {
                setW(-1.2)
                setTrail([-1.2])
              }}
            >
              Reset
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            Loss now {loss(w).toFixed(3)} · slope {grad(w).toFixed(2)}
          </PanelNote>
        </>
      }
    />
  )
}

/* ----------------------------------------------------------- clusters */

function ClustersTemplate() {
  const [k, setK] = useState(3)
  const [cents, setCents] = useState<Point[]>(() => seedCentroids(3))
  const [assign, setAssign] = useState<number[] | null>(null)
  const [phase, setPhase] = useState<'assign' | 'move'>('assign')
  const [jump, setJump] = useState(0)

  const targets: Record<string, number> = {}
  cents.forEach((c, i) => {
    targets[`c${i}x`] = c.x
    targets[`c${i}y`] = c.y
  })

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
    kmData.forEach((p, j) => {
      dot(g, f.px(p.x), f.py(p.y), 4.5, assign ? pal[assign[j] % pal.length] : '#a1a1aa')
      if (hover?.kind === 'pt' && hover.i === j) halo(g, f.px(p.x), f.py(p.y), 4.5)
    })
    shown.forEach((c, i) => {
      const x = f.px(c.x)
      const y = f.py(c.y)
      g.strokeStyle = pal[i % pal.length]
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x - 9, y)
      g.lineTo(x + 9, y)
      g.moveTo(x, y - 9)
      g.lineTo(x, y + 9)
      g.stroke()
    })
    g.restore()
    return f
  }

  return (
    <Shell
      chart={
        <ChartCanvas
          height={380}
          jumpKey={jump}
          draw={draw}
          candidates={(f: Frame) => kmData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))}
          tooltip={(hit: HitTarget) => {
            const p = kmData[hit.i]
            return {
              title: 'One data point',
              rows: [
                ['feature 1', p.x.toFixed(2)],
                ['feature 2', p.y.toFixed(2)],
                ['group', assign ? `cluster ${assign[hit.i] + 1}` : 'not assigned yet'],
              ] as Array<[string, string]>,
            }
          }}
          targets={targets}
        />
      }
      panel={
        <>
          <Slider
            label="Number of groups (k)"
            value={k}
            display={String(k)}
            min={2}
            max={5}
            step={1}
            hint="The sample really has 3 blobs."
            onChange={(v) => {
              setK(v)
              setCents(seedCentroids(v))
              setAssign(null)
              setPhase('assign')
              setJump((j) => j + 1)
            }}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                if (phase === 'assign') {
                  setAssign(assignToCentroids(cents))
                  setPhase('move')
                } else {
                  setCents(moveCentroids(assign!, cents))
                  setPhase('assign')
                }
              }}
            >
              Do it
            </PanelButton>
            <PanelButton
              onClick={() => {
                setCents(seedCentroids(k))
                setAssign(null)
                setPhase('assign')
                setJump((j) => j + 1)
              }}
            >
              New flags
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            Next move: {phase === 'assign' ? 'everyone joins their nearest flag' : 'each flag moves to its middle'} ·
            spread {inertiaOf(assign, cents) ? inertiaOf(assign, cents).toFixed(1) : '—'}
          </PanelNote>
        </>
      }
    />
  )
}

/* ----------------------------------------------------------- boundary */

function BoundaryTemplate() {
  const [w, setW] = useState<number[]>([0, 0])
  const [b, setB] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 10, ymin: 0, ymax: 10, xlab: 'feature 1', ylab: 'feature 2' })
    const acc = accentColour()
    const dw = [disp.w0 ?? w[0], disp.w1 ?? w[1]]
    const db = disp.b ?? b
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()
    const step = 12
    for (let x = f.L; x < f.R; x += step) {
      for (let y = f.T; y < f.B; y += step) {
        const fx = ((x - f.L) / (f.R - f.L)) * 10
        const fy = 10 - ((y - f.T) / (f.B - f.T)) * 10
        const z = dw[0] * fx + dw[1] * fy + db
        g.fillStyle = dw[0] === 0 && dw[1] === 0 ? 'rgba(9,9,11,0.03)' : z >= 0 ? acc + '14' : '#0d948814'
        g.fillRect(x, y, step, step)
      }
    }
    if (dw[0] !== 0 || dw[1] !== 0) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      if (Math.abs(dw[1]) > 1e-9) {
        g.moveTo(f.px(0), f.py(-db / dw[1]))
        g.lineTo(f.px(10), f.py(-(dw[0] * 10 + db) / dw[1]))
      } else {
        g.moveTo(f.px(-db / dw[0]), f.py(0))
        g.lineTo(f.px(-db / dw[0]), f.py(10))
      }
      g.stroke()
    }
    pcData.forEach((p, i) => {
      dot(g, f.px(p.x), f.py(p.y), 5, p.c > 0 ? acc : '#0d9488', wrong.includes(i) ? '#dc2626' : null)
      if (hover?.kind === 'pt' && hover.i === i) halo(g, f.px(p.x), f.py(p.y), 5)
    })
    g.restore()
    return f
  }

  return (
    <Shell
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={(f: Frame) => pcData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))}
          tooltip={(hit: HitTarget) => {
            const p = pcData[hit.i]
            const z = w[0] * p.x + w[1] * p.y + b
            const untrained = w[0] === 0 && w[1] === 0
            return {
              title: `Training example #${hit.i + 1}`,
              rows: [
                ['features', `${p.x.toFixed(2)}, ${p.y.toFixed(2)}`],
                ['true class', p.c > 0 ? '+1' : '−1'],
                ['z = w·x + b', untrained ? 'not trained yet' : z.toFixed(2)],
              ] as Array<[string, string]>,
            }
          }}
          targets={{ w0: w[0], w1: w[1], b }}
        />
      }
      panel={
        <>
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                const next = trainEpoch(w, b)
                setW(next.w)
                setB(next.b)
                setWrong(next.wrong)
              }}
            >
              Train one pass
            </PanelButton>
            <PanelButton
              onClick={() => {
                setW([0, 0])
                setB(0)
                setWrong([])
              }}
            >
              Forget everything
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            {w[0] === 0 && w[1] === 0
              ? 'Untrained — press “Train one pass”.'
              : `${wrong.length} still on the wrong side.`}
          </PanelNote>
        </>
      }
    />
  )
}
