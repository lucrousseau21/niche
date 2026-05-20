import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  try {
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
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const recaps = JSON.parse(
  readFileSync(resolve(root, "supabase/mvp-recaps.json"), "utf8")
);

const subjects = [
  {
    id_sujet: 1,
    nom: "Développement Fullstack & Web3",
    description:
      "Frameworks, architectures, smart contracts et écosystème Web3.",
  },
  {
    id_sujet: 2,
    nom: "Intelligence Artificielle & Data",
    description: "LLM, data engineering, MLOps et outils d'analyse.",
  },
  {
    id_sujet: 3,
    nom: "Design d'Interface & UX",
    description: "UI, accessibilité, design systems et recherche utilisateur.",
  },
];

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { error: sujetErr } = await supabase.from("sujet").upsert(subjects, {
  onConflict: "id_sujet",
});
if (sujetErr) {
  console.error("sujet:", sujetErr.message);
  process.exit(1);
}

const ids = recaps.map((r) => r.id_sujet);

const { data: oldRecaps } = await supabase
  .from("recap")
  .select("id_recap, id_article")
  .in("id_sujet", ids);

const oldArticleIds = (oldRecaps ?? [])
  .map((r) => r.id_article)
  .filter(Boolean);

const { error: delRecapErr } = await supabase
  .from("recap")
  .delete()
  .in("id_sujet", ids);
if (delRecapErr) {
  console.error("delete recap:", delRecapErr.message);
  process.exit(1);
}

if (oldArticleIds.length > 0) {
  await supabase.from("article").delete().in("id_article", oldArticleIds);
}

const insertedRecaps = [];

for (const r of recaps) {
  const { data: article, error: artErr } = await supabase
    .from("article")
    .insert({
      id_sujet: r.id_sujet,
      donnees_article: {
        title: r.titre,
        source: "mvp-manual",
        status: "published",
      },
    })
    .select("id_article")
    .single();

  if (artErr) {
    console.error(`article sujet ${r.id_sujet}:`, artErr.message);
    process.exit(1);
  }

  const { data: recap, error: recapErr } = await supabase
    .from("recap")
    .insert({
      id_sujet: r.id_sujet,
      id_article: article.id_article,
      titre: r.titre,
      resume: r.resume,
      contenu: r.contenu,
    })
    .select("id_recap, id_sujet, titre")
    .single();

  if (recapErr) {
    console.error(`recap sujet ${r.id_sujet}:`, recapErr.message);
    process.exit(1);
  }

  insertedRecaps.push(recap);
}

console.log("OK — veilles insérées:");
for (const row of insertedRecaps) {
  console.log(`  #${row.id_recap} sujet ${row.id_sujet} — ${row.titre}`);
}
