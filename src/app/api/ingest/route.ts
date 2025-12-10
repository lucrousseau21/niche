import { NextResponse } from "next/server";
import { ingestSources } from "@/lib/ingest";

// This should ideally be protected by a cron secret or admin auth
export async function POST(request: Request) {
  console.log("Starting ingestion process...");

  let subjectFilter: string | undefined;
  try {
    const body = await request.json();
    subjectFilter = body.subject;
  } catch {
    // Body might be empty, that's fine (means ingest all)
  }

  try {
    const results = await ingestSources(subjectFilter);
    console.log("Ingestion completed:", results);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Ingestion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ingestion failed: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
