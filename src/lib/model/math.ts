import { kmData, lrData, pcData, type LabelledPoint, type Point } from './dataset'

/* ---------- linear regression ---------- */

/** Mean squared error of the line y = wx + b over the sample. */
export function mse(w: number, b: number) {
  let s = 0
  for (const p of lrData) {
    const e = w * p.x + b - p.y
    s += e * e
  }
  return s / lrData.length
}

/** The closed form — exactly what the "Snap to best fit" button computes. */
export function bestFit(): { w: number; b: number } {
  const n = lrData.length
  let sx = 0,
    sy = 0,
    sxy = 0,
    sxx = 0
  for (const p of lrData) {
    sx += p.x
    sy += p.y
    sxy += p.x * p.y
    sxx += p.x * p.x
  }
  const w = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  return { w, b: (sy - w * sx) / n }
}

/* ---------- gradient descent ---------- */

/** The bowl drawn on the chart. */
export const loss = (w: number) => (w - 3) * (w - 3) + 1
export const grad = (w: number) => 2 * (w - 3)

/* ---------- k-means ---------- */

/** Step 1: every point joins its nearest centroid. */
export function assignToCentroids(cents: Point[]): number[] {
  return kmData.map((p) => {
    let best = 0,
      bd = Infinity
    cents.forEach((c, i) => {
      const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2
      if (d < bd) {
        bd = d
        best = i
      }
    })
    return best
  })
}

/** Step 2: every centroid moves to the mean of its members. */
export function moveCentroids(assign: number[], cents: Point[]): Point[] {
  return cents.map((c, i) => {
    let sx = 0,
      sy = 0,
      n = 0
    kmData.forEach((p, j) => {
      if (assign[j] === i) {
        sx += p.x
        sy += p.y
        n++
      }
    })
    return n ? { x: sx / n, y: sy / n } : c
  })
}

/** Inertia: total squared distance from points to their own centroid. */
export function inertiaOf(assign: number[] | null, cents: Point[]) {
  if (!assign) return 0
  let total = 0
  kmData.forEach((p, j) => {
    const c = cents[assign[j]]
    if (c) total += (p.x - c.x) ** 2 + (p.y - c.y) ** 2
  })
  return total
}

/* ---------- perceptron ---------- */

export const PERCEPTRON_ETA = 0.1

export function predict(p: Point, w: number[], b: number) {
  return w[0] * p.x + w[1] * p.y + b >= 0 ? 1 : -1
}

/**
 * One full pass over the data.
 *
 * The misclassified set is recomputed *after* the epoch's updates land. Working
 * it out during the pass makes the accuracy, the "still wrong" count and the red
 * rings on the chart disagree with each other.
 */
/**
 * Which points this line gets wrong. A pure function of the line, deliberately:
 * the reader can drag the boundary as well as train it, and a stored count
 * would go on describing the line they moved away from.
 */
export function misclassified(w: number[], b: number) {
  const wrong: number[] = []
  pcData.forEach((p, i) => {
    if (predict(p, w, b) !== p.c) wrong.push(i)
  })
  return wrong
}

export function trainEpoch(w: number[], b: number): { w: number[]; b: number } {
  const nw = [...w]
  let nb = b
  pcData.forEach((p: LabelledPoint) => {
    if (predict(p, nw, nb) !== p.c) {
      nw[0] += PERCEPTRON_ETA * p.c * p.x
      nw[1] += PERCEPTRON_ETA * p.c * p.y
      nb += PERCEPTRON_ETA * p.c
    }
  })
  return { w: nw, b: nb }
}

export function accuracyOf(w: number[], b: number) {
  if (w[0] === 0 && w[1] === 0) return 0
  let correct = 0
  pcData.forEach((p) => {
    if (predict(p, w, b) === p.c) correct++
  })
  return correct / pcData.length
}
