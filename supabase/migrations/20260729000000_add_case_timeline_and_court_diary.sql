-- Case Timeline & Court Diary: a proper structured event model instead of
-- unstructured text bolted onto the case record. case_events is the
-- permanent, append-only chronological history of a matter (hearings,
-- filings, orders, judgments, ...); cases.next_hearing_date/stage stay as
-- denormalized "current state" fields, kept in sync by the recordHearing
-- action, so existing card/list views don't need a join to stay fast.

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null check (event_type in (
    'hearing', 'filing', 'order', 'judgment', 'adjournment', 'evidence',
    'notice', 'compliance', 'settlement', 'appeal', 'execution',
    'internal_note', 'case_disposal'
  )),
  event_date date not null,
  title text not null,
  description text,
  stage text,
  hearing_purpose text,
  arguments_made text,
  court_direction text,
  next_hearing_date date,
  next_hearing_purpose text,
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.case_events enable row level security;

create policy "case_events_all_own" on public.case_events
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index case_events_case_id_idx on public.case_events (case_id);
create index case_events_owner_id_idx on public.case_events (owner_id);
create index case_events_event_date_idx on public.case_events (event_date);
create index case_events_search_text_trgm_idx on public.case_events using gin (search_text gin_trgm_ops);

create function public.set_case_event_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.search_text = coalesce(new.title, '') || ' ' || coalesce(new.description, '') || ' ' ||
    coalesce(new.hearing_purpose, '') || ' ' || coalesce(new.arguments_made, '') || ' ' ||
    coalesce(new.court_direction, '') || ' ' || coalesce(new.next_hearing_purpose, '') || ' ' ||
    coalesce(new.stage, '');
  return new;
end;
$$;

create trigger case_events_set_search_fields before insert or update on public.case_events
  for each row execute function public.set_case_event_search_fields();

-- Tasks noted during a hearing as "before the next hearing" — linked to the
-- event that produced them so the Court Diary can show exactly what's
-- pending against the upcoming hearing, not just a flat per-case list.
create table public.hearing_tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  event_id uuid not null references public.case_events (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  description text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.hearing_tasks enable row level security;

create policy "hearing_tasks_all_own" on public.hearing_tasks
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index hearing_tasks_case_id_idx on public.hearing_tasks (case_id);
create index hearing_tasks_event_id_idx on public.hearing_tasks (event_id);
create index hearing_tasks_owner_id_idx on public.hearing_tasks (owner_id);

-- Documents filed at a hearing — a structured name/description list, not
-- file storage (Litigo doesn't have document upload yet; this records what
-- was filed, it doesn't hold the file itself).
create table public.hearing_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  event_id uuid not null references public.case_events (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.hearing_documents enable row level security;

create policy "hearing_documents_all_own" on public.hearing_documents
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index hearing_documents_case_id_idx on public.hearing_documents (case_id);
create index hearing_documents_event_id_idx on public.hearing_documents (event_id);
create index hearing_documents_owner_id_idx on public.hearing_documents (owner_id);

-- One row per (hearing, timing, channel) — e.g. a hearing generates up to 8
-- rows (7/3/1/0 days x in_app/email). event_id ties reminders to the event
-- that scheduled them, so recording a new hearing (which may reschedule the
-- next date) can cleanly cancel every pending reminder for the case before
-- generating fresh ones — never leaves a stale reminder pointing at an old date.
-- channel is deliberately open (not just email/in_app) so push/WhatsApp slot
-- in later without a schema change.
create table public.notification_schedules (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  event_id uuid not null references public.case_events (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  hearing_date date not null,
  timing text not null check (timing in ('7_day', '3_day', '1_day', 'same_day')),
  channel text not null check (channel in ('in_app', 'email')),
  remind_at date not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'cancelled')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.notification_schedules enable row level security;

create policy "notification_schedules_all_own" on public.notification_schedules
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index notification_schedules_case_id_idx on public.notification_schedules (case_id);
create index notification_schedules_owner_id_idx on public.notification_schedules (owner_id);
-- Serves both the daily email cron (channel/status/remind_at) and the
-- in-app bell (channel/read_at), which is computed live rather than cron-fired.
create index notification_schedules_email_due_idx on public.notification_schedules (channel, status, remind_at);
create index notification_schedules_in_app_due_idx on public.notification_schedules (channel, read_at, remind_at);
