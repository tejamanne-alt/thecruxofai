/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { CholeskyLab, GaussianSampleLab } from '@/components/charts/eigen-cholesky-lab'
import {
  CharPolyLab,
  DeckEigenLab,
  DefectiveLab,
  EigenDefLab,
  EigenspaceLab,
  GramMatrixLab,
  TransposeSpdLab,
} from '@/components/charts/eigen-core-lab'
import {
  DecompositionMapLab,
  DetProofLab,
  RankDetLab,
  SymbolicCofactorLab,
  TraceLab,
} from '@/components/charts/eigen-det-lab'
import {
  ComplexLengthLab,
  HermitianLab,
  SpectralBasisLab,
  SpectralDecompLab,
  SymmetricProofLab,
  TraceEigenLab,
} from '@/components/charts/eigen-spectral-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

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

/** Material that is not on the slides, marked so it can never be mistaken for the deck. */
function Beyond({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-dashed border-zinc-950/20 bg-white px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        Not on the slides — added to make this land
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-700">{children}</div>
    </div>
  )
}

export const LEC4_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  why: (
    <>
      <Para>
        The three lectures before this one built the objects. Lecture 1 solved systems of equations, Lecture 2 said what
        a vector space is, and Lecture 3 put a ruler and a protractor into one. Slide 1 now points at what has been
        quietly doing the work all along: every one of those moves and stretches was{' '}
        <strong>a matrix acting on a vector</strong>.
      </Para>
      <Para>
        So this lecture turns round and studies the matrix itself. It names three things you might want to do with one,
        and the whole deck is the first two of them.
      </Para>
      <List
        items={[
          <>
            <strong>Summarise it.</strong> Replace a whole box of numbers with one or two numbers that tell you
            something useful about it. The determinant and the trace, which are parts 2 to 5.
          </>,
          <>
            <strong>Decompose it.</strong> Write A as a product of simpler matrices, each of which does one plain thing.
            A = QΛQᵀ in part 17 and A = LLᵀ in part 19.
          </>,
          <>
            <strong>Use the decompositions to approximate it.</strong> Throw away the small pieces of a decomposition
            and keep a matrix that is nearly as good and much smaller.
          </>,
        ]}
      />
      <Para>
        Be careful with that third one. It is named on slide 1 and then named once more, in a single sentence on slide
        28, where AᵀA and AAᵀ are handed on to singular-value decomposition and PCA. This deck does not work through it,
        so nothing on these pages pretends it did.
      </Para>

      <Para>
        The lab below is the map. Type a matrix into it and it tells you which of the lecture’s tools that matrix
        qualifies for, because both decompositions ask something of A before they will work at all.
      </Para>

      <Lab>
        <DecompositionMapLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'decomposition',
            say: 'dee-com-poh-ZISH-un',
            def: 'Writing one matrix as a product of two or three simpler ones. Also called a factorisation, exactly as 12 = 3 × 4 factorises a number.',
          },
          {
            term: 'scalar',
            def: 'An ordinary single number, as opposed to a vector or a matrix. The determinant and the trace are both scalars.',
          },
          {
            term: 'symmetric',
            def: 'A matrix that is unchanged when you flip it across its main diagonal, so aᵢⱼ = aⱼᵢ. Covariance matrices are always symmetric.',
          },
          {
            term: 'positive definite',
            def: 'A stronger promise than symmetric: xᵀAx > 0 for every non-zero x. Lecture 0a has a page on it; part 11 here connects it to the eigenvalues.',
          },
          {
            term: 'Λ',
            say: 'capital lambda',
            def: 'The diagonal matrix of eigenvalues in part 17. Lower-case λ is one eigenvalue; capital Λ is the whole collection of them arranged down a diagonal.',
          },
        ]}
      />

      <WhyAiml method="numpy.linalg.eigh · scipy.linalg.cho_factor · sklearn.decomposition.PCA">
        <p className="mb-2">
          Every numerical library has two doors into eigenvalues and picks between them on exactly the property this lab
          reports. <strong>numpy.linalg.eig</strong> is the general one and can hand you back complex numbers;{' '}
          <strong>numpy.linalg.eigh</strong> is the one for symmetric matrices, and it is both faster and more accurate
          because it can assume everything parts 13 to 17 prove. Cholesky has a door of its own,{' '}
          <strong>scipy.linalg.cho_factor</strong>, and it refuses anything that is not positive definite.
        </p>
        <p>
          Getting the door wrong is a quiet disaster rather than a loud one. <strong>eigh</strong> reads only one
          triangle of the matrix you give it and assumes the other is its mirror — so handing it a matrix that is not
          symmetric does not raise an error, it silently answers a question about a different matrix. That is why a
          covariance matrix computed from data is usually symmetrised before use: floating-point rounding can leave the
          two triangles disagreeing in the last few digits.
        </p>
      </WhyAiml>

      <Takeaway>
        Summarise, decompose, approximate. This lecture does the first two thoroughly and points at the third. Both
        decompositions have entry requirements: A = QΛQᵀ needs symmetric, A = LLᵀ needs symmetric and positive definite.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  cofactor: (
    <>
      <Para>
        A <strong>determinant</strong> is one number attached to a square matrix. Slide 2 writes it two ways — det(A),
        and the same grid of numbers inside plain vertical bars instead of brackets. The bars matter: square brackets
        around a grid mean “here is a matrix”, and vertical bars around the same grid mean “here is the one number that
        grid gives you”.
      </Para>
      <Para>
        For a 1 × 1 matrix there is nothing to do: det(A) = a₁₁. For anything bigger, slide 2 gives the{' '}
        <strong>cofactor formula</strong>, and it comes in two flavours that always agree.
      </Para>
      <Formula>
        D = det(A) = aⱼ₁Cⱼ₁ + aⱼ₂Cⱼ₂ + … + aⱼₙCⱼₙ
        <br />D = det(A) = a₁ₖC₁ₖ + a₂ₖC₂ₖ + … + aₙₖCₙₖ
      </Formula>
      <Para>
        The first line walks along <strong>row j</strong>, whichever row you fancy. The second walks down{' '}
        <strong>column k</strong>. In both, each entry is multiplied by its own <strong>cofactor</strong> and the
        results are added up.
      </Para>

      <Para>So what is a cofactor? Slide 3 answers it in two steps.</Para>
      <List
        items={[
          <>
            The <strong>minor</strong> Mⱼₖ is what you get by crossing out row j and column k of A and taking the
            determinant of the smaller matrix that is left. For a 3 × 3 that leaves a 2 × 2, which you already know how
            to do.
          </>,
          <>
            The <strong>cofactor</strong> Cⱼₖ is that minor with a sign stuck on the front: Cⱼₖ = (−1)ʲ⁺ᵏ Mⱼₖ. Add the
            row number to the column number; if the total is even the sign is plus, if it is odd the sign is minus.
          </>,
        ]}
      />
      <Para>
        Slide 3 then makes the point that decides how this is actually computed: an n × n determinant is defined in
        terms of (n − 1) × (n − 1) determinants, which are defined in terms of (n − 2) × (n − 2) ones, and so on down.
        The definition calls itself. Eventually it reaches 1 × 1, where there is nothing left to do.
      </Para>

      <Worked title="The signs, laid out as a board">
        {`  +  −  +  −
  −  +  −  +
  +  −  +  −
  −  +  −  +`}
      </Worked>
      <Para>
        Nobody works out (−1)ʲ⁺ᵏ in an exam. You remember that the top-left corner is a plus and that the signs
        alternate in both directions, and you read the sign off the board.
      </Para>

      <Para>
        Slide 4 does the whole thing in symbols, expanding along the second row. The lab below is that slide, made live:
        pick any row or any column and watch the three minors, the three signs and the running total. The numeric copy
        of the matrix beside it lets you check that the total really does not depend on which line you chose.
      </Para>

      <Lab>
        <SymbolicCofactorLab />
      </Lab>

      <Beyond>
        Why does anyone care that you may pick the row? Because a row with zeros in it costs nothing: a zero entry kills
        its whole term before the minor is even worked out. Given a matrix with a mostly-empty row, expanding along that
        row can turn a nine-term job into a two-term one.
      </Beyond>

      <Terms
        items={[
          {
            term: 'det(A)',
            say: 'det of A',
            def: 'The determinant. Also written with vertical bars round the grid of entries, which means the same thing.',
          },
          {
            term: 'Mⱼₖ',
            say: 'M jay kay',
            def: 'The minor of the entry in row j, column k: the determinant of what is left after that row and that column are crossed out.',
          },
          {
            term: 'Cⱼₖ',
            say: 'C jay kay',
            def: 'The cofactor: the minor with the sign (−1)ʲ⁺ᵏ in front of it.',
          },
          {
            term: 'expansion along a row',
            def: 'Working the determinant out by walking along one row, multiplying each entry by its cofactor and adding.',
          },
          {
            term: 'recursive',
            say: 'ree-CUR-siv',
            def: 'A definition that uses itself on a smaller case. The determinant of a 4 × 4 is written in terms of 3 × 3s, which are written in terms of 2 × 2s.',
          },
        ]}
      />

      <WhyAiml method="numpy.linalg.det · numpy.linalg.slogdet · the LU route">
        <p className="mb-2">
          The determinant is the test for a <strong>singular covariance matrix</strong>, and a singular covariance
          matrix is what you get when two of your features are the same thing measured twice. It appears by name inside
          the multivariate Gaussian: the density carries a factor of 1/√det(Σ), so a determinant of zero means the
          distribution has collapsed onto a lower-dimensional sheet and the density is not defined at all.
        </p>
        <p>
          The formula on this page is never what a library runs. Expanding by cofactors costs roughly n! operations —
          for a 20 × 20 matrix that is more multiplications than there are seconds in the age of the universe. So{' '}
          <strong>numpy.linalg.det</strong> does an LU factorisation instead and multiplies the diagonal, which is n³/3
          operations, and part 4 on this chapter is the theorem that says the two answers agree. For anything
          statistical you want <strong>slogdet</strong> rather than <strong>det</strong>: the determinant of a 100 × 100
          covariance matrix overflows or underflows a float long before it is interesting, and only its logarithm is
          ever actually used.
        </p>
      </WhyAiml>

      <Takeaway>
        Minor: cross out a row and a column, take the determinant of the rest. Cofactor: the minor with (−1)ʲ⁺ᵏ on it.
        Determinant: walk along any row or any column, multiply each entry by its cofactor, add. Every line gives the
        same answer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  detproof: (
    <>
      <Para>
        Slide 5 states a theorem about what the elementary row operations do to a determinant, and then — unusually for
        a slide deck — actually proves it over the next three slides. It is worth following, because the proof is the
        reason the next result is allowed to swap Gaussian elimination for the cofactor formula.
      </Para>
      <Para>The theorem has two halves:</Para>
      <List
        items={[
          <>
            <strong>(a)</strong> interchanging two rows multiplies the determinant by −1;
          </>,
          <>
            <strong>(b)</strong> adding a multiple of one row to another row does not change it at all.
          </>,
        ]}
      />

      <Para>
        The proof of (a) is by <strong>induction</strong>. That word sounds heavier than it is. You show the claim for
        the smallest case, then show that if it is true for one size it must be true for the next size up — and those
        two together carry it all the way up for free, like knocking over the first domino.
      </Para>

      <Worked title="The base case, n = 2">
        {`| a  b |            | c  d |
| c  d |  = ad − bc  | a  b |  = bc − ad = −(ad − bc)`}
      </Worked>
      <Para>
        That is the whole of the smallest case. Now the step. Assume the claim holds for every determinant of size n −
        1. Let D be the original and E be D with two rows swapped. Expand <em>both</em> along a row that was not one of
        the two swapped — slide 6 is careful about this, and it is the hinge of the argument.
      </Para>
      <Formula>D = Σₖ (−1)ʲ⁺ᵏ aⱼₖ Mⱼₖ and E = Σₖ (−1)ʲ⁺ᵏ aⱼₖ Nⱼₖ</Formula>
      <Para>
        The entries aⱼₖ are the same in both sums, because row j was not touched. The minors are not: Nⱼₖ is Mⱼₖ with
        the same two rows exchanged, and both are determinants of size n − 1. So by the assumption, Mⱼₖ = −Nⱼₖ. Every
        single term flips sign, and therefore D = −E.
      </Para>

      <Para>
        Now (b), on slide 7. Add c times row i to row j. Every entry of the new row j is aⱼₖ + c·aᵢₖ, so expanding along
        it splits the sum in two.
      </Para>
      <Formula>D′ = Σₖ (−1)ʲ⁺ᵏ aⱼₖ Mⱼₖ + Σₖ (−1)ʲ⁺ᵏ c·aᵢₖ Mⱼₖ = D₁ + cD₂</Formula>
      <Para>
        D₁ is the determinant you started with. D₂ is stranger: it is the same matrix except that the entries of row i
        have been written into row j as well, so <strong>two of its rows are identical</strong>. Slide 7 then asks the
        reader a question — why does that make D₂ zero?
      </Para>
      <Para>Slide 8 answers it, and the answer uses part (a) that was just proved:</Para>
      <List
        items={[
          <>
            Swap those two identical rows. The matrix on the page is completely unchanged, so the determinant is the
            same number.
          </>,
          <>But (a) says a swap negates the determinant, so it is also minus that number.</>,
          <>
            A number equal to its own negative has only one possible value. D₂ = 0, so D′ = D₁ = D, and adding a
            multiple of a row changed nothing.
          </>,
        ]}
      />

      <Para>
        The lab runs all three of those on a matrix you can edit. The middle chip is the D₂ = 0 argument on its own,
        because that is the step people skip.
      </Para>

      <Lab>
        <DetProofLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'induction',
            say: 'in-DUCK-shun',
            def: 'Proving something for every size at once: show it for the smallest, then show that each size forces the next one.',
          },
          {
            term: 'induction hypothesis',
            def: 'The thing you are allowed to assume during the step — here, that the swap rule already holds for determinants of size n − 1.',
          },
          {
            term: 'Nⱼₖ',
            say: 'N jay kay',
            def: 'The deck’s name for the minors of the swapped matrix E, so they can be compared with the minors Mⱼₖ of D.',
          },
          {
            term: 'elementary row operation',
            def: 'One of the three legal moves on a matrix: swap two rows, multiply a row by a non-zero number, or add a multiple of one row to another.',
          },
        ]}
      />

      <WhyAiml method="numpy.linalg.slogdet · the log-determinant in a Gaussian log-likelihood">
        <p className="mb-2">
          Rule (b) is the reason a determinant can be computed by elimination at all. Fitting a Gaussian — a mixture
          model, a Gaussian process, linear discriminant analysis — needs log det(Σ) in the log-likelihood on every
          iteration. Nobody expands cofactors for it. The matrix is eliminated into triangular form, the diagonal is
          multiplied, and rule (b) is the guarantee that all that elimination did not quietly change the answer.
        </p>
        <p>
          Rule (a) is the part that gets forgotten and costs a sign. Elimination with <strong>partial pivoting</strong>{' '}
          — which every library does, to keep the arithmetic stable — swaps rows whenever it finds a bigger pivot below.
          Each of those swaps flips the sign of the determinant, so a working implementation has to count them. That is
          what the s is doing in det(A) = (−1)ˢ det(U) on the next page, and it is why LAPACK hands back a permutation
          along with the factors rather than just the factors.
        </p>
      </WhyAiml>

      <Takeaway>
        Swap two rows: the determinant flips sign. Add a multiple of one row to another: nothing happens. A matrix with
        two equal rows has determinant zero, and that single fact is what proves the second rule from the first.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  rankdet: (
    <>
      <Para>
        Slide 9 states the result the previous three slides were building towards, and it is one of the most useful
        sentences in linear algebra.
      </Para>
      <Formula>An n × n matrix A has rank n ⟺ det(A) ≠ 0</Formula>
      <Para>
        The double arrow means the two sides are the same statement. Full rank guarantees a non-zero determinant, and a
        non-zero determinant guarantees full rank. The deck proves both directions, and both run through the same
        machine: Gaussian elimination.
      </Para>

      <Para>
        The starting point is a fact from the previous page written as one line. Eliminating A down to an upper
        triangular U uses only two kinds of move — adding multiples of rows, which changes nothing, and interchanging
        rows, which flips the sign. So if there were s interchanges along the way:
      </Para>
      <Formula>det(A) = (−1)ˢ det(U) = (−1)ˢ · U₁₁U₂₂ … Uₙₙ</Formula>
      <Para>
        The second half of that is because a triangular determinant is simply its diagonal multiplied together — every
        cofactor expansion along the bottom row has only one surviving term, all the way up.
      </Para>

      <Para>Now the two directions. Forwards, from slide 9:</Para>
      <List
        items={[
          <>A has full rank, so its columns are linearly independent, so the only x with Ax = 0 is x = 0.</>,
          <>Elimination does not change the set of solutions, so Ux = 0 has only x = 0 too.</>,
          <>
            That forces every column of U to be a pivot column, and for a triangular U the pivots sit on the diagonal.
          </>,
          <>Every Uᵢᵢ is therefore non-zero, so their product is non-zero, so det(U) — and det(A) — is non-zero.</>,
        ]}
      />
      <Para>Backwards, from slide 10, the same chain read the other way:</Para>
      <List
        items={[
          <>det(A) ≠ 0, so the product of the Uᵢᵢ is non-zero, so not one of them is zero.</>,
          <>Every column of U is then a pivot column, so the columns of U are independent and Ux = 0 has only x = 0.</>,
          <>Ax = 0 has the same solutions, so it has only x = 0, so A has full rank.</>,
        ]}
      />

      <Para>
        The lab does this out loud: it eliminates, counts the interchanges, multiplies the diagonal, and compares the
        result with the determinant computed the other way round by cofactors. The two buttons break a row on purpose so
        you can watch rank and determinant fail at the same instant.
      </Para>

      <Lab>
        <RankDetLab />
      </Lab>

      <Terms
        items={[
          {
            term: '⟺',
            say: 'if and only if',
            def: 'The two statements either side are equivalent: each one being true forces the other. Sometimes written “iff”, which is not a typo.',
          },
          {
            term: 'full rank',
            def: 'For a square n × n matrix, rank n — the largest it could possibly be. Every row, and every column, is carrying information no other one carries.',
          },
          {
            term: 'pivot column',
            def: 'A column that gains a leading entry during elimination. The number of them is the rank.',
          },
          {
            term: 'singular',
            def: 'A square matrix with determinant zero, so no inverse. Non-singular means the opposite. Full rank and non-singular are the same condition.',
          },
          {
            term: 's',
            def: 'The count of row interchanges made during elimination. It appears only as (−1)ˢ, so all that matters is whether it is odd or even.',
          },
        ]}
      />

      <WhyAiml method="multicollinearity · (XᵀX)⁻¹Xᵀy · ridge regression">
        <p className="mb-2">
          This theorem is the whole diagnosis of <strong>multicollinearity</strong>. Linear regression solves the normal
          equations, which need (XᵀX)⁻¹. If two of your columns are linearly dependent — height in centimetres and
          height in inches, or a set of one-hot columns that sum to 1 alongside an intercept — then X is short of full
          column rank, so XᵀX is short of full rank, so its determinant is zero and the inverse does not exist. There is
          no unique best fit, because infinitely many coefficient vectors give exactly the same predictions.
        </p>
        <p>
          What makes it a practical problem rather than a clean error is that data is never exactly dependent. Two
          nearly-collinear features give a determinant that is tiny rather than zero, so the inverse exists but is
          enormous, and the fitted coefficients swing wildly on a change in the last decimal place of one observation.{' '}
          <strong>Ridge regression</strong> is the standard fix and it is this page read backwards: it solves (XᵀX +
          λI)⁻¹Xᵀy, which lifts every eigenvalue by λ and so drags the determinant away from zero by brute force.
        </p>
      </WhyAiml>

      <Takeaway>
        rank n and det ≠ 0 are the same condition, and both are the same as “Ax = 0 only when x = 0”. Elimination is the
        bridge: det(A) = (−1)ˢ det(U), and det(U) is the diagonal multiplied together.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  trace: (
    <>
      <Para>
        The second summary is far simpler than the first. The <strong>trace</strong> of a square matrix is the sum of
        the entries on its main diagonal, and nothing else about the matrix is looked at.
      </Para>
      <Formula>tr(A) = a₁₁ + a₂₂ + … + aₙₙ = Σᵢ aᵢᵢ</Formula>
      <Para>Slide 11 gives four properties. Three of them are exactly what you would guess:</Para>
      <List
        items={[
          <>
            <strong>tr(A + B) = tr(A) + tr(B).</strong> The diagonal of a sum is the sum of the diagonals.
          </>,
          <>
            <strong>tr(αA) = α·tr(A).</strong> Multiplying the whole matrix by a number multiplies the diagonal too.
          </>,
          <>
            <strong>tr(Iₙ) = n.</strong> The identity has n ones down its diagonal.
          </>,
        ]}
      />
      <Para>The fourth is the one worth stopping on.</Para>
      <Formula>tr(AB) = tr(BA) for A ∈ ℝⁿˣᵏ, B ∈ ℝᵏˣⁿ</Formula>
      <Para>
        Read the shapes. A is n × k and B is k × n, so <strong>AB is n × n and BA is k × k</strong>. Those are not the
        same matrix. They are not even the same size. If n is 2 and k is 3 then one of them is a 2 × 2 and the other is
        a 3 × 3 — and their diagonals still add up to the same number.
      </Para>
      <Para>The deck says the proofs are not difficult, which is fair. Here is the fourth one written out:</Para>
      <Worked title="Why the sizes do not matter">
        {`tr(AB) = Σᵢ (AB)ᵢᵢ = Σᵢ Σⱼ aᵢⱼ bⱼᵢ
tr(BA) = Σⱼ (BA)ⱼⱼ = Σⱼ Σᵢ bⱼᵢ aᵢⱼ

Same products, added in the other order.`}
      </Worked>
      <Para>
        Both are the sum of every aᵢⱼbⱼᵢ over every i and every j. One walks the grid row-first and the other
        column-first, and adding a finite pile of numbers does not care about the order.
      </Para>

      <Lab>
        <TraceLab />
      </Lab>

      <Beyond>
        This extends to the <strong>cyclic property</strong>: tr(ABC) = tr(BCA) = tr(CAB), by treating BC as one matrix
        and applying the rule. Note what is <em>not</em> allowed — tr(ABC) is generally not tr(ACB). You may rotate the
        letters round the circle, never shuffle them.
      </Beyond>

      <Terms
        items={[
          {
            term: 'tr(A)',
            say: 'trace of A',
            def: 'The sum of the diagonal entries. Defined only for square matrices — a non-square matrix has no diagonal to speak of.',
          },
          {
            term: 'Σᵢ aᵢᵢ',
            say: 'sum over i of a i i',
            def: 'Sigma means “add up”. The i below it is the counter, and aᵢᵢ picks the entry whose row number and column number are both i.',
          },
          {
            term: 'α',
            say: 'alpha',
            def: 'A plain number used as a multiplier. The deck uses α ∈ ℝ, which reads “alpha is a real number”.',
          },
          {
            term: 'ℝⁿˣᵏ',
            say: 'R n by k',
            def: 'The set of all matrices with n rows and k columns whose entries are real numbers.',
          },
          {
            term: 'Iₙ',
            say: 'I sub n',
            def: 'The n × n identity matrix: ones down the diagonal, zeros everywhere else. Multiplying by it changes nothing.',
          },
        ]}
      />

      <WhyAiml method="the trace trick in matrix calculus · tr(H) as effective degrees of freedom">
        <p className="mb-2">
          tr(AB) = tr(BA) is the single most-used identity in machine-learning derivations. Any scalar can be written as
          its own trace, so a gradient calculation turns xᵀAx into tr(xᵀAx) into tr(Axxᵀ), and now the thing you are
          differentiating with respect to sits on the outside where the derivative rules can reach it. Every derivation
          of the Gaussian maximum-likelihood covariance, and of the backward pass through a matrix multiply, moves
          letters around using this line.
        </p>
        <p>
          It also has a plain statistical meaning. In a linear model the fitted values are ŷ = Hy for a hat matrix H,
          and tr(H) counts the <strong>effective degrees of freedom</strong> — how many parameters the model is really
          spending. For ordinary least squares that comes out at exactly the number of columns; for ridge it comes out
          lower, and it falls as λ rises. That single number is what makes “how much has the regulariser actually
          restrained this model?” a question with an answer rather than a feeling.
        </p>
      </WhyAiml>

      <Takeaway>
        The trace adds the diagonal. It is linear, tr(Iₙ) = n, and tr(AB) = tr(BA) even when AB and BA have different
        sizes. Part 18 shows the trace is also the sum of the eigenvalues, which is where it earns its place in this
        lecture.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  charpoly: (
    <>
      <Para>
        Here is the trick the whole lecture turns on. Take A, subtract λ from every entry on its diagonal, and take the
        determinant of what is left. Because λ is a letter rather than a number, the answer is not a number — it is a{' '}
        <strong>polynomial in λ</strong>.
      </Para>
      <Formula>pₐ(λ) = det(A − λI) = c₀ + c₁λ + … + cₙ₋₁λⁿ⁻¹ + (−1)ⁿλⁿ</Formula>
      <Para>
        Subtracting λI means subtracting λ from a₁₁, from a₂₂, and so on down the diagonal, leaving everything else
        alone. Slide 12 shows the 3 × 3 case written out, and it is worth copying by hand once so the shape sticks.
      </Para>
      <Worked title="A − λI for a 3 × 3">
        {`| a₁₁ − λ    a₁₂       a₁₃    |
|   a₂₁    a₂₂ − λ    a₂₃    |
|   a₃₁      a₃₂    a₃₃ − λ  |`}
      </Worked>

      <Para>Slide 12 then claims two of the coefficients can be named in advance, without expanding anything.</Para>
      <List
        items={[
          <>
            <strong>c₀ = det(A).</strong> This one is a single line: put λ = 0 into det(A − λI). The left-hand side
            becomes det(A), and on the right every term with a λ in it disappears, leaving c₀.
          </>,
          <>
            <strong>cₙ₋₁ = (−1)ⁿ⁻¹ tr(A).</strong> This one takes the argument on slides 13 and 14.
          </>,
        ]}
      />

      <Para>
        That second argument is worth following slowly. Expand det(A − λI) along the first row. The first term is (a₁₁ −
        λ)·C₁₁, and inside that C₁₁ the same thing happens again, so this one term contains the whole product down the
        diagonal:
      </Para>
      <Formula>(a₁₁ − λ)(a₂₂ − λ) … (aₙₙ − λ)</Formula>
      <Para>
        Every other contributor to the expansion — a₁₂C₁₂, a₁₃C₁₃ and so on — has had a row <em>and</em> a column struck
        out of it, and each of those removals destroys one of the diagonal entries that could have supplied a λ. So
        those terms can only reach λⁿ⁻², two powers short. The highest two powers of λ can come from nowhere but the
        diagonal product.
      </Para>
      <Para>
        Now just multiply that product out in your head. To get λⁿ you take the −λ from every bracket, giving (−1)ⁿλⁿ —
        which is the corollary slide 14 mentions. To get λⁿ⁻¹ you take the −λ from all but one bracket and the aᵢᵢ from
        the one left over, and there are n ways to choose which:
      </Para>
      <Formula>(−1)ⁿ⁻¹(a₁₁ + a₂₂ + … + aₙₙ) = (−1)ⁿ⁻¹ tr(A)</Formula>

      <Para>
        The lab checks all three predictions on a matrix you can type into, and plots the polynomial so you can see
        where it crosses zero. Those crossings are the point of the next page.
      </Para>

      <Lab>
        <CharPolyLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'λ',
            say: 'lambda',
            def: 'The letter used for an eigenvalue throughout. On this page it is still just an unknown; on the next page it becomes the thing being solved for.',
          },
          {
            term: 'pₐ(λ)',
            say: 'p sub A of lambda',
            def: 'The characteristic polynomial of A. The subscript says which matrix it belongs to, because every matrix has its own.',
          },
          {
            term: 'I',
            def: 'The identity matrix, of whatever size makes the subtraction legal. λI is a matrix with λ down its diagonal and zeros elsewhere.',
          },
          {
            term: 'coefficient',
            def: 'The plain number multiplying a power of λ. In 3λ² − 5λ + 2 the coefficients are 3, −5 and 2.',
          },
          {
            term: 'degree',
            def: 'The highest power that appears. The characteristic polynomial of an n × n matrix always has degree exactly n.',
          },
        ]}
      />

      <WhyAiml method="numpy.linalg.eigvals · the QR algorithm · why the polynomial is never used">
        <p className="mb-2">
          The characteristic polynomial is what <em>defines</em> the eigenvalues, and every exam question about a small
          matrix is solved through it. It is also, in practice, exactly what no library computes. Rooting a polynomial
          is one of the least stable calculations in numerical analysis: a change in the twentieth decimal place of a
          coefficient can move a root by a visible amount, and forming the coefficients from a matrix is itself a lossy
          step.
        </p>
        <p>
          So <strong>numpy.linalg.eigvals</strong> and its relations never build pₐ(λ). They run the{' '}
          <strong>QR algorithm</strong>: repeatedly factorise the matrix as QR and multiply the factors back in the
          other order, RQ, which leaves the eigenvalues untouched while pushing the matrix towards triangular form,
          where the eigenvalues can be read straight off the diagonal. Knowing the polynomial exists and knowing nobody
          roots it are both part of understanding what an eigenvalue routine is doing when it takes a suspiciously long
          time on a large matrix.
        </p>
      </WhyAiml>

      <Takeaway>
        pₐ(λ) = det(A − λI) is a polynomial of degree n. Its constant term is det A, the coefficient of λⁿ⁻¹ is (−1)ⁿ⁻¹
        tr A, and the coefficient of λⁿ is (−1)ⁿ. The top two coefficients can only come from the product down the
        diagonal.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  eigendef: (
    <>
      <Para>
        A matrix takes a vector and generally does two things to it at once: it turns it and it changes its length.
        Slide 15 asks about the vectors that escape half of that — the ones the matrix does not turn at all.
      </Para>
      <Formula>Ax = λx, with x ≠ 0</Formula>
      <Para>
        Read it out loud: “A acting on x gives back a multiple of x”. Not a different direction, the <em>same</em>{' '}
        direction, just stretched by λ. Such an x is an <strong>eigenvector</strong> of A and the number λ is its{' '}
        <strong>eigenvalue</strong>. This is called the eigenvalue equation.
      </Para>
      <Para>
        The condition x ≠ 0 is not fussiness. The zero vector satisfies A0 = λ0 for absolutely every λ, so if it were
        allowed in, every number would be an eigenvalue of every matrix and the definition would say nothing at all.
        Eigenvalues are allowed to be zero; eigenvectors are not.
      </Para>

      <Para>
        Slide 15 then lists four statements and says they are equivalent — each one true exactly when the others are.
      </Para>
      <List
        items={[
          <>λ is an eigenvalue of A.</>,
          <>
            There is some x ≠ 0 with Ax = λx, or the same thing rearranged: (A − λI)x = 0 has a solution other than x =
            0. The deck calls that “solvable non-trivially”.
          </>,
          <>rank(A − λIₙ) {'<'} n.</>,
          <>det(A − λIₙ) = 0.</>,
        ]}
      />
      <Para>
        Follow the chain and none of the steps is new. Ax = λx moves to (A − λI)x = 0 by taking everything to one side —
        and it has to be λI rather than λ, because you cannot subtract a plain number from a matrix. A non-zero solution
        to (A − λI)x = 0 means that matrix has a nullspace bigger than {'{'}0{'}'}, which means it is short of full
        rank, which by part 4 means its determinant is zero. Four hats, one head.
      </Para>
      <Para>
        The last of them is the only one you can actually compute without knowing x in advance, which is why it is the
        one every method uses: solve det(A − λI) = 0 for λ first, and find the vectors afterwards.
      </Para>

      <Para>
        One more line from slide 15: if x is an eigenvector for λ, then so is cx for any non-zero number c. Check it in
        one step — A(cx) = c(Ax) = c(λx) = λ(cx). So an eigenvector is never a single arrow; it is a whole line through
        the origin, and picking the one of length 1 is a convention, not a fact.
      </Para>

      <Para>
        In the lab, swing x round the circle and watch Ax. Most of the time the two arrows point different ways. On the
        dashed lines they line up, and the read-out reports the stretch.
      </Para>

      <Lab>
        <EigenDefLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'eigenvalue',
            say: 'EYE-gun-value',
            def: 'The number λ by which an eigenvector gets stretched. “Eigen” is German for “own” — this is the matrix’s own characteristic number.',
          },
          {
            term: 'eigenvector',
            def: 'A non-zero vector whose direction the matrix leaves alone. Its length may change and it may be flipped end for end, which is what a negative λ means.',
          },
          {
            term: 'ℝⁿ \\ 0',
            say: 'R n without zero',
            def: 'Every vector with n real components except the zero vector. The backslash means “take these away from that set”.',
          },
          {
            term: 'non-trivially',
            def: 'With an answer other than the obvious useless one. For (A − λI)x = 0, x = 0 always works and is the trivial answer; a non-trivial one is any other.',
          },
          {
            term: 'A − λI',
            def: 'A with λ subtracted from every diagonal entry. Written this way rather than A − λ because a matrix and a number cannot be subtracted.',
          },
        ]}
      />

      <WhyAiml method="PCA’s principal directions · PageRank · power iteration">
        <p className="mb-2">
          Ax = λx is not a stepping stone in machine learning, it is the destination. <strong>PCA</strong> takes the
          covariance matrix of your data and asks for its eigenvectors: each one is a direction in feature space, and
          its eigenvalue is the variance the data has along that direction. Keeping the two largest is what “reduce to
          two dimensions” means. <strong>PageRank</strong> is the eigenvector of the web’s link matrix for λ = 1, and
          <strong> spectral clustering</strong> cuts a graph using the eigenvectors of its Laplacian.
        </p>
        <p>
          The “eigenvectors come in whole lines” line at the end of this page has a practical edge to it. Because cx is
          as good an eigenvector as x, two runs of the same PCA can return components that point in opposite directions,
          and a plot that looks flipped is usually this and not a bug. It is also why <strong>power iteration</strong> —
          multiply by A, normalise, repeat — has to normalise every step: without it the vector heads for zero or for
          infinity depending on whether the largest λ is under or over 1, while pointing the right way the entire time.
        </p>
      </WhyAiml>

      <Takeaway>
        Ax = λx with x ≠ 0. Four equivalent ways to say “λ is an eigenvalue”, and only the last one, det(A − λI) = 0,
        can be computed without already knowing x. Any non-zero multiple of an eigenvector is another eigenvector.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  example: (
    <>
      <Para>
        Slide 16 works one example end to end, and it is the one to have in your head during an exam because it is small
        enough to redo from memory. The matrix is a 2 × 2 with a 1 in every position.
      </Para>
      <Para>
        Step one, the characteristic polynomial. Subtract λ from the diagonal and take the 2 × 2 determinant, which is
        the product of the diagonal minus the product of the other pair:
      </Para>
      <Formula>det(A − λI) = (1 − λ)(1 − λ) − (1)(1) = (1 − λ)² − 1</Formula>
      <Para>
        Step two, set it to zero. The slide jumps straight to “has roots λ = 2, 0”, so here is the line it left out:
      </Para>
      <Worked title="The missing line">
        {`(1 − λ)² − 1 = 0
(1 − λ)²     = 1
 1 − λ       = +1   or   1 − λ = −1
     λ       =  0   or       λ = 2`}
      </Worked>
      <Para>
        A square root has two signs, and forgetting the second one is the commonest way to lose an eigenvalue. Both
        answers are wanted.
      </Para>

      <Para>
        Step three, the eigenvectors. For each λ separately, solve (A − λI)x = 0 — which is to say, find the{' '}
        <strong>nullspace</strong> of A − λI. Take λ = 0 first, where A − 0I is just A, so you are finding the nullspace
        of A itself. Eliminating gives the U the slide prints:
      </Para>
      <Worked title="λ = 0">
        {`A − 0I = | 1  1 |    →  U = | 1  1 |
         | 1  1 |            | 0  0 |

One equation survives:  x₁ + x₂ = 0,  so x₂ = −x₁.
Take x₁ = 1:            x = ( 1, −1 )`}
      </Worked>
      <Para>Then λ = 2, where subtracting 2 from each diagonal entry leaves −1s there:</Para>
      <Worked title="λ = 2">
        {`A − 2I = | −1   1 |   →   | 1  −1 |
         |  1  −1 |       | 0   0 |

The surviving equation:  x₁ − x₂ = 0,  so the two entries match.
Take x₁ = 1:             x = ( 1, 1 )`}
      </Worked>

      <Para>
        The lab steps through exactly this, computing each piece rather than displaying a stored answer, and finishes by
        substituting both vectors back into Ax = λx to check.
      </Para>

      <Lab>
        <DeckEigenLab />
      </Lab>

      <Para>
        It is worth noticing what λ = 0 is telling you. A eigenvalue of zero means A sends that whole direction to the
        zero vector — the matrix flattens it out of existence. So “0 is an eigenvalue”, “A has a nullspace”, “det A = 0”
        and “A is singular” are four ways of saying one thing, and you can read the first straight off the second
        without any calculation.
      </Para>

      <Beyond>
        This matrix is <strong>rank one</strong>: it is 1·1ᵀ, the column of ones multiplied by the row of ones. Every
        rank-one matrix vvᵀ behaves the same way — one eigenvalue equal to ‖v‖², with v itself as its eigenvector, and
        zero for every other direction. Here ‖v‖² = 1² + 1² = 2, which is where the 2 came from, and it also matches the
        trace. That shape turns up constantly in machine learning, because a single data point’s contribution to a
        covariance matrix is exactly one xxᵀ.
      </Beyond>

      <Terms
        items={[
          {
            term: 'nullspace',
            def: 'All the vectors a matrix sends to zero. Also called the kernel. Finding an eigenvector means finding the nullspace of A − λI.',
          },
          {
            term: 'U',
            def: 'The row echelon form after elimination — the staircase. The deck uses it here to read the equations off in their simplest form.',
          },
          {
            term: 'root',
            def: 'A value that makes a polynomial equal zero. The eigenvalues are the roots of the characteristic polynomial.',
          },
        ]}
      />

      <WhyAiml method="the rank-one update xxᵀ · a single example’s pull on a covariance matrix">
        <p className="mb-2">
          Build a covariance matrix from data and you are adding up one rank-one matrix per example: Σ = (1/m)Σₖ xₖxₖᵀ
          once the mean has been taken off. Each term is this page’s matrix in disguise, with one non-zero eigenvalue
          pointing along that example, and the covariance is what you get when m of them are piled up. It is why a
          covariance matrix built from fewer examples than features is always singular — you cannot add ten rank-one
          matrices and reach rank fifty.
        </p>
        <p>
          That failure has a name and a cost. Linear discriminant analysis, Gaussian mixture models and Mahalanobis
          distance all need Σ⁻¹, and all of them break on high-dimensional data with few samples for exactly this
          reason. The standard repair — <strong>shrinkage</strong>, as in scikit-learn’s LedoitWolf estimator — adds a
          multiple of the identity to Σ, which nudges every zero eigenvalue up to something positive and makes the
          inverse exist again. Same fix as ridge regression, same reason.
        </p>
      </WhyAiml>

      <Takeaway>
        Roots first, nullspaces second. For the all-ones 2 × 2: λ = 2 with eigenvector (1, 1), and λ = 0 with
        eigenvector (1, −1). An eigenvalue of 0 and a non-empty nullspace are the same fact.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  procedure: (
    <>
      <Para>
        Slide 17 states the general recipe in one sentence: find the roots of the characteristic polynomial first, then
        find the nullspace of A − λI for each root you found. Every eigenvalue problem in this course is that, in that
        order.
      </Para>
      <Para>Then it asks two questions and answers neither. Both are worth doing properly.</Para>

      <Para>
        <strong>The first question: does every n × n matrix have n eigenvectors?</strong> The slide points at a matrix
        with a single 1 in the top-right corner and leaves it there.
      </Para>
      <Worked title="Working it out">
        {`A = | 0  1 |      det(A − λI) = (0 − λ)(0 − λ) − (1)(0) = λ²
    | 0  0 |

λ² = 0 has the root λ = 0, twice over.

Nullspace of A − 0I = A:   | 0  1 | x = 0  says  x₂ = 0,
                           | 0  0 |        and x₁ is free.

So the eigenvectors are the multiples of ( 1, 0 ) — a single line.`}
      </Worked>
      <Para>
        The answer is <strong>no</strong>. λ = 0 turns up twice as a root but supplies only one direction, so this
        matrix has one independent eigenvector where two were needed. A matrix like this is called{' '}
        <strong>defective</strong>, and the gap between “how often λ is a root” and “how many directions it gives” is
        the subject of part 13.
      </Para>

      <Para>
        <strong>The second question is the deck’s “point to ponder”.</strong> If Ax = λx says A preserves the direction
        of x, does a rotation matrix — which turns absolutely everything — have no eigenvalues and no eigenvectors at
        all?
      </Para>
      <Beyond>
        The slide leaves this open, so here is the answer worked out, and checked by the same exact solver every other
        page uses. A rotation through θ has characteristic polynomial λ² − 2cos θ·λ + 1, whose discriminant is 4cos²θ −
        4. That is negative for every θ strictly between 0° and 180°, so there are{' '}
        <strong>no real eigenvalues and therefore no real eigenvectors</strong> — the intuition is right. But the
        polynomial still has two roots; they are the complex pair cos θ ± i·sin θ, and the matrix is perfectly
        well-behaved once complex numbers are allowed. So the honest answer is: no real ones, two complex ones, and the
        two exceptions are θ = 0° and θ = 180°, where the matrix is I or −I and every direction is an eigenvector. Set
        the slider in the lab to those and watch it happen.
      </Beyond>

      <Para>
        In the lab, grey arrows go in and coloured arrows come out. A direction that survives is drawn teal. On the
        rotation there are none until you reach the two exceptions.
      </Para>

      <Lab>
        <DefectiveLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'defective',
            def: 'A matrix with fewer independent eigenvectors than its size. It cannot be written as QΛQ⁻¹, so it cannot be diagonalised.',
          },
          {
            term: 'shear',
            def: 'The transformation the slide’s matrix performs: it slides points sideways in proportion to their height, like pushing over a deck of cards.',
          },
          {
            term: 'discriminant',
            def: 'The b² − 4ac inside the quadratic formula. Negative means no real roots, zero means one repeated root, positive means two.',
          },
          {
            term: 'complex conjugate pair',
            def: 'Two complex numbers a + bi and a − bi. The roots of a real polynomial always come in such pairs, never singly.',
          },
        ]}
      />

      <WhyAiml method="non-normal dynamics in recurrent networks · why diagonalisation can fail">
        <p className="mb-2">
          Whether a matrix has a full set of eigenvectors decides whether you may reason about repeated application of
          it using powers of λ. A recurrent network’s hidden state is roughly hₜ = Whₜ₋₁, so after many steps it is Wᵏh₀
          — and if W is diagonalisable that is QΛᵏQ⁻¹, meaning every direction simply grows or shrinks as λᵏ. That is
          the standard story of exploding and vanishing gradients, and it needs the eigenvectors to exist.
        </p>
        <p>
          For a defective, or more generally <strong>non-normal</strong>, matrix the story is wrong. Such a matrix can
          amplify a signal enormously over a few steps even when every one of its eigenvalues is under 1 — the
          eigenvalues predict the eventual behaviour and say nothing about the journey. It is the reason{' '}
          <strong>orthogonal initialisation</strong> is standard for recurrent weight matrices: an orthogonal matrix is
          as far from defective as a matrix can get, so the eigenvalue picture is trustworthy and the transient blow-up
          does not happen.
        </p>
      </WhyAiml>

      <Takeaway>
        The procedure is roots, then nullspaces. Not every matrix has enough eigenvectors — the shear on slide 17 has
        one where it needs two. A rotation has no real eigenvalues at all, only a complex conjugate pair, except at 0°
        and 180°.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  eigenspace: (
    <>
      <Para>
        Slide 18 gives names to two collections. Both are simple, and one of them has a subtlety in it that is worth
        being careful with.
      </Para>
      <Para>
        First, it restates that λ is an eigenvalue exactly when λ is a root of pₐ(λ) — which is the fourth of the
        equivalent statements from part 7, said once more now that the polynomial has a name.
      </Para>
      <Para>
        Then: for a given eigenvalue λ, the eigenvectors belonging to it span a subspace of ℝⁿ called the{' '}
        <strong>eigenspace</strong> of A with respect to λ, written E<sub>λ</sub>. And the set of all the eigenvalues of
        A together is called the <strong>spectrum</strong> of A.
      </Para>

      <Para>
        Here is the careful bit. A subspace has to contain the zero vector — that is one of the three things “subspace”
        promises, and Lecture 2 spent a page on it. But the zero vector is precisely what part 7 refused to call an
        eigenvector. Both are right, and they fit together like this: E<sub>λ</sub> is the eigenvectors{' '}
        <em>together with</em> 0. Equivalently, and more cleanly, E<sub>λ</sub> is the nullspace of A − λI, which always
        contains 0 and is always a subspace.
      </Para>
      <Para>
        Being a subspace is a real promise, not a label. It means you can add two eigenvectors of the same λ and get
        another one, and stretch any of them by any amount and still have one. Both are one line to check:
      </Para>
      <Worked title="Why you cannot fall out of an eigenspace">
        {`Ax = λx  and  Ay = λy

A(x + y) = Ax + Ay = λx + λy = λ(x + y)   ✓ still stretched by λ
A(cx)    = c(Ax)   = c(λx)   = λ(cx)      ✓ still stretched by λ`}
      </Worked>
      <Para>
        Note what this does <em>not</em> say. Add eigenvectors belonging to <em>different</em> eigenvalues and the
        result is generally not an eigenvector of anything. The closure only holds inside one λ.
      </Para>

      <Para>
        Slide 18 finishes with the identity matrix as the extreme case. Iₙ has one eigenvalue, λ = 1, because Ix = 1·x
        for absolutely every x. So its eigenspace is the whole of ℝⁿ, and every canonical vector — every (1, 0, 0), (0,
        1, 0) and so on — is a basis vector for it.
      </Para>

      <Lab>
        <EigenspaceLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Eλ',
            say: 'E sub lambda',
            def: 'The eigenspace for the eigenvalue λ: every eigenvector belonging to λ, plus the zero vector. The same thing as the nullspace of A − λI.',
          },
          {
            term: 'spectrum',
            def: 'The set of all eigenvalues of a matrix. Written as a set, so a repeated eigenvalue is listed once. The word is borrowed from physics, where the eigenvalues really were a spectrum of light.',
          },
          {
            term: 'subspace',
            def: 'A set of vectors you cannot escape by adding two of them or by stretching one, and which contains the zero vector. Lecture 2 has the full definition.',
          },
          {
            term: 'span',
            def: 'Everything you can build from a set of vectors by scaling them and adding. “The eigenvectors span Eλ” means Eλ is exactly what they can build.',
          },
          {
            term: 'canonical vector',
            def: 'One of the standard axis directions — (1, 0, …, 0), (0, 1, 0, …) and so on. Also called a standard basis vector.',
          },
        ]}
      />

      <WhyAiml method="degenerate eigenvalues in PCA · why two PCA runs can disagree">
        <p className="mb-2">
          The dimension of an eigenspace is what decides whether a principal component is a real answer or an arbitrary
          one. When a covariance matrix has two equal eigenvalues, their eigenspace is a whole plane, and every
          direction in that plane is as much an eigenvector as any other. PCA will still hand you two specific
          orthogonal vectors, but they were chosen by the numerical routine, not by the data — rerun on a slightly
          different sample and they can come back rotated within that plane by any angle at all.
        </p>
        <p>
          That is why interpreting individual principal components is safe only when their eigenvalues are clearly
          separated, and why a scree plot is read for gaps rather than for values. Two nearly-equal eigenvalues mean the
          two components are individually meaningless while the plane they span is perfectly stable. The same thing
          decides when a spectral clustering is trustworthy: a large gap between the k-th and (k+1)-th eigenvalue of the
          Laplacian says the k clusters are real, and no gap says the routine picked a split from rounding noise.
        </p>
      </WhyAiml>

      <Takeaway>
        E<sub>λ</sub> is the nullspace of A − λI: the eigenvectors of λ together with the zero vector. It is a subspace,
        so combinations of eigenvectors of the same λ stay eigenvectors. The spectrum is the set of all the eigenvalues.
        For Iₙ there is one eigenvalue, 1, and its eigenspace is everything.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  properties: (
    <>
      <Para>Slide 19 collects three facts. The first comes with a proof that is a pleasure to follow.</Para>
      <Para>
        <strong>A matrix and its transpose have the same eigenvalues.</strong> The argument is a chain of equalities,
        each one a fact you already have:
      </Para>
      <Worked title="Four steps, each one already known">
        {`det(A − λI) = det( (A − λI)ᵀ )      a determinant survives transposing
            = det( Aᵀ − λIᵀ )        transposing goes through a subtraction
            = det( Aᵀ − λI  )        the identity transposed is itself
            = p sub Aᵀ (λ)           which is the characteristic polynomial of Aᵀ`}
      </Worked>
      <Para>
        So pₐ(λ) and the characteristic polynomial of Aᵀ are literally the same polynomial. Same polynomial, same roots,
        same eigenvalues. Done.
      </Para>
      <Para>
        Read what is <em>not</em> claimed, because this is where marks go missing: the <strong>eigenvectors</strong> are
        generally different. A and Aᵀ agree on how much stretching happens and disagree about which directions it
        happens in. The two sets even have names — right and left eigenvectors.
      </Para>

      <Para>
        <strong>
          The eigenspace E<sub>λ</sub> is the nullspace of A − λI.
        </strong>{' '}
        This was already true on the previous page; the slide states it plainly because it is the sentence that turns a
        definition into a procedure. “Find the eigenvectors” becomes “row-reduce A − λI and read off the free
        variables”, which is a job you can actually do.
      </Para>

      <Para>
        <strong>Symmetric, positive definite matrices always have positive, real eigenvalues.</strong> Two separate
        promises in one line, and they come from different places. Real is from symmetry alone, and is proved on slide
        25 — part 16 here. Positive is from positive definiteness, and takes one line once you have an eigenvector to
        hand:
      </Para>
      <Worked title="Why positive definite forces λ > 0">
        {`Positive definite says   xᵀAx > 0   for every x ≠ 0.
Put in an eigenvector:    xᵀAx = xᵀ(λx) = λ(xᵀx) = λ‖x‖².

‖x‖² > 0 because x ≠ 0, and the left side is > 0, so λ > 0.`}
      </Worked>

      <Lab>
        <TransposeSpdLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Aᵀ',
            say: 'A transpose',
            def: 'A with its rows and columns swapped: the entry in row i, column j moves to row j, column i.',
          },
          {
            term: 'left eigenvector',
            def: 'An eigenvector of Aᵀ, equivalently a row vector y with yA = λy. The ordinary kind are called right eigenvectors when the two need telling apart.',
          },
          {
            term: 'positive definite',
            def: 'xᵀAx > 0 for every non-zero x. Lecture 0a tests it by the leading minors; this page shows what it does to the eigenvalues.',
          },
          {
            term: '‖x‖²',
            say: 'norm x squared',
            def: 'The squared length of x, which is xᵀx. Never negative, and zero only for the zero vector.',
          },
        ]}
      />

      <WhyAiml method="covariance and kernel matrices · Mahalanobis distance · the PSD repair">
        <p className="mb-2">
          The two matrices machine learning cares about most are both symmetric and positive semi-definite by
          construction: the <strong>covariance matrix</strong> XᵀX/m and the <strong>kernel matrix</strong> Kᵢⱼ = k(xᵢ,
          xⱼ). This page is what that buys you. Real eigenvalues mean they can be sorted, which is the entire basis of
          “keep the top k components”. Non-negative eigenvalues mean the quadratic form is never negative, which is what
          lets xᵀΣ⁻¹x be called a squared distance — the <strong>Mahalanobis distance</strong> — rather than just a
          number.
        </p>
        <p>
          When it fails, it fails loudly. A kernel matrix built with a hand-rolled similarity function that is not a
          real kernel can pick up negative eigenvalues, and an SVM trained on it may not converge at all, because the
          optimisation is no longer convex. The same thing happens to a covariance matrix estimated from too few
          samples, where rounding pushes a near-zero eigenvalue slightly negative and Cholesky then refuses to factorise
          it. The usual repair is exactly the one this chapter suggests: take the eigendecomposition, clip every
          negative eigenvalue to zero or to a small positive number, and rebuild — which part 17 shows how to do.
        </p>
      </WhyAiml>

      <Takeaway>
        A and Aᵀ share their eigenvalues but not their eigenvectors. E<sub>λ</sub> is the nullspace of A − λI, which is
        what makes finding eigenvectors an elimination job. Symmetry gives real eigenvalues; positive definiteness makes
        them positive, via λ = xᵀAx / ‖x‖².
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  independence: (
    <>
      <Para>
        Slide 20 puts two things side by side. The first is a claim about eigenvectors with a “why?” attached and no
        answer; the second is the matrix that makes this whole lecture matter to a machine-learning course.
      </Para>

      <Para>
        <strong>Eigenvectors belonging to n distinct eigenvalues are linearly independent.</strong> The deck asks why.
        Here is the argument for two of them, which is the case you would be asked to produce:
      </Para>
      <Worked title="Why they cannot be dependent">
        {`Suppose Ax = λx and Ay = μy with λ ≠ μ, and suppose y = cx for some c.

Then   Ay = A(cx) = c(Ax) = cλx
and    Ay = μy    = μ(cx) = cμx

So     cλx = cμx,  giving  c(λ − μ)x = 0.

x ≠ 0 and λ − μ ≠ 0, so c = 0 — and y = 0x is not an eigenvector.
The assumption that y was a multiple of x cannot stand.`}
      </Worked>
      <Para>
        That matters because n independent vectors in ℝⁿ are a basis. So a matrix with n different eigenvalues has a
        full basis of eigenvectors and can be diagonalised — which is exactly what the shear in part 9 could not do, and
        it could not do it because its two eigenvalues were the same.
      </Para>

      <Para>
        <strong>Now the second half.</strong> Given any A that is m × n, the matrix AᵀA is n × n, and slide 20 claims it
        is symmetric and positive definite whenever A has rank n. Both halves are quick.
      </Para>
      <Para>
        Symmetric is free and holds for every A whatsoever: (AᵀA)ᵀ = Aᵀ(Aᵀ)ᵀ = AᵀA. Transposing a product reverses the
        order, and here reversing gives the same thing back.
      </Para>
      <Para>Positive definite is the line the slide writes out, and it is worth reading slowly:</Para>
      <Formula>xᵀAᵀAx = (Ax)ᵀ(Ax) = ‖Ax‖² {'>'} 0 for every x ≠ 0</Formula>
      <Para>
        All that happened in the first step was moving the brackets. Once you see (Ax)ᵀ(Ax), the rest is the definition
        of length: it is a squared length, so it cannot be negative, and it is zero only when Ax = 0 itself. The
        condition rank A = n is exactly the promise that Ax = 0 has no non-zero solution, so for x ≠ 0 the quantity is
        strictly positive. That is positive definiteness.
      </Para>

      <Para>
        The last line of the slide says why anyone bothers. AᵀA is the matrix in the least-squares solution to a data
        matrix A, where <strong>n is the number of features and m is the number of data vectors</strong>. So AᵀA is n ×
        n — features by features — no matter how many million rows of data you have.
      </Para>

      <Lab>
        <GramMatrixLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'linearly independent',
            def: 'No one of them can be built out of the others. Lecture 2 has the full treatment; here it is what lets a set of eigenvectors serve as a basis.',
          },
          {
            term: 'AᵀA',
            say: 'A transpose A',
            def: 'The Gram matrix. Its entry in row i, column j is the dot product of column i of A with column j — so it is a table of how much each feature agrees with each other feature.',
          },
          {
            term: 'full column rank',
            def: 'rank A = n, the number of columns. For a data matrix this says no feature is a combination of the others.',
          },
          {
            term: 'least squares',
            def: 'Choosing the coefficients that make the total squared error smallest. The answer is (AᵀA)⁻¹Aᵀy, which needs AᵀA to be invertible.',
          },
        ]}
      />

      <WhyAiml method="the normal equations (XᵀX)⁻¹Xᵀy · ridge · numpy.linalg.lstsq">
        <p className="mb-2">
          AᵀA is the single most common matrix in applied machine learning, and this slide is why the standard linear
          model works at all. The normal equations XᵀXw = Xᵀy have exactly one solution precisely when XᵀX is
          invertible, and positive definiteness gives you rather more than invertibility: it means the squared-error
          surface is a bowl with one bottom, so gradient descent on it cannot get stuck anywhere else. The exact same
          matrix, and the exact same argument, is what makes the loss surface in the Deep Neural Networks course convex
          for a single linear neuron.
        </p>
        <p>
          Positive definiteness is also the thing that gets lost first on real data. Perfectly correlated features make
          rank A drop below n, at which point AᵀA is only positive <em>semi</em>-definite: ‖Ax‖² can now be zero for a
          non-zero x, the determinant is zero, and there is no unique answer. Ridge regression repairs it by solving
          with XᵀX + λI, which adds λ to every eigenvalue and forces them all positive again. And in production nobody
          forms XᵀX at all — <strong>numpy.linalg.lstsq</strong> goes through a QR or SVD factorisation instead, because
          multiplying Xᵀ by X squares the condition number and throws away half your significant digits before the solve
          has even started.
        </p>
      </WhyAiml>

      <Takeaway>
        Distinct eigenvalues force independent eigenvectors, so a matrix with n different eigenvalues has a full basis
        of them. AᵀA is always symmetric, and positive definite exactly when A has full column rank — because xᵀAᵀAx is
        the squared length ‖Ax‖².
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  spectral: (
    <>
      <Para>
        This is the big theorem of the lecture, and the reason so much of machine learning insists on symmetric
        matrices.
      </Para>
      <Formula>
        If A ∈ ℝⁿˣⁿ is symmetric, there is an orthonormal basis of eigenvectors of A, and every eigenvalue is real.
      </Formula>
      <Para>
        Unpack what is being promised, because it is two separate strokes of luck arriving together. First, no complex
        numbers: the rotation matrix in part 9 lost its real eigenvalues, and a symmetric matrix cannot. Second, not
        merely enough eigenvectors to form a basis, but a basis whose vectors are all mutually at right angles and all
        of length 1. That is the strongest thing a basis can be.
      </Para>

      <Para>
        Slide 21 says plainly that it will not attempt a full proof, only intuitions. Slide 22 lists the three
        statements the theorem rests on:
      </Para>
      <List
        items={[
          <>
            <strong>All roots of pₐ(λ) are real.</strong> This one <em>is</em> proved, on slide 25, and it is part 16
            here.
          </>,
          <>
            <strong>Each eigenspace has an orthonormal basis</strong>, and those bases can be strung together into a
            list v₁, v₂, … That the pieces from different eigenvalues do not collide is proved on slide 26, also part
            16.
          </>,
          <>
            <strong>The geometric multiplicity of each λ equals its algebraic multiplicity.</strong> This is the one the
            deck says on slide 30 it will not prove.
          </>,
        ]}
      />

      <Para>Those two multiplicities are the vocabulary this page exists to install, so here they are plainly:</Para>
      <List
        items={[
          <>
            <strong>Algebraic multiplicity</strong> — how many times λ appears as a root of the characteristic
            polynomial. If pₐ(λ) factorises with (λ − 3) in it twice, then 3 has algebraic multiplicity 2.
          </>,
          <>
            <strong>Geometric multiplicity</strong> — the dimension of E<sub>λ</sub>, which is how many independent
            eigenvectors λ actually supplies.
          </>,
        ]}
      />
      <Para>
        The geometric one can never exceed the algebraic one, and part 9 has already shown it can fall short: the shear
        had algebraic multiplicity 2 and geometric multiplicity 1, so its eigenvectors could not fill the plane. The
        third statement above says that for a <em>symmetric</em> matrix this shortfall never happens. That is precisely
        what guarantees you end up with n vectors rather than fewer, and it is the piece taken on trust.
      </Para>
      <Para>
        Slide 29 then adds the last brick: the basis vectors from the different eigenspaces combine to give an
        orthonormal basis for the whole of ℝⁿ. Slide 27 is honest about the worry — string the bases together and who
        says you have enough? If every eigenvalue is different you clearly do, by part 12. The repeated-eigenvalue case
        is exactly what the unproved statement covers.
      </Para>

      <Lab>
        <SpectralBasisLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'orthonormal basis',
            def: 'A basis whose vectors are mutually at right angles and each of length 1. Lecture 3 built one with Gram–Schmidt; here symmetry hands you one for free.',
          },
          {
            term: 'algebraic multiplicity',
            def: 'How many times λ is a root of the characteristic polynomial.',
          },
          {
            term: 'geometric multiplicity',
            def: 'The dimension of the eigenspace Eλ — how many independent eigenvectors that λ really gives you.',
          },
          {
            term: 'V',
            def: 'The deck’s name for the vector space the matrix acts on. For an n × n real matrix that is ℝⁿ.',
          },
        ]}
      />

      <WhyAiml method="numpy.linalg.eigh against numpy.linalg.eig · PCA and spectral clustering">
        <p className="mb-2">
          This theorem is why there are two eigenvalue routines rather than one. <strong>eig</strong> works on any
          square matrix and returns complex arrays because it must — it cannot know in advance that your eigenvalues are
          real. <strong>eigh</strong> assumes symmetry, and on that assumption it can use an algorithm that is roughly
          twice as fast, returns real arrays, and hands them back already sorted. PCA, spectral clustering, Gaussian
          processes and kernel methods all call the symmetric one, because the matrices they build are symmetric by
          construction.
        </p>
        <p>
          The orthonormality is not a technicality either — it is the whole selling point of PCA. Because the components
          come out at right angles, the variance each one explains simply adds up, so “these three components explain
          82% of the variance” is an honest sentence rather than a double-count. Drop the symmetry and you lose that: a
          general matrix’s eigenvectors can sit at any angle to each other, the coordinates in that basis overlap, and
          no such clean accounting exists.
        </p>
      </WhyAiml>

      <Takeaway>
        Symmetric ⟹ real eigenvalues and an orthonormal basis of eigenvectors. It rests on three claims: real roots
        (proved), orthogonal eigenspaces (proved), and geometric multiplicity matching algebraic (assumed). The shear
        from part 9 is what failure of the third looks like.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  complex: (
    <>
      <Para>
        Slides 23 and 24 look like a detour into complex numbers. They are not — they are the machinery needed to prove
        the spectral theorem two slides later, because the proof works with a vector that might be complex and has to
        say what its length is.
      </Para>
      <Para>
        With real entries, squared length is the sum of the squares: x₁² + x₂² + … + xₙ². Slide 23 points out that this
        stops working the moment the entries can be complex, and that the fix is to use the <strong>modulus</strong> of
        each entry instead.
      </Para>
      <Formula>‖x‖² = |x₁|² + |x₂|² + … + |xₙ|²</Formula>
      <Para>
        The modulus of a complex number a + bi is its distance from the origin in the plane where a runs left-to-right
        and b runs up-and-down. The slide gets it by the trick that makes everything on these two pages work:
      </Para>
      <Formula>|a + bi| = √((a + bi)(a − bi)) = √(a² + b²)</Formula>
      <Para>
        Multiply a complex number by its own <strong>conjugate</strong> — the same number with the sign of its imaginary
        part flipped — and the imaginary parts cancel, leaving a real number that cannot be negative. Check it: (a +
        bi)(a − bi) = a² − abi + abi − b²i² = a² + b², using i² = −1.
      </Para>

      <Para>
        Now the demonstration. We would like to keep ‖x‖² = xᵀx, which is what it was for real vectors. Slide 23 takes
        one specific complex vector and shows what happens if you insist on the old formula:
      </Para>
      <Worked title="Slide 23's own example">
        {`x = ( 1 + i , 2 + i )

xᵀx = (1 + i)² + (2 + i)²
    = (1 + 2i + i²) + (4 + 4i + i²)
    = (1 + 2i − 1)  + (4 + 4i − 1)
    = 2i + 3 + 4i
    = 3 + 6i`}
      </Worked>
      <Para>
        And there is the problem in plain sight. 3 + 6i is not a real number, so it certainly is not the square of any
        length. The old definition has produced nonsense — not a wrong length, but something that is not a length at
        all.
      </Para>
      <Para>
        The lab computes both definitions on any complex vector you type in. Leave it on the deck’s numbers and the
        first read-out is 3 + 6i exactly, matching the slide. The mended definition gives |1 + i|² + |2 + i|² = 2 + 5 =
        7, which is a perfectly good squared length.
      </Para>

      <Lab>
        <ComplexLengthLab />
      </Lab>

      <Para>
        Set every imaginary part to zero in the lab and the two definitions become the same thing. That is the point:
        none of this is a change of mind about real vectors, it is the smallest extension that keeps them working.
      </Para>

      <Terms
        items={[
          {
            term: 'i',
            def: 'The imaginary unit, defined by i² = −1. Every complex number is a + bi for real a and b.',
          },
          {
            term: 'modulus',
            say: 'MOD-you-luss',
            def: 'The size of a complex number, written |z|. For a + bi it is √(a² + b²) — the ordinary distance from 0 in the plane.',
          },
          {
            term: 'conjugate',
            say: 'CON-juh-git',
            def: 'a − bi is the conjugate of a + bi: same number, sign of the imaginary part flipped. Written with a bar over the top, as in z̄.',
          },
          {
            term: 'real part / imaginary part',
            def: 'In a + bi, a is the real part and b is the imaginary part. Note that b itself is an ordinary real number — the i is not part of it.',
          },
        ]}
      />

      <WhyAiml method="the power spectrum |X(f)|² · complex embeddings in knowledge graphs">
        <p className="mb-2">
          Any model that touches audio meets this on its first page. A Fourier transform sends a real signal to a
          complex one, and what gets fed to a speech model is not the complex numbers themselves but their moduli
          squared — the <strong>power spectrum</strong>, and then the mel spectrogram built from it. That squaring is
          this page: it is the operation that turns a complex number into a real, non-negative quantity you can put on
          an axis. It also throws the phase away, which is why turning a spectrogram back into audio needs a
          reconstruction algorithm rather than an inverse.
        </p>
        <p>
          It shows up in embeddings too. ComplEx, one of the standard knowledge-graph embedding models, deliberately
          uses complex-valued vectors and scores a triple with a Hermitian product, because the ordinary symmetric dot
          product cannot represent a relation that holds one way and not the other. Its whole design rests on the fact
          that xᴴy is not equal to yᴴx — they are conjugates — which is the asymmetry the next page makes precise.
        </p>
      </WhyAiml>

      <Takeaway>
        For complex vectors, squared length must be Σ|xᵢ|², not Σxᵢ². The deck’s example gives xᵀx = 3 + 6i, which is
        not real and so is not a length. Multiplying by the conjugate is what makes it real.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  hermitian: (
    <>
      <Para>
        The previous page found the problem. Slide 24 fixes it, by changing the definition of the inner product rather
        than the definition of length.
      </Para>
      <Formula>⟨x, y⟩ = xᴴy, where xᴴ = x̄ᵀ</Formula>
      <Para>
        The superscript H means <strong>conjugate transpose</strong>: transpose the vector or matrix, and conjugate
        every entry. It is named after Charles Hermite, and it is often written with a dagger, A†, in physics books.
        With that one change, the length calculation lands where it should:
      </Para>
      <Formula>xᴴx = x̄₁x₁ + x̄₂x₂ + … + x̄ₙxₙ = |x₁|² + … + |xₙ|² = ‖x‖²</Formula>
      <Para>
        Each term is a number times its own conjugate, which is exactly the real, non-negative quantity from the
        previous page. So the total is real and cannot be negative — a length squared.
      </Para>

      <Para>
        Now do the same to matrices. A symmetric matrix is one with Aᵀ = A. The complex version replaces plain
        transposing with conjugate transposing:
      </Para>
      <Formula>A is Hermitian ⟺ Aᴴ = A</Formula>
      <Para>Slide 24 gives an example, and it repays a moment’s checking:</Para>
      <Worked title="Slide 24's example">
        {`A = |   1     3 − i |
    | 3 + i     4   |

Transpose:              |   1     3 + i |
                        | 3 − i     4   |

Then conjugate each:    |   1     3 − i |   =  A   ✓
                        | 3 + i     4   |`}
      </Worked>
      <Para>
        Two things to notice, and both are forced rather than chosen. The off-diagonal pair are conjugates of each other
        — 3 − i above and 3 + i below — because transposing swaps their positions and conjugating then has to put each
        one back as it was. And the <strong>diagonal must be real</strong>: conjugate-transposing leaves aᵢᵢ exactly
        where it is and conjugates it, so aᵢᵢ has to equal its own conjugate, and only real numbers do that.
      </Para>
      <Para>
        Finally, notice the relationship to what you already had. Set every imaginary part to zero and conjugating does
        nothing at all, so Aᴴ becomes Aᵀ and “Hermitian” becomes “symmetric”. Hermitian is not a rival idea; it is the
        same idea with room for complex numbers, and symmetric is the special case you have been using all along.
      </Para>

      <Lab>
        <HermitianLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Aᴴ',
            say: 'A Hermitian, or A conjugate transpose',
            def: 'Transpose A, then conjugate every entry. Sometimes written A* or A†. For a real matrix it is just Aᵀ.',
          },
          {
            term: 'x̄',
            say: 'x bar',
            def: 'The conjugate: every entry with the sign of its imaginary part flipped.',
          },
          {
            term: 'Hermitian',
            say: 'her-MISH-un',
            def: 'A matrix equal to its own conjugate transpose. The complex generalisation of symmetric.',
          },
          {
            term: 'conjugate transpose',
            def: 'The two operations done together. Order does not matter — conjugating then transposing gives the same result as transposing then conjugating.',
          },
        ]}
      />

      <WhyAiml method="the DFT matrix · attention scores over complex features · quantum ML observables">
        <p className="mb-2">
          The discrete Fourier transform is a matrix multiply by a matrix whose entries are complex roots of unity, and
          the reason the transform can be undone by essentially the same matrix is that this matrix is unitary — the
          complex version of orthogonal, meaning UᴴU = I. Every FFT-based layer, every spectral convolution in a graph
          network, and every frequency-domain audio model is standing on that identity, which is this page’s definition
          with U in place of A.
        </p>
        <p>
          It matters for what stays real. Any score of the form xᴴAx with A Hermitian is guaranteed real, which is
          exactly why quantum machine learning insists that measurable quantities be Hermitian operators — a measurement
          that came out complex would mean nothing. The same guarantee is what part 16 turns into “the eigenvalues of a
          symmetric matrix are real”, and it is the reason a covariance matrix computed from complex data is defined as
          E[xxᴴ] rather than E[xxᵀ]: only the first has real, non-negative variances down its diagonal.
        </p>
      </WhyAiml>

      <Takeaway>
        xᴴ means transpose and conjugate. The inner product becomes xᴴy, which makes xᴴx a real, non-negative length
        squared. A matrix is Hermitian when Aᴴ = A; its diagonal is forced to be real, and for real matrices Hermitian
        and symmetric are the same thing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  realeigs: (
    <>
      <Para>
        With xᴴ in hand, two of the three claims behind the spectral theorem can be proved. Both proofs are short, and
        both work by the same move: premultiply the eigenvalue equation by xᴴ and see what has to be true.
      </Para>

      <Para>
        <strong>Claim one, slide 25: the eigenvalues of a symmetric matrix are real.</strong> Start from Ax = λx and hit
        both sides with xᴴ on the left:
      </Para>
      <Formula>xᴴAx = λ·xᴴx</Formula>
      <Para>
        Look at the shapes. x is n × 1, so xᴴ is 1 × n, and 1 × n times n × n times n × 1 is <strong>1 × 1</strong> — a
        single number wearing a matrix’s clothes. Now take the conjugate transpose of that single number:
      </Para>
      <Worked title="The one line that does the work">
        {`(xᴴAx)ᴴ = xᴴ Aᴴ (xᴴ)ᴴ = xᴴ Aᴴ x = xᴴ A x        using Aᴴ = A

So this 1 × 1 quantity equals its own conjugate.
Only a real number does that. Therefore xᴴAx is real.`}
      </Worked>
      <Para>
        Meanwhile xᴴx is real — that was the entire point of the last two pages, and it is positive because x ≠ 0. So λ
        is one real number divided by another, and is therefore real itself. That is the first of slide 22’s three
        statements, done.
      </Para>

      <Para>
        <strong>Claim two, slide 26: eigenvectors from different eigenvalues are orthogonal.</strong> Take two
        eigenpairs, Ax = λx and Ay = μy with λ ≠ μ, and write the same product two ways:
      </Para>
      <Worked title="One quantity, two readings">
        {`Reading 1:   xᴴAy = μ xᴴy                      because Ay = μy

Reading 2:   xᴴAy = (yᴴAᴴx)ᴴ = (yᴴAx)ᴴ         because Aᴴ = A
                  = (λ yᴴx)ᴴ = λ xᴴy           λ is real, by claim one

So   λ xᴴy = μ xᴴy,  giving  (λ − μ) xᴴy = 0.
λ ≠ μ, so  xᴴy = 0.`}
      </Worked>
      <Para>
        And xᴴy = 0 is the definition of orthogonal from Lecture 3 — the inner product is zero, so the two vectors meet
        at a right angle. Notice how claim one was used inside claim two: without knowing λ is real, that step would
        have produced a conjugate and the argument would not close.
      </Para>

      <Para>
        The lab has both. On the first chip, type an imaginary part into the matrix to break the Hermitian condition and
        watch xᴴAx stop being real — the proof fails exactly where the slide says it needs Aᴴ = A. On the second, break
        the symmetry and watch the right angle between the two eigenvectors disappear.
      </Para>

      <Lab>
        <SymmetricProofLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'premultiply',
            def: 'Multiply on the left. Matrix multiplication cares about which side, so “premultiply by xᴴ” means xᴴA and not Axᴴ.',
          },
          {
            term: '1 × 1 matrix',
            def: 'A matrix with one row and one column — a single number. The trick on this page is to treat it as a matrix long enough to take its conjugate transpose.',
          },
          {
            term: 'orthogonal',
            def: 'At right angles: the inner product is zero. Lecture 3 defines it in full, including the warning that it depends on which inner product you chose.',
          },
          {
            term: 'μ',
            say: 'mu',
            def: 'The Greek letter used here for the second eigenvalue, so it can be told apart from λ.',
          },
        ]}
      />

      <WhyAiml method="PCA components are uncorrelated by construction · sorting eigenvalues">
        <p className="mb-2">
          These two proofs are what make PCA work as advertised. Because the covariance matrix is symmetric, its
          eigenvalues are real, so they can be <strong>sorted</strong> — and “take the top two components” is a sentence
          that means something. Try to sort complex numbers and there is no order to sort by; the whole notion of a
          leading component would collapse.
        </p>
        <p>
          The orthogonality is the second half of the promise. The principal components come out at right angles to each
          other, which means the projected coordinates are <strong>uncorrelated</strong> — that is precisely what a
          diagonal covariance in the new basis says. It is the reason PCA is used for decorrelation and whitening at
          all, and the reason the variances explained by each component can simply be added up. Both properties are
          handed over by symmetry alone, at no cost, which is why every method that can arrange to work with a symmetric
          matrix does.
        </p>
      </WhyAiml>

      <Takeaway>
        Premultiply Ax = λx by xᴴ. The left side is a 1 × 1 that equals its own conjugate transpose, so it is real; xᴴx
        is real and positive; so λ is real. Repeat with two eigenpairs and (λ − μ)xᴴy = 0 forces xᴴy = 0 — a right
        angle.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  decomp: (
    <>
      <Para>
        Slide 27 sums up where the argument has got to and then admits what is missing. The eigenvalues of a symmetric
        matrix are real, and eigenvectors from different eigenvalues are orthogonal — so stringing together the
        orthonormal bases of the different eigenspaces looks like it should give an orthonormal basis for ℝⁿ.
      </Para>
      <Para>
        But, the slide asks, who says there are <em>enough</em> of them? You need n vectors and might collect fewer. If
        every eigenvalue is different, part 12 settles it. The awkward case is a repeated eigenvalue, and slide 28 says
        outright that the missing piece will not be proved here. It is the geometric-equals-algebraic statement from
        part 13.
      </Para>

      <Para>Take that on trust and the payoff arrives:</Para>
      <Formula>A = QΛQᵀ</Formula>
      <Para>Three factors, and each one is something you can point at.</Para>
      <List
        items={[
          <>
            <strong>Q</strong> holds the orthonormal eigenvectors as its columns. Because they are orthonormal, QᵀQ = I,
            which means Q⁻¹ = Qᵀ — this is the orthogonal matrix from Lecture 3, and it is the only reason the third
            factor can be written as a transpose instead of an inverse.
          </>,
          <>
            <strong>Λ</strong> is diagonal, holding the eigenvalues, each one lined up with its own eigenvector’s column
            in Q.
          </>,
          <>
            <strong>Qᵀ</strong> is the same matrix again, undoing what the first one did.
          </>,
        ]}
      />
      <Para>
        Slide 28 describes Λ as “a diagonal matrix consisting of non-zero entries only along the diagonal”. Read that as
        “zeros everywhere except the diagonal”, which is what a diagonal matrix is. The entries on the diagonal are the
        eigenvalues, and one of them being zero is perfectly allowed — that is just a singular A, as part 8 showed.
      </Para>

      <Para>
        The best way to hold on to this is to read the three factors right to left, in the order they act on a vector:
      </Para>
      <List
        items={[
          <>
            <strong>Qᵀx</strong> rewrites x in the eigenvector axes — it asks “how much of each eigenvector is in here?”
          </>,
          <>
            <strong>Λ</strong> then stretches each of those amounts by its own λ. Nothing is mixed with anything; each
            coordinate is scaled on its own.
          </>,
          <>
            <strong>Q</strong> writes the answer back in the ordinary axes.
          </>,
        ]}
      />
      <Para>
        So every symmetric matrix, however complicated it looks, is a rotation, a stretch along the new axes, and the
        rotation undone. The lab builds Q and Λ and multiplies them back together so you can watch A reappear.
      </Para>

      <Lab>
        <SpectralDecompLab />
      </Lab>

      <Para>
        The last line of slide 28 is the bridge to the rest of the programme. A data matrix A is not usually square and
        so has no eigenvalues of its own — but AᵀA and AAᵀ are both square, both symmetric, and so both get everything
        on this page. That is precisely where <strong>singular-value decomposition</strong> and <strong>PCA</strong>{' '}
        come from.
      </Para>

      <Terms
        items={[
          {
            term: 'Q',
            def: 'The matrix of orthonormal eigenvectors, one per column. The traditional letter, shared with the QR decomposition in Lecture 3.',
          },
          {
            term: 'Λ',
            say: 'capital lambda',
            def: 'The diagonal matrix of eigenvalues, in the same order as the columns of Q.',
          },
          {
            term: 'diagonal matrix',
            def: 'Zeros everywhere except the main diagonal. Multiplying by one scales each coordinate separately and mixes nothing.',
          },
          {
            term: 'orthogonal matrix',
            def: 'A square matrix with QᵀQ = I, so its inverse is free: it is just the transpose. Its columns are orthonormal.',
          },
        ]}
      />

      <WhyAiml method="PCA · whitening with Σ^(−1/2) · matrix powers and the matrix square root">
        <p className="mb-2">
          A = QΛQᵀ <em>is</em> PCA. Compute the covariance matrix of your centred data, decompose it, and the columns of
          Q are the principal components while the diagonal of Λ is the variance along each. Keeping the first k columns
          of Q is the projection, and the fraction of the trace of Λ they account for is the “variance explained”.
          Truncated SVD, latent semantic analysis and kernel PCA are all this same line with a different matrix
          substituted in.
        </p>
        <p>
          The decomposition also makes hard operations easy, because anything you do to the diagonal you have done to
          the matrix. A² = QΛ²Qᵀ, A⁻¹ = QΛ⁻¹Qᵀ, and Σ^(−1/2) = QΛ^(−1/2)Qᵀ — that last one is <strong>whitening</strong>
          , the transform that turns correlated features into a cloud with identity covariance, and it is what batch
          normalisation approximates cheaply with a diagonal-only version. It is also how a negative eigenvalue in a
          supposedly positive semi-definite matrix gets repaired: decompose, clip the diagonal at zero, rebuild. Every
          one of those tricks needs the eigenvectors to be orthonormal, so every one of them needs symmetry.
        </p>
      </WhyAiml>

      <Takeaway>
        A = QΛQᵀ for symmetric A: eigenvectors in the columns of Q, eigenvalues down Λ. QᵀQ = I is what lets the last
        factor be a transpose rather than an inverse. Read right to left it is rotate, stretch, rotate back — and AᵀA or
        AAᵀ is how a rectangular data matrix gets to join in.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  traceeigs: (
    <>
      <Para>
        Slide 29 hands you two checks that cost nothing and catch most eigenvalue mistakes before they leave the page.
      </Para>
      <Formula>
        λ₁ + λ₂ + … + λₙ = tr(A)
        <br />
        λ₁ · λ₂ · … · λₙ = det(A)
      </Formula>
      <Para>
        Both come from the same place: the characteristic polynomial can be written as a product over its roots, pₐ(λ) =
        (λ₁ − λ)(λ₂ − λ) … (λₙ − λ), and then the two sides are compared coefficient by coefficient.
      </Para>

      <Para>
        <strong>The sum.</strong> Multiply out that product and ask where λⁿ⁻¹ comes from. You must take the −λ from all
        but one bracket and the λᵢ from the one left over, and there are n ways to choose it — so the coefficient is
        (−1)ⁿ⁻¹(λ₁ + λ₂ + … + λₙ). But part 6 already worked out that same coefficient a completely different way, by
        expanding the determinant directly, and got (−1)ⁿ⁻¹ tr(A). Two routes to one coefficient, so the two expressions
        must be equal.
      </Para>
      <Para>
        <strong>The product.</strong> This one is even shorter. Put λ = 0 into det(A − λI) = (λ₁ − λ)…(λₙ − λ). The left
        side becomes det(A). The right side becomes λ₁λ₂…λₙ. That is the whole proof.
      </Para>

      <Beyond>
        Two consequences worth carrying. First, if any eigenvalue is 0 then the product is 0, so det A = 0 and A is
        singular — the same fact part 8 arrived at from the other direction. Second, for a 2 × 2 you barely need the
        polynomial at all: the two eigenvalues are the pair of numbers that add to the trace and multiply to the
        determinant, which for small whole numbers you can often just spot.
      </Beyond>

      <Para>
        The lab checks both on any matrix you type, including matrices whose eigenvalues are irrational and matrices
        whose eigenvalues are complex — the identities hold in every case, which is a good sign that they are about the
        polynomial rather than about the numbers being tidy.
      </Para>

      <Lab>
        <TraceEigenLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Π',
            say: 'capital pi, or "product"',
            def: 'Multiply everything together, the way Σ means add everything together.',
          },
          {
            term: 'factorisation of a polynomial',
            def: 'Writing it as brackets multiplied together, one bracket per root. λ² − 5λ + 6 factorises as (λ − 2)(λ − 3).',
          },
          {
            term: 'comparing coefficients',
            def: 'Two ways of writing the same polynomial must agree power by power. Used twice on this page, and it is the standard trick for extracting facts from a factorisation.',
          },
        ]}
      />

      <WhyAiml method="log det Σ = Σ log λᵢ · the condition number · effective rank">
        <p className="mb-2">
          Every Gaussian log-likelihood contains a −½ log det(Σ) term, and computing it as the logarithm of a product
          overflows immediately for any realistic dimension: a hundred eigenvalues around 10 multiply to 10¹⁰⁰. This
          page is the identity that rescues it — log det Σ = Σ log λᵢ turns a product into a sum, and a sum of a hundred
          logarithms is a perfectly ordinary number. Every Gaussian process implementation computes its marginal
          likelihood this way, usually from the Cholesky diagonal rather than from eigenvalues.
        </p>
        <p>
          The trace has a job of its own here. In PCA, the trace is the total variance in the data, so the fraction
          explained by the first k components is (λ₁ + … + λₖ) / tr(Σ) — and it can be computed from the trace without
          touching the discarded eigenvalues at all. The ratio of the largest eigenvalue to the smallest is the{' '}
          <strong>condition number</strong>, which predicts how badly a linear solve will lose accuracy and how slowly
          gradient descent will converge on a quadratic bowl. All three quantities are read off the same list of
          numbers.
        </p>
      </WhyAiml>

      <Takeaway>
        The eigenvalues add up to the trace and multiply to the determinant. Both fall out of pₐ(λ) = Π(λᵢ − λ) — the
        first by comparing the λⁿ⁻¹ coefficients, the second by setting λ = 0. Use them to check every eigenvalue answer
        you write.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  cholesky: (
    <>
      <Para>
        The lecture ends with a second decomposition, of a completely different character from A = QΛQᵀ. This one does
        not involve eigenvalues at all, it is far cheaper to compute, and it asks more of A in return.
      </Para>
      <Formula>A symmetric and positive definite ⟹ A = LLᵀ, L lower triangular with positive diagonal</Formula>
      <Para>
        “Lower triangular” means every entry above the main diagonal is zero. So L is half a matrix, and the claim is
        that a symmetric positive definite A is exactly that half multiplied by its own mirror image. It is often called
        the <strong>matrix square root</strong>, and the comparison is a fair one: a positive number has a real square
        root, a positive definite matrix has an L, and neither works if you drop the “positive”.
      </Para>

      <Para>
        Slide 30 sets out the 3 × 3 case as a picture — the lower-triangular L on the left, its transpose on the right,
        and A as their product. The formulas that follow are not conjured; they come from multiplying that product out
        one entry at a time and reading off what each l must be. Here is the derivation the slide leaves implicit:
      </Para>
      <Worked title="Where each formula comes from">
        {`Entry (1,1):  row 1 of L · column 1 of Lᵀ  =  l₁₁²
              so a₁₁ = l₁₁²         →   l₁₁ = √a₁₁

Entry (2,1):  l₂₁l₁₁
              so a₂₁ = l₂₁l₁₁       →   l₂₁ = a₂₁ / l₁₁

Entry (2,2):  l₂₁² + l₂₂²
              so a₂₂ = l₂₁² + l₂₂²  →   l₂₂ = √(a₂₂ − l₂₁²)

Entry (3,1):  l₃₁l₁₁                →   l₃₁ = a₃₁ / l₁₁
Entry (3,2):  l₃₁l₂₁ + l₃₂l₂₂       →   l₃₂ = (a₃₂ − l₃₁l₂₁) / l₂₂
Entry (3,3):  l₃₁² + l₃₂² + l₃₃²    →   l₃₃ = √(a₃₃ − (l₃₁² + l₃₂²))`}
      </Worked>
      <Para>
        Those are exactly the six on the slide. Read down them and one rule is doing all the work: a{' '}
        <strong>diagonal</strong> entry is the square root of what is left of aᵢᵢ after the squares to its left are
        taken away, and an entry <strong>below</strong> the diagonal is its own leftover divided by the diagonal entry
        above it. Notice the order — every formula uses only values worked out before it, which is why the whole thing
        can be done in one pass.
      </Para>
      <Para>
        Now you can see where positive definiteness earns its keep. Three of those six formulas take a square root, and
        each one needs the quantity underneath to be positive. Positive definiteness is precisely the promise that it
        always is. Hand the algorithm a symmetric matrix that is not positive definite and it does not produce a wrong
        answer — it stops, because there is no real number to take.
      </Para>

      <Para>
        The lab works the six formulas as you type, prints them with your numbers substituted in, and then multiplies L
        by Lᵀ and reports the largest disagreement with A. The third preset is a matrix that fails on purpose.
      </Para>

      <Lab>
        <CholeskyLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Cholesky',
            say: 'shuh-LESS-key',
            def: 'Named after André-Louis Cholesky. The decomposition A = LLᵀ for symmetric positive definite A.',
          },
          {
            term: 'lower triangular',
            def: 'Every entry above the main diagonal is zero. Upper triangular is the mirror image, and Lᵀ is upper triangular whenever L is lower.',
          },
          {
            term: 'lᵢⱼ',
            say: 'ell i j',
            def: 'The entry of L in row i, column j. Lower case for the entries, capital L for the matrix — a convention worth keeping straight.',
          },
        ]}
      />

      <WhyAiml method="scipy.linalg.cho_factor · Gaussian process regression · adding jitter">
        <p className="mb-2">
          Cholesky is the workhorse of anything Gaussian. A Gaussian process makes predictions by solving Ky = b for a
          kernel matrix K, and because K is symmetric and positive definite the solve goes through Cholesky rather than
          through LU — which is about twice as fast and uses half the memory, since only one triangle is ever stored.
          The log-determinant needed for the marginal likelihood comes out of the same factorisation for free: it is
          twice the sum of the logs of L’s diagonal.
        </p>
        <p>
          Its most useful property in practice is that it fails. Because the algorithm stops the instant a matrix is not
          positive definite, <strong>a Cholesky attempt is the standard test</strong> — it is cheaper and more reliable
          than computing eigenvalues and checking their signs. Anyone who has fitted a Gaussian process has met the
          failure: a kernel matrix that is positive definite in exact arithmetic can lose that property to rounding when
          two training inputs are nearly identical, and the universal fix is to add a small multiple of the identity —
          “jitter”, typically 10⁻⁶ — to lift the smallest eigenvalue back above zero. That is ridge regression’s λI in a
          different costume.
        </p>
      </WhyAiml>

      <Takeaway>
        A = LLᵀ with L lower triangular, for symmetric positive definite A. Each diagonal entry is a square root of what
        is left over, each entry below it is a leftover divided by the diagonal above. The square roots are why positive
        definiteness is required, and why a failed Cholesky is the standard test for it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  gaussian: (
    <>
      <Para>
        The last slide answers the question a maths lecture ought to answer: what is any of this actually for? Slide 31
        picks one job, and it is a job done thousands of times a second inside real systems.
      </Para>
      <Para>The setup is four sentences on the slide, and they chain together:</Para>
      <List
        items={[
          <>
            Data in machine learning is frequently modelled as <strong>multivariate Gaussian</strong>.
          </>,
          <>
            A multivariate Gaussian is governed by a <strong>covariance matrix</strong>, which is symmetric and positive
            definite.
          </>,
          <>
            You often need to <strong>draw samples</strong> from such a distribution.
          </>,
          <>That is where the Cholesky decomposition earns its place.</>,
        ]}
      />

      <Para>
        The difficulty is worth stating plainly. Generating one Gaussian random number is easy and every language does
        it. Generating a whole <em>vector</em> of them, where the components have to lean on each other in a specific
        pattern — height and weight correlated at 0.7, say — is not obvious at all. The recipe on slide 31 makes it
        obvious:
      </Para>
      <List
        items={[
          <>Factor the covariance matrix Σ into its Cholesky factor L, so that Σ = LLᵀ.</>,
          <>
            Generate a vector z of independent standard Gaussian numbers, which is the easy thing — n separate calls to
            a one-dimensional generator, no structure at all.
          </>,
          <>Compute Lz. That vector is a sample from the distribution you actually wanted.</>,
        ]}
      />

      <Para>Why does it work? One line, using how covariance behaves under a matrix:</Para>
      <Formula>Cov(Lz) = L · Cov(z) · Lᵀ = L · I · Lᵀ = LLᵀ = Σ</Formula>
      <Para>
        The independent vector z has covariance I — variance 1 in each direction and no correlation anywhere.
        Multiplying by L turns that identity into LLᵀ, and LLᵀ is Σ by construction. L is exactly the matrix that
        converts “easy to sample” into “what you wanted”.
      </Para>

      <Para>
        The lab shows it happening. The grey cloud is z: round, and the same in every direction. The teal cloud is the
        same points after L, and it stretches and leans according to the covariance you set. The measured covariance of
        the output is printed beside the one you asked for.
      </Para>

      <Lab>
        <GaussianSampleLab />
      </Lab>

      <Beyond>
        The deck’s recipe produces a sample centred on zero, because it never mentions a mean. To get a distribution
        centred somewhere else you add the mean afterwards: <strong>x = μ + Lz</strong>. That is the complete recipe as
        it appears in any library, and it is worth knowing because the machine learning use below is written in exactly
        that form.
      </Beyond>

      <Terms
        items={[
          {
            term: 'multivariate Gaussian',
            def: 'The bell curve with more than one variable. Instead of a mean and a variance it has a mean vector and a covariance matrix.',
          },
          {
            term: 'covariance matrix',
            say: 'co-VAIR-ee-unce',
            def: 'A square table whose diagonal holds the variance of each variable and whose off-diagonal entries say how much each pair move together. Always symmetric. Lecture 0b builds one from data.',
          },
          {
            term: 'standard Gaussian',
            def: 'Mean 0, variance 1. A vector of independent ones has covariance I, which is the round cloud in the lab.',
          },
          {
            term: 'Σ',
            say: 'capital sigma',
            def: 'The usual letter for a covariance matrix. Confusingly it is also the summation sign — context tells them apart, since one has indices under it and the other does not.',
          },
        ]}
      />

      <WhyAiml method="the reparameterisation trick in a VAE · sampling a Gaussian process posterior">
        <p className="mb-2">
          This is the last line of a variational autoencoder’s encoder, and it is why VAEs can be trained by gradient
          descent at all. The network outputs μ and a covariance, and the sample is drawn as <strong>z = μ + Lε</strong>{' '}
          with ε standard Gaussian — the <strong>reparameterisation trick</strong>. Written that way the randomness sits
          in ε, which has no parameters, so the gradient can flow through μ and L untouched. Sampling directly from the
          distribution instead would put a random step in the middle of the graph and there would be nothing to
          differentiate. Most VAEs use a diagonal covariance, so L is diagonal and the line collapses to z = μ + σ ⊙ ε —
          but it is this slide, with the general case narrowed.
        </p>
        <p>
          The general case is exactly what Gaussian processes need. Drawing a function from a GP posterior means
          sampling a vector whose components are correlated according to the kernel, and the implementation is literally
          slide 31: Cholesky the covariance, draw independent normals, multiply. It is also how correlated noise is
          generated for simulations and how model uncertainty is turned into the shaded bands you see around a forecast.
          The same three lines every time.
        </p>
      </WhyAiml>

      <Takeaway>
        To sample a multivariate Gaussian: factor Σ = LLᵀ, draw independent standard normals z, and take Lz — because
        Cov(Lz) = LILᵀ = Σ. Add μ if the distribution is not centred at the origin. This is the reparameterisation
        trick, and it is what the whole lecture has been building towards.
      </Takeaway>
    </>
  ),
}
