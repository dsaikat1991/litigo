import Link from "next/link";
import { Landmark, Milestone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HearingTaskToggle } from "@/components/dashboard/hearing-task-toggle";
import { RecordHearingDialog } from "@/components/dashboard/record-hearing-dialog";
import { caseStatusBadgeVariant, formatDate } from "@/lib/utils";
import type { HearingDiaryEntry } from "@/lib/types";

export function HearingCard({
  entry,
  locale,
  timeZone,
}: {
  entry: HearingDiaryEntry;
  locale: string;
  timeZone: string;
}) {
  const { case: caseItem, latestEvent, pendingTasks } = entry;
  const purpose = latestEvent?.next_hearing_purpose;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href={`/dashboard/cases/${caseItem.id}`} className="hover:underline">
            <CardTitle className="font-heading text-base font-medium">{caseItem.title}</CardTitle>
          </Link>
          <Badge variant={caseStatusBadgeVariant(caseItem.status)} className="capitalize shrink-0">
            {caseItem.status}
          </Badge>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
          {caseItem.court && (
            <span className="flex items-center gap-1">
              <Landmark className="size-3" />
              {caseItem.court}
            </span>
          )}
          {caseItem.stage && (
            <span className="flex items-center gap-1">
              <Milestone className="size-3" />
              {caseItem.stage}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="bg-muted/40 rounded-lg px-3 py-2">
          <p className="text-muted-foreground text-[11px]">Hearing date</p>
          <p className="text-sm font-medium">
            {caseItem.next_hearing_date ? formatDate(caseItem.next_hearing_date, locale, timeZone) : "—"}
            {purpose && <span className="text-muted-foreground font-normal"> · {purpose}</span>}
          </p>
        </div>

        {pendingTasks.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
              Pending preparation
            </p>
            {pendingTasks.map((task) => (
              <HearingTaskToggle key={task.id} task={task} />
            ))}
          </div>
        )}

        <RecordHearingDialog
          caseId={caseItem.id}
          caseTitle={caseItem.title}
          triggerLabel="Record hearing outcome"
          triggerVariant="default"
        />
      </CardContent>
    </Card>
  );
}
