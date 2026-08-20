'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Ism4Overview() {
  const parts = partsOf('ism4')

  return (
    <div>
      <SessionHeader
        eyebrow="Introduction to Statistical Methods · Chapter"
        title="Lecture 4 — Bayes’ theorem and Naive Bayes"
        intro="Lecture 3 ended on Bayes. This session states it properly, proves it in nine lines, and then spends the rest of its length turning it into a machine that classifies things. One assumption is added — that the features stop talking to each other once the class is known — and everything after that is counting, multiplying and comparing. Every part has something to drag, press or build."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Bayes on its own is a way of running an arrow backwards. You know how often each cause produces the effect;
            you have just seen the effect; you want to know <strong>which cause you probably had</strong>. Add up every
            route to the effect, and your answer is the route you care about as a share of that total.
          </>,
          <>
            Turning that into a classifier needs one more idea, and it is the only unsound step in the whole session.
            The evidence is no longer a single event but a list of features, and nobody has ever seen this exact list
            before. So Naive Bayes assumes the features are independent once the class is known, which lets one
            impossible joint probability be replaced by a product of small ones you can count.
          </>,
        ]}
        mappings={[
          {
            title: 'Add up the routes',
            body: 'P(A) = Σ P(Eᵢ)·P(A | Eᵢ). The rule of total probability, proved in part 2 and used as the denominator ever after.',
          },
          {
            title: 'Turn the arrow round',
            body: 'P(Eᵢ | A) = P(Eᵢ)P(A | Eᵢ) / P(A). One route over all routes, so the answers always add to 1.',
          },
          {
            title: 'Swap the joint for a product',
            body: 'P(X₁ … Xₙ | Y) = Π P(Xᵢ | Y). The naive assumption: 2ⁿ − 1 numbers per class become n.',
          },
          {
            title: 'Take the biggest',
            body: 'Ŷ = arg max P(Y)·Π P(Xᵢ | Y). The denominator is shared, so it never changes the winner and is simply dropped.',
          },
        ]}
        footnote="One line carries the whole session: a posterior is one route to the evidence divided by every route to the evidence. Part 2 builds it from four set-algebra moves, so the fraction explains itself instead of having to be remembered."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each one is its own page with something to operate, and they are all in the left menu too.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/ism4/${p.id}`}
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
        plain="You know how often each cause leads to a particular effect, and you have just seen the effect. Bayes turns that round: work out how likely the effect was overall by adding up every route to it, then read your answer as one route divided by that total. The second half of the session makes the evidence a list of features rather than one event — a whole email, a whole weather report — and assumes the features are unrelated once the class is known, which is what turns a table nobody could fill in into a handful of counts anybody can."
        breaks="It breaks on a zero. One feature never seen with a class makes that class score exactly zero, whatever else the example says, and the deck watches it happen before adding 1 to every count. It breaks when features repeat what each other say, because the product counts the same evidence twice and the answer races towards certainty. And it breaks when a rare cause meets a strong likelihood: the base rate does not go away, which is why a filter that detects 99% of spam still throws away one good email in every twenty-one it flags."
      >
        <MathBlock
          intro="Seven lines carry the whole session. Each part above is one of them, explained slowly."
          formulas={[
            {
              formula: 'P(A) = Σᵢ₌₁ⁿ P(Eᵢ)·P(A | Eᵢ)',
              reading:
                'The rule of total probability, which the deck also calls the rule of elimination. Needs the Eᵢ mutually exclusive with A ⊆ ⋃ Eᵢ. It is the denominator of everything that follows.',
            },
            {
              formula: 'P(Eᵢ | A) = P(Eᵢ)·P(A | Eᵢ) / Σⱼ P(Eⱼ)·P(A | Eⱼ)',
              reading:
                'Bayes’ theorem. One route to A over every route to A — which is why the posteriors always add to exactly 1.',
            },
            {
              formula: 'P(H | E) = P(E | H)·P(H) / P(E)',
              reading:
                'The same thing with hypothesis-shaped names: posterior, likelihood, prior, evidence. P(E) is a normalisation constant, shared by every hypothesis.',
            },
            {
              formula: 'h_MAP = arg max P(D | h)·P(h)',
              reading:
                'The most probable hypothesis given the data. P(D) has been dropped because it does not depend on h and so cannot reorder the candidates.',
            },
            {
              formula: 'h_ML = arg max P(D | hᵢ)',
              reading:
                'Maximum likelihood. h_MAP with the priors assumed equal, so P(h) drops out too. An extra assumption, not a simplification.',
            },
            {
              formula: 'P(X₁ … Xₙ | Y) = Πⱼ₌₁ⁿ P(Xⱼ | Y)',
              reading:
                'Conditional independence — the naive assumption. 2ⁿ − 1 numbers per class collapse to n. This is the only step in the session that is not exact.',
            },
            {
              formula: 'Ŷ ← arg max P(Y = yₖ)·Πᵢ P(Xᵢ | Y = yₖ)',
              reading:
                'The classifier. One prior times one factor per feature; take the biggest. In code it is a sum of logs, because the product underflows.',
            },
          ]}
          legend={[
            {
              sym: 'Eᵢ',
              name: 'The slices',
              note: 'Mutually exclusive causes covering everything A can do. Later they become the classes.',
              val: 'part 1',
            },
            { sym: '⋃', name: 'Union over a list', note: 'E₁ or E₂ or … or Eₙ. The big version of ∪.', val: 'part 1' },
            {
              sym: '⊆',
              name: 'Is contained in',
              note: 'A ⊆ ⋃ Eᵢ says A cannot happen outside the slices.',
              val: 'part 1',
            },
            { sym: 'Σ', name: 'Sum', note: 'Add the terms as the index runs.', val: 'part 1' },
            { sym: 'Π', name: 'Product', note: 'Multiply the terms as the index runs. The twin of Σ.', val: 'part 11' },
            {
              sym: 'prior',
              name: 'P(Eᵢ), P(h), P(Y)',
              note: 'What you believed before the evidence arrived.',
              val: 'parts 1, 6',
            },
            {
              sym: 'likelihood',
              name: 'P(A | Eᵢ), P(D | h)',
              note: 'How likely the evidence is inside one slice. Not a probability of the slice.',
              val: 'parts 1, 6',
            },
            {
              sym: 'evidence',
              name: 'P(A), P(E), P(X)',
              note: 'The shared denominator. Decides the numbers, never the winner.',
              val: 'parts 6, 10',
            },
            {
              sym: 'arg max',
              name: 'The argument that maximises',
              note: 'Returns the h, not the value.',
              val: 'part 8',
            },
            { sym: 'Ŷ', name: 'Y-hat', note: 'A prediction, as opposed to the truth.', val: 'part 12' },
            {
              sym: 'V',
              name: 'Vocabulary size',
              note: 'How many distinct words there are. Added to every total when smoothing.',
              val: 'part 17',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Naive Bayes is a classifier you can still build by hand',
            how: 'Parts 13 to 18 are four complete training runs of scikit-learn’s MultinomialNB and CategoricalNB, done on paper: count, tabulate, multiply one factor per feature, take the argmax. There is no gradient and no iteration, which is why it is the standard baseline on a new text problem.',
          },
          {
            what: 'The denominator is the softmax denominator',
            how: 'P(X) = Σ P(X | Cᵢ)P(Cᵢ) is shared by every class, so it rescales the scores and cannot reorder them. A softmax layer does the same division on exponentiated logits, and it bakes in the same assumption: the classes must be mutually exclusive and exhaustive.',
          },
          {
            what: 'MAP against ML is regularised against unregularised',
            how: 'Adding λ‖w‖² to a loss is exactly a MAP estimate under a Gaussian prior on the weights; λ‖w‖₁ is a Laplace prior, which is lasso. Setting λ = 0 is assuming a flat prior, which is the h_MAP → h_ML step on slide 20.',
          },
          {
            what: 'The zero-frequency problem is the alpha hyper-parameter',
            how: 'Part 14 watches one 0/7 wipe out an entire class, and Laplace smoothing flip the verdict. That is alpha in MultinomialNB, and the same fix runs from add-one through Good–Turing to Kneser–Ney in n-gram language models.',
          },
          {
            what: 'Conditional independence is the curse of dimensionality, dodged',
            how: 'Part 11 counts it: 2ⁿ − 1 numbers per class without the assumption, n with it. A Bayesian network is the middle road — keep the arrows you believe in, and Naive Bayes is the extreme case where the class is the only parent.',
          },
          {
            what: 'The products underflow, so implementations take logs',
            how: 'Part 12 shows both scores shrinking by a factor of three per feature. At a few hundred features a double underflows to zero, which is why predict_log_proba exists and why normalising needs the log-sum-exp trick.',
          },
          {
            what: 'Correlated features cost calibration, not ranking',
            how: 'Part 19 counts one word twice and watches the posterior race towards 1 with no new information. That is why Naive Bayes ranks well and calibrates badly, and why CalibratedClassifierCV fits Platt scaling or isotonic regression on top of it.',
          },
          {
            what: 'Base rates decide what a detector is worth',
            how: 'Part 5 computes P(not spam | flagged) = 5/104 and then watches it pass one in two as the base rate falls. That is precision collapsing on a rare class, and the reason a precision–recall curve replaces the ROC curve there.',
          },
        ]}
      />

      <ConnectionMap topic="ism4" />
    </div>
  )
}
