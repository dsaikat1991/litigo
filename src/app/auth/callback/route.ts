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
      // No explicit destination (the OAuth path, not the password-reset
      // path) — a just-created account has no onboarding data yet, so send
      // first-time sign-ins there instead of straight to the dashboard.
      const justCreated =
        Date.now() - new Date(data.user.created_at).getTime() < 60_000;
      return NextResponse.redirect(
        `${origin}${justCreated ? "/onboarding/personalize" : "/dashboard"}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("That link is invalid or has expired.")}`);
}
