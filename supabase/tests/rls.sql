-- Row-level security checks for public.sessions.
--
-- RLS is easy to believe and hard to know, so this asserts the behaviour rather
-- than the policy text: it impersonates two users and the signed-out `anon`
-- role and checks all nine outcomes.
--
-- Note that a stranger's UPDATE and DELETE must affect ZERO ROWS rather than
-- raise — that is how a missing USING clause actually fails, and an
-- exception-only test would sail straight past it.
--
-- Run against a database with no real data in public.sessions:
--   psql "$DATABASE_URL" -f supabase/tests/rls.sql
-- Every row of the output should read PASS. Creates and removes its own users.

begin;

create temp table rls_results (step int, check_name text, verdict text);
grant insert on rls_results to authenticated, anon;

do $$
declare
  alice uuid := '11111111-1111-1111-1111-111111111111';
  bob   uuid := '22222222-2222-2222-2222-222222222222';
  sid   uuid;
  n     int;
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    (alice, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@test.invalid', '', now(), now(), now()),
    (bob,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@test.invalid',   '', now(), now(), now());

  ---------------------------------------------------------------- as alice
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);

  insert into public.sessions (title, group_id, course_id, author_id)
  values ('Alice session', 's1', 'ml', alice) returning id into sid;
  insert into rls_results values (1, 'author can insert their own row', 'PASS');

  begin
    insert into public.sessions (title, group_id, course_id, author_id)
    values ('Forged as Bob', 's1', 'ml', bob);
    insert into rls_results values (2, 'cannot insert a row owned by someone else', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (2, 'cannot insert a row owned by someone else', 'PASS');
  end;

  ------------------------------------------------------------------ as bob
  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);

  update public.sessions set title = 'Hijacked' where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (3, 'stranger cannot UPDATE another author''s row',
    case when n = 0 then 'PASS' else 'FAIL (' || n || ' rows)' end);

  delete from public.sessions where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (4, 'stranger cannot DELETE another author''s row',
    case when n = 0 then 'PASS' else 'FAIL (' || n || ' rows)' end);

  select count(*) into n from public.sessions where id = sid;
  insert into rls_results values (5, 'signed-in stranger CAN read it', case when n = 1 then 'PASS' else 'FAIL' end);

  -------------------------------------------------------------- signed out
  set local role anon;
  perform set_config('request.jwt.claims', null, true);

  select count(*) into n from public.sessions where id = sid;
  insert into rls_results values (6, 'signed-out visitor CAN read it', case when n = 1 then 'PASS' else 'FAIL' end);

  begin
    insert into public.sessions (title, group_id, course_id, author_id)
    values ('Anon write', 's1', 'ml', alice);
    insert into rls_results values (7, 'signed-out visitor cannot insert', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (7, 'signed-out visitor cannot insert', 'PASS');
  end;

  ---------------------------------------------------------- alice cleans up
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  delete from public.sessions where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (8, 'author CAN delete their own row', case when n = 1 then 'PASS' else 'FAIL' end);

  reset role;
  delete from auth.users where id in (alice, bob);
  insert into rls_results values (9, 'test users and rows cleaned up',
    case when not exists (select 1 from public.sessions where author_id in (alice, bob))
          and not exists (select 1 from auth.users where id in (alice, bob))
         then 'PASS' else 'FAIL' end);
end $$;

select step, check_name, verdict from rls_results order by step;

commit;
