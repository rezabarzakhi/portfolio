import { notFound } from "next/navigation";
import { PostCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { posts } = await getPublicContent();
  const t = dictionary[locale];
  return <><PageHero eyebrow={t.blogLabel} title={t.blogTitle} /><section className="section-space"><div className="container-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.length ? posts.map((post) => <PostCard key={post.id} post={post} locale={locale} />) : <p className="muted">{t.noItems}</p>}</div></section></>;
}
