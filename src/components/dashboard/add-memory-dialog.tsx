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

export function AddMemoryDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add memory</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add memory</DialogTitle>
          <DialogDescription>
            A quick note — no case required. Link it to a case later if it turns out to matter.
          </DialogDescription>
        </DialogHeader>
        <AddMemoryForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
