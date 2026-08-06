import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedBlogPosts, truncateExcerpt } from "@/lib/data/blog";
import { getInitials } from "@/lib/utils";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Blog — Litigo",
  description: "Notes on legal practice, memory, and building a career worth remembering.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            Blog
          </span>
          <h1 className="text-3xl font-medium text-balance">Notes on legal practice and memory.</h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts published yet — check back soon.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="border-border flex flex-col gap-2 border-b pb-8 last:border-b-0 last:pb-0"
              >
                <h2 className="text-xl font-semibold tracking-tight">{post.title}</h2>
                <p className="font-manrope text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt || truncateExcerpt(post.content)}
                </p>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                  <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-full font-medium">
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
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
