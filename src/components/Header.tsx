"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center">
          <img
            src="/images/Logo 1.svg"
            alt="Niche"
            className="h-10 w-auto"
          />
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-[#1A3D3B]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {user ? (
            <>
              <Link
                href="/settings"
                className="text-gray-500 hover:text-[#1A3D3B] transition-colors"
              >
                Paramètres
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-[#1A3D3B] transition-colors cursor-pointer"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-gray-500 hover:text-[#1A3D3B] transition-colors"
              >
                Fonctionnalités
              </Link>
              <Link
                href="/pricing"
                className="text-gray-500 hover:text-[#1A3D3B] transition-colors"
              >
                Tarifs
              </Link>

              {/* Separator */}
              <div className="h-4 w-px bg-gray-200"></div>

              <Link
                href="/login"
                className="bg-[#1A3D3B] text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Se connecter
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-[300px] h-full bg-[#1A3D3B] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-8 pb-6">
                <div className="font-bold text-3xl tracking-tighter text-white mb-6">
                  Niche.
                </div>
                <div className="h-px w-full bg-white/10"></div>
              </div>

              {/* Navigation */}
              <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 bg-[#85F6C4] text-[#1A3D3B] rounded-xl font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Accueil
                </Link>

                <div
                  title="Bientôt disponible"
                  className="flex items-center gap-3 px-4 py-3 text-white/50 cursor-not-allowed rounded-xl font-medium"
                >
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
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  Tendances
                </div>

                <div
                  title="Bientôt disponible"
                  className="flex items-center gap-3 px-4 py-3 text-white/50 cursor-not-allowed rounded-xl font-medium"
                >
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
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Sauvegardés
                </div>

                <div
                  title="Bientôt disponible"
                  className="flex items-center gap-3 px-4 py-3 text-white/50 cursor-not-allowed rounded-xl font-medium"
                >
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
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Analytiques
                </div>

                <div
                  title="Bientôt disponible"
                  className="flex items-center gap-3 px-4 py-3 text-white/50 cursor-not-allowed rounded-xl font-medium"
                >
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
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Alertes
                </div>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
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
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Paramètres
                </Link>
              </div>

              {/* Drawer Footer (User Profile) */}
              <div className="p-6 border-t border-white/10 mt-auto">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#85F6C4] flex items-center justify-center text-[#1A3D3B]">
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
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {user.email}
                      </div>
                      <div className="text-white/60 text-xs">Premium</div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full bg-[#85F6C4] text-[#1A3D3B] px-6 py-3 rounded-xl font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
