import Link from "next/link";
import { ArrowLeft, EyeOff, Lock, Play, PenLine, Zap } from "lucide-react";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { MemorySearchPreview } from "@/components/marketing/memory-search-preview";
import { SiteHeader } from "@/components/marketing/site-header";

// `href: null` marks a page that doesn't exist yet — rendered as plain
// text rather than a link so the footer never points somewhere that 404s.
// Swap in a real href once each page is built.
const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: null, label: "Features" },
      { href: null, label: "Pricing" },
      { href: null, label: "Security" },
      { href: null, label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: null, label: "Our Story" },
      { href: null, label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: null, label: "Blog" },
      { href: null, label: "Documentation" },
      { href: null, label: "Help Centre" },
      { href: null, label: "Product Updates" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: null, label: "Cookie Policy" },
      { href: null, label: "Security Policy" },
      { href: null, label: "Data Processing Agreement (DPA)" },
      { href: null, label: "Acceptable Use Policy" },
      { href: null, label: "AI Transparency" },
    ],
  },
] as const;

// Social handles don't exist yet — rendered as plain (non-linking) icon
// tiles until real profiles are created, same placeholder convention as
// the FOOTER_COLUMNS links above.
const SOCIAL_LINKS = [
  { label: "LinkedIn", initials: "in" },
  { label: "Facebook", initials: "f" },
  { label: "Instagram", initials: "ig" },
  { label: "YouTube", initials: "yt" },
] as const;

// These SVGs each fill their own viewBox with no meaningful padding, so
// (unlike the earlier revision of these files) a single shared height is
// enough to make all three read as the same size — no per-icon
// compensation needed.
const STEPS = [
  {
    number: "01",
    icon: "/icons/capture_legal_knowledge.svg",
    title: "Capture what matters.",
    description:
      "Log the argument, the research, the outcome — in the moment, not reconstructed from memory months later.",
  },
  {
    number: "02",
    icon: "/icons/litigation_memory.svg",
    title: "Build your litigation memory.",
    description:
      "Everything you capture becomes part of one growing record, linked to the matter it came from.",
  },
  {
    number: "03",
    icon: "/icons/search.svg",
    title: "Find it when it matters most.",
    description:
      "Search across every case at once — the fact you need is always one query away.",
  },
] as const;

// Used twice: as plain text next to the "Built for Litigators" search demo,
// and further down in its own icon grid ("Why Litigo") — kept side by side
// deliberately for now while the two sections get fine-tuned; `icon` is
// only read by the icon-grid rendering.
const WHY_POINTS = [
  {
    icon: "/icons/why_search.svg",
    title: "Search beyond file names",
    description:
      "Find cases by arguments, legal issues, parties, judgments or your own notes.",
  },
  {
    icon: "/icons/why_ec.svg",
    title: "Experience compounds",
    description: "Turn every matter into knowledge you can reuse in the next one.",
  },
  {
    icon: "/icons/why_own_work.svg",
    title: "You own your work",
    description: "Your legal knowledge remains yours, always.",
  },
  {
    icon: "/icons/why_speed.svg",
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
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pt-28 text-left sm:px-8 sm:pt-40 lg:pt-48">
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

        <div className="mt-[22px] mx-auto w-full max-w-[99rem] px-2 sm:px-4">
          <DashboardPreview />
        </div>

        <div className="mt-2 border-b">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 pt-6 pb-14 px-4 text-left sm:px-8 sm:pt-8 sm:pb-20">
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
                    {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, no benefit from next/image's optimization pipeline */}
                    <img src={step.icon} alt="" className="h-[252px] w-auto self-center" />
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

        {/* "Built for Litigators" — a compact version of the same search
            demo shown again (full two-panel) in "Find what you've already
            learned" below, sitting beside the same four points shown again
            as plain text here. Deliberately duplicated content for now —
            both sections are still being fine-tuned, not a final decision. */}
        <div>
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 pt-20 pb-10 text-center sm:px-8 sm:pt-28">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Built for Litigators
            </h2>
            <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
              Purpose-built for advocates who believe every case should make the next one
              stronger.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 pb-24 sm:grid-cols-2 sm:items-start sm:px-8 sm:pb-32">
            <MemorySearchPreview compact />
            <div className="flex flex-col gap-8 sm:border-l sm:border-border sm:pl-10">
              {WHY_POINTS.map((point) => (
                <div key={point.title} className="flex flex-col gap-1.5 text-left">
                  <h3 className="text-base font-semibold tracking-tight">{point.title}</h3>
                  <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heading-left, description-right — a two-column split instead
            of a stacked block, deliberately not a repeat of the previous
            section's treatment. No text highlighting here. */}
        <div className="border-t">
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
            it just ended after the last content section. Kept strictly
            monochrome (no verified-green accent) so it reads as one more
            beat in the same family as the isometric icon sections, not a
            promotional band breaking from them. */}
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 pt-20 pb-4 text-center sm:px-8 sm:pt-28">
            <span className="border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              <Zap className="size-3" />
              Start in 2 minutes
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Your next case is
              <br />
              where it begins.
            </h2>
            <p className="font-manrope text-muted-foreground max-w-md text-lg leading-relaxed text-balance">
              Create your first matter in minutes and start building a legal memory you&apos;ll
              rely on for years.
            </p>

            <div className="relative mt-2 flex justify-center">
              <Link
                href="/signup"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium"
              >
                <Zap className="size-4 fill-current" />
                Start building your legal memory
              </Link>
              {/* Positioned relative to the button's own centered wrapper
                  (not stacked in the flex row) so this annotation can sit
                  off to the side without pulling the button off-center. */}
              <div className="text-muted-foreground absolute top-1/2 left-full ml-4 hidden -translate-y-1/2 items-center gap-2 sm:flex">
                <ArrowLeft className="size-4 shrink-0" />
                <p className="-rotate-2 text-left text-xs leading-snug whitespace-nowrap italic">
                  No credit card.
                  <br />
                  No migration.
                  <br />
                  No new habit to learn.
                </p>
              </div>
            </div>
          </div>

          {/* A decorative map of what accumulates in a legal memory —
              research, orders, arguments, lessons — converging on the
              Litigo mark. Purely illustrative (aria-hidden); the CTA above
              already states the same idea in words. */}
          {/* The cube's base is cropped off with a hard cut rather than
              re-exporting the file: the image renders at its full natural
              size, but the wrapper is shorter and clips (overflow-hidden)
              so the cube's bottom simply doesn't render past the footer
              divider — no gradient, no fade. */}
          <div className="mx-auto w-full max-w-5xl overflow-hidden px-4 sm:px-8" style={{ aspectRatio: "1218 / 419" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, no benefit from next/image's optimization pipeline */}
            <img src="/icons/bottomCTA.svg" alt="" aria-hidden="true" className="w-full" style={{ aspectRatio: "1218 / 575" }} />
          </div>
        </div>
      </main>

      <footer className="border-t px-4 py-12 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <Link href="/" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, no benefit from next/image's optimization pipeline */}
              <img src="/mark.svg" alt="Litigo" width={32} height={32} className="size-8 rounded-md" />
            </Link>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-5 sm:gap-x-10">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">{column.title}</p>
                  <nav className="flex flex-col gap-2.5">
                    {column.links.map((link) =>
                      link.href ? (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground text-sm"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span key={link.label} className="text-muted-foreground text-sm">
                          {link.label}
                        </span>
                      ),
                    )}
                  </nav>
                </div>
              ))}

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Connect</p>
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map((social) => (
                    <span
                      key={social.label}
                      aria-label={social.label}
                      className="border-border text-muted-foreground flex size-8 items-center justify-center rounded-md border text-xs font-medium"
                    >
                      {social.initials}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Litigo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
