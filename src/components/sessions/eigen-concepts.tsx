'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These four come
 * out of Lecture 4, and each links back to the chapter parts it was drawn from.
 *
 * The labs are the chapter's own, deliberately. A concept is a different cut
 * through the same material, not a second implementation of it — and a lab that
 * disagreed with the chapter would be worse than no lab at all.
 */
import { CholeskyLab, GaussianSampleLab } from '@/components/charts/eigen-cholesky-lab'
import { DeckEigenLab, DefectiveLab, EigenDefLab, EigenspaceLab } from '@/components/charts/eigen-core-lab'
import { TraceLab } from '@/components/charts/eigen-det-lab'
import { SpectralBasisLab, SpectralDecompLab, TraceEigenLab } from '@/components/charts/eigen-spectral-lab'
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

export function EigenConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Eigenvalues and eigenvectors"
        intro="A matrix normally does two things to a vector at once: it turns it, and it changes its length. This page is about the handful of directions where the turning does not happen — because those directions tell you what the matrix really does, and almost every technique that summarises data is built on finding them."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Spin a globe. Every city on it moves, except two: the poles. If you knew nothing about the spin except where
            its poles are and how fast it turns, you would know the whole thing.
          </>,
          <>
            An <strong>eigenvector</strong> is a pole of a matrix — a direction it refuses to turn. Its{' '}
            <strong>eigenvalue</strong> λ says how much it stretches that direction instead. A negative λ means the
            direction is kept but flipped end for end; a λ of zero means the direction is squashed flat.
          </>,
        ]}
        mappings={[
          {
            title: 'Ax = λx',
            body: 'The whole definition. A acting on x gives back a multiple of x, with x not allowed to be the zero vector.',
          },
          {
            title: 'det(A − λI) = 0',
            body: 'How you find λ without knowing x. It is the only one of the four equivalent conditions you can compute directly.',
          },
          {
            title: 'The nullspace of A − λI',
            body: 'How you find x once you have λ. Row-reduce it and read the free variables off — an ordinary elimination job.',
          },
        ]}
        footnote="Every eigenvector on this page is checked by substituting it back into Ax = λx in exact fractions, never asserted."
      />

      <H2>What the equation says</H2>
      <P>
        Ax = λx, with x not the zero vector. Read it aloud as “A acting on x gives back a multiple of x”. Not a new
        direction — the same one, stretched by λ.
      </P>
      <P>
        The x ≠ 0 condition is not fussiness. A0 = λ0 holds for every λ imaginable, so allowing the zero vector would
        make every number an eigenvalue of every matrix. <strong>Eigenvalues</strong> may be zero;{' '}
        <strong>eigenvectors</strong> may not.
      </P>
      <P>
        Swing x round the circle below and watch Ax. Almost everywhere the two arrows disagree. On the dashed lines they
        line up, and the read-out reports the stretch.
      </P>

      <Lab>
        <EigenDefLab />
      </Lab>

      <H2>How to find them, in the order it is actually done</H2>
      <P>
        Roots first, vectors second, always. Ax = λx rearranges to (A − λI)x = 0 — it has to be λI rather than a bare λ,
        because a number cannot be subtracted from a matrix. A non-zero x solving that means A − λI has a nullspace,
        which means it is short of full rank, which means its determinant is zero. That last statement is the one you
        can compute without knowing x, so it goes first.
      </P>
      <P>
        The lab below is the worked example from the lecture, one press at a time: the polynomial, the two roots, and
        then a separate elimination for each root to get its eigenvector.
      </P>

      <Lab>
        <DeckEigenLab />
      </Lab>

      <H2>An eigenvector is a whole line, not an arrow</H2>
      <P>
        If Ax = λx then A(cx) = c(Ax) = c(λx) = λ(cx), so any non-zero multiple of an eigenvector is another eigenvector
        for the same λ. Eigenvectors therefore come in lines through the origin, and picking the one of length 1 is a
        convention rather than a fact. Add two eigenvectors of the <em>same</em> λ and you get another one too — that is
        what makes the set a subspace, the <strong>eigenspace</strong> E<sub>λ</sub>.
      </P>
      <P>
        Mix the basis vectors in the lab below with the sliders. Whatever you build stays inside, and the check at the
        bottom substitutes your combination back into Ax = λx to prove it.
      </P>

      <Lab>
        <EigenspaceLab />
      </Lab>

      <H2>When it goes wrong</H2>
      <P>
        Two failures are worth meeting once so you recognise them later. A matrix can have <strong>too few</strong>{' '}
        eigenvectors: the shear below has λ = 0 as a double root but supplies only one direction, so no basis of
        eigenvectors exists and it cannot be diagonalised. And a rotation has <strong>no real</strong> eigenvalues at
        all, because there is genuinely no direction it leaves alone — its eigenvalues are a complex pair.
      </P>

      <Lab>
        <DefectiveLab />
      </Lab>

      <Explainers
        plain="An eigenvector is a direction a matrix does not turn; its eigenvalue is how much the matrix stretches that direction. Find the eigenvalues by solving det(A − λI) = 0, then find each eigenvector as the nullspace of A − λI. Any non-zero multiple of an eigenvector is another one, so they come in lines, and the eigenvectors of one λ plus the zero vector form a subspace called the eigenspace. Symmetric matrices are the well-behaved case: their eigenvalues are always real and eigenvectors from different eigenvalues are always at right angles."
        breaks="A matrix need not have enough eigenvectors to form a basis — the count of how often λ is a root and the count of how many directions it gives are different numbers, called the algebraic and geometric multiplicity, and the second can be smaller. A rotation has no real eigenvectors whatsoever, so 'the direction that survives' is not always a picture that exists. And because eigenvectors come in lines, the sign of one is arbitrary: a PCA plot that appears flipped between two runs is usually this, not a bug."
      >
        <MathBlock
          intro="Four lines, and the fourth is the one that turns a definition into a procedure."
          formulas={[
            {
              formula: 'Ax = λx,  x ≠ 0',
              reading: 'The eigenvalue equation. The zero vector is excluded, or every number would be an eigenvalue.',
            },
            {
              formula: '(A − λI)x = 0 solvable non-trivially',
              reading:
                'The same thing with everything on one side. λI, not λ, because a number cannot be subtracted from a matrix.',
            },
            {
              formula: 'det(A − λI) = 0',
              reading:
                'The computable one. Expanding it gives a polynomial of degree n whose roots are the eigenvalues.',
            },
            {
              formula: 'Eλ = null(A − λI)',
              reading:
                'Where the eigenvectors live. Row-reduce and read the free variables off; the number of them is the geometric multiplicity.',
            },
          ]}
          legend={[
            {
              sym: 'λ',
              name: 'An eigenvalue',
              note: 'Said "lambda". The stretch factor.',
              val: 'a real or complex number',
            },
            {
              sym: 'x',
              name: 'An eigenvector',
              note: 'The direction that survives. Never the zero vector.',
              val: 'a whole line',
            },
            {
              sym: 'I',
              name: 'The identity',
              note: 'Needed so λ can be subtracted from a matrix at all.',
              val: 'n × n',
            },
            {
              sym: 'Eλ',
              name: 'The eigenspace',
              note: 'The eigenvectors of λ plus 0. A subspace.',
              val: 'null(A − λI)',
            },
          ]}
        />
      </Explainers>

      <FromLecture
        items={[
          { href: '/session/lec4/eigendef', label: 'Lecture 4 · the definition' },
          { href: '/session/lec4/example', label: 'Lecture 4 · the worked example' },
          { href: '/session/lec4/procedure', label: 'Lecture 4 · where it runs short' },
          { href: '/session/lec4/eigenspace', label: 'Lecture 4 · the eigenspace' },
          { href: '/session/lec4/charpoly', label: 'Lecture 4 · the characteristic polynomial' },
        ]}
      />

      <UsedInAiml
        rows={[
          {
            what: 'PCA is an eigenvector calculation and nothing else',
            how: 'Take the covariance matrix of centred data, find its eigenvectors, and each one is a direction in feature space whose eigenvalue is the variance along it. “Reduce to two dimensions” means keeping the two with the largest eigenvalues.',
          },
          {
            what: 'PageRank is the eigenvector for λ = 1',
            how: 'Model a surfer clicking links at random and the steady-state distribution is the vector the link matrix leaves unchanged. Ax = x, solved by power iteration on a matrix with billions of rows.',
          },
          {
            what: 'Spectral clustering cuts a graph with them',
            how: 'The eigenvectors of the graph Laplacian, for the smallest eigenvalues, separate weakly-connected groups. A large gap between the k-th and (k+1)-th eigenvalue is the evidence that k clusters are really there.',
          },
          {
            what: 'The largest eigenvalue sets the safe learning rate',
            how: 'Gradient descent on a quadratic loss converges only when η is below 2 divided by the largest eigenvalue of the Hessian. That is a hard bound, not a guideline — the linear regression session computes it and watches training diverge past it.',
          },
          {
            what: 'Repeated eigenvalues make components arbitrary',
            how: 'When two eigenvalues tie, their eigenspace is a plane and any rotation within it is as valid a pair of components. It is why individual principal components are only interpretable when their eigenvalues are clearly separated.',
          },
          {
            what: 'Defective matrices break the vanishing-gradient story',
            how: 'The usual explanation — repeated multiplication by W means growth like λᵏ — needs a full set of eigenvectors. A non-normal W can amplify hugely over a few steps with every eigenvalue below 1, which is why orthogonal initialisation is standard for recurrent weights.',
          },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function SpectralDecompConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="The spectral decomposition: A = QΛQᵀ"
        intro="Every symmetric matrix, however tangled it looks, is really three simple things done in a row: a rotation into better axes, a separate stretch along each of those axes, and the rotation undone. Writing it that way makes hard operations — powers, inverses, square roots — into things you do to a list of numbers."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine stretching a photograph. If you stretch along the edges of the frame it is easy to describe: 40%
            wider, 10% shorter, done. If you stretch along some slanted line instead, describing the result in terms of
            the frame becomes a mess of numbers that mix the two directions together.
          </>,
          <>
            The spectral decomposition says every symmetric matrix is the easy kind of stretch{' '}
            <em>in the right frame</em>. Q is the instruction for turning to that frame, Λ is the list of stretches, and
            Qᵀ turns back. Nothing is mixed with anything; the mixing you saw in A was only ever the frame being wrong.
          </>,
        ]}
        mappings={[
          {
            title: 'Q — the new axes',
            body: 'The orthonormal eigenvectors, one per column. QᵀQ = I, so its inverse is free: it is just the transpose.',
          },
          {
            title: 'Λ — the stretches',
            body: 'Diagonal, holding the eigenvalues, each lined up with its own column of Q. Multiplying by it mixes nothing.',
          },
          {
            title: 'Read right to left',
            body: 'Qᵀ measures x in the new axes, Λ scales each measurement, Q writes the answer back in the ordinary ones.',
          },
        ]}
        footnote="The lab below multiplies the three factors back together and prints the largest disagreement with A, so the identity is checked rather than claimed."
      />

      <H2>Why symmetry is the price of admission</H2>
      <P>
        The <strong>spectral theorem</strong> is what licences the whole thing: if A is symmetric then its eigenvalues
        are all real, and it has an orthonormal basis of eigenvectors. Both halves are needed. Real eigenvalues mean Λ
        contains ordinary numbers you can sort. Orthonormal eigenvectors mean Q is an orthogonal matrix, which is the
        only reason the third factor can be written Qᵀ rather than the much more expensive Q⁻¹.
      </P>
      <P>
        Drop the symmetry and both promises go. The lab below collects the eigenvectors of each eigenvalue and tries to
        string them into a basis; on the third preset there are not enough to go round.
      </P>

      <Lab>
        <SpectralBasisLab />
      </Lab>

      <H2>Building it, and checking it</H2>
      <P>
        The construction is mechanical. Find each eigenvalue, find a basis for its eigenspace, divide each vector by its
        own length, and stack them as the columns of Q. Put the matching eigenvalues down the diagonal of Λ in the same
        order. Then multiply QΛQᵀ back out and you should get A.
      </P>
      <P>
        That last step is not a formality — it is the only honest way to know the construction was done right, and it is
        what the lab prints.
      </P>

      <Lab>
        <SpectralDecompLab />
      </Lab>

      <H2>What it is actually for</H2>
      <P>
        Anything you can do to a diagonal matrix, you can now do to A. Because QᵀQ = I, the inner factors collapse
        whenever you multiply A by itself:
      </P>
      <P>
        A² = QΛQᵀ · QΛQᵀ = QΛ(QᵀQ)ΛQᵀ = QΛ²Qᵀ. The same collapse gives A⁵⁰ = QΛ⁵⁰Qᵀ, A⁻¹ = QΛ⁻¹Qᵀ, and — the one machine
        learning uses most — A<sup>−1/2</sup> = QΛ<sup>−1/2</sup>Qᵀ. Raising a diagonal matrix to a power means raising
        each diagonal entry to that power, which is no work at all.
      </P>

      <Explainers
        plain="A symmetric matrix A can be written QΛQᵀ, where Q holds its orthonormal eigenvectors as columns and Λ is diagonal with the matching eigenvalues. Because the eigenvectors are orthonormal, QᵀQ = I and Q⁻¹ = Qᵀ. Read right to left the three factors are: measure a vector in the eigenvector axes, scale each measurement by its own eigenvalue, write the result back in ordinary coordinates. Powers, inverses and square roots of A all become the same operation applied to the diagonal of Λ."
        breaks="It needs A symmetric. A general square matrix may still be diagonalisable as QΛQ⁻¹, but Q is then not orthogonal, so the transpose shortcut is gone and the eigenvector axes are not at right angles — which destroys the clean accounting of variance that makes PCA useful. A defective matrix cannot be diagonalised at all. And a rectangular data matrix has no eigenvalues of its own, which is why the move is always to build AᵀA or AAᵀ first: those are square and symmetric, and that step is exactly where the singular-value decomposition comes from."
      >
        <MathBlock
          intro="Four lines. The first is the theorem and the rest are what it buys you."
          formulas={[
            {
              formula: 'A = QΛQᵀ,  A symmetric',
              reading:
                'Eigenvectors into the columns of Q, eigenvalues down Λ. The spectral theorem is what guarantees enough of them exist.',
            },
            {
              formula: 'QᵀQ = QQᵀ = I,  so Q⁻¹ = Qᵀ',
              reading:
                'What "orthonormal columns" means in one line, and the only reason the third factor is a transpose.',
            },
            {
              formula: 'Aᵏ = QΛᵏQᵀ',
              reading:
                'The inner QᵀQ collapses to I every time. Raising a diagonal matrix to a power is done entry by entry.',
            },
            {
              formula: 'Σ^(−1/2) = QΛ^(−1/2)Qᵀ',
              reading: 'Whitening: the transform that turns correlated features into a cloud with identity covariance.',
            },
          ]}
          legend={[
            { sym: 'Q', name: 'Orthonormal eigenvectors', note: 'One per column. Its inverse is free.', val: 'n × n' },
            { sym: 'Λ', name: 'The eigenvalues', note: 'Capital lambda. Diagonal, same order as Q.', val: 'n × n' },
            {
              sym: 'Qᵀ',
              name: 'The rotation undone',
              note: 'Turns coordinates back into the ordinary axes.',
              val: 'n × n',
            },
            {
              sym: 'AᵀA',
              name: 'The square, symmetric stand-in',
              note: 'What a rectangular data matrix is replaced by.',
              val: 'n × n',
            },
          ]}
        />
      </Explainers>

      <FromLecture
        items={[
          { href: '/session/lec4/spectral', label: 'Lecture 4 · the spectral theorem' },
          { href: '/session/lec4/decomp', label: 'Lecture 4 · A = QΛQᵀ' },
          { href: '/session/lec4/realeigs', label: 'Lecture 4 · why symmetric means real' },
          { href: '/session/lec3/orthobasis', label: 'Lecture 3 · orthonormal bases' },
        ]}
      />

      <UsedInAiml
        rows={[
          {
            what: 'PCA is this decomposition, applied to a covariance matrix',
            how: 'Q holds the principal components, Λ holds the variance along each. Keeping the first k columns is the projection, and their share of the trace of Λ is the “variance explained”.',
          },
          {
            what: 'Whitening is Σ^(−1/2), computed exactly this way',
            how: 'Decompose, take each eigenvalue to the power −½, rebuild. The result turns correlated features into a cloud with identity covariance — and batch normalisation is a cheap diagonal-only approximation of it.',
          },
          {
            what: 'It is how a broken kernel matrix gets repaired',
            how: 'A kernel or covariance matrix that has picked up a small negative eigenvalue from rounding is fixed by decomposing, clipping the diagonal of Λ at zero, and multiplying back. Nothing else restores positive semi-definiteness so directly.',
          },
          {
            what: 'The condition number is read straight off Λ',
            how: 'Largest eigenvalue over smallest. It predicts both how much accuracy a linear solve will lose and how slowly gradient descent will crawl down a stretched valley.',
          },
          {
            what: 'Singular-value decomposition is this idea for non-square matrices',
            how: 'A data matrix X has no eigenvalues of its own, so SVD applies the spectral theorem to XᵀX and XXᵀ instead. Truncated SVD, latent semantic analysis and low-rank approximation are all that construction.',
          },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function TraceConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="The trace"
        intro="Add up the numbers on the diagonal and stop. It is the simplest thing you can do to a square matrix, and it would be a curiosity rather than a tool were it not for two facts: it is the sum of the eigenvalues, and it survives having a product turned round."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A matrix that transforms space has, hidden in it, a number saying how much it expands or contracts overall.
            The determinant is the multiplicative version of that — how volume scales. The <strong>trace</strong> is the
            additive version, and it happens to be far easier to compute: you look at n numbers instead of doing n!
            multiplications.
          </>,
          <>
            The property that makes it genuinely useful is that <strong>tr(AB) = tr(BA)</strong>, even when AB and BA
            are different sizes. That single line is what lets derivations in machine learning shuffle matrices around
            until the one you are differentiating with respect to is on the outside.
          </>,
        ]}
        mappings={[
          {
            title: 'tr(A) = Σᵢ aᵢᵢ',
            body: 'The definition. Only square matrices have one, because only they have a diagonal that goes corner to corner.',
          },
          {
            title: 'Linear',
            body: 'tr(A + B) = tr A + tr B and tr(αA) = α tr A. The diagonal of a sum is the sum of the diagonals.',
          },
          {
            title: 'tr(AB) = tr(BA)',
            body: 'The cyclic property. Both are the sum of every aᵢⱼbⱼᵢ, read in two different orders.',
          },
        ]}
        footnote="The second lab checks the sum of the eigenvalues against the trace on any matrix you type in, including ones whose eigenvalues are irrational or complex."
      />

      <H2>The four rules</H2>
      <P>
        Three are exactly what you would guess. tr(A + B) = tr(A) + tr(B), because the diagonal of a sum is the sum of
        the diagonals. tr(αA) = α·tr(A), because multiplying the matrix multiplies its diagonal. And tr(Iₙ) = n, because
        the identity has n ones down its diagonal and nothing else.
      </P>
      <P>
        The fourth is the interesting one. If A is n × k and B is k × n, then AB is n × n and BA is k × k — different
        matrices, of different sizes — and their traces are still equal. Both are the sum of aᵢⱼbⱼᵢ over every i and
        every j; one walks that grid row-first and the other column-first, and adding a finite pile of numbers does not
        care about the order.
      </P>

      <Lab>
        <TraceLab />
      </Lab>

      <H2>The reason it appears in an eigenvalue lecture</H2>
      <P>
        The trace is the <strong>sum of the eigenvalues</strong>, and the determinant is their product. Both come from
        writing the characteristic polynomial as a product over its roots and comparing coefficients with the expansion
        of the determinant.
      </P>
      <P>
        These make two free checks on any eigenvalue answer. Add your eigenvalues and you should get the diagonal sum;
        multiply them and you should get the determinant. If either fails, the answer is wrong before you have even
        looked at the eigenvectors. For a 2 × 2 you can often skip the polynomial entirely: the two eigenvalues are the
        pair of numbers adding to the trace and multiplying to the determinant.
      </P>

      <Lab>
        <TraceEigenLab />
      </Lab>

      <Explainers
        plain="The trace of a square matrix is the sum of its diagonal entries. It is linear — the trace of a sum is the sum of the traces, and scaling the matrix scales it — and tr(Iₙ) = n. Its distinctive property is tr(AB) = tr(BA), which holds even when AB and BA have different sizes, because both are the same collection of products added in a different order. The trace is also the sum of the eigenvalues, which pairs with the determinant being their product."
        breaks="Two traps. The cyclic property lets you rotate letters round a product — tr(ABC) = tr(BCA) = tr(CAB) — but it does not let you shuffle them: tr(ABC) is generally not tr(ACB). And the trace exists only for square matrices, so a data matrix has no trace until you form XᵀX or XXᵀ from it. Note too that those two have different sizes and, in general, different eigenvalues, yet the same trace — the extra eigenvalues of the larger one are all zero."
      >
        <MathBlock
          intro="Five lines, and the last two are why the trace is in an eigenvalue lecture at all."
          formulas={[
            { formula: 'tr(A) = Σᵢ aᵢᵢ', reading: 'Add the diagonal. Square matrices only.' },
            {
              formula: 'tr(A + B) = tr(A) + tr(B),  tr(αA) = α tr(A)',
              reading: 'Linear in the matrix. Only the diagonal is ever looked at, so everything else can be anything.',
            },
            {
              formula: 'tr(Iₙ) = n',
              reading: 'n ones. It is why tr(H) counts effective degrees of freedom for a projection.',
            },
            {
              formula: 'tr(AB) = tr(BA),  A ∈ ℝⁿˣᵏ, B ∈ ℝᵏˣⁿ',
              reading: 'AB is n × n and BA is k × k. Different sizes, same trace — both are Σᵢ Σⱼ aᵢⱼbⱼᵢ.',
            },
            {
              formula: 'Σᵢ λᵢ = tr(A),   Πᵢ λᵢ = det(A)',
              reading: 'From comparing coefficients in pₐ(λ) = Π(λᵢ − λ). Two free checks on any eigenvalue answer.',
            },
          ]}
          legend={[
            { sym: 'tr A', name: 'The trace', note: 'The diagonal added up.', val: 'a single number' },
            { sym: 'Σᵢ', name: 'Sum over i', note: 'Add up as the counter i runs through its range.', val: '1 to n' },
            { sym: 'α', name: 'A scalar', note: 'An ordinary number used as a multiplier.', val: 'real' },
            {
              sym: 'λᵢ',
              name: 'The eigenvalues',
              note: 'Counted with repeats, complex ones included.',
              val: 'n of them',
            },
          ]}
        />
      </Explainers>

      <FromLecture
        items={[
          { href: '/session/lec4/trace', label: 'Lecture 4 · the trace' },
          { href: '/session/lec4/traceeigs', label: 'Lecture 4 · sum and product of eigenvalues' },
          { href: '/session/lec4/charpoly', label: 'Lecture 4 · the characteristic polynomial' },
        ]}
      />

      <UsedInAiml
        rows={[
          {
            what: 'The trace trick moves matrices in a derivation',
            how: 'Any scalar equals its own trace, so xᵀAx can be written tr(Axxᵀ) and the cyclic property then moves whatever you are differentiating to the outside. Every derivation of the Gaussian maximum-likelihood covariance uses this line.',
          },
          {
            what: 'tr(H) is the effective degrees of freedom',
            how: 'For a linear model with fitted values ŷ = Hy, the trace of the hat matrix counts how many parameters are really being spent. It equals the number of columns for ordinary least squares and falls as a ridge penalty rises — which makes “how much has the regulariser restrained this?” a measurable question.',
          },
          {
            what: 'tr(Σ) is the total variance, so PCA percentages come from it',
            how: 'The variance explained by the first k components is their eigenvalues divided by the trace of the covariance matrix. The trace can be read off the diagonal without computing a single eigenvalue.',
          },
          {
            what: 'The nuclear norm is a trace, and it is how matrix completion works',
            how: 'Sum of singular values, which for a positive semi-definite matrix is its trace. Minimising it is the convex stand-in for minimising rank, and it is what recommender systems use to fill in a sparse ratings matrix.',
          },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function CholeskyConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Cholesky decomposition"
        intro="Some matrices have a square root. A symmetric positive definite A can be written as L times its own transpose, where L is lower triangular — half a matrix that reproduces the whole one when multiplied by its mirror image. It is cheap, it is the standard test for positive definiteness, and it is how every correlated random sample in machine learning is drawn."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A positive number has a real square root and a negative one does not. That is the whole analogy: a{' '}
            <strong>positive definite</strong> matrix has a real L with A = LLᵀ, and a matrix that is not positive
            definite does not — and the algorithm finds out by trying to take the square root of a negative number and
            stopping.
          </>,
          <>
            That failure is a feature rather than a nuisance. Attempting a Cholesky is the cheapest reliable way to ask
            “is this matrix positive definite?”, which is a question worth asking of every covariance matrix and every
            kernel matrix before it is used.
          </>,
        ]}
        mappings={[
          {
            title: 'A = LLᵀ',
            body: 'L is lower triangular with a positive diagonal. Only one triangle is ever stored, so it uses half the memory of an LU.',
          },
          {
            title: 'One rule, applied downwards',
            body: 'A diagonal entry is the square root of what is left after the squares to its left; an entry below it is its leftover divided by the diagonal above.',
          },
          {
            title: 'Σ = LLᵀ, then Lz',
            body: 'Independent noise in, correlated sample out. The reason the decomposition is in a machine learning course at all.',
          },
        ]}
        footnote="The first lab prints the six formulas with your numbers substituted in, then multiplies L by Lᵀ and reports the largest disagreement with A."
      />

      <H2>Where the formulas come from</H2>
      <P>
        Nothing is conjured. Write A = LLᵀ out as a product and compare entries one at a time. The top-left entry of LLᵀ
        is row 1 of L dotted with column 1 of Lᵀ, which is l₁₁ times itself — so a₁₁ = l₁₁², giving l₁₁ = √a₁₁. The
        entry below it is l₂₁l₁₁, so l₂₁ = a₂₁/l₁₁. The next diagonal is l₂₁² + l₂₂², so l₂₂ = √(a₂₂ − l₂₁²).
      </P>
      <P>
        Read down them and one rule is doing all the work. Every formula uses only values already worked out, which is
        why the whole factorisation can be done in a single pass with no going back.
      </P>
      <P>
        Positive definiteness is what keeps the quantities under those square roots positive. Take it away and the
        algorithm stops — not with a wrong answer, but with no answer, which is exactly what you want from a test.
      </P>

      <Lab>
        <CholeskyLab />
      </Lab>

      <H2>What it is for: sampling</H2>
      <P>
        Generating one Gaussian random number is easy. Generating a whole vector of them whose components have to lean
        on each other in a specific pattern is not obvious — and Cholesky makes it three lines.
      </P>
      <P>
        Factor the covariance matrix as Σ = LLᵀ. Draw a vector z of independent standard normals, which has covariance
        I. Compute Lz. Then Cov(Lz) = L·Cov(z)·Lᵀ = L·I·Lᵀ = LLᵀ = Σ, so the result is a sample from exactly the
        distribution you wanted. Add a mean vector μ on the front if the distribution is not centred at the origin.
      </P>
      <P>
        In the lab, the grey cloud is z — round, and the same in every direction. The teal cloud is the same points
        after L, and it leans according to the correlation you set.
      </P>

      <Lab>
        <GaussianSampleLab />
      </Lab>

      <Explainers
        plain="A symmetric positive definite matrix A factorises as LLᵀ with L lower triangular and its diagonal positive. The entries are found by multiplying LLᵀ out and comparing with A one entry at a time, working left to right and top to bottom, so each formula uses only values already computed. Because three of the formulas take square roots, the factorisation exists exactly when the matrix is positive definite — which makes a Cholesky attempt the standard test for that property. Its main use is sampling: if Σ = LLᵀ and z is a vector of independent standard normals, then μ + Lz is a sample from the Gaussian with mean μ and covariance Σ."
        breaks="It needs both conditions. A symmetric matrix that is not positive definite has no real factor, and a matrix that is not symmetric is not a candidate at all. In floating point a matrix that is positive definite in theory can fail in practice — a covariance matrix from too few samples, or a kernel matrix with two nearly-identical inputs, can have a smallest eigenvalue that rounding pushes below zero. The universal repair is to add a small multiple of the identity, called jitter, which lifts every eigenvalue and is ridge regression's λI wearing a different name."
      >
        <MathBlock
          intro="Four lines: the theorem, the rule, the test, and the reason anyone in machine learning cares."
          formulas={[
            {
              formula: 'A symmetric positive definite ⟹ A = LLᵀ',
              reading:
                'L lower triangular with a positive diagonal. Often called the matrix square root, and the comparison is fair.',
            },
            {
              formula: 'lᵢᵢ = √(aᵢᵢ − Σₖ₍ₖ₌ᵢ₎ lᵢₖ²),   lᵢⱼ = (aᵢⱼ − Σₖ lᵢₖlⱼₖ) / lⱼⱼ',
              reading:
                'One rule down the diagonal, one below it. Each uses only entries already worked out, so it is a single pass.',
            },
            {
              formula: 'log det A = 2 Σᵢ log lᵢᵢ',
              reading:
                'The log-determinant falls out of the same factorisation for free — which is how every Gaussian likelihood computes it.',
            },
            {
              formula: 'Σ = LLᵀ,  z ~ N(0, I)  ⟹  μ + Lz ~ N(μ, Σ)',
              reading:
                'Because Cov(Lz) = L I Lᵀ = Σ. The reparameterisation trick, and the Gaussian process sampling step.',
            },
          ]}
          legend={[
            { sym: 'L', name: 'The Cholesky factor', note: 'Lower triangular, positive diagonal.', val: 'n × n' },
            {
              sym: 'Σ',
              name: 'A covariance matrix',
              note: 'Symmetric and positive definite by construction.',
              val: 'n × n',
            },
            {
              sym: 'z',
              name: 'Independent noise',
              note: 'Standard normals, covariance I. The easy thing to generate.',
              val: 'n × 1',
            },
            {
              sym: 'jitter',
              name: 'The practical repair',
              note: 'A small multiple of I added when the factorisation fails.',
              val: '≈ 10⁻⁶',
            },
          ]}
        />
      </Explainers>

      <FromLecture
        items={[
          { href: '/session/lec4/cholesky', label: 'Lecture 4 · A = LLᵀ' },
          { href: '/session/lec4/gaussian', label: 'Lecture 4 · sampling a Gaussian' },
          { href: '/session/lec4/properties', label: 'Lecture 4 · positive definite means positive λ' },
          { href: '/session/lec0a/posdef', label: 'Lecture 0a · positive definite' },
        ]}
      />

      <UsedInAiml
        rows={[
          {
            what: 'The reparameterisation trick in a variational autoencoder',
            how: 'The encoder outputs μ and a covariance, and the sample is z = μ + Lε with ε standard Gaussian. Written that way the randomness carries no parameters, so gradients flow through μ and L — sampling directly would put an undifferentiable step in the middle of the graph.',
          },
          {
            what: 'Gaussian process regression is built on it end to end',
            how: 'The predictive mean needs K⁻¹y, which is solved through the Cholesky factor rather than by inverting; the marginal likelihood needs log det K, which is twice the sum of the logs of L’s diagonal. Both come out of one factorisation.',
          },
          {
            what: 'A failed Cholesky is the standard positive-definiteness test',
            how: 'Cheaper and more reliable than computing every eigenvalue and checking signs, and it is what scipy.linalg.cho_factor raising LinAlgError actually means.',
          },
          {
            what: 'Jitter is the universal fix, and it is ridge again',
            how: 'When rounding pushes a kernel matrix’s smallest eigenvalue slightly negative, adding about 10⁻⁶ times the identity lifts every eigenvalue back above zero. Exactly the λI that ridge regression adds to XᵀX, for exactly the same reason.',
          },
          {
            what: 'It is how correlated noise and uncertainty bands are generated',
            how: 'Drawing functions from a posterior, simulating correlated errors, producing the shaded band around a forecast — all of them are factor the covariance, draw independent normals, multiply.',
          },
        ]}
      />
    </div>
  )
}
