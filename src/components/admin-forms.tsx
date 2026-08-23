import type { Experience, Project, SiteSetting, Skill } from "@prisma/client";
import { AdminInput, AdminTextarea } from "@/components/admin-fields";
import { saveExperience, saveProject, saveSettings, saveSkill } from "@/app/admin/actions";

const submitClass = "button-primary mt-5";

export function SettingsForm({ setting }: { setting: SiteSetting }) {
  return <form action={saveSettings} className="grid gap-5">
    <div className="rounded-xl border border-white/10 p-5">
      <h3 className="mb-5 text-lg font-black">هویت بصری سایت</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <input type="hidden" name="logoUrl" value={setting.logoUrl} />
        <AdminInput label="لوگوی سایت" name="logoFile" type="file" accept="image/jpeg,image/png,image/webp" />
        <input type="hidden" name="faviconUrl" value={setting.faviconUrl} />
        <AdminInput label="نماد مرورگر" name="faviconFile" type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="نام فارسی" name="nameFa" defaultValue={setting.nameFa} required /><AdminInput label="نام انگلیسی" name="nameEn" defaultValue={setting.nameEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="عنوان حرفه‌ای فارسی" name="roleFa" defaultValue={setting.roleFa} required /><AdminInput label="عنوان حرفه‌ای انگلیسی" name="roleEn" defaultValue={setting.roleEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminTextarea label="معرفی کوتاه فارسی" name="introFa" defaultValue={setting.introFa} required /><AdminTextarea label="معرفی کوتاه انگلیسی" name="introEn" defaultValue={setting.introEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminTextarea label="درباره من فارسی" name="aboutFa" defaultValue={setting.aboutFa} required /><AdminTextarea label="درباره من انگلیسی" name="aboutEn" defaultValue={setting.aboutEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="موقعیت فارسی" name="locationFa" defaultValue={setting.locationFa} required /><AdminInput label="موقعیت انگلیسی" name="locationEn" defaultValue={setting.locationEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="وضعیت همکاری فارسی" name="availabilityFa" defaultValue={setting.availabilityFa} required /><AdminInput label="وضعیت همکاری انگلیسی" name="availabilityEn" defaultValue={setting.availabilityEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="ایمیل" name="email" type="email" defaultValue={setting.email} required /><AdminInput label="تلفن" name="phone" defaultValue={setting.phone} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="نشانی تصویر اصلی" name="heroImage" defaultValue={setting.heroImage} required /><AdminInput label="بارگذاری تصویر اصلی" name="heroFile" type="file" accept="image/jpeg,image/png,image/webp" /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="نشانی تصویر درباره من" name="aboutImage" defaultValue={setting.aboutImage} required /><AdminInput label="بارگذاری تصویر درباره من" name="aboutFile" type="file" accept="image/jpeg,image/png,image/webp" /></div>
    <input type="hidden" name="resumeUrl" value={setting.resumeUrl ?? ""} /><AdminInput label="فایل رزومه" name="resumeFile" type="file" accept="application/pdf" />
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="گیت‌هاب" name="githubUrl" type="url" defaultValue={setting.githubUrl ?? ""} /><AdminInput label="اینستاگرام" name="instagramUrl" type="url" defaultValue={setting.instagramUrl ?? ""} /><AdminInput label="تلگرام" name="telegramUrl" type="url" defaultValue={setting.telegramUrl ?? ""} /><AdminInput label="توییتر" name="twitterUrl" type="url" defaultValue={setting.twitterUrl ?? ""} /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminTextarea label="توضیحات جست‌وجوی فارسی" name="seoDescriptionFa" defaultValue={setting.seoDescriptionFa} required /><AdminTextarea label="توضیحات جست‌وجوی انگلیسی" name="seoDescriptionEn" defaultValue={setting.seoDescriptionEn} required /></div>
    <button className={submitClass}>ذخیره اطلاعات اصلی</button>
  </form>;
}

export function SkillForm({ skill }: { skill?: Skill }) {
  return <form action={saveSkill} className="grid gap-4 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">{skill && <input type="hidden" name="id" value={skill.id} />}<input type="hidden" name="iconUrl" value={skill?.iconUrl ?? ""} /><AdminInput label="مهارت" name="name" defaultValue={skill?.name} required /><AdminInput label="لوگوی فناوری" name="iconFile" type="file" accept="image/jpeg,image/png,image/webp" /><AdminInput label="ترتیب" name="sortOrder" type="number" min="0" defaultValue={skill?.sortOrder ?? 0} required /><button className="button-primary">{skill ? "ویرایش" : "افزودن"}</button></form>;
}

export function ProjectForm({ project }: { project?: Project }) {
  return <form action={saveProject} className="grid gap-5">{project && <input type="hidden" name="id" value={project.id} />}
    <div className="grid gap-5 md:grid-cols-3"><AdminInput label="نشانی انگلیسی" name="slug" defaultValue={project?.slug} required /><AdminInput label="عنوان فارسی" name="titleFa" defaultValue={project?.titleFa} required /><AdminInput label="عنوان انگلیسی" name="titleEn" defaultValue={project?.titleEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminTextarea label="خلاصه فارسی" name="summaryFa" defaultValue={project?.summaryFa} required /><AdminTextarea label="خلاصه انگلیسی" name="summaryEn" defaultValue={project?.summaryEn} required /><AdminTextarea label="متن فارسی" name="contentFa" defaultValue={project?.contentFa} required /><AdminTextarea label="متن انگلیسی" name="contentEn" defaultValue={project?.contentEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="نشانی تصویر" name="imageUrl" defaultValue={project?.imageUrl} required /><AdminInput label="بارگذاری تصویر" name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="فناوری‌ها با ویرگول" name="technologies" defaultValue={project?.technologies} required /><AdminInput label="تاریخ انجام" name="completedAt" type="date" defaultValue={project?.completedAt?.toISOString().slice(0, 10)} /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="نسخه زنده" name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} /><AdminInput label="مخزن کد" name="repositoryUrl" type="url" defaultValue={project?.repositoryUrl ?? ""} /></div>
    <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" name="featured" value="true" defaultChecked={project?.featured} /> منتخب</label><label className="flex items-center gap-2"><input type="checkbox" name="published" value="true" defaultChecked={project?.published ?? true} /> منتشرشده</label></div>
    <button className={submitClass}>{project ? "ذخیره پروژه" : "افزودن پروژه"}</button>
  </form>;
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  return <form action={saveExperience} className="grid gap-5">{experience && <input type="hidden" name="id" value={experience.id} />}
    <div className="grid gap-5 md:grid-cols-2"><AdminInput label="عنوان فارسی" name="titleFa" defaultValue={experience?.titleFa} required /><AdminInput label="عنوان انگلیسی" name="titleEn" defaultValue={experience?.titleEn} required /><AdminInput label="سازمان فارسی" name="organizationFa" defaultValue={experience?.organizationFa} required /><AdminInput label="سازمان انگلیسی" name="organizationEn" defaultValue={experience?.organizationEn} required /><AdminInput label="دوره فارسی" name="periodFa" defaultValue={experience?.periodFa} required /><AdminInput label="دوره انگلیسی" name="periodEn" defaultValue={experience?.periodEn} required /></div>
    <div className="grid gap-5 md:grid-cols-2"><AdminTextarea label="توضیح فارسی" name="descriptionFa" defaultValue={experience?.descriptionFa} required /><AdminTextarea label="توضیح انگلیسی" name="descriptionEn" defaultValue={experience?.descriptionEn} required /></div>
    <AdminInput label="ترتیب" name="sortOrder" type="number" min="0" defaultValue={experience?.sortOrder ?? 0} required />
    <button className={submitClass}>{experience ? "ذخیره سابقه" : "افزودن سابقه"}</button>
  </form>;
}
