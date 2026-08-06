'use client'

import { ChartCanvas, type HitTarget } from '@/components/charts/chart-canvas'
import { accentColour, arrow, clamp, dot, drawPlane, grip, halo, type Frame } from '@/lib/chart/frame'
import { useState } from 'react'
import { UsedInAiml } from './algebra'
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

const SPAN = 3

/** The transforms worth seeing, each making one point. */
const PRESETS: Array<{ id: string; label: string; m: [number, number, number, number]; note: string }> = [
  {
    id: 'identity',
    label: 'Do nothing',
    m: [1, 0, 0, 1],
    note: 'The identity. Every arrow stays exactly where it was.',
  },
  {
    id: 'rotate',
    label: 'Rotate 90°',
    m: [0, -1, 1, 0],
    note: 'A quarter turn. Lengths and angles survive; only direction changes.',
  },
  {
    id: 'scale',
    label: 'Stretch ×2',
    m: [2, 0, 0, 2],
    note: 'Everything twice as far out. Areas go up four-fold — that is the determinant.',
  },
  {
    id: 'shear',
    label: 'Shear',
    m: [1, 1, 0, 1],
    note: 'Push the top sideways, like a deck of cards. Area is unchanged.',
  },
  {
    id: 'squash',
    label: 'Squash flat',
    m: [1, 2, 0.5, 1],
    note: 'Determinant zero: the whole plane collapses onto one line. Information is gone for good.',
  },
]

export function LinearAlgebraSession() {
  // Column-major in maths, but written here as the grid you read on screen:
  // [a b] over [c d].
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [c, setC] = useState(0)
  const [d, setD] = useState(1)
  const [vx, setVx] = useState(1.5)
  const [vy, setVy] = useState(1)
  const [jump, setJump] = useState(0)
  const [note, setNote] = useState<string | null>(null)

  const det = a * d - b * c
  const apply = (x: number, y: number): [number, number] => [a * x + b * y, c * x + d * y]
  const [tvx, tvy] = apply(vx, vy)
  // The basis vectors are where the matrix's columns literally land.
  const [ix, iy] = apply(1, 0)
  const [jx, jy] = apply(0, 1)

  const collapsed = Math.abs(det) < 0.02

  function setMatrix(m: [number, number, number, number], why: string | null = null) {
    setA(m[0])
    setB(m[1])
    setC(m[2])
    setD(m[3])
    setNote(why)
    // A preset is a jump to an unrelated layout, so snap rather than ease.
    setJump((v) => v + 1)
  }

  /**
   * The strongest interaction on the page: î and ĵ are literally the matrix's
   * two columns, so dragging them *is* editing the matrix. The sliders and the
   * arrows are two views of the same four numbers.
   */
  const snap = (v: number) => Math.round(clamp(v, -SPAN, SPAN) * 20) / 20

  function dragTo(id: string, x: number, y: number) {
    if (id === 'i') {
      setA(snap(x))
      setC(snap(y))
    } else if (id === 'j') {
      setB(snap(x))
      setD(snap(y))
    } else {
      setVx(Math.round(clamp(x, -3, 3) * 10) / 10)
      setVy(Math.round(clamp(y, -3, 3) * 10) / 10)
    }
    setNote(null)
  }

  const draw = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    { disp, hover }: { disp: Record<string, number>; hover: HitTarget | null }
  ) => {
    const fr = drawPlane(ctx, W, H, SPAN)
    const acc = accentColour()
    // Ease the matrix itself, so the grid bends smoothly rather than snapping.
    const ea = disp.a ?? a
    const eb = disp.b ?? b
    const ec = disp.c ?? c
    const ed = disp.d ?? d
    const at = (x: number, y: number): [number, number] => [ea * x + eb * y, ec * x + ed * y]

    ctx.save()
    ctx.beginPath()
    ctx.rect(fr.L, fr.T, fr.R - fr.L, fr.B - fr.T)
    ctx.clip()

    // The transformed grid: straight lines stay straight and evenly spaced.
    // That is the entire meaning of the word "linear".
    ctx.strokeStyle = acc + '33'
    ctx.lineWidth = 1
    for (let i = -SPAN * 2; i <= SPAN * 2; i++) {
      const [p1x, p1y] = at(i, -SPAN * 2)
      const [p2x, p2y] = at(i, SPAN * 2)
      const [q1x, q1y] = at(-SPAN * 2, i)
      const [q2x, q2y] = at(SPAN * 2, i)
      ctx.beginPath()
      ctx.moveTo(fr.px(p1x), fr.py(p1y))
      ctx.lineTo(fr.px(p2x), fr.py(p2y))
      ctx.moveTo(fr.px(q1x), fr.py(q1y))
      ctx.lineTo(fr.px(q2x), fr.py(q2y))
      ctx.stroke()
    }

    // The unit square, before and after. Its area after the move IS |det|.
    ctx.fillStyle = 'rgba(9,9,11,0.06)'
    ctx.fillRect(fr.px(0), fr.py(1), fr.px(1) - fr.px(0), fr.py(0) - fr.py(1))

    const [sqx, sqy] = at(1, 1)
    const [eix, eiy] = at(1, 0)
    const [ejx, ejy] = at(0, 1)
    ctx.beginPath()
    ctx.moveTo(fr.px(0), fr.py(0))
    ctx.lineTo(fr.px(eix), fr.py(eiy))
    ctx.lineTo(fr.px(sqx), fr.py(sqy))
    ctx.lineTo(fr.px(ejx), fr.py(ejy))
    ctx.closePath()
    ctx.fillStyle = acc + '22'
    ctx.fill()
    ctx.strokeStyle = acc + '66'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // The two basis arrows — the columns of the matrix, made visible.
    arrow(ctx, fr.px(0), fr.py(0), fr.px(eix), fr.py(eiy), acc, 3)
    arrow(ctx, fr.px(0), fr.py(0), fr.px(ejx), fr.py(ejy), '#0d9488', 3)

    // The data vector: where it was, and where the matrix sent it.
    const [evx, evy] = at(vx, vy)
    ctx.setLineDash([3, 3])
    arrow(ctx, fr.px(0), fr.py(0), fr.px(vx), fr.py(vy), 'rgba(9,9,11,0.4)', 2)
    ctx.setLineDash([])
    // Grips on the three things you can pick up: the two basis arrows and
    // your own vector.
    grip(ctx, fr.px(vx), fr.py(vy), '#71717a', 5)
    grip(ctx, fr.px(eix), fr.py(eiy), acc, 5)
    grip(ctx, fr.px(ejx), fr.py(ejy), '#0d9488', 5)
    arrow(ctx, fr.px(0), fr.py(0), fr.px(evx), fr.py(evy), '#d97706', 3)
    dot(ctx, fr.px(evx), fr.py(evy), 4, '#d97706')
    if (hover?.kind === 'v') halo(ctx, fr.px(evx), fr.py(evy), 4)
    if (hover?.kind === 'i') halo(ctx, fr.px(eix), fr.py(eiy), 4)
    if (hover?.kind === 'j') halo(ctx, fr.px(ejx), fr.py(ejy), 4)
    ctx.restore()

    // The grid runs under the legend, so give the text something to sit on.
    const key: Array<[string, string]> = [
      ['î — where (1,0) lands', acc],
      ['ĵ — where (0,1) lands', '#0d9488'],
      ['your vector, moved', '#d97706'],
    ]
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    ctx.fillRect(fr.L + 2, fr.T + 2, 152, key.length * 16 + 8)
    ctx.textAlign = 'left'
    key.forEach(([label, colour], i) => {
      ctx.fillStyle = colour
      ctx.fillText(label, fr.L + 8, fr.T + 14 + i * 16)
    })
    return fr
  }

  const candidates = (fr: Frame) => [
    { kind: 'v', i: 0, px: fr.px(tvx), py: fr.py(tvy) },
    { kind: 'i', i: 0, px: fr.px(ix), py: fr.py(iy) },
    { kind: 'j', i: 0, px: fr.px(jx), py: fr.py(jy) },
    { kind: 'origin', i: 0, px: fr.px(0), py: fr.py(0) },
  ]

  const tooltip = (hit: HitTarget) => {
    if (hit.kind === 'i') {
      return {
        title: 'î — the first column',
        rows: [
          ['started at', '(1, 0)'],
          ['landed at', `(${a.toFixed(2)}, ${c.toFixed(2)})`],
          ['which is', 'exactly the first column of the matrix'],
          ['read it as', 'a matrix says where the basis arrows go — everything else follows'],
        ] as Array<[string, string]>,
      }
    }
    if (hit.kind === 'j') {
      return {
        title: 'ĵ — the second column',
        rows: [
          ['started at', '(0, 1)'],
          ['landed at', `(${b.toFixed(2)}, ${d.toFixed(2)})`],
          ['which is', 'exactly the second column of the matrix'],
          ['read it as', 'two arrows fully describe the transform'],
        ] as Array<[string, string]>,
      }
    }
    if (hit.kind === 'origin') {
      return {
        title: 'The origin never moves',
        rows: [
          ['before', '(0, 0)'],
          ['after', '(0, 0)'],
          ['why', 'A·0 = 0 for every matrix'],
          ['consequence', 'a matrix alone cannot shift things — that is what the bias b is for'],
        ] as Array<[string, string]>,
      }
    }
    return {
      title: 'Your vector',
      rows: [
        ['before', `(${vx.toFixed(2)}, ${vy.toFixed(2)})`],
        ['after', `(${tvx.toFixed(2)}, ${tvy.toFixed(2)})`],
        [
          'the sum that did it',
          `${a.toFixed(2)}·${vx.toFixed(2)} + ${b.toFixed(2)}·${vy.toFixed(2)} = ${tvx.toFixed(2)}`,
        ],
        ['length', `${Math.hypot(vx, vy).toFixed(2)} → ${Math.hypot(tvx, tvy).toFixed(2)}`],
      ] as Array<[string, string]>,
    }
  }

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations"
        title="Linear algebra"
        intro="A vector is a list of numbers — and also an arrow. A matrix is a machine that grabs every arrow in the plane and moves them all at once. Four numbers below control the whole plane; drag them and watch space bend."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A spreadsheet row is a vector: <strong>[height, weight, age]</strong>{' '}is one person, three numbers, one row.
            You can add two rows, or double a row, and it means something sensible. That is all a vector is — a list you
            are allowed to do arithmetic on.
          </>,
          <>
            A matrix is the next step up: a whole <strong>table</strong>{' '}of numbers that acts as an instruction. Feed it
            a vector and it hands you back a different vector. The picture below shows what that instruction really does
            — not to one arrow, but to <strong>every point in the plane at once</strong>, which is why the grid itself
            bends.
          </>,
        ]}
        mappings={[
          {
            title: 'The columns are the answer',
            body: 'The first column is where the arrow (1,0) ends up; the second is where (0,1) ends up. Know those two and you know what happens to everything else.',
          },
          {
            title: 'Straight stays straight',
            body: 'Grid lines stay straight and evenly spaced no matter what you set. That restriction is what the word “linear” means — and what makes it fast enough to run billions of times.',
          },
          {
            title: 'Determinant = area change',
            body: 'The shaded square starts with area 1. After the move its area is the determinant. Hit zero and the plane has collapsed onto a line — squashed flat, unrecoverable.',
          },
        ]}
        footnote="Swap the plane for 768 dimensions and the arrows for word meanings, and this is exactly what happens inside a language model. The picture stops being drawable long before the maths stops working."
      />

      <ChartRow
        chart={
          <ChartCanvas
            draw={draw}
            candidates={candidates}
            tooltip={tooltip}
            targets={{ a, b, c, d, vx, vy }}
            jumpKey={jump}
            height={460}
            handles={(fr: Frame) => [
              { id: 'i', px: fr.px(ix), py: fr.py(iy) },
              { id: 'j', px: fr.px(jx), py: fr.py(jy) },
              { id: 'v', px: fr.px(vx), py: fr.py(vy), radius: 16, grab: 'anywhere' },
            ]}
            onDragTo={dragTo}
            caption="Drag î or ĵ to edit the matrix directly — they are its two columns. Drag the dashed arrow, or press anywhere, to move your vector."
          />
        }
        panel={
          <>
            <div className="rounded-lg border border-zinc-950/10 bg-white p-3.5">
              <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                The matrix A
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[15px] font-semibold text-zinc-950">
                <span className="rounded bg-zinc-950/[0.04] px-2 py-1 text-center">{a.toFixed(2)}</span>
                <span className="rounded bg-zinc-950/[0.04] px-2 py-1 text-center">{b.toFixed(2)}</span>
                <span className="rounded bg-zinc-950/[0.04] px-2 py-1 text-center">{c.toFixed(2)}</span>
                <span className="rounded bg-zinc-950/[0.04] px-2 py-1 text-center">{d.toFixed(2)}</span>
              </div>
            </div>

            <Slider
              label="a — top left"
              value={a}
              display={a.toFixed(2)}
              min={-3}
              max={3}
              step={0.05}
              hint="î's x"
              onChange={setA}
            />
            <Slider
              label="b — top right"
              value={b}
              display={b.toFixed(2)}
              min={-3}
              max={3}
              step={0.05}
              hint="ĵ's x"
              onChange={setB}
            />
            <Slider
              label="c — bottom left"
              value={c}
              display={c.toFixed(2)}
              min={-3}
              max={3}
              step={0.05}
              hint="î's y"
              onChange={setC}
            />
            <Slider
              label="d — bottom right"
              value={d}
              display={d.toFixed(2)}
              min={-3}
              max={3}
              step={0.05}
              hint="ĵ's y"
              onChange={setD}
            />

            <div
              className="rounded-lg border p-3.5"
              style={
                collapsed
                  ? { background: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.35)' }
                  : { background: '#fff', borderColor: 'rgba(9,9,11,0.1)' }
              }
            >
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
                Determinant — area after
              </div>
              <div
                className="text-[26px] font-semibold tracking-[-0.02em]"
                style={{ color: collapsed ? '#dc2626' : '#09090b' }}
              >
                {det.toFixed(3)}
              </div>
              <div className="text-xs/[1.5] text-zinc-600">
                {collapsed
                  ? 'Flattened onto a line. Nothing can undo this — the matrix has no inverse.'
                  : det < 0
                    ? 'Negative: space has been flipped over, like turning the page.'
                    : `The unit square is now ${Math.abs(det).toFixed(2)}× its old area.`}
              </div>
            </div>

            <ReadOutGrid
              items={[
                { label: 'your v', value: `${vx.toFixed(1)}, ${vy.toFixed(1)}` },
                { label: 'A·v', value: `${tvx.toFixed(1)}, ${tvy.toFixed(1)}` },
              ]}
            />
            <Slider
              label="v — x part"
              value={vx}
              display={vx.toFixed(1)}
              min={-3}
              max={3}
              step={0.1}
              hint="Move your arrow."
              onChange={setVx}
            />
            <Slider
              label="v — y part"
              value={vy}
              display={vy.toFixed(1)}
              min={-3}
              max={3}
              step={0.1}
              hint="Its height."
              onChange={setVy}
            />

            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">Try one</div>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setMatrix(p.m, p.note)}
                  className="cursor-pointer rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-left text-[12px] font-medium text-zinc-800 hover:border-zinc-950/30"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <PanelButtons>
              <PanelButton primary onClick={() => setMatrix([1, 0, 0, 1], PRESETS[0].note)}>
                Reset
              </PanelButton>
            </PanelButtons>

            <PanelNote>
              {note ??
                'Press “Squash flat” and watch the determinant hit zero. Two different inputs now land on the same output — which is exactly what it means for a model to lose information.'}
            </PanelNote>
          </>
        }
      />

      <Explainers
        plain="Everything a matrix can do is decided by where it sends two arrows: (1,0) and (0,1). Those are its columns. Any other arrow is just a mix of those two, so it goes wherever the mix goes."
        breaks="When the determinant is zero the plane has been flattened, and no matrix can unflatten it — two different inputs now sit on top of each other. In a model that is a layer that has thrown away part of what it was given."
      >
        <MathBlock
          intro="Three lines: what a matrix does to a vector, what the determinant measures, and the dot product that quietly powers search and recommendation."
          formulas={[
            {
              formula: 'A·v = [a·v₁ + b·v₂,  c·v₁ + d·v₂]',
              reading:
                '“Each output number is one row of the matrix, multiplied into the vector and totalled.” Row one gives the new x, row two the new y. That is matrix multiplication in full.',
            },
            {
              formula: 'det(A) = a·d − b·c',
              reading:
                '“How much the transform stretches area.” 1 means unchanged, 2 means doubled, 0 means flattened onto a line, negative means flipped over.',
            },
            {
              formula: 'u · v = u₁v₁ + u₂v₂ = ‖u‖‖v‖cos θ',
              reading:
                'The dot product: multiply matching entries and add. It is big when two vectors point the same way, zero when they are at right angles. This is how “similar” is measured.',
            },
          ]}
          legend={[
            {
              sym: 'v',
              name: 'A vector — a list, and an arrow',
              note: 'A row of numbers describing one thing. In ML, one row of your data, or one embedding.',
              val: `(${vx.toFixed(2)}, ${vy.toFixed(2)})`,
            },
            {
              sym: 'A',
              name: 'A matrix — a table that acts',
              note: 'Feed it a vector, get a vector back. Its job is to move every point in a consistent way.',
              val: `[${a.toFixed(1)} ${b.toFixed(1)}; ${c.toFixed(1)} ${d.toFixed(1)}]`,
            },
            {
              sym: 'î, ĵ',
              name: 'The basis — the two reference arrows',
              note: '(1,0) and (0,1). The hat means length one. Where these land is the matrix, written out.',
              val: `(${ix.toFixed(1)},${iy.toFixed(1)}) and (${jx.toFixed(1)},${jy.toFixed(1)})`,
            },
            {
              sym: 'A·v',
              name: 'The transformed vector',
              note: 'Where your arrow ended up. Not “A times v” in the school sense — it is a machine being run.',
              val: `(${tvx.toFixed(2)}, ${tvy.toFixed(2)})`,
            },
            {
              sym: 'det',
              name: 'Determinant',
              note: 'The area scale factor. Zero means the transform is a one-way door — nothing can reverse it.',
              val: det.toFixed(3),
            },
            {
              sym: '‖v‖',
              name: 'Norm — the length of the arrow',
              note: '√(v₁² + v₂²), straight from Pythagoras. Used to compare sizes and to normalise.',
              val: `${Math.hypot(vx, vy).toFixed(2)} → ${Math.hypot(tvx, tvy).toFixed(2)}`,
            },
            {
              sym: 'u · v',
              name: 'Dot product',
              note: 'One number saying how much two vectors agree. The single most-used operation in all of ML.',
              val: 'similarity, in one number',
            },
            {
              sym: 'cos θ',
              name: 'Cosine of the angle between them',
              note: '1 = same direction, 0 = unrelated, −1 = opposite. Cosine similarity is this, and nothing more.',
              val: 'how search ranks results',
            },
            {
              sym: 'Aᵀ',
              name: 'Transpose — flip rows and columns',
              note: 'Turns rows into columns. Appears constantly when shapes need to line up for multiplication.',
              val: 'a bookkeeping move',
            },
            {
              sym: 'A⁻¹',
              name: 'The inverse — undo the transform',
              note: 'Exists only when det ≠ 0. If the plane got flattened, there is nothing to go back to.',
              val: collapsed ? 'does not exist right now' : 'exists',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A neural network layer is a matrix multiply',
            how: 'Every layer computes A·v + b. The "weights" people talk about are the entries of A. A 7-billion-parameter model is billions of these numbers.',
          },
          {
            what: 'Embeddings are vectors',
            how: 'A word, an image or a document becomes a list of a few hundred numbers. Things that mean similar things sit close together — closeness measured by the dot product.',
          },
          {
            what: 'Cosine similarity is the dot product',
            how: 'Semantic search and RAG rank documents by the angle between their embedding and your question. That is the last formula on this page, applied at scale.',
          },
          {
            what: 'GPUs exist for this operation',
            how: 'Training is overwhelmingly matrix multiplication. A GPU is a chip that does thousands of these sums at once — the reason deep learning became practical at all.',
          },
          {
            what: 'PCA finds the directions that matter',
            how: 'Dimensionality reduction looks for the few directions along which the data actually varies, and drops the rest. It is this picture, run in reverse and in many dimensions.',
          },
          {
            what: 'A zero determinant is lost information',
            how: 'When a transform collapses space, two different inputs become indistinguishable. Understanding rank is understanding how much a layer can actually carry.',
          },
        ]}
      />
    </div>
  )
}
