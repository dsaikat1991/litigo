"use client";

import type { ComponentProps } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOpenUploadDocumentDialog } from "@/components/dashboard/upload-document-dialog-root";

export function UploadDocumentTriggerButton({
  children = "Upload document",
  variant = "outline",
  ...props
}: Partial<ComponentProps<typeof Button>>) {
  const openDialog = useOpenUploadDocumentDialog();
  return (
    <Button type="button" variant={variant} onClick={openDialog} {...props}>
      <UploadCloud />
      {children}
    </Button>
  );
}
