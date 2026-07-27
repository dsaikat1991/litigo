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

// The case picker submits the sentinel "none" for "no case" — Radix Select
// items can't carry an empty-string value, so this is where that sentinel
// gets translated back to a real null.
function parseCaseId(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "");
  return value && value !== "none" ? value : null;
}

export async function createMemory(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const caseId = parseCaseId(formData.get("case_id"));

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

  const caseId = parseCaseId(formData.get("case_id"));
  const previousCaseId = parseCaseId(formData.get("previous_case_id"));

  await supabase
    .from("memories")
    .update({
      content,
      case_id: caseId,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .eq("id", id);

  revalidatePath("/dashboard");
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
  if (previousCaseId && previousCaseId !== caseId) revalidatePath(`/dashboard/cases/${previousCaseId}`);
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
