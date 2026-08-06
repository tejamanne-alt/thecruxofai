'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { frStr } from '@/lib/model/fraction'
import { leadOf, ncols, nrows, refOnly, rrefOf, toFr } from '@/lib/model/matrix'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const SPAN = 6

/** Snap a dragged vector to halves, so the arithmetic on screen stays readable. */
const snap = (v: number) => Math.round(v * 2) / 2

/* ========================================================================== */
/* Part 1 — a vector is a list of numbers you can add and stretch             */
/* ========================================================================== */

export function VectorBasicsLab() {
  const [a, setA] = useState({ x: 3, y: 1 })
  const [b, setB] = useState({ x: 1, y: 3 })
  const [lam, setLam] = useState(1.5)
  const [show, setShow] = useState<'add' | 'scale'>('add')

  const sum = { x: a.x + b.x, y: a.y + b.y }
  const scaled = { x: lam * a.x, y: lam * a.y }

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    if (show === 'add') {
      // The parallelogram is the picture of "add the matching parts".
      g.setLineDash([4, 4])
      g.strokeStyle = 'rgba(9,9,11,0.22)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(f.px(a.x), f.py(a.y))
      g.lineTo(f.px(sum.x), f.py(sum.y))
      g.lineTo(f.px(b.x), f.py(b.y))
      g.stroke()
      g.setLineDash([])
      arrow(g, O.px, O.py, f.px(sum.x), f.py(sum.y), '#09090b', 3)
    } else {
      arrow(g, O.px, O.py, f.px(scaled.x), f.py(scaled.y), TEAL, 3)
    }

    arrow(g, O.px, O.py, f.px(a.x), f.py(a.y), acc, 2.5)
    if (show === 'add') arrow(g, O.px, O.py, f.px(b.x), f.py(b.y), ORANGE, 2.5)

    grip(g, f.px(a.x), f.py(a.y), acc, 7)
    if (show === 'add') grip(g, f.px(b.x), f.py(b.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'add' as const, label: 'Adding two vectors' },
          { id: 'scale' as const, label: 'Stretching one' },
        ]}
        at={show}
        onPick={setShow}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={show}
          handles={(f) =>
            show === 'add'
              ? [
                  { id: 'a', px: f.px(a.x), py: f.py(a.y) },
                  { id: 'b', px: f.px(b.x), py: f.py(b.y) },
                ]
              : [{ id: 'a', px: f.px(a.x), py: f.py(a.y) }]
          }
          onDragTo={(id, x, y) => {
            const p = { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) }
            if (id === 'a') setA(p)
            else setB(p)
          }}
          caption="Drag either arrow tip. The black arrow is the two of them added; the dashed lines show why it is called the parallelogram rule."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          {show === 'scale' && (
            <Slider
              label="the number λ"
              value={lam}
              display={lam.toFixed(1)}
              min={-2}
              max={3}
              step={0.5}
              hint="Stretch, shrink, or turn the arrow round."
              onChange={setLam}
            />
          )}
          <ReadOutGrid
            items={
              show === 'add'
                ? [
                    { label: 'x', value: `(${a.x}, ${a.y})` },
                    { label: 'y', value: `(${b.x}, ${b.y})` },
                    { label: 'x + y', value: `(${sum.x}, ${sum.y})` },
                    { label: 'still a vector?', value: 'yes' },
                  ]
                : [
                    { label: 'x', value: `(${a.x}, ${a.y})` },
                    { label: 'λ', value: lam.toFixed(1) },
                    { label: 'λx', value: `(${scaled.x}, ${scaled.y})` },
                    { label: 'still a vector?', value: 'yes' },
                  ]
            }
          />
          <PanelNote>
            {show === 'add'
              ? 'Add the first parts, then add the second parts. Nothing else happens. Every pair of arrows you can make lands on another arrow — you cannot break out of the plane.'
              : lam < 0
                ? 'A negative λ turns the arrow round to point the other way, then stretches it.'
                : lam === 0
                  ? 'λ = 0 collapses the arrow to a point at the origin. That is the zero vector.'
                  : 'Every part gets multiplied by the same number. The arrow keeps its direction and changes its length.'}
          </PanelNote>
        </div>
      </div>

      <LabNote>
        A vector is a list of numbers — the lecture writes a point of ℝⁿ as{' '}
        <span className="font-mono">(x₁, …, xₙ)</span>, standing up as a column or lying flat as a row. The two things
        you may do to it are right here: <strong>add</strong> two of them, and <strong>stretch</strong>{' '}one by a plain
        number. Everything else in this lecture is built out of those two moves.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — linear combinations                                               */
/* ========================================================================== */

export function CombinationLab() {
  const [c1, setC1] = useState(2)
  const [c2, setC2] = useState(3)

  // The lecture's own vectors, so its example lands exactly on the preset.
  const v1 = { x: 1, y: 3 }
  const v2 = { x: 1, y: 0 }
  const out = { x: c1 * v1.x + c2 * v2.x, y: c1 * v1.y + c2 * v2.y }
  const isExample = c1 === 2 && c2 === 3

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN + 1)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    // Draw it as a journey: c₁v₁ first, then c₂v₂ from where that ended.
    const mid = { x: c1 * v1.x, y: c1 * v1.y }
    arrow(g, O.px, O.py, f.px(mid.x), f.py(mid.y), acc, 3)
    arrow(g, f.px(mid.x), f.py(mid.y), f.px(out.x), f.py(out.y), ORANGE, 3)

    g.setLineDash([3, 3])
    g.strokeStyle = 'rgba(9,9,11,0.2)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(O.px, O.py)
    g.lineTo(f.px(v1.x * SPAN), f.py(v1.y * SPAN))
    g.moveTo(O.px, O.py)
    g.lineTo(f.px(-v1.x * SPAN), f.py(-v1.y * SPAN))
    g.stroke()
    g.setLineDash([])

    grip(g, f.px(out.x), f.py(out.y), '#09090b', 7)
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
          handles={(f) => [{ id: 'out', px: f.px(out.x), py: f.py(out.y), grab: 'anywhere' }]}
          onDragTo={(_id, x, y) => {
            // v₁ and v₂ span the whole plane, so any target can be reached and
            // the two amounts can be read straight off.
            const px = clamp(x, -SPAN, SPAN)
            const py = clamp(y, -SPAN, SPAN)
            const k1 = snap(py / v1.y)
            setC1(k1)
            setC2(snap(px - k1 * v1.x))
          }}
          caption="Press anywhere to move the black dot. The two amounts underneath change to whatever gets you there."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Slider label="c₁" value={c1} display={String(c1)} min={-4} max={4} step={0.5} hint="how much of v₁" onChange={setC1} />
          <Slider label="c₂" value={c2} display={String(c2)} min={-4} max={4} step={0.5} hint="how much of v₂" onChange={setC2} />
          <ReadOutGrid
            items={[
              { label: 'v₁', value: '(1, 3)' },
              { label: 'v₂', value: '(1, 0)' },
              { label: 'c₁v₁ + c₂v₂', value: `(${out.x}, ${out.y})` },
              { label: 'the lecture’s', value: isExample ? 'this one ✓' : '(5, 6)' },
            ]}
          />
          <Btn
            onClick={() => {
              setC1(2)
              setC2(3)
            }}
          >
            Show the slide&rsquo;s example
          </Btn>
        </div>
      </div>

      <Verdict ok={isExample}>
        {isExample
          ? 'This is exactly the example on slide 3: 2(1, 3) + 3(1, 0) = (5, 6). Two vectors, two amounts, one answer.'
          : `Right now that mixture gives (${out.x}, ${out.y}). Any pair of amounts you pick lands somewhere, and with these two vectors you can reach every point on the page.`}
      </Verdict>

      <LabNote>
        A <strong>linear combination</strong>{' '}is just this: take some of one vector, some of another, and add them. The
        coloured arrow is c₁ lots of v₁; the orange one carries on from there by c₂ lots of v₂. There is no other
        operation involved — no multiplying two vectors together, no squaring. That restraint is what makes everything
        else in linear algebra work.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — independent or dependent                                          */
/* ========================================================================== */

const INDEP_PRESETS = [
  { id: 'ex2', label: 'Ex.2 — independent', v: [{ x: 1, y: 3 }, { x: 1, y: 0 }] },
  { id: 'same', label: 'One is a copy of the other', v: [{ x: 2, y: 1 }, { x: 4, y: 2 }] },
  { id: 'zero', label: 'One of them is the zero vector', v: [{ x: 2, y: 3 }, { x: 0, y: 0 }] },
] as const
type IndepId = (typeof INDEP_PRESETS)[number]['id']

export function IndependenceLab() {
  const [pick, setPick] = useState<IndepId>('ex2')
  const [v, setV] = useState<Array<{ x: number; y: number }>>([...INDEP_PRESETS[0].v])

  const [p, q] = v
  const cross = p.x * q.y - p.y * q.x
  const independent = cross !== 0

  // If dependent and q is not zero, q = k·p for some k — work it out to print it.
  const k = p.x !== 0 ? q.x / p.x : p.y !== 0 ? q.y / p.y : null
  const bothZero = p.x === 0 && p.y === 0
  const qZero = q.x === 0 && q.y === 0

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    // Shade what the two vectors can reach: the whole plane, or just a line.
    if (independent) {
      g.fillStyle = 'rgba(13,148,136,0.07)'
      g.fillRect(f.L, f.T, f.R - f.L, f.B - f.T)
    } else if (!bothZero) {
      const d = p.x !== 0 || p.y !== 0 ? p : q
      g.strokeStyle = 'rgba(220,38,38,0.35)'
      g.lineWidth = 14
      g.beginPath()
      g.moveTo(f.px(-d.x * SPAN), f.py(-d.y * SPAN))
      g.lineTo(f.px(d.x * SPAN), f.py(d.y * SPAN))
      g.stroke()
    }

    arrow(g, O.px, O.py, f.px(p.x), f.py(p.y), acc, 3)
    arrow(g, O.px, O.py, f.px(q.x), f.py(q.y), ORANGE, 3)
    grip(g, f.px(p.x), f.py(p.y), acc, 7)
    grip(g, f.px(q.x), f.py(q.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <Presets
        items={INDEP_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setV([...INDEP_PRESETS.find((s) => s.id === id)!.v])
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
          handles={(f) => v.map((w, i) => ({ id: String(i), px: f.px(w.x), py: f.py(w.y) }))}
          onDragTo={(id, x, y) => {
            const i = Number(id)
            setV(v.map((w, j) => (j === i ? { x: snap(clamp(x, -SPAN, SPAN)), y: snap(clamp(y, -SPAN, SPAN)) } : w)))
            setPick('' as IndepId)
          }}
          caption="Drag either arrow. Green shading means the two of them can reach every point; a red line means they can only reach that line."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'v₁', value: `(${p.x}, ${p.y})` },
              { label: 'v₂', value: `(${q.x}, ${q.y})` },
              { label: 'they reach', value: independent ? 'the whole plane' : bothZero ? 'only the origin' : 'one line' },
              { label: 'verdict', value: independent ? 'independent' : 'dependent' },
            ]}
          />
          <PanelNote>
            Try to line the two arrows up. The moment one lies along the other — including pointing the opposite way —
            the shading collapses to a line and they become dependent.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={independent}>
        {independent ? (
          <>
            <strong>Linearly independent.</strong>{' '}The only way to make c₁v₁ + c₂v₂ = 0 is to take none of either:
            c₁ = c₂ = 0. Neither one can be built from the other, so each is carrying information the other does not.
          </>
        ) : bothZero ? (
          <>
            <strong>Linearly dependent.</strong>{' '}Both are the zero vector, so any amounts at all add to zero — for
            instance 1·v₁ + 1·v₂ = 0. Any set containing the zero vector is dependent, always.
          </>
        ) : qZero ? (
          <>
            <strong>Linearly dependent.</strong>{' '}v₂ is the zero vector, so 0·v₁ + 1·v₂ = 0 with a coefficient that is
            not zero. That is exactly the definition of dependent.
          </>
        ) : (
          <>
            <strong>Linearly dependent.</strong> v₂ is {k !== null ? `${Number.isInteger(k) ? k : k.toFixed(2)} times` : 'a multiple of'}{' '}
            v₁, so {k !== null ? `${Number.isInteger(k) ? k : k.toFixed(2)}` : 'some multiple of'}·v₁ − 1·v₂ = 0 with
            coefficients that are not all zero. Adding v₂ to the collection tells you nothing new.
          </>
        )}
      </Verdict>

      <LabNote>
        The definition on slide 4 sounds fussy but says something simple. Write c₁v₁ + ⋯ + cₘvₘ = 0. Choosing every c to
        be 0 always works, and is no news. The question is whether there is <em>any other</em>{' '}way. If there is not,
        the vectors are <strong>independent</strong>. If there is, they are <strong>dependent</strong>, and slide 5
        shows why: you can then rearrange it to write one of the vectors in terms of the others.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — the lecture's three examples, drawn                               */
/* ========================================================================== */

const EX3 = [
  { x: 1, y: 2 },
  { x: 5, y: 1 },
]

export function ParallelogramLab() {
  const [v, setV] = useState([...EX3])
  const [p, q] = v
  const sum = { x: p.x + q.x, y: p.y + q.y }
  const isSlide = p.x === 1 && p.y === 2 && q.x === 5 && q.y === 1

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, 7)
    const acc = accentColour()
    const O = { px: f.px(0), py: f.py(0) }

    g.beginPath()
    g.moveTo(O.px, O.py)
    g.lineTo(f.px(p.x), f.py(p.y))
    g.lineTo(f.px(sum.x), f.py(sum.y))
    g.lineTo(f.px(q.x), f.py(q.y))
    g.closePath()
    g.fillStyle = 'rgba(9,9,11,0.05)'
    g.fill()
    g.strokeStyle = 'rgba(9,9,11,0.3)'
    g.lineWidth = 1.5
    g.stroke()

    arrow(g, O.px, O.py, f.px(p.x), f.py(p.y), acc, 2.5)
    arrow(g, O.px, O.py, f.px(q.x), f.py(q.y), ORANGE, 2.5)
    arrow(g, O.px, O.py, f.px(sum.x), f.py(sum.y), TEAL, 3)

    g.fillStyle = '#09090b'
    g.textAlign = 'left'
    g.fillText(`(${p.x}, ${p.y})`, f.px(p.x) + 9, f.py(p.y) - 8)
    g.fillText(`(${q.x}, ${q.y})`, f.px(q.x) + 9, f.py(q.y) - 8)
    g.fillText(`(${sum.x}, ${sum.y})`, f.px(sum.x) + 9, f.py(sum.y) - 8)

    grip(g, f.px(p.x), f.py(p.y), acc, 7)
    grip(g, f.px(q.x), f.py(q.y), ORANGE, 7)
    return f
  }

  return (
    <LabBox>
      <ChartCanvas
        height={360}
        draw={draw}
        candidates={() => []}
        tooltip={() => null}
        targets={{}}
        handles={(f) => v.map((w, i) => ({ id: String(i), px: f.px(w.x), py: f.py(w.y) }))}
        onDragTo={(id, x, y) => {
          const i = Number(id)
          setV(v.map((w, j) => (j === i ? { x: snap(clamp(x, -1, 6)), y: snap(clamp(y, -1, 6)) } : w)))
        }}
        caption="Drag either of the two short arrows. The teal one is always their sum, and the shape between them is always a parallelogram."
      />

      <Verdict ok>
        {isSlide
          ? 'This is the picture on slide 7. (1, 2) + (5, 1) = (6, 3), so those three vectors are linearly dependent — the third is what you get for free from the first two.'
          : `Right now (${p.x}, ${p.y}) + (${q.x}, ${q.y}) = (${sum.x}, ${sum.y}). Whatever you drag, those three vectors together are dependent, because the third is built from the other two.`}
      </Verdict>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The three examples on slides 6 and 7
        </div>
        <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`Ex.1   [1,3]ᵀ, [1,0]ᵀ, [5,6]ᵀ     2[1,3]ᵀ + 3[1,0]ᵀ = [5,6]ᵀ    → dependent
Ex.2   [1,3]ᵀ, [1,0]ᵀ            a[1,3]ᵀ + b[1,0]ᵀ = [0,0]ᵀ
                                 ⇒ [a+b, 3a]ᵀ = [0,0]ᵀ
                                 ⇒ a = 0 and b = 0        → independent
Ex.3   [1,2]ᵀ, [5,1]ᵀ, [6,3]ᵀ    [1,2]ᵀ + [5,1]ᵀ = [6,3]ᵀ      → dependent`}
        </div>
      </div>

      <LabNote>
        Notice the pattern in Ex.1 and Ex.3. In both, a third vector turned up that was already reachable from the
        first two. That is what dependence looks like in practice — not something exotic, just a vector that repeats
        information you already had.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — rank counts them for you, at any size                             */
/* ========================================================================== */

const RANK_PRESETS = [
  {
    id: 'ex1',
    label: 'Ex.1 — three in the plane',
    rows: [
      [1, 3],
      [1, 0],
      [5, 6],
    ],
  },
  {
    id: 'ex2',
    label: 'Ex.2 — two in the plane',
    rows: [
      [1, 3],
      [1, 0],
    ],
  },
  {
    id: 'toomany',
    label: 'Four vectors, three components',
    rows: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [2, 3, 4],
    ],
  },
  {
    id: 'q3',
    label: 'Practice Q3',
    rows: [
      [1, 2, 3, 4],
      [2, 4, 6, 8],
      [1, 1, 1, 1],
    ],
  },
] as const
type RankId = (typeof RANK_PRESETS)[number]['id']

export function RankVectorsLab() {
  const [pick, setPick] = useState<RankId>('ex1')
  const [g, setG] = useState<number[][]>(RANK_PRESETS[0].rows as unknown as number[][])

  const A = toFr(g)
  const ref = refOnly(A)
  const lead = leadOf(ref)
  const rank = lead.filter((c) => c !== -1).length
  const p = nrows(A)
  const n = ncols(A)
  const independent = rank === p

  return (
    <LabBox>
      <Presets
        items={RANK_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(RANK_PRESETS.find((s) => s.id === id)!.rows as unknown as number[][])
        }}
      />

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title={`${p} vectors, one per row`} note="type over anything">
          <NumBox
            m={g}
            width={48}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setPick('' as RankId)
            }}
          />
        </Titled>
        <Titled title="Row echelon form">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {ref.map((row, r) => (
              <div key={r} className="flex gap-1" style={{ opacity: lead[r] === -1 ? 0.35 : 1 }}>
                {row.map((val, c) => (
                  <span
                    key={c}
                    className="w-[48px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                    style={lead[r] === c ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                  >
                    {frStr(val)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'p (vectors)', value: String(p) },
              { label: 'n (components)', value: String(n) },
              { label: 'rank', value: String(rank) },
              { label: 'verdict', value: independent ? 'independent' : 'dependent' },
            ]}
          />
        </div>
      </div>

      <Verdict ok={independent}>
        {independent
          ? `rank = ${rank}, and there are ${p} vectors. They match, so all ${p} are pulling their weight — linearly independent.`
          : `rank = ${rank} but there are ${p} vectors. ${p - rank} of them collapsed to a row of zeros, so they are linearly dependent.`}
      </Verdict>

      {n < p && (
        <Verdict ok={false}>
          There are more vectors ({p}) than components ({n}). That alone forces dependence — you cannot have more than
          n independent directions when each vector only has n numbers in it. No arithmetic needed.
        </Verdict>
      )}

      <LabNote>
        This is the shortcut slide 8 gives you. Put your p vectors in as rows and work out the rank. If rank = p they
        are independent; if rank &lt; p they are dependent. It works at any size, which matters because you cannot draw
        five vectors in ℝ⁷ and squint at them.
      </LabNote>
      <LabNote>
        The slide also states that rank(A) = rank(Aᵀ), which has a neat consequence: the biggest number of independent
        rows always equals the biggest number of independent columns. So it makes no difference whether you lay your
        vectors out as rows or as columns — you get the same count either way.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 6 — pivot columns tell you which vectors survive                      */
/* ========================================================================== */

const PIVOT_PRESETS = [
  {
    id: 'slide10',
    label: 'Slide 10',
    cols: [
      [1, 2, 3],
      [2, 4, 4],
    ],
  },
  {
    id: 'q2',
    label: 'Practice Q2',
    cols: [
      [1, 2, 3],
      [2, 4, 5],
      [3, 6, 8],
    ],
  },
  {
    id: 'indep',
    label: 'All three independent',
    cols: [
      [1, 0, 2],
      [0, 1, 1],
      [0, 0, 3],
    ],
  },
] as const
type PivotId = (typeof PIVOT_PRESETS)[number]['id']

export function PivotColumnsLab() {
  const [pick, setPick] = useState<PivotId>('slide10')
  const [g, setG] = useState<number[][]>(PIVOT_PRESETS[0].cols as unknown as number[][])

  const A = toFr(g)
  const ref = refOnly(A)
  const { R, pivots } = rrefOf(A)
  const free: number[] = []
  for (let c = 0; c < ncols(A); c++) if (!pivots.includes(c)) free.push(c)

  // A non-pivot column is a mixture of the pivot columns to its left, and the
  // RREF prints those amounts straight out.
  const recipes = free.map((c) => ({
    col: c,
    parts: pivots.map((pc, i) => ({ pc, amount: R[i][c] })).filter((t) => t.amount.n !== 0),
  }))

  return (
    <LabBox>
      <Presets
        items={PIVOT_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(PIVOT_PRESETS.find((s) => s.id === id)!.cols as unknown as number[][])
        }}
      />

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title="Vectors as columns" note="type over anything">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {g.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <input
                    key={j}
                    value={v}
                    inputMode="numeric"
                    aria-label={`row ${i + 1} column ${j + 1}`}
                    onChange={(e) => {
                      const raw = e.target.value.trim()
                      const num = raw === '' || raw === '-' ? 0 : Number(raw)
                      if (!Number.isFinite(num)) return
                      setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? num : x))))
                      setPick('' as PivotId)
                    }}
                    className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none"
                    style={
                      pivots.includes(j)
                        ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                        : { background: 'rgba(220,38,38,0.07)', color: '#991b1b' }
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <Titled title="Row echelon form">
          <FrBox m={ref} width={50} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'pivot columns', value: pivots.map((c) => c + 1).join(', ') || '—' },
              { label: 'non-pivot', value: free.map((c) => c + 1).join(', ') || 'none' },
              { label: 'rank', value: String(pivots.length) },
              { label: 'independent?', value: free.length === 0 ? 'yes, all' : 'no' },
            ]}
          />
        </div>
      </div>

      <Verdict ok={free.length === 0}>
        {free.length === 0
          ? 'Every column is a pivot column, so every vector is independent of the others. Nothing repeats.'
          : `Columns ${free.map((c) => c + 1).join(' and ')} carry no pivot. Those vectors are mixtures of the pivot columns to their left, so they add nothing new.`}
      </Verdict>

      {recipes.length > 0 && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            And here is each one written out
          </div>
          <div className="font-mono text-[13px]/[1.9] text-zinc-800">
            {recipes.map((r) => (
              <div key={r.col}>
                column {r.col + 1} ={' '}
                {r.parts.length === 0
                  ? '0 (the zero vector)'
                  : r.parts
                      .map((t, i) => `${i > 0 ? ' + ' : ''}${frStr(t.amount)} × column ${t.pc + 1}`)
                      .join('')
                      .replace(/\+ -/g, '− ')}
              </div>
            ))}
          </div>
        </div>
      )}

      <LabNote>
        This is the practical recipe from slide 9. Stand your vectors up as the <strong>columns</strong>{' '}of a matrix and
        row-reduce. The columns that end up carrying a pivot are the independent ones, and they are always the leftmost
        ones. Every other column is a mixture of the pivot columns to its left — and the tidied matrix hands you the
        exact amounts, as printed above.
      </LabNote>
      <LabNote>
        On the slide-10 example the second column is simply twice the first, which the read-out reproduces. That is why
        the slide can say it &ldquo;is just twice the first column&rdquo; without doing any extra work.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — the lecture's four-component check, step by step                   */
/* ========================================================================== */

const BIG_SCRIPT: Array<{ note: string; why: string; m: number[][] }> = [
  {
    note: 'The three vectors, standing up as columns',
    why: 'x₁, x₂ and x₃ each have four components, so the matrix is 4 × 3. Drawing this is hopeless — four dimensions — so the arithmetic has to carry it.',
    m: [
      [1, 1, -1],
      [2, 1, -2],
      [-3, 0, 1],
      [4, 2, 1],
    ],
  },
  {
    note: 'R2 ← R2 − 2R1,  R3 ← R3 + 3R1,  R4 ← R4 − 4R1',
    why: 'Clear everything below the first pivot in one sweep. Each row gets whatever multiple of row 1 knocks its first entry out.',
    m: [
      [1, 1, -1],
      [0, -1, 0],
      [0, 3, -2],
      [0, -2, 5],
    ],
  },
  {
    note: 'R3 ← R3 + 3R2,  R4 ← R4 − 2R2',
    why: 'Now clear below the second pivot, which is the −1 in row 2.',
    m: [
      [1, 1, -1],
      [0, -1, 0],
      [0, 0, -2],
      [0, 0, 5],
    ],
  },
  {
    note: 'R4 ← 2R4 + 5R3',
    why: 'One row left. Clearing it costs a 2 and a 5, and the whole row goes to zero — which is fine, because there were four rows and only three columns.',
    m: [
      [1, 1, -1],
      [0, -1, 0],
      [0, 0, -2],
      [0, 0, 0],
    ],
  },
]

export function BigCheckLab() {
  const [at, setAt] = useState(0)
  const cur = BIG_SCRIPT[at]
  const M = toFr(cur.m)
  const lead = leadOf(M)
  const pivots = lead.filter((c) => c !== -1)
  const done = at === BIG_SCRIPT.length - 1

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => setAt(0)} disabled={at === 0}>
          ⏮ Start
        </Btn>
        <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
          ← Back
        </Btn>
        <Btn primary onClick={() => setAt(Math.min(BIG_SCRIPT.length - 1, at + 1))} disabled={done}>
          Next step →
        </Btn>
        <span className="text-[12.5px] text-zinc-500">
          step {at} of {BIG_SCRIPT.length - 1}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title={cur.note}>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {M.map((row, r) => (
              <div key={r} className="flex gap-1">
                {row.map((v, c) => (
                  <span
                    key={c}
                    className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                    style={lead[r] === c ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                  >
                    {frStr(v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <div className="max-w-[330px] pt-6 text-[13px]/[1.7] text-zinc-700">{cur.why}</div>
      </div>

      <Verdict ok={done}>
        {done ? (
          <>
            Three pivot columns, and the matrix has three columns. They match, so <strong>x₁, x₂ and x₃ are linearly
            independent</strong>{' '}— which is the conclusion on slide 12. The row of zeros at the bottom is not a problem:
            it only says that four rows could never all be independent when there are three columns.
          </>
        ) : (
          <>
            {pivots.length} pivot{pivots.length === 1 ? '' : 's'} visible so far, and there is more to clear. Keep
            pressing.
          </>
        )}
      </Verdict>

      <LabNote>
        The set-up on slide 11 is worth copying. You want to know whether λ₁x₁ + λ₂x₂ + λ₃x₃ = 0 has any answer beyond
        all-zeros. Stand the three vectors up as columns, row-reduce, and count the pivots. Three pivots for three
        columns means no free choice anywhere, so all-zeros is the only answer — independent.
      </LabNote>
    </LabBox>
  )
}
