import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { filterMvpSubjectIds } from "@/lib/mvp-subjects";
import {
  fetchUserMvpSubjects,
  saveUserMvpSubjects,
  getUserMvpSubjectIds,
} from "@/lib/profil-preferences";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const subjectIds = await getUserMvpSubjectIds(supabase, user.id);
  const subjects = await fetchUserMvpSubjects(supabase, user.id);

  return NextResponse.json({ subjectIds, subjects });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { subjectIds?: number[] };
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

  const admin = createServiceRoleClient();
  const writeClient = admin ?? supabase;

  // Sécurité : Ne jamais accepter le champ 'grade' provenant du client pour empêcher toute escalade de privilèges.
  // L'utilisateur met à jour uniquement ses niches, son grade existant en base est préservé.
  const { error, savedIds } = await saveUserMvpSubjects(
    writeClient,
    user.id,
    ids
  );

  if (error) {
    const hint = admin
      ? ""
      : " Ajoutez SUPABASE_SERVICE_ROLE_KEY (clé service_role Supabase) sur Vercel, ou exécutez supabase/replace-user-mvp-subjects.sql.";
    return NextResponse.json(
      { error: (error.message ?? "Échec de la sauvegarde") + hint },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, subjectIds: savedIds });
}
