"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSubscription } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Subscription, SubscriptionPlan } from "@/lib/types";
import { planLabel } from "@/lib/subscription-plan";
import { RazorpayCheckoutButton } from "@/components/dashboard/razorpay-checkout-button";

type Tier = "basic" | "pro";
type Cycle = "monthly" | "annual";

// Matches the Plan objects created in the Razorpay dashboard and the
// figures on /pricing exactly — annual is the one yearly charge, not a
// monthly-equivalent.
const TIER_PRICES: Record<Tier, { monthly: number; annual: number }> = {
  basic: { monthly: 999, annual: 9999 },
  pro: { monthly: 1499, annual: 14999 },
};

const STATUS_LABELS: Record<string, string> = {
  halted: "halted",
  cancelled: "cancelled",
  completed: "completed",
  expired: "expired",
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

function UpgradeToggle({ fullName, email }: { fullName: string | null; email: string | null }) {
  const [tier, setTier] = useState<Tier>("basic");
  const [cycle, setCycle] = useState<Cycle>("annual");
  const plan: SubscriptionPlan = `${tier}_${cycle}`;
  const price = TIER_PRICES[tier][cycle];

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted inline-flex w-fit items-center gap-0.5 rounded-lg p-[3px]">
        {(["basic", "pro"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={
              tier === t
                ? "bg-background rounded-md px-3 py-1 text-sm font-medium shadow-sm"
                : "text-muted-foreground px-3 py-1 text-sm font-medium"
            }
          >
            {t === "basic" ? "Basic" : "Pro"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span
          className={
            cycle === "monthly" ? "text-foreground text-sm font-medium" : "text-muted-foreground text-sm"
          }
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={cycle === "annual"}
          onClick={() => setCycle((c) => (c === "monthly" ? "annual" : "monthly"))}
          className="bg-muted relative h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors data-[state=checked]:bg-foreground"
          data-state={cycle === "annual" ? "checked" : "unchecked"}
        >
          <span
            className={`bg-background pointer-events-none block size-5 rounded-full shadow-sm transition-transform ${
              cycle === "annual" ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={
            cycle === "annual" ? "text-foreground text-sm font-medium" : "text-muted-foreground text-sm"
          }
        >
          Billed yearly
        </span>
      </div>

      <RazorpayCheckoutButton
        plan={plan}
        label={`Upgrade to ${planLabel(plan)} — ₹${formatPrice(price)}/${cycle === "annual" ? "yr" : "mo"}`}
        fullName={fullName}
        email={email}
      />
    </div>
  );
}

function CancelSubscriptionButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await cancelSubscription();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" onClick={handleClick} disabled={isPending}>
        Cancel subscription
      </Button>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function BillingSection({
  subscription,
  fullName,
  email,
  locale,
  timeZone,
}: {
  subscription: Subscription | null;
  fullName: string | null;
  email: string | null;
  locale: string;
  timeZone: string;
}) {
  const router = useRouter();
  const isSettlingUp = subscription?.status === "created" || subscription?.status === "pending";

  // Poll while the subscription is still settling — the webhook, not this
  // page load, is what actually flips status once Razorpay confirms
  // payment, so this just keeps re-fetching until that's landed.
  const elapsedRef = useRef(0);
  useEffect(() => {
    if (!isSettlingUp) {
      elapsedRef.current = 0;
      return;
    }
    const interval = setInterval(() => {
      elapsedRef.current += 2500;
      if (elapsedRef.current >= 30000) {
        clearInterval(interval);
        return;
      }
      router.refresh();
    }, 2500);
    return () => clearInterval(interval);
  }, [isSettlingUp, router]);

  if (!subscription) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm">You&apos;re on the Free plan.</p>
        <UpgradeToggle fullName={fullName} email={email} />
      </div>
    );
  }

  if (isSettlingUp) {
    return (
      <p className="text-muted-foreground text-sm">
        Setting up your subscription — this can take a minute.
      </p>
    );
  }

  if (subscription.status === "active") {
    if (subscription.cancelAtPeriodEnd) {
      return (
        <p className="text-sm">
          {planLabel(subscription.plan)} plan — cancels on{" "}
          {subscription.currentPeriodEnd
            ? formatDate(subscription.currentPeriodEnd, locale, timeZone)
            : "the end of the current period"}
          . You&apos;ll keep access until then.
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          {planLabel(subscription.plan)} plan — renews on{" "}
          {subscription.currentPeriodEnd
            ? formatDate(subscription.currentPeriodEnd, locale, timeZone)
            : "your next billing date"}
          .
        </p>
        <CancelSubscriptionButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">
        Your {planLabel(subscription.plan)} subscription is{" "}
        {STATUS_LABELS[subscription.status] ?? subscription.status}.
      </p>
      <UpgradeToggle fullName={fullName} email={email} />
    </div>
  );
}
