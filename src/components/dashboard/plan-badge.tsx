import Link from "next/link";
import type { Subscription } from "@/lib/types";
import { planLabel } from "@/lib/subscription-plan";

export function PlanBadge({ subscription }: { subscription: Subscription | null }) {
  const label = subscription?.status === "active" ? planLabel(subscription.plan) : "Free";

  return (
    <Link
      href="/dashboard/billing"
      className="border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
    >
      {label} plan
    </Link>
  );
}
