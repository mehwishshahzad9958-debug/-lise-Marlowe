import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client that uses the SECRET key.
 *
 * - `import "server-only"` makes the build fail if any browser
 *   (client) component ever imports this file.
 * - The secret key is read from `SUPABASE_SECRET_KEY` (no NEXT_PUBLIC_
 *   prefix), so Next.js never includes it in browser code.
 * - Values are never logged; only the NAMES of missing variables are.
 *
 * In the database, this key may only INSERT into public.registrations
 * (see supabase/schema.sql), so never chain .select() / .upsert().
 */

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  const missing = [!url && "NEXT_PUBLIC_SUPABASE_URL", !secretKey && "SUPABASE_SECRET_KEY"].filter(Boolean);
  if (missing.length > 0 || !url || !secretKey) {
    console.error(`[supabase] Not configured: missing ${missing.join(", ")} in .env.local`);
    return null;
  }

  if (!secretKey.startsWith("sb_secret_")) {
    console.error("[supabase] SUPABASE_SECRET_KEY must be a Supabase secret key (it should start with sb_secret_).");
    return null;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    console.error("[supabase] NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
    return null;
  }
  const isLocal = parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";
  if (parsedUrl.protocol !== "https:" && !isLocal) {
    console.error("[supabase] NEXT_PUBLIC_SUPABASE_URL must start with https://");
    return null;
  }

  cachedClient = createClient(url, secretKey, {
    auth: {
      // No user sessions on the server: nothing is stored or refreshed.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cachedClient;
}
