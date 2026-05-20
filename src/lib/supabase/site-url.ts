/**
 * URL de base de l'app pour les redirections OAuth (Supabase).
 * En client : origin courant. Sinon NEXT_PUBLIC_SITE_URL ou niche.fr en prod.
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) {
    return configured.startsWith("http")
      ? configured
      : `https://${configured}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
