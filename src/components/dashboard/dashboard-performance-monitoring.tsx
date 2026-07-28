"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

const DASHBOARD_TRACES_SAMPLE_RATE = 0.1;

// Enhanced Sentry performance monitoring is deliberately off by default
// globally (see instrumentation-client.ts) — this component turns it on
// only once someone is inside the authenticated app, by adding the
// BrowserTracing integration at runtime rather than shipping it active
// from page one. Mounted in the dashboard layout, so it fires on every
// fresh entry into /dashboard — including a client-side navigation in
// from a marketing page — and the integration itself then handles every
// subsequent in-app client-side route change on its own.
export function DashboardPerformanceMonitoring() {
  useEffect(() => {
    const client = Sentry.getClient();
    if (!client) return;

    const options = client.getOptions();
    if (options.tracesSampleRate === DASHBOARD_TRACES_SAMPLE_RATE) return;

    options.tracesSampleRate = DASHBOARD_TRACES_SAMPLE_RATE;
    Sentry.addIntegration(Sentry.browserTracingIntegration());
  }, []);

  return null;
}
