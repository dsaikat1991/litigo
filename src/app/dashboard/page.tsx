import { FolderPlus, Sparkles } from "lucide-react";
import { getCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { getFirstName } from "@/lib/utils";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { Greeting } from "@/components/dashboard/greeting";
import { SearchBar } from "@/components/dashboard/search-bar";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { CaseStatusFilter, isCaseStatus } from "@/components/dashboard/case-status-filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status: rawStatus } = await searchParams;
  const status = rawStatus && isCaseStatus(rawStatus) ? rawStatus : undefined;
  const [cases, memories, profile] = await Promise.all([
    getCases(q, status),
    getMemories({ search: q }),
    getCurrentProfile(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  const isFiltering = !!q || !!status;
  const totalArguments = cases.reduce((sum, c) => sum + (c.argument_count ?? 0), 0);
  const totalResearch = cases.reduce((sum, c) => sum + (c.research_count ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <CommandPalette cases={cases.map((c) => ({ id: c.id, title: c.title }))} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <Greeting name={profile ? getFirstName(profile.fullName, profile.email) : null} />
        <div className="flex items-center gap-2">
          <AddMemoryDialog />
          <NewCaseDialog />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SearchBar defaultValue={q ?? ""} />
        {!isFiltering && (cases.length > 0 || memories.length > 0) && (
          <p className="text-muted-foreground px-1 text-xs">
            {cases.length} {cases.length === 1 ? "case" : "cases"} · {totalArguments}{" "}
            {totalArguments === 1 ? "argument" : "arguments"} · {totalResearch}{" "}
            {totalResearch === 1 ? "research note" : "research notes"} · {memories.length}{" "}
            {memories.length === 1 ? "memory" : "memories"} — and counting.
          </p>
        )}
      </div>

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
            isFiltering ? (
              <p className="text-muted-foreground py-8 text-sm">
                No cases match {q ? "that search" : "this filter"}.
              </p>
            ) : (
              <EmptyStatePanel
                icon={FolderPlus}
                title="No cases yet"
                description="Add the matter you're working on now — arguments and research can come later."
                action={<NewCaseDialog />}
              />
            )
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
            q ? (
              <p className="text-muted-foreground py-8 text-sm">No memories match that search.</p>
            ) : (
              <EmptyStatePanel
                icon={Sparkles}
                title="No memories yet"
                description="Save a fact worth remembering — a stamp-duty rate, a judge's remark, anything you'd otherwise forget."
                action={<AddMemoryDialog />}
              />
            )
          ) : (
            <MemoryList
              memories={memories}
              showCaseLink
              locale={locale}
              timeZone={timeZone}
            />
          )}
        </section>
      </div>
    </div>
  );
}
