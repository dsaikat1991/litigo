-- Unifies the narrow "Tasks before next hearing" checklist (hearing_tasks,
-- added in the case-timeline migration: description + done/not-done only,
-- always tied to a specific hearing event) into one general task model for
-- the case's Tasks tab: title, due date, priority, optional assignee,
-- optional linked hearing. A hearing-prep task is just a task with a due
-- date implied by the hearing and a pre-set link to it, so this avoids two
-- disconnected task lists on the same case page.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  -- Nullable + set null (old hearing_tasks.event_id was not null + cascade):
  -- deleting a hearing event should orphan its prep tasks, not delete them.
  event_id uuid references public.case_events (id) on delete set null,
  title text not null,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  assignee text,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.tasks enable row level security;

create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index tasks_case_id_idx on public.tasks (case_id);
create index tasks_event_id_idx on public.tasks (event_id);
create index tasks_owner_id_idx on public.tasks (owner_id);

-- Carry existing hearing_tasks rows over, backfilling due_date from the
-- linked hearing's own event_date since hearing_tasks never stored one.
insert into public.tasks (id, case_id, owner_id, event_id, title, due_date, is_done, created_at, completed_at)
select ht.id, ht.case_id, ht.owner_id, ht.event_id, ht.description,
       ce.event_date, ht.is_done, ht.created_at, ht.completed_at
from public.hearing_tasks ht
join public.case_events ce on ce.id = ht.event_id;

drop table public.hearing_tasks;
