"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Remplis tous les champs s'il te plaît.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        router.refresh(); // Refresh to update server components (header)
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="card">
          <h1
            className="title-font text-2xl font-bold"
            style={{ color: "var(--color-forest)" }}
          >
            Bon retour !
          </h1>
          <p className="small-muted mt-2">
            Connecte-toi pour accéder à tes newsletters.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
            <input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              aria-label="Email"
              type="email"
              className="card"
            />
            <input
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              type="password"
              className="card"
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 ${
                message.type === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <p className="small-muted mt-3">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-[var(--color-forest)]">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
