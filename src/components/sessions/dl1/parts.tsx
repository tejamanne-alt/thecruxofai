/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  BrainStepsLab,
  ComponentsLab,
  DataMatrixLab,
  DescentLab,
  LossCompareLab,
  ModelFamilyLab,
  OverfitLab,
} from '@/components/charts/dl-components-lab'
import { AndOrLab, GateExerciseLab, NotGateLab, TraceLab, UpdateRuleLab } from '@/components/charts/dl-gate-lab'
import {
  AppTypeLab,
  CourseShapeLab,
  DepthStackLab,
  NestingLab,
  ScaleLab,
  TimelineLab,
} from '@/components/charts/dl-intro-lab'
import { HyperplaneLab, NeuronLab, PerceptronThresholdLab } from '@/components/charts/dl-neuron-lab'
import { MlpLab, SeparableLab, XorLab } from '@/components/charts/dl-separable-lab'
import { Para, Takeaway, Terms, WhyAiml, Worked } from '../session-parts'

/** A little spacer so a lab never sits flush against the words above it. */
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

/** Where the deck says one thing and means another, or contradicts itself. */
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

export const DL1_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  map: (
    <>
      <Para>
        This is the first session of <strong>Deep Neural Networks</strong>, and the slides open with logistics rather
        than with neurons. That is worth ten minutes: knowing the shape of the course tells you what is being examined,
        and knowing what is examined tells you how to read everything after it.
      </Para>
      <Para>
        The course runs in <strong>ten modules</strong>. This session is the whole of module 1, and modules 2 and 3 are
        the direct continuation of it — the multilayer perceptron, then deep feedforward networks. After that it widens:
        optimisation and regularisation, convolutional networks, sequence models, attention, network search, time
        series, and a last module of other techniques.
      </Para>
      <Para>
        Marks come from three components. <strong>EC1</strong> is continuous: two quizzes of 30 minutes at 5% each, and
        two assignments of four weeks at 10% and 15%. <strong>EC2</strong> is the mid-semester exam, 2 hours, closed
        book, 30%. <strong>EC3</strong> is the comprehensive exam, 2.5 hours, open book, 40%.
      </Para>

      <Lab>
        <CourseShapeLab />
      </Lab>

      <Careful>
        The six weightings printed on slide 6 add up to <strong>105%</strong>, not 100. The asterisk against the two
        quizzes reads “Best of Two”, and dropping the lower 5% quiz brings the total to exactly 100. The lab above does
        that sum in front of you rather than asking you to take it on trust.
      </Careful>

      <Terms
        items={[
          {
            term: 'EC1, EC2, EC3',
            def: 'The three evaluation components. EC1 is everything continuous through the semester, EC2 is the mid-semester exam and EC3 is the comprehensive at the end.',
          },
          {
            term: 'closed book',
            def: 'No materials in the room. The mid-semester exam is this one, so definitions and worked procedures have to be in your head.',
          },
          {
            term: 'open book',
            def: 'Materials allowed. The comprehensive exam is this one — which shifts the difficulty from recall to doing, so practising the working matters more than memorising the formula.',
          },
          {
            term: 'PyTorch',
            say: 'pie-torch',
            def: 'The library the six labs use. A Python package for building and training neural networks, and the thing lab L1 is entirely about.',
          },
        ]}
      />

      <Worked title="What is on the reading list">
        {`Textbook   Dive into Deep Learning
             Aston Zhang, Zack C. Lipton, Mu Li, Alex J. Smola
             d2l.ai — free online, and slide 41 sends you to
             chapter 1, plus chapter 2 for the Python, linear
             algebra, calculus and probability prerequisites

Reference  Deep Learning
             Ian Goodfellow, Yoshua Bengio, Aaron Courville
             deeplearningbook.org

Also cited Machine Learning, Tom M. Mitchell, chapter 4
             (slide 82 — the whole perceptron half of this
              session comes from there)

Labs       L1 Introduction to PyTorch
           L2 Deep Neural Network with back-propagation
              and optimization
           L3 CNN
           L4 RNN
           L5 LSTM
           L6 Auto-encoders`}
      </Worked>

      <Para>
        Chapter 2 of the textbook being set as prerequisite reading is not a coincidence: it covers linear algebra,
        calculus and probability, which is the Mathematical Foundations course you are already taking. Nothing in this
        course re-teaches them.
      </Para>

      <WhyAiml method="torch.nn.Module">
        <p className="mb-2">
          Everything in the ten-module list is a subclass of one idea: a network is an object with parameters and a
          forward pass. In PyTorch that object is <code>torch.nn.Module</code>, and the modules of this course are
          essentially a tour of which layers you put inside it — dense layers in modules 2 and 3, convolutions in module
          5, recurrent cells in module 6, attention in module 7.
        </p>
        <p>
          The reason to look at the module list on day one is that it tells you what a question can be about. Module 4
          is optimisation and regularisation, so “my training loss is fine and my test loss is not” is an examinable
          situation with named cures. Module 8 is network search, so “how many layers?” is treated as a question with an
          algorithm rather than as taste.
        </p>
      </WhyAiml>

      <Takeaway>
        Ten modules, six PyTorch labs, and 70% of the mark in two exams — one closed book, one open. The printed
        weightings add to 105% because only the better of the two quizzes counts.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  whatisdl: (
    <>
      <Para>
        Slide 12 gives five definitions of deep learning, one after another. They are not five different things — they
        are five ways of pointing at the same one, and it is worth separating them, because only one of them is a test
        you could actually apply.
      </Para>
      <List
        items={[
          <>
            <strong>
              A type of machine learning based on artificial neural networks, in which multiple layers of processing
              extract progressively higher-level features from data.
            </strong>{' '}
            This is the full one. Everything else on the slide is a piece of it.
          </>,
          <>
            <strong>A method in AI that teaches computers to process data in a way inspired by the human brain.</strong>{' '}
            True as history and useless as a test. “Inspired by” is not a property you can check.
          </>,
          <>
            <strong>A technique that teaches computers to do what comes naturally to humans: learn by example.</strong>{' '}
            This is the definition of machine learning generally, not of deep learning.
          </>,
          <>
            <strong>
              A subset of machine learning which is essentially a neural network with three or more layers.
            </strong>{' '}
            The only one you can apply. Count the layers.
          </>,
          <>
            <strong>It gets its name from the fact that we add more layers to learn from the data.</strong> An
            etymology, and a useful one: <em>deep</em> is a statement about the model, not about the data or the task.
          </>,
        ]}
      />

      <Para>
        Slide 15 is the one that actually explains it. Deep learning is learning <strong>representations</strong> from
        data, with an emphasis on <strong>successive layers of increasingly meaningful representations</strong>. The
        number of layers that contribute to modelling the data is the <strong>depth</strong> of the model.
      </Para>

      <Lab>
        <DepthStackLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'representation',
            def: 'A way of writing the data down. Pixel brightnesses are one representation of a photograph; a list of which shapes appear in it is another. A layer turns one representation into another.',
          },
          {
            term: 'depth',
            def: 'The number of layers that contribute to modelling the data. Slide 15 states it in exactly those words, and slide 12 draws the line for the word "deep" at three.',
          },
          {
            term: 'feature',
            def: 'One number describing an example. In shallow machine learning a person chooses the features; the claim of deep learning is that the layers work them out themselves.',
          },
          {
            term: 'higher-level',
            def: 'Further from the raw measurements and closer to what you actually want to know. It is a direction, not a scale — nothing measures how high-level a representation is.',
          },
        ]}
      />

      <Beyond>
        A useful way to keep the two apart in an exam: <strong>machine learning</strong> is a claim about where the rule
        comes from — data rather than a programmer. <strong>Deep learning</strong> is a claim about the shape of the
        model — many transformations chained together rather than one. A method can be one without the other. Linear
        regression learns from data and has depth 1; a hand-designed image filter has many stages and learns nothing.
      </Beyond>

      <WhyAiml method="nn.Sequential and the end of feature engineering">
        <p className="mb-2">
          Before deep learning, most of the effort in a vision or speech project went into choosing features by hand:
          edge detectors, spectral coefficients, colour histograms. The layers replace that job. Writing{' '}
          <code>nn.Sequential(nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 10))</code> and letting the middle layer
          find its own representation is doing, automatically, what a person used to do with a whiteboard.
        </p>
        <p>
          What breaks without depth is precisely that. A depth-1 model has to be handed features that are already good
          enough for a straight line to work on, which is why the classical pipeline could not be skipped. It is also
          why depth costs data: nobody hands the middle layer its answer, so it has to find one, and that takes far more
          examples than fitting a line to features somebody already got right.
        </p>
      </WhyAiml>

      <Takeaway>
        Deep means many successive layers of representation, and the number of them is the depth. The only checkable
        definition on slide 12 is “three or more layers”.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  nesting: (
    <>
      <Para>
        Slide 13 draws four circles inside one another. Artificial intelligence is the outermost, then machine learning,
        then neural networks, then deep learning at the centre. A fifth circle, data science, overlaps the others from
        the side rather than sitting inside any of them.
      </Para>
      <Para>
        The containment is a real claim and you should be able to defend it in both directions. Every deep learning
        method is a neural network; every neural network that learns from data is machine learning; every machine
        learning method is artificial intelligence. Going the other way, each ring has room to spare: AI includes plenty
        of approaches that <strong>do not involve any learning</strong> — the slide says so in that sentence.
      </Para>

      <Lab>
        <NestingLab />
      </Lab>

      <Para>Slide 14 defines each of the three in one line, and the wording is worth keeping:</Para>
      <List
        items={[
          <>
            <strong>AI</strong> is the science of making things smart. The aim is to make machines perform human tasks.
            Example: a robot cleaning a room.
          </>,
          <>
            <strong>ML</strong> is an <em>approach</em> to AI. The machine learns or performs tasks through learning by
            experience.
          </>,
          <>
            <strong>DL</strong> is a <em>technique</em> for implementing machine learning to recognise patterns.
          </>,
        ]}
      />
      <Para>
        Notice the nouns: AI is a science, ML is an approach, DL is a technique. That ladder — field, approach,
        technique — is the whole of the slide, and it is why the circles nest.
      </Para>

      <Terms
        items={[
          {
            term: '⊂',
            say: 'is a subset of',
            def: 'Everything in the thing on the left is also in the thing on the right. DL ⊂ NN ⊂ ML ⊂ AI reads "deep learning is inside neural networks, which are inside machine learning, which is inside AI".',
          },
          {
            term: 'data science',
            def: 'Getting understanding out of data, by whatever means — statistics, visualisation, SQL, sometimes machine learning. The overlap in the diagram is deliberate: neither field contains the other.',
          },
          {
            term: 'connectionist',
            def: 'The name for the family of methods that store what they know in the connections between simple units rather than in explicit rules. Slide 48 says neural networks are connectionist machines.',
          },
        ]}
      />

      <Beyond>
        A clean test for the middle boundary: does anything change when you show it more examples? A chess engine doing
        pure search is AI and is not machine learning, because the same position always produces the same move no matter
        how many games it has seen. Add a learned evaluation function and it crosses into the second ring.
      </Beyond>

      <WhyAiml method="sklearn.linear_model.LogisticRegression against nn.Linear">
        <p className="mb-2">
          The nesting decides which library you reach for and what you are allowed to expect. Something in the machine
          learning ring but not the neural network one — a decision tree, a support vector machine, k-means — comes out
          of scikit-learn, trains in seconds on a laptop, and often needs features you chose yourself. Something in the
          inner two rings comes out of PyTorch, wants a GPU and a lot of examples, and will find its own features.
        </p>
        <p>
          The mistake this diagram is drawn to prevent is reaching for the innermost ring by default. On a few thousand
          rows of tabular data, logistic regression frequently beats a network — and a network with fewer examples than
          parameters will happily memorise its training set instead of learning anything, which is the overfitting you
          will meet in part 11. Choosing the outer ring on purpose is a real engineering decision, not a lack of
          ambition.
        </p>
      </WhyAiml>

      <Takeaway>
        DL ⊂ NN ⊂ ML ⊂ AI, and each ring is strictly bigger than the one inside it. Data science overlaps rather than
        nests.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  whynow: (
    <>
      <Para>
        The artificial neuron is from 1943 and backpropagation from 1986, so the obvious question is why deep learning
        only became the standard answer after 2012. Slide 17 lists ten reasons. They fall into three groups, and sorting
        them that way makes the list far easier to hold on to.
      </Para>
      <Para>
        <strong>Things that arrived from outside.</strong> Large amounts of data. Lots and lots of unstructured data —
        images, text, audio, video. Cheap, high-quality sensors. Cheap computation: CPU, GPU, distributed clusters.
        Cheap data storage. None of these are advances in the method; they are the world changing around it.
      </Para>
      <Para>
        <strong>Things the method is good at.</strong> Learning by examples. Automated feature generation. Better
        learning capabilities.
      </Para>
      <Para>
        <strong>Consequences.</strong> Scalability, and the fact that advanced analytics can now be applied.
      </Para>

      <Lab>
        <ScaleLab />
      </Lab>

      <Para>
        Slide 18 is the argument in one picture: a hand-drawn chart of Andrew Ng’s, headed{' '}
        <strong>Scale drives deep learning progress</strong>. Performance is on the vertical axis and the amount of
        labelled data <em>m</em> on the horizontal. Four curves rise and flatten — traditional learning algorithms
        lowest, then small, medium and large neural networks. The bigger the network, the later it flattens and the
        higher it gets.
      </Para>
      <Para>
        Two details on that slide are easy to skip and are the whole point. First, the horizontal axis is annotated{' '}
        <strong>(x, y)</strong> and <strong>labelled</strong> — it is not the amount of data, it is the amount of{' '}
        <em>labelled</em> data, which is the expensive kind. Second, the left-hand end is bracketed and marked{' '}
        <strong>small training sets</strong>, where the curves are tangled together. In that region the slide is
        deliberately not claiming an ordering.
      </Para>

      <Careful>
        Neither axis on slide 18 has a scale, and the chart is drawn by hand. It supports one claim — that the ordering
        of the four methods changes as data grows, and that the network curves overtake the traditional one — and it
        supports no claim at all about how much data, or by how much. The lab above redraws the shape and leaves both
        axes unlabelled for exactly that reason.
      </Careful>

      <Terms
        items={[
          {
            term: 'm',
            def: 'The number of training examples. The same m as in the m × n data matrix — this course, the maths course and the ML course all use it for the number of rows.',
          },
          {
            term: 'unstructured data',
            def: 'Anything that does not fit in a table with fixed columns: photographs, sentences, recordings. Slide 17 lists it separately from "large amounts of data" because it is the kind classical methods handled worst.',
          },
          {
            term: 'GPU',
            say: 'gee-pee-you',
            def: 'Graphics processing unit. A chip built to do thousands of small multiplications at once, which is exactly what a layer of a network is. This is the single piece of hardware the field waited for.',
          },
          {
            term: 'labelled data',
            def: 'Examples that come with the right answer attached. Raw data is cheap and labels are not, which is why the axis on slide 18 says (x, y) rather than x.',
          },
        ]}
      />

      <WhyAiml method="DataLoader(batch_size=…) on a GPU">
        <p className="mb-2">
          The reason cheap computation appears on a list about a mathematical method is that a layer is a matrix
          multiply, and a GPU does matrix multiplies thousands of lanes at a time. Training a network in PyTorch is
          arranged around feeding it batches — <code>DataLoader(dataset, batch_size=64)</code> — precisely so each step
          is one big multiplication instead of sixty-four small ones. Backpropagation was published in 1986 and was not
          impractical then in principle; it was impractical because a run took months.
        </p>
        <p>
          The practical decision this settles is when <em>not</em> to reach for a bigger network. If your labelled data
          is a few thousand rows, you are standing in the bracketed region on the left of the slide, where a bigger
          model buys nothing and costs a lot. Scaling up is a strategy that only pays where the curve has not yet
          flattened — and the way you find out is to plot your own error against training set size, not to assume.
        </p>
      </WhyAiml>

      <Takeaway>
        The method is old; the data, the sensors, the storage and the GPUs are new. And the axis that matters is
        labelled data, which is the part you have to pay for.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  history: (
    <>
      <Para>
        Slide 19 is a timeline with seventeen dated marks on it, and three stretches labelled golden ages with two dark
        ages in between. Read as a list of dates it is dull; read as a story of two collapses it is the most useful
        slide in the deck, because both collapses were caused by something you will meet in this very session.
      </Para>

      <Lab>
        <TimelineLab />
      </Lab>

      <Para>
        The first golden age starts with the <strong>Perceptron</strong> in 1957 and ends with the{' '}
        <strong>XOR Problem</strong> in 1969 — the demonstration that a single perceptron cannot represent XOR, which is
        part 23 of this chapter. Funding and interest collapsed for over a decade behind that one result.
      </Para>
      <Para>
        The second golden age starts with <strong>Backpropagation</strong> in 1986, which is the answer to the XOR
        problem: a way to train the hidden layers that a multilayer network needs. It runs through the{' '}
        <strong>universal approximation theorem</strong> in 1989 and ends around <strong>SVMs</strong> in 1995 — a rival
        family with better theory, less appetite for data and no fiddly training. The second dark age is that comparison
        going the wrong way.
      </Para>
      <Para>
        The third starts near <strong>RBM Initialization</strong> in 2006 — a way to start a deep network off well
        enough to train at all — and turns into the present at <strong>AlexNet</strong> in 2012, then GANs in 2014, the
        Transformer in 2017, GPT-3 in 2020 and ChatGPT in 2022.
      </Para>

      <Terms
        items={[
          {
            term: 'ADALINE',
            say: 'ADD-a-line',
            def: 'Adaptive linear neuron, 1959. A perceptron trained against the squared error of the sum rather than against the mistakes of the threshold — which is the first appearance of a loss function in this story.',
          },
          {
            term: 'Neocognitron',
            def: '1980. A layered vision model tolerant of where in the image a shape appears. The convolutional network of 1998 is its descendant.',
          },
          {
            term: 'UAT',
            def: 'Universal approximation theorem, 1989. A network with one hidden layer, made wide enough, can approximate any continuous function to any accuracy you like. It says nothing about how to find the weights, or how wide "wide enough" is.',
          },
          {
            term: 'RBM',
            def: 'Restricted Boltzmann machine. Used in 2006 to set a deep network’s starting weights layer by layer, so that training could get going at all.',
          },
          {
            term: 'GAN',
            def: 'Generative adversarial network, 2014. Two networks trained against one another, one producing samples and one judging them.',
          },
        ]}
      />

      <Beyond>
        The universal approximation theorem and the XOR problem are worth holding side by side, because together they
        say something sharp. XOR proves that <em>zero</em> hidden layers is not enough. UAT proves that <em>one</em>{' '}
        hidden layer, wide enough, is always enough in principle. So depth beyond one is never about what is possible —
        it is about how many units and how many examples it takes. That is the honest answer to “why go deep if one
        layer is universal?”, and it is a standard exam question.
      </Beyond>

      <WhyAiml method="loss.backward() — the 1986 entry, still the whole training loop">
        <p className="mb-2">
          One line on that timeline is in every PyTorch script you will ever write. Backpropagation, 1986, is what{' '}
          <code>loss.backward()</code> does: it works out how much each weight in every layer contributed to the error,
          by applying the chain rule backwards through the network. Before it, nobody could train the hidden layer that
          the XOR fix in part 24 requires, which is exactly why the first dark age lasted seventeen years.
        </p>
        <p>
          The pattern the timeline shows twice is worth taking seriously as an engineer, not just as history. Both
          collapses came from a real limitation being found and taken as final: XOR was read as “neural networks cannot
          do non-linear problems”, when it only showed that one layer cannot. Knowing exactly what a negative result
          proves — and what it does not — is the difference between the 1969 reading and the 1986 one.
        </p>
      </WhyAiml>

      <Takeaway>
        Two winters, both caused by a limitation being over-read. 1969 was XOR; 1986 was the answer to it. Everything
        after 2012 is the third golden age.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  apps: (
    <>
      <Para>
        Slides 21 to 26 are news items — speech recognition beating human transcriptionists in 2016, Google Translate
        rewritten, object detection, self-driving cars, AlphaGo, ChatGPT. Slide 27 is the one to learn, because it turns
        that parade into a table with four columns: application, input, output, and which kind of neural network.
      </Para>

      <Lab>
        <AppTypeLab />
      </Lab>

      <Para>
        The fourth column is the part worth memorising, because it is a first pass at a rule you will spend modules 5 to
        7 refining:
      </Para>
      <List
        items={[
          <>
            <strong>Std NN</strong> — an ordinary stack of fully connected layers. Used when the input is a fixed list
            of features with no particular geometry, like the features of a house.
          </>,
          <>
            <strong>CNN</strong> — convolutional. Used when the input is an image, because neighbouring pixels belong
            together and the same pattern can appear anywhere in the frame.
          </>,
          <>
            <strong>RNN</strong> — recurrent. Used when the input or the output is a sequence whose length is not fixed,
            like audio or a sentence.
          </>,
          <>
            <strong>Hybrid NN</strong> — more than one of the above wired together. Autonomous driving takes images,
            sensors and radar at once and produces several different kinds of answer.
          </>,
        ]}
      />

      <Para>
        Slide 28 adds four more in prose, and each is worth classifying for yourself: predicting tomorrow’s weather from
        geography, satellite images and a trailing window of past weather; answering a free-form question; drawing an
        outline round every person in an image; and recommending products a user would enjoy but would not have found.
      </Para>

      <Terms
        items={[
          {
            term: 'CNN',
            def: 'Convolutional neural network. A network whose layers slide a small pattern-detector across the whole input, so the same detector works wherever the pattern appears. Module 5.',
          },
          {
            term: 'RNN',
            def: 'Recurrent neural network. A network that keeps a running state as it reads a sequence one item at a time, so what it saw earlier can affect what it makes of what comes next. Module 6.',
          },
          {
            term: 'bounding box',
            def: 'Four numbers naming a rectangle in an image — usually left, top, width and height — plus a label saying what is in it.',
          },
          {
            term: 'transcript',
            def: 'The text of what was said. The output of speech recognition, and a sequence rather than a single answer.',
          },
        ]}
      />

      <Beyond>
        Only one of the six rows is plain regression and only one is plain classification. The other four produce
        something structured — a box, a sequence, several answers at once. That is not the table being sloppy; it is the
        two-way split you learnt in the ML course reaching its limit. Most real deep learning output is a structure, and
        the design question becomes “what shape is the output, and what loss compares two of those?”
      </Beyond>

      <WhyAiml method="the last layer: nn.Linear(h, 1) against nn.Linear(h, K) with CrossEntropyLoss">
        <p className="mb-2">
          The output column of that table decides two concrete lines of code, and they are the two most commonly got
          wrong. A single number out means a final <code>nn.Linear(h, 1)</code> with no activation and{' '}
          <code>nn.MSELoss</code>. One of K categories out means <code>nn.Linear(h, K)</code> and{' '}
          <code>nn.CrossEntropyLoss</code>, which expects raw scores and applies the softmax itself.
        </p>
        <p>
          Get the pairing wrong and nothing crashes — it trains, slowly, to something bad. Putting a sigmoid before
          <code> CrossEntropyLoss</code> squashes the scores twice and flattens the gradients; using MSE on a
          classification target trains the network to predict the average of the class codes, which is meaningless when
          the codes are 0, 1, 2. The table is a reminder to decide the output shape before writing the model, not after.
        </p>
      </WhyAiml>

      <Takeaway>
        Input type picks the architecture — features to Std NN, images to CNN, sequences to RNN, several at once to a
        hybrid. Output type picks the last layer and the loss.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  components: (
    <>
      <Para>
        Slide 30 is the spine of the whole course. Every deep learning problem, however elaborate, has exactly four
        parts:
      </Para>
      <List
        items={[
          <>
            The <strong>data</strong> that we can learn from.
          </>,
          <>
            A <strong>model</strong> of how to transform the data.
          </>,
          <>
            An <strong>objective function</strong> that quantifies how well — or how badly — the model is doing.
          </>,
          <>
            An <strong>algorithm</strong> to adjust the model’s parameters to optimise the objective.
          </>,
        ]}
      />
      <Para>
        The next four parts of this chapter take one each. Before that, it is worth seeing what each of them is for by
        seeing what stops working without it.
      </Para>

      <Lab>
        <ComponentsLab />
      </Lab>

      <Para>
        The diagram underneath the list on slide 30 shows data going into a learning algorithm, with a loss function
        drawn inside it, and a model coming out. That picture is accurate about the flow and misleading about the order:
        the <em>shape</em> of the model is chosen by you before any of it runs, and only its numbers come out at the
        end.
      </Para>

      <Terms
        items={[
          {
            term: 'objective function',
            def: 'A number that scores how the model is doing, computed from its predictions and the data. By convention it is arranged so lower is better.',
          },
          {
            term: 'loss function',
            def: 'The same thing, under the name people actually use. Slide 34 says the two words are interchangeable and explains why: because lower is better, "loss" is the natural word.',
          },
          {
            term: 'parameter',
            def: 'One of the numbers inside the model that training is allowed to change. The weights of every neuron are parameters.',
          },
          {
            term: 'optimise',
            def: 'Search for the setting of the parameters that makes the objective as small as possible. Not "make better in general" — a specific number is being minimised.',
          },
        ]}
      />

      <Beyond>
        Mitchell’s ⟨T, P, E⟩ from the Machine Learning course maps onto three of these four and not the fourth. E is the
        data, P is the objective with its sign flipped, and T is what the model computes. There is no letter for the
        optimisation algorithm, because in Mitchell’s framing it does not affect what is <em>learnable</em> — only
        whether you can find it. In deep learning that fourth component is where most of the difficulty lives, which is
        why it gets a whole module to itself.
      </Beyond>

      <WhyAiml method="the five-line PyTorch training loop">
        <p className="mb-2">
          The four components are literally the four objects in a training script. <code>loader</code> is the data,{' '}
          <code>model</code> is the model, <code>criterion</code> is the objective and <code>optimizer</code> is the
          algorithm, and the loop is{' '}
          <code>opt.zero_grad(); loss = criterion(model(x), y); loss.backward(); opt.step()</code>. If you can name
          which of the four a bug is in, you have halved the search.
        </p>
        <p>
          The failure this framing catches earliest is the one where three components are excellent and the fourth is
          wrong. A network that trains beautifully to a loss nobody examined will do exactly what that loss asked — the
          ML course made the same point about a badly chosen P, and it is the same failure. Writing all four down before
          writing code is the cheapest review there is.
        </p>
      </WhyAiml>

      <Takeaway>
        Data, model, objective, algorithm. Take away any one and there is no learning problem left — and it is usually
        obvious which one is missing once you ask.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  data: (
    <>
      <Para>
        Slide 31 starts with the plainest possible statement: data is a <strong>collection of examples</strong>. The
        rest of the slide is what has to be true about that collection before a network can touch it.
      </Para>
      <Para>
        Each example — also called a data point, a data instance or a sample; all four words mean the same thing — is a
        set of attributes called <strong>features</strong>, or covariates. In a supervised problem, the attribute you
        want predicted is singled out and called the <strong>label</strong>, or target. The whole thing is written{' '}
        <strong>
          D = {'{'}X, t{'}'}
        </strong>
        : X is the block of features, t is the column of labels, and the deck says <em>a set of m examples</em>.
      </Para>
      <Para>
        And then a line that looks like a throwaway and is not: <strong>we need the right data</strong>. It also has to
        be converted into a useful and suitable <strong>numerical representation</strong>, because a network multiplies
        numbers and does nothing else.
      </Para>

      <Lab>
        <DataMatrixLab />
      </Lab>

      <Para>
        Slide 32 is about <strong>dimensionality</strong>. When every example has the same number of values, the data
        consists of fixed-length vectors, and that constant length is the dimensionality of the data. An image is the
        deck’s example. Then one sentence that carries a whole module of this course:{' '}
        <strong>text data has varying-length data</strong>.
      </Para>

      <Terms
        items={[
          {
            term: 'example',
            def: 'One row. Also called a data point, a data instance or a sample — slide 31 gives all four names, and they are used interchangeably in every paper you will read.',
          },
          {
            term: 'feature',
            say: 'also covariate',
            def: 'One column of the input. The things the model is allowed to look at.',
          },
          {
            term: 'label',
            say: 'also target',
            def: 'The column you want predicted, in a supervised problem. Its presence is what makes the problem supervised.',
          },
          {
            term: 'D = {X, t}',
            say: 'the data is X and t',
            def: 'The whole dataset: X is the m × n block of features, t is the column of m labels. In an unsupervised problem the t is simply absent.',
          },
          {
            term: 'm',
            def: 'How many examples there are. Rows.',
          },
          {
            term: 'dimensionality',
            def: 'How many numbers describe each example. Columns, and the n in ℝⁿ. Constant across examples, or the word does not apply.',
          },
          {
            term: 'ℝⁿ',
            say: 'are-en',
            def: 'The set of all lists of n real numbers. Saying an example "lives in ℝⁿ" is saying it is a point with n coordinates — the same ℝⁿ from Lecture 2 of the maths course.',
          },
        ]}
      />

      <Beyond>
        Two examples of different lengths are not two points of the same space, so nothing you learnt about vectors
        applies across them — you cannot add them, take a distance between them, or feed them to the same{' '}
        <code>nn.Linear</code>. That is the entire reason sequence models exist as a separate module. The usual fixes
        are to pad every sequence to a common length and teach the model to ignore the padding, or to use an
        architecture that reads one item at a time and does not need a common length at all.
      </Beyond>

      <WhyAiml method="pad_sequence and the collate_fn">
        <p className="mb-2">
          The fixed-length rule shows up the first time you write a <code>DataLoader</code> over text. Batching stacks
          examples into one tensor, and stacking requires them to be the same shape — so PyTorch makes you supply a{' '}
          <code>collate_fn</code>, and <code>nn.utils.rnn.pad_sequence</code> is the standard one. Images need none of
          this, which is exactly the distinction slide 32 is drawing.
        </p>
        <p>
          Padding is not free, and knowing why is worth a mark. The padded positions are real numbers as far as the
          network is concerned, so without a mask they contribute to the loss and to attention weights, and a batch of
          mostly-short sequences with one long one trains largely on zeros. That is the practical consequence of “text
          data has varying-length data”, and it is why <code>pack_padded_sequence</code> and attention masks exist.
        </p>
      </WhyAiml>

      <Takeaway>
        Examples in rows, features in columns, labels in a column of their own. The constant width is the
        dimensionality, and text does not have one.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  model: (
    <>
      <Para>
        Slide 33 defines a model as the <strong>computational machinery</strong> for ingesting data of one type and
        spitting out predictions of a possibly different type. The “possibly different type” is doing work: audio in,
        yes or no out; image in, text out.
      </Para>
      <Para>
        And then the definition of deep learning in terms of this component:{' '}
        <strong>
          deep learning models consist of many successive transformations of the data, chained together top to bottom
        </strong>{' '}
        — which, the slide says, is where the name comes from.
      </Para>
      <Para>
        Slides 38 to 40 work an example: the wake-word detector that decides whether a snippet of audio contains
        “Alexa”. It is worth following slowly, because it introduces three words that are easy to blur together.
      </Para>
      <List
        items={[
          <>
            A <strong>program with parameters</strong>: a flexible program whose behaviour is decided by a number of
            values that have not been chosen yet.
          </>,
          <>
            A <strong>model</strong>: what you have once those parameters are fixed. Slide 39 says exactly that — after
            fixing the parameters, we call the program a model.
          </>,
          <>
            A <strong>model family</strong>: the set of all distinct programs you can produce just by manipulating the
            parameters. The deck’s example is that the same family should suit “Alexa” and “Hey Siri”, because the two
            tasks seem similar.
          </>,
        ]}
      />

      <Lab>
        <ModelFamilyLab />
      </Lab>

      <Para>
        Slide 40 adds the fourth word. The meta-program that uses the dataset to <em>choose</em> the parameters is the{' '}
        <strong>learning algorithm</strong>, and learning is the process of discovering the right setting of the
        parameters. The training picture beside it is a loop: design a model, grab new data, check if it is good enough,
        update the model, round again.
      </Para>

      <Terms
        items={[
          {
            term: 'model family',
            def: 'Every program you could get out of one design just by changing its numbers. Choosing a family is a design decision; choosing within it is what training does.',
          },
          {
            term: 'parameter',
            def: 'A number the learning algorithm is allowed to set. Weights and biases.',
          },
          {
            term: 'hyperparameter',
            def: 'A number you set before training that the algorithm is not allowed to change — how many layers, how wide, what learning rate. It picks the family; the parameters pick the member.',
          },
          {
            term: 'learning algorithm',
            def: 'The meta-program that reads the data and chooses the parameters. Slide 40 calls it exactly that.',
          },
        ]}
      />

      <Beyond>
        The parameter/hyperparameter line is the one exams push on. Number of layers is a hyperparameter; the weights in
        those layers are parameters. Learning rate is a hyperparameter. The threshold you compare a score against is a
        hyperparameter — which is why part 10’s lab lets you drag it and watch the error rate move without the model
        changing at all.
      </Beyond>

      <WhyAiml method="nn.Module and model.parameters()">
        <p className="mb-2">
          The distinction is built into the library. Anything you register on a <code>nn.Module</code> as a{' '}
          <code>Parameter</code> is returned by <code>model.parameters()</code> and handed to the optimiser; everything
          else — the number of layers, the width, the choice of activation — is fixed the moment you construct the
          object. Writing <code>optimizer = SGD(model.parameters(), lr=0.01)</code> is drawing exactly the line slide 39
          draws between the family and the member.
        </p>
        <p>
          The consequence that costs people days: a hyperparameter cannot be improved by training, so the only way to
          choose one is to train several times and compare on held-back data. That is what module 8’s neural network
          search is about, and it is why a hyperparameter accidentally left inside <code>parameters()</code> — or a
          layer accidentally left out of it — produces a model that trains without complaint and never improves.
        </p>
      </WhyAiml>

      <Takeaway>
        A family is a program with holes in it; a model is that program with the holes filled; the learning algorithm is
        what fills them. Deep just means the program is a chain of transformations.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  objective: (
    <>
      <Para>
        Slide 34 begins with a definition of learning that is worth writing down on its own:{' '}
        <strong>learning means improving at some task over time</strong>. To make that formal you need a formal measure
        of how good or bad a model is, and those measures are the <strong>objective functions</strong>.
      </Para>
      <Para>
        Then the convention, and it is only a convention: objective functions are defined so that{' '}
        <strong>lower is better</strong>. Because lower is better, they are usually called{' '}
        <strong>loss functions</strong>. There is no deep reason for the direction — it is chosen so that every problem
        is a minimisation and one piece of machinery can solve all of them.
      </Para>
      <Para>Slide 35 gives the two standard choices:</Para>
      <List
        items={[
          <>
            To predict numerical values — regression — the most common loss is <strong>squared error</strong>.
          </>,
          <>
            For classification, the most common objective is to minimise the <strong>error rate</strong>: the fraction
            of examples on which the predictions disagree with the ground truth.
          </>,
        ]}
      />

      <Lab>
        <LossCompareLab />
      </Lab>

      <Para>
        The lab is worth doing before reading on. Leave the threshold at 0.5, press <strong>Model A</strong>, then press{' '}
        <strong>Model B</strong>, and watch the two read-outs swap their opinion. Squared error prefers A; error rate
        prefers B. Both measures are correct; they are measuring different things.
      </Para>

      <Terms
        items={[
          {
            term: 'squared error',
            def: 'Add up (prediction − truth)² over the examples. Squaring makes every error positive and makes a big error count much more than several small ones.',
          },
          {
            term: 'error rate',
            def: 'The fraction of examples the model gets wrong. It only looks at which side of the threshold each score fell, never at how far.',
          },
          {
            term: 'ground truth',
            def: 'The right answer, as recorded in the data. Not necessarily the truth about the world — a mislabelled example is still ground truth as far as training is concerned.',
          },
          {
            term: 'minimise',
            def: 'Find the input that makes a function as small as it goes. Because losses are written so lower is better, training is always minimisation.',
          },
        ]}
      />

      <Beyond>
        There is a reason deep learning almost never actually minimises the error rate, even for classification. Error
        rate is flat: nudge a weight a little and no example changes side, so the number does not move at all, and then
        one example crosses over and it jumps. A function that is flat everywhere and then jumps has a derivative of
        zero everywhere it is defined — so gradient descent has nothing to follow. What gets minimised in practice is a
        smooth stand-in like cross-entropy, and the error rate is what gets <em>reported</em>. That distinction between
        the loss you optimise and the metric you report is one of the most useful things to carry out of this session.
      </Beyond>

      <Para>
        Slide 36 adds the two remaining facts about loss. It is defined{' '}
        <strong>with respect to the model parameters</strong> and <strong>depends upon the dataset</strong> — so the
        same model has a different loss on different data, which is the entire subject of the next part.
      </Para>

      <WhyAiml method="nn.MSELoss against nn.CrossEntropyLoss">
        <p className="mb-2">
          These two lines of the slide are two lines of PyTorch. <code>nn.MSELoss()</code> is squared error, for a
          numerical target; <code>nn.CrossEntropyLoss()</code> is the smooth stand-in for error rate, for a categorical
          one. Both return a single number with <code>lower is better</code> baked in, which is why{' '}
          <code>loss.backward()</code> can be the same call in both cases.
        </p>
        <p>
          The decision this settles in practice is what to do when your accuracy is fine and your users are not. If a
          missed tumour is far worse than a false alarm, the error rate is the wrong objective — it treats the two the
          same — and no amount of training will fix that, because the model is optimising exactly what you asked. The
          cure is to change the objective: weight the classes, or move the threshold, both of which the lab above lets
          you do and watch.
        </p>
      </WhyAiml>

      <Takeaway>
        Lower is better, by convention. Squared error for numbers, error rate for categories — and the two can rank the
        same pair of models in opposite orders.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  generalise: (
    <>
      <Para>
        Slide 36 makes the most important point in the deck, and it makes it in one sentence. We learn the best values
        of the parameters by minimising the loss on a set of examples collected for training —{' '}
        <strong>however, doing well on the training data does not guarantee that we will do well on unseen data</strong>
        . The model has to <strong>generalise</strong>.
      </Para>
      <Para>
        When a model performs well on the training set but fails to generalise to unseen data, we say it is{' '}
        <strong>overfitting</strong>. That is the definition, in the deck’s own words, and it is the one to reproduce.
      </Para>

      <Lab>
        <OverfitLab />
      </Lab>

      <Para>
        Turn the degree slider up slowly and watch the two read-outs part company. The training loss falls the whole
        way, because a more flexible curve can always get closer to points it is allowed to see. The unseen loss falls,
        bottoms out, and then climbs — and the moment it starts climbing is the moment the extra flexibility stopped
        describing the pattern and started describing the noise.
      </Para>

      <Terms
        items={[
          {
            term: 'generalise',
            def: 'Do well on data the model has never seen. The only thing anybody actually wants; training loss is a means to it, not the goal.',
          },
          {
            term: 'overfitting',
            def: 'Doing well on the training set and badly on unseen data. Slide 36 defines it in exactly those terms.',
          },
          {
            term: 'unseen data',
            def: 'Examples held back from training. The held-back test set from the ML course.',
          },
          {
            term: 'noise',
            def: 'The part of the data that is not the pattern — measurement error, randomness, mislabelling. It cannot be predicted, so any model that appears to predict it has memorised it.',
          },
          {
            term: 'capacity',
            def: 'How complicated a pattern a model can express. More parameters usually means more capacity, and more capacity means more room to overfit.',
          },
        ]}
      />

      <Beyond>
        Overfitting has a mirror image nobody notices as often. If the training loss is also bad, more flexibility is
        exactly what you need — that is <strong>underfitting</strong>, and it looks nothing like overfitting even though
        both show a disappointing test score. The diagnostic is one comparison: training loss bad means underfitting;
        training loss good and test loss bad means overfitting. Reading the two numbers together, rather than the test
        number alone, is the habit worth building.
      </Beyond>

      <WhyAiml method="weight_decay, nn.Dropout and early stopping">
        <p className="mb-2">
          Module 4 of this course is called “improve the DNN performance by optimization and regularization”, and the
          regularization half is entirely about this slide. The three standard tools are{' '}
          <code>optim.SGD(..., weight_decay=1e-4)</code>, which penalises large weights; <code>nn.Dropout(p=0.5)</code>,
          which switches units off at random during training so no one of them can be relied on; and early stopping,
          which is just watching the held-back loss and halting where the lab’s curve turns.
        </p>
        <p>
          What this settles is the most common wrong instinct in a first deep learning project — that a disappointing
          model needs to be bigger. If the training loss is already near zero, a bigger model makes it worse and not
          better, and the fix is more data or more regularisation. The deck’s sentence is the reason every honest
          benchmark quotes a number from data the model never saw.
        </p>
      </WhyAiml>

      <Takeaway>
        Training loss is a means, not the goal. When it keeps improving while the unseen loss gets worse, the model is
        overfitting — memorising the noise instead of learning the pattern.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  optimiser: (
    <>
      <Para>
        The fourth component gets one slide. An <strong>optimisation algorithm</strong> is an algorithm capable of{' '}
        <strong>searching for the best possible parameters for minimising the loss function</strong>, and the popular
        ones for deep learning are all based on an approach called <strong>gradient descent</strong>.
      </Para>
      <Para>
        That is all slide 37 says, and it is enough, because gradient descent is not new to you — it is a concept page
        of the Mathematical Foundations course. What is worth doing here is seeing the one behaviour that the whole of
        module 4 exists to manage.
      </Para>

      <Lab>
        <DescentLab />
      </Lab>

      <Para>
        Press <strong>Step</strong> a few times with η at 0.3 and the marker walks down into the bowl. Now set η to 1.1
        and press <strong>Reset</strong>, then <strong>Run 12</strong>. Every step overshoots by more than it came in
        with, and the parameter walks out of the picture. Nothing about the loss changed — only how far each step moves.
      </Para>

      <Terms
        items={[
          {
            term: 'gradient',
            def: 'The slope of the loss with respect to a parameter: how much the loss changes when that parameter changes a little. With many parameters it is one slope per parameter, collected into a vector.',
          },
          {
            term: 'gradient descent',
            def: 'Repeatedly move each parameter a little way against its slope. Downhill, in other words, one small step at a time.',
          },
          {
            term: 'η',
            say: 'eta',
            def: 'The learning rate. How far to move per unit of slope. It is a hyperparameter — training never adjusts it, you do.',
          },
          {
            term: 'converge',
            def: 'Settle down and stop moving. The opposite is to diverge — to keep getting further away, which is what a learning rate that is too large produces.',
          },
          {
            term: 'local minimum',
            def: 'A point where the loss is lower than everywhere nearby, but not necessarily lower than everywhere. The bowl in the lab has only one; a real network’s loss has enormous numbers of them.',
          },
        ]}
      />

      <Beyond>
        The bowl in the lab is the easy case: one parameter, one minimum, and a slope that points straight at it. A real
        network has millions of parameters and a loss surface nobody can draw. Almost everything in module 4 — momentum,
        Adam, learning-rate schedules, batch normalisation — is a way of coping with that difference while keeping the
        same one-line update. If you can say what η does in the lab, you can read all of them.
      </Beyond>

      <WhyAiml method="torch.optim.SGD(lr=…) and torch.optim.Adam">
        <p className="mb-2">
          Every optimiser in <code>torch.optim</code> is the update in this lab with modifications.{' '}
          <code>SGD(model.parameters(), lr=0.01)</code> is exactly it. <code>SGD(..., momentum=0.9)</code> adds a
          running average of past steps so the marker does not stop in every dip. <code>Adam</code> keeps a separate
          effective learning rate per parameter. The interface is identical because the idea is: read the slope, move
          against it.
        </p>
        <p>
          The failure this explains is the most common one in a first training run: the loss becomes <code>nan</code> in
          the first few hundred steps. That is the divergence in the lab, in a network — the learning rate was too big,
          the steps overshot, and the numbers grew until they overflowed. The standard response is to divide the
          learning rate by ten, which is a strange thing to reach for until you have watched a marker walk out of a
          bowl.
        </p>
      </WhyAiml>

      <Takeaway>
        The fourth component searches for parameters, and in deep learning it always searches downhill. The step size is
        yours to choose, and too large does not mean slower — it means never arriving.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  brain: (
    <>
      <Para>
        The second half of the session changes subject. Slide 44 starts from the brain: humans learn, solve problems,
        recognise patterns, create and think, and they learn through <strong>association</strong> — the slide points at
        associationism for the detail.
      </Para>
      <Para>Slide 45 turns that into numbers, and the numbers are an argument rather than trivia.</Para>
      <List
        items={[
          <>The brain is a mass of interconnected neurons. There are roughly 10¹⁰ of them.</>,
          <>Each one connects to roughly 10⁴ to 10⁵ others.</>,
          <>A neuron takes about 0.001 second — a millisecond — to switch.</>,
          <>A scene is recognised in about a second.</>,
          <>
            And the conclusion:{' '}
            <strong>100 inference steps does not seem like enough. Lot of parallel computation.</strong>
          </>,
        ]}
      />

      <Lab>
        <BrainStepsLab />
      </Lab>

      <Careful>
        The slide’s own arithmetic does not close. One second divided by one millisecond is 1000, not 100. The figure of
        100 comes from 0.1 second, which is the number used in Mitchell’s Chapter 4 — the reference slide 82 gives for
        this whole half of the session. The lab computes the division from whatever you set, and shows both; neither is
        presented here as the answer, because the slide does not settle it.
      </Careful>

      <Para>
        Whichever figure you take, the argument survives intact, and that is the point. A few hundred or a few thousand
        switches <em>in sequence</em> is nothing like enough to explain what happens in that second. So it cannot be a
        long chain — it has to be an enormous number of very simple things happening at once. That observation, not any
        biological detail, is what the architecture copies.
      </Para>

      <Para>
        Slides 46 to 48 fill in the picture. Many neurons connect into each neuron, and each connects out to many. Slide
        47 labels a biological neuron: dendrites, cell body, nucleus, axon, myelin sheath, nodes of Ranvier, Schwann
        cell, axon terminal. And slide 48 gives the family name — a network of processing elements in which{' '}
        <strong>all world knowledge is stored in the connections between these elements</strong> is a{' '}
        <strong>connectionist machine</strong>, and neural networks are connectionist machines.
      </Para>

      <Terms
        items={[
          {
            term: 'dendrite',
            say: 'DEN-drite',
            def: 'The branching input end of a biological neuron, where signals arrive from other neurons. The x inputs of the artificial neuron correspond to these.',
          },
          {
            term: 'axon',
            say: 'AX-on',
            def: 'The single long output fibre. Whatever the cell decides travels down here to everything it connects to.',
          },
          {
            term: 'cell body',
            def: 'Where the arriving signals are combined and the decision to fire is made. The Σ and the activation function correspond to this.',
          },
          {
            term: 'myelin sheath',
            say: 'MY-uh-lin',
            def: 'The insulating layer along the axon, with gaps called nodes of Ranvier, which makes the signal travel faster. It has no counterpart in the artificial model at all — which is the point of noticing it.',
          },
          {
            term: 'connectionist',
            def: 'Storing what is known in the connections between many simple units, rather than in explicit rules. The knowledge is not in any one unit and cannot be read off one.',
          },
          {
            term: 'inference step',
            def: 'One switching of a neuron, in this argument. Steps in sequence are limited by time; steps in parallel are not.',
          },
        ]}
      />

      <Beyond>
        This argument is why depth and width are different resources. Steps <em>in sequence</em> — depth — are what the
        millisecond budget limits. Steps <em>in parallel</em> — width — are essentially free to the brain, and cheap on
        a GPU for the same reason. It is a good way to remember what a GPU is actually buying you: not faster steps, but
        far more of them at once.
      </Beyond>

      <WhyAiml method="torch.matmul on a batch — width is parallel, depth is not">
        <p className="mb-2">
          The one structural fact this half of the deck hands you is that a layer’s units do not depend on each other.
          Every unit in a layer reads the same inputs and none reads another’s output, so all of them can be computed at
          once — which is exactly why a layer is written as a single matrix multiply and why <code>torch.matmul</code>{' '}
          on a GPU is thousands of times faster than a Python loop over units.
        </p>
        <p>
          Depth does not get that. Layer 2 cannot start until layer 1 has finished, so the layers are strictly
          sequential and a hundred-layer network has a hundred unavoidable stages both forwards and backwards. That is
          the practical reason very deep models are slow to train even on enormous hardware, and it is the same
          sequential-versus-parallel budget slide 45 is doing arithmetic about.
        </p>
      </WhyAiml>

      <Takeaway>
        The brain gets about a thousand sequential switches per second of thought, and does far more than that in one.
        So it must be massively parallel — and the knowledge sits in the connections, not in the units.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  neuron: (
    <>
      <Para>
        Slide 49 is the whole of artificial neural networks in one picture. Three inputs labelled x₀, x₁ and x₂ arrive
        along arrows; the arrows meet at a circle split in two, with a Σ on the left and an f on the right; and one
        output ŷ leaves it.
      </Para>
      <Para>
        Read left to right, that is: each input is multiplied by the weight on its arrow, the results are added up, and
        the total is passed through a function that decides what to say. Everything else in this course is that, with
        more of them.
      </Para>

      <Lab>
        <NeuronLab />
      </Lab>

      <Para>
        Two things in the lab are worth doing on purpose. Drag the input across the black line and watch the answer flip
        — the line is where the sum is exactly zero. Then set both w₁ and w₂ to zero: the shading goes flat, because
        with no direction to look along the neuron says the same thing about every input there is.
      </Para>

      <Terms
        items={[
          {
            term: 'Σ',
            say: 'sigma',
            def: 'Add up. Σ wᵢxᵢ means "multiply each weight by its input and add all the results together". It is the capital Greek S, for sum.',
          },
          {
            term: 'ŷ',
            say: 'y-hat',
            def: 'The prediction. The hat means "this is the model’s guess", as opposed to plain y or t, which mean the real answer.',
          },
          {
            term: 'weight',
            def: 'The number on one arrow. How much that input counts, and in which direction — a negative weight means that input argues against firing.',
          },
          {
            term: 'x₀',
            def: 'The constant input, always 1. It exists so that w₀ has something to ride on and can be treated like any other weight. Slide 56 states x₀ = 1 always.',
          },
          {
            term: 'bias',
            def: 'w₀, the weight on the constant input. It slides the decision boundary without turning it — which the lab shows directly.',
          },
          {
            term: 'f',
            def: 'The activation function: what turns the sum into the output. In this session it is a threshold; later modules replace it with something smooth.',
          },
        ]}
      />

      <Para>Slide 50 lists what a network of these has:</Para>
      <List
        items={[
          <>Many neuron-like threshold switching units.</>,
          <>Many weighted interconnections among units.</>,
          <>A highly parallel, distributed process.</>,
          <>Emphasis on tuning the parameters — the weights — automatically.</>,
        ]}
      />
      <Para>
        And slide 51 says when to reach for one: the input is high-dimensional, discrete or real-valued, possibly noisy
        with lots of errors; the output is discrete, real-valued, or a vector of values; the form of the target function
        is <strong>unknown</strong>; and human readability of the result — explainability —{' '}
        <strong>is unimportant</strong>. The examples given are speech phoneme recognition, image classification and
        financial prediction.
      </Para>

      <Careful>
        That fourth condition is a genuine warning, not a boast. If you are in medicine, credit or law you may be
        legally required to explain a decision, and slide 51 is telling you plainly that this method does not offer
        that. The knowledge is spread across every connection and cannot be read off any one of them — that is what
        “connectionist” means, and the cost of it.
      </Careful>

      <WhyAiml method="nn.Linear(in_features, out_features)">
        <p className="mb-2">
          One line of PyTorch is a whole layer of these neurons: <code>nn.Linear(3, 1)</code> holds a 1 × 3 weight
          matrix and one bias, and computes exactly the Σ on this slide. <code>nn.Linear(3, 8)</code> is eight of these
          neurons sharing the same three inputs, stacked into an 8 × 3 matrix — and the bias vector is the eight w₀
          terms, which is why <code>bias=True</code> is the default and why turning it off changes what the layer can
          represent.
        </p>
        <p>
          The consequence worth carrying: without the bias, every boundary is forced through the origin. Set w₀ to zero
          in the lab and drag the weights around — the black line will pass through the middle of the plot whatever you
          do, and any dataset whose two classes are not arranged around the origin becomes unlearnable. That is the
          whole job of one number.
        </p>
      </WhyAiml>

      <Takeaway>
        Multiply each input by its weight, add them up, decide. The weights are what is learnt, the bias is the weight
        on a constant input of 1, and everything after this is more of the same unit.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  perceptron: (
    <>
      <Para>
        Slide 53 gives the definition to memorise, word for word:{' '}
        <strong>
          a perceptron takes a vector of real-valued inputs, calculates a linear combination of these inputs, and then
          outputs a 1 if the result is greater than some threshold and −1 otherwise
        </strong>
        .
      </Para>
      <Para>Written out, that is two lines:</Para>
      <Worked title="The perceptron, slide 53">
        {`z = Σ  wᵢ xᵢ        for i = 0, 1, 2
        i

h = +1   if  Σ wᵢxᵢ  >  0
h = −1   if  Σ wᵢxᵢ  ≤  0

Inputs → Weights → Hypothesis (z) → Activation (h) → Output (ŷ)`}
      </Worked>
      <Para>
        The row of labels along the bottom of the slide — inputs, weights, hypothesis, activation, output — is the
        vocabulary for the rest of the course. <em>Hypothesis</em> is the weighted sum before any decision;{' '}
        <em>activation</em> is what turns it into an answer.
      </Para>

      <Lab>
        <PerceptronThresholdLab />
      </Lab>

      <Para>
        Note where the threshold went. The definition says “greater than some threshold”, and the formula says greater
        than zero. Those agree because of x₀: a threshold θ on the right-hand side becomes a weight w₀ = −θ on a
        constant input of 1, moved over to the left. That is the only reason the constant input exists, and it is why
        every formula from here on compares against zero.
      </Para>

      <Careful>
        The second line uses ≤, not {'<'}. A sum of exactly zero gives −1. It looks like a detail and it is not: the
        hand solution for the NOT gate two pages from now produces a sum of exactly zero on one of its rows, and only
        works because of this line. Press <strong>Put the boundary exactly on that point</strong> in the lab to see it.
      </Careful>

      <Terms
        items={[
          {
            term: 'linear combination',
            def: 'Multiply each thing by a number and add the results. w₀x₀ + w₁x₁ + w₂x₂ is a linear combination of the inputs — the same phrase, and the same object, as in Lecture 2 of the maths course.',
          },
          {
            term: 'threshold',
            def: 'The value the sum has to beat. Absorbed into w₀ so that the comparison is always against zero.',
          },
          {
            term: 'hypothesis',
            def: 'The weighted sum z, before any decision is taken. The slide labels it that.',
          },
          {
            term: 'activation function',
            def: 'What turns z into an output. Here it is sign: +1 above zero, −1 at or below it.',
          },
          {
            term: 'sign(z)',
            say: 'sign of z',
            def: 'The function that reports which side of zero a number is on. In this deck sign(0) = −1, as the trace table on slide 69 confirms.',
          },
          {
            term: 'decision boundary',
            def: 'The set of inputs where z is exactly zero — the dividing line between the two answers.',
          },
        ]}
      />

      <Beyond>
        The ±1 output rather than 0/1 is not arbitrary. With targets in {'{'}−1, +1{'}'} the quantity (t − o) in the
        learning rule is 0 when the answer is right and ±2 when it is wrong, so the rule is symmetric and does nothing
        on a correct example. Slide 55 quietly rewrites the NOT gate’s 0/1 truth table into ±1 for exactly this reason,
        and every gate in this session is in that encoding.
      </Beyond>

      <WhyAiml method="why nn.Sigmoid and nn.ReLU replaced the step">
        <p className="mb-2">
          The threshold on this slide is the reason the perceptron is where this course starts and not where it stays. A
          step function has a derivative of exactly zero everywhere except at one point, where it does not exist — so
          <code> loss.backward()</code> through it returns nothing to work with, and gradient descent is dead on
          arrival. That is precisely why <code>nn.Sigmoid</code>, and later <code>nn.ReLU</code>, exist: they keep the
          shape of a decision while having a slope you can follow.
        </p>
        <p>
          The perceptron gets away with it because its learning rule never differentiates anything — it just adds η(t −
          o)x, which you will meet in part 19. The moment you want more than one layer, that trick stops working,
          because there is no t for a hidden unit. Module 2 replaces the step, module 3 stacks the result, and the whole
          sequence is set up by this one line of slide 53.
        </p>
      </WhyAiml>

      <Takeaway>
        z is the weighted sum; h is +1 if z {'>'} 0 and −1 if z ≤ 0. The threshold lives in w₀ so the comparison is
        always against zero, and z exactly zero gives −1.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  notgate: (
    <>
      <Para>
        Slide 54 makes the claim this section exists to test:{' '}
        <strong>a perceptron can represent all of the primitive Boolean functions AND, OR, NAND and NOR</strong>, which
        are linearly separable — but some Boolean functions, such as <strong>XOR</strong>, cannot be represented by a
        single perceptron, because they are not linearly separable. It adds that the perceptron learning rule finds a
        successful weight vector when the examples are linearly separable, and{' '}
        <strong>can fail to converge if they are not</strong>.
      </Para>
      <Para>
        The next several slides work through this claim gate by gate, by hand, without any training at all. The method
        is worth learning as a method, because it turns up in exams:{' '}
        <em>
          turn each row of the truth table into a condition on the weights, then find any weights satisfying all of them
          at once.
        </em>
      </Para>
      <Para>
        Slide 55 sets up the easiest case. NOT has one input. Its truth table is A = 0 → B = 1 and A = 1 → B = 0, and
        the slide rewrites it into the ±1 encoding: x₁ = −1 → t = 1, and x₁ = 1 → t = −1.
      </Para>

      <Lab>
        <NotGateLab />
      </Lab>

      <Para>
        Slide 56 does the algebra. The perceptron equation is ŷ = w₀x₀ + w₁x₁ with x₀ = 1 always, and h has to be
        greater than zero for the output to be 1. Taking the rows one at a time:
      </Para>
      <Worked title="Two rows, two conditions">
        {`Row 1:  x₁ = −1, want t = +1, so we need z > 0

        z = w₀·1 + w₁·(−1)
          = w₀ − w₁
        so       w₀ − w₁ > 0

Row 2:  x₁ = +1, want t = −1, so we need z ≤ 0

        z = w₀·1 + w₁·(1)
          = w₀ + w₁
        so       w₀ + w₁ ≤ 0

The deck's answer:  w₀ = 1,  w₁ = −1

Check row 1:  1 − (−1) = 2  > 0   ✓  gives +1
Check row 2:  1 + (−1) = 0  ≤ 0   ✓  gives −1`}
      </Worked>
      <Para>
        Slide 56 calls w₀ = 1, w₁ = −1 the intuitive solution, and says it gives a beautiful linear decision boundary.
        With one input the boundary is a single point on the number line: z = 0 when w₀ + w₁x₁ = 0, that is at x₁ = 1.
      </Para>

      <Careful>
        Slide 56 writes the second condition as <strong>w₀ + w₁ {'<'} 0</strong> — strictly less than — and then offers
        w₀ = 1, w₁ = −1, which makes it exactly 0. The answer is right and the inequality as printed is not: it should
        be ≤, to match the activation rule on slide 53 that sends z = 0 to −1. Use ≤ and everything is consistent. This
        is worth knowing before an exam, because a strict reading of the slide would reject the slide’s own answer.
      </Careful>

      <Terms
        items={[
          {
            term: 'Boolean function',
            say: 'BOOL-ee-an',
            def: 'A function whose inputs and output are each true or false. AND, OR, NOT, NAND, NOR and XOR are the ones this session uses.',
          },
          {
            term: 'truth table',
            def: 'The complete list of what a Boolean function outputs for every possible input. With two inputs there are four rows, and the table is the entire specification.',
          },
          {
            term: 'linearly separable',
            def: 'The two classes can be split by one straight line — or in more dimensions, one flat surface. Slide 54 says this is exactly the condition for a single perceptron to work.',
          },
          {
            term: 'the ±1 encoding',
            def: 'Writing false as −1 rather than 0. Slide 55 does this rewrite explicitly, and every gate after it is in these coordinates.',
          },
        ]}
      />

      <Beyond>
        Doubling both weights gives w₀ = 2, w₁ = −2, which satisfies both conditions just as well — press the second
        button in the lab. That is not a coincidence and it matters two pages from now: the perceptron rule, started
        from zero, converges on exactly (2, −2). The conditions are inequalities, not equations, so their solutions form
        a whole region rather than a point, and every scaling of a solution is another solution.
      </Beyond>

      <WhyAiml method="the bias term, and why nn.Linear defaults to bias=True">
        <p className="mb-2">
          Solving a gate by hand is the clearest demonstration of what w₀ is for. Both conditions above involve w₀, and
          without it — with the boundary forced through the origin — you would need w₁·(−1) {'>'} 0 and w₁·(1) ≤ 0 at
          once, which needs w₁ both positive and non-positive. Even NOT is unlearnable without a bias.
        </p>
        <p>
          That is why every dense layer in PyTorch has <code>bias=True</code> by default, and why turning it off is a
          deliberate act reserved for cases where a following batch-norm layer supplies its own shift. If a model with
          plenty of capacity refuses to fit something trivial, an accidentally disabled bias is one of the few
          explanations, and this gate is the two-line proof of why.
        </p>
      </WhyAiml>

      <Takeaway>
        Each row of a truth table becomes one inequality in the weights. NOT gives w₀ − w₁ {'>'} 0 and w₀ + w₁ ≤ 0, and
        w₀ = 1, w₁ = −1 satisfies both — the second one exactly.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  andor: (
    <>
      <Para>
        With two inputs the perceptron is ŷ = w₀x₀ + w₁x₁ + w₂x₂, the truth table has four rows, and the method is
        unchanged: one inequality per row, then find weights satisfying all four.
      </Para>
      <Para>
        Slide 58 does AND. In the ±1 encoding the table is (−1, −1) → −1, (−1, 1) → −1, (1, −1) → −1 and (1, 1) → +1 —
        only the last row wants the neuron to fire.
      </Para>
      <Worked title="AND, from slide 58">
        {`w₀ + w₁(−1) + w₂(−1)  <  0        row 1
w₀ + w₁(−1) + w₂( 1)  <  0        row 2
w₀ + w₁( 1) + w₂(−1)  <  0        row 3
w₀ + w₁( 1) + w₂( 1)  >  0        row 4

The deck's answer:  w₁ = w₂ = 2,  w₀ = −1

Check row 1:  −1 − 2 − 2 = −5  < 0   ✓
Check row 2:  −1 − 2 + 2 = −1  < 0   ✓
Check row 3:  −1 + 2 − 2 = −1  < 0   ✓
Check row 4:  −1 + 2 + 2 =  3  > 0   ✓`}
      </Worked>
      <Para>
        Slide 61 does OR. Now three rows fire and only (−1, −1) does not, and the deck’s answer is w₀ = w₁ = w₂ = 2.
      </Para>
      <Worked title="OR, from slide 61">
        {`w₀ + w₁(−1) + w₂(−1)  <  0        row 1
w₀ + w₁(−1) + w₂( 1)  >  0        row 2
w₀ + w₁( 1) + w₂(−1)  >  0        row 3
w₀ + w₁( 1) + w₂( 1)  >  0        row 4

The deck's answer:  w₀ = w₁ = w₂ = 2

Check row 1:  2 − 2 − 2 = −2  < 0   ✓
Check row 2:  2 − 2 + 2 =  2  > 0   ✓
Check row 3:  2 + 2 − 2 =  2  > 0   ✓
Check row 4:  2 + 2 + 2 =  6  > 0   ✓`}
      </Worked>

      <Lab>
        <AndOrLab />
      </Lab>

      <Para>
        Both answers are checked by the lab, row by row, every time you press the button — the ticks in the table are
        computed from the weights you can see, not typed in. And the geometry is worth a moment: for AND the boundary is
        the line x₁ + x₂ = ½, which separates the single point (1, 1) from the other three; for OR it is x₁ + x₂ = −1,
        which separates (−1, −1) from the other three. One point cut off from three, in each case, and a straight line
        can always do that.
      </Para>

      <Careful>
        Slides 59 and 62 both show the weights beside a truth table written in <strong>0 and 1</strong>, and both use
        the same scatter plot with the axes running 0 to 1. The weights on those slides are the ones derived in the ±1
        encoding, and they do not reproduce the 0/1 table — with w = (−1, 2, 2) and inputs (0, 1), the sum is +1, but
        AND(0, 1) is 0. Nothing is broken about the answers; the two slides have simply put the ±1 weights next to the
        0/1 picture. Work in the ±1 encoding, as slide 55 sets up, and everything checks.
      </Careful>

      <Terms
        items={[
          {
            term: 'AND',
            def: 'True only when both inputs are true.',
          },
          {
            term: 'OR',
            def: 'True when at least one input is true — the inclusive or, so it is also true when both are.',
          },
          {
            term: 'system of inequalities',
            def: 'Several conditions that must all hold at once, each a "greater than" or "less than" rather than an equals. The answers form a region, not a point.',
          },
          {
            term: 'x₁ + x₂ = ½',
            def: 'The AND boundary in the ±1 encoding, got by dividing −1 + 2x₁ + 2x₂ = 0 through by 2. Worth doing once so the picture and the weights stop feeling like separate facts.',
          },
        ]}
      />

      <Beyond>
        Here is the pattern behind both answers, and it makes the exercise on the next page almost instant. In the ±1
        encoding, x₁ + x₂ takes only three values: −2, 0 and +2. AND wants to cut off just the +2 case, so the bias sits
        between 0 and 2 — any w₀ with −2 {'<'} w₀ {'<'} 0 works alongside w₁ = w₂ = 1. OR wants to cut off just the −2
        case, so the bias sits between −2 and 0. Every correct answer to these two questions is a point in one of those
        two intervals.
      </Beyond>

      <WhyAiml method="LogisticRegression — the same boundary, with a probability on it">
        <p className="mb-2">
          A perceptron and a logistic regression are the same w · x + b with a different last step: sign for one, the
          sigmoid for the other. So the weights you have just solved by hand are the same object{' '}
          <code>LogisticRegression().fit(X, y)</code> searches for, and <code>clf.coef_</code> and{' '}
          <code>clf.intercept_</code> are w₁, w₂ and w₀. Solving four inequalities by hand is doing, exactly, what that
          call does numerically.
        </p>
        <p>
          The difference is what happens near the boundary. A perceptron says +1 with total confidence a hair above the
          line; logistic regression says 0.51. That is why classification in practice reports probabilities and lets you
          move the threshold afterwards — a decision you saw in part 10 change the error rate without changing the model
          at all.
        </p>
      </WhyAiml>

      <Takeaway>
        AND is w = (−1, 2, 2) and OR is w = (2, 2, 2), in the ±1 encoding. In both cases one point is cut off from
        three, and a straight line can always manage that.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  exercise: (
    <>
      <Para>
        Slide 60 sets three exercises: represent OR, NOR and NAND with a perceptron, and compute the parameters. The
        deck answers the first of them on slide 61 — that is the previous page — and leaves NOR and NAND to you.
      </Para>
      <Para>
        Both fall out of one observation. <strong>NOR is NOT OR, and NAND is NOT AND</strong>, and negating a
        perceptron’s output is the same as negating every one of its weights: if z {'>'} 0 gave +1, then −z {'>'} 0
        gives +1 exactly when the original gave −1.
      </Para>

      <Worked title="NOR: negate every weight of OR">
        {`OR is    w = ( 2,  2,  2)
so NOR is w = (−2, −2, −2)

Truth table in the ±1 encoding, and the check:

  x₁   x₂    t     z = −2 − 2x₁ − 2x₂        h    ok
  −1   −1   +1     −2 + 2 + 2 =  2  > 0     +1    ✓
  −1    1   −1     −2 + 2 − 2 = −2  ≤ 0     −1    ✓
   1   −1   −1     −2 − 2 + 2 = −2  ≤ 0     −1    ✓
   1    1   −1     −2 − 2 − 2 = −6  ≤ 0     −1    ✓

All four rows agree.`}
      </Worked>

      <Worked title="NAND: negate every weight of AND">
        {`AND is    w = (−1,  2,  2)
so NAND is w = ( 1, −2, −2)

  x₁   x₂    t     z = 1 − 2x₁ − 2x₂         h    ok
  −1   −1   +1      1 + 2 + 2 =  5  > 0     +1    ✓
  −1    1   +1      1 + 2 − 2 =  1  > 0     +1    ✓
   1   −1   +1      1 − 2 + 2 =  1  > 0     +1    ✓
   1    1   −1      1 − 2 − 2 = −3  ≤ 0     −1    ✓

All four rows agree.`}
      </Worked>

      <Para>
        Neither of these answers is on the slides. They were worked out here by negating the deck’s own answers, and
        then checked against all four rows of each truth table — first by hand above, and again by the lab below, which
        recomputes every z from the weights you can see rather than storing a result.
      </Para>

      <Lab>
        <GateExerciseLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'NAND',
            say: 'NAND, as one word',
            def: 'Not-and. False only when both inputs are true, and true otherwise. It is the exact opposite of AND, row for row.',
          },
          {
            term: 'NOR',
            def: 'Not-or. True only when both inputs are false.',
          },
          {
            term: 'negating a perceptron',
            def: 'Flipping the sign of every weight, including the bias. It turns +1 into −1 and −1 into +1 on every input at once — except where z was exactly 0, which is worth checking each time.',
          },
        ]}
      />

      <Careful>
        The negation trick has one edge to watch. If some input gave z = 0 exactly, the original perceptron said −1, and
        so does the negated one, since −0 is still 0 and the rule sends it to −1. So negation is not perfectly symmetric
        — it fails on inputs sitting exactly on the boundary. Neither NOR nor NAND above has such a row, which is why
        both checks come out clean, and it is why the check was done rather than assumed.
      </Careful>

      <Beyond>
        NAND is worth more attention than the exercise suggests. It is <em>functionally complete</em>: every Boolean
        function whatsoever can be built out of NAND gates alone, and real chips are largely built that way. Since a
        single perceptron can be a NAND gate, a network of perceptrons can compute any Boolean function at all — which
        makes the XOR result five pages from now much sharper than it first looks. The limit is not on what networks can
        compute; it is on what <em>one layer</em> can compute.
      </Beyond>

      <WhyAiml method="stacking gates — the argument behind depth">
        <p className="mb-2">
          Building NAND out of one neuron and then noting that NAND is functionally complete is the cleanest available
          argument for why depth buys expressiveness. A one-layer network is stuck with whatever a single hyperplane can
          express; a network of them can express anything a circuit can. That is the same claim as the universal
          approximation theorem on the timeline, in a discrete setting where you can check it by hand.
        </p>
        <p>
          The practical residue is that the exercise on this slide is not busywork. The XOR fix in part 24 turns out to
          be OR and NAND feeding an AND — three gates you have now each solved individually. Doing the exercise means
          the last page of the session is assembly rather than a new idea.
        </p>
      </WhyAiml>

      <Takeaway>
        Negate every weight to negate the gate. NOR is (−2, −2, −2) and NAND is (1, −2, −2), both checked here against
        all four rows rather than asserted.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  learning: (
    <>
      <Para>
        Everything so far has been solved by hand. Slide 66 hands the job to an algorithm, and the whole of it is two
        lines:
      </Para>
      <Worked title="The perceptron learning rule, slide 66">
        {`wᵢ  ←  wᵢ + Δwᵢ

where

Δwᵢ  =  η (t − o) xᵢ

t = c(x)  is the target value
o         is the perceptron output
η         is a small constant, e.g. 0.1, called the learning rate`}
      </Worked>
      <Para>
        Read it slowly, because every piece of it earns its place. The arrow ← means “becomes”: the new weight is the
        old weight plus a change. The change is a product of three things, and each answers a different question.
      </Para>
      <List
        items={[
          <>
            <strong>(t − o)</strong> asks <em>were we wrong, and in which direction?</em> With targets in ±1 this is 0
            when the answer was right, +2 when the output was too low and −2 when it was too high. If it is zero,
            nothing moves at all — the rule learns only from mistakes.
          </>,
          <>
            <strong>xᵢ</strong> asks <em>did this input have anything to do with it?</em> An input that was zero gets no
            change; a large input gets a large one. The weight on the constant input x₀ = 1 always changes by η(t − o).
          </>,
          <>
            <strong>η</strong> asks <em>how far do we trust one example?</em> It scales the whole update without ever
            changing its direction.
          </>,
        ]}
      />

      <Lab>
        <UpdateRuleLab />
      </Lab>

      <Para>
        Drag the example so that the neuron already gets it right and watch every Δw go to zero. Then drag it to the
        wrong side and press <strong>Apply the update</strong>: the boundary swings towards the point. One step may not
        be enough to put it on the correct side, which is exactly why the algorithm loops.
      </Para>

      <Para>Slide 67 states the guarantee, and both halves of it are examinable. The algorithm converges if:</Para>
      <List
        items={[
          <>
            the training data is <strong>linearly separable</strong>, and
          </>,
          <>
            the <strong>learning rate is sufficiently small</strong>.
          </>,
        ]}
      />
      <Para>
        On the second, the slide adds what η is for: to{' '}
        <strong>moderate the degree to which weights are changed at each step</strong>, usually set to some small value
        such as 0.1, and sometimes made to <strong>decay</strong> as the number of weight-tuning iterations increases.
      </Para>

      <Terms
        items={[
          {
            term: '←',
            say: 'becomes',
            def: 'Assignment, not equality. w ← w + Δw means "replace w with w + Δw", the way a program does, not "w equals w plus Δw", which would be false.',
          },
          {
            term: 'Δ',
            say: 'delta',
            def: 'A change in. Δwᵢ is the amount weight i is about to move by. Capital Greek D, for difference.',
          },
          {
            term: 't = c(x)',
            def: 'The target: the correct answer for this example, written as the value of the true function c at x. c is the thing being learnt and is never known.',
          },
          {
            term: 'o',
            def: 'The output the perceptron actually gave. Elsewhere in the deck it is written h or ŷ; all three mean the same thing here.',
          },
          {
            term: 'η',
            say: 'eta',
            def: 'The learning rate. A small positive number, 0.1 in the slide’s example, that scales every update.',
          },
          {
            term: 'decay',
            def: 'Reduce over time. A learning rate that decays takes bold steps early and careful ones later, which is standard practice in every optimiser you will meet in module 4.',
          },
          {
            term: 'converge',
            def: 'Reach a set of weights and stop changing. Slide 54 warns explicitly that the rule can fail to converge on data that is not linearly separable.',
          },
        ]}
      />

      <Careful>
        “Can fail to converge” is not the same as “converges slowly”. On data that is not linearly separable the
        perceptron rule cycles forever — no set of weights satisfies every example, so there is always a mistake to
        react to, and the weights keep moving. It never settles and never announces failure. This is the practical face
        of the XOR problem, and it is why the algorithm needs the separability condition stated as a condition and not
        as a hope.
      </Careful>

      <Beyond>
        The rule looks like it fell out of the sky, but it is gradient descent in disguise on the loss{' '}
        <em>−(t − o)·z</em> summed over misclassified examples. The derivative of that with respect to wᵢ is −(t − o)xᵢ,
        so stepping against it gives exactly η(t − o)xᵢ. That is why η behaves identically here and in the
        gradient-descent lab of part 12, and why the same warning about a too-large step applies to both.
      </Beyond>

      <WhyAiml method="optimizer.step() — and the hinge loss that replaced this rule">
        <p className="mb-2">
          Δw = η(t − o)x is the ancestor of every <code>optimizer.step()</code> in the labs to come: a direction, a size
          of mistake, and a learning rate. What changed is where the direction comes from. Modern training gets it from{' '}
          <code>loss.backward()</code>, which works for hidden units too, whereas this rule needs a target t for the
          unit being updated and a hidden unit has none.
        </p>
        <p>
          The rule’s own descendant is still in use. Penalising only misclassified points, scaled by how badly they are
          misclassified, is the <em>hinge loss</em> — the loss a linear support vector machine minimises, and{' '}
          <code>SGDClassifier(loss=“hinge”)</code> in scikit-learn is essentially this update with a margin added. The
          1995 entry on the timeline is this rule, improved rather than replaced.
        </p>
      </WhyAiml>

      <Takeaway>
        Δwᵢ = η(t − o)xᵢ. Nothing moves when the answer is right; the size of the move is the mistake times the input
        times the learning rate. It converges only if the data is linearly separable and η is small enough.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  trace: (
    <>
      <Para>
        Slides 68 and 69 run the rule on the NOT gate and print the table. This is the single most likely thing on this
        deck to appear in an exam as “complete the following”, so it is worth doing rather than reading.
      </Para>
      <Para>Slide 68 sets it up. Start with w₀ = w₁ = 0, take η = 1, and the equations are:</Para>
      <Worked title="The four lines, slide 68">
        {`Hypothesis      z  =  w₀ + w₁x₁
Activation      h  =  sign(z)
Compute output  ŷ  =  h  =  sign(w₀ + w₁x₁)
Compute Δw      Δw =  η (t − ŷ) x
Update          w_new  ←  w_old + Δw`}
      </Worked>
      <Para>
        Two things are implied and not written. First, x for the w₀ update is x₀ = 1, so Δw₀ = η(t − ŷ). Second, sign(0)
        must be −1 — you can read that straight off the deck’s own first row, where z is 0 and h is printed as −1.
      </Para>

      <Lab>
        <TraceLab />
      </Lab>

      <Para>
        The lab starts at zero and builds the table by running those five lines, so nothing in it is copied from the
        slide. The last column compares each row against what the deck prints, and it is worth watching that column
        rather than the numbers.
      </Para>

      <Worked title="The three rows, worked out">
        {`Row 1:  x₁ = −1,  t = +1,  w₀ = 0, w₁ = 0

  z  = 0 + 0(−1) = 0
  h  = sign(0)   = −1          t ≠ h, so update
  Δw₁ = 1 · (1 − (−1)) · (−1) = 1 · 2 · (−1) = −2
  Δw₀ = 1 · (1 − (−1)) · ( 1) = 1 · 2 · ( 1) =  2
  new: w₁ = 0 + (−2) = −2,   w₀ = 0 + 2 = 2

Row 2:  x₁ = +1,  t = −1,  w₀ = 2, w₁ = −2

  z  = 2 + (−2)(1) = 0
  h  = sign(0)     = −1        t = h, no update
  Δw₁ = 1 · (−1 − (−1)) · (1) = 0
  Δw₀ = 1 · (−1 − (−1))       = 0
  new: w₁ = −2,   w₀ = 2

Row 3 (second pass over row 1):  x₁ = −1, t = +1

  z  = 2 + (−2)(−1) = 4
  h  = sign(4)      = +1       t = h, no update
  new: w₁ = −2,   w₀ = 2

A whole pass changed nothing, so it has converged.
Final answer:  w₀ = 2,  w₁ = −2`}
      </Worked>

      <Para>
        The answer is twice the hand solution from part 16, which was w₀ = 1, w₁ = −1. Both are correct and they are the
        same boundary: z = 2 − 2x₁ and z = 1 − x₁ are zero at the same place and have the same sign everywhere else.
        Only the scale of w differs, and the perceptron reports the sign of z and nothing else.
      </Para>

      <Terms
        items={[
          {
            term: 'epoch',
            say: 'EE-pock',
            def: 'One complete pass through every training example. The deck does not use the word, but its two tables are two epochs, and every later module does.',
          },
          {
            term: 'Isequal(t, h)',
            def: 'The column heading on slide 69. Just "did we get it right?" — Yes means Δw is zero for every weight.',
          },
          {
            term: 'convergence',
            def: 'A whole pass over the data with no weight changing. That is the stopping condition, and row 3 is where it is reached.',
          },
        ]}
      />

      <Beyond>
        Row 2 is the interesting one and the one an exam would target. z is exactly 0, so h = −1, which happens to be
        the target — so the rule leaves the weights alone even though the example is sitting precisely on the boundary.
        A perceptron has no notion of margin: “only just right” and “right by a mile” are the same to it. That single
        gap is what support vector machines were invented to close, and it is why the 1995 entry on the timeline could
        push neural networks aside for a decade.
      </Beyond>

      <WhyAiml method="online SGD, and why DataLoader defaults to shuffle=True">
        <p className="mb-2">
          This trace is stochastic gradient descent with a batch size of one: read an example, update, move on. The
          Machine Learning course called that <em>online</em> learning, as opposed to batch, and it is still how a
          modern loop is written — just with 64 examples at a time instead of one, averaged before the step.
        </p>
        <p>
          Because each update depends on the weights left behind by the previous example, <strong>order matters</strong>
          . Run the two NOT rows the other way round and the intermediate weights differ, even though this small problem
          converges either way. On real data that sensitivity is a genuine problem — a dataset sorted by class would
          have the model chase one class and then the other — which is exactly why <code>DataLoader</code> takes{' '}
          <code>shuffle=True</code> and why leaving it off is a classic quiet bug.
        </p>
      </WhyAiml>

      <Takeaway>
        Starting from zero with η = 1, the rule reaches w₀ = 2, w₁ = −2 after one update and confirms it over the next
        two rows. That is twice the hand answer, and the same boundary.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 21 */
  hyperplane: (
    <>
      <Para>
        Slide 72 states what a perceptron is, geometrically:{' '}
        <strong>a perceptron represents a hyperplane decision surface in the n-dimensional space of examples</strong>,
        outputting 1 for examples on one side of the hyperplane and −1 for examples on the other. The slide draws two
        pictures: (a) a set of points a line separates, and (b) a set it does not.
      </Para>
      <Para>
        <em>Hyperplane</em> sounds grander than it is. It is whatever a straight cut looks like in the space you are in
        — a point in one dimension, a line in two, an ordinary plane in three, and something with no picture but the
        same algebra above that. The rule is always the same: one dimension fewer than the space it sits in.
      </Para>

      <Lab>
        <HyperplaneLab />
      </Lab>

      <Para>
        The lab makes two facts visible that carry a long way. The first is that{' '}
        <strong>w is not on the boundary</strong> — it is at right angles to it. The set of points with w · x = 0 is
        exactly the set of points orthogonal to w, which is the orthogonal complement from Lecture 3 of the maths
        course. Training a perceptron is rotating one arrow until the surface at right angles to it lands in the right
        place.
      </Para>
      <Para>
        The second is what pressing <strong>Double every weight</strong> does: ‖w‖ doubles, and the boundary does not
        move at all. w · x + b = 0 and 2(w · x + b) = 0 have exactly the same solutions. That is the general reason the
        trained answer of part 20 could be twice the hand answer of part 16 and still be the same classifier.
      </Para>

      <Terms
        items={[
          {
            term: 'hyperplane',
            say: 'HY-per-plane',
            def: 'A flat surface with one dimension fewer than the space it lives in. A line in a plane, a plane in three-dimensional space, and so on.',
          },
          {
            term: 'decision surface',
            def: 'The hyperplane where z is exactly zero: the border between the region that gives +1 and the region that gives −1.',
          },
          {
            term: 'normal vector',
            def: 'A vector at right angles to a surface. w is the normal vector of the decision surface, which is why turning w turns the boundary.',
          },
          {
            term: '‖w‖',
            say: 'the norm of w',
            def: 'The length of the weight vector, √(w₁² + w₂² + …). The double bars are the norm from Lecture 3; it measures size, not direction.',
          },
          {
            term: 'orthogonal',
            def: 'At right angles. Two vectors are orthogonal exactly when their dot product is zero — which is the same equation as "this point is on the boundary".',
          },
          {
            term: 'n-dimensional space of examples',
            def: 'ℝⁿ, where each example is a point and n is the number of features. The phrase is slide 72’s own.',
          },
        ]}
      />

      <Beyond>
        The distance from any point x to the boundary is |w · x + b| ÷ ‖w‖. The numerator is z, and dividing by ‖w‖ is
        what removes the scaling freedom above. That single formula explains three things at once: why z alone is not a
        distance, why doubling the weights doubles z without moving anything, and what a support vector machine is
        actually maximising when it looks for the widest gap. The lab’s dashed segment is this formula with x at the
        origin.
      </Beyond>

      <WhyAiml method="weight_decay — and why ‖w‖ matters even though the boundary does not depend on it">
        <p className="mb-2">
          Here is a fact that looks like a contradiction until you have seen this page. Scaling w does not change a
          single prediction — and yet <code>weight_decay</code>, which penalises ‖w‖², is one of the standard tools of
          module 4. The resolution is that once you replace the step with a sigmoid, the scale stops being invisible: a
          large ‖w‖ makes the sigmoid steep, so the model becomes confident the instant a point crosses the line, and a
          small ‖w‖ makes it hedge.
        </p>
        <p>
          So shrinking the weights is not shrinking the boundary — it is shrinking the model’s confidence, which is
          exactly what an overfitting model has too much of. That is the mechanism behind L2 regularisation, and it is
          why an exam answer that says “weight decay keeps the weights small” is worth half the marks of one that says
          what small weights do.
        </p>
      </WhyAiml>

      <Takeaway>
        A perceptron is one hyperplane, always one dimension short of the space. w is the normal to it, not a point on
        it, and scaling every weight leaves the boundary exactly where it was.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 22 */
  separable: (
    <>
      <Para>
        Slide 74 gives a table of thirteen points, each labelled white or pink, and plots them. Slide 75 draws a line
        through the plot and gives its equation: <strong>2x₁ + 3x₂ − 25 = 0</strong>. That line, the slide says, becomes
        the <strong>decision boundary</strong>.
      </Para>
      <Para>
        Then two predictions. A new point at (0, 0) gives 2(0) + 3(0) = 0, which is less than 25, so it lands in the{' '}
        <strong>pink</strong> interior. A new point at (10, 10) gives 20 + 30 = 50, which is more than 25, so it lands
        in the <strong>white</strong> interior.
      </Para>

      <Lab>
        <SeparableLab />
      </Lab>

      <Para>
        Every one of the thirteen points has been checked against that line, and all thirteen come out on the side its
        label says — the lab does the arithmetic on each of them as you watch, and the read-out says 13 of 13 the moment
        you press <strong>The deck’s line</strong>. Here is the check written out, because being able to do it by hand
        is the exam skill:
      </Para>
      <Worked title="All thirteen points against 2x₁ + 3x₂ vs 25">
        {` x₁   x₂    2x₁ + 3x₂     vs 25    interior   label   ok
  1    9     2 + 27 = 29     >       white     white    ✓
 10    9    20 + 27 = 47     >       white     white    ✓
  4    7     8 + 21 = 29     >       white     white    ✓
  4    5     8 + 15 = 23     <       pink      pink     ✓
  5    3    10 +  9 = 19     <       pink      pink     ✓
  8    9    16 + 27 = 43     >       white     white    ✓
  4    2     8 +  6 = 14     <       pink      pink     ✓
  2    5     4 + 15 = 19     <       pink      pink     ✓
  7    1    14 +  3 = 17     <       pink      pink     ✓
  2   10     4 + 30 = 34     >       white     white    ✓
  8    5    16 + 15 = 31     >       white     white    ✓
  1    2     2 +  6 =  8     <       pink      pink     ✓
  8    2    16 +  6 = 22     <       pink      pink     ✓

Six white, seven pink, thirteen correct.

New points from slide 75:
  ( 0,  0)    0 +  0 =  0     <       pink              ✓ as the slide says
  (10, 10)   20 + 30 = 50     >       white             ✓ as the slide says`}
      </Worked>

      <Para>
        Slide 76 then redraws the whole thing as a perceptron, and this is the moment the two halves of the session
        meet. A constant input <strong>+1</strong> with weight <strong>−25</strong>, x₁ with weight <strong>2</strong>,
        x₂ with weight <strong>3</strong>, a Σ, and <strong>sign</strong> at the end. The line equation and the neuron
        are not analogous — they are the same three numbers.
      </Para>

      <Terms
        items={[
          {
            term: 'decision boundary',
            def: 'The line where the score is exactly zero. On one side the perceptron says white, on the other pink.',
          },
          {
            term: 'interior',
            def: 'The slide’s word for a side of the line. "Pink interior" means the region where the score comes out below 25.',
          },
          {
            term: '2x₁ + 3x₂ − 25 = 0',
            def: 'The boundary. Rearranged as 2x₁ + 3x₂ = 25, it is easier to check a point against, which is what the table above does.',
          },
          {
            term: '⊗',
            say: 'circle-cross',
            def: 'The mark slide 74 uses for a white point. The squares are the pink ones. Nothing about the marks means anything beyond "these are two different classes".',
          },
        ]}
      />

      <Beyond>
        The three weights are not unique, and it is worth seeing how far you can push them. Any multiple of (−25, 2, 3)
        gives the same boundary. Beyond that, the thirteen points leave a visible gap between the two classes, so a
        whole band of genuinely different lines separates them too — drag w₁ and w₂ in the lab and watch the read-out
        stay at 13 through a range of settings. Which line in that band you should prefer is not a question this session
        asks; it is exactly the question a support vector machine answers, by choosing the one with the widest gap.
      </Beyond>

      <WhyAiml method="feature scaling before LinearSVC or nn.Linear">
        <p className="mb-2">
          The weights 2 and 3 are close together because x₁ and x₂ are on the same scale — both run from about 1 to 10.
          Replace x₁ with a measurement in millions and the weight that balances it has to become a millionth, and the
          same is true of the gradient that has to find it. That is why <code>StandardScaler</code> in front of a linear
          model, and normalised inputs in front of <code>nn.Linear</code>, are the first thing in almost every pipeline.
        </p>
        <p>
          What breaks without it is not accuracy in principle but training in practice. Gradient descent takes the same
          step size in every direction, so a loss surface stretched a million times more in one direction than another
          forces a learning rate small enough for the steep direction, which makes the shallow one take forever. The
          thirteen points on this slide are separable either way; on unscaled real data, the optimiser is what fails.
        </p>
      </WhyAiml>

      <Takeaway>
        Thirteen points, one line, thirteen correct — checked here point by point. And slide 76 makes the identity
        explicit: the line’s three coefficients are the neuron’s three weights.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 23 */
  xor: (
    <>
      <Para>
        Slide 78 defines the opposite case: two groups of points are <strong>non-linearly separable</strong> in two
        dimensions if they cannot be separated with a straight line. The slide shows four pictures of it — one ring
        inside another, a blob inside a cloud, two interleaved crescents, and a scatter of two classes mixed together.
      </Para>
      <Para>
        Slide 79 gives the smallest possible example, and the one that changed the field. XOR — exclusive or, true when
        exactly one input is true — has the truth table (0,0) → 0, (0,1) → 1, (1,0) → 1, (1,1) → 0. Four points, and the
        slide’s caption says it plainly: <strong>the data is non-linearly separable</strong>.
      </Para>

      <Lab>
        <XorLab />
      </Lab>

      <Para>
        Try it. Swing the line anywhere you like; three of four is the ceiling. The lab also sweeps 144,360 different
        lines when the page loads and reports the best any of them reaches, which is evidence rather than proof. The
        proof takes two lines, and it is worth knowing because it explains <em>why</em> rather than just confirming{' '}
        <em>that</em>.
      </Para>

      <Worked title="Why no line can ever work">
        {`Suppose some w₀, w₁, w₂ classified XOR correctly, and write

    z(x₁, x₂)  =  w₀ + w₁x₁ + w₂x₂

The two points that must give +1 are (0,1) and (1,0):

    z(0,1) > 0    and    z(1,0) > 0

Now add them and halve.  z is linear, so the average of z at two
points equals z at their midpoint:

    ½[z(0,1) + z(1,0)]  =  z(0.5, 0.5)  >  0

The two points that must give 0 are (0,0) and (1,1):

    z(0,0) ≤ 0   and   z(1,1) ≤ 0

Average those the same way:

    ½[z(0,0) + z(1,1)]  =  z(0.5, 0.5)  ≤  0

So z(0.5, 0.5) is both greater than 0 and not greater than 0.
That is impossible, so no such w₀, w₁, w₂ exists.

The whole argument is that both diagonals of the square share
the midpoint (0.5, 0.5) — the grey dot in the lab.`}
      </Worked>

      <Para>
        Slide 54 already warned about the consequence:{' '}
        <strong>the perceptron learning rule can fail to converge if the examples are not linearly separable</strong>.
        Now you can see exactly what that means for XOR. There is no correct weight vector, so there is always a
        mistake, so the rule always has something to react to, and it cycles forever without settling and without
        reporting failure.
      </Para>

      <Terms
        items={[
          {
            term: 'XOR',
            say: 'EX-or',
            def: 'Exclusive or. True when exactly one of the two inputs is true, and false when both are or neither is.',
          },
          {
            term: 'non-linearly separable',
            def: 'The classes cannot be split by any straight line — or in higher dimensions, by any hyperplane. Slide 78 states it in those words.',
          },
          {
            term: 'linear',
            def: 'Of the form w₀ + w₁x₁ + w₂x₂. Its defining property, used in the proof above, is that the average of its values at two points equals its value at their midpoint.',
          },
          {
            term: 'proof by contradiction',
            def: 'Assume the thing you want to rule out, follow it to something impossible, and conclude the assumption was wrong. The proof above is one, and it is the standard exam answer to "show that XOR is not linearly separable".',
          },
        ]}
      />

      <Beyond>
        There are two ways out, and both are somewhere on the timeline. One is to keep the straight line and{' '}
        <strong>change the space</strong>: add a third feature x₁x₂, and in that three-dimensional space the four points
        become separable by a plane. That is the idea support vector machines turned into the kernel trick in 1995. The
        other is to keep the space and <strong>stack more units</strong>, which is the 1986 answer and the next page of
        this deck. Both were available; the field took thirteen years to take either.
      </Beyond>

      <WhyAiml method="nn.ReLU between layers — the reason a bend is compulsory">
        <p className="mb-2">
          XOR is the standard proof that a network needs something non-linear <em>between</em> its layers, not merely
          more layers. Two <code>nn.Linear</code> layers with nothing between them compose into a single linear map —
          W₂(W₁x + b₁) + b₂ is just (W₂W₁)x + (W₂b₁ + b₂) — so a hundred stacked dense layers with no activation is
          exactly one dense layer, and fails XOR exactly as one perceptron does.
        </p>
        <p>
          This is the most common structural bug in a first hand-written model, and it does not crash. It trains, the
          loss goes down a bit, it plateaus at something mediocre, and nothing anywhere says why. The check is
          mechanical: print the model and confirm there is an activation between every pair of linear layers. XOR is the
          four-point test case that catches it.
        </p>
      </WhyAiml>

      <Takeaway>
        No straight line separates XOR, and the reason is that both diagonals of the square meet at the same midpoint.
        The perceptron rule on that data does not fail loudly — it never stops.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 24 */
  mlp: (
    <>
      <Para>
        Slide 80 asks the question again — how do you represent XOR with a perceptron? — and answers it: use a{' '}
        <strong>multilayer perceptron</strong>. Introduce another layer between the input and the output. That
        in-between layer is called a <strong>hidden layer</strong>.
      </Para>
      <Para>
        The network drawn is small enough to run in your head. Two inputs x₁ and x₂; two hidden units n₁ and n₂; one
        output unit n₃. The weights into n₁ are both 1; the weights into n₂ are both −1; the two weights into n₃ are
        both 1. The number written inside each circle is that unit’s <strong>threshold</strong>: 1 for n₁, −1 for n₂,
        and 2 for n₃. A unit fires — outputs 1 — when its weighted sum <strong>reaches</strong> its threshold.
      </Para>

      <Lab>
        <MlpLab />
      </Lab>

      <Para>
        Slide 81 prints the full trace. Here it is, and the lab computes every line of it rather than storing it:
      </Para>
      <Worked title="All four inputs through the network, slide 81">
        {`x₁ x₂ │ n₁ (threshold 1)      │ n₂ (threshold −1)      │ n₃ (threshold 2)
──────┼───────────────────────┼────────────────────────┼──────────────────
 0  0 │ 0·1 + 0·1 = 0  < 1    │ 0·(−1)+0·(−1)= 0 ≥ −1  │ 0 + 1 = 1  < 2
      │ n₁ = 0                │ n₂ = 1                 │ n₃ = 0
 0  1 │ 0·1 + 1·1 = 1  ≥ 1    │ 0·(−1)+1·(−1)=−1 ≥ −1  │ 1 + 1 = 2  ≥ 2
      │ n₁ = 1                │ n₂ = 1                 │ n₃ = 1
 1  0 │ 1·1 + 0·1 = 1  ≥ 1    │ 1·(−1)+0·(−1)=−1 ≥ −1  │ 1 + 1 = 2  ≥ 2
      │ n₁ = 1                │ n₂ = 1                 │ n₃ = 1
 1  1 │ 1·1 + 1·1 = 2  ≥ 1    │ 1·(−1)+1·(−1)=−2 < −1  │ 1 + 0 = 1  < 2
      │ n₁ = 1                │ n₂ = 0                 │ n₃ = 0

Output column: 0, 1, 1, 0  —  which is x₁ xor x₂.`}
      </Worked>

      <Para>
        Now look at what the hidden units actually are. n₁ fires when x₁ + x₂ ≥ 1, which is true for every input except
        (0, 0) — that is <strong>OR</strong>. n₂ fires when −x₁ − x₂ ≥ −1, which rearranges to x₁ + x₂ ≤ 1, true for
        every input except (1, 1) — that is <strong>NAND</strong>. And n₃ fires only when both of them do, which is{' '}
        <strong>AND</strong>.
      </Para>
      <Para>
        So <strong>XOR = OR and NAND</strong>. Each of those three is a gate you solved by hand earlier in this chapter,
        and none of them needed anything a single perceptron cannot do. The only new ingredient is permission to feed
        one unit’s output into another.
      </Para>

      <Terms
        items={[
          {
            term: 'multilayer perceptron',
            say: 'MLP',
            def: 'Several layers of perceptron-like units, with the output of one layer feeding the next. Module 2 of this course is devoted to it.',
          },
          {
            term: 'hidden layer',
            def: 'A layer that is neither the input nor the output. "Hidden" because nothing in the training data says what it should produce — which is the whole difficulty, and the reason backpropagation had to be invented.',
          },
          {
            term: 'threshold',
            def: 'The number inside each circle on slide 80. The unit fires when its weighted sum reaches this value. Written as a weight on a constant input, it would be a bias of minus this.',
          },
          {
            term: 'forward pass',
            def: 'Running an input through the network from left to right to get an output. What the lab does when you press one of the four buttons.',
          },
        ]}
      />

      <Careful>
        This network uses <strong>0 and 1</strong> outputs and fires on ≥ threshold, while the gates earlier in the
        session used <strong>±1</strong> and fired on {'>'} 0. Both conventions appear in the same deck and they are not
        interchangeable — the trace above only reproduces slide 81 in the 0/1, ≥-threshold form. When answering a
        question, state which convention you are using before you start.
      </Careful>

      <Beyond>
        The hidden units are what make this work, and it is worth saying precisely why. Each one draws its own straight
        line: n₁’s is x₁ + x₂ = 1 and n₂’s is x₁ + x₂ = 1 as well, but with the sides swapped. Together they carve the
        square into three strips, and in the new coordinates (n₁, n₂) the four original points land on only three
        distinct positions — (0,1), (1,1) and (1,0) — with the two XOR-true points collapsed onto the same one. Once
        they coincide, a single straight cut separates them from the others. That is what a hidden layer does in
        general: it moves the data into a space where a straight cut works.
      </Beyond>

      <WhyAiml method="nn.Sequential(nn.Linear(2,2), nn.ReLU(), nn.Linear(2,1))">
        <p className="mb-2">
          This diagram is three lines of PyTorch. The two hidden units share the same two inputs, so their weights stack
          into a 2 × 2 matrix and the pair of sums becomes one matrix–vector product — the same row-meets-column rule
          from the multiplication page of Lecture 0a. The thresholds become the bias vector, and the step becomes{' '}
          <code>nn.ReLU()</code>, which is differentiable enough for <code>loss.backward()</code> to work through.
        </p>
        <p>
          Everything after this session is this object made bigger. More units per layer is a wider matrix; more layers
          is more matrices; a convolution is a matrix with its entries tied together; attention is a matrix computed
          from the data itself. If you can say what n₁, n₂ and n₃ do on all four inputs, you have the mechanism the
          remaining nine modules elaborate.
        </p>
      </WhyAiml>

      <Takeaway>
        One hidden layer solves XOR, and the solution is OR and NAND feeding an AND — three gates you had already
        solved. Depth is not a new kind of unit; it is permission to plug one into another.
      </Takeaway>
    </>
  ),
}
