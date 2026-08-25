import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import type { Post, Project } from "@prisma/client";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/content";

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = dictionary[locale];
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  return (
    <article className="surface group overflow-hidden rounded-xl md:grid md:grid-cols-2">
      <div className="relative min-h-64 overflow-hidden bg-[#27374d] md:min-h-96">
        <Image
          src={project.imageUrl}
          alt={locale === "fa" ? project.titleFa : project.titleEn}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.split(",").map((technology) => (
            <span key={technology} className="technology-tag rounded-full px-3 py-1 text-xs">
              {technology.trim()}
            </span>
          ))}
        </div>
        <h3 className="mb-3 text-2xl font-bold">{locale === "fa" ? project.titleFa : project.titleEn}</h3>
        <p className="mb-6 leading-7 text-gray-400">{locale === "fa" ? project.summaryFa : project.summaryEn}</p>
        <Link href={`/${locale}/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-200 hover:text-white">
          {t.projectDetails} <Arrow size={17} />
        </Link>
      </div>
    </article>
  );
}

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const t = dictionary[locale];
  return (
    <article className="surface overflow-hidden rounded-2xl p-6 sm:p-7">
      <div className="mb-8 flex items-center justify-between gap-4 text-xs text-gray-500">
        <span className="text-gray-300">{locale === "fa" ? post.categoryFa : post.categoryEn}</span>
        {post.publishedAt && (
          <time>{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(post.publishedAt)}</time>
        )}
      </div>
      <h3 className="mb-3 text-xl font-bold leading-8">{locale === "fa" ? post.titleFa : post.titleEn}</h3>
      <p className="mb-6 line-clamp-3 leading-7 text-gray-400">{locale === "fa" ? post.excerptFa : post.excerptEn}</p>
      <Link href={`/${locale}/blog/${post.slug}`} className="text-sm font-bold text-gray-200 hover:text-white">
        {t.readMore}
      </Link>
    </article>
  );
}
