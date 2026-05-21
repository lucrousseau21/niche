import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import StripeElementsWrapper from "./StripeElementsWrapper";

export const metadata: Metadata = {
  title: "Paiement - Niche",
  description: "Finalisez votre abonnement en toute sécurité.",
};

const plans: Record<string, { price: string; description: string; features: string[] }> = {
  "Découverte": {
    price: "0€",
    description: "Testez Niche gratuitement avant de passer à une offre payante.",
    features: ["1 newsletter / semaine", "Niches illimitées", "Accès basique", "Avec publicités"],
  },
  "Premium": {
    price: "5.90€",
    description: "Accès illimité à toutes les fonctionnalités premium.",
    features: ["Une newsletter / jour", "Niches illimitées", "IA personnalisée", "Accès base de données", "Dashboard complet"],
  },
};

type SearchParams = Promise<{ plan?: string | string[]; price?: string | string[] }>;
const normalizeParam = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const planName = normalizeParam(params?.plan) ?? "Aucun plan sélectionné";
  const plan = plans[planName];
  const price = normalizeParam(params?.price) ?? plan?.price ?? "-";

  // Montant à envoyer à l'API
  const numericAmount = planName === "Premium" ? 5.90 : 0;
  let clientSecret = "";

  // Si c'est un plan payant, on demande l'autorisation à notre API Stripe
  if (numericAmount > 0) {
    try {
      // Note : assure-toi que le port est bien 3000
      const response = await fetch(`http://localhost:3000/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, amount: numericAmount }),
        cache: "no-store", // Évite que Next.js mette le secret en cache
      });
      const data = await response.json();
      clientSecret = data.clientSecret;
    } catch (e) {
      console.error("Erreur d'initialisation Stripe", e);
    }
  }

  // Action serveur alternative pour le plan 100% gratuit
  async function handleFreePlan() {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    
    await supabase.from("subscriptions").upsert(
      { user_id: user.id, plan_name: planName, status: "active", updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    redirect("/settings?success=true");
  }

  return (
    <div className="min-h-screen bg-[#F7FAF6]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl shadow-gray-200/50">
          
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#1A3D3B]/70 font-semibold">Paiement Sécurisé</p>
            <h1 className="mt-4 text-4xl font-bold text-[#1A3D3B] tracking-tight">Finalisez votre abonnement</h1>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-[#E6F4EA] bg-[#F2FBF4] p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#1A3D3B]/70 font-medium">Offre sélectionnée</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#1A3D3B]">{planName}</h2>
                </div>
                <div className="rounded-3xl bg-white px-5 py-4 text-center shadow-sm shadow-green-200/50 min-w-[125px]">
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="mt-2 text-4xl font-bold text-[#1A3D3B]">{price}</p>
                  {price !== "Sur devis" && price !== "0€" && <span className="text-sm text-gray-500">/ mois</span>}
                </div>
              </div>
            </div>

            {/* LOGIQUE D'AFFICHAGE */}
            {planName === "Découverte" ? (
              <form action={handleFreePlan} className="text-center bg-white p-8 border border-gray-200 rounded-3xl">
                <h3 className="text-xl font-bold text-[#1A3D3B] mb-4">Aucune carte requise</h3>
                <button type="submit" className="bg-[#1A3D3B] text-white px-8 py-3 rounded-2xl font-semibold">Activer mon offre gratuite</button>
              </form>
            ) : clientSecret ? (
              <StripeElementsWrapper clientSecret={clientSecret}>
                <CheckoutForm price={price} />
              </StripeElementsWrapper>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-3xl">
                Connexion sécurisée à la banque en cours...
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}