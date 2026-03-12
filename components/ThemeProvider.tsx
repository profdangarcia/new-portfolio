"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Theme } from "@/app/actions/theme";
import { setThemeCookie } from "@/app/actions/theme";

type ResolvedTheme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
} | null>(null);

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  // Sempre inicializar com valor que bate no server e no client (evita hydration mismatch).
  // Para "system" usamos "light" no primeiro render; o useEffect aplica o valor real depois.
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    initialTheme === "system" ? "light" : initialTheme
  );

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(newTheme === "system" ? resolveTheme("system") : newTheme);
    setThemeCookie(newTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  // No primeiro mount, se o tema for "system", resolver no client para evitar mismatch.
  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(resolveTheme("system"));
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setResolvedTheme(resolveTheme("system"));
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
