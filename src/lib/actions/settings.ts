"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function isChecked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export async function updateNotificationPreferences(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      notify_7_day_in_app: isChecked(formData, "notify_7_day_in_app"),
      notify_7_day_email: isChecked(formData, "notify_7_day_email"),
      notify_3_day_in_app: isChecked(formData, "notify_3_day_in_app"),
      notify_3_day_email: isChecked(formData, "notify_3_day_email"),
      notify_1_day_in_app: isChecked(formData, "notify_1_day_in_app"),
      notify_1_day_email: isChecked(formData, "notify_1_day_email"),
      notify_same_day_in_app: isChecked(formData, "notify_same_day_in_app"),
      notify_same_day_email: isChecked(formData, "notify_same_day_email"),
    })
    .eq("id", user.id);
  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}
