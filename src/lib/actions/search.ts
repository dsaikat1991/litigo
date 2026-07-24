"use server";

import { createClient } from "@/lib/supabase/server";
import { previewText } from "@/lib/utils";

export interface SearchSuggestion {
  type: "case" | "memory";
  id: string;
  caseId?: string;
  label: string;
  // Set only when the query matched somewhere other than the primary label
  // (a tag, the court, a case number, ...) — so the UI can show *why* this
  // result showed up instead of a highlight-less, seemingly-unrelated hit.
  matchedField?: string;
  matchedSnippet?: string;
}

interface FieldCandidate {
  field: string;
  value: string;
}

function findMatch(candidates: FieldCandidate[], query: string): FieldCandidate | null {
  const q = query.toLowerCase();
  for (const candidate of candidates) {
    if (candidate.value && candidate.value.toLowerCase().includes(q)) return candidate;
  }
  return null;
}

export type SearchScope = "all" | "cases" | "memories";

// Deliberately shallow and fast — matches only a record's own fields (case
// title/number/court/etc, memory content/tags), not the cross-table "matched
// via an argument note" logic the full dashboard search does. That
// exhaustive version stays reserved for hitting Enter; this one just needs
// to be quick enough to run on every keystroke.
export async function getSearchSuggestions(
  query: string,
  scope: SearchScope = "all",
): Promise<SearchSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const supabase = await createClient();
  const pattern = `%${trimmed}%`;

  const [caseMatches, memoryMatches] = await Promise.all([
    scope === "memories"
      ? Promise.resolve({ data: [], error: null })
      : supabase
          .from("cases")
          .select("id, title, case_number, case_type, court, parties, summary, tags")
          .ilike("search_text", pattern)
          .order("updated_at", { ascending: false })
          .limit(5),
    scope === "cases"
      ? Promise.resolve({ data: [], error: null })
      : supabase
          .from("memories")
          .select("id, content, case_id, tags")
          .ilike("search_text", pattern)
          .order("created_at", { ascending: false })
          .limit(5),
  ]);
  if (caseMatches.error) throw caseMatches.error;
  if (memoryMatches.error) throw memoryMatches.error;

  const caseResults: SearchSuggestion[] = (caseMatches.data ?? []).map((c) => {
    // Title checked first: if it matches, that's the meaningful explanation
    // even when a tag or another field also happens to contain the text.
    const candidates: FieldCandidate[] = [
      { field: "Title", value: c.title ?? "" },
      ...(c.tags ?? []).map((tag: string) => ({ field: "Tag", value: tag })),
      { field: "Case No.", value: c.case_number ?? "" },
      { field: "Case type", value: c.case_type ?? "" },
      { field: "Court", value: c.court ?? "" },
      { field: "Parties", value: c.parties ?? "" },
      { field: "Summary", value: c.summary ?? "" },
    ];
    const match = findMatch(candidates, trimmed);
    const isTitleMatch = !match || match.field === "Title";
    return {
      type: "case" as const,
      id: c.id,
      label: c.title,
      matchedField: isTitleMatch ? undefined : match!.field,
      matchedSnippet: isTitleMatch ? undefined : match!.value,
    };
  });

  const memoryResults: SearchSuggestion[] = (memoryMatches.data ?? []).map((m) => {
    const candidates: FieldCandidate[] = [
      { field: "Memory", value: m.content ?? "" },
      ...(m.tags ?? []).map((tag: string) => ({ field: "Tag", value: tag })),
    ];
    const match = findMatch(candidates, trimmed);
    const isContentMatch = !match || match.field === "Memory";
    return {
      type: "memory" as const,
      id: m.id,
      caseId: m.case_id ?? undefined,
      label: previewText(m.content, 60),
      matchedField: isContentMatch ? undefined : match!.field,
      matchedSnippet: isContentMatch ? undefined : match!.value,
    };
  });

  return [...caseResults, ...memoryResults].slice(0, 5);
}
