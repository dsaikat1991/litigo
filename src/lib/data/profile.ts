import { createClient } from "@/lib/supabase/server";
import type { ProfessionalLicence } from "@/lib/types";

export interface CurrentProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  locale: string;
  timezone: string;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, locale, timezone")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    locale: profile?.locale ?? "en-IN",
    timezone: profile?.timezone ?? "Asia/Kolkata",
  };
}

export interface FullProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  displayName: string | null;
  professionalTitle: string | null;
  bio: string | null;
  avatarUrl: string | null;
  countryCode: string | null;
  locale: string;
  timezone: string;
}

export async function getFullProfile(): Promise<FullProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, display_name, professional_title, bio, avatar_url, country_code, locale, timezone",
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    displayName: profile?.display_name ?? null,
    professionalTitle: profile?.professional_title ?? null,
    bio: profile?.bio ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    countryCode: profile?.country_code ?? null,
    locale: profile?.locale ?? "en-IN",
    timezone: profile?.timezone ?? "Asia/Kolkata",
  };
}

export async function getPrimaryLicence(): Promise<ProfessionalLicence | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("professional_licences")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  return data ?? null;
}

export async function getUserPracticeAreaIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_practice_areas")
    .select("practice_area_id")
    .eq("user_id", user.id);

  return (data ?? []).map((row) => row.practice_area_id);
}
