import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Folder,
  Gavel,
  Home,
  Landmark,
  MessagesSquare,
  Milestone,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UploadCloud,
  UserRound,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    title: "Sharma vs. ABC Developers",
    meta: "Civil Suit • Case No. 214/2023",
    court: "Calcutta High Court",
    stage: "Arguments",
    date: "12 Aug 2026",
    args: 4,
    research: 2,
    memories: 0,
    tags: ["specific performance"],
    lastActivity: "27 Jul 2026",
  },
  {
    title: "Verma vs. State Bank",
    meta: "Execution Petition • Case No. 88/2022",
    court: "District Court, Alipore",
    stage: "Execution",
    date: "5 Aug 2026",
    args: 2,
    research: 0,
    memories: 1,
    tags: ["Order 21"],
    lastActivity: "24 Jul 2026",
  },
];

const ATTENTION_ITEMS = [
  "Hearing tomorrow — Sharma vs. ABC Developers",
  "Draft due — Verma vs. State Bank",
  "Reflection pending — Mehta vs. Konkan Realty",
];

const RECENT_MEMORY = [
  {
    type: "Lesson" as const,
    caseTitle: "Mehta vs. Konkan Realty",
    text: "Judge favours a certified valuer's report over a plaint-side estimate.",
    date: "26 Jul 2026",
  },
  {
    type: "Argument" as const,
    caseTitle: "Sharma vs. ABC Developers",
    text: "Time was not of the essence — conduct of parties after the deadline.",
    date: "24 Jul 2026",
  },
];

const INSIGHTS = [
  { icon: Users, label: "Most frequent opponent", value: null, hint: "Needs structured party data" },
  { icon: Gavel, label: "Most appearances before", value: null, hint: "Needs structured party data" },
  { icon: Tag, label: "Most used tag", value: "specific performance", hint: "Used in 3 entries" },
  { icon: CheckCircle2, label: "Arguments marked Worked", value: "4", hint: "4 arguments total" },
];

// Purely decorative — a static, non-interactive illustration of the product,
// not a live screenshot or functional replica. Deliberately built from the
// same primitives (Card/Badge from src/components/ui, imported directly so
// they can't drift) plus hand-mirrored markup/classes from the real
// dashboard's own source — src/app/dashboard/layout.tsx (header/sidebar
// shell), sidebar.tsx, case-card.tsx, attention-panel.tsx,
// recent-activity-panel.tsx, and practice-insights-panel.tsx — rather than
// an approximated redraw. If those components change, resync this against
// them again; the live app is the source of truth, not this file or any
// screenshot. The whole panel is aria-hidden; screen-reader users get the
// same information from the hero heading/paragraph above it.
export function DashboardPreview() {
  return (
    <div aria-hidden="true" className="relative w-full px-2 sm:px-0">
      <div className="bg-muted/70 pointer-events-none absolute inset-x-6 top-6 h-[85%] rounded-[2rem] blur-3xl sm:inset-x-16" />
      <div className="bg-verified/10 pointer-events-none absolute top-0 right-[8%] h-64 w-64 rounded-full blur-3xl" />
      {/* Bottom-corner glow, positioned via left (not a negative inset) so
          it extends inward and can't push the wrapper wider than its own
          bounds — sits in the extra padding the fade needs anyway, so the
          empty space it leaves behind reads as deliberate, not dead. */}
      <div className="bg-verified/8 pointer-events-none absolute bottom-0 left-[3%] h-56 w-56 rounded-full blur-3xl" />

      {/* The dissolve is confined to the last ~18% of the card's height —
          a percentage-based mask, so it scales with whatever the content's
          actual height turns out to be instead of a fixed pixel distance
          from the bottom. Kept deliberately late (not starting until 82%)
          so the entire first viewport — everything visible before a user
          scrolls — stays fully opaque and crisp; only the trailing panels
          dissolve, not the header/sidebar/Continue-working area anyone
          actually looks at first.

          Vertical-only, deliberately: an earlier version also faded the
          left/right edges (to mask a ~10% scale-up bleeding past the
          viewport), but that horizontal gradient doesn't vary by row, so
          it faded the sidebar/header edges too, not just the trailing
          content — reverted the scale along with it rather than leave a
          hard crop at the sides with no fade to soften it. */}
      {/* A soft green halo tracing just outside the card's own rounded
          corners — sits behind it (earlier in paint order) at a size that
          hugs the full perimeter, not just one corner, for a premium
          "glowing from behind" feel rather than an isolated accent. */}
      <div
        aria-hidden="true"
        className="bg-verified/6 pointer-events-none absolute -inset-3 rounded-[1.75rem] blur-2xl sm:-inset-4"
      />
      <div
        className="border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_64px_-20px_rgba(0,0,0,0.18)] relative mx-auto w-full overflow-hidden rounded-2xl border"
        style={{
          maskImage: "linear-gradient(to bottom, black 82%, transparent 99%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 99%)",
        }}
      >
        {/* Browser chrome */}
        <div className="border-border bg-muted/40 flex items-center gap-1.5 border-b px-4 py-2.5">
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
        </div>

        {/* App header — mirrors src/app/dashboard/layout.tsx */}
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
          {/* Sidebar — mirrors src/components/dashboard/sidebar.tsx */}
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

          {/* Main content — mirrors src/app/dashboard/page.tsx */}
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
                  <span className="border-border bg-background text-foreground/70 inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium whitespace-nowrap">
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

              {/* Search + content tabs — mirrors search-bar.tsx / content-type-tabs.tsx */}
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

              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-muted-foreground size-4" />
                      <h2 className="text-sm font-medium">Continue working</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CASES.map((c) => (
                        <Card key={c.title}>
                          <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle className="text-base font-medium">{c.title}</CardTitle>
                              <Badge variant="verified" className="shrink-0">
                                Ongoing
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">{c.meta}</p>
                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Landmark className="size-3" />
                              {c.court}
                            </p>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-3">
                            <div className="bg-muted/40 flex flex-wrap gap-6 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                  <Milestone className="size-3" />
                                  Stage
                                </p>
                                <p className="text-sm font-medium">{c.stage}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[11px]">Next hearing</p>
                                <p className="text-sm font-medium">{c.date}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
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
                            <div className="flex flex-wrap gap-1.5">
                              {c.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <CardDescription className="text-xs">
                              Last activity {c.lastActivity}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <h2 className="text-sm font-medium">Practice insights</h2>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {INSIGHTS.map((insight) => {
                        const Icon = insight.icon;
                        return (
                          <div key={insight.label} className="flex flex-col gap-1.5 rounded-lg border p-3">
                            <Icon className="text-muted-foreground size-4" />
                            <p className="text-muted-foreground text-[11px]">{insight.label}</p>
                            <p className="text-sm font-medium">{insight.value ?? "Coming soon"}</p>
                            <p className="text-muted-foreground text-[11px]">{insight.hint}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="text-muted-foreground size-4" />
                      <h2 className="text-sm font-medium">Needs your attention</h2>
                    </div>
                    <ul className="mt-2 flex flex-col">
                      {ATTENTION_ITEMS.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 rounded-lg px-1 py-2 text-sm">
                          <span className="text-foreground/85 flex-1">{item}</span>
                          <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-medium">Recent memory</h2>
                      <span className="text-muted-foreground text-xs">View all</span>
                    </div>
                    <ul className="mt-1 flex flex-col divide-y">
                      {RECENT_MEMORY.map((item) => (
                        <li key={item.text} className="flex items-start gap-3 py-2.5">
                          <Badge
                            variant={item.type === "Lesson" ? "verified" : "outline"}
                            className="mt-0.5 shrink-0 font-normal"
                          >
                            {item.type}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm">{item.text}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">{item.caseTitle}</p>
                            <p className="text-muted-foreground text-xs">{item.date}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
