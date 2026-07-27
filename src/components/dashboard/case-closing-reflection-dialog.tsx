"use client";

import { useId } from "react";
import { createMemory } from "@/lib/actions/memories";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Memory is freshest right when a case closes and evaporates fastest right
// after — so this asks at exactly that moment instead of relying on the
// advocate to remember to log a lesson unprompted later. Every field is
// optional and the whole thing is skippable; nothing here is required
// capture, same philosophy as the rest of the app.
export function CaseClosingReflectionDialog({
  open,
  onOpenChange,
  caseId,
  caseTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  caseTitle: string;
}) {
  const uid = useId();

  function handleSubmit(formData: FormData) {
    const worked = String(formData.get("worked") ?? "").trim();
    const different = String(formData.get("different") ?? "").trim();
    const lesson = String(formData.get("lesson") ?? "").trim();

    const sections = [
      worked && `What worked: ${worked}`,
      different && `What I'd do differently: ${different}`,
      lesson && `The one thing worth remembering: ${lesson}`,
    ].filter((s): s is string => !!s);

    onOpenChange(false);
    if (sections.length === 0) return;

    const memoryForm = new FormData();
    memoryForm.set("content", sections.join("\n\n"));
    memoryForm.set("case_id", caseId);
    memoryForm.set("tags", "lesson");
    createMemory(memoryForm);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{caseTitle} is closed. Worth remembering anything?</DialogTitle>
          <DialogDescription>
            Skip whatever doesn&apos;t apply — even one line is worth keeping.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-worked`}>What worked?</Label>
            <Textarea id={`${uid}-worked`} name="worked" rows={2} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-different`}>What would you do differently?</Label>
            <Textarea id={`${uid}-different`} name="different" rows={2} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-lesson`}>The one thing worth remembering?</Label>
            <Textarea id={`${uid}-lesson`} name="lesson" rows={2} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Skip for now
            </Button>
            <Button type="submit">Save reflection</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
