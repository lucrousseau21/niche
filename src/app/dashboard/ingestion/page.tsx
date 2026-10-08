"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Rss, Layers, CheckCircle2, AlertTriangle } from "lucide-react";
import { useDashboardTheme } from "../ThemeContext";

interface SubjectOption {
  id_sujet: number;
  nom: string;
}

export default function IngestionPage() {
  const { isDark } = useDashboardTheme();

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [ingestTopic, setIngestTopic] = useState<string>("");
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestResult, setIngestResult] = useState<any>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/admin/sujets");
        const data = await res.json();
        if (data.success && data.subjects) {
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.error("Erreur sujets ingestion:", err);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto py-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Ingestion Card */}
        <div
          className={`rounded-2xl border p-8 shadow-sm space-y-6 transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
                  }`}
                >
                  Pipeline de données
                </span>
              </div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-[#1A3D3B]"
                }`}
              >
                Déclencher l'ingestion des flux RSS
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Lance le scrape des sources RSS configurées, la notation IA des articles et la création de résumés de veille.
              </p>
            </div>

            <div
              className={`p-3 rounded-xl flex-none ${
                isDark ? "bg-[#101924] text-emerald-400 border border-[#223347]" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <Rss className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-xs font-semibold uppercase mb-1.5 ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Thématique ciblée (Optionnel)
              </label>
              <select
                value={ingestTopic}
                onChange={(e) => setIngestTopic(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  isDark
                    ? "bg-[#0E1722] border border-[#223347] text-white focus:ring-emerald-500/30 focus:border-emerald-500"
                    : "bg-gray-50 border border-gray-200 text-gray-900 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                }`}
              >
                <option value="">Tous les sujets configurés ({subjects.length} niches)</option>
                {subjects.map((s) => (
                  <option key={s.id_sujet} value={s.nom}>
                    #{s.id_sujet} - {s.nom}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled
              title="Ingestion temporairement désactivée (configuration des flux RSS requise)"
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-not-allowed opacity-50 border ${
                isDark
                  ? "bg-slate-800 text-slate-400 border-slate-700"
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Lancer l'ingestion maintenant
            </button>
          </div>

          {/* Résultat d'ingestion */}
          {ingestResult && (
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark ? "bg-[#0E1722] border-[#223347]" : "bg-gray-50 border border-gray-200"
              }`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Résultat de l'exécution :
              </span>
              <pre
                className={`text-xs font-mono overflow-x-auto p-3 rounded-lg border max-h-60 ${
                  isDark
                    ? "bg-[#101924] border-[#223347] text-emerald-400"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {JSON.stringify(ingestResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Informations sur le pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-5 rounded-2xl border transition ${
              isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                Architecture du Scraper
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              L'ingestion extrait le contenu brut depuis les flux RSS des médias spécialisés, filtre les doublons récents et alimente la table des articles.
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border transition ${
              isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                Filtrage & Scoring IA
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Les articles ingérés sont évalués selon leur pertinence stratégique. Seuls les plus pertinents sont synthétisés dans les veilles hebdomadaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
