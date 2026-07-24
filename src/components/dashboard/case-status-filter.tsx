import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseStatus } from "@/lib/types";

const STATUS_FILTERS: { value: CaseStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "disposed", label: "Disposed" },
  { value: "archived", label: "Archived" },
];

export function isCaseStatus(value: string): value is CaseStatus {
  return value === "ongoing" || value === "disposed" || value === "archived";
}

export function CaseStatusFilter({
  basePath,
  q,
  status,
}: {
  basePath: string;
  q?: string;
  status?: CaseStatus;
}) {
  function buildHref(nextStatus: CaseStatus | undefined) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (nextStatus) params.set("status", nextStatus);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex items-center gap-1.5">
      {STATUS_FILTERS.map((filter) => (
        <Link
          key={filter.label}
          href={buildHref(filter.value)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            status === filter.value
              ? "border-foreground bg-foreground text-background"
              : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
