"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { updateCase } from "@/lib/actions/cases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaseClosingReflectionDialog } from "@/components/dashboard/case-closing-reflection-dialog";
import type { Case, CaseStatus } from "@/lib/types";

const NATURE_OF_DECISION_OPTIONS = ["Judgment", "Order", "Decree", "Settlement", "Withdrawn"];

export function EditCaseDialog({ caseItem, trigger }: { caseItem: Case; trigger?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [status, setStatus] = useState<CaseStatus>(caseItem.status);

  // A case saved before "Other" existed (or before this was a select at all)
  // may already hold a nature-of-decision value outside the fixed list —
  // treat that as "Other" with its own text preserved, not silently dropped.
  const isCustomNature =
    !!caseItem.decision_nature && !NATURE_OF_DECISION_OPTIONS.includes(caseItem.decision_nature);
  const [natureSelection, setNatureSelection] = useState<string>(
    isCustomNature ? "Other" : (caseItem.decision_nature ?? ""),
  );

  // Decision fields (date decided, nature, outcome) only make sense once a
  // case has actually been decided — surfacing them for an Ongoing matter is
  // just noise. They stay visible through Archived too, since archiving
  // happens after disposal, not instead of it.
  const showDecisionSection = status !== "ongoing";

  function handleSubmit() {
    // Doesn't preventDefault — the form's own `action={updateCase}` still
    // submits normally. This just separately notices a same-submission
    // ongoing/archived -> disposed transition, so the reflection prompt can
    // follow it without waiting on (or being coupled to) that server round trip.
    if (caseItem.status !== "disposed" && status === "disposed") {
      setReflectionOpen(true);
    }
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="outline" size="icon" aria-label="Edit case">
              <Pencil />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit case</DialogTitle>
            <DialogDescription>Update the details for this matter.</DialogDescription>
          </DialogHeader>
          <form action={updateCase} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={caseItem.id} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                required
                defaultValue={caseItem.title}
                placeholder="e.g. Sharma vs. Sharma"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-case_number">Case number</Label>
                <Input id="edit-case_number" name="case_number" defaultValue={caseItem.case_number ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-case_type">Case type</Label>
                <Input
                  id="edit-case_type"
                  name="case_type"
                  defaultValue={caseItem.case_type ?? ""}
                  placeholder="e.g. Civil Suit"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-court">Court</Label>
                <Input id="edit-court" name="court" defaultValue={caseItem.court ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-parties">Parties</Label>
                <Input id="edit-parties" name="parties" defaultValue={caseItem.parties ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CaseStatus)}>
                <SelectTrigger id="edit-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {/* A plain hidden input, not Select's own name prop — status is
                  tracked in React state (it drives the Decision section's
                  visibility below), so this just mirrors that state for submission. */}
              <input type="hidden" name="status" value={status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-stage">Stage</Label>
                <Input
                  id="edit-stage"
                  name="stage"
                  defaultValue={caseItem.stage ?? ""}
                  placeholder="e.g. Evidence"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-next_hearing_date">Next hearing</Label>
                <Input
                  id="edit-next_hearing_date"
                  name="next_hearing_date"
                  type="date"
                  defaultValue={caseItem.next_hearing_date ?? ""}
                />
              </div>
            </div>
            {showDecisionSection ? (
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Decision
                </p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-decided_on">Judgement / Order date</Label>
                  <Input
                    id="edit-decided_on"
                    name="decided_on"
                    type="date"
                    defaultValue={caseItem.decided_on ?? ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-decision_nature">Nature of decision</Label>
                    <Select value={natureSelection || undefined} onValueChange={setNatureSelection}>
                      <SelectTrigger id="edit-decision_nature" className="w-full">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATURE_OF_DECISION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Controlled (to react to "Other"), so it needs its own
                        field for submission rather than Select's name prop —
                        see the conditional decision_nature input below. */}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-decision_outcome">Outcome</Label>
                    <Input
                      id="edit-decision_outcome"
                      name="decision_outcome"
                      defaultValue={caseItem.decision_outcome ?? ""}
                      placeholder="e.g. Favourable, Unfavourable"
                    />
                  </div>
                </div>
                {natureSelection === "Other" ? (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-decision_nature_other">Specify nature of decision</Label>
                    <Input
                      id="edit-decision_nature_other"
                      name="decision_nature"
                      defaultValue={isCustomNature ? (caseItem.decision_nature ?? "") : ""}
                      placeholder="e.g. Compromise decree"
                    />
                  </div>
                ) : (
                  <input type="hidden" name="decision_nature" value={natureSelection} />
                )}
              </div>
            ) : (
              <>
                <input type="hidden" name="decided_on" value={caseItem.decided_on ?? ""} />
                <input type="hidden" name="decision_nature" value={caseItem.decision_nature ?? ""} />
                <input type="hidden" name="decision_outcome" value={caseItem.decision_outcome ?? ""} />
              </>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea id="edit-summary" name="summary" rows={3} defaultValue={caseItem.summary ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                name="tags"
                defaultValue={caseItem.tags.join(", ")}
                placeholder="comma-separated, e.g. divorce, alimony"
              />
            </div>
            <Button type="submit" className="mt-2">
              Save changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CaseClosingReflectionDialog
        open={reflectionOpen}
        onOpenChange={setReflectionOpen}
        caseId={caseItem.id}
        caseTitle={caseItem.title}
      />
    </>
  );
}
