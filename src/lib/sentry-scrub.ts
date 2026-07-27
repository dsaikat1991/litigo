interface ScrubableEvent {
  user?: unknown;
  request?: {
    data?: unknown;
    cookies?: unknown;
    headers?: unknown;
    query_string?: unknown;
    url?: string;
  };
  breadcrumbs?: Array<{
    category?: string;
    data?: Record<string, unknown>;
  }>;
}

// Litigo events can pass through routes carrying case notes, client names,
// search text, and auth cookies. Sentry's defaults (sendDefaultPii, request
// bodies/headers, breadcrumb data) would happily ship all of that off to a
// third party, so every event is stripped down to error shape + safe
// metadata before it ever leaves the process — never legal content, never
// credentials.
export function scrubSentryEvent<T extends ScrubableEvent>(event: T): T {
  delete event.user;

  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    if (event.request.url) {
      event.request.url = event.request.url.split("?")[0];
    }
  }

  event.breadcrumbs = event.breadcrumbs
    ?.filter((crumb) => crumb.category !== "console")
    .map((crumb) => {
      if (crumb.category === "fetch" || crumb.category === "xhr") {
        const { url, method, status_code } = (crumb.data ?? {}) as Record<string, unknown>;
        return {
          ...crumb,
          data: {
            url: typeof url === "string" ? url.split("?")[0] : undefined,
            method,
            status_code,
          },
        };
      }
      return crumb;
    });

  return event;
}
