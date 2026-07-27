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
import { MemoryCaseSelect } from "@/components/dashboard/memory-case-select";
import { updateMemory, deleteMemory } from "@/lib/actions/memories";
import { formatDate, formatDateTime } from "@/lib/utils";
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

// Arguments/research only ever exist inside a case — there's no standalone
// view for them, so the whole point of clicking is to jump to that case.
// Memories can stand alone, so clicking one opens a quick preview (with full
// edit/delete) instead of navigating away.
function isCaseScoped(type: RecentActivityItem["type"]): boolean {
  return type === "argument" || type === "research";
}

function ActivityRow({ item, locale, timeZone }: { item: RecentActivityItem; locale: string; timeZone: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Badge variant={TYPE_VARIANT[item.type]} className="mt-0.5 shrink-0 font-normal">
        {TYPE_LABEL[item.type]}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm">{item.content}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {item.caseTitle ?? "Not linked to a case"}
        </p>
        <p className="text-muted-foreground text-xs">{formatDate(item.createdAt, locale, timeZone)}</p>
      </div>
    </div>
  );
}

export function RecentActivityPanel({
  items,
  cases,
  locale,
  timeZone,
}: {
  items: RecentActivityItem[];
  cases: { id: string; title: string }[];
  locale: string;
  timeZone: string;
}) {
  const [selected, setSelected] = useState<RecentActivityItem | null>(null);
  const [editing, setEditing] = useState(false);

  function closeDialog(open: boolean) {
    if (!open) {
      setSelected(null);
      setEditing(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-medium">Recent memory</h2>
        <Link href="/dashboard/memories" className="text-muted-foreground hover:text-foreground text-xs">
          View all
        </Link>
      </div>
      <ul className="mt-1 flex flex-col divide-y">
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            {isCaseScoped(item.type) && item.caseId ? (
              <Link
                href={`/dashboard/cases/${item.caseId}`}
                className="hover:bg-accent/50 -mx-1 block rounded-lg px-1"
              >
                <ActivityRow item={item} locale={locale} timeZone={timeZone} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelected(item);
                  setEditing(false);
                }}
                className="hover:bg-accent/50 -mx-1 block w-[calc(100%+0.5rem)] cursor-pointer rounded-lg px-1 text-left"
              >
                <ActivityRow item={item} locale={locale} timeZone={timeZone} />
              </button>
            )}
          </li>
        ))}
      </ul>

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
                <input type="hidden" name="previous_case_id" value={selected.caseId ?? ""} />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recent-memory-case">Linked case</Label>
                  <MemoryCaseSelect id="recent-memory-case" cases={cases} defaultValue={selected.caseId} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recent-memory-content">What did you learn?</Label>
                  <Textarea
                    id="recent-memory-content"
                    name="content"
                    rows={4}
                    required
                    defaultValue={selected.content}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recent-memory-tags">Tags</Label>
                  <Input
                    id="recent-memory-tags"
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
                  <div className="flex items-center gap-2">
                    <Badge variant={TYPE_VARIANT[selected.type]} className="font-normal">
                      {TYPE_LABEL[selected.type]}
                    </Badge>
                    <DialogTitle className="text-base">
                      {selected.caseTitle ?? "Not linked to a case"}
                    </DialogTitle>
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
                            <input type="hidden" name="id" value={selected.id} />
                            {selected.caseId && (
                              <input type="hidden" name="case_id" value={selected.caseId} />
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
                  {formatDateTime(selected.createdAt, locale, timeZone)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <p className="text-sm whitespace-pre-wrap">{selected.content}</p>
                {selected.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selected.tags.map((tag) => (
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
    </div>
  );
}
