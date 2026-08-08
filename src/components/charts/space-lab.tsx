'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { fr, frStr } from '@/lib/model/fraction'
import { addM, eqM, scaleM, toFr } from '@/lib/model/matrix'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const SPAN = 6
const snap = (v: number) => Math.round(v * 2) / 2

/* ========================================================================== */
/* Part 1 — why the subject moves on from solving systems                     */
/* ========================================================================== */

/**
 * The answers to Ax = 0 form a line through the origin; the answers to Ax = b
 * form a parallel line that misses it. Adding two answers keeps you on the
 * first line and throws you off the second — which is the whole reason the
 * lecture stops talking about systems and starts talking about spaces.
 */
export function NullspaceSpaceLab() {
  const [b, setB] = useState(0)
  const [p, setP] = useState(2)
  const [q, setQ] = useState(-1)

  // The single equation 2x + 3y = b. Its answers are a line, through the
  // origin exactly when b is 0.
  const yOf = (x: number) => (b - 2 * x) / 3
  const onLine = (x: number) => ({ x, y: yOf(x) })
  const u = onLine(p)
  const v = onLine(q)
  const sum = { x: u.x + v.x, y: u.y + v.y }
  const sumValue = 2 * sum.x + 3 * sum.y
  const stays = Math.abs(sumValue - b) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    g.strokeStyle = b === 0 ? TEAL : ORANGE
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(-SPAN), f.py(yOf(-SPAN)))
    g.lineTo(f.px(SPAN), f.py(yOf(SPAN)))
    g.stroke()

    // Where the sum landed, and the line it would have to be on.
    if (!stays) {
      g.setLineDash([4, 4])
      g.strokeStyle = 'rgba(9,9,11,0.25)'
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(f.px(-SPAN), f.py((sumValue - 2 * -SPAN) / 3))
      g.lineTo(f.px(SPAN), f.py((sumValue - 2 * SPAN) / 3))
      g.stroke()
      g.setLineDash([])
    }

    arrow(g, f.px(0), f.py(0), f.px(u.x), f.py(u.y), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), ORANGE, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), stays ? TEAL : '#dc2626', 3)

    g.beginPath()
    g.arc(f.px(0), f.py(0), 9, 0, Math.PI * 2)
    g.strokeStyle = b === 0 ? TEAL : 'rgba(9,9,11,0.3)'
    g.lineWidth = 2
    g.stroke()

    grip(g, f.px(u.x), f.py(u.y), acc, 7)
    grip(g, f.px(v.x), f.py(v.y), ORANGE, 7)
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
          jumpKey={b}
          handles={(f) => [
            { id: 'u', px: f.px(u.x), py: f.py(u.y) },
            { id: 'v', px: f.px(v.x), py: f.py(v.y) },
          ]}
          onDragTo={(id, x) => {
            const nx = snap(clamp(x, -SPAN, SPAN))
            if (id === 'u') setP(nx)
            else setQ(nx)
          }}
          caption="Drag either arrow along the line. The third arrow is the two of them added — teal if it landed back on the line, red if it did not."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>the right-hand side b</span>
              <span className="text-zinc-500">{b}</span>
            </div>
            <RangeInput label="the right-hand side b" value={b} min={-6} max={6} step={1} onChange={setB} />
            <p className="mt-1.5 text-xs text-zinc-500">2x + 3y = b</p>
          </div>
          <ReadOutGrid
            items={[
              { label: 'first answer', value: `(${u.x}, ${u.y.toFixed(2)})` },
              { label: 'second answer', value: `(${v.x}, ${v.y.toFixed(2)})` },
              { label: 'their sum', value: `(${sum.x}, ${sum.y.toFixed(2)})` },
              { label: '2x + 3y there', value: sumValue.toFixed(2) },
            ]}
          />
          <Btn primary onClick={() => setB(0)}>
            Set b to zero
          </Btn>
        </div>
      </div>

      <Verdict ok={stays}>
        {stays ? (
          <>
            b = 0, so the line goes through the origin — and adding two answers gives another answer, every time. That
            makes this set of answers a <strong>space</strong> in its own right, not just a list. It has the name{' '}
            <strong>nullspace</strong>.
          </>
        ) : (
          <>
            b = {b}, so the line misses the origin. Adding two answers gives 2x + 3y = {sumValue.toFixed(2)}, not {b} —
            the sum has fallen off the line onto the dashed one. A set like this has no structure worth studying, which
            is exactly the point the lecture is making.
          </>
        )}
      </Verdict>

      <LabNote>
        Lecture 1 asked <em>which</em> x solve Ax = b. This lecture asks a different question: what does the{' '}
        <strong>set</strong> of answers look like as an object? When b is zero the answers are closed under adding and
        stretching, so the set carries the same structure as the space it sits in. When b is not zero, they are not.
      </LabNote>
      <LabNote>
        That distinction is worth more than it looks. It is why the general answer to Ax = b is always “one particular
        answer, plus anything in the nullspace” — a point, plus a space.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — groups                                                            */
/* ========================================================================== */

interface Structure {
  id: string
  label: string
  set: string
  op: string
  closure: { ok: boolean; why: string }
  assoc: { ok: boolean; why: string }
  identity: { ok: boolean; why: string }
  inverse: { ok: boolean; why: string }
  abelian: { ok: boolean; why: string }
}

const STRUCTURES: Structure[] = [
  {
    id: 'zplus',
    label: '(ℤ, +)',
    set: 'the whole numbers, positive and negative',
    op: 'ordinary addition',
    closure: { ok: true, why: 'Add two whole numbers and you get a whole number. 3 + (−7) = −4.' },
    assoc: { ok: true, why: '(2 + 3) + 4 and 2 + (3 + 4) both give 9.' },
    identity: { ok: true, why: '0 is the do-nothing element: n + 0 = n for every n.' },
    inverse: { ok: true, why: 'Every n has −n, and n + (−n) = 0. For 7 it is −7.' },
    abelian: { ok: true, why: '3 + 5 and 5 + 3 both give 8, so it is an Abelian group.' },
  },
  {
    id: 'nplus',
    label: '(ℕ₀, +)',
    set: 'the counting numbers 0, 1, 2, 3, …',
    op: 'ordinary addition',
    closure: { ok: true, why: 'Add two counting numbers and you get a counting number.' },
    assoc: { ok: true, why: 'Addition does not care about brackets.' },
    identity: { ok: true, why: '0 is there, and n + 0 = n.' },
    inverse: {
      ok: false,
      why: 'What do you add to 3 to get 0? It would be −3, and −3 is not in the set. So this is not a group.',
    },
    abelian: { ok: false, why: 'The question does not arise — it is not a group in the first place.' },
  },
  {
    id: 'ztimes',
    label: '(ℤ, ·)',
    set: 'the whole numbers',
    op: 'ordinary multiplication',
    closure: { ok: true, why: 'A whole number times a whole number is a whole number.' },
    assoc: { ok: true, why: '(2 · 3) · 4 and 2 · (3 · 4) both give 24.' },
    identity: { ok: true, why: '1 is the do-nothing element: n · 1 = n.' },
    inverse: {
      ok: false,
      why: 'What do you multiply 3 by to get 1? It would be 1/3, which is not a whole number. Only 1 and −1 have inverses here.',
    },
    abelian: { ok: false, why: 'Multiplication does commute, but there is no group to be Abelian.' },
  },
  {
    id: 'qtimes',
    label: '(ℚ \\ {0}, ·)',
    set: 'the fractions, with zero left out',
    op: 'ordinary multiplication',
    closure: { ok: true, why: 'A fraction times a fraction is a fraction, and it is never 0 if neither was.' },
    assoc: { ok: true, why: 'Multiplication does not care about brackets.' },
    identity: { ok: true, why: '1 is the do-nothing element.' },
    inverse: {
      ok: true,
      why: 'Every p/q has q/p, and their product is 1. Leaving 0 out is exactly what makes this work.',
    },
    abelian: { ok: true, why: '(2/3)(5/7) and (5/7)(2/3) agree, so it is an Abelian group.' },
  },
  {
    id: 'mat',
    label: '(2 × 2 matrices, ·)',
    set: 'all 2 × 2 matrices',
    op: 'matrix multiplication',
    closure: { ok: true, why: 'A 2 × 2 times a 2 × 2 is a 2 × 2.' },
    assoc: { ok: true, why: 'Matrix multiplication is associative, even though it is not commutative.' },
    identity: { ok: true, why: 'The identity matrix I leaves everything alone.' },
    inverse: {
      ok: false,
      why: 'A matrix with determinant 0 — [1 1; 1 1], say — has no inverse. So this is not a group.',
    },
    abelian: { ok: false, why: 'AB and BA usually differ, so it would not be Abelian even if it were a group.' },
  },
]

export function GroupCheckLab() {
  const [pick, setPick] = useState('zplus')
  const s = STRUCTURES.find((x) => x.id === pick)!
  const isGroup = s.closure.ok && s.assoc.ok && s.identity.ok && s.inverse.ok

  const rows = [
    { name: 'Closure', short: 'x ⊗ y is still in G', ...s.closure },
    { name: 'Associativity', short: '(x ⊗ y) ⊗ z = x ⊗ (y ⊗ z)', ...s.assoc },
    { name: 'Identity element', short: 'some e with x ⊗ e = x', ...s.identity },
    { name: 'Inverse element', short: 'every x has a y with x ⊗ y = e', ...s.inverse },
  ]

  return (
    <LabBox>
      <Presets items={STRUCTURES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 text-[13px]/[1.7] text-zinc-700">
        <strong className="font-mono text-zinc-950">{s.label}</strong> — {s.set}, with {s.op}.
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.name}
            className="rounded-lg border px-3.5 py-2.5"
            style={
              r.ok
                ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)' }
                : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }
            }
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[13px] font-semibold" style={{ color: r.ok ? '#115e59' : '#991b1b' }}>
                {r.ok ? '✓' : '✗'} {r.name}
              </span>
              <span className="font-mono text-[11.5px] text-zinc-500">{r.short}</span>
            </div>
            <p className="mt-1 text-[12.5px]/[1.6] text-zinc-700">{r.why}</p>
          </div>
        ))}
      </div>

      <Verdict ok={isGroup}>
        {isGroup ? (
          <>
            All four hold, so <span className="font-mono">{s.label}</span> is a <strong>group</strong>.{' '}
            {s.abelian.ok ? s.abelian.why : ''}
          </>
        ) : (
          <>
            <span className="font-mono">{s.label}</span> is <strong>not</strong> a group. One axiom fails, and one is
            enough — {rows.find((r) => !r.ok)!.why}
          </>
        )}
      </Verdict>

      <LabNote>
        A <strong>group</strong> is the smallest useful amount of structure: a set, one way of combining two of its
        members, and four promises about that combining. Nothing about numbers, nothing about arrows — which is why the
        same four promises turn up again on the next page, describing how vectors add.
      </LabNote>
      <LabNote>
        Press through the five and notice which axiom does the failing. It is almost always the <strong>inverse</strong>
        . Closure, associativity and an identity are cheap; being able to undo anything is the demanding one.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — the vector space axioms, checked on numbers you choose            */
/* ========================================================================== */

const AXIOMS = [
  { id: 'dist1', label: 'λ(x + y) = λx + λy', name: 'A number spreads over a sum of vectors' },
  { id: 'dist2', label: '(λ + ψ)x = λx + ψx', name: 'A sum of numbers spreads over a vector' },
  { id: 'assoc', label: 'λ(ψx) = (λψ)x', name: 'Stretching twice is one stretch' },
  { id: 'ident', label: '1x = x', name: 'Stretching by 1 does nothing' },
  { id: 'zero', label: 'x + 0 = x', name: 'The zero vector changes nothing' },
  { id: 'neg', label: 'x + (−x) = 0', name: 'Every vector can be undone' },
] as const
type AxiomId = (typeof AXIOMS)[number]['id']

export function VectorSpaceAxiomLab() {
  const [x, setX] = useState<number[][]>([[3], [-1]])
  const [y, setY] = useState<number[][]>([[1], [4]])
  const [lam, setLam] = useState(2)
  const [psi, setPsi] = useState(-3)
  const [pick, setPick] = useState<AxiomId>('dist1')

  const X = toFr(x)
  const Y = toFr(y)
  const L = fr(lam)
  const P = fr(psi)

  let left = X
  let right = X
  if (pick === 'dist1') {
    left = scaleM(L, addM(X, Y)!)
    right = addM(scaleM(L, X), scaleM(L, Y))!
  } else if (pick === 'dist2') {
    left = scaleM(fr(lam + psi), X)
    right = addM(scaleM(L, X), scaleM(P, X))!
  } else if (pick === 'assoc') {
    left = scaleM(L, scaleM(P, X))
    right = scaleM(fr(lam * psi), X)
  } else if (pick === 'ident') {
    left = scaleM(fr(1), X)
    right = X
  } else if (pick === 'zero') {
    left = addM(X, toFr([[0], [0]]))!
    right = X
  } else {
    left = addM(X, scaleM(fr(-1), X))!
    right = toFr([[0], [0]])
  }
  const holds = eqM(left, right)
  const meta = AXIOMS.find((a) => a.id === pick)!
  const needsPsi = pick === 'dist2' || pick === 'assoc'
  const needsY = pick === 'dist1'

  return (
    <LabBox>
      <Presets items={AXIOMS.map((a) => ({ id: a.id, label: a.label }))} at={pick} onPick={setPick} />

      <div className="flex flex-wrap items-start gap-5">
        <Titled title="x">
          <NumBox m={x} name="x" width={54} onEdit={(i, _j, v) => setX(x.map((r, ri) => (ri === i ? [v] : r)))} />
        </Titled>
        {needsY && (
          <Titled title="y">
            <NumBox m={y} name="y" width={54} onEdit={(i, _j, v) => setY(y.map((r, ri) => (ri === i ? [v] : r)))} />
          </Titled>
        )}
        <div className="flex min-w-[190px] flex-col gap-3 pt-1">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>λ</span>
              <span className="text-zinc-500">{lam}</span>
            </div>
            <RangeInput label="lambda" value={lam} min={-4} max={4} step={1} onChange={setLam} />
          </div>
          {needsPsi && (
            <div>
              <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
                <span>ψ</span>
                <span className="text-zinc-500">{psi}</span>
              </div>
              <RangeInput label="psi" value={psi} min={-4} max={4} step={1} onChange={setPsi} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <Titled title="Left-hand side">
          <FrBox m={left} width={54} />
        </Titled>
        <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">vs</div>
        <Titled title="Right-hand side">
          <FrBox m={right} width={54} tone={holds ? TEAL : undefined} />
        </Titled>
      </div>

      <Verdict ok={holds}>
        <strong>{meta.name}.</strong>{' '}
        {holds
          ? 'Both sides came out the same — and they will for any numbers you type, because underneath it is just ordinary arithmetic done one slot at a time.'
          : 'The two sides differ, which should not be possible here.'}
      </Verdict>

      <LabNote>
        A <strong>vector space</strong> is a set with two operations: an <em>inner</em> one that adds two vectors, and
        an <em>outer</em> one that multiplies a vector by a plain number. The inner one has to make an Abelian group —
        the four promises from the last page, plus order not mattering. The outer one has to satisfy the rules above.
      </LabNote>
      <LabNote>
        Every one of these holds because the operations work slot by slot, and ordinary numbers already obey them. That
        is the whole trick: the axioms are not new demands, they are the old rules being written down carefully enough
        to apply to things that are not numbers.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — what else counts as a vector                                      */
/* ========================================================================== */

const KINDS = [
  { id: 'rn', label: 'Columns in ℝ³' },
  { id: 'mat', label: '2 × 3 matrices' },
  { id: 'poly', label: 'Polynomials' },
] as const
type KindId = (typeof KINDS)[number]['id']

export function WhatIsAVectorLab() {
  const [pick, setPick] = useState<KindId>('rn')
  const [lam, setLam] = useState(2)

  const shapes: Record<KindId, { a: number[][]; b: number[][]; rowLabels?: string[] }> = {
    rn: { a: [[1], [4], [-2]], b: [[3], [0], [5]] },
    mat: {
      a: [
        [1, 4, 2],
        [0, 3, 5],
      ],
      b: [
        [2, 1, 0],
        [6, 2, 1],
      ],
    },
    poly: { a: [[3, 2, 1]], b: [[-1, 0, 4]] },
  }
  const { a, b } = shapes[pick]
  const A = toFr(a)
  const B = toFr(b)
  const sum = addM(A, B)!
  const scaled = scaleM(fr(lam), A)

  const asPoly = (m: number[][]) => {
    const [c] = m
    const terms = [`${c[0]}x²`, `${c[1]}x`, `${c[2]}`]
    return terms.join(' + ').replace(/\+ -/g, '− ')
  }
  const frPoly = (m: typeof A) =>
    [`${frStr(m[0][0])}x²`, `${frStr(m[0][1])}x`, `${frStr(m[0][2])}`].join(' + ').replace(/\+ -/g, '− ')

  return (
    <LabBox>
      <Presets items={KINDS.map((k) => ({ id: k.id, label: k.label }))} at={pick} onPick={setPick} />

      {pick === 'poly' ? (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[14px]/[2] text-zinc-800">
          p = {asPoly(a)}
          <br />q = {asPoly(b)}
          <br />
          <span style={{ color: TEAL }}>p + q = {frPoly(sum)}</span>
          <br />
          <span style={{ color: TEAL }}>
            {lam}p = {frPoly(scaled)}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="first one">
            <NumBox m={a} readOnly width={50} />
          </Titled>
          <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">+</div>
          <Titled title="second one">
            <NumBox m={b} readOnly width={50} />
          </Titled>
          <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">=</div>
          <Titled title="their sum">
            <FrBox m={sum} width={50} tone={TEAL} />
          </Titled>
          <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">·</div>
          <Titled title={`${lam} × the first`}>
            <FrBox m={scaled} width={50} tone={TEAL} />
          </Titled>
        </div>
      )}

      <div className="max-w-[280px]">
        <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
          <span>the number λ</span>
          <span className="text-zinc-500">{lam}</span>
        </div>
        <RangeInput label="the number λ" value={lam} min={-3} max={4} step={1} onChange={setLam} />
      </div>

      <Verdict ok>
        Whatever you picked, the answer is the same kind of thing you started with — a column, a matrix, a polynomial.
        Both operations work one slot at a time, so every axiom from the last part holds without any extra work.
      </Verdict>

      <div className="flex flex-wrap gap-2">
        <Chip on label="ℝⁿ — columns of n numbers" />
        <Chip on label="ℝ^(m×n) — matrices of a fixed shape" />
        <Chip on label="polynomials up to a fixed degree" />
        <Chip on label="functions on an interval" />
      </div>

      <LabNote>
        This is why the lecture bothers with axioms instead of just talking about arrows. Every family above passes the
        same test, so every result proved about vector spaces — bases, dimension, independence — applies to all of them
        at once. Prove it once, use it everywhere.
      </LabNote>
      <LabNote>
        The polynomial case is worth a second look. 3x² + 2x + 1 does not look like an arrow, but it is completely
        described by its three coefficients, and adding two polynomials adds those coefficients. It <em>is</em> a column
        of three numbers, wearing different clothes.
      </LabNote>
    </LabBox>
  )
}
