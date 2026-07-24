"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addRecentSearch, getRecentSearches } from "@/lib/recent-searches";
import { getSearchSuggestions, type SearchScope, type SearchSuggestion } from "@/lib/actions/search";

export const DEFAULT_EXAMPLE_QUERIES = [
  "mutation does not confer title",
  "section 54 limitation",
  "specific performance",
];

// Wraps the first case-insensitive occurrence of `query` inside `text` in a
// highlighter-style <mark> — literally the marker-pen metaphor an advocate
// already reaches for on a physical page.
function highlightMatch(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-[2px] bg-yellow-200 px-0.5 text-inherit">
        {text.slice(idx, idx + trimmed.length)}
      </mark>
      {text.slice(idx + trimmed.length)}
    </>
  );
}

export function SearchBar({
  defaultValue,
  exampleQueries = DEFAULT_EXAMPLE_QUERIES,
  basePath = "/dashboard",
  scope = "all",
  showCommandPaletteHint = true,
  placeholder = "Search your legal memory…",
}: {
  defaultValue: string;
  exampleQueries?: string[];
  basePath?: string;
  scope?: SearchScope;
  showCommandPaletteHint?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [matches, setMatches] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    // localStorage is a client-only external system, unavailable during SSR —
    // reading it and syncing into state on mount is the correct pattern here,
    // not the derived-state antipattern this rule normally guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      getSearchSuggestions(trimmed, scope).then((results) => {
        if (!cancelled) setMatches(results);
      });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, scope]);

  function runSearch(query: string) {
    const trimmed = query.trim();
    setOpen(false);
    if (!trimmed) {
      router.push(basePath);
      return;
    }
    setValue(trimmed);
    setRecent(addRecentSearch(trimmed));
    router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
  }

  function goToCase(id: string) {
    setOpen(false);
    router.push(`/dashboard/cases/${id}`);
  }

  function clearSearch() {
    setValue("");
    setMatches([]);
    setOpen(false);
    router.push(basePath);
  }

  const searchForLabel =
    scope === "cases" ? "cases" : scope === "memories" ? "memories" : "your legal memory";

  const isTyping = value.trim().length > 0;
  const suggestions = recent.length > 0 ? recent : exampleQueries;
  const suggestionsLabel = recent.length > 0 ? "Recent searches" : "Try searching for";

  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(value);
        }}
        className="relative"
      >
        <div className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5 focus-within:border-foreground">
          <Search className="text-muted-foreground size-[17px] shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              setValue(next);
              if (!next.trim()) setMatches([]);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.blur();
            }}
            placeholder={placeholder}
            autoComplete="off"
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-[14.5px] outline-none"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearSearch}
            >
              <X className="size-4" />
            </Button>
          )}
          {!value && showCommandPaletteHint && (
            <button
              type="button"
              aria-label="Open command palette"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => window.dispatchEvent(new CustomEvent("litigo:open-command-palette"))}
              className="text-muted-foreground hover:border-foreground/30 hover:text-foreground hidden shrink-0 items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:flex"
            >
              ⌘K
            </button>
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

        {open && isTyping && (
          <div className="bg-popover text-popover-foreground absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border shadow-md">
            {matches.length > 0 && (
              <div className="text-muted-foreground px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-wide uppercase">
                Matches
              </div>
            )}
            <ul className="pb-2">
              {matches.map((match) => (
                <li key={`${match.type}-${match.id}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => (match.type === "case" ? goToCase(match.id) : runSearch(value))}
                    className="hover:bg-muted flex w-full flex-col items-stretch gap-0.5 px-4 py-2 text-left text-[13.5px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Search className="text-muted-foreground size-3.5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {match.matchedField ? match.label : highlightMatch(match.label, value)}
                      </span>
                      {scope === "all" && (
                        <span className="text-muted-foreground shrink-0 rounded border px-1 py-0.5 text-[10px] leading-none font-medium uppercase">
                          {match.type}
                        </span>
                      )}
                    </span>
                    {match.matchedField && match.matchedSnippet && (
                      <span className="text-muted-foreground truncate pl-6 text-xs">
                        {match.matchedField}: {highlightMatch(match.matchedSnippet, value)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runSearch(value)}
                  className="hover:bg-muted flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13.5px] text-muted-foreground"
                >
                  <Search className="size-3.5 shrink-0" />
                  Search {searchForLabel} for &ldquo;{value.trim()}&rdquo;
                </button>
              </li>
            </ul>
          </div>
        )}

        {open && !isTyping && suggestions.length > 0 && (
          <div className="bg-popover text-popover-foreground absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border shadow-md">
            <div className="text-muted-foreground px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-wide uppercase">
              {suggestionsLabel}
            </div>
            <ul className="pb-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => runSearch(suggestion)}
                    className="hover:bg-muted flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13.5px]"
                  >
                    <Search className="text-muted-foreground size-3.5 shrink-0" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className="flex items-center justify-end px-1">
        <span className="text-verified shrink-0 text-xs font-medium" aria-disabled>
          Advanced search
        </span>
      </div>
    </div>
  );
}
