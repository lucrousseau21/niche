import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import { RSS_SOURCES, RssSource } from "@/lib/constants";

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

export async function ingestSource(source: RssSource) {
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

    // Limit to first 20 items per source
    const items = feed.items.slice(0, 20);

    for (const item of items) {
      if (!item.link || !item.title || !item.isoDate) continue;

      // 2. Check existence using JSONB containment
      // Note: This might be slow on large datasets without a specific index.
      // Ideally check by link AND subject if links can duplicate across subjects (unlikely for specific article links)
      const { data: existing } = await supabase
        .from("article")
        .select("id_article")
        .contains("donnees_article", { link: item.link })
        .maybeSingle();

      if (!existing) {
        // Default values
        const score = 0;
        const summary = "";

        // 3. Prepare Article Data
        const articleData = {
          title: item.title,
          link: item.link,
          content: item.contentSnippet || item.content || "",
          publishedAt: new Date(item.isoDate),
          sourceName: source.name,
          score,
          status: "new",
        };

        // Insert Article with id_sujet relation
        const { data: newArticle, error: insertError } = await supabase
          .from("article")
          .insert({
            id_sujet: sujet.id_sujet, // Linking the article to its subject
            donnees_article: articleData,
          })
          .select("id_article")
          .single();

        if (insertError) {
          console.error(`Failed to insert article ${item.title}:`, insertError);
          continue;
        }

        // 4. Insert Recap (Summary) if available (currently empty)
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

    console.log(
      `Ingested ${newCount} articles from ${source.name} (${source.sujetName})`
    );
    return newCount;
  } catch (error) {
    console.error(`Error ingesting ${source.name}:`, error);
    // Don't throw, just log so other sources continue
    return 0;
  }
}

/**
 * Ingest sources, optionally filtered by a specific subject.
 * @param subjectFilter Optional name of the subject to strict filter by (case insensitive matching on source.sujetName)
 */
export async function ingestSources(subjectFilter?: string) {
  let targets = RSS_SOURCES;

  if (subjectFilter) {
    console.log(`Filtering ingestion for subject: ${subjectFilter}`);
    targets = RSS_SOURCES.filter(
      (s) => s.sujetName.toLowerCase() === subjectFilter.toLowerCase()
    );
  } else {
    console.log("Starting ingestion for ALL sources...");
  }

  const results = [];
  for (const source of targets) {
    try {
      const count = await ingestSource(source);
      results.push({
        source: source.name,
        topic: source.sujetName,
        newArticles: count,
      });
    } catch (e) {
      results.push({ source: source.name, topic: source.sujetName, error: e });
    }
  }
  return results;
}
