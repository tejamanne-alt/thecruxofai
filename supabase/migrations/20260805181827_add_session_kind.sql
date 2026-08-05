-- Every page under a course now sits in one of two buckets:
--
--   concept — one idea explained on its own terms (algebra, gradient descent).
--             Reusable; the same concept underpins several courses.
--   chapter — the course's own material in the order it was taught. Tied to
--             this course and nothing else.
--
-- The split is for revision: before an exam you want the chapters; when
-- something will not click you want the concept.
--
-- Defaulting to 'concept' is deliberate — every page written before this
-- migration is one, so existing rows land in the right bucket without a
-- backfill and without a nullable column to defend against later.
alter table public.sessions
  add column kind text not null default 'concept'
    check (kind in ('concept', 'chapter'));

-- The sidebar groups by course and then by bucket on every page load.
create index sessions_course_kind_idx on public.sessions (course_id, kind);

comment on column public.sessions.kind is
  'concept = a reusable idea; chapter = this course''s material as taught.';
