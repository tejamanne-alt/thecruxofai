-- A trigger function runs inside the triggering statement, so it gains nothing
-- from SECURITY DEFINER — and as a definer function in the public schema it was
-- reachable as an RPC by anon. Switch to INVOKER and revoke EXECUTE from the
-- API roles so it can only ever run as the trigger it is.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from anon, authenticated, public;
