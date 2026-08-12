'use client'

import { ChartCanvas } from '@/components/charts/chart-canvas'
import { Btn, Chip, LabBox, LabNote, Presets, Verdict } from '@/components/charts/matrix-ui'
import { lensArea } from '@/components/charts/prob-venn-lab'
import {
  ChartRow,
  PanelButton,
  PanelButtons,
  PanelNote,
  ReadOut,
  ReadOutGrid,
  Slider,
} from '@/components/sessions/session-parts'
import { accentColour, clamp, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'

const TEAL = '#0d9488'
const RED = '#dc2626'
const GREY = '#a1a1aa'

/** A flat frame for the labs that draw a picture rather than a plot. */
function boxFrame(pad: number, w: number, h: number): Frame {
  return {
    L: pad,
    R: pad + w,
    T: pad,
    B: pad + h,
    px: (v) => pad + v * w,
    py: (v) => pad + v * h,
    ux: (p) => (p - pad) / w,
    uy: (p) => (p - pad) / h,
  }
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

/* ========================================================================== */
/* 1 · The prior stays put while the posterior moves                          */
/* ========================================================================== */

/**
 * The board opens with P(Rain) = 0.3 and the claim that P(Rain | cloudy sky)
 * is bigger. It never says by how much, so neither does this: the hundred days
 * are the reader's to arrange, and the only number nailed down is the 30 that
 * rain — exactly what the lecture gives.
 *
 * What the lab is for is the shape of the thing. The prior is a property of
 * the whole year and does not budge; the posterior is a property of the slice
 * you are standing in, and it swings from 0 to 1 as you move the rain about.
 */
export function ReviseLab() {
  // Of 100 days, 30 rain — that is the lecture's P(Rain) = 0.3.
  const RAIN = 30
  const DAYS = 100
  const [cloudy, setCloudy] = useState(40)
  const [rainyCloudy, setRainyCloudy] = useState(24)

  // A rainy cloudy day cannot outnumber the cloudy days, nor the rainy ones,
  // and the dry-sky days have to fit in what is left.
  const rc = Math.max(Math.max(0, RAIN - (DAYS - cloudy)), Math.min(rainyCloudy, Math.min(cloudy, RAIN)))
  const rainyClear = RAIN - rc
  const clear = DAYS - cloudy

  const prior = RAIN / DAYS
  const postCloudy = cloudy > 0 ? rc / cloudy : null
  const postClear = clear > 0 ? rainyClear / clear : null

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const pad = 26
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cols = 10
    const cell = Math.min(boxW / cols, boxH / 10)
    const gap = 3
    const x0 = pad + (boxW - cell * cols) / 2
    const y0 = pad + (boxH - cell * 10) / 2

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    for (let i = 0; i < DAYS; i++) {
      // Cloudy days first, and inside each block the rainy ones first, so the
      // grid reads as two panels rather than as confetti.
      const isCloudy = i < cloudy
      const withinBlock = isCloudy ? i : i - cloudy
      const isRain = isCloudy ? withinBlock < rc : withinBlock < rainyClear
      const cx = x0 + (i % cols) * cell
      const cy = y0 + Math.floor(i / cols) * cell
      g.fillStyle = isRain ? (isCloudy ? TEAL : 'rgba(13,148,136,0.35)') : isCloudy ? '#71717a' : '#e4e4e7'
      g.fillRect(cx + gap / 2, cy + gap / 2, cell - gap, cell - gap)
    }

    // A rule between the cloudy block and the clear one, wherever it falls.
    const splitRow = Math.floor(cloudy / cols)
    const splitCol = cloudy % cols
    g.strokeStyle = '#09090b'
    g.lineWidth = 2
    g.beginPath()
    const sy = y0 + splitRow * cell
    g.moveTo(x0 + splitCol * cell, sy)
    g.lineTo(x0 + cols * cell, sy)
    if (splitCol > 0) {
      g.moveTo(x0 + splitCol * cell, sy)
      g.lineTo(x0 + splitCol * cell, sy + cell)
      g.moveTo(x0, sy + cell)
      g.lineTo(x0 + splitCol * cell, sy + cell)
    }
    g.stroke()

    g.textAlign = 'left'
    g.fillStyle = '#52525b'
    g.fillText(`${cloudy} cloudy days above the line`, x0, y0 - 9)
    g.fillText(`${clear} clear days below it`, x0, y0 + cols * cell + 17)
    return boxFrame(pad, boxW, boxH)
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={360}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ cloudy, rc }}
          caption="One hundred days. Dark teal is rain with a cloudy sky, pale teal is rain out of a clear one, grey is a dry day. Thirty of them rain however you arrange the sliders."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(Rain) — the prior"
            value={pct(prior)}
            tone={GREY}
            note="Thirty days in a hundred. This is the lecture's 0.3, and nothing you drag can move it."
          />
          <ReadOut
            label="P(Rain | cloudy sky) — the posterior"
            value={postCloudy === null ? 'No cloudy days' : pct(postCloudy)}
            tone={postCloudy !== null && postCloudy > prior ? TEAL : '#09090b'}
            note={
              postCloudy === null
                ? 'With no cloudy days there is nothing to condition on, so this has no value at all.'
                : 'Only the days above the line count now. The rest of the year has been thrown away.'
            }
          />
          <Slider
            label="Cloudy days"
            value={cloudy}
            display={`${cloudy} of 100`}
            min={5}
            max={95}
            step={1}
            hint="How much of the year has a cloudy sky. This is the size of the slice you condition on."
            onChange={setCloudy}
          />
          <Slider
            label="Rainy days that were cloudy"
            value={rc}
            display={`${rc} of 30`}
            min={0}
            max={30}
            step={1}
            hint="Where the thirty rainy days sit. Push them all above the line and the sky becomes a perfect forecast."
            onChange={setRainyCloudy}
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Counted straight off the grid
            </div>
            <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`P(Rain)            = 30/100  = ${prior.toFixed(2)}
P(Rain | cloudy)   = ${String(rc).padStart(2)}/${String(cloudy).padStart(3)}  = ${postCloudy === null ? '  —  ' : postCloudy.toFixed(2)}
P(Rain | clear)    = ${String(rainyClear).padStart(2)}/${String(clear).padStart(3)}  = ${postClear === null ? '  —  ' : postClear.toFixed(2)}`}
            </div>
          </div>
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setCloudy(40)
                setRainyCloudy(24)
              }}
            >
              Reset
            </PanelButton>
            <PanelButton
              onClick={() => {
                setCloudy(40)
                setRainyCloudy(12)
              }}
            >
              Make the sky useless
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            Press <strong>Make the sky useless</strong>. Now 12 of the 40 cloudy days rain and 18 of the 60 clear ones
            do too — both 30%, the same as the prior. Looking out of the window has told you nothing, and that is
            exactly what independence will mean two parts from now.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 2 · The definition, as an area                                             */
/* ========================================================================== */

/**
 * Slide 8 is two panels: P(A ∩ B) shaded, then the same lens over a filled B.
 * That is the whole definition as a picture — dividing by P(B) is what makes
 * the shaded circle count as the new 100%. Here the circles move, so the
 * reader can watch the ratio change without any number being typed in.
 */
export function CondVennLab() {
  const [pa, setPa] = useState(0.35)
  const [pb, setPb] = useState(0.3)
  const [ax, setAx] = useState(0.38)
  const [bx, setBx] = useState(0.6)
  const [given, setGiven] = useState<'b' | 'a'>('b')

  const rA = Math.sqrt(pa / Math.PI)
  const rB = Math.sqrt(pb / Math.PI)
  const both = lensArea(rA, rB, Math.abs(bx - ax))
  // Whichever circle you are standing in becomes the denominator.
  const givenP = given === 'b' ? pb : pa
  const targetP = given === 'b' ? pa : pb
  const cond = both / givenP
  const label = given === 'b' ? 'P(A | B)' : 'P(B | A)'
  const other = given === 'b' ? 'P(B | A)' : 'P(A | B)'
  const otherCond = both / targetP

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 24
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const scale = Math.sqrt(boxW * boxH)
    const cy = pad + boxH / 2

    g.fillStyle = 'rgba(9,9,11,0.035)'
    g.fillRect(pad, pad, boxW, boxH)
    g.strokeStyle = 'rgba(9,9,11,0.22)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)
    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    g.fillStyle = '#a1a1aa'
    g.textAlign = 'left'
    g.fillText('S — everything that could happen', pad + 8, pad + 15)

    const cxA = pad + ax * boxW
    const cxB = pad + bx * boxW
    const RA = rA * scale
    const RB = rB * scale
    const cxGiven = given === 'b' ? cxB : cxA
    const rGiven = given === 'b' ? RB : RA

    // The conditioning circle is the new ground, so it is filled solid and
    // everything outside it is dimmed away.
    g.save()
    g.beginPath()
    g.rect(pad, pad, boxW, boxH)
    g.arc(cxGiven, cy, rGiven, 0, Math.PI * 2, true)
    g.fillStyle = 'rgba(255,255,255,0.62)'
    g.fill('evenodd')
    g.restore()

    g.beginPath()
    g.arc(cxGiven, cy, rGiven, 0, Math.PI * 2)
    g.fillStyle = 'rgba(9,9,11,0.10)'
    g.fill()

    // The lens itself: A ∩ B, clipped to whichever circle is not the ground.
    g.save()
    g.beginPath()
    g.arc(cxA, cy, RA, 0, Math.PI * 2)
    g.clip()
    g.beginPath()
    g.arc(cxB, cy, RB, 0, Math.PI * 2)
    g.fillStyle = acc
    g.globalAlpha = 0.55
    g.fill()
    g.restore()
    g.globalAlpha = 1

    for (const [cx, r, colour, name] of [
      [cxA, RA, RED, 'A'],
      [cxB, RB, TEAL, 'B'],
    ] as Array<[number, number, string, string]>) {
      g.beginPath()
      g.arc(cx, cy, r, 0, Math.PI * 2)
      g.strokeStyle = colour
      g.lineWidth = 2
      g.stroke()
      g.fillStyle = colour
      g.textAlign = 'center'
      g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
      g.fillText(name, cx, cy - r - 8)
    }

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    g.fillStyle = '#3f3f46'
    g.textAlign = 'center'
    g.fillText(
      given === 'b' ? 'B is the new sample space' : 'A is the new sample space',
      pad + boxW / 2,
      pad + boxH - 10
    )
    const fr = boxFrame(pad, boxW, boxH)
    return { ...fr, py: () => cy, uy: () => 0 }
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={340}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pa, pb, ax, bx }}
          jumpKey={given}
          handles={(f: Frame) => [
            { id: 'a', px: f.px(ax), py: (f.T + f.B) / 2, label: 'circle A, drag sideways' },
            { id: 'b', px: f.px(bx), py: (f.T + f.B) / 2, label: 'circle B, drag sideways' },
          ]}
          onDragTo={(id, x) => {
            const v = clamp(x, 0.08, 0.92)
            if (id === 'a') setAx(Math.min(v, bx))
            else setBx(Math.max(v, ax))
          }}
          caption="Drag either circle. The white wash is the part of S that the news has ruled out — it no longer counts towards anything."
        />
      }
      panel={
        <>
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              What you were told
            </div>
            <div className="flex gap-2">
              <Chip on={given === 'b'} label="B happened" onClick={() => setGiven('b')} />
              <Chip on={given === 'a'} label="A happened" onClick={() => setGiven('a')} />
            </div>
          </div>
          <ReadOut
            label={label}
            value={givenP < 1e-6 ? '—' : pct(cond)}
            note="The lens, measured against the shaded circle instead of against the whole box."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The definition, live
            </div>
            <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`P(A ∩ B) = ${pct(both).padStart(6)}
P(${given === 'b' ? 'B' : 'A'})      = ${pct(givenP).padStart(6)}   ← the new whole
──────────────────────
${label} = ${pct(both).replace('%', '')} / ${pct(givenP).replace('%', '')}
         = ${givenP < 1e-6 ? '—' : pct(cond)}`}
            </div>
          </div>
          <ReadOutGrid
            items={[
              { label: label, value: givenP < 1e-6 ? '—' : pct(cond) },
              { label: other, value: targetP < 1e-6 ? '—' : pct(otherCond) },
            ]}
          />
          <Slider
            label="P(A)"
            value={pa}
            display={pct(pa)}
            min={0.05}
            max={0.55}
            step={0.01}
            hint="Bigger probability, bigger circle — area is probability here."
            onChange={setPa}
          />
          <Slider
            label="P(B)"
            value={pb}
            display={pct(pb)}
            min={0.05}
            max={0.55}
            step={0.01}
            hint="Shrink B and the same lens becomes a bigger share of it."
            onChange={setPb}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setPa(0.35)
                setPb(0.3)
                setAx(0.38)
                setBx(0.6)
                setGiven('b')
              }}
            >
              Reset
            </PanelButton>
            <PanelButton
              onClick={() => {
                setAx(0.42)
                setBx(0.48)
              }}
            >
              Push them together
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            The two read-outs above are almost never equal, and swapping them is the single most expensive slip in this
            topic. Both sit over the same lens; they differ because they are divided by different circles. That is why
            the lecture insists you read P(B/A) as “B given A” and never as “B by A”.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 3 · The multiplication rule, walked down a tree                            */
/* ========================================================================== */

/**
 * Board pages 3 and 4 derive P(A ∩ B ∩ C) = P(A) P(B|A) P(C|A∩B) by treating
 * A ∩ B as a single event and applying the definition twice. The lab does not
 * re-derive it — it walks it, one stage at a time, so the reader can see the
 * running product shrink and can watch which event each stage is conditioned
 * on. Stages arrive on a press, so the running total is never a number that
 * simply appeared.
 */
export function ChainLab() {
  const [pA, setPA] = useState(0.5)
  const [pBA, setPBA] = useState(0.4)
  const [pCAB, setPCAB] = useState(0.6)
  const [stage, setStage] = useState(1)

  const stages = [
    { label: 'A', p: pA, given: 'nothing yet', expr: 'P(A)' },
    { label: 'B', p: pBA, given: 'A has happened', expr: 'P(B | A)' },
    { label: 'C', p: pCAB, given: 'A and B have both happened', expr: 'P(C | A ∩ B)' },
  ]
  const running = stages.slice(0, stage).reduce((acc, s) => acc * s.p, 1)

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 30
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const cy = pad + boxH / 2
    const step = boxW / 3.4
    const boxSide = Math.min(64, step * 0.5)

    g.font = '12px ui-sans-serif, system-ui, sans-serif'
    let x = pad + 6
    let acc2 = 1
    for (let i = 0; i < 3; i++) {
      const on = i < stage
      acc2 = on ? acc2 * stages[i].p : acc2

      // The arrow into this stage carries the conditional probability.
      g.strokeStyle = on ? acc : 'rgba(9,9,11,0.15)'
      g.lineWidth = on ? 2.5 : 1.5
      g.beginPath()
      g.moveTo(x, cy)
      g.lineTo(x + step - boxSide, cy)
      g.stroke()
      g.beginPath()
      g.moveTo(x + step - boxSide, cy)
      g.lineTo(x + step - boxSide - 8, cy - 5)
      g.lineTo(x + step - boxSide - 8, cy + 5)
      g.fillStyle = on ? acc : 'rgba(9,9,11,0.15)'
      g.fill()

      g.textAlign = 'center'
      g.fillStyle = on ? '#09090b' : '#a1a1aa'
      g.font = '600 12.5px ui-monospace, monospace'
      g.fillText(stages[i].p.toFixed(2), x + (step - boxSide) / 2, cy - 14)
      g.font = '11px ui-sans-serif, system-ui, sans-serif'
      g.fillStyle = on ? '#52525b' : '#d4d4d8'
      g.fillText(stages[i].expr, x + (step - boxSide) / 2, cy + 22)

      // The box the arrow lands in.
      const bx = x + step - boxSide
      g.fillStyle = on ? acc : '#fff'
      g.strokeStyle = on ? acc : 'rgba(9,9,11,0.2)'
      g.lineWidth = 2
      g.beginPath()
      g.roundRect(bx, cy - boxSide / 2, boxSide, boxSide, 10)
      g.fill()
      g.stroke()
      g.fillStyle = on ? '#fff' : '#a1a1aa'
      g.font = '600 17px ui-sans-serif, system-ui, sans-serif'
      g.textAlign = 'center'
      g.fillText(stages[i].label, bx + boxSide / 2, cy + 6)

      if (on) {
        g.fillStyle = '#52525b'
        g.font = '11px ui-monospace, monospace'
        g.fillText(acc2.toFixed(4), bx + boxSide / 2, cy + boxSide / 2 + 18)
      }
      x = bx + boxSide
    }

    g.textAlign = 'left'
    g.fillStyle = '#a1a1aa'
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.fillText('the running product after each stage', pad + 6, pad + boxH - 4)
    return boxFrame(pad, boxW, boxH)
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={260}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pA, pBA, pCAB, stage }}
          jumpKey={stage}
          caption="Each arrow is one conditional probability, and each one is conditioned on everything to its left having already happened."
        />
      }
      panel={
        <>
          <ReadOut
            label={stage === 3 ? 'P(A ∩ B ∩ C)' : stage === 2 ? 'P(A ∩ B)' : 'P(A)'}
            value={running.toFixed(4)}
            note="Multiply along the path. Nothing else is going on here."
          />
          <PanelButtons>
            <PanelButton primary onClick={() => setStage((s) => Math.min(3, s + 1))}>
              {stage < 3 ? 'Add the next stage' : 'All three shown'}
            </PanelButton>
            <PanelButton onClick={() => setStage(1)}>Back to one</PanelButton>
          </PanelButtons>
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Conditioned on
            </div>
            <div className="text-[12.5px]/[1.7] text-zinc-700">
              Stage {stage} is <strong>{stages[stage - 1].expr}</strong> — its probability is worked out in a world
              where {stages[stage - 1].given}.
            </div>
          </div>
          <Slider
            label="P(A)"
            value={pA}
            display={pA.toFixed(2)}
            min={0.05}
            max={1}
            step={0.01}
            hint="The first stage has nothing behind it, so it is an ordinary probability."
            onChange={setPA}
          />
          <Slider
            label="P(B | A)"
            value={pBA}
            display={pBA.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            hint="Not P(B). This is B measured inside the world where A already happened."
            onChange={setPBA}
          />
          <Slider
            label="P(C | A ∩ B)"
            value={pCAB}
            display={pCAB.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            hint="Both earlier events are assumed, which is the step people forget."
            onChange={setPCAB}
          />
          <PanelNote>
            Every factor is at most 1, so the running product can only ever fall. Asking for three things at once is
            never easier than asking for one — and if any stage is impossible, the whole path collapses to zero.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 5 · One event inside another                                               */
/* ========================================================================== */

/**
 * Example 2 turns on a set fact rather than on arithmetic: every compact disc
 * player is an audio component, so B ⊆ A and A ∩ B is just B. Both conditionals
 * then have answers you can predict before dividing anything, which is the
 * point worth carrying into an exam.
 */
export function SubsetLab() {
  const [pa, setPa] = useState(0.6)
  const [pb, setPb] = useState(0.05)

  // The lecture's case: B lives entirely inside A, so the overlap is all of B.
  const inner = Math.min(pb, pa)
  const bGivenA = inner / pa
  const aGivenB = 1

  const draw = (g: CanvasRenderingContext2D, W: number, H: number) => {
    const acc = accentColour()
    const pad = 24
    const boxW = W - pad * 2
    const boxH = H - pad * 2
    const scale = Math.sqrt(boxW * boxH)
    const cy = pad + boxH / 2
    const cx = pad + boxW / 2

    g.fillStyle = 'rgba(9,9,11,0.035)'
    g.fillRect(pad, pad, boxW, boxH)
    g.strokeStyle = 'rgba(9,9,11,0.22)'
    g.lineWidth = 1.5
    g.strokeRect(pad, pad, boxW, boxH)

    const RA = Math.sqrt(pa / Math.PI) * scale
    const RB = Math.sqrt(inner / Math.PI) * scale

    g.beginPath()
    g.arc(cx, cy, RA, 0, Math.PI * 2)
    g.fillStyle = 'rgba(9,9,11,0.10)'
    g.fill()
    g.strokeStyle = RED
    g.lineWidth = 2
    g.stroke()

    // B is drawn inside A and tucked towards the bottom so both labels fit.
    const byOff = Math.max(0, RA - RB - 6)
    g.beginPath()
    g.arc(cx, cy + byOff * 0.45, RB, 0, Math.PI * 2)
    g.fillStyle = acc
    g.globalAlpha = 0.6
    g.fill()
    g.globalAlpha = 1
    g.strokeStyle = TEAL
    g.lineWidth = 2
    g.stroke()

    g.font = '600 13px ui-sans-serif, system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillStyle = RED
    g.fillText('A — audio component', cx, cy - RA - 9)
    g.fillStyle = TEAL
    g.fillText('B — CD player', cx, cy + byOff * 0.45 + RB + 17)
    g.font = '11.5px ui-sans-serif, system-ui, sans-serif'
    g.fillStyle = '#71717a'
    g.textAlign = 'left'
    g.fillText('A ∩ B is the whole of B, because B never sticks out of A', pad + 8, pad + boxH - 8)
    return boxFrame(pad, boxW, boxH)
  }

  return (
    <ChartRow
      chart={
        <ChartCanvas
          height={330}
          draw={draw}
          candidates={() => []}
          tooltip={() => null}
          targets={{ pa, inner }}
          caption="B never leaves A, whatever you do to the sliders — that is what “the event B is contained in A” means."
        />
      }
      panel={
        <>
          <ReadOut
            label="P(B | A)"
            value={bGivenA.toFixed(4)}
            note="Because A ∩ B = B, this is just P(B) divided by P(A)."
          />
          <ReadOut
            label="P(A | B)"
            value={aGivenB.toFixed(4)}
            tone={TEAL}
            note="Always exactly 1. If it is a CD player then it is certainly an audio component — no arithmetic needed."
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              The slides’ own numbers
            </div>
            <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`P(A) = ${pa.toFixed(2)}      P(B) = ${inner.toFixed(2)}

P(B/A) = P(A ∩ B) / P(A)
       = P(B) / P(A)        ← because B ⊆ A
       = ${inner.toFixed(2)} / ${pa.toFixed(2)}
       = ${bGivenA.toFixed(4)}`}
            </div>
          </div>
          <Slider
            label="P(A)"
            value={pa}
            display={pa.toFixed(2)}
            min={0.1}
            max={1}
            step={0.01}
            hint="The bigger circle. Shrink it towards P(B) and P(B|A) climbs to 1."
            onChange={(v) => {
              setPa(v)
              if (pb > v) setPb(v)
            }}
          />
          <Slider
            label="P(B)"
            value={inner}
            display={inner.toFixed(2)}
            min={0}
            max={1}
            step={0.01}
            hint="The inner circle. It is capped at P(A), because it cannot escape."
            onChange={(v) => setPb(Math.min(v, pa))}
          />
          <PanelButtons>
            <PanelButton
              primary
              onClick={() => {
                setPa(0.6)
                setPb(0.05)
              }}
            >
              The slides: 0.6 and 0.05
            </PanelButton>
          </PanelButtons>
          <PanelNote>
            With the slides’ numbers this reads 0.0833, which is the answer printed on slide 13. Notice it is bigger
            than P(B) = 0.05: being told the item is audio has ruled out every video repair, so the CD players make up a
            larger share of what is left.
          </PanelNote>
        </>
      }
    />
  )
}

/* ========================================================================== */
/* 7 · The two definitions of independence are one definition                 */
/* ========================================================================== */

/**
 * Board page 8 proves the equivalence in both directions in about six lines.
 * The lab is the same statement as an experiment: there is exactly one setting
 * of the overlap where both tests pass, and they pass together. Two verdicts
 * that always agree is a stronger memory than either algebraic direction.
 */
export function IndependenceEquivLab() {
  const [pa, setPa] = useState(0.5)
  const [pb, setPb] = useState(0.4)
  const [both, setBoth] = useState(0.2)

  // Nothing here is stored — every read-out below is recomputed from these
  // three numbers, so nothing can go stale when a slider moves.
  const maxBoth = Math.min(pa, pb)
  const minBoth = Math.max(0, pa + pb - 1)
  const overlap = clamp(both, minBoth, maxBoth)
  const product = pa * pb
  const aGivenB = pb > 0 ? overlap / pb : null
  const bGivenA = pa > 0 ? overlap / pa : null

  const TOL = 0.005
  const productTest = Math.abs(overlap - product) < TOL
  const condTest = aGivenB !== null && Math.abs(aGivenB - pa) < TOL
  const exclusive = overlap < 1e-6

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3.5">
          <Slider
            label="P(A)"
            value={pa}
            display={pa.toFixed(2)}
            min={0.05}
            max={0.95}
            step={0.01}
            hint="How likely A is on its own."
            onChange={setPa}
          />
          <Slider
            label="P(B)"
            value={pb}
            display={pb.toFixed(2)}
            min={0.05}
            max={0.95}
            step={0.01}
            hint="How likely B is on its own."
            onChange={setPb}
          />
          <Slider
            label="P(A ∩ B)"
            value={overlap}
            display={overlap.toFixed(3)}
            min={0}
            max={1}
            step={0.005}
            hint="The overlap. This is the only thing that decides whether the two events are independent."
            onChange={setBoth}
          />
          <Btn primary onClick={() => setBoth(Math.round(pa * pb * 200) / 200)}>
            Set the overlap to P(A)·P(B)
          </Btn>
          <LabNote>
            The overlap is held between {minBoth.toFixed(2)} and {maxBoth.toFixed(2)}: it can never be more than the
            smaller event, and when P(A) + P(B) passes 1 the circles are forced to meet.
          </LabNote>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Test 1 — the product form
            </div>
            <div className="font-mono text-[12.5px]/[1.85] whitespace-pre text-zinc-800">
              {`P(A ∩ B)   = ${overlap.toFixed(3)}
P(A)·P(B)  = ${product.toFixed(3)}`}
            </div>
          </div>
          <Verdict ok={productTest}>
            {productTest ? 'P(A ∩ B) = P(A)·P(B) — independent.' : 'The two sides differ, so A and B are dependent.'}
          </Verdict>

          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Test 2 — the “tells you nothing” form
            </div>
            <div className="font-mono text-[12.5px]/[1.85] whitespace-pre text-zinc-800">
              {`P(A | B)   = ${aGivenB === null ? '  —  ' : aGivenB.toFixed(3)}
P(A)       = ${pa.toFixed(3)}
P(B | A)   = ${bGivenA === null ? '  —  ' : bGivenA.toFixed(3)}
P(B)       = ${pb.toFixed(3)}`}
            </div>
          </div>
          <Verdict ok={condTest}>
            {condTest
              ? 'P(A | B) = P(A) — being told B changes nothing.'
              : 'P(A | B) is not P(A), so B carries information about A.'}
          </Verdict>

          <LabNote>
            {exclusive ? (
              <>
                The overlap is zero, so these are <strong>mutually exclusive</strong> — and both tests fail. Exclusive
                events are as dependent as events get: learning A happened tells you B certainly did not.
              </>
            ) : productTest ? (
              <>
                Both verdicts turned green on the same setting, and they always will. That is what board page 8 proves:
                divide the product form by P(B) and you get the conditional form back.
              </>
            ) : (
              <>
                Both verdicts are red together. Move the overlap towards {product.toFixed(3)} and watch them flip at the
                same moment — there is no setting where one holds and the other does not.
              </>
            )}
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}

/* ========================================================================== */
/* 8 · Two bags, one card from each                                           */
/* ========================================================================== */

/**
 * The bags are copied from slide 18 exactly. The counting is done from those
 * letters rather than from the numbers on the solution slide, which is what
 * makes part (c) of the deck visible as a disagreement rather than something
 * the page has to take a view on: the slide writes 2/5 for bag 1, and the bag
 * it draws holds three vowels.
 */
const BAG1 = ['I', 'L', 'J', 'A', 'U']
const BAG2 = ['L', 'R', 'H', 'E', 'C', 'A']
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

type Want = { id: string; label: string; test: (c: string) => boolean }
const WANTS: Want[] = [
  { id: 'J', label: 'the letter J', test: (c) => c === 'J' },
  { id: 'R', label: 'the letter R', test: (c) => c === 'R' },
  { id: 'L', label: 'the letter L', test: (c) => c === 'L' },
  { id: 'A', label: 'the letter A', test: (c) => c === 'A' },
  { id: 'vowel', label: 'any vowel', test: (c) => VOWELS.has(c) },
  { id: 'any', label: 'anything at all', test: () => true },
]

/** One bag of cards, with everything that matches the current choice lit up. */
function Bag({ cards, want, name }: { cards: string[]; want: Want; name: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[11.5px] font-semibold text-zinc-600">{name}</div>
      <div className="flex flex-wrap gap-1.5">
        {cards.map((c, i) => {
          const on = want.test(c)
          return (
            <span
              key={`${c}-${i}`}
              className="grid size-9 place-items-center rounded-md border-2 font-mono text-[15px] font-semibold"
              style={
                on
                  ? { borderColor: 'var(--acc)', background: 'var(--acc-12)', color: 'var(--acc)' }
                  : { borderColor: 'rgba(9,9,11,0.15)', background: '#fff', color: '#a1a1aa' }
              }
            >
              {c}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function BagsLab() {
  const [want1, setWant1] = useState('J')
  const [want2, setWant2] = useState('R')

  const w1 = WANTS.find((w) => w.id === want1) ?? WANTS[0]
  const w2 = WANTS.find((w) => w.id === want2) ?? WANTS[1]
  const hit1 = BAG1.filter(w1.test)
  const hit2 = BAG2.filter(w2.test)
  const p1n = hit1.length
  const p2n = hit2.length
  // Kept as whole numbers to the last moment: 1/30 should read as 1/30, not
  // as 0.0333 with a beginner wondering where the rounding went.
  const num = p1n * p2n
  const den = BAG1.length * BAG2.length
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const g = num === 0 ? 1 : gcd(num, den)

  return (
    <LabBox>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <Bag cards={BAG1} want={w1} name="Bag 1 — five cards" />
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              From bag 1 I want
            </div>
            <Presets items={WANTS.map((w) => ({ id: w.id, label: w.label }))} at={want1} onPick={setWant1} />
          </div>
          <Bag cards={BAG2} want={w2} name="Bag 2 — six cards" />
          <div>
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              From bag 2 I want
            </div>
            <Presets items={WANTS.map((w) => ({ id: w.id, label: w.label }))} at={want2} onPick={setWant2} />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 p-4">
          <ReadOut
            label="Both at once"
            value={num === 0 ? '0' : `${num / g}/${den / g}`}
            note={
              num === 0 ? 'No card in one of the bags qualifies, so it cannot happen.' : `= ${(num / den).toFixed(4)}`
            }
          />
          <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
            <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
              Counted off the cards
            </div>
            <div className="font-mono text-[12.5px]/[1.9] whitespace-pre text-zinc-800">
              {`bag 1: ${p1n} of ${BAG1.length} qualify  → ${p1n}/${BAG1.length}
bag 2: ${p2n} of ${BAG2.length} qualify  → ${p2n}/${BAG2.length}
──────────────────────────
multiply       ${p1n}/${BAG1.length} × ${p2n}/${BAG2.length} = ${num}/${den}`}
            </div>
          </div>
          <LabNote>
            The two draws are from different bags, so neither can affect the other. That independence is the only reason
            the two fractions may simply be multiplied.
          </LabNote>
        </div>
      </div>
    </LabBox>
  )
}
