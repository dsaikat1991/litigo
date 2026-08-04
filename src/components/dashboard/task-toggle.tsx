"use client";

import { Square, SquareCheck } from "lucide-react";
import { toggleTask } from "@/lib/actions/tasks";
import type { Task } from "@/lib/types";

export function TaskToggle({ task }: { task: Task }) {
  return (
    <form action={toggleTask}>
      <input type="hidden" name="id" value={task.id} />
      <input type="hidden" name="case_id" value={task.case_id} />
      <input type="hidden" name="is_done" value={String(!task.is_done)} />
      <button
        type="submit"
        className="hover:bg-accent/50 flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-sm"
      >
        {task.is_done ? (
          <SquareCheck className="text-verified size-4 shrink-0" />
        ) : (
          <Square className="text-muted-foreground size-4 shrink-0" />
        )}
        <span className={task.is_done ? "text-muted-foreground line-through" : ""}>{task.title}</span>
      </button>
    </form>
  );
}
