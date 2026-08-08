'use client'

/**
 * Three more concepts out of the Deep Neural Networks course — the activation
 * function, the scores you judge a regression by, and the design matrix. Each
 * reuses the chapter's labs and links back to the parts it was drawn from.
 */
import { ActivationPickLab } from '@/components/charts/dl2-lab'
import { VectorFormLab } from '@/components/charts/dl2-train-lab'
import { DesignMatrixLab, IdentityLab, LinearNeuronLab, SurfaceLab } from '@/components/charts/dl3-lab'
import { MetricsLab, R2Lab, TrainTestLab } from '@/components/charts/dl3-train-lab'
import Link from 'next/link'
import { UsedInAiml } from './algebra'
import { Connections } from './connections'
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

export function ActivationConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Activation functions: the bend that makes depth worth having"
        intro="Every neuron ends the same way: work out a weighted sum, then put it through one function. That function decides what the unit is for, whether it can be trained at all, and — the part people miss — whether stacking two layers buys you anything."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A weighted sum is a committee vote. The activation is what the chair does with the tally: announce the
            number as it stands, announce only whether it passed, or announce something in between. The vote is the same
            in every case; what leaves the room is not.
          </>,
          <>
            Two of those choices have a consequence nobody expects. If the chair just reads out the number, then a
            committee of committees is only ever one committee — the whole structure collapses. It takes a chair who
            does something <em>non-linear</em> for the second layer to be worth having at all.
          </>,
        ]}
        mappings={[
          {
            title: 'ŷ = f(z)',
            body: 'The interface. z is the weighted sum; f is the activation; ŷ is what the unit says. Session 2 writes it exactly this way and leaves f open on purpose.',
          },
          {
            title: 'f ′(z)',
            body: 'The derivative. If it is zero, no information about the error can get back to the weights, and gradient descent is dead on arrival.',
          },
          {
            title: 'Composition',
            body: 'Two linear layers with nothing between them are one linear layer. The bend is what makes depth real, and XOR is the four-point proof.',
          },
        ]}
        footnote="The step and the identity are both from the course decks — session 2 defines the first, session 3 the second. ReLU and the sigmoid are not, and are marked as such wherever they appear; they are included because equation (2) leaves f open and two examples are not enough to see the pattern."
      />

      <H2>The same sum, different answers</H2>
      <P>
        A neuron computes z = Σ wᵢxᵢ + b, and then ŷ = f(z). Everything before f is fixed by the weights; everything
        after it is fixed by your choice of f. Move z through the lab below and watch four different functions disagree
        about what to do with it — most sharply at z = 0, which is where every worked answer in this course seems to
        land.
      </P>

      <Lab>
        <ActivationPickLab />
      </Lab>

      <H2>The derivative is what decides if it can be trained</H2>
      <P>
        Training moves a weight by asking how the loss would change if the weight changed. That question is answered by
        the chain rule, and the chain rule multiplies by f′ on the way. So an activation with a derivative of zero
        multiplies the answer by zero, and nothing reaches the weights.
      </P>
      <P>
        That is the whole reason the perceptron needs a rule of its own rather than gradient descent, and the whole
        reason session 3 can use gradient descent the moment it swaps the step for the identity.
      </P>

      <Lab>
        <IdentityLab />
      </Lab>

      <H2>And why a linear activation is not enough</H2>
      <P>
        The identity is perfect for an output and useless in the middle. Two layers with identity activations compose
        into one: W₂(W₁x + b₁) + b₂ is (W₂W₁)x + (W₂b₁ + b₂), which is a single linear map with different numbers in it.
        Stack a hundred and you still have one layer’s worth of expressive power — and XOR, which one layer cannot do,
        stays impossible.
      </P>

      <Lab>
        <LinearNeuronLab />
      </Lab>

      <Explainers
        plain="An activation is the function applied to a neuron's weighted sum. The step outputs one of two values and is what makes a perceptron; the identity returns its input and is what makes linear regression; ReLU returns max(0, z) and is the usual choice inside hidden layers. Three properties matter. What range it outputs decides what the unit can be used for — unbounded for a number, bounded for a probability. Whether it is differentiable, and what its derivative is, decides whether gradient descent can train it. And whether it is non-linear decides whether stacking layers buys anything, because a chain of linear maps is a linear map."
        breaks="Two failures, both silent. Forgetting the activation between hidden layers leaves a network that trains, plateaus and never explains itself — it has the power of one layer whatever the diagram says, and XOR is the four-point test that catches it. And applying an activation to the output layer out of habit quietly restricts what the model can predict: a ReLU makes negative outputs impossible, a sigmoid caps everything at 1. The last activation is decided by the target, not by the pattern of the layers before it."
      >
        <MathBlock
          intro="Four lines. The first is the interface; the second and third are what the two decks choose; the last is why the choice matters for depth."
          formulas={[
            { formula: 'ŷ = f(z),  z = Σ wᵢxᵢ + b', reading: 'The interface every unit in this course plugs into.' },
            {
              formula: 'step: f(z) = 1 if z ≥ 0 else 0 ,  f ′ = 0',
              reading: 'The perceptron. Untrainable by gradient descent — nothing gets back.',
            },
            {
              formula: 'identity: f(z) = z ,  f ′(z) = 1',
              reading: 'Linear regression. The gradient passes through unchanged.',
            },
            {
              formula: 'W₂(W₁x + b₁) + b₂ = (W₂W₁)x + const',
              reading: 'Two linear layers are one. The reason a non-linear activation between them is compulsory.',
            },
          ]}
          legend={[
            {
              sym: 'f(·)',
              name: 'The activation',
              note: 'Say “eff of dot”. The dot is a placeholder.',
              val: 'the picker above',
            },
            { sym: 'z', name: 'Pre-activation', note: 'Also called the logit, or the hypothesis.', val: 'the slider' },
            {
              sym: 'f ′(z)',
              name: 'Its derivative',
              note: 'Say “eff prime”. Zero means untrainable.',
              val: 'the dashed line',
            },
            {
              sym: 'ReLU',
              name: 'max(0, z)',
              note: 'Say “ray-loo”. Not in these decks; the usual hidden-layer choice.',
              val: 'f ′ = 1 or 0',
            },
            {
              sym: 'σ(z)',
              name: 'The sigmoid',
              note: 'Say “sigma”. Squashes to (0, 1) for a probability.',
              val: 'f ′ ≤ 0.25',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'nn.ReLU() is a separate module for a reason',
            how: 'PyTorch splits the linear part from the activation exactly as session 2’s two equations do, so you can change f without touching the weights. nn.Sequential(nn.Linear(4,8), nn.ReLU()) is one layer written as two objects.',
          },
          {
            what: 'A missing activation is a silent bug',
            how: 'The model trains, the loss falls a little, it plateaus, and nothing warns you. Print the model and check there is an activation between every pair of linear layers.',
          },
          {
            what: 'The output activation is decided by the target',
            how: 'Identity for an unbounded number, sigmoid for a probability, softmax for one of K classes. Applying ReLU to a regression output silently forbids negative predictions.',
          },
          {
            what: 'Sigmoid’s derivative is why deep networks abandoned it',
            how: 'It peaks at 0.25, so twenty layers multiply the returning gradient by at most 0.25²⁰. That is the vanishing gradient problem, and ReLU’s derivative of 1 is the fix.',
          },
          {
            what: 'CrossEntropyLoss expects raw scores, not probabilities',
            how: 'It applies the softmax itself. Adding your own sigmoid or softmax before it squashes twice and flattens the gradients — one of the most common wiring mistakes.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl2/maths', label: 'Session 2, part 5 — z and f' },
          { href: '/session/dl3/identity', label: 'Session 3, part 6 — the identity' },
          { href: '/session/dl1/perceptron', label: 'Session 1, part 15 — the step' },
        ]}
      />

      <Connections topic="activation" />
    </div>
  )
}

/* ========================================================================== */

export function MetricsConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="Scoring a regression: MSE, RMSE, MAE and R²"
        intro="Four numbers computed from the same set of errors, saying four different things. Which one you quote decides which model looks best, so it is worth knowing exactly what each of them is sensitive to."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A bus company is late by one minute on ninety-nine journeys and by ninety minutes on the hundredth.
            Averaging the delays gives about 1.9 minutes and sounds fine. Averaging the squares of the delays gives a
            number dominated entirely by the one disaster. Neither is wrong; they are answers to different questions.
          </>,
          <>
            That is the whole of this page. Squaring makes large errors count enormously and small ones hardly at all;
            not squaring treats every minute the same. R² asks a third question again — not how big the errors are, but
            whether the model beat the laziest possible rival.
          </>,
        ]}
        mappings={[
          {
            title: 'MSE and RMSE',
            body: 'Square the errors, average, and optionally take the root to get back into the units of the target. Sensitive to outliers by design.',
          },
          {
            title: 'MAE',
            body: 'Average the sizes of the errors. Every unit of error counts the same, whoever it belongs to.',
          },
          {
            title: 'R²',
            body: 'Compare against always predicting the mean. Zero means you tied with that; negative means you lost to it.',
          },
        ]}
        footnote="All four formulas are from session 3 of the Deep Neural Networks course, and every number on this page is recomputed from the points you can drag. Two facts the deck does not state are marked as added: that RMSE is never below MAE, and that R² never falls when a feature is added."
      />

      <H2>Four scores, one set of errors</H2>
      <P>
        Drag the last point away from the trend and watch the read-outs. MSE roughly quadruples where MAE roughly
        doubles — that is the deck’s parenthetical <em>less sensitive to outliers than MSE</em>, made into something you
        can see. RMSE follows MSE but stays in the units of y, which is why it is the one to put in front of a person.
      </P>

      <Lab>
        <MetricsLab />
      </Lab>

      <H2>R² has a baseline built into it</H2>
      <P>
        The other three tell you how big your errors are, and whether that is good depends entirely on the problem. R²
        removes that ambiguity by dividing by the error of a fixed rival: the model that ignores every feature and
        predicts the mean of y for everything.
      </P>
      <P>
        So R² = 1 is perfect, R² = 0 is exactly as good as that baseline, and R² below zero means worse than doing
        nothing at all — which the deck notes is possible on a test set, and which the lab lets you produce on purpose.
      </P>

      <Lab>
        <R2Lab />
      </Lab>

      <H2>And all of them mean nothing on the training set</H2>
      <P>
        Every score on this page can be computed on the rows the model was fitted to, and none of them says anything
        useful there. The number that matters is the one computed on data held back — which is a different set of rows
        through the same formula.
      </P>

      <Lab>
        <TrainTestLab />
      </Lab>

      <Explainers
        plain="MSE averages the squared errors and is what training minimises. RMSE is its square root, which returns the number to the units of the target — rupees rather than rupees squared — so it is the one to report. MAE averages the absolute sizes of the errors and treats every unit of error alike, which makes it much less sensitive to a few extreme cases. R² is different in kind: it divides your total squared error by the total squared error of predicting the mean, and subtracts from one, so it says what share of the target's variation the model accounted for. All four should be computed on data the model has not been trained on."
        breaks="Reporting a single number invites the wrong conclusion. RMSE and MAE together are more informative than either alone, because the gap between them measures how uneven the errors are — they are equal only when every error is the same size. R² has its own trap: it never decreases when you add a feature, even a column of random numbers, so comparing models of different sizes by training R² always picks the biggest. And 'R² above 0.7 is good' is a rule of thumb about a field, not a fact — 0.3 is excellent in some social science and 0.99 is suspicious in physics."
      >
        <MathBlock
          intro="Four definitions, and the two facts about them worth knowing."
          formulas={[
            {
              formula: 'MSE = (1/N) Σ (ŷ − y)²',
              reading: 'The training loss without the ½. Units are the target’s, squared.',
            },
            { formula: 'RMSE = √MSE', reading: 'Back in the target’s units. The number to quote to a person.' },
            {
              formula: 'MAE = (1/N) Σ |y − ŷ|',
              reading: 'The average size of an error. Much less moved by a single extreme case.',
            },
            {
              formula: 'R² = 1 − SS_res / SS_tot ,  SS_tot = Σ(y − ȳ)²',
              reading: 'Compared against predicting the mean. Zero ties with that baseline; negative loses to it.',
            },
            {
              formula: 'RMSE ≥ MAE, always',
              reading: 'Equal only when every error is the same size. The gap measures how uneven they are.',
            },
            {
              formula: 'R² never falls when a feature is added',
              reading:
                'On the training set. Which is why models of different sizes must be compared on held-back data.',
            },
          ]}
          legend={[
            { sym: 'ŷ', name: 'Prediction', note: 'Say “y-hat”.', val: 'the fitted line' },
            { sym: 'y', name: 'Target', note: 'The recorded answer.', val: 'the blue dots' },
            { sym: 'ȳ', name: 'Mean of y', note: 'Say “y bar”. R²’s baseline.', val: 'the dashed line' },
            { sym: 'SS_res', name: 'Residual sum', note: 'Your model’s total squared error.', val: 'the numerator' },
            {
              sym: 'SS_tot',
              name: 'Total sum',
              note: 'The baseline’s. Nothing to do with your model.',
              val: 'the denominator',
            },
            { sym: 'N', name: 'Examples', note: 'How many rows the average is over.', val: '6 in the lab' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Train on one number, report another',
            how: 'MSE is smooth and convex so it optimises well; RMSE and MAE are interpretable so they go in the report. The loss and the metric do not have to be the same, and usually should not be.',
          },
          {
            what: 'Check R² = 0 before tuning anything',
            how: 'r2_score has the do-nothing baseline built in. A model that has not beaten it has a bug or a problem with no signal, and either is worth finding before a week of tuning.',
          },
          {
            what: 'A negative test R² is a specific alarm',
            how: 'Worse than a constant on new data. Almost always severe overfitting, or a training set drawn from a different distribution than the test set.',
          },
          {
            what: 'The metric encodes what a mistake costs',
            how: 'If being wrong by 10 is twenty times worse than by 5, squared error matches your world; if it is twice as bad, MAE does. Choosing is a statement about the application, not about statistics.',
          },
          {
            what: 'Never scale using statistics from the test rows',
            how: 'Fitting a StandardScaler on all the data before splitting lets the test set influence the model, which quietly inflates every score on this page. Pipeline exists to prevent it.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl3/metrics', label: 'Session 3, part 17 — MSE, RMSE and MAE' },
          { href: '/session/dl3/r2', label: 'Session 3, part 18 — R²' },
          { href: '/session/dl3/traintest', label: 'Session 3, part 16 — training against test' },
        ]}
      />

      <Connections topic="metrics" />
    </div>
  )
}

/* ========================================================================== */

export function DesignMatConcept() {
  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Concept"
        title="The design matrix, and predicting a whole dataset at once"
        intro="Stack your examples as rows, glue a column of ones on the front, and two things happen: the bias stops being a special case, and every prediction in the dataset becomes a single matrix multiply. Almost every formula in machine learning is written this way, so it is worth being fluent in the shapes."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A spreadsheet with one row per house and one column per thing you measured is already a matrix. The only
            change this idea makes is to add a column at the front that says 1 for every house — a column that measures
            nothing.
          </>,
          <>
            That useless-looking column is what lets the intercept be treated like any other weight. Before it, every
            formula has a “and then add b” clause tacked on the end; after it, the b has folded into the sum and the
            algebra gets shorter everywhere.
          </>,
        ]}
        mappings={[
          {
            title: 'X, N × (d + 1)',
            body: 'One row per example, one column per feature, plus the ones column at the front. The deck calls it the design matrix.',
          },
          {
            title: 'w, (d + 1) × 1',
            body: 'One weight per column, bias first. The parameter count and the column count are the same number for the same reason.',
          },
          {
            title: 'ŷ = Xw',
            body: 'Every prediction at once. The inner dimensions match, so the product exists and comes out N × 1 — one answer per row.',
          },
        ]}
        footnote="The design matrix comes from session 3 of the Deep Neural Networks course; the vector form h = wᵀx it generalises is from session 2. Both labs are those sessions', and every shape shown is computed from the sliders rather than written down."
      />

      <H2>One example: a row times a column</H2>
      <P>
        Start with a single prediction. Transposing w lays the column of weights on its side, so a 1 × (n + 1) row times
        an (n + 1) × 1 column is a single number — which is the dot product from the maths course, written a third way.
      </P>

      <Lab>
        <VectorFormLab />
      </Lab>

      <H2>Every example: a matrix times a column</H2>
      <P>
        Now stack the examples. X has one row per example, w is unchanged, and Xw applies the same weights to every row
        in one operation. The shapes are the whole argument: (N × (d + 1)) times ((d + 1) × 1) is N × 1, and there is
        one prediction per example because there is one row per example.
      </P>

      <Lab>
        <DesignMatrixLab />
      </Lab>

      <H2>Why anybody bothers</H2>
      <P>
        Three reasons, and only the first is about elegance. The bias becomes an ordinary weight, so no formula needs a
        special case for it. A library can compute all N predictions in one call, which on a GPU means thousands at once
        rather than a Python loop. And the loss, the gradient and the update all become single expressions in X — which
        is what makes them short enough to differentiate by hand.
      </P>

      <Lab>
        <SurfaceLab />
      </Lab>

      <Explainers
        plain="The design matrix X holds one training example per row and one feature per column, with a leading column of ones so that the bias can be carried as an ordinary weight w₀. With the weights as a column vector w, the product Xw is the vector of predictions — one per row — computed in a single operation. The same arrangement makes the loss (1/2N)‖Xw − y‖², the gradient (1/N)Xᵀ(Xw − y) and the update w − η∇J all single expressions, and it is the reason those formulas are short enough to work with by hand."
        breaks="The ones column has two consequences people trip over. Standardising the features after adding it divides a constant column by a standard deviation of zero and fills the model with NaNs, so scaling must come first. And regularisation should not penalise w₀ — the bias is not a claim about any feature, so shrinking it towards zero pushes the model's overall level down for no reason — which means libraries have to keep track of which column is the ones column after all. The other frequent error is a shape mismatch: check that the gradient has exactly as many entries as w, every time."
      >
        <MathBlock
          intro="Five lines, and four of them are shapes. Getting the shapes right is most of getting the algebra right."
          formulas={[
            {
              formula: 'x̃ = [1, x₁, …, x_d]ᵀ',
              reading: 'One augmented example. The tilde is a reminder that the 1 is on the front.',
            },
            { formula: 'X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾', reading: 'N examples down, d + 1 columns across. Each row is one example.' },
            { formula: 'w ∈ ℝᵈ⁺¹, y ∈ ℝᴺ', reading: 'One weight per column, one target per row.' },
            {
              formula: 'ŷ = Xw ∈ ℝᴺ',
              reading: 'Every prediction at once. Inner dimensions d + 1 match, so the product exists.',
            },
            {
              formula: '∇J = (1/N) Xᵀ(Xw − y) ∈ ℝᵈ⁺¹',
              reading:
                'Xᵀ is (d + 1) × N and the error is N × 1, so the gradient has one entry per weight — as it must.',
            },
          ]}
          legend={[
            {
              sym: 'X',
              name: 'Design matrix',
              note: 'Rows are examples, columns are features.',
              val: 'the lab’s left box',
            },
            { sym: 'x̃', name: 'Augmented example', note: 'Say “x tilde”. One row of X.', val: 'a row' },
            { sym: 'N', name: 'Examples', note: 'Called m in the maths course. Same thing.', val: 'rows slider' },
            { sym: 'd', name: 'Features', note: 'Real columns, before the ones column.', val: 'features slider' },
            {
              sym: 'd + 1',
              name: 'Parameters',
              note: 'Features plus the bias. Also the column count.',
              val: 'derived',
            },
            {
              sym: 'Xᵀ',
              name: 'X transpose',
              note: 'Rows and columns swapped, so the shapes line up.',
              val: 'in the gradient',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'X @ w is the whole of a linear layer’s forward pass',
            how: 'nn.Linear keeps the bias separately rather than as a ones column, which is the same arithmetic organised differently — and is why a batch of inputs is (batch, in_features) and the weight is (out_features, in_features).',
          },
          {
            what: 'Batching is this idea applied to the loop',
            how: 'DataLoader stacks examples into a matrix precisely so one matmul replaces a loop. It is also why sequences must be padded to a common length before they can be batched.',
          },
          {
            what: 'Check shapes before you check maths',
            how: 'A gradient must have exactly as many entries as its parameter. A shape mismatch is the fastest way to catch a wrong transpose before it becomes a silently wrong model.',
          },
          {
            what: 'Scale first, augment second',
            how: 'Standardising a column of ones divides by zero. It is a two-minute bug that costs an afternoon if you do not know why NaNs appeared everywhere at once.',
          },
          {
            what: 'The closed form exists and does not scale',
            how: 'w = (XᵀX)⁻¹Xᵀy solves it exactly with no learning rate, at a cost of about d³. Fine at ten features, impossible at a hundred thousand — which is the only reason deep learning uses gradient descent.',
          },
        ]}
      />

      <FromLecture
        items={[
          { href: '/session/dl3/design', label: 'Session 3, part 4 — the design matrix' },
          { href: '/session/dl2/fourparts', label: 'Session 2, part 18 — h = wᵀx' },
          { href: '/session/dl3/gradient', label: 'Session 3, part 12 — the gradient in matrix form' },
        ]}
      />

      <Connections topic="designmat" />
    </div>
  )
}
