"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

type SessionState = "checking" | "valid" | "invalid";

// Root-level boundary: catches uncaught errors anywhere in the tree except
// the root layout itself (that needs global-error.tsx). Next.js's own
// instrumentation.ts#onRequestError already reports these to Sentry — this
// component is purely the fallback UI, not a reporting hook.
export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRetrying, setIsRetrying] = useState(false);
  // Production strips the real error message/type (Next.js does this by
  // design, to avoid leaking internals), so this component can't inspect
  // *why* it was invoked. What it can do is independently check whether
  // there's still a valid session right now — a stale/expired session
  // (e.g. a tab left open long enough that the token needs refreshing, or
  // the Postgres clock-skew "JWT issued at future" error seen recurring in
  // Sentry) is a very different situation from an unrelated bug, and
  // "try again" is actively misleading if the session is what's actually
  // dead — retrying would just reproduce the same failure.
  const [sessionState, setSessionState] = useState<SessionState>("checking");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setSessionState(session ? "valid" : "invalid");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRetry() {
    setIsRetrying(true);
    try {
      const supabase = createClient();
      await supabase.auth.refreshSession();
    } catch {
      // Best-effort — if refresh itself fails, reset() below will just
      // surface whatever's still wrong.
    } finally {
      reset();
      setIsRetrying(false);
    }
  }

  const sessionExpired = sessionState === "invalid";

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4 h-5 w-auto" />
          <div className="bg-muted mb-2 flex size-10 items-center justify-center rounded-full">
            <AlertTriangle className="text-muted-foreground size-5" />
          </div>
          <CardTitle className="text-xl font-medium">
            {sessionExpired ? "Your session expired" : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {sessionExpired
              ? "You've been signed out — this usually happens after the page has been open for a while. Sign in again to pick up right where you left off."
              : "That was a temporary hiccup loading this page — nothing you did caused it, and nothing was lost. Try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          {sessionExpired ? (
            <Button asChild className="w-full">
              <Link href="/login">Sign in again</Link>
            </Button>
          ) : (
            <Button type="button" onClick={handleRetry} disabled={isRetrying} className="w-full">
              {isRetrying ? "Trying again…" : "Try again"}
            </Button>
          )}
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
