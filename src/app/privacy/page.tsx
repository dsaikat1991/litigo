import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = {
  title: "Privacy — Litigo",
  description: "How Litigo handles your data.",
};

export default function PrivacyPage() {
  return <PlaceholderPage title="Privacy" />;
}
