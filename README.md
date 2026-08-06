# The Crux of AI — The AIML Learning Lab

An interactive study site for a **BITS Pilani WILP M.Tech in AI & ML**. Each weekend session becomes a page: the
plain-English story first, a graphic you can drag and step through, then the maths with every symbol labelled and
carrying its live value from the chart. Underneath each session sit a cheat sheet, a quiz and exam-style questions.

The organising idea: **the navigation mirrors the real curriculum**, not an invented topic list. All 46 courses from the
programme brochure are in the tree. Courses that haven't been taught yet show their published syllabus and say plainly
that there is no page yet. Nothing is fabricated to fill space.

`CLAUDE.md` at the root holds the working agreements — how a lecture PDF becomes a chapter, how to write, how the
interactives must behave, and what has to be verified before anything is called done. Read it first.

## Running it

```bash
npm install
cp .env.example .env.local   # Supabase URL + publishable key
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint
```

Node 20+ is enough; it was built and tested on Node 22.

## Stack

- **Next.js 16** (App Router, React 19) — every view is a real URL, so sessions and tabs are linkable and shareable
  with classmates.
- **Supabase** — Postgres for user-written sessions, Storage for uploaded images, and Auth for who may write what. See
  the Supabase section below.
- **Tailwind CSS v4**, configured from `src/styles/tailwind.css`.
- **Catalyst UI kit** (`src/components/catalyst/`) — Tailwind Plus's React component set, used for the dialogs, form
  fields, buttons and links. Two files differ from the shipped kit, both marked with a comment:
  - `link.tsx` wraps `next/link`, as the Catalyst docs describe.
  - `dialog.tsx` adds `z-50` to its two fixed layers. The kit ships with no z-index, which assumes a dialog is the only
    fixed element on the page; here it lost to the mobile nav and rendered behind it.
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
    my/[id]/               a session someone wrote, served from Postgres
  components/
    catalyst/              the UI kit, unmodified except link.tsx and dialog.tsx
    charts/                ChartCanvas (hover, tooltips, easing) + the generic templates
    sessions/              the built sessions and chapters, plus their shared parts
    shell/                 sidebar, nav tree, top bar, auth + add-session dialogs
                           (stacking layers are documented at the top of app-shell.tsx)
    tabs/                  cheat sheet / quiz / exam tabs
  lib/
    chart/frame.ts         axes, dots, halos, the accent colour
    data/                  curriculum.json + typed wrappers, the knowledge base, brochure copy
                           (SessionKind — concept vs chapter — lives in curriculum.ts)
    model/                 seeded sample data and the actual maths
                           (stats.ts matches the lecture's own quartile rule — see below)
    custom/                user sessions: Supabase-backed store, server queries, shared types
    supabase/              browser + server clients, generated DB types, env guard
    scope.ts               what the four tabs act on
```

### Concepts and Chapters

Every course holds two buckets, both collapsible:

| Bucket       | What goes in it                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Concepts** | One idea, explained on its own terms — algebra, gradient descent, k-means. Reusable: the same concept underpins several courses. |
| **Chapters** | The course's own material in the order it was actually taught. Tied to this course and nothing else.                             |

The split is for revision. The night before an exam you want the **chapters**; when something refuses to click you want
the **concept**.

The buckets appear only under courses that have at least one page. The forty-odd untaught courses stay single rows
rather than sprouting two empty branches each; add a page to one and its buckets appear. A course with concepts but no
chapters still shows both, so the empty slot is visible rather than implied.

### How a chapter is built from a lecture

A chapter covers one lecture. It is too much for a single page, so it is split into **parts**, and each part is its own
route and its own row in the left menu. Lecture 1 has 18 of them.

- `lib/data/lecture-parts.ts` holds the part names, teasers and slide numbers. **Names only, no components** — the left
  menu imports this file, and the menu must not drag every chart on the site into its bundle.
- `app/session/[sessionId]/page.tsx` renders the chapter's front page: the story, a card per part, and the shared maths
  block.
- `app/session/[sessionId]/[partId]/page.tsx` renders one part inside `PartShell`, which adds the breadcrumb, the
  "part n of m" counter and the previous/next links. A chapter read start to finish never needs the left menu.
- `components/sessions/lec1/parts.tsx` holds the bodies, keyed by part id.

The four tabs (cheat sheet, quiz, exam) act on the **whole chapter** from any part page. A cheat sheet for one part
would be four lines long and useless the night before an exam.

**`parts.tsx` must not be a client module.** It only composes — every lab it renders is `'use client'` itself. Marking
it `'use client'` turns `LEC1_PARTS` into a client _reference_ when the server route imports it, so the lookup comes
back empty and every part page 404s. That is a confusing failure, because the build succeeds and the routes exist.

Inside a part, four things recur: `Para` for the explaining, `Terms` for the jargon (each word gets a plain meaning,
and how to say it aloud where that helps), `Worked` for worked examples in a monospaced block, and `Takeaway` for the
one line to remember.

### Every part has something to operate

Not one shared demo at the top — a lab in the part that needs it. Lecture 1 ships fourteen, in five files:

| File                    | What is in it                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vector-labs.tsx`       | Adding and stretching arrows; one line with a point you test against it; combining two equations while the crossing point refuses to move; sliding along the answer line with λ |
| `workshop-lab.tsx`      | The furniture problem as four bars you try to land exactly on                                                                                                                   |
| `planes-lab.tsx`        | Three equations as three sheets in a box you spin                                                                                                                               |
| `matrix-basics-lab.tsx` | Shape and the name of each slot; adding and scaling; transpose; the same system written both ways                                                                               |
| `echelon-labs.tsx`      | Click-the-pivots with instant marking; reading zero-recipes off the tidiest form; the two sweeps as a schematic                                                                 |

Plus `two-lines-chart`, `column-picture-chart`, `matrix-lab` and `elimination-lab` from earlier work.

Three rules learned building them:

- **Never assert a classification the data does not support.** The elimination lab used to announce "endless answers"
  before a single step, because counting pivots on a matrix that is not yet a staircase gives the wrong count with a
  straight face. It now says _"Too early to say"_ until `isEchelon` passes. A contradiction row is the exception —
  `0 = 5` is false at any stage.
- **Use exact fractions, not floats.** `lib/model/fraction.ts` exists because elimination divides constantly, and three
  steps of floating point turn the numbers to noise. A beginner cannot tell a real answer from a rounding error, which
  defeats the point of showing the working.
- **Check the geometry actually reaches every case you claim.** The planes lab first offered a slider that was supposed
  to produce all three outcomes. It could not: the first two normals span every vector whose 1st and 3rd parts match,
  so sliding a sheet whose normal is outside that set never makes the determinant zero. The third sheet has to _tilt_,
  not slide, so it became three presets — and the panel works its verdict out from the geometry rather than from which
  button was pressed.

### Match the lecture's own numbers

`lib/model/stats.ts` uses the quartile rule the ISM lecture taught: position = k(n+1)/4, then read between the two
neighbouring values. Several rules are in circulation and they disagree, so software picked at random will hand back
answers that do not match the homework. On the lecture's example (11 12 13 16 16 17 17 18 21) this one gives
Q1 = 12.5 and Q3 = 17.5, exactly as the slide says.

Everywhere a lecture publishes a worked answer, the tool must reproduce **that** answer. Both chapters are checked
against theirs: the linear-algebra lab lands on slide 25's particular solution with the same two free variables, and
the statistics labs reproduce SS = 44 / s = 2.345 for group 1 and SS = 134 / s = 4.093 for group 2.

### Two traps in the interactives, both found by testing

- **Do not let a chart's axis follow its own data during a drag.** The box plot first computed its window from the
  live values. Dragging a dot right widened the axis, so the same pixel then meant a larger number, which widened it
  again — the value ran away from the pointer and landed at 39 when it was aimed at 28. The window is now fixed when
  a dataset loads.
- **Seed the nav tree's open state from the URL, not from a hard-coded list.** The tree only revealed a row when the
  path _changed_, and the initial state named three courses explicitly. A hard load of a deep link into any other
  course arrived collapsed, which is exactly what happened the moment Statistics gained its first chapter.

### Writing style

Plain, everyday English everywhere the reader can see it. Short sentences. Ordinary words. Jargon is introduced, never
assumed — a term gets defined the first time it appears, usually in a `Terms` block. Prefer "work out" to "determine",
"so" to "therefore", "the same" to "identical". If a sentence needs a second read, rewrite it.

The exam answer points in `knowledge.ts` are the one deliberate exception: those model what an examiner wants to read,
so they use the proper vocabulary.

### The four tabs, and what "scope" means

The tabs in the top bar act on whatever the tree has selected:

| Selection                                               | What the tabs show                                     |
| ------------------------------------------------------- | ------------------------------------------------------ |
| A session (e.g. Linear regression)                      | that session's own formulas, quiz and exam questions   |
| A course (e.g. Machine Learning)                        | everything from all of its sessions, gathered together |
| A global page (Home, Programme, Curriculum, Assessment) | no tabs at all                                         |

The tab lives in the URL as `?tab=cheat|quiz|exam`, so any view is linkable. Navigating anywhere resets to Overview and
clears quiz answers and expanded exam answers.

### The charts

`ChartCanvas` handles the parts every chart needs: device-pixel-ratio sizing, a `ResizeObserver` attached in a stable
effect so it paints the moment it mounts, nearest-candidate hit testing with per-kind radii, and the tooltip.

The observer has to live in an effect rather than a ref callback: an unstable ref callback is torn down and re-run on
every render, and the `setSize` inside it then loops forever.

Two details worth keeping:

- **Chart values ease, panel numbers don't.** Values glide toward their target on a rAF loop
  (`from + (to − from) * 0.22`) while the read-outs beside the chart stay exact and instant. Structural changes — a new
  `k`, reseeded flags — pass a `jumpKey` and snap instead, because easing between two unrelated layouts reads as a
  glitch.
- **Sample data comes from one seeded PRNG** (mulberry32, seed 7) in `lib/model/dataset.ts`. The numbers are identical
  on every load, which matters when you are comparing across sessions or across two people's screens. The three datasets
  share one stream, so keep them drawn in the order they are declared.

### Dragging: press and drag are one gesture

Anything the reader can move gets a `DragHandle`. A handle with `grab: 'anywhere'` is picked up by a press anywhere in
the plot — the mark jumps to the press and the drag carries straight on from there. Use it for every mark with one
degree of freedom: a marker riding a curve, a boundary sliding along its normal. Those readers are pointing at a
position, not at a dot, and asking them to hit a 20px target first is the bug this replaced. Handles found by
proximity always win, so a chart can mix the two — linear algebra grabs î and ĵ precisely but takes a press anywhere
for the vector.

New charts should prefer a handle over another slider. If a value is visible on the plot, it should be draggable there.

On touch this splits deliberately. The canvas is `touch-pan-y`, and a non-passive `touchstart` listener calls
`preventDefault` **only** when a finger lands on a handle — so dragging the mark itself works, while a swipe anywhere
else still scrolls the page instead of trapping it behind a 400px-tall chart. A press away from the mark therefore
stays a tap: it positions, but does not begin a drag, because the browser has already claimed that gesture.

### Derive what the chart shows, never store it

`misclassified(w, b)` is a pure function, and the perceptron calls it on every render instead of keeping the count in
state. The reader can drag the boundary as well as train it, and a stored count goes on describing the line they moved
away from — while the caption underneath claims the rings are the ones it gets wrong _right now_. Same rule anywhere a
read-out can be recomputed from the current state.

`trainEpoch` returns only the new `w` and `b` for the same reason; the misclassified set is worked out afterwards, from
the updated line. Computing it during the pass makes the accuracy, the "still wrong" count and the red rings on the
chart disagree with each other.

## The sessions built so far

The first two are the foundations everything else leans on, so they come first in the tree.

| Session            | Course                   | What you can do to it                                                                                                                |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Algebra            | Mathematical Foundations | Turn a rate and a constant into a rule, then bolt on a second stage (ReLU, sigmoid, square) and watch a straight line become a curve |
| Linear algebra     | Mathematical Foundations | Set the four entries of a 2×2 matrix and watch the grid bend; squash the determinant to zero and see information vanish              |
| Linear regression  | Machine Learning         | Drag slope and intercept, watch MSE against the achievable floor, snap to the closed-form fit                                        |
| Gradient descent   | Mathematical Foundations | Change η, step or run 20, push past η = 1 and watch it diverge                                                                       |
| k-means clustering | Machine Learning         | Change k, alternate the assign and move steps, reseed to land in a different local minimum                                           |
| The perceptron     | Deep Neural Networks     | Train a pass at a time and watch the boundary rotate as the mistakes run out                                                         |

And two chapters, each covering a real lecture end to end. A chapter is split into parts — see below:

| Chapter                                                      | Course                              | What you can do to it                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lecture 1 — Linear equations, matrices, Gaussian elimination | Mathematical Foundations            | 18 parts, each its own page and its own row in the left menu, each with something to operate. Drag two lines until they coincide; spin three sheets in a box; mix matrix columns until a target becomes unreachable; click the pivots and get marked; run elimination one legal row operation at a time on the lecture's own systems |
| Lecture 1 — Describing data: centre, spread and outliers     | Introduction to Statistical Methods | 14 parts. Drag a dot and watch the mean chase it while the median stays put; grow the squared deviations as literal squares; take samples until the divide-by-n formula visibly lands short; count quartile positions the lecture's way; push a value past a fence and watch it flag                                                 |

Every session ends with a **Where this shows up in AI & ML** section — not "you will need this one day", but the places
the idea appears by name in things already on the site.

## Adding your own session

Sign in (sidebar footer) as a maintainer, then use the `+` on any semester header. You get a title, a course, a bucket
(**Concept** or **Chapter**), a write-up, a `symbol = meaning` list that becomes the page's legend and its cheat sheet,
one of four chart templates, and a file upload.

Uploads: images under 3.5 MB go to Supabase Storage, the first text or markdown file
pre-fills an empty write-up, and every filename and size is recorded as source material. **PDF and PPTX contents are not
parsed** — they are recorded as sources only.

Sessions are stored in Postgres, so they are shared, permanent and linkable — send a classmate `/my/<id>` and it works.
Pages render on the server, so they carry real titles and descriptions when shared.

## Supabase

The backend is Supabase project `fprfnbfoqjuwgckhtnxz`. Two environment variables are all the app needs — copy
`.env.example` to `.env.local` for development, and set the same pair in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Both are public by design: the publishable key carries no privileges of its own, and everything it can reach is guarded
by row-level security. **The project's secret key bypasses RLS entirely and must never appear in a `NEXT_PUBLIC_`
variable or in this repo.**

### Security is in the database, not the buttons

The prototype's passcode gate was cosmetic and said so. It is gone. Supabase Auth issues the session, and Postgres
enforces what that session can do. The site is maintained by a small trusted group who all edit the same content, so
**authorship is attribution and admin membership is permission**:

| Who                          | Read           | Create | Edit / delete anything            |
| ---------------------------- | -------------- | ------ | --------------------------------- |
| Signed-out visitor           | ✅ any session | ❌     | ❌                                |
| Signed-in, not a maintainer  | ✅ any session | ❌     | ❌                                |
| Maintainer (`public.admins`) | ✅ any session | ✅     | ✅ including other people's pages |

Flattening permissions this way does **not** remove the need for RLS. What it protects you from was never your
co-maintainers — it is everyone else. The publishable key ships in the browser bundle, and Supabase grants
`anon`/`authenticated` full DML on public tables by default; these policies are the only thing restricting it. Turn RLS
off and `public.sessions` is world-writable.

`author_id` is still recorded, and the insert policy still requires it to be you, so the trail of who wrote what
survives even though anyone on the team can edit it afterwards.

Hiding the `+` and delete buttons is a courtesy. The rules that matter are the policies on `public.sessions`,
`public.admins` and `storage.objects` — verified by `supabase/tests/rls.sql`, which asserts every row of that table.

### Granting the role

There is deliberately no way to promote yourself through the app: `public.admins` has no insert policy, so membership is
granted by hand with the service role. Have the person sign up first, then run this in the Supabase SQL editor:

```sql
insert into public.admins (user_id, note)
select id, 'why they were added' from auth.users where email = 'them@example.com';
```

To revoke: `delete from public.admins where user_id = (select id from auth.users where email = '…');`

Signing in without being a maintainer is a real, expected state — the sidebar says _"Read-only — not a maintainer"_
rather than silently hiding the controls and leaving you guessing.

### Storage

Paths are `session-images/<user id>/<uuid>.<ext>`. The uid prefix is no longer a permission boundary — any maintainer
can replace or delete any image, so deleting a colleague's session cleans up its picture instead of orphaning it. The
prefix survives as a tidy, collision-free naming scheme. Uploading requires being a maintainer, so an account alone
cannot be used as free file hosting.

### Schema

One table. The curriculum itself — groups, courses, syllabus text — stays in the app as static brochure data, because it
is a fixed source of truth rather than user content; duplicating it into tables would create two versions of it.

```
public.sessions
  id          uuid pk        author_id   uuid -> auth.users (cascade delete)
  title       text           chart       text (none|line|bowl|clusters|boundary)
  group_id    text           image_path  text  -> storage object path, not a data URL
  course_id   text           files       jsonb -> source filenames and sizes
  kind        text (concept|chapter)     created_at  timestamptz
  summary     text           updated_at  timestamptz (trigger)
  math        text
```

`kind` defaults to `concept`, which is what every page written so far is — so the column needed no backfill and is not
nullable.

### Migrations and tests

`supabase/migrations/` holds the migrations that built the schema, in order, so the project can be rebuilt from
scratch. `supabase/tests/rls.sql` is the policy test — it impersonates two maintainers, one signed-in non-maintainer and
the `anon` role, and asserts fifteen outcomes covering every cell of the table above plus self-promotion and admin-list
enumeration:

```bash
psql "$DATABASE_URL" -f supabase/tests/rls.sql   # every row should read PASS
```

It deliberately checks that a stranger's `UPDATE` and `DELETE` affect **zero rows** rather than raising an error. That is
how a missing `USING` clause actually fails, and an exception-only test would sail straight past it.

### If the database is unreachable

The four built sessions, the whole curriculum, the cheat sheets and the quizzes are static app data. A missing or
unreachable Supabase config degrades to "you cannot add your own sessions" — every other page still renders. That is
deliberate: an outage should not take your revision notes offline the night before an exam.

One consequence worth knowing: because the sidebar tree reads the database on the server, pages are rendered per request
rather than prerendered at build time. For a study site that is the right trade — the tree is always correct — but it is
why the build reports every route as dynamic.

## Still to do

1. **Parse PDF/PPTX server-side** — an Edge Function that reads the uploaded slides and pre-fills the write-up and
   formula list. This is the biggest genuine upgrade left.
2. **Author the quiz and exam banks** in Postgres too, instead of hard-coding them in `lib/data/knowledge.ts`.
3. **Editing an existing session** — today you can create and delete, but not revise. The `UPDATE` policy is already in
   place for it.
4. **An audit trail.** Now that any maintainer can edit anyone's page, ownership no longer stops two people clobbering
   each other. An `updated_by` column and a `session_revisions` table written by a trigger would make surprising changes
   traceable and reversible. Cheap in Postgres; worth doing before the content gets valuable.

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
