import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

// Helper pour vérifier que l'appelant est bien un administrateur
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, error: "Non connecté", status: 401 };
  }

  // Vérifie si Luc ou un utilisateur avec grade 'admin'
  const isSuperAdmin = user.email === "luc.rousseaupro@gmail.com";

  const { data: profiles } = await supabase
    .from("profil")
    .select("grade")
    .eq("user_id", user.id);

  const hasAdminGrade = profiles?.some((p) => p.grade?.toLowerCase() === "admin");

  if (!isSuperAdmin && !hasAdminGrade) {
    return { authorized: false, error: "Accès refusé. Réservé aux administrateurs.", status: 403 };
  }

  return { authorized: true, user };
}

// GET : Récupérer la liste des utilisateurs avec leur grade
export async function GET() {
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const supabaseAdmin = createServiceRoleClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquante ou invalide" },
      { status: 500 }
    );
  }

  try {
    // 1. Récupération des utilisateurs depuis auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Récupération des profils dans la table public.profil
    const { data: profilesData, error: profileError } = await supabaseAdmin
      .from("profil")
      .select("user_id, grade");

    if (profileError) {
      console.warn("Erreur lors de la récupération des profils:", profileError);
    }

    // Créer une map des grades par user_id
    const gradeMap = new Map<string, string>();
    profilesData?.forEach((p) => {
      if (p.user_id && p.grade) {
        const current = gradeMap.get(p.user_id);
        if (p.grade.toLowerCase() === "admin" || !current) {
          gradeMap.set(p.user_id, p.grade);
        }
      }
    });

    // 3. Fusionner les données pour le dashboard
    const users = (authData.users || []).map((u) => {
      const isSuperAdmin = u.email === "luc.rousseaupro@gmail.com";
      const dbGrade = gradeMap.get(u.id) || (u.user_metadata?.grade as string) || "Utilisateur";
      const isAdmin = isSuperAdmin || dbGrade?.toLowerCase() === "admin";

      return {
        id: u.id,
        email: u.email || "Non renseigné",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        grade: isAdmin ? "admin" : dbGrade,
        isAdmin,
        isSuperAdmin,
      };
    });

    // Trier du plus récent au plus ancien
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Erreur API Admin Users:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}

// PATCH : Modifier le grade d'un utilisateur (passer admin ou retirer admin)
export async function PATCH(request: Request) {
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const supabaseAdmin = createServiceRoleClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquante ou invalide" },
      { status: 500 }
    );
  }

  try {
    const { userId, makeAdmin } = await request.json();

    if (!userId || typeof makeAdmin !== "boolean") {
      return NextResponse.json(
        { error: "userId et makeAdmin (booléen) sont requis" },
        { status: 400 }
      );
    }

    const targetGrade = makeAdmin ? "admin" : "Débutant";

    // 1. Vérifier si l'utilisateur a déjà une ligne dans public.profil
    const { data: existingProfiles } = await supabaseAdmin
      .from("profil")
      .select("id_profil, user_id")
      .eq("user_id", userId);

    if (existingProfiles && existingProfiles.length > 0) {
      // Mettre à jour toutes ses lignes de profil
      const { error: updateError } = await supabaseAdmin
        .from("profil")
        .update({ grade: targetGrade })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insérer un profil initial
      const { error: insertError } = await supabaseAdmin
        .from("profil")
        .insert({ user_id: userId, grade: targetGrade });

      if (insertError) {
        throw insertError;
      }
    }

    // 2. Mettre à jour les métadonnées auth
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { grade: targetGrade },
    });

    return NextResponse.json({
      success: true,
      userId,
      grade: targetGrade,
      isAdmin: makeAdmin,
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du grade:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
