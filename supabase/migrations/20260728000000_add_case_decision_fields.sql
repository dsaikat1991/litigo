-- Decision metadata, split out from the bare decided_on date. Free text like
-- stage/case_type — "nature of decision" and "outcome" vocabulary varies too
-- much across courts and matter types to force onto a fixed enum this early.
-- Both are null until a case is actually decided, which in practice means
-- the case is Disposed or Archived — the UI only surfaces them at that point.

alter table public.cases
  add column decision_nature text,
  add column decision_outcome text;
