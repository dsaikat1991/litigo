"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { getDocumentDownloadUrl } from "@/lib/actions/documents";
import type { CaseDocument } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function DocumentRow({
  document,
  locale,
  timeZone,
  showCaseLink,
}: {
  document: CaseDocument;
  locale: string;
  timeZone: string;
  showCaseLink: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function open() {
    // Open the tab synchronously, inside the click's call stack — opening it
    // after the `await` below loses the browser's user-gesture allowance and
    // gets silently popup-blocked. Redirect this already-open tab once the
    // signed URL comes back. No "noopener" here: passing it makes window.open
    // return null per spec, which would leave us with no reference to
    // navigate — we control what gets loaded into it, so the opener isn't a
    // risk.
    const newTab = window.open("", "_blank");
    setLoading(true);
    try {
      const url = await getDocumentDownloadUrl(document.id);
      if (url && newTab) newTab.location.href = url;
      else newTab?.close();
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-start gap-2">
        <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <div className="flex min-w-0 flex-col gap-1">
          <button
            type="button"
            onClick={open}
            disabled={loading}
            className="truncate text-left text-sm font-medium hover:underline disabled:opacity-50"
          >
            {document.file_name}
          </button>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground text-xs">
              {formatDate(document.created_at, locale, timeZone)}
            </span>
            {showCaseLink && document.case_id && document.case && (
              <Link href={`/dashboard/cases/${document.case_id}`} className="min-w-0 max-w-full">
                <Badge variant="verified" className="max-w-full justify-start font-normal">
                  <span className="min-w-0 truncate">{document.case.title}</span>
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={open}
        disabled={loading}
        aria-label="Download document"
        className="text-muted-foreground hover:text-foreground shrink-0 disabled:opacity-50"
      >
        <Download className="size-3.5" />
      </button>
    </li>
  );
}
