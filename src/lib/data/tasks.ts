import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";

export async function getTasks(caseId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("case_id", caseId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
