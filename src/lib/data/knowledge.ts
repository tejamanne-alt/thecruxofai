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

  lec3: {
    cheat: [
      {
        formula: '‖·‖ : V → ℝ,  x ↦ ‖x‖',
        why: 'A norm eats one vector and returns its length. The dot is a placeholder; ↦ says what happens to one input.',
      },
      {
        formula: '‖λx‖ = |λ|·‖x‖',
        why: 'Absolutely homogeneous. Stretching by −3 triples the length too — direction never shortens anything.',
      },
      { formula: '‖x + y‖ ≤ ‖x‖ + ‖y‖', why: 'Triangle inequality. The direct route is never longer than the detour.' },
      {
        formula: '‖x‖ ≥ 0,  ‖x‖ = 0 ⟺ x = 0',
        why: 'Positive definite. Lengths are never negative, and only the zero vector has none.',
      },
      {
        formula: '‖x‖₁ = Σᵢ |xᵢ|',
        why: 'Manhattan norm. Unit ball is a diamond, with corners on the axes — the reason Lasso gives exact zeros.',
      },
      {
        formula: '‖x‖₂ = √(Σᵢ xᵢ²)',
        why: 'Euclidean norm. Unit ball is a circle. ‖x‖₁ ≥ ‖x‖₂ always, equal only along an axis.',
      },
      {
        formula: 'Ω(λx + ψy, z) = λΩ(x,z) + ψΩ(y,z)',
        why: 'Bilinear in the first slot; the same again in the second. Two separate promises.',
      },
      {
        formula: 'Ω(λx, λy) = λ²Ω(x, y)',
        why: 'The trap. Bilinear does NOT mean linear in both at once — scale both and the factor appears twice.',
      },
      {
        formula: 'inner product = bilinear + symmetric + positive definite',
        why: 'The three conditions. Symmetry gives angle, positive definiteness gives length, bilinearity gives a matrix.',
      },
      {
        formula: '⟨x, y⟩ = x̂ᵀAŷ, A symmetric positive definite',
        why: 'The theorem, and it holds both ways. Choosing an inner product = choosing an SPD matrix. The hats mean coordinates in an ordered basis.',
      },
      {
        formula: '2×2 SPD ⟺ a₁₁ > 0 and det A > 0',
        why: 'The quick test. A positive diagonal alone is not enough — a₁₁=a₂₂=1, a₁₂=3 has det −8.',
      },
      {
        formula: 'SPD ⟹ full rank',
        why: 'Ax = 0 would give xᵀAx = 0, contradicting xᵀAx > 0. So the nullspace is {0}.',
      },
      { formula: 'SPD ⟹ Aᵢᵢ > 0', why: 'Put x = eᵢ. Then eᵢᵀAeᵢ = Aᵢᵢ, and eᵢ ≠ 0, so it must be positive.' },
      {
        formula: '‖x‖ = √⟨x, x⟩',
        why: 'The induced norm. Every inner product gives a length; not every length comes from an inner product — ‖·‖₁ does not.',
      },
      { formula: '|⟨x, y⟩| ≤ ‖x‖·‖y‖', why: 'Cauchy–Schwarz. Equality exactly when the two vectors are parallel.' },
      {
        formula: '‖u − αv‖² ≥ 0, then α = uᵀv/vᵀv',
        why: 'The proof in two moves: a squared length is never negative, so put in the α that minimises it.',
      },
      {
        formula: 'd(x, y) = ‖x − y‖',
        why: 'The metric. Positive definite, symmetric, and obeys the triangle inequality.',
      },
      {
        formula: 'close ⟹ small distance, LARGE inner product',
        why: 'Slide 10’s warning. The two measures run in opposite directions — do not read one as the other.',
      },
      {
        formula: 'cos ω = ⟨x, y⟩ / (‖x‖‖y‖),  ω ∈ [0, π]',
        why: 'The angle. Legal only because Cauchy–Schwarz pins the ratio inside [−1, 1].',
      },
      {
        formula: 'x ⊥ y ⟺ ⟨x, y⟩ = 0',
        why: 'Orthogonality. Checked by the inner product, never by working out the angle. 0 is orthogonal to everything.',
      },
      {
        formula: 'orthogonal depends on WHICH inner product',
        why: 'x=(1,1), y=(−1,1) are perpendicular under the dot product and at cos⁻¹(−1/3) under A = diag(2,1).',
      },
      {
        formula: 'AᵀA = I = AAᵀ,  Aᵀ = A⁻¹',
        why: 'An orthogonal matrix. Confusingly it requires ORTHONORMAL columns, not merely orthogonal ones.',
      },
      {
        formula: '‖Ax‖² = xᵀAᵀAx = xᵀx',
        why: 'Why an orthogonal matrix preserves length. Angles survive for the same reason — every part of cos ω is untouched.',
      },
      {
        formula: '[[cos θ, −sin θ], [sin θ, cos θ]]',
        why: 'The 2-D rotation matrix, the deck’s example of an orthogonal one. det +1 rotates, det −1 reflects.',
      },
      {
        formula: '⟨bᵢ, bⱼ⟩ = 0 for i ≠ j,  ⟨bᵢ, bᵢ⟩ = 1',
        why: 'An orthonormal basis. Only the first condition gives an orthogonal basis.',
      },
      {
        formula: 'v = Σᵢ ⟨v, bᵢ⟩ bᵢ',
        why: 'The payoff. Over an orthonormal basis, coordinates are single inner products — no system to solve.',
      },
      {
        formula: 'FORWARD-eliminate [ AᵀA | Aᵀ ] → rows of the right half are orthogonal',
        why: 'Gram–Schmidt the deck’s way. Basis vectors go in as COLUMNS of A. Normalise the rows afterwards.',
      },
      {
        formula: 'stop at upper triangular — never reduce to I',
        why: 'The one that costs marks. Slide 22 ends with 0.8 still in the top row. Clearing it turns (0.3, 0.1) into (0.5, −0.5) and the rows stop being orthogonal.',
      },
      {
        formula: 'A full column rank ⟹ AᵀA positive definite',
        why: 'Because xᵀAᵀAx = ‖Ax‖² > 0 when Ax ≠ 0. This is why no row exchange is ever needed.',
      },
      {
        formula: 'E = I with one entry below the diagonal',
        why: 'An elementary matrix. EA performs one row operation; det E = 1 and it is always invertible.',
      },
      {
        formula: 'EₘEₘ₋₁⋯E₁A = U,  so A = LU',
        why: 'Products and inverses of lower-triangular matrices stay lower triangular, so the whole elimination collapses into one L.',
      },
      {
        formula: 'QᵀQ = U(L⁻¹)ᵀ, upper triangular AND symmetric ⟹ diagonal',
        why: 'The closing argument. Diagonal means distinct columns of Q have zero inner product — they are orthogonal.',
      },
    ],
    quiz: [
      {
        q: 'Which of these is NOT one of the three properties a norm must have?',
        options: [
          'Absolutely homogeneous: ‖λx‖ = |λ|‖x‖',
          'Triangle inequality: ‖x + y‖ ≤ ‖x‖ + ‖y‖',
          'Bilinear: linear in each argument separately',
          'Positive definite: ‖x‖ = 0 only when x = 0',
        ],
        answer: 2,
        explain:
          'Bilinearity is a property of inner products, which take two arguments. A norm takes only one vector, so there is nothing for it to be bilinear in. The other three are exactly the list on slide 2.',
      },
      {
        q: 'For x = (3, 4), what are ‖x‖₁ and ‖x‖₂?',
        options: ['7 and 5', '5 and 7', '7 and 7', '12 and 5'],
        answer: 0,
        explain:
          '‖x‖₁ = |3| + |4| = 7, the distance walked on a grid. ‖x‖₂ = √(9 + 16) = √25 = 5, the straight line. The Manhattan norm is always the larger of the two, or equal when the vector lies along an axis.',
      },
      {
        q: 'Ω is bilinear. What is Ω(2x, 2y) in terms of Ω(x, y)?',
        options: ['2Ω(x, y)', '4Ω(x, y)', 'Ω(x, y)', '½Ω(x, y)'],
        answer: 1,
        explain:
          'Pull the 2 out of the first slot, then out of the second: 2·2·Ω(x, y) = 4Ω(x, y). Bilinear means linear in each slot separately, so scaling both picks the factor up twice. This is the most common misreading of the word.',
      },
      {
        q: 'A = [[1, 2], [0, 1]]. Is ⟨x, y⟩ = xᵀAy an inner product?',
        options: [
          'Yes',
          'No — it is not bilinear',
          'No — it is not symmetric, since a₁₂ ≠ a₂₁',
          'No — it is not positive definite',
        ],
        answer: 2,
        explain:
          'Any xᵀAy is bilinear, whatever A is. But symmetry needs A = Aᵀ, and here a₁₂ = 2 while a₂₁ = 0. Check with x = (1,0), y = (0,1): ⟨x, y⟩ = 2 but ⟨y, x⟩ = 0.',
      },
      {
        q: 'A symmetric matrix has a₁₁ = 1, a₂₂ = 1 and a₁₂ = a₂₁ = 3. Is it positive definite?',
        options: [
          'Yes — the diagonal is positive',
          'No — det A = 1 − 9 = −8, which is not positive',
          'Yes — it is symmetric',
          'You cannot tell without the eigenvalues',
        ],
        answer: 1,
        explain:
          'A positive diagonal is necessary but nowhere near sufficient. Here det A = −8, and x = (1, −1) gives xᵀAx = 1 − 6 + 1 = −4. The 2×2 test needs both a₁₁ > 0 and det A > 0.',
      },
      {
        q: 'Why must a symmetric positive-definite matrix have full rank?',
        options: [
          'Because it is symmetric',
          'Because Ax = 0 would give xᵀAx = 0, contradicting xᵀAx > 0 for x ≠ 0',
          'Because its determinant is 1',
          'Because it is square',
        ],
        answer: 1,
        explain:
          'If some non-zero x had Ax = 0, multiplying on the left by xᵀ would give xᵀAx = 0, which positive definiteness forbids. So the nullspace contains only 0, its dimension is 0, and by rank–nullity the rank is full.',
      },
      {
        q: 'Which norm does NOT come from any inner product?',
        options: [
          'The Euclidean norm ‖·‖₂',
          'The Manhattan norm ‖·‖₁',
          'Both come from inner products',
          'Neither does',
        ],
        answer: 1,
        explain:
          'Slide 7 names the Manhattan norm exactly for this. Every inner product induces a norm through ‖x‖ = √⟨x, x⟩, but the arrow only runs one way. The test is the parallelogram law, which ‖·‖₁ fails: for x = (1,0), y = (0,1) the two sides come to 8 and 4.',
      },
      {
        q: 'In the proof of Cauchy–Schwarz, why is ‖u − αv‖² ≥ 0 useful?',
        options: [
          'Because it is true only for the right α',
          'Because it is true for every α, so it is true for the α that makes it smallest',
          'Because it equals zero',
          'Because α is always positive',
        ],
        answer: 1,
        explain:
          'That is the whole trick. A statement holding for all α holds in particular for the worst case, and substituting α = uᵀv/vᵀv — the bottom of the parabola — turns the inequality into Cauchy–Schwarz after multiplying through by vᵀv.',
      },
      {
        q: 'When does |⟨x, y⟩| = ‖x‖‖y‖ hold with equality?',
        options: [
          'Never',
          'When x and y are orthogonal',
          'When x and y are parallel — one is a multiple of the other',
          'Only when both are unit vectors',
        ],
        answer: 2,
        explain:
          'Equality means the parabola ‖u − αv‖² actually touches zero, so u − αv = 0 for some α, which says u is a multiple of v. Orthogonality is the opposite extreme: there the inner product is 0, as far from the bound as possible.',
      },
      {
        q: 'x and y sit very close together. What happens to d(x, y) and to ⟨x, y⟩?',
        options: [
          'Both get small',
          'Both get large',
          'The distance gets small and the inner product gets large',
          'The distance gets large and the inner product gets small',
        ],
        answer: 2,
        explain:
          'This is the warning slide 10 ends on. The two measures run in opposite directions: small distance means similar, while a small inner product means unrelated. ‖x − y‖² = ‖x‖² − 2⟨x, y⟩ + ‖y‖² shows why — the inner product enters with a minus sign.',
      },
      {
        q: 'Why is it legal to write cos ω = ⟨x, y⟩/(‖x‖‖y‖)?',
        options: [
          'Because cosine is periodic',
          'Because Cauchy–Schwarz keeps the ratio inside [−1, 1], where cos⁻¹ is defined',
          'Because the inner product is symmetric',
          'Because ω is always acute',
        ],
        answer: 1,
        explain:
          'Cosine only takes values in [−1, 1], so the ratio has to land there for an angle to exist. Cauchy–Schwarz guarantees exactly that. Note the angle is being defined by this equation, not measured — the inequality is what makes the definition well posed.',
      },
      {
        q: 'x = (1, 1) and y = (−1, 1). Under the inner product xᵀAy with A = [[2,0],[0,1]], what is cos ω?',
        options: ['0', '−1/3', '1/3', '−1'],
        answer: 1,
        explain:
          'xᵀAy = 2(1)(−1) + (1)(1) = −1. xᵀAx = 2 + 1 = 3 and yᵀAy = 2 + 1 = 3. So cos ω = −1/√(3·3) = −1/3, giving about 109.5°. Under the plain dot product the same two vectors are orthogonal — the inner product decides.',
      },
      {
        q: 'Two vectors are orthogonal under the dot product. Are they orthogonal under every inner product?',
        options: [
          'Yes, orthogonality is a property of the vectors',
          'No — orthogonality depends on which inner product is used',
          'Only if they are unit vectors',
          'Only in two dimensions',
        ],
        answer: 1,
        explain:
          'Slide 14 says this explicitly and slides 15–16 demonstrate it. Being at right angles is a property of two vectors AND a chosen inner product, not of the vectors alone. Change A and right angles move.',
      },
      {
        q: 'A is a square matrix with AᵀA = I. What is A⁻¹?',
        options: ['A', 'Aᵀ', 'I', 'It may not exist'],
        answer: 1,
        explain:
          'AᵀA = I says Aᵀ is a left inverse, and for a square matrix the left and right inverses must coincide, so Aᵀ = A⁻¹ and AAᵀ = I too. That is also why orthonormal columns force orthonormal rows.',
      },
      {
        q: 'What does an orthogonal matrix do to lengths and angles?',
        options: [
          'Preserves lengths but not angles',
          'Preserves angles but not lengths',
          'Preserves both',
          'Changes both',
        ],
        answer: 2,
        explain:
          '‖Ax‖² = xᵀAᵀAx = xᵀIx = ‖x‖², so lengths survive. The angle is a ratio whose numerator becomes xᵀAᵀAy = xᵀy and whose denominator is two unchanged lengths — so every piece is left alone. Picture a rotation: a rigid motion.',
      },
      {
        q: 'What extra thing does an orthonormal basis have that a merely orthogonal one does not?',
        options: [
          'Its vectors are linearly independent',
          'Its vectors span the space',
          'Each vector has length 1',
          'Its vectors are mutually perpendicular',
        ],
        answer: 2,
        explain:
          'Both kinds are mutually perpendicular, independent and spanning. Orthonormal adds ⟨bᵢ, bᵢ⟩ = 1 — unit length. Dividing each vector by its own length converts one into the other.',
      },
      {
        q: 'Why is an orthonormal basis worth the trouble of building?',
        options: [
          'It is the only kind of basis that spans the space',
          'Coordinates become single inner products instead of a system to solve',
          'It has fewer vectors',
          'It makes the vectors longer',
        ],
        answer: 1,
        explain:
          'In a general basis, finding coordinates means solving a system of equations. In an orthonormal one, v = Σ⟨v, bᵢ⟩bᵢ — one inner product per coordinate. In a thousand dimensions that is the difference between a hard computation and an easy one.',
      },
      {
        q: 'In the deck’s Gram–Schmidt method, what do you row-reduce?',
        options: ['[ A | I ]', '[ AᵀA | Aᵀ ]', '[ A | Aᵀ ]', '[ AAᵀ | A ]'],
        answer: 1,
        explain:
          'Put the basis vectors in as the columns of A, then FORWARD-eliminate [AᵀA | Aᵀ] — clearing below each pivot only. The left half ends upper triangular, not as the identity: slide 22’s answer still has 0.8 in the top row. The rows of the right half are then orthogonal, and normalising them gives an orthonormal basis. Carrying on to the identity would change the first row to (0.5, −0.5) and destroy the orthogonality.',
      },
      {
        q: 'In the deck’s method, slide 22 stops at [1, 0.8 | 0.3, 0.1] and [0, 1 | −0.25, 0.75]. Why not carry on and clear the 0.8?',
        options: [
          'It makes no difference to the answer',
          'Because clearing above the pivot destroys the orthogonality — the first row would become (0.5, −0.5)',
          'Because the matrix would become singular',
          'Because 0.8 is not a whole number',
        ],
        answer: 1,
        explain:
          'The elimination is applying L⁻¹, which is lower triangular and only clears below pivots. Clearing the 0.8 applies an upper-triangular operator as well, and the argument QᵀQ = U(L⁻¹)ᵀ breaks. Concretely the first row becomes (0.3, 0.1) − 0.8(−0.25, 0.75) = (0.5, −0.5), and (0.5, −0.5)·(−0.25, 0.75) = −0.5, not 0. Forward elimination only.',
      },
      {
        q: 'Gram–Schmidt on v₁ = (3,1) and v₂ = (2,2) gives right-hand rows (0.3, 0.1) and (−0.25, 0.75). What is their dot product?',
        options: ['0.15', '0', '−0.075', '1'],
        answer: 1,
        explain:
          '0.3(−0.25) + 0.1(0.75) = −0.075 + 0.075 = 0, exactly. As fractions they are (3/10, 1/10) and (−1/4, 3/4), giving −3/40 + 3/40 = 0. Orthogonal, which is the whole point of the method.',
      },
      {
        q: 'Why is AᵀA positive definite when A has full column rank?',
        options: [
          'Because AᵀA is always symmetric',
          'Because xᵀAᵀAx = ‖Ax‖², which is > 0 whenever Ax ≠ 0 — and independent columns mean Ax = 0 only for x = 0',
          'Because A is square',
          'Because det A ≠ 0',
        ],
        answer: 1,
        explain:
          'xᵀAᵀAx = (Ax)ᵀ(Ax) = ‖Ax‖², a squared length. Full column rank means Ax = 0 only for x = 0, so for every other x the value is strictly positive. This matters because positive-definite matrices never need row exchanges during elimination.',
      },
      {
        q: 'What does multiplying A on the left by an elementary matrix E do?',
        options: ['A column operation', 'A row operation', 'Transposes A', 'Inverts A'],
        answer: 1,
        explain:
          'Pre-multiplication acts on rows; post-multiplication AE would act on columns. E is the identity with one extra entry, and EA performs exactly one "subtract a multiple of one row from another".',
      },
      {
        q: 'Why does Gaussian elimination give A = LU?',
        options: [
          'Because U is always the identity',
          'Because each step is a lower-triangular matrix, and products and inverses of those stay lower triangular',
          'Because A is symmetric',
          'Because L is orthogonal',
        ],
        answer: 1,
        explain:
          'Each elimination step is an elementary matrix with its extra entry below the diagonal, so it is lower triangular. Their product is lower triangular, and so is its inverse — call it L. Then L⁻¹A = U rearranges to A = LU.',
      },
      {
        q: 'QᵀQ is shown to be upper triangular, and it is also symmetric. What follows?',
        options: [
          'It is the identity',
          'It is diagonal, so distinct columns of Q are orthogonal',
          'It is lower triangular',
          'Q is invertible',
        ],
        answer: 1,
        explain:
          'Upper triangular means everything below the diagonal is 0; symmetry copies those zeros above it. Nothing survives off the diagonal. The off-diagonal entries are the inner products of distinct columns of Q, so those are zero — the columns are orthogonal. That is the closing argument of the lecture.',
      },
    ],
    exam: [
      {
        q: 'Define a norm on a vector space, state its three defining properties, and give two examples with their unit balls.',
        meta: 'Definition plus examples · 5–6 marks',
        points: [
          'A norm is a function ‖·‖ : V → ℝ, x ↦ ‖x‖, assigning a length to each vector, subject to three conditions holding for all λ ∈ ℝ and all x, y ∈ V.',
          'Absolutely homogeneous: ‖λx‖ = |λ|‖x‖. The absolute value is essential — scaling by a negative number does not shorten a vector.',
          'Triangle inequality: ‖x + y‖ ≤ ‖x‖ + ‖y‖.',
          'Positive definite: ‖x‖ ≥ 0, with ‖x‖ = 0 if and only if x = 0.',
          'Manhattan (or L1) norm: ‖x‖₁ = Σᵢ₌₁ⁿ |xᵢ|. Its unit ball in ℝ² is a diamond with vertices on the axes.',
          'Euclidean (or L2) norm: ‖x‖₂ = √(Σᵢ₌₁ⁿ xᵢ²). Its unit ball in ℝ² is the unit circle.',
          'Worked comparison: for x = (3, 4), ‖x‖₁ = 7 while ‖x‖₂ = 5. In general ‖x‖₁ ≥ ‖x‖₂, with equality only when x lies along a coordinate axis.',
        ],
      },
      {
        q: 'Define a bilinear mapping and an inner product, and state the theorem connecting inner products to symmetric positive-definite matrices.',
        meta: 'Definitions plus the representation theorem · 6–8 marks',
        points: [
          'A mapping Ω : V × V → ℝ takes two vectors and returns a real number.',
          'Ω is bilinear if it is linear in each argument separately: Ω(λx + ψy, z) = λΩ(x, z) + ψΩ(y, z), and Ω(x, λy + ψz) = λΩ(x, y) + ψΩ(x, z), for all scalars λ, ψ.',
          'Ω is symmetric if Ω(x, y) = Ω(y, x) for all x, y ∈ V.',
          'Ω is positive definite if Ω(x, x) > 0 for all x ∈ V \\ {0}, and Ω(0, 0) = 0.',
          'A positive-definite, symmetric bilinear mapping is called an inner product, written ⟨x, y⟩; the pair (V, ⟨·,·⟩) is an inner product space.',
          'Theorem: for a real-valued finite-dimensional V with an ordered basis B, a mapping ⟨·,·⟩ : V × V → ℝ is an inner product if and only if there is a symmetric positive-definite A ∈ ℝⁿˣⁿ with ⟨x, y⟩ = x̂ᵀAŷ, where x̂ and ŷ are the coordinates of x and y with respect to B.',
          'The statement is an equivalence, so choosing an inner product on V is the same as choosing a symmetric positive-definite matrix. Taking A = I recovers the ordinary dot product xᵀy.',
          'Note that bilinearity alone is insufficient: xᵀAy is bilinear for every A, but symmetry additionally requires A = Aᵀ and positive definiteness requires xᵀAx > 0 for all x ≠ 0.',
        ],
      },
      {
        q: 'Show that a symmetric positive-definite matrix has full rank and strictly positive diagonal entries.',
        meta: 'Two short proofs from the definition · 5 marks',
        points: [
          'Both results follow from the defining property xᵀAx > 0 for all x ≠ 0, by choosing a convenient x.',
          'Full rank: suppose Ax = 0 for some x. Multiplying on the left by xᵀ gives xᵀAx = xᵀ0 = 0.',
          'But positive definiteness requires xᵀAx > 0 for every x ≠ 0, so the only possibility is x = 0.',
          'Hence the nullspace of A is {0}, its dimension is 0, and by rank–nullity rank(A) = n − 0 = n, which is full.',
          'Positive diagonal: take x = eᵢ, the i-th canonical basis vector. Then eᵢᵀAeᵢ = Aᵢᵢ, since eᵢ selects row i and column i.',
          'Since eᵢ ≠ 0, positive definiteness gives Aᵢᵢ > 0 for every i.',
          'The converse fails: a positive diagonal does not imply positive definiteness. For A = [[1,3],[3,1]] the diagonal is positive but det A = −8, and x = (1, −1) gives xᵀAx = −4.',
        ],
      },
      {
        q: 'State and prove the Cauchy–Schwarz inequality, and explain what it makes possible.',
        meta: 'Statement, proof and consequence · 6–8 marks',
        points: [
          'Statement: for any two vectors in an inner product space, |⟨x, y⟩| ≤ ‖x‖·‖y‖.',
          'Proof: for any vectors u, v and any scalar α, the quantity ‖u − αv‖² is a squared length and therefore satisfies ‖u − αv‖² ≥ 0.',
          'Expanding, ‖u − αv‖² = (u − αv)ᵀ(u − αv) = uᵀu − 2α(uᵀv) + α²(vᵀv) ≥ 0.',
          'This holds for every α, so in particular for the α minimising the left-hand side, namely α = uᵀv / vᵀv.',
          'Substituting gives uᵀu − 2(uᵀv)²/(vᵀv) + (uᵀv)²/(vᵀv) = uᵀu − (uᵀv)²/(vᵀv) ≥ 0.',
          'Multiplying through by vᵀv > 0 yields (uᵀu)(vᵀv) ≥ (uᵀv)², and taking square roots gives the stated inequality.',
          'The proof uses only bilinearity, symmetry and ⟨w, w⟩ ≥ 0, so it holds for any inner product, not merely the dot product.',
          'Consequence: dividing by ‖x‖‖y‖ gives −1 ≤ ⟨x, y⟩/(‖x‖‖y‖) ≤ 1, which is exactly the range of cosine. This permits the definition cos ω = ⟨x, y⟩/(‖x‖‖y‖) with a unique ω ∈ [0, π].',
          'Equality holds precisely when u − αv = 0 for some α, that is when the two vectors are linearly dependent.',
        ],
      },
      {
        q: 'Define the metric induced by an inner product, state its properties, and contrast it with the inner product itself.',
        meta: 'Definition, properties and interpretation · 5–6 marks',
        points: [
          'For an inner product space (V, ⟨·,·⟩), the distance between x and y is d(x, y) = ‖x − y‖ = √(⟨x − y, x − y⟩).',
          'When the inner product is the dot product this is the Euclidean distance. The mapping d : V × V → ℝ is called a metric.',
          'Positive definite: d(x, y) ≥ 0 for all x, y, and d(x, y) = 0 if and only if x = y.',
          'Symmetric: d(x, y) = d(y, x) for all x, y ∈ V.',
          'Triangle inequality: d(x, z) ≤ d(x, y) + d(y, z) for all x, y, z ∈ V.',
          'Contrast: although both are symmetric and both carry a positive-definiteness condition, they behave oppositely. When x and y are close together the distance is small but the inner product is large; when they are far apart the distance is large but the inner product is small.',
          'The identity ‖x − y‖² = ‖x‖² − 2⟨x, y⟩ + ‖y‖² makes this explicit: the inner product enters the distance with a negative sign, so for vectors of fixed length, maximising the inner product is the same as minimising the distance.',
        ],
      },
      {
        q: 'Define orthogonality, and show by example that it depends on the choice of inner product.',
        meta: 'Definition plus the deck’s worked example · 5–6 marks',
        points: [
          'Two vectors x and y are orthogonal if and only if ⟨x, y⟩ = 0, written x ⊥ y. Equivalently cos ω = 0, so ω = π/2.',
          'By this definition the zero vector is orthogonal to every vector, since ⟨0, y⟩ = 0 always.',
          'Orthogonality is defined relative to a particular inner product, and vectors orthogonal with respect to one need not be orthogonal with respect to another.',
          'Example: x = [1, 1]ᵀ and y = [−1, 1]ᵀ. Under the dot product, ⟨x, y⟩ = (1)(−1) + (1)(1) = 0, so x ⊥ y.',
          'Now take ⟨x, y⟩ = xᵀAy with A = [[2, 0], [0, 1]], which is symmetric with a₁₁ = 2 > 0 and det A = 2 > 0, hence a valid inner product.',
          'Then xᵀAy = 2x₁y₁ + x₂y₂ = 2(1)(−1) + (1)(1) = −1, while xᵀAx = 2 + 1 = 3 and yᵀAy = 2 + 1 = 3.',
          'Hence cos ω = −1 / (√3 · √3) = −1/3, giving ω = cos⁻¹(−1/3) ≈ 109.5°. The two vectors are no longer orthogonal, although neither has moved.',
          'Interpretation: the matrix A weights the first coordinate twice as heavily, which is equivalent to stretching that axis. Stretching does not preserve angles.',
        ],
      },
      {
        q: 'Define an orthogonal matrix and prove that it preserves both lengths and angles.',
        meta: 'Definition plus two proofs · 6 marks',
        points: [
          'A square matrix A ∈ ℝⁿˣⁿ is orthogonal if and only if its columns are orthonormal, equivalently AᵀA = I = AAᵀ, equivalently Aᵀ = A⁻¹.',
          'Note the terminology: an orthogonal matrix requires orthonormal columns — mutually orthogonal and each of unit length — not merely orthogonal ones.',
          'The columns are orthonormal because the (i, j) entry of AᵀA is the inner product of columns i and j; equating this to I gives 1 for i = j and 0 otherwise.',
          'The rows are orthonormal too: AᵀA = I makes Aᵀ a left inverse and AAᵀ = I makes it a right inverse. For a square matrix, if BA = I = AC then B = B(AC) = (BA)C = C, so the two coincide.',
          'Lengths: ‖Ax‖² = (Ax)ᵀ(Ax) = xᵀAᵀAx = xᵀIx = xᵀx = ‖x‖², so ‖Ax‖ = ‖x‖ for every x.',
          'Angles: cos ω between Ax and Ay is (Ax)ᵀ(Ay)/(‖Ax‖‖Ay‖) = xᵀAᵀAy/(‖x‖‖y‖) = xᵀy/(‖x‖‖y‖), which is the cosine of the angle between x and y.',
          'Example: the 2-D rotation matrix [[cos θ, −sin θ], [sin θ, cos θ]] is orthogonal for every θ. Geometrically an orthogonal transformation is a rigid motion — a rotation or a reflection.',
        ],
      },
      {
        q: 'Define an orthonormal basis and describe the Gram–Schmidt procedure using Gaussian elimination, with a worked example.',
        meta: 'Definition plus method and example · 8 marks',
        points: [
          'For an n-dimensional space V with basis {b₁, …, bₙ}, the basis is orthonormal if ⟨bᵢ, bⱼ⟩ = 0 for all i ≠ j and ⟨bᵢ, bᵢ⟩ = 1 for all i.',
          'If only the first condition holds — mutually orthogonal but not of unit length — the basis is called orthogonal. Dividing each vector by its own norm converts one into the other.',
          'An orthonormal basis is not unique: the canonical basis is one, and rotating it produces another. The canonical basis of ℝⁿ is orthonormal under the dot product.',
          'Its main advantage is that coordinates become inner products: v = Σᵢ ⟨v, bᵢ⟩ bᵢ, with no system of equations to solve.',
          'Method: place the given basis vectors as the columns of a matrix A, form the augmented matrix [AᵀA | Aᵀ], and perform forward Gaussian elimination — clearing entries below each pivot only, so the left block finishes upper triangular rather than as the identity. The rows of the right-hand block are then mutually orthogonal, and normalising them gives an orthonormal basis.',
          'The restriction to forward elimination is essential, not cosmetic: the elimination applies L⁻¹, which is lower triangular, and the justification QᵀQ = U(L⁻¹)ᵀ depends on that. Continuing to reduced row echelon form would additionally apply an upper-triangular operator and the columns would no longer be orthogonal.',
          'Worked example with v₁ = (3, 1)ᵀ and v₂ = (2, 2)ᵀ: A = [[3, 2], [1, 2]], so AᵀA = [[10, 8], [8, 8]] and Aᵀ = [[3, 1], [2, 2]].',
          'Reducing [[10, 8 | 3, 1], [8, 8 | 2, 2]] gives [[1, 0.8 | 0.3, 0.1], [0, 1 | −0.25, 0.75]].',
          'Check: (0.3)(−0.25) + (0.1)(0.75) = −0.075 + 0.075 = 0, so the two rows are orthogonal.',
          'Normalising gives u₁ = (3/√10, 1/√10) and u₂ = (−1/√10, 3/√10), an orthonormal basis of ℝ².',
          'The method requires A to have full column rank, since this is what makes AᵀA positive definite and hence eliminable without row exchanges.',
        ],
      },
      {
        q: 'Explain how elementary matrices lead to the factorisation A = LU, and use this to justify the Gram–Schmidt procedure.',
        meta: 'The full closing argument · 8 marks',
        points: [
          'An elementary matrix E is an identity matrix with a single additional non-zero entry below the diagonal. Pre-multiplying, EA, subtracts a multiple of one row from a row below it — exactly one step of Gaussian elimination.',
          'For instance, subtracting twice row 1 from row 2 of a 3 × 3 matrix is achieved by E = [[1,0,0], [−2,1,0], [0,0,1]].',
          'A full elimination is therefore a product: Eₘ Eₘ₋₁ ⋯ E₁ A = U, where U is upper triangular.',
          'The product of lower-triangular matrices is lower triangular, and the inverse of a lower-triangular matrix is lower triangular. Writing that product as L⁻¹ gives L⁻¹A = U, hence A = LU.',
          'Applying this to the Gram–Schmidt set-up: A has the basis vectors as columns, and AᵀA is symmetric and positive definite (since xᵀAᵀAx = ‖Ax‖² > 0 for x ≠ 0 when A has full column rank), so it needs no row exchanges and factorises as AᵀA = LU.',
          'Elimination on [AᵀA | Aᵀ] applies L⁻¹ to both blocks, giving [U | L⁻¹Aᵀ]. Write Qᵀ = L⁻¹Aᵀ.',
          'Then QᵀQ = L⁻¹Aᵀ(L⁻¹Aᵀ)ᵀ = L⁻¹(AᵀA)(L⁻¹)ᵀ = L⁻¹(LU)(L⁻¹)ᵀ = U(L⁻¹)ᵀ.',
          'U is upper triangular and (L⁻¹)ᵀ is upper triangular, being the transpose of a lower-triangular matrix, so their product QᵀQ is upper triangular.',
          'But QᵀQ is also symmetric, since (MᵀM)ᵀ = MᵀM for any M. A matrix that is simultaneously upper triangular and symmetric must be diagonal, because symmetry copies the zeros below the diagonal into the positions above it.',
          'The off-diagonal entries of QᵀQ are the inner products of distinct columns of Q, so those inner products vanish: the columns of Q are orthogonal, and normalising them yields an orthonormal basis. This is precisely the QR decomposition.',
        ],
      },
    ],
  },

  mllec1: {
    cheat: [
      {
        formula: 'data + program → output',
        why: 'Traditional programming. A person worked out the rule and wrote it down.',
      },
      {
        formula: 'data + output → program',
        why: 'Machine learning. Two boxes swap. The program that comes out is the model.',
      },
      {
        formula: 'ML ⊂ AI ⊂ tools of data science',
        why: 'Every ML method is AI; plenty of AI does no learning at all.',
      },
      {
        formula: '⟨T, P, E⟩',
        why: 'A well-defined learning task: task, performance measure, experience. Mitchell’s definition.',
      },
      {
        formula: 'learns if P at T improves with E',
        why: 'The improvement is what makes it learning. A program that never gets better has not learnt.',
      },
      {
        formula: 'T recognise handwriting · P % correct · E labelled images',
        why: 'Deck example 1. Know all four examples — they are standard exam fare.',
      },
      {
        formula: 'T checkers · P % games won · E games played against itself',
        why: 'Example 3. Note E is not a dataset — the program generates its own experience.',
      },
      {
        formula: 'P = distance travelled BEFORE AN ERROR',
        why: 'Example 4. Drop the last three words and the best strategy is to drive fast into a wall. A gameable P will be gamed.',
      },
      {
        formula: 'use ML when expertise does not exist',
        why: 'Navigating on Mars — nobody has done it, so there is no expert to copy.',
      },
      {
        formula: 'use ML when humans cannot explain their expertise',
        why: 'Biometrics. You recognise a face and cannot say how.',
      },
      {
        formula: 'use ML when models must be customised',
        why: 'Personalised medicine. One hand-written rule cannot serve every patient.',
      },
      {
        formula: 'no need to “learn” to calculate payroll',
        why: 'The deck’s counter-example. When the rule is exact and known, learning only adds error.',
      },
      {
        formula: 'features = attributes = predictors',
        why: 'Three names for the input columns. The target is the one you would not know for a new case.',
      },
      {
        formula: 'supervised = feedback',
        why: 'Every example carries its right answer. Labelled data, external supervision.',
      },
      { formula: 'unsupervised = no feedback', why: 'No labels anywhere. The machine discovers the output itself.' },
      {
        formula: 'reinforcement = delayed feedback',
        why: 'Rewards and penalties, arriving long after the action. No predefined data at all.',
      },
      {
        formula: 'given (x₁,y₁)…(xₙ,yₙ) learn f(x); y categorical',
        why: 'Classification. Goal: previously unseen records assigned a class as accurately as possible.',
      },
      {
        formula: 'given (x₁,y₁)…(xₙ,yₙ) learn f(x); y real-valued',
        why: 'Regression. Word for word the same except for the type of y — that one change is the whole distinction.',
      },
      {
        formula: 'x can be multi-dimensional',
        why: 'Each dimension one attribute. The threshold becomes a boundary; nothing else changes.',
      },
      {
        formula: 'given x₁…xₙ without labels, output hidden structure',
        why: 'Unsupervised. No y in the definition, so there is no accuracy to compute.',
      },
      {
        formula: 'intra-cluster small, inter-cluster large',
        why: 'The clustering goal, in the deck’s own words. The two things you trade off.',
      },
      {
        formula: 'unsupervised CAN have a test phase',
        why: 'Slide 43. Assign a new point to the cluster with the closer centroid. Easy marks, easily missed.',
      },
      {
        formula: 'observe → act → reward → update policy → iterate',
        why: 'The RL loop from slide 47. Step 5, updating the policy, is where learning happens.',
      },
      {
        formula: 'semi-supervised = a few labels + many unlabelled',
        why: 'Google Photos: it groups faces itself, you name each group once.',
      },
      {
        formula: 'batch · mini-batch · online',
        why: 'All the data, a subset, or one instance per update. Based on how training data is used.',
      },
      {
        formula: 'instance based: compare to known points',
        why: 'Keep the examples. Cheap to train, slow to predict. k-NN.',
      },
      {
        formula: 'model based: detect patterns, build a model',
        why: 'Boil the examples into a rule and discard them. Slow to train, fast to predict.',
      },
      {
        formula: 'accuracy ↑ ⟹ interpretability ↓, roughly',
        why: 'Slide 55 — and it labels itself “unscientific & opinionated”. Random forest is the exception.',
      },
      {
        formula: 'should I use ML? → pattern? → analytic? → data?',
        why: 'The first four workflow steps, each answerable “no”. Only then does any modelling start.',
      },
      {
        formula: 'generalisation = performance on unseen data',
        why: 'The last word of the car-price example, and the only score that counts.',
      },
    ],
    quiz: [
      {
        q: 'In machine learning, what does the computer produce that traditional programming required as an input?',
        options: ['The data', 'The output', 'The program', 'The hardware'],
        answer: 2,
        explain:
          'Traditional programming: data + program → output. Machine learning: data + output → program. The program that comes out is what everyone calls the model, and nobody ever writes down the rule it found.',
      },
      {
        q: 'Which nesting does the deck give on slide 11?',
        options: [
          'AI ⊂ machine learning ⊂ data science',
          'Machine learning ⊂ AI ⊂ data science',
          'Data science ⊂ machine learning ⊂ AI',
          'They are three separate fields that do not overlap',
        ],
        answer: 1,
        explain:
          'Machine learning is a subset of AI, and AI is one of the things data science draws on. So every ML method is AI, but a chess engine that searches without learning is AI and not ML.',
      },
      {
        q: 'A well-defined learning task is given by ⟨T, P, E⟩. What is E?',
        options: ['The error rate', 'The experience it learns from', 'The evaluation set', 'The expected output'],
        answer: 1,
        explain:
          'T is the task, P is the performance measure, E is the experience. In the checkers example E is "games played against itself" — note that E need not be a dataset somebody collected.',
      },
      {
        q: 'For "drive on public four-lane highways", the deck gives P as "average distance travelled before an error". Why not just "distance travelled"?',
        options: [
          'Distance is harder to measure',
          'Because a model maximising plain distance would be rewarded for driving fast and badly',
          'Because distance is not a number',
          'There is no difference',
        ],
        answer: 1,
        explain:
          'The phrase "before an error" is doing all the work. A performance measure that can be satisfied without doing the task will be — the model optimises exactly what you asked for, not what you meant.',
      },
      {
        q: 'Which of these does the deck give as a reason NOT to use machine learning?',
        options: [
          'Human expertise does not exist',
          'Humans cannot explain their expertise',
          'Calculating payroll',
          'Models must be customised',
        ],
        answer: 2,
        explain:
          'The other three are the deck’s three reasons TO use it. Payroll is its counter-example: the rule is known, exact and written in a contract, so learning it from examples could only introduce error.',
      },
      {
        q: 'What does the deck give as the challenge of the traditional, rule-based spam filter?',
        options: [
          'It cannot catch any spam',
          'It is too slow to run',
          'It becomes a long list of complex rules, hard to maintain',
          'It needs too much training data',
        ],
        answer: 2,
        explain:
          'Not that it fails — that it rots. Each new spammer trick means another rule somebody must notice, write, test and keep working. The learned filter is described as shorter, easier to maintain and "most likely" more accurate.',
      },
      {
        q: 'In the market segmentation table (zip code, family income, visits, money spent), which column is the target?',
        options: ['Money spent in a month', 'Family income', 'Zip code', 'There is no target column'],
        answer: 3,
        explain:
          'Nobody has labelled any customer as a big or low spender — that is what you are trying to discover. No target means this is an unsupervised problem, and even the number of groups is not given.',
      },
      {
        q: 'Classification and regression differ in exactly one respect. Which?',
        options: [
          'Classification uses labels and regression does not',
          'Whether y is categorical or real-valued',
          'Classification is supervised and regression is unsupervised',
          'The number of features',
        ],
        answer: 1,
        explain:
          'Both are supervised, both are given (x, y) pairs, both learn f(x) to predict y. The definitions are word for word the same apart from the type of y — categorical gives classification, real-valued gives regression.',
      },
      {
        q: 'On the tumour example, is there a threshold that classifies every patient correctly?',
        options: [
          'Yes, at the midpoint',
          'No — the two groups overlap, so every threshold trades a missed cancer against a false alarm',
          'Yes, if you use more decimal places',
          'Only if the data is normalised',
        ],
        answer: 1,
        explain:
          'The groups overlap in tumour size, so no single cut separates them. Which mistake is worse is a medical question, not a mathematical one — which is exactly why accuracy is a poor P here.',
      },
      {
        q: 'What is the goal of clustering, in the deck’s own words?',
        options: [
          'Maximise accuracy on the test set',
          'Intra-cluster distances minimised and inter-cluster distances maximised',
          'Minimise the number of clusters',
          'Find the labels that were hidden',
        ],
        answer: 1,
        explain:
          'Points inside a group close together, different groups far apart. There are no labels, so there is no accuracy to maximise — the objective has to be written in distances instead.',
      },
      {
        q: 'Can unsupervised learning make a prediction for a new, unseen point?',
        options: [
          'No — it has no labels, so it cannot predict anything',
          'Yes — assign it to the cluster whose centroid is closer',
          'Only if you label it first',
          'Only for regression problems',
        ],
        answer: 1,
        explain:
          'Slide 43 says so explicitly: given a new cat/dog image, predict which of the two clusters it belongs to, by assigning it to the cluster with the closer centroid. Unsupervised learning too can have a test phase.',
      },
      {
        q: 'What makes the feedback in reinforcement learning "delayed"?',
        options: [
          'The computer is slow',
          'The reward may arrive long after the action that earned it, so working out which action deserves credit is part of the problem',
          'The agent only learns at the end of training',
          'The labels arrive after the data',
        ],
        answer: 1,
        explain:
          'RL is for problems where decision making is sequential and the goal is long-term. The move that lost the game may have been forty moves ago, and nothing told you at the time.',
      },
      {
        q: 'What is a policy in reinforcement learning?',
        options: [
          'The reward function',
          'The agent’s rule for choosing an action given a state',
          'The set of training labels',
          'The environment’s response',
        ],
        answer: 1,
        explain:
          'The policy is what the agent improves. Step 5 of the loop on slide 47 is "update policy (learning step)" — the reward is used to make good choices more likely next time.',
      },
      {
        q: 'Google Photos groups faces automatically, then you name one photo per group. Which kind of learning is that?',
        options: ['Supervised', 'Unsupervised', 'Semi-supervised', 'Reinforcement'],
        answer: 2,
        explain:
          'It combines the two: the grouping is unsupervised and needs no labels, and naming a group is the supervised half. The deck gives exactly this example for partially labelled data.',
      },
      {
        q: 'Which uses a single training instance at a time?',
        options: ['Batch learning', 'Mini-batch learning', 'Online (incremental) learning', 'Model-based learning'],
        answer: 2,
        explain:
          'Batch uses all available data at a time, mini-batch uses a subset, online uses one instance. Online is what lets a model keep learning after deployment, which matters when the thing you are predicting drifts.',
      },
      {
        q: 'k-nearest neighbours stores the training examples and compares new points to them. Which type is that?',
        options: ['Model based', 'Instance based', 'Reinforcement', 'Semi-supervised'],
        answer: 1,
        explain:
          'Instance based: compare new data points to known data points. It does almost nothing at training time and all the work at prediction time — the opposite of model-based learning, which builds a rule and discards the data.',
      },
      {
        q: 'The chart on slide 55 plots accuracy against interpretability. What warning does the slide carry?',
        options: [
          'That the results are from a peer-reviewed study',
          'That it is “unscientific and opinionated”',
          'That it applies only to small datasets',
          'It carries no warning',
        ],
        answer: 1,
        explain:
          'The slide labels itself unscientific and opinionated, and notes it is "on real-world data sets". The trade-off it shows is real and worth knowing; the exact positions are one practitioner’s impression and should be quoted as such.',
      },
      {
        q: 'What is the first question in the ML workflow on slide 57?',
        options: [
          'Which algorithm should I use?',
          'Should I use ML on this problem at all?',
          'How much data do I have?',
          'What is my accuracy target?',
        ],
        answer: 1,
        explain:
          'It comes before everything else, and it can be answered no. The next three — is there a pattern, can I solve it analytically, do I have data — can also end the project. Only after all four does any modelling start.',
      },
      {
        q: 'In the car-price example, what does the deck call evaluating on the test set?',
        options: ['Optimisation', 'Exploratory data analysis', 'Generalisation', 'Preprocessing'],
        answer: 2,
        explain:
          'Generalisation — how the model behaves on records it has never seen. It is the same idea the classification and regression slides both stated as their goal, and the only score that means anything.',
      },
      {
        q: 'What does the course say it is NOT about?',
        options: [
          'Supervised learning',
          'Unstructured data analytics and time-series/sequence data',
          'Mathematical foundations',
          'Model evaluation',
        ],
        answer: 1,
        explain:
          'Slide 5 names both as out of scope. The focus is strong mathematical foundations of ML algorithms and structured analytics on IID data — independent and identically distributed.',
      },
    ],
    exam: [
      {
        q: 'Define machine learning, contrast it with traditional programming, and state Mitchell’s ⟨T, P, E⟩ formulation with two examples.',
        meta: 'Definitions plus contrast and examples · 6–8 marks',
        points: [
          'Machine learning is the science and art of programming computers so they can learn from data.',
          'Arthur Samuel’s more general definition: the field of study that gives computers the ability to learn without being explicitly programmed.',
          'Contrast: in traditional programming, data and a program are supplied and the computer produces output; in machine learning, data and output are supplied and the computer produces the program, which is called the model.',
          'Engineering definition: algorithms that improve their performance P at some task T with experience E. A program learns from experience E with respect to tasks T and performance measure P if its performance at T, as measured by P, improves with E.',
          'A well-defined learning task is therefore given by the triple ⟨T, P, E⟩.',
          'Example: T = recognising hand-written words; P = percentage of words correctly classified; E = a database of human-labelled images of handwritten words.',
          'Example: T = playing checkers; P = percent of games won against opponents; E = games played against itself. Note that E need not be a collected dataset.',
          'The choice of P is critical, since a learner optimises exactly what P rewards. In the driving example P is "average distance travelled before an error"; without the qualifying clause, the measure would reward speed irrespective of safety.',
        ],
      },
      {
        q: 'State the circumstances in which machine learning is and is not appropriate, with justification.',
        meta: 'Criteria with examples · 5–6 marks',
        points: [
          'ML is appropriate when human expertise does not exist — for example navigating on Mars, where there is no expert to imitate.',
          'When humans cannot explain the expertise they possess — biometrics and face recognition, which people perform reliably and cannot describe as a rule.',
          'When models must be customised to the individual case — personalised medicine, where one fixed rule cannot serve every patient.',
          'When a task cannot be defined well except by examples: it is very hard to write a program to recognise a handwritten digit, since one cannot say what distinguishes a 2 from a 7.',
          'When relationships and correlations are hidden in data too large for explicit encoding by humans, such as medical diagnosis, and when new knowledge arrives continuously so that any fixed rule set becomes stale.',
          'ML is not appropriate when the rule is already known exactly: the deck’s example is that there is no need to "learn" to calculate payroll.',
          'Correspondingly, the ML workflow asks early whether the problem can be solved analytically; an exact solution is preferable to a learned approximation.',
        ],
      },
      {
        q: 'Compare supervised, unsupervised and reinforcement learning across definition, type of problem, type of data, training and approach.',
        meta: 'The comparison table, reproduced and explained · 8 marks',
        points: [
          'The classification is by the feedback available to the learner: full feedback gives supervised learning, no feedback gives unsupervised, and delayed feedback in the form of rewards or penalties gives reinforcement learning.',
          'Supervised — definition: the machine learns by using labelled data. Problems: regression and classification. Data: labelled. Training: external supervision. Approach: maps the labelled inputs to the known outputs.',
          'Unsupervised — definition: the machine is trained on unlabelled data without any guidance. Problems: association and clustering. Data: unlabelled. Training: no supervision. Approach: understands patterns and discovers the output.',
          'Reinforcement — definition: an agent interacts with its environment by performing actions and learning from errors or rewards. Problems: reward-based. Data: no predefined data. Training: no supervision. Approach: follows the trial-and-error method.',
          'Semi-supervised learning combines the first two and operates on partially labelled data — a little labelled and much unlabelled, as in a photo hosting service that groups faces and then accepts one name per group.',
          'Supervised learning subdivides by the type of target: a continuous target gives regression (for example housing price prediction), a categorical target gives classification (for example medical imaging).',
          'Unsupervised subdivides into clustering (customer segmentation) and association (market basket analysis); reinforcement covers classification-style tasks such as optimised marketing and control tasks such as driverless cars.',
          'The branch is determined by the data available rather than by the algorithm, which is why classification appears under supervised, semi-supervised and reinforcement branches alike.',
        ],
      },
      {
        q: 'Define supervised classification and regression formally, and describe a typical supervised learning workflow.',
        meta: 'Definitions plus pipeline · 6–8 marks',
        points: [
          'Classification: given (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ), learn a function f(x) to predict y given x, where y is categorical.',
          'Regression: identical, except that y is real-valued. The type of the target is the only difference between the two.',
          'In both cases the stated goal concerns unseen data: previously unseen records should be assigned a class, or a value, as accurately as possible.',
          'x may be multi-dimensional, each dimension corresponding to one attribute — for the tumour example, clump thickness, uniformity of cell size, uniformity of cell shape, age and tumour size.',
          'Training phase: labelled training examples pass through feature extraction; the resulting features, together with their labels, are used in the training step to produce a learned model.',
          'Testing phase: an unseen test example passes through the same feature extraction, and the learned model converts those features into a prediction.',
          'The feature extraction must be identical in both phases, and the test data must be genuinely held back; evaluating on data used for training measures memorisation rather than generalisation.',
          'Supervised techniques covered by the course: linear regression, logistic regression, naïve Bayes classifiers, support vector machines, decision trees and random forests, and neural networks.',
        ],
      },
      {
        q: 'Describe unsupervised learning, state its objective, and explain how it can make predictions despite having no labels.',
        meta: 'Definition, objective and the test phase · 5–6 marks',
        points: [
          'Unsupervised learning is given x₁, x₂, …, xₙ without labels, and must output the hidden structure behind the x’s — clustering being the principal example.',
          'There is no y in the definition, and consequently no notion of accuracy; the objective must be expressed in terms of the data itself.',
          'The stated goal is that intra-cluster distances are minimised and inter-cluster distances are maximised: members of a cluster should be close to one another, and distinct clusters should be far apart.',
          'Despite the absence of labels, a test phase is possible. Given a new instance, it can be assigned to the cluster whose centroid is closer, which constitutes a prediction.',
          'Clustering techniques named: k-means, hierarchical cluster analysis and expectation maximisation.',
          'Visualisation and dimensionality reduction techniques named: principal component analysis, kernel PCA, locally-linear embedding and t-distributed stochastic neighbour embedding.',
          'Applications include personalised recommendation systems, targeted marketing, spam filters, content management for hosted news, and campaigning.',
        ],
      },
      {
        q: 'Explain reinforcement learning, its loop, and how it differs from supervised learning.',
        meta: 'Mechanism plus contrast · 6 marks',
        points: [
          'Reinforcement learning is a feedback-based technique in which an agent learns automatically using feedback, without any labelled data.',
          'The agent learns to behave in an environment by performing actions and observing the results: good actions earn positive feedback, bad ones a penalty.',
          'The loop is: (1) observe the state; (2) select an action using the current policy; (3) perform the action; (4) receive a reward or penalty; (5) update the policy — the learning step; (6) iterate until an optimal policy is found.',
          'The policy is the agent’s rule for selecting an action given a state; improving it is what learning consists of here.',
          'The difference from supervised learning is that no correct answer is ever provided. The agent receives only a scalar reward, and must determine for itself which actions were responsible.',
          'The feedback is delayed: RL addresses problems in which decision making is sequential and the goal is long-term, such as game playing and robotics, so the action responsible for an outcome may lie far in the past.',
          'The deck’s analogy is with human learning: the agent faces a game-like situation, makes a series of decisions, and through trial and error learns what to do and what not to do; each reward reinforces the behaviour that produced it.',
        ],
      },
      {
        q: 'Classify learning by how training data is used, and by what the learner retains.',
        meta: 'Two orthogonal classifications · 5–6 marks',
        points: [
          'By how the training data is used: batch learning uses all available data at a time during training; mini-batch learning uses a subset at a time; online or incremental learning uses a single training instance at a time.',
          'The trade-off is between stability and cost: batch updates are the most stable and require all data in memory, online updates are noisy but require almost none and permit learning to continue after deployment.',
          'Online learning is the appropriate choice under concept drift, where the relationship being modelled changes over time and a model trained once becomes stale.',
          'By what the learner retains: instance-based learning compares new data points to known data points, retaining the training examples themselves.',
          'Model-based learning detects patterns in the training data and builds a predictive model, after which the training data is no longer required.',
          'Instance-based methods are inexpensive to train and expensive to query, since prediction requires searching the stored examples; model-based methods are the reverse.',
          'These two classifications are independent of the supervised/unsupervised/reinforcement division, and independent of one another.',
        ],
      },
      {
        q: 'Describe the machine learning workflow, and illustrate it with the used-car price example.',
        meta: 'The full workflow with an example · 6–8 marks',
        points: [
          'The workflow begins with questions that may terminate the project: should machine learning be used on this problem at all; is there a pattern to detect; can the problem be solved analytically; is data available.',
          'If those are cleared: gather and organise the data; preprocess, clean and visualise it; choose a model, a loss function and a regularisation scheme; optimise, including a search over hyper-parameters; and analyse performance and mistakes.',
          'The final step directs the practitioner to iterate back to the data-gathering step, or as far back as the analytic-solution question — the workflow is a loop rather than a linear sequence.',
          'Car price example — define the objective: predict the price of a used car from attributes such as mileage.',
          'Data gathering: survey data and past purchase data.',
          'Data preprocessing: form a training set and a test set; decide the representation of the input features and of the output. Exploratory data analysis follows.',
          'Choose the form of model: linear regression. Define system performance evaluation via an objective function.',
          'Optimise performance by setting appropriate parameters, then evaluate on the test set — that is, assess generalisation to unseen records.',
          'Note that only one of the eight steps selects an algorithm; the remainder concern problem formulation, data and evaluation.',
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

  ism3: {
    cheat: [
      {
        formula: 'P(A | B) = P(A ∩ B) / P(B)',
        why: 'The definition. Being told B happened makes B the new 100%; needs P(B) ≠ 0.',
      },
      {
        formula: 'P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)',
        why: 'The multiplication rule. The definition with the division cleared, both ways round.',
      },
      {
        formula: 'P(A ∩ B ∩ C) = P(A)·P(B | A)·P(C | A ∩ B)',
        why: 'Chained by treating A ∩ B as one event. Each factor is conditioned on everything to its left.',
      },
      {
        formula: 'P(A ∩ B′) = P(A) − P(A ∩ B)',
        why: '"A but not B", which is never given directly. A splits along the edge of B into two disjoint parts.',
      },
      { formula: 'A ∩ (A ∪ B) = A', why: 'Absorption. What makes P(A | A ∪ B) = P(A) / P(A ∪ B).' },
      {
        formula: 'B ⊆ A ⟹ P(B | A) = P(B)/P(A),  P(A | B) = 1',
        why: 'When one event sits inside another, A ∩ B is just B and one answer needs no arithmetic.',
      },
      {
        formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B) ⟺ P(A | B) = P(A)',
        why: 'Two statements of one fact. Not the same as mutually exclusive — that is the opposite.',
      },
      {
        formula: 'P(at least one) = 1 − P(none)',
        why: 'The complement route. One subtraction instead of adding up every case.',
      },
      {
        formula: 'P(B) = Σ P(Aᵢ)·P(B | Aᵢ)',
        why: 'Total probability. Needs the Aᵢ mutually exclusive and exhaustive.',
      },
      {
        formula: 'P(A | B) = P(B | A)·P(A) / P(B)',
        why: "Bayes' theorem. Work out the denominator with total probability first.",
      },
    ],
    quiz: [
      {
        q: 'Of 46,687 loan applicants, 32,219 are middle-aged and 27,368 of those did not default. What is the probability that an applicant did not default, given they are middle-aged?',
        options: ['27368 / 46687', '27368 / 32219', '32219 / 46687', '27368 / 38130'],
        answer: 1,
        explain:
          'Being told the applicant is middle-aged reduces the sample space to those 32,219 people, so the denominator is the column total, not the grand total. P(A ∩ B)/P(B) = (27368/46687) / (32219/46687), and the 46,687 cancels — leaving 27368/32219 ≈ 0.8494. Answer (d) is the reverse question, P(middle-aged | did not default).',
      },
      {
        q: 'A and B are mutually exclusive events, each with probability above zero. What is P(A | B)?',
        options: ['P(A)', '0', '1', 'Cannot be worked out without more information'],
        answer: 1,
        explain:
          'P(A | B) = P(A ∩ B)/P(B), and mutually exclusive means P(A ∩ B) = 0, so the whole thing is 0. This is worth holding onto because it shows exclusive events are strongly dependent, not independent: being told B happened tells you A definitely did not.',
      },
      {
        q: 'Every compact disc player is an audio component. P(audio) = 0.6 and P(CD player) = 0.05. What is P(CD player | audio)?',
        options: ['0.05', '0.0833', '0.12', '1'],
        answer: 1,
        explain:
          'Because the CD players sit inside the audio components, A ∩ B = B, so P(B | A) = P(B)/P(A) = 0.05/0.6 = 0.0833. Note it is larger than P(B) = 0.05: conditioning on a set that contains your event has ruled out all the video repairs, so the CD players are a bigger share of what remains.',
      },
      {
        q: 'Three adults are chosen with replacement from a group where 272 of 300 are right-handed. What is the quickest route to P(at least one is right-handed)?',
        options: [
          'Add the probabilities of exactly one, exactly two and exactly three',
          'Work out 1 − (28/300)³',
          'Work out 1 − (272/300)³',
          'Multiply 272/300 by three',
        ],
        answer: 1,
        explain:
          'The opposite of "at least one right-handed" is "all three left-handed", which is a single outcome: (28/300)³ = 0.0008. So the answer is 1 − 0.0008 = 0.9992. Option (c) subtracts the wrong thing — that is the complement of "all three right-handed".',
      },
      {
        q: 'Which condition is NOT required for P(B) = Σ P(Aᵢ)·P(B | Aᵢ) to hold?',
        options: [
          'The Aᵢ must be mutually exclusive',
          'The Aᵢ must cover the whole sample space',
          'The Aᵢ must all have the same probability',
          'Each P(Aᵢ) must be non-zero for its conditional to be defined',
        ],
        answer: 2,
        explain:
          'The slices may be any sizes at all — the petrol-station example uses 0.40, 0.35 and 0.25. What the theorem needs is that they do not overlap, so nothing gets counted twice, and that they leave nothing out, so no route to B is missed.',
      },
      {
        q: 'On a channel, P(1 transmitted) = 0.4, P(1 received | 1 transmitted) = 0.95 and P(1 received | 0 transmitted) = 0.10. Given a 1 is received, what is the probability a 1 was transmitted?',
        options: ['0.95', '0.44', '0.863', '0.40'],
        answer: 2,
        explain:
          'First total probability: P(B) = 0.95(0.4) + 0.10(0.6) = 0.44. Then Bayes: P(A | B) = 0.95(0.4)/0.44 = 0.863. Note it is well below the channel’s 0.95 reliability, because 1s are the rarer signal — that gap is the base rate at work.',
      },
      {
        q: 'A test is 99% accurate for a disease that affects 1 person in 10,000. Someone tests positive. Roughly what is the chance they have it?',
        options: ['About 99%', 'About 1%', 'About 50%', 'About 90%'],
        answer: 1,
        explain:
          'Out of a million people, about 100 have the disease and 99 of them test positive; of the 999,900 who do not, about 1% — nearly 10,000 people — also test positive. So P(disease | positive) ≈ 99/10099 ≈ 1%. The prior is doing all the work, which is the same effect that makes precision collapse on a rare class.',
      },
    ],
    exam: [
      {
        q: 'Define conditional probability and derive the multiplication rule for three events, P(A ∩ B ∩ C) = P(A)·P(B | A)·P(C | A ∩ B).',
        meta: 'Define & derive · ~8 marks',
        points: [
          'Define P(A | B) = P(A ∩ B)/P(B) for P(B) ≠ 0, and say what it means: B becomes the new sample space.',
          'Justify from counting: both sides of the ratio divide by |S|, which cancels, leaving the count in A ∩ B over the count in B.',
          'Rearrange to the two-event rule P(A ∩ B) = P(A)·P(B | A), noting the symmetric form P(B)·P(A | B).',
          'Apply the definition with A ∩ B as the conditioning event: P(C | A ∩ B) = P(C ∩ (A ∩ B)) / P(A ∩ B) = P(A ∩ B ∩ C)/P(A ∩ B).',
          'Multiply up and substitute P(A ∩ B) = P(A)P(B | A) to obtain the three-event result.',
          'State the condition P(A ∩ B) ≠ 0, and note the pattern generalises to n events.',
        ],
      },
      {
        q: 'Show that P(A | B) = P(A) and P(A ∩ B) = P(A)·P(B) are equivalent, and explain why mutually exclusive events with non-zero probability cannot be independent.',
        meta: 'Prove & distinguish · ~8 marks',
        points: [
          'Forwards: assume P(A | B) = P(A); substitute the definition P(A ∩ B)/P(B) = P(A) and multiply up to get P(A ∩ B) = P(A)P(B).',
          'Backwards: assume P(A ∩ B) = P(A)P(B); then P(A | B) = P(A)P(B)/P(B) = P(A), the P(B) cancelling.',
          'State the conditions: P(B) ≠ 0 for the conditional form; the product form needs none, which is why it is the better definition.',
          'Mutually exclusive means A ∩ B = ∅, so P(A ∩ B) = 0, while P(A)P(B) > 0 when both are positive — the two cannot be equal.',
          'Interpret: exclusivity is an extreme dependence, since A occurring determines that B did not.',
        ],
      },
      {
        q: 'State and prove the law of total probability, and use it with Bayes’ theorem on the binary channel: P(1 sent) = 0.4, P(1 received | 1 sent) = 0.95, P(0 received | 0 sent) = 0.90.',
        meta: 'State, prove & compute · ~10 marks',
        points: [
          'State: for a partition A₁ … Aₖ of S (mutually exclusive and exhaustive) and any event B, P(B) = Σ P(Aᵢ)P(B | Aᵢ).',
          'Proof: B = B ∩ S, then substitute S = A₁ ∪ … ∪ Aₖ and apply the distributive law to get B = (B ∩ A₁) ∪ … ∪ (B ∩ Aₖ).',
          'Justify adding: the pieces B ∩ Aᵢ are pairwise disjoint, since a common element would force Aᵢ ∩ Aⱼ ≠ ∅; then apply the third axiom.',
          'Replace each P(B ∩ Aᵢ) by P(Aᵢ)P(B | Aᵢ) using the multiplication rule.',
          'Compute P(1 received) = 0.95(0.4) + 0.10(0.6) = 0.44, noting P(1 received | 0 sent) = 1 − 0.90 = 0.10 by the complement rule.',
          'Apply Bayes: P(1 sent | 1 received) = 0.95(0.4)/0.44 = 0.863.',
          'Comment: the posterior 0.863 sits between the prior 0.4 and the reliability 0.95 — a rare signal needs strong evidence.',
        ],
      },
      {
        q: 'A two-way table gives counts by category and outcome. Explain how to read P(A | B) and P(B | A) from it, and why the two differ.',
        meta: 'Explain with an example · ~6 marks',
        points: [
          'Both are the same joint cell count on top; only the denominator changes — a row total for one, a column total for the other.',
          'The grand total cancels: P(A ∩ B)/P(B) = (n_AB/N)/(n_B/N) = n_AB/n_B, so it never appears in the answer.',
          'Worked instance: with 27,368 middle-aged non-defaulters, 32,219 middle-aged and 38,130 non-defaulters, P(no default | middle-aged) = 0.849 while P(middle-aged | no default) = 0.718.',
          'Conclude that the two are answers to different questions, and identify the confusion-matrix analogue: precision versus recall.',
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

  conditional: {
    cheat: [
      { formula: 'P(A | B) = P(A ∩ B) / P(B)', why: 'Conditioning shrinks the sample space to B and rescales.' },
      {
        formula: 'P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B)',
        why: 'The multiplication rule. Use whichever conditional the question hands you.',
      },
      { formula: 'P(A ∩ B′) = P(A) − P(A ∩ B)', why: '"A but not B". A splits along the edge of B.' },
      {
        formula: 'P(A | B) + P(A′ | B) = 1',
        why: 'Conditioning is still a probability, so complements still add to 1.',
      },
      {
        formula: 'independent ⟺ P(A ∩ B) = P(A)·P(B)',
        why: 'The news changes nothing. Equivalent to P(A | B) = P(A), and the opposite of mutually exclusive.',
      },
    ],
    quiz: [
      {
        q: 'P(A | B) = 0.8 and P(B) = 0.5. What is P(A ∩ B)?',
        options: ['0.8', '0.4', '1.6', 'Cannot be found from these'],
        answer: 1,
        explain:
          'Multiply the definition up: P(A ∩ B) = P(B)·P(A | B) = 0.5 × 0.8 = 0.4. Note that P(A) itself is still unknown — a conditional probability plus its condition gives you the intersection, not the individual event.',
      },
      {
        q: 'Why can P(A | B) be much larger than P(A)?',
        options: [
          'Because conditional probabilities are not real probabilities',
          'Because dividing by P(B) rescales the overlap against a smaller world',
          'Because P(A | B) counts outcomes twice',
          'It cannot — conditioning never increases a probability',
        ],
        answer: 1,
        explain:
          'Conditioning throws away every outcome outside B, so the overlap is measured against P(B) rather than against 1. When B is small the same overlap is a much bigger share of it. Conditioning can push a probability either way, or leave it alone — that last case is independence.',
      },
      {
        q: 'A classifier has 40 true positives, 10 false positives and 60 false negatives. Which quantity is 40/50?',
        options: [
          'Recall, P(predicted positive | actually positive)',
          'Precision, P(actually positive | predicted positive)',
          'Accuracy',
          'The false positive rate',
        ],
        answer: 1,
        explain:
          'The 50 is the predicted-positive total (40 + 10), so this conditions on the prediction: precision. Recall would divide by the actual-positive total, 40 + 60 = 100, giving 0.4. Same numerator, different denominators — the two directions of one conditional.',
      },
    ],
    exam: [
      {
        q: 'Define conditional probability from first principles and show that P(A | B) and P(B | A) are in general different.',
        meta: 'Define & explain · ~6 marks',
        points: [
          'Define P(A | B) = P(A ∩ B)/P(B), P(B) ≠ 0, and interpret it as restricting the sample space to B.',
          'Derive it by counting: both counts divide by |S|, which cancels, leaving |A ∩ B| / |B|.',
          'Note both conditionals share the numerator P(A ∩ B) but divide by different events, so they agree only when P(A) = P(B).',
          'Give a concrete asymmetry, such as P(rain | clouds) against P(clouds | rain), or precision against recall.',
          'State the multiplication rule linking them: P(B)P(A | B) = P(A)P(B | A), which is one step from Bayes.',
        ],
      },
    ],
  },

  bayes: {
    cheat: [
      {
        formula: 'S = A₁ ∪ … ∪ Aₖ,  Aᵢ ∩ Aⱼ = ∅',
        why: 'A partition: exhaustive and mutually exclusive. Both conditions are needed.',
      },
      { formula: 'P(B) = Σ P(Aᵢ)·P(B | Aᵢ)', why: 'Total probability. Every route to B, weighted by its slice.' },
      { formula: 'P(Aᵢ | B) = P(B | Aᵢ)·P(Aᵢ) / P(B)', why: 'Bayes. The line above supplies the denominator.' },
      {
        formula: 'P(A) = P(B)P(A | B) + P(B′)P(A | B′)',
        why: 'The two-slice case, and by far the most common in exams.',
      },
      {
        formula: 'posterior ∝ likelihood × prior',
        why: 'The denominator is the same for every hypothesis, so a comparison can ignore it.',
      },
    ],
    quiz: [
      {
        q: 'A job finishes on time with probability 0.42 if it rains and 0.90 if it does not. It rains with probability 0.45. What is the probability it finishes on time?',
        options: ['0.66', '0.684', '0.42', '0.90'],
        answer: 1,
        explain:
          'Rain and no rain partition the sample space, so P(on time) = 0.45 × 0.42 + 0.55 × 0.90 = 0.189 + 0.495 = 0.684. As a weighted average it must land between 0.42 and 0.90, which is a quick check on the arithmetic.',
      },
      {
        q: 'In Bayes’ theorem, what does the denominator P(B) represent?',
        options: [
          'The prior probability of the hypothesis',
          'How likely the observed evidence was, across all the hypotheses',
          'The probability the hypothesis is wrong',
          'A normalising constant with no meaning',
        ],
        answer: 1,
        explain:
          'P(B) is the evidence — the total probability of what you saw, summed over every slice of the partition. It is the same for every hypothesis you might compare, which is why implementations of naive Bayes skip it and rank the unnormalised products instead.',
      },
      {
        q: 'Four secretaries handle 20%, 60%, 15% and 5% of files and misfile them with probabilities 0.05, 0.1, 0.1 and 0.05. A misfiled report turns up. What is the chance the first secretary is to blame?',
        options: ['0.05', '0.20', '0.1143', '0.0100'],
        answer: 2,
        explain:
          'Total probability first: P(misfiled) = 0.2(0.05) + 0.6(0.1) + 0.15(0.1) + 0.05(0.05) = 0.0875. Then Bayes: 0.0100/0.0875 = 0.1143. Note it is below the 0.20 prior, because the first secretary is a careful one who handles few files.',
      },
    ],
    exam: [
      {
        q: 'State and prove the law of total probability, and derive Bayes’ theorem from it.',
        meta: 'State, prove & derive · ~10 marks',
        points: [
          'State the partition conditions: A₁ … Aₖ mutually exclusive with union S, and B any event.',
          'Begin the proof with B = B ∩ S, the step that lets the partition into the expression.',
          'Distribute: B = (B ∩ A₁) ∪ … ∪ (B ∩ Aₖ), citing the distributive law for sets.',
          'Argue the pieces are pairwise disjoint — a shared element would put Aᵢ and Aⱼ in contact — and apply the additivity axiom.',
          'Substitute P(B ∩ Aᵢ) = P(Aᵢ)P(B | Aᵢ) to reach P(B) = Σ P(Aᵢ)P(B | Aᵢ).',
          'For Bayes, equate the two forms of the multiplication rule P(Aᵢ)P(B | Aᵢ) = P(B)P(Aᵢ | B) and divide.',
          'Conclude P(Aᵢ | B) = P(B | Aᵢ)P(Aᵢ) / Σⱼ P(Aⱼ)P(B | Aⱼ), and name prior, likelihood, evidence and posterior.',
        ],
      },
      {
        q: 'Explain, with a numerical example, why a highly accurate test for a rare condition still produces mostly false positives.',
        meta: 'Explain & compute · ~6 marks',
        points: [
          'Set up: let the prevalence P(D) be small, and the test have high sensitivity P(+ | D) and high specificity P(− | D′).',
          'Apply total probability: P(+) = P(D)P(+ | D) + P(D′)P(+ | D′), noting the second term is small per person but multiplied by a very large group.',
          'Apply Bayes to obtain P(D | +) and show it is dominated by the prior when P(D) is small.',
          'Worked figures: prevalence 1 in 10,000 with 99% accuracy gives roughly 99 true positives against about 10,000 false ones, so P(D | +) ≈ 1%.',
          'Draw the ML parallel: precision on a rare class stays low however good the recall, because the prior sits in the numerator.',
        ],
      },
    ],
  },

  dl1: {
    cheat: [
      {
        formula: 'z = Σᵢ wᵢxᵢ,  x₀ = 1',
        why: 'The perceptron’s weighted sum, slide 53. x₀ is nailed to 1 so the threshold can be carried as the ordinary weight w₀.',
      },
      {
        formula: 'h = +1 if z > 0 ;  h = −1 if z ≤ 0',
        why: 'The activation. The ≤ matters: z exactly 0 gives −1, which is what makes the deck’s NOT-gate answer work.',
      },
      {
        formula: 'Δwᵢ = η(t − o)xᵢ,  wᵢ ← wᵢ + Δwᵢ',
        why: 'The perceptron learning rule, slide 66. Zero when t = o, so it learns only from mistakes.',
      },
      {
        formula: 'converges if linearly separable and η small',
        why: 'Slide 67. Both conditions. On non-separable data it does not fail loudly — it cycles forever.',
      },
      {
        formula: 'AND: w = (−1, 2, 2)   OR: w = (2, 2, 2)',
        why: 'The deck’s answers on slides 58 and 61, in the ±1 encoding. Check all four rows before quoting them.',
      },
      {
        formula: 'NOR: w = (−2, −2, −2)   NAND: w = (1, −2, −2)',
        why: 'The slide-60 exercise. Negate every weight of OR and of AND — negating the weights negates the output.',
      },
      {
        formula: 'NOT: w₀ − w₁ > 0 and w₀ + w₁ ≤ 0 ⟹ w = (1, −1)',
        why: 'Slide 56. Its printed second condition uses a strict <, but its own answer makes the sum exactly 0, so read it as ≤.',
      },
      {
        formula: 'PLA on NOT from w = 0, η = 1 ⟹ w₀ = 2, w₁ = −2',
        why: 'The trace on slide 69. Twice the hand answer, and the same boundary — scaling w never moves it.',
      },
      {
        formula: 'a perceptron is a hyperplane in ℝⁿ',
        why: 'Slide 72. One dimension fewer than the space, with w as its normal vector — at right angles to it, not on it.',
      },
      {
        formula: 'c(w · x + b) = 0 has the same solutions for any c > 0',
        why: 'Why two different-looking weight vectors can be the same classifier. Only the sign of z is reported.',
      },
      {
        formula: '2x₁ + 3x₂ − 25 = 0',
        why: 'The separable example, slide 75. All thirteen points check out; (0,0) is pink and (10,10) is white.',
      },
      {
        formula: 'XOR is not linearly separable',
        why: 'Both diagonals of the unit square share the midpoint (½, ½), and a linear score is average-preserving.',
      },
      {
        formula: 'XOR = OR and NAND',
        why: 'Slide 80’s hidden layer, read off: n₁ is OR, n₂ is NAND, n₃ is AND. Fires on sum ≥ threshold, in 0/1 outputs.',
      },
      {
        formula: 'data · model · objective · algorithm',
        why: 'The four components of any deep learning problem, slide 30. Remove one and there is no learning problem left.',
      },
      {
        formula: 'lower is better, by convention',
        why: 'Slide 34. It is why objective functions are called loss functions, and why training is always minimisation.',
      },
      {
        formula: 'squared error for numbers, error rate for categories',
        why: 'Slide 35’s two standard objectives. They can rank the same two models in opposite orders.',
      },
      {
        formula: 'overfitting = good on training, bad on unseen',
        why: 'Slide 36’s definition, word for word. The model has to generalise, and the training loss alone never tells you whether it does.',
      },
      {
        formula: 'depth = number of layers contributing to the model',
        why: 'Slide 15. Slide 12 draws the line for the word “deep” at three or more layers.',
      },
      {
        formula: 'DL ⊂ NN ⊂ ML ⊂ AI',
        why: 'Slide 13’s nested circles. Data science overlaps rather than nests, because plenty of it does no learning.',
      },
      {
        formula: '10¹⁰ neurons · 10⁴–10⁵ connections · 0.001 s switching',
        why: 'Slide 45. The argument is that a second of thought cannot be a long chain, so it must be massively parallel.',
      },
    ],
    quiz: [
      {
        q: 'A perceptron computes z = 0 for some input. What does it output?',
        options: ['+1', '−1', '0', 'Undefined — the input is on the boundary'],
        answer: 1,
        explain:
          'Slide 53 writes h = 1 only if the sum is strictly greater than 0, and h = −1 if it is less than or equal to 0. So exactly zero gives −1. The trace on slide 69 confirms it: its first row has z = 0 and prints h = −1.',
      },
      {
        q: 'Why is the input x₀ fixed at 1?',
        options: [
          'To normalise the other inputs',
          'So the threshold can be carried as the ordinary weight w₀ and every comparison is against zero',
          'Because a perceptron needs an odd number of inputs',
          'To make the weight vector a unit vector',
        ],
        answer: 1,
        explain:
          'Firing when w₁x₁ + w₂x₂ > θ is the same as firing when w₁x₁ + w₂x₂ − θ > 0. Setting w₀ = −θ on a constant input of 1 folds the threshold into the weights, so the rule always compares against zero.',
      },
      {
        q: 'The perceptron learning rule is run on data that is not linearly separable. What happens?',
        options: [
          'It converges to the weights with the fewest mistakes',
          'It stops and reports failure',
          'It never settles — the weights keep changing indefinitely',
          'It converges, but only if η is small enough',
        ],
        answer: 2,
        explain:
          'Slide 54 says the rule can fail to converge if the examples are not linearly separable. Since no weight vector is correct, there is always a misclassified example to react to, so the update never becomes zero. It does not announce anything — it just never settles.',
      },
      {
        q: 'Training the NOT gate from w = 0 with η = 1 gives w₀ = 2, w₁ = −2. The hand solution on slide 56 was w₀ = 1, w₁ = −1. Which is right?',
        options: [
          'The trained one — the hand solution is an approximation',
          'The hand solution — the training run has not finished converging',
          'Both. They define the same boundary; only the length of w differs, and only the sign of z is reported',
          'Neither, because both make one row give z = 0',
        ],
        answer: 2,
        explain:
          'z = 1 − x₁ and z = 2 − 2x₁ are zero at the same place and have the same sign everywhere else. Scaling every weight by a positive constant scales z without changing its sign, and the perceptron reports nothing but that sign.',
      },
      {
        q: 'Which of these Boolean functions can a single perceptron NOT represent?',
        options: ['NAND', 'NOR', 'OR', 'XOR'],
        answer: 3,
        explain:
          'Slide 54 says a perceptron can represent AND, OR, NAND and NOR — all linearly separable — but not XOR, which is not. The proof is that both diagonals of the unit square share the midpoint (½, ½), and a linear score at a midpoint is the average of its values at the two ends.',
      },
      {
        q: 'In the XOR network of slide 80, what does the hidden unit n₂ compute?',
        options: ['AND', 'NAND', 'OR', 'NOR'],
        answer: 1,
        explain:
          'n₂ has weights −1 and −1 and threshold −1, so it fires when −x₁ − x₂ ≥ −1, that is when x₁ + x₂ ≤ 1. That is true for every input except (1, 1), which is NAND. n₁ is OR and n₃ is AND, so the network computes XOR = OR and NAND.',
      },
      {
        q: 'Two models are scored on the same five examples. Squared error prefers model A and error rate prefers model B. What has gone wrong?',
        options: [
          'One of the two measures has been computed incorrectly',
          'Nothing — they are different objectives measuring different things, and disagreement is expected',
          'The threshold must be wrong',
          'The data is not linearly separable',
        ],
        answer: 1,
        explain:
          'Squared error looks at how far each score is from the truth; error rate looks only at which side of the threshold it fell. A model that is right every time but barely, and a model that is confident and wrong once, are ranked differently by the two. "Which model is better" is not answerable until you say which measure you mean.',
      },
      {
        q: 'Why is the error rate almost never the function that gradient descent minimises?',
        options: [
          'It is too slow to compute',
          'It is not defined for regression',
          'It is flat everywhere and then jumps, so its derivative is zero wherever it exists',
          'It cannot be made lower-is-better',
        ],
        answer: 2,
        explain:
          'Nudging a weight usually moves no example across the threshold, so the count does not change at all — and then one crosses and it jumps. A slope of zero gives gradient descent nothing to follow, so a smooth stand-in like cross-entropy is optimised and the error rate is reported.',
      },
      {
        q: 'Slide 12 gives five definitions of deep learning. Which is the only one you can actually apply as a test?',
        options: [
          'Inspired by the human brain',
          'Teaches computers to learn by example',
          'A neural network with three or more layers',
          'Gets its name from adding more layers',
        ],
        answer: 2,
        explain:
          '"Inspired by the brain" is not a checkable property, and "learn by example" is the definition of machine learning generally. Counting layers is the only one that decides the question for a network in front of you.',
      },
      {
        q: 'A model’s training loss keeps falling while its loss on held-back data climbs. What is this called, and what should you do?',
        options: [
          'Underfitting — increase the model’s capacity',
          'Overfitting — reduce capacity, add regularisation, or stop earlier',
          'Divergence — reduce the learning rate',
          'Class imbalance — reweight the loss',
        ],
        answer: 1,
        explain:
          'Slide 36 defines overfitting as performing well on the training set and failing to generalise to unseen data. The instinct to make the model bigger is exactly wrong here; the fixes are weight decay, dropout, early stopping, or more data.',
      },
      {
        q: 'Doubling every weight of a perceptron, including the bias, does what to its decision boundary?',
        options: [
          'Moves it twice as far from the origin',
          'Rotates it by 90°',
          'Leaves it exactly where it was',
          'Makes it twice as steep',
        ],
        answer: 2,
        explain:
          'w · x + b = 0 and 2(w · x + b) = 0 have identical solution sets, so the boundary does not move. What changes is ‖w‖, which matters only once a smooth activation replaces the step — a larger ‖w‖ makes the model more confident, which is what weight decay is aimed at.',
      },
      {
        q: 'Slide 45 says a neuron switches in about 0.001 s and a scene is recognised in about 1 s, then concludes "100 inference steps". What is the issue?',
        options: [
          'None — 1 ÷ 0.001 is 100',
          '1 s ÷ 1 ms is 1000, not 100; the figure of 100 comes from 0.1 s, as in Mitchell chapter 4',
          'The switching time should be 0.01 s',
          'Inference steps are not the same as switches',
        ],
        answer: 1,
        explain:
          'The two lines on the slide do not agree. The division gives 1000 for the numbers printed; 100 corresponds to a recognition time of 0.1 second, which is the value in the Mitchell chapter the deck cites on slide 82. Either way the argument survives: a few hundred or a few thousand sequential steps cannot account for a second of thought, so the computation must be massively parallel.',
      },
    ],
    exam: [
      {
        q: 'State the definition of a perceptron and show how to represent the AND gate with one. Give the weights and verify them against every row of the truth table.',
        meta: 'Define & derive · ~8 marks',
        points: [
          'A perceptron takes a vector of real-valued inputs, computes a linear combination of them, and outputs 1 if the result exceeds a threshold and −1 otherwise.',
          'Write z = Σ wᵢxᵢ over i = 0, 1, 2 with x₀ = 1 always, so the threshold is carried as w₀; h = +1 if z > 0 and h = −1 if z ≤ 0.',
          'State the encoding being used: rewrite the 0/1 truth table into ±1, as slide 55 does, and say so before starting.',
          'Turn each row into an inequality: three rows require z < 0 and the (1, 1) row requires z > 0.',
          'Give the deck’s solution w₀ = −1, w₁ = w₂ = 2, and substitute each row back: −5, −1, −1 and +3.',
          'Note that the solution is not unique — the conditions are inequalities, so the answers form a region, and any positive multiple of a solution is a solution.',
          'Optionally give the boundary as x₁ + x₂ = ½, separating the single point (1, 1) from the other three.',
        ],
      },
      {
        q: 'Prove that XOR cannot be represented by a single perceptron, and describe a network that can.',
        meta: 'Prove & construct · ~10 marks',
        points: [
          'Suppose w₀, w₁, w₂ existed with z(x₁, x₂) = w₀ + w₁x₁ + w₂x₂ classifying XOR correctly.',
          'The points requiring +1 are (0,1) and (1,0), so z(0,1) > 0 and z(1,0) > 0; averaging gives z(½, ½) > 0 because z is linear.',
          'The points requiring 0 are (0,0) and (1,1), so both are ≤ 0; averaging gives z(½, ½) ≤ 0.',
          'Both diagonals of the unit square share the midpoint (½, ½), so z(½, ½) would be both greater than 0 and not greater than 0 — a contradiction, so no such weights exist.',
          'Conclude XOR is not linearly separable, and note slide 54’s consequence: the perceptron learning rule can fail to converge on such data, cycling indefinitely rather than halting.',
          'Construct the fix from slide 80: two inputs, a hidden layer of two units, one output unit; weights 1, 1 into n₁ with threshold 1, weights −1, −1 into n₂ with threshold −1, and weights 1, 1 into n₃ with threshold 2, firing when the sum reaches the threshold.',
          'Trace all four inputs to obtain outputs 0, 1, 1, 0, and identify the units: n₁ is OR, n₂ is NAND, n₃ is AND, so XOR = OR and NAND.',
          'State the general lesson: one hyperplane is not enough, and a hidden layer maps the data into coordinates where one hyperplane is.',
        ],
      },
      {
        q: 'State the perceptron learning rule, explain each symbol, and apply it to the NOT gate starting from zero weights with η = 1.',
        meta: 'Apply · ~10 marks',
        points: [
          'Write wᵢ ← wᵢ + Δwᵢ with Δwᵢ = η(t − o)xᵢ, where t is the target, o the perceptron output and η the learning rate.',
          'Explain that (t − o) is zero when the answer is right, so the rule learns only from mistakes; xᵢ scales the change by how involved that input was; η moderates the size of every step.',
          'Set up the NOT gate in the ±1 encoding: x₁ = −1 with t = +1, and x₁ = +1 with t = −1, with x₀ = 1 throughout.',
          'Row 1: z = 0 + 0(−1) = 0, so h = −1 since sign(0) = −1; t ≠ h, so Δw₁ = 1(1 − (−1))(−1) = −2 and Δw₀ = 1(1 − (−1))(1) = 2, giving w₁ = −2, w₀ = 2.',
          'Row 2: z = 2 + (−2)(1) = 0, so h = −1 = t; both updates are zero and the weights are unchanged.',
          'Row 3 (second pass): z = 2 + (−2)(−1) = 4, so h = +1 = t; no change. A whole pass has changed nothing, so it has converged at w₀ = 2, w₁ = −2.',
          'Observe this is twice the hand solution w₀ = 1, w₁ = −1 from slide 56, and explain that scaling w leaves the boundary and every prediction unchanged.',
          'State the convergence conditions from slide 67: the data must be linearly separable and η sufficiently small; η may be decayed as iterations increase.',
        ],
      },
      {
        q: 'Name the four core components of a deep learning problem and explain, for each, what fails without it.',
        meta: 'Explain · ~8 marks',
        points: [
          'The data that we can learn from; without it there is nothing to fit, and the objective has nothing to be evaluated on.',
          'A model of how to transform the data; without it there are no predictions to score and no parameters to adjust.',
          'An objective function quantifying how well or badly the model is doing; without it two settings of the parameters cannot be told apart, so none can be preferred.',
          'An algorithm to adjust the parameters to optimise the objective; without it the problem is well posed and unsolvable, since exhaustive search over millions of parameters is impossible.',
          'Add the convention that objectives are written so lower is better, which is why they are called loss functions.',
          'Name the usual choices: squared error for regression, error rate for classification, and gradient descent as the family every deep learning optimiser belongs to.',
          'Note the relation to Mitchell’s ⟨T, P, E⟩: E is the data, P is the objective with its sign flipped, T is what the model computes, and there is no letter for the optimisation algorithm.',
        ],
      },
      {
        q: 'Explain what it means for a perceptron to represent a hyperplane, and state precisely the role of the weight vector and of the bias.',
        meta: 'Explain · ~7 marks',
        points: [
          'A perceptron represents a hyperplane decision surface in the n-dimensional space of examples, outputting +1 on one side and −1 on the other (slide 72).',
          'A hyperplane has one dimension fewer than the space it sits in: a point in ℝ¹, a line in ℝ², a plane in ℝ³.',
          'The boundary is the set of x with w · x + b = 0; when b = 0 this is exactly the set of vectors orthogonal to w, so w is the normal vector — at right angles to the surface, not lying in it.',
          'Turning w tilts the boundary; changing b slides it along w without turning it. The perpendicular distance from the origin to the boundary is −b ÷ ‖w‖.',
          'Scaling w and b by the same positive constant leaves the boundary and every prediction unchanged, because only the sign of z is reported.',
          'Consequence: ‖w‖ is not a property of the classifier under a step activation, but becomes one under a sigmoid, where a large ‖w‖ makes the transition sharp — which is the mechanism weight decay acts on.',
          'Consequence: without the bias every boundary passes through the origin, and even the NOT gate cannot be represented.',
        ],
      },
      {
        q: 'Define overfitting, explain how it is detected, and describe how the choice of objective function can itself cause a model to behave badly.',
        meta: 'Define & discuss · ~8 marks',
        points: [
          'Overfitting is performing well on the training set while failing to generalise to unseen data (slide 36).',
          'Detection needs two numbers, not one: the loss on the training set and the loss on data held back from training. Overfitting is the training loss continuing to fall while the held-back loss rises.',
          'Distinguish underfitting: if the training loss is also poor, the model lacks capacity and should be made more flexible, not less.',
          'Name the standard cures: reduce capacity, add weight decay or dropout, stop early, or obtain more data. Note module 4 of the course is devoted to these.',
          'On objectives: the loss is defined with respect to the parameters and depends on the dataset, so a model optimises exactly the number it was given.',
          'Give a concrete failure: error rate treats a missed positive and a false alarm as equally costly, so a model minimising it will trade one for the other regardless of what the application needs.',
          'Give a second: squared error is minimised by the mean of the targets, so a few extreme or mislabelled targets pull every prediction with them; an absolute-error loss predicts the median instead.',
          'Conclude that the cure for a badly chosen objective is to change the objective — class weighting, a different loss, a moved threshold — not more training.',
        ],
      },
    ],
  },

  neuron: {
    cheat: [
      {
        formula: 'z = w₀·1 + w₁x₁ + … + wₙxₙ',
        why: 'The neuron’s score. A dot product of the weight vector with the input vector.',
      },
      { formula: 'h = +1 if z > 0, else −1', why: 'The threshold activation. Exactly zero counts as “else”.' },
      {
        formula: 'w₀ = −θ on x₀ = 1',
        why: 'How a threshold θ becomes an ordinary weight, so every comparison is against zero.',
      },
      {
        formula: 'w ⊥ the decision boundary',
        why: 'The boundary is where w · x = −w₀, so w points across it and never along it.',
      },
      {
        formula: 'no bias ⟹ boundary through the origin',
        why: 'Which makes even the NOT gate unrepresentable. This is why nn.Linear defaults to bias=True.',
      },
      {
        formula: 'nn.Linear(n, k) = k neurons over n inputs',
        why: 'A k × n weight matrix and a bias vector of length k. The forward pass is one matrix–vector product.',
      },
    ],
    quiz: [
      {
        q: 'What does the bias weight w₀ do to the decision boundary?',
        options: [
          'Rotates it',
          'Slides it without rotating it',
          'Scales the inputs',
          'Nothing — it only affects the output value',
        ],
        answer: 1,
        explain:
          'w₁ and w₂ set the direction of the normal vector, and therefore the tilt of the boundary. w₀ rides on a constant input, so changing it moves the boundary along that normal without turning it.',
      },
      {
        q: 'A neuron has w₁ = w₂ = 0 and w₀ = 3. What does it output?',
        options: ['+1 for every input', '−1 for every input', '+1 on one side of a line and −1 on the other', '0'],
        answer: 0,
        explain:
          'z = 3 for every input, which is greater than zero, so the output is +1 everywhere. With no direction to look along there is no boundary at all — the neuron has the same opinion about the whole space.',
      },
      {
        q: 'Why can gradient descent not be used to train a neuron with a step activation?',
        options: [
          'Because the step is not continuous at zero',
          'Because the step’s derivative is zero wherever it is defined, so there is no slope to follow',
          'Because the weights are not real numbers',
          'It can — that is what the perceptron rule does',
        ],
        answer: 1,
        explain:
          'A step is flat on both sides of the jump, so its derivative is zero everywhere it exists and the chain rule returns nothing usable. The perceptron rule sidesteps this by never differentiating anything — it just adds η(t − o)x. Sigmoid and ReLU exist to restore a usable slope.',
      },
    ],
    exam: [
      {
        q: 'Describe the artificial neuron precisely, explaining the role of each part, and show how the threshold is absorbed into the weights.',
        meta: 'Define & derive · ~7 marks',
        points: [
          'Inputs x₁ … xₙ, one weight per input, a summation and an activation function producing the output ŷ.',
          'The weight wᵢ says how much input i counts and in which direction; a negative weight argues against firing.',
          'Firing when Σᵢ₌₁ⁿ wᵢxᵢ > θ is the same as firing when Σ wᵢxᵢ − θ > 0.',
          'Define x₀ = 1 and w₀ = −θ; then the condition is Σᵢ₌₀ⁿ wᵢxᵢ > 0, so the threshold is carried as an ordinary weight and every comparison is against zero.',
          'Geometrically the boundary is w · x + w₀ = 0, a hyperplane whose normal vector is w; w₀ slides it and w tilts it.',
          'State the consequence: with no bias the boundary is forced through the origin, and even the NOT gate becomes unrepresentable.',
          'Relate to code: nn.Linear(n, k) holds a k × n weight matrix plus a length-k bias, so a layer is k of these neurons sharing the same inputs.',
        ],
      },
    ],
  },

  linsep: {
    cheat: [
      {
        formula: '∃ w, b : sign(w · xᵢ + b) = tᵢ for all i',
        why: 'Linearly separable: some hyperplane gets every example right. ∃ is “there exists”.',
      },
      { formula: 'separable + small η ⟹ the perceptron rule converges', why: 'Slide 67. Both conditions are needed.' },
      {
        formula: 'not separable ⟹ the rule cycles forever',
        why: 'It does not fail loudly. There is always a mistake, so the weights never settle.',
      },
      {
        formula: 'z(½a + ½b) = ½z(a) + ½z(b)',
        why: 'A linear score is average-preserving — the one line the XOR proof turns on.',
      },
      {
        formula: 'both diagonals of the square meet at (½, ½)',
        why: 'Which is why XOR forces one point to be both above and not above zero.',
      },
      {
        formula: 'add x₁x₂ ⟹ XOR separable in ℝ³',
        why: 'Separability is a property of the features, not of the problem. This is the kernel idea in miniature.',
      },
      {
        formula: 'AND, OR, NAND, NOR are separable; XOR is not',
        why: 'Slide 54. In each separable case one corner of the square is cut off from the other three.',
      },
    ],
    quiz: [
      {
        q: 'Is linear separability a property of the problem or of the features?',
        options: [
          'Of the problem — some problems simply are not separable',
          'Of the features — the same problem can be separable in one feature space and not in another',
          'Of the learning rate',
          'Of the number of training examples',
        ],
        answer: 1,
        explain:
          'XOR is not separable in (x₁, x₂), and is separable in (x₁, x₂, x₁x₂). Adding a feature changed nothing about the problem and everything about the answer. This is exactly what a kernel does, at scale.',
      },
      {
        q: 'The perceptron rule is run on non-separable data and the weights are still changing after ten thousand passes. What is the correct diagnosis?',
        options: [
          'The learning rate is too small',
          'This is expected: with no correct weight vector there is always a mistake, so it never converges',
          'The data must be normalised',
          'The implementation has a bug',
        ],
        answer: 1,
        explain:
          'Slide 54 warns that the rule can fail to converge if the examples are not linearly separable. Since no weights satisfy every example, the update is never zero for a whole pass. Nothing reports this — the only symptom is that it never settles.',
      },
      {
        q: 'Thirteen points are separated correctly by 2x₁ + 3x₂ − 25 = 0. Which of these is also a correct separator?',
        options: ['4x₁ + 6x₂ − 50 = 0', '3x₁ + 2x₂ − 25 = 0', '2x₁ + 3x₂ + 25 = 0', '−2x₁ − 3x₂ − 25 = 0'],
        answer: 0,
        explain:
          'Multiplying every coefficient by the same positive constant leaves the solution set — and the sign of the score at every point — unchanged. Swapping the coefficients tilts the line, changing the sign flips which side is which, and changing the constant slides it.',
      },
    ],
    exam: [
      {
        q: 'Define linear separability, state its relationship to the perceptron convergence theorem, and give two distinct ways of handling data that is not linearly separable.',
        meta: 'Define & discuss · ~9 marks',
        points: [
          'A labelled dataset is linearly separable when some hyperplane w · x + b = 0 has every example of one class strictly on one side and every example of the other on the other side.',
          'For a single perceptron this is exactly the condition for a correct weight vector to exist.',
          'State slide 67’s guarantee: the perceptron learning algorithm converges if the training data is linearly separable and the learning rate is sufficiently small.',
          'State the failure mode from slide 54: on non-separable data the rule can fail to converge, cycling indefinitely rather than halting or reporting anything.',
          'First remedy — change the feature space: adding the feature x₁x₂ makes XOR separable by a plane in ℝ³. Generalised, this is the kernel trick.',
          'Second remedy — add a hidden layer: several hyperplanes combined by a further unit, as in the XOR network where OR and NAND feed an AND.',
          'Mention a third, practical option: use a method that tolerates non-separability, such as logistic regression, which minimises a smooth loss and converges regardless.',
          'Note that when many separators exist, the margin — the width of the gap — is a principled way to choose between them, and a perceptron has no opinion about it.',
        ],
      },
    ],
  },

  lossfn: {
    cheat: [
      {
        formula: 'L(w) = Σᵢ (ŷᵢ − tᵢ)²',
        why: 'Squared error. The standard loss for a numerical target, and a bowl in the parameters.',
      },
      {
        formula: 'error rate = (1/m) Σᵢ [ŷᵢ ≠ tᵢ]',
        why: 'The fraction on the wrong side. It ignores how wrong each one was.',
      },
      {
        formula: 'lower is better, by convention',
        why: 'Which is why objective functions are called loss functions, and why training is always minimisation.',
      },
      {
        formula: 'squared error is minimised by the mean',
        why: 'So a squared-error model chases the average of the targets, and extreme labels drag every prediction with them.',
      },
      {
        formula: 'absolute error is minimised by the median',
        why: 'Swapping the loss changes what the model predicts, not just how fast it gets there.',
      },
      {
        formula: 'd(error rate)/dw = 0 almost everywhere',
        why: 'Flat, then a jump. No slope, so it is reported rather than optimised.',
      },
      {
        formula: 'optimise a surrogate, report the metric',
        why: 'Cross-entropy goes into loss.backward(); accuracy, precision and recall go into the report.',
      },
      {
        formula: 'the threshold is a hyperparameter',
        why: 'Moving it changes precision and recall without touching a single weight.',
      },
    ],
    quiz: [
      {
        q: 'Why are objective functions conventionally written so that lower is better?',
        options: [
          'Because losses cannot be negative',
          'So that every training problem is a minimisation and one piece of machinery solves all of them',
          'Because probabilities are between 0 and 1',
          'It is required by the chain rule',
        ],
        answer: 1,
        explain:
          'It is a convention and nothing more, but a useful one: with every objective written as something to minimise, gradient descent works unchanged on all of them. Slide 34 says exactly this, and adds that “loss function” is the name that follows from it.',
      },
      {
        q: 'A regression model trained with squared error is badly skewed by a handful of extreme targets. What is the most direct fix?',
        options: [
          'Train for longer',
          'Increase the learning rate',
          'Change the loss — absolute error predicts the median rather than the mean',
          'Add more layers',
        ],
        answer: 2,
        explain:
          'Squaring makes a point twice as far away count four times as much, and the minimiser of squared error is the mean. Absolute error weights every point equally and is minimised by the median, which is far less sensitive to a heavy tail. This is the same mean-against-median trade-off from the statistics course.',
      },
      {
        q: 'Your model reports 97% accuracy and users are unhappy because it misses the rare positive cases. What has gone wrong?',
        options: [
          'The model is underfitting',
          'The objective is wrong: accuracy treats a missed positive and a false alarm as equally costly',
          'The learning rate is too high',
          'The data is not linearly separable',
        ],
        answer: 1,
        explain:
          'Nothing is wrong with the training — the model optimised exactly what it was asked to. With a rare positive class, predicting the majority everywhere already scores highly. The cure is to change the objective: weight the classes, or move the threshold, both of which are decisions you make and not things training can infer.',
      },
    ],
    exam: [
      {
        q: 'Explain what an objective function is, why squared error and error rate can rank two models differently, and why error rate is not the function that gets minimised.',
        meta: 'Explain · ~8 marks',
        points: [
          'An objective function turns a model’s predictions on a dataset into a single number, arranged by convention so that lower is better — hence “loss function”.',
          'Squared error sums (prediction − truth)² and therefore measures how far each prediction is from the truth, penalising a large error far more than several small ones.',
          'Error rate counts the fraction of examples on the wrong side of a threshold and is indifferent to how far each one was.',
          'Give the mechanism for disagreement: a model that is confident and wrong once can have lower squared error than a model that is right every time but only barely, so the two orderings differ.',
          'Note that error rate depends on the threshold and squared error does not, so one of the two changes when the threshold moves and the other does not.',
          'Error rate is piecewise constant: nudging a weight moves no example across the boundary until suddenly one does, so its derivative is zero wherever it exists.',
          'Conclude that a smooth surrogate — cross-entropy for classification, squared error for regression — is minimised, and the error rate is reported.',
          'Add the statistical consequence: squared error is minimised by the mean of the targets and absolute error by the median, so the choice of loss decides what the model predicts.',
        ],
      },
    ],
  },

  dl2: {
    cheat: [
      {
        formula: 'z = Σᵢ₌₁ⁿ wᵢxᵢ + b',
        why: 'Equation (1). The bias is written outside the sum here — session 1 hid it inside as w₀ with x₀ = 1.',
      },
      {
        formula: 'ŷ = f(z)',
        why: 'Equation (2). f is deliberately left open: choosing it turns one unit into a perceptron, a regression or a hidden unit.',
      },
      {
        formula: 'ŷ = 1 if Σwᵢxᵢ + b ≥ 0, else 0',
        why: 'The perceptron, this deck’s version. Inputs 0/1, output 0/1, and it fires at exactly zero.',
      },
      {
        formula: 'wᵢ ← wᵢ + η(t − ŷ)xᵢ ,  b ← b + η(t − ŷ)',
        why: 'The learning algorithm, with the bias on its own line. η = 0.1 and weights start random.',
      },
      {
        formula: 'AND: w = (−1, 0.75, 0.75)',
        why: 'In this deck’s 0/1 encoding. Any equal pair between 0.5 and 1 works alongside w₀ = −1.',
      },
      {
        formula: 'OR: w = (−1, 2, 2)',
        why: 'Same bias as AND, larger weights. Note these are session 1’s AND weights — different encoding, different gate.',
      },
      {
        formula: 'NOR: (1, −2, −2) ·  NAND: (1, −0.75, −0.75)',
        why: 'The slide-30 exercise, worked out by negating OR and AND and checked against all four rows.',
      },
      {
        formula: 'PLA on NOT from w = 0, η = 1 ⟹ w₀ = 2, w₁ = −2',
        why: 'The deck’s trace. Taking its own definition of the tie-break instead gives (−2, −2) — both correct.',
      },
      { formula: 'h = wᵀx', why: 'Page 43. A row times a column: identical to Σ wᵢxᵢ and to the dot product ⟨w, x⟩.' },
      {
        formula: 'separable ⟺ an (n − 1)-dimensional hyperplane splits the classes',
        why: 'The deck’s definition, and it adds that infinitely many such hyperplanes exist whenever one does.',
      },
      {
        formula: 'converges in finite steps if linearly separable',
        why: 'The convergence theorem. On non-separable data it does not fail — it never stops.',
      },
      {
        formula: '14 of the 16 two-input Boolean functions',
        why: 'What one perceptron can represent. The two it cannot are XOR and XNOR.',
      },
      {
        formula: 'layer parameters = units × (inputs + 1)',
        why: 'One weight per connection plus one bias per unit. Sum over the layers for the model’s size.',
      },
      {
        formula: 'knowledge is in the connection weights',
        why: 'The connectionist principle. Learning modifies connection strengths and changes nothing else.',
      },
      {
        formula: 'adaptive synapses ↔ adjustable weights',
        why: 'The one row of the biological-versus-artificial table that is a genuine likeness rather than a simplification.',
      },
    ],
    quiz: [
      {
        q: 'This deck gives AND as w = (−1, 0.75, 0.75) and session 1 gives it as (−1, 2, 2). Which is right?',
        options: [
          'Session 1 — the later deck made an arithmetic error',
          'This deck — session 1 used an obsolete convention',
          'Both, in their own encodings. Session 1 uses ±1 inputs firing above zero; this deck uses 0/1 inputs firing at zero or above',
          'Neither; AND needs three weights and a threshold',
        ],
        answer: 2,
        explain:
          'The gate is the same and the encoding is not. Check (−1, 2, 2) against this deck’s 0/1 table: at (0, 1) the sum is 1, which is ≥ 0, so it fires — but AND(0, 1) is 0. Those three numbers are in fact this deck’s answer for OR.',
      },
      {
        q: 'Why does the learning algorithm on page 32 give the bias its own update line?',
        options: [
          'Because the bias is more important than the weights',
          'Because there is no constant input x₀ = 1 to carry it in this notation, so it needs its own line — which is the weight line with xᵢ set to 1',
          'Because the bias uses a different learning rate',
          'Because the bias is not really a parameter',
        ],
        answer: 1,
        explain:
          'Session 1 folded the bias into the sum as w₀ on a constant input, so one line covered everything. This deck writes z = Σwᵢxᵢ + b with the bias outside, so the update b += η(t − ŷ) has no xᵢ in it — because that xᵢ would have been 1.',
      },
      {
        q: 'Page 33 defines ŷ = 1 when h ≥ 0. Page 35 computes sign(0) = −1. What follows?',
        options: [
          'Nothing — sign(0) and “h ≥ 0” mean the same thing',
          'The deck contradicts itself, and the two readings give different converged weights: (2, −2) and (−2, −2), both correct NOT gates',
          'Page 35 is wrong and the trace should be discarded',
          'The learning rate must be reduced',
        ],
        answer: 1,
        explain:
          'Under the definition, h = 0 gives +1; under the working, −1. Running the algorithm both ways converges to different weights, and both classify the two training points correctly. The deck prints the answer that follows from its working, not from its definition.',
      },
      {
        q: 'A perceptron is trained on data that is not linearly separable. What is the symptom?',
        options: [
          'It converges to the weights with the fewest mistakes',
          'It raises an error',
          'The weights never stop changing, and nothing reports anything',
          'It converges more slowly than usual',
        ],
        answer: 2,
        explain:
          'No weight vector is correct, so on every pass there is a mistake and therefore an update. The convergence theorem only promises finite steps for separable data; the failure mode on non-separable data is an infinite loop, which is why the algorithm needs a maximum-iterations line.',
      },
      {
        q: 'How many of the 16 Boolean functions of two inputs can a single perceptron represent?',
        options: ['4', '8', '14', 'All 16'],
        answer: 2,
        explain:
          'All except XOR and XNOR. Both of those need the two diagonals of the unit square separated from each other, and the diagonals share a midpoint, so no linear function can put that point on both sides of zero at once.',
      },
      {
        q: 'A hidden layer of 8 units reads 5 inputs. How many parameters does that layer hold?',
        options: ['40', '45', '48', '13'],
        answer: 1,
        explain:
          '8 × (5 + 1) = 48? No — 8 × 5 = 40 weights plus 8 biases = 48. The rule is units × (inputs + 1), which is 8 × 6 = 48. Option 45 is wrong; the correct arithmetic is 48. Count weights and biases separately if the multiplication is not obvious.',
      },
      {
        q: 'Which row of the biological-versus-artificial table is a genuine likeness rather than a simplification?',
        options: [
          'Complex biochemical processes / simple mathematical model',
          'Analog signal processing / digital computation',
          'Adaptive synaptic strengths / adjustable weights',
          'Fault tolerant / deterministic behavior',
        ],
        answer: 2,
        explain:
          'Learning means changing connection strengths, in both systems, and nothing else changes. The others are the artificial version being cruder, differently motivated, or — in the last case — not even a comparison, since fault tolerance and determinism are not opposites.',
      },
      {
        q: 'What does switching off one unit of a trained network usually do to its output?',
        options: [
          'Breaks it completely, because each unit stores one fact',
          'Changes it a little, because every fact is spread across many units',
          'Nothing at all',
          'Reverses the prediction',
        ],
        answer: 1,
        explain:
          'That is what a distributed representation means, and it is why the deck says all world knowledge is stored in the connections. It is also why a network cannot be read — there is no single place any fact lives — and why dropout works as a regulariser.',
      },
      {
        q: 'The deck lists five conditions for using a neural network. Which is a warning rather than a benefit?',
        options: [
          'Input is high-dimensional',
          'The data may be noisy',
          'The form of the target function is unknown',
          'Explainability of the result is unimportant',
        ],
        answer: 3,
        explain:
          'It is written as a requirement: if you need to explain a decision, this method does not offer one. That follows directly from connectionism — the knowledge is spread across every weight, so there is nowhere to point. In credit, medicine or law this condition can rule the method out however well it scores.',
      },
      {
        q: 'Starting from zero weights on a 0/1 gate, what does changing η do to the learning algorithm’s run?',
        options: [
          'Changes which rows are misclassified at each step',
          'Scales all the weights but leaves every decision in the run identical',
          'Always makes it converge faster',
          'Nothing — η is ignored when weights start at zero',
        ],
        answer: 1,
        explain:
          'Every update adds exactly ±η times an input of 0 or 1, so the run stays on a grid of multiples of η. Multiplying z by a positive constant never changes its sign, so the same rows are wrong in the same order. Random initial weights break this, which is one reason the slide asks for them.',
      },
    ],
    exam: [
      {
        q: 'State the perceptron model as given in this session, derive the weights for the AND gate, and verify them against every row of the truth table.',
        meta: 'Define & derive · ~8 marks',
        points: [
          'State the encoding first: inputs in {0, 1}, and ŷ = 1 if Σᵢ wᵢxᵢ + b ≥ 0 and 0 otherwise. Say so before working, because a different session of this course uses a different convention.',
          'Write the perceptron equation with the bias as w₀ on a constant input: ŷ = w₀x₀ + w₁x₁ + w₂x₂ with x₀ = 1.',
          'Turn the four rows into conditions: w₀ < 0; w₀ + w₂ < 0; w₀ + w₁ < 0; and w₀ + w₁ + w₂ ≥ 0.',
          'Give a solution: w₀ = −1, w₁ = w₂ = 0.75, and note it is not unique — any equal pair c with 0.5 ≤ c < 1 works with w₀ = −1.',
          'Substitute each row back: −1, −0.25, −0.25 and +0.5, giving 0, 0, 0, 1 as required.',
          'Optionally give the boundary as 0.75x₁ + 0.75x₂ = 1, which cuts the corner (1, 1) off from the other three.',
        ],
      },
      {
        q: 'State the perceptron learning algorithm precisely, apply it to the NOT gate from zero weights with η = 1, and comment on any ambiguity you meet.',
        meta: 'Apply & discuss · ~10 marks',
        points: [
          'State the algorithm: initialise η and the weights, then for each example compute ŷ, and if ŷ ≠ t update wᵢ ← wᵢ + η(t − ŷ)xᵢ and b ← b + η(t − ŷ); repeat until convergence or a maximum number of iterations.',
          'State the convergence theorem: on linearly separable data the algorithm converges in finite steps.',
          'Set up the NOT gate in the ±1 encoding used on the relevant slide: x₁ = −1 with t = 1, and x₁ = 1 with t = −1, starting from w₀ = w₁ = 0.',
          'Note the ambiguity explicitly: the definition gives ŷ = 1 when h ≥ 0, and the deck’s worked arithmetic takes sign(0) = −1. State which you are using before continuing.',
          'Following sign(0) = −1: epoch 1 example 1 has h = 0 so ŷ = −1 ≠ t = 1; update gives w₁ = −2, w₀ = 2. The remaining three checks all pass with no change, so it converges at w₀ = 2, w₁ = −2.',
          'Following h ≥ 0 giving +1: example 1 passes without update, example 2 has h = 0 so ŷ = +1 ≠ t = −1 and the update gives w₀ = −2, w₁ = −2, which then converges.',
          'Verify whichever answer you give against both training rows, and note that both sets of weights are correct NOT gates.',
          'Observe that in each case the decision boundary lands exactly on a training point, so the answer depends on the tie-break — which is why the ambiguity matters.',
        ],
      },
      {
        q: 'Define linear separability, state its relationship to the perceptron, and explain what "an infinite number of separating hyperplanes" implies in practice.',
        meta: 'Define & discuss · ~8 marks',
        points: [
          'Two sets of points in n-dimensional space are linearly separable if some (n − 1)-dimensional hyperplane has one class strictly on each side.',
          'For a single perceptron this is exactly the condition for a correct weight vector to exist, and therefore the condition in the convergence theorem.',
          'Give the failure case: XOR, where no such line exists, and state the consequence that the learning algorithm cycles indefinitely rather than halting.',
          'On infinitude: if one separator exists, it can be tilted or shifted slightly and still separate, so there are infinitely many.',
          'The practical implication is that being correct on the training data does not pick out a single model, so something else must — and that something decides behaviour on unseen data.',
          'Name the standard resolution: prefer the separator with the widest margin, which is what a support vector machine computes, and note the perceptron has no opinion about it.',
          'Note that the perceptron’s answer therefore depends on its initialisation and on the order the examples are presented in.',
        ],
      },
      {
        q: 'Compare biological and artificial neurons, and explain what the connectionist principles claim.',
        meta: 'Compare & explain · ~7 marks',
        points: [
          'Map the four biological parts onto the artificial ones: dendrites to the inputs, synapses to the weights, cell body to the summation and activation, axon to the single output.',
          'Give the deck’s comparison rows: biochemical against mathematical, analog against digital, adaptive synapses against adjustable weights, parallel processing against parallel computation possible, learning through experience against learning through algorithms, fault tolerant against deterministic.',
          'Identify the third row as the genuine likeness — learning means changing connection strengths in both — and treat the others as simplifications or differences.',
          'State the four connectionist principles: intelligence emerges from simple processing units; knowledge is stored in the connection weights; learning modifies connection strengths; processing is parallel and distributed.',
          'Explain the consequence of a distributed representation: no single unit holds any fact, so removing one degrades performance gradually rather than breaking the network.',
          'Draw the trade-off: that same property is why the result cannot be explained, which the deck lists as a condition of use rather than a drawback.',
        ],
      },
    ],
  },

  dl3: {
    cheat: [
      {
        formula: 'y = w₀ + w₁x₁ + … + w_d x_d',
        why: 'Linear regression. A weighted sum of the features plus a bias, and nothing else.',
      },
      {
        formula: 'x̃ = [1, x₁, …, x_d]ᵀ',
        why: 'The augmented example. The leading 1 is what turns the bias into an ordinary weight w₀.',
      },
      {
        formula: 'X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾ ,  w ∈ ℝᵈ⁺¹ ,  y ∈ ℝᴺ',
        why: 'The design matrix, the weights and the targets. Rows are examples; the parameter count equals the column count.',
      },
      { formula: 'ŷ = f(wᵀx) ,  ŷ = Xw', why: 'One prediction, then all of them in a single matrix product.' },
      {
        formula: 'f(z) = z ,  f ′(z) = 1',
        why: 'The identity activation. Gradients pass through unchanged, and any real output is reachable.',
      },
      {
        formula: 'ℓ = ½(wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)²',
        why: 'The loss on one example. The ½ makes the derivative clean and moves the minimum nowhere.',
      },
      {
        formula: 'J(w) = (1/2N)‖Xw − y‖² = (1/2N)(Xw − y)ᵀ(Xw − y)',
        why: 'The total loss, as the squared length of the error vector.',
      },
      {
        formula: 'w* = arg min_w J(w)',
        why: 'The goal. arg min is the w that minimises J, not the minimum value itself.',
      },
      {
        formula: 'squared error: differentiable · convex · penalises large errors · MLE under Gaussian noise',
        why: 'The deck’s four reasons for choosing it. The third is also why one bad label can drag the whole fit.',
      },
      {
        formula: '∇J(w) = (1/N) Σ (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾) x⁽ⁱ⁾ = (1/N) Xᵀ(Xw − y)',
        why: 'Each example’s error weighted by its own input. Its shape must match w.',
      },
      {
        formula: 'w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − (η/N) Xᵀ(Xw⁽ᵗ⁾ − y)',
        why: 'The update. Every parameter moves at once, against its own slope.',
      },
      {
        formula: 'stop when ‖∇J‖ < ε',
        why: 'The convergence test, with ε around 10⁻⁴. Alternatives: a small change in loss, an iteration cap, or a rising validation loss.',
      },
      {
        formula: 'the worked example: J 7.5 → 1.51 in one step',
        why: 'X = [[1,1],[1,2],[1,3]], y = (2,4,5), w = 0, η = 0.1. Gradient (−3.67, −8.33), new w (0.367, 0.833).',
      },
      {
        formula: 'MSE = (1/N)Σ(ŷ − y)² ·  RMSE = √MSE ·  MAE = (1/N)Σ|y − ŷ|',
        why: 'The three error metrics. RMSE is in the target’s units; MAE is far less moved by outliers.',
      },
      {
        formula: 'R² = 1 − SS_res/SS_tot',
        why: 'Compared against predicting the mean. 1 perfect, 0 ties with the baseline, negative is worse than it.',
      },
      {
        formula: 'z-score: x′ = (x − μ)/σ ;  min-max: x′ = (x − min)/(max − min)',
        why: 'The deck’s two scalings. They change how many iterations training needs, not what the answer is.',
      },
      {
        formula: 'the error surface is convex with a single global minimum',
        why: 'True for a linear model with squared error. One non-linear activation and the guarantee is gone.',
      },
    ],
    quiz: [
      {
        q: 'Why is the identity chosen as the activation for regression?',
        options: [
          'Because it is the fastest to compute',
          'Because the output must be able to take any real value, and its derivative of 1 lets the gradient pass through unchanged',
          'Because it makes the loss convex',
          'Because it prevents overfitting',
        ],
        answer: 1,
        explain:
          'Two reasons, both on the slide. A bounded activation would make some targets unreachable, and a derivative of exactly 1 means the chain rule neither shrinks nor amplifies what comes back. Convexity comes from the squared-error loss, not from the activation.',
      },
      {
        q: 'What is the column of ones in the design matrix for?',
        options: [
          'To normalise the features',
          'To give the bias something to multiply, so it becomes an ordinary weight w₀',
          'To count the examples',
          'To make the matrix square',
        ],
        answer: 1,
        explain:
          'Without it every formula needs an "and then add b" clause. With it, ŷ = Xw covers the bias too, and the gradient and update are single expressions. It also means you must scale the features before adding the column, since standardising a constant column divides by zero.',
      },
      {
        q: 'Why does the loss have a ½ in front of the squared error?',
        options: [
          'To halve the learning rate',
          'To make the loss smaller so it converges faster',
          'So that differentiating the square cancels it, leaving a clean gradient with no stray factor of 2',
          'Because the errors are counted twice',
        ],
        answer: 2,
        explain:
          'Differentiating ½e² gives e; differentiating e² gives 2e, and that 2 would follow you through every subsequent formula. Scaling a loss by a positive constant never moves its minimum, so the ½ costs nothing. PyTorch omits it, which is why its MSE is twice this J.',
      },
      {
        q: 'In the deck’s worked example, one iteration reduces the loss from 7.5 to about 1.51. Where are the weights?',
        options: [
          'At the minimum, (2/3, 3/2)',
          'At (0.367, 0.833) — about half way to the minimum, even though 80% of the loss is gone',
          'Still at (0, 0)',
          'Past the minimum, because η was too large',
        ],
        answer: 1,
        explain:
          'The loss falls fast at first because the surface is steep far from the bottom, and slowly later because it is flat near it. This gap between "most of the loss gone" and "most of the way there" is normal and worth expecting.',
      },
      {
        q: 'Multiplying one feature column by 100 changes what?',
        options: [
          'The best-fitting line, which becomes worse',
          'Nothing at all',
          'Nothing about the answer, but the number of gradient descent iterations goes up sharply',
          'The number of parameters',
        ],
        answer: 2,
        explain:
          'The same fit is available — the weight on that column just becomes a hundredth of what it was. What changes is the shape of the loss surface: it becomes far more stretched, the largest usable learning rate falls, and the shallow direction takes many more steps. That is what feature scaling fixes.',
      },
      {
        q: 'A model scores R² = −0.2 on the test set. What does that mean?',
        options: [
          'The R² calculation has a bug, since R² cannot be negative',
          'The model is worse on unseen data than always predicting the mean of the targets',
          'The model explains 20% of the variance',
          'The features are negatively correlated with the target',
        ],
        answer: 1,
        explain:
          'R² = 0 is exactly the score of predicting ȳ for everything, so negative means losing to that baseline. The deck notes it is possible on a test set. In practice it usually means severe overfitting, or a test set drawn from a different distribution than the training set.',
      },
      {
        q: 'RMSE is 8.0 and MAE is 3.0 on the same predictions. What does the gap tell you?',
        options: [
          'One of them has been computed incorrectly, since they should be equal',
          'The errors are uneven — a few are much larger than the rest',
          'The model is underfitting',
          'The target needs rescaling',
        ],
        answer: 1,
        explain:
          'RMSE is never below MAE, and the two are equal only when every error has the same size. A large gap means the squared measure is being dominated by a small number of large errors, which is worth investigating before reporting either number alone.',
      },
      {
        q: 'The training loss becomes NaN after a few iterations. What is the first thing to try?',
        options: [
          'Add regularisation',
          'Collect more data',
          'Decrease the learning rate, and check the feature scales',
          'Increase the number of iterations',
        ],
        answer: 2,
        explain:
          'NaN means the numbers overflowed, which for gradient descent means the steps grew instead of shrinking — a learning rate above the divergence threshold, often made worse by badly scaled features. Regularisation and more data address overfitting, which is a different symptom entirely.',
      },
      {
        q: 'The error surface for linear regression with squared error is convex. Does that hold for a neural network with a hidden layer?',
        options: [
          'Yes, convexity is a property of the squared-error loss',
          'No — a non-linear activation destroys it, and the surface acquires many local minima and saddle points',
          'Yes, provided the learning rate is small enough',
          'Only if the network has fewer parameters than examples',
        ],
        answer: 1,
        explain:
          'Convexity here comes from J being quadratic in w, which needs the model to be linear in w. One non-linear activation and that is gone. Everything module 4 does about optimisation is a response to losing this guarantee — and it is why deep learning papers speak of "a good minimum" rather than "the minimum".',
      },
      {
        q: 'What does "batch" mean in batch gradient descent?',
        options: [
          'The weights are updated in batches, several at a time',
          'Every training example is used to compute each single update',
          'The data is processed in chunks of 32',
          'Training runs as a scheduled batch job',
        ],
        answer: 1,
        explain:
          'Line 4 of the algorithm computes ∇J over the whole dataset before line 5 takes one step. That makes each gradient exact and each step expensive. Mini-batch — a chunk per step — and stochastic — one example per step — are the alternatives, and mini-batch is what is used in practice.',
      },
    ],
    exam: [
      {
        q: 'Derive the gradient of the squared-error loss for linear regression, and state the batch gradient descent algorithm that uses it.',
        meta: 'Derive & state · ~10 marks',
        points: [
          'Write the loss for one example: ℓ = ½(wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)², and the total J(w) = (1/N) Σᵢ ℓ.',
          'Differentiate one term by the chain rule: the outer derivative of ½u² is u, giving (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾); the inner derivative of wᵀx with respect to w is x⁽ⁱ⁾.',
          'So one example contributes (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)x⁽ⁱ⁾, and ∇J(w) = (1/N) Σᵢ (wᵀx⁽ⁱ⁾ − y⁽ⁱ⁾)x⁽ⁱ⁾.',
          'Write the matrix form ∇J(w) = (1/N)Xᵀ(Xw − y), and check the shapes: Xᵀ is (d + 1) × N, the error is N × 1, so ∇J is (d + 1) × 1 — one entry per parameter, as required.',
          'State the algorithm: initialise w⁽⁰⁾ = 0 or random; repeat computing the gradient and updating w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ − η∇J(w⁽ᵗ⁾); stop when ‖∇J‖ < ε or a maximum iteration count is reached.',
          'Explain "batch": the gradient uses every training example before a single step is taken, so each step is exact and costs one pass over the data.',
          'Comment on η: too large overshoots and can diverge to NaN, too small converges slowly; the deck suggests trying 0.001, 0.01, 0.1 and 1.0 and plotting the loss curves.',
        ],
      },
      {
        q: 'Given X = [[1,1],[1,2],[1,3]], y = (2, 4, 5)ᵀ, w⁽⁰⁾ = 0 and η = 0.1, carry out one iteration of batch gradient descent and report the loss before and after.',
        meta: 'Compute · ~10 marks',
        points: [
          'Predictions: ŷ⁽⁰⁾ = Xw⁽⁰⁾ = (0, 0, 0)ᵀ.',
          'Initial loss: J = (1/2N)‖Xw − y‖² = (1/6)(4 + 16 + 25) = 45/6 = 7.5.',
          'Error vector: e⁽⁰⁾ = ŷ − y = (−2, −4, −5)ᵀ.',
          'Gradient: ∇J = (1/3)Xᵀe = (1/3)(−2 − 4 − 5, −2 − 8 − 15)ᵀ = (1/3)(−11, −25)ᵀ = (−3.67, −8.33)ᵀ.',
          'Update: w⁽¹⁾ = 0 − 0.1(−3.67, −8.33)ᵀ = (0.367, 0.833)ᵀ.',
          'New predictions: ŷ⁽¹⁾ = Xw⁽¹⁾ = (1.20, 2.03, 2.87)ᵀ; new errors (−0.80, −1.97, −2.13)ᵀ.',
          'New loss: J = (1/6)(0.64 + 3.88 + 4.54) ≈ 1.51, an approximately 80% reduction.',
          'For full marks, note that this is one step of many: the exact least-squares solution is w = (2/3, 3/2) with a loss of 1/36 ≈ 0.028, so the weights are only about half way there even though most of the loss has gone.',
        ],
      },
      {
        q: 'Justify the choice of squared error as the objective function for regression, and describe when you would choose something else.',
        meta: 'Discuss · ~8 marks',
        points: [
          'Give the deck’s four reasons: differentiable and smooth everywhere so it is easy to optimise; convex for a linear model so there is a single global minimum; penalises large errors quadratically; and it is the maximum likelihood estimate under Gaussian noise.',
          'Expand on convexity: J is quadratic in w, so the surface is a bowl and any downhill route reaches the best answer — a guarantee that fails as soon as a non-linear activation is introduced.',
          'Expand on the statistical reason: if the errors are Gaussian, minimising squared error is exactly maximising the likelihood of the observed data.',
          'Give the cost: quadratic growth means one badly wrong or mislabelled target contributes enormously, and can drag the whole fit. Squared error predicts the mean of the targets, which is the same sensitivity seen in the statistics course.',
          'Name the alternative: absolute error, which predicts the median and is far more robust, at the price of a non-differentiable corner at zero.',
          'Mention Huber loss as the compromise — squared near zero and absolute far from it.',
          'Conclude with the decision rule: choose the loss that matches what a mistake actually costs in the application, and note that the loss you optimise need not be the metric you report.',
        ],
      },
      {
        q: 'Explain how a regression model should be evaluated, defining each metric you name.',
        meta: 'Define & explain · ~8 marks',
        points: [
          'State the principle: evaluate on unseen data. Split into a training set used to fit w and a test set used to estimate generalisation.',
          'Give the two errors as the same formula over different rows: J_train over the training indices, J_test over the test indices.',
          'Define MSE = (1/N)Σ(ŷ − y)², noting its units are the target’s squared.',
          'Define RMSE = √MSE, and say why it is preferred for reporting: it is in the target’s own units.',
          'Define MAE = (1/N)Σ|y − ŷ|, and note it is less sensitive to outliers because errors are not squared.',
          'Define R² = 1 − SS_res/SS_tot with SS_tot = Σ(y − ȳ)², and interpret: 1 is a perfect fit, 0 is no better than predicting the mean, and negative is worse than that baseline and is possible on a test set.',
          'Note that RMSE ≥ MAE always, with equality only when all errors are the same size, so the gap between them measures how uneven the errors are.',
          'Warn about leakage: any scaling or selection must be fitted on the training rows only, or the test score is no longer an estimate of generalisation.',
        ],
      },
      {
        q: 'A training run produces a loss that becomes NaN. Diagnose it, and describe the other failure modes on the deck’s debugging checklist.',
        meta: 'Diagnose · ~7 marks',
        points: [
          'NaN or Inf means numerical overflow. The causes are a learning rate too large, so successive steps grow rather than shrink, and badly scaled features which make the gradients large to begin with.',
          'The fix is to decrease η and scale the features; note the exact threshold is computable for a linear model — descent converges when η < 2/λmax(XᵀX/N).',
          'Loss oscillating: the same cause, a learning rate slightly too large, so steps overshoot and come back. Fix by decreasing η or applying a learning-rate decay.',
          'Loss not decreasing: a learning rate too small, or a bug in the gradient — a wrong sign, or a plus where the update should subtract. Fix by increasing η and verifying the code.',
          'Training fine but test error high: overfitting, from too many features relative to the amount of data. Fix by regularisation, more data, or a simpler model.',
          'Give the diagnostic order: examine the training loss alone first, since the first three symptoms are optimisation problems; only once it falls smoothly does the gap to the test loss mean anything.',
          'Add the symptom the slide omits: a loss that falls and then flattens well above zero, with both errors mediocre, is underfitting and needs more capacity rather than less.',
        ],
      },
    ],
  },

  activation: {
    cheat: [
      {
        formula: 'ŷ = f(z),  z = Σ wᵢxᵢ + b',
        why: 'The interface every unit in the course plugs into. f is the only thing that varies between models.',
      },
      {
        formula: 'step: 1 if z ≥ 0 else 0 ,  f ′ = 0',
        why: 'The perceptron. No usable derivative, so it cannot be trained by gradient descent — hence its own rule.',
      },
      {
        formula: 'identity: f(z) = z ,  f ′(z) = 1',
        why: 'Regression. Any real output is reachable, and the gradient passes back unchanged.',
      },
      {
        formula: 'ReLU: max(0, z) ,  f ′ = 1 or 0',
        why: 'The usual hidden-layer choice. Not in these decks. Cheap, and enough of a bend to stop layers collapsing.',
      },
      {
        formula: 'σ(z) = 1/(1 + e⁻ᶻ) ,  f ′ ≤ 0.25',
        why: 'The sigmoid. Useful for a probability; its small derivative is why deep stacks of it stopped working.',
      },
      {
        formula: 'W₂(W₁x + b₁) + b₂ = (W₂W₁)x + const',
        why: 'Two linear layers are one. The reason a non-linearity between them is compulsory rather than optional.',
      },
      {
        formula: 'the last activation is decided by the target',
        why: 'Identity for an unbounded number, sigmoid for a probability, softmax for one of K classes.',
      },
    ],
    quiz: [
      {
        q: 'A network has ten nn.Linear layers and no activation functions between them. What can it represent?',
        options: [
          'Any continuous function, by the universal approximation theorem',
          'Exactly what a single linear layer can represent',
          'Ten times as much as one layer',
          'Nothing — it will not train',
        ],
        answer: 1,
        explain:
          'Composing linear maps gives a linear map, so the ten weight matrices collapse into one product. It trains happily, plateaus at whatever one layer can do, and never reports a problem. XOR is the four-point test that exposes it.',
      },
      {
        q: 'Why can gradient descent not train a perceptron directly?',
        options: [
          'Because the weights are integers',
          'Because the step activation has a derivative of zero wherever it is defined, so nothing about the error reaches the weights',
          'Because the loss is not convex',
          'Because the learning rate cannot be chosen',
        ],
        answer: 1,
        explain:
          'The chain rule multiplies by f′, and for a step that is zero on both sides of the jump and undefined at it. The perceptron rule works around this by never differentiating — it just adds η(t − ŷ)x. Swapping in a differentiable activation is what makes gradient descent available.',
      },
      {
        q: 'You are predicting house prices and add a ReLU to the output layer. What happens?',
        options: [
          'Training becomes faster',
          'The model can no longer predict negative values, and its gradient vanishes for any example it currently predicts below zero',
          'Nothing — ReLU is the identity for positive numbers',
          'The loss becomes non-convex',
        ],
        answer: 1,
        explain:
          'It may look harmless because prices are positive, but any example the model currently scores below zero gets a gradient of zero and can never recover. The output activation should be chosen from the target, and for an unbounded number that means no activation at all.',
      },
    ],
    exam: [
      {
        q: 'Explain the role of the activation function, and justify the choice made for the perceptron, for linear regression, and for a hidden layer.',
        meta: 'Explain & justify · ~8 marks',
        points: [
          'State the interface: a unit computes z = Σwᵢxᵢ + b and then ŷ = f(z); f is what decides the unit’s behaviour.',
          'Three properties matter: the output range, whether f is differentiable and what its derivative is, and whether f is non-linear.',
          'Perceptron: a step, chosen because the task is a binary decision. Its derivative is zero, so gradient descent is unavailable and a bespoke update rule is used instead.',
          'Linear regression: the identity, chosen because the target is an unbounded real number and because f′ = 1 lets the gradient pass through unchanged.',
          'Hidden layer: a non-linear differentiable function such as ReLU, chosen because without one the layers collapse — W₂(W₁x + b₁) + b₂ is a single linear map.',
          'Give XOR as the proof that the collapse matters: a two-layer network with no activation fails it exactly as one perceptron does.',
          'Note the vanishing gradient consequence: sigmoid’s derivative peaks at 0.25, so deep stacks of it multiply the returning gradient towards zero, which is why ReLU replaced it.',
        ],
      },
    ],
  },

  metrics: {
    cheat: [
      {
        formula: 'MSE = (1/N) Σ (ŷ − y)²',
        why: 'The training loss without the ½. Units are the target’s, squared, so it is hard to interpret directly.',
      },
      { formula: 'RMSE = √MSE', why: 'Back in the target’s own units. The number to put in front of a person.' },
      {
        formula: 'MAE = (1/N) Σ |y − ŷ|',
        why: 'The average size of an error. Every unit counts the same, so a few extreme cases do not dominate.',
      },
      {
        formula: 'R² = 1 − SS_res/SS_tot',
        why: 'Compared against predicting ȳ. 1 perfect, 0 ties with the baseline, negative loses to it.',
      },
      {
        formula: 'RMSE ≥ MAE, always',
        why: 'Equal only when every error is the same size, so the gap between them measures how uneven the errors are.',
      },
      {
        formula: 'R² never falls when a feature is added',
        why: 'On the training set. Which is why models of different sizes must be compared on held-back data.',
      },
      {
        formula: 'compute all of them on unseen data',
        why: 'Every one of these numbers is meaningless on the rows the model was fitted to.',
      },
    ],
    quiz: [
      {
        q: 'Why report RMSE rather than MSE?',
        options: [
          'RMSE is always smaller',
          'RMSE is in the same units as the target, so the number means something',
          'RMSE is less sensitive to outliers',
          'MSE cannot be computed on a test set',
        ],
        answer: 1,
        explain:
          'If you predict rupees, MSE is in rupees squared, which nobody can interpret. Taking the square root puts it back into rupees. It is exactly as sensitive to outliers as MSE — the robust alternative is MAE.',
      },
      {
        q: 'A model scores R² = 0.0 on the training set. What does that mean?',
        options: [
          'It fits perfectly',
          'It is exactly as accurate as predicting the mean of y for every example',
          'Half the variance is explained',
          'The calculation failed',
        ],
        answer: 1,
        explain:
          'SS_res equals SS_tot, so the fraction is 1 and R² is 0. That is the score of the do-nothing baseline, so a real model scoring it has a bug or is being given features with no signal. It is worth computing before spending time on tuning.',
      },
      {
        q: 'On one model RMSE and MAE are both 4.0. What does that tell you?',
        options: [
          'Every error has the same size',
          'The model is perfect',
          'Half the errors are positive',
          'The target needs rescaling',
        ],
        answer: 0,
        explain:
          'RMSE is never below MAE, and they coincide only when the errors are all equal in magnitude. Equality is therefore a strong statement about the error distribution — in practice a small gap means even errors and a large gap means a few outliers dominate.',
      },
    ],
    exam: [
      {
        q: 'Define MSE, RMSE, MAE and R², and explain how you would choose which to report.',
        meta: 'Define & discuss · ~8 marks',
        points: [
          'MSE = (1/N)Σ(ŷ − y)², the mean of the squared errors, in the target’s units squared.',
          'RMSE = √MSE, in the target’s own units, which is why it is the standard number to report.',
          'MAE = (1/N)Σ|y − ŷ|, the mean size of an error, also in the target’s units and much less affected by extreme cases.',
          'R² = 1 − SS_res/SS_tot with SS_tot = Σ(y − ȳ)²: the share of the target’s variation the model accounts for, measured against a baseline of predicting the mean.',
          'Interpret R²: 1 perfect, 0 equal to the baseline, negative worse than it and possible on a test set.',
          'Note RMSE ≥ MAE always, with equality only when all errors are equal, so reporting both exposes uneven errors.',
          'Choose by what a mistake costs: squared measures if large errors are disproportionately bad, MAE if every unit of error costs the same.',
          'Add the discipline: all of them must be computed on data held back from training, with any scaling fitted on the training rows only.',
        ],
      },
    ],
  },

  designmat: {
    cheat: [
      {
        formula: 'x̃ = [1, x₁, …, x_d]ᵀ',
        why: 'The augmented example. The leading 1 is what lets the bias be an ordinary weight.',
      },
      {
        formula: 'X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾',
        why: 'The design matrix: one row per example, one column per feature, ones in the first column.',
      },
      {
        formula: 'w ∈ ℝᵈ⁺¹',
        why: 'One weight per column, bias first. The parameter count and the column count are the same number.',
      },
      {
        formula: 'ŷ = Xw ∈ ℝᴺ',
        why: 'Every prediction at once. Inner dimensions d + 1 match, so the result is one answer per row.',
      },
      {
        formula: 'h = wᵀx',
        why: 'A single prediction: a 1 × (d + 1) row times a (d + 1) × 1 column. The dot product under another name.',
      },
      {
        formula: '∇J = (1/N)Xᵀ(Xw − y) ∈ ℝᵈ⁺¹',
        why: 'The gradient has one entry per weight because Xᵀ is (d + 1) × N and the error is N × 1.',
      },
      {
        formula: 'w* = (XᵀX)⁻¹Xᵀy',
        why: 'The exact answer, in one step, at a cost of about d³. Fine at ten features, impossible at a hundred thousand.',
      },
      {
        formula: 'scale first, augment second',
        why: 'Standardising a column of ones divides by a standard deviation of zero and fills the model with NaNs.',
      },
    ],
    quiz: [
      {
        q: 'X is 500 × 8 and w is 8 × 1. What shape is Xw, and what does each entry mean?',
        options: [
          '8 × 1, one entry per feature',
          '500 × 1, one prediction per example',
          '500 × 8, one prediction per feature per example',
          'The product does not exist',
        ],
        answer: 1,
        explain:
          'The inner dimensions are both 8, so the product exists and the outer dimensions give the shape: 500 × 1. Each entry is one row of X dotted with w, which is one example’s prediction. With a ones column that 8 means 7 real features plus the bias.',
      },
      {
        q: 'Why must feature scaling happen before the ones column is added?',
        options: [
          'Because scaling is slower on a wider matrix',
          'Because standardising a constant column divides by a standard deviation of zero, producing NaNs',
          'Because the ones column would be scaled to zeros',
          'It does not matter which order you use',
        ],
        answer: 1,
        explain:
          'The ones column has no variation, so its standard deviation is 0 and the z-score divides by zero. The NaNs then spread through every subsequent calculation. Scale the real features, then augment — or let a Pipeline handle the ordering for you.',
      },
      {
        q: 'Why does deep learning use gradient descent rather than the closed-form solution (XᵀX)⁻¹Xᵀy?',
        options: [
          'The closed form is only an approximation',
          'The closed form needs a learning rate',
          'Inverting a (d + 1) × (d + 1) matrix costs about d³, which is impossible for large d — and it does not exist at all for a non-linear model',
          'Gradient descent is more accurate',
        ],
        answer: 2,
        explain:
          'For a small linear problem the closed form is exact and better. It stops being usable as d grows, and it does not exist once the model is non-linear — which is every model after this session. Gradient descent scales and generalises, which is the only reason it wins.',
      },
    ],
    exam: [
      {
        q: 'Explain the design matrix formulation of linear regression, including the shapes of every object and the reason for the leading column of ones.',
        meta: 'Explain · ~7 marks',
        points: [
          'Define the augmented example x̃ = [1, x₁, …, x_d]ᵀ and state that the leading 1 exists so the bias can be carried as an ordinary weight w₀.',
          'Define X ∈ ℝᴺˣ⁽ᵈ⁺¹⁾ with one row per training example, y ∈ ℝᴺ, and w ∈ ℝᵈ⁺¹.',
          'State ŷ = Xw and check the shapes: (N × (d + 1)) times ((d + 1) × 1) gives N × 1, one prediction per example.',
          'Give the loss in this notation: J(w) = (1/2N)‖Xw − y‖² = (1/2N)(Xw − y)ᵀ(Xw − y).',
          'Give the gradient ∇J = (1/N)Xᵀ(Xw − y) and check that its shape (d + 1) × 1 matches w, as a gradient must.',
          'State the practical benefits: no special case for the bias in any formula, all N predictions in one operation, and short enough expressions to differentiate by hand.',
          'Give the two cautions: scaling must be applied before the ones column is added, and regularisation should normally exclude w₀ since the bias is not a claim about any feature.',
        ],
      },
    ],
  },
}
