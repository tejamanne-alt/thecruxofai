'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

export function Dl2Overview() {
  const parts = partsOf('dl2')

  return (
    <div>
      <SessionHeader
        eyebrow="Deep Neural Networks · Chapter"
        title="Session 2 — The perceptron"
        intro="Module 2, and half of it is session 1 again. The half that is not rewrites the same unit in the notation the rest of the course uses — a bias on its own line, a general activation f, and gates in 0 and 1 rather than −1 and +1. Those changes are small to read and large to get wrong, so this chapter puts the two sessions side by side and keeps score."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine being handed two recipes for the same cake by two different cooks. Most of the steps match. But one
            measures in grams and the other in cups, and one says “bake until the top is firm” where the other says
            “bake for forty minutes”. Follow either one carefully and you get a cake. Take a step from each and you get
            a mess.
          </>,
          <>
            That is this session against the last one. The unit is the same unit; the notation, the encoding and the
            firing rule all moved. Four times across the two decks the perceptron is defined, with four different
            answers to what happens when the weighted sum is exactly zero — and every worked answer in both sessions
            lands on exactly zero at some point.
          </>,
        ]}
        mappings={[
          {
            title: 'z = Σ wᵢxᵢ + b',
            body: 'The bias written outside the sum, not hidden as w₀ inside it. Same arithmetic, and it is what every library actually does.',
          },
          {
            title: 'ŷ = f(z)',
            body: 'The activation named and left open. Choosing f is what turns one unit into a perceptron, a linear regression, or a hidden unit.',
          },
          {
            title: '0 and 1, firing at ≥ 0',
            body: 'This session’s gate encoding. AND becomes (−1, 0.75, 0.75) — and session 1’s AND answer is this session’s OR.',
          },
        ]}
        footnote="Everything here is the deck's, including both gate answers and the full NOT-gate training trace. Four places where the slides do not hold together are flagged on their own pages with every reading shown and none chosen: the brain arithmetic giving 1000 where the slide says 100, the perceptron dated 1958 against session 1's 1957, the algorithm slide writing sign() over a 0/1 output, and — the sharpest — page 33 defining ŷ = 1 at h ≥ 0 while page 35 computes sign(0) = −1 and prints the answer that follows from it. The two exercises the deck leaves open are worked out and checked against every row."
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
            href={`/session/dl2/${p.id}`}
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

      <ConnectionMap topic="dl2" />

      <Explainers
        plain="A neuron computes z = Σᵢ₌₁ⁿ wᵢxᵢ + b and then applies an activation function f to get ŷ. Writing the bias outside the sum and leaving f open is what lets the same unit become a perceptron, a linear regression or a hidden unit later. The perceptron is the choice of f that outputs 1 when z ≥ 0 and 0 otherwise. Its weights can be found by hand — turn each row of a truth table into an inequality and find a point satisfying all of them — giving AND as (−1, 0.75, 0.75) and OR as (−1, 2, 2) in this encoding. Or they can be learnt: start random, take one example at a time, and whenever ŷ differs from t add η(t − ŷ)xᵢ to each weight and η(t − ŷ) to the bias. That converges in finite steps if and only if the data is linearly separable, which means an (n − 1)-dimensional hyperplane splits the classes — and if one such hyperplane exists then infinitely many do. XOR has no such hyperplane, so a single perceptron cannot represent it."
        breaks="The output convention. Across sessions 1 and 2 the perceptron is defined four times with four different tie-breaks at z = 0, and this deck contradicts itself directly: page 33 says ŷ = 1 when h ≥ 0, and page 35 computes sign(0) = −1 twice and prints the weights that follow. Both readings converge to a correct NOT gate — (−2, −2) and (2, −2) — and only the second is on the slide. Two of the deck's own step labels are also wrong, though the arithmetic beside them is right. And the gate weights do not travel: session 1's AND is this session's OR, because both the inputs and the firing rule changed underneath them."
      >
        <MathBlock
          intro="Six lines. The first two define the unit in this session's notation; the rest are what it can represent and how it is trained."
          formulas={[
            {
              formula: 'z = Σᵢ₌₁ⁿ wᵢxᵢ + b',
              reading:
                'Equation (1). The sum starts at i = 1 and the bias is added afterwards — session 1 started at i = 0 with the bias inside.',
            },
            {
              formula: 'ŷ = f(z)',
              reading: 'Equation (2). f is left unspecified, which is the point of writing it this way.',
            },
            {
              formula: 'ŷ = 1 if z ≥ 0, else 0',
              reading: 'The perceptron’s choice of f, page 21. Fires at exactly zero, and the off state is 0 not −1.',
            },
            {
              formula: 'wᵢ ← wᵢ + η(t − ŷ)xᵢ ,  b ← b + η(t − ŷ)',
              reading: 'The learning rule with the bias on its own line — which is the weight line with xᵢ set to 1.',
            },
            {
              formula: 'AND (−1, 0.75, 0.75) · OR (−1, 2, 2)',
              reading:
                'In this encoding. NOR is (1, −2, −2) and NAND is (1, −0.75, −0.75), both worked out and checked here.',
            },
            {
              formula: 'h = wᵀx',
              reading: 'Page 43. The same number as Σ wᵢxᵢ and as ⟨w, x⟩ — a row times a column is one number.',
            },
            {
              formula: 'separable ⟺ an (n − 1)-dimensional hyperplane splits the classes',
              reading: 'And if one exists, infinitely many do. The perceptron gives you no say over which you get.',
            },
            {
              formula: '14 of the 16 two-input Boolean functions',
              reading:
                'How many one perceptron can represent. The other two are XOR and XNOR — swept in the browser, not quoted.',
            },
          ]}
          legend={[
            { sym: 'z', name: 'The weighted sum', note: 'Also the pre-activation. Page 43 calls it h.', val: 'part 5' },
            { sym: 'b', name: 'The bias', note: 'Outside the sum here, w₀ inside it elsewhere.', val: 'part 4' },
            { sym: 'f(·)', name: 'Activation', note: 'Say “eff of dot”. The dot is a placeholder.', val: 'part 5' },
            { sym: 'ŷ', name: 'The output', note: 'Say “y-hat”. The model’s guess.', val: 'part 4' },
            { sym: 't', name: 'The target', note: 'The right answer from the data.', val: 'part 14' },
            { sym: 'η', name: 'Learning rate', note: 'Say “eta”. The deck sets it to 0.1.', val: 'part 14' },
            { sym: 'wᵀ', name: 'w transpose', note: 'The column laid on its side, so shapes match.', val: 'part 18' },
            { sym: 'n + 1', name: 'Parameter count', note: 'One per feature, plus the bias.', val: 'part 18' },
            {
              sym: 'sign(0)',
              name: 'The disputed tie',
              note: 'The deck says both −1 and +1, on different pages.',
              val: 'part 15',
            },
            {
              sym: '⊗',
              name: 'Synapse → weight',
              note: 'The one row of the comparison table that is a real likeness.',
              val: 'part 6',
            },
            {
              sym: 'epoch',
              name: 'One full pass',
              note: 'Convergence is a whole pass with no update.',
              val: 'part 14',
            },
            {
              sym: 'ℝⁿ',
              name: 'The example space',
              note: 'n features, so a separator has n − 1 dimensions.',
              val: 'part 17',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'The bias gets its own line for a reason',
            how: 'nn.Linear keeps weight and bias as separate tensors, because they are initialised differently and often regularised differently — weight decay is usually applied to weights and not to biases.',
          },
          {
            what: 'Leaving f open is what makes the unit reusable',
            how: 'Same nn.Linear, then ReLU for a hidden layer, identity for regression, sigmoid for a probability. Equation (2) is the interface every layer in this course plugs into.',
          },
          {
            what: 'Random initialisation is not a detail',
            how: 'Zero weights make every unit in a layer identical and keep them identical, because they all get the same gradient. One perceptron can start at zero; a layer cannot.',
          },
          {
            what: 'Convergence guaranteed, quality not guaranteed',
            how: 'The perceptron stops at the first separator it reaches. LinearSVC on the same data finds the widest-margin one, and generalises better — which is what "infinitely many" is really telling you.',
          },
          {
            what: 'On non-separable data it never stops',
            how: 'No weights are correct, so there is always a mistake to react to. That is why the algorithm needs a max-iterations line, and why logistic regression is the usual replacement.',
          },
          {
            what: 'Knowledge in the connections means no place to point',
            how: 'The dropout lab shows it directly: kill a unit and the function barely changes. That robustness and the lack of explainability are the same property, and slide 51 lists the second as a condition of use.',
          },
          {
            what: 'Fourteen of sixteen is the honest measure of one layer',
            how: 'A single hyperplane is more capable than the XOR story suggests, and still short. The gap is exactly what a hidden layer exists to close.',
          },
          {
            what: 'Write the convention down before you answer',
            how: 'Inputs, firing rule, output labels — three lines. Every contradiction on these pages is harmless to somebody who does that, and expensive to somebody who does not.',
          },
        ]}
      />
    </div>
  )
}
