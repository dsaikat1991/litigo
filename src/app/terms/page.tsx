import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = {
  title: "Terms — Litigo",
  description: "Litigo's terms of service.",
};

export default function TermsPage() {
  return <PlaceholderPage title="Terms" />;
}
