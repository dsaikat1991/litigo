import Link from "next/link";
import type { Metadata } from "next";
import { Folder, Sparkles, MessagesSquare, BookOpen, CalendarDays, FileText, Search } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Features — Litigo",
  description:
    "Everything Litigo gives a litigating advocate to capture, organise, and reuse what they learn from every matter.",
};

const FEATURES = [
  {
    icon: Folder,
    title: "Cases",
    description:
      "Track every matter's status, stage, and next hearing in one place — ongoing, disposed, or archived — with a full timeline of what happened along the way.",
  },
  {
    icon: Sparkles,
    title: "Memories",
    description:
      "Save a fact worth remembering — a stamp-duty rate, a judge's remark, a strategy that worked — in seconds, linked to a case or kept standalone.",
  },
  {
    icon: MessagesSquare,
    title: "Argument notes",
    description:
      "Record the argument you made and whether it worked, so the next matter that raises the same issue doesn't start from zero.",
  },
  {
    icon: BookOpen,
    title: "Research notes",
    description:
      "Keep citations, judgments, and research tied to the case they came from — and to every future case that needs them again.",
  },
  {
    icon: CalendarDays,
    title: "Court Diary",
    description:
      "See upcoming hearings across every case, log what happened at each one, and get email reminders before dates you can't afford to miss.",
  },
  {
    icon: FileText,
    title: "Documents",
    description:
      "Upload and attach the documents that matter to a case, and find them again instantly from search — not from a folder on your desktop.",
  },
  {
    icon: Search,
    title: "Search",
    description:
      "One search box across cases, memories, arguments, research, and documents — find the point you argued months ago in seconds.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Features
          </span>
          <h1 className="max-w-[22ch] text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Everything you need to build a legal memory that lasts.
          </h1>
          <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
            Not a case diary. Not a billing tool. A place to keep the arguments, research, and
            lessons from every matter you&apos;ve ever handled.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border p-6">
              <div className="bg-muted flex size-9 items-center justify-center rounded-lg">
                <feature.icon className="size-4.5" />
              </div>
              <h2 className="text-base font-medium">{feature.title}</h2>
              <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
          >
            Start building your memory
          </Link>
          <Link
            href="/pricing"
            className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
          >
            See pricing
          </Link>
        </div>
      </main>
    </div>
  );
}
