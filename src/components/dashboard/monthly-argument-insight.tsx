import type { MonthlyArgumentInsight } from "@/lib/data/dashboard";

export function MonthlyArgumentInsightCard({ insight }: { insight: MonthlyArgumentInsight | null }) {
  if (!insight) return null;

  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="text-sm font-medium">Practice Insights</h2>
      <div className="rounded-xl border p-4">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">This month</p>
        <p className="mt-2 text-sm">
          You argued <span className="font-medium">{insight.issue}</span> in {insight.matterCount} different
          matters.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Consider creating a reusable note.</p>
      </div>
    </section>
  );
}
