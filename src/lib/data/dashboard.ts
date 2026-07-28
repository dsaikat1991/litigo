import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface AttentionAlert {
  key: string;
  message: string;
  href: string;
}

export interface ReflectionCandidate {
  id: string;
  title: string;
}

export interface RecentActivityItem {
  id: string;
  type: "argument" | "research" | "lesson" | "strategy" | "memory";
  content: string;
  // Only populated for memory-sourced items (lesson/strategy/memory) — that's
  // the only type editable inline from the "Recent memory" panel.
  tags: string[];
  caseId: string | null;
  caseTitle: string | null;
  createdAt: string;
}

export interface PracticeInsights {
  mostUsedTag: { tag: string; count: number } | null;
  argumentsWorkedCount: number;
}

// Buckets "today" and "a week from now" in the viewer's own time zone, not
// raw UTC — a hearing dated tomorrow shouldn't drop in/out of the 7-day
// window depending on what UTC offset the server happens to be in.
function dayKey(d: Date, timeZone: string): string {
  return d.toLocaleDateString("en-CA", { timeZone });
}

// Cached per-request: AttentionPanelAsync and ReflectionBannerAsync each
// stream independently (separate Suspense boundaries) but both need this
// same query — cache() collapses the two calls into a single Supabase
// round-trip instead of duplicating it.
export const getAttentionAlerts = cache(async function getAttentionAlerts(
  timeZone: string,
): Promise<{ alerts: AttentionAlert[]; reflectionCandidate: ReflectionCandidate | null }> {
  const supabase = await createClient();

  const [casesRes, argRows, memRows] = await Promise.all([
    supabase.from("cases").select("id, title, status, next_hearing_date, updated_at"),
    supabase.from("argument_notes").select("case_id"),
    supabase.from("memories").select("id, case_id, tags"),
  ]);
  if (casesRes.error) throw casesRes.error;
  if (argRows.error) throw argRows.error;
  if (memRows.error) throw memRows.error;

  const cases = casesRes.data ?? [];
  const argCaseIds = new Set((argRows.data ?? []).map((r) => r.case_id).filter(Boolean));
  const lessonCaseIds = new Set(
    (memRows.data ?? [])
      .filter((m) => m.tags?.includes("lesson") && m.case_id)
      .map((m) => m.case_id as string),
  );

  const disposedMissingReflection = cases
    .filter((c) => c.status === "disposed" && !lessonCaseIds.has(c.id))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  const activeCasesWithoutArguments = cases.filter(
    (c) => c.status !== "archived" && !argCaseIds.has(c.id),
  );
  const unlinkedMemories = (memRows.data ?? []).filter((m) => !m.case_id);

  const todayKey = dayKey(new Date(), timeZone);
  const weekOutKey = dayKey(new Date(Date.now() + 7 * 86_400_000), timeZone);
  const upcomingHearings = cases.filter(
    (c) => !!c.next_hearing_date && c.next_hearing_date >= todayKey && c.next_hearing_date <= weekOutKey,
  );

  const alerts: AttentionAlert[] = [];
  if (disposedMissingReflection.length > 0) {
    const n = disposedMissingReflection.length;
    alerts.push({
      key: "reflection",
      message: `${n} disposed ${n === 1 ? "matter has" : "matters have"} no closing reflection`,
      href: "/dashboard/cases?status=disposed",
    });
  }
  if (activeCasesWithoutArguments.length > 0) {
    const n = activeCasesWithoutArguments.length;
    alerts.push({
      key: "arguments",
      message: `${n} ${n === 1 ? "matter has" : "matters have"} no linked arguments`,
      href: "/dashboard/cases",
    });
  }
  if (unlinkedMemories.length > 0) {
    const n = unlinkedMemories.length;
    alerts.push({
      key: "memories",
      message: `${n} ${n === 1 ? "memory is" : "memories are"} not linked to any case`,
      href: "/dashboard/memories",
    });
  }
  if (upcomingHearings.length > 0) {
    const n = upcomingHearings.length;
    alerts.push({
      key: "hearings",
      message: `${n} ${n === 1 ? "hearing is" : "hearings are"} coming up within 7 days`,
      href: "/dashboard/cases",
    });
  }

  const reflectionCandidate = disposedMissingReflection[0]
    ? { id: disposedMissingReflection[0].id, title: disposedMissingReflection[0].title }
    : null;

  return { alerts, reflectionCandidate };
});

interface NoteRow {
  id: string;
  content: string;
  issue?: string | null;
  citation?: string | null;
  case_id: string | null;
  created_at: string;
  case: { title: string } | null;
}

interface MemoryRow {
  id: string;
  content: string;
  tags: string[];
  case_id: string | null;
  created_at: string;
  case: { title: string } | null;
}

function memoryActivityType(tags: string[]): "lesson" | "strategy" | "memory" {
  if (tags.includes("lesson")) return "lesson";
  if (tags.includes("strategy")) return "strategy";
  return "memory";
}

export async function getRecentActivity(limit = 4): Promise<RecentActivityItem[]> {
  const supabase = await createClient();

  const [argRes, resRes, memRes] = await Promise.all([
    supabase
      .from("argument_notes")
      .select("id, content, issue, case_id, created_at, case:cases(title)")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<NoteRow[]>(),
    supabase
      .from("research_notes")
      .select("id, content, citation, case_id, created_at, case:cases(title)")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<NoteRow[]>(),
    supabase
      .from("memories")
      .select("id, content, tags, case_id, created_at, case:cases(title)")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<MemoryRow[]>(),
  ]);
  if (argRes.error) throw argRes.error;
  if (resRes.error) throw resRes.error;
  if (memRes.error) throw memRes.error;

  const items: RecentActivityItem[] = [
    ...(argRes.data ?? []).map((n) => ({
      id: n.id,
      type: "argument" as const,
      content: n.issue || n.content,
      tags: [],
      caseId: n.case_id,
      caseTitle: n.case?.title ?? null,
      createdAt: n.created_at,
    })),
    ...(resRes.data ?? []).map((n) => ({
      id: n.id,
      type: "research" as const,
      content: n.citation || n.content,
      tags: [],
      caseId: n.case_id,
      caseTitle: n.case?.title ?? null,
      createdAt: n.created_at,
    })),
    ...(memRes.data ?? []).map((m) => ({
      id: m.id,
      type: memoryActivityType(m.tags ?? []),
      content: m.content,
      tags: m.tags ?? [],
      caseId: m.case_id,
      caseTitle: m.case?.title ?? null,
      createdAt: m.created_at,
    })),
  ];

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items.slice(0, limit);
}

export async function getPracticeInsights(): Promise<PracticeInsights> {
  const supabase = await createClient();

  const [casesRes, memRes, argRes, resRes, argOutcomeRes] = await Promise.all([
    supabase.from("cases").select("tags"),
    supabase.from("memories").select("tags"),
    supabase.from("argument_notes").select("tags"),
    supabase.from("research_notes").select("tags"),
    supabase.from("argument_notes").select("id", { count: "exact", head: true }).eq("outcome", "worked"),
  ]);
  if (casesRes.error) throw casesRes.error;
  if (memRes.error) throw memRes.error;
  if (argRes.error) throw argRes.error;
  if (resRes.error) throw resRes.error;
  if (argOutcomeRes.error) throw argOutcomeRes.error;

  const tagCounts = new Map<string, number>();
  for (const rows of [casesRes.data, memRes.data, argRes.data, resRes.data]) {
    for (const row of rows ?? []) {
      for (const tag of row.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
  }
  let mostUsedTag: { tag: string; count: number } | null = null;
  for (const [tag, count] of tagCounts) {
    if (!mostUsedTag || count > mostUsedTag.count) mostUsedTag = { tag, count };
  }

  return {
    mostUsedTag,
    argumentsWorkedCount: argOutcomeRes.count ?? 0,
  };
}
