"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Rss,
  ArrowRight,
  Calendar,
  FileText,
  CheckCircle2,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useDashboardTheme } from "./ThemeContext";

interface UserCountData {
  total: number;
  admins: number;
  members: number;
}

interface SubjectData {
  id_sujet: number;
  nom: string;
  description: string;
  recaps: Array<{
    id_recap: number;
    titre: string;
    created_at: string;
    resume?: any;
  }>;
}

export default function DashboardOverviewPage() {
  const { isDark } = useDashboardTheme();

  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserCountData>({ total: 0, admins: 0, members: 0 });
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      try {
        const [usersRes, subjectsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/sujets"),
        ]);

        const usersData = await usersRes.json();
        const subjectsData = await subjectsRes.json();

        if (usersData.success && usersData.users) {
          const total = usersData.users.length;
          const admins = usersData.users.filter((u: any) => u.isAdmin).length;
          setUserStats({
            total,
            admins,
            members: total - admins,
          });
        }

        if (subjectsData.success && subjectsData.subjects) {
          setSubjects(subjectsData.subjects);
        }
      } catch (err) {
        console.error("Erreur chargement aperçu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const totalRecaps = subjects.reduce((acc, s) => acc + s.recaps.length, 0);

  // Extraire les dernières newsletters publiées
  const recentRecaps = subjects
    .flatMap((s) =>
      s.recaps.map((r) => ({
        ...r,
        subjectName: s.nom,
        subjectId: s.id_sujet,
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-3 sm:gap-4 overflow-hidden h-full">
      {/* 1. Header Bar compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-none">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
              }`}
            >
              Tableau de bord
            </span>
            <span
              className={`text-[11px] flex items-center gap-1.5 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Système opérationnel
            </span>
          </div>

          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-[#1A3D3B]"
            }`}
          >
            Vue d'ensemble de la plateforme Niche
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-none">
          <Link
            href="/dashboard/topics-recaps"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-[#1A3D3B] hover:bg-[#142f2d] text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gérer les Niches & Récaps</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards Row (Compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-none">
        {/* Utilisateurs */}
        <Link
          href="/dashboard/users"
          className={`p-3.5 rounded-2xl border shadow-xs transition group flex items-center justify-between ${
            isDark
              ? "bg-[#14202E] border-[#223347] hover:border-emerald-500/50 hover:bg-[#182637]"
              : "bg-white border-gray-200 hover:border-[#1A3D3B]/40 hover:shadow-xs"
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Utilisateurs
            </span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {loading ? "..." : userStats.total}
              </span>
              <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                ({userStats.admins} admin{userStats.admins > 1 ? "s" : ""})
              </span>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl flex-none ${
              isDark ? "bg-[#1B293A] text-emerald-400" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
        </Link>

        {/* Niches */}
        <Link
          href="/dashboard/topics-recaps"
          className={`p-3.5 rounded-2xl border shadow-xs transition group flex items-center justify-between ${
            isDark
              ? "bg-[#14202E] border-[#223347] hover:border-emerald-500/50 hover:bg-[#182637]"
              : "bg-white border-gray-200 hover:border-[#1A3D3B]/40 hover:shadow-xs"
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Niches Thématiques
            </span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {loading ? "..." : subjects.length}
              </span>
              <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                sujets
              </span>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl flex-none ${
              isDark ? "bg-[#1B293A] text-amber-400" : "bg-amber-50 text-amber-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </div>
        </Link>

        {/* Newsletters */}
        <Link
          href="/dashboard/topics-recaps"
          className={`p-3.5 rounded-2xl border shadow-xs transition group flex items-center justify-between ${
            isDark
              ? "bg-[#14202E] border-[#223347] hover:border-emerald-500/50 hover:bg-[#182637]"
              : "bg-white border-gray-200 hover:border-[#1A3D3B]/40 hover:shadow-xs"
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Newsletters
            </span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {loading ? "..." : totalRecaps}
              </span>
              <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                récaps
              </span>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl flex-none ${
              isDark ? "bg-[#1B293A] text-sky-400" : "bg-sky-50 text-sky-700"
            }`}
          >
            <FileText className="w-4 h-4" />
          </div>
        </Link>

        {/* Pipeline Ingestion */}
        <Link
          href="/dashboard/ingestion"
          className={`p-3.5 rounded-2xl border shadow-xs transition group flex items-center justify-between ${
            isDark
              ? "bg-[#14202E] border-[#223347] hover:border-emerald-500/50 hover:bg-[#182637]"
              : "bg-white border-gray-200 hover:border-[#1A3D3B]/40 hover:shadow-xs"
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Pipeline RSS
            </span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                Prêt
              </span>
              <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                manuel
              </span>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl flex-none ${
              isDark ? "bg-[#1B293A] text-purple-400" : "bg-purple-50 text-purple-700"
            }`}
          >
            <Rss className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* 3. Main Split Section (Fits 100% in remaining height, no scroll) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Colonne Gauche : Dernières Publications de Veille (2 cols) */}
        <div
          className={`lg:col-span-2 rounded-2xl border p-4 shadow-sm flex flex-col justify-between h-full min-h-0 overflow-hidden transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between flex-none mb-2.5">
            <div>
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Dernières publications de veille
              </h3>
              <p
                className={`text-[11px] ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Les récents résumés stratégiques générés ou rédigés
              </p>
            </div>

            <Link
              href="/dashboard/topics-recaps"
              className={`text-xs font-semibold hover:underline inline-flex items-center gap-1 ${
                isDark ? "text-emerald-400" : "text-[#1A3D3B]"
              }`}
            >
              <span>Tout voir</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
            {recentRecaps.length === 0 ? (
              <div
                className={`py-8 text-center text-xs ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              >
                Aucune newsletter publiée pour le moment.
              </div>
            ) : (
              recentRecaps.map((r) => (
                <div
                  key={r.id_recap}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isDark
                      ? "bg-[#0E1722]/60 border-[#223347] hover:bg-[#101B27]"
                      : "bg-gray-50/60 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          isDark
                            ? "bg-[#1B293A] text-emerald-400 border border-[#263D54]"
                            : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
                        }`}
                      >
                        {r.subjectName}
                      </span>
                      <span
                        className={`text-[11px] flex items-center gap-1 ${
                          isDark ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {formatDate(r.created_at)}
                      </span>
                    </div>
                    <h4
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {r.titre}
                    </h4>
                  </div>

                  <Link
                    href={`/newsletter/${r.id_recap}`}
                    target="_blank"
                    className={`p-1.5 rounded-lg border transition flex-none ${
                      isDark
                        ? "border-[#223347] hover:bg-[#1B293A] text-slate-300 hover:text-white"
                        : "border-gray-200 hover:bg-gray-100 text-gray-600"
                    }`}
                    title="Consulter"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne Droite : Niches & Module Insights (1 col) */}
        <div className="flex flex-col h-full min-h-0 gap-3 justify-between overflow-hidden">
          {/* Box Niches */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition flex-1 min-h-0 flex flex-col justify-between overflow-hidden ${
              isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2 flex-none">
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Niches configurées
              </h3>
              <span
                className={`text-[11px] px-2 py-0.2 rounded-full font-mono font-semibold ${
                  isDark ? "bg-[#1B2B3D] text-emerald-400" : "bg-gray-100 text-gray-700"
                }`}
              >
                {subjects.length}
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
              {subjects.map((s) => (
                <div
                  key={s.id_sujet}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                    isDark ? "bg-[#0E1722]/50 border-[#223347]" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="min-w-0 flex-1 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                        isDark ? "bg-[#1B293A] text-slate-300" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      #{s.id_sujet}
                    </span>
                    <span
                      className={`font-semibold text-xs truncate ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {s.nom}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium flex-none ${
                      isDark ? "bg-[#101924] text-slate-400" : "bg-white text-gray-600 border"
                    }`}
                  >
                    {s.recaps.length} récap{s.recaps.length > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/topics-recaps"
              className={`mt-2 pt-2 border-t text-xs font-semibold flex items-center justify-between flex-none ${
                isDark
                  ? "border-[#223347] text-emerald-400 hover:text-emerald-300"
                  : "border-gray-100 text-[#1A3D3B] hover:text-[#142f2d]"
              }`}
            >
              <span>Gérer ou ajouter une niche</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Box Insights prévisionnel */}
          <div
            className={`p-3.5 rounded-2xl border transition flex-none ${
              isDark
                ? "bg-[#101924]/70 border-[#223347] text-slate-400"
                : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <h4 className="font-bold text-[11px] uppercase tracking-wider">
                Insights & Analytics (À venir)
              </h4>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Statistiques de lecture par niche, scores d'impact IA et fréquences de publication automatiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
