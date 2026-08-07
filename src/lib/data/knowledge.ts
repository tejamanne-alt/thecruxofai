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

  matmul: {
    cheat: [
      {
        formula: 'cⱼₖ = Σₗ aⱼₗ bₗₖ',
        why: 'Row j of the left meets column k of the right. Multiply the pairs, add them up.',
      },
      {
        formula: '(m × n) · (n × p) = (m × p)',
        why: 'The inner two must match and then vanish. The outer two are the answer’s shape.',
      },
      { formula: 'AB ≠ BA', why: 'Order is part of the meaning, and often only one of the two even exists.' },
      { formula: 'AB = 0 does not give A = 0 or B = 0', why: 'So you cannot cancel: AB = AC does not give B = C.' },
      { formula: 'AI = IA = A', why: 'The identity matrix is the matrix version of the number 1.' },
      {
        formula: '(AB)ᵀ = BᵀAᵀ',
        why: 'Transpose each and reverse the order. Socks then shoes, undone shoes then socks.',
      },
    ],
    quiz: [
      {
        q: 'A is 3 × 4 and B is 4 × 2. What shape is AB?',
        options: ['4 × 4', '3 × 2', '2 × 3', 'It is not defined'],
        answer: 1,
        explain:
          'The inner numbers, both 4, match and disappear. What is left is the outer pair: 3 rows from A and 2 columns from B. BA would need 2 to match 3, so it does not exist at all.',
      },
      {
        q: 'Why is (AB)ᵀ equal to BᵀAᵀ rather than AᵀBᵀ?',
        options: [
          'It is a convention with no reason behind it',
          'Because transposing reverses which side each matrix sits on, and AᵀBᵀ usually will not even fit',
          'Because A and B are square',
          'They are actually the same thing',
        ],
        answer: 1,
        explain:
          'If A is 2 × 3 and B is 3 × 4, then Aᵀ is 3 × 2 and Bᵀ is 4 × 3. AᵀBᵀ would need 2 to match 4 — impossible. BᵀAᵀ is 4 × 3 times 3 × 2, which works and gives the 4 × 2 shape (AB)ᵀ needs.',
      },
      {
        q: 'You find matrices A and B, neither of them zero, with AB = 0. What does that rule out?',
        options: [
          'Nothing — it is a normal thing for matrices to do',
          'It means A or B was written down wrongly',
          'It means A and B are both singular',
          'It means AB = BA',
        ],
        answer: 0,
        explain:
          'It is perfectly normal. A = [1 1; 2 2] and B = [−1 1; 1 −1] do it. Both happen to be singular here, and that is no accident — but the point to take away is that the cancellation you rely on for ordinary numbers is simply not available.',
      },
    ],
    exam: [
      {
        q: 'Define the product of two matrices, state the condition for it to exist, and explain why matrix multiplication is not commutative.',
        meta: 'Definition with justification · 5–6 marks',
        points: [
          'For A of size m × n and B of size n × p, the product AB is the m × p matrix with entries cⱼₖ = Σₗ₌₁ⁿ aⱼₗ bₗₖ.',
          'The product is defined only when the number of columns of A equals the number of rows of B.',
          'Even when AB exists, BA may not: if A is 3 × 4 and B is 4 × 2 then BA requires 2 = 3 and is undefined.',
          'When both exist they may have different shapes, and even for square matrices of the same size they generally differ — for example A = [1 2; 3 4] and B = [0 1; 0 0] give AB = [0 1; 0 3] but BA = [3 4; 0 0].',
          'Consequences: AB = 0 does not imply A = 0 or B = 0, and AB = AC does not imply B = C unless A is invertible.',
          'Multiplication is however associative and distributive over addition, and (AB)ᵀ = BᵀAᵀ.',
        ],
      },
    ],
  },

  determinant: {
    cheat: [
      { formula: 'det A = ad − bc  (2 × 2)', why: 'The signed area of the box the two columns make.' },
      {
        formula: 'det A = Σⱼ (−1)^(j+k) aⱼₖ Mⱼₖ',
        why: 'Cofactor expansion along any row or column — pick the one with the most zeros.',
      },
      {
        formula: 'det(AB) = det A · det B',
        why: 'Determinants pass straight through multiplication. This is why AB = I forces both to be non-zero.',
      },
      { formula: 'det Aᵀ = det A', why: 'So every rule about rows is also true about columns.' },
      {
        formula: 'det(cA) = cⁿ det A',
        why: 'Each of the n rows gets scaled, so c comes out n times. Forgetting the power is the classic slip.',
      },
      {
        formula: 'triangular ⟹ det = product of the diagonal',
        why: 'The reason row-reducing first beats cofactors for anything large.',
      },
      {
        formula: 'A⁻¹ exists ⟺ det A ≠ 0 ⟺ rank A = n',
        why: 'Three ways of saying the same thing. Failing them is called singular.',
      },
      { formula: '[ A | I ] → [ I | A⁻¹ ]', why: 'The moves that turn A into I are the moves that undo A.' },
    ],
    quiz: [
      {
        q: 'A is 3 × 3 with det A = 5. What is det(2A)?',
        options: ['10', '25', '40', '5'],
        answer: 2,
        explain:
          'Doubling the matrix doubles all three rows, and scaling one row multiplies the determinant by that amount. So the 2 comes out three times: 2³ × 5 = 40. In general det(cA) = cⁿ det A.',
      },
      {
        q: 'Which row operation leaves the determinant exactly as it was?',
        options: ['Swapping two rows', 'Multiplying a row by 4', 'Adding 3 times row 1 to row 2', 'All three do'],
        answer: 2,
        explain:
          'A swap flips the sign, and scaling a row scales the determinant. Adding a multiple of one row to another changes nothing at all — which is precisely what makes the row-reduction method for determinants valid.',
      },
      {
        q: 'You row-reduce [A | I] and a row on the left goes to all zeros. What follows?',
        options: [
          'You made an arithmetic slip',
          'det A = 0 and A has no inverse',
          'A⁻¹ is whatever the right half currently holds',
          'You should try expanding along a different row',
        ],
        answer: 1,
        explain:
          'The left half can only become the identity if A has full rank. A zero row means the rank falls short, the determinant is 0, and no inverse exists. The method is reporting a fact, not failing.',
      },
    ],
    exam: [
      {
        q: 'Define the determinant by cofactor expansion, state its main properties, and explain the connection with invertibility.',
        meta: 'Definition, properties and the link to A⁻¹ · 7–8 marks',
        points: [
          'For a 2 × 2 matrix, det A = a₁₁a₂₂ − a₁₂a₂₁. For larger n, expand along any row or column: det A = Σₖ (−1)^(j+k) aⱼₖ Mⱼₖ, where Mⱼₖ is the minor obtained by deleting row j and column k.',
          'The expansion gives the same value along every row and every column; choosing one with many zeros reduces the work.',
          'Properties: det(AB) = det A · det B; det Aᵀ = det A; det(cA) = cⁿ det A; a row interchange changes the sign; scaling a row by c scales the determinant by c; adding a multiple of one row to another leaves it unchanged; two equal rows give 0.',
          'Consequently a matrix can be reduced to triangular form using only the sign-preserving operation, after which det A is the product of the diagonal entries, adjusted by (−1) for each row interchange used.',
          'A is invertible if and only if det A ≠ 0. If AB = I then det A · det B = det I = 1, so neither determinant can vanish.',
          'Equivalently det A = 0 ⟺ rank A < n ⟺ the columns are linearly dependent ⟺ Ax = 0 has a non-trivial solution.',
          'Geometrically |det A| is the volume scale factor of the map x ↦ Ax; a zero determinant means the image is squashed into a lower dimension, so no inverse can exist.',
        ],
      },
    ],
  },

  rank: {
    cheat: [
      {
        formula: 'rank A = non-zero rows in echelon form',
        why: 'A count of genuinely different rows. Copies and combinations collapse to zero.',
      },
      {
        formula: 'rank A ≤ min(m, n)',
        why: 'You can never have more independent rows than you have rows, or columns.',
      },
      {
        formula: 'rank A ≠ rank [A|b] ⟹ no solution',
        why: 'A contradiction row has appeared. The system is inconsistent.',
      },
      {
        formula: 'rank A = rank [A|b] ⟹ consistent',
        why: 'There is at least one answer. How many depends on the free variables.',
      },
      {
        formula: 'free variables = n − rank A',
        why: 'Zero of them means one answer. One or more means endlessly many.',
      },
      {
        formula: 'Ax = 0 always has x = 0',
        why: 'A homogeneous system is never inconsistent. It has others exactly when rank A < n.',
      },
      {
        formula: 'RREF is unique',
        why: 'Which is what makes "the rank" a well-defined number rather than a matter of route.',
      },
    ],
    quiz: [
      {
        q: 'A system has 6 unknowns, rank A = 4 and rank [A|b] = 4. What is the outcome?',
        options: [
          'No solution',
          'Exactly one solution',
          'Endlessly many, with 2 free variables',
          'Endlessly many, with 4 free variables',
        ],
        answer: 2,
        explain:
          'The ranks match, so the system is consistent. Free variables = unknowns − rank = 6 − 4 = 2. Two dials you can set however you like, and every setting gives another genuine answer.',
      },
      {
        q: 'You make row 3 of a matrix an exact copy of row 1. What happens to the rank?',
        options: ['It goes up by one', 'It drops by one', 'It stays the same', 'It goes to zero'],
        answer: 1,
        explain:
          'Row reduction subtracts row 1 from row 3 and the whole row goes to zero. It was never adding information. For a square matrix that also forces the determinant to 0 and kills the inverse.',
      },
      {
        q: 'A homogeneous system Ax = 0 has 7 unknowns and 4 equations. What can you say for certain?',
        options: [
          'It might have no solution',
          'It has exactly one solution',
          'It has solutions other than all-zeros',
          'It depends on the numbers in A',
        ],
        answer: 2,
        explain:
          'All-zeros always works, so it is consistent. The rank cannot exceed 4, and 7 − 4 = 3 at least, so there are at least three free variables. Consistent plus free variables means endlessly many. This is exactly why a model with more parameters than data points has infinitely many equally good fits.',
      },
    ],
    exam: [
      {
        q: 'Define the rank of a matrix and state the conditions under which a linear system has no solution, a unique solution, or infinitely many.',
        meta: 'Definition plus the consistency theorem · 6–8 marks',
        points: [
          'The rank of A is the number of non-zero rows in any row echelon form of A, equivalently the number of pivot positions.',
          'Elementary row operations do not change the rank, and the reduced row echelon form of a matrix is unique, so the rank is well defined.',
          'Given Ax = b with n unknowns, form the augmented matrix [A | b] and compare rank(A) with rank([A | b]).',
          'rank(A) < rank([A | b]): inconsistent. Some row reads 0 = c with c ≠ 0, so no solution exists.',
          'rank(A) = rank([A | b]) = n: unique solution. Every unknown is a pivot variable and is therefore determined.',
          'rank(A) = rank([A | b]) = r < n: infinitely many solutions, with n − r free variables. The general solution is a particular solution plus an arbitrary combination of n − r independent solutions of Ax = 0.',
          'For a homogeneous system b = 0 the ranks always agree, so it is always consistent; it has a non-trivial solution precisely when r < n.',
          'For a square A, rank A = n is equivalent to det A ≠ 0 and to A being invertible.',
        ],
      },
    ],
  },

  lec0a: {
    cheat: [
      {
        formula: '(m × n) · (n × p) = (m × p)',
        why: 'The shape rule for multiplying. The two inner numbers must match, and then they vanish.',
      },
      {
        formula: 'cⱼₖ = Σₗ aⱼₗ bₗₖ',
        why: 'Row j of the left meets column k of the right: multiply the pairs and add them up.',
      },
      { formula: 'AB ≠ BA', why: 'Order is part of the meaning. Often one of the two does not even exist.' },
      { formula: '(AB)ᵀ = BᵀAᵀ,  (AB)⁻¹ = B⁻¹A⁻¹', why: 'Transposing or undoing a product reverses the order.' },
      {
        formula: 'A = Aᵀ symmetric,  A = −Aᵀ skew',
        why: 'Skew forces zeros down the diagonal, since only 0 is its own negative.',
      },
      {
        formula: 'xᵀAx > 0 for all x ≠ 0',
        why: 'Positive definite. For a 2 × 2, check the top-left entry and det A are both above zero.',
      },
      {
        formula: 'det A = ad − bc  (2 × 2)',
        why: 'The signed area of the box the two columns make. Zero area, no inverse.',
      },
      {
        formula: 'det A = Σⱼ (−1)^(j+k) aⱼₖ Mⱼₖ',
        why: 'Cofactor expansion, along any row or column. Pick the one with the most zeros.',
      },
      {
        formula: 'det(AB) = det A · det B,  det Aᵀ = det A',
        why: 'Determinants sail straight through multiplication and through transposing.',
      },
      {
        formula: 'swap ⟹ −det,  scale by c ⟹ c·det,  Rᵢ + βRⱼ ⟹ det unchanged',
        why: 'The three row moves and what each does. The third is why row-reducing to triangular is safe.',
      },
      { formula: 'triangular ⟹ det = product of the diagonal', why: 'The fast route for anything bigger than 3 × 3.' },
      {
        formula: '[ A | I ] → [ I | A⁻¹ ]',
        why: 'Row-reduce both halves together and the inverse appears on the right.',
      },
      {
        formula: 'rank = non-zero rows in echelon form',
        why: 'A count of genuinely different rows. Copies collapse to zero.',
      },
      {
        formula: 'rank A ≠ rank [A|b] ⟹ no solution',
        why: 'The ranks matching is exactly what "consistent" means.',
      },
      {
        formula: 'free variables = n − rank',
        why: 'Ranks match and this is 0 → one answer. Ranks match and this is more than 0 → endlessly many.',
      },
      {
        formula: 'Ax = 0 always has x = 0',
        why: 'A homogeneous system can never be inconsistent. The question is only whether there are others.',
      },
    ],
    quiz: [
      {
        q: 'A is 3 × 4 and B is 4 × 2. Which products are defined?',
        options: ['AB only', 'BA only', 'Both AB and BA', 'Neither'],
        answer: 0,
        explain:
          'AB works: the 4 columns of A meet the 4 rows of B, giving a 3 × 2 answer. BA would need the 2 columns of B to meet the 3 rows of A, and 2 ≠ 3, so it does not exist at all. This is the usual case — swapping the order often does not even give you a question, let alone a different answer.',
      },
      {
        q: 'AB comes out as a matrix of all zeros. What can you conclude?',
        options: [
          'A must be the zero matrix',
          'B must be the zero matrix',
          'At least one of them must be the zero matrix',
          'Nothing — neither of them has to be zero',
        ],
        answer: 3,
        explain:
          'With ordinary numbers ab = 0 forces one of them to be 0. Matrices do not obey that. A = [1 1; 2 2] and B = [−1 1; 1 −1] are both far from zero, but AB is all zeros. The same failure means you cannot cancel: AB = AC does not give B = C.',
      },
      {
        q: 'Which of these is the transpose rule for a product?',
        options: ['(AB)ᵀ = AᵀBᵀ', '(AB)ᵀ = BᵀAᵀ', '(AB)ᵀ = (BA)ᵀ', '(AB)ᵀ = AB'],
        answer: 1,
        explain:
          'You transpose each one and reverse the order. Keeping the order gives AᵀBᵀ, which usually does not even have shapes that fit together. Socks then shoes is undone by shoes then socks — the same reversal shows up for inverses.',
      },
      {
        q: 'A matrix is skew-symmetric, so A = −Aᵀ. What must be true of its diagonal?',
        options: [
          'Every diagonal entry is 1',
          'Every diagonal entry is 0',
          'The diagonal entries add up to 1',
          'Nothing in particular',
        ],
        answer: 1,
        explain:
          'A diagonal entry sits in the mirror line, so the rule forces aᵢᵢ = −aᵢᵢ. The only number equal to minus itself is zero, so the whole diagonal has to be zeros.',
      },
      {
        q: 'For A = [2 6; 6 18], the quadratic form works out as 2(x₁ + 3x₂)². What is A?',
        options: ['Positive definite', 'Positive semi-definite', 'Negative definite', 'Indefinite'],
        answer: 1,
        explain:
          'A square is never negative, so xᵀAx is never below zero — but it hits exactly zero along the whole line x₁ = −3x₂, not just at the origin. "Definite" would need it above zero everywhere except the origin. Being zero somewhere else makes it semi-definite. Its determinant is 2·18 − 36 = 0, which is the same fact stated differently.',
      },
      {
        q: 'Which of the three row moves is not allowed?',
        options: [
          'Swapping two rows',
          'Multiplying a row by 0',
          'Multiplying a row by −3',
          'Adding 5 times row 1 to row 2',
        ],
        answer: 1,
        explain:
          'Multiplying by 0 wipes the row out and destroys the information in it, so the tidied system no longer means the same thing. Any other number is fine. Note that swapping two columns is also banned — but for a different reason: columns are the unknowns, so swapping them renames your variables mid-calculation.',
      },
      {
        q: 'How many different reduced row echelon forms can one matrix have?',
        options: [
          'Exactly one',
          'One for each order you do the moves in',
          'As many as there are rows',
          'It depends on the rank',
        ],
        answer: 0,
        explain:
          'There are many row echelon forms — the staircase depends on which moves you pick. But there is exactly one reduced row echelon form, whatever route you take. That uniqueness is what lets rank be defined at all: if different routes gave different counts of non-zero rows, "the rank" would mean nothing.',
      },
      {
        q: 'You row-reduce a 4 × 4 matrix and one row ends up all zeros. What is the rank?',
        options: ['4', '3', 'You cannot tell without knowing the numbers', '0'],
        answer: 1,
        explain:
          'Rank counts the non-zero rows left after tidying up. Three survive, so the rank is 3. That also tells you the determinant is 0 and there is no inverse — one row was a mixture of the others and was never saying anything new.',
      },
      {
        q: 'det A = 5. What is det(2A) if A is 3 × 3?',
        options: ['10', '20', '40', '5'],
        answer: 2,
        explain:
          'Scaling a single row multiplies the determinant by that amount. Doubling the whole matrix doubles all three rows, so the factor of 2 comes out three times: 2³ × 5 = 40. In general det(cA) = cⁿ det A for an n × n matrix, and forgetting the power is the classic slip.',
      },
      {
        q: 'Which row move leaves the determinant completely unchanged?',
        options: ['Swapping two rows', 'Multiplying a row by 3', 'Adding 5 times row 1 to row 2', 'None of them'],
        answer: 2,
        explain:
          'A swap flips the sign and scaling scales it, but adding a multiple of one row to another leaves it exactly as it was. That is the licence for the whole row-reduction method: reduce to triangular using only this move, then just multiply the diagonal.',
      },
      {
        q: 'You are working out a 4 × 4 determinant by cofactor expansion. Which row or column should you expand along?',
        options: [
          'Always the first row',
          'The one with the most zeros',
          'The one with the largest numbers',
          'It must be a row, never a column',
        ],
        answer: 1,
        explain:
          'Any row or column gives the same answer, so choose the cheapest. Each zero entry kills a whole 3 × 3 determinant you would otherwise have to work out. A column with three zeros turns four smaller determinants into one.',
      },
      {
        q: 'You row-reduce [A | I] and a row of the left half goes to all zeros. What does that tell you?',
        options: [
          'You made an arithmetic mistake',
          'A has no inverse',
          'A⁻¹ is the right half as it stands',
          'You need to swap two columns',
        ],
        answer: 1,
        explain:
          'The left half can only become the identity if A has full rank. A zero row means the rank is short, the determinant is 0, and no inverse exists. The method is being honest rather than failing — it never invents an answer.',
      },
      {
        q: 'A system has 5 unknowns, rank A = 3 and rank [A|b] = 3. What is the outcome?',
        options: [
          'No solution',
          'Exactly one solution',
          'Endlessly many, with 2 free variables',
          'Endlessly many, with 3 free variables',
        ],
        answer: 2,
        explain:
          'The ranks match, so there is at least one answer. The number of free variables is (unknowns − rank) = 5 − 3 = 2. Two free variables means two dials you can set however you like, and every setting gives another valid answer.',
      },
      {
        q: 'A homogeneous system Ax = 0 has more unknowns than equations. What can you say?',
        options: [
          'It might have no solution',
          'It has exactly one solution',
          'It has endlessly many solutions',
          'You cannot tell without the numbers',
        ],
        answer: 2,
        explain:
          'Homogeneous systems can never be inconsistent — all-zeros always works. The rank cannot be bigger than the number of equations, so with more unknowns than equations there must be at least one free variable. Free variable plus consistent means endlessly many. This is exactly why an underdetermined model has infinitely many equally good fits.',
      },
      {
        q: 'You fit y = w₁x₁ + w₂x₂ + b to four houses and the system turns out to be inconsistent. What does that mean about the data?',
        options: [
          'One of the prices was typed in wrong',
          'No rule of that form fits all four houses exactly',
          'You need a fifth house',
          'The matrix is not square',
        ],
        answer: 1,
        explain:
          'The four houses contradict each other under that model. It does not mean anyone made a mistake — real data almost always does this, because prices depend on things you did not measure. With three unknowns you need at least four rows before disagreement is even possible; after that it is the normal case, and the usual response is to stop demanding an exact fit and find the weights that come closest instead.',
      },
    ],
    exam: [
      {
        q: 'Define the rank of a matrix and explain how it decides the number of solutions of a linear system.',
        meta: 'Definition plus the consistency theorem · 6–8 marks',
        points: [
          'Rank of A is the number of non-zero rows in any row echelon form of A; equivalently the number of pivots.',
          'It is invariant under elementary row operations, and the RREF of a matrix is unique, so the rank is well defined.',
          'Form the augmented matrix [A | b] and compare rank(A) with rank([A | b]).',
          'If rank(A) < rank([A | b]) the system is inconsistent: some row reads 0 = c with c ≠ 0, so there is no solution.',
          'If rank(A) = rank([A | b]) = r the system is consistent. With n unknowns, the number of free variables is n − r.',
          'r = n gives a unique solution; r < n gives infinitely many, parameterised by the n − r free variables.',
          'A homogeneous system is always consistent, since x = 0 satisfies it; it has a non-trivial solution precisely when r < n.',
        ],
      },
      {
        q: 'State the elementary row operations and justify why they do not change the solution set of a linear system.',
        meta: 'Bookwork with justification · 5–6 marks',
        points: [
          'Rᵢ ↔ Rⱼ: interchange two rows.',
          'Rₖ ← αRₖ with α ≠ 0: multiply a row by a non-zero scalar.',
          'Rᵢ ← Rᵢ + βRⱼ: add a scalar multiple of one row to another.',
          'Each corresponds to a legitimate manipulation of the equations themselves: reordering them, scaling both sides, or adding one true equation to another.',
          'Each is reversible, so the original system can be recovered; hence the two systems have identical solution sets and are called row equivalent.',
          'The restriction α ≠ 0 is essential — scaling by zero destroys an equation and loses information.',
          'The operations must be applied to rows of the augmented matrix, not to columns: columns correspond to the variables, so a column interchange relabels the unknowns.',
        ],
      },
      {
        q: 'State the properties of determinants and use them to evaluate det(BCD) where B = 2A, C = Aᵀ, D = A⁻¹ for a 3 × 3 matrix A with det A = 3.',
        meta: 'Properties applied to a standard exam calculation · 6 marks',
        points: [
          'Properties: det(AB) = det A · det B; det Aᵀ = det A; det(A⁻¹) = 1/det A; scaling one row by c multiplies the determinant by c; a row interchange changes the sign; two identical rows give determinant 0.',
          'det(2A) = 2³ det A because each of the three rows is scaled by 2; so det B = 8 × 3 = 24.',
          'det C = det(Aᵀ) = det A = 3.',
          'det D = det(A⁻¹) = 1/det A = 1/3, which is well defined since det A ≠ 0.',
          'By multiplicativity, det(BCD) = det B · det C · det D = 24 × 3 × 1/3 = 24.',
          'Note the common error: writing det(2A) = 2 det A rather than 2ⁿ det A.',
        ],
      },
      {
        q: 'Explain how to compute A⁻¹ by the augmented-matrix method, and state when the method fails.',
        meta: 'Method plus the failure condition · 5–6 marks',
        points: [
          'Form the n × 2n augmented matrix [A | I].',
          'Apply Gauss–Jordan elimination to reduce the left block to reduced row echelon form.',
          'If the left block reduces to I, the right block is A⁻¹; verify with AA⁻¹ = A⁻¹A = I.',
          'Justification: the row operations correspond to left multiplication by elementary matrices E, so E[A | I] = [EA | E]; if EA = I then E = A⁻¹.',
          'The method fails exactly when rank(A) < n, equivalently det A = 0: a zero row appears in the left block and it can never become I.',
          'Only square matrices have inverses, and A⁻¹ is unique when it exists.',
          'For 2 × 2 the closed form A⁻¹ = (1/(ad − bc))[d −b; −c a] is quicker; note (AB)⁻¹ = B⁻¹A⁻¹.',
        ],
      },
      {
        q: 'Define a positive definite matrix and determine the values of a for which A = [2 −1 0; −1 a −1; 0 −1 2] is positive definite.',
        meta: 'Definition plus the leading-minor test · 6 marks',
        points: [
          'A symmetric matrix A is positive definite if xᵀAx > 0 for every non-zero vector x.',
          'Sylvester’s criterion: A is positive definite if and only if every leading principal minor is strictly positive.',
          'First minor: 2 > 0, satisfied for all a.',
          'Second minor: det[2 −1; −1 a] = 2a − 1 > 0, requiring a > 1/2.',
          'Third minor: det A = 2(2a − 1) − (−1)(−2) = 4a − 4 > 0, requiring a > 1.',
          'All three hold simultaneously precisely when a > 1.',
          'For a > 1, det A = 4a − 4 ≠ 0, so A is non-singular; in general every positive definite matrix is invertible because its determinant is a product of positive eigenvalues.',
        ],
      },
      {
        q: 'A dataset of house prices is modelled by y = w₁x₁ + w₂x₂ + b. Explain how this becomes a linear system, and discuss what happens as the number of data points grows.',
        meta: 'Modelling question linking the lecture to machine learning · 6–8 marks',
        points: [
          'Each observation (x₁, x₂, y) substituted into the model yields one linear equation in the unknowns w₁, w₂, b.',
          'With m observations this gives an m × 3 coefficient matrix A, unknown vector w = (w₁, w₂, b)ᵀ and right-hand side y, so Aw = y.',
          'With three consistent observations the system has a unique solution; for the lecture’s data w₁ = 3, w₂ = 2, b = 1.',
          'With m > 3 the system is overdetermined: rank(A) ≤ 3 < m, and generically rank(A) < rank([A | y]), so no exact solution exists.',
          'The standard remedy is least squares: minimise ‖Aw − y‖², whose solution satisfies the normal equations AᵀAw = Aᵀy.',
          'If two features are linearly dependent — for example the same measurement in different units — rank(A) < 3, AᵀA is singular, and the individual weights are not identifiable.',
          'This is the motivation for regularisation, which restores a unique solution by adding a term that makes the system non-singular.',
        ],
      },
    ],
  },

  dotproduct: {
    cheat: [
      {
        formula: '⟨a, b⟩ = aᵀb = Σᵢ aᵢbᵢ',
        why: 'Multiply matching parts, add them up. Two vectors in, one plain number out.',
      },
      {
        formula: 'sign of a·b',
        why: 'Positive: leaning the same way. Negative: opposite ways. Zero: at right angles.',
      },
      { formula: '⟨ku + lv, w⟩ = k⟨u,w⟩ + l⟨v,w⟩', why: 'Linearity — you may split sums and pull plain numbers out.' },
      { formula: '⟨u, v⟩ = ⟨v, u⟩', why: 'Symmetry. Unlike matrix multiplication, the order makes no difference.' },
      { formula: '⟨u, u⟩ ≥ 0, = 0 only for u = 0', why: 'What makes the square root in the norm always safe to take.' },
      { formula: '‖a‖ = √⟨a, a⟩', why: 'Length. Pythagoras, and it keeps working past three dimensions.' },
      { formula: '|⟨a, b⟩| ≤ ‖a‖‖b‖', why: 'Cauchy–Schwarz. Equality only when the two lie along each other.' },
      {
        formula: '‖a + b‖ ≤ ‖a‖ + ‖b‖',
        why: 'Triangle inequality. Straight there is never further than via a corner.',
      },
      {
        formula: 'α = cos⁻¹(⟨a,b⟩ / (‖a‖‖b‖))',
        why: 'The angle. Cauchy–Schwarz is what keeps the fraction inside [−1, 1].',
      },
      { formula: '⟨a, b⟩ = 0 ⟺ orthogonal', why: 'The test you actually use — no angle needs working out.' },
      { formula: 'v = (v₂ᵀv₁ / v₁ᵀv₁) v₁', why: 'The projection of v₂ onto v₁ — its shadow on that line.' },
      {
        formula: 'u = v₂ − v, with u·v₁ = 0',
        why: 'The leftover, perpendicular by construction. Model-fitting calls it the residual.',
      },
    ],
    quiz: [
      {
        q: 'What kind of thing is a·b?',
        options: ['A vector', 'A matrix', 'A single number', 'It depends on the dimension'],
        answer: 2,
        explain:
          'Always one plain number, whatever the dimension. That is why you cannot chain it — a·b·c is meaningless, because after the first dot product you no longer have a vector to work with.',
      },
      {
        q: 'Two vectors have a dot product of zero. What does that mean?',
        options: [
          'One of them is the zero vector',
          'They point the same way',
          'They are at right angles',
          'They have the same length',
        ],
        answer: 2,
        explain:
          'Zero dot product means orthogonal. It can also happen if one is the zero vector, but for two genuine vectors it means exactly 90°. This is the check you use in practice, because it costs a few multiplications and needs no arccos.',
      },
      {
        q: 'Why does cosine similarity divide by both norms instead of just using the dot product?',
        options: [
          'To make the arithmetic faster',
          'To strip out length, so only direction is compared',
          'To make the answer positive',
          'To satisfy the triangle inequality',
        ],
        answer: 1,
        explain:
          'A long vector has a big dot product with almost anything, so raw dot products confuse "similar" with "large". Dividing by both lengths leaves only the angle, which is what carries the meaning — a long document and a short one about the same topic should count as similar.',
      },
    ],
    exam: [
      {
        q: 'Define the inner product and norm, state the Cauchy–Schwarz inequality, and explain its role in defining the angle between two vectors.',
        meta: 'Definitions plus the logical dependency · 6 marks',
        points: [
          'For a, b ∈ ℝⁿ the inner product is ⟨a, b⟩ = aᵀb = Σᵢ aᵢbᵢ.',
          'It is linear in its first argument, symmetric, and positive definite: ⟨u, u⟩ ≥ 0 with equality only for u = 0.',
          'The norm is ‖a‖ = √⟨a, a⟩, which is well defined precisely because ⟨a, a⟩ is never negative.',
          'Cauchy–Schwarz: |⟨a, b⟩| ≤ ‖a‖‖b‖, with equality if and only if a and b are linearly dependent.',
          'Consequently −1 ≤ ⟨a, b⟩/(‖a‖‖b‖) ≤ 1, so the quantity lies in the domain of cos⁻¹.',
          'The angle is therefore defined as α = cos⁻¹(⟨a, b⟩/(‖a‖‖b‖)); without Cauchy–Schwarz this expression need not exist.',
          'a and b are orthogonal when ⟨a, b⟩ = 0, equivalently α = π/2.',
        ],
      },
    ],
  },

  covariance: {
    cheat: [
      { formula: 'μ = E[X] = Σ x p(x)', why: 'The balance point of a distribution. Need not be a value X can take.' },
      {
        formula: 'σ² = E[(X − μ)²]',
        why: 'Average squared distance from the mean. Squaring stops the signs cancelling.',
      },
      { formula: 'σ = √σ²', why: 'Standard deviation. Back in the original units, so it is the one to quote.' },
      {
        formula: 'divide by n or by n − 1',
        why: 'n describes the collection you have; n − 1 treats it as a sample from something bigger.',
      },
      {
        formula: 'cov(X,Y) = E[(X − μₓ)(Y − μᵧ)]',
        why: 'One product per point. Both above or both below their means gives a positive contribution.',
      },
      { formula: 'cov(X, X) = σ²', why: 'Variance is just covariance of a variable with itself — the same formula.' },
      {
        formula: 'corr = cov / (σₓ σᵧ)',
        why: 'Divides the units out and forces the answer into [−1, 1], so it can be compared across pairs.',
      },
      {
        formula: 'cov ≈ 0 does not mean unrelated',
        why: 'It only rules out a straight-line pattern. An arch has an obvious relationship and near-zero covariance.',
      },
    ],
    quiz: [
      {
        q: 'Why does variance square the distances from the mean?',
        options: [
          'To make the number bigger',
          'Because the signed distances always add to exactly zero',
          'To keep the units the same as the data',
          'Because squaring is faster to compute',
        ],
        answer: 1,
        explain:
          'The deviations above the mean exactly cancel the ones below, every time — their sum is always 0. Squaring removes the signs and makes far-away values count for more. It does change the units, which is why the standard deviation takes the root afterwards.',
      },
      {
        q: 'Two variables have a covariance of 480. Is that a strong relationship?',
        options: [
          'Yes, it is a large number',
          'No, it is too small',
          'You cannot tell — covariance carries units, so its size means nothing on its own',
          'Only if both variances are also 480',
        ],
        answer: 2,
        explain:
          'Covariance is measured in (units of X)×(units of Y). Switch from metres to centimetres and it changes by a factor of 10,000 with nothing real having changed. To judge strength you divide by both standard deviations, giving a correlation between −1 and 1.',
      },
      {
        q: 'Points lie on a perfect symmetric arch. What does the covariance come out as?',
        options: ['Strongly positive', 'Strongly negative', 'Close to zero, despite the obvious pattern', 'Exactly 1'],
        answer: 2,
        explain:
          'Covariance only detects straight-line association. On the rising half the products are positive, on the falling half they are negative, and they cancel. So near-zero covariance means "no linear pattern", not "no relationship" — which is why you always look at the scatter plot as well.',
      },
    ],
    exam: [
      {
        q: 'Define variance and covariance, and discuss the interpretation and limitations of covariance.',
        meta: 'Definitions plus critical interpretation · 6–8 marks',
        points: [
          'Variance: σ² = E[(X − μ)²], where μ = E[X]. From data it is (1/n)Σ(xᵢ − x̄)², or with divisor n − 1 for a sample estimate.',
          'Squaring is necessary because Σ(xᵢ − x̄) = 0 identically, so the unsquared deviations carry no information about spread.',
          'The standard deviation σ = √σ² restores the original units and is the quantity normally reported.',
          'Covariance: cov(X, Y) = E[(X − E[X])(Y − E[Y])], computed as (1/n)Σ(xᵢ − x̄)(yᵢ − ȳ).',
          'Note cov(X, X) = σ², so variance is the special case of covariance of a variable with itself.',
          'Interpretation: the sign indicates the direction of linear association — positive when observations tend to lie on the same side of both means.',
          'Limitation 1: the magnitude depends on the units of both variables and so is not comparable across pairs; dividing by σₓσᵧ gives the correlation, which lies in [−1, 1].',
          'Limitation 2: it detects only linear association. A symmetric non-linear relationship can give covariance zero despite strong dependence, so zero covariance does not imply independence.',
        ],
      },
    ],
  },

  vectorspace: {
    cheat: [
      {
        formula: '+ : 𝒱 × 𝒱 → 𝒱',
        why: 'The inner operation. Two members in, one member out — the arrow is the closure requirement.',
      },
      {
        formula: '· : ℝ × 𝒱 → 𝒱',
        why: 'The outer operation. A plain number and a member in, a member out. The number lives outside the set.',
      },
      {
        formula: '(𝒱, +) is an Abelian group',
        why: 'Closed, associative, has 0, has negatives, and x + y = y + x. Half the definition in one clause.',
      },
      {
        formula: 'λ(x+y) = λx + λy,  (λ+ψ)x = λx + ψx',
        why: 'Distributivity both ways. Stretching spreads over adding vectors and over adding scalars.',
      },
      {
        formula: 'λ(ψx) = (λψ)x,  1x = x',
        why: 'The other two rules for the outer operation. Easy to forget, easy to break in a made-up example.',
      },
      {
        formula: 'ℝⁿ · ℝᵐˣⁿ · polynomials',
        why: 'All vector spaces. Nothing in the definition says a vector has to be a column.',
      },
      {
        formula: 'U ⊆ V subspace ⟺ U ≠ ∅,  x+y ∈ U,  λx ∈ U',
        why: 'The short test. U inherits every other rule from V, so only closure can go wrong.',
      },
      {
        formula: 'U ≠ ∅ and λx ∈ U ⟹ 0 ∈ U',
        why: 'Take λ = 0. Any set missing the origin is out at once, however straight it looks.',
      },
      {
        formula: '{x : Ax = 0} is a subspace',
        why: 'The nullspace. Non-empty since x = 0 works, and both closures follow from A being linear.',
      },
      {
        formula: 'Ax = b, Ay = b ⟹ A(x+y) = 2b',
        why: 'Why b ≠ 0 gives no space. The solution set is a shifted copy of the nullspace, and the shift breaks it.',
      },
    ],
    quiz: [
      {
        q: 'Which of these is a subspace of ℝ²?',
        options: [
          'The line y = x + 1',
          'The line y = 2x',
          'The square −1 ≤ x, y ≤ 1',
          'The first quadrant x ≥ 0, y ≥ 0',
        ],
        answer: 1,
        explain:
          'y = 2x passes through the origin and both closures hold — add two of its points or stretch one and you stay on it. The shifted line misses the origin. The square is bounded, so stretching escapes it. The quadrant is closed under adding but not under scaling by a negative number.',
      },
      {
        q: 'A subset U of a vector space is non-empty and closed under scalar multiplication. What follows?',
        options: ['Nothing in particular', '0 ∈ U, by taking λ = 0', 'U is a subspace', 'U is closed under addition'],
        answer: 1,
        explain:
          'Pick any x in U and scale it by 0. The result is the zero vector, and closure says it must be in U. This is why "contains the origin" is a consequence of the test, not a fourth thing to check — and why a set missing the origin fails immediately.',
      },
      {
        q: 'Why is the set of 2 × 2 matrices a vector space?',
        options: [
          'It is not — vectors have to be columns',
          'Because matrix addition and scalar multiplication are element-wise and never leave the set',
          'Because matrices can be multiplied together',
          'Only if the matrices are invertible',
        ],
        answer: 1,
        explain:
          'The definition asks for one operation that adds two members and one that scales a member, plus some ordinary rules. Element-wise addition and scaling supply both. Matrix multiplication is irrelevant here — it is not one of the two operations. Note the invertible matrices are not a space: their sum can be singular.',
      },
      {
        q: 'Why do the solutions of Ax = b form a vector space only when b = 0?',
        options: [
          'Because b ≠ 0 makes the system inconsistent',
          'Because Ax = b and Ay = b give A(x + y) = 2b, which is not b unless b = 0',
          'Because only b = 0 gives a unique solution',
          'Because b ≠ 0 systems have too many answers',
        ],
        answer: 1,
        explain:
          'Adding two solutions doubles the right-hand side, so the set is not closed under addition. It also fails to contain 0, since A0 = 0 ≠ b. With b = 0 both problems disappear, and the solution set is the nullspace.',
      },
    ],
    exam: [
      {
        q: 'Define a real-valued vector space, state the test for a subset to be a subspace, and explain why the test is shorter than the definition.',
        meta: 'Definition plus the subspace criterion · 6–8 marks',
        points: [
          'A real-valued vector space is V = (𝒱, +, ·) with an inner operation + : 𝒱 × 𝒱 → 𝒱 and an outer operation · : ℝ × 𝒱 → 𝒱.',
          '(𝒱, +) must be an Abelian group: closed, associative, commutative, with neutral element the zero vector 0 = [0, …, 0]ᵀ and an inverse −x for each x.',
          'Distributivity: λ·(x + y) = λ·x + λ·y and (λ + ψ)·x = λ·x + ψ·x.',
          'Associativity of the outer operation: λ·(ψ·x) = (λψ)·x. Neutral element of the outer operation: 1·x = x.',
          'Examples include ℝⁿ, the m × n matrices under element-wise operations, and the polynomials of bounded degree.',
          'Subspace test: a non-empty U ⊆ 𝒱 is a subspace if λx ∈ U for all λ ∈ ℝ, x ∈ U, and x + y ∈ U for all x, y ∈ U.',
          'The test is shorter because associativity, commutativity, distributivity and the neutral element are universally quantified over 𝒱, hence hold automatically on any subset. Only closure can be lost by passing to a subset.',
          'Non-emptiness with closure under scaling gives 0 ∈ U, taking λ = 0. Hence any subset avoiding the origin fails.',
          'Illustrations in ℝ²: the y-axis is a subspace; the line x = 1 is not, since scaling leaves it; the square −1 ≤ x, y ≤ 1 is not, since 2·(1,1) = (2,2) lies outside.',
        ],
      },
      {
        q: 'Show that the nullspace {x : Ax = 0} is a vector subspace, and explain why the solution set of Ax = b with b ≠ 0 is not.',
        meta: 'Verification against the three-part test · 5–6 marks',
        points: [
          'Non-empty: A0 = 0, so the zero vector always lies in the nullspace.',
          'Closed under addition: Ax = 0 and Ay = 0 give A(x + y) = Ax + Ay = 0.',
          'Closed under scaling: Ax = 0 gives A(λx) = λ(Ax) = 0 for every λ ∈ ℝ.',
          'All three conditions of the subspace test hold, so the nullspace is a subspace of ℝⁿ.',
          'For b ≠ 0, if Ax = b and Ay = b then A(x + y) = 2b ≠ b, so the solution set is not closed under addition.',
          'Similarly A(λx) = λb ≠ b unless λ = 1, and 0 is not in the set since A0 = 0 ≠ b.',
          'Structurally the solution set is x_p + N(A), a translate of the nullspace by any particular solution. Translation destroys both closures unless the translation is by 0.',
        ],
      },
    ],
  },

  basis: {
    cheat: [
      {
        formula: 'span{x₁,…,xₖ} = { Σ λᵢxᵢ }',
        why: 'Everything reachable by mixing. Always a subspace, and the smallest one holding all the xᵢ.',
      },
      {
        formula: '0 = Σ λᵢxᵢ with some λᵢ ≠ 0 ⟹ dependent',
        why: 'Dependence. Independence is the denial: only the all-zeros mixture reaches 0.',
      },
      {
        formula: 'any set containing 0 is dependent',
        why: 'Give the zero vector a non-zero λ and everything else zero. This is why the definition is written the awkward way.',
      },
      {
        formula: 'all non-zero: dependent ⟺ one is a mixture of the others',
        why: 'The readable version of the definition, valid only once the zero vector is ruled out.',
      },
      {
        formula: 'columns → REF → all pivots ⟺ independent',
        why: 'The test you actually run. Non-pivot columns are mixtures of the pivots to their left.',
      },
      {
        formula: 'm vectors from k ingredients, m > k ⟹ dependent',
        why: 'At most k pivots across m columns leaves a spare column, every time. No arithmetic needed.',
      },
      {
        formula: 'generating set: every v ∈ V is a mixture of it',
        why: 'Reaches everything. May be far bigger than it needs to be.',
      },
      {
        formula: 'basis = independent generating set',
        why: 'Also: minimal generating set, and maximal independent set. All three describe the same thing.',
      },
      {
        formula: 'x = Σ λᵢbᵢ uniquely',
        why: 'Coefficients over a basis are one of a kind. Σλᵢbᵢ = Σψᵢbᵢ forces λᵢ = ψᵢ.',
      },
      {
        formula: 'dim V = number of vectors in a basis',
        why: 'The same count for every basis of the space, so it belongs to the space and not to your choice.',
      },
      {
        formula: 'dim ≠ number of components',
        why: 'span{(0,1)} sits in ℝ² and has dimension 1. Its vectors are still written with two numbers.',
      },
      {
        formula: 'U ⊆ V ⟹ dim U ≤ dim V, equal only if U = V',
        why: 'A subspace cannot be larger, and cannot match without being the whole thing.',
      },
      {
        formula: 'basis of a span: columns → REF → keep the pivot vectors',
        why: 'The three-step recipe. Keep your original vectors, not the reduced columns.',
      },
    ],
    quiz: [
      {
        q: 'Two vectors in ℝ² are dragged until one is exactly twice the other. What happens to their span?',
        options: [
          'It stays the whole plane',
          'It collapses to a line through the origin',
          'It becomes just the origin',
          'It becomes a half-plane',
        ],
        answer: 1,
        explain:
          'Every mixture c₁v₁ + c₂v₂ now reduces to a single multiple of v₁, so you can only reach points along that one direction. Two vectors span the plane exactly when they are independent.',
      },
      {
        q: 'A set of vectors includes the zero vector. What can you say straight away?',
        options: ['It is independent', 'It is dependent', 'It depends on the other vectors', 'It is a basis'],
        answer: 1,
        explain:
          'Give the zero vector any non-zero coefficient and everything else zero. The mixture is 0, and it is non-trivial, so the set is dependent. This case is exactly why "one is a mixture of the others" is not used as the definition.',
      },
      {
        q: 'You build 5 vectors as combinations of 3 independent ingredients. Are the 5 independent?',
        options: [
          'Yes',
          'No, whatever the coefficients are',
          'It depends on the coefficients',
          'Only if the ingredients are orthogonal',
        ],
        answer: 1,
        explain:
          'The coefficient matrix is 3 × 5, so it has at most 3 pivots and at least two columns are not pivots. Each of those gives a non-trivial mixture reaching zero. More vectors than ingredients is always dependent.',
      },
      {
        q: 'Three linearly independent vectors in ℝ⁴. Are they a basis of ℝ⁴?',
        options: [
          'Yes — independence is what a basis needs',
          'No — they cannot span a 4-dimensional space',
          'Yes, if none of them is zero',
          'Only if they are mutually orthogonal',
        ],
        answer: 1,
        explain:
          'A basis has to do two jobs: reach everything and carry nothing spare. These do the second job perfectly and fail the first, since three vectors can never span a space of dimension 4.',
      },
      {
        q: 'What is the dimension of span{(0,1)} inside ℝ²?',
        options: ['2, because each vector has two components', '1', '0', 'Undefined'],
        answer: 1,
        explain:
          'The basis is the single vector (0,1), so the dimension is 1 — even though everything in the space is written with two numbers. Dimension counts basis vectors, not components.',
      },
      {
        q: 'You reduce the matrix of spanning vectors and find pivots in columns 1 and 3. What is a basis of the span?',
        options: [
          'The reduced columns 1 and 3',
          'The original vectors x₁ and x₃',
          'All the original vectors',
          'The non-zero rows of the reduced matrix',
        ],
        answer: 1,
        explain:
          'Elimination only tells you which of your vectors to keep. The reduced columns are not vectors from your space, so the basis is your original x₁ and x₃, and the dimension of the span is 2.',
      },
    ],
    exam: [
      {
        q: 'Define linear combination, span and linear independence, and describe how Gaussian elimination is used to test a set of vectors.',
        meta: 'Definitions plus method · 6–8 marks',
        points: [
          'For x₁, …, xₖ in a vector space V, a linear combination is v = λ₁x₁ + ⋯ + λₖxₖ with λᵢ ∈ ℝ.',
          'The span of {x₁, …, xₖ} is the set of all such combinations. It is always a subspace of V, and it is the smallest subspace containing every xᵢ.',
          'The vectors are linearly dependent if 0 = Σλᵢxᵢ for some choice with at least one λᵢ ≠ 0, and linearly independent otherwise.',
          'The trivial combination with all λᵢ = 0 always gives 0, so only non-trivial combinations carry information.',
          'Special cases: any set containing the zero vector is dependent; among non-zero vectors, dependence holds if and only if one is a combination of the others.',
          'Method: write the vectors as the columns of a matrix and reduce to row echelon form. The vectors are independent precisely when every column is a pivot column.',
          'Each non-pivot column is a combination of the pivot columns to its left, with coefficients read from the reduced form, so the method also identifies which vectors are redundant.',
          'Counting argument: m vectors expressed over k independent ingredients give a k × m coefficient matrix with at most k pivots, so m > k forces dependence.',
        ],
      },
      {
        q: 'Define generating set, basis and dimension, state the equivalent characterizations of a basis, and give the procedure for finding a basis of a span.',
        meta: 'Definitions, equivalences and method · 8 marks',
        points: [
          '𝒜 = {x₁, …, xₖ} ⊆ 𝒱 is a generating set of V if every v ∈ V is a linear combination of its members; the set of all such combinations is the span, and V = span[𝒜].',
          'A generating set is minimal if no proper subset of it still spans V. Every linearly independent generating set is minimal and is called a basis.',
          'Equivalent characterizations: ℬ is a basis; ℬ is a minimal generating set; ℬ is a maximal linearly independent set, so adjoining any further vector makes it dependent; every x ∈ V has a unique expansion over ℬ.',
          'Uniqueness of coefficients: if Σλᵢbᵢ = Σψᵢbᵢ then subtracting gives Σ(λᵢ − ψᵢ)bᵢ = 0, and independence forces λᵢ = ψᵢ for every i.',
          'A basis is not unique. ℝ³ admits the canonical basis, and also (1,0,0), (1,1,0), (1,1,1), among infinitely many others.',
          'The dimension dim V is the number of vectors in a basis; this is well defined because all bases of V have the same size.',
          'dim V is not the number of components of its vectors: span{(0,1)} ⊆ ℝ² has dimension 1 while its vectors have two components.',
          'If U ⊆ V then dim U ≤ dim V, with equality if and only if U = V.',
          'To find a basis of U = span{x₁, …, xₘ} ⊆ ℝⁿ: write the spanning vectors as the columns of A; reduce A to row echelon form; the original spanning vectors in the pivot columns form a basis of U, and their number is dim U.',
        ],
      },
    ],
  },

  lec0b: {
    cheat: [
      {
        formula: 'x + y = (x₁+y₁, …, xₙ+yₙ),  λx = (λx₁, …, λxₙ)',
        why: 'The only two things you may do to vectors. Both work one slot at a time.',
      },
      {
        formula: 'c₁v₁ + ⋯ + cₘvₘ',
        why: 'A linear combination — the only expression adding and stretching lets you build.',
      },
      {
        formula: 'c₁v₁ + ⋯ + cₘvₘ = 0 only when every cᵢ = 0',
        why: 'Linear independence. If any other mixture hits zero, the set is dependent.',
      },
      {
        formula: 'vⱼ = Σᵢ≠ⱼ (−cᵢ/cⱼ) vᵢ',
        why: 'What dependence means in practice: one vector is a mixture of the rest.',
      },
      {
        formula: 'rank = p independent · rank < p dependent',
        why: 'Lay p vectors out as rows and count. Works at any size.',
      },
      {
        formula: 'n < p ⟹ always dependent',
        why: 'More vectors than components. No arithmetic needed — there are not that many directions.',
      },
      {
        formula: 'rank(A) = rank(Aᵀ)',
        why: 'Independent rows and independent columns always come to the same number.',
      },
      {
        formula: 'pivot columns = the independent vectors',
        why: 'Vectors as columns, row-reduce. Non-pivot columns are mixtures of the pivots to their left.',
      },
      { formula: '⟨a, b⟩ = aᵀb = Σᵢ aᵢbᵢ', why: 'The dot product. Two vectors in, one plain number out.' },
      {
        formula: '⟨ku+lv, w⟩ = k⟨u,w⟩ + l⟨v,w⟩',
        why: 'Linearity. With symmetry ⟨u,v⟩ = ⟨v,u⟩ and ⟨u,u⟩ ≥ 0, these are the three properties.',
      },
      { formula: '‖a‖ = √⟨a, a⟩', why: 'Length. Pythagoras, and it keeps working past three dimensions.' },
      { formula: '|⟨a, b⟩| ≤ ‖a‖‖b‖', why: 'Cauchy–Schwarz. Equality only when the two lie along each other.' },
      { formula: '‖a + b‖ ≤ ‖a‖ + ‖b‖', why: 'Triangle inequality. The direct route is never longer than the detour.' },
      {
        formula: 'α = cos⁻¹(⟨a,b⟩ / (‖a‖‖b‖))',
        why: 'The angle. Cauchy–Schwarz is what keeps the fraction inside [−1, 1].',
      },
      { formula: '⟨a, b⟩ = 0 ⟺ orthogonal', why: 'The check you actually use — no angle needs working out.' },
      {
        formula: 'v = (v₂ᵀv₁ / v₁ᵀv₁) v₁',
        why: 'Projection of v₂ onto v₁. The leftover u = v₂ − v is at right angles by construction.',
      },
      {
        formula: 'P(E) ≥ 0 · P(Ω) = 1 · P(∪Eᵢ) = ΣP(Eᵢ)',
        why: 'The three axioms. The third needs the events to be mutually exclusive.',
      },
      {
        formula: 'p(x) = P(X = x),  Σ p(x) = 1',
        why: 'The pmf of a discrete variable. Each bar is an honest probability.',
      },
      {
        formula: 'P[a ≤ X ≤ b] = ∫ₐᵇ f(x) dx',
        why: 'For a continuous variable only areas are probabilities — f itself is not one.',
      },
      {
        formula: 'μ = E[X] = Σ x p(x)',
        why: 'Expectation: the balance point. Need not be a value X can actually take.',
      },
      {
        formula: 'σ² = E[(X − μ)²],  σ = √σ²',
        why: 'Variance and standard deviation. This lecture divides by n, not n − 1.',
      },
      {
        formula: 'cov(X,Y) = (1/n) Σ (xᵢ − x̄)(yᵢ − ȳ)',
        why: 'Do the two rise and fall together? Positive yes, negative opposite, zero no straight-line pattern.',
      },
    ],
    quiz: [
      {
        q: 'You have 5 vectors, each with 3 components. What can you say without doing any arithmetic?',
        options: [
          'They are linearly independent',
          'They are linearly dependent',
          'It depends on the numbers',
          'The rank is 5',
        ],
        answer: 1,
        explain:
          'There are more vectors (5) than components (3). The rank can never be more than 3, so at least two of them must collapse — they are dependent. This is the n < p rule on slide 8, and it saves a lot of pointless working in exams.',
      },
      {
        q: 'Vectors v₁ and v₂ are independent. You add v₃ = v₁ + v₂. What happens?',
        options: [
          'All three are now independent',
          'All three are now dependent, but v₁ and v₂ still are not',
          'v₁ and v₂ have become dependent',
          'The rank goes up to 3',
        ],
        answer: 1,
        explain:
          'v₁ + v₂ − v₃ = 0 with coefficients 1, 1 and −1, so the set of three is dependent. But nothing happened to v₁ and v₂ themselves — they are still independent of each other. Dependence is a property of the collection, not of any one vector, which is exactly the point of the lecture’s Ex.1 and Ex.2.',
      },
      {
        q: 'You put three vectors in as columns and row-reduce. Pivots land in columns 1 and 3. What is column 2?',
        options: [
          'The zero vector',
          'A multiple of column 3',
          'A mixture of the pivot columns to its left — so here, a multiple of column 1',
          'Independent of the other two',
        ],
        answer: 2,
        explain:
          'A non-pivot column is always a combination of the pivot columns to its left. Column 2 only has column 1 to its left, so it must be a multiple of it. On slide 10 it is exactly twice column 1.',
      },
      {
        q: 'a·b comes out negative. What does that tell you about the angle between a and b?',
        options: ['Less than 90°', 'Exactly 90°', 'More than 90°', 'Nothing at all'],
        answer: 2,
        explain:
          'cos α has the same sign as the dot product, since the two lengths on the bottom are always positive. A negative cosine means an obtuse angle, so the two vectors lean in broadly opposite directions.',
      },
      {
        q: 'Which is the quick way to check whether two vectors in ℝ¹⁰⁰ are at right angles?',
        options: [
          'Work out the angle with cos⁻¹ and see if it is 90°',
          'Check whether their dot product is zero',
          'Draw them and look',
          'Compare their norms',
        ],
        answer: 1,
        explain:
          'Orthogonal means the dot product is zero, so you never need the angle at all. It costs 100 multiplications and 99 additions, and it works in any number of dimensions — where "draw them and look" stopped being an option long ago.',
      },
      {
        q: 'You project v₂ onto v₁ and get v. What is special about the leftover u = v₂ − v?',
        options: [
          'It is parallel to v₁',
          'It is at right angles to v₁',
          'It is the zero vector',
          'It has the same length as v',
        ],
        answer: 1,
        explain:
          'That is the condition the formula was derived from. Slide 19 insists u·v₁ = 0 and rearranges to find the amount λ. So the right angle is not a happy accident — it is the requirement that produced the formula.',
      },
      {
        q: 'A and B are two events with A ∩ B = {4, 6}. Are they mutually exclusive?',
        options: [
          'Yes, because they have some outcomes in common',
          'No, because the intersection is not empty',
          'Only if they are also exhaustive',
          'You cannot tell without knowing Ω',
        ],
        answer: 1,
        explain:
          'Mutually exclusive means the events cannot both happen, so their intersection must be empty. Here rolling a 4 or a 6 would make both happen at once. Mutually exclusive and exhaustive are separate ideas: exclusive means no overlap, exhaustive means no gaps.',
      },
      {
        q: 'Someone assigns probabilities to a die and they add to 0.9. Which axiom fails?',
        options: [
          'Axiom 1, non-negativity',
          'Axiom 2, P(Ω) = 1',
          'Axiom 3, adding up',
          'None — it is a valid assignment',
        ],
        answer: 1,
        explain:
          'P(Ω) has to be exactly 1, because something is certain to happen. Adding to 0.9 means 10% of the probability has gone missing — usually an outcome that was forgotten. Nothing here is negative, so axiom 1 is fine.',
      },
      {
        q: 'A coin is tossed three times and X is the number of heads. What is P(X = 1)?',
        options: ['1/8', '3/8', '1/3', '1/2'],
        answer: 1,
        explain:
          'Three of the eight equally likely outcomes give exactly one head: HTT, THT and TTH. So P(X = 1) = 3/8. Notice the count is 3 rather than 1 — the head can be in any of three positions, and it is easy to forget the other two.',
      },
      {
        q: 'For a continuous random variable, what is P(X = 0.5)?',
        options: ['f(0.5)', '0', 'It depends on the distribution', '1/2'],
        answer: 1,
        explain:
          'Always zero, for any continuous variable. Probability comes from area under the density, and a single point has no width, so it encloses no area. This is why continuous variables are always asked about over ranges.',
      },
      {
        q: 'A probability density f(x) has f(0.3) = 2. Is that a problem?',
        options: [
          'Yes — probabilities cannot be above 1',
          'No — a density is not a probability, only areas under it are',
          'Yes — it means the distribution is not valid',
          'Only if the interval is longer than 1',
        ],
        answer: 1,
        explain:
          'A density can be as tall as it likes, as long as the total area is 1. Uniform(0, ½) has height 2 across its interval, and 2 × ½ = 1. Reading a probability off the height of a pdf is the most common mistake in this topic.',
      },
      {
        q: 'A fair coin is tossed three times. E[number of heads] = 1.5. What does that mean?',
        options: [
          'You will usually get 1.5 heads',
          '1.5 is the most likely number of heads',
          'It is the long-run average, even though you can never get 1.5 heads',
          'The calculation is wrong, since 1.5 heads is impossible',
        ],
        answer: 2,
        explain:
          'An expectation is a balance point, not a prediction. You will get 0, 1, 2 or 3 heads, never 1.5 — but averaged over many repeats the count settles at 1.5. The word "expected" is genuinely misleading here.',
      },
      {
        q: 'Why does variance square the distances from the mean instead of just adding them up?',
        options: [
          'To make the answer bigger',
          'Because the plain distances always add to exactly zero',
          'Because squaring is easier to compute',
          'To keep the units the same as the data',
        ],
        answer: 1,
        explain:
          'The deviations above the mean exactly cancel the ones below, every time — their sum is always 0, which measures nothing. Squaring removes the signs, and it also makes far-away values count for much more. It does change the units, which is why the standard deviation takes the square root afterwards.',
      },
      {
        q: 'The lecture computes the variance of 2, 4, 6, 8 as 5. The Statistics course would get 20/3 ≈ 6.67. Who is right?',
        options: [
          'The lecture — you always divide by n',
          'The Statistics course — you always divide by n − 1',
          'Both — they are answering different questions',
          'Neither — the data is wrong',
        ],
        answer: 2,
        explain:
          'Dividing by n describes the collection you have in front of you. Dividing by n − 1 treats those numbers as a sample from something bigger and corrects for the fact that a sample looks slightly tighter than the population it came from. Read the question and see which is being asked for.',
      },
      {
        q: 'Points are arranged in a perfect arch: y rises then falls as x increases. What is the covariance?',
        options: [
          'Strongly positive, because there is a clear pattern',
          'Strongly negative',
          'Close to zero, even though the pattern is obvious',
          'Exactly 1',
        ],
        answer: 2,
        explain:
          'Covariance only sees straight-line patterns. On the left of the arch the products are positive, on the right they are negative, and they cancel. So a covariance near zero does not mean "no relationship" — it means no straight-line relationship. Always look at the scatter plot.',
      },
    ],
    exam: [
      {
        q: 'Define linear independence, and describe two ways of testing whether a set of vectors is independent.',
        meta: 'Definition plus method · 6–8 marks',
        points: [
          'Vectors v₁, …, vₘ in ℝⁿ are linearly independent if c₁v₁ + ⋯ + cₘvₘ = 0 implies c₁ = ⋯ = cₘ = 0.',
          'If some non-trivial choice of coefficients gives 0, the set is linearly dependent, and any vⱼ with cⱼ ≠ 0 can be written as vⱼ = Σᵢ≠ⱼ (−cᵢ/cⱼ)vᵢ.',
          'Method 1 — rank of the row matrix: form the m × n matrix whose rows are the vectors and reduce to echelon form. The set is independent if and only if rank = m.',
          'Method 2 — pivot columns: form the n × m matrix whose columns are the vectors and reduce. The vectors are independent if and only if every column is a pivot column.',
          'The second method also identifies which vectors are redundant: each non-pivot column is a linear combination of the pivot columns to its left, with coefficients read from the reduced form.',
          'Since rank(A) = rank(Aᵀ), the two methods necessarily agree.',
          'If m > n the vectors are automatically dependent, since rank ≤ min(m, n) ≤ n < m.',
        ],
      },
      {
        q: 'State the defining properties of an inner product and use them to prove the parallelogram law ‖a+b‖² + ‖a−b‖² = 2‖a‖² + 2‖b‖².',
        meta: 'Properties plus a short proof · 6 marks',
        points: [
          'Linearity: ⟨ku + lv, w⟩ = k⟨u, w⟩ + l⟨v, w⟩ for all scalars k, l.',
          'Symmetry: ⟨u, v⟩ = ⟨v, u⟩.',
          'Positive definiteness: ⟨u, u⟩ ≥ 0, with equality if and only if u = 0. This is what makes ‖u‖ = √⟨u, u⟩ well defined.',
          'Expand: ‖a + b‖² = ⟨a + b, a + b⟩ = ⟨a,a⟩ + ⟨a,b⟩ + ⟨b,a⟩ + ⟨b,b⟩ = ‖a‖² + 2⟨a,b⟩ + ‖b‖², using symmetry to combine the cross terms.',
          'Similarly ‖a − b‖² = ‖a‖² − 2⟨a,b⟩ + ‖b‖².',
          'Adding the two expressions cancels the cross terms and gives 2‖a‖² + 2‖b‖², as required.',
          'Geometric reading: in any parallelogram the sum of the squares of the diagonals equals the sum of the squares of the four sides.',
        ],
      },
      {
        q: 'Derive the formula for the projection of v₂ onto v₁ and state its significance.',
        meta: 'Derivation from the orthogonality condition · 5–6 marks',
        points: [
          'Seek v lying along v₁, so v = λ v₁/‖v₁‖ for some scalar λ, such that u = v₂ − v is orthogonal to v₁.',
          'Impose orthogonality: (v₂ − v)ᵀv₁ = 0, so v₂ᵀv₁ = vᵀv₁.',
          'Substituting v = λv₁/‖v₁‖ gives vᵀv₁ = λ‖v₁‖, hence λ = v₂ᵀv₁ / ‖v₁‖.',
          'Therefore v = (v₂ᵀv₁ / ‖v₁‖)(v₁/‖v₁‖) = (v₂ᵀv₁ / v₁ᵀv₁) v₁.',
          'Worked check: v₁ = (3,0), v₂ = (2,4) give v = (6/9)(3,0) = (2,0) and u = (0,4), with u·v₁ = 0.',
          'The decomposition v₂ = v + u splits any vector into a component along v₁ and a component orthogonal to it.',
          'Significance: this is the basis of least squares — the fitted values are the projection of the data onto the span of the features, and u is the residual being minimised.',
        ],
      },
      {
        q: 'State the axioms of probability and derive P(Aᶜ) = 1 − P(A) and P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        meta: 'Axioms plus two standard derivations · 6–8 marks',
        points: [
          'Axiom 1: P(E) ≥ 0 for every event E in the algebra of events.',
          'Axiom 2: P(Ω) = 1.',
          'Axiom 3: for a sequence of mutually exclusive events E₁, E₂, …, P(∪Eᵢ) = Σ P(Eᵢ).',
          'Complement: A and Aᶜ are mutually exclusive and A ∪ Aᶜ = Ω, so by axioms 3 and 2, P(A) + P(Aᶜ) = 1, giving P(Aᶜ) = 1 − P(A).',
          'Setting A = Ω gives P(∅) = 0.',
          'Addition rule: write A ∪ B as the disjoint union of A and B ∩ Aᶜ, so P(A ∪ B) = P(A) + P(B ∩ Aᶜ).',
          'Also B is the disjoint union of B ∩ A and B ∩ Aᶜ, so P(B ∩ Aᶜ) = P(B) − P(A ∩ B). Substituting gives the result.',
          'The subtraction is needed because axiom 3 only applies to mutually exclusive events; adding P(A) and P(B) directly would count A ∩ B twice.',
        ],
      },
      {
        q: 'Distinguish between a probability mass function and a probability density function, and explain why P(X = c) = 0 for a continuous random variable.',
        meta: 'Definitions with the key distinction · 5–6 marks',
        points: [
          'A random variable is a real-valued function on the sample space Ω; it is discrete if its range is finite or countably infinite, and continuous if it takes values throughout an interval.',
          'For a discrete X the pmf is p(x) = P(X = x), satisfying p(x) ≥ 0 and Σₓ p(x) = 1. Each value is an actual probability.',
          'For a continuous X the pdf is an integrable f with f(x) ≥ 0 and ∫f(x)dx = 1 over ℝ, and P[a ≤ X ≤ b] = ∫ₐᵇ f(x)dx.',
          'f(x) is a density, not a probability: it may exceed 1, as for Uniform(0, ½) where f = 2 throughout.',
          'Since P(X = c) = ∫_c^c f(x)dx = 0, any single value has probability zero — the interval has zero width, so it encloses no area.',
          'Consequently P(a ≤ X ≤ b) = P(a < X < b) for continuous variables: the endpoints contribute nothing.',
          'Worked example: X ~ Uniform(0,1) gives P(0.3 ≤ X ≤ 0.7) = 0.7 − 0.3 = 0.4, while P(X = 0.5) = 0.',
        ],
      },
      {
        q: 'Define expectation, variance and covariance, and comment on what covariance does and does not tell you.',
        meta: 'Three definitions plus interpretation · 6–8 marks',
        points: [
          'Expectation: μ = E[X] = Σₓ x p(x) for discrete X, or ∫ x f(x) dx for continuous X. It is the probability-weighted average, and need not be an attainable value.',
          'Empirically the mean is x̄ = (1/n) Σ xᵢ, which is the same weighting with each observation given weight 1/n.',
          'Variance: σ² = E[(X − μ)²] = Σₓ (x − μ)² p(x), computed from data as (1/n) Σ xᵢ² − x̄². Squaring is necessary because the signed deviations always sum to zero.',
          'The standard deviation σ = √σ² restores the units of the original data, which is why it is the quantity usually quoted.',
          'Covariance: cov(X, Y) = E[(X − E[X])(Y − E[Y])], computed as (1/n) Σ (xᵢ − x̄)(yᵢ − ȳ).',
          'Its sign indicates the direction of any linear relationship: positive when the variables tend to lie on the same side of their means, negative when on opposite sides.',
          'Its magnitude is not interpretable on its own, since it carries the product of the two units; dividing by σₓσᵧ gives the correlation, which lies in [−1, 1].',
          'Covariance detects only linear association. A symmetric non-linear relationship, such as a parabola, can give a covariance of zero despite a strong dependence between the variables.',
        ],
      },
    ],
  },

  lec2: {
    cheat: [
      {
        formula: 'Ax = 0, Ay = 0 ⟹ A(x+y) = 0 and A(λx) = 0',
        why: 'Why the subject moves on. Answers to a homogeneous system survive adding and stretching, so they form a space.',
      },
      {
        formula: 'group: closure · associativity · neutral e · inverse',
        why: 'The four properties of (G, ⊗). Add commutativity x ⊗ y = y ⊗ x and it is an Abelian group.',
      },
      {
        formula: '(ℤ, +) is Abelian · (ℕ₀, +) is not · (ℤ, ·) is not',
        why: 'The lecture’s three tests. ℕ₀ has no inverses; ℤ under product has 1 but almost nothing has an inverse.',
      },
      {
        formula: 'V = (𝒱, +, ·) with + : 𝒱×𝒱 → 𝒱 and · : ℝ×𝒱 → 𝒱',
        why: 'A vector space is one inner operation and one outer one. (𝒱, +) must be an Abelian group.',
      },
      {
        formula: 'λ·(x+y) = λx + λy,  (λ+ψ)·x = λx + ψx',
        why: 'Distributivity, both ways round. The outer operation spreads over both kinds of addition.',
      },
      {
        formula: 'λ·(ψ·x) = (λψ)·x,  1·x = x',
        why: 'Associativity and the neutral element for the outer operation. The last one is easy to forget and easy to break.',
      },
      {
        formula: '0 = [0, 0, …, 0]ᵀ',
        why: 'The neutral element of (𝒱, +). Every vector space, and every subspace, has to contain it.',
      },
      {
        formula: 'ℝⁿ · ℝᵐˣⁿ · polynomials',
        why: 'All vector spaces. A “vector” is anything you can add and stretch — matrices qualify.',
      },
      {
        formula: 'U ⊆ V subspace ⟺ U ≠ ∅,  λx ∈ U,  x + y ∈ U',
        why: 'The short test. U inherits associativity, distributivity and the rest from V, so only these three need checking.',
      },
      {
        formula: 'U ≠ ∅ and λx ∈ U ⟹ 0 ∈ U',
        why: 'Take λ = 0. This is why any set missing the origin — the line x = 1, for instance — fails at once.',
      },
      {
        formula: 'nullspace {x : Ax = 0} is a subspace',
        why: 'The subspace the lecture is really after. Non-empty because x = 0 is always in it.',
      },
      {
        formula: 'v = λ₁x₁ + λ₂x₂ + ⋯ + λₖxₖ',
        why: 'A linear combination. 0 is always one of them with every λ = 0 — the trivial one, which never proves anything.',
      },
      {
        formula: '0 = Σ λᵢxᵢ with some λᵢ ≠ 0 ⟹ dependent',
        why: 'Linear dependence. Independent means the trivial combination is the only one reaching 0.',
      },
      {
        formula: 'any set containing 0 is dependent',
        why: 'Give the zero vector a non-zero λ and everything else zero. The sum is still 0.',
      },
      {
        formula: 'all non-zero: dependent ⟺ one is a combination of the others',
        why: 'Slide 17. The “all non-zero” condition matters — the previous line is the case it rules out.',
      },
      {
        formula: 'columns → Gaussian elimination → pivot columns',
        why: 'The practical test. Pivot columns are the independent vectors; every column a pivot means the whole set is independent.',
      },
      {
        formula: 'non-pivot column = combination of the pivots to its left',
        why: 'For [[1,2,3],[2,4,4]] the REF is [[1,2,3],[0,0,−2]]: column 2 is twice column 1.',
      },
      {
        formula: 'REF is not unique · RREF is',
        why: 'Two correct elimination routes can end at different staircases. The pivot positions, the rank and the RREF are the same either way.',
      },
      {
        formula: 'm vectors from k ingredients, m > k ⟹ dependent',
        why: 'A k × m matrix has at most k pivots, so with m > k some column is not a pivot. No arithmetic needed.',
      },
      {
        formula: '𝒜 generates V ⟺ V = span[𝒜]',
        why: 'A generating set reaches everything. It may be far bigger than it needs to be.',
      },
      {
        formula: 'basis = independent generating set = minimal generating set',
        why: 'Also: a maximal independent set — add one more vector and it becomes dependent.',
      },
      {
        formula: 'x = Σ λᵢbᵢ uniquely',
        why: 'The coefficients over a basis are one of a kind. If Σλᵢbᵢ = Σψᵢbᵢ then λᵢ = ψᵢ for every i.',
      },
      {
        formula: 'a basis is not unique',
        why: 'ℝ³ has the canonical one, and (1,0,0),(1,1,0),(1,1,1), and (0.5,0.8,0.4),(1.8,0.3,0.3),(−2.2,−3.3,1.5). All three are bases.',
      },
      {
        formula: 'independent ⇏ basis',
        why: 'Three independent vectors in ℝ⁴ are too few to reach everything. Independence alone is not enough.',
      },
      {
        formula: 'dim V = number of vectors in a basis',
        why: 'The same number whichever basis you choose, so it belongs to the space rather than to your choice.',
      },
      {
        formula: 'dim ≠ number of components',
        why: 'span{(0,1)} sits in ℝ² and has dimension 1. Its vectors still have two numbers each.',
      },
      {
        formula: 'U ⊆ V ⟹ dim U ≤ dim V, equal only if U = V',
        why: 'A subspace cannot be bigger, and cannot match without being the whole thing.',
      },
      {
        formula: 'basis of span{x₁…xₘ}: columns → REF → pivot columns',
        why: 'The three-step recipe on slide 40. Keep the original vectors the pivots point at, not the reduced ones.',
      },
    ],
    quiz: [
      {
        q: 'Why does the lecture say the solutions of Ax = b only form a space when b = 0?',
        options: [
          'Because b ≠ 0 makes the system harder to solve',
          'Because if Ax = b and Ay = b then A(x+y) = 2b, which is not b unless b = 0',
          'Because b ≠ 0 systems have no solutions',
          'Because only b = 0 gives a unique solution',
        ],
        answer: 1,
        explain:
          'Adding two solutions doubles the right-hand side. That only lands back on b when b is 0, so for any other b the answer set is not closed under addition and cannot be a vector space. This is the observation the whole lecture is built on.',
      },
      {
        q: 'Which group property does (ℕ₀, +) fail?',
        options: ['Closure', 'Associativity', 'A neutral element', 'Inverses'],
        answer: 3,
        explain:
          '0 is there and adding stays inside ℕ₀, so closure, associativity and the neutral element are all fine. But 3 needs −3 to undo it, and −3 is not a natural number. Slide 4 gives exactly this example.',
      },
      {
        q: '(ℤ, ·) — the integers under multiplication. What goes wrong?',
        options: [
          'There is no identity element',
          'It is not closed',
          'The identity is 1, but most elements have no integer inverse',
          'Nothing — it is a group',
        ],
        answer: 2,
        explain:
          'Multiplying integers gives integers, and 1 acts as the identity. But 3 would need 1/3 to undo it, and that is not an integer. Only 1 and −1 have inverses inside ℤ, so it is not a group.',
      },
      {
        q: 'Is the set of 2 × 3 matrices, with the usual addition and scalar multiplication, a vector space?',
        options: [
          'No — vectors have to be columns',
          'Yes — you can add them and scale them element-wise, which is all that is required',
          'Only if they are square',
          'Only if they are invertible',
        ],
        answer: 1,
        explain:
          'Slide 8 makes this point deliberately. Nothing in the definition mentions columns: you need one operation that adds two members and one that scales a member, and matrix addition and scalar multiplication do both element-wise. The same is true of polynomials.',
      },
      {
        q: 'Is the line y = x + 1 in ℝ² a subspace?',
        options: [
          'Yes — it is a straight line',
          'No — it does not contain the origin, so it fails both closures',
          'Yes, but only for positive x',
          'It depends on which two points you pick',
        ],
        answer: 1,
        explain:
          'A subspace must be non-empty and closed under scaling, and taking λ = 0 forces 0 into it. This line misses the origin. Concretely, (0,1) and (1,2) are both on it but their sum (1,3) is not. Being straight is not enough — it has to pass through the origin.',
      },
      {
        q: 'Why is the square −1 ≤ x ≤ 1, −1 ≤ y ≤ 1 not a subspace of ℝ²?',
        options: [
          'It does not contain the origin',
          'Adding two of its points can leave it',
          'Scaling by a big enough λ leaves it — 2·(1,1) = (2,2) is outside',
          'It is not a straight line',
        ],
        answer: 2,
        explain:
          'The origin is in it, and it is non-empty. It falls at the outer operation: stretch (1,1) by 2 and you are outside the square. Any bounded set fails for this reason, because scaling can always push a non-zero vector past the boundary.',
      },
      {
        q: 'Why is the nullspace {x : Ax = 0} always a subspace?',
        options: [
          'Because A is always invertible',
          'Because it contains x = 0, and Ax = 0 with Ay = 0 gives A(x+y) = 0 and A(λx) = 0',
          'Because it is the same as the column space',
          'Because every solution set is a subspace',
        ],
        answer: 1,
        explain:
          'It is non-empty because x = 0 always solves it, and the two closures follow straight from A being linear. That is the whole three-part test on slide 10, and it is why this particular subspace matters to the course.',
      },
      {
        q: 'Someone shows you that 0·x₁ + 0·x₂ + 0·x₃ = 0 and concludes the vectors are dependent. What is wrong?',
        options: [
          'Nothing — that proves dependence',
          'The trivial combination always gives 0, for any vectors at all. Dependence needs some λᵢ ≠ 0',
          'They should have used 1 instead of 0',
          'It only works if the vectors are non-zero',
        ],
        answer: 1,
        explain:
          'Taking none of anything reaches zero whatever the vectors are, so it tells you nothing. Slide 14 flags this: the interesting question is whether there is a non-trivial combination. Independence means there is not.',
      },
      {
        q: 'A set of five vectors includes the zero vector. What can you say?',
        options: [
          'Nothing without doing the arithmetic',
          'They are dependent — give the zero vector any non-zero λ and the others zero',
          'They are independent',
          'It depends on the other four',
        ],
        answer: 1,
        explain:
          'Take λ = 7 for the zero vector and 0 for everything else. The sum is 7·0 = 0, which is a non-trivial combination reaching zero, so the set is dependent. Slide 17 states this, and it is a free mark in an exam.',
      },
      {
        q: 'The matrix [[1,2,3],[2,4,4]] reduces to [[1,2,3],[0,0,−2]]. Which columns are independent?',
        options: ['All three', 'Columns 1 and 2', 'Columns 1 and 3 — column 2 is twice column 1', 'Only column 1'],
        answer: 2,
        explain:
          'The pivots sit in columns 1 and 3, so those are the independent ones. Column 2 is not a pivot column, so it is a combination of the pivot columns to its left — here just column 1, and indeed (2,4) = 2·(1,2).',
      },
      {
        q: 'Two students row-reduce the same matrix by different legal routes and get different echelon forms. Who made a mistake?',
        options: [
          'The one whose answer has more zeros',
          'Neither — echelon form is not unique. The pivot positions, the rank and the RREF still agree',
          'Both, since the answer is unique',
          'You cannot tell without redoing it',
        ],
        answer: 1,
        explain:
          'Different orders of operations reach different staircases, and both are correct echelon forms. What does not change is where the pivots land, how many there are, and the reduced form you get if you carry on tidying. Only the RREF is unique.',
      },
      {
        q: 'You have 4 vectors, each built as a combination of 3 independent ingredients. What follows?',
        options: [
          'They are independent',
          'They are dependent, whatever the coefficients are',
          'It depends on the coefficients',
          'The rank is 4',
        ],
        answer: 1,
        explain:
          'The coefficient matrix is 3 × 4, so it has at most 3 pivots and at least one column is not a pivot. That non-pivot column gives a non-trivial combination reaching zero. Slide 31: m > k always means dependent.',
      },
      {
        q: 'Which of these is a basis of ℝ³?',
        options: [
          '(1,0,0), (0,1,0)',
          '(1,0,0), (1,1,0), (1,1,1)',
          '(1,0,0), (0,1,0), (0,0,1), (1,1,1)',
          '(1,2,3), (2,4,6), (0,0,1)',
        ],
        answer: 1,
        explain:
          'Three independent vectors in ℝ³, so they reach everything — slide 36 lists exactly this set. The first has too few to span; the third has four vectors in a 3-dimensional space, so it must be dependent; and in the fourth the second vector is twice the first.',
      },
      {
        q: 'Are (1,2,3,4), (2,−1,0,2) and (1,1,0,4) a basis of ℝ⁴?',
        options: [
          'Yes, if they are independent',
          'No — three vectors can never span ℝ⁴, however independent they are',
          'Yes, because they are in ℝ⁴',
          'Only if a fourth is added',
        ],
        answer: 1,
        explain:
          'Slide 37 asks this exactly. A basis has to do two jobs: reach everything and carry nothing spare. Three vectors are too few for the first job in a 4-dimensional space, so independence alone does not make them a basis.',
      },
      {
        q: 'What is the dimension of span{(0,1)} inside ℝ²?',
        options: ['2, because the vectors have two components', '1', '0', 'It has no dimension'],
        answer: 1,
        explain:
          'The basis is the single vector (0,1), so the dimension is 1 — even though every vector in the space is written with two numbers. Slide 39 makes this point on purpose: dimension counts basis vectors, not components.',
      },
      {
        q: 'U is a subspace of V and dim U = dim V. What follows?',
        options: ['U is a proper subset of V', 'U = V', 'Nothing — they can still differ', 'V has dimension 0'],
        answer: 1,
        explain:
          'A subspace can never have a bigger dimension, and matching the dimension leaves no room to be smaller: a basis of U is already independent in V and big enough to span it. Slide 38 states it as an if-and-only-if.',
      },
      {
        q: 'You put spanning vectors in as columns, reduce, and find pivots in columns 1 and 3. What is the basis?',
        options: [
          'The reduced columns 1 and 3',
          'The original vectors x₁ and x₃',
          'All the original vectors',
          'The non-zero rows of the reduced matrix',
        ],
        answer: 1,
        explain:
          'The third step on slide 40 says the spanning vectors associated with the pivot columns form the basis. Elimination is only there to tell you which of your original vectors to keep — the reduced columns are not vectors from your space.',
      },
    ],
    exam: [
      {
        q: 'Define a group and an Abelian group, and determine whether (ℤ, +), (ℕ₀, +) and (ℤ, ·) are groups.',
        meta: 'Definition plus three tests · 5–6 marks',
        points: [
          'A group is a set G with an operation ⊗ : G × G → G satisfying four properties.',
          'Closure: ∀x, y ∈ G, x ⊗ y ∈ G.',
          'Associativity: ∀x, y, z ∈ G, (x ⊗ y) ⊗ z = x ⊗ (y ⊗ z).',
          'Neutral (identity) element: ∃e ∈ G such that ∀x ∈ G, x ⊗ e = x.',
          'Inverse element: ∀x ∈ G, ∃y ∈ G with x ⊗ y = y ⊗ x = e.',
          'If in addition x ⊗ y = y ⊗ x for all x, y, the group is called Abelian.',
          '(ℤ, +) is an Abelian group: sums of integers are integers, addition is associative and commutative, e = 0, and the inverse of x is −x.',
          '(ℕ₀, +) is not a group: closure, associativity and e = 0 all hold, but no positive n has an inverse in ℕ₀, since −n ∉ ℕ₀.',
          '(ℤ, ·) is not a group: it is closed and associative and has identity 1, but the only elements with multiplicative inverses in ℤ are 1 and −1.',
        ],
      },
      {
        q: 'Define a real-valued vector space, and state the test for a subset to be a subspace. Explain why the test is shorter than the definition.',
        meta: 'Definition plus the subspace criterion · 6–8 marks',
        points: [
          'A real-valued vector space is V = (𝒱, +, ·) with an inner operation + : 𝒱 × 𝒱 → 𝒱 and an outer operation · : ℝ × 𝒱 → 𝒱.',
          '(𝒱, +) must be an Abelian group; its neutral element is the zero vector 0 = [0, …, 0]ᵀ.',
          'Distributivity: λ·(x + y) = λ·x + λ·y and (λ + ψ)·x = λ·x + ψ·x, for all λ, ψ ∈ ℝ and x, y ∈ 𝒱.',
          'Associativity of the outer operation: λ·(ψ·x) = (λψ)·x.',
          'Neutral element of the outer operation: 1·x = x for all x ∈ 𝒱.',
          'Subspace test: U ⊆ 𝒱 with U ≠ ∅ is a subspace of V if λx ∈ U for all λ ∈ ℝ, x ∈ U, and x + y ∈ U for all x, y ∈ U.',
          'The test is shorter because associativity, distributivity, commutativity and the neutral element are statements holding for all x ∈ 𝒱, hence automatically for all x ∈ U ⊆ 𝒱. Only closure can fail on passing to a subset.',
          'Non-emptiness combined with closure under the outer operation forces 0 ∈ U, by taking λ = 0.',
          'Example: in ℝ² the y-axis is a subspace, while the shifted line x = 1 is not, since scaling leaves it; the square −1 ≤ x, y ≤ 1 is not, for the same reason.',
        ],
      },
      {
        q: 'Show that the nullspace of a matrix A, that is {x : Ax = 0}, is a vector subspace, and explain why the solution set of Ax = b with b ≠ 0 is not.',
        meta: 'Verification against the three-part test · 5–6 marks',
        points: [
          'Non-empty: x = 0 satisfies A0 = 0, so the nullspace always contains at least the zero vector.',
          'Closed under addition: if Ax = 0 and Ay = 0 then A(x + y) = Ax + Ay = 0 + 0 = 0, so x + y is again in the nullspace.',
          'Closed under scalar multiplication: if Ax = 0 then A(λx) = λ(Ax) = λ0 = 0 for every λ ∈ ℝ.',
          'All three parts of the subspace test hold, so the nullspace is a subspace of ℝⁿ.',
          'For b ≠ 0: if Ax = b and Ay = b then A(x + y) = 2b ≠ b, so the solution set is not closed under addition.',
          'Likewise A(λx) = λb ≠ b unless λ = 1, so it is not closed under scaling either.',
          'It also fails to contain 0, since A0 = 0 ≠ b. Geometrically the solution set is a shifted copy of the nullspace, and the shift is what destroys the structure.',
        ],
      },
      {
        q: 'Define linear combination and linear independence, and describe how Gaussian elimination is used to test a set of vectors.',
        meta: 'Definitions plus method · 6–8 marks',
        points: [
          'For x₁, …, xₖ in a vector space V, a linear combination is v = λ₁x₁ + λ₂x₂ + ⋯ + λₖxₖ with λᵢ ∈ ℝ.',
          '0 can always be written trivially, with every λᵢ = 0; only non-trivial combinations carry information.',
          'The vectors are linearly dependent if 0 = Σᵢ λᵢxᵢ for some choice with at least one λᵢ ≠ 0; they are linearly independent if the trivial choice is the only one.',
          'Interpretation: dependence means one vector can be written in terms of the others and is therefore redundant; independence means each vector contributes something the others collectively cannot supply.',
          'Two special cases: any set containing the zero vector is dependent, choosing a non-zero λ for it and 0 elsewhere. Among non-zero vectors, dependence holds if and only if one is a linear combination of the others.',
          'Method: write the vectors as the columns of a matrix and reduce to row-echelon form by Gaussian elimination.',
          'The pivot columns identify a linearly independent subset; the vectors are independent precisely when every column is a pivot column.',
          'Each non-pivot column can be expressed as a linear combination of the pivot columns to its left, and the coefficients are read off the reduced form.',
          'Worked example: [[1,2,3],[2,4,4]] reduces to [[1,2,3],[0,0,−2]], so columns 1 and 3 are pivots and column 2 equals twice column 1.',
        ],
      },
      {
        q: 'Prove that m vectors, each written as a linear combination of k linearly independent vectors, must be linearly dependent whenever m > k.',
        meta: 'Argument from the pivot count · 5–6 marks',
        points: [
          'Let b₁, …, b_k be linearly independent and let each xⱼ = Σᵢ aᵢⱼbᵢ for j = 1, …, m.',
          'Collect the coefficients into a k × m matrix A whose j-th column holds the coefficients of xⱼ.',
          'Because the bᵢ are independent, a combination Σⱼ λⱼxⱼ equals 0 if and only if the corresponding combination of the columns of A equals 0. The question about the xⱼ reduces to a question about the columns of A.',
          'Reduce A to row-echelon form. The number of pivots cannot exceed the number of non-zero rows, so it is at most k.',
          'With m > k columns and at most k pivots, at least one column is a non-pivot column.',
          'A non-pivot column is a linear combination of the pivot columns to its left, which gives a non-trivial combination of the columns of A equal to 0.',
          'Transferring back, the same coefficients give a non-trivial combination of the xⱼ equal to 0, so the xⱼ are linearly dependent.',
          'Consequence: in ℝⁿ any set of more than n vectors is dependent, since the canonical basis provides k = n independent ingredients.',
        ],
      },
      {
        q: 'Define generating set, basis and dimension, state the equivalent characterizations of a basis, and give the procedure for finding a basis of a span.',
        meta: 'Definitions, equivalences and method · 8 marks',
        points: [
          'For V = (𝒱, +, ·) and 𝒜 = {x₁, …, xₖ} ⊆ 𝒱, 𝒜 is a generating set of V if every v ∈ V is a linear combination of its members. The set of all such combinations is the span, written V = span[𝒜].',
          'A generating set 𝒜 is minimal if no proper subset of it still spans V. Every linearly independent generating set is minimal and is called a basis.',
          'Equivalent characterizations: ℬ is a basis; ℬ is a minimal generating set; ℬ is a maximal linearly independent set, so adding any further vector makes it dependent; every x ∈ V has a unique expansion over ℬ, meaning Σλᵢbᵢ = Σψᵢbᵢ forces λᵢ = ψᵢ for all i.',
          'A basis is not unique: ℝ³ admits the canonical basis, and also (1,0,0), (1,1,0), (1,1,1), among infinitely many others.',
          'The dimension dim V is the number of vectors in a basis. It is well defined because every basis of V has the same size.',
          'dim V is not the number of components: span{(0,1)} ⊆ ℝ² has dimension 1 although its vectors have two components.',
          'If U ⊆ V then dim U ≤ dim V, with equality if and only if U = V.',
          'Independence alone is insufficient: three linearly independent vectors in ℝ⁴ form no basis, since they cannot span a 4-dimensional space.',
          'To find a basis of U = span{x₁, …, xₘ} ⊆ ℝⁿ: write the spanning vectors as the columns of a matrix A; reduce A to row-echelon form; the original spanning vectors sitting in the pivot columns form a basis of U, and their number is dim U.',
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
