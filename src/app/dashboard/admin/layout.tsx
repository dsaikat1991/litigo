import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";

// The real security boundary for every /dashboard/admin/* route — the
// sidebar link is nav-visibility only, so a non-admin typing the URL
// directly still gets bounced here regardless of what they can see.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.isAdmin) redirect("/dashboard");

  return <>{children}</>;
}
