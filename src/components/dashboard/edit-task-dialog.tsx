"use client";

import { useId, useState, type ReactNode } from "react";
import { updateTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Task } from "@/lib/types";

export function EditTaskDialog({
  task,
  hearingOptions,
  trigger,
}: {
  task: Task;
  hearingOptions: { id: string; label: string }[];
  trigger: ReactNode;
}) {
  const uid = useId();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Update the details for this task.</DialogDescription>
        </DialogHeader>
        <form action={updateTask} onSubmit={() => setOpen(false)} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="case_id" value={task.case_id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-title`}>Task</Label>
            <Input id={`${uid}-title`} name="title" required defaultValue={task.title} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-due_date`}>Due date</Label>
              <Input id={`${uid}-due_date`} name="due_date" type="date" defaultValue={task.due_date ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-priority`}>Priority</Label>
              <Select name="priority" defaultValue={task.priority}>
                <SelectTrigger id={`${uid}-priority`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-assignee`}>Assignee</Label>
            <Input
              id={`${uid}-assignee`}
              name="assignee"
              defaultValue={task.assignee ?? ""}
              placeholder="e.g. yourself, or a junior's name"
            />
          </div>
          {hearingOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-event_id`}>Linked hearing</Label>
              <Select name="event_id" defaultValue={task.event_id ?? "none"}>
                <SelectTrigger id={`${uid}-event_id`} className="w-full">
                  <SelectValue placeholder="No linked hearing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked hearing</SelectItem>
                  {hearingOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="mt-2">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
