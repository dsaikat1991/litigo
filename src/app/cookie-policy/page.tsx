import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { COOKIE_POLICY_MARKDOWN } from "@/content/legal/cookie-policy";

export const metadata: Metadata = {
  title: "Cookie Policy — Litigo",
  description: "How Litigo uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Cookie Policy"
      subtitle="Last Updated: August 7, 2026"
      markdown={COOKIE_POLICY_MARKDOWN}
    />
  );
}
