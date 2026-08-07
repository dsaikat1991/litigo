import type { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { REFUND_POLICY_MARKDOWN } from "@/content/legal/refund-policy";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Litigo",
  description: "How subscription cancellations, refunds, and plan changes work for Litigo.",
};

export default function RefundPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      subtitle="Effective Date: August 7, 2026"
      markdown={REFUND_POLICY_MARKDOWN}
    />
  );
}
