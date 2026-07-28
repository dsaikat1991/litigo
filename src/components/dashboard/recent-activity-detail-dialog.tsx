"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MemoryCaseSelect } from "@/components/dashboard/memory-case-select";
import { updateMemory, deleteMemory } from "@/lib/actions/memories";
import { formatDateTime } from "@/lib/utils";
import type { RecentActivityItem } from "@/lib/data/dashboard";

const TYPE_LABEL: Record<RecentActivityItem["type"], string> = {
  argument: "Argument",
  research: "Research",
  lesson: "Lesson",
  strategy: "Strategy",
  memory: "Memory",
};

const TYPE_VARIANT: Record<RecentActivityItem["type"], "outline" | "verified"> = {
  argument: "outline",
  research: "outline",
  lesson: "verified",
  strategy: "outline",
  memory: "outline",
};

export function RecentActivityDetailDialog({
  item,
  cases,
  locale,
  timeZone,
  onClose,
}: {
  item: RecentActivityItem;
  cases: { id: string; title: string }[];
  locale: string;
  timeZone: string;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);

  function closeDialog(open: boolean) {
    if (!open) onClose();
  }

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        {editing ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle>Edit memory</DialogTitle>
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Close">
                    <X />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <form action={updateMemory} onSubmit={() => closeDialog(false)} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="previous_case_id" value={item.caseId ?? ""} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="recent-memory-case">Linked case</Label>
                <MemoryCaseSelect id="recent-memory-case" cases={cases} defaultValue={item.caseId} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="recent-memory-content">What did you learn?</Label>
                <Textarea
                  id="recent-memory-content"
                  name="content"
                  rows={4}
                  required
                  defaultValue={item.content}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="recent-memory-tags">Tags</Label>
                <Input
                  id="recent-memory-tags"
                  name="tags"
                  defaultValue={item.tags.join(", ")}
                  placeholder="comma-separated"
                />
              </div>
              <Button type="submit" size="sm" className="self-start">
                Save changes
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={TYPE_VARIANT[item.type]} className="font-normal">
                    {TYPE_LABEL[item.type]}
                  </Badge>
                  <DialogTitle className="text-base">{item.caseTitle ?? "Not linked to a case"}</DialogTitle>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit memory"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Delete memory">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                        <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={deleteMemory} onSubmit={() => closeDialog(false)}>
                          <input type="hidden" name="id" value={item.id} />
                          {item.caseId && <input type="hidden" name="case_id" value={item.caseId} />}
                          <AlertDialogAction type="submit" variant="destructive">
                            Delete
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Close">
                      <X />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <DialogDescription>{formatDateTime(item.createdAt, locale, timeZone)}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
