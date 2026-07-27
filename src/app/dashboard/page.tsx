import Link from "next/link";
import { Briefcase, FolderPlus, Sparkles, UploadCloud } from "lucide-react";
import { getCaseOptions, getCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { getAttentionAlerts, getPracticeInsights, getRecentActivity } from "@/lib/data/dashboard";
import { getFirstName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { Greeting } from "@/components/dashboard/greeting";
import { SearchBar } from "@/components/dashboard/search-bar";
import { ContentTypeTabs } from "@/components/dashboard/content-type-tabs";
import { AttentionPanel } from "@/components/dashboard/attention-panel";
import { ReflectionBanner } from "@/components/dashboard/reflection-banner";
import { RecentActivityPanel } from "@/components/dashboard/recent-activity-panel";
import { PracticeInsightsPanel } from "@/components/dashboard/practice-insights-panel";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { CaseStatusFilter, isCaseStatus } from "@/components/dashboard/case-status-filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status: rawStatus } = await searchParams;
  const status = rawStatus && isCaseStatus(rawStatus) ? rawStatus : undefined;
  const isFiltering = !!q || !!status;

  const [cases, memories, profile, caseOptions] = await Promise.all([
    getCases(q, status),
    getMemories({ search: q }),
    getCurrentProfile(),
    getCaseOptions(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  // The richer "at a glance" widgets (alerts, recent activity, insights) only
  // make sense for the unfiltered home view — while searching, these queries
  // would just be wasted work, so they're skipped entirely.
  const { alerts, reflectionCandidate } = isFiltering
    ? { alerts: [], reflectionCandidate: null }
    : await getAttentionAlerts(timeZone);
  const recentActivity = isFiltering ? [] : await getRecentActivity(2);
  const practiceInsights = isFiltering
    ? { mostUsedTag: null, argumentsWorkedCount: 0 }
    : await getPracticeInsights();

  const totalArguments = cases.reduce((sum, c) => sum + (c.argument_count ?? 0), 0);
  const totalResearch = cases.reduce((sum, c) => sum + (c.research_count ?? 0), 0);

  // "Continue working" is a curated top few, not the full list — soonest
  // upcoming hearing first (cases with none sort last), then most recently
  // touched. The full list is always one click away at /dashboard/cases.
  const continueWorkingCases = isFiltering
    ? cases
    : [...cases]
        .sort((a, b) => {
          const aHearing = a.next_hearing_date ?? "9999-99-99";
          const bHearing = b.next_hearing_date ?? "9999-99-99";
          if (aHearing !== bHearing) return aHearing < bHearing ? -1 : 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        })
        .slice(0, 2);

  return (
    <div className="flex flex-col gap-8">
      <CommandPalette cases={caseOptions} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <Greeting name={profile ? getFirstName(profile.fullName, profile.email) : null} />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled aria-label="Upload document (coming soon)">
            <UploadCloud />
            Upload document
          </Button>
          <AddMemoryDialog cases={caseOptions} />
          <NewCaseDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar defaultValue={q ?? ""} />
        <ContentTypeTabs />
        {!isFiltering && (cases.length > 0 || memories.length > 0) && (
          <p className="text-muted-foreground px-1 text-xs">
            {cases.length} {cases.length === 1 ? "case" : "cases"} · {totalArguments}{" "}
            {totalArguments === 1 ? "argument" : "arguments"} · {totalResearch}{" "}
            {totalResearch === 1 ? "research note" : "research notes"} · {memories.length}{" "}
            {memories.length === 1 ? "memory" : "memories"}
          </p>
        )}
      </div>

      {isFiltering ? (
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.55fr_1fr]">
          <section className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h2 className="font-heading text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  Cases
                </h2>
                <span className="text-muted-foreground text-[11px]">{cases.length}</span>
              </div>
              <CaseStatusFilter basePath="/dashboard" q={q} status={status} />
            </div>
            {cases.length === 0 ? (
              <p className="text-muted-foreground py-8 text-sm">
                No cases match {q ? "that search" : "this filter"}.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {cases.map((c) => (
                  <CaseCard key={c.id} caseItem={c} locale={locale} timeZone={timeZone} />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3.5">
            <div className="flex items-baseline gap-2">
              <h2 className="font-heading text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                Memories
              </h2>
              <span className="text-muted-foreground text-[11px]">{memories.length}</span>
            </div>
            {memories.length === 0 ? (
              <p className="text-muted-foreground py-8 text-sm">No memories match that search.</p>
            ) : (
              <MemoryList
                memories={memories}
                cases={caseOptions}
                showCaseLink
                locale={locale}
                timeZone={timeZone}
              />
            )}
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3.5">
              {cases.length > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-muted-foreground size-4" />
                    <h2 className="font-heading text-sm font-medium">Continue working</h2>
                  </div>
                  {cases.length > continueWorkingCases.length && (
                    <Link
                      href="/dashboard/cases"
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      View all
                    </Link>
                  )}
                </div>
              )}
              {cases.length === 0 ? (
                <EmptyStatePanel
                  icon={FolderPlus}
                  title="No cases yet"
                  description="Add the matter you're working on now — arguments and research can come later."
                  action={<NewCaseDialog />}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {continueWorkingCases.map((c) => (
                    <CaseCard key={c.id} caseItem={c} locale={locale} timeZone={timeZone} />
                  ))}
                </div>
              )}
            </section>

            {reflectionCandidate && (
              <ReflectionBanner caseId={reflectionCandidate.id} caseTitle={reflectionCandidate.title} />
            )}

            {cases.length > 0 && <PracticeInsightsPanel insights={practiceInsights} />}
          </div>

          <div className="flex flex-col gap-6">
            <AttentionPanel alerts={alerts} />
            <RecentActivityPanel
              items={recentActivity}
              cases={caseOptions}
              locale={locale}
              timeZone={timeZone}
            />
            {cases.length === 0 && memories.length === 0 && (
              <EmptyStatePanel
                icon={Sparkles}
                title="No memories yet"
                description="Save a fact worth remembering — a stamp-duty rate, a judge's remark, anything you'd otherwise forget."
                action={<AddMemoryDialog cases={caseOptions} />}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
