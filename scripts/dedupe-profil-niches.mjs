/**
 * Nettoie les doublons profil (même user_id + id_sujet) : une seule ligne par paire.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    process.env[t.slice(0, i).trim()] = v;
  }
}

loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: rows, error } = await supabase
  .from("profil")
  .select("user_id, id_sujet, grade")
  .not("id_sujet", "is", null);

if (error) {
  console.error(error.message);
  process.exit(1);
}

const groups = new Map();
for (const row of rows ?? []) {
  const key = `${row.user_id}:${row.id_sujet}`;
  if (!groups.has(key)) groups.set(key, row);
}

let cleanedUsers = 0;

const byUser = new Map();
for (const row of rows ?? []) {
  if (!byUser.has(row.user_id)) byUser.set(row.user_id, new Set());
  byUser.get(row.user_id).add(row.id_sujet);
}

for (const [userId, subjectSet] of byUser) {
  const uniqueIds = [...subjectSet];
  const mvpIds = uniqueIds.filter((id) => [1, 2, 3].includes(Number(id)));

  await supabase
    .from("profil")
    .delete()
    .eq("user_id", userId)
    .not("id_sujet", "is", null);

  if (mvpIds.length === 0) continue;

  const sample = rows.find(
    (r) => r.user_id === userId && r.id_sujet === mvpIds[0]
  );
  const grade = sample?.grade ?? "Débutant";

  await supabase.from("profil").insert(
    mvpIds.map((id_sujet) => ({
      user_id: userId,
      id_sujet: Number(id_sujet),
      grade,
    }))
  );
  cleanedUsers++;
}

console.log(`Profils niche normalisés pour ${cleanedUsers} utilisateur(s).`);
