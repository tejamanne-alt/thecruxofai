import type { TopicId } from './curriculum'

/**
 * A chapter is a whole lecture, which is too much for one page. So it is split
 * into parts, and each part is its own page and its own row in the left menu.
 * You can send someone a link to one idea instead of to a wall of text.
 *
 * This file holds names only — no components. The left menu imports it, and the
 * menu must not drag every chart on the site into its bundle.
 */
export interface PartMeta {
  id: string
  /** Short name, shown in the menu. */
  title: string
  /** One line, shown on the chapter's front page and under the menu row. */
  teaser: string
  /** Which slides of the lecture this part came from. */
  slides?: string
}

export const LECTURE_PARTS: Partial<Record<TopicId, PartMeta[]>> = {
  lec0a: [
    {
      id: 'octave',
      title: 'Octave, the free tool',
      teaser: 'Where the course does its sums. Drag a marker along a plot and see what a computer really draws.',
      slides: 'Slides 2–4',
    },
    {
      id: 'matrix',
      title: 'What a matrix is',
      teaser: 'A box of numbers in rows and columns. Change its shape and watch what it gets called.',
      slides: 'Slides 5–8',
    },
    {
      id: 'algebra',
      title: 'Adding, and multiplying by a number',
      teaser: 'The easy half. Give one box the wrong shape and see the whole thing refuse.',
      slides: 'Slide 9',
    },
    {
      id: 'multiply',
      title: 'Multiplying two matrices',
      teaser: 'The odd one. Press a number in the answer and see exactly where it came from.',
      slides: 'Slides 10–12',
    },
    {
      id: 'transpose',
      title: 'Tipping a matrix over',
      teaser: 'Rows become columns. One rule about it catches almost everyone out.',
      slides: 'Slides 13–14',
    },
    {
      id: 'special',
      title: 'Matrices with a special shape',
      teaser: 'Symmetric, triangular, diagonal, sparse. Type a number and watch the labels light up.',
      slides: 'Slide 16',
    },
    {
      id: 'posdef',
      title: 'Positive definite',
      teaser: 'A promise about every possible x. Drag one around a shaded map and try to break it.',
      slides: 'Slide 17',
    },
    {
      id: 'rowops',
      title: 'The three moves you are allowed',
      teaser: 'Do them yourself and watch the answer hold still. Then try the illegal one.',
      slides: 'Slide 18',
    },
    {
      id: 'echelon',
      title: 'The staircase: row echelon form',
      teaser: 'The lecture’s own example, one move per press, with the leading entries lit up.',
      slides: 'Slides 19, 22',
    },
    {
      id: 'rref',
      title: 'The tidiest form, and why there is only one',
      teaser: 'Take a different route on purpose and end up in exactly the same place.',
      slides: 'Slides 20–21',
    },
    {
      id: 'rank',
      title: 'Rank: how many rows really count',
      teaser: 'Copy one row onto another and watch the count drop. That is the whole idea.',
      slides: 'Slides 23–25',
    },
    {
      id: 'det',
      title: 'The determinant of a small matrix',
      teaser: 'ad − bc is an area. Drag two arrows together and watch it hit zero.',
      slides: 'Slides 26–27',
    },
    {
      id: 'bigdet',
      title: 'Determinants of bigger matrices',
      teaser: 'Pick the row with the most zeros, or skip the whole thing and row-reduce.',
      slides: 'Slides 28–31',
    },
    {
      id: 'detrules',
      title: 'Six rules determinants obey',
      teaser: 'Press a button, do the row move, and check the answer against what was promised.',
      slides: 'Slides 32–35',
    },
    {
      id: 'inverse',
      title: 'The inverse: the undo button',
      teaser: 'The 2 × 2 formula, then the trick that works at any size: [A | I] → [I | A⁻¹].',
      slides: 'Slides 36–39',
    },
    {
      id: 'console',
      title: 'All of it in Octave',
      teaser: 'A working console. Type det(A), inv(A), rref(A) and get real answers back.',
      slides: 'Slides 15, 40',
    },
    {
      id: 'systems',
      title: 'Linear systems, homogeneous or not',
      teaser: 'Set both right-hand sides to zero and watch both lines snap onto the origin.',
      slides: 'Slides 41–42',
    },
    {
      id: 'house',
      title: 'A real one: predicting a house price',
      teaser: 'Each house becomes one equation, and the unknowns are the weights. Then break it on purpose.',
      slides: 'Slides 43–44',
    },
    {
      id: 'outcomes',
      title: 'None, one, or endless',
      teaser: 'Two ranks tell you which. Then turn a dial and watch every equation stay true.',
      slides: 'Slides 45–52, 61',
    },
    {
      id: 'parameter',
      title: 'Five unknowns and a dial',
      teaser: 'One number decides whether the whole thing has an answer. Slide it and find out.',
      slides: 'Slides 53–60',
    },
    {
      id: 'practice',
      title: 'The ten practice questions',
      teaser: 'The sheet has no answer key, so every answer here was worked out and then checked.',
      slides: 'Practice sheet',
    },
  ],

  lec0b: [
    {
      id: 'vector',
      title: 'What a vector is',
      teaser: 'A list of numbers you can add and stretch. Drag two arrows and see you can never break out.',
      slides: 'Slide 2',
    },
    {
      id: 'combination',
      title: 'Mixing vectors together',
      teaser: 'Some of this one, some of that one. Press anywhere and read off the two amounts.',
      slides: 'Slide 3',
    },
    {
      id: 'independence',
      title: 'Independent, or just repeating?',
      teaser: 'Line two arrows up and watch the whole plane collapse to a line.',
      slides: 'Slides 4–5',
    },
    {
      id: 'examples',
      title: 'The lecture’s three examples',
      teaser: 'Two dependent sets and one independent one, with the parallelogram from slide 7.',
      slides: 'Slides 6–7',
    },
    {
      id: 'rank',
      title: 'Rank does the counting for you',
      teaser: 'The test that still works when there are five vectors in seven dimensions.',
      slides: 'Slide 8',
    },
    {
      id: 'pivots',
      title: 'Pivot columns pick the survivors',
      teaser: 'Stand the vectors up as columns. The ones with pivots are the independent ones.',
      slides: 'Slides 9–10',
    },
    {
      id: 'bigcheck',
      title: 'A full check, one move at a time',
      teaser: 'Three vectors with four components each — too big to draw, easy to decide.',
      slides: 'Slides 11–12',
    },
    {
      id: 'dot',
      title: 'The dot product',
      teaser: 'Two lists in, one plain number out. Its sign tells you which way they lean.',
      slides: 'Slides 13–15',
    },
    {
      id: 'norm',
      title: 'Length, and two inequalities',
      teaser: 'Pythagoras in disguise. Then try to break Cauchy–Schwarz by dragging.',
      slides: 'Slides 16–17',
    },
    {
      id: 'angle',
      title: 'Angle, and what orthogonal means',
      teaser: 'Get the dot product to land on exactly zero and watch the angle hit 90°.',
      slides: 'Slide 18',
    },
    {
      id: 'projection',
      title: 'Projection: the shadow one vector casts',
      teaser: 'Drag v₂ and watch its shadow slide. The leftover piece is always at a right angle.',
      slides: 'Slides 19–20',
    },
    {
      id: 'terms',
      title: 'The words probability starts with',
      teaser: 'Sample space, event, union, intersection, complement. Press the die faces and build them.',
      slides: 'Slides 21–22',
    },
    {
      id: 'axioms',
      title: 'The three axioms',
      teaser: 'The whole definition of probability, in three lines you can break with a slider.',
      slides: 'Slides 23–24',
    },
    {
      id: 'randomvar',
      title: 'A random variable is a rule',
      teaser: 'HTT is not a number. X turns it into one. Press an outcome and follow it through.',
      slides: 'Slides 25–26',
    },
    {
      id: 'pmf',
      title: 'pmf and pdf',
      teaser: 'Bars that add to 1, and an area that is a probability while the height is not.',
      slides: 'Slides 27–29',
    },
    {
      id: 'expectation',
      title: 'Expectation: the balance point',
      teaser: 'Load one side and watch the pivot slide. It is an average, not a prediction.',
      slides: 'Slides 30–31',
    },
    {
      id: 'variance',
      title: 'Variance and standard deviation',
      teaser: 'Every squared distance drawn as a real square. Drag one dot out and watch it take over.',
      slides: 'Slides 32–33',
    },
    {
      id: 'covariance',
      title: 'Covariance: do two things move together?',
      teaser: 'One rectangle per point, teal or red. The answer is their signed average.',
      slides: 'Slides 34–35',
    },
    {
      id: 'practice',
      title: 'The six practice questions',
      teaser: 'The sheet has no answer key, so every answer here was worked out and then checked.',
      slides: 'Practice sheet',
    },
  ],

  lec1: [
    {
      id: 'what',
      title: 'What linear algebra is',
      teaser: 'It is the study of vectors, and the rules for adding and stretching them.',
      slides: 'Slides 1–2',
    },
    {
      id: 'equation',
      title: 'A linear equation is a line',
      teaser: 'One equation with two unknowns has a whole line of right answers.',
      slides: 'Slides 1–2',
    },
    {
      id: 'system',
      title: 'Putting equations together',
      teaser: 'Add two equations and one unknown can vanish. That trick runs the whole lecture.',
      slides: 'Slides 2–4',
    },
    {
      id: 'workshop',
      title: 'A real one: the furniture workshop',
      teaser: 'Four resources, three products, and a table that turns into equations.',
      slides: 'Slides 3–4',
    },
    {
      id: 'howmany',
      title: 'How many answers can there be?',
      teaser: 'Only three: one, none, or endless. Drag two lines and try to find a fourth.',
      slides: 'Slides 4–8',
    },
    {
      id: 'planes',
      title: 'The same idea in 3D',
      teaser: 'With three unknowns each equation is a flat sheet. Spin them and watch them meet.',
      slides: 'Slides 7–9',
    },
    {
      id: 'matrices',
      title: 'What a matrix is',
      teaser: 'A box of numbers in rows and columns. A vector is a box one column wide.',
      slides: 'Slide 9',
    },
    {
      id: 'arithmetic',
      title: 'Adding and multiplying matrices',
      teaser: 'Adding is easy. Multiplying is the odd one — click a number and see where it came from.',
      slides: 'Slides 10–11, 14',
    },
    {
      id: 'inverse',
      title: 'The inverse and the transpose',
      teaser: 'An undo button that goes missing when one number hits zero.',
      slides: 'Slides 11–13',
    },
    {
      id: 'axb',
      title: 'Writing it all as Ax = b',
      teaser: 'A whole page of equations shrinks to three letters. Edit one and watch the other change.',
      slides: 'Slides 14–15',
    },
    {
      id: 'columns',
      title: 'x is a recipe for mixing columns',
      teaser: 'The better way to read Ax = b. It makes "no answer" obvious instead of odd.',
      slides: 'Slides 15–16',
    },
    {
      id: 'general',
      title: 'One answer, then all of them',
      teaser: 'Find any answer, then find every move that goes nowhere. Slide along the answer line.',
      slides: 'Slides 16–19',
    },
    {
      id: 'moves',
      title: 'The three moves you may use',
      teaser: 'Watch the lines change while the crossing point stays put. That is why they are safe.',
      slides: 'Slide 20',
    },
    {
      id: 'lab',
      title: 'Gaussian elimination, step by step',
      teaser: 'The full method on the lecture’s own systems. One legal move per press.',
      slides: 'Slides 21–24',
    },
    {
      id: 'echelon',
      title: 'The staircase: pivots and free variables',
      teaser: 'Spot the pivots yourself, and see which unknowns you get to choose.',
      slides: 'Slides 24–25',
    },
    {
      id: 'rref',
      title: 'Going further: the tidiest form',
      teaser: 'Clear above the pivots too, and the answers can just be read off.',
      slides: 'Slides 26–29',
    },
    {
      id: 'recipe',
      title: 'The method as a recipe',
      teaser: 'Zero out below the diagonal, then above it. Step through the pattern.',
      slides: 'Slides 29–30',
    },
    {
      id: 'invert',
      title: 'Bonus: it also finds the inverse',
      teaser: 'Put A next to I, run the method, and the inverse appears where I was.',
      slides: 'Slide 31',
    },
  ],

  lec2: [
    {
      id: 'why',
      title: 'Why the subject moves on',
      teaser:
        'Set b to zero and the answers become a space. Set it to anything else and adding two of them falls off the line.',
      slides: 'Slide 2',
    },
    {
      id: 'groups',
      title: 'Groups: the smallest useful structure',
      teaser: 'A set, one operation, four promises. Press through five candidates and see which promise fails.',
      slides: 'Slides 3–4',
    },
    {
      id: 'spaces',
      title: 'What a vector space is',
      teaser: 'An inner operation and an outer one. Check each axiom on numbers you choose.',
      slides: 'Slides 5–6',
    },
    {
      id: 'examples',
      title: 'What else counts as a vector',
      teaser: 'Columns, matrices, polynomials. Same two operations, so the same theory covers all of them.',
      slides: 'Slides 7–8',
    },
    {
      id: 'subspaces',
      title: 'A space inside a space',
      teaser: 'Six candidate subsets. Drag two arrows and try to break each one.',
      slides: 'Slides 9–12',
    },
    {
      id: 'span',
      title: 'Span: everything you can reach',
      teaser: 'Line the two generators up and watch the whole plane collapse to a line.',
      slides: 'Slides 13–14',
    },
    {
      id: 'independence',
      title: 'Independent, or carrying nothing',
      teaser: 'The definition looks awkward on purpose. Three facts, each one draggable.',
      slides: 'Slides 15–17',
    },
    {
      id: 'pivots',
      title: 'Checking it with elimination',
      teaser: 'Two correct routes, two different staircases, the same pivot columns.',
      slides: 'Slides 18–21',
    },
    {
      id: 'coords',
      title: 'Vectors built from other vectors',
      teaser: 'Test the coefficients instead of the vectors. Edit them and watch both verdicts move together.',
      slides: 'Slides 22–25',
    },
    {
      id: 'worked',
      title: 'The four-vector example',
      teaser: 'The deck finds a combination reaching zero. Load it and watch every coefficient cancel.',
      slides: 'Slides 26–29',
    },
    {
      id: 'counting',
      title: 'When the shape decides for you',
      teaser: 'More vectors than ingredients is always dependent. Move two dials and see why.',
      slides: 'Slides 30–31',
    },
    {
      id: 'basis',
      title: 'Generating set, and basis',
      teaser:
        'Big enough to reach everything, small enough that nothing repeats. Three bases of ℝ³ that look nothing alike.',
      slides: 'Slides 32–37',
    },
    {
      id: 'dimension',
      title: 'Dimension is not the number of components',
      teaser: 'A line inside ℝ³ is one-dimensional, and its vectors still have three numbers each.',
      slides: 'Slides 38–39',
    },
    {
      id: 'findbasis',
      title: 'Finding a basis, and the deck’s last example',
      teaser: 'Three steps. Then the example the slides pose and never answer, worked out and checked.',
      slides: 'Slides 40–41',
    },
  ],

  lec3: [
    {
      id: 'why',
      title: 'Putting geometry back into a vector space',
      teaser:
        'A vector space alone cannot measure anything. One extra object gives you length, distance and angle at once.',
      slides: 'Slide 1',
    },
    {
      id: 'norms',
      title: 'A norm: what "length" has to promise',
      teaser: 'Three rules. Break each one on purpose and see why a length that broke it would be useless.',
      slides: 'Slide 2',
    },
    {
      id: 'l1l2',
      title: 'Manhattan and Euclidean length',
      teaser: 'Two honest ways to measure the same arrow. Drag a point and watch a circle turn into a diamond.',
      slides: 'Slide 2',
    },
    {
      id: 'bilinear',
      title: 'Bilinear: linear in each slot separately',
      teaser: 'The word looks frightening and means one small thing. Check it on both arguments at once.',
      slides: 'Slide 3',
    },
    {
      id: 'innerproduct',
      title: 'What makes a mapping an inner product',
      teaser: 'Bilinear, symmetric, positive definite. Turn each one off and watch the geometry break.',
      slides: 'Slides 3–4',
    },
    {
      id: 'spdmatrix',
      title: 'Every inner product is a matrix',
      teaser: 'The theorem behind the whole lecture: ⟨x, y⟩ = x̂ᵀAŷ. Edit A and watch the geometry it defines.',
      slides: 'Slide 5',
    },
    {
      id: 'spdfacts',
      title: 'Two things an SPD matrix cannot help being',
      teaser: 'Full rank, and a strictly positive diagonal. Both fall out of one line of the definition.',
      slides: 'Slide 6',
    },
    {
      id: 'induced',
      title: 'The norm an inner product gives you',
      teaser:
        'Every inner product induces a length. Not every length comes from an inner product — Manhattan does not.',
      slides: 'Slide 7',
    },
    {
      id: 'cauchy',
      title: 'Cauchy–Schwarz, and where it comes from',
      teaser: 'One squared length that cannot go below zero. Drag α and watch the proof happen on a parabola.',
      slides: 'Slide 8',
    },
    {
      id: 'metric',
      title: 'Distance, and what a metric is',
      teaser: 'The length of the gap between two points. Drag them apart and read the three properties off the plot.',
      slides: 'Slides 9–10',
    },
    {
      id: 'angles',
      title: 'The angle between two vectors',
      teaser:
        'Cauchy–Schwarz is exactly what makes cos⁻¹ legal here. Sweep the angle and watch the ratio stay in range.',
      slides: 'Slides 11–12',
    },
    {
      id: 'highdim',
      title: 'The slide that asks you to write a program',
      teaser: 'Random vectors in high dimensions are nearly always at right angles. Run it and watch the spike form.',
      slides: 'Slide 13',
    },
    {
      id: 'orthogonality',
      title: 'Orthogonal — but with respect to which inner product?',
      teaser: 'Perpendicular is not a property of two vectors alone. Switch A and watch a right angle disappear.',
      slides: 'Slide 14',
    },
    {
      id: 'angleexample',
      title: "The deck's worked example",
      teaser: 'Two vectors at right angles under the dot product, and at cos⁻¹(−1/3) under another. Computed live.',
      slides: 'Slides 15–16',
    },
    {
      id: 'orthomatrix',
      title: 'Orthogonal matrices, and why rotation is the picture',
      teaser: 'AᵀA = I. Turn the dial and watch every length and every angle survive the transformation.',
      slides: 'Slides 17–19',
    },
    {
      id: 'orthobasis',
      title: 'An orthonormal basis',
      teaser: 'Mutually at right angles, each of length one. Coordinates stop needing any work at all.',
      slides: 'Slides 20–21',
    },
    {
      id: 'gramschmidt',
      title: "Gram–Schmidt the deck's way",
      teaser:
        'Row-reduce [AᵀA | Aᵀ] and an orthogonal basis appears on the right. Step through it on the deck’s own numbers.',
      slides: 'Slides 22–23',
    },
    {
      id: 'elementary',
      title: 'Elementary matrices: a row operation you can multiply by',
      teaser: 'Every elimination step is a matrix. Build one and watch it do the subtraction for you.',
      slides: 'Slides 24–25',
    },
    {
      id: 'lu',
      title: 'Why elimination is really A = LU',
      teaser: 'Stack the elementary matrices, invert them, and the whole of Gaussian elimination becomes one product.',
      slides: 'Slide 26',
    },
    {
      id: 'finalargument',
      title: 'Closing the loop: why the method works',
      teaser:
        'QᵀQ is symmetric and upper triangular at the same time, so it must be diagonal. That is the whole proof.',
      slides: 'Slide 27',
    },
  ],

  mllec1: [
    {
      id: 'course',
      title: 'What this course is, and how it is marked',
      teaser: 'Eleven modules, four books, four pieces of assessment. Press a module to see where it sits.',
      slides: 'Slides 5–9',
    },
    {
      id: 'landscape',
      title: 'Data science, AI and machine learning',
      teaser: 'Three circles inside one another. Press each to see what it covers and what it does not.',
      slides: 'Slides 11–14',
    },
    {
      id: 'whatisml',
      title: 'What machine learning actually is',
      teaser: 'Traditional programming takes data and a program and gives output. Flip two boxes and you have ML.',
      slides: 'Slide 16',
    },
    {
      id: 'tpe',
      title: 'Writing a task as ⟨T, P, E⟩',
      teaser: 'Task, performance, experience. Build all four of the deck’s examples and see what a bad P costs you.',
      slides: 'Slides 17–18',
    },
    {
      id: 'spam',
      title: 'Spam filtering, done both ways',
      teaser: 'Hand-written rules against a learned filter. Add spammer tricks and watch the rule list rot.',
      slides: 'Slides 19–21',
    },
    {
      id: 'whenml',
      title: 'When machine learning is worth it',
      teaser: 'Three good reasons and one famous bad one. Sort eight problems and see which need learning at all.',
      slides: 'Slides 25–26',
    },
    {
      id: 'pattern',
      title: 'What makes a 2 a 2?',
      teaser: 'Hinton’s question. Try to write a rule that catches every 2 and no 7 — and watch it fail.',
      slides: 'Slide 27',
    },
    {
      id: 'features',
      title: 'Features, and the thing you are predicting',
      teaser: 'The deck’s three tables. Tap a column to say whether it is a feature or the target.',
      slides: 'Slides 30–32',
    },
    {
      id: 'types',
      title: 'The three kinds of learning',
      teaser: 'Feedback, none, or delayed. The whole taxonomy from slide 48, one branch at a time.',
      slides: 'Slides 29, 48–49',
    },
    {
      id: 'classification',
      title: 'Supervised learning: classification',
      teaser: 'Drag the threshold on the tumour-size example and watch which patients get called wrong.',
      slides: 'Slides 33–36',
    },
    {
      id: 'regression',
      title: 'Supervised learning: regression',
      teaser: 'Same setup, but y is a number instead of a label. Drag a line and watch the error move.',
      slides: 'Slide 39',
    },
    {
      id: 'supervisedflow',
      title: 'The supervised workflow, end to end',
      teaser: 'Training images to features to a learned model to a prediction. Step through both halves.',
      slides: 'Slides 37–38',
    },
    {
      id: 'unsupervised',
      title: 'Unsupervised learning',
      teaser: 'No labels at all. Move the centres, watch the two distances the goal is written in terms of.',
      slides: 'Slides 40–43',
    },
    {
      id: 'reinforcement',
      title: 'Reinforcement learning',
      teaser: 'An agent, an environment, and a reward. Run the six-step loop and watch a policy improve.',
      slides: 'Slides 44–47',
    },
    {
      id: 'semisupervised',
      title: 'Semi-supervised learning',
      teaser: 'A handful of labels among a crowd of unlabelled points. Add labels one at a time.',
      slides: 'Slide 50',
    },
    {
      id: 'batching',
      title: 'Batch, mini-batch and online',
      teaser: 'How much data the model sees at once. Run all three and compare what each costs.',
      slides: 'Slide 51',
    },
    {
      id: 'instancemodel',
      title: 'Instance-based or model-based',
      teaser: 'Remember every example, or boil them down to a rule. Same new point, two ways to label it.',
      slides: 'Slide 52',
    },
    {
      id: 'tools',
      title: 'The tools the course names',
      teaser: 'Nine open-source tools, what each is for and what it is written in. Filter them.',
      slides: 'Slides 53–54',
    },
    {
      id: 'tradeoff',
      title: 'Accuracy against interpretability',
      teaser: 'The deck’s own chart — and it is labelled “unscientific and opinionated”, so read it that way.',
      slides: 'Slide 55',
    },
    {
      id: 'workflow',
      title: 'The machine learning workflow',
      teaser: 'Eight steps from “should I use ML at all?” to a model on the test set. Walk the car-price example.',
      slides: 'Slides 56–58',
    },
  ],

  ism1: [
    {
      id: 'course',
      title: 'What this course is about',
      teaser: 'Six modules, three books, and what statistics is actually for.',
      slides: 'Slides 3–8',
    },
    {
      id: 'types',
      title: 'Categorical or numerical?',
      teaser: 'The first question to ask about any column of data. Have a go at sorting eight of them.',
      slides: 'Slide 9',
    },
    {
      id: 'levels',
      title: 'The four levels of measurement',
      teaser: 'Nominal, ordinal, interval, ratio. Three questions tell you which one you have.',
      slides: 'Slides 10–12',
    },
    {
      id: 'mean',
      title: 'The mean',
      teaser: 'The balance point of the data. Drag a dot and watch it tip.',
      slides: 'Slides 13–17',
    },
    {
      id: 'mode',
      title: 'The mode',
      teaser: 'The value that turns up most. The only one that works for eye colour.',
      slides: 'Slides 18–19',
    },
    {
      id: 'median',
      title: 'The median',
      teaser: 'The middle one. Drag a value to the far end and watch it barely move.',
      slides: 'Slides 20–22',
    },
    {
      id: 'shape',
      title: 'Symmetric and skewed',
      teaser: 'Where the three measures end up tells you which way the data leans.',
      slides: 'Slide 23',
    },
    {
      id: 'notenough',
      title: 'Why the centre is not enough',
      teaser: 'Two groups with the same mean, median and mode, and nothing else in common.',
      slides: 'Slides 24–28',
    },
    {
      id: 'range',
      title: 'The range',
      teaser: 'Biggest take smallest. Quick, useful, and easily fooled.',
      slides: 'Slide 29',
    },
    {
      id: 'variance',
      title: 'Variance and standard deviation',
      teaser: 'Why the distances get squared — drawn as actual squares you can grow.',
      slides: 'Slides 30–34',
    },
    {
      id: 'sample',
      title: 'Why a sample divides by n − 1',
      teaser: 'Take samples yourself and watch one formula land short every time.',
      slides: 'Slides 35–42',
    },
    {
      id: 'fivepoint',
      title: 'Quartiles and the five-point summary',
      teaser: 'Counting positions the way the lecture counts them, so your homework matches.',
      slides: 'Slides 43–44',
    },
    {
      id: 'boxplot',
      title: 'Box plots and outliers',
      teaser: 'Build the box, put up the fences, and drag a dot past one.',
      slides: 'Slides 45–48',
    },
    {
      id: 'practice',
      title: 'The practice problems',
      teaser: 'All four datasets from the slides, worked out in full.',
      slides: 'Slides 50–54',
    },
  ],

  ism2: [
    {
      id: 'experiment',
      title: 'What a random experiment is',
      teaser: 'Anything where you cannot say the answer in advance. Run one and watch.',
      slides: 'Slides 4–5',
    },
    {
      id: 'space',
      title: 'The sample space',
      teaser: 'Write down everything that could possibly happen. That set is where all of probability lives.',
      slides: 'Slide 6',
    },
    {
      id: 'event',
      title: 'An event is part of that list',
      teaser: 'Click the outcomes you care about. That is an event, and counting gives its probability.',
      slides: 'Slide 7',
    },
    {
      id: 'complement',
      title: 'The complement — everything else',
      teaser: 'Aᶜ is whatever A is not. Their probabilities always add to 1, which is often the quick way in.',
      slides: 'Slide 8',
    },
    {
      id: 'setops',
      title: 'Union and intersection: or, and',
      teaser: 'Two circles you drag. The overlap is a real area, so the maths is visible.',
      slides: 'Slide 9',
    },
    {
      id: 'exclusive',
      title: 'Mutually exclusive events',
      teaser: 'Events that cannot both happen. Pull the circles apart until they stop touching.',
      slides: 'Slide 10',
    },
    {
      id: 'define',
      title: 'Three ways to define probability',
      teaser: 'Count it, measure it, or state the rules. Run a die a thousand times and watch two of them meet.',
      slides: 'Slides 11–14',
    },
    {
      id: 'axioms',
      title: 'The axioms, and what breaks them',
      teaser: 'Five candidate assignments from the slides. Four are illegal — find out which rule each one breaks.',
      slides: 'Slide 13, Example 1',
    },
    {
      id: 'addition',
      title: 'The addition rule',
      teaser: 'Add the two, take the overlap off once. Why you subtract, seen rather than memorised.',
      slides: 'Slides 15–16',
    },
    {
      id: 'independent',
      title: 'Independent is not the same as exclusive',
      teaser: 'The most-confused pair in the lecture, on one set of numbers you control.',
      slides: 'Slides 17–18',
    },
    {
      id: 'dice',
      title: 'Two dice, all 36 outcomes',
      teaser: 'Example 2 laid out as a grid. Pick a condition and count the squares.',
      slides: 'Examples 2, 7',
    },
    {
      id: 'worked',
      title: 'Working backwards to the overlap',
      teaser: 'Exams give you three of the four numbers. Examples 3, 4 and 6, rearranged.',
      slides: 'Examples 3–6',
    },
    {
      id: 'counting',
      title: 'Counting: choosing a committee',
      teaser: 'When the outcomes are too many to list, count them instead. Example 8 in full.',
      slides: 'Example 8',
    },
    {
      id: 'practice',
      title: 'The practice problems',
      teaser: 'All nine from the slides, with the tools to work them out.',
      slides: 'Slides 34–39',
    },
  ],

  ism3: [
    {
      id: 'revise',
      title: 'Why a probability gets revised',
      teaser: 'It rains on 30% of days. Then you look out of the window. Move the evidence and watch the number move.',
      slides: 'Board 1 · Slides 5–6',
    },
    {
      id: 'defn',
      title: 'The definition: shrink the sample space',
      teaser: 'Being told B happened throws the rest of S away. Drag two circles and watch B become the new ground.',
      slides: 'Board 2 · Slides 7–8',
    },
    {
      id: 'multiply',
      title: 'The multiplication rule',
      teaser: 'Rearrange the definition and you can walk down a tree. Chain it to three events, one branch at a time.',
      slides: 'Board 3–4 · Slide 9',
    },
    {
      id: 'table',
      title: 'Reading it off a two-way table',
      teaser: 'The loan-default table from the slides. Press a row or a column and watch the denominator change.',
      slides: 'Board 5 · Slides 10–11',
    },
    {
      id: 'subset',
      title: 'When one event sits inside another',
      teaser:
        'Every CD player is an audio component. Nest the circles and both conditionals go somewhere you can predict.',
      slides: 'Slides 12–13',
    },
    {
      id: 'complementcond',
      title: 'Conditioning on complements and unions',
      teaser: 'P(A ∩ B′) = P(A) − P(A ∩ B), and the Visa/MasterCard example in full. Four answers from three numbers.',
      slides: 'Board 6–7 · Slides 14–16',
    },
    {
      id: 'independent',
      title: 'Independence, and why the two definitions agree',
      teaser:
        'P(A|B) = P(A) and P(A ∩ B) = P(A)P(B) are the same statement. Move the overlap until both verdicts flip together.',
      slides: 'Board 8 · Slide 17',
    },
    {
      id: 'bags',
      title: 'Two bags, one card from each',
      teaser: 'Independent draws multiply. Pick what you want from each bag and count the cards that qualify.',
      slides: 'Slides 18–19',
    },
    {
      id: 'atleastone',
      title: '“At least one” means: do the opposite',
      teaser: 'Three adults, drawn with replacement. Enumerate all eight outcomes, or take the easy one off 1.',
      slides: 'Board 9 · Slides 20–21',
    },
    {
      id: 'spam',
      title: 'Independent features on a spam filter',
      teaser: 'Two clues in an email, and, or and neither. The one worked example that is already machine learning.',
      slides: 'Slides 22–23',
    },
    {
      id: 'replacement',
      title: 'With replacement, and without',
      teaser:
        'Putting the marble back is what keeps the draws independent. Take it out and every later probability shifts.',
      slides: 'Slides 24–25',
    },
    {
      id: 'partition',
      title: 'Cutting the sample space into slices',
      teaser: 'Mutually exclusive and exhaustive. Drag the cuts and watch the slices of B appear underneath.',
      slides: 'Slides 26–27',
    },
    {
      id: 'totalproof',
      title: 'Proving the law of total probability',
      teaser: 'Six lines from B = B ∩ S to the sum. Step through them and watch the picture keep up.',
      slides: 'Board 10–13 · Slide 28',
    },
    {
      id: 'totalexamples',
      title: 'Total probability at work',
      teaser:
        'Petrol, ad clicks, poisonous plants and a mining job. One calculator, four sets of numbers from the slides.',
      slides: 'Slides 29–32, 37–44',
    },
    {
      id: 'bayes',
      title: 'Bayes: running the arrow backwards',
      teaser:
        'You know the effect and want the cause. The binary channel, with the prior and the posterior side by side.',
      slides: 'Slides 33–36',
    },
    {
      id: 'practice',
      title: 'The practice problems',
      teaser: 'All seven from the slides — the four that check out, and the two whose printed answers do not.',
      slides: 'Slides 48–52',
    },
  ],

  dl1: [
    {
      id: 'map',
      title: 'What this course is',
      teaser: 'Ten modules, six labs, and where the marks are. Move the sliders and watch the grade you would need.',
      slides: 'Slides 4–7',
    },
    {
      id: 'whatisdl',
      title: 'What makes learning “deep”',
      teaser:
        'Five definitions from one slide, and the one word they all share. Stack layers and watch the features change.',
      slides: 'Slides 12, 15',
    },
    {
      id: 'nesting',
      title: 'AI, machine learning, neural networks, deep learning',
      teaser: 'Four rings inside each other. Drop a technique in and find out which ring it lands in.',
      slides: 'Slides 13, 14',
    },
    {
      id: 'whynow',
      title: 'Why deep learning, and why now',
      teaser: 'Ten reasons on one slide. Drag the amount of data and watch which model wins.',
      slides: 'Slides 17, 18',
    },
    {
      id: 'history',
      title: 'Seventy years in one line',
      teaser: 'From the 1943 artificial neuron to ChatGPT, with two winters in between. Scrub the timeline.',
      slides: 'Slide 19',
    },
    {
      id: 'apps',
      title: 'What people actually build',
      teaser:
        'Input, output, network type. Pick an application and see which of the two supervised shapes it really is.',
      slides: 'Slides 21–28',
    },
    {
      id: 'components',
      title: 'The four parts of every deep learning problem',
      teaser: 'Data, model, objective, algorithm. Take one away and see exactly what stops working.',
      slides: 'Slides 29, 30',
    },
    {
      id: 'data',
      title: 'Data: examples, features, labels, dimensionality',
      teaser: 'Turn four things in the world into rows of numbers, and watch the shape of the matrix appear.',
      slides: 'Slides 31, 32',
    },
    {
      id: 'model',
      title: 'Model: a program with the numbers left blank',
      teaser:
        'A model family is a program with holes in it. Fill the holes and watch one family produce many programs.',
      slides: 'Slides 33, 38–40',
    },
    {
      id: 'objective',
      title: 'Objective functions: lower is better',
      teaser: 'Squared error for numbers, error rate for categories. Move a prediction and watch the two disagree.',
      slides: 'Slides 34, 35',
    },
    {
      id: 'generalise',
      title: 'Training loss is not the point',
      teaser: 'The moment training loss and unseen loss part company has a name. Turn up the flexibility and find it.',
      slides: 'Slide 36',
    },
    {
      id: 'optimiser',
      title: 'The algorithm that does the searching',
      teaser:
        'Gradient descent, named as the family every deep learning optimiser belongs to. Roll a ball down a loss.',
      slides: 'Slide 37',
    },
    {
      id: 'brain',
      title: 'The observation about the brain',
      teaser:
        'Ten billion neurons, a millisecond each, one second to recognise a scene. Work out how many steps that leaves.',
      slides: 'Slides 44–48',
    },
    {
      id: 'neuron',
      title: 'The artificial neuron',
      teaser: 'Inputs, weights, a sum, a decision. Drag three weights and watch one number change its mind.',
      slides: 'Slides 49–51',
    },
    {
      id: 'perceptron',
      title: 'The perceptron',
      teaser: 'The sum, then the threshold. Drag the boundary and watch every point be re-judged.',
      slides: 'Slides 52, 53',
    },
    {
      id: 'notgate',
      title: 'Solving the NOT gate by hand',
      teaser: 'Two rows, two inequalities, one region of answers. Type weights in and watch both rows go green.',
      slides: 'Slides 54–56',
    },
    {
      id: 'andor',
      title: 'AND and OR, worked in full',
      teaser: 'Four rows each, and the deck’s own answers reproduced. Drag the boundary until all four rows agree.',
      slides: 'Slides 57–62',
    },
    {
      id: 'exercise',
      title: 'The exercise: NOR and NAND',
      teaser:
        'The deck asks and does not answer. Two answers worked out here, and checked by the lab against all four rows.',
      slides: 'Slide 60',
    },
    {
      id: 'learning',
      title: 'The perceptron learning algorithm',
      teaser: 'Δw = η(t − o)x, one symbol at a time, and why it converges only sometimes.',
      slides: 'Slides 65–67',
    },
    {
      id: 'trace',
      title: 'The training trace, row by row',
      teaser: 'The deck’s own table for the NOT gate. Step through it and land on its numbers exactly.',
      slides: 'Slides 68, 69',
    },
    {
      id: 'hyperplane',
      title: 'What a perceptron can represent',
      teaser: 'One hyperplane, and w is the arrow at right angles to it. Turn the arrow, watch the plane follow.',
      slides: 'Slide 72',
    },
    {
      id: 'separable',
      title: 'Linearly separable data',
      teaser: 'Thirteen points and one line, straight from the deck. Every point checked against 2x₁ + 3x₂ − 25.',
      slides: 'Slides 73–76',
    },
    {
      id: 'xor',
      title: 'The data no line can split',
      teaser: 'Four points and a proof by exhaustion. Try every line you like — the lab keeps score.',
      slides: 'Slides 77–79',
    },
    {
      id: 'mlp',
      title: 'The fix: a hidden layer',
      teaser: 'Two neurons in the middle turn XOR into something a third can finish. Push all four inputs through it.',
      slides: 'Slides 80, 81',
    },
  ],

  dl2: [
    {
      id: 'module',
      title: 'What module 2 is for',
      teaser:
        'The same unit as session 1, in the notation the rest of the course uses. Line the two decks up and see what actually changed.',
      slides: 'PDF pages 2–3',
    },
    {
      id: 'brain',
      title: 'How humans learn, and the arithmetic behind it',
      teaser: 'Association, ten billion neurons, a millisecond each. Work out how many steps that leaves.',
      slides: 'PDF pages 4–6',
    },
    {
      id: 'bioneuron',
      title: 'The biological neuron, part by part',
      teaser:
        'Dendrites in, soma decides, axon out, synapses connect. Trace a signal through and see which artificial part each one became.',
      slides: 'PDF page 7',
    },
    {
      id: 'neuron',
      title: 'The artificial neuron N',
      teaser: 'One weight per feature, saying how much it matters. Drag the weights and watch importance change hands.',
      slides: 'PDF pages 8–10',
    },
    {
      id: 'maths',
      title: 'z = Σ wᵢxᵢ + b, then f',
      teaser:
        'The two equations the whole course is written in. Pick an activation and watch the same z become four different answers.',
      slides: 'PDF page 11',
    },
    {
      id: 'compare',
      title: 'Biological against artificial',
      teaser:
        'Six rows, and only some of them are flattering. Take each claim and decide whether it is a likeness or a difference.',
      slides: 'PDF page 12',
    },
    {
      id: 'ann',
      title: 'From one neuron to a network',
      teaser: 'Layers, and three kinds of interconnection. Build a network and watch the parameter count explode.',
      slides: 'PDF pages 13–14',
    },
    {
      id: 'whenann',
      title: 'When a neural network is the right answer',
      teaser: 'Five conditions, and one of them is a warning. Score a problem against all five.',
      slides: 'PDF pages 15–16',
    },
    {
      id: 'connectionism',
      title: 'Connectionism: the knowledge is in the wiring',
      teaser: 'No single unit knows anything. Delete one and watch the network barely notice.',
      slides: 'PDF pages 17–18',
    },
    {
      id: 'perceptron',
      title: 'The perceptron, as this deck defines it',
      teaser: 'Rosenblatt 1958, and an output of 1 or 0 decided by ≥ 0. Drag the boundary and watch the rule fire.',
      slides: 'PDF pages 19–21',
    },
    {
      id: 'andgate',
      title: 'AND, in the 0/1 encoding',
      teaser:
        'Four rows, four inequalities, and the deck’s answer w = (−1, 0.75, 0.75). Every row checked as you watch.',
      slides: 'PDF pages 22–26',
    },
    {
      id: 'orgate',
      title: 'OR, and how little has to change',
      teaser: 'Same bias, bigger weights. Slide from the AND answer to the OR answer and see the corner change hands.',
      slides: 'PDF pages 27–29',
    },
    {
      id: 'exercise',
      title: 'The exercise: NOR and NAND',
      teaser:
        'The deck asks and does not answer. Worked out here in its own encoding, and checked against all four rows.',
      slides: 'PDF page 30',
    },
    {
      id: 'pla',
      title: 'The learning algorithm, line by line',
      teaser: 'Random start, η = 0.1, and a bias that updates on its own line. Run it on any gate and watch it stop.',
      slides: 'PDF pages 31–32',
    },
    {
      id: 'nottrace',
      title: 'The NOT gate, worked epoch by epoch',
      teaser: 'The deck’s own four steps, reproduced by running the rule — including the two labels it gets wrong.',
      slides: 'PDF pages 33–35',
    },
    {
      id: 'xor',
      title: 'XOR, and why one line cannot do it',
      teaser:
        'The same four points in the 0/1 encoding. Try every line the lab will let you, then read the two-line proof.',
      slides: 'PDF pages 36–37',
    },
    {
      id: 'separable',
      title: 'Linearly separable data, defined properly',
      teaser: 'An (n − 1)-dimensional hyperplane, and infinitely many of them. Count the separators for yourself.',
      slides: 'PDF pages 39–41',
    },
    {
      id: 'fourparts',
      title: 'The perceptron as a full learning system',
      teaser:
        'Data, model, objective, algorithm — with an objective named for the first time. Then h = wᵀx in one line.',
      slides: 'PDF pages 42–43',
    },
    {
      id: 'encodings',
      title: 'Four conventions, and how not to lose marks',
      teaser:
        'This deck uses three output rules and session 1 used a fourth. Feed one set of weights to each and watch the answers disagree.',
      slides: 'PDF pages 21, 33, 43 · Session 1 slide 53',
    },
  ],

  dl3: [
    {
      id: 'whatis',
      title: 'What regression is',
      teaser:
        'A continuous number out, not a category. Drag a target between the two kinds of task and watch the name change.',
      slides: 'Slides 4–5',
    },
    {
      id: 'linear',
      title: 'What makes it linear',
      teaser:
        'A weighted sum of the features and nothing else. Bend the truth and watch a straight model fail honestly.',
      slides: 'Slides 7–9',
    },
    {
      id: 'components',
      title: 'The four components, for regression',
      teaser:
        'The same checklist as session 1, filled in with this session’s answers. Take one away and see what stops.',
      slides: 'Slide 11',
    },
    {
      id: 'design',
      title: 'The design matrix',
      teaser: 'Glue a column of ones on the front and the bias becomes an ordinary weight. Build X row by row.',
      slides: 'Slide 12',
    },
    {
      id: 'neuron',
      title: 'Linear regression is one neuron',
      teaser:
        'Same picture as the perceptron, different last box. Feed a point through both and watch where they part.',
      slides: 'Slides 13–14',
    },
    {
      id: 'identity',
      title: 'The identity activation',
      teaser: 'f(z) = z, and f′(z) = 1. Compare it against the step and see which one a gradient can pass through.',
      slides: 'Slides 15–16',
    },
    {
      id: 'loss',
      title: 'Squared error, per example and in total',
      teaser:
        'The ½ that makes the derivative tidy, and the 1/N that makes it a mean. Drag a point and watch both numbers move.',
      slides: 'Slide 17',
    },
    {
      id: 'whysq',
      title: 'Why squared error and not something else',
      teaser:
        'Four reasons on one slide, and the vector form. Swap in absolute error and watch which of the four survive.',
      slides: 'Slide 18',
    },
    {
      id: 'surface',
      title: 'The error surface',
      teaser:
        'Every choice of weights is a point, and the height is the loss. Drag the line and watch the bowl fill in.',
      slides: 'Slide 19',
    },
    {
      id: 'gd',
      title: 'Gradient descent, the idea',
      teaser: 'Stand on the surface and step downhill. One step at a time, with the slope deciding the direction.',
      slides: 'Slide 20',
    },
    {
      id: 'batch',
      title: 'The batch algorithm, line by line',
      teaser: 'Nine lines of pseudocode. Step through them and watch each variable change.',
      slides: 'Slide 21',
    },
    {
      id: 'gradient',
      title: 'Computing the gradient',
      teaser: '∇J = (1/N)Xᵀ(Xw − y), built up one matrix at a time and checked against the sum it came from.',
      slides: 'Slide 22',
    },
    {
      id: 'update',
      title: 'The update rule, and what η does',
      teaser: 'Too large overshoots, too small crawls. Find the value where it stops converging at all.',
      slides: 'Slides 23–24',
    },
    {
      id: 'example',
      title: 'The worked example, step by step',
      teaser:
        'Three houses, w = 0, η = 0.1. Follow the deck from a loss of 7.5 to 1.51 in one iteration, every number recomputed.',
      slides: 'Slides 26–30',
    },
    {
      id: 'graph',
      title: 'The computational graph',
      teaser:
        'Forwards to the loss, backwards to the gradient. Press each node and watch the value flowing through it.',
      slides: 'Slide 31',
    },
    {
      id: 'traintest',
      title: 'Training error against test error',
      teaser: 'Two numbers from the same formula on different rows. Move the split and watch them come apart.',
      slides: 'Slide 33',
    },
    {
      id: 'metrics',
      title: 'MSE, RMSE and MAE',
      teaser: 'Three summaries of the same errors. Drag one point to the far end and see which ones panic.',
      slides: 'Slide 34',
    },
    {
      id: 'r2',
      title: 'R², and what “no better than the mean” means',
      teaser: 'A score with a baseline built in. Push a model below zero and find out what that says about it.',
      slides: 'Slide 35',
    },
    {
      id: 'tips',
      title: 'Choosing η, stopping, scaling',
      teaser: 'The practical half. Put two features on wildly different scales and watch training crawl.',
      slides: 'Slides 39–40',
    },
    {
      id: 'debug',
      title: 'The debugging checklist',
      teaser: 'Four symptoms with named causes. Break the training run four ways and match each to its line.',
      slides: 'Slide 41',
    },
    {
      id: 'summary',
      title: 'The whole loop, in one picture',
      teaser: 'Data, model, objective, learning — round and round. Run the loop end to end and watch it settle.',
      slides: 'Slides 43–45',
    },
  ],
  lec4: [
    {
      id: 'why',
      title: 'What a decomposition is for',
      teaser:
        'Summarise a matrix, take it apart, rebuild it from less. Type a matrix and watch which of the lecture’s tools it qualifies for.',
      slides: 'Slide 1',
    },
    {
      id: 'cofactor',
      title: 'The determinant by cofactors',
      teaser:
        'Strike out a row and a column, take the smaller determinant, put a sign on it. Expand along whichever row or column you like and get the same answer.',
      slides: 'Slides 2–4',
    },
    {
      id: 'detproof',
      title: 'What row moves do to a determinant',
      teaser:
        'Swap two rows and the sign flips. Add a multiple of one row to another and nothing happens at all. Both proved, one move at a time.',
      slides: 'Slides 5–8',
    },
    {
      id: 'rankdet',
      title: 'Full rank exactly when det ≠ 0',
      teaser:
        'Row-reduce to a staircase, count the swaps, multiply the diagonal. Then break one row and watch rank and determinant fail together.',
      slides: 'Slides 9–10',
    },
    {
      id: 'trace',
      title: 'The trace',
      teaser:
        'Add up the diagonal and stop. Four rules — and one of them still holds when AB and BA are different sizes.',
      slides: 'Slide 11',
    },
    {
      id: 'charpoly',
      title: 'The characteristic polynomial',
      teaser:
        'Put a letter on the diagonal, take the determinant, and a polynomial in λ falls out. Its bottom coefficient is det A and its next one is the trace.',
      slides: 'Slides 12–14',
    },
    {
      id: 'eigendef',
      title: 'Eigenvalues and eigenvectors',
      teaser:
        'Drag a vector round a circle until A stops turning it. Four ways of saying the same thing, all ticking at once.',
      slides: 'Slide 15',
    },
    {
      id: 'example',
      title: 'The deck’s worked example',
      teaser: 'A of all ones: the polynomial, the roots λ = 2 and 0, and the two eigenvectors, one press at a time.',
      slides: 'Slide 16',
    },
    {
      id: 'procedure',
      title: 'The procedure, and the matrix that runs short',
      teaser:
        'Roots first, nullspaces second. Then the matrix with one eigenvector where you wanted two, and the rotation the slide asks you to ponder.',
      slides: 'Slide 17',
    },
    {
      id: 'eigenspace',
      title: 'The eigenspace, and the spectrum',
      teaser:
        'Every eigenvector of one λ, plus the zero vector, makes a subspace. Add two and stretch one, and watch it stay inside.',
      slides: 'Slide 18',
    },
    {
      id: 'properties',
      title: 'Transpose, nullspace, positive definite',
      teaser:
        'A and Aᵀ share every eigenvalue. Eλ is a nullspace. And a symmetric positive definite matrix can never have a negative one.',
      slides: 'Slide 19',
    },
    {
      id: 'independence',
      title: 'Distinct eigenvalues, and why AᵀA is everywhere',
      teaser:
        'Different λ forces independent x. Then build AᵀA from a data matrix and watch it stop being positive definite the moment two features repeat.',
      slides: 'Slide 20',
    },
    {
      id: 'spectral',
      title: 'The spectral theorem',
      teaser:
        'Symmetric matrices get a full orthonormal basis of eigenvectors. The three claims that rests on, and the two multiplicities that have to agree.',
      slides: 'Slides 21–22',
    },
    {
      id: 'complex',
      title: 'Complex vectors, and what length means',
      teaser:
        'The deck’s own x: xᵀx comes out at 3 + 6i, which is not a length. Mend the definition and it comes out at 7.',
      slides: 'Slide 23',
    },
    {
      id: 'hermitian',
      title: 'Hermitian matrices',
      teaser:
        'Transpose, then conjugate. The generalisation of symmetric — and the reason its diagonal has to be real.',
      slides: 'Slide 24',
    },
    {
      id: 'realeigs',
      title: 'Why symmetric means real and orthogonal',
      teaser:
        'Two short proofs, both done by premultiplying with xᴴ. Then check the right angle on a real pair of eigenvectors.',
      slides: 'Slides 25–26',
    },
    {
      id: 'decomp',
      title: 'A = QΛQᵀ',
      teaser:
        'Eigenvectors into the columns, eigenvalues down the diagonal. Multiply the three back together and check you get what you started with.',
      slides: 'Slides 27–28',
    },
    {
      id: 'traceeigs',
      title: 'The sum is the trace, the product is the determinant',
      teaser:
        'Two free checks on any eigenvalue answer you write in an exam. Edit the matrix and watch both keep holding.',
      slides: 'Slide 29',
    },
    {
      id: 'cholesky',
      title: 'Cholesky: A = LLᵀ',
      teaser:
        'The deck’s six formulas, worked as you type and then multiplied back out to prove them. Break positive definiteness and watch it stop dead.',
      slides: 'Slide 30',
    },
    {
      id: 'gaussian',
      title: 'Sampling a multivariate Gaussian',
      teaser:
        'Round independent noise in, tilted correlated data out. Turn L on and off and watch the cloud lean over.',
      slides: 'Slide 31',
    },
  ],
}

export function partsOf(topic: TopicId): PartMeta[] {
  return LECTURE_PARTS[topic] ?? []
}

export function partIndex(topic: TopicId, partId: string) {
  return partsOf(topic).findIndex((p) => p.id === partId)
}
