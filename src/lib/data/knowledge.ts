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
