import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Variables d'environnement Supabase manquantes." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    let query = supabase
      .from("article")
      .select("id_article, donnees_article, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (topicId) {
      query = query.eq("id_sujet", topicId);
    }

    const { data: articles, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, articles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
