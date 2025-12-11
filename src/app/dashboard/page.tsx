"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface Article {
  id_article: string | number;
  donnees_article: {
    link: string;
    title: string;
    publishedAt: string;
    sourceName: string;
  };
}

interface Subject {
  id_sujet: number;
  nom: string;
  description: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Subject | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchArticles = async (topicId?: number) => {
    try {
      const url = topicId
        ? `/api/articles?topicId=${topicId}`
        : "/api/articles";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error("Failed to fetch articles", e);
    }
  };

  const fetchSubjects = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("sujet").select("*");
    if (data) {
      setSubjects(data);
    }
  };

  // Fetch subjects and user on mount
  useEffect(() => {
    fetchSubjects();
    fetchUser();
  }, []);

  const handleRefresh = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: JSON.stringify({
          topic: selectedTopic.nom,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
      // Refresh articles list after ingestion
      await fetchArticles(selectedTopic.id_sujet);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (subject: Subject) => {
    setSelectedTopic(subject);
    fetchArticles(subject.id_sujet);
  };

  return (
    <div className="h-screen flex flex-col p-8 overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between mb-4 flex-none">
        <Link
          href="/"
          className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Niche Dashboard
        </Link>
        {user?.email && (
          <span className="text-sm text-gray-600">
            Vous êtes connecté en tant que{" "}
            <span className="font-semibold">{user.email}</span>
          </span>
        )}
      </div>

      {result !== null && (
        <div className="bg-gray-100 p-4 rounded mb-4 flex-none">
          <h3 className="font-bold">Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {/* Topics Column */}
        <div className="md:col-span-1 bg-white border p-4 rounded shadow flex flex-col h-full overflow-hidden">
          <h2 className="text-xl font-bold mb-4 flex-none text-gray-800">
            Topics
          </h2>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              {subjects.length === 0 ? (
                <p className="text-gray-500 italic">Aucun sujet trouvé.</p>
              ) : (
                subjects.map((subject) => (
                  <div
                    key={subject.id_sujet}
                    className={`p-3 border rounded cursor-pointer transition-colors flex-none ${
                      selectedTopic?.id_sujet === subject.id_sujet
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50 hover:border-blue-300"
                    }`}
                    onClick={() => handleTopicClick(subject)}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {subject.nom}
                    </h3>
                    {subject.description && (
                      <p className="text-sm text-gray-500">
                        {subject.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Feed Column */}
        <div className="md:col-span-2 bg-white border rounded shadow flex flex-col h-full overflow-hidden relative">
          {!selectedTopic ? (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium">
              Sélectionnez un sujet pour voir les articles
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex-none bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  Feed ({selectedTopic.nom})
                </h2>
              </div>

              <div className="flex-grow overflow-y-auto p-4 pb-24">
                {articles.length === 0 ? (
                  <p className="text-gray-500">Aucun article trouvé.</p>
                ) : (
                  <ul className="space-y-4">
                    {articles.map((art) => (
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

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 flex items-center justify-end gap-3 z-20">
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await fetch("/api/setup", { method: "POST" });
                      alert("Configuration terminée !");
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Configurer
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors"
                >
                  {loading ? "Recherche..." : "Lancer la recherche"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
