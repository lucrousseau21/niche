import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

const MVP_SUBJECTS = [
  {
    id_sujet: 1,
    nom: "Développement Fullstack & Web3",
    description:
      "Frameworks, architectures, smart contracts et écosystème Web3.",
  },
  {
    id_sujet: 2,
    nom: "Intelligence Artificielle & Data",
    description: "LLM, data engineering, MLOps et outils d'analyse.",
  },
  {
    id_sujet: 3,
    nom: "Design d'Interface & UX",
    description: "UI, accessibilité, design systems et recherche utilisateur.",
  },
] as const;

export async function POST() {
  console.log("Starting MVP subjects setup...");
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Configuration Supabase manquante." },
        { status: 500 }
      );
    }

    const results: { nom: string; id_sujet?: number; status: string }[] = [];

    for (const subject of MVP_SUBJECTS) {
      const { data: existing, error: findError } = await supabase
        .from("sujet")
        .select("id_sujet, nom")
        .eq("nom", subject.nom)
        .maybeSingle();

      if (findError) {
        console.error(`Error finding sujet ${subject.nom}:`, findError);
        throw findError;
      }

      if (existing) {
        results.push({
          nom: subject.nom,
          id_sujet: existing.id_sujet,
          status: "already_exists",
        });
        continue;
      }

      const { error: upsertError } = await supabase
        .from("sujet")
        .upsert(subject, { onConflict: "id_sujet" });

      if (upsertError) throw upsertError;

      results.push({
        nom: subject.nom,
        id_sujet: subject.id_sujet,
        status: "created",
      });
    }

    return NextResponse.json({
      success: true,
      message: "MVP subjects ready",
      subjects: results,
    });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
