"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CaseStatus } from "@/lib/types";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createCase(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const { data, error } = await supabase
    .from("cases")
    .insert({
      owner_id: user.id,
      title,
      case_number: String(formData.get("case_number") ?? "") || null,
      court: String(formData.get("court") ?? "") || null,
      case_type: String(formData.get("case_type") ?? "") || null,
      parties: String(formData.get("parties") ?? "") || null,
      status: (String(formData.get("status") ?? "ongoing") as CaseStatus),
      summary: String(formData.get("summary") ?? "") || null,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/dashboard?error=${encodeURIComponent(error?.message ?? "Could not create case")}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/cases/${data.id}`);
}

export async function updateCase(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("cases")
    .update({
      title,
      case_number: String(formData.get("case_number") ?? "") || null,
      court: String(formData.get("court") ?? "") || null,
      case_type: String(formData.get("case_type") ?? "") || null,
      parties: String(formData.get("parties") ?? "") || null,
      status: (String(formData.get("status") ?? "ongoing") as CaseStatus),
      summary: String(formData.get("summary") ?? "") || null,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/cases/${id}`);
}

export async function deleteCase(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("cases").delete().eq("id", id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
