  import Link from "next/link";
  import type { Metadata } from "next";
  import { createClient } from "@/lib/supabase/server";
  import { redirect } from "next/navigation";

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
  };

  type SearchParams = Promise<{
    plan?: string | string[];
    price?: string | string[];
  }>;

  const normalizeParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  export default async function CheckoutPage({
    searchParams,
  }: {
    searchParams: SearchParams;
  }) {
    const params = await searchParams;

    const planName = normalizeParam(params?.plan) ?? "Aucun plan sélectionné";
    const plan = plans[planName];
    const price = normalizeParam(params?.price) ?? plan?.price ?? "-";

    // Action serveur exécutée lors du clic sur le bouton
    async function handlePayment() {
      "use server";

      const supabase = await createClient();

      // 1. Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
      }

      // CAS 1 : C'est le plan Premium payant -> On l'envoie vers la vraie page de paiement Stripe
      if (planName === "Premium") {
        // Remplace ce lien par ton vrai "Stripe Payment Link" créé sur ton tableau de bord Stripe
        const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_bJebJ10OsgizdN15ve93y00"; 
        
        // Optionnel mais recommandé : Tu peux ajouter l'email de l'utilisateur dans l'URL pour Stripe
        const urlWithEmail = `${STRIPE_CHECKOUT_URL}?prefilled_email=${encodeURIComponent(user.email)}`;
        
        redirect(urlWithEmail);
      } 
      
      // CAS 2 : C'est le plan gratuit Découverte -> On l'active direct dans Supabase
      else {
        await supabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            plan_name: planName,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        redirect("/settings?success=true");
      }
    }

    return (
      <div className="min-h-screen bg-[#F7FAF6]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl shadow-gray-200/50">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-[#1A3D3B]/70 font-semibold">
                Paiement
              </p>
              <h1 className="mt-4 text-4xl font-bold text-[#1A3D3B] tracking-tight">
                Récapitulatif de votre abonnement
              </h1>
              <p className="mt-3 text-gray-500">
                Vérifiez votre choix avant de finaliser votre abonnement.
              </p>
            </div>

            <form action={handlePayment} className="space-y-8">
              <div className="rounded-3xl border border-[#E6F4EA] bg-[#F2FBF4] p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#1A3D3B]/70 font-medium">
                      Offre sélectionnée
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-[#1A3D3B]">
                      {planName}
                    </h2>
                  </div>
                  <div className="rounded-3xl bg-white px-5 py-4 text-center shadow-sm shadow-green-200/50 min-w-[125px]">
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="mt-2 text-4xl font-bold text-[#1A3D3B]">{price}</p>
                    {price !== "Sur devis" && price !== "0€" ? (
                      <span className="text-sm text-gray-500">/ mois</span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-6 text-gray-600">
                  {plan?.description ?? "Aucune description disponible pour ce plan."}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8">
                <h3 className="text-xl font-semibold text-[#1A3D3B] mb-4">
                  Ce que ce plan inclut
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {(plan?.features ?? ["Aucune fonctionnalité disponible"]).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F7FAF6] p-4 text-sm text-[#1A3D3B]">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]/20 text-[#1A3D3B] font-bold">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
                <Link
                  href="/pricing"
                  className="inline-flex justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1A3D3B] transition hover:bg-gray-50 text-center"
                >
                  Retour aux offres
                </Link>

                <button
                  type="submit"
                  className="inline-flex justify-center rounded-2xl bg-[#1A3D3B] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#162e2d] text-center shadow-md shadow-emerald-950/10 cursor-pointer"
                >
                  {planName === "Premium" ? "Aller au paiement" : "Activer mon offre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }