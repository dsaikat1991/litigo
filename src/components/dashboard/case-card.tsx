import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, FileText, Milestone, MessagesSquare, Sparkles } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseCardMenu } from "@/components/dashboard/case-card-menu";
import { CaseCardExtraStats } from "@/components/dashboard/case-card-extra-stats";
import { cn, caseStatusBadgeVariant, formatDate, highlightMatch } from "@/lib/utils";
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
  bare = false,
  query,
  showDocumentCount = false,
}: {
  caseItem: Case & { matchedField?: string; matchedSnippet?: string };
  locale: string;
  timeZone: string;
  bare?: boolean;
  query?: string;
  showDocumentCount?: boolean;
}) {
  const dateField =
    caseItem.status === "archived" && caseItem.decided_on
      ? { label: "Judgement / Order date", value: caseItem.decided_on }
      : caseItem.next_hearing_date
        ? { label: "Next hearing", value: caseItem.next_hearing_date }
        : null;

  const subtitle = [caseItem.case_type, caseItem.court].filter(Boolean).join(" - ");
  const href = `/dashboard/cases/${caseItem.id}`;

  return (
    <Card
      className={cn(
        "h-full rounded-none ring-0",
        // bare: no border utility at all — an explicit border-0 here would
        // win over the parent's divide-y border-top (both target the same
        // property on this element), silently cancelling the separator.
        !bare && "border-x border-y-0 border-border",
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          {caseItem.case_number ? (
            <p className="text-muted-foreground text-xs">{caseItem.case_number}</p>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 items-center gap-1">
            <Badge
              variant={caseStatusBadgeVariant(caseItem.status)}
              className={
                caseItem.status === "ongoing" ? "border-verified/30 capitalize" : "capitalize"
              }
            >
              {caseItem.status}
            </Badge>
            <CaseCardMenu caseItem={caseItem} href={href} />
          </div>
        </div>
        <CardTitle className="truncate text-base font-medium">
          <Link href={href}>{caseItem.title}</Link>
        </CardTitle>
        {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {(caseItem.stage || dateField) && (
          <div className="flex flex-wrap gap-2">
            {caseItem.stage && (
              <div className="border-border flex-1 rounded-lg border px-3 py-2">
                <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  <Milestone className="size-3" />
                  Stage
                </p>
                <p className="text-sm font-medium">{caseItem.stage}</p>
              </div>
            )}
            {dateField && (
              <div className="border-border flex-1 rounded-lg border px-3 py-2">
                <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  <CalendarDays className="size-3" />
                  {dateField.label}
                </p>
                <p className="text-sm font-medium">{formatDate(dateField.value, locale, timeZone)}</p>
              </div>
            )}
          </div>
        )}
        <p className="truncate text-sm text-muted-foreground">
          {caseItem.summary || "No summary added"}
        </p>
        <div className="border-border flex flex-wrap items-center gap-3 border-y py-2">
          <Stat icon={MessagesSquare} count={caseItem.argument_count ?? 0} label="argument" />
          <Stat icon={BookOpen} count={caseItem.research_count ?? 0} label="research note" />
          <Stat icon={Sparkles} count={caseItem.memory_count ?? 0} label="memory" plural="memories" />
          {showDocumentCount && (
            <Stat icon={FileText} count={caseItem.document_count ?? 0} label="document" />
          )}
          {/* Popover's own document count would be redundant once it's already
              shown inline above — same showDocumentCount flag hides it. */}
          {!showDocumentCount && <CaseCardExtraStats caseItem={caseItem} />}
        </div>
        {caseItem.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground text-xs">Tags:</span>
            {caseItem.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="font-normal transition-transform hover:scale-105 hover:bg-muted"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">
            Last activity {formatDate(caseItem.updated_at, locale, timeZone)}
          </span>
          <Link href={href} className="flex items-center gap-1 font-medium">
            Open case
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {caseItem.matchedField && (
          <p className="text-muted-foreground text-xs">
            Matched: <span className="font-medium">{caseItem.matchedField}</span> —{" "}
            {query ? highlightMatch(caseItem.matchedSnippet ?? "", query) : caseItem.matchedSnippet}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
