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
    sessions/              the six built sessions and their shared parts
    shell/                 sidebar, nav tree, top bar, auth + add-session dialogs
                           (stacking layers are documented at the top of app-shell.tsx)
    tabs/                  cheat sheet / quiz / exam tabs
  lib/
    chart/frame.ts         axes, dots, halos, the accent colour
    data/                  curriculum.json + typed wrappers, the knowledge base, brochure copy
    model/                 seeded sample data and the actual maths
    custom/                user sessions: Supabase-backed store, server queries, shared types
    supabase/              browser + server clients, generated DB types, env guard
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

### The perceptron ordering gotcha

`trainEpoch` recomputes the misclassified set **after** the epoch's weight updates land. Working it out during the pass
makes the accuracy, the "still wrong" count and the red rings on the chart disagree with each other.

## The sessions built so far

The first two are the foundations everything else leans on, so they come first in the tree.

| Session | Course | What you can do to it |
|---|---|---|
| Algebra | Mathematical Foundations | Turn a rate and a constant into a rule, then bolt on a second stage (ReLU, sigmoid, square) and watch a straight line become a curve |
| Linear algebra | Mathematical Foundations | Set the four entries of a 2×2 matrix and watch the grid bend; squash the determinant to zero and see information vanish |
| Linear regression | Machine Learning | Drag slope and intercept, watch MSE against the achievable floor, snap to the closed-form fit |
| Gradient descent | Mathematical Foundations | Change η, step or run 20, push past η = 1 and watch it diverge |
| k-means clustering | Machine Learning | Change k, alternate the assign and move steps, reseed to land in a different local minimum |
| The perceptron | Deep Neural Networks | Train a pass at a time and watch the boundary rotate as the mistakes run out |

Every session ends with a **Where this shows up in AI & ML** section — not "you will need this one day", but the places
the idea appears by name in things already on the site.

## Adding your own session

Sign in (sidebar footer) as a maintainer, then use the `+` on any semester header. You get a title, a course, a write-up, a
`symbol = meaning` list that becomes the page's legend and its cheat sheet, one of four chart templates, and a file
upload.

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

| Who | Read | Create | Edit / delete anything |
|---|---|---|---|
| Signed-out visitor | ✅ any session | ❌ | ❌ |
| Signed-in, not a maintainer | ✅ any session | ❌ | ❌ |
| Maintainer (`public.admins`) | ✅ any session | ✅ | ✅ including other people's pages |

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

Signing in without being a maintainer is a real, expected state — the sidebar says *"Read-only — not a maintainer"*
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
  summary     text           created_at  timestamptz
  math        text           updated_at  timestamptz (trigger)
```

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
