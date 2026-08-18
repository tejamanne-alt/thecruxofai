'use client'

/**
 * Lecture 4, parts 6 to 12: the eigenvalue equation itself.
 *
 * Everything here is worked in exact fractions through `lib/model/eigen`, and
 * every eigenvector the page prints is checked by substituting it back into
 * Ax = λx rather than by being asserted. Where the deck gives an answer — the
 * all-ones matrix on slide 16, the shear on slide 17 — the lab computes that
 * same answer, so the page cannot drift away from the slide later.
 */
import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, arrow, drawAxes, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import {
  applyM,
  charPoly,
  eigenspaceOf,
  fmt,
  isEigenpair,
  isPositiveDefinite,
  leadingMinors,
  polyStr,
  realRoots,
  symmetric,
  traceOf,
  vecStr,
  type RealRoot,
} from '@/lib/model/eigen'
import { fr, frAdd, frMul, frNum, frStr, type Fr } from '@/lib/model/fraction'
import { detM, mulM, rankOf, toFr, transposeM, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

const edit = (m: number[][], i: number, j: number, v: number) =>
  m.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x)))

/** p(λ) as an ordinary number, for drawing the curve. */
function evalNum(c: Fr[], x: number) {
  let acc = 0
  let pow = 1
  for (const coeff of c) {
    acc += frNum(coeff) * pow
    pow *= x
  }
  return acc
}

function Claim({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-950/[0.08] bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{title}</div>
      {children}
    </div>
  )
}

/** One row of the four-equivalent-statements table. */
function Equiv({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[13px]/[1.6]">
      <span className="font-semibold" style={{ color: ok ? '#0d9488' : '#a1a1aa' }}>
        {ok ? '✓' : '✗'}
      </span>
      <span style={{ color: ok ? '#18181b' : '#71717a' }}>{children}</span>
    </div>
  )
}

/** The list of eigenvalues, with the exact form and the decimal side by side. */
function Spectrum({ roots, complexCount }: { roots: RealRoot[]; complexCount: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {roots.map((r, i) => (
        <span
          key={i}
          className="rounded-md border px-2.5 py-1.5 font-mono text-[12.5px]"
          style={{ borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }}
        >
          λ = {r.text}
          {r.exact === null ? ` ≈ ${fmt(r.value)}` : ''}
          {r.multiplicity > 1 ? ` (twice over${r.multiplicity > 2 ? ', three times' : ''})` : ''}
        </span>
      ))}
      {complexCount > 0 && (
        <span className="rounded-md border border-zinc-950/10 bg-zinc-50 px-2.5 py-1.5 font-mono text-[12.5px] text-zinc-600">
          {complexCount} complex
        </span>
      )}
      {roots.length === 0 && complexCount === 0 && <span className="text-[13px] text-zinc-500">none found</span>}
    </div>
  )
}

/* ========================================================================== */
/* Part 6 — the characteristic polynomial                                      */
/* ========================================================================== */

export function CharPolyLab() {
  const [g, setG] = useState<number[][]>([
    [2, 1, 0],
    [1, 3, 1],
    [0, 1, 2],
  ])
  const [lam, setLam] = useState(1.2)

  const A = toFr(g)
  const n = g.length
  const c = charPoly(A)
  const det = detM(A) ?? fr(0)
  const tr = traceOf(A)
  const roots = realRoots(c)

  const c0 = c[0]
  const cTop = c[n - 1]
  const expectedTop = fr((n - 1) % 2 === 0 ? tr.n : -tr.n, tr.d)
  const leading = c[n]

  const lo = -1
  const hi = 5
  const values = Array.from({ length: 200 }, (_, i) => evalNum(c, lo + ((hi - lo) * i) / 199))
  const vmax = Math.max(4, ...values.map(Math.abs))

  function draw(g2: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g2, W, H, { xmin: lo, xmax: hi, ymin: -vmax, ymax: vmax, xlab: 'λ', ylab: 'p(λ)' })
    const acc = accentColour()

    g2.strokeStyle = 'rgba(9,9,11,0.25)'
    g2.lineWidth = 1
    g2.beginPath()
    g2.moveTo(f.L, f.py(0))
    g2.lineTo(f.R, f.py(0))
    g2.stroke()

    g2.strokeStyle = acc
    g2.lineWidth = 2
    g2.beginPath()
    values.forEach((v, i) => {
      const x = lo + ((hi - lo) * i) / 199
      const px = f.px(x)
      const py = f.py(v)
      if (i === 0) g2.moveTo(px, py)
      else g2.lineTo(px, py)
    })
    g2.stroke()

    for (const r of roots.real) {
      if (r.value < lo || r.value > hi) continue
      g2.beginPath()
      g2.arc(f.px(r.value), f.py(0), 6, 0, Math.PI * 2)
      g2.fillStyle = '#0d9488'
      g2.fill()
      g2.fillStyle = '#0f766e'
      g2.textAlign = 'center'
      g2.fillText(r.text, f.px(r.value), f.py(0) - 16)
    }

    const at = evalNum(c, lam)
    g2.strokeStyle = 'rgba(9,9,11,0.3)'
    g2.setLineDash([4, 4])
    g2.beginPath()
    g2.moveTo(f.px(lam), f.py(0))
    g2.lineTo(f.px(lam), f.py(at))
    g2.stroke()
    g2.setLineDash([])
    grip(g2, f.px(lam), f.py(at), '#d97706', 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={320}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={JSON.stringify(g)}
          handles={(f) => [
            { id: 'lam', px: f.px(lam), py: f.py(evalNum(c, lam)), grab: 'anywhere', label: 'the value of lambda' },
          ]}
          onDragTo={(_id, x) => setLam(Math.round(Math.min(hi, Math.max(lo, x)) * 100) / 100)}
          caption="Press anywhere on the plot to move λ. The teal dots are the roots — the eigenvalues."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Titled title="A" note="type over anything">
            <NumBox m={g} width={44} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
          </Titled>
          <ReadOutGrid
            items={[
              { label: 'λ', value: fmt(lam, 2) },
              { label: 'p(λ)', value: fmt(evalNum(c, lam), 2) },
            ]}
          />
          <PanelNote>
            An eigenvalue is a place where this curve crosses zero. Drag λ onto a teal dot and the read-out goes to 0.
          </PanelNote>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-950 px-4 py-3 font-mono text-[14px] text-zinc-50">
        p<sub>A</sub>(λ) = det(A − λI) = {polyStr(c)}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Claim title="c₀ should be det A">
          <div className="font-mono text-[13px] text-zinc-800">
            c₀ = {frStr(c0)} · det A = {frStr(det)}
          </div>
          <PanelNote>Set λ = 0 in det(A − λI) and the λ vanishes, leaving det A. That is the whole proof.</PanelNote>
        </Claim>
        <Claim title={`c${n - 1} should be (−1)^${n - 1} tr A`}>
          <div className="font-mono text-[13px] text-zinc-800">
            c<sub>{n - 1}</sub> = {frStr(cTop)} · (−1)<sup>{n - 1}</sup> tr A = {frStr(expectedTop)}
          </div>
          <PanelNote>
            tr A = {frStr(tr)}. The only place a λ<sup>{n - 1}</sup> can come from is the product down the diagonal.
          </PanelNote>
        </Claim>
        <Claim title={`the top coefficient should be (−1)^${n}`}>
          <div className="font-mono text-[13px] text-zinc-800">
            c<sub>{n}</sub> = {frStr(leading)}
          </div>
          <PanelNote>
            A corollary of the same argument: the highest power also comes only from the diagonal product.
          </PanelNote>
        </Claim>
      </div>

      <Verdict ok={frStr(c0) === frStr(det) && frStr(cTop) === frStr(expectedTop) && Math.abs(frNum(leading)) === 1}>
        All three predictions on slide 12 hold for this matrix, and they keep holding as you type. Roots found:{' '}
        {roots.real.map((r) => r.text).join(', ') || 'none real'}
        {roots.complex.length ? `, plus ${roots.complex.length} complex` : ''}.
      </Verdict>

      <LabNote>
        The polynomial is worked out exactly, not fitted: the determinant is evaluated at four whole values of λ and the
        coefficients are solved for in fractions. That matters here — a double root computed in floating point arrives
        as two roots a hair apart, and that is precisely the case slide 22 needs you to be able to see.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 7 — the eigenvalue equation, by dragging                               */
/* ========================================================================== */

const SPAN = 4

export function EigenDefLab() {
  const [g, setG] = useState<number[][]>([
    [3, 1],
    [1, 3],
  ])
  const [ang, setAng] = useState(0.7)

  const A = toFr(g)
  const c = charPoly(A)
  const roots = realRoots(c)

  const x = { x: Math.cos(ang) * 2, y: Math.sin(ang) * 2 }
  const ax = { x: g[0][0] * x.x + g[0][1] * x.y, y: g[1][0] * x.x + g[1][1] * x.y }
  const lenX = Math.hypot(x.x, x.y)
  const lenAx = Math.hypot(ax.x, ax.y)
  const cosBetween = lenX * lenAx > 0 ? (x.x * ax.x + x.y * ax.y) / (lenX * lenAx) : 0
  const angleDeg = (Math.acos(Math.max(-1, Math.min(1, cosBetween))) * 180) / Math.PI
  // Parallel either way round counts: λ is allowed to be negative.
  const offBy = Math.min(angleDeg, 180 - angleDeg)
  const parallel = offBy < 0.6
  const lambdaHere = (cosBetween >= 0 ? 1 : -1) * (lenX > 0 ? lenAx / lenX : 0)

  function draw(g2: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g2, W, H, SPAN)
    const acc = accentColour()

    // The circle x rides on: one degree of freedom, so a press anywhere works.
    g2.strokeStyle = 'rgba(9,9,11,0.12)'
    g2.lineWidth = 1
    g2.beginPath()
    g2.arc(f.px(0), f.py(0), Math.abs(f.px(2) - f.px(0)), 0, Math.PI * 2)
    g2.stroke()

    // Every real eigendirection, drawn faintly so there is something to aim at.
    for (const r of roots.real) {
      if (r.exact === null) continue
      const es = eigenspaceOf(A, r.exact)
      for (const b of es.basis) {
        const bx = frNum(b[0])
        const by = frNum(b[1])
        const len = Math.hypot(bx, by) || 1
        const s = (SPAN / len) * 0.95
        g2.strokeStyle = 'rgba(13,148,136,0.35)'
        g2.lineWidth = 1.5
        g2.setLineDash([5, 5])
        g2.beginPath()
        g2.moveTo(f.px(-bx * s), f.py(-by * s))
        g2.lineTo(f.px(bx * s), f.py(by * s))
        g2.stroke()
        g2.setLineDash([])
      }
    }

    arrow(g2, f.px(0), f.py(0), f.px(ax.x), f.py(ax.y), parallel ? '#0d9488' : '#d97706', 2.5)
    arrow(g2, f.px(0), f.py(0), f.px(x.x), f.py(x.y), acc, 2.5)
    grip(g2, f.px(x.x), f.py(x.y), acc, 7)

    g2.fillStyle = acc
    g2.textAlign = 'left'
    g2.fillText('x', f.px(x.x) + 10, f.py(x.y) - 8)
    g2.fillStyle = parallel ? '#0f766e' : '#b45309'
    g2.fillText('Ax', f.px(ax.x) + 10, f.py(ax.y) - 8)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={JSON.stringify(g)}
          handles={(f) => [{ id: 'x', px: f.px(x.x), py: f.py(x.y), grab: 'anywhere', label: 'the direction of x' }]}
          onDragTo={(_id, px, py) => setAng(Math.atan2(py, px))}
          caption="Press anywhere to swing x round the circle. The dashed lines are the real eigendirections."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Titled title="A" note="type over anything">
            <NumBox m={g} width={46} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
          </Titled>
          <ReadOutGrid
            items={[
              { label: 'angle x to Ax', value: `${fmt(angleDeg, 1)}°` },
              { label: '‖Ax‖ / ‖x‖', value: fmt(lenAx / (lenX || 1), 3) },
            ]}
          />
          <div
            className="rounded-lg border p-3.5 text-[13px]/[1.6]"
            style={
              parallel
                ? { borderColor: 'rgba(13,148,136,0.35)', background: 'rgba(13,148,136,0.08)', color: '#115e59' }
                : { borderColor: 'rgba(9,9,11,0.1)', background: '#fff', color: '#52525b' }
            }
          >
            {parallel ? (
              <>
                <strong>On an eigenvector.</strong> Ax lies along x, and the stretch is λ ≈ {fmt(lambdaHere, 3)}.
              </>
            ) : (
              <>
                Ax has been turned {fmt(offBy, 1)}° away from x, so this x is not an eigenvector. Keep pressing round
                the circle.
              </>
            )}
          </div>
          <PanelNote>
            Nothing is snapped: the read-out is the real angle between the two arrows, so “nearly parallel” is reported
            as nearly, not as an answer.
          </PanelNote>
        </div>
      </div>

      <Claim title="The four equivalent statements on slide 15">
        <div className="flex flex-col gap-1.5">
          {roots.real.map((r, i) => {
            if (r.exact === null)
              return (
                <Equiv key={i} ok>
                  λ = {r.text} ≈ {fmt(r.value)} is a root of p(λ), so it is an eigenvalue — but it is irrational, so the
                  eigenvector is left to the decimal read-out above rather than printed as an exact vector.
                </Equiv>
              )
            const es = eigenspaceOf(A, r.exact)
            const d = detM(es.shifted) ?? fr(0)
            return (
              <Equiv key={i} ok>
                λ = {r.text}: det(A − λI) = {frStr(d)}, rank(A − λI) = {es.rank} which is below {g.length}, and (A −
                λI)x = 0 has the non-zero answer {es.basis.map(vecStr).join(' and ')}
                {es.basis.every((b) => isEigenpair(A, b, r.exact as Fr))
                  ? ' — substituted back and it checks out.'
                  : '.'}
              </Equiv>
            )
          })}
          {roots.real.length === 0 && (
            <Equiv ok={false}>
              No real λ makes det(A − λI) zero, so no real vector keeps its direction. Every x you drag gets turned.
            </Equiv>
          )}
        </div>
      </Claim>

      <LabNote>
        The four statements on slide 15 are one statement wearing four hats. “There is a non-zero x with Ax = λx” means
        “(A − λI)x = 0 has more than the zero answer”, which means “A − λI has a nullspace”, which means “it is short of
        full rank”, which means “its determinant is 0”. The last one is the only one you can compute directly, which is
        why it is the one used.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 8 — the deck's own worked example                                      */
/* ========================================================================== */

const DECK_A = [
  [1, 1],
  [1, 1],
]

const DECK_STEPS = [
  'Write down A − λI',
  'Take its determinant',
  'Set it to zero and solve',
  'λ = 0: find the nullspace',
  'λ = 2: find the nullspace',
  'Check both by substituting back',
]

export function DeckEigenLab() {
  const [step, setStep] = useState(0)

  const A = toFr(DECK_A)
  const c = charPoly(A)
  const zero = eigenspaceOf(A, fr(0))
  const two = eigenspaceOf(A, fr(2))

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          ← back
        </Btn>
        <Btn
          onClick={() => setStep(Math.min(DECK_STEPS.length - 1, step + 1))}
          disabled={step === DECK_STEPS.length - 1}
          primary
        >
          next step →
        </Btn>
        <span className="text-[12.5px] text-zinc-500">
          step {step + 1} of {DECK_STEPS.length} · {DECK_STEPS[step]}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="slide 16, fixed">
          <FrBox m={A} width={46} />
        </Titled>
        {step >= 0 && (
          <Titled title="A − λI">
            <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-1">
                  {[0, 1].map((j) => (
                    <span key={j} className="w-[62px] px-2 py-1.5 text-right font-mono text-[13px] text-zinc-800">
                      {i === j ? '1 − λ' : '1'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Titled>
        )}
      </div>

      {step >= 1 && (
        <Claim title="The characteristic polynomial">
          <div className="font-mono text-[14px] text-zinc-900">det(A − λI) = (1 − λ)² − 1</div>
          <PanelNote>
            Multiplied out that is {polyStr(c)}, which is what the exact solver gives independently — so the deck’s
            bracketed form and the expanded form are the same polynomial.
          </PanelNote>
        </Claim>
      )}

      {step >= 2 && (
        <Claim title="Setting it to zero">
          <div className="font-mono text-[14px] text-zinc-900">(1 − λ)² − 1 = 0 ⟹ (1 − λ)² = 1 ⟹ 1 − λ = ±1</div>
          <div className="mt-2 font-mono text-[14px]" style={{ color: 'var(--acc)' }}>
            λ = 0 and λ = 2
          </div>
          <PanelNote>
            The missing line the slide skips: 1 − λ = +1 gives λ = 0, and 1 − λ = −1 gives λ = 2. Both are wanted; a
            square root always has two signs.
          </PanelNote>
        </Claim>
      )}

      {step >= 3 && (
        <Claim title="λ = 0 — the nullspace of A itself">
          <div className="flex flex-wrap items-start gap-5">
            <Titled title="A − 0I">
              <FrBox m={zero.shifted} width={46} />
            </Titled>
            <Titled title="U, after elimination" note="the deck’s own U">
              <FrBox m={zero.rref} width={46} />
            </Titled>
            <div className="pt-6 font-mono text-[13px]" style={{ color: 'var(--acc)' }}>
              eigenvector {vecStr(zero.basis[0] ?? [])}
            </div>
          </div>
          <PanelNote>
            The row-reduced form is exactly the U on slide 16. It says x₁ + x₂ = 0, so x₂ = −x₁, and taking x₁ = 1 gives
            the vector the slide writes down.
          </PanelNote>
        </Claim>
      )}

      {step >= 4 && (
        <Claim title="λ = 2 — the nullspace of A − 2I">
          <div className="flex flex-wrap items-start gap-5">
            <Titled title="A − 2I">
              <FrBox m={two.shifted} width={46} />
            </Titled>
            <Titled title="after elimination">
              <FrBox m={two.rref} width={46} />
            </Titled>
            <div className="pt-6 font-mono text-[13px]" style={{ color: 'var(--acc)' }}>
              eigenvector {vecStr(two.basis[0] ?? [])}
            </div>
          </div>
          <PanelNote>
            Now the row says x₁ − x₂ = 0, so the two entries are equal. That is the second vector on the slide.
          </PanelNote>
        </Claim>
      )}

      {step >= 5 && (
        <Verdict ok={isEigenpair(A, zero.basis[0], fr(0)) && isEigenpair(A, two.basis[0], fr(2))}>
          Substituted back: A{vecStr(two.basis[0])} = 2 × {vecStr(two.basis[0])}, and A{vecStr(zero.basis[0])} = 0 ×{' '}
          {vecStr(zero.basis[0])}. Both hold exactly, in whole numbers, with no rounding anywhere.
        </Verdict>
      )}

      <LabNote>
        Notice what λ = 0 means: A sends that whole direction to the zero vector. An eigenvalue of 0 and a non-trivial
        nullspace are the same thing said twice, which is why det A = 0 and “0 is an eigenvalue” always arrive together.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 9 — the general procedure, and where it runs short                     */
/* ========================================================================== */

type ProcCase = 'ones' | 'shear' | 'rotation'

export function DefectiveLab() {
  const [which, setWhich] = useState<ProcCase>('shear')
  const [turn, setTurn] = useState(30)

  const rot = [
    [
      Math.round(Math.cos((turn * Math.PI) / 180) * 100) / 100,
      -Math.round(Math.sin((turn * Math.PI) / 180) * 100) / 100,
    ],
    [
      Math.round(Math.sin((turn * Math.PI) / 180) * 100) / 100,
      Math.round(Math.cos((turn * Math.PI) / 180) * 100) / 100,
    ],
  ]
  const g =
    which === 'ones'
      ? [
          [1, 1],
          [1, 1],
        ]
      : which === 'shear'
        ? [
            [0, 1],
            [0, 0],
          ]
        : rot

  // The rotation entries are rounded to two places for display, so the exact
  // solver is fed the rounded matrix the reader can actually see.
  const A = which === 'rotation' ? toFr(rot.map((r) => r.map((v) => Math.round(v * 100)))) : toFr(g)
  const scale = which === 'rotation' ? 100 : 1
  const c = charPoly(A)
  const roots = realRoots(c)

  const rows = roots.real.map((r) => {
    if (r.exact === null) return { r, geo: null as number | null, basis: [] as Fr[][] }
    const es = eigenspaceOf(A, r.exact)
    return { r, geo: es.dim, basis: es.basis }
  })
  const totalGeo = rows.reduce((acc, row) => acc + (row.geo ?? 0), 0)

  function draw(g2: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g2, W, H, 3)
    const acc = accentColour()
    // Twelve test directions, each drawn with where A sends it. A direction
    // that is kept is drawn teal — that is the whole question of the slide.
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * Math.PI * 2
      const vx = Math.cos(t) * 2
      const vy = Math.sin(t) * 2
      const wx = g[0][0] * vx + g[0][1] * vy
      const wy = g[1][0] * vx + g[1][1] * vy
      const lv = Math.hypot(vx, vy)
      const lw = Math.hypot(wx, wy)
      const cosb = lv * lw > 0 ? (vx * wx + vy * wy) / (lv * lw) : 0
      const deg = (Math.acos(Math.max(-1, Math.min(1, cosb))) * 180) / Math.PI
      const kept = lw > 1e-9 && Math.min(deg, 180 - deg) < 1
      g2.globalAlpha = 0.5
      arrow(g2, f.px(0), f.py(0), f.px(vx), f.py(vy), 'rgba(9,9,11,0.25)', 1.5)
      g2.globalAlpha = 1
      arrow(g2, f.px(0), f.py(0), f.px(wx), f.py(wy), kept ? '#0d9488' : acc, kept ? 2.5 : 1.5)
    }
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={which === 'ones'} label="the all-ones matrix" onClick={() => setWhich('ones')} />
        <Chip on={which === 'shear'} label="the shear on slide 17" onClick={() => setWhich('shear')} />
        <Chip on={which === 'rotation'} label="a rotation" onClick={() => setWhich('rotation')} />
      </div>

      {which === 'rotation' && (
        <div className="max-w-[340px]">
          <Slider
            label="turn"
            value={turn}
            display={`${turn}°`}
            min={0}
            max={180}
            step={15}
            hint="How far the matrix rotates the plane."
            onChange={(v) => setTurn(v)}
          />
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${which}-${turn}`}
          caption="Grey arrows go in, coloured arrows come out. A teal one has kept its direction."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Titled title="A">
            <NumBox m={g} width={52} readOnly name="A" />
          </Titled>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">p(λ)</div>
            <div className="font-mono text-[13px] text-zinc-900">
              {which === 'rotation' ? `${polyStr(c)}  (entries × ${scale})` : polyStr(c)}
            </div>
          </div>
          <Spectrum roots={roots.real} complexCount={roots.complex.length} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1.5 pr-4 font-semibold">λ</th>
              <th className="py-1.5 pr-4 font-semibold">how often it is a root</th>
              <th className="py-1.5 pr-4 font-semibold">dimension of its eigenspace</th>
              <th className="py-1.5 font-semibold">a basis for it</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-zinc-950/[0.06]">
                <td className="py-1.5 pr-4">{row.r.text}</td>
                <td className="py-1.5 pr-4">{row.r.multiplicity}</td>
                <td
                  className="py-1.5 pr-4"
                  style={{ color: row.geo !== null && row.geo < row.r.multiplicity ? '#dc2626' : '#0d9488' }}
                >
                  {row.geo ?? '—'}
                </td>
                <td className="py-1.5">{row.basis.map(vecStr).join(' , ') || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr className="border-t border-zinc-950/[0.06]">
                <td className="py-1.5 pr-4" colSpan={4}>
                  no real eigenvalues at all
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Verdict ok={totalGeo === A.length}>
        {which === 'shear' &&
          'λ = 0 is a root twice over, but the nullspace of A is only one-dimensional. So there is one eigenvector where two were wanted, and no basis of eigenvectors exists. The answer to the slide’s question is no: not every n × n matrix has n independent eigenvectors.'}
        {which === 'ones' &&
          'Two different eigenvalues, one eigenvector each, two in total — enough for a basis of the plane. Every vector in the plane can be written in terms of these two.'}
        {which === 'rotation' &&
          (roots.real.length === 0
            ? 'No real root, so no real vector survives with its direction intact — every output arrow above has been turned. But p(λ) still has two roots; they are just complex, and that is the answer to the slide’s point to ponder.'
            : 'At this angle the rotation is a half-turn or none at all, so every direction is kept — the whole plane is one eigenspace.')}
      </Verdict>

      <LabNote>
        The rotation case is the deck’s “point to ponder” on slide 17, and the slide leaves it open. Worked out here and
        checked by the same exact solver used everywhere else: a turn through θ has p(λ) = λ² − 2cos θ · λ + 1, whose
        discriminant is 4cos²θ − 4, and that is negative for every θ strictly between 0° and 180°. So the eigenvalues
        exist but are not real, and there is no real direction to draw. At exactly 0° and 180° the matrix is ±I and
        every direction is an eigenvector.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — the eigenspace and the spectrum                                   */
/* ========================================================================== */

const SPACE_CASES: Array<{ id: string; label: string; m: number[][]; lam: number }> = [
  {
    id: 'plane',
    label: 'a repeated λ with a whole plane',
    m: [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 5],
    ],
    lam: 2,
  },
  {
    id: 'identity',
    label: 'the identity',
    m: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    lam: 1,
  },
  {
    id: 'line',
    label: 'three separate λ, a line each',
    m: [
      [2, 3, 4],
      [0, 5, 6],
      [0, 0, 7],
    ],
    lam: 5,
  },
]

export function EigenspaceLab() {
  const [at, setAt] = useState(0)
  const [c1, setC1] = useState(2)
  const [c2, setC2] = useState(-1)

  const cs = SPACE_CASES[at]
  const A = toFr(cs.m)
  const lam = fr(cs.lam)
  const es = eigenspaceOf(A, lam)
  const roots = realRoots(charPoly(A))

  const coeffs = [c1, c2]
  const combo: Fr[] =
    es.basis.length === 0
      ? []
      : es.basis[0].map((_, i) => es.basis.reduce((acc, b, k) => frAdd(acc, frMul(fr(coeffs[k] ?? 0), b[i])), fr(0)))
  const comboImage = combo.length > 0 ? applyM(A, combo) : []
  const stillEigen = combo.length > 0 && isEigenpair(A, combo, lam)
  const isZero = combo.every((v) => v.n === 0)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {SPACE_CASES.map((s, i) => (
          <Chip key={s.id} on={i === at} label={s.label} onClick={() => setAt(i)} />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A">
          <FrBox m={A} width={44} />
        </Titled>
        <Titled title={`A − ${cs.lam}I`}>
          <FrBox m={es.shifted} width={44} />
        </Titled>
        <Titled title="row-reduced">
          <FrBox m={es.rref} width={44} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'rank(A − λI)', value: String(es.rank) },
              { label: 'dim Eλ', value: String(es.dim) },
            ]}
          />
        </div>
      </div>

      <Claim title="The spectrum of A — every eigenvalue it has">
        <Spectrum roots={roots.real} complexCount={roots.complex.length} />
      </Claim>

      {es.basis.length > 0 && (
        <Claim title={`Build any vector you like out of the basis of E${cs.lam}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Slider
              label="c₁"
              value={c1}
              display={String(c1)}
              min={-4}
              max={4}
              step={1}
              hint={`How much of ${vecStr(es.basis[0])} to take.`}
              onChange={(v) => setC1(v)}
            />
            {es.basis.length > 1 && (
              <Slider
                label="c₂"
                value={c2}
                display={String(c2)}
                min={-4}
                max={4}
                step={1}
                hint={`How much of ${vecStr(es.basis[1])} to take.`}
                onChange={(v) => setC2(v)}
              />
            )}
          </div>
          <div className="mt-3 font-mono text-[13px] text-zinc-800">
            x = {vecStr(combo)} · Ax = {vecStr(comboImage)} · {cs.lam}x = {vecStr(combo.map((v) => frMul(lam, v)))}
          </div>
          <Verdict ok={stillEigen}>
            {isZero
              ? 'Both coefficients are zero, so x is the zero vector. It satisfies Ax = λx, which is exactly why the zero vector has to be thrown in to make Eλ a subspace — and exactly why it is not itself called an eigenvector.'
              : stillEigen
                ? `Whatever you mix, the result still satisfies Ax = ${cs.lam}x. That is what "the eigenvectors span a subspace" means: you cannot fall out of Eλ by adding or by stretching.`
                : 'This combination is not in the eigenspace, which should be impossible — if you are seeing this, the basis is wrong.'}
          </Verdict>
        </Claim>
      )}

      <LabNote>
        Eλ is the nullspace of A − λI, and a nullspace is always a subspace — closed under adding and under stretching,
        and containing the zero vector. On the identity matrix there is one eigenvalue, λ = 1, and its eigenspace is the
        whole of R³: every direction is kept, so every canonical vector is a basis vector for it, exactly as slide 18
        says.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — transpose, nullspace, positive definite                           */
/* ========================================================================== */

type PropClaim = 'transpose' | 'posdef'

export function TransposeSpdLab() {
  const [claim, setClaim] = useState<PropClaim>('transpose')
  const [g, setG] = useState<number[][]>([
    [4, 5, 0],
    [0, 2, 3],
    [1, 0, 6],
  ])
  const [s, setS] = useState<number[][]>([
    [4, 2],
    [2, 3],
  ])

  const A = toFr(g)
  const At = transposeM(A)
  const cA = charPoly(A)
  const cAt = charPoly(At)
  const rA = realRoots(cA)
  const rAt = realRoots(cAt)
  const same = polyStr(cA) === polyStr(cAt)

  const S = toFr(s)
  const sym = symmetric(S)
  const minors = leadingMinors(S)
  const pd = isPositiveDefinite(S)
  const rootsS = realRoots(charPoly(S))
  const allPositive = rootsS.real.length > 0 && rootsS.real.every((r) => r.value > 0)

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip
          on={claim === 'transpose'}
          label="A and Aᵀ share their eigenvalues"
          onClick={() => setClaim('transpose')}
        />
        <Chip on={claim === 'posdef'} label="positive definite means positive λ" onClick={() => setClaim('posdef')} />
      </div>

      {claim === 'transpose' && (
        <>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="type over anything">
              <NumBox m={g} width={44} onEdit={(i, j, v) => setG(edit(g, i, j, v))} name="A" />
            </Titled>
            <Titled title="Aᵀ" note="rows and columns swapped">
              <FrBox m={At} width={44} />
            </Titled>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Claim title="p(λ) of A">
              <div className="font-mono text-[13px] text-zinc-900">{polyStr(cA)}</div>
              <div className="mt-2">
                <Spectrum roots={rA.real} complexCount={rA.complex.length} />
              </div>
            </Claim>
            <Claim title="p(λ) of Aᵀ">
              <div className="font-mono text-[13px] text-zinc-900">{polyStr(cAt)}</div>
              <div className="mt-2">
                <Spectrum roots={rAt.real} complexCount={rAt.complex.length} />
              </div>
            </Claim>
          </div>
          <Verdict ok={same}>
            {same
              ? 'The same polynomial, so the same roots, so the same eigenvalues — however you edit A. The proof is one line: transposing does not change a determinant, and (A − λI)ᵀ = Aᵀ − λI.'
              : 'The polynomials differ, which cannot happen for a real matrix — if you are seeing this, something is wrong.'}
          </Verdict>
          <LabNote>
            What is <strong>not</strong> claimed is that they share <strong>eigenvectors</strong>. Try it: the
            eigenvectors of Aᵀ are generally different, and the pairing between the two sets is what “left and right
            eigenvectors” means.
          </LabNote>
        </>
      )}

      {claim === 'posdef' && (
        <>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="type over anything — keep it symmetric">
              <NumBox m={s} width={46} onEdit={(i, j, v) => setS(edit(s, i, j, v))} name="A" />
            </Titled>
            <div className="pt-6">
              <ReadOutGrid
                items={[
                  { label: 'symmetric?', value: sym ? 'yes' : 'no' },
                  { label: 'leading minors', value: minors.map(frStr).join(', ') },
                ]}
              />
            </div>
          </div>
          <Claim title="Its eigenvalues">
            <Spectrum roots={rootsS.real} complexCount={rootsS.complex.length} />
          </Claim>
          <Verdict ok={pd === allPositive}>
            {pd
              ? 'Symmetric with every leading minor positive, so positive definite — and every eigenvalue above is positive and real, exactly as slide 19 promises.'
              : sym
                ? 'Symmetric but not positive definite: a leading minor has gone non-positive, and an eigenvalue has gone with it. The eigenvalues are still real, because symmetry alone is enough for that.'
                : 'Not symmetric any more, so neither promise on slide 19 applies. The eigenvalues can now be irrational or complex.'}
          </Verdict>
          <LabNote>
            Try setting the off-diagonal entries to 4 while leaving the diagonal at 4 and 3. The diagonal is still
            positive, but the second leading minor goes to 12 − 16 = −4, and a negative eigenvalue appears. A positive
            diagonal is not enough — that trap is worth a mark.
          </LabNote>
        </>
      )}
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — independence, and AᵀA                                             */
/* ========================================================================== */

type IndepClaim = 'independent' | 'gram'

export function GramMatrixLab() {
  const [claim, setClaim] = useState<IndepClaim>('gram')
  const [d, setD] = useState<number[][]>([
    [1, 2],
    [3, 1],
    [2, 4],
    [0, 1],
  ])
  const [e, setE] = useState<number[][]>([
    [3, 1],
    [0, 2],
  ])
  const [x1, setX1] = useState(2)
  const [x2, setX2] = useState(-1)

  const D = toFr(d)
  const Dt = transposeM(D)
  const G: FMat = mulM(Dt, D) ?? []
  const gramDet = detM(G) ?? fr(0)
  const rankD = rankOf(D)
  const rankG = rankOf(G)
  const x = [x1, x2]
  const Ax = D.map((row) => row.reduce((acc, v, j) => acc + frNum(v) * x[j], 0))
  const normSq = Ax.reduce((acc, v) => acc + v * v, 0)
  const quad = G.reduce((acc, row, i) => acc + x[i] * row.reduce((a2, v, j) => a2 + frNum(v) * x[j], 0), 0)

  const E = toFr(e)
  const rootsE = realRoots(charPoly(E))
  const vectors = rootsE.real.flatMap((r) => (r.exact ? eigenspaceOf(E, r.exact).basis : []))
  const stacked: FMat = vectors.length > 0 ? vectors[0].map((_, i) => vectors.map((v) => v[i])) : []
  const indepRank = stacked.length > 0 ? rankOf(stacked) : 0

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Chip on={claim === 'independent'} label="distinct λ ⟹ independent x" onClick={() => setClaim('independent')} />
        <Chip on={claim === 'gram'} label="AᵀA, and least squares" onClick={() => setClaim('gram')} />
      </div>

      {claim === 'independent' && (
        <>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="type over anything">
              <NumBox m={e} width={46} onEdit={(i, j, v) => setE(edit(e, i, j, v))} name="A" />
            </Titled>
            <div className="pt-6">
              <Spectrum roots={rootsE.real} complexCount={rootsE.complex.length} />
            </div>
          </div>
          {stacked.length > 0 && (
            <div className="flex flex-wrap items-start gap-6">
              <Titled title="the eigenvectors, as columns">
                <FrBox m={stacked} width={46} />
              </Titled>
              <div className="pt-6">
                <ReadOutGrid
                  items={[
                    { label: 'how many', value: String(vectors.length) },
                    { label: 'rank of that matrix', value: String(indepRank) },
                  ]}
                />
              </div>
            </div>
          )}
          <Verdict ok={vectors.length > 0 && indepRank === vectors.length}>
            {vectors.length === 0
              ? 'No exact real eigenvectors to stack for this matrix — the eigenvalues are irrational or complex, so nothing is printed rather than something rounded.'
              : indepRank === vectors.length
                ? `Rank ${indepRank} out of ${vectors.length} columns: none of them is a combination of the others, so they are independent.`
                : 'The rank has fallen below the number of columns, so these are not independent — which for distinct eigenvalues should be impossible.'}
          </Verdict>
          <LabNote>
            Slide 20 asks why. Suppose two eigenvectors with different eigenvalues were dependent, say y = cx. Then Ay =
            μy gives cAx = μcx, and Ax = λx gives cλx = μcx, so (λ − μ)cx = 0. With λ ≠ μ and x ≠ 0 the only escape is c
            = 0 — so they cannot have been dependent after all.
          </LabNote>
        </>
      )}

      {claim === 'gram' && (
        <>
          <div className="flex flex-wrap gap-2">
            <Btn
              onClick={() =>
                setD([
                  [1, 2],
                  [3, 1],
                  [2, 4],
                  [0, 1],
                ])
              }
            >
              reset
            </Btn>
            <Btn onClick={() => setD(d.map((r) => [r[0], 2 * r[0]]))}>make feature 2 = 2 × feature 1</Btn>
          </div>
          <div className="flex flex-wrap items-start gap-6">
            <Titled title="A" note="4 rows of data, 2 features">
              <NumBox m={d} width={44} onEdit={(i, j, v) => setD(edit(d, i, j, v))} name="A" />
            </Titled>
            <Titled title="AᵀA" note="always square, always symmetric">
              <FrBox m={G} width={52} />
            </Titled>
            <div className="pt-6">
              <ReadOutGrid
                items={[
                  { label: 'rank A', value: String(rankD) },
                  { label: 'rank AᵀA', value: String(rankG) },
                  { label: 'det AᵀA', value: frStr(gramDet) },
                  { label: 'symmetric?', value: symmetric(G) ? 'yes' : 'no' },
                ]}
              />
            </div>
          </div>

          <Claim title="xᵀAᵀAx is a squared length, so it cannot be negative">
            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="x₁"
                value={x1}
                display={String(x1)}
                min={-4}
                max={4}
                step={1}
                hint="First entry of the vector being tested."
                onChange={(v) => setX1(v)}
              />
              <Slider
                label="x₂"
                value={x2}
                display={String(x2)}
                min={-4}
                max={4}
                step={1}
                hint="Second entry."
                onChange={(v) => setX2(v)}
              />
            </div>
            <div className="mt-3">
              <ReadOutGrid
                items={[
                  { label: 'Ax', value: `(${Ax.map((v) => fmt(v, 2)).join(', ')})` },
                  { label: '‖Ax‖²', value: fmt(normSq, 3) },
                  { label: 'xᵀAᵀAx', value: fmt(quad, 3) },
                  { label: 'x', value: `(${x1}, ${x2})` },
                ]}
              />
            </div>
            <Verdict ok={Math.abs(normSq - quad) < 1e-9}>
              The two read-outs are the same number, because xᵀAᵀAx is (Ax)ᵀ(Ax) with the brackets moved. That is the
              whole proof of positive definiteness: a squared length is never negative, and it is zero only when Ax = 0,
              which full column rank forbids.
            </Verdict>
          </Claim>

          <Verdict ok={rankD === d[0].length}>
            {rankD === d[0].length
              ? `A has full column rank ${rankD}, so AᵀA is invertible and the least-squares answer (AᵀA)⁻¹Aᵀy exists.`
              : 'The second feature is now a copy of the first. rank A has dropped, det AᵀA has gone to 0, and the least-squares formula has no answer to give — this is what perfectly correlated features do to a regression.'}
          </Verdict>
        </>
      )}
    </LabBox>
  )
}
