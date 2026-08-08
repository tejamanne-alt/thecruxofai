'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { accentColour, clamp, dot, drawAxes, halo, type Frame } from '@/lib/chart/frame'
import { grad, loss } from '@/lib/model/math'
import { useState } from 'react'
import { UsedInAiml } from './algebra'
import {
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

const START = -1.2

export function GradientDescentSession() {
  const [w, setW] = useState(START)
  const [lr, setLr] = useState(0.15)
  const [trail, setTrail] = useState<number[]>([START])

  const j = loss(w)
  const slope = grad(w)
  // "Further from the bottom than where you began" is the honest divergence test.
  const diverging = trail.length > 2 && Math.abs(w - 3) > Math.abs(trail[0] - 3)

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: -2, xmax: 8, ymin: 0, ymax: 30, xlab: 'weight w', ylab: 'loss J(w)' })
    const acc = accentColour()

    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    // The bowl.
    g.strokeStyle = 'rgba(9,9,11,0.55)'
    g.lineWidth = 2
    g.beginPath()
    for (let i = 0; i <= 200; i++) {
      const wv = -2 + (i / 200) * 10
      const x = f.px(wv)
      const y = f.py(loss(wv))
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    }
    g.stroke()

    // The dotted trail of everywhere the ball has been.
    g.strokeStyle = 'rgba(9,9,11,0.2)'
    g.lineWidth = 1
    g.setLineDash([2, 3])
    g.beginPath()
    trail.forEach((wv, i) => {
      const x = f.px(wv)
      const y = f.py(loss(wv))
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    })
    g.stroke()
    g.setLineDash([])

    trail.forEach((wv, i) => {
      if (i < trail.length - 1) {
        const x = f.px(wv)
        const y = f.py(loss(wv))
        dot(g, x, y, 3.5, 'rgba(9,9,11,0.28)')
        if (hover?.kind === 'step' && hover.i === i) halo(g, x, y, 3.5)
      }
    })

    if (hover?.kind === 'curve' && hover.data !== undefined) {
      const x = f.px(hover.data)
      const y = f.py(loss(hover.data))
      dot(g, x, y, 4, 'rgba(9,9,11,0.5)')
      halo(g, x, y, 4)
    }

    // The ball, and the arrow showing which way downhill is.
    const cw = disp.w ?? w
    const cx = f.px(cw)
    const cy = f.py(loss(cw))
    const gr = grad(cw)
    const dir = gr > 0 ? -1 : 1
    g.strokeStyle = acc
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(cx, cy)
    g.lineTo(cx + dir * 46, cy)
    g.stroke()
    g.beginPath()
    g.moveTo(cx + dir * 46, cy)
    g.lineTo(cx + dir * 36, cy - 5)
    g.lineTo(cx + dir * 36, cy + 5)
    g.closePath()
    g.fillStyle = acc
    g.fill()
    dot(g, cx, cy, 8, acc, '#fff')
    g.restore()

    // Sits just above the bottom of the bowl, inside the plot — below the
    // axis it would collide with the x-axis label.
    g.textAlign = 'center'
    g.fillStyle = '#71717a'
    g.fillText('the bottom', f.px(3), f.py(1) - 16)
    return f
  }

  const candidates = (f: Frame) => {
    const out: HitTarget[] = []
    trail.forEach((wv, i) => {
      if (isFinite(wv)) out.push({ kind: 'step', i, px: f.px(wv), py: f.py(loss(wv)) })
    })
    // Sample the curve itself so "what if the dial read w?" is hoverable too.
    for (let i = 0; i <= 40; i++) {
      const wv = -2 + (i / 40) * 10
      out.push({ kind: 'curve', i, data: wv, px: f.px(wv), py: f.py(loss(wv)) })
    }
    return out
  }

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'step') {
      const wv = trail[hit.i]
      if (wv === undefined) return null
      const last = hit.i === trail.length - 1
      const prev = hit.i > 0 ? trail[hit.i - 1] : null
      const gr = grad(wv)
      return {
        title: last ? `Where you are now — step ${hit.i}` : `Step ${hit.i} of the walk`,
        rows: [
          ['w — position on the dial', wv.toFixed(3)],
          ['J(w) — loss here', loss(wv).toFixed(3)],
          [
            '∂J/∂w — slope felt here',
            gr.toFixed(2) +
              (Math.abs(gr) < 0.02
                ? '  — flat, at the bottom'
                : gr > 0
                  ? '  — uphill to the right'
                  : '  — uphill to the left'),
          ],
          prev === null
            ? ['start', 'this is where you began']
            : [`distance moved from step ${hit.i - 1}`, `${wv - prev >= 0 ? '+' : ''}${(wv - prev).toFixed(3)}`],
          ['gap left to the minimum w* = 3', `${3 - wv >= 0 ? '+' : ''}${(3 - wv).toFixed(3)}`],
        ] as Array<[string, string]>,
      }
    }
    if (hit.kind === 'curve' && hit.data !== undefined) {
      const wv = hit.data
      return {
        title: 'A point on the loss curve',
        rows: [
          ['if the dial read w', wv.toFixed(2)],
          ['the loss would be J', loss(wv).toFixed(2)],
          ['slope there', grad(wv).toFixed(2)],
          [
            'meaning',
            Math.abs(wv - 3) < 0.3
              ? 'basically the bottom of the bowl'
              : `the ball would roll ${wv > 3 ? 'left' : 'right'} from here`,
          ],
        ] as Array<[string, string]>,
      }
    }
    return null
  }

  const targets = { w }

  /**
   * Dropping the ball somewhere new starts a fresh walk, so the trail resets to
   * that point. Keeping the old trail would draw a line the ball never took.
   */
  function placeAt(next: number) {
    const nw = Math.round(clamp(next, -2, 8) * 100) / 100
    setW(nw)
    setTrail([nw])
  }

  function step() {
    const nw = w - lr * grad(w)
    setW(nw)
    setTrail((t) => [...t, nw].slice(-40))
  }

  function run20() {
    let cur = w
    const t = [...trail]
    for (let i = 0; i < 20; i++) {
      cur = cur - lr * grad(cur)
      if (!isFinite(cur) || Math.abs(cur) > 1e6) break
      t.push(cur)
    }
    setW(cur)
    setTrail(t.slice(-40))
  }

  const verdict =
    Math.abs(slope) < 0.02
      ? 'Settled at the bottom — the slope is essentially zero, so the steps stop mattering.'
      : diverging
        ? 'Overshooting: each step lands further from the bottom than the last. Lower the step size.'
        : 'Still on the slope. Keep stepping and notice the steps shrinking by themselves.'

  return (
    <div>
      <SessionHeader
        eyebrow="Optimisation"
        title="Gradient descent"
        intro="Imagine standing on a valley wall in thick fog. You can't see the bottom, but you can feel which way is downhill. Take a step that way. Repeat. The step size is the only real decision you make."
      />

      <ChartRow
        chart={
          <ChartCanvas
            draw={draw}
            candidates={candidates}
            tooltip={tooltip}
            targets={targets}
            handles={(fr: Frame) => [{ id: 'w', px: fr.px(w), py: fr.py(j), grab: 'anywhere' }]}
            onDragTo={(_id, dx) => placeAt(dx)}
            caption="Drag the ball along the bowl, or press anywhere to drop it there and start a fresh walk. Hover any step for its numbers."
          />
        }
        panel={
          <>
            <Slider
              label="Step size (learning rate)"
              value={lr}
              display={lr.toFixed(2)}
              min={0.01}
              max={1.2}
              step={0.01}
              hint="Above ~1.0 the steps overshoot and the ball climbs out. Try it."
              onChange={setLr}
            />
            <ReadOutGrid
              items={[
                { label: 'Position w', value: w.toFixed(3) },
                { label: 'Loss', value: j.toFixed(3) },
                { label: 'Slope felt', value: slope.toFixed(2) },
                { label: 'Steps taken', value: String(trail.length - 1) },
              ]}
            />
            <PanelButtons>
              <PanelButton primary onClick={step}>
                One step
              </PanelButton>
              <PanelButton onClick={run20}>Run 20</PanelButton>
              <PanelButton
                onClick={() => {
                  setW(START)
                  setTrail([START])
                }}
              >
                Reset
              </PanelButton>
            </PanelButtons>
            <PanelNote>{verdict}</PanelNote>
          </>
        }
      />

      <Explainers
        plain="Steep wall means big steps, near the bottom the wall flattens so the steps shrink on their own. Nobody tells the ball to slow down — the slope does it."
        breaks="Too big a step and you leap past the bottom, land higher up the far wall, and spiral outwards. Too small and you'll still be walking when the exam starts."
      >
        <MathBlock
          intro="One line does all the work. The legend gives every symbol a meaning and its live value."
          formulas={[
            {
              formula: (
                <>
                  w<sub>new</sub> = w<sub>old</sub> − η · (∂J/∂w)
                </>
              ),
              reading:
                '“New position equals old position minus step size times the slope.” The minus sign is the whole trick — it turns you around to face downhill.',
            },
            {
              formula: 'J(w) = (w − 3)² + 1  ⟹  ∂J/∂w = 2(w − 3)',
              reading:
                'The bowl drawn on the chart. Differentiating it gives the slope at any point, which is the arrow you see on the ball.',
            },
            {
              formula: 'converges when 0 < η < 1  ·  diverges when η > 1',
              reading:
                'For this particular bowl the safe range is exactly this. Push the slider past 1.00 and the ball climbs out — that is the boundary, seen rather than memorised.',
            },
          ]}
          legend={[
            {
              sym: 'w',
              name: 'The thing being tuned',
              note: 'A single dial standing in for every weight in a real model. Horizontal axis.',
              val: `now ${w.toFixed(3)}`,
            },
            {
              sym: 'J(w)',
              name: 'The loss, or cost function',
              note: 'How wrong the model is when the dial reads w. The bowl-shaped curve.',
              val: `now ${j.toFixed(3)}`,
            },
            {
              sym: 'w*',
              name: 'The minimum',
              note: 'The bottom of the bowl — the value we are trying to reach.',
              val: 'w* = 3, J = 1',
            },
            {
              sym: '∂J/∂w',
              name: 'The gradient, or derivative',
              note: 'The steepness at your feet, and which way is up. Read: “rate of change of J as w changes”.',
              val: `now ${slope.toFixed(2)}`,
            },
            {
              sym: '−',
              name: 'The minus sign',
              note: 'The gradient points uphill, so subtracting it moves you downhill. Whole algorithm in one character.',
              val: 'why it descends',
            },
            {
              sym: 'η',
              name: 'Eta — the learning rate',
              note: 'A fraction of the slope to actually walk. Your only real choice.',
              val: `now ${lr.toFixed(2)}`,
            },
            {
              sym: '←',
              name: 'Assignment, not equality',
              note: '“Replace the old value with this new one.” It is an update, not an equation to solve.',
              val: 'one press of “One step”',
            },
            {
              sym: 'η·∂J/∂w',
              name: 'The actual step taken',
              note: 'Step size × steepness. Near the bottom the slope shrinks, so the steps shrink by themselves.',
              val: (lr * slope).toFixed(3),
            },
            {
              sym: '∂',
              name: 'Partial derivative symbol',
              note: 'Used instead of d when a function has several inputs — nudge this one, hold the rest still.',
              val: 'here only one input',
            },
            {
              sym: 't',
              name: 'The step counter, or iteration',
              note: 'One pass of the update rule. Written wₜ₊₁ = wₜ − η∂J/∂wₜ when the order matters.',
              val: `${trail.length - 1} steps taken`,
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It is how essentially every model is trained',
            how: 'Linear and logistic regression, support vector machines and every neural network are fitted by walking downhill on a loss surface. Module M3 of the ML course pairs this with linear regression in lab 2, and the same loop scales unchanged to billions of parameters.',
          },
          {
            what: 'The learning rate is the hyper-parameter you tune first',
            how: 'Too small and training crawls; too large and the steps overshoot and the loss diverges. That is not a subtlety of this page — it is the single most common reason a training run fails, and the reason schedules that shrink the rate over time exist.',
          },
          {
            what: 'Stochastic and mini-batch versions are what actually run',
            how: 'Computing the gradient on all the data at once is exact and expensive. Using one example, or a chunk, gives a noisier step far more cheaply — the batch/mini-batch/online distinction from ML Lecture 1, seen from the optimiser’s side.',
          },
          {
            what: 'Local minima are the honest caveat',
            how: 'Gradient descent finds a bottom, not necessarily the bottom. For a convex loss — least squares, logistic regression — there is only one, which is why those problems are considered solved. For a neural network there are many, and the practical finding is that most are good enough.',
          },
          {
            what: 'The gradient is a vector of partial derivatives',
            how: 'This is why the prerequisites for the ML course list partial derivatives explicitly. The direction of steepest ascent is the vector of them, and backpropagation is the chain rule applied to compute it efficiently through many layers.',
          },
        ]}
      />
    </div>
  )
}
