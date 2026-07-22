import { notFound } from "next/navigation";
import { getArgumentNotes, getCaseById, getResearchNotes } from "@/lib/data/cases";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddArgumentNoteForm } from "@/components/dashboard/add-argument-note-form";
import { AddResearchNoteForm } from "@/components/dashboard/add-research-note-form";
import { ArgumentNoteList, ResearchNoteList } from "@/components/dashboard/note-list";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseItem = await getCaseById(id);
  if (!caseItem) notFound();

  const [argumentNotes, researchNotes] = await Promise.all([
    getArgumentNotes(id),
    getResearchNotes(id),
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
        </TabsList>
        <TabsContent value="arguments" className="flex flex-col gap-4">
          <AddArgumentNoteForm caseId={id} />
          <ArgumentNoteList notes={argumentNotes} />
        </TabsContent>
        <TabsContent value="research" className="flex flex-col gap-4">
          <AddResearchNoteForm caseId={id} />
          <ResearchNoteList notes={researchNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
