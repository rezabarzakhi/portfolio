import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Code2 as Github, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { projects } = await getPublicContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const summary = locale === "fa" ? project.summaryFa : project.summaryEn;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const ogUrl = `${siteUrl}/${locale}/projects/${slug}`;
  const alternateLocale = locale === "fa" ? "en" : "fa";
  return {
    title,
    description: summary,
    alternates: {
      canonical: ogUrl,
      languages: {
        fa: `${siteUrl}/fa/projects/${slug}`,
        en: `${siteUrl}/en/projects/${slug}`,
        "x-default": ogUrl,
      },
    },
    openGraph: { title, description: summary, type: "website", locale: locale === "fa" ? "fa_IR" : "en_US", alternateLocale: alternateLocale === "fa" ? "fa_IR" : "en_US", url: ogUrl, siteName: "Reza Barzakhi", images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: summary, images: [`${siteUrl}/og?title=${encodeURIComponent(title)}`] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { projects, setting } = await getPublicContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const t = dictionary[locale];
  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const content = locale === "fa" ? project.contentFa : project.contentEn;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const url = `${siteUrl}/${locale}/projects/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: locale === "fa" ? project.summaryFa : project.summaryEn,
    image: project.imageUrl,
    url,
    dateCreated: project.completedAt?.toISOString(),
    creator: { "@type": "Person", name: setting.nameEn, url: siteUrl },
    ...(project.repositoryUrl ? { codeRepository: project.repositoryUrl } : {}),
  };
  return <article className="pt-36 pb-24"><JsonLd data={jsonLd} /><div className="container-shell"><Link href={`/${locale}/projects`} className="text-sm text-gray-300 hover:text-white">{t.back}</Link><h1 className="display-title mt-7">{title}</h1><div className="mt-6 flex flex-wrap gap-2">{project.technologies.split(",").map((item) => <span key={item} className="technology-tag rounded-full px-3 py-1 text-sm">{item.trim()}</span>)}</div><div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-900"><Image src={project.imageUrl} alt={title} fill className="object-cover object-top" sizes="100vw" priority /></div><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.35fr]"><div className="prose-content">{content.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside className="space-y-3">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button-primary w-full"><ExternalLink size={17} />{t.live}</a>}{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="button-secondary w-full"><Github size={17} />{t.source}</a>}</aside></div></div></article>;
}