import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { dictionary } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { sanitizeArticleContent } from "@/lib/sanitize-content";

export const dynamic = "force-dynamic";

export default async function PostPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  const fa = post.contentFa;
  const en = post.contentEn;
  const title = post.titleFa ?? post.titleEn;
  const imageAlt = post.imageAltFa || title;
  return <main className="grid gap-6"><AdminPageHeader title="پیش‌نمایش مقاله" description={title} action={<Link href={`/admin/posts/${post.id}`} className="button-secondary"><Eye size={17} />بازگشت به ویرایش</Link>} /><div className="rounded-2xl border border-white/10 bg-[#1a2332]/60 p-6"><div className="mx-auto w-[min(100%-1rem,52rem)]"><p className="eyebrow">{post.categoryFa}</p><h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>{post.publishedAt && <time className="mt-4 block text-sm text-gray-500">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(post.publishedAt)}</time>}<div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={post.imageUrl} alt={imageAlt} fill className="object-cover" sizes="100vw" /></div><div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(fa) }} /></div></div><div className="rounded-2xl border border-white/10 bg-[#1a2332]/60 p-6"><p className="mb-4 text-xs text-gray-500">نسخه انگلیسی ({dictionary.en.footer})</p><div className="mx-auto w-[min(100%-1rem,52rem)]"><div>{en.split("\n\n").filter(Boolean).map((paragraph) => <p key={paragraph} className="mb-4 leading-8 text-gray-400">{paragraph}</p>)}</div></div></div></main>;
}