'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2

type Pt = { x: number; y: number }

/* ========================================================================== */
/* Parts 5 and 6 — is this subset a subspace?                                 */
/* ========================================================================== */

interface Candidate {
  id: string
  label: string
  /** What the lecture calls it. */
  name: string
  inside: (p: Pt) => boolean
  /** Painted so the region is visible before anything is dragged. */
  paint: (g: CanvasRenderingContext2D, f: Frame) => void
  /** Null when it is a subspace; otherwise why not, in the lecture's terms. */
  fails: 'none' | 'zero' | 'add' | 'scale'
  note: string
}

const HALF = 'rgba(79,70,229,0.12)'

function shadeLine(g: CanvasRenderingContext2D, f: Frame, dx: number, dy: number, ox = 0, oy = 0) {
  g.strokeStyle = 'rgba(79,70,229,0.5)'
  g.lineWidth = 10
  g.beginPath()
  g.moveTo(f.px(ox - dx * SPAN * 2), f.py(oy - dy * SPAN * 2))
  g.lineTo(f.px(ox + dx * SPAN * 2), f.py(oy + dy * SPAN * 2))
  g.stroke()
}

const CANDIDATES: Candidate[] = [
  {
    id: 'yaxis',
    label: 'The y-axis',
    name: '𝒰 = the y-axis',
    inside: (p) => p.x === 0,
    paint: (g, f) => shadeLine(g, f, 0, 1),
    fails: 'none',
    note: 'Slide 11 works this one out: adding two vectors on the y-axis keeps you on the y-axis, and scaling one — including by 0 — keeps you there too.',
  },
  {
    id: 'line',
    label: 'A slanted line through 0',
    name: '𝒰 = all multiples of (2, 1)',
    inside: (p) => Math.abs(p.x * 1 - p.y * 2) < 1e-9,
    paint: (g, f) => shadeLine(g, f, 2 / Math.sqrt(5), 1 / Math.sqrt(5)),
    fails: 'none',
    note: 'Any line through the origin works, not just the axes. Every point on it is a multiple of one vector, and multiples add to multiples.',
  },
  {
    id: 'shifted',
    label: 'The line x = 1',
    name: '𝒰 = {x = 1}',
    inside: (p) => p.x === 1,
    paint: (g, f) => shadeLine(g, f, 0, 1, 1, 0),
    fails: 'zero',
    note: 'Slide 11’s second example. Shifting the y-axis one unit to the right breaks it: scaling by 0 lands on the origin, which is no longer in the set.',
  },
  {
    id: 'square',
    label: 'A square around 0',
    name: '𝒰 = {−1 ≤ x ≤ 1, −1 ≤ y ≤ 1}',
    inside: (p) => Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1,
    paint: (g, f) => {
      g.fillStyle = HALF
      g.fillRect(f.px(-1), f.py(1), f.px(1) - f.px(-1), f.py(-1) - f.py(1))
      g.strokeStyle = 'rgba(79,70,229,0.5)'
      g.lineWidth = 1.5
      g.strokeRect(f.px(-1), f.py(1), f.px(1) - f.px(-1), f.py(-1) - f.py(1))
    },
    fails: 'scale',
    note: 'Slide 12’s square. It contains the origin and it is closed under nothing else — stretch any non-zero vector far enough and you leave.',
  },
  {
    id: 'quadrant',
    label: 'The first quadrant',
    name: '𝒰 = {x ≥ 0, y ≥ 0}',
    inside: (p) => p.x >= 0 && p.y >= 0,
    paint: (g, f) => {
      g.fillStyle = HALF
      g.fillRect(f.px(0), f.T, f.R - f.px(0), f.py(0) - f.T)
    },
    fails: 'scale',
    note: 'Adding never takes you out, and the origin is in — but multiplying by −1 does. Closure has to hold for every scalar, negative ones included.',
  },
  {
    id: 'cross',
    label: 'Both axes together',
    name: '𝒰 = the x-axis ∪ the y-axis',
    inside: (p) => p.x === 0 || p.y === 0,
    paint: (g, f) => {
      shadeLine(g, f, 0, 1)
      shadeLine(g, f, 1, 0)
    },
    fails: 'add',
    note: 'Scaling is fine — a multiple of a point on an axis stays on that axis. Adding is what breaks: (1, 0) + (0, 1) = (1, 1), which is on neither.',
  },
]

export function SubspaceTestLab() {
  const [pick, setPick] = useState('yaxis')
  const [u, setU] = useState<Pt>({ x: 0, y: 2 })
  const [v, setV] = useState<Pt>({ x: 0, y: -3 })
  const [lam, setLam] = useState(-1)

  const c = CANDIDATES.find((x) => x.id === pick)!
  const sum = { x: u.x + v.x, y: u.y + v.y }
  const scaled = { x: lam * u.x, y: lam * u.y }

  const hasZero = c.inside({ x: 0, y: 0 })
  const uIn = c.inside(u)
  const vIn = c.inside(v)
  const sumIn = c.inside(sum)
  const scaledIn = c.inside(scaled)
  const isSubspace = c.fails === 'none'

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    c.paint(g, f)

    arrow(g, f.px(0), f.py(0), f.px(u.x), f.py(u.y), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), ORANGE, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), sumIn ? TEAL : '#dc2626', 3)
    arrow(g, f.px(0), f.py(0), f.px(scaled.x), f.py(scaled.y), scaledIn ? 'rgba(13,148,136,0.55)' : 'rgba(220,38,38,0.6)', 2)

    g.beginPath()
    g.arc(f.px(0), f.py(0), 9, 0, Math.PI * 2)
    g.strokeStyle = hasZero ? TEAL : '#dc2626'
    g.lineWidth = 2
    g.stroke()

    grip(g, f.px(u.x), f.py(u.y), acc, 7)
    grip(g, f.px(v.x), f.py(v.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={CANDIDATES.map((x) => ({ id: x.id, label: x.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          const nxt = CANDIDATES.find((x) => x.id === id)!
          // Start both arrows inside the set, so the reader has to work to break it.
          const seed: Record<string, [Pt, Pt]> = {
            yaxis: [{ x: 0, y: 2 }, { x: 0, y: -3 }],
            line: [{ x: 2, y: 1 }, { x: -4, y: -2 }],
            shifted: [{ x: 1, y: 2 }, { x: 1, y: -1 }],
            square: [{ x: 1, y: 0.5 }, { x: -0.5, y: 0.5 }],
            quadrant: [{ x: 3, y: 1 }, { x: 1, y: 4 }],
            cross: [{ x: 3, y: 0 }, { x: 0, y: 2 }],
          }
          const [a, b] = seed[nxt.id]
          setU(a)
          setV(b)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={350}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => [
            { id: 'u', px: f.px(u.x), py: f.py(u.y) },
            { id: 'v', px: f.px(v.x), py: f.py(v.y) },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) }
            if (id === 'u') setU(p)
            else setV(p)
          }}
          caption="The shaded region is the subset. Drag the two arrows; the thick arrow is their sum and the thin one is λ times the first. Teal means it landed inside, red means it escaped."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>the scalar λ</span>
              <span className="text-zinc-500">{lam}</span>
            </div>
            <RangeInput label="the scalar λ" value={lam} min={-3} max={3} step={0.5} onChange={setLam} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'is 0 inside?', value: hasZero ? 'yes' : 'no' },
              { label: 'both arrows inside?', value: uIn && vIn ? 'yes' : 'no' },
              { label: 'x + y inside?', value: sumIn ? 'yes' : 'no' },
              { label: 'λx inside?', value: scaledIn ? 'yes' : 'no' },
            ]}
          />
          <PanelNote>
            The test on slide 10 is only three things: the set is not empty, adding two members keeps you in, and
            scaling a member keeps you in. Nothing else needs checking — the rest is inherited from the space around it.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={isSubspace}>
        <strong className="font-mono">{c.name}</strong> —{' '}
        {isSubspace ? (
          <>
            this <strong>is</strong> a subspace. {c.note}
          </>
        ) : c.fails === 'zero' ? (
          <>
            <strong>not</strong> a subspace. It does not contain the zero vector, and a subspace always must — take any
            member and scale it by 0. {c.note}
          </>
        ) : c.fails === 'add' ? (
          <>
            <strong>not</strong> a subspace. Adding two members can land outside. {c.note}
          </>
        ) : (
          <>
            <strong>not</strong> a subspace. Scaling a member can land outside. {c.note}
          </>
        )}
      </Verdict>

      <LabNote>
        The quickest check of all: <strong>does the set contain the zero vector?</strong> If not, it cannot be a
        subspace, and you are finished in one line. That single test kills the shifted line straight away.
      </LabNote>
      <LabNote>
        Containing zero is not enough on its own, though — the square and the first quadrant both contain it and both
        fail anyway. You still have to check that adding and scaling keep you inside.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — span                                                              */
/* ========================================================================== */

export function SpanLab() {
  const [v1, setV1] = useState<Pt>({ x: 2, y: 1 })
  const [v2, setV2] = useState<Pt>({ x: -1, y: 2 })
  const [c1, setC1] = useState(1.5)
  const [c2, setC2] = useState(1)

  const det = v1.x * v2.y - v1.y * v2.x
  const spansPlane = Math.abs(det) > 1e-9
  const bothZero = v1.x === 0 && v1.y === 0 && v2.x === 0 && v2.y === 0
  const out = { x: c1 * v1.x + c2 * v2.x, y: c1 * v1.y + c2 * v2.y }

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    if (spansPlane) {
      g.fillStyle = 'rgba(13,148,136,0.08)'
      g.fillRect(f.L, f.T, f.R - f.L, f.B - f.T)
    } else if (!bothZero) {
      const d = v1.x !== 0 || v1.y !== 0 ? v1 : v2
      const n = Math.hypot(d.x, d.y) || 1
      g.strokeStyle = 'rgba(13,148,136,0.4)'
      g.lineWidth = 12
      g.beginPath()
      g.moveTo(f.px((-d.x / n) * SPAN * 2), f.py((-d.y / n) * SPAN * 2))
      g.lineTo(f.px((d.x / n) * SPAN * 2), f.py((d.y / n) * SPAN * 2))
      g.stroke()
    }

    // The journey: c₁v₁ first, then c₂v₂ from there.
    const mid = { x: c1 * v1.x, y: c1 * v1.y }
    arrow(g, f.px(0), f.py(0), f.px(mid.x), f.py(mid.y), acc, 2.5)
    arrow(g, f.px(mid.x), f.py(mid.y), f.px(out.x), f.py(out.y), ORANGE, 2.5)

    arrow(g, f.px(0), f.py(0), f.px(v1.x), f.py(v1.y), 'rgba(9,9,11,0.45)', 1.5)
    arrow(g, f.px(0), f.py(0), f.px(v2.x), f.py(v2.y), 'rgba(9,9,11,0.45)', 1.5)
    grip(g, f.px(v1.x), f.py(v1.y), '#09090b', 6)
    grip(g, f.px(v2.x), f.py(v2.y), '#09090b', 6)
    grip(g, f.px(out.x), f.py(out.y), TEAL, 7)
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
          caption="Drag the two grey arrows to change the generators. The shaded region is everything they can reach — the whole plane, or just a line."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>c₁</span>
              <span className="text-zinc-500">{c1}</span>
            </div>
            <RangeInput label="c₁" value={c1} min={-3} max={3} step={0.5} onChange={setC1} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>c₂</span>
              <span className="text-zinc-500">{c2}</span>
            </div>
            <RangeInput label="c₂" value={c2} min={-3} max={3} step={0.5} onChange={setC2} />
          </div>
          <ReadOutGrid
            items={[
              { label: 'v₁', value: `(${v1.x}, ${v1.y})` },
              { label: 'v₂', value: `(${v2.x}, ${v2.y})` },
              { label: 'c₁v₁ + c₂v₂', value: `(${out.x}, ${out.y})` },
              { label: 'the span is', value: spansPlane ? 'all of ℝ²' : bothZero ? 'just {0}' : 'one line' },
            ]}
          />
          <PanelNote>
            Line the two grey arrows up and the shading collapses. The set of reachable points shrinks from the whole
            plane to a single line — and that line is still a subspace, just a smaller one.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={spansPlane}>
        {spansPlane ? (
          <>
            These two vectors form a <strong>generating set</strong>{' '}
            for ℝ²: every point on the page is c₁v₁ + c₂v₂ for
            some pair of numbers. In the lecture&rsquo;s notation, ℝ² = span[{'{'}v₁, v₂{'}'}].
          </>
        ) : bothZero ? (
          <>Both vectors are zero, so the only thing you can reach is the origin. The span is {'{'}0{'}'}.</>
        ) : (
          <>
            The two vectors lie along each other, so their span is only a line — a subspace of ℝ², but not all of it.
            They do <strong>not</strong> generate ℝ².
          </>
        )}
      </Verdict>

      <LabNote>
        The <strong>span</strong> of a set of vectors is everything you can build from them by adding and scaling. It is
        always a subspace, whatever vectors you start with — which is a neat way of manufacturing subspaces to order.
      </LabNote>
      <LabNote>
        Watch what happens to the two dials when the span collapses to a line. You can still reach every point{' '}
        <em>on that line</em>, but now in endlessly many ways, because the two vectors are no longer pulling in
        different directions. That is dependence, and it is the next part.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 8 — the three facts about dependence on slide 17                      */
/* ========================================================================== */

const FACTS = [
  {
    id: 'either',
    label: 'There is no third option',
    vectors: [
      { x: 2, y: 1 },
      { x: -1, y: 3 },
    ],
    text: 'Any collection of vectors is either linearly independent or linearly dependent. Drag them about all you like — the verdict flips between exactly two answers and never lands anywhere else.',
  },
  {
    id: 'zero',
    label: 'A zero vector forces dependence',
    vectors: [
      { x: 2, y: 1 },
      { x: 0, y: 0 },
    ],
    text: 'If any vector in the collection is the zero vector, the set is dependent — no matter what the others are. Take λ = 1 for the zero vector and λ = 0 for everything else: the combination is 0, and not every λ was 0.',
  },
  {
    id: 'combo',
    label: 'Dependent means one is built from the rest',
    vectors: [
      { x: 3, y: 1 },
      { x: -1.5, y: -0.5 },
    ],
    text: 'When every vector is non-zero, the set is dependent exactly when one of them is a linear combination of the others. Here the second is −0.5 times the first, so it adds nothing.',
  },
] as const
type FactId = (typeof FACTS)[number]['id']

export function DependenceFactsLab() {
  const [pick, setPick] = useState<FactId>('either')
  const [v, setV] = useState<Pt[]>([...FACTS[0].vectors])

  const [p, q] = v
  const cross = p.x * q.y - p.y * q.x
  const independent = Math.abs(cross) > 1e-9
  const pZero = p.x === 0 && p.y === 0
  const qZero = q.x === 0 && q.y === 0
  const anyZero = pZero || qZero
  const k = !pZero ? (p.x !== 0 ? q.x / p.x : q.y / p.y) : null
  const meta = FACTS.find((f) => f.id === pick)!

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    if (!independent && !(pZero && qZero)) {
      const d = !pZero ? p : q
      const n = Math.hypot(d.x, d.y) || 1
      g.strokeStyle = 'rgba(220,38,38,0.3)'
      g.lineWidth = 12
      g.beginPath()
      g.moveTo(f.px((-d.x / n) * SPAN * 2), f.py((-d.y / n) * SPAN * 2))
      g.lineTo(f.px((d.x / n) * SPAN * 2), f.py((d.y / n) * SPAN * 2))
      g.stroke()
    }
    arrow(g, f.px(0), f.py(0), f.px(p.x), f.py(p.y), acc, 3)
    arrow(g, f.px(0), f.py(0), f.px(q.x), f.py(q.y), ORANGE, 3)
    grip(g, f.px(p.x), f.py(p.y), acc, 7)
    grip(g, f.px(q.x), f.py(q.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={FACTS.map((f) => ({ id: f.id, label: f.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setV([...FACTS.find((f) => f.id === id)!.vectors])
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={pick}
          handles={(f) => v.map((w, i) => ({ id: String(i), px: f.px(w.x), py: f.py(w.y) }))}
          onDragTo={(id, x, y) => {
            const i = Number(id)
            setV(v.map((w, j) => (j === i ? { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) } : w)))
          }}
          caption="Drag either arrow. A red band means the two lie along each other, which is what dependence looks like in two dimensions."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'x₁', value: `(${p.x}, ${p.y})` },
              { label: 'x₂', value: `(${q.x}, ${q.y})` },
              { label: 'any zero vector?', value: anyZero ? 'yes' : 'no' },
              { label: 'verdict', value: independent ? 'independent' : 'dependent' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Chip on={independent} label="independent" />
            <Chip on={!independent} label="dependent" />
          </div>
          <PanelNote>{meta.text}</PanelNote>
        </div>
      </div>

      <Verdict ok={independent}>
        {independent ? (
          <>
            The only way to reach 0 is λ₁ = λ₂ = 0. Each vector brings something the other cannot supply, so the set is{' '}
            <strong>linearly independent</strong>.
          </>
        ) : anyZero ? (
          <>
            One of them is the zero vector, so 1 × (that one) + 0 × (the other) = 0 with a coefficient that is not zero.{' '}
            <strong>Dependent</strong>, whatever the other vector is.
          </>
        ) : (
          <>
            x₂ is {k !== null ? (Number.isInteger(k) ? k : k.toFixed(2)) : 'a multiple of'} times x₁, so{' '}
            {k !== null ? (Number.isInteger(k) ? k : k.toFixed(2)) : 'that multiple of'} × x₁ − 1 × x₂ = 0 with
            coefficients that are not all zero. <strong>Dependent</strong>, and x₂ is the redundant one.
          </>
        )}
      </Verdict>

      <LabNote>
        The definition is deliberately awkward. Rather than saying &ldquo;no vector is a combination of the
        others&rdquo;, it says &ldquo;the only combination giving 0 is the boring one&rdquo;. That version is easier to
        check — it is a single homogeneous system — and it keeps working when a zero vector is in the collection, where
        the other phrasing gets tangled.
      </LabNote>
    </LabBox>
  )
}
