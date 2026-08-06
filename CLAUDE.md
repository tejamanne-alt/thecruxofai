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
6. **Then look at the Concepts bucket.** A chapter follows one lecture in the order it was taught. A concept takes
   one reusable idea and explains it on its own terms, so it can be reached from anywhere and used by a later
   course. After adding a chapter, add or extend the concepts the lecture introduced — one page each, reusing the
   chapter's labs, ending with links back to the parts it was drawn from. Do not duplicate the chapter; a concept
   is a different cut through the same material, aimed at someone who has forgotten it rather than someone
   revising it.

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

## Before you say it is done

Run the real thing in a browser and prove it works:

- `npx tsc --noEmit`, `npx eslint src --max-warnings=0`, and a production build, all clean.
- Every new page loads (200, not 404) and renders real content.
- Every new lab responds to a real click or drag, checked by asserting the state changed — not by counting
  elements on the page.
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
