/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  BceLab,
  BoundaryLab,
  ClassDataLab,
  ComponentsLab,
  LogisticNeuronLab,
  SigmoidLab,
  TaskKindLab,
  WhyCeLab,
  WhyNotLinearLab,
} from '@/components/charts/dl4-lab'
import {
  CatCeLab,
  CompareLab,
  DebugLab,
  InferenceLab,
  MbGradLab,
  McMetricsLab,
  McWorkedLab,
  MiniBatchLab,
  MultiClassLab,
  OneHotLab,
  SoftmaxLab,
  StabilityLab,
  WeightMatrixLab,
} from '@/components/charts/dl4-multi-lab'
import {
  CompGraphLab,
  ConfusionLab,
  GradLab,
  MetricsLab,
  SgdAlgoLab,
  SgdVsBatchLab,
  WorkedBinaryLab,
} from '@/components/charts/dl4-train-lab'
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

/** Where the deck and its own arithmetic disagree. Named, never quietly fixed. */
function Caution({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-amber-600/30 bg-amber-50/70 px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-amber-800 uppercase">
        Careful — the slide and its own numbers disagree
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-800">{children}</div>
    </div>
  )
}

export const DL4_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  whatis: (
    <>
      <Para>
        Module 4 is <strong>linear neural networks for classification</strong>, and it opens by saying what
        classification is. Everything else in the session is a consequence of this one change from session 3: the answer
        is now a name, not a number.
      </Para>
      <Worked title="The definition, slide 4">
        {`Classification is a supervised learning task that predicts a
discrete category or class label based on input features.

  Input   a feature vector  x ∈ ℝᵈ
  Output  a class label  y ∈ {1, 2, …, K}   (discrete)
  Goal    learn  f : ℝᵈ → {1, 2, …, K}`}
      </Worked>
      <Para>
        Compare that with session 3 and only the right-hand side has moved. The input is still a list of d numbers. The
        word <strong>supervised</strong> still means every training example arrives with its answer attached. What has
        changed is the arrow’s destination: instead of landing anywhere on the real line, it lands on one of K names.
      </Para>
      <Para>
        That difference is not cosmetic. There are no meaningful in-betweens between two class labels. If the classes
        are cat, dog and car, there is no answer half way between cat and dog, and no sense in which car is “more than”
        cat. Every design decision later in this session comes back to that.
      </Para>

      <Lab>
        <TaskKindLab />
      </Lab>

      <Para>Slide 5 gives four problems, and each is worth reading for its input as much as its output:</Para>
      <List
        items={[
          <>
            <strong>Email spam detection</strong> — email text, sender information and attachments in; spam or not spam
            out.
          </>,
          <>
            <strong>Medical diagnosis</strong> — symptoms, test results and history in; disease present or absent out.
          </>,
          <>
            <strong>Image recognition</strong> — the pixel values of an image in; an object category out.
          </>,
          <>
            <strong>Sentiment analysis</strong> — a customer review in; positive, negative or neutral out.
          </>,
        ]}
      />
      <Para>
        Slide 6 then sorts every classification problem into three shapes, by how many labels one example may carry:
      </Para>
      <List
        items={[
          <>
            <strong>Binary</strong> — two classes, y ∈ {'{'}0, 1{'}'} or {'{'}−1, +1{'}'}. Spam, fraud, diagnosis.
          </>,
          <>
            <strong>Multi-class</strong> — K classes with K {'>'} 2, and each example belongs to <em>exactly</em> one.
            Digits 0 to 9, animal species.
          </>,
          <>
            <strong>Multi-label</strong> — each example may belong to several classes at once. Film genres, document
            tags.
          </>,
        ]}
      />

      <Terms
        items={[
          {
            term: 'classification',
            def: 'Predicting which category something belongs to. The categories are fixed in advance and given names, and the model chooses among them.',
          },
          {
            term: 'discrete',
            def: 'Taking one of a separate list of values, with no meaningful values in between. The opposite of continuous.',
          },
          {
            term: 'class label',
            def: 'The name of a category, usually written as a number for convenience. The number is a name, not a quantity.',
          },
          {
            term: 'K',
            say: 'kay',
            def: 'How many classes there are. K = 2 is binary; K > 2 is multi-class. It is fixed before training and never changes during it.',
          },
          {
            term: 'f : ℝᵈ → {1, …, K}',
            say: 'eff from are-dee to one up to kay',
            def: 'A function taking a d-number input and returning one of K names. The arrow notation states the shapes only, not what the function does.',
          },
          {
            term: 'supervised',
            def: 'Trained on examples that carry the right answer. The alternative, with no answers given, is unsupervised — the ML course covers both.',
          },
        ]}
      />

      <Beyond>
        The commonest exam trap is a target whose labels happen to be numbers. Predicting which of digits 0 to 9 is in
        an image is classification, not regression, even though the labels are numerals: 7 is not more than 3 in any
        sense the data supports. Fit it with a squared-error loss and the model learns to answer about 4.5 for
        everything, which minimises the loss beautifully and classifies nothing. The test is never what the target
        <em> looks</em> like — it is whether values between two targets mean anything.
      </Beyond>

      <WhyAiml method="nn.Linear(d, K) with nn.CrossEntropyLoss">
        <p className="mb-2">
          This slide decides the last two lines of any model you write. A binary task gets one output unit and{' '}
          <code>BCEWithLogitsLoss</code>; a multi-class task gets K output units and <code>CrossEntropyLoss</code>; a
          multi-label task gets K output units and <code>BCEWithLogitsLoss</code> applied to all of them independently.
          Choose the wrong one of those three and the model trains without error and answers nonsense.
        </p>
        <p>
          The multi-class and multi-label confusion is the expensive one. Softmax forces the K probabilities to add to
          1, so it can never say “this film is action <em>and</em> comedy” — pushing one probability up necessarily
          pushes the others down. If your labels are not mutually exclusive, softmax is not merely suboptimal, it is
          structurally incapable of expressing the right answer.
        </p>
      </WhyAiml>

      <Takeaway>
        Classification predicts a discrete label from a feature vector. Binary is K = 2, multi-class is K {'>'} 2 with
        exactly one right answer, and multi-label allows several at once — and that choice fixes the last layer and the
        loss before anything else is decided.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  whylinear: (
    <>
      <Para>
        Session 3 built a model that predicts a number. The obvious thing to try is to point it at labels of 0 and 1 and
        see what happens. Slide 10 explains why that fails, and it fails for a reason that is easy to state.
      </Para>
      <Worked title="The objection, slide 10">
        {`Linear regression outputs:   ŷ ∈ (−∞, ∞)
We need probabilities:       ŷ ∈ [0, 1]

A linear model can predict values below 0 or above 1.

Solution: use a function that maps  (−∞, ∞) → [0, 1].`}
      </Worked>
      <Para>
        A straight line is unbounded by construction. Follow it far enough to the right and it goes above 1; far enough
        to the left and it goes below 0. There is no choice of w that prevents this, because a non-zero slope always
        wins eventually.
      </Para>
      <Para>
        Before that, though, is the setting the deck fixes on slide 8, and it is worth having exactly right because
        every later formula assumes it.
      </Para>
      <Worked title="The standard notation, slide 8">
        {`Classes        y ∈ {0, 1}
  y = 1        the positive class  (spam, disease present)
  y = 0        the negative class  (not spam, disease absent)

Dataset        D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}ᴺᵢ₌₁
Goal           learn f(x) that outputs the probability of class 1

Decision       predict ŷ = 1  if  f(x) ≥ 0.5
               predict ŷ = 0  if  f(x) < 0.5`}
      </Worked>
      <Para>
        Two things there are conventions rather than facts. Which class you call “positive” is your choice, and it
        decides what precision and recall will later mean. And the 0.5 in the decision rule is a default, not a law —
        part 14 moves it deliberately.
      </Para>

      <Lab>
        <WhyNotLinearLab />
      </Lab>

      <Para>
        The lab shows a second problem that slide 10 does not mention, and it is arguably worse than the first. Drag the
        far point further right and the boundary — the place where the fitted line crosses 0.5 — moves, even though that
        point was already being classified correctly. Squared error charges the model for being “too right”, and a
        classifier should not care how far past the boundary a correct example sits.
      </Para>

      <Terms
        items={[
          {
            term: '(−∞, ∞)',
            say: 'minus infinity to infinity',
            def: 'Every real number. Round brackets mean the endpoints are not included, which for infinity they cannot be.',
          },
          {
            term: '[0, 1]',
            say: 'zero to one, closed',
            def: 'Every number from 0 to 1 including both ends. Square brackets include the endpoint, round brackets exclude it.',
          },
          {
            term: 'positive class',
            def: 'Whichever class you have labelled 1. It usually means the thing you are looking for — the illness, the fraud — not the pleasant outcome.',
          },
          {
            term: 'D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}ᴺᵢ₌₁',
            say: 'dee equals the set of x-i, y-i for i from one to N',
            def: 'The dataset, written as a set of N pairs. The superscript in brackets numbers the example; it is not a power.',
          },
          {
            term: 'decision boundary',
            def: 'The surface in feature space where the model switches from answering one class to answering the other.',
          },
        ]}
      />

      <Beyond>
        There is a third objection, and it is the deepest of the three. Squared error assumes the noise around the
        prediction is Gaussian — that is where the loss comes from, as session 3 showed. But a label that can only be 0
        or 1 is not a real number plus Gaussian noise; it is a coin flip whose bias you are trying to estimate. Choosing
        the right loss is not tidiness, it is matching the loss to how the data was actually generated. That argument
        produces cross-entropy, and it is why the deck calls it the “probabilistic interpretation” on slide 23.
      </Beyond>

      <WhyAiml method="sklearn.linear_model.LinearRegression against LogisticRegression">
        <p className="mb-2">
          The two class names in scikit-learn look similar and are not interchangeable, and this slide is the reason.
          Fitting <code>LinearRegression</code> to 0/1 targets runs perfectly happily and produces a model with no{' '}
          <code>predict_proba</code> at all, because its outputs are not probabilities and the library will not pretend
          otherwise.
        </p>
        <p>
          The failure matters most where the outputs get used downstream. A fraud score fed into an expected-cost
          calculation must be a probability, or the arithmetic is meaningless: multiplying a loss of £10 000 by a
          “probability” of 1.4 gives an expected cost larger than the worst case. Bounded outputs are not a nicety when
          something else consumes them.
        </p>
      </WhyAiml>

      <Takeaway>
        A linear model’s output is unbounded, so it cannot be a probability. It is also charged for being too
        confidently right, which drags the boundary. Both problems are fixed by putting one function on the end.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  sigmoid: (
    <>
      <Para>
        The function the previous part asked for is the <strong>sigmoid</strong>, also called the logistic function. It
        is the whole of the difference between session 3’s model and this one.
      </Para>
      <Worked title="The sigmoid and its derivative, slide 13">
        {`            1
  σ(z) = ─────────
          1 + e⁻ᶻ

  σ′(z) = σ(z)(1 − σ(z))

  At z = 0:   σ(0) = 0.5      σ′(0) = 0.25`}
      </Worked>
      <Para>
        Read the formula from the inside out. e⁻ᶻ is a positive number, large when z is very negative and tiny when z is
        very positive. Adding 1 to it gives something bigger than 1, so one divided by it is always between 0 and 1.
        That is the whole trick: a division that cannot escape its bounds.
      </Para>

      <Lab>
        <SigmoidLab />
      </Lab>

      <Para>Slide 14 lists the properties, and each of them earns its place:</Para>
      <List
        items={[
          <>
            <strong>Range</strong>: σ(z) ∈ (0, 1) — never exactly 0 or 1, which keeps the logarithm in the loss finite.
          </>,
          <>
            <strong>Monotonic</strong>: always increasing, so a larger score always means a larger probability and the
            ordering of examples is never scrambled.
          </>,
          <>
            <strong>Smooth</strong>: differentiable everywhere, unlike the perceptron’s step, so gradient descent works
            at all.
          </>,
          <>
            <strong>Symmetry</strong>: σ(−z) = 1 − σ(z), so the model treats the two classes even-handedly.
          </>,
          <>
            <strong>Derivative</strong>: σ′(z) = σ(z)(1 − σ(z)), computable from the output alone, with no second
            exponential to evaluate.
          </>,
        ]}
      />
      <Para>
        The behaviour at the extremes is the other half of the story. As z grows, σ(z) approaches 1 — the model is
        confident about class 1. As z falls, σ(z) approaches 0 — confident about class 0. At z = 0 it sits at exactly
        0.5, which is the model saying it has no idea.
      </Para>

      <Beyond>
        The derivative identity is easy to prove and worth doing once. Write σ = (1 + e⁻ᶻ)⁻¹. By the chain rule, σ′ =
        −(1 + e⁻ᶻ)⁻² · (−e⁻ᶻ) = e⁻ᶻ/(1 + e⁻ᶻ)². Now split that fraction as [1/(1 + e⁻ᶻ)] · [e⁻ᶻ/(1 + e⁻ᶻ)]. The first
        bracket is σ. The second is (1 + e⁻ᶻ − 1)/(1 + e⁻ᶻ) = 1 − σ. So σ′ = σ(1 − σ). The maximum is at σ = 0.5, where
        σ′ = 0.25 — the largest slope the sigmoid ever has, which is the number that starts the vanishing-gradient story
        in later modules.
      </Beyond>

      <Terms
        items={[
          {
            term: 'σ',
            say: 'sigma',
            def: 'The Greek letter s, used here for the sigmoid function. Nothing to do with Σ, the capital sigma that means "add up".',
          },
          {
            term: 'sigmoid',
            say: 'sig-moid',
            def: 'Literally "S-shaped". The name describes the graph. Also called the logistic function, which is where "logistic regression" gets its name.',
          },
          {
            term: 'e',
            say: 'ee',
            def: 'Euler’s number, about 2.718. e⁻ᶻ shrinks towards 0 as z grows and blows up as z falls.',
          },
          {
            term: 'monotonic',
            say: 'mon-oh-TON-ic',
            def: 'Always moving the same way. Here always increasing: a larger input never gives a smaller output.',
          },
          {
            term: 'σ′(z)',
            say: 'sigma prime of z',
            def: 'The derivative — how fast σ changes as z changes. The dash is Lagrange’s notation for "differentiate once".',
          },
          {
            term: 'saturation',
            def: 'When |z| is large, σ flattens and σ′ nearly vanishes. The unit stops responding to its input, and training on it nearly stops.',
          },
        ]}
      />

      <WhyAiml method="torch.sigmoid, and BCEWithLogitsLoss which absorbs it">
        <p className="mb-2">
          Saturation is the practical reason feature scaling appears on slide 91 as “essential”. An unscaled feature —
          income in rupees, say — produces logits in the thousands, σ′ is then around 10⁻⁴³⁴, and the weight for that
          feature simply stops moving. The model is not stuck at a bad minimum; the gradient has been multiplied by
          nearly zero on the way back.
        </p>
        <p>
          It is also why PyTorch tells you not to write <code>sigmoid</code> followed by <code>BCELoss</code>. Computing
          σ and then its logarithm loses precision at exactly the extremes where it matters, so{' '}
          <code>BCEWithLogitsLoss</code> takes the raw logit and applies the log-sum-exp trick internally. Same maths,
          and it does not return NaN when a logit reaches 50.
        </p>
      </WhyAiml>

      <Takeaway>
        σ(z) = 1/(1 + e⁻ᶻ) squashes any real score into (0, 1), is smooth and increasing, and has the tidy derivative
        σ(1 − σ) with a maximum of 0.25 at z = 0.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  components: (
    <>
      <Para>
        Slide 16 is the same checklist session 1 introduced and session 3 filled in for regression. Filling it in again
        for classification is the fastest way to see how little has actually changed.
      </Para>
      <Worked title="The four components, slide 16">
        {`1  Data                d-dimensional input vectors and binary labels
2  Model               a single neuron with sigmoid activation
3  Objective function  binary cross-entropy loss
4  Learning algorithm  stochastic gradient descent (SGD)`}
      </Worked>
      <Para>
        Set that beside session 3 and two lines differ. The model gained a sigmoid where regression had the identity,
        and the objective became cross-entropy where regression had squared error. The data is the same shape apart from
        the labels, and the learning algorithm is the same idea run on less data at a time.
      </Para>

      <Lab>
        <ComponentsLab />
      </Lab>

      <Para>
        Slide 17 then writes the data down properly. This is the design matrix of session 3, unchanged except for what
        the label column is allowed to hold.
      </Para>
      <Worked title="The matrix form, slide 17">
        {`Augmented example   x⁽ⁱ⁾ = [1, x₁⁽ⁱ⁾, …, x_d⁽ⁱ⁾]ᵀ

                    ⎡ 1  x₁⁽¹⁾ ⋯ x_d⁽¹⁾ ⎤
Design matrix   X = ⎢ 1  x₁⁽²⁾ ⋯ x_d⁽²⁾ ⎥   ∈ ℝᴺˣ⁽ᵈ⁺¹⁾
                    ⎢ ⋮   ⋮    ⋱   ⋮    ⎥
                    ⎣ 1  x₁⁽ᴺ⁾ ⋯ x_d⁽ᴺ⁾ ⎦

Labels          y = [y⁽¹⁾ y⁽²⁾ … y⁽ᴺ⁾]ᵀ   ∈ {0, 1}ᴺ
Weights         w = [w₀ w₁ w₂ … w_d]ᵀ     ∈ ℝᵈ⁺¹

Key difference from regression:  y⁽ⁱ⁾ ∈ {0, 1}, discrete, not continuous.`}
      </Worked>

      <Lab>
        <ClassDataLab />
      </Lab>

      <Para>
        The column of ones is doing the same job it did in session 3. Without it, every formula needs an “and then add
        b” clause tacked on the end. With it, the bias is just w₀ multiplied by an input that happens always to be 1,
        and z = wᵀx covers everything.
      </Para>

      <Terms
        items={[
          {
            term: 'design matrix',
            def: 'The table of training inputs: one row per example, one column per feature, plus a leading column of ones for the bias.',
          },
          {
            term: 'ℝᴺˣ⁽ᵈ⁺¹⁾',
            say: 'are to the N by d plus one',
            def: 'The set of real matrices with N rows and d + 1 columns. It states the shape and nothing else.',
          },
          {
            term: '{0, 1}ᴺ',
            say: 'zero-one to the N',
            def: 'A list of N values, each either 0 or 1. The label vector for a binary problem lives here.',
          },
          {
            term: 'augmented',
            def: 'With the extra 1 glued on the front. An augmented example has d + 1 entries for d real features.',
          },
          {
            term: 'objective function',
            def: 'The single number training tries to make small. Also called the loss or the cost, and used interchangeably in these decks.',
          },
        ]}
      />

      <Beyond>
        A detail the slide leaves implicit: scale the features <em>before</em> adding the ones column, never after.
        Standardising a constant column means subtracting its mean, giving zeros, then dividing by its standard
        deviation, which is zero — so the whole column becomes NaN and takes the model with it. Every library does the
        augmentation last for exactly this reason.
      </Beyond>

      <WhyAiml method="fit_intercept=True, and why nn.Linear has a separate bias tensor">
        <p className="mb-2">
          Frameworks split on this. Scikit-learn hides the augmentation behind <code>fit_intercept=True</code> and never
          shows you the ones column; PyTorch keeps <code>weight</code> and <code>bias</code> as two separate tensors.
          Both compute w₀ + wᵀx; the difference matters when you regularise, because a penalty applied to the whole
          weight vector would shrink the bias too, which is almost never wanted.
        </p>
        <p>
          Shrinking the bias forces the model towards predicting 0.5 for everything regardless of the data, which is
          actively harmful on an imbalanced dataset where the right default is far from 0.5. Keeping the bias out of the
          penalty is standard, and it is easy to get wrong when you have written the augmentation by hand.
        </p>
      </WhyAiml>

      <Takeaway>
        The four components with two boxes changed: sigmoid instead of identity, cross-entropy instead of squared error.
        The design matrix is unchanged; only the label vector is now restricted to 0 and 1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  neuron: (
    <>
      <Para>
        Slide 18 draws the model, and it is the picture from session 2 with a different box on the end. That is worth
        pausing on: logistic regression, which sounds like a statistics technique, <em>is</em> a single artificial
        neuron.
      </Para>
      <Worked title="The model, slides 18–19">
        {`z  = wᵀx = w₀ + w₁x₁ + w₂x₂ + ⋯ + w_d x_d          (2)

              1
ŷ  = σ(z) = ─────────                                 (3)
             1 + e⁻ᶻ

ŷ  = P(y = 1 | x) ∈ [0, 1]                            (4)

  z is the logit (the pre-activation)
  ŷ is the predicted probability`}
      </Worked>
      <Para>
        Two stages, and they do completely different jobs. The first is linear: it takes the features and combines them
        with weights. The second is not linear at all: it takes that one number and bends it into a probability. Neither
        stage on its own would do.
      </Para>

      <Lab>
        <LogisticNeuronLab />
      </Lab>

      <Para>
        The name <strong>logit</strong> for z is standard and worth keeping. It is the model’s raw score, before the
        squash, and it is the quantity the model is genuinely linear in. Doubling every weight doubles the logit; it
        does not double the probability.
      </Para>
      <Para>
        Equation (4) is a claim, not a definition, and it is the reason the loss is chosen as it is. Nothing about σ
        forces its output to be a probability — it is a number between 0 and 1, which is necessary but not sufficient.
        What makes it a probability is training it with a loss derived from the likelihood, which is exactly what
        cross-entropy is.
      </Para>

      <Terms
        items={[
          {
            term: 'logit',
            say: 'LOW-jit',
            def: 'The weighted sum z before the activation. Also the inverse of the sigmoid: if p = σ(z) then z = log(p/(1 − p)), the log-odds.',
          },
          {
            term: 'pre-activation',
            def: 'The same thing as the logit — whatever goes into the activation function. The two words are used interchangeably.',
          },
          {
            term: 'wᵀx',
            say: 'w transpose x',
            def: 'The dot product of the weights with the inputs: multiply matching entries and add. The transpose is bookkeeping so a column times a column makes sense.',
          },
          {
            term: 'P(y = 1 | x)',
            say: 'the probability that y is one, given x',
            def: 'A conditional probability, from the statistics course. The bar means "given" — this is the chance of class 1 for this particular input.',
          },
          {
            term: 'ŷ',
            say: 'y-hat',
            def: 'The model’s answer. In regression it was a predicted number; here it is a predicted probability.',
          },
        ]}
      />

      <Beyond>
        Slide 12 writes “z = wᵀx + w₀” and then, two lines later, “ŷ = σ(wᵀx)” with no separate w₀. Both are correct,
        but they use different conventions: the first keeps the bias outside the dot product, the second folds it in
        using the augmented x of slide 17. Slides 17 and 19 settle on the second, and so does the rest of the session.
        The safe habit in an exam is to say which convention you are using in one line before you start.
      </Beyond>

      <WhyAiml method="nn.Sequential(nn.Linear(d, 1), nn.Sigmoid())">
        <p className="mb-2">
          This part is the reason the two fields have two names for one thing. A statistician fits logistic regression
          by iteratively reweighted least squares; a deep learning practitioner trains a one-unit network by SGD. Same
          model, same optimum, and the second generalises: put a hidden layer in front and the code does not change,
          only the definition of x that the last unit sees.
        </p>
        <p>
          It also explains a common piece of advice. Because the final unit is linear in whatever it is given, a deep
          classifier is best understood as a learned feature extractor followed by exactly this logistic unit — which is
          why transfer learning works by keeping the body and replacing the head.
        </p>
      </WhyAiml>

      <Takeaway>
        Logistic regression is one neuron: a weighted sum z = wᵀx, then a sigmoid. z is the logit, ŷ = σ(z) is read as
        P(y = 1 | x), and the model is linear in the logit rather than in the probability.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  decision: (
    <>
      <Para>
        The model outputs a probability, but a classifier has to commit to an answer. Slide 20 gives the rule, and then
        gives the same rule again in a form that never mentions probability at all.
      </Para>
      <Worked title="The decision rule, slide 20">
        {`                  ⎧ 1   if ŷ ≥ 0.5
predicted class = ⎨                                    (5)
                  ⎩ 0   if ŷ < 0.5

Since σ(z) = 0.5 exactly when z = 0:

                  ⎧ 1   if wᵀx ≥ 0
predicted class = ⎨                                    (6)
                  ⎩ 0   if wᵀx < 0

The decision boundary is  wᵀx = 0  —  a hyperplane in feature space.`}
      </Worked>
      <Para>
        The two forms are the same test because σ is increasing and passes through 0.5 at exactly z = 0. Asking whether
        the probability has reached a half is asking whether the score has reached zero. The second form is cheaper — no
        exponential needed — and it is what makes the boundary easy to describe.
      </Para>

      <Lab>
        <BoundaryLab />
      </Lab>

      <Para>
        The boundary is <em>straight</em>. That is worth stating plainly, because the shading in the lab curves and the
        sigmoid curves and it is easy to conclude that the model is curved too. It is not: z is a linear function of x,
        so the set where z = 0 is a flat surface, and σ only relabels the values on either side of it.
      </Para>
      <Para>
        Try multiplying all the weights by ten in the lab. The line does not move by a hair — the set where wᵀx = 0 is
        unchanged when you scale w — but the shading becomes far sharper, so the model is enormously more confident
        about exactly the same decisions.
      </Para>

      <Terms
        items={[
          {
            term: 'hyperplane',
            say: 'HY-per-plane',
            def: 'The flat thing one dimension below the space it sits in: a line in 2-D, a plane in 3-D, a (d − 1)-dimensional flat in d dimensions.',
          },
          {
            term: 'feature space',
            def: 'The space whose axes are the features. Every example is one point in it, and the boundary is a surface cutting through it.',
          },
          {
            term: 'decision rule',
            def: 'How a probability becomes an answer. The 0.5 in it is a choice, not a consequence of the model.',
          },
          {
            term: 'threshold',
            def: 'The value ŷ has to reach before the model says class 1. Default 0.5, moved deliberately when one kind of mistake costs more.',
          },
          {
            term: '‖w‖',
            say: 'norm of w',
            def: 'The length of the weight vector. It sets how sharply the probability changes across the boundary, but not where the boundary is.',
          },
        ]}
      />

      <Beyond>
        There is a neat geometric reading of the weights, and it is exam-worthy. Write w = (w₀, v) where v holds the
        feature weights. Then v is <strong>perpendicular</strong> to the boundary and points towards class 1, and the
        distance from a point x to the boundary is |wᵀx| / ‖v‖. So the logit is the distance to the boundary, scaled by
        ‖v‖ — which is exactly why scaling all the weights up sharpens the probabilities without moving the line. This
        is the same normal-vector picture as the plane in the maths course.
      </Beyond>

      <WhyAiml method="predict_proba versus predict, and the threshold nobody tunes">
        <p className="mb-2">
          Every library gives you both: <code>predict_proba</code> returns ŷ and <code>predict</code> applies the 0.5
          rule. The default threshold is baked in and is almost never the right one for an imbalanced problem — a fraud
          model may need 0.05, a spam filter 0.95. Tuning it costs nothing and is routinely skipped.
        </p>
        <p>
          Crucially, moving the threshold is not retraining. The model, the weights and the ranking of examples are
          untouched; only where you cut the ranked list changes. That is why the ROC and precision-recall curves exist:
          they show every threshold at once, so you can pick the operating point after training rather than before.
        </p>
      </WhyAiml>

      <Takeaway>
        ŷ ≥ 0.5 and wᵀx ≥ 0 are the same test. The boundary wᵀx = 0 is a hyperplane, it is straight, and scaling the
        weights changes the model’s confidence without moving it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  bce: (
    <>
      <Para>
        There is a model and a decision rule. What is missing is a number that says how wrong a prediction is, so that
        training has something to reduce. Slide 21 opens by ruling out the obvious candidate in a single sentence: we
        cannot use squared error, so we use cross-entropy.
      </Para>
      <Worked title="The loss on one example, slide 21">
        {`ℓ(w; x⁽ⁱ⁾, y⁽ⁱ⁾) = −[ y⁽ⁱ⁾ log(ŷ⁽ⁱ⁾) + (1 − y⁽ⁱ⁾) log(1 − ŷ⁽ⁱ⁾) ]      (7)

where  ŷ⁽ⁱ⁾ = σ(wᵀx⁽ⁱ⁾)

If y⁽ⁱ⁾ = 1:   ℓ = −log(ŷ⁽ⁱ⁾)         penalises ŷ far from 1
If y⁽ⁱ⁾ = 0:   ℓ = −log(1 − ŷ⁽ⁱ⁾)     penalises ŷ far from 0`}
      </Worked>
      <Para>
        It looks like two formulas glued together, and that is exactly what it is. Since y is either 0 or 1, one of the
        two terms is always multiplied by zero and disappears. Writing both with the (1 − y) switch in front of the
        second is what lets one line of code handle both labels — and, later, what makes the derivative come out the
        same for both.
      </Para>

      <Lab>
        <BceLab />
      </Lab>

      <Para>Averaging over the dataset gives the objective that training actually minimises.</Para>
      <Worked title="The total loss and the goal, slide 22">
        {`         1   N
J(w) = − ─── Σ [ y⁽ⁱ⁾ log(ŷ⁽ⁱ⁾) + (1 − y⁽ⁱ⁾) log(1 − ŷ⁽ⁱ⁾) ]        (8)
         N  i=1

w* = arg min J(w)                                                  (9)
          w`}
      </Worked>
      <Para>
        The 1/N makes it an average rather than a total, so the number means the same thing whether you have 100
        examples or 100 000. And <strong>arg min</strong> is the w that makes J smallest, not the smallest value of J
        itself — a distinction examiners like to test.
      </Para>

      <Terms
        items={[
          {
            term: 'cross-entropy',
            def: 'A measure of how far one probability distribution is from another. Here: how far the model’s belief is from the truth, which puts all its weight on one class.',
          },
          {
            term: 'ℓ',
            say: 'ell',
            def: 'The loss on a single example. Lower case for one, capital J for the average over the dataset.',
          },
          {
            term: 'log',
            def: 'The natural logarithm, base e, in every formula in this deck. log(1) = 0 and log(x) goes to −∞ as x goes to 0.',
          },
          {
            term: '−log(ŷ)',
            def: 'The cost of the answer you gave. It is 0 when you said 1 with certainty and unbounded as you approach saying 0.',
          },
          {
            term: 'arg min',
            say: 'arg min',
            def: 'The argument that minimises. arg min J is the w where J bottoms out; min J is the bottom value itself.',
          },
          {
            term: 'J(w)',
            say: 'jay of w',
            def: 'The total objective. It is a function of the weights, not of the data — the data is fixed and w is what moves.',
          },
        ]}
      />

      <Beyond>
        Where does this formula come from? Maximum likelihood, and the derivation is three lines. If ŷ is the model’s
        probability of class 1, then the probability it assigns to the label it actually saw is ŷ if y = 1 and 1 − ŷ if
        y = 0 — which can be written in one expression as ŷ^y (1 − ŷ)^(1−y). The likelihood of the whole dataset is the
        product of those over all N examples. Taking a logarithm turns the product into a sum, and negating it turns
        “maximise” into “minimise”. What falls out is exactly equation (8). This is the same maximum-likelihood argument
        that gave squared error in session 3, applied to a coin flip instead of a Gaussian.
      </Beyond>

      <WhyAiml method="nn.BCELoss and nn.BCEWithLogitsLoss, and the pos_weight argument">
        <p className="mb-2">
          The average is worth watching from the first epoch. Before training, w = 0 gives ŷ = 0.5 for everything and J
          = log 2 ≈ 0.693. That number is the benchmark: a loss stuck at 0.693 means nothing has been learnt, and a loss
          that starts far above it usually means the labels or the outputs are the wrong way round.
        </p>
        <p>
          The two terms can also be weighted separately, which is what <code>pos_weight</code> does. On a dataset with
          one positive per hundred negatives, the positive term contributes a hundredth of the gradient, and weighting
          it up is how you stop the model from simply learning to say “no”. That is the loss-level answer to the
          imbalance problem that part 15 meets again at the metric level.
        </p>
      </WhyAiml>

      <Takeaway>
        ℓ = −[y log ŷ + (1 − y) log(1 − ŷ)] is one formula with two branches, only one of which is ever live. J is its
        average over the dataset, and it comes from maximum likelihood, not from taste.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  whyce: (
    <>
      <Para>
        Slide 23 sets out four reasons for cross-entropy. They are worth taking one at a time, because each answers a
        different objection.
      </Para>
      <Worked title="The four advantages, slide 23">
        {`Probabilistic interpretation   derived from maximum likelihood estimation
Appropriate for probabilities  heavily penalises confident wrong predictions
Convex                         a single global minimum for logistic regression
Well-behaved gradients         works well with the sigmoid activation

Loss behaviour: the loss increases sharply as the prediction moves
away from the true label.`}
      </Worked>
      <List
        items={[
          <>
            <strong>Probabilistic interpretation.</strong> It is the negative log-likelihood, so minimising it is
            maximising the chance of the data you actually saw. That is what licences reading ŷ as a probability at all.
          </>,
          <>
            <strong>Appropriate for probabilities.</strong> The cost of a mistake is unbounded, so being certain and
            wrong is the worst thing the model can do. Squared error caps the cost at 0.5 however certain the model was.
          </>,
          <>
            <strong>Convex.</strong> For a linear model the surface is a bowl with a single bottom, so any downhill
            route reaches the best answer. That guarantee is lost the moment a hidden layer is added.
          </>,
          <>
            <strong>Well-behaved gradients.</strong> The σ′ that the chain rule produces cancels exactly against the 1/ŷ
            from the logarithm, leaving the gradient of part 10. Squared error keeps the σ′, so a confidently wrong
            prediction produces almost no gradient — the model is most wrong exactly where it learns slowest.
          </>,
        ]}
      />

      <Lab>
        <WhyCeLab />
      </Lab>

      <Para>
        The last reason is the one worth understanding rather than memorising, because it is the opposite of what you
        might expect. Under squared error, a prediction of 0.01 for a true label of 1 is about as wrong as it is
        possible to be — and the gradient it produces is nearly zero, because σ′(z) has saturated. Under cross-entropy
        the logarithm blows up at exactly the same rate that σ′ shrinks, the two cancel, and the model receives a large
        correction precisely when it needs one.
      </Para>

      <Terms
        items={[
          {
            term: 'convex',
            say: 'CON-vex',
            def: 'Bowl-shaped: every straight line between two points on the surface stays above it. It means one minimum, and no way to get stuck.',
          },
          {
            term: 'global minimum',
            def: 'The lowest point anywhere. A local minimum is only lowest in its own neighbourhood — for a convex function the two are the same.',
          },
          {
            term: 'maximum likelihood',
            def: 'Choosing the parameters that make the data you observed as probable as possible. Minimising cross-entropy is exactly this.',
          },
          {
            term: 'likelihood',
            def: 'The probability of the observed data under a given set of parameters. Read as a function of the parameters, with the data held fixed.',
          },
        ]}
      />

      <Beyond>
        It is worth being precise about the convexity claim, because it is easy to overstate. J(w) is convex in w for
        this model, with squared error it is <em>not</em> — putting σ inside a square gives a surface with flat regions
        and, for some datasets, local minima. So the deck’s third bullet is not just a nice property of cross-entropy;
        it is a property the alternative genuinely lacks. And the guarantee is about the model, not the loss: keep
        cross-entropy but add a hidden layer, and convexity goes anyway.
      </Beyond>
      <Beyond>
        One more property, unstated on the slide and worth knowing: for perfectly separable data the minimum of J does
        not exist. The loss can always be reduced by scaling w up, so the weights grow without bound and training never
        converges. Regularisation is what makes the problem well-posed, which is why every library’s{' '}
        <code>LogisticRegression</code> applies some by default.
      </Beyond>

      <WhyAiml method="MSELoss on a sigmoid output — the bug that trains slowly for no visible reason">
        <p className="mb-2">
          Pairing a sigmoid with a squared-error loss is a real and common mistake, and its signature is unmistakable
          once you have seen it: the loss falls a little, then crawls, and the model never becomes confident. Nothing
          errors. The gradients have been multiplied by σ′ ≈ 0 on the examples that matter most.
        </p>
        <p>
          The general principle behind all four bullets is that the activation and the loss are chosen as a pair, not
          separately. Sigmoid with binary cross-entropy, and softmax with categorical cross-entropy, are the two pairs
          whose derivatives cancel to leave ŷ − y — which is why frameworks ship them fused into one operation.
        </p>
      </WhyAiml>

      <Takeaway>
        Four reasons: it comes from maximum likelihood, it punishes confident mistakes without limit, it is convex for
        this model, and its gradient cancels the sigmoid’s derivative instead of being throttled by it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  sgd: (
    <>
      <Para>
        Session 3 trained with <strong>batch</strong> gradient descent: every example contributes to the gradient before
        a single step is taken. Slide 24 explains why that becomes a problem, and what to do instead.
      </Para>
      <Worked title="Batch gradient descent, and its problems, slide 24">
        {`Batch GD (from Module 3):
  uses all training examples in each update
              1   N
  ∇J(w)  =   ───  Σ  ∇ℓ(w; x⁽ⁱ⁾, y⁽ⁱ⁾)
              N  i=1
  w ← w − η∇J(w)

Problems:
  slow for large datasets — all N examples per update
  high memory requirements
  redundant computation when examples are similar`}
      </Worked>
      <Para>
        The third problem is the interesting one. If a million rows contain the same pattern a thousand times over, the
        thousandth copy tells you nothing the first did not, yet batch gradient descent dutifully processes all of them
        before moving a single weight. Most of that work bought nothing.
      </Para>
      <Worked title="Stochastic gradient descent, slide 25">
        {`At iteration t:
  1  randomly select one example (x⁽ⁱ⁾, y⁽ⁱ⁾)
  2  compute the gradient for that example ∇ℓ(w; x⁽ⁱ⁾, y⁽ⁱ⁾)
     — a noisy estimate of the true gradient
  3  update:  w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η ∇ℓ(w⁽ᵗ⁾; x⁽ⁱ⁾, y⁽ⁱ⁾)`}
      </Worked>
      <Para>
        Notice what is being claimed. The gradient from one example is not the true gradient — it is an{' '}
        <strong>estimate</strong> of it, and usually a poor one. The bet is that N poor steps beat one good step,
        because they cost the same in total and there are N times as many of them.
      </Para>

      <Lab>
        <SgdVsBatchLab />
      </Lab>

      <Para>
        The deck adds a claim on slide 25 that is worth reading carefully: the noise in SGD “actually helps escape local
        minima and often leads to better generalisation”. For this model there are no local minima to escape — J is
        convex, as part 8 said. The remark is about the deep networks the course is heading towards, where the surface
        has plenty of them.
      </Para>

      <Terms
        items={[
          {
            term: 'stochastic',
            say: 'sto-KAS-tic',
            def: 'Random. Here it means the example used for each step is chosen at random rather than fixed in advance.',
          },
          {
            term: 'batch gradient descent',
            def: 'One update per full pass over the data, using the exact average gradient. Slow, steady, and exactly reproducible.',
          },
          {
            term: 'SGD',
            def: 'Stochastic gradient descent: one update per example. In modern usage "SGD" usually means the mini-batch version of part 21.',
          },
          {
            term: 'noisy estimate',
            def: 'A number that is right on average but wrong on any given occasion. One example’s gradient is an unbiased estimate of the true one.',
          },
          {
            term: 'online learning',
            def: 'Updating the model as each new example arrives, rather than retraining on the whole dataset. SGD supports it; batch GD cannot.',
          },
        ]}
      />

      <Beyond>
        “Unbiased estimate” is the precise version of the deck’s claim, and it is what makes SGD work at all. Pick an
        example uniformly at random and the expected value of its gradient is exactly the batch gradient, because the
        batch gradient <em>is</em> the average. So SGD moves in the right direction on average, even though almost every
        individual step points somewhere slightly wrong. Everything else — the noise, the oscillation near the bottom —
        follows from the variance around that average.
      </Beyond>

      <WhyAiml method="torch.optim.SGD, and the DataLoader that feeds it">
        <p className="mb-2">
          The memory argument is the one that actually decided the field. ImageNet does not fit in the memory of any
          single machine, so a training method that requires the whole dataset before taking one step is not slow, it is
          impossible. SGD needs one example — or one batch — in memory at a time, which is why <code>DataLoader</code>{' '}
          streams from disk and why datasets larger than RAM are unremarkable.
        </p>
        <p>
          The name has also drifted. <code>torch.optim.SGD</code> does not implement the one-example-at-a-time algorithm
          on this slide; it applies whatever gradient it is handed, which in practice comes from a mini-batch. The slide
          is teaching the pure form so that the mini-batch version in part 21 has something to be a compromise between.
        </p>
      </WhyAiml>

      <Takeaway>
        Batch GD uses all N examples per step: exact, slow, memory-hungry. SGD uses one: noisy, cheap, and N times as
        many steps per pass over the data. The noise is a real cost and, in deeper models, a real benefit.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  grad: (
    <>
      <Para>
        To take a step, the algorithm needs the derivative of the loss with respect to each weight. Slide 26 gives it,
        and calls the result remarkably simple. It is.
      </Para>
      <Worked title="The gradient for one example, slide 26">
        {`                        ∂ℓ
∇_w ℓ(w; x⁽ⁱ⁾, y⁽ⁱ⁾) = ───  = ( ŷ⁽ⁱ⁾ − y⁽ⁱ⁾ ) x⁽ⁱ⁾              (10)
                        ∂wⱼ

where ŷ⁽ⁱ⁾ = σ(wᵀx⁽ⁱ⁾)   and   x₀⁽ⁱ⁾ = 1 for the bias

  Error:      (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)      a single number
  Direction:  x⁽ⁱ⁾              the input vector

Same structure as the linear regression gradient.`}
      </Worked>
      <Para>
        Two pieces, and they do different jobs. The error is one number: how far out the prediction was, and in which
        direction. The input vector decides how that single number is shared out among the weights — a feature that was
        large gets a large share of the blame, and a feature that was zero gets none at all.
      </Para>

      <Lab>
        <GradLab />
      </Lab>

      <Para>
        The last line of the slide is the one to remember. This is <em>exactly</em> the regression gradient of session
        3, with a different ŷ inside it. Two different models, two different losses, one gradient formula — which is why
        the training loop written in session 3 needs no changes at all here.
      </Para>

      <Beyond>
        The cancellation is worth doing once by hand, because it is the whole reason the formula is this tidy. Take y =
        1, so ℓ = −log ŷ. Then ∂ℓ/∂ŷ = −1/ŷ. The sigmoid gives ∂ŷ/∂z = ŷ(1 − ŷ). And ∂z/∂wⱼ = xⱼ. Multiplying the three
        by the chain rule:
        <br />
        <span className="font-mono">∂ℓ/∂wⱼ = (−1/ŷ) · ŷ(1 − ŷ) · xⱼ = −(1 − ŷ)xⱼ = (ŷ − 1)xⱼ</span>
        <br />
        and since y = 1, that is (ŷ − y)xⱼ. The ŷ cancels the 1/ŷ. Doing the same with y = 0 gives ℓ = −log(1 − ŷ),
        ∂ℓ/∂ŷ = 1/(1 − ŷ), and the (1 − ŷ) cancels instead, leaving ŷxⱼ = (ŷ − 0)xⱼ. Both branches land on the same
        formula, which is why the code never has to check the label.
      </Beyond>

      <Terms
        items={[
          {
            term: '∇_w ℓ',
            say: 'grad w of ell',
            def: 'The gradient of ℓ with respect to w: a vector holding one partial derivative per weight. Same shape as w.',
          },
          {
            term: '∂ℓ/∂wⱼ',
            say: 'partial ell by partial w-j',
            def: 'How much the loss changes when weight j alone changes, holding the others still. The curly ∂ marks it as partial.',
          },
          {
            term: 'chain rule',
            def: 'To differentiate through a chain of steps, multiply the derivatives of each. Here: loss by ŷ, ŷ by z, z by w.',
          },
          {
            term: 'error term',
            def: 'The (ŷ − y) factor. It is positive when the model predicted too high and negative when too low, which is what sets the direction of the step.',
          },
        ]}
      />

      <WhyAiml method="loss.backward(), and why the last layer’s gradient is always ŷ − y">
        <p className="mb-2">
          This is the base case of backpropagation. In a deep network the gradient at the output layer is exactly this ŷ
          − y, and every earlier layer’s gradient is that number pushed backwards through the layers in between. Module
          5 adds the pushing-backwards; the number that starts the journey is set here.
        </p>
        <p>
          It is also the standard gradient check. Write the gradient by hand for one example, compare it against
          <code> loss.backward()</code>, and if they differ the bug is in your forward pass or your loss, not in the
          optimiser. A sign error here looks exactly like “the loss is not decreasing” on the debugging checklist, and
          nothing else will find it.
        </p>
      </WhyAiml>

      <Takeaway>
        ∇ℓ = (ŷ − y)x: the error times the input. The σ′ from the chain rule cancels against the 1/ŷ from the log, which
        is why this is identical in form to the regression gradient.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  sgdalgo: (
    <>
      <Para>
        Slide 27 puts the pieces together as pseudocode. Nine lines, and every one of them has already been explained —
        the value of writing them out is seeing what order they happen in.
      </Para>
      <Worked title="Algorithm 1: SGD for logistic regression, slide 27">
        {`Input:  dataset D = {(x⁽ⁱ⁾, y⁽ⁱ⁾)}ᴺᵢ₌₁, learning rate η, epochs T
Output: learned weights w

 1  initialise w⁽⁰⁾ = 0 (or small random values)
 2  for epoch = 1 to T do
 3      shuffle dataset D
 4      for each example (x⁽ⁱ⁾, y⁽ⁱ⁾) in D do
 5          compute prediction:  ŷ⁽ⁱ⁾ = σ(wᵀx⁽ⁱ⁾)
 6          compute gradient:    ∇ℓ = (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)x⁽ⁱ⁾
 7          update weights:      w ← w − η∇ℓ
 8          optional: compute total loss J(w) for monitoring
 9  return w`}
      </Worked>

      <Lab>
        <SgdAlgoLab />
      </Lab>

      <Para>
        Line 3 is the one that looks like housekeeping and is not. Without the shuffle, SGD meets the examples in the
        same order every epoch, so any structure in that order — all the positives first, say, or data sorted by date —
        is applied again and again in the same rhythm. The weights can end up cycling rather than settling.
      </Para>
      <Para>
        Line 8 is marked optional for a real reason: computing J costs a full pass over the data, which is exactly the
        cost SGD was invented to avoid. Doing it every step would make the monitoring more expensive than the training.
      </Para>
      <Para>Slides 28 and 29 then set out the trade honestly. The benefits:</Para>
      <List
        items={[
          <>
            <strong>Speed</strong> — each iteration touches one example.
          </>,
          <>
            <strong>Memory</strong> — datasets that do not fit in memory become trainable.
          </>,
          <>
            <strong>Online learning</strong> — the model can be updated as new data arrives.
          </>,
          <>
            <strong>Generalisation</strong> — the noise helps escape sharp minima.
          </>,
          <>
            <strong>Scalability</strong> — it works on massive datasets.
          </>,
        ]}
      />
      <Para>And the costs:</Para>
      <List
        items={[
          <>
            <strong>Noisy updates</strong> — the path to the minimum is not smooth.
          </>,
          <>
            <strong>Learning rate</strong> — far more sensitive to the choice of η.
          </>,
          <>
            <strong>Convergence</strong> — it oscillates near the minimum rather than settling into it.
          </>,
          <>
            <strong>Hyperparameter tuning</strong> — more care is needed to get it right.
          </>,
        ]}
      />
      <Para>
        The deck ends the list with one line: “common compromise: mini-batch SGD”. That is the whole of part 21, and it
        is what the multi-class half of the session uses.
      </Para>

      <Terms
        items={[
          {
            term: 'epoch',
            say: 'EE-pok',
            def: 'One complete pass over the training set. With SGD that means N weight updates, one per example.',
          },
          {
            term: 'iteration',
            def: 'One weight update. Under plain SGD one iteration handles one example; under mini-batch it handles B of them.',
          },
          {
            term: 'pseudocode',
            def: 'Code written for a human rather than a compiler. The indentation carries the loop structure.',
          },
          {
            term: 'hyperparameter',
            def: 'A setting you choose rather than learn: η, T, the batch size. The weights are parameters; these are not.',
          },
          {
            term: 'shuffle',
            def: 'Reorder the examples at random. Done once per epoch, so each epoch sees a different order.',
          },
        ]}
      />

      <Beyond>
        Line 1 offers “w = 0 or small random values”, and for this model either genuinely works — the surface is convex,
        so where you start does not change where you end. That will stop being true almost immediately. In a network
        with a hidden layer, starting every weight at zero makes every unit in the layer compute the same thing and
        receive the same gradient for ever, so they never differentiate. The deck writes “or small random values”
        because that habit has to be in place before module 5 needs it.
      </Beyond>

      <WhyAiml method="the standard PyTorch loop: zero_grad, forward, backward, step">
        <p className="mb-2">
          Lines 4 to 7 are the four lines of every training script ever written: get a batch, compute the output,
          compute the gradient, apply it. Recognising this pseudocode inside <code>for xb, yb in loader:</code> is what
          makes an unfamiliar codebase readable.
        </p>
        <p>
          The shuffle is <code>shuffle=True</code> on the DataLoader, and it defaults to <code>False</code>. A dataset
          stored sorted by class — which is common, because that is how directories of images are usually organised —
          then feeds the model every example of class 0 before it sees a single one of class 1. The loss curve looks
          bizarre and the model is useless, and the fix is one keyword argument.
        </p>
      </WhyAiml>

      <Takeaway>
        Initialise, then for each epoch shuffle and walk the examples, predicting, computing (ŷ − y)x and stepping. The
        shuffle is not optional; the loss computation on line 8 is.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  example: (
    <>
      <Para>
        Slides 31 to 35 run the whole algorithm on a dataset small enough to check by hand. This is the part of the deck
        most likely to appear in an exam, so every number below is recomputed here from X, y and η rather than copied
        off the slide.
      </Para>
      <Worked title="The setup, slides 31–32">
        {`Classify whether a student passes, from hours studied.

  hours (x₁)   pass (y)          ⎡1 1⎤        ⎡0⎤
      1           0          X = ⎢1 2⎥    y = ⎢0⎥    w = ⎡w₀⎤
      2           0              ⎢1 3⎥        ⎢1⎥        ⎣w₁⎦
      3           1              ⎣1 4⎦        ⎣1⎦
      4           1

  η = 0.5      N = 4      w⁽⁰⁾ = (0, 0)ᵀ

With w = 0 every z is 0, so ŷ⁽⁰⁾ = (0.5, 0.5, 0.5, 0.5)ᵀ.`}
      </Worked>

      <Lab>
        <WorkedBinaryLab />
      </Lab>

      <Para>
        The first iteration takes example 1 — one hour of study, y = 0. Its z is 0, so ŷ is 0.5, so the error is 0.5 − 0
        = 0.5. The gradient is that error times the input [1, 1], giving (0.5, 0.5), and the step is w = (0, 0) −
        0.5(0.5, 0.5) = (−0.25, −0.25). Both weights moved down, because the model guessed too high for a student who
        failed.
      </Para>
      <Para>
        The second iteration takes example 3 — three hours, y = 1. Now z = −0.25 + 3(−0.25) = −1.0, so ŷ = σ(−1) ≈
        0.269, and the error is 0.269 − 1 = −0.731. The gradient is −0.731 × [1, 3] = (−0.731, −2.193), and the step is
        (−0.25, −0.25) − 0.5(−0.731, −2.193) = (0.116, 0.847).
      </Para>
      <Para>
        Look at the sizes. The second entry of that gradient is three times the first, for no reason except that x₁ = 3
        and x₀ = 1. A feature that arrives with a larger value pushes its weight harder — which is the whole argument
        for scaling features, made concrete in two numbers.
      </Para>

      <Caution>
        <p className="mb-2">
          Slide 35 computes the four predictions after those two updates and gets 0.724, 0.859, 0.934 and 0.971. Those
          are correct — the lab reproduces every one. But the slide then reads them off with two ticks:{' '}
          <em>“Examples 1, 2 (true label 0): predictions moving toward 0”</em> and{' '}
          <em>“Examples 3, 4 (true label 1): predictions moving toward 1”</em>.
        </p>
        <p className="mb-2">
          Only the second is true. Examples 1 and 2 started at 0.5 and are now at 0.724 and 0.859 — they have moved{' '}
          <strong>away</strong> from 0, not towards it. Their true label is 0, so the model has got worse on them, not
          better.
        </p>
        <p>
          That is not a mistake in the arithmetic and it is not a problem with the method. Two SGD updates out of a
          single partial sweep touched only examples 1 and 3, and the large step for example 3 dragged the whole line
          upwards, taking examples 1 and 2 with it. It is exactly the noisiness slide 29 warns about, visible in the
          deck’s own numbers. The slide’s conclusion — keep going for multiple epochs until convergence — is right; the
          tick beside the first line is not.
        </p>
      </Caution>

      <Beyond>
        Run the lab’s training past those two steps and the picture resolves: with enough epochs the boundary settles
        between 2 and 3 hours, which is the only sensible place for it. The lesson is about reading training runs, not
        about this dataset — the loss after any single SGD step can be worse than before it, and only the trend over an
        epoch or more means anything.
      </Beyond>

      <Terms
        items={[
          {
            term: 'forward pass',
            def: 'Working out ŷ from x and the current weights. The first half of every training step.',
          },
          {
            term: 'w⁽ᵗ⁾',
            say: 'w at time t',
            def: 'The weights after t updates. The superscript in brackets is a step counter, not a power.',
          },
          {
            term: 'η',
            say: 'eta',
            def: 'The learning rate: how far to move along the downhill direction. It is 0.5 here, which is large — and deliberately so, to make one step visible.',
          },
        ]}
      />

      <WhyAiml method="the overfit-one-batch sanity check">
        <p className="mb-2">
          A four-example dataset is not a toy, it is a test. The standard first check on any new training script is to
          give it a handful of examples and demand that it reaches 100% accuracy on them. If it cannot memorise four
          points, the bug is in the code, not the model — and finding it there takes seconds rather than the hours a
          full run costs.
        </p>
        <p>
          The second habit this example teaches is checking the first step by hand. With w = 0 you know ŷ must be
          exactly 0.5, so the first gradient must be exactly (y − 0.5) times the input. If your framework prints
          something else, stop: the labels, the ordering or the sign is wrong, and every number after that is
          meaningless.
        </p>
      </WhyAiml>

      <Takeaway>
        Two SGD steps take w from (0, 0) to (−0.25, −0.25) to (0.116, 0.847). The arithmetic on slides 33 and 34 checks
        out exactly; the tick on slide 35 about examples 1 and 2 does not.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  graph: (
    <>
      <Para>
        Slide 36 draws one SGD step as a graph: boxes for values, circles for operations, solid arrows going forward and
        dashed ones coming back. It is a small picture with a lot in it.
      </Para>
      <Worked title="The computational graph, slide 36">
        {`forward:   w⁽ᵗ⁾ ─┐
                   ├─► ×  ─► z ─► σ ─► ŷ ─┐
           x⁽ⁱ⁾ ───┘                       ├─► − ─► e ─► ℓ ─► Loss
                              y⁽ⁱ⁾ ────────┘

backward:  e ─► ∇ℓ = e · x ─► ×(−η) ─► w⁽ᵗ⁺¹⁾

Single example used per iteration — much faster than batch GD.`}
      </Worked>

      <Lab>
        <CompGraphLab />
      </Lab>

      <Para>
        The thing to notice is that the loss box is a dead end. Nothing downstream of ℓ feeds the update: the gradient
        is built from e, which was computed before the loss was. You could delete the loss node entirely and still train
        — you just would not know how it was going.
      </Para>
      <Para>
        The other thing to notice is where y enters. It appears exactly once, at the subtraction, and nowhere else. That
        is what makes inference cheap: at prediction time you run the top row only, and none of the machinery below it
        exists.
      </Para>
      <Para>
        Slide 44 draws the same session as a loop rather than a line: data feeds the model, the model feeds the loss,
        the loss feeds SGD, and SGD feeds the model again. The graph above is one turn of that loop, for one example.
      </Para>

      <Terms
        items={[
          {
            term: 'computational graph',
            def: 'A picture of a calculation: nodes are values or operations, arrows are dependencies. Every deep learning framework builds one internally.',
          },
          {
            term: 'forward pass',
            def: 'Following the solid arrows from inputs to loss. Everything needed to make a prediction.',
          },
          {
            term: 'backward pass',
            def: 'Following the dashed arrows from the error back to the weights. For this model it is a single multiplication.',
          },
          {
            term: 'backpropagation',
            def: 'The general algorithm for the backward pass through many layers. Here there is only one layer, so it is one step.',
          },
        ]}
      />

      <Beyond>
        The graph is not a teaching aid — it is exactly how autograd works. Every framework records this graph as the
        forward pass runs, storing which operation produced each value and what it needs to differentiate itself. The
        backward pass then walks the recorded graph in reverse. This is why <code>loss.backward()</code> can be called
        on a value computed five function calls away: the graph remembers the route even though your code has forgotten
        it, and why calling it twice fails unless you ask to keep the graph, since the recording is discarded as it is
        consumed.
      </Beyond>

      <WhyAiml method="autograd, requires_grad, and torch.no_grad()">
        <p className="mb-2">
          The dead-end loss node explains a practical detail. At inference you want the top row only, so wrapping
          prediction in <code>torch.no_grad()</code> tells the framework to stop recording the graph — which saves the
          memory that would have held every intermediate value for a backward pass that is never going to happen. On a
          large model that is the difference between fitting in memory and not.
        </p>
        <p>
          The graph also shows what <code>requires_grad</code> is marking. Only w carries it: x and y are data, and no
          gradient with respect to them is ever wanted. The arrows that come back stop at the weight boxes, which is
          precisely what the flag encodes.
        </p>
      </WhyAiml>

      <Takeaway>
        Forward along the solid arrows to the loss, backward along the dashed ones to the gradient. The label enters
        only at the subtraction, and the loss node feeds nothing — it is for monitoring, not for training.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  confusion: (
    <>
      <Para>
        The model is trained. Slide 38 asks how you would know whether it is any good, and points out that the answer
        cannot be the loss — a loss of 0.31 means nothing to anybody outside the training loop.
      </Para>
      <Worked title="Evaluating a classifier, slide 38">
        {`Key questions:
  How often does the model predict correctly?     accuracy
  What types of errors does it make?              confusion matrix
  How well does it identify positive cases?       precision, recall

Data split:
  training set     learn the weights w        typically 90–99%
  validation set   tune hyperparameters       typically 10–15%
  test set         final evaluation           typically 1–10%

Always evaluate on unseen test data to measure generalisation.`}
      </Worked>
      <Para>
        The three-way split matters more than it looks. The training set fits w. The validation set chooses η, the
        number of epochs and the batch size — decisions that would otherwise be made by peeking at the test set. The
        test set is used once, at the end, and every time you look at it to make a decision it becomes a little less of
        a test.
      </Para>

      <Beyond>
        The percentages on the slide add up to more than 100 and are best read as ranges rather than a recipe. What
        actually decides them is how much data there is: with a thousand examples a 60/20/20 split is normal, because
        200 test rows is barely enough to distinguish 90% accuracy from 93%. With ten million rows, 1% is a hundred
        thousand test examples, which is plenty — and every row you do not spend on testing can be spent on training.
      </Beyond>

      <Worked title="The confusion matrix, slide 39">
        {`                        predicted
                  positive (1)   negative (0)
       positive     True         False
actual   (1)        Positive     Negative
                    (TP)         (FN)
       negative     False        True
         (0)        Positive     True
                    (FP)         Negative (TN)

TP  correctly predicted positive
TN  correctly predicted negative
FP  incorrectly predicted positive   (Type I error)
FN  incorrectly predicted negative   (Type II error)`}
      </Worked>

      <Lab>
        <ConfusionLab />
      </Lab>

      <Para>
        There is a reliable way to read those four names. The second word is what the model <em>said</em>; the first
        word says whether it was right. So a false negative is the model saying “negative” and being wrong — a missed
        case. Everything in the next part is built from these four counts and nothing else.
      </Para>
      <Para>
        The lab shows the thing a static matrix cannot: the counts depend on the threshold, not just on the model.
        Sliding it left turns misses into false alarms and sliding it right turns them back, while the total number of
        mistakes changes only a little. You are choosing which kind of error to make.
      </Para>

      <Terms
        items={[
          {
            term: 'confusion matrix',
            def: 'A table of counts: how many examples of each actual class were predicted as each class. The diagonal is the correct ones.',
          },
          {
            term: 'true positive',
            def: 'The model said positive and it was positive.',
          },
          {
            term: 'false positive',
            def: 'The model said positive and it was not. A false alarm. Also called a Type I error.',
          },
          {
            term: 'false negative',
            def: 'The model said negative and it was not. A miss. Also called a Type II error.',
          },
          {
            term: 'generalisation',
            def: 'How well the model does on data it was not trained on. The only thing that matters, and the only thing the test set measures.',
          },
          {
            term: 'validation set',
            def: 'Rows held back to choose hyperparameters. Separate from the test set so that tuning does not quietly contaminate the final number.',
          },
        ]}
      />

      <WhyAiml method="sklearn.metrics.confusion_matrix, and the leakage that invalidates it">
        <p className="mb-2">
          The rule that any preprocessing must be fitted on the training rows alone is where test scores most often go
          wrong. Standardising the whole dataset before splitting lets the mean and standard deviation of the test rows
          leak into the training data, and the reported score is then better than anything you will see in production.
          Every scikit-learn <code>Pipeline</code> exists to make this mistake hard to commit.
        </p>
        <p>
          Print the matrix, not the accuracy. The four counts say what kind of model you have — a matrix with a whole
          empty column is a model that never predicts one of the classes, which is invisible in a single accuracy number
          and is the second entry on the debugging checklist in part 27.
        </p>
      </WhyAiml>

      <Takeaway>
        Split the data three ways and report on rows the model has never seen. The confusion matrix holds four counts —
        TP, FN, FP, TN — and everything else in this half of the session is arithmetic on them.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  metrics: (
    <>
      <Para>
        Four numbers come out of the confusion matrix, and slides 40 to 43 define all of them. They differ only in what
        they divide by, and that is the whole of the subject.
      </Para>
      <Worked title="The four metrics, slides 40–41">
        {`                  TP + TN
Accuracy   = ───────────────────────                    (11)
              TP + TN + FP + FN

                TP
Precision  = ─────────                                   (12)
              TP + FP

                TP
Recall     = ─────────                                   (13)
              TP + FN

              Precision × Recall
F1  = 2 · ────────────────────────                       (14)
             Precision + Recall`}
      </Worked>
      <Para>
        Say each one in words and it becomes hard to forget. Accuracy: of everything, how much did I get right?
        Precision: of the things I <em>said</em> were positive, how many were? Recall: of the things that <em>were</em>{' '}
        positive, how many did I find? Precision divides by a column of the matrix, recall divides by a row.
      </Para>

      <Lab>
        <MetricsLab />
      </Lab>

      <Worked title="The worked example, slide 43">
        {`Eight predictions:  TP = 3, TN = 3, FP = 1, FN = 1

                3 + 3     6
Accuracy   = ─────────  = ─  = 0.75
                  8       8

                3
Precision  = ─────  = 0.75
              3 + 1

                3
Recall     = ─────  = 0.75
              3 + 1

              0.75 × 0.75
F1  = 2 · ─────────────── = 0.75
              0.75 + 0.75`}
      </Worked>
      <Para>
        All four come out at 0.75, which makes the example easy to check and slightly misleading — they agree here only
        because FP and FN happen to be equal. Type different counts into the lab and they come apart immediately.
      </Para>
      <Para>Slide 42 says which one to look at, and why:</Para>
      <List
        items={[
          <>
            <strong>Accuracy</strong>, when the classes are balanced. Misleading when they are not: with 95% negatives,
            a model that says “negative” to everything scores 95%.
          </>,
          <>
            <strong>Precision</strong>, when false positives are costly. Spam detection — you do not want real email in
            the junk folder.
          </>,
          <>
            <strong>Recall</strong>, when false negatives are costly. Disease detection — you do not want to miss a sick
            patient.
          </>,
          <>
            <strong>F1</strong>, when you need both, and especially on imbalanced data.
          </>,
        ]}
      />
      <Para>
        Either metric can be made perfect on its own, which is why neither is trusted alone. Predict positive for
        everything and recall is 1. Predict positive only for the single example you are most sure about and precision
        is 1. F1 is the harmonic mean precisely because it refuses both tricks: it stays low unless both numbers are
        respectable.
      </Para>

      <Terms
        items={[
          {
            term: 'accuracy',
            def: 'The fraction of all predictions that were right. The obvious metric, and the one that lies most often.',
          },
          {
            term: 'precision',
            def: 'Of the examples predicted positive, the fraction that really were. Divides by the predicted-positive column.',
          },
          {
            term: 'recall',
            say: 'also called sensitivity',
            def: 'Of the examples that really were positive, the fraction found. Divides by the actual-positive row.',
          },
          {
            term: 'F1 score',
            def: 'The harmonic mean of precision and recall. It sits near the smaller of the two rather than midway between them.',
          },
          {
            term: 'harmonic mean',
            def: '2ab/(a + b), rather than (a + b)/2. It is dragged down hard by whichever number is smaller, which is the point.',
          },
          {
            term: 'class imbalance',
            def: 'When one class is far more common than the other. It breaks accuracy and is the reason the other three metrics exist.',
          },
        ]}
      />

      <Beyond>
        Two facts that follow from the definitions and are worth having ready. First, precision is undefined when the
        model never predicts positive: TP + FP is zero, and there is genuinely no set of positive predictions to be
        right about — “0” is the wrong answer, and the lab says <em>undefined</em> instead. Second, F1 ignores TN
        entirely. Look at equations (12), (13) and (14): the true negatives appear nowhere. On a dataset that is 99%
        negative that is exactly what you want, since correctly ignoring the overwhelming majority is not an achievement
        worth scoring.
      </Beyond>

      <WhyAiml method="classification_report, and the threshold that no metric chooses for you">
        <p className="mb-2">
          <code>classification_report</code> prints all four per class and is the standard first look at a classifier.
          The habit worth building is reading precision and recall as a pair: 0.95 and 0.20 is a model that is right
          when it speaks and almost never speaks, which is a completely different failure from 0.20 and 0.95.
        </p>
        <p>
          None of these metrics chooses the threshold. They are all computed <em>at</em> a threshold, and moving it
          trades precision against recall along a curve the model fixed at training time. That is what the
          precision-recall curve plots, and picking the operating point on it is a business decision — how much a missed
          case costs against how much a false alarm costs — not a machine learning one.
        </p>
      </WhyAiml>

      <Takeaway>
        Accuracy divides by everything, precision by the predicted-positive column, recall by the actual-positive row,
        and F1 is their harmonic mean. The deck’s example gives 0.75 four times only because FP = FN.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  multi: (
    <>
      <Para>
        The second half of the deck lifts everything so far from two classes to K. Slide 47 defines the task, and the
        definition contains one condition that decides the whole design.
      </Para>
      <Worked title="The definition, slide 47">
        {`Multi-class classification assigns each input to one of K classes, K > 2.

  Classes        y ∈ {1, 2, …, K}   (or {0, 1, …, K − 1})
  Each example belongs to exactly one class
  Output         a probability distribution over all K classes
                  K
  Probabilities  Σ  P(y = k | x) = 1
                 k=1`}
      </Worked>
      <Para>
        “Exactly one class” is the condition, and “the probabilities sum to 1” is its consequence. Being more sure about
        one class has to mean being less sure about the others, because only one of them can be right. That coupling is
        what softmax provides and what K separate sigmoids would not.
      </Para>

      <Lab>
        <MultiClassLab />
      </Lab>

      <Para>Slide 48 gives the examples, and they are worth noting for how differently sized K can be:</Para>
      <List
        items={[
          <>
            <strong>Handwritten digits (MNIST)</strong> — a 28 × 28 image in, one of ten digits out.
          </>,
          <>
            <strong>Image classification (ImageNet)</strong> — a colour image in, one of a thousand object categories
            out.
          </>,
          <>
            <strong>Text classification</strong> — a news article in, one topic out: politics, sport, technology,
            entertainment, business.
          </>,
          <>
            <strong>Speech recognition</strong> — audio features in, a phoneme class out.
          </>,
        ]}
      />
      <Para>
        Slide 49 then draws three classes in a plane and states the plan in one sentence: we need multiple output
        neurons, one per class, and a way of turning their outputs into a valid probability distribution. Those are the
        next three parts.
      </Para>

      <Terms
        items={[
          {
            term: 'multi-class',
            def: 'K classes with K > 2 and exactly one right answer per example. Not the same as multi-label, where several can be right at once.',
          },
          {
            term: 'probability distribution',
            def: 'A list of non-negative numbers that add to 1, one per possible outcome. Anything else is not a distribution.',
          },
          {
            term: 'Σₖ P(y = k | x) = 1',
            say: 'the sum over k of P of y equals k given x is one',
            def: 'Whatever the input, the model’s beliefs about the K classes add to certainty. It has to answer something.',
          },
          {
            term: 'mutually exclusive',
            def: 'At most one can be true. Class labels in a multi-class problem are mutually exclusive by assumption.',
          },
        ]}
      />

      <Beyond>
        There is an older way of doing this, and knowing it makes the softmax approach look less arbitrary. In{' '}
        <strong>one-vs-all</strong> you train K separate binary classifiers, each answering “is it class k or not?”, and
        take whichever is most confident. It works, but the K models are trained independently, so their probabilities
        need not add to anything at all, and nothing stops two of them being sure at once. Softmax builds the constraint
        into a single model, trains all K weight vectors together, and gets a genuine distribution out. The per-class
        precision and recall of part 25 are still computed one-vs-all, which is where the term will reappear.
      </Beyond>

      <WhyAiml method="the difference between CrossEntropyLoss and BCEWithLogitsLoss on K outputs">
        <p className="mb-2">
          These two are the multi-class and the multi-label answers, and the code looks almost identical. The first
          applies softmax across the K outputs and reads one true class; the second applies a sigmoid to each output
          independently and reads a K-long vector of 0s and 1s. Using the first for a multi-label problem is a real bug
          that trains without complaint.
        </p>
        <p>
          The failure is structural, not a matter of accuracy. Softmax cannot represent “this photo contains a dog{' '}
          <em>and</em> a cat”, because pushing one probability up necessarily pushes the other down. No amount of
          training will fix it, and no metric on the training set will reveal it — the labels themselves have been
          discarded on the way in.
        </p>
      </WhyAiml>

      <Takeaway>
        K classes, exactly one right answer, and K probabilities that add to 1. That last condition is what forces the
        outputs to be coupled, and softmax is how they get coupled.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  onehot: (
    <>
      <Para>Slide 51 rewrites the four components for K classes, and it is nearly the same list again.</Para>
      <Worked title="The components for multi-class, slide 51">
        {`1  Data                input features and class labels y ∈ {1, …, K}
2  Model               a linear model with K output neurons, no hidden layers
3  Activation          softmax, to produce a probability distribution
4  Objective function  categorical cross-entropy loss
5  Learning algorithm  mini-batch stochastic gradient descent

Note: mini-batch SGD now, rather than single-example SGD, for better
efficiency and stability.`}
      </Worked>
      <Para>
        The deck splits the activation out as its own line here, where the binary half folded it into the model. Nothing
        has changed but the presentation — a model is a linear part and an activation, in both halves.
      </Para>
      <Para>
        The data needs a decision first. Slide 52 offers two ways of writing down a class label, and slide 53 says which
        to use.
      </Para>
      <Worked title="One-hot encoding, slide 53">
        {`Convert a class label into a binary vector of length K:
for class k, all zeros except a 1 at position k.

  K = 4:
    class 1:  y = [1, 0, 0, 0]ᵀ
    class 2:  y = [0, 1, 0, 0]ᵀ
    class 3:  y = [0, 0, 1, 0]ᵀ
    class 4:  y = [0, 0, 0, 1]ᵀ

Why:
  treats all classes equally — no implicit ordering
  matches the format of the softmax output
  simplifies the loss computation
  standard in deep learning frameworks`}
      </Worked>

      <Lab>
        <OneHotLab />
      </Lab>

      <Para>
        The first reason is the important one. Writing classes as 1, 2, 3, 4 quietly asserts that class 3 sits between
        class 2 and class 4, and that class 4 is twice class 2. For cat, dog, car and boat none of that is true, and any
        model that takes the numbers at face value will act on the claim anyway.
      </Para>
      <Para>
        The second reason is the practical one. Softmax produces K numbers per example; one-hot gives K numbers per
        example; so the loss can compare them position by position with no conversion in between.
      </Para>

      <Terms
        items={[
          {
            term: 'one-hot',
            def: 'A vector of zeros with a single 1. "Hot" means the one that is on — the name comes from digital circuits.',
          },
          {
            term: 'integer encoding',
            def: 'Writing a class as a plain number, 1 to K. Compact, and it implies an order that usually does not exist.',
          },
          {
            term: 'ordinal',
            def: 'A category that genuinely has an order — small, medium, large. For these, integer encoding is not a mistake.',
          },
          {
            term: 'Y ∈ {0, 1}ᴺˣᴷ',
            say: 'Y in zero-one to the N by K',
            def: 'The label matrix: one row per example, one column per class, exactly one 1 in each row.',
          },
        ]}
      />

      <Beyond>
        Frameworks will often let you skip the encoding, and it is worth knowing why that is not a contradiction.
        PyTorch’s <code>CrossEntropyLoss</code> takes an integer class index rather than a one-hot row — not because the
        maths is different, but because Σₖ yₖ log ŷₖ with a one-hot y is just log ŷ at one position, and indexing
        straight to it avoids building and multiplying a vector that is almost entirely zeros. For K = 1000 that saves
        999 multiplications by zero per example. The one-hot form is the definition; the index is the implementation.
      </Beyond>

      <WhyAiml method="OneHotEncoder for inputs, and why targets are the other case entirely">
        <p className="mb-2">
          One-hot appears twice in a pipeline and for two different reasons. On the <em>input</em> side it encodes a
          categorical feature — city, product type — and there the ML course’s warnings apply: a high-cardinality column
          explodes into thousands of near-empty ones. On the <em>output</em> side it encodes the target, and there is no
          cardinality problem because K is the number of classes you already have.
        </p>
        <p>
          The output-side use is also where a silent bug lives. If the label vectors for a multi-class problem contain
          more than one 1, you have a multi-label problem written in multi-class clothing, and softmax will train
          against a target it cannot represent. Checking that every row of Y sums to exactly 1 is a two-line assertion
          that has saved a great many afternoons.
        </p>
      </WhyAiml>

      <Takeaway>
        One-hot turns a class name into a vector with a single 1. It refuses to imply an order between classes and it
        matches the shape softmax produces, which is why the loss then needs no conversion at all.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  weights: (
    <>
      <Para>
        The binary model had one weight vector. K classes need K of them, and slide 54 stacks them side by side into a
        single matrix.
      </Para>
      <Worked title="The weight matrix, slide 54">
        {`             ⎡ w₀,₁  w₀,₂  ⋯  w₀,ᴋ ⎤
             ⎢ w₁,₁  w₁,₂  ⋯  w₁,ᴋ ⎥
W ∈ ℝ⁽ᵈ⁺¹⁾ˣᴷ = ⎢ w₂,₁  w₂,₂  ⋯  w₂,ᴋ ⎥
             ⎢  ⋮     ⋮    ⋱   ⋮   ⎥
             ⎣ w_d,₁ w_d,₂ ⋯  w_d,ᴋ ⎦

  each column wₖ holds the weights for class k
  each class has its own linear model
  row 0 holds the bias terms for all classes
  total parameters: (d + 1) × K`}
      </Worked>
      <Para>
        Read it by column and there is nothing new: column k is a weight vector exactly like the binary one, and it
        produces one score for class k. The matrix is bookkeeping, and it is what lets one matrix product do all K
        models at once.
      </Para>

      <Lab>
        <WeightMatrixLab />
      </Lab>

      <Worked title="The logits, slide 56">
        {`            ⎡ w₁ᵀx ⎤     ⎡ z₁ ⎤
z = Wᵀx  =  ⎢ w₂ᵀx ⎥  =  ⎢ z₂ ⎥                          (15)
            ⎢  ⋮   ⎥     ⎢ ⋮  ⎥
            ⎣ w_Kᵀx⎦     ⎣ z_K⎦

  zₖ = wₖᵀx = w₀,ₖ + w₁,ₖx₁ + ⋯ + w_d,ₖ x_d

For the whole dataset:   Z = XW ∈ ℝᴺˣᴷ                    (16)

Each row of Z holds the logits for one example.
Logits are unbounded values in (−∞, ∞) — not probabilities yet.`}
      </Worked>
      <Para>
        Two shapes to keep straight, and they are the ones exams ask about. For a single example, z = Wᵀx gives a column
        of K numbers. For a whole dataset, Z = XW gives an N × K matrix, one row per example. The transpose appears in
        one and not the other purely because of how the vectors are laid out.
      </Para>
      <Para>
        And the last line matters: nothing couples the columns yet. Each class computes its own score in complete
        ignorance of the others, and those scores can be any real numbers at all. Turning them into a distribution is
        the next part’s job.
      </Para>

      <Terms
        items={[
          {
            term: 'W',
            def: 'The weight matrix, (d + 1) rows by K columns. One column per class, and the first row holds all the biases.',
          },
          {
            term: 'wₖ',
            say: 'w sub k',
            def: 'Column k of W: the weight vector belonging to class k. It behaves exactly like the binary model’s w.',
          },
          {
            term: 'zₖ',
            say: 'z sub k',
            def: 'The logit for class k — that class’s raw score for this input, before anything is normalised.',
          },
          {
            term: 'Z = XW',
            def: 'The logit matrix for the whole dataset. N rows by K columns: one row of K scores per example.',
          },
          {
            term: 'unbounded',
            def: 'Free to be any real number, positive or negative, large or small. Logits are; probabilities are not.',
          },
        ]}
      />

      <Beyond>
        The parameter count is worth being able to state from memory, because it is a one-mark question. A binary model
        on d features has d + 1 parameters. A K-class model has (d + 1) × K. For MNIST — d = 784 pixels, K = 10 — that
        is 785 × 10 = 7 850 parameters, which is small enough to train in seconds on a laptop and still reaches about
        92% accuracy. That number is the baseline every convolutional network in module 7 is measured against.
      </Beyond>
      <Beyond>
        Softmax has one degree of freedom too many, and it is a nice thing to notice. Because adding a constant to every
        logit changes nothing, adding a constant to a whole row of W changes nothing either — so the K weight vectors
        are not uniquely determined. It causes no trouble in practice, and it is why some texts fix wₖ = 0 for one class
        and only learn K − 1 vectors, which recovers exactly logistic regression when K = 2.
      </Beyond>

      <WhyAiml method="nn.Linear(d, K), whose weight tensor is this matrix transposed">
        <p className="mb-2">
          <code>nn.Linear(in_features, out_features)</code> holds a weight tensor of shape (out, in) — the transpose of
          the W on this slide — and a separate bias vector of length out. The arithmetic is identical; the layout
          differs because PyTorch computes xWᵀ + b rather than XW with an augmented x. Shape errors when writing a layer
          by hand are almost always this transpose.
        </p>
        <p>
          The Z = XW form is why classification on a GPU is fast. Scoring 128 examples against 1 000 classes is one
          matrix multiply, not 128 000 dot products, and that single operation is exactly what the hardware is built
          for. The batching in part 21 is a consequence of this line, not an independent idea.
        </p>
      </WhyAiml>

      <Takeaway>
        W has one column per class, so K linear models live in one matrix. z = Wᵀx for one example and Z = XW for the
        dataset, and the K logits are unbounded scores that are not yet probabilities.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  softmax: (
    <>
      <Para>
        K unbounded scores go in; one probability distribution has to come out. Slide 57 gives the function that does
        it, and it is a two-step recipe: make everything positive, then divide by the total.
      </Para>
      <Worked title="The softmax function, slide 57">
        {`                     e^{zₖ}
softmax(z)ₖ  =  ─────────────────      for k = 1, 2, …, K       (17)
                  K
                  Σ  e^{zⱼ}
                 j=1

                          e^{zₖ}
ŷₖ = P(y = k | x)  =  ─────────────                             (18)
                        Σⱼ e^{zⱼ}`}
      </Worked>
      <Para>
        Why exponentiate rather than, say, divide each score by the sum directly? Because logits can be negative, and a
        negative probability is not a probability. e^z is positive for every real z, so after the division the results
        are guaranteed to sit in (0, 1) — and never exactly at either end, which is what keeps the logarithm in the loss
        finite.
      </Para>

      <Lab>
        <SoftmaxLab />
      </Lab>

      <Para>Slide 58 lists six properties, and every one of them is used somewhere later in the session:</Para>
      <List
        items={[
          <>
            <strong>Output range</strong>: ŷₖ ∈ (0, 1) for every k.
          </>,
          <>
            <strong>Sums to one</strong>: Σₖ ŷₖ = 1, by construction — the denominator is the sum of the numerators.
          </>,
          <>
            <strong>Preserves order</strong>: if zᵢ {'>'} zⱼ then ŷᵢ {'>'} ŷⱼ, so arg max of the logits is arg max of
            the probabilities.
          </>,
          <>
            <strong>Translation invariant</strong>: softmax(z) = softmax(z + c) for any constant c. This is what part 26
            turns into a numerical fix.
          </>,
          <>
            <strong>Differentiable</strong>: so gradient-based learning works.
          </>,
          <>
            <strong>Reduces to sigmoid</strong>: with K = 2 it is the sigmoid again.
          </>,
        ]}
      />
      <Para>
        The deck adds one sentence under the list that is easy to skim past: the exponential amplifies differences.
        Logits of 2 and 1 differ by 1, but e² is nearly three times e¹ — so a small edge in score becomes a large edge
        in probability. That is the “soft” arg max the name refers to: not quite winner-takes-all, but leaning that way.
      </Para>
      <Worked title="The numerical example, slide 59">
        {`z = [2.0, 1.0, 0.1]ᵀ,  K = 3

Step 1 — exponentials
  e^2.0 ≈ 7.39     e^1.0 ≈ 2.72     e^0.1 ≈ 1.11

Step 2 — the sum
  Σⱼ e^{zⱼ} = 7.39 + 2.72 + 1.11 = 11.22

Step 3 — normalise
  ŷ₁ = 7.39/11.22 ≈ 0.659
  ŷ₂ = 2.72/11.22 ≈ 0.242
  ŷ₃ = 1.11/11.22 ≈ 0.099

Step 4 — predicted class:  arg maxₖ ŷₖ = 1`}
      </Worked>
      <Para>
        The lab opens on exactly these logits and reproduces all three probabilities. Note how much the exponential has
        spread things: the scores 2.0, 1.0 and 0.1 are evenly spaced-ish, and the probabilities are 0.66, 0.24 and 0.10.
      </Para>

      <Terms
        items={[
          {
            term: 'softmax',
            def: 'A smooth version of "pick the largest". It leans towards the biggest logit without ever committing entirely.',
          },
          {
            term: 'normalise',
            def: 'Divide by the total so the parts add to 1. It is the second step of softmax and the only reason the outputs are a distribution.',
          },
          {
            term: 'translation invariant',
            def: 'Unchanged when the same constant is added to every input. Softmax is; the sigmoid is not.',
          },
          {
            term: 'arg max',
            say: 'arg max',
            def: 'The index of the largest entry, not the largest value. arg max of [0.1, 0.7, 0.2] is 2.',
          },
          {
            term: 'Σⱼ e^{zⱼ}',
            say: 'the sum over j of e to the z-j',
            def: 'The normaliser, or partition function. The one number every output is divided by.',
          },
        ]}
      />

      <Beyond>
        The K = 2 claim is worth checking rather than believing, because it ties the two halves of the session together.
        With two classes, ŷ₁ = e^{'{z₁}'}/(e^{'{z₁}'} + e^{'{z₂}'}). Divide top and bottom by e^{'{z₁}'} and you get
        1/(1 + e^{'{z₂ − z₁}'}), which is σ(z₁ − z₂). So a two-class softmax is a sigmoid applied to the{' '}
        <em>difference</em> of the logits — the two scores were always one degree of freedom pretending to be two. That
        is the same redundancy that made W non-unique in the previous part.
      </Beyond>

      <WhyAiml method="F.softmax, and why CrossEntropyLoss expects raw logits instead">
        <p className="mb-2">
          The single commonest PyTorch mistake in classification is applying softmax and then passing the result to{' '}
          <code>CrossEntropyLoss</code>, which applies its own <code>log_softmax</code> internally. The model still
          trains, just badly: softmax has been applied twice, the distribution is flattened, and the gradients are much
          smaller than they should be. The loss goes down slowly and nothing errors.
        </p>
        <p>
          Order preservation is the useful practical property. At inference, if all you need is the predicted class, you
          can take the arg max of the logits and skip the softmax entirely — the answer is identical. You need the
          softmax for the confidence score and for training, and nothing else.
        </p>
      </WhyAiml>

      <Takeaway>
        Exponentiate, then divide by the total. The result is positive, sums to 1, keeps the order of the logits,
        ignores a constant added to all of them, and collapses to the sigmoid when K = 2.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  catce: (
    <>
      <Para>
        Slide 60 collects the forward pass into three lines, and there is nothing in it that has not already appeared.
      </Para>
      <Worked title="The complete forward pass, slide 60">
        {`Step 1 — logits          Z = XW ∈ ℝᴺˣᴷ                     (19)
Step 2 — probabilities   Ŷ = softmax(Z) ∈ [0, 1]ᴺˣᴷ         (20)
                         (applied row-wise, to each example)
Step 3 — predict         k̂ = arg maxₖ ŷₖ                     (21)

Each row of Ŷ is a probability distribution over K classes.`}
      </Worked>
      <Para>
        The words <strong>row-wise</strong> are load-bearing. Softmax normalises within one example, across its K
        classes. Normalising down a column instead — across examples, within a class — is a real bug, it produces
        numbers that still look like probabilities, and it is the most likely cause of the “softmax outputs do not sum
        to 1” symptom on the debugging checklist.
      </Para>
      <Worked title="Categorical cross-entropy, slide 61">
        {`           1   N   K
J(W)  =  − ───  Σ   Σ   yₖ⁽ⁱ⁾ log( ŷₖ⁽ⁱ⁾ )                    (22)
           N  i=1 k=1

Goal: minimise J(W) to find the optimal weights W*.`}
      </Worked>
      <Para>
        The inner sum runs over K classes, but y is one-hot, so K − 1 of its terms are multiplied by zero. What survives
        is a single −log ŷ for whichever class was actually right. The loss never even looks at the probabilities
        assigned to the wrong classes.
      </Para>

      <Lab>
        <CatCeLab />
      </Lab>

      <Para>
        Slide 62 tabulates that behaviour with a true class of 2, and the lab reproduces every row: a probability of 0.8
        on the true class costs 0.22, 0.5 costs 0.69, 0.2 costs 1.61, and 0.05 costs 3.00. Confidence in the wrong place
        is expensive, and the cost has no upper limit.
      </Para>
      <Para>Slide 63 gives the reasons, and they are the binary four with one addition:</Para>
      <List
        items={[
          <>
            <strong>Probabilistic</strong> — it is the negative log-likelihood, as in the binary case.
          </>,
          <>
            <strong>Handles K classes naturally</strong> — no pairwise comparisons, no separate models.
          </>,
          <>
            <strong>Works with softmax</strong> — the derivatives cancel to give a numerically stable gradient.
          </>,
          <>
            <strong>Penalises wrong confidence</strong> — heavily, and without a ceiling.
          </>,
          <>
            <strong>Convex</strong> for a linear model, so there is a single global minimum.
          </>,
        ]}
      />
      <Para>
        And the slide closes by connecting the two halves. With K = 2, put y = [1 − y, y] and ŷ = [1 − ŷ, ŷ] into −Σₖ yₖ
        log ŷₖ and out comes −[y log ŷ + (1 − y) log(1 − ŷ)] — the binary loss of part 7. They are the same formula
        written for a different number of classes.
      </Para>

      <Terms
        items={[
          {
            term: 'categorical cross-entropy',
            def: 'The multi-class loss: −Σₖ yₖ log ŷₖ, averaged over examples. Also called softmax loss or log loss.',
          },
          {
            term: 'row-wise',
            def: 'Applied along each row separately. For softmax it means: normalise within one example, across its classes.',
          },
          {
            term: 'Ŷ',
            say: 'Y-hat',
            def: 'The matrix of predicted probabilities, N rows by K columns. Every row adds to 1.',
          },
          {
            term: 'yₖ⁽ⁱ⁾',
            say: 'y sub k super i',
            def: 'Entry k of the one-hot label for example i. It is 1 for the true class and 0 for the rest.',
          },
          {
            term: 'W*',
            say: 'W star',
            def: 'The weight matrix that minimises J. The star means "the best one", not a footnote or a conjugate.',
          },
        ]}
      />

      <Beyond>
        There is a second reading of cross-entropy that explains the name, and it is worth having. Information theory
        says the cost of describing an outcome you thought had probability p is −log p bits. So the loss is literally
        the number of bits of surprise: a model that gives the right answer probability 1 is never surprised and pays
        nothing, and a model that gives it probability 0.05 pays 3 nats of surprise. Minimising cross-entropy is
        minimising how astonished the model is by the truth — which is why a loss of log K at the start of training, the
        value for a uniform guess, is exactly the surprise of knowing nothing.
      </Beyond>

      <WhyAiml method="the fused log_softmax + NLLLoss inside CrossEntropyLoss">
        <p className="mb-2">
          The starting loss is the first thing to check on any multi-class run. With W near zero every class gets about
          1/K, so J starts near log K — about 2.30 for MNIST’s ten classes and 6.91 for ImageNet’s thousand. A run that
          starts far from log K has a bug in the labels or the output layer, and finding it in the first ten seconds
          rather than after an hour of training is worth the habit.
        </p>
        <p>
          The reason the loss and the activation are fused into one operation is the cancellation. log(softmax(z)) can
          be computed as zₖ − log Σⱼ e^{'{zⱼ}'}, which never forms the tiny probability at all, so no precision is lost
          and the gradient comes out as ŷ − y directly. That is the same fusion that <code>BCEWithLogitsLoss</code>{' '}
          performs on the binary side.
        </p>
      </WhyAiml>

      <Takeaway>
        Z = XW, softmax row-wise, then arg max. The loss reads only the probability given to the true class, its cost is
        −log of that number, and with K = 2 it is the binary cross-entropy again.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 21 */
  minibatch: (
    <>
      <Para>
        Slide 65 puts the three ways of computing a gradient side by side, and the third one is what everything in
        practice actually uses.
      </Para>
      <Worked title="The three variants, slide 65">
        {`1  Batch gradient descent
     uses all N examples per update
     slow but stable; the gradient is exact

2  Stochastic gradient descent
     uses 1 random example per update
     fast but noisy, and unstable

3  Mini-batch SGD — the best of both
     uses a small batch of B examples per update, 1 < B ≪ N
     typical batch sizes: B ∈ {32, 64, 128, 256, 512}
     a good balance of speed and stability
     standard in modern deep learning`}
      </Worked>
      <Para>Slide 66 gives four reasons, and the first is not about mathematics at all:</Para>
      <List
        items={[
          <>
            <strong>Computational efficiency</strong> — a batch is one matrix multiplication, which is what a GPU is
            built for. Processing B examples at once is far quicker than B times processing one.
          </>,
          <>
            <strong>Gradient estimation</strong> — averaging B noisy gradients gives a much less noisy one, so
            convergence is steadier.
          </>,
          <>
            <strong>Generalisation</strong> — some noise remains, and it still helps escape sharp minima.
          </>,
          <>
            <strong>Memory efficiency</strong> — datasets larger than memory can be loaded and processed a batch at a
            time.
          </>,
        ]}
      />
      <Worked title="Batch, iteration, epoch, slide 67">
        {`Batch size B    how many examples go into one update
  small   32–64      more noise, faster iterations
  medium  128–256    balanced
  large   512–1024   less noise, slower convergence

Iteration    one weight update — that is, one mini-batch
Epoch        one complete pass through the entire dataset

                         ⌈ N ⌉
Iterations per epoch  =  ⌈ ─ ⌉                              (23)
                         ⌈ B ⌉

N = 60 000, B = 128:   ⌈60000/128⌉ = 469 iterations per epoch
After 10 epochs:       469 × 10 = 4 690 weight updates`}
      </Worked>

      <Lab>
        <MiniBatchLab />
      </Lab>

      <Para>
        The three words are worth separating carefully, because they are routinely confused. The number of{' '}
        <strong>examples seen</strong> after T epochs is N × T, whatever B is. The number of <strong>updates</strong> is
        ⌈N/B⌉ × T, which depends on B entirely. Bigger batches mean fewer, better steps; smaller batches mean more,
        worse ones.
      </Para>

      <Terms
        items={[
          {
            term: 'mini-batch',
            def: 'A small group of examples used for one update. B is typically 32 to 512, and almost always a power of two.',
          },
          {
            term: 'B',
            def: 'The batch size. The one hyperparameter that mini-batch SGD adds compared with plain SGD.',
          },
          {
            term: '⌈x⌉',
            say: 'ceiling of x',
            def: 'Round up to the next whole number. ⌈468.75⌉ = 469: the last batch of an epoch is short, but it is still a batch.',
          },
          {
            term: '≪',
            say: 'much less than',
            def: 'Very much smaller. 1 < B ≪ N says the batch is bigger than one example and far smaller than the dataset.',
          },
          {
            term: 'iteration',
            def: 'One weight update. Not one epoch, and under mini-batch SGD not one example either.',
          },
        ]}
      />

      <Beyond>
        There is a rule of thumb worth knowing for why bigger batches disappoint. The standard error of the mean falls
        as 1/√B, so going from B = 32 to B = 128 costs four times the computation per step and reduces the gradient
        noise by only a factor of two. That is diminishing returns in a very concrete form, and it is the real reason
        the batch sizes people use cluster in the low hundreds rather than the thousands.
      </Beyond>
      <Beyond>
        Slide 71’s comparison table gives advantages and disadvantages for small, medium and large batches. It ends with
        a rule-of-thumb line in red that runs off the bottom of the page and is cut in half — only the numbers 128 and
        256 survive intact. The table itself is complete and says what it needs to: medium batches of 128 to 256 are the
        “standard choice”. The clipped line is not reproduced here because it cannot be read in full.
      </Beyond>

      <WhyAiml method="DataLoader(batch_size=…), and the learning rate that has to move with it">
        <p className="mb-2">
          Batch size and learning rate are not independent, which is the trap when someone hands you a config and you
          change one number. A larger batch gives a less noisy gradient, so a larger η becomes safe — the common
          heuristic is to scale η with B. Doubling the batch and leaving η alone often makes training worse, not better,
          and it looks like the larger batch was the problem.
        </p>
        <p>
          The powers-of-two convention is not superstition either. GPU memory and the tensor cores inside it are
          organised in powers of two, so a batch of 128 is measurably faster than one of 100 despite being larger. It is
          one of the few places where a round decimal number is the wrong choice.
        </p>
      </WhyAiml>

      <Takeaway>
        Mini-batch SGD uses B examples per update, with B between 32 and 512. An epoch is ⌈N/B⌉ iterations, examples
        seen depends only on the epochs, and updates depend entirely on B.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 22 */
  mbgrad: (
    <>
      <Para>
        The gradient for a mini-batch is the average of the gradients of the examples in it. Slide 68 writes that as a
        sum and then, much more usefully, as a single matrix product.
      </Para>
      <Worked title="The mini-batch gradient, slide 68">
        {`                  1
∇J_B(W)   =      ───   Σ    ∇ℓ(W; x⁽ⁱ⁾, y⁽ⁱ⁾)                (24)
                  B   i∈B

For categorical cross-entropy with softmax:

                  1
∇_W J_B   =      ─── X_Bᵀ ( Ŷ_B − Y_B )                      (25)
                  B

  X_B ∈ ℝᴮˣ⁽ᵈ⁺¹⁾    the mini-batch inputs
  Ŷ_B ∈ ℝᴮˣᴷ        the predicted probabilities
  Y_B ∈ ℝᴮˣᴷ        the one-hot true labels`}
      </Worked>
      <Para>
        Equation (25) is the multi-class version of (ŷ − y)x, and the resemblance is exact. Ŷ − Y is the error for every
        example and every class. Multiplying by X_Bᵀ shares each error out among the weights in proportion to the
        inputs. Dividing by B makes it an average.
      </Para>

      <Lab>
        <MbGradLab />
      </Lab>

      <Para>
        Check the shapes, because it is the fastest way to be sure you have written it the right way round. X_Bᵀ is (d +
        1) × B, the error block is B × K, so the product is (d + 1) × K — exactly the shape of W, one number per weight.
        If the shapes do not line up, the formula is wrong before any numbers are computed.
      </Para>
      <Worked title="The update rule and the algorithm, slides 69–70">
        {`W⁽ᵗ⁺¹⁾ = W⁽ᵗ⁾ − η ∇J_B(W⁽ᵗ⁾)                                (26)
                    η
W⁽ᵗ⁺¹⁾ = W⁽ᵗ⁾ −  ─── X_Bᵀ ( Ŷ_B − Y_B )                     (27)
                    B

Algorithm 2 — mini-batch SGD for multi-class classification
 1  initialise W ~ N(0, 0.01)          // small random values
 2  for epoch = 1 to T do
 3      shuffle dataset D
 4      for each mini-batch B of size B do
 5          Z_B = X_B W                // compute logits
 6          Ŷ_B = softmax(Z_B)         // apply softmax
 7          ∇J = (1/B) X_Bᵀ(Ŷ_B − Y_B) // compute gradient
 8          W ← W − η∇J                // update weights
 9          optional: compute total loss for monitoring
10  return W`}
      </Worked>
      <Para>
        Line 1 has changed from the binary algorithm, and deliberately. There it said “w = 0 or small random values”;
        here it says small random values only. The reason is coming in module 5, where zeros make every hidden unit
        identical for ever — the habit is being built now, before it becomes compulsory.
      </Para>

      <Terms
        items={[
          {
            term: '∇J_B',
            say: 'grad J sub B',
            def: 'The gradient averaged over one mini-batch. An estimate of the true gradient, better than one example’s and cheaper than all N.',
          },
          {
            term: 'X_Bᵀ',
            say: 'X sub B transpose',
            def: 'The mini-batch input matrix, tipped over. Rows become columns, which is what makes the shapes fit.',
          },
          {
            term: 'i ∈ B',
            say: 'i in B',
            def: 'i runs over the examples in this mini-batch. The ∈ means "is a member of".',
          },
          {
            term: 'N(0, 0.01)',
            say: 'normal zero, nought point nought one',
            def: 'A Gaussian with mean 0 and a small spread. Weights drawn from it are near zero but not identical to each other.',
          },
        ]}
      />

      <Beyond>
        Equation (25) hides a genuinely surprising cancellation. Differentiating the softmax alone gives a K × K
        Jacobian matrix for every example — a messy object with ŷᵢ(δᵢⱼ − ŷⱼ) in each entry. Differentiating the
        cross-entropy and multiplying by that Jacobian makes almost all of it disappear, leaving just ŷ − y. This is the
        same cancellation as the sigmoid case in part 10, one dimension up, and it is exactly why frameworks implement
        softmax-plus-cross-entropy as a single operation instead of two.
      </Beyond>

      <WhyAiml method="loss.backward() on a batch, and reduction='mean'">
        <p className="mb-2">
          The 1/B is what makes the learning rate independent of the batch size, and dropping it is a real bug with a
          confusing signature. With <code>{"reduction='sum'"}</code> the gradients are B times larger, which is the same
          as multiplying η by B — so a config that worked at B = 32 explodes at B = 256 and it looks as though the
          larger batch broke the model.
        </p>
        <p>
          It also matters for the short final batch of an epoch. If N is not divisible by B, that batch has fewer than B
          examples, and averaging over its own true size rather than over B is what keeps its gradient the same
          magnitude as every other. Frameworks handle it; hand-written loops frequently do not.
        </p>
      </WhyAiml>

      <Takeaway>
        ∇J = (1/B)X_Bᵀ(Ŷ_B − Y_B): the errors, shared out by the inputs, averaged over the batch. Its shape must match
        W, and the 1/B is what keeps η meaning the same thing at every batch size.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 23 */
  mcexample: (
    <>
      <Para>
        Slides 73 to 78 run one mini-batch update by hand. Four points, three classes, two features, B = 2 and η = 0.1 —
        small enough that every entry can be checked.
      </Para>
      <Worked title="The setup, slides 73–74">
        {`x₁  x₂  class            ⎡1 1 2⎤        ⎡1 0 0⎤   class 1
 1   2    1              ⎢1 2 1⎥        ⎢0 1 0⎥   class 2
 2   1    2          X = ⎢1 2 3⎥    Y = ⎢1 0 0⎥   class 1
 2   3    1              ⎣1 3 2⎦        ⎣0 0 1⎦   class 3
 3   2    3

                              ⎡ 0.1 −0.1  0.2⎤
K = 3, d = 2, N = 4      W⁽⁰⁾ = ⎢ 0.2  0.1 −0.1⎥
B = 2, η = 0.1                ⎣−0.1  0.2  0.1⎦`}
      </Worked>

      <Lab>
        <McWorkedLab />
      </Lab>

      <Para>
        The first mini-batch is examples 1 and 2. Their logits come from Z_B = X_B W⁽⁰⁾: row 1 is [1, 1, 2] against each
        column of W, giving [0.1, 0.4, 0.3]; row 2 is [1, 2, 1] against the same columns, giving [0.4, 0.3, 0.1].
        Softmax row-wise turns those into [0.280, 0.378, 0.342] and [0.378, 0.342, 0.280].
      </Para>
      <Para>
        Subtracting the one-hot labels gives the error block, multiplying by X_Bᵀ and dividing by 2 gives the gradient,
        and stepping with η = 0.1 gives W⁽¹⁾. The lab does all of it and shows the working for any entry you press.
      </Para>

      <Caution>
        <p className="mb-2">
          Three of the printed numbers on slides 75 to 77 do not follow from the deck’s own X, Y and W⁽⁰⁾. The method is
          not in question — the other fifteen entries agree to three decimal places — but these three are worth knowing
          about before an exam, because reproducing them would mean reproducing an arithmetic slip.
        </p>
        <p className="mb-2">
          <strong>Slide 75, row 2 of Z_B.</strong> Printed as [0.4, 0.2, 0.1]. The middle entry is [1, 2, 1] against
          column 2 of W⁽⁰⁾, which is (−0.1, 0.1, 0.2): that is −0.1 + 0.2 + 0.2 = <strong>0.3</strong>, not 0.2. The
          other two entries are right.
        </p>
        <p className="mb-2">
          <strong>Slide 76, ŷ⁽²⁾.</strong> Printed as [0.387, 0.315, 0.298]. From the correct logits [0.4, 0.3, 0.1] it
          is [0.378, 0.342, 0.280]. There is a quick check that needs no calculator: [0.4, 0.3, 0.1] is a rearrangement
          of example 1’s [0.1, 0.4, 0.3], and softmax rearranges its output the same way — so ŷ⁽²⁾ has to be example 1’s
          three numbers in a different order, which the printed row is not.
        </p>
        <p className="mb-2">
          <strong>Slide 77, the first entry of row 2 of ∇J.</strong> Printed as −0.024. From the correct Ŷ_B it is
          +0.018. Even taking the deck’s own Ŷ_B at face value, that entry works out at (1 × −0.720 + 2 × 0.387)/2 =
          +0.027 — so the sign is wrong on the deck’s own figures, not only on the corrected ones.
        </p>
        <p>
          W⁽¹⁾ on slide 78 follows correctly from the gradient printed above it, so the only discrepancy there is the
          one inherited from that entry. The lab computes everything from the stated inputs and will show you the
          printed values beside them.
        </p>
      </Caution>

      <Para>
        What the example is really teaching survives all of that intact, and it is the sequence: logits, softmax
        row-wise, subtract the one-hot labels, multiply by X_Bᵀ, divide by B, step against the gradient. That is the
        answer an exam question wants, and it is worth being able to write it out without the numbers in front of you.
      </Para>

      <Terms
        items={[
          {
            term: 'mini-batch',
            def: 'Here the first two rows of X and Y. In a real run the rows would be a random selection, taken fresh each epoch.',
          },
          {
            term: 'Z_B',
            say: 'Z sub B',
            def: 'The logits for the examples in this batch: B rows, K columns.',
          },
          {
            term: 'Ŷ_B − Y_B',
            def: 'The error block. Negative where the true class was under-predicted, positive on the classes that stole the probability.',
          },
        ]}
      />

      <Beyond>
        Look at the signs in the error block and the pattern is easy to remember. The true class always gets a negative
        entry, because ŷ there is below 1. Every other class gets a positive entry, because ŷ there is above 0. So the
        update pushes the true class’s weights up and every other class’s weights down, for every single example — which
        is precisely the coupling that softmax introduced and that K independent sigmoids would not have.
      </Beyond>

      <WhyAiml method="checking a hand-written training step against autograd">
        <p className="mb-2">
          This is the exercise that finds bugs. Take one small batch, compute Z, Ŷ, the error block and the gradient by
          hand or in a spreadsheet, then compare against what the framework reports. If they disagree, the bug is
          upstream of the optimiser — a transposed matrix, a softmax down the wrong axis, a label vector that is not
          one-hot.
        </p>
        <p>
          It is also a reminder to check a deck, a blog post or a generated answer rather than trusting it. Everything
          in this example is verifiable in about two minutes of arithmetic, and three entries in a published set of
          slides do not survive that check. Reproducing a printed number is not the same as checking it.
        </p>
      </WhyAiml>

      <Takeaway>
        Logits, softmax, subtract the one-hot labels, multiply by X_Bᵀ, divide by B, step. The method is exactly right;
        three of the deck’s printed numbers are not, and the lab computes all of them from the stated inputs.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 24 */
  inference: (
    <>
      <Para>
        Training is over; the weights are fixed. Slide 81 says what happens when a new example arrives, and it is the
        forward pass with everything after the prediction removed.
      </Para>
      <Worked title="Inference, slide 81">
        {`For a new input x_new:

  compute logits    z = Wᵀ x_new                              (28)
  apply softmax     ŷ = softmax(z)                            (29)
  predict class     k̂ = arg maxₖ ŷₖ                           (30)

  optional: report the confidence scores — the probabilities ŷ`}
      </Worked>
      <Worked title="The example, slide 82">
        {`Trained model, K = 3, new input x = [1, 2.5, 1.8]ᵀ

Step 1   z = Wᵀx = [1.2, 2.5, 0.8]ᵀ

Step 2   e^1.2 ≈ 3.32   e^2.5 ≈ 12.18   e^0.8 ≈ 2.23
         sum = 3.32 + 12.18 + 2.23 = 17.73

              ⎡ 3.32/17.73 ⎤   ⎡0.187⎤
         ŷ =  ⎢12.18/17.73 ⎥ = ⎢0.687⎥
              ⎣ 2.23/17.73 ⎦   ⎣0.126⎦

Step 3   k̂ = arg maxₖ ŷₖ = 2      (class 2, with 68.7% confidence)`}
      </Worked>

      <Lab>
        <InferenceLab />
      </Lab>

      <Para>
        Two things about inference are worth stating plainly. There is no label, no loss and no gradient — the whole
        backward half of the graph from part 13 does not exist here. And step 2 is optional if all you want is the
        answer: arg max of the logits gives the same class as arg max of the probabilities, because the exponential
        preserves order. You need the softmax for the confidence, and for training.
      </Para>
      <Para>
        The last line of the slide, “optional: report confidence scores”, is the one worth taking seriously. Arg max
        never abstains: it returns a class even when the three probabilities are 0.34, 0.33 and 0.33. Pull the logits
        together in the lab and watch the answer stay the same while the confidence collapses — the class label alone
        cannot tell those two situations apart.
      </Para>

      <Terms
        items={[
          {
            term: 'inference',
            def: 'Using a trained model to make predictions. Also called prediction, scoring, or serving. No learning happens.',
          },
          {
            term: 'confidence score',
            def: 'The probability the model gave its chosen class. Useful, and not the same thing as being right.',
          },
          {
            term: 'x_new',
            def: 'An example the model has never seen. It still needs its leading 1 and the same scaling as the training data.',
          },
          {
            term: 'k̂',
            say: 'k-hat',
            def: 'The predicted class index. The hat marks it as the model’s answer rather than the truth.',
          },
        ]}
      />

      <Beyond>
        A confident model is not the same as a correct one, and this is the practical caveat on the whole idea of a
        confidence score. Because the loss rewards confidence on the training set, a well-fitted network is usually{' '}
        <em>overconfident</em> on new data — it reports 99% and is right about 90% of the time. Fixing it is called
        calibration, and the standard method is temperature scaling: divide every logit by a single number T {'>'} 1
        chosen on the validation set, which flattens the probabilities without changing a single prediction. That it
        cannot change any prediction is a direct consequence of order preservation.
      </Beyond>

      <WhyAiml method="model.eval(), torch.no_grad(), and the preprocessing that must travel with the weights">
        <p className="mb-2">
          The commonest deployment bug is not in the model at all: it is that the scaling applied at training time was
          not applied at inference. The weights were learnt for standardised features, the served request arrives raw,
          and the logits are nonsense. The mean and standard deviation used for scaling are part of the model and have
          to be saved alongside it, which is exactly what a scikit-learn <code>Pipeline</code> stores.
        </p>
        <p>
          The other habit is thresholding on the confidence rather than on the arg max. A system that answers only when
          the top probability clears some bar, and passes the rest to a person, is usually far more useful than one that
          answers everything — and the confidence score is the only thing that makes that policy possible.
        </p>
      </WhyAiml>

      <Takeaway>
        Logits, softmax, arg max. The confidence is the probability on the chosen class, arg max never abstains, and the
        softmax step is only needed if you want the number.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 25 */
  mcmetrics: (
    <>
      <Para>
        Slide 84 lifts the evaluation of part 15 from two classes to K. The definitions do not change; what changes is
        that there are now K of each, and a decision to make about how to combine them.
      </Para>
      <Worked title="The metrics, slides 84–85">
        {`                        number correct     1   N
Accuracy  =  ──────────────────────────  =  ───  Σ  𝟙[ŷ⁽ⁱ⁾ = y⁽ⁱ⁾]   (31)
                        N                    N  i=1

Confusion matrix: K × K
  row i, column j: how many class i examples were predicted as class j
  diagonal: correct predictions; off-diagonal: misclassifications

Slide 85’s example:
                  predicted
             class 1  class 2  class 3
  actual 1      45       3        2         row sum 50
  actual 2       5      38        7         row sum 50
  actual 3       2       4       44         row sum 50

  accuracy = (45 + 38 + 44)/150 = 0.847`}
      </Worked>

      <Lab>
        <McMetricsLab />
      </Lab>

      <Para>
        Precision and recall are computed one class at a time, treating that class as “positive” and everything else as
        “negative”. For class k, the diagonal entry is TP; the rest of row k is FN, the examples of class k that got
        away; the rest of column k is FP, the examples of other classes wrongly called k.
      </Para>
      <Worked title="Per-class metrics, slide 86">
        {`                 TPₖ                            TPₖ
Precisionₖ  =  ─────────        Recallₖ  =  ─────────           (32, 33)
                TPₖ + FPₖ                    TPₖ + FNₖ

                 Precisionₖ × Recallₖ
F1ₖ  =  2 · ──────────────────────────                              (34)
                 Precisionₖ + Recallₖ`}
      </Worked>
      <Para>Slide 87 then asks how to combine K precisions into one number, and gives two answers:</Para>
      <Worked title="Averaging strategies, slide 87">
        {`                  1   K
Macro     =      ───  Σ  Precisionₖ                             (35)
                  K  k=1
  treats all classes equally; good when they are equally important

                  K
Weighted  =       Σ  wₖ · Precisionₖ     with  wₖ = Nₖ/N        (36)
                 k=1
  accounts for class imbalance; good when some classes are commoner`}
      </Worked>
      <Para>
        On slide 85’s matrix the two barely differ, because all three classes have exactly 50 examples and the weights
        are all 1/3. Press the imbalanced preset in the lab and they separate sharply — macro lets a tiny class drag the
        whole score down, weighted lets a large one carry it.
      </Para>
      <Para>
        Which you want depends on what you are claiming. Macro says “the model handles every class properly”; weighted
        says “the model handles the data properly”. On a medical dataset where the rare class is the point, macro is the
        honest one.
      </Para>
      <Worked title="Top-K accuracy, slide 88">
        {`                       1   N
Top-K accuracy  =     ───  Σ  𝟙[ y⁽ⁱ⁾ ∈ Top-K(ŷ⁽ⁱ⁾) ]           (37)
                       N  i=1

Correct if the true class appears anywhere in the model’s top K guesses.

  Top-1: is the highest-probability class right?
  Top-5: is the true class among the top five?

More forgiving when K is large — standard in the ImageNet challenge.`}
      </Worked>
      <Para>
        Note that top-K cannot be read off a confusion matrix. The matrix records only the winner, so everything needed
        to answer “was the truth in the top five?” has already been thrown away. It has to be computed from the
        probabilities themselves.
      </Para>

      <Terms
        items={[
          {
            term: '𝟙[·]',
            say: 'indicator',
            def: 'The indicator function: 1 when the condition inside holds, 0 otherwise. Summing it counts how often the condition held.',
          },
          {
            term: 'one-vs-all',
            def: 'Scoring one class by treating it as positive and lumping all the others together as negative. How per-class precision and recall are defined.',
          },
          {
            term: 'macro-average',
            def: 'The plain average across classes. Every class counts the same however rare it is.',
          },
          {
            term: 'weighted average',
            def: 'The average weighted by how many examples each class has. Common classes dominate it.',
          },
          {
            term: 'top-K accuracy',
            def: 'Counted correct if the true class is among the model’s K most probable answers. Top-5 is the ImageNet convention.',
          },
          {
            term: 'Nₖ',
            say: 'N sub k',
            def: 'How many test examples really belong to class k. It is the row sum of row k of the confusion matrix.',
          },
        ]}
      />

      <Beyond>
        Two facts about the K × K matrix that a single accuracy number hides completely. An entirely empty{' '}
        <strong>column</strong> means the model never predicts that class at all — the “predicts the same class for
        everything” symptom, and invisible in the accuracy if that class is rare. And a large off-diagonal entry that is
        mirrored, say a lot of 4s called 9 and a lot of 9s called 4, means two classes are genuinely hard to tell apart
        rather than that the model is generally poor. That is the difference between needing better features and needing
        more training, and only the matrix distinguishes them.
      </Beyond>

      <WhyAiml method="classification_report with average='macro' or 'weighted'">
        <p className="mb-2">
          Reporting only the weighted average on an imbalanced problem is close to reporting accuracy again, and it
          hides exactly the failure you were worried about. A model that is superb on the 95% class and useless on the
          5% class gets a fine weighted F1 and a poor macro F1, and the second number is the one that describes the
          model you actually have.
        </p>
        <p>
          Top-5 accuracy is also where a lot of published progress lives. ImageNet has a thousand classes and images
          that genuinely contain several objects, so top-1 punishes reasonable answers; the top-5 numbers quoted in
          papers are higher than the top-1 numbers for that reason, not because the metric is being generous.
        </p>
      </WhyAiml>

      <Takeaway>
        Accuracy is the diagonal over the total. Precision and recall are computed per class, one-vs-all, then averaged
        either macro or weighted — and top-K needs the probabilities, which the confusion matrix has already discarded.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 26 */
  tips: (
    <>
      <Para>
        Slide 91 collects the practical advice into six groups. Most of it is a summary of decisions the session has
        already made; the last group is genuinely new, and it is the one that stops a working model returning NaN.
      </Para>
      <Worked title="Implementation tips, slide 91">
        {`1  Learning rate and epochs        4  Data handling
     start: η ∈ {0.01, 0.1, 1.0}         always shuffle each epoch
     typical: 10–100 epochs              check class balance
     use early stopping
                                      5  Feature scaling — essential!
2  Weight initialisation                 standardise: x′ⱼ = (xⱼ − μⱼ)/σⱼ
     wⱼ ~ N(0, 0.01)                     prevents sigmoid saturation
     avoid zeros or large values
                                      6  Numerical stability
3  Batch size                             use log(σ(z))
     start: B ∈ {64, 128, 256}            stable softmax: c = maxₖ zₖ
     powers of 2 preferred                            e^{zₖ − c}
     larger: stable, slower              SM(z)ₖ =  ─────────────
     smaller: noisy, faster                          Σⱼ e^{zⱼ − c}
                                          the log-sum-exp trick
                                          prevents overflow and underflow`}
      </Worked>

      <Lab>
        <StabilityLab />
      </Lab>

      <Para>
        The stable softmax is not an approximation and it is not a fudge. It is property 4 from slide 58 — softmax
        ignores a constant added to every logit — used deliberately. Choosing that constant to be the largest logit
        makes the biggest exponent e⁰ = 1 and every other one smaller, so the sum sits between 1 and K and nothing can
        overflow, whatever the logits were.
      </Para>
      <Para>
        The failure it prevents is not exotic. e^710 is beyond what a double-precision number can hold, so it becomes
        Infinity, and Infinity divided by Infinity is NaN. The logits themselves were perfectly ordinary numbers — it is
        only the exponential that could not hold them.
      </Para>
      <Para>
        Feature scaling connects straight back to part 3. An unscaled feature drives z far from zero, σ′ nearly
        vanishes, and the weight for that feature stops moving — not because the model has converged, but because the
        gradient has been multiplied by almost nothing on the way back.
      </Para>

      <Terms
        items={[
          {
            term: 'standardisation',
            def: 'Subtract the mean and divide by the standard deviation, so each feature has mean 0 and spread 1. The z-score of the statistics course.',
          },
          {
            term: 'overflow',
            def: 'A number too large for the format to hold. It becomes Infinity, and arithmetic on it produces NaN.',
          },
          {
            term: 'underflow',
            def: 'A number too small to represent. It becomes exactly 0, which then makes any logarithm of it −∞.',
          },
          {
            term: 'NaN',
            say: 'nan',
            def: 'Not a Number. It is contagious: anything arithmetic involving a NaN is a NaN, so one bad value destroys the whole model.',
          },
          {
            term: 'log-sum-exp',
            def: 'Computing log Σ e^{zⱼ} as c + log Σ e^{zⱼ − c} with c the maximum. Same value, and no overflow along the way.',
          },
          {
            term: 'early stopping',
            def: 'Stop training when the validation loss stops improving. It prevents overfitting without changing the model at all.',
          },
        ]}
      />

      <Beyond>
        The reason log(σ(z)) is singled out is the same argument in the binary case. Computing σ(z) first, then taking
        its logarithm, loses precision at exactly the extremes that matter: for a very negative z, σ(z) underflows to 0
        and its logarithm is −∞, even though log σ(z) ≈ z is a perfectly ordinary number. Rearranging to compute the
        logarithm directly — the same rearrangement as log-sum-exp — keeps it finite. Every framework’s “with logits”
        loss is doing this.
      </Beyond>

      <WhyAiml method="StandardScaler inside a Pipeline, and the “with logits” losses">
        <p className="mb-2">
          All three of the numerical tips reduce to one instruction: never let a raw probability meet a logarithm. That
          is why <code>BCEWithLogitsLoss</code> and <code>CrossEntropyLoss</code> take logits rather than probabilities,
          and why applying a softmax before either of them is a bug rather than a redundancy.
        </p>
        <p>
          The scaling tip has its own trap, and it is the leakage one from part 14. Fit the scaler on the training rows
          only and apply it to validation and test — fitting it on everything lets test statistics into the training
          data and quietly inflates the score. <code>Pipeline</code> exists so that cross-validation cannot get this
          wrong.
        </p>
      </WhyAiml>

      <Takeaway>
        Scale the features, shuffle every epoch, initialise small and random, and subtract the largest logit before
        exponentiating. That last one is exact, not approximate, and it is what stops softmax overflowing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 27 */
  debug: (
    <>
      <Para>
        Slide 92 is a table of symptoms and causes. It is the most practically useful slide in the deck, and the way to
        learn it is to go the other way — see the symptom, name the cause.
      </Para>
      <Worked title="The debugging checklist, slide 92">
        {`Loss is NaN or Inf              Predicts the same class for everything
  η too large — decrease            check class balance
  check for log(0) in the loss      verify the softmax and the loss
  scale the features                η might be too small
  use the stable softmax            verify the one-hot encoding

Loss oscillates                   Softmax outputs do not sum to 1
  η too large                       an implementation bug
  use mini-batches                  numerical precision
  apply learning-rate decay         use the stable softmax

Loss not decreasing               High train accuracy, low test accuracy
  check the gradient signs          overfitting
  η too small or too large          add regularisation
  verify feature scaling            get more training data
  verify data shuffling             use a simpler model
  check the one-hot encoding

Sanity checks: a tiny dataset should reach 100% accuracy · verify ŷ ∈ [0, 1]
· verify Σₖ ŷₖ = 1 · shuffling should improve results · print the confusion matrix`}
      </Worked>

      <Lab>
        <DebugLab />
      </Lab>

      <Para>
        There is an order to work in, and it saves a great deal of time. Look at the <strong>training</strong> loss
        alone first: five of the six symptoms are optimisation problems and all of them show up there. Only when the
        training loss falls smoothly does the gap between training and test accuracy mean anything at all — a model that
        has not learnt cannot be overfitting.
      </Para>
      <Para>
        Notice how often the learning rate appears. Too large gives NaN and oscillation; too small gives a flat loss and
        a model stuck predicting one class. It is the first hyperparameter to try, and by a wide margin the one most
        often responsible.
      </Para>
      <Para>
        The sanity checks at the bottom are worth running before the symptoms appear. If a model cannot reach 100%
        accuracy on ten examples, the bug is in the code, not the data — and it is far cheaper to find it there.
      </Para>

      <Terms
        items={[
          {
            term: 'learning-rate decay',
            def: 'Reducing η as training goes on. Large steps early to cover ground, small ones later to settle instead of oscillating.',
          },
          {
            term: 'overfitting',
            def: 'Learning the training rows rather than the pattern. It shows as high training accuracy with poor test accuracy.',
          },
          {
            term: 'regularisation',
            def: 'Penalising large weights so the model stays simpler than the data would allow. The standard cure for overfitting.',
          },
          {
            term: 'class balance',
            def: 'How many examples each class has. Badly unbalanced classes make "always predict the common one" a good strategy for the loss.',
          },
          {
            term: 'sanity check',
            def: 'A cheap test whose failure proves something is broken. It cannot prove the code is right, only that it is not obviously wrong.',
          },
        ]}
      />

      <Beyond>
        One symptom is missing from the slide and belongs beside the others: a loss that falls, then flattens well above
        zero, with training and test accuracy both mediocre and close together. That is <strong>underfitting</strong>,
        and it is the mirror image of the last box. The cure is the opposite too — more capacity, more features, a less
        restrictive model — so mistaking one for the other sends you in exactly the wrong direction. The tell is the
        gap: overfitting has a large one, underfitting has almost none.
      </Beyond>

      <WhyAiml method="the loss curve as the first diagnostic, before any metric">
        <p className="mb-2">
          Plotting training and validation loss on the same axes answers most of this table at a glance. Both falling
          and close together: keep going. Training falling while validation rises: overfitting, and where early stopping
          would have cut in. Both flat: an optimisation problem, and the learning rate is the first thing to move.
        </p>
        <p>
          The class-balance check deserves to be automatic. Print the label counts before training anything: on a
          99-to-1 dataset a model that always says “no” achieves 99% accuracy and is worthless, and you want to know
          that before you spend an afternoon wondering why the accuracy is so pleasing and the recall is zero.
        </p>
      </WhyAiml>

      <Takeaway>
        Six symptoms with named causes, and η is implicated in four of them. Diagnose the training loss on its own first
        — only overfitting is about the gap between training and test.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 28 */
  compare: (
    <>
      <Para>
        The last four slides put regression, binary classification and multi-class classification side by side. Reading
        them together is the fastest revision this session offers, because what stands out is how little differs.
      </Para>
      <Worked title="Activation functions, slide 94">
        {`Property        Identity        Sigmoid              Softmax
Formula         f(z) = z        σ(z) = 1/(1+e⁻ᶻ)     SM(z)ₖ = e^{zₖ}/Σⱼe^{zⱼ}
Output range    (−∞, ∞)         [0, 1]               [0, 1]ᴷ, Σₖ = 1
Use case        regression      binary               multi-class
# outputs       1               1                    K (coupled)`}
      </Worked>
      <Worked title="Loss functions, slide 95">
        {`Aspect        MSE                  Binary CE              Categorical CE
Task          regression           binary                 multi-class
Output type   continuous value     probability, 2 cls     distribution, K cls
Target y      a real number        {0, 1}                 a one-hot vector
Prediction    any real number      a probability [0,1]    a vector, Σₖ ŷₖ = 1
Activation    identity             sigmoid                softmax
Penalises     distance from target confident mistakes     wrong-class probability
Properties    convex, quadratic    convex, probabilistic, convex, extends
              penalty              logarithmic penalty    binary CE`}
      </Worked>
      <Worked title="Gradient descent variants, slide 96">
        {`Aspect            Batch GD          Stochastic GD     Mini-batch GD
Examples/update   all N             1                 B
Gradient          (1/N)Σᵢ ∇ℓᵢ      ∇ℓᵢ, random i     (1/B)Σᵢ∈B ∇ℓᵢ
Iterations/epoch  1                 N                 ⌈N/B⌉
Speed per iter.   slow              fast              medium
Convergence       smooth            noisy             balanced
Memory            high              low               medium
Gradient quality  exact             noisy estimate    good estimate
Best for          small datasets    online learning   deep learning (std)
Typical B         N                 1                 32, 64, 128, 256`}
      </Worked>

      <Lab>
        <CompareLab />
      </Lab>

      <Para>
        Slide 97 is the one to memorise, and the lab above is that table. Nine rows, three columns — and the columns
        agree on everything except the activation, the loss, the number of output neurons and, following from those, how
        the model is evaluated.
      </Para>
      <Para>
        Slides 98 and 99 close by recapping the two halves in one sentence each. Binary: the sigmoid maps a linear
        combination to a probability, optimised by minimising cross-entropy. Multi-class: multiple outputs coupled
        through softmax create a valid probability distribution over all classes. Both are the same neuron; the second
        just has K of them.
      </Para>

      <Beyond>
        Reading the three columns as a progression makes the pattern obvious and worth stating: the activation is
        decided entirely by what the output has to be able to be. Any real number needs the identity. A probability
        needs something bounded, so sigmoid. One of K needs something bounded that also sums to 1, so softmax. And in
        every case the loss is the negative log-likelihood under the matching noise model — Gaussian for regression,
        Bernoulli for binary, categorical for multi-class. Three tasks, one principle applied three times.
      </Beyond>

      <Terms
        items={[
          {
            term: 'coupled',
            def: 'Changing one output changes the others. Softmax outputs are coupled by the shared denominator; K sigmoids would not be.',
          },
          {
            term: 'quadratic penalty',
            def: 'Cost growing with the square of the error, as MSE does. Compare cross-entropy’s logarithmic penalty, which has no ceiling.',
          },
          {
            term: 'gradient quality',
            def: 'How close the estimated gradient is to the true one. Exact for batch, noisy for SGD, good for mini-batch.',
          },
        ]}
      />

      <WhyAiml method="choosing the last layer and the loss — the two lines that define the task">
        <p className="mb-2">
          Every model you write starts with this table. The task fixes the output shape, the output shape fixes the
          activation, the activation fixes the loss — and everything else, the hidden layers, the optimiser, the
          regularisation, is tuning. Getting these two lines right is not the interesting part of the job, and it is the
          part that makes the rest possible.
        </p>
        <p>
          It is also the interface the whole course is built on. Module 5 puts hidden layers in front of this final unit
          and changes nothing about it; the convolutional and recurrent networks of later modules change how x is built
          and leave the head alone. Everything after this session is a better way of producing the features that this
          same last layer consumes.
        </p>
      </WhyAiml>

      <Takeaway>
        Three tasks, one skeleton. The output type picks the activation, the activation picks the loss, and everything
        else — the weighted sum, the gradient, the training loop, the split — is identical.
      </Takeaway>
    </>
  ),
}
