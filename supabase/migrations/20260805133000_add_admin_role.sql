-- The site is maintained by a small, trusted group who all edit the same
-- content. So authorship becomes attribution ("who wrote this") rather than
-- permission ("who may change this").
--
-- RLS does not go away with that change — it is what stops the rest of the
-- internet, not what stops your co-maintainers. The publishable key ships in
-- the browser bundle and Supabase grants anon/authenticated full DML on public
-- tables by default; these policies are the only thing restricting it.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now(),
  note text
);

comment on table public.admins is
  'Maintainers who may write any session. Membership is granted by hand in SQL — there is deliberately no way to promote yourself through the app.';

alter table public.admins enable row level security;

-- You may check your own membership; you may not enumerate the others, and
-- nobody can grant themselves the role through the API. Adding an admin is a
-- deliberate act performed with the service role, from the SQL editor.
create policy "Users can see their own admin row"
  on public.admins
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- SECURITY DEFINER so it can read public.admins past that policy. STABLE so
-- Postgres evaluates it once per statement rather than once per row.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- Callable by signed-in users so the UI can ask "should I show the edit
-- controls?". Never by anon: a signed-out visitor has no membership to check.
--
-- The security linter flags every SECURITY DEFINER function reachable over the
-- API. This one is a deliberate exception: it takes no arguments and reports
-- only on auth.uid(), so a caller can ask about themselves and nobody else.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Reading stays open to everyone. Writing moves from "the author" to "an admin".
drop policy "Signed-in users can create their own sessions" on public.sessions;
drop policy "Authors can update their own sessions" on public.sessions;
drop policy "Authors can delete their own sessions" on public.sessions;

-- author_id is still recorded and still has to be you, so the trail of who
-- wrote what survives even though anyone on the team can edit it afterwards.
create policy "Admins can create sessions"
  on public.sessions
  for insert
  to authenticated
  with check (public.is_admin() and (select auth.uid()) = author_id);

create policy "Admins can update any session"
  on public.sessions
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete any session"
  on public.sessions
  for delete
  to authenticated
  using (public.is_admin());
