/**
 * The summary numbers from ISM lecture 1.
 *
 * The quartile rule matters. There are several in use and they disagree, so
 * this file uses the one the lecture taught — position = k(n+1)/4, then read
 * between the two neighbouring values. On the lecture's own example
 * (11 12 13 16 16 17 17 18 21) it gives Q1 = 12.5 and Q3 = 17.5, which is what
 * the slide says. A different rule would quietly hand back different homework
 * answers.
 */

export interface Summary {
  n: number
  sorted: number[]
  mean: number
  median: number
  modes: number[]
  /** True when every value appears the same number of times, so no value stands out. */
  noMode: boolean
  min: number
  max: number
  range: number
  q1: number
  q3: number
  iqr: number
  /** Q3 − Q1, halved. The lecture calls this the quartile deviation. */
  qd: number
  lowerFence: number
  upperFence: number
  /** Values outside the 1.5 × IQR fences. */
  outliers: number[]
  /** Σ(x − mean)², the sum of squares. */
  ss: number
  /** Divided by n − 1, the way a sample is measured. */
  variance: number
  sd: number
  /** Divided by n, the way a whole population is measured. */
  popVariance: number
  popSd: number
  shape: 'symmetric' | 'right' | 'left'
}

/** Position p of the way along, counting positions as the lecture does. */
export function quantile(sorted: number[], p: number) {
  const n = sorted.length
  if (n === 0) return NaN
  if (n === 1) return sorted[0]
  const pos = p * (n + 1)
  if (pos <= 1) return sorted[0]
  if (pos >= n) return sorted[n - 1]
  const lo = Math.floor(pos)
  const frac = pos - lo
  return sorted[lo - 1] + frac * (sorted[lo] - sorted[lo - 1])
}

export function summarise(values: number[]): Summary {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const mean = n ? sorted.reduce((s, v) => s + v, 0) / n : NaN
  const median = quantile(sorted, 0.5)

  // How often each value turns up. Several values can tie for the top spot.
  const counts = new Map<number, number>()
  for (const v of sorted) counts.set(v, (counts.get(v) ?? 0) + 1)
  const top = Math.max(...counts.values())
  const modes = [...counts.entries()].filter(([, c]) => c === top).map(([v]) => v)
  const noMode = top === 1

  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  const lowerFence = q1 - 1.5 * iqr
  const upperFence = q3 + 1.5 * iqr

  const ss = sorted.reduce((s, v) => s + (v - mean) ** 2, 0)
  const variance = n > 1 ? ss / (n - 1) : 0
  const popVariance = n ? ss / n : 0

  // Which way the tail runs. A hair either side of the median is noise, so a
  // small gap counts as symmetric rather than being called a skew.
  const gap = mean - median
  const scale = Math.sqrt(variance) || 1
  const shape = Math.abs(gap) < 0.05 * scale ? 'symmetric' : gap > 0 ? 'right' : 'left'

  return {
    n,
    sorted,
    mean,
    median,
    modes,
    noMode,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    q1,
    q3,
    iqr,
    qd: iqr / 2,
    lowerFence,
    upperFence,
    outliers: sorted.filter((v) => v < lowerFence || v > upperFence),
    ss,
    variance,
    sd: Math.sqrt(variance),
    popVariance,
    popSd: Math.sqrt(popVariance),
    shape,
  }
}

/** Round for display without printing 3.0000000000000004. */
export function show(v: number, dp = 2) {
  if (!isFinite(v)) return '—'
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  return Number.isInteger(r) ? String(r) : r.toFixed(dp)
}

/* ----------------------------------------------------- the lecture's datasets */

export const ISM_DATA = {
  gettingReady: {
    name: 'Time to get ready (10 days)',
    unit: 'minutes',
    values: [39, 29, 43, 52, 39, 44, 40, 31, 44, 35],
    note: 'The lecture uses this for both the mean and the median.',
  },
  serverFails: {
    name: 'Server failures per day (2 weeks)',
    unit: 'failures',
    values: [1, 3, 0, 3, 26, 2, 7, 4, 2, 3, 3, 6, 3],
    note: 'The mode is 3, which turns up five times.',
  },
  ordered: {
    name: 'The quartile example',
    unit: '',
    values: [11, 12, 13, 16, 16, 17, 17, 18, 21],
    note: 'The slide works this one out: Q1 = 12.5, Q3 = 17.5, IQR = 5.',
  },
  groupOne: {
    name: 'Group 1',
    unit: '',
    values: [2, 8, 5, 3, 7, 8, 5, 2, 5],
    note: 'Mean 5, median 5, mode 5.',
  },
  groupTwo: {
    name: 'Group 2',
    unit: '',
    values: [1, 15, 5, 5, 6, 3, 5, 2, 3],
    note: 'Also mean 5, median 5, mode 5 — but spread out very differently.',
  },
  funds: {
    name: 'Three-year fund returns',
    unit: '%',
    values: [19.0, 20.8, 22.3, 22.4, 24.9, 26.0, 29.9],
    note: 'Seven values, so the median is simply the 4th one.',
  },
  noise: {
    name: 'Office noise levels (77 people)',
    unit: 'dBA',
    values: [
      55.3, 55.3, 55.3, 55.9, 55.9, 55.9, 55.9, 56.1, 56.1, 56.1, 56.1, 56.1, 56.1, 56.8, 56.8, 57.0, 57.0, 57.0, 57.8,
      57.8, 57.8, 57.9, 57.9, 57.9, 58.8, 58.8, 58.8, 59.8, 59.8, 59.8, 62.2, 62.2, 63.8, 63.8, 63.8, 63.9, 63.9, 63.9,
      64.7, 64.7, 64.7, 65.1, 65.1, 65.1, 65.3, 65.3, 65.3, 65.3, 67.4, 67.4, 67.4, 67.4, 68.7, 68.7, 68.7, 68.7, 69.0,
      70.4, 70.4, 71.2, 71.2, 71.2, 73.0, 73.0, 73.1, 73.1, 74.6, 74.6, 74.6, 74.6, 79.3, 79.3, 79.3, 79.3, 83.0, 83.0,
      83.0,
    ],
    note: 'Practice question 1.',
  },
  chickenFat: {
    name: 'Fat in chicken sandwiches (20)',
    unit: 'grams',
    values: [7, 8, 4, 5, 16, 20, 20, 24, 19, 30, 23, 30, 25, 19, 29, 29, 30, 30, 40, 56],
    note: 'Practice question 2.',
  },
  battery: {
    name: 'Camera battery life (12)',
    unit: 'shots',
    values: [300, 180, 85, 170, 380, 460, 260, 35, 380, 120, 110, 240],
    note: 'Practice question 3.',
  },
  scores: {
    name: 'The 20-value set',
    unit: '',
    values: [82, 45, 64, 80, 82, 74, 79, 80, 80, 78, 80, 80, 48, 73, 80, 79, 81, 70, 78, 73],
    note: 'Practice question 4. Watch what 45 and 48 do to it.',
  },
} as const

export type IsmDataKey = keyof typeof ISM_DATA
