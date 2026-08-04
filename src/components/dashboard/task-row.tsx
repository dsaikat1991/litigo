"use client";

import { Square, SquareCheck, Trash2 } from "lucide-react";
import { deleteTask, toggleTask } from "@/lib/actions/tasks";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { EditTaskDialog } from "@/components/dashboard/edit-task-dialog";

export function TaskRow({
  task,
  overdue,
  locale,
  timeZone,
  hearingOptions,
}: {
  task: Task;
  overdue: boolean;
  locale: string;
  timeZone: string;
  hearingOptions: { id: string; label: string }[];
}) {
  const linkedHearing = task.event_id ? hearingOptions.find((h) => h.id === task.event_id) : undefined;

  return (
    <li className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-start gap-2">
        <form action={toggleTask} className="mt-0.5 shrink-0">
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="case_id" value={task.case_id} />
          <input type="hidden" name="is_done" value={String(!task.is_done)} />
          <button type="submit" aria-label={task.is_done ? "Mark task incomplete" : "Mark task complete"}>
            {task.is_done ? (
              <SquareCheck className="text-verified size-4" />
            ) : (
              <Square className="text-muted-foreground size-4" />
            )}
          </button>
        </form>
        <div className="flex min-w-0 flex-col gap-1">
          <EditTaskDialog
            task={task}
            hearingOptions={hearingOptions}
            trigger={
              <button
                type="button"
                className={`truncate text-left text-sm font-medium hover:underline ${task.is_done ? "text-muted-foreground line-through" : ""}`}
              >
                {task.title}
              </button>
            }
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {task.due_date && (
              <span className={`text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                Due {formatDate(task.due_date, locale, timeZone)}
              </span>
            )}
            <Badge variant={task.priority === "high" ? "destructive" : "outline"} className="font-normal capitalize">
              {task.priority}
            </Badge>
            {task.assignee && (
              <span className="text-muted-foreground text-xs">{task.assignee}</span>
            )}
            {linkedHearing && (
              <span className="text-muted-foreground text-xs">{linkedHearing.label}</span>
            )}
          </div>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Delete task" className="text-muted-foreground shrink-0">
            <Trash2 className="size-3.5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{task.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="case_id" value={task.case_id} />
              <AlertDialogAction type="submit" variant="destructive">
                Delete task
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
