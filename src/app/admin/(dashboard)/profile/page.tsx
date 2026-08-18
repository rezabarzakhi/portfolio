import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminSection } from "@/components/admin-fields";
import { SettingsForm } from "@/components/admin-forms";
import { defaultSetting } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const setting = await prisma.siteSetting.findUnique({ where: { id: "main" } }) ?? defaultSetting;
  return <main><AdminPageHeader title="اطلاعات اصلی" description="معرفی، راه‌های تماس، تصاویر، شبکه‌های اجتماعی و تنظیمات عمومی سایت" /><AdminSection title="پروفایل وب‌سایت"><SettingsForm setting={setting} /></AdminSection></main>;
}
