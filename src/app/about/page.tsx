import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16 sm:px-8">
        <span className="font-heading text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
          About Litigo
        </span>
        <h1 className="font-heading max-w-[20ch] text-3xl font-medium text-balance">
          Every case you argue leaves something behind. Litigo is where it stays.
        </h1>

        <div className="text-foreground/90 flex flex-col gap-5 text-[15px] leading-relaxed">
          <p>
            A litigating advocate builds real expertise over a career — arguments that worked,
            authorities that held up, questions a particular bench tends to ask, mistakes made
            once and never again. None of that is written down anywhere durable. It lives in old
            files, scattered notes, WhatsApp messages to yourself, and memory that fades faster
            than the next matter arrives.
          </p>
          <p>
            Litigo exists to fix one specific problem: an advocate who says{" "}
            <em>&ldquo;I know I&apos;ve argued this before — I just can&apos;t find it&rdquo;</em>{" "}
            and means it. It is not a case-diary app, a billing tool, or a research database of
            published judgments. It is a personal legal memory — the case you handled, the
            argument you made, the research behind it, and the lesson you took from it, kept
            together and findable again years later.
          </p>
          <p>
            We believe legal experience should compound, not disappear. Every matter an advocate
            closes should make the next one easier, not start the search from zero. That belief is
            the entire product: capture what you learn as you go, and get it back the moment you
            need it.
          </p>
          <p>
            Litigo is built in India, for advocates practicing in India, by someone who argues
            cases for a living and kept running into this exact problem. It is built India-first
            on purpose — not as a limitation, but because solving this well for one bar and one
            set of courts first is how it gets solved properly at all.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
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
      </main>
    </div>
  );
}
