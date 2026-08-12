'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Ism3Overview() {
  const parts = partsOf('ism3')

  return (
    <div>
      <SessionHeader
        eyebrow="Introduction to Statistical Methods · Chapter"
        title="Lecture 3 — Conditional probability, independence and Bayes"
        intro="Lecture 2 worked out probabilities and left them there. This one is about what happens when you find something out afterwards. It starts with a single definition, spends most of its length showing that almost every question in the deck is that definition with one line of set algebra in front of it, and finishes by running it backwards. Every part has something to drag, press or count."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            The whole lecture comes out of one move. Being told that B happened{' '}
            <strong>throws away every outcome outside B</strong>, so B becomes the new 100% and you count inside it
            instead of inside the whole sample space. Dividing by P(B) is what performs that promotion.
          </>,
          <>
            Everything after that is bookkeeping on the same idea. Rearrange it and you can walk down a tree. Ask when
            the news changes nothing and you get independence. Cut the world into slices and add up the routes to an
            event and you get total probability. Turn the last arrow round and you get Bayes.
          </>,
        ]}
        mappings={[
          {
            title: 'Shrink the sample space',
            body: 'P(A | B) = P(A ∩ B) / P(B). The top is unchanged by the news; the bottom is the news.',
          },
          {
            title: 'Multiply along a path',
            body: 'The same rule rearranged: P(A ∩ B) = P(A)·P(B | A), chained down as many stages as you like.',
          },
          {
            title: 'Add up the routes',
            body: 'Slice the world so exactly one slice is true, then weight each conditional by its slice and add.',
          },
          {
            title: 'Run the arrow backwards',
            body: 'You know P(effect | cause) and want P(cause | effect). That is Bayes, and its denominator is the sum above.',
          },
        ]}
        footnote="One line carries the whole lecture: P(A | B) = P(A ∩ B) / P(B). Part 2 builds it by counting, so the division explains itself rather than having to be remembered — the size of the sample space cancels, and what is left is a count out of B."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each one is its own page with something to operate, and they are all in the left menu too.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/ism3/${p.id}`}
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
        plain="A probability describes what you know, so it changes when you learn something. Being told B happened rules out everything where B did not, and you count inside what is left — that is all P(A | B) means. Rearranging that one definition gives you a rule for multiplying along a chain of events, a test for when news makes no difference at all, a way of adding up several routes to the same outcome, and finally a way of asking which route you probably took."
        breaks="It breaks when P(A | B) and P(B | A) get swapped — same overlap, different denominator, and often wildly different answers. It breaks when mutually exclusive is treated as independent; they are opposites, since exclusive events tell you everything about each other. And it breaks when a rare cause meets a good test: the base rate does not go away just because the evidence is strong, which is why the binary channel in part 15 lands at 0.86 and not at the channel's own 0.95."
      >
        <MathBlock
          intro="Seven lines carry the whole lecture. Each part above is one of them, explained slowly."
          formulas={[
            {
              formula: 'P(A | B) = P(A ∩ B) / P(B)',
              reading:
                'The definition, and the only new idea in the lecture. Needs P(B) ≠ 0 — being told an impossible thing happened leaves no world to count in.',
            },
            {
              formula: 'P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)',
              reading:
                'The multiplication rule: the definition with the division cleared. Both forms are the same fact, and you pick whichever conditional the question gives you.',
            },
            {
              formula: 'P(A ∩ B ∩ C) = P(A)·P(B | A)·P(C | A ∩ B)',
              reading:
                'Chained to three events by treating A ∩ B as a single event. Each factor is conditioned on everything to its left.',
            },
            {
              formula: 'P(A ∩ B′) = P(A) − P(A ∩ B)',
              reading:
                'How to get "A but not B", which you are never given directly. A splits into the part inside B and the part outside it.',
            },
            {
              formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B) ⟺ P(A | B) = P(A)',
              reading:
                'Two definitions, one statement — board page 8 proves each from the other. The product form is the one to use: symmetric, and no division.',
            },
            {
              formula: 'P(B) = Σ P(Aᵢ)·P(B | Aᵢ)',
              reading:
                'Total probability. Valid when the Aᵢ are mutually exclusive and exhaustive: every route to B, weighted by how likely that route was.',
            },
            {
              formula: 'P(A | B) = P(B | A)·P(A) / P(B)',
              reading:
                "Bayes' theorem. The multiplication rule written both ways round and rearranged, with the line above supplying the denominator.",
            },
          ]}
          legend={[
            {
              sym: 'P(A | B)',
              name: 'A given B',
              note: 'Read the bar as "given". Never as "divided by", and never as "A by B".',
              val: 'part 2',
            },
            { sym: '∩', name: 'Intersection — and', note: 'The outcomes in both events at once.', val: 'part 2' },
            { sym: '∪', name: 'Union — or', note: 'In one, or the other, or both.', val: 'part 6' },
            { sym: 'B′', name: 'Not B', note: 'The complement. Also written Bᶜ or B̄.', val: 'part 6' },
            { sym: '⊆', name: 'Is contained in', note: 'B ⊆ A means B happening forces A to happen.', val: 'part 5' },
            {
              sym: '∅',
              name: 'The empty set',
              note: 'Nothing in it. Two events overlapping in ∅ do not overlap.',
              val: 'part 12',
            },
            { sym: 'Σ', name: 'Sum', note: 'Add up the terms as the index runs over the slices.', val: 'part 13' },
            {
              sym: 'Aᵢ',
              name: 'The slices',
              note: 'A partition of S: no gaps, no overlaps, exactly one true each run.',
              val: 'part 12',
            },
            { sym: 'prior', name: 'Before the news', note: 'P(A), what you believed to start with.', val: 'part 1' },
            {
              sym: 'posterior',
              name: 'After the news',
              note: 'P(A | B), what you believe once the evidence is in.',
              val: 'parts 1, 15',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Bayes is the whole of Bayesian learning',
            how: 'The ML course asks for the MAP hypothesis, argmax P(h | D). Bayes turns it into P(D | h)·P(h) — likelihood times prior — which is the rule in part 15 with the argmax taken over hypotheses.',
          },
          {
            what: 'Naive Bayes is the independence assumption, named',
            how: 'It replaces P(x₁ … xₙ | class) with a product of P(xᵢ | class), which is legal only under the conditional independence of part 7. It is usually false, which is why the classifier ranks well and calibrates badly.',
          },
          {
            what: 'Precision and recall are one cell over two denominators',
            how: 'The two-way table in part 4 is a confusion matrix. Precision divides the true positives by the predicted-positive row, recall by the actual-positive column — the same swap the lecture warns about.',
          },
          {
            what: 'The chain rule is how a language model writes',
            how: 'P(w₁ … wₙ) = Π P(wᵢ | w₁ … wᵢ₋₁) is part 3 extended to as many stages as there are tokens. It is also why implementations sum log-probabilities: the product underflows.',
          },
          {
            what: 'Marginalising is total probability',
            how: 'P(x) = Σ P(x | z)P(z) sums over a latent variable you cannot observe. A Gaussian mixture computes exactly this, and part 13 is its proof for a finite partition.',
          },
          {
            what: 'The softmax denominator assumes a partition',
            how: 'Classes are supposed to be exhaustive and mutually exclusive, which is what lets the scores be divided by their total. Part 12 is why an input belonging to no class still gets a confident answer.',
          },
          {
            what: 'Base rates are why a good test can still be wrong',
            how: 'The channel in part 15 has 95% reliability and still gives only 0.86 for a signal sent 40% of the time. The same arithmetic is why precision collapses on a rare class however good the recall looks.',
          },
        ]}
      />

      <ConnectionMap topic="ism3" />
    </div>
  )
}
