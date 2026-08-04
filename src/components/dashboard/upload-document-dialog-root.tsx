"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const UploadDocumentDialogContent = dynamic(
  () =>
    import("@/components/dashboard/upload-document-dialog-content").then(
      (m) => m.UploadDocumentDialogContent,
    ),
  { ssr: false },
);

const UploadDocumentDialogCtx = createContext<(() => void) | null>(null);

export function useOpenUploadDocumentDialog(): () => void {
  const openDialog = useContext(UploadDocumentDialogCtx);
  if (!openDialog) throw new Error("useOpenUploadDocumentDialog must be used within UploadDocumentDialogRoot");
  return openDialog;
}

// Same pattern as AddMemoryDialogRoot: every "Upload document" entry point on
// a page shares this one provider and one lazily-mounted dialog instance.
export function UploadDocumentDialogRoot({
  cases,
  children,
}: {
  cases?: { id: string; title: string }[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openDialog = useCallback(() => {
    setHasOpened(true);
    setOpen(true);
  }, []);

  return (
    <UploadDocumentDialogCtx.Provider value={openDialog}>
      {children}
      {hasOpened && <UploadDocumentDialogContent open={open} onOpenChange={setOpen} cases={cases} />}
    </UploadDocumentDialogCtx.Provider>
  );
}
