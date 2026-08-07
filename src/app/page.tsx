import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, Zap } from "lucide-react";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { InsideCasePreview } from "@/components/marketing/inside-case-preview";
import { MemorySearchPreview } from "@/components/marketing/memory-search-preview";
import { SiteHeader } from "@/components/marketing/site-header";
import { getPublishedBlogPosts } from "@/lib/data/blog";

// `href: null` marks a page that doesn't exist yet — rendered as plain
// text rather than a link so the footer never points somewhere that 404s.
// Swap in a real href once each page is built. Explicitly typed (not
// `as const`) so `href: string | null` still holds even on a render where
// every current entry happens to have a real href — otherwise TS narrows
// the type from the literal values actually present and the `href ? ... :
// ...` branch below stops type-checking the moment no entry is null.
interface FooterLink {
  href: string | null;
  label: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/our-story", label: "Our Story" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/docs", label: "Documentation" },
      { href: "/help", label: "Help Centre" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/refund-policy", label: "Refund & Cancellation Policy" },
      { href: "/acceptable-use-policy", label: "Acceptable Use Policy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", initials: "in", href: "https://www.linkedin.com/company/litigoofficial/" },
  { label: "Facebook", initials: "f", href: "https://www.facebook.com/mylitigo" },
  { label: "Instagram", initials: "ig", href: "https://www.instagram.com/mylitigo/" },
] as const;

// These SVGs each fill their own viewBox with no meaningful padding, so
// (unlike the earlier revision of these files) a single shared height is
// enough to make all three read as the same size — no per-icon
// compensation needed.
const STEPS = [
  {
    number: "01 - Capture",
    icon: "/icons/capture_legal_knowledge.svg",
    title: "Capture what matters.",
    description:
      "Log the argument, the research, the outcome — in the moment, not reconstructed from memory months later.",
  },
  {
    number: "02 - Build",
    icon: "/icons/litigation_memory.svg",
    title: "Build your litigation memory.",
    description:
      "Everything you capture becomes part of one growing record, linked to the matter it came from.",
  },
  {
    number: "03 - Find",
    icon: "/icons/search.svg",
    title: "Find it when it matters most.",
    description:
      "Search across every case at once — the fact you need is always one query away.",
  },
] as const;

export default async function Home() {
  // The one real-data-driven marketing section on this page — every other
  // marketing component (DashboardPreview, MemorySearchPreview,
  // InsideCasePreview) is hardcoded decorative mock data. Fetched here
  // rather than in a leaf component so the section can simply not render
  // at all when there are zero published posts yet. Caught rather than
  // left to throw (unlike this codebase's usual data-layer convention)
  // specifically because this is the public homepage: the migration this
  // depends on is applied manually and separately from code deploys, so
  // there's a real window where the table doesn't exist yet — that must
  // never take the whole marketing site down.
  const blogPosts = await getPublishedBlogPosts(6).catch(() => []);
  // Cover images are the whole section — a post with none has nothing to
  // show here, so it's skipped rather than falling back to a text card.
  const blogPostsWithCovers = blogPosts.filter((post) => post.cover_image_url).slice(0, 3);

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

        <div className="mt-[58px] border-b">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 pt-6 pb-14 px-4 text-left sm:px-8 sm:pt-8 sm:pb-20">
            <h2 className="max-w-5xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Your legal experience compounds with every case.
            </h2>
            <p className="font-manrope text-muted-foreground max-w-2xl text-lg leading-relaxed text-balance">
              Every matter leaves behind valuable experience. Too often, it&apos;s buried in
              diaries, folders or memory. Litigo gives it a permanent, searchable home.
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

        {/* Heading-left, description-right — a two-column split instead
            of a stacked block, deliberately not a repeat of the previous
            section's treatment. No text highlighting here. The section
            above already closes with its own border-b, so this one skips
            border-t rather than stacking a second divider right beneath
            it. */}
        <div>
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

          <div className="mx-auto w-full max-w-[99rem] px-2 pb-24 sm:px-4 sm:pb-32">
            <MemorySearchPreview />
          </div>
        </div>

        {/* -mb-14/-mb-20 exactly cancels the gap-14/sm:gap-20 the parent
            <main> flex puts between every section — without it, the
            crop below would still leave a visible gap of plain
            background before the closing CTA's own border-t, breaking
            the "touches the divider" effect. */}
        <div className="-mb-14 overflow-hidden border-t sm:-mb-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 pt-20 pb-10 text-left sm:px-8 sm:pt-28">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Built for Litigators
            </h2>
            <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
              Purpose-built for advocates who believe every case should make the next one
              stronger.
            </p>
          </div>

          {/* Deliberately crops mid-content this time (partway through the
              second timeline card's task list), as a "there's more below"
              teaser rather than showing the whole card stack — the exact
              opposite goal from this margin's earlier iterations, which
              were tuned to show every card in full. -462px was measured
              directly against the rendered assembly (bezelTop to the task
              row's bottom, at this component's current copy) rather than
              guessed as a percentage, since a width-relative value drifts
              out of sync with the actual (viewport-independent) content
              height. If the timeline copy above changes, re-measure this
              rather than assuming the px value still lands in the same
              place. Same max-w-[99rem]/px-2/sm:px-4 as the hero's
              DashboardPreview and the search box above, so the laptop
              renders exactly as wide as both. */}
          <div className="mx-auto w-full max-w-[99rem] px-2 pt-4 sm:px-4">
            <div style={{ marginBottom: "-462px" }}>
              <InsideCasePreview />
            </div>
          </div>
        </div>

        {/* Shows however many cover-imaged posts exist (up to 3), rather
            than requiring exactly 3 — gating on an exact count means the
            section would unpredictably vanish any time the post count
            didn't line up, which is worse than a slightly uneven row.
            Hidden only when there's truly nothing to show. */}
        {blogPostsWithCovers.length > 0 && (
          <div className="border-t">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-4 pt-20 pb-10 text-left sm:px-8 sm:pt-28">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                From the blog
              </h2>
              <p className="font-manrope text-muted-foreground max-w-xl text-lg leading-relaxed text-balance">
                Insights on litigation, legal knowledge, and building a practice that grows with
                every case.
              </p>
            </div>

            {/* Same max-w-[99rem]/px-2/sm:px-4 as the "Built for Litigators"
                laptop above, so these images line up with it edge to edge. */}
            <div className="mx-auto w-full max-w-[99rem] px-2 pb-8 sm:px-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {blogPostsWithCovers.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="border-border block aspect-[4/3] overflow-hidden rounded-3xl border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-supplied Supabase Storage public URL, no benefit from next/image's optimization pipeline */}
                    <img
                      src={post.cover_image_url!}
                      alt={post.title}
                      className="size-full object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[99rem] px-2 pb-20 sm:px-4 sm:pb-28">
              <div className="flex justify-end">
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

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
                  Free forever plan.
                  <br />
                  No credit card.
                  <br />
                  Start with just one case.
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
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 flex size-8 items-center justify-center rounded-md border text-xs font-medium"
                    >
                      {social.initials}
                    </a>
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
