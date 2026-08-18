import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/admin-forms";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminSection } from "@/components/admin-fields";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return <main><AdminPageHeader title="نمونه‌کارها" description="ایجاد و ویرایش پروژه‌ها، فناوری‌ها، تصاویر و پیوندهای مرتبط" /><div className="grid gap-7"><AdminSection title="پروژه جدید"><ProjectForm /></AdminSection><AdminSection title="پروژه‌های موجود" count={projects.length}>{projects.map((project) => <details key={project.id} className="mb-4 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer font-bold">{project.titleFa}<span className={`ms-3 text-xs ${project.published ? "text-emerald-400" : "text-gray-500"}`}>{project.published ? "منتشرشده" : "پیش‌نویس"}</span></summary><div className="mt-6"><ProjectForm project={project} /><form action={deleteProject}><input type="hidden" name="id" value={project.id} /><button className="mt-3 inline-flex items-center gap-2 text-sm text-red-400"><Trash2 size={15} />حذف پروژه</button></form></div></details>)}</AdminSection></div></main>;
}
