'use client'

import { Btn, FrBox, LabBox, LabNote, NumBox, Presets, Sign, Titled, Verdict } from '@/components/charts/matrix-ui'
import { ReadOutGrid } from '@/components/sessions/session-parts'
import { fr, frStr } from '@/lib/model/fraction'
import { detM, eqM, identity, inverseOf, mulM, ncols, rrefOf, toFr } from '@/lib/model/matrix'
import { useState } from 'react'

/* ========================================================================== */
/* Part 15a — the 2 × 2 formula                                               */
/* ========================================================================== */

export function Inverse2Lab() {
  const [g, setG] = useState<number[][]>([
    [2, 3],
    [1, 4],
  ])

  const A = toFr(g)
  const det = detM(A)!
  const inv = inverseOf(A)
  const check = inv && mulM(A, inv)
  const swapped = [
    [g[1][1], -g[0][1]],
    [-g[1][0], g[0][0]],
  ]

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-4">
        <Titled title="A" note="type over anything">
          <NumBox m={g} onEdit={(i, j, v) => setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))} />
        </Titled>
        <div className="pt-5 font-mono text-[15px] text-zinc-500">
          A⁻¹ = <span className="text-[13px]">1/{frStr(det)}</span> ×
        </div>
        <Titled title="swap the diagonal, flip the other two">
          <NumBox m={swapped} readOnly />
        </Titled>
        <Sign>=</Sign>
        <Titled title="A⁻¹">
          {inv ? (
            <FrBox m={inv} tone="#0d9488" />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-red-300 px-4 py-4 text-[12.5px] text-red-600">
              det is 0.
              <br />
              There is no inverse.
            </div>
          )}
        </Titled>
      </div>

      <ReadOutGrid
        items={[
          { label: 'ad', value: String(g[0][0] * g[1][1]) },
          { label: 'bc', value: String(g[0][1] * g[1][0]) },
          { label: 'det = ad − bc', value: frStr(det) },
          { label: 'inverse exists?', value: inv ? 'yes' : 'no' },
        ]}
      />

      {check && (
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="A × A⁻¹">
            <FrBox m={check} />
          </Titled>
          <div className="pt-6">
            <Verdict ok={eqM(check, identity(2))}>
              1s down the diagonal and 0s everywhere else. That is the identity matrix I, and it is the matrix version
              of the number 1 — multiply anything by it and nothing happens.
            </Verdict>
          </div>
        </div>
      )}

      {!inv && (
        <Verdict ok={false}>
          The formula divides by the determinant, and here that is zero. You cannot divide by zero, so there is no
          inverse. In the picture from part 12 the box has gone flat — A squashes the plane onto a line, and nothing can
          un-squash it.
        </Verdict>
      )}

      <LabNote>
        Two moves and you are done: swap the two numbers on the main diagonal, flip the sign of the other two, then
        divide everything by <span className="font-mono">ad − bc</span>. Try setting A to{' '}
        <span className="font-mono">[1 2; 2 4]</span> — the second row is just double the first, the determinant goes to
        zero, and the inverse vanishes.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15b — the shortcut that works at any size: [A | I] → [I | A⁻¹]        */
/* ========================================================================== */

const INV_PRESETS = [
  {
    id: 'slide37',
    label: 'Slide 37 — the 2 × 2',
    m: [
      [2, 3],
      [1, 4],
    ],
  },
  {
    id: 'slide39',
    label: 'Slide 39 — the 4 × 4',
    m: [
      [1, 0, 0, 0],
      [2, 1, 0, 0],
      [1, -1, 1, 0],
      [3, 2, 1, 1],
    ],
  },
  {
    id: 'q4',
    label: 'Practice Q4',
    m: [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ],
  },
  {
    id: 'singular',
    label: 'One with no inverse',
    m: [
      [1, 2, 3],
      [2, 4, 6],
      [1, 0, 1],
    ],
  },
] as const
type InvId = (typeof INV_PRESETS)[number]['id']

export function GaussJordanInverseLab() {
  const [pick, setPick] = useState<InvId>('slide37')
  const [g, setG] = useState<number[][]>(INV_PRESETS[0].m as unknown as number[][])
  const [at, setAt] = useState(0)

  const n = g.length
  const A = toFr(g)
  const aug = A.map((row, i) => [...row, ...identity(n)[i]])
  const { R, steps, rank } = rrefOf(aug, n)
  const shown = at === 0 ? aug : steps[Math.min(at, steps.length) - 1].R
  const note = at === 0 ? 'the augmented matrix [A | I]' : steps[Math.min(at, steps.length) - 1].note
  const done = at >= steps.length
  const works = rank === n
  const inv = works ? R.map((row) => row.slice(n)) : null

  return (
    <LabBox>
      <Presets
        items={INV_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setG(INV_PRESETS.find((p) => p.id === id)!.m as unknown as number[][])
          setAt(0)
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => setAt(0)} disabled={at === 0}>
          ⏮ Start
        </Btn>
        <Btn onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}>
          ← Back
        </Btn>
        <Btn primary onClick={() => setAt(Math.min(steps.length, at + 1))} disabled={done}>
          Next step →
        </Btn>
        <Btn onClick={() => setAt(steps.length)} disabled={done}>
          Run to the end ⏭
        </Btn>
        <span className="text-[12.5px] text-zinc-500">
          step {Math.min(at, steps.length)} of {steps.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">{note}</div>
        {/* The bar between the two halves is what makes this an augmented matrix. */}
        <div className="inline-flex flex-col gap-1 rounded-lg border-2 border-zinc-300 p-2">
          {shown.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((v, j) => (
                <span
                  key={j}
                  className="w-[52px] rounded px-2 py-1.5 text-right font-mono text-[13px] tabular-nums"
                  style={{
                    borderLeft: j === n ? '2px solid rgba(9,9,11,0.3)' : undefined,
                    color: j >= n ? '#0d9488' : undefined,
                    background: j < n && i === j && done && works ? 'var(--acc-12)' : undefined,
                  }}
                >
                  {frStr(v)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {done && (
        <Verdict ok={works}>
          {works ? (
            <>
              The left half has turned into the identity matrix, and whatever the right half turned into is A⁻¹. That is
              the whole trick — you never wrote down a formula, you just did the same row moves to both halves at once.
            </>
          ) : (
            <>
              The left half can never become the identity. Its rank is {rank}, not {n} — one row is a mixture of the
              others, so a whole row went to zero. This matrix has no inverse.
            </>
          )}
        </Verdict>
      )}

      {done && inv && (
        <div className="flex flex-wrap items-start gap-4">
          <Titled title="A⁻¹">
            <FrBox m={inv} tone="#0d9488" />
          </Titled>
          <Sign>and A × A⁻¹ =</Sign>
          <Titled title="should be I">
            <FrBox m={mulM(A, inv)!} />
          </Titled>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-4">
        <Titled title="Edit A" note="the right half is always I">
          <NumBox
            m={g}
            width={46}
            onEdit={(i, j, v) => {
              setG(g.map((r, ri) => r.map((x, ci) => (ri === i && ci === j ? v : x))))
              setAt(0)
            }}
          />
        </Titled>
        <div className="pt-6 text-[13px]/[1.7] text-zinc-600">
          {ncols(A) === n ? (
            <>
              det A = <strong className="font-mono text-zinc-950">{frStr(detM(A) ?? fr(0))}</strong>.{' '}
              {works
                ? 'Not zero, so an inverse is waiting at the end of the steps.'
                : 'Zero, which is exactly why the method is about to fail.'}
            </>
          ) : null}
        </div>
      </div>

      <LabNote>
        Why this works: turning [A | I] into [I | A⁻¹] means finding the moves that undo A. Doing those same moves to I
        records them, and what you end up with is a matrix that undoes A — which is what A⁻¹ means. Try{' '}
        <strong>One with no inverse</strong> and watch the method fail honestly rather than produce nonsense.
      </LabNote>
    </LabBox>
  )
}
