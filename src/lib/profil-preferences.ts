import type { SupabaseClient } from "@supabase/supabase-js";
import { filterMvpSubjectIds } from "@/lib/mvp-subjects";
import type { UserSubject } from "@/types/subjects";

export async function getUserMvpSubjectIds(
  supabase: SupabaseClient,
  userId: string
): Promise<number[]> {
  const { data, error } = await supabase
    .from("profil")
    .select("id_sujet")
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (error) {
    console.error("getUserMvpSubjectIds:", error);
    return [];
  }

  return filterMvpSubjectIds((data ?? []).map((r) => r.id_sujet as number));
}

/** Charge les niches MVP choisies par l'utilisateur (IDs dédupliqués). */
export async function fetchUserMvpSubjects(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSubject[]> {
  const ids = await getUserMvpSubjectIds(supabase, userId);
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

/** Liste de toutes les niches disponibles à la sélection (synchronisée dynamiquement avec la base de données). */
export async function fetchMvpSubjectsCatalog(
  supabase: SupabaseClient
): Promise<UserSubject[]> {
  const { data, error } = await supabase
    .from("sujet")
    .select("id_sujet, nom, description")
    .order("id_sujet", { ascending: true });

  if (error) {
    console.error("fetchMvpSubjectsCatalog:", error);
    return [];
  }

  return (data ?? []) as UserSubject[];
}

function sameIdSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((id, i) => id === sortedB[i]);
}

async function deleteUserNichePreferences(
  supabase: SupabaseClient,
  userId: string
): Promise<Error | null> {
  const { data: existing, error: selectError } = await supabase
    .from("profil")
    .select("id_sujet")
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (selectError) return selectError;

  const { error: bulkError } = await supabase
    .from("profil")
    .delete()
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (!bulkError) {
    const remaining = await getUserMvpSubjectIds(supabase, userId);
    if (remaining.length === 0) return null;
  }

  for (const row of existing ?? []) {
    const { error: rowError } = await supabase
      .from("profil")
      .delete()
      .eq("user_id", userId)
      .eq("id_sujet", row.id_sujet as number);

    if (rowError) return rowError;
  }

  const stillThere = await getUserMvpSubjectIds(supabase, userId);
  if (stillThere.length > 0) {
    return new Error(
      "Impossible de supprimer les anciennes préférences (RLS). Configurez SUPABASE_SERVICE_ROLE_KEY sur Vercel ou exécutez replace-user-mvp-subjects.sql."
    );
  }

  return bulkError;
}

/**
 * Remplace toutes les préférences niche (RPC atomique si disponible, sinon delete + insert).
 */
export async function saveUserMvpSubjects(
  supabase: SupabaseClient,
  userId: string,
  selectedIds: number[],
  grade?: string
): Promise<{ error: Error | null; savedIds: number[] }> {
  const ids = filterMvpSubjectIds(selectedIds);

  if (ids.length === 0) {
    return {
      error: new Error("Sélectionnez au moins une niche."),
      savedIds: [],
    };
  }

  const { data: existing } = await supabase
    .from("profil")
    .select("grade")
    .eq("user_id", userId)
    .not("id_sujet", "is", null)
    .limit(1)
    .maybeSingle();

  // Conserver le grade existant de l'utilisateur, et empêcher toute promotion non autorisée vers 'admin'
  const gradeToUse =
    existing?.grade ??
    (grade && grade.toLowerCase() !== "admin" ? grade : "Débutant");

  const { error: rpcError } = await supabase.rpc("replace_user_mvp_subjects", {
    p_subject_ids: ids,
    p_grade: gradeToUse,
  });

  if (!rpcError) {
    const actual = await getUserMvpSubjectIds(supabase, userId);
    if (sameIdSet(actual, ids)) {
      return { error: null, savedIds: ids };
    }
  } else {
    const rpcMsg = rpcError.message ?? "";
    const rpcMissing =
      rpcMsg.includes("Could not find the function") ||
      rpcMsg.includes("replace_user_mvp_subjects");

    if (!rpcMissing) {
      return { error: rpcError, savedIds: [] };
    }
  }

  const deleteError = await deleteUserNichePreferences(supabase, userId);
  if (deleteError) {
    return { error: deleteError, savedIds: [] };
  }

  const { error: insertError } = await supabase.from("profil").insert(
    ids.map((id_sujet) => ({
      user_id: userId,
      id_sujet,
      grade: gradeToUse,
    }))
  );

  if (insertError) {
    return { error: insertError, savedIds: [] };
  }

  const actual = await getUserMvpSubjectIds(supabase, userId);
  if (!sameIdSet(actual, ids)) {
    return {
      error: new Error(
        "La sauvegarde n'a pas été appliquée correctement en base (doublons RLS)."
      ),
      savedIds: [],
    };
  }

  return { error: null, savedIds: ids };
}
