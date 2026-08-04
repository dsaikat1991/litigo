import { createClient } from "@/lib/supabase/server";
import type { CaseDocument } from "@/lib/types";

export async function getDocuments(options?: { caseId?: string }): Promise<CaseDocument[]> {
  const supabase = await createClient();
  let query = supabase
    .from("documents")
    .select("*, case:cases(id, title)")
    .order("created_at", { ascending: false });

  if (options?.caseId) {
    query = query.eq("case_id", options.caseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getRecentDocuments(limit = 5): Promise<CaseDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*, case:cases(id, title)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
