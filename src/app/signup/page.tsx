'use client';

import { useState } from "react";
import Link from "next/link";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Signup() {
  const supabase = createBrowserClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success'|'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || !fullName) {
      setMessage({ type: "error", text: "Remplis tous les champs s'il te plaît." });
      return;
    }

    setLoading(true);

    try {
      // 1) Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      // If user created, try to create profile via server route
      const userId = data.user?.id ?? null;

      if (!userId) {
        // Sign up may require email confirmation; still try to retrieve user id from returned data
        setMessage({
          type: "success",
          text: "Inscription enregistrée. Vérifie ton e‑mail pour confirmer ton compte.",
        });
        setLoading(false);
        return;
      }

      // 2) Call server endpoint to insert profile (uses service role key)
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, email, full_name: fullName }),
      });

      const body = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: body?.error ?? "Erreur lors de la création du profil." });
      } else {
        setMessage({ type: "success", text: "Compte créé — tu peux maintenant te connecter." });
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message ?? "Erreur inconnue." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="card">
          <h1 className="title-font text-2xl font-bold" style={{ color: 'var(--color-forest)' }}>Créer un compte</h1>
          <p className="small-muted mt-2">Inscription rapide — aucune carte requise pour commencer.</p>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              aria-label="Nom complet"
              className="card"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              type="email"
              className="card"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              type="password"
              className="card"
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Patiente..." : "Créer un compte"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
              {message.text}
            </div>
          )}

          <p className="small-muted mt-3">
            Déjà inscrit ? <Link href="/"className="text-[var(--color-forest)]">Se connecter</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}