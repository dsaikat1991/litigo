import { createClient } from "@/lib/supabase/server";
import type { ArgumentNote, Case, CaseStatus, ResearchNote } from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function attachCounts(supabase: SupabaseClient, cases: Case[]): Promise<Case[]> {
  if (cases.length === 0) return [];

  const caseIds = cases.map((c) => c.id);
  const [argumentRows, researchRows, memoryRows, documentRows, orderRows, pendingTaskRows] = await Promise.all([
    supabase.from("argument_notes").select("case_id").in("case_id", caseIds),
    supabase.from("research_notes").select("case_id").in("case_id", caseIds),
    // Ordered newest-first and carrying content/created_at (not just
    // case_id) so the same query serves both the count below and
    // `latest_memory` — the first row seen per case_id, in this order,
    // is that case's most recent memory. There's no index supporting a
    // "latest per group" query server-side, so this reduces client-side
    // rather than adding a second round trip.
    supabase
      .from("memories")
      .select("id, case_id, content, created_at")
      .in("case_id", caseIds)
      .order("created_at", { ascending: false }),
    supabase.from("hearing_documents").select("case_id").in("case_id", caseIds),
    supabase.from("case_events").select("case_id").eq("event_type", "order").in("case_id", caseIds),
    // Same "sort so the first row per case_id wins" trick as memories above
    // — soonest due date first (undated tasks last), so the first pending
    // task seen per case is the one worth surfacing as "Next action".
    supabase
      .from("tasks")
      .select("case_id, title, due_date, created_at")
      .in("case_id", caseIds)
      .eq("is_done", false)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
  ]);
  if (argumentRows.error) throw argumentRows.error;
  if (researchRows.error) throw researchRows.error;
  if (memoryRows.error) throw memoryRows.error;
  if (documentRows.error) throw documentRows.error;
  if (orderRows.error) throw orderRows.error;
  if (pendingTaskRows.error) throw pendingTaskRows.error;

  const countBy = (rows: { case_id: string | null }[]) => {
    const map = new Map<string, number>();
    for (const row of rows) {
      if (!row.case_id) continue;
      map.set(row.case_id, (map.get(row.case_id) ?? 0) + 1);
    }
    return map;
  };
  const argumentCounts = countBy(argumentRows.data);
  const researchCounts = countBy(researchRows.data);
  const memoryCounts = countBy(memoryRows.data);
  const documentCounts = countBy(documentRows.data);
  const orderCounts = countBy(orderRows.data);

  const latestMemoryByCase = new Map<string, { id: string; content: string; created_at: string }>();
  for (const row of memoryRows.data) {
    if (!row.case_id || latestMemoryByCase.has(row.case_id)) continue;
    latestMemoryByCase.set(row.case_id, {
      id: row.id,
      content: row.content,
      created_at: row.created_at,
    });
  }

  const pendingTaskCounts = countBy(pendingTaskRows.data);
  const nextActionByCase = new Map<string, string>();
  for (const row of pendingTaskRows.data) {
    if (!row.case_id || nextActionByCase.has(row.case_id)) continue;
    nextActionByCase.set(row.case_id, row.title);
  }

  return cases.map((c) => ({
    ...c,
    argument_count: argumentCounts.get(c.id) ?? 0,
    research_count: researchCounts.get(c.id) ?? 0,
    memory_count: memoryCounts.get(c.id) ?? 0,
    document_count: documentCounts.get(c.id) ?? 0,
    order_count: orderCounts.get(c.id) ?? 0,
    latest_memory: latestMemoryByCase.get(c.id) ?? null,
    next_action: nextActionByCase.get(c.id) ?? null,
    pending_task_count: pendingTaskCounts.get(c.id) ?? 0,
  }));
}

export async function getCases(search?: string, status?: CaseStatus): Promise<Case[]> {
  const supabase = await createClient();
  const trimmed = search?.trim();

  if (!trimmed) {
    let query = supabase.from("cases").select("*").order("updated_at", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return attachCounts(supabase, data ?? []);
  }

  // A case matches if the case record itself matches, or if any of its
  // argument/research notes, linked memories, or timeline/hearing events
  // match — the whole point is finding a case again via a point you argued,
  // researched, or recorded at a hearing, not just its title/summary.
  const pattern = `%${trimmed}%`;
  const [caseMatches, argumentMatches, researchMatches, memoryMatches, eventMatches] = await Promise.all([
    supabase.from("cases").select("id").ilike("search_text", pattern),
    supabase.from("argument_notes").select("case_id").ilike("search_text", pattern),
    supabase.from("research_notes").select("case_id").ilike("search_text", pattern),
    supabase.from("memories").select("case_id").not("case_id", "is", null).ilike("search_text", pattern),
    supabase.from("case_events").select("case_id").ilike("search_text", pattern),
  ]);

  if (caseMatches.error) throw caseMatches.error;
  if (argumentMatches.error) throw argumentMatches.error;
  if (researchMatches.error) throw researchMatches.error;
  if (memoryMatches.error) throw memoryMatches.error;
  if (eventMatches.error) throw eventMatches.error;

  const matchingIds = Array.from(
    new Set([
      ...caseMatches.data.map((c) => c.id),
      ...argumentMatches.data.map((n) => n.case_id),
      ...researchMatches.data.map((n) => n.case_id),
      ...memoryMatches.data.map((n) => n.case_id as string),
      ...eventMatches.data.map((e) => e.case_id),
    ]),
  );

  if (matchingIds.length === 0) return [];

  let query = supabase
    .from("cases")
    .select("*")
    .in("id", matchingIds)
    .order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return attachCounts(supabase, data ?? []);
}

export interface DashboardCasesSummary {
  continueWorking: Case[];
  totalCases: number;
  totalArguments: number;
  totalResearch: number;
}

// Dashboard-home-specific: getCases() fetches every case and fans attachCounts()
// out across all of them, but the home page only ever renders 2 "Continue
// working" cards plus a total-counts stats line — attachCounts()'ing a case
// list that could be hundreds long just to show 2 cards and some totals is
// wasted work that scales with case count for no benefit. This pushes the
// "soonest hearing first, nulls last, then most recently touched" sort into
// SQL (limit 2 there instead of fetching everything and sorting in JS), and
// gets the stats-line totals from cheap head-count queries instead of
// summing per-case counts. getCases() itself is unchanged — /dashboard/cases
// and /dashboard/search still need the full list.
export async function getDashboardCases(): Promise<DashboardCasesSummary> {
  const supabase = await createClient();

  const [topCasesRes, totalCasesRes, totalArgumentsRes, totalResearchRes] = await Promise.all([
    supabase
      .from("cases")
      .select("*")
      .order("next_hearing_date", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase.from("cases").select("id", { count: "exact", head: true }),
    supabase.from("argument_notes").select("id", { count: "exact", head: true }),
    supabase.from("research_notes").select("id", { count: "exact", head: true }),
  ]);
  if (topCasesRes.error) throw topCasesRes.error;
  if (totalCasesRes.error) throw totalCasesRes.error;
  if (totalArgumentsRes.error) throw totalArgumentsRes.error;
  if (totalResearchRes.error) throw totalResearchRes.error;

  const continueWorking = await attachCounts(supabase, topCasesRes.data ?? []);

  return {
    continueWorking,
    totalCases: totalCasesRes.count ?? 0,
    totalArguments: totalArgumentsRes.count ?? 0,
    totalResearch: totalResearchRes.count ?? 0,
  };
}

export async function getCaseById(id: string): Promise<Case | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// Lightweight id/title pairs for case pickers (linking a memory to a case,
// jumping to a case from the command palette) — not a full Case fetch.
export async function getCaseOptions(): Promise<{ id: string; title: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cases").select("id, title").order("title");
  if (error) throw error;
  return data ?? [];
}

export async function getArgumentNotes(caseId: string): Promise<ArgumentNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("argument_notes")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getResearchNotes(caseId: string): Promise<ResearchNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research_notes")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
