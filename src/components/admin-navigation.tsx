"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, FileText, Gauge, Inbox, Settings, Sparkles, UserRound } from "lucide-react";

const links = [
  { href: "/admin", label: "پیشخوان", icon: Gauge },
  { href: "/admin/profile", label: "اطلاعات اصلی", icon: Settings },
  { href: "/admin/skills", label: "مهارت‌ها", icon: Sparkles },
  { href: "/admin/projects", label: "نمونه‌کارها", icon: BriefcaseBusiness },
  { href: "/admin/posts", label: "مقاله‌ها", icon: FileText },
  { href: "/admin/resume", label: "رزومه", icon: UserRound },
  { href: "/admin/messages", label: "پیام‌ها", icon: Inbox },
];

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto p-3 lg:sticky lg:top-6 lg:grid lg:overflow-visible lg:p-0" aria-label="بخش‌های مدیریت">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#526d82]/40 text-[#dde6ed]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <Icon size={18} />{label}
          </Link>
        );
      })}
    </nav>
  );
}
