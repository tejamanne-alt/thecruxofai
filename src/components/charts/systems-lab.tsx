'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote, NumBox, Presets, Titled, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawPlane, grip, type Frame } from '@/lib/chart/frame'
import { fr, frAdd, frMul, frStr, type Fr } from '@/lib/model/fraction'
import { checkSystem, rrefOf, solveSystem, toFr, varName, type FMat } from '@/lib/model/matrix'
import { useState } from 'react'

/* ========================================================================== */
/* Part 17 — homogeneous or not                                               */
/* ========================================================================== */

const SPAN = 4

/**
 * Two lines you can slide about. Setting both right-hand sides to zero drags
 * both lines onto the origin at once, which is the whole content of "a
 * homogeneous system always has at least one answer".
 */
export function HomogeneousLab() {
  const [c1, setC1] = useState(3)
  const [c2, setC2] = useState(1)
  const [same, setSame] = useState(false)

  // Line 1: 2x + y = c1.  Line 2: x − y = c2, or a copy of line 1 when `same`.
  const a2 = same ? 4 : 1
  const b2 = same ? 2 : -1
  const rhs2 = same ? 2 * c1 : c2

  const det = 2 * b2 - 1 * a2
  const aug: FMat = toFr([
    [2, 1, c1],
    [a2, b2, rhs2],
  ])
  const sol = solveSystem(aug, 2)
  const homogeneous = c1 === 0 && rhs2 === 0

  const yOf = (a: number, b: number, c: number, x: number) => (b === 0 ? NaN : (c - a * x) / b)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawPlane(g, W, H, SPAN)
    const acc = accentColour()

    const line = (a: number, b: number, c: number, colour: string) => {
      g.strokeStyle = colour
      g.lineWidth = 2.5
      g.beginPath()
      if (b === 0) {
        g.moveTo(f.px(c / a), f.T)
        g.lineTo(f.px(c / a), f.B)
      } else {
        g.moveTo(f.px(-SPAN), f.py(yOf(a, b, c, -SPAN)))
        g.lineTo(f.px(SPAN), f.py(yOf(a, b, c, SPAN)))
      }
      g.stroke()
    }
    line(2, 1, c1, acc)
    line(a2, b2, rhs2, '#d97706')

    if (sol.kind === 'one') {
      const x = sol.particular[0].n / sol.particular[0].d
      const y = sol.particular[1].n / sol.particular[1].d
      dot(g, f.px(x), f.py(y), 6, '#09090b', '#fff')
    }
    // The origin always gets a ring, so you can see whether the lines pass through it.
    g.beginPath()
    g.arc(f.px(0), f.py(0), 9, 0, Math.PI * 2)
    g.strokeStyle = homogeneous ? '#0d9488' : 'rgba(9,9,11,0.25)'
    g.lineWidth = 2
    g.stroke()

    grip(g, f.px(0), f.py(yOf(2, 1, c1, 0)), acc, 6)
    return f
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${same}`}
          handles={(f) => [{ id: 'c1', px: f.px(0), py: f.py(yOf(2, 1, c1, 0)), grab: 'anywhere' }]}
          onDragTo={(_id, x, y) => setC1(Math.round(clamp(2 * x + y, -8, 8)))}
          caption="Press anywhere to slide the coloured line. The ring marks the origin — where x and y are both zero."
        />

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Slider
            label="right-hand side of line 1"
            value={c1}
            display={String(c1)}
            min={-8}
            max={8}
            step={1}
            hint="2x + y = this"
            onChange={setC1}
          />
          {!same && (
            <Slider
              label="right-hand side of line 2"
              value={c2}
              display={String(c2)}
              min={-8}
              max={8}
              step={1}
              hint="x − y = this"
              onChange={setC2}
            />
          )}
          <Btn
            primary
            onClick={() => {
              setC1(0)
              setC2(0)
            }}
          >
            Set both to zero
          </Btn>
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-zinc-700">
            <input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} className="cursor-pointer" />
            Make line 2 just double line 1
          </label>
          <ReadOutGrid
            items={[
              { label: 'det A', value: String(det) },
              { label: 'rank A', value: String(sol.rankA) },
              { label: 'rank [A|b]', value: String(sol.rankAug) },
              { label: 'answers', value: sol.kind === 'none' ? 'none' : sol.kind === 'one' ? 'one' : 'endless' },
            ]}
          />
          <PanelNote>
            {homogeneous
              ? 'Both right-hand sides are zero, so this is a homogeneous system. Both lines go through the origin, so x = y = 0 always works.'
              : 'At least one right-hand side is not zero, so this is non-homogeneous. Nothing guarantees an answer exists.'}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={homogeneous || sol.kind !== 'none'}>
        {homogeneous ? (
          <>
            Homogeneous. x = 0, y = 0 is always an answer — the lecture calls it the <strong>trivial</strong> solution.{' '}
            {sol.kind === 'many'
              ? 'And here there are others too, because the two lines are the same line.'
              : 'Here it is the only one, because the two lines cross at exactly one place.'}
          </>
        ) : sol.kind === 'none' ? (
          <>Two parallel lines that never meet, so no answer at all. That cannot happen once the right sides are zero.</>
        ) : sol.kind === 'many' ? (
          <>The two lines lie on top of each other, so every point on the line is an answer.</>
        ) : (
          <>
            One crossing point: {sol.particular.map((v, i) => `${varName(i)} = ${frStr(v)}`).join(', ')}. Nothing about
            this was guaranteed — slide the lines apart and it can vanish.
          </>
        )}
      </Verdict>

      <LabNote>
        <strong>Homogeneous</strong>{' '}just means every right-hand side is 0. Written as Ax = 0. The useful thing about it
        is that it can never have <em>no</em>{' '}answer: putting every unknown to zero always works. So the only question
        left is whether there are others, and that comes down to rank.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 18 — the house-price example from slide 43                            */
/* ========================================================================== */

/**
 * The three houses from slide 43, plus a fourth that happens to agree with them.
 *
 * Three houses can never contradict each other here — the 3 × 3 coefficient
 * matrix is non-singular, so every set of prices has exactly one answer. The
 * fourth row is what makes "real data does not fit exactly" something you can
 * actually make happen, by nudging its price off the line.
 */
const HOUSES = [
  { size: 1, rooms: 1, price: 6 },
  { size: 2, rooms: 1, price: 9 },
  { size: 1, rooms: 2, price: 8 },
  { size: 2, rooms: 2, price: 11 },
]

export function HousePriceLab() {
  const [rows, setRows] = useState(HOUSES)
  const [askSize, setAskSize] = useState(3)
  const [askRooms, setAskRooms] = useState(2)

  const aug: FMat = toFr(rows.map((r) => [r.size, r.rooms, 1, r.price]))
  const sol = solveSystem(aug, 3)
  const num = (v: Fr) => v.n / v.d

  const w1 = sol.kind === 'one' ? num(sol.particular[0]) : null
  const w2 = sol.kind === 'one' ? num(sol.particular[1]) : null
  const b = sol.kind === 'one' ? num(sol.particular[2]) : null
  const predicted = w1 !== null && w2 !== null && b !== null ? w1 * askSize + w2 * askRooms + b : null

  return (
    <LabBox>
      <div className="overflow-x-auto">
        <table className="text-[13px]">
          <thead>
            <tr className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              <th className="px-3 py-2 text-left">Size x₁ (1000 sq ft)</th>
              <th className="px-3 py-2 text-left">Rooms x₂</th>
              <th className="px-3 py-2 text-left">Price y</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-zinc-950/[0.08]">
                {(['size', 'rooms', 'price'] as const).map((key) => (
                  <td key={key} className="px-3 py-1.5">
                    <input
                      value={r[key]}
                      inputMode="numeric"
                      aria-label={`house ${i + 1} ${key}`}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) setRows(rows.map((x, ri) => (ri === i ? { ...x, [key]: v } : x)))
                      }}
                      className="w-[70px] rounded border border-zinc-950/10 px-2 py-1 text-right font-mono text-[13px] outline-none focus:border-zinc-950/40"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Each house gives one equation
        </div>
        <div className="font-mono text-[13px]/[1.9] text-zinc-800">
          {rows.map((r, i) => (
            <div key={i}>
              {r.size === 1 ? '' : r.size}w₁ + {r.rooms === 1 ? '' : r.rooms}w₂ + b = {r.price}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <Titled title="The augmented matrix" note="w₁, w₂, b, then the price">
          <FrBox m={aug} width={46} />
        </Titled>
        <div className="pt-6">
          {sol.kind === 'one' ? (
            <ReadOutGrid
              items={[
                { label: 'w₁ (per 1000 sq ft)', value: frStr(sol.particular[0]) },
                { label: 'w₂ (per room)', value: frStr(sol.particular[1]) },
                { label: 'b (base price)', value: frStr(sol.particular[2]) },
                { label: 'rank', value: `${sol.rankA} of 3` },
              ]}
            />
          ) : (
            <Verdict ok={false}>
              {sol.kind === 'none'
                ? `These houses disagree with each other. rank A is ${sol.rankA} but rank [A|b] is ${sol.rankAug}, and that mismatch means no straight-line rule of this shape fits all of them exactly.`
                : 'These houses do not pin the rule down — one of them repeats what the others already said, so endless rules fit equally well.'}
            </Verdict>
          )}
        </div>
      </div>

      {sol.kind === 'one' && predicted !== null && (
        <div className="grid gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Slider
            label="Size of a new house"
            value={askSize}
            display={`${askSize}`}
            min={0}
            max={6}
            step={0.5}
            hint="in thousands of square feet"
            onChange={setAskSize}
          />
          <Slider
            label="Rooms"
            value={askRooms}
            display={`${askRooms}`}
            min={1}
            max={8}
            step={1}
            hint="how many rooms it has"
            onChange={setAskRooms}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">predicted price</div>
            <div className="text-[28px] font-semibold" style={{ color: 'var(--acc)' }}>
              {predicted.toFixed(1)}
            </div>
            <div className="text-[12px] text-zinc-500">
              {frStr(sol.particular[0])}×{askSize} + {frStr(sol.particular[1])}×{askRooms} + {frStr(sol.particular[2])}
            </div>
          </div>
        </div>
      )}

      <LabNote>
        This is the whole of machine learning in miniature. You have a rule with unknown numbers in it, you have some
        data, and each row of data turns into one equation. Solving the system is called <strong>fitting</strong>, and
        the numbers you get out are called <strong>weights</strong>.
      </LabNote>
      <LabNote>
        Now break it. Change the fourth price from 11 to 12 and the houses start contradicting each other — no rule of
        this shape fits all four exactly. Notice you needed a <em>fourth</em>{' '}house to do that: with three houses and
        three unknowns there is always exactly one answer, whatever prices you type.
      </LabNote>
      <LabNote>
        Real datasets are all like that fourth row, thousands of times over: far more equations than unknowns, and no
        way to satisfy them all. So people stop demanding an exact fit and look for the weights that come{' '}
        <em>closest</em>{' '}instead. That is linear regression, and this is the problem it exists to solve.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 19 — none, one, or endless — read off from rank                       */
/* ========================================================================== */

const OUTCOMES = [
  {
    id: 'none',
    label: 'Slide 45 — no answer',
    eqs: ['x₁ + x₂ + x₃ = 3', 'x₁ − x₂ + 2x₃ = 2', '2x₁ + 3x₃ = 1'],
    m: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [2, 0, 3, 1],
    ],
  },
  {
    id: 'one',
    label: 'Slide 47 — exactly one',
    eqs: ['x₁ + x₂ + x₃ = 3', 'x₁ − x₂ + 2x₃ = 2', 'x₂ + x₃ = 2'],
    m: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [0, 1, 1, 2],
    ],
  },
  {
    id: 'many',
    label: 'Slide 49 — endless',
    eqs: ['x₁ + x₂ + x₃ = 3', 'x₁ − x₂ + 2x₃ = 2', '2x₁ + 3x₃ = 5'],
    m: [
      [1, 1, 1, 3],
      [1, -1, 2, 2],
      [2, 0, 3, 5],
    ],
  },
] as const
type OutcomeId = (typeof OUTCOMES)[number]['id']

export function OutcomesLab() {
  const [pick, setPick] = useState<OutcomeId>('none')
  const [t, setT] = useState(0)

  const spec = OUTCOMES.find((o) => o.id === pick)!
  const aug = toFr(spec.m as unknown as number[][])
  const sol = solveSystem(aug, 3)

  // The answer for the current dial setting, worked out fresh every render.
  const at: Fr[] =
    sol.kind === 'none'
      ? []
      : sol.particular.map((p, i) => sol.directions.reduce((acc, dir) => frAdd(acc, frMul(fr(t), dir.vec[i])), p))
  const rows = at.length ? checkSystem(aug, 3, at) : []

  return (
    <LabBox>
      <Presets
        items={OUTCOMES.map((o) => ({ id: o.id, label: o.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setT(0)
        }}
      />

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The system">
          <div className="flex flex-col gap-1 pt-1 font-mono text-[13px]/[1.9] text-zinc-800">
            {spec.eqs.map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
        </Titled>
        <Titled title="Augmented, tidied up">
          <FrBox m={solveRref(aug)} width={46} />
        </Titled>
        <div className="pt-6">
          <ReadOutGrid
            items={[
              { label: 'rank A', value: String(sol.rankA) },
              { label: 'rank [A|b]', value: String(sol.rankAug) },
              { label: 'unknowns', value: '3' },
              { label: 'free', value: String(sol.freeCols.length) },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={sol.rankA < sol.rankAug} label="rank A < rank [A|b] → no answer" />
        <Chip on={sol.rankA === sol.rankAug && sol.freeCols.length === 0} label="ranks match, nothing free → one answer" />
        <Chip on={sol.rankA === sol.rankAug && sol.freeCols.length > 0} label="ranks match, something free → endless" />
      </div>

      <Verdict ok={sol.kind !== 'none'}>
        {sol.kind === 'none' ? (
          <>
            The tidied matrix has a row reading 0 = −4. That can never be true, so nothing satisfies all three at once.
            In rank language: rank A is {sol.rankA} but rank [A|b] is {sol.rankAug}, and a mismatch always means no
            answer.
          </>
        ) : sol.kind === 'one' ? (
          <>
            Every unknown is pinned down by a step of the staircase, so there is exactly one answer:{' '}
            {sol.particular.map((v, i) => `${varName(i)} = ${frStr(v)}`).join(', ')}.
          </>
        ) : (
          <>
            The ranks match, so there is an answer — but only {sol.rankA} of the 3 unknowns are pinned down. That leaves{' '}
            {sol.freeCols.map((c) => varName(c)).join(' and ')} free to be anything, and every choice gives another
            valid answer.
          </>
        )}
      </Verdict>

      {sol.kind === 'many' && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Every answer at once
          </div>
          <div className="font-mono text-[13px]/[1.9] text-zinc-800">
            (x₁, x₂, x₃) = ({sol.particular.map((v) => frStr(v)).join(', ')}) + t(
            {sol.directions[0].vec.map((v) => frStr(v)).join(', ')})
          </div>
          <div className="mt-3">
            <Slider
              label="the dial t"
              value={t}
              display={String(t)}
              min={-4}
              max={4}
              step={1}
              hint="Set it to anything. Every setting is a real answer."
              onChange={setT}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-4">
            <div className="font-mono text-[13px]/[1.9] text-zinc-800">
              {at.map((v, i) => (
                <div key={i}>
                  {varName(i)} = {frStr(v)}
                </div>
              ))}
            </div>
            <div className="font-mono text-[13px]/[1.9]">
              {rows.map((r, i) => (
                <div key={i} style={{ color: r.ok ? '#0d9488' : '#dc2626' }}>
                  equation {i + 1}: {frStr(r.lhs)} = {frStr(r.rhs)} {r.ok ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[13px]/[1.6] text-zinc-600">
            Move the dial and every one of the three equations stays satisfied. That is what &ldquo;endless&rdquo;
            means, and it is worth seeing rather than being told.
          </p>
        </div>
      )}

      <LabNote>
        The rule on slide 61, in plain words. Work out two ranks: one for A on its own, one for A with the right-hand
        side stuck on. If they <strong>differ</strong>, there is no answer. If they <strong>match</strong>, count the
        unknowns that no pivot landed on — none means one answer, one or more means endlessly many.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 20 — five unknowns and a dial called a                                */
/* ========================================================================== */

const PARAM_ROWS = (a: number): number[][] => [
  [-2, 4, -2, -1, 4, -3],
  [4, -8, 3, -3, 1, 2],
  [1, -2, 1, -1, 1, 0],
  [1, -2, 0, -3, 4, a],
]

export function ParameterLab() {
  const [a, setA] = useState(1)
  const [s, setS] = useState(0)
  const [tt, setTt] = useState(0)

  const aug = toFr(PARAM_ROWS(a))
  const sol = solveSystem(aug, 5)
  const consistent = sol.kind !== 'none'

  // The lecture's own answer, written straight out, so the page reproduces it.
  const x: Fr[] = [fr(2 + 2 * s + 2 * tt), fr(s), fr(-1 - tt), fr(1 + 2 * tt), fr(tt)]
  const rows = checkSystem(toFr(PARAM_ROWS(-1)), 5, x)
  const allOk = rows.every((r) => r.ok)

  return (
    <LabBox>
      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The system" note="the last right-hand side is the dial">
          <div className="flex flex-col gap-1 pt-1 font-mono text-[13px]/[1.9] text-zinc-800">
            <span>−2x₁ + 4x₂ − 2x₃ − x₄ + 4x₅ = −3</span>
            <span>4x₁ − 8x₂ + 3x₃ − 3x₄ + x₅ = 2</span>
            <span>x₁ − 2x₂ + x₃ − x₄ + x₅ = 0</span>
            <span style={{ color: 'var(--acc)' }}>x₁ − 2x₂ − 3x₄ + 4x₅ = {a}</span>
          </div>
        </Titled>
        <Titled title="After tidying up">
          <FrBox m={solveRref(aug)} width={44} />
        </Titled>
      </div>

      <Slider
        label="the dial a"
        value={a}
        display={String(a)}
        min={-4}
        max={4}
        step={1}
        hint="Everything else is fixed. Only this one number moves."
        onChange={setA}
      />

      <Verdict ok={consistent}>
        {consistent ? (
          <>
            a = −1 is the one setting that works. The bottom row has collapsed to 0 = 0, which says nothing and forbids
            nothing. rank A = {sol.rankA}, rank [A|b] = {sol.rankAug}, and with 5 unknowns that leaves{' '}
            {sol.freeCols.length} free — so endlessly many answers.
          </>
        ) : (
          <>
            a = {a} does not work. The bottom row ends up saying 0 = {a + 1}, which is impossible. rank A = {sol.rankA}{' '}
            but rank [A|b] = {sol.rankAug}, and that mismatch is exactly the no-answer case. Slide the dial to −1.
          </>
        )}
      </Verdict>

      {consistent && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Two free unknowns means two dials
          </div>
          <div className="font-mono text-[13px]/[1.9] text-zinc-800">
            (x₁, x₂, x₃, x₄, x₅) = (2 + 2s + 2t, s, −1 − t, 1 + 2t, t)
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Slider label="s (this is x₂)" value={s} display={String(s)} min={-3} max={3} step={1} hint="pick anything" onChange={setS} />
            <Slider label="t (this is x₅)" value={tt} display={String(tt)} min={-3} max={3} step={1} hint="pick anything" onChange={setTt} />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-6">
            <div className="font-mono text-[13px]/[1.9] text-zinc-800">
              {x.map((v, i) => (
                <div key={i}>
                  {varName(i)} = {frStr(v)}
                </div>
              ))}
            </div>
            <div className="font-mono text-[13px]/[1.9]">
              {rows.map((r, i) => (
                <div key={i} style={{ color: r.ok ? '#0d9488' : '#dc2626' }}>
                  equation {i + 1}: {frStr(r.lhs)} = {frStr(r.rhs)} {r.ok ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <Verdict ok={allOk}>
              {allOk
                ? 'All four equations hold, whatever you set the two dials to. Move them and watch the numbers change while every tick stays green.'
                : 'One of the equations is not satisfied — which would mean the printed answer is wrong.'}
            </Verdict>
          </div>
        </div>
      )}

      <LabNote>
        The unknowns split into two kinds. <strong>Pivot</strong>{' '}unknowns — x₁, x₃ and x₄ here — are forced once you
        have chosen the others. <strong>Free</strong>{' '}unknowns — x₂ and x₅ — are yours to pick. The count of free ones
        is just (number of unknowns) − (rank), which is why rank is worth working out.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 21 — the two practice questions that hang on one letter               */
/* ========================================================================== */

const K_QUESTIONS = [
  {
    id: 'q1',
    label: 'Practice Q1',
    ask: 'For which k is there exactly one answer?',
    eqs: (k: number) => ['2x + y − z = 1', 'x + 3y + 2z = 12', `3x + 4y ${k < 0 ? '−' : '+'} ${Math.abs(k)}z = 13`],
    rows: (k: number) => [
      [2, 1, -1, 1],
      [1, 3, 2, 12],
      [3, 4, k, 13],
    ],
    want: 'one' as const,
    answer: 'every k except 1',
  },
  {
    id: 'q7',
    label: 'Practice Q7',
    ask: 'For which k are there endlessly many answers?',
    eqs: (k: number) => ['x + y + z = 3', '2x + 3y + 4z = 8', `3x + 4y ${k < 0 ? '−' : '+'} ${Math.abs(k)}z = 11`],
    rows: (k: number) => [
      [1, 1, 1, 3],
      [2, 3, 4, 8],
      [3, 4, k, 11],
    ],
    want: 'many' as const,
    answer: 'k = 5',
  },
] as const
type KId = (typeof K_QUESTIONS)[number]['id']

/**
 * Both questions ask "for what k does …", and the honest way to answer is to
 * try every k and watch the two ranks. The special value is the one where they
 * change, and it is far more convincing found than stated.
 */
export function ParameterKLab() {
  const [pick, setPick] = useState<KId>('q1')
  const [k, setK] = useState(0)

  const q = K_QUESTIONS.find((x) => x.id === pick)!
  const aug = toFr(q.rows(k) as unknown as number[][])
  const sol = solveSystem(aug, 3)
  const hit = sol.kind === q.want

  return (
    <LabBox>
      <Presets
        items={K_QUESTIONS.map((x) => ({ id: x.id, label: x.label }))}
        at={pick}
        onPick={(id) => {
          setPick(id)
          setK(0)
        }}
      />
      <LabNote>
        <strong>{q.ask}</strong>{' '}Drag k across its whole range and watch the two ranks. The interesting value is
        wherever they stop agreeing — or start.
      </LabNote>

      <div className="flex flex-wrap items-start gap-6">
        <Titled title="The system">
          <div className="flex flex-col gap-1 pt-1 font-mono text-[13px]/[1.9] text-zinc-800">
            {q.eqs(k).map((e, i) => (
              <span key={i} style={i === 2 ? { color: 'var(--acc)' } : undefined}>
                {e}
              </span>
            ))}
          </div>
        </Titled>
        <Titled title="Tidied up">
          <FrBox m={solveRref(aug)} width={46} />
        </Titled>
      </div>

      <Slider
        label="the letter k"
        value={k}
        display={String(k)}
        min={-6}
        max={8}
        step={1}
        hint="Everything else stays put. Only this moves."
        onChange={setK}
      />

      <ReadOutGrid
        items={[
          { label: 'rank A', value: String(sol.rankA) },
          { label: 'rank [A|b]', value: String(sol.rankAug) },
          { label: 'free unknowns', value: String(sol.freeCols.length) },
          { label: 'answers', value: sol.kind === 'none' ? 'none' : sol.kind === 'one' ? 'exactly one' : 'endless' },
        ]}
      />

      <Verdict ok={hit}>
        {hit
          ? `At k = ${k} this is the case the question is asking about — ${q.want === 'one' ? 'exactly one answer' : 'endlessly many answers'}. The full answer to the question is: ${q.answer}.`
          : `At k = ${k} the system has ${sol.kind === 'none' ? 'no answer at all' : sol.kind === 'one' ? 'exactly one answer' : 'endlessly many answers'}, which is not what this question asked for. Keep sliding.`}
      </Verdict>

      {sol.kind === 'one' && (
        <LabNote>
          The one answer right now is {sol.particular.map((v, i) => `${['x', 'y', 'z'][i]} = ${frStr(v)}`).join(', ')}.
          {pick === 'q1' && ' Notice it does not move as you change k — the letter only decides whether an answer exists, not what it is.'}
        </LabNote>
      )}
    </LabBox>
  )
}

/* ------------------------------------------------------------------ bits */

/**
 * The tidied augmented matrix. Pivoting stops before the right-hand column, so
 * a contradiction row survives on screen instead of being pivoted away.
 */
function solveRref(aug: FMat): FMat {
  return rrefOf(aug, aug[0].length - 1).R
}
