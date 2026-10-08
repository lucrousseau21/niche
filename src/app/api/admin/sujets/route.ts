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

export async function GET() {
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized || !authCheck.supabase) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const supabase = authCheck.supabase;

  try {
    // 1. Récupérer tous les sujets
    const { data: sujets, error: sujetsError } = await supabase
      .from("sujet")
      .select("id_sujet, nom, description")
      .order("id_sujet", { ascending: true });

    if (sujetsError) {
      return NextResponse.json({ error: sujetsError.message }, { status: 500 });
    }

    // 2. Récupérer tous les récaps
    const { data: recaps, error: recapsError } = await supabase
      .from("recap")
      .select("id_recap, id_sujet, titre, resume, contenu, created_at")
      .order("created_at", { ascending: false });

    if (recapsError) {
      return NextResponse.json({ error: recapsError.message }, { status: 500 });
    }

    // 3. Associer les récaps à chaque sujet
    const sujetsWithRecaps = (sujets || []).map((s) => ({
      ...s,
      recaps: (recaps || []).filter((r) => r.id_sujet === s.id_sujet),
    }));

    return NextResponse.json({ success: true, subjects: sujetsWithRecaps });
  } catch (error: any) {
    console.error("Erreur API Admin Sujets:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized || !authCheck.supabase) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const nom = (body.nom || "").trim();
    const description = (body.description || "").trim();

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de la niche est obligatoire." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "La description de la niche est obligatoire." },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();
    const db = serviceClient || authCheck.supabase;

    // Vérifier si un sujet avec le même nom existe déjà
    const { data: existing } = await db
      .from("sujet")
      .select("id_sujet, nom")
      .ilike("nom", nom)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: `Une niche nommée "${existing.nom}" existe déjà (#${existing.id_sujet}).` },
        { status: 409 }
      );
    }

    // Récupérer le plus grand ID actuel
    const { data: maxRow } = await db
      .from("sujet")
      .select("id_sujet")
      .order("id_sujet", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextId = (maxRow?.id_sujet || 0) + 1;

    let newSubject = null;

    // 1. Tentative avec ID calculé
    const { data: createdWithId, error: errWithId } = await db
      .from("sujet")
      .insert({ id_sujet: nextId, nom, description })
      .select()
      .single();

    if (!errWithId && createdWithId) {
      newSubject = createdWithId;
    } else {
      // 2. Si la colonne est IDENTITY ALWAYS, insertion sans spécifier l'id
      const { data: createdAuto, error: errAuto } = await db
        .from("sujet")
        .insert({ nom, description })
        .select()
        .single();

      if (errAuto) {
        console.error("Erreur insertion sujet:", errWithId, errAuto);
        return NextResponse.json(
          { error: errAuto.message || errWithId?.message || "Impossible de créer la niche." },
          { status: 500 }
        );
      }
      newSubject = createdAuto;
    }

    return NextResponse.json({
      success: true,
      message: "Niche créée avec succès.",
      subject: {
        ...newSubject,
        recaps: [],
      },
    });
  } catch (error: any) {
    console.error("Erreur API Admin Create Sujet:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

