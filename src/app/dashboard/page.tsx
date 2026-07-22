import { getCases } from "@/lib/data/cases";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { CaseCard } from "@/components/dashboard/case-card";
import { Input } from "@/components/ui/input";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const cases = await getCases(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <form action="/dashboard" className="flex-1">
          <Input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search your cases, arguments, and research…"
            className="max-w-md"
          />
        </form>
        <NewCaseDialog />
      </div>

      {cases.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {q ? "No cases match that search." : "No cases yet — add your first one."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cases.map((c) => (
            <CaseCard key={c.id} caseItem={c} />
          ))}
        </div>
      )}
    </div>
  );
}
