'use client'

/**
 * The two ideas ISM Lecture 3 introduces, taken out of the order they were
 * taught in and explained on their own terms. A chapter is for revising a
 * lecture; a concept is for the moment something will not click, or for a
 * later course that needs the idea and not the lecture around it.
 *
 * Both reuse the chapter's own labs rather than growing new ones, so a fix to
 * a lab is a fix everywhere it appears, and both end with links back to the
 * parts they were drawn from.
 */
import { BayesProofLab } from '@/components/charts/bayes-lab'
import { CondVennLab, IndependenceEquivLab } from '@/components/charts/cond-prob-lab'
import { LoanTableLab } from '@/components/charts/cond-table-lab'
import { BayesLab, PartitionLab, TotalProbLab } from '@/components/charts/total-prob-lab'
import { UsedInAiml } from './algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from './session-parts'
import { FromLecture } from './stats-concepts'

/* ========================================================================== */
/* Conditional probability                                                    */
/* ========================================================================== */

export function ConditionalConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Conditional probability: what a probability does when you learn something"
        intro="A probability is a statement about what you know. Find something out and it has to change. The rule for changing it is one line long, and almost everything else in probability is that line rearranged."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Suppose it rains on 30% of days. You look out of the window and the sky is grey. Nothing about the weather
            changed — but 30% is no longer the honest answer, because{' '}
            <strong>you are no longer picking from all the days of the year</strong>. You are picking from the cloudy
            ones.
          </>,
          <>
            That is the whole idea. Being told B happened throws away every outcome where B did not, and what is left
            has to be rescaled so it adds to 1 again. Dividing by P(B) is what performs the rescaling.
          </>,
        ]}
        mappings={[
          {
            title: 'The top does not move',
            body: 'P(A ∩ B) is measured against the whole sample space and is unaffected by what you were told.',
          },
          {
            title: 'The bottom is the news',
            body: 'P(B) is how much of the world survived. Smaller news, bigger answer.',
          },
          {
            title: 'The order matters',
            body: 'P(A | B) and P(B | A) sit over the same overlap and divide by different things. They are different questions.',
          },
        ]}
        footnote="Below, each circle's area is its probability. Conditioning washes out everything outside the circle you were told about, and the answer is the lens measured against what is left rather than against the whole box."
      />

      <div className="my-6">
        <CondVennLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        The same idea arrives far more often as a table than as a picture. Here the news is a row or a column, and the
        answer is a cell divided by that row or column total — the grand total cancels and never appears.
      </p>

      <div className="my-6">
        <LoanTableLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        There is one case where the news changes nothing at all, and it is important enough to have its own name.{' '}
        <strong>Independence</strong> is exactly P(A | B) = P(A) — and equivalently P(A ∩ B) = P(A)·P(B), because
        multiplying the first by P(B) gives the second. Move the overlap below and the two tests turn green together.
      </p>

      <div className="my-6">
        <IndependenceEquivLab />
      </div>

      <Explainers
        plain="P(A | B) means: the probability of A, in a world where B is known to have happened. Work it out by taking the probability that both happen and dividing by the probability of the thing you were told. The division is what makes B count as the new 100%. If the answer comes out the same as P(A), then B told you nothing and the two events are independent."
        breaks="It breaks when the two directions get swapped. P(disease | positive test) and P(positive test | disease) sit over the same overlap and divide by completely different things, and confusing them is why a very accurate test for a rare condition still produces mostly false alarms. It also breaks when mutually exclusive gets treated as independent: events that cannot both happen are as dependent as events get, because one occurring rules the other out entirely."
      >
        <MathBlock
          intro="Four lines. The first is the definition and the rest are it, rearranged."
          formulas={[
            {
              formula: 'P(A | B) = P(A ∩ B) / P(B)',
              reading:
                'The definition. Needs P(B) ≠ 0, since being told an impossible thing happened leaves no world to count in.',
            },
            {
              formula: 'P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)',
              reading:
                'The multiplication rule: the same line with the division cleared, written both ways round. Use whichever conditional you were given.',
            },
            {
              formula: 'P(A ∩ B′) = P(A) − P(A ∩ B)',
              reading:
                '"A but not B", which is never given directly. A splits into the part inside B and the part outside, and those two do not overlap.',
            },
            {
              formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B) ⟺ P(A | B) = P(A)',
              reading:
                'Two statements of one fact. The product form is the one to use: symmetric, and it needs no division.',
            },
          ]}
          legend={[
            {
              sym: 'P(A | B)',
              name: 'A given B',
              note: 'The bar is read "given". Never "divided by", and never "A by B".',
              val: 'the whole idea',
            },
            { sym: '∩', name: 'Intersection — and', note: 'The outcomes in both events at once.', val: 'the top' },
            {
              sym: 'P(B)',
              name: 'The conditioning event',
              note: 'How much of the world survived the news.',
              val: 'the bottom',
            },
            { sym: 'B′', name: 'Not B', note: 'The complement. Also written Bᶜ or B̄.', val: 'P(B′) = 1 − P(B)' },
            {
              sym: 'prior',
              name: 'Before',
              note: 'What you believed before the evidence arrived.',
              val: 'P(A)',
            },
            {
              sym: 'posterior',
              name: 'After',
              note: 'What you believe once it has.',
              val: 'P(A | B)',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Precision and recall are the two directions of one cell',
            how: 'Precision is P(really positive | predicted positive), recall is P(predicted positive | really positive). Same true positives on top, different margins underneath — swapping them is the classic evaluation bug.',
          },
          {
            what: 'Naive Bayes is built on the independence half',
            how: 'It replaces P(x₁ … xₙ | class) with a product of P(xᵢ | class), which is only legal when the features are conditionally independent. They are not, so the model ranks well and calibrates badly.',
          },
          {
            what: 'Every autoregressive model is a chain of conditionals',
            how: 'P(w₁ … wₙ) = Π P(wᵢ | w₁ … wᵢ₋₁). The context window is literally the list of events being conditioned on, and the product is summed in log space so it does not underflow.',
          },
          {
            what: 'Constrained decoding is conditioning, implemented',
            how: 'Masking a model down to legal tokens and renormalising is P(A | B) with B as the allowed set. Skip the renormalisation and every calibrated quantity downstream is quietly wrong.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism3/revise', label: 'ISM Lecture 3 · Why a probability gets revised' },
          { href: '/session/ism3/defn', label: 'The definition' },
          { href: '/session/ism3/table', label: 'Reading it off a table' },
          { href: '/session/ism3/independent', label: 'Independence' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */
/* Total probability and Bayes                                                */
/* ========================================================================== */

export function BayesConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Statistics · Concept"
        title="Total probability and Bayes' rule"
        intro="Two rules that always travel together. The first adds up every route to an outcome; the second uses that total to run the last step backwards, from the thing you can see to the thing you want to know."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Sometimes you cannot work out how likely something is directly, but you can work it out{' '}
            <strong>in each of a few separate cases</strong>. How often the mining job finishes on time if it rains, and
            how often if it does not. How often an ad gets clicked on a desktop, a tablet, a phone.
          </>,
          <>
            Cut the world into cases so that exactly one of them is true, work out the answer inside each, weight each
            by how likely that case was, and add. That is total probability — and once you have that total, Bayes can
            divide by it to answer the reverse question: given what happened, which case were you probably in?
          </>,
        ]}
        mappings={[
          {
            title: 'Slice the world',
            body: 'A partition: no gaps, no overlaps, exactly one slice true on each run.',
          },
          {
            title: 'Weight and add',
            body: 'P(B) = Σ P(Aᵢ)·P(B | Aᵢ). Every route to B, scaled by how likely that route was.',
          },
          {
            title: 'Turn the arrow round',
            body: 'P(Aᵢ | B) = P(B | Aᵢ)·P(Aᵢ) / P(B). The sum above is the denominator.',
          },
        ]}
        footnote="The two rules are one piece of machinery. Bayes cannot start without a denominator, and total probability is where the denominator comes from — which is why every worked Bayes question begins by computing a weighted sum."
      />

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        First the setup. A <strong>partition</strong> cuts the sample space into slices with no gaps and no overlaps.
        Drag the cuts: the event B does not move and its area never changes, but the way it is carved up does, and the
        pieces always add back to the same total.
      </p>

      <div className="my-6">
        <PartitionLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        That observation is the theorem. Below it is doing real work on four sets of numbers, each one a case where the
        answer is known inside every slice but not overall.
      </p>

      <div className="my-6">
        <TotalProbLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        Now the reverse. A wire carries 0s and 1s and sometimes flips one. You are holding the receiver, you can see
        what arrived, and you want to know what was sent. Watch the gap between the prior bar and the posterior bar:
        that gap is everything the evidence told you.
      </p>

      <div className="my-6">
        <BayesLab />
      </div>

      <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">
        Both rules come out of one argument, and it is short enough to be worth knowing. Step through it: A is written
        as its own intersection with the union of the slices, the distributive law cuts it into pieces, the pieces are
        shown to be disjoint so their probabilities may be added, and the definition of a conditional probability
        finishes it.
      </p>

      <div className="my-6">
        <BayesProofLab />
      </div>

      <Explainers
        plain="Split the possibilities into cases where exactly one is true. Work out how likely your event is inside each case, multiply by how likely the case was, and add them up — that is the overall probability. Bayes then asks the question the other way round: you saw the event, so which case were you probably in? Divide the one route you care about by the total of all the routes."
        breaks="Total probability breaks when the slices are not a real partition — overlapping cases get counted twice and missing ones are silently dropped, so the answer is not a probability of anything. Bayes breaks when the prior is ignored. A test that is right 95% of the time, applied to something that only happens 1% of the time, still produces far more false alarms than true ones, and no amount of accuracy in the test fixes that: it is the base rate, and it is exactly the P(A) in the numerator."
      >
        <MathBlock
          intro="Three lines, and the third needs the second."
          formulas={[
            {
              formula: 'S = A₁ ∪ … ∪ Aₖ,  Aᵢ ∩ Aⱼ = ∅',
              reading:
                'The partition. Exhaustive — the slices cover everything; and mutually exclusive — no two overlap. Both are needed.',
            },
            {
              formula: 'P(B) = Σ P(Aᵢ)·P(B | Aᵢ)',
              reading:
                'Total probability. Proved by writing B = B ∩ S, distributing over the slices, and adding the disjoint pieces.',
            },
            {
              formula: 'P(Aᵢ | B) = P(B | Aᵢ)·P(Aᵢ) / P(B)',
              reading:
                "Bayes' theorem. The multiplication rule written both ways round and rearranged, with the line above supplying P(B).",
            },
          ]}
          legend={[
            {
              sym: 'Aᵢ',
              name: 'The slices',
              note: 'The possible causes, cases or hypotheses.',
              val: 'a partition of S',
            },
            { sym: 'B', name: 'The evidence', note: 'The thing you actually observed.', val: 'any event' },
            {
              sym: 'P(Aᵢ)',
              name: 'Prior',
              note: 'How likely the cause was before you saw anything.',
              val: 'the base rate',
            },
            {
              sym: 'P(B | Aᵢ)',
              name: 'Likelihood',
              note: 'How well that cause explains what you saw.',
              val: 'usually what you are given',
            },
            {
              sym: 'P(B)',
              name: 'Evidence',
              note: 'How likely the observation was over all causes.',
              val: 'the denominator',
            },
            {
              sym: 'P(Aᵢ | B)',
              name: 'Posterior',
              note: 'What you believe about the cause once the evidence is in.',
              val: 'the answer',
            },
            { sym: 'Σ', name: 'Sum', note: 'Add the terms as the index runs over the slices.', val: 'i = 1 to k' },
            {
              sym: '∅',
              name: 'The empty set',
              note: 'Two slices overlapping in ∅ do not overlap.',
              val: 'no double counting',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The MAP hypothesis is Bayes with an argmax',
            how: 'argmax P(h | D) becomes argmax P(D | h)·P(h). The denominator P(D) is the same for every hypothesis, which is why implementations never compute it and compare unnormalised scores instead.',
          },
          {
            what: 'Marginalising a latent variable is total probability',
            how: 'P(x) = Σ P(x | z)P(z) sums over something you cannot observe. A Gaussian mixture computes exactly this for its density, and the E-step of EM divides by that same sum.',
          },
          {
            what: 'This is why variational inference exists',
            how: 'When the latent variable is continuous the sum becomes an intractable integral, so P(x) cannot be computed. The ELBO is a bound optimised in its place.',
          },
          {
            what: 'The softmax denominator is a sum over a partition',
            how: 'Classes are assumed exhaustive and mutually exclusive, which is what lets scores be divided by their total. An input belonging to no class still gets 1.0 distributed among them.',
          },
          {
            what: 'Base rates are why precision collapses on rare classes',
            how: 'A detector with excellent recall on a class that is 1% of the data still returns mostly false positives, because the prior sits in the numerator. Threshold tuning cannot remove it.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/ism3/partition', label: 'ISM Lecture 3 · Cutting S into slices' },
          { href: '/session/ism3/totalproof', label: 'The proof' },
          { href: '/session/ism3/totalexamples', label: 'Total probability at work' },
          { href: '/session/ism3/bayes', label: "Bayes' theorem" },
          { href: '/session/ism4/statement', label: 'ISM Lecture 4 · The general statement' },
          { href: '/session/ism4/proof', label: 'The proof in full' },
          { href: '/session/ism4/maphyp', label: 'h_MAP and h_ML' },
          { href: '/session/naivebayes', label: 'Concept · The Naive Bayes classifier' },
        ]}
      />
    </div>
  )
}
