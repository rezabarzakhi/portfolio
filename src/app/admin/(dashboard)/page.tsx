import Link from "next/link";
import { BriefcaseBusiness, FileText, Inbox, Sparkles } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [projects, posts, skills, unreadMessages, latestMessages] = await Promise.all([
    prisma.project.count(), prisma.post.count(), prisma.skill.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    ["نمونه‌کارها", projects, "/admin/projects", BriefcaseBusiness],
    ["مقاله‌ها", posts, "/admin/posts", FileText],
    ["مهارت‌ها", skills, "/admin/skills", Sparkles],
    ["پیام‌های خوانده‌نشده", unreadMessages, "/admin/messages", Inbox],
  ] as const;
  return <main><AdminPageHeader title="پیشخوان" description="نمای کلی محتوای وب‌سایت و دسترسی سریع به بخش‌های مدیریت" action={<Link href="/admin/posts/new" className="button-primary">مقاله جدید</Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, count, href, Icon]) => <Link key={href} href={href} className="surface rounded-2xl p-5 transition hover:-translate-y-1"><Icon className="mb-5 text-sky-400" size={23} /><strong className="block text-3xl">{count}</strong><span className="mt-2 block text-sm text-gray-500">{label}</span></Link>)}</div>
    <section className="surface mt-7 rounded-2xl p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">آخرین پیام‌ها</h2><Link href="/admin/messages" className="text-sm text-sky-400">مشاهده همه</Link></div>{latestMessages.length ? <div className="divide-y divide-white/10">{latestMessages.map((message) => <div key={message.id} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="font-bold">{message.subject}</p><p className="mt-1 text-sm text-gray-500">{message.name} · {message.email}</p></div><span className={message.read ? "text-xs text-gray-600" : "text-xs text-emerald-400"}>{message.read ? "خوانده‌شده" : "جدید"}</span></div>)}</div> : <p className="text-gray-500">هنوز پیامی دریافت نشده است.</p>}</section>
  </main>;
}
