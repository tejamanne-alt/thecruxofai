-- Board photos and slide screenshots. Public-read so the images render for
-- signed-out readers, and each author writes only under their own uid prefix:
--   session-images/<author uid>/<uuid>.<ext>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'session-images',
  'session-images',
  true,
  3670016, -- 3.5 MB, the same ceiling the upload form enforces
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do nothing;

create policy "Session images are readable by everyone"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'session-images');

-- storage.foldername(name) splits the object path; [1] is the first segment,
-- which must be the uploader's own uid.
create policy "Users can upload session images under their own prefix"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'session-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can replace their own session images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'session-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own session images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'session-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
