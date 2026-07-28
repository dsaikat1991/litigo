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

// "Judgment" gets the same verified/accent treatment the real app reserves
// for confirmed, anchored outcomes elsewhere (case-link badges, "Worked"
// arguments) — every other matched category stays a neutral outline pill.
function CategoryBadge({ label }: { label: string }) {
  if (label === "Judgment") {
    return (
      <span className="bg-verified/15 text-verified rounded-md px-1.5 py-0.5 text-[10.5px] font-medium">
        {label}
      </span>
    );
  }
  return (
    <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[10.5px]">
      {label}
    </span>
  );
}

export function MemorySearchPreview() {
  return (
    <div className="relative flex items-center justify-center py-10">
      <div
        aria-hidden
        className="bg-verified/15 pointer-events-none absolute h-[26rem] w-[26rem] rounded-full blur-2xl"
      />
      <div className="bg-card border-border relative w-full max-w-sm rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-14px_rgba(0,0,0,0.16)]">
        <div className="bg-muted/60 flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <span className="flex-1 text-sm">
            developer refused conveyance
            <span
              aria-hidden
              className="bg-muted-foreground animate-caret-blink ml-0.5 inline-block h-3.5 w-px translate-y-0.5"
            />
          </span>
          <CornerDownLeft className="text-muted-foreground size-3.5 shrink-0" />
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-t pt-3.5">
          {timeline.map((group, groupIndex) => (
            <div key={group.year} className="flex flex-col gap-1.5">
              {/* Aligned to the rail's own left edge (date column + gap),
                  not the content column — reads as a label on the timeline
                  itself, not a heading floating above the case details. */}
              <span className="text-muted-foreground/60 pl-[3.375rem] text-[9.5px] font-medium tracking-wider uppercase">
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
                          scans a diary. */}
                      <span className="text-foreground w-11 shrink-0 pt-0.5 text-right text-sm font-semibold">
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
                          <span className="text-[12.5px] font-medium">{entry.title}</span>
                          <span className="text-muted-foreground/70 text-[10px]">{entry.court}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-muted-foreground/70 text-[9.5px] font-medium">
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
