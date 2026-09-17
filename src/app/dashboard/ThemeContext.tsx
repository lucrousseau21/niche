"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemePreference = "auto" | "dark" | "light";

interface DashboardThemeContextType {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  isDark: boolean;
}

const DashboardThemeContext = createContext<DashboardThemeContextType>({
  themePreference: "auto",
  setThemePreference: () => {},
  isDark: false,
});

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("auto");
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("niche_dashboard_theme") as ThemePreference | null;
    if (saved && (saved === "auto" || saved === "dark" || saved === "light")) {
      setThemePreferenceState(saved);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem("niche_dashboard_theme", pref);
    } catch {}
  };

  const isDark = themePreference === "auto" ? systemIsDark : themePreference === "dark";

  return (
    <DashboardThemeContext.Provider value={{ themePreference, setThemePreference, isDark }}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
