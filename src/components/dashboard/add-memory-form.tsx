"use client";

import { useId } from "react";
import { createMemory } from "@/lib/actions/memories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddMemoryForm({ caseId, onSubmit }: { caseId?: string; onSubmit?: () => void }) {
  const uid = useId();

  return (
    <form
      action={createMemory}
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border p-4"
    >
      {caseId && <input type="hidden" name="case_id" value={caseId} />}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${uid}-content`}>What did you learn?</Label>
        <Textarea
          id={`${uid}-content`}
          name="content"
          rows={3}
          required
          placeholder="e.g. Stamp duty for a gift deed between family members is different from non-family. Need to verify latest WB notification."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${uid}-tags`}>Tags</Label>
        <Input id={`${uid}-tags`} name="tags" placeholder="comma-separated" />
      </div>
      <Button type="submit" size="sm" className="self-start">
        Save memory
      </Button>
    </form>
  );
}
