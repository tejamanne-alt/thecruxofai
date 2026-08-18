'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOut, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, drawAxes, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

/*
 * Labs for parts 19–24 — feature scaling, feature engineering, binning,
 * encoding categorical features, the vocabulary, and induction.
 *
 * The scaling lab reproduces both figures the deck prints, and says which of
 * the deck's own inputs produces them.
 */

/* ========================================================================== */
/* Part 19 — feature scaling                                                  */
/* ========================================================================== */

export function ScalingLab() {
  const [v, setV] = useState(73600)
  const [lo, setLo] = useState(12000)
  const [hi, setHi] = useState(98000)
  const [mu, setMu] = useState(54000)
  const [sd, setSd] = useState(16000)

  const newMin = 0
  const newMax = 1

  const minmax = hi === lo ? NaN : ((v - lo) / (hi - lo)) * (newMax - newMin) + newMin
  const zscore = sd === 0 ? NaN : (v - mu) / sd
  // Decimal scaling: the smallest j with max(|v'|) < 1, taken over the range.
  const biggest = Math.max(Math.abs(lo), Math.abs(hi), Math.abs(v))
  let j = 0
  while (biggest / Math.pow(10, j) >= 1) j++
  const decimal = v / Math.pow(10, j)

  const deckMinMax = Math.abs(minmax - 0.716) < 0.0005
  const deckZ = Math.abs(zscore - 1.225) < 0.0005
  const bothMatch = deckMinMax && deckZ && v === 73600

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-white p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">the value, v</span>
              <input
                value={v}
                inputMode="numeric"
                aria-label="the value to scale"
                onChange={(e) => {
                  const n = Number(e.target.value.trim())
                  if (Number.isFinite(n)) setV(n)
                }}
                className="w-28 rounded-lg border border-zinc-950/15 px-2.5 py-1.5 text-right font-mono text-[13px] tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-offset-1"
              />
            </label>
            <Btn onClick={() => setV(73600)}>73,600 — what the deck computes with</Btn>
            <Btn onClick={() => setV(73000)}>73,000 — what the deck’s sentence says</Btn>
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Min-max normalization, to [new_min, new_max]
            </div>
            <div className="overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`v′ = (v − minA) / (maxA − minA) × (new_maxA − new_minA) + new_minA

   = (${v.toLocaleString('en-GB')} − ${lo.toLocaleString('en-GB')}) / (${hi.toLocaleString('en-GB')} − ${lo.toLocaleString('en-GB')}) × (1.0 − 0) + 0
   = ${(v - lo).toLocaleString('en-GB')} / ${(hi - lo).toLocaleString('en-GB')}
   = ${Number.isFinite(minmax) ? minmax.toFixed(3) : '—'}`}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Z-score normalization / standardization
            </div>
            <div className="overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`v′ = (v − μA) / σA

   = (${v.toLocaleString('en-GB')} − ${mu.toLocaleString('en-GB')}) / ${sd.toLocaleString('en-GB')}
   = ${Number.isFinite(zscore) ? zscore.toFixed(3) : '—'}`}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Normalization by decimal scaling
            </div>
            <div className="overflow-x-auto font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`v′ = v / 10^j,  j smallest with max(|v′|) < 1

   j  = ${j}     because ${biggest.toLocaleString('en-GB')} / 10^${j} = ${(biggest / Math.pow(10, j)).toFixed(3)} < 1
   v′ = ${Number.isFinite(decimal) ? decimal.toFixed(3) : '—'}`}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              { label: 'min-max', value: Number.isFinite(minmax) ? minmax.toFixed(3) : '—' },
              { label: 'z-score', value: Number.isFinite(zscore) ? zscore.toFixed(3) : '—' },
              { label: 'decimal', value: Number.isFinite(decimal) ? decimal.toFixed(3) : '—' },
              { label: 'in [0,1]?', value: minmax >= 0 && minmax <= 1 ? 'yes' : 'no' },
            ]}
          />
          <Slider
            label="minA — lowest income"
            value={lo}
            display={lo.toLocaleString('en-GB')}
            min={0}
            max={50000}
            step={1000}
            hint="The deck uses 12,000."
            onChange={setLo}
          />
          <Slider
            label="maxA — highest income"
            value={hi}
            display={hi.toLocaleString('en-GB')}
            min={60000}
            max={200000}
            step={1000}
            hint="The deck uses 98,000."
            onChange={setHi}
          />
          <Slider
            label="μ — the mean"
            value={mu}
            display={mu.toLocaleString('en-GB')}
            min={10000}
            max={100000}
            step={1000}
            hint="The deck uses 54,000."
            onChange={setMu}
          />
          <Slider
            label="σ — the standard deviation"
            value={sd}
            display={sd.toLocaleString('en-GB')}
            min={1000}
            max={40000}
            step={1000}
            hint="The deck uses 16,000."
            onChange={setSd}
          />
        </div>
      </div>

      <Verdict ok={bothMatch}>
        {bothMatch ? (
          <>
            Both of the deck’s printed answers reproduced exactly: <strong>0.716</strong> from min-max and{' '}
            <strong>1.225</strong> from the z-score.
          </>
        ) : (
          <>
            Not the deck’s example as printed. Press the 73,600 button and leave the four sliders at 12,000 / 98,000 /
            54,000 / 16,000 to get 0.716 and 1.225.
          </>
        )}
      </Verdict>

      <div
        className="rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <strong>The slide’s sentence and the slide’s arithmetic use different numbers.</strong> The text says “$73,000
        is mapped to”, and both worked calculations underneath it start from <strong>73,600</strong>. Only 73,600
        produces the printed answers — 73,000 gives 0.709 and 1.188, and you can check that with the two buttons above.
        So treat 73,000 as a typo in the sentence and 73,600 as the value the example is really about.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
          <div className="mb-1.5 text-[13px] font-semibold text-zinc-950">Use normalization when…</div>
          <ul className="crux-prose flex list-disc flex-col gap-1 pl-4 text-[12.5px]/[1.6] text-zinc-700">
            <li>approximate upper and lower bounds on the data are known</li>
            <li>the data is roughly uniform across that range — age, say — and not skewed, like income</li>
            <li>the algorithm makes no assumption about the distribution, such as KNN or a neural network</li>
            <li>you want the result inside [0, 1] or [−1, 1]</li>
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
          <div className="mb-1.5 text-[13px] font-semibold text-zinc-950">Use standardization when…</div>
          <ul className="crux-prose flex list-disc flex-col gap-1 pl-4 text-[12.5px]/[1.6] text-zinc-700">
            <li>the algorithm does assume a distribution, usually Gaussian</li>
            <li>you do not need a bounded range — this one has none</li>
            <li>outliers are present: it is less affected by them than min-max is</li>
          </ul>
        </div>
      </div>

      <LabNote>
        Drag <em>maxA</em> up to 200,000 and watch the min-max answer collapse towards zero while the z-score barely
        moves. That is the deck’s “less affected by outliers” in one gesture: min-max is anchored to the two most
        extreme values in the data, so one wrong maximum rescales every other row.
      </LabNote>
      <LabNote>
        The two-line note at the bottom of slide 47 is the one that gets marked in exams:{' '}
        <strong>fit the scalers to the training data only</strong>, then use them to transform the training set{' '}
        <em>and</em> the test set. Fit on everything and the test set’s minimum, maximum, mean and deviation have leaked
        into the model — the score you report is then about data the model has already seen.
      </LabNote>
      <LabNote>
        And the note at the top right: <strong>scaling the target values is generally not required.</strong> Scaling is
        about making input columns comparable to each other; the target has nothing to be comparable to.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 20 — the four moves of feature engineering                            */
/* ========================================================================== */

const ALL_ATTRS = [
  'Name',
  'Gender',
  'Age',
  'DataOfBirth',
  'Organisation',
  'JobTitle',
  'NatureOfJob',
  'EntranceScore',
  'EligibilityScore',
  'PreviousDegree',
  'WILPBatch',
  'Section',
  'ISM',
  'MFML',
  'ACI',
  'ML',
  'NLP',
]

/** The columns slide 52 strikes through. */
const STRUCK = [
  'Name',
  'Gender',
  'Age',
  'DataOfBirth',
  'Organisation',
  'JobTitle',
  'NatureOfJob',
  'EntranceScore',
  'EligibilityScore',
  'WILPBatch',
  'Section',
]

const TRANSFORM_STAGES = [
  ['PreviousDegree', 'SEM-1-Total', 'SEM-2-Total', 'SEM-3-Total', 'CGPA', 'isEligibleForDissertation'],
  ['PreviousDegree', 'SEM-1-GPA', 'SEM-2-GPA', 'SEM-3-GPA', 'CGPA', 'isEligibleForDissertation'],
  ['PreviousDegree', 'S1-isComplete', 'S2-isComplete', 'S3-isComplete', 'CGPA', 'isEligibleForDissertation'],
]

const MOVES = [
  { id: 'extract', label: 'Extraction' },
  { id: 'select', label: 'Selection' },
  { id: 'construct', label: 'Construction' },
  { id: 'transform', label: 'Transform' },
] as const

type Move = (typeof MOVES)[number]['id']

export function FeatureEngLab() {
  const [move, setMove] = useState<Move>('select')
  const [applied, setApplied] = useState(false)
  const [stage, setStage] = useState(0)

  const kept = move === 'select' && applied ? ALL_ATTRS.filter((a) => !STRUCK.includes(a)) : ALL_ATTRS

  return (
    <LabBox>
      <Presets
        items={MOVES.map((m) => ({ id: m.id, label: m.label }))}
        at={move}
        onPick={(m) => {
          setMove(m)
          setApplied(false)
          setStage(0)
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
          {move === 'transform' ? (
            <>
              <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                AttributesOfInterest — slide 54, all three versions
              </div>
              <div className="flex flex-col gap-1">
                {TRANSFORM_STAGES[stage]!.map((a) => (
                  <div
                    key={a}
                    className="rounded border px-2.5 py-1.5 font-mono text-[12.5px]"
                    style={
                      TRANSFORM_STAGES[0]!.includes(a)
                        ? { borderColor: 'rgba(9,9,11,0.10)', background: '#fff', color: '#3f3f46' }
                        : { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                    }
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                {TRANSFORM_STAGES.map((_, i) => (
                  <Chip
                    key={i}
                    on={stage === i}
                    label={['raw totals', 'GPAs', 'completed?'][i]!}
                    onClick={() => setStage(i)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                AttributesOfInterest — the case study’s column list
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1">
                {ALL_ATTRS.map((a) => {
                  const gone = move === 'select' && applied && STRUCK.includes(a)
                  return (
                    <div
                      key={a}
                      className="rounded border px-2.5 py-1.5 font-mono text-[12px]"
                      style={
                        gone
                          ? {
                              borderColor: 'rgba(9,9,11,0.08)',
                              background: 'rgba(9,9,11,0.03)',
                              color: '#d4d4d8',
                              textDecoration: 'line-through',
                            }
                          : { borderColor: 'rgba(9,9,11,0.10)', background: '#fff', color: '#3f3f46' }
                      }
                    >
                      {a}
                    </div>
                  )
                })}
                <div className="px-2.5 py-1.5 font-mono text-[12px] text-zinc-400">……….</div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOutGrid
            items={[
              {
                label: 'columns',
                value: move === 'transform' ? String(TRANSFORM_STAGES[stage]!.length) : String(kept.length),
              },
              { label: 'move', value: MOVES.find((m) => m.id === move)!.label },
            ]}
          />
          {move === 'select' && (
            <>
              <Btn primary onClick={() => setApplied(!applied)}>
                {applied ? 'Put the columns back' : 'Drop the struck-out columns'}
              </Btn>
              <PanelNote>
                Slide 52 strikes out eleven of the seventeen and keeps six. The reasons it gives are: handle redundant
                features, remove irrelevant features, and drop features missing a large number of values. The code line
                on the slide is <code>dataframe = dataframe.drop([‘COLNAME-1’,‘COLNAME-2’], axis=1)</code>.
              </PanelNote>
            </>
          )}
          {move === 'extract' && (
            <PanelNote>
              Extraction does not choose among the existing columns — it makes <em>fewer, new</em> ones out of them. The
              deck names one method, <strong>Principal Components Analysis</strong>, and gives the reason:
              dimensionality reduction, because as dimensionality increases the data becomes increasingly sparse in the
              space it occupies. No worked example is printed, so none is invented here.
            </PanelNote>
          )}
          {move === 'construct' && (
            <PanelNote>
              Construction goes the other way — it <em>adds</em> columns. The deck names three sources: polynomial
              expansion using univariate mathematical functions, feature crossing to capture interactions between
              features, and business logic from the domain of the use case. Again, no worked example is printed.
            </PanelNote>
          )}
          {move === 'transform' && (
            <PanelNote>
              Same six columns, three different things in the middle four. Totals become GPAs become plain yes/no flags
              — each step throws information away and each may be the right call, depending on what the model needs.
            </PanelNote>
          )}
        </div>
      </div>

      <Verdict ok={move === 'select' ? applied : true}>
        {move === 'select' && !applied && <>Press the button and watch eleven columns go.</>}
        {move === 'select' && applied && (
          <>
            Six left of seventeen. Notice what survived: PreviousDegree and the five course columns. The observation
            driving it is on slide 50 — “students with similar educational background tend to perform the same in the
            exams” — so PreviousDegree is the one demographic column that earns its place.
          </>
        )}
        {move === 'extract' && (
          <>
            The four moves are easy to confuse, and the exam-safe distinction is this: extraction and construction{' '}
            <strong>make new columns</strong>, selection <strong>keeps a subset of the old ones</strong>, and transform{' '}
            <strong>rewrites a column in place</strong>.
          </>
        )}
        {move === 'construct' && (
          <>
            Construction is the only one of the four that can add information the model could not have derived — the
            business-logic case. Polynomial expansion and crossing add nothing the data did not already contain; they
            just put it in a form a linear model can use.
          </>
        )}
        {move === 'transform' && (
          <>
            The third version, S1-isComplete, is the one the case study actually needs: the accounts team wants to know
            who is eligible for the project semester, and for that a yes/no is enough.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck opens the feature engineering slide with three words that explain why any of this happens —{' '}
        <strong>irrelevant features</strong>. A column that carries no signal is not free: it gives the model one more
        way to find a coincidence in the training data.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 21 — binning                                                          */
/* ========================================================================== */

const SALARIES = [
  18, 19, 21, 22, 22, 23, 24, 25, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 35, 36, 38, 40, 42, 45, 48, 52, 58, 64, 72,
  88,
]

export function BinningLab() {
  const [n, setN] = useState(4)
  const [kind, setKind] = useState<'width' | 'depth'>('width')
  const [outlier, setOutlier] = useState(false)

  const data = [...SALARIES, ...(outlier ? [900] : [])].sort((a, b) => a - b)
  const A = data[0]!
  const B = data[data.length - 1]!
  const W = (B - A) / n

  /** Bin edges, recomputed from the rule rather than stored. */
  const edges: number[] = []
  if (kind === 'width') {
    for (let i = 0; i <= n; i++) edges.push(A + i * W)
  } else {
    edges.push(A)
    for (let i = 1; i < n; i++) edges.push(data[Math.round((i * data.length) / n)]!)
    edges.push(B)
  }

  const counts = new Array(n).fill(0) as number[]
  for (const v of data) {
    let b = 0
    while (b < n - 1 && v >= edges[b + 1]!) b++
    counts[b]! += 1
  }
  const emptyish = counts.filter((c) => c === 0).length
  const biggest = Math.max(...counts)

  function draw(g: CanvasRenderingContext2D, W2: number, H: number): Frame {
    const f = drawAxes(g, W2, H, {
      xmin: A,
      xmax: B,
      ymin: 0,
      ymax: Math.max(1, biggest) * 1.2,
      xlab: 'salary (₹000s)',
      ylab: 'people',
    })
    const acc = accentColour()
    for (let b = 0; b < n; b++) {
      const x0 = f.px(edges[b]!)
      const x1 = f.px(edges[b + 1]!)
      g.fillStyle = counts[b] === 0 ? 'rgba(220,38,38,0.16)' : acc
      g.fillRect(x0 + 1, f.py(counts[b]!), Math.max(2, x1 - x0 - 2), f.py(0) - f.py(counts[b]!))
      g.fillStyle = '#3f3f46'
      g.font = '600 11px ui-sans-serif, system-ui'
      g.textAlign = 'center'
      g.fillText(String(counts[b]), (x0 + x1) / 2, f.py(counts[b]!) - 5)
    }
    // The raw values along the axis, so you can see what the bins are hiding.
    for (const v of data) {
      g.fillStyle = 'rgba(9,9,11,0.45)'
      g.fillRect(f.px(v) - 0.75, f.B - 5, 1.5, 5)
    }
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Presets
          items={[
            { id: 'width' as const, label: 'Equal-width (distance)' },
            { id: 'depth' as const, label: 'Equal-depth (frequency)' },
          ]}
          at={kind}
          onPick={setKind}
        />
        <Btn onClick={() => setOutlier(!outlier)}>
          {outlier ? 'Remove the ₹9,00,000 salary' : 'Add one ₹9,00,000 salary'}
        </Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={310}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${kind}-${n}-${outlier}`}
          caption="Thirty salaries, binned. The ticks along the bottom are the raw values the bins are standing in for."
        />
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Fullest bin holds"
            value={`${biggest} of ${data.length}`}
            tone={biggest / data.length > 0.7 ? '#dc2626' : undefined}
            note={emptyish ? `${emptyish} bin${emptyish === 1 ? '' : 's'} completely empty` : 'no empty bins'}
          />
          <Slider
            label="Number of intervals, N"
            value={n}
            display={String(n)}
            min={2}
            max={8}
            step={1}
            hint="More bins keep more detail and hold fewer people each."
            onChange={setN}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3 font-mono text-[12px]/[1.8] text-zinc-700">
            {kind === 'width' ? (
              <>
                W = (B − A) / N
                <br />W = ({B} − {A}) / {n} = {W.toFixed(1)}
              </>
            ) : (
              <>
                each bin ≈ {(data.length / n).toFixed(1)} rows
                <br />
                edges: {edges.map((e) => Math.round(e)).join(', ')}
              </>
            )}
          </div>
          <PanelNote>
            {kind === 'width'
              ? 'Equal-width divides the range into N intervals of equal size — a uniform grid. The most straightforward, and the deck warns outliers may dominate.'
              : 'Equal-depth divides into N intervals each holding about the same number of samples. The deck’s verdict: good data scaling.'}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={!(kind === 'width' && outlier)}>
        {kind === 'width' && outlier ? (
          <>
            One salary has ruined it. With B = 900 the width is {W.toFixed(0)}, so {biggest} of the {data.length} people
            fall in the first bin and the rest are empty or nearly so. That is the deck’s “outliers may dominate
            presentation”, and “skewed data is not handled well”, in one picture.
          </>
        ) : kind === 'depth' && outlier ? (
          <>
            Equal-depth shrugs it off. The extreme salary lands alone in the top bin and every other bin still holds
            about {(data.length / n).toFixed(0)} people — the edges moved instead of the counts.
          </>
        ) : (
          <>
            With no outlier the two rules look similar. Press the button to add one huge salary, then compare them again
            — that is where they part company.
          </>
        )}
      </Verdict>

      <LabNote>
        The deck gives four reasons to discretize at all. Some algorithms prefer discrete features —{' '}
        <strong>
          naive Bayes, decision trees and their ensembles including random forest, minimum distance classifiers and KNN
        </strong>{' '}
        are the ones it names. It handles outliers, by putting them in a bin instead of leaving them as a number. And it
        improves the spread of the data.
      </LabNote>
      <LabNote>
        The output can be <strong>interval labels</strong> (0–10, 11–20, and so on) or{' '}
        <strong>conceptual labels</strong> (youth, adult, senior). The second kind is worth more to a human reading the
        model and worth exactly the same to the model itself.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 22 — encoding categorical features                                    */
/* ========================================================================== */

const CARS = [
  { car: 'A', fuel: 'Gas' },
  { car: 'B', fuel: 'Diesel' },
  { car: 'C', fuel: 'Gas' },
  { car: 'D', fuel: 'gas' },
]

export function EncodingLab() {
  const [fold, setFold] = useState(false)
  const [scheme, setScheme] = useState<'onehot' | 'label'>('onehot')

  const key = (f: string) => (fold ? f.toLowerCase() : f)
  const cats: string[] = []
  for (const r of CARS) if (!cats.includes(key(r.fuel))) cats.push(key(r.fuel))

  const codes = Object.fromEntries(cats.map((c, i) => [c, i + 1])) as Record<string, number>
  const deckLabelMatch = !fold && codes['Gas'] === 1 && codes['Diesel'] === 2 && codes['gas'] === 3

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        <Presets
          items={[
            { id: 'onehot' as const, label: 'One Hot / Dummy Encoding' },
            { id: 'label' as const, label: 'Label Encoding' },
          ]}
          at={scheme}
          onPick={setScheme}
        />
        <Btn onClick={() => setFold(!fold)}>
          {fold ? 'Treat “gas” and “Gas” as different again' : 'Treat “gas” and “Gas” as the same'}
        </Btn>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                <th className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase">
                  Car
                </th>
                <th className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase">
                  Fuel
                </th>
                {scheme === 'onehot' ? (
                  cats.map((c) => (
                    <th
                      key={c}
                      className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] uppercase"
                      style={{ color: 'var(--acc)' }}
                    >
                      {c}
                    </th>
                  ))
                ) : (
                  <th
                    className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] uppercase"
                    style={{ color: 'var(--acc)' }}
                  >
                    Fuel (coded)
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {CARS.map((r) => (
                <tr key={r.car}>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-zinc-700">{r.car}</td>
                  <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-zinc-700">{r.fuel}</td>
                  {scheme === 'onehot' ? (
                    cats.map((c) => (
                      <td
                        key={c}
                        className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono tabular-nums"
                        style={{ color: key(r.fuel) === c ? 'var(--acc)' : '#a1a1aa' }}
                      >
                        {key(r.fuel) === c ? 1 : 0}
                      </td>
                    ))
                  ) : (
                    <td
                      className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono font-bold tabular-nums"
                      style={{ color: 'var(--acc)' }}
                    >
                      {codes[key(r.fuel)]}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut
            label="Distinct categories found"
            value={String(cats.length)}
            tone={cats.length > 2 ? '#dc2626' : '#0d9488'}
            note={cats.join(', ')}
          />
          <ReadOutGrid
            items={[
              { label: 'new columns', value: scheme === 'onehot' ? String(cats.length) : '1' },
              { label: 'invents an order?', value: scheme === 'onehot' ? 'no' : 'yes' },
            ]}
          />
          <PanelNote>
            {scheme === 'onehot'
              ? 'One column per category, one 1 per row. No two categories are nearer each other than any other pair — which is right, because Gas is not “between” Diesel and anything.'
              : 'One column, one integer per category. Cheap, and it quietly asserts that Diesel (2) sits between Gas (1) and whatever gets 3. Nothing in the data says that.'}
          </PanelNote>
        </div>
      </div>

      <Verdict ok={fold}>
        {fold ? (
          <>
            Two categories, which is what the data really contains. Cars A, C and D all run on petrol and are now
            encoded the same way.
          </>
        ) : (
          <>
            Three categories from two fuels. Car D wrote “gas” in lower case, and the encoder has made it a third kind
            of engine — one that appears exactly once in the training set.
          </>
        )}
      </Verdict>

      <div
        className="rounded-lg border p-3 text-[13px]/[1.6]"
        style={{ borderColor: 'rgba(217,119,6,0.45)', background: 'rgba(217,119,6,0.09)', color: '#7c2d12' }}
      >
        <strong>The slide’s own two tables do not agree about this.</strong> On slide 57 the one-hot table gives car D a
        1 in the <em>Gas</em> column, so it has folded the case. The label-encoding table beneath it codes Gas → 1,
        Diesel → 2, Gas → 1, gas → <strong>3</strong>, so it has not. Both are printed on the same slide, and the switch
        above reproduces each. Whether that is deliberate or a slip, the lesson is the same one either way: an encoder
        is only as clean as the strings you hand it.
        {deckLabelMatch && (
          <div className="mt-2">You are looking at the deck’s label-encoding table exactly as printed: 1, 2, 1, 3.</div>
        )}
      </div>

      <LabNote>
        The deck’s two definitions are worth learning in its own words. <strong>Binarization</strong> maps a categorical
        attribute into one or more binary variables — one hot, or dummy, encoding. <strong>Label encoding</strong> maps
        categorical features to a numeric representation.
      </LabNote>
      <LabNote>
        Which to use is decided by the attribute type from part 3. A <strong>nominal</strong> column needs one-hot,
        because label encoding would invent an order that is not there. An <strong>ordinal</strong> column — Gold,
        Platinum, or low/medium/high — can take label encoding, because the order is real and the numbers can be chosen
        to respect it.
      </LabNote>
      <LabNote>
        Slide 58 sets the same problem loose on messier data: a feedback table where the monthly spend is written{' '}
        <code>$35</code>, <code>Rs.500</code>, <code>Rs.250</code> and <code>$20</code>. Two currencies in one column,
        blank cells in three others, and a recommendation column of High, Low, Medium — ordinal, and so a candidate for
        label encoding once the currencies are reconciled. The deck poses that as a question and prints no answer, so
        none is printed here.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 23 — challenges, and the vocabulary                                   */
/* ========================================================================== */

const LOAN = [
  { amount: '40 lakhs', period: '5 years', score: 1000, defaulter: 'No' },
  { amount: '10 Lakhs', period: '5 months', score: 550, defaulter: 'YES' },
  { amount: '80 Lakhs', period: '3 years', score: 950, defaulter: 'No' },
  { amount: '20 Lakhs', period: '4 years', score: 1500, defaulter: 'No' },
]

const TERMS = [
  {
    id: 'ex',
    term: 'Training example',
    def: 'An example of the form ⟨x, f(x)⟩.',
    here: 'One row. x is (40 lakhs, 5 years, 1000) and f(x) is “No”. Four rows, four training examples.',
  },
  {
    id: 'target',
    term: 'Target function (target concept)',
    def: 'The true function f.',
    here: 'The rule that really decides who defaults. You never see it — you only ever see four of its outputs.',
  },
  {
    id: 'hyp',
    term: 'Hypothesis',
    def: 'A proposed function h believed to be similar to f.',
    here: '“Anyone with a credit score under 700 defaults” is a hypothesis. It fits all four rows. So does “anyone borrowing for less than a year defaults”.',
  },
  {
    id: 'concept',
    term: 'Concept',
    def: 'A boolean function. Examples where f(x) = 1 are positive examples or positive instances; where f(x) = 0 they are negative examples or negative instances.',
    here: 'Defaulter is boolean, so this is a concept. One positive instance here, and three negative ones.',
  },
  {
    id: 'clf',
    term: 'Classifier',
    def: 'A discrete-valued function. The possible values f(x) ∈ {1, …, K} are called the classes or class labels.',
    here: 'K = 2 here: defaulter and not. With three risk bands instead it would be K = 3, and the word would still be classifier.',
  },
  {
    id: 'space',
    term: 'Hypothesis Space',
    def: 'The space of all hypotheses that can, in principle, be output by a learning algorithm.',
    here: 'Everything your chosen model could possibly say. A straight-line rule on credit score can never express “defaults if the score is either very low or very high”, so that rule is not in its space at all — no amount of data will find it.',
  },
  {
    id: 'version',
    term: 'Version Space',
    def: 'The space of all hypotheses in the hypothesis space that have not yet been ruled out by a training example.',
    here: 'Both hypotheses above are still standing after four rows. Collect a fifth row that separates them and one of them leaves the version space for good.',
  },
]

const CHALLENGES = [
  { group: 'Training Data', items: ['Insufficient', 'Non representative'] },
  { group: 'Model Selection', items: ['Overfitting', 'Underfitting'] },
  { group: 'Validation and Testing', items: [] },
]

export function VocabularyLab() {
  const [at, setAt] = useState('ex')
  const t = TERMS.find((x) => x.id === at)!

  const defaulters = LOAN.filter((r) => r.defaulter.toUpperCase() === 'YES')
  const scores = LOAN.map((r) => r.score)

  return (
    <LabBox>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  {['Amount taken', 'Period', 'Credit Score', 'Defaulter'].map((h) => (
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
                {LOAN.map((r, i) => {
                  const pos = r.defaulter.toUpperCase() === 'YES'
                  return (
                    <tr key={i}>
                      {[r.amount, r.period, String(r.score), r.defaulter].map((v, ci) => (
                        <td
                          key={ci}
                          className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-[12px]"
                          style={{
                            background: at === 'concept' && pos ? 'rgba(13,148,136,0.10)' : undefined,
                            color: ci === 3 ? (pos ? '#0d9488' : '#71717a') : '#3f3f46',
                            fontWeight: at === 'ex' && i === 0 ? 700 : 400,
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

          <div className="flex flex-wrap gap-2">
            {TERMS.map((x) => (
              <Chip key={x.id} on={at === x.id} label={x.term} onClick={() => setAt(x.id)} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <ReadOut label="Term" value={t.term} />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3">
            <div className="mb-1 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The book’s definition
            </div>
            <div className="text-[12.5px]/[1.65] text-zinc-800">{t.def}</div>
          </div>
          <PanelNote>{t.here}</PanelNote>
          <ReadOutGrid
            items={[
              { label: 'positive instances', value: String(defaulters.length) },
              { label: 'score range', value: `${Math.min(...scores)}–${Math.max(...scores)}` },
            ]}
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          The challenges the deck lists — slide 59
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {CHALLENGES.map((c) => (
            <div key={c.group} className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3">
              <div className="text-[13px] font-semibold text-zinc-950">{c.group}</div>
              {c.items.length ? (
                <ul className="mt-1 flex list-disc flex-col gap-0.5 pl-4 text-[12.5px]/[1.6] text-zinc-700">
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-1 text-[12.5px]/[1.6] text-zinc-500">no sub-headings given</div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px]/[1.6] text-zinc-500">
          The slide carries a note to students in capitals: more on this slide will be discussed by faculty only in
          later modules 4, 5, 6 on appropriate sections. Two of the five have already appeared in this lecture as
          Challenge 1 and Challenge 2 — insufficient training data on slide 30, and non-representative training data on
          slide 41.
        </p>
      </div>

      <LabNote>
        The two you have already met are the two about <strong>data</strong>, and that is not a coincidence — this is
        the data lecture. Overfitting and underfitting are about the <em>model</em>, and they need the model modules
        before they can be discussed honestly.
      </LabNote>
      <LabNote>
        <strong>Hypothesis space</strong> is the term that carries the most weight later. It is what makes model choice
        a real decision: choosing a model is choosing which rules are even sayable, before any data arrives.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 24 — the inductive learning hypothesis                                */
/* ========================================================================== */

const SPORT_COLS = ['Sky', 'AirTemp', 'Humidity', 'Wind', 'Water', 'Forecast'] as const

const SPORT: Array<{ x: string[]; yes: boolean; humidityTarget: number; p: number }> = [
  { x: ['Sunny', 'Warm', 'Normal', 'Strong', 'Warm', 'Same'], yes: true, humidityTarget: 60, p: 0.95 },
  { x: ['Sunny', 'Warm', 'High', 'Strong', 'Warm', 'Same'], yes: true, humidityTarget: 75, p: 0.7 },
  { x: ['Rainy', 'Cold', 'High', 'Strong', 'Warm', 'Change'], yes: false, humidityTarget: 70, p: 0.5 },
  { x: ['Sunny', 'Warm', 'High', 'Strong', 'Cool', 'Change'], yes: true, humidityTarget: 45, p: 0.6 },
]

const TARGET_KINDS = [
  { id: 'discrete', label: 'Discrete — f(x) ∈ {Yes, No, Maybe}' },
  { id: 'continuous', label: 'Continuous — f(x) ∈ [20–100]' },
  { id: 'prob', label: 'Probability estimation — f(x) ∈ [0–1]' },
] as const

type TargetKind = (typeof TARGET_KINDS)[number]['id']

/** What each slot of a hypothesis may hold: anything, nothing, or a value. */
function optionsFor(col: number) {
  const seen: string[] = []
  for (const r of SPORT) if (!seen.includes(r.x[col]!)) seen.push(r.x[col]!)
  return ['?', ...seen, '∅']
}

const H_GENERAL = ['?', '?', '?', '?', '?', '?']
const H_SPECIFIC = ['∅', '∅', '∅', '∅', '∅', '∅']
const H_DECK = ['?', 'Cold', 'High', '?', '?', '?']

function covers(h: string[], x: string[]) {
  return h.every((slot, i) => slot === '?' || slot === x[i])
}

export function InductionLab() {
  const [kind, setKind] = useState<TargetKind>('discrete')
  const [h, setH] = useState<string[]>(H_DECK)

  const preds = SPORT.map((r) => covers(h, r.x))
  const correct = SPORT.filter((r, i) => preds[i] === r.yes).length
  const isDeck = h.every((s, i) => s === H_DECK[i])
  const isGeneral = h.every((s) => s === '?')
  const isSpecific = h.every((s) => s === '∅')

  function cycle(i: number) {
    const opts = optionsFor(i)
    const at = opts.indexOf(h[i]!)
    setH(h.map((s, j) => (j === i ? opts[(at + 1) % opts.length]! : s)))
  }

  return (
    <LabBox>
      <Presets items={TARGET_KINDS.map((t) => ({ id: t.id, label: t.label }))} at={kind} onPick={setKind} />

      <div className="overflow-x-auto rounded-lg border border-zinc-950/10 bg-white p-4">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr>
              <th className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase">
                Example
              </th>
              {SPORT_COLS.map((c, i) => (
                <th
                  key={c}
                  className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase"
                >
                  {kind === 'continuous' && i === 2 ? 'Altitude' : c}
                </th>
              ))}
              <th
                className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] uppercase"
                style={{ color: 'var(--acc)' }}
              >
                {kind === 'discrete' ? 'EnjoySport?' : kind === 'continuous' ? 'Humidity' : 'P(EnjoySport = Yes)'}
              </th>
              {kind === 'discrete' && (
                <th className="border-b border-zinc-950/10 px-2 py-2 text-left text-[11px] tracking-[0.05em] text-zinc-500 uppercase">
                  h says
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {SPORT.map((r, ri) => (
              <tr key={ri}>
                <td className="border-t border-zinc-950/[0.07] px-2 py-1.5 text-zinc-400">{ri + 1}</td>
                {r.x.map((v, ci) => (
                  <td
                    key={ci}
                    className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono text-[12px]"
                    style={{
                      color: kind === 'discrete' && h[ci] !== '?' && h[ci] !== v ? '#dc2626' : '#3f3f46',
                    }}
                  >
                    {v}
                  </td>
                ))}
                <td
                  className="border-t border-zinc-950/[0.07] px-2 py-1.5 font-mono font-semibold"
                  style={{ color: 'var(--acc)' }}
                >
                  {kind === 'discrete' ? (r.yes ? 'Yes' : 'No') : kind === 'continuous' ? r.humidityTarget : r.p}
                </td>
                {kind === 'discrete' && (
                  <td className="border-t border-zinc-950/[0.07] px-2 py-1.5">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[11.5px] font-semibold"
                      style={
                        preds[ri] === r.yes
                          ? { background: 'rgba(13,148,136,0.12)', color: '#0d9488' }
                          : { background: 'rgba(220,38,38,0.10)', color: '#dc2626' }
                      }
                    >
                      {preds[ri] ? 'Yes' : 'No'} {preds[ri] === r.yes ? '✓' : '✗'}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {kind === 'discrete' ? (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Build a hypothesis — press a slot to cycle it
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[13px]">
              <span className="text-zinc-400">⟨</span>
              {h.map((slot, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => cycle(i)}
                  aria-label={`${SPORT_COLS[i]}: currently ${slot}`}
                  className="cursor-pointer rounded border px-2 py-1.5 text-[12.5px] font-semibold"
                  style={
                    slot === '?'
                      ? { borderColor: 'rgba(9,9,11,0.12)', background: '#fff', color: '#a1a1aa' }
                      : slot === '∅'
                        ? { borderColor: 'rgba(220,38,38,0.35)', background: 'rgba(220,38,38,0.06)', color: '#dc2626' }
                        : { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                  }
                >
                  {slot}
                </button>
              ))}
              <span className="text-zinc-400">⟩</span>
            </div>
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-1.5 text-[10.5px] text-zinc-500">
              {SPORT_COLS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip on={isDeck} label="⟨?, Cold, High, ?, ?, ?⟩" onClick={() => setH([...H_DECK])} />
              <Chip on={isGeneral} label="Most general" onClick={() => setH([...H_GENERAL])} />
              <Chip on={isSpecific} label="Most specific" onClick={() => setH([...H_SPECIFIC])} />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
            <ReadOut
              label="Rows this hypothesis gets right"
              value={`${correct} of 4`}
              tone={correct === 4 ? '#0d9488' : correct === 0 ? '#dc2626' : undefined}
            />
            <ReadOutGrid
              items={[
                { label: 'days called Yes', value: String(preds.filter(Boolean).length) },
                { label: 'slots fixed', value: String(h.filter((s) => s !== '?' && s !== '∅').length) },
              ]}
            />
            <PanelNote>
              A slot holds a value (must match exactly), <strong>?</strong> (anything will do), or <strong>∅</strong>{' '}
              (nothing will do — one of these makes the whole hypothesis reject every day).
            </PanelNote>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <PanelNote>
            {kind === 'continuous'
              ? 'Same six attributes, and the target is now a number in the range 20 to 100. Notice what the deck did to make room for it: the third column is relabelled Altitude, and Humidity moves to the end as the thing being predicted. The hypothesis builder is switched off here, because a ⟨?, Cold, High, …⟩ tuple can only say yes or no.'
              : 'Same rows again, and now the target is a probability between 0 and 1. This is the third row of the deck’s little table: discrete gives classification, continuous gives regression, and a probability gives probability estimation.'}
          </PanelNote>
        </div>
      )}

      {kind === 'discrete' && (
        <Verdict ok={correct === 4}>
          {isDeck && (
            <>
              This is the deck’s “one possible hypothesis” — and it gets <strong>0 of 4</strong> right. It demands Cold,
              and the only cold day is the one where the answer was No. The slide offers it as an example of the
              notation, not as a good rule, and it is worth seeing that the two are different things.
            </>
          )}
          {isGeneral && (
            <>
              The most general hypothesis says every day is a positive example. It gets the three Yes days right and the
              Rainy one wrong — 3 of 4, without looking at the data at all.
            </>
          )}
          {isSpecific && (
            <>
              The most specific hypothesis says no day is ever positive. It gets the single No day right and the other
              three wrong. Between this and the one above lies everything a learner can say.
            </>
          )}
          {!isDeck && !isGeneral && !isSpecific && (
            <>
              {correct === 4 ? (
                <>
                  All four. If you reached ⟨Sunny, Warm, ?, Strong, ?, ?⟩ you have found the most specific hypothesis
                  that covers every positive example — this page works that out by checking coverage, and the deck does
                  not print it.
                </>
              ) : (
                <>
                  {correct} of 4. Loosen a slot to ? to catch more days, or fix one to a value to reject more of them.
                </>
              )}
            </>
          )}
        </Verdict>
      )}

      <LabNote>
        The <strong>inductive learning hypothesis</strong>, in the deck’s own words: any hypothesis found to approximate
        the target function well over a sufficiently large set of training examples will also approximate the target
        function well over other unobserved examples. It is an assumption, not a theorem — and it is the assumption
        every train/test split on this course quietly rests on.
      </LabNote>
      <LabNote>
        The three target types are the same three kinds of supervised problem lecture 1 named. A discrete f(x) is{' '}
        <strong>classification</strong>, a continuous f(x) is <strong>regression</strong>, and an f(x) in [0, 1] is{' '}
        <strong>probability estimation</strong>. The data does not change; only what you ask of the last column.
      </LabNote>
    </LabBox>
  )
}
