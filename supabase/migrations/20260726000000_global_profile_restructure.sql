-- First step of the India-first-not-India-only data foundation: generalize
-- the profile beyond a single bar_registration_number text field, add proper
-- multi-jurisdiction professional licensing, and a normalized (not free-text)
-- practice-area taxonomy. Organisations/chambers deliberately deferred —
-- that's a teams feature, orthogonal to geography, not needed for this pass.
--
-- date_format/time_format were deliberately NOT added: Intl.DateTimeFormat
-- (locale, {dateStyle, timeStyle, timeZone}) already derives correct regional
-- formatting from locale + timezone alone. A separate stored format string
-- would duplicate that and could drift out of sync. If a user-facing "date
-- format" override is ever wanted, add it then as its own explicit
-- preference, not preemptively now.
--
-- Every new column is nullable — nothing here is required at signup beyond
-- what already exists (full_name/email/password). No gender, residential
-- address, years of experience, profile photo, or phone number, per the
-- founder's own explicit "avoid requiring" list.

alter table public.profiles
  drop column bar_registration_number,
  add column display_name text,
  add column date_of_birth date,
  add column avatar_url text,
  add column professional_title text,
  add column bio text,
  add column preferred_language text,
  add column country_code text,
  add column currency_code text,
  add column updated_at timestamptz not null default now();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Professional licences: a user can hold licences in more than one
-- jurisdiction. country_code is a plain ISO 3166-1 alpha-2 string (no
-- separate countries lookup table — not needed at this scale).
create table public.professional_licences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  country_code text not null,
  jurisdiction_name text,
  licensing_authority text,
  registration_number text,
  admission_date date,
  is_primary boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.professional_licences enable row level security;

create policy "professional_licences_all_own" on public.professional_licences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index professional_licences_user_id_idx on public.professional_licences (user_id);

-- At most one licence per user can be marked primary.
create unique index professional_licences_one_primary_per_user
  on public.professional_licences (user_id) where is_primary;

create trigger professional_licences_set_updated_at before update on public.professional_licences
  for each row execute function public.set_updated_at();

-- Practice areas: a shared, normalized reference list (not per-user free
-- text) so it can support future filtering/discovery without duplicate
-- near-identical entries. Any authenticated user can read the full list and
-- add a new entry (find-or-create from the UI), but not edit/delete existing
-- ones — no update/delete policy means RLS denies both by default.
create table public.practice_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness — "Real Estate" and "real estate" are the same
-- entry, not two near-duplicates.
create unique index practice_areas_name_lower_idx on public.practice_areas (lower(name));

alter table public.practice_areas enable row level security;

create policy "practice_areas_select_all" on public.practice_areas
  for select using (auth.uid() is not null);

create policy "practice_areas_insert_any_authenticated" on public.practice_areas
  for insert with check (auth.uid() is not null);

-- Seed with common Indian practice areas for V1 — the list is meant to grow
-- via find-or-create from the UI, not stay fixed to this set.
insert into public.practice_areas (name) values
  ('Real Estate & Property'),
  ('Civil Litigation'),
  ('Criminal Law'),
  ('Family Law & Matrimonial'),
  ('Corporate & Commercial'),
  ('Tax Law'),
  ('Labour & Employment'),
  ('Intellectual Property'),
  ('Banking & Finance'),
  ('Constitutional Law'),
  ('Consumer Protection'),
  ('Arbitration & ADR'),
  ('Succession & Probate'),
  ('Environmental Law'),
  ('Insolvency & Bankruptcy');

create table public.user_practice_areas (
  user_id uuid not null references public.profiles (id) on delete cascade,
  practice_area_id uuid not null references public.practice_areas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, practice_area_id)
);

alter table public.user_practice_areas enable row level security;

create policy "user_practice_areas_all_own" on public.user_practice_areas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index user_practice_areas_practice_area_id_idx on public.user_practice_areas (practice_area_id);
