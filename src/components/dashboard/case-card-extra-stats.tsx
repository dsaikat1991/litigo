"use client";

import { FileText, Info, ScrollText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Case } from "@/lib/types";

function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Isolated from CaseCard (a server component) for the same reason as
// CaseCardMenu: a Popover needs client-side state, kept as its own small
// component rather than making the whole card a client component. No
// longer needs a click guard — that only existed because the whole card
// used to be one big <Link>, which this trigger's click could accidentally
// navigate away from.
export function CaseCardExtraStats({ caseItem }: { caseItem: Case }) {
  return (
    <Popover>
      {/* translate-y-px: nudges the icon down slightly to match the
          optical baseline of the stats text beside it. */}
      <PopoverTrigger
        aria-label="More case stats"
        className="text-muted-foreground hover:text-foreground translate-y-px"
      >
        <Info className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <FileText className="size-3.5" />
            {pluralize(caseItem.document_count ?? 0, "document")}
          </span>
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ScrollText className="size-3.5" />
            {pluralize(caseItem.order_count ?? 0, "order")}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
