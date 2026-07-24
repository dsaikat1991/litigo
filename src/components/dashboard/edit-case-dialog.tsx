"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateCase } from "@/lib/actions/cases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Case } from "@/lib/types";

export function EditCaseDialog({ caseItem }: { caseItem: Case }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Edit case">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit case</DialogTitle>
          <DialogDescription>Update the details for this matter.</DialogDescription>
        </DialogHeader>
        <form
          action={updateCase}
          onSubmit={() => setOpen(false)}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={caseItem.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              name="title"
              required
              defaultValue={caseItem.title}
              placeholder="e.g. Sharma vs. Sharma"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-case_number">Case number</Label>
              <Input id="edit-case_number" name="case_number" defaultValue={caseItem.case_number ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-case_type">Case type</Label>
              <Input
                id="edit-case_type"
                name="case_type"
                defaultValue={caseItem.case_type ?? ""}
                placeholder="e.g. Civil Suit"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-court">Court</Label>
              <Input id="edit-court" name="court" defaultValue={caseItem.court ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-parties">Parties</Label>
              <Input id="edit-parties" name="parties" defaultValue={caseItem.parties ?? ""} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select name="status" defaultValue={caseItem.status}>
              <SelectTrigger id="edit-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-summary">Summary</Label>
            <Textarea id="edit-summary" name="summary" rows={3} defaultValue={caseItem.summary ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              name="tags"
              defaultValue={caseItem.tags.join(", ")}
              placeholder="comma-separated, e.g. divorce, alimony"
            />
          </div>
          <Button type="submit" className="mt-2">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
