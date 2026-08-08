'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2

const dot = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x * b.x + a.y * b.y
const norm = (a: { x: number; y: number }) => Math.hypot(a.x, a.y)

/** A right-angle tick, drawn where two segments meet at 90°. */
function rightAngle(
  g: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  ux: number,
  uy: number,
  vx: number,
  vy: number
) {
  const s = 11
  g.strokeStyle = 'rgba(9,9,11,0.5)'
  g.lineWidth = 1.2
  g.beginPath()
  g.moveTo(cx + ux * s, cy + uy * s)
  g.lineTo(cx + ux * s + vx * s, cy + uy * s + vy * s)
  g.lineTo(cx + vx * s, cy + vy * s)
  g.stroke()
}

/* ========================================================================== */
/* Part 8 — the dot product                                                   */
/* ========================================================================== */

export function DotProductLab() {
  const [a, setA] = useState({ x: 4, y: 1 })
  const [b, setB] = useState({ x: 2, y: 3 })

  const d = dot(a, b)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    // Shade by sign, so "which way are they leaning" is visible before the number.
    const nb = norm(b)
    if (nb > 0.01) {
      const ux = b.x / nb
      const uy = b.y / nb
      const proj = dot(a, b) / nb
      g.strokeStyle = d >= 0 ? 'rgba(13,148,136,0.5)' : 'rgba(220,38,38,0.5)'
      g.lineWidth = 8
      g.beginPath()
      g.moveTo(O.px, O.py)
      g.lineTo(f.px(ux * proj), f.py(uy * proj))
      g.stroke()
      g.setLineDash([4, 4])
      g.strokeStyle = 'rgba(9,9,11,0.25)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(f.px(a.x), f.py(a.y))
      g.lineTo(f.px(ux * proj), f.py(uy * proj))
      g.stroke()
      g.setLineDash([])
    }

    arrow(g, O.px, O.py, f.px(a.x), f.py(a.y), acc, 2.5)
    arrow(g, O.px, O.py, f.px(b.x), f.py(b.y), ORANGE, 2.5)
    grip(g, f.px(a.x), f.py(a.y), acc, 7)
    grip(g, f.px(b.x), f.py(b.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          handles={(f) => [
            { id: 'a', px: f.px(a.x), py: f.py(a.y) },
            { id: 'b', px: f.px(b.x), py: f.py(b.y) },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) }
            if (id === 'a') setA(p)
            else setB(p)
          }}
          caption="Drag either arrow. The thick bar is how much of a lies along b — teal when the dot product is positive, red when it is negative."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'a', value: `(${a.x}, ${a.y})` },
              { label: 'b', value: `(${b.x}, ${b.y})` },
              { label: 'a·b', value: String(d) },
              { label: 'sign', value: d > 0 ? 'positive' : d < 0 ? 'negative' : 'zero' },
            ]}
          />
          <PanelNote>
            {d > 0
              ? 'Positive: the two arrows are leaning the same way — the angle between them is less than 90°.'
              : d < 0
                ? 'Negative: they lean opposite ways — the angle is more than 90°.'
                : 'Exactly zero: the two arrows are at right angles. That is what orthogonal means, and it is the case worth spotting.'}
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Worked out the way the slide writes it
        </div>
        <div className="font-mono text-[13px]/[1.9] text-zinc-800">
          a·b = aᵀb = ({a.x})({b.x}) + ({a.y})({b.y}) = {a.x * b.x} {a.y * b.y < 0 ? '−' : '+'} {Math.abs(a.y * b.y)} ={' '}
          <strong>{d}</strong>
        </div>
      </div>

      <LabNote>
        The rule could not be simpler: multiply the matching parts and add them up. Two lists in, one plain{' '}
        <strong>number</strong> out — that is the whole thing, and it is why the dot product is also written{' '}
        <span className="font-mono">aᵀb</span>: a row times a column is a 1 × 1 matrix, which is just a number.
      </LabNote>
      <LabNote>
        Slide 13’s example: a = (1, 0, 2) and b = (−1, 2, 1) give (1)(−1) + (0)(2) + (2)(1) = 1. It works in any number
        of dimensions, even though the picture above only goes up to two.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 9 — length, and the two inequalities                                  */
/* ========================================================================== */

export function NormLab() {
  const [a, setA] = useState({ x: 3, y: 4 })
  const [b, setB] = useState({ x: 1, y: 2 })

  const na = norm(a)
  const nb = norm(b)
  const d = dot(a, b)
  const sum = { x: a.x + b.x, y: a.y + b.y }
  const nsum = norm(sum)
  const cauchy = Math.abs(d) <= na * nb + 1e-9
  const triangle = nsum <= na + nb + 1e-9
  const isSlide = a.x === 3 && a.y === 4 && b.x === 1 && b.y === 2

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN + 2)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    // The right triangle behind Pythagoras, which is all the norm formula is.
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.2
    g.beginPath()
    g.moveTo(O.px, O.py)
    g.lineTo(f.px(a.x), O.py)
    g.lineTo(f.px(a.x), f.py(a.y))
    g.stroke()
    g.setLineDash([])
    if (Math.abs(a.x) > 0.2 && Math.abs(a.y) > 0.2) {
      rightAngle(g, f.px(a.x), O.py, a.x > 0 ? -1 : 1, 0, 0, a.y > 0 ? -1 : 1)
    }

    // The triangle-inequality picture: go along a, then along b.
    arrow(g, f.px(a.x), f.py(a.y), f.px(sum.x), f.py(sum.y), ORANGE, 2)
    arrow(g, O.px, O.py, f.px(sum.x), f.py(sum.y), TEAL, 2.5)
    arrow(g, O.px, O.py, f.px(a.x), f.py(a.y), acc, 3)

    g.fillStyle = '#71717a'
    g.textAlign = 'center'
    g.fillText(`${Math.abs(a.x)}`, (O.px + f.px(a.x)) / 2, O.py + 14)
    g.textAlign = 'left'
    g.fillText(`${Math.abs(a.y)}`, f.px(a.x) + 7, (O.py + f.py(a.y)) / 2)

    grip(g, f.px(a.x), f.py(a.y), acc, 7)
    grip(g, f.px(sum.x), f.py(sum.y), TEAL, 6)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={350}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          handles={(f) => [
            { id: 'a', px: f.px(a.x), py: f.py(a.y) },
            { id: 'sum', px: f.px(sum.x), py: f.py(sum.y) },
          ]}
          onDragTo={(id, x, y) => {
            const px = snap(clamp(x, -SPAN - 2, SPAN + 2))
            const py = snap(clamp(y, -SPAN - 2, SPAN + 2))
            if (id === 'a') setA({ x: px, y: py })
            else setB({ x: px - a.x, y: py - a.y })
          }}
          caption="Drag the coloured tip to change a, or the teal tip to change where a + b ends up. The dashed triangle is Pythagoras."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: '‖a‖', value: na.toFixed(3) },
              { label: '‖b‖', value: nb.toFixed(3) },
              { label: '‖a‖‖b‖', value: (na * nb).toFixed(3) },
              { label: '|a·b|', value: Math.abs(d).toFixed(3) },
            ]}
          />
          <PanelNote>
            The norm is just the length of the arrow, and the formula √(a₁² + a₂²) is Pythagoras on the dashed triangle.
            In more dimensions you cannot draw it, but you square, add and take the root exactly the same way.
          </PanelNote>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Verdict ok={cauchy}>
          <strong>Cauchy–Schwarz:</strong> |a·b| ≤ ‖a‖‖b‖ — here {Math.abs(d).toFixed(3)} ≤ {(na * nb).toFixed(3)}. The
          two sides are only equal when the arrows lie along each other.
        </Verdict>
        <Verdict ok={triangle}>
          <strong>Triangle:</strong> ‖a + b‖ ≤ ‖a‖ + ‖b‖ — here {nsum.toFixed(3)} ≤ {(na + nb).toFixed(3)}. Going
          straight there is never further than going via a corner.
        </Verdict>
      </div>

      <Btn
        onClick={() => {
          setA({ x: 3, y: 4 })
          setB({ x: 1, y: 2 })
        }}
      >
        Load slide 17’s numbers
      </Btn>

      {isSlide && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Slide 17, exactly
          </div>
          <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
            {`a = (3, 4),  b = (1, 2)

‖a‖ = √(3² + 4²) = √25 = 5
‖b‖ = √(1² + 2²) = √5  ≈ 2.236
‖a‖‖b‖ = 5√5 ≈ 11.18

aᵀb = 3 + 8 = 11

|11| ≤ 11.18   ✓  Cauchy–Schwarz holds`}
          </div>
        </div>
      )}

      <LabNote>
        Try to break Cauchy–Schwarz by dragging. You cannot: the closest you will get is making the two arrows point
        exactly the same way, and then the two sides are equal. That is the only case where they meet, and it is worth
        remembering — equality means the vectors are dependent.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — angle and orthogonality                                          */
/* ========================================================================== */

const ANGLE_PRESETS = [
  { id: 'orth', label: 'Slide 18 — (2,2) and (2,−2)', a: { x: 2, y: 2 }, b: { x: 2, y: -2 } },
  { id: 'same', label: 'Pointing the same way', a: { x: 3, y: 1 }, b: { x: 4.5, y: 1.5 } },
  { id: 'opp', label: 'Pointing opposite ways', a: { x: 3, y: 1 }, b: { x: -3, y: -1 } },
] as const
type AngleId = (typeof ANGLE_PRESETS)[number]['id']

export function AngleLab() {
  const [pick, setPick] = useState<AngleId>('orth')
  const [a, setA] = useState({ x: 2, y: 2 })
  const [b, setB] = useState({ x: 2, y: -2 })

  const na = norm(a)
  const nb = norm(b)
  const d = dot(a, b)
  const cosA = na > 0.01 && nb > 0.01 ? clamp(d / (na * nb), -1, 1) : NaN
  const deg = (Math.acos(cosA) * 180) / Math.PI
  const orthogonal = d === 0 && na > 0.01 && nb > 0.01

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    if (isFinite(deg)) {
      // The wedge between the two arrows, so the angle read-out has a picture.
      const t1 = Math.atan2(-a.y, a.x)
      const t2 = Math.atan2(-b.y, b.x)
      let lo = t1
      let hi = t2
      if ((hi - lo + Math.PI * 4) % (Math.PI * 2) > Math.PI) [lo, hi] = [t2, t1]
      g.beginPath()
      g.moveTo(O.px, O.py)
      g.arc(O.px, O.py, 44, lo, hi)
      g.closePath()
      g.fillStyle = orthogonal ? 'rgba(13,148,136,0.22)' : 'rgba(79,70,229,0.14)'
      g.fill()
      g.fillStyle = '#3f3f46'
      g.textAlign = 'center'
      g.fillText(`${deg.toFixed(1)}°`, O.px + 64 * Math.cos((lo + hi) / 2), O.py + 64 * Math.sin((lo + hi) / 2))
    }

    arrow(g, O.px, O.py, f.px(a.x), f.py(a.y), acc, 2.5)
    arrow(g, O.px, O.py, f.px(b.x), f.py(b.y), ORANGE, 2.5)
    grip(g, f.px(a.x), f.py(a.y), acc, 7)
    grip(g, f.px(b.x), f.py(b.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={ANGLE_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          const s = ANGLE_PRESETS.find((x) => x.id === id)!
          setPick(id)
          setA({ ...s.a })
          setB({ ...s.b })
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [
            { id: 'a', px: f.px(a.x), py: f.py(a.y) },
            { id: 'b', px: f.px(b.x), py: f.py(b.y) },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) }
            setPick('' as AngleId)
            if (id === 'a') setA(p)
            else setB(p)
          }}
          caption="Drag either arrow and watch the angle. Try to get the dot product to land on exactly 0."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'a·b', value: String(d) },
              { label: '‖a‖‖b‖', value: (na * nb).toFixed(3) },
              { label: 'cos α', value: isFinite(cosA) ? cosA.toFixed(3) : '—' },
              { label: 'α', value: isFinite(deg) ? `${deg.toFixed(1)}°` : '—' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={d > 0} label="under 90°" />
            <Chip on={orthogonal} label="exactly 90°" />
            <Chip on={d < 0} label="over 90°" />
          </div>
          <PanelNote>
            Dividing by ‖a‖‖b‖ is what turns the dot product into an angle. Cauchy–Schwarz guarantees the result sits
            between −1 and 1, so the cos⁻¹ always has something legal to work on.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={orthogonal}>
        {orthogonal
          ? `The dot product is exactly 0, so α = 90° and a and b are orthogonal. Slide 18's example is this: (2, 2)·(2, −2) = 4 − 4 = 0.`
          : `a·b = ${d}, which is not zero, so these two are not orthogonal — the angle is ${isFinite(deg) ? deg.toFixed(1) : '—'}°.`}
      </Verdict>

      <LabNote>
        <strong>Orthogonal</strong> is the proper word for “at right angles”. The useful thing is that you never have to
        work out an angle to check it — just see whether the dot product is zero. That test costs a few multiplications
        and works in a thousand dimensions, where the word “angle” stops being something you can picture at all.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — projection                                                       */
/* ========================================================================== */

export function ProjectionLab() {
  const [v1, setV1] = useState({ x: 3, y: 0 })
  const [v2, setV2] = useState({ x: 2, y: 4 })

  const n1sq = dot(v1, v1)
  const lam = n1sq > 0.001 ? dot(v2, v1) / n1sq : 0
  const v = { x: lam * v1.x, y: lam * v1.y }
  const u = { x: v2.x - v.x, y: v2.y - v.y }
  const check = dot(u, v1)
  const isSlide = v1.x === 3 && v1.y === 0 && v2.x === 2 && v2.y === 4

  const nice = (n: number) => (Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(2))

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    // The line v₁ points along, so it is clear the projection has to land on it.
    const nn = Math.hypot(v1.x, v1.y) || 1
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.2)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.px((-v1.x / nn) * SPAN * 1.5), f.py((-v1.y / nn) * SPAN * 1.5))
    g.lineTo(f.px((v1.x / nn) * SPAN * 1.5), f.py((v1.y / nn) * SPAN * 1.5))
    g.stroke()
    g.setLineDash([])

    // u, joining the tip of v to the tip of v₂, is the bit left over.
    g.strokeStyle = TEAL
    g.lineWidth = 2
    g.setLineDash([5, 3])
    g.beginPath()
    g.moveTo(f.px(v.x), f.py(v.y))
    g.lineTo(f.px(v2.x), f.py(v2.y))
    g.stroke()
    g.setLineDash([])

    const ul = Math.hypot(u.x, u.y)
    if (ul > 0.3 && nn > 0.3) rightAngle(g, f.px(v.x), f.py(v.y), v1.x / nn, -v1.y / nn, u.x / ul, -u.y / ul)

    arrow(g, O.px, O.py, f.px(v1.x), f.py(v1.y), acc, 2.5)
    arrow(g, O.px, O.py, f.px(v2.x), f.py(v2.y), ORANGE, 2.5)
    arrow(g, O.px, O.py, f.px(v.x), f.py(v.y), '#09090b', 3.5)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('v₁', f.px(v1.x) + 9, f.py(v1.y) + 12)
    g.fillText('v₂', f.px(v2.x) + 9, f.py(v2.y) - 8)
    g.fillText('v', f.px(v.x) + 6, f.py(v.y) - 10)
    g.fillStyle = TEAL
    g.fillText('u', (f.px(v.x) + f.px(v2.x)) / 2 + 8, (f.py(v.y) + f.py(v2.y)) / 2)

    grip(g, f.px(v1.x), f.py(v1.y), acc, 7)
    grip(g, f.px(v2.x), f.py(v2.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={350}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          handles={(f) => [
            { id: 'v1', px: f.px(v1.x), py: f.py(v1.y) },
            { id: 'v2', px: f.px(v2.x), py: f.py(v2.y) },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) }
            if (id === 'v1') setV1(p)
            else setV2(p)
          }}
          caption="Drag v₂ and watch the black shadow slide along v₁. The teal dashed piece always meets v₁ at a right angle."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'v₂ᵀv₁', value: nice(dot(v2, v1)) },
              { label: 'v₁ᵀv₁', value: nice(n1sq) },
              { label: 'v (the shadow)', value: `(${nice(v.x)}, ${nice(v.y)})` },
              { label: 'u = v₂ − v', value: `(${nice(u.x)}, ${nice(u.y)})` },
            ]}
          />
          <Verdict ok={Math.abs(check) < 1e-9}>
            u·v₁ = {nice(check)}. The leftover piece really is at right angles to v₁ — every time, whatever you drag.
          </Verdict>
          <Btn
            onClick={() => {
              setV1({ x: 3, y: 0 })
              setV2({ x: 2, y: 4 })
            }}
          >
            Load slide 20’s numbers
          </Btn>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          {isSlide ? 'Slide 20, exactly' : 'The same steps on what you have dragged'}
        </div>
        <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`v₁ = (${nice(v1.x)}, ${nice(v1.y)})    v₂ = (${nice(v2.x)}, ${nice(v2.y)})

v = (v₂ᵀv₁ / v₁ᵀv₁) v₁ = (${nice(dot(v2, v1))} / ${nice(n1sq)}) (${nice(v1.x)}, ${nice(v1.y)}) = (${nice(v.x)}, ${nice(v.y)})

u = v₂ − v = (${nice(v2.x)}, ${nice(v2.y)}) − (${nice(v.x)}, ${nice(v.y)}) = (${nice(u.x)}, ${nice(u.y)})

check:  u · v₁ = ${nice(check)}   ${Math.abs(check) < 1e-9 ? '✓ right angle' : ''}`}
        </div>
      </div>

      <LabNote>
        The <strong>projection</strong> of v₂ onto v₁ is the shadow v₂ casts on the line through v₁. Slide 19 gets the
        formula by insisting on one thing: whatever is left over, u = v₂ − v, must be at right angles to v₁. Write that
        as u·v₁ = 0, rearrange, and the amount λ falls out. No guessing involved.
      </LabNote>
      <LabNote>
        Why it matters later: splitting a vector into “the part along something” and “the part at right angles to it” is
        the move behind least squares, behind principal component analysis, and behind every method that fits a line by
        making the leftovers as small as possible.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Practice — the orthogonality questions, solved live                        */
/* ========================================================================== */

export function OrthogonalSolveLab() {
  // Counted in thirds, because the answer is −5/3 and a decimal step would
  // never land on it exactly. The slider must be able to reach the answer.
  const [k3, setK3] = useState(0)
  const k = k3 / 3
  const a = [1, 2, 3, 4, 5]
  const b = [2, -1, k, 0, 1]
  const d = a.reduce((acc, v, i) => acc + v * b[i], 0)
  // 3k + 5 = 0 means k3 = −5 exactly, which is a whole number of thirds.
  const exact = k3 === -5

  const c = [1, -2, 3, 4]
  const e = [2, 1, -1, 0]
  const dce = c.reduce((acc, v, i) => acc + v * e[i], 0)
  const nc = Math.hypot(...c)
  const ne = Math.hypot(...e)
  const cosA = dce / (nc * ne)
  const deg = (Math.acos(cosA) * 180) / Math.PI

  return (
    <LabBox>
      <Titled title="Practice Q5" note="find k so that the two are orthogonal">
        <div className="font-mono text-[13px]/[1.9] text-zinc-800">
          a = (1, 2, 3, 4, 5)
          <br />b = (2, −1, k, 0, 1)
        </div>
      </Titled>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-zinc-600">k =</span>
        <RangeInput
          label="the value of k"
          min={-12}
          max={12}
          step={1}
          value={k3}
          onChange={setK3}
          className="w-[220px]"
        />
        <span className="w-24 font-mono font-semibold">{k3 % 3 === 0 ? String(k3 / 3) : `${k3}/3`}</span>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[13px]/[1.9] text-zinc-800">
        a·b = (1)(2) + (2)(−1) + (3)(k) + (4)(0) + (5)(1)
        <br />
            = 2 − 2 + 3k + 0 + 5 = 3k + 5 = <strong>{(3 * k + 5).toFixed(3)}</strong>
      </div>

      <Verdict ok={exact}>
        {exact
          ? 'a·b = 0, so the two are orthogonal. Solving 3k + 5 = 0 gives k = −5/3, which is where the slider is now.'
          : `Not orthogonal yet — a·b is ${(3 * k + 5).toFixed(3)}. Set 3k + 5 = 0 and you get k = −5/3 ≈ −1.667.`}
      </Verdict>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <Titled title="Practice Q6" note="orthogonal? and what is the angle?">
          <div className="font-mono text-[13px]/[1.9] text-zinc-800">
            a = (1, −2, 3, 4)
            <br />b = (2, 1, −1, 0)
          </div>
        </Titled>
        <div className="mt-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[13px]/[1.9] text-zinc-800">
          a·b = (1)(2) + (−2)(1) + (3)(−1) + (4)(0) = 2 − 2 − 3 + 0 = <strong>{dce}</strong>
          <br />
          ‖a‖ = √(1 + 4 + 9 + 16) = √30 ≈ {nc.toFixed(4)}
          <br />
          ‖b‖ = √(4 + 1 + 1 + 0) = √6 ≈ {ne.toFixed(4)}
          <br />
          cos α = {dce} / (√30 · √6) = −3 / √180 = −1 / (2√5) ≈ {cosA.toFixed(4)}
          <br />α = cos⁻¹({cosA.toFixed(4)}) ≈ <strong>{deg.toFixed(2)}°</strong>
        </div>
        <div className="mt-3">
          <Verdict ok={false}>
            a·b = −3, which is not zero, so they are <strong>not</strong> orthogonal. The angle comes out just over 90°
            — which fits, because a negative dot product always means an obtuse angle.
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}
