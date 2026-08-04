import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface AttentionAlert {
  key: string;
  message: string;
  href: string;
}

export type TodaysFocusItem = AttentionAlert;

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

// A separate query from getAttentionAlerts (not a shared cache() call)
// because the shape is different on purpose: getAttentionAlerts bundles
// every matching case into one counted message ("3 matters have no linked
// arguments"); this surfaces hearings due tomorrow/today per case by name,
// since "Hearing tomorrow" only means something next to which case it is.
//
// Deliberately scoped to just that — date-driven, "due today" items. The
// unlinked-memories and disposed-missing-reflection prompts that used to
// live here moved to getKnowledgeGaps(): they're not time-sensitive, they're
// case-knowledge-capture prompts, the same family as "last hearing has no
// court observations" — and the disposed-reflection one duplicated what
// ReflectionBannerAsync already shows, case by case, right below the cards.
export async function getTodaysFocus(timeZone: string): Promise<TodaysFocusItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cases")
    .select("id, title, case_number, next_hearing_date");
  if (error) throw error;

  const todayKey = dayKey(new Date(), timeZone);
  const tomorrowKey = dayKey(new Date(Date.now() + 86_400_000), timeZone);

  const items: TodaysFocusItem[] = [];
  for (const c of data ?? []) {
    if (c.next_hearing_date === tomorrowKey || c.next_hearing_date === todayKey) {
      const when = c.next_hearing_date === tomorrowKey ? "tomorrow" : "today";
      items.push({
        key: `hearing-${c.id}`,
        message: `Hearing ${when} — ${c.case_number || c.title}`,
        href: `/dashboard/cases/${c.id}`,
      });
    }
  }

  return items;
}

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

export interface KnowledgeGapItem {
  key: string;
  message: string;
  cta: string;
  href: string;
}

// Surfaces a short, capped list of specific unfinished-knowledge prompts —
// deliberately not exhaustive (this is a glance-at card, not a queue).
// Reuses the same "closing lesson" concept as ReflectionBannerAsync, but
// that banner only ever shows the single most-pressing candidate; this can
// list several at once, plus a second prompt type (a recorded hearing with
// no court direction captured) that nothing else on the page surfaces.
export async function getKnowledgeGaps(): Promise<KnowledgeGapItem[]> {
  const supabase = await createClient();

  const [casesRes, eventsRes, memRes] = await Promise.all([
    supabase.from("cases").select("id, title, status"),
    supabase
      .from("case_events")
      .select("case_id, event_date, court_direction")
      .order("event_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("memories").select("case_id, tags"),
  ]);
  if (casesRes.error) throw casesRes.error;
  if (eventsRes.error) throw eventsRes.error;
  if (memRes.error) throw memRes.error;

  const cases = casesRes.data ?? [];
  const memories = memRes.data ?? [];

  // First event seen per case_id, in this (newest-first) order, is that
  // case's latest — same reduction used for HearingDiaryEntry in
  // case-events.ts, just with a narrower column selection here since only
  // court_direction's presence matters, not the whole event.
  const latestEventByCase = new Map<string, { court_direction: string | null }>();
  for (const event of eventsRes.data ?? []) {
    if (!latestEventByCase.has(event.case_id)) {
      latestEventByCase.set(event.case_id, { court_direction: event.court_direction });
    }
  }

  const lessonCaseIds = new Set(
    memories.filter((m) => m.tags?.includes("lesson") && m.case_id).map((m) => m.case_id as string),
  );

  const items: KnowledgeGapItem[] = [];
  const cap = 4;

  // Moved here from getTodaysFocus: not time-sensitive, so it doesn't
  // belong under "today's" anything — it's the same "capture this
  // knowledge" family as the two prompts below.
  const unlinkedMemories = memories.filter((m) => !m.case_id);
  if (unlinkedMemories.length > 0) {
    const n = unlinkedMemories.length;
    items.push({
      key: "unlinked-memories",
      message: `${n} ${n === 1 ? "memory is" : "memories are"} not linked to any case.`,
      cta: "Link them now",
      href: "/dashboard/memories",
    });
  }

  for (const c of cases) {
    if (items.length >= cap) break;
    if (c.status === "disposed" && !lessonCaseIds.has(c.id)) {
      items.push({
        key: `lesson-${c.id}`,
        message: `${c.title}: matter disposed.`,
        cta: "What did this case teach you?",
        href: `/dashboard/cases/${c.id}`,
      });
    }
  }

  for (const c of cases) {
    if (items.length >= cap) break;
    if (c.status !== "ongoing") continue;
    const latest = latestEventByCase.get(c.id);
    if (latest && !latest.court_direction) {
      items.push({
        key: `observation-${c.id}`,
        message: `${c.title}: last hearing has no court observations.`,
        cta: "Capture now",
        href: `/dashboard/cases/${c.id}`,
      });
    }
  }

  return items;
}

export interface RecentArgumentIssue {
  issue: string;
  lastUsedAt: string;
}

// Distinct argument `issue` values, most-recently-used first — "recently
// used," not "most used": frequency ranking is a different, separately
// useful view (see getMonthlyArgumentInsight below), not this one.
export async function getRecentArgumentIssues(limit = 5): Promise<RecentArgumentIssue[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("argument_notes")
    .select("issue, created_at")
    .not("issue", "is", null)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const seen = new Map<string, string>();
  for (const row of data ?? []) {
    const issue = row.issue?.trim();
    if (!issue || seen.has(issue)) continue;
    seen.set(issue, row.created_at);
    if (seen.size >= limit) break;
  }

  return Array.from(seen, ([issue, lastUsedAt]) => ({ issue, lastUsedAt }));
}

export interface MonthlyArgumentInsight {
  issue: string;
  matterCount: number;
}

// The one argument `issue` used across the most *distinct* matters this
// calendar month (in the viewer's own time zone) — "you argued X in N
// different matters" only means something as a prompt toward reusable
// notes if N counts matters, not raw argument-note rows (arguing the same
// issue five times in one matter isn't the same signal as five matters).
// Returns null below the "worth reusing" threshold of 2 distinct matters.
export async function getMonthlyArgumentInsight(timeZone: string): Promise<MonthlyArgumentInsight | null> {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(
    now.toLocaleString("en-US", { timeZone }),
  );
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("argument_notes")
    .select("issue, case_id")
    .not("issue", "is", null)
    .not("case_id", "is", null)
    .gte("created_at", monthStart.toISOString());
  if (error) throw error;

  const casesByIssue = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    const issue = row.issue?.trim();
    if (!issue || !row.case_id) continue;
    if (!casesByIssue.has(issue)) casesByIssue.set(issue, new Set());
    casesByIssue.get(issue)!.add(row.case_id);
  }

  let best: MonthlyArgumentInsight | null = null;
  for (const [issue, caseIds] of casesByIssue) {
    if (!best || caseIds.size > best.matterCount) {
      best = { issue, matterCount: caseIds.size };
    }
  }

  return best && best.matterCount >= 2 ? best : null;
}
