# Working agreements for this repo

Standing rules. They apply to every change unless I say otherwise in the moment.

## When I send you a lecture PDF

Build it as a **chapter** under the right course, in the **Chapters** bucket. Never as a concept.

1. **Read every slide.** If the PDF has no text layer, render the pages and read them as images. Do not skim
   or summarise from the first few slides.
2. **Split it into parts.** One part per idea, usually 10–20 of them. Each part is:
   - its own route (`/session/<chapterId>/<partId>`),
   - its own numbered row in the left menu, under the chapter,
   - a page with a breadcrumb, a "part n of m" counter and previous/next links.
3. **Every part gets its own interactive.** Not one demo at the top of the chapter — a lab inside the part
   that needs it. A part with only words is not finished.
4. **Record where it came from.** Each part carries the slide numbers it was built from, so any claim on the
   page can be traced back to the deck.
5. **Write the cheat sheet, quiz and exam entries** into `knowledge.ts` for the chapter.
6. **Every page under the programme curriculum ends with why ML and AI care.** No exceptions — every part of
   every chapter, and every concept page. See the section below for what that block has to contain.
7. **Then look at the Concepts bucket.** A chapter follows one lecture in the order it was taught. A concept takes
   one reusable idea and explains it on its own terms, so it can be reached from anywhere and used by a later
   course. After adding a chapter, add or extend the concepts the lecture introduced — one page each, reusing the
   chapter's labs, ending with links back to the parts it was drawn from. Do not duplicate the chapter; a concept
   is a different cut through the same material, aimed at someone who has forgotten it rather than someone
   revising it.

## The courses are one programme, not six reading lists

A neuron is a dot product. A layer is a matrix multiply. "Lower is better" is the squared error from the
statistics course. The perceptron rule is gradient descent with the step size written as η. Those links are
the point of taking the courses together, so they are data in `src/lib/data/connections.ts`, not sentences
buried in a page.

- **A link is a row, and the row is written once.** `from` is the newer page, `to` is the page it leans on.
  The reverse direction is derived, so an older page can never disagree with the page that uses it.
- **Both ends are told.** `PartShell` renders the block on every part page from that one file, so adding a
  link makes the earlier lecture say "this comes back later" without its own file being touched. Never
  hand-write a cross-reference into a part body — put it in the data.
- **`carries` names the object being handed over**, not the topic. "z = w · x", "the m × n design matrix",
  "η, the learning rate". If the label would fit between any two pages, the link is not worth having.
- **`detail` is two sentences and it is the whole value.** The first says what the earlier page gives; the
  second says exactly what this page does with it. A reader who has forgotten the earlier page should be able
  to decide from the `detail` alone whether they need to go back.
- **A new chapter links out to every course it actually uses.** Maths, statistics and the ML course all get
  linked where the material genuinely comes from them, and the chapter's front page carries `ConnectionMap`,
  which groups the whole web by the course being drawn on.
- **A stale anchor renders as nothing, so count them.** `resolveAnchor` drops a link whose page does not
  exist rather than shipping a 404 — which means verification has to compare the number of links rendered
  against the number declared, not just check that the ones shown resolve.

## Why machine learning cares — on every single page

This is the reason I am reading any of it. Every page under the programme curriculum carries the block, and
it is judged as content, not as a footer.

- **Every part page uses `WhyAiml`; every concept and chapter front page uses `UsedInAiml`.** A page without
  one is not finished, and neither is a new lecture that adds parts without them.
- **It must be about *this* page.** Write it against the idea the page just taught, not the chapter's general
  area. The block on "determinant" talks about singular covariance matrices; the block on "rank" talks about
  collinear features. Two neighbouring parts must never be able to swap blocks without anyone noticing.
- **Name the real method, in the `method` field and in the prose.** The loss function, the kernel, the layer,
  the regulariser, the library call. "Used in AI" on its own says nothing; "this is why `numpy.linalg.lstsq`
  uses QR and not the normal equations" says something.
- **Two paragraphs, not one line.** The first says where the idea shows up and what it does there. The second
  earns its place — what *breaks* without it, the failure it explains, the exam-worthy consequence, or the
  practical decision it settles.
- **Statistics counts as ML too.** For the statistics course, connect to the modelling: the mean is what a
  squared-error loss predicts, the median is what absolute-error predicts, and outliers are why that choice
  matters.
- **Still bound by the verification rule.** Do not invent benchmark numbers or attribute a claim to a paper
  you have not checked. Name methods and describe mechanisms — those are checkable — rather than quoting
  figures.

## Never print an answer you cannot verify

This is the rule I care about most. A wrong answer on a revision site is worse than no page at all,
because I will trust it the night before an exam.

- **Read the slides an answer rests on. The actual slides, not a summary of them.** If you built a lab
  from notes rather than from the page itself, go back and look at the page before you ship it.
- **Where the source gives an answer, reproduce _that_ answer**, and make the interactive compute it, so
  the page cannot drift away from the deck later.
- **Where the source gives no answer** — practice sheets usually do not — you may work one out, but only
  if you then _check_ it: substitute back into the original equations, or run it in one of the labs. Say
  in the page that it was checked and how.
- **If a question is ambiguous, or the source is simply wrong, print no answer.** Say plainly which part
  cannot be settled and why, and leave it there. Do not guess at what was meant, do not "correct" the
  question to something that works, and do not offer two answers and let the reader choose. Deleting the
  claim is always better than dressing a guess up as an answer.
- Never delete a question just because it is awkward. Keep the question, drop the unverifiable answer.

## I am being examined on this

There are assignments, a mid-term and a semester exam. The site is what I revise from, so it has to be
enough on its own. When in doubt, go longer and slower — I would rather scroll than be stuck.

- **Explain every term, the first time it appears.** No symbol goes past unexplained: say what it is, how
  to say it aloud, and what it would be called in plain words. `⟨x, y⟩`, `‖x‖`, `Ω`, `λ`, `ψ`, `⊥`, `ω`,
  `∀`, `∈`, `Aᵀ` — all of them, every time a page is the first to use one.
- **Never assume a step is obvious.** If a line of algebra skips something, put the missing line in. The
  places I get lost are exactly the ones a lecturer thought were too small to write down.
- **Say what a thing is *for* before what it *is*.** A definition I cannot motivate is a definition I will
  not remember.
- **Go beyond the deck where the deck is thin.** Extra examples, a second way of seeing it, the special
  case that makes it click, the mistake people make in exams. This is wanted, not padding — *but* anything
  not from the slides must be marked as such, and it is still bound by the rule above it: if I cannot
  verify it, it does not go on the page. Beyond-the-deck material must never be presented as the
  lecture's own.
- **Every part answers "why does machine learning care?"** in its own words, with the real method named —
  the loss function, the kernel, the regulariser, the layer. A part without this is not finished.
- **Write for an examiner as well as for me.** The `knowledge.ts` exam points model what gets the marks;
  the page teaches the understanding that produces them.

## How to write

Plain, everyday English. The reader is a beginner and may not be a native speaker.

- Short sentences. If one needs a second read, rewrite it.
- Ordinary words: "work out" not "determine", "so" not "therefore", "the same" not "identical",
  "use" not "utilise".
- Introduce jargon, never assume it. A term gets a plain meaning the first time it appears, usually in a
  `Terms` block, with how to say it aloud where that helps.
- Say what a thing _is_ before saying what it is _called_.
- The exam answer points in `knowledge.ts` are the one exception: those model what an examiner wants to
  read, so they use the proper vocabulary.

## How the interactives must behave

- **Press-to-position and drag are one gesture.** A handle with `grab: 'anywhere'` is picked up by a press
  anywhere in the plot, and the drag carries on from there. Use it for anything with one degree of freedom.
- **Prefer a handle over another slider.** If a value is visible on the plot, it should be draggable there.
- **Never assert something the data does not support.** If a read-out cannot be trusted yet, say so —
  "Too early to say" beats a confident wrong answer.
- **Derive what you display, never store it.** If a number can be recomputed from the current state,
  recompute it. Stored copies go stale the moment the reader drags something.
- **Use exact arithmetic where rounding would confuse.** A beginner cannot tell a rounding error from a
  real answer.
- **Check the interaction can actually reach every case you claim it can.** Work the maths through before
  trusting a slider to demonstrate three outcomes.

## It has to work in every browser, not just yours

I open this on Chrome, on Edge and on my phone. A control that is invisible in one of them is broken, and
I will not find out until I am mid-revision.

- **Never let a control's visible parts live in a browser's own shadow DOM.** `::-webkit-slider-runnable-track`,
  `::-moz-range-progress` and their relatives are the least portable things in CSS. Draw the bar, the fill,
  the tick — whatever the reader has to see — as ordinary elements you control, and lay the native input
  over the top, transparent, so the browser keeps handling keyboard, mouse and touch. This is exactly how
  the slider vanished in Edge: its bar was a gradient painted on the vendor track.
- **Never put `var(--x)` where a browser dropping the variable would erase the whole thing.** An invalid
  value takes the entire declaration with it, so a missing variable inside a `background` does not give you
  a wrong colour, it gives you nothing at all. Where a variable is doing load-bearing work, write the plain
  value on the line above as a fallback.
- **One component per control.** Every slider on the site goes through `RangeInput`. A call site that
  hand-rolls its own input will drift, and a fix then has to be found in eight places instead of one.
- **Keep the focus ring.** If you remove an outline, put one back under `:focus-visible`.
- **A canvas holds no elements, so give every handle one of its own.** A chart is operated by dragging a
  mark that is painted, not built — there is nothing for Tab to land on, nothing for a screen reader to
  name, and nothing a verification run can find. `ChartCanvas` lays one focusable element per handle over
  the canvas, transparent to the pointer so press and drag stay the canvas's own gestures, and moves the
  handle on the arrow keys. Give each handle a `label`: it is the only name it has outside the drawing.
  Four labs on the site had no other control at all and could not be operated without a mouse.
- **Anything new and shiny needs a fallback or a shrug.** `text-wrap: pretty` degrades to normal wrapping
  and costs nothing. `color-mix` and `scrollbar-color` do not degrade — they disappear — so they get a
  plain-value line before them.

## Two words with no space between them

JSX drops the whitespace at the start and end of every line of text. So a sentence that reads fine in the
editor can compile to `whatangle` purely because the space happened to fall at a line end. It builds, it
type-checks, and you only find it by reading the page.

- **Never write an HTML entity in JSX text. This is the big one.** `&ldquo;` `&rsquo;` `&nbsp;` `&amp;` and
  friends trigger a real SWC bug: a text node that contains an entity *and* spans more than one line loses
  the space at its start. So `<strong>not</strong> is the complement…` renders as `notis the complement` —
  but only when there is an entity somewhere later in the same paragraph, which is why it looks random.
  Write the character itself: `“` `”` `’` `–` `…`, a real non-breaking space, a bare `&`. For the ones that
  are JSX syntax, use an expression: `{'{'}`, `{'}'}`, `{'<'}`, `{'>'}`. This single rule removed 38 of the
  39 glued words on the site.
- **Prettier is the formatter, and it runs before the check, not after.** `npm run format`, then
  `npm run check:spaces`. Note that Prettier turns a mid-line `{' '}` back into a plain space — it only
  keeps the `{' '}` form where it wraps a line — so you cannot fix a mid-line join that way. Remove the
  entity instead.
- **The checker compiles the file; it does not read it.** An earlier version modelled the whitespace rule by
  hand, called the file clean, and the built page still said `norm‖x‖₁`. `scripts/check-jsx-spaces.mjs` now
  runs the very SWC that Next builds with and inspects the children it emits, so it cannot disagree with
  what ships. `--fix` inserts `{' '}` where it can, and skips anything ambiguous.
- **The checker reports two kinds of join.** An `ERROR` is text next to an element and always wants fixing.
  A `note` is text next to a `{...}` expression, like `carr{plural}` — gluing is the point there, so these
  are printed to be glanced at and never fail. `<sub>` and `<sup>` are ignored: `a<sub>11</sub>` is a₁₁.
- **Never chase this with a regular expression.** It flags hundreds of innocent lines and still misses real
  ones.

## Before you say it is done

Run the real thing in a browser and prove it works:

- `npm run check` and a production build, both clean. That one command runs the type check, the linter,
  Prettier and the glued-words check, which is the set that has caught real breakage before.
- Every new page loads (200, not 404) and renders real content.
- Every new lab responds to a real click or drag, checked by asserting the state changed — not by counting
  elements on the page.
- **`npm run check:labs`, against a running production server, and clean.** It drives every part page in
  Chromium and fails the page unless something on it actually changed the text: a chart handle moved with
  the arrow keys, a slider, a tick box, a number box or a button, in that order. It exists because the
  element-hunting version could not see a canvas at all and quietly passed four drag-only labs it had
  never touched. Adding a lab means this must still pass, and so must the count — 204 part routes today.
- Every control the reader has to *see* is checked by reading its size and colour back out of the page, not
  by trusting that the CSS applied. A pseudo-element that silently paints nothing looks fine in a
  screenshot test and wrong on a laptop.
- Where the lecture gives an answer, the tool must reproduce **that** answer.
- No page errors in the console.

Report honestly. If something is broken or unfinished, say so plainly.

## Git

- Develop on `claude/aiml-learning-website-058p9o`. Never push anywhere else without being asked.
- If the branch's last PR was merged, restart from `main` rather than stacking on merged history.
- **When the work is built and verified, raise the PR and squash-merge it to main.** Do not wait to be asked.
  Verification comes first — never merge something you have not run in a browser.
- Say in the reply what was merged and what is still outstanding.

## Things that must not change

- The Supabase **secret** key never appears in a `NEXT_PUBLIC_` variable or anywhere in the repo. Only the
  publishable key is committed, in `.env.example`.
- No chart library and no icon library. Charts are hand-drawn Canvas 2D; glyphs are Unicode; chevrons are
  CSS triangles.
- The Catalyst UI kit stays unmodified except `link.tsx` and `dialog.tsx`, both marked with a comment.
- Nothing is invented to fill space. A course with no session yet says so, and a question whose answer
  cannot be verified carries no answer.

`README.md` carries the longer explanations of why these rules exist. Read it before changing an area you
have not touched before.
