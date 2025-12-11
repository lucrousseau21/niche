// app/formulaire/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { BsCurrencyBitcoin, BsGraphUp } from 'react-icons/bs';
import { FaRobot, FaLaptopCode, FaBalanceScale, FaMoneyBillWave } from 'react-icons/fa';
import { HiCheck, HiSparkles } from 'react-icons/hi';
import Header from '@/components/Header';
import { createClient as createBrowserClient } from '@/lib/supabase/client'; 

const supabase = createBrowserClient();

// --- Définitions des Types ---
type Niche = string; 
type Level = 'Débutant' | 'Intermédiaire' | 'Expert';

const TOTAL_STEPS = 2;

// --- Données pour les Niveaux ---
const LEVEL_DATA: { name: Level; description: string }[] = [
  { name: 'Débutant', description: 'Concepts de base et vulgarisation' },
  { name: 'Intermédiaire', description: 'Analyses approfondies et tendances' },
  { name: 'Expert', description: 'Insights techniques et recherches' },
];

// =================================================================
// 1. Composant Sélecteur de Niches (Étape 1)
// =================================================================

interface NicheItem {
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
        case 'crypto': return <BsCurrencyBitcoin className="text-3xl" />;
        case 'intelligence artificielle':
        case 'ia': return <FaRobot className="text-3xl" />;
        case 'droit': return <FaBalanceScale className="text-3xl" />;
        case 'marketing': return <BsGraphUp className="text-3xl" />;
        case 'finance': return <FaMoneyBillWave className="text-3xl" />;
        case 'tech': 
        case 'technologie': return <FaLaptopCode className="text-3xl" />;
        default: return <FaLaptopCode className="text-3xl text-gray-400" />; 
    }
};

const NicheCard: React.FC<{ niche: Niche; icon: React.ReactNode; isSelected: boolean; onSelect: () => void }> = ({
  niche,
  icon,
  isSelected,
  onSelect,
}) => (
  <button
    onClick={onSelect}
    className={`
      relative p-4 rounded-xl flex flex-col items-center justify-center space-y-2 text-center 
      transition-all duration-200 w-full min-h-[100px]
      ${
        isSelected
          ? 'bg-[#E0F2F1] border-2 border-[#66BB6A] text-[#004d40] shadow-md'
          : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
      }
    `}
  >
    <div className='mb-1'>{icon}</div>
    <span className="text-sm font-semibold">{niche}</span>
    {isSelected && (
      <div className="absolute top-2 right-2 bg-[#66BB6A] rounded-full p-0.5 text-white">
        <HiCheck className="w-3 h-3" />
      </div>
    )}
  </button>
);

const NicheSelector: React.FC<NicheSelectorProps> = ({ selectedNiches, onSelectNiche, onNext, nicheData, isLoading, error }) => {
  const isDisabled = selectedNiches.length === 0 || isLoading || !!error;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-8 pt-0 pb-0 text-center">
        <h2 className="text-3xl font-bold text-white mb-1">Personnalisez vos newsletters</h2>
        <p className="text-gray-200 mb-6">Sélectionner vos préférences</p>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl mx-4 md:mx-0">
        <h3 className="text-xl font-semibold text-[#004d40] mb-4">Sélectionnez vos niches</h3>
        <p className="text-sm text-gray-500 mb-6">Choisissez les domaines qui vous intéressent</p>
        
        {isLoading && <div className="text-center text-gray-500">Chargement des niches...</div>}
        {error && <div className="text-center text-red-500">Erreur de chargement: {error}</div>}

        {!isLoading && !error && (
            <div className="grid grid-cols-2 gap-4">
            {nicheData.map((niche) => (
                <NicheCard
                key={niche.name}
                niche={niche.name}
                icon={niche.icon}
                isSelected={selectedNiches.includes(niche.name)}
                onSelect={() => onSelectNiche(niche.name)}
                />
            ))}
            </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          {selectedNiches.length} niche{selectedNiches.length > 1 ? 's' : ''} sélectionnée{selectedNiches.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="p-4 pt-6 mt-auto"> 
        <button
          onClick={onNext}
          disabled={isDisabled}
          className={`
            w-full py-3 rounded-xl text-lg font-semibold transition-colors duration-200
            ${isDisabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-[#66BB6A] text-white hover:bg-[#4CAF50] shadow-lg'}
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

const LevelCard: React.FC<{ level: Level; description: string; isSelected: boolean; onSelect: () => void }> = ({
    level,
    description,
    isSelected,
    onSelect,
  }) => (
    <button
      onClick={onSelect}
      className={`
        p-4 rounded-xl text-left w-full transition-all duration-200 border
        ${
          isSelected
            ? 'bg-[#FBE9E7] border-[#D84315] text-[#3E2723] shadow-md'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
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
            Notre IA s&apos;adapte automatiquement à votre niveau et affine le contenu au fil de vos lectures.
        </p>
    </div>
);

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onSelectLevel, onNext, isSubmitting }) => {
  const isDisabled = !selectedLevel || isSubmitting;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-8 pt-0 pb-0 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Personnalisez votre niveau</h2>
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
            ${isDisabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-[#66BB6A] text-white hover:bg-[#4CAF50] shadow-lg'}
          `}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
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
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>(['Intelligence Artificielle']);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null); 
  
  const [availableNiches, setAvailableNiches] = useState<NicheItem[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState(true);
  const [nicheError, setNicheError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNiches = async () => {
      setIsLoadingNiches(true);
      setNicheError(null);
      
      const { data, error } = await supabase.from('sujet').select('nom');

      if (error) {
        setNicheError(error.message);
        setIsLoadingNiches(false);
        setAvailableNiches([
            { name: 'Crypto', icon: getNicheIcon('Crypto') },
            { name: 'Intelligence Artificielle', icon: getNicheIcon('Intelligence Artificielle') },
            { name: 'Tech', icon: getNicheIcon('Tech') },
        ]);
        return;
      }
      
      const uniqueNicheNames: string[] = Array.from(new Set(data.map((item: { nom: string }) => item.nom))).filter(Boolean);
      const formattedNiches: NicheItem[] = uniqueNicheNames.map(name => ({
        name,
        icon: getNicheIcon(name),
      }));

      if (selectedNiches.length === 0 && formattedNiches.length > 0) {
          setSelectedNiches([formattedNiches[0].name]);
      }
      setAvailableNiches(formattedNiches);
      setIsLoadingNiches(false);
    };

    fetchNiches();
  }, []); 

  const handleNicheSelection = (niche: Niche) => {
    setSelectedNiches(prev => {
      if (prev.includes(niche)) return prev.filter(n => n !== niche);
      return [...prev, niche];
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
        const storedData = sessionStorage.getItem('signupData');
        
        if (!storedData) {
            alert("Erreur : Les informations d'inscription sont manquantes. Veuillez recommencer.");
            router.push('/signup'); 
            return;
        }

        const { email, password, firstName, lastName } = JSON.parse(storedData);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: `${firstName} ${lastName}`,
                first_name: firstName,
                last_name: lastName,
              },
            },
        });

        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profil')
                .insert([
                    {
                        id: authData.user.id,
                        sujets: selectedNiches,
                        grade: selectedLevel,
                    }
                ]);

            if (profileError) {
                alert(`Compte créé mais erreur lors de la sauvegarde du profil : ${profileError.message}`);
            } else {
                sessionStorage.removeItem('signupData');
                alert("Compte créé avec succès ! Bienvenue.");
                router.push('/dashboard'); 
            }
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

      {/* AJOUT DE mt-20 ICI */}
      <div className="w-full max-w-sm md:max-w-xl flex flex-col z-10 flex-grow pt-4 pb-8 mt-10">
        <div className="flex-grow flex flex-col">
            {step === 1 && (
                <NicheSelector 
                    selectedNiches={selectedNiches} 
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
