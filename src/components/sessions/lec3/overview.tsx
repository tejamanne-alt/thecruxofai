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
export function Lecture3Overview() {
  const parts = partsOf('lec3')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 3 — Analytic geometry"
        intro="A vector space lets you add and stretch, and that is all — it has no ruler and no protractor in it. This lecture adds one object, the inner product, and gets length, distance and angle out of it. Then it turns the idea round: now that right angles mean something, build a basis made entirely of them."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Imagine a map with towns marked on it but no scale, no compass rose and no grid. You can still say which
            towns lie between which others — that is the structure Lecture 2 gave you. What you cannot say is how far
            apart anything is, or in what direction.
          </>,
          <>
            Printing a scale bar on that map changes everything at once: distances become readable, and so do bearings.
            The <strong>inner product</strong> is that scale bar. And here is the part that surprises people — you get
            to <em>choose</em> it, and different choices give genuinely different answers about what is close and what
            is at right angles.
          </>,
        ]}
        mappings={[
          {
            title: 'Norm — length',
            body: 'How big one vector is. Three rules make something a length; Manhattan and Euclidean both keep them and still disagree.',
          },
          {
            title: 'Inner product — angle',
            body: 'Bilinear, symmetric, positive definite. Every one of them is a symmetric positive-definite matrix in disguise.',
          },
          {
            title: 'Orthonormal basis',
            body: 'Axes that are mutually at right angles and each of length 1. Coordinates stop needing any work, and Gram–Schmidt builds one from any basis you have.',
          },
        ]}
        footnote="Both of the deck's worked examples — the cos ω = −1/3 on slide 16 and the Gram–Schmidt elimination on slide 22 — are computed live on their pages and agree with the slides. Anything added beyond the deck is marked as such on the page."
      />

      <h2 className="mt-8 mb-1.5 text-lg font-semibold tracking-[-0.02em]">The lecture, in {parts.length} parts</h2>
      <p className="mb-4 max-w-[660px] text-[14px]/[1.6] text-zinc-600">
        Each is its own page with its own lab, its own vocabulary list, and a note on what the idea is used for in
        machine learning. Each is listed in the left menu so you can come straight back to any of them later.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {parts.map((p, i) => (
          <Link
            key={p.id}
            href={`/session/lec3/${p.id}`}
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
        plain="A norm is a length: it scales when you scale the vector, it never lets a detour beat the direct route, and it is zero only for the zero vector. An inner product is a rule taking two vectors to one number, bilinear and symmetric and positive definite, and on a finite-dimensional space every one of them is xᵀAy for a symmetric positive-definite A. From an inner product you get a length, from the length a distance, and from Cauchy–Schwarz an angle — because that inequality pins a certain ratio inside [−1, 1] so it can be called a cosine. Two vectors are orthogonal when their inner product is zero, a matrix is orthogonal when AᵀA = I, and a basis is orthonormal when its vectors are mutually orthogonal and each of length 1. Gram–Schmidt turns any basis into one, and the deck does it by row-reducing [AᵀA | Aᵀ]."
        breaks="The big one: orthogonality is not a property of two vectors on their own. It depends on which inner product you picked, and the deck's own example shows two vectors that are at right angles under the dot product and at 109.5° under another. The other trap is direction of travel — a large inner product means similar, while a large distance means different, so the two measures run opposite ways. And 'orthogonal matrix' confusingly demands orthonormal columns, not merely orthogonal ones."
      >
        <MathBlock
          intro="Ten lines carry the whole lecture. Every part above is one of these taken slowly."
          formulas={[
            {
              formula: '‖λx‖ = |λ|‖x‖,  ‖x + y‖ ≤ ‖x‖ + ‖y‖,  ‖x‖ = 0 ⟹ x = 0',
              reading:
                'The three rules that make something a length. Scaling scales it, detours never help, and only nothing has no size.',
            },
            {
              formula: '‖x‖₁ = Σ|xᵢ|,   ‖x‖₂ = √(Σxᵢ²)',
              reading:
                'Manhattan and Euclidean. Both are honest norms; their unit balls are a diamond and a circle, which is the whole difference between Lasso and ridge.',
            },
            {
              formula: 'Ω(λx + ψy, z) = λΩ(x, z) + ψΩ(y, z)',
              reading:
                'Bilinear — and the same again in the second slot. Two separate promises, not one joint one: scaling both arguments gives λ², not λ.',
            },
            {
              formula: 'bilinear + symmetric + positive definite = inner product',
              reading:
                'Positive definiteness is what gives you length, symmetry is what makes angle well defined, bilinearity is what makes it a matrix.',
            },
            {
              formula: '⟨x, y⟩ = x̂ᵀAŷ,  A symmetric positive definite',
              reading:
                'The theorem the lecture turns on, and it goes both ways. Choosing an inner product and choosing an SPD matrix are the same act.',
            },
            {
              formula: '‖x‖ = √⟨x, x⟩,   d(x, y) = ‖x − y‖',
              reading:
                'The induced norm and the metric it gives. Every inner product produces a length; not every length comes from an inner product.',
            },
            {
              formula: '|⟨x, y⟩| ≤ ‖x‖‖y‖',
              reading:
                'Cauchy–Schwarz. Proved from ‖u − αv‖² ≥ 0 by putting in the worst α. Equality exactly when the two are parallel.',
            },
            {
              formula: 'cos ω = ⟨x, y⟩ / (‖x‖‖y‖),   x ⊥ y ⟺ ⟨x, y⟩ = 0',
              reading:
                'The angle, legal only because of the line above. Orthogonality is checked by the inner product being zero — no angle ever needs working out.',
            },
            {
              formula: 'AᵀA = I = AAᵀ,   Aᵀ = A⁻¹',
              reading:
                'An orthogonal matrix. Its columns are orthonormal, it preserves every length and every angle, and its inverse is free.',
            },
            {
              formula: '[ AᵀA | Aᵀ ]  →  [ U | L⁻¹Aᵀ ]',
              reading:
                'Gram–Schmidt as the deck does it. QᵀQ comes out upper triangular and symmetric at once, so it is diagonal, so the columns are orthogonal.',
            },
          ]}
          legend={[
            { sym: '‖x‖', name: 'Norm', note: 'Length. Double bars, unlike |λ| for a number.', val: 'part 2' },
            { sym: '⟨x, y⟩', name: 'Inner product', note: 'Two vectors in, one plain number out.', val: 'part 5' },
            {
              sym: 'Ω',
              name: 'A bilinear mapping',
              note: 'The general two-argument rule, before it earns the name.',
              val: 'part 4',
            },
            { sym: 'λ, ψ', name: 'Scalars', note: 'Ordinary numbers. ψ is said "sigh".', val: 'part 4' },
            {
              sym: 'A',
              name: 'The SPD matrix',
              note: 'The inner product, written down. Choosing it chooses the geometry.',
              val: 'part 6',
            },
            {
              sym: 'x̂',
              name: 'Coordinates of x',
              note: 'With respect to an ordered basis — not the vector itself.',
              val: 'part 6',
            },
            { sym: 'd(x, y)', name: 'Metric', note: 'Distance. The length of x − y.', val: 'part 10' },
            { sym: 'ω', name: 'The angle', note: 'Lower-case omega, always in [0, π].', val: 'part 11' },
            { sym: '⊥', name: 'Perp', note: 'Orthogonal. Means the inner product is zero.', val: 'part 13' },
            {
              sym: 'Q',
              name: 'Orthogonal columns',
              note: 'What Gram–Schmidt produces, before normalising.',
              val: 'part 20',
            },
          ]}
        />
      </Explainers>

      <UsedInAiml
        rows={[
          {
            what: 'Cosine similarity is part 11, unchanged',
            how: 'Search, recommendation and RAG all rank by ⟨x, y⟩/(‖x‖‖y‖). It is preferred over distance because it ignores length, so a long document and a short one on the same topic still count as close.',
          },
          {
            what: 'The unit ball explains Lasso versus ridge',
            how: 'The L1 diamond has corners on the axes, so the best solution tends to land where a coordinate is exactly zero — features drop out. The L2 circle has no corners, so it shrinks weights without removing them.',
          },
          {
            what: 'Choosing A is choosing what "similar" means',
            how: 'Mahalanobis distance takes A = Σ⁻¹ so correlated, differently-scaled features stop drowning each other out. Metric learning goes further and learns A from labelled pairs.',
          },
          {
            what: 'Cauchy–Schwarz is why similarity scores are bounded',
            how: 'It is the only reason cosine similarity and the correlation coefficient sit in [−1, 1]. It is also why attention scores are divided by √d before the softmax.',
          },
          {
            what: 'Orthogonal matrices keep deep networks trainable',
            how: 'They preserve length exactly, so a signal passing through many layers neither explodes nor vanishes. Orthogonal initialisation is standard for very deep and recurrent models.',
          },
          {
            what: 'Gram–Schmidt is how regression is actually fitted',
            how: 'The QR decomposition, not the normal equations. Forming AᵀA squares the condition number and loses accuracy, so every serious library builds an orthonormal basis instead.',
          },
          {
            what: 'High dimensions are nearly all right angles',
            how: 'Part 12 runs the experiment slide 13 asks for. It is why a 768-dimensional embedding can hold far more than 768 distinguishable concepts, and why random projections work.',
          },
        ]}
      />
    </div>
  )
}
