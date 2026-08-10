'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene and then hands you off to the
 * parts, without repeating them — a reader who wants the material should be one
 * click from it, not scrolling past a summary of it.
 */
export function MlLecture2Overview() {
  const parts = partsOf('mllec2')

  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Chapter"
        title="Lecture 2 — Vector spaces, independence and basis"
        intro="The lecture that says what a set of model parameters has to promise before you can do arithmetic on it. Groups, then vector spaces, then subspaces; then linear independence and the elimination that decides it; then span, basis and dimension. It ends on an example the deck sets and does not answer."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You record a house’s size twice by accident — once in square metres, once in square feet. Fit a linear model
            and something strange happens. The predictions are fine. The coefficients are nonsense: you can add any
            amount to one and take the matching amount off the other, and every prediction stays exactly the same. The
            model is not broken and the data is not broken. There is simply a whole line of weight vectors the data
            cannot tell apart.
          </>,
          <>
            That line is a <strong>subspace</strong>, the two columns are <strong>linearly dependent</strong>, and the
            number of columns that genuinely say something is the <strong>rank</strong>. This lecture is where those
            three words are defined properly — and once they are, that failure stops being a mystery and becomes a
            calculation you can do in advance.
          </>,
        ]}
        mappings={[
          {
            title: 'Two closures',
            body: 'A subset is a subspace when adding two members keeps you inside and scaling a member keeps you inside. That is the whole test, and the fastest way to fail it is to notice the origin is missing.',
          },
          {
            title: 'Pivots decide',
            body: 'Vectors in as columns, row-reduce, count the pivots. Pivot columns are independent; every non-pivot column comes with a written recipe for rebuilding it from the others.',
          },
          {
            title: 'Basis, and dimension',
            body: 'Big enough to reach everything, small enough that nothing repeats. There are endlessly many bases of a space and they all have the same size — that size is the dimension.',
          },
        ]}
        footnote="Everything here is the deck's own: both worked eliminations, the four-vector example and its coefficients 7, 15, 18, 1, the three bases of ℝ³, and the ℝ⁵ example on the last slide. Where the deck poses a question and prints no answer — slide 37 and slide 41 — the answer on these pages was worked out here and checked by substituting back, and each says so on the page. Two slides are loose about a symbol or an index; those carry a note rather than a silent correction."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, and a note on what the idea is for in real
        machine learning. Each is listed in the left menu so you can come straight back to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/mllec2/${p.id}`}
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
        plain="A group is a set with one operation that is closed, associative, has an identity and has inverses; add commutativity and it is Abelian. A vector space is a set with two operations — an inner one, addition, under which it is an Abelian group, and an outer one, scaling by a real number, obeying two distributive laws, associativity, and 1 · x = x. Anything obeying those rules is a vector, so columns, matrices and polynomials all qualify. A subspace is a non-empty subset closed under both operations, which forces it to contain the zero vector; the solutions of Ax = 0 always form one. Vectors are linearly dependent when some combination with a non-zero coefficient reaches the zero vector, which is the same as saying one of them is redundant. Elimination decides it: put the vectors in as columns, row-reduce, and the pivot columns are the independent ones. The span of a set is everything it can reach; a generating set spans the whole space; a basis is a generating set that is also independent, and every basis of a space has the same size, which is the dimension."
        breaks="The two mistakes that cost the most marks are both about size. Containing the zero vector does not make a subset a subspace — the square around the origin contains it and fails on scaling. And being linearly independent does not make a set a basis: slide 37's three vectors in ℝ⁴ are genuinely independent and still too few to span. The other trap is direction: more vectors than dimensions forces dependence, but fewer than dimensions proves nothing at all, so the shape argument only ever works one way."
      >
        <MathBlock
          intro="Everything the lecture defines, with the symbols read aloud. The right-hand line says which part of the chapter each one is settled in."
          formulas={[
            {
              formula: '⊗ : G × G → G',
              reading:
                'A group operation: two members in, one member out. A group needs closure, associativity, an identity e, and an inverse for every member.',
            },
            {
              formula: '+ : 𝒱 × 𝒱 → 𝒱 and · : ℝ × 𝒱 → 𝒱',
              reading:
                'The inner and outer operations of a vector space. Note the outer one takes its two inputs from different sets, which is why it cannot be folded into the inner one.',
            },
            {
              formula: 'λ · (x + y) = λ · x + λ · y',
              reading: 'Distributivity over vector addition.',
            },
            {
              formula: '(λ + ψ) · x = λ · x + ψ · x',
              reading: 'Distributivity over scalar addition. The law that breaks first when a scaling rule is wrong.',
            },
            {
              formula: 'λ · (ψ · x) = (λψ) · x   and   1 · x = x',
              reading: 'Associativity of the outer operation, and its neutral element.',
            },
            {
              formula: '𝒰 ⊆ 𝒱 is a subspace ⟺ 𝒰 ≠ Φ, λx ∈ 𝒰, x + y ∈ 𝒰',
              reading:
                'The whole subspace test. Everything else is inherited from 𝒱, so these three are all you ever check.',
            },
            {
              formula: 'null(A) = {x : Ax = 0}',
              reading:
                'Always a subspace, because A(x + y) = Ax + Ay = 0 and A(λx) = λ(Ax) = 0. In a model, the directions the data cannot see.',
            },
            {
              formula: '0 = Σᵢ λᵢxᵢ with some λᵢ ≠ 0',
              reading:
                'Linear dependence. If the only solution is every λᵢ = 0, the vectors are linearly independent instead.',
            },
            {
              formula: 'xⱼ = Bλⱼ',
              reading:
                'Vectors built from independent ingredients. The x’s are independent if and only if the coefficient vectors λ are — so you can test the recipes instead of the results.',
            },
            {
              formula: 'm > k ⟹ dependent',
              reading:
                'More vectors than ingredients forces a non-pivot column, hence a non-trivial combination reaching 0. The converse is not a theorem.',
            },
            {
              formula: '𝒱 = span[𝒜]',
              reading:
                'Every vector of 𝒱 is a linear combination of members of 𝒜. A linearly independent generating set is a basis.',
            },
            {
              formula: 'dim(𝒰) ≤ dim(𝒱), with equality ⟺ 𝒰 = 𝒱',
              reading:
                'Dimension counts basis vectors, not components. The equality case is a standard way to prove two spaces are the same.',
            },
          ]}
          legend={[
            {
              sym: '⊗',
              name: 'A group operation',
              note: 'Deliberately blank — whatever you are testing.',
              val: 'part 2',
            },
            { sym: 'e', name: 'The identity element', note: 'The member that does nothing.', val: 'part 2' },
            { sym: 'λ, ψ', name: 'Scalars', note: 'Plain real numbers, used for scaling.', val: 'part 3' },
            { sym: '𝒱', name: 'A vector space', note: 'The set together with its two operations.', val: 'part 3' },
            { sym: '𝒰', name: 'A subspace', note: 'A subset that is a vector space in its own right.', val: 'part 5' },
            { sym: 'Φ', name: 'The empty set', note: 'A subspace must not be it.', val: 'part 5' },
            {
              sym: 'null(A)',
              name: 'The nullspace',
              note: 'All x with Ax = 0. The one subspace the deck singles out.',
              val: 'part 6',
            },
            {
              sym: 'B',
              name: 'The ingredient matrix',
              note: 'Columns are b₁ … bₖ, which must be independent.',
              val: 'part 11',
            },
            {
              sym: 'pivot',
              name: 'A leading entry',
              note: 'Its column is independent; a column without one is redundant.',
              val: 'part 9',
            },
            { sym: 'span[𝒜]', name: 'Everything reachable', note: 'All linear combinations of 𝒜.', val: 'part 14' },
            { sym: 'ℬ', name: 'A basis', note: 'Independent and generating. Never unique.', val: 'part 15' },
            { sym: 'dim(𝒱)', name: 'The dimension', note: 'How many vectors are in a basis.', val: 'part 16' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A rank-deficient design matrix has no unique fit',
            how: 'Duplicated or collinear features put a vector in null(X), so a whole line of weight vectors gives identical predictions. Ordinary least squares still returns coefficients, and none of them can be read as "the effect of this feature".',
          },
          {
            what: 'The dummy variable trap is a dependence you create',
            how: 'One-hot columns sum to the all-ones column, which is the intercept. Four columns, one exact relation, so drop one level — that is what drop_first does, and the theory says exactly one is enough.',
          },
          {
            what: 'PCA needs the data centred because a subspace contains 0',
            how: 'A subspace must pass through the origin. Uncentred data lies near a flat sheet that does not, so the first component points at the mean instead of along the spread — a silent failure that still produces numbers.',
          },
          {
            what: 'p > n makes regularisation compulsory, not optional',
            how: 'More features than samples guarantees dependent columns by slide 31 alone, so infinitely many weight vectors fit the training data perfectly. Ridge picks the minimum-norm one, Lasso picks a sparse one; the data cannot pick at all.',
          },
          {
            what: 'What a linear model can predict is a span',
            how: 'ŷ = Xw ranges over the span of X’s columns, and least squares projects y onto it. Adding a feature already in that span cannot lower the training error — which is why a duplicated column leaves R² untouched while wrecking the coefficients.',
          },
          {
            what: 'Collinearity is about rank, not about pairs',
            how: 'The chapter’s last example has x₃ = −x₁ + 2x₂, a three-way relation no correlation heat map will show. Only a rank computation finds it, which is why matrix_rank beats eyeballing a correlation matrix.',
          },
          {
            what: 'Dimension is why dimensionality reduction works at all',
            how: 'A 4096-pixel image has 4096 components and lives near a far smaller subspace. Components are a fact about the file format; dimension is a fact about the data, and n_components is an estimate of the second.',
          },
          {
            what: 'Optimisers only ever use the two operations',
            how: 'w ← w − η∇L is one scaling and one addition. That is why the same optimiser code runs on a 2-parameter model and a 70-billion-parameter one, and why averaging two models is a meaningful thing to do.',
          },
        ]}
      />

      <ConnectionMap topic="mllec2" />
    </div>
  )
}
