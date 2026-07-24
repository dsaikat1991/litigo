"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PracticeArea } from "@/lib/types";

export interface Selection {
  id?: string;
  name: string;
}

export function PracticeAreaPicker({
  practiceAreas,
  initialSelected = [],
}: {
  practiceAreas: PracticeArea[];
  initialSelected?: Selection[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Selection[]>(initialSelected);

  const trimmed = query.trim();
  const isSelected = (name: string) =>
    selected.some((s) => s.name.toLowerCase() === name.toLowerCase());

  const matches = practiceAreas
    .filter((pa) => !isSelected(pa.name))
    .filter((pa) => !trimmed || pa.name.toLowerCase().includes(trimmed.toLowerCase()))
    .slice(0, 6);

  const canCreate = trimmed.length > 0 && !isSelected(trimmed) && !matches.some(
    (pa) => pa.name.toLowerCase() === trimmed.toLowerCase(),
  );

  function addExisting(pa: PracticeArea) {
    setSelected((s) => [...s, { id: pa.id, name: pa.name }]);
    setQuery("");
  }

  function addNew() {
    if (!trimmed) return;
    setSelected((s) => [...s, { name: trimmed }]);
    setQuery("");
  }

  function remove(name: string) {
    setSelected((s) => s.filter((x) => x.name !== name));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="practice-area-input">Practice areas</Label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span
              key={s.name}
              className="bg-muted flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
            >
              {s.name}
              <button
                type="button"
                onClick={() => remove(s.name)}
                aria-label={`Remove ${s.name}`}
                className="cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          id="practice-area-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (matches[0]) addExisting(matches[0]);
              else if (canCreate) addNew();
            }
            if (e.key === "Escape") e.currentTarget.blur();
          }}
          placeholder="Search or add a practice area…"
          autoComplete="off"
        />
        {open && (matches.length > 0 || canCreate) && (
          <div className="bg-popover text-popover-foreground absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border shadow-md">
            <ul className="max-h-56 overflow-y-auto py-1">
              {matches.map((pa) => (
                <li key={pa.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addExisting(pa)}
                    className="hover:bg-muted w-full px-3 py-1.5 text-left text-sm"
                  >
                    {pa.name}
                  </button>
                </li>
              ))}
              {canCreate && (
                <li>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={addNew}
                    className="hover:bg-muted text-verified w-full px-3 py-1.5 text-left text-sm"
                  >
                    Create &ldquo;{trimmed}&rdquo;
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {selected
        .filter((s) => s.id)
        .map((s) => (
          <input key={s.id} type="hidden" name="practice_area_ids" value={s.id} />
        ))}
      {selected
        .filter((s) => !s.id)
        .map((s) => (
          <input key={s.name} type="hidden" name="new_practice_areas" value={s.name} />
        ))}
    </div>
  );
}
