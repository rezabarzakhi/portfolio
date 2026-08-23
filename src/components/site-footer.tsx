import Link from "next/link";
import Image from "next/image";
import { Camera, Code2, MessageCircle, Send } from "lucide-react";
import type { SiteSetting } from "@prisma/client";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/content";

export function SocialLinks({ setting }: { setting: SiteSetting }) {
  const links = [
    [setting.githubUrl, Code2, "GitHub"],
    [setting.instagramUrl, Camera, "Instagram"],
    [setting.telegramUrl, Send, "Telegram"],
    [setting.twitterUrl, MessageCircle, "X"],
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([href, Icon, label]) =>
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-lg border border-white/10 text-gray-400 transition hover:border-gray-400 hover:text-white"
          >
            <Icon size={18} />
          </a>
        ) : null,
      )}
    </div>
  );
}

export function SiteFooter({ locale, setting }: { locale: Locale; setting: SiteSetting }) {
  const t = dictionary[locale];
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href={`/${locale}`} className="font-black">
          {setting.logoUrl ? <Image src={setting.logoUrl} alt="" width={128} height={40} className="h-8 w-auto object-contain" /> : <>&lt;<span className="text-gray-300">RB</span>/&gt;</>}
        </Link>
        <p className="text-sm text-gray-500">{t.footer} · {new Date().getFullYear()}</p>
        <SocialLinks setting={setting} />
      </div>
    </footer>
  );
}
