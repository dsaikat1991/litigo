import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/data/blog";
import { updateBlogPost } from "@/lib/actions/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium">Edit post</h1>
          <Badge variant={post.status === "published" ? "verified" : "outline"} className="capitalize">
            {post.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Publishing/unpublishing happens from the post list, not this form.
        </p>
      </div>

      <form action={updateBlogPost} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={post.id} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={post.title} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={post.slug} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cover_image">Cover image</Label>
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a Supabase Storage public URL, no benefit from next/image's optimization pipeline
            <img
              src={post.cover_image_url}
              alt=""
              className="border-border h-32 w-auto rounded-lg border object-cover"
            />
          )}
          <input
            id="cover_image"
            name="cover_image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <p className="text-muted-foreground text-xs">
            {post.cover_image_url ? "Choose a file to replace it." : "No cover image yet."}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            name="content"
            rows={18}
            defaultValue={post.content}
            required
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
