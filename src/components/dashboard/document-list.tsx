import type { CaseDocument } from "@/lib/types";
import { DocumentRow } from "@/components/dashboard/document-row";

export function DocumentList({
  documents,
  locale,
  timeZone,
  showCaseLink = false,
  emptyLabel = "No documents yet.",
}: {
  documents: CaseDocument[];
  locale: string;
  timeZone: string;
  showCaseLink?: boolean;
  emptyLabel?: string;
}) {
  if (documents.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {documents.map((doc) => (
        <DocumentRow key={doc.id} document={doc} locale={locale} timeZone={timeZone} showCaseLink={showCaseLink} />
      ))}
    </ul>
  );
}
