import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Niche.",
  description:
    "Politique de confidentialité Niche : protection des données, usages, cookies et droits RGPD.",
};

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Header />

      <main className="mt-24 min-h-screen mx-auto max-w-4xl px-6 py-16 bg-[#FFFAF0]">
        <h1 className="text-4xl font-bold text-[#2D3748] font-montserrat">
          Politique de Confidentialité – Niche.
        </h1>
        <p className="text-sm text-[#2D3748] opacity-70 mt-1">
          Dernière mise à jour : 11 décembre 2025
        </p>

        {/* Bloc 1 */}
        <section className="mt-10 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            1. Les données que nous collectons
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Pour faire fonctionner notre algorithme de personnalisation ("Deep Filtering"),
            nous collectons les informations suivantes :
          </p>
          <ul className="mt-3 text-[#2D3748] font-lato list-disc ml-6 leading-relaxed">
            <li><span className="font-semibold">Données d'identité :</span> Adresse email (obligatoire), Nom/Prénom (facultatif).</li>
            <li><span className="font-semibold">Données de préférences :</span> Thématiques suivies, niveau d'expertise (Débutant/Expert).</li>
            <li><span className="font-semibold">Données d'usage :</span> Taux d'ouverture, clics, temps de lecture pour améliorer la pertinence du contenu.</li>
          </ul>
        </section>

        {/* Bloc 2 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            2. Utilisation des données
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Vos données sont utilisées exclusivement pour :
          </p>
          <ul className="mt-3 text-[#2D3748] font-lato list-disc ml-6 leading-relaxed">
            <li>Vous envoyer votre newsletter personnalisée.</li>
            <li>Gérer votre abonnement et vos paiements (via notre prestataire Stripe).</li>
            <li>Améliorer nos algorithmes grâce à l'analyse anonymisée des tendances de lecture.</li>
          </ul>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed font-semibold">
            Nous ne revendons jamais vos données personnelles à des tiers.
          </p>
        </section>

        {/* Bloc 3 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            3. Partage avec des tiers (Sous‑traitants)
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Certaines données peuvent être partagées avec des prestataires indispensables :
          </p>
          <ul className="mt-3 text-[#2D3748] font-lato list-disc ml-6 leading-relaxed">
            <li><span className="font-semibold">Paiement :</span> Stripe (aucune donnée bancaire ne transite sur nos serveurs).</li>
            <li><span className="font-semibold">Envoi d’emails :</span> Prestataire email (ex : Brevo, Mailgun).</li>
            <li><span className="font-semibold">Hébergement :</span> Plateforme d’hébergement (ex : AWS, Vercel).</li>
          </ul>
        </section>

        {/* Bloc 4 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            4. Vos droits (RGPD)
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de
            suppression de vos données. Pour exercer ce droit, contactez-nous à :
          </p>
          <p className="text-[#134E4A] font-lato font-semibold mt-2">
            [Votre Email de Contact]
          </p>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Un lien de désinscription est également présent au bas de chaque email envoyé.
          </p>
        </section>

        {/* Bloc 5 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            5. Cookies
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Nous utilisons des cookies strictement nécessaires au fonctionnement du site
            (session utilisateur) ainsi que des cookies de mesure d’audience anonymes
            permettant de comprendre l’utilisation du service. Vous pouvez gérer vos
            préférences via le bandeau cookies lors de votre première visite.
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
            href="/CGU"
            className="btn-mint px-6 py-3 rounded-md text-white bg-[#10B981] hover:bg-[#0f9b6f] text-center"
          >
            Conditions Générales d'Utilisation
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
