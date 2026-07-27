import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The authenticated app isn't content to index, and there's no value
      // in a crawler wasting budget on account-scoped pages it can't see
      // past the login redirect anyway.
      disallow: ["/dashboard", "/onboarding", "/reset-password"],
    },
    sitemap: "https://mylitigo.com/sitemap.xml",
  };
}
