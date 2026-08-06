'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Ism1Overview() {
  const parts = partsOf('ism1')

  return (
    <div>
      <SessionHeader
        eyebrow="Introduction to Statistical Methods · Chapter"
        title="Lecture 1 — Describing data: centre, spread and outliers"
        intro="You have a pile of numbers. This lecture is about saying something useful about them without reading every one. Where is the middle? How spread out are they? Which way do they lean? And is anything in there odd enough to worry about? Every part has something you can drag or press."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Say you time how long it takes you to get ready in the morning, every day for ten days. You end up with ten
            numbers. Nobody wants to read ten numbers. They want to know: <em>roughly how long does it take?</em> and{' '}
            <em>how much does it vary?</em>
          </>,
          <>
            That is the whole of this lecture. The first question is answered by the <strong>mean</strong>, the{' '}
            <strong>median</strong> or the <strong>mode</strong>. The second by the <strong>range</strong>, the{' '}
            <strong>standard deviation</strong> or the <strong>quartiles</strong>. You need both. Two sets of numbers
            can have exactly the same middle and still be nothing alike.
          </>,
        ]}
        mappings={[
          {
            title: 'Where is the middle?',
            body: 'Mean, median and mode. Three different answers to the same question, and they often disagree.',
          },
          {
            title: 'How spread out is it?',
            body: 'Range, variance, standard deviation, and the gap between the quartiles.',
          },
          {
            title: 'Is anything odd in there?',
            body: 'One value far from the rest can drag the mean about. Box plots are how you spot them.',
          },
        ]}
        footnote="Statistics is decision-making driven by data: collect it, organise it, look at it, work out what it says, then act. This lecture is the “look at it” step, and skipping it is how people end up fooled by their own numbers."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each one is its own page with something to play with. They are listed in the left menu too, so you can come back
        to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/ism1/${p.id}`}
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
        plain="Describing data means answering three questions. Where is the middle? How spread out is it? What shape is it? The mean, median and mode answer the first. The range, standard deviation and quartiles answer the second. Comparing the first two answers tells you the third."
        breaks="It breaks when one value is a long way from the rest. The mean chases it, the range doubles, and the standard deviation blows up — while the median and the quartiles barely notice. That is not a flaw, it is the reason there is more than one measure. Pick the one that suits your data, and say which one you picked."
      >
        <MathBlock
          intro="Seven lines carry the whole lecture. Every part above is one of these being explained slowly."
          formulas={[
            {
              formula: 'x̄ = Σx / n',
              reading:
                'The mean. Add everything up and divide by how many there are. The bar over the x is what "mean of" looks like in writing.',
            },
            {
              formula: 'x̄ = Σ(f·x) / N',
              reading:
                'The mean when values come with counts. Multiply each value by how often it happened, add those up, divide by the total count.',
            },
            {
              formula: 'Σ(x − x̄) = 0',
              reading:
                'The distances from the mean always cancel out. That is what makes the mean a balance point — and why you cannot just average the distances to measure spread.',
            },
            {
              formula: 'SS = Σ(x − x̄)²',
              reading:
                'The sum of squares. Square each distance first so the negatives stop cancelling, then add them up.',
            },
            {
              formula: 's² = SS / (n − 1),   s = √s²',
              reading:
                'Sample variance and sample standard deviation. The n − 1 is there because a sample sits closer to its own mean than to the real one, so dividing by n would come out too small.',
            },
            {
              formula: 'IQR = Q3 − Q1',
              reading:
                'The spread of the middle half of the data. It ignores the ends completely, which is exactly why one odd value cannot upset it.',
            },
            {
              formula: 'Q1 − 1.5·IQR   and   Q3 + 1.5·IQR',
              reading:
                'The two fences. Anything outside them is flagged as a possible outlier — worth a look, not automatically a mistake.',
            },
          ]}
          legend={[
            { sym: 'x̄', name: 'The mean', note: 'Said "x bar". The arithmetic average.', val: 'part 4' },
            {
              sym: 'n',
              name: 'How many values',
              note: 'In a sample. A capital N usually means the whole population.',
              val: 'part 11',
            },
            {
              sym: 'Σ',
              name: 'Add up',
              note: 'Said "sigma". It means add together everything that follows.',
              val: 'used throughout',
            },
            { sym: 'f', name: 'Frequency', note: 'How many times a value turned up.', val: 'part 4' },
            {
              sym: 'SS',
              name: 'Sum of squares',
              note: 'Every distance from the mean, squared, then added up.',
              val: 'part 10',
            },
            {
              sym: 's',
              name: 'Sample standard deviation',
              note: 'The typical distance from the mean, in the original units.',
              val: 'part 10',
            },
            {
              sym: 'σ',
              name: 'Population standard deviation',
              note: 'Said "sigma". The same idea, for a whole population.',
              val: 'part 11',
            },
            {
              sym: 'Q1, Q3',
              name: 'The quartiles',
              note: 'The 25% and 75% marks. Q2 is another name for the median.',
              val: 'part 12',
            },
            { sym: 'IQR', name: 'Interquartile range', note: 'Q3 − Q1. The width of the middle half.', val: 'part 13' },
            { sym: 'QD', name: 'Quartile deviation', note: 'The IQR halved.', val: 'part 13' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'This is the first thing done to any dataset',
            how: 'Before any model is trained, somebody works out the mean, the spread and the outliers of every column. It is where you find the broken sensor and the missing values coded as −999.',
          },
          {
            what: 'Standardising features is the mean and the SD',
            how: '(x − mean) / s is applied to nearly every column before training. Models that measure distance are badly thrown off when one feature is in millions and another in tenths.',
          },
          {
            what: 'Outliers decide what your model learns',
            how: 'Anything that squares its errors — linear regression, k-means — is dragged hard by one extreme value, for exactly the reason the squares in part 10 get so big.',
          },
          {
            what: 'Skew is why people take logs',
            how: 'When data has a long tail to the right, taking the log pulls the tail in and makes the mean a fair summary again. You saw the problem in part 7.',
          },
          {
            what: 'Median and IQR are the robust pair',
            how: 'When data is messy, people report the median and the IQR instead of the mean and the SD, because those two barely move when a few values are wild.',
          },
          {
            what: 'n − 1 turns up again and again',
            how: 'The same correction appears in variance, in covariance, and in every place where you estimate something from a sample instead of measuring the whole population.',
          },
        ]}
      />
    </div>
  )
}
