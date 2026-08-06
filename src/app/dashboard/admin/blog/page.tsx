import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { getAllBlogPostsForAdmin } from "@/lib/data/blog";
import { getCurrentProfile } from "@/lib/data/profile";
import { deleteBlogPost, togglePublishBlogPost } from "@/lib/actions/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyStatePanel } from "@/components/dashboard/empty-state-panel";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  const [posts, profile] = await Promise.all([getAllBlogPostsForAdmin(), getCurrentProfile()]);
  const locale = profile?.locale ?? "en-IN";
  const timeZone = profile?.timezone ?? "Asia/Kolkata";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-medium">Blog</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/admin/blog/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyStatePanel
          icon={Newspaper}
          title="No posts yet"
          description="Draft your first post — it stays private until you publish it."
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/admin/blog/new">New post</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/admin/blog/${post.id}/edit`} className="truncate text-sm font-medium hover:underline">
                    {post.title}
                  </Link>
                  <Badge variant={post.status === "published" ? "verified" : "outline"} className="capitalize">
                    {post.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Updated {formatDate(post.updated_at, locale, timeZone)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form action={togglePublishBlogPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
                  <Button type="submit" variant="outline" size="sm">
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                </form>
                <form action={deleteBlogPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
