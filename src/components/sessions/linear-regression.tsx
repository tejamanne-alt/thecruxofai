'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { accentColour, clamp, dot, drawAxes, grip, halo, type Frame } from '@/lib/chart/frame'
import { lrData } from '@/lib/model/dataset'
import { bestFit, mse } from '@/lib/model/math'
import { useState } from 'react'
import {
  AnalogyCallout,
  ChartRow,
  Explainers,
  MathBlock,
  PanelButton,
  PanelButtons,
  PanelNote,
  ReadOut,
  SessionHeader,
  Slider,
} from './session-parts'

const bf = bestFit()
const bestMse = mse(bf.w, bf.b)
const n = lrData.length

export function LinearRegressionSession() {
  const [w, setW] = useState(1.1)
  const [b, setB] = useState(14)
  const [showBest, setShowBest] = useState(false)

  const m = mse(w, b)

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: 10,
      ymin: 0,
      ymax: 45,
      xlab: 'hours studied (x)',
      ylab: 'marks (y)',
    })
    const dw = disp.w ?? w
    const db = disp.b ?? b
    const acc = accentColour()

    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    // The residuals — one dashed hair per student the line lied about.
    g.strokeStyle = 'rgba(9,9,11,0.25)'
    g.lineWidth = 1
    g.setLineDash([3, 3])
    for (const p of lrData) {
      g.beginPath()
      g.moveTo(f.px(p.x), f.py(p.y))
      g.lineTo(f.px(p.x), f.py(dw * p.x + db))
      g.stroke()
    }
    g.setLineDash([])

    if (showBest) {
      g.strokeStyle = '#0d9488'
      g.lineWidth = 2
      g.setLineDash([6, 4])
      g.beginPath()
      g.moveTo(f.px(0), f.py(bf.b))
      g.lineTo(f.px(10), f.py(bf.w * 10 + bf.b))
      g.stroke()
      g.setLineDash([])
    }

    g.strokeStyle = acc
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(f.px(0), f.py(db))
    g.lineTo(f.px(10), f.py(dw * 10 + db))
    g.stroke()

    // Grips at both ends: the left one slides the line, the right one tilts it.
    grip(g, f.px(0), f.py(db), acc)
    grip(g, f.px(10), f.py(dw * 10 + db), acc)

    lrData.forEach((p, i) => {
      const x = f.px(p.x)
      const y = f.py(p.y)
      const on = hover?.kind === 'pt' && hover.i === i
      if (on) {
        // Guide lines down to both axes, so you can read the raw pair off.
        g.strokeStyle = 'rgba(9,9,11,0.3)'
        g.lineWidth = 1
        g.setLineDash([2, 3])
        g.beginPath()
        g.moveTo(f.L, y)
        g.lineTo(x, y)
        g.lineTo(x, f.B)
        g.stroke()
        g.setLineDash([])
      }
      dot(g, x, y, on ? 6 : 4.5, '#18181b', on ? '#fff' : null)
      if (on) halo(g, x, y, 6)
    })
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc
    g.fillText('your line', f.L + 8, f.T + 10)
    if (showBest) {
      g.fillStyle = '#0d9488'
      g.fillText('best possible line', f.L + 8, f.T + 26)
    }
    return f
  }

  const candidates = (f: Frame) => lrData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))

  const tooltip = (hit: HitTarget) => {
    const p = lrData[hit.i]
    if (!p) return null
    const pred = w * p.x + b
    const err = pred - p.y
    return {
      title: `Student #${hit.i + 1}`,
      rows: [
        ['x — the input', `${p.x.toFixed(2)} h`],
        ['y — mark actually scored', p.y.toFixed(1)],
        ['ŷ — mark your line predicts', pred.toFixed(1)],
        [
          'residual (ŷ − y)',
          `${err >= 0 ? '+' : ''}${err.toFixed(1)}${err >= 0 ? '  — line too high' : '  — line too low'}`,
        ],
        ['squared, as counted in MSE', (err * err).toFixed(1)],
      ] as Array<[string, string]>,
    }
  }

  const targets = { w, b }

  /**
   * Two grips on the line rather than one: the left end sets the height, the
   * right end sets the tilt. Dragging a whole line is ambiguous — those two
   * points make it obvious which knob you are turning, and they are exactly
   * the b and w of the formula.
   */
  function dragLine(id: string, x: number, y: number) {
    if (id === 'b') {
      setB(Math.round(clamp(y, -10, 25) * 4) / 4)
      return
    }
    // Right grip: keep b fixed and solve for the slope through the pointer.
    const at = Math.max(1, x)
    setW(Math.round(clamp((y - b) / at, -2, 8) * 20) / 20)
  }

  const errColor = m < bestMse * 1.15 ? '#0d9488' : m < bestMse * 3 ? '#09090b' : '#dc2626'

  return (
    <div>
      <SessionHeader
        eyebrow="Supervised learning"
        title="Linear regression"
        intro="You have a cloud of dots. You want one straight line that passes as close to all of them as possible. Drag the two knobs — tilt and height — and watch how “wrong” the line is."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A class of students each recorded <strong>how many hours they studied</strong> for a test, and afterwards{' '}
            <strong>the marks they scored</strong>. That&rsquo;s it — that is the entire dataset. Every black dot on the
            chart is one student: how far right they sit is their hours, how high up they sit is their marks.
          </>,
          <>
            The question we want answered is:{' '}
            <strong>“if a new student tells me they studied 6 hours, what mark should I expect?”</strong>{' '}There is no
            single dot at exactly 6 hours to look up, and even if there were, one student isn&rsquo;t a rule. So instead
            we draw one straight line through the whole crowd and read the answer off the line.
          </>,
        ]}
        mappings={[
          {
            title: 'Tilt = the payoff per hour',
            body: 'A tilt of 3 says “each extra hour of study is worth about 3 more marks”. That number is the actual insight — it is what you’d tell a student.',
          },
          {
            title: 'Height = the free marks',
            body: 'Where the line starts at zero hours — what someone scores on general knowledge and guesswork alone, having not studied at all.',
          },
          {
            title: 'Error = how badly you’d advise them',
            body: 'Each dashed hair is one student the line lied about. A big total means your advice would be misleading for real people.',
          },
        ]}
        footnote="Swap the two axes for anything you like — flat size and rent, ad spend and sales, engine size and mileage. The maths never changes; only the story does."
      />

      <ChartRow
        chart={
          <ChartCanvas
            draw={draw}
            candidates={candidates}
            tooltip={tooltip}
            targets={targets}
            handles={(fr: Frame) => [
              { id: 'b', px: fr.px(0), py: fr.py(b) },
              { id: 'w', px: fr.px(10), py: fr.py(w * 10 + b) },
            ]}
            onDragTo={dragLine}
            caption="Grab either end of the coloured line — the left end slides it up and down, the right end tilts it. Hover a dot for its own error."
          />
        }
        panel={
          <>
            <Slider
              label="Tilt (slope w)"
              value={w}
              display={w.toFixed(2)}
              min={-2}
              max={8}
              step={0.05}
              hint="How much y climbs for every 1 step of x."
              onChange={setW}
            />
            <Slider
              label="Height (intercept b)"
              value={b}
              display={b.toFixed(2)}
              min={-10}
              max={25}
              step={0.25}
              hint="Where the line crosses x = 0."
              onChange={setB}
            />
            <ReadOut
              label="Average squared error"
              value={m.toFixed(2)}
              note={`Best possible here: ${bestMse.toFixed(2)}`}
              tone={errColor}
            />
            <PanelButtons>
              <PanelButton
                primary
                onClick={() => {
                  setW(Math.round(bf.w * 100) / 100)
                  setB(Math.round(bf.b * 4) / 4)
                  setShowBest(true)
                }}
              >
                Snap to best fit
              </PanelButton>
              <PanelButton onClick={() => setShowBest((v) => !v)}>
                {showBest ? 'Hide best fit' : 'Reveal best fit'}
              </PanelButton>
            </PanelButtons>
            <PanelNote>
              The faint vertical hairs are the mistakes — the gap between what the line predicted and what actually
              happened.
            </PanelNote>
          </>
        }
      />

      <Explainers
        plain="Squaring the mistakes does two things: it makes “too high” and “too low” both count as bad, and it punishes one huge miss far more than several small ones. So the fitted line leans towards keeping everybody roughly happy."
        breaks="One wild outlier drags the whole line towards it, because its squared error is enormous. That's why people reach for robust losses or clean the data first."
      >
        <MathBlock
          intro="Read the formula, then find every symbol in the legend below with what it means and what it currently equals on the chart."
          formulas={[
            {
              formula: 'ŷ = w·x + b',
              reading: '“The mark I predict equals hours studied times the tilt, plus the starting height.”',
            },
            {
              formula: 'MSE = (1/n) · Σᵢ₌₁ⁿ (ŷᵢ − yᵢ)²',
              reading:
                '“For every student: subtract the real mark from my predicted mark, square it, add all of those up, divide by how many students.”',
            },
            {
              formula: 'w* = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²  ·  b* = ȳ − w*·x̄',
              reading:
                'The closed form — the exact answer with no searching. This is literally what the “Snap to best fit” button computes.',
            },
          ]}
          legend={[
            {
              sym: 'x',
              name: 'The input, or feature',
              note: 'What you know up front — here, hours studied. Read off the horizontal axis.',
              val: 'range 0 → 10 hours',
            },
            {
              sym: 'y',
              name: 'The true answer, or target',
              note: 'What actually happened — the real mark. Each black dot is one.',
              val: `${n} real marks plotted`,
            },
            {
              sym: 'ŷ',
              name: '“y-hat” — the prediction',
              note: 'What the line says the mark should be. Not a real observation, a guess.',
              val: 'read off the coloured line',
            },
            {
              sym: 'w',
              name: 'Weight, or slope, or tilt',
              note: 'Marks gained per extra hour studied. Bigger w = steeper line.',
              val: `now ${w.toFixed(2)} · best ${bf.w.toFixed(2)}`,
            },
            {
              sym: 'b',
              name: 'Bias, or intercept, or height',
              note: 'The predicted mark at zero hours — where the line crosses the left edge.',
              val: `now ${b.toFixed(2)} · best ${bf.b.toFixed(2)}`,
            },
            {
              sym: 'n',
              name: 'How many data points',
              note: 'The count of students in the sample. Dividing by it turns a total into an average.',
              val: `n = ${n}`,
            },
            {
              sym: 'Σ',
              name: 'Sigma — “add up all of these”',
              note: 'Subscript i=1 to n means: do the bracket for every point, then total the results.',
              val: `runs over all ${n} points`,
            },
            {
              sym: 'ŷ−y',
              name: 'The residual, or error',
              note: 'One point’s miss. Positive = line too high, negative = too low. The dashed hairs.',
              val: 'one hair per point',
            },
            {
              sym: '( )²',
              name: 'Squared',
              note: 'Kills the minus signs so both directions count as bad, and punishes big misses far harder.',
              val: 'why one outlier hurts',
            },
            {
              sym: 'MSE',
              name: 'Mean squared error — the loss',
              note: 'The single score for how bad the line is. Lower is better; zero means it passes through every dot.',
              val: `now ${m.toFixed(2)} · floor ${bestMse.toFixed(2)}`,
            },
            {
              sym: 'x̄, ȳ',
              name: '“x-bar” — the averages',
              note: 'The mean of all x values and all y values. The line always passes through this centre point.',
              val: 'the balance point of the cloud',
            },
            {
              sym: 'w*, b*',
              name: 'The optimal values',
              note: 'A star means “the best possible”. Solved directly, no trial and error needed.',
              val: 'the “Snap to best fit” button',
            },
          ]}
        />
      </Explainers>
    </div>
  )
}
