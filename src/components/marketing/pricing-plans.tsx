"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Billing = "monthly" | "annual";

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number | null; // null = "Custom"/contact, 0 = free
  annualPrice: number | null; // total yearly charge, not a monthly-equivalent
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  comingSoon?: boolean;
}

// Real pricing — Basic/Pro monthly and annual figures match the Plan
// objects created in the Razorpay dashboard exactly (annual is one yearly
// charge at the stated amount, not 12 discounted monthly charges — see
// src/lib/actions/billing.ts). Free/Basic/Pro feature limits mirror the
// product's actual per-tier caps. Chambers is deliberately omitted for now
// — individuals only until that feature is built (see project notes).
const PLANS: Plan[] = [
  {
    name: "Free",
    description: "Try Litigo on your active matters.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "Up to 10 cases",
      "10 documents, memories & notes each",
      "20 tasks",
      "Case timeline",
      "Basic search & tags",
      "100 MB file storage",
    ],
    cta: { label: "Start for free", href: "/signup" },
  },
  {
    name: "Basic",
    description: "For a steady, growing caseload.",
    monthlyPrice: 999,
    annualPrice: 9999,
    features: [
      "Everything in Free, plus:",
      "Up to 250 cases & 500 documents",
      "Unlimited memories, notes & tasks",
      "Advanced search & tags",
      "20 GB file storage",
    ],
    cta: { label: "Start building your memory", href: "/signup" },
  },
  {
    name: "Pro",
    description: "For a full-time litigation practice.",
    monthlyPrice: 1499,
    annualPrice: 14999,
    features: [
      "Everything in Basic, plus:",
      "Unlimited cases & documents",
      "100 GB file storage",
      "Priority support",
      "Early access to new features",
    ],
    cta: { label: "Start building your memory", href: "/signup" },
    highlighted: true,
  },
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-3">
        <span
          className={
            billing === "monthly" ? "text-foreground text-sm font-medium" : "text-muted-foreground text-sm"
          }
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billing === "annual"}
          onClick={() => setBilling((b) => (b === "monthly" ? "annual" : "monthly"))}
          className="bg-muted relative h-6 w-11 shrink-0 rounded-full border border-transparent transition-colors data-[state=checked]:bg-foreground"
          data-state={billing === "annual" ? "checked" : "unchecked"}
        >
          <span
            className={`bg-background pointer-events-none block size-5 rounded-full shadow-sm transition-transform ${
              billing === "annual" ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={
            billing === "annual" ? "text-foreground text-sm font-medium" : "text-muted-foreground text-sm"
          }
        >
          Billed yearly
        </span>
        <span className="border-verified/30 text-verified rounded-full border px-2 py-0.5 text-xs font-medium">
          Save ~17%
        </span>
      </div>

      <div className="divide-border grid grid-cols-1 divide-y overflow-hidden rounded-2xl border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {PLANS.map((plan) => {
          const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`flex flex-col gap-6 p-6 sm:p-8 ${plan.highlighted ? "bg-muted/40" : ""}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                  {plan.comingSoon && (
                    <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-medium">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="font-manrope text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                  {price === null ? (
                    <span className="text-3xl font-bold tracking-tight">Custom</span>
                  ) : price === 0 ? (
                    <span className="text-3xl font-bold tracking-tight">₹0</span>
                  ) : (
                    <span className="text-3xl font-bold tracking-tight">
                      ₹{formatPrice(price)}
                      <span className="text-muted-foreground text-sm font-normal">
                        /{billing === "annual" ? "yr" : "mo"}
                      </span>
                    </span>
                  )}
                </div>
                {price !== null && price > 0 && billing === "annual" && (
                  <p className="text-muted-foreground text-xs">
                    ≈ ₹{formatPrice(Math.round(price / 12))}/mo, billed yearly
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-verified mt-0.5 size-4 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta.href}
                className={
                  plan.highlighted
                    ? "bg-foreground text-background mt-auto rounded-lg px-4 py-2 text-center text-sm font-medium"
                    : "border-border mt-auto rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                }
              >
                {plan.cta.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
