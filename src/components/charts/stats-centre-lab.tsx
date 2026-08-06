'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawNumberLine, halo, type Frame } from '@/lib/chart/frame'
import { show, summarise } from '@/lib/model/stats'
import { useState } from 'react'

const TEAL = '#0d9488'
const AMBER = '#d97706'
const RED = '#dc2626'

/** Repeated values pile up instead of hiding behind each other. */
function stack(values: number[]) {
  const seen = new Map<number, number>()
  return values.map((v) => {
    const h = seen.get(v) ?? 0
    seen.set(v, h + 1)
    return h
  })
}

/* ========================================================================== */
/* Mean, median and mode on one line                                          */
/* ========================================================================== */

const PRESETS: Record<string, { label: string; values: number[] }> = {
  ready: { label: 'Time to get ready', values: [39, 29, 43, 52, 39, 44, 40, 31, 44, 35] },
  even: { label: 'Nice and even', values: [30, 34, 38, 40, 40, 42, 46, 50] },
  right: { label: 'One big value', values: [30, 32, 33, 34, 35, 36, 37, 38, 72] },
  left: { label: 'One small value', values: [24, 58, 60, 61, 62, 63, 64, 65, 66] },
}

/**
 * The one picture that makes mean, median and mode stop blurring together.
 * All three markers sit on the same line at the same time, so dragging one dot
 * to the far end shows the mean chasing it while the median barely twitches —
 * which is the whole reason there is more than one measure of centre.
 */
export function CentreLab({
  focus = 'all',
  start = 'ready',
}: {
  focus?: 'mean' | 'median' | 'mode' | 'all' | 'shape'
  start?: keyof typeof PRESETS
}) {
  const [values, setValues] = useState<number[]>(PRESETS[start].values)
  const s = summarise(values)

  const XMIN = 20
  const XMAX = 80
  const heights = stack(values)

  const wanted = (k: 'mean' | 'median' | 'mode') => focus === 'all' || focus === 'shape' || focus === k

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawNumberLine(g, W, H, { xmin: XMIN, xmax: XMAX, xlab: 'value', stacks: 7 })
    const acc = accentColour()

    // Every dot's distance from the mean, drawn faintly. The lecture's point
    // that these always cancel out is much easier to believe when you see them.
    if (wanted('mean')) {
      g.strokeStyle = 'rgba(9,9,11,0.14)'
      g.lineWidth = 1
      values.forEach((v, i) => {
        g.beginPath()
        g.moveTo(f.px(v), f.py(heights[i] + 0.5))
        g.lineTo(f.px(s.mean), f.py(heights[i] + 0.5))
        g.stroke()
      })
    }

    const marker = (x: number, colour: string, label: string, up: number) => {
      g.strokeStyle = colour
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(f.px(x), f.B)
      g.lineTo(f.px(x), f.py(6.2))
      g.stroke()
      g.fillStyle = colour
      g.textAlign = 'center'
      g.fillText(label, f.px(x), f.py(6.2) - up)
    }

    if (wanted('median')) marker(s.median, TEAL, `median ${show(s.median, 1)}`, 4)
    if (wanted('mode') && !s.noMode) s.modes.forEach((m) => marker(m, AMBER, `mode ${show(m, 1)}`, 18))
    if (wanted('mean')) {
      marker(s.mean, acc, `mean ${show(s.mean, 1)}`, 32)
      // A balance point, drawn as one: the lecture calls the mean exactly this.
      g.fillStyle = acc
      g.beginPath()
      g.moveTo(f.px(s.mean), f.B - 2)
      g.lineTo(f.px(s.mean) - 8, f.B + 12)
      g.lineTo(f.px(s.mean) + 8, f.B + 12)
      g.closePath()
      g.fill()
    }

    values.forEach((v, i) => {
      const isOut = s.outliers.includes(v)
      dot(g, f.px(v), f.py(heights[i] + 0.5), 7, isOut ? RED : acc, '#fff')
      if (hover?.kind === 'pt' && hover.i === i) halo(g, f.px(v), f.py(heights[i] + 0.5), 7)
    })
    return f
  }

  const moveDot = (id: string, x: number) => {
    const i = Number(id)
    const v = Math.round(clamp(x, XMIN, XMAX))
    setValues((vs) => vs.map((old, k) => (k === i ? v : old)))
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={(f: Frame) => values.map((v, i) => ({ kind: 'pt', i, px: f.px(v), py: f.py(heights[i] + 0.5) }))}
          tooltip={(hit: HitTarget) => {
            const v = values[hit.i]
            return {
              title: `One value: ${v}`,
              rows: [
                ['distance from the mean', show(v - s.mean, 2)],
                ['that distance, squared', show((v - s.mean) ** 2, 2)],
                ['drag it', 'watch the mean follow, and the median stay put'],
              ] as Array<[string, string]>,
            }
          }}
          targets={Object.fromEntries(values.map((v, i) => [`v${i}`, v]))}
          jumpKey={values.length}
          handles={(f: Frame) => values.map((v, i) => ({ id: String(i), px: f.px(v), py: f.py(heights[i] + 0.5) }))}
          onDragTo={moveDot}
          caption="Every dot is one measurement. Drag any of them along the line and watch the markers move."
        />
      }
      panel={
        <>
          {focus === 'shape' ? (
            <ReadOut
              label="The shape"
              value={
                s.shape === 'symmetric'
                  ? 'Even on both sides'
                  : s.shape === 'right'
                    ? 'Tail to the right'
                    : 'Tail to the left'
              }
              tone={s.shape === 'symmetric' ? TEAL : '#09090b'}
              note={
                s.shape === 'symmetric'
                  ? 'Mean and median sit in about the same place.'
                  : s.shape === 'right'
                    ? 'A few big values drag the mean above the median.'
                    : 'A few small values drag the mean below the median.'
              }
            />
          ) : (
            <ReadOut
              label={focus === 'median' ? 'Median' : focus === 'mode' ? 'Mode' : 'Mean'}
              value={
                focus === 'median'
                  ? show(s.median, 2)
                  : focus === 'mode'
                    ? s.noMode
                      ? 'none'
                      : s.modes.map((m) => show(m, 1)).join(', ')
                    : show(s.mean, 2)
              }
              note={
                focus === 'median'
                  ? 'Half the dots are to its left, half to its right.'
                  : focus === 'mode'
                    ? s.noMode
                      ? 'Every value turns up once, so nothing is the most common.'
                      : 'The value that turns up most often.'
                    : 'Add everything up, divide by how many there are.'
              }
            />
          )}

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]">
            {[
              ['mean', show(s.mean, 2), 'var(--acc)'],
              ['median', show(s.median, 2), TEAL],
              ['mode', s.noMode ? 'none' : s.modes.map((m) => show(m, 1)).join(', '), AMBER],
              ['how many', String(s.n), '#71717a'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex justify-between">
                <span style={{ color: c }}>{k}</span>
                <span className="font-mono font-semibold text-zinc-950">{v}</span>
              </div>
            ))}
            <div className="mt-1 flex justify-between border-t border-zinc-950/[0.08] pt-1.5">
              <span className="text-zinc-600">distances add up to</span>
              <span className="font-mono font-semibold" style={{ color: TEAL }}>
                {show(
                  values.reduce((t, v) => t + (v - s.mean), 0),
                  2
                )}
              </span>
            </div>
          </div>

          <PanelButtons>
            {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((k) => (
              <PanelButton key={k} primary={k === start} onClick={() => setValues(PRESETS[k].values)}>
                {PRESETS[k].label}
              </PanelButton>
            ))}
          </PanelButtons>

          <PanelNote>
            {focus === 'mean'
              ? 'The mean is a balance point. That is why the distances either side always cancel out to zero, and why one value far off to the side can drag it a long way.'
              : focus === 'median'
                ? 'Drag one dot right to the end of the line. The mean chases it. The median hardly moves, because it only cares about the order, not the size.'
                : focus === 'mode'
                  ? 'The mode is the only one of the three that works for things like eye colour, where adding values up would be meaningless.'
                  : 'Press “One big value”. All three markers separate, and the order they end up in tells you which way the data leans.'}
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* Why we square the distances                                                */
/* ========================================================================== */

/**
 * Squared deviations, drawn as actual squares. "We square it so the negatives
 * do not cancel" is the usual line, and it always sounds like a dodge. Seeing
 * one square swell four times as big when a dot moves twice as far explains
 * both the squaring and why one outlier dominates the answer.
 */
export function VarianceLab() {
  const [values, setValues] = useState<number[]>([2, 8, 5, 3, 7, 8, 5, 2, 5])
  const s = summarise(values)
  const XMIN = 0
  const XMAX = 16

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawNumberLine(g, W, H, { xmin: XMIN, xmax: XMAX, xlab: 'value', stacks: 6, baseline: 150 })
    const acc = accentColour()

    g.strokeStyle = acc
    g.lineWidth = 2
    g.setLineDash([5, 4])
    g.beginPath()
    g.moveTo(f.px(s.mean), 20)
    g.lineTo(f.px(s.mean), f.B)
    g.stroke()
    g.setLineDash([])
    g.fillStyle = acc
    g.textAlign = 'center'
    g.fillText(`mean ${show(s.mean, 2)}`, f.px(s.mean), 14)

    const heights = stack(values)
    values.forEach((v, i) => {
      dot(g, f.px(v), f.py(heights[i] + 0.5), 6, acc, '#fff')
      if (hover?.kind === 'pt' && hover.i === i) halo(g, f.px(v), f.py(heights[i] + 0.5), 6)
    })

    // One square per value, side proportional to how far it sits from the mean.
    // Area is then the squared distance, to the same scale for every square.
    const perUnit = 13
    let x = f.L
    const baseY = H - 24
    values.forEach((v, i) => {
      const d = Math.abs(v - s.mean)
      const side = Math.max(3, d * perUnit)
      if (x + side > f.R) return
      g.fillStyle = hover?.kind === 'pt' && hover.i === i ? 'rgba(220,38,38,0.35)' : 'rgba(13,148,136,0.28)'
      g.fillRect(x, baseY - side, side, side)
      g.strokeStyle = hover?.kind === 'pt' && hover.i === i ? RED : TEAL
      g.lineWidth = 1.5
      g.strokeRect(x, baseY - side, side, side)
      x += side + 5
    })

    g.textAlign = 'left'
    g.fillStyle = '#71717a'
    g.fillText('each square = one distance, squared. Their total area is the sum of squares.', f.L, baseY + 14)
    return f
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={430}
          draw={draw}
          candidates={(f: Frame) => {
            const heights = stack(values)
            return values.map((v, i) => ({ kind: 'pt', i, px: f.px(v), py: f.py(heights[i] + 0.5) }))
          }}
          tooltip={(hit: HitTarget) => {
            const v = values[hit.i]
            const d = v - s.mean
            return {
              title: `Value ${v}`,
              rows: [
                ['distance from the mean', show(d, 3)],
                ['squared', show(d * d, 3)],
                ['share of the total', `${show((d * d * 100) / (s.ss || 1), 1)}%`],
                ['drag it further out', 'the square grows much faster than the distance does'],
              ] as Array<[string, string]>,
            }
          }}
          targets={Object.fromEntries(values.map((v, i) => [`v${i}`, v]))}
          handles={(f: Frame) => {
            const heights = stack(values)
            return values.map((v, i) => ({ id: String(i), px: f.px(v), py: f.py(heights[i] + 0.5) }))
          }}
          onDragTo={(id, x) =>
            setValues((vs) => vs.map((old, k) => (k === Number(id) ? Math.round(clamp(x, XMIN, XMAX)) : old)))
          }
          caption="Drag a dot away from the dashed mean line and watch its square swell. Double the distance, four times the area."
        />
      }
      panel={
        <>
          <ReadOut
            label="Standard deviation"
            value={show(s.sd, 3)}
            note="The typical distance of a value from the mean, in the original units."
          />
          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5 font-mono text-[12.5px]">
            {[
              ['mean', show(s.mean, 3)],
              ['sum of squares (SS)', show(s.ss, 2)],
              ['variance s² = SS/(n−1)', show(s.variance, 3)],
              ['s = √variance', show(s.sd, 3)],
              ['n', String(s.n)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="font-sans text-zinc-600">{k}</span>
                <span className="font-semibold text-zinc-950">{v}</span>
              </div>
            ))}
          </div>
          <PanelButtons>
            <PanelButton primary onClick={() => setValues([2, 8, 5, 3, 7, 8, 5, 2, 5])}>
              Group 1
            </PanelButton>
            <PanelButton onClick={() => setValues([1, 15, 5, 5, 6, 3, 5, 2, 3])}>Group 2</PanelButton>
            <PanelButton onClick={() => setValues([5, 5, 5, 5, 5, 5, 5, 5, 5])}>All the same</PanelButton>
          </PanelButtons>
          <PanelNote>
            Both groups from the lecture have a mean of 5. Group 1 has a sum of squares of 44, group 2 has 134. Same
            centre, very different spread — which is exactly why the centre alone is not enough.
          </PanelNote>
        </>
      }
    />
  )
}
