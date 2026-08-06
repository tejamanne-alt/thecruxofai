'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Ism2Overview() {
  const parts = partsOf('ism2')

  return (
    <div>
      <SessionHeader
        eyebrow="Introduction to Statistical Methods · Chapter"
        title="Lecture 2 — Probability: events, axioms and the addition rule"
        intro="Lecture 1 described data you already had. This one is about data you have not seen yet. It builds probability from the ground up: what a random experiment is, how to write down everything that could happen, and the handful of rules that let you work with it. Every part has something to drag, press or count."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Probability starts with an oddly simple move: <strong>write down everything that could happen</strong>. Roll
            a die and that list is 1, 2, 3, 4, 5, 6. It is called the sample space, and once you have it, most questions
            become counting questions.
          </>,
          <>
            The rest of the lecture is about combining those lists. What if I want A <em>or</em> B? A <em>and</em>{' '}B?
            Not A? Each one is a set operation with a probability attached, and there are only a few rules to learn —
            plus two words, <strong>mutually exclusive</strong> and <strong>independent</strong>, that sound alike and
            mean entirely different things.
          </>,
        ]}
        mappings={[
          {
            title: 'Write down what could happen',
            body: 'The sample space S. Every answer later on is a count of some part of this list.',
          },
          {
            title: 'Pick out what you care about',
            body: 'An event is just part of that list. Its probability is its share of the whole.',
          },
          {
            title: 'Combine them safely',
            body: 'Or, and, not. The addition rule handles "or", and the trap is forgetting to subtract the overlap.',
          },
        ]}
        footnote="One line is worth carrying through the whole lecture: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). You subtract because everything in the middle got counted twice. Part 5 draws it as a real area so you can watch it happen."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each one is its own page with something to operate, and they are all in the left menu too.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/ism2/${p.id}`}
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
        plain="Write down every possible outcome. That list is the sample space. An event is part of the list, and its probability is its share of the whole. Then there are rules for combining events: add for or, subtract the overlap so nothing is counted twice, and take things off 1 when the opposite is easier to count."
        breaks="It breaks when the outcomes are not equally likely and you count anyway — the classic case is assuming the eleven possible sums of two dice are all as likely as each other, when there are really 36 outcomes and they are not. It also breaks when people treat mutually exclusive and independent as the same thing. They are opposites in spirit: exclusive events tell you a great deal about each other."
      >
        <MathBlock
          intro="Seven lines carry the whole lecture. Each part above is one of them, explained slowly."
          formulas={[
            {
              formula: 'S = { all possible outcomes }',
              reading:
                'The sample space. Write this down before anything else. Exactly one of its outcomes happens on each run.',
            },
            {
              formula: 'P(A) = |A| / |S|',
              reading:
                'Classical probability: count what you want, divide by the total. Only valid when every outcome is equally likely.',
            },
            {
              formula: 'P(S) = 1,   0 ≤ P(E) ≤ 1',
              reading:
                'The first two axioms. Something happens, and nothing is less likely than impossible or more likely than certain.',
            },
            {
              formula: 'P(A) + P(Aᶜ) = 1',
              reading:
                'The complement rule. Often the fastest route in: work out the easy side and take it off 1. "At least one" is nearly always a hint to do this.',
            },
            {
              formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
              reading:
                'The addition rule. You subtract because everything in the overlap was counted once in A and again in B.',
            },
            {
              formula: 'mutually exclusive ⟺ P(A ∩ B) = 0',
              reading:
                'They cannot both happen, so the circles do not touch and the addition rule loses its last term.',
            },
            {
              formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B)',
              reading:
                'Knowing one happened leaves the other exactly as likely as before. A different question from the line above, and usually a different answer.',
            },
          ]}
          legend={[
            { sym: 'S', name: 'Sample space', note: 'Everything that could happen, written as a set.', val: 'part 2' },
            {
              sym: 'A, B',
              name: 'Events',
              note: 'Parts of the sample space — the outcomes you care about.',
              val: 'part 3',
            },
            { sym: '|A|', name: 'How many', note: 'The number of outcomes in A.', val: 'part 3' },
            { sym: 'Aᶜ', name: 'Complement', note: 'Everything not in A. Also written A′ or Ā.', val: 'part 4' },
            { sym: '∪', name: 'Union — or', note: 'In A, or in B, or in both. The "or" includes both.', val: 'part 5' },
            { sym: '∩', name: 'Intersection — and', note: 'In both A and B.', val: 'part 5' },
            { sym: '∅', name: 'The empty set', note: 'Nothing in it. P(∅) = 0.', val: 'part 3' },
            {
              sym: 'C(n,k)',
              name: 'Combination',
              note: 'Ways to choose k from n when order does not matter.',
              val: 'part 13',
            },
            { sym: 'n!', name: 'Factorial', note: 'n × (n−1) × … × 1. And 0! = 1.', val: 'part 13' },
            {
              sym: '⟺',
              name: 'If and only if',
              note: 'Each side is true exactly when the other is.',
              val: 'used in the tests',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Every model output is a probability',
            how: 'A classifier does not say "cat" — it says 0.93 cat, 0.07 dog. Those numbers obey the axioms in part 8, which is why they always sum to 1.',
          },
          {
            what: 'Independence is the assumption behind Naive Bayes',
            how: 'It treats every feature as independent given the class, which is usually false and works anyway. Knowing what independence claims is how you know when it will fail.',
          },
          {
            what: 'Sample spaces become feature spaces',
            how: 'The three-phone-call example in part 2 has 8 outcomes. Swap calls for binary features and you have the exponential blow-up behind the curse of dimensionality.',
          },
          {
            what: 'The complement trick is everywhere in code',
            how: '"At least one" is computed as 1 minus "none", from dropout to reliability to the chance a hash collides. Part 4 is why.',
          },
          {
            what: 'Two-way tables are confusion matrices',
            how: 'Practice question 9 is a grid of proportions. A confusion matrix is exactly that — and precision and recall are two different ways of adding up its cells.',
          },
          {
            what: 'This lecture sets up Bayes',
            how: 'Module 2 is conditional probability. It is built directly on the intersection from part 5 — P(A | B) is the overlap divided by P(B).',
          },
        ]}
      />
    </div>
  )
}
