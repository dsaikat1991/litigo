import { getAttentionAlerts } from "@/lib/data/dashboard";
import { ReflectionBanner } from "@/components/dashboard/reflection-banner";

// Same getAttentionAlerts() call as AttentionPanelAsync — deduped via
// cache() in the data layer, so streaming this in its own Suspense
// boundary doesn't cost a second query.
export async function ReflectionBannerAsync({ timeZone }: { timeZone: string }) {
  const { reflectionCandidate } = await getAttentionAlerts(timeZone);
  if (!reflectionCandidate) return null;
  return <ReflectionBanner caseId={reflectionCandidate.id} caseTitle={reflectionCandidate.title} />;
}
