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
export function Lecture2Overview() {
  const parts = partsOf('lec2')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 2 — Vector spaces, independence and basis"
        intro="Up to now a matrix was a thing you did arithmetic to. This lecture asks a different question: what does the set of all answers to Ax = 0 look like? It turns out to be closed under adding and under stretching, and that pair of promises is the whole definition of a vector space. From there the lecture builds subspace, span, linear independence, basis and dimension — the vocabulary the rest of the course speaks in."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Think of a paint mixer with three tubes: red, blue and yellow. The set of colours you can make is everything
            you can reach by taking some of each and adding — that is a <strong>span</strong>. Now put a fourth tube of
            orange on the shelf. It adds nothing, because you could already mix orange from red and yellow: the four
            tubes are <strong>dependent</strong>.
          </>,
          <>
            A <strong>basis</strong> is the shelf after you have thrown away every tube that adds nothing, and the{' '}
            <strong>dimension</strong> is how many tubes are left. The surprise of the lecture is that the count does
            not depend on which tubes you kept — every honest shelf for the same set of colours has the same length.
          </>,
        ]}
        mappings={[
          {
            title: 'Vector space',
            body: 'A set where adding two members and stretching one never take you outside. Two operations, eight promises, and columns are only one example of it.',
          },
          {
            title: 'Span and independence',
            body: 'What you can reach, and whether any of your ingredients was already reachable from the others.',
          },
          {
            title: 'Basis and dimension',
            body: 'The smallest shelf that still reaches everything, and the number of tubes on it — the same number however you choose them.',
          },
        ]}
        footnote="Every worked example here is the lecture's own. The one place the deck poses a question and stops — the final example on slide 41 — is worked out on the page and then checked by substituting back, and the page says so."
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
            href={`/session/lec2/${p.id}`}
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
        plain="A vector space is a set you can add inside and stretch inside without ever leaving it. A subspace is a smaller set inside one that still passes the same two tests. The span of some vectors is everything you can build from them by mixing; they are independent when the only mixture landing on zero is the all-zeros one, which in practice you check by row reducing and counting pivots. A generating set reaches everything; a basis is a generating set with nothing spare in it; and the dimension is how many vectors a basis has — a number that comes out the same whichever basis you pick."
        breaks="Two things catch people out. Dimension is not the number of components: a line through the origin inside ℝ³ has dimension 1, and its vectors still have three numbers each. And a subset can fail to be a subspace for a reason that is invisible from a picture of it — the line y = x + 1 looks as flat and straight as y = x, but it misses the origin, so adding two of its points lands off it."
      >
        <MathBlock
          intro="Nine lines carry the whole lecture. Every part above is one of these being taken slowly."
          formulas={[
            {
              formula: 'Ax = 0  and  Ay = 0  ⟹  A(x + y) = 0',
              reading:
                'The observation the lecture starts from. Answers to a system with zero on the right can be added and stretched and stay answers. With anything else on the right they cannot.',
            },
            {
              formula: 'closure, associativity, neutral element, inverse',
              reading:
                'The four promises that make a set with one operation a group. Everything later is this list, twice over, with a few extra lines.',
            },
            {
              formula: 'x + y ∈ V,   λx ∈ V',
              reading:
                'The two closures. An inner operation adds two members of V; an outer one stretches one member by a plain number. Nothing leaves V.',
            },
            {
              formula: 'U ⊆ V is a subspace  ⟺  U ≠ ∅,  x + y ∈ U,  λx ∈ U',
              reading:
                'The short test. Because U inherits the eight axioms from V, you only have to check it is non-empty and that the two closures hold. Non-empty plus scaling forces 0 ∈ U.',
            },
            {
              formula: 'span{x₁, …, xₖ} = { Σ λᵢxᵢ : λᵢ ∈ ℝ }',
              reading:
                'Everything reachable by mixing. It is always a subspace, and it is the smallest one containing all of the xᵢ.',
            },
            {
              formula: 'Σ λᵢxᵢ = 0  ⟹  every λᵢ = 0',
              reading:
                'Linear independence, written the awkward way on purpose. Taking none of anything always reaches zero; independence says nothing else does.',
            },
            {
              formula: 'rank = k  independent,   rank < k  dependent',
              reading:
                'The test you actually run. Row reduce, count the pivots, compare with how many vectors you started with. The pivot columns name the independent ones.',
            },
            {
              formula: 'B generates V  and  B is independent  ⟹  B is a basis',
              reading:
                'Big enough to reach everything, small enough that nothing repeats. A minimal generating set and a maximal independent set are the same thing.',
            },
            {
              formula: 'dim V = |B|',
              reading:
                'The dimension. Every basis of the same space has the same number of vectors, so this is a property of the space and not of the choice.',
            },
          ]}
          legend={[
            { sym: 'V', name: 'A vector space', note: 'A set closed under adding and stretching.', val: 'part 3' },
            {
              sym: 'λ, ψ',
              name: 'Scalars',
              note: 'Plain numbers you stretch by. From ℝ throughout this lecture.',
              val: 'part 3',
            },
            {
              sym: 'U ⊆ V',
              name: 'A subspace',
              note: 'A space sitting inside a bigger one. Must contain 0.',
              val: 'part 5',
            },
            {
              sym: 'span',
              name: 'The reachable set',
              note: 'Everything you can mix from the given vectors.',
              val: 'part 6',
            },
            {
              sym: '0',
              name: 'The neutral element',
              note: 'Adding it changes nothing. Every subspace has to hold it.',
              val: 'part 2',
            },
            {
              sym: 'rank',
              name: 'The pivot count',
              note: 'How many of your vectors are genuinely different.',
              val: 'part 8',
            },
            {
              sym: 'REF',
              name: 'Row echelon form',
              note: 'The staircase. Two correct routes can give different ones.',
              val: 'part 8',
            },
            {
              sym: 'RREF',
              name: 'Reduced row echelon form',
              note: 'The staircase tidied up. Unique, whatever route you took.',
              val: 'part 8',
            },
            { sym: 'B', name: 'A basis', note: 'An independent generating set. Not unique.', val: 'part 12' },
            { sym: 'dim V', name: 'Dimension', note: 'How many vectors a basis has. Unique.', val: 'part 13' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Dimension is what "too many features" means',
            how: 'A dataset with 300 columns that really only carries 12 independent directions has dimension 12. Methods that assume 300 will fit noise in the other 288.',
          },
          {
            what: 'PCA hands you a new basis',
            how: 'It keeps the same space and changes the shelf: a fresh basis whose first few vectors carry most of the spread, so you can drop the rest and lose little.',
          },
          {
            what: 'The nullspace is where non-uniqueness lives',
            how: 'If Ax = 0 has answers other than zero, then any fitted weight vector can have one of them added to it without changing a single prediction. That is why the weights stop meaning anything.',
          },
          {
            what: 'Embeddings are span arithmetic',
            how: 'Word and image embeddings are used by adding and stretching them. Every such claim only makes sense because the set they live in is a vector space.',
          },
          {
            what: 'Rank tells you if the fit is even determined',
            how: 'Least squares has one answer exactly when the feature columns are independent. Checking that is the pivot count from part 8, run on your data matrix.',
          },
          {
            what: 'Function spaces are vector spaces too',
            how: 'Polynomials, and the functions a kernel method works with, add and stretch just like columns do — which is why the same words carry across without being redefined.',
          },
        ]}
      />
    </div>
  )
}
