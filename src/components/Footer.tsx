import Link from "next/link";
import React from "react";
import { Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FFFAF0] mt-16 px-6 pt-10 pb-6 text-[#2D3748] text-sm">
      {/* --- TOP : Logo + Social --- */}
      <div>
        <img
          src="/NICHE_LOGO.png"
          alt="Niche Logo"
          className="h-10 w-auto mb-2 object-contain"
        />

        <p className="text-sm opacity-70 mb-4">L’expertise. Point.</p>

        <div className="flex gap-4 mb-8">
          <Link
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-[#E5E7EB]"
          >
            <Instagram size={18} />
          </Link>

          <Link
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-[#E5E7EB]"
          >
            <Facebook size={18} />
          </Link>
        </div>
      </div>

      {/* --- GRID SECTION MOBILE → DESKTOP --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 : Produit */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Produit</h4>

          <h5 className="font-semibold mt-4 mb-1">Fonctionnalités</h5>

          <h5 className="font-semibold mt-4 mb-1">Tarifs</h5>
          <Link href="#" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Niches disponibles
          </Link>
        </div>

        {/* Col 2 : Entreprise */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Entreprise</h4>

          <Link href="#" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> À propos
          </Link>
          <Link href="#" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Blog
          </Link>
          <Link href="#" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Carrières
          </Link>
        </div>

        {/* Col 3 : Légal */}
        <div>
          <h4 className="text-[#134E4A] font-semibold mb-2">Légal</h4>

          <Link href="#" className="flex items-center gap-2 mt-1">
            <Mail size={16} /> Mentions légales
          </Link>

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
