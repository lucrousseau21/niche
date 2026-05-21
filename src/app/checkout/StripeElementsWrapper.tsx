"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// On charge Stripe avec ta clé publique (celle qui commence par pk_test...)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeElementsWrapper({
  children,
  clientSecret,
}: {
  children: React.ReactNode;
  clientSecret: string;
}) {
  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret, 
        appearance: { theme: 'flat', variables: { colorPrimary: '#1A3D3B' } } // On l'adapte à ta couleur verte !
      }}
    >
      {children}
    </Elements>
  );
}