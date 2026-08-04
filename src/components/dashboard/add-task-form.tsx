"use client";

import { useId } from "react";
import { createTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Deliberately just title + due date + priority — a true one-line capture.
// Assignee and linked hearing are set via edit after creation, not here.
export function AddTaskForm({ caseId }: { caseId: string }) {
  const uid = useId();

  return (
    <form action={createTask} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <input type="hidden" name="case_id" value={caseId} />
      <div className="flex min-w-48 flex-1 flex-col gap-2">
        <Label htmlFor={`${uid}-title`}>Task</Label>
        <Input id={`${uid}-title`} name="title" required placeholder="e.g. File rejoinder" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${uid}-due_date`}>Due date</Label>
        <Input id={`${uid}-due_date`} name="due_date" type="date" className="w-40" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${uid}-priority`}>Priority</Label>
        <Select name="priority" defaultValue="medium">
          <SelectTrigger id={`${uid}-priority`} className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="sm">
        Add task
      </Button>
    </form>
  );
}
