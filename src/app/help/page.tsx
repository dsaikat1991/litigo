import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Help Centre — Litigo",
  description: "Answers to common questions about using Litigo.",
};

const FAQS = [
  {
    q: "Is my case data private?",
    a: "Yes. Every case, memory, argument note, research note, and document is scoped to your account with database-level row security — no other advocate, including other Litigo users, can see it.",
  },
  {
    q: "What's the difference between Free, Basic, and Pro?",
    a: "Free covers up to 10 cases with basic search and 100 MB of storage. Basic and Pro raise those limits (up to unlimited cases and documents on Pro) and add advanced search, more storage, and — on Pro — priority support. Full details are on the pricing page.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You keep full access through the end of the period you've already paid for. Cancellation takes effect at that period's end, not immediately.",
  },
  {
    q: "Can multiple advocates or a chambers share one account?",
    a: "Not yet — Litigo is built for a single advocate today. Chambers and firm accounts, with shared memory across multiple advocates, are planned for later.",
  },
  {
    q: "How do I delete my account?",
    a: "Settings → Danger zone. This permanently deletes your account and everything in it, and can't be undone.",
  },
  {
    q: "Does Litigo work on mobile?",
    a: "Yes, in your mobile browser — there's no dedicated app yet.",
  },
  {
    q: "Which courts and jurisdictions does Litigo support?",
    a: "Litigo is built in India, for advocates practicing in Indian courts, first.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Help Centre
          </span>
          <h1 className="text-3xl font-medium text-balance">Common questions.</h1>
        </div>

        <div className="flex flex-col gap-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="flex flex-col gap-2 border-t pt-6 first:border-t-0 first:pt-0">
              <h2 className="text-sm font-medium">{faq.q}</h2>
              <p className="font-manrope text-muted-foreground text-[15px] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
          Didn&apos;t find what you needed?{" "}
          <Link href="/contact" className="text-foreground underline underline-offset-4">
            Get in touch
          </Link>
          .
        </p>

        <Link
          href="/"
          className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
