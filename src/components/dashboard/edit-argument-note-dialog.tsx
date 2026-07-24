"use client";

import { useId, useState } from "react";
import { Pencil } from "lucide-react";
import { updateArgumentNote } from "@/lib/actions/notes";
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
import type { ArgumentNote } from "@/lib/types";

export function EditArgumentNoteDialog({ note }: { note: ArgumentNote }) {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Edit argument">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit argument</DialogTitle>
        </DialogHeader>
        <form
          action={updateArgumentNote}
          onSubmit={() => setOpen(false)}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="id" value={note.id} />
          <input type="hidden" name="case_id" value={note.case_id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-issue`}>Issue</Label>
            <Input
              id={`${uid}-issue`}
              name="issue"
              defaultValue={note.issue ?? ""}
              placeholder="e.g. Limitation under Article 54"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-content`}>Argument</Label>
            <Textarea id={`${uid}-content`} name="content" rows={3} required defaultValue={note.content} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-outcome`}>Outcome</Label>
              <Select name="outcome" defaultValue={note.outcome ?? undefined}>
                <SelectTrigger id={`${uid}-outcome`}>
                  <SelectValue placeholder="Untested" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worked">Worked</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="untested">Untested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-tags`}>Tags</Label>
              <Input id={`${uid}-tags`} name="tags" defaultValue={note.tags.join(", ")} placeholder="comma-separated" />
            </div>
          </div>
          <Button type="submit" size="sm" className="self-start">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
