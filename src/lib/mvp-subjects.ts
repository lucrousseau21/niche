/** Niches MVP affichées dans l'app (IDs Supabase). */
export const MVP_SUBJECT_IDS = [1, 2, 3] as const;

export type MvpSubjectId = (typeof MVP_SUBJECT_IDS)[number];

export function isMvpSubjectId(id: number): id is MvpSubjectId {
  return (MVP_SUBJECT_IDS as readonly number[]).includes(id);
}

export function filterMvpSubjectIds(ids: Iterable<number | string>): number[] {
  const allowed = new Set<number>(MVP_SUBJECT_IDS);
  const out: number[] = [];
  for (const raw of ids) {
    const n = typeof raw === "string" ? Number.parseInt(raw, 10) : raw;
    if (Number.isFinite(n) && allowed.has(n) && !out.includes(n)) {
      out.push(n);
    }
  }
  return out;
}
