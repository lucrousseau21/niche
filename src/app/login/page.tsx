"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Login() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        router.refresh();
        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    console.log("Google Login clicked");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 relative"
      style={{ backgroundColor: "var(--color-forest)" }}
    >
      {/* HEADER */}
      <Header />

      {/* MARGE ENTRE LE HEADER ET LE CONTENU */}
      <div className="mt-24 w-full max-w-md space-y-8 relative z-10">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white title-font">
            Bon retour
          </h1>
          <p className="text-white/80 body-font text-lg">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                Adresse email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                type="email"
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white transition-all body-font text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white transition-all body-font text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-sm text-center font-medium ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-lg text-[var(--color-forest)] bg-[var(--color-mint)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(133,246,196,0.5)]"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 body-font">
                Ou continuer avec
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 rounded-2xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-500 body-font">
            Vous n&apos;avez pas de compte ?{" "}
            <Link
              href="/signup"
              className="font-bold text-[var(--color-forest)] hover:underline"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 max-w-xs mx-auto">
          En vous connectant, vous rejoignez notre communauté de plus de 10,000
          utilisateurs
        </p>
      </div>
    </div>
  );
}
