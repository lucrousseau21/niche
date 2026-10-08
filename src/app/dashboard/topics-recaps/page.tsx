"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Calendar,
  ChevronRight,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
  X,
  Plus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDashboardTheme } from "../ThemeContext";

interface SubjectRecap {
  id_recap: number;
  id_sujet: number;
  titre: string;
  resume: any;
  contenu: string;
  created_at: string;
}

interface AdminSubject {
  id_sujet: number;
  nom: string;
  description: string;
  recaps: SubjectRecap[];
}

export default function TopicsRecapsPage() {
  const { isDark } = useDashboardTheme();

  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [viewingRecap, setViewingRecap] = useState<SubjectRecap | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [userActionFeedback, setUserActionFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Modal de création de Niche
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const [newSubjectNom, setNewSubjectNom] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [createSubjectError, setCreateSubjectError] = useState<string | null>(null);

  // Modal de rédaction de Newsletter / Récap
  const [showCreateRecapModal, setShowCreateRecapModal] = useState(false);
  const [newRecapTitre, setNewRecapTitre] = useState("");
  const [newRecapResume, setNewRecapResume] = useState("");
  const [newRecapContenu, setNewRecapContenu] = useState("");
  const [creatingRecap, setCreatingRecap] = useState(false);
  const [createRecapError, setCreateRecapError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const res = await fetch("/api/admin/sujets");
      const data = await res.json();
      if (data.success && data.subjects) {
        setSubjects(data.subjects);
        if (data.subjects.length > 0 && selectedSubjectId === null) {
          setSelectedSubjectId(data.subjects[0].id_sujet);
        }
      }
    } catch (err) {
      console.error("Erreur réseau sujets:", err);
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectNom.trim()) {
      setCreateSubjectError("Le nom de la niche est obligatoire.");
      return;
    }
    if (!newSubjectDescription.trim()) {
      setCreateSubjectError("La description de la niche est obligatoire.");
      return;
    }

    setCreatingSubject(true);
    setCreateSubjectError(null);

    try {
      const res = await fetch("/api/admin/sujets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: newSubjectNom.trim(),
          description: newSubjectDescription.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.subject) {
        setSubjects((prev) => [...prev, data.subject]);
        setSelectedSubjectId(data.subject.id_sujet);
        setNewSubjectNom("");
        setNewSubjectDescription("");
        setShowCreateSubjectModal(false);
        setUserActionFeedback({
          message: `La niche "${data.subject.nom}" a été créée avec succès !`,
          type: "success",
        });
      } else {
        setCreateSubjectError(data.error || "Impossible de créer la niche.");
      }
    } catch (err: any) {
      setCreateSubjectError(err.message || "Erreur de connexion.");
    } finally {
      setCreatingSubject(false);
    }
  };

  const handleCreateRecap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      setCreateRecapError("Veuillez sélectionner une niche.");
      return;
    }
    if (!newRecapTitre.trim()) {
      setCreateRecapError("Le titre de la newsletter est obligatoire.");
      return;
    }
    if (!newRecapContenu.trim()) {
      setCreateRecapError("Le contenu Markdown est obligatoire.");
      return;
    }

    setCreatingRecap(true);
    setCreateRecapError(null);

    try {
      const res = await fetch("/api/admin/recaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_sujet: selectedSubjectId,
          titre: newRecapTitre.trim(),
          resume: newRecapResume.trim() || undefined,
          contenu: newRecapContenu.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.recap) {
        setSubjects((prev) =>
          prev.map((s) =>
            s.id_sujet === selectedSubjectId
              ? { ...s, recaps: [data.recap, ...s.recaps] }
              : s
          )
        );
        setNewRecapTitre("");
        setNewRecapResume("");
        setNewRecapContenu("");
        setShowCreateRecapModal(false);
        setUserActionFeedback({
          message: `La newsletter "${data.recap.titre}" a été publiée avec succès !`,
          type: "success",
        });
      } else {
        setCreateRecapError(data.error || "Impossible d'enregistrer la newsletter.");
      }
    } catch (err: any) {
      setCreateRecapError(err.message || "Erreur de connexion.");
    } finally {
      setCreatingRecap(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const q = subjectSearch.toLowerCase();
      return s.nom.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    });
  }, [subjects, subjectSearch]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id_sujet === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Jamais";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-4">
      {/* Feedback Message */}
      {userActionFeedback && (
        <div
          className={`p-4 rounded-xl flex-none flex items-center gap-3 text-sm font-medium shadow-sm transition ${
            userActionFeedback.type === "success"
              ? isDark
                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : isDark
              ? "bg-red-950/70 text-red-300 border border-red-800"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {userActionFeedback.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-500 flex-none" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-none" />
          )}
          <span>{userActionFeedback.message}</span>
        </div>
      )}

      {/* Header de l'onglet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-none">
        <div>
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-[#1A3D3B]"
            }`}
          >
            Niches & Récaps
          </h2>
          <p
            className={`text-sm mt-0.5 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Explorez les sujets configurés et consultez l'historique de toutes les newsletters associées.
          </p>
        </div>

        <button
          onClick={fetchSubjects}
          disabled={subjectsLoading}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold shadow-sm transition self-start sm:self-auto flex-none ${
            isDark
              ? "bg-[#14202E] border-[#223347] text-slate-300 hover:bg-[#1B293A]"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${subjectsLoading ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Layout Master-Detail à 2 colonnes (Panneau latéral gauche + Détail à droite) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Panneau Latéral Gauche : Liste des Sujets (scrollable) */}
        <div
          className={`w-full lg:w-80 xl:w-96 flex-none rounded-2xl border shadow-sm flex flex-col h-full min-h-0 overflow-hidden transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          {/* En-tête du panneau gauche */}
          <div
            className={`p-4 border-b space-y-3 flex-none ${
              isDark ? "border-[#223347] bg-[#101924]" : "border-gray-100 bg-gray-50/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Toutes les Niches
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                    isDark
                      ? "bg-[#1B2B3D] text-emerald-400"
                      : "bg-white text-[#1A3D3B] border border-gray-200"
                  }`}
                >
                  {filteredSubjects.length} / {subjects.length}
                </span>
                <button
                  onClick={() => {
                    setCreateSubjectError(null);
                    setShowCreateSubjectModal(true);
                  }}
                  className={`p-1 rounded-lg border transition flex items-center justify-center ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-xs"
                      : "bg-[#1A3D3B] hover:bg-[#142f2d] text-white border-[#1A3D3B] shadow-xs"
                  }`}
                  title="Créer une nouvelle niche"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Barre de recherche dans les sujets */}
            <div className="relative">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Filtrer les sujets..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 transition ${
                  isDark
                    ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30"
                    : "bg-white border border-gray-200 text-gray-900 focus:ring-[#1A3D3B]/20"
                }`}
              />
            </div>
          </div>

          {/* Liste déroulante des Sujets */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-1.5">
            {subjectsLoading ? (
              <div className="py-12 text-center text-xs text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500" />
                Chargement...
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 px-4">
                Aucun sujet ne correspond à votre recherche.
              </div>
            ) : (
              filteredSubjects.map((s) => {
                const isSelected = selectedSubjectId === s.id_sujet;
                return (
                  <button
                    key={s.id_sujet}
                    onClick={() => setSelectedSubjectId(s.id_sujet)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start justify-between gap-2 group ${
                      isSelected
                        ? isDark
                          ? "bg-[#1E2E40] border-emerald-500/80 text-white shadow-xs"
                          : "bg-[#1A3D3B]/5 border-[#1A3D3B] text-[#1A3D3B] shadow-xs"
                        : isDark
                        ? "bg-[#0E1722]/50 border-transparent hover:bg-[#1A2838] hover:border-[#223347] text-slate-300"
                        : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? isDark
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-[#1A3D3B] text-white"
                              : isDark
                              ? "bg-[#1B293A] text-slate-400"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          #{s.id_sujet}
                        </span>
                        <span className="font-semibold text-xs truncate block">
                          {s.nom}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate ${
                          isDark ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        {s.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-none mt-0.5">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          isSelected
                            ? isDark
                              ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                              : "bg-[#1A3D3B] text-white font-semibold"
                            : isDark
                            ? "bg-[#101924] text-slate-400"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.recaps.length}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition ${
                          isSelected
                            ? "translate-x-0.5 opacity-100"
                            : "opacity-30 group-hover:opacity-70"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Panneau Droit : Détails & Récaps du Sujet Sélectionné */}
        <div
          className={`flex-1 min-w-0 h-full min-h-0 rounded-2xl border shadow-sm flex flex-col overflow-hidden transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          {currentSubject ? (
            <>
              {/* En-tête du sujet sélectionné */}
              <div
                className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-none ${
                  isDark ? "border-[#223347] bg-[#101924]/80" : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
                      }`}
                    >
                      Niche #{currentSubject.id_sujet}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isDark
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/80"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}
                    >
                      {currentSubject.recaps.length} newsletter{currentSubject.recaps.length > 1 ? "s" : ""} disponible{currentSubject.recaps.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentSubject.nom}
                  </h3>
                  <p
                    className={`text-xs max-w-2xl ${
                      isDark ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    {currentSubject.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-none">
                  <button
                    onClick={() => {
                      setCreateRecapError(null);
                      if (!newRecapContenu) {
                        setNewRecapContenu(
                          "## Contexte\nPrésentation de l'évolution technologique ou de l'actualité clé.\n\n## Points clés\n- **Point 1 :** Analyse détaillée et impacts.\n- **Point 2 :** Retours d'expérience et bonnes pratiques.\n\n## À retenir\nSynthèse opérationnelle pour les équipes techniques."
                        );
                      }
                      setShowCreateRecapModal(true);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition ${
                      isDark
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                        : "bg-[#1A3D3B] hover:bg-[#142f2d] text-white shadow-xs"
                    }`}
                    title="Rédiger une nouvelle newsletter manuellement"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvelle newsletter</span>
                  </button>

                  <button
                    disabled
                    title="Génération temporairement désactivée (configuration IA requise)"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-not-allowed opacity-50 border flex-none ${
                      isDark
                        ? "bg-slate-800 text-slate-400 border-slate-700"
                        : "bg-gray-200 text-gray-500 border-gray-300"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Générer un nouveau récap
                  </button>
                </div>
              </div>

              {/* Liste scrollable des récaps */}
              <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                {currentSubject.recaps.length === 0 ? (
                  <div
                    className={`py-20 text-center ${
                      isDark ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    <FileText
                      className={`w-10 h-10 mx-auto mb-3 ${
                        isDark ? "text-slate-600" : "text-gray-300"
                      }`}
                    />
                    <p className="font-medium text-sm">Aucun récap pour ce sujet</p>
                    <p className="text-xs mt-1">
                      Les futures newsletters publiées apparaîtront automatiquement ici.
                    </p>
                  </div>
                ) : (
                  currentSubject.recaps.map((recap) => (
                    <div
                      key={recap.id_recap}
                      className={`p-5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDark
                          ? "bg-[#0E1722] border-[#223347] hover:bg-[#111C28]"
                          : "bg-gray-50/50 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div
                          className={`flex items-center gap-2 text-xs ${
                            isDark ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          <Calendar
                            className={`w-3.5 h-3.5 ${
                              isDark ? "text-slate-500" : "text-gray-400"
                            }`}
                          />
                          <span>{formatDate(recap.created_at)}</span>
                          <span className={isDark ? "text-slate-600" : "text-gray-300"}>•</span>
                          <span
                            className={`font-mono ${
                              isDark ? "text-slate-500" : "text-gray-400"
                            }`}
                          >
                            ID #{recap.id_recap}
                          </span>
                        </div>
                        <h4
                          className={`font-bold text-base ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {recap.titre}
                        </h4>

                        {/* Aperçu du résumé */}
                        {recap.resume && (
                          <div
                            className={`text-xs line-clamp-2 ${
                              isDark ? "text-slate-300" : "text-gray-600"
                            }`}
                          >
                            {typeof recap.resume === "object"
                              ? Object.values(recap.resume).join(" • ")
                              : String(recap.resume)}
                          </div>
                        )}
                      </div>

                      {/* Actions sur le récap */}
                      <div className="flex items-center gap-2 flex-none self-end md:self-auto">
                        <button
                          onClick={() => setViewingRecap(recap)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                            isDark
                              ? "border-[#2E4157] bg-[#1A2838] text-slate-200 hover:bg-[#22354A] hover:text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Lire le récap
                        </button>
                        <Link
                          href={`/newsletter/${recap.id_recap}`}
                          target="_blank"
                          className={`p-2 rounded-xl border transition ${
                            isDark
                              ? "border-[#2E4157] bg-[#1A2838] text-slate-400 hover:text-white hover:bg-[#22354A]"
                              : "border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                          title="Ouvrir dans un nouvel onglet"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
              Sélectionnez un sujet à gauche pour afficher ses récaps.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL / POPUP DE LECTURE DU RÉCAP COMPLET                    */}
      {/* ============================================================ */}
      {viewingRecap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-3xl rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border ${
              isDark ? "bg-[#14202E] border-[#223347] text-slate-100" : "bg-white border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex items-start justify-between gap-4 ${
                isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div>
                <div
                  className={`text-xs font-mono font-semibold mb-1 ${
                    isDark ? "text-emerald-400" : "text-[#1A3D3B]"
                  }`}
                >
                  ID #{viewingRecap.id_recap} • {formatDate(viewingRecap.created_at)}
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {viewingRecap.titre}
                </h3>
              </div>
              <button
                onClick={() => setViewingRecap(null)}
                className={`p-1.5 rounded-lg transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-[#1B293A]"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Markdown Content) */}
            <div
              className={`p-6 overflow-y-auto space-y-4 max-w-none text-sm leading-relaxed prose ${
                isDark ? "prose-invert text-slate-200" : "prose-slate"
              }`}
            >
              <ReactMarkdown>{viewingRecap.contenu}</ReactMarkdown>
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex items-center justify-between ${
                isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50 border-gray-100"
              }`}
            >
              <Link
                href={`/newsletter/${viewingRecap.id_recap}`}
                target="_blank"
                className={`text-xs font-semibold hover:underline inline-flex items-center gap-1 ${
                  isDark ? "text-emerald-400" : "text-[#1A3D3B]"
                }`}
              >
                Ouvrir la page publique <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setViewingRecap(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isDark
                    ? "bg-[#22354A] hover:bg-[#2C435D] text-slate-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL / POPUP DE CRÉATION D'UNE NOUVELLE NICHE               */}
      {/* ============================================================ */}
      {showCreateSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border ${
              isDark
                ? "bg-[#14202E] border-[#223347] text-slate-100"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex items-start justify-between gap-4 ${
                isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
                    }`}
                  >
                    Nouvelle thématique
                  </span>
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Créer une nouvelle niche
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Ajoutez un nouveau sujet de veille technologique au catalogue.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!creatingSubject) {
                    setShowCreateSubjectModal(false);
                    setCreateSubjectError(null);
                  }
                }}
                disabled={creatingSubject}
                className={`p-1.5 rounded-lg transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-[#1B293A]"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateSubject}>
              <div className="p-6 space-y-4">
                {createSubjectError && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                      isDark
                        ? "bg-red-950/60 text-red-300 border-red-800/80"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 flex-none" />
                    <span>{createSubjectError}</span>
                  </div>
                )}

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase mb-1.5 ${
                      isDark ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Nom de la niche <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: DevOps & Cloud Native"
                    value={newSubjectNom}
                    onChange={(e) => setNewSubjectNom(e.target.value)}
                    disabled={creatingSubject}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase mb-1.5 ${
                      isDark ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="ex: Kubernetes, CI/CD, observabilité, cloud providers et infrastructure as code."
                    value={newSubjectDescription}
                    onChange={(e) => setNewSubjectDescription(e.target.value)}
                    disabled={creatingSubject}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition resize-none ${
                      isDark
                        ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                    }`}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`p-4 border-t flex items-center justify-end gap-2.5 ${
                  isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50 border-gray-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateSubjectModal(false);
                    setCreateSubjectError(null);
                  }}
                  disabled={creatingSubject}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isDark
                      ? "bg-[#1B293A] hover:bg-[#24374D] text-slate-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingSubject}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-[#1A3D3B] hover:bg-[#142f2d] text-white"
                  }`}
                >
                  {creatingSubject ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Créer la niche
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL / POPUP DE CRÉATION D'UNE NOUVELLE NEWSLETTER / RÉCAP  */}
      {/* ============================================================ */}
      {showCreateRecapModal && currentSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border ${
              isDark
                ? "bg-[#14202E] border-[#223347] text-slate-100"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex items-start justify-between gap-4 flex-none ${
                isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
                    }`}
                  >
                    Niche #{currentSubject.id_sujet} : {currentSubject.nom}
                  </span>
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Rédiger une nouvelle newsletter
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Créez manuellement un récap / newsletter pour cette niche.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!creatingRecap) {
                    setShowCreateRecapModal(false);
                    setCreateRecapError(null);
                  }
                }}
                disabled={creatingRecap}
                className={`p-1.5 rounded-lg transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-[#1B293A]"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateRecap} className="flex-1 min-h-0 flex flex-col">
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {createRecapError && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                      isDark
                        ? "bg-red-950/60 text-red-300 border-red-800/80"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 flex-none" />
                    <span>{createRecapError}</span>
                  </div>
                )}

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase mb-1.5 ${
                      isDark ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Titre de la newsletter <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Next.js 15 et l'écosystème React en 2026"
                    value={newRecapTitre}
                    onChange={(e) => setNewRecapTitre(e.target.value)}
                    disabled={creatingRecap}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold uppercase mb-1.5 ${
                      isDark ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Points clés / Résumé court (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: PPR stabilisé • Turbopack par défaut • Cache refondu"
                    value={newRecapResume}
                    onChange={(e) => setNewRecapResume(e.target.value)}
                    disabled={creatingRecap}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                    }`}
                  />
                  <p
                    className={`text-[11px] mt-1 ${
                      isDark ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    Sera affiché en sous-titre sur la carte du récap.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`block text-xs font-semibold uppercase ${
                        isDark ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      Contenu de la newsletter (Markdown) <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-[11px] ${
                        isDark ? "text-slate-500" : "text-gray-400"
                      }`}
                    >
                      Supporte Markdown (#, ##, -, **)
                    </span>
                  </div>
                  <textarea
                    required
                    rows={10}
                    placeholder="## Contexte&#10;...&#10;&#10;## Points clés&#10;- **Point 1 :** ...&#10;&#10;## À retenir&#10;..."
                    value={newRecapContenu}
                    onChange={(e) => setNewRecapContenu(e.target.value)}
                    disabled={creatingRecap}
                    className={`w-full font-mono text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition resize-y leading-relaxed ${
                      isDark
                        ? "bg-[#0B131E] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
                    }`}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`p-4 border-t flex items-center justify-end gap-2.5 flex-none ${
                  isDark ? "bg-[#101924] border-[#223347]" : "bg-gray-50 border-gray-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateRecapModal(false);
                    setCreateRecapError(null);
                  }}
                  disabled={creatingRecap}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isDark
                      ? "bg-[#1B293A] hover:bg-[#24374D] text-slate-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingRecap}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-[#1A3D3B] hover:bg-[#142f2d] text-white"
                  }`}
                >
                  {creatingRecap ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Publier la newsletter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
