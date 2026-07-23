"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatDateTime, previewText } from "@/lib/utils";
import type { Memory } from "@/lib/types";

export function MemoryList({
  memories,
  showCaseLink = false,
  emptyLabel = "No memories yet.",
  locale,
  timeZone,
}: {
  memories: Memory[];
  showCaseLink?: boolean;
  emptyLabel?: string;
  locale: string;
  timeZone: string;
}) {
  const [selected, setSelected] = useState<Memory | null>(null);

  if (memories.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {memories.map((memory) => (
          <button
            key={memory.id}
            type="button"
            onClick={() => setSelected(memory)}
            className="flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{previewText(memory.content)}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(memory.created_at, locale, timeZone)}
              </span>
            </div>
            {(memory.tags.length > 0 || (showCaseLink && memory.case_id && memory.case)) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
                {showCaseLink && memory.case_id && memory.case && (
                  <Link
                    href={`/dashboard/cases/${memory.case_id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="verified" className="font-normal">
                      {memory.case.title}
                    </Badge>
                  </Link>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Memory</DialogTitle>
            {selected && (
              <DialogDescription>
                {formatDateTime(selected.created_at, locale, timeZone)}
              </DialogDescription>
            )}
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-3">
              <p className="text-sm whitespace-pre-wrap">{selected.content}</p>
              {(selected.tags.length > 0 || (selected.case_id && selected.case)) && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                  {selected.case_id && selected.case && (
                    <Link href={`/dashboard/cases/${selected.case_id}`}>
                      <Badge variant="verified" className="font-normal">
                        {selected.case.title}
                      </Badge>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
