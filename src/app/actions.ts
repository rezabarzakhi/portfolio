"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mail";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactState = { status: "idle" | "success" | "error"; message?: string };

export async function submitContact(_state: ContactState, formData: FormData): Promise<ContactState> {
  const result = contactSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { status: "error", message: firstError?.message ?? "اطلاعات وارد شده صحیح نیست." };
  }
  if (result.data.website) return { status: "error", message: "اطلاعات ارسالی نامعتبر است." };

  try {
    const hdrs = await headers();
    const forwarded = hdrs.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rl = checkRateLimit(ip, { windowMs: 60_000, max: 5, keyPrefix: "contact" });
    if (!rl.allowed) {
      const waitSec = Math.ceil(rl.retryAfterMs / 1000);
      return { status: "error", message: `درخواست‌های شما زیاد است. لطفاً ${waitSec} ثانیه صبر کنید.` };
    }

    const data = {
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
      locale: result.data.locale,
    };
    const recentMessages = await prisma.contactMessage.count({
      where: { email: data.email, createdAt: { gte: new Date(Date.now() - 60_000) } },
    });
    if (recentMessages >= 3) return { status: "error", message: "شما در یک دقیقهٔ اخیر ۳ پیام ارسال کرده‌اید. لطفاً کمی صبر کنید." };
    await prisma.contactMessage.create({ data });
    await sendContactEmail(data);
    return { status: "success", message: "پیام با موفقیت ارسال شد." };
  } catch {
    return { status: "error", message: "خطا در ارسال پیام. لطفاً بعداً دوباره تلاش کنید." };
  }
}
