"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

// Root-level boundary: catches uncaught errors anywhere in the tree except
// the root layout itself (that needs global-error.tsx). Next.js's own
// instrumentation.ts#onRequestError already reports these to Sentry — this
// component is purely the fallback UI, not a reporting hook.
export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [isRetrying, setIsRetrying] = useState(false);

  // A render failure here is often a stale/skewed session (e.g. a
  // clock-skew "JWT issued at future" from Postgres) rather than a bug in
  // the page itself — re-rendering with the same stale cookie would just
  // reproduce the same error. Refreshing the session first mints a new
  // token before the retry, so a session-shaped failure actually has a
  // chance to resolve instead of looping.
  async function handleRetry() {
    setIsRetrying(true);
    try {
      const supabase = createClient();
      await supabase.auth.refreshSession();
    } catch {
      // Best-effort — if refresh itself fails, reset() below will just
      // surface whatever's still wrong (e.g. redirect to /login).
    } finally {
      reset();
      setIsRetrying(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4 h-5 w-auto" />
          <div className="bg-muted mb-2 flex size-10 items-center justify-center rounded-full">
            <AlertTriangle className="text-muted-foreground size-5" />
          </div>
          <CardTitle className="font-heading text-xl font-medium">Something went wrong</CardTitle>
          <CardDescription>
            That was a temporary hiccup loading this page — nothing you did caused it, and nothing was lost.
            Try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button type="button" onClick={handleRetry} disabled={isRetrying} className="w-full">
            {isRetrying ? "Trying again…" : "Try again"}
          </Button>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
