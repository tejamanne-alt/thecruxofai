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
