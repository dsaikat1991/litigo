"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const AddMemoryDialogContent = dynamic(
  () => import("@/components/dashboard/add-memory-dialog-content").then((m) => m.AddMemoryDialogContent),
  { ssr: false },
);

const AddMemoryDialogCtx = createContext<(() => void) | null>(null);

export function useOpenAddMemoryDialog(): () => void {
  const openDialog = useContext(AddMemoryDialogCtx);
  if (!openDialog) throw new Error("useOpenAddMemoryDialog must be used within AddMemoryDialogRoot");
  return openDialog;
}

// Same pattern as NewCaseDialogRoot: every "Add memory" entry point on a
// page shares this one provider and one lazily-mounted dialog instance,
// instead of each trigger mounting its own <Dialog> + form.
export function AddMemoryDialogRoot({
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
    <AddMemoryDialogCtx.Provider value={openDialog}>
      {children}
      {hasOpened && <AddMemoryDialogContent open={open} onOpenChange={setOpen} cases={cases} />}
    </AddMemoryDialogCtx.Provider>
  );
}
