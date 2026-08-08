'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These three come
 * out of Lecture 0a, and each links back to the chapter parts it was drawn from.
 */
import { CofactorLab, Det2Lab, DetRulesLab } from '@/components/charts/det-lab'
import { GaussJordanInverseLab, Inverse2Lab } from '@/components/charts/inverse-lab'
import { MultiplyLab, TransposeRulesLab } from '@/components/charts/matrix-algebra-lab'
import { RankLab } from '@/components/charts/rowops-lab'
import { OutcomesLab } from '@/components/charts/systems-lab'
import { IndependenceLab, RankVectorsLab } from '@/components/charts/vector-space-lab'
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

export function MatrixMultiplyConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Multiplying matrices"
        intro="The one operation that does not work the way you would guess. Once you see what it is actually doing — every row of one thing meeting every column of another — it stops being a rule to memorise and becomes something you can predict."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A café sells three drinks. You know how much <strong>coffee, milk and sugar</strong> each drink uses, and
            you know the <strong>price</strong> of coffee, milk and sugar at four different suppliers. You want the cost
            of each drink at each supplier.
          </>,
          <>
            To cost one drink at one supplier, you walk along that drink’s recipe and down that supplier’s price list,
            multiplying each ingredient by its price and adding as you go. Do that for every drink and every supplier
            and you have filled in a whole table. That is matrix multiplication, and there is nothing else to it.
          </>,
        ]}
        mappings={[
          {
            title: 'Rows of the left matrix',
            body: 'The recipes. One row per drink, one column per ingredient.',
          },
          {
            title: 'Columns of the right matrix',
            body: 'The price lists. One row per ingredient, one column per supplier.',
          },
          {
            title: 'Why the shapes must match',
            body: 'A recipe lists 3 ingredients, so a price list must have 3 rows. Otherwise there is nothing to pair up.',
          },
        ]}
        footnote="The answer has one row per drink and one column per supplier. That is exactly the (m × n)·(n × p) = (m × p) rule, with the ingredients cancelling out of the middle."
      />

      <H2>The rule, and what it costs</H2>
      <P>
        To get the number in row j, column k of the answer: walk along row j of the left matrix and down column k of the
        right one, multiplying each pair and adding. Press any number in the answer below and both are lit up for you.
      </P>

      <Lab>
        <MultiplyLab />
      </Lab>

      <H2>Two things that stop being true</H2>
      <P>
        With ordinary numbers, 3 × 5 and 5 × 3 are the same. With matrices they usually are not, and often one of the
        two does not even exist because the shapes refuse. So the order is part of what you are asking for.
      </P>
      <P>
        And with ordinary numbers, if ab = 0 then one of them is 0. Not here — the third preset above has two matrices,
        neither of them zero, whose product is all zeros. Which also means you cannot cancel: AB = AC does <em>not</em>{' '}
        give you B = C.
      </P>

      <H2>The transpose, and the reversal</H2>
      <P>
        Tipping a matrix over turns its rows into columns. On its own that is a filing detail. What makes it worth a
        section is the rule for products: <span className="font-mono">(AB)ᵀ = BᵀAᵀ</span>. You transpose{' '}
        <strong>and reverse the order</strong>.
      </P>

      <Lab>
        <TransposeRulesLab />
      </Lab>

      <P>
        Socks then shoes is undone by shoes then socks. The same reversal turns up for inverses:{' '}
        <span className="font-mono">(AB)⁻¹ = B⁻¹A⁻¹</span>. Any time you undo a sequence, the order flips.
      </P>

      <Explainers
        plain="Matrix multiplication combines every row of the left with every column of the right. Each answer entry is one row-meets-column sum. The columns of the left must match the rows of the right, and the answer has the rows of the left and the columns of the right."
        breaks="It breaks whenever you assume it behaves like ordinary multiplication. AB is not BA. AB can be zero without either being zero. You cannot cancel. And transposing or inverting a product reverses the order, which is the single most common slip in exam scripts."
      >
        <MathBlock
          intro="Three lines. The first is the definition; the other two are the consequences people forget."
          formulas={[
            {
              formula: 'cⱼₖ = aⱼ₁b₁ₖ + aⱼ₂b₂ₖ + … + aⱼₙbₙₖ',
              reading:
                'Row j of A meets column k of B. Multiply the matching pairs, add them up. That single number is one entry of the answer.',
            },
            {
              formula: '(m × n) · (n × p) = (m × p)',
              reading:
                'The two inner numbers must agree and then disappear. The outer two are the shape of what comes out.',
            },
            {
              formula: '(AB)ᵀ = BᵀAᵀ,    (AB)⁻¹ = B⁻¹A⁻¹',
              reading:
                'Transposing or undoing a product reverses the order. Keeping the order usually will not even fit.',
            },
          ]}
          legend={[
            {
              sym: 'aⱼₗ',
              name: 'Left matrix entry',
              note: 'Row j, column l. Rows are always said first.',
              val: 'the recipe',
            },
            { sym: 'bₗₖ', name: 'Right matrix entry', note: 'Row l, column k.', val: 'the price' },
            { sym: 'cⱼₖ', name: 'Answer entry', note: 'The sum of all the matching products.', val: 'the cost' },
            {
              sym: 'n',
              name: 'The inner dimension',
              note: 'Columns on the left, rows on the right. Must match.',
              val: 'the ingredients',
            },
            { sym: 'I', name: 'Identity', note: 'AI = IA = A. The matrix that does nothing.', val: 'multiplying by 1' },
            { sym: 'Aᵀ', name: 'Transpose', note: 'Rows become columns. (Aᵀ)ᵀ = A.', val: 'tip it over' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A neural network layer is one matrix multiply',
            how: 'The layer takes its input, multiplies by a matrix of weights and adds a bias. Every forward pass through every layer is exactly the sum above, run billions of times a second.',
          },
          {
            what: 'Batching is why GPUs help',
            how: 'Pushing one example through a layer is a matrix times a vector. Pushing 256 at once is a matrix times a matrix, and that is the operation graphics hardware was built for.',
          },
          {
            what: 'Attention is three matrix products in a row',
            how: 'Queries times keys, a softmax, then times values. The order matters, which is precisely why AB ≠ BA is worth internalising.',
          },
          {
            what: 'The transpose reversal shows up in backpropagation',
            how: 'The gradient flowing back through a layer is multiplied by the transpose of the weight matrix — and in the reverse order to the forward pass.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec0a/multiply', label: 'Lecture 0a · Multiplying two matrices' },
          { href: '/session/lec0a/transpose', label: 'Tipping a matrix over' },
          { href: '/session/lec0a/matrix', label: 'What a matrix is' },
          { href: '/session/lec0a/algebra', label: 'Adding and scaling' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function DeterminantConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="The determinant, and the inverse it decides"
        intro="One number, worked out from a square matrix, that answers one question: can this be undone? If it is zero the matrix has flattened something, and nothing can unflatten it."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Think of a matrix as a machine that takes a shape and moves it. Feed in a unit square and something comes
            out — usually a slanted box. The determinant is the <strong>area of what comes out</strong>, with a minus
            sign if the machine also turned the shape over.
          </>,
          <>
            Now suppose the machine squashes the square completely flat onto a line. The area is zero, and something
            worse has happened: two different starting points now land in the same place. There is no way back. That is
            what a determinant of zero means, and it is the same thing as “no inverse”.
          </>,
        ]}
        mappings={[
          {
            title: 'The two columns',
            body: 'Where the machine sends the two directions of the plane. They become the two edges of the box.',
          },
          {
            title: 'The determinant',
            body: 'The area of that box. It says how much the machine stretches or shrinks things.',
          },
          {
            title: 'Zero determinant',
            body: 'The box is flat. Information has been destroyed, so no undo button exists.',
          },
        ]}
        footnote="For a 3 × 3 it is a volume rather than an area, and the same story holds: zero volume means the machine has squashed space into a flat sheet."
      />

      <H2>Seeing it as an area</H2>
      <P>
        Drag either arrow. The shaded shape is the box the two columns of A make, and its area is |det A|. Bring the two
        arrows into line and the box goes flat.
      </P>

      <Lab>
        <Det2Lab />
      </Lab>

      <H2>Bigger matrices</H2>
      <P>
        Past 2 × 2 there is no formula worth memorising. Instead, expand along a row or column: for each number, cross
        out its row and column, take the determinant of what is left, attach a sign from the{' '}
        <span className="font-mono">+ − + −</span> checkerboard, and add everything up.
      </P>
      <P>
        You may expand along <em>any</em> row or column, so pick the one with the most zeros. Each zero kills a whole
        smaller determinant.
      </P>

      <Lab>
        <CofactorLab />
      </Lab>

      <H2>The rules that save all the work</H2>
      <P>
        Six of them, and one carries most of the weight: adding a multiple of one row to another leaves the determinant
        completely alone. That is the licence to row-reduce a matrix to triangular shape and just multiply the diagonal
        — which is what a computer actually does.
      </P>

      <Lab>
        <DetRulesLab />
      </Lab>

      <H2>And then the inverse</H2>
      <P>
        A⁻¹ is the matrix with <span className="font-mono">A A⁻¹ = I</span>. For a 2 × 2 there is a short formula, and
        it divides by the determinant — so a zero there kills it outright.
      </P>

      <Lab>
        <Inverse2Lab />
      </Lab>

      <P>
        At any size, the reliable method is to write A beside the identity and row-reduce until the left half becomes
        the identity. Whatever the right half turned into is A⁻¹. If a row goes to zero along the way, the method stops
        and tells you honestly that there is no inverse.
      </P>

      <Lab>
        <GaussJordanInverseLab />
      </Lab>

      <Explainers
        plain="The determinant is one number worked out from a square matrix. Geometrically it is the signed area (or volume) of the box the columns make. It is zero exactly when the columns lie in a flat sheet, which is exactly when there is no inverse. The inverse itself is found by row-reducing [A | I] until the left half is the identity."
        breaks="It only exists for square matrices, so a rectangular data matrix has neither a determinant nor an inverse. And det(cA) = cⁿ det A, not c det A — forgetting the power is the most common exam slip. In floating-point arithmetic a determinant that ought to be zero comes out as 10⁻¹⁷ instead, which is why real software checks the rank or the condition number rather than testing det A == 0."
      >
        <MathBlock
          intro="Five lines. The first two are how you work it out; the last three are what it tells you."
          formulas={[
            { formula: 'det A = ad − bc    (2 × 2)', reading: 'The signed area of the box the two columns make.' },
            {
              formula: 'det A = Σⱼ (−1)^(j+k) aⱼₖ Mⱼₖ',
              reading:
                'Cofactor expansion along any row or column. Mⱼₖ is the minor: the determinant left when you cross out row j and column k.',
            },
            {
              formula: 'det(AB) = det A · det B,   det Aᵀ = det A,   det(cA) = cⁿ det A',
              reading:
                'Determinants pass straight through multiplication and transposing. Scaling the whole matrix scales it n times over.',
            },
            {
              formula: 'A⁻¹ exists  ⟺  det A ≠ 0  ⟺  rank A = n',
              reading: 'Three ways of saying the same thing. A matrix that fails them is called singular.',
            },
            {
              formula: '[ A | I ]  →  [ I | A⁻¹ ]',
              reading: 'The moves that turn A into I are the moves that undo A. Doing them to I writes them down.',
            },
          ]}
          legend={[
            {
              sym: 'det A',
              name: 'Determinant',
              note: 'One number from a square matrix. Also written |A|.',
              val: 'the area',
            },
            {
              sym: 'Mⱼₖ',
              name: 'Minor',
              note: 'The determinant left after crossing out row j and column k.',
              val: 'one term',
            },
            {
              sym: 'Cⱼₖ',
              name: 'Cofactor',
              note: 'The minor with its checkerboard sign attached.',
              val: '(−1)^(j+k) Mⱼₖ',
            },
            {
              sym: 'I',
              name: 'Identity',
              note: 'det I = 1, which is what makes the AB = I argument work.',
              val: 'do nothing',
            },
            {
              sym: 'A⁻¹',
              name: 'Inverse',
              note: 'Undoes A. Square matrices only, and only when det A ≠ 0.',
              val: 'the undo button',
            },
            {
              sym: 'singular',
              name: 'No inverse',
              note: 'det A = 0, rank below full, columns not independent.',
              val: 'the flat case',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A zero determinant is a data problem, not a maths problem',
            how: 'It means two of your columns say the same thing — height in centimetres and height in inches. No method can separate their two effects, so the model cannot tell you which one mattered.',
          },
          {
            what: 'Near-zero is worse than zero',
            how: 'An exactly singular matrix fails loudly. An almost singular one solves fine and gives wildly unstable weights. That instability is why regularisation exists.',
          },
          {
            what: 'Nobody actually inverts a matrix to solve a system',
            how: 'Working out A⁻¹ and then multiplying is slower and less accurate than solving Ax = b directly. The inverse is a thinking tool; elimination is the method.',
          },
          {
            what: 'Determinants appear in probability',
            how: 'The formula for a multivariate normal distribution divides by the square root of the determinant of the covariance matrix — and a zero there means the distribution has collapsed onto a flat sheet.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec0a/det', label: 'Lecture 0a · The determinant' },
          { href: '/session/lec0a/bigdet', label: 'Bigger determinants' },
          { href: '/session/lec0a/detrules', label: 'Six rules determinants obey' },
          { href: '/session/lec0a/inverse', label: 'The inverse' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function RankConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Concept"
        title="Rank: how much your data really says"
        intro="Count the rows that are genuinely saying something new. That single number decides whether a set of equations has no answer, one answer, or endlessly many — and it is the honest measure of how much information you actually have."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Three witnesses give statements about the same event. The first says something new. The second says
            something new. The third just repeats the first two in different words. You have{' '}
            <strong>three statements but two witnesses’ worth of information</strong>.
          </>,
          <>
            Rank is that count. Tidy a matrix into staircase form and any row that was a repeat — a copy, a double, a
            mixture of the others — collapses to all zeros and drops out. What is left is the rank, and it does not
            depend on how you tidied.
          </>,
        ]}
        mappings={[
          {
            title: 'Each row',
            body: 'One equation, or one witness statement. Whether it adds anything is the whole question.',
          },
          {
            title: 'A row going to zero',
            body: 'That row was already implied by the others. It was never adding information.',
          },
          { title: 'The rank', body: 'How many rows survive. Never more than the number of rows, or of columns.' },
        ]}
        footnote="Rank works down the columns too, and gives the same number — which is a genuinely surprising fact worth knowing, even though this course does not prove it."
      />

      <H2>Counting it</H2>
      <P>
        Row-reduce to a staircase and count the rows that are not all zeros. Try the suggestion under the lab: make row
        2 an exact copy of row 1, and watch the count drop by one every time.
      </P>

      <Lab>
        <RankLab />
      </Lab>

      <H2>The same count, said about vectors</H2>
      <P>
        There is a second way to say all of this, and it is the one Lecture 0b uses. A set of vectors is{' '}
        <strong>linearly independent</strong> when the only way to mix them down to zero is to take none of any of them.
        If some other mixture works, the set is <strong>dependent</strong>, and one of the vectors is a combination of
        the rest.
      </P>
      <P>
        Drag the two arrows below until one lies along the other. The shading collapses from the whole plane to a single
        line, and the verdict flips — because the second arrow has stopped offering anywhere new to go.
      </P>

      <Lab>
        <IndependenceLab />
      </Lab>

      <P>
        That picture runs out at three dimensions. Rank is what replaces it. Lay p vectors out as the rows of a matrix
        and take the rank: <strong>rank = p</strong> means independent, <strong>rank {'<'} p</strong> means dependent.
        Same count, no drawing required.
      </P>

      <Lab>
        <RankVectorsLab />
      </Lab>

      <P>
        One shortcut falls straight out and is worth having in an exam: if there are more vectors than components, they{' '}
        <em>must</em> be dependent. Three vectors in ℝ² are always dependent, and so are five in ℝ⁴. There simply are
        not that many independent directions to go round.
      </P>

      <H2>What it decides</H2>
      <P>
        Stick the right-hand side of a system onto A as one extra column and work out two ranks: rank A, and rank of the
        whole augmented matrix. Comparing them answers the question completely.
      </P>
      <P>
        If they <strong>differ</strong>, there is no answer — the extra column carried information the coefficients
        could not account for, which shows up as a row reading 0 = something that is not zero. If they{' '}
        <strong>match</strong>, there is an answer, and the number of free unknowns is simply (unknowns − rank). Zero
        free means exactly one answer; anything else means endlessly many.
      </P>

      <Lab>
        <OutcomesLab />
      </Lab>

      <Explainers
        plain="Rank is the number of non-zero rows left after row reduction — a count of genuinely different rows. Compare rank A with rank [A | b]: different means no solution, the same means there is one. Then unknowns minus rank counts the free variables, and that decides between one answer and endlessly many."
        breaks="Rank is a yes-or-no count and real data is never that clean. Two columns that are 99% the same give full rank on paper and behave like a rank-deficient matrix in practice — the solution exists but is wildly unstable. That is why real software reports singular values rather than a rank, and why regularisation is standard rather than optional."
      >
        <MathBlock
          intro="Four lines. The first defines it, the rest use it."
          formulas={[
            {
              formula: 'rank A = number of non-zero rows in an echelon form of A',
              reading:
                'Equivalently, the number of pivots. It does not depend on which route you took, because the reduced row echelon form is unique.',
            },
            {
              formula: 'rank A ≤ min(m, n)',
              reading: 'You can never have more genuinely different rows than you have rows, or than you have columns.',
            },
            {
              formula: 'rank A ≠ rank [A | b]  ⟹  no solution',
              reading: 'A contradiction row has appeared. The system is inconsistent, whatever the numbers.',
            },
            {
              formula: 'free variables = n − rank A',
              reading:
                'When the ranks match. Zero free variables means one answer; one or more means endlessly many, with that many dials to set.',
            },
          ]}
          legend={[
            {
              sym: 'rank',
              name: 'The count',
              note: 'Non-zero rows after tidying. Genuinely different rows.',
              val: 'the witnesses',
            },
            {
              sym: '[A | b]',
              name: 'Augmented matrix',
              note: 'A with the right-hand side stuck on as one more column.',
              val: 'part 8',
            },
            { sym: 'full rank', name: 'As big as possible', note: 'min(m, n). Nothing repeats.', val: 'the good case' },
            {
              sym: 'singular',
              name: 'Rank below full',
              note: 'For a square matrix: det A = 0 and no inverse.',
              val: 'the flat case',
            },
            { sym: 'free variable', name: 'One you choose', note: 'An unknown no pivot landed on.', val: 'a dial' },
            {
              sym: 'Ax = 0',
              name: 'Homogeneous',
              note: 'Always consistent. Has answers beyond zero exactly when rank < n.',
              val: 'always at least one',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Rank tells you how many features you really have',
            how: 'A hundred columns with rank twelve means twelve genuine measurements dressed up as a hundred. Everything else is a mixture of those twelve.',
          },
          {
            what: 'It is what dimension reduction is measuring',
            how: 'PCA looks for the smallest number of directions that carry nearly all the variation. That is a soft, tolerant version of counting the rank.',
          },
          {
            what: 'Free variables mean your data has not decided',
            how: 'If the system for the weights has endless answers, many different models fit equally well and nothing chooses between them. Regularisation is what breaks the tie.',
          },
          {
            what: 'Low-rank approximation is a compression trick',
            how: 'Keeping only the strongest few directions of a big matrix stores a fraction of the numbers and loses very little. It is how recommendation systems and LoRA fine-tuning both work.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/lec0a/rank', label: 'Lecture 0a · Rank' },
          { href: '/session/lec0a/rref', label: 'Reduced row echelon form' },
          { href: '/session/lec0a/outcomes', label: 'None, one, or endless' },
          { href: '/session/lec0b/independence', label: 'Lecture 0b · Independent or repeating?' },
          { href: '/session/lec0b/rank', label: 'Rank does the counting' },
          { href: '/session/lec0b/pivots', label: 'Pivot columns' },
        ]}
      />
    </div>
  )
}
