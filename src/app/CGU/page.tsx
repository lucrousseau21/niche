import React from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function CGU() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <main className="min-h-screen mx-auto max-w-4xl px-6 py-16 bg-[#FFFAF0]">
        {/* Titre */}
        <h1 className="text-4xl font-bold text-[#2D3748] font-montserrat">
          Conditions Générales d’Utilisation
        </h1>
        <p className="text-sm text-[#2D3748] opacity-70 mt-1">
          Dernière mise à jour : 10 décembre 2025
        </p>

        {/* Bloc 1 */}
        <section className="mt-10 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
            1. Objet
          </h2>
          <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
            Les présentes Conditions Générales d’Utilisation ("CGU") définissent les règles
            d’accès et d’usage du site. En utilisant ce site, vous acceptez pleinement ces conditions.
          </p>
        </section>

        {/* Bloc 2 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          2. Accès au service
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          L’accès au site nécessite une connexion Internet. Nous mettons tout en œuvre pour
          assurer la disponibilité du service, sans garantie d’accès ininterrompu.
        </p>
      </section>

      {/* Bloc 3 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          3. Inscription et compte utilisateur
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Certaines fonctionnalités nécessitent la création d’un compte. Vous devez fournir
          des informations exactes et garder vos identifiants confidentiels.
        </p>
      </section>

      {/* Bloc 4 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          4. Utilisation du site
        </h2>
        <ul className="mt-3 text-[#2D3748] font-lato list-disc ml-6 leading-relaxed">
          <li>Ne pas utiliser le site à des fins illégales.</li>
          <li>Ne pas perturber le bon fonctionnement du service.</li>
          <li>Ne pas tenter d’accéder sans autorisation aux systèmes internes.</li>
        </ul>
      </section>

      {/* Bloc 5 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          5. Contenu utilisateur
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Vous êtes responsable de tout contenu publié. Nous nous réservons le droit de
          supprimer tout contenu illicite ou contraire à nos politiques.
        </p>
      </section>

      {/* Bloc 6 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          6. Propriété intellectuelle
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Tous les éléments du site sont protégés. Toute reproduction ou distribution non
          autorisée est interdite.
        </p>
      </section>

      {/* Bloc 7 */}
      <section className="mt-6 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-[#134E4A] font-montserrat">
          7. Données personnelles
        </h2>
        <p className="mt-3 text-[#2D3748] font-lato leading-relaxed">
          Le traitement des données est expliqué dans notre Politique de confidentialité.
        </p>
      </section>

        {/* Boutons de navigation */}
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
