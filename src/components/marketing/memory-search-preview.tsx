"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface MatchEntry {
  type: string;
  title: string;
  subtitle?: string;
  highlightIn?: "title" | "subtitle";
}

interface WordEntry {
  word: string;
  matches: MatchEntry[];
}

// Draft copy — invented to fit the "shared prefix" morph below, not
// supplied like the divorce/specific-relief content earlier in this file's
// history. Swap in real case names/notes if these don't fit.
const WORDS: WordEntry[] = [
  {
    word: "divorce",
    matches: [
      {
        type: "CASE",
        title: "Joyjeet Saha v. Mousomi Pan",
        subtitle: "Matched in: Legal Issue • Divorce",
        highlightIn: "subtitle",
      },
      {
        type: "RESEARCH",
        title: "Section 13B, Hindu Marriage Act",
        subtitle: "Procedure for divorce by mutual consent.",
        highlightIn: "subtitle",
      },
      {
        type: "ARGUMENT",
        title: "Irretrievable breakdown of the marriage justified divorce.",
        highlightIn: "title",
      },
      {
        type: "LESSON",
        title: "In divorce matters, courts prioritise child welfare over fault.",
        highlightIn: "title",
      },
    ],
  },
  {
    word: "dissolution",
    matches: [
      {
        type: "CASE",
        title: "Basu & Sons v. Ratan Basu",
        subtitle: "Matched in: Legal Issue • Dissolution of Partnership",
        highlightIn: "subtitle",
      },
      {
        type: "RESEARCH",
        title: "Section 44, Partnership Act",
        subtitle: "Grounds for dissolution of a firm by the court.",
        highlightIn: "subtitle",
      },
      {
        type: "ARGUMENT",
        title: "Partner's continued default justified dissolution under Section 44.",
        highlightIn: "title",
      },
      {
        type: "LESSON",
        title: "Accounts must be settled before dissolution takes effect.",
        highlightIn: "title",
      },
    ],
  },
  {
    word: "disposition",
    matches: [
      {
        type: "CASE",
        title: "Estate of Ramesh Dutta",
        subtitle: "Matched in: Legal Issue • Testamentary Disposition",
        highlightIn: "subtitle",
      },
      {
        type: "RESEARCH",
        title: "Doctrine of testamentary disposition",
        subtitle: "Validity of bequests examined under the Indian Succession Act.",
        highlightIn: "title",
      },
      {
        type: "ARGUMENT",
        title: "Disposition in the will was unambiguous and enforceable as executed.",
        highlightIn: "title",
      },
      {
        type: "LESSON",
        title: "Ambiguous dispositions invite prolonged probate litigation.",
        highlightIn: "title",
      },
    ],
  },
];

const TYPE_MS = 70;
const BACKSPACE_MS = 32;
const HOLD_MS = 2200;

function commonPrefixLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++;
  return i;
}

function Highlighted({ text, query, active }: { text: string; query: string; active: boolean }) {
  if (!active) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-foreground rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// Server-rendered (and reduced-motion) state is the first word, already
// fully typed and highlighted — the same "already complete" pattern used
// elsewhere on this page. Motion users get a continuous loop that morphs
// between "divorce" → "dissolution" → "disposition" → back to "divorce":
// each transition only backspaces down to the two words' shared prefix
// ("di", then "dis", then "di" again) and types the rest of the next word
// forward from there, rather than clearing to empty and retyping from
// scratch. The query box — and the matches panel below it — is therefore
// never empty at any point in the loop.
export function MemorySearchPreview() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(WORDS[0].word);
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    function runCycle(qi: number) {
      const current = WORDS[qi].word;
      const next = (qi + 1) % WORDS.length;
      const target = WORDS[next].word;
      const prefixLen = commonPrefixLength(current, target);

      function typeChar(i: number) {
        if (cancelled) return;
        setText(target.slice(0, i));
        setSettled(i === target.length);
        if (i < target.length) {
          setTimeout(() => typeChar(i + 1), TYPE_MS);
        } else {
          setWordIndex(next);
          setTimeout(() => runCycle(next), HOLD_MS);
        }
      }

      function eraseChar(j: number) {
        if (cancelled) return;
        setSettled(false);
        setText(current.slice(0, j));
        if (j > prefixLen) {
          setTimeout(() => eraseChar(j - 1), BACKSPACE_MS);
        } else {
          typeChar(prefixLen);
        }
      }

      eraseChar(current.length);
    }

    // Deferred (not called directly in the effect body) so every state
    // update in this sequence happens inside a timer callback, not
    // synchronously during the render effect.
    const start = setTimeout(() => runCycle(0), HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  const current = WORDS[wordIndex];

  return (
    <div className="relative w-full py-6">
      <div className="relative flex w-full min-h-[460px] flex-col p-4">
        <div className="border-border flex items-center gap-3 rounded-xl border px-5 py-4">
          <Search className="text-muted-foreground size-5 shrink-0" />
          <span className="flex-1 text-base">
            {text}
            <span
              aria-hidden
              className="bg-muted-foreground animate-caret-blink ml-0.5 inline-block h-4 w-px translate-y-0.5"
            />
          </span>
          <X className="text-muted-foreground size-[18px] shrink-0" />
          <SlidersHorizontal className="text-muted-foreground size-[18px] shrink-0" />
        </div>

        <div className="bg-muted/50 border-border mt-4 rounded-xl border p-5">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
            Matches
          </p>
          <div className="mt-3 flex flex-col gap-4">
            {current.matches.map((match) => (
              <div key={match.type + match.title} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">
                    <Highlighted
                      text={match.title}
                      query={current.word}
                      active={settled && match.highlightIn === "title"}
                    />
                  </p>
                  {match.subtitle && (
                    <p className="text-muted-foreground text-[13px]">
                      <Highlighted
                        text={match.subtitle}
                        query={current.word}
                        active={settled && match.highlightIn === "subtitle"}
                      />
                    </p>
                  )}
                </div>
                <span className="text-muted-foreground border-border mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold tracking-wider uppercase">
                  {match.type}
                </span>
              </div>
            ))}
          </div>
          <div className="border-border mt-4 flex items-center gap-2 border-t pt-3">
            <Search className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-[15px]">
              Search your legal memory for &ldquo;{text}&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
