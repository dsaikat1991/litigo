import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
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

export function ArgumentNoteList({ notes }: { notes: ArgumentNote[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-muted-foreground">No arguments recorded yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <div key={note.id} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-start justify-between gap-2">
            {note.issue && <p className="text-sm font-medium">{note.issue}</p>}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
              {note.outcome && (
                <Badge
                  variant={note.outcome === "worked" ? "verified" : "secondary"}
                  className="capitalize"
                >
                  {note.outcome}
                </Badge>
              )}
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
          <Tags tags={note.tags} />
        </div>
      ))}
    </div>
  );
}

export function ResearchNoteList({ notes }: { notes: ResearchNote[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-muted-foreground">No research recorded yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <div key={note.id} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-start justify-between gap-2">
            {note.citation && <p className="text-sm font-medium">{note.citation}</p>}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
              {note.source_type && (
                <Badge variant="secondary" className="capitalize">
                  {note.source_type}
                </Badge>
              )}
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
          <Tags tags={note.tags} />
        </div>
      ))}
    </div>
  );
}
