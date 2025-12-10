import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RSS_SOURCES } from "@/lib/constants";

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

export async function POST() {
  console.log("Starting Setup...");
  try {
    // 1. Get unique topics from configured sources
    const topics = Array.from(new Set(RSS_SOURCES.map((s) => s.sujetName)));
    console.log("Configured topics:", topics);

    const results = [];

    for (const topic of topics) {
      console.log(`Checking Sujet '${topic}'...`);
      const { data: existingSujet, error: findError } = await supabase
        .from("sujet")
        .select("id_sujet")
        .ilike("nom", topic)
        .maybeSingle();

      if (findError) {
        console.error(`Error finding sujet '${topic}':`, findError);
        results.push({ topic, status: "error", error: findError });
        continue;
      }

      if (!existingSujet) {
        console.log(`Creating Sujet '${topic}'...`);
        const { error: insertError } = await supabase.from("sujet").insert({
          nom: topic,
          description: `All about ${topic} news`,
        });

        if (insertError) {
          console.error(`Sujet '${topic}' creation failed:`, insertError);
          results.push({ topic, status: "error", error: insertError });
        } else {
          console.log(`Sujet '${topic}' created.`);
          results.push({ topic, status: "created" });
        }
      } else {
        console.log(`Sujet '${topic}' already exists:`, existingSujet.id_sujet);
        results.push({ topic, status: "exists", id: existingSujet.id_sujet });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Setup complete for all configured topics.",
      results,
    });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
