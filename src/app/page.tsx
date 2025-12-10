// src/app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import NewsletterCard from "@/components/NewsletterCard";
import Footer from "@/components/Footer";

export default function Home() {
  const features = [
    ["IA Personnalisée", "Notre IA adapte le contenu à votre niveau et vos préférences pour une expérience sur-mesure.", "🧠"],
    ["Dashboard Intuitif", "Suivez votre progression, organisez vos sujets favoris et accédez à votre historique.", "📊"],
    ["Base de Connaissances", "Recherchez vos newsletters passées avec notre moteur intelligent.", "📚"],
    ["Gain de Temps", "5 minutes par semaine au lieu de plusieurs heures.", "⏱️"],
    ["Notifications Smart", "Recevez uniquement les alertes importantes sur vos sujets.", "🔔"],
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pb-24">
        <Hero />

        <section id="features" className="mt-8">
          <div className="mb-4">
            <div className="pill"><svg width="14" height="14" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="var(--color-mint)"/></svg><span className="small-muted">Fonctionnalités</span></div>
            <h2 className="title-font text-2xl font-bold mt-3" style={{ color: 'var(--color-forest)' }}>Une veille intelligente et efficace</h2>
            <p className="small-muted mt-1">Tout ce dont vous avez besoin pour rester à la pointe de votre domaine.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map(([t, d, i]) => (
              <FeatureCard key={t as string} title={t as string} desc={d as string} icon={i as string} />
            ))}
          </div>
        </section>

        <section id="preview" className="mt-10">
          <div className="mb-3">
            <div className="pill"><svg width="14" height="14" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#EDEFFF"/></svg><span className="small-muted">Aperçu de l'application</span></div>
            <h3 className="title-font text-2xl font-bold mt-3" style={{ color: 'var(--color-forest)' }}>Découvrez vos newsletters</h3>
            <p className="small-muted mt-1">Voici à quoi ressemble votre veille hebdomadaire, personnalisée selon vos niches.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <NewsletterCard
              category="Intelligence Artificielle"
              date="9 Déc 2025"
              title="L'essentiel de la semaine"
              bullets={[
                "GPT-5 annoncé : les nouveautés qui changent tout",
                "L'IA générative dans l'industrie : 3 cas d'usage",
                "Régulation européenne : ce qui change en 2025",
              ]}
            />
          </div>
        </section>

        <section id="cta" className="mt-10">
          <div style={{ background: 'linear-gradient(135deg, var(--color-forest), var(--color-mint))' }} className="rounded-xl p-1">
            <div className="rounded-lg p-6" style={{ background: 'var(--card-bg)' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="title-font text-xl font-bold" style={{ color: 'var(--color-forest)' }}>Prêt à accélérer votre veille ?</div>
                  <div className="small-muted mt-1">Essayez gratuitement — aucune carte requise.</div>
                </div>
                <div className="flex gap-3">
                  <a href="/signup" className="btn-primary">Démarrer maintenant</a>
                  <a href="/pricing" className="btn-mint">En savoir plus</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}