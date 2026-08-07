'use client'

import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, RangeInput, ReadOutGrid } from '@/components/sessions/session-parts'
import { frStr } from '@/lib/model/fraction'
import { detM, leadOf, ncols, nrows, refOnly, rrefOf, toFr } from '@/lib/model/matrix'
import { useState } from 'react'

const TEAL = '#0d9488'

/** Pivot columns of a matrix, worked out fresh from its reduced form. */
function pivotsOf(g: number[][]) {
  return rrefOf(toFr(g)).pivots
}

/* ========================================================================== */
/* Part 9 — different routes, different staircases, same pivot columns        */
/* ========================================================================== */

const ROUTES = [
  {
    id: 'deck',
    label: 'The route on slide 21',
    steps: [
      'R2 ← R2 − 2R1,  R3 ← R3 + 3R1,  R4 ← R4 − 4R1',
      'R2 ← −R2',
      'R3 ← R3 − 3R2,  R4 ← R4 + 2R2',
      'R3 ← −½R3,  R4 ← R4 − 5R3',
    ],
    end: [
      [1, 1, -1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
  },
  {
    id: 'lec0b',
    label: 'The route in Lecture 0b',
    steps: [
      'R2 ← R2 − 2R1,  R3 ← R3 + 3R1,  R4 ← R4 − 4R1',
      'R3 ← R3 + 3R2,  R4 ← R4 − 2R2',
      'R4 ← 2R4 + 5R3',
    ],
    end: [
      [1, 1, -1],
      [0, -1, 0],
      [0, 0, -2],
      [0, 0, 0],
    ],
  },
] as const
type RouteId = (typeof ROUTES)[number]['id']

const START = [
  [1, 1, -1],
  [2, 1, -2],
  [-3, 0, 1],
  [4, 2, 1],
]

export function EchelonRoutesLab() {
  const [pick, setPick] = useState<RouteId>('deck')
  const r = ROUTES.find((x) => x.id === pick)!
  const lead = leadOf(toFr(r.end as unknown as number[][]))
  const pivots = pivotsOf(r.end as unknown as number[][])
  const rrefBoth = rrefOf(toFr(START)).R

  return (
    <LabBox>
      <Presets items={ROUTES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The three vectors, as columns">
          <NumBox m={START} readOnly width={48} />
        </Titled>
        <div className="max-w-[300px] pt-6 font-mono text-[12px]/[1.8] text-zinc-600">
          {r.steps.map((s, i) => (
            <div key={i}>{s}</div>
          ))}
        </div>
        <Titled title="Where that route ends">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {(r.end as unknown as number[][]).map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <span
                    key={j}
                    className="w-[48px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                    style={lead[i] === j ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                  >
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
      </div>

      <Verdict ok>
        Both routes are correct, and they end on <strong>different matrices</strong>. What they agree on is the thing
        that matters: pivots in columns {pivots.map((c) => c + 1).join(', ')} — all three — so the three vectors are
        linearly independent either way.
      </Verdict>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="And the reduced form, which is the same for both">
          <FrBox m={rrefBoth} width={48} tone={TEAL} />
        </Titled>
        <div className="max-w-[320px] pt-6 text-[13px]/[1.7] text-zinc-700">
          A matrix has <strong>many</strong> row echelon forms — one per route. It has exactly{' '}
          <strong>one</strong> reduced row echelon form. That is why an answer key and your working can disagree on the
          middle steps and still both be right.
        </div>
      </div>

      <LabNote>
        This exact example appears in Lecture 0b as well, and the two decks print different echelon forms for it. Not a
        mistake in either: they made different choices about when to divide through. Judge your working by the pivot
        columns, not by whether the numbers match someone else&rsquo;s.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — vectors built from other vectors                                 */
/* ========================================================================== */

/**
 * The x's are built from independent b's, so testing the x's for independence
 * is the same as testing their coefficient columns. Editing the coefficients
 * and watching both verdicts move together is the point.
 */
export function CoordinateLab() {
  const [lam, setLam] = useState<number[][]>([
    [1, -4, 2],
    [-2, -2, 3],
    [1, 0, -1],
  ])

  const L = toFr(lam)
  const { pivots } = rrefOf(L)
  const independent = pivots.length === ncols(L)
  const d = detM(L)

  return (
    <LabBox>
      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[13px]/[1.9] text-zinc-800">
        {lam[0].map((_, j) => (
          <div key={j}>
            x{j + 1} ={' '}
            {lam
              .map((row, i) => `${row[j] < 0 ? '− ' : j === 0 && i === 0 ? '' : '+ '}${Math.abs(row[j])}b${i + 1}`)
              .join(' ')
              .replace(/^\+ /, '')}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The coefficient columns λ₁ λ₂ λ₃" note="type over anything">
          <NumBox
            m={lam}
            width={52}
            onEdit={(i, j, v) => setLam(lam.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
          />
        </Titled>
        <Titled title="Reduced form">
          <FrBox m={rrefOf(L).R} width={52} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'pivot columns', value: pivots.map((c) => c + 1).join(', ') || 'none' },
              { label: 'rank', value: String(pivots.length) },
              { label: 'det of λ', value: d ? frStr(d) : '—' },
              { label: 'the λ’s are', value: independent ? 'independent' : 'dependent' },
            ]}
          />
        </div>
      </div>

      <Verdict ok={independent}>
        {independent ? (
          <>
            The coefficient columns are independent, so the vectors <strong>x₁, x₂, x₃ are independent too</strong> —
            provided b₁, b₂, b₃ were. You never had to know what the b&rsquo;s actually are.
          </>
        ) : (
          <>
            The coefficient columns are dependent, so <strong>x₁, x₂, x₃ are dependent</strong> as well. Some mixture
            of them collapses to the zero vector, whatever the b&rsquo;s were.
          </>
        )}
      </Verdict>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Why it transfers
        </div>
        <div className="crux-prose overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`Write B = [b₁ b₂ … bₖ], so each xⱼ = Bλⱼ.

Test the x's:      Σⱼ ψⱼ xⱼ = 0
substitute:        Σⱼ ψⱼ Bλⱼ = 0
pull B out:        B ( Σⱼ ψⱼ λⱼ ) = 0

The b's are independent, so the only combination of B's columns
that gives 0 is the all-zeros one. Therefore

                   Σⱼ ψⱼ λⱼ = 0

and the ψ's that kill the x's are exactly the ψ's that kill the
λ's. The two questions are the same question.`}
        </div>
      </div>

      <LabNote>
        This is the step that makes the whole subject portable. You do not need to know what the b&rsquo;s are — arrows,
        matrices, polynomials — only that they are independent. From then on you work with the{' '}
        <strong>coordinates</strong>, and coordinates are just columns of numbers.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — the lecture's four-x example, and its check                      */
/* ========================================================================== */

/** Slide 26: each row is one b, each column is one x. */
const FOUR_X = [
  [1, -4, 2, 17],
  [-2, -2, 3, -10],
  [1, 0, -1, 11],
  [-1, 4, -3, 1],
]
/** The relation the reduced form hands you: 7x₁ + 15x₂ + 18x₃ + x₄ = 0. */
const RELATION = [7, 15, 18, 1]

export function FourXLab() {
  const [psi, setPsi] = useState([0, 0, 0, 1])

  const A = toFr(FOUR_X)
  const { R, pivots } = rrefOf(A)
  const independent = pivots.length === 4

  // Apply the chosen combination to the b-coefficients and see what survives.
  const totals = FOUR_X.map((row) => row.reduce((acc, v, j) => acc + v * psi[j], 0))
  const allZero = totals.every((t) => t === 0)
  const anyPsi = psi.some((p) => p !== 0)
  const isRelation = psi.every((p, i) => p === RELATION[i])

  return (
    <LabBox>
      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[13px]/[1.9] text-zinc-800">
        x₁ = b₁ − 2b₂ + b₃ − b₄
        <br />x₂ = −4b₁ − 2b₂ + 4b₄
        <br />x₃ = 2b₁ + 3b₂ − b₃ − 3b₄
        <br />x₄ = 17b₁ − 10b₂ + 11b₃ + b₄
      </div>

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title="The coefficient columns" note="one column per x">
          <NumBox m={FOUR_X} readOnly width={50} />
        </Titled>
        <Titled title="Reduced row echelon form">
          <FrBox m={R} width={50} tone={TEAL} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'pivot columns', value: pivots.map((c) => c + 1).join(', ') },
              { label: 'rank', value: String(pivots.length) },
              { label: 'free columns', value: '4' },
              { label: 'verdict', value: independent ? 'independent' : 'dependent' },
            ]}
          />
        </div>
      </div>

      <Verdict ok={false}>
        Column 4 carries no pivot, and the reduced form says it equals −7 times column 1, −15 times column 2 and −18
        times column 3 added together. Rearranged, that is{' '}
        <strong className="font-mono">7x₁ + 15x₂ + 18x₃ + x₄ = 0</strong> — a combination reaching zero without every
        coefficient being zero. So <strong>x₁, x₂, x₃, x₄ are not linearly independent</strong>, which is slide
        29&rsquo;s conclusion.
      </Verdict>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Check it on the b&rsquo;s themselves
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {psi.map((p, i) => (
            <div key={i}>
              <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
                <span>ψ{i + 1}</span>
                <span className="text-zinc-500">{p}</span>
              </div>
              <RangeInput
                label={`the multiplier on x${i + 1}`}
                value={p}
                min={-20}
                max={20}
                step={1}
                onChange={(v) => setPsi(psi.map((x, j) => (j === i ? v : x)))}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 font-mono text-[13px]/[1.9] text-zinc-800">
          {psi[0]}x₁ + {psi[1]}x₂ + {psi[2]}x₃ + {psi[3]}x₄ ={' '}
          {totals
            .map((t, i) => `${t < 0 ? '− ' : i === 0 ? '' : '+ '}${Math.abs(t)}b${i + 1}`)
            .join(' ')
            .replace(/^\+ /, '')}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn primary onClick={() => setPsi([...RELATION])}>
            Load 7, 15, 18, 1
          </Btn>
          <Btn onClick={() => setPsi([0, 0, 0, 1])}>Clear</Btn>
        </div>

        <div className="mt-3">
          <Verdict ok={allZero && anyPsi}>
            {allZero && anyPsi ? (
              <>
                Every b-coefficient came out 0, so the combination really is the zero vector — and the multipliers were
                not all zero. {isRelation ? 'These are the numbers the reduced form predicted.' : ''} That is dependence
                demonstrated rather than asserted.
              </>
            ) : !anyPsi ? (
              <>All the multipliers are zero, which reaches 0 for any vectors at all and proves nothing. Try the button.</>
            ) : (
              <>Not zero yet — b₁ still has {totals[0]} of it. Press the button to load the combination the reduced form found.</>
            )}
          </Verdict>
        </div>
      </div>

      <LabNote>
        Notice what this check does <em>not</em> need: it never asks what b₁, b₂, b₃ and b₄ actually are. The
        coefficients cancel on their own, so the conclusion holds whatever those four independent vectors happen to be.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — more vectors than you started with                               */
/* ========================================================================== */

export function MoreThanKLab() {
  const [k, setK] = useState(3)
  const [m, setM] = useState(4)

  // A fixed, readable pattern rather than random numbers, so the read-out is
  // reproducible and the reader can check it by hand if they want.
  const base = [
    [1, -4, 2, 17, 3, 0],
    [-2, -2, 3, -10, 1, 5],
    [1, 0, -1, 11, -2, 2],
    [-1, 4, -3, 1, 4, -1],
    [3, 1, 0, 2, -1, 6],
    [0, 2, 5, -3, 2, 1],
  ]
  const g = base.slice(0, k).map((r) => r.slice(0, m))
  const { pivots } = rrefOf(toFr(g))
  const independent = pivots.length === m
  const forced = m > k

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-6">
        <div className="min-w-[210px]">
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>k — how many b&rsquo;s you have</span>
            <span className="text-zinc-500">{k}</span>
          </div>
          <RangeInput label="k, the number of b vectors" value={k} min={1} max={6} step={1} onChange={setK} />
        </div>
        <div className="min-w-[210px]">
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>m — how many x&rsquo;s you build</span>
            <span className="text-zinc-500">{m}</span>
          </div>
          <RangeInput label="m, the number of x vectors" value={m} min={1} max={6} step={1} onChange={setM} />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title={`The coefficient matrix — ${k} × ${m}`}>
          <NumBox m={g} readOnly width={46} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'rows (k)', value: String(k) },
              { label: 'columns (m)', value: String(m) },
              { label: 'pivots', value: String(pivots.length) },
              { label: 'verdict', value: independent ? 'independent' : 'dependent' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={forced} label={forced ? `m > k — dependence is forced` : 'm ≤ k — it depends on the numbers'} />
        <Chip on={pivots.length === Math.min(k, m)} label={`pivots ≤ min(k, m) = ${Math.min(k, m)}`} />
      </div>

      <Verdict ok={!forced}>
        {forced ? (
          <>
            There are only {k} rows, so there can be at most {k} pivots — and you have {m} columns. At least{' '}
            {m - k} column{m - k === 1 ? '' : 's'} must go without one, which hands you a non-trivial combination
            reaching zero. <strong>Dependence is guaranteed by the shape alone</strong>, before you look at a single
            number.
          </>
        ) : (
          <>
            With m ≤ k the shape does not decide anything. Here the answer happens to be{' '}
            {independent ? 'independent' : 'dependent'}, and you had to do the arithmetic to find out.
          </>
        )}
      </Verdict>

      <LabNote>
        This is slide 31&rsquo;s insight, and it is the most useful sentence in the lecture for an exam: you cannot
        have more independent vectors than the number of things you built them from. Seven vectors made out of four
        ingredients are always dependent.
      </LabNote>
      <LabNote>
        The same counting argument explains the rule from Lecture 0b — more vectors than components is always dependent
        — because ℝⁿ is built from n ingredients.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Parts 13–15 — generating set, basis, dimension                             */
/* ========================================================================== */

const BASIS_SETS = [
  {
    id: 'canon',
    label: 'The canonical basis of ℝ³',
    cols: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  {
    id: 'tri',
    label: 'Slide 36 — another basis',
    cols: [
      [1, 1, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
  },
  {
    id: 'odd',
    label: 'Slide 36 — a third basis',
    cols: [
      [0.5, 1.8, -2.2],
      [0.8, 0.3, -3.3],
      [0.4, 0.3, 1.5],
    ],
  },
  {
    id: 'toofew',
    label: 'Only two vectors',
    cols: [
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
  {
    id: 'dep',
    label: 'Three, but one repeats',
    cols: [
      [1, 1, 2],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
] as const
type BasisId = (typeof BASIS_SETS)[number]['id']

export function BasisLab() {
  const [pick, setPick] = useState<BasisId>('canon')
  const [g, setG] = useState<number[][]>(BASIS_SETS[0].cols as unknown as number[][])

  // A column of all zeros is how "only two vectors" is represented here.
  const live = g[0].map((_, j) => g.map((r) => r[j])).filter((col) => col.some((v) => v !== 0)).length
  const A = toFr(g)
  const { pivots } = rrefOf(A)
  const rank = pivots.length
  const generates = rank === nrows(A)
  const independent = rank === live
  const isBasis = generates && independent

  return (
    <LabBox>
      <Presets
        items={BASIS_SETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(BASIS_SETS.find((s) => s.id === id)!.cols as unknown as number[][])
        }}
      />

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title="The candidate set, as columns" note="a column of zeros means that vector is not there">
          <NumBox
            m={g}
            width={54}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setPick('' as BasisId)
            }}
          />
        </Titled>
        <Titled title="Reduced form">
          <FrBox m={rrefOf(A).R} width={54} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'vectors in the set', value: String(live) },
              { label: 'rank', value: String(rank) },
              { label: 'spans ℝ³?', value: generates ? 'yes' : 'no' },
              { label: 'independent?', value: independent ? 'yes' : 'no' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={generates} label="generating set" />
        <Chip on={independent} label="linearly independent" />
        <Chip on={isBasis} label="basis" />
      </div>

      <Verdict ok={isBasis}>
        {isBasis ? (
          <>
            Both conditions hold, so this is a <strong>basis of ℝ³</strong>. Every vector in ℝ³ is a combination of
            these three, and in exactly one way.
          </>
        ) : !generates && independent ? (
          <>
            Independent, but only {live} vector{live === 1 ? '' : 's'} — not enough to reach all of ℝ³. This is slide
            37&rsquo;s point: an independent set can still be too small to be a basis. It <em>is</em> a basis of the{' '}
            {rank}-dimensional subspace it spans.
          </>
        ) : generates && !independent ? (
          <>
            It reaches everything, so it is a generating set — but it is not minimal. One vector repeats what the
            others already say, and you could throw it away without losing anything.
          </>
        ) : (
          <>Neither independent nor big enough to span ℝ³.</>
        )}
      </Verdict>

      <LabNote>
        A <strong>basis</strong> has to do two jobs at once. It must be big enough to <em>reach</em> everything — a
        generating set — and small enough that nothing in it is redundant — linearly independent. Slide 34 puts it
        another way: a basis is a <strong>minimal</strong> generating set.
      </LabNote>
      <LabNote>
        Press through the three bases of ℝ³ on slide 36. They look nothing alike, and every one of them is a perfectly
        good basis. A basis is <strong>not unique</strong> — but its <em>size</em> always is, and that size is what
        gets called the dimension.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15 — dimension is not the number of components                        */
/* ========================================================================== */

const DIM_SETS = [
  { id: 'line', label: 'span of (0, 1)', cols: [[0], [1]], space: 'ℝ²' },
  { id: 'plane', label: 'span of (1, 0) and (0, 1)', cols: [[1, 0], [0, 1]], space: 'ℝ²' },
  { id: 'dep', label: 'span of (1, 2) and (2, 4)', cols: [[1, 2], [2, 4]], space: 'ℝ²' },
  {
    id: 'r3line',
    label: 'span of (1, 1, 1) in ℝ³',
    cols: [[1], [1], [1]],
    space: 'ℝ³',
  },
  {
    id: 'r3plane',
    label: 'span of two vectors in ℝ³',
    cols: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    space: 'ℝ³',
  },
] as const
type DimId = (typeof DIM_SETS)[number]['id']

export function DimensionLab() {
  const [pick, setPick] = useState<DimId>('line')
  const s = DIM_SETS.find((x) => x.id === pick)!
  const g = s.cols as unknown as number[][]
  const A = toFr(g)
  const dim = rrefOf(A).pivots.length
  const components = nrows(A)
  const vectors = ncols(A)
  const isWhole = dim === components

  return (
    <LabBox>
      <Presets items={DIM_SETS.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={setPick} />

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The spanning vectors">
          <NumBox m={g} readOnly width={54} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'components each', value: String(components) },
              { label: 'vectors given', value: String(vectors) },
              { label: 'dimension', value: String(dim) },
              { label: 'sits inside', value: s.space },
            ]}
          />
        </div>
      </div>

      <Verdict ok={isWhole}>
        {isWhole ? (
          <>
            The dimension is {dim} and the surrounding space is {s.space}, also {components}-dimensional. By slide 38
            that means this subspace <strong>is</strong> the whole of {s.space} — dim(U) = dim(V) happens only when U =
            V.
          </>
        ) : (
          <>
            Each vector has {components} components, but the space they span has dimension <strong>{dim}</strong>.
            Those are different questions. It is a {dim === 1 ? 'line' : 'plane'} sitting inside {s.space}, and every
            vector in it still gets written with {components} numbers.
          </>
        )}
      </Verdict>

      <LabNote>
        Slide 39 is the one to hold on to. The <strong>dimension</strong> of a space is how many vectors are in a basis
        for it — not how many numbers it takes to write one of its vectors down. span((0, 1)) is a line, so its
        dimension is 1, even though every vector in it is a pair.
      </LabNote>
      <LabNote>
        Notice the third preset. Two vectors were given, but one is twice the other, so the dimension is 1 rather than
        2. Counting the vectors you were handed is not the same as counting the dimension — you have to reduce first.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — the recipe, on slide 41's own example                            */
/* ========================================================================== */

/** Slide 41: x₁ … x₄ in ℝ⁵, as the columns of a 5 × 4 matrix. */
const SLIDE41 = [
  [1, 2, 3, -1],
  [2, -1, -4, 8],
  [-1, 1, 3, -5],
  [-1, 2, 5, -6],
  [-1, -2, -3, 1],
]

export function FindBasisLab() {
  const [step, setStep] = useState(0)
  const [g, setG] = useState<number[][]>(SLIDE41)

  const A = toFr(g)
  const ref = refOnly(A)
  const { R, pivots } = rrefOf(A)
  const rank = pivots.length
  const free: number[] = []
  for (let c = 0; c < ncols(A); c++) if (!pivots.includes(c)) free.push(c)
  const isBasis = rank === ncols(A)

  // Each non-pivot column written out of the pivot ones, straight from the RREF.
  const recipes = free.map((c) => ({
    col: c,
    parts: pivots.map((pc, i) => ({ pc, amount: R[i][c] })).filter((t) => t.amount.n !== 0),
  }))

  const steps = [
    { title: 'Step 1 — the spanning vectors as columns of a matrix', show: g },
    { title: 'Step 2 — row echelon form', show: null },
    { title: 'Step 3 — the pivot columns name the basis', show: null },
  ]

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          ← Back
        </Btn>
        <Btn primary onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2}>
          Next step →
        </Btn>
        <span className="text-[12.5px] text-zinc-500">step {step + 1} of 3</span>
        <Btn onClick={() => setG(SLIDE41)}>Reset to slide 41</Btn>
      </div>

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto">
        <Titled title={steps[0].title} note="type over anything">
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
                      const n = raw === '' || raw === '-' ? 0 : Number(raw)
                      if (Number.isFinite(n)) setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? n : x))))
                    }}
                    className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none"
                    style={
                      step === 2
                        ? pivots.includes(j)
                          ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                          : { background: 'rgba(220,38,38,0.07)', color: '#991b1b' }
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </Titled>

        {step >= 1 && (
          <Titled title="Row echelon form">
            <FrBox m={ref} width={52} />
          </Titled>
        )}
        {step >= 2 && (
          <div className="pt-6">
            <ReadOutGrid
              items={[
                { label: 'pivot columns', value: pivots.map((c) => c + 1).join(', ') },
                { label: 'rank', value: String(rank) },
                { label: 'a basis has', value: `${rank} vector${rank === 1 ? '' : 's'}` },
                { label: 'dim U', value: String(rank) },
              ]}
            />
          </div>
        )}
      </div>

      {step >= 2 && (
        <>
          <Verdict ok={isBasis}>
            {isBasis ? (
              <>
                Every column carries a pivot, so all {ncols(A)} vectors are independent and they <strong>do</strong>{' '}
                form a basis of U.
              </>
            ) : (
              <>
                Column{free.length === 1 ? '' : 's'} {free.map((c) => c + 1).join(' and ')} carr
                {free.length === 1 ? 'ies' : 'y'} no pivot, so the four vectors are <strong>not</strong> independent
                and do <strong>not</strong> form a basis. A basis of U is {'{'}
                {pivots.map((c) => `x${c + 1}`).join(', ')}
                {'}'}, and dim U = {rank}.
              </>
            )}
          </Verdict>

          {recipes.length > 0 && (
            <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                And the redundant one, written out
              </div>
              <div className="font-mono text-[13px]/[1.9] text-zinc-800">
                {recipes.map((r) => (
                  <div key={r.col}>
                    x{r.col + 1} ={' '}
                    {r.parts.length === 0
                      ? '0'
                      : r.parts
                          .map((t, i) => `${i > 0 ? ' + ' : ''}${frStr(t.amount)} × x${t.pc + 1}`)
                          .join('')
                          .replace(/\+ -/g, '− ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <LabNote>
        Slide 40&rsquo;s recipe in three lines: <strong>write the spanning vectors as columns</strong>, get the{' '}
        <strong>row echelon form</strong>, and the vectors sitting at <strong>pivot columns</strong> are your basis.
        The ones at non-pivot columns are combinations of those, so they add nothing.
      </LabNote>
      <LabNote>
        The deck poses this example on its last slide and then stops, so there is no printed answer to compare against.
        The working above is done live by the same code that runs everywhere else on the site, and the relation it
        prints can be checked by hand in one line.
      </LabNote>
    </LabBox>
  )
}
