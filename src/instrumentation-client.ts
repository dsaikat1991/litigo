import * as Sentry from "@sentry/nextjs";
import { scrubSentryEvent } from "@/lib/sentry-scrub";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // No replayIntegration and no PII: the app is full of case notes, client
  // names, and search text, and screen recordings or default user/request
  // capture would ship that straight to a third party.
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
  beforeSendTransaction: scrubSentryEvent,
  // Performance monitoring (BrowserTracing — page-load/navigation spans,
  // web-vitals collection) is off by default everywhere. It's real
  // client-side JS weight and main-thread cost the public marketing/signup
  // funnel doesn't need; error capture (this config) stays lightweight and
  // global. Tracing is turned on only inside the authenticated app — see
  // DashboardPerformanceMonitoring, which adds the integration back at
  // runtime once someone is actually in /dashboard.
  integrations: (defaults) => defaults.filter((integration) => integration.name !== "BrowserTracing"),
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
