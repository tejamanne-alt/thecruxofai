'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid } from '@/components/sessions/session-parts'
import { accentColour, arrow, clamp, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { frStr } from '@/lib/model/fraction'
import { detM, isSquare, minorOf, mulM, toFr, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

const round1 = (v: number) => Math.round(v * 2) / 2

/* ========================================================================== */
/* Part 12a — the 2 × 2 determinant is an area                                */
/* ========================================================================== */

const SPAN = 5

export function Det2Lab() {
  const [c1, setC1] = useState({ x: 3, y: 2 })
  const [c2, setC2] = useState({ x: 5, y: 4 })

  const a = c1.x
  const c = c1.y
  const b = c2.x
  const d = c2.y
  const det = a * d - b * c

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    g.beginPath()
    g.moveTo(f.px(0), f.py(0))
    g.lineTo(f.px(a), f.py(c))
    g.lineTo(f.px(a + b), f.py(c + d))
    g.lineTo(f.px(b), f.py(d))
    g.closePath()
    g.fillStyle = det > 0 ? 'rgba(13,148,136,0.18)' : det < 0 ? 'rgba(220,38,38,0.16)' : 'rgba(9,9,11,0.1)'
    g.fill()
    g.strokeStyle = det >= 0 ? 'rgba(13,148,136,0.6)' : 'rgba(220,38,38,0.6)'
    g.lineWidth = 1.5
    g.stroke()

    arrow(g, f.px(0), f.py(0), f.px(a), f.py(c), acc, 2.5)
    arrow(g, f.px(0), f.py(0), f.px(b), f.py(d), '#d97706', 2.5)
    grip(g, f.px(a), f.py(c), acc, 7)
    grip(g, f.px(b), f.py(d), '#d97706', 7)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          handles={(f) => [
            { id: 'c1', px: f.px(a), py: f.py(c) },
            { id: 'c2', px: f.px(b), py: f.py(d) },
          ]}
          onDragTo={(id, x, y) => {
            const p = { x: round1(clamp(x, -SPAN, SPAN)), y: round1(clamp(y, -SPAN, SPAN)) }
            if (id === 'c1') setC1(p)
            else setC2(p)
          }}
          caption="Drag either arrow tip. The shaded shape is the box the two columns of A make."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Titled title="A">
            <NumBox
              m={[
                [a, b],
                [c, d],
              ]}
              width={48}
              onEdit={(i, j, v) => {
                const w = clamp(v, -SPAN, SPAN)
                if (j === 0) setC1(i === 0 ? { ...c1, x: w } : { ...c1, y: w })
                else setC2(i === 0 ? { ...c2, x: w } : { ...c2, y: w })
              }}
            />
          </Titled>
          <ReadOutGrid
            items={[
              { label: 'ad', value: String(a * d) },
              { label: 'bc', value: String(b * c) },
              { label: 'det = ad − bc', value: String(det) },
              { label: 'area', value: String(Math.abs(det)) },
            ]}
          />
          <PanelNote>
            The two columns of A are the two arrows. The determinant is the area of the box they make — with a minus
            sign when the orange arrow has swung round past the coloured one.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={det !== 0}>
        {det !== 0
          ? `det A = ${det}. Not zero, so A has an inverse and the two arrows really do point in different directions.`
          : 'det A = 0. The box has collapsed to a line — the two arrows are pointing along the same direction, so one column tells you nothing the other did not. This is exactly when the inverse does not exist.'}
      </Verdict>

      <LabNote>
        Try to flatten it. Drag one arrow until it lies along the other and the shaded area disappears. The moment it
        does, the determinant hits 0. Everything the lecture says about “det ≠ 0 means invertible” is that picture.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12b — the 3 × 3 rule, term by term                                    */
/* ========================================================================== */

export function Det3Lab() {
  const [g, setG] = useState<number[][]>([
    [1, 2, 3],
    [0, 4, 5],
    [1, 0, 6],
  ])
  const [term, setTerm] = useState(0)

  const A = toFr(g)
  const det = detM(A)
  const terms = [0, 1, 2].map((j) => {
    const minor = minorOf(A, 0, j)
    const md = detM(minor)!
    const signed = j % 2 === 0 ? 1 : -1
    return {
      j,
      head: g[0][j],
      minor,
      md,
      value: signed * g[0][j] * (md.n / md.d),
      sign: signed > 0 ? '+' : '−',
    }
  })

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {g.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => {
                  const struck = i === 0 || j === term
                  const head = i === 0 && j === term
                  return (
                    <input
                      key={j}
                      value={v}
                      inputMode="numeric"
                      aria-label={`row ${i + 1} column ${j + 1}`}
                      onChange={(e) => {
                        const n =
                          e.target.value.trim() === '' || e.target.value.trim() === '-' ? 0 : Number(e.target.value)
                        if (Number.isFinite(n)) setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? n : x))))
                      }}
                      onFocus={() => i === 0 && setTerm(j)}
                      className="w-[48px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none"
                      style={
                        head
                          ? { background: 'var(--acc)', color: '#fff', fontWeight: 700 }
                          : struck
                            ? { color: '#d4d4d8' }
                            : undefined
                      }
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </Titled>
        <div className="pt-6">
          <Presets items={[0, 1, 2].map((j) => ({ id: j, label: `term ${j + 1}` }))} at={term} onPick={setTerm} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Titled title={`Strike out row 1 and column ${term + 1}`}>
              <FrBox m={terms[term].minor} width={44} />
            </Titled>
            <div className="pt-6 font-mono text-[13px] text-zinc-700">= {frStr(terms[term].md)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">The whole sum</div>
        <div className="overflow-x-auto font-mono text-[13px]/[1.9] text-zinc-800">
          det A ={' '}
          {terms.map((t, i) => (
            <span key={t.j} style={t.j === term ? { color: 'var(--acc)', fontWeight: 700 } : undefined}>
              {i > 0 ? ` ${t.sign} ` : t.sign === '−' ? '− ' : ''}
              {t.head}×({frStr(t.md)})
            </span>
          ))}{' '}
          ={' '}
          {terms
            .map((t, i) => `${i > 0 ? (t.value < 0 ? '− ' : '+ ') : t.value < 0 ? '− ' : ''}${Math.abs(t.value)}`)
            .join(' ')}{' '}
          = <strong>{det ? frStr(det) : '—'}</strong>
        </div>
      </div>

      <LabNote>
        Walk along the top row. For each number, cross out its row and its column, work out the little 2 × 2 determinant
        that is left, and multiply. Then <strong>add, subtract, add</strong> — the signs alternate, and that alternating
        is the only bit people forget. Press the three buttons to see each term on its own.
      </LabNote>
      <LabNote>
        The lecture’s own example is loaded: 1(24) − 2(−5) + 3(−4) = 24 + 10 − 12 = <strong>22</strong>.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13a — cofactor expansion, and choosing a cheap row                    */
/* ========================================================================== */

const BIG: number[][] = [
  [1, 0, 2, -1],
  [3, 0, 0, 5],
  [2, 1, 4, -3],
  [1, 0, 5, 0],
]

export function CofactorLab() {
  const [g, setG] = useState<number[][]>(BIG)
  const [along, setAlong] = useState<{ kind: 'row' | 'col'; at: number }>({ kind: 'row', at: 0 })

  const A = toFr(g)
  const n = g.length
  const det = detM(A)

  const entries = Array.from({ length: n }, (_, k) => {
    const i = along.kind === 'row' ? along.at : k
    const j = along.kind === 'row' ? k : along.at
    const md = detM(minorOf(A, i, j))!
    const signPos = (i + j) % 2 === 0
    return { i, j, head: g[i][j], md, signPos, value: (signPos ? 1 : -1) * g[i][j] * (md.n / md.d) }
  })
  const zeros = entries.filter((e) => e.head === 0).length

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: n }, (_, r) => (
          <Chip
            key={`r${r}`}
            on={along.kind === 'row' && along.at === r}
            label={`along row ${r + 1}`}
            onClick={() => setAlong({ kind: 'row', at: r })}
          />
        ))}
        {Array.from({ length: n }, (_, c) => (
          <Chip
            key={`c${c}`}
            on={along.kind === 'col' && along.at === c}
            label={`down column ${c + 1}`}
            onClick={() => setAlong({ kind: 'col', at: c })}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox
            m={g}
            width={46}
            markRow={along.kind === 'row' ? along.at : null}
            markCol={along.kind === 'col' ? along.at : null}
            onEdit={(i, j, v) => setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))}
          />
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">det A</div>
            <div className="text-[32px] font-semibold" style={{ color: 'var(--acc)' }}>
              {det ? frStr(det) : '—'}
            </div>
            <div className="text-[12px] text-zinc-500">
              {zeros > 0 ? `${zeros} of the ${n} terms are free — the entry is 0` : 'every term has to be worked out'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {entries.map((e, k) => (
          <div
            key={k}
            className="rounded-lg border p-3"
            style={
              e.head === 0
                ? { borderColor: 'rgba(9,9,11,0.08)', background: '#fafafa', opacity: 0.6 }
                : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff' }
            }
          >
            <div className="mb-1.5 font-mono text-[12px] text-zinc-500">
              {e.signPos ? '+' : '−'} a
              <sub>
                {e.i + 1}
                {e.j + 1}
              </sub>{' '}
              × M
              <sub>
                {e.i + 1}
                {e.j + 1}
              </sub>
            </div>
            <FrBox m={minorOf(A, e.i, e.j)} width={40} />
            <div className="mt-1.5 font-mono text-[12.5px] text-zinc-800">
              {e.head} × ({frStr(e.md)}) →{' '}
              <strong>
                {e.value >= 0 ? '+' : '−'}
                {Math.abs(e.value)}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <LabNote>
        You may expand along <strong>any</strong> row or column you like and the answer never changes. So pick the one
        with the most zeros — every zero kills a whole 3 × 3 determinant you would otherwise have to work out. Column 2
        here has three zeros, which turns four small determinants into one.
      </LabNote>
      <LabNote>
        The sign is <span className="font-mono">(−1)</span> to the power of (row + column). That gives the checkerboard
        + − + − starting from the top-left, and the signed minor has its own name: the <strong>cofactor</strong>.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13b — the fast way: row-reduce, then multiply the diagonal            */
/* ========================================================================== */

const TRI_SCRIPT: Array<{ note: string; m: number[][]; swaps: number }> = [
  {
    note: 'as given',
    swaps: 0,
    m: [
      [1, 1, 0, 2],
      [2, 3, 1, 4],
      [1, 0, 2, 1],
      [3, 4, 1, 7],
    ],
  },
  {
    note: 'R2 ← R2 − 2R1,  R3 ← R3 − R1,  R4 ← R4 − 3R1',
    swaps: 0,
    m: [
      [1, 1, 0, 2],
      [0, 1, 1, 0],
      [0, -1, 2, -1],
      [0, 1, 1, 1],
    ],
  },
  {
    note: 'R3 ← R3 + R2,  R4 ← R4 − R2',
    swaps: 0,
    m: [
      [1, 1, 0, 2],
      [0, 1, 1, 0],
      [0, 0, 3, -1],
      [0, 0, 0, 1],
    ],
  },
]

export function DetTriangleLab() {
  const [at, setAt] = useState(0)
  const cur = TRI_SCRIPT[at]
  const M = toFr(cur.m)
  const det = detM(M)!
  const diag = cur.m.map((r, i) => r[i])
  const product = diag.reduce((a, b) => a * b, 1)
  const done = at === TRI_SCRIPT.length - 1

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
          ← Back
        </Btn>
        <Btn primary onClick={() => setAt(Math.min(TRI_SCRIPT.length - 1, at + 1))} disabled={done}>
          Next step →
        </Btn>
        <span className="text-[12.5px] text-zinc-500">
          step {at} of {TRI_SCRIPT.length - 1}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title={cur.note}>
          <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
            {cur.m.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((v, j) => (
                  <span
                    key={j}
                    className="w-[48px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                    style={i === j ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 } : undefined}
                  >
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'diagonal', value: diag.join(' × ') },
              { label: 'their product', value: String(product) },
              { label: 'det B (exact)', value: frStr(det) },
              { label: 'row swaps used', value: String(cur.swaps) },
            ]}
          />
        </div>
      </div>

      <Verdict ok={done}>
        {done
          ? 'Upper triangular. Every entry below the diagonal is zero, so the determinant is just 1 × 1 × 3 × 1 = 3. Notice the exact determinant never moved while you were stepping — adding a multiple of one row to another leaves it alone.'
          : 'Not triangular yet. Keep pressing. Watch the “det B (exact)” read-out: it does not budge, because the only move being used is the one that leaves the determinant alone.'}
      </Verdict>

      <LabNote>
        Cofactor expansion on a 4 × 4 means four 3 × 3 determinants, and on a 10 × 10 it is hopeless. Row reduction is
        what a computer actually does. Two rules keep it honest: adding a multiple of a row to another row{' '}
        <strong>changes nothing</strong>, and each swap of two rows <strong>flips the sign</strong>. This example needed
        no swaps, so the diagonal product is the answer as it stands.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — the six properties, tested live                                  */
/* ========================================================================== */

export function DetRulesLab() {
  const [g, setG] = useState<number[][]>([
    [2, 0, 1],
    [1, 3, 2],
    [0, 1, 4],
  ])
  const [changed, setChanged] = useState<{ m: number[][]; note: string; expect: number; why: string } | null>(null)

  const A = toFr(g)
  const detA = detM(A)!
  const asNum = (m: FMat) => {
    const d = detM(m)
    return d ? d.n / d.d : 0
  }
  const base = asNum(A)

  const moves = [
    {
      id: 'swap',
      label: 'Swap R1 and R2',
      run: () => {
        const m = g.map((r) => [...r])
        const t = m[0]
        m[0] = m[1]
        m[1] = t
        return { m, note: 'R1 ↔ R2', expect: -base, why: 'a swap flips the sign' }
      },
    },
    {
      id: 'scale',
      label: 'Multiply R1 by 3',
      run: () => ({
        m: g.map((r, i) => (i === 0 ? r.map((v) => v * 3) : [...r])),
        note: 'R1 ← 3 × R1',
        expect: 3 * base,
        why: 'scaling one row scales the determinant by the same amount',
      }),
    },
    {
      id: 'add',
      label: 'R2 ← R2 + 5 × R1',
      run: () => ({
        m: g.map((r, i) => (i === 1 ? r.map((v, c) => v + 5 * g[0][c]) : [...r])),
        note: 'R2 ← R2 + 5 × R1',
        expect: base,
        why: 'adding a multiple of another row changes nothing at all',
      }),
    },
    {
      id: 'copy',
      label: 'Make R2 a copy of R1',
      run: () => ({
        m: g.map((r, i) => (i === 1 ? [...g[0]] : [...r])),
        note: 'R2 ← R1',
        expect: 0,
        why: 'two equal rows always give zero',
      }),
    },
    {
      id: 'trans',
      label: 'Transpose the whole thing',
      run: () => ({
        m: g[0].map((_, j) => g.map((r) => r[j])),
        note: 'A → Aᵀ',
        expect: base,
        why: 'tipping it over changes nothing',
      }),
    },
  ]

  const after = changed ? asNum(toFr(changed.m)) : null
  const matches = changed !== null && after === changed.expect

  // Property 1 gets its own check, because it needs a second matrix.
  const B = toFr([
    [1, 2, 0],
    [0, 1, 1],
    [2, 0, 1],
  ])
  const detB = asNum(B)
  const AB = mulM(A, B)!
  const detAB = asNum(AB)

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="A" note="type over anything">
          <NumBox
            m={g}
            width={48}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setChanged(null)
            }}
          />
        </Titled>
        <div className="pt-6">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">det A</div>
            <div className="text-[32px] font-semibold" style={{ color: 'var(--acc)' }}>
              {frStr(detA)}
            </div>
          </div>
        </div>
        {changed && (
          <>
            <div className="self-center pt-4 font-mono text-[18px] text-zinc-400">→</div>
            <Titled title={`After ${changed.note}`}>
              <NumBox m={changed.m} readOnly width={48} />
            </Titled>
            <div className="pt-6">
              <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">the new det</div>
                <div className="text-[32px] font-semibold" style={{ color: matches ? '#0d9488' : '#dc2626' }}>
                  {after}
                </div>
                <div className="text-[12px] text-zinc-500">expected {changed.expect}</div>
                <div className="text-[12px] text-zinc-500">{changed.why}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {moves.map((mv) => (
          <Btn key={mv.id} onClick={() => setChanged(mv.run())}>
            {mv.label}
          </Btn>
        ))}
        {changed && <Btn onClick={() => setChanged(null)}>Put it back</Btn>}
      </div>

      {changed && (
        <Verdict ok={matches}>
          {matches
            ? `Exactly as the rule promised — ${changed.why}, so the answer is ${changed.expect}.`
            : `Expected ${changed.expect}, got ${after}.`}
        </Verdict>
      )}

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          And the first property, which needs a second matrix
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="B (fixed)">
            <FrBox m={B} width={44} />
          </Titled>
          <Titled title="AB">
            <FrBox m={AB} width={48} />
          </Titled>
          <div className="pt-6 font-mono text-[13px]/[1.8] text-zinc-800">
            det A × det B = {frStr(detA)} × {detB} = {base * detB}
            <br />
            det(AB) = <strong>{detAB}</strong>
          </div>
        </div>
        <div className="mt-3">
          <Verdict ok={base * detB === detAB}>
            det(AB) = det(A) × det(B). Multiply two matrices and their determinants just multiply. This is what makes
            the inverse test work: if AB = I then det(A) × det(B) = 1, so neither determinant can be zero.
          </Verdict>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on label="det(AB) = det(A)·det(B)" />
        <Chip on label="det ≠ 0 ⟹ an inverse exists" />
        <Chip on label="two equal rows ⟹ det = 0" />
        <Chip on label="swap two rows ⟹ sign flips" />
        <Chip on label="det(A) = det(Aᵀ)" />
        <Chip on label="scale a row by c ⟹ det scales by c" />
      </div>

      <LabNote>
        The one that surprises people is the third button: adding a multiple of one row to another leaves the
        determinant completely alone. That is why row reduction is a safe way to work a determinant out — and it is the
        rule the previous part leaned on.
      </LabNote>
      <LabNote>
        “Two equal rows gives zero” also has a plain meaning: if one row repeats another, the rows do not fill up the
        space, the box they make is flat, and a flat box has no volume. Such a matrix is called{' '}
        <strong>singular</strong>.
      </LabNote>
    </LabBox>
  )
}

/** Small helper the parts use to print a determinant beside a matrix in prose. */
export function detOf(m: number[][]) {
  const A = toFr(m)
  if (!isSquare(A)) return '—'
  const d = detM(A)
  return d ? frStr(d) : '—'
}
