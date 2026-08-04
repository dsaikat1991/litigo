"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NotificationPreferences, NotificationTiming } from "@/lib/types";
import { cn } from "@/lib/utils";

const TIMING_ROWS: { timing: NotificationTiming; label: string }[] = [
  { timing: "7_day", label: "7 days before" },
  { timing: "3_day", label: "3 days before" },
  { timing: "1_day", label: "1 day before" },
  { timing: "same_day", label: "Same day" },
];

// The grid stays mounted (just visually hidden) rather than unmounting on
// collapse — checkboxes not present in the DOM don't get submitted with the
// form, so unmounting here would silently clear every hidden preference on
// save.
export function NotificationPreferencesGrid({ prefs }: { prefs: NotificationPreferences }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="hover:text-foreground flex w-full items-center justify-between gap-1 text-left"
        >
          <h2 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Notifications</h2>
          <ChevronDown
            className={cn("text-muted-foreground size-4 shrink-0 transition-transform", open && "rotate-180")}
          />
        </button>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose which hearing reminders you want, and how you want them.
        </p>
      </div>
      <div
        className={cn(
          "grid grid-cols-[1fr_auto_auto] items-center gap-x-6 gap-y-3 border-t pt-3",
          !open && "hidden",
        )}
      >
        <span />
        <span className="text-muted-foreground text-xs font-medium">In-app</span>
        <span className="text-muted-foreground text-xs font-medium">Email</span>
        {TIMING_ROWS.map(({ timing, label }) => (
          <Fragment key={timing}>
            <span className="text-sm">{label}</span>
            <input
              type="checkbox"
              name={`notify_${timing}_in_app`}
              defaultChecked={prefs[timing].in_app}
              className="accent-foreground size-4 justify-self-center"
              aria-label={`${label}, in-app`}
            />
            <input
              type="checkbox"
              name={`notify_${timing}_email`}
              defaultChecked={prefs[timing].email}
              className="accent-foreground size-4 justify-self-center"
              aria-label={`${label}, email`}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
}
