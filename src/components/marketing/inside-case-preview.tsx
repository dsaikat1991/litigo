import { Award, CalendarClock, FileInput, Gavel, Milestone, Square, SquareCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TABS = ["Timeline", "Arguments", "Research", "Memory", "Documents", "Tasks"];

interface TimelineTask {
  label: string;
  done?: boolean;
}

interface TimelineEvent {
  day: string;
  month: string;
  Icon: typeof Gavel;
  badge: string;
  title: string;
  stageLine?: string;
  description?: string;
  courtDirection?: string;
  argumentsMade?: string;
  documents?: string[];
  tasks?: TimelineTask[];
  nextHearing?: { date: string; purpose: string };
}

const EVENTS: TimelineEvent[] = [
  {
    day: "14",
    month: "Sep 2023",
    Icon: Gavel,
    badge: "Hearing",
    title: "Final arguments heard",
    stageLine: "Hearing · Framing of Issues",
    description:
      "Counsel for the plaintiff concluded final arguments on specific performance, relying on the developer's admitted receipt of full consideration.",
    argumentsMade: "Time was not of the essence; developer's conduct amounted to waiver of the deadline.",
    courtDirection: "Judgment reserved; parties to file written notes within a week.",
    documents: ["Written notes on arguments", "Case law compilation"],
    tasks: [
      { label: "File written notes on arguments", done: true },
      { label: "Collect certified copy of order" },
    ],
    nextHearing: { date: "2 Oct 2026", purpose: "Pronouncement of judgment" },
  },
  {
    day: "2",
    month: "Jun 2023",
    Icon: FileInput,
    badge: "Filing",
    title: "Written statement filed",
    stageLine: "Filing · Written Statement",
    description:
      "Defendant filed its written statement, denying liability and raising limitation as a preliminary objection.",
    argumentsMade: "Suit is barred by limitation; conveyance was never demanded within the statutory period.",
    courtDirection: "Matter listed for framing of issues; plaintiff to file rejoinder within two weeks.",
    documents: ["Written statement", "Vakalatnama"],
    tasks: [
      { label: "File rejoinder to written statement", done: true },
      { label: "Prepare issues for framing" },
    ],
    nextHearing: { date: "15 Jul 2023", purpose: "Framing of issues" },
  },
  {
    day: "11",
    month: "Mar 2023",
    Icon: Award,
    badge: "Judgment",
    title: "Interim relief granted",
    stageLine: "Judgment · Interim Relief",
    description:
      "Court granted interim relief restraining the developer from creating third-party interest in the suit property.",
    argumentsMade: "Balance of convenience favours plaintiff; irreparable harm if third-party rights are created.",
    courtDirection: "Developer restrained from alienating or encumbering the suit property till further orders.",
    documents: ["Interim order copy", "Compliance affidavit"],
    tasks: [
      { label: "Serve interim order on developer", done: true },
      { label: "File compliance affidavit" },
    ],
    nextHearing: { date: "20 Apr 2023", purpose: "Hearing on interim application" },
  },
];

function Section({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">{label}</p>
      <p className="text-xs">{value}</p>
    </div>
  );
}

// Purely decorative — a simplified, static illustration of the real
// per-case detail page (src/app/dashboard/cases/[id]/page.tsx +
// src/components/dashboard/case-timeline.tsx), stripped down for a
// marketing screenshot: no sidebar, top nav, notifications, or
// edit/delete actions — just the title, status, metadata, tabs and
// timeline. The first timeline entry carries the full set of optional
// fields the real CaseTimeline supports (arguments made, court
// direction, documents filed, tasks, next hearing) so it reads as a
// genuine hearing record rather than a stub; the later entries stay
// terse, matching how a real filing/judgment event usually has fewer
// fields filled in than a hearing does. Resync against the real
// components if they change; this file is never the source of truth.
export function InsideCasePreview() {
  return (
    <div aria-hidden="true" className="relative w-full">
      <div className="border-neutral-300 bg-neutral-200 rounded-t-2xl rounded-b-md border p-1.5 shadow-[0_50px_100px_-24px_rgba(0,0,0,0.25)] sm:p-2">
        <div className="mb-1 flex justify-center">
          <span className="bg-neutral-400 size-1 rounded-full" />
        </div>

        <div className="bg-card overflow-hidden rounded-md">
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold tracking-tight">Sharma vs. ABC Developers</h3>
                <Badge variant="verified" className="shrink-0">
                  Ongoing
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                CS (O) 1234/2023 · Calcutta High Court · Civil Suit
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Milestone className="size-3" />
                  Arguments
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <CalendarClock className="size-3" />
                  Next hearing 12 Aug 2026
                </span>
              </div>
            </div>

            <div className="bg-muted inline-flex w-fit items-center gap-0.5 rounded-lg p-[3px]">
              {TABS.map((tab, i) => (
                <span
                  key={tab}
                  className={
                    i === 0
                      ? "bg-background rounded-md px-2.5 py-1 text-xs font-medium shadow-sm"
                      : "text-muted-foreground px-2.5 py-1 text-xs font-medium"
                  }
                >
                  {tab}
                </span>
              ))}
            </div>

            <ol className="flex flex-col">
              {EVENTS.map((event, i) => {
                const isLast = i === EVENTS.length - 1;
                return (
                  <li key={event.title} className="grid grid-cols-[3.25rem_1.25rem_1fr] gap-x-3">
                    <div className="pt-2.5 text-right">
                      <p className="text-sm font-semibold">{event.day}</p>
                      <p className="text-muted-foreground text-[11px]">{event.month}</p>
                    </div>

                    <div className="relative flex justify-center">
                      <span className="border-foreground/60 bg-background mt-3.5 size-2 shrink-0 rounded-full border-2" />
                      {!isLast && (
                        <span className="bg-border absolute top-3.5 bottom-0 left-1/2 w-px -translate-x-1/2" />
                      )}
                    </div>

                    <div className={`flex min-w-0 flex-col gap-2 rounded-lg border p-3.5 ${isLast ? "" : "mb-3"}`}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <event.Icon className="text-muted-foreground size-3.5 shrink-0" />
                        <Badge variant="outline" className="font-normal">
                          {event.badge}
                        </Badge>
                        <p className="text-sm font-medium">{event.title}</p>
                      </div>

                      {event.stageLine && (
                        <p className="text-muted-foreground -mt-1 text-xs">{event.stageLine}</p>
                      )}

                      {event.description && <p className="text-xs">{event.description}</p>}

                      <Section label="Arguments made" value={event.argumentsMade} />
                      <Section label="Court direction" value={event.courtDirection} />

                      {event.documents && event.documents.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                            Documents filed
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {event.documents.map((doc) => (
                              <Badge key={doc} variant="outline" className="font-normal">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.tasks && event.tasks.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                            Tasks before next hearing
                          </p>
                          {event.tasks.map((task) =>
                            task.done ? (
                              <div key={task.label} className="flex items-center gap-2 text-xs">
                                <SquareCheck className="text-verified size-3.5 shrink-0" />
                                <span className="text-muted-foreground line-through">{task.label}</span>
                              </div>
                            ) : (
                              <div key={task.label} className="flex items-center gap-2 text-xs">
                                <Square className="text-muted-foreground size-3.5 shrink-0" />
                                {task.label}
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {event.nextHearing && (
                        <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
                          <span className="text-muted-foreground">Next hearing </span>
                          <span className="font-medium">{event.nextHearing.date}</span>
                          <span className="text-muted-foreground"> · {event.nextHearing.purpose}</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Hinge + base — the base is intentionally wider than the screen
          (a real laptop's keyboard deck extends past the lid), and this
          whole assembly is meant to be cropped by an ancestor with
          overflow-hidden and a negative margin-bottom, so only the top
          of the screen is ever actually visible on the page. */}
      <div className="bg-gradient-to-b from-neutral-300 to-neutral-400 mx-auto h-2 w-[97%] rounded-b-sm" />
      <div className="bg-gradient-to-b from-neutral-200 to-neutral-300 relative mx-auto h-3.5 w-[104%] rounded-b-2xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        <div className="bg-neutral-400/50 absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md" />
      </div>
    </div>
  );
}
