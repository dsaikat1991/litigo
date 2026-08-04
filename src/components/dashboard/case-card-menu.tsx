"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCaseDialog } from "@/components/dashboard/edit-case-dialog";
import { DeleteCaseButton } from "@/components/dashboard/delete-case-button";
import type { Case } from "@/lib/types";

// Isolated from CaseCard (a server component) since a dropdown menu needs
// client-side state — keeping the "use client" boundary as small as
// possible rather than making the whole card a client component. No
// longer needs the preventDefault/stopPropagation guards a version of
// this once had: those existed only because the whole card used to be
// one big <Link>, which this menu's clicks could accidentally trigger.
// Now only the title and "Open case" link navigate, so that's moot.
export function CaseCardMenu({ caseItem, href }: { caseItem: Case; href: string }) {
  return (
    // modal={false}: see header-profile-menu.tsx — Radix's default
    // scroll-lock double-counts against `scrollbar-gutter: stable` and
    // shifts the page.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* translate-y-px: nudges the icon down slightly to match the
            optical baseline of the badge/text beside it. */}
        <Button variant="ghost" size="icon-sm" aria-label="Case actions" className="translate-y-px">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={href}>Open case</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* onSelect preventDefault: without it, selecting the item closes
            the dropdown menu before the dialog it triggers (via asChild)
            gets a chance to open. */}
        <EditCaseDialog
          caseItem={caseItem}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit case</DropdownMenuItem>
          }
        />
        <DeleteCaseButton
          caseId={caseItem.id}
          title={caseItem.title}
          trigger={
            <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
              Delete case
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
