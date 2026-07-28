import { getRecentActivity } from "@/lib/data/dashboard";
import { RecentActivityPanel } from "@/components/dashboard/recent-activity-panel";

export async function RecentActivityPanelAsync({
  cases,
  locale,
  timeZone,
}: {
  cases: { id: string; title: string }[];
  locale: string;
  timeZone: string;
}) {
  const recentActivity = await getRecentActivity(2);
  return <RecentActivityPanel items={recentActivity} cases={cases} locale={locale} timeZone={timeZone} />;
}
