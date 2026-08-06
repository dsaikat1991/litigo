"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getPrimaryLicenceId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("professional_licences")
    .select("id")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();
  return data?.id ?? null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// Returns the new avatar's public URL, or undefined if no file was
// submitted (or the upload failed) — undefined (not null) so the caller can
// tell "no change this submission" apart from "explicitly cleared", the
// same convention uploadCoverImage() in lib/actions/blog.ts uses. Stored
// under the owner's own folder — avatars_storage_insert_own (see the
// avatars bucket migration) checks that path segment against auth.uid().
async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return undefined;

  const path = `${userId}/${randomUUID()}-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    contentType: file.type || undefined,
  });
  if (uploadError) {
    // Graceful degradation, same as uploadCoverImage() — the avatars bucket
    // migration may not be applied yet; don't lose the rest of the profile
    // edit over a missing avatar.
    console.error("Avatar upload failed:", uploadError.message);
    return undefined;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const countryCode = String(formData.get("country_code") ?? "").trim() || "IN";
  const timezone = String(formData.get("timezone") ?? "").trim() || "Asia/Kolkata";
  const locale = String(formData.get("locale") ?? "").trim() || "en-IN";

  // A new file always wins; otherwise "Remove current photo" clears it;
  // otherwise the existing avatar_url is left untouched entirely (the key
  // is omitted from the update payload rather than resent as-is).
  const removeAvatar = String(formData.get("remove_avatar") ?? "") === "1";
  const avatarUrl = await uploadAvatar(supabase, user.id, formData);

  const profileUpdates: Record<string, unknown> = {
    full_name: String(formData.get("full_name") ?? "").trim() || null,
    display_name: String(formData.get("display_name") ?? "").trim() || null,
    professional_title: String(formData.get("professional_title") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    country_code: countryCode,
    locale,
    timezone,
  };
  if (avatarUrl !== undefined) profileUpdates.avatar_url = avatarUrl;
  else if (removeAvatar) profileUpdates.avatar_url = null;

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("id", user.id);
  if (profileError) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  const jurisdictionName = String(formData.get("jurisdiction_name") ?? "").trim() || null;
  const licensingAuthority = String(formData.get("licensing_authority") ?? "").trim() || null;
  const registrationNumber = String(formData.get("registration_number") ?? "").trim() || null;
  const admissionDate = String(formData.get("admission_date") ?? "").trim() || null;

  const primaryId = await getPrimaryLicenceId(supabase, user.id);
  if (primaryId) {
    await supabase
      .from("professional_licences")
      .update({
        country_code: countryCode,
        jurisdiction_name: jurisdictionName,
        licensing_authority: licensingAuthority,
        registration_number: registrationNumber,
        admission_date: admissionDate,
      })
      .eq("id", primaryId);
  } else {
    await supabase.from("professional_licences").insert({
      user_id: user.id,
      country_code: countryCode,
      jurisdiction_name: jurisdictionName,
      is_primary: true,
      licensing_authority: licensingAuthority,
      registration_number: registrationNumber,
      admission_date: admissionDate,
    });
  }

  const existingIds = formData.getAll("practice_area_ids").map(String).filter(Boolean);
  const newNames = formData
    .getAll("new_practice_areas")
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);

  const allIds = [...existingIds];
  for (const name of newNames) {
    const { data: found } = await supabase
      .from("practice_areas")
      .select("id")
      .ilike("name", name)
      .maybeSingle();
    if (found) {
      allIds.push(found.id);
    } else {
      const { data: created } = await supabase
        .from("practice_areas")
        .insert({ name })
        .select("id")
        .single();
      if (created) allIds.push(created.id);
    }
  }

  // Replace the full set rather than diffing — the picker always submits the
  // complete current selection, so this keeps removed areas from lingering.
  await supabase.from("user_practice_areas").delete().eq("user_id", user.id);
  if (allIds.length > 0) {
    await supabase
      .from("user_practice_areas")
      .upsert(
        allIds.map((practiceAreaId) => ({ user_id: user.id, practice_area_id: practiceAreaId })),
        { onConflict: "user_id,practice_area_id" },
      );
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?saved=1");
}
