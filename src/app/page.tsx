import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

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
          <h1 className="text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl lg:text-6xl">
            Your legal memory, finally
            <br />
            findable.
          </h1>
          <p className="font-manrope text-muted-foreground max-w-2xl text-lg leading-snug text-balance">
            Litigo remembers every argument, research note and lesson — so that you can instantly
            find and reuse them, even decades later.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[90rem] px-4 pb-16 sm:px-8 sm:pb-24">
          <DashboardPreview />
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
