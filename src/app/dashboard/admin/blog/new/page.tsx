import { createBlogPost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewBlogPostPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">New post</h1>
        <p className="text-muted-foreground text-sm">
          Saved as a draft first — publish it from the post list once it&apos;s ready.
        </p>
      </div>

      <form action={createBlogPost} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="Auto-generated from the title if left blank" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            placeholder="Shown on the blog listing and homepage — auto-summarized from the content if left blank"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cover_image">Cover image</Label>
          <input
            id="cover_image"
            name="cover_image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea id="content" name="content" rows={18} required className="font-mono text-sm" />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Create draft</Button>
        </div>
      </form>
    </div>
  );
}
