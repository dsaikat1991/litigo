import Link from "next/link";
import { EyeOff, Lock, Play, PenLine } from "lucide-react";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { MemorySearchPreview } from "@/components/marketing/memory-search-preview";
import {
  CaptureIcon,
  BuildIcon,
  FindIcon,
  SearchDepthIcon,
  CompoundGrowthIcon,
  OwnershipIcon,
  SpeedIcon,
} from "@/components/marketing/capture-build-find";
import { SiteHeader } from "@/components/marketing/site-header";

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

const WHY_POINTS = [
  {
    Icon: SearchDepthIcon,
    title: "Search beyond file names",
    description:
      "Find cases by arguments, legal issues, parties, judgments or your own notes.",
  },
  {
    Icon: CompoundGrowthIcon,
    title: "Experience compounds",
    description: "Turn every matter into knowledge you can reuse in the next one.",
  },
  {
    Icon: OwnershipIcon,
    title: "You own your work",
    description: "Your legal knowledge remains yours, always.",
  },
  {
    Icon: SpeedIcon,
    title: "Designed for speed",
    description: "Find what matters in seconds and stay focused on your practice.",
  },
] as const;

const TRUST_POINTS = [
  {
    Icon: Lock,
    title: "Isolated at the database level",
    description:
      "Row-level security scopes every account's cases, arguments, and memories to that account alone — enforced by the database itself, not just filtered in the app.",
  },
  {
    Icon: EyeOff,
    title: "Never shared. Never sold.",
    description:
      "What you write down stays yours. Nothing is shared across accounts, and nothing is used to train any AI model.",
  },
  {
    Icon: PenLine,
    title: "You decide what's captured",
    description:
      "Nothing is logged automatically. Every entry — a case, an argument, a memory — is something you chose to write down.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-14 overflow-x-hidden sm:gap-20">
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

        <div className="relative mt-2 border-b">
          {/* Bridges the dashboard's own fade-out into this section instead
              of a flat, empty gap between them — same ambient-glow language
              used at the hero and around the dashboard card, just extended
              into the one transition on the page that didn't have it yet. */}
          <div
            aria-hidden="true"
            className="bg-verified/8 pointer-events-none absolute inset-x-0 -top-16 mx-auto h-56 w-56 rounded-full blur-3xl"
          />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 pt-6 pb-14 px-4 text-left sm:px-8 sm:pt-8 sm:pb-20">
            <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Your legal experience compounds with every case.
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
                    <span className="font-mono text-muted-foreground/50 text-xs tracking-wider">
                      {step.number}
                    </span>
                    <Icon className="text-foreground/80 h-40 w-auto self-center" />
                    <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
                    <p className="font-manrope text-muted-foreground/80 text-sm leading-relaxed">
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

          <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-8 sm:pb-32">
            <MemorySearchPreview />
          </div>
        </div>

        {/* A 2x2 benefits grid using the same isometric-illustration family
            as the Capture/Build/Find section above, so the two illustrated
            sections read as one visual language rather than the icon set
            switching languages partway down the page. */}
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 text-left sm:px-8 sm:py-24">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why Litigo</h2>
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
              {WHY_POINTS.map((point) => {
                const Icon = point.Icon;
                return (
                  <div key={point.title} className="flex flex-col items-start gap-3 text-left">
                    <Icon className="text-foreground/80 h-24 w-auto" />
                    <h3 className="text-base font-semibold tracking-tight">{point.title}</h3>
                    <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deliberately plain and direct — no icons-with-colored-badges, no
            editorial illustration, no interactive demo. A trust section
            about confidentiality reads as more credible when it looks
            serious rather than "on-brand playful", which is why this one
            breaks from every visual treatment used above it. */}
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 text-left sm:px-8 sm:py-24">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                Privacy, by design
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Client confidentiality doesn&apos;t stop at your case files.
              </h2>
              <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
                Litigo is built for a profession where confidentiality isn&apos;t optional —
                the same discipline applies to how your own data is handled.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TRUST_POINTS.map((point) => {
                const Icon = point.Icon;
                return (
                  <div key={point.title} className="flex flex-col gap-3 rounded-lg border p-4">
                    <Icon className="text-muted-foreground size-5" />
                    <h3 className="text-sm font-semibold tracking-tight">{point.title}</h3>
                    <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Closing CTA — the page had no final call-to-action before this;
            it just ended after the last content section. A soft verified
            tint (not a new color, same token used at low opacity
            elsewhere) marks it as the page's closing beat before the
            footer, without needing a hard border to separate it. */}
        <div className="bg-verified/5 border-t">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-8 sm:py-28">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Your legal memory starts with the next case you open.
            </h2>
            <p className="font-manrope text-muted-foreground max-w-md text-lg leading-relaxed text-balance">
              Two minutes to set up. No credit card, no migration, no new habit to learn.
            </p>
            <Link
              href="/signup"
              className="bg-foreground text-background mt-2 rounded-lg px-6 py-3 text-sm font-medium"
            >
              Start building your memory
            </Link>
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
