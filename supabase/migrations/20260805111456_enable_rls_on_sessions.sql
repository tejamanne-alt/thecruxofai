-- Three audiences: the owner revising, classmates, and anyone curious. So
-- reading is open to everyone, including signed-out visitors, and writing is
-- restricted to the author. This replaces the prototype's cosmetic passcode
-- gate — the rules are enforced by Postgres, not by hiding buttons.
alter table public.sessions enable row level security;

-- auth.uid() is wrapped in a scalar subquery so Postgres evaluates it once for
-- the statement instead of once per row.
create policy "Sessions are readable by everyone"
  on public.sessions
  for select
  to anon, authenticated
  using (true);

create policy "Signed-in users can create their own sessions"
  on public.sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Authors can update their own sessions"
  on public.sessions
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Authors can delete their own sessions"
  on public.sessions
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);
