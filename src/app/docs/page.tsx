import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Documentation — Litigo",
  description: "A short guide to getting started with Litigo.",
};

const SECTIONS = [
  {
    title: "1. Add your first case",
    body: "Start with a matter you're actively working on. Give it a title, case number, court, and status — you can fill in the rest (stage, next hearing, parties) as you go. Nothing needs to be complete on day one.",
  },
  {
    title: "2. Capture as you go",
    body: "The moment you argue a point, find a citation, or learn something worth remembering, save it — from the case page or the quick-capture shortcut on the dashboard. An argument note records what you argued and whether it worked; a research note keeps a citation tied to the case it came from; a memory is for anything else worth not forgetting.",
  },
  {
    title: "3. Keep the Court Diary current",
    body: "Log what happened at each hearing — the stage, the court's direction, and the next date — from the case's timeline. Litigo emails you a reminder ahead of upcoming hearings, based on the preferences you set in Settings.",
  },
  {
    title: "4. Attach documents",
    body: "Upload filings, orders, and other documents straight to the case they belong to. They're private to your account and downloadable from the case page or from search.",
  },
  {
    title: "5. Find it again",
    body: "Use the search bar (or ⌘K / Ctrl+K anywhere in the dashboard) to search across every case, memory, argument note, research note, and document at once. Results show you exactly which field matched, so it's clear why something came up.",
  },
];

export default function DocsPage() {
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
            Documentation
          </span>
          <h1 className="text-3xl font-medium text-balance">Getting started with Litigo.</h1>
          <p className="font-manrope text-muted-foreground text-[15px] leading-relaxed">
            Five steps, and you&apos;re building a legal memory that compounds with every matter.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-2 border-t pt-6 first:border-t-0 first:pt-0">
              <h2 className="text-sm font-medium">{section.title}</h2>
              <p className="font-manrope text-foreground/90 text-[15px] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
          Have a question this doesn&apos;t answer?{" "}
          <Link href="/help" className="text-foreground underline underline-offset-4">
            Check the Help Centre
          </Link>{" "}
          or{" "}
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
