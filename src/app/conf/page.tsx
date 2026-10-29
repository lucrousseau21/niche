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
          Dernière mise à jour : 29 octobre 2026
        </p>

        {/* Bloc 1 */}
        <section className="mt-10 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            1. Les données que nous collectons
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Pour faire fonctionner notre algorithme de personnalisation (&quot;Deep Filtering&quot;),
            nous collectons les informations suivantes :
          </p>
          <ul className="mt-3 text-[#2D3748] font-lato list-disc ml-6 leading-relaxed">
            <li><span className="font-semibold">Données d&apos;identité :</span> Adresse email (obligatoire), Nom/Prénom (facultatif).</li>
            <li><span className="font-semibold">Données de préférences :</span> Thématiques suivies, niveau d&apos;expertise (Débutant/Expert).</li>
            <li><span className="font-semibold">Données de paiement :</span> informations de suivi d’abonnement et de transaction traitées par Stripe ; Niche ne reçoit pas les numéros complets de carte bancaire.</li>
            <li><span className="font-semibold">Données d&apos;usage :</span> Taux d&apos;ouverture, clics, temps de lecture pour améliorer la pertinence du contenu.</li>
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
            <li>Assurer la sécurité, le fonctionnement et l’amélioration du service.</li>
            <li>Améliorer nos algorithmes grâce à l&apos;analyse anonymisée des tendances de lecture.</li>
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
            <li><span className="font-semibold">Paiement :</span> Stripe, pour la gestion des paiements. Les coordonnées bancaires sont saisies dans les composants de paiement Stripe.</li>
            <li><span className="font-semibold">Hébergement et données de compte :</span> Vercel et Supabase, selon les services utilisés.</li>
          </ul>
        </section>

        {/* Bloc 4 */}
        <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            4. Vos droits (RGPD)
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Conformément au RGPD, vous disposez notamment de droits d’accès, de
            rectification, d’effacement, de limitation, d’opposition et de
            portabilité lorsque les conditions légales sont réunies. Pour
            exercer vos droits ou poser une question sur vos données, écrivez à :
          </p>
          <p className="text-[#134E4A] font-lato font-semibold mt-2">
            <a className="underline" href="mailto:niche.edito@gmail.com">
              niche.edito@gmail.com
            </a>
          </p>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Vous pouvez également introduire une réclamation auprès de la CNIL.
            Nous répondrons dans les délais prévus par le RGPD.
          </p>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Vous pouvez également vous opposer à l’envoi de communications
            facultatives en utilisant le moyen de désinscription indiqué dans
            le message concerné.
          </p>
        </section>

        {/* Bloc 5 */}
        <section id="cookies" className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            5. Cookies
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Les cookies et traceurs nécessaires à la connexion et à la sécurité
            sont utilisés pour fournir le service. Le script Google Analytics
            n’est chargé qu’après votre accord explicite
            pour la mesure d’audience. Vous pouvez refuser ces traceurs ou modifier
            votre choix à tout moment             avec le lien &laquo; Gérer les cookies &raquo; en bas de
            chaque page. Le refus n’empêche pas l’utilisation du service.
          </p>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Le détail des durées de conservation, des bases légales et des
            éventuels transferts hors de l’Espace économique européen doit être
            confirmé selon les paramétrages effectivement utilisés par Niche et
            ses prestataires.
          </p>
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-md text-white bg-[#134E4A] hover:bg-[#0f3a36] text-center"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/CGU"
            className="btn-mint px-6 py-3 rounded-md text-white bg-[#10B981] hover:bg-[#0f9b6f] text-center"
          >
            Conditions Générales d&apos;Utilisation
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
