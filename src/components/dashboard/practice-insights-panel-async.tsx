import { getPracticeInsights } from "@/lib/data/dashboard";
import { PracticeInsightsPanel } from "@/components/dashboard/practice-insights-panel";

export async function PracticeInsightsPanelAsync() {
  const insights = await getPracticeInsights();
  return <PracticeInsightsPanel insights={insights} />;
}
