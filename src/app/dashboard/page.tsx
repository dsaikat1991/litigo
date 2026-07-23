import { getCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { getFirstName } from "@/lib/utils";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { Greeting } from "@/components/dashboard/greeting";
import { SearchBar } from "@/components/dashboard/search-bar";

const EXAMPLE_QUERIES = ["mutation does not confer title", "section 54 limitation", "specific performance"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [cases, memories, profile] = await Promise.all([
    getCases(q),
    getMemories({ search: q }),
    getCurrentProfile(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Greeting name={profile ? getFirstName(profile.fullName, profile.email) : null} />
        <div className="flex items-center gap-2">
          <AddMemoryDialog />
          <NewCaseDialog />
        </div>
      </div>

      <SearchBar defaultValue={q ?? ""} exampleQueries={EXAMPLE_QUERIES} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.55fr_1fr]">
        <section className="flex flex-col gap-3.5">
          <div className="flex items-baseline gap-2">
            <h2 className="font-heading text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Cases
            </h2>
            <span className="text-muted-foreground text-[11px]">{cases.length}</span>
          </div>
          {cases.length === 0 ? (
            <p className="text-muted-foreground py-8 text-sm">
              {q ? "No cases match that search." : "No cases yet — add your first one."}
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
          <MemoryList
            memories={memories}
            showCaseLink
            emptyLabel={q ? "No memories match that search." : "No memories yet."}
            locale={locale}
            timeZone={timeZone}
          />
        </section>
      </div>
    </div>
  );
}
