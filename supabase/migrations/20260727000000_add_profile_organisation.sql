-- A simple free-text chamber/firm affiliation, deliberately NOT the full
-- organisations/organisation_members relational feature (that's a teams
-- feature, still deferred). This just captures the onboarding field the
-- founder asked for without building multi-tenant membership now.
alter table public.profiles
  add column organisation_name text;
