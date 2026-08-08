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
