import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/content-cards";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale, sectionMetadata } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictionary[locale];
  return sectionMetadata(locale, "blog", t.blogTitle, t.blogDescription);
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { posts } = await getPublicContent();
  const t = dictionary[locale];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const jsonLd = buildBreadcrumbJsonLd(siteUrl, [
    { name: t.nav.home, path: `/${locale}` },
    { name: t.blogTitle, path: `/${locale}/blog` },
  ]);
  return <><JsonLd data={jsonLd} /><PageHero eyebrow={t.blogLabel} title={t.blogTitle} /><section className="section-space"><div className="container-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.length ? posts.map((post) => <PostCard key={post.id} post={post} locale={locale} />) : <p className="muted">{t.noItems}</p>}</div></section></>;
}
