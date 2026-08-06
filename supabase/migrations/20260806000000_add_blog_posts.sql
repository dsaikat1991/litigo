-- Admin role: a single boolean on profiles, not a separate roles table —
-- there is exactly one privilege tier beyond "regular advocate" today
-- (authoring the public blog). Revisit only when a second distinct
-- privilege appears.
alter table public.profiles
  add column is_admin boolean not null default false;

-- content is markdown plain text, rendered to React at request time via
-- react-markdown — never stored/rendered as raw HTML, so no sanitizing
-- surface even though only admins can write rows.
-- status follows cases.status's text+check pattern rather than a plain
-- boolean, so a future 'archived' state doesn't need another migration.
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index blog_posts_slug_idx on public.blog_posts (slug);
create index blog_posts_status_published_at_idx on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

-- Reuses the trigger function already defined in
-- 20260726000000_global_profile_restructure.sql — do not redefine it.
create trigger blog_posts_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- First "anyone, including anonymous visitors, can read" policy in this
-- schema — every other table so far is owner-scoped only.
create policy "blog_posts_select_published" on public.blog_posts
  for select using (status = 'published');

-- Admins can additionally see drafts, for the admin list/edit views.
-- Postgres OR's multiple permissive SELECT policies together, so a
-- published row is visible either way and a draft is visible only via
-- this one.
create policy "blog_posts_select_admin" on public.blog_posts
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "blog_posts_insert_admin" on public.blog_posts
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "blog_posts_update_admin" on public.blog_posts
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "blog_posts_delete_admin" on public.blog_posts
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

-- Granting the first admin is manual, no self-service UI — run this
-- yourself after applying this migration (swap in your own account email):
--
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
