import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateGlobalSummary } from "@/lib/ai";

interface Article {
  donnees_article: {
    publishedAt: string | number | Date;
    title: string;
    sourceName: string;
    content?: string;
    contentSnippet?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function POST(request: Request) {
  // Initialize Supabase Client (Service Role to ensure access)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  try {
    // Check if specific articles are requested
    const body = await request.json().catch(() => ({}));
    const { articleIds } = body;

    let articles;

    // Date start of today (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (articleIds && Array.isArray(articleIds) && articleIds.length > 0) {
      const { data, error } = await supabase
        .from("article")
        .select("*")
        .in("id_article", articleIds);

      if (error) throw error;
      articles = data;
    } else {
      // Fetch articles from today
      // Note: "donnees_article" is JSONB. We can filter on the client side or try to filter natively if setup.
      // For simplicity/robustness without knowing index setup: fetch last 100 and filter in JS.
      const { data, error } = await supabase
        .from("article")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Filter for articles published today
      articles = data.filter((a: Article) => {
        const publishedAt = new Date(a.donnees_article.publishedAt);
        return publishedAt >= today;
      });

      console.log(`Found ${articles.length} articles from today.`);
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Aucun article trouvé pour le résumé.",
      });
    }

    // Prepare content for AI
    const contents = articles.map((a: Article) => {
      const d = a.donnees_article;
      return `Titre: ${d.title}\nSource: ${d.sourceName}\nDate: ${
        d.publishedAt
      }\nContenu: ${d.content || d.contentSnippet || "Contenu indisponible"}`;
    });

    console.log(`Generating summary for ${articles.length} articles...`);

    // Call AI
    const summary = await generateGlobalSummary(contents);

    // Save to DB (Article + Recap)
    try {
      // 1. Get Subject ID (assuming 'Football' as per prompt context, or default to first found)
      // Ideally this should be dynamic based on the filter used
      const { data: sujet } = await supabase
        .from("sujet")
        .select("id_sujet")
        .ilike("nom", "Football")
        .maybeSingle();

      if (sujet) {
        const digestTitle = `Résumé IA - Matchs & Actus du ${new Date().toLocaleDateString(
          "fr-FR"
        )}`;

        // 2. Create Article container for the digest
        const { data: newArticle, error: articleError } = await supabase
          .from("article")
          .insert({
            id_sujet: sujet.id_sujet,
            donnees_article: {
              title: digestTitle,
              link: `#digest-${Date.now()}`, // Dummy link
              content: summary,
              publishedAt: new Date(),
              sourceName: "IA Assistant",
              score: 100,
              status: "digest",
            },
          })
          .select("id_article")
          .single();

        if (articleError) {
          console.error("Failed to save digest article:", articleError);
        } else if (newArticle) {
          // 3. Save to recap table
          const { error: recapError } = await supabase.from("recap").insert({
            id_article: newArticle.id_article,
            contenu: summary,
          });

          if (recapError) {
            console.error("Failed to save recap:", recapError);
          } else {
            console.log("Digest saved successfully to DB (Article + Recap).");
          }
        }
      } else {
        console.warn("Subject 'Football' not found. Cannot save digest to DB.");
      }
    } catch (saveError) {
      console.error("Error saving digest to DB:", saveError);
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Digest generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Digest generation failed: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
