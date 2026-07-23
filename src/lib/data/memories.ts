import { createClient } from "@/lib/supabase/server";
import type { Memory } from "@/lib/types";

export async function getMemories(options?: { caseId?: string; search?: string }): Promise<Memory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("memories")
    .select("*, case:cases(title)")
    .order("created_at", { ascending: false });

  if (options?.caseId) {
    query = query.eq("case_id", options.caseId);
  }

  const trimmed = options?.search?.trim();
  if (trimmed) {
    query = query.ilike("search_text", `%${trimmed}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
