import { notFound } from "next/navigation";
import { CalendarClock, Milestone } from "lucide-react";
import { getArgumentNotes, getCaseById, getCaseOptions, getResearchNotes } from "@/lib/data/cases";
import { getCaseEvents } from "@/lib/data/case-events";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddArgumentNoteForm } from "@/components/dashboard/add-argument-note-form";
import { AddResearchNoteForm } from "@/components/dashboard/add-research-note-form";
import { AddMemoryForm } from "@/components/dashboard/add-memory-form";
import { ArgumentNoteList, ResearchNoteList } from "@/components/dashboard/note-list";
import { MemoryList } from "@/components/dashboard/memory-list";
import { CaseTimeline } from "@/components/dashboard/case-timeline";
import { RecordHearingDialog } from "@/components/dashboard/record-hearing-dialog";
import { EditCaseDialog } from "@/components/dashboard/edit-case-dialog";
import { DeleteCaseButton } from "@/components/dashboard/delete-case-button";
import { caseStatusBadgeVariant, formatDate } from "@/lib/utils";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseItem = await getCaseById(id);
  if (!caseItem) notFound();

  const [argumentNotes, researchNotes, memories, profile, caseOptions, caseEvents] = await Promise.all([
    getArgumentNotes(id),
    getResearchNotes(id),
    getMemories({ caseId: id }),
    getCurrentProfile(),
    getCaseOptions(),
    getCaseEvents(id),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-medium">{caseItem.title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant={caseStatusBadgeVariant(caseItem.status)} className="capitalize">
              {caseItem.status}
            </Badge>
            <RecordHearingDialog caseId={caseItem.id} caseTitle={caseItem.title} triggerVariant="default" />
            <EditCaseDialog caseItem={caseItem} />
            <DeleteCaseButton caseId={caseItem.id} title={caseItem.title} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {[caseItem.case_number, caseItem.court, caseItem.case_type, caseItem.parties]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {(caseItem.stage || caseItem.next_hearing_date) && (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {caseItem.stage && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Milestone className="size-3" />
                {caseItem.stage}
              </span>
            )}
            {caseItem.next_hearing_date && (
              <span className="text-muted-foreground flex items-center gap-1">
                <CalendarClock className="size-3" />
                Next hearing {formatDate(caseItem.next_hearing_date, locale, timeZone)}
              </span>
            )}
          </div>
        )}
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

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="arguments">Arguments</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="flex flex-col gap-4">
          <CaseTimeline events={caseEvents} locale={locale} timeZone={timeZone} />
        </TabsContent>
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
            cases={caseOptions}
            emptyLabel="No memories saved on this case yet."
            locale={locale}
            timeZone={timeZone}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
