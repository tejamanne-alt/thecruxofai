'use client'

/**
 * Lecture 4, parts 13 to 18: the spectral theorem and the two free checks.
 *
 * The complex slides are the awkward ones to make interactive, because a
 * complex vector is four numbers pretending to be two. They are given real
 * boxes for the real and imaginary parts so nothing has to be parsed, and the
 * arithmetic stays exact — the deck's own xᵀx = 3 + 6i has to come out as
 * exactly that, not as 3.0000001 + 6i.
 */
import { Chip, FrBox, LabBox, LabNote, NumBox, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid } from '@/components/sessions/session-parts'
import {
  charPoly,
  cx,
  cxAdd,
  cxConjTranspose,
  cxModSq,
  cxMul,
  cxStr,
  eigenspaceOf,
  fmt,
  hermDot,
  isHermitian,
  plainDot,
  polyStr,
  realRoots,
  symmetric,
  traceOf,
  vecStr,
  type Cx,
} from '@/lib/model/eigen'
import { fr, frNum, frStr, type Fr } from '@/lib/model/fraction'
import { detM, toFr, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

const edit = (m: number[][], i: number, j: number, v: number) =>
  m.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x)))

function Claim({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/[0.08] bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

/** A read-only grid of ordinary numbers, rounded, for the parts that must leave exactness behind. */
function NumGrid({ m, title, note, dp = 4 }: { m: number[][]; title: string; note?: string; dp?: number }) {
  return (
    <Titled title={title} note={note}>
      <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
        {m.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((v, j) => (
              <span
                key={j}
                className="w-[70px] px-2 py-1.5 text-right font-mono text-[12.5px] text-zinc-800 tabular-nums"
              >
                {fmt(v, dp)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Titled>
  )
}

/** One editable complex number: a box for the real part and a box for the imaginary part. */
function CxCell({ value, onChange, label }: { value: Cx; onChange: (v: Cx) => void; label: string }) {
  const read = (raw: string) => {
    const t = raw.trim()
    const n = t === '' || t === '-' ? 0 : Number(t)
    return Number.isFinite(n) ? n : null
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-950/10 bg-white px-1.5 py-1">
      <input
        value={value.re.n}
        inputMode="numeric"
        aria-label={`${label}, real part`}
        onChange={(e) => {
          const n = read(e.target.value)
          if (n !== null) onChange({ ...value, re: fr(n) })
        }}
        className="w-[38px] rounded px-1 py-0.5 text-right font-mono text-[12.5px] tabular-nums outline-none hover:bg-zinc-950/[0.04]"
      />
      <span className="font-mono text-[12px] text-zinc-400">+</span>
      <input
        value={value.im.n}
        inputMode="numeric"
        aria-label={`${label}, imaginary part`}
        onChange={(e) => {
          const n = read(e.target.value)
          if (n !== null) onChange({ ...value, im: fr(n) })
        }}
        className="w-[38px] rounded px-1 py-0.5 text-right font-mono text-[12.5px] tabular-nums outline-none hover:bg-zinc-950/[0.04]"
      />
      <span className="font-mono text-[12px] text-zinc-400">i</span>
    </span>
  )
}

/* ========================================================================== */
/* Part 13 — the spectral theorem: stringing the bases together                */
/* ========================================================================== */

const SPECTRAL_CASES: Array<{ id: string; label: string; m: number[][] }> = [
  {
    id: 'repeat',
    label: 'symmetric, one λ repeated',
    m: [
      [3, 0, 0],
      [0, 5, 0],
      [0, 0, 3],
    ],
  },
  {
    id: 'sym',
    label: 'symmetric, three different λ',
    m: [
      [2, 1, 0],
      [1, 2, 0],
      [0, 0, 4],
    ],
  },
  {
    id: 'defect',
    label: 'not symmetric, and short',
    m: [
      [2, 1, 0],
      [0, 2, 0],
      [0, 0, 4],
    ],
  },
]

/** ‖v‖ for an exact vector, as an ordinary number — normalising needs a root. */
const normOf = (v: Fr[]) => Math.sqrt(v.reduce((acc, x) => acc + frNum(x) ** 2, 0))

export function SpectralBasisLab() {
  const [at, setAt] = useState(0)
  const cs = SPECTRAL_CASES[at]
  const A = toFr(cs.m)
  const n = cs.m.length
  const roots = realRoots(charPoly(A))
  const sym = symmetric(A)

  const spaces = roots.real.map((r) => ({
    r,
    es: r.exact ? eigenspaceOf(A, r.exact) : null,
  }))
  const collected = spaces.flatMap((s) => s.es?.basis ?? [])
  const enough = collected.length === n

  // Normalised, in the order they were strung together.
  const Q = collected.map((v) => v.map((x) => frNum(x) / (normOf(v) || 1)))
  const QtQ = Q.map((a) => Q.map((b) => a.reduce((acc, x, i) => acc + x * b[i], 0)))
  const orthonormal = enough && QtQ.every((row, i) => row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < 1e-9))

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {SPECTRAL_CASES.map((s, i) => (
          <Chip key={s.id} on={i === at} label={s.label} onClick={() => setAt(i)} />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note={sym ? 'symmetric' : 'not symmetric'}>
          <FrBox m={A} width={44} />
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">p(λ)</div>
            <div className="font-mono text-[13px] text-zinc-900">{polyStr(charPoly(A))}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1.5 pr-4 font-semibold">λ</th>
              <th className="py-1.5 pr-4 font-semibold">algebraic multiplicity</th>
              <th className="py-1.5 pr-4 font-semibold">geometric multiplicity</th>
              <th className="py-1.5 font-semibold">vectors this eigenvalue contributes</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {spaces.map((s, i) => (
              <tr key={i} className="border-t border-zinc-950/[0.06]">
                <td className="py-1.5 pr-4">{s.r.text}</td>
                <td className="py-1.5 pr-4">{s.r.multiplicity}</td>
                <td
                  className="py-1.5 pr-4"
                  style={{ color: (s.es?.dim ?? 0) < s.r.multiplicity ? '#dc2626' : '#0d9488' }}
                >
                  {s.es?.dim ?? '—'}
                </td>
                <td className="py-1.5">{s.es?.basis.map(vecStr).join(' , ') ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReadOutGrid
        items={[
          { label: 'vectors collected', value: String(collected.length) },
          { label: 'wanted, to span Rⁿ', value: String(n) },
        ]}
      />

      {enough && (
        <div className="flex flex-wrap items-start gap-6">
          <NumGrid
            m={Q.map((_, i) => Q.map((q) => q[i]))}
            title="Q"
            note="each vector divided by its own length, as a column"
          />
          <NumGrid m={QtQ} title="QᵀQ" note="should be the identity" />
        </div>
      )}

      <Verdict ok={enough && (!sym || orthonormal)}>
        {!enough
          ? `Only ${collected.length} vectors where ${n} were needed. The third statement on slide 22 has failed: an eigenvalue’s geometric multiplicity is below its algebraic one, so the eigenspaces cannot be strung into a basis. Notice this matrix is not symmetric — the theorem never promised anything for it.`
          : sym
            ? orthonormal
              ? `All ${n} vectors, and QᵀQ comes back as the identity — so they are mutually at right angles and each of length 1. That is an orthonormal basis of R${n === 3 ? '³' : '²'}, built exactly as slide 22 describes.`
              : 'Enough vectors, but they are not mutually orthogonal — which for a symmetric matrix should not happen.'
            : `All ${n} vectors, so a basis of eigenvectors exists — but A is not symmetric, so there is no promise they are at right angles, and QᵀQ above is not the identity.`}
      </Verdict>

      <LabNote>
        Slide 22 lists three things the theorem needs, and only the third can fail: the roots are all real, each
        eigenspace has an orthonormal basis, and the geometric multiplicity matches the algebraic one. That last line is
        the load-bearing one, and the deck says plainly that it will not prove it. The third preset shows what its
        failure looks like.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — complex vectors, and what length has to mean                      */
/* ========================================================================== */

export function ComplexLengthLab() {
  const [x, setX] = useState<Cx[]>([cx(1, 1), cx(2, 1)])

  const plain = plainDot(x, x)
  const herm = hermDot(x, x)
  const mods = x.map(cxModSq)
  const isDeck = cxStr(x[0]) === '1 + i' && cxStr(x[1]) === '2 + i'

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="x" note="type over the real and imaginary parts">
          <div className="inline-flex flex-col gap-1.5 rounded-lg border-2 border-zinc-300 p-2">
            {x.map((v, i) => (
              <CxCell
                key={i}
                value={v}
                label={`x${i + 1}`}
                onChange={(nv) => setX(x.map((old, k) => (k === i ? nv : old)))}
              />
            ))}
          </div>
        </Titled>
        <div className="pt-6">
          <div className="font-mono text-[13px] text-zinc-700">x = ({x.map(cxStr).join(', ')})</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Claim title="The old definition: xᵀx">
          <div className="font-mono text-[15px]" style={{ color: '#b91c1c' }}>
            xᵀx = {cxStr(plain)}
          </div>
          <PanelNote>
            Each entry squared and added, with no conjugating.{' '}
            {isDeck
              ? 'The deck works this exact case on slide 23: (1 + i)² + (2 + i)² = 3 + 6i.'
              : 'Change the boxes back to 1 + 1i and 2 + 1i to see the deck’s own case.'}
          </PanelNote>
        </Claim>
        <Claim title="The mended definition: xᴴx">
          <div className="font-mono text-[15px]" style={{ color: '#0f766e' }}>
            xᴴx = {cxStr(herm)} = {mods.map(frStr).join(' + ')}
          </div>
          <PanelNote>
            Conjugate the first copy, then multiply. Each term becomes |xᵢ|², which is a real number that cannot be
            negative — so the total is a length squared.
          </PanelNote>
        </Claim>
      </div>

      <Verdict ok={herm.im.n === 0 && herm.re.n >= 0}>
        xᵀx comes out as {cxStr(plain)}
        {plain.im.n !== 0 ? ', which has an imaginary part and so cannot be the square of any length' : ''}. xᴴx comes
        out as {cxStr(herm)}, which is real and not negative — a length squared, so ‖x‖ = √{frStr(herm.re)} ≈{' '}
        {fmt(Math.sqrt(frNum(herm.re)), 3)}.
      </Verdict>

      <LabNote>
        For a + bi the modulus is √((a + bi)(a − bi)) = √(a² + b²), and the trick in that line is the whole idea: a
        complex number multiplied by its own conjugate loses its imaginary part. Set both imaginary parts to 0 and watch
        the two definitions above become the same thing — which is why nobody mentions any of this while the numbers are
        real.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15 — Hermitian matrices                                                */
/* ========================================================================== */

export function HermitianLab() {
  const [m, setM] = useState<Cx[][]>([
    [cx(1, 0), cx(3, -1)],
    [cx(3, 1), cx(4, 0)],
  ])

  const H = cxConjTranspose(m)
  const herm = isHermitian(m)
  const diagReal = m.every((row, i) => row[i].im.n === 0)
  const mirrored = m[0][1].re.n === m[1][0].re.n && m[0][1].im.n === -m[1][0].im.n

  const set = (i: number, j: number, v: Cx) =>
    setM(m.map((row, ri) => row.map((x, ci) => (ri === i && ci === j ? v : x))))

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <div className="inline-flex flex-col gap-1.5 rounded-lg border-2 border-zinc-300 p-2">
            {m.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map((v, j) => (
                  <CxCell key={j} value={v} label={`A row ${i + 1} column ${j + 1}`} onChange={(nv) => set(i, j, nv)} />
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <Titled title="Aᴴ" note="transposed, then every entry conjugated">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {H.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <span key={j} className="w-[86px] px-2 py-1.5 text-center font-mono text-[12.5px] text-zinc-800">
                    {cxStr(v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Claim title="What has to hold">
          <div className="flex flex-col gap-1.5 text-[13px]/[1.6]">
            <div style={{ color: diagReal ? '#115e59' : '#991b1b' }}>{diagReal ? '✓' : '✗'} the diagonal is real</div>
            <div style={{ color: mirrored ? '#115e59' : '#991b1b' }}>
              {mirrored ? '✓' : '✗'} the off-diagonal pair are conjugates of each other
            </div>
          </div>
          <PanelNote>
            The diagonal has no choice. Conjugating leaves aᵢᵢ where it is, so aᵢᵢ must equal its own conjugate — and
            only a real number does that. Type a 1 into the imaginary box of the top-left entry and watch it fail.
          </PanelNote>
        </Claim>
        <Claim title="Where symmetric fits in">
          <PanelNote>
            Set every imaginary part to 0. Conjugating then does nothing, Aᴴ collapses to Aᵀ, and “Hermitian” becomes
            the ordinary “symmetric”. So symmetric is the real-numbers special case of Hermitian, not a different idea.
          </PanelNote>
        </Claim>
      </div>

      <Verdict ok={herm}>
        {herm
          ? 'Aᴴ = A, so this is a Hermitian matrix — the deck’s slide 24 example, with 3 − i above the diagonal and 3 + i below it.'
          : 'Aᴴ is not equal to A, so this is not Hermitian. Compare the two boxes above and find the entry that does not mirror.'}
      </Verdict>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — why symmetric means real, and orthogonal                          */
/* ========================================================================== */

type ProofSide = 'real' | 'ortho'

export function SymmetricProofLab() {
  const [side, setSide] = useState<ProofSide>('real')
  const [m, setM] = useState<Cx[][]>([
    [cx(2, 0), cx(0, -1)],
    [cx(0, 1), cx(2, 0)],
  ])
  const [v, setV] = useState<Cx[]>([cx(1, 1), cx(2, 0)])
  const [s, setS] = useState<number[][]>([
    [4, 1],
    [1, 4],
  ])

  // xᴴAx, worked out exactly. A Hermitian A makes it real; break A and it stops.
  const Ax = m.map((row) => row.reduce((acc, a, j) => cxAdd(acc, cxMul(a, v[j])), cx(0)))
  const quad = hermDot(v, Ax)
  const herm = isHermitian(m)

  const S = toFr(s)
  const sym = symmetric(S)
  const roots = realRoots(charPoly(S))
  const vecs = roots.real.flatMap((r) =>
    r.exact ? eigenspaceOf(S, r.exact).basis.map((b) => ({ lam: r.text, b })) : []
  )
  const pairDot = vecs.length >= 2 ? vecs[0].b.reduce((acc, x, i) => acc + frNum(x) * frNum(vecs[1].b[i]), 0) : null

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={side === 'real'} label="the eigenvalues are real" onClick={() => setSide('real')} />
        <Chip on={side === 'ortho'} label="the eigenvectors are orthogonal" onClick={() => setSide('ortho')} />
      </div>

      {side === 'real' && (
        <>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="type over anything">
              <div className="inline-flex flex-col gap-1.5 rounded-lg border-2 border-zinc-300 p-2">
                {m.map((row, i) => (
                  <div key={i} className="flex gap-1.5">
                    {row.map((val, j) => (
                      <CxCell
                        key={j}
                        value={val}
                        label={`A row ${i + 1} column ${j + 1}`}
                        onChange={(nv) => setM(m.map((r2, ri) => r2.map((x, ci) => (ri === i && ci === j ? nv : x))))}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Titled>
            <Titled title="x" note="any non-zero complex vector">
              <div className="inline-flex flex-col gap-1.5 rounded-lg border-2 border-zinc-300 p-2">
                {v.map((val, i) => (
                  <CxCell
                    key={i}
                    value={val}
                    label={`x${i + 1}`}
                    onChange={(nv) => setV(v.map((old, k) => (k === i ? nv : old)))}
                  />
                ))}
              </div>
            </Titled>
          </div>

          <Claim title="The chain on slide 25">
            <div className="flex flex-col gap-1.5 font-mono text-[13px] text-zinc-800">
              <div>Ax = λx, so premultiply both sides by xᴴ: xᴴAx = λ xᴴx</div>
              <div>
                xᴴAx = <strong>{cxStr(quad)}</strong>
                {quad.im.n === 0 ? '  — real' : '  — not real'}
              </div>
              <div>
                xᴴx = <strong>{cxStr(hermDot(v, v))}</strong> — always real, and positive unless x is the zero vector
              </div>
              <div>so λ = (xᴴAx) / (xᴴx), a real number divided by a real number</div>
            </div>
          </Claim>

          <Verdict ok={herm === (quad.im.n === 0)}>
            {herm
              ? 'A is Hermitian, and xᴴAx has come out real for this x — try any other x you like and it stays real. That is the whole argument: (xᴴAx)ᴴ = xᴴAᴴx = xᴴAx, so this 1 × 1 matrix is its own conjugate, which only real numbers are.'
              : 'A is no longer Hermitian, and xᴴAx has picked up an imaginary part. The argument breaks exactly where the deck says it needs Aᴴ = A.'}
          </Verdict>
        </>
      )}

      {side === 'ortho' && (
        <>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="type over anything — try breaking the symmetry">
              <NumBox m={s} width={46} onEdit={(i, j, val) => setS(edit(s, i, j, val))} name="A" />
            </Titled>
            <div className="pt-6">
              <ReadOutGrid
                items={[
                  { label: 'symmetric?', value: sym ? 'yes' : 'no' },
                  { label: 'eigenvalues', value: roots.real.map((r) => r.text).join(', ') || 'not real' },
                ]}
              />
            </div>
          </div>

          {vecs.length >= 2 && (
            <Claim title="Two eigenvectors from two different eigenvalues">
              <div className="font-mono text-[13px] text-zinc-800">
                <div>
                  λ = {vecs[0].lam}: x = {vecStr(vecs[0].b)}
                </div>
                <div>
                  λ = {vecs[1].lam}: y = {vecStr(vecs[1].b)}
                </div>
                <div className="mt-1.5" style={{ color: Math.abs(pairDot ?? 1) < 1e-12 ? '#0f766e' : '#b91c1c' }}>
                  xᵀy = {fmt(pairDot ?? 0, 6)}
                </div>
              </div>
            </Claim>
          )}

          <Verdict ok={sym ? Math.abs(pairDot ?? 1) < 1e-12 : true}>
            {vecs.length < 2
              ? 'This matrix does not give two exact real eigenvectors to compare, so nothing is printed rather than something rounded. Put the entries back to 4, 1, 1, 4.'
              : sym
                ? 'The inner product is exactly 0: the two eigenvectors meet at a right angle. Slide 26 gets there by writing yᴴAx two ways — once as λyᴴx and once as μxᴴy — and noting that λ ≠ μ leaves no option but xᴴy = 0.'
                : 'A is not symmetric now, and the two eigenvectors are no longer at right angles. The promise on slide 26 was only ever about symmetric matrices.'}
          </Verdict>
        </>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 17 — A = QΛQᵀ                                                          */
/* ========================================================================== */

const DECOMP_CASES: Array<{ id: string; label: string; m: number[][] }> = [
  {
    id: 'two',
    label: 'a 2 × 2 with a tilt',
    m: [
      [4, 1],
      [1, 4],
    ],
  },
  {
    id: 'cov',
    label: 'a covariance-shaped matrix',
    m: [
      [5, 3],
      [3, 5],
    ],
  },
  {
    id: 'three',
    label: 'a 3 × 3',
    m: [
      [2, 1, 0],
      [1, 2, 0],
      [0, 0, 4],
    ],
  },
]

export function SpectralDecompLab() {
  const [at, setAt] = useState(0)
  const cs = DECOMP_CASES[at]
  const A = toFr(cs.m)
  const n = cs.m.length
  const roots = realRoots(charPoly(A))

  // One column of Q per eigenvector, normalised. λ repeated down Λ to match.
  const cols: Array<{ vec: number[]; lam: number }> = []
  for (const r of roots.real) {
    if (!r.exact) continue
    for (const b of eigenspaceOf(A, r.exact).basis) {
      const raw = b.map(frNum)
      const len = Math.sqrt(raw.reduce((acc, x) => acc + x * x, 0)) || 1
      cols.push({ vec: raw.map((x) => x / len), lam: r.value })
    }
  }
  const complete = cols.length === n

  const Q = Array.from({ length: n }, (_, i) => cols.map((c) => c.vec[i] ?? 0))
  const Lam = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? (cols[i]?.lam ?? 0) : 0))
  )
  const QtQ = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => Q.reduce((acc, row) => acc + row[i] * row[j], 0))
  )
  const QL = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Q[i][j] * (cols[j]?.lam ?? 0)))
  const back = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => QL[i].reduce((acc, v, k) => acc + v * Q[j][k], 0))
  )
  const residual = complete
    ? Math.max(...back.flatMap((row, i) => row.map((v, j) => Math.abs(v - cs.m[i][j]))))
    : Infinity

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {DECOMP_CASES.map((s, i) => (
          <Chip key={s.id} on={i === at} label={s.label} onClick={() => setAt(i)} />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="symmetric, so the theorem applies">
          <FrBox m={A} width={46} />
        </Titled>
        <NumGrid m={Q} title="Q" note="normalised eigenvectors, one per column" />
        <NumGrid m={Lam} title="Λ" note="the matching eigenvalues" dp={3} />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <NumGrid m={QtQ} title="QᵀQ" note="the test for orthogonal" />
        <NumGrid m={back} title="QΛQᵀ" note="multiplied back out" dp={3} />
      </div>

      <Verdict ok={complete && residual < 1e-9}>
        {complete
          ? `QΛQᵀ agrees with A to within ${residual.toExponential(1)} — that is floating-point dust from the square roots in the normalising, not a real disagreement. QᵀQ is the identity, so Q really is orthogonal and Q⁻¹ = Qᵀ, which is the only reason the third factor can be written as a transpose rather than as an inverse.`
          : 'Not enough eigenvectors to build Q, so the decomposition does not exist for this matrix.'}
      </Verdict>

      <LabNote>
        Read the three factors right to left and A stops being a box of numbers: Qᵀ writes a vector in the eigenvector
        axes, Λ stretches each of those axes by its own λ, and Q writes the answer back in the ordinary axes. That is
        every symmetric matrix — a rotation, a stretch, and the rotation undone. Slide 28 hands the same picture to
        singular-value decomposition and PCA by making AᵀA or AAᵀ out of a data matrix.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 18 — the sum is the trace, the product is the determinant              */
/* ========================================================================== */

export function TraceEigenLab() {
  const [g, setG] = useState<number[][]>([
    [3, 1],
    [1, 3],
  ])

  const A = toFr(g)
  const c = charPoly(A)
  const roots = realRoots(c)
  const tr = traceOf(A)
  const det = detM(A) ?? fr(0)

  // Every root counted as often as it repeats, complex ones included through
  // their real parts — a conjugate pair contributes 2·re to the sum and
  // re² + im² to the product, which is what keeps both identities true.
  const realTerms = roots.real.flatMap((r) => Array.from({ length: r.multiplicity }, () => r.value))
  const complexSum = roots.complex.reduce((acc, r) => acc + r.re, 0)
  const complexProd = roots.complex.length === 2 ? roots.complex[0].re ** 2 + roots.complex[0].im ** 2 : 1
  const sum = realTerms.reduce((acc, v) => acc + v, 0) + complexSum
  const product = realTerms.reduce((acc, v) => acc * v, 1) * complexProd
  const sumOk = Math.abs(sum - frNum(tr)) < 1e-9
  const prodOk = Math.abs(product - frNum(det)) < 1e-9

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox m={g} width={46} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">p(λ)</div>
            <div className="font-mono text-[13px] text-zinc-900">{polyStr(c)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Claim title="Σλ should be tr A">
          <div className="font-mono text-[15px]" style={{ color: sumOk ? '#0f766e' : '#b91c1c' }}>
            {fmt(sum, 6)} against {frStr(tr)}
          </div>
          <PanelNote>
            The coefficient of λⁿ⁻¹ can be read two ways — off the factorisation Π(λᵢ − λ), and off the direct expansion
            of the determinant. Both give (−1)ⁿ⁻¹ times a sum, so the two sums must be equal.
          </PanelNote>
        </Claim>
        <Claim title="Πλ should be det A">
          <div className="font-mono text-[15px]" style={{ color: prodOk ? '#0f766e' : '#b91c1c' }}>
            {fmt(product, 6)} against {frStr(det)}
          </div>
          <PanelNote>
            Set λ = 0 in det(A − λI) = Π(λᵢ − λ). The left side becomes det A and the right becomes the eigenvalues
            multiplied together. One substitution, and it is done.
          </PanelNote>
        </Claim>
      </div>

      <ReadOutGrid
        items={[
          { label: 'eigenvalues', value: roots.real.map((r) => fmt(r.value, 3)).join(', ') || 'complex pair' },
          { label: 'how many', value: String(realTerms.length + roots.complex.length) },
          { label: 'tr A', value: frStr(tr) },
          { label: 'det A', value: frStr(det) },
        ]}
      />

      <Verdict ok={sumOk && prodOk}>
        {sumOk && prodOk
          ? 'Both hold. In an exam these are the two free checks on any eigenvalue answer you write down: add them and you should get the diagonal sum, multiply them and you should get the determinant. If either fails, the answer is wrong before you have looked at the eigenvectors.'
          : 'One of the two checks has failed — which for a matrix whose roots have all been found should not happen. If the eigenvalues include an unsolved case, the totals above are incomplete rather than wrong.'}
      </Verdict>

      <LabNote>
        Try the matrix with 1, 1 on the top row and 1, 0 below it. Its eigenvalues are the two irrational numbers (1 ±
        √5)/2, and they still add to 1 and multiply to −1 — the trace and the determinant of that matrix. The identities
        do not care whether the roots are nice.
      </LabNote>
    </LabBox>
  )
}

/** Kept for the parts that print an exact matrix beside a rounded one. */
export type { FMat }
