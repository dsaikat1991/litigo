import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { getFirstName } from "@/lib/utils";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";
import { CaseCard } from "@/components/dashboard/case-card";
import { MemoryList } from "@/components/dashboard/memory-list";
import { Greeting } from "@/components/dashboard/greeting";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Greeting name={profile ? getFirstName(profile.fullName, profile.email) : null} />
        <div className="flex items-center gap-2">
          <AddMemoryDialog />
          <NewCaseDialog />
        </div>
      </div>

      <form action="/dashboard" className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5 focus-within:border-foreground">
          <Search className="text-muted-foreground size-[17px] shrink-0" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search your legal memory…"
            className="placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none flex-1 bg-transparent text-[14.5px] outline-none"
          />
          {q && (
            <Button asChild variant="ghost" size="icon" aria-label="Clear search">
              <Link href="/dashboard">
                <X className="size-4" />
              </Link>
            </Button>
          )}
          {/* No advanced filtering exists yet — shown but inert rather than faking a feature. */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search filters (coming soon)"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3 px-1">
          <p className="text-muted-foreground text-xs">
            Try:{" "}
            {EXAMPLE_QUERIES.map((query, i) => (
              <span key={query}>
                <strong className="text-foreground font-medium">&ldquo;{query}&rdquo;</strong>
                {i < EXAMPLE_QUERIES.length - 1 && " or "}
              </span>
            ))}
          </p>
          <span className="text-verified shrink-0 text-xs font-medium" aria-disabled>
            Advanced search
          </span>
        </div>
      </form>

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
                <CaseCard key={c.id} caseItem={c} />
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
          />
        </section>
      </div>
    </div>
  );
}
