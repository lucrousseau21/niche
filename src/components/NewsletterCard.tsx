import React from "react";
import Link from "next/link"; 

interface NewsletterCardProps {
  id?: string;       // L'ID pour le lien (optionnel au cas où)
  category: string;  // Remplace 'id_sujet' pour l'affichage (ex: "IA", "Crypto")
  date: string;
  title: string;
  bullets: string[];
}

export default function NewsletterCard({
  id,
  category,
  date,
  title,
  bullets,
}: NewsletterCardProps) {
  return (
    <article className="relative bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden max-w-lg mx-auto w-full border border-gray-100">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#6366F1]"></div>

      {/* Header: Category Pill & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF9F0] text-[#004d40] text-sm font-medium border border-[#FFE0B2]">
          {/* Icone catégorie */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {/* Ici on affiche la catégorie passée en props */}
          {category}
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          {/* Icone calendrier */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{date}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[#004d40] mb-6 leading-tight">
        {title}
      </h3>

      {/* Bullets (Le résumé JSON affiché ici) */}
      <ul className="space-y-4 mb-8">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex gap-3 items-start">
            <span className="mt-2 min-w-[6px] h-[6px] rounded-full bg-[#6366F1] flex-shrink-0"></span>
            <span className="text-gray-600 leading-relaxed text-sm md:text-base">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer: Time & Link */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>5 min de lecture</span>
        </div>
        
        {/* Lien vers le détail */}
        <Link
          href={id ? `/newsletter/${id}` : "#"} 
          className="flex items-center gap-1 text-[#004d40] font-semibold text-sm hover:gap-2 transition-all"
        >
          Lire la suite
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}