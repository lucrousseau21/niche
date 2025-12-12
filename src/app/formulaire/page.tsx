// app/formulaire/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsCurrencyBitcoin, BsGraphUp } from "react-icons/bs";
import {
  FaRobot,
  FaLaptopCode,
  FaBalanceScale,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiCheck, HiSparkles } from "react-icons/hi";
import Header from "@/components/Header";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const supabase = createBrowserClient();

// --- Définitions des Types ---
type Niche = string;
type Level = "Débutant" | "Intermédiaire" | "Expert";

const TOTAL_STEPS = 2;

// --- Données pour les Niveaux ---
const LEVEL_DATA: { name: Level; description: string }[] = [
  { name: "Débutant", description: "Concepts de base et vulgarisation" },
  { name: "Intermédiaire", description: "Analyses approfondies et tendances" },
  { name: "Expert", description: "Insights techniques et recherches" },
];

// =================================================================
// 1. Composant Sélecteur de Niches (Étape 1)
// =================================================================

interface NicheItem {
  id: string;
  name: Niche;
  icon: React.ReactNode;
}

interface NicheSelectorProps {
  selectedNiches: Niche[];
  onSelectNiche: (niche: Niche) => void;
  onNext: () => void;
  nicheData: NicheItem[];
  isLoading: boolean;
  error: string | null;
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
      transition-all duration-200 w-full min-h-[100px]
      ${
        isSelected
          ? "bg-[#E0F2F1] border-2 border-[#66BB6A] text-[#004d40] shadow-md"
          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
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

const NicheSelector: React.FC<NicheSelectorProps> = ({
  selectedNiches,
  onSelectNiche,
  onNext,
  nicheData,
  isLoading,
  error,
}) => {
  const isDisabled = selectedNiches.length === 0 || isLoading || !!error;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-8 pt-0 pb-0 text-center">
        <h2 className="text-3xl font-bold text-white mb-1">
          Personnalisez vos newsletters
        </h2>
        <p className="text-gray-200 mb-6">Sélectionner vos préférences</p>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl mx-4 md:mx-0">
        <h3 className="text-xl font-semibold text-[#004d40] mb-4">
          Sélectionnez vos niches
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Choisissez les domaines qui vous intéressent
        </p>

        {isLoading && (
          <div className="text-center text-gray-500">
            Chargement des niches...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">
            Erreur de chargement: {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {nicheData.map((niche) => (
              <NicheCard
                key={niche.id}
                niche={niche.name}
                icon={niche.icon}
                isSelected={selectedNiches.includes(niche.id)}
                onSelect={() => onSelectNiche(niche.id)}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          {selectedNiches.length} niche{selectedNiches.length > 1 ? "s" : ""}{" "}
          sélectionnée{selectedNiches.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="p-4 pt-6 mt-auto">
        <button
          onClick={onNext}
          disabled={isDisabled}
          className={`
            w-full py-3 rounded-xl text-lg font-semibold transition-colors duration-200
            ${
              isDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#66BB6A] text-white hover:bg-[#4CAF50] shadow-lg"
            }
          `}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

// =================================================================
// 2. Composant Sélecteur de Niveau (Étape 2)
// =================================================================

interface LevelSelectorProps {
  selectedLevel: Level | null;
  onSelectLevel: (level: Level) => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const LevelCard: React.FC<{
  level: Level;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ level, description, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`
        p-4 rounded-xl text-left w-full transition-all duration-200 border
        ${
          isSelected
            ? "bg-[#FBE9E7] border-[#D84315] text-[#3E2723] shadow-md"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
        }
      `}
  >
    <div>
      <h3 className="text-lg font-semibold text-[#004d40]">{level}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </button>
);

const AIInfoCard = () => (
  <div className="p-5 rounded-xl text-left w-full bg-[#113838] text-white flex flex-col gap-2 shadow-lg mt-2">
    <div className="flex items-center gap-2 mb-1">
      <HiSparkles className="text-[#66BB6A] text-xl" />
      <h3 className="text-lg font-semibold">IA Personnalisée</h3>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed">
      Notre IA s&apos;adapte automatiquement à votre niveau et affine le contenu
      au fil de vos lectures.
    </p>
  </div>
);

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  onNext,
  isSubmitting,
}) => {
  const isDisabled = !selectedLevel || isSubmitting;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-8 pt-0 pb-0 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Personnalisez votre niveau
        </h2>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl mx-4 md:mx-0 flex-grow">
        <div className="flex flex-col space-y-3">
          {LEVEL_DATA.map((level) => (
            <LevelCard
              key={level.name}
              level={level.name}
              description={level.description}
              isSelected={selectedLevel === level.name}
              onSelect={() => onSelectLevel(level.name)}
            />
          ))}
          <AIInfoCard />
        </div>
      </div>

      <div className="p-4 pt-6 mt-auto">
        <button
          onClick={onNext}
          disabled={isDisabled}
          className={`
            w-full py-3 rounded-xl text-lg font-semibold transition-colors duration-200
            ${
              isDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#66BB6A] text-white hover:bg-[#4CAF50] shadow-lg"
            }
          `}
        >
          {isSubmitting ? "Création en cours..." : "Créer mon compte"}
        </button>
      </div>
    </div>
  );
};

// =================================================================
// 3. Composant Principal (page.tsx)
// =================================================================

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedNicheIds, setSelectedNicheIds] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const [availableNiches, setAvailableNiches] = useState<NicheItem[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState(true);
  const [nicheError, setNicheError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNiches = async () => {
      setIsLoadingNiches(true);
      setNicheError(null);

      const { data, error } = await supabase
        .from("sujet")
        .select("id_sujet, nom");

      if (error) {
        setNicheError(error.message);
        setIsLoadingNiches(false);
        // Fallback removed or adjusted - identifiers are needed.
        // Assuming database is populated or we can't really proceed with saving IDs.
        return;
      }

      // Filter out duplicate names if any (though IDs should be unique)
      // and map to NicheItem
      const items: NicheItem[] = data.map(
        (item: { id_sujet: any; nom: string }) => ({
          id: item.id_sujet,
          name: item.nom,
          icon: getNicheIcon(item.nom),
        })
      );

      setAvailableNiches(items);
      setIsLoadingNiches(false);

      // Auto-select first if needed, though simpler to let user choose
      if (items.length > 0 && selectedNicheIds.length === 0) {
        // setSelectedNicheIds([items[0].id]);
      }
    };

    fetchNiches();
  }, []);

  const handleNicheSelection = (nicheId: string) => {
    setSelectedNicheIds((prev) => {
      if (prev.includes(nicheId)) return prev.filter((id) => id !== nicheId);
      return [...prev, nicheId];
    });
  };

  const handleLevelSelection = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleNextStep = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);

      try {
        // 1. Get current session
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !session) {
          alert(
            "Erreur : Utilisateur non connecté. Veuillez vous reconnecter."
          );
          router.push("/login");
          return;
        }

        const user = session.user;

        // 2. Prepare inserts for 'profil' table
        // We need one entry per selected subject
        if (selectedNicheIds.length === 0) {
          alert("Veuillez sélectionner au moins un sujet.");
          setIsSubmitting(false);
          return;
        }

        // Clean up previous entries to avoid collisions/duplicates on retry
        // and ensure we save the latest selection.
        const { error: deleteError } = await supabase
          .from("profil")
          .delete()
          .eq("user_id", user.id);

        if (deleteError) {
          console.error("Error clearing old profile:", deleteError);
          // We continue, maybe it failed because no rows existed, or permissions.
          // Ideally we should stop, but let's try to insert.
        }

        const inserts = selectedNicheIds.map((subjectId) => ({
          user_id: user.id,
          id_sujet: subjectId,
          grade: selectedLevel,
        }));

        const { error: profileError } = await supabase
          .from("profil")
          .insert(inserts);

        if (profileError) {
          console.error("Profile save error:", profileError);
          alert(
            `Erreur lors de la sauvegarde du profil : ${profileError.message}\n(Vérifiez que votre table 'profil' autorise plusieurs lignes par utilisateur)`
          );
        } else {
          router.push("/dashboard");
        }
      } catch (err: any) {
        alert(`Erreur inattendue : ${err.message || err}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#004d40] text-white flex flex-col items-center relative">
      <Header />

      <div className="absolute inset-0 border-4 border-dashed border-[#003333] pointer-events-none"></div>

      <div className="w-full max-w-sm md:max-w-xl flex flex-col z-10 flex-grow pt-4 pb-8 mt-20">
        <div className="flex-grow flex flex-col">
          {step === 1 && (
            <NicheSelector
              selectedNiches={selectedNicheIds}
              onSelectNiche={handleNicheSelection}
              onNext={handleNextStep}
              nicheData={availableNiches}
              isLoading={isLoadingNiches}
              error={nicheError}
            />
          )}

          {step === 2 && (
            <LevelSelector
              selectedLevel={selectedLevel}
              onSelectLevel={handleLevelSelection}
              onNext={handleNextStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
