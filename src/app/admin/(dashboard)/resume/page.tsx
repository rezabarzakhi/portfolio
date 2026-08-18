import { Trash2 } from "lucide-react";
import { deleteExperience } from "@/app/admin/actions";
import { ExperienceForm } from "@/components/admin-forms";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminSection } from "@/components/admin-fields";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResumeAdminPage() {
  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return <main><AdminPageHeader title="رزومه" description="سوابق کاری و آموزشی نمایش‌داده‌شده در صفحه رزومه" /><div className="grid gap-7"><AdminSection title="افزودن سابقه"><ExperienceForm /></AdminSection><AdminSection title="سوابق موجود" count={experiences.length}>{experiences.map((experience) => <details key={experience.id} className="mb-4 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer font-bold">{experience.titleFa} · {experience.periodFa}</summary><div className="mt-6"><ExperienceForm experience={experience} /><form action={deleteExperience}><input type="hidden" name="id" value={experience.id} /><button className="mt-3 inline-flex items-center gap-2 text-sm text-red-400"><Trash2 size={15} />حذف سابقه</button></form></div></details>)}</AdminSection></div></main>;
}
