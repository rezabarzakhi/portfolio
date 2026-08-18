"use server";

import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mail";
import { contactSchema } from "@/lib/validation";

export type ContactState = { status: "idle" | "success" | "error" };

export async function submitContact(_state: ContactState, formData: FormData): Promise<ContactState> {
  const result = contactSchema.safeParse(Object.fromEntries(formData));
  if (!result.success || result.data.website) return { status: "error" };

  try {
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
    if (recentMessages >= 3) return { status: "error" };
    await prisma.contactMessage.create({ data });
    await sendContactEmail(data);
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
