"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "text/plain",
]);

// The case picker submits the sentinel "none" for "no case" — same convention
// as lib/actions/memories.ts.
function parseCaseId(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "");
  return value && value !== "none" ? value : null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadDocument(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  if (file.size > MAX_SIZE_BYTES) return;
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const caseId = parseCaseId(formData.get("case_id"));
  const storagePath = `${user.id}/${randomUUID()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, file, {
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from("documents").insert({
    owner_id: user.id,
    case_id: caseId,
    storage_path: storagePath,
    file_name: file.name,
    mime_type: file.type || null,
    size_bytes: file.size,
  });
  if (insertError) throw insertError;

  revalidatePath("/dashboard");
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
}

export async function getDocumentDownloadUrl(documentId: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: document, error } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .single();
  if (error || !document) return null;

  const { data, error: signError } = await supabase.storage
    .from("documents")
    .createSignedUrl(document.storage_path, 60);
  if (signError) return null;

  return data.signedUrl;
}
