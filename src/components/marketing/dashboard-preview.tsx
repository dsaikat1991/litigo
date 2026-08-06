import {
  Bell,
  BookOpen,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Folder,
  Home,
  ListChecks,
  MessagesSquare,
  Milestone,
  MoreVertical,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { label: "Home", icon: Home, active: true },
  { label: "Cases", icon: Folder, active: false },
  { label: "Court Diary", icon: CalendarDays, active: false },
  { label: "Memories", icon: Sparkles, active: false },
  { label: "Profile", icon: UserRound, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const CASES = [
  {
    caseNumber: "214/2023",
    title: "Sharma vs. ABC Developers",
    subtitle: "Civil Suit - Calcutta High Court",
    stage: "Arguments",
    nextHearing: "12 Aug 2026",
    summary: "Developer refused to execute and register the deed of conveyance.",
    args: 4,
    research: 2,
    memories: 0,
    tags: ["specific performance"],
    lastActivity: "27 Jul 2026",
  },
  {
    caseNumber: "88/2022",
    title: "Verma vs. State Bank",
    subtitle: "Execution Petition - District Court, Alipore",
    stage: "Execution",
    nextHearing: "5 Aug 2026",
    summary: "Decree-holder seeking execution against movable assets.",
    args: 2,
    research: 0,
    memories: 1,
    tags: ["Order 21"],
    lastActivity: "24 Jul 2026",
  },
];

const RECENT_MEMORIES = [
  {
    text: "Judge favours a certified valuer's report over a plaint-side estimate.",
    caseTitle: "Mehta vs. Konkan Realty",
    date: "26 Jul 2026",
  },
  {
    text: "Time was not of the essence — conduct of parties after the deadline.",
    caseTitle: "Sharma vs. ABC Developers",
    date: "24 Jul 2026",
  },
];

const ARGUMENT_ISSUES = ["specific performance", "limitation", "Order 21", "res judicata"];

const KNOWLEDGE_GAPS = [
  { message: "Mehta vs. Konkan Realty: matter disposed.", cta: "What did this case teach you?" },
];

const RECENT_DOCUMENTS = [{ name: "Rejoinder.pdf", date: "23 Jul 2026" }];

// Purely decorative — a static, non-interactive illustration of the product,
// not a live screenshot or functional replica. Built from the same
// primitives (Card/Badge from src/components/ui, imported directly so they
// can't drift) plus hand-mirrored markup/classes from the real dashboard's
// own source — src/app/dashboard/page.tsx (shell/layout),
// src/components/dashboard/{sidebar,case-card,search-bar,content-type-tabs,
// todays-focus,knowledge-gaps,argument-library,recent-documents,
// monthly-argument-insight}.tsx — rather than an approximated redraw. If
// those components change, resync this against them again; the live app is
// the source of truth, not this file or any screenshot.  The whole panel is
// aria-hidden; screen-reader users get the same information from the hero
// heading/paragraph above it.
export function DashboardPreview() {
  return (
    <div aria-hidden="true" className="relative w-full px-2 sm:px-0">
      <div className="bg-muted/70 pointer-events-none absolute inset-x-6 top-6 h-[85%] rounded-[2rem] blur-3xl sm:inset-x-16" />

      {/* Capped height + mask fade starting partway through the "Recent
          Memories" row — the full mock is much taller than this (it runs
          through Knowledge Waiting to be Captured, Recent Documents and
          Practice Insights too), so without a cap the card grows tall with
          the real fade barely touching anything. maxHeight was chosen by
          measuring the rendered mock in-browser so the cut lands inside the
          Recent Memories row, not after it. */}
      <div
        className="border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_64px_-20px_rgba(0,0,0,0.18)] relative mx-auto w-full overflow-hidden rounded-2xl border"
        style={{
          maxHeight: "1100px",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
        }}
      >
        {/* Browser chrome */}
        <div className="border-border bg-muted/40 flex items-center gap-1.5 border-b px-4 py-2.5">
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
        </div>

        {/* App header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-4 sm:px-8">
          <Logo className="h-5 w-auto" />
          <div className="flex items-center gap-1">
            <div className="relative flex size-8 items-center justify-center">
              <Bell className="text-muted-foreground size-4" />
              <span className="bg-verified text-background absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                2
              </span>
            </div>
            <div className="bg-verified text-background flex size-8 items-center justify-center rounded-full text-sm font-medium">
              SD
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="border-border hidden w-56 shrink-0 border-r px-3 py-6 sm:block">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={
                      item.active
                        ? "bg-muted text-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-normal"
                        : "text-muted-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-normal"
                    }
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1 px-4 pt-8 pb-10 sm:px-8 sm:pb-14">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-medium">Good evening, Saikat.</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Continue your work or recall something from your practice.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border-border bg-background text-foreground inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium whitespace-nowrap">
                    <UploadCloud className="size-4" />
                    Upload document
                  </span>
                  <span className="border-border bg-background inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium whitespace-nowrap">
                    Add memory
                  </span>
                  <span className="bg-primary text-primary-foreground inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap">
                    New case
                  </span>
                </div>
              </div>

              {/* Search + content tabs */}
              <div className="flex flex-col gap-3">
                <div className="border-border flex items-center gap-2.5 rounded-xl border px-4 py-3.5">
                  <Search className="text-muted-foreground size-[17px] shrink-0" />
                  <span className="text-muted-foreground min-w-0 flex-1 text-[14.5px]">
                    Search cases, arguments, research, parties or past strategies…
                  </span>
                  <span className="text-muted-foreground border-border hidden shrink-0 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:flex">
                    ⌘K
                  </span>
                  <SlidersHorizontal className="text-muted-foreground size-4 shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-medium">
                    All
                  </span>
                  {["Cases", "Memories"].map((label) => (
                    <span
                      key={label}
                      className="text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-medium"
                    >
                      {label}
                    </span>
                  ))}
                  {["Arguments", "Research", "Documents", "People"].map((label) => (
                    <span
                      key={label}
                      className="text-muted-foreground/50 rounded-lg px-3 py-1.5 text-xs font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground px-1 text-xs">
                  2 cases · 6 arguments · 2 research notes · 3 memories
                </p>
              </div>

              {/* Today's Focus */}
              <div className="rounded-xl border">
                <div className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ListChecks className="text-muted-foreground size-4" />
                    <h2 className="text-sm font-medium">Today&apos;s Focus</h2>
                    <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[11px] font-medium">
                      1
                    </span>
                  </div>
                  <ChevronDown className="text-muted-foreground size-4 shrink-0 rotate-180" />
                </div>
                <div className="border-border flex flex-col gap-0.5 border-t p-2">
                  <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm">
                    <span className="bg-muted-foreground/50 size-1.5 shrink-0 rounded-full" />
                    <span className="flex-1">Hearing tomorrow — Sharma vs. ABC Developers</span>
                    <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Continue working */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2">
                  <Folder className="text-muted-foreground size-4" />
                  <h2 className="text-sm font-medium">Continue working</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CASES.map((c) => (
                    <div key={c.title} className="border-border flex flex-col rounded-lg border">
                      <div className="flex flex-col gap-1 p-4 pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-muted-foreground text-xs">{c.caseNumber}</p>
                          <div className="flex shrink-0 items-center gap-1">
                            <Badge variant="verified" className="border-verified/30 capitalize">
                              ongoing
                            </Badge>
                            <MoreVertical className="text-muted-foreground size-4" />
                          </div>
                        </div>
                        <p className="truncate text-base font-medium">{c.title}</p>
                        <p className="text-muted-foreground text-xs">{c.subtitle}</p>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="flex flex-wrap gap-2">
                          <div className="border-border flex-1 rounded-lg border px-3 py-2">
                            <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                              <Milestone className="size-3" />
                              Stage
                            </p>
                            <p className="text-sm font-medium">{c.stage}</p>
                          </div>
                          <div className="border-border flex-1 rounded-lg border px-3 py-2">
                            <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                              <CalendarClock className="size-3" />
                              Next hearing
                            </p>
                            <p className="text-sm font-medium">{c.nextHearing}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground truncate text-sm">{c.summary}</p>
                        <div className="border-border flex flex-wrap items-center gap-3 border-y py-2">
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <MessagesSquare className="size-3.5" />
                            {c.args} {c.args === 1 ? "argument" : "arguments"}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <BookOpen className="size-3.5" />
                            {c.research} research {c.research === 1 ? "note" : "notes"}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Sparkles className="size-3.5" />
                            {c.memories} {c.memories === 1 ? "memory" : "memories"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-muted-foreground text-xs">Tags:</span>
                          {c.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground">Last activity {c.lastActivity}</span>
                          <span className="flex items-center gap-1 font-medium">Open case →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Growing row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border-x p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">Recent Memories</h3>
                    <span className="text-muted-foreground text-xs">View all</span>
                  </div>
                  <div className="mt-2 flex flex-col gap-3">
                    {RECENT_MEMORIES.map((memory) => (
                      <div key={memory.text} className="border-border flex flex-col gap-2 rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium">{memory.text}</p>
                          <span className="text-muted-foreground shrink-0 text-xs">{memory.date}</span>
                        </div>
                        <Badge variant="verified" className="w-fit font-normal">
                          {memory.caseTitle}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-x p-4">
                  <h3 className="text-sm font-medium">Argument Library</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ARGUMENT_ISSUES.map((issue) => (
                      <Badge key={issue} variant="outline" className="font-normal">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-x p-4">
                  <h3 className="text-sm font-medium">Knowledge Waiting to be Captured</h3>
                  <ul className="mt-3 flex flex-col gap-3">
                    {KNOWLEDGE_GAPS.map((item) => (
                      <li key={item.message} className="flex flex-col gap-0.5">
                        <p className="text-muted-foreground text-sm">{item.message}</p>
                        <span className="flex items-center gap-1 text-sm font-medium">{item.cta} →</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-x p-4">
                  <h3 className="text-sm font-medium">Recent Documents</h3>
                  <ul className="mt-3 flex flex-col gap-3">
                    {RECENT_DOCUMENTS.map((doc) => (
                      <li key={doc.name} className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2">
                          <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                          <div className="flex min-w-0 flex-col gap-1">
                            <p className="truncate text-sm font-medium">{doc.name}</p>
                            <span className="text-muted-foreground text-xs">{doc.date}</span>
                          </div>
                        </div>
                        <Download className="text-muted-foreground size-3.5 shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practice Insights */}
              <div className="flex flex-col gap-3.5">
                <h2 className="text-sm font-medium">Practice Insights</h2>
                <div className="rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    This month
                  </p>
                  <p className="mt-2 text-sm">
                    You argued <span className="font-medium">specific performance</span> in 3 different
                    matters.
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">Consider creating a reusable note.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
