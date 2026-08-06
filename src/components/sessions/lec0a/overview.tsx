'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene and then hands you off to the
 * parts, without repeating them — a reader who wants the material should be one
 * click from it, not scrolling past a summary of it.
 */
export function Lecture0aOverview() {
  const parts = partsOf('lec0a')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 0a — Matrices, determinants and linear systems"
        intro="This is the toolkit lecture. It builds the box of numbers, teaches you the four things you can do to one, and then uses them to answer a single question: when does a set of straight-line rules have an answer, and how do you find it? Every part has something you can press, drag or break."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Think of a spreadsheet of house sales. One row per house, one column per thing you measured — size, number
            of rooms, price. That grid is a <strong>matrix</strong>, and nothing more mysterious than that. Almost every
            piece of data you will meet in this programme arrives in exactly that shape.
          </>,
          <>
            Now suppose you want a rule that turns size and rooms into a price. Every house you already know about turns
            into one equation, and the numbers in the rule are the unknowns. Solving them all at once is what this
            lecture is for — and the same machinery tells you honestly when your data is not enough, which happens more
            often than anyone would like.
          </>,
        ]}
        mappings={[
          {
            title: 'The matrix A',
            body: 'Your table of numbers. One row per equation, one column per unknown. Shape is written m × n — rows first, always.',
          },
          {
            title: 'The determinant',
            body: 'One number worked out from a square matrix. If it is zero, two of your columns say the same thing and the problem cannot be untangled.',
          },
          {
            title: 'The rank',
            body: 'A count of how many rows genuinely say something new. It decides whether you get no answer, one answer, or endless answers.',
          },
        ]}
        footnote="Nothing here is invented for the site: every worked example, and the ten practice questions in the last part, come straight from the deck and the practice sheet handed out with it."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, and each is listed in the left menu so you can come straight back to any
        of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/lec0a/${p.id}`}
            className="flex h-full flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-4 hover:border-zinc-950/25 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2">
              <span
                className="grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
              >
                {i + 1}
              </span>
              {p.slides && <span className="text-[10.5px] text-zinc-400">{p.slides}</span>}
            </div>
            <span className="text-[14px] font-semibold text-zinc-950">{p.title}</span>
            <span className="text-[12.5px]/[1.6] text-zinc-600">{p.teaser}</span>
          </Link>
        ))}
      </div>

      <Explainers
        plain="A matrix is a box of numbers. You can add two of them, multiply one by a plain number, multiply two together (row meets column), and tip one over. A square one has a determinant — one number that is zero exactly when the matrix cannot be undone. Row reduction tidies any matrix into a staircase, and counting the surviving rows gives the rank. Put the right-hand side on as an extra column, compare two ranks, and you know whether your equations have no answer, one, or endlessly many."
        breaks="It breaks in the two ways that matter most in practice. If your equations contradict each other, a row ends up reading 0 = 4 and there is no answer — which is what real, noisy data almost always does, and why linear regression exists. If one equation repeats what the others already said, the rank drops, unknowns go free, and endless different models fit the data equally well. Both cases show up as a determinant of zero or a rank that is smaller than you hoped."
      >
        <MathBlock
          intro="Eight lines carry the whole lecture. Every part above is one of these being taken slowly."
          formulas={[
            {
              formula: 'cⱼₖ = aⱼ₁b₁ₖ + aⱼ₂b₂ₖ + … + aⱼₙbₙₖ',
              reading:
                'Matrix multiplication. Row j of the left meets column k of the right: multiply the pairs and add. The columns of the left must match the rows of the right.',
            },
            {
              formula: '(m × n) · (n × p) = (m × p)',
              reading:
                'The shape rule. The two inner numbers must agree and then vanish; the outer two are the shape of the answer.',
            },
            {
              formula: '(AB)ᵀ = BᵀAᵀ,    (AB)⁻¹ = B⁻¹A⁻¹',
              reading:
                'Transposing or undoing a product reverses the order. Socks then shoes is undone by shoes then socks.',
            },
            {
              formula: 'det A = ad − bc    (2 × 2)',
              reading:
                'The area of the box the two columns make, with a sign. Zero area means the columns lie along each other and there is no inverse.',
            },
            {
              formula: 'det A = Σⱼ (−1)^(j+k) aⱼₖ Mⱼₖ',
              reading:
                'Cofactor expansion, along any row or column you like. Pick the one with the most zeros — every zero saves a whole smaller determinant.',
            },
            {
              formula: '[A | I]  →  [I | A⁻¹]',
              reading:
                'Row-reduce the two halves together. The moves that turn A into I are exactly the moves that undo A, and doing them to I writes them down.',
            },
            {
              formula: 'xᵀAx > 0 for every x ≠ 0',
              reading:
                'Positive definite. A promise about every x at once, checked by completing the square or by the leading determinants.',
            },
            {
              formula: 'rank A vs rank [A | b]',
              reading:
                'The whole answer in one comparison. Different means no solution. The same means yes, and (unknowns − rank) counts the free ones.',
            },
          ]}
          legend={[
            { sym: 'A', name: 'The matrix', note: 'm rows by n columns. Rows are always said first.', val: 'part 2' },
            {
              sym: 'Aᵀ',
              name: 'Transpose',
              note: 'Tipped over, so rows become columns.',
              val: 'part 5',
            },
            {
              sym: 'I',
              name: 'The do-nothing matrix',
              note: '1s down the diagonal, 0s elsewhere. Multiplying by it changes nothing.',
              val: 'part 6',
            },
            {
              sym: 'det A',
              name: 'Determinant',
              note: 'One number from a square matrix. Zero means no inverse.',
              val: 'parts 12–14',
            },
            {
              sym: 'A⁻¹',
              name: 'Inverse',
              note: 'Undoes A. Only exists when the determinant is not zero.',
              val: 'part 15',
            },
            {
              sym: 'rank',
              name: 'Rank',
              note: 'How many rows still say something after tidying up.',
              val: 'part 11',
            },
            {
              sym: 'pivot',
              name: 'A step of the staircase',
              note: 'The first non-zero in a row. Its column gets pinned down.',
              val: 'parts 9–10',
            },
            {
              sym: 'Ax = b',
              name: 'A whole system',
              note: 'Coefficients, unknowns, right-hand sides.',
              val: 'part 17',
            },
            {
              sym: 'Ax = 0',
              name: 'Homogeneous',
              note: 'Right-hand side all zeros. Always has at least the all-zeros answer.',
              val: 'part 17',
            },
            {
              sym: 'xᵀAx',
              name: 'Quadratic form',
              note: 'Row times matrix times column. Always one plain number.',
              val: 'part 7',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A dataset is a matrix, and a batch is a matrix product',
            how: 'One row per example, one column per feature. Pushing 256 examples through a layer at once is one matrix multiply, which is exactly what a GPU is built to do fast.',
          },
          {
            what: 'Fitting a model is solving a system',
            how: 'Part 18 does it exactly with three houses. With three million rows the equations contradict each other, so you find the closest fit instead — but the setup is identical.',
          },
          {
            what: 'A zero determinant is a real warning',
            how: 'It means two columns say the same thing — height in cm and height in inches. The maths cannot separate their effects, and neither can any model built on top of it.',
          },
          {
            what: 'Rank tells you how much your data really says',
            how: 'A hundred columns with rank 12 means you have twelve genuine measurements dressed up as a hundred. That is what dimension reduction is for.',
          },
          {
            what: 'Positive definite means training will behave',
            how: 'It says the error surface is a proper bowl with one bottom. Semi-definite gives a flat groove the search wanders along; indefinite gives a saddle it can slide off.',
          },
          {
            what: 'Sparse matrices are why big systems fit at all',
            how: 'A table of which users watched which films is almost entirely zeros. Storing only the non-zeros is the difference between a few megabytes and a few terabytes.',
          },
        ]}
      />
    </div>
  )
}
