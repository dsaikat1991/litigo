import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { MemorySearchPreview } from "@/components/marketing/memory-search-preview";
import { CaptureIcon, BuildIcon, FindIcon } from "@/components/marketing/capture-build-find";

const STEPS = [
  {
    number: "01",
    Icon: CaptureIcon,
    title: "Capture what matters.",
    description:
      "Log the argument, the research, the outcome — in the moment, not reconstructed from memory months later.",
  },
  {
    number: "02",
    Icon: BuildIcon,
    title: "Build your litigation memory.",
    description:
      "Everything you capture becomes part of one growing record, linked to the matter it came from.",
  },
  {
    number: "03",
    Icon: FindIcon,
    title: "Find it when it matters most.",
    description:
      "Search across every case at once — the fact you need is always one query away.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-14 sm:gap-20">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pt-28 text-left sm:px-8 sm:pt-40 lg:pt-48">
          <div
            aria-hidden="true"
            className="bg-verified/10 pointer-events-none absolute top-0 left-0 h-[32rem] w-[32rem] rounded-full blur-3xl"
          />
          <h1 className="text-[2.4rem] leading-[1.3] font-bold tracking-tight sm:text-[3.2rem] lg:text-[4rem]">
            Your legal memory, finally
            <br />
            findable.
          </h1>
          <p className="font-manrope text-muted-foreground max-w-2xl text-lg leading-snug text-balance">
            Litigo remembers every argument, research note and lesson — so that you can instantly
            find and reuse them, even decades later.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
            >
              Start building your memory
            </Link>
            <Link
              href="/how-it-works"
              className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Play className="size-3 fill-current" />
              Watch 90-second demo
            </Link>
          </div>
        </div>

        <div className="-mt-2 mx-auto w-full max-w-[99rem] px-2 sm:px-4">
          <DashboardPreview />
        </div>

        <div className="mt-2 border-b">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 pt-6 pb-14 px-4 text-left sm:px-8 sm:pt-8 sm:pb-20">
            <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Your legal learning compounds with every case.
            </h2>
            <p className="font-manrope text-muted-foreground max-w-2xl text-lg leading-relaxed text-balance">
              Every case, every argument, every research note and every lesson becomes part of a
              legal memory that grows with your practice—instantly searchable years later.
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-8 sm:pb-28">
            {/* Horizontal spacing comes entirely from padding (pr on the
                first column, px on the middle one, pl on the last), not
                the grid gap — that's what makes the space on both sides
                of each divider line come out equal. Using the grid's own
                gap for this too (its usual job) would have stacked an
                extra, uneven amount on top of just one side of each
                divider instead. */}
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-0">
              {STEPS.map((step, i) => {
                const Icon = step.Icon;
                const paddingClass =
                  i === 0 ? "sm:pr-10" : i === STEPS.length - 1 ? "sm:border-l sm:border-border sm:pl-10" : "sm:border-l sm:border-border sm:px-10";
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col items-start gap-4 text-left ${paddingClass}`}
                  >
                    <span className="font-mono text-muted-foreground text-xs tracking-wider">
                      {step.number}
                    </span>
                    <Icon
                      className="text-muted-foreground/70 animate-icon-float size-14"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                    <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                    <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {/* Heading-left, description-right — a two-column split instead
              of a stacked block, deliberately not a repeat of the previous
              section's treatment. No text highlighting here. */}
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pt-20 pb-10 text-left sm:grid-cols-2 sm:items-center sm:px-8 sm:pt-28">
            <h2 className="text-left text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find what you&apos;ve
              <br />
              already learned.
            </h2>
            <p className="font-manrope text-muted-foreground text-right text-lg leading-relaxed text-balance">
              Instantly surface the arguments, research, strategy and lessons you&apos;ve built over
              years of practice—without digging through folders or old files.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl px-4 pb-24 sm:px-8 sm:pb-32">
            <MemorySearchPreview />
          </div>
        </div>
      </main>

      <footer className="border-t px-4 py-6 sm:px-8">
        <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <nav className="order-2 flex items-center gap-4 sm:order-1 sm:justify-self-start">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest"
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest"
            >
              How It Works
            </Link>
          </nav>

          <p className="order-1 text-center text-xs tracking-widest text-muted-foreground uppercase sm:order-2">
            We believe legal experience should compound, not disappear.
          </p>

          <nav className="order-3 flex items-center gap-4 sm:justify-self-end">
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
