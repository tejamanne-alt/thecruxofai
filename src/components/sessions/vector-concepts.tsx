'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These two come out
 * of Lecture 0b, and each links back to the chapter parts it was drawn from.
 */
import { AngleLab, DotProductLab, NormLab, ProjectionLab } from '@/components/charts/inner-product-lab'
import { CovarianceLab, VarianceLab } from '@/components/charts/moments-lab'
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

export function DotProductConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="The dot product: length, angle and shadow"
        intro="One tiny operation — multiply matching parts, add them up — quietly supplies everything geometric about vectors. How long one is, what angle sits between two of them, whether they are at right angles, and how much of one points along another."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You are pushing a trolley. You shove it in one direction; it is only free to roll in another. How much of
            your push actually helps? Only the part of it that lines up with the direction of travel — the rest is
            wasted against the wheels.
          </>,
          <>
            That question, &ldquo;how much of this points along that?&rdquo;, is what the dot product answers. And once
            you can answer it, length and angle come along free: a vector&rsquo;s length is how much of it points along{' '}
            <em>itself</em>, and the angle is what you get after dividing out both lengths.
          </>,
        ]}
        mappings={[
          {
            title: 'The dot product a·b',
            body: 'Multiply matching parts and add. One plain number. Positive means the two lean the same way, negative means opposite.',
          },
          {
            title: 'Length ‖a‖',
            body: 'The dot product of a with itself, square-rooted. Pythagoras, working in any number of dimensions.',
          },
          {
            title: 'Zero',
            body: 'Nothing of one points along the other — they are at right angles. This is the case worth spotting, and it is the cheapest to check.',
          },
        ]}
        footnote="It is written three ways — a·b, ⟨a, b⟩ and aᵀb — which all mean the same thing. The last is a reminder that a row times a column is a 1 × 1 matrix, and a 1 × 1 matrix is just a number."
      />

      <H2>The operation itself</H2>
      <P>
        Multiply the matching parts, add them up. That is the whole rule. Drag either arrow and watch the sign flip as
        they swing past each other.
      </P>

      <Lab>
        <DotProductLab />
      </Lab>

      <P>
        Three properties make it well behaved, and all three are things you would want to be true. It is{' '}
        <strong>linear</strong>, so you can split sums apart and pull plain numbers out. It is{' '}
        <strong>symmetric</strong>, so unlike matrix multiplication the order makes no difference. And{' '}
        <strong>⟨u, u⟩ is never negative</strong>, which is what makes the next section possible at all.
      </P>

      <H2>Length</H2>
      <P>
        Take the dot product of a vector with itself and every term becomes a square, so the answer cannot be negative.
        Its square root is always safe to take, and that root is the length.
      </P>

      <Lab>
        <NormLab />
      </Lab>

      <P>
        Two inequalities come with it. <strong>Cauchy&ndash;Schwarz</strong>{' '}says the dot product can never exceed the
        two lengths multiplied together — try to break it by dragging, you cannot. The{' '}
        <strong>triangle inequality</strong>{' '}says going straight there is never further than going via a corner.
      </P>
      <P>
        Cauchy&ndash;Schwarz is doing hidden work. It guarantees that ⟨a,b⟩/(‖a‖‖b‖) always lands between −1 and 1 —
        exactly where a cosine lives — which is what lets the next section define an angle at all.
      </P>

      <H2>Angle, and being at right angles</H2>

      <Lab>
        <AngleLab />
      </Lab>

      <P>
        In two dimensions this agrees with a protractor. In two hundred dimensions there is no protractor, so this
        becomes the definition — and it behaves exactly as an angle should.
      </P>
      <P>
        The case that earns its keep is <strong>orthogonal</strong>: dot product zero, angle 90°. You never have to
        work out an angle to check it, which matters, because computing one arccos per pair would be ruinous when you
        are comparing millions of vectors.
      </P>

      <H2>Shadows</H2>
      <P>
        Finally, the trolley question. How much of v₂ points along v₁? Drag v₂ and watch its shadow slide along the
        line.
      </P>

      <Lab>
        <ProjectionLab />
      </Lab>

      <P>
        The formula is not guessed. You demand that the leftover u = v₂ − v be at right angles to v₁, write that as
        u·v₁ = 0, and rearrange. The right angle is the requirement that produced the answer, which is why it holds
        however you drag.
      </P>

      <Explainers
        plain="The dot product multiplies matching parts and adds them into one number. Its sign says whether two vectors lean the same way. A vector's length is the square root of its dot product with itself. Dividing the dot product by both lengths gives the cosine of the angle, and zero means at right angles. Projection splits any vector into a part along another and a part perpendicular to it."
        breaks="It is not multiplication in the usual sense — the answer is a number, not a vector, so you cannot chain it. a·b·c is meaningless. And the dot product on its own says little about similarity without dividing out the lengths: a very long vector can have a big dot product with almost anything, which is exactly why cosine similarity divides by both norms before comparing."
      >
        <MathBlock
          intro="Five lines. The first defines it; the other four are everything it gives you."
          formulas={[
            {
              formula: '⟨a, b⟩ = aᵀb = a₁b₁ + a₂b₂ + ⋯ + aₙbₙ',
              reading: 'Multiply matching parts, add them up. Two vectors in, one plain number out.',
            },
            {
              formula: '‖a‖ = √⟨a, a⟩',
              reading:
                'Length. Every term of ⟨a, a⟩ is a square, so it is never negative and the root is always safe to take.',
            },
            {
              formula: '|⟨a, b⟩| ≤ ‖a‖‖b‖',
              reading:
                'Cauchy–Schwarz. Equality only when the two vectors lie along each other. This is what keeps the next line legal.',
            },
            {
              formula: 'α = cos⁻¹( ⟨a, b⟩ / (‖a‖‖b‖) )',
              reading: 'The angle. Orthogonal means ⟨a, b⟩ = 0, and that is the version you actually test.',
            },
            {
              formula: 'v = (v₂ᵀv₁ / v₁ᵀv₁) v₁,    u = v₂ − v',
              reading:
                'Projection and leftover. Derived by insisting u·v₁ = 0, which is why the leftover is always perpendicular.',
            },
          ]}
          legend={[
            { sym: '⟨a,b⟩', name: 'Dot product', note: 'Also a·b or aᵀb. One number, whatever the dimension.', val: 'the push that helps' },
            { sym: '‖a‖', name: 'Norm', note: 'Length of the arrow. Zero only for the zero vector.', val: 'Pythagoras' },
            { sym: 'α', name: 'Angle', note: 'From the cosine. Needs Cauchy–Schwarz to be well defined.', val: 'cos⁻¹ of the ratio' },
            { sym: '⟨a,b⟩ = 0', name: 'Orthogonal', note: 'At right angles. The cheap test.', val: 'no angle needed' },
            { sym: 'v', name: 'Projection', note: 'The shadow v₂ casts on the line through v₁.', val: 'the useful part' },
            { sym: 'u', name: 'Residual', note: 'What is left over, always perpendicular to v₁.', val: 'the wasted part' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It is the inner loop of everything',
            how: 'A neural network layer is a pile of dot products. When people quote trillions of operations a second, this multiply-and-add is the operation being counted.',
          },
          {
            what: 'Cosine similarity is this concept, unchanged',
            how: 'Search and recommendation compare two embeddings by the angle between them rather than the distance, because direction carries the meaning and length usually just reflects how long the text was.',
          },
          {
            what: 'Projection is what "line of best fit" means',
            how: 'Least squares finds the point in the span of your features closest to the data — that point is the projection, and the perpendicular leftover is the residual being minimised.',
          },
          {
            what: 'Orthogonal features are the ones you want',
            how: 'Features at right angles contribute independently, so their weights can be worked out separately and stay stable. Nearly-parallel features fight each other, which is what makes fits unstable.',
          },
          {
            what: 'Attention scores are dot products',
            how: 'A transformer scores how much one token should attend to another by taking the dot product of a query with a key, then scaling it. That is this operation, run billions of times.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec0b/dot', label: 'Lecture 0b · The dot product' },
          { href: '/session/lec0b/norm', label: 'Length and two inequalities' },
          { href: '/session/lec0b/angle', label: 'Angle and orthogonality' },
          { href: '/session/lec0b/projection', label: 'Projection' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function CovarianceConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Spread, and whether two things move together"
        intro="Variance asks how far one quantity strays from its average. Covariance asks a question about a pair: when this one is above its average, is that one usually above its average too? Both are drawn here as areas you can push around."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Two shops on the same street. Some days both are busy, some days both are quiet — they rise and fall
            together, perhaps because of the weather. Two other shops might be the opposite: one is busy exactly when
            the other is not, because they are competing for the same customers.
          </>,
          <>
            Covariance puts a number on that. For each day, ask how far above or below average each shop was, and
            multiply the two answers. Both above, or both below, gives a positive product. One up and one down gives a
            negative one. Average those products and you have it.
          </>,
        ]}
        mappings={[
          {
            title: 'Variance',
            body: 'The same idea with one shop, compared against itself: the average squared distance from its own mean.',
          },
          {
            title: 'The sign of covariance',
            body: 'Positive means they rise together, negative means one rises as the other falls, near zero means no straight-line pattern.',
          },
          {
            title: 'Why the size means little',
            body: 'It carries the product of both units. Measure in pence instead of pounds and the number changes by 10,000 without anything real changing.',
          },
        ]}
        footnote="Covariance only detects straight-line patterns. Points in a perfect arch have an obvious relationship and a covariance near zero, because the two halves cancel — which is why you always look at the scatter plot too."
      />

      <H2>One variable: variance</H2>
      <P>
        Take each value&rsquo;s distance from the mean, square it, average the squares. Every shaded square below is one
        of those squared distances, drawn at its real size.
      </P>

      <Lab>
        <VarianceLab />
      </Lab>

      <P>
        Why square at all? Because the plain distances always add to exactly zero — the ones above the mean cancel the
        ones below — so they measure nothing. Squaring removes the signs and makes far-away values count for much more.
        The <strong>standard deviation</strong>{' '}then takes the square root to get back into the original units.
      </P>
      <P>
        Watch the divisor. Dividing by n describes the collection you actually have. Dividing by n − 1 treats it as a
        sample from something bigger and corrects for a sample looking slightly tighter than the population it came
        from. Both are correct; they answer different questions.
      </P>

      <H2>Two variables: covariance</H2>

      <Lab>
        <CovarianceLab />
      </Lab>

      <P>
        Each rectangle is one point&rsquo;s contribution, drawn as an area — teal when the product is positive, red
        when it is negative. The covariance is their signed average. Drag a point across the horizontal dashed line and
        its rectangle flips colour and starts pulling the other way.
      </P>
      <P>
        Notice that variance is just covariance with a variable and itself: cov(X, X) = E[(X − μ)²] = σ². They are the
        same formula, and that is worth knowing, because it is why both live together in one object — the{' '}
        <strong>covariance matrix</strong>{' '}— with the variances down its diagonal.
      </P>

      <Explainers
        plain="Variance is the average squared distance from the mean, and standard deviation is its square root, back in the original units. Covariance multiplies each point's two distances-from-average together and averages the results: positive when the two quantities lie on the same side of their means, negative when opposite. Variance is the special case where the two quantities are the same one."
        breaks="Covariance sees only straight lines. A symmetric curve gives near-zero covariance despite an obvious relationship. Its magnitude is also unit-dependent, so it cannot be compared across different pairs of variables until you divide by both standard deviations to get a correlation. And neither of these is evidence of cause: two things can move together because a third thing drives both."
      >
        <MathBlock
          intro="Four lines, and the last one is the point of the first three."
          formulas={[
            {
              formula: 'σ² = E[(X − μ)²] = Σ (x − μ)² p(x)',
              reading:
                'Variance. Squaring is necessary because the signed distances always add to zero and would measure nothing.',
            },
            {
              formula: 'σ = √σ²',
              reading:
                'Standard deviation. The square root puts the answer back in the units of the data, which is why it is the one people quote.',
            },
            {
              formula: 'cov(X, Y) = E[(X − μₓ)(Y − μᵧ)]',
              reading:
                'Covariance. One product per point: both above or both below their means gives a positive contribution.',
            },
            {
              formula: 'corr(X, Y) = cov(X, Y) / (σₓ σᵧ)',
              reading:
                'Correlation. Dividing by both standard deviations strips the units out and forces the answer into [−1, 1].',
            },
          ]}
          legend={[
            { sym: 'μ', name: 'Mean', note: 'The balance point. Where distances are measured from.', val: 'the centre' },
            { sym: 'σ²', name: 'Variance', note: 'Average squared distance. In squared units.', val: 'the spread' },
            { sym: 'σ', name: 'Standard deviation', note: 'Back in the original units. The one to quote.', val: '√variance' },
            { sym: 'cov', name: 'Covariance', note: 'Do the two move together? Sign matters, size does not.', val: 'the pairing' },
            { sym: 'corr', name: 'Correlation', note: 'Unit-free, always between −1 and 1.', val: 'the comparable one' },
            { sym: 'Σ', name: 'Covariance matrix', note: 'Every pairwise covariance, variances on the diagonal.', val: 'the whole picture' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The covariance matrix is the object behind PCA',
            how: 'Principal component analysis looks for the directions in which the data varies most, and those come straight out of the covariance matrix.',
          },
          {
            what: 'Standardising uses both numbers',
            how: 'Nearly every pipeline subtracts the mean and divides by the standard deviation, so that features measured in wildly different units can be compared at all.',
          },
          {
            what: 'Highly correlated features are a warning',
            how: 'Two features that move almost identically make the fit unstable — the same reason a near-singular matrix does. Spotting it early saves a lot of confusion later.',
          },
          {
            what: 'Zero covariance is not independence',
            how: 'It only rules out a straight-line relationship. Independent variables always have zero covariance, but zero covariance does not give you independence back.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec0b/variance', label: 'Lecture 0b · Variance' },
          { href: '/session/lec0b/covariance', label: 'Covariance' },
          { href: '/session/lec0b/expectation', label: 'Expectation' },
          { href: '/session/spread', label: 'Statistics · Spread' },
        ]}
      />
    </div>
  )
}
