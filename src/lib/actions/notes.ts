"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { NoteOutcome, ResearchSourceType } from "@/lib/types";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createArgumentNote(formData: FormData) {
  const caseId = String(formData.get("case_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!caseId || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const outcome = String(formData.get("outcome") ?? "") || null;

  await supabase.from("argument_notes").insert({
    case_id: caseId,
    owner_id: user.id,
    issue: String(formData.get("issue") ?? "") || null,
    content,
    outcome: outcome as NoteOutcome | null,
    tags: parseTags(String(formData.get("tags") ?? "")),
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function createResearchNote(formData: FormData) {
  const caseId = String(formData.get("case_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!caseId || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sourceType = String(formData.get("source_type") ?? "") || null;

  await supabase.from("research_notes").insert({
    case_id: caseId,
    owner_id: user.id,
    source_type: sourceType as ResearchSourceType | null,
    citation: String(formData.get("citation") ?? "") || null,
    content,
    tags: parseTags(String(formData.get("tags") ?? "")),
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function updateArgumentNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !caseId || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const outcome = String(formData.get("outcome") ?? "") || null;

  await supabase
    .from("argument_notes")
    .update({
      issue: String(formData.get("issue") ?? "") || null,
      content,
      outcome: outcome as NoteOutcome | null,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function deleteArgumentNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  if (!id || !caseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("argument_notes").delete().eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function updateResearchNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!id || !caseId || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sourceType = String(formData.get("source_type") ?? "") || null;

  await supabase
    .from("research_notes")
    .update({
      source_type: sourceType as ResearchSourceType | null,
      citation: String(formData.get("citation") ?? "") || null,
      content,
      tags: parseTags(String(formData.get("tags") ?? "")),
    })
    .eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function deleteResearchNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  if (!id || !caseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("research_notes").delete().eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
}
