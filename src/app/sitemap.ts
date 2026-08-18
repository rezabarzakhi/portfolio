import type { MetadataRoute } from "next";
import { getPublicContent, locales } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezabarzakhi.ir";
  const { projects, posts } = await getPublicContent();
  const staticPaths = ["", "/about", "/projects", "/blog", "/resume", "/contact"];
  return locales.flatMap((locale) => [
    ...staticPaths.map((path) => ({ url: `${base}/${locale}${path}`, lastModified: new Date() })),
    ...projects.map((project) => ({ url: `${base}/${locale}/projects/${project.slug}`, lastModified: project.updatedAt })),
    ...posts.map((post) => ({ url: `${base}/${locale}/blog/${post.slug}`, lastModified: post.updatedAt })),
  ]);
}
