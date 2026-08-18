import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { deletePost } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
  return <main><AdminPageHeader title="مقاله‌ها" description="مدیریت نوشته‌های فارسی و انگلیسی و وضعیت انتشار" action={<Link href="/admin/posts/new" className="button-primary"><Plus size={17} />مقاله جدید</Link>} />
    <div className="surface overflow-hidden rounded-2xl"><div className="hidden grid-cols-[1fr_9rem_8rem_7rem] gap-4 border-b border-white/10 px-5 py-4 text-xs text-gray-500 md:grid"><span>عنوان</span><span>دسته‌بندی</span><span>وضعیت</span><span>عملیات</span></div>{posts.length ? <div className="divide-y divide-white/10">{posts.map((post) => <article key={post.id} className="grid gap-4 p-5 md:grid-cols-[1fr_9rem_8rem_7rem] md:items-center"><div><h2 className="font-bold">{post.titleFa}</h2><p className="mt-1 text-xs text-gray-600">/{post.slug}</p></div><span className="text-sm text-gray-400">{post.categoryFa}</span><span className={`text-sm ${post.published ? "text-emerald-400" : "text-amber-400"}`}>{post.published ? "منتشرشده" : "پیش‌نویس"}</span><div className="flex gap-3"><Link href={`/admin/posts/${post.id}`} className="text-sky-400" title="ویرایش"><Edit3 size={18} /></Link><form action={deletePost}><input type="hidden" name="id" value={post.id} /><button className="text-red-400" title="حذف"><Trash2 size={18} /></button></form></div></article>)}</div> : <div className="p-10 text-center text-gray-500">هنوز مقاله‌ای ایجاد نشده است.</div>}</div>
  </main>;
}
