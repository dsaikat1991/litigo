-- Locale/timezone as an explicit stored user preference, not an inferred
-- runtime default. Defaulted to India for every existing and new row since
-- that's honestly what the whole user base is right now (India-first) —
-- this just makes date formatting consistent across server- and
-- client-rendered output instead of depending on whichever environment's
-- ambient Intl default happens to run the code.
alter table public.profiles
  add column locale text not null default 'en-IN',
  add column timezone text not null default 'Asia/Kolkata';
