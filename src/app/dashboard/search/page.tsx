import { Search } from "lucide-react";
import { searchAll, isSearchResultType } from "@/lib/data/search";
import { getCurrentProfile } from "@/lib/data/profile";
import { getCaseOptions } from "@/lib/data/cases";
import { SearchBar } from "@/components/dashboard/search-bar";
import { SearchTypeFilter } from "@/components/dashboard/search-type-filter";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { DocumentList } from "@/components/dashboard/document-list";
import { ArgumentSearchResults, ResearchSearchResults } from "@/components/dashboard/search-note-results";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type: rawType } = await searchParams;
  const type = rawType && isSearchResultType(rawType) ? rawType : undefined;
  const trimmed = q?.trim() ?? "";

  const [results, profile, caseOptions] = await Promise.all([
    searchAll(trimmed, type),
    getCurrentProfile(),
    getCaseOptions(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";
  const total =
    results.cases.length +
    results.memories.length +
    results.arguments.length +
    results.research.length +
    results.documents.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Search</h1>
        <p className="text-muted-foreground text-sm">
          Across your cases, memories, arguments, research, and documents.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar defaultValue={q ?? ""} basePath="/dashboard/search" showCommandPaletteHint={false} />
        <SearchTypeFilter q={trimmed || undefined} type={type} />
      </div>

      {!trimmed ? (
        <EmptyStatePanel
          icon={Search}
          title="Search your legal memory"
          description="Find a case, an argument you made, a research note, a saved memory, or a document — across every matter."
          action={null}
        />
      ) : total === 0 ? (
        <p className="text-muted-foreground py-8 text-sm">No results for &ldquo;{trimmed}&rdquo;.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {results.cases.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <SectionHeader label="Cases" count={results.cases.length} />
              <div className="divide-border flex flex-col divide-y">
                {results.cases.map((c) => (
                  <CaseCard
                    key={c.id}
                    caseItem={c}
                    locale={locale}
                    timeZone={timeZone}
                    bare
                    query={trimmed}
                    showDocumentCount
                  />
                ))}
              </div>
            </section>
          )}
          {results.memories.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <SectionHeader label="Memories" count={results.memories.length} />
              <MemoryList
                memories={results.memories}
                cases={caseOptions}
                showCaseLink
                locale={locale}
                timeZone={timeZone}
                bare
                query={trimmed}
              />
            </section>
          )}
          {results.arguments.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <SectionHeader label="Arguments" count={results.arguments.length} />
              <ArgumentSearchResults
                notes={results.arguments}
                locale={locale}
                timeZone={timeZone}
                query={trimmed}
              />
            </section>
          )}
          {results.research.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <SectionHeader label="Research" count={results.research.length} />
              <ResearchSearchResults
                notes={results.research}
                locale={locale}
                timeZone={timeZone}
                query={trimmed}
              />
            </section>
          )}
          {results.documents.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <SectionHeader label="Documents" count={results.documents.length} />
              <DocumentList documents={results.documents} locale={locale} timeZone={timeZone} showCaseLink />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <h2 className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">{label}</h2>
      <span className="text-muted-foreground text-[11px]">{count}</span>
    </div>
  );
}
