'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene, then hands you off to the
 * parts. It deliberately does not repeat their content: a reader who wants the
 * material should be one click away from it, not scrolling past a summary of it.
 */
export function Lecture1Overview() {
  const parts = partsOf('lec1')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 1 — Linear equations and Gaussian elimination"
        intro="This lecture builds one idea from the ground up: a set of straight-line rules that all have to be true at the same time. You will see what that looks like as a picture, learn the short way to write it down, and then learn the one method that solves any of them. Every part has something you can drag, press or break."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Picture a small furniture workshop. You have <strong>9 units of wood</strong>, <strong>8 hours</strong> of
            labour, <strong>7 hours</strong> of machine time and <strong>11 units</strong> of shipping effort. You build
            three things: chair kits, table kits and cabinet kits. Each one uses a different amount of each resource.
            You want to use everything up, with nothing left over.
          </>,
          <>
            That is four rules that all have to hold at once, and three numbers you are looking for. That is a{' '}
            <strong>system of linear equations</strong>. It is the same shape of problem as balancing a diet, splitting
            a bill, or fitting a line through data. This lecture is about how to answer questions like this without
            guessing.
          </>,
        ]}
        mappings={[
          {
            title: 'What you are looking for',
            body: 'How many of each kit to build. In the maths these are x₁, x₂ and x₃. They are called the unknowns.',
          },
          {
            title: 'The rules that must hold',
            body: 'One for each resource. Each says "the amount used adds up to exactly the amount you have".',
          },
          {
            title: 'Straight-line rules only',
            body: 'Each kit uses a fixed amount per unit. Nothing squares or doubles up. That is what "linear" means.',
          },
        ]}
        footnote="The answer is 2 chairs, 3 tables and 1 cabinet. But the answer is not the interesting part. What matters is that a method exists which finds it every time, and which also tells you honestly when there is no answer at all."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each one is its own page, and each has something interactive in it. They are also listed in the left menu, so
        you can jump straight back to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/lec1/${p.id}`}
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
        plain="A system of linear equations is a set of straight-line rules that all have to hold at once. Drawn out, they are lines or flat sheets, and the answer is wherever they all cross. Written down, they are a box of numbers. Gaussian elimination is a fixed set of tidying-up moves that never changes the answer but makes it easy to read."
        breaks="It breaks in two ways, and both are useful to know. If the rules disagree with each other, a row ends up saying 0 = 1 and there is no answer. That happens all the time with real data, and linear regression is how people cope with it. If a rule repeats what the others already said, you get free variables and endless answers, which means your data has not pinned the problem down."
      >
        <MathBlock
          intro="Six lines carry the whole lecture. Everything in the parts above is one of these being explained slowly."
          formulas={[
            {
              formula: 'a₁x₁ + a₂x₂ + … + aₙxₙ = b',
              reading:
                'One linear equation. Every unknown appears once, on its own, with a plain number in front. No squares, no roots, no two unknowns multiplied together.',
            },
            {
              formula: 'Ax = b',
              reading:
                'A whole system in three letters. A holds the numbers in front of the unknowns, x is the column you are looking for, b is the right-hand side.',
            },
            {
              formula: 'Ax = x₁c₁ + x₂c₂ + … + xₙcₙ',
              reading:
                'The same thing read down the columns. c₁ … cₙ are the columns of A, and x says how much of each to use. Solving means mixing them to land on b.',
            },
            {
              formula: 'x = xₚ + λ₁h₁ + λ₂h₂ + …',
              reading:
                'Every answer at once. xₚ is any single answer you found. Each h is a move that goes nowhere, so adding any amount of it keeps you on an answer.',
            },
            {
              formula: 'Rᵢ ↔ Rⱼ    Rₖ ← αRₖ (α ≠ 0)    Rᵢ ← Rᵢ + βRⱼ',
              reading:
                'The only three moves allowed. Each one is something you could do to the equations themselves, which is why none of them changes the answers.',
            },
            {
              formula: 'det = ad − bc,    A⁻¹ exists ⟺ det ≠ 0',
              reading:
                'For a 2 × 2 matrix. The inverse formula divides by the determinant, so a zero there means there is no inverse and the matrix has flattened everything onto a line.',
            },
          ]}
          legend={[
            {
              sym: 'A',
              name: 'The matrix of numbers',
              note: 'One row per equation, one column per unknown.',
              val: 'part 10',
            },
            {
              sym: 'x',
              name: 'The unknowns',
              note: 'A column of the values you are trying to find.',
              val: 'what you solve for',
            },
            {
              sym: 'b',
              name: 'The right-hand side',
              note: 'What each row has to add up to.',
              val: 'the black ring, part 11',
            },
            {
              sym: 'm × n',
              name: 'The shape',
              note: 'm rows by n columns. Rows are always said first.',
              val: 'part 7',
            },
            {
              sym: 'I',
              name: 'The do-nothing matrix',
              note: '1s down the diagonal, 0s elsewhere. Multiplying by it changes nothing.',
              val: 'part 8',
            },
            { sym: 'Aᵀ', name: 'Transpose', note: 'The matrix tipped over, so rows become columns.', val: 'part 9' },
            {
              sym: 'A⁻¹',
              name: 'Inverse',
              note: 'Undoes A. Only exists when the determinant is not zero.',
              val: 'parts 9 and 18',
            },
            {
              sym: 'λ',
              name: 'A free dial',
              note: 'Set it to anything you like. Each setting gives another valid answer.',
              val: 'part 12',
            },
            {
              sym: 'pivot',
              name: 'A step of the staircase',
              note: 'The first number in a row that is not zero. Its column gets pinned down.',
              val: 'part 15',
            },
            {
              sym: '0',
              name: 'The zero vector',
              note: 'All zeros. Recipes landing here turn one answer into all of them.',
              val: 'parts 12 and 16',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Every dataset is a matrix',
            how: 'One row per example, one column per feature. When a machine learning paper says "matrix", it usually means a table laid out exactly like the workshop table in part 4.',
          },
          {
            what: 'Linear regression is a broken system, handled well',
            how: 'Real data gives far more equations than unknowns, so they disagree and there is no exact answer. Regression finds the values that come closest instead — the same idea as the "off by" number in part 11.',
          },
          {
            what: 'Ax = b is one layer of a neural network',
            how: 'A layer multiplies its input by a matrix of weights and adds a bias. That is this equation, run millions of times a second.',
          },
          {
            what: 'Free variables mean your data is not enough',
            how: 'If the system has endless answers, lots of different models fit equally well and nothing chooses between them. That is why regularisation exists.',
          },
          {
            what: 'A zero determinant is a real warning sign',
            how: 'It means two of your columns say the same thing — like height in cm and height in inches. The maths cannot separate their effects, and neither can the model.',
          },
          {
            what: 'This is still what the computer does',
            how: 'When code calls solve(A, b), a careful descendant of exactly this procedure is what runs.',
          },
        ]}
      />
    </div>
  )
}
