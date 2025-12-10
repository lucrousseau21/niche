import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="title-font text-3xl font-bold" style={{ color: 'var(--color-forest)' }}>À propos de Niche</h1>
        <p className="small-muted mt-4">Nous utilisons la tech (le carré) pour faire grandir des idées (la pousse). Niche est une application de veille conçue pour faire gagner du temps aux professionnels.</p>

        <section className="mt-6 grid gap-4">
          <div className="card">
            <h3 className="font-semibold">Notre mission</h3>
            <p className="small-muted mt-1">Fournir l'essentiel, personnalisé, en quelques minutes par semaine.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}