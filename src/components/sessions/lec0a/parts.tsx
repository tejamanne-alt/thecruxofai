/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { CofactorLab, Det2Lab, Det3Lab, DetRulesLab, DetTriangleLab } from '@/components/charts/det-lab'
import { GaussJordanInverseLab, Inverse2Lab } from '@/components/charts/inverse-lab'
import {
  MatrixAnatomyLab,
  MatrixLawsLab,
  MultiplyLab,
  SpecialMatrixLab,
  TransposeRulesLab,
} from '@/components/charts/matrix-algebra-lab'
import { OctaveConsole, OctavePlotLab } from '@/components/charts/octave-lab'
import { PositiveDefiniteLab } from '@/components/charts/quadform-lab'
import { EchelonWalkLab, RankLab, RowOpsLab, RrefLab } from '@/components/charts/rowops-lab'
import {
  HomogeneousLab,
  HousePriceLab,
  OutcomesLab,
  ParameterKLab,
  ParameterLab,
} from '@/components/charts/systems-lab'
import { Para, Takeaway, Terms, Worked } from '../session-parts'

/** A little spacer so a lab never sits flush against the words above it. */
function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
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

export const LEC0A_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  octave: (
    <>
      <Para>
        This course does its sums in <strong>Octave</strong>. It is free, it runs in a browser or on your own machine,
        and it does almost everything MATLAB does. If you have used MATLAB, the commands are the same.
      </Para>
      <Para>
        Octave is built around one idea: you work on <strong>whole lists of numbers at once</strong>. In most languages
        you would write a loop to double every number in a list. In Octave you write <code>2*x</code> and it is done.
        That is why it suits matrices — a matrix is just a list of lists.
      </Para>
      <Para>The very first thing the lecture types is a plot. Here it is, live:</Para>

      <Lab>
        <OctavePlotLab />
      </Lab>

      <Para>
        The line <code>x = 0:0.1:10</code> reads &ldquo;start at 0, go up in steps of 0.1, stop at 10&rdquo;. That is
        the <strong>colon operator</strong>, and it is how you make a list without typing it out. Then{' '}
        <code>y = sin(x)</code> takes the sine of every number in that list in one go, and <code>plot(x, y)</code> joins
        the points up.
      </Para>
      <Para>
        The thing worth taking away is what happened when you pushed the step slider up. Octave has no idea what a sine
        wave is. It only has your points, and it joins them with straight lines. A smooth-looking curve is just a lot of
        short straight lines.
      </Para>

      <Terms
        items={[
          {
            term: 'Octave',
            def: 'A free program for doing maths with numbers, lists and matrices. Same language as MATLAB for nearly everything in this course.',
          },
          {
            term: '0:0.1:10',
            say: 'zero, colon, nought point one, colon, ten',
            def: 'A list from 0 to 10 going up in steps of 0.1. Start, step, stop.',
          },
          {
            term: 'vectorised',
            def: 'Doing something to a whole list in one line, with no loop. Octave prefers this and so does every maths library you will meet later.',
          },
          {
            term: ';',
            say: 'semicolon',
            def: 'Put one at the end of a line and Octave does the work but stays quiet. Leave it off and it prints the answer.',
          },
        ]}
      />
      <Takeaway>
        Octave works on whole lists at once, and a plot is only ever the points you gave it joined with straight lines.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  matrix: (
    <>
      <Para>
        A <strong>matrix</strong> is a box of numbers laid out in rows and columns. That is the whole definition. It is
        not doing anything clever on its own — it is a way of keeping a lot of numbers organised so you can talk about
        all of them at once.
      </Para>
      <Para>
        A spreadsheet is a matrix. A greyscale photo is a matrix, one number per pixel. A table of exam marks with one
        row per student is a matrix. Once you notice that, most of this lecture stops feeling abstract.
      </Para>
      <Para>
        Its <strong>shape</strong> is written <span className="font-mono">m × n</span>: m rows by n columns.{' '}
        <em>Rows first, always.</em> A 2 × 3 matrix has 2 rows and 3 columns, so it looks wide, not tall. That
        rows-first habit also runs through the name of each individual number: a<sub>23</sub> means row 2, column 3.
      </Para>

      <Lab>
        <MatrixAnatomyLab />
      </Lab>

      <Para>
        Two special shapes have their own names. A matrix with only one row is a <strong>row vector</strong>. One with
        only one column is a <strong>column vector</strong>. So a vector is not a different kind of object — it is a
        very thin matrix. In this course, when someone writes <span className="font-mono">x</span> and means a vector,
        they nearly always mean a column.
      </Para>
      <Para>
        And two matrices are <strong>equal</strong> only when they have the same shape and every matching pair of
        numbers agrees. There is no partial credit. One number out of place and they are different matrices.
      </Para>

      <Worked title="How the lecture writes one down">
        {`A = [1 2 3; 4 5 6]        in Octave

    ⎡ 1  2  3 ⎤
A = ⎢         ⎥            on paper — a 2 × 3 matrix
    ⎣ 4  5  6 ⎦

a₁₁ = 1     row 1, column 1
a₂₃ = 6     row 2, column 3`}
      </Worked>

      <Terms
        items={[
          {
            term: 'matrix',
            say: 'may-trix',
            def: 'A rectangular box of numbers. The plural is matrices, said "may-tri-sees".',
          },
          { term: 'm × n', say: 'm by n', def: 'The shape: m rows and n columns. Rows are always said first.' },
          { term: 'aⱼₖ', say: 'a j k', def: 'The number in row j, column k. Row first, column second.' },
          { term: 'row vector', def: 'A matrix with a single row, lying flat: [1 2 3].' },
          { term: 'column vector', def: 'A matrix with a single column, standing up. The usual meaning of "vector" here.' },
          { term: 'square matrix', def: 'Same number of rows as columns. Determinants and inverses only exist for these.' },
        ]}
      />
      <Takeaway>A matrix is a box of numbers, m rows by n columns. Rows are always said first.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  algebra: (
    <>
      <Para>
        There are two easy things you can do to matrices, and one awkward one. This part covers the two easy ones; the
        awkward one gets its own page next.
      </Para>
      <Para>
        <strong>Adding</strong> works exactly as you would guess. Line the two boxes up and add each pair of numbers
        that sit on top of each other. The catch is that they must be the <em>same shape</em> — every number needs a
        partner, and if the boxes are different sizes some numbers are left standing on their own.
      </Para>
      <Para>
        <strong>Multiplying by a plain number</strong> (a scalar) is even simpler: every number in the box gets
        multiplied. Nothing else happens.
      </Para>

      <Lab>
        <MatrixLawsLab />
      </Lab>

      <Para>
        Because both of these work slot by slot, all the ordinary rules of arithmetic survive. A + B is the same as
        B + A. Brackets do not matter. A number spread across a sum works as usual. The lab above lets you check each of
        those on numbers you choose, which is more convincing than being told.
      </Para>
      <Para>
        There is also a matrix that behaves like the number 0: the <strong>zero matrix</strong>, all zeros. Add it to
        anything and nothing changes. And every matrix A has a −A, so A + (−A) = 0. Nothing surprising is going on.
      </Para>

      <Worked title="The rules, all of which you already trust for ordinary numbers">
        {`A + B      =  B + A
(A + B) + C =  A + (B + C)
A + 0       =  A
A + (−A)    =  0

c(A + B)    =  cA + cB
(c + k)A    =  cA + kA
c(kA)       =  (ck)A
1A          =  A`}
      </Worked>

      <Terms
        items={[
          { term: 'scalar', def: 'A plain single number, used to stretch or shrink a matrix. It scales things, hence the name.' },
          { term: 'zero matrix', def: 'A matrix of all zeros. Adding it changes nothing, like adding 0 to a number.' },
          {
            term: 'same shape',
            def: 'Same number of rows and same number of columns. Addition needs it; multiplication, as you will see, does not.',
          },
        ]}
      />
      <Takeaway>
        Addition and scaling happen one slot at a time, so every rule you already know still holds. Addition needs both
        boxes to be the same shape.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  multiply: (
    <>
      <Para>
        Matrix multiplication is the one operation that does <em>not</em> work slot by slot, and that surprises
        everybody at first. You might expect AB to multiply each number by the one sitting on top of it. It does not.
      </Para>
      <Para>
        Here is the actual rule. To get the number in <strong>row j, column k</strong> of the answer: walk along row j
        of the left matrix and down column k of the right one, multiplying each pair as you go, then add up everything
        you got.
      </Para>
      <Para>
        Straight away that tells you which shapes are allowed. Row j of the left matrix must be exactly as long as
        column k of the right one. So the <em>columns of the left</em> must match the <em>rows of the right</em>:
      </Para>
      <List
        items={[
          <>
            <span className="font-mono">(m × n) · (n × p) = (m × p)</span> — the two inner numbers must agree, and they
            then disappear.
          </>,
          <>
            <span className="font-mono">(2 × 3) · (3 × 4) = (2 × 4)</span> — fine.
          </>,
          <>
            <span className="font-mono">(3 × 4) · (2 × 3)</span> — impossible. 4 and 2 do not match.
          </>,
        ]}
      />

      <Lab>
        <MultiplyLab />
      </Lab>

      <Para>
        Now the two facts that catch people out, both of which you can see in the lab by pressing the other two
        presets.
      </Para>
      <Para>
        <strong>AB is usually not BA.</strong> With ordinary numbers 3 × 5 and 5 × 3 are the same. With matrices they
        are usually different, and quite often one of them does not even exist because the shapes do not line up. So
        &ldquo;multiply A and B&rdquo; is an incomplete instruction — the order is part of the meaning.
      </Para>
      <Para>
        <strong>AB can be all zeros without either A or B being zero.</strong> With numbers, if ab = 0 then one of them
        must be 0. Not here. Which also means you cannot cancel: AB = AC does <em>not</em> let you conclude B = C.
      </Para>

      <Worked title="The rule in symbols, and the lecture's Example 1">
        {`cⱼₖ = aⱼ₁b₁ₖ + aⱼ₂b₂ₖ + … + aⱼₙbₙₖ

A = ⎡ 3  5 −1 ⎤        B = ⎡ 2 −2  3  1 ⎤
    ⎣ 4  0  2 ⎦            ⎢ 5  0  7  8 ⎥
                           ⎣ 9 −4  1  1 ⎦
    2 × 3                      3 × 4        →  AB is 2 × 4

c₁₁ = 3·2 + 5·5 + (−1)·9 = 6 + 25 − 9 = 22
c₂₃ = 4·3 + 0·7 +   2 ·1 = 12 + 0 + 2 = 14

BA does not exist: B has 4 columns, A has 2 rows.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'defined',
            def: 'A product is "defined" when the shapes fit. If they do not, there is no answer — not zero, no answer at all.',
          },
          {
            term: 'commutative',
            say: 'com-MEW-ta-tive',
            def: 'Order does not matter. Adding numbers is commutative; multiplying matrices is not.',
          },
          {
            term: 'inner and outer dimensions',
            def: 'In (m × n)(n × p), the inner ones are the two n. They must match. The outer ones, m and p, become the answer’s shape.',
          },
        ]}
      />
      <Takeaway>
        Row of the left meets column of the right: multiply the pairs and add. The inner shapes must match, and swapping
        the order gives a different answer — if it gives one at all.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  transpose: (
    <>
      <Para>
        The <strong>transpose</strong> tips a matrix over. Row 1 becomes column 1, row 2 becomes column 2, and so on. It
        is written with a small raised T: <span className="font-mono">Aᵀ</span>. A 2 × 3 matrix becomes a 3 × 2 one.
      </Para>
      <Para>
        It sounds like a filing detail, and mostly it is — but it turns up constantly. Data is often stored one way
        round and needed the other. And a great many formulas later in the course have a stray ᵀ in them that is doing
        exactly this.
      </Para>

      <Lab>
        <TransposeRulesLab />
      </Lab>

      <Para>
        Three of the rules are obvious once you have seen the picture. Tip it over twice and you are back where you
        started. Tipping a sum is the same as tipping each part. Tipping a scaled matrix does not disturb the scaling.
      </Para>
      <Para>
        The fourth one is the one worth remembering, because it is not obvious:{' '}
        <span className="font-mono">(AB)ᵀ = BᵀAᵀ</span>. You transpose <strong>and reverse the order</strong>. Keeping
        the order gives AᵀBᵀ, which usually does not even have the right shape to exist.
      </Para>
      <Para>
        The picture that makes it stick: socks then shoes is undone by shoes then socks. Whenever you undo or flip a
        sequence of things, the order reverses. The same rule appears again for inverses in part 15.
      </Para>

      <Worked title="The four rules">
        {`(Aᵀ)ᵀ     = A
(A + B)ᵀ  = Aᵀ + Bᵀ
(cA)ᵀ     = cAᵀ
(AB)ᵀ     = BᵀAᵀ        ← reversed, and this is the one people get wrong`}
      </Worked>

      <Terms
        items={[
          { term: 'transpose', say: 'TRANS-pose', def: 'Tip the matrix over so rows become columns. Written Aᵀ.' },
          {
            term: 'symmetric',
            def: 'A matrix that is unchanged by tipping over: A = Aᵀ. The numbers are mirrored across the diagonal. Next part.',
          },
        ]}
      />
      <Takeaway>Aᵀ swaps rows and columns. (AB)ᵀ = BᵀAᵀ — transpose each and reverse the order.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  special: (
    <>
      <Para>
        Most matrices are nothing special. But a handful of shapes come up so often that they have names, and each name
        is a promise that some later calculation will be easier. Spotting one is worth real time.
      </Para>
      <List
        items={[
          <>
            <strong>Symmetric</strong> — A = Aᵀ. The numbers are mirrored across the diagonal from top-left to
            bottom-right. Distance tables are like this: the distance from A to B equals the distance from B to A.
          </>,
          <>
            <strong>Skew-symmetric</strong> — A = −Aᵀ. Mirrored, but with the sign flipped. The diagonal has no choice
            but to be all zeros.
          </>,
          <>
            <strong>Upper triangular</strong> — everything below the diagonal is zero. <strong>Lower triangular</strong>{' '}
            is the other way round. Row reduction is really a machine for making these.
          </>,
          <>
            <strong>Diagonal</strong> — only the diagonal is allowed to be non-zero. Both triangular at once.
          </>,
          <>
            <strong>Identity</strong> — diagonal, with every diagonal number equal to 1. Written{' '}
            <span className="font-mono">I</span>. Multiplying by it changes nothing, so it is the matrix version of the
            number 1.
          </>,
          <>
            <strong>Sparse</strong> — most of the numbers are zero. Not a shape so much as an observation, but a very
            valuable one: a sparse matrix can be stored and multiplied far more cheaply than a full one.
          </>,
        ]}
      />

      <Lab>
        <SpecialMatrixLab />
      </Lab>

      <Para>
        Why bother? Because each name saves work later. The determinant of a triangular matrix is just the diagonal
        multiplied together — no cofactors needed. Symmetric matrices have real eigenvalues, which matters a lot in the
        next course. And sparse matrices are why a recommendation system with a million users fits in memory at all: a
        list of what each person actually watched is nearly all zeros.
      </Para>

      <Terms
        items={[
          { term: 'diagonal', def: 'The slots running top-left to bottom-right: a₁₁, a₂₂, a₃₃ and so on.' },
          { term: 'symmetric', def: 'A = Aᵀ. Flipping it across the diagonal changes nothing.' },
          {
            term: 'skew-symmetric',
            def: 'A = −Aᵀ. Flipping it also flips every sign. Forces zeros down the diagonal, since only 0 equals minus itself.',
          },
          { term: 'identity matrix I', def: '1s down the diagonal, 0s elsewhere. AI = IA = A for any A of the right size.' },
          { term: 'sparse', def: 'Mostly zeros. Worth knowing because computers can then skip almost all the work.' },
          { term: 'trace', def: 'The diagonal added up. A single number that survives a surprising amount of manipulation.' },
        ]}
      />
      <Takeaway>
        Each named shape is a promise of less work later. Identity does nothing when you multiply by it; triangular
        makes determinants free; sparse makes big problems fit.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  posdef: (
    <>
      <Para>
        This one sounds harder than it is. Take a square symmetric matrix A and any column of numbers x. The expression{' '}
        <span className="font-mono">xᵀAx</span> comes out as a single ordinary number. A is called{' '}
        <strong>positive definite</strong> if that number is above zero for <em>every</em> x you could possibly choose,
        apart from all-zeros.
      </Para>
      <Para>
        So it is a promise about infinitely many cases at once. That is why you cannot test it by trying a few values —
        you need a proof. The lecture gives one by completing the square, and the lab shows you the shape of the thing
        while you do it.
      </Para>

      <Lab>
        <PositiveDefiniteLab />
      </Lab>

      <Para>
        The trick on slide 17 is worth copying. Write the expression out, then force it into a sum of squares. A square
        is never negative, so if you can write the whole thing as squares with positive numbers in front, you are done.
      </Para>

      <Worked title="Slide 17, both examples">
        {`A = ⎡ 2   6 ⎤        xᵀAx = 2x₁² + 12x₁x₂ + 20x₂²
    ⎣ 6  20 ⎦             = 2(x₁ + 3x₂)² + 2x₂²

Two squares, both with a positive number in front, so the whole
thing can only be 0 when x₁ + 3x₂ = 0 and x₂ = 0 — that is, at the
origin.  →  positive definite.

A = ⎡ 2   6 ⎤        xᵀAx = 2x₁² + 12x₁x₂ + 18x₂²
    ⎣ 6  18 ⎦             = 2(x₁ + 3x₂)²

Only one square this time. It hits 0 along the whole line
x₁ = −3x₂, not just at the origin.  →  positive semi-definite.`}
      </Worked>

      <Para>
        For a 2 × 2 there is a quick test that saves all of that: the top-left number and the determinant must{' '}
        <em>both</em> be above zero. For bigger matrices the same idea keeps going — every leading square block cut from
        the top-left corner must have a determinant above zero.
      </Para>
      <Para>
        Where you will meet it: an error surface shaped by a positive definite matrix is a proper bowl with one bottom,
        so rolling downhill finds the answer. Semi-definite means the bowl has a flat groove, and the search wanders
        along it. Indefinite means a saddle, and the search can slide away entirely.
      </Para>

      <Terms
        items={[
          {
            term: 'xᵀAx',
            say: 'x transpose A x',
            def: 'Row times matrix times column. It always comes out as one plain number, whatever the size of A.',
          },
          {
            term: 'quadratic form',
            def: 'The name for xᵀAx. Every term has two x’s in it — x₁², x₁x₂, x₂² — which is what "quadratic" means here.',
          },
          {
            term: 'positive definite',
            def: 'xᵀAx > 0 for every x except all-zeros. A promise about every case, not a few.',
          },
          { term: 'semi-definite', def: 'Never negative, but zero somewhere other than the origin. The "≥ 0" version.' },
          {
            term: 'indefinite',
            def: 'Positive for some x and negative for others. Neither test passes.',
          },
        ]}
      />
      <Takeaway>
        Positive definite means xᵀAx is above zero for every x. For a 2 × 2, check the top-left number and the
        determinant are both above zero.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  rowops: (
    <>
      <Para>
        Everything from here to the end of the lecture rests on three moves. They are called{' '}
        <strong>elementary row operations</strong>, and the whole point of them is that they change how a system{' '}
        <em>looks</em> without changing what it <em>means</em>.
      </Para>
      <List
        items={[
          <>
            <strong>Swap two rows.</strong> Writing your equations in a different order obviously cannot change the
            answer.
          </>,
          <>
            <strong>Multiply a row by a number that is not zero.</strong> Doubling both sides of an equation keeps it
            true. Multiplying by 0 would destroy it, which is why 0 is banned.
          </>,
          <>
            <strong>Add a multiple of one row to another row.</strong> Both rows were true, so their combination is
            true too.
          </>,
        ]}
      />
      <Para>
        Each one is something you could do to the equations themselves with a pen. That is the reason none of them can
        break anything.
      </Para>

      <Lab>
        <RowOpsLab />
      </Lab>

      <Para>
        Now the part the slide is emphatic about: <strong>rows only, never columns.</strong> The lab has a button that
        breaks this rule on purpose. Press it and the reported answer changes in front of you.
      </Para>
      <Para>
        Here is why. Each row is one equation, so shuffling rows shuffles equations. But each <em>column</em> belongs to
        one unknown — column 1 is x₁, column 2 is x₂. Swap two columns and you have quietly renamed your unknowns
        halfway through, so the answer you read off at the end belongs to a different question.
      </Para>

      <Worked title="The three moves, in the notation the slides use">
        {`Rᵢ ↔ Rⱼ                swap two rows
Rₖ ← α Rₖ   (α ≠ 0)    multiply a row through
Rᵢ ← Rᵢ + β Rⱼ         add a multiple of another row

Two matrices connected by a chain of these are called
"row equivalent". They describe exactly the same answers.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'elementary row operation',
            def: 'One of the three legal moves. "Elementary" here means basic building block, not easy.',
          },
          {
            term: 'row equivalent',
            def: 'Two matrices you can get between using only those three moves. They always have the same answers.',
          },
          {
            term: 'augmented matrix',
            def: 'The coefficients with the right-hand side stuck on as one extra column. You do the moves to the whole row so the two sides stay in step.',
          },
        ]}
      />
      <Takeaway>
        Three moves: swap rows, scale a row by something non-zero, add a multiple of one row to another. Rows only —
        columns are the unknowns, and renaming those mid-calculation ruins the answer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  echelon: (
    <>
      <Para>
        The three moves are the tool. <strong>Row echelon form</strong> is what you are using them to build. The word
        échelon is French for a rung of a ladder, and that is exactly the shape you are aiming at: a staircase.
      </Para>
      <Para>
        In each row, find the first number that is not zero. That is the row&rsquo;s <strong>leading entry</strong>. A
        matrix is in row echelon form when every leading entry sits strictly further right than the one in the row
        above, and any all-zero rows have sunk to the bottom.
      </Para>
      <Para>That is all it means. Two conditions, both about where the leading entries sit.</Para>

      <Lab>
        <EchelonWalkLab />
      </Lab>

      <Para>
        Why this shape? Because the bottom row then involves the fewest unknowns — often just one. Solve that, put the
        answer into the row above, solve that, and keep going upwards. This is called{' '}
        <strong>back substitution</strong>, and the staircase is what makes it possible.
      </Para>
      <Para>
        Notice what the lab did at the very first step. The top-left slot held a 0, and you cannot use a zero as the
        thing you divide by. So it swapped a better row up. That is not a trick, it is the normal first move whenever a
        pivot position is empty.
      </Para>

      <Worked title="Slide 22, start to finish">
        {`⎡  0  1   2  0 −1 ⎤     swap R1 and R2      ⎡ −2  2   0  3  2 ⎤
⎢ −2  2   0  3  2 ⎥   ───────────────────►   ⎢  0  1   2  0 −1 ⎥
⎣  2  8  20  0  6 ⎦                          ⎣  2  8  20  0  6 ⎦

R3 ← R3 + 1·R1     ⎡ −2  2   0  3   2 ⎤
──────────────────►⎢  0  1   2  0  −1 ⎥
                   ⎣  0 10  20  3   8 ⎦

R3 ← R3 + (−10)·R2 ⎡ −2  2  0  3   2 ⎤
──────────────────►⎢  0  1  2  0  −1 ⎥    ← row echelon form
                   ⎣  0  0  0  3  18 ⎦

Leading entries in columns 1, 2 and 4 — each one further right
than the last. Three non-zero rows, so the rank is 3.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'row echelon form (REF)',
            say: 'ESH-uh-lon',
            def: 'A staircase: every row starts further right than the one above, and all-zero rows are at the bottom.',
          },
          {
            term: 'leading entry',
            def: 'The first number in a row that is not zero. Also called the pivot when it is the one you are working with.',
          },
          {
            term: 'pivot position',
            def: 'The slot a leading entry sits in. Its column is said to be a pivot column.',
          },
          {
            term: 'back substitution',
            def: 'Solve the bottom row, feed the answer into the row above, and work upwards. The staircase is what makes this work.',
          },
        ]}
      />
      <Takeaway>
        Row echelon form is a staircase of leading entries, each further right than the last. Get there and the system
        solves itself from the bottom up.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  rref: (
    <>
      <Para>
        You can go further than a staircase. <strong>Reduced row echelon form</strong> adds two more demands on top of
        row echelon form:
      </Para>
      <List
        items={[
          <>Every leading entry is a <strong>1</strong>.</>,
          <>
            Every leading 1 is the <strong>only</strong> non-zero number in its whole column — you clear above it as well
            as below.
          </>,
        ]}
      />
      <Para>
        It is more work. The payoff is that you no longer need back substitution at all: each row now reads off one
        unknown directly.
      </Para>

      <Lab>
        <RrefLab />
      </Lab>

      <Para>
        Now the fact that makes RREF genuinely important, and it is easy to skip past on the slide. A matrix has many
        different row echelon forms — it depends which moves you happen to choose. But it has{' '}
        <strong>exactly one</strong> reduced row echelon form. Every route ends in the same place.
      </Para>
      <Para>
        The lab lets you test that rather than trust it. Tick the box to start with the rows in the opposite order. The
        sequence of moves is completely different, the intermediate pictures are different, and the final matrix is
        identical.
      </Para>
      <Para>
        That uniqueness is what lets rank be defined at all. If different routes gave different numbers of non-zero
        rows, &ldquo;the rank&rdquo; would be meaningless. It does not, so it is not — which is the next part.
      </Para>

      <Terms
        items={[
          {
            term: 'reduced row echelon form (RREF)',
            def: 'A staircase where every step is a 1 and its column is otherwise empty. There is only ever one for a given matrix.',
          },
          {
            term: 'Gauss–Jordan elimination',
            say: 'gowss JOR-dan',
            def: 'The method that goes all the way to RREF: clear below every pivot, then clear above them too.',
          },
          {
            term: 'unique',
            def: 'There is exactly one. Different routes, same destination — that is what the slide’s uniqueness claim means.',
          },
        ]}
      />
      <Takeaway>
        RREF: every step is a 1 and its column is otherwise zero. A matrix has many REFs but only one RREF, whichever
        route you take.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  rank: (
    <>
      <Para>
        <strong>Rank</strong> is a count. Tidy the matrix into echelon form and count the rows that are not all zeros.
        That number is the rank, and it does not depend on how you got there.
      </Para>
      <Para>
        What is it counting? <em>Genuinely different rows.</em> If one row is a mixture of the others — a copy, a
        double, a sum — then it adds no information, and row reduction will crush it to zero. Rank counts what is left
        after all the repetition has been squeezed out.
      </Para>

      <Lab>
        <RankLab />
      </Lab>

      <Para>
        The lab has both of the lecture&rsquo;s examples loaded. On slide 24, three rows collapse to two, so rank A = 2.
        On slide 25 a 5 × 5 matrix — five rows, so it looks like a lot of information — turns out to hold only three
        genuinely different ones.
      </Para>
      <Para>
        Try the suggestion under the lab: make row 2 an exact copy of row 1. The rank drops by one every single time. It
        is that simple.
      </Para>

      <Worked title="Slide 24, worked through">
        {`    ⎡  3   0   2   2 ⎤
A = ⎢ −6  42  24  54 ⎥
    ⎣ 21 −21   0 −15 ⎦

R2 ← R2 + 2R1        ⎡ 3   0   2   2 ⎤
R3 ← R3 − 7R1        ⎢ 0  42  28  58 ⎥
                     ⎣ 0 −21 −14 −29 ⎦

R3 ← R3 + ½R2        ⎡ 3   0   2   2 ⎤
                     ⎢ 0  42  28  58 ⎥
                     ⎣ 0   0   0   0 ⎦

Two non-zero rows.  →  rank A = 2.
Row 3 was never adding anything new.`}
      </Worked>

      <Para>
        Why it matters, in one sentence: rank tells you how much your data actually says. Two columns that measure the
        same thing in different units — height in centimetres and height in inches — make the rank smaller than the
        number of columns, and no method on earth can then separate their two effects.
      </Para>

      <Terms
        items={[
          { term: 'rank', def: 'How many non-zero rows are left after tidying into echelon form. A count of genuinely different rows.' },
          {
            term: 'full rank',
            def: 'The rank is as big as it could possibly be — the smaller of the number of rows and columns. Nothing repeats.',
          },
          {
            term: 'singular',
            def: 'A square matrix whose rank is less than its size. It has no inverse, and its determinant is 0.',
          },
          {
            term: 'linearly dependent',
            def: 'One row (or column) can be built out of the others. Exactly what makes the rank drop.',
          },
        ]}
      />
      <Takeaway>
        Rank counts genuinely different rows. Copies and combinations collapse to zero and do not count.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  det: (
    <>
      <Para>
        The <strong>determinant</strong> squeezes a whole square matrix down to one number. That number answers one
        question above all others: does this matrix have an inverse? If the determinant is not zero, yes. If it is zero,
        no — and nothing else will save you.
      </Para>
      <Para>
        For a 2 × 2 the formula is short: <span className="font-mono">det A = ad − bc</span>. Rather than memorising
        that, look at what it means.
      </Para>

      <Lab>
        <Det2Lab />
      </Lab>

      <Para>
        The two columns of A are the two arrows. The determinant is the <strong>area of the box they make</strong>, with
        a minus sign when the second arrow has swung round past the first. Drag one arrow until it lies along the other
        and the box goes flat: area 0, determinant 0.
      </Para>
      <Para>
        That flat case is the whole story of &ldquo;no inverse&rdquo;. If the box is flat, A squashes the plane onto a
        line — two different starting points can land in the same place — and nothing can un-squash it.
      </Para>

      <Para>
        For a 3 × 3 there is a longer formula, and the way to read it is as three 2 × 2 determinants stitched together.
        Walk along the top row. For each number, cross out its row and its column, work out the 2 × 2 determinant left
        behind, and multiply. Then <strong>add, subtract, add</strong>.
      </Para>

      <Lab>
        <Det3Lab />
      </Lab>

      <Para>
        The alternating sign is the bit people forget. It is not decoration — get it wrong and the answer is wrong. The
        rule behind it is spelled out properly in the next part.
      </Para>

      <Worked title="Both of the lecture's examples">
        {`A = ⎡ 3  5 ⎤     det A = 3×4 − 5×2 = 12 − 10 = 2
    ⎣ 2  4 ⎦

    ⎡ 1  2  3 ⎤
A = ⎢ 0  4  5 ⎥
    ⎣ 1  0  6 ⎦

det A = 1(4·6 − 5·0) − 2(0·6 − 5·1) + 3(0·0 − 4·1)
      = 1(24) − 2(−5) + 3(−4)
      = 24 + 10 − 12
      = 22`}
      </Worked>

      <Terms
        items={[
          {
            term: 'determinant',
            def: 'One number worked out from a square matrix. Written det A or |A|. Zero means no inverse.',
          },
          { term: 'singular', def: 'A matrix whose determinant is 0. It has no inverse.' },
          { term: 'non-singular', def: 'Determinant not 0. An inverse exists. Also called invertible.' },
          {
            term: 'minor',
            def: 'The smaller determinant left when you cross out one row and one column. Written Mⱼₖ.',
          },
        ]}
      />
      <Takeaway>
        det A = ad − bc for a 2 × 2, and it is the area of the box the columns make. Zero area means no inverse.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  bigdet: (
    <>
      <Para>
        Past 3 × 3 there is no short formula to memorise. There are two methods instead, and knowing when to use which
        is most of the skill.
      </Para>
      <Para>
        <strong>Method one: cofactor expansion.</strong> Exactly what you did for the 3 × 3, one size up. Pick a row (or
        a column — either works). For each number in it, cross out its row and column, work out the determinant of what
        is left, attach a sign, and add everything up.
      </Para>
      <Para>
        The sign follows a checkerboard: <span className="font-mono">+ − + −</span> starting from the top-left. Written
        properly it is <span className="font-mono">(−1)</span> to the power of (row + column). A minor with its sign
        attached has its own name — a <strong>cofactor</strong>.
      </Para>
      <Para>
        Here is the part worth knowing. You may expand along <em>any</em> row or column and the answer is always the
        same. So choose the one with the most zeros: every zero kills a whole smaller determinant you would otherwise
        have to work out.
      </Para>

      <Lab>
        <CofactorLab />
      </Lab>

      <Para>
        Press the different rows and columns. Column 2 of that matrix has three zeros, which turns four 3 × 3
        determinants into one. Same answer, a quarter of the work.
      </Para>

      <Para>
        <strong>Method two: row-reduce first.</strong> Cofactors on a 4 × 4 mean four 3 × 3 determinants. On a 10 × 10 it
        is hopeless. So instead, use row moves to turn the matrix into a triangular one, then just multiply the
        diagonal.
      </Para>
      <Para>Two rules keep that honest, and they are the ones from part 14:</Para>
      <List
        items={[
          <>
            Adding a multiple of one row to another <strong>does not change</strong> the determinant at all.
          </>,
          <>
            Swapping two rows <strong>flips the sign</strong>. Count your swaps.
          </>,
        ]}
      />

      <Lab>
        <DetTriangleLab />
      </Lab>

      <Para>
        Watch the exact determinant read-out while you step through. It does not move, because the only move being used
        is the one that leaves it alone. Once the matrix is triangular the answer is sitting on the diagonal.
      </Para>

      <Worked title="Slide 31, the fast way">
        {`    ⎡ 1  1  0  2 ⎤
B = ⎢ 2  3  1  4 ⎥
    ⎢ 1  0  2  1 ⎥
    ⎣ 3  4  1  7 ⎦

R2 ← R2 − 2R1,  R3 ← R3 − R1,  R4 ← R4 − 3R1

    ⎡ 1  1  0  2 ⎤
    ⎢ 0  1  1  0 ⎥
    ⎢ 0 −1  2 −1 ⎥
    ⎣ 0  1  1  1 ⎦

R3 ← R3 + R2,  R4 ← R4 − R2

    ⎡ 1  1  0  2 ⎤
    ⎢ 0  1  1  0 ⎥          upper triangular
    ⎢ 0  0  3 −1 ⎥
    ⎣ 0  0  0  1 ⎦

No swaps were used, so det B = 1 × 1 × 3 × 1 = 3.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'cofactor',
            def: 'A minor with its sign attached: Cⱼₖ = (−1)^(j+k) Mⱼₖ. The signs make a checkerboard starting + at the top-left.',
          },
          {
            term: 'cofactor expansion',
            def: 'Adding up (entry × cofactor) along any one row or column. Any row or column gives the same answer.',
          },
          {
            term: 'upper triangular',
            def: 'Everything below the diagonal is zero. Its determinant is just the diagonal multiplied together.',
          },
        ]}
      />
      <Takeaway>
        Expand along whichever row or column has the most zeros — or skip all that, row-reduce to triangular, and
        multiply the diagonal. Count your row swaps: each one flips the sign.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  detrules: (
    <>
      <Para>
        Six rules, all on slide 32. They are worth more than the formulas, because between them they let you work out
        most determinants without doing much arithmetic at all.
      </Para>

      <Lab>
        <DetRulesLab />
      </Lab>

      <Para>
        The one that does the most work is the third button: <strong>adding a multiple of one row to another leaves the
        determinant completely alone.</strong> That is the licence for the whole row-reduction method in the last part.
      </Para>
      <Para>
        The one that surprises people is <span className="font-mono">det(AB) = det(A) · det(B)</span>. Matrix
        multiplication is a complicated business, but determinants sail straight through it. That single fact explains
        why a matrix with a zero determinant can never have an inverse: if AB = I then det(A)·det(B) = det(I) = 1, and
        nothing times zero is 1.
      </Para>
      <Para>
        And <span className="font-mono">det(A) = det(Aᵀ)</span> has a useful side effect: every rule about rows is also
        true about columns. Two equal columns give zero, swapping columns flips the sign, and so on.
      </Para>

      <Worked title="The six, as the slide lists them">
        {`1.  det(AB) = det(A) · det(B)
2.  det(A) ≠ 0  ⟹  there is a B with AB = BA = I
3.  two rows the same  ⟹  det = 0   (the matrix is singular)
4.  swap Rᵢ and Rⱼ     ⟹  the sign flips
5.  det(A) = det(Aᵀ)
6.  Rᵢ ← c·Rᵢ          ⟹  det becomes c · det(A)

And the one that comes out of 4 and 6 together, which is the one
you will actually use:
    Rᵢ ← Rᵢ + β·Rⱼ     ⟹  det does not change at all.`}
      </Worked>

      <Para>
        Rule 3 has a plain meaning worth holding on to. If one row repeats another, the rows do not spread out into the
        full space — the box they make is flat, and a flat box has no volume. A matrix like that is called{' '}
        <strong>singular</strong>, and singular is just another word for &ldquo;no inverse&rdquo;.
      </Para>

      <Terms
        items={[
          {
            term: 'singular',
            def: 'Determinant 0, no inverse, rank less than the size. Three ways of saying the same thing.',
          },
          {
            term: 'invertible / non-singular',
            def: 'Determinant not 0, so an inverse exists. Also called full rank.',
          },
          {
            term: 'det(I) = 1',
            def: 'The identity matrix has determinant 1, which is what makes the AB = I argument work.',
          },
        ]}
      />
      <Takeaway>
        Adding a multiple of a row changes nothing; swapping flips the sign; scaling scales it. det(AB) = det(A)·det(B),
        which is why a zero determinant means no inverse.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  inverse: (
    <>
      <Para>
        For ordinary numbers, dividing by 3 is the same as multiplying by ⅓, and 3 × ⅓ = 1. The{' '}
        <strong>inverse</strong> of a matrix is the same idea. A⁻¹ is the matrix with{' '}
        <span className="font-mono">A A⁻¹ = A⁻¹ A = I</span>. It is the undo button.
      </Para>
      <Para>
        Two warnings up front. Only <strong>square</strong> matrices can have one. And even then, some do not — the ones
        with determinant zero. There is no matrix division; there is multiplying by the inverse, when the inverse
        exists.
      </Para>
      <Para>For a 2 × 2 there is a formula short enough to remember:</Para>

      <Lab>
        <Inverse2Lab />
      </Lab>

      <Para>
        Swap the two numbers on the main diagonal, flip the sign of the other two, divide everything by ad − bc. If ad −
        bc is zero the last step is impossible, which is the arithmetic saying what part 12 said with a picture.
      </Para>

      <Para>
        Past 2 × 2 there is no such formula worth using. Instead there is the shortcut on slide 37, and it is one of the
        neatest things in the lecture. Write A with the identity matrix stuck on beside it. Then do row moves until the
        left half turns into the identity. Whatever the right half has become is A⁻¹.
      </Para>

      <Lab>
        <GaussJordanInverseLab />
      </Lab>

      <Para>
        Why does that work? Turning A into I means finding a sequence of moves that undoes A. Doing those exact same
        moves to I keeps a record of them, and the record <em>is</em> the matrix that undoes A.
      </Para>
      <Para>
        Press <strong>One with no inverse</strong> to see the method fail properly. The left half cannot become the
        identity, because a whole row goes to zero. The method does not invent an answer — it tells you there is not
        one.
      </Para>

      <Worked title="Slide 37 in full">
        {`⎡ 2  3 │ 1  0 ⎤        start: [A | I]
⎣ 1  4 │ 0  1 ⎦

swap R1 ↔ R2      ⎡ 1  4 │ 0  1 ⎤
                  ⎣ 2  3 │ 1  0 ⎦

R2 ← R2 − 2R1     ⎡ 1  4 │  0  1 ⎤
                  ⎣ 0 −5 │  1 −2 ⎦

R2 ← (−1/5) R2    ⎡ 1  4 │    0    1  ⎤
                  ⎣ 0  1 │ −1/5  2/5 ⎦

R1 ← R1 − 4R2     ⎡ 1  0 │  4/5  −3/5 ⎤     the right half
                  ⎣ 0  1 │ −1/5   2/5 ⎦     is A⁻¹`}
      </Worked>

      <Para>
        One more rule, and it is the same shape as the transpose one:{' '}
        <span className="font-mono">(AB)⁻¹ = B⁻¹A⁻¹</span>. Undoing two things done in order means undoing them in the
        opposite order. Shoes off before socks.
      </Para>

      <Terms
        items={[
          {
            term: 'inverse',
            def: 'The matrix that undoes A. Written A⁻¹. Only square matrices can have one, and only when det A ≠ 0.',
          },
          {
            term: 'identity matrix I',
            def: '1s down the diagonal, 0s elsewhere. A A⁻¹ = I is the definition of the inverse.',
          },
          {
            term: '[A | I]',
            say: 'A augmented with I',
            def: 'The two matrices written side by side as one wide one, so every row move hits both halves.',
          },
          {
            term: 'singular',
            def: 'No inverse. Spotted by det A = 0, or by a row going to zero while you row-reduce.',
          },
        ]}
      />
      <Takeaway>
        A⁻¹ undoes A. For a 2 × 2, swap the diagonal, flip the other two, divide by ad − bc. At any size, row-reduce
        [A | I] until the left half is I and read A⁻¹ off the right.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  console: (
    <>
      <Para>
        Everything in the last fourteen parts is one command in Octave. That is not a reason to skip the working —
        knowing what the machine is doing is the difference between trusting an answer and hoping. But once you do know,
        there is no reason to grind out a 4 × 4 inverse by hand.
      </Para>
      <Para>
        The console below is real. It parses what you type, does the arithmetic in exact fractions, and hands the answer
        back. Try the buttons, or type your own.
      </Para>

      <Lab>
        <OctaveConsole />
      </Lab>

      <Para>
        A few things worth trying in it. Type <code>A * inv(A)</code> and watch the identity matrix appear. Type{' '}
        <code>det(A*B)</code> and then <code>det(A)*det(B)</code> and check they match — that is rule 1 from part 14,
        tested rather than believed. Define a matrix whose second row is double its first, then ask for{' '}
        <code>rank</code> and <code>det</code> and see both report the collapse.
      </Para>

      <Worked title="The commands from slides 15 and 40">
        {`A = [1 2 3; 4 5 6]     rows separated by ;  columns by spaces
A'                     transpose
A + B,  A * B,  2*A    the arithmetic
size(A)                [rows, columns]
zeros(m,n)             an m × n matrix of zeros
ones(m,n)              an m × n matrix of ones
eye(k)                 the k × k identity matrix
rref(A)                reduced row echelon form
rank(A)                the rank
det(A)                 the determinant
inv(A)                 the inverse
issymmetric(A)         1 if A = Aᵀ, otherwise 0`}
      </Worked>

      <Para>
        One difference from the real thing: this console keeps exact fractions, so <code>inv(A)</code> comes back with
        entries like 2/3. Octave itself would print 0.6667. The fractions are here so you can check the arithmetic
        against your own working.
      </Para>

      <Terms
        items={[
          { term: 'ans', def: 'Where Octave puts the answer when you did not give it a name.' },
          {
            term: 'eye(k)',
            say: 'like the letter I',
            def: 'The k × k identity matrix. Named for how "I" sounds, which is a joke you only get once.',
          },
          {
            term: 'rref(A)',
            def: 'Reduced row echelon form in one command — the whole of parts 8 to 11, done for you.',
          },
        ]}
      />
      <Takeaway>
        Every method in this lecture is one Octave command. Learn the method so you can tell when the command has told
        you something surprising.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  systems: (
    <>
      <Para>
        A <strong>linear system</strong> is a set of equations that all have to be true at the same time, where every
        unknown appears on its own with just a plain number in front of it. No squares, no roots, no two unknowns
        multiplied together. That restriction is what &ldquo;linear&rdquo; means, and it is the reason all of this
        machinery works.
      </Para>
      <Para>
        With m equations and n unknowns, the numbers in front of the unknowns make an m × n matrix A, the unknowns make
        a column x, and the right-hand sides make a column b. The whole thing is then just{' '}
        <span className="font-mono">Ax = b</span>.
      </Para>
      <Para>
        There is one split worth naming straight away. If every right-hand side is zero, the system is called{' '}
        <strong>homogeneous</strong>. If even one of them is not, it is <strong>non-homogeneous</strong>.
      </Para>

      <Lab>
        <HomogeneousLab />
      </Lab>

      <Para>
        Press <strong>Set both to zero</strong> and watch what happens to the picture. Both lines slide onto the origin.
        They have to — a line whose right-hand side is 0 passes through the point where every unknown is 0.
      </Para>
      <Para>
        That is the one useful thing about homogeneous systems: they can <em>never</em> have no answer. Setting every
        unknown to zero always works. The lecture calls that the <strong>trivial solution</strong>, and the only real
        question left is whether there are any others.
      </Para>
      <Para>
        A non-homogeneous system has no such guarantee. Slide the two right-hand sides apart and you can easily reach a
        pair of parallel lines that never meet — no answer at all.
      </Para>

      <Worked title="The general shape, as slide 41 writes it">
        {`a₁₁x₁ + a₁₂x₂ + … + a₁ₙxₙ = b₁
a₂₁x₁ + a₂₂x₂ + … + a₂ₙxₙ = b₂
        ⋮
aₘ₁x₁ + aₘ₂x₂ + … + aₘₙxₙ = bₘ

Same thing, short:   Ax = b
    A is m × n     one row per equation, one column per unknown
    x is n × 1     the unknowns
    b is m × 1     the right-hand sides

every bⱼ = 0   →  homogeneous,     Ax = 0
any bⱼ ≠ 0     →  non-homogeneous`}
      </Worked>

      <Terms
        items={[
          {
            term: 'linear',
            def: 'Every unknown appears once, on its own, with a plain number in front. First power only.',
          },
          { term: 'coefficient', def: 'The number sitting in front of an unknown.' },
          { term: 'homogeneous', say: 'ho-mo-JEE-nee-us', def: 'Every right-hand side is 0. Always has at least the all-zeros answer.' },
          { term: 'trivial solution', def: 'Every unknown set to 0. Always works for a homogeneous system, and tells you nothing.' },
          {
            term: 'coefficient matrix',
            def: 'A on its own, without the right-hand side. Its rank is one of the two you compare in part 19.',
          },
        ]}
      />
      <Takeaway>
        Ax = b in three letters. If b is all zeros the system is homogeneous and always has at least the all-zeros
        answer. Otherwise nothing is guaranteed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  house: (
    <>
      <Para>
        Slide 43 stops doing maths for its own sake and asks a real question: can you predict a house price from its
        size and how many rooms it has?
      </Para>
      <Para>
        Start by guessing the shape of the answer. Suppose price goes up by a fixed amount per thousand square feet, and
        by another fixed amount per room, on top of some base figure. Written out:{' '}
        <span className="font-mono">y = w₁x₁ + w₂x₂ + b</span>.
      </Para>
      <Para>
        You do not know w₁, w₂ or b. Those are the unknowns. And every house you have data for gives you one equation,
        because you know its x₁, its x₂ and its y.
      </Para>

      <Lab>
        <HousePriceLab />
      </Lab>

      <Para>
        Solve it and you get w₁ = 3, w₂ = 2, b = 1: three units per thousand square feet, two per room, and one as a
        base. Now you can price a house nobody has sold yet, which is the entire point.
      </Para>
      <Para>
        The lab has a fourth house in it as well, which the slide does not. That is deliberate. With three houses and
        three unknowns there is <em>always</em> exactly one answer, whatever prices you type — the coefficient matrix
        cannot go singular. It takes a fourth row before the data can disagree with itself, and disagreeing is what real
        data does.
      </Para>
      <Para>
        This is machine learning with the lid off. The rule is called a <strong>model</strong>, the unknowns are called{' '}
        <strong>weights</strong>, and solving the system is called <strong>fitting</strong>. Everything later in the
        programme is this, made bigger and messier.
      </Para>
      <Para>
        Now break it, as the lab suggests. Change one price so the three houses contradict each other and there is
        suddenly no exact answer at all. Real data is <em>always</em> like that: thousands of equations, a handful of
        unknowns, and no way to satisfy them all. What people do instead is find the weights that come closest, and that
        is linear regression.
      </Para>

      <Worked title="Slide 43, in full">
        {`model:   y = w₁x₁ + w₂x₂ + b

  size x₁   rooms x₂   price y
     1          1         6
     2          1         9
     1          2         8

each row becomes one equation:

  w₁ + w₂ + b = 6
 2w₁ + w₂ + b = 9
  w₁ + 2w₂ + b = 8

subtract the first from the second:  w₁ = 3
subtract the first from the third:   w₂ = 2
put both back into the first:         b = 1

answer:  w₁ = 3,  w₂ = 2,  b = 1`}
      </Worked>

      <Terms
        items={[
          { term: 'model', def: 'The shape you assume the answer has, with unknown numbers in it.' },
          { term: 'weight', def: 'One of those unknown numbers. It says how much one input pulls on the output.' },
          { term: 'bias', def: 'The b — the base amount that is there before any input contributes anything.' },
          { term: 'fitting', def: 'Working out the weights from data. For a small exact system, that is just solving it.' },
          {
            term: 'overdetermined',
            def: 'More equations than unknowns. Usually means no exact answer, which is where regression comes in.',
          },
        ]}
      />
      <Takeaway>
        Every row of data becomes one equation, and the unknowns are the model’s weights. Solving the system is what
        &ldquo;fitting a model&rdquo; means.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  outcomes: (
    <>
      <Para>
        However big a linear system is, there are only ever three outcomes: <strong>no answer</strong>,{' '}
        <strong>exactly one</strong>, or <strong>endlessly many</strong>. Never two. Never seventeen. The lecture works
        through one example of each, all built from nearly the same three equations.
      </Para>

      <Lab>
        <OutcomesLab />
      </Lab>

      <Para>
        Press the three presets in turn. Only one number changes between them — the right-hand side of the third
        equation — and it decides the whole outcome.
      </Para>
      <List
        items={[
          <>
            <strong>No answer.</strong> Adding the first two equations gives 2x₁ + 3x₃ = 5, but the third insists it is
            1. Tidy the matrix and a row appears reading 0 = −4. Nothing can make that true.
          </>,
          <>
            <strong>Exactly one.</strong> The three equations pin down all three unknowns: x₁ = x₂ = x₃ = 1.
          </>,
          <>
            <strong>Endlessly many.</strong> Now the third equation says 2x₁ + 3x₃ = 5, which is precisely what the
            first two already implied. It repeats them. A row goes to zero, one unknown is left free, and every choice
            of it gives another valid answer.
          </>,
        ]}
      />

      <Para>
        Slide 61 turns all of that into a test you can apply without thinking. Work out two ranks: the rank of A on its
        own, and the rank of A with the right-hand column stuck on.
      </Para>
      <List
        items={[
          <>
            The ranks <strong>differ</strong> → no answer. (The extra column added information the coefficients could
            not account for — that is a contradiction row.)
          </>,
          <>
            The ranks <strong>match</strong> and no unknown is free → exactly one answer.
          </>,
          <>
            The ranks <strong>match</strong> and at least one unknown is free → endlessly many.
          </>,
        ]}
      />
      <Para>
        The number of free unknowns is simply (how many unknowns) − (the rank). Nothing more to work out.
      </Para>

      <Para>
        For the endless case, the lab gives you the answer as a starting point plus a direction, with a dial to move
        along it. Every setting of that dial is a genuine answer, and the lab checks all three equations for you each
        time so you can watch them stay true.
      </Para>

      <Worked title="Slides 49–51, the endless one">
        {`x₁ + x₂ + x₃ = 3
x₁ − x₂ + 2x₃ = 2
2x₁ + 3x₃ = 5

tidy up:   ⎡ 1  1  1 │  3 ⎤
           ⎢ 0 −2  1 │ −1 ⎥
           ⎣ 0  0  0 │  0 ⎦    ← says nothing, forbids nothing

rank A = 2,  rank [A|b] = 2,  3 unknowns  →  1 free

let x₂ = t:      x₃ = 2t − 1
                 x₁ = 4 − 3t

(x₁, x₂, x₃) = (4, 0, −1) + t(−3, 1, 2)`}
      </Worked>

      <Terms
        items={[
          {
            term: 'consistent',
            def: 'The system has at least one answer. The ranks match.',
          },
          { term: 'inconsistent', def: 'No answer. Tidying produces a row saying 0 = something that is not 0.' },
          {
            term: 'free variable',
            def: 'An unknown no pivot landed on. You choose it, and the rest are then forced.',
          },
          {
            term: 'pivot variable',
            def: 'An unknown that a pivot did land on. Once the free ones are chosen, this one has no choice.',
          },
          {
            term: 'general solution',
            def: 'One answer, plus every direction you can move in and still be right. Written as a point plus dials.',
          },
        ]}
      />
      <Takeaway>
        Compare rank A with rank [A|b]. Different means no answer. Same means yes, and then the count of free unknowns —
        unknowns minus rank — decides between one answer and endless.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  parameter: (
    <>
      <Para>
        The last example in the lecture puts everything together: four equations, five unknowns, and one of the
        right-hand sides left as a letter, <span className="font-mono">a</span>. The question is which values of a give
        the system any answer at all.
      </Para>
      <Para>
        This is a standard exam shape, so it is worth being comfortable with. You do the elimination exactly as normal,
        carrying the letter along, and at the end a row appears with the letter in it. That row decides everything.
      </Para>

      <Lab>
        <ParameterLab />
      </Lab>

      <Para>
        Slide the dial. Everywhere except a = −1 the bottom row ends up saying 0 = something that is not zero, which is
        impossible. At a = −1 it says 0 = 0, which is harmless, and the system suddenly has answers.
      </Para>
      <Para>
        Not one answer, though. Five unknowns and rank 3 leaves <strong>two</strong> free, so there are two dials to
        turn. The lab gives you both, and checks all four of the original equations every time you move one. They stay
        green whatever you pick — which is what &ldquo;endlessly many&rdquo; actually looks like.
      </Para>

      <Worked title="Slides 53–60, condensed">
        {`−2x₁ + 4x₂ − 2x₃ −  x₄ + 4x₅ = −3
 4x₁ − 8x₂ + 3x₃ − 3x₄ +  x₅ =  2
  x₁ − 2x₂ +  x₃ −  x₄ +  x₅ =  0
  x₁ − 2x₂        − 3x₄ + 4x₅ =  a

swap R1 ↔ R3 to get a 1 in the corner, then

R2 ← R2 − 4R1,  R3 ← R3 + 2R1,  R4 ← R4 − R1

⎡ 1 −2  1 −1  1 │  0 ⎤
⎢ 0  0 −1  1 −3 │  2 ⎥
⎢ 0  0  0 −3  6 │ −3 ⎥
⎣ 0  0 −1 −2  3 │  a ⎦

R4 ← R4 − R2,  then R4 ← R4 − R3

⎣ 0  0  0  0  0 │ a + 1 ⎦

So the system is consistent only when a + 1 = 0, i.e. a = −1.

Then with x₂ = s and x₅ = t free:

(x₁, x₂, x₃, x₄, x₅) = (2 + 2s + 2t,  s,  −1 − t,  1 + 2t,  t)`}
      </Worked>

      <Para>
        One habit worth building from this: the letter never changes how you do the elimination. Carry it through like
        any other number and let it show up where it shows up. Trying to guess in advance which value is special is
        slower and more error-prone than just doing the work.
      </Para>

      <Terms
        items={[
          {
            term: 'parameter',
            def: 'A letter standing for a number you have not been told. Here it is a, in the right-hand side.',
          },
          {
            term: 'consistent',
            def: 'Has at least one answer. Here that only happens at a = −1.',
          },
          {
            term: 'free variable',
            def: 'One you get to choose. Two of them here, so the answers form a flat sheet rather than a line.',
          },
        ]}
      />
      <Takeaway>
        Carry the unknown letter through the elimination like any other number. The row it ends up in tells you exactly
        which values are allowed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 21 */
  practice: (
    <>
      <Para>
        All ten questions from the practice sheet, with the working. Two of them — Q1 and Q7 — turn on a single letter,
        so start by finding the special value yourself rather than reading it.
      </Para>

      <Lab>
        <ParameterKLab />
      </Lab>

      <Para>
        And here is the console again, so you can check any of the ten below without leaving the page. Do the working
        first, then type it in.
      </Para>

      <Lab>
        <OctaveConsole />
      </Lab>

      <Worked title="Q1 — for which k is there a unique answer?">
        {`2x +  y −  z =  1
 x + 3y + 2z = 12
3x + 4y + kz = 13

det of the coefficient matrix:
  2(3k − 8) − 1(k − 6) + (−1)(4 − 9)
  = 6k − 16 − k + 6 + 5
  = 5k − 5

Unique answer ⟺ det ≠ 0 ⟺ k ≠ 1.

(ii)  R2 ← 2R2 − R1  gives   5y + 5z = 23
      R3 ← 2R3 − 3R1 gives   5y + (2k + 3)z = 23
      subtract:              (2k − 2)z = 0

For any k ≠ 1 that forces z = 0, and then
      y = 23/5,   x = −9/5.

So the answer is the same for every allowed k:
      x = −9/5,  y = 23/5,  z = 0.

At k = 1 the two reduced rows are identical, so the system is
consistent with a free variable — infinitely many answers, not none.`}
      </Worked>

      <Worked title="Q2 — RREF and rank">
        {`    ⎡ 1  2  3   4 ⎤
A = ⎢ 2  4  7  10 ⎥
    ⎣ 1  2  4   6 ⎦

R2 ← R2 − 2R1     [0 0 1 2]
R3 ← R3 − R1      [0 0 1 2]
R3 ← R3 − R2      [0 0 0 0]
R1 ← R1 − 3R2     [1 2 0 −2]

       ⎡ 1  2  0 −2 ⎤
RREF = ⎢ 0  0  1  2 ⎥        rank A = 2
       ⎣ 0  0  0  0 ⎦

Column 2 has no pivot, which is the clue that column 2 is just
twice column 1 — it was never adding anything.`}
      </Worked>

      <Para>
        Load this one straight into the <strong>Practice Q2</strong> preset in part 10 and step through it move by
        move.
      </Para>

      <Worked title="Q3 — det(B·C·D) where det A = 3">
        {`B = 2A,   C = Aᵀ,   D = A⁻¹,   A is 3 × 3,   det A = 3

det(B) = det(2A) = 2³ · det A = 8 × 3 = 24
         (every one of the 3 rows got doubled, so 2 comes out 3 times)
det(C) = det(Aᵀ) = det A = 3
det(D) = det(A⁻¹) = 1 / det A = 1/3

det(BCD) = 24 × 3 × 1/3 = 24`}
      </Worked>

      <Worked title="Q4 — solve using the inverse">
        {` 2x +  y −  z =   8
−3x −  y + 2z = −11
−2x +  y + 2z =  −3

Write it as Ax = b, then x = A⁻¹b.

det A = 2(−2 − 2) − 1(−6 + 4) + (−1)(−3 − 2)
      = −8 + 2 + 5 = −1        not zero, so A⁻¹ exists

Answer:  x = 2,  y = 3,  z = −1

Check the third equation: −4 + 3 − 2 = −3  ✓`}
      </Worked>

      <Para>
        Part 15 has this matrix loaded as <strong>Practice Q4</strong> — run [A | I] through to the end and you get A⁻¹
        itself.
      </Para>

      <Worked title="Q5 — positive definite, and invertible?">
        {`    ⎡  2  −1   0 ⎤
A = ⎢ −1   a  −1 ⎥
    ⎣  0  −1   2 ⎦

Check the leading square blocks from the top-left corner:

  1 × 1:  2                           > 0  always
  2 × 2:  det ⎡ 2 −1 ⎤ = 2a − 1       > 0  ⟺  a > 1/2
             ⎣ −1  a ⎦
  3 × 3:  det A = 2(2a − 1) − (−1)(−2) = 4a − 4
                                      > 0  ⟺  a > 1

All three hold together only when a > 1.

(ii) For a > 1, det A = 4a − 4 > 0, so it is not zero and A is
     invertible. In fact every positive definite matrix is
     invertible — its determinant is a product of positive numbers.`}
      </Worked>

      <Worked title="Q6 — Gaussian elimination">
        {` x +  y +   z =  6
2x + 3y +  5z = 17
 x + 4y + 10z = 29

R2 ← R2 − 2R1        y + 3z =  5
R3 ← R3 −  R1       3y + 9z = 23
R3 ← R3 − 3R2            0 =  8

The system as printed is inconsistent — there is no answer.
Its rank A = 2 but rank [A|b] = 3, which is the mismatch case
from part 19.

Worth knowing: if the last right-hand side were 21 instead of 29
the system would be consistent with the single answer
x = 3, y = 2, z = 1. Try both in the console and see.`}
      </Worked>

      <Worked title="Q7 — for which k are there infinitely many answers?">
        {` x +  y +  z =  3
2x + 3y + 4z =  8
3x + 4y + kz = 11

R2 ← R2 − 2R1         y + 2z = 2
R3 ← R3 − 3R1         y + (k − 3)z = 2
R3 ← R3 − R2          (k − 5)z = 0

k ≠ 5  →  z = 0, y = 2, x = 1.  One answer.
k = 5  →  the row vanishes completely. Both ranks are 2, three
          unknowns, so one variable is free.

Answer: k = 5.

Note it can never have no answer, whatever k is — the right-hand
side collapses to 0 at the same moment the left one does.`}
      </Worked>

      <Worked title="Q8 — C = AB, determinants, B⁻¹, and the order">
        {`A = ⎡ 1  2 ⎤     B = ⎡ 2 −1 ⎤
    ⎣ 3  4 ⎦         ⎣ 1  0 ⎦

(i)   C = AB = ⎡ 1·2 + 2·1   1·(−1) + 2·0 ⎤ = ⎡  4  −1 ⎤
               ⎣ 3·2 + 4·1   3·(−1) + 4·0 ⎦   ⎣ 10  −3 ⎦

(ii)  det A = 1·4 − 2·3 = −2
      det B = 2·0 − (−1)·1 = 1
      det C = 4·(−3) − (−1)·10 = −12 + 10 = −2
      det A × det B = −2 × 1 = −2 = det C   ✓

(iii) B⁻¹ = (1/det B) ⎡ 0  1 ⎤ = ⎡  0  1 ⎤
                      ⎣ −1  2 ⎦   ⎣ −1  2 ⎦
      check: B B⁻¹ = ⎡ 1 0 ⎤  ✓
                     ⎣ 0 1 ⎦

(iv)  BA = ⎡ 2·1 + (−1)·3   2·2 + (−1)·4 ⎤ = ⎡ −1  0 ⎤
           ⎣ 1·1 +   0·3    1·2 +   0·4  ⎦   ⎣  1  2 ⎦

      AB ≠ BA, so matrix multiplication is not commutative.`}
      </Worked>

      <Para>
        Every line of that can be checked in the console in part 16 — type the two matrices in and ask for{' '}
        <code>A*B</code>, <code>B*A</code>, <code>det(A*B)</code> and <code>inv(B)</code>.
      </Para>

      <Worked title="Q9 — transposes of a sum and a product">
        {`    ⎡  1  2  0 ⎤        ⎡ 0  1 −1 ⎤
A = ⎢ −1  3  1 ⎥    B = ⎢ 2  0  3 ⎥
    ⎣  2  0  4 ⎦        ⎣ 1 −2  1 ⎦

(i)   A + B = ⎡ 1  3 −1 ⎤          ⎡  1  1  3 ⎤
              ⎢ 1  3  4 ⎥   (A+B)ᵀ = ⎢  3  3 −2 ⎥
              ⎣ 3 −2  5 ⎦          ⎣ −1  4  5 ⎦

      Aᵀ + Bᵀ gives exactly the same, because transposing and
      adding both work one slot at a time.

(ii)         ⎡ 4  1  5 ⎤              ⎡ 4  7  4 ⎤
      AB =   ⎢ 7 −3 11 ⎥      (AB)ᵀ = ⎢ 1 −3 −6 ⎥
             ⎣ 4 −6  2 ⎦              ⎣ 5 11  2 ⎦

      BᵀAᵀ comes out the same. AᵀBᵀ does not — order matters.

(iii) Both are 3 × 3 square matrices. Neither is symmetric and
      neither is skew-symmetric. det A = 24 and det B = 5, so
      both are non-singular: each has an inverse and full rank 3.`}
      </Worked>

      <Worked title="Q10 — RREF, rank, and how much work it took">
        {`    ⎡ 1  2   3 ⎤
A = ⎢ 2  5   8 ⎥
    ⎣ 3  8  13 ⎦

R2 ← R2 − 2R1     [0 1 2]
R3 ← R3 − 3R1     [0 2 4]
R3 ← R3 − 2R2     [0 0 0]
R1 ← R1 − 2R2     [1 0 −1]

       ⎡ 1  0 −1 ⎤
RREF = ⎢ 0  1  2 ⎥        rank A = 2
       ⎣ 0  0  0 ⎦

(ii) Counting the arithmetic. Each move Rᵢ ← Rᵢ − c·Rⱼ costs one
     multiplication and one addition per column.

     R2 ← R2 − 2R1    3 columns  →  3 mults, 3 adds
     R3 ← R3 − 3R1    3 columns  →  3 mults, 3 adds
     R3 ← R3 − 2R2    3 columns  →  3 mults, 3 adds
     R1 ← R1 − 2R2    3 columns  →  3 mults, 3 adds

     12 multiplications and 12 additions in total.

     (In practice you skip the column you are clearing, since you
     already know it becomes 0. That saves 4 of each, leaving 8
     and 8. Either count is fine as long as you say which you used.)`}
      </Worked>

      <Para>
        The general point behind Q10(ii): elimination on an n × n matrix costs roughly n³/3 multiplications. That is why
        it is fine for a 1000 × 1000 system and hopeless for a 10,000,000 × 10,000,000 one, and why so much of numerical
        computing is about avoiding the full method.
      </Para>

      <Takeaway>
        Two of these — Q6 as printed, and Q1 at k = 1 — do not have the tidy answer the wording seems to expect. Saying
        so is the right answer. An exam will accept &ldquo;inconsistent, because rank A ≠ rank [A|b]&rdquo; and will not
        accept a made-up number.
      </Takeaway>
    </>
  ),
}
