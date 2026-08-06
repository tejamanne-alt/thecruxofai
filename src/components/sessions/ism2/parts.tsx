/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { CommitteeLab, DiceLab, IndependenceLab, SampleSpaceLab } from '@/components/charts/prob-space-lab'
import { AxiomLab, ConvergeLab, VennLab } from '@/components/charts/prob-venn-lab'
import { Para, Takeaway, Terms, Worked } from '../session-parts'

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

export const ISM2_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  experiment: (
    <>
      <Para>
        A <strong>random experiment</strong> is anything you can do where you cannot say in advance what will happen.
        That is the whole definition. It does not need a laboratory.
      </Para>
      <Para>The lecture opens with a list of them:</Para>
      <List
        items={[
          <>Flip a coin. Heads or tails?</>,
          <>Walk to a bus stop. How long do you wait?</>,
          <>Give a lecture. How many students are listening?</>,
          <>Send a waveform down a channel. What arrives at the other end?</>,
          <>Pull a card from a deck.</>,
          <>Listen to three phone calls in a row and mark each one as voice (v) or data (d).</>,
        ]}
      />
      <Para>
        Notice how ordinary these are. The uncertainty is the only thing they have in common, and that is enough to make
        the whole of probability apply to them.
      </Para>
      <Para>
        Try one below. Press <strong>Run it once</strong> a few times — the answer jumps around and you cannot predict
        it. Then press <strong>Run 1000</strong> and watch something steady appear out of all that jumping. That
        steadiness is what probability measures.
      </Para>

      <Lab>
        <ConvergeLab />
      </Lab>

      <Para>
        This is the important idea to take away. A single run of a random experiment tells you almost nothing. The
        pattern only shows up over many runs. Probability is a statement about the long run, not about the next go.
      </Para>

      <Terms
        items={[
          { term: 'random experiment', def: 'Any action whose outcome you cannot know before you do it.' },
          { term: 'outcome', def: 'One particular thing that happened on one run.' },
          { term: 'trial', def: 'One run of the experiment.' },
        ]}
      />
      <Takeaway>
        Probability does not predict your next coin flip. It describes what happens when you flip it a great many times.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  space: (
    <>
      <Para>
        The <strong>sample space</strong> is the set of everything that could possibly happen. It is written{' '}
        <strong>S</strong>. Before working out any probability at all, write down S — it is where every later question
        gets its answer.
      </Para>

      <Worked title="Two from the slides">
        {`Throw a die and record what comes up:

    S = { 1, 2, 3, 4, 5, 6 }        so |S| = 6


Make a chip and test whether it meets the quality target.
The possible outcomes are accepted (a) and rejected (r):

    S = { a, r }                     so |S| = 2`}
      </Worked>

      <Para>
        The vertical bars in <strong>|S|</strong> just mean &ldquo;how many things are in it&rdquo;. Pick an experiment
        below and its sample space is written out in full.
      </Para>

      <Lab>
        <SampleSpaceLab />
      </Lab>

      <Para>
        Try <strong>three phone calls</strong>. Each call is voice or data, so there are 2 × 2 × 2 = 8 outcomes. That
        multiplying is worth noticing: sample spaces grow very fast, and by ten calls there are 1024 of them. Part 13 is
        about what to do when the list gets too long to write.
      </Para>
      <Para>
        One thing to be careful about. The outcomes in S must be things that cannot happen together, and between them
        they must cover everything. Exactly one of them happens on each run — no more, no less.
      </Para>

      <Terms
        items={[
          { term: 'sample space', say: 'S', def: 'The set of every possible outcome of the experiment.' },
          { term: '|S|', say: 'the size of S', def: 'How many outcomes are in it.' },
          { term: 'set', def: 'A collection of things, written inside curly brackets.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  event: (
    <>
      <Para>
        An <strong>event</strong> is a part of the sample space. Formally: a subset of S. In plain terms, it is the list
        of outcomes you happen to care about.
      </Para>
      <Para>
        &ldquo;The die shows more than 3&rdquo; is an event. Written out, it is the set &#123;4, 5, 6&#125;. Each time
        you run the experiment, the event either happened — because what came up is in that list — or it did not.
      </Para>
      <Para>Build one yourself. Click outcomes below and watch the event and its probability appear.</Para>

      <Lab>
        <SampleSpaceLab />
      </Lab>

      <Para>
        The probability came out as a count over a count. That is the <strong>classical</strong> definition, and it
        works whenever the outcomes are all equally likely:
      </Para>

      <Worked title="Classical probability">
        {`               number of outcomes in A
    P(A)  =  ─────────────────────────────────
               total number of outcomes in S


For "the die shows more than 3":

    A = { 4, 5, 6 }     so    P(A) = 3/6 = 1/2`}
      </Worked>

      <Para>Two events sit at the edges and are worth knowing by name.</Para>
      <List
        items={[
          <>
            Pick <strong>everything</strong> and you have the event S itself. It happens every time, so P(S) = 1.
          </>,
          <>
            Pick <strong>nothing</strong> and you have the empty event, written ∅. It never happens, so P(∅) = 0.
          </>,
        ]}
      />
      <Para>
        Both are allowed. &ldquo;Event&rdquo; in maths does not mean something interesting — it means any subset at all,
        including the two boring ones.
      </Para>

      <Terms
        items={[
          { term: 'event', def: 'A set of outcomes you care about. Part of the sample space.' },
          { term: 'subset', def: 'A set made entirely of things from a bigger set.' },
          { term: '∅', say: 'the empty set', def: 'The event with nothing in it. It can never happen.' },
          { term: 'equally likely', def: 'Every outcome has the same chance. Only then can you just count.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  complement: (
    <>
      <Para>
        The <strong>complement</strong> of an event A is everything in S that is <em>not</em> in A. It is written{' '}
        <strong>Aᶜ</strong>, and sometimes A&rsquo; or Ā.
      </Para>
      <Para>
        If A is &ldquo;the die shows more than 3&rdquo;, then Aᶜ is &ldquo;the die shows 3 or less&rdquo;. Between them
        they cover S exactly once: every outcome is in one of them and never in both.
      </Para>
      <Para>Press the button below to flip between an event and its complement.</Para>

      <Lab>
        <SampleSpaceLab showComplement />
      </Lab>

      <Para>That gives one of the most useful shortcuts in the whole subject:</Para>

      <Worked title="The complement rule">
        {`    P(A) + P(Aᶜ) = 1

so  P(A)  = 1 − P(Aᶜ)`}
      </Worked>

      <Para>
        Why is that useful? Because one side is often far easier to work out than the other. &ldquo;At least one head in
        ten flips&rdquo; is a horrible thing to count directly. Its complement is &ldquo;no heads at all&rdquo;, which
        is one single outcome. Work that out and subtract.
      </Para>
      <Para>
        You will see the same trick in the lecture&rsquo;s cable example: rather than adding up everything that counts
        as &ldquo;longer than 1990mm&rdquo;, it works out the probability of being too short and takes it off 1.
      </Para>

      <Terms
        items={[
          { term: 'complement', say: 'A c', def: 'Everything in the sample space that is not in A.' },
          { term: 'Aᶜ, A′, Ā', def: 'Three ways of writing the same thing. Books disagree; they all mean "not A".' },
          { term: 'at least one', def: 'Almost always a hint to work out "none at all" and subtract from 1.' },
        ]}
      />
      <Takeaway>When an event looks awkward to count, count its opposite and take it away from 1.</Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  setops: (
    <>
      <Para>Two events can be combined in two ways, and both have a plain English meaning.</Para>
      <List
        items={[
          <>
            <strong>Union</strong>, written <strong>A ∪ B</strong> and said &ldquo;A union B&rdquo;. It contains every
            outcome that is in A, or in B, or in both. In English: <em>A or B happens</em>.
          </>,
          <>
            <strong>Intersection</strong>, written <strong>A ∩ B</strong> and said &ldquo;A intersect B&rdquo;. It
            contains only the outcomes in <em>both</em>. In English: <em>A and B both happen</em>.
          </>,
        ]}
      />
      <Para>
        The &ldquo;or&rdquo; in union is the inclusive kind — it allows both. That is not how &ldquo;or&rdquo; usually
        works in conversation, where &ldquo;tea or coffee?&rdquo; rarely means you may have both, and it catches people
        out.
      </Para>
      <Para>
        Below, each circle&rsquo;s <strong>area</strong> is its probability, and the whole box is 1. So the bit where
        they overlap is not a number someone typed in — it is a genuine area. Drag the circles.
      </Para>

      <Lab>
        <VennLab />
      </Lab>

      <Para>
        Watch the four boxes in the panel: A but not B, B but not A, both, and neither. They always add to 100%,
        whatever you drag. That is because every possible outcome falls into exactly one of them.
      </Para>

      <Terms
        items={[
          { term: 'A ∪ B', say: 'A union B', def: 'A happens, or B happens, or both. The "or" includes both.' },
          { term: 'A ∩ B', say: 'A intersect B', def: 'Both A and B happen.' },
          { term: 'Venn diagram', def: 'Overlapping circles drawn inside a box, where the box is the sample space.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  exclusive: (
    <>
      <Para>
        Two events are <strong>mutually exclusive</strong> when they have no outcomes in common. If one happens, the
        other cannot.
      </Para>
      <Para>
        Flip a coin: heads and tails are mutually exclusive. You cannot get both on one flip. Roll a die: &ldquo;shows a
        2&rdquo; and &ldquo;shows a 5&rdquo; are mutually exclusive.
      </Para>
      <Para>
        In set language it is one short line: <strong>A ∩ B = ∅</strong>, so <strong>P(A ∩ B) = 0</strong>. On the
        picture it means the circles do not touch. Press <strong>Pull them apart</strong> below.
      </Para>

      <Lab>
        <VennLab mode="exclusive" />
      </Lab>

      <Para>
        Once they are apart, look at what happens to the addition rule in the panel. The last term goes to zero and the
        rule collapses to plain adding:
      </Para>

      <Worked title="The rule, and its short version">
        {`in general              P(A ∪ B) = P(A) + P(B) − P(A ∩ B)

if mutually exclusive   P(A ∪ B) = P(A) + P(B)
                                          since P(A ∩ B) = 0`}
      </Worked>

      <Para>
        That is the only thing being mutually exclusive gains you — permission to just add. It is worth checking before
        you use it, because adding when the events actually overlap is one of the most common mistakes in the subject.
      </Para>
      <Para>
        The outcomes inside a sample space are always mutually exclusive from each other. That is why you can add their
        probabilities up and get 1, which is the axiom in part 8.
      </Para>

      <Terms
        items={[
          { term: 'mutually exclusive', def: 'Cannot both happen. Also called disjoint.' },
          { term: 'disjoint', def: 'Another word for mutually exclusive. Common in books.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  define: (
    <>
      <Para>
        The lecture gives three ways of saying what a probability <em>is</em>. They are not rivals — they answer
        slightly different questions.
      </Para>
      <List
        items={[
          <>
            <strong>Classical.</strong> Count the outcomes you want, divide by the total. It needs every outcome to be
            equally likely, which is true for fair dice and shuffled cards and rarely true for anything else.
          </>,
          <>
            <strong>Empirical</strong>, also called frequency. Run it many times and see what fraction of runs the event
            happened in. It works on anything, but needs a lot of data.
          </>,
          <>
            <strong>Axiomatic.</strong> Do not define it at all. Just state the rules any probability must obey, and
            work from those. This is the one modern maths is built on, and it is part 8.
          </>,
        ]}
      />
      <Para>
        There is a fourth you will hear about, <strong>subjective</strong> probability: someone&rsquo;s honest degree of
        belief, like &ldquo;70% chance this project ships on time&rdquo;. You cannot count it and you cannot repeat it,
        but people make decisions on it every day.
      </Para>
      <Para>
        Below, the dashed line is what counting says. The solid line is what actually happened. Run it once — useless.
        Run it a thousand times and watch the two meet.
      </Para>

      <Lab>
        <ConvergeLab />
      </Lab>

      <Para>
        That meeting is not a coincidence and it is not a proof either. It is a result called the law of large numbers,
        which comes later in the course. For now, the useful thing is the intuition: the counted answer is what the
        run-it-and-see answer settles down to.
      </Para>

      <Terms
        items={[
          {
            term: 'classical probability',
            def: 'Favourable outcomes divided by total outcomes. Needs equally likely outcomes.',
          },
          { term: 'empirical probability', def: 'The fraction of actual runs in which the event happened.' },
          {
            term: 'axiomatic probability',
            def: 'Defined by the rules it must obey, rather than by how you calculate it.',
          },
          { term: 'subjective probability', def: 'A considered degree of belief. Not countable, still useful.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  axioms: (
    <>
      <Para>
        The axiomatic approach does not say what a probability is. It says what any set of probabilities must obey.
        There are three rules, and everything else in the subject is built from them.
      </Para>

      <Worked title="The three axioms">
        {`1.  P(S) = 1
        Something in the sample space definitely happens.

2.  0 ≤ P(E) ≤ 1
        Nothing is less likely than impossible or more likely than certain.

3.  If E₁ ∩ E₂ = ∅  then  P(E₁ ∪ E₂) = P(E₁) + P(E₂)
        For events that cannot both happen, probabilities simply add.`}
      </Worked>

      <Para>
        Example 1 in the slides gives five candidate assignments for four outcomes and asks which are allowed. Four of
        them are not. Work through them below and find out which rule each one breaks.
      </Para>

      <Lab>
        <AxiomLab />
      </Lab>

      <Para>
        Case (c) is the obvious one — a negative probability is meaningless. The others fail more quietly: the numbers
        look reasonable but do not add up to 1. Since the four outcomes are everything that can happen, axioms 1 and 3
        together force their probabilities to total exactly 1.
      </Para>
      <Para>
        Case (d) is worth a second look, because 1/2 + 1/4 + 1/8 + 1/16 comes to 15/16. Close, and still wrong. There is
        a missing 1/16 of probability with nowhere to live.
      </Para>

      <Terms
        items={[
          { term: 'axiom', def: 'A rule taken as given, which everything else is built on.' },
          { term: 'P(S) = 1', def: 'Something happens. The sample space covers every possibility.' },
          { term: 'permissible assignment', def: 'A set of probabilities that obeys all three axioms.' },
        ]}
      />
      <Takeaway>
        Nothing negative, nothing above 1, and everything adds to exactly 1. Check those three before trusting any set
        of probabilities.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  addition: (
    <>
      <Para>
        The <strong>addition rule</strong> answers &ldquo;what is the chance of A or B?&rdquo;
      </Para>

      <Worked title="The addition rule">{`    P(A ∪ B) = P(A) + P(B) − P(A ∩ B)`}</Worked>

      <Para>
        The interesting part is why you subtract. Add P(A) and P(B) and every outcome in the overlap gets counted twice
        — once as part of A, once as part of B. Taking the overlap off once puts that right.
      </Para>
      <Para>
        Below, the circles are drawn so their area is their probability. Drag them together and watch the running
        arithmetic in the panel.
      </Para>

      <Lab>
        <VennLab />
      </Lab>

      <Para>
        The rule extends to three events, and the same double-counting logic keeps going — you take off each pair, then
        add the triple back on because you have now removed it too often:
      </Para>

      <Worked title="Three events, same idea">
        {`P(A ∪ B ∪ C) = P(A) + P(B) + P(C)
               − P(A ∩ B) − P(A ∩ C) − P(B ∩ C)
               + P(A ∩ B ∩ C)`}
      </Worked>

      <Para>
        Practice question 3 in the slides is the two-event rule exactly: 60% of households take internet, 80% take
        television, 50% take both. So at least one is 0.6 + 0.8 − 0.5 = 0.9. Adding without subtracting would have given
        1.4, which is not even a probability.
      </Para>

      <Terms
        items={[
          { term: 'addition rule', def: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). The last term stops double-counting.' },
          {
            term: 'exactly one',
            def: 'P(A) + P(B) − 2·P(A ∩ B). You take the overlap off twice, because you want neither of the both-cases.',
          },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  independent: (
    <>
      <Para>
        This is the pair that gets muddled most often, so it is worth being slow about. They sound similar and they mean
        completely different things.
      </Para>
      <List
        items={[
          <>
            <strong>Mutually exclusive</strong> is about whether they can happen <em>together</em>. If A happens, B
            cannot. Test: P(A ∩ B) = 0.
          </>,
          <>
            <strong>Independent</strong> is about whether one <em>tells you anything</em> about the other. Knowing A
            happened leaves the chance of B exactly as it was. Test: P(A ∩ B) = P(A) × P(B).
          </>,
        ]}
      />
      <Para>
        Set the numbers below and press each button in turn. You cannot make both labels true at once, unless one of the
        events is impossible.
      </Para>

      <Lab>
        <IndependenceLab />
      </Lab>

      <Para>
        Here is why they clash. If two events are mutually exclusive, then learning that A happened tells you B
        definitely did <em>not</em> — which is a huge amount of information. So mutually exclusive events are about as
        far from independent as you can get.
      </Para>
      <Para>
        The other direction trips people too: <strong>independent events usually do overlap</strong>. Flip a coin and
        roll a die. &ldquo;Heads&rdquo; and &ldquo;a six&rdquo; are independent, and they happily happen together, one
        time in twelve.
      </Para>

      <Worked title="Example 7 from the slides, worked through">
        {`Throw two dice.

A = { (1,2), (2,1), (2,2) }                          P(A) = 3/36
B = { (2,2), (2,3), (2,4), (2,5), (2,6),
      (3,2), (4,2), (5,2), (6,2) }                   P(B) = 9/36

A ∩ B = { (2,2) }                              P(A ∩ B) = 1/36

Test:   P(A) × P(B) = (3/36)(9/36) = 27/1296 = 1/48

        1/36  ≠  1/48        so A and B are dependent.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'independent',
            def: 'Knowing one happened does not change the chance of the other. Test with P(A ∩ B) = P(A)P(B).',
          },
          { term: 'dependent', def: 'Knowing one does change the chance of the other.' },
          { term: 'multiplication rule', def: 'For independent events only, P(A ∩ B) = P(A) × P(B).' },
        ]}
      />
      <Takeaway>
        Exclusive is about happening together. Independent is about telling you something. Different questions,
        different tests.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  dice: (
    <>
      <Para>
        Two dice is the standard worked example, and it hides one trap. There are <strong>36</strong> outcomes, not 11.
      </Para>
      <Para>
        People count the possible sums — 2 through 12 — and assume each is equally likely. They are not. A sum of 7
        happens six different ways; a sum of 12 happens one way. The <em>squares</em> are equally likely; the sums are
        not.
      </Para>
      <Para>Pick a condition below and the matching squares light up. Count them.</Para>

      <Lab>
        <DiceLab />
      </Lab>

      <Para>Example 2 from the slides asks for three of these:</Para>

      <Worked title="Example 2, answered">
        {`a)  sum greater than 8
    { 9, 10, 11, 12 } happens in 4+3+2+1 = 10 squares
    P = 10/36 = 5/18

b)  sum less than 6
    { 2, 3, 4, 5 } happens in 1+2+3+4 = 10 squares
    P = 10/36 = 5/18

c)  neither 7 nor 11
    7 happens 6 ways, 11 happens 2 ways, so 8 squares are out
    P = (36 − 8)/36 = 28/36 = 7/9`}
      </Worked>

      <Para>
        Part (c) is the complement trick from part 4 again. Counting all the sums that are not 7 or 11 would take a
        while; counting the eight that are is quick, and then you subtract.
      </Para>

      <Takeaway>
        When outcomes are equally likely you can just count. The hard part is making sure you are counting the right
        things — squares, not sums.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  worked: (
    <>
      <Para>
        Exam questions rarely hand you the overlap. They give you three of the four numbers in the addition rule and ask
        for the fourth. Rearranging is the whole skill.
      </Para>

      <Worked title="The rearrangement">
        {`from    P(A ∪ B) = P(A) + P(B) − P(A ∩ B)

get     P(A ∩ B) = P(A) + P(B) − P(A ∪ B)`}
      </Worked>

      <Para>Two of the lecture&rsquo;s examples are exactly this.</Para>

      <Worked title="Example 4 — the investors">
        {`75% invest in traditional annuities        P(A) = 0.75
45% invest in the stock market            P(B) = 0.45
85% invest in one or the other or both    P(A ∪ B) = 0.85

P(A ∩ B) = 0.75 + 0.45 − 0.85 = 0.35

So 35% invest in both.`}
      </Worked>

      <Worked title="Example 3 — the two exams">
        {`P(passes statistics)          P(S) = 2/3
P(does NOT pass maths) = 5/9, so P(M) = 1 − 5/9 = 4/9
P(passes at least one)   P(S ∪ M) = 4/5

P(S ∩ M) = 2/3 + 4/9 − 4/5 = 14/45

So the chance of passing both is 14/45.`}
      </Worked>

      <Para>
        Notice the second one slips in the complement rule as well: you are told the chance of <em>not</em> passing
        maths, so the first move is to take it off 1.
      </Para>
      <Para>
        Set the three numbers you are given below and read the fourth off the picture. If a combination is impossible
        the circles will show you why — the overlap cannot be bigger than either circle.
      </Para>

      <Lab>
        <VennLab mode="solve" />
      </Lab>

      <Para>
        One more from the slides, Example 6, which is a nice bit of reasoning rather than arithmetic. A and B are
        mutually exclusive and together they make up all of S. What is the largest P(A)·P(B) can be?
      </Para>

      <Worked title="Example 6">
        {`A and B are mutually exclusive and A ∪ B = S

so      P(A) + P(B) = P(S) = 1

Two numbers with a fixed total have their biggest product
when they are equal, so P(A) = P(B) = 1/2

maximum P(A)·P(B) = 1/4`}
      </Worked>

      <Takeaway>
        The addition rule has four quantities in it. Give me any three and I can find the fourth — that is most of what
        these questions are testing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  counting: (
    <>
      <Para>
        Counting outcomes works fine while you can write them all down. For a committee of 5 chosen from 12 people there
        are 792 possibilities, so you need a way to count without listing.
      </Para>
      <Para>
        That way is the <strong>combination</strong>, written <strong>C(n, k)</strong> or ⁿCₖ. It counts how many ways
        you can pick k things from n when the order does not matter — and for a committee it does not, because the same
        five people are the same committee whichever order you name them in.
      </Para>

      <Worked title="Combinations">
        {`             n!
C(n, k) = ──────────         where n! means n × (n−1) × … × 2 × 1
           k! (n − k)!

C(12, 5) = 792
C(4, 3)  = 4          C(8, 2) = 28`}
      </Worked>

      <Para>
        Example 8 asks: from 8 men and 4 women, choose 5. What is the chance the committee has a majority of women?
      </Para>
      <Para>
        Majority of 5 means 3 or more. With only 4 women available, that is two separate cases — 3 women or 4 women.
        They cannot both happen, so you work each out and add. Every split is laid out below.
      </Para>

      <Lab>
        <CommitteeLab />
      </Lab>

      <Worked title="Example 8, answered">
        {`3 women and 2 men:  C(4,3) × C(8,2) = 4 × 28 = 112
4 women and 1 man:  C(4,4) × C(8,1) = 1 ×  8 =   8
                                             -----
                                     total = 120

P(majority women) = 120 / 792 = 5/33 ≈ 0.1515`}
      </Worked>

      <Para>
        Two habits worth forming here. First, always ask whether order matters — if it does you need permutations
        instead, and the answer is bigger. Second, when a question says &ldquo;at least&rdquo; or
        &ldquo;majority&rdquo;, expect several cases and expect to add them.
      </Para>

      <Terms
        items={[
          {
            term: 'combination',
            say: 'n choose k',
            def: 'How many ways to pick k things from n when order does not matter.',
          },
          { term: 'permutation', def: 'The same, but when order does matter. Always a bigger number.' },
          { term: 'n!', say: 'n factorial', def: 'n × (n−1) × … × 2 × 1. And 0! is defined as 1.' },
        ]}
      />
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  practice: (
    <>
      <Para>
        Nine practice questions close the lecture. Here they are, with the tools from the earlier parts to work them
        out. Try each one on paper first.
      </Para>

      <Worked title="Q1 — bank accounts (answers given in the slides)">
        {`40% savings, 35% current, the rest are loans.

a) a loan account         1 − 0.40 − 0.35 = 0.25
b) NOT savings            1 − 0.40        = 0.60
c) NOT current            1 − 0.35        = 0.65
d) current or loan        0.35 + 0.25     = 0.60`}
      </Worked>

      <Para>
        Every part of Q1 is the complement rule or plain addition — the three account types are mutually exclusive, so
        nothing needs subtracting.
      </Para>

      <Worked title="Q2 — two people contradicting each other">
        {`A tells the truth 80% of the time, B 60% of the time.
They contradict when exactly one of them is truthful.

P(A true and B false) = 0.8 × 0.4 = 0.32
P(A false and B true) = 0.2 × 0.6 = 0.12
                                    ------
                                      0.44

So they contradict in 44% of cases.`}
      </Worked>

      <Para>
        Q2 quietly assumes the two are <strong>independent</strong>, which is why the probabilities may be multiplied.
        Worth noticing, because the question never says so out loud.
      </Para>

      <Worked title="Q3 — cable services">
        {`60% internet, 80% television, 50% both.

i)  at least one   = 0.6 + 0.8 − 0.5 = 0.90
ii) exactly one    = (0.6 − 0.5) + (0.8 − 0.5)
                   = 0.10 + 0.30 = 0.40`}
      </Worked>

      <Para>Use the Venn lab to check any of these — set the two circles and read the four boxes.</Para>

      <Lab>
        <VennLab />
      </Lab>

      <Para>The rest, with what each one is really testing:</Para>
      <List
        items={[
          <>
            <strong>Q4</strong> — 10 motors, 2 faulty, pick 2. Combinations, like part 13. Both good is C(8,2)/C(10,2).
          </>,
          <>
            <strong>Q5</strong> — coffee and soda, 55% / 45% / 70% at least one. Rearrange the addition rule for the
            overlap, then take the complement for part (ii).
          </>,
          <>
            <strong>Q6</strong> — 30 doing maths, 20 chemistry, 10 both, out of 80. Addition rule on counts rather than
            percentages.
          </>,
          <>
            <strong>Q7</strong> — given P(A ∪ B), P(A ∩ B) and P(A′). Complement first to get P(A), then rearrange for
            P(B).
          </>,
          <>
            <strong>Q8</strong> — P(A) = P(B) and the &ldquo;neither&rdquo; box equals the &ldquo;both&rdquo; box.
            Easiest with the four-box picture from part 10.
          </>,
          <>
            <strong>Q9</strong> — the insurance table. A two-way table is a sample space written as a grid; every
            question is adding up the right cells. The dice grid in part 11 is the same idea.
          </>,
        ]}
      />

      <Takeaway>
        Almost every one of these is the same three moves: write down the sample space, work out which outcomes you
        want, and use the complement whenever the opposite is easier to count.
      </Takeaway>
    </>
  ),
}
