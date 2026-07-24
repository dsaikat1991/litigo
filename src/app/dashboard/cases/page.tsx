import { FolderPlus } from "lucide-react";
import { getCases } from "@/lib/data/cases";
import { getCurrentProfile } from "@/lib/data/profile";
import { CaseCard } from "@/components/dashboard/case-card";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { CaseStatusFilter, isCaseStatus } from "@/components/dashboard/case-status-filter";
import { SearchBar } from "@/components/dashboard/search-bar";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status: rawStatus } = await searchParams;
  const status = rawStatus && isCaseStatus(rawStatus) ? rawStatus : undefined;
  const [cases, profile] = await Promise.all([getCases(q, status), getCurrentProfile()]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";
  const isFiltering = !!q || !!status;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-lg font-medium">Cases</h1>
        <NewCaseDialog />
      </div>

      <SearchBar
        defaultValue={q ?? ""}
        basePath="/dashboard/cases"
        scope="cases"
        showCommandPaletteHint={false}
        placeholder="Search cases…"
      />

      <CaseStatusFilter basePath="/dashboard/cases" q={q} status={status} />

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
    </div>
  );
}
