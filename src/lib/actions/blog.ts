"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) redirect("/dashboard");

  return { supabase, user };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// Returns the new cover image's public URL, or undefined if no file was
// submitted (or the upload failed) — undefined (not null) so callers can
// tell "no file this submission, leave the existing cover_image_url alone"
// apart from "explicitly clear it", by only including the key in their
// update payload when this resolves to a string.
async function uploadCoverImage(
  supabase: SupabaseClient,
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("cover_image");
  if (!(file instanceof File) || file.size === 0) return undefined;

  const path = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("blog-images").upload(path, file, {
    contentType: file.type || undefined,
  });
  if (uploadError) {
    // Graceful degradation, same philosophy as billing.ts's missing-env-var
    // path: the blog-images bucket migration
    // (20260806010000_add_blog_cover_images_bucket.sql) may not be applied
    // yet, which is entirely plausible mid-setup. Rather than crashing the
    // whole create/update (title, content, etc. would be lost too), skip
    // the cover image for this submission and let the rest of the post save.
    console.error("Cover image upload failed:", uploadError.message);
    return undefined;
  }

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}

function revalidateBlogPaths(id: string, slug: string) {
  revalidatePath("/dashboard/admin/blog");
  revalidatePath(`/dashboard/admin/blog/${id}/edit`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
}

export async function createBlogPost(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const coverImageUrl = await uploadCoverImage(supabase, formData);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      author_id: user.id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url: coverImageUrl ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;

  revalidatePath("/dashboard/admin/blog");
  redirect(`/dashboard/admin/blog/${data.id}/edit`);
}

export async function updateBlogPost(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");

  // cover_image_url is only included in the update when a new file was
  // actually uploaded this submission — omitting the key (rather than
  // writing null) leaves the existing image alone on edits that don't
  // touch it.
  const coverImageUrl = await uploadCoverImage(supabase, formData);
  const updates: Record<string, unknown> = { title, slug, excerpt, content };
  if (coverImageUrl !== undefined) updates.cover_image_url = coverImageUrl;

  const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
  if (error) throw error;

  revalidateBlogPaths(id, slug);
}

export async function togglePublishBlogPost(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const nextStatus = String(formData.get("status") ?? "") === "published" ? "published" : "draft";
  if (!id) return;

  const { data: post, error: fetchError } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      status: nextStatus,
      published_at: nextStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;

  revalidateBlogPaths(id, post.slug);
}

export async function deleteBlogPost(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/dashboard/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/dashboard/admin/blog");
}
