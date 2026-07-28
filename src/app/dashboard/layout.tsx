import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { getDueInAppNotifications } from "@/lib/data/case-events";
import { getInitials } from "@/lib/utils";
import { DashboardPerformanceMonitoring } from "@/components/dashboard/dashboard-performance-monitoring";
import { HeaderProfileMenu } from "@/components/dashboard/header-profile-menu";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const locale = profile.locale ?? "en-IN";
  const timeZone = profile.timezone ?? "Asia/Kolkata";
  const notifications = await getDueInAppNotifications(timeZone);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DashboardPerformanceMonitoring />
      <header className="border-b">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <NotificationBell notifications={notifications} locale={locale} timeZone={timeZone} />
            <HeaderProfileMenu
              initials={getInitials(profile.fullName, profile.email)}
              fullName={profile.fullName}
              email={profile.email}
            />
          </div>
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
