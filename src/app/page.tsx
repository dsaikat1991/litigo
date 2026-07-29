import Link from "next/link";
import { CalendarClock, Bell, Search, History, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { AnimatedHeadlineWord } from "@/components/marketing/animated-headline-word";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Never miss a hearing",
    description:
      "Every hearing becomes a dated reminder — seven days out, three, one, and the morning of — so nothing depends on remembering to check.",
  },
  {
    icon: Bell,
    title: "Nothing falls through",
    description:
      "A missing reflection, an unlinked argument, a hearing coming up — surfaced the moment you open the dashboard, not buried in a list you have to go looking for.",
  },
  {
    icon: Search,
    title: "Your own precedent bank",
    description:
      "Every argument, research note and lesson becomes instantly searchable—even years later.",
  },
  {
    icon: History,
    title: "A real record of what happened",
    description:
      "Each hearing outcome becomes a permanent timeline entry — arguments made, court directions, next steps — not overwritten the next time you open the case.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
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
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pt-28 text-left sm:px-8 sm:pt-40 lg:pt-48">
          <h1 className="text-4xl leading-[1.3] font-medium tracking-tight sm:text-5xl lg:text-6xl">
            Your legal memory, finally
            <br />
            <AnimatedHeadlineWord />
          </h1>
          <p className="font-manrope text-muted-foreground max-w-2xl text-lg leading-snug text-balance">
            Litigo remembers every argument, research note and lesson — so that you can instantly
            find and reuse them, even decades later.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-8">
          <DashboardPreview />
        </div>

        <div className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-8 sm:py-24">
            <div className="flex flex-col gap-3">
              <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
                Built for litigators
              </span>
              <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Your practice gets smarter with every case.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="border-border/60 bg-muted/30 hover:border-border flex flex-col gap-3 rounded-xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-md"
                  >
                    <div className="bg-verified/10 flex size-12 items-center justify-center rounded-full">
                      <Icon className="text-verified size-6" />
                    </div>
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                    <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

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
