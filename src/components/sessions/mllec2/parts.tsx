/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { BasisLab, DimensionLab, FindBasisLab, SpanLab } from '@/components/charts/mllec2-basis-lab'
import {
  CoordsLab,
  EliminationRouteLab,
  FourXLab,
  IndependenceLab,
  PivotLab,
  ReachLab,
  ShapeLab,
} from '@/components/charts/mllec2-indep-lab'
import {
  AxiomLab,
  GroupLab,
  NullspaceLab,
  SolutionSetLab,
  SubspaceLab,
  VectorKindLab,
} from '@/components/charts/mllec2-space-lab'
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

/** Where the deck is loose or has a typo. Saying so beats quietly fixing it. */
function DeckNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-amber-600/30 bg-amber-50/70 px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-amber-800 uppercase">
        About the slide itself
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-800">{children}</div>
    </div>
  )
}

export const MLLEC2_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  why: (
    <>
      <Para>
        The deck opens with one sentence of intent: it would like to shift focus from systems of linear equations and
        their solutions, to <strong>vector spaces</strong>. It then says vector spaces are “structured spaces in which
        vectors live”, and asks what we mean by structure.
      </Para>
      <Para>
        That is worth slowing down on, because it sounds like a change of topic and it is really a change of{' '}
        <em>question</em>. Up to now the question was: which x makes Ax = b true? From here the question is: what does
        the whole <strong>set</strong> of answers look like, taken as one object?
      </Para>
      <Para>
        Here is why that matters to a machine learning course. Training a model does not produce one number, it produces
        a whole vector of weights, and you spend the entire course doing arithmetic on those vectors — adding a gradient
        step, averaging two models, scaling a weight down. If the set of legal weights is not closed under that
        arithmetic, the arithmetic can produce something that is not a model at all. Structure is the promise that it
        cannot.
      </Para>
      <Para>
        Watch what happens to a solution set as the right-hand side moves. There is one equation, w₁ + 2w₂ = b, so the
        answers form a line. Drag the two arrows along it and look at their sum.
      </Para>

      <Lab>
        <SolutionSetLab />
      </Lab>

      <Para>
        The sum falls off the line for every b except one. The reason is a single line of algebra, and it is worth
        writing out because the whole lecture leans on it:
      </Para>
      <Worked title="Why b has to be zero">
        {`u satisfies the equation:            u₁ + 2u₂ = b
v satisfies the equation:            v₁ + 2v₂ = b

Add the two lines:      (u₁ + v₁) + 2(u₂ + v₂) = 2b

So u + v satisfies the equation with 2b on the right,
not b. For u + v to be a solution too, we need

                                     2b = b
                                      b = 0`}
      </Worked>
      <Para>
        So the solutions of Ax = 0 are closed under addition and the solutions of Ax = b, for any other b, are not. That
        one fact is the reason the rest of the lecture is about sets that contain the origin, and it is the reason the
        nullspace gets singled out later as the example worth having.
      </Para>

      <Terms
        items={[
          {
            term: 'structure',
            def: 'Not a vague word here. It means a set comes with operations, and the operations are guaranteed to keep you inside the set. Adding two members gives a member; scaling a member gives a member.',
          },
          {
            term: 'closed / closure',
            def: 'The guarantee just described. A set is closed under an operation when applying that operation to members never produces a non-member.',
          },
          {
            term: 'Ax = b',
            say: 'A x equals b',
            def: 'A system of linear equations written compactly. A is the table of coefficients, x is the unknown column, b is the column of right-hand sides.',
          },
          {
            term: 'homogeneous',
            say: 'hoh-moh-JEE-nee-us',
            def: 'The name for a system with b = 0, so Ax = 0. Not on the slides, but you will meet the word — and this part is the reason those systems behave better than the others.',
          },
        ]}
      />

      <Takeaway>
        A set of answers is only a space when the answers can be added and scaled without leaving the set. For a linear
        system that happens exactly when the right-hand side is zero.
      </Takeaway>

      <WhyAiml method="the normal equations XᵀXw = Xᵀy, and Ridge(alpha)">
        <p className="mb-3">
          Fitting a linear model by least squares means solving the normal equations XᵀXw = Xᵀy. When two of your
          columns are copies of each other, XᵀX cannot be inverted and that system has more than one answer. The set of
          answers is not a random scattering: it is one particular solution plus everything in the nullspace of X, which
          is a genuine subspace of the kind this lecture is about. So the ambiguity has a shape, and the shape is
          exactly what the next few pages describe.
        </p>
        <p>
          That is why ridge regression exists. Adding λI to XᵀX makes the matrix invertible again, which collapses the
          whole set of tied answers down to a single point — the one with the smallest norm. Without knowing that the
          tied answers form a subspace, “the model is not identifiable” is just an error message; with it, you know
          precisely how big the ambiguity is (the dimension of the nullspace) and which knob removes it.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  groups: (
    <>
      <Para>
        Before defining a vector space, the deck defines something smaller. We already sense that adding two vectors
        gives a vector, and scaling a vector gives a vector. To make that precise it introduces a <strong>group</strong>
        : the least structure worth having.
      </Para>
      <Para>
        A group is a set G together with one operation ⊗ that takes two members of G and returns something. Written out
        as the slide writes it:
      </Para>
      <Formula>⊗ : G × G → G</Formula>
      <Para>
        Read that as: feed the machine two things from G, get one thing back. The pair (G, ⊗) is called a group when
        four promises hold.
      </Para>

      <Terms
        items={[
          {
            term: '∀',
            say: 'for all',
            def: 'Applies to every member without exception. “∀ x ∈ G” means “for every x in G”.',
          },
          {
            term: '∈',
            say: 'is in / is a member of',
            def: 'x ∈ G means x is one of the things in the set G.',
          },
          {
            term: '∃',
            say: 'there exists',
            def: 'Says at least one thing with the stated property can be found. See the note below about how the deck writes this one.',
          },
          {
            term: 'G × G',
            say: 'G cross G',
            def: 'The set of all ordered pairs you can make from G. It is just a way of saying the operation takes two inputs.',
          },
          {
            term: '⊗',
            say: 'the operation',
            def: 'A deliberately blank symbol. It is whatever operation you are testing — plus, times, matrix multiply, doing one shuffle then another.',
          },
          {
            term: 'ℤ, ℕ₀',
            say: 'the integers, the naturals with zero',
            def: 'ℤ is …, −2, −1, 0, 1, 2, …. ℕ₀ is 0, 1, 2, 3, … with no negatives.',
          },
        ]}
      />

      <Para>The four promises, in the deck’s own order:</Para>
      <List
        items={[
          <>
            <strong>Closure.</strong> ∀ x, y ∈ G, x ⊗ y ∈ G. Combining two members never throws you out of the set.
          </>,
          <>
            <strong>Associativity.</strong> ∀ x, y, z ∈ G, (x ⊗ y) ⊗ z = x ⊗ (y ⊗ z). Where you put the brackets makes
            no difference, so a chain of operations has one meaning.
          </>,
          <>
            <strong>Neutral, or identity, element.</strong> There is an e ∈ G with x ⊗ e = x for every x. A member that
            does nothing.
          </>,
          <>
            <strong>Inverse element.</strong> ∀ x ∈ G there is a y ∈ G with x ⊗ y = y ⊗ x = e. Everything can be undone,
            and the undo is itself in the set.
          </>,
        ]}
      />
      <Para>
        And one extra promise that is optional: if x ⊗ y = y ⊗ x for every x and y, the group is called{' '}
        <strong>Abelian</strong>. Order does not matter. Plenty of useful groups are not Abelian, so this is a separate
        label rather than a fifth requirement.
      </Para>

      <DeckNote>
        Slide 3 writes the identity and inverse promises with the symbol ∋ where ∃ (“there exists”) is meant. ∋ normally
        means “contains as a member”, so read “∋ e ∈ G” as “there exists an e in G”. The maths is standard; only the
        symbol is unusual.
      </DeckNote>

      <Para>
        Slide 4 then tries three candidates. Press through them below, along with four more, and look at which single
        promise each failure breaks.
      </Para>

      <Lab>
        <GroupLab />
      </Lab>

      <Para>
        The three the deck names are worth stating plainly. <strong>(ℤ, +) is an Abelian group</strong> — every promise
        holds, with e = 0 and the inverse of x being −x. <strong>(ℕ₀, +) is not a group</strong>: there is no inverse
        for a general member, because undoing +5 needs −5 and that is not a counting number.{' '}
        <strong>(ℤ, ·) is not a group either</strong>: it has an identity, e = 1, but undoing ×3 needs 1⁄3, which is not
        a whole number.
      </Para>
      <Para>
        Notice how narrow each failure is. (ℕ₀, +) satisfies three of the four promises. Being “almost a group” buys you
        nothing — the definition is all four or none.
      </Para>

      <Takeaway>
        A group is a set plus one operation, with closure, associativity, an identity and inverses. Add commutativity
        and it is Abelian. Vector addition is going to be exactly this, which is why the definition comes first.
      </Takeaway>

      <WhyAiml method="the SGD update w ← w − η∇L, and translation equivariance in a convolutional layer">
        <p className="mb-3">
          Every optimiser you will meet in this programme does one thing to a weight vector: it adds another vector to
          it. w ← w − η∇L is addition in (ℝᵈ, +), and it relies on all four promises without ever mentioning them.
          Closure is why the updated weights are still a legal model. The identity, the zero vector, is what a zero
          gradient means — a converged step that changes nothing. Inverses are why an update can be undone, which is
          what a framework does when it rolls back a step that produced a NaN, and what momentum leans on when it
          carries a negative contribution forward.
        </p>
        <p>
          The other place groups appear by name is in the structure of the data rather than the parameters. Shifting an
          image sideways is a group operation: shifts compose, doing nothing is the identity, and every shift can be
          undone. A convolutional layer is built to commute with that group — shift the input and the feature map shifts
          the same way — and that property, called equivariance, is the actual reason a CNN needs far fewer examples
          than a fully connected network on image data. The group is not decoration; it is the assumption that buys the
          sample efficiency.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  spaces: (
    <>
      <Para>
        Now the real definition. A vector space is a set with <strong>two</strong> operations, not one. The deck calls
        them the inner and the outer operation.
      </Para>
      <List
        items={[
          <>
            The <strong>inner</strong> operation is +, and it takes two members of the set and returns a member. In
            symbols, + : 𝒱 × 𝒱 → 𝒱. Think of it as a form of addition.
          </>,
          <>
            The <strong>outer</strong> operation is ·, and it takes a real number λ and a member x and returns a member.
            In symbols, · : ℝ × 𝒱 → 𝒱. Think of it as a form of scaling.
          </>,
        ]}
      />
      <Para>
        The word “outer” is doing real work. The two inputs come from different places — one from ℝ, one from 𝒱 — which
        is why scaling cannot be folded into addition and has to be listed separately.
      </Para>
      <Para>The deck’s definition, in full: a real-valued vector space is a set 𝒱 = (𝒱, +, ·) such that</Para>
      <List
        items={[
          <>
            (𝒱, +) is an <strong>Abelian group</strong> — which imports all four promises from the last part, plus
            commutativity, in one word;
          </>,
          <>
            <strong>distributivity</strong> holds, in two separate forms;
          </>,
          <>
            <strong>associativity with respect to the outer operation</strong> holds;
          </>,
          <>
            there is a <strong>neutral element with respect to the outer operation</strong>.
          </>,
        ]}
      />
      <Para>Slide 6 writes the last three out. Here they are with the quantifiers read aloud:</Para>
      <Formula>∀ λ ∈ ℝ, x, y ∈ 𝒱 : λ · (x + y) = λ · x + λ · y</Formula>
      <Formula>∀ λ, ψ ∈ ℝ, x ∈ 𝒱 : (λ + ψ) · x = λ · x + ψ · x</Formula>
      <Formula>∀ λ, ψ ∈ ℝ, x ∈ 𝒱 : λ · (ψ · x) = (λψ) · x</Formula>
      <Formula>∀ x ∈ 𝒱 : 1 · x = x</Formula>
      <Para>
        Read the first as: scaling a sum is the same as scaling each part and then adding. The second as: adding two
        scalars and then scaling is the same as scaling twice and adding the results. The third as: scaling twice in a
        row is the same as scaling once by the product. The fourth as: scaling by 1 does nothing.
      </Para>
      <Para>
        Two pieces of naming, from the same slide. The members x ∈ 𝒱 are called <strong>vectors</strong> — that is where
        the word comes from, and it is a name for anything obeying these rules rather than a description of an arrow.
        The neutral element of (𝒱, +) is the <strong>zero vector</strong>, written [0, 0, … 0]ᵀ, and the inner operation
        is called <strong>vector addition</strong>.
      </Para>

      <Terms
        items={[
          {
            term: 'λ',
            say: 'lambda',
            def: 'A scalar — an ordinary real number used for scaling. Nothing to do with the learning rate here; that is η.',
          },
          {
            term: 'ψ',
            say: 'psi, rhymes with "sigh"',
            def: 'A second scalar. The deck needs two at once to state distributivity over scalar addition.',
          },
          {
            term: 'scalar',
            def: 'A plain number, as opposed to a vector. Called that because its job is to scale.',
          },
          {
            term: '𝒱 = (𝒱, +, ·)',
            def: 'A slight abuse of notation the deck uses: the same letter names both the underlying set and the whole structure of set-plus-two-operations. Which is meant is always clear from context.',
          },
          {
            term: '[0, 0, … 0]ᵀ',
            say: 'the zero vector, transposed',
            def: 'The ᵀ tips a row on its side to make a column. Vectors are columns by convention, so writing one along a line needs the ᵀ.',
          },
        ]}
      />

      <Para>
        Below, each law is worked out on both sides with numbers you choose. The tick is a comparison of two computed
        values, not a claim. Then swap in one of the two broken scaling rules and find out which promise dies — it is
        not always the one you expect.
      </Para>

      <Lab>
        <AxiomLab />
      </Lab>

      <Beyond>
        The lab’s second rule, λ ⊙ x = (λx₁, x₂), scales only the first component. It looks harmless and it keeps three
        of the four laws. Distributivity over <em>scalar</em> addition is the one it breaks, because scaling twice and
        adding leaves you with the second component counted twice. The third rule, λ ⊙ x = 2λx, does the opposite: both
        distributive laws survive and the other two fail, since 1 ⊙ x = 2x is not x. The lesson is that these four laws
        are genuinely independent of each other, which is why all four have to be listed.
      </Beyond>

      <Takeaway>
        Vector space = an Abelian group under +, plus a scaling operation obeying two distributive laws, associativity
        and 1 · x = x. Eight promises in total once the group is unpacked, and losing any one of them loses the theory.
      </Takeaway>

      <WhyAiml method="the parameter update in torch.optim.SGD, and averaging models in federated learning">
        <p className="mb-3">
          A model’s parameters are a point in a vector space, and every training algorithm is built out of exactly the
          two operations on this page and nothing else. SGD computes w − η·g: one scaling and one addition. Momentum
          keeps a running v ← βv + g, which is two scalings and an addition. Adam divides by a running root-mean-square,
          which is still scaling. Nobody ever needs a third operation, and that is why the same optimiser code works on
          a 2-parameter model and a 70-billion-parameter one.
        </p>
        <p>
          The laws are what make the shortcuts legal. Weight averaging — take two models trained on different shards and
          use ½(w₁ + w₂), which is the core step of federated learning — is only meaningful because scaling distributes
          over addition, so the average of the parameters behaves predictably. And 1 · x = x is the law that makes “a
          learning rate of 1 leaves the step unchanged” true, which is the sanity check every learning-rate schedule is
          written against.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  whatcounts: (
    <>
      <Para>
        Nothing in the definition mentioned arrows, or columns, or geometry. It mentioned a set and two operations. So
        the definition applies to anything that supports those two operations — and the deck spends two slides making
        that point, because it is the point that gives the theory its reach.
      </Para>
      <Para>
        Slide 7 does the familiar case, 𝒱 = ℝⁿ. Addition is componentwise and scaling multiplies every component:
      </Para>
      <Formula>x + y = (x₁, x₂, … xₙ) + (y₁, y₂, … yₙ) = (x₁ + y₁, x₂ + y₂, … xₙ + yₙ)</Formula>
      <Formula>λx = λ(x₁, x₂, … xₙ) = (λx₁, λx₂, … λxₙ), ∀ λ ∈ ℝ, x ∈ ℝⁿ</Formula>
      <Para>
        Slide 8 then says, in the deck’s own words, that what we call a vector need not be the standard column vector we
        are used to. We can think of m × n matrices as vectors and build a vector space out of them. 𝒱 = ℝᵐˣⁿ, with
      </Para>
      <Formula>A + B defined entry by entry: (A + B)ᵢⱼ = aᵢⱼ + bᵢⱼ, and λA scaling every entry: (λA)ᵢⱼ = λaᵢⱼ</Formula>
      <Para>
        Both operations ignore the arrangement completely. They pair up matching positions and do arithmetic. That is
        why a 4 × 1 column, a 2 × 3 matrix and a whole layer of weights are all the same kind of object as far as this
        lecture is concerned.
      </Para>

      <Lab>
        <VectorKindLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'ℝⁿ',
            say: 'R n',
            def: 'The set of all lists of n real numbers. ℝ² is the plane, ℝ³ is space, ℝ⁷⁸⁴ is the set of all 28 × 28 greyscale images written out flat.',
          },
          {
            term: 'ℝᵐˣⁿ',
            say: 'R m by n',
            def: 'The set of all matrices with m rows and n columns.',
          },
          {
            term: 'componentwise / entry-wise',
            def: 'Do the arithmetic position by position, pairing the first with the first, the second with the second, and so on. Both operations here are of this kind.',
          },
        ]}
      />

      <Beyond>
        The lab adds two cases the deck does not. A layer’s weight matrix is the same object as slide 8’s ℝᵐˣⁿ, which is
        why an optimiser can treat every weight in a network as one enormous point being moved. And a polynomial a + bx
        + cx² is a vector too: add two quadratics and you get a quadratic, scale one and you get a quadratic, so the
        coefficient triple (a, b, c) behaves exactly like a vector in ℝ³. Function spaces are the same idea taken
        further, and they are where kernel methods live.
      </Beyond>

      <Takeaway>
        “Vector” is a job description, not a shape. Anything you can add and scale sensibly is a vector, and one theory
        then covers all of them at once.
      </Takeaway>

      <WhyAiml method="torch.nn.utils.parameters_to_vector, and L2 weight decay on ‖W‖²_F">
        <p className="mb-3">
          A network stores its parameters as a pile of differently shaped tensors — a 784 × 128 matrix here, a
          128-length bias there. Every framework has a call that flattens the lot into one long vector and another that
          puts it back, and gradient clipping, weight averaging and checkpoint interpolation all work on that flat form.
          That round trip is only sound because slide 8 is true: the pile of matrices and the single long vector are the
          same vector space, so adding and scaling mean the same thing in both.
        </p>
        <p>
          It also settles what weight decay is doing. The L2 penalty on a weight matrix is the Frobenius norm squared,
          ‖W‖²_F, which is the sum of the squares of every entry — precisely the ordinary squared length of W once you
          agree that a matrix is a vector. So “add λ‖W‖² to the loss” needs no separate theory for matrices; it is the
          same regulariser you already met for a coefficient vector, applied in a bigger space.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  subspaces: (
    <>
      <Para>
        Most of the interesting sets in machine learning are not whole spaces. They sit <em>inside</em> one: a plane
        inside ℝ³, the directions a model actually uses inside all possible directions. The deck gives that idea a name.
      </Para>
      <Para>
        Let 𝒱 = (𝒱, +, ·) be a vector space and let 𝒰 ⊆ 𝒱 with 𝒰 ≠ Φ. Then 𝒰 = (𝒰, +, ·) is a{' '}
        <strong>vector subspace</strong> of 𝒱 if 𝒰 is itself a vector space, with the operations of 𝒱 restricted to 𝒰 ×
        𝒰 and ℝ × 𝒰.
      </Para>
      <Para>
        The word <strong>restricted</strong> matters. You do not get to invent new operations for 𝒰. It has to work with
        the ones it inherits, applied only to its own members.
      </Para>

      <Terms
        items={[
          {
            term: '⊆',
            say: 'is a subset of',
            def: 'Every member of the left-hand set is also a member of the right-hand one. 𝒰 ⊆ 𝒱 allows 𝒰 to be all of 𝒱.',
          },
          {
            term: 'Φ',
            say: 'phi',
            def: 'The empty set — the set with nothing in it. 𝒰 ≠ Φ says the candidate must contain at least one thing.',
          },
          {
            term: '𝒰 ⊆ 𝒱 as subspace',
            def: 'The deck reuses the subset symbol to mean "is a vector subspace of". Context tells the two apart: a subspace claim is about the operations as well as the members.',
          },
          {
            term: 'restricted',
            def: 'Same operation, narrower inputs. Adding two members of 𝒰 uses the addition of 𝒱; you just never feed it anything outside 𝒰.',
          },
        ]}
      />

      <Para>
        Slide 9 then makes a labour-saving observation. If 𝒰 ⊆ 𝒱 and 𝒱 is a vector space, then 𝒰 inherits a great deal
        automatically, because the laws hold for <em>all</em> x ∈ 𝒱 and therefore in particular for all x ∈ 𝒰 ⊆ 𝒱. The
        deck lists what comes free: the Abelian group property, associativity, distributivity and the neutral element.
      </Para>
      <Para>So the check is short. Slide 10 says you only have to show three things:</Para>
      <List
        items={[
          <>
            <strong>𝒰 ≠ Φ.</strong> In practice this is done by showing 0 ∈ 𝒰, and that is the fastest way to throw a
            candidate out.
          </>,
          <>
            <strong>Closure under the outer operation.</strong> ∀ λ ∈ ℝ, ∀ x ∈ 𝒰, λx ∈ 𝒰.
          </>,
          <>
            <strong>Closure under the inner operation.</strong> ∀ x, y ∈ 𝒰, x + y ∈ 𝒰.
          </>,
        ]}
      />
      <Para>
        That is the whole test. Two closures and a non-empty set. Try to break each of the eight candidates below: drag
        u and v around, and use λ to test scaling. The arrows go grey when they leave the shaded set, because a closure
        test on a vector that was never inside it proves nothing.
      </Para>

      <Lab>
        <SubspaceLab />
      </Lab>

      <Para>
        The deck works two of these out on slide 11. The <strong>y-axis in ℝ² is a subspace</strong>: adding two vectors
        on the y-axis keeps you on the y-axis, and scaling one by any real number, zero included, keeps you there. The
        y-axis <strong>shifted one unit right</strong>, the set {'{'}x = 1{'}'}, is <strong>not</strong>, because
        scaling breaks closure — and the quickest way to see it is that 0 · x lands on the origin, which is not in the
        set.
      </Para>

      <Beyond>
        Four of the eight candidates are not from the deck, and each is a constraint you will actually meet.
        Non-negative weights is the constraint in non-negative matrix factorisation: closed under addition, and killed
        by multiplying by −1. Unit-length weights is what a normalised embedding satisfies: a circle contains no origin
        and two unit vectors almost never add to a unit vector. “Only one feature used” is the set an L₀ sparsity rule
        picks out, and it fails on addition alone — which is a large part of why L₀ is replaced by the L₁ penalty in
        Lasso. The nullspace candidate is the one the next part is about.
      </Beyond>

      <Takeaway>
        To prove a subset is a subspace you check three things: it is not empty, it is closed under scaling, and it is
        closed under addition. Everything else is inherited. To disprove one, a single counterexample is enough — and
        “does it contain 0?” is the cheapest one to try.
      </Takeaway>

      <WhyAiml method="PCA, and why sklearn.decomposition.PCA centres the data first">
        <p className="mb-3">
          Principal component analysis finds the k-dimensional subspace that your data lies closest to, then represents
          every sample by its coordinates in that subspace. The word subspace there is the one defined on this page: a
          set closed under addition and scaling, and therefore a set that must pass through the origin.
        </p>
        <p>
          That last clause is not a technicality — it is why PCA subtracts the mean before it does anything else. If
          your data sits in a cloud around the point (50, 200), the flat sheet it lies near does not go through the
          origin, so it is not a subspace and PCA cannot describe it. Centring slides the cloud so that the sheet does
          pass through 0, and only then is the object PCA is looking for the kind of object it knows how to find. Skip
          the centring and the first component comes out pointing at the mean instead of along the direction of greatest
          spread, which is the classic silent failure — it produces numbers, and they are the wrong numbers.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  nullspace: (
    <>
      <Para>
        Slide 12 offers one more set that fails, and then the one the lecture actually wants. The failure first: the
        square around the origin, −1 ≤ x ≤ 1 and −1 ≤ y ≤ 1, is not a subspace. It contains the origin, so it survives
        the cheap test, and it still dies — stretch any non-zero vector in it far enough and you leave. Containing 0 is
        necessary and nowhere near sufficient.
      </Para>
      <Para>
        Then the deck names the subspace it says is of particular interest to us: the <strong>nullspace</strong> of a
        matrix, meaning the set of solutions to Ax = 0. It asks why this is a vector subspace, and leaves the answer to
        you. It is two lines, and both use nothing but the fact that matrix multiplication is linear:
      </Para>
      <Worked title="Why the nullspace is a subspace">
        {`Non-empty:   A0 = 0, so the zero vector is always in it.

Closed under +:
             take x, y with Ax = 0 and Ay = 0
             A(x + y) = Ax + Ay = 0 + 0 = 0
             so x + y is in it too.

Closed under scaling:
             take x with Ax = 0 and any λ ∈ ℝ
             A(λx) = λ(Ax) = λ·0 = 0
             so λx is in it too.

All three of slide 10's conditions hold, so null(A) is
a vector subspace of ℝⁿ.`}
      </Worked>
      <Para>
        Notice this proof never looked at A. It works for every matrix, of every shape, which is why the nullspace is a
        subspace and not merely sometimes one.
      </Para>
      <Para>
        Now the part that makes it worth caring about in a machine learning course. The lab below has two features and
        three samples, and the second feature is the first one measured in different units — so column 2 of the design
        matrix is exactly twice column 1. Move the weight vector and watch the predictions.
      </Para>

      <Lab>
        <NullspaceLab />
      </Lab>

      <Para>
        The teal line is every weight vector giving <em>identical</em> predictions on all three samples. It is the
        starting w plus the nullspace, and it is endless. No amount of data of this kind will ever choose between the
        models on it, because they make the same predictions everywhere the data can see.
      </Para>

      <Terms
        items={[
          {
            term: 'nullspace',
            say: 'NULL-space',
            def: 'The set of all x with Ax = 0. Also called the kernel of A — a different use of the word "kernel" from the one in SVMs, which is a common source of confusion.',
          },
          {
            term: 'null(A)',
            def: 'The usual notation for that set. Its dimension has its own name, the nullity of A.',
          },
          {
            term: 'design matrix',
            def: 'The table of features you feed a model: one row per sample, one column per feature. Usually written X. Not the deck’s term — it is the machine learning name for the A in Ax = b.',
          },
        ]}
      />

      <Takeaway>
        null(A) = {'{'}x : Ax = 0{'}'} is always a subspace, for any A, and the proof is three lines of linearity. In a
        model, it is the set of parameter changes that no amount of data can detect.
      </Takeaway>

      <WhyAiml method="numpy.linalg.lstsq’s minimum-norm solution, and the dummy variable trap">
        <p className="mb-3">
          A non-trivial nullspace in your design matrix means your model is not identifiable: several different weight
          vectors fit the data equally perfectly, and the fitting procedure has no principled way to pick between them.
          The most common way to cause it by accident is one-hot encoding — make a column for every category and add an
          intercept, and the category columns sum to the intercept column, which puts a vector straight into the
          nullspace. That is the dummy variable trap, and it is why one-hot encoders offer a drop-first option.
        </p>
        <p>
          The libraries do not crash on this; they make a choice, and it helps to know which.{' '}
          <code>numpy.linalg.lstsq</code> uses an SVD and returns the solution of smallest norm — that is, the one point
          of the tied set closest to the origin. Ridge regression makes the same choice for a different reason, by
          making the system invertible again. Ordinary <code>LinearRegression</code> will hand back coefficients that
          look meaningful and are not: shift them along the nullspace and every prediction is unchanged, so no
          individual coefficient can be interpreted. Reading a coefficient as “the effect of this feature” is only ever
          valid when the nullspace is trivial.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  combination: (
    <>
      <Para>
        Slide 13 changes the question again, and states the plan for the rest of the lecture. We know we can stay inside
        a vector space by adding and scaling. The new question is: can we find a set of vectors such that <em>every</em>{' '}
        vector in the space can be built from them, by scaling and adding?
      </Para>
      <Para>
        The deck answers immediately: yes, and such a set is called a <strong>basis</strong>. To get there it needs two
        ideas first — linear combination, and linear independence.
      </Para>
      <Para>
        Linear combination is the easy one. Given a vector space 𝒱 and vectors x₁, x₂, … xₖ ∈ 𝒱, every v ∈ 𝒱 of the form
      </Para>
      <Formula>v = λ₁x₁ + λ₂x₂ + … + λₖxₖ</Formula>
      <Para>
        is a <strong>linear combination</strong> of x₁, x₂, … xₖ. That is all it is: scale each one by some number, add
        the results. The word “linear” is there because only scaling and adding are allowed — no squaring, no
        multiplying two vectors together.
      </Para>
      <Para>
        Slide 14 then makes a point that looks like a technicality and is in fact the hinge of the next three parts. The
        zero vector can always be written as a linear combination of any x₁ … xₖ, by taking every λ to be 0. That is
        called the <strong>trivial</strong> combination, and it tells you nothing, because it works for any vectors
        whatsoever. What is interesting is whether there is a <em>non-trivial</em> way to combine them and still land on
        zero.
      </Para>

      <Lab>
        <ReachLab />
      </Lab>

      <Para>
        Three things to try in the lab. With two genuinely different directions, every target is reachable and in
        exactly one way — press “solve it” and the coefficients are unique. With one feature recorded twice, everything
        you can build lands on a single line, and most targets become unreachable. With two nearly-agreeing features,
        every target is still reachable, but look at the size of the coefficients needed: that is what near-collinearity
        does to a fitted model, long before anything becomes exactly singular.
      </Para>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'Scale each vector by a number and add the results. λ₁x₁ + … + λₖxₖ.',
          },
          {
            term: 'trivial combination',
            def: 'The one where every coefficient is zero. It always reaches the zero vector, for any vectors at all, so it proves nothing.',
          },
          {
            term: 'non-trivial',
            def: 'At least one coefficient is not zero. Whether a non-trivial combination can reach 0 is the question the next part turns into a definition.',
          },
          {
            term: 'coefficient',
            def: 'One of the λs — the amount of each vector in the mixture.',
          },
        ]}
      />

      <Takeaway>
        A linear combination is a scaled sum. The zero vector is always reachable trivially; the whole of the next part
        turns on whether it is reachable any other way.
      </Takeaway>

      <WhyAiml method="the SVM dual solution w = Σ αᵢyᵢxᵢ, and the output of nn.Linear">
        <p className="mb-3">
          A support vector machine, which this course covers later, produces a weight vector that is literally a linear
          combination of the training points: w = Σ αᵢyᵢxᵢ, with most of the αᵢ equal to zero. The ones that are not
          zero are the support vectors. So the fitted model is a mixture of a handful of examples, and the coefficients
          in that mixture are what training solves for. Everything on this page — mixture, coefficient, trivial versus
          non-trivial — is the vocabulary that statement is written in.
        </p>
        <p>
          The same shape appears in the simplest layer there is. A linear layer computes Wx, and by the column picture
          of matrix multiplication that output is a linear combination of the <em>columns</em> of W, with the entries of
          x as the coefficients. This tells you something practical: whatever the layer can possibly output lives in the
          span of W’s columns, so a layer whose weight columns are nearly parallel can only produce outputs along one
          direction, however you drive it. That failure has a name — rank collapse — and the lab’s middle preset is a
          two-column picture of it.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  independence: (
    <>
      <Para>
        Here is the definition, and it is written backwards on purpose. Consider a vector space 𝒱 and k vectors x₁, x₂,
        … xₖ ∈ 𝒱. If there is a <strong>non-trivial</strong> linear combination of them reaching the zero vector —
      </Para>
      <Formula>0 = Σᵢ₌₁ᵏ λᵢxᵢ, with at least one λᵢ ≠ 0</Formula>
      <Para>
        — then the vectors are <strong>linearly dependent</strong>. Put the other way round, as the deck does: if the
        only way to combine them and get the zero vector is to take every λᵢ to be zero, then they are{' '}
        <strong>linearly independent</strong>.
      </Para>
      <Para>
        It is fair to find that definition awkward. Why define a positive property — “each one pulls its weight” — by
        way of a statement about reaching zero? Slide 16 answers it. What linear independence captures is{' '}
        <strong>redundancy</strong>. If the vectors are dependent, one of them can be written in terms of the others, so
        that vector is redundant. If they are independent, each vector brings something to the table that the others
        collectively cannot replace.
      </Para>
      <Para>
        The zero test is just the tidiest way to say that. If x₃ = 2x₁ − x₂, then 2x₁ − x₂ − x₃ = 0 is a non-trivial
        combination reaching zero. Redundancy and “a non-trivial route to 0” are the same fact written two ways, and the
        zero version has the advantage of not needing to say <em>which</em> vector is the redundant one.
      </Para>

      <Para>Slide 17 then lists three facts. Each one is live in the lab below.</Para>
      <List
        items={[
          <>
            k vectors are <strong>either</strong> linearly independent <strong>or</strong> linearly dependent. There is
            no third option, and no degree of it.
          </>,
          <>
            If at least one of them <strong>is the zero vector</strong>, they are dependent. The deck says to apply the
            definition and see: choose a non-zero λ for the zero vector and zero for everything else, and the
            combination is 0 · (non-zero λ) plus nothing, which is the zero vector. Non-trivial, and it reached zero.
          </>,
          <>
            If all of them are non-zero, they are dependent <strong>if and only if</strong> one of them is a linear
            combination of the others.
          </>,
        ]}
      />

      <Lab>
        <IndependenceLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'linearly independent',
            def: 'The only combination reaching 0 is the all-zeros one. Every vector adds reach the others do not have.',
          },
          {
            term: 'linearly dependent',
            def: 'Some combination with a non-zero coefficient reaches 0. At least one vector is redundant.',
          },
          {
            term: 'if and only if',
            say: 'iff',
            def: 'Both directions hold. "A iff B" means A implies B and B implies A, so the two are interchangeable. Exam answers lose marks for proving only one direction.',
          },
          {
            term: 'Σ',
            say: 'sigma, meaning "sum of"',
            def: 'Σᵢ₌₁ᵏ λᵢxᵢ means: let i run from 1 to k, work out λᵢxᵢ each time, add them all up.',
          },
        ]}
      />

      <Beyond>
        Fact 2 catches people out because it feels like a special case, and it is really the definition doing its job. A
        set containing the zero vector can never be independent, however impressive the other vectors are — which is
        worth remembering, because a column of all zeros in a design matrix (a feature that is constant at zero, or a
        category that never occurs in your sample) makes the whole set dependent on its own.
      </Beyond>

      <Takeaway>
        Dependent means some vector is already reachable from the others. The zero-vector definition is the same idea,
        phrased so you do not have to say which vector is the spare one.
      </Takeaway>

      <WhyAiml method="the dummy variable trap in OneHotEncoder(drop='first')">
        <p className="mb-3">
          The most common linear dependence in real machine learning is one you create yourself. One-hot encode a
          category with three levels and you get three columns, each 0 or 1, exactly one of them hot per row. Those
          three columns always sum to a column of all ones — and if your model also has an intercept, which is another
          column of all ones, you now have four columns with an exact dependency between them. The set is linearly
          dependent, the design matrix is rank-deficient, and the coefficients become non-unique.
        </p>
        <p>
          The fix is the definition read backwards: one of the columns is redundant, so drop it. That is precisely what{' '}
          <code>{"drop='first'"}</code> does in scikit-learn’s one-hot encoder and what <code>drop_first=True</code>{' '}
          does in pandas. The dropped level becomes the reference and the remaining coefficients are read relative to
          it. Notice the theory tells you not just that something is wrong but how much to remove — one column, because
          the dependency was one relation, not two.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  pivots: (
    <>
      <Para>
        The definition is fine for two vectors you can see. For five vectors in ℝ⁷ you need a procedure, and slide 18
        gives one. The deck calls it a practical way of checking whether a bunch of vectors are linearly independent:
      </Para>
      <List
        items={[
          <>Fill the columns of a matrix with the given vectors.</>,
          <>Perform Gaussian elimination to get the row-echelon form.</>,
          <>
            The <strong>pivot columns</strong> indicate all the vectors that are linearly independent, and they are all
            on the left.
          </>,
          <>
            The <strong>non-pivot columns</strong> can be expressed as a linear combination of the pivot columns.
          </>,
        ]}
      />
      <Para>
        Two things about this are easy to skate over. First: the vectors go in as <strong>columns</strong>, and you then
        do <strong>row</strong> operations. That mismatch feels wrong the first time and it is the whole trick — row
        operations do not change which combinations of the columns give zero, so they cannot change the answer to the
        question being asked. Second: the phrase “they are all on the left” is about where pivots land, not about
        importance. Elimination scans left to right and awards a pivot to the first column that earns one.
      </Para>

      <Terms
        items={[
          {
            term: 'Gaussian elimination',
            def: 'Repeatedly adding a multiple of one row to another, swapping rows, or scaling a row, until the matrix is a staircase of zeros in the bottom-left.',
          },
          {
            term: 'row-echelon form',
            say: 'ESH-uh-lon',
            def: 'The staircase. Every leading entry sits strictly to the right of the one above it, and rows of all zeros sit at the bottom.',
          },
          {
            term: 'pivot',
            def: 'The leading non-zero entry of a row once the matrix is in echelon form. The column it sits in is a pivot column.',
          },
          {
            term: 'rank',
            def: 'The number of pivots. It is the number of independent columns, and it is also the number of independent rows — the same number either way.',
          },
        ]}
      />

      <Para>
        Slide 19 does the smallest possible example. Start from the 2 × 3 matrix below and do the one row move; the
        pivot columns light up as they appear.
      </Para>

      <Lab>
        <PivotLab />
      </Lab>

      <Para>
        The deck’s result: the pivot columns are the first and the third, and the second column — a non-pivot column —
        can be expressed as a linear combination of the pivot columns to its left, which here is just twice the first.
        The slider in the lab lets you find that multiple rather than be told it.
      </Para>
      <Para>
        Read what that means back in terms of vectors. Three vectors went in, two came back independent, and the third
        is redundant. With three vectors of only two components each this was guaranteed before we started — a point the
        deck comes back to on slide 31, and one of the parts below.
      </Para>

      <Takeaway>
        Vectors in as columns, row-reduce, count pivots. Pivot columns are an independent set; every non-pivot column is
        a combination of the pivot columns to its left.
      </Takeaway>

      <WhyAiml method="numpy.linalg.matrix_rank, and rank-revealing QR in numpy.linalg.lstsq">
        <p className="mb-3">
          This is the procedure your library runs before it fits anything. <code>numpy.linalg.matrix_rank</code> counts
          the number of directions your design matrix genuinely spans, and comparing it against the number of columns is
          the one-line test for whether your features carry duplicated information. When the two disagree, ordinary
          least squares has no unique answer and every coefficient becomes uninterpretable.
        </p>
        <p>
          In floating point the counting is done differently and it is worth knowing why. Exact zeros are rare in real
          data — a duplicated feature measured with noise produces a pivot of size 10⁻¹⁵ rather than 0 — so libraries
          use an SVD or a QR with column pivoting and treat singular values below a tolerance as zero, rather than
          testing for equality. The idea is identical to slide 18; only the test for “is this entry zero?” changes. That
          is also why a near-duplicate feature produces a warning and enormous coefficients rather than a clean error:
          numerically it just scraped past as a pivot.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  worked: (
    <>
      <Para>Slides 20 and 21 run the procedure on a real case. Three vectors in ℝ⁴:</Para>
      <Worked title="Slide 20">
        {`x₁ = ( 1,  2, −3, 4)ᵀ
x₂ = ( 1,  1,  0, 2)ᵀ
x₃ = (−1, −2,  1, 1)ᵀ

To check for linear independence, set up

        λ₁x₁ + λ₂x₂ + λ₃x₃ = 0

and put the vectors in as columns:

        ⎡  1   1  −1 ⎤
        ⎢  2   1  −2 ⎥
        ⎢ −3   0   1 ⎥
        ⎣  4   2   1 ⎦`}
      </Worked>
      <Para>
        Note the shape. Four rows because each vector has four components; three columns because there are three
        vectors. Rows are components, columns are vectors — worth saying aloud every time, because getting it the wrong
        way round answers a different question entirely.
      </Para>
      <Para>
        Step through the elimination below. The deck’s route scales each leading entry to 1; the plain route does not
        bother. Both are legal, both are row-echelon forms, and they do not look the same.
      </Para>

      <Lab>
        <EliminationRouteLab />
      </Lab>

      <Para>
        The deck’s route lands on the matrix printed on slide 21, and the lab checks its own working against that
        printed matrix rather than asserting it. All three columns are pivot columns, so the three vectors are linearly
        independent: as the deck puts it, the only way to combine those vectors and get the 0-vector is to take 0s as
        the λs.
      </Para>
      <Beyond>
        The reason for offering two routes is a question that catches people out in exams: is the row-echelon form
        unique? No. Scale any row by a non-zero number and you have a different, equally valid echelon form — the two
        end matrices here differ in exactly that way. What <em>is</em> unique is the set of pivot{' '}
        <strong>positions</strong>, and therefore the rank, and therefore the verdict. The reduced row-echelon form,
        with leading 1s and zeros above as well as below, is unique — which is why the later examples in this deck
        reduce all the way.
      </Beyond>

      <Takeaway>
        Rows are components, columns are vectors. All columns pivot means independent. The echelon form you land on
        depends on your route; the pivot positions do not.
      </Takeaway>

      <WhyAiml method="partial pivoting in scipy.linalg.lu, and why the route is chosen for you">
        <p className="mb-3">
          Since any legal route gives the right pivot positions, a library is free to choose its route on other grounds
          — and it does. LU decomposition with partial pivoting swaps rows at each step so the largest available entry
          becomes the pivot, because dividing by a tiny pivot amplifies rounding error into the rest of the matrix. The
          answer is mathematically the same one you would get by hand; the choice is made entirely to keep floating
          point error small.
        </p>
        <p>
          This is worth carrying into any numerical work you do. When a library’s output does not match your hand
          working entry for entry, the first thing to check is whether you have found a genuine disagreement or merely a
          different route — compare ranks and pivot positions, not the matrices themselves. It also explains a practical
          rule from the ML course’s preprocessing step: features on wildly different scales make a badly conditioned
          design matrix, so the pivots are of wildly different sizes and the elimination loses accuracy. Standardising
          the columns is partly about optimisation speed and partly about this.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  coords: (
    <>
      <Para>
        Slides 22 to 25 do something clever and it is the part of the lecture most people skip. The setup: we have k
        vectors b₁, b₂, … bₖ that we already know are <strong>independent</strong>. We now build m new vectors x₁, x₂, …
        xₘ, each one some linear combination of the b’s. The goal is to find out when the x’s are independent — and, in
        the deck’s words, to express that criterion in terms of the way we combined the b’s.
      </Para>
      <Para>Written out, the m equations are:</Para>
      <Formula>x₁ = Σᵢ₌₁ᵏ λᵢ₁bᵢ, x₂ = Σᵢ₌₁ᵏ λᵢ₂bᵢ, … xₘ = Σᵢ₌₁ᵏ λᵢₘbᵢ</Formula>
      <Para>
        The double subscript is the fiddly bit. λᵢⱼ is the amount of bᵢ used in xⱼ: the first index says which
        ingredient, the second says which product. Collect the ingredients into a matrix B = [b₁, b₂, … bₖ] whose
        columns are the b’s, and collect the amounts for one product into a column λⱼ. Then the whole of one equation is
        a matrix times a vector:
      </Para>
      <Formula>xⱼ = Bλⱼ</Formula>
      <Para>
        Now test the x’s for independence the usual way — set a combination of them to zero and see what the ψ’s have to
        be:
      </Para>
      <Worked title="Slides 24 and 25, one line at a time">
        {`Σⱼ ψⱼxⱼ  =  Σⱼ ψⱼ(Bλⱼ)          substitute xⱼ = Bλⱼ

          =  B (Σⱼ ψⱼλⱼ)             pull B out; matrix times
                                     vector is linear

Write v = Σⱼ ψⱼλⱼ, which is just some vector. Then

Σⱼ ψⱼxⱼ = 0   means   Bv = 0

Bv is a linear combination of the columns of B, and the
columns of B are the b's, which are INDEPENDENT. The only
combination of independent vectors reaching 0 is the
trivial one, so

              v = 0,  i.e.  Σⱼ ψⱼλⱼ = 0

So: a non-trivial ψ kills the x's  ⟺  the same ψ kills
the λ's. The x's are linearly independent if and only if
λ₁, λ₂, … λₘ are linearly independent.`}
      </Worked>
      <Para>
        That is the pay-off. You never have to look at the x’s at all. Test the <strong>coefficient</strong> vectors
        instead, and they may live in a much smaller space than the x’s do.
      </Para>

      <DeckNote>
        Slide 24 writes the sum as Σⱼ₌₀ᵐ in one place and Σⱼ₌₁ᵐ in another. It is the same sum both times — j runs from
        1 to m, since there is no x₀ — and the index 0 is a slip in the typesetting rather than a different quantity.
      </DeckNote>

      <Para>
        The step everything rests on is “the columns of B are independent”, and it is easy to read past. The lab makes
        it breakable: edit B so that its columns are dependent, and watch the two ranks come apart.
      </Para>

      <Lab>
        <CoordsLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'λᵢⱼ',
            say: 'lambda i j',
            def: 'The amount of the i-th ingredient bᵢ in the j-th product xⱼ. First index: which b. Second index: which x.',
          },
          {
            term: 'B = [b₁, b₂, … bₖ]',
            def: 'A matrix built by standing the b vectors up side by side as columns.',
          },
          {
            term: 'ψⱼ',
            say: 'psi j',
            def: 'The coefficients in the test combination of the x’s. A different letter from λ purely to keep the two layers apart.',
          },
          {
            term: '⟺',
            say: 'if and only if',
            def: 'The two statements stand or fall together. Here: the x’s are independent exactly when the λ’s are.',
          },
        ]}
      />

      <Takeaway>
        With independent ingredients b, the products x are independent exactly when their recipe vectors λ are. Test the
        coefficients, not the vectors — and check the b’s are independent first, because the whole result depends on it.
      </Takeaway>

      <WhyAiml method="PCA.transform, and testing rank in the reduced space">
        <p className="mb-3">
          This is the theorem behind every representation you will use. Fit PCA on 20 000-pixel images and keep 50
          components: the components are the b’s, and each image becomes its coefficient vector λ — 50 numbers instead
          of 20 000. Because PCA’s components are orthogonal and therefore independent, this page says questions about
          the independence of the images can be answered on the 50-number coefficient vectors instead. That is not an
          approximation. It is exact, and it is why downstream models are routinely fitted on the transformed features
          without anyone worrying that something has been lost about the geometry.
        </p>
        <p>
          The condition is the part to remember, because it is where this breaks in practice. The result needs the b’s
          to be independent. Build a dictionary with more atoms than dimensions — an overcomplete dictionary, which is
          exactly what sparse coding does on purpose — and the b’s are dependent, so two different coefficient vectors
          can encode the same signal and rank in coefficient space no longer tells you rank in the original space. The
          lab’s “break B” button is that situation in miniature.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  fourx: (
    <>
      <Para>
        Slides 26 to 29 put the previous part to work. Four vectors are defined in terms of four independent b’s:
      </Para>
      <Worked title="Slide 26">
        {`x₁ =   b₁ −  2b₂ +   b₃ −  b₄
x₂ = −4b₁ −  2b₂        + 4b₄
x₃ =  2b₁ +  3b₂ −   b₃ − 3b₄
x₄ = 17b₁ − 10b₂ + 11b₃ +  b₄`}
      </Worked>
      <Para>
        By the last part we do not need to know what the b’s are. We only need their coefficients. Reading the four
        recipes down gives four λ vectors, and slide 27 lists them:
      </Para>
      <Formula>(1, −2, 1, −1)ᵀ, (−4, −2, 0, 4)ᵀ, (2, 3, −1, −3)ᵀ, (17, −10, 11, 1)ᵀ</Formula>
      <Para>
        Read that carefully against the equations. x₂ has no b₃ term, so its third coefficient is 0 — the missing term
        is not skipped, it is a zero. Standing those four columns side by side gives slide 28’s matrix A, and the
        reduced row-echelon form is slide 29’s answer. Both are computed below.
      </Para>

      <Lab>
        <FourXLab />
      </Lab>

      <Para>
        The reduced form has a column of zeros at the bottom and a fourth column with no pivot, and the deck reads the
        answer straight off it: take 7 times the first column, add 15 times the second, add 18 times the third, add the
        fourth, and you get the zero vector. That is a non-trivial combination reaching 0, so the columns are dependent,
        so the λ’s are dependent, so — by slide 25 — x₁, x₂, x₃, x₄ are <strong>not</strong> linearly independent.
      </Para>
      <Para>
        Type the numbers into the lab and every row cancels. It is worth doing the first row by hand once, because it is
        the whole argument in four terms:
      </Para>
      <Worked title="Row 1, by hand">
        {`7(1) + 15(−4) + 18(2) + 1(17)
  =  7  −  60   +  36  +  17
  =  0   ✓

and the other three rows do the same:

row 2:  7(−2) + 15(−2) + 18(3)  + 1(−10)
     = −14   −  30   +  54   −  10   =  0  ✓
row 3:  7(1)  + 15(0)  + 18(−1) + 1(11)
     =   7   +   0   −  18   +  11   =  0  ✓
row 4:  7(−1) + 15(4)  + 18(−3) + 1(1)
     =  −7   +  60   −  54   +   1   =  0  ✓`}
      </Worked>
      <Beyond>
        Where do 7, 15, 18 come from? Not from guessing. The last column of the reduced form is (−7, −15, −18, 0)ᵀ,
        which says directly that column 4 = −7·column 1 − 15·column 2 − 18·column 3. Move everything to one side and you
        have 7c₁ + 15c₂ + 18c₃ + c₄ = 0, which is the deck’s combination with a coefficient of 1 on the fourth. Every
        non-pivot column of a reduced row-echelon form hands you its own recipe like this, already written out.
      </Beyond>

      <Takeaway>
        Four x’s, four λ’s, one elimination. The non-pivot column of the reduced form reads off the exact dependency,
        and the coefficients are not guessed — they are the entries of that column with the signs flipped.
      </Takeaway>

      <WhyAiml method="variance inflation factors, and choosing which collinear feature to drop">
        <p className="mb-3">
          When a design matrix is rank-deficient, knowing <em>that</em> it is deficient is only half the diagnosis. The
          useful half is the exact relation between the columns, and this part is how you get it: the non-pivot column
          of the reduced form spells out which features combine into which, with coefficients. A collinearity report
          that says “feature 4 = −7·f₁ − 15·f₂ − 18·f₃” tells you what to do; a report that says “condition number is
          large” does not.
        </p>
        <p>
          It also settles a question that comes up constantly: which of the collinear features should you drop? The
          maths cannot answer it, and it is important to be clear about that rather than to invent a rule. Any single
          column involved in the relation with a non-zero coefficient can go, and the remaining ones will then be
          independent — elimination happened to hand pivots to the first three, but that reflects column order, not
          importance. The decision is made on other grounds: which feature is cheaper to collect, easier to explain, or
          less noisy. What this page guarantees is only how many you must remove, which is the number of dependency
          relations you found.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  counting: (
    <>
      <Para>
        Slide 30 stops to summarise what just happened, and slide 31 draws a conclusion from it that costs no arithmetic
        at all. The summary first: we had k vectors bᵢ which we combined linearly to get m vectors xᵢ; deciding whether
        the m vectors were independent came down to checking whether the columns of a k × m matrix were independent; and
        we did that by Gaussian elimination.
      </Para>
      <Para>Now the insight. Suppose m {'>'} k — more vectors than ingredients. Then:</Para>
      <List
        items={[
          <>the matrix has more columns than rows;</>,
          <>
            there can only be as many pivots as there are non-zero rows, and there are at most k rows, so there are at
            most k pivots;
          </>,
          <>
            since k {'<'} m, at least one column must be left without a pivot — we are <strong>guaranteed</strong> a
            non-pivot column;
          </>,
          <>
            a non-pivot column is expressible in terms of the pivot columns to its left, which hands us a non-trivial
            combination reaching 0.
          </>,
        ]}
      />
      <Para>
        So m {'>'} k makes the x vectors dependent, and you know it from the shape alone, without looking at a single
        number.
      </Para>

      <DeckNote>
        Slide 31 says the number of pivot columns “is less than k”. Strictly it is at most k — with k independent rows
        you could have exactly k pivots. The conclusion is unaffected, because what the argument needs is that the
        number of pivots is less than <em>m</em>, and at most k together with k {'<'} m gives that immediately.
      </DeckNote>

      <Lab>
        <ShapeLab />
      </Lab>

      <Para>
        Move the two dials and watch the verdict. Note carefully what happens when m ≤ k: the verdict is not
        “independent”, it is <strong>undecided</strong>. The shape argument only ever proves dependence. Fewer vectors
        than ingredients tells you nothing on its own — you still have to do the elimination and look.
      </Para>

      <Terms
        items={[
          {
            term: 'k',
            def: 'The number of independent ingredient vectors, and so the number of rows of the coefficient matrix.',
          },
          {
            term: 'm',
            def: 'The number of vectors being tested, and so the number of columns.',
          },
          {
            term: 'guaranteed',
            def: 'The deck’s own emphasis. It means no example can escape it — this is a proof about every case, not an observation about the usual one.',
          },
        ]}
      />

      <Takeaway>
        More vectors than the dimension they live in means dependent, always, with no arithmetic. The reverse is not a
        theorem: fewer vectors than dimensions decides nothing.
      </Takeaway>

      <WhyAiml method="the p > n regime, and why Lasso and Ridge stop being optional">
        <p className="mb-3">
          Call the samples n and the features p. A design matrix is n × p, so its rank is at most min(n, p). When p{' '}
          {'>'} n — more features than samples, which is the normal state of affairs in gene expression data, text with
          a large vocabulary, and any small pilot study with rich measurements — the columns are guaranteed dependent by
          exactly the argument on this slide. That has a hard consequence: there are infinitely many weight vectors that
          fit the training data <em>perfectly</em>, with zero training error, and they disagree wildly on new data.
        </p>
        <p>
          This is why regularisation is not a refinement in that regime but a requirement. Ridge picks the minimum-norm
          member of that infinite set; Lasso picks a sparse member, setting most coefficients to exactly zero and
          thereby choosing a subset of features small enough to be independent. Neither is fixing a numerical nuisance —
          they are supplying the extra criterion that the data alone cannot provide, and slide 31 is the proof that the
          data alone genuinely cannot provide it. It also explains why a perfect training score on a wide dataset is
          evidence of nothing at all.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  span: (
    <>
      <Para>Slide 32 poses four questions, and the next few slides answer them:</Para>
      <List
        items={[
          <>Does there exist a set of vectors in a vector space which “span” the entire space?</>,
          <>Meaning: any vector v ∈ 𝒱 can be generated as a linear combination of the vectors in question.</>,
          <>Is such a set unique to the vector space?</>,
          <>Are all sets capable of generating all vectors in a vector space of the same size?</>,
        ]}
      />
      <Para>
        Slide 33 gives the names. Consider a vector space 𝒱 = (𝒱, +, ·) and a set of vectors 𝒜 = {'{'}x₁, x₂, … xₖ{'}'}{' '}
        ⊆ 𝒱.
      </Para>
      <List
        items={[
          <>
            If every vector v ∈ 𝒱 can be expressed as a linear combination of x₁, x₂, … xₖ, then 𝒜 is called a{' '}
            <strong>generating set</strong> of 𝒱.
          </>,
          <>
            The set of all linear combinations of the vectors in 𝒜 is known as the <strong>span</strong> of 𝒜.
          </>,
          <>
            If 𝒜 spans the vector space 𝒱 we write <strong>𝒱 = span[𝒜]</strong>.
          </>,
        ]}
      />
      <Para>
        The two words are two sides of one thing. The span is the set you can reach; a generating set is a set whose
        span is everything. Keep them apart in an exam: span[𝒜] is always defined, for any 𝒜 at all, but 𝒜 is only a
        generating set of 𝒱 when that span happens to be the whole of 𝒱.
      </Para>
      <Para>
        Slide 34 adds the last piece. A generating set 𝒜 of 𝒱 is called <strong>minimal</strong> if there is no smaller
        set 𝒜̃ ⊂ 𝒜 ⊆ 𝒱 that spans 𝒱. And then the definition the lecture has been building to: every{' '}
        <strong>linearly independent generating set</strong> of 𝒱 is minimal and is called a <strong>basis</strong> of
        𝒱.
      </Para>
      <Para>
        Drag the two generators below. Line them up and watch the span collapse from the plane to a line; add a third
        generator built from the other two and watch it stay a generating set while ceasing to be minimal.
      </Para>

      <Lab>
        <SpanLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'span[𝒜]',
            def: 'Every vector you can build from 𝒜 by scaling and adding. Always a subspace, whatever 𝒜 is.',
          },
          {
            term: 'generating set',
            def: 'A set whose span is the whole space. Also called a spanning set. It is allowed to be wasteful.',
          },
          {
            term: 'minimal',
            def: 'No proper subset of it still spans the space. Remove anything and you lose reach.',
          },
          {
            term: '⊂',
            say: 'is a proper subset of',
            def: 'Contained in, and strictly smaller. The deck uses ⊂ for 𝒜̃ ⊂ 𝒜 to mean 𝒜̃ is genuinely a smaller set.',
          },
          {
            term: 'basis',
            say: 'BAY-siss; plural bases, "BAY-seez"',
            def: 'A linearly independent generating set. Big enough to reach everything, small enough that nothing in it is spare.',
          },
        ]}
      />

      <Takeaway>
        Span is what you can reach. A generating set reaches everything. A basis reaches everything with nothing to
        spare — independent and generating at the same time.
      </Takeaway>

      <WhyAiml method="the column space of X, and the projection ŷ = X(XᵀX)⁻¹Xᵀy in OLS">
        <p className="mb-3">
          A linear model predicts ŷ = Xw, and as w ranges over everything, Xw ranges over exactly the span of the
          columns of X. So the set of predictions a linear model is <em>capable</em> of producing is the span of your
          features, and nothing outside it is reachable no matter how you fit. Least squares is then a geometric
          statement rather than a formula to memorise: y almost never lies in that span, so we take the closest point of
          the span to y, which is the orthogonal projection of y onto the column space.
        </p>
        <p>
          Reading it this way explains several things at once. Adding a feature that is already in the span of the
          others cannot reduce the training error by even a little, because it does not enlarge the set of reachable
          predictions — which is exactly why R² is unchanged by a duplicated column while the coefficients go haywire.
          And it says what feature engineering is for: adding x², or an interaction term, or a kernel feature, is not a
          trick, it is enlarging the span so that a target the old span could not reach becomes reachable.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  basis: (
    <>
      <Para>
        Slide 35 gives four ways of saying the same thing. The deck states them as equivalent, meaning any one of them
        can be used as the definition and the other three follow. ℬ is a basis of 𝒱 exactly when:
      </Para>
      <List
        items={[
          <>ℬ is a basis of 𝒱.</>,
          <>ℬ is a minimal generating set.</>,
          <>
            ℬ is a <strong>maximal linearly independent set</strong> of vectors in 𝒱 — adding any vector to it makes it
            a linearly dependent set.
          </>,
          <>
            Every vector x ∈ 𝒱 is a linear combination of vectors from ℬ, and every such combination is{' '}
            <strong>unique</strong>: if x = Σᵢ₌₁ᵏ λᵢbᵢ = Σᵢ₌₁ᵏ ψᵢbᵢ, then λᵢ = ψᵢ for 1 ≤ i ≤ k.
          </>,
        ]}
      />
      <Para>
        The second and third are worth reading against each other, because they pull in opposite directions and meet in
        the middle. Minimal generating set = as small as possible while still reaching everything. Maximal independent
        set = as large as possible while still having nothing spare. A basis is the point where you cannot remove
        anything without losing reach, and cannot add anything without creating redundancy.
      </Para>
      <Para>
        The fourth is the one you will use most. It says the coefficients are a genuine <strong>address</strong>: once
        you fix a basis, every vector has exactly one list of coordinates in it, so vectors and coordinate lists become
        interchangeable.
      </Para>

      <Para>
        And now the answer to slide 32’s second question. Slide 36 says plainly that a basis is <strong>not</strong>{' '}
        unique, and gives three bases of ℝ³ that look nothing like each other:
      </Para>
      <Worked title="Slide 36 — three bases of ℝ³">
        {`canonical:  (1, 0, 0)  (0, 1, 0)  (0, 0, 1)

another:    (1, 0, 0)  (1, 1, 0)  (1, 1, 1)

yet another:
            ( 0.5)     ( 1.8)     (−2.2)
            ( 0.8)     ( 0.3)     (−3.3)
            ( 0.4)     ( 0.3)     ( 1.5)`}
      </Worked>
      <Para>
        Pick each of them below and write the same vector down in all three. The vector never changes; its coordinates
        change completely. The lab also runs slide 35’s four characterisations live, so you can watch them move
        together.
      </Para>

      <Lab>
        <BasisLab />
      </Lab>

      <Para>
        Slide 37 then asks the question the other way round: is any linearly independent set a basis?{' '}
        <strong>No.</strong> The deck’s reason is that a set can be independent and still have too few vectors, and it
        gives three vectors in ℝ⁴:
      </Para>
      <Formula>(1, 2, 3, 4)ᵀ, (2, −1, 0, 2)ᵀ, (1, 1, 0, 4)ᵀ</Formula>
      <Para>
        The slide asks why this is not a basis and leaves it there. The reason is the one it has just given: these three
        are independent, but ℝ⁴ needs four vectors to be spanned, so three of them can only reach a three-dimensional
        slice of it. Independence is half of the definition; generating is the other half, and this set fails the
        second.
      </Para>
      <Beyond>
        Checked here rather than assumed: running elimination on those three vectors as columns gives three pivots, so
        they really are linearly independent — the deck’s example is doing what it claims. The failure is purely one of
        size. This is the mirror image of slide 31: too many vectors forces dependence, too few forbids spanning, and a
        basis is the exact size in between.
      </Beyond>

      <Terms
        items={[
          {
            term: 'ℬ',
            say: 'script B',
            def: 'The usual letter for a basis, to keep it apart from the matrix B whose columns are its members.',
          },
          {
            term: 'maximal',
            def: 'You cannot add to it without breaking the property. Not the same word as "maximum" — it is about being unextendable, not about being biggest.',
          },
          {
            term: 'canonical basis',
            def: 'The one with a single 1 in each vector and zeros elsewhere. Also called the standard basis, and written e₁, e₂, … eₙ.',
          },
          {
            term: 'coordinates',
            def: 'The unique list of λs that rebuilds a vector from a chosen basis. Change the basis and the coordinates change; the vector does not.',
          },
        ]}
      />

      <Takeaway>
        A basis is minimal-generating and maximal-independent at once, and it gives every vector exactly one address.
        There are endlessly many bases of the same space, and independence alone is not enough to be one.
      </Takeaway>

      <WhyAiml method="PCA’s change of basis, and the sign ambiguity of components">
        <p className="mb-3">
          Everything PCA does is a change of basis. Your data arrives in the canonical basis — one axis per raw feature
          — and PCA hands you a different orthonormal basis of the same space, ordered so the first few directions carry
          most of the variance. The data has not changed and neither has the space; only the addresses have. Uniqueness
          of coordinates, the fourth characterisation, is what makes the transform invertible and therefore lossless
          when you keep all the components.
        </p>
        <p>
          Non-uniqueness of the basis has a practical consequence that surprises people. Run PCA twice on the same data
          with different implementations and a component may come back negated: −b is just as valid a basis vector as b,
          so the sign is arbitrary and the library picks one by convention. Nothing is wrong, and a plot flipping
          vertically between runs is not a bug. The same freedom, taken further, is what factor rotation exploits in
          statistics — rotate the basis of the retained subspace to get loadings that are easier to interpret, without
          changing the subspace or the fit at all.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  dimension: (
    <>
      <Para>Slide 38 collects some properties, and they are short enough to state in full:</Para>
      <List
        items={[
          <>
            Vector spaces can be finite or infinite-dimensional, and this course considers only finite-dimensional ones.
          </>,
          <>
            In a finite-dimensional vector space 𝒱, the number of vectors in the basis is known as{' '}
            <strong>dim(𝒱)</strong>.
          </>,
          <>If 𝒰 ⊆ 𝒱, then dim(𝒰) ≤ dim(𝒱).</>,
          <>dim(𝒰) = dim(𝒱) if and only if 𝒰 = 𝒱.</>,
        ]}
      />
      <Para>
        Two of those are quietly doing a lot. That dim(𝒱) is “the number of vectors in the basis” only makes sense
        because every basis of a space has the <em>same</em> size — which is slide 32’s fourth question, answered yes.
        And the last line is a genuinely useful tool: to prove two spaces are equal, show one sits inside the other and
        count dimensions. Equal dimensions plus containment forces equality, so you never have to check membership
        element by element.
      </Para>

      <Para>
        Slide 39 then heads off the mistake everyone makes. Is the size of the basis just the number of components in
        the vector? So far it has been. But consider the space span({'{'}(0, 1)ᵀ{'}'}) — the vector has{' '}
        <strong>two</strong> components, and the basis is just <strong>one</strong> vector, because everything in that
        space is a multiple of (0, 1)ᵀ.
      </Para>

      <Lab>
        <DimensionLab />
      </Lab>

      <Para>
        Press through the four subspaces. Every vector in all of them has two components, and the dimension goes 1, 1,
        2, 0. Components are how the vector is <em>written</em>; dimension is how many numbers you need to say{' '}
        <em>which</em> vector of that subspace it is. On the deck’s example those are two and one.
      </Para>

      <Terms
        items={[
          {
            term: 'dim(𝒱)',
            say: 'the dimension of V',
            def: 'How many vectors are in a basis of 𝒱. Every basis has the same number, which is why this is well defined.',
          },
          {
            term: 'finite-dimensional',
            def: 'Some finite set of vectors spans the whole space. The alternative, infinite-dimensional, is explicitly out of scope here.',
          },
          {
            term: 'components',
            def: 'The individual numbers inside one vector. A vector in ℝ⁵ has five components regardless of which subspace it happens to lie in.',
          },
          {
            term: 'nullity',
            def: 'Not on the slides: the name for dim(null(A)). Together with rank it satisfies rank + nullity = number of columns, which is where the count of undetectable directions comes from.',
          },
        ]}
      />

      <Takeaway>
        Dimension counts basis vectors, not components. A line inside ℝ³ is one-dimensional and its vectors still carry
        three numbers each. The two only agree for the whole space.
      </Takeaway>

      <WhyAiml method="intrinsic dimension, and choosing n_components in PCA">
        <p className="mb-3">
          The gap this slide points at is the entire premise of dimensionality reduction. A dataset of 4096-pixel face
          images has 4096 components per sample, but the samples do not fill ℝ⁴⁰⁹⁶ — they cluster near a much
          lower-dimensional set, because faces vary in a few dozen meaningful ways, not four thousand. The number of
          components is a fact about the file format; the dimension is a fact about the data. Choosing{' '}
          <code>n_components</code> in PCA is an estimate of the second, usually by looking at where the
          explained-variance curve flattens.
        </p>
        <p>
          It also takes some of the sting out of the curse of dimensionality. The pessimistic results about distances
          becoming meaningless in high dimensions are about data genuinely spread through ℝᵈ; data lying near a
          low-dimensional subspace is nowhere near as badly behaved, which is why nearest-neighbour methods still work
          on image and text embeddings with hundreds of components. Slide 38’s dim(𝒰) ≤ dim(𝒱) is the formal statement
          of the good news: the subspace your data lives in can only ever be smaller than the space you stored it in.
        </p>
      </WhyAiml>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  findbasis: (
    <>
      <Para>
        Slide 40 turns the whole lecture into a recipe. A basis of a subspace 𝒰 = span(x₁, …, xₘ) ⊆ ℝⁿ is found in three
        steps:
      </Para>
      <List
        items={[
          <>Write the spanning vectors as the columns of a matrix A.</>,
          <>Determine the row-echelon form of A.</>,
          <>
            The spanning vectors associated with the <strong>pivot columns</strong> are a basis of 𝒰.
          </>,
        ]}
      />
      <Para>
        Every piece of that has been earned. Columns because slide 18 said so; row-echelon form because elimination does
        not change which combinations of columns vanish; pivot columns because slide 18 said the pivot columns are the
        independent ones — and independent plus spanning is exactly slide 34’s definition of a basis.
      </Para>
      <Para>
        Read step 3 once more, because it is easy to get subtly wrong. The basis is made of the{' '}
        <strong>original spanning vectors</strong> sitting at the pivot positions, not the columns of the echelon form.
        The echelon form is only there to tell you <em>which</em> ones to keep.
      </Para>

      <Para>Slide 41 sets the example, and the deck ends there. 𝒰 ⊆ ℝ⁵ is spanned by</Para>
      <Worked title="Slide 41">
        {`x₁ = ( 1,  2, −1, −1, −1)ᵀ
x₂ = ( 2, −1,  1,  2, −2)ᵀ
x₃ = ( 3, −4,  3,  5, −3)ᵀ
x₄ = (−1,  8, −5, −6,  1)ᵀ

"We would like to check if the vectors x₁, x₂, x₃, x₄
 constitute a basis for the subspace 𝒰. We therefore need
 to check whether the given vectors are linearly
 independent or not."

— and the deck stops, with no answer printed.`}
      </Worked>
      <Para>
        So work it. Step through the recipe below: the elimination runs in exact fractions on every render, and the
        redundant vector is rebuilt from the ones that are kept and compared component by component.
      </Para>

      <Lab>
        <FindBasisLab />
      </Lab>

      <Para>
        <strong>The answer is no.</strong> Elimination gives rank 3, with pivots in columns 1, 2 and 4. So the four
        vectors are linearly dependent and do not form a basis; {'{'}x₁, x₂, x₄{'}'} is a basis of 𝒰, and dim 𝒰 = 3. The
        redundant one is x₃, and the reduced form gives its recipe exactly:
      </Para>
      <Worked title="The check, done rather than claimed">
        {`Reduced row-echelon form of A:

        ⎡ 1  0  −1  0 ⎤
        ⎢ 0  1   2  0 ⎥
        ⎢ 0  0   0  1 ⎥
        ⎢ 0  0   0  0 ⎥
        ⎣ 0  0   0  0 ⎦

Column 3 has no pivot, and it reads:  x₃ = −x₁ + 2x₂

Substitute back, component by component:

  −x₁  = (−1, −2,  1,  1,  1)
  2x₂  = ( 4, −2,  2,  4, −4)
  sum  = ( 3, −4,  3,  5, −3)

  x₃   = ( 3, −4,  3,  5, −3)     ✓ identical

So x₃ carries nothing x₁ and x₂ do not already carry.
Dropping it loses no reach: span(x₁,x₂,x₃,x₄) = span(x₁,x₂,x₄).`}
      </Worked>
      <Para>
        This answer is not on the slides. It was worked out here, and the substitution above is the check — all five
        components agree exactly, with no rounding anywhere, because the lab does the arithmetic in fractions.
      </Para>
      <Beyond>
        One caution about the wording, since an examiner may probe it. {'{'}x₁, x₂, x₄{'}'} is <em>a</em> basis of 𝒰,
        not <em>the</em> basis. Elimination handed pivots to those three because it scans left to right, not because
        they are special: {'{'}x₁, x₃, x₄{'}'} is a perfectly good basis too, since x₂ can be recovered from x₁ and x₃.
        What is not a matter of choice is the number three. Every basis of 𝒰 has exactly three members, which is what
        dim 𝒰 = 3 means.
      </Beyond>

      <Takeaway>
        Columns, eliminate, keep the pivot columns — and keep the <em>original</em> vectors at those positions. For the
        deck’s last example the answer is that the four vectors are not a basis: rank is 3, x₃ = −x₁ + 2x₂, and dim 𝒰 =
        3.
      </Takeaway>

      <WhyAiml method="rank-revealing QR for feature selection, and sklearn’s VarianceThreshold as its cheap cousin">
        <p className="mb-3">
          This three-step recipe is a feature selection algorithm. Point it at a design matrix and it returns a maximal
          set of columns carrying independent information, together with the exact recipe for every column it discarded.
          Numerically the job is done by QR with column pivoting rather than by hand elimination, precisely because that
          variant is built to choose pivots in an order that is stable in floating point, but the output is the same
          thing: a subset of your original features that spans everything the full set spans.
        </p>
        <p>
          What makes it worth reaching for over a correlation heat map is that it finds dependencies no pairwise check
          can see. Here x₃ is not proportional to x₁, nor to x₂ — the correlation between any two of these vectors is
          nothing remarkable — and yet x₃ is exactly −x₁ + 2x₂. A three-way dependency is invisible to pairwise
          correlations and completely obvious to elimination. That is the practical lesson to take out of this lecture:
          collinearity is a statement about the rank of the whole matrix, not about pairs of columns, and only a rank
          computation will find it.
        </p>
      </WhyAiml>
    </>
  ),
}
