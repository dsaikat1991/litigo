import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Changelog — Litigo",
  description: "What's new and changed in Litigo.",
};

interface ChangelogEntry {
  date: string;
  items: string[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: "6 August 2026",
    items: [
      "Search now has its own dedicated page — find a case, memory, argument note, research note, or document from one place, with live suggestions as you type.",
      "Billing moved to its own page, with your current plan always visible from the dashboard header.",
      "Upload a profile picture instead of pasting an image URL.",
      "Recurring subscriptions are live — Free, Basic, and Pro plans, billed monthly or yearly.",
      "Added an admin-authored blog, published at /blog.",
    ],
  },
  {
    date: "4 August 2026",
    items: [
      "Upload and attach documents to a case, and see your most recent uploads from the dashboard.",
      "Hearing-prep checklists became a general Tasks tab on every case, not just upcoming hearings.",
      "Redesigned the dashboard home page and case cards.",
      "Added a Settings page — notification preferences, account details, and account deletion.",
    ],
  },
  {
    date: "28 July 2026",
    items: [
      "Added Case Timeline & Court Diary, with email reminders ahead of upcoming hearings.",
      "Case-closing reflection prompts — capture what a matter taught you right when it's disposed.",
    ],
  },
  {
    date: "23–24 July 2026",
    items: [
      "Launched Memory quick-capture — save a fact, a strategy, or a lesson in seconds, linked to a case or kept standalone.",
      "Added the dashboard sidebar, onboarding flow, and search across cases and memories.",
    ],
  },
];

export default function ChangelogPage() {
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
            Changelog
          </span>
          <h1 className="text-3xl font-medium text-balance">What&apos;s new in Litigo.</h1>
          <p className="font-manrope text-muted-foreground text-[15px] leading-relaxed">
            A running record of what&apos;s shipped, newest first.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {ENTRIES.map((entry) => (
            <div key={entry.date} className="flex flex-col gap-3 border-t pt-6 first:border-t-0 first:pt-0">
              <h2 className="text-sm font-medium">{entry.date}</h2>
              <ul className="font-manrope text-foreground/90 flex flex-col gap-2 text-[15px] leading-relaxed">
                {entry.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="bg-muted-foreground mt-2 size-1 shrink-0 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
