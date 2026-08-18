'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene and then hands you off to the
 * parts, without repeating them — a reader who wants the material should be one
 * click from it, not scrolling past a summary of it.
 */
export function MlLecture2Overview() {
  const parts = partsOf('mllec2')

  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Chapter"
        title="Lecture 2 — The machine learning workflow: data and preprocessing"
        intro="Module M2 of the course, and the session that explains where the time in a real project actually goes. Almost no algorithms again — instead: what data is, what the four types of attribute are, everything that goes wrong with data, and the six things you do to it before a model ever sees it. It ends with the assumption that the rest of the course quietly rests on."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Lecture 1 ended with an eight-step workflow in which exactly one step chose a model. This session is step
            six of that list, opened up: preprocess, clean, visualise. It runs for sixty slides, and the reason it needs
            sixty is that the phrase “clean the data” hides about fifteen separate decisions.
          </>,
          <>
            The lecture’s own framing is a five-step loop in which four steps are about data. Understand the domain,
            integrate and clean the data, learn the parameters, interpret, deploy — then round again. Every part of this
            chapter lives inside the second of those five, and the deck says so on its agenda slide by handing model
            training and performance metrics to later modules.
          </>,
        ]}
        mappings={[
          {
            title: 'Nominal · ordinal · interval · ratio',
            body: 'Four properties decide which of these a column is, and the answer decides which sums on it are honest — and whether it needs one-hot or label encoding.',
          },
          {
            title: 'Noise, outliers, gaps, duplicates',
            body: 'Four ways data is wrong, four different cures, and one question you have to answer first: is the odd row the problem or the point?',
          },
          {
            title: 'Sample, scale, encode',
            body: 'Split so the sample is representative, scale so the columns are comparable, encode so categories become numbers. Fit all three on training data only.',
          },
        ]}
        footnote="Everything on these pages is the deck’s own, including all four worked examples: the IQR exercise, the three-sigma bounds, both feature-scaling figures, and the group-by. Three places where the deck disagrees with itself are flagged where they occur rather than smoothed over — the two quartile conventions on slide 39, the 73,000 against 73,600 on slide 48, and the two encoding tables on slide 57. Where the deck poses a question and prints no answer, none is printed here."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, and a note on what the idea is for in real
        machine learning. Each is listed in the left menu so you can come straight back to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/mllec2/${p.id}`}
            className="flex h-full flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-4 hover:border-zinc-950/25 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2">
              <span
                className="grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
              >
                {i + 1}
              </span>
              {p.slides && <span className="text-[10.5px] text-zinc-400">{p.slides}</span>}
            </div>
            <span className="text-[14px] font-semibold text-zinc-950">{p.title}</span>
            <span className="text-[12.5px]/[1.6] text-zinc-600">{p.teaser}</span>
          </Link>
        ))}
      </div>

      <Explainers
        plain="Data is a collection of objects (rows) and their attributes (columns), and both have half a dozen other names. An attribute is nominal, ordinal, interval or ratio depending on which of four properties it has — distinctness, order, meaningful differences, meaningful ratios — and that decides which statistics are legal on it and which encoding it needs. Data arrives in seven kinds, of which only the relational table is ready to model. Quality has six aspects and fails in five ways: noise, wrong data, fake data, missing values and duplicates. Noise modifies values; an outlier is a whole row, and whether you delete it or report it depends on the question, not the row. Two rules find outliers — the IQR fences at Q1 − 1.5·IQR and Q3 + 1.5·IQR, and the three-sigma fences at μ ± 3σ. Preprocessing splits into data engineering, which makes raw data correct, and feature engineering, which makes it usable: aggregate, cleanse, select and partition instances, and tune features. Sampling must be representative — small samples give noise, flawed processes give bias — and imbalanced classes need under- or over-sampling. Scaling is min-max normalization or z-score standardization, fitted on the training set only. Feature engineering has four moves: extraction, selection, construction, transformation. Finally, learning is a search through a hypothesis space, and the inductive learning hypothesis is the assumption that fitting the training set means anything at all."
        breaks="The most expensive slips are all about the boundary between training and everything else. Fit a scaler or an imputer on the whole dataset and the test rows have contributed to the numbers used on them. Deduplicate after splitting instead of before and the duplicates that landed on both sides turn your test into a memory test. Balance the test set as well as the training set and you have thrown away the mixture you were trying to measure. Inside the data itself, the two classic errors are computing a mean on a nominal column because it happens to be stored as an integer, and label-encoding a nominal column so a model interpolates between categories that have no in-between. And the three-sigma rule has a failure mode of its own: it builds its fences from the mean and standard deviation, both of which are inflated by the very outlier it is looking for."
      >
        <MathBlock
          intro="This session has four formulas and about thirty terms. These are the formulas, all of which are worked in the labs against the deck's own numbers."
          formulas={[
            {
              formula: 'IQR = Q3 − Q1',
              reading: 'The width of the middle half of the data. Q1 is the 25th percentile, Q3 the 75th.',
            },
            {
              formula: 'outlier  if  v < Q1 − 1.5·IQR  or  v > Q3 + 1.5·IQR',
              reading:
                'The IQR fences. For the lecture’s twelve numbers: Q1 = 11, Q3 = 14.5, IQR = 3.5, fences at 5.75 and 19.75, outlier 22.',
            },
            {
              formula: 'outlier  if  v < μ − 3σ  or  v > μ + 3σ',
              reading: 'The three-sigma rule. For μ = 50 and σ = 5 the bounds are 35 and 65.',
            },
            {
              formula: 'v′ = (v − minA)/(maxA − minA) × (new_maxA − new_minA) + new_minA',
              reading: 'Min-max normalization. Income 73,600 in [12,000, 98,000] mapped to [0,1] gives 0.716.',
            },
            {
              formula: 'v′ = (v − μA) / σA',
              reading: 'Z-score normalization, or standardization. With μ = 54,000 and σ = 16,000, 73,600 gives 1.225.',
            },
            {
              formula: 'v′ = v / 10ʲ,  j smallest with max(|v′|) < 1',
              reading: 'Normalization by decimal scaling. Just moves the decimal point.',
            },
            {
              formula: 'W = (B − A) / N',
              reading: 'Equal-width binning. A and B are the lowest and highest values, N the number of intervals.',
            },
            {
              formula: '⟨x, f(x)⟩',
              reading: 'A training example: an input and its answer. f is the target function, h is a hypothesis.',
            },
            {
              formula: '⟨?, Cold, High, ?, ?, ?⟩',
              reading:
                'A hypothesis as a tuple of constraints. ? means anything, ∅ means nothing, a value must match exactly.',
            },
          ]}
          legend={[
            { sym: 'Q1', name: '25th percentile', note: 'A quarter of the data sits below it.', val: 'part 15' },
            { sym: 'Q3', name: '75th percentile', note: 'Three quarters sit below it.', val: 'part 15' },
            {
              sym: 'IQR',
              name: 'Interquartile range',
              note: 'Q3 − Q1. Barely moves for one extreme value.',
              val: 'part 15',
            },
            { sym: 'μ', name: 'Mean', note: 'Say “mew”. Dragged by outliers, unlike the median.', val: 'part 16' },
            { sym: 'σ', name: 'Standard deviation', note: 'Say “sigma”. Also inflated by outliers.', val: 'part 16' },
            {
              sym: 'minA',
              name: 'Smallest value of attribute A',
              note: 'What min-max normalization is anchored to.',
              val: 'part 19',
            },
            {
              sym: 'new_minA',
              name: 'Bottom of the target range',
              note: 'Usually 0. The deck also names [−1, 1].',
              val: 'part 19',
            },
            { sym: 'W', name: 'Bin width', note: '(B − A)/N for equal-width partitioning.', val: 'part 21' },
            { sym: 'N', name: 'Number of intervals', note: 'The one thing you choose when binning.', val: 'part 21' },
            { sym: 'f', name: 'Target function', note: 'The true rule. Never observed.', val: 'part 23' },
            { sym: 'h', name: 'Hypothesis', note: 'A proposed function believed similar to f.', val: 'part 23' },
            {
              sym: '?',
              name: 'Anything will do',
              note: 'The most general constraint a hypothesis slot can hold.',
              val: 'part 24',
            },
            {
              sym: '∅',
              name: 'Nothing will do',
              note: 'One of these makes a hypothesis reject every example.',
              val: 'part 24',
            },
          ]}
        />
      </Explainers>

      <ConnectionMap topic="mllec2" />

      <UsedInAiml
        rows={[
          {
            what: 'The attribute type picks the encoder',
            how: 'Nominal goes through OneHotEncoder, ordinal through OrdinalEncoder. Getting it wrong tells a linear model that Delhi sits halfway between Bangalore and Mumbai, and it will fit a coefficient across that non-existent line.',
          },
          {
            what: 'Everything fitted goes inside the Pipeline',
            how: 'Scalers, imputers and encoders all learn numbers from data. Learn them before the split and the test rows have contributed to the numbers used on them, and the score you report is too high with nothing in the code looking wrong.',
          },
          {
            what: 'Scaling decides whether gradient descent converges',
            how: 'Columns on wildly different scales make the loss surface a long narrow valley, so one learning rate η is too big in one direction and too small in the other. Trees are the exception — they never compare across columns.',
          },
          {
            what: 'The IQR is what RobustScaler and the box plot are made of',
            how: 'Centre on the median, divide by the IQR, and one mis-keyed salary cannot rescale the column. The dots beyond a box plot’s whiskers are this same 1.5 × IQR rule, drawn.',
          },
          {
            what: 'stratify=y is one keyword and a different experiment',
            how: 'On a rare class an unstratified split can hand you a test fold with three positive rows, so recall moves in jumps of 33 percentage points — or none at all, at which point the metric is undefined.',
          },
          {
            what: 'Accuracy is the wrong metric on an imbalanced problem',
            how: 'At 95:5 a model that never predicts the rare class scores 95%. That is why such problems are reported with precision, recall and F1 for the rare class, and why class_weight and SMOTE exist.',
          },
          {
            what: 'A decision tree split is a bin boundary it chose itself',
            how: '“Age ≤ 37.5” is equal-anything binning with the edge picked to maximise information gain. Manual binning matters most for the models that cannot do it — naive Bayes and linear models.',
          },
          {
            what: 'The hypothesis space is model capacity',
            how: 'max_depth, hidden units, polynomial degree and the ridge λ are all controls on how much a model can say. Underfitting is a space too small to hold a good answer; overfitting is one large enough to hold many bad ones.',
          },
          {
            what: 'The train/test split is a test of the inductive learning hypothesis',
            how: 'It checks that a hypothesis fitting the training rows also fits rows it never saw — and the assumption fails outright under distribution shift, which is why a fraud model decays as fraudsters adapt.',
          },
        ]}
      />
    </div>
  )
}
