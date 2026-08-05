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
          'The step is η × gradient. Near the bottom the gradient tends to zero, so the movement does too — no schedule required for a well-behaved convex surface.',
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
          'The algorithm is non-deterministic by design',
          'Different random initial centroids lead to different local minima',
          'The data changed between runs',
          'k-means never converges',
        ],
        answer: 1,
        explain:
          'Assignment and update only guarantee a decrease in J, not the global optimum. k-means++ seeding or multiple restarts with the best inertia are the standard fixes.',
      },
      {
        q: 'Why can you not choose k by picking the value that minimises inertia?',
        options: [
          'Inertia is not computable for large k',
          'Inertia decreases monotonically with k, reaching zero when k = n',
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
        why: 'The perceptron convergence theorem. Non-separable data never settles.',
      },
      { formula: 'XOR is not separable', why: 'The canonical failure that motivates hidden layers.' },
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
}
