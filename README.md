# The Crux of AI — The AIML Learning Lab

An interactive study site for a **BITS Pilani WILP M.Tech in AI & ML**. Each weekend session becomes a page: the
plain-English story first, a graphic you can drag and step through, then the maths with every symbol labelled and
carrying its live value from the chart. Underneath each session sit a cheat sheet, a quiz and exam-style questions.

The organising idea: **the navigation mirrors the real curriculum**, not an invented topic list. All 46 courses from the
programme brochure are in the tree. Courses that haven't been taught yet show their published syllabus and say plainly
that there is no page yet. Nothing is fabricated to fill space.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint
```

Node 20+ is enough; it was built and tested on Node 22.

## Stack

- **Next.js 16** (App Router, React 19) — pages are static where they can be, so sessions are linkable and shareable
  with classmates.
- **Tailwind CSS v4**, configured from `src/styles/tailwind.css`.
- **Catalyst UI kit** (`src/components/catalyst/`) — Tailwind Plus's React component set, used for the dialogs, form
  fields, buttons and links. `link.tsx` is the one file changed from the shipped kit: it now wraps `next/link`, as the
  Catalyst docs describe.
- All charts are hand-drawn **Canvas 2D**. No chart library, no icon library — the glyphs are Unicode and the chevrons
  are CSS triangles.

## Layout of the code

```
src/
  app/                     routes
    page.tsx               home
    programme/             brochure facts, delivery model, toolchains
    curriculum/            all 46 courses grouped by pool
    assessment/            marks, exams, logistics
    cheat-sheet/           whole-course cheat sheet + recall cards
    course/[courseId]/     one course: syllabus + its sessions
    session/[sessionId]/   one built session
    my/[id]/               a session you added yourself (client-only)
  components/
    catalyst/              the UI kit, unmodified except link.tsx
    charts/                ChartCanvas (hover, tooltips, easing) + the generic templates
    sessions/              the four built sessions and their shared parts
    shell/                 sidebar, nav tree, top bar, admin dialogs
    tabs/                  cheat sheet / quiz / exam tabs
  lib/
    chart/frame.ts         axes, dots, halos, the accent colour
    data/                  curriculum.json + typed wrappers, the knowledge base, brochure copy
    model/                 seeded sample data and the actual maths
    custom/store.tsx       localStorage-backed user sessions + the admin gate
    scope.ts               what the four tabs act on
```

### The four tabs, and what "scope" means

The tabs in the top bar act on whatever the tree has selected:

| Selection | What the tabs show |
|---|---|
| A session (e.g. Linear regression) | that session's 5 formulas, 4 quiz questions, 2 exam questions |
| A course (e.g. Machine Learning) | everything aggregated across its sessions |
| A global page (Home, Programme, Curriculum, Assessment) | no tabs at all |

The tab lives in the URL as `?tab=cheat|quiz|exam`, so any view is linkable. Navigating anywhere resets to Overview and
clears quiz answers and expanded exam answers.

### The charts

`ChartCanvas` handles the parts every chart needs: device-pixel-ratio sizing, a callback ref plus `ResizeObserver` so it
paints the moment it mounts, nearest-candidate hit testing with per-kind radii, and the tooltip.

Two details worth keeping:

- **Chart values ease, panel numbers don't.** Values glide toward their target on a rAF loop
  (`from + (to − from) * 0.22`) while the read-outs beside the chart stay exact and instant. Structural changes — a new
  `k`, reseeded flags — pass a `jumpKey` and snap instead, because easing between two unrelated layouts reads as a
  glitch.
- **Sample data comes from one seeded PRNG** (mulberry32, seed 7) in `lib/model/dataset.ts`. The numbers are identical
  on every load, which matters when you are comparing across sessions or across two people's screens. The three datasets
  share one stream, so keep them drawn in the order they are declared.

### The perceptron ordering gotcha

`trainEpoch` recomputes the misclassified set **after** the epoch's weight updates land. Working it out during the pass
makes the accuracy, the "still wrong" count and the red rings on the chart disagree with each other.

## The four sessions built so far

| Session | Course | What you can do to it |
|---|---|---|
| Linear regression | Machine Learning | Drag slope and intercept, watch MSE against the achievable floor, snap to the closed-form fit |
| Gradient descent | Mathematical Foundations | Change η, step or run 20, push past η = 1 and watch it diverge |
| k-means clustering | Machine Learning | Change k, alternate the assign and move steps, reseed to land in a different local minimum |
| The perceptron | Deep Neural Networks | Train a pass at a time and watch the boundary rotate as the mistakes run out |

## Adding your own session

Sign in as admin (sidebar footer), then use the `+` on any semester header. You get a title, a course, a write-up, a
`symbol = meaning` list that becomes the page's legend and its cheat sheet, one of four chart templates, and a file
upload.

Uploads are handled in the browser: images under 3.5 MB are embedded as data URLs, the first text or markdown file
pre-fills an empty write-up, and every filename and size is recorded as source material. **PDF and PPTX contents are not
parsed** — they are recorded as sources only.

### The admin gate is a visibility gate, not security

The first passcode set claims the copy (stored base64-obfuscated in `localStorage`); later sign-ins compare against it,
and the session flag lives in `sessionStorage` so it clears with the tab. It hides the editing buttons in this browser
and nothing more — the whole app runs on your machine, so anyone can read it. The dialog says so plainly.

Sessions you add live in this browser's `localStorage` under `aiml-lab-sessions-v1`. They do not follow you to another
device.

## If this grows a backend

The site is client-only today. In rough order of value:

1. **Parse PDF/PPTX server-side** and pre-fill the write-up and formula list from the session slides. This is the biggest
   genuine upgrade available.
2. **Move sessions to a database**, images to object storage rather than data URLs.
3. **Real auth**, gating the write endpoints rather than the buttons.
4. **Author the quiz and exam banks** in the same store as sessions, instead of hard-coding them in
   `lib/data/knowledge.ts`.

## Design tokens

Neutrals are the Zinc ramp throughout. The **accent** is a single CSS variable — `--acc` in `src/styles/tailwind.css`,
currently indigo `#4f46e5`. Change that one line to re-tint active nav rows, chips, count badges, live legend values, CTA
links and the slider fill. Everything else is monochrome; it is worth keeping it that way.

Alternates that were designed for: `#0284c7`, `#0d9488`, `#db2777`.

## Content principle

**Nothing is invented to fill a gap.** Courses not yet taught show their published syllabus and say so. Empty cheat
sheets and quizzes say they are written after the sessions, from what the faculty actually emphasised. That is what makes
the site trustworthy as a revision tool — please keep it.

## Licence

The Catalyst UI kit in `src/components/catalyst/` is covered by `CATALYST-LICENSE.md` and requires a Tailwind Plus
licence. The rest of the code and the written content are the author's.
