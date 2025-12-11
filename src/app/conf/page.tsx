import React from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function PolitiqueConfidentialite() {
  return (
    <main className="min-h-screen mx-auto max-w-4xl px-6 py-16 bg-[#FFFAF0]">
      <h1 className="text-4xl font-bold text-[#2D3748] font-montserrat">
        Politique de Confidentialité
      </h1>
      <p className="text-sm text-[#2D3748] opacity-70 mt-1">
        Dernière mise à jour : 10 décembre 2025
      </p>

      {/* Bloc : Collecte */}
      <section className="mt-10 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          1. Données collectées
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Nous collectons uniquement les données nécessaires pour assurer le bon
          fonctionnement du site : informations de compte, navigation, interactions.
        </p>
      </section>

      {/* Bloc : Utilisation */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          2. Utilisation des données
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Vos données servent à personnaliser votre expérience, améliorer nos services et
          garantir la sécurité du site.
        </p>
      </section>

      {/* Bloc : Partage */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          3. Partage des données
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Nous ne vendons ni ne partageons vos données personnelles avec des tiers, sauf
          obligations légales ou prestataires techniques indispensables.
        </p>
      </section>

      {/* Bloc : Sécurité */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          4. Sécurité des données
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Nous appliquons des mesures de sécurité strictes pour protéger vos données contre
          tout accès non autorisé.
        </p>
      </section>

      {/* Bloc : Vos droits */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          5. Vos droits
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Vous pouvez demander l’accès, la modification ou la suppression de vos données
          personnelles à tout moment.
        </p>
      </section>
    {/* Boutons de navigation */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primary px-6 py-3 rounded-md text-white bg-[#134E4A] hover:bg-[#0f3a36] text-center">
          Retour à l'accueil
        </Link>
        <Link href="/CGU" className="btn-mint px-6 py-3 rounded-md text-white bg-[#10B981] hover:bg-[#0f9b6f] text-center">
          Condition Générale d'Utilisation
        </Link>
      </div>
    </main>
  );
}

