'use client'

import type { Frame } from '@/lib/chart/frame'
import { useEffect, useRef, useState } from 'react'

/** A mark the pointer can land on, already projected into pixel space. */
export interface HitTarget {
  kind: string
  i: number
  px: number
  py: number
  /** Free-form payload the tooltip builder can read back (e.g. the w of a curve sample). */
  data?: number
}

export interface TipContent {
  title: string
  rows: Array<[string, string]>
}

/** Per-kind hit radius, in pixels. Centroids are big targets, curve samples small. */
const HIT_RADIUS: Record<string, number> = { cent: 22, curve: 14 }
const DEFAULT_RADIUS = 16

export interface ChartCanvasProps {
  /**
   * Draw one frame and return the axis frame you used, so hit-testing can
   * project data coordinates the same way. `disp` holds the eased values;
   * read exact state straight from your own closure.
   */
  draw: (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    ctx: { disp: Record<string, number>; hover: HitTarget | null }
  ) => Frame
  /** Everything the pointer can land on, given the frame from the last draw. */
  candidates: (f: Frame) => HitTarget[]
  /** What to say about the hovered mark. Return null to show nothing. */
  tooltip: (hit: HitTarget) => TipContent | null
  /** Values that should ease rather than jump. Panel numbers stay exact and instant. */
  targets: Record<string, number>
  /**
   * Bump this when the chart changes structurally (new k, reseeded flags, a new
   * view). Easing between two unrelated layouts looks like a glitch, so those
   * snap instead.
   */
  jumpKey?: string | number
  height?: number
  caption?: string
}

export function ChartCanvas({
  draw,
  candidates,
  tooltip,
  targets,
  jumpKey,
  height = 400,
  caption = 'Hover anything on the chart — every dot, flag and marker explains itself.',
}: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<Frame | null>(null)
  const dispRef = useRef<Record<string, number> | null>(null)
  const rafRef = useRef<number | null>(null)
  const jumpRef = useRef<string | number | undefined>(jumpKey)
  // The rAF loop outlives the render that scheduled it, so it reads the latest
  // paint/targets through refs rather than through a stale closure.
  const paintRef = useRef<() => void>(() => {})
  const targetsRef = useRef(targets)

  const [size, setSize] = useState({ w: 700, h: height })
  const [hover, setHover] = useState<HitTarget | null>(null)

  function paint() {
    const c = canvasRef.current
    if (!c) return
    const W = c.clientWidth || 720
    const H = c.clientHeight || height
    const dpr = window.devicePixelRatio || 1
    c.width = Math.round(W * dpr)
    c.height = Math.round(H * dpr)

    const g = c.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, W, H)
    g.font = '11px Inter, sans-serif'
    g.textBaseline = 'middle'

    frameRef.current = draw(g, W, H, { disp: dispRef.current ?? targets, hover })
  }

  // Chart-space values glide toward their target; the read-outs beside the
  // chart do not — they stay exact and instant.
  function tick() {
    rafRef.current = null
    const tgt = targetsRef.current
    const disp = dispRef.current

    if (!disp || Object.keys(disp).length !== Object.keys(tgt).length) {
      dispRef.current = { ...tgt }
      paintRef.current()
      return
    }

    let moving = false
    for (const k in tgt) {
      const to = tgt[k]
      const from = disp[k]
      if (from === undefined || !isFinite(from) || !isFinite(to)) {
        disp[k] = to
        continue
      }
      if (Math.abs(to - from) > 1e-3) {
        disp[k] = from + (to - from) * 0.22
        moving = true
      } else {
        disp[k] = to
      }
    }
    paintRef.current()
    if (moving && rafRef.current === null) rafRef.current = requestAnimationFrame(tick)
  }

  // No dependency array on purpose: every render refreshes the refs, then either
  // snaps (structural change) or schedules one ease-and-repaint pass.
  useEffect(() => {
    paintRef.current = paint
    targetsRef.current = targets

    if (jumpRef.current !== jumpKey) {
      jumpRef.current = jumpKey
      dispRef.current = { ...targets }
      paint()
      return
    }
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick)
  })

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    },
    []
  )

  // A ResizeObserver rather than a window resize listener, so the canvas paints
  // the moment it mounts — a tab switch remounts it at its final width and
  // never waits for the user to drag the window. `observe` fires the callback
  // once immediately, which is where the first size and the first paint come
  // from. This has to be a stable effect, not a ref callback: an unstable ref
  // callback is torn down and re-run on every render, and the setSize inside it
  // would then loop forever.
  useEffect(() => {
    const node = canvasRef.current
    if (!node) return
    dispRef.current = { ...targetsRef.current }
    const ro = new ResizeObserver(() => {
      setSize({ w: node.clientWidth || 700, h: node.clientHeight || height })
      paintRef.current()
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [height])

  function onMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const c = canvasRef.current
    const f = frameRef.current
    if (!c || !f) return
    const r = c.getBoundingClientRect()
    const mx = e.clientX - r.left
    const my = e.clientY - r.top

    let best: HitTarget | null = null
    let bd = Infinity
    for (const t of candidates(f)) {
      const d = (t.px - mx) ** 2 + (t.py - my) ** 2
      const lim = HIT_RADIUS[t.kind] ?? DEFAULT_RADIUS
      if (d < bd && d < lim * lim) {
        bd = d
        best = t
      }
    }
    if (!best) {
      if (hover) setHover(null)
      return
    }
    if (!hover || hover.kind !== best.kind || hover.i !== best.i) setHover(best)
  }

  const tip = hover ? tooltip(hover) : null
  const tipWidth = Math.max(150, Math.min(250, size.w - 20))

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 p-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseMove={onMove}
          onMouseLeave={() => hover && setHover(null)}
          style={{ height }}
          className="block w-full cursor-crosshair"
        />
        {tip && hover && (
          <div
            className="pointer-events-none absolute z-2 flex flex-col gap-[7px] rounded-lg bg-zinc-950 px-[13px] py-3 text-zinc-50 shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
            style={{
              width: tipWidth,
              left: Math.max(6, Math.min(hover.px + 14, size.w - tipWidth - 8)),
              top: Math.max(8, Math.min(hover.py - 12, size.h - 150)),
            }}
          >
            <div className="text-[12.5px]/[1.4] font-semibold">{tip.title}</div>
            <div className="flex flex-col gap-[5px]">
              {tip.rows.map(([k, v], i) => (
                <div key={i} className="flex flex-col gap-px">
                  <span className="text-[10.5px] tracking-[0.02em] text-zinc-400">{k}</span>
                  <span className="font-mono text-[12px]/[1.45] text-zinc-50">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-[11.5px] text-zinc-400">{caption}</p>
    </div>
  )
}
