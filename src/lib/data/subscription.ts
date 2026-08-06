import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types";

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, cancel_at_period_end, current_period_end, razorpay_subscription_id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!data) return null;

  return {
    plan: data.plan,
    status: data.status,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    currentPeriodEnd: data.current_period_end,
    razorpaySubscriptionId: data.razorpay_subscription_id,
  };
}
