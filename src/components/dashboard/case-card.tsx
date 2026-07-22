import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Case } from "@/lib/types";

export function CaseCard({ caseItem }: { caseItem: Case }) {
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
