import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "litigo-70",
  project: "javascript-nextjs",
  // Only uploads source maps when SENTRY_AUTH_TOKEN is set (e.g. in Vercel);
  // local builds without it just skip the upload instead of failing.
  silent: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
