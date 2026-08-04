"use client";

import { UploadDocumentForm } from "@/components/dashboard/upload-document-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Always controlled — the one shared instance mounted by UploadDocumentDialogRoot.
export function UploadDocumentDialogContent({
  open,
  onOpenChange,
  cases,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cases?: { id: string; title: string }[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            PDF, Word, image, or text — up to 20MB. Link it to a case now or leave it unlinked.
          </DialogDescription>
        </DialogHeader>
        <UploadDocumentForm cases={cases} onSubmit={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
