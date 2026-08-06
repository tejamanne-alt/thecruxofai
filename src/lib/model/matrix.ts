/**
 * Matrix arithmetic done in exact fractions.
 *
 * Lecture 0a is full of determinants, inverses and row reduction. All three
 * divide, and in floating point the answers turn into 2.9999999999999996 within
 * a few steps. A beginner cannot tell that from a real answer, so every number
 * on the page is kept as a whole-number fraction from start to finish.
 */
import { fr, frAdd, frDiv, frIsZero, frMul, frNeg, frStr, frSub, type Fr } from './fraction'

export type FMat = Fr[][]

export const toFr = (m: number[][]): FMat => m.map((r) => r.map((v) => fr(v)))
export const cloneM = (m: FMat): FMat => m.map((r) => [...r])
export const nrows = (m: FMat) => m.length
export const ncols = (m: FMat) => m[0]?.length ?? 0
export const isSquare = (m: FMat) => nrows(m) > 0 && nrows(m) === ncols(m)

export function identity(n: number): FMat {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => fr(i === j ? 1 : 0)))
}

export function zerosM(m: number, n: number): FMat {
  return Array.from({ length: m }, () => Array.from({ length: n }, () => fr(0)))
}

export function onesM(m: number, n: number): FMat {
  return Array.from({ length: m }, () => Array.from({ length: n }, () => fr(1)))
}

export function sameShape(a: FMat, b: FMat) {
  return nrows(a) === nrows(b) && ncols(a) === ncols(b)
}

export function eqM(a: FMat, b: FMat) {
  if (!sameShape(a, b)) return false
  return a.every((row, i) => row.every((v, j) => v.n === b[i][j].n && v.d === b[i][j].d))
}

export function addM(a: FMat, b: FMat): FMat | null {
  if (!sameShape(a, b)) return null
  return a.map((row, i) => row.map((v, j) => frAdd(v, b[i][j])))
}

export function subM(a: FMat, b: FMat): FMat | null {
  if (!sameShape(a, b)) return null
  return a.map((row, i) => row.map((v, j) => frSub(v, b[i][j])))
}

export function scaleM(k: Fr, a: FMat): FMat {
  return a.map((row) => row.map((v) => frMul(k, v)))
}

/** Null when the shapes do not meet: the columns of A must match the rows of B. */
export function mulM(a: FMat, b: FMat): FMat | null {
  if (ncols(a) !== nrows(b)) return null
  return a.map((row) =>
    Array.from({ length: ncols(b) }, (_, k) => row.reduce((acc, v, l) => frAdd(acc, frMul(v, b[l][k])), fr(0)))
  )
}

/** The single number in row j, column k of AB, plus the pairs that made it. */
export function productCell(a: FMat, b: FMat, j: number, k: number) {
  const pairs = a[j].map((v, l) => ({ left: v, right: b[l][k], prod: frMul(v, b[l][k]) }))
  return { pairs, total: pairs.reduce((acc, p) => frAdd(acc, p.prod), fr(0)) }
}

export function transposeM(a: FMat): FMat {
  return Array.from({ length: ncols(a) }, (_, j) => a.map((row) => row[j]))
}

/** The matrix with row i and column j struck out. */
export function minorOf(a: FMat, i: number, j: number): FMat {
  return a.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j))
}

/** Cofactor expansion. Exact, and fine up to the 4 × 4s this lecture uses. */
export function detM(a: FMat): Fr | null {
  if (!isSquare(a)) return null
  const n = nrows(a)
  if (n === 1) return a[0][0]
  if (n === 2) return frSub(frMul(a[0][0], a[1][1]), frMul(a[0][1], a[1][0]))
  let acc = fr(0)
  for (let j = 0; j < n; j++) {
    if (frIsZero(a[0][j])) continue
    const sub = detM(minorOf(a, 0, j))
    if (!sub) return null
    const term = frMul(a[0][j], sub)
    acc = j % 2 === 0 ? frAdd(acc, term) : frSub(acc, term)
  }
  return acc
}

/** The signed minor, which is what "cofactor" means. */
export function cofactorOf(a: FMat, i: number, j: number): Fr | null {
  const m = detM(minorOf(a, i, j))
  if (!m) return null
  return (i + j) % 2 === 0 ? m : frNeg(m)
}

export interface RrefStep {
  /** What was done, in the lecture's own R notation. */
  note: string
  R: FMat
}

export interface RrefResult {
  R: FMat
  /** Which column each pivot landed in, in order. */
  pivots: number[]
  rank: number
  steps: RrefStep[]
  /** The matrix after the downward sweep only — row echelon form. */
  ref: FMat
}

/**
 * Full Gauss–Jordan, recording every move. `limitCols` stops the pivot hunt
 * before the right-hand side of an augmented matrix, so a contradiction row
 * survives instead of being pivoted away.
 */
export function rrefOf(a: FMat, limitCols?: number): RrefResult {
  const R = cloneM(a)
  const m = nrows(R)
  const n = ncols(R)
  const hunt = Math.min(limitCols ?? n, n)
  const pivots: number[] = []
  const steps: RrefStep[] = []
  const label = (i: number) => `R${i + 1}`

  let r = 0
  for (let c = 0; c < hunt && r < m; c++) {
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
      steps.push({ note: `${label(r)} ↔ ${label(p)}`, R: cloneM(R) })
    }

    const lead = R[r][c]
    if (!(lead.n === 1 && lead.d === 1)) {
      const k = frDiv(fr(1), lead)
      R[r] = R[r].map((v) => frMul(v, k))
      steps.push({ note: `${label(r)} ← ${frStr(k)} × ${label(r)}`, R: cloneM(R) })
    }

    for (let i = 0; i < m; i++) {
      if (i === r || frIsZero(R[i][c])) continue
      const k = frNeg(R[i][c])
      R[i] = R[i].map((v, j) => frAdd(v, frMul(k, R[r][j])))
      const sign = k.n < 0 ? '−' : '+'
      const mag = frStr(k.n < 0 ? frNeg(k) : k)
      steps.push({ note: `${label(i)} ← ${label(i)} ${sign} ${mag} × ${label(r)}`, R: cloneM(R) })
    }

    pivots.push(c)
    r++
  }

  // Row echelon form is the same staircase without the clearing above the
  // pivots, so it is cheaper to rebuild it than to run a second sweep.
  const ref = refOnly(a, hunt)
  return { R, pivots, rank: pivots.length, steps, ref }
}

/** The downward sweep on its own: leading entries in a staircase, zeros below. */
export function refOnly(a: FMat, limitCols?: number): FMat {
  const R = cloneM(a)
  const m = nrows(R)
  const n = ncols(R)
  const hunt = Math.min(limitCols ?? n, n)
  let r = 0
  for (let c = 0; c < hunt && r < m; c++) {
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
    }
    for (let i = r + 1; i < m; i++) {
      if (frIsZero(R[i][c])) continue
      const k = frNeg(frDiv(R[i][c], R[r][c]))
      R[i] = R[i].map((v, j) => frAdd(v, frMul(k, R[r][j])))
    }
    r++
  }
  return R
}

export function rankOf(a: FMat) {
  return rrefOf(a).rank
}

/** Null when the determinant is zero — that is the whole point of the test. */
export function inverseOf(a: FMat): FMat | null {
  if (!isSquare(a)) return null
  const n = nrows(a)
  const aug = a.map((row, i) => [...row, ...identity(n)[i]])
  const { R, rank } = rrefOf(aug, n)
  if (rank < n) return null
  return R.map((row) => row.slice(n))
}

/** Where the leading entry of each row sits, or -1 for a row of zeros. */
export function leadOf(m: FMat, limitCols?: number) {
  const hunt = Math.min(limitCols ?? ncols(m), ncols(m))
  return m.map((row) => {
    for (let c = 0; c < hunt; c++) if (!frIsZero(row[c])) return c
    return -1
  })
}

/** Is the matrix a proper staircase — every lead further right than the one above? */
export function isRef(m: FMat, limitCols?: number) {
  const lead = leadOf(m, limitCols)
  let prev = -1
  let seenZeroRow = false
  for (const c of lead) {
    if (c === -1) {
      seenZeroRow = true
      continue
    }
    if (seenZeroRow) return false
    if (c <= prev) return false
    prev = c
  }
  return true
}

/** REF, plus every lead is a 1 and its column is empty apart from that 1. */
export function isRref(m: FMat, limitCols?: number) {
  if (!isRef(m, limitCols)) return false
  const lead = leadOf(m, limitCols)
  return lead.every((c, i) => {
    if (c === -1) return true
    if (!(m[i][c].n === 1 && m[i][c].d === 1)) return false
    return m.every((row, r) => r === i || frIsZero(row[c]))
  })
}

/* ------------------------------------------------------- solving a system */

export interface Solution {
  kind: 'none' | 'one' | 'many'
  rankA: number
  rankAug: number
  /** One answer, with every free unknown set to 0. Empty when there is none. */
  particular: Fr[]
  /**
   * One direction per free unknown. Adding any amount of any of these to the
   * particular answer gives another answer, which is what "endless" means.
   */
  directions: Array<{ col: number; vec: Fr[] }>
  freeCols: number[]
  pivotCols: number[]
}

/** `aug` is the augmented matrix: `vars` columns of unknowns, then the right-hand side. */
export function solveSystem(aug: FMat, vars: number): Solution {
  const { R, pivots } = rrefOf(aug, vars)
  const rankA = pivots.length
  const rankAug = rrefOf(aug).rank
  const lead = leadOf(R, vars)
  const bad = R.some((row, i) => lead[i] === -1 && !frIsZero(row[vars]))

  const freeCols: number[] = []
  for (let c = 0; c < vars; c++) if (!pivots.includes(c)) freeCols.push(c)

  if (bad) return { kind: 'none', rankA, rankAug, particular: [], directions: [], freeCols, pivotCols: pivots }

  const particular = Array.from({ length: vars }, () => fr(0))
  pivots.forEach((c, i) => {
    particular[c] = R[i][vars]
  })

  const directions = freeCols.map((f) => {
    const vec = Array.from({ length: vars }, () => fr(0))
    vec[f] = fr(1)
    pivots.forEach((c, i) => {
      vec[c] = frNeg(R[i][f])
    })
    return { col: f, vec }
  })

  return {
    kind: freeCols.length === 0 ? 'one' : 'many',
    rankA,
    rankAug,
    particular,
    directions,
    freeCols,
    pivotCols: pivots,
  }
}

/** Does this list of values actually satisfy every row? Used to check, never to claim. */
export function checkSystem(aug: FMat, vars: number, x: Fr[]) {
  return aug.map((row) => {
    const lhs = row.slice(0, vars).reduce((acc, v, c) => frAdd(acc, frMul(v, x[c])), fr(0))
    return { lhs, rhs: row[vars], ok: frSub(lhs, row[vars]).n === 0 }
  })
}

/* --------------------------------------------------------------- printing */

export const cell = (v: Fr) => frStr(v)

export function matStr(m: FMat) {
  return m.map((row) => row.map(cell).join(' ')).join('; ')
}

/** Superscript-free variable names, e.g. x₁ x₂ x₃. */
export const sub = (n: number) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)])
export const varName = (i: number) => `x${sub(i + 1)}`
