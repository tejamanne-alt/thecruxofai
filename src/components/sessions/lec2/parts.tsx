/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  BasisLab,
  CoordinateLab,
  DimensionLab,
  EchelonRoutesLab,
  FindBasisLab,
  FourXLab,
  MoreThanKLab,
} from '@/components/charts/basis-lab'
import {
  GroupCheckLab,
  NullspaceSpaceLab,
  VectorSpaceAxiomLab,
  WhatIsAVectorLab,
} from '@/components/charts/space-lab'
import { DependenceFactsLab, SpanLab, SubspaceTestLab } from '@/components/charts/subspace-lab'
import { Para, Takeaway, Terms, Worked } from '../session-parts'

/** A little spacer so a lab never sits flush against the words above it. */
function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
}

/** One formula on its own line, set apart from the prose around it. */
function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-center font-mono text-[15px] text-zinc-900">
      {children}
    </div>
  )
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="crux-prose mb-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px]/[1.7] text-zinc-700">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

export const LEC2_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  why: (
    <>
      <Para>
        Lecture 1 was about <em>solving</em> systems of equations. This one changes the question. Instead of asking
        which x makes Ax = b true, it asks what the whole <strong>set</strong> of answers looks like as an object in its
        own right.
      </Para>
      <Para>
        That sounds like a small shift. It is not. Watch what happens to the set of answers as you move the right-hand
        side.
      </Para>

      <Lab>
        <NullspaceSpaceLab />
      </Lab>

      <Para>
        When b is zero, adding two answers gives another answer — every time, whichever two you pick. When b is
        anything else, it does not. The first set has a structure the second one simply lacks.
      </Para>
      <Para>
        The lecture&rsquo;s word for that structure is a <strong>vector space</strong>: a place where adding two things
        and stretching one always lands you back inside. The next three parts pin down exactly what has to be promised
        for that to be true, and then everything after that is built on top of those promises.
      </Para>
      <Para>
        This is worth the effort for a practical reason. Once you know a set is a vector space, you get bases,
        dimension and coordinates for free — and those are the tools that make problems in a hundred dimensions
        tractable at all.
      </Para>

      <Terms
        items={[
          {
            term: 'vector space',
            def: 'A set where adding two members and scaling one always land you back inside, with the usual arithmetic rules holding.',
          },
          {
            term: 'nullspace',
            def: 'All the x with Ax = 0. Always a vector space, which is why it gets a name of its own.',
          },
          {
            term: 'homogeneous',
            say: 'ho-mo-JEE-nee-us',
            def: 'A system whose right-hand side is all zeros. The one case where the answers form a space.',
          },
          {
            term: 'structure',
            def: 'Here it means: which operations you may do without leaving the set. Nothing more mysterious than that.',
          },
        ]}
      />
      <Takeaway>
        The answers to Ax = 0 are closed under adding and stretching; the answers to Ax = b are not. That difference is
        what the rest of the lecture is about.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  groups: (
    <>
      <Para>
        Before defining a vector space, the lecture defines something smaller. A <strong>group</strong> is a set with
        one way of combining two of its members, and four promises about that combining.
      </Para>
      <Para>
        Write the operation as ⊗ — it might be addition, multiplication, or something with no name at all. Then (G, ⊗)
        is a group when:
      </Para>
      <List
        items={[
          <>
            <strong>Closure.</strong> Combine two members and you get a member. You never fall out of the set.
          </>,
          <>
            <strong>Associativity.</strong> (x ⊗ y) ⊗ z is the same as x ⊗ (y ⊗ z), so brackets do not matter.
          </>,
          <>
            <strong>An identity element.</strong> There is some e that does nothing: x ⊗ e = x for every x.
          </>,
          <>
            <strong>Inverses.</strong> Every x has a partner y with x ⊗ y = e. Everything can be undone.
          </>,
        ]}
      />
      <Para>
        If the order never matters either — x ⊗ y = y ⊗ x — the group is called <strong>Abelian</strong>, after Niels
        Abel.
      </Para>

      <Lab>
        <GroupCheckLab />
      </Lab>

      <Para>
        Press through the five and watch which promise does the failing. It is nearly always the last one. Closure,
        associativity and an identity come cheaply; being able to undo <em>everything</em> is the demanding
        requirement, and it is what the counting numbers and the whole numbers under multiplication both fall down on.
      </Para>
      <Para>
        Why bother with this at all? Because &ldquo;the vectors under addition form an Abelian group&rdquo; is one
        short sentence that carries five separate facts. The next part uses it exactly that way.
      </Para>

      <Worked title="Slide 4&rsquo;s three examples">
        {`(ℤ, +)      whole numbers under addition
            closure ✓  associativity ✓  identity 0 ✓  inverse −n ✓
            and n + m = m + n, so it is an ABELIAN GROUP

(ℕ₀, +)     0, 1, 2, 3, … under addition
            closure ✓  associativity ✓  identity 0 ✓
            inverse ✗  — nothing you can add to 3 gives 0
            NOT A GROUP

(ℤ, ·)      whole numbers under multiplication
            closure ✓  associativity ✓  identity 1 ✓
            inverse ✗  — 3 would need 1/3, which is not a whole number
            NOT A GROUP`}
      </Worked>

      <Terms
        items={[
          { term: 'group', def: 'A set with one operation obeying closure, associativity, an identity and inverses.' },
          { term: '⊗', say: 'the operation', def: 'A placeholder for whatever way of combining two members you are using.' },
          { term: 'closure', def: 'Combining two members always gives a member. You cannot fall out of the set.' },
          {
            term: 'identity element',
            def: 'The member that changes nothing. 0 for addition, 1 for multiplication, I for matrices.',
          },
          { term: 'inverse', def: 'The partner that undoes an element, taking it back to the identity.' },
          { term: 'Abelian', say: 'ah-BEE-lee-un', def: 'A group where the order of combining makes no difference.' },
        ]}
      />
      <Takeaway>
        Four promises: closure, associativity, an identity, and inverses. Abelian adds a fifth — order does not matter.
        The one that usually fails is inverses.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  spaces: (
    <>
      <Para>
        A vector space has <strong>two</strong> operations, not one. The lecture calls them the inner and the outer
        operation, and the names are worth keeping straight.
      </Para>
      <List
        items={[
          <>
            The <strong>inner</strong> operation is <span className="font-mono">+ : 𝒱 × 𝒱 → 𝒱</span>. It takes two
            vectors and gives a vector. Think of it as addition.
          </>,
          <>
            The <strong>outer</strong> operation is <span className="font-mono">· : ℝ × 𝒱 → 𝒱</span>. It takes a plain
            number and a vector and gives a vector. Think of it as scaling.
          </>,
        ]}
      />
      <Para>
        &ldquo;Outer&rdquo; because one of its two inputs comes from outside the set — a real number, not a vector.
        That asymmetry is the reason a vector space needs more than the group axioms from the last part.
      </Para>
      <Para>
        The demands are then short. <span className="font-mono">(𝒱, +)</span> has to be an{' '}
        <strong>Abelian group</strong> — which is the whole of the previous page in one clause — and the outer
        operation has to satisfy four more rules:
      </Para>

      <Lab>
        <VectorSpaceAxiomLab />
      </Lab>

      <Para>
        Every one of them holds for the same reason: the operations work one slot at a time, and ordinary numbers
        already obey these rules. The axioms are not new demands. They are the old rules written down carefully enough
        that they can be applied to things which are not numbers.
      </Para>
      <Para>
        Two pieces of vocabulary drop out. The members of 𝒱 are called <strong>vectors</strong>. The identity of{' '}
        <span className="font-mono">(𝒱, +)</span> — the thing that changes nothing when you add it — is the{' '}
        <strong>zero vector</strong>, written [0, 0, …, 0]ᵀ.
      </Para>

      <Worked title="The whole definition, slides 5 and 6">
        {`A real vector space is V = (𝒱, +, ·) with

    + : 𝒱 × 𝒱 → 𝒱        the inner operation
    · : ℝ × 𝒱 → 𝒱        the outer operation

such that (𝒱, +) is an Abelian group, and

    Distributivity      λ·(x + y) = λ·x + λ·y
                        (λ + ψ)·x = λ·x + ψ·x

    Associativity       λ·(ψ·x) = (λψ)·x
    (outer operation)

    Neutral element     1·x = x
    (outer operation)

for all λ, ψ ∈ ℝ and all x, y ∈ 𝒱.`}
      </Worked>

      <Terms
        items={[
          { term: 'inner operation', def: 'Adding two vectors. Both inputs come from inside the set.' },
          {
            term: 'outer operation',
            def: 'Multiplying a vector by a plain number. One input comes from outside — from ℝ.',
          },
          {
            term: 'distributivity',
            def: 'A multiplication spreads across a sum. Two versions here: over a sum of vectors, and over a sum of numbers.',
          },
          { term: 'zero vector', def: 'The identity for addition. Adding it changes nothing. Written 0 or [0, …, 0]ᵀ.' },
          {
            term: 'real vector space',
            def: 'One whose scalars are real numbers. You can use complex numbers instead, and much of the theory survives.',
          },
        ]}
      />
      <Takeaway>
        Two operations. Addition has to make an Abelian group; scaling has to distribute, associate, and leave things
        alone when you scale by 1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  examples: (
    <>
      <Para>
        Here is the payoff for defining things so carefully. The axioms say nothing about arrows, so anything obeying
        them is a vector space — and several families do that look nothing like arrows.
      </Para>
      <Para>
        The obvious one is <span className="font-mono">𝒱 = ℝⁿ</span>: columns of n real numbers, added slot by slot and
        scaled slot by slot. That is the case you already know.
      </Para>
      <Para>
        The lecture&rsquo;s second example is more interesting. Take{' '}
        <span className="font-mono">𝒱 = ℝ^(m×n)</span> — all matrices of one fixed shape. Add two of them slot by slot,
        multiply one by a number slot by slot, and every axiom holds. So a <strong>matrix is a vector</strong>, in the
        only sense that matters here.
      </Para>

      <Lab>
        <WhatIsAVectorLab />
      </Lab>

      <Para>
        The polynomial case is worth a second look, because it feels the strangest. 3x² + 2x + 1 is not an arrow and
        not a table. But it is completely described by its three coefficients, adding two polynomials adds those
        coefficients, and doubling one doubles them. It <em>is</em> a column of three numbers, wearing different
        clothes.
      </Para>
      <Para>
        And that is the point of the whole apparatus. Prove something about vector spaces once — that every one has a
        basis, that dimension is well defined — and it applies to columns, matrices, polynomials and functions at the
        same time, with no extra work.
      </Para>

      <Terms
        items={[
          { term: 'ℝ^(m×n)', say: 'R m by n', def: 'All matrices with m rows and n columns. A vector space in its own right.' },
          {
            term: 'closure',
            def: 'The property being demonstrated each time: the answer is always the same kind of thing you started with.',
          },
          {
            term: 'coefficients',
            def: 'The numbers in front. For a polynomial they are all you need — which is why polynomials behave like columns.',
          },
        ]}
      />
      <Takeaway>
        Matrices and polynomials are vectors too, because they obey the same axioms. Prove something once, use it
        everywhere.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  subspaces: (
    <>
      <Para>
        A <strong>subspace</strong> is a vector space living inside a bigger one. Take a vector space V, take a subset
        𝒰 of it that is not empty, and keep the same two operations. If 𝒰 is itself a vector space under them, it is a
        subspace, written <span className="font-mono">U ⊆ V</span>.
      </Para>
      <Para>
        The good news is that almost nothing needs checking. Associativity, distributivity, the zero vector — all of
        those hold for every x in V, so they certainly hold for the x in 𝒰. What you actually have to test is short:
      </Para>
      <List
        items={[
          <>
            𝒰 is <strong>not empty</strong>.
          </>,
          <>
            <strong>Closed under adding:</strong> if x and y are in 𝒰, so is x + y.
          </>,
          <>
            <strong>Closed under scaling:</strong> if x is in 𝒰 and λ is any real number, λx is in 𝒰.
          </>,
        ]}
      />

      <Lab>
        <SubspaceTestLab />
      </Lab>

      <Para>
        There is a shortcut buried in that list. If 𝒰 is closed under scaling and is not empty, take any member and
        scale it by 0 — you land on the zero vector, so <strong>every subspace contains 0</strong>. Turned round: if a
        set does not contain the zero vector, it cannot be a subspace, and you are finished in one line.
      </Para>
      <Para>
        That kills the shifted line <span className="font-mono">{'{x = 1}'}</span> immediately. It does{' '}
        <em>not</em> settle the square or the first quadrant, though — both contain the origin and both still fail. The
        zero test is a quick way to say no, never a way to say yes.
      </Para>
      <Para>
        The example the lecture is really interested in is the <strong>nullspace</strong>: all the x with Ax = 0. It is
        a subspace, and the reason is one line. If Ax = 0 and Ay = 0 then A(x + y) = Ax + Ay = 0, and A(λx) = λ(Ax) =
        0. Both closures come free from the way matrix multiplication behaves.
      </Para>

      <Worked title="The subsets on slides 11 and 12">
        {`𝒱 = ℝ²

the y-axis                        SUBSPACE
    sums of vectors on it stay on it; so do multiples

{x = 1}, the y-axis shifted       NOT a subspace
    scaling by 0 lands on the origin, which is not in the set

the square −1 ≤ x ≤ 1, −1 ≤ y ≤ 1  NOT a subspace
    contains 0, but stretch far enough and you leave

the nullspace of A, i.e. {x : Ax = 0}   SUBSPACE
    A(x + y) = Ax + Ay = 0
    A(λx)    = λ(Ax)   = 0`}
      </Worked>

      <Terms
        items={[
          { term: 'subspace', def: 'A subset that is itself a vector space under the same two operations. Written U ⊆ V.' },
          { term: '𝒰 ≠ Φ', say: 'U is not empty', def: 'The set has to have something in it. Φ is the empty set.' },
          {
            term: 'inherits',
            def: 'Rules like associativity hold for everything in V, so they automatically hold inside any subset. Nothing to check.',
          },
          {
            term: 'nullspace',
            def: 'All solutions of Ax = 0. The most important subspace in the course, and the reason for part 1.',
          },
        ]}
      />
      <Takeaway>
        Three things to check: not empty, closed under adding, closed under scaling. And if the zero vector is missing,
        stop — it is not a subspace.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  span: (
    <>
      <Para>
        You can stay inside a vector space by adding vectors and scaling them. The lecture now turns that round and
        asks a harder question: can you find a set of vectors from which <em>every</em> vector in the space can be
        built?
      </Para>
      <Para>
        Building means one thing only — a <strong>linear combination</strong>. Take some of this vector, some of that
        one, add them up:
      </Para>
      <Formula>v = λ₁x₁ + λ₂x₂ + ⋯ + λₖxₖ</Formula>
      <Para>
        There is nothing else available. No multiplying two vectors together, no squaring. That restraint is the whole
        of linear algebra, and it is what makes the questions answerable.
      </Para>

      <Lab>
        <SpanLab />
      </Lab>

      <Para>
        Everything reachable this way is called the <strong>span</strong> of the vectors. Two arrows pointing in
        genuinely different directions span the whole plane. Line them up and the span collapses to a single line —
        still a subspace, just a smaller one.
      </Para>
      <Para>
        That is worth noticing on its own: a span is <em>always</em> a subspace, whatever vectors you start from. It
        contains 0 (take all the λ zero), and adding or scaling combinations gives more combinations. So spans are a
        way of manufacturing subspaces to order.
      </Para>
      <Para>
        One more thing before the next part. The zero vector is <em>always</em> a linear combination of any set — just
        take every λ to be zero. That is called the <strong>trivial</strong> combination, it works for absolutely
        anything, and it tells you nothing. The interesting question is whether there is any <em>other</em> way to
        reach zero.
      </Para>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'λ₁x₁ + ⋯ + λₖxₖ. Some of each vector, added up. The only expression the subject allows.',
          },
          { term: 'span', def: 'Everything reachable by linear combinations of a set. Always a subspace.' },
          { term: 'generating set', def: 'A set whose span is the whole space. It can reach everything.' },
          {
            term: 'trivial combination',
            def: 'All the coefficients zero. Always gives the zero vector, for any vectors at all, so it proves nothing.',
          },
        ]}
      />
      <Takeaway>
        A linear combination is the only way to build new vectors. Everything you can reach is the span, and a span is
        always a subspace.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  independence: (
    <>
      <Para>
        Now the central definition of the lecture. Take vectors x₁ … xₖ and write down
      </Para>
      <Formula>λ₁x₁ + λ₂x₂ + ⋯ + λₖxₖ = 0</Formula>
      <Para>
        Setting every λ to zero always works. The question is whether there is any <strong>other</strong> way.
      </Para>
      <List
        items={[
          <>
            If some choice works with <strong>at least one λ not zero</strong>, the vectors are{' '}
            <strong>linearly dependent</strong>.
          </>,
          <>
            If the all-zeros choice is the <strong>only</strong> one, they are <strong>linearly independent</strong>.
          </>,
        ]}
      />

      <Lab>
        <DependenceFactsLab />
      </Lab>

      <Para>
        Slide 16 says what the definition is really capturing. If the vectors are dependent, you can rearrange the
        equation and write one of them in terms of the others — so that one is <strong>redundant</strong>. If they are
        independent, each one brings something the rest collectively cannot supply.
      </Para>
      <Para>Three facts follow, and slide 17 sets them out:</Para>
      <List
        items={[
          <>
            Any set is either independent or dependent. There is <strong>no third option</strong>.
          </>,
          <>
            If any vector in the set is the <strong>zero vector</strong>, the set is dependent — whatever the others
            are. Take λ = 1 for the zero vector and λ = 0 for everything else.
          </>,
          <>
            If all the vectors are non-zero, the set is dependent <strong>exactly when</strong> one of them is a linear
            combination of the others.
          </>,
        ]}
      />
      <Para>
        That last one needs the &ldquo;all non-zero&rdquo; condition. It is the awkwardness of the zero-vector case
        that makes the official definition worth its odd phrasing: &ldquo;the only combination giving 0 is the trivial
        one&rdquo; keeps working in every case, and it is a single homogeneous system, which is something you already
        know how to solve.
      </Para>

      <Terms
        items={[
          {
            term: 'linearly independent',
            def: 'The only combination reaching 0 is the all-zeros one. Every vector is pulling its weight.',
          },
          {
            term: 'linearly dependent',
            def: 'Some combination reaches 0 without all the coefficients being zero. One vector is redundant.',
          },
          { term: 'non-trivial', def: 'A choice of coefficients where at least one is not zero.' },
          {
            term: 'redundant',
            def: 'Can be built from the others, so removing it does not shrink the span.',
          },
        ]}
      />
      <Takeaway>
        Independent means the only way to reach 0 is to take none of anything. Dependent means one vector repeats what
        the others already say — and a zero vector always makes a set dependent.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  pivots: (
    <>
      <Para>
        The definition is a test you cannot run by eye past two or three dimensions. Slide 18 gives the practical
        version, and it is one you have already met in Lecture 0b:
      </Para>
      <List
        items={[
          <>Put the vectors in as the <strong>columns</strong> of a matrix.</>,
          <>Row-reduce to echelon form.</>,
          <>
            The <strong>pivot columns</strong> mark the independent vectors, and they are always the leftmost ones.
          </>,
          <>Every non-pivot column is a combination of the pivot columns to its left.</>,
        ]}
      />
      <Para>
        The lecture works two examples. The first is the 2 × 3 matrix{' '}
        <span className="font-mono">[1 2 3; 2 4 4]</span>, which reduces to{' '}
        <span className="font-mono">[1 2 3; 0 0 −2]</span> — pivots in columns 1 and 3, so column 2 is redundant, and
        indeed it is twice column 1.
      </Para>
      <Para>
        The second is three vectors with four components each. And here something worth pausing on happens: this deck
        and Lecture 0b give <em>different</em> answers for the echelon form of the same matrix.
      </Para>

      <Lab>
        <EchelonRoutesLab />
      </Lab>

      <Para>
        Neither is wrong. A matrix has many row echelon forms — one for every route you could take — and the two decks
        simply made different choices about when to divide a row through. What they agree on is the only thing that
        matters: <strong>which columns carry pivots</strong>. Three pivots for three columns, so the vectors are
        independent, either way.
      </Para>
      <Para>
        The reduced row echelon form <em>is</em> unique, which is why it is the safer thing to compare against when you
        are checking your working.
      </Para>

      <Worked title="Slides 19 to 21">
        {`⎡ 1  2  3 ⎤   →   ⎡ 1  2   3 ⎤
⎣ 2  4  4 ⎦       ⎣ 0  0  −2 ⎦

pivots in columns 1 and 3
column 2 is a non-pivot column, and column 2 = 2 × column 1


x₁ = (1, 2, −3, 4)ᵀ    x₂ = (1, 1, 0, 2)ᵀ    x₃ = (−1, −2, 1, 1)ᵀ

⎡  1  1  −1 ⎤        ⎡ 1  1  −1 ⎤
⎢  2  1  −2 ⎥   →    ⎢ 0  1   0 ⎥
⎢ −3  0   1 ⎥        ⎢ 0  0   1 ⎥
⎣  4  2   1 ⎦        ⎣ 0  0   0 ⎦

all three columns are pivot columns
→ x₁, x₂, x₃ are linearly independent`}
      </Worked>

      <Terms
        items={[
          { term: 'pivot column', def: 'A column containing a leading entry once the matrix is in staircase form.' },
          {
            term: 'row echelon form',
            def: 'A staircase. There are many for one matrix — which route you take decides which one you get.',
          },
          {
            term: 'reduced row echelon form',
            def: 'The tidiest staircase, with 1s at the pivots and zeros above them too. Unique for a given matrix.',
          },
        ]}
      />
      <Takeaway>
        Vectors as columns, row-reduce, count pivot columns. Different routes give different staircases but always the
        same pivot columns — judge your working by those.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  coords: (
    <>
      <Para>
        Slides 22 to 25 answer a question that sounds fussy and turns out to be the key to everything that follows.
      </Para>
      <Para>
        Suppose you already have k vectors b₁ … bₖ that you know are independent. Now you build m new vectors x₁ … xₘ,
        each one a linear combination of the b&rsquo;s. When are the <em>new</em> ones independent?
      </Para>
      <Para>
        The answer is remarkably clean: <strong>exactly when their coefficient columns are independent.</strong>{' '}
        You
        never have to look at the b&rsquo;s again.
      </Para>

      <Lab>
        <CoordinateLab />
      </Lab>

      <Para>
        The argument is three lines and worth following once, because the same move gets used repeatedly later. Collect
        the b&rsquo;s as the columns of a matrix B, so each xⱼ is just Bλⱼ where λⱼ is its column of coefficients. Then
        testing the x&rsquo;s for independence turns into
      </Para>
      <Formula>Σⱼ ψⱼ xⱼ = Σⱼ ψⱼ Bλⱼ = B ( Σⱼ ψⱼ λⱼ ) = 0</Formula>
      <Para>
        Now use what you were given. The b&rsquo;s are independent, so the only combination of B&rsquo;s columns that
        reaches zero is the all-zeros one. That forces{' '}
        <span className="font-mono">Σⱼ ψⱼ λⱼ = 0</span> — and that is precisely the test for the λ&rsquo;s being
        independent. Same ψ&rsquo;s, same answer, two different questions that turn out to be one.
      </Para>
      <Para>
        The practical upshot is the idea of <strong>coordinates</strong>. Once you have fixed an independent set to
        build from, every vector is just its column of coefficients, and every question about the vectors becomes a
        question about columns of numbers. That is how a space of polynomials, or of matrices, gets handled by exactly
        the same row reduction as ℝⁿ.
      </Para>

      <Terms
        items={[
          {
            term: 'coordinates',
            def: 'The coefficients λ that build a vector out of a fixed independent set. Once chosen, they stand in for the vector completely.',
          },
          {
            term: 'B = [b₁ … bₖ]',
            def: 'The b vectors written as the columns of one matrix, so xⱼ = Bλⱼ is a single matrix product.',
          },
          {
            term: 'if and only if',
            def: 'Both directions hold. Independent λ’s give independent x’s, and dependent λ’s give dependent x’s.',
          },
        ]}
      />
      <Takeaway>
        Build new vectors from an independent set, and the new ones are independent exactly when their coefficient
        columns are. From then on you work with columns of numbers, whatever the vectors really are.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  worked: (
    <>
      <Para>
        Slides 26 to 29 run the previous part on real numbers. Four vectors are given, each built out of four
        independent b&rsquo;s, and the question is whether the four are independent.
      </Para>
      <Para>
        By the result you have just seen, you do not need to know what b₁, b₂, b₃ and b₄ are. Collect the coefficients
        into columns, reduce, and read the answer off.
      </Para>

      <Lab>
        <FourXLab />
      </Lab>

      <Para>
        The reduced form has pivots in columns 1, 2 and 3, and none in column 4. So column 4 is a combination of the
        other three, and rearranging gives a combination reaching zero with coefficients that are not all zero:
      </Para>
      <Formula>7x₁ + 15x₂ + 18x₃ + x₄ = 0</Formula>
      <Para>
        That settles it — the four vectors are <strong>not</strong>{' '}
        linearly independent, which is slide 29&rsquo;s
        conclusion.
      </Para>
      <Para>
        The lab lets you check it rather than take it on trust. Load those four multipliers and every b-coefficient
        cancels to zero on its own. Notice what the check never needed: any information at all about what the four
        b vectors actually are.
      </Para>

      <Worked title="Slides 26 to 29, and the check">
        {`x₁ =   b₁ −  2b₂ +   b₃ −  b₄
x₂ = −4b₁ −  2b₂        + 4b₄
x₃ =  2b₁ +  3b₂ −   b₃ − 3b₄
x₄ = 17b₁ − 10b₂ + 11b₃ +  b₄

coefficients as columns:

     ⎡  1  −4   2   17 ⎤          ⎡ 1  0  0   −7 ⎤
 A = ⎢ −2  −2   3  −10 ⎥   →  B = ⎢ 0  1  0  −15 ⎥
     ⎢  1   0  −1   11 ⎥          ⎢ 0  0  1  −18 ⎥
     ⎣ −1   4  −3    1 ⎦          ⎣ 0  0  0    0 ⎦

column 4 = −7(col 1) − 15(col 2) − 18(col 3)

    ⇒  7x₁ + 15x₂ + 18x₃ + x₄ = 0

check it on the b's, one coefficient at a time:

    b₁:   7(1)  + 15(−4)  + 18(2)  + 17  =  7 − 60 + 36 + 17 = 0  ✓
    b₂:   7(−2) + 15(−2)  + 18(3)  − 10  = −14 − 30 + 54 − 10 = 0  ✓
    b₃:   7(1)  + 15(0)   + 18(−1) + 11  =  7 + 0 − 18 + 11  = 0  ✓
    b₄:   7(−1) + 15(4)   + 18(−3) + 1   = −7 + 60 − 54 + 1  = 0  ✓`}
      </Worked>

      <Takeaway>
        Reduce the coefficient columns. A column without a pivot hands you the combination that reaches zero, and that
        combination can be checked on the coefficients alone.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  counting: (
    <>
      <Para>
        Slides 30 and 31 pull one general fact out of that example, and it is the most quotable sentence in the
        lecture.
      </Para>
      <Para>
        You had k independent vectors b₁ … bₖ, and you built m new vectors from them. Testing the new ones meant
        reducing a <strong>k × m</strong> matrix of coefficients — k rows, m columns.
      </Para>
      <Para>
        Now count. A matrix with k rows can have at most k pivots, because each pivot needs a row of its own. So if{' '}
        <strong>m &gt; k</strong> there are more columns than there can ever be pivots, and at least one column must go
        without.
      </Para>

      <Lab>
        <MoreThanKLab />
      </Lab>

      <Para>
        A column without a pivot is a column built from the ones to its left, which is a non-trivial combination
        reaching zero. So the m vectors are dependent — and you knew it from the shape alone, before looking at a
        single number.
      </Para>
      <Para>
        Said plainly: <strong>you cannot have more independent vectors than the number of things you built them
        from.</strong> Seven vectors made out of four ingredients are always dependent.
      </Para>
      <Para>
        The rule from Lecture 0b — more vectors than components is always dependent — is the same argument. ℝⁿ is built
        from n ingredients, so more than n vectors in it must be dependent. Same counting, different clothes.
      </Para>

      <Terms
        items={[
          {
            term: 'at most k pivots',
            def: 'Each pivot sits in its own row, so a matrix with k rows can never have more than k of them.',
          },
          {
            term: 'guaranteed',
            def: 'Decided by the shape alone. You do not have to look at the numbers to know the answer.',
          },
          {
            term: 'dimension',
            def: 'Coming in three parts’ time. This counting argument is what makes it a well-defined number.',
          },
        ]}
      />
      <Takeaway>
        More vectors than ingredients means dependent, always. It is a counting argument about pivots, and it needs no
        arithmetic at all.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  basis: (
    <>
      <Para>
        Everything so far has been building to this. A <strong>generating set</strong> is a set of vectors whose span
        is the whole space — it can reach everything. A <strong>basis</strong> is a generating set with nothing
        redundant in it.
      </Para>
      <Para>
        Slide 34 says the same thing more carefully: a generating set is <strong>minimal</strong> if no smaller set
        inside it also spans. Every linearly independent generating set is minimal, and that is what gets called a
        basis.
      </Para>

      <Lab>
        <BasisLab />
      </Lab>

      <Para>
        So a basis does two jobs at once, and both are needed. Big enough to reach everything; small enough that
        nothing repeats. Drop either half and it stops being a basis — the two failing presets above show each way
        round.
      </Para>
      <Para>Slide 35 gives four descriptions that all mean the same thing:</Para>
      <List
        items={[
          <>ℬ is a basis of V.</>,
          <>ℬ is a minimal generating set.</>,
          <>
            ℬ is a <strong>maximal</strong> independent set — add any vector at all and it becomes dependent.
          </>,
          <>
            Every x in V is a combination of vectors from ℬ, and that combination is <strong>unique</strong>.
          </>,
        ]}
      />
      <Para>
        The last one is the one you will use most. Uniqueness is what makes coordinates meaningful: fix a basis and
        every vector has exactly one list of coefficients, so the list can stand in for the vector without ambiguity.
      </Para>
      <Para>
        Now the fact that surprises people. A basis is <strong>not unique</strong>. Slide 36 gives three completely
        different bases of ℝ³ — the canonical one, a triangular one, and one with decimals in it — and every one is
        perfectly good. Press through them above.
      </Para>
      <Para>
        And being independent is not enough on its own. Slide 37 offers three independent vectors in ℝ⁴ and asks why
        they are not a basis. The answer is that there are only three of them, and ℝ⁴ needs four — they are a perfectly
        good basis of the three-dimensional subspace they span, and no basis at all of ℝ⁴.
      </Para>

      <Terms
        items={[
          { term: 'generating set', def: 'Its span is the whole space. It can reach everything.' },
          { term: 'span[𝒜]', say: 'span of A', def: 'All linear combinations of the vectors in 𝒜.' },
          { term: 'basis', def: 'A generating set that is also independent. Reaches everything, repeats nothing.' },
          { term: 'minimal', def: 'No smaller subset of it still spans the space.' },
          {
            term: 'maximal independent set',
            def: 'Independent, and adding any other vector of the space would break that.',
          },
          {
            term: 'unique combination',
            def: 'Each vector is built from the basis in exactly one way. This is what makes coordinates well defined.',
          },
        ]}
      />
      <Takeaway>
        A basis reaches everything and repeats nothing. There are many bases for one space, but each gives every vector
        exactly one set of coordinates.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  dimension: (
    <>
      <Para>
        A space has many bases, but they all turn out to be the <strong>same size</strong>. That shared size is called
        the <strong>dimension</strong> of the space, written dim(V).
      </Para>
      <Para>
        This lecture only deals with spaces where that size is finite. Some vector spaces — the space of all
        polynomials, for instance — need infinitely many basis vectors, and those are left for another course.
      </Para>

      <Lab>
        <DimensionLab />
      </Lab>

      <Para>
        Slide 39 is the trap. Is the dimension just the number of components in each vector? So far it has looked that
        way, because ℝ² kept having dimension 2. But consider the space spanned by the single vector (0, 1). Every
        vector in it is written with <strong>two</strong> numbers, and yet the basis has only <strong>one</strong>{' '}
        vector in it, so the dimension is 1.
      </Para>
      <Para>
        Those are two different questions. How many numbers it takes to <em>write</em> a vector down depends on the
        space it is sitting inside. How many basis vectors are needed depends on the space itself.
      </Para>
      <Para>Two consequences fall out of slide 38, and both are useful:</Para>
      <List
        items={[
          <>
            If U ⊆ V then <strong>dim(U) ≤ dim(V)</strong>. A subspace can never be roomier than what contains it.
          </>,
          <>
            <strong>dim(U) = dim(V) exactly when U = V.</strong> A proper subspace is always strictly smaller. So if
            you have a subspace of ℝ³ and you show its dimension is 3, you have shown it is all of ℝ³ — no further work
            needed.
          </>,
        ]}
      />

      <Terms
        items={[
          { term: 'dimension', def: 'The number of vectors in a basis. Every basis of a given space has the same size.' },
          {
            term: 'finite-dimensional',
            def: 'A finite basis exists. Everything in this lecture is of this kind.',
          },
          {
            term: 'proper subspace',
            def: 'A subspace that is not the whole space. Its dimension is always strictly smaller.',
          },
        ]}
      />
      <Takeaway>
        Dimension is the size of a basis, not the number of components. A line inside ℝ³ has dimension 1, and its
        vectors still take three numbers to write down.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  findbasis: (
    <>
      <Para>
        Slide 40 turns everything into a three-step recipe. Given a subspace{' '}
        <span className="font-mono">U = span(x₁, …, xₘ) ⊆ ℝⁿ</span>, a basis of U is found by:
      </Para>
      <List
        items={[
          <>Writing the spanning vectors as the <strong>columns</strong> of a matrix A.</>,
          <>Finding the <strong>row echelon form</strong> of A.</>,
          <>
            Taking the spanning vectors that sit at <strong>pivot columns</strong>. Those are a basis of U.
          </>,
        ]}
      />
      <Para>
        The vectors at non-pivot columns are combinations of the pivot ones, so throwing them away loses nothing — the
        span is unchanged and what is left is independent, which is exactly what a basis needs.
      </Para>
      <Para>Slide 41 sets this going on four vectors in ℝ⁵. Step through it:</Para>

      <Lab>
        <FindBasisLab />
      </Lab>

      <Para>
        Pivots land in columns 1, 2 and 4. Column 3 has none, so <strong>the four vectors are not a basis</strong> —
        they span U perfectly well, but they are not independent. A basis of U is {'{'}x₁, x₂, x₄{'}'}, and dim U = 3.
      </Para>
      <Para>
        And the redundant one can be written out: <strong>x₃ = 2x₂ − x₁</strong>. That is a claim you can check in a
        single line, which matters here, because the deck poses this example on its final slide and then stops. There
        is no printed answer to compare against.
      </Para>

      <Worked title="Slide 41, worked out — and checked">
        {`x₁ = (1, 2, −1, −1, −1)ᵀ    x₂ = (2, −1, 1, 2, −2)ᵀ
x₃ = (3, −4, 3, 5, −3)ᵀ     x₄ = (−1, 8, −5, −6, 1)ᵀ

as columns:              row-reduce:

⎡  1   2   3  −1 ⎤       ⎡ 1  0  −1  0 ⎤
⎢  2  −1  −4   8 ⎥       ⎢ 0  1   2  0 ⎥
⎢ −1   1   3  −5 ⎥   →   ⎢ 0  0   0  1 ⎥
⎢ −1   2   5  −6 ⎥       ⎢ 0  0   0  0 ⎥
⎣ −1  −2  −3   1 ⎦       ⎣ 0  0   0  0 ⎦

pivots in columns 1, 2 and 4;  column 3 has none

    ⇒ the four vectors are NOT independent, so NOT a basis
    ⇒ {x₁, x₂, x₄} is a basis of U
    ⇒ dim U = 3

the reduced form also says   column 3 = −1(col 1) + 2(col 2)

    so    x₃ = 2x₂ − x₁

CHECK, component by component:

    2x₂ − x₁ = 2(2, −1, 1, 2, −2) − (1, 2, −1, −1, −1)
             = (4, −2, 2, 4, −4) − (1, 2, −1, −1, −1)
             = (3, −4, 3, 5, −3)
             = x₃    ✓`}
      </Worked>

      <Para>
        The deck ends there, without giving the answer, so nothing above was copied from it. The reduction is done live
        by the same exact-fraction code that runs everywhere else on this site, and the relation it produced was then
        checked by substituting back — the five components agree exactly.
      </Para>

      <Takeaway>
        Spanning vectors as columns, row-reduce, keep the ones at pivot columns. Here that leaves three of the four,
        so dim U = 3 and x₃ = 2x₂ − x₁ was the one carrying nothing.
      </Takeaway>
    </>
  ),
}
