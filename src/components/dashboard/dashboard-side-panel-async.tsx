import { getAttentionAlerts, getRecentActivity } from "@/lib/data/dashboard";
import { AttentionPanel } from "@/components/dashboard/attention-panel";
import { RecentActivityPanel } from "@/components/dashboard/recent-activity-panel";

// AttentionPanel and RecentActivityPanel are stacked directly on top of
// each other in the right column. Streaming them as two independent
// Suspense boundaries meant each one's skeleton-to-real-content swap could
// happen at a slightly different moment and reflow the other one a second
// time — two separate visible shifts instead of one. Fetching both here and
// resolving them as a single Suspense boundary means the column reflows at
// most once, atomically, instead of twice.
export async function DashboardSidePanelAsync({
  cases,
  locale,
  timeZone,
}: {
  cases: { id: string; title: string }[];
  locale: string;
  timeZone: string;
}) {
  const [{ alerts }, recentActivity] = await Promise.all([
    getAttentionAlerts(timeZone),
    getRecentActivity(2),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AttentionPanel alerts={alerts} />
      <RecentActivityPanel items={recentActivity} cases={cases} locale={locale} timeZone={timeZone} />
    </div>
  );
}
