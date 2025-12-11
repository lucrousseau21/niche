import React from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function CGU() {
  return (
    <>

      <Header />

      {/* Contenu principal */}
      <main className="mt-24 min-h-screen mx-auto max-w-4xl px-6 py-16 bg-[#FFFAF0]">
        {/* Titre */}
        <h1 className="text-4xl font-bold text-[#2D3748] font-montserrat">
          Conditions Générales d’Utilisation – Niche.
        </h1>
        <p className="text-sm text-[#2D3748] opacity-70 mt-1">
          Dernière mise à jour : 10 décembre 2025
        </p>

        {/* Bloc 1 */}
        <section className="mt-10 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            1. Présentation du Service
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Niche. est un service de veille stratégique automatisée édité par Niche&Co.,
            ci-après désigné "l'Éditeur". Le service propose l'envoi de newsletters
            thématiques et l'accès à une application de consultation de contenus, basés
            sur une curation assistée par Intelligence Artificielle.
          </p>
        </section>

        {/* Bloc 2 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            2. Accès au Service
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            L'accès au service Niche. est réservé aux utilisateurs ayant souscrit un
            abonnement valide ou bénéficiant d'une période d'essai gratuite. L'utilisateur
            s'engage à fournir des informations sincères lors de son inscription
            (notamment une adresse email valide) afin de garantir la bonne réception des
            contenus.
          </p>
        </section>

        {/* Bloc 3 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            3. Propriété Intellectuelle
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            L'ensemble des contenus envoyés par Niche. (synthèses, analyses, mises en page,
            graphiques) est protégé par le droit de la propriété intellectuelle.
            <br />
            <span className="font-semibold">Usage strictement personnel :</span> L'abonnement est nominatif. Le transfert,
            la revente ou la rediffusion publique des newsletters (forward massif) est
            strictement interdit sans l'accord de l'Éditeur.
          </p>
        </section>

        {/* Bloc 4 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            4. Limitation de Responsabilité
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            <span className="font-semibold">Nature de l'information :</span> Les contenus fournis par Niche. sont des
            synthèses informatives. Ils ne constituent en aucun cas un conseil en
            investissement, un conseil juridique ou une incitation à l'achat, notamment
            pour les thématiques Finance, Crypto ou Droit.
            <br /><br />
            <span className="font-semibold">Absence de garantie :</span> Malgré nos efforts pour vérifier la fiabilité des
            sources (notamment via un processus de validation humaine), l'Éditeur ne
            saurait être tenu responsable des erreurs, omissions ou "hallucinations"
            générées par les outils d'IA, ni des conséquences de l'utilisation de ces
            informations par l'abonné.
          </p>
        </section>

        {/* Bloc 5 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            5. Abonnements et Paiements
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Les abonnements sont souscrits pour une durée déterminée (mensuelle ou
            annuelle) avec reconduction tacite.
            <br />
            <span className="font-semibold">Résiliation :</span> L'utilisateur peut résilier son abonnement à tout moment
            depuis son espace compte. La résiliation prend effet à la fin de la période
            de facturation en cours. Aucun remboursement au prorata n'est effectué pour
            une période déjà entamée.
          </p>
        </section>

        {/* Bloc 6 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            6. Modification des CGU
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            L'Éditeur se réserve le droit de modifier les présentes conditions à tout
            moment. Les utilisateurs seront informés des mises à jour majeures par email.
          </p>
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-md text-white bg-[#134E4A] hover:bg-[#0f3a36] text-center"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/conf"
            className="btn-mint px-6 py-3 rounded-md text-white bg-[#10B981] hover:bg-[#0f9b6f] text-center"
          >
            Politique de confidentialité
          </Link>
        </div>
      </main>
    </>
  );
}