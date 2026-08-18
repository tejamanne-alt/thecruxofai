'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, dot, drawAxes, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/*
 * Labs for parts 8–14 — data quality, noise, outliers, missing values,
 * duplicates, the preprocessing pipeline, and aggregation.
 *
 * Where the deck prints a number, the lab computes that number. Where it does
 * not, the page says so on the page rather than filling the gap.
 */

/* ========================================================================== */
/* A deterministic scatter, so the drawing does not change on every render     */
/* ========================================================================== */

/** A tiny hash-based generator. Same index in, same number out, every time. */
function rnd(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function gauss(i: number) {
  // Box–Muller on two hashes. Deterministic, and good enough for a picture.
  const u = Math.max(1e-9, rnd(i * 2))
  const v = rnd(i * 2 + 1)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/* ========================================================================== */
/* Part 8 — data quality                                                      */
/* ========================================================================== */

const QUALITY_WORDS = [
  { w: 'Correct', gloss: 'The value in the cell is the value in the world. A salary of −10 is not.' },
  { w: 'Complete', gloss: 'Nothing is missing that the analysis needs. NULLs and absent rows both break this.' },
  { w: 'Consistent', gloss: 'The same fact is recorded the same way everywhere — one Tid, one marital status.' },
  {
    w: 'Trustable',
    gloss: 'You know where it came from and believe the source. Fake data breaks this and nothing else shows it.',
  },
  { w: 'Interpretable', gloss: 'Somebody can say what a column means and in what units. A bare number is not data.' },
  { w: 'Usable on Demand', gloss: 'You can actually get at it when the model needs it, not three weeks later.' },
]

/** The deck's five named problems, planted in a small loan table. */
const LOAN_ROWS: Array<{
  id: string
  applicant: string
  income: string
  years: string
  score: string
  defect?: { kind: string; why: string }
}> = [
  { id: 'r1', applicant: 'A. Rao', income: '9,00,000', years: '6', score: '780' },
  {
    id: 'r2',
    applicant: 'B. Singh',
    income: '−10',
    years: '4',
    score: '655',
    defect: { kind: 'Wrong data', why: 'The deck’s own example of a noisy value: Salary = “−10”, which is an error.' },
  },
  { id: 'r3', applicant: 'C. Menon', income: '5,40,000', years: '3', score: '702' },
  {
    id: 'r4',
    applicant: 'D. Khan',
    income: 'NULL',
    years: '9',
    score: '741',
    defect: {
      kind: 'Missing values',
      why: 'Nothing was recorded. Either the applicant declined, or the field never applied to them.',
    },
  },
  {
    id: 'r5',
    applicant: 'E. Bose',
    income: '4,80,00,000',
    years: '2',
    score: '690',
    defect: {
      kind: 'Noise and outliers',
      why: 'A hundred times every other income. Either a genuine outlier or a units mistake — and you cannot tell which from the cell alone.',
    },
  },
  {
    id: 'r6',
    applicant: 'F. Iyer',
    income: '6,20,000',
    years: '5',
    score: '715',
  },
  {
    id: 'r7',
    applicant: 'F. Iyer',
    income: '6,20,000',
    years: '5',
    score: '715',
    defect: {
      kind: 'Duplicate data',
      why: 'The same person twice — the classic result of merging two sources. Their evidence now counts double.',
    },
  },
  {
    id: 'r8',
    applicant: 'G. Datta',
    income: '7,50,000',
    years: '4',
    score: '850',
    defect: {
      kind: 'Fake data',
      why: 'Every applicant from this branch scores exactly 850 and reports a round salary. Nothing in the row is impossible; the pattern is what gives it away.',
    },
  },
]

const DEFECT_COUNT = LOAN_ROWS.filter((r) => r.defect).length

export function DataQualityLab() {
  const [flagged, setFlagged] = useState<string[]>([])
  const [word, setWord] = useState('Correct')
  const [show, setShow] = useState(false)

  const found = flagged.filter((id) => LOAN_ROWS.find((r) => r.id === id)?.defect).length
  const falseAlarms = flagged.length - found
  const gloss = QUALITY_WORDS.find((q) => q.w === word)!

  function toggle(id: string) {
    setFlagged((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            Press every row you would not trust
          </div>
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {['', 'Applicant', 'Annual income', 'Years in job', 'Credit score'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOAN_ROWS.map((r) => {
                const on = flagged.includes(r.id)
                const isBad = Boolean(r.defect)
                return (
                  <tr key={r.id}>
                    <td className="border-t border-zinc-950/[0.07] px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => toggle(r.id)}
                        aria-label={`Flag the row for ${r.applicant}`}
                        aria-pressed={on}
                        className="grid size-5 cursor-pointer place-items-center rounded border text-[11px] font-bold"
                        style={
                          on
                            ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                            : { borderColor: 'rgba(9,9,11,0.15)', background: '#fff', color: 'transparent' }
                        }
                      >
                        ✓
                      </button>
                    </td>
                    {[r.applicant, r.income, r.years, r.score].map((v, i) => (
                      <td
                        key={i}
                        className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-[12px]"
                        style={{
                          background: show && isBad ? 'rgba(220,38,38,0.06)' : on ? 'var(--acc-12)' : undefined,
                          color: '#3f3f46',
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'found', value: `${found} of ${DEFECT_COUNT}` },
              { label: 'false alarms', value: String(falseAlarms) },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Btn primary onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Reveal'}
            </Btn>
            <Btn
              onClick={() => {
                setFlagged([])
                setShow(false)
              }}
            >
              Clear
            </Btn>
          </div>
          <PanelNote>
            Five defects, one of each kind the deck lists. One of them cannot be spotted from a single row at all.
          </PanelNote>
        </div>
      </div>

      {show && (
        <div className="flex flex-col gap-2">
          {LOAN_ROWS.filter((r) => r.defect).map((r) => (
            <div key={r.id} className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12.5px]/[1.65]">
              <span className="font-semibold text-zinc-900">
                {r.applicant} — {r.defect!.kind}:{' '}
              </span>
              <span className="text-zinc-700">{r.defect!.why}</span>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The six words on the quality wheel
        </div>
        <div className="flex flex-wrap gap-2">
          {QUALITY_WORDS.map((q) => (
            <Chip key={q.w} on={word === q.w} label={q.w} onClick={() => setWord(q.w)} />
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-zinc-950/10 bg-white p-3.5 text-[13px]/[1.65] text-zinc-700">
          <strong className="text-zinc-900">{gloss.w}: </strong>
          {gloss.gloss}
        </div>
        <p className="mt-2 text-[12px]/[1.6] text-zinc-500">
          Slide 23 prints these six words on a wheel and nothing else. The one-line meanings above are written here to
          make them usable, and are not the deck’s wording.
        </p>
      </div>

      <LabNote>
        The deck’s reason for caring is on slide 24, and it is worth quoting in an exam: a model that decides who is a
        loan risk, built on poor data, will deny loans to credit-worthy people <em>and</em> approve more loans that
        default. Both errors at once — because the data was wrong in both directions.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 9 — noise                                                             */
/* ========================================================================== */

const T_MAX = 0.5

export function NoiseLab() {
  const [f1, setF1] = useState(10)
  const [f2, setF2] = useState(14)
  const [amp, setAmp] = useState(0)
  const [view, setView] = useState<'both' | 'sum' | 'noisy'>('both')

  /** The clean signal at time t — the deck's "sum of the two sine waves". */
  function clean(t: number) {
    return Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)
  }

  const N = 700

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, {
      xmin: 0,
      xmax: T_MAX,
      ymin: -3,
      ymax: 3,
      xlab: 'time (seconds)',
      ylab: 'magnitude',
    })
    const acc = accentColour()

    function trace(fn: (t: number) => number, colour: string, width: number) {
      g.beginPath()
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * T_MAX
        const x = f.px(t)
        const y = f.py(fn(t))
        if (i === 0) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
      g.strokeStyle = colour
      g.lineWidth = width
      g.stroke()
    }

    if (view === 'both') {
      trace((t) => Math.sin(2 * Math.PI * f1 * t), '#18181b', 1.6)
      trace((t) => Math.sin(2 * Math.PI * f2 * t), '#dc2626', 1.6)
    } else if (view === 'sum') {
      trace(clean, acc, 2)
    } else {
      trace((t) => clean(t) + amp * gauss(Math.round(t * 100000)), acc, 1.2)
      g.globalAlpha = 0.35
      trace(clean, '#18181b', 1.6)
      g.globalAlpha = 1
    }
    return f
  }

  // How far the noisy signal wanders from the clean one, in the same units as
  // the plot. Recomputed here, never stored, so it can never go stale.
  let sse = 0
  let peak = 0
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX
    const e = amp * gauss(Math.round(t * 100000))
    sse += e * e
    peak = Math.max(peak, Math.abs(clean(t) + e))
  }
  const rms = Math.sqrt(sse / (N + 1))

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'both' as const, label: 'Two sine waves' },
          { id: 'sum' as const, label: 'Observed signal (the sum)' },
          { id: 'noisy' as const, label: 'Observed signal with noise' },
        ]}
        at={view}
        onPick={setView}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${view}-${f1}-${f2}`}
          caption="The deck’s three figures, in one plot. Switch between them, then turn the noise up on the third."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Slider
            label="Noise level"
            value={amp}
            display={amp.toFixed(2)}
            min={0}
            max={1.2}
            step={0.05}
            hint="Only affects the third view."
            onChange={(v) => {
              setAmp(v)
              setView('noisy')
            }}
          />
          <Slider
            label="First wave, cycles per second"
            value={f1}
            display={`${f1} Hz`}
            min={2}
            max={20}
            step={1}
            hint="Same magnitude, different frequency — the deck’s setup."
            onChange={setF1}
          />
          <Slider
            label="Second wave, cycles per second"
            value={f2}
            display={`${f2} Hz`}
            min={2}
            max={20}
            step={1}
            hint="Set both the same and the sum is just a bigger sine."
            onChange={setF2}
          />
          <ReadOutGrid
            items={[
              { label: 'noise, rms', value: rms.toFixed(2) },
              { label: 'peak reading', value: peak.toFixed(2) },
            ]}
          />
          <PanelNote>
            The clean sum never leaves ±2. Watch the peak climb past that as you add noise: that is the deck’s
            “magnitude and shape of the original signal is distorted”.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={amp < 0.35}>
        {amp === 0 ? (
          <>
            No noise yet. The two waves add to a shape that repeats — the beat pattern is the real signal, and it is
            perfectly recoverable.
          </>
        ) : amp < 0.35 ? (
          <>Still readable. The beat pattern survives, so a model fitted to this would find the same structure.</>
        ) : (
          <>
            The shape is going. At this level the peaks no longer sit where the real signal’s peaks are, so anything
            that keys off peak position is now learning the noise.
          </>
        )}
      </Verdict>

      <LabNote>
        Noise is not the same thing as an outlier, and the deck separates them deliberately. Noise{' '}
        <strong>modifies values that are there</strong> — a distorted voice on a bad phone line, snow on a television.
        An outlier is a whole object that sits somewhere odd. Noise is spread across everything; an outlier is one
        thing.
      </LabNote>
      <LabNote>
        The deck also gives the object-level version in one line: “for objects, noise is an extraneous object”. A
        photograph of a cat with a passing bus in it has a noisy object in the frame, not a noisy pixel value.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 10 — outliers: noise, or the goal                                     */
/* ========================================================================== */

interface Pt {
  x: number
  y: number
  odd: boolean
}

/**
 * Four dense blobs and four points on their own — the shape of the figure on
 * slide 26. The coordinates are chosen here, not read off the slide: the slide
 * is a bitmap with no axes, so nothing about its exact positions is knowable.
 */
const CLOUD: Pt[] = (() => {
  const blobs = [
    { cx: 7.6, cy: 8.2, n: 90, s: 0.28 },
    { cx: 5.2, cy: 6.1, n: 150, s: 0.75 },
    { cx: 2.4, cy: 4.6, n: 80, s: 0.3 },
    { cx: 6.8, cy: 2.6, n: 170, s: 0.62 },
  ]
  const pts: Pt[] = []
  let k = 1
  for (const b of blobs) {
    for (let i = 0; i < b.n; i++) {
      pts.push({ x: b.cx + gauss(k++) * b.s, y: b.cy + gauss(k++) * b.s, odd: false })
    }
  }
  for (const o of [
    { x: 4.3, y: 8.6 },
    { x: 3.1, y: 1.9 },
    { x: 9.2, y: 2.2 },
    { x: 1.1, y: 8.9 },
  ]) {
    pts.push({ ...o, odd: true })
  }
  return pts
})()

const ODD_COUNT = CLOUD.filter((p) => p.odd).length

export function OutlierRoleLab() {
  const [goal, setGoal] = useState<'noise' | 'target'>('noise')
  const [applied, setApplied] = useState(false)

  const kept = applied && goal === 'noise' ? CLOUD.filter((p) => !p.odd) : CLOUD
  const shownOdd = applied && goal === 'noise' ? 0 : ODD_COUNT

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax: 10, ymin: 0, ymax: 10, xlab: 'attribute 1', ylab: 'attribute 2' })
    const acc = accentColour()
    for (const p of kept) {
      if (p.odd) {
        const hot = goal === 'target' && applied
        dot(g, f.px(p.x), f.py(p.y), hot ? 7 : 4, hot ? '#dc2626' : '#71717a', '#fff')
        if (hot) {
          g.beginPath()
          g.arc(f.px(p.x), f.py(p.y), 13, 0, Math.PI * 2)
          g.strokeStyle = '#dc2626'
          g.lineWidth = 1.8
          g.stroke()
        }
      } else {
        dot(g, f.px(p.x), f.py(p.y), 2.2, goal === 'target' && applied ? 'rgba(9,9,11,0.22)' : acc)
      }
    }
    return f
  }

  return (
    <LabBox>
      <Presets
        items={[
          { id: 'noise' as const, label: 'Case 1 — outliers are noise' },
          { id: 'target' as const, label: 'Case 2 — outliers are the goal' },
        ]}
        at={goal}
        onPick={(gl) => {
          setGoal(gl)
          setApplied(false)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${goal}-${applied}`}
          caption="Four dense groups and four points on their own. Which four are the answer depends entirely on the question."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'points kept', value: String(kept.length) },
              { label: 'odd ones shown', value: String(shownOdd) },
            ]}
          />
          <Btn primary onClick={() => setApplied(!applied)}>
            {applied ? 'Undo' : goal === 'noise' ? 'Remove them' : 'Report them'}
          </Btn>
          <PanelNote>
            {goal === 'noise'
              ? 'You are clustering customers, and four odd records are dragging the group centres around. Dropping them makes every later number cleaner.'
              : 'You are looking for credit-card fraud or an intrusion. The four odd records are the entire deliverable; the 490 ordinary ones are the part you throw away.'}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={applied}>
        {applied ? (
          goal === 'noise' ? (
            <>Four rows gone. Nothing about the data changed — only what you asked of it. That is the deck’s Case 1.</>
          ) : (
            <>
              Four rows found. The same four rows, and this time deleting them would have destroyed the entire result.
              That is the deck’s Case 2.
            </>
          )
        ) : (
          <>Press the button and watch what happens to the same four points.</>
        )}
      </Verdict>

      <LabNote>
        This is the trap in every “clean your data” instruction. There is no property of a row that makes it an
        outlier-to-delete rather than an outlier-to-report — the deck names credit card fraud and intrusion detection
        precisely because in those problems the rare row <em>is</em> the answer. Decide what you are looking for before
        you decide what to throw away.
      </LabNote>
      <LabNote>
        The deck’s definition is worth memorising as written: outliers are <strong>data objects</strong> with
        characteristics considerably different from most of the other data objects in the data set. Objects, not values
        — which is exactly what separates them from noise.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 11 — missing values                                                   */
/* ========================================================================== */

const AIR: Array<{ date: string; v: number | null }> = [
  { date: 'JAN49', v: 112 },
  { date: 'FEB49', v: 118 },
  { date: 'MAR49', v: 132 },
  { date: 'APR49', v: 129 },
  { date: 'MAY49', v: null },
  { date: 'JUN49', v: 135 },
  { date: 'JUL49', v: null },
  { date: 'AUG49', v: 148 },
  { date: 'SEP49', v: 136 },
  { date: 'OCT49', v: 119 },
  { date: 'NOV49', v: null },
  { date: 'DEC49', v: 118 },
  { date: 'JAN50', v: 115 },
  { date: 'FEB50', v: 126 },
  { date: 'MAR50', v: 141 },
]

const STRATEGIES = [
  { id: 'none', label: 'Leave the holes' },
  { id: 'drop', label: 'Drop the rows' },
  { id: 'zero', label: 'Replace with 0' },
  { id: 'prev', label: 'Last known value' },
  { id: 'mean', label: 'Replace with the mean' },
] as const

type Strat = (typeof STRATEGIES)[number]['id']

export function ImputeLab() {
  const [strat, setStrat] = useState<Strat>('none')

  const observed = AIR.filter((r) => r.v !== null).map((r) => r.v!)
  const mean = observed.reduce((a, b) => a + b, 0) / observed.length

  /** The filled column, recomputed from the strategy every render. */
  const filled: Array<{ date: string; v: number | null; made: boolean }> = []
  let last: number | null = null
  for (const r of AIR) {
    if (r.v !== null) {
      last = r.v
      filled.push({ ...r, made: false })
      continue
    }
    if (strat === 'none') filled.push({ ...r, made: false })
    else if (strat === 'drop') continue
    else if (strat === 'zero') filled.push({ date: r.date, v: 0, made: true })
    else if (strat === 'prev') filled.push({ date: r.date, v: last, made: true })
    else filled.push({ date: r.date, v: mean, made: true })
  }

  const usable = filled.filter((r) => r.v !== null).map((r) => r.v!)
  const newMean = usable.length ? usable.reduce((a, b) => a + b, 0) / usable.length : NaN
  const sd = usable.length
    ? Math.sqrt(usable.reduce((a, b) => a + (b - newMean) * (b - newMean), 0) / usable.length)
    : NaN

  return (
    <LabBox>
      <Presets items={STRATEGIES.map((s) => ({ id: s.id, label: s.label }))} at={strat} onPick={setStrat} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {['#', 'DATE', 'air passengers'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filled.map((r, i) => (
                <tr key={r.date}>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 text-zinc-400">{i + 1}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-zinc-700">{r.date}</td>
                  <td
                    className="border-t border-zinc-950/[0.07] px-2 py-1.5 text-right font-mono tabular-nums"
                    style={
                      r.v === null
                        ? { background: 'rgba(9,9,11,0.05)', color: '#a1a1aa' }
                        : r.made
                          ? { background: 'var(--acc-12)', color: 'var(--acc)', fontWeight: 700 }
                          : { color: '#3f3f46' }
                    }
                  >
                    {r.v === null ? '—' : Number.isInteger(r.v) ? r.v : r.v.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'rows', value: String(filled.length) },
              { label: 'usable', value: String(usable.length) },
            ]}
          />
          <ReadOutGrid
            items={[
              { label: 'mean', value: Number.isFinite(newMean) ? newMean.toFixed(2) : '—' },
              { label: 'std dev', value: Number.isFinite(sd) ? sd.toFixed(2) : '—' },
            ]}
          />
          <PanelNote>
            The mean of the twelve values that were actually recorded is <strong>{mean.toFixed(2)}</strong>. Watch what
            each strategy does to it.
          </PanelNote>
        </div>
      </div>

      <Verdict ok={strat === 'prev' || strat === 'drop'}>
        {strat === 'none' && <>Three holes. Most library functions will refuse to fit anything at all like this.</>}
        {strat === 'drop' && (
          <>
            Honest, and it costs you three of fifteen months. On a time series that also breaks the spacing — the gap
            between April and June is now one row wide but two months long.
          </>
        )}
        {strat === 'zero' && (
          <>
            The mean has fallen from {mean.toFixed(2)} to {newMean.toFixed(2)} and the standard deviation has roughly
            doubled. Zero is not “no information”; it is the claim that no aeroplane flew in May.
          </>
        )}
        {strat === 'prev' && (
          <>
            The deck’s “replace with last known value”, and it reproduces the deck’s own three numbers exactly: May
            takes April’s 129, July takes June’s 135, November takes October’s 119.
          </>
        )}
        {strat === 'mean' && (
          <>
            The mean is unchanged by construction — and the standard deviation has fallen, because three points now sit
            exactly on the average. You have invented certainty you do not have.
          </>
        )}
      </Verdict>

      <div
        className="rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <strong>Two of the deck’s columns are not reproduced here, on purpose.</strong> The slide’s{' '}
        <code>air_mv_mean</code> column fills every hole with <strong>284.54</strong>, and the mean of the fifteen rows
        the slide prints is <strong>{mean.toFixed(2)}</strong> — so that figure cannot have come from this extract. It
        must be the mean of the longer series this is a window onto, which the slide does not show. The{' '}
        <code>air_expand</code> spline column has the same problem and, in addition, the slide never says which spline
        was fitted. Neither number is checkable from what is printed, so neither is printed here.
      </div>

      <LabNote>
        The deck gives three reasons a value is missing, and they are not interchangeable. It was{' '}
        <strong>not collected</strong> (people decline to give their age and weight); the attribute{' '}
        <strong>does not apply</strong> (annual income for a child); or the analysis can simply{' '}
        <strong>ignore it</strong>. The middle case is the interesting one: there is no true value to estimate, so
        imputing anything is a lie, and the right move is usually a separate “not applicable” flag.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 12 — duplicates and inconsistent entries                              */
/* ========================================================================== */

const DIRTY: Array<{
  tid: string
  refund: string
  marital: string
  income: string
  cheat: string
  flag?: 'money' | 'missing' | 'dup'
}> = [
  { tid: '1', refund: 'Yes', marital: 'Single', income: '125K', cheat: 'No' },
  { tid: '2', refund: 'No', marital: 'Married', income: '100K', cheat: 'No' },
  { tid: '3', refund: 'No', marital: 'Single', income: '70K', cheat: 'No' },
  { tid: '4', refund: 'Yes', marital: 'Married', income: '120K', cheat: 'No' },
  { tid: '5', refund: 'No', marital: 'Divorced', income: '10000K', cheat: 'Yes', flag: 'money' },
  { tid: '6', refund: 'No', marital: 'NULL', income: '60K', cheat: 'No', flag: 'missing' },
  { tid: '7', refund: 'Yes', marital: 'Divorced', income: '220K', cheat: 'NULL', flag: 'missing' },
  { tid: '8', refund: 'No', marital: 'Single', income: '85K', cheat: 'Yes' },
  { tid: '9', refund: 'No', marital: 'Married', income: '90K', cheat: 'No', flag: 'dup' },
  { tid: '9', refund: 'No', marital: 'Single', income: '90K', cheat: 'No', flag: 'dup' },
]

const FLAG_INFO = {
  money: {
    name: 'A mistake or a millionaire?',
    tone: '#a16207',
    text: 'Row 5 declares 10000K — a hundred times the next largest income. The deck’s own caption is the point: nothing in the cell tells you whether this is a typo with two extra zeros or a genuinely very rich person. You have to go back to the source, and if you cannot, you have to say so.',
  },
  missing: {
    name: 'Missing values',
    tone: '#0d9488',
    text: 'Rows 6 and 7 carry a NULL each, and they are different kinds of problem. A missing marital status costs you one feature for one row. A missing Cheat is a missing label — that row cannot be used for supervised training at all.',
  },
  dup: {
    name: 'Inconsistent duplicate entries',
    tone: '#dc2626',
    text: 'Two rows both claim Tid 9, both with income 90K, and they disagree about marital status. This is the merge-two-sources failure on slide 28. Deduplicating on Tid alone silently keeps whichever row happened to be first.',
  },
} as const

export function DirtyTableLab() {
  const [at, setAt] = useState<keyof typeof FLAG_INFO | null>(null)
  const [clean, setClean] = useState(false)

  const rows = clean ? DIRTY.filter((r) => !r.flag) : DIRTY
  const info = at ? FLAG_INFO[at] : null

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FLAG_INFO) as Array<keyof typeof FLAG_INFO>).map((k) => (
          <Chip key={k} on={at === k} label={FLAG_INFO[k].name} onClick={() => setAt(at === k ? null : k)} />
        ))}
        <Btn onClick={() => setClean(!clean)}>{clean ? 'Put the bad rows back' : 'Drop every flagged row'}</Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {['Tid', 'Refund', 'Marital Status', 'Taxable Income', 'Cheat'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const lit = at !== null && r.flag === at
                return (
                  <tr key={`${r.tid}-${i}`}>
                    {[r.tid, r.refund, r.marital, r.income, r.cheat].map((v, ci) => (
                      <td
                        key={ci}
                        className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-[12px]"
                        style={{
                          background: lit ? `${FLAG_INFO[r.flag!].tone}1a` : undefined,
                          color: lit ? FLAG_INFO[r.flag!].tone : '#3f3f46',
                          fontWeight: lit ? 700 : 400,
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'rows', value: `${rows.length} of ${DIRTY.length}` },
              { label: 'usable labels', value: String(rows.filter((r) => r.cheat !== 'NULL').length) },
            ]}
          />
          {info ? (
            <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
              <div className="mb-1 text-[13px] font-semibold" style={{ color: info.tone }}>
                {info.name}
              </div>
              <div className="text-[12.5px]/[1.65] text-zinc-700">{info.text}</div>
            </div>
          ) : (
            <PanelNote>Press one of the three labels above to see which rows it means.</PanelNote>
          )}
          {clean && (
            <PanelNote>
              Four rows gone from ten. Dropping everything suspicious is a real option, and on a dataset this small it
              is an expensive one.
            </PanelNote>
          )}
        </div>
      </div>

      <LabNote>
        Slide 34 names three flavours of dirty. <strong>Noisy</strong>: errors and outliers, like Salary = “−10”.{' '}
        <strong>Inconsistent</strong>: an Age of 42 against a Birthday of 03/07/2010, or a rating that used to run 1, 2,
        3 and now runs A, B, C. And <strong>intentional</strong>: disguised missing data, the deck’s example being
        January 1 as everyone’s birthday — which is what a form gives you when a date is required and unknown.
      </LabNote>
      <LabNote>
        The intentional case is the nastiest, because nothing about it looks wrong. A model trained on it will
        cheerfully learn that people born on New Year’s Day are unusual, when what it has actually found is the default
        value of a dropdown.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 13 — the preprocessing pipeline                                       */
/* ========================================================================== */

const PIPELINE = [
  {
    id: 'raw',
    name: '(Raw) Data',
    kind: 'data',
    what: 'What you were given. Whatever shape the source system happened to store it in.',
  },
  {
    id: 'de',
    name: 'Data Engineering',
    kind: 'work',
    what: 'The deck’s definition, word for word: the process of converting raw data into prepared data.',
  },
  { id: 'prep', name: 'Prepared Data', kind: 'data', what: 'One table, one row per case, nothing corrupt left in it.' },
  {
    id: 'fe',
    name: 'Feature Engineering',
    kind: 'work',
    what: 'The deck’s definition: tunes the prepared data to create the features that are expected by the ML model.',
  },
  {
    id: 'feat',
    name: 'Engineered Features',
    kind: 'data',
    what: 'Columns in the units, ranges and encodings the model actually wants.',
  },
  { id: 'ml', name: 'Machine Learning', kind: 'work', what: 'The step everybody thinks the job is.' },
] as const

const BUCKETS = [
  { id: 'agg', name: 'Data Aggregation', slides: 'Slides 32–33' },
  { id: 'clean', name: 'Data cleansing', slides: 'Slides 34–40' },
  { id: 'inst', name: 'Instances selection and partitioning', slides: 'Slides 41–45' },
  { id: 'tune', name: 'Feature tuning', slides: 'Slides 46–48' },
] as const

type Bucket = (typeof BUCKETS)[number]['id']

const JOBS: Array<{ job: string; bucket: Bucket; slide: string }> = [
  { job: 'Combine two attributes into a single attribute', bucket: 'agg', slide: 'Slide 32' },
  { job: 'Roll days up into weeks, months or years', bucket: 'agg', slide: 'Slide 32' },
  { job: 'Group cities into regions, states and countries', bucket: 'agg', slide: 'Slide 32' },
  { job: 'Correct a Salary recorded as “−10”', bucket: 'clean', slide: 'Slide 34' },
  { job: 'Reconcile Age = 42 against Birthday = 03/07/2010', bucket: 'clean', slide: 'Slide 34' },
  { job: 'Remove records that are missing a large number of columns', bucket: 'clean', slide: 'Slide 34' },
  { job: 'Drop a value beyond Q3 + 1.5 × IQR', bucket: 'clean', slide: 'Slides 37–39' },
  { job: 'Split the data into training, evaluation and test sets', bucket: 'inst', slide: 'Slides 41–42' },
  { job: 'Take a stratified rather than a simple random sample', bucket: 'inst', slide: 'Slide 44' },
  { job: 'Over-sample the rare class', bucket: 'inst', slide: 'Slide 45' },
  { job: 'Map income from ₹12,000–₹98,000 onto [0, 1]', bucket: 'tune', slide: 'Slide 48' },
  { job: 'Subtract the mean and divide by the standard deviation', bucket: 'tune', slide: 'Slide 48' },
]

export function PipelineLab() {
  const [stage, setStage] = useState('de')
  const [answers, setAnswers] = useState<Record<number, Bucket>>({})
  const [show, setShow] = useState(false)

  const s = PIPELINE.find((p) => p.id === stage)!
  const done = JOBS.filter((_, i) => answers[i] !== undefined).length
  const right = JOBS.filter((j, i) => answers[i] === j.bucket).length

  /** Pressing the chosen bucket again clears it, rather than leaving a dead key. */
  function pick(i: number, b: Bucket) {
    const next = { ...answers }
    if (next[i] === b) delete next[i]
    else next[i] = b
    setAnswers(next)
  }

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            The pipeline on slide 29
          </div>
          <div className="flex flex-col gap-1.5">
            {PIPELINE.map((p, i) => (
              <div key={p.id} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setStage(p.id)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left"
                  style={{
                    borderColor: stage === p.id ? 'var(--acc)' : 'rgba(9,9,11,0.10)',
                    background: stage === p.id ? 'var(--acc-12)' : p.kind === 'work' ? 'rgba(9,9,11,0.025)' : '#fff',
                  }}
                >
                  <span className="text-[15px]">{p.kind === 'work' ? '⚙' : '▤'}</span>
                  <span className="text-[13.5px] font-semibold text-zinc-900">{p.name}</span>
                </button>
                {i < PIPELINE.length - 1 && <div className="pl-5 text-[13px] text-zinc-300">↓</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut label={s.kind === 'work' ? 'A step' : 'A thing'} value={s.name} />
          <PanelNote>{s.what}</PanelNote>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3 text-[12px]/[1.6] text-zinc-600">
            The gear boxes are work you do; the plain boxes are what comes out of it. Everything in this lecture from
            here on lives in the first gear box, except feature scaling and encoding, which live in the second.
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
        <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Slide 31 breaks it into four headings — put each job under one
        </div>
        <p className="mb-3 text-[12px]/[1.6] text-zinc-500">
          Every job below is one the deck itself covers, and the slide it is covered on is shown when you reveal.
        </p>
        <div className="flex flex-col gap-2">
          {JOBS.map((j, i) => (
            <div
              key={j.job}
              className="flex flex-col gap-2 rounded-lg border border-zinc-950/10 p-2.5 sm:flex-row sm:items-center sm:justify-between"
              style={{
                background: show
                  ? answers[i] === j.bucket
                    ? 'rgba(13,148,136,0.06)'
                    : 'rgba(220,38,38,0.04)'
                  : '#fff',
              }}
            >
              <span className="text-[13px]/[1.5] text-zinc-800">
                {j.job}
                {show && <span className="ml-2 text-[11px] text-zinc-400">{j.slide}</span>}
              </span>
              <span className="flex flex-wrap gap-1">
                {BUCKETS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    aria-label={`${j.job}: ${b.name}`}
                    onClick={() => pick(i, b.id)}
                    className="cursor-pointer rounded border px-1.5 py-1 text-[10.5px] font-semibold whitespace-nowrap"
                    style={
                      answers[i] === b.id
                        ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                        : show && b.id === j.bucket
                          ? { borderColor: '#0d9488', background: 'rgba(13,148,136,0.10)', color: '#0d9488' }
                          : { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#a1a1aa' }
                    }
                  >
                    {b.name.split(' ')[0]}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Btn primary onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Mark it'}
          </Btn>
          <Btn
            onClick={() => {
              setAnswers({})
              setShow(false)
            }}
          >
            Clear
          </Btn>
          <span className="text-[12.5px] text-zinc-600">
            {done} of {JOBS.length} answered{show && ` · ${right} right`}
          </span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {BUCKETS.map((b) => (
            <div key={b.id} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 px-3 py-2">
              <span className="text-[12.5px] font-semibold text-zinc-900">{b.name}</span>
              <span className="ml-2 text-[11px] text-zinc-400">{b.slides}</span>
            </div>
          ))}
        </div>
      </div>

      <LabNote>
        Notice where <strong>feature tuning</strong> sits. Slide 31 lists it under data pre-processing alongside
        cleansing, but what it actually contains — scaling — is the second gear box, feature engineering. The two slides
        divide the same work in slightly different places, and an exam answer is safest quoting each slide’s own list
        rather than merging them.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 14 — aggregation                                                      */
/* ========================================================================== */

const AGG_FNS = [
  { id: 'mean', label: 'mean()' },
  { id: 'sum', label: 'sum()' },
  { id: 'max', label: 'max()' },
  { id: 'min', label: 'min()' },
  { id: 'count', label: 'count()' },
] as const

type AggFn = (typeof AGG_FNS)[number]['id']

const AGG_START: Array<{ key: string; value: number }> = [
  { key: 'white', value: 12 },
  { key: 'white', value: 8 },
  { key: 'red', value: 20 },
  { key: 'red', value: 14 },
  { key: 'black', value: 6 },
  { key: 'black', value: 10 },
]

function applyFn(fn: AggFn, xs: number[]) {
  if (!xs.length) return NaN
  if (fn === 'sum') return xs.reduce((a, b) => a + b, 0)
  if (fn === 'max') return Math.max(...xs)
  if (fn === 'min') return Math.min(...xs)
  if (fn === 'count') return xs.length
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function spread(xs: number[]) {
  if (xs.length < 2) return 0
  const m = xs.reduce((a, b) => a + b, 0) / xs.length
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / xs.length)
}

export function AggregationLab() {
  const [rows, setRows] = useState(AGG_START)
  const [fn, setFn] = useState<AggFn>('mean')

  const keys = ['white', 'red', 'black']
  const groups = keys.map((k) => ({ key: k, values: rows.filter((r) => r.key === k).map((r) => r.value) }))
  const out = groups.map((g) => ({ key: g.key, value: applyFn(fn, g.values) }))

  const before = spread(rows.map((r) => r.value))
  const after = spread(out.map((o) => o.value))
  const matchesDeck = fn === 'mean' && out[0]!.value === 10 && out[1]!.value === 17 && out[2]!.value === 8

  function setValue(i: number, v: number) {
    setRows(rows.map((r, j) => (j === i ? { ...r, value: v } : r)))
  }

  return (
    <LabBox>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-zinc-600">KEY = ‘color’, and the function applied to each group:</span>
        <Presets items={AGG_FNS.map((f) => ({ id: f.id, label: f.label }))} at={fn} onPick={setFn} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">the data</div>
              <table className="border-collapse text-[12.5px]">
                <thead>
                  <tr>
                    <th className="border-b border-zinc-950/10 px-2 py-1.5 text-left text-[11px] text-zinc-500 uppercase">
                      key
                    </th>
                    <th className="border-b border-zinc-950/10 px-2 py-1.5 text-left text-[11px] text-zinc-500 uppercase">
                      value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="border-t border-zinc-950/[0.07] px-2 py-1 font-mono text-zinc-700">{r.key}</td>
                      <td className="border-t border-zinc-950/[0.07] px-1 py-1">
                        <input
                          value={r.value}
                          inputMode="numeric"
                          aria-label={`${r.key} value ${i + 1}`}
                          onChange={(e) => {
                            const raw = e.target.value.trim()
                            const n = raw === '' || raw === '-' ? 0 : Number(raw)
                            if (Number.isFinite(n)) setValue(i, n)
                          }}
                          className="w-16 rounded px-2 py-1 text-right font-mono text-[12.5px] tabular-nums outline-none hover:bg-zinc-950/[0.04] focus-visible:outline-2 focus-visible:outline-offset-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="self-center text-[20px] text-zinc-300">→</div>

            <div>
              <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                split · apply · combine
              </div>
              <div className="flex flex-col gap-2">
                {groups.map((g, i) => (
                  <div key={g.key} className="flex items-center gap-2">
                    <span className="w-12 font-mono text-[12px] text-zinc-500">{g.key}</span>
                    <span className="rounded border border-zinc-950/10 px-2 py-1 font-mono text-[12px] text-zinc-600">
                      {g.values.join(', ')}
                    </span>
                    <span className="text-zinc-300">→</span>
                    <span
                      className="rounded border px-2.5 py-1 font-mono text-[13px] font-bold tabular-nums"
                      style={{ borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }}
                    >
                      {Number.isInteger(out[i]!.value) ? out[i]!.value : out[i]!.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'rows before', value: String(rows.length) },
              { label: 'rows after', value: String(out.length) },
            ]}
          />
          <ReadOutGrid
            items={[
              { label: 'spread before', value: before.toFixed(2) },
              { label: 'spread after', value: after.toFixed(2) },
            ]}
          />
          <PanelNote>
            Both of the deck’s stated purposes, live. Six rows became three (<strong>data reduction</strong>), and the
            standard deviation fell (<strong>more “stable” data</strong>) — unless you have edited the numbers so the
            group means are further apart than the raw values were.
          </PanelNote>
          <Btn onClick={() => setRows(AGG_START)}>Back to the deck’s numbers</Btn>
        </div>
      </div>

      <Verdict ok={matchesDeck}>
        {matchesDeck ? (
          <>
            This is the deck’s own worked group-by: white → 10, red → 17, black → 8. The lab computes them rather than
            printing them, so the page cannot drift away from the slide.
          </>
        ) : (
          <>
            You have changed the function or the numbers, so this is no longer the slide’s example. Press “Back to the
            deck’s numbers” and choose <code>mean()</code> to get 10, 17 and 8 again.
          </>
        )}
      </Verdict>

      <LabNote>
        Aggregation is the first thing on the pre-processing list and it is the one people forget is a{' '}
        <strong>modelling decision</strong>. Rolling daily sales up to monthly does not just shrink the table — it makes
        day-of-week effects unlearnable, because they no longer exist in the data. The lost variability is the price of
        the stability.
      </LabNote>
      <LabNote>
        The deck’s other example is a purchases table with Transaction ID, Item, Store Location, Date and Price. There,
        aggregating means adding up the two rows that share transaction 101123 — one object where there were two.
      </LabNote>
    </LabBox>
  )
}
