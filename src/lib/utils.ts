import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function displayNameSource(fullName: string | null, email: string | null): string | null {
  if (fullName?.trim()) return fullName.trim();
  if (email) return email.split("@")[0];
  return null;
}

export function getFirstName(fullName: string | null, email: string | null): string | null {
  const source = displayNameSource(fullName, email);
  return source ? source.split(/\s+/)[0] : null;
}

export function getInitials(fullName: string | null, email: string | null): string {
  const source = displayNameSource(fullName, email);
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return initials.toUpperCase();
}
