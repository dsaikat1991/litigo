"use client";

import { useId, useState } from "react";
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

export function NewCaseDialog({
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
  const uid = useId();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>New case</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New case</DialogTitle>
          <DialogDescription>
            Add the basics now — you can add arguments and research later.
          </DialogDescription>
        </DialogHeader>
        <form action={createCase} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-title`}>Title</Label>
            <Input id={`${uid}-title`} name="title" required placeholder="e.g. Sharma vs. Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-case_number`}>Case number</Label>
              <Input id={`${uid}-case_number`} name="case_number" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-case_type`}>Case type</Label>
              <Input id={`${uid}-case_type`} name="case_type" placeholder="e.g. Civil Suit" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-court`}>Court</Label>
              <Input id={`${uid}-court`} name="court" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-parties`}>Parties</Label>
              <Input id={`${uid}-parties`} name="parties" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-summary`}>Summary</Label>
            <Textarea id={`${uid}-summary`} name="summary" rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-tags`}>Tags</Label>
            <Input id={`${uid}-tags`} name="tags" placeholder="comma-separated, e.g. divorce, alimony" />
          </div>
          <Button type="submit" className="mt-2">
            Create case
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
