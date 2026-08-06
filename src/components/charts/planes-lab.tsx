'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { ChartRow, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/**
 * Three equations in three unknowns, drawn as three flat sheets in a box you
 * can spin. Reading "two planes meet in a line" is easy to nod along to and
 * hard to actually picture; turning it round with your finger fixes that in
 * about five seconds.
 */
interface V3 {
  x: number
  y: number
  z: number
}
interface Plane {
  n: V3
  d: number
  colour: string
  label: string
}

const BOX = 3
const TEAL = '#0d9488'
const AMBER = '#d97706'

const CORNERS: V3[] = []
for (const x of [-BOX, BOX]) for (const y of [-BOX, BOX]) for (const z of [-BOX, BOX]) CORNERS.push({ x, y, z })

/** The 12 edges of the box, as pairs of corner indices. */
const EDGES: Array<[number, number]> = []
for (let i = 0; i < 8; i++) {
  for (let j = i + 1; j < 8; j++) {
    const a = CORNERS[i]
    const b = CORNERS[j]
    const same = (a.x === b.x ? 1 : 0) + (a.y === b.y ? 1 : 0) + (a.z === b.z ? 1 : 0)
    if (same === 2) EDGES.push([i, j])
  }
}

const dotp = (a: V3, b: V3) => a.x * b.x + a.y * b.y + a.z * b.z
const cross = (a: V3, b: V3): V3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
})

/** Where a plane cuts the box: the corners of the slice, in drawing order. */
function slice(p: Plane): V3[] {
  const pts: V3[] = []
  for (const [i, j] of EDGES) {
    const a = CORNERS[i]
    const b = CORNERS[j]
    const da = dotp(p.n, a) - p.d
    const db = dotp(p.n, b) - p.d
    if (da === 0) pts.push(a)
    else if (da * db < 0) {
      const t = da / (da - db)
      pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t })
    }
  }
  if (pts.length < 3) return []

  // Sort them round the middle so the polygon does not come out as a bow-tie.
  const c = pts.reduce(
    (s, q) => ({ x: s.x + q.x / pts.length, y: s.y + q.y / pts.length, z: s.z + q.z / pts.length }),
    {
      x: 0,
      y: 0,
      z: 0,
    }
  )
  let u = cross(p.n, { x: 0, y: 0, z: 1 })
  if (Math.hypot(u.x, u.y, u.z) < 1e-6) u = cross(p.n, { x: 1, y: 0, z: 0 })
  const ul = Math.hypot(u.x, u.y, u.z)
  u = { x: u.x / ul, y: u.y / ul, z: u.z / ul }
  const v = cross(p.n, u)
  const vl = Math.hypot(v.x, v.y, v.z)
  const w = { x: v.x / vl, y: v.y / vl, z: v.z / vl }
  return pts
    .map((q) => {
      const r = { x: q.x - c.x, y: q.y - c.y, z: q.z - c.z }
      return { q, ang: Math.atan2(dotp(r, w), dotp(r, u)) }
    })
    .sort((a, b) => a.ang - b.ang)
    .map((e) => e.q)
}

/**
 * The third sheet, as three whole-number choices.
 *
 * Sliding one plane about cannot show all three outcomes, and it took a wrong
 * version of this file to notice why. The first two normals span every vector
 * whose 1st and 3rd parts match, so moving a sheet with a normal outside that
 * set never makes the determinant zero — no amount of sliding reaches "endless"
 * or "none". The third sheet has to *tilt*, not slide. Three presets do that
 * and keep every equation in whole numbers.
 */
const THIRD = [
  { id: 'one', button: 'Cross at one point', n: { x: 0, y: 1, z: 1 }, d: 1, label: 'y + z = 1' },
  { id: 'many', button: 'Hold the whole line', n: { x: 2, y: 0, z: 2 }, d: 1, label: '2x + 2z = 1' },
  { id: 'none', button: 'Miss it completely', n: { x: 2, y: 0, z: 2 }, d: 5, label: '2x + 2z = 5' },
] as const

export function PlanesLab() {
  const [yaw, setYaw] = useState(0.7)
  const [pick, setPick] = useState<string>('one')
  const third = THIRD.find((t) => t.id === pick) ?? THIRD[0]

  const planes: Plane[] = [
    { n: { x: 1, y: 1, z: 1 }, d: 1, colour: '#4f46e5', label: 'x + y + z = 1' },
    { n: { x: 1, y: -1, z: 1 }, d: 0, colour: TEAL, label: 'x − y + z = 0' },
    { n: third.n, d: third.d, colour: AMBER, label: third.label },
  ]

  // Do the three sheets share one point, a whole line, or nothing? Worked out
  // from the geometry, never from which button is pressed — a panel that reads
  // its answer off the button would keep saying it even when it is wrong.
  const [A, B, C] = planes
  const det =
    A.n.x * (B.n.y * C.n.z - B.n.z * C.n.y) -
    A.n.y * (B.n.x * C.n.z - B.n.z * C.n.x) +
    A.n.z * (B.n.x * C.n.y - B.n.y * C.n.x)
  const single = Math.abs(det) > 1e-9

  // When the determinant is zero the third sheet is parallel to the shared
  // line. It either contains that line or misses it, and testing one point of
  // the line settles which.
  let holdsLine = false
  if (!single) {
    const denom = A.n.x * B.n.y - A.n.y * B.n.x
    if (Math.abs(denom) > 1e-9) {
      const p0 = { x: (A.d * B.n.y - B.d * A.n.y) / denom, y: (A.n.x * B.d - B.n.x * A.d) / denom, z: 0 }
      holdsLine = Math.abs(dotp(C.n, p0) - C.d) < 1e-9
    }
  }

  const project = (p: V3, W: number, H: number) => {
    const cs = Math.cos(yaw)
    const sn = Math.sin(yaw)
    const rx = p.x * cs - p.y * sn
    const ry = p.x * sn + p.y * cs
    const scale = Math.min(W, H) / (BOX * 3.2)
    return { x: W / 2 + rx * scale, y: H / 2 + (ry * 0.5 - p.z) * scale }
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    // Read the site accent at paint time, but build a fresh list rather than
    // writing into `planes` — that array belongs to the render that made it.
    const shown = planes.map((p, i) => (i === 0 ? { ...p, colour: acc } : p))

    // The box, so there is something for the sheets to sit inside.
    g.strokeStyle = 'rgba(9,9,11,0.16)'
    g.lineWidth = 1
    for (const [i, j] of EDGES) {
      const a = project(CORNERS[i], W, H)
      const b = project(CORNERS[j], W, H)
      g.beginPath()
      g.moveTo(a.x, a.y)
      g.lineTo(b.x, b.y)
      g.stroke()
    }

    for (const p of shown) {
      const poly = slice(p)
      if (poly.length < 3) continue
      g.beginPath()
      poly.forEach((q, i) => {
        const s = project(q, W, H)
        if (i) g.lineTo(s.x, s.y)
        else g.moveTo(s.x, s.y)
      })
      g.closePath()
      g.globalAlpha = 0.26
      g.fillStyle = p.colour
      g.fill()
      g.globalAlpha = 1
      g.lineWidth = 2
      g.strokeStyle = p.colour
      g.stroke()
    }

    // Where the first two sheets cut each other: their shared line.
    const dir = cross(A.n, B.n)
    const dl = Math.hypot(dir.x, dir.y, dir.z)
    if (dl > 1e-9) {
      // A point on both planes, found by solving in the plane z = t.
      const denom = A.n.x * B.n.y - A.n.y * B.n.x
      if (Math.abs(denom) > 1e-9) {
        const p0 = { x: (A.d * B.n.y - B.d * A.n.y) / denom, y: (A.n.x * B.d - B.n.x * A.d) / denom, z: 0 }
        const u = { x: dir.x / dl, y: dir.y / dl, z: dir.z / dl }
        const s = project({ x: p0.x - u.x * 6, y: p0.y - u.y * 6, z: p0.z - u.z * 6 }, W, H)
        const e = project({ x: p0.x + u.x * 6, y: p0.y + u.y * 6, z: p0.z + u.z * 6 }, W, H)
        g.strokeStyle = '#18181b'
        g.lineWidth = 3
        g.beginPath()
        g.moveTo(s.x, s.y)
        g.lineTo(e.x, e.y)
        g.stroke()
      }
    }

    g.textAlign = 'left'
    g.font = '11px Inter, sans-serif'
    shown.forEach((p, i) => {
      g.fillStyle = p.colour
      g.fillText(p.label, 14, 16 + i * 16)
    })
    g.fillStyle = '#18181b'
    g.fillText('black line = where the first two sheets meet', 14, 16 + 3 * 16)

    // The frame maps pixels to an angle, so dragging the full width of the
    // canvas spins the box exactly once round rather than by some guessed rate.
    const fr: Frame = {
      L: 0,
      R: W,
      T: 0,
      B: H,
      px: (v) => W / 2 + (v / Math.PI) * (W / 2),
      py: (v) => v,
      ux: (p) => ((p - W / 2) / (W / 2)) * Math.PI,
      uy: (p) => p,
    }
    return fr
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={420}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ yaw }}
          jumpKey={pick}
          handles={(f: Frame) => [{ id: 'spin', px: f.px(yaw), py: f.B / 2, grab: 'anywhere' }]}
          onDragTo={(_id, a) => setYaw(clamp(a, -Math.PI, Math.PI))}
          caption="Drag left and right to spin the box. Then try each of the three buttons and watch what the orange sheet does to the black line."
        />
      }
      panel={
        <>
          <ReadOut
            label="Where do all three meet?"
            value={single ? 'At one point' : holdsLine ? 'Along the whole line' : 'Nowhere'}
            tone={single ? '#09090b' : holdsLine ? TEAL : '#dc2626'}
            note={
              single
                ? 'The orange sheet cuts straight through the black line at one spot. That spot is the one answer.'
                : holdsLine
                  ? 'The orange sheet contains the whole black line, so every point on it works. Endless answers.'
                  : 'The orange sheet runs alongside the black line and never touches it. No answer.'
            }
          />

          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Change the orange sheet
            </div>
            {THIRD.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPick(t.id)}
                className={
                  'cursor-pointer rounded-md border px-2.5 py-2 text-left text-[12.5px] font-semibold ' +
                  (t.id === pick
                    ? 'border-zinc-950/90 bg-zinc-900 text-white'
                    : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]')
                }
              >
                {t.button}
                <span className="ml-2 font-mono text-[11px] font-normal opacity-70">{t.label}</span>
              </button>
            ))}
          </div>

          <Slider
            label="spin the box"
            value={yaw}
            display={`${Math.round((yaw * 180) / Math.PI)}°`}
            min={-3.14}
            max={3.14}
            step={0.02}
            hint="Or just drag the picture."
            onChange={setYaw}
          />

          <PanelNote>
            Two sheets always cross in a line, unless they are parallel. So the third sheet decides everything: hit the
            line at a point, hold the whole line, or miss it.
          </PanelNote>
        </>
      }
    />
  )
}
