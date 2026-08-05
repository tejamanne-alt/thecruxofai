/**
 * All sample data comes from one seeded PRNG so it is byte-identical on every
 * load. That matters for a revision tool: the numbers you memorised on Sunday
 * are the same numbers on exam day, and two people comparing screens see the
 * same chart.
 */

export interface Point {
  x: number
  y: number
}
export interface LabelledPoint extends Point {
  /** +1 or −1 */
  c: number
}

/** mulberry32 */
function makeRng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = makeRng(7)
/** Sum of four uniforms — near enough to a bell curve for scatter data. */
const gauss = () => (rng() + rng() + rng() + rng() - 2) * 1.15

function makeLinear(n: number): Point[] {
  const p: Point[] = []
  for (let i = 0; i < n; i++) {
    const x = 0.4 + rng() * 9.2
    p.push({ x, y: Math.max(1, 3 * x + 5 + gauss() * 3.2) })
  }
  return p
}

function makeBlobs(n: number): Point[] {
  const centres = [
    [3, 3.2],
    [7.6, 7.2],
    [7.2, 2.6],
  ]
  const p: Point[] = []
  for (let i = 0; i < n; i++) {
    const c = centres[i % 3]
    p.push({ x: c[0] + gauss() * 0.85, y: c[1] + gauss() * 0.85 })
  }
  return p
}

function makeClasses(n: number): LabelledPoint[] {
  const p: LabelledPoint[] = []
  for (let i = 0; i < n; i++) {
    const c = i % 2 ? 1 : -1
    p.push({ x: (c > 0 ? 7 : 3.3) + gauss() * 1.05, y: (c > 0 ? 7 : 3.5) + gauss() * 1.05, c })
  }
  return p
}

/** Order matters — the three draws share one stream, so keep them in this order. */
export const lrData: Point[] = makeLinear(30)
export const kmData: Point[] = makeBlobs(66)
export const pcData: LabelledPoint[] = makeClasses(44)

/** Seed centroids by picking k distinct real points, k-means style. */
export function seedCentroids(k: number): Point[] {
  const idx: number[] = []
  while (idx.length < k) {
    const i = Math.floor(rng() * kmData.length)
    if (!idx.includes(i)) idx.push(i)
  }
  return idx.map((i) => ({ x: kmData[i].x, y: kmData[i].y }))
}
