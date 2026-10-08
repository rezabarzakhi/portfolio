import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/content-cards";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale, sectionMetadata } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictionary[locale];
  return sectionMetadata(locale, "projects", t.projectsTitle, t.projectsDescription);
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { projects } = await getPublicContent();
  const t = dictionary[locale];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const jsonLd = buildBreadcrumbJsonLd(siteUrl, [
    { name: t.nav.home, path: `/${locale}` },
    { name: t.projectsTitle, path: `/${locale}/projects` },
  ]);
  return <><JsonLd data={jsonLd} /><PageHero eyebrow={t.projectsLabel} title={t.projectsTitle} /><section className="section-space"><div className="container-shell grid gap-7">{projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} locale={locale} />) : <p className="muted">{t.noItems}</p>}</div></section></>;
}
