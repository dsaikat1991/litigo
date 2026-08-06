"use client";

import { useEffect, useRef, useState } from "react";
import { Award, BookOpen, Gavel, Lightbulb, MessagesSquare, Search } from "lucide-react";

interface Callout {
  label: string;
  description: string;
  // Percentage position down the hero image where this callout's leader
  // line lands, and which side of the image it sits on — alternating sides
  // reads as an intentional zigzag rather than a literal pixel-accurate
  // pointer at the underlying mock (which would break the moment the mock's
  // own layout shifts even slightly).
  top: number;
  side: "left" | "right";
}

const CALLOUTS: Callout[] = [
  {
    label: "Search",
    description:
      "Search beyond file names. Find cases by arguments, legal issues, judges, parties or your own notes.",
    top: 10,
    side: "left",
  },
  {
    label: "Timeline",
    description: "Every step of the matter, preserved from filing to final order.",
    top: 32,
    side: "right",
  },
  {
    label: "Arguments",
    description: "Capture submissions that worked—and those that didn't.",
    top: 52,
    side: "left",
  },
  {
    label: "Research",
    description: "Judgments, statutes and articles stay linked to the case they informed.",
    top: 72,
    side: "right",
  },
  {
    label: "Lessons",
    description: "Turn today's hearing into tomorrow's advantage.",
    top: 90,
    side: "left",
  },
];

const TABS = [
  { label: "Timeline", active: true },
  { label: "Arguments", active: false },
  { label: "Research", active: false },
  { label: "Memory", active: false },
  { label: "Documents", active: false },
  { label: "Tasks", active: false },
];

// The one hero image this whole section is built around — a composite of
// the search bar (dashboard) and a case's Timeline tab (case detail page),
// deliberately fused into one shot rather than a literal single screenshot,
// since no single real screen shows all five callout targets at once.
// Strictly monochrome, no accent color, matching the brief.
function ShowcaseMock() {
  return (
    <div
      aria-hidden="true"
      className="border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_64px_-20px_rgba(0,0,0,0.16)] relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border"
    >
      <div className="border-border bg-muted/30 flex items-center gap-1.5 border-b px-4 py-2.5">
        <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
        <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
        <span className="bg-muted-foreground/20 size-2.5 rounded-full" />
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="border-border bg-muted/20 flex items-center gap-2.5 rounded-xl border px-4 py-3">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <span className="text-muted-foreground text-sm">developer refused conveyance</span>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight">Sharma vs. ABC Developers</h3>
            <span className="border-border text-muted-foreground shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium">
              Ongoing
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs">
            CS (O) 1234/2023 · Calcutta High Court · Civil Suit
          </p>
        </div>

        <div className="border-border flex flex-wrap gap-4 border-b pb-2.5 text-xs">
          {TABS.map((tab) => (
            <span
              key={tab.label}
              className={
                tab.active
                  ? "text-foreground border-foreground -mb-[11px] border-b-2 pb-2.5 font-medium"
                  : "text-muted-foreground/60"
              }
            >
              {tab.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-lg border p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <Gavel className="text-muted-foreground size-3.5 shrink-0" />
              <span className="border-border text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]">
                Hearing
              </span>
              <p className="text-sm font-medium">Final arguments heard</p>
              <span className="text-muted-foreground ml-auto text-xs">14 Sep</span>
            </div>
            <p className="text-muted-foreground text-[13px]">
              Judgment reserved; parties to file written notes within a week.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <MessagesSquare className="size-3" />4 arguments
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <BookOpen className="size-3" />2 research notes
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Lightbulb className="size-3" />1 lesson
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border p-3.5">
            <Award className="text-muted-foreground size-3.5 shrink-0" />
            <span className="border-border text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]">
              Judgment
            </span>
            <p className="flex-1 text-sm font-medium">Interim relief granted</p>
            <span className="text-muted-foreground text-xs">11 Mar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  // Reduced-motion users start already "visible" — decided in the lazy
  // initializer, not by calling setState from inside the effect below,
  // which would fire a synchronous render-triggering update during commit.
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="border-t">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 pt-20 pb-14 text-center sm:px-8 sm:pt-28 sm:pb-20">
        <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Everything you&apos;ve learned. One search away.
        </h2>
        <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
          Every case, argument, research note and lesson lives in one connected legal
          memory—organized automatically and ready whenever your next matter demands it.
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-8 sm:pb-32">
        {/* Image and callouts share ONE relative wrapper so `top: N%` on
            each callout resolves against the image's own actual rendered
            height, not some separately-guessed height — callouts positioned
            against a sibling container with no intrinsic size of its own
            were landing nowhere near the image. This wrapper is wider
            (max-w-7xl row) than the centered image (max-w-3xl) specifically
            so left:0/right:0 callouts land in the side margins beside it,
            not on top of it. */}
        <div
          className={`relative mx-auto transition-all duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-3xl">
            <ShowcaseMock />
          </div>

          {/* Leader-line callouts: desktop/large only. Below lg there isn't
              room in the side margins for a line + label without either
              overlapping the mock or wrapping so tight it stops reading as
              a quiet annotation — so small screens get the plain stacked
              list underneath instead. */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {CALLOUTS.map((callout, i) => (
              <div
                key={callout.label}
                className="pointer-events-auto absolute w-48 transition-all duration-500 ease-out"
                style={{
                  top: `${callout.top}%`,
                  [callout.side]: 0,
                  transitionDelay: visible ? `${300 + i * 120}ms` : "0ms",
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "translateY(0)"
                    : `translateY(6px) translateX(${callout.side === "left" ? "-6px" : "6px"})`,
                }}
              >
                <div
                  className={`flex items-start gap-3 ${callout.side === "right" ? "flex-row-reverse text-right" : ""}`}
                >
                  <span
                    className="bg-border h-px shrink-0"
                    style={{
                      width: "2rem",
                      transitionDelay: visible ? `${300 + i * 120}ms` : "0ms",
                      transitionProperty: "transform",
                      transitionDuration: "500ms",
                      transitionTimingFunction: "ease-out",
                      transform: visible ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: callout.side === "left" ? "left" : "right",
                    }}
                  />
                  <div>
                    <p className="text-foreground text-sm font-medium">{callout.label}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                      {callout.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col gap-6 lg:hidden">
          {CALLOUTS.map((callout) => (
            <div key={callout.label}>
              <p className="text-foreground text-sm font-medium">{callout.label}</p>
              <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                {callout.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
