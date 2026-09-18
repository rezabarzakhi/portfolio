import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";
import { sanitizeArticleContent } from "@/lib/sanitize-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { posts } = await getPublicContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  const title = locale === "fa" ? post.seoTitleFa || post.titleFa : post.seoTitleEn || post.titleEn;
  const description = locale === "fa" ? post.seoDescriptionFa : post.seoDescriptionEn;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const ogUrl = locale === "fa" ? `${siteUrl}/fa/blog/${slug}` : `${siteUrl}/en/blog/${slug}`;
  const alternateLocale = locale === "fa" ? "en" : "fa";
  return {
    title,
    description,
    alternates: {
      ...(post.canonicalUrl ? { canonical: post.canonicalUrl } : { canonical: ogUrl }),
      languages: {
        fa: `${siteUrl}/fa/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
        "x-default": ogUrl,
      },
    },
    robots: { index: post.allowIndex, follow: post.allowIndex },
    openGraph: { title, description, type: "article", locale: locale === "fa" ? "fa_IR" : "en_US", alternateLocale: alternateLocale === "fa" ? "fa_IR" : "en_US", url: ogUrl, siteName: "Reza Barzakhi", images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og?title=${encodeURIComponent(title)}`] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { posts, setting } = await getPublicContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const t = dictionary[locale];
  const title = locale === "fa" ? post.titleFa : post.titleEn;
  const content = locale === "fa" ? post.contentFa : post.contentEn;
  const imageAlt = locale === "fa" ? post.imageAltFa || title : post.imageAltEn || title;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const url = `${siteUrl}/${locale}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: locale === "fa" ? post.seoDescriptionFa : post.seoDescriptionEn,
    image: [post.imageUrl, `${siteUrl}/og?title=${encodeURIComponent(title)}`],
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: setting.nameEn, url: siteUrl },
    publisher: { "@type": "Person", name: setting.nameEn },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return <article className="pt-36 pb-24"><JsonLd data={jsonLd} /><div className="mx-auto w-[min(100%-2rem,52rem)]"><div className="article-meta flex flex-wrap items-center gap-4"><Link href={`/${locale}/blog`} className="text-sm text-gray-300 hover:text-white">{t.back}</Link><p className="eyebrow">{locale === "fa" ? post.categoryFa : post.categoryEn}</p></div><h1 className="mt-8 text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>{post.publishedAt && <time className="mt-5 block text-sm text-gray-500">{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "long" }).format(post.publishedAt)}</time>}<div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={post.imageUrl} alt={imageAlt} fill className="object-cover" sizes="100vw" priority /></div><div className="prose-content mt-12" dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(content) }} /></div></article>;
}
