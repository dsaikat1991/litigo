"use client";

import { useState } from "react";
import { Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseClosingReflectionDialog } from "@/components/dashboard/case-closing-reflection-dialog";

export function ReflectionBanner({ caseId, caseTitle }: { caseId: string; caseTitle: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-muted/40 flex items-start gap-3 rounded-xl border p-4">
        <Bookmark className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Preserve what this case taught you</p>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {caseTitle} was marked disposed, but no closing reflection has been added.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={() => setOpen(true)}>
              Capture lesson
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
              Not now
            </Button>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <X className="size-4" />
        </Button>
      </div>
      <CaseClosingReflectionDialog
        open={open}
        onOpenChange={setOpen}
        caseId={caseId}
        caseTitle={caseTitle}
      />
    </>
  );
}
