import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { getBlogPostBySlug, truncateExcerpt } from "@/lib/data/blog";
import { getInitials } from "@/lib/utils";
import { Logo } from "@/components/logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog — Litigo" };

  const description = post.excerpt || truncateExcerpt(post.content);
  return {
    title: `${post.title} — Litigo`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-4">
          <Link href="/blog" className="text-muted-foreground text-sm hover:text-foreground">
            ← Blog
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              {getInitials(post.author?.full_name ?? null, null)}
            </span>
            <span>{post.author?.full_name ?? "Litigo"}</span>
            {post.published_at && (
              <>
                <span>·</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied external URL, no benefit from next/image's optimization pipeline
          <img
            src={post.cover_image_url}
            alt=""
            className="border-border w-full rounded-2xl border object-cover"
          />
        )}

        <div className="font-manrope prose prose-neutral max-w-none text-[15px] leading-relaxed">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
