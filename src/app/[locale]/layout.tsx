import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { BackToTop } from "@/components/back-to-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastContainer } from "@/components/toast";
import { getPublicContent, isLocale } from "@/lib/content";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

type LayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { setting } = await getPublicContent();
  const title = locale === "fa" ? `${setting.nameFa} | ${setting.roleFa}` : `${setting.nameEn} | ${setting.roleEn}`;
  const description = locale === "fa" ? setting.seoDescriptionFa : setting.seoDescriptionEn;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const ogImage = `${siteUrl}/og?title=${encodeURIComponent(locale === "fa" ? setting.nameFa : setting.nameEn)}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${locale === "fa" ? setting.nameFa : setting.nameEn}` },
    description,
    alternates: {
      canonical: "/",
      languages: { fa: "/fa", en: "/en", "x-default": "/fa" },
    },
    icons: { icon: setting.faviconUrl || "/default-mark.svg" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      url: `/${locale}`,
      siteName: setting.nameEn,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { setting } = await getPublicContent();
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={vazirmatn.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark'}catch(e){document.documentElement.dataset.theme='dark'}" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#526d82] focus:px-4 focus:py-2 focus:text-white">پرش به محتوای اصلی</a>
        <div className="site-shell" dir={locale === "fa" ? "rtl" : "ltr"}>
          <SiteHeader locale={locale} logoUrl={setting.logoUrl} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} setting={setting} />
        </div>
        <BackToTop />
        <ToastContainer />
      </body>
    </html>
  );
}
