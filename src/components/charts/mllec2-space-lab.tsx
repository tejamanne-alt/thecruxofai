'use client'

/**
 * Lecture 2, parts 1 to 6 — what a space is, and what has to hold before you
 * are allowed to call a set of model parameters one.
 *
 * Everything a lab prints is worked out from its own state on every render.
 * Nothing here stores a verdict: the axiom lights compare two numbers the lab
 * has just computed, so a lab can never disagree with its own arithmetic.
 */

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { ChartRow, PanelNote, RangeInput, ReadOut, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const ORANGE = '#d97706'
const TEAL = '#0d9488'
const RED = '#dc2626'
const SPAN = 4
const snap = (v: number) => Math.round(v * 2) / 2
const num = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, ''))
const vec = (x: number, y: number) => `(${num(x)}, ${num(y)})`

type Pt = { x: number; y: number }

/* ========================================================================== */
/* Part 1 — the solution set of w₁ + 2w₂ = b                                  */
/* ========================================================================== */

/**
 * The deck opens by saying it wants to stop looking at solutions and start
 * looking at spaces. This is the reason, in one picture: the solutions of a
 * linear system are closed under addition for exactly one value of the
 * right-hand side, and that value is zero.
 */
export function SolutionSetLab() {
  const [b, setB] = useState(0)
  // Each point on the line is fixed by its second coordinate alone.
  const [s1, setS1] = useState(1)
  const [s2, setS2] = useState(-1.5)

  const on = (s: number): Pt => ({ x: b - 2 * s, y: s })
  const u = on(s1)
  const v = on(s2)
  const sum = { x: u.x + v.x, y: u.y + v.y }

  // Substituting back into the very equation the line came from — never a
  // remembered answer.
  const lhs = (p: Pt) => p.x + 2 * p.y
  const sumLhs = lhs(sum)
  const closed = Math.abs(sumLhs - b) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // The line of solutions, drawn well past the plot so it reads as endless.
    g.strokeStyle = closed ? 'rgba(13,148,136,0.55)' : 'rgba(217,119,6,0.55)'
    g.lineWidth = 9
    g.beginPath()
    g.moveTo(f.px(b - 2 * -20), f.py(-20))
    g.lineTo(f.px(b - 2 * 20), f.py(20))
    g.stroke()

    arrow(g, f.px(0), f.py(0), f.px(u.x), f.py(u.y), acc)
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), TEAL)
    arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), closed ? '#16a34a' : RED, 3)

    // The parallelogram, so the sum is seen to be a sum.
    g.setLineDash([4, 4])
    g.strokeStyle = 'rgba(9,9,11,0.28)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(u.x), f.py(u.y))
    g.lineTo(f.px(sum.x), f.py(sum.y))
    g.lineTo(f.px(v.x), f.py(v.y))
    g.stroke()
    g.setLineDash([])

    grip(g, f.px(u.x), f.py(u.y), acc)
    grip(g, f.px(v.x), f.py(v.y), TEAL)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('u', f.px(u.x) + 10, f.py(u.y) - 8)
    g.fillText('v', f.px(v.x) + 10, f.py(v.y) - 8)
    g.fillText('u + v', f.px(sum.x) + 10, f.py(sum.y) - 8)
    return f
  }

  /** Nearest point of the line to wherever the pointer is. */
  function projectTo(x: number, y: number) {
    return clamp(snap((2 * b - 2 * x + y) / 5), -SPAN, SPAN)
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={370}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ ux: u.x, uy: u.y, vx: v.x, vy: v.y, b }}
          jumpKey={`${b}`}
          handles={(f) => [
            { id: 'u', px: f.px(u.x), py: f.py(u.y), label: 'The first solution u, which slides along the line' },
            { id: 'v', px: f.px(v.x), py: f.py(v.y), label: 'The second solution v, which slides along the line' },
          ]}
          onDragTo={(id, x, y) => (id === 'u' ? setS1(projectTo(x, y)) : setS2(projectTo(x, y)))}
          caption="Both arrows are stuck on the line — drag either one along it. The red or green arrow is their sum, and it is drawn wherever it lands, on the line or off it."
        />
      }
      panel={
        <>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>Right-hand side b</span>
              <span className="text-zinc-500">{num(b)}</span>
            </div>
            <RangeInput label="Right-hand side b" value={b} min={-3} max={3} step={0.5} onChange={setB} />
            <p className="mt-1.5 text-xs text-zinc-500">The one equation is w₁ + 2w₂ = b.</p>
          </div>

          <ReadOutGrid
            items={[
              { label: 'u', value: vec(u.x, u.y) },
              { label: 'v', value: vec(v.x, v.y) },
              { label: 'u + v', value: vec(sum.x, sum.y) },
              { label: 'b', value: num(b) },
            ]}
          />

          <ReadOut
            label="Put u + v back in the equation"
            value={`${num(sumLhs)}`}
            note={`needs to equal b = ${num(b)}`}
            tone={closed ? '#0d9488' : RED}
          />

          <Verdict ok={closed}>
            {closed ? (
              <>
                Every sum lands back on the line, and so does every multiple. The solution set of w₁ + 2w₂ = 0 is a
                space in its own right.
              </>
            ) : (
              <>
                The sum satisfies w₁ + 2w₂ = {num(sumLhs)}, not {num(b)}. Two solutions add up to something that is not
                a solution, so this set is not a space — it is just a list of answers.
              </>
            )}
          </Verdict>

          <PanelNote>
            Both u and v satisfy the equation, so their sum satisfies it with b doubled. The only b that survives being
            doubled is 0 — which is why the whole rest of the lecture is about sets that contain the origin.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Part 2 — groups                                                            */
/* ========================================================================== */

interface GroupCandidate {
  id: string
  label: string
  name: string
  op: string
  closure: { ok: boolean; why: string }
  assoc: { ok: boolean; why: string }
  identity: { ok: boolean; why: string }
  inverse: { ok: boolean; why: string }
  abelian: { ok: boolean; why: string }
  fromDeck?: string
}

const GROUPS: GroupCandidate[] = [
  {
    id: 'zplus',
    label: '(ℤ, +)',
    name: 'The whole numbers, positive and negative, under addition',
    op: 'x ⊗ y = x + y',
    closure: { ok: true, why: 'A whole number plus a whole number is a whole number.' },
    assoc: { ok: true, why: '(2 + 3) + 4 = 9 and 2 + (3 + 4) = 9.' },
    identity: { ok: true, why: 'e = 0, because x + 0 = x for every x.' },
    inverse: { ok: true, why: 'The inverse of x is −x, and −x is in ℤ. 5 + (−5) = 0.' },
    abelian: { ok: true, why: '2 + 3 = 3 + 2.' },
    fromDeck: 'Slide 4 gives this as the worked example of an Abelian group.',
  },
  {
    id: 'nplus',
    label: '(ℕ₀, +)',
    name: 'The counting numbers including zero, under addition',
    op: 'x ⊗ y = x + y',
    closure: { ok: true, why: '0, 1, 2, … added together never leave the set.' },
    assoc: { ok: true, why: 'Addition regroups freely whatever numbers you use.' },
    identity: { ok: true, why: 'e = 0 again, and 0 is in the set.' },
    inverse: { ok: false, why: 'To undo 5 you need −5, and −5 is not in ℕ₀. Only 0 has an inverse here.' },
    abelian: { ok: true, why: 'Addition does not care about order — but that never rescues a missing inverse.' },
    fromDeck: 'Slide 4 names this one as not a group, for exactly the missing-inverse reason.',
  },
  {
    id: 'ztimes',
    label: '(ℤ, ·)',
    name: 'The whole numbers under multiplication',
    op: 'x ⊗ y = x · y',
    closure: { ok: true, why: 'A whole number times a whole number is a whole number.' },
    assoc: { ok: true, why: '(2 · 3) · 4 = 24 and 2 · (3 · 4) = 24.' },
    identity: { ok: true, why: 'e = 1, because x · 1 = x.' },
    inverse: { ok: false, why: 'To undo 3 you need 1/3, which is not a whole number. Only 1 and −1 have inverses.' },
    abelian: { ok: true, why: '2 · 3 = 3 · 2.' },
    fromDeck: 'Slide 4: it has the identity element, but there exist elements with no inverse.',
  },
  {
    id: 'qtimes',
    label: '(ℝ∖{0}, ·)',
    name: 'Every real number except zero, under multiplication',
    op: 'x ⊗ y = x · y',
    closure: { ok: true, why: 'Two non-zero reals never multiply to zero, so you stay in the set.' },
    assoc: { ok: true, why: 'Multiplication regroups freely.' },
    identity: { ok: true, why: 'e = 1.' },
    inverse: { ok: true, why: 'The inverse of x is 1/x, which exists precisely because x is not 0.' },
    abelian: { ok: true, why: 'x · y = y · x for reals.' },
  },
  {
    id: 'mplus',
    label: '(ℝ²ˣ², +)',
    name: 'All 2 × 2 matrices, added entry by entry',
    op: 'A ⊗ B = A + B',
    closure: { ok: true, why: 'Adding two 2 × 2 boxes gives a 2 × 2 box.' },
    assoc: { ok: true, why: 'Each entry is just adding numbers, and that regroups.' },
    identity: { ok: true, why: 'The all-zeros matrix.' },
    inverse: { ok: true, why: 'Negate every entry. A + (−A) = 0.' },
    abelian: { ok: true, why: 'Entry-by-entry addition does not care about order.' },
    fromDeck: 'Slide 8 builds a vector space out of matrices, and this is the group underneath it.',
  },
  {
    id: 'mtimes',
    label: '(ℝ²ˣ², ·)',
    name: 'All 2 × 2 matrices, multiplied',
    op: 'A ⊗ B = AB',
    closure: { ok: true, why: 'A 2 × 2 times a 2 × 2 is a 2 × 2.' },
    assoc: { ok: true, why: '(AB)C = A(BC) — true for matrices, and the reason a deep network can be re-bracketed.' },
    identity: { ok: true, why: 'The identity matrix I, with ones down the diagonal.' },
    inverse: {
      ok: false,
      why: 'A matrix with determinant 0 has no inverse. [[1,2],[2,4]] is one, and it is in the set.',
    },
    abelian: { ok: false, why: 'AB and BA usually differ. Swapping two layers of a network is not a no-op.' },
  },
  {
    id: 'ginvertible',
    label: '(GL₂, ·)',
    name: 'Only the invertible 2 × 2 matrices, multiplied',
    op: 'A ⊗ B = AB',
    closure: { ok: true, why: 'det(AB) = det(A)·det(B), and two non-zero numbers multiply to a non-zero number.' },
    assoc: { ok: true, why: 'Matrix multiplication regroups.' },
    identity: { ok: true, why: 'I, whose determinant is 1, so it is in the set.' },
    inverse: { ok: true, why: 'That is what the set was defined to contain.' },
    abelian: {
      ok: false,
      why: 'Still not commutative. A group need not be Abelian, and this is the standard example.',
    },
  },
]

export function GroupLab() {
  const [pick, setPick] = useState('zplus')
  const c = GROUPS.find((g) => g.id === pick)!

  const laws: Array<[string, string, { ok: boolean; why: string }]> = [
    ['Closure', '∀ x, y ∈ G, x ⊗ y ∈ G', c.closure],
    ['Associativity', '(x ⊗ y) ⊗ z = x ⊗ (y ⊗ z)', c.assoc],
    ['Identity element', '∃ e ∈ G with x ⊗ e = x', c.identity],
    ['Inverse element', '∀ x ∃ y with x ⊗ y = e', c.inverse],
  ]
  const isGroup = laws.every(([, , l]) => l.ok)
  const isAbelian = isGroup && c.abelian.ok

  return (
    <LabBox>
      <Presets items={GROUPS.map((g) => ({ id: g.id, label: g.label }))} at={pick} onPick={setPick} />

      <div>
        <div className="text-[13.5px] font-semibold text-zinc-950">{c.name}</div>
        <div className="mt-0.5 font-mono text-[12.5px] text-zinc-500">{c.op}</div>
      </div>

      <div className="flex flex-col gap-2">
        {laws.map(([name, form, l]) => (
          <div
            key={name}
            className="flex flex-col gap-1 rounded-lg border px-3.5 py-2.5"
            style={
              l.ok
                ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)' }
                : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }
            }
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[13px] font-semibold" style={{ color: l.ok ? '#115e59' : '#991b1b' }}>
                {l.ok ? '✓' : '✗'} {name}
              </span>
              <span className="font-mono text-[11.5px] text-zinc-500">{form}</span>
            </div>
            <span className="text-[12.5px]/[1.6] text-zinc-700">{l.why}</span>
          </div>
        ))}
      </div>

      <Verdict ok={isGroup}>
        {isGroup ? (
          <>
            All four hold, so {c.label} is a group
            {isAbelian ? ', and x ⊗ y = y ⊗ x as well, so it is an Abelian group.' : '. '}
            {!isAbelian && <>It is not Abelian: {c.abelian.why}</>}
          </>
        ) : (
          <>
            {c.label} is not a group. {laws.find(([, , l]) => !l.ok)![0]} is the promise it breaks.
          </>
        )}
      </Verdict>

      {c.fromDeck && <LabNote>{c.fromDeck}</LabNote>}
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — the vector space axioms, checked by arithmetic                    */
/* ========================================================================== */

type OuterId = 'real' | 'first' | 'double'

const OUTERS: Array<{ id: OuterId; label: string; formula: string; f: (l: number, p: Pt) => Pt; blurb: string }> = [
  {
    id: 'real',
    label: 'The real one',
    formula: 'λ · x = (λx₁, λx₂)',
    f: (l, p) => ({ x: l * p.x, y: l * p.y }),
    blurb: 'Scaling as slide 7 defines it: multiply every component by λ.',
  },
  {
    id: 'first',
    label: 'Scale only the first component',
    formula: 'λ ⊙ x = (λx₁, x₂)',
    f: (l, p) => ({ x: l * p.x, y: p.y }),
    blurb: 'A plausible-looking rule that fails exactly one law. Find out which before you read the verdict.',
  },
  {
    id: 'double',
    label: 'Scale by twice λ',
    formula: 'λ ⊙ x = (2λx₁, 2λx₂)',
    f: (l, p) => ({ x: 2 * l * p.x, y: 2 * l * p.y }),
    blurb: 'This one keeps both distributive laws and breaks the other two.',
  },
]

function NumIn({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-[54px] shrink-0 font-mono text-[13px] font-semibold text-zinc-950">{label}</span>
      <input
        value={value}
        inputMode="numeric"
        aria-label={label}
        onChange={(e) => {
          const raw = e.target.value.trim()
          const n = raw === '' || raw === '-' ? 0 : Number(raw)
          if (Number.isFinite(n)) onChange(n)
        }}
        className="w-[70px] rounded-md border border-zinc-950/10 bg-white px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none hover:bg-zinc-950/[0.03]"
      />
    </label>
  )
}

export function AxiomLab() {
  const [lam, setLam] = useState(3)
  const [psi, setPsi] = useState(-2)
  const [x, setX] = useState<Pt>({ x: 1, y: 4 })
  const [y, setY] = useState<Pt>({ x: 2, y: -1 })
  const [outer, setOuter] = useState<OuterId>('real')

  const o = OUTERS.find((v) => v.id === outer)!
  const mul = o.f
  const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
  const same = (a: Pt, b: Pt) => Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9

  // Both sides of every law, evaluated. The tick is a comparison of two numbers
  // this lab has just worked out, so it cannot drift away from the arithmetic.
  const rows: Array<{ name: string; law: string; lhs: Pt; rhs: Pt; lhsTxt: string; rhsTxt: string }> = [
    {
      name: 'Distributivity over vector addition',
      law: 'λ · (x + y) = λ · x + λ · y',
      lhs: mul(lam, add(x, y)),
      rhs: add(mul(lam, x), mul(lam, y)),
      lhsTxt: `${lam} · ${vec(x.x + y.x, x.y + y.y)}`,
      rhsTxt: `${lam} · x + ${lam} · y`,
    },
    {
      name: 'Distributivity over scalar addition',
      law: '(λ + ψ) · x = λ · x + ψ · x',
      lhs: mul(lam + psi, x),
      rhs: add(mul(lam, x), mul(psi, x)),
      lhsTxt: `${lam + psi} · ${vec(x.x, x.y)}`,
      rhsTxt: `${lam} · x + ${psi} · x`,
    },
    {
      name: 'Associativity of the outer operation',
      law: 'λ · (ψ · x) = (λψ) · x',
      lhs: mul(lam, mul(psi, x)),
      rhs: mul(lam * psi, x),
      lhsTxt: `${lam} · (${psi} · x)`,
      rhsTxt: `${lam * psi} · x`,
    },
    {
      name: 'Neutral element of the outer operation',
      law: '1 · x = x',
      lhs: mul(1, x),
      rhs: x,
      lhsTxt: '1 · x',
      rhsTxt: 'x',
    },
    {
      name: 'The inner operation commutes',
      law: 'x + y = y + x',
      lhs: add(x, y),
      rhs: add(y, x),
      lhsTxt: 'x + y',
      rhsTxt: 'y + x',
    },
  ]

  const broken = rows.filter((r) => !same(r.lhs, r.rhs))

  return (
    <LabBox>
      <Presets items={OUTERS.map((v) => ({ id: v.id, label: v.label }))} at={outer} onPick={setOuter} />
      <LabNote>
        <span className="font-mono text-[12.5px]">{o.formula}</span> — {o.blurb}
      </LabNote>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <NumIn label="λ" value={lam} onChange={setLam} />
        <NumIn label="ψ" value={psi} onChange={setPsi} />
        <NumIn label="x₁" value={x.x} onChange={(v) => setX((p) => ({ ...p, x: v }))} />
        <NumIn label="x₂" value={x.y} onChange={(v) => setX((p) => ({ ...p, y: v }))} />
        <NumIn label="y₁" value={y.x} onChange={(v) => setY((p) => ({ ...p, x: v }))} />
        <NumIn label="y₂" value={y.y} onChange={(v) => setY((p) => ({ ...p, y: v }))} />
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const ok = same(r.lhs, r.rhs)
          return (
            <div
              key={r.name}
              className="rounded-lg border px-3.5 py-2.5"
              style={
                ok
                  ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)' }
                  : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }
              }
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[13px] font-semibold" style={{ color: ok ? '#115e59' : '#991b1b' }}>
                  {ok ? '✓' : '✗'} {r.name}
                </span>
                <span className="font-mono text-[11.5px] text-zinc-500">{r.law}</span>
              </div>
              <div className="mt-1 overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-zinc-700">
                {r.lhsTxt} = {vec(r.lhs.x, r.lhs.y)} {ok ? '=' : '≠'} {vec(r.rhs.x, r.rhs.y)} = {r.rhsTxt}
              </div>
            </div>
          )
        })}
      </div>

      <Verdict ok={broken.length === 0}>
        {broken.length === 0 ? (
          <>
            Every law holds at these numbers. That is not a proof — a proof has to hold for all λ, ψ, x and y — but one
            set of numbers where a law fails is enough to prove a rule is not a vector space.
          </>
        ) : (
          <>
            {broken.length === 1 ? 'One law fails' : `${broken.length} laws fail`} at these numbers:{' '}
            {broken.map((r) => r.name.toLowerCase()).join('; ')}. One counterexample is all it takes — this is not a
            vector space.
          </>
        )}
      </Verdict>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — what else counts as a vector                                      */
/* ========================================================================== */

interface Kind {
  id: string
  label: string
  shape: string
  /** Laid out as rows so a column, a matrix and a batch all print the same way. */
  a: number[][]
  b: number[][]
  note: string
}

const KINDS: Kind[] = [
  {
    id: 'col',
    label: 'A column in ℝ⁴',
    shape: '4 × 1',
    a: [[2], [-1], [0], [5]],
    b: [[1], [1], [3], [-2]],
    note: 'One row of a dataset: four measurements about one house, one patient, one email. Slide 7 is exactly this.',
  },
  {
    id: 'mat',
    label: 'A 2 × 3 matrix',
    shape: '2 × 3',
    a: [
      [1, 2, 3],
      [4, 5, 6],
    ],
    b: [
      [0, -1, 2],
      [3, 0, -4],
    ],
    note: 'Slide 8. Nothing about the two operations mentions columns, so a box of numbers is a vector too.',
  },
  {
    id: 'weights',
    label: 'A layer’s weight matrix',
    shape: '3 × 2',
    a: [
      [0.5, -0.2],
      [1.4, 0.9],
      [-0.7, 0.3],
    ],
    b: [
      [0.1, 0.1],
      [-0.4, 0.2],
      [0.6, -0.5],
    ],
    note: 'Not on the slides, but the same object: this is why an optimiser can treat every weight in a network as one point being moved.',
  },
  {
    id: 'poly',
    label: 'A quadratic, by its coefficients',
    shape: '3 × 1',
    a: [[1], [-3], [2]],
    b: [[0], [4], [-1]],
    note: 'Not on the slides. a + bx + cx² added to another quadratic is a quadratic, and scaled is a quadratic — so polynomials form a vector space too.',
  },
]

const fmtCell = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2))

function Box({ m, title, tone }: { m: number[][]; title: string; tone?: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
        {m.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((v, j) => (
              <span
                key={j}
                style={{ color: tone }}
                className="w-[54px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
              >
                {fmtCell(v)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function VectorKindLab() {
  const [pick, setPick] = useState('col')
  const [lam, setLam] = useState(2)
  const k = KINDS.find((x) => x.id === pick)!

  const sum = k.a.map((row, i) => row.map((v, j) => v + k.b[i][j]))
  const scaled = k.a.map((row) => row.map((v) => v * lam))

  return (
    <LabBox>
      <Presets items={KINDS.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="flex flex-wrap items-start gap-4 overflow-x-auto">
        <Box m={k.a} title="x" />
        <Box m={k.b} title="y" />
        <Box m={sum} title="x + y" tone={TEAL} />
        <Box m={scaled} title={`${lam} · x`} tone={ORANGE} />
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
          <span>The scalar λ</span>
          <span className="text-zinc-500">{lam}</span>
        </div>
        <RangeInput label="The scalar λ" value={lam} min={-3} max={3} step={1} onChange={setLam} />
      </div>

      <Verdict ok>
        Both answers are still {k.shape}, so both are still in the set. The two operations never looked at the shape —
        they added matching entries and multiplied entries by a number — which is why one theory covers all of these.
      </Verdict>
      <LabNote>{k.note}</LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Parts 5 — is this subset a subspace?                                       */
/* ========================================================================== */

interface SubCandidate {
  id: string
  label: string
  name: string
  inside: (p: Pt) => boolean
  paint: (g: CanvasRenderingContext2D, f: Frame) => void
  note: string
}

function shadeLine(g: CanvasRenderingContext2D, f: Frame, dx: number, dy: number, ox = 0, oy = 0) {
  g.strokeStyle = 'rgba(79,70,229,0.45)'
  g.lineWidth = 10
  g.beginPath()
  g.moveTo(f.px(ox - dx * SPAN * 3), f.py(oy - dy * SPAN * 3))
  g.lineTo(f.px(ox + dx * SPAN * 3), f.py(oy + dy * SPAN * 3))
  g.stroke()
}

const TINT = 'rgba(79,70,229,0.12)'
const near0 = (v: number) => Math.abs(v) < 1e-9

const SUBSETS: SubCandidate[] = [
  {
    id: 'axis',
    label: 'The w₂-axis',
    name: '𝒰 = {w : w₁ = 0} — models that ignore feature 1 entirely',
    inside: (p) => near0(p.x),
    paint: (g, f) => shadeLine(g, f, 0, 1),
    note: 'Slide 11 works this one out for the y-axis. Adding two of them stays on it, and scaling by anything — 0 included — stays on it.',
  },
  {
    id: 'line',
    label: 'A slanted line through 0',
    name: '𝒰 = all multiples of (2, 1)',
    inside: (p) => near0(p.x - 2 * p.y),
    paint: (g, f) => shadeLine(g, f, 2 / Math.sqrt(5), 1 / Math.sqrt(5)),
    note: 'Any line through the origin, not just the axes. Every point is a multiple of one vector, and multiples of it add to multiples of it.',
  },
  {
    id: 'nullsp',
    label: 'The nullspace of [1 2]',
    name: '𝒰 = {w : w₁ + 2w₂ = 0} — weights this one-row design matrix cannot tell apart',
    inside: (p) => near0(p.x + 2 * p.y),
    paint: (g, f) => shadeLine(g, f, -2 / Math.sqrt(5), 1 / Math.sqrt(5)),
    note: 'Slide 12 asks why the solutions of Ax = 0 form a subspace. Here is the answer in two lines: A(x + y) = Ax + Ay = 0 + 0 = 0, and A(λx) = λ(Ax) = λ·0 = 0.',
  },
  {
    id: 'shift',
    label: 'The line w₁ = 1',
    name: '𝒰 = {w : w₁ = 1}',
    inside: (p) => near0(p.x - 1),
    paint: (g, f) => shadeLine(g, f, 0, 1, 1, 0),
    note: 'Slide 11’s second example — the axis shifted one unit across. It fails on both counts, and the quickest tell is that the origin is not in it.',
  },
  {
    id: 'square',
    label: 'A square around 0',
    name: '𝒰 = {−1 ≤ w₁ ≤ 1, −1 ≤ w₂ ≤ 1} — a weight clipped to ±1',
    inside: (p) => Math.abs(p.x) <= 1 + 1e-9 && Math.abs(p.y) <= 1 + 1e-9,
    paint: (g, f) => {
      g.fillStyle = TINT
      g.fillRect(f.px(-1), f.py(1), f.px(1) - f.px(-1), f.py(-1) - f.py(1))
      g.strokeStyle = 'rgba(79,70,229,0.5)'
      g.lineWidth = 1.5
      g.strokeRect(f.px(-1), f.py(1), f.px(1) - f.px(-1), f.py(-1) - f.py(1))
    },
    note: 'Slide 12’s square. It does contain the origin, which shows that containing 0 is necessary but nowhere near enough.',
  },
  {
    id: 'nonneg',
    label: 'Non-negative weights',
    name: '𝒰 = {w : w₁ ≥ 0, w₂ ≥ 0} — the constraint in non-negative matrix factorisation',
    inside: (p) => p.x >= -1e-9 && p.y >= -1e-9,
    paint: (g, f) => {
      g.fillStyle = TINT
      g.fillRect(f.px(0), f.T, f.R - f.px(0), f.py(0) - f.T)
    },
    note: 'Adding never takes you out and the origin is in, so it survives half the test. Multiplying by −1 is what kills it: closure has to hold for every real λ, negatives included.',
  },
  {
    id: 'unit',
    label: 'Unit-length weights',
    name: '𝒰 = {w : ‖w‖ = 1} — the constraint on a normalised embedding',
    inside: (p) => Math.abs(Math.hypot(p.x, p.y) - 1) < 1e-9,
    paint: (g, f) => {
      g.strokeStyle = 'rgba(79,70,229,0.5)'
      g.lineWidth = 8
      g.beginPath()
      g.arc(f.px(0), f.py(0), f.px(1) - f.px(0), 0, Math.PI * 2)
      g.stroke()
    },
    note: 'Not on the slides, but the mistake is common. A circle is not a subspace: it does not contain the origin, and two unit vectors almost never add to a unit vector.',
  },
  {
    id: 'sparse',
    label: 'Only one feature used',
    name: '𝒰 = {w : w₁ = 0 or w₂ = 0} — the set an L₀ “use one feature” rule picks out',
    inside: (p) => near0(p.x) || near0(p.y),
    paint: (g, f) => {
      shadeLine(g, f, 0, 1)
      shadeLine(g, f, 1, 0)
    },
    note: 'Not on the slides. Scaling is fine and the origin is in — it is adding that breaks: (1, 0) + (0, 1) = (1, 1) uses both features. This is exactly why the L₀ “count the non-zeros” penalty is not convex and gets replaced by the L₁ one.',
  },
]

/** One closure test, with a third "not tested yet" state that says so plainly. */
function Light({ ok, label, note }: { ok: boolean | null; label: string; note: string }) {
  return (
    <div
      className="rounded-lg border px-3 py-2"
      style={
        ok === null
          ? { borderColor: 'rgba(9,9,11,0.12)', background: '#fff' }
          : ok
            ? { borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.06)' }
            : { borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }
      }
    >
      <div
        className="text-[12.5px] font-semibold"
        style={{ color: ok === null ? '#71717a' : ok ? '#115e59' : '#991b1b' }}
      >
        {ok === null ? '–' : ok ? '✓' : '✗'} {label}
      </div>
      <div className="text-[11.5px]/[1.5] text-zinc-600">{note}</div>
    </div>
  )
}

export function SubspaceLab() {
  const [pick, setPick] = useState('axis')
  const [u, setU] = useState<Pt>({ x: 0, y: 2 })
  const [v, setV] = useState<Pt>({ x: 0, y: -1.5 })
  const [lam, setLam] = useState(-1)

  const c = SUBSETS.find((x) => x.id === pick)!
  const sum = { x: u.x + v.x, y: u.y + v.y }
  const scaled = { x: lam * u.x, y: lam * u.y }

  const hasZero = c.inside({ x: 0, y: 0 })
  const uIn = c.inside(u)
  const vIn = c.inside(v)
  const sumIn = c.inside(sum)
  const scaledIn = c.inside(scaled)

  // Only meaningful once both inputs are actually inside the set — a closure
  // test on a vector that was never in it says nothing at all.
  const addTested = uIn && vIn
  const scaleTested = uIn

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    c.paint(g, f)
    const acc = accentColour()

    arrow(g, f.px(0), f.py(0), f.px(u.x), f.py(u.y), uIn ? acc : 'rgba(9,9,11,0.3)')
    arrow(g, f.px(0), f.py(0), f.px(v.x), f.py(v.y), vIn ? TEAL : 'rgba(9,9,11,0.3)')
    if (addTested) arrow(g, f.px(0), f.py(0), f.px(sum.x), f.py(sum.y), sumIn ? '#16a34a' : RED, 3)
    if (scaleTested) arrow(g, f.px(0), f.py(0), f.px(scaled.x), f.py(scaled.y), scaledIn ? '#16a34a' : ORANGE, 2)

    grip(g, f.px(u.x), f.py(u.y), acc)
    grip(g, f.px(v.x), f.py(v.y), TEAL)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('u', f.px(u.x) + 10, f.py(u.y) - 8)
    g.fillText('v', f.px(v.x) + 10, f.py(v.y) - 8)
    if (addTested) g.fillText('u + v', f.px(sum.x) + 10, f.py(sum.y) - 8)
    if (scaleTested) g.fillText('λu', f.px(scaled.x) + 10, f.py(scaled.y) + 14)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={380}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ ux: u.x, uy: u.y, vx: v.x, vy: v.y, lam }}
          jumpKey={pick}
          handles={(f) => [
            { id: 'u', px: f.px(u.x), py: f.py(u.y), label: 'The vector u' },
            { id: 'v', px: f.px(v.x), py: f.py(v.y), label: 'The vector v' },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: clamp(snap(x), -SPAN, SPAN), y: clamp(snap(y), -SPAN, SPAN) }
            if (id === 'u') setU(p)
            else setV(p)
          }}
          caption="Drag u and v anywhere. They go grey when they are outside the shaded set — a closure test only means something when both inputs are inside it."
        />
      }
      panel={
        <>
          <Presets items={SUBSETS.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />
          <PanelNote>{c.name}</PanelNote>

          <div>
            <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
              <span>The scalar λ</span>
              <span className="text-zinc-500">{num(lam)}</span>
            </div>
            <RangeInput label="The scalar λ" value={lam} min={-2} max={2} step={0.5} onChange={setLam} />
          </div>

          <div className="flex flex-col gap-2">
            <Light ok={hasZero} label="0 ∈ 𝒰" note="A subspace must contain the zero vector, because 0 · u is in it." />
            <Light
              ok={addTested ? sumIn : null}
              label="Closed under +"
              note={
                addTested
                  ? `u + v = ${vec(sum.x, sum.y)}, which is ${sumIn ? 'inside' : 'outside'}.`
                  : 'Move both u and v into the set to test this.'
              }
            />
            <Light
              ok={scaleTested ? scaledIn : null}
              label="Closed under λ·"
              note={
                scaleTested
                  ? `λu = ${vec(scaled.x, scaled.y)}, which is ${scaledIn ? 'inside' : 'outside'}.`
                  : 'Move u into the set to test this.'
              }
            />
          </div>

          <LabNote>{c.note}</LabNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Part 6 — the nullspace of a design matrix                                  */
/* ========================================================================== */

/**
 * The one subspace the lecture singles out, shown as the thing it actually is
 * in a model: the set of weight changes that no amount of data can detect.
 * The design matrix is fixed with its second column twice the first, which is
 * what a duplicated feature looks like.
 */
export function NullspaceLab() {
  const [w, setW] = useState<Pt>({ x: 1, y: 0.5 })

  // Two features, three samples. Column 2 = 2 × column 1: "size in metres" and
  // "size in half-metres" recorded side by side.
  const X: Array<[number, number]> = [
    [1, 2],
    [2, 4],
    [-1, -2],
  ]
  const predict = (p: Pt) => X.map(([a, b]) => a * p.x + b * p.y)
  const preds = predict(w)

  // The nullspace direction, worked out rather than typed: X n = 0 for n = (2, −1)
  // because column 2 is twice column 1.
  const n: Pt = { x: 2, y: -1 }
  const nPreds = predict(n)
  const nIsNull = nPreds.every((v) => Math.abs(v) < 1e-9)

  const base: Pt = { x: 1, y: 0.5 }
  const basePreds = predict(base)
  const sameAsBase = preds.every((v, i) => Math.abs(v - basePreds[i]) < 1e-9)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    // Every w that gives the same predictions as the starting w: a line
    // through it in the nullspace direction.
    g.strokeStyle = 'rgba(13,148,136,0.45)'
    g.lineWidth = 9
    g.beginPath()
    g.moveTo(f.px(base.x - n.x * 20), f.py(base.y - n.y * 20))
    g.lineTo(f.px(base.x + n.x * 20), f.py(base.y + n.y * 20))
    g.stroke()

    // The nullspace itself, through the origin.
    g.setLineDash([6, 5])
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(f.px(-n.x * 20), f.py(-n.y * 20))
    g.lineTo(f.px(n.x * 20), f.py(n.y * 20))
    g.stroke()
    g.setLineDash([])

    arrow(g, f.px(0), f.py(0), f.px(w.x), f.py(w.y), acc)
    grip(g, f.px(w.x), f.py(w.y), acc)

    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('w', f.px(w.x) + 10, f.py(w.y) - 8)
    g.fillText('null(X), through 0', f.px(n.x * 1.3) + 8, f.py(n.y * 1.3) + 4)
    g.fillStyle = '#0f766e'
    g.fillText('same predictions as the start', f.px(base.x - n.x * 1.4) + 6, f.py(base.y - n.y * 1.4) - 10)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={370}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ wx: w.x, wy: w.y }}
          handles={(f) => [
            {
              id: 'w',
              px: f.px(w.x),
              py: f.py(w.y),
              grab: 'anywhere',
              label: 'The weight vector w — press anywhere on the plot to move it',
            },
          ]}
          onDragTo={(_id, x, y) => setW({ x: clamp(snap(x), -SPAN, SPAN), y: clamp(snap(y), -SPAN, SPAN) })}
          caption="Press anywhere to move w. Stay on the teal line and all three predictions hold still; step off it and they move."
        />
      }
      panel={
        <>
          <PanelNote>
            Two features, three samples, and the second feature is the first one measured in different units — so column
            2 of X is exactly twice column 1.
          </PanelNote>

          <ReadOutGrid
            items={[
              { label: 'w', value: vec(w.x, w.y) },
              { label: 'ŷ₁', value: num(preds[0]) },
              { label: 'ŷ₂', value: num(preds[1]) },
              { label: 'ŷ₃', value: num(preds[2]) },
            ]}
          />

          <Verdict ok={sameAsBase}>
            {sameAsBase ? (
              <>
                Same three predictions as the starting w = (1, 0.5), from a different w. The data cannot tell these two
                models apart, so no amount of fitting will ever choose between them.
              </>
            ) : (
              <>
                These predictions differ from the starting w = ({num(basePreds[0])}, {num(basePreds[1])},{' '}
                {num(basePreds[2])}). You have stepped off the line, so the data can now see the difference.
              </>
            )}
          </Verdict>

          <Btn onClick={() => setW({ x: w.x + n.x, y: w.y + n.y })}>Add the nullspace direction (2, −1)</Btn>

          <PanelNote>
            X n = ({nPreds.map(num).join(', ')}) for n = (2, −1), so n is {nIsNull ? '' : 'not '}in the nullspace.
            Adding it changes w and changes nothing you could ever measure.
          </PanelNote>
        </>
      }
    />
  )
}
