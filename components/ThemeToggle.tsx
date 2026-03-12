"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="focus-ring rounded p-1 transition-opacity hover:opacity-80"
      aria-label={resolvedTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-5 text-[var(--text-title)]" />
      ) : (
        <Moon className="size-5 text-[var(--text-title)]" />
      )}
    </button>
  );
}
