'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These four come out
 * of ML Lecture 2, and each links back to the chapter parts it was drawn from.
 */
import { AttributeTypeLab, BankTableLab, ScaleZeroLab } from '@/components/charts/ml2-data-lab'
import { BinningLab, EncodingLab, InductionLab, ScalingLab, VocabularyLab } from '@/components/charts/ml2-feature-lab'
import { SigmaLab } from '@/components/charts/ml2-outlier-lab'
import Link from 'next/link'
import { UsedInAiml } from './algebra'
import { Connections } from './connections'
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
/* Levels of measurement                                                      */
/* ========================================================================== */

export function AttrTypesConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Concept"
        title="Levels of measurement: nominal, ordinal, interval, ratio"
        intro="Four questions decide what a column of data actually means. The answer tells you which averages you may take, which distances make sense, and which encoder to reach for — and it is not the same question as what type the computer stores it in."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Three columns hold the number 5. In the first it is a locker number, in the second a rating out of ten, in
            the third a weight in kilograms. Add ten to each and you get 15 every time — but only one of those 15s means
            anything, and only one of the three columns can honestly be halved.
          </>,
          <>
            So “it is a number” tells you nothing. What you need to know is which operations the values support, and
            there are exactly four to ask about. They stack, so the answer is a rung on a ladder rather than a label
            from a list.
          </>,
        ]}
        mappings={[
          {
            title: 'Distinctness  (=, ≠)',
            body: 'Can you say two values are the same or different? Everything can. This is the bottom rung, and on its own it gives you nominal.',
          },
          {
            title: 'Order  (<, >)',
            body: 'Can you say one is bigger? Grades and ratings can; eye colour cannot. Adding this rung gives ordinal.',
          },
          {
            title: 'Differences  (+, −)',
            body: 'Does “ten more” mean the same everywhere? Dates and Celsius qualify. This rung gives interval, and it is where the mean becomes legal.',
          },
          {
            title: 'Ratios  (*, /)',
            body: 'Does “twice as much” mean anything? Only when zero means none of it. This rung gives ratio.',
          },
        ]}
        footnote="The classification is due to S. S. Stevens, and every example on this page is one the ML Lecture 2 deck names. The lab computes the level from the ticked properties rather than storing it, so the page cannot disagree with the ladder."
      />

      <H2>The ladder, and what each rung buys you</H2>
      <P>
        Tick the operations a column supports and the level falls out. The right-hand panel lists the statistics that
        become legal at each rung — and that list is the whole reason the classification exists. It is not a style
        guide. The mode works everywhere; the median needs an order; the mean needs meaningful differences; percent
        variation needs a real zero.
      </P>

      <Lab>
        <AttributeTypeLab />
      </Lab>

      <H2>The line that gets crossed most: interval against ratio</H2>
      <P>
        Both are numbers, both allow the mean, and the only difference is whether zero means “none of this quantity”.
        Celsius does not: its zero is where water freezes, which is a fact about water, not about heat. Kelvin does. So
        “10° is twice 5°” is false in Celsius and true in Kelvin, and you can watch the arithmetic decide it below
        rather than remembering which is which.
      </P>
      <P>
        The version worth carrying around is not about temperature at all. <strong>Height above average</strong> has an
        arbitrary zero — the average — so it is interval; height itself has a real zero, so it is ratio. Same physical
        quantity, two ways of writing it down, two different rungs. Whenever a column is a difference from some
        reference point, suspect interval.
      </P>

      <Lab>
        <ScaleZeroLab />
      </Lab>

      <H2>Doing it on a real table</H2>
      <P>
        Nine columns from a bank’s customer records. Some are settled by the source, some follow from the standard
        examples, and one genuinely cannot be decided from what is printed — which is worth seeing, because “it depends
        on whether zero means none” is a better exam answer than a confident guess.
      </P>

      <Lab>
        <BankTableLab />
      </Lab>

      <Explainers
        plain="An attribute's level of measurement is decided by which of four properties its values support: distinctness (= and ≠), order (< and >), meaningful differences (+ and −), and meaningful ratios (* and /). They are cumulative. Distinctness alone is nominal — names, zip codes, eye colour. Add order and you have ordinal — grades, ratings, {good, better, best}. Add meaningful differences and you have interval — calendar dates, Celsius. Add meaningful ratios, which requires a zero that means 'none of it', and you have ratio — Kelvin, money, counts, age, mass, length. Nominal and ordinal together are called categorical or qualitative; interval and ratio are numeric or quantitative. The level decides which statistics are legal and which permitted transformations leave the meaning intact: any permutation for nominal, any monotonic function for ordinal, a × old + b for interval, and a × old with no offset for ratio."
        breaks="The trap is that the level is not the storage type. Zip codes, employee IDs and ratings are all stored as integers, and a library will happily compute their mean — which is meaningless for the first two and misleading for the third. The mirror-image trap is treating an ordinal column as nominal and one-hot encoding it, which throws away an ordering the model could have used. And be suspicious of any column defined as a difference from a reference point: 'height above average', 'days since launch' and 'temperature anomaly' all look like ratio data and are interval, so their ratios say nothing."
      >
        <MathBlock
          intro="Four properties, four levels, four permitted transformations. That is the entire concept."
          formulas={[
            {
              formula: 'nominal ⊂ ordinal ⊂ interval ⊂ ratio',
              reading:
                'The properties are cumulative, so the levels nest. A ratio attribute supports everything the three below it do.',
            },
            {
              formula: 'nominal:  new = π(old),  π any permutation',
              reading: 'The values are only names. Reassign every employee ID and nothing about the data changes.',
            },
            {
              formula: 'ordinal:  new = f(old),  f monotonic',
              reading: 'Order is the only structure, so anything order-preserving is safe. {1,2,3} or {0.5,1,10}.',
            },
            {
              formula: 'interval: new = a·old + b',
              reading: '°F = 1.8·°C + 32. Differences survive the stretch; the offset moves a zero that meant nothing.',
            },
            {
              formula: 'ratio:    new = a·old',
              reading: 'No offset. Metres to feet is × 3.28084 and nothing else — b would destroy the ratios.',
            },
            {
              formula: 'legal statistics rise with the level',
              reading:
                'mode everywhere · median from ordinal · mean and standard deviation from interval · geometric mean and percent variation from ratio.',
            },
          ]}
          legend={[
            {
              sym: '=, ≠',
              name: 'Distinctness',
              note: 'Two values are the same or they are not.',
              val: 'nominal and up',
            },
            { sym: '<, >', name: 'Order', note: 'One value is bigger than another.', val: 'ordinal and up' },
            {
              sym: '+, −',
              name: 'Meaningful differences',
              note: '“Ten more” means the same everywhere on the scale.',
              val: 'interval and up',
            },
            {
              sym: '*, /',
              name: 'Meaningful ratios',
              note: 'Needs a zero that means an absence.',
              val: 'ratio only',
            },
            {
              sym: 'a, b',
              name: 'Transformation constants',
              note: 'Interval keeps the b; ratio must drop it.',
              val: 'slide 12',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It picks the encoder, on the very next line of code',
            how: 'Nominal columns go through OneHotEncoder; ordinal columns can go through OrdinalEncoder. Label-encode a nominal column and you have told a linear model that Delhi (2) sits exactly halfway between Bangalore (1) and Mumbai (3), and it will fit a coefficient across that non-existent line.',
          },
          {
            what: 'It decides which distance is legal, and so which models are available',
            how: 'k-NN, k-means and every RBF kernel work by Euclidean distance, which needs differences to be meaningful — interval or above. On nominal data the honest similarity is a matching count. Decision trees only ever test equality and order, which is exactly why they cope with mixed types when distance-based methods do not.',
          },
          {
            what: 'Centring is legal because interval scales tolerate an offset',
            how: 'StandardScaler subtracts the mean, and PCA centres before decomposing. Both are the a·old + b that interval data permits, which is why covariance — defined on differences from the mean — is untouched by the choice of origin.',
          },
          {
            what: 'Cosine similarity needs a zero that means something',
            how: 'It measures the angle from the origin, so on interval data it reports whatever the person who chose the units decided. That is why it is the default on term counts, which have a genuine zero meaning “this word does not appear”, and the wrong choice on centred features.',
          },
          {
            what: 'df.dtypes will not tell you any of this',
            how: 'An int64 column may be a count, a rank or an identifier, and those want three different treatments. The level lives in the data dictionary, never in the dtype — which is why ColumnTransformer makes you name the columns for each branch by hand.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/mllec2/attrtypes', label: 'ML Lecture 2 · the four types of attribute' },
          { href: '/session/mllec2/zero', label: 'ML Lecture 2 · where zero is' },
          { href: '/session/mllec2/casestudy', label: 'ML Lecture 2 · typing a real table' },
          { href: '/session/ism1/levels', label: 'Statistics Lecture 1 · the four levels of measurement' },
        ]}
      />

      <Connections topic="attrtypes" />
    </div>
  )
}

/* ========================================================================== */
/* Feature scaling                                                            */
/* ========================================================================== */

export function ScalingConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Concept"
        title="Feature scaling: normalisation and standardisation"
        intro="Two ways to make columns comparable to each other, one rule about when to fit them, and a clear answer to which models care. Get the rule wrong and your reported score is about data the model has already seen."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You are judging a competition with two events. One is scored out of 100,000 and the other out of 10. Add the
            two scores to get a total and you have not held a two-event competition — you have held the first one, with
            a rounding error attached.
          </>,
          <>
            That is what happens to any model that adds up contributions from several columns: an income in rupees and
            an age in years are not on speaking terms. Scaling puts them on one footing. The two standard ways differ in
            what they anchor to — the range, or the spread.
          </>,
        ]}
        mappings={[
          {
            title: 'Normalisation',
            body: 'Min-max. Anchored to the smallest and largest values, so the result lands in [0,1] — and one wrong maximum rescales every other row.',
          },
          {
            title: 'Standardisation',
            body: 'The z-score, (v − μ)/σ. Anchored to the mean and standard deviation, unbounded, and much less moved by a single extreme value.',
          },
          {
            title: 'Fit on training only',
            body: 'The min, max, mean and deviation are learnt numbers. Learn them from the whole dataset and the test rows have contributed to the numbers used on them.',
          },
        ]}
        footnote="The worked figures on this page are the ones ML Lecture 2 prints, and the lab computes them rather than quoting them. One input on that slide is written two different ways; the lab lets you check which of the two produces the printed answers."
      />

      <H2>The three formulas</H2>
      <P>
        Min-max normalisation maps a value into a chosen range, usually [0, 1]. Z-score standardisation re-expresses it
        as “how many standard deviations from the mean”. Decimal scaling just moves the decimal point until everything
        is under 1 in size. All three are below, computed on the lecture’s own income example.
      </P>

      <Lab>
        <ScalingLab />
      </Lab>

      <H2>Why the z-score is the same object twice</H2>
      <P>
        The expression (v − μ)/σ is not only a scaling. It is also the quantity the three-sigma outlier rule tests, so
        after standardisation “flag anything beyond three sigma” becomes the flat test |v′| {'>'} 3 on every column at
        once. Move μ and σ below and watch the same two numbers do both jobs.
      </P>

      <Lab>
        <SigmaLab />
      </Lab>

      <Explainers
        plain="Scaling maps a continuous column from its own range onto a common one, so that columns can be compared and combined. Min-max normalisation is v′ = (v − min)/(max − min) × (new_max − new_min) + new_min, and lands in a bounded range such as [0,1] or [−1,1]. Z-score standardisation is v′ = (v − μ)/σ and is unbounded. Decimal scaling is v′ = v/10ʲ for the smallest j making every |v′| < 1. Use normalisation when approximate bounds are known, when the data is roughly uniform across the range such as age, when the algorithm assumes nothing about the distribution such as KNN or a neural network, and when you want a bounded result. Use standardisation when the algorithm does assume a distribution, when a bounded range is not needed, and when outliers are present. Fit the scaler on the training data only, then transform both the training and the test set. Scaling the target is generally not required."
        breaks="Two failures, and the second is silent. Min-max is anchored to the two most extreme values in the column, so a single mis-keyed maximum squashes every other row towards zero — which is exactly why the lecture warns against normalising a skewed attribute such as income. The silent one is fitting the scaler before splitting: the test set's own minimum, maximum, mean and deviation then went into the numbers applied to it, so the reported score is optimistic and nothing in the code looks wrong. Both are avoided by putting the scaler inside a Pipeline, which is refitted per fold. And note that tree-based models are unaffected by any of this: they split one column at a time and never compare across columns."
      >
        <MathBlock
          intro="Three formulas and one rule."
          formulas={[
            {
              formula: 'v′ = (v − minA)/(maxA − minA) × (new_maxA − new_minA) + new_minA',
              reading: 'Min-max. With income 73,600 in [12,000, 98,000] mapped to [0,1], v′ = 61,600/86,000 = 0.716.',
            },
            {
              formula: 'v′ = (v − μA) / σA',
              reading: 'Z-score, or standardisation. With μ = 54,000 and σ = 16,000, v′ = 19,600/16,000 = 1.225.',
            },
            {
              formula: 'v′ = v / 10ʲ,  j smallest with max(|v′|) < 1',
              reading: 'Decimal scaling. For a maximum of 98,000, j = 5, so 73,600 becomes 0.736.',
            },
            {
              formula: 'scaler.fit(X_train);  scaler.transform(X_train);  scaler.transform(X_test)',
              reading: 'The rule. Never fit on the test set, and never fit on the two together.',
            },
            {
              formula: '|(v − μ)/σ| > 3  ⟹  outlier',
              reading: 'The same z-score, used as the three-sigma rule. After standardisation it is just |v′| > 3.',
            },
          ]}
          legend={[
            {
              sym: 'minA',
              name: 'Column minimum',
              note: 'What min-max is anchored to, and its weakness.',
              val: '12,000',
            },
            { sym: 'maxA', name: 'Column maximum', note: 'One wrong value here rescales everything.', val: '98,000' },
            { sym: 'μ', name: 'Mean', note: 'Say “mew”. What standardisation centres on.', val: '54,000' },
            {
              sym: 'σ',
              name: 'Standard deviation',
              note: 'Say “sigma”. The unit standardisation measures in.',
              val: '16,000',
            },
            {
              sym: 'j',
              name: 'Decimal shift',
              note: 'Smallest power of ten that brings everything under 1.',
              val: '5',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It decides whether gradient descent converges in reasonable time',
            how: 'Unscaled columns make the loss surface a long narrow valley: the gradient is thousands of times larger in one direction, so a single learning rate η is too big for one axis and too small for the other, and descent zig-zags. Scaling first is the fix, not a cleverer optimiser.',
          },
          {
            what: 'Every distance-based method needs it',
            how: 'k-NN, k-means and any RBF kernel sum squared differences across all columns, so an unscaled column with a large range dominates the sum and the rest stop contributing. This is why the lecture names KNN and neural networks in its normalisation list.',
          },
          {
            what: 'Regularisation penalises unscaled features unfairly',
            how: 'A ridge penalty λ‖w‖² punishes every weight equally, so a feature measured in small units needs a large weight and is punished for it — and the model quietly drops a perfectly good predictor. The lasso does the same, more sharply.',
          },
          {
            what: 'RobustScaler exists because min-max and z-score both trust the extremes',
            how: 'It centres on the median and divides by the interquartile range instead, so one mis-keyed salary cannot rescale the column. Reach for it whenever a feature is skewed or you suspect the maximum is a data error.',
          },
          {
            what: 'Trees are the honourable exception',
            how: 'A decision tree tests one column at a time — “Age ≤ 37.5” — and never compares across columns, so scaling changes nothing about the tree it builds. Knowing which side of that line your model is on saves a lot of pointless preprocessing.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/mllec2/scaling', label: 'ML Lecture 2 · feature scaling' },
          { href: '/session/mllec2/sigma', label: 'ML Lecture 2 · three sigma' },
          { href: '/session/mllec2/preprocess', label: 'ML Lecture 2 · data and feature engineering' },
        ]}
      />

      <Connections topic="scaling" />
    </div>
  )
}

/* ========================================================================== */
/* Encoding categories                                                        */
/* ========================================================================== */

export function EncodingConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Concept"
        title="Turning categories into numbers"
        intro="A model takes numbers, and most interesting columns are words. There are two standard conversions, and choosing between them is the same question as asking whether the column is nominal or ordinal. The other direction — numbers into categories — is binning, and it is on this page too."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Number the fuels: petrol 1, diesel 2, electric 3. Nothing about that is wrong until a model adds them up, at
            which point you have told it that diesel is exactly halfway between petrol and electric, and that the
            average of a petrol car and an electric one is a diesel.
          </>,
          <>
            One-hot encoding refuses to say that, at the cost of one column per category. Label encoding says it
            cheaply. Neither is right in general — the right one depends on whether the order you are inventing happens
            to be real.
          </>,
        ]}
        mappings={[
          {
            title: 'One-hot / binarization',
            body: 'One column per category, exactly one 1 per row. No category is nearer another, which is correct for nominal data and costs you width.',
          },
          {
            title: 'Label encoding',
            body: 'One column, one integer per category. Cheap, compact, and it asserts an ordering — fine when the ordering is real.',
          },
          {
            title: 'Binning, the other direction',
            body: 'Continuous into discrete, by equal width or equal depth. The same trade: cheap boundaries that outliers ruin, or stable counts with moving edges.',
          },
        ]}
        footnote="The car table below is the lecture's own, including the lower-case “gas” that quietly becomes a third fuel. The two tables printed on that slide disagree about whether it does; the switch reproduces both."
      />

      <H2>The two encodings, and the case that breaks them</H2>
      <P>
        Four cars, two fuels — except one row wrote the fuel in lower case. An encoder compares strings, so “Gas” and
        “gas” are two different fuels unless somebody made them one, and you get a third category that appears exactly
        once in the training set. Flip the switch and watch the count go back to two.
      </P>

      <Lab>
        <EncodingLab />
      </Lab>

      <H2>Which one to use is a question you already answered</H2>
      <P>
        It is the nominal-or-ordinal question from levels of measurement, arriving as a line of code. A{' '}
        <strong>nominal</strong> column has no order to preserve, so label encoding would invent one — use one-hot. An{' '}
        <strong>ordinal</strong> column has a real order, so label encoding can preserve it if you choose the numbers to
        respect it — Gold before Platinum, low before medium before high.
      </P>
      <P>
        Work a column through the four properties below and the encoder falls out of the answer: stop at rung one and
        you need one-hot; reach rung two and label encoding becomes available.
      </P>

      <Lab>
        <AttributeTypeLab />
      </Lab>

      <H2>The other direction: numbers into categories</H2>
      <P>
        Discretization — also called binning or bucketing — turns a continuous column into a discrete one. Equal-width
        divides the range into N intervals of size W = (B − A)/N; equal-depth divides it into N intervals holding about
        the same number of rows. Add one enormous salary below and watch equal-width collapse while equal-depth simply
        moves its edges.
      </P>

      <Lab>
        <BinningLab />
      </Lab>

      <Explainers
        plain="Binarization, also called one-hot or dummy encoding, maps a categorical attribute into one or more binary variables: one column per category, holding 1 for the row's own category and 0 elsewhere. Label encoding maps categories to a single integer column. Use one-hot for nominal attributes, where any ordering would be invented, and label encoding for ordinal ones, where the ordering is real. In the other direction, discretization or binning converts a continuous attribute into a discrete one, either by equal width — N intervals of size W = (B − A)/N — or by equal depth, N intervals of roughly equal count. Binning is done because some methods prefer discrete features (naive Bayes, decision trees and their ensembles, minimum-distance classifiers and KNN), to handle outliers, and to improve the spread of the data. The bins can carry interval labels such as 0–10 and 11–20, or conceptual labels such as youth, adult and senior."
        breaks="Encoders count categories by comparing strings, so 'Gas' and 'gas', trailing spaces, and two spellings of the same city all become separate categories — each one rare, each one a chance to overfit. The related production failure is the category that was never in the training data at all: a fitted OneHotEncoder has no column for it and will raise unless told to ignore it. On the binning side, equal-width is wrecked by a single extreme value, which stretches the range so that almost every row lands in the first bin; and equal-depth places its edges wherever the data is dense, so the boundaries move when you refit on a new sample."
      >
        <MathBlock
          intro="Two encodings, two binnings, and the rule that chooses between them."
          formulas={[
            {
              formula: 'one-hot:  {Gas, Diesel} → columns [Gas, Diesel],  Gas → (1, 0)',
              reading: 'k categories become k columns. No two categories are nearer each other than any other pair.',
            },
            {
              formula: 'label:  Gas → 1,  Diesel → 2,  gas → 3',
              reading:
                'One column. Compact, and it asserts 1 < 2 < 3 — which is the deck’s own printed table, third category and all.',
            },
            {
              formula: 'nominal ⟹ one-hot,   ordinal ⟹ label encoding',
              reading: 'The whole decision rule, and it is the level of measurement asked in another voice.',
            },
            {
              formula: 'equal-width:  W = (B − A) / N',
              reading: 'A and B are the lowest and highest values. Uniform grid, and outliers dominate it.',
            },
            {
              formula: 'equal-depth:  each bin holds ≈ n / N rows',
              reading: 'The edges move instead of the counts. Good data scaling, unstable boundaries.',
            },
          ]}
          legend={[
            {
              sym: 'k',
              name: 'Cardinality',
              note: 'How many distinct categories. One-hot adds k columns.',
              val: 'width',
            },
            { sym: 'N', name: 'Number of bins', note: 'The one thing you choose when discretizing.', val: 'binning' },
            { sym: 'A, B', name: 'Lowest and highest value', note: 'What equal-width is anchored to.', val: 'binning' },
            { sym: 'W', name: 'Bin width', note: '(B − A)/N, and one outlier inflates it.', val: 'binning' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'handle_unknown is the production setting nobody sets until it breaks',
            how: 'The encoder learns its categories when fitted; a new spelling or a new product code afterwards is a category it has never seen, and OneHotEncoder raises by default. Passing handle_unknown="ignore" emits all-zeros instead and keeps the service running.',
          },
          {
            what: 'It has to be a fitted object, not pd.get_dummies',
            how: 'get_dummies produces whatever columns happen to be present, so training and serving end up with different column sets in a different order. A fitted encoder inside a Pipeline produces the same columns every time, which is what the model was trained to expect.',
          },
          {
            what: 'Cardinality decides whether one-hot is affordable',
            how: 'Ten thousand product codes become ten thousand columns — workable for a linear model on a scipy.sparse matrix, painful for tree implementations that consider each column as a split candidate. The usual answers are a rare-category "other" bucket, or target encoding.',
          },
          {
            what: 'Target encoding is powerful and leaks by default',
            how: 'Replacing a category with the mean target for that category uses the answer to build the feature, so it must be computed out-of-fold. Done in one pass over the whole training set, it produces a feature that looks brilliant in cross-validation and does nothing in production.',
          },
          {
            what: 'A decision tree split is a bin boundary it chose for itself',
            how: '“Age ≤ 37.5” is binning with the edge picked to maximise information gain. Which is why manual binning matters most for the models that cannot do it — naive Bayes, which needs discrete features, and linear models, which otherwise only express straight lines.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/mllec2/encoding', label: 'ML Lecture 2 · encoding categorical features' },
          { href: '/session/mllec2/binning', label: 'ML Lecture 2 · binning a numeric attribute' },
          { href: '/session/mllec2/attrtypes', label: 'ML Lecture 2 · the four types of attribute' },
        ]}
      />

      <Connections topic="encoding" />
    </div>
  )
}

/* ========================================================================== */
/* Hypotheses and the hypothesis space                                        */
/* ========================================================================== */

export function HypothesisConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Concept"
        title="Hypotheses, the hypothesis space and version space"
        intro="What a learner is actually doing when it learns: searching a set of rules it was able to state before any data arrived. This is the vocabulary the textbook uses throughout, and it is where overfitting and underfitting get their real definitions."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Somebody is thinking of a rule for which days are good for sport, and you have to guess it from four
            examples. Before you see a single example, you have already decided what kind of rule you are willing to
            guess — “sunny and warm”, say, rather than “every third Tuesday unless it rained in March”.
          </>,
          <>
            That decision is the <strong>hypothesis space</strong>, and it is made before the data. The examples then
            knock out the guesses that disagree with them, and whatever is left standing is the{' '}
            <strong>version space</strong>. Learning is those two things, and nothing else.
          </>,
        ]}
        mappings={[
          {
            title: 'The target function f',
            body: 'The true rule. You never see it — only some of its answers, one per training example.',
          },
          {
            title: 'A hypothesis h',
            body: 'A proposed function believed to be similar to f. A tuple of constraints, one per attribute.',
          },
          {
            title: 'The hypothesis space',
            body: 'Everything h could possibly be. Fixed by your choice of model, before any data arrives.',
          },
          {
            title: 'The version space',
            body: 'The part of it no example has ruled out yet. Starts as everything and shrinks as data comes in.',
          },
        ]}
        footnote="The definitions here are the ones the ML Lecture 2 deck prints, from Mitchell. The EnjoySport table is the deck's, including all three of its hypotheses — and the lab scores each by checking coverage row by row rather than asserting an answer."
      />

      <H2>The vocabulary, against real rows</H2>
      <P>
        Seven terms, and they are worth being able to state exactly. A <strong>training example</strong> is a pair ⟨x,
        f(x)⟩. The <strong>target function</strong> f is the true rule. A <strong>hypothesis</strong> h is a proposed
        function believed to be similar to f. A <strong>concept</strong> is a boolean function, whose positive and
        negative instances are the rows where it gives 1 and 0. A <strong>classifier</strong> is a discrete-valued
        function whose values are the classes.
      </P>

      <Lab>
        <VocabularyLab />
      </Lab>

      <H2>Writing a hypothesis down</H2>
      <P>
        In the constraint notation, a hypothesis is a tuple with one slot per attribute. A slot holds a specific value
        that must match, a <strong>?</strong> meaning anything will do, or <strong>∅</strong> meaning nothing will do.
        So ⟨?, ?, ?, ?, ?, ?⟩ says every day is positive, ⟨∅, ∅, ∅, ∅, ∅, ∅⟩ says no day is, and everything a learner in
        this language can say lies between the two.
      </P>
      <P>
        Build one below and watch it score. The deck’s own example, ⟨?, Cold, High, ?, ?, ?⟩, is worth trying first — it
        gets every row wrong, which is a useful thing to see. It is an illustration of the notation, not a
        recommendation.
      </P>

      <Lab>
        <InductionLab />
      </Lab>

      <Explainers
        plain="A training example is a pair ⟨x, f(x)⟩ — an input and its answer. The target function or target concept f is the true rule, which is never observed directly. A hypothesis h is a proposed function believed to be similar to f. A concept is a boolean function: examples where f(x) = 1 are positive instances, where f(x) = 0 they are negative instances. A classifier is a discrete-valued function whose possible values f(x) ∈ {1, …, K} are the classes or class labels. The hypothesis space is the space of all hypotheses that can in principle be output by a learning algorithm, and is fixed by the choice of model before any data arrives. The version space is the set of hypotheses in that space which no training example has yet ruled out; it starts as the whole hypothesis space and shrinks as examples accumulate. The inductive learning hypothesis is the assumption that a hypothesis approximating f well over a sufficiently large training set will also approximate it well over unobserved examples."
        breaks="Data cannot add to the hypothesis space — only a different model can. A straight-line rule on credit score simply cannot express 'defaults if the score is either very low or very high', so no quantity of data will find it, and the version space shrinks towards something that fits badly rather than towards nothing. That is underfitting, stated exactly. The opposite failure is a hypothesis space so large that many mutually contradictory hypotheses still fit every training row, so which one you get depends on the rows you happened to draw — that is overfitting and high variance. And the inductive learning hypothesis itself fails outright when the test rows are not drawn from the same distribution as the training rows, which is distribution shift."
      >
        <MathBlock
          intro="Seven definitions, and the assumption that makes them worth having."
          formulas={[
            {
              formula: '⟨x, f(x)⟩',
              reading: 'A training example: an input and the answer that goes with it.',
            },
            {
              formula: 'h ≈ f',
              reading: 'A hypothesis is a proposed function believed to be similar to the target function.',
            },
            {
              formula: 'concept:  f(x) ∈ {0, 1}',
              reading: 'A boolean target. f(x) = 1 gives positive instances, f(x) = 0 negative ones.',
            },
            {
              formula: 'classifier:  f(x) ∈ {1, …, K}',
              reading: 'A discrete-valued target. The K values are the classes, or class labels.',
            },
            {
              formula: 'H  ⊇  VS  =  {h ∈ H : h consistent with every example seen}',
              reading:
                'The version space is the surviving part of the hypothesis space. It only ever shrinks as data arrives.',
            },
            {
              formula: '⟨?, …, ?⟩   …   ⟨∅, …, ∅⟩',
              reading:
                'The two ends of the constraint language: every day positive, and no day positive. Everything sayable lies between them.',
            },
            {
              formula: 'good on training  ⟹  good on unseen',
              reading:
                'The inductive learning hypothesis. An assumption, not a theorem — and the thing a test set checks.',
            },
          ]}
          legend={[
            { sym: 'f', name: 'Target function', note: 'The true rule. Never observed.', val: 'unknown' },
            { sym: 'h', name: 'Hypothesis', note: 'A proposed rule. What a learner outputs.', val: 'searched' },
            {
              sym: 'H',
              name: 'Hypothesis space',
              note: 'Everything h could be. Fixed by the model choice.',
              val: 'capacity',
            },
            {
              sym: 'VS',
              name: 'Version space',
              note: 'What no example has ruled out yet. Shrinks with data.',
              val: 'variance',
            },
            {
              sym: '?',
              name: 'Anything will do',
              note: 'The most general constraint a slot can hold.',
              val: 'general',
            },
            { sym: '∅', name: 'Nothing will do', note: 'One of these rejects every example.', val: 'specific' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Hypothesis space is the textbook name for model capacity',
            how: 'max_depth on a tree, hidden units in a network, degree in PolynomialFeatures, λ in a ridge penalty — every one of them makes the set of expressible functions bigger or smaller. Tuning them is tuning H, and nothing else.',
          },
          {
            what: 'Underfitting is a space too small to contain a good answer',
            how: 'No amount of data helps, because the right rule was never sayable. Recognising it is what tells you to change the model rather than collect more rows — which is the single most useful diagnostic distinction in applied ML.',
          },
          {
            what: 'The version space is what a learning curve is drawing',
            how: 'With few examples many very different models still fit equally well, so which one you get is nearly arbitrary — that is the high-variance end. As examples accumulate the surviving set narrows and the fitted model stops depending on the draw.',
          },
          {
            what: 'A restriction on the space is exactly the inductive bias',
            how: 'Without one, generalisation is impossible: for any way of extending the training answers to a new row there is a hypothesis fitting the data and saying yes, and another fitting it just as well and saying no. The restriction is what lets a learner prefer one, and it is an assumption about the world.',
          },
          {
            what: 'The train/test split is the empirical test of the inductive learning hypothesis',
            how: 'It checks that a hypothesis fitting the training rows also fits rows it never saw. The assumption fails under distribution shift — which is why a fraud model decays as fraudsters adapt and a model trained on one hospital’s scanners does badly at another.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/mllec2/induction', label: 'ML Lecture 2 · the inductive learning hypothesis' },
          { href: '/session/mllec2/challenges', label: 'ML Lecture 2 · challenges and the vocabulary' },
          { href: '/session/mllec1/types', label: 'ML Lecture 1 · the three kinds of learning' },
        ]}
      />

      <Connections topic="hypothesis" />
    </div>
  )
}
