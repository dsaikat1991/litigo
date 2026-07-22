-- Litigo initial schema: advocate profiles, cases, argument notes, research notes, free-form tags.
-- Every table is isolated per advocate via Row Level Security keyed on auth.uid(),
-- so isolation is enforced at the database layer, not just in application code.

create extension if not exists pg_trgm;

-- One row per authenticated advocate, mirrors auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  bar_registration_number text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Cases: the core record an advocate maintains per matter.
-- search_text is trigger-maintained rather than a generated column because
-- array_to_string() is not IMMUTABLE, which Postgres requires for generated columns.
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  case_number text,
  court text,
  case_type text,
  parties text,
  status text not null default 'ongoing' check (status in ('ongoing', 'disposed', 'archived')),
  summary text,
  tags text[] not null default '{}',
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases enable row level security;

create policy "cases_all_own" on public.cases
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index cases_owner_id_idx on public.cases (owner_id);
create index cases_tags_gin_idx on public.cases using gin (tags);
create index cases_search_text_trgm_idx on public.cases using gin (search_text gin_trgm_ops);

create function public.set_case_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.search_text = coalesce(new.title, '') || ' ' || coalesce(new.case_number, '') || ' ' ||
    coalesce(new.court, '') || ' ' || coalesce(new.case_type, '') || ' ' ||
    coalesce(new.parties, '') || ' ' || coalesce(new.summary, '') || ' ' ||
    array_to_string(new.tags, ' ');
  return new;
end;
$$;

create trigger cases_set_search_fields before insert or update on public.cases
  for each row execute function public.set_case_search_fields();

-- Argument notes: points argued (or to be argued), tagged to an issue, scoped to a case.
create table public.argument_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  issue text,
  content text not null,
  outcome text check (outcome in ('worked', 'failed', 'untested')),
  tags text[] not null default '{}',
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.argument_notes enable row level security;

create policy "argument_notes_all_own" on public.argument_notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index argument_notes_case_id_idx on public.argument_notes (case_id);
create index argument_notes_owner_id_idx on public.argument_notes (owner_id);
create index argument_notes_tags_gin_idx on public.argument_notes using gin (tags);
create index argument_notes_search_text_trgm_idx on public.argument_notes using gin (search_text gin_trgm_ops);

create function public.set_argument_note_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.search_text = coalesce(new.issue, '') || ' ' || new.content || ' ' || array_to_string(new.tags, ' ');
  return new;
end;
$$;

create trigger argument_notes_set_search_fields before insert or update on public.argument_notes
  for each row execute function public.set_argument_note_search_fields();

-- Research notes: statutes/sections, judgments relied on, articles, scoped to a case.
create table public.research_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  source_type text check (source_type in ('statute', 'judgment', 'article', 'other')),
  citation text,
  content text not null,
  tags text[] not null default '{}',
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.research_notes enable row level security;

create policy "research_notes_all_own" on public.research_notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index research_notes_case_id_idx on public.research_notes (case_id);
create index research_notes_owner_id_idx on public.research_notes (owner_id);
create index research_notes_tags_gin_idx on public.research_notes using gin (tags);
create index research_notes_search_text_trgm_idx on public.research_notes using gin (search_text gin_trgm_ops);

create function public.set_research_note_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.search_text = coalesce(new.citation, '') || ' ' || new.content || ' ' || array_to_string(new.tags, ' ');
  return new;
end;
$$;

create trigger research_notes_set_search_fields before insert or update on public.research_notes
  for each row execute function public.set_research_note_search_fields();
