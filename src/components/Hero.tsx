import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-4">
      <div className="card">
        <div className="grid gap-8 hero-grid">
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <div className="pill-sand">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                  <circle cx="5" cy="5" r="5" fill="var(--color-mint)" />
                </svg>
                <span className="small-muted">10 000+ professionnels actifs</span>
              </div>
              <div className="text-xs small-muted">5 min / semaine • 100% personnalisé</div>
            </div>

            <h1 className="title-font text-3xl md:text-4xl leading-tight font-extrabold" style={{ color: "var(--color-forest)" }}>
              Arrêtez de chercher. <br />
              Commencez à lire.
            </h1>

            <p className="body-font small-muted">
              C'est simple, moderne — « Nous utilisons la tech (le carré) pour faire grandir des idées (la pousse) ».
              Niche vous livre l'essentiel de votre niche en 5 minutes, personnalisé par IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/signup" className="btn-primary inline-flex items-center justify-center">
                Commencer gratuitement
              </Link>
              <Link href="#features" className="btn-mint inline-flex items-center justify-center">
                Fonctionnalités
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="card small-muted">
                <div className="font-semibold" style={{ color: "var(--color-forest)" }}>5 min</div>
                <div className="small-muted">par semaine</div>
              </div>
              <div className="card small-muted">
                <div className="font-semibold" style={{ color: "var(--color-forest)" }}>50+</div>
                <div className="small-muted">niches</div>
              </div>
              <div className="card small-muted">
                <div className="font-semibold" style={{ color: "var(--color-forest)" }}>100%</div>
                <div className="small-muted">personnalisé</div>
              </div>
            </div>
          </div>

          {/* right preview */}
          <aside>
            <div className="rounded-xl overflow-hidden" style={{ padding: 2 }}>
              <div className="card card-sand" style={{ padding: "1rem" }}>
                <div className="text-xs small-muted">Aperçu de la newsletter</div>
                <h3 className="mt-2 font-semibold title-font">L'essentiel de la semaine</h3>
                <p className="mt-2 small-muted text-sm">Titres optimisés et résumé rapide pour rester informé en 5 minutes.</p>

                <ul className="mt-4 small-muted list-disc pl-5 space-y-1 text-sm">
                  <li>GPT-5 annoncé : les nouveautés</li>
                  <li>L'IA générative dans l'industrie : 3 cas d'usage</li>
                  <li>Régulation européenne : ce qui change en 2025</li>
                </ul>

                <div className="mt-4 flex items-center justify-between small-muted">
                  <div>5 min de lecture</div>
                  <a className="text-[var(--color-forest)]" href="#">Lire la suite →</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}