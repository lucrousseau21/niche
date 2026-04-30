import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import { getArticleBySlug, getAllArticles } from "@/lib/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable | Niche." };
  }

  return {
    title: `${article.title} | Niche.`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://niche.fr/blog/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const dateStr = new Date(article.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-[70px] pb-24 font-sans">
      <Header />

      {/* Header vert */}
      <header className="bg-[#1A3D3B] text-white pt-8 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Link
              href="/#features"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </Link>

            <div className="flex items-center gap-3">
              <span className="bg-[#4ADE80] text-[#1A3D3B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-white/60 text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
                📅 {dateStr}
              </span>
              <span className="text-white/60 text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
                ⏱ {article.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#F0FDF4] font-serif">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl text-[#A7F3D0] max-w-2xl leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </header>

      {/* Contenu */}
      <main className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_40px_rgba(0,0,0,0.06)] border border-gray-100/50">
          <div
            className="prose prose-lg prose-emerald max-w-none
            prose-headings:font-serif prose-headings:text-[#1A3D3B] prose-headings:font-bold
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600
            prose-strong:text-[#1A3D3B] prose-strong:font-bold
            prose-a:text-[#10B981] prose-a:no-underline hover:prose-a:underline
            prose-table:text-sm
            prose-th:text-[#1A3D3B] prose-th:font-bold
            [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4
            [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3
            [&>ul>li]:marker:text-[#4ADE80]
          "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Contenu vérifié par l&apos;équipe Niche
            </div>
            <Link
              href="/#features"
              className="text-sm text-[#1A3D3B] font-semibold hover:underline"
            >
              ← Voir toutes les fonctionnalités
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
