'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These five come
 * out of ISM lectures 1 and 2, and each one links back to the chapter part it
 * was lifted from.
 */
import { SampleSpaceLab } from '@/components/charts/prob-space-lab'
import { ConvergeLab, VennLab } from '@/components/charts/prob-venn-lab'
import { CentreLab, VarianceLab } from '@/components/charts/stats-centre-lab'
import { BoxPlotLab } from '@/components/charts/stats-spread-lab'
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

/* ========================================================================== */

export function CentreConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Averages: mean, median and mode"
        intro="“What is the average?” has three different answers, and they often disagree. Knowing which one to reach for — and which one somebody else reached for — is most of the skill."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Suppose ten people are in a room and you want one number that describes their salaries. You could add them
            all up and divide by ten. You could line them up and take the middle one. Or you could say which salary
            comes up most often. Three sensible ideas, three different numbers.
          </>,
          <>
            Now let Jeff Bezos walk in. The <strong>mean</strong> leaps to something no one in the room earns. The{' '}
            <strong>median</strong> shifts by one person. That single difference is why news reports quote median house
            prices and median incomes, and why an average that sounds odd is worth asking about.
          </>,
        ]}
        mappings={[
          { title: 'Mean', body: 'Add everything, divide by how many. Uses every value, so every value can pull it.' },
          {
            title: 'Median',
            body: 'Line them up, take the middle. Only cares about order, so extremes barely move it.',
          },
          {
            title: 'Mode',
            body: 'The most common value. The only one that works when the data is not numbers at all.',
          },
        ]}
        footnote="Drag one dot to the far right below. The mean chases it across the screen. The median takes one small step. That single picture is the whole concept."
      />

      <div className="my-6">
        <CentreLab />
      </div>

      <Explainers
        plain="The mean is a balance point: the distances either side of it always cancel out. The median is a position: half the values are below it. The mode is a count: the value that turns up most. Because they measure different things, comparing them tells you the shape of the data."
        breaks="The mean breaks on skewed data and on anything with an extreme value in it. The mode breaks when everything appears once, or when two values tie. And the mean breaks completely on ordinal data — averaging “satisfied, neutral, unsatisfied” coded as 3, 2, 1 gives a number that means nothing, which does not stop people doing it."
      >
        <MathBlock
          intro="Three definitions and one property. The property is the one worth remembering."
          formulas={[
            { formula: 'x̄ = Σx / n', reading: 'The mean. Add everything up, divide by how many there are.' },
            {
              formula: 'x̄ = Σ(f·x) / N',
              reading: 'The same when values come with counts: multiply each value by how often it happened.',
            },
            {
              formula: 'median = middle value in order',
              reading: 'Odd n, take the middle. Even n, average the two middle ones.',
            },
            {
              formula: 'Σ(x − x̄) = 0',
              reading:
                'The distances from the mean always cancel. That is what makes it a balance point — and why measuring spread needs a different trick.',
            },
            {
              formula: 'mean > median > mode ⇒ tail to the right',
              reading: 'Reverse it for a left tail. All three in the same place means the data is even.',
            },
          ]}
          legend={[
            { sym: 'x̄', name: 'The mean', note: 'Said "x bar".', val: 'the triangle on the chart' },
            { sym: 'Σ', name: 'Add up', note: 'Said "sigma".', val: 'used in both means' },
            { sym: 'f', name: 'Frequency', note: 'How many times a value turned up.', val: 'for grouped data' },
            { sym: 'n', name: 'How many values', note: 'The size of your set.', val: 'shown in the panel' },
            {
              sym: 'median',
              name: 'The middle',
              note: 'Also called the 50th percentile, or Q2.',
              val: 'the teal line',
            },
            { sym: 'mode', name: 'The most common', note: 'Can be none, one, or several.', val: 'the amber line' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Filling in missing values',
            how: 'Gaps get filled with the mean for tidy numeric columns, the median when the column is skewed, and the mode for categories. Choosing wrong quietly shifts your data.',
          },
          {
            what: 'The mean is what most models predict',
            how: 'Fit a model with squared error and it learns to predict the mean of the target. Fit it with absolute error and it learns the median instead — that is the whole difference between the two losses.',
          },
          {
            what: 'Centring is step one of standardising',
            how: 'Nearly every pipeline subtracts the mean from each feature before doing anything else.',
          },
          {
            what: 'Mode collapse is named after this',
            how: 'When a generative model keeps producing the same handful of outputs, it has collapsed onto a few modes of the data instead of covering it.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism1/mean', label: 'ISM Lecture 1 · The mean' },
          { href: '/session/ism1/median', label: 'The median' },
          { href: '/session/ism1/mode', label: 'The mode' },
          { href: '/session/ism1/shape', label: 'Symmetric and skewed' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function SpreadConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Spread: how far apart the numbers are"
        intro="An average on its own can describe nobody. Two sets of numbers can share a mean, a median and a mode and still have nothing in common. The second number you always need is how spread out they are."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Two rivers both have an average depth of one metre. One is a metre deep the whole way across. The other is
            ankle-deep at the edges and four metres in the middle. The same average, and only one of them is safe to
            walk across.
          </>,
          <>
            The lecture makes the point with nine numbers. Group 1 runs from 2 to 8; group 2 runs from 1 to 15. Their
            mean, median and mode are all 5. Every measure of centre says they are the same set. They are not.
          </>,
        ]}
        mappings={[
          {
            title: 'Range',
            body: 'Biggest take smallest. Quick, and built from the two values most likely to be odd.',
          },
          {
            title: 'Standard deviation',
            body: 'Roughly how far a typical value sits from the mean, in the original units.',
          },
          {
            title: 'IQR',
            body: 'The width of the middle half. Ignores the ends completely, so extremes cannot touch it.',
          },
        ]}
        footnote="Below, each squared distance is drawn as a real square. Drag a dot away from the mean and watch its square swell — twice as far, four times the area. That growth is why one extreme value can dominate the answer."
      />

      <div className="my-6">
        <VarianceLab />
      </div>

      <Explainers
        plain="Measure how far each value sits from the mean. Those distances always cancel out to zero, so square them first — squaring makes everything positive. Add the squares, average them, and you have the variance. Square-root it to get back to sensible units and you have the standard deviation."
        breaks="Squaring means a value far from the mean counts for enormously more than one nearby. One typo in a data file can dominate the standard deviation entirely. When that worries you, the IQR measures the middle half and ignores the ends — which is why messy data usually gets reported as a median and an IQR rather than a mean and an SD."
      >
        <MathBlock
          intro="Four lines. The first explains why the other three exist."
          formulas={[
            {
              formula: 'Σ(x − x̄) = 0',
              reading:
                'The plain distances always cancel, so averaging them tells you nothing. Every formula below is a way around this.',
            },
            { formula: 'SS = Σ(x − x̄)²', reading: 'Square each distance first, then add them up. The sum of squares.' },
            {
              formula: 's² = SS/(n − 1),   σ² = SS/N',
              reading:
                'Variance. A sample divides by n − 1 because it was measured around its own mean, which sits closer to those values than the true mean does.',
            },
            {
              formula: 's = √s²',
              reading:
                'Standard deviation. Variance is in squared units, which nobody can picture; the square root puts it back in the units you started with.',
            },
            { formula: 'IQR = Q3 − Q1', reading: 'The spread of the middle half, untouched by whatever the ends do.' },
          ]}
          legend={[
            {
              sym: 'SS',
              name: 'Sum of squares',
              note: 'Every distance from the mean, squared, added up.',
              val: 'the total area',
            },
            { sym: 's', name: 'Sample SD', note: 'The typical distance from the mean.', val: 'in the panel' },
            {
              sym: 'σ',
              name: 'Population SD',
              note: 'Said "sigma". The same idea for a whole population.',
              val: 'divides by N',
            },
            {
              sym: 'n − 1',
              name: 'Degrees of freedom',
              note: 'Why a sample divides by one fewer than you expect.',
              val: 'the correction',
            },
            {
              sym: 'IQR',
              name: 'Interquartile range',
              note: 'Q3 − Q1. The robust alternative.',
              val: 'ignores the ends',
            },
            {
              sym: 'range',
              name: 'Biggest − smallest',
              note: 'Uses two values and discards the rest.',
              val: 'easily fooled',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Standardising every feature',
            how: '(x − mean) / s is applied to nearly every column before training. Without it, a feature measured in millions drowns out one measured in tenths.',
          },
          {
            what: 'Squared error is this same idea',
            how: 'The loss that trains linear regression is a sum of squared distances. That is why one outlier drags the fitted line so hard — the same swelling square.',
          },
          {
            what: 'Variance is half of the bias–variance trade-off',
            how: 'There it measures how much a model shifts when you retrain it on different data. Different quantity, identical arithmetic.',
          },
          {
            what: 'Low-variance features get dropped',
            how: 'A column where every row is nearly the same carries no information to learn from, so pipelines often remove it automatically.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism1/notenough', label: 'ISM Lecture 1 · Why the centre is not enough' },
          { href: '/session/ism1/variance', label: 'Variance and standard deviation' },
          { href: '/session/ism1/sample', label: 'Why a sample divides by n − 1' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function OutliersConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Outliers and the box plot"
        intro="One value far from the rest can wreck an average, break a model, or be the single most interesting thing in your data. Here is how to find them, and why finding them is not the same as removing them."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Five numbers are enough to describe a whole dataset: the smallest, the quarter mark, the middle, the
            three-quarter mark, and the largest. That is the <strong>five-point summary</strong>, and a{' '}
            <strong>box plot</strong> is a picture of it.
          </>,
          <>
            The clever part is the fences. Take the width of the middle half, multiply by 1.5, and put a line that far
            beyond each quartile. Anything outside is flagged for a look. It is a rough rule with no deep theory behind
            it — but it is quick, it works, and it does not care how skewed the data is.
          </>,
        ]}
        mappings={[
          { title: 'The box', body: 'Q1 to Q3 — the middle half of the data, with the median marked inside it.' },
          { title: 'The whiskers', body: 'Out to the furthest values that are still inside the fences.' },
          { title: 'The dots beyond', body: 'Flagged values. Go and look at them before deciding anything.' },
        ]}
        footnote="Drag a dot past a red fence below and watch it turn. Then notice the fences move too — they are built from the data you are changing, so nothing here is a fixed threshold."
      />

      <div className="my-6">
        <BoxPlotLab />
      </div>

      <Explainers
        plain="Sort the data. Find the quarter, middle and three-quarter marks. The gap between the outer two is the IQR. Put fences one and a half IQRs beyond each of them, and flag anything outside. Because it is all built on positions rather than sizes, no single wild value can move the fences much."
        breaks="A flagged value is not automatically wrong. It might be a typo, or a sensor that failed — or it might be the fraud, the fault or the rare event you were looking for. Deleting on sight throws away real information and quietly biases everything downstream. The rule tells you where to look; it does not tell you what to do."
      >
        <MathBlock
          intro="Positions first, then values. Different books count positions differently — these are the ones taught in this course."
          formulas={[
            {
              formula: 'position of Q1 = (n + 1)/4',
              reading:
                'Q3 sits at 3(n + 1)/4. If the position lands between two values, take the value part-way between them.',
            },
            { formula: 'IQR = Q3 − Q1', reading: 'The width of the middle half of the data.' },
            { formula: 'QD = IQR / 2', reading: 'The quartile deviation — the IQR halved.' },
            {
              formula: 'fences: Q1 − 1.5·IQR,  Q3 + 1.5·IQR',
              reading: 'Anything outside is a possible outlier. Some books add wider fences at 3·IQR for extreme ones.',
            },
            {
              formula: 'five-point summary: min, Q1, median, Q3, max',
              reading: 'Five numbers that describe a whole dataset, and everything a box plot draws.',
            },
          ]}
          legend={[
            {
              sym: 'Q1',
              name: 'First quartile',
              note: 'A quarter of the values are below it.',
              val: 'left edge of the box',
            },
            { sym: 'Q3', name: 'Third quartile', note: 'Three quarters are below it.', val: 'right edge of the box' },
            { sym: 'IQR', name: 'Interquartile range', note: 'Q3 − Q1.', val: 'the width of the box' },
            {
              sym: '1.5',
              name: 'The multiplier',
              note: 'A convention, not a theorem. It just works well in practice.',
              val: 'sets the fences',
            },
            {
              sym: 'whisker',
              name: 'The line out from the box',
              note: 'Reaches the furthest value still inside the fence.',
              val: 'not always the max',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The first thing done to a new dataset',
            how: 'Box-plot every numeric column and you find the broken sensor, the −999 used for "missing", and the units someone entered in the wrong scale.',
          },
          {
            what: 'Outliers dominate squared-error models',
            how: 'Linear regression and k-means both square their errors, so a single extreme point can pull the whole fit. Robust alternatives exist precisely because of this.',
          },
          {
            what: 'Anomaly detection is this, generalised',
            how: 'Fraud detection and fault monitoring are the same question asked continuously, in many dimensions at once, where a simple fence no longer works.',
          },
          {
            what: 'Clipping and winsorising',
            how: 'Instead of deleting flagged values, pipelines often pull them back to the fence. That keeps the row and limits the damage.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism1/fivepoint', label: 'ISM Lecture 1 · Quartiles' },
          { href: '/session/ism1/boxplot', label: 'Box plots and outliers' },
          { href: '/session/ism1/range', label: 'The range' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function ProbabilityConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Probability: what the number actually means"
        intro="A probability is a number between 0 and 1. But where does it come from? There are three answers, they are all in use, and they do not always agree."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Say the chance of a six is one in six. How would you defend that? You could say a die has six faces and one
            of them is a six — <strong>count the outcomes</strong>. Or you could roll it two thousand times and report
            what fraction came up six — <strong>run it and see</strong>.
          </>,
          <>
            Both are used, and they need different things. Counting needs the outcomes to be equally likely, which is
            true of dice and almost nothing else. Running it needs a lot of runs. And for &ldquo;will this project ship
            on time?&rdquo; neither works, which is where a third kind comes in.
          </>,
        ]}
        mappings={[
          { title: 'Classical', body: 'Count what you want over the total. Needs every outcome to be equally likely.' },
          { title: 'Empirical', body: 'Run it many times and take the fraction. Works on anything, needs data.' },
          {
            title: 'Subjective',
            body: 'An honest degree of belief. Not repeatable, and decisions get made on it daily.',
          },
        ]}
        footnote="Press “Run it once” below and the answer is 0% or 100% — useless. Press “Run 1000” and watch the wandering line settle onto the counted answer. That settling is the link between the first two definitions."
      />

      <div className="my-6">
        <ConvergeLab />
      </div>

      <Explainers
        plain="Probability measures how likely something is, on a scale from 0 (never) to 1 (always). You can work it out by counting equally likely outcomes, or by running the experiment many times and taking the fraction. Modern maths sidesteps the argument: it never defines probability at all, and just states the rules any probability must obey."
        breaks="Counting breaks the moment outcomes are not equally likely — the classic slip is treating the eleven possible sums of two dice as equally likely when there are really 36 outcomes behind them. Running it breaks when you cannot repeat the experiment, which covers most interesting questions. And a probability says nothing about your next single try: a 1-in-6 chance can come up three times running, and often does."
      >
        <MathBlock
          intro="One definition, three rules. Everything else is built from them."
          formulas={[
            {
              formula: 'P(A) = |A| / |S|',
              reading:
                'Classical probability. How many outcomes you want, over how many there are. Only valid when the outcomes are equally likely.',
            },
            {
              formula: 'P(A) ≈ (times it happened) / (times you tried)',
              reading: 'Empirical probability. Gets closer to the truth the more you run it.',
            },
            { formula: 'P(S) = 1', reading: 'Axiom one. Something in the sample space definitely happens.' },
            {
              formula: '0 ≤ P(E) ≤ 1',
              reading: 'Axiom two. Nothing is less likely than impossible or more likely than certain.',
            },
            {
              formula: 'E₁ ∩ E₂ = ∅ ⇒ P(E₁ ∪ E₂) = P(E₁) + P(E₂)',
              reading:
                'Axiom three. For events that cannot both happen, probabilities simply add. This is the one that makes everything else work.',
            },
          ]}
          legend={[
            { sym: 'P(A)', name: 'Probability of A', note: 'A number from 0 to 1.', val: 'never negative' },
            { sym: 'S', name: 'Sample space', note: 'Everything that could happen.', val: 'P(S) = 1' },
            {
              sym: '|A|',
              name: 'How many outcomes',
              note: 'The count of what is in A.',
              val: 'the top of the fraction',
            },
            { sym: '0', name: 'Impossible', note: 'It never happens.', val: 'the floor' },
            { sym: '1', name: 'Certain', note: 'It always happens.', val: 'the ceiling' },
            {
              sym: '≈',
              name: 'About equal to',
              note: 'The empirical answer approaches, rather than reaches, the true one.',
              val: 'needs many runs',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Model outputs are probabilities',
            how: 'A classifier reports 0.93 cat, 0.07 dog. Softmax exists to force those numbers to obey the axioms — non-negative and summing to 1.',
          },
          {
            what: 'Calibration is asking whether they are honest',
            how: 'If a model says 70% a thousand times, about 700 should come true. That is the empirical definition used as a test of the classical one.',
          },
          {
            what: 'Sampling and simulation',
            how: 'When a probability is too hard to calculate, run it a great many times instead. That is Monte Carlo, and it is the empirical definition turned into a method.',
          },
          {
            what: 'Priors are subjective probability, formalised',
            how: 'Bayesian methods start from a stated belief and update it with evidence. Module 2 of this course is where that begins.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism2/define', label: 'ISM Lecture 2 · Three ways to define probability' },
          { href: '/session/ism2/axioms', label: 'The axioms' },
          { href: '/session/ism2/experiment', label: 'Random experiments' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function EventsConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Events as sets: and, or, not"
        intro="Every probability question is a set question first. Get the set right and the arithmetic is easy; get it wrong and no amount of formula-hunting will save you."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Write down everything that could happen — that list is the <strong>sample space</strong>. An{' '}
            <strong>event</strong> is any part of that list. &ldquo;The die shows more than 3&rdquo; is really just the
            set &#123;4, 5, 6&#125;.
          </>,
          <>
            Once events are sets, the three words that connect them are set operations. <strong>Or</strong> is union,{' '}
            <strong>and</strong> is intersection, <strong>not</strong> is the complement. The only rule you really need
            is that &ldquo;or&rdquo; double-counts the middle, so you take it off once.
          </>,
        ]}
        mappings={[
          { title: 'A ∪ B — or', body: 'In A, or in B, or in both. Note that it includes both, unlike everyday "or".' },
          { title: 'A ∩ B — and', body: 'In both at once. The overlap.' },
          { title: 'Aᶜ — not', body: 'Everything else. P(A) + P(Aᶜ) = 1, which is often the quick way to an answer.' },
        ]}
        footnote="Below, each circle's area is its probability and the box is 1. So the overlap is a genuine area, and P(A ∪ B) = P(A) + P(B) − P(A ∩ B) is something you can watch rather than something you memorise."
      />

      <div className="my-6">
        <VennLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        Build a few events by hand and see the counting underneath. Pick an experiment, click the outcomes you want, and
        flip to the complement.
      </p>

      <div className="my-6">
        <SampleSpaceLab showComplement />
      </div>

      <Explainers
        plain="An event is a set of outcomes. Union means or, intersection means and, complement means not. The addition rule handles or, subtracting the overlap because it was counted twice. Two words to keep apart: mutually exclusive means they cannot both happen, and independent means one tells you nothing about the other."
        breaks='It breaks on the word "or". In conversation "tea or coffee" means one of them; in probability it includes both, and forgetting that is the most common error in the subject. It also breaks when people treat mutually exclusive and independent as the same thing — they are nearly opposites, because exclusive events tell you a great deal about each other.'
      >
        <MathBlock
          intro="Five lines. The last two are the pair everyone mixes up."
          formulas={[
            {
              formula: 'A ⊆ S',
              reading: 'An event is part of the sample space. Including the empty set and all of S.',
            },
            {
              formula: 'P(A) + P(Aᶜ) = 1',
              reading:
                'The complement rule. When an event is awkward to count, count its opposite and take it off 1. "At least one" is nearly always a hint to do this.',
            },
            {
              formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
              reading: 'The addition rule. You subtract because the overlap was counted once in A and again in B.',
            },
            {
              formula: 'mutually exclusive ⟺ P(A ∩ B) = 0',
              reading: 'They cannot both happen, so the circles do not touch and the last term disappears.',
            },
            {
              formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B)',
              reading:
                'Knowing one happened leaves the other as likely as before. Independent events usually do overlap — that is the point.',
            },
          ]}
          legend={[
            { sym: '∪', name: 'Union — or', note: 'In A, or B, or both.', val: 'add, then subtract the middle' },
            { sym: '∩', name: 'Intersection — and', note: 'In both.', val: 'the overlap' },
            { sym: 'Aᶜ', name: 'Complement — not', note: 'Everything outside A.', val: '1 − P(A)' },
            {
              sym: '⊆',
              name: 'Is part of',
              note: 'Every member of the left set is in the right one.',
              val: 'events sit inside S',
            },
            {
              sym: '∅',
              name: 'The empty set',
              note: 'Nothing in it. Two exclusive events intersect in this.',
              val: 'P(∅) = 0',
            },
            {
              sym: '⟺',
              name: 'If and only if',
              note: 'Each side is true exactly when the other is.',
              val: 'a definition, not a rule',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Independence is the assumption behind Naive Bayes',
            how: 'It assumes every feature is independent given the class. That is usually false and the model works anyway — but knowing what the assumption claims tells you when it will not.',
          },
          {
            what: 'The complement trick is all over code',
            how: '"At least one" is computed as 1 minus "none" — in dropout, in reliability, in the chance a hash collides.',
          },
          {
            what: 'Confusion matrices are two-way tables',
            how: 'True or false, positive or negative, four boxes adding to 1. Precision and recall are two different ways of adding up those cells.',
          },
          {
            what: 'This is where conditional probability starts',
            how: 'P(A | B) is the overlap divided by P(B) — the intersection, rescaled. Bayes’ theorem is one step past that.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism2/setops', label: 'ISM Lecture 2 · Union and intersection' },
          { href: '/session/ism2/complement', label: 'The complement' },
          { href: '/session/ism2/addition', label: 'The addition rule' },
          { href: '/session/ism2/independent', label: 'Independent vs exclusive' },
        ]}
      />
    </div>
  )
}
