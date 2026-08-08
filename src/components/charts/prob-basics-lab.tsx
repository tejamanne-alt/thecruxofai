'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, drawAxes, type Frame } from '@/lib/chart/frame'
import clsx from 'clsx'
import { useState } from 'react'

/* ========================================================================== */
/* Part 12 — sample space, events, and the algebra of events                  */
/* ========================================================================== */

const FACES = [1, 2, 3, 4, 5, 6]

/** The exact sets slide 22 uses. */
const SLIDE_A = [2, 4, 6]
const SLIDE_B = [4, 5, 6]

export function EventsAlgebraLab() {
  const [A, setA] = useState<number[]>(SLIDE_A)
  const [B, setB] = useState<number[]>(SLIDE_B)
  const [editing, setEditing] = useState<'A' | 'B'>('A')

  const inA = (n: number) => A.includes(n)
  const inB = (n: number) => B.includes(n)
  const union = FACES.filter((n) => inA(n) || inB(n))
  const inter = FACES.filter((n) => inA(n) && inB(n))
  const compA = FACES.filter((n) => !inA(n))
  const exclusive = inter.length === 0
  const exhaustive = union.length === FACES.length

  const toggle = (n: number) => {
    if (editing === 'A') setA(inA(n) ? A.filter((x) => x !== n) : [...A, n].sort())
    else setB(inB(n) ? B.filter((x) => x !== n) : [...B, n].sort())
  }

  const show = (s: number[]) => (s.length ? `{${s.join(', ')}}` : '∅ (the empty set)')

  return (
    <LabBox>
      <LabNote>
        Roll one die. The <strong>sample space</strong> Ω is everything that could come up. An <strong>event</strong> is
        any part of that list. Press the faces to build two events and watch the three operations follow.
      </LabNote>

      <Presets
        items={[
          { id: 'A' as const, label: 'Editing A' },
          { id: 'B' as const, label: 'Editing B' },
        ]}
        at={editing}
        onPick={setEditing}
      />

      <div className="flex flex-wrap gap-2">
        {FACES.map((n) => {
          const a = inA(n)
          const b = inB(n)
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              aria-label={`face ${n}`}
              className={clsx(
                'grid size-[64px] cursor-pointer place-items-center rounded-lg border-2 text-[22px] font-semibold',
                a && b ? 'border-zinc-900' : a || b ? 'border-zinc-400' : 'border-zinc-200 text-zinc-400'
              )}
              style={
                a && b
                  ? { background: 'var(--acc)', color: '#fff' }
                  : a
                    ? { background: 'var(--acc-12)', color: 'var(--acc)' }
                    : b
                      ? { background: 'rgba(217,119,6,0.14)', color: '#b45309' }
                      : undefined
              }
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-[12px] text-zinc-600">
        <span>
          <span className="mr-1 inline-block size-3 rounded-sm align-middle" style={{ background: 'var(--acc-12)' }} />
          in A only
        </span>
        <span>
          <span
            className="mr-1 inline-block size-3 rounded-sm align-middle"
            style={{ background: 'rgba(217,119,6,0.14)' }}
          />
          in B only
        </span>
        <span>
          <span className="mr-1 inline-block size-3 rounded-sm align-middle" style={{ background: 'var(--acc)' }} />
          in both
        </span>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 font-mono text-[13px]/[1.9] text-zinc-800">
        Ω = {'{1, 2, 3, 4, 5, 6}'}
        <br />A = {show(A)}
        <br />B = {show(B)}
        <br />
        <span className="text-zinc-500">A ∪ B</span> = {show(union)}   
        <span className="text-zinc-400">← everything in one or the other (OR)</span>
        <br />
        <span className="text-zinc-500">A ∩ B</span> = {show(inter)}   
        <span className="text-zinc-400">← only what is in both (AND)</span>
        <br />
        <span className="text-zinc-500">Aᶜ</span> = {show(compA)}   
        <span className="text-zinc-400">← everything A is not (NOT)</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={exclusive} label={`mutually exclusive ${exclusive ? '✓' : '✗'}`} />
        <Chip on={exhaustive} label={`exhaustive ${exhaustive ? '✓' : '✗'}`} />
        <Btn
          onClick={() => {
            setA([2, 4, 6])
            setB([1, 3, 5])
          }}
        >
          Make them mutually exclusive
        </Btn>
        <Btn
          onClick={() => {
            setA(SLIDE_A)
            setB(SLIDE_B)
          }}
        >
          Back to the slide
        </Btn>
      </div>

      <Verdict ok={exclusive}>
        {exclusive
          ? 'A ∩ B is empty, so A and B are mutually exclusive — they cannot both happen on one roll.'
          : `A ∩ B = ${show(inter)}, which is not empty. Rolling any of those would make both A and B happen at once, so they are not mutually exclusive.`}
      </Verdict>

      <LabNote>
        <strong>Exhaustive</strong> means the events between them cover the whole of Ω, so something in the collection
        is bound to happen. Slide 22’s example is A₁ = {'{1,2}'}, A₂ = {'{3,4}'}, A₃ = {'{5,6}'} — three events that are
        mutually exclusive <em>and</em> exhaustive, which is the tidiest way to carve up a sample space.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13 — the three axioms                                                 */
/* ========================================================================== */

const FAIR = [1, 1, 1, 1, 1, 1]

/** Each preset carries its own divisor, so "does not add to 1" can actually fail. */
const AXIOM_PRESETS = [
  { id: 'fair', label: 'A fair die', w: FAIR, scale: 6 },
  { id: 'loaded', label: 'A loaded die', w: [3, 1, 1, 1, 1, 1], scale: 8 },
  { id: 'neg', label: 'One of them negative', w: [-1, 2, 1, 1, 1, 1], scale: 5 },
  { id: 'short', label: 'They do not add to 1', w: [1, 1, 1, 1, 1, 0], scale: 6 },
] as const
type AxId = (typeof AXIOM_PRESETS)[number]['id']

/**
 * The axioms as things you can break. Sliders set six raw numbers which are
 * shown as probabilities without being renormalised — otherwise axiom 2 could
 * never fail, and a rule you cannot break teaches nothing.
 */
export function AxiomsLab() {
  const [pick, setPick] = useState<AxId>('fair')
  const [w, setW] = useState<number[]>([...FAIR])
  const [scale, setScale] = useState(6)

  const p = w.map((v) => v / scale)
  const total = p.reduce((a, b) => a + b, 0)
  const nonNeg = p.every((v) => v >= 0)
  const sumsToOne = Math.abs(total - 1) < 1e-9

  // Axiom 3 on a concrete pair: P(even or {1}) must equal P(even) + P({1}).
  const even = p[1] + p[3] + p[5]
  const one = p[0]
  const together = p[0] + p[1] + p[3] + p[5]
  const additive = Math.abs(together - (even + one)) < 1e-9

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: 0.5,
      xmax: 6.5,
      ymin: Math.min(-0.2, ...p) - 0.05,
      ymax: 0.7,
      xlab: 'face',
      ylab: 'P',
    })
    const acc = accentColour()
    p.forEach((v, i) => {
      const x = f.px(i + 1)
      const bw = (f.R - f.L) / 12
      g.fillStyle = v < 0 ? 'rgba(220,38,38,0.75)' : acc
      g.fillRect(x - bw / 2, Math.min(f.py(v), f.py(0)), bw, Math.abs(f.py(v) - f.py(0)))
    })
    g.strokeStyle = 'rgba(9,9,11,0.35)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(f.L, f.py(0))
    g.lineTo(f.R, f.py(0))
    g.stroke()
    return f
  }

  return (
    <LabBox>
      <Presets
        items={AXIOM_PRESETS.map((s) => ({ id: s.id, label: s.label }))}
        at={pick}
        onPick={(id) => {
          const s = AXIOM_PRESETS.find((x) => x.id === id)!
          setPick(id)
          setW([...s.w])
          setScale(s.scale)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={300}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${pick}-${scale}`}
          caption="One bar per face. A bar below the line breaks axiom 1; bars that do not add to 1 break axiom 2."
        />
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          {w.map((v, i) => (
            <Slider
              key={i}
              label={`face ${i + 1}`}
              value={v}
              display={p[i].toFixed(3)}
              min={-2}
              max={4}
              step={1}
              hint=""
              onChange={(nv) => {
                setW(w.map((x, j) => (j === i ? nv : x)))
                setPick('' as AxId)
              }}
            />
          ))}
        </div>
      </div>

      <ReadOutGrid
        items={[
          { label: 'P(Ω)', value: total.toFixed(3) },
          { label: 'smallest P', value: Math.min(...p).toFixed(3) },
          { label: 'P(even)', value: even.toFixed(3) },
          { label: 'P(even) + P(1)', value: (even + one).toFixed(3) },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Verdict ok={nonNeg}>
          <strong>Axiom 1 — never negative.</strong>{' '}
          {nonNeg
            ? 'Every P(E) is 0 or more.'
            : 'One of them is below zero, which is not allowed. A probability cannot be negative — there is no such thing as less impossible than impossible.'}
        </Verdict>
        <Verdict ok={sumsToOne}>
          <strong>Axiom 2 — P(Ω) = 1.</strong>{' '}
          {sumsToOne
            ? 'Everything adds to 1, so something is certain to happen.'
            : `They add to ${total.toFixed(3)}, not 1. Either some outcome is missing, or the numbers are counting the same thing twice.`}
        </Verdict>
        <Verdict ok={additive}>
          <strong>Axiom 3 — adding up.</strong> For events that cannot both happen, the probability of either one is the
          sum. Here P(even or 1) = {together.toFixed(3)} and P(even) + P(1) = {(even + one).toFixed(3)}.
        </Verdict>
      </div>

      <LabNote>
        Notice what axiom 3 does <em>not</em> say. It only lets you add probabilities when the events are{' '}
        <strong>mutually exclusive</strong> — when they cannot both happen. If they could overlap, adding would count
        the shared outcomes twice, and you would have to subtract the overlap back off.
      </LabNote>
      <LabNote>
        These three lines are the whole definition of probability. Everything else — the addition rule, conditional
        probability, expectation — is worked out from them.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — a random variable is a function                                  */
/* ========================================================================== */

const TOSSES = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT']
const headsIn = (s: string) => s.split('').filter((c) => c === 'H').length

export function RandomVarLab() {
  const [at, setAt] = useState<string | null>('HTT')
  const [rule, setRule] = useState<'heads' | 'runs' | 'first'>('heads')

  const valueOf = (s: string) =>
    rule === 'heads'
      ? headsIn(s)
      : rule === 'first'
        ? s[0] === 'H'
          ? 1
          : 0
        : s.split('').filter((c, i) => i > 0 && c === s[i - 1]).length

  const values = [...new Set(TOSSES.map(valueOf))].sort((a, b) => a - b)
  const counts = values.map((v) => ({ v, outcomes: TOSSES.filter((s) => valueOf(s) === v) }))

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'heads' as const, label: 'X = number of heads' },
          { id: 'first' as const, label: 'X = 1 if the first is a head' },
          { id: 'runs' as const, label: 'X = number of repeats' },
        ]}
        at={rule}
        onPick={setRule}
      />

      <LabNote>
        Toss a coin three times. The sample space has eight outcomes, and they are <em>not</em> numbers — HTT is not a
        number. A <strong>random variable</strong> is a rule that attaches a number to each one. Press an outcome to
        follow it through.
      </LabNote>

      <div className="flex flex-wrap gap-2">
        {TOSSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setAt(s)}
            className="cursor-pointer rounded-lg border-2 px-3 py-2 font-mono text-[14px] font-semibold"
            style={
              at === s
                ? { borderColor: 'var(--acc)', background: 'var(--acc)', color: '#fff' }
                : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#3f3f46' }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {at && (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <div className="font-mono text-[14px]/[1.9] text-zinc-800">
            X(<strong>{at}</strong>) = <strong style={{ color: 'var(--acc)' }}>{valueOf(at)}</strong>
          </div>
          <p className="mt-1 text-[13px]/[1.6] text-zinc-600">
            The outcome <span className="font-mono">{at}</span> is a thing that happened. The number{' '}
            <span className="font-mono">{valueOf(at)}</span> is what the rule turns it into. Uppercase X is the rule;
            lowercase x is a value it produced — that is the whole reason for the two cases.
          </p>
        </div>
      )}

      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Which outcomes give which value
        </div>
        <div className="flex flex-col gap-1.5">
          {counts.map((c) => (
            <div key={c.v} className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="w-16 font-mono font-semibold">X = {c.v}</span>
              <span className="font-mono text-zinc-600">{c.outcomes.join(', ')}</span>
              <span className="text-zinc-400">
                → {c.outcomes.length} of 8, so P = {c.outcomes.length}/8
              </span>
            </div>
          ))}
        </div>
      </div>

      <Verdict ok>
        X takes {values.length} different values here, and that is a finite list — so this is a{' '}
        <strong>discrete</strong> random variable. A continuous one, like the lifetime of a bulb, can land anywhere in a
        whole interval, and then the probability of any single exact value is 0.
      </Verdict>

      <LabNote>
        The three rules above all act on the same eight outcomes and give completely different variables. That is worth
        noticing: the random variable is not the experiment. It is a question you decide to ask about the experiment.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 15 — pmf and pdf                                                      */
/* ========================================================================== */

export function PmfPdfLab() {
  const [mode, setMode] = useState<'pmf' | 'pdf'>('pmf')
  const [lo, setLo] = useState(0.3)
  const [hi, setHi] = useState(0.7)

  const bars = [0, 1, 2, 3].map((v) => ({ v, p: TOSSES.filter((s) => headsIn(s) === v).length / 8 }))
  const total = bars.reduce((a, b) => a + b.p, 0)
  const area = Math.max(0, hi - lo)

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    if (mode === 'pmf') {
      const f = drawAxes(g, W, H, {
        xmin: -0.6,
        xmax: 3.6,
        ymin: 0,
        ymax: 0.5,
        xlab: 'x = number of heads',
        ylab: 'p(x)',
      })
      const acc = accentColour()
      const bw = (f.R - f.L) / 9
      bars.forEach((b) => {
        g.fillStyle = acc
        g.fillRect(f.px(b.v) - bw / 2, f.py(b.p), bw, f.py(0) - f.py(b.p))
        g.fillStyle = '#3f3f46'
        g.textAlign = 'center'
        g.fillText(`${b.p * 8}/8`, f.px(b.v), f.py(b.p) - 10)
      })
      return f
    }
    const f = drawAxes(g, W, H, { xmin: -0.2, xmax: 1.2, ymin: 0, ymax: 1.4, xlab: 'x', ylab: 'f(x)' })
    const acc = accentColour()
    // Uniform(0,1): a flat line at height 1 between 0 and 1, zero elsewhere.
    g.fillStyle = 'rgba(9,9,11,0.06)'
    g.fillRect(f.px(0), f.py(1), f.px(1) - f.px(0), f.py(0) - f.py(1))
    g.fillStyle = 'rgba(13,148,136,0.3)'
    g.fillRect(f.px(lo), f.py(1), f.px(hi) - f.px(lo), f.py(0) - f.py(1))
    g.strokeStyle = acc
    g.lineWidth = 2.5
    g.beginPath()
    g.moveTo(f.px(-0.2), f.py(0))
    g.lineTo(f.px(0), f.py(0))
    g.lineTo(f.px(0), f.py(1))
    g.lineTo(f.px(1), f.py(1))
    g.lineTo(f.px(1), f.py(0))
    g.lineTo(f.px(1.2), f.py(0))
    g.stroke()
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'pmf' as const, label: 'Discrete — a pmf' },
          { id: 'pdf' as const, label: 'Continuous — a pdf' },
        ]}
        at={mode}
        onPick={setMode}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={310}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={mode}
          handles={mode === 'pdf' ? (f) => [{ id: 'hi', px: f.px(hi), py: f.py(0.5), grab: 'anywhere' }] : undefined}
          onDragTo={mode === 'pdf' ? (_id, x) => setHi(Math.round(clamp(x, lo, 1) * 20) / 20) : undefined}
          caption={
            mode === 'pmf'
              ? 'Each bar is the probability of one exact value. Their heights add to 1.'
              : 'Press or drag to move the right edge. The shaded area is the probability of landing in that range.'
          }
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          {mode === 'pmf' ? (
            <>
              <ReadOutGrid items={bars.map((b) => ({ label: `p(${b.v})`, value: `${b.p * 8}/8` }))} />
              <Verdict ok={Math.abs(total - 1) < 1e-9}>
                The heights add to {total.toFixed(0)} — that is the rule Σ p(x) = 1, and it just says something is
                certain to happen.
              </Verdict>
            </>
          ) : (
            <>
              <Slider
                label="from a"
                value={lo}
                display={lo.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                hint="left edge"
                onChange={(v) => setLo(Math.min(v, hi))}
              />
              <Slider
                label="to b"
                value={hi}
                display={hi.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                hint="right edge"
                onChange={(v) => setHi(Math.max(v, lo))}
              />
              <ReadOutGrid
                items={[
                  { label: 'height f(x)', value: '1' },
                  { label: 'width b − a', value: area.toFixed(2) },
                  { label: 'P(a ≤ X ≤ b)', value: area.toFixed(2) },
                  { label: 'P(X = 0.5)', value: '0' },
                ]}
              />
              <PanelNote>
                Slide 29’s question is P(0.3 ≤ X ≤ 0.7), which is the area of a rectangle 1 high and 0.4 wide — so 0.4.
                Squeeze the two edges together and the area goes to zero: that is why the probability of any one exact
                value is 0.
              </PanelNote>
            </>
          )}
        </div>
      </div>

      <LabNote>
        For a <strong>discrete</strong> variable the <strong>pmf</strong> p(x) is an honest probability: the chance of
        getting exactly x. The bars add to 1.
      </LabNote>
      <LabNote>
        For a <strong>continuous</strong> one the <strong>pdf</strong> f(x) is <em>not</em> a probability — it can even
        be bigger than 1. Only <strong>areas</strong> under it are probabilities. That is the single most confusing
        thing in this part of the course, and the picture is the way through it: you never read a probability off the
        height, you read it off the area.
      </LabNote>
    </LabBox>
  )
}
