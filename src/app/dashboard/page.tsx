import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, FolderPlus, Sparkles } from "lucide-react";
import { getCaseOptions, getDashboardCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { getRecentDocuments } from "@/lib/data/documents";
import {
  getTodaysFocus,
  getKnowledgeGaps,
  getRecentArgumentIssues,
  getMonthlyArgumentInsight,
} from "@/lib/data/dashboard";
import { getFirstName } from "@/lib/utils";
import { NewCaseDialogRoot } from "@/components/dashboard/new-case-dialog-root";
import { NewCaseTriggerButton } from "@/components/dashboard/new-case-trigger-button";
import { AddMemoryDialogRoot } from "@/components/dashboard/add-memory-dialog-root";
import { AddMemoryTriggerButton } from "@/components/dashboard/add-memory-trigger-button";
import { UploadDocumentDialogRoot } from "@/components/dashboard/upload-document-dialog-root";
import { UploadDocumentTriggerButton } from "@/components/dashboard/upload-document-trigger-button";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { Greeting } from "@/components/dashboard/greeting";
import { SearchBar } from "@/components/dashboard/search-bar";
import { ContentTypeTabs } from "@/components/dashboard/content-type-tabs";
import { ReflectionBannerAsync } from "@/components/dashboard/reflection-banner-async";
import { TodaysFocus } from "@/components/dashboard/todays-focus";
import { KnowledgeGaps } from "@/components/dashboard/knowledge-gaps";
import { ArgumentLibrary } from "@/components/dashboard/argument-library";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { MonthlyArgumentInsightCard } from "@/components/dashboard/monthly-argument-insight";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";

export default async function DashboardPage() {
  // getCurrentProfile() is cache()'d, so this reuses the same call the
  // layout already made instead of triggering a second round trip. Reading
  // timeZone/locale from it up front — rather than pulling profile out of
  // the batch below — lets every other fetch run in one real parallel
  // batch instead of two forced-sequential waves (the second used to wait
  // on timeZone from the first).
  const profile = await getCurrentProfile();
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  const [
    { continueWorking: continueWorkingCases, totalCases, totalArguments, totalResearch },
    memories,
    caseOptions,
    todaysFocus,
    knowledgeGaps,
    recentArgumentIssues,
    monthlyInsight,
    recentDocuments,
  ] = await Promise.all([
    getDashboardCases(),
    getMemories({}),
    getCaseOptions(),
    getTodaysFocus(timeZone),
    getKnowledgeGaps(),
    getRecentArgumentIssues(),
    getMonthlyArgumentInsight(timeZone),
    getRecentDocuments(),
  ]);

  return (
    <NewCaseDialogRoot>
      <AddMemoryDialogRoot cases={caseOptions}>
        <UploadDocumentDialogRoot cases={caseOptions}>
          <div className="flex flex-col gap-8">
            <CommandPalette cases={caseOptions} />

            <div className="flex flex-wrap items-end justify-between gap-3">
              <Greeting name={profile ? getFirstName(profile.fullName, profile.email) : null} />
              <div className="flex items-center gap-2">
                <UploadDocumentTriggerButton />
                <AddMemoryTriggerButton />
                <NewCaseTriggerButton />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <SearchBar defaultValue="" basePath="/dashboard/search" />
              <ContentTypeTabs />
              {(totalCases > 0 || memories.length > 0) && (
                <p className="text-muted-foreground px-1 text-xs">
                  {totalCases} {totalCases === 1 ? "case" : "cases"} · {totalArguments}{" "}
                  {totalArguments === 1 ? "argument" : "arguments"} · {totalResearch}{" "}
                  {totalResearch === 1 ? "research note" : "research notes"} · {memories.length}{" "}
                  {memories.length === 1 ? "memory" : "memories"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <TodaysFocus items={todaysFocus} />

              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
                <section className="flex min-w-0 flex-col gap-3.5">
                  {totalCases > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="text-muted-foreground size-4" />
                        <h2 className="text-sm font-medium">Continue working</h2>
                      </div>
                      {totalCases > continueWorkingCases.length && (
                        <Link
                          href="/dashboard/cases"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                        >
                          View all
                          <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  )}
                  {totalCases === 0 ? (
                    <EmptyStatePanel
                      icon={FolderPlus}
                      title="No cases yet"
                      description="Add the matter you're working on now — arguments and research can come later."
                      action={<NewCaseTriggerButton />}
                    />
                  ) : (
                    <div className="flex min-w-0 flex-col gap-3">
                      {continueWorkingCases.map((c) => (
                        <CaseCard key={c.id} caseItem={c} locale={locale} timeZone={timeZone} />
                      ))}
                    </div>
                  )}
                </section>

                {(memories.length > 0 || knowledgeGaps.length > 0) && (
                  <div className="flex flex-col gap-4">
                    {memories.length > 0 && (
                      <div className="border p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-medium">Recent Memories</h3>
                          <Link
                            href="/dashboard/memories"
                            className="text-muted-foreground hover:text-foreground text-xs"
                          >
                            View all
                          </Link>
                        </div>
                        <div className="mt-2">
                          <MemoryList
                            memories={memories.slice(0, 5)}
                            cases={caseOptions}
                            showCaseLink
                            locale={locale}
                            timeZone={timeZone}
                          />
                        </div>
                      </div>
                    )}
                    <KnowledgeGaps items={knowledgeGaps} />
                  </div>
                )}
              </div>

              <Suspense fallback={null}>
                <ReflectionBannerAsync timeZone={timeZone} />
              </Suspense>

              {(recentArgumentIssues.length > 0 || recentDocuments.length > 0) && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ArgumentLibrary issues={recentArgumentIssues} />
                  <RecentDocuments documents={recentDocuments} locale={locale} timeZone={timeZone} />
                </div>
              )}

              <MonthlyArgumentInsightCard insight={monthlyInsight} />

              {totalCases === 0 && memories.length === 0 && (
                <EmptyStatePanel
                  icon={Sparkles}
                  title="No memories yet"
                  description="Save a fact worth remembering — a stamp-duty rate, a judge's remark, anything you'd otherwise forget."
                  action={<AddMemoryTriggerButton />}
                />
              )}
            </div>
          </div>
        </UploadDocumentDialogRoot>
      </AddMemoryDialogRoot>
    </NewCaseDialogRoot>
  );
}
