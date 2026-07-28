import {
  Bell,
  CalendarDays,
  ChevronRight,
  Folder,
  Home,
  Landmark,
  Settings,
  Sparkles,
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
    title: "Sharma vs. ABC Developers",
    meta: "Civil Suit • Case No. 214/2023",
    court: "Calcutta High Court",
    stage: "Arguments",
    date: "12 Aug",
    stats: "4 arguments · 2 research notes",
    tags: ["specific performance"],
  },
  {
    title: "Verma vs. State Bank",
    meta: "Execution Petition • Case No. 88/2022",
    court: "District Court, Alipore",
    stage: "Execution",
    date: "5 Aug",
    stats: "2 arguments · 1 memory",
    tags: ["Order 21"],
  },
];

const ATTENTION_ITEMS = [
  "Hearing tomorrow — Sharma vs. ABC Developers",
  "Draft due — Verma vs. State Bank",
  "Reflection pending — Mehta vs. Konkan Realty",
];

// Purely decorative — a static illustration of the product, not a
// functional replica. The whole panel is aria-hidden and screen-reader
// users get the same information from the hero heading/paragraph beside
// it, so nothing here needs to be independently announced.
export function DashboardPreview() {
  return (
    <div aria-hidden="true" className="relative w-full px-2 sm:px-0">
      <div className="bg-muted/70 pointer-events-none absolute inset-x-6 top-6 h-[85%] rounded-[2rem] blur-3xl sm:inset-x-16" />
      <div className="bg-verified/10 pointer-events-none absolute top-0 right-[8%] h-64 w-64 rounded-full blur-3xl" />

      <div className="border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_64px_-20px_rgba(0,0,0,0.18)] relative mx-auto w-full overflow-hidden rounded-2xl border">
        <div className="border-border bg-muted/40 flex items-center gap-1.5 border-b px-4 py-2.5">
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
          <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
        </div>

        <div className="border-border flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <Logo className="h-4 w-auto sm:h-4.5" />
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex size-6 items-center justify-center sm:size-7">
              <Bell className="text-muted-foreground size-3.5 sm:size-4" />
              <span className="bg-verified text-background absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full text-[9px] font-medium">
                2
              </span>
            </div>
            <div className="bg-verified text-background flex size-6 items-center justify-center rounded-full text-[10px] font-medium sm:size-7 sm:text-[11px]">
              SD
            </div>
          </div>
        </div>

        <div className="flex">
          <aside className="border-border hidden w-40 shrink-0 flex-col gap-1 border-r px-3 py-5 sm:flex md:w-48">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={
                    item.active
                      ? "bg-muted text-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-normal"
                      : "text-muted-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-normal"
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </div>
              );
            })}
          </aside>

          <div className="grid flex-1 grid-cols-1 gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1.55fr_1fr]">
            <div>
              <p className="text-foreground mb-3.5 text-sm font-medium">Continue working</p>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {CASES.map((caseItem) => (
                  <div key={caseItem.title} className="border-border flex flex-col gap-2.5 rounded-xl border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] leading-snug font-medium">{caseItem.title}</p>
                      <Badge variant="verified" className="h-5 shrink-0 px-1.5 text-[10px]">
                        Active
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{caseItem.meta}</p>
                    <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Landmark className="size-2.5" />
                      {caseItem.court}
                    </p>
                    <div className="bg-muted/40 flex gap-4 rounded-lg px-2.5 py-1.5">
                      <div>
                        <p className="text-muted-foreground/80 text-[9px]">Stage</p>
                        <p className="text-[11.5px] font-medium">{caseItem.stage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground/80 text-[9px]">Next hearing</p>
                        <p className="text-[11.5px] font-medium">{caseItem.date}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-[10.5px]">{caseItem.stats}</p>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-muted-foreground rounded-full border px-1.5 py-0.5 text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border hidden flex-col rounded-xl border p-3.5 sm:flex">
              <div className="mb-1 flex items-center gap-2">
                <Bell className="text-muted-foreground size-3.5" />
                <p className="text-[12.5px] font-medium">Needs your attention</p>
              </div>
              <ul className="flex flex-col">
                {ATTENTION_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-2 py-1.5">
                    <span className="text-foreground/85 flex-1 text-[11.5px] leading-snug">{item}</span>
                    <ChevronRight className="text-muted-foreground size-3 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
