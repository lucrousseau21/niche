import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import recaps from "../../../../supabase/mvp-recaps.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  if (!supabaseKey) {
    return NextResponse.json(
      {
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local",
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  try {
    for (const subject of MVP_SUBJECTS) {
      const { error } = await supabase.from("sujet").upsert(subject, {
        onConflict: "id_sujet",
      });
      if (error) throw error;
    }

    const subjectIds = recaps.map((r) => r.id_sujet);

    const { data: oldRecaps } = await supabase
      .from("recap")
      .select("id_article")
      .in("id_sujet", subjectIds);

    await supabase.from("recap").delete().in("id_sujet", subjectIds);

    const oldArticleIds = (oldRecaps ?? [])
      .map((r) => r.id_article)
      .filter((id): id is number => id != null);

    if (oldArticleIds.length > 0) {
      await supabase.from("article").delete().in("id_article", oldArticleIds);
    }

    const inserted: { id_recap: number; id_sujet: number; titre: string }[] =
      [];

    for (const r of recaps) {
      const { data: article, error: articleError } = await supabase
        .from("article")
        .insert({
          id_sujet: r.id_sujet,
          donnees_article: {
            title: r.titre,
            source: "mvp-manual",
            status: "published",
          },
        })
        .select("id_article")
        .single();

      if (articleError) throw articleError;

      const { data: recap, error: recapError } = await supabase
        .from("recap")
        .insert({
          id_sujet: r.id_sujet,
          id_article: article.id_article,
          titre: r.titre,
          resume: r.resume,
          contenu: r.contenu,
        })
        .select("id_recap, id_sujet, titre")
        .single();

      if (recapError) throw recapError;
      if (recap) inserted.push(recap);
    }

    return NextResponse.json({
      success: true,
      message: `${inserted.length} veilles insérées`,
      recaps: inserted,
    });
  } catch (error) {
    console.error("seed-recaps error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
