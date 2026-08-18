import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PostEditor } from "@/components/post-editor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return <main><AdminPageHeader title="ویرایش مقاله" description={post.titleFa} /><PostEditor post={post} /></main>;
}
