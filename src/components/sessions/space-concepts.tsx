'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These two come out
 * of Lecture 2, and each links back to the chapter parts it was drawn from.
 */
import { BasisLab, DimensionLab, FindBasisLab, MoreThanKLab } from '@/components/charts/basis-lab'
import { NullspaceSpaceLab, VectorSpaceAxiomLab, WhatIsAVectorLab } from '@/components/charts/space-lab'
import { DependenceFactsLab, SpanLab, SubspaceTestLab } from '@/components/charts/subspace-lab'
import Link from 'next/link'
import { UsedInAiml } from './algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from './session-parts'

/** Where in the taught chapters this idea came from. */
function FromLecture({ items }: { items: Array<{ href: string; label: string }> }) {
  return (
    <div className="mt-7 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        Taught in these sessions
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-[12px] font-semibold hover:border-zinc-950/30"
          >
            {i.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}

function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 mb-2 text-lg font-semibold tracking-[-0.02em]">{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">{children}</p>
}

/* ========================================================================== */

export function VectorSpaceConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Vector spaces and subspaces"
        intro="A vector space is a set you cannot fall out of. Add two of its members and you land back inside; stretch one by any number and you land back inside. That is nearly the whole idea, and it is the reason the same words work for columns of numbers, for matrices, and for functions."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Think of a country with no borders you can cross by walking. Whichever two towns you pick, the road between
            them stays in the country; however far you travel along any road, you are still in the country. There is no
            edge to fall off.
          </>,
          <>
            That is the whole of it. Adding two members is the road between them; stretching one is travelling along a
            road. A <strong>vector space</strong> is a set where neither move ever takes you outside. A{' '}
            <strong>subspace</strong> is a smaller region inside one that has the same property in its own right.
          </>,
        ]}
        mappings={[
          {
            title: 'The inner operation',
            body: 'Adding. Takes two members of the set and gives back a member of the set. Never a number, never something from outside.',
          },
          {
            title: 'The outer operation',
            body: 'Stretching by a plain number. Takes a number and a member, gives back a member. Zero times anything is the zero vector, which is why every space contains it.',
          },
          {
            title: 'A subspace',
            body: 'A subset that is a space in its own right. Because it borrows the rules from the bigger space, you only have to check that it is not empty and that neither move escapes it.',
          },
        ]}
        footnote="Every worked example here is from Lecture 2 of Mathematical Foundations. Each lab computes its verdict rather than storing it, so nothing on the page can drift away from what the maths says."
      />

      <H2>Where the idea comes from</H2>
      <P>
        Lecture 1 solved Ax = b. Now look at what happens when you have two answers to the <em>same</em> system and add
        them. If Ax = b and Ay = b, then A(x + y) = 2b. That is not b, unless b happens to be zero.
      </P>
      <P>
        So the answers to Ax = b with b ≠ 0 do <em>not</em> survive adding, and the answers to Ax = 0 do. Set b to zero
        below and drag the two answers around: with b = 0 their sum stays on the line, and with any other b it does not.
      </P>

      <Lab>
        <NullspaceSpaceLab />
      </Lab>

      <H2>The two operations</H2>
      <P>
        A vector space has two operations, not one. The <strong>inner</strong> one adds two members and gives a member.
        The <strong>outer</strong> one takes a plain number λ and a member x and gives the member λx. The number comes
        from outside the set, which is where the name comes from.
      </P>
      <P>
        The rules on top of that are the ones you already use without thinking: adding is associative and commutative,
        there is a zero vector, every vector has a negative, stretching spreads over both kinds of addition, λ(ψx) =
        (λψ)x, and 1x = x. Pick your own x, y, λ and ψ and watch each rule get checked on your numbers.
      </P>

      <Lab>
        <VectorSpaceAxiomLab />
      </Lab>

      <H2>A vector is not only a column</H2>
      <P>
        Nothing in that list mentioned columns of numbers. Anything you can add and stretch qualifies — which is why
        matrices and polynomials are vector spaces too, and why every result about vector spaces applies to them
        unchanged. Switch between the three below and watch the same two operations run on each.
      </P>

      <Lab>
        <WhatIsAVectorLab />
      </Lab>

      <H2>A space inside a space</H2>
      <P>
        Take a vector space V and a subset U of it. U is a <strong>subspace</strong> if it is not empty, if adding two
        of its members lands in U, and if stretching one of its members lands in U. You do not check the eight rules
        again: U inherits all of them from V, because they hold for every member of V and every member of U is one.
      </P>
      <P>
        Notice what the second and third conditions force. Non-empty means U has something in it; stretch that thing by
        0 and you get the zero vector, which therefore has to be in U as well. A set that misses the origin can never be
        a subspace, however tidy it looks. Try to break each of the six candidates below by dragging the two arrows.
      </P>

      <Lab>
        <SubspaceTestLab />
      </Lab>

      <Explainers
        plain="A vector space is a set with two operations: adding two members, and stretching a member by a plain number. Both must land back inside the set, and a handful of ordinary rules must hold — associativity, a zero, negatives, and the two distributive laws. A subspace is a subset that is a space in its own right, and because it borrows the rules from its parent, the only things left to check are that it is not empty and that neither operation escapes it. The set of solutions to Ax = 0 is the example the subject cares about most."
        breaks="Two traps. First, looking flat and straight is not enough: the line y = x + 1 is as straight as y = x but misses the origin, so adding two of its points lands off it. Second, any bounded set fails — a square around the origin contains 0 and is closed under addition of small vectors, but stretching (1,1) by 2 leaves it immediately."
      >
        <MathBlock
          intro="Five lines are the whole concept."
          formulas={[
            {
              formula: '+ : 𝒱 × 𝒱 → 𝒱',
              reading: 'The inner operation. Two members in, one member out. This arrow is the closure requirement.',
            },
            {
              formula: '· : ℝ × 𝒱 → 𝒱',
              reading:
                'The outer operation. A plain number and a member in, a member out. The number is not in the set.',
            },
            {
              formula: 'λ(x + y) = λx + λy,  (λ + ψ)x = λx + ψx,  λ(ψx) = (λψ)x,  1x = x',
              reading: 'The four rules linking the two operations. Everything else is (𝒱, +) being an Abelian group.',
            },
            {
              formula: 'U ⊆ V subspace ⟺ U ≠ ∅,  x + y ∈ U,  λx ∈ U',
              reading:
                'The short test. Non-empty plus scaling forces 0 ∈ U, so that is a consequence, not a fourth condition.',
            },
            {
              formula: 'Ax = 0, Ay = 0 ⟹ A(x + y) = 0, A(λx) = 0',
              reading: 'The nullspace passes the test. With b ≠ 0 it fails, because A(x + y) = 2b.',
            },
          ]}
          legend={[
            {
              sym: '𝒱',
              name: 'The underlying set',
              note: 'Columns, matrices, polynomials — whatever the members are.',
              val: 'space',
            },
            { sym: 'λ, ψ', name: 'Scalars', note: 'Plain real numbers. They live outside 𝒱.', val: 'outer' },
            {
              sym: '0',
              name: 'The zero vector',
              note: 'The neutral element of adding. Compulsory in every subspace.',
              val: 'inner',
            },
            { sym: 'U ⊆ V', name: 'Subspace', note: 'A space inside a space. Three things to check.', val: 'subspace' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Embedding arithmetic assumes it',
            how: 'Adding two embeddings, or averaging a batch of them, only makes sense because the set they live in is closed under both operations. Nothing you build can leave the space.',
          },
          {
            what: 'The nullspace is where non-uniqueness hides',
            how: 'If Ax = 0 has an answer other than zero, any fitted weight vector can have it added on without changing a single prediction — so the individual weights stop meaning anything.',
          },
          {
            what: 'Function spaces reuse the same words',
            how: 'Kernel methods and Fourier analysis treat functions as vectors. They can, because functions add and stretch, which is all the definition ever asked for.',
          },
          {
            what: 'Constraints are usually subspaces, or usually are not',
            how: 'Requiring outputs to sum to zero gives a subspace. Requiring them to sum to one does not — it misses the origin — which is why such constraints need different machinery.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec2/why', label: 'Lecture 2 · Why the subject moves on' },
          { href: '/session/lec2/spaces', label: 'Lecture 2 · What a vector space is' },
          { href: '/session/lec2/examples', label: 'Lecture 2 · What else counts as a vector' },
          { href: '/session/lec2/subspaces', label: 'Lecture 2 · A space inside a space' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function BasisConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Span, basis and dimension"
        intro="Given a handful of vectors, two questions decide everything: what can you reach with them, and is any of them carrying nothing? Answer both and you have a basis — the shortest honest description of a space — and its length is the dimension."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A paint shelf with three tubes — red, blue and yellow. The colours you can mix from them are the{' '}
            <strong>span</strong> of the shelf. Add a fourth tube of orange and the span does not grow, because orange
            was already mixable: the four tubes are <strong>dependent</strong>.
          </>,
          <>
            Throw away every tube that adds nothing and what is left is a <strong>basis</strong>. The surprise is that
            the count does not depend on which tubes you kept. Any honest shelf for the same set of colours has the same
            length, and that length is the <strong>dimension</strong>.
          </>,
        ]}
        mappings={[
          {
            title: 'Span',
            body: 'Everything you can reach by taking some of each and adding. Always a subspace, and always the smallest one containing your vectors.',
          },
          {
            title: 'Linear independence',
            body: 'No vector is a mixture of the others. Written as: the only mixture landing on zero is the one that takes none of anything.',
          },
          {
            title: 'Basis and dimension',
            body: 'Big enough to reach everything, small enough that nothing repeats. The number of vectors in it is the dimension, and it never depends on the choice.',
          },
        ]}
        footnote="Every worked example here is from Lecture 2 of Mathematical Foundations. The reductions are run live by the site's exact-fraction code, so the pages cannot drift away from the arithmetic."
      />

      <H2>Span: what you can reach</H2>
      <P>
        Take vectors x₁ … xₖ and mix them: λ₁x₁ + λ₂x₂ + ⋯ + λₖxₖ, with the λ&rsquo;s any numbers you like. Every point
        you can hit this way is the <strong>span</strong>.
      </P>
      <P>
        Two arrows in the plane usually span the whole plane. But line them up — make one a multiple of the other — and
        everything you can mix falls on a single line. Drag them together below and watch the shaded plane collapse.
      </P>

      <Lab>
        <SpanLab />
      </Lab>

      <H2>Independence: is anything carrying nothing?</H2>
      <P>
        Vectors are <strong>linearly dependent</strong> when some mixture reaches zero without taking none of
        everything: 0 = Σ λᵢxᵢ with at least one λᵢ ≠ 0. They are <strong>independent</strong> when the only mixture
        reaching zero is the all-zeros one.
      </P>
      <P>
        The definition looks awkward, and it is written that way on purpose. Saying &ldquo;none of them is a mixture of
        the others&rdquo; is easier to read but goes wrong when the zero vector is in the set. Three facts follow
        straight from the definition, and each is draggable below.
      </P>

      <Lab>
        <DependenceFactsLab />
      </Lab>

      <H2>The shape can decide it for you</H2>
      <P>
        Sometimes you do not need any arithmetic. If you build m vectors out of k independent ingredients and m &gt; k,
        the coefficient matrix is k × m: it has at most k pivots, so at least one column is not a pivot column, so a
        non-trivial mixture reaches zero. More vectors than ingredients is always dependent.
      </P>

      <Lab>
        <MoreThanKLab />
      </Lab>

      <H2>Basis: reach everything, waste nothing</H2>
      <P>
        A set that reaches every vector in the space is a <strong>generating set</strong>. A generating set that is also
        independent is a <strong>basis</strong>. Both conditions matter, and each rules out a different failure: too few
        vectors and you cannot reach everything, too many and one of them is spare.
      </P>
      <P>
        A basis is not unique. ℝ³ has the obvious one, and also (1,0,0), (1,1,0), (1,1,1), and infinitely many others.
        What every basis of the same space shares is its size.
      </P>

      <Lab>
        <BasisLab />
      </Lab>

      <H2>Dimension is not the number of components</H2>
      <P>
        The <strong>dimension</strong> of a space is how many vectors a basis has. It is easy to assume that equals the
        number of numbers each vector is written with, and for ℝⁿ it does. But a line through the origin inside ℝ³ has
        dimension 1, and its vectors still carry three numbers each.
      </P>

      <Lab>
        <DimensionLab />
      </Lab>

      <H2>Finding a basis of a span</H2>
      <P>
        Three steps. Write the spanning vectors as the columns of a matrix; reduce it to row echelon form; keep the
        original vectors sitting in the pivot columns. Those are a basis, and how many there are is the dimension.
      </P>
      <P>
        The last step is the one people get wrong: you keep your <em>original</em> vectors, not the reduced columns. The
        reduction is only there to tell you which of your vectors to keep.
      </P>

      <Lab>
        <FindBasisLab />
      </Lab>

      <Explainers
        plain="The span of a set of vectors is everything you can build by stretching them and adding — always a subspace. The set is independent when the only mixture reaching the zero vector takes none of anything; in practice you write the vectors as columns, reduce, and check every column carries a pivot. A generating set reaches everything in the space; a basis is a generating set that is also independent, equivalently a minimal generating set, equivalently a maximal independent set. Over a basis every vector has exactly one set of coefficients. The dimension is how many vectors a basis has, and it is the same for every basis of the same space."
        breaks="Dimension is not the number of components — span{(0,1)} lives inside ℝ² and has dimension 1. And independence on its own does not make a basis: three independent vectors in ℝ⁴ are perfectly independent and still cannot reach everything, so the set is too small to be one."
      >
        <MathBlock
          intro="Six lines carry the concept."
          formulas={[
            {
              formula: 'span{x₁, …, xₖ} = { Σ λᵢxᵢ : λᵢ ∈ ℝ }',
              reading: 'Everything reachable by mixing. Always a subspace, and the smallest one containing all the xᵢ.',
            },
            {
              formula: '0 = Σ λᵢxᵢ with some λᵢ ≠ 0  ⟹  dependent',
              reading:
                'Dependence. Independence is the denial of it: the trivial mixture is the only one that reaches zero.',
            },
            {
              formula: 'columns → REF → every column a pivot ⟺ independent',
              reading: 'The test you actually run. Non-pivot columns are mixtures of the pivot columns to their left.',
            },
            {
              formula: 'm > k ⟹ dependent',
              reading:
                'm vectors built from k ingredients. At most k pivots across m columns leaves a spare, every time.',
            },
            {
              formula: 'basis = independent generating set = minimal generating set',
              reading:
                'Also a maximal independent set: add one more vector and it becomes dependent. Coefficients over it are unique.',
            },
            {
              formula: 'dim V = |B|,   U ⊆ V ⟹ dim U ≤ dim V',
              reading:
                'The dimension, and the one comparison that always holds. Equality happens only when U is all of V.',
            },
          ]}
          legend={[
            { sym: 'span', name: 'The reachable set', note: 'Everything mixable from the given vectors.', val: 'span' },
            { sym: 'λᵢ', name: 'Coefficients', note: 'How much of each vector the mixture takes.', val: 'mixing' },
            {
              sym: 'pivot',
              name: 'A step of the staircase',
              note: 'Its column marks a vector worth keeping.',
              val: 'test',
            },
            { sym: 'B', name: 'A basis', note: 'Independent and generating. Not unique.', val: 'basis' },
            { sym: 'dim V', name: 'Dimension', note: 'The size of any basis. Unique.', val: 'dimension' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'PCA hands you a different basis',
            how: 'It keeps the space and changes the shelf: a new basis whose first few vectors carry most of the spread, so the rest can be dropped cheaply.',
          },
          {
            what: '"Too many features" is a statement about dimension',
            how: 'A table with 300 columns carrying only 12 independent directions has dimension 12. A method that assumes 300 spends the other 288 fitting noise.',
          },
          {
            what: 'Rank decides whether a fit is determined at all',
            how: 'Least squares has exactly one answer when the feature columns are independent. Checking that is the pivot count, run on your data matrix.',
          },
          {
            what: 'Latent dimension is a design choice',
            how: 'The bottleneck width of an autoencoder, or the number of topics in a factorisation, is you choosing the dimension of the space the data gets described in.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec2/span', label: 'Lecture 2 · Span: everything you can reach' },
          { href: '/session/lec2/independence', label: 'Lecture 2 · Independent, or carrying nothing' },
          { href: '/session/lec2/counting', label: 'Lecture 2 · When the shape decides for you' },
          { href: '/session/lec2/basis', label: 'Lecture 2 · Generating set, and basis' },
          { href: '/session/lec2/dimension', label: 'Lecture 2 · Dimension' },
          { href: '/session/lec2/findbasis', label: 'Lecture 2 · Finding a basis' },
        ]}
      />
    </div>
  )
}
