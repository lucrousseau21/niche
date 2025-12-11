import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.warn(
    "WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. setup/ingest might fail due to RLS."
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

const parser = new Parser();

// Temporary hardcoded sources since 'source' table doesn't exist yet
const HARDCODED_SOURCES = [
  {
    name: "L'Equipe",
    url: "https://dwh.lequipe.fr/api/edito/rss?path=/Football/",
    sujetName: "Football",
  },
];

export async function ingestSource(source: {
  name: string;
  url: string;
  sujetName: string;
}) {
  // 1. Get Subject ID
  const { data: sujet, error: sujetError } = await supabase
    .from("sujet")
    .select("id_sujet")
    .ilike("nom", source.sujetName)
    .maybeSingle();

  if (sujetError || !sujet) {
    console.error(
      `Sujet '${source.sujetName}' not found or error:`,
      sujetError
    );
    return 0; // Skip if subject doesn't exist
  }

  try {
    const feed = await parser.parseURL(source.url);
    let newCount = 0;

    // Limit to first 20 items
    const items = feed.items.slice(0, 20);

    for (const item of items) {
      if (!item.link || !item.title || !item.isoDate) continue;

      // 2. Check existence using JSONB containment
      // Note: This might be slow on large datasets without a specific index
      const { data: existing } = await supabase
        .from("article")
        .select("id_article")
        .contains("donnees_article", { link: item.link })
        .maybeSingle();

      if (!existing) {
        // Generate AI Score and Summary
        // const { score, summary } = await scoreArticle(
        //   item.title,
        //   item.contentSnippet || item.content || ""
        // );
        const score = 0;
        const summary = "";

        // 3. Insert Article
        const articleData = {
          title: item.title,
          link: item.link,
          content: item.contentSnippet || item.content || "",
          publishedAt: new Date(item.isoDate),
          sourceName: source.name,
          score,
          status: "new",
        };

        const { data: newArticle, error: insertError } = await supabase
          .from("article")
          .insert({
            donnees_article: articleData,
            id_sujet: sujet.id_sujet,
          })
          .select("id_article")
          .single();

        if (insertError) {
          console.error(`Failed to insert article ${item.title}:`, insertError);
          continue;
        }

        // 4. Insert Recap (Summary)
        if (summary && newArticle) {
          const { error: recapError } = await supabase.from("recap").insert({
            id_article: newArticle.id_article,
            contenu: summary,
          });

          if (recapError) console.error("Failed to insert recap:", recapError);
        }

        newCount++;
      }
    }

    console.log(`Ingested ${newCount} articles from ${source.name}`);
    return newCount;
  } catch (error) {
    console.error(`Error ingesting ${source.name}:`, error);
    throw error;
  }
}

export async function ingestAllSources(topicName?: string) {
  console.log(
    "Starting ingestion with hardcoded sources...",
    topicName ? `for topic: ${topicName}` : "all topics"
  );

  const results = [];
  const sourcesToIngest = topicName
    ? HARDCODED_SOURCES.filter(
        (s) => s.sujetName.toLowerCase() === topicName.toLowerCase()
      )
    : HARDCODED_SOURCES;

  for (const source of sourcesToIngest) {
    try {
      const count = await ingestSource(source);
      results.push({ source: source.name, newArticles: count });
    } catch (e) {
      results.push({ source: source.name, error: e });
    }
  }
  return results;
}
