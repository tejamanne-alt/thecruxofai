'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Dl4Overview() {
  const parts = partsOf('dl4')

  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Chapter"
        title="Session 4 — Linear neural networks for classification"
        intro="Module 4, and the same single neuron as session 3 with one box changed on the end. A sigmoid turns a score into a probability, cross-entropy scores the guess, and SGD takes one example at a time. Then the whole thing again for K classes: K neurons, softmax, one-hot labels and mini-batches — with both of the deck's worked examples recomputed on the page rather than copied off the slide."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A doctor looks at a set of test results and has to answer yes or no. What they actually have is a feeling of
            how likely it is, and the yes-or-no comes from putting a line somewhere on that feeling. This session is
            that in two halves: first turn the evidence into a number between 0 and 1, then decide where to cut it.
          </>,
          <>
            None of the machinery is new. It is session 3’s neuron with a squash on the end, session 3’s design matrix
            unchanged, and gradient descent with a different loss — a loss whose gradient turns out to be
            <em> exactly the same formula</em>, (ŷ − y)x. What is new is that the answer is a name, so a new set of
            questions appears: which mistakes matter, and how do you score a model that can be right 98% of the time and
            still be useless.
          </>,
        ]}
        mappings={[
          {
            title: 'ŷ = σ(wᵀx)',
            body: 'One neuron. The weighted sum is unchanged from regression; the sigmoid is what makes the output readable as P(y = 1 | x).',
          },
          {
            title: 'ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)]',
            body: 'Cross-entropy. Unbounded cost for a confident mistake, and the derivative that cancels the sigmoid’s instead of being throttled by it.',
          },
          {
            title: '∇J = (1/B)Xᵀ(Ŷ − Y)',
            body: 'The mini-batch gradient for K classes. Same shape as W, and the multi-class form of (ŷ − y)x.',
          },
        ]}
        footnote="Both worked examples are computed here from the deck's own X, y, W and η rather than copied. The binary one reproduces slides 33 to 35 exactly — w = (0.116, 0.847) and the four predictions 0.724, 0.859, 0.934, 0.971. The multi-class one does not agree with three printed numbers on slides 75 to 77, and part 23 sets out which three, what they should be, and how to check each in a line of arithmetic. Slide 35's tick about examples 1 and 2 is contradicted by the slide's own figures, and part 12 says so."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, a note on what the idea is for in real machine
        learning, and links to the pages in the other courses it is built on.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/dl4/${p.id}`}
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

      <ConnectionMap topic="dl4" />

      <Explainers
        plain="Classification predicts a discrete label rather than a number, and that one change decides the last layer and the loss. For two classes, the model is a single neuron whose activation is the sigmoid σ(z) = 1/(1 + e⁻ᶻ), so its output sits in (0, 1) and can be read as P(y = 1 | x); the decision rule ŷ ≥ 0.5 is the same test as wᵀx ≥ 0, which makes the boundary a hyperplane. The loss is binary cross-entropy, −[y log ŷ + (1 − y) log(1 − ŷ)], derived from maximum likelihood, and its gradient for one example is remarkably (ŷ − y)x — identical in form to the regression gradient, because the sigmoid's derivative cancels against the logarithm's. Training uses stochastic gradient descent: one random example per update instead of all N. Evaluation happens on unseen data through the confusion matrix, from which accuracy, precision, recall and F1 all follow. For K classes, W gains one column per class, softmax turns the K logits into a distribution that sums to 1, labels become one-hot vectors, the loss becomes −Σₖ yₖ log ŷₖ, and mini-batch SGD replaces single-example SGD with the gradient (1/B)Xᵀ(Ŷ − Y)."
        breaks="Three failures dominate. The learning rate is implicated in four of the six symptoms on the debugging checklist: too large gives NaN or oscillation, too small gives a loss that barely moves and a model that predicts one class for everything. Unscaled features drive the logits far from zero, where σ′ is nearly zero, so the weights stop moving even though the answer is wrong — the same saturation that makes the stable softmax necessary, since e^710 overflows to Infinity and Infinity ÷ Infinity is NaN. And accuracy lies on imbalanced data: 98% is what a model scores by answering 'no' to every patient in a population where 2% are ill, which is why precision, recall and F1 exist at all. One structural trap sits underneath all of them — softmax cannot express a multi-label answer, because pushing one probability up necessarily pushes the others down."
      >
        <MathBlock
          intro="Ten lines carry the session. The first four are the binary model and its training; the rest lift it to K classes."
          formulas={[
            {
              formula: 'σ(z) = 1/(1 + e⁻ᶻ) ,  σ′(z) = σ(z)(1 − σ(z))',
              reading: 'The sigmoid and its derivative. Maximum slope 0.25, at z = 0.',
            },
            {
              formula: 'ŷ = σ(wᵀx) = P(y = 1 | x)',
              reading: 'One neuron. z = wᵀx is the logit; ŷ is the probability.',
            },
            {
              formula: 'predict 1 if ŷ ≥ 0.5, equivalently wᵀx ≥ 0',
              reading: 'The decision rule. The boundary wᵀx = 0 is a hyperplane and it is straight.',
            },
            {
              formula: 'ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)] ,  J = (1/N) Σ ℓ',
              reading: 'Binary cross-entropy, per example and averaged. J = log 2 ≈ 0.693 before training starts.',
            },
            {
              formula: '∇ℓ = (ŷ − y)x ,  w ← w − η∇ℓ',
              reading: 'The gradient and the SGD step. The error times the input — the same form as regression.',
            },
            {
              formula: 'z = Wᵀx ,  Z = XW ∈ ℝᴺˣᴷ',
              reading: 'K logits from one column of W per class, and all N examples in one matrix product.',
            },
            {
              formula: 'softmax(z)ₖ = e^{zₖ} / Σⱼ e^{zⱼ}',
              reading: 'K scores to a distribution. Positive, sums to 1, order-preserving, ignores a constant shift.',
            },
            {
              formula: 'J(W) = −(1/N) Σᵢ Σₖ yₖ⁽ⁱ⁾ log ŷₖ⁽ⁱ⁾',
              reading: 'Categorical cross-entropy. One-hot y collapses the inner sum to −log of the true class.',
            },
            {
              formula: '∇J_B = (1/B) X_Bᵀ(Ŷ_B − Y_B) ,  W ← W − η∇J_B',
              reading: 'The mini-batch gradient and update. Its shape must match W: (d + 1) × K.',
            },
            {
              formula: 'Accuracy · P = TP/(TP+FP) · R = TP/(TP+FN) · F1 = 2PR/(P+R)',
              reading: 'Everything read off the confusion matrix. Precision by column, recall by row.',
            },
          ]}
          legend={[
            { sym: 'σ', name: 'Sigmoid', note: 'Say “sigma”. Squashes any score into (0, 1).', val: 'part 3' },
            { sym: 'z', name: 'The logit', note: 'The weighted sum before the squash.', val: 'part 5' },
            { sym: 'ŷ', name: 'Prediction', note: 'Say “y-hat”. A probability, not a class.', val: 'part 5' },
            { sym: 'ℓ', name: 'Loss on one', note: 'Say “ell”. Cross-entropy for one example.', val: 'part 7' },
            { sym: 'J(W)', name: 'Total loss', note: 'The average. Starts at log 2, or log K.', val: 'part 7' },
            {
              sym: 'η',
              name: 'Learning rate',
              note: 'Say “eta”. 0.5 in the binary example, 0.1 in the multi-class one.',
              val: 'part 9',
            },
            { sym: 'K', name: 'How many classes', note: 'K = 2 is binary; K > 2 is multi-class.', val: 'part 16' },
            { sym: 'W', name: 'Weight matrix', note: '(d + 1) × K. One column per class.', val: 'part 18' },
            { sym: 'B', name: 'Batch size', note: 'Examples per update. 32 to 512 in practice.', val: 'part 21' },
            { sym: '⌈N/B⌉', name: 'Iterations/epoch', note: '469 for N = 60 000 and B = 128.', val: 'part 21' },
            {
              sym: 'TP, FP',
              name: 'The counts',
              note: 'True and false positives, off the confusion matrix.',
              val: 'part 14',
            },
            { sym: '𝟙[·]', name: 'Indicator', note: '1 when the condition holds, 0 otherwise.', val: 'part 25' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The task fixes the last two lines of the model',
            how: 'One output with BCEWithLogitsLoss for binary, K outputs with CrossEntropyLoss for multi-class, K outputs with BCEWithLogitsLoss for multi-label. Get it wrong and the model trains happily and answers nonsense.',
          },
          {
            what: 'Softmax cannot express a multi-label answer',
            how: 'The K probabilities are forced to sum to 1, so pushing one up pushes the others down. “Action and comedy” is not merely hard for it, it is unrepresentable — which is why multi-label uses K independent sigmoids.',
          },
          {
            what: 'Never let a probability meet a logarithm',
            how: 'BCEWithLogitsLoss and CrossEntropyLoss take raw logits and apply log-sum-exp internally. Applying softmax first is the commonest PyTorch bug in classification: the model still trains, just badly.',
          },
          {
            what: 'The starting loss is a free bug check',
            how: 'An untrained model gives 1/K to every class, so J starts at log K — 0.693 for binary, 2.30 for MNIST, 6.91 for ImageNet. A run that starts anywhere else has wrong labels or a wrong output layer.',
          },
          {
            what: 'ŷ − y is where backpropagation starts',
            how: 'For both sigmoid-with-BCE and softmax-with-categorical-CE the derivatives cancel to leave the error itself. Module 5 pushes that number backwards through hidden layers and changes nothing else.',
          },
          {
            what: 'The threshold is not part of the model',
            how: 'predict() applies 0.5; predict_proba() gives you the number. Moving the cut point is not retraining — it walks the precision-recall curve, and the right place on it is a cost decision, not a machine learning one.',
          },
          {
            what: 'Accuracy is the metric that lies',
            how: 'On a 98/2 split, always answering “no” scores 98% and finds nobody. Print the confusion matrix and the per-class recall; report macro rather than weighted averages when the rare class is the point.',
          },
          {
            what: 'The batch size and the learning rate move together',
            how: 'A larger batch gives a less noisy gradient, so a larger η becomes safe. Doubling B and leaving η alone often makes training worse — and dropping the 1/B multiplies the effective learning rate by B.',
          },
        ]}
      />
    </div>
  )
}
