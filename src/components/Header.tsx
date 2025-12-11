import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-4">
        <div className="brand-square" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="4" fill="var(--color-forest)" />
            <path d="M8 14s1-3 4-3 4 3 4 3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M12 6v4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="logo-font text-lg font-semibold" style={{ color: 'var(--color-forest)' }}>Niche</div>
          <div className="text-xs small-muted">AI-powered content studio</div>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-4 text-sm">
        <Link href="#features" className="small-muted">Fonctionnalités</Link>
        <Link href="/about" className="small-muted">À propos</Link>
        <Link href="/pricing" className="small-muted">Tarifs</Link>
        <Link href="/signup" className="btn-primary">Essayer</Link>
      </nav>
    </header>
  );
}
