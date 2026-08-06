import { createClient } from "@/lib/supabase/server";
import { getCases } from "@/lib/data/cases";
import { getMemories } from "@/lib/data/memories";
import type { Case, Memory, ArgumentNote, ResearchNote, CaseDocument } from "@/lib/types";

export type SearchResultType = "case" | "memory" | "argument" | "research" | "document";

export function isSearchResultType(value: string): value is SearchResultType {
  return ["case", "memory", "argument", "research", "document"].includes(value);
}

interface SearchMatch {
  matchedField?: string;
  matchedSnippet?: string;
}

export interface SearchResults {
  cases: (Case & SearchMatch)[];
  memories: (Memory & SearchMatch)[];
  arguments: (ArgumentNote & { caseTitle: string } & SearchMatch)[];
  research: (ResearchNote & { caseTitle: string } & SearchMatch)[];
  documents: CaseDocument[];
}

interface FieldCandidate {
  field: string;
  value: string;
}

// Same priority-order approach as getSearchSuggestions() in
// src/lib/actions/search.ts (title/content-like field checked first) — kept
// as a separate, small copy here rather than importing that "use server"
// actions file into a data-layer file, which would invert the usual
// actions-call-data dependency direction.
function findMatch(candidates: FieldCandidate[], query: string): FieldCandidate | null {
  const q = query.toLowerCase();
  for (const candidate of candidates) {
    if (candidate.value && candidate.value.toLowerCase().includes(q)) return candidate;
  }
  return null;
}

// A case matched via a related argument/research note, memory, or hearing
// event (see getCases()) rather than any of its own fields has no candidate
// here to point to — findMatch returns null and no caption is attached. A
// case matched on its own field always gets one, including its own title,
// so every result consistently shows why it's here.
function withCaseMatch(c: Case, query: string): Case & SearchMatch {
  const candidates: FieldCandidate[] = [
    { field: "Case Title", value: c.title ?? "" },
    ...c.tags.map((tag) => ({ field: "Tag", value: tag })),
    { field: "Case No.", value: c.case_number ?? "" },
    { field: "Case type", value: c.case_type ?? "" },
    { field: "Court", value: c.court ?? "" },
    { field: "Parties", value: c.parties ?? "" },
    { field: "Summary", value: c.summary ?? "" },
  ];
  const match = findMatch(candidates, query);
  if (!match) return c;
  return { ...c, matchedField: match.field, matchedSnippet: match.value };
}

function withMemoryMatch(m: Memory, query: string): Memory & SearchMatch {
  const candidates: FieldCandidate[] = [
    { field: "Memory", value: m.content ?? "" },
    ...m.tags.map((tag) => ({ field: "Tag", value: tag })),
  ];
  const match = findMatch(candidates, query);
  if (!match) return m;
  return { ...m, matchedField: match.field, matchedSnippet: match.value };
}

function withNoteMatch<T extends { tags: string[] }>(
  note: T,
  primaryFields: FieldCandidate[],
  query: string,
): T & SearchMatch {
  const candidates: FieldCandidate[] = [...primaryFields, ...note.tags.map((tag) => ({ field: "Tag", value: tag }))];
  const match = findMatch(candidates, query);
  if (!match) return note;
  return { ...note, matchedField: match.field, matchedSnippet: match.value };
}

export async function searchAll(query: string, type?: SearchResultType): Promise<SearchResults> {
  const trimmed = query.trim();
  if (!trimmed) return { cases: [], memories: [], arguments: [], research: [], documents: [] };

  const supabase = await createClient();
  const pattern = `%${trimmed}%`;

  const [cases, memories, argumentRows, researchRows, documentRows] = await Promise.all([
    !type || type === "case" ? getCases(trimmed) : Promise.resolve([]),
    !type || type === "memory" ? getMemories({ search: trimmed }) : Promise.resolve([]),
    !type || type === "argument"
      ? supabase
          .from("argument_notes")
          .select("*, case:cases(title)")
          .ilike("search_text", pattern)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    !type || type === "research"
      ? supabase
          .from("research_notes")
          .select("*, case:cases(title)")
          .ilike("search_text", pattern)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    !type || type === "document"
      ? supabase
          .from("documents")
          .select("*, case:cases(id, title)")
          .ilike("search_text", pattern)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (argumentRows.error) throw argumentRows.error;
  if (researchRows.error) throw researchRows.error;
  if (documentRows.error) throw documentRows.error;

  return {
    cases: cases.map((c) => withCaseMatch(c, trimmed)),
    memories: memories.map((m) => withMemoryMatch(m, trimmed)),
    arguments: (argumentRows.data ?? []).map((n) =>
      withNoteMatch(
        { ...n, caseTitle: n.case?.title ?? "" },
        [
          { field: "Issue", value: n.issue ?? "" },
          { field: "Content", value: n.content ?? "" },
        ],
        trimmed,
      ),
    ),
    research: (researchRows.data ?? []).map((n) =>
      withNoteMatch(
        { ...n, caseTitle: n.case?.title ?? "" },
        [
          { field: "Citation", value: n.citation ?? "" },
          { field: "Content", value: n.content ?? "" },
        ],
        trimmed,
      ),
    ),
    documents: documentRows.data ?? [],
  };
}
