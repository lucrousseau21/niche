import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement - Niche",
  description: "Récapitulatif de l'abonnement choisi avant le paiement.",
};

const plans: Record<
  string,
  {
    price: string;
    description: string;
    features: string[];
  }
> = {
  "Découverte": {
    price: "0€",
    description: "Testez Niche gratuitement avant de passer à une offre payante.",
    features: [
      "1 newsletter / semaine",
      "Niches illimitées",
      "Accès basique",
      "Avec publicités",
    ],
  },
  "Particuliers": {
    price: "4.92€",
    description: "Pour un usage personnel léger.",
    features: [
      "2 newsletters / semaine",
      "Sans publicités",
      "Suggestions IA",
      "Support email",
    ],
  },
  "Premium": {
    price: "5.90€",
    description: "Accès illimité à toutes les fonctionnalités premium.",
    features: [
      "Une newsletter / jour",
      "Niches illimitées",
      "IA personnalisée",
      "Accès base de données",
      "Dashboard complet",
      "Podcast (à venir)",
    ],
  },
  "Pro Level 1": {
    price: "25€",
    description: "Pour les créateurs et freelances.",
    features: [
      "5 newsletters / semaine",
      "Alertes secteur",
      "3 utilisateurs",
      "Dashboard simplifié",
    ],
  },
  "Pro Level 2": {
    price: "208€",
    description: "Pour les équipes en croissance.",
    features: [
      "Newsletter quotidienne",
      "Intégrations API",
      "Support prioritaire",
      "Tableau de bord avancé",
    ],
  },
  "École": {
    price: "208€",
    description: "Pour les établissements et formations.",
    features: [
      "Accès multi-comptes",
      "Ressources pédagogiques",
      "Onboarding dédié",
      "Suivi des usages",
    ],
  },
  "Entreprise": {
    price: "Sur devis",
    description: "Offre sur mesure pour grands comptes.",
    features: [
      "SLA et sécurité avancée",
      "Accompagnement dédié",
      "Intégrations personnalisées",
      "Rapports sur mesure",
    ],
  },
};

// Modification ici : SearchParams devient une Promise pour Next.js 15
type SearchParams = Promise<{
  plan?: string | string[];
  price?: string | string[];
}>;

const normalizeParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

// Modification ici : le composant devient async
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Modification ici : on "await" la Promise searchParams avant de l'utiliser
  const params = await searchParams;

  const planName = normalizeParam(params?.plan) ?? "Aucun plan sélectionné";
  const plan = plans[planName];
  const price = normalizeParam(params?.price) ?? plan?.price ?? "-";

  return (
    <div className="min-h-screen bg-[#F7FAF6]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl shadow-gray-200/50">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#1A3D3B]/70">
              Paiement
            </p>
            <h1 className="mt-4 text-4xl font-bold text-[#1A3D3B]">
              Récapitulatif de votre abonnement
            </h1>
            <p className="mt-3 text-gray-500">
              Vérifiez votre choix avant de finaliser votre abonnement.
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-[#E6F4EA] bg-[#F2FBF4] p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#1A3D3B]/70">
                    Offre sélectionnée
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-[#1A3D3B]">
                    {planName}
                  </h2>
                </div>
                <div className="rounded-3xl bg-white px-5 py-4 text-center shadow-sm shadow-green-200/50">
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="mt-2 text-4xl font-bold text-[#1A3D3B]">{price}</p>
                  {price !== "Sur devis" ? <span className="text-sm text-gray-500">/ mois</span> : null}
                </div>
              </div>

              <p className="mt-6 text-gray-600">{plan?.description ?? "Aucune description disponibles pour ce plan."}</p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8">
              <h3 className="text-xl font-semibold text-[#1A3D3B] mb-4">Ce que ce plan inclut</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {(plan?.features ?? ["Aucune fonctionnalité disponible"]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F7FAF6] p-4 text-sm text-[#1A3D3B]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4ADE80]/20 text-[#1A3D3B]">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/#pricing"
                className="inline-flex justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1A3D3B] transition hover:bg-gray-50"
              >
                Retour aux offres
              </Link>
              <button
                type="button"
                className="inline-flex justify-center rounded-2xl bg-[#1A3D3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#162e2d]"
              >
                Payer maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}