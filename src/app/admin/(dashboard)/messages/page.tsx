import { AdminPageHeader } from "@/components/admin-page-header";
import { MessagesList } from "@/components/messages-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <main><AdminPageHeader title="پیام‌های تماس" description="پیام‌های ارسال‌شده از فرم تماس وب‌سایت" /><MessagesList messages={messages} /></main>;
}
