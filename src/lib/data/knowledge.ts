import type { TopicId } from './curriculum'

export interface CheatCard {
  formula: string
  why: string
}

export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface ExamQuestion {
  q: string
  meta: string
  points: string[]
}

export interface TopicKnowledge {
  cheat: CheatCard[]
  quiz: QuizQuestion[]
  exam: ExamQuestion[]
}

/**
 * Written after each session, from what the faculty actually emphasised — not
 * scraped from a textbook. A topic with no session yet has no entry here, and
 * the empty states say so rather than filling the space.
 */
export const knowledge: Record<TopicId, TopicKnowledge> = {
  algebra: {
    cheat: [
      { formula: 'f(x) = a·x + b', why: 'The straight-line rule. a is the rate, b is the flat part.' },
      { formula: '(g ∘ f)(x) = g(f(x))', why: 'Composition: do f, feed the answer into g. Depth is this, repeated.' },
      {
        formula: 'a·x + b = 0 ⟹ x = −b/a',
        why: 'Solving is isolating the unknown by doing the same thing to both sides.',
      },
      {
        formula: 'g(z) = max(0, z)',
        why: 'ReLU. The cheapest useful bend, and the reason stacked layers do not collapse.',
      },
      {
        formula: 'σ(z) = 1/(1 + e⁻ᶻ)',
        why: 'Sigmoid. Squashes any number into 0…1, so a score can be read as a probability.',
      },
    ],
    quiz: [
      {
        q: 'You stack two straight-line rules: first z = a·x + b, then y = c·z + d. What is the result?',
        options: [
          'A curve, because two rules were applied',
          'Still a single straight-line rule, just with different numbers',
          'A step function',
          'It depends on the values of a and c',
        ],
        answer: 1,
        explain:
          'y = c(ax+b)+d = (ca)x + (cb+d) — one straight rule again. This is exactly why a neural network needs a non-linear activation between layers: without it, a hundred layers collapse into the equivalent of one.',
      },
      {
        q: 'In f(x) = a·x + b, what does b do to the graph?',
        options: [
          'Tilts the line',
          'Slides the whole line up or down without changing its tilt',
          'Stretches the line horizontally',
          'Nothing visible',
        ],
        answer: 1,
        explain:
          'b is the value when x = 0, so changing it shifts the line vertically. In a model this is the bias, and it is what lets a rule sit away from the origin — a matrix alone always maps 0 to 0.',
      },
      {
        q: 'Why does the notation f(x) not mean "f multiplied by x"?',
        options: [
          'It does mean that, in some contexts',
          'Because f names a machine, and the brackets hold what you feed it',
          'Because f is always a constant',
          'It is a historical mistake with no meaning',
        ],
        answer: 1,
        explain:
          'Function notation reuses brackets for something entirely different from multiplication. Reading f(x) as a product is one of the most common early stumbles, and it makes composition g(f(x)) impossible to parse.',
      },
      {
        q: 'A model is described as having "7 billion parameters". In the language of this page, what are those?',
        options: [
          'Seven billion training examples',
          'The values of a and b — the multipliers and the constants inside the rules',
          'Seven billion separate models',
          'The number of inputs it accepts',
        ],
        answer: 1,
        explain:
          'Parameters are exactly the coefficients and constants. Training searches for values of them that make the composed rule fit the data; the architecture decides how many there are and how they are wired.',
      },
    ],
    exam: [
      {
        q: 'Show that composing two affine functions yields an affine function, and explain the consequence for deep networks.',
        meta: 'Derivation · ~6 marks',
        points: [
          'Let f(x) = ax + b and g(z) = cz + d.',
          'Then g(f(x)) = c(ax + b) + d = (ca)x + (cb + d).',
          "This has the form a'x + b', so it is affine — the composition adds no expressive power.",
          'Consequence: without a non-linear activation between layers, a deep network is equivalent to a single layer.',
          'Name the usual fixes: ReLU, sigmoid, tanh; note ReLU is preferred for its cheap gradient.',
        ],
      },
      {
        q: 'Compare ReLU and sigmoid as activation functions. When would you choose each?',
        meta: 'Compare & contrast · ~6 marks',
        points: [
          'ReLU: max(0, z), gradient is 0 or 1, cheap, no saturation for positive inputs; risk of dead units.',
          'Sigmoid: 1/(1+e⁻ᶻ), output bounded in (0,1), interpretable as a probability.',
          'Sigmoid saturates at both tails, so gradients vanish — a serious problem in deep stacks.',
          'Practical rule: ReLU (or a variant) in hidden layers, sigmoid or softmax at the output when a probability is wanted.',
        ],
      },
    ],
  },

  linalg: {
    cheat: [
      {
        formula: 'A·v = [av₁+bv₂, cv₁+dv₂]',
        why: 'Each output entry is one row of A, multiplied into v and totalled.',
      },
      {
        formula: 'columns of A = where î and ĵ land',
        why: 'A matrix is fully described by what it does to the basis arrows.',
      },
      {
        formula: 'det(A) = ad − bc',
        why: 'The area scale factor. Zero means space collapsed and nothing can undo it.',
      },
      { formula: 'u·v = ‖u‖‖v‖cos θ', why: 'The dot product. Big when vectors agree — this is cosine similarity.' },
      {
        formula: 'A⁻¹ exists ⟺ det(A) ≠ 0',
        why: 'A flattened transform has no inverse: two inputs now share one output.',
      },
    ],
    quiz: [
      {
        q: 'What do the columns of a 2×2 matrix tell you directly?',
        options: [
          'The eigenvalues',
          'Where the basis vectors (1,0) and (0,1) end up after the transform',
          'The determinant',
          'The average of the data',
        ],
        answer: 1,
        explain:
          'Column one is the image of (1,0), column two the image of (0,1). Every other vector is a mix of those two, so knowing where they land tells you where everything lands — which is why the picture is enough to reason with.',
      },
      {
        q: 'A transform has determinant 0. What has happened, and can it be undone?',
        options: [
          'Nothing changed; it can be undone trivially',
          'Space was flattened onto a line or point, and it cannot be undone',
          'Space was rotated, and rotating back undoes it',
          'The matrix is not square',
        ],
        answer: 1,
        explain:
          'Zero determinant means the output has fewer dimensions than the input — distinct inputs now land on the same output, so the information distinguishing them is gone. No inverse exists.',
      },
      {
        q: 'Why is the dot product the standard way to measure similarity between embeddings?',
        options: [
          'It is the fastest thing a computer can do',
          'It is large when two vectors point the same way and zero when they are perpendicular',
          'It always returns a value between 0 and 1',
          'It measures the distance between them',
        ],
        answer: 1,
        explain:
          'u·v = ‖u‖‖v‖cos θ, so it tracks the angle between the vectors. Normalising the lengths first gives cosine similarity, which is what semantic search and RAG rank by. Note it is not a distance — it grows with length unless you normalise.',
      },
      {
        q: 'What does the word "linear" actually restrict?',
        options: [
          'The transform must be a straight line on a graph',
          'Grid lines stay straight, parallel and evenly spaced; the origin stays fixed',
          'Only 2×2 matrices are allowed',
          'The determinant must be positive',
        ],
        answer: 1,
        explain:
          'Linearity means A(u+v) = Au + Av and A(kv) = k(Av). Geometrically that is exactly "straight stays straight, evenly spaced, origin fixed". Because the origin is fixed, a matrix alone cannot translate — which is why the bias term exists.',
      },
    ],
    exam: [
      {
        q: 'Explain geometrically what the determinant of a 2×2 matrix measures, and interpret det = 0, det < 0 and |det| > 1.',
        meta: 'Explain · ~7 marks',
        points: [
          'det(A) = ad − bc is the factor by which the transform scales area.',
          'The unit square (area 1) maps to a parallelogram whose area is |det(A)|.',
          '|det| > 1 expands area; |det| < 1 contracts it.',
          'det < 0 means orientation is reversed — the plane has been flipped.',
          'det = 0 means the image is a line or point: the transform is not invertible and rank has dropped.',
        ],
      },
      {
        q: 'A fully connected layer computes h = σ(Wx + b). Identify each object, its shape, and why the bias cannot be absorbed into W.',
        meta: 'Short answer · ~6 marks',
        points: [
          'x is the input vector (n×1); W is the weight matrix (m×n); b is the bias vector (m×1); h is the output (m×1).',
          'Wx is a linear map: it rotates, scales and shears, but always sends 0 to 0.',
          'b translates the result, which no matrix can do on its own — hence it must be a separate term.',
          'σ applies element-wise and supplies the non-linearity; without it, stacked layers collapse to a single linear map.',
          'Mention the augmentation trick (appending a constant 1 to x) as the formal way to fold b into W.',
        ],
      },
    ],
  },

  regression: {
    cheat: [
      { formula: 'ŷ = wx + b', why: 'One straight line: slope times input plus intercept.' },
      { formula: 'MSE = (1/n) Σ (ŷᵢ − yᵢ)²', why: 'Average squared miss. Both directions count, big misses dominate.' },
      { formula: 'w* = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²', why: 'Closed-form slope. No iteration needed for one feature.' },
      { formula: 'b* = ȳ − w*x̄', why: 'The fitted line always passes through the mean point (x̄, ȳ).' },
      {
        formula: 'R² = 1 − SSres/SStot',
        why: 'Share of variance explained. Compares your line against just predicting the mean.',
      },
    ],
    quiz: [
      {
        q: 'Why are the errors squared rather than simply added?',
        options: [
          'To make the algebra shorter',
          'So over- and under-shooting both count as bad, and large misses hurt disproportionately',
          'Because squaring makes the line steeper',
          'To keep the units the same as y',
        ],
        answer: 1,
        explain:
          'Signed errors would cancel out. Squaring removes the sign and makes one large miss cost far more than several small ones, which is why a single outlier can drag the fit.',
      },
      {
        q: 'A single extreme outlier is added far above the cloud. What happens to the least-squares line?',
        options: [
          'Nothing — least squares is robust',
          'It rotates and shifts towards the outlier',
          'Only the intercept changes',
          'The slope becomes zero',
        ],
        answer: 1,
        explain:
          'Its squared residual is enormous, so the loss is minimised by moving towards it. Robust losses (Huber, absolute error) or cleaning the data are the usual answers.',
      },
      {
        q: 'What does the intercept b represent physically?',
        options: [
          'The change in y per unit x',
          'The predicted y when x = 0',
          'The average of all y values',
          'The error of the model',
        ],
        answer: 1,
        explain:
          'b is where the line crosses x = 0. It is only meaningful if x = 0 is inside a sensible range for your data.',
      },
      {
        q: 'MSE for your fitted line equals the MSE of the best possible line. What does that tell you?',
        options: [
          'The model is overfitting',
          'You have found the optimal w and b for this data',
          'The data is perfectly linear',
          'R² must equal 1',
        ],
        answer: 1,
        explain:
          'It means you sit at the minimum of the loss surface. It says nothing about the residual size — the data can still be noisy, so R² need not be 1.',
      },
    ],
    exam: [
      {
        q: 'Derive the closed-form solution for simple linear regression by minimising the sum of squared errors.',
        meta: 'Derivation · ~8 marks',
        points: [
          'State the loss J(w,b) = Σ(wxᵢ + b − yᵢ)².',
          'Take partial derivatives with respect to b and w and set both to zero.',
          'From ∂J/∂b = 0 obtain b = ȳ − wx̄.',
          'Substitute back to get w = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)².',
          'Note the fit passes through (x̄, ȳ) and that the Hessian is positive definite, so this is the global minimum.',
        ],
      },
      {
        q: 'Compare squared error with absolute error as a loss for regression. When would you prefer each?',
        meta: 'Compare & contrast · ~6 marks',
        points: [
          'Squared error: differentiable everywhere, closed-form solution, but heavily penalises outliers.',
          'Absolute error: robust to outliers, estimates the conditional median, but non-differentiable at zero and needs iterative solving.',
          'Mention Huber loss as the compromise — quadratic near zero, linear in the tails.',
          'Conclude with a data-driven rule: heavy-tailed or dirty data favours absolute or Huber.',
        ],
      },
    ],
  },

  gradient: {
    cheat: [
      { formula: 'w ← w − η ∂J/∂w', why: 'Step against the slope. The minus sign is what makes it descend.' },
      { formula: 'η too large ⇒ divergence', why: 'For J = (w−3)²+1 the updates diverge once η > 1.' },
      { formula: 'step = η × slope', why: 'Steps shrink automatically as the surface flattens near the minimum.' },
      {
        formula: 'batch / mini-batch / SGD',
        why: 'All data, a subset, or one sample per update — a cost-versus-noise trade.',
      },
      {
        formula: '∂J/∂w = 0 at the optimum',
        why: 'Convergence test: the gradient, not the loss, is what goes to zero.',
      },
    ],
    quiz: [
      {
        q: 'The loss rises after every step and the parameter moves further from the minimum. What is the most likely cause?',
        options: [
          'The gradient is computed with the wrong sign',
          'The learning rate is too large',
          'The data needs shuffling',
          'The model has too few parameters',
        ],
        answer: 1,
        explain:
          'Overshooting: each step jumps past the minimum onto a steeper part of the far side, so the next step is even bigger. Reduce η (or use a decaying schedule).',
      },
      {
        q: 'Why do the steps get smaller as you approach the minimum, even with η fixed?',
        options: [
          'The learning rate decays automatically',
          'The gradient magnitude shrinks as the surface flattens',
          'Because of momentum',
          'The loss becomes negative',
        ],
        answer: 1,
        explain:
          'The step is η × gradient. Near the bottom the gradient tends to zero, so the movement does too — on a simple bowl-shaped surface you never have to shrink the step by hand.',
      },
      {
        q: 'What is the practical difference between batch gradient descent and stochastic gradient descent?',
        options: [
          'SGD uses a larger learning rate by definition',
          'Batch uses all samples per update — smoother but slower; SGD uses one — noisier but far cheaper per step',
          'Batch cannot escape local minima but SGD always can',
          'They are mathematically identical',
        ],
        answer: 1,
        explain:
          'The noise in SGD is not only a cost: it can help escape shallow minima and saddle points, which is why mini-batch is the standard compromise.',
      },
    ],
    exam: [
      {
        q: 'For J(w) = (w − 3)² + 1, derive the condition on the learning rate η under which gradient descent converges.',
        meta: 'Derivation · ~7 marks',
        points: [
          'Gradient is 2(w − 3), so the update is w_{t+1} = w_t − 2η(w_t − 3).',
          'Write the error e_t = w_t − 3, giving e_{t+1} = (1 − 2η)e_t.',
          'Convergence requires |1 − 2η| < 1, i.e. 0 < η < 1.',
          'Note η = 0.5 converges in one step; η = 1 oscillates without decaying; η > 1 diverges.',
        ],
      },
      {
        q: 'Explain the role of the learning rate and describe two techniques for setting it in practice.',
        meta: 'Short essay · ~6 marks',
        points: [
          'Define η as the fraction of the negative gradient taken per step, and its bias between speed and stability.',
          'Technique 1: schedules — step decay, exponential decay, cosine annealing, warm-up.',
          'Technique 2: adaptive methods — AdaGrad, RMSProp, Adam scaling per-parameter by gradient history.',
          'Mention learning-rate range tests and the symptom-based diagnosis (diverging loss versus crawling loss).',
        ],
      },
    ],
  },

  kmeans: {
    cheat: [
      {
        formula: 'J = Σⱼ Σ_{i∈Cⱼ} ‖xᵢ − μⱼ‖²',
        why: 'Inertia: total squared distance from points to their own centroid.',
      },
      { formula: 'assign: cᵢ = argminⱼ ‖xᵢ − μⱼ‖²', why: 'Every point joins its nearest centroid.' },
      { formula: 'update: μⱼ = mean of Cⱼ', why: 'Every centroid moves to the average of its members.' },
      { formula: 'both steps decrease J', why: 'Guarantees convergence — but only to a local minimum.' },
      { formula: 'elbow / silhouette for k', why: 'J always falls as k rises, so it cannot choose k for you.' },
    ],
    quiz: [
      {
        q: 'Two runs on identical data with the same k produce different clusters. Why?',
        options: [
          'The method deliberately throws dice every time',
          'Different random initial centroids lead to different local minima',
          'The data changed between runs',
          'k-means never converges',
        ],
        answer: 1,
        explain:
          'Each round is guaranteed to make the score better, but not to find the best answer overall — so where you start decides where you end up. The usual fixes are a smarter starting spread (k-means++) or just running it several times and keeping the best.',
      },
      {
        q: 'Why can you not choose k by picking the value that minimises inertia?',
        options: [
          'Inertia is not computable for large k',
          'The score always falls as k grows, and hits zero when every point is its own cluster',
          'Inertia is unrelated to cluster quality',
          'Because k must be prime',
        ],
        answer: 1,
        explain:
          'Every extra centroid can only tighten the clusters, so the minimum is the degenerate one-point-per-cluster solution. Use the elbow of the curve, silhouette score, gap statistic, or domain knowledge.',
      },
      {
        q: 'Which data geometry defeats k-means most fundamentally?',
        options: [
          'Well-separated spherical blobs of similar size',
          'Two interleaved crescents',
          'High-dimensional but spherical data',
          'Data with duplicate points',
        ],
        answer: 1,
        explain:
          'Assigning by Euclidean distance to a centroid implies convex, roughly isotropic clusters. Crescents need density-based (DBSCAN) or spectral methods.',
      },
    ],
    exam: [
      {
        q: 'State the k-means objective and prove that the algorithm converges in a finite number of iterations.',
        meta: 'Proof · ~8 marks',
        points: [
          'Objective: minimise J = Σⱼ Σ_{i∈Cⱼ} ‖xᵢ − μⱼ‖² over assignments and centroids.',
          'Assignment step: holding centroids fixed, choosing the nearest centroid can only decrease or preserve J.',
          'Update step: holding assignments fixed, the mean is the minimiser of the squared distance sum, so J again cannot increase.',
          'J is non-increasing and there are finitely many possible assignments, so no assignment can repeat without termination.',
          'Conclude convergence to a local optimum; note it says nothing about global optimality.',
        ],
      },
      {
        q: 'Describe k-means++ initialisation and explain what problem it solves.',
        meta: 'Short answer · ~5 marks',
        points: [
          'Problem: poor random seeding causes bad local minima and slow convergence.',
          'Pick the first centroid uniformly at random.',
          'Pick each subsequent centroid with probability proportional to D(x)², the squared distance to the nearest chosen centroid.',
          'Effect: centroids spread out, giving an expected O(log k) approximation guarantee and, in practice, faster and more stable convergence.',
        ],
      },
    ],
  },

  perceptron: {
    cheat: [
      { formula: 'z = w·x + b, ŷ = sign(z)', why: 'A weighted sum passed through a hard threshold.' },
      {
        formula: 'on error: w ← w + ηyx, b ← b + ηy',
        why: 'Only mistakes update the weights. Correct points change nothing.',
      },
      { formula: 'z = 0 is the boundary', why: 'A line in 2D, a hyperplane in general. w is its normal.' },
      {
        formula: 'separable ⇒ finite updates',
        why: 'The perceptron convergence theorem. If no straight line can split the data, it never settles.',
      },
      { formula: 'XOR is not separable', why: 'The classic example that hidden layers were invented to fix.' },
    ],
    quiz: [
      {
        q: 'When does the perceptron update its weights?',
        options: [
          'After every example',
          'Only when its prediction is wrong',
          'Only at the end of each epoch',
          'Whenever the loss increases',
        ],
        answer: 1,
        explain:
          'It is an error-driven rule: correctly classified points leave w and b untouched, which is why training visibly stops once every point is on the right side.',
      },
      {
        q: 'What does the perceptron convergence theorem guarantee?',
        options: [
          'Convergence for any dataset',
          'The margin will be maximised',
          'A separating hyperplane is found in finite updates if the data is linearly separable',
          'The training accuracy always reaches 100%',
        ],
        answer: 2,
        explain:
          'It guarantees termination only under linear separability, and only some separating boundary — not the maximum-margin one. Maximising the margin is what SVMs add.',
      },
      {
        q: 'Why can a single perceptron not learn XOR?',
        options: [
          'XOR needs more training data',
          'XOR is not linearly separable — no single hyperplane splits the classes',
          'The learning rate cannot be tuned for XOR',
          'XOR requires continuous outputs',
        ],
        answer: 1,
        explain:
          'The two positive cases sit on opposite corners of the square. A hidden layer builds an intermediate representation in which the classes become separable.',
      },
    ],
    exam: [
      {
        q: 'State the perceptron learning rule and explain geometrically why it moves the boundary in the right direction.',
        meta: 'Explain · ~7 marks',
        points: [
          'Rule: on a misclassified (x, y), w ← w + ηyx and b ← b + ηy.',
          'w is the normal to the boundary; adding ηyx rotates that normal towards (or away from) x according to the sign of y.',
          'Show the effect on the score: the new z for that point changes by η(‖x‖² + 1)y, i.e. moves in the direction of the true label.',
          'Note the boundary can break previously correct points, so accuracy need not increase monotonically.',
        ],
      },
      {
        q: 'Contrast the perceptron with logistic regression and a linear SVM.',
        meta: 'Compare & contrast · ~8 marks',
        points: [
          'Perceptron: hard threshold, error-driven updates, any separating boundary, no probabilities, no convergence if non-separable.',
          'Logistic regression: sigmoid output, cross-entropy loss, gradient-based, gives calibrated probabilities, converges on non-separable data.',
          'Linear SVM: hinge loss with regularisation, maximises the margin, supports slack variables for overlap.',
          'Conclude on the practical criterion: probabilities, margin, or simplicity.',
        ],
      },
    ],
  },

  lec1: {
    cheat: [
      { formula: 'Ax = b', why: 'A whole system in three letters. A is the numbers, x the unknowns, b the answers.' },
      {
        formula: 'Ax = x₁c₁ + x₂c₂ + … ',
        why: 'The same thing read down the columns: x is a recipe for mixing them to reach b.',
      },
      {
        formula: 'zero, one, or endlessly many',
        why: 'The only three outcomes a linear system can have. Never any other number.',
      },
      {
        formula: 'Rᵢ ↔ Rⱼ · Rₖ ← αRₖ (α ≠ 0) · Rᵢ ← Rᵢ + βRⱼ',
        why: 'The three legal moves. None of them changes which values solve the system.',
      },
      {
        formula: 'x = xₚ + λ₁h₁ + λ₂h₂ + …',
        why: 'All the answers: any one answer, plus everything that adds up to zero.',
      },
      {
        formula: 'A⁻¹ exists ⟺ det A ≠ 0',
        why: 'For 2 × 2, det = ad − bc. The inverse formula divides by it, so zero kills it.',
      },
      {
        formula: '[ A | I ] → [ I | A⁻¹ ]',
        why: 'Run elimination on A beside the identity and the inverse appears on the right.',
      },
    ],
    quiz: [
      {
        q: 'A system of linear equations turns out to have more than one answer. How many does it have?',
        options: ['Exactly two', 'Endlessly many', 'At most as many as there are unknowns', 'It depends on the matrix'],
        answer: 1,
        explain:
          'If two different answers exist, the difference between them adds up to zero, so you can add any amount of that difference and stay on an answer. That gives endlessly many straight away — which is why "exactly two" can never happen.',
      },
      {
        q: 'Why is multiplying a row by zero not one of the allowed moves?',
        options: [
          'It makes the arithmetic harder',
          'It turns the equation into 0 = 0, throwing away a constraint and letting in answers the original system did not have',
          'It is allowed, but only on the last row',
          'It changes the determinant',
        ],
        answer: 1,
        explain:
          'The three moves are safe because each one can be undone. Multiplying by zero cannot be undone — the equation is gone, and the system you are left with is a different, looser one.',
      },
      {
        q: 'Looking at the columns of A as arrows, when does Ax = b have no answer?',
        options: [
          'When A is not square',
          'When b is the zero vector',
          'When b lies outside everything the columns can reach by mixing',
          'When A has more rows than columns',
        ],
        answer: 2,
        explain:
          'x is a recipe for mixing the columns. If b is outside their reach — their span — then no recipe lands on it, and the system has no answer. That is the column picture of "no solution".',
      },
      {
        q: 'After elimination, a column has no pivot. What does that tell you?',
        options: [
          'The system has no answer',
          'That variable is free — you may choose it, and the rest adjust around your choice',
          'The matrix is not square',
          'You made an arithmetic mistake',
        ],
        answer: 1,
        explain:
          'A pivot pins a variable down. No pivot means nothing pins it down, so it becomes a free dial and the system has endlessly many answers — one for each setting.',
      },
      {
        q: 'What tells you the system has no answer at all?',
        options: [
          'A row of all zeros',
          'A row that is all zeros on the left but not zero on the right',
          'Two identical rows',
          'A zero on the diagonal',
        ],
        answer: 1,
        explain:
          'That row reads 0 = something-not-zero, which can never be true. A row of zeros all the way across is harmless — it just means that equation repeated what the others already said.',
      },
    ],
    exam: [
      {
        q: 'A linear system can have zero, one, or infinitely many solutions. Justify why no other number is possible, and describe each case geometrically for two unknowns.',
        meta: 'Explain · ~8 marks',
        points: [
          'Suppose two distinct solutions x and y exist. Then A(x − y) = b − b = 0, so d = x − y is a non-zero solution of the homogeneous system.',
          'Then x + λd is a solution for every real λ, and all are distinct because d ≠ 0 — so two solutions immediately force infinitely many.',
          'Geometry with two unknowns: each equation is a line. Lines crossing once = one solution; parallel and distinct = none; identical = infinitely many.',
          'Note the same three cases persist in higher dimensions with planes and hyperplanes, even though the picture stops being drawable.',
        ],
      },
      {
        q: 'State the three elementary row operations and prove that they do not change the solution set of a system.',
        meta: 'State & prove · ~8 marks',
        points: [
          'ERO1 swap Rᵢ ↔ Rⱼ; ERO2 scale Rₖ ← αRₖ with α ≠ 0; ERO3 add Rᵢ ← Rᵢ + βRⱼ.',
          'Each corresponds to an operation on the equations themselves: reordering them, restating one as an equivalent multiple, or replacing one with a valid consequence.',
          'Key argument: each operation is reversible (swap back, scale by 1/α, subtract βRⱼ), so any solution of the new system is a solution of the old and vice versa.',
          'Explain why α ≠ 0 is required: scaling by zero is not reversible, discards a constraint, and can enlarge the solution set.',
        ],
      },
      {
        q: 'Explain how the general solution of Ax = b is built from a particular solution and the solutions of Ax = 0, using an example with at least one free variable.',
        meta: 'Explain with example · ~10 marks',
        points: [
          'Find any particular xₚ with Axₚ = b — often readable straight off the reduced row-echelon form.',
          'Solve the homogeneous system Ax = 0; each non-pivot (free) column contributes one independent solution hᵢ.',
          'General solution x = xₚ + Σ λᵢhᵢ. Show it works: A(xₚ + Σλᵢhᵢ) = b + 0 = b.',
          'Show completeness: if Ax = b then A(x − xₚ) = 0, so x − xₚ is in the homogeneous solution set.',
          'Note neither xₚ nor the choice of hᵢ is unique, though the set of solutions they describe is.',
        ],
      },
    ],
  },

  ism1: {
    cheat: [
      { formula: 'x̄ = Σx / n', why: 'The mean. Add everything up, divide by how many. It is a balance point.' },
      {
        formula: 'Σ(x − x̄) = 0',
        why: 'Distances from the mean always cancel. That is why you cannot just average them.',
      },
      {
        formula: 'median = middle value in order',
        why: 'Odd n, take the middle. Even n, average the two middle ones.',
      },
      {
        formula: 'mean > median > mode ⇒ right skew',
        why: 'Reverse it for left skew. All three equal means symmetric.',
      },
      { formula: 'SS = Σ(x − x̄)²', why: 'Sum of squares. Square first so the negatives stop cancelling.' },
      {
        formula: 's² = SS/(n − 1),  σ² = SS/N',
        why: 'Sample divides by n − 1, population by N. A sample hugs its own mean too closely.',
      },
      {
        formula: 'position of Q1 = (n + 1)/4',
        why: 'Q3 is 3(n + 1)/4. Read between the neighbours if it lands part-way.',
      },
      { formula: 'IQR = Q3 − Q1', why: 'The spread of the middle half. Extreme values cannot touch it.' },
      {
        formula: 'fences: Q1 − 1.5·IQR, Q3 + 1.5·IQR',
        why: 'Anything outside is a possible outlier — worth a look, not automatically wrong.',
      },
    ],
    quiz: [
      {
        q: 'A dataset of salaries has a few very high earners. Which measure of centre best describes a typical salary?',
        options: ['The mean', 'The median', 'The mode', 'The range'],
        answer: 1,
        explain:
          'The mean gets dragged upwards by the few large values, so it ends up describing almost nobody. The median only cares about order, so a handful of huge salaries barely move it. That is why salary and house price figures are nearly always medians.',
      },
      {
        q: 'Why do we square the distances from the mean instead of just averaging them?',
        options: [
          'Squaring makes the arithmetic easier',
          'Because the plain distances always add up to zero, so their average is always zero',
          'To convert the units into something comparable',
          'It is a convention with no real reason',
        ],
        answer: 1,
        explain:
          'The mean is a balance point, so the values above it pull exactly as hard as those below. The distances cancel out for every dataset. Squaring makes them all positive so nothing cancels — at the cost of letting far-away values count for a great deal more.',
      },
      {
        q: 'Why does the sample variance divide by n − 1 rather than n?',
        options: [
          'To make the number bigger and be safe',
          'Because a sample is measured around its own mean, which sits closer to those values than the true mean does, so dividing by n comes out too small',
          'Because samples always contain outliers',
          'It only applies when n is small',
        ],
        answer: 1,
        explain:
          'The sample mean has already shifted to the middle of the sampled values, so they look tighter than the population really is. Dividing by n − 1 corrects that. The correction is large for small samples and almost nothing for big ones.',
      },
      {
        q: 'Temperature in degrees Celsius is which level of measurement?',
        options: ['Nominal', 'Ordinal', 'Interval', 'Ratio'],
        answer: 2,
        explain:
          'The gaps are real and equal — 20° to 30° is the same jump as 30° to 40° — so it is at least interval. But 0°C does not mean "no temperature", so ratios do not work: 40°C is not twice as hot as 20°C. That missing true zero is what stops it being ratio.',
      },
      {
        q: 'Data in order: 11 12 13 16 16 17 17 18 21. What is the IQR?',
        options: ['4', '5', '5.5', '10'],
        answer: 1,
        explain:
          'n = 9, so Q1 sits at position (9+1)/4 = 2.5, halfway between 12 and 13, giving 12.5. Q3 sits at 3(9+1)/4 = 7.5, halfway between 17 and 18, giving 17.5. IQR = 17.5 − 12.5 = 5.',
      },
      {
        q: 'A value is flagged by the 1.5 × IQR rule. What should you do?',
        options: [
          'Delete it — it is an error',
          'Investigate it. It might be a mistake, or it might be the most interesting point you have',
          'Replace it with the mean',
          'Nothing — the rule is only decorative',
        ],
        answer: 1,
        explain:
          'The rule points at values worth checking. Some turn out to be typos or broken instruments; others are the genuine rare events you most wanted to find. Deleting on sight throws away real information and quietly biases everything you do next.',
      },
    ],
    exam: [
      {
        q: 'Define the mean, median and mode. Explain, with an example, which you would report for a heavily skewed dataset and why.',
        meta: 'Explain · ~8 marks',
        points: [
          'Mean = Σx/n, uses every value; median = middle value of the ordered data; mode = most frequent value.',
          'State the mean is a balance point: Σ(x − x̄) = 0, so every observation exerts leverage proportional to its distance.',
          'For right-skewed data mean > median > mode; a few large values inflate the mean.',
          'Recommend the median, since it depends only on rank and is unaffected by the magnitude of extreme values — hence its use for income and house prices.',
          'Note the mode is the only measure available for nominal data.',
        ],
      },
      {
        q: 'Derive the need for squaring in the definition of variance, and explain why the sample formula uses n − 1.',
        meta: 'Derivation · ~8 marks',
        points: [
          'Show Σ(x − x̄) = Σx − nx̄ = 0, so the mean deviation is identically zero and carries no information.',
          'Squaring removes the sign; define SS = Σ(x − x̄)² and variance as the mean squared deviation.',
          'Note variance is in squared units, so the standard deviation s = √(SS/(n−1)) restores the original units.',
          'Sample correction: deviations are taken about x̄ rather than μ, and Σ(x − x̄)² is minimised at x̄, so SS/n underestimates σ².',
          'Dividing by n − 1 (the degrees of freedom) gives an unbiased estimator; note the correction shrinks as n grows.',
        ],
      },
      {
        q: 'For the data 11, 12, 13, 16, 16, 17, 17, 18, 21: construct the five-number summary, compute the IQR, apply the outlier rule and describe the box plot.',
        meta: 'Computation · ~10 marks',
        points: [
          'Data is already ordered; n = 9. Minimum 11, maximum 21.',
          'Median at position (9+1)/2 = 5 ⇒ 16.',
          'Q1 at position (9+1)/4 = 2.5 ⇒ halfway between 12 and 13 ⇒ 12.5. Q3 at 3(9+1)/4 = 7.5 ⇒ 17.5.',
          'IQR = 17.5 − 12.5 = 5; QD = 2.5.',
          'Fences: 12.5 − 7.5 = 5 and 17.5 + 7.5 = 25. All values lie inside, so there are no outliers.',
          'Box from 12.5 to 17.5 with the median line at 16; whiskers to 11 and 21; state the quartile rule used, since conventions differ.',
        ],
      },
    ],
  },

  ism2: {
    cheat: [
      { formula: 'S = { all possible outcomes }', why: 'The sample space. Write it down before working anything out.' },
      { formula: 'P(A) = |A| / |S|', why: 'Classical probability. Only valid when the outcomes are equally likely.' },
      { formula: 'P(S) = 1,  0 ≤ P(E) ≤ 1', why: 'Something happens, and nothing is beyond impossible or certain.' },
      { formula: 'P(A) + P(Aᶜ) = 1', why: 'The complement rule. "At least one" nearly always means: do the opposite.' },
      {
        formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
        why: 'The addition rule. Subtract because the overlap was counted twice.',
      },
      {
        formula: 'mutually exclusive ⟺ P(A ∩ B) = 0',
        why: 'They cannot both happen, so the rule loses its last term.',
      },
      {
        formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B)',
        why: 'One tells you nothing about the other. Independent events usually still overlap.',
      },
      { formula: 'C(n,k) = n! / (k!(n−k)!)', why: 'Ways to choose k from n when order does not matter.' },
    ],
    quiz: [
      {
        q: 'Two dice are thrown. What is the probability the sum is greater than 8?',
        options: ['4/11', '5/18', '1/6', '1/3'],
        answer: 1,
        explain:
          'There are 36 equally likely outcomes, not 11. Sums of 9, 10, 11 and 12 happen in 4 + 3 + 2 + 1 = 10 of them, so the answer is 10/36 = 5/18. Treating the eleven possible sums as equally likely is the classic trap here.',
      },
      {
        q: 'A and B are mutually exclusive, and both have probability greater than zero. Are they independent?',
        options: ['Yes, always', 'No — never, in this case', 'Only if P(A) = P(B)', 'It depends on the sample space'],
        answer: 1,
        explain:
          'Independence needs P(A ∩ B) = P(A)P(B). Mutually exclusive means P(A ∩ B) = 0, while P(A)P(B) is greater than zero. So they cannot match. In fact exclusive events are strongly dependent: learning A happened tells you B definitely did not.',
      },
      {
        q: 'Four mutually exclusive outcomes are assigned 1/2, 1/4, 1/8 and 1/16. Is this permissible?',
        options: [
          'Yes — every value is between 0 and 1',
          'No — they add to 15/16, not 1',
          'No — probabilities must be decimals',
          'Yes, provided the outcomes are equally likely',
        ],
        answer: 1,
        explain:
          'Each value is legal on its own, but the four outcomes are everything that can happen, so their probabilities must total exactly 1. These come to 15/16, leaving 1/16 of probability with nowhere to go.',
      },
      {
        q: '75% of investors buy annuities, 45% buy stocks, and 85% buy at least one. What percentage buy both?',
        options: ['20%', '35%', '30%', '55%'],
        answer: 1,
        explain:
          'Rearrange the addition rule: P(A ∩ B) = P(A) + P(B) − P(A ∪ B) = 0.75 + 0.45 − 0.85 = 0.35. Most exam questions of this type hand you three of the four quantities and ask for the fourth.',
      },
      {
        q: 'Why is the complement rule so often the fastest route to an answer?',
        options: [
          'It avoids fractions',
          'Because "at least one" is usually far harder to count directly than "none at all"',
          'Because complements are always more likely',
          'It only works for dice problems',
        ],
        answer: 1,
        explain:
          '"At least one head in ten flips" covers a great many outcomes. Its complement, "no heads at all", is a single outcome. Work that out and subtract from 1.',
      },
    ],
    exam: [
      {
        q: 'State the axioms of probability and use them to explain why the addition rule contains a subtraction.',
        meta: 'State & explain · ~8 marks',
        points: [
          'Axioms: P(S) = 1; 0 ≤ P(E) ≤ 1; and for disjoint E₁, E₂, P(E₁ ∪ E₂) = P(E₁) + P(E₂).',
          'Decompose A ∪ B into three disjoint pieces: A∩Bᶜ, A∩B and Aᶜ∩B, then apply axiom 3.',
          'Note P(A) = P(A∩Bᶜ) + P(A∩B) and similarly for B, so P(A) + P(B) counts P(A∩B) twice.',
          'Conclude P(A ∪ B) = P(A) + P(B) − P(A ∩ B), reducing to plain addition when A ∩ B = ∅.',
        ],
      },
      {
        q: 'Distinguish mutually exclusive events from independent events. Show they cannot both hold for events of non-zero probability.',
        meta: 'Compare & prove · ~8 marks',
        points: [
          'Mutually exclusive: A ∩ B = ∅, hence P(A ∩ B) = 0 — a statement about co-occurrence.',
          'Independent: P(A ∩ B) = P(A)P(B) — a statement about information; knowing A leaves P(B) unchanged.',
          'Suppose both hold with P(A), P(B) > 0. Then P(A)P(B) = 0, contradicting both being positive.',
          'Interpretation: exclusivity is an extreme form of dependence, since A occurring determines that B did not.',
          'Give an example of each: two faces of one die roll are exclusive; a coin flip and a die roll are independent and can co-occur.',
        ],
      },
      {
        q: 'A committee of 5 is chosen at random from 8 men and 4 women. Find the probability that women form a majority.',
        meta: 'Computation · ~8 marks',
        points: [
          'Total selections: C(12,5) = 792, with each equally likely since the choice is random.',
          'Majority of 5 means 3 or more women; with only 4 women available the cases are exactly 3W2M and 4W1M.',
          'C(4,3)·C(8,2) = 4 × 28 = 112 and C(4,4)·C(8,1) = 1 × 8 = 8.',
          'The cases are mutually exclusive, so add: 120 favourable selections.',
          'P = 120/792 = 5/33 ≈ 0.1515.',
        ],
      },
    ],
  },

  centre: {
    cheat: [
      { formula: 'x̄ = Σx / n', why: 'The mean. Uses every value, so every value can pull it.' },
      { formula: 'x̄ = Σ(f·x) / N', why: 'The mean when values come with counts.' },
      { formula: 'Σ(x − x̄) = 0', why: 'The mean is a balance point. Distances either side always cancel.' },
      {
        formula: 'median = middle value in order',
        why: 'Even n: average the two middle ones. Ignores size, so it is robust.',
      },
      {
        formula: 'mode = most frequent value',
        why: 'The only measure that works on categories. Can be none, one or several.',
      },
      { formula: 'mean > median > mode', why: 'Tail to the right. Reverse for left. All equal means even.' },
    ],
    quiz: [
      {
        q: 'Which measure of centre can be used on nominal data such as eye colour?',
        options: ['The mean', 'The median', 'The mode', 'All three'],
        answer: 2,
        explain:
          'The mean needs arithmetic and the median needs an order. Nominal data has neither — brown is not bigger than blue. Counting which value turns up most still works, so the mode is the only option.',
      },
      {
        q: 'A dataset is right-skewed. Which is true?',
        options: ['mean < median', 'mean > median', 'mean = median', 'It depends on the mode'],
        answer: 1,
        explain:
          'A right skew means a long tail of large values. Those values pull the mean up while barely moving the median, so the mean ends up above it. That gap is a quick test for skew.',
      },
      {
        q: 'Why does the sum of the deviations from the mean always come to zero?',
        options: [
          'Because deviations are always positive',
          'Because the mean is a balance point — values above pull exactly as hard as values below',
          'Because of rounding',
          'It does not; only for symmetric data',
        ],
        answer: 1,
        explain:
          'Σ(x − x̄) = Σx − nx̄ = 0 for any data at all. This is why measuring spread needs the squaring step — averaging the raw distances would give zero every time.',
      },
    ],
    exam: [
      {
        q: 'Compare mean, median and mode as measures of central tendency, stating the level of measurement each requires and how each responds to outliers.',
        meta: 'Compare & contrast · ~8 marks',
        points: [
          'Mean: interval or ratio data; uses every observation; highly sensitive to outliers through Σx.',
          'Median: ordinal or above; depends only on rank; robust, as extreme values change position by at most one place.',
          'Mode: any level including nominal; unaffected by outliers; may be absent or non-unique.',
          'Note Σ(x − x̄) = 0 characterises the mean as a balance point and explains its sensitivity.',
          'Recommendation: median for skewed or outlier-prone data; mean where the data is symmetric and further statistics are wanted.',
        ],
      },
    ],
  },

  spread: {
    cheat: [
      { formula: 'range = max − min', why: 'Quick, and built from the two values most likely to be odd.' },
      { formula: 'SS = Σ(x − x̄)²', why: 'Square first so the distances stop cancelling, then add.' },
      {
        formula: 's² = SS/(n − 1)',
        why: 'Sample variance. The n − 1 corrects for measuring around the sample’s own mean.',
      },
      { formula: 'σ² = SS/N', why: 'Population variance. Divide by N when you have measured everything.' },
      { formula: 's = √s²', why: 'Standard deviation. Back in the original units, so you can picture it.' },
      { formula: 'IQR = Q3 − Q1', why: 'The robust alternative. Ignores the ends entirely.' },
    ],
    quiz: [
      {
        q: 'Two datasets have the same mean, median and mode. What can you conclude?',
        options: [
          'They are the same dataset',
          'Almost nothing — they may have completely different spreads',
          'They must both be symmetric',
          'Their standard deviations are equal',
        ],
        answer: 1,
        explain:
          'The lecture’s two groups both have mean, median and mode of 5, but sums of squares of 44 and 134. Centre and spread are independent questions, which is why you always report both.',
      },
      {
        q: 'Why is the standard deviation usually reported rather than the variance?',
        options: [
          'It is easier to compute',
          'It is in the original units, so it can be pictured; variance is in squared units',
          'It is always smaller',
          'Variance can be negative',
        ],
        answer: 1,
        explain:
          'If your data is in minutes, the variance is in square minutes — a quantity nobody can picture. Taking the square root puts it back into minutes, where it answers "how far is a typical value from the average?".',
      },
      {
        q: 'A single value is moved twice as far from the mean. What happens to its contribution to the sum of squares?',
        options: ['It doubles', 'It quadruples', 'It is unchanged', 'It halves'],
        answer: 1,
        explain:
          'The contribution is the squared distance, so doubling the distance multiplies it by four. This is why one extreme value can dominate the standard deviation, and why squared-error models are so sensitive to outliers.',
      },
    ],
    exam: [
      {
        q: 'Explain why measures of central tendency alone are insufficient, and derive the sample standard deviation from first principles.',
        meta: 'Explain & derive · ~10 marks',
        points: [
          'Give a counter-example: two datasets with identical mean, median and mode but different dispersion (44 vs 134 sum of squares).',
          'Show Σ(x − x̄) = 0, so the mean deviation carries no information.',
          'Square to remove sign: SS = Σ(x − x̄)²; average to obtain variance.',
          'Sample correction: deviations are about x̄ rather than μ and Σ(x − x̄)² is minimised at x̄, so SS/n is biased low; divide by n − 1.',
          'Take the square root to restore original units; note the correction is negligible for large n and substantial for small n.',
        ],
      },
    ],
  },

  outliers: {
    cheat: [
      { formula: 'position of Q1 = (n + 1)/4', why: 'Q3 at 3(n+1)/4. Interpolate if it lands between two values.' },
      { formula: 'five-point summary', why: 'min, Q1, median, Q3, max. Everything a box plot draws.' },
      { formula: 'IQR = Q3 − Q1', why: 'The width of the middle half. Extremes cannot touch it.' },
      { formula: 'QD = IQR / 2', why: 'The quartile deviation.' },
      {
        formula: 'fences: Q1 − 1.5·IQR, Q3 + 1.5·IQR',
        why: 'Outside means flagged for a look — not automatically wrong.',
      },
    ],
    quiz: [
      {
        q: 'For 11 12 13 16 16 17 17 18 21, what is Q1?',
        options: ['12', '12.5', '13', '11.5'],
        answer: 1,
        explain:
          'n = 9, so Q1 sits at position (9+1)/4 = 2.5 — halfway between the 2nd and 3rd values, which are 12 and 13. That gives 12.5. Note other software may use a different rule and get a slightly different answer.',
      },
      {
        q: 'A value falls outside the 1.5 × IQR fences. What is the right response?',
        options: [
          'Delete it',
          'Investigate it — it may be an error, or it may be the most interesting point in the data',
          'Replace it with the median',
          'Recompute the fences without it',
        ],
        answer: 1,
        explain:
          'The rule flags values worth checking. Some are typos or broken sensors; others are the rare events you were looking for. Deleting on sight destroys information and biases everything downstream.',
      },
      {
        q: 'Why is the IQR preferred to the range for messy data?',
        options: [
          'It is easier to calculate',
          'It measures the middle half only, so extreme values cannot affect it',
          'It is always larger',
          'It works on categorical data',
        ],
        answer: 1,
        explain:
          'The range is built from the two most extreme values — precisely the ones most likely to be wrong. The IQR is built from positions inside the data, so pushing an end value further out does not change it at all.',
      },
    ],
    exam: [
      {
        q: 'Construct a five-number summary and box plot for a given dataset, apply the outlier rule, and comment on skew.',
        meta: 'Computation & interpretation · ~10 marks',
        points: [
          'Order the data; state n; identify minimum and maximum.',
          'Locate the median and the quartiles by position, stating the rule used since conventions differ.',
          'Compute IQR = Q3 − Q1 and the fences at Q1 − 1.5·IQR and Q3 + 1.5·IQR.',
          'Identify values outside the fences; draw the box from Q1 to Q3 with the median marked, whiskers to the furthest values inside the fences, and flagged points plotted separately.',
          'Comment on skew from the position of the median within the box and the relative whisker lengths; note flagged values require investigation, not automatic deletion.',
        ],
      },
    ],
  },

  probability: {
    cheat: [
      { formula: 'P(A) = |A| / |S|', why: 'Classical. Count favourable over total — needs equally likely outcomes.' },
      { formula: 'P(A) ≈ hits / trials', why: 'Empirical. Gets closer to the truth the more runs you do.' },
      { formula: 'P(S) = 1', why: 'Axiom one. Something in the sample space happens.' },
      { formula: '0 ≤ P(E) ≤ 1', why: 'Axiom two. Nothing beyond impossible or certain.' },
      { formula: 'disjoint ⇒ P(E₁ ∪ E₂) = P(E₁) + P(E₂)', why: 'Axiom three. Everything else is built on it.' },
    ],
    quiz: [
      {
        q: 'When does the classical definition of probability fail?',
        options: [
          'When the sample space is infinite only',
          'Whenever the outcomes are not equally likely',
          'When there are more than six outcomes',
          'It never fails',
        ],
        answer: 1,
        explain:
          'Counting favourable over total assumes each outcome carries the same weight. It is true for a fair die and false for almost everything else — which is why the eleven sums of two dice cannot be counted that way.',
      },
      {
        q: 'You flip a fair coin five times and get five heads. What is the probability the next flip is heads?',
        options: ['Less than 1/2', 'Exactly 1/2', 'More than 1/2', 'Impossible to say'],
        answer: 1,
        explain:
          'The coin has no memory. Probability describes the long run, not a correction owed to you — expecting tails "to balance it out" is the gambler’s fallacy. The long-run fraction settles near 1/2 by swamping early runs, not by reversing them.',
      },
      {
        q: 'What does the axiomatic approach actually define?',
        options: [
          'A formula for calculating any probability',
          'Nothing — it states the rules any probability must obey and works from those',
          'Probability as a long-run frequency',
          'Probability as a degree of belief',
        ],
        answer: 1,
        explain:
          'It deliberately sidesteps the question of what a probability is. By stating only the properties it must satisfy, the same mathematics covers counted, measured and subjective probabilities alike.',
      },
    ],
    exam: [
      {
        q: 'Compare the classical, empirical and axiomatic definitions of probability, giving the conditions under which each applies.',
        meta: 'Compare & contrast · ~8 marks',
        points: [
          'Classical: |A|/|S|, requires finitely many equally likely outcomes; fails for loaded dice or unequal outcomes.',
          'Empirical: limiting relative frequency over repeated trials; requires repeatability and a large number of trials.',
          'Axiomatic: probability is any measure satisfying P(S) = 1, 0 ≤ P(E) ≤ 1 and countable additivity on disjoint events.',
          'Note the axiomatic approach subsumes the others and permits subjective probability for non-repeatable events.',
          'Reference the law of large numbers as the link between the empirical and classical values.',
        ],
      },
    ],
  },

  events: {
    cheat: [
      { formula: 'A ⊆ S', why: 'An event is part of the sample space, including ∅ and S themselves.' },
      { formula: 'A ∪ B — or', why: 'In A, or B, or both. The "or" includes both, unlike everyday speech.' },
      { formula: 'A ∩ B — and', why: 'In both at once. The overlap.' },
      { formula: 'P(A) + P(Aᶜ) = 1', why: 'The complement rule. Count the easy side and subtract.' },
      { formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', why: 'Subtract because the overlap was counted twice.' },
      { formula: 'exclusive: P(A∩B)=0 · independent: P(A∩B)=P(A)P(B)', why: 'Different questions. Rarely both true.' },
    ],
    quiz: [
      {
        q: 'In probability, what does "A or B" mean?',
        options: ['Exactly one of them, not both', 'A, or B, or both', 'Both of them', 'It depends on the context'],
        answer: 1,
        explain:
          'The union is inclusive. In conversation "tea or coffee" usually rules out having both, and carrying that habit into probability is one of the most common mistakes made. "Exactly one" is a different event: P(A) + P(B) − 2P(A ∩ B).',
      },
      {
        q: 'Which is the fastest way to find "at least one head in ten flips"?',
        options: [
          'Add up the probabilities of one head, two heads, and so on',
          'Work out the probability of no heads at all, then subtract from 1',
          'Multiply the probabilities together',
          'Use the addition rule ten times',
        ],
        answer: 1,
        explain:
          '"At least one" covers a great many outcomes; its complement, "no heads at all", is a single one. Spotting that phrase and reaching for the complement rule saves a large amount of work.',
      },
      {
        q: 'Two events overlap. Can they still be independent?',
        options: [
          'No — overlapping means dependent',
          'Yes — independence is about whether one changes the odds of the other, not whether they can co-occur',
          'Only if the overlap is exactly half',
          'Only for dice problems',
        ],
        answer: 1,
        explain:
          'Independent events usually do overlap. Flip a coin and roll a die: heads and a six are independent and happen together one time in twelve. Independence requires P(A ∩ B) = P(A)P(B), which is generally not zero.',
      },
    ],
    exam: [
      {
        q: 'Define union, intersection and complement for events, and prove the addition rule from the axioms.',
        meta: 'Define & prove · ~8 marks',
        points: [
          'A ∪ B is the set of outcomes in A, in B, or in both; A ∩ B the set in both; Aᶜ the outcomes of S not in A.',
          'Partition A ∪ B into the disjoint pieces A∩Bᶜ, A∩B and Aᶜ∩B; apply the additivity axiom.',
          'Write P(A) = P(A∩Bᶜ) + P(A∩B) and P(B) = P(Aᶜ∩B) + P(A∩B); substitute.',
          'Obtain P(A ∪ B) = P(A) + P(B) − P(A ∩ B); note the special case when A ∩ B = ∅.',
          'Derive P(Aᶜ) = 1 − P(A) from S = A ∪ Aᶜ with A ∩ Aᶜ = ∅ and P(S) = 1.',
        ],
      },
    ],
  },
}
