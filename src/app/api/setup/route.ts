import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    // 1. Ensure Topic 'Football' exists in 'sujet'
    console.log("Checking Sujet Football...");
    const { data: existingSujet, error: findError } = await supabase
      .from("sujet")
      .select("id_sujet")
      .ilike("nom", "Football")
      .maybeSingle();

    if (findError) console.error("Error finding sujet:", findError);

    if (!existingSujet) {
      console.log("Creating Sujet 'Football'...");
      const { error: insertError } = await supabase.from("sujet").insert({
        nom: "Football",
        description: "All about Football news",
      });

      if (insertError) {
        console.error("Sujet creation failed:", insertError);
        throw insertError;
      }
      console.log("Sujet 'Football' created.");
    } else {
      console.log("Sujet 'Football' already exists:", existingSujet.id_sujet);
    }

    // Since we don't have a 'source' table in the new schema, we are done here.
    // The sources are hardcoded in src/lib/ingest.ts for now.

    return NextResponse.json({
      success: true,
      message:
        "Football setup complete (Sujet created, sources configured in code)",
    });
  } catch (error) {
    console.error("Setup API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
