import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client for system jobs (the notification cron) that must read
// and update rows across every user, not just the caller — RLS is scoped to
// auth.uid(), which a scheduled job has none of, so this deliberately
// bypasses it. Never use this in a path that handles a browser request directly.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
