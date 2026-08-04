"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Eye,
  FolderClosed,
  Lightbulb,
  MessageSquare,
  Scale,
  Search,
  User,
  X,
} from "lucide-react";

interface DetailField {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}

interface TimelineEntry {
  date: string;
  title: string;
  court: string;
  categories: string[];
  caseNo: string;
  status: "Ongoing" | "Closed";
  overview: string;
  fields: DetailField[];
}

interface TimelineYearGroup {
  year: string;
  entries: TimelineEntry[];
}

const timeline: TimelineYearGroup[] = [
  {
    year: "2023",
    entries: [
      {
        date: "14 Sep",
        title: "Sharma v. ABC Developers",
        court: "High Court",
        categories: ["Arguments", "Research", "Judgment"],
        caseNo: "CS (O) 1234/2023",
        status: "Closed",
        overview:
          "Developer refused to execute and register the deed of conveyance despite full payment and possession.",
        fields: [
          { icon: CalendarDays, label: "Judgment Date", value: "14 Sep 2023" },
          { icon: User, label: "Opposite Party", value: "ABC Developers Pvt. Ltd." },
          { icon: Scale, label: "Legal Issue", value: "Specific Performance" },
          { icon: FolderClosed, label: "Practice Area", value: "Property Law" },
        ],
      },
      {
        date: "2 Jun",
        title: "Kajaria v. Asit Iron",
        court: "District Court",
        categories: ["Draft", "Research"],
        caseNo: "EP 88/2022",
        status: "Ongoing",
        overview:
          "Decree-holder seeking execution of a money decree against the judgment-debtor's movable assets.",
        fields: [
          { icon: CalendarDays, label: "Next Hearing", value: "5 Aug 2026" },
          { icon: User, label: "Opposite Party", value: "Asit Iron & Steel Co." },
          { icon: Scale, label: "Legal Issue", value: "Execution of Decree" },
          { icon: FolderClosed, label: "Practice Area", value: "Civil Execution" },
        ],
      },
    ],
  },
  {
    year: "2021",
    entries: [
      {
        date: "3 Feb",
        title: "Saha v. Ghosh",
        court: "City Civil Court",
        categories: ["Lessons"],
        caseNo: "TS 210/2020",
        status: "Closed",
        overview: "Landlord-tenant dispute over eviction on grounds of default in rent payment.",
        fields: [
          { icon: CalendarDays, label: "Judgment Date", value: "3 Feb 2021" },
          { icon: User, label: "Opposite Party", value: "Ghosh" },
          { icon: Scale, label: "Legal Issue", value: "Eviction of Tenant" },
          { icon: FolderClosed, label: "Practice Area", value: "Rent Control" },
        ],
      },
    ],
  },
];

const allEntries = timeline.flatMap((g) => g.entries);

const TABS = [
  { key: "overview", label: "Overview", icon: Eye },
  { key: "arguments", label: "Arguments", icon: MessageSquare },
  { key: "research", label: "Research", icon: BookOpen },
  { key: "lessons", label: "Lessons", icon: Lightbulb },
  { key: "outcome", label: "Outcome", icon: CheckCircle2 },
] as const;

const QUERY = "developer refused conveyance";
const TYPE_MS = 55;
const FLASH_MS = 1400;

// "Judgment" gets the same verified/accent treatment the real app reserves
// for confirmed, anchored outcomes elsewhere (case-link badges, "Worked"
// arguments) — every other matched category stays a neutral outline pill.
function CategoryBadge({ label }: { label: string }) {
  if (label === "Judgment") {
    return (
      <span className="bg-verified/15 text-verified rounded-md px-1.5 py-0.5 text-[11.5px] font-medium">
        {label}
      </span>
    );
  }
  return (
    <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11.5px]">
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: TimelineEntry["status"] }) {
  return status === "Closed" ? (
    <span className="bg-verified/15 text-verified rounded-md px-1.5 py-0.5 text-[11px] font-medium">
      Closed
    </span>
  ) : (
    <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px] font-medium">
      Ongoing
    </span>
  );
}

export function MemorySearchPreview({ compact = false }: { compact?: boolean } = {}) {
  // Server-rendered (and reduced-motion) state is the finished, fully
  // populated card — the same "already complete" pattern used for the
  // hero's own underline treatment. Motion users get a single type-in
  // reveal on mount; there is deliberately no loop back to empty. The
  // timeline itself is never hidden or faded at any point; only the query
  // text types in once, and the dates get one highlight pulse when it
  // finishes.
  const [query, setQuery] = useState(QUERY);
  const [dateFlash, setDateFlash] = useState(false);
  const [selected, setSelected] = useState<TimelineEntry>(allEntries[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    function typeChar(i: number) {
      if (cancelled) return;
      setQuery(QUERY.slice(0, i));
      if (i < QUERY.length) {
        setTimeout(() => typeChar(i + 1), TYPE_MS);
      } else {
        setDateFlash(true);
        setTimeout(() => setDateFlash(false), FLASH_MS);
      }
    }
    // Deferred (not called directly in the effect body) so every state
    // update in this sequence — including the reset to empty — happens
    // inside a timer callback, not synchronously during the render effect.
    const start = setTimeout(() => typeChar(0), TYPE_MS);

    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  return (
    <div className={compact ? "relative flex items-center justify-center" : "relative flex items-center justify-center py-6"}>
      <div
        className={
          compact
            ? "bg-card border-border relative w-full overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_56px_-16px_rgba(0,0,0,0.18)]"
            : "bg-card border-border relative w-full max-w-4xl overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_56px_-16px_rgba(0,0,0,0.18)]"
        }
      >
        <div className={compact ? undefined : "grid grid-cols-1 lg:grid-cols-2"}>
          {/* Left: search + timeline results. In compact mode this is the
              only panel — the detail/tabs panel is dropped entirely rather
              than squeezed into a narrower column, since this mode is used
              side-by-side with unrelated content (the "Built for
              Litigators" feature list), not as a standalone two-panel demo. */}
          <div className={compact ? "flex flex-col p-5" : "border-border flex flex-col p-5 lg:border-r"}>
            <div className="bg-muted/60 flex items-center gap-2.5 rounded-lg border px-4 py-3">
              <Search className="text-muted-foreground size-[17px] shrink-0" />
              <span className="flex-1 text-[15px]">
                {query}
                <span
                  aria-hidden
                  className="bg-muted-foreground animate-caret-blink ml-0.5 inline-block h-4 w-px translate-y-0.5"
                />
              </span>
              <span className="text-muted-foreground border-border hidden shrink-0 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:flex">
                ⌘K
              </span>
              <X className="text-muted-foreground size-4 shrink-0" />
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t pt-4">
              {timeline.map((group, groupIndex) => (
                <div key={group.year} className="flex flex-col gap-1.5">
                  {/* Aligned to the rail's own left edge (date column + gap),
                      not the content column — reads as a label on the timeline
                      itself, not a heading floating above the case details. */}
                  <span className="text-muted-foreground/60 pl-[3.625rem] text-[10.5px] font-medium tracking-wider uppercase">
                    {group.year}
                  </span>
                  <div className="flex flex-col">
                    {group.entries.map((entry, entryIndex) => {
                      const isFirst = groupIndex === 0 && entryIndex === 0;
                      const isLast =
                        groupIndex === timeline.length - 1 &&
                        entryIndex === group.entries.length - 1;
                      const isSelected = selected.title === entry.title;
                      return (
                        <button
                          type="button"
                          key={entry.title}
                          onClick={() => setSelected(entry)}
                          className={
                            isSelected
                              ? "bg-muted/60 -mx-2 flex gap-2.5 rounded-lg px-2 text-left transition-colors"
                              : "hover:bg-muted/40 -mx-2 flex gap-2.5 rounded-lg px-2 text-left transition-colors"
                          }
                        >
                          {/* Date is the strongest visual anchor: leftmost,
                              largest, boldest element in the row — everything
                              else reads relative to it, matching how an
                              advocate actually scans a diary. A brief
                              highlight flash when results land calls
                              attention to it, since dates are the detail
                              litigators scan for first. */}
                          <span
                            className={
                              dateFlash && isFirst
                                ? "text-foreground bg-yellow-200/80 w-12 shrink-0 rounded pt-2.5 text-right text-base font-semibold transition-colors duration-500"
                                : "text-foreground w-12 shrink-0 rounded bg-transparent pt-2.5 text-right text-base font-semibold transition-colors duration-500"
                            }
                          >
                            {entry.date}
                          </span>
                          <div className="flex w-3 shrink-0 flex-col items-center">
                            <span
                              className={
                                isFirst
                                  ? "bg-verified ring-verified/20 mt-4 size-2 shrink-0 rounded-full ring-2"
                                  : "border-muted-foreground/40 mt-4 size-[7px] shrink-0 rounded-full border"
                              }
                            />
                            {!isLast && <span className="bg-border mt-1 w-px flex-1" />}
                          </div>
                          <div className="flex flex-1 flex-col gap-1 py-2.5">
                            <div className="flex flex-wrap items-baseline gap-1.5">
                              <span className="text-sm font-medium">{entry.title}</span>
                              <span className="text-muted-foreground/70 text-[11px]">
                                {entry.court}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-muted-foreground/70 text-[10.5px] font-medium">
                                Matched:
                              </span>
                              {entry.categories.map((category) => (
                                <CategoryBadge key={category} label={category} />
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: detail panel for whichever entry is selected on the left —
              purely decorative (tabs beyond Overview are shown, not wired),
              matching how the rest of the app ships inert UI honestly rather
              than faking functionality that doesn't exist yet. Dropped
              entirely in compact mode (see note above the left panel). */}
          {!compact && (
            <div className="flex flex-col gap-4 p-5">
              <div>
                <h3 className="text-base font-semibold tracking-tight">{selected.title}</h3>
                <p className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                  {selected.caseNo} • {selected.court}
                  <StatusBadge status={selected.status} />
                </p>
              </div>

              <div className="border-border flex flex-wrap gap-3 border-b pb-2.5 text-xs">
                {TABS.map((tab, i) => {
                  const Icon = tab.icon;
                  return (
                    <span
                      key={tab.key}
                      className={
                        i === 0
                          ? "text-verified border-verified -mb-[11px] flex items-center gap-1 border-b-2 pb-2.5 font-medium"
                          : "text-muted-foreground/60 flex items-center gap-1"
                      }
                    >
                      <Icon className="size-3.5" />
                      {tab.label}
                    </span>
                  );
                })}
              </div>

              <p className="bg-muted/40 rounded-lg p-3 text-[13px] leading-relaxed">
                {selected.overview}
              </p>

              <div className="flex flex-col gap-2.5">
                {selected.fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div
                      key={field.label}
                      className="border-border/60 flex items-center justify-between gap-3 border-b pb-2.5 text-xs last:border-b-0"
                    >
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Icon className="size-3.5 shrink-0" />
                        {field.label}
                      </span>
                      <span className="text-right font-medium">{field.value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto flex gap-2 pt-1">
                <span className="border-border flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium">
                  View details
                </span>
                <span className="bg-verified text-background flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium">
                  Open case
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
