import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { filterMvpSubjectIds } from "@/lib/mvp-subjects";
import { saveUserMvpSubjects } from "@/lib/profil-preferences";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { subjectIds?: number[]; grade?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const ids = filterMvpSubjectIds(body.subjectIds ?? []);
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Sélectionnez au moins une niche." },
      { status: 400 }
    );
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const client = serviceKey
    ? createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { persistSession: false } }
      )
    : supabase;

  const { error } = await saveUserMvpSubjects(
    client,
    user.id,
    ids,
    body.grade
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, subjectIds: ids });
}
