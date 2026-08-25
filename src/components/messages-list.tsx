"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { ContactMessage } from "@prisma/client";
import { toast } from "@/components/toast";
import { markMessageRead, deleteMessage, type FormState } from "@/app/admin/actions";
import { DeleteButton } from "@/components/delete-button";

const initial: FormState = null;

function MarkReadButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(markMessageRead, initial);
  const router = useRouter();
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);
  return <form action={action} className="inline"><input type="hidden" name="id" value={id} /><button className="inline-flex items-center gap-2 text-sm text-emerald-400" type="submit" disabled={pending}><Check size={15} />خوانده شد</button></form>;
}

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  return messages.length ? <div className="grid gap-4">{messages.map((message) => <article key={message.id} className={`rounded-2xl border p-5 ${message.read ? "border-white/5 bg-white/[0.02]" : "border-[#526d82]/25 bg-[#526d82]/[0.04]"}`}><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{message.subject}</h2><p className="mt-1 text-sm text-gray-500">{message.name} · <a href={`mailto:${message.email}`} className="text-[#9db2bf]">{message.email}</a></p></div><time className="text-xs text-gray-600">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(message.createdAt)}</time></div><p className="mt-5 whitespace-pre-wrap leading-8 text-gray-300">{message.message}</p><div className="mt-4 flex gap-5">{!message.read && <MarkReadButton id={message.id} />}<DeleteButton action={deleteMessage} id={message.id} label="حذف" /></div></article>)}</div> : <div className="surface rounded-2xl p-10 text-center text-gray-500">پیامی دریافت نشده است.</div>;
}
