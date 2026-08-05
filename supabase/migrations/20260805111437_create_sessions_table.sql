-- User-authored session pages. The curriculum itself (groups, courses,
-- syllabus text) stays in the app as static brochure data — it is a fixed
-- source of truth, not user content, so course_id/group_id are plain text
-- validated by the app's own select menus rather than duplicated into tables.
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  group_id text not null,
  course_id text not null,
  summary text not null default '',
  -- One `symbol = meaning` per line; parsed into the page legend and cheat sheet.
  math text not null default '',
  chart text not null default 'none'
    check (chart in ('none', 'line', 'bowl', 'clusters', 'boundary')),
  -- Storage object path, not a data URL. Images live in the session-images bucket.
  image_path text,
  -- Uploaded filenames and sizes, recorded as the source material list.
  files jsonb not null default '[]'::jsonb,
  author_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The sidebar tree groups sessions by course on every page load.
create index sessions_course_id_idx on public.sessions (course_id);
create index sessions_created_at_idx on public.sessions (created_at desc);
create index sessions_author_id_idx on public.sessions (author_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sessions_set_updated_at
  before update on public.sessions
  for each row
  execute function public.set_updated_at();

comment on table public.sessions is
  'Session pages written by signed-in users. Publicly readable so classmates and the curious can read them; only the author can change their own.';
