'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Dl3Overview() {
  const parts = partsOf('dl3')

  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Chapter"
        title="Session 3 — Linear neural networks for regression"
        intro="Module 3, and the first session where a model is trained rather than solved by hand. One neuron, no bend at all, and a target that is a number instead of a side. Build the design matrix, write the squared-error loss, take its gradient, and follow the deck's own worked example from a loss of 7.5 down to 1.51 in a single iteration."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            You are trying to guess the price of a house from its size, and all you are allowed is a straight line. Draw
            one, measure how far above or below it each real house sits, square those distances, and add them up. That
            single number is how wrong the line is — and the whole session is about walking the line downhill until the
            number stops falling.
          </>,
          <>
            Nothing here is new machinery. It is session 2’s neuron with the threshold taken off, session 1’s four
            components filled in, and the gradient descent from the maths course applied to a loss you can differentiate
            in three lines. What is new is that all of it runs — and the same loop, unchanged, is what module 3 will use
            on a network with twenty layers.
          </>,
        ]}
        mappings={[
          {
            title: 'ŷ = Xw',
            body: 'Every prediction in one matrix multiply, once a column of ones is glued onto the data and the bias becomes an ordinary weight.',
          },
          {
            title: 'J(w) = (1/2N)‖Xw − y‖²',
            body: 'The squared length of the error vector. Convex, so it has exactly one bottom — a promise that does not survive a hidden layer.',
          },
          {
            title: 'w ← w − η∇J',
            body: 'The step. ∇J = (1/N)Xᵀ(Xw − y), which is each example’s error weighted by its own inputs.',
          },
        ]}
        footnote="Every number in the worked example is recomputed here from X, y and η rather than copied from the slide, and both of the deck's printed losses come out: 7.5 before the step and 1.51 after. Three things the deck states without deriving are worked out on the page and marked as such: where the gradient formula comes from, the exact least-squares answer w = (2/3, 3/2) that this run is heading towards, and the largest learning rate that still converges, about 0.361 for this data."
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
            href={`/session/dl3/${p.id}`}
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

      <ConnectionMap topic="dl3" />

      <Explainers
        plain="Regression predicts a continuous number from a feature vector, from examples that come with their answers. Linear regression assumes the output is a weighted sum of the features plus a bias. Glue a column of ones onto the data and the bias becomes an ordinary weight, so every prediction at once is the single matrix product ŷ = Xw. The model is one neuron whose activation is the identity, f(z) = z, chosen because its derivative is 1 everywhere so gradients pass through unchanged. The loss is squared error: half the squared difference per example, averaged over the dataset, written J(w) = (1/2N)‖Xw − y‖². It is differentiable, convex, quadratic in the size of an error, and the maximum-likelihood fit under Gaussian noise. Its gradient is ∇J = (1/N)Xᵀ(Xw − y) — each example's error weighted by its own inputs — and gradient descent repeats w ← w − η∇J until the gradient is small. Evaluation happens on data held back from training, reported as RMSE and MAE in the target's units and as R², which compares the model against predicting the mean."
        breaks="Almost everything that goes wrong is the learning rate. Too large and the loss goes to NaN; a little smaller and it oscillates; far too small and it crawls while looking like a model that simply needs longer. For this data the boundary can be computed exactly — descent converges below η ≈ 0.361 — and the page does compute it rather than quote the deck's 'may overshoot'. The other trap is scale: multiplying one feature column by 100 changes nothing about the answer and multiplies the number of iterations by orders of magnitude, because gradient descent takes the same step in every direction. And the convexity guarantee is local to this model — put a non-linear activation between two layers and the single-minimum promise is gone."
      >
        <MathBlock
          intro="Eight lines carry the session. The first three are the model, the next two the loss, and the last three the training."
          formulas={[
            {
              formula: 'y = w₀ + w₁x₁ + … + w_d x_d',
              reading: 'The linear model. A weighted sum of the features and nothing else.',
            },
            {
              formula: 'x̃ = [1, x₁, …, x_d]ᵀ ,  X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾',
              reading: 'The augmented example and the design matrix. The ones column is what turns the bias into w₀.',
            },
            {
              formula: 'ŷ = f(wᵀx) = wᵀx ,  ŷ = Xw',
              reading: 'One prediction, then all of them. f is the identity, so f(z) = z.',
            },
            {
              formula: 'ℓ = ½(ŷ − y)² ,  J(w) = (1/N) Σ ℓ',
              reading: 'One example’s loss and the average. The ½ makes the derivative clean and moves nothing.',
            },
            {
              formula: 'J(w) = (1/2N)‖Xw − y‖² = (1/2N)(Xw − y)ᵀ(Xw − y)',
              reading:
                'The vector form. The squared length of the error vector — convex, with a single global minimum.',
            },
            {
              formula: '∇J(w) = (1/N) Xᵀ(Xw − y)',
              reading: 'The gradient. Each example contributes its error times its own input; its shape must match w.',
            },
            {
              formula: 'w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η∇J(w⁽ᵗ⁾)',
              reading: 'The update. Every parameter moves at once, against its own slope.',
            },
            {
              formula: 'R² = 1 − SS_res / SS_tot',
              reading:
                'The score with a baseline built in: 0 means no better than predicting ȳ, and negative is worse than that.',
            },
          ]}
          legend={[
            { sym: 'X', name: 'Design matrix', note: 'N rows, d + 1 columns, ones in the first.', val: 'part 4' },
            { sym: 'w', name: 'Parameters', note: 'd + 1 of them, bias first.', val: 'part 4' },
            { sym: 'ŷ', name: 'Predictions', note: 'Say “y-hat”. One per row of X.', val: 'part 5' },
            { sym: 'f(z) = z', name: 'Identity', note: 'f ′(z) = 1, so gradients pass unchanged.', val: 'part 6' },
            { sym: 'ℓ', name: 'Loss on one', note: 'Say “ell”. Half the squared error.', val: 'part 7' },
            { sym: 'J(w)', name: 'Total loss', note: 'The average. A surface over w, not over x.', val: 'part 7' },
            { sym: '‖v‖', name: 'Norm', note: 'The length of a vector. Squared here, so no root.', val: 'part 8' },
            { sym: '∇J', name: 'The gradient', note: 'Say “grad J”. One number per parameter.', val: 'part 12' },
            { sym: 'η', name: 'Learning rate', note: 'Say “eta”. 0.1 in the example; 0.361 diverges.', val: 'part 13' },
            { sym: 'ε', name: 'Tolerance', note: 'Say “epsilon”. How small ‖∇J‖ must get.', val: 'part 11' },
            { sym: 'ȳ', name: 'Mean of y', note: 'Say “y bar”. The baseline R² compares against.', val: 'part 18' },
            { sym: 'w*', name: 'The best w', note: '(2/3, 3/2) for the deck’s three houses.', val: 'part 14' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Linear regression really is a neural network',
            how: 'nn.Linear(d, 1) with no activation, trained with MSELoss and SGD, converges to what LinearRegression computes in closed form. Same model, two ways of finding the parameters.',
          },
          {
            what: 'The last activation is decided by the target',
            how: 'Identity for an unbounded number, sigmoid for a probability, softmax for one of K. Adding a ReLU to a regression output makes negative predictions impossible — a common and silent bug.',
          },
          {
            what: 'The ones column has to come after scaling',
            how: 'Standardising a constant column divides by a standard deviation of zero and fills the model with NaNs. Scale first, augment second.',
          },
          {
            what: 'reduction=“mean” is the 1/N on slide 17',
            how: 'With reduction="sum" the gradient size depends on the batch size, so changing the batch silently changes the effective learning rate. PyTorch also omits the ½, making its MSE twice this J.',
          },
          {
            what: 'Feature scaling buys iterations, not accuracy',
            how: 'The answer is identical either way. What changes is the condition number of the loss bowl, and therefore how large η may be and how many steps it takes.',
          },
          {
            what: 'Convexity is a promise about linear models only',
            how: 'One non-linear activation and the surface acquires local minima, saddles and flat regions. Everything module 4 does about optimisation is a response to losing this.',
          },
          {
            what: 'Train on one number, report another',
            how: 'MSE is smooth and convex so it trains well; RMSE and MAE are in the target’s units so they mean something to a person, and the gap between them shows how uneven the errors are.',
          },
          {
            what: 'The computational graph is backpropagation in miniature',
            how: 'Forward along the solid arrows to the loss, backward along the dashed ones to the gradient. Module 3 adds layers to the same picture and changes nothing else.',
          },
        ]}
      />
    </div>
  )
}
