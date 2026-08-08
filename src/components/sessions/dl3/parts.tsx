/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  DesignMatrixLab,
  IdentityLab,
  LinearNeuronLab,
  LinearityLab,
  LossLab,
  RegComponentsLab,
  RegressionKindLab,
  SurfaceLab,
  WhySquaredLab,
} from '@/components/charts/dl3-lab'
import {
  BatchAlgoLab,
  CompGraphLab,
  DebugLab,
  GdIdeaLab,
  GradientLab,
  LoopLab,
  MetricsLab,
  R2Lab,
  ScalingLab,
  TrainTestLab,
  UpdateEtaLab,
  WorkedExampleLab,
} from '@/components/charts/dl3-train-lab'
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

function Beyond({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-dashed border-zinc-950/20 bg-white px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        Not on the slides — added to make this land
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-700">{children}</div>
    </div>
  )
}

export const DL3_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  whatis: (
    <>
      <Para>
        Module 3 is <strong>linear neural networks for regression</strong>, and it starts by saying what regression is.
      </Para>
      <Worked title="The definition, slide 4">
        {`Regression is a supervised learning task that predicts a
continuous-valued output based on input features.

  Input   a feature vector  x ∈ ℝᵈ
  Output  a real-valued target  y ∈ ℝ
  Goal    learn a function  f : ℝᵈ → ℝ  such that  y ≈ f(x)`}
      </Worked>
      <Para>
        Three things are being fixed there. <strong>Supervised</strong> — every training example comes with its answer
        attached. <strong>Continuous</strong> — the answer is a number that can take any value, not one of a fixed list
        of labels. And <strong>≈ rather than =</strong> — the goal is to get close, because with real data no function
        will pass through every point.
      </Para>

      <Lab>
        <RegressionKindLab />
      </Lab>

      <Para>The deck gives three examples, and each is worth reading for its input as much as its output:</Para>
      <List
        items={[
          <>
            <strong>House price prediction</strong> — size, location, number of rooms in; a price in dollars out.
          </>,
          <>
            <strong>Temperature forecasting</strong> — historical weather, season and humidity in; a temperature out.
          </>,
          <>
            <strong>Stock price prediction</strong> — historical prices, trading volume and market indicators in; a
            future price out.
          </>,
        ]}
      />

      <Terms
        items={[
          {
            term: 'regression',
            def: 'Predicting a number. The word is a historical accident — Galton’s "regression towards the mean" — and has nothing to do with going backwards.',
          },
          {
            term: 'continuous-valued',
            def: 'Able to take any value in a range, with meaningful in-betweens. 4.7 and 4.8 are both possible and 4.75 lies between them.',
          },
          {
            term: 'ℝᵈ',
            say: 'are-dee',
            def: 'The set of all lists of d real numbers. "x ∈ ℝᵈ" means x is a point with d coordinates — the same ℝⁿ from the maths course, with the letter changed.',
          },
          {
            term: 'f : ℝᵈ → ℝ',
            say: 'eff from are-dee to are',
            def: 'A function taking a d-number input and returning one number. The arrow notation says only the shapes, not what the function does.',
          },
          {
            term: '≈',
            say: 'approximately equals',
            def: 'Close to, not equal to. The whole of the loss function exists to say how close is close enough.',
          },
          {
            term: 'supervised',
            def: 'Trained on examples that carry the right answer. The alternative, with no answers, is unsupervised — the ML course covers both.',
          },
        ]}
      />

      <Beyond>
        The commonest mistake here is a categorical target whose labels happen to be numbers. Predicting which of digits
        0 to 9 is in an image is <em>not</em> regression, even though the labels are numerals: 7 is not more than 3 in
        any sense the data supports, and a squared-error loss over those labels would train the model to answer about
        4.5 for everything. The test is not what the target looks like, it is whether the in-betweens mean anything.
      </Beyond>

      <WhyAiml method="nn.Linear(d, 1) with nn.MSELoss">
        <p className="mb-2">
          The definition on this slide decides two lines of code before you write anything else: a final layer with one
          output and no activation, and a squared-error loss. Get the task type wrong and both are wrong — a
          classification problem fitted with <code>MSELoss</code> over integer labels trains to the average class code,
          which is meaningless.
        </p>
        <p>
          It also decides how you report. A regression is reported in the units of the thing predicted — rupees, degrees
          — which is why RMSE appears later in this deck and accuracy does not. Choosing the task type is upstream of
          every other decision in the pipeline.
        </p>
      </WhyAiml>

      <Takeaway>
        Regression predicts a continuous number from a feature vector, from examples that carry their answers. The test
        is whether values between two targets mean anything.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  linear: (
    <>
      <Para>
        <strong>Linear regression assumes the output is a linear combination of the input features.</strong> That is the
        whole assumption, and everything else in the session follows from it.
      </Para>
      <Worked title="The model, slide 7">
        {`  y  =  w₀  +  w₁x₁  +  w₂x₂  +  …  +  w_d x_d          (1)

  x = [x₁, x₂, … x_d]ᵀ    the input features
  w = [w₁, w₂, … w_d]ᵀ    the weights
  w₀                       the bias term`}
      </Worked>
      <Para>
        Each feature is multiplied by one number and the results are added. No feature is multiplied by another, none is
        squared, and none is inside a function. That restriction is what the word <em>linear</em> is doing.
      </Para>
      <Para>The deck’s three examples make the shape concrete:</Para>
      <List
        items={[
          <>Salary = w₀ + w₁ × years of experience.</>,
          <>Yield = w₀ + w₁ × rainfall + w₂ × fertiliser.</>,
          <>Energy = w₀ + w₁ × temperature + w₂ × hour + w₃ × day.</>,
        ]}
      />
      <Para>
        And then the sentence that is easy to skim past:{' '}
        <strong>the relationship between inputs and output is assumed to be linear</strong>. Assumed. Not checked, not
        guaranteed — which raises the obvious question of what happens when it is false.
      </Para>

      <Lab>
        <LinearityLab />
      </Lab>

      <Para>
        Switch the truth to <strong>Curved</strong> and look at the red bars rather than the line. They are long at both
        ends and short in the middle — a shape, not a scatter. That pattern in the residuals is the signature of a model
        that is too simple, and it is the cheapest diagnostic in all of regression.
      </Para>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'Multiply each thing by a number and add the results. The same phrase, and the same object, as in Lecture 2 of the maths course.',
          },
          {
            term: 'coefficient',
            def: 'Another name for a weight, used more often in statistics than in deep learning. wᵢ is the coefficient of xᵢ.',
          },
          {
            term: 'residual',
            def: 'What one prediction got wrong: y − ŷ. The plural is what you plot when you want to know whether the model is the right shape.',
          },
          {
            term: 'bias term',
            def: 'w₀, the part that does not depend on any feature. In statistics it is called the intercept, because it is where the line crosses the vertical axis.',
          },
        ]}
      />

      <Beyond>
        “Linear” is a statement about the <em>weights</em>, not the features, and that distinction buys a lot. You are
        free to invent a feature x₃ = x₁², feed it in, and fit y = w₀ + w₁x₁ + w₂x₂ + w₃x₁² — that is still linear
        regression, because it is still a linear combination of whatever columns you supplied. All the machinery in this
        session applies unchanged. What is not allowed is the weights appearing non-linearly, as in y = w₁ᵂ².
      </Beyond>

      <WhyAiml method="PolynomialFeatures, and residual plots">
        <p className="mb-2">
          The trick above is one line in practice: <code>PolynomialFeatures(degree=2)</code> in scikit-learn expands
          your columns, and the same <code>LinearRegression</code> then fits a curve. The model class did not change,
          only the design matrix — which is exactly the observation that makes the kernel trick possible later.
        </p>
        <p>
          The habit worth taking is the residual plot. Predictions against errors, on the training data, takes one line
          and tells you whether your linearity assumption survived contact with the data. A visible shape means you are
          missing a term; a shapeless cloud means the model has taken everything it can.
        </p>
      </WhyAiml>

      <Takeaway>
        A weighted sum of the features, plus a bias. When the assumption fails, the errors come out patterned rather
        than random — so plot them.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  components: (
    <>
      <Para>
        Before any algebra, the deck restates the four-component checklist from session 1 with this session’s answers
        written into it.
      </Para>
      <List
        items={[
          <>
            <strong>Data</strong> — d-dimensional input vectors and target outputs.
          </>,
          <>
            <strong>Model</strong> — a single neuron implementing a linear function.
          </>,
          <>
            <strong>Objective function</strong> — measures prediction error.
          </>,
          <>
            <strong>Learning algorithm</strong> — gradient descent to optimise the weights.
          </>,
        ]}
      />
      <Para>
        Compare that with session 2’s version of the same list. The data is the same shape, and the model is the same
        single neuron. Only two things changed: the activation inside the model, and the objective — which was “the
        deviation of t from ŷ”, a description, and is about to become a formula.
      </Para>

      <Lab>
        <RegComponentsLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'objective function',
            def: 'The number being minimised. Session 2 named it without writing it; this session writes it down on slide 17.',
          },
          {
            term: 'optimise',
            def: 'Search for the parameters that make the objective as small as possible. Not "improve generally" — a specific number is being driven down.',
          },
          {
            term: 'd-dimensional',
            def: 'Having d features. The deck uses d here and n elsewhere for the same idea; both mean the number of columns.',
          },
        ]}
      />

      <Beyond>
        It is worth writing the two sessions’ answers side by side, because the difference is exactly two boxes:
      </Beyond>
      <Worked title="Perceptron against linear regression">
        {`                  Session 2                  Session 3
  ────────────────────────────────────────────────────────────
  Data          x and a label t            x and a number y
  Model         one neuron                 one neuron
  Activation    step: 1 if z ≥ 0 else 0    identity: f(z) = z
  Objective     "deviation of t and ŷ"     J = (1/2N)‖Xw − y‖²
  Algorithm     perceptron rule            gradient descent
  Output        a side of a boundary       any real number`}
      </Worked>
      <Para>
        The two changes are connected. You cannot run gradient descent on the perceptron because the step has no usable
        derivative; swap in the identity and the whole of calculus becomes available. That is the real content of this
        session.
      </Para>

      <WhyAiml method="the same training loop, a different criterion">
        <p className="mb-2">
          In code the two models differ by one line. Both are <code>nn.Linear(d, 1)</code>; regression follows it with
          nothing and uses <code>nn.MSELoss()</code>, classification follows it with a sigmoid or uses{' '}
          <code>BCEWithLogitsLoss</code>. The loop — zero the gradients, forward, loss, backward, step — is
          character-for-character identical.
        </p>
        <p>
          That is why the four-component checklist is worth keeping in your head rather than treating as introductory
          material. Almost every model in this course is a different filling of the same four boxes, and knowing which
          box a change lives in is how you reason about it.
        </p>
      </WhyAiml>

      <Takeaway>
        Same data, same single neuron. The activation becomes the identity and the objective becomes squared error, and
        those two changes are what let gradient descent take over.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  design: (
    <>
      <Para>
        For efficient computation the deck organises the data into matrices, and the first move is a small one with
        large consequences: <strong>add a 1 to the front of every example</strong>.
      </Para>
      <Worked title="The augmented data, slide 12">
        {`Augmented example:   x̃⁽ⁱ⁾ = [1, x₁⁽ⁱ⁾, … , x_d⁽ⁱ⁾]ᵀ

                    ⎡ 1   x₁⁽¹⁾  …  x_d⁽¹⁾ ⎤
                    ⎢ 1   x₁⁽²⁾  …  x_d⁽²⁾ ⎥
Design matrix   X = ⎢ ⋮     ⋮    ⋱    ⋮   ⎥     X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾
                    ⎣ 1   x₁⁽ᴺ⁾  …  x_d⁽ᴺ⁾ ⎦

Target vector   y = [y⁽¹⁾  y⁽²⁾  …  y⁽ᴺ⁾]ᵀ      y ∈ ℝᴺ

Weight vector   w = [w₀  w₁  w₂  …  w_d]ᵀ       w ∈ ℝᵈ⁺¹

Each row of X is one training example.`}
      </Worked>
      <Para>
        The column of ones is doing one job: it gives w₀ something to multiply. After that the bias is an ordinary
        weight in an ordinary position, and every formula from here on has one symbol instead of two.
      </Para>

      <Lab>
        <DesignMatrixLab />
      </Lab>

      <Para>
        Watch the shapes as you move the sliders. X is N × (d + 1), w is (d + 1) × 1, so the product Xw is N × 1 — one
        prediction per example, in one operation. That is the entire reason for organising the data this way.
      </Para>

      <Terms
        items={[
          {
            term: 'design matrix',
            def: 'The block of features with one row per example. The name is from experimental statistics, where the rows were the experiments you designed.',
          },
          {
            term: 'x̃',
            say: 'x tilde',
            def: 'The example with the 1 glued on the front. The tilde is a reminder that this vector is one longer than the raw features, and it gets dropped once nobody could be confused.',
          },
          {
            term: 'ℝᴺˣ⁽ᵈ⁺¹⁾',
            say: 'are en by dee plus one',
            def: 'The set of all N by (d + 1) matrices of real numbers. Saying X lives here is saying its shape, nothing more.',
          },
          {
            term: 'N',
            def: 'The number of training examples — rows. Session 1 and the maths course both call it m; this deck calls it N. Same thing.',
          },
          {
            term: 'd + 1',
            def: 'Features plus the bias. It is the number of parameters, and the number of columns of X, and those are the same number for the same reason.',
          },
        ]}
      />

      <Beyond>
        The ones column is not free, and one place it matters is regularisation. Weight decay penalises large weights to
        keep a model simple — but penalising w₀ would push the model’s overall level towards zero for no good reason,
        since the bias is not a claim about any feature. So in practice the bias is excluded from the penalty, which
        means libraries have to keep track of which column is the ones column after all.
      </Beyond>

      <WhyAiml method="np.hstack([np.ones((N,1)), X]) and fit_intercept=True">
        <p className="mb-2">
          Every library does this, and most hide it. <code>LinearRegression(fit_intercept=True)</code> adds the ones
          column for you; PyTorch’s <code>nn.Linear(d, 1, bias=True)</code> keeps a separate bias tensor instead, which
          is the same arithmetic organised differently. Writing it by hand once is what makes both readable.
        </p>
        <p>
          It also explains a class of confusing bugs. Standardising your features <em>after</em> adding the ones column
          divides a constant column by a standard deviation of zero, producing NaNs across the whole model. Scale first,
          augment second — and knowing why takes only this slide.
        </p>
      </WhyAiml>

      <Takeaway>
        One column of ones turns the bias into an ordinary weight. Then X is N × (d + 1), w is (d + 1) × 1, and Xw is
        every prediction at once.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  neuron: (
    <>
      <Para>
        The deck now draws linear regression as a picture you have seen twice already: a constant 1 and d features
        arriving at a Σ, then a box f, then one output.
      </Para>
      <Worked title="The model, slide 14">
        {`  ŷ  =  f(wᵀx)  =  f(w₀ + w₁x₁ + w₂x₂ + … + w_d x_d)     (2)

  w = [w₀, w₁, …, w_d]ᵀ ∈ ℝᵈ⁺¹     the model parameters
  x = [1, x₁, …, x_d]ᵀ ∈ ℝᵈ⁺¹      the augmented input
  f(·)                              the identity activation, f(z) = z

Vectorised, for every prediction at once:

  ŷ  =  X w                                              (3)`}
      </Worked>
      <Para>
        Equation (2) is exactly session 2’s equation (2) with one thing filled in. Same Σ, same wᵀx, same f — and f is
        now named. Equation (3) is the same model applied to the whole dataset in one multiplication.
      </Para>

      <Lab>
        <LinearNeuronLab />
      </Lab>

      <Para>
        Drag the input slowly across the point where the line crosses zero. The perceptron’s answer jumps from 0 to 1
        with nothing in between; the regression’s slides smoothly through. The perceptron throws away everything except
        the sign of z, and the regression keeps the whole number — which is the difference between the two models in one
        sentence.
      </Para>

      <Terms
        items={[
          {
            term: 'ŷ = Xw',
            def: 'Every prediction in one product. N × (d + 1) times (d + 1) × 1 gives N × 1, one row per example.',
          },
          {
            term: 'vectorised',
            def: 'Written as operations on whole arrays rather than as a loop over elements. It is what makes numerical code fast, because the loop happens in optimised machine code instead of in Python.',
          },
          {
            term: 'model parameters',
            def: 'The d + 1 numbers in w. Everything else in the model is fixed by you before training starts.',
          },
        ]}
      />

      <Beyond>
        There is something worth saying plainly here: <strong>linear regression is a neural network</strong>. Not like
        one, not a special case of one by analogy — it is a network with no hidden layers and one output unit whose
        activation is the identity. That is the reason this module exists at the front of a deep learning course. Every
        piece of machinery you build for it — the loss, the gradient, the update, the metrics — carries over unchanged
        to a network with a hundred layers.
      </Beyond>

      <WhyAiml method="nn.Linear(d, 1) trained with SGD is linear regression">
        <p className="mb-2">
          You can check the claim above in a few lines. Build <code>nn.Linear(d, 1)</code>, use{' '}
          <code>nn.MSELoss()</code>, run <code>optim.SGD</code>, and the weights converge to what{' '}
          <code>sklearn.linear_model.LinearRegression</code> computes in closed form. Same model, two ways of finding
          the same parameters.
        </p>
        <p>
          Which one to use is a real decision, not a formality. The closed form is exact and needs no learning rate, and
          it costs roughly d³ to invert a (d + 1) × (d + 1) matrix — fine at d = 10, hopeless at d = 100 000. Gradient
          descent scales, which is the only reason deep learning uses it.
        </p>
      </WhyAiml>

      <Takeaway>
        One neuron, with the identity as its activation. ŷ = f(wᵀx) for a single example, ŷ = Xw for all of them — and
        this really is a neural network, just a very short one.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  identity: (
    <>
      <Para>The activation for regression is the simplest function there is.</Para>
      <Worked title="The identity, slide 15">
        {`  f(z)  =  z                                             (4)

  f ′(z)  =  1,  everywhere.`}
      </Worked>
      <Para>The deck lists five properties, and they are worth separating into what they say and why it matters:</Para>
      <List
        items={[
          <>
            <strong>Output is continuous, from −∞ to ∞.</strong> Nothing is squashed, so any real target is reachable.
          </>,
          <>
            <strong>Differentiable everywhere, with f′(z) = 1.</strong> No corners, no jumps, no undefined points.
          </>,
          <>
            <strong>Allows the output to take any real value.</strong> The same point as the first, stated from the
            other end.
          </>,
          <>
            <strong>Gradient flows unchanged through the neuron.</strong> A derivative of exactly 1 multiplies whatever
            comes back by 1.
          </>,
          <>
            <strong>No information loss from input to output.</strong> f is invertible — you could recover z from ŷ,
            which is not true of a step or a sigmoid.
          </>,
        ]}
      />

      <Lab>
        <IdentityLab />
      </Lab>

      <Para>
        Switch the lab to <strong>step</strong> and look at the dashed line. It is flat at zero everywhere the
        derivative exists. Multiply anything by zero and it is gone — so nothing about the error ever reaches the
        weights, and gradient descent has nothing to work with. That is why session 2 needed its own hand-made update
        rule, and why this session does not.
      </Para>

      <Terms
        items={[
          {
            term: 'identity function',
            def: 'The function that returns its input unchanged. It sounds like doing nothing, and doing nothing is exactly the right choice when the output should be an unrestricted number.',
          },
          {
            term: 'f ′(z)',
            say: 'eff prime of z',
            def: 'The derivative — how fast f changes as z changes. For the identity it is 1 at every point, which is as simple as a derivative gets.',
          },
          {
            term: 'differentiable',
            def: 'Has a derivative everywhere. Required by gradient descent, and the property the step function fails at its jump.',
          },
          {
            term: 'gradient flows unchanged',
            def: 'When the chain rule multiplies by f′ = 1, nothing is scaled up or down. Sigmoids multiply by at most 0.25, which is where vanishing gradients come from in deep networks.',
          },
          {
            term: '(−∞, ∞)',
            say: 'minus infinity to infinity',
            def: 'The whole real line, with round brackets meaning the ends are not included — they cannot be, since infinity is not a number.',
          },
        ]}
      />

      <Beyond>
        The fourth property has a sting in the tail that this session does not need and module 3 cannot avoid. If every
        layer’s activation multiplies the returning gradient by less than 1, then after twenty layers the gradient has
        been multiplied by that number twenty times and is effectively zero — the <em>vanishing gradient</em> problem.
        The identity’s derivative of exactly 1 is the ideal, ReLU’s of 1-or-0 is the practical compromise, and the
        sigmoid’s maximum of 0.25 is why deep networks stopped using it.
      </Beyond>

      <WhyAiml method="the last layer of almost every regression network">
        <p className="mb-2">
          Even in a network with twenty hidden layers full of ReLUs, the <em>final</em> layer of a regression model has
          no activation at all — which is the identity. Adding a ReLU there would make negative predictions impossible;
          adding a sigmoid would cap the output at 1. Both are common bugs and both come from applying an activation out
          of habit.
        </p>
        <p>
          The rule is that the last activation is decided by the target, not by the architecture: identity for an
          unbounded number, sigmoid for a probability, softmax for one of K classes, and ReLU only when the target
          genuinely cannot be negative.
        </p>
      </WhyAiml>

      <Takeaway>
        f(z) = z, f′(z) = 1. It changes nothing on the way forwards and scales nothing on the way back, which is exactly
        what a regression output needs.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  loss: (
    <>
      <Para>
        With a model in place, the deck asks the question that turns it into a learning problem:{' '}
        <strong>how well does it fit the data?</strong>
      </Para>
      <Worked title="Squared error, slide 17">
        {`For a single example:

   ℓ(w; x⁽ⁱ⁾, y⁽ⁱ⁾)  =  ½ (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)²  =  ½ (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)²      (5)

Total loss, the mean squared error:

                    1    N
   J(w)   =        ───   Σ   ½ (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)²                       (6)
                    N   i=1

Goal:   w*  =  arg min  J(w)                                          (7)
                    w`}
      </Worked>
      <Para>
        Read it in three pieces. The bracket is the error on one example — prediction minus truth. Squaring makes it
        positive and makes a big error count much more than a small one. The ½ is there so the derivative comes out
        clean, and the 1/N averages over the dataset so the number does not grow just because you collected more data.
      </Para>

      <Lab>
        <LossLab />
      </Lab>

      <Para>
        The faint squares in the lab are literal: each one has the error as its side, so its area <em>is</em> the
        squared error. Drag a point twice as far from the line and its square becomes four times as big.
      </Para>

      <Terms
        items={[
          {
            term: 'ℓ',
            say: 'ell, or “the loss”',
            def: 'The loss on one example. Lower case for one, capital J for the average over all of them — a convention worth keeping, because exam questions use both.',
          },
          {
            term: 'J(w)',
            def: 'The total loss, as a function of the weights. The data is fixed; only w varies, which is why J is a surface over w and not over x.',
          },
          {
            term: 'ℓ(w; x, y)',
            def: 'The semicolon separates what varies from what is given. w is the argument; x and y are the example the loss is being computed at.',
          },
          {
            term: 'arg min',
            say: 'arg min',
            def: 'The argument that minimises. arg min J(w) is not the smallest loss — it is the w that produces it. min J would be the value.',
          },
          {
            term: 'w*',
            say: 'w star',
            def: 'The best weights. The star means "the optimal one" throughout this deck.',
          },
          {
            term: 'MSE',
            def: 'Mean squared error. Strictly this J is half of it, because of the ½ — which changes nothing about where the minimum is.',
          },
        ]}
      />

      <Beyond>
        Why the ½ is worth carrying. Differentiating ½e² with respect to e gives exactly e; differentiating e² gives 2e,
        and that 2 would then follow you through every line of the gradient and the update. It is pure bookkeeping — it
        scales J by a constant, and scaling a function by a positive constant never moves its minimum. Some textbooks
        use 1/2N, some 1/N, some plain sums, and all of them find the same w*.
      </Beyond>

      <WhyAiml method="nn.MSELoss(reduction='mean')">
        <p className="mb-2">
          PyTorch’s default is the mean, not the sum, and that default is the 1/N on this slide. It matters more than it
          looks: with <code>reduction=“sum”</code> the size of your gradient depends on the batch size, so changing the
          batch size silently changes the effective learning rate.
        </p>
        <p>
          PyTorch does <em>not</em> include the ½, so its MSE is twice this J. That is a difference of a constant factor
          and it is absorbed entirely by the learning rate — worth knowing when a formula from a textbook and a number
          from a library disagree by a factor of two.
        </p>
      </WhyAiml>

      <Takeaway>
        ℓ is one example’s halved squared error; J is the average over all of them; w* is the w that minimises J. The ½
        is for tidy derivatives and moves nothing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  whysq: (
    <>
      <Para>Squaring the error is a choice, not a law, so the deck gives four reasons for it.</Para>
      <List
        items={[
          <>
            <strong>Differentiable</strong> — smooth everywhere, so it is easy to optimise. Absolute error has a corner
            at zero where the derivative does not exist.
          </>,
          <>
            <strong>Convex</strong> — a single global minimum, for linear models. There is nowhere else to get stuck.
          </>,
          <>
            <strong>Penalises large errors</strong> — quadratic growth. Being twice as wrong costs four times as much.
          </>,
          <>
            <strong>Statistical interpretation</strong> — it is the maximum likelihood fit under Gaussian noise.
          </>,
        ]}
      />
      <Para>And the vector form, which is the version every later formula uses:</Para>
      <Worked title="Slide 18">
        {`             1                 1
   J(w)  =  ────  ‖Xw − y‖²  =  ────  (Xw − y)ᵀ (Xw − y)          (8)
            2N                  2N

   X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾ is the design matrix
   y ∈ ℝᴺ       is the target vector`}
      </Worked>
      <Para>
        ‖·‖ is the norm from the geometry lecture — the length of a vector. So J is the squared length of the error
        vector, divided by 2N. Writing it as (Xw − y)ᵀ(Xw − y) is the same thing, since a vector dotted with itself is
        its squared length.
      </Para>

      <Lab>
        <WhySquaredLab />
      </Lab>

      <Para>
        The third reason is a strength and a weakness at once, and the lab is the weakness. Drag the last house’s price
        up and the squared-error line chases it while the absolute-error line barely moves. One mislabelled row can drag
        the whole model — because that row’s contribution grows quadratically while everyone else’s stays put.
      </Para>

      <Terms
        items={[
          {
            term: 'convex',
            say: 'CON-vex',
            def: 'Bowl-shaped: the straight line between any two points on the surface stays above it. It guarantees one bottom, so any downhill route reaches the best answer.',
          },
          {
            term: '‖v‖',
            say: 'the norm of v',
            def: 'The length of the vector v — the square root of the sum of its squared entries. The double bars are exactly the notation from Lecture 3 of the maths course.',
          },
          {
            term: '‖v‖²',
            def: 'The squared length, which is the sum of the squared entries with no square root. Writing the loss this way avoids a square root that would only be undone by squaring.',
          },
          {
            term: 'vᵀv',
            say: 'v transpose v',
            def: 'A row times a column: the dot product of v with itself, which equals ‖v‖². Two notations for one number.',
          },
          {
            term: 'maximum likelihood',
            def: 'Choosing the parameters that make the observed data most probable. Under the assumption that the noise is Gaussian, that choice comes out identical to minimising squared error.',
          },
          {
            term: 'Gaussian noise',
            def: 'Errors following the bell curve — small ones common, large ones rare, symmetric about zero. The assumption behind the fourth reason, and often not checked.',
          },
        ]}
      />

      <Beyond>
        The fourth reason is the one that turns squared error from a convenient choice into a principled one, and it
        cuts both ways. If the noise really is Gaussian, minimising squared error is the statistically optimal thing to
        do. If it is not — if your data has a heavy tail, or occasional wild values — then the assumption is false and
        the sensitivity you are watching in the lab is not a quirk, it is the method faithfully doing what you asked
        under a premise that does not hold.
      </Beyond>

      <WhyAiml method="nn.MSELoss against nn.L1Loss and nn.HuberLoss">
        <p className="mb-2">
          All three ship in PyTorch, and the choice between them is exactly the trade-off in the lab.{' '}
          <code>L1Loss</code> is absolute error — robust to outliers, and with a corner that makes optimisation slightly
          awkward. <code>HuberLoss</code> is squared near zero and absolute far from it, which is an attempt to have
          both.
        </p>
        <p>
          The decision this settles: if a small number of your training targets are wrong, and you cannot find them, the
          loss function is where you deal with it. Switching to L1 or Huber costs one line and can move a model more
          than a week of architecture work.
        </p>
      </WhyAiml>

      <Takeaway>
        Differentiable, convex, quadratic, and the maximum likelihood fit under Gaussian noise. The third property is
        why one bad label can move the whole line.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  surface: (
    <>
      <Para>
        The slide draws the loss twice: on the left, the data with a vertical bar at each point showing what the line
        got wrong; on the right, the same information as a curve — how the error changes as the slope parameter changes.
        The caption underneath says{' '}
        <em>the sum of all squared vertical errors (left) creates the parabolic error surface (right)</em>.
      </Para>
      <Para>
        And then the sentence this session leans on for the rest of its length:{' '}
        <strong>the error surface is convex with a single global minimum</strong>.
      </Para>

      <Lab>
        <SurfaceLab />
      </Lab>

      <Para>
        The lab shows both pictures at once. Move the marker on the left plot and the line on the right follows: every
        pair of weights is one point of the surface, and the shade there is the loss. There is exactly one darkest
        point, and the read-out gives it as w = (0.6667, 1.5) — which is 2/3 and 3/2 exactly, computed from the normal
        equations rather than looked up.
      </Para>

      <Terms
        items={[
          {
            term: 'error surface',
            def: 'The loss drawn as a height over the space of weights. One dimension per parameter, so with two weights it is a surface you can picture and with a million it is not.',
          },
          {
            term: 'global minimum',
            def: 'The lowest point anywhere, as opposed to a local minimum, which is only the lowest point nearby. Convexity means the two coincide.',
          },
          {
            term: 'parabolic',
            def: 'Shaped like x². What squaring the error produces, and the reason the surface is a bowl and not something worse.',
          },
          {
            term: 'contour',
            def: 'A line of constant height. The bands in the lab are contours, and their shape — round or stretched — is what decides how well gradient descent behaves.',
          },
        ]}
      />

      <Beyond>
        Convexity is a promise that only holds for this model. J(w) = (1/2N)‖Xw − y‖² is quadratic in w, so the surface
        is a bowl and any downhill route finds the bottom. Put a non-linear activation between two layers and it stops
        being convex immediately: the surface acquires many local minima, saddle points and flat regions, and no
        algorithm can promise to find the best one. Everything module 4 does about optimisation is a response to losing
        this property.
      </Beyond>

      <WhyAiml method="why deep learning talks about “a good minimum”, not “the minimum”">
        <p className="mb-2">
          Read a deep learning paper and nobody claims to have found the global minimum, because nobody can. The loss
          surface of a real network has enormous numbers of local minima, and the practical finding — surprising when it
          was established — is that most of them are about equally good, so where you land matters less than it might.
        </p>
        <p>
          That is worth knowing precisely because this session promises otherwise. The guarantee on this slide is real
          and it is local to linear models. Quoting it about a neural network is a mistake, and knowing exactly where it
          stops applying is the useful part.
        </p>
      </WhyAiml>

      <Takeaway>
        Every choice of weights is a point on a bowl, and the bowl has exactly one bottom. That guarantee is a property
        of linear models with squared error, and it does not survive a hidden layer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  gd: (
    <>
      <Para>
        The idea is one line: <strong>iteratively update the weights in the direction of steepest descent</strong>. The
        slide draws a bowl, an initial weight partway up the side, an arrow labelled <em>gradient</em>, and the global
        cost minimum at the bottom.
      </Para>
      <Para>
        The intuition the deck gives is <em>move downhill on the error surface to find the minimum</em>, with η {'>'} 0
        the learning rate, or step size.
      </Para>

      <Lab>
        <GdIdeaLab />
      </Lab>

      <Para>
        The dashed red line in the lab is the tangent — the slope at the marker — and it is the only information a step
        ever uses. Not where the minimum is, not what the surface looks like elsewhere. Just: which way is down, right
        here, and how steep.
      </Para>

      <Terms
        items={[
          {
            term: 'gradient',
            def: 'The slope. With one parameter it is a number; with several it is one number per parameter, collected into a vector that points in the steepest uphill direction.',
          },
          {
            term: 'steepest descent',
            def: 'The direction the surface falls away fastest, which is exactly the opposite of the gradient. That is where the minus sign in the update comes from.',
          },
          {
            term: 'η',
            say: 'eta',
            def: 'The learning rate, or step size. Strictly positive. Nothing in the algorithm chooses it for you.',
          },
          {
            term: 'iteratively',
            def: 'By repeating a step, each time from where the last one landed. The opposite of a closed form, where you compute the answer in one go.',
          },
        ]}
      />

      <Beyond>
        Gradient descent is not the only way to solve this problem, and for a linear model it is not even the best one.
        The <strong>normal equations</strong> give the answer exactly, in one step, with no learning rate to choose: w*
        = (XᵀX)⁻¹Xᵀy. For the deck’s three houses that gives w = (2/3, 3/2) directly, which the surface lab shows. The
        reason nobody uses it in deep learning is cost — inverting a matrix costs about d³ operations, which is fine at
        d = 10 and impossible at d = 100 000 — and the reason this deck teaches descent instead is that descent is what
        module 3 will need.
      </Beyond>

      <WhyAiml method="torch.optim, and every optimiser in it">
        <p className="mb-2">
          Every entry in <code>torch.optim</code> is this picture with modifications. SGD is exactly it. Momentum adds a
          running average of past steps so the marker keeps rolling through small dips. Adam keeps a separate step size
          per parameter. RMSprop divides by a running estimate of the gradient’s size.
        </p>
        <p>
          They share one interface because they share this idea: read the slope where you are, and move against it. If
          you can say what the tangent line in the lab is for, you can read the documentation for all of them.
        </p>
      </WhyAiml>

      <Takeaway>
        Read the slope where you stand, step against it, repeat. The step size is yours to choose, and the algorithm
        never looks further than its own feet.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  batch: (
    <>
      <Para>
        The deck writes the whole thing out as Algorithm 1, in nine numbered lines. It is worth stepping through rather
        than reading, because each line is doing exactly one thing.
      </Para>
      <Worked title="Algorithm 1 — gradient descent for linear regression">
        {`Input:   dataset D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}ᴺᵢ₌₁ ,  learning rate η ,
         tolerance ε
Output:  learned weights w

 1  Initialise w⁽⁰⁾ = 0  (or random)
 2  t ← 0
 3  while not converged do
 4      compute gradient  ∇J(w⁽ᵗ⁾) = (1/N) Xᵀ(Xw⁽ᵗ⁾ − y)
 5      update weights    w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η ∇J(w⁽ᵗ⁾)
 6      if ‖∇J(w⁽ᵗ⁺¹⁾)‖ < ε then
 7          break            // converged
 8      t ← t + 1
 9  return w⁽ᵗ⁺¹⁾`}
      </Worked>

      <Lab>
        <BatchAlgoLab />
      </Lab>

      <Para>
        Line 4 is where the word <strong>batch</strong> comes from: the gradient is computed over the entire dataset
        before a single step is taken. That makes each step exact and expensive — on a million rows, one step reads a
        million rows.
      </Para>
      <Para>
        Line 1 says zero <em>or random</em>, and for this model zero is genuinely fine. There is one unit, so there is
        no symmetry between units to break. A network with a layer of units cannot do this, as session 2 noted.
      </Para>

      <Terms
        items={[
          {
            term: 'batch gradient descent',
            def: 'Using every training example to compute each step. The alternatives are stochastic — one example per step — and mini-batch, which is a chunk.',
          },
          {
            term: 'ε',
            say: 'epsilon',
            def: 'The tolerance: how small the gradient has to get before you call it converged. The deck suggests 10⁻⁴ later.',
          },
          {
            term: 'w⁽ᵗ⁾',
            say: 'w at time t',
            def: 'The weights after t iterations. The superscript in brackets is an iteration counter, not a power.',
          },
          {
            term: 'tolerance',
            def: 'How close is close enough. Needed because gradient descent approaches the minimum without ever exactly arriving.',
          },
          {
            term: '‖∇J‖',
            def: 'The length of the gradient vector. One number saying how steep the surface is, however many parameters there are.',
          },
        ]}
      />

      <Beyond>
        Batch is the version to learn and almost never the version used. Reading the whole dataset per step is
        impossible on modern data, so practice uses <strong>mini-batch</strong>: shuffle, take 32 or 256 rows, step,
        take the next chunk. Each gradient is then a noisy estimate of the true one, which turns out to help as well as
        hurt — the noise can shake the search out of poor regions. The ML course’s batch, mini-batch and online
        distinction is exactly this choice.
      </Beyond>

      <WhyAiml method="the five-line PyTorch loop, and where each of these lines went">
        <p className="mb-2">
          Lines 4 and 5 are <code>loss.backward()</code> and <code>optimizer.step()</code>. Line 3 is your{' '}
          <code>for epoch in range(...)</code>. Line 1 happens when you construct the module. And{' '}
          <code>optimizer.zero_grad()</code>, which has no line here, exists because PyTorch accumulates gradients
          rather than replacing them — forgetting it is the most common bug in a first training script.
        </p>
        <p>
          Line 6 is the one usually left out in practice, replaced by a fixed number of epochs and a look at the loss
          curve. Knowing it was meant to be there is what makes “why is my model still training?” a question with an
          answer.
        </p>
      </WhyAiml>

      <Takeaway>
        Initialise, loop: gradient over the whole dataset, step against it, stop when the gradient is small. Batch means
        every example contributes to every step.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  gradient: (
    <>
      <Para>The gradient is where the calculus happens, and the deck gives it in both forms.</Para>
      <Worked title="Slide 22">
        {`As a sum over examples:

                 ∂J        1    N
   ∇J(w)  =     ────   =  ───   Σ   ( wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾ ) x⁽ⁱ⁾           (9)
                 ∂w        N   i=1

In matrix form:

                  1
   ∇J(w)  =      ───  Xᵀ ( Xw − y )                                 (10)
                  N

   Xᵀ ∈ ℝ⁽ᵈ⁺¹⁾ˣᴺ ,  Xw − y ∈ ℝᴺ ,  so  ∇J ∈ ℝᵈ⁺¹`}
      </Worked>
      <Para>
        Equation (9) is worth reading in words, because it says something you can remember:{' '}
        <strong>each example contributes its own error, multiplied by its own input</strong>. An example the model got
        badly wrong contributes a lot; an example it got right contributes nothing; and the contribution is pushed into
        the weights of the features that were large for that example.
      </Para>
      <Para>
        Equation (10) is the same thing arranged so a computer can do it in one call. And the shape line at the bottom
        is the check worth doing every time: (d + 1) × N times N × 1 gives (d + 1) × 1, which is one number per
        parameter — which is what a gradient has to be.
      </Para>

      <Lab>
        <GradientLab />
      </Lab>

      <Para>
        The lab computes both forms and compares them. They agree to the last digit, as they must — the matrix product
        <em> is</em> the sum, written differently.
      </Para>

      <Terms
        items={[
          {
            term: '∇',
            say: 'nabla, or “grad”',
            def: 'The gradient operator. ∇J means "the vector of partial derivatives of J, one per parameter".',
          },
          {
            term: '∂J/∂w',
            say: 'partial dee J by dee w',
            def: 'The partial derivative: how J changes when w changes and everything else is held still. The curly ∂ rather than d marks that other variables exist.',
          },
          {
            term: 'Xᵀ',
            say: 'X transpose',
            def: 'The design matrix with rows and columns swapped. It appears here so the shapes work: you need the features arranged one row per feature to weight them by the errors.',
          },
          {
            term: 'Xw − y',
            def: 'The error vector, one entry per example. Note the order: prediction minus target, so a prediction that is too high gives a positive error.',
          },
        ]}
      />

      <Beyond>
        Where equation (9) comes from, in three lines, since the deck states it without deriving it. Take one term of J:
        ℓ = ½(wᵀx − y)². Differentiate the outside: the ½ and the square cancel, leaving (wᵀx − y). Differentiate the
        inside with respect to w: wᵀx is a linear combination of the entries of w, so its derivative is x. Multiply —
        the chain rule — and one example contributes (wᵀx − y)x. Average over the examples and you have equation (9).
        This is the only piece of calculus in the whole session.
      </Beyond>

      <WhyAiml method="loss.backward() computes exactly this, and autograd checks it for you">
        <p className="mb-2">
          For a linear model you can write the gradient by hand, and for a twenty-layer network you cannot — which is
          why every framework computes it for you by walking the computational graph backwards. Equation (10) is what
          <code> backward()</code> produces for this model, and you can verify that with{' '}
          <code>torch.autograd.gradcheck</code>.
        </p>
        <p>
          The habit worth taking from this slide is checking the <strong>shape</strong> of a gradient against the shape
          of the parameter it belongs to. They must match exactly — one number per parameter — and a shape mismatch is
          the fastest way to catch a wrong transpose before it becomes a silently wrong model.
        </p>
      </WhyAiml>

      <Takeaway>
        Each example contributes its error times its input; average over the dataset. As a matrix, ∇J = (1/N)Xᵀ(Xw − y),
        and its shape must match w.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  update: (
    <>
      <Para>Putting the gradient into the step gives the rule the whole session has been building towards.</Para>
      <Worked title="The update, slide 23">
        {`                            η
   w⁽ᵗ⁺¹⁾  =  w⁽ᵗ⁾  −  ───  Xᵀ ( X w⁽ᵗ⁾ − y )                      (11)
                            N

Key parameters:

   Learning rate η — controls the step size
        too large:  may overshoot the minimum
        too small:  slow convergence

   Stopping criterion — ‖∇J(w)‖ < ε, or a maximum number of
        iterations`}
      </Worked>
      <Para>
        Every parameter moves at once, each against its own slope, scaled by the same η. The minus sign is doing the
        work: the gradient points uphill, so subtracting it goes down.
      </Para>

      <Lab>
        <UpdateEtaLab />
      </Lab>

      <Para>
        The deck says “too large may overshoot” without saying how large is too large. For this problem it can be worked
        out exactly, and the lab does: descent converges when η is below 2 divided by the largest eigenvalue of XᵀX/N,
        which comes to about <strong>0.361</strong> here. Set η either side of that and watch the path change from
        spiralling in to bouncing out.
      </Para>
      <Para>
        Slide 24 draws the same thing at three zoom levels — one parameter, two parameters as contours, and the full 3-D
        surface — and notes that <strong>each step moves perpendicular to the contour lines toward the minimum</strong>.
        That perpendicularity is a fact about gradients, and it is why the path zig-zags when the contours are
        stretched.
      </Para>

      <Terms
        items={[
          {
            term: 'overshoot',
            def: 'Step past the minimum and land further up the other side. If each overshoot is larger than the last, the run diverges.',
          },
          {
            term: 'stopping criterion',
            def: 'The rule that ends training. A small gradient, a small change in loss, a fixed iteration count, or a rising validation loss — the deck lists all four later.',
          },
          {
            term: 'perpendicular to the contours',
            def: 'At right angles to the lines of constant loss. The gradient always is, which is what makes it the steepest direction.',
          },
          {
            term: 'zig-zag',
            def: 'What descent does on a stretched bowl: it keeps stepping across the narrow valley rather than along it. The reason feature scaling matters.',
          },
        ]}
      />

      <Beyond>
        “Too small: slow convergence” understates the problem in one useful way. A learning rate that is too small does
        not fail visibly — it produces a loss curve that goes down, slowly, forever, and looks exactly like a model that
        needs more training. The lab’s <strong>× 0.005</strong> setting is that case: nothing is wrong, and after 200
        iterations you are nowhere. Distinguishing “needs longer” from “needs a bigger step” is what the debugging
        checklist at the end of this deck is for.
      </Beyond>

      <WhyAiml method="lr schedules — ReduceLROnPlateau and cosine annealing">
        <p className="mb-2">
          One fixed η has to be small enough for the steepest part of the surface and is then too small for the rest,
          which is why nobody uses one. A schedule starts large and shrinks: <code>StepLR</code> divides it every so
          many epochs, <code>ReduceLROnPlateau</code> waits until the loss stops improving, and cosine annealing eases
          it down a curve.
        </p>
        <p>
          All of them are answers to the tension on this slide, and all of them are available because the deck’s single
          η is a simplification rather than a requirement. Module 4 is largely this, made systematic.
        </p>
      </WhyAiml>

      <Takeaway>
        w ← w − (η/N)Xᵀ(Xw − y). Too large diverges, too small crawls, and for this data the boundary is at about η =
        0.361 — computed, not quoted.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  example: (
    <>
      <Para>
        The deck now works one full iteration by hand, over five slides, on a dataset small enough to check. This is the
        single most likely thing on the deck to appear in an exam.
      </Para>
      <Worked title="The setup, slide 26">
        {`Tiny dataset: predict house price from size

     Size (x₁)   Price (y)
        1            2
        2            4
        3            5

        ⎡ 1  1 ⎤          ⎡ 2 ⎤          ⎡ w₀ ⎤
   X =  ⎢ 1  2 ⎥ ∈ ℝ³ˣ²   y = ⎢ 4 ⎥ ∈ ℝ³   w = ⎢    ⎥ ∈ ℝ²
        ⎣ 1  3 ⎦          ⎣ 5 ⎦          ⎣ w₁ ⎦

Hyperparameters:  η = 0.1,  N = 3
Initial weights:  w⁽⁰⁾ = [0, 0]ᵀ`}
      </Worked>

      <Lab>
        <WorkedExampleLab />
      </Lab>

      <Worked title="One iteration, in full">
        {`1  Predictions from w⁽⁰⁾ = [0, 0]ᵀ

     ŷ⁽⁰⁾ = X w⁽⁰⁾ = [0, 0, 0]ᵀ

2  Initial loss

     J(w⁽⁰⁾) = (1/2N) ‖Xw − y‖²
             = (1/6) ( 2² + 4² + 5² )
             = (1/6) ( 4 + 16 + 25 )
             = 45/6  =  7.5

3  Error vector

     e⁽⁰⁾ = ŷ⁽⁰⁾ − y = [0−2, 0−4, 0−5]ᵀ = [−2, −4, −5]ᵀ

4  Gradient

     ∇J(w⁽⁰⁾) = (1/N) Xᵀ e⁽⁰⁾

               1  ⎡ 1  1  1 ⎤ ⎡ −2 ⎤     1  ⎡ −2 −4 −5     ⎤
             = ─  ⎢         ⎥ ⎢ −4 ⎥  =  ─  ⎢              ⎥
               3  ⎣ 1  2  3 ⎦ ⎣ −5 ⎦     3  ⎣ −2 −8 −15    ⎦

               1  ⎡ −11 ⎤     ⎡ −3.67 ⎤
             = ─  ⎢     ⎥  =  ⎢       ⎥
               3  ⎣ −25 ⎦     ⎣ −8.33 ⎦

5  Weight update

     w⁽¹⁾ = w⁽⁰⁾ − η ∇J(w⁽⁰⁾)
          = [0, 0]ᵀ − 0.1 [−3.67, −8.33]ᵀ
          = [0.367, 0.833]ᵀ

     ŷ⁽¹⁾ = X w⁽¹⁾ = [1.20, 2.03, 2.87]ᵀ

6  New loss

     e⁽¹⁾ = [1.20−2, 2.03−4, 2.87−5]ᵀ = [−0.80, −1.97, −2.13]ᵀ

     J(w⁽¹⁾) = (1/6)( 0.64 + 3.88 + 4.54 ) ≈ 1.51

     7.5 → 1.51 : an 80% reduction in one iteration.`}
      </Worked>
      <Para>
        Every number in the lab is computed from X, y and η by the same functions the rest of this chapter uses, so what
        it prints is what the formulas give. Both of the deck’s printed losses come out: 7.5 and 1.51.
      </Para>

      <Terms
        items={[
          {
            term: 'hyperparameter',
            def: 'A number you choose before training and the algorithm never changes. η and N are the two here — though N is really a fact about the data rather than a choice.',
          },
          {
            term: 'w⁽⁰⁾, w⁽¹⁾',
            def: 'The weights before and after one iteration. Bracketed superscripts count iterations throughout this deck.',
          },
          {
            term: 'iteration',
            def: 'One pass of lines 4 to 8 of the algorithm. For batch gradient descent one iteration reads every example once, so it is also one epoch.',
          },
        ]}
      />

      <Beyond>
        The deck stops after one iteration, and it is worth knowing where this run is going. The exact answer from the
        normal equations is w* = (2/3, 3/2), with a loss of 1/36 ≈ 0.0278. So after one iteration the loss has fallen
        80% but the weights, at (0.367, 0.833), are barely half way to (0.667, 1.5). That gap is normal and worth
        remembering: <em>loss falls fast at the start and the parameters keep moving long afterwards</em>, because the
        surface is steep far from the minimum and flat near it.
      </Beyond>

      <WhyAiml method="doing one step by hand before trusting a framework">
        <p className="mb-2">
          This exercise is the standard way to check an implementation. Take three rows, run one step by hand, run one
          step in your code, and compare. If they differ you have found a bug in minutes rather than after a week of bad
          models — and the usual culprits are a missing 1/N, a wrong transpose, or a plus where the minus should be.
        </p>
        <p>
          It is also how you check that you have understood a paper’s equations. Numbers do not let you get away with
          approximate understanding the way prose does.
        </p>
      </WhyAiml>

      <Takeaway>
        Three houses, w = 0, η = 0.1. Gradient (−3.67, −8.33), new weights (0.367, 0.833), loss 7.5 → 1.51. The exact
        answer is still (2/3, 3/2), a long way further on.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  graph: (
    <>
      <Para>
        Slide 31 draws one iteration as a graph. Boxes for the parameters, the input data and the targets; circles for
        the operations; and two kinds of arrow — solid going forwards to the loss, dashed coming back to the weights.
      </Para>

      <Lab>
        <CompGraphLab />
      </Lab>

      <Para>
        Reading it forwards: w and X meet at a multiply to give ŷ; ŷ and y meet at a subtract to give e; e is squared
        and summed to give J.
      </Para>
      <Para>
        Reading it backwards: e comes back through Xᵀ, scaled by 1/N, to give ∇J; ∇J is multiplied by −η and added to w
        to give the new w. The dashed arrows are not a different calculation — they are the chain rule applied to the
        same graph in reverse.
      </Para>

      <Terms
        items={[
          {
            term: 'computational graph',
            def: 'A picture of a calculation, with operations as nodes and values flowing along the edges. Every deep learning framework builds one internally.',
          },
          {
            term: 'forward pass',
            def: 'Following the solid arrows: data and parameters in, loss out.',
          },
          {
            term: 'backward pass',
            def: 'Following the dashed arrows: the loss’s sensitivity to each parameter, worked out by applying the chain rule from the loss back towards the inputs.',
          },
          {
            term: 'autograd',
            def: 'Automatic differentiation — the machinery that records the forward pass and replays it backwards to get gradients. What torch.autograd is named after.',
          },
        ]}
      />

      <Beyond>
        This one graph is the whole of backpropagation in miniature. Module 3 has more boxes — one multiply and one
        activation per layer — and the algorithm is the same: build the graph forwards, then walk it backwards applying
        the chain rule at each node. Nothing conceptually new is added. If you can say why Xᵀ appears on the backward
        arrow of a multiply by X, you have the idea that backpropagation generalises.
      </Beyond>

      <WhyAiml method="requires_grad, and the graph PyTorch builds without telling you">
        <p className="mb-2">
          Every tensor with <code>requires_grad=True</code> makes PyTorch record the operations applied to it, building
          exactly this graph as your forward pass runs. <code>loss.backward()</code> then walks it in reverse. That is
          why the graph is rebuilt on every iteration, and why <code>torch.no_grad()</code> around evaluation code makes
          it faster — there is no backward pass coming, so there is no point recording anything.
        </p>
        <p>
          It also explains a memory error people meet early. The graph holds on to every intermediate value it will need
          for the backward pass, so a long forward pass over a big batch can run out of memory before it ever reaches
          the loss. Knowing the graph exists is what makes that error legible.
        </p>
      </WhyAiml>

      <Takeaway>
        Forwards to the loss along the solid arrows, backwards to the gradient along the dashed ones. That is
        backpropagation, on a model with one layer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  traintest: (
    <>
      <Para>
        The key principle, in the deck’s words: <strong>evaluate on unseen data</strong>.
      </Para>
      <Worked title="The split and the two errors, slide 33">
        {`Training set   used to learn the weights w    (typically 90–99%)
Test set       used to evaluate generalisation  (typically 1–10%)

                     1
   J_train  =  ────────────  Σ  ( ŷ⁽ⁱ⁾ − y⁽ⁱ⁾ )²
                 N_train    i ∈ train

                     1
   J_test   =  ────────────  Σ  ( ŷ⁽ⁱ⁾ − y⁽ⁱ⁾ )²
                 N_test     i ∈ test

Goal: minimise the test error — generalisation performance.`}
      </Worked>
      <Para>
        The two formulas are identical. The only difference is which rows they are summed over, and that difference is
        the whole of model evaluation.
      </Para>

      <Lab>
        <TrainTestLab />
      </Lab>

      <Para>
        Turn the degree up with a small training share and watch the two numbers separate: training error falls towards
        zero while test error climbs. That is overfitting, from session 1, now with both numbers on screen at once.
      </Para>

      <Terms
        items={[
          {
            term: 'generalisation',
            def: 'Doing well on data the model was not trained on. The only thing anyone actually wants; training error is a means to it.',
          },
          {
            term: 'training set',
            def: 'The rows the weights are fitted to. The model sees these many times.',
          },
          {
            term: 'test set',
            def: 'Rows held back and looked at once, at the end. Looking at them repeatedly and tuning against them turns them into a training set by the back door.',
          },
          {
            term: 'validation set',
            def: 'A third split, not on this slide, used for choosing hyperparameters so the test set stays untouched. Standard practice, and worth mentioning in an exam answer.',
          },
        ]}
      />

      <Beyond>
        The deck’s suggested split of 90–99% training is unusually aggressive, and it is right for the situation it has
        in mind: a small dataset, where every row you hold back is a row you cannot learn from. With a million rows the
        usual split is nearer 80/10/10, because 10% of a million is already plenty to measure with. The principle is
        that the test set needs to be big enough for its number to be stable, and no bigger.
      </Beyond>

      <WhyAiml method="train_test_split, and the leak that ruins it">
        <p className="mb-2">
          One line does the split — and the discipline it enforces is the whole point. The classic mistake is to
          standardise the features using statistics computed over <em>all</em> the data before splitting, which lets the
          test rows influence the scaling and quietly inflates the score. Fit the scaler on the training rows only, then
          apply it to the test rows.
        </p>
        <p>
          Any number you have optimised against is no longer an estimate of generalisation. That is why a validation set
          exists, and why the test set should be looked at once — a rule that is easy to state and constantly broken.
        </p>
      </WhyAiml>

      <Takeaway>
        Same formula, different rows. Training error says how well the fit went; test error is the only one that says
        anything about the future.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  metrics: (
    <>
      <Para>Three ways of summarising the same set of errors, and the deck gives all three.</Para>
      <Worked title="Slide 34">
        {`1  Mean Squared Error

                1    N
      MSE  =   ───   Σ   ( ŷ⁽ⁱ⁾ − y⁽ⁱ⁾ )²                      (12)
                N   i=1

2  Root Mean Squared Error

      RMSE  =  √MSE                                            (13)

3  Mean Absolute Error   (less sensitive to outliers than MSE)

                1    N
      MAE  =   ───   Σ   | y⁽ⁱ⁾ − ŷ⁽ⁱ⁾ |                        (14)
                N   i=1`}
      </Worked>
      <Para>
        MSE is the training loss without the ½. RMSE is its square root, which puts the number back into the units of
        the thing being predicted — if you are predicting rupees, RMSE is in rupees and MSE is in rupees squared, which
        is not a quantity anybody can interpret. MAE averages the sizes of the errors without squaring them.
      </Para>

      <Lab>
        <MetricsLab />
      </Lab>

      <Para>
        Drag the last point far from the trend. MSE roughly quadruples while MAE roughly doubles — which is the deck’s
        parenthesis, <em>less sensitive to outliers than MSE</em>, made into something you can watch. The gap between
        RMSE and MAE is itself informative: they are equal when every error is the same size, and RMSE runs ahead when a
        few errors are much larger than the rest.
      </Para>

      <Terms
        items={[
          {
            term: 'MSE',
            def: 'Mean squared error. The training loss, up to the constant ½. Its units are the target’s units squared.',
          },
          {
            term: 'RMSE',
            say: 'are-em-ess-ee',
            def: 'Root mean squared error. Back in the target’s own units, which is why it is the one to quote to a person.',
          },
          {
            term: 'MAE',
            def: 'Mean absolute error. The average size of an error, ignoring sign. Also in the target’s units.',
          },
          {
            term: '| · |',
            say: 'the absolute value',
            def: 'Throw away the sign: |−3| = 3. It is what stops positive and negative errors cancelling.',
          },
        ]}
      />

      <Beyond>
        RMSE ≥ MAE always, and the two are equal only when every error has the same size. That is not a coincidence — it
        is one consequence of a general inequality between means, and it makes the pair useful together: a large gap
        says your errors are uneven, so a few cases are being predicted much worse than the rest. Reporting both, and
        looking at the gap, is more informative than either alone.
      </Beyond>

      <WhyAiml method="sklearn.metrics, and choosing what to report">
        <p className="mb-2">
          <code>mean_squared_error</code>, <code>root_mean_squared_error</code> and <code>mean_absolute_error</code> are
          three calls, and picking between them is a decision about what a mistake costs. If being wrong by 10 is twenty
          times worse than being wrong by 5, the squared measure matches your world; if it is twice as bad, MAE does.
        </p>
        <p>
          A practical convention worth adopting: train on MSE because it is smooth and convex, and report RMSE and MAE
          together because they are in units people understand and their gap exposes uneven errors. The loss you
          optimise and the number you report do not have to be the same, and usually should not be.
        </p>
      </WhyAiml>

      <Takeaway>
        MSE for training, RMSE to report because it is in the target’s units, and MAE alongside it because the gap
        between them tells you how uneven your errors are.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  r2: (
    <>
      <Para>
        The last metric is different in kind. MSE, RMSE and MAE are all in units, so their size depends on what you are
        predicting. R² has no units and a fixed meaning.
      </Para>
      <Worked title="R², slide 35">
        {`                    Σᴺᵢ₌₁ ( y⁽ⁱ⁾ − ŷ⁽ⁱ⁾ )²             SS_residual
   R²  =  1  −   ───────────────────────────  =  1 − ─────────────      (15)
                    Σᴺᵢ₌₁ ( y⁽ⁱ⁾ − ȳ )²                 SS_total

   where  ȳ = (1/N) Σ y⁽ⁱ⁾  is the mean.

Interpretation:
   R² = 1     perfect fit — all variance explained
   R² = 0     no better than predicting the mean
   R² < 0     worse than that baseline  (possible on a test set)
   typical    0.7 < R² < 0.9 indicates a good fit`}
      </Worked>
      <Para>
        The top of the fraction is your model’s total squared error. The bottom is the total squared error of the
        laziest possible model: predict the mean of y, every time, ignoring the features entirely. So R² asks{' '}
        <strong>how much of the lazy model’s error did you remove?</strong>
      </Para>

      <Lab>
        <R2Lab />
      </Lab>

      <Para>
        Press <strong>Predict the mean</strong> in the lab: a flat line at ȳ gives exactly R² = 0, because the two sums
        become the same. Press <strong>Worse than useless</strong> and it goes negative — the deck notes that this is
        possible on a test set, and now you can see what it looks like.
      </Para>

      <Terms
        items={[
          {
            term: 'R²',
            say: 'R squared',
            def: 'The coefficient of determination. The proportion of the variance in y that the model accounts for.',
          },
          {
            term: 'ȳ',
            say: 'y bar',
            def: 'The mean of the targets. The bar means "average of" throughout statistics — the same ȳ as in the statistics course.',
          },
          {
            term: 'SS_residual',
            def: 'The sum of squared residuals: how much your model got wrong in total.',
          },
          {
            term: 'SS_total',
            def: 'The total sum of squares: how much the targets vary about their own mean. It has nothing to do with your model, which is what makes it a fair baseline.',
          },
          {
            term: 'variance explained',
            def: 'The share of the spread in y that the model accounts for. A phrase to be careful with — it says nothing about cause.',
          },
        ]}
      />

      <Beyond>
        Two warnings the slide does not give. First, R² never decreases when you add a feature, even a column of random
        numbers — so comparing models of different sizes by R² on the training set always picks the biggest one.
        Adjusted R² exists for exactly this, and the honest alternative is to compare on held-back data. Second, “0.7 to
        0.9 is a good fit” is a rule of thumb about a domain, not a fact: 0.3 is excellent in some social science and
        0.99 is suspicious in physics.
      </Beyond>

      <WhyAiml method="r2_score, and the baseline every model should beat">
        <p className="mb-2">
          <code>sklearn.metrics.r2_score</code> is one call, and its real value is the baseline built into it. Before
          reporting any regression, compute what predicting the mean would score — that is R² = 0 by construction — and
          check you have beaten it. A model that has not is a model with a bug or a problem with no signal, and either
          is worth knowing before you spend a week tuning it.
        </p>
        <p>
          A negative R² on the test set is the specific alarm to recognise. It means the model is worse on new data than
          a constant would be, which almost always means severe overfitting or a mismatch between the training and test
          distributions.
        </p>
      </WhyAiml>

      <Takeaway>
        R² compares your model against predicting the mean. 1 is perfect, 0 is no better than the baseline, and negative
        means worse than doing nothing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  tips: (
    <>
      <Para>Two slides of practical advice, and unusually for a lecture deck all of it is directly usable.</Para>
      <Para>
        <strong>Choosing the learning rate.</strong> Start with η in {'{'}0.001, 0.01, 0.1, 1.0{'}'} and plot loss
        against iterations for each. If the loss increases or becomes NaN, decrease η. If convergence is too slow,
        increase it. Use learning-rate schedules for fine-tuning.
      </Para>
      <Para>
        <strong>When to stop.</strong> Gradient magnitude ‖∇J‖ {'<'} ε, say 10⁻⁴. Or the change in loss between
        iterations below ε. Or a maximum number of iterations, say 1 000 or 10 000. Or the validation loss starting to
        increase — early stopping, for overfitting.
      </Para>
      <Para>
        <strong>Weight initialisation.</strong> Zero works well for linear regression. Avoid large initial values, which
        can cause divergence or overflow.
      </Para>
      <Para>
        <strong>Feature engineering.</strong> Use domain knowledge to create meaningful derived features — price per
        square foot, for instance — and remove irrelevant or redundant ones.
      </Para>
      <Para>
        <strong>Feature scaling.</strong> Features with different scales can slow convergence. Two recipes: min-max
        scaling to [0, 1], and standardisation to zero mean and unit variance.
      </Para>
      <Worked title="The two scalings, slide 40">
        {`Min-max scaling                  Standardisation (z-score)

           xⱼ − min(xⱼ)                        xⱼ − μⱼ
   x′ⱼ = ──────────────           x′ⱼ  =  ─────────────
         max(xⱼ) − min(xⱼ)                     σⱼ

   result lies in [0, 1]           mean 0, standard deviation 1`}
      </Worked>

      <Lab>
        <ScalingLab />
      </Lab>

      <Para>
        The lab makes the scaling point concrete on the deck’s own three houses. Multiply the size column by 100 —
        metres to centimetres, changing nothing about the problem — and the number of iterations needed goes up by
        orders of magnitude. Switch to standardised features and it comes straight back down.
      </Para>

      <Terms
        items={[
          {
            term: 'min-max scaling',
            def: 'Squash each feature into [0, 1] using its own smallest and largest values. Simple, and sensitive to a single extreme value which sets the range for everything else.',
          },
          {
            term: 'standardisation',
            def: 'Subtract the mean and divide by the standard deviation, so each feature has mean 0 and spread 1. Exactly the z-score from the statistics course.',
          },
          {
            term: 'μⱼ, σⱼ',
            say: 'mu and sigma',
            def: 'The mean and standard deviation of feature j, computed over the training rows only.',
          },
          {
            term: 'condition number',
            def: 'How stretched the loss bowl is — the ratio of its widest to its narrowest direction. Not named on the slide, and it is the quantity scaling actually improves.',
          },
          {
            term: 'early stopping',
            def: 'Halting when the validation loss starts to rise rather than when training converges. A regulariser disguised as a stopping rule.',
          },
        ]}
      />

      <Beyond>
        Why scaling helps, in one sentence: gradient descent takes the same step size in every direction, so a bowl
        stretched a hundred times more in one direction than another forces a learning rate small enough for the steep
        direction, and the shallow one then takes a hundred times as many steps. The lab prints the condition number —
        the stretch factor — beside the iteration count, so you can watch the two move together.
      </Beyond>

      <WhyAiml method="StandardScaler inside a Pipeline">
        <p className="mb-2">
          The reason to use <code>Pipeline([(“scale”, StandardScaler()), (“model”, …)])</code> rather than scaling by
          hand is that it fits the scaler on the training fold only and applies it to the test fold — which is the leak
          from the previous page, closed automatically. Scaling by hand across the whole dataset is one of the commonest
          silent mistakes in applied machine learning.
        </p>
        <p>
          In deep learning the same problem reappears inside the network, where each layer’s inputs are the previous
          layer’s outputs and can drift to any scale as training proceeds. Batch normalisation is the answer, and it is
          this slide applied per layer rather than once at the start.
        </p>
      </WhyAiml>

      <Takeaway>
        Try η across orders of magnitude and plot the curves. Stop on a small gradient, a small change, an iteration
        cap, or a rising validation loss. And scale the features — it changes nothing about the answer and everything
        about how long it takes.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  debug: (
    <>
      <Para>
        One slide of symptoms and causes, and it is worth memorising because these four cover most of what goes wrong.
      </Para>
      <Worked title="The checklist, slide 41">
        {`Loss is NaN or Inf
    causes    learning rate too large
              numerical overflow — check feature scales
    solution  decrease η, scale features

Loss oscillating
    causes    learning rate too large
    solution  decrease η, or use learning-rate decay

Loss not decreasing
    causes    learning rate too small
              bug in the gradient computation — check signs
              wrong sign in the update rule (should be minus)
    solution  increase η, verify code

Training works but test error high
    causes    overfitting — too many features relative to data
    solution  regularisation, more data, or a simpler model`}
      </Worked>

      <Lab>
        <DebugLab />
      </Lab>

      <Para>
        Each symptom in the lab is produced by actually running the deck’s own example with a setting that breaks it,
        not by drawing a picture of what it would look like. The first three are all the learning rate at three
        distances from the edge: above about 0.361 this problem diverges to NaN, just below it the loss bounces on the
        way in, and far below it the curve crawls.
      </Para>
      <Para>
        Only the fourth has nothing to do with η — and it is the only one you cannot see on a training curve at all,
        which is exactly why the previous pages insisted on a held-back set.
      </Para>

      <Terms
        items={[
          {
            term: 'NaN',
            say: 'nan',
            def: 'Not a Number — what floating-point arithmetic produces from an invalid operation like infinity minus infinity. Once one appears it spreads through every subsequent calculation.',
          },
          {
            term: 'Inf',
            def: 'Infinity: a number too large to represent. Usually the step before NaN in a diverging run.',
          },
          {
            term: 'oscillating',
            def: 'Bouncing up and down rather than settling. The step overshoots and comes back, repeatedly, without getting far enough out to diverge.',
          },
          {
            term: 'learning-rate decay',
            def: 'Shrinking η as training proceeds — large steps early, careful steps later. It fixes oscillation without making the early stages slow.',
          },
          {
            term: 'regularisation',
            def: 'Anything that discourages a model from fitting the training data too exactly. Weight decay, dropout and early stopping are the standard three; module 4 is about them.',
          },
        ]}
      />

      <Beyond>
        There is a fifth symptom the slide omits and you will meet:{' '}
        <strong>the loss falls and then flattens well above zero</strong>, with training and test error both mediocre.
        That is underfitting, and it is the opposite prescription — the model is too simple, so add features or
        capacity. Reading the two errors together is what separates it from overfitting: both bad means underfitting,
        training good and test bad means overfitting.
      </Beyond>

      <WhyAiml method="the order to check things in">
        <p className="mb-2">
          The checklist implies a diagnostic order that is worth making explicit. First look at the training loss alone:
          NaN, oscillating or flat all point at the optimiser and the scaling, and none of them is a modelling problem.
          Only once the training loss is falling smoothly does the gap to the test loss mean anything.
        </p>
        <p>
          Reaching for regularisation while the training loss is still bad is the classic wasted week — you are treating
          overfitting in a model that has not fitted anything yet. Get the training loss down first, then worry about
          the gap.
        </p>
      </WhyAiml>

      <Takeaway>
        NaN, oscillating and flat are all the learning rate. A gap between training and test error is the only one that
        is a modelling problem — and the only one a training curve cannot show you.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 21 */
  summary: (
    <>
      <Para>
        The deck closes with the four components drawn as a loop, and a sentence that is the reason this module exists:{' '}
        <strong>this framework extends to more complex models — neural networks, deep learning.</strong>
      </Para>
      <Worked title="The loop, slide 43">
        {`  1. Data & initialisation  ──forward──▶  2. Model
        D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}                    x → Σ → ŷ
        w⁽⁰⁾ = 0                          linear activation
             ▲                                    │
             │ iterate                            │ compute
             │                                    ▼
  4. Learning  ◀──gradient──   3. Objective
     w⁽ᵗ⁾ → w⁽ᵗ⁺¹⁾                J(w), the MSE loss
     via −η∇J                     with its single minimum`}
      </Worked>

      <Lab>
        <LoopLab />
      </Lab>

      <Para>And the key takeaways, which are a fair summary of the whole session:</Para>
      <List
        items={[
          <>Regression predicts continuous outputs from input features.</>,
          <>Linear regression assumes a linear relationship: y = wᵀx + w₀.</>,
          <>A single neuron with identity activation implements linear regression.</>,
          <>Squared error loss provides a convex objective function.</>,
          <>Gradient descent iteratively optimises the weights: w ← w − η∇J.</>,
          <>Feature scaling is critical for fast convergence.</>,
          <>Evaluation on a test set ensures generalisation.</>,
        ]}
      />

      <Beyond>
        What actually changes in module 3, so you know what to expect. The <strong>model</strong> box grows: several
        layers, each a matrix multiply followed by a non-linear activation. Because of that non-linearity the{' '}
        <strong>objective</strong> stops being convex, so the single-minimum guarantee is lost. And the{' '}
        <strong>gradient</strong> can no longer be written in one line, so it is computed by backpropagation — the
        computational graph from part 15, walked backwards through many layers instead of one. The data box and the loop
        itself do not change at all.
      </Beyond>

      <WhyAiml method="the loop you will write in every lab from here on">
        <p className="mb-2">
          Lab L2 of this course is “deep neural network with back-propagation and optimization”, and it is this loop
          with a bigger model box. The code you write for it will have the same four objects — a loader, a model, a
          criterion and an optimiser — arranged in the same order, and the same five lines inside the loop.
        </p>
        <p>
          That is the payoff for spending a whole session on a model with two parameters. Everything you can debug here
          — a learning rate that is too large, a feature that needs scaling, a test error that will not come down — is a
          thing you will debug again on a model you cannot picture. The two-parameter version is the one where you can
          still see what went wrong.
        </p>
      </WhyAiml>

      <Takeaway>
        Data, model, objective, learning, round and round. Module 3 makes the model box bigger and the gradient harder;
        the loop stays exactly as it is.
      </Takeaway>
    </>
  ),
}
