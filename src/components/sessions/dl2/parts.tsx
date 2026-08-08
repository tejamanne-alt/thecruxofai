/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import { BrainStepsLab } from '@/components/charts/dl-components-lab'
import { PerceptronThresholdLab } from '@/components/charts/dl-neuron-lab'
import {
  ActivationPickLab,
  AndGate01Lab,
  AnnBuilderLab,
  BioNeuronLab,
  CompareNeuronsLab,
  ConnectionismLab,
  Exercise01Lab,
  ModuleDiffLab,
  NeuronImportanceLab,
  OrGate01Lab,
  WhenAnnLab,
} from '@/components/charts/dl2-lab'
import {
  EncodingsLab,
  NotTraceLab,
  PlaRunLab,
  SeparableCountLab,
  VectorFormLab,
  Xor01Lab,
} from '@/components/charts/dl2-train-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

function Lab({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
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

function Careful({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-amber-600/30 bg-amber-50/70 px-4 py-3">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-amber-800 uppercase">
        Careful — the slide is not quite consistent here
      </div>
      <div className="crux-prose text-[13.5px]/[1.7] text-zinc-800">{children}</div>
    </div>
  )
}

export const DL2_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  module: (
    <>
      <Para>
        This is <strong>module 2</strong> of the Deep Neural Networks course, and the first thing to know about it is
        that a good half of it is session 1 again. The brain slide is word for word the same. The properties of a neural
        network are the same four lines. The conditions for when to use one are the same five.
      </Para>
      <Para>
        That repetition is not a mistake and it is not padding. The second half of the deck reworks the same material in
        the <strong>notation the rest of the course will actually use</strong> — a bias written on its own, a general
        activation function f, and inputs that are 0 and 1 rather than −1 and +1. Where the two sessions differ, they
        differ in ways that change the answers.
      </Para>

      <Lab>
        <ModuleDiffLab />
      </Lab>

      <Para>
        Press the <strong>changed</strong> filter in the lab and read only those rows. Four topics changed, and every
        one of them is a place where quoting session 1’s answer would be marked wrong here — most sharply the gate
        weights, where session 1’s AND is this session’s OR.
      </Para>

      <Terms
        items={[
          {
            term: 'module',
            def: 'One of the ten blocks the course is divided into. This deck is module 2; session 1 was module 1.',
          },
          {
            term: 'encoding',
            def: 'How true and false are written as numbers. Session 1 uses −1 and +1; this session uses 0 and 1. Nothing about the idea changes, and every number does.',
          },
          {
            term: 'activation function',
            say: 'f, or “eff”',
            def: 'Whatever turns the weighted sum into the output. Session 1 had one; this session names it f and leaves it open, which is what lets session 3 swap in a different one.',
          },
        ]}
      />

      <WhyAiml method="reading two sources that disagree">
        <p className="mb-2">
          Working from more than one description of the same method is the normal condition of machine learning, not an
          unlucky accident of this course. The perceptron in Mitchell’s Chapter 4, in Rosenblatt’s paper, in
          scikit-learn’s <code>Perceptron</code> and in a PyTorch tutorial are four descriptions with four sets of
          conventions, and only one of them will match the exam in front of you.
        </p>
        <p>
          The habit worth building now is cheap: before writing anything, write down the encoding and the firing rule
          you are using. Every contradiction flagged on these pages — and there are several — would be harmless to
          somebody who did that, and costs marks to somebody who did not.
        </p>
      </WhyAiml>

      <Takeaway>
        Half this session repeats session 1; the other half changes the notation. The changes are where the marks are,
        and the biggest is that the gates move from ±1 to 0/1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  brain: (
    <>
      <Para>
        The deck opens where session 1 did. Humans learn, solve problems, recognise patterns, create and think — and
        they learn through <strong>association</strong>, with a pointer to associationism for the detail.
      </Para>
      <Para>Then the same five numbers, and the same argument built on them:</Para>
      <List
        items={[
          <>The brain is a mass of interconnected neurons — roughly 10¹⁰ of them.</>,
          <>Each connects to roughly 10⁴ to 10⁵ others.</>,
          <>A neuron switches in about 0.001 second.</>,
          <>A scene is recognised in about 1 second.</>,
          <>
            <strong>100 inference steps does not seem like enough. Lot of parallel computation.</strong>
          </>,
        ]}
      />

      <Lab>
        <BrainStepsLab />
      </Lab>

      <Careful>
        This is the same slide as session 1, carrying the same arithmetic problem. One second divided by one millisecond
        is 1000, and the slide says 100 — the figure of 100 comes from 0.1 second, the value used in Mitchell’s Chapter
        4. The lab does the division from whatever you set and shows both; neither is presented as the answer, because
        the slide does not settle it.
      </Careful>

      <Para>
        What matters is the shape of the argument, which survives either number. A few hundred or a few thousand
        switches <em>one after another</em> cannot account for a second of recognition. So the computation cannot be a
        long chain — it must be an enormous number of simple things happening at once.
      </Para>

      <Terms
        items={[
          {
            term: 'association',
            def: 'Learning by linking things that occur together. The deck points at associationism, the philosophical tradition the word comes from, rather than defining it.',
          },
          {
            term: 'inference step',
            def: 'One neuron switching, in this argument. Steps taken in sequence are limited by the clock; steps taken side by side are not.',
          },
          {
            term: 'parallel computation',
            def: 'Many calculations at the same time rather than one after another. The whole architecture of a layer is built to allow it.',
          },
        ]}
      />

      <WhyAiml method="batched matmul — width is free, depth is not">
        <p className="mb-2">
          Every unit in a layer reads the same inputs and none reads another’s output, so a layer can be computed in one
          shot as a matrix multiply. That is why a GPU helps: it is not faster at any single multiplication, it does
          thousands at once, which is exactly the shape of the brain’s answer to the same budget problem.
        </p>
        <p>
          Depth gets none of that. Layer two cannot start until layer one has finished, so a hundred-layer network has a
          hundred unavoidable stages forwards and a hundred back. When people say a model is slow to train despite huge
          hardware, this is usually why — and slide 45’s division is the same trade-off in biological units.
        </p>
      </WhyAiml>

      <Takeaway>
        The brain gets around a thousand sequential switches per second of thought and does far more than that in one.
        So it must be massively parallel — which is the only design principle the biology actually contributes.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  bioneuron: (
    <>
      <Para>
        Session 1 labelled eight parts of a biological neuron. This deck names four, and it names them in a much more
        useful order — the order a signal travels in.
      </Para>
      <List
        items={[
          <>
            <strong>Dendrites</strong> receive signals from other neurons.
          </>,
          <>
            <strong>Cell body (soma)</strong> processes incoming signals.
          </>,
          <>
            <strong>Axon</strong> transmits the output signal.
          </>,
          <>
            <strong>Synapses</strong> are the connection points between neurons.
          </>,
        ]}
      />
      <Para>
        Under the diagram the deck writes the direction explicitly:{' '}
        <em>electrical impulses travel from dendrites through cell body to axon terminals</em>. One way only.
      </Para>

      <Lab>
        <BioNeuronLab />
      </Lab>

      <Para>
        The reason to learn these four rather than eight is that each maps onto exactly one piece of the artificial
        neuron on the next page. Dendrites are the inputs; synapses are the weights; the soma is the sum and the
        activation; the axon is the single output.
      </Para>

      <Terms
        items={[
          {
            term: 'dendrite',
            say: 'DEN-drite',
            def: 'A branching input fibre. One neuron has many, so many signals arrive at once — which is why the artificial neuron takes a vector rather than a number.',
          },
          {
            term: 'soma',
            say: 'SOH-ma',
            def: 'The cell body. Where everything arriving is combined and the decision to fire is taken. Latin for “body”.',
          },
          {
            term: 'axon',
            say: 'AX-on',
            def: 'The single output fibre. One per neuron, which is why an artificial neuron produces one number and not several.',
          },
          {
            term: 'synapse',
            say: 'SIN-aps',
            def: 'The junction where one neuron’s axon meets another’s dendrite. Its strength can change with experience — and that is the whole of what a weight models.',
          },
          {
            term: 'myelin sheath',
            def: 'The insulating layer along the axon, drawn on the deck’s picture and not labelled in its list. It speeds the signal up and has no artificial counterpart at all.',
          },
        ]}
      />

      <Beyond>
        The mapping is not one-to-one in one place, and it is worth noticing.{' '}
        <strong>One synapse becomes one weight</strong>, but the soma becomes <em>two</em> artificial parts: the
        summation Σ and the activation f. The deck splits them because they are chosen separately — you keep the sum and
        swap the activation, which is precisely what session 3 does.
      </Beyond>

      <WhyAiml method="the synapse is the parameter, and the parameter is what you save">
        <p className="mb-2">
          When you call <code>torch.save(model.state_dict())</code>, what lands on disk is a dictionary of weight
          matrices and bias vectors — the synapses, and nothing else. The architecture is code; the learning is entirely
          in those numbers. A checkpoint file is a list of connection strengths.
        </p>
        <p>
          That is also why transfer learning works. Load somebody else’s weights into the same architecture and you have
          loaded their experience, because there is nowhere else for it to have been. Module 4’s fine-tuning is that
          observation turned into a technique.
        </p>
      </WhyAiml>

      <Takeaway>
        Dendrites in, soma decides, axon out, synapses connect. Inputs, sum-and-activation, output, weights — in that
        order.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  neuron: (
    <>
      <Para>
        A neuron is a <strong>processing element inspired by how the brain works</strong>. It does some computation, it
        is connected to other neurons, and — the sentence that matters —{' '}
        <strong>the interconnections store the knowledge it learns, as parameters</strong>.
      </Para>
      <Para>
        The deck then draws the unit twice. The first drawing has inputs x₁ … xₙ arriving at a circle N, and one output
        ŷ leaving it. The second adds the two things that make it work:
      </Para>
      <List
        items={[
          <>
            A constant input <strong>1</strong> arriving along a connection weighted <strong>b</strong>.
          </>,
          <>
            For each feature xᵢ, a weight wᵢ that <strong>shows the importance of that feature</strong>.
          </>,
          <>One numerical output ŷ.</>,
        ]}
      />

      <Lab>
        <NeuronImportanceLab />
      </Lab>

      <Careful>
        “The weight shows the importance of the feature” is true only once the features are on comparable scales. What
        actually decides the answer is the <strong>product</strong> wᵢxᵢ, not wᵢ alone. Set the weight on area to 3 in
        the lab and press <strong>Small house</strong>: the largest weight stops being the largest contribution. This is
        the reason session 3 devotes a slide to feature scaling.
      </Careful>

      <Terms
        items={[
          {
            term: 'processing element',
            def: 'The deck’s name for one unit. Deliberately neutral — it is doing arithmetic, not thinking.',
          },
          {
            term: 'parameter',
            def: 'A number the training procedure is allowed to change. The weights and the bias are the parameters; nothing else in the unit is.',
          },
          {
            term: 'b',
            say: 'the bias',
            def: 'The weight on a constant input of 1. Session 1 wrote it w₀ inside the sum; this deck writes it separately, and the two are the same number doing the same job.',
          },
          {
            term: 'ŷ',
            say: 'y-hat',
            def: 'The unit’s output — its guess. The hat is what separates it from y or t, which mean the true answer.',
          },
        ]}
      />

      <WhyAiml method="model.state_dict() and feature scaling">
        <p className="mb-2">
          Weights as importance is the basis of every “which feature mattered?” answer you will give about a linear
          model — <code>clf.coef_</code> in scikit-learn is exactly this list. It is also the basis of the most common
          wrong answer, because a coefficient on a feature measured in millions is small for reasons that have nothing
          to do with importance.
        </p>
        <p>
          The fix is to standardise before comparing: subtract the mean and divide by the standard deviation, so every
          feature is on the same footing and the coefficients become comparable. That is the same operation, and the
          same reasoning, as the z-score from the statistics course.
        </p>
      </WhyAiml>

      <Takeaway>
        One weight per feature, plus a bias on a constant input of 1. The weights are the knowledge, and the product
        wᵢxᵢ — not the weight alone — is what decides an answer.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  maths: (
    <>
      <Para>Two equations, boxed on the slide, and the whole rest of the course is written in them.</Para>
      <Worked title="The artificial neuron, in full">
        {`         n
  z  =   Σ   wᵢ xᵢ  +  b                    (1)
        i=1

              ⎛  n            ⎞
  ŷ  =  f  ⎜  Σ  wᵢ xᵢ + b ⎟  =  f(z)     (2)
              ⎝ i=1           ⎠

  Sum of the weights times their features, plus the bias.
  Then an activation function f applied to that sum.`}
      </Worked>
      <Para>
        Note where the sum starts. In session 1 it ran from <strong>i = 0</strong>, with x₀ nailed to 1 so that the bias
        could hide inside the sum as w₀. Here it runs from <strong>i = 1</strong> and the bias is added on afterwards.
        The two are the same arithmetic; the second is what libraries actually do, because the bias needs a different
        gradient treatment from the weights.
      </Para>
      <Para>
        And note that f is left unspecified. The deck does not say what it is on this slide, which is deliberate:
        choosing f is how one neuron becomes a perceptron, a linear regression, or a hidden unit of a deep network.
      </Para>

      <Lab>
        <ActivationPickLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'Σ',
            say: 'sigma',
            def: 'Add up. The letters under and over it say what to add: i = 1 at the bottom, n at the top, means add over i = 1, 2, … n.',
          },
          {
            term: 'z',
            def: 'The weighted sum plus the bias, before any activation. Session 1 called it the hypothesis; most libraries call it the pre-activation or the logit.',
          },
          {
            term: 'f(·)',
            say: 'eff of dot',
            def: 'A function with its argument left blank. The dot is a placeholder — f(·) just means “the function f, whatever you feed it”.',
          },
          {
            term: 'activation',
            def: 'The output f(z). Also, loosely, the function f itself. Both usages appear in this course, and context settles which.',
          },
        ]}
      />

      <Beyond>
        Equation (2) is why one unit can be four different models. Take f as the step and you have this session’s
        perceptron. Take it as the sign function and you have session 1’s. Take it as the identity, f(z) = z, and you
        have session 3’s linear regression. Take it as the sigmoid and you have logistic regression. Same z every time,
        and the choice of f decides what the unit is <em>for</em>.
      </Beyond>

      <WhyAiml method="nn.Linear then a separate activation module">
        <p className="mb-2">
          PyTorch splits the two equations exactly as this slide does. <code>nn.Linear(n, 1)</code> computes equation
          (1) and nothing else; the activation is a separate object you place after it, which is why{' '}
          <code>nn.Sequential(nn.Linear(4, 8), nn.ReLU())</code> has two entries for one layer. The split is not
          cosmetic — it is what lets you change f without touching the weights.
        </p>
        <p>
          The consequence that bites: forget the activation and the layers collapse. Two <code>nn.Linear</code> layers
          with nothing between them compute a single linear map, so the network has the depth of one layer no matter how
          many you stacked. It trains, it plateaus, and nothing warns you.
        </p>
      </WhyAiml>

      <Takeaway>
        z = Σᵢ₌₁ⁿ wᵢxᵢ + b, then ŷ = f(z). The bias is outside the sum here, and f is left open on purpose.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  compare: (
    <>
      <Para>
        A six-row table with biological neurons on the left and artificial ones on the right. It is worth going through
        slowly, because it is doing two jobs at once: some rows are claiming a likeness and some are admitting a
        difference, and the slide does not say which is which.
      </Para>

      <Lab>
        <CompareNeuronsLab />
      </Lab>

      <Worked title="The table as printed">
        {`  Biological Neuron              Artificial Neuron
  ─────────────────────────      ────────────────────────────
  Complex biochemical            Simple mathematical model
    processes
  Analog signal processing       Digital computation
  Adaptive synaptic strengths    Adjustable weights
  Parallel processing            Parallel computation possible
  Learning through experience    Learning through algorithms
  Fault tolerant                 Deterministic behavior`}
      </Worked>

      <Para>
        Only the third row is a genuine likeness, and it is the one carrying the whole analogy: in both systems,
        learning means changing connection strengths and nothing else. Everything above and below it is the artificial
        version being simpler, cruder or differently motivated.
      </Para>

      <Careful>
        The last row does not compare like with like. <em>Fault tolerant</em> and <em>deterministic</em> are not
        opposites — one is about damage, the other about repeatability. Artificial networks are in fact fairly fault
        tolerant, which the connectionism page two on demonstrates directly. Take that row as two separate facts rather
        than as a contrast.
      </Careful>

      <Terms
        items={[
          {
            term: 'analog',
            def: 'Varying continuously, like a dial. Biological signals are spikes whose timing carries information; artificial ones are single numbers.',
          },
          {
            term: 'digital',
            def: 'Represented as discrete numbers. A weight is a floating-point number with finite precision, and that precision is itself a design choice in real systems.',
          },
          {
            term: 'fault tolerant',
            def: 'Still works when parts are damaged. Not the opposite of deterministic.',
          },
          {
            term: 'deterministic',
            def: 'Same input, same output, every time. Useful — it is why a trained model can be tested — and unrelated to robustness.',
          },
        ]}
      />

      <WhyAiml method="float32, float16 and quantisation">
        <p className="mb-2">
          The analog-against-digital row has a practical edge the slide does not draw. Because weights are digital, you
          get to choose how many bits each one uses — and modern deployment leans on that hard. A model trained in
          <code> float32</code> is routinely run in <code>float16</code> or even 8-bit integers, halving or quartering
          the memory for a small loss of accuracy.
        </p>
        <p>
          That only works because of the fault tolerance the last row is trying to talk about: rounding every weight is
          damage spread thinly across the whole network, and a distributed representation absorbs it. The two rows the
          slide keeps furthest apart are in fact the same fact.
        </p>
      </WhyAiml>

      <Takeaway>
        One row is a real likeness — adaptive synapses become adjustable weights. The rest are simplifications or plain
        differences, and the last row is not even a contrast.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  ann: (
    <>
      <Para>
        Put many of these units together and you have an <strong>artificial neural network</strong>. The deck’s
        definition is five lines, and each adds something:
      </Para>
      <List
        items={[
          <>A computational model inspired by the human brain.</>,
          <>Interconnected neurons process information.</>,
          <>
            Interconnection can be <strong>forward, recursive or self loop</strong>.
          </>,
          <>Learn patterns from data through training.</>,
          <>Capable of approximating complex functions.</>,
        ]}
      />
      <Para>
        The picture beside it has an input layer, three hidden layers and an output layer, with every unit in one layer
        joined to every unit in the next. That pattern — everything to everything — is called{' '}
        <strong>fully connected</strong>, and it is the default this whole course starts from.
      </Para>

      <Lab>
        <AnnBuilderLab />
      </Lab>

      <Para>
        Move the sliders and watch the parameter count. Six inputs, three hidden layers of five, two outputs is 107
        parameters for a network you can still see. Twenty inputs, six hidden layers of sixteen and ten outputs is over
        1,500 — and a real image model has millions. This is why the picture stops being useful almost immediately.
      </Para>

      <Terms
        items={[
          {
            term: 'layer',
            def: 'A group of units that all read the same inputs and none of which reads another’s output. That independence is what lets a layer be one matrix multiply.',
          },
          {
            term: 'hidden layer',
            def: 'Any layer that is neither the input nor the output. Hidden because nothing in the data says what it should produce.',
          },
          {
            term: 'fully connected',
            def: 'Every unit joined to every unit in the next layer. Also called dense — nn.Linear in PyTorch, Dense in Keras.',
          },
          {
            term: 'forward connection',
            def: 'Output goes to a later layer. A network with only these is called feed-forward, and is the whole of modules 2 and 3.',
          },
          {
            term: 'recursive connection',
            def: 'Output goes back to an earlier layer. This is what makes a recurrent network, and it is module 6.',
          },
          {
            term: 'self loop',
            def: 'A unit feeding its own output back into itself. The simplest form of memory a network can have.',
          },
        ]}
      />

      <Beyond>
        The parameter count has a rule worth memorising, because it is a standard exam question. A layer of <em>k</em>{' '}
        units reading <em>m</em> inputs holds <strong>k × (m + 1)</strong> parameters: one weight per connection, plus
        one bias per unit. Add those up over the layers and you have the whole model. The lab prints the sum term by
        term so you can check yours against it.
      </Beyond>

      <WhyAiml method="sum(p.numel() for p in model.parameters())">
        <p className="mb-2">
          That one line is how everybody reports a model’s size, and it computes exactly the sum in the lab. It matters
          because parameters are the first thing that runs out: each one needs memory for the value, memory for its
          gradient, and — with an optimiser like Adam — memory for two more running averages besides.
        </p>
        <p>
          It also sets the honest expectation about data. A model with more parameters than you have training examples
          can memorise the training set outright, which is the overfitting from session 1 in its purest form. Counting
          parameters before training is the cheapest sanity check there is.
        </p>
      </WhyAiml>

      <Takeaway>
        Layers of units, fully connected, and three kinds of connection — forward, recursive, self-looping. Each layer
        holds units × (inputs + 1) parameters, and the total grows faster than the picture can show.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  whenann: (
    <>
      <Para>
        Two slides that are the same as session 1’s, and worth doing properly this time. First, the four properties of
        an artificial neural network:
      </Para>
      <List
        items={[
          <>Many neuron-like threshold switching units.</>,
          <>Many weighted interconnections among units.</>,
          <>Highly parallel, distributed process.</>,
          <>Emphasis on tuning parameters or weights automatically.</>,
        ]}
      />
      <Para>Then the five conditions for reaching for one at all.</Para>

      <Lab>
        <WhenAnnLab />
      </Lab>

      <Para>
        The last condition is the one to read twice:{' '}
        <strong>human readability — explainability — of the result is unimportant</strong>. It is written as a
        requirement, not as a caveat. The deck is saying that if you need to explain the answer, this is not the method,
        and the reason is on the next page: the knowledge is spread across every connection, so there is nowhere to
        point.
      </Para>

      <Terms
        items={[
          {
            term: 'high-dimensional',
            def: 'Many features per example. A photograph has one per pixel; a spreadsheet of ten columns does not qualify.',
          },
          {
            term: 'target function',
            def: 'The true rule connecting inputs to outputs — the thing being learnt. "Its form is unknown" means nobody can write it down, which is precisely when learning is worth doing.',
          },
          {
            term: 'explainability',
            def: 'Being able to say why a particular answer was given. Sometimes a preference, sometimes a legal requirement, and never something a network offers for free.',
          },
          {
            term: 'threshold switching unit',
            def: 'The deck’s phrase for a neuron in the first property. It describes the perceptron precisely, and stops describing the units of a modern network, whose activations are smooth.',
          },
        ]}
      />

      <WhyAiml method="SHAP, LIME, and why they exist at all">
        <p className="mb-2">
          A whole research area exists because of that fifth condition. Tools like SHAP and LIME try to answer “which
          features drove this particular prediction?” after the fact, by probing the trained model rather than by
          reading it — which is an admission that reading it is not possible.
        </p>
        <p>
          The decision this settles is upstream of any of that. In credit, medicine or hiring, an explanation may be
          legally required, and a post-hoc approximation of an explanation may not satisfy the requirement. Sometimes a
          decision tree that scores two points worse is the correct engineering choice, and the deck’s fifth condition
          is where that conversation should start.
        </p>
      </WhyAiml>

      <Takeaway>
        Many simple units, many weighted connections, tuned automatically. And use one only when the input is high-
        dimensional, the rule is unknown, and nobody needs to be told why.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  connectionism: (
    <>
      <Para>
        The deck names the family the whole method belongs to. A network of processing elements, interconnected, where{' '}
        <strong>all world knowledge is stored in the connections between these elements</strong>, is a{' '}
        <strong>connectionist machine</strong> — and neural networks are connectionist machines.
      </Para>
      <Para>Then four principles, which session 1 did not have:</Para>
      <List
        items={[
          <>
            <strong>Intelligence emerges from simple processing neurons.</strong> No single unit is clever. Whatever the
            network can do is a property of the arrangement, not of any part of it.
          </>,
          <>
            <strong>Knowledge is stored in connection weights.</strong> Not in the units, not in a rule table, not
            anywhere you can look up.
          </>,
          <>
            <strong>Learning modifies connection strengths.</strong> That is the whole of learning. Nothing else in the
            network changes during training.
          </>,
          <>
            <strong>Parallel distributed processing.</strong> Many units at once, and every fact spread over many of
            them.
          </>,
        ]}
      />

      <Lab>
        <ConnectionismLab />
      </Lab>

      <Para>
        The lab is the second and fourth principles made visible. Twelve units share the job of reproducing a curve.
        Switch one off and the curve barely moves — because no unit held the answer, so no unit could lose it. Switch
        half of them off and it degrades, still gradually. Nothing anywhere breaks.
      </Para>

      <Terms
        items={[
          {
            term: 'connectionism',
            def: 'The view that intelligent behaviour comes from networks of simple units, with what is known held in the strengths of their connections.',
          },
          {
            term: 'distributed representation',
            def: 'One fact spread across many units, and one unit taking part in many facts. The opposite of a lookup table, where one slot holds one fact.',
          },
          {
            term: 'graceful degradation',
            def: 'Getting slowly worse rather than suddenly failing. The lab shows it directly, and it is the practical face of fault tolerance.',
          },
          {
            term: 'emergent',
            def: 'A property of the whole that none of the parts has. The deck’s first principle is a claim that intelligence is like this.',
          },
        ]}
      />

      <Beyond>
        The lab is also the clearest demonstration of why networks resist being read. Ask “where is the bump at x = 1
        stored?” and there is no answer: it is a little bit of unit 5, a little bit of unit 6, and a negative
        contribution from unit 7. That is not a limitation of our tools — it is what a distributed representation{' '}
        <em>is</em>, and it is exactly the trade the fifth condition on the previous page is asking you to accept.
      </Beyond>

      <WhyAiml method="nn.Dropout(p=0.5) — damage on purpose">
        <p className="mb-2">
          Dropout switches a random half of the units off on every training step, which is precisely the lab’s button.
          The reason it works is the second principle: if any unit might vanish, the network cannot afford to store
          anything in one place, so it is forced into a more distributed and more robust representation.
        </p>
        <p>
          It is one of the standard cures for overfitting in module 4, and it is the only regulariser whose mechanism is
          this easy to state: make the network survive its own units being deleted, and it stops relying on coincidences
          in the training data.
        </p>
      </WhyAiml>

      <Takeaway>
        Simple units, knowledge in the weights, learning as weight change, everything in parallel and spread out. That
        last property is why deleting a unit barely matters — and why you cannot read a network.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  perceptron: (
    <>
      <Para>
        The <strong>perceptron</strong> is the simplest form of artificial neuron, introduced by{' '}
        <strong>Rosenblatt in 1958</strong>. It is the neuron from four pages ago with one particular choice of f.
      </Para>
      <Worked title="The perceptron, as page 21 defines it">
        {`         ⎧  1    if  Σⁿᵢ₌₁ wᵢxᵢ + b  ≥  0
  ŷ  =  ⎨
         ⎩  0    otherwise

  Inputs are 0 or 1.
  Output is 1 or 0.
  The neuron fires at exactly zero, not only above it.`}
      </Worked>

      <Careful>
        Both halves of that rule differ from session 1. There, the output was <strong>+1 or −1</strong> and the neuron
        fired only when the sum was <strong>strictly greater</strong> than zero. Here it is 1 or 0, and it fires at zero
        too. Neither session is wrong; they are different conventions, and mixing them produces answers that fail on a
        row you will not notice.
      </Careful>

      <Careful>
        The date also differs. Session 1’s timeline marks the perceptron at <strong>1957</strong>; this deck says{' '}
        <strong>1958</strong>, and its own reference list gives Rosenblatt, F. (1958), “The Perceptron: A Probabilistic
        Model”. So 1958 is the paper. What 1957 refers to is not settled by either deck, and no attempt is made here to
        settle it — if a question asks, give the year and the source you are quoting.
      </Careful>

      <Lab>
        <PerceptronThresholdLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'perceptron',
            def: 'A single artificial neuron whose activation is a threshold. The name is Rosenblatt’s, and it originally referred to a physical machine as well as the algorithm.',
          },
          {
            term: 'threshold',
            def: 'The value the sum must reach. Written into the rule as zero, because the bias b absorbs any other threshold you might have wanted.',
          },
          {
            term: '≥',
            say: 'greater than or equal to',
            def: 'Reaches it or beats it. The difference between ≥ and > is one point of the input space, and both sessions of this course pick differently.',
          },
          {
            term: 'binary classifier',
            def: 'A model that sorts inputs into exactly two groups. That is all a perceptron is, whatever the two groups are called.',
          },
        ]}
      />

      <WhyAiml method="sklearn.linear_model.Perceptron">
        <p className="mb-2">
          This exact model is still shipped: <code>Perceptron()</code> in scikit-learn fits w and b by the rule two
          pages on, and <code>clf.coef_</code> and <code>clf.intercept_</code> are the numbers on this slide. It is
          fast, it needs no tuning, and on separable data it is guaranteed to work — which is a rare guarantee.
        </p>
        <p>
          It is rarely the right choice, though, and knowing why is the useful part. It gives no probability, only a
          side; it stops at the first separator rather than the best one; and on non-separable data it never settles at
          all. Every one of those three is fixed by a method later in this programme, and the perceptron is where you
          learn to name the problem.
        </p>
      </WhyAiml>

      <Takeaway>
        ŷ = 1 when Σwᵢxᵢ + b ≥ 0, and 0 otherwise. Inputs 0/1, output 0/1, and it fires at exactly zero — all three
        different from session 1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  andgate: (
    <>
      <Para>
        The deck sets up the gate question in one line:{' '}
        <strong>any linear decision can be represented by a Boolean equation</strong>, so the way to find out what a
        perceptron can do is to test it against the logic gates one at a time.
      </Para>
      <Para>
        AND first, with its truth table in plain 0 and 1. The method is the same as session 1’s — turn each row into a
        condition on the weights — but every number comes out different, because the inputs and the firing rule are
        different.
      </Para>
      <Worked title="AND, from the deck">
        {`  x₁  x₂   t          condition on the weights
  ──────────────────────────────────────────────
   0   0   0     w₀ + 0 + 0      <  0
   0   1   0     w₀ + 0 + w₂     <  0
   1   0   0     w₀ + w₁ + 0     <  0
   1   1   1     w₀ + w₁ + w₂    ≥  0

  Perceptron equation:  ŷ = w₀x₀ + w₁x₁ + w₂x₂,  x₀ = 1

  One solution:   w₀ = −1
                  w₁ = 0.75
                  w₂ = 0.75

  Check row 1:  −1                    = −1.00  < 0  ✓
  Check row 2:  −1 + 0.75             = −0.25  < 0  ✓
  Check row 3:  −1 + 0.75             = −0.25  < 0  ✓
  Check row 4:  −1 + 0.75 + 0.75      =  0.50  ≥ 0  ✓`}
      </Worked>
      <Para>
        Because the three zero rows only involve w₀ and one weight at a time, the conditions are easy to read off: each
        single weight has to be smaller than −w₀, and the two together have to be at least −w₀. With w₀ = −1 that means
        each weight below 1, and the pair at least 1 — and 0.75 satisfies both with room to spare.
      </Para>

      <Lab>
        <AndGate01Lab />
      </Lab>

      <Careful>
        Press <strong>Session 1’s AND answer</strong> in the lab. Those weights — (−1, 2, 2) — are AND in the ±1
        encoding, and here they get row 2 wrong. Worse, in <em>this</em> encoding they are the deck’s answer for{' '}
        <strong>OR</strong>. The same three numbers name two different gates depending on a convention nobody writes
        next to them.
      </Careful>

      <Terms
        items={[
          {
            term: 'Boolean equation',
            def: 'An expression built from AND, OR and NOT that is true or false. The deck’s claim is that any straight-line decision on 0/1 inputs can be written as one.',
          },
          {
            term: 'x₀',
            def: 'The constant input 1 that carries w₀. The deck writes ŷ = w₀x₀ + w₁x₁ + w₂x₂ here, so w₀ and b are the same number under two names.',
          },
          {
            term: 'condition',
            def: 'An inequality the weights must satisfy. Four rows give four conditions, and any point satisfying all four is a correct answer.',
          },
        ]}
      />

      <Beyond>
        There is nothing special about 0.75. Every w₁ = w₂ = c with <strong>0.5 ≤ c {'<'} 1</strong> works alongside w₀
        = −1: the pair must reach 1 so c ≥ 0.5, and each alone must stay below 1 so c {'<'} 1. The deck picked a value
        in the middle of that interval. Drag the sliders in the lab and watch the read-out stay at 4 of 4 across the
        whole range — the conditions are inequalities, so the answers form a region, not a point.
      </Beyond>

      <WhyAiml method="the bias as a threshold you can read">
        <p className="mb-2">
          With equal weights on 0/1 inputs, the neuron is counting: z = c × (number of inputs that are on) + w₀. So the
          bias sets <em>how many</em> have to be on before it fires, and −w₀/c is literally that count. AND needs two of
          two, OR needs one of two, and the same unit does both with nothing changed but the bias.
        </p>
        <p>
          This is the cleanest case of something true generally — the bias is a threshold in disguise — and it is why a
          layer that has had its biases accidentally zeroed can only express decisions through the origin. In a
          classifier over sparse 0/1 features, which is what a bag-of-words model is, the bias is doing exactly this
          counting job.
        </p>
      </WhyAiml>

      <Takeaway>
        AND is w₀ = −1, w₁ = w₂ = 0.75 in this encoding — and any c between 0.5 and 1 would do. Session 1’s answer is a
        different gate here.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  orgate: (
    <>
      <Para>
        OR next, and only one row of the table changes character: now three rows want the neuron to fire and only (0, 0)
        does not.
      </Para>
      <Worked title="OR, from the deck">
        {`  x₁  x₂   t          condition on the weights
  ──────────────────────────────────────────────
   0   0   0     w₀ + 0 + 0      <  0
   0   1   1     w₀ + 0 + w₂     ≥  0
   1   0   1     w₀ + w₁ + 0     ≥  0
   1   1   1     w₀ + w₁ + w₂    ≥  0

  One solution:   w₀ = −1
                  w₁ = 2
                  w₂ = 2

  Check row 1:  −1              = −1  < 0  ✓
  Check row 2:  −1 + 2          =  1  ≥ 0  ✓
  Check row 3:  −1 + 2          =  1  ≥ 0  ✓
  Check row 4:  −1 + 2 + 2      =  3  ≥ 0  ✓`}
      </Worked>
      <Para>
        The bias is the same as AND’s. What changed is the size of the weights: for AND each one alone had to stay below
        1, and for OR each one alone has to reach 1. Everything else about the unit is untouched.
      </Para>

      <Lab>
        <OrGate01Lab />
      </Lab>

      <Para>
        The lab lets you switch between OR and AND with the same sliders. Set w₀ = −1 and drag both weights together
        from 0.75 up to 2, watching the truth table: at 0.75 you have AND, and somewhere on the way to 2 the (0, 1) and
        (1, 0) rows change hands and you have OR. The gate is a property of one number.
      </Para>

      <Terms
        items={[
          {
            term: 'inclusive or',
            def: 'True when at least one input is true, including when both are. That is what OR means here — the exclusive version, true when exactly one is, is XOR and comes later.',
          },
          {
            term: 'decision boundary',
            def: 'The line where z is exactly zero. For OR with these weights it is 2x₁ + 2x₂ = 1, that is x₁ + x₂ = 0.5, which cuts (0, 0) off from the other three corners.',
          },
        ]}
      />

      <Beyond>
        Both gates have the same shape of answer: one corner of the square cut off from the other three. AND isolates
        (1, 1) and OR isolates (0, 0). A straight line can always separate one point from three, which is the real
        reason both are easy — and it is also the reason to expect trouble the moment a gate needs <em>two</em> corners
        separated from two.
      </Beyond>

      <WhyAiml method="one boundary per output unit">
        <p className="mb-2">
          A layer of k output units is k of these boundaries drawn over the same input space, each with its own row of
          weights and its own bias. That is all a multi-class classifier is: <code>nn.Linear(d, k)</code> gives k
          scores, and <code>argmax</code> picks the largest. Nothing about any one unit is different from this page.
        </p>
        <p>
          It also explains a failure worth recognising. If two classes are not separable from the rest by a single
          hyperplane each, no amount of training the last layer helps — the fix has to come from the layers before it,
          which are there to bend the space until they are. That division of labour is the whole design of a deep
          network.
        </p>
      </WhyAiml>

      <Takeaway>
        OR is w₀ = −1, w₁ = w₂ = 2. Same bias as AND, larger weights — one number decides which gate you have.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  exercise: (
    <>
      <Para>
        The deck sets three exercises: represent OR, NOR and NAND with a perceptron and compute the parameters. It
        answers OR two slides later, which is the previous page, and leaves NOR and NAND to you.
      </Para>
      <Para>
        Both follow from one observation. <strong>NOR is NOT OR and NAND is NOT AND</strong>, and negating every weight
        of a perceptron negates its output — because z becomes −z, and the sign flips for every input at once.
      </Para>

      <Careful>
        With this deck’s rule, negation is not perfectly symmetric. A row where z is exactly 0 fires, and −0 is still 0,
        so it fires after negating too — that row would come out wrong. Before using the trick, check that no row sits
        exactly on zero. For OR the four sums are −1, 1, 1, 3, and for AND they are −1, −0.25, −0.25, 0.5. None is zero,
        so the trick is safe for both.
      </Careful>

      <Worked title="NOR: negate every weight of OR">
        {`  OR  is  w = (−1,  2,  2)
  NOR is  w = ( 1, −2, −2)

  x₁  x₂   t      z = 1 − 2x₁ − 2x₂        ŷ    ok
  ─────────────────────────────────────────────────
   0   0   1       1              ≥ 0      1     ✓
   0   1   0       1 − 2 = −1     < 0      0     ✓
   1   0   0       1 − 2 = −1     < 0      0     ✓
   1   1   0       1 − 4 = −3     < 0      0     ✓`}
      </Worked>

      <Worked title="NAND: negate every weight of AND">
        {`  AND  is  w = (−1,  0.75,  0.75)
  NAND is  w = ( 1, −0.75, −0.75)

  x₁  x₂   t      z = 1 − 0.75x₁ − 0.75x₂     ŷ    ok
  ────────────────────────────────────────────────────
   0   0   1       1                ≥ 0       1     ✓
   0   1   1       1 − 0.75 = 0.25  ≥ 0       1     ✓
   1   0   1       1 − 0.75 = 0.25  ≥ 0       1     ✓
   1   1   0       1 − 1.50 = −0.5  < 0       0     ✓`}
      </Worked>

      <Para>
        Neither answer is on the slides. Both were worked out here by negating the deck’s own answers, then checked
        against all four rows twice — by hand above, and by the lab below, which recomputes every z from the weights on
        screen rather than storing a result.
      </Para>

      <Lab>
        <Exercise01Lab />
      </Lab>

      <Terms
        items={[
          {
            term: 'NOR',
            def: 'Not-or. True only when both inputs are false.',
          },
          {
            term: 'NAND',
            say: 'NAND, one word',
            def: 'Not-and. False only when both inputs are true.',
          },
          {
            term: 'negating a perceptron',
            def: 'Flipping the sign of every weight, bias included. It swaps the two half-planes — subject to the warning above about rows sitting exactly on the boundary.',
          },
        ]}
      />

      <Beyond>
        NAND deserves more attention than the exercise gives it. It is <em>functionally complete</em>: every Boolean
        function can be built from NAND gates alone, which is why real chips are largely made of them. Since one
        perceptron can be a NAND gate, a network of perceptrons can compute any Boolean function at all. That makes the
        XOR result three pages on much sharper: the limit is not on networks, it is on <em>one layer</em>.
      </Beyond>

      <WhyAiml method="class weighting, and why flipping a classifier is not free">
        <p className="mb-2">
          Negating the weights of a binary classifier swaps its two classes, which sounds trivial and is exactly what
          you must not do when the two classes matter differently. A model tuned to catch fraud is not the same model
          with the labels swapped, because the threshold and the class weighting were chosen for one direction.
        </p>
        <p>
          The tie-break warning above is the same point in miniature. A rule that treats z = 0 as firing is not
          symmetric, so “the opposite classifier” is not simply the negated one. When you flip a decision in practice,
          re-check the boundary cases rather than assuming symmetry.
        </p>
      </WhyAiml>

      <Takeaway>
        NOR is (1, −2, −2) and NAND is (1, −0.75, −0.75) in this encoding — negate the weights, then check that no row
        sat on zero first.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  pla: (
    <>
      <Para>
        So far every answer has been found by hand. The <strong>perceptron learning algorithm</strong> finds them by
        running, and the deck states it in five lines.
      </Para>
      <Worked title="The algorithm, from page 32">
        {`Goal: find weights that correctly classify the training
      pairs (x, t).

  1  Initialise the learning rate  η = 0.1
  2  Initialise weights randomly:  wᵢ = random
  3  For each training example (x, t):
        calculate  ŷ = sign( Σᵢ wᵢxᵢ + b )
        if  ŷ ≠ t,  update:
               wᵢ  ←  wᵢ + η (t − ŷ) xᵢ
               b   ←  b  + η (t − ŷ)
  4  Repeat until convergence or max iterations

Convergence theorem:
  If the data is linearly separable, the perceptron learning
  algorithm will converge in finite steps.`}
      </Worked>
      <Para>
        Two things are new against session 1. The bias gets <strong>its own update line</strong>, because there is no x₀
        carrying it any more — and notice the line has no xᵢ in it, which is exactly what you would get by putting x₀ =
        1 into the weight line. And the weights start <strong>random</strong> rather than at zero, with η fixed at 0.1.
      </Para>

      <Lab>
        <PlaRunLab />
      </Lab>

      <Careful>
        The algorithm slide writes the output as <strong>the sign of Σwᵢxᵢ + b</strong>, but page 21 defined it as 1 or
        0, not +1 or −1. The lab uses the 0/1 rule from page 21, because that is the encoding the gates on the previous
        pages are written in and the only reading under which the whole deck is consistent. If a question gives you
        targets of ±1, use sign; if it gives 0/1, use the step.
      </Careful>

      <Para>
        Run it on AND and watch. From a start of zero it takes six epochs and converges to w = (−0.3, 0.2, 0.1) — which
        is not the deck’s (−1, 0.75, 0.75), and is just as correct. Run it on XOR and it never stops, which is the
        convergence theorem read backwards.
      </Para>

      <Terms
        items={[
          {
            term: 'epoch',
            say: 'EE-pock',
            def: 'One complete pass through every training example. Convergence means a whole epoch with no update.',
          },
          {
            term: 'η',
            say: 'eta',
            def: 'The learning rate. Set to 0.1 on this slide. It scales every update and never changes its direction.',
          },
          {
            term: '(t − ŷ)',
            def: 'The mistake. Zero when the answer is right, so a correct example changes nothing at all. With 0/1 outputs it is +1, 0 or −1.',
          },
          {
            term: 'convergence',
            def: 'Reaching weights that stop changing. Guaranteed on separable data, and impossible otherwise.',
          },
          {
            term: 'max iterations',
            def: 'A limit on how long to keep going. Needed precisely because non-separable data would otherwise loop forever with no error reported.',
          },
        ]}
      />

      <Beyond>
        Something surprising falls out of the lab, and it is worth checking rather than believing. Start from zero and
        change η: the numbers all scale, and the <em>decisions</em> — which rows are wrong, in which order — are
        identical. That happens because with 0/1 inputs every update is exactly ±η, so the whole run stays on a grid of
        multiples of η, and multiplying z by a positive constant never changes its sign. Random initial weights break
        this, which is one real reason the slide asks for them.
      </Beyond>

      <WhyAiml method="optimizer.step(), and why nobody initialises to zero">
        <p className="mb-2">
          Line 2 looks like a detail and is not. Initialising a layer’s weights to zero makes every unit in it compute
          the same thing and receive the same gradient, so they stay identical forever — the layer has the power of one
          unit. That is the symmetry-breaking problem, and it is why <code>nn.Linear</code> initialises randomly by
          default and why the deck says random here.
        </p>
        <p>
          A single perceptron has no such problem, since there is only one unit — which is exactly why session 1 could
          start from zero and get away with it. Knowing which of the two situations you are in is the difference between
          a harmless simplification and a network that will not train.
        </p>
      </WhyAiml>

      <Takeaway>
        Random start, η = 0.1, update only on mistakes, and the bias on its own line. It converges if and only if the
        data is separable — otherwise it runs until you stop it.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  nottrace: (
    <>
      <Para>
        The deck works the algorithm on the NOT gate. The setup is on page 33: one input, two examples, and — note the
        switch — the <strong>±1 encoding</strong> again, not the 0/1 used for AND and OR.
      </Para>
      <Worked title="The setup, page 33">
        {`  Example   x₁    t
  ────────────────────
    Eg:1     −1     1
    Eg:2      1    −1

  h  = sign( w₀x₀ + w₁x₁ )

          ⎧  1   if h ≥ 0
  ŷ  =  ⎨
          ⎩ −1   if h < 0

  Assume w₀ = w₁ = 0.  Let η = 1.`}
      </Worked>

      <Lab>
        <NotTraceLab />
      </Lab>

      <Careful>
        Page 33 says <strong>ŷ = 1 if h ≥ 0</strong>. Page 35 then computes <strong>sign(0) = −1</strong>, twice, and
        the printed answer depends on it. The two cannot both hold. The lab runs both: the deck’s definition gives w₀ =
        −2, w₁ = −2, and the deck’s arithmetic gives w₀ = 2, w₁ = −2. Both converge and both are correct NOT gates, and
        only the second matches the deck’s printed working. No attempt is made here to say which the deck meant.
      </Careful>

      <Worked title="Following the deck's arithmetic, step by step">
        {`Epoch 1, Eg:1   x₁ = −1,  t = 1,   w₀ = 0, w₁ = 0

   h  = 0 + 0(−1) = 0
   ŷ = sign(0)   = −1        (this is the disputed step)
   ŷ ≠ t, so update:
     w₁ ← 0 + 1(1 − (−1))(−1) = −2
     w₀ ← 0 + 1(1 − (−1))     =  2

Epoch 1, Eg:2   x₁ = 1,  t = −1,  w₀ = 2, w₁ = −2

   h  = 2 + (−2)(1) = 0
   ŷ = sign(0)     = −1
   ŷ = t, so no update.

Epoch 2, Eg:1   x₁ = −1,  t = 1

   h  = 2 + (−2)(−1) = 4
   ŷ = sign(4)      = 1
   ŷ = t, no update.

Epoch 2, Eg:2   x₁ = 1,  t = −1

   h  = 2 + (−2)(1) = 0
   ŷ = −1 = t,  no update.

A whole epoch with no change — the algorithm converges.
Final answer:  w₀ = 2,  w₁ = −2`}
      </Worked>

      <Careful>
        Two of the deck’s labels are wrong, and the arithmetic beside them shows it. Page 34 heads the first step{' '}
        <em>Example 1 pair (1, −1)</em> while computing with x₁ = −1 and t = 1, which is the pair (−1, 1). Page 35 heads
        the last step <em>Example 2 pair (1, 1)</em> while computing with t = −1. The working is right in both cases;
        only the labels slipped. Read the arithmetic, not the heading.
      </Careful>

      <Terms
        items={[
          {
            term: 'sign(0)',
            def: 'Undefined by the ordinary sign function, so any implementation has to pick. This deck picks −1 in its working and +1 in its definition, which is the whole difficulty on this page.',
          },
          {
            term: 'epoch',
            def: 'One pass over both examples. The deck labels its steps by epoch and example number, which is worth copying in an exam answer.',
          },
          {
            term: 'w₀x₀',
            def: 'The bias again, written as a weight on a constant input — so this page uses session 1’s convention for the bias while page 32 used its own.',
          },
        ]}
      />

      <Beyond>
        Look at where each answer puts the boundary. h = 0 means w₀ + w₁x₁ = 0, so x₁ = −w₀/w₁. With (2, −2) that is x₁
        = 1, which is Eg:2 exactly; with (−2, −2) it is x₁ = −1, which is Eg:1 exactly. Starting from zero weights with
        η = 1 on two points, the boundary lands <em>on</em> a training point either way, and the answer is only correct
        because of how the tie is broken. That is not a coincidence to shrug at — it is why the tie-break matters enough
        to have caused the contradiction.
      </Beyond>

      <WhyAiml method="reproducibility, and the seed that hides a bug">
        <p className="mb-2">
          A tie-break buried in a comparison is exactly the kind of detail that makes two implementations of the same
          algorithm disagree. Change <code>{'>='}</code> to <code>{'>'}</code> in a threshold and most runs are
          identical while a few land on different weights — which looks like randomness and is not.
        </p>
        <p>
          The professional habit is to make such choices explicit and test the boundary case deliberately, rather than
          discovering it when a colleague cannot reproduce your numbers. This page is a small, real example of the thing
          going wrong in print.
        </p>
      </WhyAiml>

      <Takeaway>
        The deck’s working converges to w₀ = 2, w₁ = −2 after one update. Its own definition of the tie-break would give
        (−2, −2) instead — both correct, and only one printed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  xor: (
    <>
      <Para>
        XOR — exclusive or, true when exactly one input is true. Four points, and the deck states the problem in one red
        box: <strong>XOR is not linearly separable. Single perceptron cannot solve XOR.</strong>
      </Para>
      <Worked title="The truth table">
        {`  x₁  x₂   XOR
  ───────────────
   0   0    0
   0   1    1
   1   0    1
   1   1    0

  Any line  w₁x₁ + w₂x₂ + b = 0  cannot separate these classes.`}
      </Worked>

      <Lab>
        <Xor01Lab />
      </Lab>

      <Para>
        The lab goes further than the slide. You can set any of the sixteen possible targets on those four corners, and
        it has already tested every one of them by sweeping lines when the page loaded. Fourteen of the sixteen are
        reachable by a single perceptron. The two that are not are XOR and its negation, XNOR.
      </Para>
      <Para>Here is why, in two lines, and it is worth being able to reproduce:</Para>
      <Worked title="Why no line can do XOR">
        {`Suppose some w₁, w₂, b classified XOR correctly, and write

    z(x₁, x₂) = b + w₁x₁ + w₂x₂

The two points needing output 1 are (0,1) and (1,0):

    z(0,1) ≥ 0   and   z(1,0) ≥ 0

z is linear, so the average of its values at two points is its
value at their midpoint:

    ½[ z(0,1) + z(1,0) ]  =  z(0.5, 0.5)  ≥  0

The two points needing output 0 are (0,0) and (1,1):

    z(0,0) < 0   and   z(1,1) < 0
    ½[ z(0,0) + z(1,1) ]  =  z(0.5, 0.5)  <  0

So z(0.5, 0.5) is both ≥ 0 and < 0.  Impossible.

The whole argument is that both diagonals of the square share
the same midpoint, (0.5, 0.5).`}
      </Worked>

      <Para>
        The deck’s answer is <strong>multiple layers — a multilayer perceptron</strong>, which is where the rest of
        module 2 goes. Session 1 already built the smallest one: two hidden units computing OR and NAND, feeding an
        output unit computing AND.
      </Para>

      <Terms
        items={[
          {
            term: 'XOR',
            say: 'EX-or',
            def: 'Exclusive or. True when exactly one input is true — so unlike OR, it is false when both are.',
          },
          {
            term: 'XNOR',
            def: 'The negation of XOR: true when the two inputs agree. The other function of the sixteen that one perceptron cannot represent.',
          },
          {
            term: 'linear function',
            def: 'One of the form b + w₁x₁ + w₂x₂. Its defining property here is that its value at a midpoint is the average of its values at the two ends.',
          },
          {
            term: 'proof by contradiction',
            def: 'Assume the thing you want to rule out, derive something impossible, conclude the assumption was false. The standard answer to "show XOR is not linearly separable".',
          },
        ]}
      />

      <WhyAiml method="the four-point test for a missing activation">
        <p className="mb-2">
          XOR is the smallest test case that catches the most common structural bug in a hand-written model. Two{' '}
          <code>nn.Linear</code> layers with nothing between them compose into one linear map, so a two-layer network
          without an activation fails XOR exactly as one perceptron does — while training happily and reporting nothing.
        </p>
        <p>
          Four points, one epoch, and you know. It is worth keeping as a unit test for any network code you write from
          scratch: if the model cannot learn XOR, it does not have a non-linearity, whatever the architecture diagram
          says.
        </p>
      </WhyAiml>

      <Takeaway>
        Fourteen of the sixteen two-input Boolean functions fit on one perceptron. XOR and XNOR do not, because both
        diagonals of the square meet at the same midpoint.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  separable: (
    <>
      <Para>Having shown one thing a perceptron cannot do, the deck defines precisely the class of things it can.</Para>
      <List
        items={[
          <>
            Two sets of data points are separable in an n-dimensional space if they can be separated by an{' '}
            <strong>(n − 1)-dimensional hyperplane</strong>.
          </>,
          <>
            In two dimensions, a straight line can be drawn separating every example of class +1 from every example of
            class −1. Then the data is <strong>clearly linearly separable</strong>.
          </>,
          <>
            An <strong>infinite number</strong> of straight lines can be drawn separating class +1 from class −1.
          </>,
        ]}
      />

      <Lab>
        <SeparableCountLab />
      </Lab>

      <Para>
        The third line is the one people skim, and it is the interesting one. If a separator exists at all, there are
        infinitely many — you can always tilt or shift a little and stay correct. So the perceptron is not solving for{' '}
        <em>the</em> answer; it stops at whichever one it happened to reach, and where it started decides which.
      </Para>

      <Terms
        items={[
          {
            term: 'hyperplane',
            say: 'HY-per-plane',
            def: 'A flat surface with one dimension fewer than the space it lives in. In ℝ² a line, in ℝ³ a plane, and above that no picture but the same algebra.',
          },
          {
            term: 'n − 1',
            def: 'Why a boundary is always one dimension short: it is defined by one equation, and each equation removes one degree of freedom.',
          },
          {
            term: 'class +1 and class −1',
            def: 'The two groups. Note this slide uses ±1 while the gate slides used 0/1 — a third place in this deck where the labels change.',
          },
          {
            term: 'margin',
            def: 'The width of the gap between the two classes. Not mentioned by the deck, and the thing that decides which of the infinitely many separators is best.',
          },
        ]}
      />

      <Beyond>
        “Infinitely many” raises a question the deck does not ask: if many lines work, which should you prefer? The
        usual answer is the one leaving the widest gap on both sides, because it is the least sensitive to a new point
        landing near the boundary. Choosing that one is what a <strong>support vector machine</strong> does, and it is
        the single biggest improvement over the perceptron — the 1995 entry on session 1’s timeline.
      </Beyond>

      <WhyAiml method="LinearSVC against Perceptron on the same data">
        <p className="mb-2">
          Fit both to separable data and they will disagree, even though both are correct on every training point.{' '}
          <code>Perceptron()</code> stops at the first separator its update rule reaches; <code>LinearSVC()</code>{' '}
          searches for the one with the widest margin. On the training set they score identically; on new data the
          margin usually wins.
        </p>
        <p>
          That is the practical content of “infinitely many”. Being correct on the data you have does not pick out a
          model, so something else must — and whatever that something else is, it is the part that decides how the model
          behaves on data you have not seen.
        </p>
      </WhyAiml>

      <Takeaway>
        Separable means an (n − 1)-dimensional hyperplane splits the classes. If one exists, infinitely many do — and
        the perceptron gives you no say over which you get.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  fourparts: (
    <>
      <Para>
        The deck now assembles everything into the four-component framework from session 1, filled in for the
        perceptron.
      </Para>
      <Worked title="The perceptron as a learning system">
        {`Data              truth tables, or a set of examples

Model             the perceptron
                    inputs x are the features or columns
                    target output t is the required label

Objective         the deviation of the desired output t
 function           from the computed output ŷ

Learning          the perceptron learning algorithm
 algorithm

Challenge         how to learn these n + 1 parameters
                    w₀, w₁, w₂ … wₙ ?

Solution          use the perceptron learning algorithm`}
      </Worked>
      <Para>
        This is the first time an <strong>objective function</strong> has been named for the perceptron. Session 1 never
        did — it introduced the update rule directly. And it is worth noticing how vague the naming is: “the deviation
        of t from ŷ” is a description of a family of losses, not a formula. Session 3 is where a formula finally
        appears.
      </Para>
      <Para>
        Note the parameter count too: <strong>n + 1</strong>, one per feature plus the bias. That is the same count as
        the design matrix in session 3 will have columns.
      </Para>

      <Lab>
        <VectorFormLab />
      </Lab>

      <Para>The last slide of the section writes the whole thing in vector notation:</Para>
      <Worked title="The vector form, page 43">
        {`      ⎡ x₀ ⎤              ⎡ w₀ ⎤
      ⎢ x₁ ⎥              ⎢ w₁ ⎥
  x = ⎢ x₂ ⎥          w = ⎢ w₂ ⎥
      ⎢ ⋮  ⎥              ⎢ ⋮  ⎥
      ⎣ xₙ ⎦              ⎣ wₙ ⎦

  h  =  w₀ + w₁x₁ + w₂x₂ + … + wₙxₙ
     =  wᵀx

          ⎧  1   if h ≥ 0
  ŷ  =  ⎨
          ⎩ −1   if h < 0`}
      </Worked>
      <Para>
        wᵀ — say “w transpose” — turns the column into a row, so that a 1 × (n + 1) row times an (n + 1) × 1 column is a
        single number. It is the same object as the dot product from the maths course, written a third way.
      </Para>

      <Terms
        items={[
          {
            term: 'wᵀ',
            say: 'w transpose',
            def: 'The column vector w laid on its side as a row. Transposing exists so the shapes of a matrix product line up.',
          },
          {
            term: 'wᵀx',
            def: 'A row times a column: multiply matching entries and add. Identical to Σ wᵢxᵢ and to the dot product ⟨w, x⟩ — three notations, one number.',
          },
          {
            term: 'deviation',
            def: 'How far apart two numbers are. Left deliberately unspecified here; squared, absolute and zero-one deviations are all in use, and they are different objectives.',
          },
          {
            term: 'n + 1 parameters',
            def: 'One weight per feature, plus the bias. The +1 is the bias, every time you see it in this course.',
          },
        ]}
      />

      <Careful>
        This page fires at <strong>h ≥ 0</strong> and outputs <strong>±1</strong> — a third combination, different from
        both page 21 and session 1. The next page of this chapter lays all four side by side; it is the last time this
        will be mentioned, but it is worth checking every time you read a perceptron question.
      </Careful>

      <WhyAiml method="X @ w, and why frameworks are written in matrices">
        <p className="mb-2">
          wᵀx is one prediction. Stack the examples as rows of a matrix and <code>X @ w</code> is every prediction at
          once — which is exactly what session 3 does on its very first algebra slide, and what every library computes.
          The transpose notation is not decoration; it is the bookkeeping that makes the shapes work.
        </p>
        <p>
          The habit it buys is checking shapes before running anything. A layer with a weight matrix of (out, in) times
          an input of (batch, in) needs one of them transposed, and getting that wrong is the single most common error
          message in a first PyTorch session. Reading wᵀx as a shape statement, not just a formula, is what stops it.
        </p>
      </WhyAiml>

      <Takeaway>
        Data, model, objective, algorithm — with the objective finally named, if not yet written down. And h = wᵀx is
        the dot product under a third name.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  encodings: (
    <>
      <Para>
        This page is not from a slide. It is a summary of a problem running through the two sessions you have just read,
        collected in one place because it is the likeliest way to lose marks on an otherwise correct answer.
      </Para>
      <Para>
        Across sessions 1 and 2, the same unit is defined <strong>four times</strong>, with four different combinations
        of output labels and tie-break rule. All four appear in material you are examined on.
      </Para>

      <Lab>
        <EncodingsLab />
      </Lab>

      <Worked title="The four, side by side">
        {`Where                Inputs   Fires when   Output       At z = 0
─────────────────────────────────────────────────────────────────
Session 1, slide 53    ±1      z > 0        +1 / −1        −1
Session 2, page 21     0/1     z ≥ 0         1 /  0         1
Session 2, page 33     ±1      h ≥ 0        +1 / −1        +1
Session 2, page 35     ±1      sign, with sign(0) = −1     −1
  (the worked arithmetic, contradicting page 33)`}
      </Worked>

      <Para>
        Away from zero, all four agree about which side of the boundary a point is on — only the labels differ. Every
        disagreement is concentrated at <strong>z = 0</strong>. And z = 0 is not a rare edge case in this material: it
        happens in session 1’s NOT-gate answer, in both of session 2’s NOT-gate training runs, and in session 1’s trace
        table.
      </Para>

      <Beyond>
        A practical rule for an exam. Write down, before anything else:{' '}
        <em>
          inputs in {'{'}0, 1{'}'} or {'{'}−1, +1{'}'}; fires when z {'>'} 0 or z ≥ 0; output labels
        </em>
        . Three short lines. Then every check you do afterwards is against something you have stated, and a marker can
        follow your reasoning even if the question intended a different convention. This costs thirty seconds and
        protects every mark on the question.
      </Beyond>

      <Terms
        items={[
          {
            term: 'convention',
            def: 'A choice that could have gone either way and has to be stated. Not a fact about the world, and not something to be derived — which is why leaving it unsaid is the problem.',
          },
          {
            term: 'tie-break',
            def: 'What happens exactly on the boundary. Every threshold rule needs one, and it is the only place the four conventions differ.',
          },
          {
            term: 'bipolar',
            def: 'The ±1 encoding. The 0/1 one is called binary or unipolar. Both names turn up in textbooks, and neither deck uses either.',
          },
        ]}
      />

      <WhyAiml method="the sign convention in a library you did not write">
        <p className="mb-2">
          This is not a quirk of one lecturer. <code>sklearn</code>’s <code>Perceptron</code> uses labels of your
          choosing and decides ties one way; a textbook implementation may decide them the other; and a PyTorch model
          with <code>BCEWithLogitsLoss</code> works in raw scores where the threshold is yours to place afterwards. The
          same model, three interfaces, three answers on the boundary.
        </p>
        <p>
          What it costs in practice is reproducibility. Two people implementing “the same” classifier from the same
          description get results that agree on 99.9% of inputs and differ on the rest, and tracking that down takes
          days if neither wrote the convention down. Stating it is the whole fix.
        </p>
      </WhyAiml>

      <Takeaway>
        Four conventions, one unit. They differ only at z = 0 — and z = 0 is where nearly every worked answer in these
        two sessions lands.
      </Takeaway>
    </>
  ),
}
