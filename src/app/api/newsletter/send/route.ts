import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type ProfileRow = {
  user_id: string;
  id_sujet: string;
  sujet?: { nom?: string | null } | { nom?: string | null }[] | null;
};

type ArticlePayload = {
  title?: string;
  link?: string;
  content?: string;
  sourceName?: string;
};

type ArticleRow = {
  id_article: string;
  id_sujet: string;
  donnees_article?: ArticlePayload | null;
  created_at?: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL;

const isConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseServiceRole) &&
  Boolean(resendApiKey) &&
  Boolean(resendFrom);

const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseServiceRole!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function getTopicName(topic: ProfileRow["sujet"]) {
  if (!topic) return "Sujet";
  if (Array.isArray(topic)) return topic[0]?.nom ?? "Sujet";
  return topic.nom ?? "Sujet";
}

function getArticleTitle(article: ArticleRow | null) {
  return article?.donnees_article?.title ?? "Article de veille";
}

function getArticleLink(article: ArticleRow | null) {
  return article?.donnees_article?.link ?? "#";
}

function buildNewsletterHtml(
  topicNames: string[],
  entries: { topic: string; article: ArticleRow | null }[]
) {
  const topicList = topicNames.length > 0 ? topicNames.join(", ") : "vos sujets";
  const cards = entries
    .map((entry) => {
      const title = getArticleTitle(entry.article);
      const link = getArticleLink(entry.article);
      return `<li style="margin-bottom:12px;">
        <strong>${entry.topic}</strong><br />
        <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
      </li>`;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#123;">
      <h2>Votre newsletter personnalisée</h2>
      <p>Voici une sélection rapide sur ${topicList}.</p>
      <ul style="padding-left:18px;">${cards}</ul>
      <p style="margin-top:16px;">Bonne lecture.</p>
    </div>
  `;
}

export async function POST(request: Request) {
  if (!isConfigured || !supabase || !resend) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Configuration manquante. Vérifiez NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY et RESEND_FROM_EMAIL.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request
      .json()
      .catch(() => ({ mode: "test" as "test" | "all" }));
    const mode = body?.mode === "all" ? "all" : "test";
    const testEmail = typeof body?.testEmail === "string" ? body.testEmail : null;
    const limitUsers = typeof body?.limitUsers === "number" ? body.limitUsers : 50;

    const { data: profiles, error: profileError } = await supabase
      .from("profil")
      .select("user_id,id_sujet,sujet(nom)");

    if (profileError) throw profileError;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        skipped: 0,
        details: [],
        message: "Aucun profil trouvé.",
      });
    }

    const groupedByUser = new Map<
      string,
      { topicIds: string[]; topicNames: string[] }
    >();

    for (const row of profiles as ProfileRow[]) {
      if (!row.user_id || !row.id_sujet) continue;
      const current = groupedByUser.get(row.user_id) ?? {
        topicIds: [],
        topicNames: [],
      };
      if (!current.topicIds.includes(row.id_sujet)) current.topicIds.push(row.id_sujet);
      const topicName = getTopicName(row.sujet);
      if (!current.topicNames.includes(topicName)) current.topicNames.push(topicName);
      groupedByUser.set(row.user_id, current);
    }

    const userIds =
      mode === "test"
        ? Array.from(groupedByUser.keys()).slice(0, 1)
        : Array.from(groupedByUser.keys()).slice(0, Math.max(1, limitUsers));

    const uniqueTopicIds = new Set<string>();
    for (const userId of userIds) {
      groupedByUser.get(userId)?.topicIds.forEach((id) => uniqueTopicIds.add(id));
    }

    const articleByTopic = new Map<string, ArticleRow>();
    for (const topicId of uniqueTopicIds) {
      const { data: article } = await supabase
        .from("article")
        .select("id_article,id_sujet,donnees_article,created_at")
        .eq("id_sujet", topicId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (article) {
        articleByTopic.set(topicId, article as ArticleRow);
      }
    }

    // fallback article if one topic has no article yet (test-friendly behavior)
    const { data: fallbackArticle } = await supabase
      .from("article")
      .select("id_article,id_sujet,donnees_article,created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let sent = 0;
    let skipped = 0;
    const details: Array<{ userId: string; email?: string; status: string; reason?: string }> =
      [];

    for (const userId of userIds) {
      const profile = groupedByUser.get(userId);
      if (!profile) {
        skipped++;
        details.push({ userId, status: "skipped", reason: "Profil introuvable" });
        continue;
      }

      const userEmail =
        testEmail ||
        (await supabase.auth.admin.getUserById(userId)).data.user?.email ||
        null;

      if (!userEmail) {
        skipped++;
        details.push({
          userId,
          status: "skipped",
          reason: "Email utilisateur introuvable",
        });
        continue;
      }

      const entries = profile.topicIds.map((topicId, index) => ({
        topic: profile.topicNames[index] ?? "Sujet",
        article: articleByTopic.get(topicId) ?? (fallbackArticle as ArticleRow | null),
      }));

      const html = buildNewsletterHtml(profile.topicNames, entries);

      const emailResult = await resend.emails.send({
        from: resendFrom!,
        to: userEmail,
        subject:
          mode === "test"
            ? "Newsletter test - Niche"
            : "Votre newsletter personnalisée - Niche",
        html,
      });

      if (emailResult.error) {
        skipped++;
        details.push({
          userId,
          email: userEmail,
          status: "error",
          reason: emailResult.error.message,
        });
        continue;
      }

      sent++;
      details.push({ userId, email: userEmail, status: "sent" });
    }

    return NextResponse.json({
      success: true,
      mode,
      sent,
      skipped,
      usersConsidered: userIds.length,
      details,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
