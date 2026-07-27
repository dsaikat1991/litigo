import Link from "next/link";

const LINKED_TABS = [
  { key: "cases", label: "Cases", href: "/dashboard/cases" },
  { key: "memories", label: "Memories", href: "/dashboard/memories" },
] as const;

// Arguments/Research have no cross-case browsing view yet (notes only exist
// scoped to a single case today); Documents/People need infrastructure that
// doesn't exist yet (document storage, structured opposing-party data).
// Shown for layout parity with the product vision, disabled rather than faked.
const COMING_SOON_TABS = ["Arguments", "Research", "Documents", "People"] as const;

export function ContentTypeTabs() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-medium">
        All
      </span>
      {LINKED_TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-1.5 text-xs font-medium"
        >
          {tab.label}
        </Link>
      ))}
      {COMING_SOON_TABS.map((label) => (
        <span
          key={label}
          aria-disabled
          title="Coming soon"
          className="text-muted-foreground/50 cursor-not-allowed rounded-lg px-3 py-1.5 text-xs font-medium"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
