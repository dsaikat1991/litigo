import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Lightbulb,
  MessagesSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseCardMenu } from "@/components/dashboard/case-card-menu";
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
}: {
  caseItem: Case & { matchedField?: string; matchedSnippet?: string };
  locale: string;
  timeZone: string;
  bare?: boolean;
  query?: string;
}) {
  const dateField =
    caseItem.status === "archived" && caseItem.decided_on
      ? { label: "Judgement / Order date", value: caseItem.decided_on }
      : caseItem.next_hearing_date
        ? { label: "Next hearing", value: caseItem.next_hearing_date }
        : null;

  // Stage is more useful than a static "ongoing" once a case is actually
  // moving through court — but once it's disposed or archived, the status
  // itself is the meaningful, final signal, so stage (if any) steps aside.
  const isClosedStatus = caseItem.status === "disposed" || caseItem.status === "archived";
  const badgeText = !isClosedStatus && caseItem.stage ? caseItem.stage : caseItem.status;
  const badgeIsStatus = badgeText === caseItem.status;

  const hasActionBar = dateField || caseItem.next_action || (caseItem.pending_task_count ?? 0) > 0;

  const subtitle = [caseItem.case_type, caseItem.court].filter(Boolean).join(" - ");
  const href = `/dashboard/cases/${caseItem.id}`;

  return (
    <Card
      className={cn(
        // min-w-0: Card and CardContent below are flex containers, which
        // default to min-width: auto — without this, a long unbroken line
        // (case summary, etc.) forces the card wider than its grid/flex
        // track instead of respecting it and truncating.
        "h-full min-w-0 rounded-none ring-0",
        // bare: no border utility at all — an explicit border-0 here would
        // win over the parent's divide-y border-top (both target the same
        // property on this element), silently cancelling the separator.
        !bare && "border border-border",
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
              className={cn(
                caseItem.status === "ongoing" && "border-verified/30",
                // Stage is free text an advocate typed themselves — shown
                // as-is. Status is one of our own fixed lowercase values,
                // which needs the capitalize transform to read naturally.
                badgeIsStatus && "capitalize",
              )}
            >
              {badgeText}
            </Badge>
            <CaseCardMenu caseItem={caseItem} href={href} />
          </div>
        </div>
        <CardTitle className="truncate text-base font-medium">
          <Link href={href}>{caseItem.title}</Link>
        </CardTitle>
        {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 flex-col gap-3">
        {hasActionBar && (
          <div className="bg-muted/40 divide-border flex flex-wrap divide-x rounded-lg">
            <div className="min-w-[110px] flex-1 px-3 py-2">
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Send className="size-3" />
                {dateField?.label ?? "Next hearing"}
              </p>
              <p className="text-sm font-medium">
                {dateField ? formatDate(dateField.value, locale, timeZone) : "—"}
              </p>
            </div>
            <div className="min-w-[110px] flex-1 px-3 py-2">
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <CalendarDays className="size-3" />
                Next Action
              </p>
              <p className="truncate text-sm font-medium">{caseItem.next_action ?? "—"}</p>
            </div>
            <div className="min-w-[90px] flex-1 px-3 py-2">
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Lightbulb className="size-3" />
                Pending Tasks
              </p>
              <p className="text-sm font-medium">
                {String(caseItem.pending_task_count ?? 0).padStart(2, "0")}
              </p>
            </div>
          </div>
        )}
        <p className="truncate text-sm text-muted-foreground">
          {caseItem.summary || "No summary added"}
        </p>
        <div className="border-border flex flex-wrap items-center gap-3 border-y py-2">
          <Stat icon={MessagesSquare} count={caseItem.argument_count ?? 0} label="argument" />
          <Stat icon={BookOpen} count={caseItem.research_count ?? 0} label="research note" />
          <Stat icon={Sparkles} count={caseItem.memory_count ?? 0} label="memory" plural="memories" />
          <Stat icon={FileText} count={caseItem.document_count ?? 0} label="document" />
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
