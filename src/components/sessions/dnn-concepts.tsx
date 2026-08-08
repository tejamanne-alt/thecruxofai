'use client'

/**
 * Concepts, not chapters. A chapter walks through one lecture in the order it
 * was taught; a concept takes one idea and explains it on its own terms, so it
 * can be reached from anywhere and reused by a later course. These three come
 * out of Session 1 of Deep Neural Networks, and each links back to the chapter
 * parts it was drawn from.
 */
import { LossCompareLab, OverfitLab } from '@/components/charts/dl-components-lab'
import { AndOrLab } from '@/components/charts/dl-gate-lab'
import { NeuronLab, PerceptronThresholdLab } from '@/components/charts/dl-neuron-lab'
import { SeparableLab, XorLab } from '@/components/charts/dl-separable-lab'
import Link from 'next/link'
import { UsedInAiml } from './algebra'
import { Connections } from './connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from './session-parts'

/** Where in the taught chapters this idea came from. */
function FromLecture({ items }: { items: Array<{ href: string; label: string }> }) {
  return (
    <div className="mt-7 rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-4">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        Taught in these sessions
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-md border border-zinc-950/10 bg-white px-2.5 py-1.5 text-[12px] font-semibold hover:border-zinc-950/30"
          >
            {i.label} →
          </Link>
        ))}
      </div>
    </div>
  )
}

function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 mb-2 text-lg font-semibold tracking-[-0.02em]">{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="crux-prose mb-3 max-w-[720px] text-[14px]/[1.7] text-zinc-700">{children}</p>
}

/* ========================================================================== */

export function NeuronConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="The artificial neuron"
        intro="One unit, and the only unit. It takes a list of numbers, multiplies each by a weight of its own, adds the results into a single score, and turns that score into an answer. Every network you will ever meet is this, repeated and wired together."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine a loan officer with three pieces of information about an applicant: income, years in the job, and
            existing debt. They do not weigh all three equally. Income counts strongly in favour, years count a little
            in favour, debt counts against. So they multiply each fact by how much it counts, add the results into one
            score, and approve the loan if the score clears a bar.
          </>,
          <>
            That is a neuron exactly. The weights are how much each fact counts and which way; the sum is the score; the
            bar is the threshold. Nothing is hidden in the analogy — the arithmetic really is that small, and the only
            thing learning does is adjust how much each fact counts.
          </>,
        ]}
        mappings={[
          {
            title: 'wᵢ, the weights',
            body: 'How much input i counts, and in which direction. Negative means that input argues against firing. These are what training changes.',
          },
          {
            title: 'z = Σ wᵢxᵢ',
            body: 'The score. It is the dot product of the weight vector with the input vector, so its sign says which side of a plane the input is on.',
          },
          {
            title: 'w₀, the bias',
            body: 'The weight on a constant input of 1. It moves the bar without changing how any real input counts — and without it every boundary is stuck through the origin.',
          },
        ]}
        footnote="The lab is the one from Session 1 of the Deep Neural Networks course, and it computes z term by term from the weights you can see. Nothing on this page is stored; drag anything and every number is worked out again."
      />

      <H2>The arithmetic, in full</H2>
      <P>
        There is no step you are expected to fill in. With three inputs, of which the first is the constant x₀ = 1, the
        score is w₀·1 + w₁x₁ + w₂x₂, and the answer is +1 if that is greater than zero and −1 otherwise.
      </P>
      <P>
        The reason x₀ is nailed to 1 is worth stating plainly. A neuron ought to fire when the score beats some
        threshold θ — that is, when w₁x₁ + w₂x₂ {'>'} θ. Move θ across and it becomes w₁x₁ + w₂x₂ − θ {'>'} 0, so if you
        define w₀ = −θ and pretend there is an input x₀ always equal to 1, the comparison is always against zero and the
        threshold is just another weight. That is the only trick in the definition.
      </P>

      <Lab>
        <NeuronLab />
      </Lab>

      <H2>What the weight vector is, geometrically</H2>
      <P>
        Set the two weights and look at the teal arrow. The boundary is always at right angles to it. That is not a
        coincidence of the drawing: the boundary is where w · x = −w₀, and the set of directions with w · x = 0 is
        exactly the set of vectors orthogonal to w. So <strong>w points across the boundary, never along it</strong>,
        and training a neuron means turning that arrow.
      </P>
      <P>
        A consequence that catches people out: making every weight bigger does not move the boundary at all. Doubling w
        and w₀ doubles z everywhere, and the sign of z — the only thing a perceptron reports — is unchanged.
      </P>

      <Lab>
        <PerceptronThresholdLab />
      </Lab>

      <Explainers
        plain="A neuron holds one number per input, called a weight. To make a prediction it multiplies each input by its weight, adds everything up into one score, and passes that score through an activation function which turns it into an answer. A constant input of 1 carries an extra weight called the bias, so that the comparison is always against zero instead of against a separate threshold. The weight vector points at right angles to the decision boundary, so its direction decides how the boundary is tilted and the bias decides where it sits."
        breaks="Two things go wrong quietly. Drop the bias and every boundary is forced through the origin — even the NOT gate becomes impossible to represent. And the threshold activation, sign(z), has a derivative of zero everywhere it is defined, so no gradient-based training can pass through it. The perceptron rule works around that by never differentiating anything, which is fine for one unit and useless the moment there is a hidden one."
      >
        <MathBlock
          intro="Four lines. The first two define the unit, the third is what it draws in space, the fourth is the freedom that makes two different-looking answers the same answer."
          formulas={[
            { formula: 'z = w₀·1 + w₁x₁ + … + wₙxₙ', reading: 'The score. A dot product, written out.' },
            { formula: 'h = +1 if z > 0, else −1', reading: 'The activation. A sum of exactly zero gives −1.' },
            {
              formula: 'w · x + b = 0',
              reading: 'The boundary. w is the normal vector — at right angles to it, not on it.',
            },
            {
              formula: 'c(w · x + b) = 0 for any c > 0',
              reading: 'Scaling all the weights changes ‖w‖ and moves the boundary nowhere.',
            },
          ]}
          legend={[
            { sym: 'wᵢ', name: 'A weight', note: 'How much input i counts. Learned.', val: 'drag the sliders' },
            { sym: 'w₀', name: 'The bias', note: 'Weight on the constant input.', val: 'slides the boundary' },
            { sym: 'x₀', name: 'Constant input', note: 'Always 1, so the threshold is a weight.', val: '1' },
            { sym: 'z', name: 'The score', note: 'Also called the hypothesis.', val: 'read-out on the lab' },
            { sym: 'h', name: 'The output', note: 'Also written ŷ or o.', val: '+1 or −1' },
            {
              sym: '‖w‖',
              name: 'Length of w',
              note: 'Say “norm of w”. Not a property of the boundary.',
              val: 'read-out on the lab',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'nn.Linear is a layer of these',
            how: 'nn.Linear(3, 8) is eight neurons over the same three inputs: an 8 × 3 weight matrix and a bias vector of eight. The forward pass is one matrix–vector product.',
          },
          {
            what: 'bias=True is the default for a reason',
            how: 'With no bias every decision surface passes through the origin. Turning it off is only safe when a following normalisation layer supplies its own shift.',
          },
          {
            what: 'Scaling the weights changes confidence, not the decision',
            how: 'Once sign is replaced by a sigmoid, a large ‖w‖ makes the output jump from 0 to 1 over a tiny distance. Weight decay shrinks that steepness — which is what L2 regularisation actually does.',
          },
          {
            what: 'The dot product is the whole linear half',
            how: 'Positive when the input points the way the weights do, zero at right angles, negative when it opposes. That is why the sign of one number is a usable decision.',
          },
          {
            what: 'Inputs on wildly different scales break training',
            how: 'A feature measured in millions needs a weight in millionths, and gradient descent takes the same step in every direction. StandardScaler, or normalised inputs, exist for this.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl1/neuron', label: 'Session 1, part 14 — the artificial neuron' },
          { href: '/session/dl1/perceptron', label: 'Session 1, part 15 — the perceptron' },
          { href: '/session/dl1/hyperplane', label: 'Session 1, part 21 — what it can represent' },
        ]}
      />

      <Connections topic="neuron" />
    </div>
  )
}

/* ========================================================================== */

export function LinSepConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Linear separability and the decision boundary"
        intro="Some problems can be settled with one straight cut, and some cannot. Which side of that line your data falls on decides whether a single neuron is enough, whether the perceptron rule will ever stop, and what you have to do instead when it is not."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Put a handful of red and blue counters on a table and try to slide a ruler between them so that all the red
            ones are on one side and all the blue ones on the other. Sometimes it works first go. Sometimes you can
            shuffle the ruler all afternoon and it will never work, because the colours alternate around the table.
          </>,
          <>
            That is the entire question. If a ruler can do it, the data is <strong>linearly separable</strong> and one
            neuron can learn it. If no ruler can, one neuron never will — and the honest options are to change the
            table, by inventing new features, or to use more than one ruler, which is what a hidden layer is.
          </>,
        ]}
        mappings={[
          {
            title: 'The ruler',
            body: 'The decision boundary: the set of points where the score is exactly zero. A line in two dimensions, a plane in three, a hyperplane above that.',
          },
          {
            title: 'Which side',
            body: 'The sign of w · x + b. Nothing else is reported — not how far, not how confident, just which side.',
          },
          {
            title: 'No ruler works',
            body: 'Non-linearly separable. The perceptron rule does not fail loudly on this data; it cycles forever, never settling and never saying so.',
          },
        ]}
        footnote="The thirteen-point example and the four XOR points are both from Session 1 of the Deep Neural Networks course, and every verdict on this page is recomputed from the weights on screen rather than stored."
      />

      <H2>When one line is enough</H2>
      <P>
        Thirteen labelled points, and the line 2x₁ + 3x₂ − 25 = 0. Press <strong>The deck’s line</strong> in the lab and
        the read-out says 13 of 13 — every point is on the side its label claims. Then move the sliders and watch how
        much freedom there is: because the two groups leave a visible gap, a whole band of different lines separates
        them just as well.
      </P>
      <P>
        That freedom is worth noticing, because it raises the question this session does not answer. If many lines work,
        which one should you prefer? The usual answer is the one that leaves the widest gap on both sides, which is what
        a support vector machine computes — and it is the one thing a perceptron has no opinion about at all.
      </P>

      <Lab>
        <SeparableLab />
      </Lab>

      <H2>When one line is not enough</H2>
      <P>
        XOR is the smallest example there is: four points at the corners of a square, with opposite corners sharing a
        label. Swing the line wherever you like and three of four is the ceiling.
      </P>
      <P>
        The reason is one sentence. A linear score is average-preserving — its value at the midpoint of two points is
        the average of its values at those two points. Both diagonals of the square meet at the same midpoint (0.5,
        0.5). One diagonal says that midpoint must score above zero; the other says it must score at or below zero. No
        function can do both, so no line exists.
      </P>

      <Lab>
        <XorLab />
      </Lab>

      <H2>What a straight cut can still do</H2>
      <P>
        Before writing linear models off, it is worth seeing how much they handle. AND, OR, NAND and NOR are all
        linearly separable, and the lab below solves any of them by dragging a single line. In each case one corner of
        the square is being cut off from the other three, and a straight cut can always separate one point from three.
      </P>

      <Lab>
        <AndOrLab />
      </Lab>

      <Explainers
        plain="A dataset is linearly separable when some hyperplane puts every example of one class strictly on one side and every example of the other class on the other. For a single neuron that is exactly the condition for a correct set of weights to exist, and the perceptron learning rule is guaranteed to find one — provided the learning rate is small enough. When no such hyperplane exists, no weights are correct, so the rule always has a mistake to react to and never settles. The two standard cures are to add features so the data becomes separable in a bigger space, or to add a hidden layer so that several straight cuts can be combined."
        breaks="The failure is silent. A perceptron on non-separable data does not report an error, does not converge to something reasonable, and does not stop — it cycles, and the only way to know is to have checked separability or to notice the weights never settle. The second trap is thinking separability is a property of the problem: it is a property of the features you chose. Add the single feature x₁x₂ to XOR and the same four points become separable by a plane."
      >
        <MathBlock
          intro="One definition, one guarantee, one impossibility proof. The proof is short enough to reproduce in an exam and is the standard answer to “show XOR is not linearly separable”."
          formulas={[
            {
              formula: '∃ w, b : (w · xᵢ + b > 0 ⟺ tᵢ = +1) for all i',
              reading:
                'Linearly separable: there exists some weight vector and bias that gets every example right. ∃ means “there exists”; ⟺ means “exactly when”.',
            },
            {
              formula: 'separable + small η ⟹ the perceptron rule converges',
              reading: 'The guarantee from slide 67. Both conditions are needed and neither is enough alone.',
            },
            {
              formula: 'z(½a + ½b) = ½z(a) + ½z(b)',
              reading: 'A linear score is average-preserving. This one line is the whole XOR proof.',
            },
            {
              formula: '(0,0)+(1,1) and (0,1)+(1,0) share the midpoint (½, ½)',
              reading:
                'So that midpoint would have to score both above zero and at or below it. Contradiction, so no line exists.',
            },
            {
              formula: 'add x₁x₂ ⟹ XOR becomes separable in ℝ³',
              reading: 'The kernel idea: keep the straight cut and change the space it lives in.',
            },
          ]}
          legend={[
            {
              sym: '∃',
              name: 'There exists',
              note: 'At least one such thing can be found.',
              val: 'read “there exists”',
            },
            { sym: '⟺', name: 'If and only if', note: 'Both directions hold.', val: 'read “exactly when”' },
            { sym: '⟹', name: 'Implies', note: 'The left-hand side forces the right.', val: 'read “implies”' },
            { sym: 'w', name: 'Weight vector', note: 'The normal to the boundary.', val: 'the teal arrow' },
            { sym: 'b', name: 'The bias', note: 'Also written w₀. Slides the boundary.', val: 'a slider on each lab' },
            { sym: 'tᵢ', name: 'The target', note: 'The correct label of example i.', val: 'filled or hollow dot' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It decides whether one layer is enough',
            how: 'A single nn.Linear plus a decision is a hyperplane and nothing more. If your classes are not separable in the features you have, no amount of training that layer will help.',
          },
          {
            what: 'The kernel trick is “change the space, keep the line”',
            how: 'SVC(kernel="rbf") computes distances in a much larger feature space without ever building it. XOR with the extra feature x₁x₂ is the two-line version of the same idea.',
          },
          {
            what: 'A hidden layer is “several cuts, combined”',
            how: 'The XOR fix is OR and NAND feeding an AND. Each hidden unit is one hyperplane; the output unit is a vote over them.',
          },
          {
            what: 'Non-separable does not mean unusable',
            how: 'Logistic regression on non-separable data converges perfectly well, because it minimises a smooth loss rather than chasing every mistake. It is the perceptron rule specifically that cycles.',
          },
          {
            what: 'Which separating line matters when there are many',
            how: 'The margin — the width of the gap — is what a support vector machine maximises, and it generalises better than an arbitrary separator. A perceptron stops at the first line that works.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl1/separable', label: 'Session 1, part 22 — linearly separable data' },
          { href: '/session/dl1/xor', label: 'Session 1, part 23 — the data no line can split' },
          { href: '/session/dl1/mlp', label: 'Session 1, part 24 — the fix' },
        ]}
      />

      <Connections topic="linsep" />
    </div>
  )
}

/* ========================================================================== */

export function LossConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Objective functions: what learning actually minimises"
        intro="Training does not make a model “better”. It makes one specific number smaller. Which number you chose is therefore the most consequential decision in the whole pipeline, and it is usually made in two seconds and never revisited."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Suppose you pay a delivery driver a bonus for every parcel delivered before six o’clock. You will get
            parcels delivered before six. You will also get parcels left at the wrong door, because that was faster, and
            you never said anything about the right door.
          </>,
          <>
            A loss function is that bonus scheme, and a model is a driver with no imagination and infinite patience. It
            will optimise exactly the number you wrote down, to the last decimal place, including the parts you did not
            mean. Every unpleasant surprise in a deployed model is somebody’s objective function being taken literally.
          </>,
        ]}
        mappings={[
          {
            title: 'Lower is better',
            body: 'A convention, not a fact. Objectives are written so every problem is a minimisation, and one piece of machinery — gradient descent — solves all of them.',
          },
          {
            title: 'Squared error',
            body: 'Add up (prediction − truth)². The standard choice for predicting a number, and the reason a few extreme labels can drag every prediction with them.',
          },
          {
            title: 'Error rate',
            body: 'The fraction on the wrong side of a threshold. It ignores how wrong each one was, and its gradient is zero everywhere — which is why it is reported and not optimised.',
          },
        ]}
        footnote="The labs are from Session 1 of the Deep Neural Networks course. Both metrics are recomputed from the scores you can drag, so the comparison between them cannot go stale."
      />

      <H2>Two measures of the same predictions</H2>
      <P>
        Five examples, each with a true label of 0 or 1, and a model that gives each one a score. Squared error asks{' '}
        <em>how far is each score from the truth?</em> Error rate asks{' '}
        <em>how many ended up on the wrong side of the threshold?</em> They are different questions, and they can give
        different answers.
      </P>
      <P>
        Leave the threshold at 0.5 and press <strong>Model A</strong>, then <strong>Model B</strong>. Model A is
        confident and wrong once; model B is timid and right every time. Squared error prefers A, error rate prefers B,
        and neither is making a mistake. “Which model is better” is not a question you can answer until you say which
        measure you meant.
      </P>

      <Lab>
        <LossCompareLab />
      </Lab>

      <H2>Why error rate is never the thing you minimise</H2>
      <P>
        Nudge one weight a little. No example changes side, so the error rate does not move at all — and then at some
        point one example crosses over and it jumps. A function that is flat everywhere and then jumps has a slope of
        zero wherever it is defined, so gradient descent gets no information from it whatsoever.
      </P>
      <P>
        The standard resolution is to keep two numbers. You <strong>optimise</strong> a smooth stand-in — cross-entropy
        for classification, squared error for regression — and you <strong>report</strong> the metric anyone actually
        cares about. Keeping those two straight in your head is worth as much as any formula on this page.
      </P>

      <H2>The loss depends on the data, which is the whole problem</H2>
      <P>
        A loss is defined with respect to the model parameters <em>and</em> depends on the dataset. So there is a
        training loss and a held-back loss, and they are different numbers. Minimising the first is a means; the second
        is the only one anyone is paying for.
      </P>

      <Lab>
        <OverfitLab />
      </Lab>

      <Explainers
        plain="An objective function turns a model’s behaviour on a dataset into a single number, arranged so that lower is better; for that reason it is usually called a loss. Squared error is the standard choice when the target is a number, and error rate is the natural measure when the target is a category — but error rate has no usable gradient, so a smooth stand-in is optimised in its place and the error rate is reported. Because the loss depends on which data it is computed over, the training loss and the loss on unseen data are two different numbers, and the gap between them is what overfitting means."
        breaks="The expensive failure is not a model that trains badly — it is a model that trains perfectly to a badly chosen objective. Accuracy treats a missed tumour and a false alarm as equally bad, so a model optimising it will happily trade one for the other. Squared error assumes every unit of error is worth the square of its size, so a handful of mislabelled targets can dominate the whole fit. Neither is a bug; both are the machine doing exactly what it was told."
      >
        <MathBlock
          intro="Two losses, one convention, and the statistical fact that explains what each of them actually predicts."
          formulas={[
            {
              formula: 'L(w) = Σᵢ (ŷᵢ − tᵢ)²',
              reading: 'Squared error. The standard regression loss, and a bowl in w.',
            },
            {
              formula: 'error rate = (1/m) Σᵢ [ŷᵢ ≠ tᵢ]',
              reading:
                'The fraction wrong. The square brackets are 1 when the condition holds and 0 otherwise — so this counts mistakes.',
            },
            {
              formula: 'lower is better, by convention',
              reading: 'Which makes every training problem a minimisation.',
            },
            {
              formula: 'squared error is minimised by the mean',
              reading:
                'So a squared-error model chases the average of the targets, and extreme labels pull every prediction with them.',
            },
            {
              formula: 'absolute error is minimised by the median',
              reading:
                'Which is why swapping the loss changes what the model predicts, not just how fast it gets there.',
            },
            {
              formula: 'd(error rate)/dw = 0 almost everywhere',
              reading: 'Flat, then a jump. No slope to follow, so it cannot be the thing gradient descent minimises.',
            },
          ]}
          legend={[
            {
              sym: 'L(w)',
              name: 'The loss',
              note: 'A function of the parameters, given the data.',
              val: 'the read-out',
            },
            { sym: 'ŷᵢ', name: 'Prediction', note: 'Say “y-hat”. What the model said.', val: 'the draggable marker' },
            { sym: 'tᵢ', name: 'Target', note: 'What the data says is right.', val: 'the faint dot' },
            { sym: 'm', name: 'Examples', note: 'How many rows the loss is summed over.', val: '5 in the lab' },
            { sym: '[·]', name: 'Indicator', note: '1 when the condition holds, 0 otherwise.', val: 'counts mistakes' },
            {
              sym: 'threshold',
              name: 'The cut-off',
              note: 'A hyperparameter, not a parameter. Training never sets it.',
              val: 'a slider on the lab',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'nn.MSELoss and nn.CrossEntropyLoss are these two lines',
            how: 'One for a numerical target, one for a categorical one. CrossEntropyLoss expects raw scores and applies the softmax itself, which is why adding your own sigmoid before it flattens the gradients.',
          },
          {
            what: 'Optimise one number, report another',
            how: 'Cross-entropy goes into loss.backward(); accuracy, precision and recall go into the report. Confusing the two is how people end up trying to differentiate a step function.',
          },
          {
            what: 'Class weighting is changing the objective, not the model',
            how: 'CrossEntropyLoss(weight=…) makes one kind of mistake cost more. If a missed tumour matters more than a false alarm, this is where you say so — no amount of training will infer it.',
          },
          {
            what: 'Squared error predicts the mean of the targets',
            how: 'Which is exactly why it is sensitive to outliers, and why an absolute-error loss — predicting the median — is the standard alternative on data with a heavy tail.',
          },
          {
            what: 'Training loss and held-back loss are different numbers',
            how: 'Every honest benchmark quotes the second. Watching them separate is what early stopping watches for, and it is the definition of overfitting.',
          },
          {
            what: 'The threshold is yours, and it moves after training',
            how: 'Sliding it changes precision and recall without touching a single weight. Reporting accuracy at 0.5 as though it were a property of the model is a common way to mislead yourself.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl1/objective', label: 'Session 1, part 10 — objective functions' },
          { href: '/session/dl1/generalise', label: 'Session 1, part 11 — training loss is not the point' },
          { href: '/session/dl1/optimiser', label: 'Session 1, part 12 — the algorithm that minimises it' },
        ]}
      />

      <Connections topic="lossfn" />
    </div>
  )
}
