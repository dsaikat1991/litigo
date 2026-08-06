import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types";

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

// Strips the lightest markdown syntax (headings/emphasis/links) rather than
// pulling in a full markdown-to-plaintext parser for what's just a card
// preview fallback when an admin leaves excerpt blank.
export function truncateExcerpt(content: string, len = 160): string {
  const plain = content
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= len) return plain;
  return `${plain.slice(0, len).trimEnd()}…`;
}
