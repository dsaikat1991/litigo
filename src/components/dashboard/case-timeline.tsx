import { CASE_EVENT_TYPE_ICONS, CASE_EVENT_TYPE_LABELS } from "@/lib/case-event-meta";
import { Badge } from "@/components/ui/badge";
import { HearingTaskToggle } from "@/components/dashboard/hearing-task-toggle";
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
    <ol className="flex flex-col gap-3">
      {events.map((event) => {
        const Icon = CASE_EVENT_TYPE_ICONS[event.event_type];
        return (
          <li key={event.id} className="flex gap-3 rounded-lg border p-4">
            <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {CASE_EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                  <p className="text-sm font-medium">{event.title}</p>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {formatDate(event.event_date, locale, timeZone)}
                </span>
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
                    <HearingTaskToggle key={task.id} task={task} />
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
