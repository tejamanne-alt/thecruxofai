'use client'

/**
 * Lecture 4, parts 19 and 20: the Cholesky factor, and the one thing the deck
 * says it is for.
 *
 * These two are numeric rather than exact, and deliberately so: a Cholesky
 * factor is built out of square roots, so pretending it stays rational would be
 * a lie. What the lab does instead is multiply L by its own transpose and print
 * the largest disagreement with A, so the reader is shown a check rather than
 * told an answer.
 */
import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Titled, Verdict } from '@/components/charts/matrix-ui'
import { ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, drawAxes, type Frame } from '@/lib/chart/frame'
import { cholesky, fmt } from '@/lib/model/eigen'
import { useState } from 'react'

function Claim({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/[0.08] bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

/** A read-only grid of ordinary numbers. */
function NumGrid({
  m,
  title,
  note,
  dp = 4,
  dim,
}: {
  m: number[][]
  title: string
  note?: string
  dp?: number
  dim?: (i: number, j: number) => boolean
}) {
  return (
    <Titled title={title} note={note}>
      <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
        {m.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((v, j) => (
              <span
                key={j}
                className="w-[64px] px-2 py-1.5 text-right font-mono text-[12.5px] tabular-nums"
                style={{ color: dim?.(i, j) ? '#d4d4d8' : '#27272a' }}
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

/* ========================================================================== */
/* Part 19 — A = LLᵀ                                                           */
/* ========================================================================== */

const CHOL_PRESETS: Array<{ id: string; label: string; m: number[][] }> = [
  {
    id: 'nice',
    label: 'a factor made of whole numbers',
    m: [
      [4, 2, -2],
      [2, 10, 2],
      [-2, 2, 6],
    ],
  },
  {
    id: 'roots',
    label: 'one that needs a real square root',
    m: [
      [4, 2, -2],
      [2, 10, 2],
      [-2, 2, 5],
    ],
  },
  {
    id: 'fail',
    label: 'not positive definite',
    m: [
      [4, 6, 0],
      [6, 4, 0],
      [0, 0, 2],
    ],
  },
]

export function CholeskyLab() {
  const [a, setA] = useState<number[][]>(CHOL_PRESETS[0].m)

  const ch = cholesky(a)
  const L = ch.L
  const sub = ['₁₁', '₂₁', '₂₂', '₃₁', '₃₂', '₃₃']

  // The deck's own six formulas on slide 30, with this matrix's numbers in them.
  const formulas = [
    { name: 'l₁₁', rhs: `√a₁₁ = √${a[0][0]}`, value: L[0][0] },
    { name: 'l₂₁', rhs: `a₂₁ / l₁₁ = ${a[1][0]} / ${fmt(L[0][0], 4)}`, value: L[1][0] },
    { name: 'l₃₁', rhs: `a₃₁ / l₁₁ = ${a[2][0]} / ${fmt(L[0][0], 4)}`, value: L[2][0] },
    { name: 'l₂₂', rhs: `√(a₂₂ − l₂₁²) = √(${a[1][1]} − ${fmt(L[1][0] ** 2, 4)})`, value: L[1][1] },
    {
      name: 'l₃₂',
      rhs: `(a₃₂ − l₃₁l₂₁) / l₂₂ = (${a[2][1]} − ${fmt(L[2][0] * L[1][0], 4)}) / ${fmt(L[1][1], 4)}`,
      value: L[2][1],
    },
    {
      name: 'l₃₃',
      rhs: `√(a₃₃ − (l₃₁² + l₃₂²)) = √(${a[2][2]} − ${fmt(L[2][0] ** 2 + L[2][1] ** 2, 4)})`,
      value: L[2][2],
    },
  ]

  /** Editing keeps A symmetric by writing the mirror entry at the same time. */
  const setSym = (i: number, j: number, v: number) =>
    setA(a.map((row, ri) => row.map((x, ci) => ((ri === i && ci === j) || (ri === j && ci === i) ? v : x))))

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {CHOL_PRESETS.map((p) => (
          <Chip key={p.id} on={JSON.stringify(p.m) === JSON.stringify(a)} label={p.label} onClick={() => setA(p.m)} />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type in the lower half — the mirror follows">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {a.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) =>
                  j <= i ? (
                    <input
                      key={j}
                      value={v}
                      inputMode="numeric"
                      aria-label={`A row ${i + 1} column ${j + 1}`}
                      onChange={(e) => {
                        const t = e.target.value.trim()
                        const n = t === '' || t === '-' ? 0 : Number(t)
                        if (Number.isFinite(n)) setSym(i, j, n)
                      }}
                      className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none hover:bg-zinc-950/[0.04]"
                    />
                  ) : (
                    <span
                      key={j}
                      className="w-[52px] px-2 py-1.5 text-right font-mono text-[13px] text-zinc-400 tabular-nums"
                    >
                      {v}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </Titled>

        {ch.ok ? (
          <>
            <NumGrid m={L} title="L" note="lower triangular" dim={(i, j) => j > i} />
            <NumGrid m={ch.back} title="LLᵀ" note="multiplied back out" dp={3} />
          </>
        ) : (
          <div className="pt-6">
            <div className="rounded-lg border border-red-600/30 bg-red-50 px-4 py-3 text-[13px]/[1.6] text-red-800">
              <strong>Stopped at row {ch.failedAt + 1}.</strong> The number under the square root came out at zero or
              below, so there is no real l{sub[0]} to take. That is not a bug in the arithmetic — it is what a matrix
              that is not positive definite does to this algorithm.
            </div>
          </div>
        )}
      </div>

      {ch.ok && (
        <Claim title="Slide 30’s six formulas, with these numbers in them">
          <div className="grid gap-2 sm:grid-cols-2">
            {formulas.map((f, i) => (
              <div
                key={i}
                className="rounded-md border border-zinc-950/[0.08] bg-zinc-50 px-3 py-2 font-mono text-[12.5px]"
              >
                <span className="text-zinc-500">{f.name} = </span>
                <span className="text-zinc-800">{f.rhs}</span>
                <span style={{ color: 'var(--acc)' }}> = {fmt(f.value, 4)}</span>
              </div>
            ))}
          </div>
        </Claim>
      )}

      <Verdict ok={ch.ok && ch.maxResidual < 1e-9}>
        {ch.ok
          ? `LLᵀ reproduces A: the largest disagreement between any entry of LLᵀ and the matching entry of A is ${ch.maxResidual.toExponential(1)}. That is the check, and it is done by multiplication rather than asserted.`
          : 'No factor exists for this matrix, so nothing is printed. The theorem asks for symmetric and positive definite, and this matrix fails the second half.'}
      </Verdict>

      <LabNote>
        Read the formulas as one rule applied down the matrix: a diagonal entry is the square root of whatever is left
        after the squares to its left are taken away, and an entry below the diagonal is its own leftover divided by the
        diagonal above it. Positive definiteness is exactly the promise that “whatever is left” never goes negative,
        which is why the theorem needs it and why the third preset stops dead.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 20 — sampling a multivariate Gaussian                                  */
/* ========================================================================== */

/**
 * A seeded generator, so the same settings always draw the same cloud. Two
 * readers comparing pages, and a verification run replaying one, should see the
 * same picture — which `Math.random` cannot promise.
 */
function normals(count: number, seed: number) {
  let s = seed * 9301 + 49297
  const next = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const out: Array<[number, number]> = []
  for (let i = 0; i < count; i++) {
    const u1 = Math.max(1e-9, next())
    const u2 = next()
    const r = Math.sqrt(-2 * Math.log(u1))
    out.push([r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)])
  }
  return out
}

export function GaussianSampleLab() {
  const [sd1, setSd1] = useState(1.6)
  const [sd2, setSd2] = useState(0.7)
  const [rho, setRho] = useState(0.6)
  const [seed, setSeed] = useState(7)
  const [show, setShow] = useState<'both' | 'z' | 'lz'>('both')

  const cov = [
    [sd1 * sd1, rho * sd1 * sd2],
    [rho * sd1 * sd2, sd2 * sd2],
  ]
  const ch = cholesky(cov)
  const L = ch.L
  const z = normals(320, seed)
  const lz: Array<[number, number]> = ch.ok
    ? z.map(([a, b]) => [L[0][0] * a + L[0][1] * b, L[1][0] * a + L[1][1] * b])
    : []

  // The sample covariance of what came out, so the page can compare rather than claim.
  const mean = lz.length
    ? [lz.reduce((s2, p) => s2 + p[0], 0) / lz.length, lz.reduce((s2, p) => s2 + p[1], 0) / lz.length]
    : [0, 0]
  const sampleCov = lz.length
    ? [0, 1].map((i) =>
        [0, 1].map((j) => lz.reduce((s2, p) => s2 + (p[i] - mean[i]) * (p[j] - mean[j]), 0) / (lz.length - 1))
      )
    : [
        [0, 0],
        [0, 0],
      ]

  const R = 5

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: -R,
      xmax: R,
      ymin: -R,
      ymax: R,
      xlab: 'first coordinate',
      ylab: 'second coordinate',
    })
    const acc = accentColour()

    if (show !== 'lz') {
      g.fillStyle = 'rgba(9,9,11,0.22)'
      for (const [a, b] of z) {
        g.beginPath()
        g.arc(f.px(a), f.py(b), 2.2, 0, Math.PI * 2)
        g.fill()
      }
    }
    if (show !== 'z' && ch.ok) {
      g.fillStyle = 'rgba(13,148,136,0.55)'
      for (const [a, b] of lz) {
        g.beginPath()
        g.arc(f.px(a), f.py(b), 2.6, 0, Math.PI * 2)
        g.fill()
      }
      // The one-standard-deviation ellipse: the unit circle sent through L.
      g.strokeStyle = acc
      g.lineWidth = 2
      g.beginPath()
      for (let k = 0; k <= 90; k++) {
        const t = (k / 90) * Math.PI * 2
        const a = Math.cos(t)
        const b = Math.sin(t)
        const x = L[0][0] * a + L[0][1] * b
        const y = L[1][0] * a + L[1][1] * b
        if (k === 0) g.moveTo(f.px(x), f.py(y))
        else g.lineTo(f.px(x), f.py(y))
      }
      g.stroke()
    }
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={show === 'z'} label="the round cloud z" onClick={() => setShow('z')} />
        <Chip on={show === 'lz'} label="the tilted cloud Lz" onClick={() => setShow('lz')} />
        <Chip on={show === 'both'} label="both" onClick={() => setShow('both')} />
        <Btn onClick={() => setSeed(seed + 1)}>draw a new sample</Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${sd1}-${sd2}-${rho}-${seed}-${show}`}
          caption="Grey dots are independent standard normals. Teal dots are the same dots after L. The ring is one standard deviation."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Slider
            label="standard deviation of the first"
            value={sd1}
            display={fmt(sd1, 2)}
            min={0.3}
            max={2.4}
            step={0.1}
            hint="How wide the cloud is left to right."
            onChange={(v) => setSd1(v)}
          />
          <Slider
            label="standard deviation of the second"
            value={sd2}
            display={fmt(sd2, 2)}
            min={0.3}
            max={2.4}
            step={0.1}
            hint="How tall it is."
            onChange={(v) => setSd2(v)}
          />
          <Slider
            label="correlation"
            value={rho}
            display={fmt(rho, 2)}
            min={-0.95}
            max={0.95}
            step={0.05}
            hint="How much the two lean together. At 0 the cloud stays square-on."
            onChange={(v) => setRho(v)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <NumGrid m={cov} title="Σ, the covariance you asked for" dp={3} />
        {ch.ok && <NumGrid m={L} title="L, its Cholesky factor" dp={3} dim={(i, j) => j > i} />}
        <NumGrid m={sampleCov} title="the covariance of the cloud that came out" dp={3} />
      </div>

      <ReadOutGrid
        items={[
          { label: 'samples drawn', value: String(z.length) },
          {
            label: 'largest gap, Σ against sample',
            value: fmt(Math.max(...cov.flatMap((row, i) => row.map((v, j) => Math.abs(v - sampleCov[i][j])))), 3),
          },
        ]}
      />

      <Verdict ok={ch.ok}>
        {ch.ok
          ? 'The grey cloud is round: two independent standard normals, which any language can produce in one line. Multiplying each point by L tilts and stretches it into the teal cloud, whose measured covariance sits close to the Σ you asked for. The gap above is sampling noise — press “draw a new sample” and watch it move about without settling anywhere in particular.'
          : 'That combination is not a valid covariance matrix, so it has no Cholesky factor and nothing can be sampled from it.'}
      </Verdict>

      <LabNote>
        Why it works, in one line: if z has covariance I, then Lz has covariance L·I·Lᵀ = LLᵀ = Σ. The Cholesky factor
        is the matrix that turns “easy to sample” into “the distribution you actually wanted”. Push the correlation
        slider to either end and the ellipse collapses towards a line — the matrix is heading for singular, which is
        exactly where positive definiteness, and with it the factor, is about to be lost.
      </LabNote>
    </LabBox>
  )
}
