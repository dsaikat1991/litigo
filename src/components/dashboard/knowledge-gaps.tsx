import Link from "next/link";
import type { KnowledgeGapItem } from "@/lib/data/dashboard";

// Auto-hides when there's nothing to surface — same convention as
// TodaysFocus.
export function KnowledgeGaps({ items }: { items: KnowledgeGapItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-x p-4">
      <h3 className="text-sm font-medium">Knowledge Waiting to be Captured</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.key} className="flex flex-col gap-0.5">
            <p className="text-muted-foreground text-sm">{item.message}</p>
            <Link href={item.href} className="hover:text-foreground flex items-center gap-1 text-sm font-medium">
              {item.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
