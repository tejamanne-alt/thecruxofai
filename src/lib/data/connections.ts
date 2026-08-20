import { courseOfTopic, sessionById, type TopicId } from './curriculum'
import { partsOf } from './lecture-parts'

/**
 * How the courses actually hold together.
 *
 * The site is one programme, not six unrelated reading lists. A neuron is a dot
 * product; a layer is a matrix multiply; "lower is better" is the squared error
 * from the statistics course; the perceptron rule is gradient descent with the
 * step size written as η. Someone revising Deep Neural Networks who has
 * forgotten what ⟨x, y⟩ was should be one click from the page that taught it,
 * and someone revising the dot product should be told, on that page, that it
 * comes back as the whole of a neuron.
 *
 * So the links live here as data rather than as sentences buried in a hundred
 * pages, and both directions are rendered from the same row:
 *
 *   builds-on   this page cannot be understood without that one
 *   used-by     that page is where this idea is put to work later
 *   same-idea   two courses teach the same thing under different names
 *   contrast    they look alike and are not, and mixing them costs marks
 *
 * `carries` is the short label — the object being passed between the two pages.
 * `detail` is the part that matters: what the earlier page gives, and exactly
 * what this page does with it. A link that could be pasted between any two
 * pages is not worth having, so each one names a symbol, a formula or a step.
 */

export interface Anchor {
  topic: TopicId
  /** A part of a chapter. Omitted for a concept or a chapter's front page. */
  part?: string
}

export type LinkKind = 'builds-on' | 'used-by' | 'same-idea' | 'contrast'

export interface Connection {
  from: Anchor
  to: Anchor
  kind: LinkKind
  /** The thing being handed over. A symbol, a formula, a step — not a topic. */
  carries: string
  /** Two sentences: what the other page gives, and what is done with it here. */
  detail: string
}

export const LINK_KINDS: Record<LinkKind, { forward: string; back: string }> = {
  'builds-on': { forward: 'Built on', back: 'Used later by' },
  'used-by': { forward: 'Used by', back: 'Builds on' },
  'same-idea': { forward: 'The same idea as', back: 'The same idea as' },
  contrast: { forward: 'Not to be confused with', back: 'Not to be confused with' },
}

/**
 * Every row is written from the newer page's point of view, because that is
 * where the reader usually is. The reverse direction is derived, never typed
 * twice, so the two can never drift apart.
 */
export const CONNECTIONS: Connection[] = [
  /* ------------------------------------- session 4: classification */
  {
    from: { topic: 'dl4', part: 'whatis' },
    to: { topic: 'mllec1', part: 'classification' },
    kind: 'builds-on',
    carries: 'a categorical target',
    detail:
      'The ML lecture defined classification by its output — a label from a fixed list — and gave spam, digits and diagnosis as the examples. This deck takes that same definition and adds the three-way split by how many labels one example may carry, which is what decides whether the last layer is one sigmoid, a softmax over K, or K independent sigmoids.',
  },
  {
    from: { topic: 'dl4', part: 'whatis' },
    to: { topic: 'dl3', part: 'whatis' },
    kind: 'contrast',
    carries: 'y ∈ {1, …, K} against y ∈ ℝ',
    detail:
      'Session 3 fixed the target as a continuous number and warned that digits 0 to 9 look like numbers and are not. This session is the other side of that warning: the same feature vector goes in, but the arrow now lands on one of K names, and the test is whether values between two targets mean anything.',
  },
  {
    from: { topic: 'dl4', part: 'whylinear' },
    to: { topic: 'dl3', part: 'loss' },
    kind: 'contrast',
    carries: 'squared error on a 0/1 label',
    detail:
      'Session 3 built J(w) = (1/2N)‖Xw − y‖² and showed it working on house prices. Point the same loss at labels of 0 and 1 and two things break: the predictions leave [0, 1] entirely, and the model is charged for being too confidently right, which drags the boundary towards a correctly classified point that happens to be far away.',
  },
  {
    from: { topic: 'dl4', part: 'sigmoid' },
    to: { topic: 'activation' },
    kind: 'builds-on',
    carries: 'σ(z) = 1/(1 + e⁻ᶻ), and σ′ ≤ 0.25',
    detail:
      'The activation concept page lists the sigmoid beside the step and the identity, and notes that its derivative never exceeds 0.25. This part is where that function stops being one entry in a table and becomes the model: it is what makes the output a probability, and its σ(1 − σ) derivative is what makes the gradient come out as ŷ − y.',
  },
  {
    from: { topic: 'dl4', part: 'sigmoid' },
    to: { topic: 'dl3', part: 'identity' },
    kind: 'contrast',
    carries: 'f(z) = z against σ(z)',
    detail:
      'Regression chose the identity because any real output had to be reachable and f′ = 1 lets gradients pass unchanged. Classification chooses the opposite property: bounded output, at the cost of a derivative that vanishes when |z| is large. That vanishing is exactly the saturation that makes feature scaling essential here.',
  },
  {
    from: { topic: 'dl4', part: 'components' },
    to: { topic: 'dl1', part: 'components' },
    kind: 'builds-on',
    carries: 'data, model, objective, learning algorithm',
    detail:
      'Session 1 introduced the four-part checklist and session 3 filled it in for regression. This part fills it in a third time, and the value is in what does not move: only the model’s activation and the objective change, and the learning algorithm changes only in how much data goes into one step.',
  },
  {
    from: { topic: 'dl4', part: 'components' },
    to: { topic: 'designmat' },
    kind: 'same-idea',
    carries: 'X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾, ones column first',
    detail:
      'The design matrix concept page explains why a column of ones is glued onto the data: it turns the bias into an ordinary weight so that z = wᵀx needs no "and then add b" clause. Nothing about that changes for classification — only the label column, which may now hold nothing but 0 and 1.',
  },
  {
    from: { topic: 'dl4', part: 'neuron' },
    to: { topic: 'neuron' },
    kind: 'same-idea',
    carries: 'ŷ = f(Σwᵢxᵢ + b)',
    detail:
      'The neuron concept page defines a unit as a weighted sum followed by an activation, and leaves f open on purpose. Logistic regression is that unit with f = σ — which is why a technique that arrives from statistics turns out to be one artificial neuron, and why a deep classifier is this same unit sitting on top of learned features.',
  },
  {
    from: { topic: 'dl4', part: 'neuron' },
    to: { topic: 'dotproduct' },
    kind: 'builds-on',
    carries: 'wᵀx, the dot product',
    detail:
      'The dot product page defines ⟨w, x⟩ as multiply-matching-entries-and-add, and shows it measuring how much two vectors agree. The logit is exactly that number: how much this example agrees with the weight vector. Everything the model can do is squeezed through that single scalar before the sigmoid ever sees it.',
  },
  {
    from: { topic: 'dl4', part: 'neuron' },
    to: { topic: 'conditional' },
    kind: 'builds-on',
    carries: 'P(y = 1 | x)',
    detail:
      'The statistics course defines a conditional probability as the chance of one event given that another has happened, and warns that P(A | B) is not P(B | A). The output of this model is written P(y = 1 | x) — the chance of the positive class given these features — and it earns that reading only because the loss is derived from the likelihood.',
  },
  {
    from: { topic: 'dl4', part: 'decision' },
    to: { topic: 'dl1', part: 'hyperplane' },
    kind: 'builds-on',
    carries: 'wᵀx = 0, the separating hyperplane',
    detail:
      'Session 1 introduced the hyperplane as the flat thing one dimension below its space, and showed the weight vector standing perpendicular to it. That is precisely the boundary here: σ crosses 0.5 at z = 0, so the surface where the model changes its mind is wᵀx = 0 — straight, however curved the probability shading looks.',
  },
  {
    from: { topic: 'dl4', part: 'decision' },
    to: { topic: 'linsep' },
    kind: 'builds-on',
    carries: 'what one straight cut can and cannot separate',
    detail:
      'The linear separability page shows the four XOR points and the line that cannot be drawn. Logistic regression inherits that limit exactly: the sigmoid curves the probabilities and never the boundary, so anything a perceptron cannot separate this cannot either. Hidden layers are the answer in both cases.',
  },
  {
    from: { topic: 'dl4', part: 'decision' },
    to: { topic: 'lec3', part: 'orthogonality' },
    kind: 'builds-on',
    carries: 'w ⊥ the boundary',
    detail:
      'Analytic geometry showed that a vector is perpendicular to a plane exactly when its dot product with every direction in the plane is zero. Apply that here and the feature weights point at right angles to the decision boundary, and |wᵀx|/‖w‖ is the distance from a point to it — which is why scaling every weight up sharpens the probabilities without moving the line an inch.',
  },
  {
    from: { topic: 'dl4', part: 'bce' },
    to: { topic: 'lossfn' },
    kind: 'builds-on',
    carries: 'one number that says how wrong',
    detail:
      'The loss function concept page makes the case that training needs a single number to reduce, and that the number has to match the task. Cross-entropy is that number for classification: it reads only the probability given to the true class, and unlike squared error it has no upper limit on what a mistake can cost.',
  },
  {
    from: { topic: 'dl4', part: 'bce' },
    to: { topic: 'ism4', part: 'statement' },
    kind: 'builds-on',
    carries: 'the likelihood P(data | parameters)',
    detail:
      'The Bayes lecture separates the likelihood from the posterior and shows the likelihood as the probability of what you saw, given a hypothesis. Cross-entropy is the negative logarithm of exactly that quantity for the whole dataset — so minimising the loss here is maximum likelihood estimation, done by gradient descent instead of by calculus.',
  },
  {
    from: { topic: 'dl4', part: 'whyce' },
    to: { topic: 'dl3', part: 'whysq' },
    kind: 'contrast',
    carries: 'four reasons for a loss, twice over',
    detail:
      'Session 3 gave four reasons for squared error: differentiable, convex, quadratic penalty, and maximum likelihood under Gaussian noise. This slide gives four for cross-entropy and three of them are the same words — the difference is the noise model. A 0/1 label is a coin flip, not a real number with Gaussian noise, and that single change swaps one loss for the other.',
  },
  {
    from: { topic: 'dl4', part: 'sgd' },
    to: { topic: 'dl3', part: 'batch' },
    kind: 'builds-on',
    carries: 'the batch algorithm, and its cost',
    detail:
      'Session 3’s Algorithm 1 computes the gradient over all N examples before taking one step. This part keeps the update rule character for character and changes only how much data goes into ∇J — which turns one exact step per epoch into N noisy ones, and turns a dataset larger than memory from impossible into routine.',
  },
  {
    from: { topic: 'dl4', part: 'sgd' },
    to: { topic: 'gradient' },
    kind: 'builds-on',
    carries: 'w ← w − η∇J',
    detail:
      'The gradient descent page lets you set η and watch the step overshoot, crawl or diverge. Everything it shows still holds here — the update rule is unchanged — but the gradient it steps against is now an estimate rather than the real thing, which is why η matters more and why the path staggers instead of gliding.',
  },
  {
    from: { topic: 'dl4', part: 'grad' },
    to: { topic: 'dl3', part: 'gradient' },
    kind: 'same-idea',
    carries: '(ŷ − y)x, the error times the input',
    detail:
      'Session 3 derived ∇J = (1/N)Xᵀ(Xw − y) for squared error on a linear model. This deck derives (ŷ − y)x for cross-entropy on a sigmoid — and it is the same formula. The σ(1 − σ) that the chain rule produces cancels against the 1/ŷ from the logarithm, which is why the training loop needs no changes at all between the two sessions.',
  },
  {
    from: { topic: 'dl4', part: 'sgdalgo' },
    to: { topic: 'dl2', part: 'pla' },
    kind: 'contrast',
    carries: 'update on every example, not only on mistakes',
    detail:
      'The perceptron learning algorithm updates only when it gets an example wrong, and leaves the weights alone otherwise. SGD on cross-entropy updates on every example, because ŷ − y is never exactly zero — even a correct, confident prediction contributes a small push. That is the difference between a rule that stops when it can and a loss that always wants to be lower.',
  },
  {
    from: { topic: 'dl4', part: 'example' },
    to: { topic: 'dl3', part: 'example' },
    kind: 'same-idea',
    carries: 'a worked run on four numbers',
    detail:
      'Session 3 followed three houses from a loss of 7.5 to 1.51 in one batch step. This one follows four students through two SGD steps to w = (0.116, 0.847). Read them together and the difference is visible: the batch step improves every example at once, while these two steps improve two examples and make the other two worse.',
  },
  {
    from: { topic: 'dl4', part: 'example' },
    to: { topic: 'scaling' },
    kind: 'builds-on',
    carries: 'why a large feature moves its weight harder',
    detail:
      'The scaling page argues that features on wildly different ranges make training crawl. This example shows the mechanism in two numbers: the gradient is the error times the input, so the example with x₁ = 3 pushes w₁ three times as hard as it pushes the bias. Multiply that by a feature measured in thousands and the sigmoid saturates before training starts.',
  },
  {
    from: { topic: 'dl4', part: 'graph' },
    to: { topic: 'dl3', part: 'graph' },
    kind: 'same-idea',
    carries: 'forward to the loss, backward to the gradient',
    detail:
      'Session 3’s graph runs x and w into a multiply, then to the loss, with a dashed return path carrying the gradient. This one inserts a σ node between z and ŷ and changes nothing else — and the backward path still carries e = ŷ − y, which is the clearest possible statement of what the two models have in common.',
  },
  {
    from: { topic: 'dl4', part: 'confusion' },
    to: { topic: 'metrics' },
    kind: 'same-idea',
    carries: 'TP, FP, FN, TN',
    detail:
      'The metrics concept page builds the same four counts and derives precision and recall from them. This part is where they arrive in the lecture, with the threshold made movable: the four numbers are a property of the model *and* the cut point, and sliding the cut trades misses for false alarms without retraining anything.',
  },
  {
    from: { topic: 'dl4', part: 'confusion' },
    to: { topic: 'dl3', part: 'traintest' },
    kind: 'builds-on',
    carries: 'the same formula over different rows',
    detail:
      'Session 3 split the data and computed the same loss on the training and the test rows, and warned that any scaling must be fitted on the training rows alone. That rule is unchanged here — only the numbers being reported change, from RMSE and R² to a table of four counts.',
  },
  {
    from: { topic: 'dl4', part: 'metrics' },
    to: { topic: 'mllec2', part: 'imbalance' },
    kind: 'builds-on',
    carries: 'a rare class, and what it does to a score',
    detail:
      'The ML workflow lecture warned that an imbalanced dataset lets a model score well by ignoring the minority class, and gave resampling as the fix at the data level. This part shows the same failure at the metric level: 98% accuracy for a model that finds nobody, which is why precision, recall and F1 exist and why F1 ignores true negatives entirely.',
  },
  {
    from: { topic: 'dl4', part: 'metrics' },
    to: { topic: 'dl3', part: 'metrics' },
    kind: 'contrast',
    carries: 'RMSE and MAE against precision and recall',
    detail:
      'Regression reports errors in the units of the thing predicted, so RMSE and MAE mean something to a person. Classification has no units to report in, so it reports proportions of a contingency table instead — and unlike RMSE, no single one of them is safe to quote alone.',
  },
  {
    from: { topic: 'dl4', part: 'multi' },
    to: { topic: 'ism2', part: 'axioms' },
    kind: 'builds-on',
    carries: 'the probabilities of an exhaustive set sum to 1',
    detail:
      'The probability axioms say that the outcomes of an experiment, taken together, have probability 1. A multi-class model asserts exactly that about its K classes — the example must be one of them — and softmax is the mechanism that makes the assertion true by construction rather than by hope.',
  },
  {
    from: { topic: 'dl4', part: 'onehot' },
    to: { topic: 'encoding' },
    kind: 'same-idea',
    carries: 'a category becomes a vector with a single 1',
    detail:
      'The encoding page introduced one-hot for categorical *inputs*, and warned that a high-cardinality column explodes into thousands of near-empty ones. Here the same encoding is applied to the *target*, where the cardinality problem does not arise — K is fixed — and the argument that survives is the other one: integers imply an order between classes that does not exist.',
  },
  {
    from: { topic: 'dl4', part: 'weights' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'Z = XW, and why the shapes must line up',
    detail:
      'The matrix multiplication page shows each entry of a product as a row against a column, and the shape rule that makes it legal. Z = XW is that rule doing real work: N × (d + 1) against (d + 1) × K gives N × K, one row of K class scores per example — and checking those shapes is the fastest way to catch a transposed gradient later.',
  },
  {
    from: { topic: 'dl4', part: 'weights' },
    to: { topic: 'dl3', part: 'design' },
    kind: 'builds-on',
    carries: 'one weight vector becomes K columns',
    detail:
      'Regression needed a single w ∈ ℝᵈ⁺¹ against a design matrix of the same width. Multi-class keeps the design matrix exactly as it was and widens the weights into a matrix with one column per class, so the parameter count goes from d + 1 to (d + 1) × K — 7 850 for MNIST, which is the baseline every later architecture is measured against.',
  },
  {
    from: { topic: 'dl4', part: 'softmax' },
    to: { topic: 'activation' },
    kind: 'builds-on',
    carries: 'the last activation is decided by the target',
    detail:
      'The activation page argues that the final function is chosen by what the output must be able to be. Softmax is the third answer in that series: identity for any real number, sigmoid for one probability, softmax for K probabilities that must add to 1 — and it is the only one of the three whose outputs are coupled to each other.',
  },
  {
    from: { topic: 'dl4', part: 'catce' },
    to: { topic: 'dl4', part: 'bce' },
    kind: 'same-idea',
    carries: '−Σₖ yₖ log ŷₖ collapses to the binary form',
    detail:
      'The binary loss looked like two terms glued together with a (1 − y) switch. The categorical loss is a sum over K terms of which one-hot labels keep exactly one. Set K = 2 with y = [1 − y, y] and the second becomes the first — they are one formula written for different numbers of classes.',
  },
  {
    from: { topic: 'dl4', part: 'minibatch' },
    to: { topic: 'mllec2', part: 'sampling' },
    kind: 'builds-on',
    carries: 'a sample stands in for the whole',
    detail:
      'The ML lecture made the case that a random sample can represent a dataset, and that a biased sample cannot. A mini-batch is that argument applied to a gradient: B randomly chosen examples give an estimate that is right on average, and the shuffle each epoch is what stops the sample being systematically biased by the order the data was stored in.',
  },
  {
    from: { topic: 'dl4', part: 'mbgrad' },
    to: { topic: 'dl3', part: 'gradient' },
    kind: 'same-idea',
    carries: 'Xᵀ(prediction − truth), one shape up',
    detail:
      'Session 3 wrote ∇J = (1/N)Xᵀ(Xw − y), with the error as a column of N numbers. The multi-class version is (1/B)X_Bᵀ(Ŷ_B − Y_B), with the error as a B × K block. The shape check is the same discipline in both: the gradient must come out the shape of the parameters, or the formula is written the wrong way round.',
  },
  {
    from: { topic: 'dl4', part: 'mcexample' },
    to: { topic: 'lec0a', part: 'multiply' },
    kind: 'builds-on',
    carries: 'a row against a column, by hand',
    detail:
      'Lecture 0a lets you press any entry of a matrix product and see exactly which row and which column produced it. That is the only skill this worked example needs — Z_B = X_B W and X_Bᵀ(Ŷ_B − Y_B) are both that operation — and it is what lets you check the deck’s printed numbers rather than copy them, which is how three of them turn out not to follow from its own inputs.',
  },
  {
    from: { topic: 'dl4', part: 'inference' },
    to: { topic: 'ism4', part: 'maphyp' },
    kind: 'same-idea',
    carries: 'arg max over the hypotheses',
    detail:
      'The MAP hypothesis picks whichever class has the largest posterior probability, and the statistics lecture notes that the shared denominator can be ignored because it is the same for every class. Softmax inference is that rule exactly: compute a score per class, and take the arg max — and for the same reason, the normaliser does not affect which one wins.',
  },
  {
    from: { topic: 'dl4', part: 'mcmetrics' },
    to: { topic: 'ism4', part: 'classifier' },
    kind: 'builds-on',
    carries: 'a K × K table of what was called what',
    detail:
      'The Naive Bayes lecture scored its classifier by counting how often each true class was predicted as each class. That table is the multi-class confusion matrix, and this part reads precision and recall off it one class at a time — treating each class as positive and the rest as negative, which is the same one-vs-all move Naive Bayes makes when it compares posteriors.',
  },
  {
    from: { topic: 'dl4', part: 'tips' },
    to: { topic: 'scaling' },
    kind: 'builds-on',
    carries: 'x′ = (x − μ)/σ',
    detail:
      'The scaling page derives the z-score and shows two features on wildly different ranges slowing training down. This slide calls it essential and gives the classification-specific reason: an unscaled feature drives the logit far from zero, where σ′ is nearly zero, so the weight stops moving even though the answer is wrong.',
  },
  {
    from: { topic: 'dl4', part: 'debug' },
    to: { topic: 'dl3', part: 'debug' },
    kind: 'same-idea',
    carries: 'symptom, cause, fix',
    detail:
      'Session 3 listed four symptoms of a bad regression run. This one lists six, and the overlap is the point: NaN, oscillation and a flat loss all mean the same things in both, and η is implicated in most of them. The two genuinely new entries — predicting one class for everything, and softmax outputs not summing to 1 — could not exist in a regression.',
  },
  {
    from: { topic: 'dl4', part: 'compare' },
    to: { topic: 'dl3', part: 'summary' },
    kind: 'builds-on',
    carries: 'data → model → objective → learning, round again',
    detail:
      'Session 3 closed with the four components as a loop that runs until the loss stops falling. This session closes with the same loop drawn three times, for regression, binary and multi-class — and the comparison shows that only the activation, the loss and the number of output neurons ever differ between them.',
  },
  {
    from: { topic: 'dl4', part: 'compare' },
    to: { topic: 'dl1', part: 'mlp' },
    kind: 'used-by',
    carries: 'the head that every deep network ends in',
    detail:
      'Session 1 fixed XOR by putting a hidden layer in front of the same output unit. That is the shape of everything after this session: the classifier described here becomes the last layer, and every later module — deeper networks, convolutions, transformers — is a better way of producing the x that this layer consumes.',
  },

  /* --------------------------------- the concepts session 4 introduces */
  {
    from: { topic: 'logistic' },
    to: { topic: 'neuron' },
    kind: 'same-idea',
    carries: 'one unit, weighted sum then activation',
    detail:
      'The neuron page defines a unit as ŷ = f(Σwᵢxᵢ + b) and deliberately leaves f open. Logistic regression is that unit with f = σ, which is why a method that arrives from statistics turns out to be the output layer of every binary classifier in the deep learning course.',
  },
  {
    from: { topic: 'logistic' },
    to: { topic: 'perceptron' },
    kind: 'contrast',
    carries: 'a smooth squash instead of a hard step',
    detail:
      'The perceptron puts a step function on the weighted sum, which gives a hard yes or no and a derivative of zero — so it needs a learning rule of its own. Swap the step for a sigmoid and the same unit becomes differentiable, trainable by gradient descent, and able to say how sure it is.',
  },
  {
    from: { topic: 'softmax' },
    to: { topic: 'logistic' },
    kind: 'builds-on',
    carries: 'σ is softmax with K = 2',
    detail:
      'Divide the two-class softmax through by e^{z₁} and what is left is 1/(1 + e^{−(z₁−z₂)}) = σ(z₁ − z₂). So the binary model was never a special case bolted on: it is the K-class model with the redundant second score removed.',
  },
  {
    from: { topic: 'softmax' },
    to: { topic: 'activation' },
    kind: 'builds-on',
    carries: 'the output layer’s job',
    detail:
      'The activation page argues that the last function is chosen by what the output has to be able to be, and lists the identity and the sigmoid. Softmax is the third case, and the only one whose outputs are coupled — K numbers produced together, constrained to sum to 1.',
  },
  {
    from: { topic: 'crossentropy' },
    to: { topic: 'lossfn' },
    kind: 'builds-on',
    carries: 'the single number training reduces',
    detail:
      'The loss function page makes the case that learning needs one number to minimise, and that the number must match the task. Cross-entropy is that number for a categorical target: it reads only the probability given to the truth, and charges −log of it, without an upper bound.',
  },
  {
    from: { topic: 'crossentropy' },
    to: { topic: 'bayes' },
    kind: 'builds-on',
    carries: 'the likelihood of the observed data',
    detail:
      'Bayes’ rule separates the likelihood P(data | hypothesis) from the posterior. Cross-entropy is the negative logarithm of that likelihood, summed over a dataset — so training a classifier by minimising it is maximum likelihood estimation carried out by gradient descent.',
  },
  {
    from: { topic: 'sgdvariants' },
    to: { topic: 'gradient' },
    kind: 'builds-on',
    carries: 'w ← w − η∇J',
    detail:
      'The gradient descent page shows the step overshooting, crawling and diverging as η changes. All three variants here apply that identical step; the only thing that differs is how many examples went into ∇J, and therefore how trustworthy the direction is.',
  },
  {
    from: { topic: 'sgdvariants' },
    to: { topic: 'dl3', part: 'batch' },
    kind: 'builds-on',
    carries: 'one exact step per pass over the data',
    detail:
      'Session 3’s batch algorithm is the first of the three, written out line by line: compute the gradient over every example, then take one step. Stochastic and mini-batch descent change nothing about that pseudocode except the set the sum runs over.',
  },
  /* ------------------------------------------------ setting the scene */
  {
    from: { topic: 'dl1', part: 'map' },
    to: { topic: 'mllec1', part: 'course' },
    kind: 'builds-on',
    carries: 'the same shape of course',
    detail:
      'The Machine Learning course opens the same way: eleven modules, six labs, and most of the mark in two exams. Deep Neural Networks runs ten modules and six labs on the same pattern, so the revision habit that works for one works for the other — and the mid-semester exam here is closed book while the comprehensive is open book, which the ML session already warned changes what is worth memorising.',
  },
  {
    from: { topic: 'dl1', part: 'nesting' },
    to: { topic: 'mllec1', part: 'landscape' },
    kind: 'same-idea',
    carries: 'AI ⊃ ML ⊃ NN ⊃ DL',
    detail:
      'The ML lecture drew the same nesting one ring shallower: machine learning inside artificial intelligence, with data science overlapping both. This deck adds the two inner rings — neural networks inside machine learning, deep learning inside neural networks — so the two diagrams are the same picture at different zoom levels, and an exam that asks for either wants the containment stated, not the areas.',
  },
  {
    from: { topic: 'dl1', part: 'whatisdl' },
    to: { topic: 'mllec1', part: 'whatisml' },
    kind: 'builds-on',
    carries: 'data + output → program',
    detail:
      'Machine learning was defined as swapping two boxes: you supply the data and the answers, and a program comes out. Deep learning does not change that sentence at all — it only says the program is built from layers, each one turning the previous layer’s representation into a slightly more meaningful one.',
  },
  {
    from: { topic: 'dl1', part: 'whynow' },
    to: { topic: 'mllec1', part: 'whenml' },
    kind: 'builds-on',
    carries: 'when learning is worth it',
    detail:
      'The ML lecture listed the conditions that make learning worth doing at all: no human expert, or an expert who cannot explain the rule. This deck adds the conditions that make a *deep* model worth doing on top of that — enough labelled data that a big network stops being starved, and cheap enough computation that training it finishes.',
  },
  {
    from: { topic: 'dl1', part: 'history' },
    to: { topic: 'perceptron' },
    kind: 'same-idea',
    carries: 'the 1957 entry, still runnable',
    detail:
      'The Perceptron mark on the timeline is a page on this site: the concept version trains live, one mistake at a time, and shows the boundary rotating into place. Reading the 1969 XOR entry next to it is the fastest way to feel why the first dark age happened — the thing in that lab genuinely cannot do XOR, however long you leave it running.',
  },
  {
    from: { topic: 'dl1', part: 'history' },
    to: { topic: 'regression' },
    kind: 'builds-on',
    carries: 'ADALINE 1959 = squared error on a linear unit',
    detail:
      'The ADALINE entry two years after the perceptron is the first appearance of a loss function in this story: it trains against the squared error of the weighted sum rather than against the mistakes of the threshold. That is the regression page exactly — drag a line, watch the sum of squared errors move — and it is why ADALINE, not the perceptron, is the direct ancestor of how networks are trained today.',
  },
  {
    from: { topic: 'dl1', part: 'apps' },
    to: { topic: 'mllec1', part: 'classification' },
    kind: 'builds-on',
    carries: 'categorical target vs numerical target',
    detail:
      'Every row of the applications table is one of the two supervised shapes you already have names for: house features → price is regression, image → text label is classification, image → bounding box is regression with four outputs. The network architecture in the last column changes; the definition of the task does not.',
  },

  /* ------------------------------------- the four components of a DL problem */
  {
    from: { topic: 'dl1', part: 'components' },
    to: { topic: 'mllec1', part: 'tpe' },
    kind: 'same-idea',
    carries: '⟨T, P, E⟩ against data · model · objective · algorithm',
    detail:
      'Mitchell’s ⟨T, P, E⟩ and this deck’s four components describe the same setup from two angles: E is the data, P is the objective function turned upside down, and T is what the model computes. The one thing ⟨T, P, E⟩ leaves out is the fourth component — the optimisation algorithm — which is exactly the part deep learning spends its time on.',
  },
  {
    from: { topic: 'dl1', part: 'components' },
    to: { topic: 'mllec1', part: 'workflow' },
    kind: 'builds-on',
    carries: 'the eight-step workflow',
    detail:
      'The ML workflow spelled out eight steps of which one picks a model; this deck compresses them into a loop of design a model, grab new data, check if good enough, update the model. Read the short version as the inner loop of the long one — the long one is where the marks are for a workflow question, the short one is what training code actually does.',
  },
  {
    from: { topic: 'dl1', part: 'data' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'same-idea',
    carries: 'features, target, label',
    detail:
      'The vocabulary is already yours: an example is a row, its attributes are features (also called covariates or predictors), and the attribute you want back is the label or target. This page only adds that every example must become a fixed-length vector of numbers before a network can touch it, which is why images are easy and raw text is not.',
  },
  {
    from: { topic: 'dl1', part: 'data' },
    to: { topic: 'lec0a', part: 'matrix' },
    kind: 'builds-on',
    carries: 'the m × n design matrix',
    detail:
      'A dataset of m examples with n features is literally the m × n matrix from Lecture 0a — rows are examples, columns are features, and the shape rules you learnt there decide what a layer can be multiplied by. When a deep learning library refuses a batch with a shape error, it is enforcing the same "inner dimensions must match" rule you met on the multiplication page.',
  },
  {
    from: { topic: 'dl1', part: 'data' },
    to: { topic: 'lec2', part: 'spaces' },
    kind: 'builds-on',
    carries: 'ℝⁿ as the space examples live in',
    detail:
      'Calling the number of features "the dimensionality of the data" is the vector-space definition of dimension, not a loose metaphor: each example is a point of ℝⁿ, and n is the length of every basis for it. That is why the deck can say text has varying-length data and treat it as a genuinely different problem — those examples do not all live in the same space.',
  },
  {
    from: { topic: 'dl1', part: 'objective' },
    to: { topic: 'regression' },
    kind: 'builds-on',
    carries: 'squared error',
    detail:
      'The regression page had you drag a line and watch the sum of squared errors rise and fall; that number is the objective function this deck is defining in general. "Lower is better by convention" is the reason it was drawn as a bowl there — and the reason the same picture returns for every loss in the rest of the course.',
  },
  {
    from: { topic: 'dl1', part: 'objective' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'builds-on',
    carries: 'the mean minimises squared error',
    detail:
      'In the statistics course the mean was the point that makes the total squared distance smallest, and the median was the point that makes the total absolute distance smallest. That is the same statement as "your choice of loss decides what the model predicts" — a squared-error network chases the mean of the targets, so a few extreme labels drag every prediction with them.',
  },
  {
    from: { topic: 'dl1', part: 'generalise' },
    to: { topic: 'mllec1', part: 'supervisedflow' },
    kind: 'builds-on',
    carries: 'the held-back test set',
    detail:
      'The supervised workflow split the data before training and never let the model see the test half; overfitting is what that split exists to detect. This page names the failure — training loss going down while unseen-data loss goes up — and the whole of Module 4 of this course is techniques for stopping it.',
  },
  {
    from: { topic: 'dl1', part: 'optimiser' },
    to: { topic: 'gradient' },
    kind: 'builds-on',
    carries: 'w ← w − η ∇L',
    detail:
      'Gradient descent is not introduced in this deck — it is named as the family every deep learning optimiser belongs to, and you already have the page where rolling downhill in fog either converges or explodes depending on the step size. Everything Module 4 adds (momentum, Adam, learning-rate schedules) is a modification of that one update line.',
  },
  {
    from: { topic: 'dl1', part: 'model' },
    to: { topic: 'mllec1', part: 'instancemodel' },
    kind: 'builds-on',
    carries: 'model-based, not instance-based',
    detail:
      'The ML lecture split learners into ones that keep the examples and compare (k-nearest neighbours) and ones that boil the examples down into parameters (model-based). A neural network is the extreme end of the second: after training, the data is thrown away and everything the network knows sits in its weights, which is precisely what "the knowledge is stored as parameters" means here.',
  },

  /* ------------------------------------------------------ the neuron itself */
  {
    from: { topic: 'dl1', part: 'neuron' },
    to: { topic: 'lec0b', part: 'dot' },
    kind: 'builds-on',
    carries: 'z = w · x',
    detail:
      'A neuron’s entire linear half is the dot product: multiply matching entries of the weight vector and the input vector, add them up, get one number. Everything the dot-product page proved about that number — that it is positive when two vectors point the same way, zero when they are at right angles, negative when they oppose — is what makes the sign of z a usable decision.',
  },
  {
    from: { topic: 'dl1', part: 'neuron' },
    to: { topic: 'dotproduct' },
    kind: 'same-idea',
    carries: '⟨w, x⟩ as a shadow',
    detail:
      'The concept page showed the dot product as the shadow one vector casts on another, scaled by the length of the second. Read a neuron that way and the weight vector is the direction it is looking in, the input’s shadow along that direction is the score, and the bias slides the point where the shadow becomes long enough to fire.',
  },
  {
    from: { topic: 'dl1', part: 'neuron' },
    to: { topic: 'lec0b', part: 'vector' },
    kind: 'builds-on',
    carries: 'x as a column of numbers',
    detail:
      'The inputs x₀, x₁, x₂ drawn as circles on the slide are one vector written vertically — the same object the vectors page introduced. Seeing it as a single vector rather than three separate wires is what lets a whole layer be written as one matrix multiply instead of a loop.',
  },
  {
    from: { topic: 'dl1', part: 'perceptron' },
    to: { topic: 'perceptron' },
    kind: 'same-idea',
    carries: 'the same unit, trained live',
    detail:
      'The perceptron concept page is this same unit with the training loop running: press a button and watch the boundary rotate one mistake at a time until the accuracy read-out stops moving. Use the chapter page for the definition an examiner wants and the concept page when the update rule will not click.',
  },
  {
    from: { topic: 'dl1', part: 'brain' },
    to: { topic: 'mllec1', part: 'pattern' },
    kind: 'contrast',
    carries: 'inspiration is not a mechanism',
    detail:
      'The deck’s brain arithmetic — about 10¹⁰ neurons, 10⁴ to 10⁵ connections each, a switching time near a millisecond against roughly a second to recognise a scene — is an argument that recognition must be massively parallel, not a claim that a network is a brain. Keep the two apart in an exam answer: the biology motivates the architecture, and nothing in the perceptron rule is derived from it.',
  },

  /* ---------------------------------------- boundaries, planes and the algebra */
  {
    from: { topic: 'dl1', part: 'hyperplane' },
    to: { topic: 'lec3', part: 'orthogonality' },
    kind: 'builds-on',
    carries: 'w as the normal vector',
    detail:
      'The set of points with w · x = 0 is exactly the set of x that are orthogonal to w, which is the definition of the orthogonal complement from the geometry lecture. So the weight vector is not on the boundary — it is the direction at right angles to it, and training a perceptron is rotating that one arrow until the plane it defines falls in the right place.',
  },
  {
    from: { topic: 'dl1', part: 'hyperplane' },
    to: { topic: 'lec2', part: 'subspaces' },
    kind: 'builds-on',
    carries: 'a hyperplane is a subspace, shifted',
    detail:
      'w · x = 0 passes through the origin and is a genuine subspace of ℝⁿ, one dimension short of the whole space. Adding the bias makes it w · x + b = 0, which is that subspace slid off the origin — and the subspace page is where you proved a shifted set like that fails the "contains 0" test, which is the honest reason the bias has to be carried as a separate number.',
  },
  {
    from: { topic: 'dl1', part: 'hyperplane' },
    to: { topic: 'lec3', part: 'norms' },
    kind: 'builds-on',
    carries: '‖w‖ sets the scale, not the boundary',
    detail:
      'Doubling every weight doubles z for every input and moves the boundary nowhere, because w · x + b = 0 and 2(w · x + b) = 0 have the same solutions. That is why the perceptron rule can end at w₀ = 2, w₁ = −2 where the hand solution said 1 and −1: the norm changed, the boundary did not.',
  },
  {
    from: { topic: 'dl1', part: 'separable' },
    to: { topic: 'lec1', part: 'howmany' },
    kind: 'builds-on',
    carries: 'a straight-line rule in two unknowns',
    detail:
      '2x₁ + 3x₂ − 25 = 0 is a linear equation of exactly the kind Lecture 1 opened with, and its picture is the same straight line. The difference is what you do with it: there you solved for the point where lines meet, here you keep the line and ask which side each data point falls on.',
  },
  {
    from: { topic: 'dl1', part: 'notgate' },
    to: { topic: 'lec1', part: 'system' },
    kind: 'builds-on',
    carries: 'one inequality per training row',
    detail:
      'Solving a gate by hand turns each row of the truth table into an inequality in the unknown weights, and you then look for any point satisfying all of them at once — the same "all constraints must hold together" reading of a system that Lecture 1 built. It is a system of inequalities rather than equations, so the answer is a whole region and not a single point, which is why more than one set of weights is correct.',
  },
  {
    from: { topic: 'dl1', part: 'andor' },
    to: { topic: 'lec1', part: 'howmany' },
    kind: 'contrast',
    carries: 'region of answers, not one answer',
    detail:
      'Lecture 1 showed a system of two linear equations has no solution, exactly one, or infinitely many. Weight-solving lands squarely in the third case for a reason worth stating in an exam: the constraints are strict inequalities, so any solution can be nudged slightly and stay a solution, and w = (−1, 2, 2) for AND is one point of an infinite region.',
  },
  {
    from: { topic: 'dl1', part: 'xor' },
    to: { topic: 'lec2', part: 'span' },
    kind: 'builds-on',
    carries: 'what one linear rule can reach',
    detail:
      'The span page showed a set of directions reaching a line, a plane, or everything, and never more than that however many times you combine them. XOR is the same ceiling in classification form: one linear rule can only ever cut the plane in two with a straight cut, and the four XOR points need two cuts, so no choice of w₀, w₁, w₂ exists.',
  },
  {
    from: { topic: 'dl1', part: 'xor' },
    to: { topic: 'lec2', part: 'independence' },
    kind: 'builds-on',
    carries: 'stacking linear maps adds nothing',
    detail:
      'Two linear layers in a row collapse into one, for the same reason a vector that is already a combination of the others adds nothing to a span: composing linear maps gives another linear map. That is the precise statement of why the XOR fix needs a threshold between the layers and not just a second layer.',
  },
  {
    from: { topic: 'dl1', part: 'mlp' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'one layer = one matrix multiply',
    detail:
      'The two hidden units of the XOR network share the same inputs, so their weights stack into a 2 × 2 matrix and the pair of dot products becomes a single matrix–vector product — row of the matrix meets column of the input, which is exactly the rule the multiplication page had you press cells to see. Every "deep" network in the rest of the course is this, repeated, with a bend in between.',
  },
  {
    from: { topic: 'dl1', part: 'mlp' },
    to: { topic: 'algebra' },
    kind: 'builds-on',
    carries: 'composition, and why a bend is needed',
    detail:
      'The algebra page stacked two straight-line rules and got a third straight-line rule, then showed a single max(0, z) breaking that. The XOR network is the smallest real example of the same point: the hidden thresholds are the bend, and without them the whole two-layer network would be one perceptron again and would still fail.',
  },
  {
    from: { topic: 'dl1', part: 'exercise' },
    to: { topic: 'ism2', part: 'complement' },
    kind: 'same-idea',
    carries: 'negation is the complement',
    detail:
      'NOR is “not OR” and NAND is “not AND”, and the complement Aᶜ from the probability lecture is the same operation: every outcome that was in swaps with every outcome that was out. That is why solving OR and AND is enough to have solved four gates, and it is the same reason P(Aᶜ) = 1 − P(A) needs no separate proof.',
  },
  {
    from: { topic: 'dl1', part: 'exercise' },
    to: { topic: 'dotproduct' },
    kind: 'builds-on',
    carries: 'negating w reverses every ⟨w, x⟩ at once',
    detail:
      'The trick that answers both exercises in one line is that ⟨−w, x⟩ = −⟨w, x⟩ for every x — a property of the dot product, not of these particular gates. So flipping the sign of every weight flips which half-plane fires, everywhere, in one move.',
  },
  {
    from: { topic: 'dl1', part: 'learning' },
    to: { topic: 'gradient' },
    kind: 'same-idea',
    carries: 'η, the learning rate',
    detail:
      'Δwᵢ = η(t − o)xᵢ has the same three pieces as a gradient descent step: a direction, a size of mistake, and η deciding how far to move. The gradient-descent page is where you can see what a too-large η does — the perceptron rule inherits it, which is why the deck says convergence needs η small as well as the data separable.',
  },
  {
    from: { topic: 'dl1', part: 'learning' },
    to: { topic: 'mllec1', part: 'batching' },
    kind: 'same-idea',
    carries: 'one example per update',
    detail:
      'The perceptron rule looks at one training row, updates, and moves to the next — which is online learning by the definition the ML lecture gave, not batch. Knowing that names what you are doing when you fill in the trace table row by row, and it is why the order of the rows can change the weights you end up with.',
  },
  {
    from: { topic: 'dl1', part: 'trace' },
    to: { topic: 'lec0a', part: 'practice' },
    kind: 'same-idea',
    carries: 'work it by hand, then check it',
    detail:
      'The mathematical foundations practice pages are the model for this one: the deck prints a trace table, and the page reproduces the deck’s own numbers rather than a plausible-looking substitute. Anywhere the working can be checked by substituting back, it has been.',
  },

  /* --------------------------------------------------------- concept pages */
  {
    from: { topic: 'neuron' },
    to: { topic: 'dotproduct' },
    kind: 'builds-on',
    carries: '⟨w, x⟩',
    detail:
      'A neuron is a dot product followed by a decision, so everything the dot-product page establishes about sign, length and angle transfers directly. If the neuron page will not click, that page is the one to reread first.',
  },
  {
    from: { topic: 'neuron' },
    to: { topic: 'dl1', part: 'neuron' },
    kind: 'same-idea',
    carries: 'the lecture’s own version',
    detail:
      'This concept page is the reusable cut of what Session 1 taught in order. The chapter part carries the slide numbers and the deck’s own notation; this page assumes you have forgotten it and starts again.',
  },
  {
    from: { topic: 'linsep' },
    to: { topic: 'lec3', part: 'orthogonality' },
    kind: 'builds-on',
    carries: 'the normal vector of a boundary',
    detail:
      'A decision boundary is the set of points orthogonal to w once the bias is subtracted off, which is the orthogonal complement from the geometry lecture. That is what makes "which side am I on?" a question about the sign of one inner product.',
  },
  {
    from: { topic: 'linsep' },
    to: { topic: 'dl1', part: 'separable' },
    kind: 'same-idea',
    carries: 'the thirteen-point example',
    detail:
      'The chapter part works the lecture’s own thirteen labelled points against 2x₁ + 3x₂ − 25 = 0. This page takes the same lab and asks the general question instead: when does a straight cut exist at all, and what do you do when it does not.',
  },
  {
    from: { topic: 'lossfn' },
    to: { topic: 'regression' },
    kind: 'builds-on',
    carries: 'sum of squared errors',
    detail:
      'The regression page is a loss function you can drag: move the line and the number moves. This page keeps that number and puts a second one beside it, so you can see squared error and error rate disagree about which of two models is better.',
  },
  {
    from: { topic: 'lossfn' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'squares, and why one bad point dominates',
    detail:
      'Variance squares the distance from the mean, so a point twice as far away counts four times as much — the statistics course made that visible by growing literal squares. A squared-error loss has exactly that sensitivity, and it is the reason a handful of mislabelled targets can pull a whole network off course.',
  },
  /* ------------------------------------------------- session 2, the perceptron */
  {
    from: { topic: 'dl2', part: 'module' },
    to: { topic: 'dl1' },
    kind: 'contrast',
    carries: 'the same unit, different conventions',
    detail:
      'Session 1 defines the perceptron with ±1 inputs firing strictly above zero; this session uses 0/1 inputs firing at zero or above. Read them as two recipes for one cake — follow either carefully and it works, take a step from each and the gate weights come out wrong on a row you will not notice.',
  },
  {
    from: { topic: 'dl2', part: 'brain' },
    to: { topic: 'dl1', part: 'brain' },
    kind: 'same-idea',
    carries: 'slide 45, word for word',
    detail:
      'This is literally the same slide as session 1, down to the arithmetic problem: one second divided by one millisecond is 1000 and the slide says 100. Both pages show the division and neither picks an answer, because the deck does not.',
  },
  {
    from: { topic: 'dl2', part: 'bioneuron' },
    to: { topic: 'dl1', part: 'brain' },
    kind: 'contrast',
    carries: 'four parts instead of eight',
    detail:
      'Session 1 labelled the myelin sheath, the nodes of Ranvier and the Schwann cell; this deck names only dendrites, soma, axon and synapses. The shorter list is the more useful one, because each of its four maps onto exactly one piece of the artificial neuron and none of session 1’s extras map onto anything.',
  },
  {
    from: { topic: 'dl2', part: 'neuron' },
    to: { topic: 'neuron' },
    kind: 'same-idea',
    carries: 'the concept page for this unit',
    detail:
      'The artificial-neuron concept page is this material explained on its own terms rather than in the order the lecture took. Use the chapter page for the deck’s exact notation and the concept page when the geometry of w will not click.',
  },
  {
    from: { topic: 'dl2', part: 'neuron' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'the z-score, as feature scaling',
    detail:
      'The deck claims a weight “shows the importance of the feature”, which is only true once the features are comparable — the deciding quantity is the product wᵢxᵢ. Standardising each feature by subtracting its mean and dividing by its standard deviation is exactly the z-score from the statistics course, and it is what makes the claim true.',
  },
  {
    from: { topic: 'dl2', part: 'maths' },
    to: { topic: 'dl1', part: 'neuron' },
    kind: 'contrast',
    carries: 'the bias inside the sum, or outside it',
    detail:
      'Session 1 wrote z = Σᵢ₌₀ⁿ wᵢxᵢ with x₀ nailed to 1, hiding the bias as w₀. This session writes z = Σᵢ₌₁ⁿ wᵢxᵢ + b with the bias added afterwards. Identical arithmetic, and the second is what libraries do, because the bias is initialised and regularised differently from the weights.',
  },
  {
    from: { topic: 'dl2', part: 'maths' },
    to: { topic: 'activation' },
    kind: 'same-idea',
    carries: 'f, and what choosing it does',
    detail:
      'Equation (2) leaves f open, and the activation concept page is what fills it in: the step makes a perceptron, the identity makes a linear regression, a bend makes a hidden unit worth having. If the general f feels like an empty gesture, that page is where it becomes concrete.',
  },
  {
    from: { topic: 'dl2', part: 'ann' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'units × (inputs + 1) parameters per layer',
    detail:
      'A layer of k units over m inputs is a k × m weight matrix plus k biases, and its forward pass is one matrix–vector product — the row-meets-column rule from the multiplication page. That is also where the parameter count comes from, and why the count grows with the product of the layer sizes rather than their sum.',
  },
  {
    from: { topic: 'dl2', part: 'connectionism' },
    to: { topic: 'dl1', part: 'brain' },
    kind: 'builds-on',
    carries: 'knowledge in the connections',
    detail:
      'Session 1 stated that a connectionist machine stores all world knowledge in the connections between its elements. This session turns that into four named principles and, in the lab, into something you can test: switch units off and watch the function degrade gradually rather than break.',
  },
  {
    from: { topic: 'dl2', part: 'perceptron' },
    to: { topic: 'dl1', part: 'perceptron' },
    kind: 'contrast',
    carries: 'z ≥ 0 against z > 0',
    detail:
      'Session 1 fires strictly above zero and sends z = 0 to −1; this deck fires at zero or above and sends it to 1. The difference is one point of the input space, and both sessions’ worked gate answers land on exactly that point — which is why it is worth stating your convention before answering anything.',
  },
  {
    from: { topic: 'dl2', part: 'andgate' },
    to: { topic: 'dl1', part: 'andor' },
    kind: 'contrast',
    carries: '(−1, 0.75, 0.75) against (−1, 2, 2)',
    detail:
      'The same gate, solved twice, with no shared number. Worse, session 1’s AND weights are this session’s OR weights, so quoting the wrong one does not produce nonsense — it produces a different gate that passes three of the four rows. The two pages are worth reading side by side once.',
  },
  {
    from: { topic: 'dl2', part: 'andgate' },
    to: { topic: 'lec1', part: 'system' },
    kind: 'builds-on',
    carries: 'one inequality per row',
    detail:
      'Each row of a truth table becomes one inequality in the unknown weights, and a correct answer is any point satisfying all four at once — the same "all constraints must hold together" reading of a system that Lecture 1 built. Because they are inequalities rather than equations, the answers form a region: here every equal pair between 0.5 and 1 works alongside w₀ = −1.',
  },
  {
    from: { topic: 'dl2', part: 'exercise' },
    to: { topic: 'dl1', part: 'exercise' },
    kind: 'same-idea',
    carries: 'negate the weights, negate the gate',
    detail:
      'Both sessions leave NOR and NAND as exercises, and both are solved by the same trick: flipping the sign of every weight flips the output for every input. The caveat differs, though — with this deck’s ≥ rule a row sitting exactly on zero fires either way, so the trick has to be checked rather than assumed.',
  },
  {
    from: { topic: 'dl2', part: 'pla' },
    to: { topic: 'dl1', part: 'learning' },
    kind: 'same-idea',
    carries: 'Δw = η(t − o)x, split in two',
    detail:
      'Session 1 wrote one update line, with x₀ = 1 carrying the bias. This deck writes two — one for the weights and one for the bias — and the second is simply the first with xᵢ set to 1. It also starts from random weights rather than zero, which matters the moment there is more than one unit.',
  },
  {
    from: { topic: 'dl2', part: 'pla' },
    to: { topic: 'gradient' },
    kind: 'builds-on',
    carries: 'η, the learning rate',
    detail:
      'η plays the same role here as on the gradient-descent page: it scales every step without changing its direction. What is unusual about this setting is that from a start on a multiple of η the learning rate rescales the whole run and changes no decision — a property of 0/1 inputs that does not survive into anything later.',
  },
  {
    from: { topic: 'dl2', part: 'nottrace' },
    to: { topic: 'dl1', part: 'trace' },
    kind: 'contrast',
    carries: 'two traces, two answers',
    detail:
      'Session 1’s trace on the same gate converges to w₀ = 2, w₁ = −2, and so does this deck’s printed working. But this deck also prints a definition of the tie-break that would give (−2, −2) instead. Both are correct NOT gates; only one is on the slide, and the difference is entirely what happens when h is exactly zero.',
  },
  {
    from: { topic: 'dl2', part: 'xor' },
    to: { topic: 'linsep' },
    kind: 'same-idea',
    carries: 'the midpoint argument',
    detail:
      'The proof that no line does XOR is the same two lines in both sessions: a linear score at a midpoint is the average of its values at the ends, and both diagonals of the unit square share the midpoint (0.5, 0.5). The concept page states it once for both.',
  },
  {
    from: { topic: 'dl2', part: 'xor' },
    to: { topic: 'dl1', part: 'mlp' },
    kind: 'builds-on',
    carries: 'the fix this deck names and does not build',
    detail:
      'This session ends the XOR story at "need multiple layers — multilayer perceptron". Session 1 already built the smallest one: two hidden units computing OR and NAND, feeding an output unit computing AND, with the whole truth table checked. Read that page for the construction this one promises.',
  },
  {
    from: { topic: 'dl2', part: 'separable' },
    to: { topic: 'lec3', part: 'orthogonality' },
    kind: 'builds-on',
    carries: 'the hyperplane as an orthogonal complement',
    detail:
      'An (n − 1)-dimensional hyperplane through the origin is exactly the set of vectors orthogonal to one normal vector, which is the orthogonal complement from the geometry lecture. Adding the bias slides that set off the origin, and the perceptron reports which side of it you are on.',
  },
  {
    from: { topic: 'dl2', part: 'fourparts' },
    to: { topic: 'dotproduct' },
    kind: 'same-idea',
    carries: 'wᵀx, ⟨w, x⟩ and Σ wᵢxᵢ',
    detail:
      'Three notations for one number, and all three appear in this course. The transpose form is bookkeeping — it lays the column on its side so a 1 × (n + 1) row can meet an (n + 1) × 1 column — and everything the dot-product page proves about sign and angle applies unchanged.',
  },
  {
    from: { topic: 'dl2', part: 'encodings' },
    to: { topic: 'dl1', part: 'perceptron' },
    kind: 'contrast',
    carries: 'four definitions of one unit',
    detail:
      'This page collects every version of the perceptron across the two sessions and puts them in one table. They agree everywhere except at z = 0 — and z = 0 is where session 1’s NOT answer, both of session 2’s training runs and session 1’s trace table all land.',
  },

  /* --------------------------------------------- session 3, linear regression */
  {
    from: { topic: 'dl3', part: 'whatis' },
    to: { topic: 'mllec1', part: 'regression' },
    kind: 'same-idea',
    carries: 'a numerical target',
    detail:
      'The ML course defined regression as supervised learning with a numerical rather than categorical target, and this deck repeats it in ℝᵈ → ℝ notation. The test is the same in both: do values between two targets mean anything? If they do it is regression, whatever the labels look like.',
  },
  {
    from: { topic: 'dl3', part: 'linear' },
    to: { topic: 'regression' },
    kind: 'builds-on',
    carries: 'drag a line, watch the error',
    detail:
      'The linear regression concept page is this model with the sum of squared errors made draggable — the same line, the same residuals, the same number going up and down. This session adds the matrix notation and the algorithm that finds the line for you instead of your hand.',
  },
  {
    from: { topic: 'dl3', part: 'components' },
    to: { topic: 'dl1', part: 'components' },
    kind: 'same-idea',
    carries: 'data · model · objective · algorithm',
    detail:
      'The same four-component checklist, filled in for regression. Exactly two boxes change from the perceptron: the activation becomes the identity and the objective becomes squared error — and those two changes are what make gradient descent possible at all.',
  },
  {
    from: { topic: 'dl3', part: 'design' },
    to: { topic: 'lec0a', part: 'matrix' },
    kind: 'builds-on',
    carries: 'the m × n matrix, with a ones column',
    detail:
      'The design matrix is the matrix from Lecture 0a with one row per example, plus a leading column of ones so the bias becomes an ordinary weight. The shape rules from that page are what make ŷ = Xw work: (N × (d + 1)) times ((d + 1) × 1) is N × 1, one prediction per row.',
  },
  {
    from: { topic: 'dl3', part: 'design' },
    to: { topic: 'designmat' },
    kind: 'same-idea',
    carries: 'the concept page for this arrangement',
    detail:
      'The design-matrix concept page takes the same idea and works through the shapes of every object that depends on it — the prediction, the loss, the gradient. Worth reading once if matrix shapes are where you get stuck, because almost every formula in the rest of the course is written this way.',
  },
  {
    from: { topic: 'dl3', part: 'neuron' },
    to: { topic: 'dl2', part: 'maths' },
    kind: 'builds-on',
    carries: 'equation (2), with f filled in',
    detail:
      'Session 2 wrote ŷ = f(Σwᵢxᵢ + b) and deliberately left f unspecified. This page sets f to the identity and nothing else changes — same inputs, same weights, same sum. Linear regression is that equation with one blank filled.',
  },
  {
    from: { topic: 'dl3', part: 'identity' },
    to: { topic: 'dl1', part: 'perceptron' },
    kind: 'contrast',
    carries: 'a derivative of 1 against a derivative of 0',
    detail:
      'The step activation has a derivative of zero wherever it is defined, so nothing about the error can reach the weights and gradient descent is impossible — which is why the perceptron needs a bespoke rule. The identity’s derivative is exactly 1, and that single change is what puts the whole of calculus back on the table.',
  },
  {
    from: { topic: 'dl3', part: 'loss' },
    to: { topic: 'lossfn' },
    kind: 'same-idea',
    carries: 'lower is better, made specific',
    detail:
      'The objective-function concept page explains why losses are written so lower is better and why the loss you optimise need not be the metric you report. This page is the first time this course writes one down as a formula rather than describing it.',
  },
  {
    from: { topic: 'dl3', part: 'whysq' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'builds-on',
    carries: 'squared error is minimised by the mean',
    detail:
      'The statistics course established that the mean minimises total squared distance and the median minimises total absolute distance. That is exactly why squared error is dragged by an outlier and absolute error is not — and why switching to an L1 loss changes what the model predicts, not just how fast it gets there.',
  },
  {
    from: { topic: 'dl3', part: 'whysq' },
    to: { topic: 'lec3', part: 'norms' },
    kind: 'builds-on',
    carries: '‖Xw − y‖², the squared norm',
    detail:
      'Writing the loss as (1/2N)‖Xw − y‖² uses the norm from the geometry lecture: the loss is the squared length of the error vector. Writing it as (Xw − y)ᵀ(Xw − y) is the same thing again, since a vector dotted with itself is its squared length.',
  },
  {
    from: { topic: 'dl3', part: 'surface' },
    to: { topic: 'gradient' },
    kind: 'builds-on',
    carries: 'the bowl, and its single bottom',
    detail:
      'The gradient-descent page rolls a marker down a bowl and shows what a too-large step does. This page is where the bowl comes from: J is quadratic in w, so the surface really is a bowl and any downhill route reaches the best answer. That guarantee is local to linear models and does not survive a hidden layer.',
  },
  {
    from: { topic: 'dl3', part: 'gd' },
    to: { topic: 'gradient' },
    kind: 'same-idea',
    carries: 'w ← w − η ∇J',
    detail:
      'The same update, the same minus sign, the same trade-off in η. What this session adds is the exact gradient for a specific loss, so the abstract "read the slope" becomes a formula you can compute by hand on three rows of data.',
  },
  {
    from: { topic: 'dl3', part: 'batch' },
    to: { topic: 'mllec1', part: 'batching' },
    kind: 'same-idea',
    carries: 'batch, mini-batch, online',
    detail:
      'The ML course drew the distinction by how much data goes into one update; this algorithm is the batch end of it, reading every example before taking a single step. That is why each step is exact and expensive, and why practice uses mini-batches instead.',
  },
  {
    from: { topic: 'dl3', part: 'gradient' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'Xᵀ(Xw − y), and why the shapes work',
    detail:
      'The gradient is written as a matrix product precisely so it can be computed in one call: Xᵀ is (d + 1) × N and the error is N × 1, so the result has one entry per parameter. Checking that shape against the shape of w is the fastest way to catch a wrong transpose.',
  },
  {
    from: { topic: 'dl3', part: 'gradient' },
    to: { topic: 'dotproduct' },
    kind: 'builds-on',
    carries: 'each row of Xᵀ dotted with the errors',
    detail:
      'Read the matrix form one entry at a time and it is a dot product: the gradient for weight j is the column of feature j dotted with the error vector, divided by N. So a feature that was large exactly where the model was wrong gets a large gradient — which is the sum form on the same slide, said in the other notation.',
  },
  {
    from: { topic: 'dl3', part: 'update' },
    to: { topic: 'dl2', part: 'pla' },
    kind: 'contrast',
    carries: 'a gradient step against a mistake-driven step',
    detail:
      'Both rules move the weights by η times something. The perceptron’s something is the mistake on one example and is zero whenever the answer is right; gradient descent’s is the slope of a smooth loss and is almost never exactly zero. That is why one stops the moment it is correct and the other keeps improving after it already is.',
  },
  {
    from: { topic: 'dl3', part: 'example' },
    to: { topic: 'lec0a', part: 'multiply' },
    kind: 'builds-on',
    carries: 'Xᵀe worked out by hand',
    detail:
      'The gradient step of the worked example is a 2 × 3 matrix times a 3 × 1 vector, done entry by entry — row of the first meets column of the second, exactly as the multiplication page had you press cells to see. If (−3.67, −8.33) does not fall out, that page is where the arithmetic is.',
  },
  {
    from: { topic: 'dl3', part: 'traintest' },
    to: { topic: 'dl1', part: 'generalise' },
    kind: 'same-idea',
    carries: 'the held-back set',
    detail:
      'Session 1 defined overfitting as doing well on training data and failing on unseen data. This page gives the two formulas that measure it — the same expression summed over different rows — and the deck’s suggested split of 90–99% training.',
  },
  {
    from: { topic: 'dl3', part: 'metrics' },
    to: { topic: 'metrics' },
    kind: 'same-idea',
    carries: 'the concept page for these four scores',
    detail:
      'The metrics concept page takes MSE, RMSE, MAE and R² together and works out what each is sensitive to, including two facts this deck does not state: RMSE is never below MAE, and R² never falls when a feature is added. Useful before an exam question that asks you to choose between them.',
  },
  {
    from: { topic: 'dl3', part: 'metrics' },
    to: { topic: 'spread' },
    kind: 'builds-on',
    carries: 'why squaring makes one point dominate',
    detail:
      'The statistics course made this visible by growing literal squares: a point twice as far away counts four times as much. MSE has exactly that sensitivity and MAE does not, which is the whole content of the deck’s note that MAE is less sensitive to outliers.',
  },
  {
    from: { topic: 'dl3', part: 'r2' },
    to: { topic: 'centre' },
    kind: 'builds-on',
    carries: 'ȳ, the baseline',
    detail:
      'R² divides by the total squared distance of the targets from their own mean, so the model it compares against is “predict the mean, always”. The averages page is where that quantity — and why the mean is the natural centre for squared distance — was established.',
  },
  {
    from: { topic: 'dl3', part: 'tips' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'the z-score, (x − μ)/σ',
    detail:
      'The deck’s standardisation recipe is the z-score from the statistics course, unchanged. What is new is the reason for it here: it makes the loss bowl rounder, which raises the largest usable learning rate and cuts the number of iterations, without changing the answer at all.',
  },
  {
    from: { topic: 'dl3', part: 'debug' },
    to: { topic: 'dl1', part: 'optimiser' },
    kind: 'builds-on',
    carries: 'what a too-large η does',
    detail:
      'Session 1’s lab let you push η until the marker walked out of the bowl. Three of the four symptoms on this checklist are that same divergence at three distances from the edge — NaN past it, oscillation just below it, crawling far below. Only the fourth, a gap between training and test error, is not about η at all.',
  },
  {
    from: { topic: 'dl3', part: 'summary' },
    to: { topic: 'dl2', part: 'fourparts' },
    kind: 'same-idea',
    carries: 'the loop, with the objective finally written down',
    detail:
      'Session 2 listed the same four components for the perceptron but could only describe its objective as “the deviation of t and ŷ”. This session closes the loop by writing the objective as a formula, differentiating it, and running the result — which is why module 3 can start from here.',
  },

  {
    from: { topic: 'dl2', part: 'compare' },
    to: { topic: 'dl1', part: 'brain' },
    kind: 'contrast',
    carries: 'inspiration is not a mechanism',
    detail:
      'Session 1 used the brain to argue for one thing only — that the computation must be massively parallel. This table is where the analogy is cashed out row by row, and only one row survives as a genuine likeness: adaptive synapses become adjustable weights. Keep the two apart in an exam answer, because nothing in the perceptron rule is derived from biology.',
  },
  {
    from: { topic: 'dl2', part: 'whenann' },
    to: { topic: 'mllec1', part: 'tradeoff' },
    kind: 'builds-on',
    carries: 'accuracy against interpretability',
    detail:
      'The ML lecture plotted methods against those two axes and put neural networks in the accurate-but-opaque corner. This deck turns that observation into a condition of use: “explainability of the result is unimportant” is listed as a requirement, so a problem where you must justify a decision fails it however well the other four score.',
  },
  {
    from: { topic: 'dl2', part: 'orgate' },
    to: { topic: 'linsep' },
    kind: 'same-idea',
    carries: 'one corner cut off from three',
    detail:
      'AND isolates the corner (1, 1) and OR isolates (0, 0), and a straight line can always separate one point from three — which is why both gates are easy and both have whole regions of correct weights. The linear-separability page is where that becomes a general statement, and where the case that breaks it is waiting.',
  },
  {
    from: { topic: 'dl3', part: 'graph' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'why Xᵀ appears on the backward arrow',
    detail:
      'Going forwards, ŷ = Xw is a matrix–vector product. Going backwards, the error is carried to the weights by Xᵀ — the transpose of the very matrix it went through — which is a fact about how a matrix product differentiates rather than anything specific to regression. Being able to say why is the idea backpropagation generalises to every layer.',
  },
  /* -------------------------------------------------- the new concept pages */
  {
    from: { topic: 'activation' },
    to: { topic: 'algebra' },
    kind: 'builds-on',
    carries: 'stacking two straight lines gives a straight line',
    detail:
      'The algebra page showed that composing two linear rules produces a third linear rule, and that a single max(0, z) breaks the pattern. That is the whole argument for why an activation between layers is compulsory rather than decorative.',
  },
  {
    from: { topic: 'metrics' },
    to: { topic: 'lossfn' },
    kind: 'contrast',
    carries: 'the loss you train on, the metric you report',
    detail:
      'The objective-function page is about the number gradient descent minimises; this one is about the numbers you put in a report. They are usually different on purpose — MSE is smooth and convex so it trains well, RMSE and MAE are in the target’s units so they mean something to a person.',
  },
  {
    from: { topic: 'designmat' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'row meets column, N times over',
    detail:
      'Every entry of Xw is one row of X dotted with w, which is the multiplication rule from the maths course applied N times in one call. The design matrix is not new mathematics — it is the same product, arranged so the bias needs no special case.',
  },

  /* ------------------ Lecture 2, vector spaces: where it reaches out ------ */
  {
    from: { topic: 'lec2', part: 'why' },
    to: { topic: 'lec1', part: 'general' },
    kind: 'builds-on',
    carries: 'x = xₚ + xₙ, the general solution',
    detail:
      'Lecture 1 showed that every solution of Ax = b is one particular solution plus anything from the homogeneous system, which is why an under-determined system has a whole family of answers rather than two or three. This page says what that family is: only the homogeneous half is closed under addition, so only Ax = 0 gives a space, and Ax = b for b ≠ 0 gives that space shifted off the origin.',
  },
  {
    from: { topic: 'lec2', part: 'why' },
    to: { topic: 'regression' },
    kind: 'used-by',
    carries: 'the normal equations XᵀXw = Xᵀy',
    detail:
      'The regression page fits a line by minimising the squared error, which comes down to solving XᵀXw = Xᵀy. When two feature columns duplicate each other that system has no unique answer, and this page names the shape of the ambiguity: a particular w plus the whole nullspace of X, which is exactly the shifted space above.',
  },
  {
    from: { topic: 'lec2', part: 'spaces' },
    to: { topic: 'dl3', part: 'update' },
    kind: 'used-by',
    carries: 'w ← w − η∇L, one scaling and one addition',
    detail:
      'The Deep Neural Networks session derives the update rule and then applies it for pages on end without ever asking what makes it legal. It is legal because the parameters live in a vector space: the update is the outer operation followed by the inner one, and closure is the promise that the result is still a model.',
  },
  {
    from: { topic: 'lec2', part: 'examples' },
    to: { topic: 'lec0a', part: 'algebra' },
    kind: 'builds-on',
    carries: 'A + B and λA, entry by entry',
    detail:
      'Lecture 0a defined adding two matrices and multiplying one by a number, and made the point that the shapes have to match. Those two operations are precisely what slide 8 needs in order to call ℝᵐˣⁿ a vector space, so nothing new is being defined here — the old definitions are being recognised as an instance of the general one.',
  },
  {
    from: { topic: 'lec2', part: 'examples' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'used-by',
    carries: 'one row of a dataset',
    detail:
      'The Machine Learning lecture laid out feature tables and named the columns as features and the target. A row of one of those tables is the first example on this page: a point in ℝⁿ, and therefore something you may add and scale — which is what lets a model average two examples or take a step between them.',
  },
  {
    from: { topic: 'lec2', part: 'subspaces' },
    to: { topic: 'vectorspace' },
    kind: 'same-idea',
    carries: 'the three-line subspace test',
    detail:
      'The concept page states the same test — non-empty, closed under scaling, closed under addition — and works it on the standard geometric examples. Go there if the definition itself is what will not stick; stay here for it in the order the lecture built it, with the candidates you can try to break by dragging.',
  },
  {
    from: { topic: 'lec2', part: 'subspaces' },
    to: { topic: 'centre' },
    kind: 'builds-on',
    carries: 'the mean, subtracted before anything else',
    detail:
      'The statistics course defines the mean as the balance point of the data. It is why every PCA pipeline subtracts it first: a subspace is closed under scaling and so must contain the origin, and uncentred data lies near a flat set that misses it — so the object PCA looks for is not there to be found until the mean is removed.',
  },
  {
    from: { topic: 'lec2', part: 'subspaces' },
    to: { topic: 'rank' },
    kind: 'builds-on',
    carries: 'rank + nullity = number of columns',
    detail:
      'The rank page counts how many of your columns say something new. The nullspace on this page is what the rest amount to: its dimension is exactly the shortfall, and its members are the weight changes that leave every prediction untouched. Rank tells you how much information you have; nullity tells you how much of a model the data will never pin down.',
  },
  {
    from: { topic: 'lec2', part: 'subspaces' },
    to: { topic: 'covariance' },
    kind: 'used-by',
    carries: 'a singular covariance matrix',
    detail:
      'The covariance page builds the matrix that records how features move together. If two features are exact copies, that matrix is singular — its nullspace is non-trivial — and every method that needs to invert it, from the Mahalanobis distance to a Gaussian mixture model, fails at that exact point. This page is why the failure is structural rather than a numerical accident.',
  },
  {
    from: { topic: 'lec2', part: 'span' },
    to: { topic: 'neuron' },
    kind: 'used-by',
    carries: 'z = w · x',
    detail:
      'A neuron computes a weighted sum of its inputs, which is a linear combination with the weights as the coefficients. Everything on this page about what a set of vectors can and cannot reach is therefore a statement about what a single unit can and cannot compute before its activation is applied.',
  },
  {
    from: { topic: 'lec2', part: 'span' },
    to: { topic: 'lec0b', part: 'combination' },
    kind: 'builds-on',
    carries: 'λ₁x₁ + λ₂x₂, drawn as arrows',
    detail:
      'Lecture 0b introduced the linear combination geometrically, as scaling two arrows and laying them nose to tail, and let you read the two amounts off the plane. This page keeps that picture for two vectors and then states the definition for k of them, because from the next part onwards the vectors have four or five components and there is nothing left to draw.',
  },
  {
    from: { topic: 'lec2', part: 'span' },
    to: { topic: 'designmat' },
    kind: 'used-by',
    carries: 'ŷ = Xw, and where it can land',
    detail:
      'The design matrix page shows how a whole dataset is predicted in one multiplication. This page says what the set of possible predictions is: as w ranges over everything, Xw ranges over the span of X’s columns and nothing else — so least squares is the projection of y onto that span, and a feature already inside it cannot reduce the training error at all.',
  },
  {
    from: { topic: 'lec2', part: 'independence' },
    to: { topic: 'lec0b', part: 'independence' },
    kind: 'same-idea',
    carries: 'Σ λᵢxᵢ = 0 with some λᵢ ≠ 0',
    detail:
      'The definition is word for word the one from Lecture 0b, so if it made sense there nothing needs relearning. What is new here is the reading behind it — dependence means one vector is redundant — and the three consequences on slide 17, including that any set containing the zero vector is dependent whatever else is in it.',
  },
  {
    from: { topic: 'lec2', part: 'independence' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'used-by',
    carries: 'the one-hot columns of a categorical feature',
    detail:
      'The Machine Learning lecture showed feature tables with categorical columns in them, and every such column becomes several 0/1 columns before a model sees it. Those columns always sum to the all-ones column, which is the intercept — an exact linear dependence you create yourself, and the reason encoders offer an option to drop one level.',
  },
  {
    from: { topic: 'lec2', part: 'pivots' },
    to: { topic: 'lec0a', part: 'echelon' },
    kind: 'builds-on',
    carries: 'the staircase, and its leading entries',
    detail:
      'Lecture 0a built the row-echelon form move by move and named the leading entry of each row. This page puts that machinery to a different use: the vectors go in as columns and the rows get operated on, because row operations cannot change which combinations of the columns vanish — so the pivot positions answer a question about the columns.',
  },
  {
    from: { topic: 'lec2', part: 'pivots' },
    to: { topic: 'rank' },
    kind: 'same-idea',
    carries: 'rank = the number of pivots',
    detail:
      'The rank page counts pivots and calls the answer rank; this page counts the same pivots and calls the answer the number of independent vectors. They are one number with two names, which is worth knowing before an exam asks for either.',
  },
  {
    from: { topic: 'lec2', part: 'pivots' },
    to: { topic: 'lec0a', part: 'rref' },
    kind: 'builds-on',
    carries: 'why the reduced form is unique and the echelon form is not',
    detail:
      'Lecture 0a made the point by taking two different routes and landing in the same reduced form. This page takes two routes that land on genuinely different echelon forms, to show what does and does not survive the choice: the pivot positions do, so the independence verdict never depends on how you eliminated.',
  },
  {
    from: { topic: 'lec2', part: 'coords' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'Bλ as a combination of B’s columns',
    detail:
      'The whole argument of slides 22 to 25 turns on reading Bλ as a mixture of the columns of B with the entries of λ as the amounts — the column picture from the multiplication page rather than the row-times-column one. Read it the other way and the step B(Σ ψⱼλⱼ) = 0 has no obvious meaning.',
  },
  {
    from: { topic: 'lec2', part: 'counting' },
    to: { topic: 'dl3', part: 'traintest' },
    kind: 'used-by',
    carries: 'a perfect training score that proves nothing',
    detail:
      'The Deep Neural Networks session insists on a held-back test set because training error can be driven down without the model learning anything. This page supplies the sharpest case of that: with more features than samples the columns are guaranteed dependent, so infinitely many weight vectors fit the training data exactly — and they disagree everywhere else.',
  },
  {
    from: { topic: 'lec2', part: 'basis' },
    to: { topic: 'basis' },
    kind: 'same-idea',
    carries: 'span, generating set, basis',
    detail:
      'The concept page carries the same three definitions and the same worked collapse of a plane to a line. Use it when you want the idea on its own; use this chapter when you want it in the order the lecture built it, with the elimination that decides which generators to keep.',
  },
  {
    from: { topic: 'lec2', part: 'basis' },
    to: { topic: 'lec3', part: 'orthobasis' },
    kind: 'used-by',
    carries: 'an orthonormal basis',
    detail:
      'Lecture 3 adds two requirements to the definition on this page: every basis vector has length 1 and any two are at right angles. Nothing about being a basis changes, but finding the coordinates stops needing a matrix inverse and becomes a dot product per component — which is why almost every practical basis you meet, PCA components included, is built to be orthonormal.',
  },
  {
    from: { topic: 'lec2', part: 'findbasis' },
    to: { topic: 'lec0a', part: 'rank' },
    kind: 'builds-on',
    carries: 'copy a row and watch the count drop',
    detail:
      'Lecture 0a introduced rank by duplicating a row and watching the number of independent rows fall. The three-step recipe on this page is that observation turned into a procedure for columns: eliminate, and keep the original spanning vectors sitting at the pivot positions.',
  },

  /* ----------------------------------- ISM Lecture 3, into the earlier ones */
  {
    from: { topic: 'ism3', part: 'revise' },
    to: { topic: 'ism2', part: 'define' },
    kind: 'builds-on',
    carries: 'the number you started with',
    detail:
      'Lecture 2 gave three ways of arriving at a probability — count the outcomes, run the experiment many times, or state the axioms — and treated the result as final. This page renames that number the prior and says it is only final until you learn something, which is the move the rest of the lecture is built on.',
  },
  {
    from: { topic: 'ism3', part: 'defn' },
    to: { topic: 'ism2', part: 'space' },
    kind: 'builds-on',
    carries: '|A| / |S|, and the S underneath it',
    detail:
      'The classical definition counted the outcomes you wanted and divided by the size of the whole sample space. Conditioning changes exactly one thing in that fraction: the denominator becomes |B| instead of |S|, which is why the board can derive P(A | B) by counting and let the |S| cancel top and bottom.',
  },
  {
    from: { topic: 'ism3', part: 'defn' },
    to: { topic: 'ism2', part: 'setops' },
    kind: 'builds-on',
    carries: 'P(A ∩ B), drawn as a real area',
    detail:
      'The two-circle lab in Lecture 2 made the intersection a genuine overlapping area rather than a number someone typed in. That same overlap is the numerator of every conditional probability on this page — nothing about it changes when you condition, which is exactly why the whole of the change lives in the denominator.',
  },
  {
    from: { topic: 'ism3', part: 'complementcond' },
    to: { topic: 'ism2', part: 'complement' },
    kind: 'builds-on',
    carries: 'P(A) + P(Aᶜ) = 1',
    detail:
      'The complement rule was proved in Lecture 2 by splitting S into A and everything else. Here it is applied inside a conditional world instead of the whole one, which is what makes parts (a) and (b) of Example 3 add to 1 and gives you a free check on both answers.',
  },
  {
    from: { topic: 'ism3', part: 'complementcond' },
    to: { topic: 'ism2', part: 'addition' },
    kind: 'builds-on',
    carries: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
    detail:
      'The addition rule is where part (d) of Example 3 gets its denominator: conditioning on "holds at least one card" means dividing by P(A ∪ B), which has to be assembled from the three given numbers first. Without the subtraction of the overlap the denominator comes out at 1.0 and the answer at 0.5 instead of 0.67.',
  },
  {
    from: { topic: 'ism3', part: 'independent' },
    to: { topic: 'ism2', part: 'independent' },
    kind: 'builds-on',
    carries: 'P(A ∩ B) = P(A)·P(B) as a test',
    detail:
      'Lecture 2 gave the product form as the definition of independence and left it there. This page adds the conditional form P(A | B) = P(A) and proves each from the other in both directions, so the earlier test is now the same statement as "being told B changes nothing about A" rather than a separate fact to memorise.',
  },
  {
    from: { topic: 'ism3', part: 'independent' },
    to: { topic: 'ism2', part: 'exclusive' },
    kind: 'contrast',
    carries: 'P(A ∩ B) = 0 against P(A ∩ B) = P(A)·P(B)',
    detail:
      'Mutually exclusive means the circles do not touch, which Lecture 2 demonstrated by pulling them apart. Independence needs the overlap to be exactly P(A)·P(B), so for events with any probability at all the two conditions cannot hold together — and the lab on this page shows both tests failing at once the moment you drag the overlap to zero.',
  },
  {
    from: { topic: 'ism3', part: 'atleastone' },
    to: { topic: 'ism2', part: 'complement' },
    kind: 'same-idea',
    carries: '1 − P(none)',
    detail:
      'Lecture 2 introduced the complement as the quick way in whenever an event is awkward to count directly. Example 5 is that hint at full strength: "at least one right-handed" covers seven of the eight outcomes of three draws, and subtracting the single remaining outcome from 1 replaces adding up all seven.',
  },
  {
    from: { topic: 'ism3', part: 'partition' },
    to: { topic: 'ism2', part: 'exclusive' },
    kind: 'builds-on',
    carries: 'mutually exclusive, extended to k events',
    detail:
      'Lecture 2 defined mutually exclusive for a pair of events. A partition is that condition imposed across the whole collection at once, plus the requirement that the slices leave nothing out — and the theorem in the next part needs both halves, since overlapping slices double-count and missing ones silently drop a route.',
  },
  {
    from: { topic: 'ism3', part: 'totalproof' },
    to: { topic: 'ism2', part: 'axioms' },
    kind: 'builds-on',
    carries: 'the third axiom: disjoint events add',
    detail:
      'The axioms lab in Lecture 2 rejected four candidate assignments for breaking one rule or another, the third being that probabilities of events that cannot both happen simply add. Line 5 of this proof is that axiom and nothing else, which is why the board spends a whole page proving the pieces B ∩ Aᵢ are pairwise disjoint before it is allowed to use it.',
  },
  {
    from: { topic: 'ism3', part: 'totalexamples' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'same-idea',
    carries: 'Σ(f·x) / N, the weighted mean',
    detail:
      'Lecture 1 worked out the mean of grouped data by weighting each value by how often it occurred and dividing by the total count. Total probability is the same arithmetic with the weights already summing to 1: P(B) = Σ P(Aᵢ)P(B | Aᵢ) is a weighted average of the conditionals, which is why the answer must always land between the smallest and largest of them.',
  },
  {
    from: { topic: 'ism3', part: 'table' },
    to: { topic: 'ism2', part: 'practice' },
    kind: 'builds-on',
    carries: 'a two-way table of counts',
    detail:
      'One of the Lecture 2 practice problems laid a survey out as a grid and asked for probabilities off it. This page uses the same shape of table for the harder question: a conditional probability is a cell divided by its row or column total, so the grand total cancels and never appears in the answer.',
  },
  {
    from: { topic: 'ism3', part: 'spam' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'builds-on',
    carries: 'a feature as a measurable clue',
    detail:
      'The ML lecture defined a feature as a single measurable property of an example, and the thing a model actually reads. Example 6 gives two of them for the same email — the word "offer" and a suspicious link — and asks for the probability of both, which is the calculation a naive Bayes filter performs once per feature and multiplies together.',
  },
  {
    from: { topic: 'ism3', part: 'spam' },
    to: { topic: 'mllec1', part: 'spam' },
    kind: 'same-idea',
    carries: 'the spam filter as a worked task',
    detail:
      'The ML lecture used spam classification to pin down the task, the performance measure and the experience a learner gets. This is the same problem from underneath: the probabilities the filter would need, and the independence assumption that lets two features be combined by multiplying instead of by estimating their joint distribution.',
  },
  {
    from: { topic: 'ism3', part: 'bayes' },
    to: { topic: 'mllec1', part: 'whatisml' },
    kind: 'used-by',
    carries: 'P(h | D) ∝ P(D | h)·P(h)',
    detail:
      'The ML lecture defined learning as supplying data and answers and getting a program back. Bayesian learning is one concrete way of doing that, and this page is its engine: the MAP hypothesis is argmax P(h | D), which Bayes rewrites as likelihood times prior — so the syllabus line about MAP and naive Bayes is this theorem with an argmax on the front.',
  },
  /* ------------------------- ISM Lecture 4: Bayes and Naive Bayes --------- */
  {
    from: { topic: 'ism4', part: 'statement' },
    to: { topic: 'ism3', part: 'bayes' },
    kind: 'builds-on',
    carries: 'P(A | B) = P(B | A)·P(A) / P(B)',
    detail:
      'Lecture 3 introduced Bayes on two events and demonstrated it on the binary channel, with the prior and the posterior drawn side by side. This page states the general version with n slices instead of two and adds the conditions the two-event case could leave implicit — P(Eᵢ) > 0, P(A) > 0, and A ⊆ ⋃ Eᵢ — which are exactly the lines an exam asks you to justify.',
  },
  {
    from: { topic: 'ism4', part: 'statement' },
    to: { topic: 'ism3', part: 'partition' },
    kind: 'builds-on',
    carries: 'the partition E₁ … Eₙ',
    detail:
      'The slices lab in Lecture 3 established what a partition is by letting you drag the cuts while B stayed put. This page reuses that picture with A in place of B and adds the answer underneath: the same cuts now produce a row of posteriors, and moving A without changing its size changes them completely while leaving P(A) almost alone.',
  },
  {
    from: { topic: 'ism4', part: 'proof' },
    to: { topic: 'ism3', part: 'totalproof' },
    kind: 'builds-on',
    carries: 'B = B ∩ S, then distribute',
    detail:
      'The six-line proof of total probability in Lecture 3 is the first half of the nine-line proof here, with S replaced by ⋃ Eᵢ because A is only assumed to sit inside the slices rather than inside the whole sample space. The second half is new: the definition of a conditional probability is written as line (4) and the earlier result is substituted into it.',
  },
  {
    from: { topic: 'ism4', part: 'proof' },
    to: { topic: 'ism2', part: 'axioms' },
    kind: 'builds-on',
    carries: 'the third axiom: disjoint events add',
    detail:
      'The axioms lab in Lecture 2 rejected four candidate assignments for breaking one rule or another, the third being that events which cannot both happen simply add. Line 5 of this proof is that axiom and nothing else, which is why the line before it exists at all — proving (A ∩ Eᵢ) ∩ (A ∩ Eⱼ) = ∅ is what earns the right to use it.',
  },
  {
    from: { topic: 'ism4', part: 'managers' },
    to: { topic: 'ism3', part: 'multiply' },
    kind: 'builds-on',
    carries: 'P(A ∩ Eᵢ) = P(Eᵢ)·P(A | Eᵢ)',
    detail:
      'The multiplication rule was derived in Lecture 3 by clearing the division out of the definition, and walked down a tree one branch at a time. Every row of the managers table is one branch of that tree: 4/9 × 3/10 is the chance of taking the X route and then getting the bonus, and part (i) of the question is nothing but the three branches added up.',
  },
  {
    from: { topic: 'ism4', part: 'rash' },
    to: { topic: 'ism2', part: 'complement' },
    kind: 'builds-on',
    carries: 'P(M) = 1 − P(F)',
    detail:
      'The complement rule from Lecture 2 is what supplies the second prior here: the deck gives 90% for flu and says there is no other disease, so measles is the remaining 10% rather than a number you were told. The same move appears again in the spam example, where P(A | Bᶜ) has to be read as the false-positive rate rather than one minus the detection rate.',
  },
  {
    from: { topic: 'ism4', part: 'spamtrap' },
    to: { topic: 'mllec2', part: 'imbalance' },
    kind: 'used-by',
    carries: 'the base rate, as class imbalance',
    detail:
      'This page computes P(not spam | flagged) = 5/104 and then watches it pass one in two as the base rate falls, with the filter untouched. The ML preprocessing lecture meets the same effect from the other side — ninety-five to five, and a lazy classifier that scores 95% — so under-sampling, over-sampling and class weights are all attempts to move the prior that appears in this numerator.',
  },
  {
    from: { topic: 'ism4', part: 'hypothesis' },
    to: { topic: 'mllec1', part: 'whatisml' },
    kind: 'used-by',
    carries: 'prior, likelihood, evidence, posterior',
    detail:
      'The ML lecture defined learning as swapping two boxes: supply the data and the answers, and a program comes out. This page names the four pieces that particular program is assembled from, and the slide says so itself — this logic forms the core of the Naive Bayes classifier, used for spam filtering, sentiment analysis, document categorisation and medical diagnosis.',
  },
  {
    from: { topic: 'ism4', part: 'offer' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'builds-on',
    carries: 'a feature as a measurable clue',
    detail:
      'The ML lecture had you tap columns to sort features from the target. Here the single feature is the presence of the word “offer” and the target is the spam label, and the two given likelihoods — 0.8 in spam against 0.1 in good mail — are what a feature is worth: their ratio of 8 is the entire strength of the evidence, and equal likelihoods would make the feature useless however common the word.',
  },
  {
    from: { topic: 'ism4', part: 'maphyp' },
    to: { topic: 'dl3', part: 'whysq' },
    kind: 'used-by',
    carries: 'arg max P(D | h)·P(h)',
    detail:
      'Deep Learning Lecture 3 gave four reasons for squaring the error and asked which survive when you swap in absolute error. Maximum likelihood is the reason it does not print: squared error is the negative log likelihood under Gaussian noise, so fitting by least squares is h_ML, and adding λ‖w‖² to it is h_MAP under a Gaussian prior on the weights.',
  },
  {
    from: { topic: 'ism4', part: 'weather' },
    to: { topic: 'mllec2', part: 'attrtypes' },
    kind: 'builds-on',
    carries: 'a nominal attribute',
    detail:
      'The ML preprocessing lecture sorted attributes into nominal, ordinal, interval and ratio by ticking the operations each allows. Outlook is nominal — Overcast is not between Sunny and Rainy and no arithmetic on it means anything — and that is exactly why a frequency table works here: the method never does arithmetic on a value, it only ever looks the value up.',
  },
  {
    from: { topic: 'ism4', part: 'classifier' },
    to: { topic: 'mllec1', part: 'classification' },
    kind: 'builds-on',
    carries: 'the classification task',
    detail:
      'The ML lecture set up classification by dragging a threshold on tumour size and watching patients fall the wrong side of it. This page gives the same task a probabilistic engine: score every class with P(X | C)·P(C), divide by the shared total, and take the biggest — and it shows that the division changes the numbers without ever moving the threshold’s verdict.',
  },
  {
    from: { topic: 'ism4', part: 'condindep' },
    to: { topic: 'ism3', part: 'independent' },
    kind: 'builds-on',
    carries: 'P(A ∩ B) = P(A)·P(B)',
    detail:
      'Lecture 3 proved that P(A | B) = P(A) and the product form are the same statement. Conditional independence is that definition with everything conditioned on a third event: P(X | Y, Z) = P(X | Z). The thunder example shows why the extra Z matters — thunder and rain are plainly dependent, and become independent the moment lightning is known.',
  },
  {
    from: { topic: 'ism4', part: 'condindep' },
    to: { topic: 'mllec2', part: 'challenges' },
    kind: 'builds-on',
    carries: '2ⁿ − 1 parameters per class',
    detail:
      'The ML lecture listed five ways a project fails, one of them being too little data for the model you want. This page puts a number on it: n binary features need 2ⁿ − 1 probabilities per class if you refuse to assume anything, and at n = 20 that is over a million cells with almost nothing in them. The naive assumption is what brings it down to 20.',
  },
  {
    from: { topic: 'ism4', part: 'dearfriend' },
    to: { topic: 'ism3', part: 'spam' },
    kind: 'builds-on',
    carries: 'two clues in one email, multiplied',
    detail:
      'Lecture 3 called its spam example the one worked problem that is already machine learning: two features, and their joint probability taken as a product because they were assumed independent. This page is that example finished — the same product, but with the probabilities counted off a training table rather than given, and with the assumption now named as the thing that makes the method naive.',
  },
  {
    from: { topic: 'ism4', part: 'laplace' },
    to: { topic: 'mllec2', part: 'quality' },
    kind: 'builds-on',
    carries: 'a count of zero in a training table',
    detail:
      'The ML lecture broke the loan dataset one way at a time to show what data quality means. Here is a subtler break: the table is complete and correct, and one cell still reads 0/7 simply because a word never happened to appear with a class. That zero destroys a whole class of the classifier, and adding 1 to every count is the deck’s repair.',
  },
  {
    from: { topic: 'ism4', part: 'textclass' },
    to: { topic: 'mllec2', part: 'encoding' },
    kind: 'builds-on',
    carries: 'turning text into columns of numbers',
    detail:
      'One-hot encoding in the ML lecture turned a car’s fuel type into columns a model could read. Bag of words is the same move on a sentence: one column per vocabulary word, holding a count. It is why the vocabulary size V shows up in every smoothed denominator here — the encoding decided how many columns there are, and smoothing has to pay for all of them.',
  },
  {
    from: { topic: 'ism4', part: 'sentiment' },
    to: { topic: 'mllec1', part: 'spam' },
    kind: 'same-idea',
    carries: 'a learned filter instead of a rule list',
    detail:
      'The ML lecture set hand-written rules against a learned filter and let you watch the rule list rot as spammers adapted. This page is what the learned side actually contains: a table of word counts and one multiplication per word, retrained by incrementing counters. Nothing in it was written by hand, which is why it does not rot in the same way.',
  },
  {
    from: { topic: 'ism4', part: 'species' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'contrast',
    carries: 'a summary table against the rows it came from',
    detail:
      'Lecture 1 built every statistic straight from the dots so a summary could always be traced back. This page is what happens when that link is broken: slide 40 prints a Height row for S1 that the eight specimens do not support, and slide 41 then computes with the printed value. Recounting from the raw rows is the only thing that catches it, and the lab does exactly that.',
  },
  {
    from: { topic: 'ism4', part: 'practice' },
    to: { topic: 'ism3', part: 'totalexamples' },
    kind: 'builds-on',
    carries: 'one calculator, several sets of numbers',
    detail:
      'Lecture 3’s practice page ran petrol stations, ad clicks, poisonous plants and a mining job through a single total-probability calculator. These seven sheets are that shape with the arrow reversed: the same slices-priors-likelihoods table, plus one division at the end. Six of the seven fall out of it, and the seventh has a question and a printed solution that contradict each other.',
  },
  {
    from: { topic: 'ism4', part: 'nbrule' },
    to: { topic: 'mllec1', part: 'instancemodel' },
    kind: 'builds-on',
    carries: 'model-based learning, in its smallest form',
    detail:
      'The ML lecture set instance-based learning — remember every example — against model-based learning, which boils them down to a rule. Naive Bayes is about as model-based as it gets: after training it keeps one prior per class and one number per feature, and the training examples are thrown away, which is why the whole classifier is a couple of small tables.',
  },
  {
    from: { topic: 'ism4', part: 'tennis' },
    to: { topic: 'ism2', part: 'counting' },
    kind: 'builds-on',
    carries: 'the multiplication principle, 3 × 3 × 2 × 2',
    detail:
      'Lecture 2 counted outcomes when there were too many to list. That principle is what makes this example hard: four attributes with 3, 3, 2 and 2 values give 36 possible weather descriptions from only 14 rows of data, so the row you want has never been observed. Counting the combinations is how you see that direct counting cannot answer the question.',
  },
  {
    from: { topic: 'ism4', part: 'applications' },
    to: { topic: 'mllec1', part: 'tradeoff' },
    kind: 'builds-on',
    carries: 'where this method sits among the others',
    detail:
      'The ML lecture put accuracy against interpretability on a chart it admitted was opinionated. This deck places Naive Bayes on it explicitly — along with decision trees and neural networks, one of the most practical learning methods — and then prints the bill: it needs many probabilities estimated up front, and its independence assumption costs calibration rather than ranking.',
  },
  /* ------------------------- ML Lecture 2: data and preprocessing ---------- */
  {
    from: { topic: 'mllec2', part: 'nutshell' },
    to: { topic: 'mllec1', part: 'workflow' },
    kind: 'builds-on',
    carries: 'step 6 — preprocess, clean, visualise',
    detail:
      'Lecture 1 laid out an eight-step workflow in which exactly one step chose a model, and step 6 was the one word “preprocess”. This whole chapter is that single step opened up over sixty slides, which is also why its five-step loop puts four of its five stages before the algorithm.',
  },
  {
    from: { topic: 'mllec2', part: 'data' },
    to: { topic: 'dl3', part: 'design' },
    kind: 'same-idea',
    carries: 'the m × n design matrix',
    detail:
      'Deep Neural Networks builds every formula on X with m rows and n columns, one row per example and one column per feature. That is exactly this deck’s “objects are rows, attributes are columns”, so the eleven synonyms here — record, point, case, sample, instance; variable, field, dimension, feature — are all names for the two axes of that matrix.',
  },
  {
    from: { topic: 'mllec2', part: 'data' },
    to: { topic: 'mllec1', part: 'features' },
    kind: 'builds-on',
    carries: 'features against the target column',
    detail:
      'Lecture 1 split a table into the input columns and the one column you would not know for a new case. This page names the same two axes formally — object and attribute — and adds the six-and-five list of synonyms, so that a textbook saying “instance” and a library saying “sample” can be recognised as the same thing.',
  },
  {
    from: { topic: 'mllec2', part: 'attrtypes' },
    to: { topic: 'ism1', part: 'levels' },
    kind: 'same-idea',
    carries: 'nominal, ordinal, interval, ratio',
    detail:
      'The statistics course teaches the identical four levels in its own first lecture, under the name levels of measurement, and settles them with three questions. This deck settles them with four properties — distinctness, order, meaningful differences, meaningful ratios — and adds the table of which statistics each level permits, which is the part an ML pipeline actually acts on.',
  },
  {
    from: { topic: 'mllec2', part: 'attrtypes' },
    to: { topic: 'ism1', part: 'types' },
    kind: 'builds-on',
    carries: 'categorical against numerical',
    detail:
      'Statistics Lecture 1 asks the first question about any column: is it a category or a number? That split is exactly the categorical/qualitative and numeric/quantitative grouping down the left of this deck’s table, with nominal and ordinal on one side and interval and ratio on the other.',
  },
  {
    from: { topic: 'mllec2', part: 'attrtypes' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'builds-on',
    carries: 'when the mean is legal',
    detail:
      'The statistics course showed the mean as the balance point of the data, which needs the gaps between values to be real distances. That is precisely why this deck’s table lists the mean and standard deviation only from interval upwards, and gives nominal columns the mode and the χ² test instead.',
  },
  {
    from: { topic: 'mllec2', part: 'shape' },
    to: { topic: 'lec2', part: 'dimension' },
    kind: 'builds-on',
    carries: 'dimension as the number of coordinates',
    detail:
      'Mathematical Foundations defines the dimension of a space as the size of a basis — how many numbers it takes to name a point. Dimensionality here is the same count viewed as data: n attributes means every object is a point in an n-dimensional space, which is why adding columns empties the space out without removing a single row.',
  },
  {
    from: { topic: 'mllec2', part: 'shape' },
    to: { topic: 'lec3', part: 'highdim' },
    kind: 'builds-on',
    carries: 'what happens to distance as dimension grows',
    detail:
      'The analytic geometry lecture showed that in high dimensions the angles and distances between random vectors stop distinguishing anything. This page counts the same effect in rows per cell, and it is the reason k-nearest neighbours degrades as columns are added — the nearest neighbour stops being meaningfully nearer than the tenth.',
  },
  {
    from: { topic: 'mllec2', part: 'datatypes' },
    to: { topic: 'mllec1', part: 'course' },
    kind: 'builds-on',
    carries: 'structured IID data only',
    detail:
      'Lecture 1 narrowed the course to structured data on IID rows and put unstructured data and time series explicitly out of scope. Six of the seven kinds listed here are exactly what that scope excludes or must be converted first — which is why the deck names them and then works only with the relational table.',
  },
  {
    from: { topic: 'mllec2', part: 'noise' },
    to: { topic: 'dl3', part: 'whysq' },
    kind: 'used-by',
    carries: 'the error a model cannot remove',
    detail:
      'Squared error punishes a residual in proportion to its square, and noise is the part of that residual no model can predict because it was not caused by the inputs. It sets a floor on the loss, so a network driven to zero training error on noisy data has memorised the noise rather than solved the task.',
  },
  {
    from: { topic: 'mllec2', part: 'outliers' },
    to: { topic: 'outliers' },
    kind: 'same-idea',
    carries: 'the definition of an outlier',
    detail:
      'The statistics concept page defines an outlier through the box plot and its 1.5 × IQR whiskers. This page adds the ML question the statistics course does not ask: whether the odd row is noise to be removed or the entire deliverable, as it is in credit card fraud and intrusion detection.',
  },
  {
    from: { topic: 'mllec2', part: 'outliers' },
    to: { topic: 'ism1', part: 'median' },
    kind: 'builds-on',
    carries: 'why the median barely moves',
    detail:
      'Dragging one value to the far end of the number line moved the mean and left the median alone. That is the same robustness this page relies on when it says a Case 1 outlier can be neutralised by changing the loss rather than deleting the row — the median is what absolute-error minimisation predicts, and the mean is what squared error predicts.',
  },
  {
    from: { topic: 'mllec2', part: 'iqr' },
    to: { topic: 'ism1', part: 'boxplot' },
    kind: 'same-idea',
    carries: 'the 1.5 × IQR fences',
    detail:
      'The statistics lecture draws a box from Q1 to Q3, whiskers out to the last point inside Q1 − 1.5·IQR and Q3 + 1.5·IQR, and separate dots beyond. This deck states the same rule as an outlier test and works it on twelve numbers, so the dots on that box plot and the flagged 22 here are one rule seen twice.',
  },
  {
    from: { topic: 'mllec2', part: 'iqr' },
    to: { topic: 'ism1', part: 'fivepoint' },
    kind: 'builds-on',
    carries: 'Q1, Q2 and Q3',
    detail:
      'The five-number summary is where the quartiles were defined and where the median-of-each-half construction was shown. This page needs exactly that construction: it is what gives Q1 = 11 and Q3 = 14.5 on the lecture’s data, and it is why the deck’s printed answer differs from the (n+1)/4 formula in the box beside it.',
  },
  {
    from: { topic: 'mllec2', part: 'sigma' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'σ, the standard deviation',
    detail:
      'The statistics course built σ as the typical distance of a value from the mean, and showed that squaring the deviations is what makes one far-away point count so heavily. That is exactly the weakness this page turns on the three-sigma rule: the outlier being hunted inflates σ, widens the fences it is measured against, and can conceal itself.',
  },
  {
    from: { topic: 'mllec2', part: 'sigma' },
    to: { topic: 'ism1', part: 'shape' },
    kind: 'builds-on',
    carries: 'skew, and where the mean ends up',
    detail:
      'Statistics Lecture 1 showed the mean pulled towards the long tail while the median stays put. That is why the three-sigma rule fails on a skewed column such as income: the inflated σ pushes the lower fence below zero, where it can never fire, and the upper fence far past where the data actually thins out.',
  },
  {
    from: { topic: 'mllec2', part: 'sampling' },
    to: { topic: 'dl3', part: 'traintest' },
    kind: 'used-by',
    carries: 'the held-back test set',
    detail:
      'Deep Neural Networks splits the data and reports its score on the held-out half. This page supplies the condition under which that score means anything — the split has to be representative — and shows the iris counts, 38/28/34 against 12/22/16, where a perfectly honest random draw quietly breaks it.',
  },
  {
    from: { topic: 'mllec2', part: 'sampling' },
    to: { topic: 'ism1', part: 'sample' },
    kind: 'builds-on',
    carries: 'a sample standing in for a population',
    detail:
      'The statistics course introduced the sample as a stand-in for the whole population and the reason its variance is divided by n − 1. This deck gives the ML version of the same requirement: a sample is representative if it has approximately the same properties of interest as the original set of data — and a larger sample cures noise but never bias.',
  },
  {
    from: { topic: 'mllec2', part: 'imbalance' },
    to: { topic: 'dl3', part: 'metrics' },
    kind: 'used-by',
    carries: 'why accuracy alone is not a score',
    detail:
      'The metrics page scores a model with a single number. This page shows the case where that number lies: at 950 ordinary rows against 50 rare ones, a model that never predicts the rare class scores 95% having learnt nothing, which is why an imbalanced problem is reported with precision and recall for the rare class instead.',
  },
  {
    from: { topic: 'mllec2', part: 'scaling' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'μ and σ, reused as units',
    detail:
      'Standardization is (v − μ)/σ, the mean and standard deviation the statistics course built. Here they stop being a summary and become a unit of measurement: after the transformation every column is expressed in its own standard deviations, which is what makes columns in rupees and columns in years comparable at all.',
  },
  {
    from: { topic: 'mllec2', part: 'scaling' },
    to: { topic: 'gradient' },
    kind: 'used-by',
    carries: 'the step size η against the shape of the bowl',
    detail:
      'Gradient descent takes one step size for every direction. Columns on wildly different scales stretch the bowl into a long narrow valley, so a single η is far too large along one axis and far too small along another and the path zig-zags — which is why scaling is a prerequisite for the optimiser rather than a tidying-up step.',
  },
  {
    from: { topic: 'mllec2', part: 'scaling' },
    to: { topic: 'lec3', part: 'norms' },
    kind: 'builds-on',
    carries: '‖x‖, and what it assumes about units',
    detail:
      'The Euclidean norm adds squared components across every coordinate, which silently assumes the coordinates are in comparable units. Feature scaling is what makes that assumption true — and it is why an unscaled column with a large range dominates every distance in k-NN, k-means and any RBF kernel.',
  },
  {
    from: { topic: 'mllec2', part: 'featureeng' },
    to: { topic: 'covariance' },
    kind: 'used-by',
    carries: 'the covariance matrix PCA decomposes',
    detail:
      'The deck names Principal Components Analysis as its cure for the curse of dimensionality and stops there. What PCA actually decomposes is the covariance matrix built on that page — which is also why the data has to be centred first, and why two columns that move together can be replaced by one without losing much.',
  },
  {
    from: { topic: 'mllec2', part: 'featureeng' },
    to: { topic: 'rank' },
    kind: 'builds-on',
    carries: 'redundant columns, and what they cost',
    detail:
      'Rank counts how many columns really say something different. A redundant feature — height in centimetres beside height in inches — drops the rank without dropping a column, which is the same collinearity that makes fitted coefficients unstable and is exactly what feature selection is removing.',
  },
  {
    from: { topic: 'mllec2', part: 'encoding' },
    to: { topic: 'dl2', part: 'encodings' },
    kind: 'same-idea',
    carries: 'turning categories into numbers a network can take',
    detail:
      'The perceptron session had to encode its inputs before any weight could multiply them. This page gives the general rule that session assumed: one-hot for a nominal attribute, because label encoding would assert an order, and label encoding only where the order is real.',
  },
  {
    from: { topic: 'mllec2', part: 'binning' },
    to: { topic: 'ism1', part: 'range' },
    kind: 'builds-on',
    carries: 'B − A, the range',
    detail:
      'The statistics course introduced the range as the crudest measure of spread and showed that one extreme value is enough to define it. Equal-width binning divides that same range into N parts, W = (B − A)/N, and inherits the weakness whole: one salary of nine lakh puts thirty of thirty-one rows in the first bin.',
  },
  {
    from: { topic: 'mllec2', part: 'induction' },
    to: { topic: 'mllec1', part: 'types' },
    kind: 'builds-on',
    carries: 'classification, regression, probability estimation',
    detail:
      'Lecture 1 separated the supervised tasks by what the target column holds. This deck shows the same three on one dataset with only the last column changing — Yes/No, a humidity between 20 and 100, and a probability in [0,1] — so the distinction is visibly about the target and not about the method.',
  },
  {
    from: { topic: 'mllec2', part: 'induction' },
    to: { topic: 'mllec1', part: 'classification' },
    kind: 'builds-on',
    carries: 'generalisation to unseen rows',
    detail:
      'The tumour example judged a threshold by how it treated patients it had not seen. The inductive learning hypothesis is the assumption that made that judgement worth making, stated for the first time: a hypothesis that fits a large enough training set will fit unobserved examples too.',
  },
  {
    from: { topic: 'mllec2', part: 'challenges' },
    to: { topic: 'mllec1', part: 'tradeoff' },
    kind: 'builds-on',
    carries: 'the accuracy against interpretability chart',
    detail:
      'Lecture 1 plotted models along a diagonal from explainable to accurate, and warned the chart was opinionated. Hypothesis space is what the axis is really measuring: a bigger space can express more and can be explained less, which is why max_depth, hidden units and polynomial degree are all the same knob.',
  },
  {
    from: { topic: 'mllec2', part: 'preprocess' },
    to: { topic: 'mllec1', part: 'workflow' },
    kind: 'builds-on',
    carries: 'representation of input features and output',
    detail:
      'The workflow’s sixth step named preprocessing, cleaning, visualising and the train/test split in a single line. The raw → prepared → engineered chain on this page is that line drawn as a picture, with the two halves given the names data engineering and feature engineering.',
  },
  {
    from: { topic: 'mllec2', part: 'quality' },
    to: { topic: 'dl3', part: 'metrics' },
    kind: 'used-by',
    carries: 'the ceiling that labels put on a score',
    detail:
      'Every metric on that page compares a prediction with a recorded answer. If the recorded answers are wrong for five per cent of rows then a perfect model still disagrees with five per cent of the test set, so no amount of tuning moves the ceiling — which is why a disappointing score should send you to the data before the hyper-parameters.',
  },

  {
    from: { topic: 'mllec2', part: 'zero' },
    to: { topic: 'attrtypes' },
    kind: 'same-idea',
    carries: 'the true zero that separates ratio from interval',
    detail:
      'The concept page states the ladder and its four permitted transformations. This part is the one question that decides the top rung, worked rather than asserted: 10 °C is 283.15 K and 5 °C is 278.15 K, a ratio of 1.018, so the zero of the Celsius scale was doing no work at all.',
  },
  {
    from: { topic: 'mllec2', part: 'casestudy' },
    to: { topic: 'attrtypes' },
    kind: 'used-by',
    carries: 'the ladder, applied one column at a time',
    detail:
      'Nine columns of a bank’s customer table, each needing a level. The concept page supplies the four questions; this page shows what happens when one column — Credit Score — cannot be settled by them, because nothing printed says whether a score of zero means no creditworthiness.',
  },
  {
    from: { topic: 'mllec2', part: 'missing' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'the spread that mean-imputation quietly shrinks',
    detail:
      'The statistics course built the variance from squared distances to the mean. Filling every gap with that mean leaves the mean untouched and puts the filled rows at distance zero, so the variance falls — and every standard error and confidence interval computed from it then claims more certainty than the data supports.',
  },
  {
    from: { topic: 'mllec2', part: 'duplicates' },
    to: { topic: 'dl3', part: 'traintest' },
    kind: 'used-by',
    carries: 'what a held-out score is actually measuring',
    detail:
      'The test set only measures generalisation if the model has not already seen those rows. A duplicate that lands on both sides of the split turns part of that score into recall of a memorised row, which is why deduplication has to happen before the split and not on each side afterwards.',
  },
  {
    from: { topic: 'mllec2', part: 'aggregation' },
    to: { topic: 'ism1', part: 'mean' },
    kind: 'builds-on',
    carries: 'the mean as the balance point of a group',
    detail:
      'Split-apply-combine applies exactly the average the statistics course built, once per group: white 12 and 8 give 10, red 20 and 14 give 17, black 6 and 10 give 8. Averaging is also what damps the variation, which is the deck’s claim that aggregated data tends to be more stable.',
  },
  /* --------------------- the concepts ML Lecture 2 introduces --------------- */
  {
    from: { topic: 'attrtypes' },
    to: { topic: 'ism1', part: 'levels' },
    kind: 'same-idea',
    carries: 'the same four levels, taught twice',
    detail:
      'The statistics course reaches the ladder through three questions about a column; the ML course reaches it through four operations the values must support. The rungs are identical, and this page keeps both routes so that either lecture’s wording is recognisable from the other.',
  },
  {
    from: { topic: 'attrtypes' },
    to: { topic: 'encoding' },
    kind: 'used-by',
    carries: 'nominal or ordinal, and therefore which encoder',
    detail:
      'The level is not an academic label — it is the input to a decision about code. A nominal column must be one-hot encoded because label encoding would assert an order; an ordinal one may be label encoded with integers chosen to preserve the order it really has.',
  },
  {
    from: { topic: 'scaling' },
    to: { topic: 'gradient' },
    kind: 'used-by',
    carries: 'the shape of the loss surface',
    detail:
      'Gradient descent uses one step size η in every direction, so it depends on the bowl being roughly round. Unscaled columns stretch it into a valley thousands of times steeper along one axis, and the fix is this transformation rather than a smaller η — which would simply make the shallow direction take forever.',
  },
  {
    from: { topic: 'scaling' },
    to: { topic: 'spread' },
    kind: 'builds-on',
    carries: 'σ as a unit rather than a summary',
    detail:
      'The statistics concept built the standard deviation to describe how far apart the numbers are. Standardization divides by it, so σ stops being a description and becomes the unit the column is measured in — which is exactly what makes the three-sigma rule collapse to the flat test |v′| > 3 afterwards.',
  },
  {
    from: { topic: 'encoding' },
    to: { topic: 'dl2', part: 'encodings' },
    kind: 'used-by',
    carries: 'the columns a network multiplies its weights by',
    detail:
      'A perceptron multiplies each input by a weight, so every categorical column must already be numeric by the time it arrives. This page decides how: one column per category for a nominal attribute, one integer column for an ordinal one — and the difference is whether the network is allowed to interpolate between categories.',
  },
  {
    from: { topic: 'hypothesis' },
    to: { topic: 'mllec1', part: 'tradeoff' },
    kind: 'used-by',
    carries: 'capacity, as the axis that chart is really about',
    detail:
      'Lecture 1 plotted models from explainable to accurate and called the chart opinionated. The size of the hypothesis space is what the axis measures: a larger space expresses more relationships and admits more explanations that no one can state, which is the trade-off drawn rather than asserted.',
  },
  {
    from: { topic: 'hypothesis' },
    to: { topic: 'lossfn' },
    kind: 'contrast',
    carries: 'what a learner searches against what it minimises',
    detail:
      'The objective function decides which hypothesis in the space is preferred; the hypothesis space decides which ones are available to prefer. Confusing them is expensive: a perfect loss cannot rescue a space that never contained a good rule, which is underfitting, and a huge space makes the loss’s minimum depend on the sample, which is overfitting.',
  },
  /* ---------------------------------------- Lecture 4: eigenvalues & eigenvectors */
  {
    from: { topic: 'lec4', part: 'why' },
    to: { topic: 'lec0a', part: 'posdef' },
    kind: 'builds-on',
    carries: 'xᵀAx > 0 for every non-zero x',
    detail:
      'Lecture 0a defined positive definite as a promise about every possible x, and gave the leading-minor test for checking it. This lecture turns that promise into two entry requirements: it is what makes every eigenvalue positive in part 11, and it is what keeps the quantity under each Cholesky square root positive in part 19 — which is why a failed Cholesky is the standard test for the property.',
  },
  {
    from: { topic: 'lec4', part: 'cofactor' },
    to: { topic: 'lec0a', part: 'bigdet' },
    kind: 'same-idea',
    carries: 'expansion along a row, with (−1)ʲ⁺ᵏ',
    detail:
      'Lecture 0a taught the cofactor expansion as a method: pick the row with the most zeros and grind. This page is the same formula stated in symbols, as slide 4 does, so that the recursion — an n × n determinant defined by (n − 1) × (n − 1) ones — is visible rather than implied. If you can already do the arithmetic, read this page for the structure and skip the sums.',
  },
  {
    from: { topic: 'lec4', part: 'detproof' },
    to: { topic: 'lec0a', part: 'detrules' },
    kind: 'builds-on',
    carries: 'the six rules, now with proofs',
    detail:
      'Lecture 0a listed six things determinants do under row operations and let you check each by pressing a button. Two of those six are proved here from scratch — the sign flip on a swap, by induction, and the no-change on adding a multiple of a row — and both proofs turn on the fact that a matrix with two equal rows has determinant zero. If you memorised the rules, this is where they come from.',
  },
  {
    from: { topic: 'lec4', part: 'rankdet' },
    to: { topic: 'rank' },
    kind: 'builds-on',
    carries: 'rank = the number of pivots',
    detail:
      'The rank page counts how many rows of a matrix really say something, by eliminating and counting the pivots that survive. This page proves that for a square matrix that count is full exactly when the determinant is not zero — so the two tests you have been treating as separate are one test, and the bridge between them is det(A) = (−1)ˢ det(U).',
  },
  {
    from: { topic: 'lec4', part: 'rankdet' },
    to: { topic: 'lec1', part: 'lab' },
    kind: 'builds-on',
    carries: 'the elimination that produces U',
    detail:
      'Lecture 1 taught Gaussian elimination as a way to solve a system, one legal move at a time. Here the same elimination is used for a different purpose: run it, count how many row interchanges you needed, and the determinant of the original matrix is (−1) to that power times the diagonal of what you are left with. The count of swaps is the only part of the run that has to be remembered.',
  },
  {
    from: { topic: 'lec4', part: 'trace' },
    to: { topic: 'matmul' },
    kind: 'builds-on',
    carries: 'the shapes of AB against BA',
    detail:
      'The multiplication page is where you learnt that AB and BA are usually different matrices and often have different shapes — an n × k times a k × n gives n × n one way round and k × k the other. That is exactly the situation slide 11 puts tr(AB) = tr(BA) into, and the surprise only lands if you already know how far apart those two products are.',
  },
  {
    from: { topic: 'lec4', part: 'charpoly' },
    to: { topic: 'determinant' },
    kind: 'builds-on',
    carries: 'det(A) as one number that can be zero',
    detail:
      'The determinant page treats det A as a fixed number saying whether a matrix can be undone. This page puts a letter on the diagonal and takes the determinant of A − λI, turning that fixed number into a polynomial in λ. Everything you know about when a determinant is zero now becomes a statement about which λ are eigenvalues.',
  },
  {
    from: { topic: 'lec4', part: 'eigendef' },
    to: { topic: 'lec0b', part: 'dot' },
    kind: 'builds-on',
    carries: 'Ax as a stack of dot products',
    detail:
      'The dot product page showed that each entry of Ax is one row of A dotted with x, so a matrix acting on a vector is n dot products at once. Ax = λx is asking for the rare x where all n of those dot products conspire to give back a multiple of x itself — which is why it is a condition on the whole vector rather than something you can arrange entry by entry.',
  },
  {
    from: { topic: 'lec4', part: 'eigendef' },
    to: { topic: 'dl3', part: 'tips' },
    kind: 'used-by',
    carries: 'η < 2 / (largest eigenvalue)',
    detail:
      'The linear regression session gives a hard ceiling on the learning rate: descent converges only while η stays below 2 divided by the largest eigenvalue of XᵀX/N, and its lab watches training diverge the moment you cross it. That ceiling is an eigenvalue of a real matrix, computed from real data — this page is where the number in it comes from.',
  },
  {
    from: { topic: 'lec4', part: 'example' },
    to: { topic: 'lec0a', part: 'rref' },
    kind: 'builds-on',
    carries: 'row-reducing to read off the answers',
    detail:
      'Finding an eigenvector is not a new skill. Once λ is known, A − λI is an ordinary matrix and finding its nullspace is the row reduction Lecture 0a already taught — the deck’s own U on slide 16 is a row echelon form and nothing more. The only new part is knowing which matrix to reduce.',
  },
  {
    from: { topic: 'lec4', part: 'eigenspace' },
    to: { topic: 'vectorspace' },
    kind: 'builds-on',
    carries: 'closed under addition and scaling, and contains 0',
    detail:
      'The vector space page set out what a subset has to promise before it can be called a subspace, and made you break the candidates that fail. Eλ passes all three promises, which is why it is called an eigenspace — and it is also why the zero vector has to be thrown in, even though part 7 refused to call it an eigenvector.',
  },
  {
    from: { topic: 'lec4', part: 'eigenspace' },
    to: { topic: 'basis' },
    kind: 'builds-on',
    carries: 'dimension = how many vectors a basis needs',
    detail:
      'Span, basis and dimension gave you the machinery for measuring how big a subspace is. The dimension of Eλ has its own name here — the geometric multiplicity — and comparing it against how often λ is a root of the characteristic polynomial is what separates a matrix that can be diagonalised from one that cannot.',
  },
  {
    from: { topic: 'lec4', part: 'properties' },
    to: { topic: 'lec0a', part: 'transpose' },
    kind: 'builds-on',
    carries: 'det(M) = det(Mᵀ)',
    detail:
      'The transpose page gave the rule that tipping a matrix over leaves its determinant alone, alongside the (AB)ᵀ = BᵀAᵀ trap. The first of those is the whole proof that A and Aᵀ have the same eigenvalues: det(A − λI) = det((A − λI)ᵀ) = det(Aᵀ − λI), and the polynomials are therefore identical.',
  },
  {
    from: { topic: 'lec4', part: 'independence' },
    to: { topic: 'lec2', part: 'independence' },
    kind: 'builds-on',
    carries: 'no vector is a combination of the others',
    detail:
      'Lecture 2 defined linear independence and showed how elimination checks it. Slide 20 asks you to prove that eigenvectors of distinct eigenvalues are independent, and the proof is exactly the argument that page trains: assume one is a multiple of another and derive a contradiction — here, (λ − μ)cx = 0 with both factors non-zero.',
  },
  {
    from: { topic: 'lec4', part: 'independence' },
    to: { topic: 'designmat' },
    kind: 'used-by',
    carries: 'the m × n design matrix',
    detail:
      'The design matrix page builds X with one row per example and one column per feature, so that every prediction is one multiply, ŷ = Xw. Slide 20 is talking about exactly that X: it says AᵀA is n × n — features by features, whatever m is — and that it is positive definite precisely when no feature is a combination of the others.',
  },
  {
    from: { topic: 'lec4', part: 'independence' },
    to: { topic: 'regression' },
    kind: 'used-by',
    carries: '(AᵀA)⁻¹Aᵀy',
    detail:
      'Linear regression drags a line through a cloud of dots and reports the squared error. The closed-form answer for that fit is the least-squares solution slide 20 names, and it exists only while AᵀA can be inverted — so this page is the condition under which the regression page has a unique best line at all.',
  },
  {
    from: { topic: 'lec4', part: 'independence' },
    to: { topic: 'lec3', part: 'finalargument' },
    kind: 'contrast',
    carries: 'AᵀA against the QR route',
    detail:
      'Lecture 3 finished by proving that Gram–Schmidt gives A = QR, and warned that forming AᵀA squares the condition number and loses roughly twice as many digits. Slide 20 here is the reason AᵀA appears in the first place. Hold both: the theory says AᵀA is the right object, and the numerics say never to build it — which is why numpy.linalg.lstsq goes through QR.',
  },
  {
    from: { topic: 'lec4', part: 'spectral' },
    to: { topic: 'lec3', part: 'orthobasis' },
    kind: 'builds-on',
    carries: 'mutually orthogonal, each of length 1',
    detail:
      'Lecture 3 built an orthonormal basis by hand, out of any basis you happened to have, using Gram–Schmidt. The spectral theorem says a symmetric matrix hands you one for nothing: its own eigenvectors already are one. That is the entire reason symmetric matrices are worth arranging for, and why PCA components come out at right angles without anyone asking.',
  },
  {
    from: { topic: 'lec4', part: 'complex' },
    to: { topic: 'lec3', part: 'induced' },
    kind: 'builds-on',
    carries: '‖x‖² = ⟨x, x⟩',
    detail:
      'Lecture 3 derived length from the inner product: ‖x‖ = √⟨x, x⟩, so a vector’s size is how much it agrees with itself. Slide 23 shows that rule breaking on a complex vector — the deck’s own example gives 3 + 6i, which is not real and so is not a length — and the repair is to change the inner product to xᴴy rather than to abandon the rule.',
  },
  {
    from: { topic: 'lec4', part: 'realeigs' },
    to: { topic: 'lec3', part: 'orthogonality' },
    kind: 'builds-on',
    carries: '⟨x, y⟩ = 0 means at right angles',
    detail:
      'Lecture 3 defined orthogonality as the inner product being zero, and warned that it depends on which inner product you picked. Slide 26 produces exactly that condition — xᴴy = 0 — for eigenvectors of different eigenvalues of a symmetric matrix, under the standard inner product. No angle is ever computed; the zero is the whole statement.',
  },
  {
    from: { topic: 'lec4', part: 'decomp' },
    to: { topic: 'lec3', part: 'orthomatrix' },
    kind: 'builds-on',
    carries: 'QᵀQ = I, so Q⁻¹ = Qᵀ',
    detail:
      'Lecture 3 showed that a matrix with orthonormal columns preserves every length and every angle, and gets its inverse for free as its transpose. That free inverse is the only reason A = QΛQᵀ can end in a transpose rather than a Q⁻¹ — and it is what makes Aᵏ = QΛᵏQᵀ collapse so cleanly, because the inner QᵀQ vanishes at every join.',
  },
  {
    from: { topic: 'lec4', part: 'cholesky' },
    to: { topic: 'lec3', part: 'lu' },
    kind: 'same-idea',
    carries: 'A = LU against A = LLᵀ',
    detail:
      'Lecture 3 showed that Gaussian elimination is secretly a factorisation, A = LU, with L recording the multipliers used. Cholesky is the same idea with a stronger hypothesis and a better pay-off: when A is symmetric positive definite, U is forced to be Lᵀ, so one triangle carries everything and only half the work and half the memory are needed.',
  },
  {
    from: { topic: 'lec4', part: 'gaussian' },
    to: { topic: 'covariance' },
    kind: 'builds-on',
    carries: 'the covariance matrix Σ',
    detail:
      'The covariance page draws one rectangle per data point and adds them up, so Σ becomes something you have seen built rather than a symbol. Slide 31 uses that matrix in the opposite direction: instead of measuring Σ from data, it starts from the Σ you want and generates data that has it, by factoring Σ = LLᵀ and pushing independent noise through L.',
  },
  {
    from: { topic: 'lec4', part: 'gaussian' },
    to: { topic: 'ism1', part: 'variance' },
    kind: 'builds-on',
    carries: 'variance as the average squared distance',
    detail:
      'The statistics course built variance from one variable — square every distance from the mean and average them. A covariance matrix is that idea for several variables at once, with the variances on the diagonal and the leaning between pairs off it. This page needs the whole matrix, because it is the off-diagonal entries that make the sampled cloud tilt.',
  },
  {
    from: { topic: 'lec4', part: 'traceeigs' },
    to: { topic: 'lec0a', part: 'det' },
    kind: 'builds-on',
    carries: 'det as the area of the box the columns make',
    detail:
      'Lecture 0a drew ad − bc as an area you could flatten by dragging one arrow onto the other. This page says that area is the eigenvalues multiplied together — so a matrix scales area by the product of its stretches, and a single zero eigenvalue flattens the box exactly as dragging the arrows together did.',
  },
  {
    from: { topic: 'lec4', part: 'gaussian' },
    to: { topic: 'lec0b', part: 'expectation' },
    kind: 'contrast',
    carries: 'Σ as summation against Σ as a covariance matrix',
    detail:
      'Lecture 0b uses Σ constantly as the summation sign, in E[X] = Σ xᵢp(xᵢ). This page uses capital sigma for a covariance matrix instead, and both meanings appear within a few lines of each other. Tell them apart by what is attached: the summation sign carries a counter underneath it, and the matrix carries none.',
  },
]

/* ------------------------------------------------------------- lookups */

export function anchorKey(a: Anchor) {
  return a.part ? `${a.topic}/${a.part}` : a.topic
}

export interface ResolvedAnchor {
  href: string
  /** The page's own name. */
  title: string
  /** Where it sits: course, then chapter if it is part of one. */
  where: string
}

/**
 * Turn an anchor into something linkable. Returns null when the anchor points
 * at a page that does not exist, so a stale link renders as nothing rather than
 * as a 404 the reader has to discover.
 */
export function resolveAnchor(a: Anchor): ResolvedAnchor | null {
  const session = sessionById[a.topic]
  if (!session) return null
  const course = courseOfTopic(a.topic)
  if (!a.part) {
    return {
      href: `/session/${a.topic}`,
      title: session.label,
      where: course?.name ?? '',
    }
  }
  const parts = partsOf(a.topic)
  const at = parts.findIndex((p) => p.id === a.part)
  if (at === -1) return null
  return {
    href: `/session/${a.topic}/${a.part}`,
    title: parts[at].title,
    where: `${course ? `${course.name} · ` : ''}${session.label} · part ${at + 1}`,
  }
}

export interface ResolvedLink extends ResolvedAnchor {
  kind: LinkKind
  /** The heading this link sits under, already the right way round. */
  heading: string
  carries: string
  detail: string
}

function collect(here: Anchor, direction: 'out' | 'in'): ResolvedLink[] {
  const key = anchorKey(here)
  const out: ResolvedLink[] = []
  for (const c of CONNECTIONS) {
    const mine = direction === 'out' ? c.from : c.to
    const other = direction === 'out' ? c.to : c.from
    if (anchorKey(mine) !== key) continue
    const r = resolveAnchor(other)
    if (!r) continue
    out.push({
      ...r,
      kind: c.kind,
      heading: direction === 'out' ? LINK_KINDS[c.kind].forward : LINK_KINDS[c.kind].back,
      carries: c.carries,
      detail: c.detail,
    })
  }
  return out
}

/** What this page leans on. */
export function builtOn(topic: TopicId, part?: string) {
  return collect({ topic, part }, 'out')
}

/** Where this page's idea turns up again later. */
export function usedLater(topic: TopicId, part?: string) {
  return collect({ topic, part }, 'in')
}
