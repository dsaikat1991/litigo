import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { ACCEPTABLE_USE_POLICY_MARKDOWN } from "@/content/legal/acceptable-use-policy";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Litigo",
  description: "Acceptable and prohibited uses of Litigo's website, application, and services.",
};

export default function AcceptableUsePolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Acceptable Use Policy"
      subtitle="Effective Date: August 7, 2026"
      markdown={ACCEPTABLE_USE_POLICY_MARKDOWN}
    />
  );
}
