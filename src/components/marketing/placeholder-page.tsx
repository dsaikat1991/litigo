import Link from "next/link";
import { Logo } from "@/components/logo";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-3 px-4 py-16 sm:px-8">
        <h1 className="font-heading text-2xl font-medium">{title}</h1>
        <p className="text-muted-foreground text-sm">This page is coming soon.</p>
        <Link
          href="/"
          className="text-foreground mt-2 text-sm underline underline-offset-4"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
