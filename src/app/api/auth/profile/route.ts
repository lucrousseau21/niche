// src/app/api/auth/profile/route.ts
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

  return createClient(supabaseUrl, supabaseKey);
}

function getErrorMessage(err: unknown): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    // Try to read a message property if present
    const maybeMsg = (err as any)?.message;
    if (typeof maybeMsg === "string") return maybeMsg;
  } catch {
    // ignore
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function isMissingColumnError(err: unknown, columnName: string) {
  const msg = getErrorMessage(err).toLowerCase();
  return msg.includes("column") && msg.includes(columnName.toLowerCase());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, full_name } = body ?? {};

    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing required fields: id and email are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Configuration Supabase manquante." },
        { status: 500 }
      );
    }

    // Try 1: upsert with full_name (common)
    try {
      const payload = { id, email, full_name };
      const { data, error } = await supabase
        .from("profil")
        .upsert(payload, { onConflict: "id" })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, profile: data });
    } catch (err1) {
      const m1 = getErrorMessage(err1);
      console.error("Attempt to upsert with full_name failed:", m1);

      // If error complains about column 'full_name', try with 'nom'
      if (isMissingColumnError(err1, "full_name")) {
        try {
          const payload2: Record<string, any> = { id, email };
          if (full_name) payload2["nom"] = full_name;

          const { data: data2, error: error2 } = await supabase
            .from("profil")
            .upsert(payload2, { onConflict: "id" })
            .select();

          if (error2) throw error2;
          return NextResponse.json({ success: true, profile: data2 });
        } catch (err2) {
          const m2 = getErrorMessage(err2);
          console.error("Second attempt to insert into profil failed:", m2);
          // fallthrough to minimal fallback attempt
        }
      }
      // else fall through to fallback below
    }

    // Fallback: try inserting only id + email (safer, works even if name column doesn't exist)
    try {
      const payload3 = { id, email };
      const { data: data3, error: error3 } = await supabase
        .from("profil")
        .upsert(payload3, { onConflict: "id" })
        .select();

      if (error3) throw error3;
      return NextResponse.json({ success: true, profile: data3 });
    } catch (err3) {
      const m3 = getErrorMessage(err3);
      console.error("Fallback insert into profil failed:", m3);
      return NextResponse.json(
        { error: m3 || "Failed to create profile." },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const msg = getErrorMessage(err);
    console.error("Profile API error:", msg);
    return NextResponse.json({ error: msg || "Unknown error" }, { status: 500 });
  }
}