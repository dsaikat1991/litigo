"use client";

import { useEffect, useState } from "react";

const WORDS = ["findable", "reusable", "compounding"];
const LONGEST_WORD = "compounding";
const HOLD_MS = 1800;
const DELETE_MS = 45;
const PAUSE_MS = 350;
const TYPE_MS = 70;

type Phase = "hold" | "deleting" | "pause" | "typing";

// Server-rendered with the first word already fully typed — the cycling
// animation only starts after mount, so it never delays what gets measured
// as the hero heading's first paint/LCP text (this exact heading has shown
// up as the LCP element in this app's own PageSpeed data before). Respects
// prefers-reduced-motion by simply never starting the cycle.
export function AnimatedHeadlineWord() {
  const [text, setText] = useState(WORDS[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("hold");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "hold") {
      timeout = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      timeout =
        text.length > 0
          ? setTimeout(() => setText((t) => t.slice(0, -1)), DELETE_MS)
          : setTimeout(() => setPhase("pause"), 0);
    } else if (phase === "pause") {
      timeout = setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setPhase("typing");
      }, PAUSE_MS);
    } else {
      const target = WORDS[wordIndex];
      timeout =
        text.length < target.length
          ? setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS)
          : setTimeout(() => setPhase("hold"), 0);
    }

    return () => clearTimeout(timeout);
  }, [phase, text, wordIndex]);

  return (
    <>
      {/* CSS-grid stacking trick: the invisible sizer (longest word + period)
          and the visible mark share one grid cell, so the column's width is
          permanently set by "compounding." — the line's width never changes
          as shorter/longer words type in, even though nothing was measured
          in JS. The visible content stays left-aligned inside that reserved
          box, so the trailing period always sits immediately after the
          current word instead of jumping to a fixed position. */}
      <span className="relative inline-grid text-left align-baseline">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {LONGEST_WORD}.
        </span>
        <span className="col-start-1 row-start-1 whitespace-nowrap justify-self-start">
          {/* Same highlighter-mark motif already used for search-match
              highlighting (search-bar.tsx) — the marker-pen metaphor an
              advocate reaches for on a physical page. */}
          <mark className="rounded-[3px] bg-yellow-200/80 px-1 text-inherit">
            {text}
            <span className="bg-foreground animate-caret-blink ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.12em] align-middle" />
          </mark>
          .
        </span>
      </span>
      <span className="sr-only">findable, reusable, and compounding</span>
    </>
  );
}
