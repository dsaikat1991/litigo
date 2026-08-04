"use client";

import type { ComponentProps } from "react";
import { useSignOut } from "@/components/dashboard/use-sign-out";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  children = "Sign out",
  variant = "outline",
  ...props
}: Partial<ComponentProps<typeof Button>>) {
  const handleSignOut = useSignOut();
  return (
    <Button type="button" variant={variant} onClick={handleSignOut} {...props}>
      {children}
    </Button>
  );
}
