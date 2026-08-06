'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, dot, drawPlane, grip, halo, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const SPAN = 6

const snap = (v: number) => Math.round(clamp(v, -SPAN, SPAN) * 2) / 2
const n1 = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))

/* ========================================================================== */
/* 1. Adding and stretching arrows                                            */
/* ========================================================================== */

/**
 * Why a vector is "a thing you can add and stretch". You drag two arrows, and
 * the sum is drawn as the corner of a parallelogram. The point the reader is
 * meant to notice: the answer is always another arrow. Never anything else.
 */
export function VectorAddLab() {
  const [u, setU] = useState({ x: 3, y: 1 })
  const [v, setV] = useState({ x: 1, y: 3 })
  const [k, setK] = useState(1)

  const sum = { x: u.x + v.x, y: u.y + v.y }
  const scaled = { x: u.x * k, y: u.y * k }

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

    // The parallelogram: slide each arrow to the end of the other one.
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.28)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(u.x), f.py(u.y))
    g.lineTo(f.px(sum.x), f.py(sum.y))
    g.lineTo(f.px(v.x), f.py(v.y))
    g.stroke()
    g.setLineDash([])

    // The stretched copy sits under everything, so it never hides an arrow.
    if (Math.abs(k - 1) > 0.01) arrow(g, f.px(0), f.py(0), f.px(scaled.x), f.py(scaled.y), 'rgba(79,70,229,0.35)', 6)

    arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), '#18181b', 3)
    arrow(g, f.px(0), f.py(0), f.px(u.x), f.py(u.y), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), TEAL, 2.5)

    grip(g, f.px(u.x), f.py(u.y), acc, 6)
    grip(g, f.px(v.x), f.py(v.y), TEAL, 6)
    if (hover?.kind === 'sum') halo(g, f.px(sum.x), f.py(sum.y), 6)
    dot(g, f.px(sum.x), f.py(sum.y), 5, '#18181b', '#fff')
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText(`u = (${n1(u.x)}, ${n1(u.y)})`, f.L + 8, f.T + 12)
    g.fillStyle = TEAL
    g.fillText(`v = (${n1(v.x)}, ${n1(v.y)})`, f.L + 8, f.T + 28)
    g.fillStyle = '#18181b'
    g.fillText(`u + v = (${n1(sum.x)}, ${n1(sum.y)})`, f.L + 8, f.T + 44)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          draw={draw}
          candidates={(f: Frame) => [
            { kind: 'u', i: 0, px: f.px(u.x), py: f.py(u.y) },
            { kind: 'v', i: 0, px: f.px(v.x), py: f.py(v.y) },
            { kind: 'sum', i: 0, px: f.px(sum.x), py: f.py(sum.y) },
          ]}
          tooltip={(hit: HitTarget) =>
            hit.kind === 'sum'
              ? {
                  title: 'u + v',
                  rows: [
                    ['add the first numbers', `${n1(u.x)} + ${n1(v.x)} = ${n1(sum.x)}`],
                    ['add the second numbers', `${n1(u.y)} + ${n1(v.y)} = ${n1(sum.y)}`],
                    ['notice', 'the answer is another arrow, same as the two you started with'],
                  ] as Array<[string, string]>,
                }
              : {
                  title: hit.kind === 'u' ? 'The arrow u' : 'The arrow v',
                  rows: [
                    ['is the list', hit.kind === 'u' ? `(${n1(u.x)}, ${n1(u.y)})` : `(${n1(v.x)}, ${n1(v.y)})`],
                    ['drag it', 'anywhere at all — the sum stays an arrow'],
                  ] as Array<[string, string]>,
                }
          }
          targets={{ ux: u.x, uy: u.y, vx: v.x, vy: v.y, k }}
          handles={(f: Frame) => [
            { id: 'u', px: f.px(u.x), py: f.py(u.y) },
            { id: 'v', px: f.px(v.x), py: f.py(v.y) },
          ]}
          onDragTo={(id, x, y) => (id === 'u' ? setU({ x: snap(x), y: snap(y) }) : setV({ x: snap(x), y: snap(y) }))}
          caption="Drag the tip of either coloured arrow. The black arrow is the two of them added together."
        />
      }
      panel={
        <>
          <ReadOut
            label="u + v"
            value={`(${n1(sum.x)}, ${n1(sum.y)})`}
            note="Add the first numbers, then add the second numbers. That is all adding vectors means."
          />
          <Slider
            label="stretch u by"
            value={k}
            display={`${k.toFixed(1)}×`}
            min={-2}
            max={3}
            step={0.1}
            hint="The faint arrow is u after stretching. It stays an arrow too."
            onChange={setK}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setU({ x: 3, y: 1 })
                setV({ x: 1, y: 3 })
                setK(1)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton onClick={() => setV({ x: u.x * -1, y: u.y * -1 })}>Make v the opposite of u</PanelButton>
          </PanelButtons>
          <PanelNote>
            Press the second button. Now u + v lands on zero. Even that is still a vector — it is the arrow with no
            length.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 2. One equation is a whole line of answers                                 */
/* ========================================================================== */

/** Reduce a·x + b·y = c to whole numbers so the label reads nicely. */
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

function lineText(a: number, b: number, c: number) {
  let [A, B, C] = [Math.round(a * 4), Math.round(b * 4), Math.round(c * 4)]
  const g = gcd(gcd(A, B), C)
  ;[A, B, C] = [A / g, B / g, C / g]
  if (A < 0 || (A === 0 && B < 0)) [A, B, C] = [-A, -B, -C]
  const head = A === 0 ? '' : `${A === 1 ? '' : A === -1 ? '−' : String(A).replace('-', '−')}x`
  const tail =
    B === 0 ? '' : `${head ? (B < 0 ? ' − ' : ' + ') : B < 0 ? '−' : ''}${Math.abs(B) === 1 ? '' : Math.abs(B)}y`
  return `${head}${tail} = ${String(C).replace('-', '−')}`
}

/**
 * One line, and a point you drag around to test. The reader is trying to feel
 * that "solving" is not one answer — the whole line is the answer, and stepping
 * a hair off it makes the sum wrong.
 */
export function LineExplorer() {
  const [p, setP] = useState({ x: -3, y: 4 })
  const [q, setQ] = useState({ x: 3, y: -2 })
  const [test, setTest] = useState({ x: 1, y: 1 })

  const a = q.y - p.y
  const b = -(q.x - p.x)
  const c = a * p.x + b * p.y
  const got = a * test.x + b * test.y
  const on = Math.abs(got - c) < 1e-9

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

    const dx = q.x - p.x
    const dy = q.y - p.y
    const len = Math.hypot(dx, dy) || 1
    const k = (SPAN * 4) / len
    g.strokeStyle = acc
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(f.px(p.x - dx * k), f.py(p.y - dy * k))
    g.lineTo(f.px(p.x + dx * k), f.py(p.y + dy * k))
    g.stroke()

    // Dots at whole-number points that sit on the line: they make "a line of
    // answers" countable rather than abstract.
    for (let i = -SPAN; i <= SPAN; i += 0.5) {
      if (Math.abs(b) > 1e-9) {
        const y = (c - a * i) / b
        if (Math.abs(y) <= SPAN && Number.isInteger(i) && Math.abs(y - Math.round(y)) < 1e-9) {
          dot(g, f.px(i), f.py(y), 3.5, '#fff', acc)
        }
      }
    }

    grip(g, f.px(p.x), f.py(p.y), acc, 6)
    grip(g, f.px(q.x), f.py(q.y), acc, 6)
    dot(g, f.px(test.x), f.py(test.y), 7, on ? TEAL : RED, '#fff')
    if (hover?.kind === 'test') halo(g, f.px(test.x), f.py(test.y), 7)
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText(lineText(a, b, c), f.L + 8, f.T + 12)
    g.fillStyle = '#71717a'
    g.fillText('small rings = whole-number answers', f.L + 8, f.T + 28)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          draw={draw}
          candidates={(f: Frame) => [{ kind: 'test', i: 0, px: f.px(test.x), py: f.py(test.y) }]}
          tooltip={() => ({
            title: on ? 'This point works' : 'This point does not work',
            rows: [
              ['you picked', `x = ${n1(test.x)}, y = ${n1(test.y)}`],
              ['work out the left side', `${n1(a)}(${n1(test.x)}) + ${n1(b)}(${n1(test.y)}) = ${n1(got)}`],
              ['the right side is', n1(c)],
              ['so', on ? 'both sides match — it is an answer' : 'the sides do not match — it is not an answer'],
            ] as Array<[string, string]>,
          })}
          targets={{ tx: test.x, ty: test.y }}
          handles={(f: Frame) => [
            { id: 'p', px: f.px(p.x), py: f.py(p.y) },
            { id: 'q', px: f.px(q.x), py: f.py(q.y) },
            { id: 'test', px: f.px(test.x), py: f.py(test.y), grab: 'anywhere' },
          ]}
          onDragTo={(id, x, y) => {
            const at = { x: snap(x), y: snap(y) }
            if (id === 'p') {
              if (at.x !== q.x || at.y !== q.y) setP(at)
            } else if (id === 'q') {
              if (at.x !== p.x || at.y !== p.y) setQ(at)
            } else setTest(at)
          }}
          caption="Press anywhere to move the big dot. Green means it makes the equation true. Drag the two white pins to swing the line."
        />
      }
      panel={
        <>
          <ReadOut
            label="Your point"
            value={on ? 'It works' : 'It does not work'}
            tone={on ? TEAL : RED}
            note={`${n1(a)} × ${n1(test.x)} + ${n1(b)} × ${n1(test.y)} = ${n1(got)}, and it needs to be ${n1(c)}`}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The equation</div>
            <div className="font-mono text-[15px] font-semibold" style={{ color: 'var(--acc)' }}>
              {lineText(a, b, c)}
            </div>
            <p className="mt-1.5 text-[11.5px]/[1.55] text-zinc-500">
              Drag the big dot along the line. It stays green the whole way. Every one of those points is a right
              answer.
            </p>
          </div>
          <PanelNote>
            One equation with two unknowns does not give you one answer. It gives you a line of them. You need a second
            equation to narrow it down.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 3 + 13. Combining equations, and why it is safe                            */
/* ========================================================================== */

interface Eq {
  a: number
  b: number
  c: number
}

const START: Eq[] = [
  { a: 1, b: 1, c: 1 },
  { a: 1, b: -1, c: 3 },
]

/**
 * Two equations drawn as two lines, plus the three legal moves as buttons. The
 * crossing point is drawn large and never moves, however much the lines swing
 * about. That is the whole argument for why elimination is allowed, and it is
 * far more convincing seen than read.
 */
export function CombineLab() {
  const [eqs, setEqs] = useState<Eq[]>(START)
  const [log, setLog] = useState<string[]>([])
  const [ghost, setGhost] = useState<Eq | null>(null)

  const [A, B] = eqs
  const det = A.a * B.b - B.a * A.b
  const meet = Math.abs(det) < 1e-9 ? null : { x: (A.c * B.b - B.c * A.b) / det, y: (A.a * B.c - B.a * A.c) / det }

  function apply(next: Eq[], label: string, before: Eq) {
    setGhost(before)
    setEqs(next)
    setLog((l) => [...l, label])
  }

  const combine = (i: number, j: number, sign: 1 | -1) => {
    const from = eqs[i]
    const other = eqs[j]
    apply(
      eqs.map((e, k) => (k === i ? { a: e.a + sign * other.a, b: e.b + sign * other.b, c: e.c + sign * other.c } : e)),
      `R${i + 1} ← R${i + 1} ${sign > 0 ? '+' : '−'} R${j + 1}`,
      from
    )
  }

  const scale = (i: number, k: number) =>
    apply(
      eqs.map((e, m) => (m === i ? { a: e.a * k, b: e.b * k, c: e.c * k } : e)),
      `R${i + 1} ← ${k} × R${i + 1}`,
      eqs[i]
    )

  const swap = () => apply([eqs[1], eqs[0]], 'R1 ↔ R2', eqs[0])

  const drawLine = (g: CanvasRenderingContext2D, f: Frame, e: Eq, colour: string, width: number, dashed = false) => {
    const { a, b, c } = e
    if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return
    if (dashed) g.setLineDash([6, 5])
    g.strokeStyle = colour
    g.lineWidth = width
    g.beginPath()
    if (Math.abs(b) > 1e-9) {
      g.moveTo(f.px(-SPAN), f.py((c - a * -SPAN) / b))
      g.lineTo(f.px(SPAN), f.py((c - a * SPAN) / b))
    } else {
      g.moveTo(f.px(c / a), f.py(-SPAN))
      g.lineTo(f.px(c / a), f.py(SPAN))
    }
    g.stroke()
    g.setLineDash([])
  }

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    if (ghost) drawLine(g, f, ghost, 'rgba(9,9,11,0.18)', 2, true)
    drawLine(g, f, eqs[0], acc, 3)
    drawLine(g, f, eqs[1], TEAL, 3)

    if (meet) {
      g.beginPath()
      g.arc(f.px(meet.x), f.py(meet.y), 13, 0, Math.PI * 2)
      g.fillStyle = 'rgba(220,38,38,0.14)'
      g.fill()
      dot(g, f.px(meet.x), f.py(meet.y), 7, '#18181b', '#fff')
    }
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText(`R1:  ${lineText(eqs[0].a, eqs[0].b, eqs[0].c)}`, f.L + 8, f.T + 12)
    g.fillStyle = TEAL
    g.fillText(`R2:  ${lineText(eqs[1].a, eqs[1].b, eqs[1].c)}`, f.L + 8, f.T + 28)
    if (ghost) {
      g.fillStyle = '#a1a1aa'
      g.fillText('dashed grey = the line before your last move', f.L + 8, f.T + 44)
    }
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          draw={draw}
          candidates={(f: Frame) => (meet ? [{ kind: 'meet', i: 0, px: f.px(meet.x), py: f.py(meet.y) }] : [])}
          tooltip={() => ({
            title: 'The crossing point',
            rows: [
              ['sits at', meet ? `x = ${meet.x.toFixed(2)}, y = ${meet.y.toFixed(2)}` : '—'],
              ['watch it', 'press any button on the right. The lines move. This dot does not.'],
              ['that is why', 'these moves are safe to use on any system'],
            ] as Array<[string, string]>,
          })}
          targets={{ a0: eqs[0].a, b0: eqs[0].b, c0: eqs[0].c, a1: eqs[1].a, b1: eqs[1].b, c1: eqs[1].c }}
          caption="The red halo marks the answer to both equations. Use the buttons and keep your eye on it."
        />
      }
      panel={
        <>
          <ReadOut
            label="The answer, right now"
            value={meet ? `${meet.x.toFixed(2)}, ${meet.y.toFixed(2)}` : 'none'}
            note="Do as many moves as you like. This never changes."
          />
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Add or subtract</div>
            <PanelButtons>
              <PanelButton onClick={() => combine(0, 1, 1)}>R1 + R2</PanelButton>
              <PanelButton onClick={() => combine(0, 1, -1)}>R1 − R2</PanelButton>
            </PanelButtons>
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Scale a row</div>
            <PanelButtons>
              <PanelButton onClick={() => scale(0, 2)}>2 × R1</PanelButton>
              <PanelButton onClick={() => scale(0, -1)}>−1 × R1</PanelButton>
            </PanelButtons>
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Swap</div>
            <PanelButtons>
              <PanelButton onClick={swap}>R1 ↔ R2</PanelButton>
              <PanelButton
                primary
                onClick={() => {
                  setEqs(START)
                  setLog([])
                  setGhost(null)
                }}
              >
                Start over
              </PanelButton>
            </PanelButtons>
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What you did ({log.length})
            </div>
            {log.length === 0 ? (
              <p className="text-[12px] text-zinc-500">Nothing yet. Try R1 − R2 first.</p>
            ) : (
              <ol className="flex max-h-[150px] flex-col gap-1 overflow-y-auto font-mono text-[11.5px] text-zinc-700">
                {log.map((h, i) => (
                  <li key={i}>
                    <span className="text-zinc-400">{i + 1}.</span> {h}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <PanelNote>
            Press <strong>R1 − R2</strong>{' '}from the start. The y term cancels and R1 becomes a straight up-and-down
            line. That is one unknown gone, and the answer has not moved.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 12. Every answer at once                                                   */
/* ========================================================================== */

/**
 * A system with one equation short of what it needs. There is a whole line of
 * answers, and the reader slides along it with λ. Seeing "one point plus a
 * direction" as an actual point and an actual arrow is the shortest route to
 * understanding the general solution.
 */
export function SolutionSetLab() {
  const [lam, setLam] = useState(0)

  // x + y + z = 3 and x − y + 2z = 2, written with z free.
  // Solve: x = 5/2 − 3z/2, y = 1/2 + z/2.
  const z = lam
  const x = 2.5 - 1.5 * z
  const y = 0.5 + 0.5 * z

  const part = { x: 2.5, y: 0.5, z: 0 }
  const dir = { x: -1.5, y: 0.5, z: 1 }

  const check1 = x + y + z
  const check2 = x - y + 2 * z

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    // Only x and y are drawn; z is the dial. Enough to show a line of answers.
    const k = 40
    g.strokeStyle = 'rgba(13,148,136,0.45)'
    g.lineWidth = 8
    g.beginPath()
    g.moveTo(f.px(part.x - dir.x * k), f.py(part.y - dir.y * k))
    g.lineTo(f.px(part.x + dir.x * k), f.py(part.y + dir.y * k))
    g.stroke()

    arrow(g, f.px(part.x), f.py(part.y), f.px(part.x + dir.x), f.py(part.y + dir.y), TEAL, 2.5)
    dot(g, f.px(part.x), f.py(part.y), 6, '#18181b', '#fff')
    dot(g, f.px(x), f.py(y), 8, acc, '#fff')
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = '#18181b'
    g.fillText('black dot = the one answer we found', f.L + 8, f.T + 12)
    g.fillStyle = TEAL
    g.fillText('green band = every other answer', f.L + 8, f.T + 28)
    g.fillStyle = acc
    g.fillText(`your answer, with λ = ${lam.toFixed(1)}`, f.L + 8, f.T + 44)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ x, y }}
          handles={(f: Frame) => [{ id: 'lam', px: f.px(x), py: f.py(y), grab: 'anywhere' }]}
          onDragTo={(_id, px, py) => {
            // Drop the pointer onto the answer line and read off which λ it is.
            const t = ((px - part.x) * dir.x + (py - part.y) * dir.y) / (dir.x * dir.x + dir.y * dir.y)
            setLam(Math.round(clamp(t, -3, 3) * 10) / 10)
          }}
          caption="Press or drag anywhere. The big dot slides along the green band — and every spot on it is a correct answer."
        />
      }
      panel={
        <>
          <Slider
            label="λ — your free choice"
            value={lam}
            display={lam.toFixed(1)}
            min={-3}
            max={3}
            step={0.1}
            hint="Nothing pins this down. Pick anything."
            onChange={setLam}
          />
          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-zinc-600">x</span>
              <span className="font-semibold">{x.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">y</span>
              <span className="font-semibold">{y.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">z</span>
              <span className="font-semibold">{z.toFixed(2)}</span>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Check both equations
            </div>
            <div className="flex flex-col gap-1 font-mono text-[12px]">
              <div className="flex justify-between">
                <span className="text-zinc-600">x + y + z</span>
                <span style={{ color: Math.abs(check1 - 3) < 1e-6 ? TEAL : RED }}>{check1.toFixed(2)} = 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">x − y + 2z</span>
                <span style={{ color: Math.abs(check2 - 2) < 1e-6 ? TEAL : RED }}>{check2.toFixed(2)} = 2</span>
              </div>
            </div>
            <p className="mt-2 text-[11.5px]/[1.55] text-zinc-500">
              Move the dial as much as you like. Both lines stay green. That is what &ldquo;endless answers&rdquo;
              means.
            </p>
          </div>
          <PanelNote>
            The black dot is one answer someone spotted. The green arrow is a move that changes nothing. Add any amount
            of the arrow to the dot and you land on another answer.
          </PanelNote>
        </>
      }
    />
  )
}
