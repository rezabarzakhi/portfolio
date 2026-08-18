import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return {
    title,
    description,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    robots: { index: post.allowIndex, follow: post.allowIndex },
    openGraph: { title, description, type: "article", images: [post.imageUrl] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { posts } = await getPublicContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const t = dictionary[locale];
  const title = locale === "fa" ? post.titleFa : post.titleEn;
  const content = locale === "fa" ? post.contentFa : post.contentEn;
  const imageAlt = locale === "fa" ? post.imageAltFa || title : post.imageAltEn || title;
  return <article className="pt-36 pb-24"><div className="mx-auto w-[min(100%-2rem,52rem)]"><Link href={`/${locale}/blog`} className="text-sm text-gray-300 hover:text-white">{t.back}</Link><p className="eyebrow mt-8">{locale === "fa" ? post.categoryFa : post.categoryEn}</p><h1 className="text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>{post.publishedAt && <time className="mt-5 block text-sm text-gray-500">{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "long" }).format(post.publishedAt)}</time>}<div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={post.imageUrl} alt={imageAlt} fill className="object-cover" sizes="100vw" priority /></div><div className="prose-content mt-12" dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(content) }} /></div></article>;
}
