"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useOpenNewCaseDialog } from "@/components/dashboard/new-case-dialog-root";

export function NewCaseTriggerButton({
  children = "New case",
  ...props
}: Partial<ComponentProps<typeof Button>>) {
  const openDialog = useOpenNewCaseDialog();
  return (
    <Button type="button" onClick={openDialog} {...props}>
      {children}
    </Button>
  );
}
