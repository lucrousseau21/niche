"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [articles, setArticles] = useState<any[]>([]);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error("Failed to fetch articles", e);
    }
  };

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ingest", { method: "POST" });
      const data = await res.json();
      setResult(data);
      // Refresh articles list after ingestion
      await fetchArticles();
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Niche Newsletter Dashboard</h1>

      <div className="mb-8">
        <div className="flex gap-4">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                await fetch("/api/setup", { method: "POST" });
                alert("Sources Football initialisées !");
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Initialiser Football (L&apos;Equipe)
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Recherche en cours..." : "Lancer la recherche"}
          </button>
        </div>
      </div>

      {result !== null && (
        <div className="bg-gray-100 p-4 rounded mb-8">
          <h3 className="font-bold">Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {/* Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Topics</h2>
          <p className="text-gray-500">Sidebar for filtering topics.</p>
        </div>
        <div className="md:col-span-2 bg-white border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Feed (Derniers Articles)</h2>
          {articles.length === 0 ? (
            <p className="text-gray-500">Aucun article trouvé.</p>
          ) : (
            <ul className="space-y-4">
              {articles.map((art: any) => (
                <li key={art.id_article} className="border-b pb-2">
                  <a
                    href={art.donnees_article.link}
                    target="_blank"
                    className="text-blue-600 hover:underline font-semibold block"
                  >
                    {art.donnees_article.title}
                  </a>
                  <div className="text-sm text-gray-500 flex gap-2">
                    <span>
                      {new Date(
                        art.donnees_article.publishedAt
                      ).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>{art.donnees_article.sourceName}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
