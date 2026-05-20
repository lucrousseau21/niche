import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Client service role (bypass RLS) — uniquement côté serveur. */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) return null;
  // Rejeter les placeholders / clés manifestement invalides
  if (key.length < 80 || /your[-_]?service|xxx|placeholder/i.test(key)) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
