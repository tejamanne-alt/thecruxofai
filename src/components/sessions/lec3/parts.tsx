/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  AngleLab,
  CauchyLab,
  DeckAngleLab,
  GeometryAddsLab,
  HighDimLab,
  InnerProductAxiomLab,
  MetricLab,
  SpdFactsLab,
} from '@/components/charts/geometry-lab'
import { BilinearLab, NormAxiomLab, NormBallLab } from '@/components/charts/norm-lab'
import {
  ElementaryMatrixLab,
  FinalArgumentLab,
  GramSchmidtLab,
  LuLab,
  OrthonormalBasisLab,
  RotationLab,
} from '@/components/charts/ortho-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

/** A little spacer so a lab never sits flush against the words above it. */
function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
}

/** One formula on its own line, set apart from the prose around it. */
function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-950/10 bg-zinc-50 px-4 py-3 text-center font-mono text-[15px] text-zinc-900">
      {children}
    </div>
  )
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="crux-prose mb-3 flex list-disc flex-col gap-1.5 pl-5 text-[14px]/[1.7] text-zinc-700">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

/** Material that is not on the slides, marked so it can never be mistaken for the deck. */
function Beyond({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-dashed border-zinc-950/20 bg-white px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
        Not on the slides — added to make this land
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-700">{children}</div>
    </div>
  )
}

export const LEC3_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  why: (
    <>
      <Para>
        Lecture 2 built the vector space. You could add two vectors, stretch one, and from those two moves came span,
        independence, basis and dimension. Notice what was <em>not</em> there: at no point could you say how{' '}
        <strong>long</strong> a vector was, how <strong>far apart</strong> two of them were, or what{' '}
        <strong>angle</strong> sat between them.
      </Para>
      <Para>
        That is not an oversight. A vector space genuinely has no ruler in it. Analytic geometry is the lecture that
        adds one — and remarkably, a single new object supplies all three measurements at once.
      </Para>

      <Lab>
        <GeometryAddsLab />
      </Lab>

      <Para>
        The new object is the <strong>inner product</strong>. Everything in this lecture comes out of it in a chain, and
        it is worth seeing the whole chain before starting, because each link explains why the next one exists:
      </Para>
      <List
        items={[
          <>
            An <strong>inner product</strong> ⟨x, y⟩ takes two vectors and returns one plain number.
          </>,
          <>
            It gives a <strong>length</strong>: ‖x‖ = √⟨x, x⟩. A vector’s size is how much it agrees with itself.
          </>,
          <>
            Length gives a <strong>distance</strong>: d(x, y) = ‖x − y‖. How far apart is the gap between them.
          </>,
          <>
            And <strong>Cauchy–Schwarz</strong> keeps a certain ratio inside [−1, 1], which lets you call it a cosine —
            so you get an <strong>angle</strong> too.
          </>,
        ]}
      />
      <Para>
        Then the lecture turns the idea round. If angle now means something, some bases are nicer than others — the ones
        whose vectors are all at right angles and all of length 1. The last third of the deck is a method for building
        such a basis out of any basis you happen to have.
      </Para>

      <Terms
        items={[
          {
            term: 'analytic geometry',
            def: 'Doing geometry — lengths, angles, distances — with algebra rather than with a ruler and compass.',
          },
          {
            term: 'inner product',
            say: 'INN-er product',
            def: 'A rule that takes two vectors and gives one number, obeying three conditions set out in part 5. The dot product is the most familiar one.',
          },
          {
            term: '⟨x, y⟩',
            say: 'the inner product of x and y',
            def: 'The angle brackets are the standard notation. Some books write ⟨x, y⟩, some write x · y, some write xᵀy — for the dot product these are all the same thing.',
          },
          {
            term: 'norm',
            def: 'A length. Written with double bars: ‖x‖. Single bars |x| mean absolute value of a number, so the doubling matters.',
          },
          { term: 'metric', def: 'A distance between two points. Written d(x, y).' },
          {
            term: 'ω',
            say: 'omega',
            def: 'The Greek letter this deck uses for the angle between two vectors. Other books use θ (theta); they mean the same thing.',
          },
        ]}
      />

      <WhyAiml method="cosine similarity · k-means · nearest neighbours">
        <p className="mb-2">
          Almost everything in machine learning is a comparison between two vectors, and every kind of comparison on
          this page is one that gets used. A recommender asks whether two users’ taste vectors point the same way — that
          is an <strong>angle</strong>. k-means asks which cluster centre a point is closest to — that is a{' '}
          <strong>distance</strong>. Weight decay penalises models whose parameter vector is too big — that is a{' '}
          <strong>length</strong>.
        </p>
        <p>
          None of those three questions can even be stated in a plain vector space. They all need the extra structure
          this lecture adds, which is why a course in maths for ML spends a whole session on it.
        </p>
      </WhyAiml>

      <Takeaway>
        A vector space lets you add and stretch. It cannot measure. The inner product is the one addition that gives you
        length, distance and angle together.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  norms: (
    <>
      <Para>
        Start with length, because it is the easiest of the three to picture. A <strong>norm</strong> is a function that
        takes one vector and returns one number — its length. The deck writes it like this:
      </Para>
      <Formula>‖·‖ : V → ℝ,   x ↦ ‖x‖</Formula>
      <Para>
        Read that slowly, because this style of writing appears everywhere from here on. The dot in ‖·‖ is a{' '}
        <em>placeholder</em> — it means “something goes here”. <span className="font-mono">V → ℝ</span> means it eats a
        vector from the space V and hands back a real number. And <span className="font-mono">x ↦ ‖x‖</span> — that is a
        bar-arrow, not the same as the plain arrow — names what happens to a particular x.
      </Para>
      <Para>Not just any function will do. Three things have to be true, for every vector and every number λ:</Para>
      <List
        items={[
          <>
            <strong>Absolutely homogeneous.</strong> ‖λx‖ = |λ|·‖x‖. Stretch a vector by 3 and its length triples.
            Stretch it by −3 and the length <em>also</em> triples, because |−3| = 3 — pointing backwards does not make
            something shorter.
          </>,
          <>
            <strong>Triangle inequality.</strong> ‖x + y‖ ≤ ‖x‖ + ‖y‖. Going straight there is never longer than going
            via somewhere else.
          </>,
          <>
            <strong>Positive definite.</strong> ‖x‖ ≥ 0 always, and ‖x‖ = 0 only when x is the zero vector. Lengths are
            never negative, and only nothing has no length.
          </>,
        ]}
      />
      <Para>
        The lab lets you break each one deliberately. Every broken version below is something a person might plausibly
        write down, which is the point — the rules exist to rule these out.
      </Para>

      <Lab>
        <NormAxiomLab />
      </Lab>

      <Terms
        items={[
          {
            term: '‖x‖',
            say: 'the norm of x',
            def: 'The length of x. Double bars distinguish it from |x|, the absolute value of a single number.',
          },
          {
            term: 'λ',
            say: 'lambda',
            def: 'A scalar — an ordinary real number you multiply a vector by. Nothing more mysterious than that.',
          },
          {
            term: '|λ|',
            say: 'mod lambda',
            def: 'The absolute value: throw away the minus sign. |−3| = 3.',
          },
          {
            term: '↦',
            say: 'maps to',
            def: 'The bar-arrow. "x ↦ ‖x‖" says what the function does to one input, where "V → ℝ" says which sets it runs between.',
          },
          {
            term: 'absolutely homogeneous',
            say: 'ho-mo-JEE-nee-us',
            def: 'Scaling the input scales the output by the same amount, ignoring sign.',
          },
          {
            term: 'positive definite',
            def: 'Never negative, and zero only in the one case where it obviously should be. The phrase comes back for inner products, where it means much the same thing.',
          },
        ]}
      />

      <Beyond>
        A useful mental check for the triangle inequality: it is the reason a shortcut is a shortcut. If some proposed
        “length” let ‖x + y‖ exceed ‖x‖ + ‖y‖, then walking directly from A to C could be further than walking A → B →
        C, and every map, route planner and clustering algorithm built on it would give nonsense.
      </Beyond>

      <WhyAiml method="L1 and L2 regularisation · gradient clipping · weight decay">
        <p className="mb-2">
          A trained model is a big vector of weights, and its <em>norm</em> is one of the most-used quantities in all of
          machine learning. Adding λ‖w‖² to a loss function — <strong>weight decay</strong>, or ridge regression — tells
          the optimiser to prefer small weights, which stops it fitting noise. Adding λ‖w‖₁ instead does something
          subtly different that the next part explains.
        </p>
        <p>
          <strong>Gradient clipping</strong>, which keeps deep networks from blowing up during training, is literally
          the line “if ‖g‖ {'>'} c, replace g by c·g/‖g‖”. That rescaling only makes sense because of absolute
          homogeneity — the first rule on this page.
        </p>
      </WhyAiml>

      <Takeaway>
        A norm is any length-like function obeying three rules: scaling scales it, the direct route is shortest, and it
        is zero only for the zero vector.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  l1l2: (
    <>
      <Para>
        The deck gives two norms by name. Both obey all three rules, so both are honest lengths — they simply disagree
        about how far away things are.
      </Para>
      <Formula>‖x‖₁ = Σᵢ |xᵢ|      ‖x‖₂ = √( Σᵢ xᵢ² )</Formula>
      <Para>
        The <strong>Manhattan norm</strong> ‖x‖₁ adds up the absolute values of the components. The name comes from a
        city laid out on a grid: you cannot cut diagonally through the buildings, so the distance you actually walk is
        “three blocks east plus four blocks north” = 7, not the 5 a bird would fly.
      </Para>
      <Para>
        The <strong>Euclidean norm</strong> ‖x‖₂ is the bird’s distance — Pythagoras, extended to as many components as
        you like. It is the one people mean when they say “length” without qualifying it. The little subscripts 1 and 2
        refer to the power inside: sum of |xᵢ|¹, and the square root of the sum of |xᵢ|².
      </Para>
      <Para>
        The clearest way to see the difference is the <strong>unit ball</strong> — every point the norm calls distance 1
        from the origin. For ‖·‖₂ that is a circle. For ‖·‖₁ it is a diamond.
      </Para>

      <Lab>
        <NormBallLab />
      </Lab>

      <Worked title="The same point, measured both ways">
        {`x = (3, 4)

‖x‖₁ = |3| + |4|        = 3 + 4 = 7
‖x‖₂ = √(3² + 4²)       = √25   = 5

‖x‖₁ is bigger, and it always is (or equal):
the grid route can never beat the straight line.

when are they equal?
    when the vector lies along an axis, e.g. (5, 0):
    ‖(5,0)‖₁ = 5  and  ‖(5,0)‖₂ = 5    — no diagonal to save on.`}
      </Worked>

      <Terms
        items={[
          {
            term: 'Σ',
            say: 'sigma, meaning "sum of"',
            def: 'Add up what follows, once for each value of the index. Σᵢ₌₁ⁿ xᵢ means x₁ + x₂ + ⋯ + xₙ.',
          },
          { term: 'xᵢ', say: 'x sub i', def: 'The i-th component of the vector x — the i-th number in the list.' },
          {
            term: '‖x‖₁',
            say: 'the L-one norm',
            def: 'Manhattan, or taxicab, norm. Add the absolute values.',
          },
          {
            term: '‖x‖₂',
            say: 'the L-two norm',
            def: 'Euclidean norm. The ordinary straight-line length. When a norm is written with no subscript at all, this is almost always the one meant.',
          },
          {
            term: 'unit ball',
            def: 'Every vector of length exactly 1 under a given norm. Its shape is a picture of the norm itself.',
          },
        ]}
      />

      <Beyond>
        The pattern continues: ‖x‖ₚ = (Σ|xᵢ|ᵖ)^(1/p) for any p ≥ 1, and ‖x‖∞ = maxᵢ|xᵢ| in the limit. The lab has ‖·‖∞
        as a third option — its unit ball is a square. Only p = 2 comes from an inner product, which is the fact part 8
        turns on.
      </Beyond>

      <WhyAiml method="Lasso vs ridge regression · sparse models">
        <p className="mb-2">
          This is one of the highest-value facts in applied machine learning, and the diamond is the reason. Penalising
          a model with ‖w‖₁ (<strong>Lasso</strong>) tends to drive weights to <em>exactly</em> zero, so features drop
          out of the model entirely. Penalising with ‖w‖₂² (<strong>ridge</strong>) shrinks weights towards zero but
          rarely all the way.
        </p>
        <p>
          The unit balls explain why. The best solution tends to touch the constraint region at a corner, and the L1
          diamond has its corners <em>on the axes</em> — where a coordinate is zero. The L2 circle has no corners, so
          there is nothing to pull a weight exactly onto an axis. If you want a model that selects features for you, you
          want the diamond.
        </p>
      </WhyAiml>

      <Takeaway>
        ‖·‖₁ adds absolute values and has a diamond unit ball; ‖·‖₂ is Pythagoras and has a circular one. ‖x‖₁ ≥ ‖x‖₂
        always, with equality only along an axis.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  bilinear: (
    <>
      <Para>
        Before defining the inner product, the deck needs one piece of vocabulary. It looks forbidding and means
        something small.
      </Para>
      <Para>
        A <strong>mapping</strong> with two arguments is just a rule taking two vectors and giving one number. The deck
        calls it Ω, a capital Greek omega. It is <strong>bilinear</strong> when it is linear in each argument{' '}
        <em>separately</em> — hold one still, and the other behaves linearly.
      </Para>
      <Formula>
        Ω(λx + ψy, z) = λΩ(x, z) + ψΩ(y, z)
        <br />
        Ω(x, λy + ψz) = λΩ(x, y) + ψΩ(x, z)
      </Formula>
      <Para>
        Two lines because there are two slots, and each needs its own promise. In words: you may pull numbers out in
        front, and you may split a sum, doing it to whichever argument you like as long as the other stays fixed.
      </Para>

      <Lab>
        <BilinearLab />
      </Lab>

      <Para>
        The lab computes both sides from your own λ, ψ and matrix A. They never disagree — because Ω(x, y) = xᵀAy, and
        matrix multiplication distributes over addition. That is all bilinearity is.
      </Para>

      <Beyond>
        The trap that costs marks: bilinear does <strong>not</strong> mean Ω(λx, λy) = λΩ(x, y). Scale <em>both</em>{' '}
        arguments and you pick up the factor twice: Ω(λx, λy) = λ·λ·Ω(x, y) = λ²Ω(x, y). You can see it in the plainest
        case, ⟨x, x⟩ = ‖x‖² — doubling x quadruples it. “Bi-linear” means two separate linearities, not one joint one.
      </Beyond>

      <Terms
        items={[
          {
            term: 'Ω',
            say: 'omega (capital)',
            def: 'The deck’s name for a general two-argument mapping, before it is known to be an inner product. Lower-case ω is the angle — different letter, different job.',
          },
          {
            term: 'mapping',
            def: 'A function. "Mapping" is used when the emphasis is on which sets it runs between.',
          },
          {
            term: 'V × V → ℝ',
            say: 'V cross V to R',
            def: 'Takes a pair of vectors, both from V, and returns one real number. The × is a Cartesian product, meaning "a pair of".',
          },
          {
            term: 'bilinear',
            def: 'Linear in the first argument when the second is held fixed, and linear in the second when the first is held fixed.',
          },
          {
            term: 'ψ',
            say: 'psi, rhymes with "sigh"',
            def: 'Another scalar, used alongside λ when two are needed at once. No special meaning beyond being a second number.',
          },
        ]}
      />

      <WhyAiml method="attention scores · kernel methods · backpropagation">
        <p className="mb-2">
          Bilinearity is what makes derivatives of inner products simple, and simple derivatives are what make training
          possible. The gradient of ⟨w, x⟩ with respect to w is just x — no chain of terms, no mess. That single fact is
          why linear layers are cheap to differentiate, and it is bilinearity doing the work.
        </p>
        <p>
          It also appears directly in <strong>attention</strong>. A transformer scores a query against a key with qᵀKx,
          a bilinear form with a learned matrix in the middle — the same xᵀAy shape as the next part, with A learned
          from data rather than chosen.
        </p>
      </WhyAiml>

      <Takeaway>
        Bilinear = linear in each slot on its own. Two promises, one per argument. It does not mean linear in both at
        once — scaling both slots gives λ², not λ.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  innerproduct: (
    <>
      <Para>
        Now the definition the lecture is built on. An <strong>inner product</strong> is a mapping Ω : V × V → ℝ with
        three properties:
      </Para>
      <List
        items={[
          <>
            <strong>Bilinear</strong> — the previous part. Linear in each argument separately.
          </>,
          <>
            <strong>Symmetric</strong> — Ω(x, y) = Ω(y, x). The order of the two vectors makes no difference.
          </>,
          <>
            <strong>Positive definite</strong> — Ω(x, x) {'>'} 0 for every x except the zero vector, and Ω(0, 0) = 0.
          </>,
        ]}
      />
      <Para>
        Once a mapping has all three, it earns the notation ⟨x, y⟩ and the pair{' '}
        <span className="font-mono">(V, ⟨·,·⟩)</span> is called an <strong>inner product space</strong> — the space
        together with its chosen ruler.
      </Para>
      <Para>
        Each condition is doing a specific job, and you can see what by switching it off. The lab offers matrices that
        fail exactly one at a time.
      </Para>

      <Lab>
        <InnerProductAxiomLab />
      </Lab>

      <Para>Why each one is needed, in plain terms:</Para>
      <List
        items={[
          <>
            <strong>Positive definiteness</strong> is what makes length possible at all. ‖x‖ = √⟨x, x⟩ needs ⟨x, x⟩ to
            be positive, or the square root has nothing to work on. Turn it off and the ring in the lab breaks apart.
          </>,
          <>
            <strong>Symmetry</strong> is what makes <em>angle</em> well defined. An angle between x and y that differed
            from the angle between y and x would be no use to anybody.
          </>,
          <>
            <strong>Bilinearity</strong> is what makes it computable — it is what lets the whole thing be written as one
            matrix, which is the next part.
          </>,
        ]}
      />

      <Terms
        items={[
          {
            term: 'inner product space',
            def: 'A vector space with a chosen inner product. Written (V, ⟨·,·⟩) — the space and its ruler, named together, because the same space can carry different rulers.',
          },
          {
            term: '⟨·,·⟩',
            say: 'the inner product',
            def: 'The two dots are placeholders for the two arguments. Writing it this way names the operation without naming any particular vectors.',
          },
          {
            term: '∀',
            say: 'for all',
            def: 'The upside-down A. "∀x ∈ V" means "for every x in V". You will see it in every formal definition from here on.',
          },
          {
            term: '∈',
            say: 'is in, or belongs to',
            def: 'Set membership. "x ∈ V" says x is one of the things in V.',
          },
          {
            term: 'V \\ {0}',
            say: 'V without zero',
            def: 'The backslash means "take away". So this is every vector in V except the zero vector — which is exactly the set positive definiteness talks about.',
          },
        ]}
      />

      <WhyAiml method="kernel trick · Gaussian processes · SVMs">
        <p className="mb-2">
          These three conditions are the entry ticket to <strong>kernel methods</strong>. A kernel k(x, y) is an inner
          product computed in some other, much bigger space, without ever visiting it. Mercer’s theorem says a function
          is a valid kernel precisely when it is symmetric and positive definite — the two conditions on this page.
        </p>
        <p>
          That is why you cannot invent a similarity function and drop it into an SVM. If it fails positive
          definiteness, the optimisation is no longer convex and the guarantees vanish. Checking these axioms is a
          practical step, not a formality.
        </p>
      </WhyAiml>

      <Takeaway>
        Inner product = bilinear + symmetric + positive definite. Positive definiteness gives length, symmetry gives
        angle, bilinearity gives a matrix.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  spdmatrix: (
    <>
      <Para>
        Here is the theorem that ties the lecture together, and it is stronger than it first looks. Slide 5 states it as
        an <strong>if and only if</strong>:
      </Para>
      <Formula>
        ⟨x, y⟩ is an inner product on V  ⟺  there is a symmetric,
        <br />
        positive-definite A with ⟨x, y⟩ = x̂ᵀAŷ
      </Formula>
      <Para>
        Both directions matter. <strong>Every</strong> inner product is secretly a matrix, and <strong>every</strong>{' '}
        symmetric positive-definite matrix gives you one. So choosing an inner product and choosing an SPD matrix are
        the same act, and the whole zoo of possible geometries on a space is just the set of SPD matrices.
      </Para>
      <Para>
        The hats in <span className="font-mono">x̂</span> and <span className="font-mono">ŷ</span> matter and are easy to
        skip past. They mean the <em>coordinates</em> of x with respect to the ordered basis B, not the vector itself.
        Change the basis and the same inner product needs a different matrix. When the basis is the usual one, x̂ and x
        are the same list of numbers, which is why most of the time you can read it as plain xᵀAy.
      </Para>

      <Lab>
        <InnerProductAxiomLab />
      </Lab>

      <Worked title="Reading xᵀAy as an ordinary formula">
        {`in two dimensions, with A = [ a  b ]
                            [ b  c ]

          xᵀAy = [x₁ x₂] [ a  b ] [y₁]
                         [ b  c ] [y₂]

               = a·x₁y₁ + b·x₁y₂ + b·x₂y₁ + c·x₂y₂

so the entries of A are simply the WEIGHTS on each
pairing of components.

  A = I        gives   x₁y₁ + x₂y₂          the dot product
  A = [[2,0],[0,1]]    2x₁y₁ + x₂y₂         first coordinate counts double
  A = [[1,½],[½,1]]    x₁y₁ + ½(x₁y₂+x₂y₁) + x₂y₂
                                            the coordinates now interact`}
      </Worked>

      <Para>
        How do you check a given A is positive definite without testing every x? For a 2×2 there is a quick test, and
        the lab uses it: A is symmetric positive definite exactly when a₁₁ {'>'} 0 and det A {'>'} 0. The general
        version checks every leading top-left square block the same way.
      </Para>

      <Terms
        items={[
          {
            term: 'x̂',
            say: 'x-hat',
            def: 'The coordinates of x with respect to a chosen ordered basis — the list of multipliers, not the vector. With the canonical basis the two look the same.',
          },
          {
            term: 'ordered basis',
            def: 'A basis where the order is fixed, so "the second coordinate" means something. The matrix A depends on that ordering.',
          },
          {
            term: '⟺',
            say: 'if and only if',
            def: 'Both directions hold. A ⟺ B means A implies B and B implies A — they are the same statement in different words.',
          },
          {
            term: 'symmetric matrix',
            def: 'A equals its own transpose: aᵢⱼ = aⱼᵢ. Mirror it along the diagonal and nothing changes.',
          },
          {
            term: 'positive definite matrix',
            def: 'xᵀAx > 0 for every non-zero x. For a symmetric 2×2, the same as a₁₁ > 0 and det A > 0.',
          },
          {
            term: 'Sylvester’s criterion',
            def: 'Beyond the deck: the general test — every leading principal minor (top-left 1×1, 2×2, 3×3 …) must have positive determinant.',
          },
        ]}
      />

      <WhyAiml method="Mahalanobis distance · covariance matrices · metric learning">
        <p className="mb-2">
          This theorem is the licence for <strong>Mahalanobis distance</strong>, which is what you use when your
          features are on different scales or are correlated. Take A = Σ⁻¹, the inverse covariance matrix — symmetric
          and positive definite, so the theorem applies — and distances become scale-aware automatically. Height in
          metres and weight in kilograms stop drowning each other out.
        </p>
        <p>
          <strong>Metric learning</strong> goes one step further and <em>learns</em> A from labelled pairs, so the model
          discovers which directions in feature space actually matter. The whole field exists because of the
          if-and-only-if on this page: searching over inner products is the same as searching over SPD matrices, and
          that is a search a computer can do.
        </p>
      </WhyAiml>

      <Takeaway>
        Every inner product is x̂ᵀAŷ for exactly one symmetric positive-definite A, and every such A gives an inner
        product. Choosing a geometry = choosing an SPD matrix.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  spdfacts: (
    <>
      <Para>
        Slide 6 asks two questions about symmetric positive-definite matrices and answers both from the same line of the
        definition. They are short arguments and they are very likely exam material, so it is worth being able to
        reproduce them.
      </Para>
      <Para>
        <strong>Can an SPD matrix have less than full rank?</strong> No. Suppose Ax = 0 for some x. Then multiplying by
        xᵀ gives xᵀAx = 0. But positive definiteness says xᵀAx {'>'} 0 for every non-zero x. So the only x with Ax = 0
        is x = 0 itself: the nullspace holds nothing but the origin, its dimension is 0, and by rank–nullity the rank is
        full.
      </Para>
      <Para>
        <strong>What about the diagonal?</strong> Put x = eᵢ, the i-th canonical basis vector — all zeros except a 1 in
        position i. Then eᵢᵀAeᵢ picks out exactly the entry Aᵢᵢ. Since eᵢ is not the zero vector, positive definiteness
        forces Aᵢᵢ {'>'} 0. Every diagonal entry is strictly positive.
      </Para>

      <Lab>
        <SpdFactsLab />
      </Lab>

      <Para>
        Both arguments have the same shape, and it is a shape worth stealing: the definition is a statement about{' '}
        <em>every</em> x, so you get to choose a convenient one. Choosing eᵢ gives the diagonal. Choosing a hypothetical
        nullspace vector gives the rank.
      </Para>

      <Beyond>
        The converse fails, and the lab lets you check it. A positive diagonal does <strong>not</strong> make a matrix
        positive definite. Try a₁₁ = 1, a₂₂ = 1, a₁₂ = 3: the diagonal is positive, but det A = 1 − 9 = −8, and x = (1,
        −1) gives xᵀAx = 1 − 6 + 1 = −4. Marking schemes love this counterexample.
      </Beyond>

      <Worked title="Both arguments, as you would write them out">
        {`FULL RANK
    suppose  Ax = 0  for some x
    then     xᵀAx = xᵀ0 = 0
    but      xᵀAx > 0  for all x ≠ 0        (positive definite)
    so       x = 0 is the only possibility
    hence    nullspace = {0},  dim = 0
    and      rank = n − 0 = n                (rank–nullity)

POSITIVE DIAGONAL
    take     x = eᵢ = (0, …, 1, …, 0)        1 in position i
    then     eᵢᵀAeᵢ = Aᵢᵢ                     picks out one entry
    but      eᵢ ≠ 0, so eᵢᵀAeᵢ > 0
    hence    Aᵢᵢ > 0  for every i`}
      </Worked>

      <Terms
        items={[
          {
            term: 'eᵢ',
            say: 'e sub i',
            def: 'The i-th canonical basis vector: all zeros with a single 1 in position i. e₁ = (1,0,…,0), e₂ = (0,1,0,…,0).',
          },
          {
            term: 'nullspace',
            def: 'Every x with Ax = 0. Lecture 2 showed it is always a subspace; here it turns out to be as small as possible.',
          },
          {
            term: 'full rank',
            def: 'Rank equal to the number of rows or columns, whichever is smaller. For a square matrix it means invertible.',
          },
          {
            term: 'rank–nullity',
            def: 'rank + nullity = number of columns. Nullity is the dimension of the nullspace.',
          },
          { term: 'Aᵢᵢ', say: 'A sub i i', def: 'A diagonal entry — row i, column i.' },
        ]}
      />

      <WhyAiml method="Newton’s method · Gaussian likelihoods · Cholesky">
        <p className="mb-2">
          Full rank means invertible, and that is what makes SPD matrices the workhorses of optimisation. Second-order
          methods step by solving H⁻¹∇f, where H is the Hessian; when H is positive definite the step is guaranteed to
          go downhill and the inverse is guaranteed to exist. When it is not, the method can walk uphill — which is why
          practical optimisers add a multiple of the identity until it becomes positive definite.
        </p>
        <p>
          The same requirement is why a Gaussian needs a positive-definite covariance: its density contains Σ⁻¹ and √det
          Σ, and both need the facts on this page. In code, the usual check is a <strong>Cholesky decomposition</strong>{' '}
          — it succeeds exactly when the matrix is SPD, so “did Cholesky fail?” is the practical test.
        </p>
      </WhyAiml>

      <Takeaway>
        SPD forces full rank (nothing can be sent to zero) and a strictly positive diagonal (substitute eᵢ). A positive
        diagonal on its own proves nothing.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  induced: (
    <>
      <Para>
        Norms and inner products are two different ideas, and slide 7 says exactly how they are related. Any inner
        product gives you a norm for free:
      </Para>
      <Formula>‖x‖ = √⟨x, x⟩</Formula>
      <Para>
        This is called the <strong>induced norm</strong> — the length that the inner product produces without being
        asked. It is well defined precisely because of positive definiteness: ⟨x, x⟩ is never negative, so the square
        root is always real.
      </Para>
      <Para>
        The relationship only runs one way, and that is the part worth remembering.{' '}
        <strong>Not every norm comes from an inner product.</strong> The deck names the Manhattan norm as an example:
        ‖·‖₁ is a perfectly good length, but no inner product produces it.
      </Para>

      <Beyond>
        There is a clean test for this, and it is a favourite exam question. A norm comes from an inner product if and
        only if it obeys the <strong>parallelogram law</strong>: ‖x + y‖² + ‖x − y‖² = 2‖x‖² + 2‖y‖². Try x = (1, 0) and
        y = (0, 1) with the Manhattan norm — the left side is 2² + 2² = 8, the right side is 2·1 + 2·1 = 4. They differ,
        so ‖·‖₁ has no inner product behind it. With the Euclidean norm both sides come to 4.
      </Beyond>

      <Lab>
        <AngleLab />
      </Lab>

      <Para>
        The faint ring in the lab is the induced norm made visible: every vector this inner product calls length 1.
        Switch A and the ring changes shape, because the length changed. Same arrows, different ruler.
      </Para>

      <Terms
        items={[
          {
            term: 'induced norm',
            def: 'The length √⟨x, x⟩ that an inner product hands you automatically.',
          },
          {
            term: '⟨x, x⟩',
            def: 'A vector against itself. Always ≥ 0, and equal to the length squared — which is why it turns up more often than ‖x‖ itself: no square root to differentiate.',
          },
          {
            term: 'parallelogram law',
            def: 'Beyond the deck: the test for whether a norm has an inner product behind it. The squared diagonals of a parallelogram add to the squared sides.',
          },
        ]}
      />

      <WhyAiml method="least squares · MSE loss · why squared error is everywhere">
        <p className="mb-2">
          This is why <strong>mean squared error</strong> is the default loss and L1 loss is the specialist choice.
          Squared error is ‖y − ŷ‖₂², an induced norm, so it comes with an inner product — and that brings projections,
          orthogonality and a closed-form solution. Least squares has an exact answer because of the geometry on this
          page.
        </p>
        <p>
          Swap to L1 loss and all of that machinery disappears, because ‖·‖₁ has no inner product behind it. There is no
          projection, no normal equations, no closed form — you have to optimise numerically. L1 is still worth using
          when outliers matter, but you are giving up the geometry, and this slide is where you can see why.
        </p>
      </WhyAiml>

      <Takeaway>
        Every inner product induces a norm, ‖x‖ = √⟨x, x⟩. The reverse fails: ‖·‖₁ is a norm with no inner product
        behind it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  cauchy: (
    <>
      <Para>
        Cauchy–Schwarz is the inequality that makes angles possible, and the deck proves it in six lines. The statement:
      </Para>
      <Formula>|⟨x, y⟩| ≤ ‖x‖·‖y‖</Formula>
      <Para>
        In words: the inner product of two vectors can never be bigger in size than the product of their lengths. The
        proof is a small piece of cleverness, and it is much easier to hold onto once you have seen the picture.
      </Para>
      <Para>
        Start with something obviously true. For any vectors u and v and <em>any</em> number α, the vector u − αv has a
        length, and lengths squared are never negative:
      </Para>
      <Formula>‖u − αv‖² = (u − αv)ᵀ(u − αv) ≥ 0</Formula>
      <Para>Expand it — this is just multiplying out brackets, keeping the order of the terms:</Para>
      <Formula>uᵀu − 2α·uᵀv + α²·vᵀv ≥ 0</Formula>
      <Para>
        Now the clever bit. This holds for <em>every</em> α, so it holds in particular for the worst one — the α that
        makes the left side as small as possible. That is α = uᵀv / vᵀv, the bottom of the parabola. Substituting it in
        and tidying up gives Cauchy–Schwarz.
      </Para>

      <Lab>
        <CauchyLab />
      </Lab>

      <Worked title="The substitution, with the algebra written out">
        {`start        uᵀu − 2α(uᵀv) + α²(vᵀv) ≥ 0        for every α

put          α = uᵀv / vᵀv

middle       −2 · (uᵀv/vᵀv) · (uᵀv)  = −2(uᵀv)²/(vᵀv)
last         (uᵀv/vᵀv)² · (vᵀv)      =  (uᵀv)²/(vᵀv)

so           uᵀu − 2(uᵀv)²/(vᵀv) + (uᵀv)²/(vᵀv) ≥ 0
             uᵀu −  (uᵀv)²/(vᵀv)                ≥ 0

multiply by vᵀv, which is positive so the ≥ does not flip:

             (uᵀu)(vᵀv) ≥ (uᵀv)²

take square roots:      ‖u‖‖v‖ ≥ |uᵀv|        ∎`}
      </Worked>

      <Para>
        Two remarks the deck makes, both worth carrying into an exam. First, the proof used only bilinearity, symmetry
        and ⟨w, w⟩ ≥ 0 — never anything specific to the dot product — so it holds for <em>every</em> inner product.
        Second, equality happens exactly when u − αv is the zero vector, that is when u and v lie along the same line.
      </Para>

      <Terms
        items={[
          {
            term: 'α',
            say: 'alpha',
            def: 'A scalar introduced purely as a tool for the proof. It does not appear in the statement being proved.',
          },
          {
            term: '|⟨x, y⟩|',
            def: 'Absolute value of the inner product — its size, ignoring sign. The inequality bounds how big it can get in either direction.',
          },
          {
            term: '≥',
            say: 'greater than or equal to',
            def: 'Note the "or equal": the equality case is a real case, and it is exactly when the two vectors are parallel.',
          },
          {
            term: '∎',
            say: 'end of proof',
            def: 'The tombstone symbol, marking where an argument finishes. Some books write QED instead.',
          },
        ]}
      />

      <WhyAiml method="cosine similarity · correlation coefficients · attention weights">
        <p className="mb-2">
          Every bounded similarity score in machine learning traces back to this inequality.{' '}
          <strong>Cosine similarity</strong>, the standard way to compare two embeddings, is ⟨x, y⟩/(‖x‖‖y‖) — and the
          only reason it is guaranteed to sit in [−1, 1] is Cauchy–Schwarz. Without it, a similarity of 4.7 would be
          possible and the number would mean nothing.
        </p>
        <p>
          The same bound is why the <strong>correlation coefficient</strong> lies in [−1, 1]: correlation is a cosine
          between two centred data vectors. And it is why attention scores are divided by √d before the softmax — the
          bound grows with dimension, so the scaling keeps the numbers in a sane range.
        </p>
      </WhyAiml>

      <Takeaway>
        |⟨x, y⟩| ≤ ‖x‖‖y‖. The proof: ‖u − αv‖² ≥ 0 for every α, so put in the α that minimises it. Equality only when
        the two are parallel.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  metric: (
    <>
      <Para>
        Length measures one vector. <strong>Distance</strong> measures the gap between two, and it is defined in the
        obvious way — the length of the difference:
      </Para>
      <Formula>d(x, y) = ‖x − y‖ = √⟨x − y, x − y⟩</Formula>
      <Para>
        When the inner product is the plain dot product, this is the <strong>Euclidean distance</strong> you already
        know. The mapping d : V × V → ℝ is called a <strong>metric</strong>, and slide 10 lists the three things it
        always satisfies.
      </Para>
      <List
        items={[
          <>
            <strong>Positive definite.</strong> d(x, y) ≥ 0, and d(x, y) = 0 only when x = y. Nothing is a negative
            distance away, and only a point is zero distance from itself.
          </>,
          <>
            <strong>Symmetric.</strong> d(x, y) = d(y, x). The trip there is as long as the trip back.
          </>,
          <>
            <strong>Triangle inequality.</strong> d(x, z) ≤ d(x, y) + d(y, z). Going via a third point never helps.
          </>,
        ]}
      />

      <Lab>
        <MetricLab />
      </Lab>

      <Para>
        Now the remark slide 10 ends on, which catches people out badly. Inner products and metrics look similar — both
        take two vectors and give a number, both are symmetric, both have a positive-definiteness condition. But they
        run in <strong>opposite directions</strong>:
      </Para>
      <List
        items={[
          <>
            When x and y are close together, the <strong>distance</strong> is small and the{' '}
            <strong>inner product</strong> is large.
          </>,
          <>
            When x and y are far apart, the <strong>distance</strong> is large and the <strong>inner product</strong> is
            small.
          </>,
        ]}
      />
      <Para>
        So a big inner product means similar, and a big distance means different. Drag the points together in the lab
        and watch the two read-outs move opposite ways.
      </Para>

      <Beyond>
        There is a formula linking them exactly, and it makes the opposition obvious: ‖x − y‖² = ‖x‖² − 2⟨x, y⟩ + ‖y‖².
        The inner product enters with a minus sign. If x and y have fixed lengths, then maximising ⟨x, y⟩ is precisely
        the same as minimising the distance — which is why some algorithms use one and some the other, and why they
        often agree.
      </Beyond>

      <Terms
        items={[
          { term: 'd(x, y)', say: 'the distance from x to y', def: 'The length of the vector x − y.' },
          {
            term: 'metric',
            def: 'Any distance function obeying the three properties above. "Metric space" means a set with such a function.',
          },
          {
            term: 'Euclidean distance',
            def: 'The distance you get when the inner product is the ordinary dot product. Straight-line distance.',
          },
          {
            term: 'x − y',
            def: 'The vector pointing from y to x. Its length is the gap between them, which is why distance is defined this way.',
          },
        ]}
      />

      <WhyAiml method="k-means · k-nearest neighbours · t-SNE · triplet loss">
        <p className="mb-2">
          A very large share of machine learning is distance in disguise. <strong>k-means</strong> assigns each point to
          the nearest centre and is defined entirely by a metric. <strong>k-NN</strong> classifies by asking which
          training points are closest. <strong>t-SNE</strong> and UMAP place points on a page so the distances look like
          the distances in the original space.
        </p>
        <p>
          The triangle inequality is not decoration here — it is what makes these algorithms <em>fast</em>. Structures
          like ball trees and KD-trees prune whole regions of the search using nothing but the triangle inequality: if
          the nearest thing in a region is already further than your current best, you skip the region entirely. Break
          that property and the pruning becomes unsound.
        </p>
      </WhyAiml>

      <Takeaway>
        d(x, y) = ‖x − y‖. It is never negative, it is symmetric, and detours never shorten it. Distance small means
        similar; inner product small means <em>unrelated</em> — they point opposite ways.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  angles: (
    <>
      <Para>
        The third measurement, and the one that needed Cauchy–Schwarz to be legal. Take two non-zero vectors and form
        this ratio:
      </Para>
      <Formula>xᵀy / (‖x‖·‖y‖)</Formula>
      <Para>
        Cauchy–Schwarz says |xᵀy| ≤ ‖x‖‖y‖. Divide both sides by ‖x‖‖y‖, which is positive, and you get exactly what
        slide 11 prints:
      </Para>
      <Formula>−1 ≤ xᵀy / (‖x‖·‖y‖) ≤ 1</Formula>
      <Para>
        Now, the cosine function takes every value in [−1, 1] exactly once as its input runs over [0, π]. So there is
        one and only one angle ω in that range whose cosine is our ratio. We simply <em>define</em> the angle to be it:
      </Para>
      <Formula>cos(ω) = ⟨x, y⟩ / (‖x‖·‖y‖)</Formula>
      <Para>
        This is worth being clear about, because it is a common misunderstanding. The angle is not something that was
        already there and has now been measured — it is <em>defined</em> by this equation. Cauchy–Schwarz is what
        guarantees the definition makes sense, by keeping the ratio inside the range where cos⁻¹ is available.
      </Para>

      <Lab>
        <AngleLab />
      </Lab>

      <Para>What the angle actually tells you:</Para>
      <List
        items={[
          <>
            ω near <strong>0</strong> — cosine near 1 — the two point much the same way.
          </>,
          <>
            ω near <strong>π/2</strong> (90°) — cosine near 0 — they are unrelated in direction.
          </>,
          <>
            ω near <strong>π</strong> (180°) — cosine near −1 — they point opposite ways.
          </>,
        ]}
      />
      <Para>
        The deck puts it as: the angle captures <strong>similarity of orientation</strong>. Note what it ignores —
        length. Doubling x leaves ω completely unchanged, because the extra factor of 2 appears in the top and in ‖x‖ on
        the bottom, and cancels.
      </Para>

      <Terms
        items={[
          {
            term: 'ω',
            say: 'omega (lower case)',
            def: 'The angle between two vectors, measured in radians and always taken in [0, π].',
          },
          {
            term: 'π',
            say: 'pi',
            def: 'Half a turn: π radians = 180°. So π/2 is a right angle.',
          },
          {
            term: 'radians',
            def: 'The natural unit for angles. π radians = 180°, so 1 radian ≈ 57.3°. Multiply by 180/π to convert.',
          },
          {
            term: 'cos⁻¹',
            say: 'arc-cosine, or inverse cosine',
            def: 'Undoes cosine. Give it a number in [−1, 1] and it returns the angle in [0, π] with that cosine. Also written arccos.',
          },
          {
            term: '[0, π]',
            def: 'Square brackets mean the endpoints are included. So ω may be exactly 0 or exactly π.',
          },
        ]}
      />

      <WhyAiml method="word embeddings · retrieval · recommender systems · RAG">
        <p className="mb-2">
          Cosine similarity is this formula, unchanged, and it is the standard way to compare two embeddings anywhere in
          modern machine learning. When a search system finds documents matching your query, when a recommender finds
          users like you, when a RAG pipeline retrieves relevant chunks — each is computing cos ω between vectors and
          returning the largest.
        </p>
        <p>
          The reason angle is preferred over distance here is exactly the property noted above: it ignores length. A
          long document and a short one about the same subject have embeddings pointing the same way but with very
          different magnitudes. Euclidean distance would call them dissimilar; the angle correctly calls them close.
        </p>
      </WhyAiml>

      <Takeaway>
        cos ω = ⟨x, y⟩/(‖x‖‖y‖), with ω in [0, π]. Cauchy–Schwarz is what keeps the ratio in [−1, 1] so the definition
        is legal. The angle sees direction only, never length.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  highdim: (
    <>
      <Para>
        Slide 13 is a “food for thought” slide. It asks a question, tells you how to set up the experiment, and then
        says <em>write a small program to see what happens</em>. It gives no answer, so here is the program, running on
        this page.
      </Para>
      <Para>
        The question: pick two vectors uniformly at random in n dimensions. What is the angle between them? The deck’s
        recipe for “uniformly at random over a sphere” is to make every component an independent Gaussian with mean 0
        and variance 1 — that gives a direction with no preferred orientation.
      </Para>

      <Lab>
        <HighDimLab />
      </Lab>

      <Para>
        Start at n = 2 and push the dial up. In two dimensions the angle is spread across the whole range — any
        orientation is as likely as any other. By n = 50 the histogram has bunched around cos ω = 0. By n = 200 almost
        every pair is within a few degrees of a right angle.
      </Para>
      <Para>
        This is real, and it has a name: <strong>concentration of measure</strong>. Two random directions in high
        dimensions are almost always nearly orthogonal. The spread of cos ω shrinks like 1/√n — the lab prints both
        numbers so you can watch them track each other.
      </Para>

      <Beyond>
        Why 1/√n, roughly. The top of the ratio is Σᵢ xᵢyᵢ, a sum of n independent terms each with mean 0 and variance
        1, so it grows like √n. The bottom is ‖x‖‖y‖, and each length concentrates near √n, so the bottom grows like n.
        The ratio therefore behaves like √n / n = 1/√n. The exact standard deviation is 1/√n; compare it with the
        measured spread in the lab.
      </Beyond>

      <Terms
        items={[
          {
            term: 'uniformly at random',
            def: 'Every direction equally likely. Picking each component from an independent standard Gaussian achieves this, because the Gaussian has no preferred direction.',
          },
          {
            term: 'Gaussian',
            say: 'GOW-see-an',
            def: 'The bell curve, also called the normal distribution. "Mean 0, unit variance" means centred at zero with spread 1.',
          },
          {
            term: 'concentration of measure',
            def: 'The general phenomenon that in high dimensions, random quantities cluster very tightly around their average.',
          },
          {
            term: 'curse of dimensionality',
            def: 'The umbrella name for the ways high-dimensional space behaves unlike the 2-D and 3-D pictures we reason with.',
          },
        ]}
      />

      <WhyAiml method="embedding capacity · random projections · why high dimensions work">
        <p className="mb-2">
          This has a direct and cheerful consequence. Because random directions are nearly orthogonal, a space of
          dimension n can hold <em>far</em> more than n nearly-orthogonal vectors — exponentially many. That is why an
          embedding of size 768 can keep tens of thousands of distinct concepts apart without them interfering: they do
          not need to be exactly orthogonal, only nearly so, and nearly-orthogonal directions are abundant.
        </p>
        <p>
          The same fact underwrites <strong>random projections</strong> and the Johnson–Lindenstrauss lemma: you can
          squash high-dimensional data into far fewer dimensions with a random matrix and barely disturb the distances.
          It also warns you about nearest-neighbour search — when everything is roughly equidistant from everything
          else, “nearest” starts to lose its meaning, and that is the unhappy side of the same coin.
        </p>
      </WhyAiml>

      <Takeaway>
        Two random vectors in high dimensions are nearly always almost orthogonal, with the spread of cos ω shrinking
        like 1/√n. Your 2-D intuition does not transfer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  orthogonality: (
    <>
      <Para>
        Of all the angles, one matters far more than the rest. Two vectors are <strong>orthogonal</strong> when their
        inner product is zero:
      </Para>
      <Formula>x ⊥ y  ⟺  ⟨x, y⟩ = 0</Formula>
      <Para>
        “Orthogonal” is the general word for “at right angles”. The symbol ⊥ is read “perp” or “is perpendicular to”.
        Note that this is a definition in terms of the inner product being zero — you never have to work out the angle
        to check it, which is the whole practical value.
      </Para>
      <Para>Two consequences the deck spells out, and the second is the important one:</Para>
      <List
        items={[
          <>
            The <strong>zero vector is orthogonal to everything</strong>, including itself, since ⟨0, y⟩ = 0 always. It
            is a degenerate case, but it follows from the definition and the definition is what counts.
          </>,
          <>
            Vectors orthogonal with respect to <em>one</em> inner product need <strong>not</strong> be orthogonal with
            respect to another. Being at right angles is not a property of the two vectors alone.
          </>,
        ]}
      />
      <Para>
        That second point deserves a moment. In everyday geometry, “perpendicular” feels like a fact about two arrows
        that you could check with a set square. It is not. It is a fact about two arrows{' '}
        <em>and the inner product you chose</em>. Change the inner product and right angles move.
      </Para>

      <Lab>
        <AngleLab />
      </Lab>

      <Para>
        Set the arrows so that ⊥ appears, then switch A at the top without touching them. The verdict changes while the
        picture does not.
      </Para>

      <Terms
        items={[
          {
            term: '⊥',
            say: 'perp, or is perpendicular to',
            def: 'Orthogonality. "x ⊥ y" means the inner product of x and y is zero.',
          },
          {
            term: 'orthogonal',
            say: 'or-THOG-on-al',
            def: 'At right angles, in the sense of the chosen inner product. The general word — "perpendicular" tends to be reserved for the ordinary two- and three-dimensional case.',
          },
          {
            term: 'orthonormal',
            def: 'Orthogonal AND each of length 1. The extra "normal" refers to normalising to unit length, not to anything about normal distributions.',
          },
        ]}
      />

      <WhyAiml method="PCA · orthogonal initialisation · decorrelated features">
        <p className="mb-2">
          Orthogonal means <em>carrying no shared information</em>, and that is why so much of machine learning works to
          produce it. <strong>PCA</strong> finds orthogonal directions precisely so each component says something the
          others do not; correlated features are redundant, and orthogonal ones are not.
        </p>
        <p>
          The dependence on which inner product you chose is not a technicality either. Under the plain dot product two
          features can look independent, while under the Mahalanobis inner product built from the data’s own covariance
          they are strongly related — and it is the second one that tells you what you want to know. Choosing the inner
          product <em>is</em> choosing what “unrelated” means.
        </p>
      </WhyAiml>

      <Takeaway>
        x ⊥ y means ⟨x, y⟩ = 0 — no angle needs working out. The zero vector is orthogonal to everything, and
        orthogonality depends on which inner product you picked.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  angleexample: (
    <>
      <Para>
        Slides 15 and 16 make the previous point with numbers, and it is the clearest example in the deck. Two vectors:
      </Para>
      <Formula>x = [1, 1]ᵀ      y = [−1, 1]ᵀ</Formula>
      <Para>
        Under the ordinary dot product they are at right angles: ⟨x, y⟩ = (1)(−1) + (1)(1) = −1 + 1 = 0. Draw them and
        you can see it — one points up-right, the other up-left, exactly 90° apart.
      </Para>
      <Para>Now measure them with a different inner product, the one built from</Para>
      <Formula>
        A = [ 2  0 ]
        <br />
             [ 0  1 ]
      </Formula>
      <Para>
        so that ⟨x, y⟩ = xᵀAy = 2x₁y₁ + x₂y₂. This A is symmetric and positive definite, so it is a legitimate inner
        product — it just counts the first coordinate twice as heavily.
      </Para>

      <Lab>
        <DeckAngleLab />
      </Lab>

      <Worked title="Slide 16, worked line by line">
        {`x = (1, 1)      y = (−1, 1)      A = [ 2  0 ]
                                          [ 0  1 ]

top of the fraction
    xᵀAy = 2x₁y₁ + x₂y₂
         = 2(1)(−1) + (1)(1)
         = −2 + 1
         = −1

the two lengths
    xᵀAx = 2x₁² + x₂² = 2(1)² + (1)² = 2 + 1 = 3
    yᵀAy = 2y₁² + y₂² = 2(−1)² + (1)² = 2 + 1 = 3

put it together
                xᵀAy              −1        −1     1
    cos ω = ───────────────  =  ──────  =  ────  = − ─
            √(xᵀAx)·√(yᵀAy)     √3·√3       3       3

    ω = cos⁻¹(−1/3) ≈ 109.5°

so under THIS inner product the two vectors are
NOT orthogonal — even though nothing about them moved.`}
      </Worked>

      <Para>
        The lab computes all of this from the vectors and the matrix, using the same code every other lab on this page
        uses. The −1/3 is calculated, not typed in, and it agrees with slide 16.
      </Para>

      <Beyond>
        A good way to picture what A did. The inner product xᵀAy with A = diag(2, 1) is the ordinary dot product applied
        <em> after</em> stretching the horizontal axis by √2. Stretching a plane does not preserve angles, so two arrows
        that started at 90° need not stay there. The faint ring in the lab is that stretch made visible: a circle under
        the dot product, an ellipse under A.
      </Beyond>

      <Terms
        items={[
          {
            term: '[1, 1]ᵀ',
            say: 'one one, transposed',
            def: 'A column vector written sideways to save space. The ᵀ turns the row into a column.',
          },
          {
            term: 'diagonal matrix',
            def: 'Zeros everywhere except the main diagonal. A diagonal inner-product matrix weights each coordinate separately without mixing them.',
          },
        ]}
      />

      <WhyAiml method="feature scaling · Mahalanobis distance · why you standardise data">
        <p className="mb-2">
          This example is exactly what happens when you change the units of a feature. Measure height in centimetres
          rather than metres and you have multiplied one coordinate by 100 — which is the same as choosing a different A
          — and every angle and distance in your dataset changes. Points that were near each other may no longer be.
        </p>
        <p>
          That is why <strong>standardising features</strong> is not an optional tidy-up before running k-means, k-NN or
          an SVM. Those algorithms are defined in terms of distances and angles, and this page shows that distances and
          angles depend on the inner product. Failing to standardise means silently choosing an A determined by your
          units — and units are not a modelling decision anyone intends to make.
        </p>
      </WhyAiml>

      <Takeaway>
        x = (1,1) and y = (−1,1) are orthogonal under the dot product and at cos⁻¹(−1/3) ≈ 109.5° under xᵀAy with A =
        diag(2, 1). Same arrows, different ruler, different answer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  orthomatrix: (
    <>
      <Para>
        Now from vectors to matrices. A square matrix A is called an <strong>orthogonal matrix</strong> when its columns
        are orthonormal — mutually at right angles, and each of length 1. Written compactly:
      </Para>
      <Formula>
        AᵀA = I = AAᵀ
        <br />
        so  Aᵀ = A⁻¹
      </Formula>
      <Para>
        The naming is genuinely confusing and it is worth saying out loud: an “orthogonal matrix” requires the columns
        to be <strong>orthonormal</strong>, not merely orthogonal. A matrix with perpendicular columns of length 3 is{' '}
        <em>not</em> an orthogonal matrix. Blame history.
      </Para>
      <Para>
        Why does AᵀA = I say the columns are orthonormal? Because the (i, j) entry of AᵀA is exactly the dot product of
        column i with column j. The identity has 1s on the diagonal — each column with itself is 1, so each has length 1
        — and 0s off it — each column with a different one is 0, so they are orthogonal.
      </Para>

      <Lab>
        <RotationLab />
      </Lab>

      <Para>
        <strong>Why the rows are orthonormal too.</strong> Slide 17 asks this and the answer is a neat piece of algebra.
        AᵀA = I says Aᵀ is a <em>left</em> inverse of A. For a square matrix, if B is a left inverse and C is a right
        inverse then BA = I = AC, and so B = B(AC) = (BA)C = C — the two must be the same matrix. So Aᵀ is the inverse
        on both sides, giving AAᵀ = I, which is the same statement about rows.
      </Para>
      <Para>
        <strong>Lengths survive.</strong> Slide 18 gives it in one line, and it is a line worth being able to write out:
      </Para>
      <Formula>‖Ax‖² = (Ax)ᵀ(Ax) = xᵀAᵀAx = xᵀIx = xᵀx = ‖x‖²</Formula>
      <Para>
        <strong>Angles survive too.</strong> Slide 19: the top of cos ω becomes (Ax)ᵀ(Ay) = xᵀAᵀAy = xᵀy, and both
        lengths on the bottom are unchanged by the line above. Every part of the fraction is left alone, so the angle
        is.
      </Para>
      <Para>
        The deck’s example is the 2-D rotation matrix, and it is the right mental image — an orthogonal transformation
        is a rigid motion. It may turn the plane and it may flip it, but it never stretches, squashes or shears.
      </Para>

      <Terms
        items={[
          {
            term: 'orthogonal matrix',
            def: 'A square matrix with orthonormal columns. AᵀA = I. Its inverse is just its transpose, which is why they are so convenient.',
          },
          {
            term: 'I',
            say: 'the identity matrix',
            def: '1s down the diagonal, 0s everywhere else. Multiplying by it changes nothing.',
          },
          {
            term: 'A⁻¹',
            say: 'A inverse',
            def: 'The matrix that undoes A: AA⁻¹ = I. Usually expensive to compute — unless A is orthogonal, when it is free.',
          },
          {
            term: 'Aᵀ',
            say: 'A transpose',
            def: 'Rows and columns swapped: the (i, j) entry of Aᵀ is the (j, i) entry of A.',
          },
          {
            term: 'rotation matrix',
            def: 'In 2-D, [[cos θ, −sin θ], [sin θ, cos θ]]. Turns the plane by θ about the origin.',
          },
        ]}
      />

      <Beyond>
        There are exactly two kinds of orthogonal matrix in the plane, and det A tells them apart. det A = +1 is a
        rotation, which preserves handedness. det A = −1 is a reflection, which flips it. Both preserve every length and
        every angle — a mirror image is the same shape — which is why the deck’s length and angle arguments never needed
        to distinguish them.
      </Beyond>

      <WhyAiml method="orthogonal initialisation · rotation invariance · QR and SVD">
        <p className="mb-2">
          Preserving lengths is exactly what a deep network needs from its weights at the start of training. If each
          layer stretches its input a little, twenty layers multiply that stretch twenty times and the signal explodes
          or vanishes. <strong>Orthogonal initialisation</strong> starts the weights as an orthogonal matrix so the
          scale passes through untouched, and it is a standard trick for training very deep and recurrent models.
        </p>
        <p>
          Numerically they are the best-behaved matrices there are. Because they never amplify anything, rounding errors
          cannot grow through them — which is why serious algorithms are built from orthogonal steps: QR decomposition,
          the SVD, and Householder reflections all work this way. And Aᵀ = A⁻¹ means inverting one costs nothing at all.
        </p>
      </WhyAiml>

      <Takeaway>
        AᵀA = I means orthonormal columns, Aᵀ = A⁻¹, and every length and angle preserved. Picture a rotation: rigid
        motion, no stretching.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  orthobasis: (
    <>
      <Para>
        Lecture 2 asked only one thing of a basis: that its vectors be linearly independent and span the space. Now that
        angles exist, we can ask for more. An <strong>orthonormal basis</strong> is one where the vectors are mutually
        at right angles and each has length 1. Formally, for basis vectors b₁ … bₙ:
      </Para>
      <Formula>⟨bᵢ, bⱼ⟩ = 0 for i ≠ j      ⟨bᵢ, bᵢ⟩ = 1</Formula>
      <Para>
        Both conditions in one line. If only the first holds — mutually at right angles, but not of unit length — the
        deck calls it an <strong>orthogonal basis</strong>. Dividing each vector by its own length turns one into the
        other, which is called <strong>normalising</strong>.
      </Para>
      <Para>
        Slide 21 asks two questions. Can you think of an orthonormal basis for ℝⁿ immediately? Yes — the canonical basis
        e₁ … eₙ. Each has length 1, and any two different ones have a zero dot product since their 1s are in different
        places. Is an orthonormal basis unique? No, and not remotely: rotate one and you get another.
      </Para>

      <Lab>
        <OrthonormalBasisLab />
      </Lab>

      <Para>
        The lab shows the payoff, and it is the reason anyone wants such a basis. In a general basis, finding the
        coordinates of a vector means solving a system of equations. In an orthonormal basis it collapses to one inner
        product per coordinate:
      </Para>
      <Formula>v = ⟨v, b₁⟩b₁ + ⟨v, b₂⟩b₂ + ⋯ + ⟨v, bₙ⟩bₙ</Formula>
      <Para>
        Compare the last four read-outs in the lab. With an orthonormal basis they agree in pairs. Switch to the basis
        that is neither and they come apart badly.
      </Para>

      <Beyond>
        Why the shortcut works, in one line. Write v = Σⱼ cⱼbⱼ and take the inner product of both sides with bᵢ. By
        bilinearity, ⟨v, bᵢ⟩ = Σⱼ cⱼ⟨bⱼ, bᵢ⟩. Every term with j ≠ i is zero by orthogonality, and the surviving term has
        ⟨bᵢ, bᵢ⟩ = 1. So ⟨v, bᵢ⟩ = cᵢ. The whole sum collapses to the one coefficient you wanted.
      </Beyond>

      <Terms
        items={[
          {
            term: 'orthonormal basis',
            def: 'A basis whose vectors are mutually orthogonal and each of length 1.',
          },
          {
            term: 'orthogonal basis',
            def: 'Mutually orthogonal, but lengths not necessarily 1. One normalisation away from orthonormal.',
          },
          {
            term: 'normalising',
            def: 'Dividing a vector by its own length so the result has length 1. Written b/‖b‖, sometimes called a unit vector.',
          },
          {
            term: 'i ≠ j',
            say: 'i not equal to j',
            def: 'Names two different basis vectors. The i = j case is the separate, second condition.',
          },
          {
            term: 'canonical basis',
            def: 'The standard one: e₁ = (1,0,…,0), e₂ = (0,1,0,…,0), and so on. Always orthonormal under the dot product.',
          },
        ]}
      />

      <WhyAiml method="PCA components · Fourier and wavelet bases · whitening">
        <p className="mb-2">
          <strong>PCA</strong> hands you an orthonormal basis and that is precisely what makes it useful. Because the
          components are orthonormal, the amount of each one in a data point is a single dot product, projecting onto
          the top k is just keeping the first k of those numbers, and reconstructing is a sum — no system to solve
          anywhere. The variance also splits cleanly across components, which is why “this component explains 40% of the
          variance” is a meaningful sentence.
        </p>
        <p>
          The same structure underlies the Fourier and wavelet bases used in signal and image processing, and JPEG
          compression is exactly this: change to a better orthonormal basis, notice most coefficients are tiny, and
          throw them away.
        </p>
      </WhyAiml>

      <Takeaway>
        Orthonormal = mutually orthogonal AND unit length. Its payoff is that coordinates become single inner products
        instead of a system of equations. Not unique — rotate one and you get another.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  gramschmidt: (
    <>
      <Para>
        So orthonormal bases are worth having. The obvious question follows: given some ordinary basis, can you convert
        it into an orthonormal one? Yes — and the deck does it in an unusual way, with Gaussian elimination.
      </Para>
      <Para>
        The recipe, from slide 22. Put your basis vectors in as the <strong>columns</strong> of a matrix A. Then form
        this augmented matrix and row-reduce it:
      </Para>
      <Formula>[ AᵀA | Aᵀ ]</Formula>
      <Para>
        Run <strong>forward elimination only</strong> — clear each column below its pivot, and stop. When the left half
        has reached upper-triangular form with 1s on the diagonal, the{' '}
        <strong>rows of the right half are orthogonal</strong>. Normalise them and you have an orthonormal basis.
      </Para>
      <Para>
        The words “forward only” are doing real work there, and it is the easiest way to get this wrong. Look at slide
        22’s answer: the top row still ends in 0.8, so the left half is <em>not</em> the identity. If you carry on and
        clear that 0.8 as well — ordinary Gauss–Jordan — the first output row changes from (0.3, 0.1) to (0.5, −0.5),
        and its inner product with the second row becomes −0.5 instead of 0. The orthogonality is destroyed.
      </Para>
      <Para>
        The reason is the one part 20 proves. The elimination is applying L⁻¹, which is <strong>lower</strong>{' '}
        triangular — it only ever clears below a pivot. Clearing above would apply an upper-triangular operator too, and
        the argument no longer works.
      </Para>
      <Para>The deck runs it on v₁ = (3, 1)ᵀ and v₂ = (2, 2)ᵀ. Step through exactly that below.</Para>

      <Lab>
        <GramSchmidtLab />
      </Lab>

      <Worked title="Slide 22, in full">
        {`v₁ = (3, 1)ᵀ    v₂ = (2, 2)ᵀ        A = [ 3  2 ]
                                            [ 1  2 ]

AᵀA = [ 3  1 ] [ 3  2 ]  =  [ 10   8 ]
      [ 2  2 ] [ 1  2 ]     [  8   8 ]

Aᵀ  = [ 3  1 ]
      [ 2  2 ]

augmented, [ AᵀA | Aᵀ ]

    [ 10   8 |  3   1 ]
    [  8   8 |  2   2 ]

divide row 1 by 10

    [  1  0.8 | 0.3  0.1 ]
    [  8   8  |  2    2  ]

row 2 − 8 × row 1

    [  1  0.8 |  0.3   0.1 ]
    [  0  1.6 | −0.4   1.2 ]

divide row 2 by 1.6

    [  1  0.8 |  0.3   0.1 ]        ← exactly the slide
    [  0   1  | −0.25  0.75]

STOP HERE. Do NOT clear the 0.8.
    carrying on to the identity would give
        [ 1  0 |  0.5  −0.5 ]
        [ 0  1 | −0.25  0.75]
    and (0.5, −0.5)·(−0.25, 0.75) = −0.125 − 0.375 = −0.5
    which is NOT zero. the orthogonality would be lost.

CHECK the two right-hand rows are orthogonal:
    (0.3, 0.1) · (−0.25, 0.75)
        = 0.3(−0.25) + 0.1(0.75)
        = −0.075 + 0.075
        = 0                          ✓ exactly zero

as fractions: (3/10, 1/10) and (−1/4, 3/4),
    3/10 · −1/4 + 1/10 · 3/4 = −3/40 + 3/40 = 0

NORMALISE
    ‖(3/10, 1/10)‖ = √(9/100 + 1/100) = √(1/10)
        u₁ = (3/√10, 1/√10) ≈ (0.9487, 0.3162)

    ‖(−1/4, 3/4)‖  = √(1/16 + 9/16) = √(10/16)
        u₂ = (−1/√10, 3/√10) ≈ (−0.3162, 0.9487)

    and u₁ · u₂ = −3/10 + 3/10 = 0            ✓`}
      </Worked>

      <Para>
        Notice u₁ is just v₁ pointing the same way, scaled to length 1 — (3, 1)/√10. That is the signature of
        Gram–Schmidt: the first vector is kept as it is, and every later one has the part along the earlier ones
        stripped out.
      </Para>
      <Para>
        <strong>Why does this work?</strong> Slide 23 gives the first half of the reason. When A has full column rank —
        that is, when its columns really are independent — the matrix AᵀA is positive definite. The argument: if Ax = 0
        had only x = 0 as a solution, then for x ≠ 0, xᵀAᵀAx = (Ax)ᵀ(Ax) = ‖Ax‖² {'>'} 0. Since AᵀA is positive
        definite, elimination can be carried out without ever needing a row exchange. The rest of the reason takes three
        more parts, and it is the last thing this lecture does.
      </Para>

      <Terms
        items={[
          {
            term: 'Gram–Schmidt',
            say: 'gram-SHMIT',
            def: 'The process of turning any basis into an orthogonal one. Named after Jørgen Gram and Erhard Schmidt.',
          },
          {
            term: 'augmented matrix',
            def: 'Two matrices written side by side with a bar between, so one set of row operations acts on both at once.',
          },
          {
            term: 'AᵀA',
            say: 'A transpose A',
            def: 'Always square and symmetric, whatever shape A has. Its (i, j) entry is the dot product of column i and column j of A — which is why it captures all the angle information.',
          },
          {
            term: 'full column rank',
            def: 'Every column is a pivot column — the columns are linearly independent. Needed here, or AᵀA is singular and nothing works.',
          },
          {
            term: 'row exchange',
            def: 'Swapping two rows during elimination. Positive definiteness is what guarantees it is never needed here, which matters for the LU argument later.',
          },
        ]}
      />

      <WhyAiml method="QR decomposition · least squares · numerical stability">
        <p className="mb-2">
          This is the <strong>QR decomposition</strong>, which is how least squares is actually solved in practice.
          Textbooks present the normal equations AᵀAx = Aᵀb, but nobody solves them that way, because forming AᵀA
          squares the condition number and can destroy the accuracy of the answer. Instead you build an orthonormal
          basis for the columns of A — this process — and solve a triangular system.
        </p>
        <p>
          Every serious library does it this way: <span className="font-mono">numpy.linalg.lstsq</span>,{' '}
          <span className="font-mono">scipy</span>, R’s <span className="font-mono">lm()</span>. When you fit a linear
          regression, this page is what runs.
        </p>
      </WhyAiml>

      <Takeaway>
        Forward-eliminate [AᵀA | Aᵀ] — below the pivots only, never above — and the right half’s rows come out
        orthogonal. Normalise them for an orthonormal basis. On the deck’s numbers the result is (3/√10, 1/√10) and
        (−1/√10, 3/√10).
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  elementary: (
    <>
      <Para>
        The last three parts prove that the Gram–Schmidt method really does what it claims. The proof needs one idea
        first: a row operation is itself a matrix.
      </Para>
      <Para>
        Take “subtract 2 times row 1 from row 2”. That feels like a procedure you carry out by hand. But there is a
        matrix that does it for you — take the identity and put the multiplier in one position below the diagonal:
      </Para>
      <Formula>
        E = [ 1   0  0 ]
        <br />
             [ −2  1  0 ]
        <br />
             [ 0   0  1 ]
      </Formula>
      <Para>
        Multiply on the left, EA, and row 2 of the answer is row 2 of A minus twice row 1, with every other row
        untouched. Such a matrix is called an <strong>elementary matrix</strong>.
      </Para>

      <Lab>
        <ElementaryMatrixLab />
      </Lab>

      <Para>Three facts about elementary matrices, all of which the argument uses:</Para>
      <List
        items={[
          <>
            <strong>Multiplying on the left acts on rows.</strong> EA does a row operation. (Multiplying on the right,
            AE, would act on columns — a different thing entirely.)
          </>,
          <>
            <strong>They are lower triangular</strong>, provided the extra entry sits below the diagonal — which it
            does, because elimination always subtracts an earlier row from a later one.
          </>,
          <>
            <strong>They are always invertible</strong>, with det E = 1. The inverse is the same matrix with the
            multiplier negated: to undo “subtract 2 times row 1”, add 2 times row 1.
          </>,
        ]}
      />

      <Worked title="Slide 25, multiplied out">
        {`E =  [  1  0  0 ]        A = [ a₁₁  a₁₂  a₁₃ ]
     [ −2  1  0 ]            [ a₂₁  a₂₂  a₂₃ ]
     [  0  0  1 ]            [ a₃₁  a₃₂  a₃₃ ]

EA — take each row of E against each column of A

row 1 of E is (1, 0, 0)
    → 1·(row 1 of A) = ( a₁₁ ,  a₁₂ ,  a₁₃ )        unchanged

row 2 of E is (−2, 1, 0)
    → −2·(row 1) + 1·(row 2)
    = ( a₂₁ − 2a₁₁ ,  a₂₂ − 2a₁₂ ,  a₂₃ − 2a₁₃ )    the operation

row 3 of E is (0, 0, 1)
    → 1·(row 3 of A) = ( a₃₁ ,  a₃₂ ,  a₃₃ )        unchanged

so       EA = [ a₁₁        a₁₂        a₁₃       ]
              [ a₂₁ − 2a₁₁  a₂₂ − 2a₁₂  a₂₃ − 2a₁₃ ]
              [ a₃₁        a₃₂        a₃₃       ]

exactly "subtract two times row 1 from row 2".`}
      </Worked>

      <Terms
        items={[
          {
            term: 'elementary matrix',
            def: 'An identity matrix with one extra non-zero entry off the diagonal. Multiplying by it performs one row operation.',
          },
          {
            term: 'lower triangular',
            def: 'Every entry above the main diagonal is zero. Upper triangular is the other way round.',
          },
          {
            term: 'pre-multiplication',
            def: 'Multiplying on the left, as in EA. This is what acts on rows; post-multiplication AE acts on columns.',
          },
          {
            term: 'det E',
            def: 'The determinant of an elementary matrix of this kind is 1, so it never changes the determinant of what it multiplies.',
          },
        ]}
      />

      <WhyAiml method="how linear algebra libraries actually work">
        <p className="mb-2">
          This is the idea that lets a computer do linear algebra quickly. Because every elimination step is a matrix, a
          whole sequence of steps is a single product, and a product can be rearranged, factored and reused. That is why
          solving Ax = b for fifty different b vectors does not cost fifty full eliminations — you factor A once and
          reuse the factors.
        </p>
        <p>
          Every framework you use for machine learning sits on LAPACK and BLAS, and those libraries are built out of
          exactly this. When PyTorch inverts a matrix or solves a linear system, elementary transformations are what run
          underneath.
        </p>
      </WhyAiml>

      <Takeaway>
        Every row operation is a matrix: the identity with one extra entry. Pre-multiplying does the operation. They are
        lower triangular and always invertible.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  lu: (
    <>
      <Para>
        Now stack them up. If Gaussian elimination takes m steps, and each step is an elementary matrix, then the whole
        elimination is one product:
      </Para>
      <Formula>Eₘ Eₘ₋₁ ⋯ E₂ E₁ A = U</Formula>
      <Para>
        where U is the upper-triangular staircase you end up with. Slide 26 now uses two facts, and both are worth
        knowing separately:
      </Para>
      <List
        items={[
          <>
            The <strong>product</strong> of lower-triangular matrices is lower triangular.
          </>,
          <>
            The <strong>inverse</strong> of a lower-triangular matrix is lower triangular.
          </>,
        ]}
      />
      <Para>
        So that whole product of Es is one lower-triangular matrix. For notational convenience the deck names it{' '}
        <span className="font-mono">L⁻¹</span> rather than L — the inverse of a lower-triangular matrix being lower
        triangular is exactly what makes that legal. Then:
      </Para>
      <Formula>
        L⁻¹A = U
        <br />
        so  A = LU
      </Formula>
      <Para>
        This is the <strong>LU decomposition</strong>: any matrix that can be eliminated without row swaps splits into a
        lower-triangular L times an upper-triangular U. And L is free — it is nothing but the multipliers you used along
        the way, collected up.
      </Para>

      <Lab>
        <LuLab />
      </Lab>

      <Para>
        The lab computes L and U by running plain elimination and recording the multipliers, then multiplies them back
        together to check the answer really is A. Move the dial to a value where a pivot hits zero and the factorisation
        disappears — which is exactly the case where a row swap would be needed.
      </Para>

      <Beyond>
        That is why slide 23’s remark about row exchanges mattered. In general one has to write PA = LU, with a
        permutation matrix P recording the swaps, and P is <em>not</em> triangular — so the tidy argument breaks. But
        AᵀA is positive definite, and positive-definite matrices never need a row exchange during elimination. That is
        the loose end being tied.
      </Beyond>

      <Terms
        items={[
          {
            term: 'LU decomposition',
            def: 'Writing A as a lower-triangular matrix times an upper-triangular one.',
          },
          {
            term: 'U',
            def: 'The upper-triangular result of elimination — the staircase form, before any back-substitution.',
          },
          {
            term: 'L',
            def: 'Lower triangular, with 1s on the diagonal, holding the multipliers used during elimination.',
          },
          {
            term: 'permutation matrix',
            def: 'An identity matrix with its rows reordered. Multiplying by one swaps rows. Written P, and needed when a pivot comes out zero.',
          },
        ]}
      />

      <WhyAiml method="solving many systems · determinants · Cholesky">
        <p className="mb-2">
          LU is how a computer solves Ax = b, and the reason is reuse. Factor A once, at cost about n³/3, and every
          later b costs only n² — two triangular solves. In machine learning that is the difference between a Gaussian
          process being usable and not, since it solves systems with the same kernel matrix again and again.
        </p>
        <p>
          Determinants come free too: det A = det L · det U, and the determinant of a triangular matrix is just the
          product of its diagonal. For symmetric positive-definite matrices there is a specialised version,{' '}
          <strong>Cholesky</strong>, which writes A = LLᵀ at half the cost — and that is what actually runs inside
          Gaussian process regression and multivariate normal sampling.
        </p>
      </WhyAiml>

      <Takeaway>
        Elimination is a product of lower-triangular elementary matrices, so it collapses to L⁻¹A = U, that is A = LU. L
        holds the multipliers and costs nothing extra.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  finalargument: (
    <>
      <Para>
        Everything is now in place to explain why the Gram–Schmidt recipe works. This is slide 27, and it is the
        cleverest page in the deck — so take it slowly.
      </Para>
      <Para>
        We are eliminating on <span className="font-mono">[ AᵀA | Aᵀ ]</span>, where A holds the basis vectors as its
        columns. From the previous part, AᵀA = LU. The elimination applies L⁻¹ to both halves, so the augmented matrix
        becomes:
      </Para>
      <Formula>[ U | L⁻¹Aᵀ ]</Formula>
      <Para>
        Call the right-hand half Qᵀ, so that <span className="font-mono">Qᵀ = L⁻¹Aᵀ</span>. The claim is that Q has
        orthogonal columns — equivalently, that Qᵀ has orthogonal rows, which is what we read off the page. Here is the
        argument:
      </Para>
      <Formula>QᵀQ = L⁻¹Aᵀ (L⁻¹Aᵀ)ᵀ = L⁻¹(AᵀA)(L⁻¹)ᵀ = L⁻¹(LU)(L⁻¹)ᵀ = U(L⁻¹)ᵀ</Formula>
      <Para>
        Now U is upper triangular, and (L⁻¹)ᵀ is the transpose of a lower-triangular matrix, so it is <em>also</em>{' '}
        upper triangular. The product of two upper-triangular matrices is upper triangular. So{' '}
        <strong>QᵀQ is upper triangular.</strong>
      </Para>
      <Para>
        But QᵀQ is also <strong>symmetric</strong> — that is true of MᵀM for any matrix M at all, since (QᵀQ)ᵀ = Qᵀ(Qᵀ)ᵀ
        = QᵀQ.
      </Para>
      <Para>And now the finish. A matrix that is both upper triangular and symmetric must be diagonal:</Para>
      <List
        items={[
          <>Upper triangular means every entry below the diagonal is 0.</>,
          <>Symmetry copies each entry below the diagonal to the matching place above it — so those are 0 too.</>,
          <>Nothing is left but the diagonal.</>,
        ]}
      />
      <Para>
        The off-diagonal entries of QᵀQ are the inner products of different columns of Q. They are all zero. So the
        columns of Q are orthogonal — which is precisely what we wanted, and normalising them gives an orthonormal
        basis.
      </Para>

      <Lab>
        <FinalArgumentLab />
      </Lab>

      <Worked title="The chain, in the order you would write it in an exam">
        {`SET-UP
    A        basis vectors as columns, full column rank
    AᵀA      symmetric, and positive definite (slide 23)
             so elimination needs no row exchanges
    AᵀA = LU                                   (slide 26)

THE ELIMINATION
    reduce  [ AᵀA | Aᵀ ]  →  [ U | L⁻¹Aᵀ ]
    write   Qᵀ = L⁻¹Aᵀ

THE KEY COMPUTATION
    QᵀQ = (L⁻¹Aᵀ)(L⁻¹Aᵀ)ᵀ
        = L⁻¹ Aᵀ A (L⁻¹)ᵀ
        = L⁻¹ (LU) (L⁻¹)ᵀ
        = U (L⁻¹)ᵀ

TWO OBSERVATIONS
    (a) U is upper triangular
        (L⁻¹)ᵀ is upper triangular   (transpose of lower)
        their product is upper triangular
    (b) QᵀQ is symmetric, since (MᵀM)ᵀ = MᵀM always

CONCLUSION
    upper triangular AND symmetric  ⟹  diagonal
    the off-diagonal entries of QᵀQ are
    the inner products of distinct columns of Q
    so those inner products are 0
    so the columns of Q are ORTHOGONAL           ∎

    normalise each column → an ORTHONORMAL basis.`}
      </Worked>

      <Beyond>
        Worth noticing what the argument never used: which vectors you started with. It needed only that they were
        independent, so that AᵀA came out positive definite. Any independent set at all goes through the same chain,
        which is why the method is completely general.
      </Beyond>

      <Terms
        items={[
          {
            term: 'Q',
            def: 'The matrix whose columns are the orthogonal vectors produced. The traditional letter, from the QR decomposition.',
          },
          {
            term: '(L⁻¹)ᵀ',
            say: 'L inverse, transposed',
            def: 'Transposing a lower-triangular matrix gives an upper-triangular one. That single fact is what makes step (a) work.',
          },
          {
            term: 'MᵀM is symmetric',
            def: 'True for every matrix M, with no conditions. Take the transpose and you get the same thing back.',
          },
          {
            term: 'diagonal matrix',
            def: 'Zeros everywhere except the main diagonal. Here it is the conclusion, not an assumption.',
          },
        ]}
      />

      <WhyAiml method="QR decomposition · why numerical linear algebra is built this way">
        <p className="mb-2">
          What has just been proved is that A = QR, the <strong>QR decomposition</strong>, with Q orthogonal and R upper
          triangular. It is the most-used factorisation in numerical computing after LU, and this is the whole reason it
          exists.
        </p>
        <p>
          For machine learning the pay-off is stability. Solving least squares through the normal equations squares the
          condition number of your data matrix, so a moderately ill-conditioned problem loses roughly twice as many
          digits of accuracy. Going through Q instead avoids forming AᵀA at all and keeps the conditioning as it was.
          When your features are correlated — which in real data they always are — this is the difference between a
          usable answer and numerical noise.
        </p>
      </WhyAiml>

      <Takeaway>
        QᵀQ = U(L⁻¹)ᵀ is upper triangular, and MᵀM is always symmetric. Both at once forces diagonal, so distinct
        columns of Q have zero inner product — they are orthogonal. That is the proof.
      </Takeaway>
    </>
  ),
}
