import Image from "next/image";
import Link from "next/link";
import { Code2 as Github, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const { projects } = await getPublicContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const t = dictionary[locale];
  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const content = locale === "fa" ? project.contentFa : project.contentEn;
  return <article className="pt-36 pb-24"><div className="container-shell"><Link href={`/${locale}/projects`} className="text-sm text-gray-300 hover:text-white">{t.back}</Link><h1 className="display-title mt-7">{title}</h1><div className="mt-6 flex flex-wrap gap-2">{project.technologies.split(",").map((item) => <span key={item} className="technology-tag rounded-full px-3 py-1 text-sm">{item.trim()}</span>)}</div><div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-900"><Image src={project.imageUrl} alt={title} fill className="object-cover object-top" sizes="100vw" priority /></div><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.35fr]"><div className="prose-content">{content.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><aside className="space-y-3">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button-primary w-full"><ExternalLink size={17} />{t.live}</a>}{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="button-secondary w-full"><Github size={17} />{t.source}</a>}</aside></div></div></article>;
}
