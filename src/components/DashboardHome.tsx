"use client";

import React, { useState, useEffect } from "react";
import NewsletterCard from "@/components/NewsletterCard";
import { User } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

// Initialisation du client Supabase
const supabase = createBrowserClient();

// Type pour les données de la table 'recap'
type RecapItem = {
  id_recap: number;
  created_at: string;
  titre: string;
  categorie: string;
  resume: any; // JSON
  contenu: string;
};

export default function DashboardHome({
  user,
  subjects,
}: {
  user: User;
  subjects: { nom: string; description: string }[];
}) {
  const impactFilters = ["Fort impact", "Impact moyen", "Faible impact"];

  // États pour les newsletters
  const [recaps, setRecaps] = useState<RecapItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Use user metadata name or fallback to Alex
  const userName = user.user_metadata?.full_name?.split(" ")[0] || "Alex";

  // --- 1. Récupération des données Supabase ---
  useEffect(() => {
    const fetchRecaps = async () => {
      setLoading(true);

      // Extract subject names for filtering
      const subjectNames = subjects.map((s) => s.nom);

      if (subjectNames.length === 0) {
        setRecaps([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("recap")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur chargement recaps details:",
          JSON.stringify(error, null, 2)
        );
      } else {
        // Normalize for comparison
        const normalizedSubjects = subjectNames.map((s) =>
          s.trim().toLowerCase()
        );

        const filtered = (data || []).filter((r: any) => {
          // Check 'titre' as primary match, and 'categorie' as fallback.
          const title = r.titre ? r.titre.trim().toLowerCase() : "";
          const cat = r.categorie ? r.categorie.trim().toLowerCase() : "";

          return (
            normalizedSubjects.includes(title) ||
            normalizedSubjects.includes(cat)
          );
        });

        setRecaps(filtered);
      }
      setLoading(false);
    };

    fetchRecaps();
  }, []);

  // --- 2. Fonction pour nettoyer le JSON du résumé ---
  const parseResume = (resumeData: any): string[] => {
    try {
      let parsed = resumeData;
      // If it's a string, try to parse it
      if (typeof resumeData === "string") {
        parsed = JSON.parse(resumeData);
      }

      // Case 1: Array
      if (Array.isArray(parsed)) return parsed;

      // Case 2: Object with keys like titre_1, titre_2, etc.
      if (typeof parsed === "object" && parsed !== null) {
        // Extract values strictly from keys matching the pattern or just take all string values?
        // User specific example showed "titre_1", "titre_2", etc.
        // Let's take all values values that are strings, or specific keys if we want to be strict.
        // Taking all values gives flexibility if keys change slightly (e.g. point_1).
        const values = Object.values(parsed).filter(
          (val) => typeof val === "string"
        ) as string[];
        if (values.length > 0) return values;
      }

      // Fallback if structure is unknown or empty
      return ["Résumé non disponible"];
    } catch (e) {
      console.error("Error parsing resume:", e);
      // If it was a simple string that failed parsing, return it as single point
      if (typeof resumeData === "string" && resumeData.trim().length > 0)
        return [resumeData];

      return ["Résumé non disponible"];
    }
  };

  return (
    <div className="bg-[#FFFDF7] min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-[#1A3D3B] mb-2">
            Bonjour {userName} !
          </h1>
          <p className="text-gray-500 text-lg">Voici votre veille du jour</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <div className="font-bold text-[#1A3D3B] text-lg">
                Vous êtes à jour
              </div>
              <div className="text-gray-500 text-sm">
                {/* Exemple de stat dynamique simple */}
                {recaps.length > 0 ? `1/${recaps.length}` : "0/0"} veilles
                consultées
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#4ADE80] w-[16%] rounded-full" />
          </div>
        </div>

        {/* Stats Overview (Statique pour l'instant) */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-10">
          <h3 className="text-[#1A3D3B] text-lg font-semibold mb-6">
            Vue d'ensemble
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="bg-[#4ADE80] text-[#1A3D3B] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 flex items-center gap-1">
                +12%
              </span>
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">24</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Newsletters
                <br />
                lues
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center border-l border-r border-gray-100 px-2">
              <span className="bg-[#4ADE80] text-[#1A3D3B] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 flex items-center gap-1">
                +8%
              </span>
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">18</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Articles
                <br />
                sauvegardés
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <span className="bg-[#4ADE80] text-[#1A3D3B] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 flex items-center gap-1">
                +15%
              </span>
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">4.2h</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Temps
                <br />
                économisé
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toggle Button */}
        <div className="flex justify-center mb-8">
          <button className="bg-[#FFF9F0] text-[#1A3D3B] px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border border-[#EFE8D8] shadow-sm hover:bg-[#FFF5E5] transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filtres
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-8">
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              FILTRES THÉMATIQUES
            </h4>
            <div className="flex flex-wrap gap-2">
              {subjects && subjects.length > 0 ? (
                subjects.map((subject) => (
                  <button
                    key={subject.nom}
                    title={subject.description}
                    className="px-4 py-2 rounded-2xl border border-gray-200 text-sm text-gray-600 font-medium hover:border-[#1A3D3B] hover:text-[#1A3D3B] transition-colors bg-white shadow-sm"
                  >
                    {subject.nom}
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  Aucun sujet disponible
                </span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              FILTRES PAR IMPACT
            </h4>
            <div className="flex flex-wrap gap-2">
              {impactFilters.map((f) => (
                <button
                  key={f}
                  className="px-4 py-2 rounded-2xl border border-gray-200 text-sm text-gray-600 font-medium hover:border-[#1A3D3B] hover:text-[#1A3D3B] transition-colors bg-white shadow-sm"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Link - Center */}
        <div className="flex justify-center mb-10">
          <span className="bg-white border border-gray-200 text-gray-500 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
            Tableau de bord
          </span>
        </div>

        {/* Feed Header */}
        <div className="flex items-end justify-between mb-4 px-1">
          <h2 className="text-xl font-bold text-[#1A3D3B]">Veilles du jour</h2>
          <span className="text-xs font-medium text-gray-400 mb-1">
            {recaps.length} résultat{recaps.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Feed List (Newsletters) */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Chargement de vos veilles...
            </div>
          ) : recaps.length > 0 ? (
            /* CORRECTION: Ajout de l'index dans la fonction map et sécurisation de la prop key */
            recaps.map((recap, index) => (
              <NewsletterCard
                key={recap.id ? recap.id : `recap-${index}`}
                id={recap.id}
                category={recap.categorie || "Actualité"}
                title={recap.titre || "Sans titre"}
                date={new Date(recap.created_at).toLocaleDateString("fr-FR")}
                bullets={parseResume(recap.resume)}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              Aucune newsletter pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
