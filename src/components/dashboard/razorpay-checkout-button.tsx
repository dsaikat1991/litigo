"use client";

import { useState, useTransition } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createSubscriptionCheckout } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function RazorpayCheckoutButton({
  plan,
  label,
  fullName,
  email,
}: {
  plan: SubscriptionPlan;
  label: string;
  fullName: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createSubscriptionCheckout(plan);
      if ("error" in result) {
        setError(result.error);
        return;
      }

      const razorpay = new window.Razorpay({
        key: result.keyId,
        subscription_id: result.razorpaySubscriptionId,
        name: "Litigo",
        prefill: { name: fullName ?? undefined, email: email ?? undefined },
        // The handler firing is not trusted as proof the subscription is
        // active — only the webhook (src/app/api/webhooks/razorpay/route.ts)
        // flips status in the database. This just refreshes the page so the
        // Billing section starts reflecting whatever the webhook has (or
        // hasn't yet) recorded.
        handler: () => router.refresh(),
        modal: { ondismiss: () => router.refresh() },
      });
      razorpay.open();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <Button type="button" onClick={handleClick} disabled={!scriptLoaded || isPending}>
        {label}
      </Button>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
