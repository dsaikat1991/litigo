import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { getInitials } from "@/lib/utils";
import { HeaderProfileMenu } from "@/components/dashboard/header-profile-menu";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/logo";

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
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <HeaderProfileMenu
            initials={getInitials(profile.fullName, profile.email)}
            fullName={profile.fullName}
            email={profile.email}
          />
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="w-full flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
