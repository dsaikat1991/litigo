-- Cover images for blog posts. Unlike the private `documents` bucket
-- (signed URLs, per-owner folder RLS), this one is public — the whole
-- point is that these images render directly on public /blog pages for
-- anonymous visitors, so a signed-URL round trip would be the wrong tool.
-- Writes are still admin-gated; only reads are unrestricted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "blog_images_storage_select_public" on storage.objects
  for select using (bucket_id = 'blog-images');

create policy "blog_images_storage_insert_admin" on storage.objects
  for insert with check (
    bucket_id = 'blog-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "blog_images_storage_update_admin" on storage.objects
  for update using (
    bucket_id = 'blog-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "blog_images_storage_delete_admin" on storage.objects
  for delete using (
    bucket_id = 'blog-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );
