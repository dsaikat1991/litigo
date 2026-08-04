"use client";

import { useId } from "react";
import { uploadDocument } from "@/lib/actions/documents";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MemoryCaseSelect } from "@/components/dashboard/memory-case-select";

export function UploadDocumentForm({
  caseId,
  cases,
  onSubmit,
}: {
  caseId?: string;
  cases?: { id: string; title: string }[];
  onSubmit?: () => void;
}) {
  const uid = useId();

  return (
    <form action={uploadDocument} onSubmit={onSubmit} className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${uid}-file`}>File</Label>
        <input
          id={`${uid}-file`}
          name="file"
          type="file"
          required
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          className="text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
      </div>
      {caseId ? (
        <input type="hidden" name="case_id" value={caseId} />
      ) : (
        cases &&
        cases.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${uid}-case_id`}>Link to a case</Label>
            <MemoryCaseSelect id={`${uid}-case_id`} cases={cases} />
          </div>
        )
      )}
      <Button type="submit" size="sm" className="self-start">
        Upload
      </Button>
    </form>
  );
}
