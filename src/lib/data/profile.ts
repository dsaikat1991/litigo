import { createClient } from "@/lib/supabase/server";
import type { NotificationPreferences, ProfessionalLicence } from "@/lib/types";

export interface CurrentProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  locale: string;
  timezone: string;
  isAdmin: boolean;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, locale, timezone, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    locale: profile?.locale ?? "en-IN",
    timezone: profile?.timezone ?? "Asia/Kolkata",
    isAdmin: profile?.is_admin ?? false,
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

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const allEnabled: NotificationPreferences = {
    "7_day": { in_app: true, email: true },
    "3_day": { in_app: true, email: true },
    "1_day": { in_app: true, email: true },
    same_day: { in_app: true, email: true },
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return allEnabled;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "notify_7_day_in_app, notify_7_day_email, notify_3_day_in_app, notify_3_day_email, notify_1_day_in_app, notify_1_day_email, notify_same_day_in_app, notify_same_day_email",
    )
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return allEnabled;

  return {
    "7_day": { in_app: profile.notify_7_day_in_app, email: profile.notify_7_day_email },
    "3_day": { in_app: profile.notify_3_day_in_app, email: profile.notify_3_day_email },
    "1_day": { in_app: profile.notify_1_day_in_app, email: profile.notify_1_day_email },
    same_day: { in_app: profile.notify_same_day_in_app, email: profile.notify_same_day_email },
  };
}
