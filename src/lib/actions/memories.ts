"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createMemory(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const caseId = String(formData.get("case_id") ?? "") || null;

  await supabase.from("memories").insert({
    owner_id: user.id,
    case_id: caseId,
    content,
    tags: parseTags(String(formData.get("tags") ?? "")),
  });

  revalidatePath("/dashboard");
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function updateMemory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const caseId = String(formData.get("case_id") ?? "") || null;

  await supabase
    .from("memories")
    .update({
      content,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .eq("id", id);

  revalidatePath("/dashboard");
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function deleteMemory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const caseId = String(formData.get("case_id") ?? "") || null;

  await supabase.from("memories").delete().eq("id", id);

  revalidatePath("/dashboard");
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
}
