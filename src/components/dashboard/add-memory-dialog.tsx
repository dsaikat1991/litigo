"use client";

import { useState } from "react";
import { AddMemoryForm } from "@/components/dashboard/add-memory-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddMemoryDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline">Add memory</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add memory</DialogTitle>
          <DialogDescription>
            A quick note — no case required. Link it to a case later if it turns out to matter.
          </DialogDescription>
        </DialogHeader>
        <AddMemoryForm onSubmit={() => setDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
