"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const countryCode = String(formData.get("country_code") ?? "").trim() || "IN";
  const timezone = String(formData.get("timezone") ?? "").trim() || "Asia/Kolkata";
  const locale = String(formData.get("locale") ?? "").trim() || "en-IN";

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      display_name: String(formData.get("display_name") ?? "").trim() || null,
      professional_title: String(formData.get("professional_title") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
      country_code: countryCode,
      locale,
      timezone,
    })
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
