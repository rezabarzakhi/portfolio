"use client";

import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/content";

export function ThemeToggle({ locale }: { locale: Locale }) {
  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  const label = locale === "fa" ? "تغییر حالت روشن و تیره" : "Toggle light and dark mode";

  return (
    <button
      type="button"
      className="grid size-10 place-items-center rounded-lg border border-white/10 text-gray-300 transition hover:border-gray-400 hover:text-white"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <Sun className="theme-dark-icon" size={18} />
      <Moon className="theme-light-icon" size={18} />
    </button>
  );
}
