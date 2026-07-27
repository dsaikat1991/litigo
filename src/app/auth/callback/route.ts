import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      // No explicit destination (the OAuth or email-confirmation path, not
      // password reset) — send anyone who hasn't been through onboarding
      // step 1 there instead of the dashboard. Not time-based: an email
      // confirmation can be clicked minutes or hours after signup, so
      // "created in the last N seconds" can't reliably tell first-time
      // sign-ins apart from returning ones the way it can for OAuth.
      const { data: licence } = await supabase
        .from("professional_licences")
        .select("id")
        .eq("user_id", data.user.id)
        .eq("is_primary", true)
        .maybeSingle();
      return NextResponse.redirect(
        `${origin}${licence ? "/dashboard" : "/onboarding/personalize"}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("That link is invalid or has expired.")}`);
}
