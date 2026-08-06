-- Profile picture uploads. Public bucket — avatars render in the header and
-- elsewhere without a signed-URL round trip, same reasoning as the
-- blog-images bucket. Writes are scoped to the owner's own folder, the same
-- per-user-folder RLS convention the documents bucket uses (owner uid is the
-- first path segment) — not blog-images' admin-only policy, since any user
-- uploads their own avatar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "avatars_storage_select_public" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_storage_insert_own" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_storage_update_own" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_storage_delete_own" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
