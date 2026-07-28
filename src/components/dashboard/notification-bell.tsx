"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/actions/case-events";
import { formatDate } from "@/lib/utils";
import type { NotificationSchedule } from "@/lib/types";

// Content deliberately differs by how far out the hearing is — mirrors the
// email copy in src/app/api/cron/notifications/route.ts.
const TIMING_LABEL: Record<NotificationSchedule["timing"], string> = {
  "7_day": "Begin preparation",
  "3_day": "Check tasks and documents",
  "1_day": "Final readiness",
  same_day: "Hearing today",
};

export function NotificationBell({
  notifications,
  locale,
  timeZone,
}: {
  notifications: NotificationSchedule[];
  locale: string;
  timeZone: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function openNotification(notification: NotificationSchedule) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", notification.id);
      await markNotificationRead(formData);
    });
    router.push(`/dashboard/cases/${notification.case_id}`);
  }

  function markAll() {
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }

  return (
    // modal={false}: Radix's default (modal) scroll-lock wraps content in
    // RemoveScroll, which computes its own scrollbar-compensation padding —
    // that double-counts against the app's own `scrollbar-gutter: stable`
    // (globals.css) and visibly shifts the page open/close. A dropdown menu
    // doesn't need scroll-locking the way a true modal Dialog does.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell />
          {notifications.length > 0 && (
            <span className="bg-verified text-background absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 font-medium">Notifications</DropdownMenuLabel>
          {notifications.length > 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={markAll}
              className="text-verified text-xs font-medium hover:underline disabled:opacity-50"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">You&apos;re all caught up.</p>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onSelect={() => openNotification(notification)}
              className="flex flex-col items-start gap-0.5 whitespace-normal"
            >
              <div className="flex w-full items-center gap-1.5">
                <CalendarClock className="text-muted-foreground size-3.5 shrink-0" />
                <span className="text-sm font-medium">{TIMING_LABEL[notification.timing]}</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {notification.case?.title ?? "Case"} · {formatDate(notification.hearing_date, locale, timeZone)}
              </span>
              {notification.timing === "same_day" && (
                <span className="text-verified text-xs font-medium">Record hearing outcome →</span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
