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
export function Lecture0bOverview() {
  const parts = partsOf('lec0b')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 0b — Vectors, dot products and probability"
        intro="This lecture has two halves that look unrelated and are not. The first asks which vectors in a collection are genuinely saying something new. The second sets up probability from three axioms and gets as far as covariance. What joins them is one operation — the dot product — which measures length and angle in the first half, and turns out to be what covariance is doing in the second."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You are given four measurements of every house on a street: floor area in square metres, floor area in
            square feet, number of rooms, and price. Four columns of numbers — but you do not have four independent
            pieces of information, because the first two say the same thing in different units.
          </>,
          <>
            The first half of this lecture is a way of detecting exactly that, and it works whether you have 3 columns
            or 300. The second half asks a related question about a pair of columns: when one is above its average, is
            the other usually above its too? That is <strong>covariance</strong>, and it is the last thing the lecture
            builds.
          </>,
        ]}
        mappings={[
          {
            title: 'Linear independence',
            body: 'Whether each vector adds anything. Two columns saying the same thing in different units are dependent, and no method can separate their effects.',
          },
          {
            title: 'The dot product',
            body: 'Multiply matching parts and add. One number that gives you length, angle, and a test for being at right angles.',
          },
          {
            title: 'Expectation and variance',
            body: 'Where a random quantity balances, and how far it usually strays from there. The two numbers you always want first.',
          },
        ]}
        footnote="Every worked example and all six practice questions are the lecture's own, and each answer here was either taken from the slide or worked out and then checked — by substituting back, or by running it in one of the labs."
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
            href={`/session/lec0b/${p.id}`}
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
        plain="A vector is a list of numbers you can add and stretch. Mixing them gives linear combinations, and a set is independent when the only mixture landing on zero is the all-zeros one — which you check by taking a rank. The dot product multiplies matching parts and adds: it gives length, angle, and a zero-means-right-angles test, and it lets you split any vector into a part along another and a part at right angles to it. Probability then starts from three axioms, random variables turn outcomes into numbers, and expectation, variance and covariance summarise how those numbers behave."
        breaks="Two things trip people up. A probability density is not a probability — it can be bigger than 1, and only areas under it mean anything, which is why a single exact value has probability zero. And covariance only sees straight-line patterns: points in a perfect arch have a strong relationship and a covariance near zero, because the two halves cancel. Its size is also unit-dependent, so it says little until you divide it down into a correlation."
      >
        <MathBlock
          intro="Eight lines carry the whole lecture. Every part above is one of these being taken slowly."
          formulas={[
            {
              formula: 'c₁v₁ + c₂v₂ + ⋯ + cₘvₘ',
              reading:
                'A linear combination — the only expression adding and stretching lets you build. Everything in the first half is about which points you can reach with it.',
            },
            {
              formula: 'c₁v₁ + ⋯ + cₘvₘ = 0  ⟹  all cᵢ = 0',
              reading:
                'Linear independence. Taking none of anything always works; independence means there is no other way. If there is another way, one vector is a mixture of the rest.',
            },
            {
              formula: 'rank = p  independent,   rank < p  dependent',
              reading:
                'The test that survives past three dimensions. Lay the p vectors out as rows and count. More vectors than components is always dependent.',
            },
            {
              formula: '⟨a, b⟩ = aᵀb = Σᵢ aᵢbᵢ',
              reading:
                'The dot product. Multiply matching parts, add them up, get one plain number. Positive means the two lean the same way; zero means at right angles.',
            },
            {
              formula: '‖a‖ = √⟨a, a⟩,   |⟨a, b⟩| ≤ ‖a‖‖b‖',
              reading:
                'Length is Pythagoras in any number of dimensions. Cauchy–Schwarz caps the dot product, which is what makes the next line legal.',
            },
            {
              formula: 'α = cos⁻¹( ⟨a, b⟩ / (‖a‖‖b‖) )',
              reading:
                'The angle between two vectors. Orthogonal means ⟨a, b⟩ = 0, and that is the version you actually check.',
            },
            {
              formula: 'v = (v₂ᵀv₁ / v₁ᵀv₁) v₁',
              reading:
                'The projection of v₂ onto v₁ — its shadow. Derived by insisting the leftover be at right angles, which is why the leftover always is.',
            },
            {
              formula: 'μ = Σ x p(x),   σ² = E[(X − μ)²],   cov = E[(X − μₓ)(Y − μᵧ)]',
              reading:
                'Where a random quantity balances, how far it strays, and whether two of them move together. The last one is the first tool that looks at a pair.',
            },
          ]}
          legend={[
            { sym: 'ℝⁿ', name: 'Lists of n numbers', note: 'ℝ² is a page, ℝ³ is a room, and past that you stop drawing.', val: 'part 1' },
            { sym: 'cᵢ', name: 'Coefficients', note: 'How much of each vector to take in a mixture.', val: 'part 2' },
            { sym: 'rank', name: 'The count', note: 'How many vectors are genuinely different.', val: 'part 5' },
            { sym: 'pivot', name: 'A step of the staircase', note: 'Its column marks an independent vector.', val: 'part 6' },
            { sym: '⟨a, b⟩', name: 'Dot product', note: 'Also written a·b or aᵀb. Always a plain number.', val: 'part 8' },
            { sym: '‖a‖', name: 'Norm', note: 'The length of the arrow. Never negative.', val: 'part 9' },
            { sym: 'α', name: 'The angle', note: 'Zero dot product means 90°, the case worth spotting.', val: 'part 10' },
            { sym: 'Ω', name: 'Sample space', note: 'Everything that could possibly happen.', val: 'part 12' },
            { sym: 'X', name: 'Random variable', note: 'A rule turning each outcome into a number.', val: 'part 14' },
            { sym: 'f(x)', name: 'Density', note: 'Not a probability. Only areas under it are.', val: 'part 15' },
            { sym: 'σ²', name: 'Variance', note: 'Average squared distance from the mean. Divided by n here.', val: 'part 17' },
            { sym: 'cov', name: 'Covariance', note: 'Do two quantities rise and fall together?', val: 'part 18' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Dependent columns break a model quietly',
            how: 'Two features saying the same thing in different units make the data rank-deficient. The fit still runs, but the individual weights become meaningless and wildly unstable.',
          },
          {
            what: 'The dot product is the inner loop of everything',
            how: 'A neural network layer is a pile of dot products. So is a similarity search. When people say a GPU does trillions of operations a second, this is the operation.',
          },
          {
            what: 'Cosine similarity is exactly part 10',
            how: 'Search and recommendation systems compare two embeddings by the angle between them rather than the distance, because direction carries the meaning and length usually does not.',
          },
          {
            what: 'Projection is what "best fit" means',
            how: 'Least squares finds the point in the span of your features closest to the data, which is the projection. The leftover at right angles is the residual you are minimising.',
          },
          {
            what: 'Expectation is what a loss function averages',
            how: 'Training minimises the expected loss. In practice you average over a batch, which is the empirical version of exactly the sum in part 16.',
          },
          {
            what: 'The covariance matrix runs multivariate statistics',
            how: 'Collect every pairwise covariance into one symmetric matrix and you have the object behind PCA, behind the multivariate normal, and behind whitening a dataset.',
          },
        ]}
      />
    </div>
  )
}
