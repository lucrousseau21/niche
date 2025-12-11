import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 text-xs small-muted">
      <div className="flex items-center justify-between">
        <div>© {new Date().getFullYear()} Niche. Tous droits réservés.</div>
        <div className="flex gap-4">
          <Link href="/conf" className="small-muted">
            Politique de confidentialité
          </Link>

          <Link href="/CGU" className="small-muted">
            CGU
          </Link>
        </div>
      </div>
    </footer>
  );
}
