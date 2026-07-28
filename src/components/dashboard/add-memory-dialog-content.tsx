"use client";

import { AddMemoryForm } from "@/components/dashboard/add-memory-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Always controlled — the one shared instance mounted by AddMemoryDialogRoot.
export function AddMemoryDialogContent({
  open,
  onOpenChange,
  cases,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cases?: { id: string; title: string }[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add memory</DialogTitle>
          <DialogDescription>
            A quick note — no case required. Link it to a case later if it turns out to matter.
          </DialogDescription>
        </DialogHeader>
        <AddMemoryForm cases={cases} onSubmit={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
