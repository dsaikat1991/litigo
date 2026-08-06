import type { SubscriptionPlan } from "@/lib/types";

export function planTier(plan: SubscriptionPlan): "basic" | "pro" {
  return plan.startsWith("basic") ? "basic" : "pro";
}

export function planLabel(plan: SubscriptionPlan): string {
  return planTier(plan) === "basic" ? "Basic" : "Pro";
}
