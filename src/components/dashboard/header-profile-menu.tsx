"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderProfileMenu({
  initials,
  fullName,
  email,
}: {
  initials: string;
  fullName: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Explicit client-driven navigation, not signOut()'s own redirect() — see
  // the comment on that action for why. Pushed only after signOut()
  // resolves (session actually cleared), not before: pushing earlier risks
  // the /login request landing while the old session cookie is still valid,
  // which the auth middleware would just bounce straight back to /dashboard.
  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.push("/login");
    });
  }

  return (
    <div className="flex items-center gap-1">
      {/* modal={false}: see notification-bell.tsx — Radix's default scroll-lock
          double-counts against `scrollbar-gutter: stable` and shifts the page. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="ml-1 cursor-pointer rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar>
              <AvatarFallback className="bg-verified text-background font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {(fullName || email) && (
            <>
              <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
                {fullName && <span className="truncate text-sm font-medium">{fullName}</span>}
                {email && <span className="text-muted-foreground truncate text-xs">{email}</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
