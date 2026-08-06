"use server";

import Razorpay from "razorpay";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionPlan } from "@/lib/types";

const PLAN_ENV_VARS: Record<SubscriptionPlan, string> = {
  basic_monthly: "RAZORPAY_PLAN_ID_BASIC_MONTHLY",
  basic_annual: "RAZORPAY_PLAN_ID_BASIC_ANNUAL",
  pro_monthly: "RAZORPAY_PLAN_ID_PRO_MONTHLY",
  pro_annual: "RAZORPAY_PLAN_ID_PRO_ANNUAL",
};

// total_count is required by Razorpay's API (no "until cancelled" option) —
// pick a value long enough no real customer runs out mid-relationship;
// actual cancellation always goes through cancelSubscription(), not the
// cycle count expiring. 120 monthly / 10 yearly are both ~10 years —
// derived from the plan name's suffix rather than repeated per tier, since
// Basic and Pro share the same two billing cadences.
function totalCountFor(plan: SubscriptionPlan): number {
  return plan.endsWith("_monthly") ? 120 : 10;
}

export async function createSubscriptionCheckout(
  plan: SubscriptionPlan,
): Promise<{ razorpaySubscriptionId: string; keyId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const planId = process.env[PLAN_ENV_VARS[plan]];
  if (!keyId || !keySecret || !planId) {
    // Graceful degradation, same philosophy as the notification cron's
    // missing-RESEND_API_KEY path — clear message, not a 500, since this is
    // entirely plausible before the manual Razorpay dashboard setup is done.
    return { error: "Billing isn't configured yet." };
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCountFor(plan),
    notes: { owner_id: user.id }, // fallback identity for the webhook
  });

  // subscriptions has no authenticated insert/update policy (see its
  // migration) — admin client required, the same exception deleteAccount()
  // in lib/actions/auth.ts uses. The row is strictly scoped to *this
  // verified session's* user.id, never anything client-supplied.
  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    { owner_id: user.id, plan, status: "created", razorpay_subscription_id: subscription.id },
    { onConflict: "owner_id" },
  );
  if (error) return { error: "Could not start checkout — try again." };

  revalidatePath("/dashboard/settings");
  return { razorpaySubscriptionId: subscription.id, keyId };
}

export async function cancelSubscription(): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { data: row } = await supabase
    .from("subscriptions")
    .select("razorpay_subscription_id, status")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!row || !["active", "pending", "created", "halted"].includes(row.status)) {
    return { error: "No active subscription to cancel." };
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return { error: "Billing isn't configured yet." };

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  // cancel_at_cycle_end=true — advocate keeps access through what they've
  // already paid for; status flips to 'cancelled' at period end via the
  // subscription.cancelled webhook, not immediately here.
  await razorpay.subscriptions.cancel(row.razorpay_subscription_id, true);

  const admin = createAdminClient();
  await admin.from("subscriptions").update({ cancel_at_period_end: true }).eq("owner_id", user.id);

  revalidatePath("/dashboard/settings");
  return { ok: true };
}
