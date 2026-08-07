import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, Lock, KeyRound, CreditCard, Server } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Security — Litigo",
  description: "How Litigo protects an advocate's case data, documents, and payments.",
};

const PRACTICES = [
  {
    icon: Lock,
    title: "Row-level isolation",
    description:
      "Every table — cases, memories, arguments, research, documents — is scoped to its owner with Postgres Row-Level Security. No advocate can ever read another's data, enforced at the database itself, not just in application code.",
  },
  {
    icon: KeyRound,
    title: "Authentication",
    description:
      "Sign-in runs through Supabase Auth (email/password or Google), with sessions handled by signed, HTTP-only cookies.",
  },
  {
    icon: ShieldCheck,
    title: "Private documents",
    description:
      "Uploaded documents and profile pictures live in access-controlled storage, scoped to your own account folder. Case documents are never public — every download goes through a short-lived signed URL generated on demand.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description:
      "Billing runs through Razorpay. Litigo's servers never see or store your card details, and every billing webhook is verified with a signed HMAC check — using a timing-safe comparison — before anything is trusted.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Hosted on Vercel with Supabase as the database and storage layer, and error monitoring configured to scrub sensitive fields before anything is logged.",
  },
];

export default function SecurityPage() {
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
            Security
          </span>
          <h1 className="text-3xl font-medium text-balance">
            What you put in Litigo stays yours, and stays private.
          </h1>
          <p className="font-manrope text-muted-foreground text-[15px] leading-relaxed">
            A legal memory only works if it&apos;s trustworthy. Here&apos;s how case data,
            documents, and payments are actually protected.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PRACTICES.map((practice) => (
            <div key={practice.title} className="flex gap-4 border-t pt-6 first:border-t-0 first:pt-0">
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <practice.icon className="size-4.5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-sm font-medium">{practice.title}</h2>
                <p className="font-manrope text-muted-foreground text-[15px] leading-relaxed">
                  {practice.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
          Found a security issue? We&apos;d genuinely like to know —{" "}
          <Link href="/contact" className="text-foreground underline underline-offset-4">
            get in touch
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
