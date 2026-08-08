'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { accentColour, clamp, dot, drawAxes, halo, type Frame } from '@/lib/chart/frame'
import { pcData } from '@/lib/model/dataset'
import { accuracyOf, misclassified, trainEpoch } from '@/lib/model/math'
import { useState } from 'react'
import { ChartRow, Explainers, MathBlock, PanelButton, PanelButtons, PanelNote, SessionHeader } from './session-parts'

export function PerceptronSession() {
  const [w, setW] = useState<number[]>([0, 0])
  const [b, setB] = useState(0)
  const [epoch, setEpoch] = useState(0)

  const untrained = w[0] === 0 && w[1] === 0
  const acc = accuracyOf(w, b)
  // Derived, not stored — see misclassified(). Dragging the boundary has to
  // change the ringed dots as it moves, or the caption below the chart is lying.
  const wrong = untrained ? [] : misclassified(w, b)

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 10, ymin: 0, ymax: 10, xlab: 'feature 1', ylab: 'feature 2' })
    const acc0 = accentColour()
    const dw = [disp.w0 ?? w[0], disp.w1 ?? w[1]]
    const db = disp.b ?? b

    g.save()
    g.beginPath()
    g.rect(f.L, f.T, f.R - f.L, f.B - f.T)
    g.clip()

    // The neuron's opinion, painted as two shaded half-planes.
    const step = 12
    for (let x = f.L; x < f.R; x += step) {
      for (let y = f.T; y < f.B; y += step) {
        const fx = ((x - f.L) / (f.R - f.L)) * 10
        const fy = 10 - ((y - f.T) / (f.B - f.T)) * 10
        const z = dw[0] * fx + dw[1] * fy + db
        g.fillStyle = dw[0] === 0 && dw[1] === 0 ? 'rgba(9,9,11,0.03)' : z >= 0 ? acc0 + '14' : '#0d948814'
        g.fillRect(x, y, step, step)
      }
    }

    if (dw[0] !== 0 || dw[1] !== 0) {
      g.strokeStyle = '#18181b'
      g.lineWidth = 2.5
      g.beginPath()
      if (Math.abs(dw[1]) > 1e-9) {
        const yA = -(dw[0] * 0 + db) / dw[1]
        const yB = -(dw[0] * 10 + db) / dw[1]
        g.moveTo(f.px(0), f.py(yA))
        g.lineTo(f.px(10), f.py(yB))
      } else {
        const xv = -db / dw[0]
        g.moveTo(f.px(xv), f.py(0))
        g.lineTo(f.px(xv), f.py(10))
      }
      g.stroke()
    }

    pcData.forEach((p, i) => {
      const x = f.px(p.x)
      const y = f.py(p.y)
      dot(g, x, y, 5, p.c > 0 ? acc0 : '#0d9488', wrong.includes(i) ? '#dc2626' : null)
      if (hover?.kind === 'pt' && hover.i === i) halo(g, x, y, 5)
    })
    g.restore()

    g.textAlign = 'left'
    g.fillStyle = acc0
    g.fillText('class +1', f.L + 8, f.T + 10)
    g.fillStyle = '#0d9488'
    g.fillText('class −1', f.L + 8, f.T + 26)
    return f
  }

  const candidates = (f: Frame) => pcData.map((p, i) => ({ kind: 'pt', i, px: f.px(p.x), py: f.py(p.y) }))

  const tooltip = (hit: HitTarget) => {
    const p = pcData[hit.i]
    if (!p) return null
    const z = w[0] * p.x + w[1] * p.y + b
    const pred = z >= 0 ? 1 : -1
    return {
      title: `Training example #${hit.i + 1}`,
      rows: [
        ['x₁, x₂ — its features', `${p.x.toFixed(2)}, ${p.y.toFixed(2)}`],
        ['y — its true class', p.c > 0 ? '+1' : '−1'],
        ['z = w·x + b', untrained ? 'w and b are still zero' : z.toFixed(2)],
        ['ŷ — neuron says', untrained ? 'nothing learned yet' : pred > 0 ? '+1' : '−1'],
        [
          'verdict',
          untrained
            ? 'press “Train one pass”'
            : pred === p.c
              ? 'correct — weights untouched'
              : 'wrong — this point nudges the line',
        ],
        [
          'distance from the boundary',
          untrained ? '—' : (Math.abs(z) / Math.max(1e-6, Math.hypot(w[0], w[1]))).toFixed(2),
        ],
      ] as Array<[string, string]>,
    }
  }

  const targets = { w0: w[0], w1: w[1], b }

  /**
   * Sliding the boundary changes the bias only — the direction w is left alone,
   * so the line moves without turning. That is the honest correspondence: b is
   * exactly the term that shifts a boundary without rotating it.
   *
   * Its value is that you can shove the line somewhere hopeless and then watch
   * a pass or two drag it back.
   */
  function slideBoundary(_id: string, x: number, y: number) {
    if (untrained) return
    setB(clamp(-(w[0] * x + w[1] * y), -50, 50))
  }

  /** The midpoint of the boundary where it crosses the plot — the grab point. */
  function boundaryMid(): { x: number; y: number } | null {
    if (untrained) return null
    if (Math.abs(w[1]) > 1e-9) {
      const y = -(w[0] * 5 + b) / w[1]
      if (y >= 0 && y <= 10) return { x: 5, y }
    }
    if (Math.abs(w[0]) > 1e-9) {
      const x = -(w[1] * 5 + b) / w[0]
      if (x >= 0 && x <= 10) return { x, y: 5 }
    }
    return null
  }

  function trainOne() {
    const next = trainEpoch(w, b)
    setW(next.w)
    setB(next.b)
    setEpoch((e) => e + 1)
  }

  return (
    <div>
      <SessionHeader
        eyebrow="Neural networks"
        title="The perceptron — one neuron learning"
        intro="A single neuron is just a line that says “this side yes, that side no”. It starts out useless. Every time it gets a point wrong, it nudges the line towards that point. Train it one pass at a time and watch the line rotate into place."
      />

      <ChartRow
        chart={
          <ChartCanvas
            draw={draw}
            candidates={candidates}
            tooltip={tooltip}
            targets={targets}
            handles={(fr: Frame) => {
              const mid = boundaryMid()
              return mid ? [{ id: 'boundary', px: fr.px(mid.x), py: fr.py(mid.y), radius: 24, grab: 'anywhere' }] : []
            }}
            onDragTo={slideBoundary}
            caption={
              untrained
                ? 'Train a pass first — there is no boundary to move yet. Hover any dot for what the neuron thinks of it.'
                : 'Drag the black boundary, or press where you want it to pass through, to shove it somewhere hopeless — then train a pass and watch it come back.'
            }
          />
        }
        panel={
          <>
            <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Accuracy</div>
              <div
                className="text-[26px] font-semibold tracking-[-0.02em]"
                style={{ color: acc > 0.95 ? '#0d9488' : acc > 0.7 ? '#09090b' : '#dc2626' }}
              >
                {untrained ? 'untrained' : `${Math.round(acc * 100)}%`}
              </div>
              <div className="text-xs text-zinc-500">
                After {epoch} pass(es) · {untrained ? 'train a pass first' : `${wrong.length} still wrong`}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5">
              {[
                ['weight on x', w[0].toFixed(2)],
                ['weight on y', w[1].toFixed(2)],
                ['bias', b.toFixed(2)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[12.5px]">
                  <span className="text-zinc-600">{label}</span>
                  <span className="font-mono font-semibold text-zinc-950">{value}</span>
                </div>
              ))}
            </div>

            <PanelButtons>
              <PanelButton primary onClick={trainOne}>
                Train one pass
              </PanelButton>
              <PanelButton
                onClick={() => {
                  setW([0, 0])
                  setB(0)
                  setEpoch(0)
                }}
              >
                Forget everything
              </PanelButton>
            </PanelButtons>
            <PanelNote>
              The shaded halves are the neuron’s opinion. Ringed dots are the ones it still gets wrong right now.
            </PanelNote>
          </>
        }
      />

      <Explainers
        plain="Learning here is embarrassingly simple: wrong answer, lean the line towards the point you missed. Correct answer, don't touch anything. Deep networks are this, stacked, with smoother nudges."
        breaks="One straight line can never solve XOR. That single fact stalled the field for a decade, and hidden layers are the answer — they bend the boundary."
      >
        <MathBlock
          intro="A prediction rule and a correction rule. The legend carries every symbol plus its live value from the panel."
          formulas={[
            {
              formula: 'z = w₁x₁ + w₂x₂ + b  ·  ŷ = sign(z)',
              reading:
                '“Weigh up both features, add the bias, then just look at the sign.” Positive → class +1, negative → class −1. z = 0 is exactly the black line on the chart.',
            },
            {
              formula: 'if ŷ ≠ y:  w ← w + η·y·x,  b ← b + η·y',
              reading:
                '“Only when wrong, lean the line towards the point you missed, by an amount proportional to that point’s own coordinates.” Correct points change nothing at all.',
            },
            {
              formula: 'separable ⟹ finite number of updates',
              reading:
                'The perceptron convergence theorem. If one straight line can split the classes, this procedure is guaranteed to find one. If not — XOR — it loops forever.',
            },
          ]}
          legend={[
            {
              sym: 'x₁, x₂',
              name: 'The two features',
              note: 'The coordinates of a dot — the horizontal and vertical axes of the chart.',
              val: 'both 0 → 10',
            },
            {
              sym: 'w₁, w₂',
              name: 'The weights',
              note: 'How much the neuron cares about each feature. Together they set the tilt of the boundary.',
              val: `${w[0].toFixed(2)}, ${w[1].toFixed(2)}`,
            },
            {
              sym: 'b',
              name: 'The bias',
              note: 'Shifts the boundary without rotating it. Lets the line sit away from the origin.',
              val: b.toFixed(2),
            },
            {
              sym: 'z',
              name: 'The weighted sum, pre-activation',
              note: 'One number summarising the dot. Its size says how confidently it sits on one side.',
              val: 'z = 0 is the black line',
            },
            {
              sym: 'w·x',
              name: 'Dot product',
              note: 'Shorthand for w₁x₁ + w₂x₂ — multiply matching pairs, add the results.',
              val: 'the shorthand form',
            },
            {
              sym: 'sign()',
              name: 'The activation function',
              note: 'Throws away magnitude, keeps direction: positive → +1, negative → −1. A hard yes/no.',
              val: 'the two shaded halves',
            },
            {
              sym: 'y',
              name: 'The true label',
              note: 'The real class, written as +1 or −1 so that multiplying by it flips the correction the right way.',
              val: '+1 or −1',
            },
            {
              sym: 'ŷ',
              name: 'The predicted label',
              note: 'What the neuron currently says. Ringed dots are where ŷ ≠ y.',
              val: untrained ? 'train a pass first' : `${wrong.length} still wrong`,
            },
            {
              sym: 'η',
              name: 'Eta — the learning rate',
              note: 'How hard to nudge on each mistake. Fixed here so you can watch the rotation cleanly.',
              val: 'η = 0.1',
            },
            {
              sym: 'ŷ ≠ y',
              name: 'The error condition',
              note: 'The only trigger for learning. Get it right and the weights are left completely alone.',
              val: `accuracy ${untrained ? '—' : `${Math.round(acc * 100)}%`}`,
            },
          ]}
        />
      </Explainers>
    </div>
  )
}
