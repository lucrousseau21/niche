import { NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest";

// This should ideally be protected by a cron secret or admin auth
export async function POST() {
  console.log("Starting ingestion process...");
  try {
    const results = await ingestAllSources();
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
