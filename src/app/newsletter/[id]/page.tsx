import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: recap } = await supabase
    .from("recap")
    .select("titre")
    .eq("id_recap", params.id)
    .single();

  const title = recap?.titre
    ? `Veille : ${recap.titre} | Niche.`
    : "Veille introuvable | Niche.";
  const description = recap?.titre
    ? `Accédez à l’analyse Niche de la veille \"${recap.titre}\" et suivez l'actualité stratégique personnalisée.`
    : "Cette veille n'a pas été trouvée.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://niche.fr/newsletter/${params.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recap, error } = await supabase
    .from("recap")
    .select("*")
    .eq("id_recap", id)
    .single();

  if (error || !recap) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#FFFDF7]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A3D3B] mb-4">
            Veille introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            Impossible de trouver cette veille. Elle a peut-être été supprimée.
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-[#1A3D3B] text-white rounded-xl font-medium hover:bg-[#153230] transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  // Helper date
  const dateStr = new Date(recap.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-[70px] pb-24 font-sans">
      <Header />
      {/* Header Block - Green */}
      <header className="bg-[#1A3D3B] text-white pt-8 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 font-sans">
          {/* Top Bar: Back & Tag/Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
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
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </Link>

            <div className="flex items-center gap-3">
              <span className="bg-[#4ADE80] text-[#1A3D3B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {recap.titre || "Actualité"}
              </span>
              <span className="text-white/60 text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
                📅 {dateStr}
              </span>
            </div>
          </div>

          {/* Title Section */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#F0FDF4] font-serif">
            L&apos;essentiel de la semaine – {recap.titre}
          </h1>
          <p className="text-lg md:text-xl text-[#A7F3D0] max-w-2xl leading-relaxed">
            3 infos sélectionnées par l&apos;IA et validées par un expert pour
            votre veille stratégique.
          </p>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </header>

      {/* Main Content Card */}
      <main className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_40px_rgba(0,0,0,0.06)] border border-gray-100/50">
          <div
            className="prose prose-lg prose-emerald max-w-none 
            prose-headings:font-serif prose-headings:text-[#1A3D3B] prose-headings:font-bold
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600
            prose-strong:text-[#1A3D3B] prose-strong:font-bold
            prose-a:text-[#10B981] prose-a:no-underline hover:prose-a:underline
            [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-6
            [&>ul>li]:marker:text-[#4ADE80] [&>ul>li]:marker:content-['●'] [&>ul>li]:pl-2
            "
          >
            <ReactMarkdown>
              {recap.contenu || "Contenu non disponible."}
            </ReactMarkdown>
          </div>

          {/* Source Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
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
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Source : Analyse générée par IA & curations diverses
          </div>
        </div>
      </main>
    </div>
  );
}
