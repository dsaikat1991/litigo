-- Memories: standalone quick-capture notes (content + tags), independent of any case.
-- Can optionally link to one case (on_delete set null, not cascade — a memory is
-- personal knowledge that should survive even if the case it was linked to is deleted).
-- No title column by design: the UI derives a preview from the first line of content.

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid references public.cases (id) on delete set null,
  content text not null,
  tags text[] not null default '{}',
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memories enable row level security;

create policy "memories_all_own" on public.memories
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index memories_owner_id_idx on public.memories (owner_id);
create index memories_case_id_idx on public.memories (case_id);
create index memories_tags_gin_idx on public.memories using gin (tags);
create index memories_search_text_trgm_idx on public.memories using gin (search_text gin_trgm_ops);

-- Trigger-maintained (not generated) for the same reason as cases/argument_notes/research_notes:
-- array_to_string() is not IMMUTABLE, which generated columns require.
create function public.set_memory_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.search_text = new.content || ' ' || array_to_string(new.tags, ' ');
  return new;
end;
$$;

create trigger memories_set_search_fields before insert or update on public.memories
  for each row execute function public.set_memory_search_fields();
