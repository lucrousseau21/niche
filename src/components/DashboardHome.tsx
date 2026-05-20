"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import NewsletterCard from "@/components/NewsletterCard";
import { User } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { parseResume } from "@/lib/parseResume";
import { normalizeRecaps } from "@/lib/recap";
import { fetchUserMvpSubjects } from "@/lib/profil-preferences";
import type { RecapWithSubject, UserSubject } from "@/types/subjects";

const supabase = createBrowserClient();

export default function DashboardHome({
  user,
  subjects: initialSubjects,
}: {
  user: User;
  subjects: UserSubject[];
}) {
  const impactFilters = ["Fort impact", "Impact moyen", "Faible impact"];
  const [subjects, setSubjects] = useState<UserSubject[]>(initialSubjects);
  const [recaps, setRecaps] = useState<RecapWithSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = user.user_metadata?.full_name?.split(" ")[0] || "Alex";
  const subjectIds = useMemo(
    () => subjects.map((s) => s.id_sujet),
    [subjects]
  );

  useEffect(() => {
    let cancelled = false;

    const loadSubjects = async () => {
      const fresh = await fetchUserMvpSubjects(supabase, user.id);
      if (!cancelled) setSubjects(fresh);
    };

    loadSubjects();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  useEffect(() => {
    const fetchRecaps = async () => {
      setLoading(true);

      if (subjectIds.length === 0) {
        setRecaps([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("recap")
        .select(
          "id_recap, created_at, titre, resume, contenu, id_sujet, sujet(nom)"
        )
        .in("id_sujet", subjectIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur chargement recaps:",
          JSON.stringify(error, null, 2)
        );
        setRecaps([]);
      } else {
        setRecaps(normalizeRecaps(data || []));
      }
      setLoading(false);
    };

    fetchRecaps();
  }, [subjectIds]);

  const hasSubjects = subjects.length > 0;

  return (
    <div className="bg-[#FFFDF7] min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-[#1A3D3B] mb-2">
            Bonjour {userName} !
          </h1>
          <p className="text-gray-500 text-lg">Voici votre veille du jour</p>
        </div>

        {!hasSubjects && !loading && (
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-8 text-center">
            <p className="text-gray-600 mb-4">
              Choisissez au moins une niche pour afficher vos veilles.
            </p>
            <Link
              href="/settings"
              className="inline-block px-6 py-2.5 bg-[#66BB6A] text-white rounded-xl font-semibold hover:bg-[#5da860] transition-colors"
            >
              Choisir mes niches
            </Link>
          </div>
        )}

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
                {recaps.length} veille{recaps.length > 1 ? "s" : ""} disponible
                {recaps.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4ADE80] rounded-full transition-all"
              style={{ width: recaps.length > 0 ? "100%" : "0%" }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-10">
          <h3 className="text-[#1A3D3B] text-lg font-semibold mb-6">
            Vue d&apos;ensemble
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">
                {recaps.length}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Veilles
                <br />
                disponibles
              </div>
            </div>
            <div className="flex flex-col items-center border-l border-r border-gray-100 px-2">
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">
                {subjects.length}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Niches
                <br />
                suivies
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-[#1A3D3B] mb-1">—</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium leading-tight">
                Prochaine
                <br />
                veille
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            type="button"
            className="bg-[#FFF9F0] text-[#1A3D3B] px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border border-[#EFE8D8] shadow-sm hover:bg-[#FFF5E5] transition-colors"
          >
            Filtres
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-8">
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              VOS NICHES
            </h4>
            <div className="flex flex-wrap gap-2">
              {hasSubjects ? (
                subjects.map((subject) => (
                  <span
                    key={subject.id_sujet}
                    title={subject.description}
                    className="px-4 py-2 rounded-2xl border border-[#66BB6A]/40 bg-[#E0F2F1] text-sm text-[#004d40] font-medium"
                  >
                    {subject.nom}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  Aucune niche sélectionnée
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
                  type="button"
                  className="px-4 py-2 rounded-2xl border border-gray-200 text-sm text-gray-600 font-medium hover:border-[#1A3D3B] hover:text-[#1A3D3B] transition-colors bg-white shadow-sm"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4 px-1">
          <h2 className="text-xl font-bold text-[#1A3D3B]">Veilles du jour</h2>
          <span className="text-xs font-medium text-gray-400 mb-1">
            {recaps.length} résultat{recaps.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Chargement de vos veilles...
            </div>
          ) : recaps.length > 0 ? (
            recaps.map((recap, index) => (
              <NewsletterCard
                key={recap.id_recap ?? `recap-${index}`}
                id={recap.id_recap ? String(recap.id_recap) : undefined}
                category={recap.sujet?.nom ?? "Veille"}
                title={recap.titre || "Sans titre"}
                date={new Date(recap.created_at).toLocaleDateString("fr-FR")}
                bullets={parseResume(recap.resume)}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-10">
              {hasSubjects
                ? "Aucune veille pour vos niches pour le moment."
                : "Sélectionnez vos niches pour commencer."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
