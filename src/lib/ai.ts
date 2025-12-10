import OpenAI from "openai";

// Initialize OpenAI only if key is present to avoid crash on build
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function scoreArticle(
  title: string,
  content: string
): Promise<{ score: number; summary: string }> {
  if (!openai) {
    console.warn("OpenAI API Key missing. Returning random score.");
    return {
      score: Math.floor(Math.random() * 100),
      summary: "AI Summary unavailable (No API Key)",
    };
  }

  try {
    const prompt = `
      Analyze the following article.
      1. Provide a "score" from 0 to 100 based on how important/impactful this news is for a general audience interested in this niche.
      2. Provide a paragraph "summary" in French.
      
      Title: ${title}
      Content: ${content.substring(0, 1000)}...

      Return JSON: { "score": number, "summary": "string" }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: result.score || 50,
      summary: result.summary || "No summary generated.",
    };
  } catch (error) {
    console.error("AI scoring failed:", error);
    return { score: 0, summary: "Error during AI scoring." };
  }
}

export async function generateGlobalSummary(
  contents: string[]
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY missing. Cannot generate summary.");
    return "Résumé indisponible (Clé API manquante). Veuillez configurer OPENROUTER_API_KEY dans .env.local";
  }

  try {
    const prompt = `Voici une liste d'informations provenant de diverses sources récentes (articles de presse, blog, etc.). \n\nSOURCES:\n${contents.join(
      "\n\n---\n\n"
    )}\n\nINSTRUCTION: Rédige un résumé condensé et pertinent en français et en deux partie. La première partie est un résumé synthétique des points clés et les tendances de ces informations. La deuxième partie est un résumé un peu plus approfondi des tendances de ces informations, en 5-6 lignes avec un titre pour chaque. Evite les répétitions. Formate le résultat en Markdown propre. Fait que sur le football, pas sur les autres sports ou sujet. Pas de titre sur les parties.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "Niche Newsletter",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      throw new Error(
        `OpenRouter error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Aucun résumé généré.";
  } catch (error) {
    console.error("Error generating global summary:", error);
    return "Erreur lors de la génération du résumé.";
  }
}
