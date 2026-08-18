'use client'

/**
 * Lecture 4, parts 1 to 5: the two summaries of a matrix.
 *
 * The deck opens on the determinant and the trace, not on eigenvalues, because
 * both turn up inside the characteristic polynomial three slides later. These
 * labs are therefore about the *arguments* — the cofactor recursion, the
 * induction on row swaps, the count of interchanges hiding in det(A) =
 * (−1)ˢ det(U) — rather than about grinding out one more determinant, which
 * Lecture 0a already has a lab for.
 */
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { gaussUpper, leadingMinors, symmetric, traceOf } from '@/lib/model/eigen'
import { fr, frStr, type Fr } from '@/lib/model/fraction'
import { cofactorOf, detM, minorOf, mulM, rankOf, toFr, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

const edit = (m: number[][], i: number, j: number, v: number) =>
  m.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x)))

/** One claim of a multi-claim lab, with its own heading. Hoisted: see the rule in CLAUDE.md. */
function Claim({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/[0.08] bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

/** A yes/no line with a tick or a cross, for the lists of conditions. */
function Flag({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[13px]/[1.6]">
      <span className="font-semibold" style={{ color: on ? '#0d9488' : '#a1a1aa' }}>
        {on ? '✓' : '✗'}
      </span>
      <span style={{ color: on ? '#18181b' : '#71717a' }}>{children}</span>
    </div>
  )
}

/* ========================================================================== */
/* Part 1 — what this lecture will do to a matrix                             */
/* ========================================================================== */

const MAP_PRESETS: Array<{ id: string; label: string; m: number[][] }> = [
  {
    id: 'spd',
    label: 'symmetric, positive definite',
    m: [
      [4, 2, -2],
      [2, 10, 2],
      [-2, 2, 5],
    ],
  },
  {
    id: 'symnot',
    label: 'symmetric, not positive definite',
    m: [
      [1, 3, 0],
      [3, 1, 0],
      [0, 0, 2],
    ],
  },
  {
    id: 'plain',
    label: 'not symmetric',
    m: [
      [2, 3, 4],
      [0, 5, 6],
      [0, 0, 7],
    ],
  },
  {
    id: 'singular',
    label: 'singular',
    m: [
      [1, 2, 3],
      [2, 4, 6],
      [1, 0, 1],
    ],
  },
]

export function DecompositionMapLab() {
  const [g, setG] = useState<number[][]>(MAP_PRESETS[0].m)

  const A = toFr(g)
  const det = detM(A) ?? fr(0)
  const tr = traceOf(A)
  const rank = rankOf(A)
  const sym = symmetric(A)
  const minors = leadingMinors(A)
  const pd = sym && minors.every((v) => v.n > 0)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {MAP_PRESETS.map((p) => (
          <Chip key={p.id} on={JSON.stringify(p.m) === JSON.stringify(g)} label={p.label} onClick={() => setG(p.m)} />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox m={g} width={46} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
        </Titled>

        <div className="min-w-[240px] flex-1">
          <ReadOutGrid
            items={[
              { label: 'det A', value: frStr(det) },
              { label: 'tr A', value: frStr(tr) },
              { label: 'rank A', value: String(rank) },
              { label: 'size', value: `${g.length} × ${g.length}` },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Claim title="Summarise — parts 2 to 5">
          <PanelNote>
            Two numbers stand for the whole matrix. The determinant says whether it can be undone; the trace adds the
            diagonal and turns out to be the sum of the eigenvalues.
          </PanelNote>
          <div className="mt-2 flex flex-col gap-1">
            <Flag on={det.n !== 0}>
              det A = {frStr(det)}, so A {det.n !== 0 ? 'is' : 'is not'} invertible
            </Flag>
            <Flag on={rank === g.length}>
              rank A = {rank} of {g.length}
            </Flag>
          </div>
        </Claim>

        <Claim title="Decompose — parts 17 and 19">
          <PanelNote>
            Both decompositions in this lecture ask something of A first. Neither is available to every matrix, which is
            why the conditions are worth checking before you start.
          </PanelNote>
          <div className="mt-2 flex flex-col gap-1">
            <Flag on={sym}>A = QΛQᵀ needs A symmetric — {sym ? 'it is' : 'it is not'}</Flag>
            <Flag on={pd}>
              A = LLᵀ needs symmetric and positive definite — leading minors are {minors.map(frStr).join(', ')}
            </Flag>
          </div>
        </Claim>
      </div>

      <Verdict ok={pd}>
        {pd
          ? 'This matrix qualifies for everything in the lecture: a determinant, a trace, real eigenvalues, an orthonormal set of eigenvectors, and a Cholesky factor.'
          : sym
            ? 'Symmetric, so the spectral theorem applies and the eigenvalues are real — but a leading minor is not positive, so it is not positive definite and Cholesky will fail on it.'
            : 'Not symmetric. It still has a determinant, a trace and a characteristic polynomial, but nothing in the second half of the lecture is promised for it.'}
      </Verdict>

      <LabNote>
        Slide 1 names three things to do with a matrix: summarise it, decompose it, and use the decompositions for
        approximation. This lecture delivers the first two. Approximation is named once more on slide 28, where AᵀA and
        AAᵀ are handed on to singular-value decomposition and PCA, and is not worked through here.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 2 — the cofactor formula, in the deck's own symbols                    */
/* ========================================================================== */

const SYM = ['a₁₁', 'a₁₂', 'a₁₃', 'a₂₁', 'a₂₂', 'a₂₃', 'a₃₁', 'a₃₂', 'a₃₃']
const symAt = (i: number, j: number) => SYM[i * 3 + j]
const SUBS = ['₁', '₂', '₃']

/** The 2 × 2 that is left after row i and column j are struck out, in symbols. */
function symbolicMinor(i: number, j: number) {
  const rows = [0, 1, 2].filter((r) => r !== i)
  const cols = [0, 1, 2].filter((c) => c !== j)
  return rows.map((r) => cols.map((c) => symAt(r, c)))
}

/** A small symbolic matrix in brackets, for the minors. */
function SymBox({ m }: { m: string[][] }) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-md border-2 border-zinc-300 px-2 py-1.5">
      {m.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((v, j) => (
            <span key={j} className="w-[34px] text-center font-mono text-[12px] text-zinc-800">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SymbolicCofactorLab() {
  const [along, setAlong] = useState<{ kind: 'row' | 'col'; at: number }>({ kind: 'row', at: 1 })
  const [g, setG] = useState<number[][]>([
    [2, -1, 3],
    [4, 0, 1],
    [-2, 5, 2],
  ])

  const A = toFr(g)
  const det = detM(A) ?? fr(0)

  const terms = [0, 1, 2].map((k) => {
    const i = along.kind === 'row' ? along.at : k
    const j = along.kind === 'row' ? k : along.at
    const minorNums = detM(minorOf(A, i, j)) ?? fr(0)
    const cof = cofactorOf(A, i, j) ?? fr(0)
    return {
      i,
      j,
      head: symAt(i, j),
      value: g[i][j],
      minorSym: symbolicMinor(i, j),
      minorNums,
      cof,
      positive: (i + j) % 2 === 0,
      sub: `${SUBS[i]}${SUBS[j]}`,
    }
  })

  const total = terms.reduce((acc, t) => acc + t.value * (t.cof.n / t.cof.d), 0)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2].map((r) => (
          <Chip
            key={`r${r}`}
            on={along.kind === 'row' && along.at === r}
            label={`expand along row ${r + 1}`}
            onClick={() => setAlong({ kind: 'row', at: r })}
          />
        ))}
        {[0, 1, 2].map((c) => (
          <Chip
            key={`c${c}`}
            on={along.kind === 'col' && along.at === c}
            label={`down column ${c + 1}`}
            onClick={() => setAlong({ kind: 'col', at: c })}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A, in symbols" note="the deck's slide 4">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-1">
                {[0, 1, 2].map((j) => {
                  const on = along.kind === 'row' ? along.at === i : along.at === j
                  return (
                    <span
                      key={j}
                      className="w-[46px] rounded px-1 py-1.5 text-center font-mono text-[12.5px]"
                      style={on ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 } : undefined}
                    >
                      {symAt(i, j)}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </Titled>

        <Titled title="the same A, with numbers in it" note="type over anything">
          <NumBox
            m={g}
            width={44}
            markRow={along.kind === 'row' ? along.at : null}
            markCol={along.kind === 'col' ? along.at : null}
            onEdit={(i, j, v) => setG(edit(g, i, j, v))}
            name="A"
          />
        </Titled>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {terms.map((t, k) => (
          <div key={k} className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <div className="font-mono text-[12.5px] text-zinc-500">
              M{t.sub} — strike out row {t.i + 1}, column {t.j + 1}
            </div>
            <div className="mt-1.5">
              <SymBox m={t.minorSym} />
            </div>
            <div className="mt-2 font-mono text-[12.5px] text-zinc-800">
              C{t.sub} = (−1)
              <sup>{t.i + 1 + (t.j + 1)}</sup>M{t.sub} = {t.positive ? '' : '−'}M{t.sub}
            </div>
            <div className="mt-1 font-mono text-[12.5px]" style={{ color: 'var(--acc)' }}>
              M{t.sub} = {frStr(t.minorNums)} · C{t.sub} = {frStr(t.cof)} · term = {t.value} × {frStr(t.cof)} ={' '}
              {t.value * (t.cof.n / t.cof.d)}
            </div>
          </div>
        ))}
      </div>

      <Verdict ok={Math.abs(total - det.n / det.d) < 1e-9}>
        {along.kind === 'row' ? `Row ${along.at + 1}` : `Column ${along.at + 1}`}:{' '}
        {terms.map((t) => `${t.value} × ${t.cof.n < 0 ? `(${frStr(t.cof)})` : frStr(t.cof)}`).join(' + ')} ={' '}
        <strong>{total}</strong>, and det A worked out independently is <strong>{frStr(det)}</strong>. Switch to any
        other row or column and the total does not move.
      </Verdict>

      <LabNote>
        Slide 4 does exactly this along the second row, and writes C₂₁ = −M₂₁, C₂₂ = M₂₂, C₂₃ = −M₂₃. The signs come
        from (−1) raised to the row number plus the column number, which is why they alternate like a chessboard
        starting with a plus in the top-left corner.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 3 — what row operations do to a determinant, and why                   */
/* ========================================================================== */

type ProofClaim = 'swap' | 'equal' | 'add'

/** Swap two rows of a plain number matrix. */
const swapRows = (m: number[][], a: number, b: number) => m.map((r, i) => (i === a ? m[b] : i === b ? m[a] : r))

export function DetProofLab() {
  const [claim, setClaim] = useState<ProofClaim>('swap')
  const [g, setG] = useState<number[][]>([
    [2, -1, 3],
    [4, 0, 1],
    [-2, 5, 2],
  ])
  const [c, setC] = useState(3)

  const A = toFr(g)
  const detA = detM(A) ?? fr(0)

  // (a) interchange rows 1 and 2.
  const swapped = swapRows(g, 0, 1)
  const detSwapped = detM(toFr(swapped)) ?? fr(0)

  // The induction step: expand both along row 3, which was not moved. Each
  // minor of the swapped matrix is the matching minor with its two rows
  // exchanged, so by the hypothesis for size n − 1 it has the opposite sign.
  const pairs = [0, 1, 2].map((j) => ({
    j,
    M: detM(minorOf(A, 2, j)) ?? fr(0),
    N: detM(minorOf(toFr(swapped), 2, j)) ?? fr(0),
  }))

  // (b) a matrix with two equal rows.
  const twoEqual = [g[0], g[0], g[2]]
  const detEqual = detM(toFr(twoEqual)) ?? fr(0)

  // (c) add c × row 1 to row 2, and the split D′ = D₁ + cD₂.
  const added = g.map((r, i) => (i === 1 ? r.map((v, j) => v + c * g[0][j]) : r))
  const detAdded = detM(toFr(added)) ?? fr(0)
  const D2 = [g[0], g[0], g[2]]
  const detD2 = detM(toFr(D2)) ?? fr(0)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={claim === 'swap'} label="(a) swap two rows" onClick={() => setClaim('swap')} />
        <Chip on={claim === 'equal'} label="two rows the same" onClick={() => setClaim('equal')} />
        <Chip on={claim === 'add'} label="(b) add a multiple of a row" onClick={() => setClaim('add')} />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox m={g} width={44} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">det A</div>
            <div className="text-[28px] font-semibold" style={{ color: 'var(--acc)' }}>
              {frStr(detA)}
            </div>
          </div>
        </div>
      </div>

      {claim === 'swap' && (
        <Claim title="Rows 1 and 2 exchanged">
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="E, the swapped matrix">
              <NumBox m={swapped} width={44} readOnly name="E" />
            </Titled>
            <div className="pt-6 font-mono text-[13px] text-zinc-800">
              det E = {frStr(detSwapped)} = −({frStr(detA)})
            </div>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 pr-4 font-semibold">expanding along row 3</th>
                  <th className="py-1 pr-4 font-semibold">M₃ⱼ in A</th>
                  <th className="py-1 pr-4 font-semibold">N₃ⱼ in E</th>
                  <th className="py-1 font-semibold">M = −N?</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {pairs.map((p) => (
                  <tr key={p.j} className="border-t border-zinc-950/[0.06]">
                    <td className="py-1 pr-4">j = {p.j + 1}</td>
                    <td className="py-1 pr-4">{frStr(p.M)}</td>
                    <td className="py-1 pr-4">{frStr(p.N)}</td>
                    <td className="py-1" style={{ color: p.M.n === -p.N.n && p.M.d === p.N.d ? '#0d9488' : '#dc2626' }}>
                      {p.M.n === -p.N.n && p.M.d === p.N.d ? 'yes' : 'no'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelNote>
            Row 3 was not touched, so both determinants can be expanded along it. Each 2 × 2 minor on the right is the
            matching one on the left with its two rows exchanged — and for size 2 the swap rule is just ad − bc turning
            into bc − ad. Every term flips sign, so the whole determinant does.
          </PanelNote>
        </Claim>
      )}

      {claim === 'equal' && (
        <Claim title="Why a repeated row forces zero">
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="D₂ — row 1 copied over row 2">
              <NumBox m={twoEqual} width={44} readOnly name="D2" />
            </Titled>
            <div className="pt-6">
              <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">det D₂</div>
                <div className="text-[28px] font-semibold" style={{ color: 'var(--acc)' }}>
                  {frStr(detEqual)}
                </div>
              </div>
            </div>
          </div>
          <PanelNote>
            Swap those two identical rows. Nothing on the page changes, so the determinant must be the same number — but
            part (a) has just proved a swap negates it, so it must also be minus itself. The only number equal to its
            own negative is 0. Change any entry of row 1 above and watch this stay at 0.
          </PanelNote>
        </Claim>
      )}

      {claim === 'add' && (
        <Claim title="Row 2 ← row 2 + c × row 1">
          <div className="max-w-[320px]">
            <Slider
              label="c"
              value={c}
              display={String(c)}
              min={-6}
              max={6}
              step={1}
              hint="Any multiple you like, including a negative one."
              onChange={(v) => setC(v)}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-6">
            <Titled title="D′, after the move">
              <NumBox m={added} width={48} readOnly name="D-prime" />
            </Titled>
            <div className="pt-6">
              <ReadOutGrid
                items={[
                  { label: 'det D′', value: frStr(detAdded) },
                  { label: 'det A', value: frStr(detA) },
                  { label: 'c × det D₂', value: `${c} × ${frStr(detD2)}` },
                  { label: 'D₁ + cD₂', value: frStr(detA) },
                ]}
              />
            </div>
          </div>
          <PanelNote>
            The expansion splits into two determinants: D₁, which is A itself, and D₂, which has row 1 sitting in both
            row 1 and row 2. The middle chip above shows why that second one is always 0 — so however large c gets, the
            determinant does not move.
          </PanelNote>
        </Claim>
      )}

      <Verdict ok>
        Both parts of the theorem hold on this matrix: swapping gave {frStr(detSwapped)} against {frStr(detA)}, and
        adding {c} × row 1 to row 2 left it at {frStr(detAdded)}.
      </Verdict>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 4 — rank n exactly when the determinant is not zero                    */
/* ========================================================================== */

export function RankDetLab() {
  const [g, setG] = useState<number[][]>([
    [0, 2, 1],
    [3, 1, 4],
    [1, 5, 2],
  ])

  const A = toFr(g)
  const n = g.length
  const det = detM(A) ?? fr(0)
  const { U, swaps, product } = gaussUpper(A)
  const rank = rankOf(A)
  const sign = swaps % 2 === 0 ? 1 : -1
  const predicted: Fr = fr(sign * product.n, product.d)
  const agrees = predicted.n === det.n && predicted.d === det.d

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() =>
            setG([
              [0, 2, 1],
              [3, 1, 4],
              [1, 5, 2],
            ])
          }
        >
          reset
        </Btn>
        <Btn onClick={() => setG([g[0], g[1], g[0].map((v, j) => v + g[1][j])])}>make row 3 = row 1 + row 2</Btn>
        <Btn onClick={() => setG([g[0], g[0].map((v) => 2 * v), g[2]])}>make row 2 = 2 × row 1</Btn>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox m={g} width={44} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
        </Titled>
        <Titled title="U, after the downward sweep" note={`${swaps} row interchange${swaps === 1 ? '' : 's'}`}>
          <FrBox m={U} width={56} />
        </Titled>
      </div>

      <ReadOutGrid
        items={[
          { label: 'product of the diagonal of U', value: frStr(product) },
          { label: '(−1)ˢ, s = ' + swaps, value: String(sign) },
          { label: '(−1)ˢ × product', value: frStr(predicted) },
          { label: 'det A, worked separately', value: frStr(det) },
        ]}
      />

      <Verdict ok={agrees}>
        {agrees
          ? `det A = (−1)^${swaps} × ${frStr(product)} = ${frStr(det)}. The elimination and the cofactor formula agree, which is what slide 9 assumes when it swaps one for the other.`
          : 'The two routes disagree, which should never happen — if you are seeing this, something in the elimination is wrong.'}
      </Verdict>

      <div className="grid gap-3 sm:grid-cols-2">
        <Claim title="Rank">
          <div className="text-[26px] font-semibold" style={{ color: 'var(--acc)' }}>
            {rank} of {n}
          </div>
          <PanelNote>
            The number of pivots in U. Full rank means every column is a pivot column, so Ax = 0 has only x = 0.
          </PanelNote>
        </Claim>
        <Claim title="Determinant">
          <div className="text-[26px] font-semibold" style={{ color: det.n === 0 ? '#dc2626' : '#0d9488' }}>
            {frStr(det)}
          </div>
          <PanelNote>
            Zero exactly when one of the diagonal entries of U is zero — which is exactly when a column failed to become
            a pivot column.
          </PanelNote>
        </Claim>
      </div>

      <Verdict ok={(rank === n) === (det.n !== 0)}>
        rank A = {rank} and det A = {frStr(det)}:{' '}
        {rank === n ? 'full rank and a non-zero determinant' : 'short of full rank and a zero determinant'}. Press
        either button above to make one row a combination of the others, and both fail at the same moment — that is the
        whole theorem.
      </Verdict>

      <LabNote>
        The count s matters. Every interchange flips the sign, so det(A) = (−1)ˢ det(U) — and det(U), for a triangular
        matrix, is just the diagonal multiplied together. Type a 0 into the top-left corner and watch s go up by one.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 5 — the trace                                                          */
/* ========================================================================== */

type TraceRule = 'sum' | 'scale' | 'identity' | 'commute'

/** A matrix of any shape, read-only, printed from exact fractions. */
function ShapeBox({ m, title, note }: { m: FMat; title: string; note?: string }) {
  return (
    <Titled title={title} note={note}>
      <FrBox m={m} width={50} />
    </Titled>
  )
}

export function TraceLab() {
  const [rule, setRule] = useState<TraceRule>('commute')
  const [alpha, setAlpha] = useState(3)
  const [n, setN] = useState(4)
  const [P, setP] = useState<number[][]>([
    [1, 2, 0],
    [3, -1, 4],
  ])
  const [Q, setQ] = useState<number[][]>([
    [2, 1],
    [0, 3],
    [5, -2],
  ])
  const [S, setS] = useState<number[][]>([
    [3, 1],
    [2, 5],
  ])
  const [T, setT] = useState<number[][]>([
    [-1, 4],
    [0, 2],
  ])

  const Pf = toFr(P)
  const Qf = toFr(Q)
  const PQ = mulM(Pf, Qf)
  const QP = mulM(Qf, Pf)
  const Sf = toFr(S)
  const Tf = toFr(T)
  const sumM = Sf.map((row, i) => row.map((v, j) => fr(v.n * Tf[i][j].d + Tf[i][j].n * v.d, v.d * Tf[i][j].d)))
  const scaled = Sf.map((row) => row.map((v) => fr(alpha * v.n, v.d)))

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={rule === 'sum'} label="tr(A + B) = tr A + tr B" onClick={() => setRule('sum')} />
        <Chip on={rule === 'scale'} label="tr(αA) = α tr A" onClick={() => setRule('scale')} />
        <Chip on={rule === 'identity'} label="tr(Iₙ) = n" onClick={() => setRule('identity')} />
        <Chip on={rule === 'commute'} label="tr(AB) = tr(BA)" onClick={() => setRule('commute')} />
      </div>

      {rule === 'sum' && (
        <Claim title="Adding two matrices adds their traces">
          <div className="flex flex-wrap items-start gap-5">
            <Titled title="A" note="type over anything">
              <NumBox m={S} width={44} onEdit={(i, j, v) => setS(edit(S, i, j, v))} name="A" />
            </Titled>
            <Titled title="B" note="type over anything">
              <NumBox m={T} width={44} onEdit={(i, j, v) => setT(edit(T, i, j, v))} name="B" />
            </Titled>
            <ShapeBox m={sumM} title="A + B" />
          </div>
          <div className="mt-3">
            <ReadOutGrid
              items={[
                { label: 'tr A', value: frStr(traceOf(Sf)) },
                { label: 'tr B', value: frStr(traceOf(Tf)) },
                { label: 'tr A + tr B', value: frStr(fr(traceOf(Sf).n + traceOf(Tf).n)) },
                { label: 'tr(A + B)', value: frStr(traceOf(sumM)) },
              ]}
            />
          </div>
          <PanelNote>
            Nothing deep here: the diagonal of A + B is the diagonal of A added to the diagonal of B, entry by entry, so
            the sums agree. Only the diagonal is ever looked at, so the off-diagonal entries can be anything at all.
          </PanelNote>
        </Claim>
      )}

      {rule === 'scale' && (
        <Claim title="Scaling the matrix scales the trace">
          <div className="max-w-[320px]">
            <Slider
              label="α"
              value={alpha}
              display={String(alpha)}
              min={-5}
              max={5}
              step={1}
              hint="The number every entry is multiplied by."
              onChange={(v) => setAlpha(v)}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-5">
            <Titled title="A" note="type over anything">
              <NumBox m={S} width={44} onEdit={(i, j, v) => setS(edit(S, i, j, v))} name="A" />
            </Titled>
            <ShapeBox m={scaled} title="αA" />
            <ReadOutGrid
              items={[
                { label: 'tr A', value: frStr(traceOf(Sf)) },
                { label: 'α × tr A', value: frStr(fr(alpha * traceOf(Sf).n, traceOf(Sf).d)) },
                { label: 'tr(αA)', value: frStr(traceOf(scaled)) },
                { label: 'α', value: String(alpha) },
              ]}
            />
          </div>
          <PanelNote>
            Set α to 0 and the trace goes to 0 with it. Together with the rule above, this is what makes the trace a
            linear function of the matrix — the same word used of a straight line through the origin.
          </PanelNote>
        </Claim>
      )}

      {rule === 'identity' && (
        <Claim title="The identity matrix has trace n">
          <div className="max-w-[320px]">
            <Slider
              label="n"
              value={n}
              display={String(n)}
              min={1}
              max={6}
              step={1}
              hint="The size of the identity matrix."
              onChange={(v) => setN(v)}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-5">
            <ShapeBox
              m={Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => fr(i === j ? 1 : 0)))}
              title={`I${n}`}
            />
            <div className="pt-6">
              <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">tr(Iₙ)</div>
                <div className="text-[30px] font-semibold" style={{ color: 'var(--acc)' }}>
                  {n}
                </div>
              </div>
            </div>
          </div>
          <PanelNote>
            n ones down the diagonal, so the sum is n. Trivial on its own — but it is the reason the trace of a
            projection matrix counts the dimension it projects onto, which is where degrees of freedom come from.
          </PanelNote>
        </Claim>
      )}

      {rule === 'commute' && (
        <Claim title="tr(AB) = tr(BA), even at different sizes">
          <div className="flex flex-wrap items-start gap-5">
            <Titled title="A, 2 × 3" note="type over anything">
              <NumBox m={P} width={44} onEdit={(i, j, v) => setP(edit(P, i, j, v))} name="A" />
            </Titled>
            <Titled title="B, 3 × 2" note="type over anything">
              <NumBox m={Q} width={44} onEdit={(i, j, v) => setQ(edit(Q, i, j, v))} name="B" />
            </Titled>
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-5">
            {PQ && <ShapeBox m={PQ} title="AB" note="2 × 2" />}
            {QP && <ShapeBox m={QP} title="BA" note="3 × 3" />}
            <div className="pt-6">
              <ReadOutGrid
                items={[
                  { label: 'tr(AB)', value: PQ ? frStr(traceOf(PQ)) : '—' },
                  { label: 'tr(BA)', value: QP ? frStr(traceOf(QP)) : '—' },
                ]}
              />
            </div>
          </div>
          <Verdict ok={!!PQ && !!QP && frStr(traceOf(PQ)) === frStr(traceOf(QP))}>
            AB is 2 × 2 and BA is 3 × 3 — different matrices, of different sizes, and one of them has an extra zero
            eigenvalue. Their traces are still equal, because both are the same sum Σᵢ Σⱼ aᵢⱼbⱼᵢ read in two orders.
          </Verdict>
        </Claim>
      )}
    </LabBox>
  )
}
