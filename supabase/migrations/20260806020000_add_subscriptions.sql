-- One row per advocate's subscription to a paid plan. 1:1 with profiles —
-- an advocate has at most one subscription at a time (resubscribing after
-- cancellation updates the existing row rather than adding another).
-- Razorpay, not this table, is the source of truth for payment/status —
-- this table mirrors it via webhook events
-- (src/app/api/webhooks/razorpay/route.ts) and is never written to by
-- RLS-scoped browser requests; see the policy comment below for why there
-- is no authenticated insert/update policy at all.
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('practice_monthly', 'practice_annual')),
  status text not null default 'created' check (
    status in ('created', 'pending', 'active', 'halted', 'cancelled', 'completed', 'expired')
  ),
  razorpay_subscription_id text not null,
  razorpay_customer_id text,
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index subscriptions_owner_id_key on public.subscriptions (owner_id);
create unique index subscriptions_razorpay_subscription_id_key on public.subscriptions (razorpay_subscription_id);

alter table public.subscriptions enable row level security;

-- Reuses the trigger function from 20260726000000_global_profile_restructure.sql,
-- same as blog_posts does — do not redefine it.
create trigger subscriptions_set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Read-only for the owning advocate — Settings > Billing shows their own
-- plan/status/renewal date.
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = owner_id);

-- Deliberately NO insert/update/delete policy for the authenticated role.
-- Every write (creating the pending row, recording a cancellation request,
-- applying webhook status transitions) runs in server code via
-- createAdminClient() — see src/lib/actions/billing.ts and
-- src/app/api/webhooks/razorpay/route.ts. A normal authenticated user
-- hitting the Supabase REST API directly must never be able to write
-- status='active' to their own row for free. If a genuine self-service
-- write path is ever needed, add a narrowly-scoped policy then.
