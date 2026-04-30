"use client";

import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import NewsletterCard from "@/components/NewsletterCard";

export default function LandingPage() {
  // 1. Données statiques pour l'exemple de la Landing Page
  const demoNewsletter = {
    category: "Intelligence Artificielle",
    date: "14 Octobre 2024",
    title: "L'IA générative transforme le secteur médical",
    bullets: [
      "Google DeepMind dévoile AlphaFold 3 pour la modélisation moléculaire.",
      "L'UE vote une nouvelle régulation sur l'usage de l'IA dans la santé.",
      "Nvidia lance une puce dédiée au calcul génomique ultra-rapide.",
    ],
  };

  // Features data
  const features = [
    {
      title: "IA Personnalisée",
      slug: "ia-personnalisee",
      desc: "Notre IA adapte le contenu à votre niveau et vos préférences pour une expérience sur-mesure.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path d="M20 2h-4v4" />
          <path d="M4 22h4v-4" />
        </svg>
      ),
    },
    {
      title: "Dashboard Intuitif",
      slug: "dashboard-intuitif",
      desc: "Suivez votre progression, organisez vos sujets favoris et accédez à votre historique.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      title: "Base de Connaissances",
      slug: "base-de-connaissances",
      desc: "Recherchez dans toutes vos newsletters passées avec notre moteur de recherche intelligent.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
    },
    {
      title: "Gain de Temps",
      slug: "gain-de-temps",
      desc: "5 minutes par semaine au lieu de plusieurs heures. Concentrez-vous sur l'essentiel.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "Notifications Smart",
      slug: "notifications-smart",
      desc: "Recevez uniquement les alertes importantes sur les sujets qui vous intéressent vraiment.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      title: "Sources Vérifiées",
      slug: "sources-verifiees",
      desc: "Contenu sourcé et vérifié par nos experts. Zéro fake news, que de l'information fiable.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Cream Section: Hero */}
      <div className="bg-[#FFFDF7]">
        <main className="max-w-6xl mx-auto px-6 pb-12 lg:pb-24">
          <Hero />
        </main>
      </div>

      {/* White Section: Features */}
      <section id="features" className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className="pill-white mb-6">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-forest"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-gray-600 font-medium">Fonctionnalités</span>
            </div>
            <h2 className="title-font text-3xl md:text-4xl font-bold mb-4 text-forest">
              Une veille intelligente et efficace
            </h2>
            <p className="body-font text-gray-500 text-lg">
              Tout ce dont vous avez besoin pour rester à la pointe de votre
              domaine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f, i) => (
              <FeatureCard
                key={i}
                title={f.title}
                desc={f.desc}
                icon={f.icon}
                slug={f.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content continuing... (Preview) */}
      <div className="bg-[#FFFDF7] py-16 lg:py-24 flex grow">
        <div className="max-w-6xl mx-auto px-6">
          <section id="preview" className="mb-24">
            <div className="mb-12 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="pill-white mb-6">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span className="text-gray-600 font-medium">
                  Aperçu de l&apos;application
                </span>
              </div>
              <h3 className="title-font text-3xl md:text-4xl font-bold mb-4 text-forest">
                Découvrez vos newsletters
              </h3>
              <p className="body-font text-gray-500 text-lg leading-relaxed">
                Voici à quoi ressemble votre veille hebdomadaire, personnalisée
                selon vos niches.
              </p>
            </div>

            <div className="flex justify-center">
              {/* 2. Affichage de la Newsletter avec les données statiques */}
              <NewsletterCard
                category={demoNewsletter.category}
                date={demoNewsletter.date}
                title={demoNewsletter.title}
                bullets={demoNewsletter.bullets}
                // Pas besoin d'ID ici car c'est juste visuel
              />
            </div>
          </section>
        </div>
      </div>

      {/* Pricing Section (White) */}
      <section id="pricing" className="bg-white py-16 lg:py-24 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="pill-white mb-6 bg-orange-50/50 border-orange-100/50">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#1A3D3B]"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="font-semibold text-[#1A3D3B]">Tarifs</span>
            </div>
            <h2 className="title-font text-3xl md:text-4xl font-bold mb-4 text-[#1A3D3B]">
              Choisissez votre formule
            </h2>
            <p className="body-font text-gray-500 text-lg">
              Transparence totale. Pas de frais cachés. Annulation en un clic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:border-gray-200 transition-all text-left relative h-full flex flex-col">
              <div className="mb-6">
                <h3 className="title-font text-2xl font-bold text-[#1A3D3B] mb-2">
                  Découverte
                </h3>
                <p className="text-sm text-gray-500">
                  Avec toutes ses fonctionnalités accessibles
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-[#1A3D3B] tracking-tight">
                  0€
                </span>
                <span className="text-gray-400 font-medium">/mois</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "1 newsletter / semaine",
                  "Niches illimitées",
                  "Niche au choix",
                  "Avec publicités",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-gray-600 font-medium"
                  >
                    {item === "Avec publicités" ? (
                      <svg
                        className="w-5 h-5 text-gray-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8h.01M12 12v4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-green-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A3D3B] font-bold transition-colors">
                Démarrer maintenant
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#1A3D3B] rounded-2xl p-8 shadow-2xl shadow-green-900/20 text-left relative transform md:-translate-y-4 h-full flex flex-col border border-[#1A3D3B]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4ADE80] text-[#1A3D3B] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                Le plus populaire
              </div>

              <div className="mb-6">
                <h3 className="title-font text-2xl font-bold text-white mb-2">
                  Premium
                </h3>
                <p className="text-sm text-green-100/80">
                  Avoir un accès illimité à nos fonctionnalités
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">
                  5.90€
                </span>
                <span className="text-green-200/80 font-medium">/mois</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Une newsletter / jour",
                  "Niches illimitées",
                  "IA personnalisée",
                  "Accès base de données",
                  "Dashboard complet",
                  "Podcast (à venir)",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-white font-medium"
                  >
                    <svg
                      className="w-5 h-5 text-[#4ADE80] shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3.5 px-6 rounded-xl bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#1A3D3B] font-bold transition-colors shadow-lg shadow-green-500/20">
                Démarrer maintenant
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:border-gray-200 transition-all text-left relative h-full flex flex-col">
              <div className="mb-6">
                <h3 className="title-font text-2xl font-bold text-[#1A3D3B] mb-2">
                  Entreprise
                </h3>
                <p className="text-sm text-gray-500">
                  Solution sur mesure pour les équipes et les intégrations.
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-[#1A3D3B] tracking-tight">
                  Sur devis
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Support prioritaire",
                  "Intégrations API",
                  "Sécurité avancée",
                  "100% personnalisable", 
                  "Accompagnement onboarding",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-gray-600 font-medium"
                  >
                    <svg
                      className="w-5 h-5 text-[#4ADE80] shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3.5 px-6 rounded-xl bg-[#1A3D3B] hover:bg-[#162e2d] text-white font-bold transition-colors shadow-lg shadow-black/10">
                Contactez-nous
              </button>
            </div>
          </div>

          <div className="mt-12 text-sm text-gray-500 space-y-1">
            <p>Toutes les formules incluent :</p>
            <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 justify-center items-center">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-[#1A3D3B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Annulation en 1 clic
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-[#1A3D3B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Garantie satisfait ou remboursé 30 jours
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-[#1A3D3B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Support réactif
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Full Width Dark Green) */}
      <section id="cta" className="bg-[#1A3D3B] py-24 relative overflow-hidden">
        {/* Radial gradient effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="title-font text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Rejoignez 10 000+ <br /> professionnels
          </h2>

          <p className="body-font text-lg md:text-xl text-green-100/90 mb-10 max-w-xl mx-auto leading-relaxed">
            Arrêtez de perdre du temps à chercher. Veillez efficacement avec
            Niche.
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <a
              href="/signup"
              className="w-full sm:w-auto bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#1A3D3B] text-lg font-bold py-4 px-10 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
            >
              Démarrer gratuitement
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </a>
            <span className="text-sm text-green-200/60">
              Aucune carte bancaire requise
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/10 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                10 000+
              </div>
              <div className="text-green-200/80 font-medium">
                Utilisateurs actifs
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                50+
              </div>
              <div className="text-green-200/80 font-medium">
                Niches disponibles
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                4.9/5
              </div>
              <div className="text-green-200/80 font-medium">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}