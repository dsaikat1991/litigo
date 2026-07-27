import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getUpcomingHearings, getPastCaseEvents } from "@/lib/data/case-events";
import { getCurrentProfile } from "@/lib/data/profile";
import { getFirstName } from "@/lib/utils";
import { CASE_EVENT_TYPE_ICONS, CASE_EVENT_TYPE_LABELS } from "@/lib/case-event-meta";
import { Badge } from "@/components/ui/badge";
import { HearingCard } from "@/components/dashboard/hearing-card";
import { DiaryViewTabs, isDiaryView } from "@/components/dashboard/diary-view-tabs";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { formatDate } from "@/lib/utils";

export default async function CourtDiaryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view = isDiaryView(rawView) ? rawView : "today";

  const profile = await getCurrentProfile();
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  const entries = view === "past" ? [] : await getUpcomingHearings(view, timeZone);
  const pastEvents = view === "past" ? await getPastCaseEvents(timeZone) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-lg font-medium">Court Diary</h1>
        <p className="text-muted-foreground text-sm">
          {profile ? `${getFirstName(profile.fullName, profile.email)}'s ` : ""}
          hearing schedule and full record of what&apos;s already happened.
        </p>
      </div>

      <DiaryViewTabs view={view} />

      {view === "past" ? (
        pastEvents.length === 0 ? (
          <p className="text-muted-foreground py-8 text-sm">No past events recorded yet.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {pastEvents.map((event) => {
              const Icon = CASE_EVENT_TYPE_ICONS[event.event_type];
              return (
                <li key={event.id}>
                  <Link
                    href={`/dashboard/cases/${event.case_id}`}
                    className="hover:bg-accent/50 flex gap-3 rounded-lg border p-4"
                  >
                    <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="font-normal">
                            {CASE_EVENT_TYPE_LABELS[event.event_type]}
                          </Badge>
                          <p className="text-sm font-medium">{event.case?.title ?? "Untitled case"}</p>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {formatDate(event.event_date, locale, timeZone)}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 text-sm">{event.title}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )
      ) : entries.length === 0 ? (
        <EmptyStatePanel
          icon={CalendarDays}
          title="Nothing scheduled"
          description="No hearings fall in this window yet."
          action={null}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <HearingCard key={entry.case.id} entry={entry} locale={locale} timeZone={timeZone} />
          ))}
        </div>
      )}
    </div>
  );
}
