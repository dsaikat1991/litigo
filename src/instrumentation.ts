import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Auth state alone (never the token, never the user's identity) so a
// session/JWT-shaped error — e.g. a clock-skew "JWT issued at future" from
// Postgres — is diagnosable from Sentry without any advocate or client
// data ever entering the event. getSession() reads the local cookie only
// (no network round-trip to Supabase), so this is safe to call even while
// the request that's failing is itself an auth failure.
async function getAuthErrorContext(): Promise<{
  authState: "signed_in" | "signed_out" | "unknown";
  jwtExpiresAt: string | null;
}> {
  try {
    if (process.env.NEXT_RUNTIME !== "nodejs") return { authState: "unknown", jwtExpiresAt: null };
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return {
      authState: session ? "signed_in" : "signed_out",
      jwtExpiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    };
  } catch {
    // Best-effort diagnostic only — never let enrichment itself block or
    // alter reporting of the actual error.
    return { authState: "unknown", jwtExpiresAt: null };
  }
}

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  const Sentry = await import("@sentry/nextjs");
  const authContext = await getAuthErrorContext();

  Sentry.withScope((scope) => {
    scope.setContext("auth", authContext);
    Sentry.captureRequestError(...args);
  });
};
