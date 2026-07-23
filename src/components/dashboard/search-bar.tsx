"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addRecentSearch, getRecentSearches } from "@/lib/recent-searches";

export function SearchBar({
  defaultValue,
  exampleQueries,
}: {
  defaultValue: string;
  exampleQueries: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // localStorage is a client-only external system, unavailable during SSR —
    // reading it and syncing into state on mount is the correct pattern here,
    // not the derived-state antipattern this rule normally guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(getRecentSearches());
  }, []);

  function runSearch(query: string) {
    const trimmed = query.trim();
    setOpen(false);
    if (!trimmed) {
      router.push("/dashboard");
      return;
    }
    setValue(trimmed);
    setRecent(addRecentSearch(trimmed));
    router.push(`/dashboard?q=${encodeURIComponent(trimmed)}`);
  }

  function clearSearch() {
    setValue("");
    setOpen(false);
    router.push("/dashboard");
  }

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
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.blur();
            }}
            placeholder="Search your legal memory…"
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

        {open && suggestions.length > 0 && (
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
