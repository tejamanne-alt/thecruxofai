/*
 * Deliberately NOT a client module. It only composes — the labs it renders are
 * each 'use client' themselves. Marking this file 'use client' turns LEC1_PARTS
 * into a client *reference* when the server route imports it, the lookup comes
 * back empty, and every part page 404s.
 */
import { ColumnPictureChart } from '@/components/charts/column-picture-chart'
import { NullspaceLab, PivotLab, SweepLab } from '@/components/charts/echelon-labs'
import { EliminationLab, InverseByElimination } from '@/components/charts/elimination-lab'
import { MatrixAddLab, MatrixShapeLab, SystemMatrixLab, TransposeLab } from '@/components/charts/matrix-basics-lab'
import { InverseExplorer, MatrixProductLab } from '@/components/charts/matrix-lab'
import { PlanesLab } from '@/components/charts/planes-lab'
import { TwoLinesChart } from '@/components/charts/two-lines-chart'
import { CombineLab, LineExplorer, SolutionSetLab, VectorAddLab } from '@/components/charts/vector-labs'
import { WorkshopLab } from '@/components/charts/workshop-lab'
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

export const LEC1_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  what: (
    <>
      <Para>
        Linear algebra is the study of <strong>vectors</strong>. So the first thing to sort out is what a vector is.
      </Para>
      <Para>
        At school you meet vectors as arrows. An arrow on a flat page, or an arrow in the room you are sitting in. That
        is a fine place to start. But it is not the whole idea.
      </Para>
      <Para>
        A vector is really anything you can do two things to. You can <strong>add</strong>{' '}two of them and get another
        one. And you can <strong>stretch</strong>{' '}one by a number and still have one. That is it. That is the test.
      </Para>
      <Para>
        Try it below. Drag either arrow anywhere you like. The black arrow is the two of them added. Notice that you
        cannot break it. The answer is always another arrow.
      </Para>

      <Lab>
        <VectorAddLab />
      </Lab>

      <Para>
        Now here is why that matters. Lots of things pass the same test without looking anything like arrows. Take
        polynomials, the things like 3x² + 2x + 1. Add two of them and you get a polynomial. Double one and you still
        have a polynomial. So polynomials are vectors too.
      </Para>
      <Para>
        This &ldquo;you always land back in the same family&rdquo; idea has a name. It is called{' '}
        <strong>closure</strong>, and a family that has it is called a <strong>vector space</strong>. Almost all of
        machine learning is built on top of that idea, which is why the lecture starts here.
      </Para>
      <Para>
        In this course a vector is nearly always just a list of numbers. A list of 2 numbers is a point on a flat page.
        A list of 3 is a point in the room. A photo might be a list of a million. The maths works the same either way,
        and that is the point of learning it.
      </Para>

      <Terms
        items={[
          {
            term: 'vector',
            def: 'A list of numbers. You can add two lists of the same length, and you can multiply a list by a number. Often drawn as an arrow.',
          },
          {
            term: 'scalar',
            def: 'A plain single number, used to stretch or shrink a vector. It is called a scalar because it scales things.',
          },
          {
            term: 'closure',
            def: 'Adding or stretching never gives you a different kind of thing. Add two vectors, you still have a vector.',
          },
          {
            term: 'vector space',
            def: 'A family of things that has closure. Arrows are one. Lists of numbers are one. Polynomials are one.',
          },
          {
            term: 'ℝⁿ',
            say: 'R n',
            def: 'All the lists of n ordinary numbers. ℝ² is the flat page, ℝ³ is the room. It keeps going past what you can picture.',
          },
        ]}
      />
      <Takeaway>
        A vector is not only an arrow. It is anything you can add and stretch without leaving the family.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  equation: (
    <>
      <Para>
        An equation is <strong>linear</strong>{' '}when every unknown sits on its own, with just a plain number in front of
        it. Nothing else is allowed to happen to it.
      </Para>
      <List
        items={[
          <>
            <strong>x + y = 1</strong>{' '}is linear.
          </>,
          <>
            <strong>2a + 3b − c = 7</strong>{' '}is linear.
          </>,
          <>
            <strong>x² + y = 1</strong>{' '}is not. The x is squared.
          </>,
          <>
            <strong>xy = 1</strong>{' '}is not. Two unknowns are multiplied together.
          </>,
        ]}
      />
      <Para>
        You have met this before as <strong>y = mx + c</strong>. It is the same thing in different clothes. Take x + y =
        1 and move things around: y = −x + 1. So m is −1 and c is 1. The m tilts the line and the c slides it up or
        down.
      </Para>
      <Para>
        Now the part worth remembering. One equation with two unknowns does <strong>not</strong>{' '}give you one answer. It
        gives you a whole line of them.
      </Para>
      <Para>
        Try it. Press anywhere on the picture to move the big dot. It turns green when your point makes the equation
        true. Slide it along the line and it stays green the whole way.
      </Para>

      <Lab>
        <LineExplorer />
      </Lab>

      <Para>
        Every single point on that line is a correct answer. Step even slightly off it and the two sides of the equation
        stop matching. So a single equation does not pin anything down. It only narrows things.
      </Para>
      <Para>
        That is why the next page is about using more than one equation at a time. One line is a lot of answers. Two
        lines usually cross at one spot, and that is where things get useful.
      </Para>

      <Terms
        items={[
          {
            term: 'linear',
            def: 'Every unknown appears on its own with a plain number in front. No squares, no roots, no two unknowns multiplied together.',
          },
          {
            term: 'coefficient',
            def: 'The number sitting in front of an unknown. In 3x, the coefficient is 3.',
          },
          {
            term: 'constant',
            def: 'A number on its own, with no unknown attached to it.',
          },
        ]}
      />
      <Takeaway>One linear equation with two unknowns gives you a line of right answers, not a single one.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  system: (
    <>
      <Para>
        A <strong>system</strong>{' '}of linear equations is just several equations that all have to be true at the same
        time. They share the same unknowns. That sharing is the whole point, because it means the equations limit each
        other.
      </Para>
      <Para>Here is a small one, solved by hand:</Para>

      <Worked title="Two equations, done by hand">
        {`x + y − 1 = 0        …①
x − y − 3 = 0        …②

Add ① and ② together:
    2x − 4 = 0        the y cancels out
         x = 2

Put x = 2 back into ①:
    2 + y = 1
        y = −1

Answer:  x = 2,  y = −1`}
      </Worked>

      <Para>
        Look at what happened in the middle. Adding the two equations made the y disappear. That left one easy equation
        with one unknown in it.
      </Para>
      <Para>
        That single trick runs this whole lecture. Everything later is just doing it carefully, in a fixed order, for
        any number of equations.
      </Para>
      <Para>
        Have a go below. Each equation is drawn as a line. The red circle marks the answer to both. Press{' '}
        <strong>R1 − R2</strong>{' '}and watch the first line swing round until it stands straight up. One unknown has just
        been removed.
      </Para>

      <Lab>
        <CombineLab />
      </Lab>

      <Para>
        Now the important bit. Keep pressing buttons. The lines move about a lot. The red circle never moves. Combining
        equations changes how they look, but not what the answer is.
      </Para>

      <Terms
        items={[
          {
            term: 'system of equations',
            def: 'Several equations that must all be true at once, sharing the same unknowns.',
          },
          {
            term: 'solution',
            def: 'One set of values that makes every equation true. Not just one of them — all of them.',
          },
          {
            term: 'eliminate',
            def: 'To make an unknown vanish by combining two equations. This is where the method gets its name.',
          },
        ]}
      />
      <Takeaway>Adding one equation to another can knock out an unknown, and it never changes the answer.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  workshop: (
    <>
      <Para>
        Here is a real problem of the kind the lecture is about. A workshop builds three things: chair kits, table kits
        and cabinet kits. Call the number of each <strong>x₁</strong>, <strong>x₂</strong> and <strong>x₃</strong>.
      </Para>
      <Para>
        Each kit uses up wood, labour, machine time and shipping effort. There is a fixed amount of each. The job is to
        use up everything exactly, with nothing left over and nothing short.
      </Para>

      <div className="my-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-[12.5px]">
          <thead>
            <tr className="border-b border-zinc-950/10 text-left text-zinc-500">
              <th className="py-1.5 pr-3 font-semibold">Resource</th>
              <th className="py-1.5 pr-3 font-semibold">Chair (x₁)</th>
              <th className="py-1.5 pr-3 font-semibold">Table (x₂)</th>
              <th className="py-1.5 pr-3 font-semibold">Cabinet (x₃)</th>
              <th className="py-1.5 font-semibold">You have</th>
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

      <Para>Read each row straight across and you get one equation:</Para>

      <Worked title="The workshop, written as four equations">
        {`  x₁ + 2x₂ +  x₃ =  9      wood
 2x₁ +  x₂ +  x₃ =  8      labour
  x₁ +  x₂ + 2x₃ =  7      machine time
 3x₁ +  x₂ + 2x₃ = 11      shipping`}
      </Worked>

      <Para>
        Try to solve it by hand below. Move the sliders and watch the bars. The black line on each bar is what you have.
        You need to land on all four lines at once.
      </Para>

      <Lab>
        <WorkshopLab />
      </Lab>

      <Para>
        It is fiddly, isn&rsquo;t it. Fix one bar and two others go wrong. And this is only three unknowns. With ten you
        would have no chance by hand.
      </Para>
      <Para>
        The answer is 2 chairs, 3 tables and 1 cabinet. But the answer is not really the interesting part. What matters
        is that there is a method which finds it every time, and which also tells you honestly when there is no answer
        at all.
      </Para>

      <Takeaway>
        A table of &ldquo;how much of each thing does each product use&rdquo; is already a matrix. You have been writing
        them for years without using the word.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  howmany: (
    <>
      <Para>
        This is the big result of the lecture, and it is a tidy one. A system of linear equations has one of only three
        outcomes:
      </Para>
      <List
        items={[
          <>
            <strong>exactly one answer</strong>,
          </>,
          <>
            <strong>no answer at all</strong>, or
          </>,
          <>
            <strong>endlessly many answers</strong>.
          </>,
        ]}
      />
      <Para>
        There is no fourth option. It can never have exactly two, or exactly seven. With two unknowns it is easy to see
        why. Each equation is a line, and two lines can only do three things: cross once, never meet, or lie on top of
        each other.
      </Para>
      <Para>
        Each line below is held by two white pins. Drag any pin and the line swings with it. Try to find a fourth thing
        that can happen.
      </Para>

      <Lab>
        <TwoLinesChart />
      </Lab>

      <Para>
        The lecture makes the same point with three equations. It uses the same system three times and changes one
        number each time:
      </Para>

      <Worked title="Same system, one number changed">
        {`x₁ + x₂ +  x₃ = 3        x₁ + x₂ +  x₃ = 3        x₁ + x₂ +  x₃ = 3
x₁ − x₂ + 2x₃ = 2        x₁ − x₂ + 2x₃ = 2        x₁ − x₂ + 2x₃ = 2
     x₂ +  x₃ = 2       2x₁      + 3x₃ = 1       2x₁      + 3x₃ = 5

  one answer               no answer                endless answers`}
      </Worked>

      <Para>
        In the middle one, adding the first two equations gives 2x₁ + 3x₃ = 5. But the third equation says the same
        thing equals 1. Both cannot be true. The equations argue with each other, so nothing works.
      </Para>
      <Para>
        In the third one, the last equation says exactly what the first two already said. It adds nothing new. So a
        whole line of answers survives.
      </Para>

      <Takeaway>
        &ldquo;No answer&rdquo; means your equations disagree. &ldquo;Endless answers&rdquo; means one of them was not
        telling you anything new.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  planes: (
    <>
      <Para>
        Move up to three unknowns and each equation stops being a line. It becomes a <strong>plane</strong>{' '}instead: a
        flat sheet that goes on for ever, like an endless piece of paper floating in the room.
      </Para>
      <Para>
        Spin the box below with your finger or the slider. Two of the sheets are fixed. The black line is where those
        two cut each other. The orange sheet is the one you change, using the three buttons.
      </Para>

      <Lab>
        <PlanesLab />
      </Lab>

      <Para>Watch what the orange sheet does to the black line, and you have all three outcomes again:</Para>
      <List
        items={[
          <>
            It cuts through the line at one spot. That is <strong>one answer</strong>.
          </>,
          <>
            It holds the whole line inside it. Every point on the line works, so <strong>endless answers</strong>.
          </>,
          <>
            It runs alongside the line and never touches it. <strong>No answer</strong>.
          </>,
        ]}
      />
      <Para>
        Two sheets nearly always meet in a line. So the third sheet is what decides everything. That is the whole story
        of three equations in three unknowns.
      </Para>
      <Para>
        Above three unknowns you cannot picture any of this. That is fine, and it is one of the best reasons to learn
        the symbols. They keep telling you the truth long after your imagination has given up.
      </Para>

      <Terms
        items={[
          {
            term: 'plane',
            def: 'The 3-D version of a line. A flat sheet with no edges. One linear equation in three unknowns draws one.',
          },
          {
            term: 'hyperplane',
            def: 'The same idea in four or more dimensions. Nobody can picture it, and nobody needs to.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  matrices: (
    <>
      <Para>
        A <strong>matrix</strong>{' '}is a box of numbers laid out in rows and columns. That is the whole definition.
      </Para>
      <Para>
        If it has m rows and n columns we call it an <strong>m × n</strong>{' '}matrix, said &ldquo;m by n&rdquo;. Rows are
        always said first. Click the slots below to see how each one is named.
      </Para>

      <Lab>
        <MatrixShapeLab />
      </Lab>

      <Para>
        The number in row i and column j is written <strong>aᵢⱼ</strong>. Row first again. Nearly everyone mixes this up
        once, and then never again.
      </Para>
      <Para>
        Vectors are not a separate thing from matrices. A <strong>column vector</strong> is a matrix with one column. A{' '}
        <strong>row vector</strong>{' '}is a matrix with one row. Set the columns to 1 in the box above and you have made
        one.
      </Para>

      <Worked title="Some shapes">
        {`⎡ 1  0  2 ⎤   2 × 3     two rows, three columns
⎣ 3  1 −1 ⎦

⎡ 4 ⎤
⎢ 0 ⎥         3 × 1     a column vector
⎣ 7 ⎦

[ 4  0  7 ]   1 × 3     a row vector`}
      </Worked>

      <Terms
        items={[
          { term: 'matrix', def: 'A box of numbers in rows and columns.' },
          { term: 'm × n', say: 'm by n', def: 'The shape: m rows and n columns. Rows first, always.' },
          { term: 'aᵢⱼ', say: 'a i j', def: 'The number in row i, column j. Row first again.' },
          {
            term: 'square matrix',
            def: 'One with the same number of rows and columns. Only these can have an inverse.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  arithmetic: (
    <>
      <Para>
        <strong>Adding</strong>{' '}two matrices is as easy as it looks. Line them up and add the numbers that sit on top of
        each other. They must be the same shape, or some numbers have no partner.
      </Para>
      <Para>
        <strong>Multiplying by a plain number</strong>{' '}is just as easy. Every number gets multiplied. Try both below,
        and tick the box to see what happens when the shapes do not match.
      </Para>

      <Lab>
        <MatrixAddLab />
      </Lab>

      <Para>
        <strong>Multiplying two matrices</strong>{' '}is the odd one, and it is worth slowing down here. To get one number
        in the answer, you take a <em>row</em> of the first matrix and a <em>column</em>{' '}of the second. Multiply them
        together a pair at a time, then add up everything you get.
      </Para>
      <Para>Click any number in the answer below and it will show you exactly which numbers made it.</Para>

      <Lab>
        <MatrixProductLab />
      </Lab>

      <Para>Two things people get wrong here.</Para>
      <List
        items={[
          <>
            <strong>The shapes have to fit.</strong>{' '}The row and the column being paired up must be the same length. So
            an m × k matrix can only multiply a k × n one, and the answer comes out m × n.
          </>,
          <>
            <strong>The order matters.</strong>{' '}AB and BA are different. Very often only one of them is even allowed to
            exist.
          </>,
        ]}
      />
      <Para>Three rules do carry over from ordinary numbers, and the lecture lists them:</Para>

      <Worked title="Rules that still work">
        {`(AB)C = A(BC)              you may move the brackets
                           but you may NOT swap A and B

(A + B)C = AC + BC         multiplying out works as normal
A(C + D) = AC + AD

I A = A I = A              I is the do-nothing matrix:
                           1s down the diagonal, 0s elsewhere`}
      </Worked>

      <Terms
        items={[
          {
            term: 'identity matrix I',
            say: 'eye',
            def: 'Square, with 1s down the diagonal and 0s everywhere else. Multiplying by it changes nothing, just like multiplying a number by 1.',
          },
          {
            term: 'associativity',
            def: 'You may move the brackets around. It does not mean you may swap the order.',
          },
          {
            term: 'commutativity',
            def: 'Being able to swap the order. Ordinary numbers can. Matrices cannot.',
          },
        ]}
      />
      <Takeaway>
        A row of the first matrix meets a column of the second. If they are not the same length, the multiplication
        simply does not exist.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  inverse: (
    <>
      <Para>
        The <strong>inverse</strong> of a square matrix A is written <strong>A⁻¹</strong>. It is the matrix that undoes
        A. Do one and then the other and you are back where you started: A A⁻¹ = I.
      </Para>
      <Para>Not every matrix has one. The lecture works out exactly when, using a 2 × 2 example.</Para>

      <Worked title="Where the formula comes from">
        {`      ⎡ a  b ⎤              ⎡  d  −b ⎤
A  =  ⎣ c  d ⎦        B  =  ⎣ −c   a ⎦

Multiply them and almost everything cancels:

              ⎡ ad − bc      0    ⎤
A B  =        ⎣    0     ad − bc  ⎦   =  (ad − bc) I

So dividing B by that number gives the inverse:

               1     ⎡  d  −b ⎤
A⁻¹  =     ────────  ⎣ −c   a ⎦      as long as ad − bc ≠ 0
            ad − bc`}
      </Worked>

      <Para>
        That number <strong>ad − bc</strong> is called the <strong>determinant</strong>. The formula divides by it. So
        if it comes out zero, there is no inverse at all. Change the numbers below and watch it break.
      </Para>

      <Lab>
        <InverseExplorer />
      </Lab>

      <Para>
        The <strong>transpose</strong> is a much simpler idea. Written <strong>Aᵀ</strong>, it just means tip the box
        over so the rows become columns. Hover a number to see where it lands.
      </Para>

      <Lab>
        <TransposeLab />
      </Lab>

      <Worked title="The rules worth knowing">
        {`(Aᵀ)ᵀ = A                    tip it twice, you are back
(A + B)ᵀ = Aᵀ + Bᵀ
(AB)ᵀ = Bᵀ Aᵀ                the order flips
(AB)⁻¹ = B⁻¹ A⁻¹             it flips here too

(A + B)⁻¹ ≠ A⁻¹ + B⁻¹        this one is just not true`}
      </Worked>

      <Para>
        Why does the order flip? Think about getting dressed. Socks first, then shoes. To undo it you take the shoes off
        first, then the socks. Last thing on, first thing off. Matrices work the same way.
      </Para>

      <Terms
        items={[
          { term: 'A⁻¹', say: 'A inverse', def: 'The undo matrix. Do A then A⁻¹ and nothing has changed.' },
          { term: 'Aᵀ', say: 'A transpose', def: 'The matrix tipped over. Row 1 becomes column 1.' },
          {
            term: 'determinant',
            def: 'One number squeezed out of a square matrix. If it is zero, the matrix flattens things and cannot be undone.',
          },
          { term: 'singular', def: 'The word for a square matrix with no inverse. Its determinant is zero.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  axb: (
    <>
      <Para>
        Here is the payoff for all that matrix work. Any system of linear equations can be written as one short line:{' '}
        <strong>Ax = b</strong>.
      </Para>
      <Para>Hover a row on either side below and its partner lights up. They are the same thing, written twice.</Para>

      <Lab>
        <SystemMatrixLab />
      </Lab>

      <Para>Here is what each letter is:</Para>
      <List
        items={[
          <>
            <strong>A</strong>{' '}holds the numbers in front of the unknowns. One row per equation.
          </>,
          <>
            <strong>x</strong>{' '}is the column of unknowns you are looking for.
          </>,
          <>
            <strong>b</strong>{' '}is the column of numbers on the right of the equals signs.
          </>,
        ]}
      />
      <Para>
        Check it against the multiplication rule from the last page. Row 1 of A meets the column x, which gives 2x₁ +
        3x₂ + 5x₃. And that has to equal 1. It is the same statement, just shorter.
      </Para>
      <Para>
        This is worth more than saved ink. Once a problem is written as Ax = b, everything you know about matrices
        applies to it. And when A is square and has an inverse, you can even write the answer down straight away as x =
        A⁻¹b.
      </Para>

      <Takeaway>
        Ax = b is the sentence the rest of the course is written in. Getting used to reading it is the job of this
        lecture.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  columns: (
    <>
      <Para>
        There is a second way to read Ax = b, and it explains a great deal more than the first one. Instead of reading
        across the rows, look down the <strong>columns</strong>{' '}of A.
      </Para>
      <Para>
        Multiplying A by x means this: take x₁ lots of the first column, plus x₂ lots of the second column, and so on.
        Then add them all up.
      </Para>

      <Worked title="Ax = b, read down the columns">
        {`⎡ 1  0   8  −4 ⎤             ⎡ 1 ⎤     ⎡ 0 ⎤     ⎡  8 ⎤     ⎡ −4 ⎤   ⎡ 42 ⎤
⎣ 0  1   2  12 ⎦  x  =  x₁ ⎣ 0 ⎦ + x₂ ⎣ 1 ⎦ + x₃ ⎣  2 ⎦ + x₄ ⎣ 12 ⎦ = ⎣  8 ⎦`}
      </Worked>

      <Para>
        So <strong>x is a recipe</strong>. Each unknown says how much of one column to use. Solving Ax = b means finding
        the mix of columns that lands exactly on b.
      </Para>
      <Para>
        Now the three outcomes stop being a rule to memorise. Below, the two coloured arrows are the columns. Press
        anywhere to move the red dot, or drag it. Then press <strong>Break it</strong>{' '}and see what happens when the two
        arrows line up.
      </Para>

      <Lab>
        <ColumnPictureChart />
      </Lab>

      <Para>
        If the columns point in genuinely different directions, they can between them reach anywhere. So every target
        has exactly one recipe.
      </Para>
      <Para>
        If they lie along the same line, they can only reach that line. A target off the line then has{' '}
        <strong>no</strong> recipe. A target on the line has <strong>endlessly many</strong>. Same three outcomes,
        looked at from a new angle.
      </Para>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'Scale some vectors and add them up. "3 of this one take away 2 of that one" is a linear combination.',
          },
          {
            term: 'span',
            def: 'Everything you can reach by mixing a set of vectors. Two arrows pointing different ways span the whole page. Two lined-up arrows span only a line.',
          },
          {
            term: 'overconstrained',
            def: 'More equations than unknowns. They usually disagree, so there is no exact answer. Linear regression is how people cope with this.',
          },
          {
            term: 'underconstrained',
            def: 'Fewer equations than unknowns. Freedom is left over, so you get endless answers.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  general: (
    <>
      <Para>
        When a system has endless answers you need a way to describe all of them at once. The lecture&rsquo;s method has
        two halves, and it is a clever one.
      </Para>
      <Para>
        <strong>Half one. Find any single answer.</strong>{' '}Just one. It does not have to be special. In the example from
        the last page the first two columns are (1, 0) and (0, 1), so reaching (42, 8) is easy: take 42 of the first, 8
        of the second, and none of the rest. That gives x = (42, 8, 0, 0). This is called the{' '}
        <strong>particular solution</strong>.
      </Para>
      <Para>
        <strong>Half two. Find every move that goes nowhere.</strong> Look for recipes that add up to{' '}
        <strong>zero</strong>. Adding one of those to your answer moves you nowhere at all, so what you get is still an
        answer.
      </Para>

      <Worked title="Recipes that land on zero">
        {`8·c₁ + 2·c₂ − 1·c₃ + 0·c₄ = 0     →   (8, 2, −1, 0)
−4·c₁ + 12·c₂ + 0·c₃ − 1·c₄ = 0    →   (−4, 12, 0, −1)

Put the two halves together:

        ⎡ 42 ⎤      ⎡  8 ⎤      ⎡ −4 ⎤
        ⎢  8 ⎥      ⎢  2 ⎥      ⎢ 12 ⎥
  x  =  ⎢  0 ⎥ + λ₁ ⎢ −1 ⎥ + λ₂ ⎢  0 ⎥      pick any λ₁ and λ₂
        ⎣  0 ⎦      ⎣  0 ⎦      ⎣ −1 ⎦

   one answer          moves that go nowhere`}
      </Worked>

      <Para>
        Below is a smaller version you can play with. The black dot is one answer someone spotted. The green arrow is a
        move that goes nowhere. Slide the dial and watch both equations stay true the whole time.
      </Para>

      <Lab>
        <SolutionSetLab />
      </Lab>

      <Para>
        That is the <strong>general solution</strong>: every answer the system has, written on one line. Pick any λ you
        like and you get a valid answer. And every valid answer comes from some choice of λ.
      </Para>
      <Para>
        Neither half is unique. A different easy answer would have done just as well for the first half. You would end
        up describing the same set of answers in a different way, like giving directions from a different starting
        point.
      </Para>

      <Terms
        items={[
          { term: 'particular solution', say: 'x p', def: 'Any one answer you managed to find. Just a foothold.' },
          {
            term: 'homogeneous system',
            def: 'Ax = 0. The same matrix, but with zero on the right. Its answers are the moves that change nothing.',
          },
          {
            term: 'general solution',
            def: 'One answer plus every move that goes nowhere. This is all the answers at once.',
          },
          {
            term: 'λ',
            say: 'lambda',
            def: 'A free dial. Set it to anything. Each setting gives a different valid answer.',
          },
        ]}
      />
      <Takeaway>All the answers = one answer you found + everything that adds up to nothing.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  moves: (
    <>
      <Para>
        Guessing the answer worked earlier only because the numbers were unusually tidy. For a messy system we need a
        method. The idea is to turn a messy matrix into a tidy one without changing what the answers are.
      </Para>
      <Para>
        There are exactly three moves that are safe. They are called <strong>elementary row operations</strong>, and the
        lecture numbers them ERO1, ERO2 and ERO3.
      </Para>

      <Worked title="The three moves">
        {`ERO1   Rᵢ ↔ Rⱼ                swap two rows

ERO2   Rₖ ← α Rₖ,  α ≠ 0     multiply a row by a number
                             (anything except zero)

ERO3   Rᵢ ← Rᵢ + β Rⱼ        add a multiple of one row
                             to another row`}
      </Worked>

      <Para>
        Why are they safe? Because each one is something you could do to the equations themselves. Swapping two rows
        just writes them in a different order. Multiplying a row by 3 turns &ldquo;x + y = 2&rdquo; into &ldquo;3x + 3y
        = 6&rdquo;, which says the same thing. And adding one equation to another is the trick from part 3.
      </Para>
      <Para>
        Here is the proof you can see. Press the buttons as much as you like. The lines swing all over the place. The
        red circle, which is the answer, never moves.
      </Para>

      <Lab>
        <CombineLab />
      </Lab>

      <Para>
        <strong>So why can the multiplier never be zero?</strong>{' '}Because multiplying a row by 0 turns it into &ldquo;0
        = 0&rdquo;. That is true, but it is no longer the equation you started with. You have thrown a rule away, and
        the system you are left with has more answers than the one you were asked about. The lab on the next page
        refuses to do it, and tells you why.
      </Para>

      <Takeaway>
        These three moves change how a system looks but never which values solve it. That is what makes the whole method
        allowed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  lab: (
    <>
      <Para>
        First, a shortcut in the writing. The letters x₁, x₂, x₃ just sit there in every line doing nothing. So drop
        them and keep the numbers where they are. Add a bar for the right-hand side and you get the{' '}
        <strong>augmented matrix</strong>. &ldquo;Augmented&rdquo; only means the answers column has been tacked on.
      </Para>

      <Worked title="The same system, shortened">
        {`x₁ + x₂ +  x₃ = 3          ⎡ 1   1   1 │ 3 ⎤
x₁ − x₂ + 2x₃ = 2          ⎢ 1  −1   2 │ 2 ⎥
     x₂ +  x₃ = 2          ⎣ 0   1   1 │ 2 ⎦`}
      </Worked>

      <Para>
        Now apply the three moves in a set order. Work down the columns. Use each pivot row to knock out everything
        below it. Do that and you always end up with a staircase of zeros. That procedure is{' '}
        <strong>Gaussian elimination</strong>.
      </Para>
      <Para>
        Below is the real thing, running on the lecture&rsquo;s own systems. Pick one, then press{' '}
        <strong>Next step</strong>{' '}over and over. Each press does exactly one of the three legal moves and writes it in
        the log.
      </Para>

      <Lab>
        <EliminationLab />
      </Lab>

      <Para>
        Keep an eye on the equations underneath the matrix. They change shape as you go, but the values that make them
        true never change. That is the point.
      </Para>
      <Para>
        Now try the <strong>No answer</strong>{' '}system and keep pressing. A row will turn into all zeros on the left with
        something that is not zero on the right. That row reads &ldquo;0 = 1&rdquo;. The method is telling you plainly
        that the equations contradict each other.
      </Para>
      <Para>
        Also try typing 0 into the scale box and pressing Do it. It will refuse, and say why. That is the question from
        the last page, answered by the tool.
      </Para>

      <Terms
        items={[
          {
            term: 'augmented matrix',
            def: 'The numbers from the equations, with the right-hand side tacked on after a bar.',
          },
          {
            term: 'Gaussian elimination',
            def: 'Using the three legal moves in a set order until the matrix is a tidy staircase.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  echelon: (
    <>
      <Para>
        The shape you are aiming for is called <strong>row-echelon form</strong>. Echelon is just a word for a staircase
        arrangement. A matrix is in this shape when two things are true:
      </Para>
      <List
        items={[
          <>any rows that are entirely zero have sunk to the bottom, and</>,
          <>
            in every other row, the first number that is not zero sits further right than the one in the row above it.
          </>,
        ]}
      />
      <Para>
        That first non-zero number in a row is called a <strong>pivot</strong>. Have a go at spotting them below. Click
        the ones you think are pivots, then press Check.
      </Para>

      <Lab>
        <PivotLab />
      </Lab>

      <Para>
        Once you have the staircase, the bottom row has the fewest unknowns in it. So you solve that one first and work
        upwards, putting each answer into the row above. That is called <strong>back substitution</strong>.
      </Para>
      <Para>The pivots also answer the &ldquo;how many answers?&rdquo; question directly:</Para>
      <List
        items={[
          <>
            A column <em>with</em> a pivot belongs to a <strong>basic variable</strong>. Its value gets forced.
          </>,
          <>
            A column <em>without</em> one belongs to a <strong>free variable</strong>. Nothing pins it down, so you pick
            it, and every choice gives a different answer.
          </>,
        ]}
      />

      <Worked title="Counting up">
        {`no free variables, no contradiction  →  exactly one answer
a row reading 0 = (not zero)         →  no answer
one or more free variables           →  endless answers,
                                        one free dial each`}
      </Worked>

      <Para>
        Go back to the lab on the last page and load <strong>The big one from the slides</strong>, then press Finish it.
        Two variables come out free. That is why that example ended up with two λ dials.
      </Para>

      <Terms
        items={[
          { term: 'pivot', def: 'The first number in a row that is not zero, once the matrix is a staircase.' },
          { term: 'basic variable', def: 'A variable whose column has a pivot. Its value is forced.' },
          { term: 'free variable', def: 'A variable whose column has no pivot. You choose it.' },
          {
            term: 'back substitution',
            def: 'Solve the bottom equation first, then feed that value into the one above, and so on upwards.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  rref: (
    <>
      <Para>
        You can keep going past the staircase. In <strong>reduced</strong>{' '}row-echelon form, two more things are true:
        every pivot has been scaled to <strong>1</strong>, and it is the only number that is not zero in its whole
        column. Not just below it, but above it too.
      </Para>
      <Para>
        This costs a few more moves and saves all the back substitution. The pivot columns end up looking exactly like
        the columns of the identity matrix, so each basic variable is just sitting there equal to a number.
      </Para>
      <Para>
        It also makes the &ldquo;moves that go nowhere&rdquo; from part 12 easy to read off. Click one of the orange
        columns below and watch the recipe build itself.
      </Para>

      <Lab>
        <NullspaceLab />
      </Lab>

      <Para>
        Each free column gives you one of these recipes. Together they describe everything that adds up to zero. Add
        them to any single answer and you have the general solution — the same two-half recipe as before, but now handed
        to you by the method instead of spotted by eye.
      </Para>

      <Takeaway>The tidiest form turns &ldquo;solve the system&rdquo; into &ldquo;read the system&rdquo;.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  recipe: (
    <>
      <Para>Stripped of all detail, Gaussian elimination is two sweeps. Step through them below.</Para>

      <Lab>
        <SweepLab />
      </Lab>

      <Para>
        <strong>Sweep one goes down.</strong>{' '}Use multiples of the first row to wipe out the first column below it. Then
        use the second row on the second column, and so on. You end up with an <strong>upper-triangular</strong>{' '}matrix,
        which just means everything below the diagonal is zero.
      </Para>
      <Para>
        <strong>Sweep two goes up.</strong>{' '}Use the last row to wipe out its column above, then the row before it, and
        so on. Now only the diagonal is left. Scale each pivot to 1 and you have the identity.
      </Para>
      <Para>
        Every move in both sweeps is one of the three legal ones. So the answers were never at risk at any point. That
        is the entire reason this method is allowed to work, and it is worth saying out loud because it is easy to lose
        sight of while you are busy doing arithmetic.
      </Para>

      <Terms
        items={[
          {
            term: 'upper triangular',
            def: 'Everything below the diagonal is zero. The result of the downward sweep.',
          },
          {
            term: 'diagonal',
            def: 'The slots running from the top-left corner to the bottom-right one.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  invert: (
    <>
      <Para>
        Here is a neat trick the lecture finishes on. Suppose you want A⁻¹. It turns out the same method gives it to
        you, with no extra ideas needed.
      </Para>
      <Para>
        Each column of A⁻¹ is the answer to a little system: solve Ax = e, where e is a column of the identity matrix —
        all zeros except a single 1. The answer x you get is one column of A⁻¹.
      </Para>
      <Para>
        So finding an inverse is really several separate systems, all sharing the same A. And because they share A, the
        row moves you need are the same for all of them. So do them all at once: put A on the left, the whole identity
        on the right, and run the method.
      </Para>

      <Lab>
        <InverseByElimination />
      </Lab>

      <Worked title="What just happened">
        {`start with     [ A │ I ]

run Gaussian elimination until the left half is I

finish with    [ I │ A⁻¹ ]`}
      </Worked>

      <Para>
        When A has an inverse, the tidied-up form of A <em>is</em>{' '}the identity. Every column earns a pivot. If the
        method stalls and some column never gets one, then A has no inverse.
      </Para>
      <Para>
        Which is the same thing the determinant told you back in part 9, arrived at by a completely different road. Set
        the bottom row of A to something that makes the determinant zero and try running it.
      </Para>

      <Takeaway>
        One method — three legal moves in a set order — answers &ldquo;solve this&rdquo;, &ldquo;how many answers are
        there&rdquo;, and &ldquo;what is the inverse&rdquo;.
      </Takeaway>
    </>
  ),
}
