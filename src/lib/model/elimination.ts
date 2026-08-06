/**
 * Gaussian elimination, one elementary row operation at a time.
 *
 * The point of the lab is to watch a single step happen and see that the
 * answers did not change. So this exposes "what is the next single step?"
 * rather than a solve() that hands back a finished matrix.
 */
import { fr, frAdd, frDiv, frIsZero, frMul, frNeg, frStr, type Fr } from './fraction'

export type Row = Fr[]
export type Matrix = Row[]

export interface ElimState {
  rows: Matrix
  /** How many of the columns are variables; the rest are the right-hand side. */
  vars: number
  phase: 'forward' | 'back' | 'done'
  /** Where the forward sweep has got to. */
  pr: number
  pc: number
  /** Columns that turned out to hold a pivot, in order. */
  pivots: number[]
  /** Which pivot the backward sweep is clearing above. */
  bi: number
  history: string[]
}

export function startFrom(rows: number[][], vars: number): ElimState {
  return {
    rows: rows.map((r) => r.map((v) => fr(v))),
    vars,
    phase: 'forward',
    pr: 0,
    pc: 0,
    pivots: [],
    bi: -1,
    history: [],
  }
}

const rowLabel = (i: number) => `R${i + 1}`

/* ------------------------------------------------------- the three ERO moves */

export function swapRows(s: ElimState, i: number, j: number): ElimState {
  if (i === j) return s
  const rows = s.rows.map((r) => [...r])
  ;[rows[i], rows[j]] = [rows[j], rows[i]]
  return { ...s, rows, history: [...s.history, `${rowLabel(i)} ↔ ${rowLabel(j)}`] }
}

export function scaleRow(s: ElimState, i: number, k: Fr): ElimState {
  if (frIsZero(k)) return s
  const rows = s.rows.map((r, ri) => (ri === i ? r.map((v) => frMul(v, k)) : [...r]))
  return { ...s, rows, history: [...s.history, `${rowLabel(i)} ← ${frStr(k)} × ${rowLabel(i)}`] }
}

export function addRow(s: ElimState, i: number, k: Fr, j: number): ElimState {
  if (i === j || frIsZero(k)) return s
  const rows = s.rows.map((r, ri) => (ri === i ? r.map((v, c) => frAdd(v, frMul(k, s.rows[j][c]))) : [...r]))
  const sign = k.n < 0 ? '−' : '+'
  const mag = frStr(k.n < 0 ? frNeg(k) : k)
  return {
    ...s,
    rows,
    history: [...s.history, `${rowLabel(i)} ← ${rowLabel(i)} ${sign} ${mag} × ${rowLabel(j)}`],
  }
}

/* ------------------------------------------------------------- the next step */

/**
 * Works out the single next move and does it. Returning the same state means
 * the matrix is finished.
 */
export function step(s: ElimState): ElimState {
  if (s.phase === 'done') return s

  if (s.phase === 'forward') {
    if (s.pr >= s.rows.length || s.pc >= s.vars) {
      return { ...s, phase: 'back', bi: s.pivots.length - 1 }
    }
    const k = s.rows.findIndex((r, i) => i >= s.pr && !frIsZero(r[s.pc]))
    if (k === -1) {
      // Nothing to pivot on in this column, so its variable is free.
      return { ...s, pc: s.pc + 1 }
    }
    if (k !== s.pr) return swapRows(s, s.pr, k)

    const lead = s.rows[s.pr][s.pc]
    if (lead.n !== lead.d) return scaleRow(s, s.pr, frDiv(fr(1), lead))

    const below = s.rows.findIndex((r, i) => i > s.pr && !frIsZero(r[s.pc]))
    if (below !== -1) return addRow(s, below, frNeg(s.rows[below][s.pc]), s.pr)

    return { ...s, pivots: [...s.pivots, s.pc], pr: s.pr + 1, pc: s.pc + 1 }
  }

  // Backward sweep: clear everything above each pivot, turning the staircase
  // into a block of zeros with 1s down the steps.
  if (s.bi < 0) return { ...s, phase: 'done' }
  const col = s.pivots[s.bi]
  const above = s.rows.findIndex((r, i) => i < s.bi && !frIsZero(r[col]))
  if (above !== -1) return addRow(s, above, frNeg(s.rows[above][col]), s.bi)
  return { ...s, bi: s.bi - 1 }
}

/** Runs steps until nothing changes. The cap is a guard, never reached. */
export function runToEnd(s: ElimState): ElimState {
  let cur = s
  for (let i = 0; i < 400 && cur.phase !== 'done'; i++) cur = step(cur)
  return cur
}

/* -------------------------------------------------------------- reading it off */

/** The leading non-zero of each row, or -1 for a row of zeros. */
export function leadingCols(s: ElimState) {
  return s.rows.map((r) => {
    for (let c = 0; c < s.vars; c++) if (!frIsZero(r[c])) return c
    return -1
  })
}

export interface Verdict {
  kind: 'none' | 'one' | 'many' | 'unknown'
  headline: string
  detail: string
  freeVars: number[]
}

/**
 * Is the matrix in staircase shape yet? Counting pivots only tells you anything
 * once it is: before that, two rows can both start in column 0 and the count
 * comes out too low.
 */
export function isEchelon(s: ElimState) {
  const lead = leadingCols(s)
  let prev = -1
  let seenZeroRow = false
  for (const c of lead) {
    if (c === -1) {
      seenZeroRow = true
      continue
    }
    // A non-zero row below an all-zero one is not a staircase.
    if (seenZeroRow) return false
    if (c <= prev) return false
    prev = c
  }
  return true
}

export function verdictOf(s: ElimState): Verdict {
  const lead = leadingCols(s)
  // A row saying 0 = something-not-zero is a flat contradiction. That is safe
  // to call at any stage — it does not depend on the shape being tidy.
  const bad = s.rows.some((r, i) => lead[i] === -1 && r.slice(s.vars).some((v) => !frIsZero(v)))
  if (bad) {
    return {
      kind: 'none',
      headline: 'No answer at all',
      detail:
        'One row now reads 0 = a number that is not zero. That can never be true, so nothing satisfies all the equations at once.',
      freeVars: [],
    }
  }
  // Counting pivots on a matrix that is not yet a staircase would give a wrong
  // answer with a straight face, so say nothing instead.
  if (!isEchelon(s)) {
    return {
      kind: 'unknown',
      headline: 'Too early to say',
      detail:
        'The numbers are not in staircase shape yet, so counting pivots would give the wrong answer. Keep pressing “Next step”.',
      freeVars: [],
    }
  }
  const pivotCols = lead.filter((c) => c >= 0)
  const free: number[] = []
  for (let c = 0; c < s.vars; c++) if (!pivotCols.includes(c)) free.push(c)
  if (free.length === 0) {
    return {
      kind: 'one',
      headline: 'Exactly one answer',
      detail:
        'Every variable is pinned down by a step of the staircase, so there is one set of values and no choice about it.',
      freeVars: [],
    }
  }
  return {
    kind: 'many',
    headline: 'Endless answers',
    detail: `You can pick ${free.length === 1 ? 'one variable' : `${free.length} variables`} freely, and the rest are then forced. Every choice gives a different valid answer.`,
    freeVars: free,
  }
}

/** The current matrix written back out as equations. */
export function equationsOf(s: ElimState, names: string[]) {
  return s.rows.map((r) => {
    const parts: string[] = []
    for (let c = 0; c < s.vars; c++) {
      if (frIsZero(r[c])) continue
      const v = r[c]
      const sign = v.n < 0 ? '−' : parts.length ? '+' : ''
      const mag = frStr(v.n < 0 ? frNeg(v) : v)
      const coeff = mag === '1' ? '' : mag
      parts.push(`${sign}${sign ? ' ' : ''}${coeff}${names[c]}`)
    }
    const left = parts.length ? parts.join(' ') : '0'
    return `${left} = ${frStr(r[s.vars])}`
  })
}
