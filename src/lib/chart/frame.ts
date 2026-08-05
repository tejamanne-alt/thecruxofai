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
