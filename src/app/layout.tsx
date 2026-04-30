import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niche.fr"),
  title: {
    default: "Niche. | Veille stratégique intelligente",
    template: "%s | Niche.",
  },
  description:
    "Niche aide les professionnels à suivre l’actualité sectorielle avec une veille personnalisée, une newsletter intelligente et un tableau de bord de tendances.",
  keywords: [
    "veille stratégique",
    "newsletter intelligente",
    "curation IA",
    "suivi d'actualité",
    "Niche",
    "veille professionnelle",
  ],
  themeColor: "#134E4A",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://niche.fr",
  },
  openGraph: {
    title: "Niche. | Veille stratégique intelligente",
    description:
      "Niche aide les professionnels à suivre l’actualité sectorielle avec une veille personnalisée, une newsletter intelligente et un tableau de bord de tendances.",
    url: "https://niche.fr",
    siteName: "Niche.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/NICHE_LOGO.png",
        width: 1200,
        height: 630,
        alt: "Logo Niche - veille stratégique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Niche. | Veille stratégique intelligente",
    description:
      "Niche aide les professionnels à suivre l’actualité sectorielle avec une veille personnalisée, une newsletter intelligente et un tableau de bord de tendances.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MT24F9CTRC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MT24F9CTRC');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
