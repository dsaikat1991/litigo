"use client";

import { useId, useState } from "react";
import { Pencil } from "lucide-react";
import { updateResearchNote } from "@/lib/actions/notes";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ResearchNote } from "@/lib/types";

export function EditResearchNoteDialog({ note }: { note: ResearchNote }) {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit research note">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit research note</DialogTitle>
        </DialogHeader>
        <form
          action={updateResearchNote}
          onSubmit={() => setOpen(false)}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="id" value={note.id} />
          <input type="hidden" name="case_id" value={note.case_id} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-source_type`}>Source type</Label>
              <Select name="source_type" defaultValue={note.source_type ?? undefined}>
                <SelectTrigger id={`${uid}-source_type`}>
                  <SelectValue placeholder="Other" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="statute">Statute</SelectItem>
                  <SelectItem value="judgment">Judgment</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-citation`}>Citation</Label>
              <Input
                id={`${uid}-citation`}
                name="citation"
                defaultValue={note.citation ?? ""}
                placeholder="e.g. Section 144, CrPC"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-content`}>Notes</Label>
            <Textarea id={`${uid}-content`} name="content" rows={3} required defaultValue={note.content} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-tags`}>Tags</Label>
            <Input id={`${uid}-tags`} name="tags" defaultValue={note.tags.join(", ")} placeholder="comma-separated" />
          </div>
          <Button type="submit" size="sm" className="self-start">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
