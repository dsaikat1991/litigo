import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/logo";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-4">
          <span className="font-heading text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            How it works
          </span>
          <h1 className="font-heading max-w-[22ch] text-3xl font-medium text-balance">
            You already do the work. Litigo just makes sure it doesn&apos;t disappear.
          </h1>
          <p className="text-muted-foreground max-w-lg text-[15px] text-balance">
            No new habits, no daily logging chore. Three moves, done whenever you have a spare
            minute — not when a system demands it.
          </p>
        </div>

        {/* Step 1 — Capture */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-muted-foreground text-sm">01</span>
            <h2 className="font-heading text-xl font-medium">Capture it when it happens</h2>
          </div>
          <p className="text-foreground/90 max-w-lg text-[15px] leading-relaxed">
            Log a case in ten seconds — a title is the only thing required. As the matter moves,
            drop in the argument you actually made, the research behind it, the outcome. Nothing
            has to be complete, and nothing has to happen the same day it does. A fact that
            doesn&apos;t belong to any case yet — a stamp-duty rate, something a judge said
            mid-hearing — goes straight into a standalone Memory instead.
          </p>

          <div className="bg-card rounded-xl border p-4">
            <p className="font-heading text-sm font-medium">Sharma vs. Neeti</p>
            <p className="text-muted-foreground mb-3 text-xs">Civil Suit · Calcutta High Court</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-muted-foreground/80 w-16 shrink-0 text-[10px] font-medium tracking-wider uppercase">
                  Argument
                </span>
                <p className="text-sm">
                  Limitation runs from the date fixed for performance, not the date of agreement —
                  Art. 54.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-muted-foreground/80 w-16 shrink-0 text-[10px] font-medium tracking-wider uppercase">
                  Outcome
                </span>
                <p className="flex items-center gap-1.5 text-sm">
                  <span className="bg-verified/15 text-verified flex size-[16px] shrink-0 items-center justify-center rounded-full">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  Worked — decree for specific performance granted.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-muted-foreground/80 w-16 shrink-0 text-[10px] font-medium tracking-wider uppercase">
                  Lesson
                </span>
                <p className="text-sm">
                  Always plead damages in the alternative alongside specific performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 — Organise */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-muted-foreground text-sm">02</span>
            <h2 className="font-heading text-xl font-medium">Tag it your way, not a system&apos;s</h2>
          </div>
          <p className="text-foreground/90 max-w-lg text-[15px] leading-relaxed">
            There&apos;s no fixed taxonomy to fight with — tags are free-form, because every
            advocate remembers a matter by a different hook: a section number, a client&apos;s
            name, a phrase they&apos;ll never forget. Everything you log under a case — arguments,
            research, memories — stays linked to it automatically. You&apos;re not filing anything
            into folders. The case is the folder.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["limitation", "specific performance", "Article 54", "conveyance deed"].map((tag) => (
              <span
                key={tag}
                className="text-muted-foreground rounded-full border px-2.5 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Step 3 — Reuse */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-muted-foreground text-sm">03</span>
            <h2 className="font-heading text-xl font-medium">Find it again in one search</h2>
          </div>
          <p className="text-foreground/90 max-w-lg text-[15px] leading-relaxed">
            Search across every case, argument, research note, and memory at once — typed the way
            you&apos;d actually think about it, not the way a database expects it. No remembering
            which file it&apos;s in. No re-arguing a point you already won once.
          </p>

          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground mb-3 text-xs">
              Two years later, from the search bar:
            </p>
            <div className="bg-muted/60 mb-3 flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
              <span className="text-sm">developer refused conveyance</span>
            </div>
            <p className="text-sm">
              <span className="text-verified font-medium">→ Sharma vs. Neeti.</span> The argument
              that worked, the authority behind it, and the lesson you took from it — all in one
              result, exactly as you wrote it down.
            </p>
          </div>
        </section>

        <div className="border-t pt-10">
          <p className="font-heading text-muted-foreground mb-6 text-xs tracking-widest uppercase">
            We believe legal experience should compound, not disappear.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
            >
              Start building your memory
            </Link>
            <Link
              href="/"
              className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
