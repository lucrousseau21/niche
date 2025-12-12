"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const router = useRouter();
  const supabase = createClient();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Remplis tous les champs s'il te plaît.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (!acceptedTerms) {
      setMessage({
        type: "error",
        text: "Vous devez accepter les conditions d'utilisation pour continuer.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      if (data.session) {
        router.push("/formulaire");
        return;
      }

      // Fallback: If no session but user exists, try explicit sign in
      // This handles cases where auto-login might be skipped or behaves differently
      if (data.user) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInData.session) {
          router.push("/formulaire");
          return;
        }
      }

      // If still no session, likely email verification is required
      setMessage({
        type: "success",
        text: "Compte créé ! Si vous avez activé la confirmation par email, veuillez vérifier votre boîte de réception.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Une erreur est survenue lors de l'inscription.",
      });
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-forest)" }}
    >
      {/* HEADER */}
      <Header />

      {/* ⭐ ESPACE AJOUTÉ ICI ⭐ */}
      <div className="mt-20 flex flex-col items-center justify-center flex-1 p-4 w-full">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white title-font">
              Créez votre compte
            </h1>
            <p className="text-white/80 body-font text-lg px-4">
              Commencez votre veille intelligente dès aujourd&apos;hui
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                  Nom
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white 
                  transition-all body-font text-gray-800"
                />
              </div>

              {/* Prénom */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                  Prénom
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white 
                  transition-all body-font text-gray-800"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                  Adresse email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white 
                  transition-all body-font text-gray-800"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white 
                    transition-all body-font text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1 body-font">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:bg-white 
                    transition-all body-font text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Case à cocher */}
              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-mint)]"
                />
                <label htmlFor="terms" className="text-gray-700">
                  J&apos;accepte les{" "}
                  <Link
                    href="/conditions"
                    className="text-[var(--color-forest)] underline"
                  >
                    conditions d&apos;utilisation
                  </Link>{" "}
                  et la politique de confidentialité
                </label>
              </div>

              {/* Message */}
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

              {/* Bouton */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-lg text-[var(--color-forest)] bg-[var(--color-mint)] 
                hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] 
                transition-all shadow-[0_4px_14px_rgba(133,246,196,0.5)]"
              >
                Suivant
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
