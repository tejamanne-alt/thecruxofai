'use client'

import { ColumnPictureChart } from '@/components/charts/column-picture-chart'
import { EliminationLab } from '@/components/charts/elimination-lab'
import { InverseExplorer, MatrixProductLab } from '@/components/charts/matrix-lab'
import { TwoLinesChart } from '@/components/charts/two-lines-chart'
import { UsedInAiml } from './algebra'
import {
  AnalogyCallout,
  Explainers,
  MathBlock,
  Para,
  SessionHeader,
  SubSections,
  Takeaway,
  Terms,
  Worked,
} from './session-parts'

export function Lecture1Session() {
  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 1 — Linear equations, matrices and Gaussian elimination"
        intro="The first lecture builds one idea from the ground up: a set of straight-line rules that all have to be true at once. You will see what such a set looks like as a picture, learn the short way to write it down, and then learn the one method that solves any of them. Everything here can be played with — drag the lines, mix the arrows, press the buttons."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine a small furniture workshop. You have <strong>9 units of wood</strong>, <strong>8 hours</strong> of
            labour, <strong>7 hours</strong> of machine time and <strong>11 units</strong> of shipping effort. You make
            three things: chair kits, table kits and cabinet kits. Each one eats a different amount of each resource.
            You want to use up <em>everything</em>, with nothing left over.
          </>,
          <>
            That is four sentences, all of which have to be true at the same time, and three numbers you are hunting
            for. That is a <strong>system of linear equations</strong> — and it is the same shape of problem as
            balancing a diet, splitting a bill, or fitting a line through data. This whole lecture is about how to
            answer questions like this without guessing.
          </>,
        ]}
        mappings={[
          {
            title: 'The things you are hunting for',
            body: 'How many of each kit to make. In the maths these are x₁, x₂, x₃ — the unknowns.',
          },
          {
            title: 'The rules that must hold',
            body: 'One per resource. Each says "the amount used adds up to exactly the amount you have".',
          },
          {
            title: 'Straight-line rules only',
            body: 'Each kit uses a fixed amount per unit. Nothing doubles up or squares. That is what "linear" means.',
          },
        ]}
        footnote="The answer turns out to be 2 chairs, 3 tables and 1 cabinet. The interesting part is not the answer — it is that there is a method that finds it every time, and tells you honestly when there is no answer."
      />

      <SubSections
        items={[
          /* ------------------------------------------------------------ 1 */
          {
            id: 'what',
            title: 'What linear algebra actually is',
            teaser: 'The study of vectors, and of the rules for pushing them around.',
            slides: 'Slides 1–2',
            body: (
              <>
                <Para>
                  Linear algebra is the study of <strong>vectors</strong> and the rules for handling them. Most people
                  meet vectors at school as arrows: an arrow in flat space, or an arrow in the room you are sitting in.
                  That picture is a good start, and it is not the whole story.
                </Para>
                <Para>
                  A vector is really{' '}
                  <em>
                    anything you can add to another one of its kind, and stretch by a number, where the result is still
                    the same kind of thing
                  </em>
                  . Two arrows add up to an arrow. An arrow stretched to triple length is still an arrow. But the same
                  is true of other things that look nothing like arrows — for example polynomials. Add two polynomials,
                  you get a polynomial. Double one, still a polynomial. So polynomials are vectors too.
                </Para>
                <Para>
                  This &ldquo;you always land back in the same family&rdquo; property has a name:{' '}
                  <strong>closure</strong>. A family of objects that is closed under adding and stretching is called a{' '}
                  <strong>vector space</strong>. That word underlies most of machine learning, which is why the lecture
                  starts here rather than with numbers.
                </Para>
                <Para>
                  In this course, the family we work in almost all the time is written <strong>ℝⁿ</strong>: lists of n
                  ordinary numbers. A point in flat space is a list of 2. A point in the room is a list of 3. A photo
                  might be a list of a million. The maths does not care which.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'vector',
                      def: 'A list of numbers you can add to another list of the same length, and scale up or down. Often drawn as an arrow, but it does not have to be one.',
                    },
                    {
                      term: 'scalar',
                      def: 'A plain single number, used to stretch or shrink a vector. "Scalar" because it scales things.',
                    },
                    {
                      term: 'closure',
                      def: 'Doing the allowed operations never throws you out of the family. Add two vectors, you still have a vector.',
                    },
                    {
                      term: 'ℝⁿ',
                      say: 'R n',
                      def: 'All the lists of n ordinary numbers. ℝ² is flat space, ℝ³ is the room around you, and the pattern keeps going past what you can picture.',
                    },
                  ]}
                />
                <Takeaway>
                  Vectors are not just arrows. They are anything you can add and stretch without leaving the family.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 2 */
          {
            id: 'equation',
            title: 'A linear equation, and why it draws a line',
            teaser: 'No squares, no roots, no multiplying two unknowns. Just that gives you a straight line.',
            slides: 'Slides 1–2',
            body: (
              <>
                <Para>
                  A <strong>linear equation</strong> is one where every unknown appears on its own, multiplied by a
                  plain number, and nothing more exotic happens to it. So <strong>x + y = 1</strong> is linear.{' '}
                  <strong>2a + 3b − c = 7</strong> is linear. But <strong>x²&nbsp;+ y = 1</strong> is not, and neither
                  is <strong>xy = 1</strong>, because there two unknowns are multiplied together.
                </Para>
                <Para>
                  You have already met this at school as <strong>y = mx + c</strong>. That is the same thing wearing
                  different clothes. Take x + y = 1 and move things about: y = −x + 1. So m is −1 and c is 1. The
                  &ldquo;m&rdquo; tilts the line, the &ldquo;c&rdquo; slides it up and down.
                </Para>
                <Para>
                  Here is the part worth holding on to. An equation in two unknowns is not <em>one</em> answer — it is a
                  whole line of them. x + y = 1 is true for (1, 0), for (0, 1), for (½, ½), for (100, −99). Every point
                  on that line is a valid answer.{' '}
                  <strong>One equation, in two unknowns, gives you a line of answers.</strong>
                </Para>
                <Takeaway>
                  A single linear equation in two unknowns does not pin anything down. It narrows infinitely many
                  possibilities to a line of them.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 3 */
          {
            id: 'system',
            title: 'Putting several equations together',
            teaser: 'A system is just a pile of equations that all have to be true at once.',
            slides: 'Slides 2–4',
            body: (
              <>
                <Para>
                  A <strong>system of linear equations</strong> is a collection of one or more linear equations sharing
                  the same set of unknowns. Sharing the unknowns is the whole point: the x in the first equation is the
                  same x as in the second, so the equations constrain each other.
                </Para>
                <Worked title="Two equations, solved by hand">
                  {`x + y − 1 = 0        …①
x − y − 3 = 0        …②

Add ① and ②:   2x − 4 = 0   →   x = 2
Put x = 2 into ①:  2 + y = 1   →   y = −1

Answer:  (x, y) = (2, −1)`}
                </Worked>
                <Para>
                  Notice what happened there. Adding the two equations made y vanish, which left one easy equation in
                  one unknown. That trick — combining rows to kill off an unknown — is the seed of the entire method
                  taught later in this lecture. Everything after this is just doing that carefully, in an order, for any
                  number of equations.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'system',
                      def: 'Several equations that must all hold at the same time, sharing the same unknowns.',
                    },
                    {
                      term: 'solution',
                      def: 'One set of values for the unknowns that makes every equation in the system true — not just one of them.',
                    },
                    {
                      term: 'unknown / variable',
                      def: 'A letter standing in for a number you are trying to find.',
                    },
                  ]}
                />
              </>
            ),
          },

          /* ------------------------------------------------------------ 4 */
          {
            id: 'factory',
            title: 'A real one: the furniture workshop',
            teaser: 'Four resources, three products, and a table that turns into a system.',
            slides: 'Slides 3–4',
            body: (
              <>
                <Para>
                  A company makes three kits — basic chair, table, cabinet. Call the number of each{' '}
                  <strong>x₁, x₂, x₃</strong>. Each kit uses a set amount of four resources, and there is a fixed supply
                  of each. Every drop must be used.
                </Para>
                <div className="my-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-[12.5px]">
                    <thead>
                      <tr className="border-b border-zinc-950/10 text-left text-zinc-500">
                        <th className="py-1.5 pr-3 font-semibold">Resource</th>
                        <th className="py-1.5 pr-3 font-semibold">Chair (x₁)</th>
                        <th className="py-1.5 pr-3 font-semibold">Table (x₂)</th>
                        <th className="py-1.5 pr-3 font-semibold">Cabinet (x₃)</th>
                        <th className="py-1.5 font-semibold">Available</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        ['Wood', 1, 2, 1, 9],
                        ['Labour hours', 2, 1, 1, 8],
                        ['Machine time', 1, 1, 2, 7],
                        ['Shipping effort', 3, 1, 2, 11],
                      ].map((r) => (
                        <tr key={String(r[0])} className="border-b border-zinc-950/[0.06]">
                          {r.map((cell, i) => (
                            <td key={i} className={i === 0 ? 'py-1.5 pr-3 font-sans text-zinc-700' : 'py-1.5 pr-3'}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Para>Read each row across and you get one equation:</Para>
                <Worked title="The workshop as four equations">
                  {`  x₁ + 2x₂ +  x₃ =  9      (wood)
 2x₁ +  x₂ +  x₃ =  8      (labour)
  x₁ +  x₂ + 2x₃ =  7      (machine)
 3x₁ +  x₂ + 2x₃ = 11      (shipping)

Answer:  x₁ = 2,  x₂ = 3,  x₃ = 1`}
                </Worked>
                <Para>
                  So: build 2 chair kits, 3 table kits and 1 cabinet kit, and every resource comes out exactly even. You
                  can watch this one get solved in the lab further down — it is one of the buttons.
                </Para>
                <Takeaway>
                  A table of &ldquo;how much of each thing does each product use&rdquo; is already a matrix. You have
                  been writing matrices for years without calling them that.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 5 */
          {
            id: 'howmany',
            title: 'How many answers can there be?',
            teaser: 'Only three possibilities, ever: exactly one, none at all, or endlessly many.',
            slides: 'Slides 4–8',
            body: (
              <>
                <Para>
                  This is the big result of the lecture, and it is surprisingly tidy. A system of linear equations has{' '}
                  <strong>exactly one answer</strong>, <strong>no answer at all</strong>, or{' '}
                  <strong>endlessly many answers</strong>. There is no fourth option. It can never have, say, exactly
                  seven.
                </Para>
                <Para>
                  With two unknowns you can see why straight away. Each equation is a line. Two lines can cross at one
                  point, or run alongside each other and never meet, or be the very same line drawn twice. Drag the
                  white pins below and try to find a fourth thing that can happen.
                </Para>
                <div className="my-4">
                  <TwoLinesChart />
                </div>
                <Para>
                  The three lecture examples are exactly these three cases, using the same three equations with one
                  number changed each time:
                </Para>
                <Worked title="Same system, one number changed">
                  {`x₁ + x₂ +  x₃ = 3        x₁ + x₂ +  x₃ = 3        x₁ + x₂ +  x₃ = 3
x₁ − x₂ + 2x₃ = 2        x₁ − x₂ + 2x₃ = 2        x₁ − x₂ + 2x₃ = 2
     x₂ +  x₃ = 2       2x₁      + 3x₃ = 1       2x₁      + 3x₃ = 5

  one answer               no answer                endless answers
  (1, 1, 1)              rows 1+2 give 5,          rows 1+2 give exactly
                         row 3 insists on 1        what row 3 says`}
                </Worked>
                <Para>
                  In the middle case, adding the first two equations gives 2x₁ + 3x₃ = 5. The third equation insists the
                  same thing equals 1. Both cannot be true, so the system is broken — and no amount of cleverness will
                  fix it. In the third case the third equation repeats what the first two already said, so it adds
                  nothing, and a whole line of answers survives.
                </Para>
                <Takeaway>
                  &ldquo;No answer&rdquo; means the equations disagree with each other. &ldquo;Endless answers&rdquo;
                  means one of them was not telling you anything new.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 6 */
          {
            id: 'geometry',
            title: 'The same picture in three dimensions',
            teaser: 'With three unknowns each equation is a flat sheet, and sheets meet in lines.',
            slides: 'Slides 7–9',
            body: (
              <>
                <Para>
                  Move up to three unknowns and each equation stops being a line and becomes a <strong>plane</strong> —
                  a flat sheet stretching out for ever, like an endless piece of paper floating in the room.
                </Para>
                <Para>Now stack them up:</Para>
                <ul className="crux-prose mb-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px]/[1.7] text-zinc-700">
                  <li>
                    Two sheets that are not parallel cut across each other along a <strong>line</strong>. So two
                    equations in three unknowns still leave a line of answers.
                  </li>
                  <li>
                    Bring in a third sheet. If it stabs through that line at one spot, you get{' '}
                    <strong>one answer</strong>.
                  </li>
                  <li>
                    If the third sheet happens to contain the whole line, nothing is narrowed down and you keep{' '}
                    <strong>endless answers</strong>.
                  </li>
                  <li>
                    If the third sheet runs parallel to that line and misses it, there is <strong>no answer</strong> —
                    the sheets pair up into parallel lines that never all meet.
                  </li>
                </ul>
                <Para>
                  The pattern keeps going above three unknowns, where you can no longer picture it. That is fine — the
                  algebra carries on working, and the three outcomes stay the same three outcomes. This is one of the
                  main reasons to learn the symbols: they keep telling the truth after your imagination gives out.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'plane',
                      def: 'The 3-D version of a line: a flat, endless sheet. One linear equation in three unknowns draws one of these.',
                    },
                    {
                      term: 'hyperplane',
                      def: 'The same idea in more than three dimensions. You cannot picture it, and you do not need to.',
                    },
                  ]}
                />
              </>
            ),
          },

          /* ------------------------------------------------------------ 7 */
          {
            id: 'matrices',
            title: 'Matrices: a tidy box of numbers',
            teaser: 'Rows and columns. A vector is just a matrix that is one column wide.',
            slides: 'Slide 9',
            body: (
              <>
                <Para>
                  A <strong>matrix</strong> is a rectangle of numbers arranged in rows and columns. If it has m rows and
                  n columns we call it an <strong>m × n</strong> matrix, said &ldquo;m by n&rdquo;. Rows first, always —
                  this trips everyone up at least once.
                </Para>
                <Para>
                  The number sitting in row i and column j is written <strong>a</strong>
                  <sub>ij</sub>. Again, row first. The set of all m × n matrices of ordinary numbers is written ℝ
                  <sup>m×n</sup>.
                </Para>
                <Para>
                  Vectors are not a separate thing. A <strong>column vector</strong> is an m × 1 matrix — one column, m
                  tall. A <strong>row vector</strong> is a 1 × n matrix. So everything in this lecture is a matrix; some
                  are just very thin.
                </Para>
                <Worked title="Shapes">
                  {`⎡ 1  0  2 ⎤   is 2 × 3     (2 rows, 3 columns)
⎣ 3  1 −1 ⎦

⎡ 4 ⎤
⎢ 0 ⎥         is 3 × 1     a column vector
⎣ 7 ⎦

[ 4  0  7 ]   is 1 × 3     a row vector`}
                </Worked>
              </>
            ),
          },

          /* ------------------------------------------------------------ 8 */
          {
            id: 'arithmetic',
            title: 'Adding and multiplying matrices',
            teaser: 'Adding is obvious. Multiplying is not, and this is where to slow down.',
            slides: 'Slides 10–11, 14',
            body: (
              <>
                <Para>
                  <strong>Adding</strong> is as easy as it looks: line the two matrices up and add the numbers that sit
                  on top of each other. They must be the same shape, or some numbers would have no partner.
                </Para>
                <Para>
                  <strong>Multiplying by a plain number</strong> (a scalar) is just as easy: multiply every entry by it.
                </Para>
                <Para>
                  <strong>Multiplying two matrices</strong> is the odd one. To get the number in row i, column j of the
                  answer, you take <em>row i of the first matrix</em> and <em>column j of the second</em>, multiply them
                  together a pair at a time, and add the results up. Click any number in the answer below and it will
                  show you exactly which numbers made it.
                </Para>
                <div className="my-4">
                  <MatrixProductLab />
                </div>
                <Para>
                  Two things people get wrong here. First, <strong>the shapes have to fit</strong>: an m × k matrix can
                  only multiply a k × n one, because the row and the column being paired up must be the same length. The
                  answer comes out m × n. Second, <strong>order matters</strong>. AB and BA are different, and quite
                  often only one of them is even allowed to exist.
                </Para>
                <Para>Three rules do carry over from ordinary numbers, and the lecture lists them:</Para>
                <Worked title="Rules that still hold">
                  {`(AB)C = A(BC)                 you can regroup, but not reorder
(A + B)C = AC + BC            multiplying out works as usual
A(C + D) = AC + AD

I A = A I = A                 I is the "do nothing" matrix:
                              1s down the diagonal, 0s elsewhere`}
                </Worked>
                <Terms
                  items={[
                    {
                      term: 'identity matrix I',
                      say: 'eye',
                      def: 'Square, with 1s down the diagonal and 0s everywhere else. Multiplying by it changes nothing, exactly like multiplying a number by 1.',
                    },
                    {
                      term: 'associativity',
                      def: 'You may move the brackets: (AB)C is the same as A(BC). It does NOT mean you may swap A and B.',
                    },
                    {
                      term: 'commutativity',
                      def: 'Swapping the order. Ordinary numbers have it, matrices do not — AB is usually not BA.',
                    },
                  ]}
                />
                <Takeaway>
                  A row of the first matrix meets a column of the second. If they are not the same length, the
                  multiplication simply does not exist.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 9 */
          {
            id: 'inverse',
            title: 'The inverse, the transpose, and when the inverse goes missing',
            teaser: 'An undo button that only exists when the determinant is not zero.',
            slides: 'Slides 11–13',
            body: (
              <>
                <Para>
                  The <strong>inverse</strong> of a square matrix A, written <strong>A⁻¹</strong>, is the matrix that
                  undoes it: A A⁻¹ = A⁻¹ A = I. It is the matrix version of &ldquo;divide by A&rdquo;.
                </Para>
                <Para>
                  Not every matrix has one — and the lecture works out exactly when, using a 2 × 2 example. Multiply A
                  by a cleverly shuffled version of itself and almost everything cancels, leaving one number times the
                  identity:
                </Para>
                <Worked title="The 2 × 2 derivation from the slides">
                  {`      ⎡ a  b ⎤              ⎡  d  −b ⎤
A  =  ⎣ c  d ⎦        B  =  ⎣ −c   a ⎦

              ⎡ ad − bc      0    ⎤
A B  =        ⎣    0     ad − bc  ⎦  =  (ad − bc) I

so       A⁻¹ = ────────  ⎡  d  −b ⎤     provided ad − bc ≠ 0
               ad − bc   ⎣ −c   a ⎦`}
                </Worked>
                <Para>
                  That number <strong>ad − bc</strong> is the <strong>determinant</strong>. The whole formula divides by
                  it, so if it is zero the inverse cannot exist. Change the numbers below and watch it happen.
                </Para>
                <div className="my-4">
                  <InverseExplorer />
                </div>
                <Para>
                  The <strong>transpose</strong>, written <strong>Aᵀ</strong>, is much simpler: tip the matrix over so
                  its rows become columns. An m × n matrix becomes n × m. The properties worth memorising are:
                </Para>
                <Worked title="Inverse and transpose rules">
                  {`(Aᵀ)ᵀ = A                    tipping twice gets you back
(A + B)ᵀ = Aᵀ + Bᵀ
(AB)ᵀ = Bᵀ Aᵀ                the order flips
(AB)⁻¹ = B⁻¹ A⁻¹             the order flips here too

(A + B)⁻¹ ≠ A⁻¹ + B⁻¹        this one is simply not true`}
                </Worked>
                <Para>
                  Why does the order flip? Think about getting dressed: socks then shoes. To undo it you take off shoes
                  then socks — last on, first off. Matrices behave the same way, and the proof in the slides is just
                  this idea written out: the entry in row i, column j of AB pairs row i of A with column j of B, and
                  those are exactly column i of Aᵀ and row j of Bᵀ.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'A⁻¹',
                      say: 'A inverse',
                      def: 'The undo matrix. Applying A and then A⁻¹ leaves everything where it started.',
                    },
                    {
                      term: 'Aᵀ',
                      say: 'A transpose',
                      def: 'The matrix tipped over its diagonal: row 1 becomes column 1.',
                    },
                    {
                      term: 'determinant',
                      def: 'One number squeezed out of a square matrix. Zero means the matrix flattens space and cannot be undone.',
                    },
                    {
                      term: 'singular',
                      def: 'The word for a square matrix with no inverse — its determinant is zero.',
                    },
                  ]}
                />
              </>
            ),
          },

          /* ------------------------------------------------------------ 10 */
          {
            id: 'axb',
            title: 'Writing the whole system as Ax = b',
            teaser: 'Four lines of equations collapse into three letters.',
            slides: 'Slides 14–15',
            body: (
              <>
                <Para>
                  Here is the payoff for all that matrix machinery. Any system of linear equations can be written as one
                  short statement: <strong>Ax = b</strong>.
                </Para>
                <Worked title="The same system, twice">
                  {`2x₁ + 3x₂ + 5x₃ = 1        ⎡ 2   3   5 ⎤ ⎡ x₁ ⎤   ⎡ 1 ⎤
4x₁ − 2x₂ − 7x₃ = 8        ⎢ 4  −2  −7 ⎥ ⎢ x₂ ⎥ = ⎢ 8 ⎥
9x₁ + 5x₂ − 3x₃ = 2        ⎣ 9   5  −3 ⎦ ⎣ x₃ ⎦   ⎣ 2 ⎦

                                 A         x        b`}
                </Worked>
                <Para>
                  <strong>A</strong> holds the numbers in front of the unknowns — one row per equation.{' '}
                  <strong>x</strong> is the column of unknowns you are hunting for. <strong>b</strong> is the column of
                  answers on the right-hand side. Check it against the multiplication rule from before: row 1 of A meets
                  the column x, giving 2x₁ + 3x₂ + 5x₃, and that has to equal 1. It is the same statement.
                </Para>
                <Para>
                  This is worth more than saved ink. Once a problem is &ldquo;Ax = b&rdquo;, everything you know about
                  matrices applies to it. And if A happens to be square with an inverse, you can even write the answer
                  down directly as x = A⁻¹b.
                </Para>
                <Takeaway>
                  Ax = b is the sentence the rest of the course is written in. Getting comfortable reading it is the
                  main job of this lecture.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 11 */
          {
            id: 'columns',
            title: 'The better way to read Ax = b',
            teaser: 'x is a recipe for mixing the columns of A to reach b.',
            slides: 'Slides 15–16',
            body: (
              <>
                <Para>
                  There is a second way to read Ax = b, and it explains far more than the first. Instead of thinking row
                  by row, look at the <strong>columns</strong> of A. Multiplying A by x means: take x₁ of the first
                  column, plus x₂ of the second column, plus x₃ of the third, and add them all up.
                </Para>
                <Worked title="Ax = b, column by column">
                  {`⎡ 1  0   8  −4 ⎤             ⎡ 1 ⎤     ⎡ 0 ⎤     ⎡  8 ⎤     ⎡ −4 ⎤   ⎡ 42 ⎤
⎣ 0  1   2  12 ⎦  x  =  x₁ ⎣ 0 ⎦ + x₂ ⎣ 1 ⎦ + x₃ ⎣  2 ⎦ + x₄ ⎣ 12 ⎦ = ⎣  8 ⎦`}
                </Worked>
                <Para>
                  So <strong>x is a recipe</strong>. Each unknown says how much of one column to use. Solving Ax = b
                  means finding the mixture of the columns that lands exactly on b.
                </Para>
                <Para>
                  Now the three outcomes from earlier become obvious rather than mysterious. Drag the two coloured
                  arrows below until they line up on top of each other, and watch what happens to what you can reach:
                </Para>
                <div className="my-4">
                  <ColumnPictureChart />
                </div>
                <Para>
                  If the columns point in genuinely different directions, they can reach any target, so there is always
                  exactly one recipe. If they lie along the same line, they can only ever reach that line — and then a
                  target off the line has <em>no</em> recipe, while a target on the line has <em>endlessly many</em>.
                  Same three cases, seen from a new angle.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'linear combination',
                      def: 'Scale some vectors and add them up. "3 of this one minus 2 of that one" is a linear combination.',
                    },
                    {
                      term: 'span',
                      def: 'Everything you can reach by mixing a set of vectors. Two arrows pointing different ways span the whole plane; two lined-up arrows span only a line.',
                    },
                    {
                      term: 'overconstrained',
                      def: 'More equations than unknowns, so they usually disagree and there is no exact answer. Linear regression is the standard way of coping.',
                    },
                    {
                      term: 'underconstrained',
                      def: 'Fewer equations than unknowns, so a lot of freedom is left over and you get endless answers.',
                    },
                  ]}
                />
              </>
            ),
          },

          /* ------------------------------------------------------------ 12 */
          {
            id: 'general',
            title: 'One answer, and then all the others',
            teaser: 'Find any single answer, then find everything that adds up to nothing.',
            slides: 'Slides 16–19',
            body: (
              <>
                <Para>
                  When a system has endlessly many answers, you need a way to describe all of them at once. The
                  lecture&rsquo;s method has two halves, and it is genuinely clever.
                </Para>
                <Para>
                  <strong>Half one — find any single answer.</strong> For the example above, the first two columns are
                  (1, 0) and (0, 1), so reaching (42, 8) is easy: take 42 of the first, 8 of the second, none of the
                  rest. That gives x = (42, 8, 0, 0). This is called the <strong>particular solution</strong>. It is not
                  special — it is just one that was easy to spot.
                </Para>
                <Para>
                  <strong>Half two — find everything that goes nowhere.</strong> Now look for recipes that add up to the{' '}
                  <strong>zero</strong> vector. Adding one of those to your answer moves you nowhere, so the result is
                  still an answer. In the example, 8 of column 1 plus 2 of column 2 minus 1 of column 3 cancels out
                  exactly:
                </Para>
                <Worked title="Recipes that land on zero">
                  {`8·c₁ + 2·c₂ − 1·c₃ + 0·c₄ = 0     →   (8, 2, −1, 0)
−4·c₁ + 12·c₂ + 0·c₃ − 1·c₄ = 0    →   (−4, 12, 0, −1)

Put both halves together:

        ⎡ 42 ⎤      ⎡  8 ⎤      ⎡ −4 ⎤
        ⎢  8 ⎥      ⎢  2 ⎥      ⎢ 12 ⎥
  x  =  ⎢  0 ⎥ + λ₁ ⎢ −1 ⎥ + λ₂ ⎢  0 ⎥      for any numbers λ₁, λ₂
        ⎣  0 ⎦      ⎣  0 ⎦      ⎣ −1 ⎦

     particular          goes nowhere`}
                </Worked>
                <Para>
                  That is the <strong>general solution</strong>: every answer the system has, written in one line. Pick
                  any λ₁ and λ₂ you like and you get a valid answer; every valid answer comes from some choice of them.
                </Para>
                <Para>
                  Neither half is unique. A different easy-to-spot answer would do just as well for the first half, and
                  you would end up describing the same set of answers a different way — like giving directions from a
                  different starting point.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'particular solution',
                      say: 'x-p',
                      def: 'Any one answer to Ax = b that you managed to find. Just a foothold.',
                    },
                    {
                      term: 'homogeneous system',
                      def: 'Ax = 0 — the same matrix, but with zero on the right. Its answers are the moves that change nothing.',
                    },
                    {
                      term: 'general solution',
                      def: 'The particular solution plus every solution of Ax = 0. This is all the answers, described in one line.',
                    },
                    {
                      term: 'λ',
                      say: 'lambda',
                      def: 'A free dial. You may set it to any number, and each setting gives a different valid answer.',
                    },
                  ]}
                />
                <Takeaway>All answers = one answer you found + everything that adds up to nothing.</Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 13 */
          {
            id: 'moves',
            title: 'The three moves you are allowed',
            teaser: 'Three ways to change the numbers without changing the answers.',
            slides: 'Slide 20',
            body: (
              <>
                <Para>
                  Guessing the answer worked above only because the matrix was unusually tidy. For a messy one we need a
                  method: turn the messy matrix into a tidy one, without changing what the answers are.
                </Para>
                <Para>
                  There are exactly three moves that are safe. They are called{' '}
                  <strong>elementary row operations</strong>, and the lecture numbers them ERO1, ERO2, ERO3.
                </Para>
                <Worked title="The three elementary row operations">
                  {`ERO1   Rᵢ ↔ Rⱼ                swap two rows

ERO2   Rₖ ← α Rₖ,  α ≠ 0     multiply a row by a number
                             (any number except zero)

ERO3   Rᵢ ← Rᵢ + β Rⱼ        add a multiple of one row
                             to another row`}
                </Worked>
                <Para>
                  Why are these safe? Because each one is something you could do to the equations themselves. Swapping
                  two rows just writes the equations in a different order. Multiplying a row by 3 turns &ldquo;x + y =
                  2&rdquo; into &ldquo;3x + 3y = 6&rdquo;, which is the same statement. And adding one equation to
                  another is exactly the trick used at the very start of this page to make a variable vanish.
                </Para>
                <Para>
                  <strong>Why must the multiplier never be zero?</strong> Because multiplying a row by 0 turns it into
                  &ldquo;0 = 0&rdquo;. That is true, but it is no longer the equation you started with — you have thrown
                  a constraint away, and the system you are left with has more answers than the one you were asked
                  about. The lab below refuses to do it, and says so.
                </Para>
                <Takeaway>
                  These three moves change how the system looks but never which values solve it. That is the licence the
                  whole method runs on.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 14 */
          {
            id: 'lab',
            title: 'Gaussian elimination, one move at a time',
            teaser: 'The method in full, on the lecture’s own systems. Press “Next step” and watch.',
            slides: 'Slides 21–24',
            body: (
              <>
                <Para>
                  First, a shortcut in the writing. Since the letters x₁, x₂, x₃ just sit there in every line, drop them
                  and keep the numbers in place. Add a bar for the right-hand side and you get the{' '}
                  <strong>augmented matrix</strong> — &ldquo;augmented&rdquo; simply meaning the answers column has been
                  tacked on.
                </Para>
                <Para>
                  Now apply the three moves in a fixed order: work down the columns, use each pivot row to knock out
                  everything below it, and you are guaranteed to end up with a staircase of zeros. That procedure is{' '}
                  <strong>Gaussian elimination</strong>.
                </Para>
                <Para>
                  Below is the real thing. Pick a system, then press <strong>Next step</strong> over and over. Each
                  press does exactly one of the three legal moves and writes it into the log. The equations underneath
                  update as you go — look at them and check that the answers never change, even though the numbers do.
                </Para>
                <div className="my-4">
                  <EliminationLab />
                </div>
                <Para>
                  Try the <strong>No answer</strong> system and keep going. A row will eventually turn into all zeros on
                  the left with something that is not zero on the right — a row that reads &ldquo;0 = 1&rdquo;. That is
                  the algorithm telling you, plainly, that the equations contradict each other.
                </Para>
              </>
            ),
          },

          /* ------------------------------------------------------------ 15 */
          {
            id: 'echelon',
            title: 'Row-echelon form: pivots and free variables',
            teaser: 'The staircase shape, and how to read the answers off it.',
            slides: 'Slides 24–25',
            body: (
              <>
                <Para>
                  The shape you are aiming for is called <strong>row-echelon form</strong>. &ldquo;Echelon&rdquo; is
                  just a word for a staircase arrangement. A matrix is in this form when:
                </Para>
                <ul className="crux-prose mb-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px]/[1.7] text-zinc-700">
                  <li>any rows that are entirely zero have sunk to the bottom;</li>
                  <li>
                    in every other row, the first number that is not zero — its <strong>pivot</strong> — sits strictly
                    further right than the pivot in the row above.
                  </li>
                </ul>
                <Para>
                  Those two rules force the staircase pattern. Once you have it, the bottom row involves the fewest
                  unknowns, so you solve it first and work upwards, substituting as you go. That is called{' '}
                  <strong>back substitution</strong>.
                </Para>
                <Para>
                  The pivots also answer the &ldquo;how many answers?&rdquo; question directly. A column <em>with</em> a
                  pivot belongs to a <strong>basic variable</strong> — its value gets forced. A column <em>without</em>{' '}
                  one belongs to a <strong>free variable</strong> — nothing pins it down, so you may set it to whatever
                  you like, and each choice gives a different answer.
                </Para>
                <Worked title="Counting up">
                  {`no free variables, no contradiction   →  exactly one answer
a row reading 0 = (not zero)          →  no answer
one or more free variables            →  endless answers,
                                         one free dial each`}
                </Worked>
                <Para>
                  In the lab above, the panel names the free variables for you. Load{' '}
                  <strong>The big one from the slides</strong> and finish it: two variables come out free, which is why
                  that example ended with two λ dials.
                </Para>
                <Terms
                  items={[
                    {
                      term: 'pivot',
                      def: 'The first number in a row that is not zero, once the matrix is in staircase form. Each one pins down a variable.',
                    },
                    {
                      term: 'basic variable',
                      def: 'A variable whose column has a pivot. Its value is forced by the equations.',
                    },
                    {
                      term: 'free variable',
                      def: 'A variable whose column has no pivot. You choose it, and the basic ones adjust around your choice.',
                    },
                    {
                      term: 'back substitution',
                      def: 'Solving the bottom equation first, then feeding that value up into the one above, and so on.',
                    },
                  ]}
                />
              </>
            ),
          },

          /* ------------------------------------------------------------ 16 */
          {
            id: 'rref',
            title: 'Going further: reduced row-echelon form',
            teaser: 'Scrub the columns above the pivots too, and the answers fall out with no work at all.',
            slides: 'Slides 26–29',
            body: (
              <>
                <Para>
                  You can keep going past the staircase. In <strong>reduced</strong> row-echelon form, every pivot has
                  been scaled to <strong>1</strong>, and it is the <em>only</em> number that is not zero in its whole
                  column — above as well as below.
                </Para>
                <Para>
                  This costs a few more moves and saves all the back substitution: the pivot columns now look exactly
                  like the columns of the identity matrix, so each basic variable is simply sitting there equal to a
                  number.
                </Para>
                <Para>
                  It also makes the &ldquo;goes nowhere&rdquo; recipes from earlier easy to read off. Take this matrix
                  from the slides, already in reduced form:
                </Para>
                <Worked title="Reading Ax = 0 straight off">
                  {`     ⎡ 1  3  0  0   3 ⎤
A =  ⎢ 0  0  1  0   9 ⎥        pivots in columns 1, 3, 4
     ⎣ 0  0  0  1  −4 ⎦        columns 2 and 5 are free

Column 2 is 3 × column 1, so  3·c₁ − 1·c₂ = 0:
                                        (3, −1, 0, 0, 0)

Column 5 is 3·c₁ + 9·c₃ − 4·c₄, so:
                                        (3, 0, 9, −4, −1)`}
                </Worked>
                <Para>
                  Each free column gives you one of these, and together they describe everything that adds up to zero.
                  Add them onto any particular solution and you have the general solution — the same two-half recipe as
                  before, but now handed to you by the method instead of spotted by eye.
                </Para>
                <Takeaway>
                  Reduced form turns &ldquo;solve the system&rdquo; into &ldquo;read the system&rdquo;.
                </Takeaway>
              </>
            ),
          },

          /* ------------------------------------------------------------ 17 */
          {
            id: 'recipe',
            title: 'The method as a recipe',
            teaser: 'Clear out below the diagonal, then above it. That is the whole algorithm.',
            slides: 'Slides 29–30',
            body: (
              <>
                <Para>Stripped of detail, Gaussian elimination is two sweeps:</Para>
                <Worked title="The shape of the algorithm">
                  {`⎡ a  b  c ⎤    ⎡ a  b   c  ⎤    ⎡ a  b   c  ⎤    ⎡ a  0   c′ ⎤    ⎡ 1  0  0 ⎤
⎢ d  e  f ⎥ →  ⎢ 0  e′  f′ ⎥ →  ⎢ 0  e′  f′ ⎥ →  ⎢ 0  e′  0  ⎥ →  ⎢ 0  1  0 ⎥
⎣ g  h  i ⎦    ⎣ 0  h′  i′ ⎦    ⎣ 0  0   i″ ⎦    ⎣ 0  0   i″ ⎦    ⎣ 0  0  1 ⎦

    start        clear below       clear below       clear above      scale the
                 the 1st pivot     the 2nd pivot     the pivots       pivots to 1`}
                </Worked>
                <Para>
                  <strong>Sweep one, downwards.</strong> Use multiples of the first row to wipe out the first column
                  below it. Then use the second row on the second column, and so on. You end up with an{' '}
                  <strong>upper-triangular</strong> matrix — everything below the diagonal is zero.
                </Para>
                <Para>
                  <strong>Sweep two, upwards.</strong> Use the last row to wipe out its column above, then the second to
                  last, and so on. Now only the diagonal survives, and scaling each pivot to 1 leaves the identity.
                </Para>
                <Para>
                  Every single move in both sweeps is one of the three legal ones, so the answers were never in danger
                  at any point. That is the entire justification for the method.
                </Para>
              </>
            ),
          },

          /* ------------------------------------------------------------ 18 */
          {
            id: 'invert',
            title: 'A bonus: the same method finds the inverse',
            teaser: 'Write A next to I, run the method, and the inverse appears where I was.',
            slides: 'Slide 31',
            body: (
              <>
                <Para>
                  Here is a neat trick the lecture finishes on. Suppose you want A⁻¹. Each column of A⁻¹ is the answer
                  to a system: solve <strong>Ax = e</strong>
                  <sub>i</sub>, where e<sub>i</sub> is a column of the identity — all zeros except a single 1 — and the
                  answer x is column i of A⁻¹.
                </Para>
                <Para>
                  So finding an inverse is really n separate systems, all sharing the same matrix A. And since they
                  share A, every row operation you do for one is the row operation you need for all of them. So do them
                  all at once: build a wide augmented matrix with A on the left and the whole identity on the right, and
                  run the method.
                </Para>
                <Worked title="Both at once">
                  {`start with     [ A | I ]

run Gaussian elimination until the left half is I

finish with    [ I | A⁻¹ ]`}
                </Worked>
                <Para>
                  When A has an inverse, the reduced form of A <em>is</em> the identity: every column earns a pivot. If
                  the method stalls and some column never gets one, A has no inverse — which is the same thing the
                  determinant was telling you back in section 9, arrived at by a different road.
                </Para>
                <Takeaway>
                  One method — three legal moves, applied in order — answers &ldquo;solve this&rdquo;, &ldquo;how many
                  answers are there&rdquo;, and &ldquo;what is the inverse&rdquo;.
                </Takeaway>
              </>
            ),
          },
        ]}
      />

      <Explainers
        plain="A system of linear equations is a set of straight-line rules that all have to hold at once. Drawn out, they are lines or flat sheets, and the answer is wherever they all cross. Written down, they are a box of numbers. Gaussian elimination is a fixed set of tidying-up moves that never changes the answer but makes it easy to read."
        breaks="It breaks in two ways, and both are useful. If the rules disagree with each other, a row ends up saying 0 = 1 and there is no answer — this is normal with real data, and linear regression is the standard way of coping. If a rule repeats what the others already said, you get free variables and endlessly many answers, which means your data has not pinned the problem down."
      >
        <MathBlock
          intro="Six lines that carry the whole lecture. Everything above is one of these being explained slowly."
          formulas={[
            {
              formula: 'a₁x₁ + a₂x₂ + … + aₙxₙ = b',
              reading:
                'One linear equation. Every unknown appears once, on its own, multiplied by a plain number. No squares, no roots, no two unknowns multiplied together.',
            },
            {
              formula: 'Ax = b',
              reading:
                'A whole system in three letters. A holds the numbers in front of the unknowns, x is the column you are hunting for, b is the right-hand side.',
            },
            {
              formula: 'Ax = x₁c₁ + x₂c₂ + … + xₙcₙ',
              reading:
                'The same thing read down the columns. c₁ … cₙ are the columns of A, and x is the recipe saying how much of each to use. Solving means mixing them to land on b.',
            },
            {
              formula: 'x = xₚ + λ₁h₁ + λ₂h₂ + …',
              reading:
                'Every answer at once. xₚ is any single answer you found; each h is a recipe that adds up to nothing, so adding any amount of it keeps you on an answer.',
            },
            {
              formula: 'Rᵢ ↔ Rⱼ    Rₖ ← αRₖ (α ≠ 0)    Rᵢ ← Rᵢ + βRⱼ',
              reading:
                'The only three moves allowed. Each is something you could do to the equations themselves, which is why none of them changes the answers.',
            },
            {
              formula: 'det = ad − bc,    A⁻¹ exists ⟺ det ≠ 0',
              reading:
                'For a 2 × 2 matrix. The inverse formula divides by the determinant, so a zero there means there is no inverse and the matrix has flattened space onto a line.',
            },
          ]}
          legend={[
            {
              sym: 'A',
              name: 'The coefficient matrix',
              note: 'One row per equation, one column per unknown.',
              val: 'the grid in the lab',
            },
            {
              sym: 'x',
              name: 'The unknowns',
              note: 'A column of the values you are trying to find.',
              val: 'what you solve for',
            },
            {
              sym: 'b',
              name: 'The right-hand side',
              note: 'The column of numbers the equations have to add up to.',
              val: 'the black ring',
            },
            {
              sym: 'm × n',
              name: 'The shape',
              note: 'm rows by n columns. Rows are always said first.',
              val: 'shown above each grid',
            },
            {
              sym: 'I',
              name: 'Identity matrix',
              note: '1s down the diagonal, 0s elsewhere. Multiplying by it changes nothing.',
              val: 'the goal of the method',
            },
            {
              sym: 'Aᵀ',
              name: 'Transpose',
              note: 'The matrix tipped over: rows become columns.',
              val: 'flips order in products',
            },
            {
              sym: 'A⁻¹',
              name: 'Inverse',
              note: 'Undoes A. Only exists when the determinant is not zero.',
              val: 'try the explorer',
            },
            {
              sym: 'λ',
              name: 'A free dial',
              note: 'Set it to any number you like. Each setting gives a different valid answer.',
              val: 'one per free variable',
            },
            {
              sym: 'pivot',
              name: 'A step of the staircase',
              note: 'The first non-zero number in a row. Its column belongs to a variable that gets pinned down.',
              val: 'highlighted in the lab',
            },
            {
              sym: '0',
              name: 'The zero vector',
              note: 'All zeros. Recipes that land here are what turn one answer into all of them.',
              val: 'the second half',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Every dataset is a matrix',
            how: 'One row per example, one column per feature. The word "matrix" in a machine learning paper almost always means a table of data laid out exactly like the workshop table above.',
          },
          {
            what: 'Linear regression is a broken system, handled gracefully',
            how: 'Real data gives far more equations than unknowns, so they disagree and there is no exact answer. Regression finds the values that come closest instead — the same idea as the distance read-out on the column chart.',
          },
          {
            what: 'Ax = b is a layer of a neural network',
            how: 'A layer multiplies its input by a matrix of weights and adds a bias. That is this equation, run millions of times a second.',
          },
          {
            what: 'Free variables mean your data is not enough',
            how: 'If the system has endless answers, several different models fit equally well and nothing chooses between them. That is under-determination, and it is why regularisation exists.',
          },
          {
            what: 'A zero determinant is a real-world warning',
            how: 'It means two of your columns say the same thing — two features that move together, like height in cm and height in inches. The maths cannot separate their effects, and neither can the model.',
          },
          {
            what: 'Gaussian elimination is still what the computer does',
            how: 'When code calls solve(A, b), some careful, numerically stable descendant of exactly this procedure is what runs.',
          },
        ]}
      />
    </div>
  )
}
