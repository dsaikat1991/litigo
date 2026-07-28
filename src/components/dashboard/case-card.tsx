import Link from "next/link";
import { BookOpen, Landmark, MessagesSquare, Milestone, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { caseStatusBadgeVariant, formatDate } from "@/lib/utils";
import type { Case } from "@/lib/types";

function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function Stat({
  icon: Icon,
  count,
  label,
  plural,
}: {
  icon: typeof BookOpen;
  count: number;
  label: string;
  plural?: string;
}) {
  return (
    <span className="text-muted-foreground flex items-center gap-1 text-xs">
      <Icon className="size-3.5" />
      {pluralize(count, label, plural)}
    </span>
  );
}

export function CaseCard({
  caseItem,
  locale,
  timeZone,
}: {
  caseItem: Case;
  locale: string;
  timeZone: string;
}) {
  const dateField =
    caseItem.status === "archived" && caseItem.decided_on
      ? { label: "Judgement / Order date", value: caseItem.decided_on }
      : caseItem.next_hearing_date
        ? { label: "Next hearing", value: caseItem.next_hearing_date }
        : null;

  return (
    <Link href={`/dashboard/cases/${caseItem.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">{caseItem.title}</CardTitle>
            <Badge variant={caseStatusBadgeVariant(caseItem.status)} className="capitalize shrink-0">
              {caseItem.status}
            </Badge>
          </div>
          {(caseItem.case_number || caseItem.case_type) && (
            <p className="text-xs text-muted-foreground">
              {[caseItem.case_type, caseItem.case_number ? `Case No. ${caseItem.case_number}` : null]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
          {caseItem.court && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Landmark className="size-3" />
              {caseItem.court}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {(caseItem.stage || dateField) && (
            <div className="flex flex-wrap gap-6 rounded-lg bg-muted/40 px-3 py-2">
              {caseItem.stage && (
                <div>
                  <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <Milestone className="size-3" />
                    Stage
                  </p>
                  <p className="text-sm font-medium">{caseItem.stage}</p>
                </div>
              )}
              {dateField && (
                <div>
                  <p className="text-muted-foreground text-[11px]">{dateField.label}</p>
                  <p className="text-sm font-medium">{formatDate(dateField.value, locale, timeZone)}</p>
                </div>
              )}
            </div>
          )}
          {caseItem.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{caseItem.summary}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Stat icon={MessagesSquare} count={caseItem.argument_count ?? 0} label="argument" />
            <Stat icon={BookOpen} count={caseItem.research_count ?? 0} label="research note" />
            <Stat icon={Sparkles} count={caseItem.memory_count ?? 0} label="memory" plural="memories" />
          </div>
          {caseItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {caseItem.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <CardDescription className="text-xs">
            Last activity {formatDate(caseItem.updated_at, locale, timeZone)}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
