import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { projects } = await getPublicContent();
  const t = dictionary[locale];
  return <><PageHero eyebrow={t.projectsLabel} title={t.projectsTitle} /><section className="section-space"><div className="container-shell grid gap-7">{projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} locale={locale} />) : <p className="muted">{t.noItems}</p>}</div></section></>;
}
