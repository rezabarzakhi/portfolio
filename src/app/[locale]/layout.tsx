import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
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
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${locale === "fa" ? setting.nameFa : setting.nameEn}` },
    description,
    alternates: { languages: { fa: "/fa", en: "/en" } },
    icons: { icon: setting.faviconUrl || "/default-mark.svg" },
    openGraph: { title, description, type: "website", locale: locale === "fa" ? "fa_IR" : "en_US", images: [setting.heroImage] },
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
        <div className="site-shell" dir={locale === "fa" ? "rtl" : "ltr"}>
          <SiteHeader locale={locale} logoUrl={setting.logoUrl} />
          <main>{children}</main>
          <SiteFooter locale={locale} setting={setting} />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
