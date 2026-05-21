import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/Header";
import SettingsNicheSelector from "@/components/SettingsNicheSelector";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Récupération des infos d'abonnement dans Supabase
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_name, status")
    .eq("user_id", user.id)
    .maybeSingle(); // Évite de faire planter si l'utilisateur n'a pas encore de ligne d'abonnement

  // Valeurs par défaut si aucun abonnement n'est trouvé en BDD
  const currentPlan = subscription?.plan_name ?? "Découverte";
  const isPlanActive = subscription?.status === "active" || !subscription; 

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <div className="max-w-2xl mx-auto pt-32 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A3D3B] tracking-tight">
            Paramètres
          </h1>
          <p className="text-gray-500 mt-2">
            Gérez vos préférences et votre compte
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Email Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Compte
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Adresse email
                  </label>
                  <div className="text-gray-900 font-medium">{user.email}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#1A3D3B]/10 flex items-center justify-center text-[#1A3D3B]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* NOUVELLE SECTION : Gérer l'abonnement */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Gestion de l'abonnement
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#E6F4EA] bg-[#F2FBF4]">
                <div>
                  <label className="block text-xs font-medium text-[#1A3D3B]/70 mb-1">
                    Offre actuelle
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-bold text-lg">{currentPlan}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      isPlanActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {isPlanActive ? "Actif" : "En attente / Suspendu"}
                    </span>
                  </div>
                </div>
                
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-xl bg-[#1A3D3B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#162e2d] shadow-sm text-center"
                >
                  Mettre à niveau ou changer
                </Link>
              </div>
            </div>

            {/* Niches Section */}
            <SettingsNicheSelector />

            {/* Logout Section */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Session
              </h2>
              <div className="flex items-center justify-start">
                <LogoutButton />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}