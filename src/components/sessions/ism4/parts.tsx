/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  BayesProofLab,
  BayesStatementLab,
  HypothesisLab,
  ManagersLab,
  OfferLab,
  RashLab,
  SpamTrapLab,
} from '@/components/charts/bayes-lab'
import { ClassifierLab, CondIndepLab, MapMlLab, NbRuleLab, WeatherLab } from '@/components/charts/bayes-learn-lab'
import { DearFriendLab, LaplaceLab, SpeciesLab, TennisLab } from '@/components/charts/naive-bayes-lab'
import { AssumptionCostLab, PracticeLab, SentimentLab, TextClassLab } from '@/components/charts/nb-text-lab'
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

/** An answer worked out here because the deck gives none, with how it was checked. */
function Checked({ children }: { children: React.ReactNode }) {
  return (
    <div className="crux-prose mt-4 rounded-lg border border-teal-600/30 bg-teal-50/60 p-3.5 text-[13px]/[1.7] text-zinc-800">
      <span className="mr-1.5 text-[11px] font-semibold tracking-[0.06em] text-teal-700 uppercase">
        Worked out here, and checked
      </span>
      {children}
    </div>
  )
}

export const ISM4_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  statement: (
    <>
      <Para>
        Lecture 3 finished on Bayes’ theorem. This session opens by writing it out properly, with all its conditions,
        and then spends the rest of its length using it — first on five worked examples, then as the engine of a machine
        learning method.
      </Para>
      <Para>
        The deck’s own list of what it is revising is worth reading, because it is exactly what you need in place before
        this page makes sense: descriptive statistics, set theory and counting, probability and its axioms, the addition
        and multiplication rules, conditional probability and independent events, and total probability.
      </Para>
      <Para>Here is the statement, copied from the slide.</Para>
      <Worked title="Slide 5 — Bayes’ theorem">
        {`Suppose that E₁, E₂, … Eₙ are mutually exclusive events of a
sample space “S” such that P(Eᵢ) > 0 for i = 1, 2, 3, … n,
and A is any arbitrary event of “S” such that P(A) > 0
and A ⊆ ⋃ᵢ₌₁ⁿ Eᵢ.

Then the conditional probability of Eᵢ given A, for i = 1, 2, 3 … n, is

                       P(Eᵢ) · P(A | Eᵢ)
        P(Eᵢ | A)  =  ──────────────────────
                      Σⱼ₌₁ⁿ P(Eⱼ) · P(A | Eⱼ)`}
      </Worked>
      <Para>
        That is a long sentence with a lot of small print. Take the small print one clause at a time, because every
        clause is doing a job and an exam question will hand you one of them to check.
      </Para>
      <Terms
        items={[
          {
            term: 'mutually exclusive',
            def: 'No two of the events can happen on the same run. Eᵢ ∩ Eⱼ = ∅ whenever i ≠ j. It is what stops the same outcome being counted in two different slices.',
          },
          {
            term: '⋃',
            say: 'union',
            def: 'A big “or”, run over a whole list. ⋃ᵢ₌₁ⁿ Eᵢ means E₁ or E₂ or … or Eₙ. Its small cousin is ∪, between two events.',
          },
          {
            term: '⊆',
            say: 'is contained in',
            def: 'A ⊆ B means every outcome in A is also in B. Here it says A cannot happen outside the slices — so between them the slices cover everything A could possibly do.',
          },
          {
            term: 'Σ',
            say: 'sigma, or sum',
            def: 'Add up the terms as the index runs over its range. Σⱼ₌₁ⁿ means: do it for j = 1, then 2, and so on to n, and add the results.',
          },
          {
            term: 'P(Eᵢ)',
            say: 'the prior',
            def: 'What you thought before the news. The slices’ own probabilities, with nothing observed yet.',
          },
          {
            term: 'P(A | Eᵢ)',
            say: 'the likelihood',
            def: 'How likely the news is inside slice i. Not a probability of the slice — a probability of the evidence, given the slice.',
          },
          {
            term: 'P(Eᵢ | A)',
            say: 'the posterior',
            def: 'What you think afterwards. The thing the theorem produces, and the only one of the four with the slice on the left of the bar.',
          },
        ]}
      />
      <Para>
        Now look at the shape of the fraction rather than its symbols. The top is <strong>one route to A</strong>: the
        chance of landing in slice i, times the chance of A once you are there. The bottom is the same product summed
        over every slice, which is <strong>every route to A</strong>. So a posterior is one route as a share of all of
        them — and that is why the answers always add up to 1.
      </Para>
      <Para>
        The picture the slide draws is the one below. The rectangle is the whole sample space S, cut into slices, and A
        is a shape lying across several of them. Press anywhere to slide A along, or drag a cut to resize the slices,
        and watch the bar at the bottom re-apportion.
      </Para>

      <Lab>
        <BayesStatementLab />
      </Lab>

      <Para>
        Two things in that lab are worth stopping on. First, sliding A left or right barely changes P(A) — the shape is
        the same size wherever it sits — but it changes the posteriors completely. The evidence is equally likely
        overall and points somewhere else entirely. Second, squashing the cuts to one side makes one slice enormous, and
        its posterior climbs even though nothing about A has changed. A big prior is hard to argue away.
      </Para>

      <WhyAiml method="the posterior in a generative classifier — sklearn’s GaussianNB.predict_proba">
        <p className="mb-2">
          Replace “slice” with “class” and this picture is a classifier. The Eᵢ become the labels — spam or not spam,
          each digit 0 to 9, each species — and A becomes the thing you measured. A generative classifier is built
          exactly as written above: store one prior per class, store one likelihood model per class, and at prediction
          time compute the numerator for every class and divide by their total. That division is what
          <code> predict_proba</code> does and what <code>predict</code> skips, since the same denominator cannot change
          which numerator is largest.
        </p>
        <p>
          The condition A ⊆ ⋃ Eᵢ is not decoration either — it is the assumption that the classes are exhaustive, that
          whatever you were handed really is one of them. Break it by showing the model an input from a class it has
          never seen, and the arithmetic still returns a confident posterior, because the denominator only knows about
          the classes it was given. That is the whole of the out-of-distribution problem, visible in the first line of
          the theorem.
        </p>
      </WhyAiml>

      <Takeaway>
        A posterior is one route to the evidence divided by every route to the evidence. The theorem needs the slices to
        be mutually exclusive and to cover everything A can do; those two conditions are what make the denominator a
        genuine total.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  proof: (
    <>
      <Para>
        The deck spends three whole slides proving this, which is a strong hint that the proof is examinable. It is also
        worth knowing on its own: nothing in it is new, and seeing that is what turns Bayes from a formula into
        something you could rebuild if you forgot it.
      </Para>
      <Para>
        The proof has two halves. The first half works out P(A) — that is the rule of total probability, and it takes
        most of the work. The second half is three lines: write down the definition of a conditional probability, and
        substitute.
      </Para>
      <Worked title="Slides 6–7 — the first half, getting P(A)">
        {`Given that A ⊆ ⋃ᵢ₌₁ⁿ Eᵢ

  ∴  A = A ∩ ( ⋃ᵢ₌₁ⁿ Eᵢ )

  ⇒  A = A ∩ ( E₁ ∪ E₂ ∪ ………… ∪ Eₙ )

     A = (A ∩ E₁) ∪ (A ∩ E₂) ∪ ………… ∪ (A ∩ Eₙ)   (distributive law)

     i.e.  A = ⋃ᵢ₌₁ⁿ ( A ∩ Eᵢ )

Since E₁, E₂ … Eₙ are mutually exclusive, Eᵢ ∩ Eⱼ = ∅ for i ≠ j,
and A ∩ E₁ , A ∩ E₂ , ………… A ∩ Eₙ are also mutually exclusive:

     (A ∩ Eᵢ) ∩ (A ∩ Eⱼ) = ∅   for i ≠ j

Applying the addition rule for mutually exclusive events:

     P(A) = P( (A ∩ E₁) ∪ (A ∩ E₂) ∪ …. ∪ (A ∩ Eₙ) )
          = P(A ∩ E₁) + P(A ∩ E₂) + …… + P(A ∩ Eₙ)
          = Σᵢ₌₁ⁿ P(A ∩ Eᵢ)                              --- (1)

From the multiplication rule:

     P(A ∩ Eᵢ) = P(Eᵢ) · P(A | Eᵢ)                       --- (2)

Substituting (2) in (1):

     P(A) = Σᵢ₌₁ⁿ P(Eᵢ) · P(A | Eᵢ)                      --- (3)

     [ Rule of total probability, or rule of elimination ]`}
      </Worked>
      <Para>
        Two moves in there deserve a second look, because they are the ones that get skipped in lectures and asked for
        in exams.
      </Para>
      <List
        items={[
          <>
            <strong>A = A ∩ (⋃ Eᵢ) looks like it does nothing.</strong> Intersecting a set with something that contains
            it gives the set back. That is exactly why it is legal — and it is also why it is useful, because it has
            smuggled the slices into an expression that did not have them a moment ago.
          </>,
          <>
            <strong>Proving the pieces are disjoint is a separate step.</strong> You are allowed to add probabilities
            only for events that cannot both happen. An outcome sitting in both A ∩ Eᵢ and A ∩ Eⱼ would have to be in Eᵢ
            and in Eⱼ at once, and those are mutually exclusive — so no such outcome exists. Without that line the
            addition rule is not available and the proof stops.
          </>,
        ]}
      />
      <Worked title="Slide 8 — the second half, turning it round">
        {`From the definition of conditional probability:

                    P(Eᵢ ∩ A)
     P(Eᵢ | A)  =  ───────────                             --- (4)
                      P(A)

Substituting (2) and (3) in (4):

                     P(Eᵢ) · P(A | Eᵢ)
     P(Eᵢ | A)  =  ──────────────────────
                   Σⱼ₌₁ⁿ P(Eⱼ) · P(A | Eⱼ)`}
      </Worked>
      <Para>
        Step through it below. The picture changes at the four moments where the argument does: the slices on their own,
        A laid over them, A cut into pieces, and the pieces pulled apart.
      </Para>

      <Lab>
        <BayesProofLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'distributive law',
            def: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C). Intersecting with a union is the same as taking the union of the intersections. The same shape as a(b + c) = ab + ac in ordinary algebra.',
          },
          {
            term: '∴',
            say: 'therefore',
            def: 'A shorthand the board uses for “so”. Three dots in a triangle, pointing up.',
          },
          {
            term: 'rule of elimination',
            def: 'The deck’s other name for the rule of total probability. “Elimination” because the unknown slice has been eliminated by summing over every value it could take.',
          },
        ]}
      />

      <WhyAiml method="marginalisation, and the intractable evidence term in variational inference">
        <p className="mb-2">
          Line (3) is <strong>marginalisation</strong>, and it is one of the two or three operations that all of
          probabilistic machine learning is made of. Whenever a model has a variable you cannot observe — which mixture
          component produced this point, which topic produced this word, which latent code produced this image — you get
          the probability of what you <em>can</em> see by summing over every value the hidden one could take, weighted
          by how likely that value was. A Gaussian mixture computes P(x) = Σ πₖ N(x | μₖ, Σₖ), which is this line with
          the slices renamed.
        </p>
        <p>
          The second half of the proof then divides by that sum, and this is exactly where modern models get stuck. When
          the hidden variable is continuous and high-dimensional the sum becomes an integral nobody can do, so the
          posterior cannot be written down. Variational autoencoders exist because of it: rather than computing the
          denominator, they optimise a lower bound on it — the ELBO, whose name literally begins “evidence”, the deck’s
          own word for P(A) here.
        </p>
      </WhyAiml>

      <Takeaway>
        The proof is four ideas: A sits inside the union, so intersect with it; distribute; check the pieces are
        disjoint so they may be added; and swap each overlap for a prior times a likelihood. Then divide, using the
        plain definition of a conditional probability.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  managers: (
    <>
      <Para>
        The first worked example, and a good one, because it asks for both halves of the theorem in order: the
        denominator on its own in part (i), and the full reversal in part (ii).
      </Para>
      <Worked title="Slide 9 — the question">
        {`The probabilities of X, Y and Z becoming managers are
4/9, 2/9 and 1/3 respectively.

The probabilities that the bonus scheme will be introduced if
X, Y and Z become managers are 3/10, 1/2 and 4/5 respectively.

 (i)  What is the probability that the bonus scheme will be introduced?
 (ii) If the bonus scheme has been introduced, what is the probability
      that the manager appointed was X?`}
      </Worked>
      <Para>
        The board annotates the question before doing any arithmetic, and that annotation is most of the work. It writes
        P(X), P(Y), P(Z) over the first three fractions and P(A/X), P(A/Y), P(A/Z) over the second three, then writes
        P(X/A) next to part (ii). Naming which number is which is what stops you multiplying the wrong pair together.
      </Para>
      <Worked title="Slide 10 — the solution">
        {`Let E₁, E₂, E₃ denote the events that X, Y and Z become Managers
respectively, and A denote the event that the Bonus scheme is introduced.

P(E₁) = 4/9,  P(E₂) = 2/9,  P(E₃) = 1/3
P(A | E₁) = 3/10,  P(A | E₂) = 1/2,  P(A | E₃) = 4/5

(i) Using the Addition theorem of Probability

 P(A) = P(E₁ ∩ A) + P(E₂ ∩ A) + P(E₃ ∩ A)
      = P(E₁)P(A|E₁) + P(E₂)P(A|E₂) + P(E₃)P(A|E₃)
      = 4/9 × 3/10  +  2/9 × 1/2  +  1/3 × 4/5
      = 23/45

(ii) Using Bayes’ Theorem

               P(E₁) P(A | E₁)     12/90       6
 P(E₁ | A) =  ──────────────── =  ──────  =  ────
                    P(A)           23/45       23`}
      </Worked>
      <Para>
        Notice that the three events “X becomes manager”, “Y becomes manager” and “Z becomes manager” have to be
        mutually exclusive and exhaustive for any of this to work — exactly one person gets the job. Check the priors:
        4/9 + 2/9 + 1/3 = 4/9 + 2/9 + 3/9 = 1. They do add to 1, so the theorem applies.
      </Para>
      <Para>
        Everything here is a ninth or a tenth, so the whole example lives in whole numbers. The lab keeps it that way —
        nothing is rounded until it is printed, which is why 12/46 comes out as 6/23 and not as 0.26.
      </Para>

      <Lab>
        <ManagersLab />
      </Lab>

      <Para>
        Compare the prior 4/9 = 0.444 with the posterior 6/23 = 0.261. The news made X <em>less</em> likely, not more.
        That is because X is the candidate least likely to bring in the bonus scheme, so hearing that the scheme arrived
        is evidence against X. Press <strong>Swap X and Z around</strong> in the lab and the posterior for X jumps to
        16/23 = 0.696 instead — same priors, opposite likelihoods, opposite conclusion.
      </Para>

      <WhyAiml method="responsibilities in the EM algorithm for a Gaussian mixture">
        <p className="mb-2">
          The number 6/23 has a name in machine learning: it is a <strong>responsibility</strong>. Fitting a mixture
          model with expectation–maximisation alternates two steps, and the E step is precisely this calculation. For
          every data point you compute, for every component k, the quantity πₖ · N(x | μₖ, Σₖ) divided by the same sum
          over all components — prior times likelihood over the total. The result says how much of that point each
          component owns.
        </p>
        <p>
          The M step then re-fits each component using only the share of each point it was given, and the loop repeats.
          So if you can do this example you can do the E step of EM, and the reason k-means is described as a hard
          version of EM is visible here too: k-means gives every point entirely to its nearest centre, which is this
          calculation with the 6/23 rounded to 0 and the 12/23 rounded to 1.
        </p>
      </WhyAiml>

      <Takeaway>
        Name each given number before you touch it: which are priors, which are likelihoods. Then part (i) is the
        denominator and part (ii) is one term of it over the whole. A posterior can be lower than its prior — that is
        evidence pointing the other way, not a mistake.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  rash: (
    <>
      <Para>
        A shorter example with a sharper point. It is the first one where the answer feels wrong until you look at the
        numbers.
      </Para>
      <Worked title="Slides 11–12 — the question and its solution">
        {`In a neighbourhood, 90% of children were falling sick due to flu and
10% due to measles, and no other disease. The probability of observing
rashes for measles is 0.95 and for flu is 0.08. If a child develops
rashes, find the child’s probability of having flu.

Let  F : children with flu       M : children with measles
     R : children showing the symptom of rash

P(F) = 90% = 0.9,   P(M) = 10% = 0.1
P(R | F) = 0.08,    P(R | M) = 0.95

                  P(R|F) P(F)                 0.08 × 0.9
    P(F | R) = ───────────────────────── = ──────────────────── = 0.43
               P(R|M) P(M) + P(R|F) P(F)   0.95×0.1 + 0.08×0.9`}
      </Worked>
      <Para>
        Measles gives a rash almost every time. Flu almost never does. And yet a child with a rash is more likely to
        have flu than not to have it — no, read that again: the answer is 0.43, so the child is more likely to have
        <em> measles</em>, but only just, and flu is nearly as likely despite giving a rash one time in twelve.
      </Para>
      <Para>
        The reason is the 90%. There are nine times as many flu cases as measles cases, so even a rare symptom of flu
        turns up in comparable numbers. The board draws this: a rectangle with F filling most of it and M the rest, and
        the rash cutting across both.
      </Para>
      <Para>
        The lab draws the same picture to scale. The width of each column is how common the illness is; the height of
        the shaded band inside it is that illness’s rash rate. The two shaded rectangles are therefore P(R ∩ F) and P(R
        ∩ M) as real areas, and the bar underneath splits the rashy children between them.
      </Para>

      <Lab>
        <RashLab />
      </Lab>

      <Para>
        Drag the middle line until flu and measles are equally common and the answer collapses to 0.078 — with equal
        priors the rash rates decide on their own, and 0.08 against 0.95 is not close. The 90% was doing all the work.
      </Para>
      <Beyond>
        The exact value of 0.08 × 0.9 ÷ (0.95 × 0.1 + 0.08 × 0.9) is 72/167 = 0.4311, which the slide rounds to 0.43.
        The lab prints both. Nothing else on this page goes beyond the deck.
      </Beyond>

      <WhyAiml method="class imbalance — class_prior in Naive Bayes and class_weight in scikit-learn">
        <p className="mb-2">
          This is the base rate showing up as <strong>class imbalance</strong>, the single most common way a classifier
          gets built and then quietly fails. Train a fraud detector where 0.2% of transactions are fraud and a model
          that answers “not fraud” every time scores 99.8% accuracy. The prior is so lopsided that no evidence of
          moderate strength can overcome it, exactly as the 0.95 rash rate cannot here.
        </p>
        <p>
          The practical handles are the same two numbers on this page. You can change the prior — that is what
          <code> class_prior</code> in scikit-learn’s Naive Bayes and <code>class_weight=“balanced”</code> in its linear
          models do, deliberately lying about the base rate so the rare class is not swamped — or you can find evidence
          with a stronger likelihood ratio. What you cannot do is ignore the prior and read the likelihood as if it were
          the answer, which is what the intuition that says “rash means measles” is doing.
        </p>
      </WhyAiml>

      <Takeaway>
        A strong likelihood attached to a rare cause loses to a weak likelihood attached to a common one. Always ask how
        many of each there were before asking how convincing the evidence is.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  spamtrap: (
    <>
      <Para>
        The same lesson again, on a machine that is doing something useful. This example matters because it is the first
        one in the deck about a piece of software rather than about people or illnesses.
      </Para>
      <Worked title="Slide 13 — the question">
        {`It is estimated that 50% of emails are spam emails. Some software has
been applied to filter these spam emails before they reach your inbox.
A certain brand of software claims that it can detect 99% of spam
e-mails, and the probability for a false positive (a non-spam email
detected as spam) is 5%.

Now if an email is detected as spam, then what is the probability that
it is in fact a non-spam email?`}
      </Worked>
      <Terms
        items={[
          {
            term: 'false positive',
            def: 'The test says yes when the truth is no. Here: a perfectly good email flagged as spam. The slide gives its rate as 5%.',
          },
          {
            term: 'Bᶜ',
            say: 'B complement, or not B',
            def: 'Everything outside B. If B is “the email is spam”, Bᶜ is “the email is not spam”. Also written B′ or B̄.',
          },
        ]}
      />
      <Worked title="Slide 14 — the solution">
        {`Let A  = event that an email is detected as spam
    B  = event that an email is spam
    Bᶜ = event that an email is not spam.

We know P(B) = P(Bᶜ) = .5,
        P(A | B) = 0.99,   P(A | Bᶜ) = 0.05.

Hence by the Bayes’s formula

                  P(A | Bᶜ) P(Bᶜ)
    P(Bᶜ | A) = ───────────────────────────
                P(A | B)P(B) + P(A|Bᶜ)P(Bᶜ)

              = (0.05 × 0.5) / (0.05 × 0.5 + 0.99 × 0.5)  =  5/104`}
      </Worked>
      <Para>
        5/104 is about 0.048. So roughly one message in twenty-one that this filter throws in the spam folder is
        innocent — from software that is 99% accurate on spam and wrong only 5% of the time on good mail.
      </Para>
      <Para>
        Note the neat cancellation: because P(B) = P(Bᶜ) = 0.5, the 0.5 appears in every term and divides out. The
        answer is 0.05 / (0.05 + 0.99) = 5/104, decided entirely by the two error rates. That is a special case of the
        50% base rate, not a general fact, and the lab shows what happens when you move it.
      </Para>

      <Lab>
        <SpamTrapLab />
      </Lab>

      <Para>
        Drag the base rate down to 5% — a much more realistic figure for a filtered inbox — and the same filter is wrong
        about roughly half of everything it flags. Nothing about the software changed. Only the population it was
        pointed at.
      </Para>

      <WhyAiml method="precision, and why the precision–recall curve replaces the ROC curve on rare classes">
        <p className="mb-2">
          P(Bᶜ | A) is one minus <strong>precision</strong>. Precision is P(actually positive | predicted positive) — of
          everything the model flagged, how much of it was right — and this page computes its complement directly from a
          prior and two error rates. The 99% in the question is <strong>recall</strong>, P(predicted positive | actually
          positive), which is a completely different conditional with a completely different denominator. Reporting one
          and being asked about the other is the single most common confusion in a model report.
        </p>
        <p>
          It is also why practitioners plot precision against recall rather than the ROC curve when the positive class
          is rare. The ROC curve’s two axes are both conditioned on the true label, so the base rate cancels out of both
          and the curve looks identical whether 50% or 0.5% of the data is positive — while precision, which conditions
          on the prediction, collapses. Drag the base rate slider above and you have watched exactly that happen.
        </p>
      </WhyAiml>

      <Takeaway>
        A detector’s quoted accuracy is conditioned on the truth; what you actually care about is conditioned on the
        alarm. Bayes converts one into the other, and the base rate is the exchange rate.
      </Takeaway>
    </>
  ),
  /* ---------------------------------------------------------------- 6 */
  hypothesis: (
    <>
      <Para>
        Same theorem, new clothes. The slide rewrites Bayes with letters that mean something to a learning algorithm,
        and gives each of the four pieces a name. Those names are used for the rest of the session and for the whole of
        the machine learning course, so they are worth learning here.
      </Para>
      <Worked title="Slide 15 — Bayes’ theorem for hypotheses">
        {`                 P(E | H) P(H)
    P(H | E)  =  ─────────────────
                       P(E)

  P(H | E) : Posterior probability of hypothesis H given evidence E.
  P(H)     : Prior probability of hypothesis H.
  P(E | H) : Likelihood of evidence E given H.
  P(E)     : Evidence probability, which acts as a normalization constant.

If H₁, H₂, …, Hₙ are mutually exclusive and exhaustive hypotheses,
the sum of their posterior probabilities is always 1:

    Σᵢ₌₁ⁿ P(Hᵢ | E)  =  1

This holds because the total probability of E accounts for all hypotheses.`}
      </Worked>
      <Terms
        items={[
          {
            term: 'hypothesis',
            def: 'A candidate answer. “This email is spam.” “This patient has the disease.” “The coin is biased towards heads.” Written H, or h once data is involved.',
          },
          {
            term: 'evidence',
            def: 'What you actually observed. Written E. Confusingly, P(E) on its own is also called “the evidence” — it is the probability of having seen what you saw, whatever the truth is.',
          },
          {
            term: 'normalization constant',
            say: 'norm-a-lie-ZAY-shun',
            def: 'A number you divide by to make a set of values add up to 1. It is the same for every hypothesis, so it can never change which one wins — only what the numbers are called.',
          },
          {
            term: 'exhaustive',
            def: 'Between them the hypotheses cover every possibility, so one of them must be true. With mutually exclusive, this is what makes the posteriors add to exactly 1.',
          },
        ]}
      />
      <Para>
        The slide then says where this is going, in one line:{' '}
        <strong>this logic forms the core of the Naive Bayes classifier</strong>, and it lists where that classifier is
        used — spam filtering, sentiment analysis, document categorisation, medical diagnosis prediction. Everything
        from part 10 onwards is that sentence being cashed in.
      </Para>
      <Para>
        Below, three rows. The top row is what you believed before; the middle row is how well each hypothesis explains
        the evidence; the bottom row is what Bayes makes of the two together. Drag any middle bar.
      </Para>

      <Lab>
        <HypothesisLab />
      </Lab>

      <Para>
        Set every likelihood to the same height. The bottom row becomes an exact copy of the top row — evidence that
        every hypothesis explains equally well is not evidence at all, because the common factor cancels top and bottom.
        That is the formal version of “this tells me nothing”, and it is the same condition as independence from Lecture
        3.
      </Para>
      <Beyond>
        The four hypotheses and their numbers in the lab are made up, because the slide gives none. What is taken from
        the slide is the structure — the four names and the fact that the posteriors sum to 1 — and the lab enforces
        that sum rather than asserting it.
      </Beyond>

      <WhyAiml method="the softmax denominator, and the cross-entropy loss">
        <p className="mb-2">
          The last layer of almost every classification network is a softmax, and a softmax is this formula with
          exponentials in it: it takes one score per class, exponentiates each, and divides by their total. The division
          is the normalisation constant on this page, doing the identical job — turning a set of unnormalised scores
          into numbers that add to 1 so they can be read as probabilities. That is why a network’s raw outputs are
          called <strong>logits</strong>: they are the logs of the unnormalised numerators.
        </p>
        <p>
          The cost of it is the assumption in the small print. Softmax bakes in “mutually exclusive and exhaustive”,
          because the classes share one denominator, so it cannot say “none of these” and it cannot say “both of these”.
          A multi-label problem — an image containing a dog <em>and</em> a beach — needs independent sigmoids and a
          binary cross-entropy per label instead, precisely because the hypotheses there are not mutually exclusive and
          the sum-to-1 line above does not apply.
        </p>
      </WhyAiml>

      <Takeaway>
        Prior, likelihood, evidence, posterior. The evidence is a shared divisor, so it decides the numbers and never
        the winner — and the posteriors add to 1 only because the hypotheses were assumed to be exclusive and
        exhaustive.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  offer: (
    <>
      <Para>
        The first example in the deck that is genuinely a machine learning question, though it uses only one feature.
        Everything after part 12 is this question with more features stuck on the end.
      </Para>
      <Worked title="Slide 16 — the question">
        {`Email Spam Classification using Bayes’ Theorem

A machine learning model needs to decide whether an email is
Spam (H₁) or Not Spam (H₂) based on the presence of the word
“offer” (E).

Given Data (from training corpus):
  P(Spam)     = 0.3   → 30% of all emails are spam
  P(Not Spam) = 0.7   → 70% of all emails are not spam
  P(“offer” | Spam)     = 0.8  → 80% of spam emails contain “offer”
  P(“offer” | Not Spam) = 0.1  → 10% of non-spam emails contain “offer”

Find the probability that an email is spam given that it contains “offer”.`}
      </Worked>
      <Para>
        Read the given data again and notice where the numbers come from: <strong>a training corpus</strong>. Nobody
        knew these probabilities in advance. Somebody took a pile of emails that had already been labelled, counted how
        many were spam, and counted how many of those contained the word. That counting is the whole of “training” a
        Naive Bayes classifier, and parts 13 to 18 do it by hand four times.
      </Para>
      <Worked title="Slide 17 — the solution">
        {`Using Bayes’ Theorem:

                        P(Offer | Spam) P(Spam)
    P(Spam | Offer)  = ──────────────────────────
                              P(Offer)

Where P(Offer) = P(Offer | Spam)P(Spam) + P(Offer | Not Spam)P(Not Spam)
               = (0.8)(0.3) + (0.1)(0.7)
               = 0.24 + 0.07
               = 0.31

    P(Spam | Offer) = (0.8 × 0.3) / 0.31 = 0.774

If an email contains the word “offer”, there is a 77.4% probability
that it is spam.`}
      </Worked>
      <Para>
        The prior was 0.3 and the posterior is 0.774. One word has more than doubled the odds. It is worth seeing why in
        terms of the two likelihoods rather than the final number: the word is eight times more common in spam than in
        good mail, and that ratio of 8 is the entire strength of the evidence.
      </Para>

      <Lab>
        <OfferLab />
      </Lab>

      <Para>
        Press <strong>Make the word useless</strong> and both likelihoods become 0.8. The posterior falls straight back
        to 0.3, the prior. A word that appears just as often in both kinds of mail carries no information whatsoever,
        however common it is — “the” is in almost every email and tells a filter nothing.
      </Para>

      <WhyAiml method="the likelihood ratio, and the log-odds form of logistic regression">
        <p className="mb-2">
          Write Bayes in odds form and the shared denominator disappears entirely: posterior odds = prior odds ×
          likelihood ratio. Here the prior odds are 0.3/0.7 = 0.4286, the likelihood ratio is 0.8/0.1 = 8, and the
          posterior odds are 3.43 — which is 0.774/0.226. Every feature you add multiplies the odds by its own ratio,
          and taking logs turns that product into a sum.
        </p>
        <p>
          That sum is a linear model. Logistic regression learns weights wᵢ so that the log-odds are w·x + b, and for
          binary features the weight it converges on is the log likelihood ratio of that feature — log 8 = 2.08 for
          “offer”. So Naive Bayes and logistic regression end up computing the same shape of thing on the same features;
          the difference is that Naive Bayes reads its weights off the counts one feature at a time, while logistic
          regression fits them all together and can therefore discount two features that say the same thing.
        </p>
      </WhyAiml>

      <Takeaway>
        The strength of a piece of evidence is the ratio of its likelihoods, not the size of either one. Equal
        likelihoods leave the prior untouched, whatever their value.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  maphyp: (
    <>
      <Para>
        Here the deck stops doing probability questions and starts doing machine learning. The letters change: H becomes
        h for a hypothesis, and E becomes D for the training data.
      </Para>
      <Worked title="Slide 18 — the four probabilities">
        {`P(h)     = prior probability of hypothesis h, before seeing the training data
P(D)     = prior probability of training data D
P(h | D) = probability of h given D
P(D | h) = probability of D given h

                 P(D | h) P(h)
    P(h | D)  =  ──────────────
                      P(D)`}
      </Worked>
      <Para>
        The slide that follows lists what this buys you, and it is the deck’s own summary of why anyone bothers.
      </Para>
      <Worked title="Slide 19 — features of Bayesian learning">
        {`Prior knowledge can be combined with observed data to determine
the final probability of a hypothesis.

Prior knowledge is provided by asserting
    · a prior probability for each candidate hypothesis, and
    · a probability distribution over observed data for each
      possible hypothesis.

New instances can be classified by combining the predictions of
multiple hypotheses, weighted by their probabilities.`}
      </Worked>
      <Para>
        That last line is quietly important and easy to skim past. It says you do not have to pick one hypothesis at
        all: you can let every hypothesis vote, weighted by its posterior. In practice people usually do pick one,
        because it is far cheaper, and the slide that follows says which one.
      </Para>
      <Worked title="Slide 20 — choosing a hypothesis">
        {`Generally want the most probable hypothesis given the training data.
Maximum a posteriori hypothesis h_MAP:

    h_MAP = arg max  P(h | D)
             h ∈ H

                              P(D | h) · P(h)
          = arg max        ─────────────────────
             h ∈ H                 P(D)

          = arg max  P(D | h) · P(h)
             h ∈ H

If we assume P(hᵢ) = P(hⱼ), then we can simplify further and choose
the Maximum likelihood (ML) hypothesis

    h_ML = arg max  P(D | hᵢ)
            hᵢ ∈ H`}
      </Worked>
      <Terms
        items={[
          {
            term: 'arg max',
            say: 'arg-max',
            def: 'Short for “the argument that gives the maximum”. It returns the h that makes the expression biggest, not the biggest value. The board illustrates it: arg max of the third item in a list of three is 3, not 9.',
          },
          {
            term: 'h ∈ H',
            say: 'h in H',
            def: 'h is a member of H. H is the hypothesis space — the whole set of candidate answers the learner is allowed to consider.',
          },
          {
            term: 'MAP',
            say: 'em-ay-pee, or map',
            def: 'Maximum a posteriori. The hypothesis with the largest posterior probability. Latin “a posteriori” just means “from what comes after” — after the data.',
          },
          {
            term: 'ML',
            say: 'em-el',
            def: 'Maximum likelihood. The hypothesis under which the data would have been most likely. Ignores the prior entirely.',
          },
        ]}
      />
      <Para>
        Follow the three lines of the derivation, because the second step is the one that matters. P(D) does not contain
        h anywhere. It is the same number for every candidate, so dividing by it cannot reorder the candidates — and so
        it can simply be dropped. That is why almost no implementation of a classifier ever computes it.
      </Para>
      <Para>
        The last line is a separate move and needs its own assumption. If all the priors are equal then P(h) is also the
        same for every candidate, so it drops too, and what is left is the likelihood on its own.
      </Para>

      <Lab>
        <MapMlLab />
      </Lab>

      <Para>
        Press <strong>Flatten every prior</strong> and watch the bottom row become a scaled copy of the middle one, so
        h_MAP always lands on h_ML. Then un-flatten, and give the least likely hypothesis a big prior: the two answers
        come apart, and the gap between them is precisely what a prior is for.
      </Para>
      <Beyond>
        The four hypotheses in the lab are invented, since the slide gives no worked instance. The structure is the
        deck’s — three rows, the argmax marked, and the flattening rule stated on the slide.
      </Beyond>

      <WhyAiml method="MAP versus maximum likelihood — L2 weight decay as a Gaussian prior">
        <p className="mb-2">
          Almost every model you fit is one of these two. Ordinary least squares, plain logistic regression and an
          unregularised network are all <strong>maximum likelihood</strong>: they maximise P(D | h) and say nothing
          about which weights were plausible beforehand. Add a penalty and you have moved to <strong>MAP</strong>.
        </p>
        <p>
          The correspondence is exact and worth being able to state. Take logs of P(D | w)·P(w). If the prior on the
          weights is a zero-mean Gaussian, its log is −λ‖w‖² up to a constant, so maximising the posterior is the same
          as minimising the loss plus λ‖w‖² — L2 regularisation, or weight decay. A Laplace prior gives λ‖w‖₁ instead,
          which is lasso, and the sparsity people prize in lasso is a property of that prior’s sharp peak at zero. So
          “which regulariser should I use” is the same question as “what did I believe about the weights before I saw
          any data”, and setting λ = 0 is the flatten-every-prior button above.
        </p>
      </WhyAiml>

      <Takeaway>
        h_MAP maximises likelihood times prior; h_ML maximises likelihood alone. P(D) always drops out because it does
        not depend on h. The prior drops out only if you assume it is flat — and that assumption is a choice, not a
        fact.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  weather: (
    <>
      <Para>
        Back to a worked example, and the first one where the probabilities are not handed to you. They are counted out
        of raw data — which is what actually happens when a model is trained.
      </Para>
      <Worked title="Slide 21 — the question and the data">
        {`If the weather is sunny, then will the player play or not?
   i.e.  Play / Sunny = Yes or No.

Note: if we know P(Yes / Sunny) and P(No / Sunny)
      then we can answer the question asked.

   Weather    Play          Weather    Play
   Sunny      No            Rainy      No
   Overcast   Yes           Sunny      Yes
   Rainy      Yes           Rainy      Yes
   Sunny      Yes           Sunny      No
   Sunny      Yes           Overcast   Yes
   Overcast   Yes           Overcast   Yes
   Rainy      No            Rainy      No`}
      </Worked>
      <Para>The deck gives the procedure as four numbered steps, and they are worth memorising in that form.</Para>
      <Worked title="Slides 22–23 — the four steps">
        {`Step 1: View or collect “raw” data
Step 2: Convert long data into a frequency table
Step 3: Row and column sums to get probabilities
Step 4: Apply probabilities from the frequency table to Bayes’ theorem

   Weather   | No | Yes | Row total |
   Sunny     |  2 |  3  |     5     |  P(Sunny)    = 5/14
   Overcast  |  0 |  4  |     4     |  P(Overcast) = 4/14
   Rainy     |  3 |  2  |     5     |  P(Rainy)    = 5/14
   ──────────────────────────────────
   Column tot|  5 |  9  |    14     |  P(No) = 5/14   P(Yes) = 9/14

                     P(Sunny | Yes) P(Yes)     (3/9)(9/14)
   P(Yes | Sunny) = ──────────────────────── = ─────────── = 0.60
                           P(Sunny)              (5/14)

                     P(Sunny | No) P(No)       (2/5)(5/14)
   P(No | Sunny)  = ──────────────────────── = ─────────── = 0.40
                           P(Sunny)              (5/14)

   P(Yes | Sunny) > P(No | Sunny).  Hence, the player will play the game.`}
      </Worked>
      <Para>
        Watch the cancellation in the first line. (3/9)(9/14) = 3/14, and dividing by 5/14 gives 3/5. The 9 cancels and
        the 14 cancels, and what is left is the Sunny row read straight off the table: three Yes out of five sunny days.
        That will happen every single time with one feature, which raises a fair question — why bother with Bayes at
        all?
      </Para>
      <Para>
        The answer is that it does not keep happening once there is more than one feature. With four features there is
        no “row” to read off, because most combinations of four values never occurred in the data at all. Bayes plus the
        assumption in part 11 is what lets you answer anyway. This example is the simplest case, shown so the machinery
        can be checked against something obvious.
      </Para>

      <Lab>
        <WeatherLab />
      </Lab>

      <Para>
        Step through the four buttons in order and you have done what the slide does. Then press{' '}
        <strong>Today is Overcast</strong>: the answer is 1.00 against 0.00, because not one of the four overcast days
        ended in No. That zero is not a small probability — it is an impossibility being claimed on the strength of four
        observations, and part 14 is about what to do with it.
      </Para>

      <WhyAiml method="fitting a categorical Naive Bayes — CategoricalNB.fit is a counting pass">
        <p className="mb-2">
          The four steps on this slide are, exactly and completely, the training algorithm for a categorical Naive Bayes
          classifier. <code>CategoricalNB.fit(X, y)</code> makes one pass over the data, builds a count for every
          (feature value, class) pair and a count for every class, and stops. There is no gradient, no iteration and no
          learning rate — which is why it trains in one pass over data too large to hold in memory and is still the
          standard baseline for a new text problem.
        </p>
        <p>
          The consequence is a genuine practical decision. When you need a first number by the end of the afternoon, fit
          this before you fit anything else: it takes seconds, it cannot fail to converge, and a gradient-boosted model
          that does not beat it is telling you something is wrong with your features rather than with your optimiser.
          The counting is also what makes it trivially updateable — a new labelled example is one increment per feature,
          which is why <code>partial_fit</code> exists on this class and not on most others.
        </p>
      </WhyAiml>

      <Takeaway>
        Raw rows, frequency table, probabilities, Bayes. With a single feature the answer is just the row read off the
        table, because the totals cancel — the machinery only starts earning its keep when there are several features.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  classifier: (
    <>
      <Para>
        Three slides that say what a classifier is in this framework, and what kind of model it is. The formula does not
        change at all; what changes is what the letters stand for.
      </Para>
      <Worked title="Slide 25 — the Naive Bayes classifier">
        {`In Naive Bayes, we classify data based on conditional probabilities:

                 P(X | C) P(C)
    P(C | X) = ────────────────
                     P(X)

    · C : Class label (hypothesis).
    · X : Feature vector (evidence).

The sum of probabilities over all possible classes C₁, C₂, …, Cₙ
is always 1:

    Σᵢ₌₁ⁿ P(Cᵢ | X) = 1

This is because the Naive Bayes classifier calculates probabilities
for a set of mutually exclusive and exhaustive classes. The
denominator P(X) normalizes the probabilities, ensuring they sum to 1.`}
      </Worked>
      <Terms
        items={[
          {
            term: 'feature vector',
            def: 'All the measurements about one example, listed in a fixed order. The board’s note beside it: “a bunch of features, or text words.” Written X, with individual features X₁, X₂, … Xₙ.',
          },
          {
            term: 'class label',
            def: 'The answer you are trying to predict, when it is one of a fixed list. Spam or not spam; S1 or S2; Yes or No.',
          },
        ]}
      />
      <Para>The next slide says what kind of model this is, and it is a distinction the ML course cares about.</Para>
      <Worked title="Slide 26 — generative model">
        {`Build a model to estimate the posterior probability P(Y | X) by estimating

   · the likelihood of the data given the target (hypothesis), P(X | Y)
   · the prior probabilities over the target, P(Y)

In general, for a specific class Y = cₖ,

                     P(X | Y = cₖ) · P(Y = cₖ)
    P(Y = cₖ | X) = ───────────────────────────
                              P(X)`}
      </Worked>
      <Para>
        The word <strong>generative</strong> is doing real work in that title. A model of P(X | Y) is a model of what
        the data looks like inside each class. Having built it, you could run it backwards and make up new examples of a
        class — generate them — which is where the name comes from. The alternative, which the ML course also teaches,
        is to model the boundary between classes directly and never describe either class at all.
      </Para>
      <Para>
        The lab below is about the denominator. Drag the bars in either view and watch the winner refuse to change.
      </Para>

      <Lab>
        <ClassifierLab />
      </Lab>

      <Beyond>
        The three class scores in the lab are made up, because the slide gives no worked instance — it is stating a
        general shape. What comes from the slide is the shape itself: score = likelihood × prior, posterior = score ÷
        total, and the total is shared.
      </Beyond>
      <Para>
        So when should you compute the denominator? Only when you want a number rather than a decision. If all you will
        do is take the argmax, skip it. If you are going to threshold — flag anything above 0.9, or weigh the cost of a
        false positive against a false negative — you need it, because the threshold is meaningless on scores that have
        not been normalised.
      </Para>

      <WhyAiml method="generative versus discriminative — Naive Bayes against logistic regression">
        <p className="mb-2">
          This slide names one half of a pairing that runs through the whole ML course. Naive Bayes models P(X | Y) and
          P(Y), then inverts; logistic regression models P(Y | X) directly and never asks what X looks like. On the same
          binary features the two end up computing the same functional form — a weighted sum passed through a sigmoid —
          but they arrive at their weights completely differently.
        </p>
        <p>
          The practical consequence is a known trade-off, and it decides which one to reach for. The generative model
          reaches its (worse) ceiling with far less data, because counting per feature is cheap and it never has to
          discover the interaction structure; the discriminative model needs more data but is not hurt by features that
          duplicate each other, because it fits them jointly. That is why a text classifier with two hundred labelled
          documents is usually Naive Bayes and one with two hundred thousand usually is not.
        </p>
      </WhyAiml>

      <Takeaway>
        C is the class, X is the feature vector, and P(X) is a divisor shared by every class. A generative classifier
        describes each class and inverts; the description is what makes the likelihood estimable one feature at a time.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  condindep: (
    <>
      <Para>
        This is the part the word “naive” is named after. The slide is unusually direct about it, and the sentence is
        worth quoting exactly, because it is the one an exam will ask you to explain.
      </Para>
      <Worked title="Slide 27 — conditional independence">
        {`Naive Bayes assumes conditional independence where Bayes theorem
does not. This means the relationship between all input features
are independent.

Definition: X is conditionally independent of Y given Z, if the
probability distribution governing X is independent of the value
of Y, given the value of Z:

    (∀ i, j, k)  P(X = xᵢ | Y = yⱼ , Z = zₖ) = P(X = xᵢ | Z = zₖ)

more compactly,

    P(X | Y, Z) = P(X | Z)

Example: 1.  P(Thunder | Rain, Lightning) = P(Thunder | Lightning)
         2.  P(flu | fever, blood test for flu) = P(flu | blood test for flu)`}
      </Worked>
      <Terms
        items={[
          {
            term: '∀',
            say: 'for all',
            def: 'An upside-down A. “(∀ i, j, k)” means the equation has to hold for every combination of values, not just for one convenient one.',
          },
          {
            term: 'conditionally independent',
            def: 'Independent once something else is known. Thunder and rain are related — but only because lightning causes both, so once you know about the lightning, the rain adds nothing.',
          },
        ]}
      />
      <Para>
        Read the thunder example slowly, because it shows that conditional independence is not the same thing as
        independence. Thunder and rain are obviously <em>not</em> independent: days with rain have more thunder. But
        that link runs entirely through the lightning. Once you have been told there was lightning, being told it also
        rained changes nothing about thunder. The dependence was borrowed, and conditioning on the cause gives it back.
      </Para>
      <Worked title="Slide 28 — applying it">
        {`Naïve Bayes assumes the Xᵢ are conditionally independent given Y

    e.g.  P(X₁ | X₂ , Y) = P(X₁ | Y)

    P(X₁ , X₂ | Y) = P(X₁ | X₂ , Y) P(X₂ | Y)      (chain rule)
                   = P(X₁ | Y) P(X₂ | Y)           (the assumption)

    General form:  P(X₁ , ⋯ , Xₙ | Y) = Πⱼ₌₁ⁿ P(Xⱼ | Y)

How many parameters to describe P(X₁, …, Xₙ | Y)?  P(Y)?
  Without the conditional independence assumption?
  With the conditional independence assumption?`}
      </Worked>
      <Para>
        The board answers its own question in the margin: <strong>2ⁿ such probabilities</strong> without the assumption.
        Here is why, spelled out, because the slide leaves it as a question.
      </Para>
      <List
        items={[
          <>
            <strong>Without it.</strong> For each class you have to know the probability of every possible combination
            of feature values. With n yes/no features there are 2ⁿ combinations, and they must add to 1, so 2ⁿ − 1 free
            numbers. At n = 20 that is over a million per class — and you would need to have observed every one of those
            combinations at least a few times to estimate any of them.
          </>,
          <>
            <strong>With it.</strong> You need only P(Xⱼ = yes | Y) for each feature separately: n numbers per class. At
            n = 20 that is 20.
          </>,
        ]}
      />
      <Para>
        Drag the slider below and watch the two counts come apart. It is not a small saving — the left number doubles
        every step and the right one goes up by one.
      </Para>

      <Lab>
        <CondIndepLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Π',
            say: 'pi, or product',
            def: 'Capital Greek pi. The multiplying twin of Σ: Πⱼ₌₁ⁿ means multiply the terms together as j runs from 1 to n.',
          },
          {
            term: 'chain rule (for probability)',
            def: 'P(A, B) = P(A | B)·P(B), from Lecture 3. Not the chain rule of calculus, which is a different thing with the same name.',
          },
        ]}
      />

      <WhyAiml method="the curse of dimensionality, and what a Bayesian network buys back">
        <p className="mb-2">
          The 2ⁿ against n on this page is the <strong>curse of dimensionality</strong> in its cleanest form. The number
          of cells in a joint table grows exponentially in the number of features while your data does not, so beyond a
          handful of features almost every cell is empty and every estimate made from it is noise. Naive Bayes escapes
          by refusing to estimate the joint at all — it estimates n one-dimensional tables instead, each with the whole
          dataset behind it.
        </p>
        <p>
          The price is that the assumption is nearly always false, and there is a middle road worth knowing about. A
          <strong> Bayesian network</strong> lets you keep the dependencies that matter and drop the rest: you draw the
          arrows you believe in, and each variable needs a table only over its own parents. Naive Bayes is the extreme
          case of that picture — one parent, the class, pointing at every feature — which is why it is drawn as a star
          in every textbook that covers both.
        </p>
      </WhyAiml>

      <Takeaway>
        Conditionally independent means independent once the class is known. It is what turns one impossible
        n-dimensional table into n small ones, and it is almost always false — the next parts are about what that costs.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  nbrule: (
    <>
      <Para>
        One slide, and it is the whole algorithm. Everything before this was building it; everything after is running it
        on data.
      </Para>
      <Worked title="Slide 29 — the Naive Bayes classifier">
        {`Bayes rule:

                                 P(Y = yₖ) P(X₁ ⋯ Xₙ | Y = yₖ)
    P(Y = yₖ | X₁ ⋯ Xₙ) = ────────────────────────────────────────
                            Σⱼ P(Y = yⱼ) P(X₁ ⋯ Xₙ | Y = yⱼ)

Assume conditional independence among the Xᵢ:

                            P(Y = yₖ) Πᵢ P(Xᵢ | Y = yₖ)
    P(Y = yₖ | X₁ ⋯ Xₙ) = ───────────────────────────────
                           Σⱼ P(Y = yⱼ) Πᵢ P(Xᵢ | Y = yⱼ)

Pick the most probable (MAP) Y:

    Ŷ  ←  arg max  P(Y = yₖ) Πᵢ P(Xᵢ | Y = yₖ)
             yₖ

New point is classified to Yₖ if  P(Yₖ) Π P(Xᵢ | Yₖ)  is maximal.`}
      </Worked>
      <Para>
        Three lines, three separate ideas, and it is worth being able to say which is which because an exam will ask you
        to derive this and each line needs its own justification.
      </Para>
      <List
        items={[
          <>
            <strong>Line 1 is Bayes.</strong> Nothing has been assumed yet. It is exactly the theorem from part 1 with
            the denominator written out as a sum.
          </>,
          <>
            <strong>Line 2 is the naive assumption.</strong> The joint likelihood P(X₁ ⋯ Xₙ | Y) has been replaced by a
            product of one-feature likelihoods. This is the only step in the whole method that is not exact.
          </>,
          <>
            <strong>Line 3 drops the denominator.</strong> The sum is the same for every class, so it cannot change
            which one is largest. The hat on Ŷ means “the predicted value of Y” rather than the true one.
          </>,
        ]}
      />
      <Terms
        items={[
          {
            term: 'Ŷ',
            say: 'Y-hat',
            def: 'A prediction, as opposed to the truth. The hat is used all through the ML course for anything the model produced rather than observed.',
          },
          {
            term: '←',
            def: 'Assignment: the thing on the left is set to the thing on the right. Read “Ŷ is set to the argmax of …”.',
          },
        ]}
      />
      <Para>
        The lab builds the product one factor at a time. The numbers in it are the play-tennis ones from part 15, so
        that the same computation appears twice and has to agree.
      </Para>

      <Lab>
        <NbRuleLab />
      </Lab>

      <Para>
        Slide from 0 to 4 and watch both scores fall by roughly a factor of three at every step. That is not a quirk of
        these numbers — every factor is a probability, so it is at most 1, so the product can only shrink. With four
        features the scores are already at 0.02 and 0.005; with two hundred features they would be at 10⁻⁶⁰. Press
        <strong> Switch to log scores</strong> and the shrinking stops, because the logs simply add.
      </Para>

      <WhyAiml method="log-probabilities — predict_log_proba, and the log-sum-exp trick">
        <p className="mb-2">
          Every real implementation of this rule works in logs, and the lab’s toggle is not a display option — it is how
          the code is actually written. A double-precision float underflows to exactly zero below about 10⁻³⁰⁸, so a
          document with a few thousand words would score 0 for every class and the argmax would be meaningless. Take
          logs and the product Πᵢ P(Xᵢ | Y) becomes Σᵢ log P(Xᵢ | Y): a sum of a few thousand numbers around −7, which
          is perfectly comfortable. That is what <code>predict_log_proba</code> returns and what
          <code> predict</code> compares.
        </p>
        <p>
          It is also why the <strong>log-sum-exp trick</strong> exists. If you do need the normalised posterior you have
          to add the class scores, and they are stored as logs — so you subtract the largest log score from all of them
          first, exponentiate, add, and put the shift back at the end. Skipping that subtraction is a classic bug that
          turns a correct classifier into one that returns NaN on long documents.
        </p>
      </WhyAiml>

      <Takeaway>
        Bayes, then the independence assumption, then drop the denominator. What is left is one prior multiplied by one
        factor per feature — and in practice one log prior plus one log factor per feature.
      </Takeaway>
    </>
  ),
  /* ---------------------------------------------------------------- 13 */
  dearfriend: (
    <>
      <Para>
        Now the rule gets used on real counts. The deck gives twenty-four training words, each one labelled spam or not,
        and asks about a two-word message.
      </Para>
      <Worked title="Slide 30 — the training data and the question">
        {`Email word   Spam        Email word   Spam
   Dear      Yes           Friend    No
   Friend    No            Friend    Yes
   Dear      No            Dear      No
   Dear      No            Lunch     No
   Dear      No            Friend    No
   Friend    No            Dear      No
   Lunch     No            Dear      No
   Friend    No            Dear      No
   Lunch     No            Dear      No
   Dear      Yes           Money     Yes
   Money     Yes           Money     No
   Money     Yes           Money     Yes

Suppose we got the new message with the words ‘Dear Friend’.
Decide whether this new message is a normal or spam message.
   i.e.  Normal / Dear, Friend = Yes or No

Note: if we know P(Normal / Dear, Friend) and P(Spam / Dear, Friend)
      then we can answer the question asked.`}
      </Worked>
      <Para>The four steps from part 9, again. Step 2 turns those twenty-four rows into a small table.</Para>
      <Worked title="Slide 31 — the frequency table">
        {`                normal   spam    Row total
   word
   Dear             8        2          10
   Friend           5        1           6
   Lunch            3        0           3
   Money            1        4           5
   ─────────────────────────────────────────
   Column total    17        7          24`}
      </Worked>
      <Worked title="Slide 32 — step 4, applying Naive Bayes">
        {`               P(D, F | N) P(N)          P(D|N) P(F|N) P(N)
 P(N | D, F) = ───────────────── = ─────────────────────────────────────────
                   P(D, F)          P(D|N)P(F|N)P(N) + P(D|S)P(F|S)P(S)

                (8/17)(5/17)(17/24)              0.098
             = ───────────────────────────── = ───────  = 0.891
               (8/17)(5/17)(17/24) + (2/7)(1/7)(7/24)     0.11

                (2/7)(1/7)(7/24)                 0.012
 P(S | D, F) = ───────────────────────────── = ───────  = 0.109
               (8/17)(5/17)(17/24) + (2/7)(1/7)(7/24)     0.11

As P(N | D, F) > P(S | D, F), we can decide that
“Dear Friend” is a Normal message.`}
      </Worked>
      <Para>
        Look at the very first equality: P(D, F | N) has become P(D | N)·P(F | N). That is the naive assumption from
        part 11, being used for the first time on real numbers. Nothing in the data says the words Dear and Friend are
        independent — they plainly are not, since they turn up together in exactly this greeting — but the method
        assumes it anyway, and that is the whole method.
      </Para>
      <Para>
        The priors here are 17/24 and 7/24, the column totals. Note what that means: the deck is treating each
        <em> word</em> as a training example, so the prior is the share of words rather than the share of messages. Keep
        that in mind for part 18, where the priors are shares of documents instead.
      </Para>

      <Lab>
        <DearFriendLab />
      </Lab>

      <Para>
        Add <strong>Money</strong> to the message and watch the verdict flip: Money is the one word that is more common
        in spam than in normal mail, and one occurrence of it outweighs both of the others. Add <strong>Lunch</strong>{' '}
        instead and the spam score goes to exactly zero, which is the next part.
      </Para>
      <Beyond>
        The deck prints 0.891 and 0.109. Carried through as fractions rather than as rounded decimals, the two answers
        are 140/157 = 0.8917 and 17/157 = 0.1083 — the deck rounded 0.098 and 0.012 and their total 0.11 before
        dividing. The lab shows the exact fractions and the decimals side by side. The verdict is the same either way,
        and this note is here so the small disagreement is not mistaken for an error on one side or the other.
      </Beyond>

      <WhyAiml method="multinomial Naive Bayes — MultinomialNB on a bag-of-words matrix">
        <p className="mb-2">
          This table is exactly what <code>MultinomialNB</code> stores after <code>fit</code>: one count per (word,
          class) pair, plus the class totals. Nothing else is kept — not the messages, not their order, not which words
          co-occurred. It is why the model file for a spam filter over a 50,000-word vocabulary is a couple of matrices
          and nothing more, and why it can be updated by adding to counters as new labelled mail arrives.
        </p>
        <p>
          The word-level prior the deck uses here is worth flagging, because scikit-learn does not do that: its
          <code> class_prior_</code> is the share of <em>documents</em> in each class, not the share of words. On this
          data those differ, since the spam messages are shorter. Neither is wrong, but they are different models, and
          quoting a prior without saying what it counts is how two people get different answers from the same table.
        </p>
      </WhyAiml>

      <Takeaway>
        Count, tabulate, multiply one factor per word, compare. The first line of the solution is where the naive
        assumption enters, and it never leaves again.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  laplace: (
    <>
      <Para>
        Same table, a harder message, and the failure that gives the method its one famous weakness. The deck sets it up
        deliberately.
      </Para>
      <Worked title="Slide 33 — the second message">
        {`Suppose we got the new message containing the words
‘Lunch Money Money Money Money’.

Decide whether this new message is a normal or spam message.`}
      </Worked>
      <Para>
        Money is the spam word — four out of five occurrences of it were spam. Four Moneys in one message ought to make
        this an easy call. It does not.
      </Para>
      <Worked title="Slide 34 — the problem">
        {`P(N)·P(L|N)·P(M|N)⁴ = (17/24)·(3/17)·(1/17)⁴ = 0.0000015

P(S)·P(L|S)·P(M|S)⁴ = ( 7/24)·(0/7 )·(4/7 )⁴ = 0

We can observe that we have to classify any message with Lunch as a
Normal message, no matter how many times we see the word Money —
and that’s the problem.

Issue with the Naïve Bayes classifier: will not be able to classify
as Normal or Spam!

To work around this problem add 1 count to the frequency table to
each word.  (Laplace smoothing)`}
      </Worked>
      <Para>
        Look at what did the damage: <strong>0/7</strong>. The word Lunch never appeared in a spam message in the
        twenty-four training words, so the model has concluded that Lunch is <em>impossible</em> in spam. And zero
        multiplied by anything is zero, so the entire spam score is wiped out no matter what else the message says. One
        missing observation has silenced a whole class.
      </Para>
      <Para>
        That is the difference between “never seen” and “cannot happen”, and it is worth naming, because it is a general
        failure of counting. Three sightings of Lunch is not evidence that spammers never mention lunch.
      </Para>
      <Worked title="Slide 35 — the fix">
        {`                normal   spam    Row total
   word
   Dear            8+1      2+1         12
   Friend          5+1      1+1          8
   Lunch           3+1      0+1          5
   Money           1+1      4+1          7
   ────────────────────────────────────────
   Column total     21       11         32

P(N)·P(L|N)·P(M|N)⁴ = (21/32)·(4/21)·(2/21)⁴ = 0.00001
P(S)·P(L|S)·P(M|S)⁴ = (11/32)·(1/11)·(5/11)⁴ = 0.00133

As P(S | L, M⁴) > P(N | L, M⁴), we can decide that
“Lunch Money Money Money Money” is a Spam message.`}
      </Worked>
      <Terms
        items={[
          {
            term: 'Laplace smoothing',
            say: 'la-PLAHSS',
            def: 'Add 1 to every count before turning it into a probability, so nothing is ever exactly zero. Also called add-one smoothing. Named after Pierre-Simon Laplace.',
          },
          {
            term: 'zero-frequency problem',
            def: 'The failure above: one unseen combination forces the whole product to zero. Smoothing is the standard cure.',
          },
        ]}
      />
      <Para>
        The verdict has flipped from Normal to Spam, and nothing was learned in between. No new data arrived. The only
        change was refusing to treat a count of zero as a probability of zero.
      </Para>
      <Para>
        Notice also what the totals did: 17 became 21 and 7 became 11, because four cells each gained 1. The column
        totals have to grow by the number of distinct words, or the fractions in the column would no longer add to 1 —
        that bookkeeping is easy to forget and is the most common mistake in this calculation.
      </Para>

      <Lab>
        <LaplaceLab />
      </Lab>

      <Para>
        Set k = 0 and the spam column has a red zero in it and no verdict is possible. Step k up to 1 and both classes
        can speak again. Keep going to k = 3 and the answer starts drifting towards the prior — too much smoothing
        flattens away the very differences the classifier is reading, which is why k is a number you tune rather than a
        constant.
      </Para>

      <WhyAiml method="the alpha hyper-parameter in MultinomialNB, and smoothing in n-gram language models">
        <p className="mb-2">
          Add-one smoothing is the <code>alpha</code> parameter of scikit-learn’s Naive Bayes classifiers, with 1.0 as
          the default and any positive value allowed — alpha below 1 is called Lidstone smoothing and is usually better
          on large vocabularies, where adding a full 1 to fifty thousand cells moves a lot of probability mass onto
          words nobody said. Setting <code>alpha=0</code> reproduces the failure on this page, and the library warns you
          when you do.
        </p>
        <p>
          The same problem drove decades of work in language modelling, where an n-gram never seen in training would
          otherwise assign probability zero to a perfectly ordinary sentence. Add-one is the crudest of a family that
          runs through Good–Turing to Kneser–Ney, all of them doing what this slide does: take a little probability away
          from what you saw and give it to what you did not. Neural language models get the same effect for free,
          because a softmax over a vocabulary can never output exactly zero.
        </p>
      </WhyAiml>

      <Takeaway>
        A single zero count destroys a class, whatever the rest of the message says. Add 1 to every cell and add the
        vocabulary size to every total — never seen is not the same as cannot happen.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  tennis: (
    <>
      <Para>
        The play-tennis example again, but now with four features instead of one. This is where the method starts doing
        something you could not do by reading a row off a table.
      </Para>
      <Worked title="Slide 36 — the question">
        {`If the feature of Today = (Outlook is Sunny, Temp is Hot,
Humidity is Normal, Windy is False), then will the player play or not?

  S.No Outlook   Temp  Humidity Windy  Play Tennis
   1   Rainy     Hot   High     False   No
   2   Rainy     Hot   High     True    No
   3   Overcast  Hot   High     False   Yes
   4   Sunny     Mild  High     False   Yes
   5   Sunny     Cool  Normal   False   Yes
   6   Sunny     Cool  Normal   True    No
   7   Overcast  Cool  Normal   True    Yes
   8   Rainy     Mild  High     False   No
   9   Rainy     Cool  Normal   False   Yes
  10   Sunny     Mild  Normal   False   Yes
  11   Rainy     Mild  Normal   True    Yes
  12   Overcast  Mild  High     True    Yes
  13   Overcast  Hot   Normal   False   Yes
  14   Sunny     Mild  High     True    No`}
      </Worked>
      <Para>
        Before doing anything, notice the difficulty. There are 3 × 3 × 2 × 2 = 36 possible weather descriptions and
        only 14 rows of data. Look for a row matching (Sunny, Hot, Normal, False) and there is not one. So there is no
        row to read off, no matching cases to count, and the question is genuinely unanswerable by direct counting.
      </Para>
      <Worked title="Slide 37 — one frequency table per attribute">
        {`  Outlook   Yes  No        Temp   Yes  No
  Rainy     2/9  3/5       Hot    2/9  2/5
  Overcast  4/9  0/5       Mild   4/9  2/5
  Sunny     3/9  2/5       Cool   3/9  1/5

  Humidity  Yes  No        Windy  Yes  No
  High      3/9  4/5       True   3/9  3/5
  Normal    6/9  1/5       False  6/9  2/5`}
      </Worked>
      <Para>
        Four small tables instead of one enormous one. That swap <em>is</em> the conditional independence assumption
        from part 11 — 2ⁿ down to n, in the concrete. Each column adds to 1 within its own attribute: 2/9 + 4/9 + 3/9 =
        1, and 3/5 + 0/5 + 2/5 = 1.
      </Para>
      <Worked title="Slide 38 — the answer">
        {`Today = (Sunny, Hot, Normal, False)
Let Today = X, Sunny = X₁, Hot = X₂, Normal = X₃, False = X₄

P(Yes) = 9/14,  P(No) = 5/14

              P(X | Yes) P(Yes)     P(X₁|yes)P(X₂|yes)P(X₃|yes)P(X₄|yes)·P(Yes)
P(Yes | X) = ─────────────────── = ────────────────────────────────────────────
                    P(X)                       P(X₁, X₂, X₃, X₄)

Consider  P(X₁|yes)P(X₂|yes)P(X₃|yes)P(X₄|yes)·P(Yes)
        = 3/9 × 2/9 × 6/9 × 6/9 × 9/14  =  0.021

Similarly for P(No | X):
          P(X₁|no)P(X₂|no)P(X₃|no)P(X₄|no)·P(no)
        = 2/5 × 2/5 × 1/5 × 2/5 × 5/14  =  0.005

P(Yes | X) > P(No | X). Hence, the player will play Tennis.`}
      </Worked>
      <Para>
        The word <strong>Consider</strong> in the middle is the deck being careful. It never computes P(X₁, X₂, X₃, X₄)
        — the denominator — because it does not need to. Both classes would be divided by it, so comparing the two
        numerators settles the question. That is part 12’s third line, in use.
      </Para>

      <Lab>
        <TennisLab />
      </Lab>

      <Para>
        Every fraction in the tables above is counted from the fourteen rows by the lab, so the deck’s frequency tables
        are reproduced rather than retyped. Choose a different day and watch all eight factors change at once. Choose
        <strong> Overcast</strong> and the No score becomes exactly zero — no overcast day in the fourteen ended in No,
        which is the zero-count problem from part 14 arriving from a different direction. The deck applies Laplace
        smoothing to the word tables but not to this one, so on this example the classifier would say “definitely yes”
        with total confidence on the strength of four observations.
      </Para>

      <WhyAiml method="categorical features — CategoricalNB, and why one-hot encoding is not needed here">
        <p className="mb-2">
          Outlook, Temp, Humidity and Windy are <strong>categorical</strong>: their values are names, not numbers, and
          there is no sense in which Overcast is between Sunny and Rainy. Most learners cannot take them raw, which is
          why the ML preprocessing session spends its time on one-hot and ordinal encoding. A categorical Naive Bayes
          needs neither, because it never does arithmetic on a feature value — it only ever looks the value up in a
          table.
        </p>
        <p>
          That also settles a practical decision people get wrong. If you one-hot encode these four attributes into nine
          binary columns and hand them to a multinomial or Bernoulli Naive Bayes, you have introduced nine features that
          are mutually exclusive by construction — Sunny and Rainy can never both be 1 — which is about as violently as
          conditional independence can be broken. Use <code>CategoricalNB</code> on the raw columns and the assumption
          is only made between the four genuine attributes, which is bad enough.
        </p>
      </WhyAiml>

      <Takeaway>
        With four features there is no matching row to count, and that is the point: n small tables replace one
        impossible big one. Never compute the denominator when all you need is the comparison.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  species: (
    <>
      <Para>
        The third worked example, and the one where the deck and the deck disagree with each other. The question and the
        data are clear, so start with them.
      </Para>
      <Worked title="Slide 39 — the question and the data">
        {`(a) Estimate the conditional probability of each attribute
    {colour, legs, height, smelly} for the species classes {S1, S2}
    using the data given in the table.

(b) Using these probabilities, estimate the probability values for the
    new instance – { Colour = Green, Legs = 2, Height = Tall, Smelly = No }

   No  Colour  Legs  Height  Smelly  Species
    1  White    3    Short    Yes      S1
    2  Green    2    Tall     No       S1
    3  Green    3    Short    Yes      S1
    4  White    3    Short    Yes      S1
    5  Green    2    Short    No       S2
    6  White    2    Tall     No       S2
    7  White    2    Tall     No       S2
    8  White    2    Short    Yes      S2`}
      </Worked>
      <Para>
        Four specimens of each species, so P(S1) = 4/8 and P(S2) = 4/8 — the priors are equal and will cancel out of the
        comparison entirely. Whatever decides this question, it will not be the prior.
      </Para>
      <Worked title="Slide 40 — the frequency tables, as printed">
        {`  Colour   S1    S2         Legs   S1    S2
  White    2/4   3/4         2      1/4   4/4
  Green    2/4   1/4         3      3/4   0/4

  Height   S1    S2         Smelly  S1    S2
  Tall     3/4   2/4         Yes    3/4   1/4
  Short    1/4   2/4         No     1/4   3/4`}
      </Worked>
      <Para>
        Now count the Height column out of the eight rows yourself. The S1 specimens are numbers 1, 2, 3 and 4, and
        their heights are Short, Tall, Short, Short. That is <strong>one</strong> Tall and three Short — so the counted
        values are Tall 1/4 and Short 3/4, and the printed table has them the other way round. Every other cell in every
        other table agrees with the data; only this one does not.
      </Para>
      <Worked title="Slide 41 — the answer, as printed">
        {`         S1
    P(───────────── ) = P(S1) × P(Colour=Green | S1) × P(Leg=2 | S1)
      New Instance                × P(Height=Tall | S1) × P(Smelly=No | S1)

                      = 1/2 × 2/4 × ¼ × ¾ × ¼  =  0.0117

         S2
    P(───────────── ) = 1/2 × 1/4 × 4/4 × 2/4 × ¾  =  0.047
      New Instance

    P(S2 | New Instance) > P(S1 | New Instance).
    Hence, the new instance belongs to species S2.`}
      </Worked>
      <Unsettled>
        The ¾ in the S1 line is P(Height = Tall | S1) taken from the printed table. The eight specimens give ¼, which
        would make the S1 score 1/2 × 2/4 × ¼ × ¼ × ¼ = 0.0039 instead. The deck does not say which is intended and
        there is no way to tell from anything else on the slides, so{' '}
        <strong>this page prints no value for P(S1 | new instance)</strong> and the lab shows both readings side by side
        rather than choosing one.
        <br />
        <br />
        What <em>is</em> settled is the answer to the question that was asked. The S2 score is 0.047 and does not touch
        the disputed cell at all. The S1 score is 0.0117 on the printed reading and 0.0039 on the counted one, and both
        are smaller than 0.047 — so the new instance is classified as <strong>S2</strong> either way, which is the
        deck’s own conclusion.
      </Unsettled>

      <Lab>
        <SpeciesLab />
      </Lab>

      <Para>
        Press the two chips to swap between the readings. Only the S1 row moves, and the verdict never does. Then look
        at the Legs row: P(Legs = 2 | S2) is 4/4, and P(Legs = 3 | S2) is 0/4. Choose 3 legs and S2 dies completely —
        this example has an unsmoothed zero in it too.
      </Para>

      <WhyAiml method="data quality — recomputing the table from raw data instead of trusting a summary">
        <p className="mb-2">
          The mismatch on this slide is not an oddity to file away; it is the most ordinary bug in applied machine
          learning. Somebody produced a summary table, somebody else computed from the summary, and nothing downstream
          could tell that one cell had been transposed. Every pipeline convention that feels like bureaucracy — deriving
          features from the raw table in code, checking that each conditional column sums to 1, asserting that the class
          counts match the row count — exists to catch exactly this before it reaches a model.
        </p>
        <p>
          It is also a good argument for the lab above being built the way it is. Its frequency table is counted from
          the eight specimens every time it renders rather than typed in, so the disagreement showed up as soon as the
          data was entered. A page that had copied slide 40 by hand would have reproduced the transposition silently,
          and a reader revising from it would have learned the wrong number.
        </p>
      </WhyAiml>

      <Takeaway>
        Equal priors cancel, so this question is decided entirely by the likelihoods. And when a printed table and the
        data it came from disagree, the honest answer is to say so and check whether the conclusion survives — here it
        does.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  textclass: (
    <>
      <Para>
        The deck now turns to the application it has been pointing at since slide 15: classifying text. The change is
        that the features are no longer four named attributes but the words themselves.
      </Para>
      <Worked title="Slides 43–45 — the question">
        {`  Text                             Tag
  “A great game”                   Sports
  “The election was over”          Not sports
  “Very clean match”               Sports
  “A clean but forgettable game”   Sports
  “It was a close election”        Not sports

Which tag does the sentence “A very close game” belong to?
   i.e.  P(sports | A very close game)

Feature Engineering: Bag of words, i.e. use word frequencies without
considering order.

Using Bayes Theorem:

                                  P(A very close game | sports) P(sports)
 P(sports | A very close game) = ──────────────────────────────────────────
                                        P(A very close game)

We assume that every word in a sentence is independent of the other ones.

“close” doesn’t appear in sentences of the sports tag, so
P(close | sports) = 0, which makes the product 0.`}
      </Worked>
      <Terms
        items={[
          {
            term: 'bag of words',
            def: 'Treat a sentence as an unordered collection of words. “Dog bites man” and “Man bites dog” become the same thing. Crude, and good enough surprisingly often.',
          },
          {
            term: 'feature engineering',
            def: 'Deciding what to measure about an example before any learning happens. Here the decision is: one feature per word, counted.',
          },
          {
            term: 'vocabulary',
            def: 'The list of distinct words the model knows about. Its size is what you add to every denominator when smoothing.',
          },
        ]}
      />
      <Para>
        The zero problem is back, and this time the deck meets it head on rather than after the fact. Then it fixes it,
        and the fix is the one from part 14 with one extra detail.
      </Para>
      <Worked title="Slide 46 — Laplace smoothing, stated properly">
        {`Laplace smoothing: we add 1, or in general a constant k, to every
count so it’s never zero.

To balance this, we add the number of possible words to the divisor,
so the division will never be greater than 1.

In our case, the possible words are
['a', 'great', 'very', 'over', 'it', 'but', 'game', 'election',
 'clean', 'close', 'the', 'was', 'forgettable', 'match'].`}
      </Worked>
      <Para>
        That second line is the detail. Adding 1 to fourteen numerators adds 14 to what they should sum to, so 14 has to
        be added to the denominator as well. Fourteen is the size of the vocabulary, and it is the same 14 for both
        classes — the vocabulary is shared, even though the word counts are not.
      </Para>
      <Worked title="Slide 47 — the numbers">
        {`  Word    P(word | Sports)   P(word | Not Sports)
  a          2+1 / 11+14         1+1 / 9+14
  very       1+1 / 11+14         0+1 / 9+14
  close      0+1 / 11+14         1+1 / 9+14
  game       2+1 / 11+14         0+1 / 9+14

P(a|Sports) × P(very|Sports) × P(close|Sports) × P(game|Sports) × P(Sports)
    = 2.76 × 10⁻⁵ = 0.0000276

P(a|Not Sports) × P(very|Not Sports) × P(close|Not Sports)
    × P(game|Not Sports) × P(Not Sports)
    = 0.572 × 10⁻⁵ = 0.00000572`}
      </Worked>
      <Para>
        Where do 11 and 9 come from? Count the words in the sports sentences: 3 + 3 + 5 = 11. And in the non-sports
        ones: 4 + 5 = 9. The priors are 3/5 and 2/5, the shares of <em>documents</em> this time rather than of words — a
        different convention from part 13, on the same page of the same deck.
      </Para>

      <Lab>
        <TextClassLab />
      </Lab>

      <Para>
        Sports wins by roughly a factor of five, so the sentence is tagged Sports. Now slide k back to 0: the Sports
        score falls to exactly zero because of “close”, and the classifier hands the sentence to Not sports for the
        worst possible reason. Build a different sentence out of the chips and watch which words actually move the
        answer — “a” and “was” barely do anything, because they are common in both classes.
      </Para>

      <WhyAiml method="the bag of words — CountVectorizer, and what the vocabulary size costs">
        <p className="mb-2">
          The step from five sentences to a table of word counts is exactly what <code>CountVectorizer</code> does:
          build the vocabulary, then turn each document into a row of counts over it. The result is a sparse matrix with
          one column per vocabulary word, and a Naive Bayes classifier over it is still the standard first thing to try
          on a text problem. TF-IDF weighting, stop-word removal and n-grams are all refinements of this same
          representation rather than replacements for it.
        </p>
        <p>
          The vocabulary size is not a detail — it is a hyper-parameter with a real cost. Fourteen words here, but a
          realistic corpus has tens of thousands, and every one of them adds 1 to every denominator under add-one
          smoothing. With V = 50,000 and only 11 words of evidence, the smoothing term swamps the counts entirely and
          every class looks the same. That is why practitioners cap the vocabulary, drop words seen fewer than a handful
          of times, and use alpha well below 1 — three decisions all forced by this one line of the slide.
        </p>
      </WhyAiml>

      <Takeaway>
        One feature per word, order thrown away. Add 1 to every count and the vocabulary size to every total — the
        second half is what keeps the fractions honest.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  sentiment: (
    <>
      <Para>
        The last worked example in the deck, and the one closest to a real task: deciding whether a review is positive
        or negative. It is also the one whose answer is most likely to surprise you.
      </Para>
      <Worked title="Slide 48 — the reviews">
        {`  Doc No   Text                        Tag
    1      I LOVED THE MOVIE            POSITIVE
    2      I HATED THE MOVIE            NEGATIVE
    3      A GREAT MOVIE, GOOD MOVIE    POSITIVE
    4      POOR ACTING                  NEGATIVE
    5      GREAT ACTING, A GOOD MOVIE   POSITIVE

   NEW     I HATED THE POOR ACTING      ????`}
      </Worked>
      <Para>The board sets the question up in the classifier’s own notation before touching any numbers.</Para>
      <Worked title="Slides 49–50 — setting it up">
        {`P(C | X)

  P(+ | I hated the poor acting) = ?
  P(− | I hated the poor acting) = ?

Based on these probabilities, we can decide the class to which the
new text belongs.

                    P(X | c₁) P(c₁)
  i.e.  P(c₁ | X) = ───────────────
                         P(X)

  = P(I|+) P(hated|+) P(the|+) P(acting|+) P(+)`}
      </Worked>
      <Para>
        Ten distinct words appear across the five reviews, so the vocabulary size is 10. The positive reviews contain 4
        + 5 + 5 = 14 words and the negative ones 4 + 2 = 6, which is where the +10 in the denominators comes from and
        why the two denominators are 24 and 16.
      </Para>
      <Worked title="Slides 51–52 — the table and the smoothed probabilities">
        {`  words     positive  negative        word     positive     negative
  I            1         1              I      (1+1)/24     (1+1)/16
  loved        1         0                      = 0.0833     = 0.125
  the          1         1              hated  (0+1)/24     (1+1)/16
  movie        4         1                      = 0.0417     = 0.125
  hated        0         1              the    (1+1)/24     (1+1)/16
  a            2         0                      = 0.0833     = 0.125
  great        2         0              poor   (0+1)/24     (1+1)/16
  poor         0         1                      = 0.0417     = 0.125
  acting       1         1              acting (1+1)/24     (1+1)/16
  good         2         0                      = 0.0833     = 0.125
  ──────────────────────────
  totals      14         6`}
      </Worked>
      <Worked title="Slide 53 — the answer">
        {`P(+ | x) = (0.0833)(0.0417)(0.0833)(0.0417)(0.0833) × P(+)
           where P(+) = 3/5
         = 6.03 × 10⁻⁷

P(− | x) = (0.125)(0.125)(0.125)(0.125)(0.125) × P(−)
           where P(−) = 2/5
         = 1.22 × 10⁻⁵

∴ Negative class`}
      </Worked>
      <Para>
        The negative class wins by a factor of about twenty, despite starting with the smaller prior. Look at why: every
        negative probability is 0.125, identical for all five words. The negative class has only six training words, and
        adding 1 to each of ten vocabulary entries has flattened it almost completely — 2/16 for every word that
        appeared once, and there is nothing else.
      </Para>
      <Para>
        The positive class, with more than twice the training text, has real structure — 0.0833 for words it has seen
        and 0.0417 for words it has not — and “hated” and “poor” both land on the lower value. Two unseen words at half
        the rate of the others is enough.
      </Para>

      <Lab>
        <SentimentLab />
      </Lab>

      <Para>
        Press <strong>“A great movie”</strong> and the verdict flips to Positive, which it should. Then try building a
        sentence out of words that appear in neither class much: the two scores converge, and the classifier falls back
        towards the prior 3/5 versus 2/5.
      </Para>

      <WhyAiml method="sentiment analysis — the Naive Bayes baseline that transformers had to beat">
        <p className="mb-2">
          This is sentiment analysis, one of the four applications slide 15 named, and for a long time this exact method
          was the state of the art for it. It is still the baseline: a bag-of-words Naive Bayes on movie reviews reaches
          somewhere in the high seventies to mid eighties for accuracy on the standard benchmarks, and any new approach
          that cannot clear that on the same split is not worth writing up.
        </p>
        <p>
          What it cannot do is visible right here in the five reviews. “I loved the movie” and “I hated the movie” are
          the same bag of words except for one token; “not good” is two words the model treats as separate positive and
          negative signals; and any sarcasm at all is invisible. Every one of those is a failure of the bag-of-words
          representation rather than of Bayes — which is precisely what word order, attention and contextual embeddings
          were introduced to fix.
        </p>
      </WhyAiml>

      <Takeaway>
        A class with little training data gets flattened by smoothing until every word looks the same, and a flat class
        is hard to beat — two unseen words in the richer class were enough to hand this review to the negative side.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  applications: (
    <>
      <Para>
        The deck finishes with three slides of context: where this gets used, what it costs, and a glossary of the terms
        it expects you to know.
      </Para>
      <Worked title="Slides 54–55 — where it is used, and when">
        {`Naïve Bayes Classifier Applications
   · Categorizing news        · Email spam detection
   · Face recognition         · Sentiment analysis

Along with decision trees and neural networks, one of the most
practical learning methods.

When to use
   · Moderate or large training set available
   · Attributes that describe instances are conditionally
     independent given the classification

Successful applications:
   · Diagnosis
   · Classifying text documents`}
      </Worked>
      <Worked title="Slide 56 — practical issues of Bayesian learning">
        {`Require initial knowledge of many probabilities
   · Often estimated based on background knowledge, previously
     available data, and assumptions about the form of the
     underlying distributions.

Significant computational cost required to determine the Bayes
optimal hypothesis in the general case (linear in the number of
candidate hypotheses).`}
      </Worked>
      <Para>
        The second condition in the “when to use” list is the interesting one, because it is almost never true. Words in
        a sentence are not independent given the topic. Weather attributes are not independent given whether somebody
        played tennis. So what actually happens when you use the method anyway?
      </Para>
      <Para>
        The lab below measures it, on the numbers from part 13. It counts one word of the message more than once — two
        features that say the same thing, which is what correlated features amount to — and shows what that does to the
        answer.
      </Para>

      <Lab>
        <AssumptionCostLab />
      </Lab>

      <Para>
        Nothing new is being said as the slider moves. The same word is simply counted twice, three times, four times,
        and each repetition is treated as a fresh independent confirmation. The posterior climbs towards 1 for no reason
        at all. That is what correlated features do to a Naive Bayes classifier, and it is why the method has a
        reputation for being confidently wrong.
      </Para>
      <Beyond>
        The repetition slider is not on any slide. What it does is arithmetic — it multiplies the same factor in several
        times and reports the result — so the numbers can be checked against part 13, where a single count gives the
        deck’s 140/157. The interpretation offered here, that this is what correlated features cost, is the direct
        consequence of slide 27’s own sentence and nothing more.
      </Beyond>
      <Para>The glossary the deck ends on is a good checklist for whether this session has landed.</Para>
      <Worked title="Slide 57 — glossary">
        {`Bayes theorem
MAP hypothesis
ML estimate
Naïve Bayes theorem
NB with Laplace correction`}
      </Worked>
      <Terms
        items={[
          {
            term: 'Bayes theorem',
            def: 'P(Eᵢ | A) = P(Eᵢ)P(A | Eᵢ) / Σⱼ P(Eⱼ)P(A | Eⱼ). Parts 1 and 2.',
          },
          {
            term: 'MAP hypothesis',
            def: 'arg max over h of P(D | h)·P(h). The most probable hypothesis given the data. Part 8.',
          },
          {
            term: 'ML estimate',
            def: 'arg max over h of P(D | h). MAP with the prior assumed flat. Part 8.',
          },
          {
            term: 'Naïve Bayes theorem',
            def: 'Bayes plus conditional independence: Ŷ = arg max P(Y)·Π P(Xᵢ | Y). Parts 11 and 12.',
          },
          {
            term: 'NB with Laplace correction',
            def: 'The same, with 1 added to every count and the vocabulary size to every total. Parts 14 and 17.',
          },
        ]}
      />

      <WhyAiml method="calibration — Platt scaling and isotonic regression on a Naive Bayes output">
        <p className="mb-2">
          The behaviour in the lab has a name: Naive Bayes is <strong>badly calibrated</strong>. Its ranking of examples
          is often good, so it scores well on AUC and on accuracy, while the actual numbers it reports are pushed
          towards 0 and 1 — say 0.9999 for something that is right about 85% of the time. Correlated features are the
          cause, and text is full of them, since words travel in phrases.
        </p>
        <p>
          The standard fix is to leave the model alone and fit a second, tiny model on its outputs: Platt scaling fits a
          one-dimensional logistic regression to map scores to probabilities, and isotonic regression fits a monotonic
          step function instead. Both are in scikit-learn as <code>CalibratedClassifierCV</code>. This is a real
          decision you will face — if you only need the argmax, none of it matters; the moment you threshold on a
          probability or feed it into an expected-cost calculation, an uncalibrated classifier will quietly ruin the
          result.
        </p>
      </WhyAiml>

      <Takeaway>
        The assumption is nearly always false, and the damage lands on the probabilities rather than on the ranking. Use
        the argmax freely; calibrate before you trust a number.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  practice: (
    <>
      <Para>
        Seven practice sheets close the deck, and all of them are the same shape: several mutually exclusive causes, one
        observed effect, and a question that runs backwards from the effect to the cause. Once you see the shape, the
        arithmetic is bookkeeping.
      </Para>
      <Para>The recipe for every one of them, in order:</Para>
      <List
        items={[
          <>Name the slices and check they are mutually exclusive and exhaustive — their priors must add to 1.</>,
          <>
            Sort the given numbers into priors P(Eᵢ) and likelihoods P(A | Eᵢ). A likelihood always has the observed
            effect on the left of the bar.
          </>,
          <>Multiply each pair. Add the products: that is P(A), the denominator.</>,
          <>Divide the one you were asked about by that total.</>,
          <>Check: the posteriors must add to 1.</>,
        ]}
      />

      <Lab>
        <PracticeLab />
      </Lab>

      <Para>A few of them are worth a word beyond the arithmetic.</Para>
      <List
        items={[
          <>
            <strong>Problem 1</strong> only asks for the denominator. It is total probability with no reversal at all —
            worth spotting so you do not go looking for a posterior that was never requested.
          </>,
          <>
            <strong>Problem 3</strong> is the flu-and-measles lesson again in a different suit. LPG explosions start
            fires three times more reliably than short circuits and still lose 19/43 to 24/43, because they were four
            times less likely to happen.
          </>,
          <>
            <strong>Problem 5</strong> comes with the deck’s own comment, and it is the best sentence in the practice
            set: Janet botches only 1 repair in 20, and yet more than 11% of all the botched repairs are hers. A low
            failure rate on a large share of the work still produces a lot of failures.
          </>,
        ]}
      />
      <Checked>
        <strong>Problem 6</strong> — the missing aircraft. The slide stops after one line, P(discovered and has a
        locator) = (0.7)(0.6) = 0.42, and never answers either part. The two conditionals it does not print come from
        the complement rule: 40% of discovered aircraft have no locator, and 10% of undiscovered ones do have one.
        <br />
        <br />
        That gives four disjoint cases: 0.42, 0.28, 0.03 and 0.27. They add to exactly 1.00, which is the check.
        <br />
        (a) P(not discovered | locator) = 0.03 / (0.42 + 0.03) = 0.03/0.45 = <strong>1/15 ≈ 0.0667</strong>.
        <br />
        (b) P(discovered | no locator) = 0.28 / (0.28 + 0.27) = 0.28/0.55 = <strong>28/55 ≈ 0.5091</strong>.
        <br />
        <br />
        Both were computed by the lab above from the deck’s own 0.7, 0.6 and 0.9, and both were checked by substituting
        back: the four joint probabilities sum to 1, and each answer is one of them over the pair it belongs to.
      </Checked>
      <Unsettled>
        <strong>Problem 7</strong> — the two bidding firms. The question says the probability that W bids is 3/4. The
        printed solution lists P(W) = 1/3 and P(W′) = 2/3, and reaches P(V) = 11/18 and P(W′ | V) = 9/11. Those two
        readings cannot both be right: the question’s own 3/4 would give P(V) = 7/16 and P(W′ | V) = 3/7 instead.
        <br />
        <br />
        Nothing in the deck says which was intended, so <strong>no answer is printed here for either part</strong>. The
        slider in the lab shows exactly where 11/18 comes from, and what the question as written would have given, so
        you can take either to a tutor and ask which the paper meant. Do not memorise one of them.
      </Unsettled>

      <WhyAiml method="the confusion matrix — reading a model report the way these problems read a population">
        <p className="mb-2">
          Every one of these problems is a confusion matrix with the counts written as probabilities. Problem 2 is a
          three-machine population with a defect rate per machine; a model report is a two-class population with an
          error rate per class. In both cases the numbers you are given are conditioned on the truth — the defect rate
          of machine A, the recall of the positive class — and the number you actually want is conditioned on the
          observation.
        </p>
        <p>
          That is why a model’s evaluation table is nearly useless without the class balance beside it, and why
          scikit-learn’s <code>classification_report</code> prints a support column. Problem 5 makes the point sharpest:
          Janet has the second-lowest error rate of the four technicians and the second-largest share of the blame,
          purely because of how much work she does. Swap in a classifier and that is a per-class error rate against a
          per-class volume, which is the same table and the same trap.
        </p>
      </WhyAiml>

      <Takeaway>
        Slices, priors, likelihoods, products, total, divide, check. Six of the seven sheets fall out of that recipe;
        the seventh cannot be settled from what the deck prints, and saying so is the right answer.
      </Takeaway>
    </>
  ),
}
