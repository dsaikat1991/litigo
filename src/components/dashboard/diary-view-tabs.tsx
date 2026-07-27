import Link from "next/link";
import { cn } from "@/lib/utils";

export type DiaryView = "today" | "week" | "month" | "past";

const VIEWS: { value: DiaryView; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Next 7 Days" },
  { value: "month", label: "This Month" },
  { value: "past", label: "Past Hearings" },
];

export function isDiaryView(value: string | undefined): value is DiaryView {
  return value === "today" || value === "week" || value === "month" || value === "past";
}

export function DiaryViewTabs({ view }: { view: DiaryView }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {VIEWS.map((tab) => (
        <Link
          key={tab.value}
          href={`/dashboard/diary?view=${tab.value}`}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            view === tab.value
              ? "border-foreground bg-foreground text-background"
              : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
