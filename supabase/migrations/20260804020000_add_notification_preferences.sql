-- Hearing reminders (4 timings x 2 channels, scheduled in
-- lib/actions/case-events.ts's scheduleHearingReminders) are currently
-- hardcoded on for every user. This gives each user control over which
-- timing/channel combinations they actually want, surfaced on the new
-- Settings > Notifications section. Plain columns on profiles, not a
-- separate table — a fixed, small preference set, same reasoning as
-- locale/timezone in 20260725000000_add_profile_locale.sql. Defaulting
-- every column to true preserves today's always-on behavior for existing
-- users until they visit Settings and turn something off.

alter table public.profiles
  add column notify_7_day_in_app boolean not null default true,
  add column notify_7_day_email boolean not null default true,
  add column notify_3_day_in_app boolean not null default true,
  add column notify_3_day_email boolean not null default true,
  add column notify_1_day_in_app boolean not null default true,
  add column notify_1_day_email boolean not null default true,
  add column notify_same_day_in_app boolean not null default true,
  add column notify_same_day_email boolean not null default true;
