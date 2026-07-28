"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function isDashboardRoute(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

// GA4 measures the public marketing site and the signup funnel — never the
// authenticated app, where the page is entirely an advocate's own case
// notes and client information. @next/third-parties' <GoogleAnalytics>
// only supports next/script's default "afterInteractive" strategy, so this
// is hand-rolled with "lazyOnload" instead — Next's idle-time strategy —
// so it never competes with hydration for main-thread time on a first-time
// visitor's landing-page load. No custom events are sent from anywhere in
// the app, so GA only ever receives the page URL/title it collects by
// default, never form content.
export function DeferredGoogleAnalytics() {
  const pathname = usePathname();

  const shouldLoad =
    process.env.NODE_ENV === "production" && !!GA_MEASUREMENT_ID && !isDashboardRoute(pathname);
  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="ga-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <Script
        id="ga-loader"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}
