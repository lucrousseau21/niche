import Link from "next/link";
import React from "react";
import { Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FFFAF0] mt-16 px-6 pt-10 pb-6 text-[#2D3748] text-sm">
      
      {/* --- TOP : Logo + Social --- */}
      <div>
        <img
          src="/logo-niche.svg"
          alt="Niche."
          className="h-10 mb-2"
        />

        <p className="text-sm opacity-70 mb-4">L’expertise. Point.</p>

        <div className="text-sm text-[#4B5563] mb-8">
          Contactez-nous : <a href="mailto:contact@niche.fr" className="underline">contact@niche.fr</a>
        </div>
      </div>

      {/* --- GRID SECTION MOBILE → DESKTOP --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1 : Produit */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Produit</h4>

          <Link href="/#features" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Fonctionnalités
          </Link>
          <Link href="/pricing" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Tarifs
          </Link>
          <p className="flex items-center gap-2 mt-1 text-[#6B7280]">
            <Mail size={16} /> Niches disponibles
          </p>
        </div>

        {/* Col 2 : Entreprise */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Entreprise</h4>

          <Link href="/about" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> À propos
          </Link>
          <p className="flex items-center gap-2 mt-1 text-[#6B7280]">
            <Mail size={16} /> Blog (à venir)
          </p>
          <p className="flex items-center gap-2 mt-1 text-[#6B7280]">
            <Mail size={16} /> Carrières (à venir)
          </p>
        </div>

        {/* Col 3 : Légal */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Légal</h4>

          <p className="flex items-center gap-2 mt-1 text-[#6B7280]">
            <Mail size={16} /> Mentions légales
          </p>

          <Link href="/conf" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Confidentialité
          </Link>

          <Link href="/CGU" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> CGV
          </Link>
        </div>

      </div>

      {/* --- SEPARATOR --- */}
      <hr className="my-8 border-[#E5E7EB]" />

      {/* --- BOTTOM COPYRIGHT --- */}
      <div className="text-center text-xs opacity-70">
        © {new Date().getFullYear()} Niche. Tous droits réservés.
      </div>

      <div className="text-center flex justify-center items-center gap-2 mt-2">
        <Mail size={14} />
        <a href="mailto:contact@niche.fr" className="underline">
          contact@niche.fr
        </a>
      </div>

    </footer>
  );
}
