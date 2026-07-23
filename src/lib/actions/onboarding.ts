"use server";

import { redirect } from "next/navigation";
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

export async function personalizeProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const countryCode = String(formData.get("country_code") ?? "").trim() || "IN";
  const professionalTitle = String(formData.get("professional_title") ?? "").trim() || null;
  const jurisdictionName = String(formData.get("jurisdiction_name") ?? "").trim() || null;
  const timezone = String(formData.get("timezone") ?? "").trim() || "Asia/Kolkata";

  await supabase
    .from("profiles")
    .update({ country_code: countryCode, professional_title: professionalTitle, timezone })
    .eq("id", user.id);

  const primaryId = await getPrimaryLicenceId(supabase, user.id);
  if (primaryId) {
    await supabase
      .from("professional_licences")
      .update({ country_code: countryCode, jurisdiction_name: jurisdictionName })
      .eq("id", primaryId);
  } else {
    await supabase.from("professional_licences").insert({
      user_id: user.id,
      country_code: countryCode,
      jurisdiction_name: jurisdictionName,
      is_primary: true,
    });
  }

  redirect("/onboarding/details");
}

export async function saveProfessionalDetails(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const organisationName = String(formData.get("organisation_name") ?? "").trim() || null;
  const licensingAuthority = String(formData.get("licensing_authority") ?? "").trim() || null;
  const registrationNumber = String(formData.get("registration_number") ?? "").trim() || null;
  const admissionDate = String(formData.get("admission_date") ?? "").trim() || null;

  await supabase.from("profiles").update({ organisation_name: organisationName }).eq("id", user.id);

  const primaryId = await getPrimaryLicenceId(supabase, user.id);
  if (primaryId) {
    await supabase
      .from("professional_licences")
      .update({
        licensing_authority: licensingAuthority,
        registration_number: registrationNumber,
        admission_date: admissionDate,
      })
      .eq("id", primaryId);
  } else {
    // Shouldn't normally happen — step 2 always creates the primary licence
    // row first — but fall back to the profile's own country rather than
    // guessing one.
    const { data: profile } = await supabase
      .from("profiles")
      .select("country_code")
      .eq("id", user.id)
      .single();
    await supabase.from("professional_licences").insert({
      user_id: user.id,
      country_code: profile?.country_code ?? "IN",
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

  if (allIds.length > 0) {
    await supabase
      .from("user_practice_areas")
      .upsert(
        allIds.map((practiceAreaId) => ({ user_id: user.id, practice_area_id: practiceAreaId })),
        { onConflict: "user_id,practice_area_id" },
      );
  }

  redirect("/dashboard");
}
