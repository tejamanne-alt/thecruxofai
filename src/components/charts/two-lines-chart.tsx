'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawPlane, grip, halo, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/**
 * Each line is held as two pins you can drag, not as three coefficients. Two
 * pins are a line, and dragging a pin is something you can do without knowing
 * what a coefficient is — the numbers then update themselves, which is the
 * right way round for a beginner.
 */
interface Pt {
  x: number
  y: number
}
interface Line {
  p: Pt
  q: Pt
}

const SPAN = 6
const TEAL = '#0d9488'

/** Snap to halves so lines can actually be made exactly parallel by hand. */
const snap = (v: number) => Math.round(clamp(v, -SPAN, SPAN) * 2) / 2

/** Turn two pins into a·x + b·y = c. */
function coeffs(l: Line) {
  const a = l.q.y - l.p.y
  const b = -(l.q.x - l.p.x)
  return { a, b, c: a * l.p.x + b * l.p.y }
}

function fmt(v: number) {
  const s = Number.isInteger(v) ? String(v) : v.toFixed(1)
  return s.replace('-', '−')
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

/**
 * −8x − 8y = −4 and 2x + 2y = 1 are the same line, and only one of them is
 * readable. Pins land on halves, so doubling clears the fractions and the gcd
 * clears the rest.
 */
function tidy(a: number, b: number, c: number) {
  // a and b are multiples of ½, and c of ¼, so ×4 makes all three whole.
  let [A, B, C] = [Math.round(a * 4), Math.round(b * 4), Math.round(c * 4)]
  const g = gcd(gcd(A, B), C)
  if (g > 1) [A, B, C] = [A / g, B / g, C / g]
  // Prefer a positive first coefficient — everyone writes them that way.
  if (A < 0 || (A === 0 && B < 0)) [A, B, C] = [-A, -B, -C]
  return { a: A, b: B, c: C }
}

/** Read an equation the way you would say it. */
function equationText(l: Line) {
  const raw = coeffs(l)
  const { a, b, c } = tidy(raw.a, raw.b, raw.c)
  const head = a === 0 ? '' : `${a === 1 ? '' : a === -1 ? '−' : fmt(a)}x`
  const bs =
    b === 0 ? '' : `${head ? (b < 0 ? ' − ' : ' + ') : b < 0 ? '−' : ''}${Math.abs(b) === 1 ? '' : fmt(Math.abs(b))}y`
  return `${head}${bs} = ${fmt(c)}`
}

export function TwoLinesChart() {
  const [lines, setLines] = useState<Line[]>([
    { p: { x: -4, y: 4.5 }, q: { x: 4, y: -3.5 } },
    { p: { x: -4, y: -2.5 }, q: { x: 4, y: 3.5 } },
  ])

  const A = coeffs(lines[0])
  const B = coeffs(lines[1])
  const det = A.a * B.b - B.a * A.b
  const parallel = Math.abs(det) < 1e-9
  // Two parallel lines are the same line when a point of one sits on the other.
  const same = parallel && Math.abs(A.a * lines[1].p.x + A.b * lines[1].p.y - A.c) < 1e-9

  const meet: Pt | null = parallel ? null : { x: (A.c * B.b - B.c * A.b) / det, y: (A.a * B.c - B.a * A.c) / det }

  const verdict = same ? 'Endless answers' : parallel ? 'No answer at all' : 'Exactly one answer'
  const verdictTone = same ? TEAL : parallel ? '#dc2626' : '#09090b'

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    lines.forEach((l, i) => {
      const colour = i === 0 ? acc : TEAL
      const dx = l.q.x - l.p.x
      const dy = l.q.y - l.p.y
      const len = Math.hypot(dx, dy) || 1
      // Push the drawn segment far past the box, then let the clip trim it, so
      // the line looks like it goes on for ever — which it does.
      const k = (SPAN * 4) / len
      g.strokeStyle = colour
      g.lineWidth = same && i === 1 ? 6 : 3
      if (same && i === 1) g.globalAlpha = 0.35
      g.beginPath()
      g.moveTo(f.px(l.p.x - dx * k), f.py(l.p.y - dy * k))
      g.lineTo(f.px(l.p.x + dx * k), f.py(l.p.y + dy * k))
      g.stroke()
      g.globalAlpha = 1
    })

    if (meet) {
      dot(g, f.px(meet.x), f.py(meet.y), 7, '#18181b', '#fff')
      if (hover?.kind === 'meet') halo(g, f.px(meet.x), f.py(meet.y), 7)
    }

    lines.forEach((l, i) => {
      const colour = i === 0 ? acc : TEAL
      ;[l.p, l.q].forEach((pt) => grip(g, f.px(pt.x), f.py(pt.y), colour, 6))
    })
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText(equationText(lines[0]), f.L + 8, f.T + 12)
    g.fillStyle = TEAL
    g.fillText(equationText(lines[1]), f.L + 8, f.T + 28)
    return f
  }

  const candidates = (f: Frame) => {
    const out: HitTarget[] = []
    lines.forEach((l, i) => {
      out.push({ kind: `pin${i}`, i: 0, px: f.px(l.p.x), py: f.py(l.p.y) })
      out.push({ kind: `pin${i}`, i: 1, px: f.px(l.q.x), py: f.py(l.q.y) })
    })
    if (meet) out.push({ kind: 'meet', i: 0, px: f.px(meet.x), py: f.py(meet.y) })
    return out
  }

  /** ids look like "0p" — line index, then which pin. */
  function dragPin(id: string, x: number, y: number) {
    const li = Number(id[0])
    const which = id[1] as 'p' | 'q'
    const next = { x: snap(x), y: snap(y) }
    setLines((ls) =>
      ls.map((l, i) => {
        if (i !== li) return l
        const other = which === 'p' ? l.q : l.p
        // Both pins on the same spot is not a line, so refuse that one move.
        if (other.x === next.x && other.y === next.y) return l
        return which === 'p' ? { p: next, q: l.q } : { p: l.p, q: next }
      })
    )
  }

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'meet' && meet) {
      return {
        title: 'Where the two lines cross',
        rows: [
          ['x', meet.x.toFixed(3)],
          ['y', meet.y.toFixed(3)],
          ['check line 1', `${fmt(A.a)}(${meet.x.toFixed(2)}) + ${fmt(A.b)}(${meet.y.toFixed(2)}) = ${fmt(A.c)}`],
          ['what it means', 'this one pair of numbers makes both equations true at the same time'],
        ] as Array<[string, string]>,
      }
    }
    const li = hit.kind === 'pin0' ? 0 : 1
    const pt = hit.i === 0 ? lines[li].p : lines[li].q
    return {
      title: `A pin on line ${li + 1}`,
      rows: [
        ['sits at', `x = ${fmt(pt.x)}, y = ${fmt(pt.y)}`],
        ['the line right now', equationText(lines[li])],
        ['drag it', 'the line swings to follow, and the equation above changes with it'],
      ] as Array<[string, string]>,
    }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          draw={draw}
          candidates={candidates}
          tooltip={tooltip}
          targets={{}}
          jumpKey={`${lines[0].p.x},${lines[0].p.y},${lines[0].q.x},${lines[0].q.y},${lines[1].p.x},${lines[1].p.y},${lines[1].q.x},${lines[1].q.y}`}
          handles={(f: Frame) =>
            lines.flatMap((l, i) => [
              { id: `${i}p`, px: f.px(l.p.x), py: f.py(l.p.y) },
              { id: `${i}q`, px: f.px(l.q.x), py: f.py(l.q.y) },
            ])
          }
          onDragTo={dragPin}
          caption="Each line is pinned at two white dots. Drag any dot and the line swings with it. Try to make the two lines lie exactly on top of each other."
        />
      }
      panel={
        <>
          <ReadOut
            label="How many answers"
            value={verdict}
            tone={verdictTone}
            note={
              same
                ? 'One line drawn twice. Every point on it works.'
                : parallel
                  ? 'They never touch, so nothing works.'
                  : 'They cross once, and that crossing is the answer.'
            }
          />

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The two equations</div>
            <div className="font-mono text-[12.5px] font-semibold" style={{ color: 'var(--acc)' }}>
              {equationText(lines[0])}
            </div>
            <div className="font-mono text-[12.5px] font-semibold" style={{ color: TEAL }}>
              {equationText(lines[1])}
            </div>
            <div className="mt-1 flex justify-between border-t border-zinc-950/[0.08] pt-1.5 text-[12px]">
              <span className="text-zinc-600">crossing point</span>
              <span className="font-mono font-semibold text-zinc-950">
                {meet ? `${meet.x.toFixed(2)}, ${meet.y.toFixed(2)}` : 'none'}
              </span>
            </div>
          </div>

          <PanelButtons>
            <PanelButton
              primary
              onClick={() =>
                setLines([
                  { p: { x: -4, y: 4.5 }, q: { x: 4, y: -3.5 } },
                  { p: { x: -4, y: -2.5 }, q: { x: 4, y: 3.5 } },
                ])
              }
            >
              One answer
            </PanelButton>
            <PanelButton
              onClick={() =>
                setLines([
                  { p: { x: -4, y: 3 }, q: { x: 4, y: -1 } },
                  { p: { x: -4, y: 0 }, q: { x: 4, y: -4 } },
                ])
              }
            >
              No answer
            </PanelButton>
            <PanelButton
              onClick={() =>
                setLines([
                  { p: { x: -4, y: 3 }, q: { x: 4, y: -1 } },
                  { p: { x: -2, y: 2 }, q: { x: 2, y: 0 } },
                ])
              }
            >
              Endless answers
            </PanelButton>
          </PanelButtons>

          <PanelNote>
            Those three buttons are the whole of the “how many answers?” question. There is no fourth picture. Two
            straight lines either cross once, never cross, or are the same line.
          </PanelNote>
        </>
      }
    />
  )
}
