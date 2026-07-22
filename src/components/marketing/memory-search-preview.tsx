import { Check, CornerDownLeft, Search } from "lucide-react";

const facets = [
  {
    label: "ARGUMENT",
    body: "Limitation runs from the date fixed for performance, not the date of agreement — Art. 54.",
  },
  {
    label: "RESEARCH",
    body: "Article 54, Limitation Act 1963 — 3-year period from notice of refusal.",
  },
  {
    label: "OUTCOME",
    body: "Worked — decree for specific performance granted.",
    dot: true,
  },
  {
    label: "LESSON",
    body: "Always plead damages in the alternative alongside specific performance.",
  },
];

export function MemorySearchPreview() {
  return (
    <div className="relative flex items-center justify-center py-10">
      <div
        aria-hidden
        className="bg-verified/15 pointer-events-none absolute h-[26rem] w-[26rem] rounded-full blur-2xl"
      />
      <div className="bg-card border-border relative w-full max-w-sm rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-14px_rgba(0,0,0,0.16)]">
        <div className="bg-muted/60 flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <span className="flex-1 text-sm">
            developer refused conveyance
            <span
              aria-hidden
              className="bg-muted-foreground animate-caret-blink ml-0.5 inline-block h-3.5 w-px translate-y-0.5"
            />
          </span>
          <CornerDownLeft className="text-muted-foreground size-3.5 shrink-0" />
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t pt-3.5">
          <div className="flex items-start gap-2.5">
            <span className="bg-verified/15 text-verified mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full">
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <div>
              <div className="font-heading text-sm font-medium">Sharma vs. ABC Developers</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]">
                  Specific Performance
                </span>
                <span className="text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]">
                  High Court
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {facets.map((facet) => (
              <div key={facet.label} className="flex flex-col gap-1 rounded-lg border p-2.5">
                <span className="font-heading text-muted-foreground/80 text-[9.5px] font-medium tracking-wider">
                  {facet.label}
                </span>
                <span className="flex items-baseline gap-1.5 text-[11.5px] leading-snug">
                  {facet.dot && (
                    <span className="bg-verified inline-block size-1.5 shrink-0 rounded-full" />
                  )}
                  {facet.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
