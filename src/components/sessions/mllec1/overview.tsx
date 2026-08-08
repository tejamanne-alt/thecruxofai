'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene and then hands you off to the
 * parts, without repeating them — a reader who wants the material should be one
 * click from it, not scrolling past a summary of it.
 */
export function MlLecture1Overview() {
  const parts = partsOf('mllec1')

  return (
    <div>
      <SessionHeader
        eyebrow="Machine Learning · Chapter"
        title="Lecture 1 — Introduction to Machine Learning"
        intro="The first session of the ML course. It answers four questions: what machine learning is, why it is worth using, what kinds of it there are, and what a project actually looks like end to end. Almost no algorithms — this is the session that gives you the vocabulary every later module speaks in."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Suppose you want a program that spots spam. The old way is to sit down and write the rules: if it says
            “free”, if it says “credit card”, if it says “4U”. It works, and then the spammers write “fr33” and you
            write another rule, and another, until you are maintaining a list nobody understands.
          </>,
          <>
            The other way is to show the program a pile of spam and a pile of real mail and let it work out for itself
            which phrases give it away. Two boxes have swapped places: instead of supplying the <strong>program</strong>{' '}
            and getting output, you supply the <strong>output</strong> and get a program. That is the whole idea, and
            everything else in the session is a consequence of it.
          </>,
        ]}
        mappings={[
          {
            title: '⟨T, P, E⟩',
            body: 'Task, performance measure, experience. A learning problem is not well defined until you can write all three down — and a P that can be gamed will be.',
          },
          {
            title: 'The three kinds',
            body: 'Supervised gets the answers, unsupervised gets none, reinforcement gets rewards that arrive late. Which one you are in is decided by your data, not your ambition.',
          },
          {
            title: 'The workflow',
            body: 'Eight steps, of which exactly one picks a model. The first four can end the project before it starts, and the last sends you back to the fifth.',
          },
        ]}
        footnote="Everything on these pages is the deck's own, including all four ⟨T, P, E⟩ examples, the three data tables and the comparison table on slide 49. The one chart the deck labels 'unscientific and opinionated' carries that warning on its page, and the regression lab's points are marked as illustrative because the deck prints no table of values for them."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, and a note on what the idea is for in real
        machine learning. Each is listed in the left menu so you can come straight back to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/mllec1/${p.id}`}
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

      <Explainers
        plain="Machine learning is programming by example: instead of giving the computer data and a program to get output, you give it data and output and it produces the program. A learning task is well defined when you can state the task T, a performance measure P and the experience E it learns from, and learning means P improves as E grows. Learning is worth doing when human expertise does not exist, cannot be explained, or must be customised — and not worth doing when the rule is already known exactly. The kinds are decided by feedback: supervised has labels, unsupervised has none, reinforcement has delayed rewards, and semi-supervised has a few labels among many unlabelled points. Supervised splits into classification, where the target is a category, and regression, where it is a number. Training data can be used all at once, in chunks, or one instance at a time; and a learner can either keep the examples and compare, or boil them into a model."
        breaks="The trap that costs the most is a badly chosen P. A model maximises exactly what you asked for, so 'distance travelled' without 'before an error' rewards driving fast into a wall, and accuracy on the tumour example treats a missed cancer as no worse than a false alarm. The other common slip is thinking unsupervised learning cannot predict — it can, by assigning a new point to the nearest centroid, and slide 43 says so explicitly."
      >
        <MathBlock
          intro="This session has almost no formulas. What it has instead is a small set of phrases you are expected to reproduce exactly."
          formulas={[
            {
              formula: 'data + program → output',
              reading: 'Traditional programming. Somebody worked out the rule in advance and wrote it down.',
            },
            {
              formula: 'data + output → program',
              reading:
                'Machine learning. The program that comes out is the model, and nobody ever states the rule it found.',
            },
            {
              formula: '⟨T, P, E⟩',
              reading:
                'A well-defined learning task. A program learns from E with respect to T as measured by P, if its performance improves with E.',
            },
            {
              formula: 'given (x₁,y₁)…(xₙ,yₙ), learn f(x) to predict y',
              reading:
                'Supervised learning. y categorical gives classification; y real-valued gives regression. The sentence is otherwise identical.',
            },
            {
              formula: 'given x₁…xₙ without labels, output hidden structure',
              reading:
                'Unsupervised learning. No y anywhere, so no accuracy — the goal is written in distances instead.',
            },
            {
              formula: 'intra-cluster small, inter-cluster large',
              reading: 'The clustering objective. Points in a group close together, groups far apart.',
            },
            {
              formula: 'observe → act → reward → update policy → repeat',
              reading:
                'The reinforcement loop. Nothing labels the right action; the agent works it out by trial and error.',
            },
            {
              formula: 'batch · mini-batch · online',
              reading:
                'All the data, a chunk, or one instance per update. More per update is steadier and hungrier; less can learn forever.',
            },
          ]}
          legend={[
            { sym: 'T', name: 'Task', note: 'What the program has to do — the job, not the method.', val: 'part 4' },
            {
              sym: 'P',
              name: 'Performance measure',
              note: 'The number that scores it. Choose badly and the model games you.',
              val: 'part 4',
            },
            { sym: 'E', name: 'Experience', note: 'What it learns from. Data, or its own past games.', val: 'part 4' },
            { sym: 'f(x)', name: 'The learnt function', note: 'Features in, prediction out.', val: 'part 10' },
            {
              sym: 'features',
              name: 'Also attributes, predictors',
              note: 'Three names for the input columns.',
              val: 'part 8',
            },
            {
              sym: 'target',
              name: 'The column predicted',
              note: 'The one you would not know for a new case.',
              val: 'part 8',
            },
            {
              sym: 'label',
              name: 'A known answer',
              note: 'Its presence decides supervised versus unsupervised.',
              val: 'part 9',
            },
            {
              sym: 'centroid',
              name: 'A cluster centre',
              note: 'How unsupervised learning predicts for a new point.',
              val: 'part 13',
            },
            { sym: 'agent', name: 'The RL learner', note: 'Acts on an environment and is rewarded.', val: 'part 14' },
            { sym: 'policy', name: 'The agent’s rule', note: 'What reinforcement learning improves.', val: 'part 14' },
            {
              sym: 'IID',
              name: 'Independent, identically distributed',
              note: 'What this course assumes of every dataset.',
              val: 'part 1',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: '⟨T, P, E⟩ is how you scope a real project',
            how: 'Before writing code, state the task, the measure and the data. Most failed projects turn out to have had a P nobody examined — watch time, or "matches past hires".',
          },
          {
            what: 'The kind of learning is decided by your data',
            how: 'No labels means supervised learning is off the table, however much you want it. The honest options are to pay for labels, go semi-supervised, or reframe as clustering.',
          },
          {
            what: 'Classification and regression differ by one word',
            how: 'Categorical target or numerical target. Same definition otherwise — which is why logistic and linear regression look so similar in every library.',
          },
          {
            what: 'The held-back test set is the whole convention',
            how: 'Every accuracy claim is a claim about unseen data. Training scores are diagnostics; leakage between the two is the classic way to fool yourself.',
          },
          {
            what: 'Online learning answers concept drift',
            how: 'Spam and prices move underneath a model. Batch size is not just a hardware choice — it decides whether a deployed model can keep up.',
          },
          {
            what: 'Interpretability is sometimes a legal requirement',
            how: 'In medicine, credit and law you may have to explain a decision, which rules out the accurate-but-opaque corner of slide 55 no matter how well it scores.',
          },
          {
            what: 'One step in eight is the algorithm',
            how: 'The workflow spends far more time on whether to bother, finding data and cleaning it. That proportion is accurate, and it is the main surprise for people arriving from a course of pure methods.',
          },
        ]}
      />
    </div>
  )
}
