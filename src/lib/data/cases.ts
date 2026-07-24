import { createClient } from "@/lib/supabase/server";
import type { ArgumentNote, Case, CaseStatus, ResearchNote } from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function attachCounts(supabase: SupabaseClient, cases: Case[]): Promise<Case[]> {
  if (cases.length === 0) return [];

  const caseIds = cases.map((c) => c.id);
  const [argumentRows, researchRows, memoryRows] = await Promise.all([
    supabase.from("argument_notes").select("case_id").in("case_id", caseIds),
    supabase.from("research_notes").select("case_id").in("case_id", caseIds),
    supabase.from("memories").select("case_id").in("case_id", caseIds),
  ]);
  if (argumentRows.error) throw argumentRows.error;
  if (researchRows.error) throw researchRows.error;
  if (memoryRows.error) throw memoryRows.error;

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

  return cases.map((c) => ({
    ...c,
    argument_count: argumentCounts.get(c.id) ?? 0,
    research_count: researchCounts.get(c.id) ?? 0,
    memory_count: memoryCounts.get(c.id) ?? 0,
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
  // argument/research notes or linked memories match — the whole point is
  // finding a case again via a point you argued or researched, not just its
  // title/summary.
  const pattern = `%${trimmed}%`;
  const [caseMatches, argumentMatches, researchMatches, memoryMatches] = await Promise.all([
    supabase.from("cases").select("id").ilike("search_text", pattern),
    supabase.from("argument_notes").select("case_id").ilike("search_text", pattern),
    supabase.from("research_notes").select("case_id").ilike("search_text", pattern),
    supabase.from("memories").select("case_id").not("case_id", "is", null).ilike("search_text", pattern),
  ]);

  if (caseMatches.error) throw caseMatches.error;
  if (argumentMatches.error) throw argumentMatches.error;
  if (researchMatches.error) throw researchMatches.error;
  if (memoryMatches.error) throw memoryMatches.error;

  const matchingIds = Array.from(
    new Set([
      ...caseMatches.data.map((c) => c.id),
      ...argumentMatches.data.map((n) => n.case_id),
      ...researchMatches.data.map((n) => n.case_id),
      ...memoryMatches.data.map((n) => n.case_id as string),
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

export async function getCaseById(id: string): Promise<Case | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
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
