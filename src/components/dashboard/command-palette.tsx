"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, FolderPlus, Search, UserRound } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { NewCaseDialog } from "@/components/dashboard/new-case-dialog";
import { AddMemoryDialog } from "@/components/dashboard/add-memory-dialog";

export function CommandPalette({ cases }: { cases: { id: string; title: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function handleOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("litigo:open-command-palette", handleOpenRequest);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("litigo:open-command-palette", handleOpenRequest);
    };
  }, []);

  // Reset the search text each time the palette closes, so it doesn't reopen
  // showing a stale query from last time.
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery("");
  }

  function runSearch() {
    const trimmed = query.trim();
    setOpen(false);
    router.push(trimmed ? `/dashboard?q=${encodeURIComponent(trimmed)}` : "/dashboard");
  }

  const trimmedQuery = query.trim();

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Command palette"
        description="Jump to a case, capture a memory, or search your legal memory."
      >
        <Command>
          <CommandInput
            placeholder="Search cases, or type a command…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>

            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setNewCaseOpen(true);
                }}
              >
                <FolderPlus />
                New case
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setAddMemoryOpen(true);
                }}
              >
                <FilePlus />
                Add memory
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push("/dashboard/profile");
                }}
              >
                <UserRound />
                View profile
              </CommandItem>
            </CommandGroup>

            {cases.length > 0 && (
              <CommandGroup heading="Cases">
                {cases.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={`case-${c.title}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/dashboard/cases/${c.id}`);
                    }}
                  >
                    {c.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* This item's value always contains the current query, so cmdk's
                fuzzy filter always keeps it visible while there's a query —
                a real, keyboard-selectable fallback rather than a raw button
                floating outside cmdk's own item/selection model. */}
            {trimmedQuery && (
              <CommandGroup heading="Search">
                <CommandItem value={`search ${trimmedQuery}`} onSelect={runSearch}>
                  <Search />
                  Search your legal memory for &ldquo;{trimmedQuery}&rdquo;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>

      <NewCaseDialog open={newCaseOpen} onOpenChange={setNewCaseOpen} />
      <AddMemoryDialog open={addMemoryOpen} onOpenChange={setAddMemoryOpen} />
    </>
  );
}
