"use client";

import Link from "next/link";
import { useSignOut } from "@/components/dashboard/use-sign-out";
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
  const handleSignOut = useSignOut();

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
