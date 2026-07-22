"use client";

import { useState } from "react";
import { createCase } from "@/lib/actions/cases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewCaseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New case</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New case</DialogTitle>
          <DialogDescription>
            Add the basics now — you can add arguments and research later.
          </DialogDescription>
        </DialogHeader>
        <form action={createCase} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Sharma vs. Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="case_number">Case number</Label>
              <Input id="case_number" name="case_number" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="case_type">Case type</Label>
              <Input id="case_type" name="case_type" placeholder="e.g. Civil Suit" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="court">Court</Label>
              <Input id="court" name="court" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="parties">Parties</Label>
              <Input id="parties" name="parties" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" name="summary" rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" name="tags" placeholder="comma-separated, e.g. divorce, alimony" />
          </div>
          <Button type="submit" className="mt-2">
            Create case
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
