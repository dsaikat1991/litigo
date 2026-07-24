import { Sparkles } from "lucide-react";
import { getMemories } from "@/lib/data/memories";
import { getCurrentProfile } from "@/lib/data/profile";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";
import { MemoryList } from "@/components/dashboard/memory-list";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { SearchBar } from "@/components/dashboard/search-bar";

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [memories, profile] = await Promise.all([
    getMemories({ search: q }),
    getCurrentProfile(),
  ]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-lg font-medium">Memories</h1>
        <AddMemoryDialog />
      </div>

      <SearchBar
        defaultValue={q ?? ""}
        basePath="/dashboard/memories"
        scope="memories"
        showCommandPaletteHint={false}
        placeholder="Search memories…"
      />

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
        <MemoryList memories={memories} showCaseLink locale={locale} timeZone={timeZone} />
      )}
    </div>
  );
}
