/**
 * Supprime les sujets legacy (Tech, Générale — IDs 4 et 5)
 * et nettoie les profils / recaps associés.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const LEGACY_IDS = [4, 5];

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: oldRecaps } = await supabase
  .from("recap")
  .select("id_recap, id_article")
  .in("id_sujet", LEGACY_IDS);

const articleIds = (oldRecaps ?? [])
  .map((r) => r.id_article)
  .filter(Boolean);

await supabase.from("recap").delete().in("id_sujet", LEGACY_IDS);
if (articleIds.length) {
  await supabase.from("article").delete().in("id_article", articleIds);
}
await supabase.from("profil").delete().in("id_sujet", LEGACY_IDS);
await supabase.from("article").delete().in("id_sujet", LEGACY_IDS);
const { error } = await supabase.from("sujet").delete().in("id_sujet", LEGACY_IDS);

if (error) {
  console.error("Erreur suppression sujets:", error.message);
  process.exit(1);
}

console.log("OK — sujets 4 (Tech) et 5 (Générale) supprimés.");
