/*
 * Not a client module — see the note in lec1/parts.tsx. Marking this 'use client'
 * turns the exported bodies into client references and every part page 404s.
 */
import {
  CourseMapLab,
  DigitRuleLab,
  FeatureTableLab,
  NestedFieldsLab,
  SpamLab,
  TpeLab,
  TraditionalVsMlLab,
  WhenMlLab,
} from '@/components/charts/ml-intro-lab'
import { ToolsLab, TradeoffLab, WorkflowLab } from '@/components/charts/ml-practice-lab'
import {
  BatchOnlineLab,
  ClusterLab,
  InstanceVsModelLab,
  RlLoopLab,
  SemiSupervisedLab,
  SupervisedFlowLab,
  TrendRegressionLab,
  TumourClassifyLab,
  TypesTreeLab,
} from '@/components/charts/ml-types-lab'
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

export const MLLEC1_PARTS: Record<string, React.ReactNode> = {
  /* ---------------------------------------------------------------- 1 */
  course: (
    <>
      <Para>
        This is the first session of <strong>AIML ZG565 / DSEZG565, Machine Learning</strong>. Before any of the
        material, it is worth knowing the shape of the course — what it covers, what it deliberately does not, and where
        the marks come from.
      </Para>
      <Para>The stated objectives are three:</Para>
      <List
        items={[
          <>An introduction to the basic concepts and techniques of machine learning.</>,
          <>Experience in the basics of doing independent study and research in the field.</>,
          <>
            Skills in using recent ML software tools to evaluate learning algorithms and do model selection for
            practical problems.
          </>,
        ]}
      />
      <Para>
        And the focus is narrowed on purpose: <strong>strong mathematical foundations</strong> of ML algorithms, and{' '}
        <strong>structured</strong> data analytics on IID data. The deck names what is out of scope just as clearly —
        unstructured data analytics, and time-series or sequence data.
      </Para>

      <Lab>
        <CourseMapLab />
      </Lab>

      <Terms
        items={[
          {
            term: 'IID',
            say: 'eye-eye-dee',
            def: 'Independent and identically distributed. Each row of data is drawn separately from the same underlying process, and none of them influence each other. Almost every method in this course assumes it.',
          },
          {
            term: 'structured data',
            def: 'Data that fits in a table: fixed columns, one row per case. A spreadsheet of house prices is structured; a folder of emails is not.',
          },
          {
            term: 'unstructured data',
            def: 'Text, images, audio, video — anything with no fixed column layout. Out of scope here.',
          },
          {
            term: 'model selection',
            def: 'Choosing which model, and which settings, to use. Module M11 is devoted to it.',
          },
        ]}
      />

      <Worked title="What is being assessed">
        {`Quiz                 10%   two quizzes
Assignment           20%   progressive across the semester
Mid-semester exam    30%
Comprehensive exam   40%
                    ----
                    100%

Textbook   T1  Tom M. Mitchell, Machine Learning, McGraw-Hill
Reference  R1  Christopher M. Bishop, Pattern Recognition
                 & Machine Learning, Springer
           R2  P. Tan et al., Introduction to Data Mining, Pearson
           R3  C.J.C. Burges, A Tutorial on Support Vector Machines
                 for Pattern Recognition, Kluwer

Prerequisites
    linear algebra   vector/matrix manipulation, properties
    calculus         partial derivatives
    probability      common distributions, Bayes' rule
    statistics       mean/median/mode, maximum likelihood`}
      </Worked>

      <Para>
        Those prerequisites are not decoration — they are the other course you are taking this semester. Vector and
        matrix manipulation is Lectures 0a to 3 of Mathematical Foundations; Bayes’ rule and the common distributions
        come from the statistics course.
      </Para>

      <WhyAiml method="the whole course">
        <p className="mb-2">
          The 70% of the mark that sits in the two exams is the reason this site exists. Exams here test whether you can
          state a definition precisely, work an example by hand, and say why a method behaves as it does — not whether
          you can call a library function.
        </p>
        <p>
          The six labs, on the other hand, are the practical half: end-to-end ML, linear regression with gradient
          descent, logistic regression, decision trees, naïve Bayes and random forest. Each one lands on a module from
          the list above.
        </p>
      </WhyAiml>

      <Takeaway>
        Eleven modules, six labs, and 70% of the mark in exams. Structured IID data only — no unstructured data and no
        time series.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 2 */
  landscape: (
    <>
      <Para>
        Three words get used almost interchangeably in public and mean quite different things:{' '}
        <strong>data science</strong>, <strong>artificial intelligence</strong> and <strong>machine learning</strong>.
        The deck settles it with one picture — three circles, each inside the one before it.
      </Para>

      <Lab>
        <NestedFieldsLab />
      </Lab>

      <Para>
        The nesting is the whole point. Machine learning is a <em>subset</em> of AI, and AI is one of the things data
        science draws on. So every ML method is an AI method, but plenty of AI involves no learning at all — a chess
        engine that searches ahead using rules a human wrote is artificial intelligence and is not machine learning.
      </Para>
      <Para>
        The deck then spends three slides on where you already meet this, and the range is the point. Security and
        transactions: self-driving cars, fraud detection in banking, email filtering, dynamic pricing in travel, and
        from those, cyber security, video surveillance and object detection. Customer support: Siri, Google Assistant,
        Alexa, Google Duplex, Cortana and Bixby, and from those, support queries by voice or text, and chatbots.
        Recommendation engines: Amazon and Flipkart, Goodreads, IMDb and Netflix, MakeMyTrip and Booking.com, StitchFix,
        Zomato and Uber Eats — and from those, personalised marketing and personalised banking.
      </Para>

      <Terms
        items={[
          {
            term: 'data science',
            def: 'Collection, preparation and analysis of data to make business decisions. The outer circle: a way of working, not a single technique.',
          },
          {
            term: 'artificial intelligence',
            def: 'Technology for machines to understand and interpret, to learn, and to make “intelligent” decisions. Includes ML among many other fields.',
          },
          {
            term: 'machine learning',
            def: 'Algorithms that improve through supervised, unsupervised and reinforcement learning. A subset of AI, and one of data science’s tools.',
          },
          {
            term: 'derived application',
            def: 'The deck’s phrase for something built on top of a core use case — chatbots derived from voice assistants, for instance.',
          },
        ]}
      />

      <WhyAiml method="knowing which claim is being made">
        <p className="mb-2">
          This distinction is worth holding onto for a practical reason: it tells you what a product claim actually
          means. “AI-powered” can describe a hand-written rule engine. “Machine learning” is a narrower claim — that
          something was learnt from data — and it implies all the questions the rest of this chapter asks: what was the
          training data, what is the performance measure, and how was it tested?
        </p>
        <p>
          It also tells you where a job sits. A data scientist may spend most of the week on the outer circle —
          gathering and cleaning and presenting — and only a fraction of it on the inner one.
        </p>
      </WhyAiml>

      <Takeaway>
        Machine learning ⊂ artificial intelligence ⊂ the toolbox of data science. Every ML method is AI; not all AI
        learns.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 3 */
  whatisml: (
    <>
      <Para>
        The deck gives three definitions of machine learning, and they sharpen as they go. Start with the friendliest:
        machine learning is <strong>the science and art of programming computers so they can learn from data</strong>.
      </Para>
      <Para>
        Then Arthur Samuel’s more general one: the field of study that gives computers the ability to learn{' '}
        <strong>without being explicitly programmed</strong>.
      </Para>
      <Para>
        And then the engineering-oriented one, which the next part takes apart properly:{' '}
        <strong>algorithms that improve their performance P at some task T with experience E</strong>.
      </Para>
      <Para>
        The clearest way to see what has actually changed is the diagram on slide 16, where two boxes swap places.
      </Para>

      <Lab>
        <TraditionalVsMlLab />
      </Lab>

      <Para>
        In traditional programming, a person works out the rule, writes it as a program, and the computer applies it to
        data to make output. In machine learning you hand over the data <em>and</em> the output you wanted, and the
        computer produces the program. That produced program is what everybody calls the <strong>model</strong>.
      </Para>

      <Beyond>
        A consequence worth noticing early: because nobody wrote the rule, nobody can be sure what the rule is. This is
        the root of every later worry about interpretability, bias and debugging. In traditional programming a wrong
        output means someone wrote a wrong line; in machine learning it may mean the training data was unrepresentative,
        and there is no line to point at.
      </Beyond>

      <Terms
        items={[
          {
            term: 'model',
            def: 'The program the learning algorithm produced. In this course it is usually a set of numbers — weights — plus the recipe for using them.',
          },
          {
            term: 'training',
            def: 'The process of producing the model from data. The “Computer” box in the second diagram.',
          },
          {
            term: 'explicitly programmed',
            def: 'Samuel’s phrase for the traditional route: a human states the rule in advance.',
          },
          {
            term: 'learn from data',
            def: 'Find the rule by looking at examples, rather than being told it.',
          },
        ]}
      />

      <WhyAiml method="every model you will ever train">
        <p className="mb-2">
          This flip is not a metaphor, it is literally the API. When you call{' '}
          <span className="font-mono">model.fit(X, y)</span> in scikit-learn you are passing data{' '}
          <span className="font-mono">X</span> and the answers <span className="font-mono">y</span>, and getting back a
          program. When you call <span className="font-mono">model.predict(X_new)</span> you are running that program
          the ordinary way.
        </p>
        <p>
          Every method in the remaining ten modules of this course fits in the same two boxes. Only the shape of the
          program that comes out changes — a line, a tree, a set of support vectors, a network.
        </p>
      </WhyAiml>

      <Takeaway>
        Traditional: data + program → output. Machine learning: data + output → program. The program that comes out is
        the model.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 4 */
  tpe: (
    <>
      <Para>
        Tom Mitchell’s definition is the one this course will keep coming back to, and it is worth being able to write
        down exactly. A program <strong>learns</strong> from experience E with respect to a class of tasks T and
        performance measure P, if its performance at tasks in T, as measured by P, <strong>improves</strong> with
        experience E.
      </Para>
      <Para>
        The deck compresses that into a piece of notation: a well-defined learning task is given by{' '}
        <strong>⟨T, P, E⟩</strong>. The angle brackets just mean “these three things, taken together”.
      </Para>
      <List
        items={[
          <>
            <strong>T — the task.</strong> What the program is supposed to do. Not the method, the job.
          </>,
          <>
            <strong>P — the performance measure.</strong> A number that says how well it did. This is the one people
            skip and the one that decides everything.
          </>,
          <>
            <strong>E — the experience.</strong> What it gets to learn from. Usually a body of data, but as one of the
            examples below shows, it can be games the program played against itself.
          </>,
        ]}
      />

      <Lab>
        <TpeLab />
      </Lab>

      <Para>
        The lab lets you swap P for a plausible but broken alternative in each case. That is worth playing with, because
        a bad performance measure is the most common way for a project to go wrong while appearing to succeed — the
        model dutifully maximises exactly what you asked for.
      </Para>

      <Worked title="The deck’s four examples, in full">
        {`Example 1
    T   recognising hand-written words
    P   percentage of words correctly classified
    E   database of human-labelled images of handwritten words

Example 2
    T   categorise email messages as spam or legitimate
    P   percentage of email messages correctly classified
    E   database of emails, some with human-given labels

Example 3
    T   playing checkers
    P   percent of games won against opponents
    E   games played against itself

Example 4
    T   drive on public four-lane highways using vision sensors
    P   average distance travelled before an error,
          as judged by a human
    E   a sequence of images and steering commands recorded
          while observing a human driver`}
      </Worked>

      <Para>
        Look at example 3 for a moment. The experience is <em>games played against itself</em> — no external data set at
        all. And example 4’s P is carefully worded: not distance travelled, but distance travelled{' '}
        <strong>before an error</strong>. Drop those three words and the best strategy becomes driving very fast into a
        wall.
      </Para>

      <Terms
        items={[
          {
            term: '⟨T, P, E⟩',
            say: 'T, P, E',
            def: 'The three things that make a learning task well defined. Angle brackets group them as one triple.',
          },
          { term: 'task (T)', def: 'What the program is meant to do — the job, not the technique.' },
          {
            term: 'performance measure (P)',
            def: 'The number that scores it. Choosing this badly is how a project fails while looking successful.',
          },
          {
            term: 'experience (E)',
            def: 'What the program learns from. Data, or in some cases its own past attempts.',
          },
          {
            term: 'improves with experience',
            def: 'The part that makes it learning. A program that performs the same however much data it sees has not learnt anything.',
          },
        ]}
      />

      <WhyAiml method="choosing a loss function and a metric">
        <p className="mb-2">
          P is where mathematics meets judgement, and it is worth taking seriously now because every later module
          assumes it. In the tumour example two parts from here, accuracy treats a missed cancer and a false alarm as
          equally bad — which no clinician would accept. That is why the field has precision, recall, F1 and ROC curves,
          all of which are just different Ps for the same T.
        </p>
        <p>
          The famous failures follow this pattern exactly. A recommender optimised for watch time learns to recommend
          outrage; a hiring model optimised for “matches past hires” learns to reproduce past bias. In each case the
          model did what P asked, and P was the wrong question.
        </p>
      </WhyAiml>

      <Takeaway>
        ⟨T, P, E⟩ — task, performance measure, experience. Learning means P improves as E grows. A P that can be gamed
        will be gamed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 5 */
  spam: (
    <>
      <Para>
        The deck spends three slides on one worked comparison, because it makes the case for learning better than any
        definition. The task is filtering spam.
      </Para>
      <Para>
        <strong>The traditional approach.</strong> You notice that spam typically uses words and phrases such as “4U”,
        “credit card”, “free” and “amazing”. So you write a detection algorithm for those frequently appearing patterns,
        then test and update the rules until it is good enough.
      </Para>
      <Para>
        It works. The problem the deck names is not that it fails — it is that the detection algorithm is{' '}
        <strong>likely to be a long list of complex rules, hard to maintain</strong>. And spammers adapt, so the list
        only ever grows.
      </Para>

      <Lab>
        <SpamLab />
      </Lab>

      <Para>
        <strong>The machine learning approach.</strong> The program is given examples of spam and examples of real mail
        — “ham” — and <em>automatically learns which phrases are good predictors of spam</em>, by detecting patterns of
        words that are unusually frequent in one compared with the other. Nobody supplies the word list.
      </Para>
      <Para>
        The deck’s verdict is that the program is{' '}
        <strong>shorter, easier to maintain, and most likely more accurate</strong>. That hedge — “most likely” — is
        honest and worth keeping. Learning is not automatically better; it is better here because the pattern is real
        but too fiddly and too changeable to write down by hand.
      </Para>

      <Terms
        items={[
          { term: 'ham', def: 'The standard name for legitimate, non-spam email. Chosen as the opposite of spam.' },
          {
            term: 'predictor',
            def: 'Something that helps forecast the answer. Here, a word or phrase whose presence shifts the odds towards spam.',
          },
          {
            term: 'false positive',
            def: 'A real message wrongly marked as spam. In email filtering this is the expensive mistake — much worse than letting one spam through.',
          },
        ]}
      />

      <Beyond>
        Spam filtering is also the classic example of <strong>concept drift</strong>: the thing you are predicting keeps
        changing because an adversary is actively trying to defeat you. That is why part 16 of this chapter — online
        learning — matters here. A filter trained once and frozen goes stale within weeks.
      </Beyond>

      <WhyAiml method="naïve Bayes · module M8 · lab 5">
        <p className="mb-2">
          This is not a toy example — spam filtering is the textbook application of the <strong>naïve Bayes</strong>{' '}
          classifier, which is module M8 of this course and lab 5. The method counts how often each word appears in spam
          against how often it appears in ham, and combines those counts with Bayes’ rule.
        </p>
        <p>
          It is also the cleanest illustration of why the ML route wins when the pattern moves. Retraining on last
          week’s mail is a scheduled job; rewriting a thousand hand-tuned rules is a person’s month.
        </p>
      </WhyAiml>

      <Takeaway>
        Hand-written rules work and then rot: a long list, hard to maintain, defeated by every new trick. A learned
        filter finds the predictive phrases itself and is retrained rather than rewritten.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 6 */
  whenml: (
    <>
      <Para>
        Machine learning is not always the answer, and the deck is refreshingly direct about it. Slide 25 gives three
        situations where learning is the right tool:
      </Para>
      <List
        items={[
          <>
            <strong>Human expertise does not exist.</strong> Nobody has navigated on Mars, so there is no expert to
            copy.
          </>,
          <>
            <strong>Humans cannot explain their expertise.</strong> You recognise a face instantly and cannot write down
            how. The deck files biometrics here.
          </>,
          <>
            <strong>Models must be customised.</strong> Personalised medicine — the right model differs for each
            patient, so no single hand-written rule serves.
          </>,
        ]}
      />
      <Para>
        And then the line that deserves as much attention as the three above it:{' '}
        <strong>there is no need to “learn” to calculate payroll.</strong> When the rule is known, exact and written
        down, learning it from examples can only introduce error.
      </Para>

      <Lab>
        <WhenMlLab />
      </Lab>

      <Para>Slide 26 adds two more reasons, both about scale rather than expertise:</Para>
      <List
        items={[
          <>
            Some tasks <strong>cannot be defined well except by examples</strong>. It is very hard to write a program
            that recognises a handwritten digit — what distinguishes a 2 from a 7? How does our brain do it?
          </>,
          <>
            There are <strong>hidden relationships and correlations</strong> in data so large that explicit encoding by
            a human is impractical — medical diagnosis being the example given — and{' '}
            <strong>new knowledge keeps arriving</strong>, so any fixed rule set goes stale.
          </>,
        ]}
      />

      <Terms
        items={[
          {
            term: 'expertise',
            def: 'Knowing how to do something well. The deck’s point is that having it and being able to state it are different things.',
          },
          {
            term: 'explicit encoding',
            def: 'Writing the rule out by hand in code. Feasible for payroll, hopeless for a million interacting correlations.',
          },
          {
            term: 'customisation',
            def: 'Fitting the model to one individual or context rather than using one rule for everyone.',
          },
        ]}
      />

      <WhyAiml method="the first question of the ML workflow">
        <p className="mb-2">
          This part is step 1 of the workflow in part 20, and skipping it is expensive. A learned model needs data
          collection, training infrastructure, monitoring, retraining and a way to explain itself. If a two-line formula
          gives an exact answer, all of that cost buys you a worse result.
        </p>
        <p>
          The professional version of the question is: what is my baseline? Before training anything, work out how well
          the obvious rule does — always predict the average, or always predict the majority class. Surprisingly often
          the baseline is close enough that no model is warranted, and knowing that early saves months.
        </p>
      </WhyAiml>

      <Takeaway>
        Learn when expertise does not exist, cannot be explained, or must be customised — or when the data is too big
        and too changeable to encode by hand. Do not learn a rule you already know exactly.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 7 */
  pattern: (
    <>
      <Para>
        Slide 27 is a single image and one sentence, credited to Geoffrey Hinton:{' '}
        <strong>it is very hard to say what makes a 2</strong>.
      </Para>
      <Para>
        Look at a page of handwritten digits and you can label every one of them without effort, at a glance, with
        essentially perfect accuracy. Now try to write down the rule you used. Not a vague description — a rule precise
        enough to hand to a computer, that catches every 2 on the page and never fires on a 7.
      </Para>

      <Lab>
        <DigitRuleLab />
      </Lab>

      <Para>
        Every rule that reliably catches a 2 either misses the untidy ones or also catches a 7. This is not a failure of
        imagination; it is a property of the problem. The category “2” is defined by a huge number of examples that
        resemble one another in ways that resist compression into a short description.
      </Para>
      <Para>
        Which is exactly the second reason from the previous part — humans cannot explain their expertise — made
        concrete. And it is why the deck says the task <strong>can only be defined by examples</strong>.
      </Para>

      <Beyond>
        This is the problem that MNIST — 70,000 handwritten digits — became the standard test for, and it is worth
        knowing how the story ended. Hand-written rules never worked well. Learned models reached and then passed human
        accuracy, and they did it without anybody ever writing down what makes a 2. The rule exists inside the model as
        a pile of numbers, and it still cannot be stated in a sentence.
      </Beyond>

      <Terms
        items={[
          {
            term: 'pattern recognition',
            def: 'The older name for much of what this course covers. Reference book R1, Bishop, has it in the title.',
          },
          {
            term: 'feature',
            def: 'A measurable property you feed the model. Part of the difficulty here is that no simple feature separates 2 from 7.',
          },
          {
            term: 'intra-class variation',
            def: 'How much things in the same category differ from each other. Handwriting has a great deal of it, which is what defeats simple rules.',
          },
        ]}
      />

      <WhyAiml method="why deep learning happened at all">
        <p className="mb-2">
          The gap this page opens — you can do it, you cannot explain it — is the reason for representation learning.
          Rather than a human choosing features, the model learns its own from raw pixels. Early layers find edges,
          later ones find strokes and loops, and none of it was specified by anybody.
        </p>
        <p>
          It is also why the accuracy-versus-interpretability trade-off in part 19 is unavoidable rather than a
          temporary engineering problem. For tasks whose rule cannot be written down, the accurate model necessarily
          holds a rule nobody can read.
        </p>
      </WhyAiml>

      <Takeaway>
        You can label a handwritten 2 instantly and cannot say why. Tasks that can only be defined by examples are
        exactly the tasks that need learning.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 8 */
  features: (
    <>
      <Para>
        Before sorting learning into kinds, the deck fixes the vocabulary with three example problems. In each one, the
        data is a table: one row per case, and columns describing it.
      </Para>
      <Para>
        Those describing columns have three names and the deck uses all of them — <strong>features</strong>,{' '}
        <strong>attributes</strong>, <strong>predictors</strong>. They mean the same thing. The column you are trying to
        predict is the <strong>target</strong>, and whether it exists at all is what decides the kind of learning.
      </Para>

      <Lab>
        <FeatureTableLab />
      </Lab>

      <Para>The three examples are chosen to cover exactly three cases, and it is worth naming each:</Para>
      <List
        items={[
          <>
            <strong>Employability prediction.</strong> Features: CGPA, communication skills, aptitude, programming
            skills. Target: was a job offered, Yes or No. The target is a <em>category</em>, so this is{' '}
            <strong>classification</strong>.
          </>,
          <>
            <strong>Used car price.</strong> Features: brand, year of manufacture, engine capacity, mileage, distance
            travelled, and whether it was a cab. Target: price in rupees. The target is a <em>number</em>, so this is{' '}
            <strong>regression</strong>.
          </>,
          <>
            <strong>Market segmentation.</strong> Features: zip code, family income, visits per month, average money
            spent per month. Target: <em>none at all</em>. Nobody has said which customers are big spenders. So this is{' '}
            <strong>unsupervised</strong>.
          </>,
        ]}
      />
      <Para>
        The third one is the interesting case. The deck poses it as: customers may fall into two groups, say big
        spenders and low spenders — or three, say big, medium and low — or four. The number of groups is not given
        either. That absence is what makes it a different kind of problem, not a harder version of the same one.
      </Para>

      <Terms
        items={[
          {
            term: 'feature / attribute / predictor',
            def: 'Three names for an input column — something you know about a case before predicting anything.',
          },
          {
            term: 'target',
            say: 'also called the label, or the response',
            def: 'The column being predicted. For a new case this is the one you do not know.',
          },
          {
            term: 'categorical',
            def: 'Takes one of a fixed set of values — Yes/No, Good/Average/Poor. No arithmetic on it makes sense.',
          },
          {
            term: 'continuous',
            def: 'A number on a scale, such as a price or a CGPA. Differences and averages mean something.',
          },
          {
            term: 'instance',
            def: 'One row. One graduate, one car, one customer.',
          },
        ]}
      />

      <Beyond>
        A quick test that always works for telling a feature from the target: for a genuinely new case, which column
        would you <em>not</em> already know? For a graduate you have not hired, you know the CGPA and you do not know
        whether an offer was made. The unknown one is the target — and if there is no such column, the problem is
        unsupervised.
      </Beyond>

      <WhyAiml method="the shape of every dataset you will meet">
        <p className="mb-2">
          This table layout is the <span className="font-mono">X, y</span> of every ML library. X is the matrix of
          features — one row per instance, one column per feature — and y is the target vector. Deciding what goes into
          X is <strong>feature engineering</strong>, and it routinely matters more than which algorithm you pick.
        </p>
        <p>
          The car table shows the first real difficulty: brand is text and “is it a cab?” is Yes/No, but the model needs
          numbers. Turning those into columns a model can use is step 6 of the workflow, and it is where a great deal of
          practical effort goes.
        </p>
      </WhyAiml>

      <Takeaway>
        Features, attributes and predictors are one thing. The target is what you predict, and whether the data has one
        decides whether the problem is supervised at all.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 9 */
  types: (
    <>
      <Para>
        Now the central classification of the whole session. Slide 29 sorts machine learning by a single question:{' '}
        <strong>what feedback does the learner get?</strong>
      </Para>
      <List
        items={[
          <>
            <strong>Feedback</strong> — every example comes with the right answer attached. That is{' '}
            <strong>supervised</strong> learning.
          </>,
          <>
            <strong>No feedback</strong> — no answers anywhere. That is <strong>unsupervised</strong> learning.
          </>,
          <>
            <strong>Delayed feedback</strong>, in the form of rewards and penalties that may arrive long after the
            action that earned them. That is <strong>reinforcement</strong> learning.
          </>,
        ]}
      />

      <Lab>
        <TypesTreeLab />
      </Lab>

      <Para>
        Two things in that tree are worth pausing over. First, the branch is decided by{' '}
        <strong>what data you have</strong>, not by which algorithm you eventually run — which is why “classification”
        appears under three different branches. Second, semi-supervised sits between the first two rather than being a
        fourth idea; part 15 comes back to it.
      </Para>

      <Worked title="Slide 49’s comparison, as an examiner would want it">
        {`                  SUPERVISED        UNSUPERVISED       REINFORCEMENT

Definition        learns by using   trained on         an agent interacts
                  labelled data     unlabelled data    with its environment
                                    without guidance   by performing actions
                                                       & learning from errors
                                                       or rewards

Type of problems  regression &      association &      reward-based
                  classification    clustering

Type of data      labelled data     unlabelled data    no predefined data

Training          external          no supervision     no supervision
                  supervision

Approach          maps the          understands        follows the
                  labelled inputs   patterns &         trial-and-error
                  to the known      discovers the      method
                  outputs           output`}
      </Worked>

      <Terms
        items={[
          {
            term: 'label',
            def: 'The known correct answer attached to a training example. Its presence or absence is the whole distinction here.',
          },
          {
            term: 'supervision',
            def: 'Having the answers. “External supervision” means a person supplied them.',
          },
          {
            term: 'association',
            def: 'Finding rules like “people who buy X also buy Y”. An unsupervised task, and the one behind market basket analysis.',
          },
          {
            term: 'agent',
            def: 'In reinforcement learning, the thing doing the learning and acting. Part 14 introduces it properly.',
          },
          {
            term: 'policy',
            def: 'The agent’s current rule for choosing an action. What reinforcement learning improves.',
          },
        ]}
      />

      <WhyAiml method="choosing what is even possible">
        <p className="mb-2">
          This is the first question on any real project, and it is decided by your data rather than your ambition. If
          nobody has labelled anything, supervised learning is off the table no matter how much you want it — and the
          honest options are to pay for labels, use the semi-supervised route in part 15, or reframe the problem as
          clustering.
        </p>
        <p>
          It also sets what “good” can mean. Supervised learning has a right answer to compare against, so accuracy is
          definable. Unsupervised learning has none, which is why evaluating a clustering is genuinely hard and why
          module M11 has to treat the two cases separately.
        </p>
      </WhyAiml>

      <Takeaway>
        Feedback → supervised. No feedback → unsupervised. Delayed reward and penalty → reinforcement. The branch is
        decided by the data you have, not the algorithm you want.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 10 */
  classification: (
    <>
      <Para>
        The first half of supervised learning. The deck states it precisely, and the wording is worth learning because
        the regression slide reuses it almost exactly.
      </Para>
      <Para>
        Given (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ), learn a function <strong>f(x)</strong> to predict y given x, where{' '}
        <strong>y is categorical</strong>. The goal:{' '}
        <em>previously unseen records should be assigned a class as accurately as possible</em>.
      </Para>
      <Para>
        The deck’s example is medical: x is tumour size, y is 0 for benign or 1 for malignant. One feature, two classes,
        and a threshold to place.
      </Para>

      <Lab>
        <TumourClassifyLab />
      </Lab>

      <Para>
        Two things become obvious as soon as you drag the threshold. There is{' '}
        <strong>no perfect place to put it</strong> — the two groups overlap, so every choice trades a missed cancer
        against a false alarm. And which of those mistakes is worse is a medical question, not a mathematical one. That
        is the ⟨T, P, E⟩ lesson arriving early: accuracy is a poor P here, because it treats both errors as equal.
      </Para>
      <Para>
        Slide 36 then makes the important extension. <strong>x can be multi-dimensional</strong>, with each dimension a
        different attribute — clump thickness, uniformity of cell size, uniformity of cell shape, age, tumour size. The
        single threshold becomes a boundary through many dimensions, but nothing else about the setup changes.
      </Para>
      <Para>
        The applications the deck lists: Google image classification, face recognition, spam filters, document tagging
        and fraud detection.
      </Para>

      <Terms
        items={[
          {
            term: 'classification',
            def: 'Supervised learning where the target is a category. The output is a class label, not a number.',
          },
          {
            term: 'f(x)',
            say: 'f of x',
            def: 'The function being learnt. Give it the features of a case and it returns a prediction.',
          },
          {
            term: 'class',
            def: 'One of the possible answers — benign or malignant, spam or ham.',
          },
          {
            term: 'decision boundary',
            def: 'The dividing line between classes. In one dimension it is a threshold; in many, a surface.',
          },
          {
            term: 'previously unseen records',
            def: 'The deck’s phrase, and the entire point. Getting the training data right proves nothing.',
          },
        ]}
      />

      <WhyAiml method="logistic regression · module M4 · lab 3">
        <p className="mb-2">
          Everything above is module M4 and lab 3. Logistic regression learns exactly this boundary, except that instead
          of a hard threshold it outputs a <em>probability</em> — which lets you move the cut-off after training,
          according to how much a missed cancer costs relative to a false alarm.
        </p>
        <p>
          The overlap you can see in the lab is why accuracy is not enough, and why the field uses precision, recall and
          the ROC curve. In cancer screening you deliberately accept far more false alarms to catch nearly every real
          case — a choice about P, made by clinicians and not by the algorithm.
        </p>
      </WhyAiml>

      <Takeaway>
        Given (x, y) pairs with y categorical, learn f(x) that labels unseen records well. The groups overlap, so every
        boundary trades one kind of mistake for the other.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 11 */
  regression: (
    <>
      <Para>
        The other half of supervised learning, and the definition is <em>word for word the same</em> with one change.
      </Para>
      <Para>
        Given (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ), learn a function f(x) to predict y given x — except now{' '}
        <strong>y is real-valued</strong>. The goal: previously unseen records should be assigned a{' '}
        <strong>value</strong> as accurately as possible.
      </Para>
      <Para>
        That single difference — a number instead of a label — is the whole distinction between the two halves of
        supervised learning, and it is a very common exam question.
      </Para>

      <Lab>
        <TrendRegressionLab />
      </Lab>

      <Para>
        The red bars are the errors: the gap between what each point actually was and what the line predicts. Fitting
        means choosing the line that makes those as small as possible, and “small” is usually measured by squaring them
        and averaging — the mean squared error in the panel.
      </Para>
      <Para>
        Squaring rather than just adding is deliberate, for the same reason variance squares its deviations: without it,
        errors above and below the line cancel and a terrible fit can score zero.
      </Para>

      <Terms
        items={[
          {
            term: 'regression',
            def: 'Supervised learning where the target is a number. The name is historical and has nothing to do with going backwards.',
          },
          {
            term: 'real-valued',
            def: 'A number on a continuous scale — a price, a temperature, an extent. As opposed to categorical.',
          },
          {
            term: 'residual',
            def: 'The gap between a data point and the line’s prediction for it. The red bars.',
          },
          {
            term: 'mean squared error',
            say: 'MSE',
            def: 'Average of the squared residuals. The standard score for how badly a regression fits.',
          },
          {
            term: 'least squares',
            def: 'The choice of line that makes the mean squared error as small as possible. It has an exact formula.',
          },
        ]}
      />

      <Beyond>
        Slide 39 uses September Arctic sea ice extent from 1979 onward, taken from G. Witt,{' '}
        <em>Journal of Statistics Education</em>, volume 21 number 1 (2013). The deck reproduces the chart but prints no
        table of values, so the points in the lab above are <strong>illustrative rather than the deck’s data</strong>.
        They show the shape of the problem — a clear downward trend with real year-to-year noise — without putting
        figures on this page that cannot be checked against the source.
      </Beyond>

      <WhyAiml method="linear regression · module M3 · lab 2">
        <p className="mb-2">
          This is module M3 and lab 2, where it is paired with gradient descent. The “snap to the best line” button uses
          the exact least-squares formula, which exists because squared error has a neat derivative — and that connects
          straight back to the Mathematical Foundations course, where least squares turns out to be a projection onto
          the span of the features.
        </p>
        <p>
          Gradient descent matters because the exact formula stops being practical once there are many features or the
          model is not linear. Then you walk downhill on the error instead of solving for the bottom directly, which is
          what nearly all modern training does.
        </p>
      </WhyAiml>

      <Takeaway>
        Same setup as classification, one change: y is a number. Fit by making the squared residuals as small as
        possible.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 12 */
  supervisedflow: (
    <>
      <Para>
        Slide 38 draws the supervised pipeline as two mirrored rows — a training row and a testing row — and the mirror
        is the point.
      </Para>

      <Lab>
        <SupervisedFlowLab />
      </Lab>

      <Para>
        In <strong>training</strong>, labelled examples go through feature extraction, and features plus labels go into
        the training step, which produces a learned model. In <strong>testing</strong>, an image the model has never
        seen goes through the <em>same</em> feature extraction, and the learned model turns those features into a
        prediction.
      </Para>
      <Para>
        The two things that most often go wrong in practice are both visible in that picture. If the feature extraction
        differs between the two rows, the model is fed something unlike what it learnt from. And if the test image was
        not genuinely held back, the score you get is meaningless — you are asking the model to repeat an answer it has
        already been told.
      </Para>
      <Para>
        Slide 37 lists the supervised techniques this course will cover, and every one of them fits into the “Training”
        box without changing anything else: linear regression, logistic regression, naïve Bayes classifiers, support
        vector machines, decision trees and random forests, and neural networks.
      </Para>

      <Terms
        items={[
          {
            term: 'feature extraction',
            def: 'Turning a raw thing — an image, an email — into a list of numbers the model can work with.',
          },
          {
            term: 'training set',
            def: 'The examples the model learns from. It sees both the features and the labels.',
          },
          {
            term: 'test set',
            def: 'Examples held back deliberately. Used once, to score the model. Never used to fit it.',
          },
          {
            term: 'learned model',
            def: 'The output of training — the program the computer wrote.',
          },
          {
            term: 'generalisation',
            def: 'How well the model does on data it has never seen. The only score that matters.',
          },
        ]}
      />

      <Beyond>
        Two failure names worth knowing now, because the workflow in part 20 assumes them. <strong>Overfitting</strong>{' '}
        is when a model does well on training data and badly on test data — it memorised rather than generalised.{' '}
        <strong>Data leakage</strong> is when information from the test set sneaks into training, usually by cleaning or
        scaling the whole dataset <em>before</em> splitting it. Both make the training score look wonderful and the real
        performance disappointing.
      </Beyond>

      <WhyAiml method="train/test split · cross-validation · module M11">
        <p className="mb-2">
          The held-back test set is the single most important convention in applied machine learning, and this diagram
          is where it enters the course. Every claim about a model’s accuracy is a claim about data it has not seen; the
          training score is only ever a diagnostic.
        </p>
        <p>
          Module M11 refines this into cross-validation — splitting several ways and averaging — so that the estimate
          does not depend on which unlucky rows happened to land in the test set. Same principle, applied more
          carefully.
        </p>
      </WhyAiml>

      <Takeaway>
        Training and testing are mirror images sharing one feature extraction. The model is built in one and used in the
        other, and the test data must be genuinely unseen.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 13 */
  unsupervised: (
    <>
      <Para>
        Now take the labels away entirely. The deck’s definition: given x₁, x₂, …, xₙ <strong>without labels</strong>,
        output the hidden structure behind the x’s — clustering, for example.
      </Para>
      <Para>
        Notice there is no y anywhere in that sentence. Nothing to compare a prediction against, and so no such thing as
        an accuracy score. What replaces it is a goal written in terms of distances:{' '}
        <strong>intra-cluster distances are minimised and inter-cluster distances are maximised</strong>. Points in the
        same group should be close together; different groups should be far apart.
      </Para>

      <Lab>
        <ClusterLab />
      </Lab>

      <Para>
        Drag the two centres and watch those two numbers move in opposite directions. That is the entire objective of
        clustering, made visible.
      </Para>
      <Para>
        Slide 43 makes a point that is easy to miss and worth exam marks:{' '}
        <strong>unsupervised learning can still have a test phase</strong>. Given a new image the model never saw, you
        can predict which of the two clusters it belongs to — by assigning it to the cluster with the closer centroid.
        Prediction without a single label.
      </Para>
      <Para>
        The techniques named: <strong>k-means</strong>, hierarchical cluster analysis and expectation maximisation for
        clustering; and for visualisation and dimensionality reduction, PCA, kernel PCA, locally-linear embedding (LLE)
        and t-SNE. The applications: personalised recommendation, targeted marketing, spam filters, content management
        for news, and campaigning.
      </Para>

      <Terms
        items={[
          {
            term: 'clustering',
            def: 'Grouping instances so that similar ones land together, with nobody saying what the groups should be.',
          },
          {
            term: 'centroid',
            say: 'SEN-troyd',
            def: 'The centre of a cluster — usually the average of the points in it. The big circles in the lab.',
          },
          {
            term: 'intra-cluster distance',
            say: 'intra = within',
            def: 'How spread out one cluster is. You want this small.',
          },
          {
            term: 'inter-cluster distance',
            say: 'inter = between',
            def: 'How far apart different clusters are. You want this large.',
          },
          {
            term: 'dimensionality reduction',
            def: 'Describing the data with fewer numbers while keeping what matters. PCA is the standard method.',
          },
        ]}
      />

      <WhyAiml method="k-means · module M10 · customer segmentation">
        <p className="mb-2">
          This is module M10, and the market segmentation table from part 8 is the standard business case: split
          customers into groups by behaviour when nobody has said what the groups are. The result is not a prediction,
          it is a description — and what makes it valuable is that the marketing team can then treat each group
          differently.
        </p>
        <p>
          The awkward part is evaluation. With no labels there is no accuracy, so you are left with internal measures
          such as the two distances above, plus a person looking at the clusters and deciding whether they mean
          anything. That subjectivity is real, and it is why unsupervised results are usually argued for rather than
          simply reported.
        </p>
      </WhyAiml>

      <Takeaway>
        No labels at all; find the structure. The goal is small distances within clusters and large distances between
        them — and there can still be a test phase, by nearest centroid.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 14 */
  reinforcement: (
    <>
      <Para>
        The third kind, and the one that works least like the other two. Reinforcement learning is described as a{' '}
        <strong>feedback-based</strong> technique: the agent learns automatically using feedback,{' '}
        <em>without any labelled data</em>, unlike supervised learning.
      </Para>
      <Para>
        An <strong>agent</strong> learns to behave in an <strong>environment</strong> by performing actions and seeing
        the results. For each good action it gets positive feedback; for each bad one, negative feedback or a penalty.
      </Para>

      <Lab>
        <RlLoopLab />
      </Lab>

      <Para>
        The loop in the lab is slide 47’s, and the sixth step is where the learning lives: observe, select an action
        using the current policy, act, get a reward or penalty, <strong>update the policy</strong>, and iterate until an
        optimal policy is found.
      </Para>
      <Para>
        Slide 45 gives the analogy that makes it click. It is similar to the way we learn new things: the agent faces a
        game-like situation, must make a series of decisions to achieve a correct outcome, and through trial and error
        learns what to do and what not to do. Every time it receives a reward, that{' '}
        <strong>reinforces the behaviour</strong> and signals the agent to use the same tactics next time — which is
        exactly where the name comes from.
      </Para>
      <Para>
        The defining feature, from slide 44: RL solves problems where{' '}
        <strong>decision making is sequential and the goal is long-term</strong> — game playing and robotics being the
        examples. That is what makes the feedback <em>delayed</em>: the move that lost the game may have been forty
        moves ago, and nothing told you at the time.
      </Para>

      <Terms
        items={[
          { term: 'agent', def: 'The learner and decision-maker. The thing whose behaviour improves.' },
          { term: 'environment', def: 'Everything outside the agent that it acts on and gets information from.' },
          { term: 'state (sₜ)', say: 's sub t', def: 'What the situation looks like at time t.' },
          { term: 'action (aₜ)', def: 'What the agent does at time t.' },
          {
            term: 'reward (rₜ)',
            def: 'A number scoring the outcome. Positive reinforces, negative penalises. The only teaching signal there is.',
          },
          {
            term: 'policy',
            def: 'The agent’s rule for choosing an action given a state. Learning means improving the policy.',
          },
          {
            term: 'delayed feedback',
            def: 'The reward arrives long after the action that caused it, so working out which action deserves the credit is itself part of the problem.',
          },
        ]}
      />

      <Beyond>
        The hard part has a name: the <strong>credit assignment problem</strong>. If you win after fifty moves, which of
        the fifty deserves the credit? And a second tension you will meet everywhere — the{' '}
        <strong>exploration/exploitation trade-off</strong>. Exploiting means doing what has worked so far; exploring
        means trying something new that might be better. Do only the first and you never improve; only the second and
        you never use what you learnt.
      </Beyond>

      <WhyAiml method="game playing · robotics · RLHF">
        <p className="mb-2">
          The famous results are all reinforcement learning: AlphaGo, the Atari agents, and robot control. The deck’s
          own example is a robotic dog learning to move its arms — nobody labels the correct joint angle, the dog tries
          things and is scored.
        </p>
        <p>
          It is also how large language models are tuned to be helpful. RLHF — reinforcement learning from human
          feedback — uses human preference between two answers as the reward signal, then improves the policy against
          it. The loop on this page is exactly the loop being run, with a person supplying rₜ.
        </p>
      </WhyAiml>

      <Takeaway>
        An agent acts in an environment and gets rewards or penalties, with no labelled data anywhere. It improves a
        policy by trial and error, and the feedback is delayed.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 15 */
  semisupervised: (
    <>
      <Para>
        Slide 50 adds the case that sits between the first two.{' '}
        <strong>Semi-supervised learning combines unsupervised and supervised algorithms</strong>, and works on{' '}
        <strong>partially labelled data</strong> — some labelled, and a lot unlabelled.
      </Para>
      <Para>
        The deck’s example is a photo hosting service such as Google Photos. It groups the faces in your library by
        itself — that is the unsupervised half, and it needs no labels. Then you tell it the name of one photo in each
        group, and every photo in that group is named. That is the supervised half, and it needed almost nothing from
        you.
      </Para>

      <Lab>
        <SemiSupervisedLab />
      </Lab>

      <Para>
        Slide the number of labels from zero upward and watch how little it takes. At zero the structure is already
        visible — you can see two clumps — but nothing says which is which. One label per group is enough to name both,
        because the unlabelled points did the hard work of showing where the groups are.
      </Para>

      <Terms
        items={[
          {
            term: 'semi-supervised',
            def: 'Learning from a small amount of labelled data together with a large amount of unlabelled data.',
          },
          {
            term: 'partially labelled',
            def: 'The deck’s phrase for the data: some rows have a target, most do not.',
          },
          {
            term: 'labelling cost',
            def: 'What it takes to get a human to supply the answers. Usually the reason there are so few labels.',
          },
        ]}
      />

      <Beyond>
        The economics are what make this a real technique rather than a curiosity. Unlabelled data is cheap and
        plentiful — every photo you ever took, every unlabelled scan in a hospital archive. Labelled data needs a
        person, and for medical images it needs an expensive person. Semi-supervised learning is what you reach for when
        you have a warehouse of the first and a handful of the second, which is the normal situation.
      </Beyond>

      <WhyAiml method="pre-training · self-supervised learning">
        <p className="mb-2">
          This idea, pushed hard, is how modern large models are built. A model is first trained on an enormous
          unlabelled corpus to learn structure, and then tuned on a comparatively tiny labelled set for the actual task.
          The unlabelled stage teaches it what the data looks like; the labelled stage only has to say what to do with
          it.
        </p>
        <p>
          Practically it means the right question at the start of a project is not always “how do we label more?” but
          “how much can the unlabelled data tell us on its own?” — often a great deal.
        </p>
      </WhyAiml>

      <Takeaway>
        A little labelled data plus a lot of unlabelled data. The unlabelled points show where the groups are; the few
        labels only have to name them.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 16 */
  batching: (
    <>
      <Para>
        The deck now sorts learning a second way — not by what feedback you get, but by{' '}
        <strong>how the training data is used</strong>. Three options, differing only in how much data the model looks
        at before each update.
      </Para>
      <List
        items={[
          <>
            <strong>Batch learning</strong> — uses all available data at a time during training.
          </>,
          <>
            <strong>Mini-batch learning</strong> — uses a subset of the available data at a time.
          </>,
          <>
            <strong>Online (incremental) learning</strong> — uses a single training instance at a time.
          </>,
        ]}
      />

      <Lab>
        <BatchOnlineLab />
      </Lab>

      <Para>
        The trade-off runs one way along that row. Batch gives the steadiest updates, because every one is based on
        everything you have — and it needs all the data in memory at once, which stops being possible as datasets grow.
        Online needs almost no memory and can learn from data that never stops arriving, but each update is based on one
        example and is therefore noisy. Mini-batch sits between them, which is why it is what nearly everybody actually
        uses.
      </Para>

      <Terms
        items={[
          {
            term: 'batch',
            def: 'All the training data, used together for one update.',
          },
          {
            term: 'mini-batch',
            def: 'A chunk — often 32, 64 or 128 examples — used for one update.',
          },
          {
            term: 'online / incremental',
            def: 'One example at a time. The model can keep learning after deployment.',
          },
          {
            term: 'update',
            def: 'One adjustment to the model’s parameters. How many examples it is based on is exactly what this page is about.',
          },
          {
            term: 'concept drift',
            def: 'When the thing you are predicting changes over time, so a model trained once slowly goes wrong. The reason online learning exists.',
          },
        ]}
      />

      <WhyAiml method="stochastic gradient descent · production retraining">
        <p className="mb-2">
          This is not an abstract taxonomy — it is the batch size argument in every training script you will write.
          Full-batch gradient descent is the textbook version; <strong>stochastic gradient descent</strong> is the
          online version; and mini-batch SGD is what actually runs, because it makes efficient use of hardware while
          keeping the updates reasonably stable.
        </p>
        <p>
          Online learning also answers a production question. A spam filter or a price model faces{' '}
          <strong>concept drift</strong> — the world changes underneath it — so it must keep learning after deployment.
          That is the same picture as the spam example in part 5, seen from the operations side.
        </p>
      </WhyAiml>

      <Takeaway>
        Batch uses everything, online uses one instance, mini-batch uses a chunk. More data per update means steadier
        learning and more memory; less means noisier learning and the ability to keep going forever.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 17 */
  instancemodel: (
    <>
      <Para>
        The last of the classifications, and it asks what the learner actually <em>keeps</em>. The deck gives one line
        each.
      </Para>
      <List
        items={[
          <>
            <strong>Instance-based learning</strong> — compare new data points to known data points.
          </>,
          <>
            <strong>Model-based learning</strong> — detect patterns in the training data and build a predictive model.
          </>,
        ]}
      />

      <Lab>
        <InstanceVsModelLab />
      </Lab>

      <Para>
        Drag the new point around. Well away from the boundary the two methods agree. Push it into the gap between the
        groups and they start disagreeing — because instance-based learning is looking only at the handful of nearest
        examples, while model-based learning is applying one rule fitted to all of them.
      </Para>
      <Para>
        The practical difference is <strong>where the cost sits</strong>. Instance-based learning does almost nothing at
        training time and all the work when a prediction is asked for, since it has to search the stored examples.
        Model-based learning does the work once, up front, and then predicts almost instantly — and throws the training
        data away, which may be a feature or a problem depending on who is asking.
      </Para>

      <Terms
        items={[
          {
            term: 'instance-based',
            say: 'also called lazy learning',
            def: 'Keep the examples; compare a new case against them when asked. Nothing is generalised in advance.',
          },
          {
            term: 'model-based',
            say: 'also called eager learning',
            def: 'Boil the examples down to a rule during training, then use the rule.',
          },
          {
            term: 'k-nearest neighbours',
            say: 'k-NN',
            def: 'The standard instance-based method: look at the k closest stored examples and take a vote.',
          },
          {
            term: 'parameter',
            def: 'A number inside a model that training sets. Instance-based methods have very few; a neural network has millions.',
          },
        ]}
      />

      <Beyond>
        The names <strong>lazy</strong> and <strong>eager</strong> are worth knowing because textbooks use them freely.
        Lazy learning postpones all the work until a query arrives; eager learning does it up front. They are the same
        distinction as instance-based and model-based, under older names.
      </Beyond>

      <WhyAiml method="k-NN · module M6 · lab 4">
        <p className="mb-2">
          Instance-based learning is module M6 of this course. It has a real advantage: adding new training data costs
          nothing but storage, and the method makes no assumption at all about the shape of the boundary — it can be as
          wiggly as the data demands.
        </p>
        <p>
          Its costs are memory and prediction time, and both get worse as data grows. It also suffers badly in high
          dimensions, for the reason Lecture 3 of Mathematical Foundations demonstrates: when everything is roughly
          equidistant from everything else, “nearest” stops carrying much meaning.
        </p>
      </WhyAiml>

      <Takeaway>
        Instance-based keeps the examples and compares; model-based finds a rule and forgets them. The first is cheap to
        train and slow to predict; the second is the other way round.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 18 */
  tools: (
    <>
      <Para>
        Slides 53 and 54 list nine open-source tools, with the platforms they run on, the languages they are written in
        or driven from, and what each is for.
      </Para>

      <Lab>
        <ToolsLab />
      </Lab>

      <Para>
        For this course the practical answer is <strong>Scikit Learn</strong>. It is Python, it covers every one of the
        six labs on slide 9, and it is what the lab plan is built around. PyTorch, TensorFlow and Keras become relevant
        once the course reaches neural networks; Colab matters because it gives you all of them in a browser with no
        installation.
      </Para>
      <Para>
        Two things are worth noticing from the table rather than the individual rows. Most of the general-purpose tools
        cover classification, regression <em>and</em> clustering together — the three tasks parts 10, 11 and 13
        introduced. And most of them are Python, or have a Python interface over the same underlying C and C++ numerical
        libraries.
      </Para>

      <Terms
        items={[
          {
            term: 'library',
            def: 'Code somebody else wrote that you call from your own. Scikit Learn is a library.',
          },
          {
            term: 'autograd',
            def: 'Automatic differentiation — the machinery that works out derivatives for you. PyTorch’s core feature, and what makes training deep networks practical.',
          },
          {
            term: 'dataflow programming',
            def: 'Describing a computation as a graph of operations rather than a sequence of statements. TensorFlow’s original model.',
          },
          {
            term: 'association rules mining',
            def: 'Finding “people who bought X also bought Y” patterns. Weka lists it; it is the association branch from part 9.',
          },
        ]}
      />

      <WhyAiml method="what you will actually type">
        <p className="mb-2">
          The reason to know this list is not the list. It is that these libraries share one interface — fit, then
          predict — which is the two-box diagram from part 3 turned into an API. Learning it once transfers across all
          of them.
        </p>
        <p>
          The tool matters far less than understanding what you are asking it to do. A one-line call trains a random
          forest; deciding whether a random forest is the right thing, what P should be, and whether the test split was
          honest, is the part this course is actually about.
        </p>
      </WhyAiml>

      <Takeaway>
        Nine tools; Scikit Learn is the one for this course’s six labs. Most are Python over the same numerical
        libraries, and they share the same fit-then-predict shape.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 19 */
  tradeoff: (
    <>
      <Para>
        Slide 55 is one chart with two axes: <strong>accuracy</strong> across the bottom and{' '}
        <strong>interpretability</strong> up the side. It is worth studying, and it is worth being careful with — the
        slide labels itself “unscientific and opinionated”, and notes the ranking is “on real-world data sets”.
      </Para>

      <Lab>
        <TradeoffLab />
      </Lab>

      <Para>
        The rough shape is a diagonal running from top-left to bottom-right. Lasso and linear or logistic regression sit
        at the interpretable end: you can read the weights and say what the model is doing, and it is often a little
        less accurate for it. Neural nets, SVMs and deep learning sit at the other, where the honest answer to “why did
        it decide that?” is frequently that nobody knows.
      </Para>
      <Para>
        The two exceptions are the interesting part. <strong>Random forest</strong> sits high on both axes, which is a
        large part of why it is such a common default in practice. And <strong>deep learning</strong> buys the last of
        its accuracy with almost all of its interpretability.
      </Para>

      <Terms
        items={[
          {
            term: 'interpretability',
            def: 'How easily a human can say why the model made a particular decision.',
          },
          {
            term: 'accuracy',
            def: 'How often it is right. Here used loosely for “how well it performs”, not the specific metric.',
          },
          {
            term: 'black box',
            def: 'A model whose internal reasoning cannot practically be inspected. The bottom-right of this chart.',
          },
          {
            term: 'ensemble',
            def: 'Many models combined by voting. Bagging, boosting and random forest are all ensembles, and they cluster in the middle-right here.',
          },
        ]}
      />

      <Beyond>
        Treat the exact positions as one practitioner’s impression, because the slide says so itself. The two things
        that <em>are</em> reliable: the general trade-off exists, and it is not absolute — random forest is on the chart
        precisely as a counterexample. There is also a whole modern field, explainable AI, built on refusing to accept
        the trade-off, with methods such as LIME and SHAP that explain individual predictions of an otherwise opaque
        model.
      </Beyond>

      <WhyAiml method="model selection · regulated decisions · module M11">
        <p className="mb-2">
          This is a real constraint, not a philosophical one. In medicine, credit scoring and criminal justice you may
          be legally required to explain a decision — which rules out the bottom-right corner however accurate it is. A
          slightly less accurate model you can defend can be worth far more than a better one you cannot.
        </p>
        <p>
          It also explains a common professional habit: fit a linear model first, always. It gives you a baseline
          accuracy, it tells you which features matter, and if a complicated model cannot beat it by a worthwhile
          margin, the simple one wins on every other count.
        </p>
      </WhyAiml>

      <Takeaway>
        Accuracy and interpretability usually trade off, with linear models at one end and deep learning at the other.
        Random forest is the notable exception — and the slide warns you it is opinionated.
      </Takeaway>
    </>
  ),

  /* ---------------------------------------------------------------- 20 */
  workflow: (
    <>
      <Para>
        The last part of the session pulls everything into a sequence. Slide 57 lists it as a series of questions, and
        the first four can all be answered “no” — in which case you stop.
      </Para>

      <Lab>
        <WorkflowLab />
      </Lab>

      <Para>
        Read the order carefully, because the order is the lesson. <strong>Should I use ML on this problem?</strong> Is
        there a pattern to detect? Can I solve it analytically? Do I have data? Only then: gather and organise, then
        preprocess and clean and visualise, then choose a model and a loss and a regulariser, then optimise and search
        hyper-parameters — and finally analyse performance and mistakes and{' '}
        <strong>iterate back to step 5, or even step 3</strong>.
      </Para>
      <Para>
        That last instruction is what makes it a loop rather than a line. Almost no project runs through once.
      </Para>

      <Worked title="Slide 58 — the car price example, step by step">
        {`Define the objective
    predict the price of a used car from its mileage

Data gathering
    survey data; past purchase data

Data preprocessing
    training set; test set
    representation of input features; output

Exploratory data analysis
    look at the data before modelling it

Choose the form of model
    linear regression

System's performance evaluation
    the objective function

Optimise performance by setting appropriate parameters
    optimisation

Evaluate on the test set
    generalisation`}
      </Worked>

      <Para>
        Notice how little of that is the algorithm. One step out of eight chooses the model. The rest is deciding
        whether to bother, finding data, cleaning it, and checking honestly whether the result works — which is an
        accurate reflection of how the time is really spent.
      </Para>

      <Terms
        items={[
          {
            term: 'objective function',
            def: 'The number the training process is trying to make small. Also called the loss or cost function.',
          },
          {
            term: 'regulariser',
            def: 'An extra term that penalises complexity, to stop the model fitting noise. Lecture 3 of Mathematical Foundations shows why L1 and L2 behave differently.',
          },
          {
            term: 'hyper-parameter',
            def: 'A setting you choose rather than one training learns — how many clusters, how deep a tree, how strong the regulariser.',
          },
          {
            term: 'exploratory data analysis',
            say: 'EDA',
            def: 'Looking at and plotting the data before modelling it, to see what is actually there.',
          },
          {
            term: 'generalisation',
            def: 'Performance on data the model has never seen. The last word of the example, and the only score that counts.',
          },
        ]}
      />

      <WhyAiml method="every project you will ever run">
        <p className="mb-2">
          This workflow <em>is</em> module M2, and it is the frame the remaining nine modules hang on. Each of them
          expands one box: M3 to M9 are all “choose the form of model”, and M11 is “evaluate”.
        </p>
        <p>
          The habit worth taking away is the ordering. Practitioners who start at step 7 — picking a fashionable model —
          routinely discover at step 8 that the data could not answer the question, or that a two-line rule would have
          done. The first four questions cost an afternoon and save months.
        </p>
      </WhyAiml>

      <Takeaway>
        Eight steps, of which only one picks a model. The first four can end the project early, and the last one sends
        you back to step 5 or step 3 — it is a loop, and it ends on generalisation.
      </Takeaway>
    </>
  ),
}
