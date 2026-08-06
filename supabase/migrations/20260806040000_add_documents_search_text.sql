-- Brings documents in line with every other searchable table (cases,
-- argument_notes, research_notes, memories, case_events) — a
-- trigger-maintained search_text + trigram index, so the new global search
-- page's documents query is structurally identical to its other four
-- queries instead of a one-off ilike(file_name) special case. Only
-- file_name feeds it today since that's all documents has; a future
-- content-extraction feature can extend the trigger without touching
-- anything downstream.
alter table public.documents add column search_text text not null default '';

create index documents_search_text_trgm_idx on public.documents using gin (search_text gin_trgm_ops);

create function public.set_document_search_fields()
returns trigger
language plpgsql
as $$
begin
  new.search_text = new.file_name;
  return new;
end;
$$;

create trigger documents_set_search_fields before insert or update on public.documents
  for each row execute function public.set_document_search_fields();

-- Backfill existing rows — the trigger only fires on future inserts/updates.
update public.documents set search_text = file_name;
