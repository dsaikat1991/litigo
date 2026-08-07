import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Logo } from "@/components/logo";

// Shared shell for long-form static pages (legal documents, About, Our
// Story) — same markdown-rendering pattern the blog post page already uses
// (react-markdown + Tailwind Typography's `prose` class), so headings,
// lists, and bold text in the source markdown render correctly without
// any of these pages hand-building JSX per section.
export function ContentPage({
  eyebrow,
  title,
  subtitle,
  markdown,
  maxWidth = "max-w-3xl",
  afterContent,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  markdown: string;
  maxWidth?: string;
  afterContent?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className={`mx-auto flex w-full ${maxWidth} flex-1 flex-col gap-8 px-4 py-16 sm:px-8`}>
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            {eyebrow}
          </span>
          <h1 className="text-3xl font-medium text-balance sm:text-4xl">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>

        <div className="font-manrope prose prose-neutral max-w-none text-[15px] leading-relaxed">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        {afterContent}

        {footer ?? (
          <Link
            href="/"
            className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
          >
            Back to home
          </Link>
        )}
      </main>
    </div>
  );
}
