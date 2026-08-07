import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { TERMS_MARKDOWN } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "Terms of Use — Litigo",
  description: "The terms that govern your access to and use of Litigo.",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Use"
      subtitle="Effective Date: August 7, 2026"
      markdown={TERMS_MARKDOWN}
    />
  );
}
