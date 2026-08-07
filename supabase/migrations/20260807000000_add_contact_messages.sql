-- Contact form submissions from the public /contact page. Visitors are
-- anonymous (no auth session), so this is insert-only — nobody can read
-- their own or anyone else's submission back out through the API.
-- Messages are reviewed directly in the Supabase table editor for now;
-- no admin inbox UI exists yet.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_insert_anon" on public.contact_messages
  for insert to anon, authenticated with check (true);
