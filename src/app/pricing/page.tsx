import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarifs | Niche.",
  description:
    "Comparez les offres Niche pour démarrer votre veille sectorielle, de l'essai gratuit à l'abonnement entreprise.",
};

const plans = [
  {
    name: "Découverte",
    price: "0€",
    description: "Testez Niche gratuitement avant de passer à une offre payante.",
    features: [
      "1 newsletter / semaine",
      "Niches illimitées",
      "Accès basique",
      "Avec publicités",
    ],
    buttonText: "Commencer gratuitement",
    href: "/paiement?plan=Découverte&price=0€",
    popular: false,
  },
  {
    name: "Premium",
    price: "5.90€",
    description: "Accès illimité à toutes les fonctionnalités premium.",
    features: [
      "Une newsletter / jour",
      "Niches illimitées",
      "IA personnalisée",
      "Accès base de données",
      "Dashboard complet",
    ],
    buttonText: "Passer au Premium",
    href: "/paiement?plan=Premium&price=5.90€",
    popular: true, // Met en valeur cette carte
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    description: "Offre sur mesure pour grands comptes et structures.",
    features: [
      "SLA et sécurité avancée",
      "Accompagnement dédié",
      "Intégrations personnalisées",
      "Rapports sur mesure",
    ],
    buttonText: "Contactez-nous",
    href: "mailto:contact@niche.fr",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#F7FAF6] flex flex-col justify-between">
      <div>
        <Header />
        
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
          {/* Section Titre */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[#1A3D3B]/70 font-semibold">
              Abonnements
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[#1A3D3B] tracking-tight">
              Des tarifs simples, sans surprise
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Commencez gratuitement, passez à la vitesse supérieure quand vous êtes prêt.
            </p>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-3xl p-8 bg-white border transition duration-300 shadow-xl shadow-gray-200/40 relative ${
                  plan.popular
                    ? "border-[#4ADE80] ring-2 ring-[#4ADE80]/20 scale-105 md:-translate-y-2 z-10"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Badge populaire */}
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A3D3B] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Le plus populaire
                  </span>
                )}

                <div>
                  {/* Entête de la carte */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#1A3D3B]">{plan.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 min-h-[40px]">
                      {plan.description}
                    </p>
                    <div className="mt-5 flex items-baseline text-[#1A3D3B]">
                      <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                      {plan.price !== "Sur devis" && (
                        <span className="ml-1 text-sm font-semibold text-gray-500">/mois</span>
                      )}
                    </div>
                  </div>

                  <hr className="border-gray-100 my-6" />

                  {/* Liste des features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]/20 text-[#1A3D3B] text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton d'action vers /paiement */}
                <div>
                  <Link
                    href={plan.href}
                    className={`w-full inline-flex justify-center rounded-2xl py-3.5 px-4 text-center text-sm font-semibold transition shadow-sm ${
                      plan.popular
                        ? "bg-[#1A3D3B] text-white hover:bg-[#162e2d]"
                        : "bg-[#F2FBF4] text-[#1A3D3B] border border-[#E6F4EA] hover:bg-[#e1f5e6]"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}