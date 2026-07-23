import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { MemorySearchPreview } from "@/components/marketing/memory-search-preview";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Logo />
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

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-0">
        <div className="flex flex-col items-start gap-5 py-4 lg:py-16">
          <span className="font-heading text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            The legal memory system for litigators
          </span>
          <h1 className="font-heading max-w-[15ch] text-3xl font-medium text-balance sm:text-4xl">
            Your legal memory, finally findable.
          </h1>
          <p className="text-muted-foreground max-w-md text-lg text-balance">
            Every case you argue, every point of research, every lesson learned — Litigo keeps it,
            so you never have to say &ldquo;I know I&apos;ve argued this before, I just
            can&apos;t find it.&rdquo;
          </p>
          <div className="mt-1 flex items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start building your memory</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <MemorySearchPreview />
      </main>

      <footer className="border-t py-6 text-center font-heading text-xs tracking-widest text-muted-foreground uppercase">
        We believe legal experience should compound, not disappear.
      </footer>
    </div>
  );
}
