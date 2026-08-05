-- Storage has to follow the same rule, for two reasons:
--   1. Deleting someone else's session must be able to clean up its image, or
--      every cross-admin delete leaves an orphaned object behind.
--   2. Without an admin check on INSERT, anyone who signs up could upload to
--      their own prefix forever — free file hosting, paid for by you — even
--      though they cannot create a session to show it in.
drop policy "Users can upload session images under their own prefix" on storage.objects;
drop policy "Users can replace their own session images" on storage.objects;
drop policy "Users can delete their own session images" on storage.objects;

-- Uploads still land under your own uid. That is not a permission boundary any
-- more, it is just a tidy, collision-free naming scheme.
create policy "Admins can upload session images under their own prefix"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'session-images'
    and public.is_admin()
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Admins can replace any session image"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'session-images' and public.is_admin())
  with check (bucket_id = 'session-images' and public.is_admin());

create policy "Admins can delete any session image"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'session-images' and public.is_admin());
