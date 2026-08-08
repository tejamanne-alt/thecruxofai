'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene, shows how the material
 * hangs off the other courses, and then hands you to the parts without
 * repeating them.
 */
export function Dl1Overview() {
  const parts = partsOf('dl1')

  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Chapter"
        title="Session 1 — Fundamentals of Neural Networks"
        intro="The first session of the DNN course, and two sessions in one. The first half is framing: what deep learning is, why it happened when it did, and the four components every deep learning problem has. The second half is the perceptron — one neuron, worked by hand on logic gates, then trained by a rule, then broken by XOR and fixed with a hidden layer."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            A perceptron is a committee of one. Each input sends in an opinion, each opinion is weighted by how much
            this member trusts that source, the weighted opinions are added up, and if the total clears zero the answer
            is yes. That is the entire machine — and every network in the remaining nine modules of this course is a
            room full of them.
          </>,
          <>
            The whole session turns on what one such committee can and cannot decide. It can do AND, OR, NAND and NOR,
            and the deck works each of them out by hand. It cannot do XOR, and slide 79 says so. The fix on the last
            slide is not a cleverer committee — it is two of them reporting to a third, which is where the word{' '}
            <strong>deep</strong> comes from and where module 2 picks up.
          </>,
        ]}
        mappings={[
          {
            title: 'z = Σ wᵢxᵢ',
            body: 'The weighted sum. It is the dot product from Lecture 0b, so its sign tells you which side of a plane you are on — which is all a perceptron ever reports.',
          },
          {
            title: 'Four components',
            body: 'Data, model, objective, algorithm. Slide 30, and the checklist every later module hangs off. Take one away and there is no learning problem left.',
          },
          {
            title: 'XOR',
            body: 'Four points no straight line can split, because both diagonals of the square share a midpoint. Two lines can, which is what a hidden layer buys.',
          },
        ]}
        footnote="Everything on these pages is the deck's, including all thirteen points of the separable example, the three logic gates it solves, its training trace and its XOR network. Three places where the slides contradict themselves — the marks adding to 105%, the strict inequality on the NOT gate, and the brain arithmetic giving 1000 where the slide says 100 — are flagged on their own pages with both readings shown and neither presented as the answer. The two exercises the deck sets and does not answer are worked out here and checked against every row."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, a note on what the idea is for in real machine
        learning, and links to the pages in the other courses it is built on.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/dl1/${p.id}`}
            className="flex h-full flex-col gap-1.5 rounded-lg border border-zinc-950/10 bg-white p-4 hover:border-zinc-950/25 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2">
              <span
                className="grid size-5 shrink-0 place-items-center rounded-md text-[11px] font-semibold"
                style={{ background: 'var(--acc-12)', color: 'var(--acc)' }}
              >
                {i + 1}
              </span>
              {p.slides && <span className="text-[10.5px] text-zinc-400">{p.slides}</span>}
            </div>
            <span className="text-[14px] font-semibold text-zinc-950">{p.title}</span>
            <span className="text-[12.5px]/[1.6] text-zinc-600">{p.teaser}</span>
          </Link>
        ))}
      </div>

      <ConnectionMap topic="dl1" />

      <Explainers
        plain="Deep learning is machine learning done with neural networks that have several layers, each one turning the representation below it into a more meaningful one. The number of contributing layers is the depth, and slide 12 draws the line for the word 'deep' at three. Every deep learning problem has four parts: data to learn from, a model to transform it, an objective function scoring how badly the model is doing, and an algorithm to adjust the parameters — in deep learning, almost always gradient descent. The second half of the session is the unit itself. A perceptron multiplies each input by a weight, adds them up, and outputs +1 if the total is above zero and −1 otherwise. That is a hyperplane cutting the space in two, so it can represent any function whose classes a single straight cut separates: AND, OR, NAND, NOR. It cannot represent XOR. The perceptron learning rule adds η(t − o)x to each weight whenever it makes a mistake, and converges only when the data is linearly separable. The fix for XOR is a hidden layer, and the three units in it turn out to be OR, NAND and AND."
        breaks="Three things on the slides do not hold together, and each is flagged on its own page: the evaluation weights add to 105% until best-of-two drops a quiz; the NOT gate's second condition is printed as a strict inequality but the deck's own answer makes it an equality, so it should be ≤; and the brain arithmetic on slide 45 divides 1 second by 1 millisecond and reports 100 rather than 1000. Two more traps are the deck's own material used carelessly: slides 59 and 62 put ±1-encoded weights next to a 0/1 truth table, and the XOR network on slide 80 uses a different convention again — 0/1 outputs firing on ≥ threshold — from every gate before it. Say which encoding you are using before you answer."
      >
        <MathBlock
          intro="Six lines carry this whole session. The first four are the definition of the unit; the last two are how it learns and when that is guaranteed to work."
          formulas={[
            {
              formula: 'z = Σᵢ wᵢ xᵢ ,  x₀ = 1',
              reading:
                'The weighted sum, over i = 0, 1, 2. x₀ is a constant 1 so that the threshold can be carried as an ordinary weight w₀.',
            },
            {
              formula: 'h = +1 if z > 0 ; h = −1 if z ≤ 0',
              reading:
                'The activation. Note the second line takes ≤, so a sum of exactly zero gives −1 — which is what makes the NOT gate answer work.',
            },
            {
              formula: 'w · x + b = 0',
              reading:
                'The decision boundary: a hyperplane, one dimension short of the space. w is the normal to it, not a point on it.',
            },
            {
              formula: 'scaling w leaves the boundary fixed',
              reading:
                'w · x + b = 0 and 2(w · x + b) = 0 have the same solutions, which is why the trained answer can be twice the hand answer.',
            },
            {
              formula: 'wᵢ ← wᵢ + Δwᵢ ,  Δwᵢ = η(t − o)xᵢ',
              reading:
                'The perceptron learning rule. Zero when the answer is right, so it learns only from mistakes. η is the learning rate.',
            },
            {
              formula: 'converges if linearly separable and η small',
              reading:
                'Both conditions are needed. On data that is not separable the rule does not fail — it cycles forever without settling.',
            },
            {
              formula: 'AND (−1, 2, 2) · OR (2, 2, 2)',
              reading: 'The deck’s own answers, in the ±1 encoding. NOR is (−2, −2, −2) and NAND is (1, −2, −2).',
            },
            {
              formula: 'XOR = OR and NAND',
              reading:
                'The hidden layer of slide 80, read off. n₁ is OR, n₂ is NAND, n₃ is AND — three gates you already solved.',
            },
          ]}
          legend={[
            { sym: 'z', name: 'The hypothesis', note: 'The weighted sum, before any decision.', val: 'part 15' },
            {
              sym: 'h, ŷ, o',
              name: 'The output',
              note: 'Three names for the same thing in this deck.',
              val: 'part 15',
            },
            { sym: 'w₀', name: 'The bias', note: 'Weight on the constant input. Slides the boundary.', val: 'part 14' },
            {
              sym: 'x₀',
              name: 'The constant input',
              note: 'Always 1, so the threshold becomes a weight.',
              val: 'part 14',
            },
            { sym: 't', name: 'The target', note: 'The right answer, written c(x) on slide 66.', val: 'part 19' },
            { sym: 'η', name: 'Learning rate', note: 'Say “eta”. Small, e.g. 0.1, and often decayed.', val: 'part 19' },
            {
              sym: 'Δwᵢ',
              name: 'The update',
              note: 'Say “delta w”. How far weight i moves this step.',
              val: 'part 19',
            },
            {
              sym: '‖w‖',
              name: 'Norm of w',
              note: 'Its length. Changes confidence, not the boundary.',
              val: 'part 21',
            },
            { sym: 'm', name: 'Examples', note: 'Rows of the data matrix.', val: 'part 8' },
            {
              sym: 'n',
              name: 'Dimensionality',
              note: 'Features per example. Constant, or text breaks it.',
              val: 'part 8',
            },
            {
              sym: 'D = {X, t}',
              name: 'The dataset',
              note: 'Features block and label column, slide 31.',
              val: 'part 8',
            },
            { sym: 'depth', name: 'Layers that count', note: 'Three or more earns the word “deep”.', val: 'part 2' },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'A neuron is a dot product with a decision on the end',
            how: 'nn.Linear(3, 1) holds exactly the weights on slide 49. Everything about the dot product from Lecture 0b — sign, angle, orthogonality — applies to it unchanged.',
          },
          {
            what: 'The four components are the four objects in a training script',
            how: 'loader, model, criterion, optimizer. Naming which of the four a bug is in halves the search, and a wrong objective is the failure that trains perfectly to the wrong thing.',
          },
          {
            what: 'Squared error and error rate can rank two models in opposite orders',
            how: 'nn.MSELoss against nn.CrossEntropyLoss is the same choice in code. Error rate has zero gradient everywhere, which is why it is reported and never optimised.',
          },
          {
            what: 'The step function is why sigmoid and ReLU exist',
            how: 'sign has no usable derivative, so loss.backward() through it gives nothing. The perceptron rule dodges that by never differentiating — which stops working the moment there is a hidden unit.',
          },
          {
            what: 'The bias is not optional',
            how: 'Without w₀ every boundary passes through the origin, and even the NOT gate becomes unlearnable. That is why nn.Linear defaults to bias=True.',
          },
          {
            what: 'Two linear layers with nothing between them are one linear layer',
            how: 'W₂(W₁x + b₁) + b₂ = (W₂W₁)x + constant. A missing activation is a silent bug that trains, plateaus and never explains itself — and XOR is the four-point test that catches it.',
          },
          {
            what: 'Order matters when you update one example at a time',
            how: 'The trace on slide 69 is online SGD. The same sensitivity is why DataLoader takes shuffle=True, and why leaving it off on class-sorted data quietly wrecks training.',
          },
          {
            what: '“Can fail to converge” means never stops, not stops badly',
            how: 'On non-separable data the perceptron rule cycles forever without announcing anything. Knowing the failure mode is how you recognise it in a run that simply never settles.',
          },
        ]}
      />
    </div>
  )
}
