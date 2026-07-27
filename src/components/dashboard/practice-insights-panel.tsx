import { CheckCircle2, Gavel, Tag, Users } from "lucide-react";
import type { PracticeInsights } from "@/lib/data/dashboard";

function InsightTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Tag;
  label: string;
  value: string | null;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-3">
      <Icon className="text-muted-foreground size-4" />
      <p className="text-muted-foreground text-[11px]">{label}</p>
      <p className="text-sm font-medium">{value ?? "Coming soon"}</p>
      <p className="text-muted-foreground text-[11px]">{hint}</p>
    </div>
  );
}

export function PracticeInsightsPanel({ insights }: { insights: PracticeInsights }) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-heading text-sm font-medium">Practice insights</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InsightTile
          icon={Users}
          label="Most frequent opponent"
          value={null}
          hint="Needs structured party data"
        />
        <InsightTile
          icon={Gavel}
          label="Most appearances before"
          value={null}
          hint="Needs structured party data"
        />
        <InsightTile
          icon={Tag}
          label="Most used tag"
          value={insights.mostUsedTag?.tag ?? "—"}
          hint={
            insights.mostUsedTag
              ? `Used in ${insights.mostUsedTag.count} ${insights.mostUsedTag.count === 1 ? "entry" : "entries"}`
              : "No tags yet"
          }
        />
        <InsightTile
          icon={CheckCircle2}
          label="Arguments marked Worked"
          value={String(insights.argumentsWorkedCount)}
          hint={`${insights.argumentsWorkedCount} ${insights.argumentsWorkedCount === 1 ? "argument" : "arguments"} total`}
        />
      </div>
    </div>
  );
}
