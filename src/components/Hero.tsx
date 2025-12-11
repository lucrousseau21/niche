import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-8 md:pt-16 pb-12">
      <div className="grid lg:grid-cols-2 gap-12 items-end">
        {/* Left Content (Matches Mobile Design) */}
        <div className="flex flex-col gap-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          {/* Top Pill */}
          <div className="flex justify-center lg:justify-start">
            <div className="pill-white">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>10 000+ professionnels actifs</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="title-font text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-forest tracking-tight">
            Arrêtez de chercher. <br className="hidden sm:block" />
            Commencez à lire.
          </h1>

          {/* Subheadline */}
          <p className="body-font text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
            L&apos;application de veille intelligente qui vous livre
            l&apos;essentiel de votre niche en 5 minutes. Personnalisée par IA.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:ml-auto">
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
            <Link
              href="/signup"
              className="btn-primary w-full sm:w-auto text-lg h-14 px-8 rounded-xl"
            >
              Commencer gratuitement
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="stat-card">
              <div className="title-font text-2xl font-bold text-forest">
                5 min
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                par semaine
              </div>
            </div>
            <div className="stat-card">
              <div className="title-font text-2xl font-bold text-forest">
                50+
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                niches
              </div>
            </div>
            <div className="stat-card">
              <div className="title-font text-2xl font-bold text-forest">
                100%
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                personnalisé
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
