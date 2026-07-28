"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { RecentActivityItem } from "@/lib/data/dashboard";

// The edit/delete dialog (Radix Dialog + AlertDialog + full form) is only
// ever needed after someone clicks a row, so it's fetched on demand instead
// of hydrating unconditionally with the rest of the dashboard.
const RecentActivityDetailDialog = dynamic(
  () => import("@/components/dashboard/recent-activity-detail-dialog").then((m) => m.RecentActivityDetailDialog),
  { ssr: false },
);

const TYPE_LABEL: Record<RecentActivityItem["type"], string> = {
  argument: "Argument",
  research: "Research",
  lesson: "Lesson",
  strategy: "Strategy",
  memory: "Memory",
};

const TYPE_VARIANT: Record<RecentActivityItem["type"], "outline" | "verified"> = {
  argument: "outline",
  research: "outline",
  lesson: "verified",
  strategy: "outline",
  memory: "outline",
};

// Arguments/research only ever exist inside a case — there's no standalone
// view for them, so the whole point of clicking is to jump to that case.
// Memories can stand alone, so clicking one opens a quick preview (with full
// edit/delete) instead of navigating away.
function isCaseScoped(type: RecentActivityItem["type"]): boolean {
  return type === "argument" || type === "research";
}

function ActivityRow({ item, locale, timeZone }: { item: RecentActivityItem; locale: string; timeZone: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Badge variant={TYPE_VARIANT[item.type]} className="mt-0.5 shrink-0 font-normal">
        {TYPE_LABEL[item.type]}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm">{item.content}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {item.caseTitle ?? "Not linked to a case"}
        </p>
        <p className="text-muted-foreground text-xs">{formatDate(item.createdAt, locale, timeZone)}</p>
      </div>
    </div>
  );
}

export function RecentActivityPanel({
  items,
  cases,
  locale,
  timeZone,
}: {
  items: RecentActivityItem[];
  cases: { id: string; title: string }[];
  locale: string;
  timeZone: string;
}) {
  const [selected, setSelected] = useState<RecentActivityItem | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Recent memory</h2>
        <Link href="/dashboard/memories" className="text-muted-foreground hover:text-foreground text-xs">
          View all
        </Link>
      </div>
      <ul className="mt-1 flex flex-col divide-y">
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            {isCaseScoped(item.type) && item.caseId ? (
              <Link
                href={`/dashboard/cases/${item.caseId}`}
                className="hover:bg-accent/50 -mx-1 block rounded-lg px-1"
              >
                <ActivityRow item={item} locale={locale} timeZone={timeZone} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="hover:bg-accent/50 -mx-1 block w-[calc(100%+0.5rem)] cursor-pointer rounded-lg px-1 text-left"
              >
                <ActivityRow item={item} locale={locale} timeZone={timeZone} />
              </button>
            )}
          </li>
        ))}
      </ul>

      {selected && (
        <RecentActivityDetailDialog
          item={selected}
          cases={cases}
          locale={locale}
          timeZone={timeZone}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
