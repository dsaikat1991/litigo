import { CASE_EVENT_TYPE_ICONS, CASE_EVENT_TYPE_LABELS } from "@/lib/case-event-meta";
import { Badge } from "@/components/ui/badge";
import { TaskToggle } from "@/components/dashboard/task-toggle";
import { formatDate } from "@/lib/utils";
import type { CaseEvent } from "@/lib/types";

function Section({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{label}</p>
      <p className="text-sm whitespace-pre-wrap">{value}</p>
    </div>
  );
}

// Day and month/year are split into two lines (rather than reusing the
// single-string formatDate) so the left rail reads like a compact date
// stamp instead of a long label fighting the card next to it for width.
function EventDate({ iso, locale, timeZone }: { iso: string; locale: string; timeZone: string }) {
  const date = new Date(iso);
  return (
    <div className="text-right">
      <p className="text-sm font-semibold">{date.toLocaleDateString(locale, { day: "numeric", timeZone })}</p>
      <p className="text-muted-foreground text-xs">
        {date.toLocaleDateString(locale, { month: "short", year: "numeric", timeZone })}
      </p>
    </div>
  );
}

export function CaseTimeline({
  events,
  locale,
  timeZone,
}: {
  events: CaseEvent[];
  locale: string;
  timeZone: string;
}) {
  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm">No hearings or events recorded yet.</p>;
  }

  return (
    <ol className="flex flex-col">
      {events.map((event, i) => {
        const Icon = CASE_EVENT_TYPE_ICONS[event.event_type];
        const isLast = i === events.length - 1;
        return (
          <li key={event.id} className="grid grid-cols-[5rem_1.5rem_1fr] gap-x-3">
            <div className="pt-3">
              <EventDate iso={event.event_date} locale={locale} timeZone={timeZone} />
            </div>

            {/* Rail: a dot marking this event, on a continuous vertical line
                shared by every event except the last, whose line has
                nothing left to connect to. */}
            <div className="relative flex justify-center">
              <span className="border-foreground/60 bg-background mt-4 size-2.5 shrink-0 rounded-full border-2" />
              {!isLast && <span className="bg-border absolute top-4 bottom-0 left-1/2 w-px -translate-x-1/2" />}
            </div>

            <div className={`flex min-w-0 flex-col gap-2 rounded-lg border p-4 ${isLast ? "" : "mb-4"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="text-muted-foreground size-4 shrink-0" />
                <Badge variant="outline" className="font-normal">
                  {CASE_EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                <p className="text-sm font-medium">{event.title}</p>
              </div>

              {(event.stage || event.hearing_purpose) && (
                <p className="text-muted-foreground text-xs">
                  {[event.stage, event.hearing_purpose].filter(Boolean).join(" · ")}
                </p>
              )}

              {event.description && <p className="text-sm whitespace-pre-wrap">{event.description}</p>}

              <Section label="Arguments made" value={event.arguments_made} />
              <Section label="Court direction" value={event.court_direction} />

              {event.documents && event.documents.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    Documents filed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {event.documents.map((doc) => (
                      <Badge key={doc.id} variant="outline" className="font-normal">
                        {doc.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {event.tasks && event.tasks.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    Tasks before next hearing
                  </p>
                  {event.tasks.map((task) => (
                    <TaskToggle key={task.id} task={task} />
                  ))}
                </div>
              )}

              {event.next_hearing_date && (
                <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Next hearing </span>
                  <span className="font-medium">{formatDate(event.next_hearing_date, locale, timeZone)}</span>
                  {event.next_hearing_purpose && (
                    <span className="text-muted-foreground"> · {event.next_hearing_purpose}</span>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
