"use client";

import React, { useState, useEffect } from "react";
import { BsCurrencyBitcoin, BsGraphUp } from "react-icons/bs";
import {
  FaRobot,
  FaLaptopCode,
  FaBalanceScale,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// --- Types ---
type Niche = string;

interface NicheItem {
  id: string;
  name: Niche;
  icon: React.ReactNode;
}

const getNicheIcon = (nicheName: string): React.ReactNode => {
  switch (nicheName.toLowerCase()) {
    case "crypto":
      return <BsCurrencyBitcoin className="text-3xl" />;
    case "intelligence artificielle":
    case "ia":
      return <FaRobot className="text-3xl" />;
    case "droit":
      return <FaBalanceScale className="text-3xl" />;
    case "marketing":
      return <BsGraphUp className="text-3xl" />;
    case "finance":
      return <FaMoneyBillWave className="text-3xl" />;
    case "tech":
    case "technologie":
      return <FaLaptopCode className="text-3xl" />;
    default:
      return <FaLaptopCode className="text-3xl text-gray-400" />;
  }
};

const NicheCard: React.FC<{
  niche: Niche;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ niche, icon, isSelected, onSelect }) => (
  <button
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
    <span className="text-sm font-semibold">{niche}</span>
    {isSelected && (
      <div className="absolute top-2 right-2 bg-[#66BB6A] rounded-full p-0.5 text-white">
        <HiCheck className="w-3 h-3" />
      </div>
    )}
  </button>
);

export default function SettingsNicheSelector() {
  const supabase = createClient();
  const router = useRouter();

  const [availableNiches, setAvailableNiches] = useState<NicheItem[]>([]);
  const [selectedNicheIds, setSelectedNicheIds] = useState<string[]>([]);
  const [initialSelectedNicheIds, setInitialSelectedNicheIds] = useState<
    string[]
  >([]); // Track initial state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch available niches
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("sujet")
          .select("id_sujet, nom");

        if (subjectsError) throw subjectsError;

        const items: NicheItem[] = subjectsData.map(
          (item: { id_sujet: any; nom: string }) => ({
            id: String(item.id_sujet), // Force string
            name: item.nom,
            icon: getNicheIcon(item.nom),
          })
        );
        setAvailableNiches(items);

        // 2. Fetch current user selection
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profil")
            .select("id_sujet")
            .eq("user_id", user.id);

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profileData) {
            // Force string conversion for robust comparison
            const ids = profileData.map((p: any) => String(p.id_sujet));
            setSelectedNicheIds(ids);
            setInitialSelectedNicheIds(ids);
          }
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des préférences.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleToggleNiche = (nicheId: string) => {
    const idStr = String(nicheId);
    setSelectedNicheIds((prev) => {
      if (prev.includes(idStr)) return prev.filter((id) => id !== idStr);
      return [...prev, idStr];
    });
    // Clear message when modifying
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: "error", text: "Utilisateur non connecté." });
        return;
      }

      if (selectedNicheIds.length === 0) {
        setMessage({
          type: "error",
          text: "Veuillez sélectionner au moins une niche.",
        });
        return;
      }

      // Calculate diffs
      const initialIds = new Set(initialSelectedNicheIds);
      const currentIds = new Set(selectedNicheIds);

      const idsToAdd = selectedNicheIds.filter((id) => !initialIds.has(id));
      const idsToRemove = initialSelectedNicheIds.filter(
        (id) => !currentIds.has(id)
      );

      if (idsToAdd.length === 0 && idsToRemove.length === 0) {
        setIsSaving(false);
        return; // No changes
      }

      // 1. Remove deselected
      if (idsToRemove.length > 0) {
        console.log("Deleting ids:", idsToRemove);
        const { error: deleteError } = await supabase
          .from("profil")
          .delete()
          .eq("user_id", user.id)
          .in("id_sujet", idsToRemove); // idsToRemove are strings, PostgREST handles conversion

        if (deleteError) throw deleteError;
      }

      // 2. Add new selected
      if (idsToAdd.length > 0) {
        // We need a grade for new entries.
        // We try to use the grade from an existing profile entry if available, or default.
        let currentGrade = "Débutant";
        const { data: existingProfile } = await supabase
          .from("profil")
          .select("grade")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle(); // Use maybeSingle to avoid error if no rows

        if (existingProfile && existingProfile.grade) {
          currentGrade = existingProfile.grade;
        }

        const inserts = idsToAdd.map((subjectId) => ({
          user_id: user.id,
          id_sujet: subjectId, // string, converted automatically
          grade: currentGrade,
        }));

        const { error: insertError } = await supabase
          .from("profil")
          .insert(inserts);

        if (insertError) throw insertError;
      }

      // Update initial state to reflect saved changes
      setInitialSelectedNicheIds(selectedNicheIds);

      setMessage({
        type: "success",
        text: "Préférences sauvegardées avec succès !",
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error saving:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la sauvegarde : " + error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {availableNiches.map((niche) => (
            <NicheCard
              key={niche.id}
              niche={niche.name}
              icon={niche.icon}
              isSelected={selectedNicheIds.includes(niche.id)}
              onSelect={() => handleToggleNiche(niche.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <span className="text-sm text-gray-500 font-medium">
            {selectedNicheIds.length} niche
            {selectedNicheIds.length > 1 ? "s" : ""} sélectionnée
            {selectedNicheIds.length > 1 ? "s" : ""}
          </span>
          <button
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
