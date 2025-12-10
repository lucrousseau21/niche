"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
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
    <header className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="brand-square" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="4"
              fill="var(--color-forest)"
            />
            <path
              d="M8 14s1-3 4-3 4 3 4 3"
              stroke="#fff"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 6v4"
              stroke="#fff"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <div>
          <Link
            href="/"
            className="logo-font text-lg font-semibold"
            style={{ color: "var(--color-forest)" }}
          >
            Niche
          </Link>
          <div className="text-xs small-muted">AI-powered content studio</div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-4 text-sm">
        <Link href="/#features" className="small-muted">
          Fonctionnalités
        </Link>
        <Link href="/about" className="small-muted">
          À propos
        </Link>
        <Link href="/pricing" className="small-muted">
          Tarifs
        </Link>

        {user ? (
          <>
            <Link href="/dashboard" className="small-muted font-medium">
              Tableau de bord
            </Link>
            <button onClick={handleSignOut} className="btn-primary ml-2">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="small-muted">
              Connexion
            </Link>
            <Link href="/signup" className="btn-primary">
              Essayer
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
