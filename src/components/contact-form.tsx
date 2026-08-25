"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/content";
import { dictionary } from "@/lib/content";
import { submitContact, type ContactState } from "@/app/actions";
import { toast } from "@/components/toast";

const initialState: ContactState = { status: "idle" };

function ContactToast({ state }: { state: ContactState }) {
  const router = useRouter();
  useEffect(() => {
    if (state.status === "success") {
      toast.success("پیام با موفقیت ارسال شد.");
      router.refresh();
    } else if (state.status === "error") {
      toast.error("خطا در ارسال پیام.");
    }
  }, [state, router]);
  return null;
}

export function ContactForm({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const [state, action, pending] = useActionState(submitContact, initialState);

  return (
    <form action={action} className="surface rounded-2xl p-6 sm:p-8">
      <ContactToast state={state} />
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="form-label">{t.name}</span><input className="form-field" name="name" required minLength={2} /></label>
        <label><span className="form-label">{t.email}</span><input className="form-field" name="email" type="email" required /></label>
      </div>
      <label className="mt-5 block"><span className="form-label">{t.subject}</span><input className="form-field" name="subject" required minLength={2} /></label>
      <label className="mt-5 block"><span className="form-label">{t.message}</span><textarea className="form-field min-h-40 resize-y" name="message" required minLength={10} /></label>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button className="button-primary" type="submit" disabled={pending}>{pending ? t.sending : t.send}</button>
      </div>
    </form>
  );
}
