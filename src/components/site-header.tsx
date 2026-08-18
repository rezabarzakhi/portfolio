"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/content";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = dictionary[locale];
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const alternatePath = pathname.replace(/^\/(fa|en)/, `/${alternateLocale}/`);
  const nav = [
    [t.nav.about, `/${locale}/about`],
    [t.nav.projects, `/${locale}/projects`],
    [t.nav.blog, `/${locale}/blog`],
    [t.nav.resume, `/${locale}/resume`],
    [t.nav.contact, `/${locale}/contact`],
  ];

  return (
    <header className="theme-header fixed inset-x-0 top-0 z-50 border-b border-white/5 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-black tracking-tight" aria-label={t.nav.home}>
          &lt;<span className="text-gray-300">RB</span>/&gt;
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-gray-300 lg:flex" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition-colors hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle locale={locale} />
          <Link href={alternatePath} className="button-secondary min-h-10 px-3 text-xs">
            {t.languageName}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border border-white/10 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-shell grid gap-1 border-t border-white/5 py-4 lg:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
