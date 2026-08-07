import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { PRIVACY_MARKDOWN } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — Litigo",
  description: "How Litigo collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Last Updated: August 7, 2026"
      markdown={PRIVACY_MARKDOWN}
    />
  );
}
