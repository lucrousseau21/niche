import type { SupabaseClient } from "@supabase/supabase-js";
import { filterMvpSubjectIds, MVP_SUBJECT_IDS } from "@/lib/mvp-subjects";
import type { UserSubject } from "@/types/subjects";

/** Charge les niches MVP choisies par l'utilisateur. */
export async function fetchUserMvpSubjects(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSubject[]> {
  const { data: profileRows, error: profileError } = await supabase
    .from("profil")
    .select("id_sujet")
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (profileError) {
    console.error("fetchUserMvpSubjects profil:", profileError);
    return [];
  }

  const ids = filterMvpSubjectIds(
    (profileRows ?? []).map((r) => r.id_sujet as number)
  );

  if (ids.length === 0) return [];

  const { data: subjects, error: subjectsError } = await supabase
    .from("sujet")
    .select("id_sujet, nom, description")
    .in("id_sujet", ids);

  if (subjectsError) {
    console.error("fetchUserMvpSubjects sujet:", subjectsError);
    return [];
  }

  return (subjects ?? []) as UserSubject[];
}

/** Liste des niches MVP disponibles à la sélection. */
export async function fetchMvpSubjectsCatalog(
  supabase: SupabaseClient
): Promise<UserSubject[]> {
  const { data, error } = await supabase
    .from("sujet")
    .select("id_sujet, nom, description")
    .in("id_sujet", [...MVP_SUBJECT_IDS])
    .order("id_sujet", { ascending: true });

  if (error) {
    console.error("fetchMvpSubjectsCatalog:", error);
    return [];
  }

  return (data ?? []) as UserSubject[];
}

/**
 * Remplace toutes les préférences niche de l'utilisateur (évite les doublons / diffs).
 */
export async function saveUserMvpSubjects(
  supabase: SupabaseClient,
  userId: string,
  selectedIds: number[],
  grade?: string
): Promise<{ error: Error | null }> {
  const ids = filterMvpSubjectIds(selectedIds);

  if (ids.length === 0) {
    return { error: new Error("Sélectionnez au moins une niche.") };
  }

  const { data: existing } = await supabase
    .from("profil")
    .select("grade")
    .eq("user_id", userId)
    .not("id_sujet", "is", null)
    .limit(1)
    .maybeSingle();

  const gradeToUse = grade ?? existing?.grade ?? "Débutant";

  const { error: deleteError } = await supabase
    .from("profil")
    .delete()
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (deleteError) {
    return { error: deleteError };
  }

  const { error: insertError } = await supabase.from("profil").insert(
    ids.map((id_sujet) => ({
      user_id: userId,
      id_sujet,
      grade: gradeToUse,
    }))
  );

  return { error: insertError };
}
