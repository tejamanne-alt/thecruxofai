/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  BagsLab,
  ChainLab,
  CondVennLab,
  IndependenceEquivLab,
  ReviseLab,
  SubsetLab,
} from '@/components/charts/cond-prob-lab'
import {
  AirportIndepLab,
  AtLeastOneLab,
  CardPairLab,
  LoanTableLab,
  ReplacementLab,
  SpamLab,
} from '@/components/charts/cond-table-lab'
import { BayesLab, PartitionLab, PracticeLab, TotalProbLab, TotalProofLab } from '@/components/charts/total-prob-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

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

/** A claim that is on the page but not in the deck, marked as such. */
function Beyond({ children }: { children: React.ReactNode }) {
  return (
    <div className="crux-prose mt-4 rounded-lg border border-amber-500/30 bg-amber-50/60 p-3.5 text-[13px]/[1.7] text-zinc-800">
      <span className="mr-1.5 text-[11px] font-semibold tracking-[0.06em] text-amber-700 uppercase">
        Not from the slides
      </span>
      {children}
    </div>
  )
}

/** Something the source says that cannot be made to add up. */
function Unsettled({ children }: { children: React.ReactNode }) {
  return (
    <div className="crux-prose mt-4 rounded-lg border border-red-500/30 bg-red-50/60 p-3.5 text-[13px]/[1.7] text-zinc-800">
      <span className="mr-1.5 text-[11px] font-semibold tracking-[0.06em] text-red-700 uppercase">Left unanswered</span>
      {children}
    </div>
  )
}

export const ISM3_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  revise: (
    <>
      <Para>
        Lecture 2 worked out probabilities and left them there. This lecture is about what happens next: you find
        something out, and the number you wrote down is no longer the right one.
      </Para>
      <Para>The board opens with the smallest possible example of it.</Para>
      <Worked title="The board's opening lines">
        {`P(Rain) = 0.3        at this time of year there is a 30%
                     chance it will rain on any given day

P(Rain | cloudy sky)  >  P(rain)

    we need to be able to revise probability`}
      </Worked>
      <Para>
        Nothing about the weather has changed. What changed is <strong>what you know</strong>. Before you looked out of
        the window, 0.3 was the honest answer. After you looked, it is not — and the lecture wants a way of writing the
        second number down.
      </Para>
      <Para>The two numbers have names, and the whole of the rest of the lecture uses them:</Para>
      <Terms
        items={[
          {
            term: 'prior probability',
            say: 'pry-or',
            def: 'What you thought before the news arrived. P(Rain) = 0.3 here.',
          },
          {
            term: 'posterior probability',
            say: 'poss-teer-ee-or',
            def: 'What you think after it. P(Rain | cloudy sky). Posterior just means "coming after".',
          },
          {
            term: 'P(A | B)',
            say: 'P of A given B',
            def: 'The probability of A in a world where B is known to have happened. The bar is read "given", never "divided by".',
          },
          {
            term: 'conditioning event',
            def: 'The thing you were told — B. The event you are standing inside while you work out the answer.',
          },
        ]}
      />
      <Para>
        The board also names the field this belongs to:{' '}
        <strong>Bayesian learning consists of analysing posterior probabilities</strong>. That single sentence is the
        reason this lecture exists, and it is why the last part of it is Bayes’ theorem.
      </Para>
      <Para>
        Below is a year of a hundred days. Thirty of them rain, which pins the prior at 0.3 whatever you do. Drag the
        sliders to change how those thirty days are spread between cloudy and clear skies, and watch the two numbers
        come apart.
      </Para>

      <Lab>
        <ReviseLab />
      </Lab>

      <Beyond>
        The deck gives P(Rain) = 0.3 and says the conditional is bigger, but it never says by how much — so the hundred
        days above are made up to show the mechanism, and the only figure taken from the lecture is the 30 that rain.
        Nothing on this page treats a particular posterior as the lecture’s answer.
      </Beyond>

      <Para>
        One thing in that lab is worth stopping on. Push the rainy days so that cloudy and clear skies rain at the same
        rate, and the posterior lands exactly on the prior. The sky has told you nothing. That is not a coincidence or a
        special case — it is the definition of independence, which arrives in part 7.
      </Para>

      <WhyAiml method="Bayesian learning · the prior in a MAP estimate, and weight decay">
        <p className="mb-2">
          Splitting a belief into a prior and a posterior is the skeleton of every Bayesian method in the ML course.
          Choosing the most likely hypothesis given the data — the MAP hypothesis — means maximising P(h | D), and Bayes
          turns that into P(D | h) · P(h): how well the hypothesis explains the data, multiplied by what you believed
          about the hypothesis beforehand.
        </p>
        <p>
          That second factor is not decoration, and it is not only in explicitly Bayesian models. Adding λ‖w‖² to a loss
          — L2 regularisation, or weight decay — is exactly a MAP estimate under a Gaussian prior on the weights: take
          logs of P(D | w)·P(w) and the prior becomes the penalty term. So a model trained with weight decay is already
          doing what this slide describes, whether or not anyone calls it Bayesian, and the strength λ is a statement
          about how strongly you believed in small weights before seeing any data.
        </p>
      </WhyAiml>

      <Takeaway>
        A probability is a statement about what you know, not only about the world. New information does not change the
        weather — it changes which sample space you are entitled to count in.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  defn: (
    <>
      <Para>
        Here is the definition the whole lecture rests on. The board builds it from counting, which is the version worth
        remembering, because it explains the division instead of just performing it.
      </Para>
      <Worked title="Board page 2 — where the formula comes from">
        {`P(A ∩ B) =  # of outcomes in the region A ∩ B
            ─────────────────────────────────
              # of outcomes in sample space S

P(B)     =  # of outcomes that occur in B
            ─────────────────────────────────
              # of outcomes in sample space S


            P(A ∩ B)     # of outcomes in A ∩ B
P(A | B) =  ────────  =  ──────────────────────
              P(B)        # of outcomes in B`}
      </Worked>
      <Para>
        Look at what happened on the right-hand side. The size of the sample space appears in the top and the bottom, so
        it cancels and vanishes. What is left is a count out of B rather than a count out of S.
      </Para>
      <Para>
        That is the idea in one sentence:{' '}
        <strong>being told that B happened throws away every outcome outside B, and makes B the new 100%</strong>. You
        are not doing a different kind of arithmetic, you are doing the same arithmetic in a smaller world.
      </Para>
      <Terms
        items={[
          { term: '∩', say: 'intersection, or "and"', def: 'The outcomes in both events at once. A ∩ B is "A and B".' },
          {
            term: 'P(A ∩ B)',
            def: 'How likely both happen, measured against the whole of S. This is the top of the fraction and it never changes when you condition.',
          },
          {
            term: '|S|',
            say: 'the size of S',
            def: 'How many outcomes there are altogether. The thing that cancels in the working above.',
          },
        ]}
      />
      <Para>
        The slides write the same definition twice, once each way round, and add the condition that stops it being
        nonsense:
      </Para>
      <Worked title="Slide 7">
        {`P(A | B)  =  P(A ∩ B) / P(B)        needs P(B) ≠ 0

P(B | A)  =  P(A ∩ B) / P(A)        needs P(A) ≠ 0`}
      </Worked>
      <Para>
        Dividing by P(B) is only meaningful if B can actually happen. Being told that an impossible thing occurred
        leaves you with no world to count in at all.
      </Para>
      <Para>
        Slide 8 draws it as two pictures: first the lens where the circles overlap, then the same lens with B filled in
        underneath it. Drag the circles below and watch the second picture do the dividing for you — everything outside
        the conditioning circle is washed out, because it no longer counts towards anything.
      </Para>

      <Lab>
        <CondVennLab />
      </Lab>

      <Para>
        Switch the chips between “B happened” and “A happened” without touching anything else. The lens does not move.
        Only the circle you are measuring it against does, and the answer changes anyway. P(A | B) and P(B | A) are
        different questions about the same overlap, and swapping them is the single most expensive mistake in this topic
        — which is exactly why the slides insist you read P(B/A) as “B given A” and never as “B by A”.
      </Para>

      <WhyAiml method="renormalising over a restricted set · constrained decoding and masked softmax">
        <p className="mb-2">
          Restricting a model’s output to a set of allowed answers is this definition, implemented. A language model
          forced to emit valid JSON, or to pick from a fixed list of labels, has its scores masked down to the legal
          tokens and then divided by what is left. That divisor is P(B): the total probability the model had placed on
          the allowed set, promoted to be the new 100%.
        </p>
        <p>
          Skip the division and the failure is specific and quiet. The remaining scores no longer sum to 1, so anything
          downstream that treats them as probabilities — a confidence threshold, a beam search comparing partial
          sequences, an expected-value calculation — is reading numbers that shrink as the mask gets tighter. The
          ranking of the allowed tokens survives, which is why the bug can sit unnoticed for a long time; every
          calibrated quantity built on top of it does not.
        </p>
      </WhyAiml>

      <Takeaway>
        P(A | B) = P(A ∩ B) / P(B). The top is unchanged by the news; the bottom is the news. Conditioning shrinks the
        sample space and renormalises what is left.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  multiply: (
    <>
      <Para>
        The definition has a division in it, so multiplying both sides by the denominator turns it into something you
        can use forwards. This is the <strong>multiplication rule</strong>, and it is how nearly every tree-shaped
        probability question gets answered.
      </Para>
      <Worked title="Slide 7, rearranged">
        {`P(A ∩ B) = P(A) · P(B | A)          when P(A) ≠ 0

         = P(B) · P(A | B)          when P(B) ≠ 0`}
      </Worked>
      <Para>
        Both lines say the same thing. Which one you reach for depends only on which conditional the question happens to
        hand you.
      </Para>
      <Para>
        The board then pushes it to three events, and the derivation is worth following because the trick in it comes
        back in the proof of total probability later on. The move is to treat{' '}
        <strong>A ∩ B as though it were a single event</strong>, and then apply the ordinary two-event rule.
      </Para>
      <Worked title="Board page 3 — three events, in full">
        {`start from the definition, with A ∩ B as the
condition:

              P( C ∩ (A ∩ B) )
P(C | A∩B) =  ────────────────
                  P(A ∩ B)

but  C ∩ (A ∩ B)  is just  A ∩ B ∩ C , so

              P(A ∩ B ∩ C)
P(C | A∩B) =  ─────────────
                P(A ∩ B)

multiply up:

P(A ∩ B) · P(C | A∩B) = P(A ∩ B ∩ C)

and we already know  P(A ∩ B) = P(A) P(B | A),
so plugging that in:

P(A) · P(B | A) · P(C | A∩B) = P(A ∩ B ∩ C)`}
      </Worked>
      <Para>
        Read the finished line from left to right and it describes a walk. First A happens. Then B happens, in a world
        where A already has. Then C happens, in a world where both already have. Every factor is conditioned on
        everything to its left.
      </Para>
      <Para>Press through the stages below and watch the running product build up one arrow at a time.</Para>

      <Lab>
        <ChainLab />
      </Lab>

      <Para>
        Two things are worth noticing while you move the sliders. Every factor is at most 1, so the running product can
        only ever fall — asking for three things at once is never easier than asking for one. And the middle slider is
        P(B | A), not P(B). Feeding an unconditional probability into the middle of a chain is the commonest way this
        rule gets misused, and it goes wrong silently.
      </Para>

      <WhyAiml method="the chain rule of probability · autoregressive language models">
        <p className="mb-2">
          A language model does not model whole sentences. It applies exactly the line above, extended to as many events
          as there are tokens: P(w₁ … wₙ) = P(w₁) · P(w₂ | w₁) · P(w₃ | w₁w₂) · … Each factor is one forward pass,
          conditioned on everything already generated, which is why text comes out one token at a time and why the
          context window is the list of events being conditioned on.
        </p>
        <p>
          The falling product is a practical problem, not just an observation. Multiply a few hundred numbers below 1
          and the result underflows to zero in floating point, so implementations sum log-probabilities instead of
          multiplying probabilities — turning the chain rule into an addition. It is also why sequence scores are
          usually divided by length before being compared: without that, the rule guarantees the shorter sequence wins,
          regardless of which is better.
        </p>
      </WhyAiml>

      <Takeaway>
        P(A ∩ B ∩ C) = P(A) · P(B | A) · P(C | A ∩ B). Multiply along the path, and condition each step on everything
        that came before it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  table: (
    <>
      <Para>
        Exams hand you conditional probability as a table far more often than as a formula, so it is worth being fast at
        reading one. This is the table from slide 10 — nearly 47,000 loan applicants, sorted by age and by whether they
        defaulted.
      </Para>
      <Para>The lecture sets two questions on it, and they sound almost the same:</Para>
      <List
        items={[
          <>What is the probability that a person will not default, given they are middle-aged?</>,
          <>What is the probability that a person is middle-aged, given they have not defaulted?</>,
        ]}
      />
      <Para>
        They are not the same, and the table makes the difference concrete. Both questions are about the same 27,368
        people. They differ only in what that number is divided by.
      </Para>
      <Worked title="Board page 5 — the first one, worked">
        {`A = will not default        B = middle-aged

P(A ∩ B) = 27368 / 46687
P(B)     = 32219 / 46687

           P(A ∩ B)     27368 / 46687
P(A | B) = ────────  =  ─────────────
             P(B)       32219 / 46687

the 46687 cancels top and bottom, leaving

P(A | B) = 27368 / 32219   ≈ 0.8494`}
      </Worked>
      <Para>
        That cancelling is the counting argument from part 2 turning up in real numbers. You never needed the grand
        total; you needed the column total. Being told the applicant is middle-aged means the other 14,468 people are no
        longer in the room.
      </Para>
      <Para>
        Press the chips below to choose what you are told and what you want to know. The shaded block is who is left
        standing, and the bold cells are the ones that also answer the question.
      </Para>

      <Lab>
        <LoanTableLab />
      </Lab>

      <Para>
        Set it to the lecture’s question and you get 27368/32219 = 0.8494. Now swap the two chips over: 27368/38130 =
        0.7178. Same cell on top, different total underneath, and an answer that is nearly fourteen points apart. The
        second question is the one slide 10 asks second, and the board does not work it — the number above comes from
        the same table by the same rule.
      </Para>

      <WhyAiml method="the confusion matrix · precision and recall are one cell over two denominators">
        <p className="mb-2">
          A confusion matrix is exactly this table, with “predicted” down one side and “actually” across the top. The
          true positives sit in one cell, and the two headline metrics are that cell divided two different ways.
          Precision is P(actually positive | predicted positive) — divide by the predicted-positive row. Recall is
          P(predicted positive | actually positive) — divide by the actual-positive column. Same numerator, and the two
          chips above are the whole difference.
        </p>
        <p>
          This is why a model can look excellent and be useless. A fraud detector that flags everything has recall 1.0,
          because its column denominator contains every real fraud; its precision is dreadful, because its row
          denominator now contains the whole dataset. Quoting one without the other, or quietly computing precision
          against the wrong margin, is the most common reporting error in a classification write-up — and it is the same
          slip as answering “middle-aged given no default” when you were asked the reverse.
        </p>
      </WhyAiml>

      <Takeaway>
        In a two-way table, the conditional probability is the cell divided by the total of whichever row or column you
        were told about. The grand total never appears — it cancels.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  subset: (
    <>
      <Para>
        Example 2 looks like an arithmetic question and is really a set question. Once you have seen the picture, one of
        its two answers needs no calculation at all.
      </Para>
      <Worked title="Slide 12">
        {`A shop repairs both audio and video components.

  A = the next component in for repair is audio
  B = the next one is a compact disc player

so the event B is contained in A.

  P(A) = 0.6      P(B) = 0.05

Find P(B / A).`}
      </Worked>
      <Para>
        Every compact disc player is an audio component, so there is no way for B to happen without A happening. Written
        in sets, <strong>B ⊆ A</strong>, and the consequence is the line the solution slide leans on:
      </Para>
      <Terms
        items={[
          {
            term: '⊆',
            say: 'is a subset of, or "is contained in"',
            def: 'Every outcome in the first set is also in the second. B ⊆ A means B happening forces A to happen.',
          },
          {
            term: 'A ∩ B = B',
            def: 'When B sits inside A, the overlap is the whole of B. There is no part of B sticking out to lose.',
          },
        ]}
      />
      <Worked title="Slide 13 — the solution">
        {`sets operations:  A ∩ B = B          because B ⊆ A

           P(A ∩ B)     P(B)     0.05
P(B | A) = ────────  =  ────  =  ────  =  0.0833
             P(A)       P(A)      0.6`}
      </Worked>
      <Para>
        Notice that 0.0833 is <em>bigger</em> than P(B) = 0.05. Being told the item is an audio component has ruled out
        every video repair in the shop, so the CD players make up a larger share of what is left. Conditioning on
        something that contains your event can only ever push its probability up.
      </Para>
      <Para>
        The question the slide does not ask is the interesting one. What is P(A | B) — the chance it is an audio
        component, given that it is a CD player? Move the sliders as much as you like below; that read-out never budges.
      </Para>

      <Lab>
        <SubsetLab />
      </Lab>

      <Beyond>
        P(A | B) = 1 is not printed on the slides. It follows from their own set fact: if B ⊆ A then A ∩ B = B, so P(A |
        B) = P(B)/P(B) = 1. The lab computes it from the same two sliders rather than storing it, so it cannot drift
        away from the picture.
      </Beyond>

      <WhyAiml method="hierarchical classification · why P(spaniel) can never exceed P(dog)">
        <p className="mb-2">
          Label taxonomies are full of this containment. Every spaniel is a dog, every dog is an animal, so the
          predicted probabilities have to satisfy P(spaniel | x) ≤ P(dog | x) for the output to mean anything. The
          well-behaved way to build such a model is the structure on this page: predict P(dog | x) at one level, then
          P(spaniel | dog, x) at the next, and multiply — the chain rule from part 3 applied down a tree of nested
          events.
        </p>
        <p>
          A flat softmax over every leaf label knows nothing about the containment and will happily produce a spaniel
          score above its own dog score, which is not a rounding error but a statement that cannot be true. It shows up
          as predictions that contradict themselves when you roll them up to a coarser level — a report where the
          category totals disagree with the sum of their subcategories. Enforcing the hierarchy, rather than patching
          the output afterwards, is the fix.
        </p>
      </WhyAiml>

      <Takeaway>
        When B ⊆ A: A ∩ B = B, so P(B | A) = P(B)/P(A), and P(A | B) = 1. Draw the circles before dividing anything.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  complementcond: (
    <>
      <Para>
        Example 3 gives you three numbers and asks four questions. None of them needs a new formula — each is the
        definition from part 2 with one piece of set algebra in front of it. Those two pieces of algebra are what the
        board spends two pages on, so they come first.
      </Para>
      <Para>
        <strong>The first: how to get an intersection with a complement.</strong> You will constantly be asked about “A
        but not B”, and you will never be given it directly.
      </Para>
      <Worked title="Board page 6 — why P(A ∩ B′) = P(A) − P(A ∩ B)">
        {`A ∩ B′ and A ∩ B are mutually exclusive,
and together they make up the whole of A:

    (A ∩ B′) ∪ (A ∩ B) = A

so by the third axiom (add disjoint events):

    P(A) = P(A ∩ B′) + P(A ∩ B)

rearranging,

    P(A ∩ B′) = P(A) − P(A ∩ B)`}
      </Worked>
      <Para>
        In words: chop A along the edge of B. One piece is inside B, the other is outside it, they do not overlap, and
        nothing else is left. So the outside piece is what remains after taking the inside piece away.
      </Para>
      <Terms
        items={[
          {
            term: 'B′',
            say: 'B prime, or "not B"',
            def: 'The complement of B — every outcome where B did not happen. Also written Bᶜ or B̄.',
          },
          {
            term: 'A ∩ B′',
            def: 'A happened and B did not. The part of A sticking out beyond B.',
          },
          {
            term: 'mutually exclusive',
            def: 'The two events cannot both happen, so their overlap is empty and their probabilities simply add.',
          },
        ]}
      />
      <Para>
        <strong>The second: what happens when you intersect something with a union it is already part of.</strong>
      </Para>
      <Worked title="Board page 7">
        {`A ∩ (A ∪ B)  =  A

everything in A is already in A ∪ B, so
intersecting with the bigger set removes nothing.`}
      </Worked>
      <Para>Now the four questions fall out. Here is the lecture’s own working, in full:</Para>
      <Worked title="Slides 14–16 — Example 3">
        {`A = has a Visa card      B = has a MasterCard
P(A) = 0.5    P(B) = 0.5    P(A ∩ B) = 0.25

a.  P(B | A) = P(A ∩ B) / P(A)
             = 0.25 / 0.5              = 0.5

b.  P(B′ | A) = P(A ∩ B′) / P(A)
              = (P(A) − P(A ∩ B)) / P(A)
              = (0.5 − 0.25) / 0.5     = 0.5

c.  P(A′ | B) = P(A′ ∩ B) / P(B)
              = (P(B) − P(A ∩ B)) / P(B)
              = (0.5 − 0.25) / 0.5     = 0.5

d.  P(A | A ∪ B) = P[A ∩ (A ∪ B)] / P(A ∪ B)
                 = P(A) / P(A ∪ B)     ← board 7
                 = 0.5 / (0.5 + 0.5 − 0.25)
                 = 0.5 / 0.75          = 0.67`}
      </Worked>
      <Para>
        Parts (a), (b) and (c) all come out at 0.5, which is a coincidence of these particular numbers and not a rule.
        Move any slider in the lab below and they separate at once.
      </Para>

      <Lab>
        <CardPairLab />
      </Lab>

      <Para>
        Part (d) is the one that teaches something new. “Given the person has at least one card” is a conditioning event
        built out of a union rather than handed to you as a single letter, and its probability comes from the addition
        rule you met in Lecture 2. The answer 0.67 is bigger than P(A) = 0.5 for the usual reason: knowing they hold at
        least one card has removed the people with no cards at all, and Visa holders are a bigger share of the crowd
        that remains.
      </Para>
      <Para>
        There is also a quick check worth carrying into an exam. Parts (a) and (b) must add to 1, because given A, the
        person either has a MasterCard or does not. If your two answers do not add to 1, one of them is wrong before you
        have checked anything else.
      </Para>

      <WhyAiml method="P(A | B) + P(A′ | B) = 1 · why multi-class and multi-label heads are wired differently">
        <p className="mb-2">
          The check in the paragraph above is a hard constraint on any classifier that reports probabilities. Given an
          input, the classes are exhaustive and mutually exclusive, so the scores must add to 1 — which is what a
          softmax layer is for, and why a multi-class head has one softmax across all classes rather than a sigmoid per
          class.
        </p>
        <p>
          Wire it the other way and the failure is precisely the one this part is about. Independent sigmoids give each
          class its own P(class | x) with no shared denominator, so the outputs do not sum to 1 and cannot be compared
          as shares of anything. That is the right design when the labels genuinely can co-occur — a photo containing
          both a dog and a beach — and the wrong one when exactly one label is true, where it produces confident
          nonsense such as two mutually exclusive classes both scoring 0.9. Deciding whether your labels partition the
          space or overlap is the same decision as (a) and (b) adding to 1 or not.
        </p>
      </WhyAiml>

      <Takeaway>
        P(A ∩ B′) = P(A) − P(A ∩ B) and A ∩ (A ∪ B) = A. With those two lines, three given numbers answer any of these
        four questions.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  independent: (
    <>
      <Para>
        In part 1 you pushed the rainy days about until looking at the sky told you nothing. That situation has a name,
        and the lecture gives it two definitions that look quite different. The point of this part is that they are the
        same statement.
      </Para>
      <Worked title="Slide 17">
        {`An important result from conditional probability:

If B has no effect on A, then   P(A / B) = P(A)
Also                            P(B / A) = P(B)

and we say the events are independent.
i.e., the probability of A does not depend on B.

so       P(A / B) = P(A ∩ B) / P(B)

becomes  P(A)     = P(A ∩ B) / P(B)`}
      </Worked>
      <Para>
        The last two lines are the bridge. Start from the definition, replace the left-hand side with P(A) because that
        is what independence claims, and multiply up. The board does both directions properly:
      </Para>
      <Worked title="Board page 8 — the two definitions are one">
        {`forwards:

  P(A | B) = P(A)              assume this
  P(A ∩ B) / P(B) = P(A)       by definition
  P(A ∩ B) = P(A) P(B)         multiply up


backwards:

  P(A ∩ B) = P(A) P(B)         assume this instead
  P(A | B) = P(A ∩ B) / P(B)   by definition
           = P(A) P(B) / P(B)  substitute
  P(A | B) = P(A)              the P(B) cancels`}
      </Worked>
      <Para>
        So you may use whichever is convenient. In practice the product form wins, because it is symmetric, it needs no
        division, and it does not fall over when one of the probabilities is zero.
      </Para>
      <Terms
        items={[
          {
            term: 'independent',
            def: 'Knowing one happened leaves the other exactly as likely as before. Tested by P(A ∩ B) = P(A)·P(B).',
          },
          {
            term: 'statistically independent',
            def: 'The same thing. The slides use both names; there is no difference.',
          },
          {
            term: '⟺',
            say: 'if and only if',
            def: 'Each side is true exactly when the other is — which is what board page 8 proves here.',
          },
        ]}
      />
      <Para>
        Move the overlap slider below. Both tests are shown side by side, and there is no setting where one passes and
        the other fails.
      </Para>

      <Lab>
        <IndependenceEquivLab />
      </Lab>

      <Para>
        Now drag the overlap all the way to zero. Both verdicts go red — and that is the trap this topic is famous for.
        <strong> Mutually exclusive is not independent.</strong> Events that cannot both happen are as dependent as
        events get: being told A happened tells you, with certainty, that B did not. Lecture 2 made the same point from
        the other side, and it is worth being able to say in one line: exclusive means the overlap is zero, independent
        means the overlap is exactly P(A)·P(B), and for events with any probability at all those two cannot both be
        true.
      </Para>

      <WhyAiml method="naive Bayes · the conditional-independence assumption, and why it survives being false">
        <p className="mb-2">
          Naive Bayes is named after this assumption. To score a document it needs P(x₁, x₂, … xₙ | class), which is
          hopeless to estimate directly, so it assumes the features are independent given the class and replaces the
          whole thing with a product of per-feature terms P(xᵢ | class). That single move is what turns an intractable
          joint distribution into something you can fit by counting.
        </p>
        <p>
          The assumption is nearly always false — “free” and “money” do not appear independently in spam — and the
          consequence is specific. Correlated features are counted as though they were separate pieces of evidence, so
          the same signal gets multiplied in several times and the posterior is pushed towards 0 or 1 far harder than
          the data warrants. The classifier stays useful because the argmax often survives the distortion; its
          probabilities do not, which is why naive Bayes is a decent classifier and a badly calibrated probability
          estimator, and why you should not threshold its output at 0.9 and expect that to mean anything.
        </p>
      </WhyAiml>

      <Takeaway>
        P(A | B) = P(A) and P(A ∩ B) = P(A)·P(B) are the same statement. Mutually exclusive is the opposite of
        independent, not a version of it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  bags: (
    <>
      <Para>
        Independence earns its keep by letting you multiply. Example 4 is the cleanest case of it in the lecture:
        nothing about the first draw can possibly reach the second, because they come out of different bags.
      </Para>
      <Worked title="Slide 18">
        {`Bag 1:   I   L   J   A   U          (5 cards)

Bag 2:   L   R   H   E   C   A      (6 cards)

Bala picks one card from each bag. Find the
probability that:
  a) he picked the letters J and R
  b) both letters are L
  c) both letters are vowels`}
      </Worked>
      <Para>
        Each part is the same two steps: count how many cards in bag 1 qualify, count how many in bag 2 qualify, and
        multiply the two fractions. Below, the cards light up as you choose what you want from each bag.
      </Para>

      <Lab>
        <BagsLab />
      </Lab>

      <Worked title="Slide 19 — parts (a) and (b)">
        {`a)  P(J and R)   = 1/5 · 1/6 = 1/30

b)  P(both are L)  = 1/5 · 1/6 = 1/30`}
      </Worked>
      <Para>
        Part (b) is worth a second look, because the answer is right for a reason that is easy to get wrong. Both bags
        contain exactly one L, so both fractions are one-in-a-bag. It is not because the letters match.
      </Para>

      <Unsettled>
        <p className="mb-2">
          Part (c) is left without an answer here. The solution slide works it as 2/5 · 2/6 = 2/15, which requires bag 1
          to hold two vowels. The bag drawn on slide 18 holds <strong>I, L, J, A, U</strong> — three vowels: I, A and U.
          Bag 2, with L, R, H, E, C, A, does hold two.
        </p>
        <p>
          So the deck’s own picture and its own solution disagree about the same bag, and there is no way to tell from
          the slides which one the question intended. The lab above counts vowels off the cards as drawn, so you can see
          what those cards give; that is the tool doing arithmetic, not this page overruling the lecture. The exam
          answer for part (c) cannot be settled from the material, and guessing at it would be worse than saying so.
        </p>
      </Unsettled>

      <Para>
        Parts (a) and (b) are unaffected — every letter involved in them appears exactly once in each bag, so nothing
        about the vowel count touches them.
      </Para>

      <WhyAiml method="independent draws multiply · why random search covers a hyperparameter space so thinly">
        <p className="mb-2">
          Drawing a configuration for a training run works exactly like drawing from these two bags: pick a learning
          rate from one list, a batch size from another, a dropout rate from a third, each independently. The
          probability of landing on one particular combination is the product of the individual probabilities, which is
          why the chance of hitting any specific setting collapses as you add dimensions — five choices in each of six
          places is 15,625 combinations, and a random search of fifty trials has seen a third of one percent of them.
        </p>
        <p>
          The same product explains why random search is nonetheless preferred to a grid. If only two of those six knobs
          actually matter, a grid spends its budget re-testing the same two values of the important knobs while varying
          irrelevant ones; independent draws give every trial a fresh value of every knob, so the number of distinct
          values tried along the axis that matters equals the number of trials rather than the number of grid steps.
          Both facts come straight from the multiplication above.
        </p>
      </WhyAiml>

      <Takeaway>
        Independent draws multiply. Count the qualifying cards in each bag separately, then multiply the two fractions —
        and check the counts against the picture, not against the answer key.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  atleastone: (
    <>
      <Para>
        Some questions are much easier backwards. “At least one” is the standard hint that you are looking at one of
        them, and Example 5 is the lecture’s demonstration.
      </Para>
      <Worked title="Slide 20">
        {`In a group of 300 adults, 272 are right-handed.
Three adults are selected with replacement. Find

  a) P(all 3 are right-handed)
  b) P(all 3 left-handed)
  c) P(at least one right-handed)

P(one right-handed) = 272/300 = 0.907
P(one left-handed)  =  28/300 = 0.093`}
      </Worked>
      <Para>
        The words <strong>with replacement</strong> are doing real work. Each adult is put back before the next is
        picked, so every draw sees the same group of 300 and the three draws are independent. That is the licence to
        multiply.
      </Para>
      <Para>
        Parts (a) and (b) are then immediate. Part (c) is where the lecture stops to explain itself, because adding up
        the cases is horrible: at least one right-hander could mean one, two or three of them, arriving in any order.
      </Para>
      <Worked title="Board page 9 — the way round it">
        {`the whole sample space of three draws:

    LLL,  LLR,  RLL,  . . . .

    LLL ∪ LLR ∪ . . . .  =  S

P(at least one right handed)
    = P{ LLR, LRL, RLL, . . . . }
    = 1 − P{ LLL }

since  P(S − LLL) = P(S) − P(LLL)
                  = 1 − P(LLL)`}
      </Worked>
      <Para>
        Written out, the sample space of three draws has eight outcomes, and exactly one of them contains no
        right-hander. Removing that single outcome from S is the entire calculation. The lab below lists all eight so
        you can see the one being taken away.
      </Para>

      <Lab>
        <AtLeastOneLab />
      </Lab>

      <Worked title="Slide 21 — the answers">
        {`a) P(3 right-handed) = (272/300)³ = 0.745

b) P(3 left-handed)  = (28/300)³  = 0.0008

c) P(at least one right-handed)
     = 1 − P(all 3 left-handed)
     = 1 − 0.0008
     = 0.9992`}
      </Worked>
      <Para>
        Push the draws slider up to six and the reason this matters becomes obvious. “At least one” would need you to
        add up 63 outcomes; the complement still needs one subtraction.
      </Para>

      <WhyAiml method="1 − (1 − p)ⁿ · the bootstrap sample and the out-of-bag set">
        <p className="mb-2">
          Bagging builds each tree in a random forest on a bootstrap sample: n rows drawn from a dataset of n rows, with
          replacement, exactly like the adults above. The question “does this particular row appear in this tree’s
          training set?” is an at-least-one question, and it is answered the same way — one minus the probability it is
          missed every time, which is 1 − (1 − 1/n)ⁿ.
        </p>
        <p>
          That expression settles at 1 − 1/e ≈ 0.632 as n grows, so roughly 63% of rows appear in any given bootstrap
          sample and the remaining 37% do not. Those left-out rows are the <em>out-of-bag</em> set, and because each
          tree has a different one, a forest can score itself on data no individual tree ever saw — a validation
          estimate for free, with no separate holdout. The whole mechanism is this part’s formula with p = 1/n.
        </p>
      </WhyAiml>

      <Takeaway>
        “At least one” means: work out “none”, and take it off 1. One subtraction beats adding up every case, and the
        gap grows fast with the number of draws.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  spam: (
    <>
      <Para>
        Example 6 is the one worked problem in this lecture that is already machine learning. It is worth reading
        closely for that reason, and then noticing what it quietly assumes.
      </Para>
      <Worked title="Slide 22">
        {`A data science team is building a model to predict
whether an email is spam. They use two independent
features:

  A = the email contains the word "offer"    P(A) = 0.6
  B = the email contains a suspicious link   P(B) = 0.4

  a) P(both)
  b) P(either, or both)
  c) P(neither)`}
      </Worked>
      <Para>
        The word <strong>independent</strong> in the question is not scene-setting. It is the assumption that makes
        every part solvable — without it you would need P(A ∩ B) given to you, and nothing else would work.
      </Para>
      <Para>
        The picture below is the neatest way to hold this in your head. The whole square is probability 1. One vertical
        cut at P(A), one horizontal cut at P(B), and the four rectangles are the four things that can happen to an
        email. Press anywhere to move a cut.
      </Para>

      <Lab>
        <SpamLab />
      </Lab>

      <Para>
        The reason this picture works is precisely independence: the vertical cut sits at the same place whichever side
        of the horizontal cut you are on. If the two features were related — and in real spam they very much are — the
        cut would have to bend, and the rectangles would stop being products.
      </Para>
      <Worked title="Slide 23 — the answers">
        {`a) since independent, P(A ∩ B) = P(A)·P(B)
                       = (0.6)(0.4) = 0.24

b) P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
            = 0.6 + 0.4 − 0.24 = 0.76

c) P(neither) = 1 − P(A ∪ B)
              = 1 − 0.76 = 0.24`}
      </Worked>
      <Para>
        Part (c) is the complement trick from part 9 again, and it is also the bottom-right rectangle in the picture —
        two routes to the same 0.24. That the answer matches part (a) is a fluke of these numbers; move either cut and
        they part company immediately.
      </Para>

      <WhyAiml method="summing log-probabilities · why a spam filter adds scores instead of multiplying them">
        <p className="mb-2">
          A real filter does what part (a) does, with thousands of features rather than two: multiply one probability
          per word or signal. Two factors are fine. Ten thousand factors, each well below 1, underflow to exactly zero
          in double precision, at which point every email scores the same and the model silently stops working.
        </p>
        <p>
          The fix is to take logs, which turns the product into a sum: log P(A ∩ B) = log P(A) + log P(B) when the
          features are independent. That is why spam scores are reported as additive point counts, why library
          implementations expose a <code>predict_log_proba</code> alongside <code>predict_proba</code>, and why the
          log-sum-exp trick exists to get back to a normalised probability at the end without ever forming the tiny
          numbers in between. Every one of those engineering details is downstream of the multiplication on this slide.
        </p>
      </WhyAiml>

      <Takeaway>
        Independence turns a joint probability into a product, and the product into a picture: two straight cuts across
        a unit square. If the cuts would have to bend, the features are not independent.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  replacement: (
    <>
      <Para>
        The miscellaneous questions on slides 24 and 25 turn on one distinction, and it is the one that decides whether
        you are allowed to multiply the same fraction twice.
      </Para>
      <Worked title="Slide 24, questions 1 and 2">
        {`1. A jar holds 5 red, 6 blue and 2 white marbles.
   Two marbles are selected. Find the probability
   that both are red if:
     a) selected with replacement
     b) selected without replacement

2. In a batch of 6400 light bulbs, 80 are defective.
   If 12 bulbs are selected without replacement,
   find the probability that all are good.`}
      </Worked>
      <Terms
        items={[
          {
            term: 'with replacement',
            def: 'You put it back before the next draw. Every draw sees the same container, so the draws are independent and the fraction never changes.',
          },
          {
            term: 'without replacement',
            def: 'You keep it out. The container shrinks, so each draw is conditioned on the ones before it — this is the multiplication rule from part 3.',
          },
        ]}
      />
      <Para>
        That is the whole difference, and it shows up as a changing denominator. Switch the chips below and watch the
        second line of the working change.
      </Para>

      <Lab>
        <ReplacementLab />
      </Lab>

      <Beyond>
        <p className="mb-2">
          The slides set these as practice and print no answers, so the figures the lab shows are worked here rather
          than copied — and checked. For the marbles without replacement, 5/13 × 4/12 = 5/39 ≈ 0.1282; the second panel
          checks it by labelling all thirteen marbles and counting ordered pairs, which gives 20 red-then-red out of 13
          × 12 = 156, and 20/156 is the same 5/39. With replacement it is 5/13 × 5/13 = 25/169 ≈ 0.1479.
        </p>
        <p>
          For the bulbs, 6320 of the 6400 are good, and drawing twelve without replacement gives 6320/6400 × 6319/6399 ×
          … × 6309/6389 ≈ 0.8598. The lab prints the draw-by-draw fractions so the product can be checked a line at a
          time.
        </p>
      </Beyond>

      <Para>
        Notice which way round the two marble answers come out. Without replacement is the smaller number, because
        taking the first red marble out leaves only 4 reds among 12 rather than 5 among 13. With a big container the
        difference nearly disappears — that is why the bulb question can be done either way to three decimal places, and
        why sampling a large dataset with or without replacement often makes no practical difference.
      </Para>
      <Para>
        The third miscellaneous question asks something else again: not for a probability, but whether two events are
        independent. It hands you a table rather than probabilities, which is how the question is nearly always put.
      </Para>
      <Worked title="Slide 24, question 3">
        {`In a city with two airports, 100 flights were
surveyed. 20 of those flights departed late.
45 flights departed from airport A; 9 of those
departed late. 55 flights departed from airport B;
11 departed late.

Are "departs from airport A" and "departed late"
independent?`}
      </Worked>
      <Para>
        Work out the three probabilities from the counts and apply the product test from part 7. The counts below are
        editable, so you can break the independence and watch the verdict turn.
      </Para>

      <Lab>
        <AirportIndepLab />
      </Lab>

      <Beyond>
        No answer is printed for this one either. From the table P(A) = 45/100 = 0.45, P(late) = 20/100 = 0.20 and P(A ∩
        late) = 9/100 = 0.09, and 0.45 × 0.20 = 0.09 exactly — so the two events are independent. The check is a single
        multiplication and the lab performs it on whatever counts you type, which is how it was verified here.
      </Beyond>

      <WhyAiml method="sampling without replacement · train/test splits, and the leakage that follows from getting it wrong">
        <p className="mb-2">
          Both schemes are standard practice and they mean different things. A bootstrap sample draws n rows with
          replacement, which is why the same row can appear several times in one tree’s training set. A k-fold
          cross-validation split draws without replacement: each row lands in exactly one fold, and the folds are
          disjoint precisely so that the model is never scored on a row it trained on.
        </p>
        <p>
          Getting this wrong has a name — data leakage — and it is the most common reason a model that looked excellent
          in a notebook fails in production. Sampling a test set without removing those rows from the training set is
          the without-replacement question answered as though it were with-replacement, and the model then reports its
          memory as though it were generalisation. Duplicate rows, or several records describing the same patient or
          customer, cause the same failure quietly even when the split code is correct, which is why grouped splits
          exist.
        </p>
      </WhyAiml>

      <Takeaway>
        With replacement: the same fraction every time, and the draws are independent. Without: the denominator falls by
        one each draw, and the multiplication rule from part 3 does the work.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  partition: (
    <>
      <Para>
        The last third of the lecture answers a different shape of question. So far you have been given the world and
        asked about a slice of it. Now you are given the slices, told how likely the event is inside each one, and asked
        about the world.
      </Para>
      <Para>Before the theorem, the setup it needs. The slides call it a partition, and it has two conditions:</Para>
      <Worked title="Slide 27">
        {`S = A₁ ∪ A₂ ∪ … ∪ Aₖ          the slices cover S

A₁ ∩ A₂ ∩ … ∩ Aₖ = ∅          no two of them overlap`}
      </Worked>
      <Terms
        items={[
          {
            term: 'exhaustive',
            def: 'The slices leave nothing out. Whatever happens, it happens inside one of them.',
          },
          {
            term: 'mutually exclusive',
            def: 'No two slices share an outcome, so nothing gets counted twice.',
          },
          {
            term: 'partition',
            def: 'Both at once: a way of cutting S into pieces with no gaps and no overlaps. Exactly one piece happens on each run.',
          },
          {
            term: '∅',
            say: 'the empty set',
            def: 'A set with nothing in it. Two events overlapping in ∅ do not overlap.',
          },
        ]}
      />
      <Para>
        The everyday version of a partition is a question with a fixed set of answers where exactly one is true. Which
        forest you are standing in. Which grade of petrol you bought. Whether it rained. You are always in one, and
        never in two.
      </Para>
      <Para>
        Drag the cuts below. B stays exactly where it is and its area never changes, but the way it is carved up does —
        and the pieces always add back to the same total.
      </Para>

      <Lab>
        <PartitionLab />
      </Lab>

      <Para>
        That is the observation the next part turns into a proof. B has been cut into pieces by the slices, the pieces
        do not overlap each other, and together they make up the whole of B. So their probabilities add to P(B).
      </Para>
      <Para>
        Try squashing the slices to one side. The pieces become wildly uneven — most of B falls in one slice and almost
        none in the others — and the total is unmoved. The theorem does not care whether you chose good slices, only
        that they are a partition.
      </Para>

      <WhyAiml method="the softmax denominator · a partition over classes, and what open-set inputs do to it">
        <p className="mb-2">
          Every classifier assumes a partition. The classes are supposed to be exhaustive and mutually exclusive, so
          exactly one is correct for any input, and that assumption is what licenses the softmax: exponentiate the
          scores, then divide by their total so the outputs add to 1. That denominator is a sum over the partition, of
          exactly the kind the lab above is adding up.
        </p>
        <p>
          The interesting failures are the inputs that were never in any slice. A digit classifier shown a photograph of
          a cat has no correct class, but the softmax must still distribute 1.0 across ten digits, so it returns a
          confident answer to a question that has none — the closed-world assumption breaking in the open world. This is
          why open-set recognition adds an explicit “none of these” class, or abandons the normalised head for per-class
          scores with a rejection threshold: both are ways of admitting the partition was incomplete.
        </p>
      </WhyAiml>

      <Takeaway>
        A partition cuts S into pieces with no gaps and no overlaps. Any event is then cut into matching pieces whose
        probabilities add back to its own.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  totalproof: (
    <>
      <Para>
        The law of total probability is six lines long and every one of them has already appeared in this lecture or the
        last one. It is worth being able to write out, because it is a standard exam question and because the middle of
        it explains why the theorem needs a partition rather than just a few events.
      </Para>
      <Worked title="Slide 26 — what is being proved">
        {`Let A₁, A₂, … Aₖ be mutually exclusive and
exhaustive events. Then for any other event B,

  P(B) = P(B|A₁)P(A₁) + P(B|A₂)P(A₂) + … + P(B|Aₖ)P(Aₖ)

              k
  P(B)  =  Σ  P(B|Aᵢ) P(Aᵢ)
             i=1`}
      </Worked>
      <Para>Press through the proof below. The picture follows the algebra line by line.</Para>

      <Lab>
        <TotalProofLab />
      </Lab>

      <Para>
        Two of those lines deserve more than a nod, because they are the ones that get dropped under exam pressure.
      </Para>
      <Para>
        <strong>Line 2, B = B ∩ S, looks like it does nothing.</strong> It is the key to the whole proof. B is inside S,
        so intersecting with S changes nothing at all — and that is exactly why it is safe. What it buys you is an S
        sitting in the expression, which can then be replaced by the partition. Every proof of this theorem turns on
        that one free move.
      </Para>
      <Para>
        <strong>Line 5 is only legal because the pieces are disjoint.</strong> The third axiom lets you add
        probabilities of events that cannot both happen, and nothing else. So the proof needs the pieces B ∩ Aᵢ to be
        mutually exclusive, and the board proves that rather than asserting it:
      </Para>
      <Worked title="Board page 13 — why the pieces cannot overlap">
        {`Claim: (B ∩ A₁) is mutually exclusive with (B ∩ A₂).

Suppose  e ∈ B ∩ A₁   and   e ∈ B ∩ A₂ .

Then e is in B, e is in A₁, and e is in A₂.

∴ A₁ and A₂ have an intersection — which
  contradicts A₁ and A₂ being mutually exclusive.`}
      </Worked>
      <Para>
        That is a proof by contradiction, and it is short enough to reproduce from memory: an outcome in two pieces
        would have to be in two slices, and the slices do not overlap.
      </Para>
      <Para>
        The distributive law in line 4 is the other thing the board sets up first, on page 10, with a picture for two
        slices:
      </Para>
      <Worked title="Board page 10">
        {`B ∩ { A₁ ∪ A₂ }  =  (B ∩ A₁) ∪ (B ∩ A₂)

The way to prove two sets are equal:

  show any element of the first set is in the
  second   →   A ⊆ B

  show any element of the second set is in the
  first    →   B ⊆ A

  (A ⊆ B) and (B ⊆ A)  ⟹  A = B`}
      </Worked>

      <WhyAiml method="marginalisation · summing a joint distribution over a latent variable">
        <p className="mb-2">
          The finished line is the definition of marginalising out a variable, which is one of the two or three moves
          that all of probabilistic machine learning is made of. P(x) = Σ P(x | z)P(z) says: you cannot observe z, so
          consider every value it could take, weight each by how likely it is, and add. A Gaussian mixture model
          computes exactly this to get the density of a point — z is which component generated it — and the E-step of EM
          divides by that same sum to get the responsibility of each component.
        </p>
        <p>
          What breaks is the sum itself. As soon as z is continuous, or is a vector with many components, the sum
          becomes an integral over a space too large to enumerate, and P(x) is no longer computable — which is why
          variational inference exists at all. The ELBO is a bound you optimise precisely because this line, provable in
          six steps for a partition into four slices, is intractable when the partition is infinite.
        </p>
      </WhyAiml>

      <Takeaway>
        B = B ∩ S is the free move that starts the proof; disjointness of the pieces is what licenses the addition.
        Everything else is the distributive law and the multiplication rule.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  totalexamples: (
    <>
      <Para>
        The lecture works four examples on the same theorem, and they are all the same calculation with different words.
        It is worth doing them together, because once you see the shape you stop having to think about it.
      </Para>
      <Para>The recipe is always this:</Para>
      <List
        items={[
          <>Find the question with a fixed set of answers, exactly one of which is true. That is the partition.</>,
          <>
            Write down P(Aᵢ) for each slice. These are the numbers that must add to 1 — if yours do not, you have picked
            the wrong partition.
          </>,
          <>Write down P(B | Aᵢ) for each slice. These do not add to anything in particular.</>,
          <>Multiply along each branch and add up the results.</>,
        ]}
      />
      <Para>
        The calculator below runs all four of the lecture’s examples. The presets load each one exactly as the slides
        state it.
      </Para>

      <Lab>
        <TotalProbLab />
      </Lab>

      <Worked title="Slides 30–32 — the petrol station">
        {`P(A₁) = 0.40 regular   P(B|A₁) = 0.30
P(A₂) = 0.35 plus      P(B|A₂) = 0.60
P(A₃) = 0.25 premium   P(B|A₃) = 0.50

P(B) = (0.4 × 0.3) + (0.35 × 0.6) + (0.25 × 0.5)
     = 0.455`}
      </Worked>
      <Worked title="Slides 37–38 — clicking an ad, by device">
        {`P(D) = 0.5 desktop   P(C|D) = 0.04
P(T) = 0.2 tablet    P(C|T) = 0.06
P(M) = 0.3 mobile    P(C|M) = 0.10

P(C) = (0.04 × 0.5) + (0.06 × 0.2) + (0.1 × 0.3)
     = 0.062`}
      </Worked>
      <Worked title="Slides 39–41 — a poisonous plant">
        {`Forest A: 50% of the land, 20% poisonous
Forest B: 30% of the land, 40% poisonous
Forest C: 20% of the land, 70% poisonous

P(P) = Σ P(P|Bᵢ) P(Bᵢ)
     = (0.20)(0.50) + (0.40)(0.30) + (0.70)(0.20)
     = 0.36`}
      </Worked>
      <Worked title="Slides 42–44 — the mining job">
        {`B = it rains,  A = the job finishes on time

P(B)  = 0.45          P(A|B)  = 0.42
P(B′) = 0.55          P(A|B′) = 0.90

B and B′ partition S, so

P(A) = P(B)P(A|B) + P(B′)P(A|B′)
     = 0.45 × 0.42 + 0.55 × 0.9
     = 0.189 + 0.495
     = 0.684`}
      </Worked>
      <Para>
        The mining job is the smallest possible partition — an event and its complement — and it is by far the most
        common form in exams. Any yes/no question splits the world in two, so total probability applies whenever you are
        told how something behaves in both cases.
      </Para>
      <Para>
        There is a free check on all four. The answer is a weighted average of the conditionals, so it must land between
        the smallest and the largest of them. The petrol answer 0.455 sits between 0.3 and 0.6; the plants answer 0.36
        sits between 0.2 and 0.7. If your total comes out beyond that range, you have made an arithmetic slip and you
        know it before checking anything else.
      </Para>

      <WhyAiml method="mixture models · P(x) = Σ πₖ · N(x | μₖ, Σₖ)">
        <p className="mb-2">
          A Gaussian mixture model is this sum with the words removed. The mixing weights πₖ are the P(Aᵢ) — which
          component an unseen point came from — and each N(x | μₖ, Σₖ) is the P(B | Aᵢ), how likely that point is if it
          came from that component. Fitting the model with EM alternates between guessing the responsibilities and
          re-estimating the components, and the density it reports for any point is precisely the weighted sum you have
          just been computing four times.
        </p>
        <p>
          The check in the paragraph above is a real constraint on such models too. Because the result is a weighted
          average of the components, a mixture can never place more density anywhere than its best component does there,
          and it cannot produce structure outside the region its components cover. That is why a mixture with too few
          components underfits in a characteristic way — smearing mass between clusters rather than putting it where the
          data is — and why the weights must sum to 1 for the output to be a density at all rather than an arbitrary
          positive function.
        </p>
      </WhyAiml>

      <Takeaway>
        Find the partition, weight each conditional by its slice, and add. The answer always lands between the smallest
        and largest conditional, which is a free check on your arithmetic.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  bayes: (
    <>
      <Para>
        Everything so far has run forwards: given the cause, how likely is the effect. Real questions usually arrive the
        other way round. You can see the effect, and you want to know the cause.
      </Para>
      <Para>
        The lecture’s cleanest case is a communication channel, because the two directions are so obviously different.
        The engineer who built the wire knows how often a transmitted 1 arrives as a 1. The person holding the receiver
        does not care about that — they are looking at a 1 and want to know what was sent.
      </Para>
      <Worked title="Slide 33">
        {`A simple binary channel carries messages using
only two signals, 0 and 1. For a given channel,
40% of the time a 1 is transmitted; the probability
that a transmitted 0 is correctly received is 0.90,
and the probability that a transmitted 1 is
correctly received is 0.95. Determine

  · the probability of a 1 being received, and
  · given a 1 is received, the probability that
    1 was transmitted.`}
      </Worked>
      <Worked title="Slide 34 — naming everything first">
        {`A = 1 is transmitted        Ā = 0 is transmitted
B = 1 is received           B̄ = 0 is received

P(A)  = 0.4        P(Ā)  = 0.6
P(B|A) = 0.95      P(B̄|A) = 0.05
P(B̄|Ā) = 0.90      P(B|Ā) = 0.10`}
      </Worked>
      <Para>
        Take a moment over the last line. P(B | Ā) = 0.10 is not given in the question — it is what is left when a
        transmitted 0 fails to arrive as a 0. Getting a 0 right and getting it wrong are complementary, so they add to
        1. That is the complement rule doing quiet work, and forgetting it is where this question usually goes wrong.
      </Para>
      <Para>
        The first part is total probability, with A and Ā as the smallest partition there is. The second part is the new
        rule.
      </Para>
      <Worked title="Slides 35–36 — both parts">
        {`a)  P(B) = P(B|A)P(A) + P(B|Ā)P(Ā)
         = 0.95(0.4) + 0.1(0.6)
         = 0.44

b)  P(A|B) = P(B|A) P(A) / P(B)
           = 0.95(0.4) / 0.44
           = 0.863`}
      </Worked>
      <Para>
        That second line is <strong>Bayes’ theorem</strong>. It is not a new idea — it is the multiplication rule from
        part 3, written both ways round and rearranged:
      </Para>
      <Worked title="Where it comes from">
        {`P(A ∩ B) = P(A) P(B | A)        both from slide 7
P(A ∩ B) = P(B) P(A | B)

so    P(B) P(A | B) = P(A) P(B | A)

                P(B | A) · P(A)
and   P(A | B) = ───────────────
                      P(B)

with P(B) supplied by total probability.`}
      </Worked>
      <Terms
        items={[
          {
            term: "Bayes' theorem",
            say: 'bayz',
            def: 'The rule for turning P(effect | cause) into P(cause | effect). Its denominator comes from total probability.',
          },
          {
            term: 'likelihood',
            def: 'P(B | A) — how well the cause explains what you saw. The number you were given.',
          },
          {
            term: 'evidence',
            def: 'P(B) — how likely the thing you saw was, over all causes. The denominator, and the same for every cause you might test.',
          },
        ]}
      />
      <Para>Move the sliders below and watch the prior bar and the posterior bar move apart.</Para>

      <Lab>
        <BayesLab />
      </Lab>

      <Para>
        The important thing in that lab is a gap, not a number. The prior is 0.40 and the posterior is 0.86 — a big
        jump, so the evidence was worth having. But 0.86 is well short of the channel’s 0.95 reliability, and the reason
        is that 1s were the rarer signal to begin with. A rare cause needs strong evidence before it becomes the likely
        explanation. Set both reliabilities to 0.50 and the two bars line up exactly: a channel that is pure noise tells
        you nothing, so the posterior is the prior.
      </Para>

      <WhyAiml method="Bayes' rule at prediction time · why naive Bayes never computes its own denominator">
        <p className="mb-2">
          A naive Bayes classifier does this calculation for every prediction. To label a document it wants P(class |
          words), and what it has estimated from the training data is the other direction: P(words | class), plus the
          prior P(class) from how common each class was. Bayes turns one into the other, with P(words) as the
          denominator — the ML course’s MAP hypothesis is this rule with the argmax taken over classes.
        </p>
        <p>
          Notice what that denominator does not depend on: the class. P(words) is the same number for every class you
          are comparing, so implementations never compute it — they rank the unnormalised products P(words | class) ·
          P(class) and take the largest. It only has to be worked out when you want a calibrated probability rather than
          a label, which is exactly when the prior matters most. On a rare class, a plausible-looking likelihood still
          yields a small posterior, which is the same base-rate effect as the 0.40 to 0.86 gap above and the reason a
          screening test with excellent sensitivity can still be wrong more often than it is right.
        </p>
      </WhyAiml>

      <Takeaway>
        Bayes’ theorem is P(A | B) = P(B | A)·P(A) / P(B). Work out the denominator with total probability first, then
        divide. The prior never disappears — it is why a rare cause stays unlikely without strong evidence.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  practice: (
    <>
      <Para>
        The deck closes with seven practice problems and prints answers to most of them. They are a fair sample of what
        an exam asks, so it is worth doing all seven rather than the easy ones.
      </Para>
      <Para>
        Pick a problem below, work it yourself, then press <strong>Show the working</strong>. Where the slides print an
        answer, the working ends by checking against it.
      </Para>

      <Lab>
        <PracticeLab />
      </Lab>

      <Para>
        Five of the seven check out against the slides exactly, including both Bayes questions and the whole card
        problem. Two do not, and rather than quietly correcting them, they are flagged:
      </Para>
      <Unsettled>
        <p className="mb-2">
          <strong>Problem 5, the production split.</strong> The conditions in the question — 0.30(0.98) + 0.95b + 0.97c
          = 0.96 with b + c = 0.70 — have exactly one solution, b = 0.65 and c = 0.05, which substitutes back to give
          0.96 exactly. The slide prints 0.164, and there is no reading of the question on which that satisfies the
          stated conditions. No answer is given here.
        </p>
        <p>
          <strong>Problem 6(b), the shopping table.</strong> The question asks for P(male | enjoys shopping), so the
          denominator is the 360 people who enjoy it. The printed 0.56 is 136/240 — the same 136 measured against the
          240 men, which is P(enjoys | male). The slide has answered the reverse of its own question, so the printed
          figure cannot settle it.
        </p>
        <p className="mb-0">
          Two others are worth reading carefully rather than distrusting. Problem 2 asks for the probability that “the
          irregular student is a girl” and its answer key supplies P(irregular <em>and</em> girl) = 0.009, labelled as
          such; and problem 3’s stem says the item “is found to be defective” while both of its parts are worked without
          that condition. In each case the printed arithmetic is right for the question it actually answered.
        </p>
      </Unsettled>
      <Para>
        Getting into the habit of checking is the real lesson here. Every one of the five that check out does so by
        substitution or by a second count — putting the answer back into the question, or getting to it a different way.
        That is a habit worth having in an exam, where nobody is going to tell you which of your answers is the wrong
        one.
      </Para>

      <WhyAiml method="computing a metric twice · why an evaluation script needs a second, independent route to the same number">
        <p className="mb-2">
          Problem 6(b) is a bug report about a real class of failure. A number was computed against the wrong
          denominator, it looked entirely plausible, and nothing in the answer flagged it — 0.56 is not an absurd
          probability. Evaluation code fails the same way: precision computed with the recall denominator, a metric
          averaged over classes when it should have been averaged over samples, an accuracy that quietly counted the
          padding tokens. Every one of those produces a number in the right range.
        </p>
        <p>
          The defence is the one the checked problems above use. Derive the metric a second way and compare: rebuild
          precision and recall by hand from the four cells of the confusion matrix and check them against the library
          call, or confirm that per-class scores recombine into the reported average. Where the two routes disagree you
          have found a bug; where a result cannot be reproduced at all, the honest report says so rather than shipping
          the number that happened to come out — which is exactly why two of these seven carry no answer.
        </p>
      </WhyAiml>

      <Takeaway>
        Check every answer by putting it back into the question or by getting there a second way. When a printed answer
        cannot be reproduced, say so — a wrong answer you trust is worse than no answer at all.
      </Takeaway>
    </>
  ),
}
