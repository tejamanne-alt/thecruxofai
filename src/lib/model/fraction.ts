/**
 * Exact fractions, so row operations never produce 0.30000000000000004.
 *
 * Gaussian elimination divides constantly. In floating point the numbers turn
 * to noise within three steps and a beginner cannot tell a real answer from a
 * rounding error — which defeats the point of showing the working.
 */
export interface Fr {
  n: number
  d: number
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

export function fr(n: number, d = 1): Fr {
  if (d === 0) throw new Error('fraction with zero denominator')
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

export const frAdd = (a: Fr, b: Fr) => fr(a.n * b.d + b.n * a.d, a.d * b.d)
export const frSub = (a: Fr, b: Fr) => fr(a.n * b.d - b.n * a.d, a.d * b.d)
export const frMul = (a: Fr, b: Fr) => fr(a.n * b.n, a.d * b.d)
export const frDiv = (a: Fr, b: Fr) => fr(a.n * b.d, a.d * b.n)
export const frIsZero = (a: Fr) => a.n === 0
export const frEq = (a: Fr, b: Fr) => a.n === b.n && a.d === b.d
export const frNeg = (a: Fr) => fr(-a.n, a.d)
export const frNum = (a: Fr) => a.n / a.d

export function frStr(a: Fr) {
  return a.d === 1 ? String(a.n) : `${a.n}/${a.d}`
}

/** Reads "3", "-2", "1/3" or "-1/3". Returns null for anything else. */
export function frParse(text: string): Fr | null {
  const s = text.trim()
  if (!s) return null
  const m = /^(-?\d+)(?:\s*\/\s*(-?\d+))?$/.exec(s)
  if (!m) return null
  const d = m[2] === undefined ? 1 : Number(m[2])
  if (d === 0) return null
  return fr(Number(m[1]), d)
}
