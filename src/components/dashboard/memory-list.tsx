"use client";

import { useState } from "react";
import Link from "next/link";
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
import { updateMemory, deleteMemory } from "@/lib/actions/memories";
import { formatDate, formatDateTime, previewText } from "@/lib/utils";
import type { Memory } from "@/lib/types";

export function MemoryList({
  memories,
  showCaseLink = false,
  emptyLabel = "No memories yet.",
  locale,
  timeZone,
}: {
  memories: Memory[];
  showCaseLink?: boolean;
  emptyLabel?: string;
  locale: string;
  timeZone: string;
}) {
  const [selected, setSelected] = useState<Memory | null>(null);
  const [editing, setEditing] = useState(false);

  function closeDialog(open: boolean) {
    if (!open) {
      setSelected(null);
      setEditing(false);
    }
  }

  if (memories.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {memories.map((memory) => (
          <button
            key={memory.id}
            type="button"
            onClick={() => {
              setSelected(memory);
              setEditing(false);
            }}
            className="flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{previewText(memory.content)}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(memory.created_at, locale, timeZone)}
              </span>
            </div>
            {(memory.tags.length > 0 || (showCaseLink && memory.case_id && memory.case)) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
                {showCaseLink && memory.case_id && memory.case && (
                  <Link
                    href={`/dashboard/cases/${memory.case_id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="verified" className="font-normal">
                      {memory.case.title}
                    </Badge>
                  </Link>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-lg" showCloseButton={false}>
          {selected && editing && (
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
              <form
                action={updateMemory}
                onSubmit={() => closeDialog(false)}
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="id" value={selected.id} />
                {selected.case_id && <input type="hidden" name="case_id" value={selected.case_id} />}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-memory-content">What did you learn?</Label>
                  <Textarea
                    id="edit-memory-content"
                    name="content"
                    rows={4}
                    required
                    defaultValue={selected.content}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-memory-tags">Tags</Label>
                  <Input
                    id="edit-memory-tags"
                    name="tags"
                    defaultValue={selected.tags.join(", ")}
                    placeholder="comma-separated"
                  />
                </div>
                <Button type="submit" size="sm" className="self-start">
                  Save changes
                </Button>
              </form>
            </>
          )}

          {selected && !editing && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-2">
                  <DialogTitle>Memory</DialogTitle>
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
                            <input type="hidden" name="id" value={selected.id} />
                            {selected.case_id && (
                              <input type="hidden" name="case_id" value={selected.case_id} />
                            )}
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
                <DialogDescription>
                  {formatDateTime(selected.created_at, locale, timeZone)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <p className="text-sm whitespace-pre-wrap">{selected.content}</p>
                {(selected.tags.length > 0 || (selected.case_id && selected.case)) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                    {selected.case_id && selected.case && (
                      <Link href={`/dashboard/cases/${selected.case_id}`}>
                        <Badge variant="verified" className="font-normal">
                          {selected.case.title}
                        </Badge>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
