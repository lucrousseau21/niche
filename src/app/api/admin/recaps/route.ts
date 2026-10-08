import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, error: "Non connecté", status: 401 };
  }

  const isSuperAdmin = user.email === "luc.rousseaupro@gmail.com";

  const { data: profiles } = await supabase
    .from("profil")
    .select("grade")
    .eq("user_id", user.id);

  const hasAdminGrade = profiles?.some((p) => p.grade?.toLowerCase() === "admin");

  if (!isSuperAdmin && !hasAdminGrade) {
    return { authorized: false, error: "Accès refusé. Réservé aux administrateurs.", status: 403 };
  }

  return { authorized: true, user, supabase };
}

export async function POST(request: Request) {
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized || !authCheck.supabase) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const id_sujet = Number(body.id_sujet);
    const titre = (body.titre || "").trim();
    const contenu = (body.contenu || "").trim();
    const resumeInput = body.resume;

    if (!id_sujet || isNaN(id_sujet)) {
      return NextResponse.json(
        { error: "L'identifiant du sujet (id_sujet) est requis." },
        { status: 400 }
      );
    }

    if (!titre) {
      return NextResponse.json(
        { error: "Le titre de la newsletter est requis." },
        { status: 400 }
      );
    }

    if (!contenu) {
      return NextResponse.json(
        { error: "Le contenu Markdown de la newsletter est requis." },
        { status: 400 }
      );
    }

    // Formater le résumé (support texte brut ou JSON)
    let resumeFormatted: any = resumeInput;
    if (typeof resumeInput === "string") {
      const trimmed = resumeInput.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
          resumeFormatted = JSON.parse(trimmed);
        } catch {
          resumeFormatted = trimmed;
        }
      } else {
        resumeFormatted = trimmed;
      }
    }

    const serviceClient = createServiceRoleClient();
    const db = serviceClient || authCheck.supabase;

    // 1. Tentative d'insertion automatique
    const { data: createdAuto, error: errAuto } = await db
      .from("recap")
      .insert({
        id_sujet,
        titre,
        resume: resumeFormatted || null,
        contenu,
      })
      .select()
      .single();

    if (!errAuto && createdAuto) {
      return NextResponse.json({
        success: true,
        message: "Newsletter créée avec succès.",
        recap: createdAuto,
      });
    }

    // 2. Fallback avec ID calculé si la séquence n'est pas configurée
    console.warn("Auto-insert recap failed, trying with calculated ID:", errAuto);
    const { data: maxRow } = await db
      .from("recap")
      .select("id_recap")
      .order("id_recap", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextId = (maxRow?.id_recap || 0) + 1;
    const { data: createdWithId, error: errWithId } = await db
      .from("recap")
      .insert({
        id_recap: nextId,
        id_sujet,
        titre,
        resume: resumeFormatted || null,
        contenu,
      })
      .select()
      .single();

    if (errWithId) {
      console.error("Erreur insertion recap:", errAuto, errWithId);
      return NextResponse.json(
        { error: errWithId.message || errAuto?.message || "Impossible d'enregistrer la newsletter." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Newsletter créée avec succès.",
      recap: createdWithId,
    });
  } catch (error: any) {
    console.error("Erreur API Admin Create Recap:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur lors de la création du récap." },
      { status: 500 }
    );
  }
}
