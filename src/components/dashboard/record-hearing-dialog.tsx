"use client";

import { useId, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { recordHearing } from "@/lib/actions/case-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CASE_EVENT_TYPES, CASE_EVENT_TYPE_LABELS } from "@/lib/case-event-meta";

function todayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function RecordHearingDialog({
  caseId,
  caseTitle,
  triggerLabel = "Record hearing",
  triggerVariant = "outline",
}: {
  caseId: string;
  caseTitle: string;
  triggerLabel?: string;
  triggerVariant?: "outline" | "default";
}) {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} size="sm">
          <CalendarPlus />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record hearing — {caseTitle}</DialogTitle>
          <DialogDescription>
            This becomes a permanent timeline entry and updates the case&apos;s next hearing.
          </DialogDescription>
        </DialogHeader>
        <form action={recordHearing} onSubmit={() => setOpen(false)} className="flex flex-col gap-4">
          <input type="hidden" name="case_id" value={caseId} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-event_type`}>Event type</Label>
              <Select name="event_type" defaultValue="hearing">
                <SelectTrigger id={`${uid}-event_type`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CASE_EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CASE_EVENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-event_date`}>Date</Label>
              <Input id={`${uid}-event_date`} name="event_date" type="date" required defaultValue={todayKey()} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-title`}>Title</Label>
            <Input
              id={`${uid}-title`}
              name="title"
              required
              placeholder="e.g. Evidence hearing — PW1 cross-examined"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-stage`}>Stage</Label>
              <Input id={`${uid}-stage`} name="stage" placeholder="e.g. Evidence" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-hearing_purpose`}>Hearing purpose</Label>
              <Input id={`${uid}-hearing_purpose`} name="hearing_purpose" placeholder="e.g. Framing of issues" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-description`}>What occurred</Label>
            <Textarea id={`${uid}-description`} name="description" rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-arguments_made`}>Arguments made</Label>
            <Textarea id={`${uid}-arguments_made`} name="arguments_made" rows={2} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-court_direction`}>Court direction</Label>
            <Textarea id={`${uid}-court_direction`} name="court_direction" rows={2} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-documents`}>Documents filed</Label>
            <Textarea
              id={`${uid}-documents`}
              name="documents"
              rows={2}
              placeholder={"One per line, e.g.\nRejoinder\nMedical records"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-tasks`}>Tasks before next hearing</Label>
            <Textarea
              id={`${uid}-tasks`}
              name="tasks"
              rows={2}
              placeholder={"One per line, e.g.\nPrepare witness list\nCollect certified copy of order"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-next_hearing_date`}>Next hearing date</Label>
              <Input id={`${uid}-next_hearing_date`} name="next_hearing_date" type="date" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${uid}-next_hearing_purpose`}>Next hearing purpose</Label>
              <Input id={`${uid}-next_hearing_purpose`} name="next_hearing_purpose" placeholder="e.g. Arguments" />
            </div>
          </div>
          <Button type="submit" className="mt-2">
            Save hearing
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
