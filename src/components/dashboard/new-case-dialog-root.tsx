"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const NewCaseDialogContent = dynamic(
  () => import("@/components/dashboard/new-case-dialog-content").then((m) => m.NewCaseDialogContent),
  { ssr: false },
);

const NewCaseDialogCtx = createContext<(() => void) | null>(null);

export function useOpenNewCaseDialog(): () => void {
  const openDialog = useContext(NewCaseDialogCtx);
  if (!openDialog) throw new Error("useOpenNewCaseDialog must be used within NewCaseDialogRoot");
  return openDialog;
}

// Every "New case" entry point on a page (header button, empty-state action,
// command palette) shares this one provider instead of each mounting its
// own <Dialog> + form — previously two or three separate instances of the
// same Radix Dialog + form were hydrating simultaneously on one page for no
// functional benefit. The dialog's own JS (new-case-dialog-content.tsx,
// Radix Dialog + the full form) is only fetched once someone actually opens
// it — hasOpened is set directly by the same action that opens the dialog
// (not reactively via an effect), and stays true afterward so the close
// animation plays and reopening doesn't re-fetch.
export function NewCaseDialogRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openDialog = useCallback(() => {
    setHasOpened(true);
    setOpen(true);
  }, []);

  return (
    <NewCaseDialogCtx.Provider value={openDialog}>
      {children}
      {hasOpened && <NewCaseDialogContent open={open} onOpenChange={setOpen} />}
    </NewCaseDialogCtx.Provider>
  );
}
