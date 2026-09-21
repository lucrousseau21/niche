"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact: boolean;
}

function DashboardNavTabs({
  isDark,
  pathname,
}: {
  isDark: boolean;
  pathname: string;
}) {
  const navItems: NavItem[] = useMemo(
    () => [
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
    ],
    []
  );

  // L'onglet actif est strictement synchronisé avec la route réelle (pathname)
  // pour que l'animation de la pastille se déclenche exactement au moment où le contenu change
  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    );
    return idx >= 0 ? idx : 0;
  }, [navItems, pathname]);

  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitial = useRef(true);

  useEffect(() => {
    const updatePill = () => {
      const activeEl = tabRefs.current[activeIndex];
      if (activeEl && navRef.current) {
        setPillStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
        });

        if (!isReady) {
          setIsReady(true);
          requestAnimationFrame(() => {
            isInitial.current = false;
          });
        }
      }
    };

    updatePill();

    const handleResize = () => updatePill();
    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | null = null;
    if (navRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updatePill);
      ro.observe(navRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ro) ro.disconnect();
    };
  }, [activeIndex, isReady]);

  return (
    <nav
      ref={navRef}
      className={`relative flex items-center gap-1 p-1 rounded-xl transition-colors duration-200 ${
        isDark ? "bg-[#162332] border border-[#26374A]" : "bg-gray-100"
      }`}
    >
      {/* Pastille glissante avec physique de ressort (spring physics) */}
      {pillStyle && (
        <span
          aria-hidden="true"
          className={`absolute rounded-lg pointer-events-none ${
            isDark
              ? "bg-[#22354A] shadow-sm"
              : "bg-white shadow-sm"
          }`}
          style={{
            top: 0,
            left: 0,
            transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
            width: `${pillStyle.width}px`,
            height: `${pillStyle.height}px`,
            transition: isInitial.current
              ? "none"
              : "transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1), width 340ms cubic-bezier(0.34, 1.15, 0.64, 1), height 300ms ease",
            willChange: "transform, width",
          }}
        />
      )}

      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === activeIndex;

        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`relative z-10 cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 select-none active:scale-[0.98] ${
              // Fallback statique avant hydratation pour éviter tout flash visuel
              !isReady && isActive
                ? isDark
                  ? "bg-[#22354A] text-emerald-400 shadow-sm"
                  : "bg-white text-[#1A3D3B] shadow-sm"
                : isActive
                ? isDark
                  ? "text-emerald-400"
                  : "text-[#1A3D3B]"
                : isDark
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4 flex-none" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function DashboardThemeToggle({
  themePreference,
  setThemePreference,
  isDark,
}: {
  themePreference: "auto" | "dark" | "light";
  setThemePreference: (pref: "auto" | "dark" | "light") => void;
  isDark: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitial = useRef(true);

  useEffect(() => {
    const activeEl = btnRefs.current[themePreference];
    if (activeEl && containerRef.current) {
      setPillStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
      });

      if (!isReady) {
        setIsReady(true);
        requestAnimationFrame(() => {
          isInitial.current = false;
        });
      }
    }
  }, [themePreference, isReady]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center p-1 rounded-xl border text-xs font-medium transition-colors duration-200 flex-none ${
        isDark
          ? "bg-[#162332] border-[#26374A] text-slate-400"
          : "bg-gray-100 border-gray-200 text-gray-500"
      }`}
      title="Thème du dashboard (par défaut synchronisé avec votre appareil)"
    >
      {pillStyle && (
        <span
          aria-hidden="true"
          className={`absolute rounded-lg pointer-events-none ${
            isDark
              ? "bg-[#22354A] shadow-xs"
              : "bg-white shadow-xs"
          }`}
          style={{
            top: 0,
            left: 0,
            transform: `translate3d(${pillStyle.left}px, ${pillStyle.top}px, 0)`,
            width: `${pillStyle.width}px`,
            height: `${pillStyle.height}px`,
            transition: isInitial.current
              ? "none"
              : "transform 400ms cubic-bezier(0.34, 1.35, 0.64, 1), width 320ms cubic-bezier(0.34, 1.15, 0.64, 1)",
            willChange: "transform, width",
          }}
        />
      )}

      <button
        ref={(el) => {
          btnRefs.current["auto"] = el;
        }}
        onClick={() => setThemePreference("auto")}
        className={`relative z-10 cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors duration-200 ${
          !isReady && themePreference === "auto"
            ? isDark
              ? "bg-[#22354A] text-emerald-400 font-semibold shadow-xs"
              : "bg-white text-[#1A3D3B] font-semibold shadow-xs"
            : themePreference === "auto"
            ? isDark
              ? "text-emerald-400 font-semibold"
              : "text-[#1A3D3B] font-semibold"
            : isDark
            ? "text-slate-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="Mode automatique : suit le thème de votre appareil"
      >
        <Laptop className="w-3.5 h-3.5" />
        <span>Auto</span>
      </button>

      <button
        ref={(el) => {
          btnRefs.current["dark"] = el;
        }}
        onClick={() => setThemePreference("dark")}
        className={`relative z-10 cursor-pointer p-1.5 rounded-lg transition-colors duration-200 ${
          !isReady && themePreference === "dark"
            ? isDark
              ? "bg-[#22354A] text-emerald-400 shadow-xs"
              : "bg-gray-800 text-white shadow-xs"
            : themePreference === "dark"
            ? isDark
              ? "text-emerald-400"
              : "text-gray-900"
            : isDark
            ? "text-slate-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="Forcer le mode sombre"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        ref={(el) => {
          btnRefs.current["light"] = el;
        }}
        onClick={() => setThemePreference("light")}
        className={`relative z-10 cursor-pointer p-1.5 rounded-lg transition-colors duration-200 ${
          !isReady && themePreference === "light"
            ? "bg-white text-[#1A3D3B] shadow-xs"
            : themePreference === "light"
            ? "text-[#1A3D3B]"
            : isDark
            ? "text-slate-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="Forcer le mode clair"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function DashboardHeader() {
  const pathname = usePathname();
  const { themePreference, setThemePreference, isDark } = useDashboardTheme();

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

        {/* Navigation Tabs avec animation de ressort (sliding pill) */}
        <DashboardNavTabs isDark={isDark} pathname={pathname} />

        {/* Theme Selector avec animation de ressort */}
        <DashboardThemeToggle
          themePreference={themePreference}
          setThemePreference={setThemePreference}
          isDark={isDark}
        />
      </div>
    </header>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useDashboardTheme();
  const pathname = usePathname();

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col font-sans transition-colors duration-200 ${
        isDark ? "bg-[#0B131E] text-slate-100" : "bg-[#FBFBFA] text-gray-900"
      }`}
    >
      <DashboardHeader />
      <main
        key={pathname}
        className="dashboard-page-enter max-w-7xl mx-auto px-6 py-4 flex-1 min-h-0 w-full flex flex-col overflow-hidden"
      >
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
