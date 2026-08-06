'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { ChartRow, PanelButton, PanelButtons, PanelNote, ReadOut } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawNumberLine, halo, type Frame } from '@/lib/chart/frame'
import { ISM_DATA, show, summarise, type IsmDataKey } from '@/lib/model/stats'
import clsx from 'clsx'
import { useState } from 'react'

const TEAL = '#0d9488'
const AMBER = '#d97706'
const RED = '#dc2626'

/* ========================================================================== */
/* Why the sample formula divides by n − 1                                    */
/* ========================================================================== */

/**
 * The n − 1 is the single most-asked "but why?" of the lecture, and no amount
 * of prose settles it. Drawing samples and watching one estimate sit low while
 * the other lands on the true value does settle it, in about twenty presses.
 */
const POP_SIZE = 400
const POP_MEAN = 50
const POP_SD = 12

/** A fixed population, so the numbers are the same for everyone. */
function buildPopulation() {
  let seed = 7
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const out: number[] = []
  for (let i = 0; i < POP_SIZE; i++) {
    // Twelve uniforms added up is close enough to a bell shape for this.
    let t = 0
    for (let k = 0; k < 12; k++) t += rnd()
    out.push(POP_MEAN + (t - 6) * POP_SD)
  }
  return out
}
const POPULATION = buildPopulation()
const TRUE_VAR =
  POPULATION.reduce((s, v) => s + (v - POPULATION.reduce((a, b) => a + b, 0) / POP_SIZE) ** 2, 0) / POP_SIZE

/** One estimate's running average, against the true value marked in black. */
function EstimateBar({
  label,
  value,
  err,
  colour,
  show: on,
}: {
  label: string
  value: number
  err: number
  colour: string
  show: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12.5px]">
        <span className="text-zinc-700">{label}</span>
        <span className="font-mono font-semibold" style={{ color: colour }}>
          {on ? show(value, 1) : '—'}
          {on && (
            <span className="ml-2 text-[11px]">
              {err > 0 ? '+' : ''}
              {show(err, 1)}%
            </span>
          )}
        </span>
      </div>
      <div className="relative h-[20px] overflow-hidden rounded-md bg-zinc-950/[0.05]">
        <div
          className="h-full transition-[width] duration-200"
          style={{ width: `${Math.min(100, (value / (TRUE_VAR * 1.6)) * 100)}%`, background: colour, opacity: 0.85 }}
        />
        <div className="absolute inset-y-0 w-[2px] bg-zinc-900" style={{ left: `${(1 / 1.6) * 100}%` }} />
      </div>
    </div>
  )
}

export function SampleSizeLab() {
  const [n, setN] = useState(5)
  const [draws, setDraws] = useState(0)
  const [sumOverN, setSumOverN] = useState(0)
  const [sumOverN1, setSumOverN1] = useState(0)
  const [last, setLast] = useState<number[]>([])
  const [seed, setSeed] = useState(1)

  function drawSamples(times: number) {
    let s = seed
    const rnd = () => {
      s = (s * 1103515245 + 12345) % 2147483648
      return s / 2147483648
    }
    let addN = 0
    let addN1 = 0
    let shown: number[] = []
    for (let t = 0; t < times; t++) {
      const pick: number[] = []
      for (let i = 0; i < n; i++) pick.push(POPULATION[Math.floor(rnd() * POP_SIZE)])
      const m = pick.reduce((a, b) => a + b, 0) / n
      const ss = pick.reduce((a, v) => a + (v - m) ** 2, 0)
      addN += ss / n
      addN1 += ss / (n - 1)
      shown = pick
    }
    setSeed(s)
    setDraws((d) => d + times)
    setSumOverN((v) => v + addN)
    setSumOverN1((v) => v + addN1)
    setLast(shown)
  }

  function reset() {
    setDraws(0)
    setSumOverN(0)
    setSumOverN1(0)
    setLast([])
  }

  const avgN = draws ? sumOverN / draws : 0
  const avgN1 = draws ? sumOverN1 / draws : 0
  const errN = draws ? ((avgN - TRUE_VAR) / TRUE_VAR) * 100 : 0
  const errN1 = draws ? ((avgN1 - TRUE_VAR) / TRUE_VAR) * 100 : 0

  return (
    <div className="grid items-start gap-5 rounded-lg border border-zinc-950/10 p-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-4">
        <p className="text-[13px]/[1.65] text-zinc-700">
          There is a population of {POP_SIZE} values hiding behind this. Its true variance is{' '}
          <strong>{show(TRUE_VAR, 1)}</strong> — the black line on both bars. Take small samples from it and work the
          variance out both ways. One of them keeps landing short.
        </p>

        <EstimateBar label="divide by n  (too small)" value={avgN} err={errN} colour={RED} show={draws > 0} />
        <EstimateBar label="divide by n − 1  (right)" value={avgN1} err={errN1} colour={TEAL} show={draws > 0} />

        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-3.5">
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Your last sample
          </div>
          <div className="font-mono text-[12.5px] text-zinc-800">
            {last.length ? last.map((v) => show(v, 1)).join('   ') : 'press “Take a sample”'}
          </div>
        </div>

        <p className="text-[13px]/[1.65] text-zinc-700">
          Why does dividing by n come out low? Because you measured the spread around the <em>sample&rsquo;s own</em>{' '}
          mean, and that mean has already shuffled itself to sit in the middle of those few values. So they look closer
          together than they really are. Dividing by n − 1 instead of n makes up the difference.
        </p>
      </div>

      <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
        <ReadOut
          label="Samples taken"
          value={String(draws)}
          note={draws < 30 ? 'Keep going — the gap is clearest after 50 or so.' : 'Now look at the two percentages.'}
        />
        <div>
          <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
            <span>values per sample</span>
            <span className="text-zinc-500">{n}</span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value))
              reset()
            }}
            className="crux-slider"
            style={{ '--pct': `${((n - 2) / 18) * 100}%` } as React.CSSProperties}
            aria-label="values per sample"
          />
          <p className="mt-1.5 text-xs text-zinc-500">Small samples suffer most. Try 2, then try 20.</p>
        </div>
        <PanelButtons>
          <PanelButton primary onClick={() => drawSamples(1)}>
            Take a sample
          </PanelButton>
          <PanelButton onClick={() => drawSamples(100)}>Take 100</PanelButton>
        </PanelButtons>
        <PanelButtons>
          <PanelButton onClick={reset}>Start over</PanelButton>
        </PanelButtons>
        <PanelNote>
          At n = 2 the wrong formula is out by about 50%. At n = 20 it is out by about 5%. The smaller the sample, the
          more the correction matters — which is why it exists at all.
        </PanelNote>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* Quartiles, by the lecture's own counting rule                              */
/* ========================================================================== */

/**
 * Quartiles are where a class quietly splits into people getting different
 * answers, because there are several rules in use. This shows the positions
 * being counted the way the lecture counts them, so the homework matches.
 */
export function QuartileLab() {
  const [values, setValues] = useState<number[]>([...ISM_DATA.ordered.values])
  const s = summarise(values)
  const n = values.length
  const posQ1 = (n + 1) / 4
  const posMed = (n + 1) / 2
  const posQ3 = (3 * (n + 1)) / 4

  const between = (pos: number) => {
    const lo = Math.floor(pos)
    const frac = pos - lo
    if (frac === 0 || lo < 1 || lo >= n) return `value at position ${pos}`
    return `${frac === 0.5 ? 'halfway' : `${show(frac * 100, 0)}% of the way`} between positions ${lo} and ${lo + 1}`
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 p-4">
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {s.sorted.map((v, i) => {
            const nearQ1 = Math.abs(i + 1 - posQ1) < 1
            const nearMed = Math.abs(i + 1 - posMed) < 1
            const nearQ3 = Math.abs(i + 1 - posQ3) < 1
            const colour = nearQ1 ? AMBER : nearMed ? TEAL : nearQ3 ? AMBER : null
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-zinc-400">{i + 1}</span>
                <span
                  className="min-w-[46px] rounded-md px-2 py-2 text-center font-mono text-[13px] tabular-nums"
                  style={
                    colour
                      ? { background: `${colour}22`, color: colour, fontWeight: 700 }
                      : { background: 'rgba(9,9,11,0.04)', color: '#3f3f46' }
                  }
                >
                  {show(v, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Q1 — the 25% mark', posQ1, s.q1, AMBER],
          ['Median — the 50% mark', posMed, s.median, TEAL],
          ['Q3 — the 75% mark', posQ3, s.q3, AMBER],
        ].map(([label, pos, val, colour]) => (
          <div key={String(label)} className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: colour as string }}>
              {label as string}
            </div>
            <div className="mt-0.5 font-mono text-[20px] font-semibold text-zinc-950">{show(val as number, 2)}</div>
            <div className="mt-1 font-mono text-[11.5px] text-zinc-500">position = {show(pos as number, 2)}</div>
            <div className="text-[11.5px]/[1.5] text-zinc-500">{between(pos as number)}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          How the positions are worked out
        </div>
        <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
          {`n = ${n}

position of Q1     = 1 × (n + 1) / 4 = ${show(posQ1, 2)}
position of median = 2 × (n + 1) / 4 = ${show(posMed, 2)}
position of Q3     = 3 × (n + 1) / 4 = ${show(posQ3, 2)}`}
        </div>
        <p className="mt-2 text-[12.5px]/[1.6] text-zinc-600">
          If a position lands between two values, take the value part-way between them. There is more than one rule for
          this in the world; the numbers above use the one from the lecture, so they will match your homework.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ordered', 'gettingReady', 'funds', 'chickenFat'] as IsmDataKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setValues([...ISM_DATA[k].values])}
            className={clsx(
              'cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] font-semibold',
              values.length === ISM_DATA[k].values.length &&
                values.every((v, i) => v === [...ISM_DATA[k].values].sort((a, b) => a - b)[i] || true)
                ? 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
                : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
            )}
          >
            {ISM_DATA[k].name}
          </button>
        ))}
      </div>

      <PanelNote>
        Five numbers describe the whole set: the smallest ({show(s.min, 1)}), Q1 ({show(s.q1, 2)}), the median (
        {show(s.median, 2)}), Q3 ({show(s.q3, 2)}) and the largest ({show(s.max, 1)}). That is the five-point summary.
      </PanelNote>
    </div>
  )
}

/* ========================================================================== */
/* Box plot, fences and outliers                                              */
/* ========================================================================== */

/** A fixed axis window: the data's own span, with the same again either side. */
function windowFor(values: number[]) {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  return { lo: lo - span, hi: hi + span }
}

/**
 * A box plot built from data you can drag. Outlier rules are usually met as a
 * formula to memorise; here you drag a dot past the fence and watch it turn
 * red, which is a much harder thing to forget.
 */
export function BoxPlotLab({ datasets = ['ordered', 'chickenFat', 'battery', 'scores'] }: { datasets?: IsmDataKey[] }) {
  const [key, setKey] = useState<IsmDataKey>(datasets[0])
  const [values, setValues] = useState<number[]>([...ISM_DATA[datasets[0]].values])
  const s = summarise(values)

  /**
   * The axis window is fixed when a dataset loads, and does not follow the
   * values afterwards. Deriving it from the live data looks tidier and is a
   * trap: dragging a dot right widens the axis, so the same pixel now means a
   * larger number, which widens it again. The value runs away from the pointer.
   * A window three times the data's own width leaves plenty of room to drag a
   * value out past a fence without any of that.
   */
  const [win, setWin] = useState(() => windowFor([...ISM_DATA[datasets[0]].values]))
  const XMIN = win.lo
  const XMAX = win.hi

  const load = (k: IsmDataKey) => {
    setKey(k)
    setValues([...ISM_DATA[k].values])
    setWin(windowFor([...ISM_DATA[k].values]))
  }

  const draw = (
    g: CanvasRenderingContext2D,
    W: number,
    H: number,
    { hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const f = drawNumberLine(g, W, H, { xmin: XMIN, xmax: XMAX, xlab: ISM_DATA[key].unit || 'value', stacks: 6 })
    const acc = accentColour()
    const midY = 92
    const half = 26

    // The fences first, so everything else sits on top of them.
    ;[
      [s.lowerFence, 'lower fence'],
      [s.upperFence, 'upper fence'],
    ].forEach(([v, label]) => {
      g.strokeStyle = 'rgba(220,38,38,0.5)'
      g.lineWidth = 1.5
      g.setLineDash([4, 4])
      g.beginPath()
      g.moveTo(f.px(v as number), 30)
      g.lineTo(f.px(v as number), f.B)
      g.stroke()
      g.setLineDash([])
      g.fillStyle = RED
      g.textAlign = 'center'
      g.fillText(String(label), f.px(v as number), 24)
    })

    // Whiskers reach the furthest value that is still inside the fences.
    const inside = s.sorted.filter((v) => v >= s.lowerFence && v <= s.upperFence)
    const wLo = inside.length ? inside[0] : s.min
    const wHi = inside.length ? inside[inside.length - 1] : s.max

    g.strokeStyle = '#3f3f46'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(f.px(wLo), midY)
    g.lineTo(f.px(s.q1), midY)
    g.moveTo(f.px(s.q3), midY)
    g.lineTo(f.px(wHi), midY)
    g.moveTo(f.px(wLo), midY - 12)
    g.lineTo(f.px(wLo), midY + 12)
    g.moveTo(f.px(wHi), midY - 12)
    g.lineTo(f.px(wHi), midY + 12)
    g.stroke()

    g.fillStyle = 'rgba(79,70,229,0.12)'
    g.fillRect(f.px(s.q1), midY - half, f.px(s.q3) - f.px(s.q1), half * 2)
    g.strokeStyle = acc
    g.lineWidth = 2
    g.strokeRect(f.px(s.q1), midY - half, f.px(s.q3) - f.px(s.q1), half * 2)

    g.strokeStyle = TEAL
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(f.px(s.median), midY - half)
    g.lineTo(f.px(s.median), midY + half)
    g.stroke()

    g.textAlign = 'center'
    g.font = '10.5px Inter, sans-serif'
    g.fillStyle = acc
    g.fillText(`Q1 ${show(s.q1, 1)}`, f.px(s.q1), midY - half - 6)
    g.fillText(`Q3 ${show(s.q3, 1)}`, f.px(s.q3), midY - half - 6)
    g.fillStyle = TEAL
    g.fillText(`median ${show(s.median, 1)}`, f.px(s.median), midY + half + 14)
    g.font = '11px Inter, sans-serif'

    // The raw values underneath, so the box is visibly made of something.
    const heights = new Map<number, number>()
    values.forEach((v, i) => {
      const h = heights.get(v) ?? 0
      heights.set(v, h + 1)
      const out = v < s.lowerFence || v > s.upperFence
      dot(g, f.px(v), f.py(h + 0.5), 6, out ? RED : acc, '#fff')
      if (hover?.kind === 'pt' && hover.i === i) halo(g, f.px(v), f.py(h + 0.5), 6)
    })
    return f
  }

  const heightOf = (i: number) => {
    let h = 0
    for (let k = 0; k < i; k++) if (values[k] === values[i]) h++
    return h
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={400}
          draw={draw}
          candidates={(f: Frame) => values.map((v, i) => ({ kind: 'pt', i, px: f.px(v), py: f.py(heightOf(i) + 0.5) }))}
          tooltip={(hit: HitTarget) => {
            const v = values[hit.i]
            const out = v < s.lowerFence || v > s.upperFence
            return {
              title: out ? `${show(v, 1)} — flagged as an outlier` : `${show(v, 1)}`,
              rows: [
                ['lower fence Q1 − 1.5×IQR', show(s.lowerFence, 2)],
                ['upper fence Q3 + 1.5×IQR', show(s.upperFence, 2)],
                ['this value', show(v, 2)],
                ['so', out ? 'it sits outside a fence, so it gets flagged' : 'it sits inside both fences'],
              ] as Array<[string, string]>,
            }
          }}
          targets={Object.fromEntries(values.map((v, i) => [`v${i}`, v]))}
          jumpKey={key}
          handles={(f: Frame) => values.map((v, i) => ({ id: String(i), px: f.px(v), py: f.py(heightOf(i) + 0.5) }))}
          onDragTo={(id, x) =>
            setValues((vs) => vs.map((old, k) => (k === Number(id) ? Math.round(clamp(x, XMIN, XMAX) * 10) / 10 : old)))
          }
          caption="Drag any dot. Push one past a red fence and it turns into an outlier — and the fences themselves shift, because they are built from the data."
        />
      }
      panel={
        <>
          <ReadOut
            label="Outliers found"
            value={s.outliers.length === 0 ? 'none' : s.outliers.map((v) => show(v, 1)).join(', ')}
            tone={s.outliers.length ? RED : TEAL}
            note={
              s.outliers.length
                ? 'These sit outside a fence. Worth a look — they are not automatically mistakes.'
                : 'Every value sits between the two fences.'
            }
          />

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[12.5px]">
            {[
              ['smallest', show(s.min, 2)],
              ['Q1', show(s.q1, 2)],
              ['median', show(s.median, 2)],
              ['Q3', show(s.q3, 2)],
              ['largest', show(s.max, 2)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-600">{k}</span>
                <span className="font-mono font-semibold text-zinc-950">{v}</span>
              </div>
            ))}
            <div className="mt-1 flex flex-col gap-1 border-t border-zinc-950/[0.08] pt-1.5">
              {[
                ['IQR = Q3 − Q1', show(s.iqr, 2)],
                ['QD = IQR / 2', show(s.qd, 2)],
                ['mean', show(s.mean, 2)],
                ['s', show(s.sd, 2)],
                [
                  'shape',
                  s.shape === 'symmetric' ? 'even' : s.shape === 'right' ? 'tail to the right' : 'tail to the left',
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-zinc-600">{k}</span>
                  <span className="font-mono font-semibold text-zinc-950">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Try a dataset</div>
            {datasets.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => load(k)}
                className={clsx(
                  'cursor-pointer rounded-md border px-2.5 py-2 text-left text-[12px] font-semibold',
                  k === key
                    ? 'border-zinc-950/90 bg-zinc-900 text-white'
                    : 'border-zinc-950/10 bg-white hover:bg-zinc-950/[0.04]'
                )}
              >
                {ISM_DATA[k].name}
              </button>
            ))}
          </div>

          <PanelNote>{ISM_DATA[key].note}</PanelNote>
        </>
      }
    />
  )
}
