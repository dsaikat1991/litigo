import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { PricingPlans } from "@/components/marketing/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing — Litigo",
  description: "Simple, transparent pricing for advocates building a legal memory that lasts.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Pricing
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple pricing, built for one advocate.
          </h1>
          <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
            Start free. Upgrade when your practice outgrows it — no per-seat pricing games, no
            hidden limits on the memory you build.
          </p>
        </div>

        <PricingPlans />

        <p className="text-muted-foreground text-center text-sm">
          Questions about pricing?{" "}
          <Link href="/contact" className="text-foreground underline underline-offset-4">
            Get in touch
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
