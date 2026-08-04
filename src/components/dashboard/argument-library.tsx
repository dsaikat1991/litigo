import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RecentArgumentIssue } from "@/lib/data/dashboard";

export function ArgumentLibrary({ issues }: { issues: RecentArgumentIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <div className="border-x p-4">
      <h3 className="text-sm font-medium">Argument Library</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {issues.map(({ issue }) => (
          <Link key={issue} href={`/dashboard?q=${encodeURIComponent(issue)}`}>
            <Badge variant="outline" className="font-normal transition-transform hover:scale-105 hover:bg-muted">
              {issue}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
