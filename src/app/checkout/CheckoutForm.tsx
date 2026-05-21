"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Link from "next/link";

export default function CheckoutForm({ price }: { price: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Stripe prend le relais : il valide la carte et gère le paiement !
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirection automatique vers tes paramètres après un paiement réussi
        return_url: `${window.location.origin}/settings?success=true`,
      },
    });

    // Si on arrive ici, c'est que le paiement a échoué (carte refusée, code faux...)
    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message ?? "Erreur avec la carte bancaire.");
    } else {
      setErrorMessage("Une erreur inattendue est survenue.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-[#1A3D3B] mb-6">
          Informations de paiement sécurisées
        </h3>
        
        {/* Le module magique de Stripe qui affiche tous les champs de carte ! */}
        <PaymentElement options={{ layout: "tabs" }} />

        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
        <Link
          href="/pricing"
          className="inline-flex justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1A3D3B] transition hover:bg-gray-50 text-center"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="inline-flex justify-center rounded-2xl bg-[#1A3D3B] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#162e2d] shadow-md shadow-emerald-950/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Traitement sécurisé..." : `Payer ${price}`}
        </button>
      </div>
    </form>
  );
}