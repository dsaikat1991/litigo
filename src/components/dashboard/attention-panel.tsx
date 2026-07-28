import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import type { AttentionAlert } from "@/lib/data/dashboard";

export function AttentionPanel({ alerts }: { alerts: AttentionAlert[] }) {
  if (alerts.length === 0) return null;
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <Bell className="text-muted-foreground size-4" />
        <h2 className="text-sm font-medium">Needs your attention</h2>
      </div>
      <ul className="mt-2 flex flex-col">
        {alerts.map((alert) => (
          <li key={alert.key}>
            <Link
              href={alert.href}
              className="hover:bg-accent/50 flex items-center gap-2.5 rounded-lg px-1 py-2 text-sm"
            >
              <span className="flex-1">{alert.message}</span>
              <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
