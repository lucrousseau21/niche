"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Rss,
  ArrowLeft,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { DashboardThemeProvider, useDashboardTheme } from "./ThemeContext";

function DashboardHeader() {
  const pathname = usePathname();
  const { themePreference, setThemePreference, isDark } = useDashboardTheme();

  const navItems = [
    {
      href: "/dashboard",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/users",
      label: "Utilisateurs",
      icon: Users,
      exact: false,
    },
    {
      href: "/dashboard/topics-recaps",
      label: "Sujets & Récaps",
      icon: BookOpen,
      exact: false,
    },
    {
      href: "/dashboard/ingestion",
      label: "Ingestion RSS",
      icon: Rss,
      exact: false,
    },
  ];

  return (
    <header
      className={`border-b flex-none sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? "bg-[#111C28]/95 backdrop-blur-md border-[#223347]"
          : "bg-white/95 backdrop-blur-md border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Retour */}
        <div className="flex items-center gap-4 flex-none">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-medium transition ${
              isDark
                ? "text-slate-400 hover:text-emerald-400"
                : "text-gray-500 hover:text-[#1A3D3B]"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
          <div className={`h-5 w-px ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-xl tracking-tight ${
                isDark ? "text-white" : "text-[#1A3D3B]"
              }`}
            >
              Niche
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#1A3D3B]/10 text-[#1A3D3B]"
              }`}
            >
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Liens avec routes en anglais) */}
        <nav
          className={`flex items-center gap-1 p-1 rounded-xl transition ${
            isDark ? "bg-[#162332] border border-[#26374A]" : "bg-gray-100"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? isDark
                      ? "bg-[#22354A] text-emerald-400 shadow-sm"
                      : "bg-white text-[#1A3D3B] shadow-sm"
                    : isDark
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Selector (Auto appareil / Sombre / Clair) */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs font-medium transition flex-none ${
            isDark
              ? "bg-[#162332] border-[#26374A] text-slate-400"
              : "bg-gray-100 border-gray-200 text-gray-500"
          }`}
          title="Thème du dashboard (par défaut synchronisé avec votre appareil)"
        >
          <button
            onClick={() => setThemePreference("auto")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
              themePreference === "auto"
                ? isDark
                  ? "bg-[#22354A] text-emerald-400 font-semibold shadow-xs"
                  : "bg-white text-[#1A3D3B] font-semibold shadow-xs"
                : "hover:text-gray-900 dark:hover:text-white"
            }`}
            title="Mode automatique : suit le thème de votre appareil"
          >
            <Laptop className="w-3.5 h-3.5" />
            Auto
          </button>

          <button
            onClick={() => setThemePreference("dark")}
            className={`p-1.5 rounded-lg transition ${
              themePreference === "dark"
                ? "bg-[#22354A] text-emerald-400 shadow-xs"
                : "hover:text-gray-900 dark:hover:text-white"
            }`}
            title="Forcer le mode sombre"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setThemePreference("light")}
            className={`p-1.5 rounded-lg transition ${
              themePreference === "light"
                ? "bg-white text-[#1A3D3B] shadow-xs"
                : "hover:text-gray-900 dark:hover:text-white"
            }`}
            title="Forcer le mode clair"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useDashboardTheme();

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col font-sans transition-colors duration-200 ${
        isDark ? "bg-[#0B131E] text-slate-100" : "bg-[#FBFBFA] text-gray-900"
      }`}
    >
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-4 flex-1 min-h-0 w-full flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardThemeProvider>
  );
}
