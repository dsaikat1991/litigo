import { notFound } from "next/navigation";
import { getArgumentNotes, getCaseById, getResearchNotes } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddArgumentNoteForm } from "@/components/dashboard/add-argument-note-form";
import { AddResearchNoteForm } from "@/components/dashboard/add-research-note-form";
import { AddMemoryForm } from "@/components/dashboard/add-memory-form";
import { ArgumentNoteList, ResearchNoteList } from "@/components/dashboard/note-list";
import { MemoryList } from "@/components/dashboard/memory-list";
import { EditCaseDialog } from "@/components/dashboard/edit-case-dialog";
import { DeleteCaseButton } from "@/components/dashboard/delete-case-button";
import { formatDate } from "@/lib/utils";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseItem = await getCaseById(id);
  if (!caseItem) notFound();

  const [argumentNotes, researchNotes, memories, profile] = await Promise.all([
    getArgumentNotes(id),
    getResearchNotes(id),
    getMemories({ caseId: id }),
    getCurrentProfile(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-heading text-lg font-medium">{caseItem.title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {caseItem.status}
            </Badge>
            <EditCaseDialog caseItem={caseItem} />
            <DeleteCaseButton caseId={caseItem.id} title={caseItem.title} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {[caseItem.case_number, caseItem.court, caseItem.case_type, caseItem.parties]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="text-xs text-muted-foreground">
          Created {formatDate(caseItem.created_at, locale, timeZone)}
          {caseItem.updated_at !== caseItem.created_at &&
            ` · Updated ${formatDate(caseItem.updated_at, locale, timeZone)}`}
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
          <ArgumentNoteList notes={argumentNotes} locale={locale} timeZone={timeZone} />
        </TabsContent>
        <TabsContent value="research" className="flex flex-col gap-4">
          <AddResearchNoteForm caseId={id} />
          <ResearchNoteList notes={researchNotes} locale={locale} timeZone={timeZone} />
        </TabsContent>
        <TabsContent value="memory" className="flex flex-col gap-4">
          <AddMemoryForm caseId={id} />
          <MemoryList
            memories={memories}
            emptyLabel="No memories saved on this case yet."
            locale={locale}
            timeZone={timeZone}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
