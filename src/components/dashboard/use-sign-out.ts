"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

// Explicit client-driven navigation, not signOut()'s own redirect() — see
// the comment on that action for why. Pushed only after signOut() resolves
// (session actually cleared), not before: pushing earlier risks the /login
// request landing while the old session cookie is still valid, which the
// auth middleware would just bounce straight back to /dashboard.
export function useSignOut(): () => void {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.push("/login");
    });
  };
}
