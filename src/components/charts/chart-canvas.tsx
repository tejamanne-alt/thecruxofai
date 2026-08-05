'use client'

import type { Frame } from '@/lib/chart/frame'
import clsx from 'clsx'
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

/**
 * A mark the pointer can pick up and move. Handles are hit-tested before
 * anything else, so a handle sitting on top of a data point still wins.
 */
export interface DragHandle {
  id: string
  px: number
  py: number
  /** Grab radius in pixels. Generous by default — fingers are not precise. */
  radius?: number
  /**
   * `anywhere` lets a press land nowhere near the mark and still pick it up:
   * the mark jumps to the press and the drag carries on from there. That is the
   * right behaviour for anything with one degree of freedom — a marker riding a
   * curve, a boundary sliding along its normal — where the reader is pointing
   * at a position, not at a dot. Handles found by proximity always win, so a
   * chart can mix the two.
   */
  grab?: 'near' | 'anywhere'
}

const GRAB_RADIUS = 20

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
  /**
   * Marks the reader can pick up. Supplying these turns the chart from
   * something you watch into something you operate, which is the whole point
   * of the site — so prefer adding a handle over adding another slider.
   */
  handles?: (f: Frame) => DragHandle[]
  /**
   * Where the handle was dragged to, in data coordinates. Clamp it to whatever
   * range makes sense; the chart does not assume.
   */
  onDragTo?: (id: string, x: number, y: number) => void
}

export function ChartCanvas({
  draw,
  candidates,
  tooltip,
  targets,
  jumpKey,
  height = 400,
  caption,
  handles,
  onDragTo,
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
  const [dragging, setDragging] = useState<string | null>(null)
  const [overHandle, setOverHandle] = useState(false)
  // Read by the touchstart listener, which is attached once and must not close
  // over a stale handles function. Refreshed in the effect below.
  const handlesRef = useRef(handles)

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
    handlesRef.current = handles

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

    // A touch landing on a handle must not also start a page scroll. Doing it
    // here, non-passively and only when a handle is actually under the finger,
    // keeps the rest of the chart scrollable — `touch-action: none` on the
    // canvas would trap the page behind a 400px-tall element on a phone.
    const onTouchStart = (ev: TouchEvent) => {
      const f = frameRef.current
      const t = ev.touches[0]
      if (!f || !t || !handlesRef.current) return
      const r = node.getBoundingClientRect()
      const mx = t.clientX - r.left
      const my = t.clientY - r.top
      const near = handlesRef.current(f).some((h) => {
        const lim = h.radius ?? GRAB_RADIUS
        return (h.px - mx) ** 2 + (h.py - my) ** 2 < lim * lim
      })
      if (near) ev.preventDefault()
    }
    node.addEventListener('touchstart', onTouchStart, { passive: false })

    return () => {
      ro.disconnect()
      node.removeEventListener('touchstart', onTouchStart)
    }
  }, [height])

  /** Pointer position in canvas pixels. */
  function local(e: { clientX: number; clientY: number }) {
    const c = canvasRef.current
    if (!c) return null
    const r = c.getBoundingClientRect()
    return { mx: e.clientX - r.left, my: e.clientY - r.top }
  }

  function handleNear(f: Frame, mx: number, my: number) {
    let best: DragHandle | null = null
    let bd = Infinity
    for (const h of handles?.(f) ?? []) {
      const d = (h.px - mx) ** 2 + (h.py - my) ** 2
      const lim = h.radius ?? GRAB_RADIUS
      if (d < bd && d < lim * lim) {
        bd = d
        best = h
      }
    }
    return best
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const f = frameRef.current
    const at = local(e)
    if (!f || !at || !onDragTo) return

    const inPlot = at.mx >= f.L && at.mx <= f.R && at.my >= f.T && at.my <= f.B
    const near = handleNear(f, at.mx, at.my)
    // Falling back to a grab-anywhere handle is what makes "press the line and
    // the marker comes to you" the same gesture as dragging it, rather than a
    // separate one that stops the moment you move.
    const grabbed = near ?? (inPlot ? (handles?.(f).find((h) => h.grab === 'anywhere') ?? null) : null)
    if (!grabbed) return

    onDragTo(grabbed.id, f.ux(at.mx), f.uy(at.my))

    // A touch that started away from the mark stays a tap. The browser has
    // already claimed that gesture for scrolling — only a touch landing on the
    // handle itself gets preventDefault (see the touchstart listener) — and
    // dragging while the page scrolls under the finger is worse than not
    // dragging at all. Mouse and pen have no such conflict.
    if (!near && e.pointerType === 'touch') return

    // Capture so the drag survives the pointer leaving the canvas — letting go
    // outside the chart should still end cleanly.
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(grabbed.id)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const f = frameRef.current
    const at = local(e)
    if (!f || !at) return

    if (dragging && onDragTo) {
      onDragTo(dragging, f.ux(at.mx), f.uy(at.my))
      return
    }

    const near = handleNear(f, at.mx, at.my)
    if (!!near !== overHandle) setOverHandle(!!near)

    let best: HitTarget | null = null
    let bd = Infinity
    for (const t of candidates(f)) {
      const d = (t.px - at.mx) ** 2 + (t.py - at.my) ** 2
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

  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setDragging(null)
  }

  const tip = hover ? tooltip(hover) : null
  const tipWidth = Math.max(150, Math.min(250, size.w - 20))

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 p-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            if (!dragging && hover) setHover(null)
            if (overHandle) setOverHandle(false)
          }}
          style={{ height }}
          className={clsx(
            'block w-full touch-pan-y select-none',
            dragging ? 'cursor-grabbing' : overHandle ? 'cursor-grab' : 'cursor-crosshair'
          )}
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
      <p className="text-[11.5px] text-zinc-400">
        {caption ??
          (handles
            ? 'Drag the markers — or just press where you want one, and it comes to you. Hover anything for the numbers behind it.'
            : 'Hover anything on the chart — every dot, flag and marker explains itself.')}
      </p>
    </div>
  )
}
