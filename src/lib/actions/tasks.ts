"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TaskPriority } from "@/lib/types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

function parsePriority(raw: FormDataEntryValue | null): TaskPriority {
  const value = String(raw ?? "");
  return PRIORITIES.includes(value as TaskPriority) ? (value as TaskPriority) : "medium";
}

// The linked-hearing picker submits the sentinel "none" for "no hearing" —
// Radix Select items can't carry an empty-string value, same convention as
// the case picker in lib/actions/memories.ts.
function parseEventId(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return value && value !== "none" ? value : null;
}

export async function createTask(formData: FormData) {
  const caseId = String(formData.get("case_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!caseId || !title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("tasks").insert({
    case_id: caseId,
    owner_id: user.id,
    title,
    due_date: String(formData.get("due_date") ?? "").trim() || null,
    priority: parsePriority(formData.get("priority")),
    assignee: String(formData.get("assignee") ?? "").trim() || null,
    event_id: parseEventId(formData.get("event_id")),
  });

  revalidatePath(`/dashboard/cases/${caseId}`);
  revalidatePath("/dashboard/diary");
}

export async function updateTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !caseId || !title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("tasks")
    .update({
      title,
      due_date: String(formData.get("due_date") ?? "").trim() || null,
      priority: parsePriority(formData.get("priority")),
      assignee: String(formData.get("assignee") ?? "").trim() || null,
      event_id: parseEventId(formData.get("event_id")),
    })
    .eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
  revalidatePath("/dashboard/diary");
}

export async function toggleTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  const isDone = String(formData.get("is_done") ?? "") === "true";
  if (!id || !caseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("tasks")
    .update({ is_done: isDone, completed_at: isDone ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/diary");
  revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function deleteTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const caseId = String(formData.get("case_id") ?? "");
  if (!id || !caseId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("tasks").delete().eq("id", id);

  revalidatePath(`/dashboard/cases/${caseId}`);
  revalidatePath("/dashboard/diary");
}
