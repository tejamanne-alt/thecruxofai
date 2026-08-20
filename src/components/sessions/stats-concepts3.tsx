'use client'

/**
 * The idea ISM Lecture 4 introduces that is not simply Bayes again: turning the
 * theorem into a classifier by assuming the features stop talking to each other
 * once the class is known.
 *
 * It reuses the chapter's own labs rather than growing new ones, so a fix to a
 * lab is a fix everywhere it appears, and it ends with links back to the parts
 * it was drawn from.
 */
import { CondIndepLab, NbRuleLab } from '@/components/charts/bayes-learn-lab'
import { DearFriendLab, LaplaceLab } from '@/components/charts/naive-bayes-lab'
import { UsedInAiml } from './algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from './session-parts'
import { FromLecture } from './stats-concepts'

export function NaiveBayesConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="The Naive Bayes classifier"
        intro="Bayes’ rule answers “which cause, given this one piece of evidence?”. A classifier has to answer “which class, given all of this?” — a whole email, a whole weather report. Nobody has ever seen that exact combination before, so the joint probability it needs cannot be counted. One assumption makes it countable, and that assumption is what the word naive is doing."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine a table with one row for every possible email. Not every word — every possible <em>combination</em>{' '}
            of words. To use Bayes directly you would need the probability of each row inside each class, and the table
            has more rows than there are atoms available to store it. Worse, your training data touches almost none of
            them, so nearly every entry would be an estimate made from nothing.
          </>,
          <>
            Naive Bayes refuses to build that table. It says: once I know the class, the features stop telling me
            anything about each other. That lets one impossible joint probability be replaced by a product of small ones
            — one per feature — each counted from the whole dataset. The assumption is nearly always false, and the
            method works anyway.
          </>,
        ]}
        mappings={[
          {
            title: 'The impossible table',
            body: 'P(X₁ … Xₙ | Y) needs 2ⁿ − 1 numbers per class for n yes/no features. At n = 20 that is over a million.',
          },
          {
            title: 'The assumption',
            body: 'P(Xᵢ | Xⱼ, Y) = P(Xᵢ | Y). Knowing another feature adds nothing once the class is known.',
          },
          {
            title: 'What it buys',
            body: 'The joint becomes Π P(Xᵢ | Y): n numbers per class, each counted from the whole dataset.',
          },
          {
            title: 'The rule',
            body: 'Ŷ = arg max P(Y)·Π P(Xᵢ | Y). Drop the shared denominator; it cannot change which score is largest.',
          },
        ]}
        footnote="The assumption is doing one job: it converts an estimation problem you cannot solve into n estimation problems you can. Everything that goes wrong with Naive Bayes — overconfidence, bad calibration, double-counted evidence — is the bill for it."
      />

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        First, what the assumption is worth. Drag the number of features up: the left number doubles at every step and
        the right one goes up by one. Then set the two conditionals apart and watch the assumption stop holding.
      </p>

      <div className="my-6">
        <CondIndepLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        With the assumption in place the rule is one prior multiplied by one factor per feature. Build the product a
        factor at a time, and watch both scores shrink towards zero as the features go in — which is why real
        implementations add logs instead of multiplying probabilities.
      </p>

      <div className="my-6">
        <NbRuleLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        Training is nothing but counting. Here is a word-count table built from twenty-four labelled words, and a
        message you can build out of them. Add <strong>Money</strong> and the verdict flips; add <strong>Lunch</strong>{' '}
        and something worse happens.
      </p>

      <div className="my-6">
        <DearFriendLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        That worse thing is the zero-frequency problem, and it is the one failure everybody meets. A feature never seen
        with a class makes that class score exactly zero, whatever the rest of the example says. Slide k from 0 to 1 and
        watch a verdict change with no new information at all.
      </p>

      <div className="my-6">
        <LaplaceLab />
      </div>

      <Explainers
        plain="A classifier has to judge a whole example at once, and the probability of a whole example inside a class is not something you can look up — that exact combination has probably never occurred. Naive Bayes assumes that once you know the class, the features are unrelated. Then the probability of the whole example is just the probabilities of its parts multiplied together, and each of those can be counted from the data. Score every class that way, take the biggest, and you have a prediction. Add 1 to every count first, so that something never seen is treated as unlikely rather than impossible."
        breaks="It breaks on a zero: one unseen feature value silences a whole class, which is what smoothing exists to prevent. It breaks when features duplicate each other, because the product treats a repeated fact as independent confirmation and the winning score races towards 1 — so the ranking survives and the probability does not. And the assumption itself is essentially never true: words come in phrases, weather attributes move together, symptoms cluster. That is tolerable when you only want the argmax, and it is not tolerable when you are going to threshold on the number."
      >
        <MathBlock
          intro="Four lines. The second is the only one that is not exact."
          formulas={[
            {
              formula: 'P(Y | X₁ … Xₙ) = P(Y)·P(X₁ … Xₙ | Y) / P(X₁ … Xₙ)',
              reading:
                'Bayes, with a feature vector in the evidence slot. Nothing assumed yet, and nothing computable yet either.',
            },
            {
              formula: 'P(X₁ … Xₙ | Y) = Πⱼ P(Xⱼ | Y)',
              reading:
                'The naive assumption: conditional independence of the features given the class. This is the only inexact step, and it is what makes the rest possible.',
            },
            {
              formula: 'Ŷ ← arg max P(Y = yₖ)·Πᵢ P(Xᵢ | Y = yₖ)',
              reading:
                'The classification rule. The denominator is the same for every class, so it is dropped — you need it only if you want a calibrated probability rather than a decision.',
            },
            {
              formula: 'P(Xᵢ = v | Y) = (count + k) / (total + k·V)',
              reading:
                'Laplace smoothing, with k = 1 the usual choice and V the number of distinct values. The k·V in the denominator is what keeps the fractions summing to 1.',
            },
          ]}
          legend={[
            {
              sym: 'X',
              name: 'Feature vector',
              note: 'Everything measured about one example, in a fixed order.',
              val: 'the evidence',
            },
            { sym: 'Xᵢ', name: 'One feature', note: 'One word, one attribute, one measurement.', val: 'n of them' },
            {
              sym: 'Y',
              name: 'Class label',
              note: 'The answer being predicted, from a fixed list.',
              val: 'the hypothesis',
            },
            { sym: 'Ŷ', name: 'Y-hat', note: 'The prediction, as opposed to the truth.', val: 'the output' },
            {
              sym: 'Π',
              name: 'Product',
              note: 'Multiply the terms as the index runs. The twin of Σ.',
              val: 'i = 1 to n',
            },
            {
              sym: 'arg max',
              name: 'The argument that maximises',
              note: 'Returns which class, not how big the score was.',
              val: 'over the classes',
            },
            {
              sym: 'k',
              name: 'Smoothing constant',
              note: 'Added to every count. 1 is Laplace; smaller is Lidstone.',
              val: 'alpha in sklearn',
            },
            {
              sym: 'V',
              name: 'Vocabulary size',
              note: 'How many distinct values the feature can take.',
              val: 'added to the total',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It is the baseline every text classifier is measured against',
            how: 'CountVectorizer plus MultinomialNB trains in one pass over data too large to hold in memory, and a gradient-boosted model that cannot beat it is telling you the features are wrong rather than the optimiser. It is also updateable one example at a time, which is why partial_fit exists on this class.',
          },
          {
            what: 'The assumption is the curse of dimensionality, dodged',
            how: '2ⁿ − 1 numbers per class become n. A Bayesian network is the middle road — keep the dependencies you believe in and drop the rest — and Naive Bayes is its extreme case, with the class as the only parent of every feature.',
          },
          {
            what: 'Smoothing is a hyper-parameter, not a formality',
            how: 'alpha in MultinomialNB defaults to 1.0, and on a 50,000-word vocabulary that adds 50,000 to every denominator and swamps the counts. Lidstone smoothing with alpha well below 1 is the usual fix, and alpha = 0 reproduces the zero-frequency failure exactly.',
          },
          {
            what: 'The product underflows, so implementations add logs',
            how: 'Every factor is at most 1, so a few hundred features drive a double to zero and every class scores the same nothing. predict_log_proba returns the sum of logs instead, and normalising it needs the log-sum-exp trick to avoid a NaN.',
          },
          {
            what: 'Correlated features cost calibration, not ranking',
            how: 'Two features that say the same thing get multiplied in twice, so the winning posterior is pushed towards 1. AUC and accuracy survive; the probability does not, which is what CalibratedClassifierCV with Platt scaling or isotonic regression is for.',
          },
          {
            what: 'It is the generative half of a pairing that runs through the ML course',
            how: 'Naive Bayes models P(X | Y) and P(Y) then inverts; logistic regression models P(Y | X) directly. On the same binary features they compute the same shape of function, and the generative one reaches its lower ceiling on far less data.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism4/condindep', label: 'ISM Lecture 4 · Conditional independence' },
          { href: '/session/ism4/nbrule', label: 'The classification rule' },
          { href: '/session/ism4/dearfriend', label: 'Worked: is “Dear Friend” spam?' },
          { href: '/session/ism4/laplace', label: 'Laplace smoothing' },
          { href: '/session/ism4/textclass', label: 'Naive Bayes for text' },
        ]}
      />
    </div>
  )
}
