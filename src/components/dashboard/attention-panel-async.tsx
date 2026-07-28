import { getAttentionAlerts } from "@/lib/data/dashboard";
import { AttentionPanel } from "@/components/dashboard/attention-panel";

// Streamed independently of the dashboard shell (see dashboard/page.tsx's
// Suspense boundary) — the query is cached per-request so this and
// ReflectionBannerAsync, which read the same getAttentionAlerts() call,
// don't duplicate the round-trip.
export async function AttentionPanelAsync({ timeZone }: { timeZone: string }) {
  const { alerts } = await getAttentionAlerts(timeZone);
  return <AttentionPanel alerts={alerts} />;
}
