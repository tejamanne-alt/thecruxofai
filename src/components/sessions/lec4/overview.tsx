'use client'

import { partsOf } from '@/lib/data/lecture-parts'
import Link from 'next/link'
import { UsedInAiml } from '../algebra'
import { ConnectionMap } from '../connections'
import { AnalogyCallout, Explainers, MathBlock, SessionHeader } from '../session-parts'

/**
 * The front page of the chapter. It sets the scene and then hands you off to the
 * parts, without repeating them — a reader who wants the material should be one
 * click from it, not scrolling past a summary of it.
 */
export function Lecture4Overview() {
  const parts = partsOf('lec4')

  return (
    <div>
      <SessionHeader
        eyebrow="Mathematical foundations · Chapter"
        title="Lecture 4 — Eigenvalues & eigenvectors"
        intro="A matrix normally does two things to a vector at once: it turns it and it stretches it. This lecture hunts for the vectors it only stretches. Getting there takes two summaries of a matrix — the determinant and the trace — and a polynomial made by putting a letter on the diagonal. Getting past there gives you the two decompositions the rest of the programme is built on: A = QΛQᵀ and A = LLᵀ."
      />

      <AnalogyCallout
        paragraphs={[
          <>
            Spin a globe. Almost every city on it moves — but the two poles do not. They are the only points the spin
            leaves where they were, and if someone told you nothing about the globe except where its poles are and how
            fast it turns, you would know everything about that spin.
          </>,
          <>
            <strong>Eigenvectors are the poles of a matrix.</strong> They are the handful of directions it refuses to
            turn, and the <strong>eigenvalue</strong> attached to each one says how much it stretches that direction
            instead. Once you have them, a box of n² numbers has become a small list of directions and a small list of
            numbers — and the awkward operations, like taking a matrix to the power of 50 or finding its square root,
            become things you do to a list.
          </>,
        ]}
        mappings={[
          {
            title: 'Determinant and trace',
            body: 'The two summaries. One says whether the matrix can be undone; the other adds the diagonal and turns out to be the sum of the eigenvalues.',
          },
          {
            title: 'The characteristic polynomial',
            body: 'det(A − λI). Its roots are the eigenvalues, its constant term is det A, and its next coefficient is the trace.',
          },
          {
            title: 'A = QΛQᵀ and A = LLᵀ',
            body: 'A symmetric matrix is a rotation, a stretch and the rotation undone. A positive definite one also has a square root, which is how Gaussian samples are drawn.',
          },
        ]}
        footnote="Both of the deck's worked examples are computed live on their pages: the all-ones matrix of slide 16 gives λ = 2 and 0 with the slide's own eigenvectors, and the complex vector of slide 23 gives xᵀx = 3 + 6i exactly. The two questions the deck asks and leaves open — the shear on slide 17 and the rotation it asks you to ponder — are worked out, checked against the same exact solver, and marked on the page as not being the deck's own answers."
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
            href={`/session/lec4/${p.id}`}
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
        plain="A determinant is one number saying whether a square matrix can be undone; it is worked out by cofactors, and row operations either flip its sign (a swap) or leave it alone (adding a multiple of a row). A trace is the diagonal added up. Put λ on the diagonal and take the determinant and you get the characteristic polynomial, whose roots are the eigenvalues — the numbers λ for which some non-zero x has Ax = λx. Find each λ first, then find its eigenvectors as the nullspace of A − λI. Symmetric matrices are the lucky case: their eigenvalues are always real, eigenvectors from different eigenvalues are always at right angles, and there are always enough of them to make an orthonormal basis. That is the spectral theorem, and it lets any symmetric A be written as QΛQᵀ. A symmetric matrix that is also positive definite has a second factorisation, A = LLᵀ with L lower triangular, which is how a correlated Gaussian sample is generated."
        breaks="Three traps. First, not every matrix has enough eigenvectors: the shear on slide 17 has λ = 0 as a double root but only one eigenvector, so it cannot be diagonalised at all — and 'how often λ is a root' and 'how many directions it gives' are different counts with different names. Second, a rotation has no real eigenvalues, so the picture of 'a direction that survives' fails completely for it; the eigenvalues exist, they are just complex, which is why the complex slides are in this deck at all. Third, det A ≠ 0 is not the same as det A being comfortably far from zero — a nearly-singular matrix has an inverse that magnifies noise, which is exactly what collinear features do to a regression."
      >
        <MathBlock
          intro="Twelve lines carry the whole lecture. Every part above is one of these taken slowly."
          formulas={[
            {
              formula: 'det(A) = aⱼ₁Cⱼ₁ + aⱼ₂Cⱼ₂ + … + aⱼₙCⱼₙ',
              reading:
                'Cofactor expansion along row j — or down any column instead. Every line gives the same answer, so pick the one with the most zeros.',
            },
            {
              formula: 'Cⱼₖ = (−1)ʲ⁺ᵏ Mⱼₖ',
              reading:
                'The cofactor is the minor with a chessboard sign on it. The minor is what is left after row j and column k are struck out.',
            },
            {
              formula: 'swap rows ⟹ ×(−1);  add a multiple of a row ⟹ unchanged',
              reading:
                'Proved by induction on slides 5 to 8. The second follows from the first, because a matrix with two equal rows must equal its own negative.',
            },
            {
              formula: 'rank A = n  ⟺  det A ≠ 0',
              reading:
                'The bridge is det(A) = (−1)ˢ det(U) after elimination, with s the number of row interchanges. Both directions run through Ax = 0 having only x = 0.',
            },
            {
              formula: 'tr(A) = Σᵢ aᵢᵢ,   tr(AB) = tr(BA)',
              reading:
                'The diagonal added up. The second holds even when AB is n × n and BA is k × k — different matrices, different sizes, same trace.',
            },
            {
              formula: 'pₐ(λ) = det(A − λI) = c₀ + c₁λ + … + (−1)ⁿλⁿ',
              reading:
                'The characteristic polynomial. c₀ = det A by setting λ = 0, and cₙ₋₁ = (−1)ⁿ⁻¹ tr A because only the diagonal product can reach that power.',
            },
            {
              formula: 'Ax = λx,  x ≠ 0',
              reading:
                'The eigenvalue equation. Equivalent to (A − λI)x = 0 solvable non-trivially, to rank(A − λI) < n, and to det(A − λI) = 0.',
            },
            {
              formula: 'Eλ = null(A − λI)',
              reading:
                'The eigenspace: every eigenvector of λ, plus the zero vector. Its dimension is the geometric multiplicity, and finding it is an elimination job.',
            },
            {
              formula: 'AᵀA symmetric, and positive definite when rank A = n',
              reading:
                'Because xᵀAᵀAx = ‖Ax‖². This is the matrix inside the least-squares solution, with n features and m data vectors.',
            },
            {
              formula: 'xᴴ = x̄ᵀ,   ‖x‖² = xᴴx',
              reading:
                'The conjugate transpose. Needed because xᵀx on a complex vector gives 3 + 6i in the deck’s example, which is not a length.',
            },
            {
              formula: 'A symmetric ⟹ A = QΛQᵀ,  QᵀQ = I',
              reading:
                'The spectral theorem. Read right to left: rotate into the eigenvector axes, stretch each one by its λ, rotate back.',
            },
            {
              formula: 'Σλᵢ = tr A,  Πλᵢ = det A,  A = LLᵀ',
              reading:
                'Two free checks on any eigenvalue answer, and the Cholesky factor — the matrix that turns independent noise into a sample with covariance Σ.',
            },
          ]}
          legend={[
            { sym: 'det A', name: 'Determinant', note: 'One number. Zero exactly when A is singular.', val: 'part 2' },
            { sym: 'Mⱼₖ', name: 'Minor', note: 'Determinant of A with row j and column k struck out.', val: 'part 2' },
            {
              sym: 'tr A',
              name: 'Trace',
              note: 'The diagonal added up. Also the sum of the eigenvalues.',
              val: 'part 5',
            },
            {
              sym: 'λ',
              name: 'An eigenvalue',
              note: 'Said "lambda". The stretch applied to a direction that is not turned.',
              val: 'part 7',
            },
            {
              sym: 'pₐ(λ)',
              name: 'Characteristic polynomial',
              note: 'det(A − λI). Its roots are the eigenvalues.',
              val: 'part 6',
            },
            {
              sym: 'Eλ',
              name: 'Eigenspace',
              note: 'The nullspace of A − λI. A subspace, so 0 is in it.',
              val: 'part 10',
            },
            {
              sym: 'xᴴ',
              name: 'Conjugate transpose',
              note: 'Transpose and conjugate. Written x̄ᵀ on the slides.',
              val: 'part 15',
            },
            {
              sym: 'Q',
              name: 'Orthonormal eigenvectors',
              note: 'One per column, so QᵀQ = I and Q⁻¹ = Qᵀ.',
              val: 'part 17',
            },
            {
              sym: 'Λ',
              name: 'The eigenvalues, diagonal',
              note: 'Capital lambda. Same order as the columns of Q.',
              val: 'part 17',
            },
            { sym: 'L', name: 'The Cholesky factor', note: 'Lower triangular, with LLᵀ = A.', val: 'part 19' },
          ]}
        />
      </Explainers>

      <ConnectionMap topic="lec4" />

      <UsedInAiml
        rows={[
          {
            what: 'PCA is this chapter, run on a covariance matrix',
            how: 'The eigenvectors of Σ are the principal components and the eigenvalues are the variance along each. Keeping the top k is the projection, and the fraction of tr(Σ) they account for is the variance explained.',
          },
          {
            what: 'Symmetry is why numpy has eigh as well as eig',
            how: 'The spectral theorem is what lets the symmetric routine assume real eigenvalues and orthonormal eigenvectors — so it is faster, returns real arrays, and sorts them. Handing eigh a non-symmetric matrix does not error, it silently reads one triangle.',
          },
          {
            what: 'AᵀA is the matrix inside every least-squares fit',
            how: 'Positive definite exactly when the features are independent, which is why collinear columns break the normal equations. Ridge adds λI to lift every eigenvalue and force the inverse back into existence.',
          },
          {
            what: 'The determinant is how a Gaussian detects a collapsed distribution',
            how: 'The density carries 1/√det(Σ), so a zero determinant means the data lies on a lower-dimensional sheet. In practice log det Σ = Σ log λᵢ is used, because the product itself overflows.',
          },
          {
            what: 'Cholesky is how correlated randomness is generated',
            how: 'Factor Σ = LLᵀ, draw independent standard normals z, take μ + Lz. That is the reparameterisation trick in a variational autoencoder and the sampling step in a Gaussian process, unchanged.',
          },
          {
            what: 'A failed Cholesky is the standard positive-definiteness test',
            how: 'Cheaper and more reliable than computing eigenvalues and checking signs. When it fails on a kernel matrix, the universal fix is to add a small multiple of the identity — jitter — which is ridge regression again.',
          },
          {
            what: 'Equal eigenvalues are why two PCA runs can disagree',
            how: 'A repeated eigenvalue makes its eigenspace a whole plane, so any rotation within that plane is as valid a pair of components. Read a scree plot for gaps, not for values.',
          },
          {
            what: 'tr(AB) = tr(BA) is how matrix-calculus derivations move',
            how: 'Any scalar equals its own trace, so xᵀAx becomes tr(Axxᵀ) and the thing being differentiated moves to the outside. It also counts effective degrees of freedom as tr(H) for a hat matrix H.',
          },
        ]}
      />
    </div>
  )
}
