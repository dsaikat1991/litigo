import { createClient } from "@/lib/supabase/server";
import type { PracticeArea } from "@/lib/types";

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
