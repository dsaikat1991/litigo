import { createClient } from "@/lib/supabase/server";
import type { ArgumentNote, Case, ResearchNote } from "@/lib/types";

export async function getCases(search?: string): Promise<Case[]> {
  const supabase = await createClient();
  const trimmed = search?.trim();

  if (!trimmed) {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  // A case matches if the case record itself matches, or if any of its
  // argument/research notes match — the whole point is finding a case again
  // via a point you argued or researched, not just its title/summary.
  const pattern = `%${trimmed}%`;
  const [caseMatches, argumentMatches, researchMatches] = await Promise.all([
    supabase.from("cases").select("id").ilike("search_text", pattern),
    supabase.from("argument_notes").select("case_id").ilike("search_text", pattern),
    supabase.from("research_notes").select("case_id").ilike("search_text", pattern),
  ]);

  if (caseMatches.error) throw caseMatches.error;
  if (argumentMatches.error) throw argumentMatches.error;
  if (researchMatches.error) throw researchMatches.error;

  const matchingIds = Array.from(
    new Set([
      ...caseMatches.data.map((c) => c.id),
      ...argumentMatches.data.map((n) => n.case_id),
      ...researchMatches.data.map((n) => n.case_id),
    ]),
  );

  if (matchingIds.length === 0) return [];

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .in("id", matchingIds)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
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
