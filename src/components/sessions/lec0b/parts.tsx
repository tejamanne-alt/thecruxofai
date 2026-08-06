/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { AngleLab, DotProductLab, NormLab, OrthogonalSolveLab, ProjectionLab } from '@/components/charts/inner-product-lab'
import { CovarianceLab, ExpectationLab, VarianceLab } from '@/components/charts/moments-lab'
import { AxiomsLab, EventsAlgebraLab, PmfPdfLab, RandomVarLab } from '@/components/charts/prob-basics-lab'
import {
  BigCheckLab,
  CombinationLab,
  IndependenceLab,
  ParallelogramLab,
  PivotColumnsLab,
  RankVectorsLab,
  VectorBasicsLab,
} from '@/components/charts/vector-space-lab'
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

export const LEC0B_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  vector: (
    <>
      <Para>
        Lecture 0a was about boxes of numbers. This one is about the rows and columns inside them, taken seriously in
        their own right.
      </Para>
      <Para>
        A <strong>vector</strong> is a list of n ordinary numbers. The lecture writes a point of ℝⁿ as{' '}
        <span className="font-mono">(x₁, …, xₙ)</span>, and says you may stand it up as a column or lay it flat as a
        row — the same list either way.
      </Para>
      <Para>Only two things are allowed to happen to vectors, and both work one slot at a time:</Para>
      <List
        items={[
          <>
            <strong>Add</strong>{' '}two vectors of the same length: add the first parts, add the second parts, and so on.
          </>,
          <>
            <strong>Multiply by a plain number</strong>{' '}λ: every part gets multiplied by λ.
          </>,
        ]}
      />

      <Lab>
        <VectorBasicsLab />
      </Lab>

      <Para>
        Notice what you could not do in that lab: you could not land anywhere that was not an arrow. Add two arrows and
        you get an arrow. Stretch one and you still have an arrow. You never leave the family, however hard you try.
      </Para>
      <Para>
        That is worth a name. It is called <strong>closure</strong>, and a family of things with it is a{' '}
        <strong>vector space</strong>. And plenty of things that look nothing like arrows pass the same test — lists of
        a million numbers, polynomials, even functions. Everything in this lecture applies to all of them, which is the
        whole reason for setting it up this way.
      </Para>

      <Worked title="How the slide writes it">
        {`a point of ℝⁿ:      (x₁, x₂, …, xₙ)

as a column:        [x₁, …, xₙ]ᵀ        as a row:  [x₁, …, xₙ]

adding:             x + y = (x₁ + y₁, x₂ + y₂, …, xₙ + yₙ)

stretching:         λx = (λx₁, λx₂, …, λxₙ)     for any real λ`}
      </Worked>

      <Terms
        items={[
          { term: 'vector', def: 'A list of numbers. Add two of the same length, or multiply one by a plain number.' },
          { term: 'ℝⁿ', say: 'R n', def: 'All the lists of n ordinary numbers. ℝ² is a flat page, ℝ³ is the room you are in.' },
          { term: 'scalar', def: 'A plain single number, used to stretch a vector. It scales things, hence the name.' },
          { term: 'n-tuple', say: 'n-TUP-ul', def: 'A list of n things in a fixed order. Order matters: (1, 2) is not (2, 1).' },
          { term: 'zero vector', def: 'All parts zero. Adding it changes nothing, and it turns up constantly in the next few parts.' },
        ]}
      />
      <Takeaway>
        A vector is a list of numbers with exactly two operations: add two of them, or stretch one. Neither ever takes
        you outside the family.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  combination: (
    <>
      <Para>
        Put the two operations together and you get the single most important expression in the subject. Take some of
        one vector, some of another, add them up. That is a <strong>linear combination</strong>:
      </Para>
      <Formula>c₁v₁ + c₂v₂ + ⋯ + cₘvₘ</Formula>
      <Para>
        The c&rsquo;s are just plain numbers, and they can be anything at all — positive, negative, fractions, zero.
      </Para>

      <Lab>
        <CombinationLab />
      </Lab>

      <Para>
        With those two particular vectors you can reach every point on the page. Press anywhere and the two amounts
        adjust to get you there. That will not always be true — the next part is about when it fails — but when it does
        hold, the vectors are said to <strong>span</strong>{' '}the space.
      </Para>
      <Para>
        Why this expression and no other? Because it is the only thing you can build out of the two allowed operations.
        There is no multiplying two vectors together, no squaring one. Linear algebra is what you get when you restrict
        yourself to adding and stretching — and that restriction is exactly what makes everything solvable.
      </Para>

      <Worked title="Slide 3&rsquo;s example">
        {`v₁ = [1, 3]ᵀ        v₂ = [1, 0]ᵀ

2[1, 3]ᵀ + 3[1, 0]ᵀ = [2, 6]ᵀ + [3, 0]ᵀ = [5, 6]ᵀ

Two lots of the first, three lots of the second.
The amounts 2 and 3 are the whole answer.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'Some of one vector plus some of another. The only expression you can build from adding and stretching.',
          },
          { term: 'coefficient', def: 'One of the plain numbers c₁, c₂, … saying how much of each vector to take.' },
          {
            term: 'span',
            def: 'Everything you can reach by mixing a set of vectors. For the two above, the span is the whole plane.',
          },
        ]}
      />
      <Takeaway>
        A linear combination is c₁v₁ + ⋯ + cₘvₘ. It is the only thing adding and stretching lets you build, and the
        rest of the lecture is about which points you can reach with it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  independence: (
    <>
      <Para>
        Here is the question this part answers: is every vector in your collection pulling its weight, or is one of them
        just repeating what the others already said?
      </Para>
      <Para>The lecture asks it in a slightly sideways form. Write down</Para>
      <Formula>c₁v₁ + c₂v₂ + ⋯ + cₘvₘ = 0</Formula>
      <Para>
        Setting every c to zero obviously works. That answer is free and tells you nothing. The real question is
        whether there is <strong>any other way</strong>{' '}to hit zero.
      </Para>
      <List
        items={[
          <>
            If the all-zeros choice is the <strong>only</strong> one, the vectors are{' '}
            <strong>linearly independent</strong>.
          </>,
          <>
            If some other choice works — where at least one c is not zero — they are{' '}
            <strong>linearly dependent</strong>.
          </>,
        ]}
      />

      <Lab>
        <IndependenceLab />
      </Lab>

      <Para>
        Watch the shading while you drag. Two independent arrows reach the whole plane. The moment one lies along the
        other, everything collapses onto a single line — the second arrow has stopped adding anywhere new to go.
      </Para>
      <Para>
        Slide 5 spells out what dependence really means. If some cⱼ is not zero, you can divide by it and rearrange, and
        out comes vⱼ written in terms of all the others. So &ldquo;dependent&rdquo; is not an abstract condition: it
        means one of your vectors is literally a mixture of the rest, and you could delete it without losing anything.
      </Para>

      <Worked title="Slide 5, rearranged">
        {`Suppose c₁v₁ + ⋯ + cₘvₘ = 0 with some cⱼ ≠ 0.

Move every other term across:

    cⱼvⱼ = −c₁v₁ − ⋯ (all the terms except the jth)

Divide by cⱼ, which is allowed because it is not zero:

           n
    vⱼ =   Σ    (−cᵢ / cⱼ) vᵢ
        i=1, i≠j

So vⱼ is a linear combination of the others. It was never
adding anything new.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'linearly independent',
            def: 'The only way to mix them down to zero is to take none of any of them. Every vector adds something.',
          },
          {
            term: 'linearly dependent',
            def: 'There is a mixture that hits zero without all the amounts being zero. One vector repeats the others.',
          },
          { term: 'trivial solution', def: 'The all-zeros choice of coefficients. Always works, never informative.' },
          {
            term: 'span',
            def: 'Everything the set can reach. Adding a dependent vector never makes the span any bigger.',
          },
        ]}
      />
      <Takeaway>
        Independent means the only way to mix down to zero is to take none of anything. Dependent means one vector is
        a mixture of the others and could be deleted.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  examples: (
    <>
      <Para>
        Slides 6 and 7 do three small cases by hand. They are worth walking through, because the method for the third
        one is the method you will use on everything.
      </Para>

      <Worked title="Ex.1 — three vectors in the plane">
        {`[1, 3]ᵀ,  [1, 0]ᵀ,  [5, 6]ᵀ

Notice:  2[1, 3]ᵀ + 3[1, 0]ᵀ = [5, 6]ᵀ

Move everything to one side:

    2[1, 3]ᵀ + 3[1, 0]ᵀ − 1[5, 6]ᵀ = [0, 0]ᵀ

The amounts are 2, 3 and −1 — not all zero. So the three
vectors form a linearly DEPENDENT set.`}
      </Worked>

      <Worked title="Ex.2 — the same first two, on their own">
        {`[1, 3]ᵀ,  [1, 0]ᵀ

Set   a[1, 3]ᵀ + b[1, 0]ᵀ = [0, 0]ᵀ

Work out the left side:   [a + b,  3a]ᵀ = [0, 0]ᵀ

Match the parts:   3a = 0   ⇒  a = 0
                   a + b = 0 ⇒  b = 0

Only the all-zeros choice works, so these two are
linearly INDEPENDENT.`}
      </Worked>

      <Para>
        Those two examples together make an important point. The same two vectors were part of a dependent set and, on
        their own, independent. Dependence is a property of the <em>collection</em>, not of any one vector in it.
      </Para>
      <Para>Now the third, which the slide draws:</Para>

      <Lab>
        <ParallelogramLab />
      </Lab>

      <Para>
        The picture is the argument. (1, 2) and (5, 1) build a parallelogram, and its far corner is (6, 3) — the third
        vector, arrived at for free. Once you can see that, you do not need any algebra to know the set is dependent.
      </Para>
      <Para>
        This works beautifully in two dimensions and is useless in ten. The next three parts are about what to do
        instead.
      </Para>

      <Terms
        items={[
          {
            term: 'matching the parts',
            def: 'Two vectors are equal only when every matching pair of numbers agrees. That turns one vector equation into several ordinary ones.',
          },
          {
            term: 'parallelogram rule',
            def: 'Adding two vectors puts you at the far corner of the parallelogram they make.',
          },
        ]}
      />
      <Takeaway>
        Dependence belongs to the collection, not to a single vector. The same two vectors can be independent alone and
        part of a dependent set once a third arrives.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  rank: (
    <>
      <Para>
        Drawing arrows stops working the moment you have four numbers in each vector. Slide 8 gives the replacement,
        and it is something you already met in Lecture 0a: <strong>rank</strong>.
      </Para>
      <Para>Take p vectors, each with n components. Lay them out as the rows of a matrix and work out its rank.</Para>
      <List
        items={[
          <>
            rank = p → the vectors are <strong>independent</strong>. Every row survived the tidying up.
          </>,
          <>
            rank &lt; p → they are <strong>dependent</strong>. Some row collapsed to zeros, which means it was a mixture
            of the others.
          </>,
        ]}
      />

      <Lab>
        <RankVectorsLab />
      </Lab>

      <Para>
        The slide adds two things worth having. First, <span className="font-mono">rank(A) = rank(Aᵀ)</span>, so the
        largest number of independent rows always equals the largest number of independent columns. It makes no
        difference whether you lay your vectors out as rows or as columns — you get the same count.
      </Para>
      <Para>
        Second, and this one saves real time in an exam: if <strong>n &lt; p</strong>{' '}— more vectors than components —
        they <em>must</em>{' '}be dependent. No arithmetic needed. Three vectors in ℝ² are always dependent. Five in ℝ⁴ are
        always dependent. There simply are not that many independent directions to go round.
      </Para>

      <Worked title="Slide 8, in short">
        {`p vectors, each with n components.

Put them in a matrix as rows.  Then:

    rank = p   →  linearly independent
    rank < p   →  linearly dependent

Also:
    rank(A) = rank(Aᵀ) = r      rows and columns agree
    n < p    →  always dependent, no working needed`}
      </Worked>

      <Terms
        items={[
          { term: 'rank', def: 'How many non-zero rows are left after tidying into echelon form. A count of genuinely different rows.' },
          {
            term: 'full rank',
            def: 'The rank is the biggest it could be — min(rows, columns). For a set of vectors it means all of them are independent.',
          },
          {
            term: 'dimension',
            def: 'How many independent directions a space has. ℝⁿ has n, which is why more than n vectors in it must be dependent.',
          },
        ]}
      />
      <Takeaway>
        Lay p vectors out as rows and take the rank. rank = p means independent; rank &lt; p means dependent. And more
        vectors than components is always dependent, with no working at all.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  pivots: (
    <>
      <Para>
        Slide 9 gives a version of the same test that tells you more. Instead of rows, stand the vectors up as the{' '}
        <strong>columns</strong>{' '}of a matrix and row-reduce it. Then:
      </Para>
      <List
        items={[
          <>
            The columns that end up carrying a <strong>pivot</strong>{' '}are the independent ones — and they are always the
            leftmost ones.
          </>,
          <>
            Every other column is a <strong>mixture of the pivot columns to its left</strong>, and the tidied matrix
            tells you the exact amounts.
          </>,
        ]}
      />
      <Para>
        That second point is the extra. Rank tells you <em>how many</em>{' '}vectors are genuinely different. Pivot columns
        tell you <em>which</em>{' '}ones, and what the redundant ones are made of.
      </Para>

      <Lab>
        <PivotColumnsLab />
      </Lab>

      <Para>
        Slide 10&rsquo;s example is loaded first. The matrix is 2 × 3, the tidied form has pivots in columns 1 and 3,
        and column 2 is left over. And sure enough column 2 is exactly twice column 1 — which the read-out prints for
        you rather than asking you to spot it.
      </Para>

      <Worked title="Slide 10, in full">
        {`⎡ 1  2  3 ⎤        row-reduce        ⎡ 1  2   3 ⎤
⎣ 2  4  4 ⎦    ──────────────►    ⎣ 0  0  −2 ⎦

Pivots sit in columns 1 and 3.
Column 2 has no pivot.

And indeed:   column 2 = 2 × column 1
              (2, 4)ᵀ = 2 (1, 2)ᵀ

So the three columns are dependent, and any two of them —
specifically columns 1 and 3 — form an independent set.`}
      </Worked>

      <Terms
        items={[
          { term: 'pivot', def: 'The first non-zero entry of a row once the matrix is in staircase form.' },
          { term: 'pivot column', def: 'A column that contains a pivot. These are the independent vectors.' },
          {
            term: 'free column',
            def: 'A column with no pivot. That vector is a mixture of the pivot columns to its left, and adds nothing.',
          },
        ]}
      />
      <Takeaway>
        Vectors as columns, then row-reduce. Pivot columns are the independent ones; every other column is a mixture of
        the pivot columns to its left, with the amounts printed in the tidied matrix.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  bigcheck: (
    <>
      <Para>
        Slides 11 and 12 run the method on something you genuinely cannot picture: three vectors with{' '}
        <strong>four</strong>{' '}components each. There is no drawing to fall back on, which is the point.
      </Para>
      <Para>
        The set-up is the definition, written out. You want to know whether λ₁x₁ + λ₂x₂ + λ₃x₃ = 0 has any answer other
        than all-zeros. Stand the three vectors up as columns and row-reduce.
      </Para>

      <Lab>
        <BigCheckLab />
      </Lab>

      <Para>
        Three pivot columns for three columns means no unknown is left free, so all-zeros is the only answer:{' '}
        <strong>independent</strong>.
      </Para>
      <Para>
        The row of zeros at the bottom is not a problem, and it is worth being clear why. There were four rows and only
        three columns, so at most three rows could ever have been independent. A zero row was inevitable. What matters
        is the count of <em>pivot columns</em>, not the count of surviving rows.
      </Para>

      <Worked title="Slides 11–12, all the way">
        {`x₁ = (1, 2, −3, 4)ᵀ    x₂ = (1, 1, 0, 2)ᵀ    x₃ = (−1, −2, 1, 1)ᵀ

⎡  1   1  −1 ⎤
⎢  2   1  −2 ⎥        R2 ← R2 − 2R1
⎢ −3   0   1 ⎥        R3 ← R3 + 3R1
⎣  4   2   1 ⎦        R4 ← R4 − 4R1

⎡ 1   1  −1 ⎤
⎢ 0  −1   0 ⎥         R3 ← R3 + 3R2
⎢ 0   3  −2 ⎥         R4 ← R4 − 2R2
⎣ 0  −2   5 ⎦

⎡ 1   1  −1 ⎤
⎢ 0  −1   0 ⎥         R4 ← 2R4 + 5R3
⎢ 0   0  −2 ⎥
⎣ 0   0   5 ⎦

⎡ 1   1  −1 ⎤
⎢ 0  −1   0 ⎥
⎢ 0   0  −2 ⎥
⎣ 0   0   0 ⎦

3 pivot columns, 3 columns  →  linearly independent.`}
      </Worked>

      <Takeaway>
        Count pivot columns, not surviving rows. Three pivots for three vectors means no free choice, so the only
        mixture landing on zero is the all-zeros one.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  dot: (
    <>
      <Para>
        So far vectors have had direction and you could add them, but nothing has said how <em>long</em>{' '}one is or what
        <em>angle</em> sits between two of them. The <strong>dot product</strong>{' '}is the single tool that supplies
        both.
      </Para>
      <Para>
        The rule is short: multiply the matching parts and add up. Two vectors in, one plain <strong>number</strong>{' '}
        out. It gets written three ways — <span className="font-mono">a·b</span>,{' '}
        <span className="font-mono">⟨a, b⟩</span>, and <span className="font-mono">aᵀb</span>{' '}— all the same thing. The
        last one is a reminder that a row times a column is a 1 × 1 matrix, which is just a number.
      </Para>

      <Lab>
        <DotProductLab />
      </Lab>

      <Para>
        The sign is doing real work. Positive means the two arrows lean the same way. Negative means they lean opposite
        ways. And zero — the case worth spotting — means they are at right angles, which gets its own part shortly.
      </Para>
      <Para>Three properties, all on slide 14, and all of them things you would want to be true:</Para>
      <List
        items={[
          <>
            <strong>Linearity.</strong>{' '}⟨ku + lv, w⟩ = k⟨u, w⟩ + l⟨v, w⟩. You may break the left side apart and deal
            with the pieces.
          </>,
          <>
            <strong>Symmetry.</strong>{' '}⟨u, v⟩ = ⟨v, u⟩. Unlike matrix multiplication, order makes no difference here.
          </>,
          <>
            <strong>Positive definite.</strong>{' '}⟨u, u⟩ ≥ 0, and it is 0 only for the zero vector. This is what makes
            length possible in the next part.
          </>,
        ]}
      />

      <Worked title="Slide 15 checks linearity by hand">
        {`u = (1, 2),  v = (3, 1),  w = (2, 4),  k = 2,  l = 3

2u + 3v = (2, 4) + (9, 3) = (11, 7)

Left side:   ⟨2u + 3v, w⟩ = 11(2) + 7(4) = 22 + 28 = 50

Right side:  ⟨u, w⟩ = 1(2) + 2(4) = 10
             ⟨v, w⟩ = 3(2) + 1(4) = 10
             2(10) + 3(10) = 20 + 30 = 50

Both sides give 50.  ✓`}
      </Worked>

      <Terms
        items={[
          {
            term: 'dot product',
            def: 'Multiply matching parts, add them up. Written a·b, ⟨a, b⟩ or aᵀb. Always gives one plain number.',
          },
          {
            term: 'inner product',
            def: 'The general name for an operation with those three properties. The dot product is the everyday one.',
          },
          {
            term: 'linearity',
            def: 'You can split a sum inside the brackets and pull plain numbers out. It is why so much of this is workable.',
          },
          {
            term: 'positive definite',
            def: 'Here it means ⟨u, u⟩ is never negative, and only zero for the zero vector — so its square root is always safe to take.',
          },
        ]}
      />
      <Takeaway>
        The dot product multiplies matching parts and adds. Its sign says which way two vectors lean, and it is the
        source of both length and angle.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  norm: (
    <>
      <Para>
        Take the dot product of a vector <em>with itself</em>. Every term becomes a square, so the answer can never be
        negative — which means its square root is always safe to take. That root is the <strong>norm</strong>, written{' '}
        <span className="font-mono">‖a‖</span>, and it is just the length of the arrow.
      </Para>
      <Para>
        In two dimensions ‖a‖ = √(a₁² + a₂²), which is Pythagoras and nothing more. The definition keeps working in ten
        dimensions, where there is no triangle to look at — square, add, take the root.
      </Para>

      <Lab>
        <NormLab />
      </Lab>

      <Para>Two inequalities come with it, and both are worth knowing by name.</Para>
      <Para>
        <strong>Cauchy&ndash;Schwarz:</strong> <span className="font-mono">|⟨a, b⟩| ≤ ‖a‖‖b‖</span>. The dot product can
        never be bigger than the two lengths multiplied together. Try to break it by dragging — you cannot. The best you
        can do is line the two arrows up, and then the two sides are exactly equal.
      </Para>
      <Para>
        <strong>Triangle inequality:</strong> <span className="font-mono">‖a + b‖ ≤ ‖a‖ + ‖b‖</span>. Going straight
        there is never further than going via a corner. It is called the triangle inequality because that is precisely
        what it says about a triangle.
      </Para>
      <Para>
        Cauchy&ndash;Schwarz is the one doing hidden work. Because it guarantees that ⟨a,b⟩/(‖a‖‖b‖) always lands
        between −1 and 1, the next part can safely feed that number into cos⁻¹. Without it, &ldquo;the angle between two
        vectors in ℝ⁷&rdquo; would not even be defined.
      </Para>

      <Worked title="Slide 17, checked">
        {`a = (3, 4)     b = (1, 2)

‖a‖ = √(3² + 4²) = √25 = 5
‖b‖ = √(1² + 2²) = √5  ≈ 2.236

aᵀb = (3)(1) + (4)(2) = 3 + 8 = 11

‖a‖‖b‖ = 5√5 ≈ 11.18

|11| ≤ 11.18   ✓  Cauchy–Schwarz holds, with a little room to spare.`}
      </Worked>

      <Terms
        items={[
          { term: 'norm', def: 'The length of a vector: ‖a‖ = √⟨a, a⟩. Never negative, and zero only for the zero vector.' },
          { term: 'unit vector', def: 'A vector of length 1. Divide any non-zero vector by its own norm and you get one.' },
          {
            term: 'Cauchy–Schwarz',
            say: 'COH-shee SHVARTS',
            def: '|⟨a, b⟩| ≤ ‖a‖‖b‖. Equality only when the two vectors lie along each other.',
          },
          {
            term: 'triangle inequality',
            def: '‖a + b‖ ≤ ‖a‖ + ‖b‖. The direct route is never longer than the detour.',
          },
        ]}
      />
      <Takeaway>
        The norm is √⟨a, a⟩ — Pythagoras, in any number of dimensions. Cauchy&ndash;Schwarz caps the dot product at
        ‖a‖‖b‖, which is what makes angles possible.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  angle: (
    <>
      <Para>
        Divide the dot product by the two lengths and something useful happens. Cauchy&ndash;Schwarz says the result is
        always between −1 and 1 — exactly the range a cosine lives in. So the lecture simply <em>defines</em>{' '}the angle
        that way:
      </Para>
      <Formula>α = cos⁻¹( ⟨a, b⟩ / (‖a‖‖b‖) )</Formula>
      <Para>
        In two or three dimensions this agrees with the angle you would measure with a protractor. In seven dimensions
        there is no protractor, and this becomes the definition — which is fine, because it behaves exactly as an angle
        should.
      </Para>

      <Lab>
        <AngleLab />
      </Lab>

      <Para>
        The case worth all the attention is <span className="font-mono">⟨a, b⟩ = 0</span>. Then cos α = 0, so α = 90°,
        and the two vectors are called <strong>orthogonal</strong>{' '}— the proper word for &ldquo;at right
        angles&rdquo;.
      </Para>
      <Para>
        And here is why that matters so much in practice: you never have to work out an angle to check it. Just see
        whether the dot product is zero. That test costs a handful of multiplications and works in any number of
        dimensions.
      </Para>

      <Worked title="Slide 18&rsquo;s example">
        {`a = [2, 2]ᵀ     b = [2, −2]ᵀ

⟨a, b⟩ = (2)(2) + (2)(−2) = 4 − 4 = 0

So cos α = 0 / (‖a‖‖b‖) = 0,  giving  α = π/2 = 90°.

a and b are orthogonal.`}
      </Worked>

      <Terms
        items={[
          { term: 'orthogonal', say: 'or-THOG-uh-nul', def: 'At right angles. Checked by the dot product being zero — no angle needed.' },
          {
            term: 'cos⁻¹',
            say: 'inverse cosine',
            def: 'Turns a number between −1 and 1 back into an angle. Also written arccos.',
          },
          {
            term: 'obtuse / acute',
            def: 'Over 90° / under 90°. A negative dot product means obtuse; a positive one means acute.',
          },
          { term: 'π/2', say: 'pi over two', def: '90° in radians. Maths tends to use radians rather than degrees.' },
        ]}
      />
      <Takeaway>
        The angle is cos⁻¹ of the dot product divided by the two lengths. A dot product of zero means orthogonal, and
        that is the check you actually use.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  projection: (
    <>
      <Para>
        Shine a light straight down onto the line that v₁ points along. The shadow v₂ casts on that line is the{' '}
        <strong>projection</strong>{' '}of v₂ onto v₁. It answers the question &ldquo;how much of v₂ is pointing the same
        way as v₁?&rdquo;
      </Para>
      <Para>
        Slide 19 does not guess the formula. It insists on one condition and lets the algebra deliver: whatever is left
        over, <span className="font-mono">u = v₂ − v</span>, must be at right angles to v₁. Write that as{' '}
        <span className="font-mono">u·v₁ = 0</span>{' '}and rearrange.
      </Para>

      <Lab>
        <ProjectionLab />
      </Lab>

      <Para>
        Drag v₂ anywhere you like. The teal leftover piece always meets v₁ at a right angle, and the read-out confirms
        it by computing u·v₁ every time. That is not a coincidence — it is the condition the formula was built from.
      </Para>

      <Worked title="Slide 19&rsquo;s derivation, then slide 20&rsquo;s numbers">
        {`v must lie along v₁, so  v = λ v₁/‖v₁‖  for some λ.
And u = v₂ − v must be at right angles to v₁:

    (v₂ − v)ᵀ v₁ = 0
    v₂ᵀv₁ − vᵀv₁ = 0
    v₂ᵀv₁ = vᵀv₁ = λ‖v₁‖          so   λ = v₂ᵀv₁ / ‖v₁‖

Put λ back in:

    v = (v₂ᵀv₁ / ‖v₁‖)(v₁/‖v₁‖) = (v₂ᵀv₁ / v₁ᵀv₁) v₁

Slide 20:   v₁ = (3, 0),  v₂ = (2, 4)

    v₂ᵀv₁ = 6,   v₁ᵀv₁ = 9

    v = (6/9)(3, 0) = (2/3)(3, 0) = (2, 0)

    u = v₂ − v = (2, 4) − (2, 0) = (0, 4)

    check:  u·v₁ = (0)(3) + (4)(0) = 0   ✓ perpendicular`}
      </Worked>

      <Para>
        Why this is worth the trouble: splitting a vector into &ldquo;the part along something&rdquo; and &ldquo;the
        part at right angles to it&rdquo; is the move behind least squares, behind principal component analysis, and
        behind every method that fits a line by making the leftovers as small as possible. The leftover u is what those
        methods call the <strong>residual</strong>.
      </Para>

      <Terms
        items={[
          {
            term: 'projection',
            def: 'The shadow one vector casts on the line through another. Written projᵥ₁(v₂).',
          },
          {
            term: 'orthogonal component',
            def: 'What is left over: u = v₂ − v. Always at right angles to v₁, by construction.',
          },
          {
            term: 'residual',
            def: 'The same leftover, in the language of fitting models. Making it small is what "best fit" means.',
          },
        ]}
      />
      <Takeaway>
        The projection is v = (v₂ᵀv₁ / v₁ᵀv₁) v₁, and it comes from demanding that the leftover be at right angles to
        v₁. That leftover is what model-fitting calls the residual.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  terms: (
    <>
      <Para>
        The lecture now changes subject. Everything from here is about <strong>probability</strong>, and it starts by
        naming things carefully, because the words get used loosely in ordinary speech and precisely here.
      </Para>
      <List
        items={[
          <>
            The <strong>sample space</strong>{' '}Ω is the set of everything that could possibly happen. For one roll of a
            die, Ω = {'{1, 2, 3, 4, 5, 6}'}.
          </>,
          <>
            An <strong>event</strong> is any part of that list. &ldquo;An even number&rdquo; is the event {'{2, 4, 6}'}.
            A single outcome is an event too.
          </>,
          <>
            The <strong>algebra of events</strong>{' '}is the promise that combining events gives you events again: unions,
            intersections and complements of events are all still events.
          </>,
        ]}
      />

      <Lab>
        <EventsAlgebraLab />
      </Lab>

      <Para>
        Three operations, three everyday words. <strong>Union</strong>{' '}A ∪ B is &ldquo;or&rdquo; — everything in either
        one. <strong>Intersection</strong> A ∩ B is &ldquo;and&rdquo; — only what is in both.{' '}
        <strong>Complement</strong>{' '}Aᶜ is &ldquo;not&rdquo; — everything A is not.
      </Para>
      <Para>Two more words describe how a collection of events sits inside Ω, and they are easy to mix up.</Para>
      <List
        items={[
          <>
            <strong>Mutually exclusive</strong>{' '}means no two of them can happen together: every pairwise intersection is
            empty. They do not overlap.
          </>,
          <>
            <strong>Exhaustive</strong>{' '}means between them they cover the whole of Ω, so one of them is bound to happen.
          </>,
        ]}
      />
      <Para>
        Those two are independent of each other. A collection can be one, both, or neither. Both at once is the tidiest
        case, because it carves Ω into pieces with no gaps and no overlaps.
      </Para>

      <Worked title="Slide 22, exactly">
        {`Ω = {1, 2, 3, 4, 5, 6}

E (even) = {2, 4, 6}

A = {2, 4, 6},  B = {4, 5, 6}

   A ∪ B = {2, 4, 5, 6}      OR
   A ∩ B = {4, 6}            AND
   Aᶜ    = {1, 3, 5}         NOT

Mutually exclusive:  {2, 4, 6} ∩ {1, 3, 5} = ∅

Exhaustive:  A₁ = {1, 2}, A₂ = {3, 4}, A₃ = {5, 6}
             A₁ ∪ A₂ ∪ A₃ = Ω`}
      </Worked>

      <Terms
        items={[
          { term: 'sample space Ω', say: 'omega', def: 'The set of every possible outcome of the experiment.' },
          { term: 'event', def: 'Any subset of Ω — any collection of outcomes you care to name.' },
          { term: 'union ∪', def: 'Everything in either event. The "or" operation.' },
          { term: 'intersection ∩', def: 'Only what is in both events. The "and" operation.' },
          { term: 'complement Aᶜ', def: 'Everything in Ω that is not in A. The "not" operation.' },
          { term: '∅', say: 'the empty set', def: 'The event with nothing in it. It can never happen.' },
          { term: 'mutually exclusive', def: 'No two can happen at once — the intersections are all empty.' },
          { term: 'exhaustive', def: 'Together they cover all of Ω, so one of them must happen.' },
        ]}
      />
      <Takeaway>
        Ω is everything that could happen; an event is part of it. Union is or, intersection is and, complement is not.
        Exclusive means no overlap; exhaustive means no gaps.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  axioms: (
    <>
      <Para>
        Here is something that surprises people: mathematics does not say what probability <em>is</em>. It says what any
        sensible assignment of probabilities has to <em>obey</em>. Three rules, and everything else is worked out from
        them.
      </Para>
      <List
        items={[
          <>
            <strong>Axiom 1.</strong>{' '}P(E) ≥ 0 for every event. Probabilities are never negative — there is no such
            thing as less likely than impossible.
          </>,
          <>
            <strong>Axiom 2.</strong>{' '}P(Ω) = 1. Something is certain to happen, and 1 is the label we give certainty.
          </>,
          <>
            <strong>Axiom 3.</strong>{' '}For events that cannot happen together, probabilities simply add:
            P(E₁ ∪ E₂ ∪ ⋯) = P(E₁) + P(E₂) + ⋯
          </>,
        ]}
      />

      <Lab>
        <AxiomsLab />
      </Lab>

      <Para>
        The lab lets you break them, which is the fastest way to see what each one is holding down. Drag a bar below the
        line and axiom 1 fails. Load the presets where the bars do not add to 1 and axiom 2 fails.
      </Para>
      <Para>
        The condition on axiom 3 is the part to hold on to. It only lets you add when the events are{' '}
        <strong>mutually exclusive</strong>. If they could both happen, adding would count the shared outcomes twice,
        and you would have to take the overlap off again — which is exactly what the addition rule
        P(A ∪ B) = P(A) + P(B) − P(A ∩ B) does.
      </Para>
      <Para>
        Small consequences fall straight out. P(Aᶜ) = 1 − P(A), because A and Aᶜ cannot both happen and between them
        cover Ω. And P(∅) = 0. Neither is a new rule — both are just the three axioms rearranged.
      </Para>

      <Worked title="Slides 23–24">
        {`P is a probability function on the events of Ω if:

  Axiom 1:  P(E) ≥ 0 for every event E
  Axiom 2:  P(Ω) = 1
  Axiom 3:  for mutually exclusive E₁, E₂, …

                        ∞          ∞
                  P( ∪ Eᵢ )  =    Σ  P(Eᵢ)
                       i=1        i=1

For a fair die:  P(1) = P(2) = ⋯ = P(6) = 1/6

  each ≥ 0                          ✓ axiom 1
  6 × 1/6 = 1 = P(Ω)                ✓ axiom 2
  P(even) = 1/6 + 1/6 + 1/6 = 1/2   ✓ axiom 3`}
      </Worked>

      <Terms
        items={[
          { term: 'axiom', say: 'AX-ee-um', def: 'A rule assumed rather than proved. Everything else is built on top of it.' },
          {
            term: 'probability function',
            def: 'Any rule handing a number to each event while obeying the three axioms.',
          },
          {
            term: 'countably infinite',
            def: 'A list that goes on forever but can still be numbered 1, 2, 3, … Axiom 3 covers those as well as finite lists.',
          },
        ]}
      />
      <Takeaway>
        Three axioms: never negative, the whole space is 1, and probabilities add when events cannot happen together.
        Everything else in probability comes from these.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  randomvar: (
    <>
      <Para>
        Outcomes are often not numbers. Toss a coin three times and you get things like HTT — a perfectly good outcome
        that you cannot average or add up.
      </Para>
      <Para>
        A <strong>random variable</strong>{' '}fixes that. It is a rule that attaches a number to each outcome. Formally it
        is a function from Ω to the real numbers, which sounds heavier than it is: you decide what to measure, and the
        rule reads it off.
      </Para>
      <Para>
        The lecture is strict about notation, and it helps. <strong>Uppercase X</strong> is the rule.{' '}
        <strong>Lowercase x</strong>{' '}is a value it produced. So &ldquo;P(X = 2)&rdquo; means the chance that the rule
        gives 2.
      </Para>

      <Lab>
        <RandomVarLab />
      </Lab>

      <Para>
        The three rules in the lab all act on the same eight outcomes and give completely different variables. That is
        worth noticing: the random variable is not the experiment. It is a question you chose to ask about the
        experiment.
      </Para>
      <Para>Random variables come in two kinds, and the difference matters more than it first appears.</Para>
      <List
        items={[
          <>
            <strong>Discrete</strong>{' '}— the values form a finite or countable list. Number of heads, number of
            customers, number of faulty parts.
          </>,
          <>
            <strong>Continuous</strong>{' '}— the values fill an interval. The lifetime of a bulb, a height, a temperature.
            For these, the probability of any single exact value is <strong>0</strong>.
          </>,
        ]}
      />
      <Para>
        That last point is genuinely strange the first time you meet it. The bulb does last <em>some</em>{' '}exact number
        of hours, so how can that have probability zero? The honest answer is that there are infinitely many possible
        values, so no single one can carry any weight — only <em>ranges</em>{' '}do. The next part makes that concrete.
      </Para>

      <Worked title="Slide 26&rsquo;s two examples">
        {`Discrete
  Toss a coin 3 times.
  Ω = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}
  Let X = number of heads.       X ∈ {0, 1, 2, 3}
  A countable list, so X is discrete.

Continuous
  X = lifetime of a bulb, in hours.
  X ∈ [0, ∞)
  Any real value in the interval is possible,
  and P(X = one exact value) = 0.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'random variable',
            def: 'A rule attaching a number to each outcome. Written with an uppercase letter, usually X.',
          },
          { term: 'realisation', def: 'A value the rule actually produced, written lowercase: x.' },
          { term: 'discrete', def: 'The values form a countable list, so each one can carry its own probability.' },
          {
            term: 'continuous',
            def: 'The values fill an interval. Single values have probability 0; only ranges have probability.',
          },
        ]}
      />
      <Takeaway>
        A random variable turns outcomes into numbers. Uppercase is the rule, lowercase is a value. Discrete means a
        countable list; continuous means an interval, where single values have probability zero.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  pmf: (
    <>
      <Para>
        Once a random variable turns outcomes into numbers, the natural next question is how the probability is spread
        across those numbers. The answer has two forms, one for each kind of variable.
      </Para>
      <Para>
        For a <strong>discrete</strong> variable it is the <strong>probability mass function</strong>, p(x) = P(X = x).
        Every value gets an honest probability, and they add to 1.
      </Para>
      <Para>
        For a <strong>continuous</strong> variable it is the <strong>probability density function</strong>{' '}f(x) — and
        this one is not a probability at all. Only areas under it are.
      </Para>

      <Lab>
        <PmfPdfLab />
      </Lab>

      <Para>
        Switch between the two tabs and compare. The bars are probabilities you can read off directly. The flat line is
        not — you have to work out an area before you have anything meaningful.
      </Para>
      <Para>
        This is the single most confusing thing in this part of the course, so it is worth stating plainly:{' '}
        <strong>a density can be bigger than 1.</strong>{' '}A Uniform(0, ½) distribution has height 2 across its interval.
        That is fine, because 2 × ½ = 1 and the area is what has to come to 1.
      </Para>
      <Para>
        Squeeze the two edges of the shaded strip together and the area goes to zero. That is exactly why P(X = 0.5) = 0
        for a continuous variable — a single point is a strip of zero width.
      </Para>

      <Worked title="Slides 27 and 29">
        {`Discrete — pmf
    p(x) = P(X = x) ≥ 0        and       Σ p(x) = 1
                                          x

    Coin tossed 3 times, X = heads:
    p(0) = 1/8, p(1) = 3/8, p(2) = 3/8, p(3) = 1/8
    Total = 8/8 = 1   ✓

Continuous — pdf
    f(x) ≥ 0     and     ∫ f(x) dx = 1  over all x
                                   b
    P[a ≤ X ≤ b] = ∫ f(x) dx
                                   a

    X ~ Uniform(0, 1):   f(x) = 1 for 0 ≤ x ≤ 1, else 0

                        0.7
    P(0.3 ≤ X ≤ 0.7) = ∫  1 dx = 0.7 − 0.3 = 0.4
                        0.3

    P(X = 0.5) = 0        a single point has no width`}
      </Worked>

      <Terms
        items={[
          { term: 'pmf', say: 'p-m-f', def: 'Probability mass function. For discrete variables, p(x) is a real probability.' },
          {
            term: 'pdf',
            say: 'p-d-f',
            def: 'Probability density function. For continuous variables, only the area under f is a probability.',
          },
          {
            term: 'density',
            def: 'How thickly probability is packed near a value. Like mass per centimetre — you need a length before you get a mass.',
          },
          { term: 'Uniform(0, 1)', def: 'Every value between 0 and 1 equally likely. Its density is flat at height 1.' },
        ]}
      />
      <Takeaway>
        A pmf gives probabilities you can read straight off. A pdf gives densities — you must work out an area first,
        which is why single values have probability zero.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  expectation: (
    <>
      <Para>
        The <strong>expectation</strong>{' '}of X, written E[X] or μ, is its long-run average — where the values would
        settle if you ran the experiment forever. Each value is weighted by how likely it is:
      </Para>
      <Formula>μ = E[X] = Σ x p(x) &nbsp;&nbsp;or&nbsp;&nbsp; ∫ x f(x) dx</Formula>
      <Para>
        The best picture is a see-saw. Put a weight on each value, sized by its probability, and the expectation is the
        point where the plank balances.
      </Para>

      <Lab>
        <ExpectationLab />
      </Lab>

      <Para>
        Load the coin and the answer is 1.5 heads. You can never actually get 1.5 heads, and that is not a mistake — an
        expectation is a balance point, not a prediction. The word &ldquo;expected&rdquo; is misleading, and worth
        distrusting.
      </Para>
      <Para>
        When you have data rather than probabilities, the same idea gives the ordinary average x̄ = (1/n)Σxᵢ. It is the
        same formula, with each observation quietly weighted 1/n.
      </Para>

      <Worked title="Slides 30–31">
        {`Definition
                              ∞
    μ = E[X] = Σ x p(x)  or  ∫  x f(x) dx
                x            −∞

From data
    x̄ = (1/n) Σ xᵢ          each observation weighted 1/n

Slide 31 — continuous example
    X ~ Uniform(0, 1),  f(x) = 1 on [0, 1]

              1                 1
    E[X] =   ∫  x · 1 dx = [x²/2]  = 1/2
              0                 0

The middle of the interval, as you would hope.`}
      </Worked>

      <Terms
        items={[
          { term: 'expectation', def: 'The probability-weighted average of a random variable. Written E[X] or μ.' },
          { term: 'μ', say: 'mew', def: 'The Greek letter for a mean worked out from probabilities, rather than from data.' },
          { term: 'x̄', say: 'x bar', def: 'The mean of actual observations. Same idea, computed from data.' },
          {
            term: 'central tendency',
            def: 'The general name for "where the middle is". Mean, median and mode are three different answers.',
          },
        ]}
      />
      <Takeaway>
        Expectation is the balance point of a distribution: each value weighted by its probability. It need not be a
        value the variable can actually take.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  variance: (
    <>
      <Para>
        A mean on its own can describe nobody. Two sets of numbers can share the same average and look nothing alike, so
        the second thing you always want is how <strong>spread out</strong>{' '}they are.
      </Para>
      <Para>
        The <strong>variance</strong>{' '}measures that. Take each value&rsquo;s distance from the mean, square it, and
        average the squares:
      </Para>
      <Formula>σ² = E[(X − μ)²]</Formula>
      <Para>
        Why square? Two reasons. Distances above and below the mean would otherwise cancel out to exactly zero, every
        time. And squaring makes far-away values count for much more than near ones, which is usually what you want.
      </Para>

      <Lab>
        <VarianceLab />
      </Lab>

      <Para>
        Each shaded square in the lab is one squared distance — a real square, with that side length. Drag one dot far
        to the right and watch its square swell until it dominates the total on its own. That is squaring doing its job,
        and it is also its main weakness: one odd value can distort the whole thing.
      </Para>
      <Para>
        The <strong>standard deviation</strong>{' '}σ is the square root of the variance, and the reason to take that root
        is units. If your data is in metres, the variance is in square metres, which means nothing to anyone. The
        standard deviation is back in metres, so you can compare it with the data itself.
      </Para>
      <Para>
        <strong>One thing to watch.</strong>{' '}This lecture divides by n, because it is describing the collection you
        actually have. The Statistics course divides by n − 1, because it is treating the numbers as a sample from
        something bigger and correcting for the fact that a sample looks slightly tighter than the population it came
        from. Both are right. Read the question and see which one is being asked for.
      </Para>

      <Worked title="Slide 33, in full">
        {`Data:  2, 4, 6, 8

Step 1 — the mean
    x̄ = (2 + 4 + 6 + 8) / 4 = 20 / 4 = 5

Step 2 — distances from it, and their squares
    x      x − x̄     (x − x̄)²
    2       −3           9
    4       −1           1
    6        1           1
    8        3           9

Step 3 — the variance
    σ² = (9 + 1 + 1 + 9) / 4 = 20 / 4 = 5

Step 4 — the standard deviation
    σ = √5 ≈ 2.236`}
      </Worked>

      <Terms
        items={[
          { term: 'variance', def: 'The average squared distance from the mean. Written σ² because it is a square.' },
          {
            term: 'standard deviation',
            def: 'The square root of the variance. Back in the same units as the data, so it is the one you quote.',
          },
          { term: 'σ', say: 'sigma', def: 'The Greek letter used for the standard deviation. σ² is the variance.' },
          {
            term: 'deviation',
            def: 'One value’s distance from the mean, x − x̄. Positive above, negative below, and they always add to zero.',
          },
        ]}
      />
      <Takeaway>
        Variance is the average squared distance from the mean; the standard deviation is its square root, back in the
        original units. This lecture divides by n — the Statistics course divides by n − 1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  covariance: (
    <>
      <Para>
        Everything so far has looked at one variable at a time. <strong>Covariance</strong>{' '}is the first tool that looks
        at two together, and it asks one question: when x is above its average, is y usually above its average too?
      </Para>
      <Formula>cov(X, Y) = E[(X − E[X])(Y − E[Y])]</Formula>
      <Para>
        For each point, take its distance from the average in x, take its distance from the average in y, and multiply
        them. Both above or both below gives a positive product. One above and one below gives a negative one. Average
        those products and you have the covariance.
      </Para>

      <Lab>
        <CovarianceLab />
      </Lab>

      <Para>
        Each rectangle in the lab is one of those products drawn as an area — teal when it is positive, red when it is
        negative. The covariance is their signed average. Drag a point across the horizontal dashed line and watch its
        rectangle flip colour and start pulling the other way.
      </Para>
      <Para>
        The sign is the part that carries meaning. Positive means the two tend to rise together. Negative means one
        rises as the other falls. Near zero means there is no straight-line pattern either way.
      </Para>
      <Para>
        The <em>size</em>, though, is nearly useless on its own, because it carries units — measure the same heights in
        centimetres instead of metres and the covariance changes by a factor of 100 without anything real having
        changed. Dividing by the two standard deviations strips the units out and gives the{' '}
        <strong>correlation</strong>, which always sits between −1 and 1. That is the Statistics course&rsquo;s job.
      </Para>
      <Para>
        One warning that is worth carrying with you: covariance only sees <em>straight-line</em>{' '}patterns. Points
        arranged in a perfect arch have a strong relationship and a covariance close to zero, because the left half and
        the right half cancel each other out.
      </Para>

      <Worked title="Slide 35, in full">
        {`X:  1   2   3   4
Y:  2   4   6   8

Step 1 — the two means
    x̄ = (1 + 2 + 3 + 4) / 4 = 2.5
    ȳ = (2 + 4 + 6 + 8) / 4 = 5

Step 2 — the deviations and their products
    x    y    x − x̄    y − ȳ    product
    1    2     −1.5      −3        4.5
    2    4     −0.5      −1        0.5
    3    6      0.5       1        0.5
    4    8      1.5       3        4.5

Step 3 — average them
    cov(X, Y) = (4.5 + 0.5 + 0.5 + 4.5) / 4 = 10 / 4 = 2.5

Positive, and every product is positive — because y here is
exactly 2x, so the two always move together.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'covariance',
            def: 'The average product of the two deviations. Positive when the variables rise together.',
          },
          { term: 'bivariate', say: 'by-VAR-ee-ut', def: 'Two variables at a time. Multivariate means more than two.' },
          {
            term: 'correlation',
            def: 'Covariance divided by both standard deviations. Unit-free, and always between −1 and 1.',
          },
          {
            term: 'covariance matrix',
            def: 'With several variables, all the pairwise covariances in one square, symmetric matrix. It runs most of multivariate statistics.',
          },
        ]}
      />
      <Takeaway>
        Covariance multiplies the two distances-from-average for each point and averages the results. Its sign says
        whether the variables move together; its size means little until you divide the units out.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  practice: (
    <>
      <Para>
        The practice sheet comes with <strong>no answer key</strong>. So everything below was worked out from scratch
        and then checked — by substituting back, or by running it in one of the labs in this chapter. Where a question
        could not be settled, this page would say so and print nothing; that does not happen this time, as all six are
        decidable.
      </Para>

      <Worked title="Q1 — is v₃ a combination of v₁ and v₂?">
        {`v₁ = (1, 2, 3),   v₂ = (2, 1, 1),   v₃ = (3, 3, 4)

(a) Look for numbers a and b with  a v₁ + b v₂ = v₃:

        a + 2b = 3        …from the 1st components
       2a +  b = 3        …from the 2nd
       3a +  b = 4        …from the 3rd

    From the first two:  subtract twice the first from the second
       2a + b − 2(a + 2b) = 3 − 6   ⇒   −3b = −3   ⇒   b = 1
    then a = 3 − 2(1) = 1.

    Check the third equation, which was not used:
       3(1) + 1 = 4   ✓

    So v₃ really is a combination of v₁ and v₂.

(b) v₃ = v₁ + v₂.
    Check all three components: (1+2, 2+1, 3+1) = (3, 3, 4)  ✓

(c) Since v₁ + v₂ − v₃ = 0 with coefficients 1, 1, −1 — not all
    zero — the set {v₁, v₂, v₃} is linearly DEPENDENT.

    v₁ and v₂ on their own are independent: neither is a multiple
    of the other. So the rank of the set is 2.`}
      </Worked>

      <Worked title="Q2 — echelon form, rank, and the columns">
        {`     ⎡ 1  2  3 ⎤
A =  ⎢ 2  4  5 ⎥
     ⎣ 3  6  8 ⎦

(a) R2 ← R2 − 2R1        [0  0  −1]
    R3 ← R3 − 3R1        [0  0  −1]
    R3 ← R3 −  R2        [0  0   0]

         ⎡ 1  2   3 ⎤
    REF = ⎢ 0  0  −1 ⎥
         ⎣ 0  0   0 ⎦

(b) Two non-zero rows, so rank A = 2.

(c) The pivots are in columns 1 and 3, so those two columns are
    independent. Column 2 has no pivot, and indeed

        column 2 = (2, 4, 6)ᵀ = 2 × (1, 2, 3)ᵀ = 2 × column 1

    So the three columns are linearly DEPENDENT, and any
    independent subset has at most 2 vectors in it — which is
    the rank again.`}
      </Worked>

      <Para>
        Load this one as <strong>Practice Q2</strong>{' '}in part 6 and the read-out prints &ldquo;column 2 = 2 × column
        1&rdquo; for you.
      </Para>

      <Worked title="Q3 — rank without full row reduction">
        {`     ⎡ 1  2  3  4 ⎤
A =  ⎢ 2  4  6  8 ⎥
     ⎣ 1  1  1  1 ⎦

Look before working. Row 2 is exactly 2 × Row 1, so it adds
nothing and will collapse to zeros.

That leaves Rows 1 and 3. Neither is a multiple of the other —
(1, 2, 3, 4) and (1, 1, 1, 1) disagree from the second entry on —
so those two are independent.

    rank A = 2

Sanity check on the shape: there are 3 rows and 4 columns, so
the rank could have been at most 3. It is 2 because one row
repeated another.`}
      </Worked>

      <Worked title="Q4 — the parallelogram law">
        {`Show:   ‖a + b‖² + ‖a − b‖² = 2‖a‖² + 2‖b‖²

Everything comes from ‖v‖² = ⟨v, v⟩ and linearity.

    ‖a + b‖² = ⟨a + b, a + b⟩
             = ⟨a, a⟩ + ⟨a, b⟩ + ⟨b, a⟩ + ⟨b, b⟩
             = ‖a‖² + 2⟨a, b⟩ + ‖b‖²        using symmetry

    ‖a − b‖² = ⟨a − b, a − b⟩
             = ‖a‖² − 2⟨a, b⟩ + ‖b‖²

Add the two lines. The 2⟨a, b⟩ terms cancel:

    ‖a + b‖² + ‖a − b‖² = 2‖a‖² + 2‖b‖²        ∎

What it says in pictures: in any parallelogram, the two diagonals
squared and added come to the same as the four sides squared and
added. The cross term cancelling is the whole trick.`}
      </Worked>

      <Para>
        Worth checking numerically before you trust it. With a = (3, 4) and b = (1, 2): ‖a + b‖² = ‖(4, 6)‖² = 52,
        ‖a − b‖² = ‖(2, 2)‖² = 8, and 52 + 8 = 60. On the other side, 2(25) + 2(5) = 60. They agree.
      </Para>

      <Lab>
        <OrthogonalSolveLab />
      </Lab>

      <Worked title="Q5 — find k so the two are orthogonal">
        {`a = (1, 2, 3, 4, 5)      b = (2, −1, k, 0, 1)

Orthogonal means the dot product is zero:

    a·b = (1)(2) + (2)(−1) + (3)(k) + (4)(0) + (5)(1)
        = 2 − 2 + 3k + 0 + 5
        = 3k + 5

Set it to zero:   3k + 5 = 0   ⇒   k = −5/3

Check:  3(−5/3) + 5 = −5 + 5 = 0   ✓`}
      </Worked>

      <Worked title="Q6 — orthogonal? and the angle">
        {`a = (1, −2, 3, 4)      b = (2, 1, −1, 0)

(a) a·b = (1)(2) + (−2)(1) + (3)(−1) + (4)(0)
        = 2 − 2 − 3 + 0
        = −3

    Not zero, so a and b are NOT orthogonal.

(b) ‖a‖ = √(1 + 4 + 9 + 16) = √30
    ‖b‖ = √(4 + 1 + 1 + 0)  = √6

    cos α = −3 / (√30 · √6) = −3 / √180 = −3 / (6√5) = −1/(2√5)

    As a decimal:  −1/(2√5) ≈ −0.2236

    α = cos⁻¹(−0.2236) ≈ 102.92°   (about 1.796 radians)

The negative dot product told you in advance that the angle
would be over 90°, so this is a useful sanity check.`}
      </Worked>

      <Takeaway>
        All six are decidable and all six were checked. Q1 by substituting back into the third equation that the
        working never used, Q4 numerically on a = (3, 4) and b = (1, 2), and Q5 and Q6 in the lab above.
      </Takeaway>
    </>
  ),
}
