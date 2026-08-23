import { Trash2 } from "lucide-react";
import { deleteSkill } from "@/app/admin/actions";
import { SkillForm } from "@/components/admin-forms";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminSection } from "@/components/admin-fields";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
  return <main><AdminPageHeader title="مهارت‌ها" description="مهارت‌ها، لوگوی فناوری و ترتیب نمایش آن‌ها در سایت" /><div className="grid gap-7"><AdminSection title="افزودن مهارت"><SkillForm /></AdminSection><AdminSection title="مهارت‌های موجود" count={skills.length}><div className="grid gap-4">{skills.map((skill) => <div key={skill.id} className="rounded-xl border border-white/10 p-4"><SkillForm skill={skill} /><form action={deleteSkill}><input type="hidden" name="id" value={skill.id} /><button className="mt-3 inline-flex items-center gap-2 text-sm text-red-400"><Trash2 size={15} />حذف</button></form></div>)}</div></AdminSection></div></main>;
}
