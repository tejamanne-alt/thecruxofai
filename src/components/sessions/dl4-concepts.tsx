'use client'

/**
 * Four concepts out of Session 4 — logistic regression, softmax, cross-entropy
 * and the three flavours of gradient descent. Each reuses the chapter's own
 * labs and links back to the parts it was drawn from, because a concept is a
 * different cut through the same material rather than a second copy of it.
 */
import { BceLab, BoundaryLab, LogisticNeuronLab, SigmoidLab, WhyCeLab } from '@/components/charts/dl4-lab'
import { CatCeLab, InferenceLab, MiniBatchLab, SoftmaxLab, StabilityLab } from '@/components/charts/dl4-multi-lab'
import { GradLab, SgdAlgoLab, SgdVsBatchLab } from '@/components/charts/dl4-train-lab'
import Link from 'next/link'
import { UsedInAiml } from './algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from './session-parts'

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

export function LogisticConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Logistic regression: a straight line that answers yes or no"
        intro="It has regression in the name and it is a classifier. One neuron computes a weighted sum, a sigmoid turns that into a probability, and a threshold turns the probability into an answer. The line stays straight the whole way through — which is the thing worth understanding about it."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A doctor reads a set of test results and forms an impression: strongly suggests illness, mildly suggests it,
            suggests the opposite. That impression is a single number on a sliding scale, and it comes from adding up
            the evidence with different amounts of weight on each piece.
          </>,
          <>
            Turning the impression into a decision is a second, separate step, and the two should not be confused. The
            evidence produces a score; the score becomes a probability; the probability becomes a yes or a no only when
            somebody chooses where to cut it. Moving that cut point changes the answers without changing what the model
            believes at all.
          </>,
        ]}
        mappings={[
          {
            title: 'z = wᵀx',
            body: 'The weighted evidence. Called the logit, and the only part that is linear. This is the same dot product as a neuron and the same weighted sum as linear regression.',
          },
          {
            title: 'ŷ = σ(z)',
            body: 'The sigmoid. Squashes the score into (0, 1), monotonically, so the ordering of examples is never changed — only their scale.',
          },
          {
            title: 'wᵀx = 0',
            body: 'The decision boundary. A hyperplane: a line with two features, a plane with three. Scaling w moves it nowhere and sharpens the probabilities.',
          },
        ]}
        footnote="Drawn from Deep Neural Networks Session 4, parts 3, 5, 6 and 10, and from the maths course’s dot product and plane pages. Nothing here is beyond the deck except where it is marked."
      />

      <H2>The score comes first, and it is a dot product</H2>
      <P>
        Everything starts with z = wᵀx: multiply each feature by its weight and add the results. That is the dot product
        of the maths course, the weighted sum of a neuron, and the whole model of linear regression, depending on which
        page you met it on. Nothing about it is specific to classification.
      </P>
      <P>
        Because the leading input is always 1, the bias w₀ is an ordinary weight with an ordinary input. Everything the
        model can do lives in that one number z — a single value that stands for “how much the evidence favours class
        1”.
      </P>

      <Lab>
        <LogisticNeuronLab />
      </Lab>

      <H2>The sigmoid makes it a probability</H2>
      <P>
        A score can be any real number, and a probability cannot. σ(z) = 1/(1 + e⁻ᶻ) fixes that: e⁻ᶻ is always positive,
        so the denominator always exceeds 1, so the result always lands strictly between 0 and 1 — never quite at either
        end, which is what keeps the logarithm in the loss finite.
      </P>
      <P>
        The function is increasing, so a larger score always means a larger probability. That means the sigmoid never
        reorders examples: it only decides how confident the model sounds about an ordering it had already fixed.
      </P>

      <Lab>
        <SigmoidLab />
      </Lab>

      <H2>And the boundary is straight</H2>
      <P>
        Because σ crosses 0.5 exactly at z = 0, the test “is the probability at least a half?” is the test “is the score
        at least zero?”. So the set of inputs where the model changes its mind is where wᵀx = 0 — a flat surface, one
        dimension below the feature space.
      </P>
      <P>
        This is the limit of the model, and it is worth being blunt about. However curved the probability shading looks,
        the decisions come from a straight cut. Two classes arranged in rings, or in an XOR pattern, cannot be separated
        by one, which is exactly the perceptron’s limitation from session 2 — and the reason hidden layers exist.
      </P>

      <Lab>
        <BoundaryLab />
      </Lab>

      <H2>Trained by gradient descent, on a loss that fits</H2>
      <P>
        The loss is cross-entropy, not squared error, and the gradient of the loss with respect to the weights comes out
        as (ŷ − y)x — the error times the input. That is the same formula as linear regression’s gradient, which is why
        the same training loop works for both with only the prediction changed.
      </P>

      <Lab>
        <GradLab />
      </Lab>

      <Explainers
        plain="Logistic regression is a linear model for binary classification. It computes a weighted sum of the features, z = wᵀx, then applies the sigmoid to get ŷ = σ(z), which is read as the probability of class 1. An example is predicted positive when ŷ ≥ 0.5, which is the same as z ≥ 0, so the decision boundary is the hyperplane wᵀx = 0. The parameters are found by minimising the binary cross-entropy loss with gradient descent, and the gradient for one example is (ŷ − y)x. The model is a single neuron with a sigmoid activation — the same object the deep learning course builds every network out of."
        breaks="The boundary is straight, so any pattern that is not linearly separable is out of reach — the same limitation as the perceptron, and the reason hidden layers were invented. On perfectly separable data the loss has no minimum at all: the weights can always be made larger to reduce it further, so training diverges unless regularisation is added, which is why every library applies some by default. And the model is only as calibrated as its training: a probability of 0.9 means the model has seen features like these and been right about nine times in ten, which stops being true the moment the input distribution shifts."
      >
        <MathBlock
          intro="Four lines. The first two are the model, the third is the decision, the fourth is the training."
          formulas={[
            {
              formula: 'z = wᵀx = w₀ + w₁x₁ + ⋯ + w_d x_d',
              reading: 'The logit. A dot product, and the only linear part.',
            },
            {
              formula: 'ŷ = σ(z) = 1/(1 + e⁻ᶻ) = P(y = 1 | x)',
              reading: 'The sigmoid. Bounded, increasing, and read as a probability.',
            },
            {
              formula: 'predict 1 ⟺ ŷ ≥ 0.5 ⟺ wᵀx ≥ 0',
              reading: 'The two forms of the same test. The boundary is the hyperplane wᵀx = 0.',
            },
            {
              formula: '∇ℓ = (ŷ − y)x ,  w ← w − η∇ℓ',
              reading: 'The gradient and the step. Identical in form to linear regression’s.',
            },
          ]}
          legend={[
            { sym: 'w', name: 'Weights', note: 'd + 1 of them, bias first.', val: 'one per feature' },
            { sym: 'z', name: 'The logit', note: 'Say “low-jit”. The score before the squash.', val: '(−∞, ∞)' },
            { sym: 'σ', name: 'Sigmoid', note: 'The squash. σ(0) = 0.5.', val: '(0, 1)' },
            { sym: 'ŷ', name: 'Probability', note: 'Say “y-hat”. P(y = 1 | x).', val: '[0, 1]' },
            { sym: 'η', name: 'Learning rate', note: 'Say “eta”. How far each step goes.', val: 'you choose' },
            { sym: 'ℓ', name: 'Loss', note: 'Cross-entropy for one example.', val: '≥ 0' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'It is the output layer of every binary classifier',
            how: 'A deep network for a yes/no task ends in exactly this unit. Everything before it is a learned way of producing x — which is why transfer learning keeps the body and replaces the head.',
          },
          {
            what: 'The baseline you have to beat',
            how: 'Before any network, fit LogisticRegression. It trains in seconds, gives calibrated probabilities, and a deep model that cannot beat it is not being held back by capacity.',
          },
          {
            what: 'Interpretable in a way most models are not',
            how: 'A weight is the change in log-odds per unit of its feature, so e^{wⱼ} is an odds ratio. That is why it remains standard in medicine and credit scoring, where the reason for a decision has to be defensible.',
          },
          {
            what: 'The threshold is a separate decision',
            how: 'predict() applies 0.5; predict_proba() hands you the number. Choosing where to cut is a cost question — how much a miss costs against a false alarm — and it needs no retraining.',
          },
          {
            what: 'Regularisation is not optional here',
            how: 'On separable data the unregularised loss has no minimum and the weights grow without bound. scikit-learn applies L2 by default with C controlling its strength, and turning it off on clean data is how training diverges.',
          },
          {
            what: 'Where the straight boundary stops being enough',
            how: 'XOR, rings, anything with interactions. The classical fix is to add crafted features — products, squares — and the deep learning fix is a hidden layer that learns them, which is module 5.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl4/sigmoid', label: 'Session 4, part 3 — the sigmoid' },
          { href: '/session/dl4/neuron', label: 'part 5 — logistic regression as one neuron' },
          { href: '/session/dl4/decision', label: 'part 6 — the decision rule and the boundary' },
          { href: '/session/dl4/grad', label: 'part 10 — the gradient (ŷ − y)x' },
          { href: '/session/dl4/example', label: 'part 12 — the worked example' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function SoftmaxConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Softmax: K scores in, one probability distribution out"
        intro="A model with K classes produces K unrelated numbers. Softmax turns them into K probabilities that are positive, add up to 1, keep the same ordering, and ignore anything added to all of them at once. That last property looks like a curiosity and is what stops the whole thing overflowing."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Three judges each give a competitor a score, and the scores are on no particular scale — they might be −4, 2
            and 7. To turn them into “how likely is each to win”, you need every number to be positive, and you need
            them to add to a whole. Exponentiating does the first; dividing by the total does the second.
          </>,
          <>
            The exponential is not a neutral choice. It amplifies: a score one point higher becomes e times as likely,
            not one unit more likely. That is why softmax leans hard towards the leader without ever quite committing —
            it is a soft version of “pick the largest”, which is where the name comes from.
          </>,
        ]}
        mappings={[
          {
            title: 'e^{zₖ}',
            body: 'Make it positive. Any real score becomes a positive number, so what follows can be a probability.',
          },
          {
            title: 'Σⱼ e^{zⱼ}',
            body: 'The normaliser. Divide by it and the K outputs necessarily add to 1 — the denominator is the sum of the numerators.',
          },
          {
            title: 'softmax(z + c) = softmax(z)',
            body: 'A constant added to every score changes nothing. Subtract the largest and no exponential can overflow, exactly.',
          },
        ]}
        footnote="Drawn from Deep Neural Networks Session 4, parts 19, 24 and 26. The K = 2 collapse to the sigmoid is worked through below and can be checked in two lines of algebra."
      />

      <H2>Two steps, and both are forced</H2>
      <P>
        Softmax is exponentiate-then-normalise. The first step exists because logits can be negative and probabilities
        cannot; the second exists because probabilities have to add to 1. Neither step is a design flourish — remove
        either and the output stops being a distribution.
      </P>
      <P>
        The result is strictly between 0 and 1 and never exactly at either end, because e^z is never zero and never
        infinite. That matters for training: the loss takes a logarithm of it, and log(0) would be −∞.
      </P>

      <Lab>
        <SoftmaxLab />
      </Lab>

      <H2>It preserves order, so the answer never depends on it</H2>
      <P>
        e^z is an increasing function, so the largest logit produces the largest probability, always. If all you want is
        the predicted class, you can take the arg max of the logits and skip the softmax entirely — the answer is
        identical. You need it for the confidence score, and for training.
      </P>

      <Lab>
        <InferenceLab />
      </Lab>

      <H2>The shift that costs nothing and buys everything</H2>
      <P>
        Add the same constant c to every logit and every numerator is multiplied by e^c — but so is the denominator, so
        the ratio is unchanged. This is exact, not approximate. Choosing c to be the largest logit makes the biggest
        exponent e⁰ = 1 and everything else smaller, so the sum sits between 1 and K and cannot overflow whatever the
        logits were.
      </P>
      <P>
        Without it, a logit of 800 makes e^z overflow to Infinity, and Infinity divided by Infinity is NaN. The logits
        themselves were perfectly ordinary numbers.
      </P>

      <Lab>
        <StabilityLab />
      </Lab>

      <Explainers
        plain="Softmax maps a vector of K real numbers to a probability distribution: softmax(z)ₖ = e^{zₖ} / Σⱼ e^{zⱼ}. The outputs are strictly between 0 and 1 and sum to exactly 1. It is monotonic in each logit, so arg max is preserved, and it is translation invariant — adding the same constant to every logit leaves the output unchanged. It is differentiable, which is what allows gradient-based training, and with K = 2 it reduces to the sigmoid applied to the difference of the two logits. In a classifier it always sits on the last layer, converting K unrelated scores into an answer that can be read as P(y = k | x)."
        breaks="The naive implementation overflows: e^800 is Infinity and Infinity ÷ Infinity is NaN, which is why the maximum logit is subtracted first. The outputs are coupled by the shared denominator, so softmax structurally cannot express a multi-label answer — pushing one probability up necessarily pushes the others down, and a photo containing both a dog and a cat is unrepresentable rather than merely hard. And the probabilities are usually overconfident: because the loss rewards certainty on the training set, a well-fitted network reports 99% and is right about 90% of the time, which temperature scaling corrects by dividing every logit by a constant chosen on validation data."
      >
        <MathBlock
          intro="One definition and four properties, all of them used somewhere in practice."
          formulas={[
            { formula: 'softmax(z)ₖ = e^{zₖ} / Σⱼ e^{zⱼ}', reading: 'Exponentiate, then divide by the total.' },
            {
              formula: 'Σₖ softmax(z)ₖ = 1 ,  softmax(z)ₖ ∈ (0, 1)',
              reading: 'A genuine distribution. Never exactly 0 or 1.',
            },
            {
              formula: 'zᵢ > zⱼ ⟹ ŷᵢ > ŷⱼ',
              reading: 'Order preserved, so arg max of the logits is arg max of the probabilities.',
            },
            {
              formula: 'softmax(z + c·1) = softmax(z)',
              reading: 'Translation invariant. Take c = maxₖ zₖ and nothing can overflow.',
            },
            {
              formula: 'K = 2:  softmax(z)₁ = σ(z₁ − z₂)',
              reading: 'It collapses to the sigmoid of the difference — two scores were one degree of freedom.',
            },
          ]}
          legend={[
            { sym: 'z', name: 'The logits', note: 'K raw scores, one per class. Unbounded.', val: 'ℝᴷ' },
            { sym: 'K', name: 'How many classes', note: 'Fixed before training and unchanged during it.', val: '≥ 2' },
            { sym: 'Σⱼ e^{zⱼ}', name: 'The normaliser', note: 'Also called the partition function.', val: '> 0' },
            { sym: 'c', name: 'The shift', note: 'Taken as the largest logit, for stability.', val: 'maxₖ zₖ' },
            { sym: 'ŷ', name: 'The output', note: 'K probabilities that add to 1.', val: 'sums to 1' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The last layer of every multi-class classifier',
            how: 'MNIST with 10 classes, ImageNet with 1 000, a language model choosing among 50 000 tokens — all end in a softmax over the vocabulary of possible answers.',
          },
          {
            what: 'Never apply it before CrossEntropyLoss',
            how: 'The loss applies log_softmax itself. Doing both flattens the distribution and shrinks the gradients: the model still trains, just slowly, and nothing errors.',
          },
          {
            what: 'Temperature changes confidence without changing answers',
            how: 'Dividing every logit by T > 1 flattens the distribution and by T < 1 sharpens it. Because order is preserved it cannot change a prediction — which is what makes it safe for calibration and useful for sampling.',
          },
          {
            what: 'Attention is a softmax',
            how: 'A transformer scores every position against every other and softmaxes the scores into weights that sum to 1. The mechanism the whole architecture is named for is this function applied to similarity scores.',
          },
          {
            what: 'It is the wrong choice for multi-label',
            how: 'The sum-to-1 constraint is a modelling assumption, not a technicality. When labels are not mutually exclusive you want K independent sigmoids, and softmax cannot represent the right answer at all.',
          },
          {
            what: 'The denominator is the expensive part at scale',
            how: 'With a 50 000-token vocabulary, every step normalises over 50 000 exponentials. Hierarchical softmax and sampled softmax exist entirely to avoid that sum.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl4/softmax', label: 'Session 4, part 19 — the softmax function' },
          { href: '/session/dl4/weights', label: 'part 18 — the K logits it acts on' },
          { href: '/session/dl4/inference', label: 'part 24 — inference and confidence' },
          { href: '/session/dl4/tips', label: 'part 26 — the stable version' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function CrossEntropyConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Cross-entropy: the loss that only reads the right answer"
        intro="Squared error asks how far the prediction is from the truth. Cross-entropy asks something narrower and more useful: what probability did you give the thing that actually happened? Everything else about the prediction is ignored, and the cost of getting it wrong has no ceiling."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A forecaster says there is a 5% chance of rain, and it rains. The cost of that forecast should not be “you
            were 0.95 out”. It should be that you assigned very little probability to what happened — and the more
            confidently you ruled it out, the worse that is. A forecaster who says 5% and is wrong once a fortnight is
            not slightly miscalibrated, they are badly wrong.
          </>,
          <>
            That is exactly what −log ŷ measures. Say 1.0 and be right: cost zero. Say 0.5: cost 0.69. Say 0.05: cost
            3.0. Say 0.001: cost 6.9. There is no worst case, because there is no limit to how confidently you can rule
            out the truth.
          </>,
        ]}
        mappings={[
          {
            title: '−log ŷ',
            body: 'The cost of the probability you gave the true class. Zero when you were certain and right; unbounded as you approach certainty and wrong.',
          },
          {
            title: 'y log ŷ + (1 − y) log(1 − ŷ)',
            body: 'The binary form. One of the two terms is always multiplied by zero, so it is one formula with two branches.',
          },
          {
            title: '∇ℓ = (ŷ − y)x',
            body: 'The gradient. The log’s derivative cancels the activation’s, leaving the error times the input.',
          },
        ]}
        footnote="Drawn from Deep Neural Networks Session 4, parts 7, 8 and 20. The maximum-likelihood derivation and the information-theory reading are marked as beyond the deck where they appear."
      />

      <H2>One formula, two branches</H2>
      <P>
        For binary classification the loss is −[y log ŷ + (1 − y) log(1 − ŷ)]. Since y is 0 or 1, one of those two terms
        is always multiplied by zero and vanishes. Writing both, with the (1 − y) switch, is what lets a single line of
        code handle both labels — and what makes the derivative come out the same either way.
      </P>

      <Lab>
        <BceLab />
      </Lab>

      <H2>For K classes it is the same thing, indexed</H2>
      <P>
        With K classes the loss is −Σₖ yₖ log ŷₖ, and because y is one-hot, K − 1 of those terms are multiplied by zero
        too. What survives is a single −log of the probability given to the true class. Set K = 2 and put y = [1 − y, y]
        into it, and the binary formula falls straight back out — they are the same loss.
      </P>

      <Lab>
        <CatCeLab />
      </Lab>

      <H2>Why not squared error</H2>
      <P>
        Squared error can never charge more than 0.5 for a mistake on a 0/1 label, however certain the model was. So a
        handful of confident errors barely move it, and — worse — the gradient it produces at those errors is nearly
        zero, because the sigmoid has saturated there. The model is most wrong exactly where it learns slowest.
      </P>
      <P>
        Cross-entropy has the opposite behaviour. The logarithm blows up at precisely the rate the sigmoid’s derivative
        shrinks, the two cancel, and what is left is (ŷ − y)x: a large correction exactly when a large correction is
        needed.
      </P>

      <Lab>
        <WhyCeLab />
      </Lab>

      <Explainers
        plain="Cross-entropy measures how far the model’s predicted distribution is from the true one. For binary classification it is −[y log ŷ + (1 − y) log(1 − ŷ)]; for K classes it is −Σₖ yₖ log ŷₖ, and one-hot labels collapse that to −log of the probability on the true class. It comes from maximum likelihood: minimising it is maximising the probability of the data actually observed. It is convex for a linear model, so there is one global minimum, and paired with the sigmoid or softmax its gradient simplifies to ŷ − y. An untrained model gives every class 1/K, so the loss starts at log K — 0.693 for two classes."
        breaks="It reads only the true class, so it says nothing about how the remaining probability is spread among the wrong ones — two models with the same loss can be differently wrong. It is unbounded, which is the point but also means one mislabelled example given a confident wrong prediction can dominate a whole batch's gradient. And the naive implementation breaks: log(0) is −∞, which is why the loss is always computed from logits with log-sum-exp rather than from probabilities. Paired with the wrong activation — a sigmoid output fed to MSE, or a softmax output fed to a loss that applies its own — the cancellation is lost and training slows for no visible reason."
      >
        <MathBlock
          intro="Two forms of one loss, its origin, and the gradient that makes it the natural partner of the sigmoid."
          formulas={[
            {
              formula: 'ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)]',
              reading: 'Binary. One branch is always live, the other always zero.',
            },
            {
              formula: 'ℓ = −Σₖ yₖ log ŷₖ = −log ŷ_true',
              reading: 'Categorical. One-hot y makes the sum a single term.',
            },
            {
              formula: 'J = (1/N) Σᵢ ℓᵢ ,  J starts at log K',
              reading: 'The average. log 2 ≈ 0.693 for binary, log K in general.',
            },
            {
              formula: 'ℓ = −log L, with L = Πᵢ ŷᵢ^{yᵢ}(1 − ŷᵢ)^{1−yᵢ}',
              reading: 'Where it comes from: the negative log-likelihood.',
            },
            { formula: '∇ℓ = (ŷ − y)x', reading: 'The gradient, once the activation’s derivative cancels the log’s.' },
          ]}
          legend={[
            { sym: 'ŷ', name: 'Predicted', note: 'Say “y-hat”. The probability the model gave.', val: '(0, 1)' },
            { sym: 'y', name: 'True label', note: '0 or 1, or a one-hot vector.', val: '{0, 1}' },
            { sym: 'log', name: 'Natural log', note: 'Base e throughout. log 1 = 0.', val: 'base e' },
            { sym: 'L', name: 'Likelihood', note: 'The probability of the observed data.', val: '(0, 1]' },
            { sym: 'K', name: 'Classes', note: 'log K is the loss before training.', val: '≥ 2' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The default loss for every classifier',
            how: 'CrossEntropyLoss for K classes, BCEWithLogitsLoss for binary and multi-label. Reaching for MSE on a classification task is a genuine bug, not a stylistic choice.',
          },
          {
            what: 'log K is a free sanity check',
            how: 'A fresh model must start near log K: 0.693 for binary, 2.30 for MNIST, 6.91 for ImageNet. Anywhere else and the labels or the output layer are wrong, and you know in ten seconds instead of an hour.',
          },
          {
            what: 'It is what language models minimise',
            how: 'Next-token prediction is classification over the vocabulary, trained with exactly this loss. Perplexity, the number quoted in every paper, is e raised to it.',
          },
          {
            what: 'Label smoothing softens the target',
            how: 'Replacing a one-hot 1 with 0.9 and spreading 0.1 across the rest stops the model chasing infinite confidence. It is a standard regulariser in image classification, and it only makes sense because the loss reads the true class alone.',
          },
          {
            what: 'It is the KL divergence in disguise',
            how: 'Cross-entropy equals the entropy of the true distribution plus the KL divergence from it to the model’s. The first term is fixed by the data, so minimising one minimises the other — which is why the same loss trains variational models and distillation.',
          },
          {
            what: 'Class weights go straight into it',
            how: 'On imbalanced data the rare class contributes almost none of the gradient. Weighting its term up — pos_weight, or the weight argument — is the loss-level answer, and it is separate from the metric-level answer of reporting recall.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl4/bce', label: 'Session 4, part 7 — binary cross-entropy' },
          { href: '/session/dl4/whyce', label: 'part 8 — why not squared error' },
          { href: '/session/dl4/grad', label: 'part 10 — the gradient it produces' },
          { href: '/session/dl4/catce', label: 'part 20 — the categorical form' },
        ]}
      />
    </div>
  )
}

/* ========================================================================== */

export function SgdVariantsConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Batch, stochastic and mini-batch: one update rule, three amounts of data"
        intro="The step w ← w − η∇J never changes. What changes is how many examples went into ∇J — all of them, one of them, or a few dozen. That single choice decides how fast training runs, how much memory it needs, how noisy the path is, and whether it can run on a dataset larger than your machine."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You are walking down a hill in fog and can only feel the slope where you stand. One option is to survey the
            whole hillside before every step: accurate, and you take very few steps. Another is to feel the ground under
            one foot and move immediately: fast, and you stagger. The third is to test a small patch — enough to know
            roughly which way is down, and cheap enough to do constantly.
          </>,
          <>
            The staggering is not purely a cost. On a hillside with dips in it, a walker who wobbles is less likely to
            settle in the first small hollow they meet. That is the argument for keeping some noise rather than
            eliminating it, and it is why the middle option won rather than the first.
          </>,
        ]}
        mappings={[
          {
            title: 'w ← w − η∇J',
            body: 'The step, identical in all three. Only the ∇J differs, and only in how many examples it averages over.',
          },
          {
            title: '⌈N/B⌉',
            body: 'Updates per epoch. B = N gives one, B = 1 gives N, and B = 128 on 60 000 examples gives 469.',
          },
          {
            title: '1/√B',
            body: 'How the gradient noise falls with batch size. Four times the work halves the noise — which is why batch sizes stop growing.',
          },
        ]}
        footnote="Drawn from Deep Neural Networks Session 4, parts 9, 11, 21 and 22, and from session 3’s batch gradient descent. The 1/√B rule is standard statistics and is marked as beyond the deck on the chapter pages."
      />

      <H2>Batch: exact, and unaffordable</H2>
      <P>
        Batch gradient descent averages the gradient over all N examples before moving a single weight. The direction is
        exact and the path is smooth, and it is completely reproducible. It is also one step per pass over the data,
        which on a million rows means a million gradient evaluations bought you one update.
      </P>
      <P>
        The memory requirement is the harder problem. If the dataset does not fit in memory, a method that needs all of
        it before taking a step is not slow, it is impossible.
      </P>

      <H2>Stochastic: one example, and a stagger</H2>
      <P>
        SGD uses one randomly chosen example per update. Its gradient is not the true gradient, it is an{' '}
        <strong>unbiased estimate</strong> — right on average, wrong on any given occasion. The bet is that N cheap
        approximate steps beat one expensive exact one, and for large datasets it is a good bet.
      </P>

      <Lab>
        <SgdVsBatchLab />
      </Lab>

      <P>
        Two details decide whether it works. The examples must be reshuffled every epoch, or any order in the data gets
        applied as a rhythm and the weights can cycle instead of settling. And η matters much more than it does for
        batch: with a noisy gradient, a step that is slightly too large compounds.
      </P>

      <Lab>
        <SgdAlgoLab />
      </Lab>

      <H2>Mini-batch: the one everything uses</H2>
      <P>
        A mini-batch of B examples averages B noisy gradients, which is much less noisy than one and much cheaper than
        N. That is the statistical argument. The computational argument is stronger still: B examples is one matrix
        multiplication, which is exactly what a GPU is built to do, so a batch of 128 is nowhere near 128 times the cost
        of a single example.
      </P>

      <Lab>
        <MiniBatchLab />
      </Lab>

      <P>
        The vocabulary is worth keeping straight, because it is examined. An <strong>iteration</strong> is one weight
        update. An <strong>epoch</strong> is one pass over the data, and takes ⌈N/B⌉ iterations. The number of examples
        seen after T epochs is N × T whatever B is; only the number of updates depends on B.
      </P>

      <Explainers
        plain="All three methods apply w ← w − η∇J and differ only in the gradient. Batch gradient descent averages over all N examples: exact, smooth, one update per epoch, and it needs the whole dataset in memory. Stochastic gradient descent uses one random example: an unbiased but noisy estimate, N updates per epoch, minimal memory, and it supports online learning as new data arrives. Mini-batch SGD uses B examples with 1 < B ≪ N, typically 32 to 512: a good gradient estimate, ⌈N/B⌉ updates per epoch, and it maps onto a single matrix multiplication, which is why it is the standard everywhere. The 1/B in the mini-batch gradient is what keeps the learning rate meaning the same thing as B changes."
        breaks="The batch size and the learning rate are coupled, so tuning one without the other misleads: a larger batch gives a less noisy gradient and tolerates a larger η, and doubling B while leaving η fixed often makes training worse. Dropping the 1/B multiplies every gradient by B, which silently multiplies the effective learning rate by B. Larger batches also give diminishing returns — noise falls as 1/√B, so four times the computation halves it — and are widely reported to generalise slightly worse, since the noise that was helping is gone. And SGD never truly settles: near the minimum it oscillates rather than converging, which is what learning-rate decay exists to fix."
      >
        <MathBlock
          intro="One update rule and three gradients, plus the two numbers that describe a run."
          formulas={[
            { formula: 'w ← w − η∇J', reading: 'The step. Identical in all three variants.' },
            { formula: 'batch:  ∇J = (1/N) Σᵢ₌₁ᴺ ∇ℓᵢ', reading: 'Exact, one update per epoch, all N in memory.' },
            { formula: 'SGD:  ∇J = ∇ℓᵢ for one random i', reading: 'Unbiased but noisy. N updates per epoch.' },
            { formula: 'mini-batch:  ∇J_B = (1/B) Σᵢ∈B ∇ℓᵢ', reading: 'The compromise. ⌈N/B⌉ updates per epoch.' },
            {
              formula: 'iterations per epoch = ⌈N/B⌉',
              reading: '469 for N = 60 000 and B = 128. The last batch is short.',
            },
            {
              formula: 'gradient noise ∝ 1/√B',
              reading: 'Four times the batch halves the noise. Why B stops growing.',
            },
          ]}
          legend={[
            { sym: 'N', name: 'Dataset size', note: 'How many training examples there are.', val: 'fixed' },
            { sym: 'B', name: 'Batch size', note: '1 for SGD, N for batch, 32–512 in practice.', val: 'you choose' },
            {
              sym: 'η',
              name: 'Learning rate',
              note: 'Say “eta”. Moves with B, not independent of it.',
              val: 'you choose',
            },
            {
              sym: '∇J',
              name: 'The gradient',
              note: 'One number per parameter, however it was estimated.',
              val: 'shape of w',
            },
            { sym: '⌈·⌉', name: 'Ceiling', note: 'Round up. The short final batch still counts.', val: '469' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Mini-batch is what “SGD” now means',
            how: 'torch.optim.SGD applies whatever gradient it is handed, which in practice comes from a batch. The one-example-at-a-time algorithm is taught so the compromise has something to be a compromise between.',
          },
          {
            what: 'It is why datasets larger than memory are unremarkable',
            how: 'DataLoader streams batches from disk, so a training set of terabytes needs only B examples resident at a time. Batch gradient descent on ImageNet is not slow, it is impossible.',
          },
          {
            what: 'shuffle=True is not the default',
            how: 'A dataset stored sorted by class — which is how directories of images are usually organised — feeds the model every example of one class before it sees another. The loss curve looks bizarre and the fix is one keyword argument.',
          },
          {
            what: 'Powers of two are not superstition',
            how: 'GPU memory and tensor cores are organised in powers of two, so a batch of 128 is measurably faster than one of 100 despite being larger. One of the few places a round decimal is the wrong choice.',
          },
          {
            what: 'Everything modern is a modification of this step',
            how: 'Momentum accumulates past gradients, RMSProp scales each parameter by its recent gradient size, and Adam does both. All of them replace ∇J in the same w ← w − η(something) update.',
          },
          {
            what: 'Gradient accumulation fakes a bigger batch',
            how: 'When a batch of 512 will not fit in memory, run four batches of 128 and sum the gradients before stepping. Same update as B = 512, four times the wall-clock, and it is the standard trick for training large models on small hardware.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl4/sgd', label: 'Session 4, part 9 — batch to stochastic' },
          { href: '/session/dl4/sgdalgo', label: 'part 11 — the SGD algorithm' },
          { href: '/session/dl4/minibatch', label: 'part 21 — batch, iteration, epoch' },
          { href: '/session/dl4/mbgrad', label: 'part 22 — the mini-batch gradient' },
          { href: '/session/dl3/batch', label: 'Session 3, part 11 — the batch algorithm' },
        ]}
      />
    </div>
  )
}
