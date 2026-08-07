import type { CaseDocument } from "@/lib/types";
import { DocumentList } from "@/components/dashboard/document-list";

export function RecentDocuments({
  documents,
  locale,
  timeZone,
}: {
  documents: CaseDocument[];
  locale: string;
  timeZone: string;
}) {
  if (documents.length === 0) return null;

  return (
    <div className="border p-4">
      <h3 className="text-sm font-medium">Recent Documents</h3>
      <div className="mt-3">
        <DocumentList documents={documents} locale={locale} timeZone={timeZone} showCaseLink />
      </div>
    </div>
  );
}
