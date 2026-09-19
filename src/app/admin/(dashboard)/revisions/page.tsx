import Link from "next/link";
import { History } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const entityLabels: Record<string, string> = {
  post: "مقاله",
  project: "نمونه‌کار",
  skill: "مهارت",
  experience: "سابقه",
};

export default async function RevisionsAdminPage() {
  const revisions = await prisma.contentRevision.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return <main className="grid gap-7"><AdminPageHeader title="تاریخچه تغییرات" description="آخرین تغییرات محتوای وب‌سایت" /><section className="surface rounded-2xl p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">آخرین تغییرات</h2><span className="rounded-full bg-[#526d82]/20 px-3 py-1 text-xs text-[#9db2bf]">{revisions.length}</span></div>{revisions.length ? <div className="divide-y divide-white/10">{revisions.map((revision) => <div key={revision.id} className="flex flex-wrap items-center gap-3 py-4"><History size={16} className="shrink-0 text-[#9db2bf]" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{revision.title || "—"}</p><p className="mt-1 text-xs text-gray-500">{entityLabels[revision.entityType] ?? revision.entityType} · {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(revision.createdAt)}</p></div><details className="text-xs text-[#9db2bf]"><summary className="cursor-pointer">مشاهده داده</summary><pre dir="ltr" className="mt-3 max-h-64 overflow-auto rounded-xl bg-black/30 p-4 text-left text-[11px] leading-6 text-gray-300">{JSON.stringify(revision.snapshot, null, 2)}</pre></details></div>)}</div> : <p className="text-gray-500">هنوز تغییری ثبت نشده است.</p>}</section><p className="text-sm text-gray-500">دسترسی سریع: <Link href="/admin/projects" className="text-[#9db2bf] hover:underline">نمونه‌کارها</Link> · <Link href="/admin/posts" className="text-[#9db2bf] hover:underline">مقاله‌ها</Link></p></main>;
}