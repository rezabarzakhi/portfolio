import { Check, Trash2 } from "lucide-react";
import { deleteMessage, markMessageRead } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin-page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <main><AdminPageHeader title="پیام‌های تماس" description="پیام‌های ارسال‌شده از فرم تماس وب‌سایت" />{messages.length ? <div className="grid gap-4">{messages.map((message) => <article key={message.id} className={`rounded-2xl border p-5 ${message.read ? "border-white/5 bg-white/[0.02]" : "border-sky-400/25 bg-sky-400/[0.04]"}`}><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{message.subject}</h2><p className="mt-1 text-sm text-gray-500">{message.name} · <a href={`mailto:${message.email}`} className="text-sky-400">{message.email}</a></p></div><time className="text-xs text-gray-600">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(message.createdAt)}</time></div><p className="mt-5 whitespace-pre-wrap leading-8 text-gray-300">{message.message}</p><div className="mt-4 flex gap-5">{!message.read && <form action={markMessageRead}><input type="hidden" name="id" value={message.id} /><button className="inline-flex items-center gap-2 text-sm text-emerald-400"><Check size={15} />خوانده شد</button></form>}<form action={deleteMessage}><input type="hidden" name="id" value={message.id} /><button className="inline-flex items-center gap-2 text-sm text-red-400"><Trash2 size={15} />حذف</button></form></div></article>)}</div> : <div className="surface rounded-2xl p-10 text-center text-gray-500">پیامی دریافت نشده است.</div>}</main>;
}
