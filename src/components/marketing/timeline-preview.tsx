import { Award, FileInput, Gavel, Square, SquareCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Purely decorative — a static, non-interactive illustration of the real
// per-case Timeline tab (src/components/dashboard/case-timeline.tsx +
// src/app/dashboard/cases/[id]/page.tsx), hand-mirrored the same way
// dashboard-preview.tsx mirrors the dashboard home page. Resync against
// those if they change; this file is never the source of truth.
export function TimelinePreview() {
  return (
    <div
      aria-hidden="true"
      className="bg-card border-border relative w-full overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_56px_-16px_rgba(0,0,0,0.18)]"
    >
      <div className="flex flex-col gap-3 p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight">Sharma vs. ABC Developers</h3>
            <Badge variant="verified" className="shrink-0">
              Ongoing
            </Badge>
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs">
            CS (O) 1234/2023 · Calcutta High Court · Civil Suit
          </p>
        </div>

        <div className="border-border flex flex-wrap gap-3 border-b pb-2.5 text-xs">
          {["Timeline", "Arguments", "Research", "Memory", "Documents", "Tasks"].map((tab, i) => (
            <span
              key={tab}
              className={
                i === 0
                  ? "text-verified border-verified -mb-[11px] border-b-2 pb-2.5 font-medium"
                  : "text-muted-foreground/60"
              }
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-lg border p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <Gavel className="text-muted-foreground size-3.5 shrink-0" />
              <Badge variant="outline" className="font-normal">
                Hearing
              </Badge>
              <p className="text-sm font-medium">Final arguments heard</p>
              <span className="text-muted-foreground ml-auto text-xs">14 Sep</span>
            </div>

            <div>
              <p className="text-muted-foreground text-[10.5px] font-medium tracking-wide uppercase">
                Court direction
              </p>
              <p className="text-[13px]">Judgment reserved; parties to file written notes within a week.</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-[10.5px] font-medium tracking-wide uppercase">
                Tasks before next hearing
              </p>
              <div className="flex items-center gap-2 text-[13px]">
                <SquareCheck className="text-verified size-3.5 shrink-0" />
                <span className="text-muted-foreground line-through">File written notes on arguments</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Square className="text-muted-foreground size-3.5 shrink-0" />
                Collect certified copy of order
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
              <span className="text-muted-foreground">Next hearing </span>
              <span className="font-medium">2 Oct 2026</span>
              <span className="text-muted-foreground"> · Pronouncement of judgment</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border p-3.5">
            <FileInput className="text-muted-foreground size-3.5 shrink-0" />
            <Badge variant="outline" className="font-normal">
              Filing
            </Badge>
            <p className="flex-1 text-sm font-medium">Written statement filed</p>
            <span className="text-muted-foreground text-xs">2 Jun</span>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border p-3.5">
            <Award className="text-muted-foreground size-3.5 shrink-0" />
            <Badge variant="outline" className="font-normal">
              Judgment
            </Badge>
            <p className="flex-1 text-sm font-medium">Interim relief granted</p>
            <span className="text-muted-foreground text-xs">11 Mar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
