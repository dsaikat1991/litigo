import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CaseStatus } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ongoing gets the app's accent color (it's the active, current state);
// disposed gets a neutral light-grey treatment (concluded, but not archived
// away); archived gets the solid/dark treatment as the most final state.
export function caseStatusBadgeVariant(status: CaseStatus): "default" | "verified" | "secondary" {
  if (status === "ongoing") return "verified";
  if (status === "archived") return "default";
  return "secondary";
}

// Derives a card preview from a memory's content: first non-empty line,
// truncated to a word boundary. There is no stored title — the preview is
// always computed from the current content so it can never go stale.
export function previewText(content: string, maxLen = 50): string {
  const firstLine = content.split("\n").find((line) => line.trim().length > 0) ?? "";
  const trimmed = firstLine.trim();
  if (trimmed.length <= maxLen) return trimmed;
  const cut = trimmed.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

// locale/timeZone are required, not defaulted — they must come from the
// viewer's own profile (see getCurrentProfile), not an ambient runtime
// default. A bare `undefined` here would resolve differently in a Server
// Component (the Node process's default) than in a Client Component (the
// browser's), producing inconsistent formatting for the same viewer.
export function formatDate(iso: string, locale: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  });
}

export function formatDateTime(iso: string, locale: string, timeZone: string): string {
  return new Date(iso).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

// YYYY-MM-DD for the viewer's own calendar day — used for date-only (not
// timestamptz) comparisons like "is this hearing today", where a raw UTC
// day-boundary would be wrong for part of the day in Asia/Kolkata (UTC+5:30).
export function dateKeyInTimeZone(date: Date, timeZone: string): string {
  return date.toLocaleDateString("en-CA", { timeZone });
}

// Pure day-count arithmetic on a YYYY-MM-DD key. Treats the key as UTC
// midnight only for the addition itself (never converted back to a real
// zoned instant), so this is safe even though dateKeyInTimeZone above is
// zone-aware — we're just counting whole days, not resolving a moment in time.
export function addDaysToKey(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Last day of the calendar month containing dateKey, as a YYYY-MM-DD key.
export function monthEndKey(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00Z`);
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  return end.toISOString().slice(0, 10);
}

function displayNameSource(fullName: string | null, email: string | null): string | null {
  if (fullName?.trim()) return fullName.trim();
  if (email) return email.split("@")[0];
  return null;
}

// Normalizes to Title Case regardless of how the name was originally typed
// (e.g. a profile saved as "SAIKAT DAS" shouldn't shout in a greeting) —
// purely a display fix, never written back to the stored full_name.
function toTitleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getFirstName(fullName: string | null, email: string | null): string | null {
  const source = displayNameSource(fullName, email);
  const first = source ? source.split(/\s+/)[0] : null;
  return first ? toTitleCase(first) : null;
}

export function getInitials(fullName: string | null, email: string | null): string {
  const source = displayNameSource(fullName, email);
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return initials.toUpperCase();
}
