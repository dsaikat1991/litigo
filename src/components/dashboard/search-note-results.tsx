import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, previewText, highlightMatch } from "@/lib/utils";
import type { ArgumentNote, ResearchNote } from "@/lib/types";

function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="font-normal">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function MatchedCaption({
  matchedField,
  matchedSnippet,
  query,
}: {
  matchedField?: string;
  matchedSnippet?: string;
  query: string;
}) {
  if (!matchedField) return null;
  return (
    <p className="text-muted-foreground text-xs">
      Matched: <span className="font-medium">{matchedField}</span> —{" "}
      {highlightMatch(matchedSnippet ?? "", query)}
    </p>
  );
}

export function ArgumentSearchResults({
  notes,
  locale,
  timeZone,
  query,
}: {
  notes: (ArgumentNote & { caseTitle: string; matchedField?: string; matchedSnippet?: string })[];
  locale: string;
  timeZone: string;
  query: string;
}) {
  return (
    <div className="divide-border flex flex-col divide-y">
      {notes.map((note) => (
        <div key={note.id} className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            {note.issue && <p className="text-sm font-medium">{highlightMatch(note.issue, query)}</p>}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {formatDate(note.created_at, locale, timeZone)}
              </span>
              {note.outcome && (
                <Badge variant={note.outcome === "worked" ? "verified" : "secondary"} className="capitalize">
                  {note.outcome}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {highlightMatch(previewText(note.content, 140), query)}
          </p>
          <Tags tags={note.tags} />
          <Link
            href={`/dashboard/cases/${note.case_id}`}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            View in {note.caseTitle || "case"}
          </Link>
          <MatchedCaption matchedField={note.matchedField} matchedSnippet={note.matchedSnippet} query={query} />
        </div>
      ))}
    </div>
  );
}

export function ResearchSearchResults({
  notes,
  locale,
  timeZone,
  query,
}: {
  notes: (ResearchNote & { caseTitle: string; matchedField?: string; matchedSnippet?: string })[];
  locale: string;
  timeZone: string;
  query: string;
}) {
  return (
    <div className="divide-border flex flex-col divide-y">
      {notes.map((note) => (
        <div key={note.id} className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            {note.citation && (
              <p className="text-sm font-medium">{highlightMatch(note.citation, query)}</p>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {formatDate(note.created_at, locale, timeZone)}
              </span>
              {note.source_type && (
                <Badge variant="secondary" className="capitalize">
                  {note.source_type}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {highlightMatch(previewText(note.content, 140), query)}
          </p>
          <Tags tags={note.tags} />
          <Link
            href={`/dashboard/cases/${note.case_id}`}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            View in {note.caseTitle || "case"}
          </Link>
          <MatchedCaption matchedField={note.matchedField} matchedSnippet={note.matchedSnippet} query={query} />
        </div>
      ))}
    </div>
  );
}
