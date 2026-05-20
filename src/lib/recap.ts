import type { RecapWithSubject } from "@/types/subjects";

function normalizeSujet(
  sujet: { nom: string } | { nom: string }[] | null | undefined
): { nom: string } | null {
  if (!sujet) return null;
  if (Array.isArray(sujet)) return sujet[0] ?? null;
  return sujet;
}

export function normalizeRecaps(rows: unknown[]): RecapWithSubject[] {
  return rows.map((row) => {
    const r = row as RecapWithSubject & {
      sujet?: { nom: string } | { nom: string }[];
    };
    return {
      ...r,
      sujet: normalizeSujet(r.sujet),
    };
  });
}
