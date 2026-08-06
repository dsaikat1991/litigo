-- Replaces the single "Practice" tier with two real tiers (Basic, Pro),
-- each monthly/annual — the actual pricing structure decided after
-- 20260806020000_add_subscriptions.sql shipped. The table itself doesn't
-- change shape, just which plan values it accepts.
alter table public.subscriptions
  drop constraint subscriptions_plan_check;

alter table public.subscriptions
  add constraint subscriptions_plan_check check (
    plan in ('basic_monthly', 'basic_annual', 'pro_monthly', 'pro_annual')
  );
