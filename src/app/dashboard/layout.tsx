import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { getInitials } from "@/lib/utils";
import { HeaderProfileMenu } from "@/components/dashboard/header-profile-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="font-heading text-sm font-medium tracking-[0.15em] uppercase"
          >
            Litigo
          </Link>
          <HeaderProfileMenu
            initials={getInitials(profile.fullName, profile.email)}
            fullName={profile.fullName}
            email={profile.email}
          />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
