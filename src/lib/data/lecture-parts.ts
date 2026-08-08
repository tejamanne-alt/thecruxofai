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
}

export function partsOf(topic: TopicId): PartMeta[] {
  return LECTURE_PARTS[topic] ?? []
}

export function partIndex(topic: TopicId, partId: string) {
  return partsOf(topic).findIndex((p) => p.id === partId)
}
