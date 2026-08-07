'use client'

import { RangeInput } from '@/components/sessions/session-parts'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Sign, Titled, Verdict, type Cell } from '@/components/charts/matrix-ui'
import { frStr } from '@/lib/model/fraction'
import {
  addM,
  cloneM,
  detM,
  eqM,
  mulM,
  ncols,
  nrows,
  productCell,
  scaleM,
  sub,
  toFr,
  transposeM,
  type FMat,
} from '@/lib/model/matrix'
import { fr, type Fr } from '@/lib/model/fraction'
import { useState } from 'react'

type Grid = number[][]

const edit = (g: Grid, i: number, j: number, v: number) => g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x)))

/** A proper minus sign, so a working-out line does not read "+ -1". */
const neat = (v: Fr) => frStr(v).replace('-', '−')
/** Negative numbers get brackets inside a product, the way you would write it by hand. */
const bracket = (v: Fr) => (v.n < 0 ? `(${neat(v)})` : neat(v))
const resize = (g: Grid, m: number, n: number): Grid =>
  Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => g[i]?.[j] ?? 0))

/* ========================================================================== */
/* Part 2 — what a matrix is: shape, names, and when two are equal            */
/* ========================================================================== */

export function MatrixAnatomyLab() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(3)
  const [at, setAt] = useState<Cell>({ i: 0, j: 1 })
  const [a, setA] = useState<Grid>([
    [1, 2, 3],
    [4, 5, 6],
  ])
  const [b, setB] = useState<Grid>([
    [1, 2, 3],
    [4, 5, 6],
  ])

  const shapeWord =
    rows === 1 && cols === 1
      ? 'just a single number wearing a matrix costume'
      : rows === 1
        ? 'a row vector — one row, lying flat'
        : cols === 1
          ? 'a column vector — one column, standing up'
          : rows === cols
            ? 'a square matrix'
            : 'a rectangular matrix'

  const same = a.length === b.length && a[0].length === b[0].length
  const equal = same && a.every((r, i) => r.every((v, j) => v === b[i][j]))
  const firstDiff = same ? a.flatMap((r, i) => r.map((v, j) => (v !== b[i][j] ? { i, j } : null))).find(Boolean) : null

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-4">
        <Stepper label="Rows (m)" value={rows} onChange={setRows} />
        <Stepper label="Columns (n)" value={cols} onChange={setCols} />
        <div className="text-[13px]">
          <span className="text-zinc-600">That is </span>
          <span className="font-mono font-semibold text-zinc-950">
            {rows} × {cols}
          </span>
          <span className="text-zinc-600"> — {shapeWord}.</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-1">
              {Array.from({ length: cols }, (_, j) => {
                const on = at.i === i && at.j === j
                const near = at.i === i || at.j === j
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setAt({ i, j })}
                    className="w-[56px] cursor-pointer rounded px-2 py-2 text-center font-mono text-[13px] hover:bg-zinc-950/[0.05]"
                    style={
                      on
                        ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 }
                        : near
                          ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                          : undefined
                    }
                  >
                    a{sub(i + 1)}
                    {sub(j + 1)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <LabNote>
        You pressed{' '}
        <span className="font-mono font-semibold text-zinc-950">
          a{sub(at.i + 1)}
          {sub(at.j + 1)}
        </span>
        . The first small number is the <strong>row</strong>, the second is the <strong>column</strong>. So it sits in
        row {at.i + 1}, column {at.j + 1}. Rows are always said first — in the name of a slot, and in the shape{' '}
        <span className="font-mono">m × n</span>. Nearly everyone gets that the wrong way round once.
      </LabNote>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          When are two matrices the same?
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="A">
            <NumBox m={a} name="A" onEdit={(i, j, v) => setA(edit(a, i, j, v))} mark={firstDiff ?? null} />
          </Titled>
          <Sign>=?</Sign>
          <Titled title="B">
            <NumBox m={b} name="B" onEdit={(i, j, v) => setB(edit(b, i, j, v))} mark={firstDiff ?? null} />
          </Titled>
          <div className="flex flex-col gap-2 pt-5">
            <Btn onClick={() => setB(a.map((r) => [...r]))}>Make them match</Btn>
            <Btn onClick={() => setB(resize(b, 3, 2))}>Change B&rsquo;s shape</Btn>
            <Btn
              onClick={() =>
                setB(
                  a.map((r) => [...r]).map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 1 : v)))
                )
              }
            >
              Change one number
            </Btn>
          </div>
        </div>
        <div className="mt-3">
          <Verdict ok={equal}>
            {equal
              ? 'Same shape, and every number in the same slot agrees. So A = B.'
              : !same
                ? `Not equal. A is ${a.length} × ${a[0].length} and B is ${b.length} × ${b[0].length}. Different shapes can never be equal, whatever the numbers say.`
                : `Not equal. Same shape, but the highlighted slot holds ${a[firstDiff!.i][firstDiff!.j]} in A and ${b[firstDiff!.i][firstDiff!.j]} in B. One number out of step is enough.`}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — adding, scaling, and the laws that come free                      */
/* ========================================================================== */

const LAWS = [
  { id: 'comm', label: 'A + B = B + A', name: 'You can swap the order when adding' },
  { id: 'assoc', label: '(A + B) + C = A + (B + C)', name: 'Brackets do not matter when adding' },
  { id: 'dist1', label: 'c(A + B) = cA + cB', name: 'A number spreads over a sum' },
  { id: 'dist2', label: '(c + k)A = cA + kA', name: 'A sum of numbers spreads over a matrix' },
] as const
type LawId = (typeof LAWS)[number]['id']

export function MatrixLawsLab() {
  const [a, setA] = useState<Grid>([
    [-4, 6, 3],
    [5, 0, 2],
  ])
  const [b, setB] = useState<Grid>([
    [1, 0, 5],
    [-2, 3, 4],
  ])
  const [c, setC] = useState<Grid>([
    [2, 2, 0],
    [1, -1, 3],
  ])
  const [k1, setK1] = useState(3)
  const [k2, setK2] = useState(-2)
  const [law, setLaw] = useState<LawId>('comm')
  const [wrong, setWrong] = useState(false)

  const A = toFr(a)
  const B = toFr(b)
  const C = toFr(c)
  const shown = wrong ? resize(b, 3, 2) : b
  const fits = !wrong

  const sum = fits ? addM(A, B) : null
  const scaled = scaleM(fr(k1), A)

  let left: FMat | null = null
  let right: FMat | null = null
  if (law === 'comm') {
    left = addM(A, B)
    right = addM(B, A)
  } else if (law === 'assoc') {
    const ab = addM(A, B)
    const bc = addM(B, C)
    left = ab && addM(ab, C)
    right = bc && addM(A, bc)
  } else if (law === 'dist1') {
    const ab = addM(A, B)
    left = ab && scaleM(fr(k1), ab)
    right = addM(scaleM(fr(k1), A), scaleM(fr(k1), B))
  } else {
    left = scaleM(fr(k1 + k2), A)
    right = addM(scaleM(fr(k1), A), scaleM(fr(k2), A))
  }
  const holds = !!left && !!right && eqM(left, right)
  const lawMeta = LAWS.find((l) => l.id === law)!

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-4">
        <Titled title={`A — 2 × 3`}>
          <NumBox m={a} name="A" onEdit={(i, j, v) => setA(edit(a, i, j, v))} />
        </Titled>
        <Sign>+</Sign>
        <Titled title={`B — ${shown.length} × ${shown[0].length}`}>
          <NumBox m={shown} name="B" readOnly={wrong} onEdit={(i, j, v) => setB(edit(b, i, j, v))} />
        </Titled>
        <Sign>=</Sign>
        <Titled title={fits ? 'A + B' : 'cannot be done'}>
          {fits && sum ? (
            <FrBox m={sum} tone="#0d9488" />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-4 text-[12.5px] text-red-600">
              The shapes differ.
              <br />
              Some numbers have no partner.
            </div>
          )}
        </Titled>
      </div>

      <LabNote>
        {fits
          ? 'Adding is exactly what it looks like. Line the two boxes up and add each pair of numbers sitting on top of each other. Change any number and one number in the answer moves with it.'
          : 'To add, the two boxes must be the same shape, because every number needs a partner in the same slot. Here one is 2 × 3 and the other is 3 × 2, so there is nothing to pair up.'}
      </LabNote>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-[12.5px] text-zinc-700">
        <input type="checkbox" checked={wrong} onChange={(e) => setWrong(e.target.checked)} className="cursor-pointer" />
        Give B the wrong shape and see what breaks
      </label>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Multiplying by a plain number
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-zinc-600">c =</span>
            <RangeInput
              label="the number c"
              min={-3}
              max={5}
              step={1}
              value={k1}
              onChange={setK1}
              className="w-[150px]"
            />
            <span className="w-6 font-mono font-semibold">{k1}</span>
          </div>
          <Sign>cA =</Sign>
          <FrBox m={scaled} tone="#0d9488" />
        </div>
        <LabNote>
          Every single number gets multiplied. Nothing clever happens. Set c to 0 and the whole box goes to zero.
        </LabNote>
      </div>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Check a law for yourself
        </div>
        <Presets items={LAWS.map((l) => ({ id: l.id, label: l.label }))} at={law} onPick={setLaw} />

        {law === 'dist2' && (
          <div className="mt-3 flex items-center gap-2 text-[13px]">
            <span className="text-zinc-600">k =</span>
            <RangeInput
              label="the number k"
              min={-4}
              max={4}
              step={1}
              value={k2}
              onChange={setK2}
              className="w-[150px]"
            />
            <span className="w-6 font-mono font-semibold">{k2}</span>
          </div>
        )}
        {law === 'assoc' && (
          <div className="mt-3">
            <Titled title="C — 2 × 3">
              <NumBox m={c} name="C" onEdit={(i, j, v) => setC(edit(c, i, j, v))} />
            </Titled>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-start gap-4">
          <Titled title="Left-hand side">{left ? <FrBox m={left} /> : <span className="text-[13px] text-red-600">not defined</span>}</Titled>
          <Sign>vs</Sign>
          <Titled title="Right-hand side">{right ? <FrBox m={right} /> : <span className="text-[13px] text-red-600">not defined</span>}</Titled>
        </div>
        <div className="mt-3">
          <Verdict ok={holds}>
            {holds
              ? `${lawMeta.name}. Both sides came out the same, and they will for any numbers you type — because adding matrices is just adding ordinary numbers, one slot at a time.`
              : 'The two sides differ. Check the shapes.'}
          </Verdict>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — multiplication: the shape rule and the row-meets-column sum       */
/* ========================================================================== */

const EX1_A: Grid = [
  [3, 5, -1],
  [4, 0, 2],
]
const EX1_B: Grid = [
  [2, -2, 3, 1],
  [5, 0, 7, 8],
  [9, -4, 1, 1],
]

const SURPRISES = [
  {
    id: 'lecture',
    label: 'The lecture’s Example 1',
    a: EX1_A,
    b: EX1_B,
    note: 'The deck works out two of these by hand: c₁₁ = 22 and c₂₃ = 14. Press those slots and check.',
  },
  {
    id: 'order',
    label: 'AB is not BA',
    a: [
      [1, 2],
      [3, 4],
    ],
    b: [
      [0, 1],
      [0, 0],
    ],
    note: 'Both products exist here, and they are different. With ordinary numbers 3 × 5 and 5 × 3 agree. With matrices, order is part of the meaning.',
  },
  {
    id: 'zero',
    label: 'AB = 0 with neither one zero',
    a: [
      [1, 1],
      [2, 2],
    ],
    b: [
      [-1, 1],
      [1, -1],
    ],
    note: 'Every entry of AB is zero, yet neither A nor B is. So you cannot cancel matrices the way you cancel numbers — AB = AC does not give B = C.',
  },
] as const
type SurpriseId = (typeof SURPRISES)[number]['id']

export function MultiplyLab() {
  const [pick, setPick] = useState<SurpriseId>('lecture')
  const [swapped, setSwapped] = useState(false)
  const [at, setAt] = useState<Cell>({ i: 0, j: 0 })

  const s = SURPRISES.find((x) => x.id === pick)!
  const leftG: Grid = swapped ? (s.b as unknown as Grid) : (s.a as unknown as Grid)
  const rightG: Grid = swapped ? (s.a as unknown as Grid) : (s.b as unknown as Grid)
  const L = toFr(leftG)
  const R = toFr(rightG)

  const defined = ncols(L) === nrows(R)
  const P = defined ? mulM(L, R) : null
  const spot: Cell = P && at.i < nrows(P) && at.j < ncols(P) ? at : { i: 0, j: 0 }
  const detail = P ? productCell(L, R, spot.i, spot.j) : null

  return (
    <LabBox>
      <Presets items={SURPRISES.map((x) => ({ id: x.id, label: x.label }))} at={pick} onPick={(id) => { setPick(id); setSwapped(false); setAt({ i: 0, j: 0 }) }} />

      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono">
          {nrows(L)} × <strong style={{ color: defined ? '#0d9488' : '#dc2626' }}>{ncols(L)}</strong>
        </span>
        <span className="text-zinc-400">·</span>
        <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono">
          <strong style={{ color: defined ? '#0d9488' : '#dc2626' }}>{nrows(R)}</strong> × {ncols(R)}
        </span>
        <span className="text-zinc-400">→</span>
        <span className="font-mono font-semibold">
          {defined ? `${nrows(L)} × ${ncols(R)}` : 'not defined'}
        </span>
        <span className="text-zinc-600">
          {defined
            ? '— the two middle numbers match, so it works. The outer two give the answer’s shape.'
            : '— the two middle numbers differ, so there is nothing to pair up.'}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-4 overflow-x-auto">
        <Titled title={swapped ? 'B' : 'A'}>
          <NumBox m={leftG} readOnly markRow={defined ? spot.i : null} width={48} />
        </Titled>
        <Sign>×</Sign>
        <Titled title={swapped ? 'A' : 'B'}>
          <NumBox m={rightG} readOnly markCol={defined ? spot.j : null} width={48} />
        </Titled>
        <Sign>=</Sign>
        <Titled title={defined ? (swapped ? 'BA' : 'AB') : 'cannot be done'}>
          {P ? (
            <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
              {P.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((v, j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setAt({ i, j })}
                      className="w-[48px] cursor-pointer rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums hover:bg-zinc-950/[0.05]"
                      style={spot.i === i && spot.j === j ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 } : undefined}
                    >
                      {frStr(v)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-4 text-[12.5px] text-red-600">
              {ncols(L)} columns on the left,
              <br />
              {nrows(R)} rows on the right.
            </div>
          )}
        </Titled>
      </div>

      {detail && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Where the number in row {spot.i + 1}, column {spot.j + 1} came from
          </div>
          <div className="overflow-x-auto font-mono text-[13px]/[1.9] text-zinc-800">
            c{sub(spot.i + 1)}
            {sub(spot.j + 1)} ={' '}
            {detail.pairs.map((p, i) => (
              <span key={i}>
                {i > 0 && ' + '}
                {bracket(p.left)}×{bracket(p.right)}
              </span>
            ))}{' '}
            = {detail.pairs.map((p) => neat(p.prod)).join(' + ').replace(/\+ −/g, '−')} ={' '}
            <strong>{frStr(detail.total)}</strong>
          </div>
          <p className="mt-2 text-[13px]/[1.6] text-zinc-600">
            Walk along row {spot.i + 1} of the left box and down column {spot.j + 1} of the right one, multiplying each
            pair as you go, then add. That is the whole rule. Both are lit up above.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => { setSwapped(!swapped); setAt({ i: 0, j: 0 }) }}>
          {swapped ? 'Put them back' : 'Swap the order'}
        </Btn>
      </div>

      <LabNote>{s.note}</LabNote>
      {swapped && pick === 'lecture' && (
        <Verdict ok={false}>
          With the lecture&rsquo;s matrices, BA does not even exist. B has 4 columns and A has 2 rows. So &ldquo;is AB
          the same as BA?&rdquo; sometimes does not even get as far as being a question.
        </Verdict>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — transpose, and the rule that catches people out                   */
/* ========================================================================== */

export function TransposeRulesLab() {
  const [a, setA] = useState<Grid>([
    [1, 4, 2],
    [0, 3, 5],
  ])
  const [b, setB] = useState<Grid>([
    [2, 1],
    [0, 3],
    [4, 1],
  ])
  const [at, setAt] = useState<Cell | null>({ i: 0, j: 2 })

  const A = toFr(a)
  const B = toFr(b)
  const At = transposeM(A)
  const AB = mulM(A, B)
  const ABt = AB && transposeM(AB)
  const BtAt = mulM(transposeM(B), transposeM(A))
  const AtBt = mulM(transposeM(A), transposeM(B))

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title={`A — ${a.length} × ${a[0].length}`}>
          <NumBox m={a} name="A" onEdit={(i, j, v) => setA(edit(a, i, j, v))} onHover={setAt} mark={at} />
        </Titled>
        <Sign>→</Sign>
        <Titled title={`Aᵀ — ${ncols(A)} × ${nrows(A)}`}>
          <FrBox m={At} mark={at ? { i: at.j, j: at.i } : null} />
        </Titled>
      </div>

      <LabNote>
        The transpose tips the box over. Row 1 becomes column 1, row 2 becomes column 2. Hover a number and its partner
        lights up on the other side.
        {at && (
          <>
            {' '}
            The one in row {at.i + 1}, column {at.j + 1} of A sits in row {at.j + 1}, column {at.i + 1} of Aᵀ.
          </>
        )}{' '}
        Tip it over twice and you are back where you started, which is the rule (Aᵀ)ᵀ = A.
      </LabNote>

      <div className="border-t border-zinc-950/[0.08] pt-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The one that catches people out
        </div>
        <div className="mb-3">
          <Titled title={`B — ${b.length} × ${b[0].length}`}>
            <NumBox m={b} name="B" onEdit={(i, j, v) => setB(edit(b, i, j, v))} />
          </Titled>
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="(AB)ᵀ">{ABt ? <FrBox m={ABt} /> : <span className="text-[13px] text-red-600">not defined</span>}</Titled>
          <Sign>vs</Sign>
          <Titled title="BᵀAᵀ" note="reversed">
            {BtAt ? <FrBox m={BtAt} tone="#0d9488" /> : <span className="text-[13px] text-red-600">not defined</span>}
          </Titled>
          <Sign>vs</Sign>
          <Titled title="AᵀBᵀ" note="same order">
            {AtBt ? <FrBox m={AtBt} /> : <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-4 text-[12.5px] text-red-600">not defined</div>}
          </Titled>
        </div>
        <div className="mt-3">
          <Verdict ok={!!ABt && !!BtAt && eqM(ABt, BtAt)}>
            (AB)ᵀ = BᵀAᵀ. You transpose <strong>and reverse the order</strong>. Keeping the order gives AᵀBᵀ, which
            usually does not even have the right shape to exist — as it does not here.
          </Verdict>
        </div>
        <LabNote>
          The picture to hold on to: putting on socks then shoes is undone by taking off shoes then socks. Reversing
          comes with the territory.
        </LabNote>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 6 — the special shapes                                                */
/* ========================================================================== */

const SPECIALS: Array<{ id: string; label: string; m: Grid }> = [
  { id: 'sym', label: 'Symmetric', m: [[20, 120, 200], [120, 10, 150], [200, 150, 30]] },
  { id: 'skew', label: 'Skew-symmetric', m: [[0, 1, -3], [-1, 0, -2], [3, 2, 0]] },
  { id: 'upper', label: 'Upper triangular', m: [[1, 4, 2], [0, 3, 5], [0, 0, 6]] },
  { id: 'lower', label: 'Lower triangular', m: [[1, 0, 0], [9, 3, 0], [2, 5, 6]] },
  { id: 'diag', label: 'Diagonal', m: [[2, 0, 0], [0, -5, 0], [0, 0, 3]] },
  { id: 'ident', label: 'Identity', m: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { id: 'sparse', label: 'Sparse', m: [[0, 0, 7], [0, 0, 0], [0, 4, 0]] },
]

export function SpecialMatrixLab() {
  const [g, setG] = useState<Grid>(SPECIALS[0].m)
  const [pick, setPick] = useState('sym')

  const n = g.length
  const M = toFr(g)
  const T = transposeM(M)
  const symmetric = eqM(M, T)
  const skew = eqM(M, scaleM(fr(-1), T))
  const upper = g.every((r, i) => r.every((v, j) => j >= i || v === 0))
  const lower = g.every((r, i) => r.every((v, j) => j <= i || v === 0))
  const diagonal = upper && lower
  const identity = diagonal && g.every((r, i) => r[i] === 1)
  const zeros = g.flat().filter((v) => v === 0).length
  const sparse = zeros / (n * n) > 0.5
  const trace = g.reduce((acc, r, i) => acc + r[i], 0)

  const badges: Array<{ label: string; on: boolean; why: string }> = [
    { label: 'Symmetric', on: symmetric, why: 'A = Aᵀ — the numbers are mirrored across the diagonal.' },
    { label: 'Skew-symmetric', on: skew, why: 'A = −Aᵀ — mirrored but with the sign flipped, so the diagonal must be all zeros.' },
    { label: 'Upper triangular', on: upper, why: 'Everything below the diagonal is zero.' },
    { label: 'Lower triangular', on: lower, why: 'Everything above the diagonal is zero.' },
    { label: 'Diagonal', on: diagonal, why: 'Only the diagonal is allowed to be non-zero. Both triangular at once.' },
    { label: 'Identity', on: identity, why: 'Diagonal, and every diagonal entry is 1. Multiplying by it changes nothing.' },
    { label: 'Sparse', on: sparse, why: `More than half the entries are zero — ${zeros} out of ${n * n} here.` },
  ]

  return (
    <LabBox>
      <Presets
        items={SPECIALS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(SPECIALS.find((s) => s.id === id)!.m)
        }}
      />

      <div className="flex flex-wrap items-start gap-6">
        <Titled title={`A — ${n} × ${n}`} note="type over any number">
          <NumBox
            m={g}
            name="A"
            onEdit={(i, j, v) => {
              setG(edit(g, i, j, v))
              setPick('')
            }}
          />
        </Titled>
        <Titled title="Aᵀ">
          <FrBox m={T} />
        </Titled>
        <div className="flex flex-col gap-2 pt-5 text-[12.5px] text-zinc-600">
          <span>
            Trace (diagonal added up): <strong className="font-mono text-zinc-950">{trace}</strong>
          </span>
          <span>
            Zeros: <strong className="font-mono text-zinc-950">{zeros}</strong> of {n * n}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <Chip key={b.label} on={b.on} label={b.label} />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {badges
          .filter((b) => b.on)
          .map((b) => (
            <div key={b.label} className="text-[13px]/[1.6] text-zinc-700">
              <strong className="text-zinc-950">{b.label}:</strong> {b.why}
            </div>
          ))}
        {badges.every((b) => !b.on) && (
          <div className="text-[13px]/[1.6] text-zinc-600">
            Nothing special about this one. That is the normal case — the named shapes are the exceptions worth
            spotting, because each one makes some later calculation cheap.
          </div>
        )}
      </div>

      <LabNote>
        Try this: press <strong>Skew-symmetric</strong>{' '}and then change a number on the diagonal to anything other than
        0. The badge goes out. A skew-symmetric matrix has to satisfy a<sub>ii</sub> = −a<sub>ii</sub>, and zero is the
        only number that can do that.
      </LabNote>
    </LabBox>
  )
}

/* ------------------------------------------------------------------ bits */

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px]">
      <span className="text-zinc-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
        aria-label={`fewer ${label}`}
      >
        −
      </button>
      <span className="w-4 text-center font-mono font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(5, value + 1))}
        className="size-6 cursor-pointer rounded-md border border-zinc-950/15 bg-white font-semibold hover:bg-zinc-950/[0.04]"
        aria-label={`more ${label}`}
      >
        +
      </button>
    </div>
  )
}

/** Kept for the parts that only need a determinant read-out beside a box. */
export function detLabel(m: FMat) {
  const d = detM(cloneM(m))
  return d ? frStr(d) : '—'
}
