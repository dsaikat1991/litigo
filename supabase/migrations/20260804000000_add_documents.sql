-- Real file uploads. hearing_documents (added in the case-timeline migration) is a
-- name-only ledger of what was filed at a hearing, not actual file storage — this
-- is a separate, new concept: an uploaded file, optionally linked to a case.

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "documents_all_own" on public.documents
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index documents_case_id_idx on public.documents (case_id);
create index documents_owner_id_idx on public.documents (owner_id);

-- Private bucket. Objects are stored at {owner uid}/{uuid}-{filename}; RLS below
-- checks the first path segment against auth.uid(), the standard Supabase
-- per-user-folder convention — no public URLs, downloads go through short-lived
-- signed URLs generated on demand.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  20971520,
  array['application/pdf','application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png','image/jpeg','text/plain']
)
on conflict (id) do nothing;

create policy "documents_storage_select_own" on storage.objects
  for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "documents_storage_insert_own" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "documents_storage_delete_own" on storage.objects
  for delete using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
