"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useOpenAddMemoryDialog } from "@/components/dashboard/add-memory-dialog-root";

export function AddMemoryTriggerButton({
  children = "Add memory",
  variant = "outline",
  ...props
}: Partial<ComponentProps<typeof Button>>) {
  const openDialog = useOpenAddMemoryDialog();
  return (
    <Button type="button" variant={variant} onClick={openDialog} {...props}>
      {children}
    </Button>
  );
}
