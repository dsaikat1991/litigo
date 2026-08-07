import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Careers — Litigo",
  description: "Open roles at Litigo.",
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Careers
          </span>
          <h1 className="text-3xl font-medium text-balance">Careers at Litigo.</h1>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No open positions right now</p>
          <p className="font-manrope text-muted-foreground max-w-[40ch] text-sm leading-relaxed">
            Litigo is bootstrapped and still small. When that changes, roles will be posted here
            first.
          </p>
        </div>

        <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
          Still want to say hello or share what you&apos;re building?{" "}
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
