import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = {
  title: "Contact — Litigo",
  description: "Get in touch with the Litigo team.",
};

export default function ContactPage() {
  return <PlaceholderPage title="Contact" />;
}
