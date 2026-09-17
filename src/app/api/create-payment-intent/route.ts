import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server"; // Ajuste le chemin si besoin

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY non configurée" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: "2023-10-16" as any,
    });

    const supabase = await createClient();
    
    // 1. On vérifie que l'utilisateur est bien connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { planName, amount } = await request.json();

    // 2. On crée l'intention de paiement chez Stripe (le montant doit être en centimes : 5.90€ = 590)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true }, // Active les méthodes de paiement auto (Carte, Apple Pay, etc.)
      metadata: {
        userId: user.id, // On stocke l'ID de l'utilisateur pour le retrouver plus tard
        planName: planName,
      },
    });

    // 3. On renvoie le client_secret (le "ticket d'autorisation") dont le formulaire aura besoin
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Erreur API Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}