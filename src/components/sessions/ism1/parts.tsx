/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { CentreLab, VarianceLab } from '@/components/charts/stats-centre-lab'
import { CourseMapLab, DataTypeSorter, MeasurementLevelLab } from '@/components/charts/stats-sorting-lab'
import { BoxPlotLab, QuartileLab, SampleSizeLab } from '@/components/charts/stats-spread-lab'
import { Para, Takeaway, Terms, Worked } from '../session-parts'

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

export const ISM1_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  course: (
    <>
      <Para>
        Statistics is a branch of applied maths. It is also the backbone of data science and machine learning, which is
        why this course sits early in the programme.
      </Para>
      <Para>Put simply, statistics is the science of five steps:</Para>
      <List
        items={[
          <>
            <strong>Collect</strong> the data.
          </>,
          <>
            <strong>Organise</strong> it so you can see what you have.
          </>,
          <>
            <strong>Analyse</strong> it.
          </>,
          <>
            <strong>Infer</strong> — work out what it is telling you about the wider world.
          </>,
          <>
            <strong>Decide</strong> something, based on all of that.
          </>,
        ]}
      />
      <Para>
        That last step is the point of the whole thing. Statistics is decision-making driven by data rather than by
        opinion.
      </Para>
      <Para>Here is the shape of the course, and how it is marked.</Para>

      <Lab>
        <CourseMapLab />
      </Lab>

      <Para>The three books the course leans on:</Para>
      <Worked title="Reading list">
        {`T1  Statistics for Data Scientists: An Introduction to Probability,
    Statistics and Data Analysis — Kaptein et al, Springer 2022

T2  Probability and Statistics for Engineering and the Sciences,
    8th edition — Jay L. Devore, Cengage

T3  Introduction to Time Series and Forecasting, 2nd edition
    — Brockwell and Davis, Springer`}
      </Worked>

      <Para>
        This lecture is the first session of module 1. It covers measures of centre, measures of spread, symmetric and
        skewed data, the five-point summary, and how to spot an outlier. The books to reach for are T1 and T2.
      </Para>

      <Takeaway>
        Statistics is not sums for their own sake. Every technique here exists to help somebody make a decision without
        guessing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  types: (
    <>
      <Para>
        Before you calculate anything, ask what kind of data you have. Get this wrong and you will happily work out the
        average of something that has no average.
      </Para>
      <Para>The first split is into two kinds.</Para>
      <List
        items={[
          <>
            <strong>Categorical</strong>, also called qualitative. The value is a label or a group. Marital status,
            political party, eye colour. You can count how many fall in each group, but you cannot add them up.
          </>,
          <>
            <strong>Numerical</strong>, also called quantitative. The value is a number that means something as a
            number.
          </>,
        ]}
      />
      <Para>Numerical data then splits again.</Para>
      <List
        items={[
          <>
            <strong>Discrete</strong> — things you <em>count</em>. Number of children, defects per hour. The possible
            answers are separate whole numbers with nothing in between.
          </>,
          <>
            <strong>Continuous</strong> — things you <em>measure</em>. Weight, voltage, time. Between any two possible
            values there is always another one.
          </>,
        ]}
      />
      <Para>Have a go at sorting these. You find out straight away, and the reason is the part worth reading.</Para>

      <Lab>
        <DataTypeSorter />
      </Lab>

      <Para>
        One trap catches nearly everyone. Software often stores categories as numbers — party 1, party 2, party 3 — so
        the column looks numerical. It is not. Averaging it gives you a number, and that number means nothing at all.
      </Para>

      <Terms
        items={[
          {
            term: 'categorical',
            say: 'qualitative',
            def: 'The value is the name of a group. You count how many are in each group.',
          },
          { term: 'numerical', say: 'quantitative', def: 'The value is a number that behaves like a number.' },
          { term: 'discrete', def: 'Counted. Whole numbers with gaps between them.' },
          { term: 'continuous', def: 'Measured. Always another value between any two.' },
        ]}
      />
      <Takeaway>Count it and it is discrete. Measure it and it is continuous. Neither, and it is categorical.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  levels: (
    <>
      <Para>
        The categorical-or-numerical split is the quick version. The fuller version has four{' '}
        <strong>levels of measurement</strong>, each one adding something the level before it did not have.
      </Para>
      <List
        items={[
          <>
            <strong>Nominal</strong> — the lowest level. Names of groups, no order. Gender, marital status, which party
            someone voted for.
          </>,
          <>
            <strong>Ordinal</strong> — there is an order, but the gaps are not measurable. Satisfied / neutral /
            unsatisfied. Grades A to F. Gold, silver, bronze. You know which is better; you cannot say by how much.
          </>,
          <>
            <strong>Interval</strong> — the gaps are real and equal, but zero does not mean “none”. Temperature in
            Celsius. 20° to 30° is the same jump as 30° to 40°, but 0°C is not the absence of temperature, so 40°C is
            not twice as hot as 20°C.
          </>,
          <>
            <strong>Ratio</strong> — the highest level. Gaps are real <em>and</em> zero means none. Weight, age, salary.
            Now ratios finally work: 40 kg really is twice 20 kg.
          </>,
        ]}
      />
      <Para>Try a few. The three questions in the note at the bottom will get you through any of them.</Para>

      <Lab>
        <MeasurementLevelLab />
      </Lab>

      <Para>
        Why does this matter? Because the level decides what you are allowed to work out. You can find the mode of
        anything. You can find the median of anything ordered. But the mean needs equal gaps, so it needs interval or
        ratio data. Taking the mean of a satisfaction rating is very common and not really allowed.
      </Para>

      <Terms
        items={[
          { term: 'nominal', def: 'Names only. No order. Mode is the only measure of centre that works.' },
          { term: 'ordinal', def: 'Ordered, but the gaps are not measurable. Median works, mean does not really.' },
          { term: 'interval', def: 'Equal, meaningful gaps, but no true zero. Mean works; ratios do not.' },
          { term: 'ratio', def: 'Equal gaps and a true zero. Everything works.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  mean: (
    <>
      <Para>
        The <strong>mean</strong> is the ordinary average. Add all the values up and divide by how many there are.
        Written down it is <strong>x̄ = Σx / n</strong>, where the bar over the x means “mean of” and the Σ means “add
        up”.
      </Para>
      <Para>
        The best way to think about it is as a <strong>balance point</strong>. Imagine the values as weights sitting on
        a plank. The mean is the spot where the plank balances. Drag a dot below and watch the triangle move.
      </Para>

      <Lab>
        <CentreLab focus="mean" />
      </Lab>

      <Para>
        Look at the read-out marked “distances add up to”. It stays at zero no matter what you do. That is not a
        coincidence — it is what being a balance point means. The values above the mean pull exactly as hard as the ones
        below it.
      </Para>
      <Para>
        This also explains the mean’s weakness. Drag one dot right to the end of the line. The mean follows it, because
        that one value now pulls with a very long lever. A single extreme value can shift the mean a long way.
      </Para>
      <Para>
        When values come with counts rather than one at a time, the formula grows an f for frequency. Same idea: each
        value counts as many times as it happened.
      </Para>

      <Worked title="The mean when values repeat — hours of TV per day">
        {`Hours (Y)   Frequency (f)   f × Y
   1            104            104
   2            130            260
   3             98            294
              -----          -----
  Total         332            658

x̄ = Σ(f·Y) / N = 658 / 332 = 1.98 hours`}
      </Worked>

      <Para>
        <strong>When to use the mean.</strong> When the data is numerical with no wild values in it, when it is interval
        or ratio level, and when you plan to work out a standard deviation afterwards — because that is built on the
        mean.
      </Para>

      <Terms
        items={[
          { term: 'x̄', say: 'x bar', def: 'The mean of a sample.' },
          { term: 'Σ', say: 'sigma', def: 'Add up everything that follows.' },
          { term: 'f', say: 'frequency', def: 'How many times a value turned up.' },
          { term: 'balance point', def: 'The spot where the distances either side cancel out. That is the mean.' },
        ]}
      />
      <Takeaway>The mean uses every value, which makes it stable — and lets one wild value drag it about.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  mode: (
    <>
      <Para>
        The <strong>mode</strong> is the simplest of the three. It is the value that turns up most often. Nothing is
        added, nothing is divided — you just count.
      </Para>

      <Worked title="Server failures per day, over two weeks">
        {`1  3  0  3  26  2  7  4  2  3  3  6  3

3 turns up five times. Nothing else turns up more than twice.

So the mode is 3: the most common outcome is three failures in a day.`}
      </Worked>

      <Para>Drag the dots below and watch the amber marker jump to whichever value has the tallest pile.</Para>

      <Lab>
        <CentreLab focus="mode" start="even" />
      </Lab>

      <Para>Three things to know about it.</Para>
      <List
        items={[
          <>
            <strong>It works on anything</strong>, including categorical data. The most common eye colour is a perfectly
            good mode. There is no mean eye colour.
          </>,
          <>
            <strong>It might not be unique.</strong> Two values can tie. Data with two peaks is called <em>bimodal</em>,
            and with more, <em>multi-modal</em>. Try to make that happen above.
          </>,
          <>
            <strong>Extreme values do not touch it.</strong> That 26 in the server data is way out on its own, and the
            mode does not care at all.
          </>,
        ]}
      />
      <Para>
        Use the mode when your data is nominal, or when the decision you are making genuinely turns on what happens most
        often — how many spare parts to stock, which size to make most of.
      </Para>

      <Terms
        items={[
          { term: 'mode', def: 'The value that turns up most often.' },
          {
            term: 'bimodal',
            def: 'Two values tie for most common. Often a sign that two different groups got mixed together.',
          },
          { term: 'multi-modal', def: 'More than two peaks.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  median: (
    <>
      <Para>
        The <strong>median</strong> is the value that splits the data in half. Half the values are below it and half are
        above. To find it, put everything in order and take the middle one.
      </Para>
      <List
        items={[
          <>
            <strong>Odd number of values:</strong> the median is the middle one.
          </>,
          <>
            <strong>Even number of values:</strong> there is no single middle, so take the two middle ones and average
            them.
          </>,
        ]}
      />

      <Worked title="Both rules, from the slides">
        {`Seven fund returns, in order:
   19.0  20.8  22.3  22.4  24.9  26.0  29.9
                      ↑
   Seven values, so the 4th is the middle:  median = 22.4


Ten getting-ready times, in order:
   29  31  35  39  39  40  43  44  44  52
                   ↑   ↑
   Ten values, so average the 5th and 6th:
   (39 + 40) / 2 = 39.5`}
      </Worked>

      <Para>
        Now here is the thing worth seeing rather than reading. Drag the right-hand dot as far right as it goes. The
        mean chases it across the screen. The median moves by one small step, or not at all.
      </Para>

      <Lab>
        <CentreLab focus="median" />
      </Lab>

      <Para>
        Why? Because the median only cares about <em>order</em>, not size. Making the biggest value ten times bigger
        does not change which value is in the middle. That is what people mean when they call the median{' '}
        <strong>robust</strong>.
      </Para>
      <Para>
        This is why house prices and salaries are almost always reported as medians. A handful of enormous values would
        make the mean describe nobody.
      </Para>
      <Para>
        The median is also known as the <strong>50th percentile</strong>, or the middle quartile. That name comes back
        in part 12.
      </Para>

      <Terms
        items={[
          { term: 'median', def: 'The middle value once everything is in order. Half below, half above.' },
          { term: 'robust', def: 'Barely affected by a few extreme values.' },
          { term: '50th percentile', def: 'Another name for the median. 50% of the data sits below it.' },
        ]}
      />
      <Takeaway>The mean asks how big the values are. The median only asks what order they are in.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  shape: (
    <>
      <Para>
        Now that you have three measures of centre, comparing them tells you something new: which way the data leans.
        This is called the <strong>shape</strong>, or the skew.
      </Para>
      <List
        items={[
          <>
            <strong>Symmetric</strong> — the two sides match. Mean = median = mode, all in the same place.
          </>,
          <>
            <strong>Skewed to the right</strong> (also called positively skewed) — a long tail stretching right. A few
            big values pull the mean up past the median. So{' '}
            <strong>
              mean {'>'} median {'>'} mode
            </strong>
            .
          </>,
          <>
            <strong>Skewed to the left</strong> (negatively skewed) — a long tail stretching left. A few small values
            pull the mean down. So{' '}
            <strong>
              mean {'<'} median {'<'} mode
            </strong>
            .
          </>,
        ]}
      />
      <Para>
        Press the preset buttons below and watch the three markers separate and swap order. The order they end up in is
        the skew.
      </Para>

      <Lab>
        <CentreLab focus="shape" start="right" />
      </Lab>

      <Para>
        There is a rough rule of thumb the lecture mentions, for data that is not too badly skewed:{' '}
        <strong>mode ≈ 3 × median − 2 × mean</strong>. It is an <em>empirical</em> relationship, which means people
        noticed it holds in practice rather than proving it must. Do not lean on it too hard.
      </Para>
      <Para>
        The practical advice that follows from all this: use the <strong>mean</strong> for data that is roughly even,
        and the <strong>median</strong> when it is badly skewed. And always say which one you used.
      </Para>

      <Terms
        items={[
          { term: 'skew', def: 'How lopsided the data is. Named for the side the long tail is on.' },
          {
            term: 'right-skewed',
            say: 'positively skewed',
            def: 'Long tail to the right. Mean sits above the median.',
          },
          { term: 'left-skewed', say: 'negatively skewed', def: 'Long tail to the left. Mean sits below the median.' },
          {
            term: 'empirical',
            def: 'Noticed from observation rather than proved from theory. Usually true, not always.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  notenough: (
    <>
      <Para>Here is the moment the lecture turns. Look at these two groups of nine numbers.</Para>

      <Worked title="Two groups from the slides">
        {`Group 1:   2   8   5   3   7   8   5   2   5      total 45
Group 2:   1  15   5   5   6   3   5   2   3      total 45

           Group 1     Group 2
  mean         5           5
  median       5           5
  mode         5           5`}
      </Worked>

      <Para>
        Every measure of centre agrees. By all three, these groups are identical. But look at the numbers. Group 2 has a
        1 and a 15 in it. Group 1 never leaves the range 2 to 8. They are clearly not the same at all.
      </Para>
      <Para>
        So the centre alone is not enough. You need a second number saying <strong>how spread out</strong> the values
        are. Press the two buttons below and watch the squares change size while the mean line stays exactly where it
        is.
      </Para>

      <Lab>
        <VarianceLab />
      </Lab>

      <Para>
        Group 1 comes out with a sum of squares of 44. Group 2 comes out with 134 — three times as much, from the same
        centre. That number is what the rest of this lecture is about building properly.
      </Para>
      <Para>The measures of spread you will meet:</Para>
      <List
        items={[
          <>
            The <strong>range</strong> — biggest take smallest.
          </>,
          <>
            The <strong>variance</strong> and the <strong>standard deviation</strong>.
          </>,
          <>
            The <strong>quartile deviation</strong>, built from the middle half of the data.
          </>,
        ]}
      />
      <Para>
        Spread does two jobs. It describes the data in its own right, and it tells you how much to trust the centre. A
        mean of 5 with a tiny spread is a genuinely useful summary. The same mean with a huge spread describes almost
        nobody in the set.
      </Para>

      <Takeaway>
        Always report a measure of centre and a measure of spread together. Either one on its own can mislead.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  range: (
    <>
      <Para>
        The <strong>range</strong> is the simplest measure of spread there is. Take the largest value and subtract the
        smallest.
      </Para>

      <Worked title="A quick one">
        {`Values:  7  2  7  6  5  6  2

largest = 7,  smallest = 2

range = 7 − 2 = 5`}
      </Worked>

      <Para>
        It is quick and it is easy to explain, which is why it turns up so often. But it has a real problem: it uses
        only two of your values and throws the rest away.
      </Para>
      <Para>
        Try it below. Drag one of the end dots outwards and the range jumps immediately, even though nothing about the
        other seven values has changed. That makes it an unreliable measure — it is built entirely out of the two values
        most likely to be odd.
      </Para>

      <Lab>
        <BoxPlotLab datasets={['ordered', 'chickenFat']} />
      </Lab>

      <Para>
        The panel shows the range’s more careful cousin as well: the <strong>IQR</strong>, which is the spread of the
        middle half only. Drag an end dot far out and watch the two react completely differently. The range leaps. The
        IQR sits still.
      </Para>
      <Para>
        For continuous data, textbooks sometimes define the range using the real limits of the end classes rather than
        the recorded values. That is a refinement, not a different idea.
      </Para>

      <Terms
        items={[
          { term: 'range', def: 'Largest minus smallest. Uses two values and ignores everything in between.' },
          {
            term: 'real limits',
            def: 'For measured data, the true edges of the interval a recorded value stands for. 7 recorded to the nearest whole number means anything from 6.5 to 7.5.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  variance: (
    <>
      <Para>
        We want a measure of spread that uses <em>every</em> value, not just the two ends. The obvious idea is to
        measure how far each value is from the mean, then average those distances.
      </Para>
      <Para>
        That obvious idea does not work. You met the reason in part 4: the distances from the mean always add up to
        zero. Averaging them gives you zero every single time, for every dataset. Useless.
      </Para>

      <Worked title="Why the obvious idea fails">
        {`Values:  2  8  5  3  7  8  5  2  5      mean = 5

distances:  −3  +3   0  −2  +2  +3   0  −3   0

add them up:  0        ← every time, for any data`}
      </Worked>

      <Para>So we need a new plan. The one statistics settled on has three steps:</Para>
      <List
        items={[
          <>
            <strong>Square</strong> each distance. Squaring makes everything positive, so nothing cancels.
          </>,
          <>
            <strong>Add</strong> the squares up. That total is called the <strong>sum of squares</strong>, or SS.
          </>,
          <>
            <strong>Average</strong> them. That average is the <strong>variance</strong>.
          </>,
        ]}
      />
      <Para>
        Below, every squared distance is drawn as an actual square. Drag a dot away from the dashed mean line and watch
        its square swell. Move it twice as far and the square gets four times as big.
      </Para>

      <Lab>
        <VarianceLab />
      </Lab>

      <Para>
        That growth is the point, and it is also the catch. Squaring means a value far from the mean counts for far more
        than one nearby. Hover a dot and the tooltip shows what share of the total it is responsible for. One extreme
        value can easily own most of the answer.
      </Para>
      <Para>
        There is one more problem. Variance is measured in <em>squared</em> units. If your data is in minutes, the
        variance is in square minutes, which is not a thing anybody can picture. So take the square root and get back to
        ordinary units. That is the <strong>standard deviation</strong>.
      </Para>

      <Worked title="The two formulas">
        {`sum of squares      SS = Σ(x − x̄)²

variance            s² = SS / (n − 1)

standard deviation  s  = √( SS / (n − 1) )`}
      </Worked>

      <Para>
        The standard deviation is the one to report. It answers a question people can actually picture: roughly how far
        is a typical value from the average?
      </Para>

      <Terms
        items={[
          { term: 'deviation', def: 'How far one value is from the mean. Can be positive or negative.' },
          { term: 'sum of squares (SS)', def: 'Every deviation squared, then added up.' },
          { term: 'variance', def: 'The average squared deviation. In squared units, so hard to picture.' },
          {
            term: 'standard deviation',
            def: 'The square root of the variance. Back in ordinary units, so you can picture it.',
          },
        ]}
      />
      <Takeaway>
        Square the distances so they stop cancelling, average them, then square-root it to get back to sensible units.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  sample: (
    <>
      <Para>
        You will see two versions of the variance formula, and the only difference is what sits on the bottom.
      </Para>

      <Worked title="The two versions">
        {`whole population       σ² = SS / N        σ = √(SS / N)

a sample from it       s² = SS / (n − 1)  s = √(SS / (n − 1))`}
      </Worked>

      <Para>
        The notation changes too: Greek σ for a population, Latin s for a sample. That is a useful habit — the letter
        tells you which situation you are in.
      </Para>
      <Para>
        The question everybody asks is why a sample divides by n − 1. The honest answer is that dividing by n gives an
        answer that is <strong>too small</strong>, and you can watch it happen.
      </Para>

      <Lab>
        <SampleSizeLab />
      </Lab>

      <Para>
        Take twenty or thirty samples and look at the two percentages. The n version sits stubbornly below the true
        value. The n − 1 version wobbles about it and settles on it.
      </Para>
      <Para>
        Here is why. When you measure spread in a sample, you measure it around the <em>sample’s own</em> mean — because
        you do not know the real one. But the sample’s mean has already shifted itself to sit right in the middle of
        those particular values. So they look closer together than they truly are. Dividing by n − 1 rather than n makes
        the answer slightly bigger, which makes up the difference.
      </Para>
      <Para>
        Notice how the size of the correction depends on the sample. At n = 2, dividing by n is out by about half. At n
        = 20 it is out by about 5%. With a large sample it barely matters — but with a small one it matters a great
        deal, and small samples are exactly when people reach for this formula.
      </Para>
      <Para>
        Once you have the mean and the standard deviation, you have described a whole distribution with just two
        numbers. That pair is the workhorse of descriptive statistics.
      </Para>

      <Terms
        items={[
          {
            term: 'population',
            say: 'N',
            def: 'Every member of the group you care about. Usually too big to measure.',
          },
          { term: 'sample', say: 'n', def: 'The part of it you actually measured.' },
          { term: 'σ', say: 'sigma', def: 'Population standard deviation. σ² is the population variance.' },
          { term: 's', def: 'Sample standard deviation. s² is the sample variance.' },
          {
            term: 'biased estimate',
            def: 'One that is systematically too big or too small. Dividing by n instead of n − 1 gives one.',
          },
        ]}
      />
      <Takeaway>
        A sample hugs its own mean too closely. Dividing by n − 1 instead of n corrects for that, and the smaller the
        sample the more it matters.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  fivepoint: (
    <>
      <Para>
        The median splits the data in half. Split each half again and you get <strong>quartiles</strong> — three cuts
        that divide the data into four equal parts.
      </Para>
      <List
        items={[
          <>
            <strong>Q1</strong>, the first quartile: 25% of the data is below it.
          </>,
          <>
            <strong>Q2</strong>: that is just the median. 50% below.
          </>,
          <>
            <strong>Q3</strong>, the third quartile: 75% below.
          </>,
        ]}
      />
      <Para>
        Put those together with the smallest and largest values and you have the <strong>five-point summary</strong>:
        minimum, Q1, median, Q3, maximum. Five numbers that describe a whole dataset, and the basis of the box plot in
        the next part.
      </Para>
      <Para>
        Finding a quartile means finding a <em>position</em> first, then reading off the value there. The lecture counts
        positions like this:
      </Para>

      <Worked title="The counting rule">
        {`position of Q1     = 1 × (n + 1) / 4
position of median = 2 × (n + 1) / 4
position of Q3     = 3 × (n + 1) / 4`}
      </Worked>

      <Para>
        If a position comes out as a whole number, take the value sitting there. If it lands between two positions, take
        the value part-way between them. Below, the positions are shown being counted out on the data itself.
      </Para>

      <Lab>
        <QuartileLab />
      </Lab>

      <Para>
        Worth a warning: there is more than one quartile rule in use, and different software gives slightly different
        answers. The one above is the one taught here, so use it and your homework will match.
      </Para>

      <Terms
        items={[
          { term: 'quartile', def: 'One of three cuts that split ordered data into four equal parts.' },
          { term: 'Q1', def: 'The 25% mark. A quarter of the values are below it.' },
          { term: 'Q3', def: 'The 75% mark. Three quarters are below it.' },
          { term: 'five-point summary', def: 'Minimum, Q1, median, Q3, maximum.' },
          { term: 'percentile', def: 'The same idea with 100 cuts instead of 4. Q1 is the 25th percentile.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  boxplot: (
    <>
      <Para>
        The gap between the two outer quartiles is the <strong>interquartile range</strong>, or IQR.
      </Para>

      <Worked title="IQR, worked through on the lecture's example">
        {`Data in order:   11  12  13  16  16  17  17  18  21      n = 9

position of Q1 = 1 × (9 + 1) / 4 = 2.50  →  halfway between 12 and 13  →  Q1 = 12.5
position of Q3 = 3 × (9 + 1) / 4 = 7.50  →  halfway between 17 and 18  →  Q3 = 17.5

IQR = Q3 − Q1 = 17.5 − 12.5 = 5

QD  = IQR / 2 = 2.5`}
      </Worked>

      <Para>
        The IQR is sometimes called the <strong>mid-spread</strong>, because it measures the middle 50% of the data and
        completely ignores the ends. That is its whole advantage: extreme values cannot touch it.
      </Para>
      <Para>
        Now draw all of this as a picture and you get a <strong>box and whisker plot</strong>. The box runs from Q1 to
        Q3, with a line at the median. The whiskers reach out to the furthest values that are still normal.
      </Para>
      <Para>
        “Still normal” needs a definition, and here it is. Put up two <strong>fences</strong>:
      </Para>

      <Worked title="The outlier rule">
        {`lower fence = Q1 − 1.5 × IQR
upper fence = Q3 + 1.5 × IQR

Anything outside those is flagged as a possible outlier.

On the example above:
  lower = 12.5 − 7.5 = 5
  upper = 17.5 + 7.5 = 25

Every value sits between 5 and 25, so that data has no outliers.`}
      </Worked>

      <Para>
        Drag a dot past a red fence below. It turns red. And watch the fences themselves shift as you drag, because they
        are worked out from the data you are changing.
      </Para>

      <Lab>
        <BoxPlotLab />
      </Lab>

      <Para>
        Some books add a second, wider pair of fences at 3 × IQR and call anything beyond those a <strong>major</strong>{' '}
        or extreme outlier, with the ones between 1.5 and 3 called mild.
      </Para>
      <Para>
        One important point. A flagged value is a <em>possible</em> outlier, not a mistake. It might be a typo, or a
        broken sensor — or it might be the most interesting thing in your data. The rule tells you where to look. It
        does not tell you what to do.
      </Para>

      <Terms
        items={[
          { term: 'IQR', def: 'Q3 − Q1. The spread of the middle half of the data.' },
          { term: 'quartile deviation', say: 'QD', def: 'The IQR halved.' },
          { term: 'mid-spread', def: 'Another name for the IQR.' },
          { term: 'fence', def: 'The cut-off at 1.5 × IQR beyond each quartile. Outside it, a value gets flagged.' },
          { term: 'outlier', def: 'A value far from the rest. Worth investigating, not automatically deleting.' },
        ]}
      />
      <Takeaway>
        The box is the middle half. The whiskers are everything else that looks normal. The dots beyond them are what
        you go and check.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  practice: (
    <>
      <Para>
        The lecture ends with four practice questions. All four datasets are loaded below, so you can work each one out
        by hand and then check yourself.
      </Para>
      <List
        items={[
          <>
            <strong>Q1</strong> — noise levels for 77 people in an office. Find the mean, standard deviation, variance
            and IQR, draw the box plot, and comment on any outliers.
          </>,
          <>
            <strong>Q2</strong> — fat in grams for 20 chicken sandwiches. Find the mean, median, Q1 and Q3, then the
            variance, standard deviation, range and IQR. Any outliers? Is it skewed, and which way?
          </>,
          <>
            <strong>Q3</strong> — battery life in shots for 12 cameras. List the five-point summary.
          </>,
          <>
            <strong>Q4</strong> — a set of 20 scores. Work out the quartiles and the IQR, give the five-point summary,
            find any outliers, and draw the box plot.
          </>,
        ]}
      />
      <Para>Pick a dataset on the right. Everything updates, and you can still drag a dot to see what changes.</Para>

      <Lab>
        <BoxPlotLab datasets={['noise', 'chickenFat', 'battery', 'scores']} />
      </Lab>

      <Para>Some things to notice as you work through them.</Para>
      <List
        items={[
          <>
            The <strong>chicken sandwich</strong> data has a 56 sitting well above everything else. Look at what it does
            to the mean compared with the median, and which way that says the data is skewed.
          </>,
          <>
            The <strong>battery</strong> data has only 12 values with a huge range, from 35 to 460. A big range with a
            modest IQR is a strong hint that the ends are doing all the work.
          </>,
          <>
            The <strong>20 scores</strong> cluster tightly around 80, with a 45 and a 48 well below. See whether the
            fences catch them.
          </>,
          <>
            The <strong>noise</strong> data has 77 values and no outliers at all. Real measurements often look like
            this, and it is worth seeing so that flagged values do not start to feel normal.
          </>,
        ]}
      />

      <Takeaway>
        For any dataset, the same five questions: where is the middle, how spread out is it, which way does it lean, is
        anything out on its own, and which measure should you report?
      </Takeaway>
    </>
  ),
}
