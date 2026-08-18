/**
 * Eigenvalues, eigenvectors and the two decompositions of Lecture 4, worked in
 * exact fractions wherever exactness survives.
 *
 * The reason is the one in `fraction.ts`, only sharper here. A characteristic
 * polynomial is a determinant with a letter in it, and if the coefficients are
 * computed in floating point then a double root arrives as 1.9999999998 and
 * 2.0000000002 — which is the difference between "this matrix is defective" and
 * "this matrix is fine", printed as noise. So the polynomial is exact, the
 * rational roots are exact, and the roots that are genuinely irrational are
 * given their surd as well as their decimal, so a reader can see which is which.
 *
 * Square roots are where exactness has to stop: Cholesky takes them by
 * definition, so that part is numeric and says so.
 */
import { fr, frAdd, frDiv, frIsZero, frMul, frNeg, frNum, frStr, frSub, type Fr } from './fraction'
import { detM, identity, nrows, rrefOf, scaleM, subM, type FMat } from './matrix'

/* ------------------------------------------------------ the characteristic polynomial */

/**
 * Coefficients of p(λ) = det(A − λI), lowest power first, so `c[k]` multiplies
 * λ^k. Worked by evaluating the determinant at n + 1 whole values of λ and
 * solving for the coefficients — every step of that is exact, and it does not
 * need a separate hand-written formula per size the way expanding by hand does.
 */
export function charPoly(a: FMat): Fr[] {
  const n = nrows(a)
  const I = identity(n)
  // Vandermonde: one row per sample point, one column per power of λ.
  const rows: FMat = []
  for (let s = 0; s <= n; s++) {
    const lam = fr(s)
    const shifted = subM(a, scaleM(lam, I))
    const value = shifted ? detM(shifted) : null
    const row: Fr[] = []
    for (let k = 0; k <= n; k++) row.push(fr(s ** k))
    row.push(value ?? fr(0))
    rows.push(row)
  }
  const { R, pivots } = rrefOf(rows, n + 1)
  const c: Fr[] = Array.from({ length: n + 1 }, () => fr(0))
  pivots.forEach((col, i) => {
    c[col] = R[i][n + 1]
  })
  return c
}

export function polyEval(c: Fr[], lam: Fr): Fr {
  let acc = fr(0)
  let pow = fr(1)
  for (const coeff of c) {
    acc = frAdd(acc, frMul(coeff, pow))
    pow = frMul(pow, lam)
  }
  return acc
}

/** The degree, ignoring zero coefficients that sit above it. */
export function polyDegree(c: Fr[]) {
  let d = -1
  c.forEach((v, i) => {
    if (!frIsZero(v)) d = i
  })
  return d
}

const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']

/** p(λ) written the way it would be on a board: −λ³ + 2λ² − λ + 4. */
export function polyStr(c: Fr[], v = 'λ') {
  const deg = polyDegree(c)
  if (deg < 0) return '0'
  const parts: string[] = []
  for (let k = deg; k >= 0; k--) {
    const coeff = c[k]
    if (frIsZero(coeff)) continue
    const neg = coeff.n < 0
    const mag = neg ? frNeg(coeff) : coeff
    const one = mag.n === 1 && mag.d === 1
    const body = k === 0 ? frStr(mag) : `${one ? '' : frStr(mag)}${v}${k === 1 ? '' : SUP[k]}`
    parts.push(`${parts.length === 0 ? (neg ? '−' : '') : neg ? ' − ' : ' + '}${body}`)
  }
  return parts.join('')
}

/* --------------------------------------------------------------------- roots */

export interface RealRoot {
  /** Set when the root is a whole number or a fraction; null when it is a surd. */
  exact: Fr | null
  value: number
  /** Exact display: `3`, `1/2`, or `(1 + √5)/2`. */
  text: string
  /** How many times it repeats as a root of the characteristic polynomial. */
  multiplicity: number
}

export interface ComplexRoot {
  re: number
  im: number
  text: string
}

export interface RootSet {
  real: RealRoot[]
  /** A conjugate pair, when one falls out — a rotation matrix is the deck's case. */
  complex: ComplexRoot[]
  /** False when the degree is above what this module factors by hand. */
  solved: boolean
}

/** √f as a fraction, or null when it is irrational. */
export function sqrtFr(f: Fr): Fr | null {
  if (f.n < 0) return null
  const rn = Math.round(Math.sqrt(f.n))
  const rd = Math.round(Math.sqrt(f.d))
  return rn * rn === f.n && rd * rd === f.d ? fr(rn, rd) : null
}

/** Pull the largest square out of a whole number: 12 → 2√3, so (2, 3). */
function simplifySurd(n: number): { outside: number; inside: number } {
  let outside = 1
  let inside = n
  for (let k = 2; k * k <= inside; k++) {
    while (inside % (k * k) === 0) {
      inside /= k * k
      outside *= k
    }
  }
  return { outside, inside }
}

function gcd3(a: number, b: number, c: number): number {
  const g = (x: number, y: number): number => (y === 0 ? Math.abs(x) : g(y, x % y))
  return g(g(a, b), c) || 1
}

/**
 * (p ± q√r) / s, tidied: the square pulled out of r, then the whole thing
 * divided by any factor common to p, q and s.
 */
function surdText(p: number, q: number, r: number, s: number, plus: boolean) {
  const { outside, inside } = simplifySurd(r)
  let a = p
  let b = q * outside
  let d = s
  const g = gcd3(a, b, d)
  a /= g
  b /= g
  d /= g
  if (d < 0) {
    a = -a
    b = -b
    d = -d
  }
  // A negative multiplier in front of the root is the other root of the pair,
  // so the ± swaps rather than a minus sign being printed inside the surd.
  if (b < 0) {
    b = -b
    plus = !plus
  }
  const sign = plus ? '+' : '−'
  const bodyB = b === 1 ? `√${inside}` : `${b}√${inside}`
  const body = a === 0 ? `${plus ? '' : '−'}${bodyB}` : `${a} ${sign} ${bodyB}`
  return d === 1 ? body : `(${body})/${d}`
}

/** Every rational p/q that could divide a polynomial with these coefficients. */
function rationalCandidates(c: Fr[]): Fr[] {
  const deg = polyDegree(c)
  // Clear denominators so the rational-root theorem applies to whole numbers.
  let lcm = 1
  for (const v of c) lcm = (lcm * v.d) / (gcdN(lcm, v.d) || 1)
  const ints = c.map((v) => Math.round(frNum(v) * lcm))
  // The rational-root theorem wants the lowest coefficient that is not zero:
  // a zero constant term just means 0 is itself a root, which is added below.
  const lowest = ints.find((v) => v !== 0) ?? 1
  const an = ints[deg]
  const ps = divisors(Math.abs(lowest))
  const qs = divisors(Math.abs(an))
  const out: Fr[] = []
  const seen = new Set<string>()
  const push = (f: Fr) => {
    const key = `${f.n}/${f.d}`
    if (!seen.has(key)) {
      seen.add(key)
      out.push(f)
    }
  }
  if (ints[0] === 0) push(fr(0))
  for (const p of ps)
    for (const q of qs) {
      push(fr(p, q))
      push(fr(-p, q))
    }
  return out
}

function gcdN(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function divisors(n: number) {
  const out: number[] = []
  for (let k = 1; k <= Math.abs(n); k++) if (n % k === 0) out.push(k)
  return out.length ? out : [1]
}

/** Divide p by (λ − r), exactly. Only called when r really is a root. */
function deflate(c: Fr[], r: Fr): Fr[] {
  const deg = polyDegree(c)
  const out: Fr[] = Array.from({ length: deg }, () => fr(0))
  let carry = c[deg]
  for (let k = deg - 1; k >= 0; k--) {
    out[k] = carry
    carry = frAdd(c[k], frMul(carry, r))
  }
  return out
}

function addRoot(list: RealRoot[], root: RealRoot) {
  const at = list.findIndex((x) =>
    x.exact && root.exact ? x.exact.n === root.exact.n && x.exact.d === root.exact.d : x.text === root.text
  )
  if (at === -1) list.push(root)
  else list[at] = { ...list[at], multiplicity: list[at].multiplicity + 1 }
}

/** Real roots (with multiplicity) and any conjugate pair, for degree 1, 2 or 3. */
export function realRoots(c: Fr[]): RootSet {
  const deg = polyDegree(c)
  const real: RealRoot[] = []
  const complex: ComplexRoot[] = []
  if (deg < 1) return { real, complex, solved: deg === 0 }
  if (deg > 3) return { real, complex, solved: false }

  let work = [...c]
  // Peel off rational roots until what is left is a quadratic or smaller.
  while (polyDegree(work) > 2) {
    const hit = rationalCandidates(work).find((cand) => frIsZero(polyEval(work, cand)))
    if (!hit) return { real, complex, solved: false }
    addRoot(real, { exact: hit, value: frNum(hit), text: frStr(hit), multiplicity: 1 })
    work = deflate(work, hit)
  }

  const d = polyDegree(work)
  if (d === 1) {
    const root = frNeg(frDiv(work[0], work[1]))
    addRoot(real, { exact: root, value: frNum(root), text: frStr(root), multiplicity: 1 })
    return { real, complex, solved: true }
  }

  const A = work[2]
  const B = work[1]
  const C = work[0]
  const disc = frSub(frMul(B, B), frMul(fr(4), frMul(A, C)))
  if (disc.n < 0) {
    const re = frNum(frNeg(frDiv(B, frMul(fr(2), A))))
    const im = Math.sqrt(-frNum(disc)) / Math.abs(2 * frNum(A))
    complex.push({ re, im, text: `${fmt(re)} + ${fmt(im)}i` }, { re, im: -im, text: `${fmt(re)} − ${fmt(im)}i` })
    return { real, complex, solved: true }
  }

  const exact = sqrtFr(disc)
  if (exact) {
    for (const sign of [1, -1]) {
      const root = frDiv(frAdd(frNeg(B), frMul(fr(sign), exact)), frMul(fr(2), A))
      addRoot(real, { exact: root, value: frNum(root), text: frStr(root), multiplicity: 1 })
    }
    return { real, complex, solved: true }
  }

  // Irrational but real. Clear denominators so the surd can be written tidily.
  const lcm = lcm3(A.d, B.d, C.d)
  const ai = Math.round(frNum(A) * lcm)
  const bi = Math.round(frNum(B) * lcm)
  const ci = Math.round(frNum(C) * lcm)
  const di = bi * bi - 4 * ai * ci
  for (const plus of [true, false]) {
    const value = (-bi + (plus ? 1 : -1) * Math.sqrt(di)) / (2 * ai)
    addRoot(real, { exact: null, value, text: surdText(-bi, 1, di, 2 * ai, plus), multiplicity: 1 })
  }
  return { real, complex, solved: true }
}

function lcm3(a: number, b: number, c: number) {
  const l = (x: number, y: number) => (x * y) / (gcdN(x, y) || 1)
  return l(l(a, b), c)
}

export function fmt(v: number, dp = 3) {
  if (!Number.isFinite(v)) return '—'
  const r = Number(v.toFixed(dp))
  return Object.is(r, -0) ? '0' : String(r)
}

/* ------------------------------------------------------------- eigenspaces */

export interface Eigenspace {
  /** A − λI, kept so a page can show what was row-reduced. */
  shifted: FMat
  rref: FMat
  rank: number
  /** One basis vector per free column. Its length is the geometric multiplicity. */
  basis: Fr[][]
  dim: number
}

/** The nullspace of M, as a basis of exact vectors. */
export function nullspaceBasis(m: FMat): Fr[][] {
  const n = m[0]?.length ?? 0
  const { R, pivots } = rrefOf(m)
  const free: number[] = []
  for (let c = 0; c < n; c++) if (!pivots.includes(c)) free.push(c)
  return free.map((f) => {
    const v: Fr[] = Array.from({ length: n }, () => fr(0))
    v[f] = fr(1)
    pivots.forEach((col, i) => {
      v[col] = frNeg(R[i][f])
    })
    return tidy(v)
  })
}

/**
 * Clear the denominators and make the first non-zero entry positive, so the
 * basis vector printed on the page is the one the lecture would have written
 * rather than the same direction wearing a fraction.
 */
export function tidy(v: Fr[]): Fr[] {
  let l = 1
  for (const x of v) l = (l * x.d) / (gcdN(l, x.d) || 1)
  const scaled = v.map((x) => fr(Math.round(frNum(x) * l)))
  let g = 0
  for (const x of scaled) g = gcdN(g, Math.abs(x.n))
  const div = g || 1
  const out = scaled.map((x) => fr(x.n / div))
  const first = out.find((x) => !frIsZero(x))
  return first && first.n < 0 ? out.map(frNeg) : out
}

/** Everything the deck does for one eigenvalue: shift, row-reduce, read off. */
export function eigenspaceOf(a: FMat, lam: Fr): Eigenspace {
  const n = nrows(a)
  const shifted = subM(a, scaleM(lam, identity(n))) ?? a
  const { R, rank } = rrefOf(shifted)
  const basis = nullspaceBasis(shifted)
  return { shifted, rref: R, rank, basis, dim: basis.length }
}

export const traceOf = (a: FMat): Fr => a.reduce((acc, row, i) => frAdd(acc, row[i]), fr(0))

/** Ax, for checking an eigenvector by substitution rather than by assertion. */
export function applyM(a: FMat, v: Fr[]): Fr[] {
  return a.map((row) => row.reduce((acc, x, j) => frAdd(acc, frMul(x, v[j])), fr(0)))
}

/** Is Av exactly λv? The honest test, done by substituting back. */
export function isEigenpair(a: FMat, v: Fr[], lam: Fr) {
  const av = applyM(a, v)
  return av.every((x, i) => frIsZero(frSub(x, frMul(lam, v[i]))))
}

export const vecStr = (v: Fr[]) => `(${v.map(frStr).join(', ')})`

export const symmetric = (a: FMat) => a.every((row, i) => row.every((v, j) => frIsZero(frSub(v, a[j][i]))))

/* ------------------------------------------------------------- Cholesky */

export interface Cholesky {
  ok: boolean
  L: number[][]
  /** Where it failed: the first diagonal whose square root would be of a negative. */
  failedAt: number
  /** L Lᵀ multiplied back out, so the page can check rather than claim. */
  back: number[][]
  maxResidual: number
}

/**
 * A = LLᵀ by the deck's own formulas on slide 30, generalised to n × n in the
 * obvious way: a diagonal is the square root of what is left after the squares
 * to its left, and an entry below it is its own leftover divided by the
 * diagonal above. Numeric, because a square root does not stay rational.
 */
export function cholesky(a: number[][]): Cholesky {
  const n = a.length
  const L = Array.from({ length: n }, () => Array.from({ length: n }, () => 0))
  let failedAt = -1
  for (let i = 0; i < n && failedAt === -1; i++) {
    for (let j = 0; j <= i; j++) {
      let s = 0
      for (let k = 0; k < j; k++) s += L[i][k] * L[j][k]
      if (i === j) {
        const under = a[i][i] - s
        if (under <= 0) {
          failedAt = i
          break
        }
        L[i][j] = Math.sqrt(under)
      } else {
        L[i][j] = (a[i][j] - s) / L[j][j]
      }
    }
  }
  const back = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let s = 0
      for (let k = 0; k < n; k++) s += L[i][k] * L[j][k]
      return s
    })
  )
  let maxResidual = 0
  if (failedAt === -1)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) maxResidual = Math.max(maxResidual, Math.abs(back[i][j] - a[i][j]))
  return { ok: failedAt === -1, L, failedAt, back, maxResidual }
}

/* -------------------------------------------------------- complex numbers */

/** Just enough complex arithmetic for the Hermitian slides. Parts stay exact. */
export interface Cx {
  re: Fr
  im: Fr
}

export const cx = (re: number, im = 0): Cx => ({ re: fr(re), im: fr(im) })
export const cxAdd = (a: Cx, b: Cx): Cx => ({ re: frAdd(a.re, b.re), im: frAdd(a.im, b.im) })
export const cxMul = (a: Cx, b: Cx): Cx => ({
  re: frSub(frMul(a.re, b.re), frMul(a.im, b.im)),
  im: frAdd(frMul(a.re, b.im), frMul(a.im, b.re)),
})
export const cxConj = (a: Cx): Cx => ({ re: a.re, im: frNeg(a.im) })
export const cxIsZero = (a: Cx) => frIsZero(a.re) && frIsZero(a.im)
export const cxEq = (a: Cx, b: Cx) => frIsZero(frSub(a.re, b.re)) && frIsZero(frSub(a.im, b.im))
/** |z|², which is what the Hermitian inner product turns each term into. */
export const cxModSq = (a: Cx): Fr => frAdd(frMul(a.re, a.re), frMul(a.im, a.im))

export function cxStr(a: Cx) {
  const re = frStr(a.re)
  if (frIsZero(a.im)) return re
  const mag = a.im.n < 0 ? frNeg(a.im) : a.im
  const body = mag.n === 1 && mag.d === 1 ? 'i' : `${frStr(mag)}i`
  if (frIsZero(a.re)) return a.im.n < 0 ? `−${body}` : body
  return `${re} ${a.im.n < 0 ? '−' : '+'} ${body}`
}

/** xᴴy — conjugate the first vector, then the ordinary sum of products. */
export function hermDot(x: Cx[], y: Cx[]): Cx {
  return x.reduce((acc, xi, i) => cxAdd(acc, cxMul(cxConj(xi), y[i])), cx(0))
}

/** xᵀx — the old definition, kept so slide 23 can show what goes wrong with it. */
export function plainDot(x: Cx[], y: Cx[]): Cx {
  return x.reduce((acc, xi, i) => cxAdd(acc, cxMul(xi, y[i])), cx(0))
}

/** Aᴴ: transpose, then conjugate every entry. */
export function cxConjTranspose(a: Cx[][]): Cx[][] {
  return Array.from({ length: a[0]?.length ?? 0 }, (_, i) => a.map((row) => cxConj(row[i])))
}

export function isHermitian(a: Cx[][]) {
  const h = cxConjTranspose(a)
  return a.every((row, i) => row.every((v, j) => cxEq(v, h[i][j])))
}

/* --------------------------------------------------- elimination, with the swaps counted */

export interface UpperResult {
  U: FMat
  /** How many row interchanges it took — the s in det(A) = (−1)ˢ det(U). */
  swaps: number
  /** The diagonal of U multiplied together. */
  product: Fr
}

/**
 * The downward sweep only, with the row interchanges counted rather than
 * thrown away. `refOnly` in `matrix.ts` does the same elimination but does not
 * report the swaps, and slide 9's whole argument turns on that count: it is the
 * only thing standing between det(U) and det(A).
 */
export function gaussUpper(a: FMat): UpperResult {
  const R = a.map((row) => [...row])
  const m = R.length
  const n = R[0]?.length ?? 0
  let swaps = 0
  let r = 0
  for (let c = 0; c < n && r < m; c++) {
    let p = -1
    for (let i = r; i < m; i++)
      if (!frIsZero(R[i][c])) {
        p = i
        break
      }
    if (p === -1) continue
    if (p !== r) {
      const t = R[p]
      R[p] = R[r]
      R[r] = t
      swaps++
    }
    for (let i = r + 1; i < m; i++) {
      if (frIsZero(R[i][c])) continue
      const k = frNeg(frDiv(R[i][c], R[r][c]))
      R[i] = R[i].map((v, j) => frAdd(v, frMul(k, R[r][j])))
    }
    r++
  }
  let product = fr(1)
  for (let i = 0; i < Math.min(m, n); i++) product = frMul(product, R[i][i])
  return { U: R, swaps, product }
}

/**
 * Sylvester's criterion: a symmetric matrix is positive definite exactly when
 * every leading principal minor is positive. Used to say whether Cholesky is
 * allowed before trying it, rather than finding out from a square root of a
 * negative number.
 */
export function leadingMinors(a: FMat): Fr[] {
  const n = nrows(a)
  const out: Fr[] = []
  for (let k = 1; k <= n; k++) {
    const sub = a.slice(0, k).map((row) => row.slice(0, k))
    out.push(detM(sub) ?? fr(0))
  }
  return out
}

export const isPositiveDefinite = (a: FMat) => symmetric(a) && leadingMinors(a).every((v) => v.n > 0)
