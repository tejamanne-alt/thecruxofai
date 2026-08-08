'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { accentColour, clamp, dot, drawAxes, halo, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'
import {
  AnalogyCallout,
  ChartRow,
  Explainers,
  MathBlock,
  PanelButton,
  PanelButtons,
  PanelNote,
  ReadOutGrid,
  SessionHeader,
  Slider,
} from './session-parts'

/**
 * The second stage of the pipeline. `none` leaves a straight line; the other
 * three are the actual activation functions a neural network uses, so the
 * moment you pick one you are looking at a one-neuron network.
 */
const STAGES = {
  none: { label: 'nothing — pass it straight through', formula: 'g(z) = z', fn: (z: number) => z },
  square: { label: 'square it', formula: 'g(z) = z²', fn: (z: number) => z * z },
  relu: { label: 'ReLU — keep it if positive, else 0', formula: 'g(z) = max(0, z)', fn: (z: number) => Math.max(0, z) },
  sigmoid: {
    label: 'sigmoid — squash into 0…1',
    formula: 'g(z) = 1 / (1 + e⁻ᶻ)',
    fn: (z: number) => 1 / (1 + Math.exp(-z)),
  },
} as const

type StageId = keyof typeof STAGES

const XMIN = -5
const XMAX = 5
const SAMPLES = 120

export function AlgebraSession() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(1)
  const [x, setX] = useState(1.5)
  const [stage, setStage] = useState<StageId>('relu')

  const g = STAGES[stage]
  const f = (v: number) => a * v + b
  const chain = (v: number) => g.fn(f(v))

  const z = f(x)
  const y = chain(x)
  // Where the inner rule crosses zero — the one-line piece of algebra everyone
  // actually remembers, and it is visible on the chart.
  const root = a === 0 ? null : -b / a

  // A fixed window keeps the curve comparable as you turn the knobs. Sigmoid
  // lives in 0…1, so it gets its own range or it would be a flat smear.
  //
  // Each range is a multiple of 5 wide, because drawAxes cuts it into five —
  // -12…18 gives ticks at -12,-6,0,6,12,18 rather than 7.2 and -5.6. Sigmoid
  // sits exactly on 0…1 and its curve hugs both edges, which is the honest
  // picture: it approaches them and never arrives.
  const [ymin, ymax] = stage === 'sigmoid' ? [0, 1] : stage === 'square' ? [0, 30] : [-12, 18]

  const draw = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    { hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const fr = drawAxes(ctx, W, H, { xmin: XMIN, xmax: XMAX, ymin, ymax, xlab: 'input x', ylab: 'output' })
    const acc = accentColour()

    ctx.save()
    ctx.beginPath()
    ctx.rect(fr.L, fr.T, fr.R - fr.L, fr.B - fr.T)
    ctx.clip()

    // The zero line, so "solve for zero" has something to point at.
    ctx.strokeStyle = 'rgba(9,9,11,0.25)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(fr.L, fr.py(0))
    ctx.lineTo(fr.R, fr.py(0))
    ctx.stroke()
    ctx.setLineDash([])

    // Stage one on its own — the straight line before anything is done to it.
    ctx.strokeStyle = '#0d9488'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(fr.px(XMIN), fr.py(f(XMIN)))
    ctx.lineTo(fr.px(XMAX), fr.py(f(XMAX)))
    ctx.stroke()
    ctx.setLineDash([])

    // The two stages composed. This is the curve the whole page is about.
    ctx.strokeStyle = acc
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= SAMPLES; i++) {
      const v = XMIN + (i / SAMPLES) * (XMAX - XMIN)
      const px = fr.px(v)
      const py = fr.py(chain(v))
      if (i) ctx.lineTo(px, py)
      else ctx.moveTo(px, py)
    }
    ctx.stroke()

    if (root !== null && root >= XMIN && root <= XMAX) {
      dot(ctx, fr.px(root), fr.py(0), 4, '#0d9488', '#fff')
    }

    // The chosen input, traced up to the curve and across to the answer.
    const mx = fr.px(x)
    const my = fr.py(y)
    ctx.strokeStyle = 'rgba(9,9,11,0.35)'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(mx, fr.py(0))
    ctx.lineTo(mx, my)
    ctx.lineTo(fr.L, my)
    ctx.stroke()
    ctx.setLineDash([])
    dot(ctx, mx, my, 7, acc, '#fff')
    if (hover?.kind === 'now') halo(ctx, mx, my, 7)

    ctx.restore()

    ctx.textAlign = 'left'
    ctx.fillStyle = '#0d9488'
    ctx.fillText('stage 1 only:  a·x + b', fr.L + 8, fr.T + 10)
    ctx.fillStyle = acc
    ctx.fillText(`both stages:  ${g.formula.replace('g(z)', 'g(a·x + b)')}`, fr.L + 8, fr.T + 26)
    return fr
  }

  const candidates = (fr: Frame) => {
    const out: HitTarget[] = [{ kind: 'now', i: 0, px: fr.px(x), py: fr.py(y) }]
    for (let i = 0; i <= 40; i++) {
      const v = XMIN + (i / 40) * (XMAX - XMIN)
      out.push({ kind: 'curve', i, data: v, px: fr.px(v), py: fr.py(chain(v)) })
    }
    if (root !== null && root >= XMIN && root <= XMAX) {
      out.push({ kind: 'root', i: 0, px: fr.px(root), py: fr.py(0) })
    }
    return out
  }

  // The marker only has one degree of freedom — it lives on the curve — so a
  // drag reads the x and lets the curve decide the height. Vertical movement is
  // deliberately ignored rather than fought with.
  const moveTo = (x: number) => setX(Math.round(clamp(x, XMIN, XMAX) * 10) / 10)

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'root') {
      return {
        title: 'Where stage 1 hits zero',
        rows: [
          ['solve', 'a·x + b = 0'],
          ['rearrange', 'x = −b / a'],
          ['here', `x = −(${b.toFixed(2)}) / ${a.toFixed(2)} = ${root!.toFixed(3)}`],
          ['why it matters', 'training asks exactly this: where does the slope go to zero?'],
        ] as Array<[string, string]>,
      }
    }
    const v = hit.kind === 'now' ? x : (hit.data ?? 0)
    return {
      title: hit.kind === 'now' ? 'The input you picked' : 'A point on the curve',
      rows: [
        ['x — what goes in', v.toFixed(2)],
        ['z = a·x + b — after stage 1', f(v).toFixed(3)],
        [`g(z) — after stage 2 (${stage})`, chain(v).toFixed(3)],
        ['read it as', `${a.toFixed(2)} × ${v.toFixed(2)} + ${b.toFixed(2)} = ${f(v).toFixed(2)}, then ${stage}`],
      ] as Array<[string, string]>,
    }
  }

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations"
        title="Algebra"
        intro="Algebra is arithmetic with a box you have not filled in yet. Give the box a letter, and one line of writing can describe a rule that works for every number at once. Turn the knobs below and watch the rule change shape."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Think of a coffee shop. A flat white costs <strong>₹200</strong>, and there is a <strong>₹30</strong>{' '}
            delivery fee no matter how many you order. If you order <em>x</em> coffees you pay{' '}
            <strong>200x + 30</strong>. That’s it — that is algebra. The letter <em>x</em> is not mysterious; it is a
            box waiting for a number, and the sentence stays true whichever number you drop in.
          </>,
          <>
            The chart below is that same idea drawn as a picture. <strong>Stage 1</strong> is your price rule: multiply
            by something, then add something. But real questions are rarely that straight, so <strong>stage 2</strong>{' '}
            does one more thing to the answer — squash it, or throw away the negatives. Two simple rules, one after the
            other, and a straight line becomes a curve.
          </>,
        ]}
        mappings={[
          {
            title: 'a = the per-item rate',
            body: 'How much the answer moves for every 1 you add to the input. In a model this is a weight — how much the model cares about that input.',
          },
          {
            title: 'b = the flat fee',
            body: 'What you get when the input is zero. In a model this is the bias, and it lets the rule sit anywhere instead of always starting from the origin.',
          },
          {
            title: 'g = the second rule',
            body: 'Something done to the answer afterwards. Without it, stacking rules gets you nowhere — two straight lines in a row are still just a straight line.',
          },
        ]}
        footnote="Change the coffee to hours studied, rainfall, or pixel brightness. The letters do not care what they stand for — that is the entire reason algebra is worth learning."
      />

      <ChartRow
        chart={
          <ChartCanvas
            draw={draw}
            candidates={candidates}
            tooltip={tooltip}
            targets={{ x, a, b }}
            handles={(fr: Frame) => [{ id: 'x', px: fr.px(x), py: fr.py(y), grab: 'anywhere' }]}
            onDragTo={(_id, dx) => moveTo(dx)}
            caption="Press anywhere on the plot to send the marker there, or drag it along the curve. Hover any point for the arithmetic behind it."
          />
        }
        panel={
          <>
            <Slider
              label="a — the rate"
              value={a}
              display={a.toFixed(2)}
              min={-3}
              max={3}
              step={0.05}
              hint="Multiply the input by this."
              onChange={setA}
            />
            <Slider
              label="b — the flat part"
              value={b}
              display={b.toFixed(2)}
              min={-6}
              max={6}
              step={0.1}
              hint="Then add this."
              onChange={setB}
            />
            <Slider
              label="x — the input"
              value={x}
              display={x.toFixed(2)}
              min={XMIN}
              max={XMAX}
              step={0.1}
              hint="The number you drop into the box."
              onChange={setX}
            />

            <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                Stage 2 — then do this
              </div>
              <div className="flex flex-col gap-1">
                {(Object.keys(STAGES) as StageId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStage(id)}
                    className={
                      'cursor-pointer rounded-md px-2 py-1.5 text-left text-[12px]/[1.4] ' +
                      (stage === id ? 'font-semibold text-zinc-950' : 'text-zinc-600 hover:bg-zinc-950/[0.04]')
                    }
                    style={stage === id ? { background: 'var(--acc-12)' } : undefined}
                  >
                    {STAGES[id].label}
                  </button>
                ))}
              </div>
            </div>

            <ReadOutGrid
              items={[
                { label: 'x in', value: x.toFixed(2) },
                { label: 'z after stage 1', value: z.toFixed(2) },
                { label: 'y out', value: y.toFixed(3) },
                { label: 'zero at x =', value: root === null ? '—' : root.toFixed(2) },
              ]}
            />

            <PanelButtons>
              <PanelButton
                primary
                onClick={() => {
                  setA(2)
                  setB(1)
                  setX(1.5)
                  setStage('relu')
                }}
              >
                Reset
              </PanelButton>
              <PanelButton onClick={() => setStage('none')}>Straighten it</PanelButton>
            </PanelButtons>

            <PanelNote>
              Set stage 2 to “nothing” and the curve becomes a straight line, whatever you do to a and b. That is the
              whole reason deep learning needs a stage 2.
            </PanelNote>
          </>
        }
      />

      <Explainers
        plain="A letter is a placeholder, and a formula is a machine: put a number in the left, get a number out the right. Solving means running the machine backwards — you know what came out, and you want to know what went in."
        breaks="Stacking straight rules is a trap. Do a·x+b, then c·z+d, and you get one straight rule again — you have done twice the work for none of the power. Only a bend in the middle buys you anything."
      >
        <MathBlock
          intro="Four lines. The first two are the stages on the chart, the third stacks them, and the fourth is the piece of school algebra that training actually uses."
          formulas={[
            {
              formula: 'f(x) = a·x + b',
              reading:
                '“Multiply the input by the rate, then add the flat part.” a tilts the line, b slides it up and down. Every straight-line rule you will ever meet is this.',
            },
            {
              formula: STAGES[stage].formula,
              reading:
                'Stage 2 — the bend. Applied to whatever stage 1 produced. Pick “nothing” and the whole pipeline collapses back to a straight line.',
            },
            {
              formula: '(g ∘ f)(x) = g(f(x))',
              reading:
                '“Do f, then feed the answer into g.” The small circle means composition — one machine plugged into the next. Stack that a hundred times and you have a deep neural network.',
            },
            {
              formula: 'a·x + b = 0  ⟹  x = −b / a',
              reading:
                'Solving: strip away what surrounds x until it stands alone. Subtract b from both sides, divide both sides by a. The teal dot on the chart is this answer.',
            },
          ]}
          legend={[
            {
              sym: 'x',
              name: 'The unknown, or the input',
              note: 'The box you have not filled in. In a model, one piece of what you know about a thing.',
              val: `now ${x.toFixed(2)}`,
            },
            {
              sym: 'a',
              name: 'Coefficient — the multiplier',
              note: 'A number sitting in front of a letter means multiply. In machine learning this is a weight.',
              val: `now ${a.toFixed(2)}`,
            },
            {
              sym: 'b',
              name: 'Constant — the standalone number',
              note: 'It does not depend on the input at all. In machine learning this is the bias.',
              val: `now ${b.toFixed(2)}`,
            },
            {
              sym: 'z',
              name: 'The middle answer',
              note: 'What stage 1 produced, before stage 2 touched it. In a neuron this is the pre-activation.',
              val: `now ${z.toFixed(3)}`,
            },
            {
              sym: 'f(x)',
              name: '“f of x” — a named machine',
              note: 'Not f times x. It means “the machine called f, run on x”. The brackets hold the input.',
              val: 'the dashed teal line',
            },
            {
              sym: 'g',
              name: 'The second machine',
              note: 'Applied after f. In a network this is the activation function, and it is what makes depth worth having.',
              val: STAGES[stage].formula,
            },
            {
              sym: '∘',
              name: 'Composition — “after”',
              note: 'g ∘ f means g after f. Read right to left, which trips everyone up at least once.',
              val: 'the accent curve',
            },
            {
              sym: '⟹',
              name: 'Therefore',
              note: '“From the line above, this follows.” It is a signpost in an argument, not an operation.',
              val: 'used when solving',
            },
            {
              sym: '=',
              name: 'Equals — a balance, not a command',
              note: 'Both sides weigh the same. Do a thing to one side, do it to the other, and it stays true. That is permission to rearrange.',
              val: 'why solving works',
            },
            {
              sym: 'y',
              name: 'The output',
              note: 'What falls out of the far end of the pipeline. In a model, the prediction.',
              val: `now ${y.toFixed(3)}`,
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'a and b are the only things a model learns',
            how: 'Training is a search for the numbers that make the rule fit. When you hear "a model with 7 billion parameters", those are 7 billion values of a and b.',
          },
          {
            what: 'One neuron is literally this page',
            how: 'A neuron computes a·x + b and then applies g. The perceptron session is this same pipeline with two inputs instead of one.',
          },
          {
            what: 'ReLU is why deep networks work',
            how: 'max(0, z) is the most-used stage 2 in deep learning. It costs almost nothing to compute, and it is the bend that stops a hundred stacked layers collapsing into one.',
          },
          {
            what: 'Sigmoid turns a score into a probability',
            how: 'Any number in, something between 0 and 1 out. That is how a classifier reports "83% sure" instead of an unbounded score.',
          },
          {
            what: 'Solving for zero is what training does',
            how: 'The best setting is where the slope of the error is zero. Gradient descent is a way of finding that when you cannot rearrange for it directly.',
          },
          {
            what: 'Composition is the meaning of "deep"',
            how: 'Depth is nothing more exotic than g(f(g(f(…)))). Each layer is simple; the stack is what does the work.',
          },
        ]}
      />
    </div>
  )
}

/** Shared by both foundation pages: the "so what" table. */
export function UsedInAiml({ rows }: { rows: Array<{ what: string; how: string }> }) {
  return (
    <div className="mt-7">
      <h2 className="mb-1.5 text-lg font-semibold tracking-[-0.02em]">Where this shows up in AI & ML</h2>
      <p className="mb-4 max-w-[680px] text-[14px]/[1.6] text-zinc-600">
        Not “you will need this one day” — these are the places the idea appears by name, in things you have already met
        on this site.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
        {rows.map((r) => (
          <div key={r.what} className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
            <span className="text-[13.5px] font-semibold text-zinc-950">{r.what}</span>
            <span className="text-[12.5px]/[1.6] text-zinc-600">{r.how}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
