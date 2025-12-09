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
      2. Provide a 1-sentence "summary" in French.
      
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
