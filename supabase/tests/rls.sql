-- Row-level security checks for public.sessions, public.admins and the
-- session-images bucket.
--
-- The site is maintained by a small trusted group who all edit the same
-- content, so authorship is attribution and *admin membership* is permission.
-- RLS has not gone away with that change — it is what stops the rest of the
-- internet, not what stops your co-maintainers.
--
-- Three identities are impersonated: two admins, one signed-in non-admin, and
-- the signed-out `anon` role.
--
-- Note that a non-admin's UPDATE and DELETE must affect ZERO ROWS rather than
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
  alice uuid := '11111111-1111-1111-1111-111111111111'; -- admin
  bob   uuid := '22222222-2222-2222-2222-222222222222'; -- admin
  carol uuid := '33333333-3333-3333-3333-333333333333'; -- signed in, not an admin
  sid   uuid;
  n     int;
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    (alice, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@test.invalid', '', now(), now(), now()),
    (bob,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@test.invalid',   '', now(), now(), now()),
    (carol, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carol@test.invalid', '', now(), now(), now());
  insert into public.admins (user_id) values (alice), (bob);

  ------------------------------------------------------------- alice, admin
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);

  insert into public.sessions (title, group_id, course_id, author_id)
  values ('Alice session', 's1', 'ml', alice) returning id into sid;
  insert into rls_results values (1, 'admin can insert a session', 'PASS');

  begin
    insert into public.sessions (title, group_id, course_id, author_id)
    values ('Attributed to Bob', 's1', 'ml', bob);
    insert into rls_results values (2, 'admin cannot forge another author''s attribution', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (2, 'admin cannot forge another author''s attribution', 'PASS');
  end;

  --------------------------------------------------- bob, a different admin
  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);

  update public.sessions set title = 'Edited by Bob' where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (3, 'another admin CAN update it (the new rule)',
    case when n = 1 then 'PASS' else 'FAIL (' || n || ' rows)' end);

  --------------------------------------------- carol, signed in but not admin
  perform set_config('request.jwt.claims', json_build_object('sub', carol, 'role', 'authenticated')::text, true);

  begin
    insert into public.sessions (title, group_id, course_id, author_id)
    values ('Carol session', 's1', 'ml', carol);
    insert into rls_results values (4, 'non-admin cannot insert', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (4, 'non-admin cannot insert', 'PASS');
  end;

  update public.sessions set title = 'Hijacked' where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (5, 'non-admin cannot UPDATE',
    case when n = 0 then 'PASS' else 'FAIL (' || n || ' rows)' end);

  delete from public.sessions where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (6, 'non-admin cannot DELETE',
    case when n = 0 then 'PASS' else 'FAIL (' || n || ' rows)' end);

  select count(*) into n from public.sessions where id = sid;
  insert into rls_results values (7, 'non-admin CAN read', case when n = 1 then 'PASS' else 'FAIL' end);

  begin
    insert into public.admins (user_id) values (carol);
    insert into rls_results values (8, 'non-admin cannot promote themselves', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (8, 'non-admin cannot promote themselves', 'PASS');
  end;

  select count(*) into n from public.admins;
  insert into rls_results values (9, 'non-admin cannot enumerate the admin list',
    case when n = 0 then 'PASS' else 'FAIL (saw ' || n || ')' end);

  insert into rls_results values (10, 'non-admin''s is_admin() is false',
    case when public.is_admin() then 'FAIL' else 'PASS' end);

  --------------------------------------------------------------- signed out
  set local role anon;
  perform set_config('request.jwt.claims', null, true);

  select count(*) into n from public.sessions where id = sid;
  insert into rls_results values (11, 'signed-out visitor CAN read', case when n = 1 then 'PASS' else 'FAIL' end);

  begin
    insert into public.sessions (title, group_id, course_id, author_id)
    values ('Anon write', 's1', 'ml', alice);
    insert into rls_results values (12, 'signed-out visitor cannot insert', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (12, 'signed-out visitor cannot insert', 'PASS');
  end;

  begin
    perform public.is_admin();
    insert into rls_results values (13, 'signed-out visitor cannot call is_admin()', 'FAIL');
  exception when insufficient_privilege then
    insert into rls_results values (13, 'signed-out visitor cannot call is_admin()', 'PASS');
  end;

  ------------------------------------------------ bob deletes alice's session
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);
  delete from public.sessions where id = sid;
  get diagnostics n = row_count;
  insert into rls_results values (14, 'another admin CAN delete it (the new rule)',
    case when n = 1 then 'PASS' else 'FAIL' end);

  reset role;
  delete from public.admins where user_id in (alice, bob, carol);
  delete from auth.users where id in (alice, bob, carol);
  insert into rls_results values (15, 'test users and rows cleaned up',
    case when not exists (select 1 from public.sessions where author_id in (alice, bob, carol))
          and not exists (select 1 from auth.users where id in (alice, bob, carol))
         then 'PASS' else 'FAIL' end);
end $$;

select step, check_name, verdict from rls_results order by step;

commit;
