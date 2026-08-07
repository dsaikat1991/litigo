"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    redirect(`/contact?error=${encodeURIComponent("Please fill in every field.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) {
    redirect(
      `/contact?error=${encodeURIComponent("Something went wrong — try again, or email us directly.")}`,
    );
  }

  redirect("/contact?sent=1");
}
