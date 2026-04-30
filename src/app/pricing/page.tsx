import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarifs | Niche.",
  description:
    "Comparez les offres Niche pour démarrer votre veille sectorielle, de l'essai gratuit à l'abonnement entreprise.",
};

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="title-font text-3xl font-bold" style={{ color: 'var(--color-forest)' }}>Tarifs</h1>
        <p className="small-muted mt-2">Commencez gratuitement, passez pro quand vous êtes prêts.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="font-semibold">Starter</h3>
            <div className="mt-3 text-2xl font-bold">Gratuit</div>
            <p className="small-muted mt-2">Pour les essais et solo creators.</p>
            <Link href="/signup" className="btn-primary mt-4 inline-block">Commencer</Link>
          </div>

          <div className="card">
            <h3 className="font-semibold">Pro</h3>
            <div className="mt-3 text-2xl font-bold">€29<span className="text-sm font-normal">/mois</span></div>
            <p className="small-muted mt-2">Pour les équipes.</p>
            <Link href="/signup" className="btn-mint mt-4 inline-block">Essayer Pro</Link>
          </div>

          <div className="card">
            <h3 className="font-semibold">Entreprise</h3>
            <div className="mt-3 text-2xl font-bold">Sur devis</div>
            <p className="small-muted mt-2">SSO, intégrations et SLA.</p>
            <a href="mailto:sales@niche.example" className="btn-primary mt-4 inline-block">Contactez-nous</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}