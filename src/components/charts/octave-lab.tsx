'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, FrBox, LabBox, LabNote } from '@/components/charts/matrix-ui'
import { PanelNote, ReadOutGrid, Slider } from '@/components/sessions/session-parts'
import { accentColour, clamp, dot, drawAxes, grip, type Frame } from '@/lib/chart/frame'
import { display, isError, run, type Env } from '@/lib/model/octave'
import { useState } from 'react'

/* ========================================================================== */
/* Part 1 — the colon, and what plot really draws                             */
/* ========================================================================== */

const FUNCS = [
  { id: 'sin', code: 'sin(x)', f: (x: number) => Math.sin(x) },
  { id: 'cos', code: 'cos(x)', f: (x: number) => Math.cos(x) },
  { id: 'sq', code: 'x.^2 / 20', f: (x: number) => (x * x) / 20 },
  { id: 'damp', code: 'exp(-x/4) .* sin(3*x)', f: (x: number) => Math.exp(-x / 4) * Math.sin(3 * x) },
] as const

type FuncId = (typeof FUNCS)[number]['id']

/**
 * Octave does not know your function. It only knows the list of points you
 * handed it, and it joins them with straight lines. Making the step coarse
 * enough to break the curve is the fastest way to see that.
 */
export function OctavePlotLab() {
  const [which, setWhich] = useState<FuncId>('sin')
  const [step, setStep] = useState(0.5)
  const [xmax, setXmax] = useState(10)
  const [at, setAt] = useState(3)

  const spec = FUNCS.find((f) => f.id === which) ?? FUNCS[0]
  const xs: number[] = []
  for (let v = 0; v <= xmax + 1e-9; v += step) xs.push(Number(v.toFixed(6)))
  const ys = xs.map(spec.f)

  // The marker rides the samples, because those are all Octave was given.
  const nearest = xs.reduce((best, v, i) => (Math.abs(v - at) < Math.abs(xs[best] - at) ? i : best), 0)
  const mx = xs[nearest]
  const my = ys[nearest]

  const lo = Math.min(-0.2, ...ys) - 0.15
  const hi = Math.max(0.2, ...ys) + 0.15

  function draw(g: CanvasRenderingContext2D, W: number, H: number): Frame {
    const f = drawAxes(g, W, H, { xmin: 0, xmax, ymin: lo, ymax: hi, xlab: 'x', ylab: 'y' })
    const acc = accentColour()

    // The true curve, faint, so the straight-line joins are obvious against it.
    g.strokeStyle = 'rgba(9,9,11,0.18)'
    g.lineWidth = 1
    g.beginPath()
    for (let p = 0; p <= 400; p++) {
      const x = (p / 400) * xmax
      const y = spec.f(x)
      if (p === 0) g.moveTo(f.px(x), f.py(y))
      else g.lineTo(f.px(x), f.py(y))
    }
    g.stroke()

    g.strokeStyle = acc
    g.lineWidth = 2
    g.beginPath()
    xs.forEach((x, i) => {
      if (i === 0) g.moveTo(f.px(x), f.py(ys[i]))
      else g.lineTo(f.px(x), f.py(ys[i]))
    })
    g.stroke()

    if (xs.length <= 90) xs.forEach((x, i) => dot(g, f.px(x), f.py(ys[i]), 2.6, acc))

    grip(g, f.px(mx), f.py(my), '#09090b', 7)
    return f
  }

  return (
    <LabBox>
      <div className="flex flex-wrap gap-2">
        {FUNCS.map((fn) => (
          <Chip key={fn.id} on={fn.id === which} label={fn.code} onClick={() => setWhich(fn.id)} />
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{}}
          jumpKey={`${which}-${step}-${xmax}`}
          handles={(f) => [{ id: 'm', px: f.px(mx), py: f.py(my), grab: 'anywhere' }]}
          onDragTo={(_id, x) => setAt(clamp(x, 0, xmax))}
          caption="Grey is the real curve. Coloured is what Octave drew. Press anywhere to move the black grip to the nearest sample."
        />
        <div className="flex flex-col gap-[18px] rounded-lg border border-zinc-950/10 bg-zinc-50 p-5">
          <Slider
            label="Step"
            value={step}
            display={String(step)}
            min={0.05}
            max={2}
            step={0.05}
            hint="The middle number in 0:step:10. Push it up and the curve turns into a zigzag."
            onChange={setStep}
          />
          <Slider
            label="Last x"
            value={xmax}
            display={String(xmax)}
            min={2}
            max={20}
            step={1}
            hint="Where the list stops."
            onChange={setXmax}
          />
          <ReadOutGrid
            items={[
              { label: 'numel(x)', value: String(xs.length) },
              { label: 'grip at x', value: mx.toFixed(2) },
              { label: 'y there', value: my.toFixed(3) },
              { label: 'gap', value: step.toFixed(2) },
            ]}
          />
          <PanelNote>
            {step > 0.9
              ? 'The coloured line has clearly left the grey one. Octave is joining your points with straight lines, and there are not enough of them.'
              : 'Close enough that the two lines sit on top of each other. That is all a smooth plot ever is — enough points that you cannot see the corners.'}
          </PanelNote>
        </div>
      </div>

      <pre className="overflow-x-auto rounded-lg bg-zinc-950 px-4 py-3 font-mono text-[12.5px]/[1.7] text-zinc-100">
        {`x = 0:${step}:${xmax};      % a list of ${xs.length} numbers
y = ${spec.code};
plot(x, y)`}
      </pre>

      <LabNote>
        The <strong>colon</strong> builds a list: start, step, stop. Everything after that works on the whole list at
        once — you never write a loop. That habit is why Octave and MATLAB feel different from other languages.
      </LabNote>
    </LabBox>
  )
}

/* ========================================================================== */
/* Part 16 — the console                                                      */
/* ========================================================================== */

interface Entry {
  input: string
  ok: boolean
  text: string
}

const SUGGESTIONS = [
  'A = [1 2 3; 4 5 6; 7 8 10]',
  'size(A)',
  "A'",
  'det(A)',
  'rank(A)',
  'inv(A)',
  'A * inv(A)',
  'rref(A)',
  'eye(3)',
  'zeros(2,3)',
  'issymmetric(A)',
  'B = [2 0 0; 0 3 0; 0 0 4]',
  'A * B',
  'B * A',
  'det(A*B)',
]

const START: Env = {
  A: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10],
  ].map((r) => r.map((v) => ({ n: v, d: 1 }))),
}

/**
 * A real interpreter, not a screenshot. Everything the lecture types on slides
 * 15 and 40 runs here, and it works on whatever matrix the reader defines.
 */
export function OctaveConsole() {
  const [env, setEnv] = useState<Env>(START)
  const [line, setLine] = useState('det(A)')
  const [log, setLog] = useState<Entry[]>([
    { input: 'A = [1 2 3; 4 5 6; 7 8 10]', ok: true, text: display('A', START.A) },
  ])

  function submit(text: string) {
    const out = run(text, env)
    if (isError(out)) {
      setLog((l) => [...l, { input: text, ok: false, text: `error: ${out.error}` }])
      return
    }
    setEnv(out.env)
    setLog((l) => [...l, { input: text, ok: true, text: out.quiet ? '' : display(out.name, out.value) }])
  }

  const names = Object.keys(env).sort()

  return (
    <LabBox>
      <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto rounded-lg bg-zinc-950 px-4 py-3 font-mono text-[12.5px]/[1.6]">
        {log.map((e, i) => (
          <div key={i}>
            <div className="text-zinc-400">
              <span style={{ color: accentColour() }}>
                {'>'}
                {'>'}{' '}
              </span>
              {e.input}
            </div>
            {e.text && (
              <pre className="whitespace-pre" style={{ color: e.ok ? '#e4e4e7' : '#fca5a5' }}>
                {e.text}
              </pre>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          submit(line)
        }}
        className="flex gap-2"
      >
        <input
          value={line}
          onChange={(ev) => setLine(ev.target.value)}
          aria-label="Octave command"
          spellCheck={false}
          className="flex-1 rounded-lg border border-zinc-950/15 px-3 py-2 font-mono text-[13px] outline-none focus:border-zinc-950/40"
        />
        <Btn primary onClick={() => submit(line)}>
          Run
        </Btn>
      </form>

      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          Or press one of these
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setLine(s)
                submit(s)
              }}
              className="cursor-pointer rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 font-mono text-[12px] text-zinc-700 hover:border-zinc-950/25 hover:bg-zinc-950/[0.03]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {names.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
            What is in memory
          </div>
          <div className="flex flex-wrap items-start gap-4">
            {names.map((n) => (
              <div key={n}>
                <div className="mb-1 font-mono text-[12px] font-semibold text-zinc-950">{n}</div>
                <FrBox m={env[n]} width={46} />
              </div>
            ))}
          </div>
        </div>
      )}

      <LabNote>
        It keeps exact fractions, so <span className="font-mono">inv(A)</span> comes back as things like 2/3 rather than
        0.6667. Real Octave shows decimals; the fractions here are so you can check the arithmetic by hand.
      </LabNote>
    </LabBox>
  )
}
