import { createClient } from "@/lib/supabase/server";

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
