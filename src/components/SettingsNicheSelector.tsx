"use client";

import React, { useState, useEffect } from "react";
import { HiCheck } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getNicheIcon } from "@/utils/nicheIcons";
import { filterMvpSubjectIds } from "@/lib/mvp-subjects";
import { fetchMvpSubjectsCatalog } from "@/lib/profil-preferences";

interface NicheItem {
  id: number;
  name: string;
  icon: React.ReactNode;
}

function isNicheSelected(selectedIds: number[], nicheId: number): boolean {
  return selectedIds.some((id) => Number(id) === Number(nicheId));
}

const NicheCard: React.FC<{
  niche: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ niche, icon, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`
      relative p-4 rounded-xl flex flex-col items-center justify-center space-y-2 text-center 
      transition-all duration-200 w-full min-h-[100px] border
      ${
        isSelected
          ? "bg-[#E0F2F1] border-[#66BB6A] text-[#004d40] shadow-md ring-1 ring-[#66BB6A]"
          : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }
    `}
  >
    <div className="mb-1">{icon}</div>
    <span className="text-sm font-semibold leading-snug">{niche}</span>
    {isSelected && (
      <div className="absolute top-2 right-2 bg-[#66BB6A] rounded-full p-0.5 text-white">
        <HiCheck className="w-3 h-3" />
      </div>
    )}
  </button>
);

export default function SettingsNicheSelector() {
  const router = useRouter();

  const [availableNiches, setAvailableNiches] = useState<NicheItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const catalog = await fetchMvpSubjectsCatalog(supabase);
        if (cancelled) return;

        setAvailableNiches(
          catalog.map((s) => ({
            id: s.id_sujet,
            name: s.nom,
            icon: getNicheIcon(s.nom),
          }))
        );

        if (user) {
          const res = await fetch("/api/profile/preferences", {
            cache: "no-store",
          });
          const payload = await res.json();
          if (!cancelled) {
            if (res.ok) {
              setSelectedIds(
                filterMvpSubjectIds(payload.subjectIds ?? [])
              );
            } else {
              setSelectedIds([]);
            }
          }
        } else if (!cancelled) {
          setSelectedIds([]);
        }
      } catch (error) {
        console.error("Error loading niches:", error);
        if (!cancelled) {
          setMessage({
            type: "error",
            text: "Erreur lors du chargement des préférences.",
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const normalized = filterMvpSubjectIds(prev);
      return normalized.includes(id)
        ? normalized.filter((x) => x !== id)
        : [...normalized, id];
    });
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const idsToSave = filterMvpSubjectIds(selectedIds);

    try {
      if (idsToSave.length === 0) {
        setMessage({
          type: "error",
          text: "Veuillez sélectionner au moins une niche.",
        });
        return;
      }

      const res = await fetch("/api/profile/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectIds: idsToSave }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Échec de la sauvegarde");
      }

      const savedIds = filterMvpSubjectIds(
        payload.subjectIds ?? idsToSave
      );
      setSelectedIds(savedIds);
      setMessage({
        type: "success",
        text: "Préférences sauvegardées avec succès !",
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({
        type: "error",
        text:
          "Erreur lors de la sauvegarde : " +
          (error instanceof Error ? error.message : "inconnue"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = filterMvpSubjectIds(selectedIds).length;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Chargement de vos niches...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1A3D3B]">Vos Niches</h2>
          <p className="text-gray-500 text-sm mt-1">
            Sélectionnez les domaines qui vous intéressent pour personnaliser
            votre veille.
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {availableNiches.map((niche) => (
            <NicheCard
              key={niche.id}
              niche={niche.name}
              icon={niche.icon}
              isSelected={isNicheSelected(selectedIds, niche.id)}
              onSelect={() => handleToggle(niche.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <span className="text-sm text-gray-500 font-medium">
            {selectedCount} niche{selectedCount > 1 ? "s" : ""} sélectionnée
            {selectedCount > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`
              px-6 py-2.5 rounded-xl font-semibold text-white transition-all
              ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#66BB6A] hover:bg-[#5da860] shadow-sm hover:shadow active:scale-95"
              }
            `}
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
