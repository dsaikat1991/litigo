"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ListChecks } from "lucide-react";
import type { TodaysFocusItem } from "@/lib/data/dashboard";

// Auto-hides when there's nothing to surface — same convention as the
// attention alerts this replaces (see the now-unused attention-panel.tsx).
// Collapsible (client component, needed for the open/closed state); starts
// open since these are meant to be seen, not something to dig for.
export function TodaysFocus({ items }: { items: TodaysFocusItem[] }) {
  const [open, setOpen] = useState(true);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="hover:bg-accent/50 flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <ListChecks className="text-muted-foreground size-4" />
          <h2 className="text-sm font-medium">Today&apos;s Focus</h2>
          <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[11px] font-medium">
            {items.length}
          </span>
        </div>
        <ChevronDown
          className={`text-muted-foreground size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="border-border flex flex-col gap-0.5 border-t p-2">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="hover:bg-accent/50 flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm"
              >
                <span aria-hidden="true" className="bg-muted-foreground/50 size-1.5 shrink-0 rounded-full" />
                <span className="flex-1">{item.message}</span>
                <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
