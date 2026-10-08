/**
 * Gestion des identifiants de niches.
 * Les niches sont désormais chargées dynamiquement depuis la base de données (table 'sujet').
 */

/** @deprecated Ancien tableau statique de test. Les niches sont maintenant synchronisées directement avec la table 'sujet'. */
export const MVP_SUBJECT_IDS = [1, 2, 3] as const;

export type MvpSubjectId = number;

export function isMvpSubjectId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/**
 * Valide, convertit en entier et déduplique les identifiants de niches (> 0).
 * Accepte dynamiquement tout identifiant de sujet existant dans la base de données.
 */
export function filterMvpSubjectIds(ids: Iterable<number | string>): number[] {
  const out: number[] = [];
  for (const raw of ids) {
    const n = typeof raw === "string" ? Number.parseInt(raw, 10) : Math.floor(raw);
    if (Number.isFinite(n) && n > 0 && !out.includes(n)) {
      out.push(n);
    }
  }
  return out;
}
