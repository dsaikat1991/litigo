import { notFound } from "next/navigation";
import { getArgumentNotes, getCaseById, getResearchNotes } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddArgumentNoteForm } from "@/components/dashboard/add-argument-note-form";
import { AddResearchNoteForm } from "@/components/dashboard/add-research-note-form";
import { AddMemoryForm } from "@/components/dashboard/add-memory-form";
import { ArgumentNoteList, ResearchNoteList } from "@/components/dashboard/note-list";
import { MemoryList } from "@/components/dashboard/memory-list";
import { formatDate } from "@/lib/utils";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseItem = await getCaseById(id);
  if (!caseItem) notFound();

  const [argumentNotes, researchNotes, memories] = await Promise.all([
    getArgumentNotes(id),
    getResearchNotes(id),
    getMemories({ caseId: id }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-heading text-lg font-medium">{caseItem.title}</h1>
          <Badge variant="secondary" className="capitalize">
            {caseItem.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {[caseItem.case_number, caseItem.court, caseItem.case_type, caseItem.parties]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="text-xs text-muted-foreground">
          Created {formatDate(caseItem.created_at)}
          {caseItem.updated_at !== caseItem.created_at &&
            ` · Updated ${formatDate(caseItem.updated_at)}`}
        </p>
        {caseItem.summary && <p className="text-sm">{caseItem.summary}</p>}
        {caseItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {caseItem.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="arguments">
        <TabsList>
          <TabsTrigger value="arguments">Arguments</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
        <TabsContent value="arguments" className="flex flex-col gap-4">
          <AddArgumentNoteForm caseId={id} />
          <ArgumentNoteList notes={argumentNotes} />
        </TabsContent>
        <TabsContent value="research" className="flex flex-col gap-4">
          <AddResearchNoteForm caseId={id} />
          <ResearchNoteList notes={researchNotes} />
        </TabsContent>
        <TabsContent value="memory" className="flex flex-col gap-4">
          <AddMemoryForm caseId={id} />
          <MemoryList memories={memories} emptyLabel="No memories saved on this case yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
