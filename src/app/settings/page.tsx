import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/Header";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
