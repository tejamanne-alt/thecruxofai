/** Shared Canvas 2D plumbing for every chart on the site. */

export interface Frame {
  L: number
  R: number
  T: number
  B: number
  /** data x → pixel x */
  px: (v: number) => number
  /** data y → pixel y */
  py: (v: number) => number
  /** pixel x → data x. The inverse of px, for turning a pointer into a value. */
  ux: (p: number) => number
  /** pixel y → data y. */
  uy: (p: number) => number
}

/** Keep a dragged value inside the range the chart actually shows. */
export function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v
}

export interface AxisSpec {
  xmin: number
  xmax: number
  ymin: number
  ymax: number
  xlab: string
  ylab: string
}

function fmtTick(v: number) {
  return Math.abs(v) >= 10 || Number.isInteger(v) ? String(Math.round(v)) : v.toFixed(1)
}

export function drawAxes(g: CanvasRenderingContext2D, W: number, H: number, spec: AxisSpec): Frame {
  const { xmin, xmax, ymin, ymax, xlab, ylab } = spec
  const L = 56,
    R = W - 18,
    T = 18,
    B = H - 40

  const frame: Frame = {
    L,
    R,
    T,
    B,
    px: (v) => L + ((v - xmin) / (xmax - xmin)) * (R - L),
    py: (v) => B - ((v - ymin) / (ymax - ymin)) * (B - T),
    ux: (p) => xmin + ((p - L) / (R - L)) * (xmax - xmin),
    uy: (p) => ymin + ((B - p) / (B - T)) * (ymax - ymin),
  }

  for (let i = 0; i <= 5; i++) {
    const y = B - (i / 5) * (B - T)
    const val = ymin + (i / 5) * (ymax - ymin)
    g.strokeStyle = 'rgba(9,9,11,0.06)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(L, y)
    g.lineTo(R, y)
    g.stroke()
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'right'
    g.fillText(fmtTick(val), L - 10, y)
  }
  for (let i = 0; i <= 5; i++) {
    const x = L + (i / 5) * (R - L)
    const val = xmin + (i / 5) * (xmax - xmin)
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'center'
    g.fillText(fmtTick(val), x, B + 12)
  }

  g.strokeStyle = 'rgba(9,9,11,0.2)'
  g.lineWidth = 1
  g.beginPath()
  g.moveTo(L, T)
  g.lineTo(L, B)
  g.lineTo(R, B)
  g.stroke()

  g.fillStyle = '#71717a'
  g.textAlign = 'center'
  g.fillText(xlab, (L + R) / 2, B + 28)
  g.save()
  g.translate(16, (T + B) / 2)
  g.rotate(-Math.PI / 2)
  g.fillText(ylab, 0, 0)
  g.restore()

  return frame
}

/**
 * A single horizontal axis with the values laid along it, for statistics where
 * there is only one measurement and no second variable to plot against. The
 * frame's y range is a stack height in dots, so repeated values can pile up.
 */
export function drawNumberLine(
  g: CanvasRenderingContext2D,
  W: number,
  H: number,
  spec: { xmin: number; xmax: number; xlab: string; stacks?: number; baseline?: number }
): Frame {
  const { xmin, xmax, xlab } = spec
  const stacks = spec.stacks ?? 8
  const L = 30
  const R = W - 22
  const T = 16
  // The axis sits low, leaving the room above it for the stacked dots.
  const B = spec.baseline ?? H - 46

  const frame: Frame = {
    L,
    R,
    T,
    B,
    px: (v) => L + ((v - xmin) / (xmax - xmin)) * (R - L),
    py: (v) => B - (v / stacks) * (B - T),
    ux: (p) => xmin + ((p - L) / (R - L)) * (xmax - xmin),
    uy: (p) => ((B - p) / (B - T)) * stacks,
  }

  g.strokeStyle = 'rgba(9,9,11,0.28)'
  g.lineWidth = 1.5
  g.beginPath()
  g.moveTo(L, B)
  g.lineTo(R, B)
  g.stroke()

  // Six ticks, chosen so the numbers under them stay readable.
  for (let i = 0; i <= 5; i++) {
    const v = xmin + (i / 5) * (xmax - xmin)
    const x = frame.px(v)
    g.strokeStyle = 'rgba(9,9,11,0.28)'
    g.beginPath()
    g.moveTo(x, B)
    g.lineTo(x, B + 5)
    g.stroke()
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'center'
    g.fillText(fmtTick(v), x, B + 15)
  }

  g.fillStyle = '#71717a'
  g.textAlign = 'center'
  g.fillText(xlab, (L + R) / 2, B + 33)
  return frame
}

export function dot(g: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, ring?: string | null) {
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fillStyle = fill
  g.fill()
  if (ring) {
    g.lineWidth = 2
    g.strokeStyle = ring
    g.stroke()
  }
}

/**
 * A square plane with the origin in the middle and cross-hair axes, for charts
 * about vectors and transformations. `drawAxes` puts its L-shaped axis at the
 * left and bottom edges, which hides the origin — and the origin is the whole
 * point when you are watching arrows move.
 *
 * The frame is kept square in *data* units per pixel, so a rotation looks like
 * a rotation instead of a squash.
 */
export function drawPlane(g: CanvasRenderingContext2D, W: number, H: number, span: number): Frame {
  const pad = 18
  const size = Math.min(W - pad * 2, H - pad * 2)
  const cx = W / 2
  const cy = H / 2
  const scale = size / (span * 2)

  const frame: Frame = {
    L: cx - size / 2,
    R: cx + size / 2,
    T: cy - size / 2,
    B: cy + size / 2,
    px: (v) => cx + v * scale,
    py: (v) => cy - v * scale,
    ux: (p) => (p - cx) / scale,
    uy: (p) => (cy - p) / scale,
  }

  g.save()
  g.beginPath()
  g.rect(frame.L, frame.T, frame.R - frame.L, frame.B - frame.T)
  g.clip()

  for (let i = -span; i <= span; i++) {
    const onAxis = i === 0
    g.strokeStyle = onAxis ? 'rgba(9,9,11,0.35)' : 'rgba(9,9,11,0.08)'
    g.lineWidth = onAxis ? 1.5 : 1
    g.beginPath()
    g.moveTo(frame.px(i), frame.T)
    g.lineTo(frame.px(i), frame.B)
    g.moveTo(frame.L, frame.py(i))
    g.lineTo(frame.R, frame.py(i))
    g.stroke()
  }
  g.restore()

  g.fillStyle = '#a1a1aa'
  g.textAlign = 'center'
  g.fillText('0', frame.px(0) - 10, frame.py(0) + 11)
  return frame
}

/** An arrow from the origin (or anywhere) — the standard way to draw a vector. */
export function arrow(
  g: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colour: string,
  width = 2.5
) {
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy)
  if (len < 1) return
  const ux = dx / len
  const uy = dy / len
  const head = Math.min(11, len * 0.4)

  g.strokeStyle = colour
  g.lineWidth = width
  g.beginPath()
  g.moveTo(x0, y0)
  // Stop short so the shaft does not poke through the head.
  g.lineTo(x1 - ux * head * 0.7, y1 - uy * head * 0.7)
  g.stroke()

  g.fillStyle = colour
  g.beginPath()
  g.moveTo(x1, y1)
  g.lineTo(x1 - ux * head - uy * head * 0.45, y1 - uy * head + ux * head * 0.45)
  g.lineTo(x1 - ux * head + uy * head * 0.45, y1 - uy * head - ux * head * 0.45)
  g.closePath()
  g.fill()
}

/**
 * A grip: the visual promise that something can be picked up. Without one, a
 * draggable mark is a feature nobody discovers.
 */
export function grip(g: CanvasRenderingContext2D, x: number, y: number, colour: string, r = 6) {
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fillStyle = '#fff'
  g.fill()
  g.lineWidth = 2.5
  g.strokeStyle = colour
  g.stroke()
}

/** The ring that marks whatever the pointer is nearest. */
export function halo(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath()
  g.arc(x, y, r + 6, 0, Math.PI * 2)
  g.strokeStyle = 'rgba(9,9,11,0.35)'
  g.lineWidth = 1.5
  g.stroke()
}

/** The site accent, read off the CSS custom property so there is one source. */
export function accentColour() {
  if (typeof window === 'undefined') return '#4f46e5'
  const v = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()
  return v || '#4f46e5'
}

export function accentTint(alpha: number) {
  const hex = accentColour().replace('#', '')
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex
  const n = parseInt(full, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}

/** Cluster palette: the accent first, then four fixed hues. */
export function palette() {
  return [accentColour(), '#0d9488', '#d97706', '#db2777', '#7c3aed']
}
