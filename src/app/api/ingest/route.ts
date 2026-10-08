import { NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function verifyIngestAccess(req: Request) {
  // 1. Autoriser les déclenchements automatisés avec jeton secret (CRON_SECRET)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { authorized: true };
  }

  // 2. Sinon, vérifier que l'appelant est connecté et possède le statut Administrateur
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, error: "Non connecté", status: 401 };
  }

  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "luc.rousseaupro@gmail.com";
  const isSuperAdmin = user.email === superAdminEmail;

  const { data: profiles } = await supabase
    .from("profil")
    .select("grade")
    .eq("user_id", user.id);

  const hasAdminGrade = profiles?.some((p) => p.grade?.toLowerCase() === "admin");

  if (!isSuperAdmin && !hasAdminGrade) {
    return {
      authorized: false,
      error: "Accès refusé. Réservé aux administrateurs ou cron autorisé.",
      status: 403,
    };
  }

  return { authorized: true, user };
}

export async function POST(req: Request) {
  const authCheck = await verifyIngestAccess(req);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.status }
    );
  }

  console.log("Starting ingestion process...");
  try {
    const { topic } = await req.json().catch(() => ({ topic: undefined }));
    const results = await ingestAllSources(topic);
    console.log("Ingestion completed:", results);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Ingestion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ingestion failed: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
