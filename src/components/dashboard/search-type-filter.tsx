import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SearchResultType } from "@/lib/data/search";

const TYPE_FILTERS: { value: SearchResultType | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "case", label: "Cases" },
  { value: "memory", label: "Memories" },
  { value: "argument", label: "Arguments" },
  { value: "research", label: "Research" },
  { value: "document", label: "Documents" },
];

export function SearchTypeFilter({ q, type }: { q?: string; type?: SearchResultType }) {
  function buildHref(next: SearchResultType | undefined) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (next) params.set("type", next);
    const qs = params.toString();
    return qs ? `/dashboard/search?${qs}` : "/dashboard/search";
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TYPE_FILTERS.map((f) => (
        <Link
          key={f.label}
          href={buildHref(f.value)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            type === f.value
              ? "border-foreground bg-foreground text-background"
              : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
