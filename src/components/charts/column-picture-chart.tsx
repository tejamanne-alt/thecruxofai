'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawPlane, grip, halo, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/**
 * Ax = b, drawn the way it is actually meant: the columns of A are two arrows,
 * x says how much of each to use, and b is where you are trying to get to.
 * Once you have seen this, "no solution" stops being a rule you memorise and
 * becomes something obvious — the target is off the reachable line.
 */
const SPAN = 6
const TEAL = '#0d9488'
const GREY = '#71717a'

const snapHalf = (v: number) => Math.round(clamp(v, -SPAN, SPAN) * 2) / 2
const snapFine = (v: number) => Math.round(clamp(v, -6, 6) * 20) / 20

export function ColumnPictureChart() {
  // The columns of A. c1 is the first column, c2 the second.
  const [c1, setC1] = useState({ x: 2, y: 1 })
  const [c2, setC2] = useState({ x: -1, y: 2 })
  const [x1, setX1] = useState(1.5)
  const [x2, setX2] = useState(1)
  const [b, setB] = useState({ x: 2, y: 4 })

  const det = c1.x * c2.y - c2.x * c1.y
  const flat = Math.abs(det) < 1e-9

  // Where the current recipe actually lands.
  const got = { x: x1 * c1.x + x2 * c2.x, y: x1 * c1.y + x2 * c2.y }
  const miss = Math.hypot(got.x - b.x, got.y - b.y)

  /** The recipe that reaches a target, when the columns can reach anywhere. */
  function recipeFor(t: { x: number; y: number }) {
    if (!flat) {
      return {
        a: snapFine((t.x * c2.y - c2.x * t.y) / det),
        b: snapFine((c1.x * t.y - t.x * c1.y) / det),
      }
    }
    // Columns lie along one line, so only that line is reachable. Slide to the
    // nearest point on it rather than refusing to move at all.
    const d = Math.hypot(c1.x, c1.y) > 1e-9 ? c1 : c2
    const len2 = d.x * d.x + d.y * d.y
    if (len2 < 1e-9) return { a: 0, b: 0 }
    const k = snapFine((t.x * d.x + t.y * d.y) / len2)
    return d === c1 ? { a: k, b: 0 } : { a: 0, b: k }
  }

  function moveGot(tx: number, ty: number) {
    const r = recipeFor({ x: tx, y: ty })
    setX1(r.a)
    setX2(r.b)
  }

  const solvable = !flat || Math.abs(b.x * c1.y - b.y * c1.x) < 1e-9

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

    // When the two columns fall on one line, show that line — everything you
    // can possibly reach lives on it, and that is the whole lesson.
    if (flat) {
      const d = Math.hypot(c1.x, c1.y) > 1e-9 ? c1 : c2
      const len = Math.hypot(d.x, d.y)
      if (len > 1e-9) {
        const k = (SPAN * 4) / len
        g.strokeStyle = 'rgba(220,38,38,0.28)'
        g.lineWidth = 10
        g.beginPath()
        g.moveTo(f.px(-d.x * k), f.py(-d.y * k))
        g.lineTo(f.px(d.x * k), f.py(d.y * k))
        g.stroke()
      }
    }

    // The recipe, laid out nose to tail: so much of column 1, then so much of column 2.
    const mid = { x: x1 * c1.x, y: x1 * c1.y }
    g.setLineDash([5, 4])
    arrow(g, f.px(0), f.py(0), f.px(mid.x), f.py(mid.y), acc, 3)
    arrow(g, f.px(mid.x), f.py(mid.y), f.px(got.x), f.py(got.y), TEAL, 3)
    g.setLineDash([])

    // The two columns themselves, at their own length, so you can see what one
    // "unit" of each is worth.
    arrow(g, f.px(0), f.py(0), f.px(c1.x), f.py(c1.y), acc, 2)
    arrow(g, f.px(0), f.py(0), f.px(c2.x), f.py(c2.y), TEAL, 2)

    // The target.
    g.beginPath()
    g.arc(f.px(b.x), f.py(b.y), 9, 0, Math.PI * 2)
    g.strokeStyle = '#18181b'
    g.lineWidth = 2.5
    g.stroke()
    if (hover?.kind === 'b') halo(g, f.px(b.x), f.py(b.y), 9)

    dot(g, f.px(got.x), f.py(got.y), 6, miss < 0.05 ? '#18181b' : '#dc2626', '#fff')
    grip(g, f.px(c1.x), f.py(c1.y), acc, 5)
    grip(g, f.px(c2.x), f.py(c2.y), TEAL, 5)
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText(`column 1 × ${x1.toFixed(2)}`, f.L + 8, f.T + 12)
    g.fillStyle = TEAL
    g.fillText(`column 2 × ${x2.toFixed(2)}`, f.L + 8, f.T + 28)
    g.fillStyle = GREY
    g.fillText('○ where you are trying to get to', f.L + 8, f.T + 44)
    return f
  }

  const candidates = (f: Frame) => [
    { kind: 'c1', i: 0, px: f.px(c1.x), py: f.py(c1.y) },
    { kind: 'c2', i: 0, px: f.px(c2.x), py: f.py(c2.y) },
    { kind: 'b', i: 0, px: f.px(b.x), py: f.py(b.y) },
    { kind: 'got', i: 0, px: f.px(got.x), py: f.py(got.y) },
  ]

  function dragTo(id: string, x: number, y: number) {
    if (id === 'c1') setC1({ x: snapHalf(x), y: snapHalf(y) })
    else if (id === 'c2') setC2({ x: snapHalf(x), y: snapHalf(y) })
    else if (id === 'b') setB({ x: snapHalf(x), y: snapHalf(y) })
    else moveGot(x, y)
  }

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'b') {
      return {
        title: 'The target, b',
        rows: [
          ['sits at', `${b.x}, ${b.y}`],
          ['this is', 'the right-hand side of the equations'],
          ['drag it', 'somewhere off the red line and the system stops having an answer'],
        ] as Array<[string, string]>,
      }
    }
    if (hit.kind === 'got') {
      return {
        title: 'Where your recipe lands',
        rows: [
          ['lands at', `${got.x.toFixed(2)}, ${got.y.toFixed(2)}`],
          ['distance from b', miss.toFixed(3)],
          ['recipe', `${x1.toFixed(2)} of column 1, ${x2.toFixed(2)} of column 2`],
          ['when this is 0', 'you have solved Ax = b'],
        ] as Array<[string, string]>,
      }
    }
    const isC1 = hit.kind === 'c1'
    const c = isC1 ? c1 : c2
    return {
      title: isC1 ? 'Column 1 of the matrix' : 'Column 2 of the matrix',
      rows: [
        ['is the arrow', `${c.x}, ${c.y}`],
        ['one unit of it', 'moves you exactly this far, in this direction'],
        ['drag it', 'onto the other column and the pair collapses to a single line'],
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
          targets={{ x1, x2 }}
          handles={(f: Frame) => [
            { id: 'c1', px: f.px(c1.x), py: f.py(c1.y) },
            { id: 'c2', px: f.px(c2.x), py: f.py(c2.y) },
            { id: 'b', px: f.px(b.x), py: f.py(b.y) },
            { id: 'got', px: f.px(got.x), py: f.py(got.y), grab: 'anywhere' },
          ]}
          onDragTo={dragTo}
          caption="Press anywhere to send the red dot there, or drag it. Drag the two coloured arrow tips to change the matrix, and the black ring to move the target."
        />
      }
      panel={
        <>
          <ReadOut
            label="Does the recipe reach b?"
            value={miss < 0.05 ? 'Yes — solved' : `Off by ${miss.toFixed(2)}`}
            tone={miss < 0.05 ? TEAL : '#dc2626'}
            note={
              solvable
                ? 'A recipe exists. Keep going, or press Solve it.'
                : 'The target is off the red line, so no recipe can ever reach it.'
            }
          />

          <Slider
            label="how much of column 1"
            value={x1}
            display={x1.toFixed(2)}
            min={-6}
            max={6}
            step={0.05}
            hint="This is x₁ in the equations."
            onChange={setX1}
          />
          <Slider
            label="how much of column 2"
            value={x2}
            display={x2.toFixed(2)}
            min={-6}
            max={6}
            step={0.05}
            hint="This is x₂."
            onChange={setX2}
          />

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-zinc-600">the two columns</span>
              <span className="font-mono font-semibold text-zinc-950">
                ({c1.x}, {c1.y}) &amp; ({c2.x}, {c2.y})
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-zinc-600">determinant</span>
              <span className="font-mono font-semibold" style={{ color: flat ? '#dc2626' : '#09090b' }}>
                {det.toFixed(2)}
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px]/[1.5] text-zinc-500">
              {flat
                ? 'Zero. The two arrows point along the same line, so together they can only reach that line.'
                : 'Not zero. These two arrows can reach any point on the plane, so every target has exactly one recipe.'}
            </p>
          </div>

          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                const r = recipeFor(b)
                setX1(r.a)
                setX2(r.b)
              }}
            >
              Solve it
            </PanelButton>
            <PanelButton
              onClick={() => {
                setC1({ x: 2, y: 1 })
                setC2({ x: -1, y: 2 })
                setB({ x: 2, y: 4 })
                setX1(1.5)
                setX2(1)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton
              onClick={() => {
                setC1({ x: 2, y: 1 })
                setC2({ x: -4, y: -2 })
                setB({ x: 2, y: 4 })
              }}
            >
              Break it
            </PanelButton>
          </PanelButtons>

          <PanelNote>
            <strong>Break it</strong>{' '}lines the two arrows up. Now they only reach one line, and the target is not on it
            — that is a system with no answer, and you can see exactly why.
          </PanelNote>
        </>
      }
    />
  )
}
