/** Extrait les puces affichées sur les cartes à partir du champ jsonb `resume`. */
export function parseResume(resumeData: unknown): string[] {
  try {
    let parsed = resumeData;
    if (typeof resumeData === "string") {
      parsed = JSON.parse(resumeData);
    }

    if (Array.isArray(parsed)) return parsed;

    if (typeof parsed === "object" && parsed !== null) {
      const values = Object.values(parsed).filter(
        (val) => typeof val === "string"
      ) as string[];
      if (values.length > 0) return values;
    }

    return ["Résumé non disponible"];
  } catch (e) {
    console.error("Error parsing resume:", e);
    if (typeof resumeData === "string" && resumeData.trim().length > 0) {
      return [resumeData];
    }
    return ["Résumé non disponible"];
  }
}
