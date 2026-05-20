import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { filterMvpSubjectIds } from "@/lib/mvp-subjects";
import { saveUserMvpSubjects } from "@/lib/profil-preferences";

/**
 * Sauvegarde les niches via la session utilisateur (clé anon + cookies).
 * Ne pas utiliser la service role ici : en prod Vercel une clé mal configurée
 * provoque « Invalid API key ».
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { subjectIds?: number[]; grade?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const ids = filterMvpSubjectIds(body.subjectIds ?? []);
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Sélectionnez au moins une niche." },
      { status: 400 }
    );
  }

  const { error } = await saveUserMvpSubjects(
    supabase,
    user.id,
    ids,
    body.grade
  );

  if (error) {
    const msg = error.message ?? "Échec de la sauvegarde";
    const hint =
      msg.includes("policy") || msg.includes("permission")
        ? " — vérifiez les politiques RLS sur la table profil (insert/delete pour l'utilisateur connecté)."
        : "";
    return NextResponse.json({ error: msg + hint }, { status: 500 });
  }

  return NextResponse.json({ success: true, subjectIds: ids });
}
