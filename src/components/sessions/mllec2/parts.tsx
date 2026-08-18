/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  AttributeTypeLab,
  BankTableLab,
  DataKindsLab,
  DataObjectsLab,
  DataShapeLab,
  NutshellLab,
  ScaleZeroLab,
} from '@/components/charts/ml2-data-lab'
import {
  BinningLab,
  EncodingLab,
  FeatureEngLab,
  InductionLab,
  ScalingLab,
  VocabularyLab,
} from '@/components/charts/ml2-feature-lab'
import { ImbalanceLab, IqrLab, SamplingLab, SigmaLab } from '@/components/charts/ml2-outlier-lab'
import {
  AggregationLab,
  DataQualityLab,
  DirtyTableLab,
  ImputeLab,
  NoiseLab,
  OutlierRoleLab,
  PipelineLab,
} from '@/components/charts/ml2-quality-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

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

export const MLLEC2_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  nutshell: (
    <>
      <Para>
        This session is module <strong>M2, Machine learning Workflow</strong> — the second of the eleven on the course
        plan, and the one the first lecture kept pointing forward to. Its agenda is five lines, and the first three are
        what the whole session is about: the role of data, data preprocessing or wrangling, and removing skewness from
        data by sampling. The last two, model training and model testing with performance metrics, are named and then
        explicitly handed to later modules.
      </Para>
      <Para>
        So this is the data lecture. Before any of it, the deck sets up why data gets a whole session, and it does that
        with a number and a list. The number: there are tens of thousands of machine learning algorithms, and hundreds
        of new ones every year. The list: whichever one you pick, it has the same three components.
      </Para>

      <List
        items={[
          <>
            <strong>Data representation</strong> — how a case is written down so an algorithm can read it.
          </>,
          <>
            <strong>Parameter optimization</strong> — how the numbers inside the model get chosen.
          </>,
          <>
            <strong>Model evaluation, selection</strong> — how you decide the answer is any good, and which candidate to
            keep.
          </>,
        ]}
      />

      <Para>
        Read those three next to the five-step loop on the following slide and something jumps out: only one of the five
        steps is the algorithm. The lab below walks the loop and shows which component each step is feeding.
      </Para>

      <Lab>
        <NutshellLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'data wrangling',
            def: 'Another name for preprocessing. Getting data out of the shape it arrived in and into the shape a model needs. The deck uses both words in the same line of the agenda.',
          },
          {
            term: 'skewness',
            say: 'skew-ness',
            def: 'A lopsided distribution — a long tail on one side. Income is the standard example. The agenda promises to remove it by sampling, which is what the parts on splitting and imbalance do.',
          },
          {
            term: 'parameter',
            def: 'A number inside the model that learning is allowed to change. The weights of a line, the split points of a tree.',
          },
          {
            term: 'deploy',
            def: 'Put the model somewhere it makes real decisions. The last step of the loop, and the one that sends you back to the first.',
          },
        ]}
      />

      <Worked title="The loop on slide 6, and where each step lands in this course">
        {`  understand domain, prior knowledge and goals   → lecture 1, module M1
  data integration, selection, cleaning,
    pre-processing, etc.                          → THIS SESSION, all of it
  learn optimal parameter of the models           → modules M3 onwards
  interpret results                               → module M11
  consolidate and deploy discovered knowledge     → module M11
  ──── and back to the top ────`}
      </Worked>

      <Para>
        That second line is the whole of this lecture. Every part after this one — attribute types, dirty data,
        outliers, sampling, scaling, encoding — is inside it.
      </Para>

      <WhyAiml method="sklearn.pipeline.Pipeline">
        <p className="mb-2">
          The three components are not just a way of describing algorithms; they are literally how a scikit-learn
          program is laid out. A <code>Pipeline</code> holds a list of transformers — the data representation — followed
          by one estimator whose <code>.fit()</code> is the parameter optimisation, and you score the whole thing with{' '}
          <code>cross_val_score</code>, which is the evaluation. Swapping the estimator at the end while leaving the
          transformers alone is exactly the claim that these three are separable.
        </p>
        <p>
          What breaks if you ignore the separation is the most common bug in applied ML. Scale your features before you
          split, and the representation step has seen the test set — the column mean and standard deviation used on the
          training rows were computed partly from data the model is about to be judged on. The score you report is then
          too high, and nothing in the code looks wrong. Putting the scaler inside the <code>Pipeline</code> makes it
          impossible, because the pipeline is fitted per fold.
        </p>
      </WhyAiml>

      <Takeaway>
        Every ML algorithm has three components — data representation, parameter optimization, and model evaluation and
        selection. Of the five steps in the practice loop, one is the algorithm and four are about data.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  data: (
    <>
      <Para>
        The deck defines data in one line: a <strong>collection of data objects and their attributes</strong>. Then it
        prints a table and labels the two directions — the columns are attributes, the rows are objects. That is the
        whole definition, and it is worth slowing down on, because almost every word in this course is one of those two
        things wearing a different name.
      </Para>
      <Para>
        An <strong>attribute</strong> is a property or characteristic of an object — the eye colour of a person, a
        temperature. An object is described by a collection of attributes. Neither term means anything more than that.
      </Para>

      <Lab>
        <DataObjectsLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'attribute',
            def: 'One column. The deck lists five other names for it: variable, field, characteristic, dimension, feature.',
          },
          {
            term: 'object',
            def: 'One row. Six other names: record, point, case, sample, entity, instance.',
          },
          {
            term: 'Tid',
            say: 'tee-eye-dee',
            def: 'Transaction ID in the deck’s table — a serial number. It identifies a row and carries no information about it, which will matter in part 3.',
          },
          {
            term: 'dimension',
            def: 'The word for an attribute when you are thinking geometrically. Ten attributes means each object is a point in ten-dimensional space, which is where part 5 goes.',
          },
        ]}
      />

      <Para>
        Two of those synonyms deserve a warning. <strong>Sample</strong> means one object here, but in the sampling
        parts later it will mean a whole subset of the data — statisticians use it both ways, and the deck does too. And{' '}
        <strong>dimension</strong> as a synonym for attribute is why “high-dimensional data” means “a table with a great
        many columns”, which is not obvious the first time you meet it.
      </Para>

      <Beyond>
        The reason this vocabulary is worth learning is that libraries disagree. In scikit-learn, <code>X</code> is
        shaped <code>(n_samples, n_features)</code> — one row per object, one column per attribute. In a lot of
        statistics and signal-processing code the convention is the other way round, one column per observation. Feed a
        transposed matrix to <code>.fit()</code> and nothing raises an error until the shapes happen not to match; if
        they do match, you get a fitted model that is complete nonsense.
      </Beyond>

      <WhyAiml method="the m × n design matrix">
        <p className="mb-2">
          This table <em>is</em> the design matrix that Deep Neural Networks builds its whole notation around. m rows,
          one per object, and n columns, one per attribute — so <code>X.shape</code> is the pair (objects, attributes),
          and a single prediction for the whole dataset is one matrix multiply, <code>X · w</code>. Every method on the
          course expects the data in exactly this shape, which is why the deck spends a slide on the two words before it
          spends anything on methods.
        </p>
        <p>
          The practical consequence is that turning your problem into this shape <em>is</em> the modelling decision.
          Give one customer several rows and each purchase is an object; give them one row with aggregated columns and
          the customer is the object. The same raw records, two different design matrices, and two models that answer
          different questions. Nothing later in the pipeline can undo the choice.
        </p>
      </WhyAiml>

      <Takeaway>
        Rows are objects — also records, points, cases, samples, entities, instances. Columns are attributes — also
        variables, fields, characteristics, dimensions, features. Eleven words, two things.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  attrtypes: (
    <>
      <Para>
        Not every column means the same <em>kind</em> of thing, and the difference decides which sums on it are honest.
        The deck gives four types — <strong>nominal</strong>, <strong>ordinal</strong>, <strong>interval</strong> and{' '}
        <strong>ratio</strong> — and, better, it gives the test for telling them apart. The type of an attribute depends
        on which of four properties it possesses.
      </Para>

      <List
        items={[
          <>
            <strong>Distinctness</strong> — you can ask <code>=</code> and <code>≠</code>. Two values are either the
            same or they are not.
          </>,
          <>
            <strong>Order</strong> — you can ask <code>{'<'}</code> and <code>{'>'}</code>.
          </>,
          <>
            <strong>Differences are meaningful</strong> — <code>+</code> and <code>−</code> mean something. Ten more is
            the same amount of “more” everywhere on the scale.
          </>,
          <>
            <strong>Ratios are meaningful</strong> — <code>*</code> and <code>/</code> mean something. “Twice as much”
            is a real statement.
          </>,
        ]}
      />

      <Para>
        They stack. Nominal has distinctness. Ordinal has distinctness and order. Interval has those plus meaningful
        differences. Ratio has all four. Tick them off in the lab and the type falls out on its own.
      </Para>

      <Lab>
        <AttributeTypeLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'nominal',
            say: 'NOM-in-al',
            def: 'From the Latin for name. The values are names and nothing else. Zip codes, employee ID numbers, eye colour, sex.',
          },
          {
            term: 'ordinal',
            def: 'The values have an order. Hardness of minerals, {good, better, best}, grades, street numbers.',
          },
          {
            term: 'interval',
            def: 'Differences mean something but the zero is arbitrary. Calendar dates, temperature in Celsius or Fahrenheit.',
          },
          {
            term: 'ratio',
            def: 'Zero means “none of it”, so ratios work. Temperature in Kelvin, money, counts, age, mass, length, current.',
          },
          {
            term: 'categorical / qualitative',
            def: 'The umbrella word for nominal and ordinal together.',
          },
          {
            term: 'numeric / quantitative',
            def: 'The umbrella word for interval and ratio together.',
          },
          {
            term: 'χ² test',
            say: 'kai-squared test',
            def: 'A statistical test for whether two categorical columns are related. Listed by the deck as a legal operation on nominal data — and the mean is not.',
          },
        ]}
      />

      <Worked title="The table on slide 11, in the order the ladder builds it">
        {`type       what the values do            example                   statistics allowed
────────── ───────────────────────────── ───────────────────────── ─────────────────────────
Nominal    only distinguish  (=, ≠)      zip codes, employee IDs,  mode, entropy, contingency
                                         eye colour, sex           correlation, χ² test
Ordinal    also order        (<, >)      hardness of minerals,     median, percentiles, rank
                                         {good, better, best},     correlation, run tests,
                                         grades, street numbers    sign tests
Interval   differences       (+, −)      calendar dates,           mean, standard deviation,
             are meaningful               temperature in °C or °F   Pearson's correlation,
                                                                   t and F tests
Ratio      differences and   (*, /)      temperature in Kelvin,    geometric mean, harmonic
             ratios are                   money, counts, age,       mean, percent variation
             meaningful                   mass, length, current

This categorization of attributes is due to S. S. Stevens.`}
      </Worked>

      <Para>
        The right-hand column is the reason any of this matters. It is not a style guide — it is a list of what is
        computable without lying. The mode is legal everywhere. The median needs an order, so it starts at ordinal. The
        mean needs meaningful differences, so it starts at interval. And percent variation needs a real zero, so it only
        appears at ratio.
      </Para>
      <Para>
        The classic mistake is the one the deck sets up on purpose with its very first example. Zip codes are numbers.
        You can compute their mean. The answer is a number. It means nothing at all, because the difference between zip
        code 560001 and 560002 is not one unit of anything.
      </Para>

      <WhyAiml method="OneHotEncoder against OrdinalEncoder">
        <p className="mb-2">
          This is not theory you apply later — it is the choice you make on the very next line of code. In scikit-learn
          a nominal column goes through <code>OneHotEncoder</code> and an ordinal column through{' '}
          <code>OrdinalEncoder</code>, and the four questions above are how you decide which. Get it wrong on a nominal
          column and you have told a linear model that Bangalore (1), Delhi (2) and Mumbai (3) sit in a line with Delhi
          exactly halfway between the other two, so a fitted coefficient will interpolate across cities that have no
          in-between.
        </p>
        <p>
          It also decides which similarity is legal, and therefore which models are available. k-nearest neighbours and
          k-means both work by Euclidean distance, which only makes sense when differences do — that is, at interval or
          above. On nominal data the honest distance is a matching count, which is why the deck’s own table offers
          contingency correlation for nominal columns and Pearson’s only from interval upwards. A decision tree, by
          contrast, only ever tests equality and order, which is exactly why trees cope with mixed attribute types when
          distance-based methods do not.
        </p>
      </WhyAiml>

      <Takeaway>
        Four properties — distinctness, order, meaningful differences, meaningful ratios — and they stack. Nominal has
        one, ordinal two, interval three, ratio all four. The type tells you which statistics are allowed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  zero: (
    <>
      <Para>
        The line between interval and ratio is the one people get wrong, and the deck settles it with a question rather
        than a definition. Is it physically meaningful to say that a temperature of 10° is twice that of 5° — on the
        Celsius scale? on the Fahrenheit scale? on the Kelvin scale?
      </Para>
      <Para>
        Work it out rather than remembering it. Ten degrees Celsius is 283.15 kelvin and five degrees Celsius is 278.15
        kelvin. The first is 1.018 times the second, not twice it. The claim “twice as hot” was never about heat; it was
        about the distance from a zero somebody chose, and the Celsius zero is the freezing point of water, which is not
        an absence of anything.
      </Para>

      <Lab>
        <ScaleZeroLab />
      </Lab>

      <Para>
        The deck then asks the same question with the temperature stripped out, which is the part worth remembering. If
        Bill’s height is three inches above average and Bob’s is six inches above average, would we say Bob is twice as
        tall as Bill? Obviously not — and the deck’s follow-up is the point: is this situation analogous to that of
        temperature? It is exactly analogous. “Height above average” has an arbitrary zero, namely the average, so it is
        an interval reading, while height itself has a real zero and is a ratio reading. The same underlying quantity,
        measured two ways, sits at two different levels.
      </Para>

      <Terms
        items={[
          {
            term: 'true zero',
            def: 'A zero that means “none of this quantity”. Kelvin has one, Celsius does not. It is the single thing that separates ratio from interval.',
          },
          {
            term: 'monotonic function',
            say: 'mon-o-TON-ic',
            def: 'A function that never turns back — as the input rises the output only rises (or only falls). It is what you are allowed to do to an ordinal scale, because it preserves order and nothing else.',
          },
          {
            term: 'affine transformation',
            say: 'AFF-ine',
            def: 'new = a × old + b. Stretch and shift. It is exactly what is allowed on an interval scale, and the b is what an interval scale can afford to lose.',
          },
        ]}
      />

      <Para>
        Slide 12 turns the four types around and asks a different question: what may you <em>do</em> to a scale without
        destroying its meaning? The answers line up one for one with the four levels, and the table in the lab above
        lays them out. The pattern is that each level permits a broader class of transformation the further down you go,
        because there is less structure left to break.
      </Para>

      <Worked title="Permitted transformations, and why each one is safe">
        {`nominal    any permutation of values
             the values are only names, so renaming them all changes
             nothing.  "If all employee ID numbers were reassigned,
             would it make any difference?"

ordinal    new = f(old),  f monotonic
             order is the only structure, so anything order-preserving
             is fine.  {good, better, best} works as {1, 2, 3} or as
             {0.5, 1, 10}.

interval   new = a × old + b
             differences must survive.  Stretching by a rescales every
             difference by the same a; adding b moves the zero, which
             an interval scale never relied on anyway.
             °F = 1.8 × °C + 32.

ratio      new = a × old            ← note: no + b
             ratios must survive too, and adding b would destroy them.
             metres to feet is × 3.28084, and nothing else.`}
      </Worked>

      <Para>
        Read the last two rows together and the whole idea is in one missing symbol. Interval keeps the <code>+ b</code>
        ; ratio drops it. The <code>b</code> is what moves the zero, and the zero is the one thing a ratio scale cannot
        afford to lose.
      </Para>

      <WhyAiml method="centring, and why cosine similarity needs a real origin">
        <p className="mb-2">
          Centring a column — subtracting its mean — is the first step of PCA and the middle of every{' '}
          <code>StandardScaler</code>, and it is legal precisely because it is the <code>+ b</code> that an interval
          scale tolerates. That is why standardisation is safe on temperatures in Celsius, and why the covariance matrix
          PCA decomposes is unchanged by it: covariance is defined on differences from the mean, so it never touches the
          origin.
        </p>
        <p>
          The thing that breaks is any method that measures from the origin. Cosine similarity is the angle between two
          vectors as seen from zero, so on interval data it reports whatever the person who defined the scale happened
          to choose — two documents can be made arbitrarily similar or dissimilar just by shifting the units. That is
          why cosine similarity is the default on term counts, which are ratio data with a genuine zero meaning “this
          word does not appear”, and why on centred or interval-scaled features you use correlation or Euclidean
          distance instead.
        </p>
      </WhyAiml>

      <Takeaway>
        Interval and ratio differ by one thing: whether zero means “none of it”. Celsius and “height above average” have
        arbitrary zeros, so their ratios are meaningless; Kelvin and height itself have real zeros, so theirs are not.
        The permitted transformation for a ratio scale is a × old, with no offset.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  shape: (
    <>
      <Para>
        Two more labels go on an attribute, and they cut across the four types rather than replacing them. An attribute
        is <strong>discrete</strong> if it has only a finite or countably infinite set of values, and{' '}
        <strong>continuous</strong> if its values are real numbers.
      </Para>
      <Para>
        The deck’s examples for discrete are zip codes, counts, and the set of words in a collection of documents; these
        are usually stored as integers, and binary attributes are a special case. For continuous the examples are
        temperature, height and weight, stored as floating-point. It adds one honest caveat that is worth quoting:
        practically, real values can only be measured and represented using a finite number of digits — so “continuous”
        is a statement about the quantity, not about how the computer holds it.
      </Para>

      <Lab>
        <DataShapeLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'countably infinite',
            def: 'You could list them all, one after another, forever — 0, 1, 2, 3 and so on. Counts are countably infinite; there is no largest one, but there is nothing between 3 and 4.',
          },
          {
            term: 'binary attribute',
            def: 'A discrete attribute with exactly two values. The deck calls it a special case of discrete, which is why yes/no columns are nominal, not something new.',
          },
          {
            term: 'floating point',
            def: 'How a computer stores a real number — a fixed number of significant digits. Which is why 0.1 + 0.2 is not exactly 0.3 in any language you will use.',
          },
          {
            term: 'sparse',
            def: 'Mostly zeros or mostly absent. The deck’s one-line definition is the useful one: only presence counts.',
          },
        ]}
      />

      <Para>
        Slide 14 then gives four words for the shape of a whole dataset rather than one column, and each one is a
        question worth asking before you model anything.
      </Para>

      <List
        items={[
          <>
            <strong>Dimensionality</strong> — the number of attributes. High-dimensional data brings a number of
            challenges, and part 20 gives them a name.
          </>,
          <>
            <strong>Sparsity</strong> — only presence counts. A term-document table is almost all zeros, and storing
            them is pointless.
          </>,
          <>
            <strong>Resolution</strong> — patterns depend on the scale. The same data at different granularity shows
            different things, and neither is more real.
          </>,
          <>
            <strong>Size</strong> — the type of analysis may depend on the size of the data. Some methods are simply
            unaffordable past a certain number of rows.
          </>,
        ]}
      />

      <Para>
        Dimensionality and sparsity are connected, and the slider in the lab is there to show how. Nothing is removed
        from the data when you add a column; and yet with a thousand rows and ten buckets per attribute, two attributes
        give ten rows per cell and five attributes give one row per ten thousand cells. The rows did not thin out — the
        space they live in grew.
      </Para>

      <Beyond>
        Resolution is the one that catches people, because it makes “is there a pattern?” a question with no
        scale-independent answer. Aggregate web traffic by second and you see individual page loads; by hour you see the
        working day; by month you see the seasonal trend, and the first two have vanished. The deck states the principle
        and leaves it there; the practical version is that you should look at your data at more than one resolution
        before deciding there is nothing in it.
      </Beyond>

      <WhyAiml method="the curse of dimensionality, and scipy.sparse">
        <p className="mb-2">
          The arithmetic in the lab is the whole reason k-nearest neighbours degrades as columns are added. k-NN answers
          “what did the most similar rows do?”, and it needs the nearest rows to actually be near. Once the space is
          large enough that every cell holds less than one row, the nearest neighbour is not meaningfully closer than
          the tenth nearest, and the method is answering a question about distances that no longer distinguish anything.
          This is what part 20 will call the curse of dimensionality and cure with PCA.
        </p>
        <p>
          Sparsity, meanwhile, decides how the data can be stored at all. A vocabulary of 50,000 words gives 50,000
          columns, and a dense matrix of a million documents would need fifty billion numbers, almost all of them zero.
          That is why text pipelines return a <code>scipy.sparse</code> matrix that records only the non-zero entries,
          and why <code>MultinomialNB</code> and linear models accept sparse input directly while many tree
          implementations quietly convert to dense and run out of memory.
        </p>
      </WhyAiml>

      <Takeaway>
        Discrete means countable, continuous means real-valued; binary is a special case of discrete. For a whole
        dataset, ask four things: dimensionality, sparsity, resolution and size. Adding columns makes data sparser
        without removing a single row.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  datatypes: (
    <>
      <Para>
        Not all data arrives as one tidy table. The deck lists seven kinds and gives an example of each, and the reason
        to know them is practical: only the first one is ready for a model as it stands. Every other kind needs a step
        that turns it into rows and columns, and that step is a decision you make, not something a library does for you.
      </Para>

      <Lab>
        <DataKindsLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'relational / object data',
            def: 'The ordinary table. One row per thing, the same columns for everybody.',
          },
          {
            term: 'transactional data',
            def: 'A basket per event. Rows are sets of items and are different lengths, so there is no fixed column layout.',
          },
          {
            term: 'document data',
            def: 'One row per document, one column per term, value = how often the term appears. Also called a term-document matrix.',
          },
          {
            term: 'spatial data',
            def: 'Rows that carry a position, so nearness between rows is part of the meaning.',
          },
          {
            term: 'time series',
            def: 'The same measurements repeated over time, with timestamps. The order of the rows is data.',
          },
          {
            term: 'sequence data',
            def: 'An ordered run of symbols with no clock — DNA is the deck’s example. Position matters, elapsed time does not.',
          },
          {
            term: 'symmetric binary',
            def: 'A yes/no attribute where both outcomes are equally informative.',
          },
          {
            term: 'asymmetric binary',
            def: 'A yes/no attribute where only the rarer outcome carries information — the “no” is just the default.',
          },
        ]}
      />

      <Para>
        The distinction between a <strong>time series</strong> and <strong>sequence data</strong> is the one most often
        muddled, and the deck separates them for a reason. A time series has a clock: the gap between two readings is
        itself a number you can use. A sequence has only an order — the third base in a strand of DNA comes after the
        second, and asking how long it took is meaningless.
      </Para>
      <Para>
        Notice also what the deck marks on the relational example. Two columns hold Yes and No and get different labels
        — <strong>asymmetric binary</strong> for “Is Priority Customer?” and <strong>symmetric binary</strong> for “is
        Multiple Account Holder”. The labels are the deck’s; the reason is spelled out under the lab, because the slide
        does not spell it out.
      </Para>

      <WhyAiml method="the feature extractor you have to write yourself">
        <p className="mb-2">
          A model takes a fixed-width numeric vector. Six of these seven kinds do not have one, so each has a standard
          way of being forced into one, and the choice is yours: transactional baskets become a binary indicator vector
          over the item catalogue, which is what association-rule mining and market-basket models expect; documents
          become TF-IDF vectors through <code>TfidfVectorizer</code>; a social graph becomes node features plus an
          adjacency structure, which is what a graph neural network consumes; a sequence becomes overlapping windows.
          None of these is automatic, and each throws something away.
        </p>
        <p>
          Getting the kind wrong has one especially expensive consequence. Treat a time series as ordinary relational
          rows and you will call <code>train_test_split</code> with its default <code>shuffle=True</code>, putting
          future rows in the training set and past rows in the test set. The model then predicts Tuesday having already
          seen Wednesday, the reported score is excellent, and the deployed model is worthless. The fix is{' '}
          <code>TimeSeriesSplit</code>, and you only reach for it if you noticed which of the seven kinds you had.
        </p>
      </WhyAiml>

      <Takeaway>
        Seven kinds: relational/object, transactional, document, web and social network, spatial, time series, sequence.
        Only the first is already a design matrix. A time series has a clock; a sequence has only an order.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  casestudy: (
    <>
      <Para>
        The deck sets a case study and then leaves it for you to work. A bank wishes to analyse its customer base for
        targeted marketing and needs to segment the customers based on its account information with its branch; after
        the analysis it might want to target potential customers of high income level possessing Titanium card types.
        The instruction is short: <strong>identify the data types and attribute types</strong>.
      </Para>
      <Para>
        Two questions, not one. The <em>data type</em> is the question from part 6 — this is a single table with one row
        per customer, so it is <strong>relational / object data</strong>. The <em>attribute types</em> are the question
        from part 3, asked once per column.
      </Para>

      <Lab>
        <BankTableLab />
      </Lab>

      <Para>
        Five of the nine columns are typed by the deck itself, on the data-types slide where the same table appears with
        arrows pointing at it. The remaining four follow from the deck’s own table of examples, and the lab says which
        is which rather than blurring them together. One column — Credit Score — is left unanswered on purpose, and the
        reason is in the box under the table.
      </Para>

      <Terms
        items={[
          {
            term: 'data type',
            def: 'Which of the seven kinds of data the whole table is. Asked once, for the table — this one is relational / object data.',
          },
          {
            term: 'attribute type',
            def: 'Which of the four levels a single column is. Asked once per column. The case study asks for both, and they are different questions.',
          },
          {
            term: 'segment',
            def: 'Split the customers into groups. It is the clustering task from lecture 1, which is why the bank wants types settled before it starts — a distance between customers is only meaningful when the columns support one.',
          },
          {
            term: 'targeted marketing',
            def: 'Approaching one group rather than everybody. The reason the bank cares which segment a customer lands in.',
          },
        ]}
      />

      <Worked title="Working it column by column">
        {`Name                        nominal    a label; nothing but = and ≠
Gender                      nominal    slide 11's own example: sex {male, female}
Service Rating              ordinal    a 1-10 rating; slide 8's potato-chip example
Is Priority Customer?       nominal    binary → two categories, no order
Card Type                   ordinal    Platinum outranks Gold; by how much is undefined
Credit Score                 —         continuous numeric; interval or ratio is not
                                       decidable from anything the deck prints
Is Multiple Account Holder  nominal    binary again
Income Level                ordinal    Upper > Middle > Lower, and nothing more
Region                      nominal    a place code, like a zip code`}
      </Worked>

      <Para>
        The trap in the question is the word <strong>Titanium</strong>. The brief asks about Titanium card holders and
        the table contains only Platinum and Gold. Card Type is ordinal, so a Titanium value would need a rank — and
        nothing in the deck says whether Titanium sits above Platinum or below Gold. That part of the question cannot be
        settled, so this page settles nothing about it.
      </Para>

      <Beyond>
        If this comes up as an exam question, the answer that earns the marks names both taxonomies for each column, not
        one. Say “Card Type is a categorical, ordinal attribute, stored as a string” rather than just “ordinal”. And
        where a column genuinely cannot be pinned down, say what it depends on — “Credit Score is continuous numeric;
        whether it is interval or ratio depends on whether zero denotes no creditworthiness” is a better answer than a
        confident guess, and it is the kind of sentence that shows you understand the distinction rather than having
        memorised a list.
      </Beyond>

      <WhyAiml method="df.dtypes against what the column means">
        <p className="mb-2">
          Pandas will tell you a column is <code>int64</code>. It will not tell you whether that integer is a count, a
          rank or an identifier, and those three want three different treatments — leave it alone, encode the order, or
          one-hot it. The Stevens level lives in your head and in the data dictionary, never in the dtype, which is why{' '}
          <code>ColumnTransformer</code> makes you name the columns for each branch by hand.
        </p>
        <p>
          The visible failure is what <code>df.describe()</code> prints. Run it on this table and it will report a mean
          and standard deviation for Credit Score, which is reasonable, and would happily do the same for an account
          number, which is not. Worse, a model given the raw ratings will treat Service Rating 10 as exactly twice
          Service Rating 5, and a gradient-boosted tree given Region as an integer will learn splits on “Region ≤ 3”
          that mean nothing but will still improve the training loss.
        </p>
      </WhyAiml>

      <Takeaway>
        Identify the data type once for the whole table — this one is relational — and the attribute type once per
        column. Where the source does not settle a column, say what it depends on rather than guessing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  quality: (
    <>
      <Para>
        The deck puts six words on a wheel around the word <strong>Quality</strong>: Correct, Interpretable, Usable on
        Demand, Complete, Trustable, Consistent. Then it states the reason to care in one sentence — poor data quality
        negatively affects many data processing efforts — and gives an example that is worth memorising, because it
        shows the damage running in both directions at once.
      </Para>
      <Para>
        A classification model for detecting people who are loan risks, built using poor data, will deny loans to some
        credit-worthy candidates <em>and</em> give more loans to individuals who default. Not one failure with a
        trade-off between the two — both, together, from the same bad data.
      </Para>

      <Lab>
        <DataQualityLab />
      </Lab>

      <Para>
        The deck then asks three questions and answers only the first: what kinds of data quality problems are there,
        how can we detect them, and what can we do about them. Its list of examples is the agenda for the next several
        parts.
      </Para>

      <List
        items={[
          <>
            <strong>Noise and outliers</strong> — parts 9 and 10, then two ways of finding them in parts 15 and 16.
          </>,
          <>
            <strong>Wrong data</strong> — a salary of −10, in part 12.
          </>,
          <>
            <strong>Fake data</strong> — the hardest, because nothing in the row is impossible.
          </>,
          <>
            <strong>Missing values</strong> — part 11.
          </>,
          <>
            <strong>Duplicate data</strong> — part 12.
          </>,
        ]}
      />

      <Terms
        items={[
          {
            term: 'data quality',
            def: 'Whether the data is fit to be used, judged on the six words above. A dataset can be complete and consistent and still be wrong.',
          },
          {
            term: 'fake data',
            def: 'Values that were invented rather than measured. Nothing about an individual row gives it away — only the pattern across rows does.',
          },
          {
            term: 'data cleaning',
            def: 'The deck’s name for the process of dealing with these problems. Part 12 is where it gets its own slide.',
          },
        ]}
      />

      <Beyond>
        The five problems are not equally detectable and it is worth knowing the order. Missing values announce
        themselves — the cell is empty. Duplicates are findable with a query. Wrong data is findable if you know the
        legal range, which is why a data dictionary earns its keep. Outliers need a rule, and the next parts give two.
        Fake data is the only one with no mechanical test at all: you find it by knowing where the data came from, which
        is exactly the “Trustable” spoke on the wheel and the reason it is there.
      </Beyond>

      <WhyAiml method="the label-noise ceiling on accuracy">
        <p className="mb-2">
          No classifier can be more right than its labels. If five per cent of the loan outcomes in your training data
          were recorded wrongly, a perfect model would still disagree with five per cent of the test set — so a reported
          accuracy of 95% may mean the model has learnt the task completely, or that it has learnt nothing and is
          agreeing with the noise. Nothing in the training curve distinguishes the two, and no amount of model tuning
          moves the ceiling. This is why the first thing to do with a disappointing score is to look at a sample of the
          rows the model got wrong, by hand.
        </p>
        <p>
          The deck’s two-directional failure is exactly the pair of errors that module M11 names in the confusion
          matrix: rejecting a credit-worthy applicant is a false positive for “risk”, and approving one who defaults is
          a false negative. They have different costs to the bank, they are traded off by moving a decision threshold —
          and if the underlying labels are wrong, moving the threshold shuffles the errors around without reducing them.
        </p>
      </WhyAiml>

      <Takeaway>
        Six words: Correct, Interpretable, Usable on Demand, Complete, Trustable, Consistent. Five problems: noise and
        outliers, wrong data, fake data, missing values, duplicate data. Poor data produces both kinds of error at once.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  noise: (
    <>
      <Para>
        The deck gives noise two definitions, one per level, and keeping them apart is the point of the slide.{' '}
        <strong>For objects, noise is an extraneous object</strong> — something in the data that should not be there at
        all. <strong>For attributes, noise refers to modification of original values</strong> — the thing is real, but
        the number recorded for it is not quite the number that was true.
      </Para>
      <Para>
        Its examples for the second are both physical: distortion of a person’s voice when talking on a poor phone, and
        “snow” on a television screen. In both, a real signal is there underneath and something has been added on top of
        it.
      </Para>

      <Lab>
        <NoiseLab />
      </Lab>

      <Para>
        The three figures on the slide are one demonstration in three steps. Two sine waves of the same magnitude and
        different frequencies; then the waves combined, which is the signal you would actually observe; then the same
        observed signal with random noise added. The deck’s conclusion is one line:{' '}
        <strong>the magnitude and shape of the original signal is distorted</strong>.
      </Para>
      <Para>
        Turn the noise dial up in the lab and watch the peak read-out. The clean sum never exceeds 2, because it is two
        waves of magnitude 1. Once noise is added, the recorded peak goes past 2 — so a measurement of the maximum is
        now wrong, and no amount of care in the analysis afterwards can recover it from a single observation.
      </Para>

      <Terms
        items={[
          {
            term: 'noise',
            def: 'For an attribute, a modification of the original value. For an object, an extra object that does not belong.',
          },
          {
            term: 'magnitude',
            def: 'How big the wave is — the height of its peaks. The deck’s two waves have the same magnitude and different frequencies.',
          },
          {
            term: 'frequency',
            def: 'How many times per second the wave repeats.',
          },
          {
            term: 'signal',
            def: 'The part of a measurement that carries information. Noise is everything else, and the two arrive added together.',
          },
        ]}
      />

      <Beyond>
        A useful way to hold the difference between noise and the next part’s outliers: noise is spread across{' '}
        <em>every</em> row a little, and an outlier is <em>one</em> row a lot. That is also why they need different
        cures. You cannot delete noise — there is no row to delete — so you deal with it by not fitting it too closely.
        You can delete an outlier, and part 10 is about whether you should.
      </Beyond>

      <WhyAiml method="irreducible error, and why regularisation exists">
        <p className="mb-2">
          Noise is the part of the target that no model can predict, because it was not caused by the inputs. It sets a
          floor on the error of every method you will ever try on that dataset — in the bias–variance decomposition it
          is the term that does not shrink as you add data or capacity. A model that reaches zero training error on
          noisy data has not solved the problem; it has memorised the noise, and it will do measurably worse on new rows
          than a simpler model that ignored it.
        </p>
        <p>
          That is what regularisation is for, and it is why the ridge penalty <code>λ‖w‖²</code> and the lasso penalty{' '}
          <code>λ‖w‖₁</code> exist at all: they buy a little extra training error in exchange for refusing to chase
          wiggles that only the noise supports. The same reasoning drives early stopping in neural networks, pruning in
          decision trees, and dropout. Every one of them is a way of saying “do not fit that part”, and none of them
          would be needed if measurements were exact.
        </p>
      </WhyAiml>

      <Takeaway>
        For attributes, noise modifies values that are really there; for objects, it adds objects that should not be
        there. It distorts both the magnitude and the shape of the signal, and unlike an outlier there is no single row
        you can delete to be rid of it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  outliers: (
    <>
      <Para>
        The deck’s definition is precise and worth reproducing word for word:{' '}
        <strong>
          outliers are data objects with characteristics that are considerably different than most of the other data
          objects in the data set
        </strong>
        . Data <em>objects</em> — whole rows, which is what separates an outlier from noise.
      </Para>
      <Para>
        And then it does something unusual for a definition slide: it refuses to say what to do about them, and splits
        into two cases instead.
      </Para>

      <List
        items={[
          <>
            <strong>Case 1: outliers are noise that interferes with data analysis.</strong> You want them gone so the
            rest of the analysis is clean.
          </>,
          <>
            <strong>Case 2: outliers are the goal of our analysis.</strong> The deck names two: credit card fraud, and
            intrusion detection.
          </>,
        ]}
      />

      <Lab>
        <OutlierRoleLab />
      </Lab>

      <Para>
        The lab shows the same four odd points under both cases, and the button does the opposite thing each time. That
        is the whole lesson. There is no test you can run on a row to find out which case you are in — the case is
        decided by the question you are asking, before the data is touched.
      </Para>

      <Terms
        items={[
          {
            term: 'outlier',
            def: 'A data object considerably different from most of the others. Note: an object, not a value.',
          },
          {
            term: 'anomaly',
            def: 'The same thing under the name used when finding them is the goal. Anomaly detection is Case 2 with a job title.',
          },
          {
            term: 'intrusion detection',
            def: 'Spotting an attacker in network traffic. Almost all traffic is ordinary, so the rare row is the entire finding — a pure Case 2.',
          },
        ]}
      />

      <Beyond>
        There is a third case the deck does not list and that costs people real money: the outlier that is neither noise
        nor the goal, but a <em>unit error</em>. A weight recorded in grams in a column of kilograms is a genuine
        measurement of a genuine object, so it is not noise; and it is nobody’s research question, so it is not the
        goal. Deleting it loses a real row and keeping it corrupts every mean you compute. The only fix is going back to
        the source, and the reason this is worth flagging is that from inside the dataset it looks exactly like the
        other two.
      </Beyond>

      <WhyAiml method="IsolationForest against HuberRegressor">
        <p className="mb-2">
          The two cases have two entirely separate families of method behind them, and knowing which case you are in is
          how you pick. Case 2 wants <code>IsolationForest</code>, <code>LocalOutlierFactor</code> or a one-class SVM —
          models whose <em>output</em> is the odd rows. Case 1 wants robust estimators, which keep the odd rows in the
          data and refuse to be moved by them: <code>HuberRegressor</code>, which switches from squared to absolute loss
          past a threshold, <code>RANSAC</code>, which fits on random subsets and keeps the consensus, or simply the
          median in place of the mean.
        </p>
        <p>
          The choice of loss function is the same decision in miniature, and it is one the statistics course already
          made. Squared error is dragged hard by a distant point, because the penalty grows with the square of the
          distance, so a single outlier can tilt a fitted line across the whole dataset. Absolute error is not, which is
          why the median is what absolute-error minimisation predicts and the mean is what squared-error predicts. If
          you are in Case 1 and cannot delete the rows, changing the loss is the other way to stop them mattering.
        </p>
      </WhyAiml>

      <Takeaway>
        An outlier is a data object considerably different from the rest. Whether to delete it or report it is not a
        property of the row — Case 1 treats outliers as noise to remove, Case 2 makes them the whole deliverable, as in
        credit card fraud and intrusion detection.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  missing: (
    <>
      <Para>
        The deck splits missing values into why they happen and what to do about them, and the first half is the half
        people skip. There are two reasons a value is missing and they are not the same problem.
      </Para>

      <List
        items={[
          <>
            <strong>Information is not collected</strong> — people decline to give their age and weight. There is a true
            value; you just do not have it.
          </>,
          <>
            <strong>Attributes may not be applicable to all cases</strong> — annual income is not applicable to
            children. There is <em>no</em> true value to be had.
          </>,
        ]}
      />

      <Para>
        The second case is the one that catches people. If the attribute does not apply, then estimating it is not
        recovering something lost — it is inventing a fact. A child does not have a hidden annual income that a clever
        method could reconstruct.
      </Para>
      <Para>
        The deck then gives three things you may do: eliminate the data objects or the variables, estimate the missing
        values — its examples are a time series of temperature and census results — or ignore the missing value during
        analysis.
      </Para>

      <Lab>
        <ImputeLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'imputation',
            say: 'im-pyoo-TAY-shun',
            def: 'Filling in a missing value with an estimate. The word the deck uses on the worked slide.',
          },
          {
            term: 'NULL',
            def: 'How a database records “no value here”. Distinct from zero and from an empty string, and the source of endless bugs when the three get mixed up.',
          },
          {
            term: 'last known value',
            def: 'Carry the previous row’s value forward. Sensible on a time series where the quantity changes slowly; meaningless on rows with no order.',
          },
          {
            term: 'spline',
            def: 'A smooth curve fitted through the points either side of a gap, used to interpolate what sits in the middle. The deck’s last column, and the one this page does not reproduce.',
          },
        ]}
      />

      <Worked title="What each strategy does to the twelve recorded values">
        {`recorded values (12)   112 118 132 129 135 148 136 119 118 115 126 141
mean of those          127.42

leave the holes        three cells unusable; most library calls refuse
drop the rows          12 rows left of 15, and the monthly spacing breaks
replace with 0         mean falls sharply, spread roughly doubles
last known value       MAY49 ← 129,  JUL49 ← 135,  NOV49 ← 119
                       ...these three are the deck's own printed numbers
replace with the mean  mean unchanged by construction; spread FALLS,
                       because three points now sit exactly on it`}
      </Worked>

      <Para>
        The last line is the important one and the least obvious. Mean-imputation looks harmless because it does not
        move the average — that is exactly why people choose it. But it shrinks the variance, and every confidence
        interval, standard error and significance test downstream is computed from that variance. You have told the
        analysis you are more certain than you are.
      </Para>

      <Beyond>
        The reason a “not applicable” missing value must not be imputed is that whether a value is missing is often
        itself informative. Someone who declines to state their income is not a random person; a sensor that returns
        nothing is often a sensor that has failed, which is precisely when you would want to know. The standard fix is
        to keep both: fill the column with something harmless <em>and</em> add a binary column recording that it was
        filled. Scikit-learn calls that column <code>MissingIndicator</code>, and the model is then free to learn that
        the fact of absence predicts the target.
      </Beyond>

      <WhyAiml method="SimpleImputer inside a Pipeline">
        <p className="mb-2">
          Imputation is a fitted transformation, not an edit. <code>{"SimpleImputer(strategy='mean')"}</code> learns one
          number per column from the training data and applies it everywhere afterwards — which means it obeys the same
          rule as the scaler in part 19. Compute the fill value over the whole dataset and the test rows have
          contributed to the number used on them, so the score is inflated. It belongs inside the <code>Pipeline</code>{' '}
          for the same reason and with the same consequence if it is not.
        </p>
        <p>
          The choice of strategy is also a modelling choice with a visible cost. Mean-filling a column and then fitting
          a linear model gives every filled row the same value, so they all sit on one vertical line in the scatter and
          drag the fitted slope towards it. Filling with the median instead is more robust; filling with a prediction
          from the other columns — <code>IterativeImputer</code> — is better still and risks encoding the target’s
          structure into the features if the target is used. On a time series, the deck’s last-known-value carry-forward
          is usually the honest choice, because the neighbouring rows really are evidence about the gap.
        </p>
      </WhyAiml>

      <Takeaway>
        Two reasons for a missing value: not collected, or not applicable. Three responses: drop, estimate, or ignore
        during analysis. Mean-imputation leaves the mean alone and shrinks the variance, which is a lie about how
        certain you are.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  duplicates: (
    <>
      <Para>
        The deck defines duplicates plainly: a data set may include data objects that are duplicates, or almost
        duplicates, of one another — and it names the situation where they appear, which is the useful part. It is a{' '}
        <strong>major issue when merging data from heterogeneous sources</strong>. Its example is the same person with
        multiple email addresses. The process of dealing with them it calls <strong>data cleaning</strong>.
      </Para>
      <Para>
        Note the phrase <em>almost duplicates</em>. Two rows that are byte-for-byte identical are easy. Two rows that
        agree on the identifier and disagree on a field are the real problem, because now you have to decide which one
        is true.
      </Para>

      <Lab>
        <DirtyTableLab />
      </Lab>

      <Para>
        Slide 34 gives three kinds of dirty record, and they want different responses. <strong>Noisy</strong> records
        contain noise, errors or outliers — the deck’s example is Salary = “−10”, which is flatly impossible.{' '}
        <strong>Inconsistent</strong> records contain discrepancies in codes or names: an Age of 42 against a Birthday
        of 03/07/2010, a rating that used to run 1, 2, 3 and now runs A, B, C, or a discrepancy between two rows
        claiming to be the same record. <strong>Intentional</strong> covers disguised missing data, and its example is
        January 1 as everyone’s birthday.
      </Para>

      <Terms
        items={[
          {
            term: 'heterogeneous sources',
            say: 'het-er-oh-JEE-nee-us',
            def: 'Several different systems, each with its own conventions. Merging them is where duplicates come from.',
          },
          {
            term: 'almost duplicate',
            def: 'Two rows that clearly describe the same thing and disagree about some of it. Harder than an exact duplicate, because deleting either one loses information.',
          },
          {
            term: 'disguised missing data',
            def: 'A missing value written as a real-looking value. The deck’s example is everyone sharing a birthday of January 1 — the default a form supplies when a required date is unknown.',
          },
          {
            term: 'data cleaning',
            def: 'The deck’s name for dealing with all of this.',
          },
        ]}
      />

      <Para>
        The intentional case is the nastiest because nothing about it looks wrong. A model trained on it will learn that
        people born on the first of January behave unusually, and the pattern is perfectly real in the data — it is just
        a fact about the form, not about the people.
      </Para>

      <Beyond>
        The practical order for cleaning a merged table is worth having, because doing these in the wrong order wastes
        work. Standardise formats first — case, whitespace, date layouts, currency — because two rows often only look
        different because of those. <em>Then</em> deduplicate, since standardising turns many near-duplicates into exact
        ones. Then reconcile whatever is still inconsistent, and only then start filling missing values, because
        deduplication may have supplied the value you were about to invent.
      </Beyond>

      <WhyAiml method="leakage through duplicate rows across the train/test split">
        <p className="mb-2">
          A duplicate row that lands in the training set and again in the test set turns your evaluation into a memory
          test. The model has seen that exact row with its answer, so getting it right proves nothing about
          generalisation — and the more duplicates there are, the more of your reported accuracy is recall rather than
          learning. This is why deduplication has to happen <em>before</em> the split, not after: splitting first and
          deduplicating each side separately leaves the cross-set copies exactly where they do the damage.
        </p>
        <p>
          The same failure has a subtler form that duplicate-detection misses entirely. If your table has several rows
          per patient, per user or per document, then two <em>different</em> rows can still share almost everything, and
          a random split scatters them across both sides. The fix is not deduplication but grouped splitting —{' '}
          <code>GroupKFold</code> or <code>GroupShuffleSplit</code>, which keep every row of a group on one side of the
          line. And an inconsistent duplicate like the deck’s two Tid 9 rows breaks something else again: your model now
          has two contradictory labels for the same input, which puts a hard floor under its achievable error.
        </p>
      </WhyAiml>

      <Takeaway>
        Duplicates are a merge problem, and “almost duplicates” are the hard case. Dirty records come in three flavours
        — noisy, inconsistent, and intentional. Deduplicate before you split, or your test score is partly a memory
        test.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  preprocess: (
    <>
      <Para>
        Halfway through the deck, the material stops being about what data <em>is</em> and starts being about what you{' '}
        <em>do</em> to it. The slide that turns the corner gives two definitions and a picture.
      </Para>
      <Para>
        Preprocessing the data for ML involves both data engineering and feature engineering.{' '}
        <strong>Data engineering is the process of converting raw data into prepared data.</strong>{' '}
        <strong>
          Feature engineering tunes the prepared data to create the features that are expected by the ML model.
        </strong>{' '}
        The picture is a chain: raw data → data engineering → prepared data → feature engineering → engineered features
        → machine learning.
      </Para>

      <Lab>
        <PipelineLab />
      </Lab>

      <Para>
        The distinction is easy to state and easy to blur, so here is the test. Data engineering produces something a{' '}
        <em>person</em> would call correct — one row per case, no duplicates, no impossible values. Feature engineering
        produces something a <em>model</em> can use — numbers on comparable scales, categories turned into columns.
        Prepared data can be perfectly clean and still be unusable by a particular algorithm; that gap is exactly what
        the second step closes.
      </Para>

      <Terms
        items={[
          {
            term: 'raw data',
            def: 'What you were given, in whatever shape the source system stored it.',
          },
          {
            term: 'prepared data',
            def: 'One table, one row per case, nothing corrupt left in it. The output of data engineering.',
          },
          {
            term: 'engineered features',
            def: 'Columns in the units, ranges and encodings the chosen model expects. The output of feature engineering.',
          },
          {
            term: 'data pre-processing',
            def: 'The umbrella term for both. Slide 31 breaks it into four headings: data aggregation, data cleansing, instances selection and partitioning, and feature tuning.',
          },
        ]}
      />

      <Para>
        Between these two slides the deck also sets its second case study, and it is worth reading because it is the
        thread that runs through the rest of the lecture. BITS WILP works with several IT companies whose employees take
        a tailored M.Tech in AI and ML. The accounts department needs to bill each partner organisation based on the
        prospective number of students who will be eligible for the project semester — but the current semester’s exams
        are finished and not yet graded. As data analyst, you are asked to produce that number from the data available.
      </Para>
      <Para>
        The deck labels the difficulty <strong>Challenge 1: insufficient training data</strong>, and its one-line idea
        is <strong>trade-off algorithm vs data readiness</strong>. The observation it leans on — students of similar
        academic background score in much the same range every semester — is what makes the problem tractable at all,
        and it is the reason PreviousDegree survives the column cull in part 20.
      </Para>

      <WhyAiml method="ColumnTransformer, and training/serving skew">
        <p className="mb-2">
          The two boxes are two objects in real code. <code>ColumnTransformer</code> routes each group of columns to its
          own treatment — impute and scale the numeric ones, impute and one-hot the categorical ones — and the whole
          assembly goes into a <code>Pipeline</code> in front of the estimator. Everything in this lecture from part 8
          onwards is a component you would name in that object, which is why the shape of the picture is worth
          memorising rather than the words.
        </p>
        <p>
          The reason it must be one object rather than a sequence of notebook cells is training/serving skew. Whatever
          you did to the training data has to happen identically to every row the deployed model ever sees — same fill
          values, same category ordering, same scale factors. Reimplement that by hand in the serving code and it will
          drift, silently, and the model will receive features that mean something slightly different from the ones it
          was fitted on. Serialising the fitted pipeline and calling <code>.predict()</code> on it is the whole defence.
        </p>
      </WhyAiml>

      <Takeaway>
        Data engineering turns raw data into prepared data; feature engineering turns prepared data into the features a
        model expects. Prepared data can be perfectly clean and still unusable by a given algorithm.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  aggregation: (
    <>
      <Para>
        Aggregation is the first of the four preprocessing headings, and the deck defines it as{' '}
        <strong>combining two or more attributes (or objects) into a single attribute (or object)</strong>. The
        parenthesis matters — it works in both directions. Combining attributes narrows the table; combining objects
        shortens it.
      </Para>
      <Para>Three purposes are given, and the third is the one that is not obvious.</Para>

      <List
        items={[
          <>
            <strong>Data reduction</strong> — reduce the number of attributes or objects.
          </>,
          <>
            <strong>Change of scale</strong> — cities aggregated into regions, states, countries; days aggregated into
            weeks, months, or years.
          </>,
          <>
            <strong>More “stable” data</strong> — aggregated data tends to have less variability.
          </>,
        ]}
      />

      <Lab>
        <AggregationLab />
      </Lab>

      <Para>
        The lab is the deck’s own Python group-by example, computed rather than printed. Six rows keyed by colour become
        three rows, and with <code>mean()</code> applied the answers are 10, 17 and 8 — which is what the slide shows.
        Change the function or edit a number and the page stops claiming to be the slide’s example, which is the point
        of computing it rather than typing it in.
      </Para>

      <Terms
        items={[
          {
            term: 'aggregation',
            def: 'Combining several attributes into one, or several objects into one.',
          },
          {
            term: 'split-apply-combine',
            def: 'The three steps of a group-by. Split the rows into groups by a key, apply a function to each group, combine the answers into one smaller table.',
          },
          {
            term: 'variability',
            def: 'How much the numbers move around. Averaging several values gives a number that jumps about less than any of them did.',
          },
          {
            term: 'change of scale',
            def: 'Moving to a coarser unit of analysis — days to months, cities to states. Which also changes what the rows are.',
          },
        ]}
      />

      <Para>
        Watch the two spread read-outs in the lab as you change the numbers. The deck’s claim that aggregated data tends
        to have less variability is a claim about averaging, and averaging really does damp fluctuation — but only when
        the variation you are damping is <em>within</em> the groups. Push the group means far apart and the spread of
        the aggregated series can exceed the spread of the raw values, which the lab lets you do.
      </Para>

      <Beyond>
        Aggregation is where the deck’s “change of scale” meets the resolution idea from part 5, and the cost is
        one-directional. Rolling daily sales up to monthly does not merely shrink the table — it makes day-of-week
        effects <em>unlearnable</em>, because they no longer exist in the data at all. You cannot get them back by
        modelling harder. The lost variability is the price you paid for the stability, and it is worth being deliberate
        about paying it.
      </Beyond>

      <WhyAiml method="pandas groupby().agg(), and the leakage it invites">
        <p className="mb-2">
          Almost every model built on transactional data starts here. You have one row per purchase and you want to
          predict something about a <em>customer</em>, so the design matrix has to have one row per customer — and that
          means aggregating: total spend, mean basket size, count of orders, days since last order. Those aggregates are
          the features, and choosing them is most of the modelling work on such problems. It is also exactly the
          decision from part 2 about what an object is, made concrete.
        </p>
        <p>
          The failure mode is specific enough to name. If your aggregate is computed over the whole history and your
          target is something that happened at a particular moment, the feature contains information from after the
          prediction point, and the model is reading the future. “Mean order value” computed over all time, used to
          predict whether a customer churned in March, includes their April orders — which only exist if they did not
          churn. The score will be excellent and the model useless. Aggregates for time-dependent targets have to be
          windowed to end before the prediction point, and that is not something the library can check for you.
        </p>
      </WhyAiml>

      <Takeaway>
        Aggregation combines attributes into an attribute or objects into an object, for data reduction, change of
        scale, and more stable data. Stability is bought with information you cannot get back.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  iqr: (
    <>
      <Para>
        Part 10 said what an outlier is. This part and the next give the two rules the deck offers for finding one, and
        both are univariate — they look at one column at a time.
      </Para>
      <Para>
        The first uses the <strong>interquartile range</strong>. Q1 is the 25th percentile and Q3 the 75th, so{' '}
        <strong>IQR = Q3 − Q1</strong> is the width of the middle half of the data. A value is called an outlier if it
        falls below <strong>Q1 − 1.5 × IQR</strong> or above <strong>Q3 + 1.5 × IQR</strong>.
      </Para>

      <Terms
        items={[
          {
            term: 'percentile',
            def: 'The value below which that percentage of the data falls. The 25th percentile is the value a quarter of the data sits below.',
          },
          {
            term: 'quartile',
            say: 'QUOR-tile',
            def: 'The three values that cut the data into four equal parts. Q1, Q2 and Q3 — and Q2 is the median.',
          },
          { term: 'IQR', say: 'eye-cue-arr', def: 'Interquartile range, Q3 − Q1. The width of the middle half.' },
          {
            term: 'fence',
            def: 'The two bounds Q1 − 1.5·IQR and Q3 + 1.5·IQR. Anything outside them is flagged. The deck calls them Min and Max, which is confusing, since they are usually neither.',
          },
        ]}
      />

      <Para>
        The deck’s simple example is worth doing in your head first: if Q1 = 10 and Q3 = 20 then IQR = 10, so the lower
        bound is 10 − 15 = −5 and the upper is 20 + 15 = 35. Data points below −5 or above 35 are outliers.
      </Para>
      <Para>Then it sets a real exercise, and the lab below works it live.</Para>

      <Lab>
        <IqrLab />
      </Lab>

      <Worked title="The lecture’s exercise, step by step">
        {`Data   10, 12, 11, 15, 11, 14, 13, 17, 12, 22, 14, 11        (n = 12)

1  sort          10, 11, 11, 11, 12, 12, 13, 14, 14, 15, 17, 22
2  median        the 6th and 7th values are 12 and 13
                 Q2 = (12 + 13) / 2 = 12.5
3  Q1            median of the lower six  10, 11, 11, 11, 12, 12
                 Q1 = (11 + 11) / 2 = 11
4  Q3            median of the upper six  13, 14, 14, 15, 17, 22
                 Q3 = (14 + 15) / 2 = 14.5
5  IQR           14.5 − 11 = 3.5
6  lower fence   11   − 1.5 × 3.5 = 11   − 5.25 =  5.75
7  upper fence   14.5 + 1.5 × 3.5 = 14.5 + 5.25 = 19.75

   22 > 19.75, and nothing is below 5.75.        outlier = 22`}
      </Worked>

      <Para>
        Steps 3 and 4 are where the deck’s answer and the formula box beside it part company, and the lab lets you see
        both. Taking the median of each half gives Q3 = 14.5, which is what the slide’s answer uses. The box’s formula —
        Q3 is the 3(n+1)/4-th term — gives the 9.75th term, which interpolates to 14.75. Neither changes the verdict: 22
        exceeds both 19.75 and the 20.375 the other method produces. If you are asked to show working, follow the method
        the lecture’s own answer used.
      </Para>

      <Beyond>
        There is a second slip in the same box. It prints “Quartile Formula For Q2 = Q3 − Q1 (Equivalent to Median)”,
        and Q3 − Q1 is the interquartile range, not the median. On this data the median is 12.5 while Q3 − Q1 is 3.5, so
        the two are plainly different numbers. Treat that line as a mistake on the slide rather than a definition to
        learn.
      </Beyond>

      <WhyAiml method="RobustScaler, and the box plot">
        <p className="mb-2">
          The IQR is the basis of <code>sklearn.preprocessing.RobustScaler</code>, which centres a column on its median
          and divides by its IQR instead of using the mean and standard deviation. The whole point is the property this
          part demonstrates: quartiles barely move when you add an extreme value, so one mis-keyed salary cannot rescale
          every other row of the column. Reach for it whenever a feature is skewed or you suspect the maximum is a data
          error rather than a real observation.
        </p>
        <p>
          It is also exactly the rule that draws a box plot — the box spans Q1 to Q3, the line inside is Q2, the
          whiskers reach to the last point inside the 1.5 × IQR fences, and everything beyond is drawn as a separate
          dot. So the dots on a box plot are not a stylistic choice; they are this rule, applied. That is why plotting
          your features before modelling is a genuine outlier check and not just decoration, and it is the same box plot
          the statistics course builds in its first lecture.
        </p>
      </WhyAiml>

      <Takeaway>
        IQR = Q3 − Q1, and anything outside Q1 − 1.5·IQR … Q3 + 1.5·IQR is flagged. For the lecture’s twelve numbers
        that is 5.75 … 19.75, and the outlier is 22.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  sigma: (
    <>
      <Para>
        The second rule uses the mean and the standard deviation instead of the quartiles. The deck states its basis
        plainly: the <strong>3 sigma rule</strong> is based on the properties of a normal distribution. The bounds are{' '}
        <strong>μ − 3σ</strong> and <strong>μ + 3σ</strong>, and anything outside them is called an outlier.
      </Para>
      <Para>
        Its worked example is short. If μ = 50 and σ = 5, the lower bound is 50 − 3 × 5 = 35 and the upper is 50 + 3 × 5
        = 65, so data points below 35 or above 65 are outliers. The justification the deck gives is that 99% of the
        observations of a variable following a normal distribution lie within mean ± 3 × standard deviation.
      </Para>

      <Lab>
        <SigmaLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'μ',
            say: 'mew',
            def: 'The Greek letter m. The mean — the balance point of the data. Same symbol the statistics course uses.',
          },
          {
            term: 'σ',
            say: 'sigma',
            def: 'The Greek letter s. The standard deviation — the typical distance of a value from the mean.',
          },
          {
            term: 'z-score',
            def: '(value − μ) / σ. How many standard deviations from the mean a value sits. The 3-sigma rule says “flag anything with |z| > 3”, and part 19 uses the same quantity as a scaling.',
          },
          {
            term: 'normal distribution',
            def: 'The bell-shaped curve. Symmetric, and thin-tailed, so extreme values are genuinely rare under it — which is the assumption the whole rule rests on.',
          },
        ]}
      />

      <Para>
        The page works the coverage out rather than quoting it: for ±3σ under a normal distribution it is 99.73%, which
        the slide rounds to 99%. Either figure is the same claim. If an exam asks for a number, 99.7% is the one
        textbooks print.
      </Para>

      <Worked title="The two rules side by side">
        {`                    IQR rule                   3 sigma rule

  built from        Q1, Q3                     μ, σ
  bounds            Q1 − 1.5·IQR               μ − 3σ
                    Q3 + 1.5·IQR               μ + 3σ
  assumes           nothing about the shape    the data is normal
  robust?           yes — quartiles barely     no — one extreme value
                    move for one extra point   inflates σ and widens
                                               the fences
  good for          skewed data, income        symmetric, bell-shaped
                                               measurements`}
      </Worked>

      <Para>
        The row that matters is the last two. The sigma rule computes its fences from the mean and the standard
        deviation — and both of those are dragged by the very value you are trying to catch. One enormous outlier
        inflates σ, which widens the fences, which can leave the outlier comfortably inside them. The IQR rule does not
        have this problem, because a quartile does not care how far away a distant point is, only that it is on that
        side.
      </Para>

      <Beyond>
        This is called <em>masking</em>: an outlier hiding itself by inflating the spread it is measured against, and it
        gets worse with several outliers together. It is the practical reason to prefer the IQR rule when you do not
        already know the column is roughly normal — and to be suspicious of a 3-sigma test that finds nothing at all on
        data you can see is lopsided. The deck itself supplies the warning on the scaling slide: income is its example
        of a skewed attribute.
      </Beyond>

      <WhyAiml method="StandardScaler, and the Gaussian assumption underneath it">
        <p className="mb-2">
          The quantity in the middle of this rule, (x − μ)/σ, is the z-score — and part 19 uses exactly the same
          expression as a feature scaling. That is not a coincidence: <code>StandardScaler</code> rewrites a column in
          units of its own standard deviation, so after scaling, the 3-sigma rule becomes the simple test |x| {'>'} 3 on
          every column at once. Anomaly detectors like the elliptic envelope generalise precisely this to several
          columns at a time, using the covariance matrix in place of a single σ.
        </p>
        <p>
          The assumption is where it goes wrong in practice, and it goes wrong in a specific direction. On a
          right-skewed feature such as income or claim size, the long tail inflates σ, so the lower fence lands below
          zero and flags nothing at all, while the upper fence sits far above where the data actually thins out. You end
          up with a test that cannot fire on one side and barely fires on the other. The standard remedies are to take a
          log first, which often makes such columns roughly symmetric, or to use the IQR rule, which never assumed
          symmetry in the first place.
        </p>
      </WhyAiml>

      <Takeaway>
        The 3 sigma rule flags anything outside μ ± 3σ — for μ = 50 and σ = 5 that is below 35 or above 65. It assumes a
        normal distribution, and unlike the IQR rule its own fences are moved by the outliers it is looking for.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  sampling: (
    <>
      <Para>
        The third preprocessing heading is <strong>instances selection and partitioning</strong> — choosing which rows
        to use, and dividing them into training, evaluation (validation) and test sets. The deck opens it with{' '}
        <strong>Challenge 2: non-representative training data</strong>, and a one-line idea:{' '}
        <strong>training data should be representative of the new cases we want to generalize to</strong>.
      </Para>
      <Para>
        It then separates two failures that look alike and are not.{' '}
        <strong>Small sample size leads to sampling noise; increase the sampling size.</strong>{' '}
        <strong>If the sampling process is flawed, even a large sample size can lead to sampling bias.</strong> More
        data fixes the first and does nothing whatever for the second.
      </Para>

      <Terms
        items={[
          {
            term: 'representative',
            def: 'The deck’s own definition: a sample is representative if it has approximately the same properties of interest as the original set of data.',
          },
          {
            term: 'sampling noise',
            def: 'The random wobble you get from drawing a small sample. Honest, unavoidable, and cured by drawing more.',
          },
          {
            term: 'sampling bias',
            def: 'A systematic tilt from a flawed drawing process. A bigger sample just gives you more of the same tilt.',
          },
          {
            term: 'validation set',
            def: 'The deck calls it the evaluation set. A third split, held back from training, used to choose between models — so the test set stays untouched until the very end.',
          },
          {
            term: 'stratified sampling',
            def: 'Draw separately within each group so the group proportions survive into the sample.',
          },
          {
            term: 'clustered sampling',
            def: 'Sample whole groups at a time rather than individuals — used when reaching individuals is impractical.',
          },
        ]}
      />

      <Para>
        The key principle is stated twice on the slide, and it is exam material as written: using a sample will work
        almost as well as using the entire data set <strong>if the sample is representative</strong>; and a sample is
        representative if it has approximately the same properties of interest as the original set of data.
      </Para>
      <Para>
        Then the deck makes it concrete with the iris dataset — 150 flowers, 50 each of Setosa, Versicolor and Virginica
        — and prints the split that random subsampling actually produced.
      </Para>

      <Lab>
        <SamplingLab />
      </Lab>

      <Worked title="The deck's own random split, and what it costs">
        {`150 flowers, 50 of each species.  Random subsampling: 2/3 train, 1/3 test.

                  Setosa   Versicolor   Virginica     total
  training set      38         28           34         100
  test set          12         22           16          50
                    ──         ──           ──
  each species      50         50           50         150     ✓ nothing lost

  a representative share of the training set would be 33.3 of each.

  Versicolor is 5 short in training and 5 over in test — so the model
  sees fewer of the species it will be tested hardest on.

  The deck's heading for this slide: "Issues with Subsampling
  (Independence Violation)".`}
      </Worked>

      <Para>
        Nothing was lost — each species still totals 50. The rows were merely put on the wrong sides, and that is enough
        to make the test set measure something other than what you think it measures. Switch the lab to stratified and
        the imbalance disappears, because the two-thirds is drawn inside each species rather than across the whole pile.
      </Para>
      <Para>
        The deck also gives the honest reason sampling is used at all, and it is not statistical elegance: statisticians
        sample because obtaining the entire set of data is too expensive or time-consuming, and data mining samples
        because <em>processing</em> the entire set is too expensive or time-consuming.
      </Para>

      <Beyond>
        A third failure the deck does not name is worth carrying with you, because stratifying will not save you from
        it. If several rows describe the same underlying thing — several visits by one patient, several photographs of
        one person — then a random split puts some of that thing’s rows in training and some in test, and the model can
        recognise the individual rather than the pattern. The cure is to split by group rather than by row, which
        scikit-learn spells <code>GroupShuffleSplit</code>. It is the same independence violation the deck’s own slide
        heading names, in a form stratification cannot fix.
      </Beyond>

      <WhyAiml method="train_test_split(stratify=y) and StratifiedKFold">
        <p className="mb-2">
          This part is one keyword in real code. <code>train_test_split(X, y, stratify=y)</code> draws within each class
          so the proportions hold, and <code>StratifiedKFold</code> does the same for every fold of a cross-validation —
          which is why it is the default for classifiers in <code>cross_val_score</code>. On the iris split above, the
          difference between passing <code>stratify</code> and not passing it is the difference between the two bar
          charts in the lab.
        </p>
        <p>
          It matters most exactly where you can least afford it: on rare classes. With 1% positives and a small test
          set, an unstratified split can easily hand you a test fold with three positive examples in it, and a recall
          figure computed from three cases carries almost no information — it moves in jumps of 33 percentage points.
          Worse, an unlucky draw can give a fold with none at all, at which point the metric is undefined and the
          reported average quietly becomes a mean over whichever folds happened to work.
        </p>
      </WhyAiml>

      <Takeaway>
        A sample is representative if it has approximately the same properties of interest as the original data. Small
        samples give sampling noise, cured by more data; a flawed process gives sampling bias, which more data does not
        cure. Stratified sampling draws within each group so the proportions survive.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  imbalance: (
    <>
      <Para>
        The deck’s last slide on sampling names a scenario rather than a technique:{' '}
        <strong>building classifiers with an imbalanced training set</strong>. The instruction is one line — modify the
        distribution of training data so that the rare class is well-represented in the training set — and it offers two
        ways to do it: <strong>under sample the majority class</strong>, or <strong>over sample the rare class</strong>.
      </Para>

      <Lab>
        <ImbalanceLab />
      </Lab>

      <Para>
        The read-out at the top of the panel is the reason this has a slide of its own. With 950 ordinary rows and 50
        rare ones, a classifier that never predicts the rare class at all is right 95% of the time. It has learnt
        nothing, it is useless for the job it was built for — catching the rare cases — and by the most obvious measure
        it is excellent. Any optimiser pointed at accuracy will take that deal immediately.
      </Para>

      <Terms
        items={[
          {
            term: 'imbalanced',
            def: 'One class is far more common than another. Fraud, disease screening and intrusion detection are all extreme cases.',
          },
          {
            term: 'majority class',
            def: 'The common one. Under-sampling means throwing some of it away.',
          },
          {
            term: 'rare class',
            def: 'The uncommon one, and usually the one you actually care about. The deck’s own wording.',
          },
          {
            term: 'under sampling',
            def: 'Drop rows from the majority class until the balance is acceptable. Cheap, and it discards real data.',
          },
          {
            term: 'over sampling',
            def: 'Repeat rows from the rare class. Keeps everything, and gives the model the same few individuals many times.',
          },
        ]}
      />

      <Para>
        Neither fix is free, and the lab prints the cost of each. Under-sampling throws away real, correctly-labelled
        rows — fine when the majority class is enormous, wasteful when it is not. Over-sampling keeps everything but
        repeats the rare rows many times each, so the model can memorise those particular individuals instead of
        learning what makes them rare.
      </Para>

      <Beyond>
        One rule the deck does not state and that exam answers lose marks for: resampling belongs to the{' '}
        <strong>training</strong> set only. Balance the test set as well and you have destroyed the thing you were
        measuring, because the model will meet the real 95:5 mixture in production and your test set no longer looks
        like it. In a cross-validation this means the resampling has to happen inside each fold, after the split — which
        is why the <code>imbalanced-learn</code> library ships its own <code>Pipeline</code> that knows to skip
        resampling at predict time.
      </Beyond>

      <WhyAiml method="class_weight='balanced', SMOTE, and why accuracy is the wrong metric">
        <p className="mb-2">
          There is a third option the deck does not list and that most libraries prefer, because it changes no data at
          all: reweight the loss. <code>{"class_weight='balanced'"}</code> in scikit-learn multiplies each class’s
          contribution to the loss by the inverse of its frequency, so a mistake on a rare row costs as much as nineteen
          mistakes on common ones. It reaches the same goal as under-sampling without discarding rows, and the same goal
          as over-sampling without duplicating them. SMOTE sits between the two, over-sampling by interpolating new
          points between existing rare rows rather than copying them.
        </p>
        <p>
          What breaks regardless is the metric. Accuracy on a 95:5 problem is dominated by the majority class, so it
          rewards a model that ignores the rare one — which is why imbalanced problems are reported with precision,
          recall and F1 for the rare class, or with the area under a precision-recall curve. And there is a second-order
          effect worth knowing: resampling changes the base rate the model was fitted on, so its predicted probabilities
          no longer match reality and the decision threshold has to be recalibrated afterwards if you intend to read
          them as probabilities.
        </p>
      </WhyAiml>

      <Takeaway>
        Modify the training distribution so the rare class is well represented — under sample the majority, or over
        sample the rare class. Under-sampling discards real data; over-sampling repeats a few rows. Never resample the
        test set.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  scaling: (
    <>
      <Para>
        The last preprocessing heading is <strong>feature tuning</strong>, and its content is{' '}
        <strong>feature scaling</strong>. The deck’s definition of the job: to map the continuous values from one range
        to a target range, to easily compare them and fit an apt distribution, so that statistical processing is
        possible.
      </Para>
      <Para>
        There are two main methods and they answer different needs. <strong>Normalization</strong> squeezes a column
        into a fixed range such as [0, 1]. <strong>Standardization</strong> re-expresses it in units of its own standard
        deviation, which has no fixed range at all.
      </Para>

      <Lab>
        <ScalingLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'normalization',
            def: 'Rescale into a target range — the deck names [0,1] and [−1,1]. Min-max is the usual formula.',
          },
          {
            term: 'standardization',
            def: 'Subtract the mean and divide by the standard deviation. Also called z-score normalization, which is why the two words get confused.',
          },
          {
            term: 'min-max',
            def: 'v′ = (v − minA)/(maxA − minA) × (new_maxA − new_minA) + new_minA. Anchored to the two most extreme values in the column.',
          },
          {
            term: 'decimal scaling',
            def: 'v′ = v / 10ʲ, where j is the smallest integer making max(|v′|) < 1. Just moves the decimal point.',
          },
          {
            term: 'skewed attribute',
            def: 'One with a long tail on one side. The deck’s example is income — and its advice is not to normalize such a column.',
          },
        ]}
      />

      <Worked title="The deck's income example, worked">
        {`Income ranges from 12,000 to 98,000, and is normalized to [0.0, 1.0].

min-max      v′ = (v − minA)/(maxA − minA) × (new_maxA − new_minA) + new_minA

                = (73,600 − 12,000) / (98,000 − 12,000) × (1.0 − 0) + 0
                = 61,600 / 86,000
                = 0.716

z-score      v′ = (v − μA) / σA          with μ = 54,000 and σ = 16,000

                = (73,600 − 54,000) / 16,000
                = 19,600 / 16,000
                = 1.225

decimal      v′ = v / 10ʲ,  j smallest with max(|v′|) < 1
                 98,000 / 10⁵ = 0.98 < 1,  so j = 5
                 73,600 / 100,000 = 0.736`}
      </Worked>

      <Para>
        Both printed answers come out exactly — but only from 73,600, and the sentence above them on the slide says
        $73,000. Starting from 73,000 gives 0.709 and 1.188 instead, which you can check with the two buttons in the
        lab. Treat the sentence as a typo and 73,600 as the value the example is about.
      </Para>
      <Para>The deck then says when to use which, and the lists are worth learning as they stand.</Para>

      <List
        items={[
          <>
            <strong>Normalization</strong> when approximate upper and lower bounds are known; when the data is
            approximately uniform across that range, such as age — <em>not</em> on a skewed attribute such as income;
            when the algorithm makes no assumption about the distribution, such as KNN or a neural network; and when you
            want the result inside [0,1] or [−1,1].
          </>,
          <>
            <strong>Standardization</strong> when the algorithm does assume a distribution, usually Gaussian; when you
            do not need a bounded range; and when outliers are present, since it is less affected by them.
          </>,
        ]}
      />

      <Para>
        The two notes at the bottom of the slide are the ones that get marked.{' '}
        <strong>Fit the scalers to the training data only</strong>, then use them to transform the training set and the
        test set. And, at the top right of the earlier slide,{' '}
        <strong>scaling the target values is generally not required</strong> — scaling exists to make input columns
        comparable to each other, and the target has nothing to be comparable to.
      </Para>

      <WhyAiml method="gradient descent, and the shape of the loss surface">
        <p className="mb-2">
          This is the part of the lecture that reaches furthest into the rest of the programme, because it changes how{' '}
          <em>optimisation</em> behaves. Put a feature measured in rupees next to one measured in years and the loss
          surface becomes a long narrow valley: the gradient in the rupee direction is thousands of times larger than in
          the year direction, so one learning rate η is far too big for one and far too small for the other. Gradient
          descent then zig-zags across the valley instead of running down it, and the fix is not a cleverer optimiser —
          it is putting the columns on the same scale first.
        </p>
        <p>
          It also decides whether distance-based methods mean anything. k-NN, k-means and any RBF kernel compute a
          Euclidean distance across all columns at once, so an unscaled column with a large range simply dominates the
          sum and the others stop contributing — which is exactly why the deck names KNN and neural networks in its
          normalization list. Regularisation has the same sensitivity: a ridge penalty <code>λ‖w‖²</code> punishes every
          weight equally, so a feature in small units needs a large weight and is penalised for it, and the model
          quietly drops a perfectly good predictor. Tree-based models are the honourable exception — they split on one
          column at a time and never compare across columns, so scaling makes no difference to them at all.
        </p>
      </WhyAiml>

      <Takeaway>
        Normalization maps into a fixed range and is anchored to the extremes; standardization uses μ and σ and is less
        affected by outliers. The deck’s example gives 0.716 and 1.225 — from 73,600. Fit scalers on the training data
        only, and do not scale the target.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  featureeng: (
    <>
      <Para>
        Feature engineering gets its own slide and its own opening line, and the line names the problem it exists to
        solve: feature engineering is needed for coming up with a good set of features —{' '}
        <strong>irrelevant features</strong>. Then it lists four moves, which are easy to confuse and which do quite
        different things.
      </Para>

      <List
        items={[
          <>
            <strong>Feature extraction</strong> — dimensionality reduction. Makes <em>fewer, new</em> columns out of the
            old ones.
          </>,
          <>
            <strong>Feature selection</strong> — more useful features to train on among the existing features. Keeps a{' '}
            <em>subset</em> of what you already have.
          </>,
          <>
            <strong>Feature construction</strong> — combine existing features to produce a more useful one.{' '}
            <em>Adds</em> columns.
          </>,
          <>
            <strong>Feature transformation</strong> — rewrite a column <em>in place</em>. Parts 21 and 22 are both this.
          </>,
        ]}
      />

      <Lab>
        <FeatureEngLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'curse of dimensionality',
            def: 'The deck’s heading for the extraction slide: when dimensionality increases, data becomes increasingly sparse in the space that it occupies. Part 5 made this countable.',
          },
          {
            term: 'PCA',
            say: 'pee-see-ay',
            def: 'Principal Components Analysis. The dimensionality-reduction method the deck names. It builds a few new columns that are combinations of the old ones.',
          },
          {
            term: 'redundant feature',
            def: 'One that says what another column already said. Height in centimetres next to height in inches.',
          },
          {
            term: 'irrelevant feature',
            def: 'One that says nothing about the target. It is not free — it gives the model another way to find a coincidence.',
          },
          {
            term: 'polynomial expansion',
            def: 'Adding x², x³ and so on as new columns, so a straight-line model can fit a curve.',
          },
          {
            term: 'feature crossing',
            def: 'Multiplying two columns together to make a third, so a model can express “these two together matter”, which neither column alone can say.',
          },
        ]}
      />

      <Para>
        The deck works selection on the case study’s own column list and strikes out eleven of the seventeen. What
        survives is <strong>PreviousDegree</strong> and the course columns, and the reason is the observation from the
        case study slide: students with similar educational background tend to perform the same in the exams. So
        PreviousDegree earns its place while Name, Gender, Age, DateOfBirth, Organisation, JobTitle, NatureOfJob,
        EntranceScore, EligibilityScore, WILPBatch and Section do not. Its three stated reasons for dropping a column
        are: handle redundant features, remove irrelevant features, and drop features missing a large number of values.
        The code line it prints is <code>{"dataframe = dataframe.drop(['COLNAME-1','COLNAME-2'], axis=1)"}</code>.
      </Para>
      <Para>
        Transformation gets three versions of the same six-column table, and stepping through them in the lab shows the
        idea: SEM-n-Total becomes SEM-n-GPA becomes Sn-isComplete. Each step throws information away, and the third is
        the one the case study actually needs — the accounts team wants to know who is eligible for the project
        semester, and for that a yes/no is enough.
      </Para>

      <Beyond>
        The exam-safe way to keep the four apart is to ask what happens to the <em>number of columns</em> and to their{' '}
        <em>meaning</em>. Selection: fewer columns, meanings unchanged. Extraction: fewer columns, new meanings — nobody
        can tell you what principal component 1 <em>is</em>. Construction: more columns, new meanings. Transformation:
        the same columns, rewritten. Only construction can add information the model could not have derived, and only in
        its business-logic form; polynomial expansion and crossing add nothing that was not already in the data, they
        just put it in a form a linear model can use.
      </Beyond>

      <WhyAiml method="PCA, PolynomialFeatures, and the interpretability they cost">
        <p className="mb-2">
          Extraction and construction are two lines of scikit-learn that pull in opposite directions.{' '}
          <code>PCA(n_components=k)</code> replaces n correlated columns with k uncorrelated ones ordered by how much
          variance they explain, which is the deck’s cure for sparsity and also the standard fix for multicollinearity —
          the situation where two columns are so nearly the same that the fitted coefficients become unstable and
          enormous. <code>PolynomialFeatures(degree=2)</code> goes the other way, generating every square and every
          pairwise product so a linear model can express curvature and interactions.
        </p>
        <p>
          Both have a cost the deck does not mention and that decides real projects. A principal component has no name:
          it is 0.3 × EntranceScore − 0.7 × EligibilityScore + …, and no examiner, regulator or clinician will accept
          that as an explanation of a decision. Polynomial expansion has the mirror-image problem — degree 2 on 20
          columns produces 230 features, and the model now has far more ways to fit noise than it had rows to fit it on.
          This is the accuracy-against-interpretability trade-off that lecture 1 charted, arriving as a concrete choice
          about columns.
        </p>
      </WhyAiml>

      <Takeaway>
        Four moves. Extraction makes fewer new columns (PCA); selection keeps a subset; construction adds columns
        (polynomial expansion, feature crossing, business logic); transformation rewrites a column in place.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 21 */
  binning: (
    <>
      <Para>
        <strong>Discretization</strong> converts a continuous attribute into a discrete one. The deck also gives its
        common names — <strong>binning</strong> or <strong>bucketing</strong> — and four reasons for doing it.
      </Para>

      <List
        items={[
          <>
            Some methods prefer discrete features. The deck names{' '}
            <strong>
              naive Bayes, decision trees and their ensembles including random forest, minimum distance classifiers and
              KNN
            </strong>
            .
          </>,
          <>To handle outliers — a huge value goes in the top bin instead of staying a huge number.</>,
          <>To improve the value spread, that is, the spread of the data.</>,
          <>
            And the output can be <strong>interval labels</strong> (0–10, 11–20 and so on) or{' '}
            <strong>conceptual labels</strong> (youth, adult, senior).
          </>,
        ]}
      />

      <Para>There are two ways to choose the bins and they behave very differently on real data.</Para>

      <Lab>
        <BinningLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'discretization',
            say: 'dis-cree-tie-ZAY-shun',
            def: 'Turning a continuous attribute into a discrete one.',
          },
          {
            term: 'equal-width partitioning',
            def: 'Also called distance partitioning. Divide the range into N intervals of equal size — a uniform grid. Width W = (B − A)/N.',
          },
          {
            term: 'equal-depth partitioning',
            def: 'Also called frequency partitioning. Divide into N intervals each containing approximately the same number of samples.',
          },
          {
            term: 'interval label',
            def: 'A bin named by its range: 0–10, 11–20.',
          },
          {
            term: 'conceptual label',
            def: 'A bin named by what it means: youth, adult, senior. Same bins, more readable.',
          },
        ]}
      />

      <Worked title="Equal-width, and what one outlier does to it">
        {`Equal-width:  W = (B − A) / N        A = lowest value, B = highest

  30 salaries from 18 to 88, with N = 4
      W = (88 − 18) / 4 = 17.5
      bins  18–35.5   35.5–53   53–70.5   70.5–88
      and the rows spread reasonably across them.

  now add ONE salary of 900
      W = (900 − 18) / 4 = 220.5
      bins  18–238.5   238.5–459   459–679.5   679.5–900
      the first bin holds 30 of the 31 rows; two bins are empty.

  Equal-depth on the same data puts about 8 rows in every bin
  and lets the edges move instead.`}
      </Worked>

      <Para>
        That is the deck’s two warnings about equal-width in one picture: it is the most straightforward, but{' '}
        <strong>outliers may dominate presentation</strong>, and <strong>skewed data is not handled well</strong>. Its
        verdict on equal-depth is two words: <strong>good data scaling</strong>.
      </Para>

      <Beyond>
        Equal-depth is not free either, and the cost is worth knowing. Because the edges are placed to equalise counts,
        they land wherever the data happens to be dense — so two values a rupee apart can end up in different bins while
        two values thousands apart share one. That makes the bin boundaries unstable: refit on a new sample and they
        move, and a rule learnt on the old boundaries no longer means the same thing. Equal-width boundaries, whatever
        else is wrong with them, at least stay put.
      </Beyond>

      <WhyAiml method="what a decision tree split already is">
        <p className="mb-2">
          A decision tree does this for itself. Every split of the form “Age ≤ 37.5” is a bin boundary, chosen to
          maximise information gain rather than to equalise widths or counts — so a tree is a binning algorithm that
          picks its own edges using the target. That is why manual binning matters most for the models that{' '}
          <em>cannot</em> do it: naive Bayes, which needs discrete features to estimate its per-category probabilities,
          and linear models, which otherwise can only express a straight-line relationship between a feature and the
          target.
        </p>
        <p>
          The reason it is a real trade-off, and not just a preprocessing chore, is that binning destroys order. Turning
          age into three buckets tells a linear model that everyone aged 25 and everyone aged 39 are the same person,
          and that the jump from 39 to 40 is the only place anything changes. If the true relationship is smooth and
          monotone you have thrown away information the model was perfectly able to use; if it is genuinely step-shaped
          — a tax bracket, a retirement age — you have handed it the shape for free. Which is why the deck lists binning
          as an option with reasons, and not as a step everyone should take.
        </p>
      </WhyAiml>

      <Takeaway>
        Discretization is binning or bucketing. Equal-width divides the range into N intervals of size W = (B − A)/N and
        is wrecked by outliers and skew; equal-depth divides into N intervals of equal count and handles both.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 22 */
  encoding: (
    <>
      <Para>
        Models take numbers. Part 3 established that most of the interesting columns are not numbers, so something has
        to convert them, and the deck gives the two standard ways in two lines.
      </Para>
      <Para>
        <strong>Binarization maps a categorical attribute into one or more binary variables</strong> — this is one-hot,
        or dummy, encoding. And <strong>label encoding</strong> maps categorical features to a numeric representation.
      </Para>

      <Lab>
        <EncodingLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'binarization',
            def: 'The deck’s word for one-hot encoding. Each category gets its own column holding 0 or 1.',
          },
          {
            term: 'one-hot encoding',
            def: 'One column per category; exactly one of them is 1 for each row. “Hot” meaning the one that is switched on.',
          },
          {
            term: 'dummy encoding',
            def: 'The same thing, from statistics, where it is usually done with one fewer column to avoid a redundancy in a regression.',
          },
          {
            term: 'label encoding',
            def: 'One column, one integer per category. Cheap, and it invents an order.',
          },
          {
            term: 'cardinality',
            def: 'How many distinct values a categorical column has. One-hot on a high-cardinality column produces a very wide, very sparse table.',
          },
        ]}
      />

      <Para>
        The deck’s example is four cars whose fuel is Gas, Diesel, Gas and — look carefully — lower-case{' '}
        <strong>gas</strong>. Which is the whole lesson, and the reason this part has a lab: an encoder compares
        strings, so “Gas” and “gas” are two different fuels unless somebody made them one. Turn the switch in the lab
        and watch the category count go from three back to two.
      </Para>
      <Para>
        Which encoding to use is decided by part 3’s attribute type, and this is the single most useful rule in the
        whole session. A <strong>nominal</strong> column needs one-hot, because label encoding would assert an order
        that does not exist. An <strong>ordinal</strong> column — Gold and Platinum, or low, medium and high — can take
        label encoding, because there the order is real and you can choose numbers that respect it.
      </Para>

      <Beyond>
        The deck’s two tables on that slide do not agree with each other, and it is worth seeing rather than
        overlooking. Its one-hot table gives car D a 1 in the <em>Gas</em> column, so it folded the case; its
        label-encoding table underneath codes gas as a separate category <strong>3</strong>, so it did not. The lab
        reproduces each. Whether the difference is deliberate or a slip, the lesson survives either reading: two
        encoders on the same column can disagree about how many categories exist, and neither will tell you.
      </Beyond>

      <Para>
        Slide 58 then sets the messier version as a problem. A marketing team has feedback on a student app: features
        liked, features to improve, whether the respondent has a similar app, how much they pay per month, three
        ratings, a recommendation, and an education level. The question is to identify the basic preprocessing and data
        cleaning required. The deck prints no answer, so none is printed here — but every defect in that table has
        appeared somewhere in this lecture, and it is a good exercise to walk it column by column with the earlier parts
        in hand. The monthly spend alone is written <code>$35</code>, <code>Rs.500</code>, <code>Rs.250</code> and{' '}
        <code>$20</code>, which is two currencies in one column.
      </Para>

      <WhyAiml method="OneHotEncoder(handle_unknown='ignore')">
        <p className="mb-2">
          The lower-case “gas” is not a curiosity — it is the unseen-category problem, and it is the most common way an
          encoding pipeline fails in production. The encoder learns its categories when it is fitted on the training
          data; a new spelling, a new city or a new product code that arrives afterwards is a category it has never
          seen, and by default <code>OneHotEncoder</code> raises an error rather than guessing. Passing{' '}
          <code>{"handle_unknown='ignore'"}</code> makes it emit all-zeros for that row instead, which at least keeps
          the service running — and is why the encoder must be a fitted object inside the pipeline rather than a{' '}
          <code>pd.get_dummies</code> call, which would produce different columns for training and serving.
        </p>
        <p>
          Cardinality is the other thing that decides the choice. One-hot on a column with 10,000 product codes adds
          10,000 columns, which is where part 5’s sparsity arrives in earnest — workable for a linear model on a sparse
          matrix, painful for most tree implementations, which must consider each column as a split candidate. The usual
          alternatives are to group the rare categories into an “other” bucket, or to use target encoding, which
          replaces each category with the mean target for that category — powerful, and a direct route to leakage unless
          the mean is computed out-of-fold.
        </p>
      </WhyAiml>

      <Takeaway>
        Binarization or one-hot gives one binary column per category and invents no order — use it for nominal columns.
        Label encoding gives one integer column and does invent an order — use it only for ordinal ones. Both count
        categories by comparing strings, so “Gas” and “gas” are two fuels.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 23 */
  challenges: (
    <>
      <Para>
        With the preprocessing done, the deck steps back and lists what goes wrong with a machine learning project. It
        carries a note to students in capitals: more on this slide will be discussed by faculty only in later modules 4,
        5 and 6, on appropriate sections. So this is a map, not a treatment.
      </Para>

      <List
        items={[
          <>
            <strong>Training data</strong> — insufficient, or non-representative.
          </>,
          <>
            <strong>Model selection</strong> — overfitting, or underfitting.
          </>,
          <>
            <strong>Validation and testing.</strong>
          </>,
        ]}
      />

      <Para>
        Two of these have already appeared in this very lecture, under those names. Challenge 1, insufficient training
        data, was the accounts case study. Challenge 2, non-representative training data, was the sampling slide. They
        are the two about <em>data</em> — which is what this session was for. Overfitting and underfitting are about the{' '}
        <em>model</em>, and need the model modules before they can be discussed honestly.
      </Para>
      <Para>
        The deck then changes gear entirely and gives a page of vocabulary, with the stated purpose of interpreting the
        jargon in the prescribed textbook — Mitchell. These definitions are terse, precise, and exactly the kind of
        thing an exam asks you to reproduce.
      </Para>

      <Lab>
        <VocabularyLab />
      </Lab>

      <Terms
        items={[
          {
            term: '⟨x, f(x)⟩',
            say: 'angle x, f of x, angle',
            def: 'A training example: the input and the answer that goes with it. The angle brackets just group a pair.',
          },
          {
            term: 'f',
            def: 'The target function, or target concept — the true rule. You never see it, only some of its outputs.',
          },
          {
            term: 'h',
            def: 'A hypothesis: a proposed function believed to be similar to f. Learning is a search for a good h.',
          },
          {
            term: 'f(x) ∈ {1, …, K}',
            say: 'f of x is in one to K',
            def: 'A classifier: a discrete-valued function. ∈ means “is a member of”, and the values are the classes or class labels.',
          },
          {
            term: 'concept',
            def: 'A boolean function. Where f(x) = 1 the examples are positive instances; where f(x) = 0 they are negative instances.',
          },
          {
            term: 'hypothesis space',
            def: 'The space of all hypotheses that can, in principle, be output by a learning algorithm.',
          },
          {
            term: 'version space',
            def: 'The hypotheses in the hypothesis space that no training example has ruled out yet. It shrinks as data arrives.',
          },
        ]}
      />

      <Para>
        The two space words are the ones with the most weight later, and they are easy to muddle. The{' '}
        <strong>hypothesis space</strong> is fixed the moment you choose a model — it is everything that model could
        possibly say, before any data. The <strong>version space</strong> starts as the whole hypothesis space and
        shrinks as examples arrive, because each example rules some hypotheses out. Data cannot add to the hypothesis
        space; only a different model can.
      </Para>

      <Beyond>
        That distinction is what makes model choice a real decision rather than a preference. A straight-line rule on
        credit score simply cannot express “defaults if the score is either very low or very high” — that hypothesis is
        not in its space, so no quantity of data will find it, and the version space will shrink to something that fits
        the data badly rather than to nothing at all. Underfitting, when it arrives in module 4, is exactly this: the
        right answer was never in the space you were searching.
      </Beyond>

      <WhyAiml method="hypothesis space as model capacity">
        <p className="mb-2">
          “Hypothesis space” is the textbook name for what practitioners call <strong>capacity</strong>, and every
          hyper-parameter that controls overfitting is really a control on its size. <code>max_depth</code> on a
          decision tree, the number of hidden units in a network, the degree in <code>PolynomialFeatures</code>, the λ
          in a ridge penalty — each one makes the set of expressible functions bigger or smaller. Underfitting is a
          hypothesis space too small to contain a good answer; overfitting is one so large that it also contains a great
          many bad answers that happen to fit the training rows.
        </p>
        <p>
          The version space makes the other half concrete: it is what a learning curve is drawing. Each example rules
          out hypotheses, so with few examples many very different models still fit the data equally well, and which one
          you get is nearly arbitrary — that is the high-variance end. As examples accumulate the surviving set narrows
          and the fitted model stops depending on which rows you happened to draw. Which is precisely why the deck’s two
          data challenges come first: no amount of model selection helps when the version space is still enormous
          because there are only forty rows in it.
        </p>
      </WhyAiml>

      <Takeaway>
        Five challenges: insufficient and non-representative training data, overfitting and underfitting, and validation
        and testing. Mitchell’s vocabulary: training example ⟨x, f(x)⟩, target function f, hypothesis h, concept,
        classifier, hypothesis space, version space.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 24 */
  induction: (
    <>
      <Para>
        The last idea of the session answers a question the whole course rests on and rarely states: why should doing
        well on the training data mean anything at all about data you have never seen?
      </Para>
      <Para>
        The deck’s answer is a named assumption. The <strong>inductive learning hypothesis</strong>: any hypothesis
        found to approximate the target function well over a sufficiently large set of training examples will also
        approximate the target function well over other unobserved examples.
      </Para>
      <Para>
        Read it twice. It is not a theorem and nothing on the slide proves it — it is the thing you are assuming every
        time you report a test score.
      </Para>

      <Terms
        items={[
          {
            term: 'inductive learning',
            def: 'Reasoning from examples to a general rule. The deck also calls it “prediction”: given examples of a function (X, F(X)), predict F(X) for new examples X.',
          },
          {
            term: 'unobserved examples',
            def: 'Rows the learner never saw. The only ones whose performance actually matters.',
          },
          {
            term: '?',
            def: 'In a hypothesis, a slot that any value satisfies. The most general possible constraint.',
          },
          {
            term: '∅',
            say: 'empty set, or “phi”',
            def: 'In a hypothesis, a slot that no value satisfies. One of these anywhere makes the hypothesis reject every example.',
          },
        ]}
      />

      <Para>The deck spells out the three shapes inductive learning takes, and they are lecture 1’s three tasks:</Para>

      <List
        items={[
          <>
            <strong>Classification</strong> — F(X) is discrete. The deck writes f(x) ∈ {'{'}Yes, No, Maybe{'}'}.
          </>,
          <>
            <strong>Regression</strong> — F(X) is continuous. The deck writes f(x) ∈ [20–100].
          </>,
          <>
            <strong>Probability estimation</strong> — F(X) = Probability(X), so f(x) ∈ [0–1].
          </>,
        ]}
      />

      <Para>
        And it makes the point with one dataset shown three times — the EnjoySport table, with only the last column
        changing. Switch between the three in the lab: the six attributes never move, and the task changes completely.
      </Para>

      <Lab>
        <InductionLab />
      </Lab>

      <Para>
        Then the notation. A hypothesis is a tuple of constraints, one per attribute. A slot can hold a specific value
        that must match, a <strong>?</strong> meaning anything will do, or <strong>∅</strong> meaning nothing will do.
        The deck gives three examples:
      </Para>

      <Worked title="The three hypotheses on slide 66, and how they score">
        {`the data
  1  Sunny  Warm  Normal  Strong  Warm  Same    EnjoySport = Yes
  2  Sunny  Warm  High    Strong  Warm  Same    EnjoySport = Yes
  3  Rainy  Cold  High    Strong  Warm  Change  EnjoySport = No
  4  Sunny  Warm  High    Strong  Cool  Change  EnjoySport = Yes

one possible hypothesis      (?, Cold, High, ?, ?, ?)
    matches only example 3, which is the one labelled No.
    so it calls 3 positive and 1, 2, 4 negative  →  0 of 4 right.

the most general hypothesis  (?, ?, ?, ?, ?, ?)
    every day is a positive example  →  3 of 4 right.

the most specific hypothesis (∅, ∅, ∅, ∅, ∅, ∅)
    no day is a positive example     →  1 of 4 right.`}
      </Worked>

      <Para>
        The first of those is worth pausing on, because the slide offers it without comment and it is a <em>bad</em>{' '}
        hypothesis — it gets every row wrong. That is fine: the slide is showing the notation, not recommending the
        rule. Being able to tell the difference between “this is what a hypothesis looks like” and “this is a good
        hypothesis” is most of what the hypothesis-space idea is for.
      </Para>
      <Para>
        The other two are the boundaries of the whole search. Everything a learner in this language can say lies between
        “every day counts” and “no day counts”, and learning is the business of moving between them. Build one in the
        lab that gets all four rows right and you will find it sits somewhere in the middle.
      </Para>

      <Beyond>
        Try it: the hypothesis ⟨Sunny, Warm, ?, Strong, ?, ?⟩ scores 4 of 4. It is what you get by taking the first
        positive example and, for each further positive example, replacing any slot that disagrees with a{' '}
        <strong>?</strong> — the most specific hypothesis consistent with all the positive rows. That procedure is not
        on the slides, and the lab does not assert the answer: it checks coverage row by row, so you can see the score
        rather than take it on trust.
      </Beyond>

      <WhyAiml method="inductive bias, and why the split is a test of this assumption">
        <p className="mb-2">
          The hypothesis language is the model’s <strong>inductive bias</strong>, and without one no generalisation is
          possible at all. If a learner could express every possible labelling of the inputs, then for any way of
          extending its training answers to a new row there would be a hypothesis fitting the training data perfectly
          and saying yes, and another fitting it just as perfectly and saying no — with nothing to choose between them.
          Restricting the space is what lets a learner prefer one extension, and that restriction is an assumption about
          the world, not a fact derived from the data.
        </p>
        <p>
          Which makes the train/test split the empirical test of the deck’s assumption rather than a formality. Holding
          rows back and scoring on them is a check that a hypothesis which fit the training set also fits examples it
          never saw — and the assumption fails outright when the test rows are not drawn from the same distribution as
          the training rows. That is distribution shift, and it is why a fraud model degrades as fraudsters adapt and
          why a model trained on one hospital’s scanners does badly at another. The inductive learning hypothesis is
          assumed by every method on this course, it is checkable, and it is regularly false.
        </p>
      </WhyAiml>

      <Takeaway>
        The inductive learning hypothesis: a hypothesis that approximates the target function well over a sufficiently
        large training set will also approximate it well over unobserved examples. It is an assumption. A hypothesis is
        a tuple of constraints, running from ⟨?, …, ?⟩ (every day positive) down to ⟨∅, …, ∅⟩ (no day positive).
      </Takeaway>
    </>
  ),
}
