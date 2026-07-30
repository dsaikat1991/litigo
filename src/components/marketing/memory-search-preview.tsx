"use client";

import { useEffect, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";

interface TimelineEntry {
  date: string;
  title: string;
  court: string;
  categories: string[];
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
      },
      {
        date: "2 Jun",
        title: "Kajaria v. Asit Iron",
        court: "District Court",
        categories: ["Draft", "Research"],
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
      },
    ],
  },
];

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

export function MemorySearchPreview() {
  // Server-rendered (and reduced-motion) state is the finished, fully
  // populated card — the same "already complete" pattern used for the
  // hero's own underline treatment. Motion users get a single type-in
  // reveal on mount; there is deliberately no loop back to empty. A
  // perpetual clear-and-retype cycle means the query text and the
  // timeline results visibly disagree (or the box goes blank) for a
  // real chunk of every cycle — the exact kind of rough edge Linear's
  // own marketing demos don't have. The timeline itself is never
  // hidden or faded at any point; only the query text types in once,
  // and the dates get one highlight pulse when it finishes.
  const [query, setQuery] = useState(QUERY);
  const [dateFlash, setDateFlash] = useState(false);

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
    <div className="relative flex items-center justify-center py-6">
      <div
        aria-hidden
        className="bg-verified/15 pointer-events-none absolute h-[32rem] w-[32rem] rounded-full blur-2xl"
      />
      <div className="bg-card border-border relative w-full max-w-xl rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_56px_-16px_rgba(0,0,0,0.18)]">
        <div className="bg-muted/60 flex items-center gap-2.5 rounded-lg border px-4 py-3">
          <Search className="text-muted-foreground size-[17px] shrink-0" />
          <span className="flex-1 text-[15px]">
            {query}
            <span
              aria-hidden
              className="bg-muted-foreground animate-caret-blink ml-0.5 inline-block h-4 w-px translate-y-0.5"
            />
          </span>
          <CornerDownLeft className="text-muted-foreground size-4 shrink-0" />
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
                    groupIndex === timeline.length - 1 && entryIndex === group.entries.length - 1;
                  return (
                    <div key={entry.title} className="flex gap-2.5">
                      {/* Date is the strongest visual anchor: leftmost, largest,
                          boldest element in the row — everything else reads
                          relative to it, matching how an advocate actually
                          scans a diary. A brief highlight flash when results
                          land calls attention to it, since dates are the
                          detail litigators scan for first. */}
                      <span
                        className={
                          dateFlash
                            ? "text-foreground bg-yellow-200/80 w-12 shrink-0 rounded pt-0.5 text-right text-base font-semibold transition-colors duration-500"
                            : "text-foreground w-12 shrink-0 rounded bg-transparent pt-0.5 text-right text-base font-semibold transition-colors duration-500"
                        }
                      >
                        {entry.date}
                      </span>
                      <div className="flex w-3 shrink-0 flex-col items-center">
                        <span
                          className={
                            isFirst
                              ? "bg-verified ring-verified/20 mt-1.5 size-2 shrink-0 rounded-full ring-2"
                              : "border-muted-foreground/40 mt-1.5 size-[7px] shrink-0 rounded-full border"
                          }
                        />
                        {!isLast && <span className="bg-border mt-1 w-px flex-1" />}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 pb-4">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                          <span className="text-sm font-medium">{entry.title}</span>
                          <span className="text-muted-foreground/70 text-[11px]">{entry.court}</span>
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
