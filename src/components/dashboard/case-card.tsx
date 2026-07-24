import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Case } from "@/lib/types";

function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
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
  return (
    <Link href={`/dashboard/cases/${caseItem.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-heading text-base font-medium">{caseItem.title}</CardTitle>
            <Badge variant="secondary" className="capitalize shrink-0">
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
          <CardDescription className="text-xs">
            Updated {formatDate(caseItem.updated_at, locale, timeZone)}
            {" · "}
            {pluralize(caseItem.argument_count ?? 0, "argument")}
            {" · "}
            {pluralize(caseItem.research_count ?? 0, "research note")}
            {" · "}
            {pluralize(caseItem.memory_count ?? 0, "memory", "memories")}
          </CardDescription>
        </CardHeader>
        {(caseItem.summary || caseItem.tags.length > 0) && (
          <CardContent className="flex flex-col gap-3">
            {caseItem.summary && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{caseItem.summary}</p>
            )}
            {caseItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {caseItem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
