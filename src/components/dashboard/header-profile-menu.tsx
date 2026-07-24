"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="flex items-center gap-1">
      {/* No notifications feature yet — present but inert rather than faking activity. */}
      <Button variant="ghost" size="icon" aria-label="Notifications (coming soon)">
        <Bell />
      </Button>
      <DropdownMenu>
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
          <DropdownMenuItem onSelect={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
