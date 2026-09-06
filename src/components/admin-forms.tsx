"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Experience, Project, SiteSetting, Skill } from "@prisma/client";
import { AdminInput, AdminTextarea } from "@/components/admin-fields";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "@/components/toast";
import { saveExperience, saveProject, saveSettings, saveSkill, type FormState } from "@/app/admin/actions";

const initial: FormState = null;

function FormToast({ state }: { state: FormState }) {
  const router = useRouter();
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message, { long: true });
    }
  }, [state, router]);
  return null;
}

function FieldErrors({ state, field }: { state: FormState; field: string }) {
  if (!state || state.status !== "error" || !state.errors) return null;
  const error = state.errors[field];
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-400">{error}</p>;
}

function getError(state: FormState, field: string): string | undefined {
  if (!state || state.status !== "error" || !state.errors) return undefined;
  return state.errors[field];
}

export function SettingsForm({ setting }: { setting: SiteSetting }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  return <form action={action} className="grid gap-5" noValidate>
    <FormToast state={state} />
    <div className="rounded-xl border border-white/10 p-5">
      <h3 className="mb-5 text-lg font-black">هویت بصری سایت</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <input type="hidden" name="logoUrl" value={setting.logoUrl} />
        <ImageUpload name="logoFile" label="لوگوی سایت" currentUrl={setting.logoUrl || undefined} />
        <input type="hidden" name="faviconUrl" value={setting.faviconUrl} />
        <ImageUpload name="faviconFile" label="نماد مرورگر" currentUrl={setting.faviconUrl || undefined} />
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="نام فارسی" name="nameFa" defaultValue={setting.nameFa} required error={getError(state, "nameFa")} /><FieldErrors state={state} field="nameFa" /></div>
      <div><AdminInput label="نام انگلیسی" name="nameEn" defaultValue={setting.nameEn} required error={getError(state, "nameEn")} /><FieldErrors state={state} field="nameEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="عنوان حرفه‌ای فارسی" name="roleFa" defaultValue={setting.roleFa} required error={getError(state, "roleFa")} /><FieldErrors state={state} field="roleFa" /></div>
      <div><AdminInput label="عنوان حرفه‌ای انگلیسی" name="roleEn" defaultValue={setting.roleEn} required error={getError(state, "roleEn")} /><FieldErrors state={state} field="roleEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminTextarea label="معرفی کوتاه فارسی" name="introFa" defaultValue={setting.introFa} required error={getError(state, "introFa")} /><FieldErrors state={state} field="introFa" /></div>
      <div><AdminTextarea label="معرفی کوتاه انگلیسی" name="introEn" defaultValue={setting.introEn} required error={getError(state, "introEn")} /><FieldErrors state={state} field="introEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminTextarea label="درباره من فارسی" name="aboutFa" defaultValue={setting.aboutFa} required error={getError(state, "aboutFa")} /><FieldErrors state={state} field="aboutFa" /></div>
      <div><AdminTextarea label="درباره من انگلیسی" name="aboutEn" defaultValue={setting.aboutEn} required error={getError(state, "aboutEn")} /><FieldErrors state={state} field="aboutEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="موقعیت فارسی" name="locationFa" defaultValue={setting.locationFa} required error={getError(state, "locationFa")} /><FieldErrors state={state} field="locationFa" /></div>
      <div><AdminInput label="موقعیت انگلیسی" name="locationEn" defaultValue={setting.locationEn} required error={getError(state, "locationEn")} /><FieldErrors state={state} field="locationEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="وضعیت همکاری فارسی" name="availabilityFa" defaultValue={setting.availabilityFa} required error={getError(state, "availabilityFa")} /><FieldErrors state={state} field="availabilityFa" /></div>
      <div><AdminInput label="وضعیت همکاری انگلیسی" name="availabilityEn" defaultValue={setting.availabilityEn} required error={getError(state, "availabilityEn")} /><FieldErrors state={state} field="availabilityEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="ایمیل" name="email" type="email" defaultValue={setting.email} required error={getError(state, "email")} /><FieldErrors state={state} field="email" /></div>
      <div><AdminInput label="تلفن" name="phone" defaultValue={setting.phone} required error={getError(state, "phone")} /><FieldErrors state={state} field="phone" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="نشانی تصویر اصلی" name="heroImage" defaultValue={setting.heroImage} required error={getError(state, "heroImage")} /><FieldErrors state={state} field="heroImage" /></div>
      <ImageUpload name="heroFile" label="تصویر اصلی" currentUrl={setting.heroImage || undefined} />
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="نشانی تصویر درباره من" name="aboutImage" defaultValue={setting.aboutImage} required error={getError(state, "aboutImage")} /><FieldErrors state={state} field="aboutImage" /></div>
      <ImageUpload name="aboutFile" label="تصویر درباره من" currentUrl={setting.aboutImage || undefined} />
    </div>
    <input type="hidden" name="resumeUrl" value={setting.resumeUrl ?? ""} />
    <div className="grid gap-5 md:grid-cols-2">
      <AdminInput label="فایل رزومه" name="resumeFile" type="file" accept="application/pdf" />
      {setting.resumeUrl && <a href={setting.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#9db2bf] hover:text-[#dde6ed] transition-colors mt-auto mb-1">مشاهده رزومه فعلی</a>}
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="گیت‌هاب" name="githubUrl" type="url" defaultValue={setting.githubUrl ?? ""} error={getError(state, "githubUrl")} /><FieldErrors state={state} field="githubUrl" /></div>
      <div><AdminInput label="اینستاگرام" name="instagramUrl" type="url" defaultValue={setting.instagramUrl ?? ""} error={getError(state, "instagramUrl")} /><FieldErrors state={state} field="instagramUrl" /></div>
      <div><AdminInput label="تلگرام" name="telegramUrl" type="url" defaultValue={setting.telegramUrl ?? ""} error={getError(state, "telegramUrl")} /><FieldErrors state={state} field="telegramUrl" /></div>
      <div><AdminInput label="توییتر" name="twitterUrl" type="url" defaultValue={setting.twitterUrl ?? ""} error={getError(state, "twitterUrl")} /><FieldErrors state={state} field="twitterUrl" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminTextarea label="توضیحات جست‌وجوی فارسی" name="seoDescriptionFa" defaultValue={setting.seoDescriptionFa} required error={getError(state, "seoDescriptionFa")} /><FieldErrors state={state} field="seoDescriptionFa" /></div>
      <div><AdminTextarea label="توضیحات جست‌وجوی انگلیسی" name="seoDescriptionEn" defaultValue={setting.seoDescriptionEn} required error={getError(state, "seoDescriptionEn")} /><FieldErrors state={state} field="seoDescriptionEn" /></div>
    </div>
    <button className="button-primary mt-5" type="submit" disabled={pending}>{pending ? "در حال ذخیره..." : "ذخیره اطلاعات اصلی"}</button>
  </form>;
}

export function SkillForm({ skill }: { skill?: Skill }) {
  const [state, action, pending] = useActionState(saveSkill, initial);
  return <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end" noValidate>
    <FormToast state={state} />
    {skill && <input type="hidden" name="id" value={skill.id} />}
    <input type="hidden" name="iconUrl" value={skill?.iconUrl ?? ""} />
    <div><AdminInput label="مهارت" name="name" defaultValue={skill?.name} required error={getError(state, "name")} /><FieldErrors state={state} field="name" /></div>
    <ImageUpload name="iconFile" label="لوگوی فناوری" currentUrl={skill?.iconUrl || undefined} />
    <div><AdminInput label="ترتیب" name="sortOrder" type="number" min="0" defaultValue={skill?.sortOrder ?? 0} required error={getError(state, "sortOrder")} /><FieldErrors state={state} field="sortOrder" /></div>
    <button className="button-primary" type="submit" disabled={pending}>{pending ? "..." : skill ? "ویرایش" : "افزودن"}</button>
  </form>;
}

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState(saveProject, initial);
  return <form action={action} className="grid gap-5" noValidate>
    <FormToast state={state} />
    {project && <input type="hidden" name="id" value={project.id} />}
    <div className="grid gap-5 md:grid-cols-3">
      <div><AdminInput label="نشانی انگلیسی" name="slug" defaultValue={project?.slug} required error={getError(state, "slug")} /><FieldErrors state={state} field="slug" /></div>
      <div><AdminInput label="عنوان فارسی" name="titleFa" defaultValue={project?.titleFa} required error={getError(state, "titleFa")} /><FieldErrors state={state} field="titleFa" /></div>
      <div><AdminInput label="عنوان انگلیسی" name="titleEn" defaultValue={project?.titleEn} required error={getError(state, "titleEn")} /><FieldErrors state={state} field="titleEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminTextarea label="خلاصه فارسی" name="summaryFa" defaultValue={project?.summaryFa} required error={getError(state, "summaryFa")} /><FieldErrors state={state} field="summaryFa" /></div>
      <div><AdminTextarea label="خلاصه انگلیسی" name="summaryEn" defaultValue={project?.summaryEn} required error={getError(state, "summaryEn")} /><FieldErrors state={state} field="summaryEn" /></div>
      <div><AdminTextarea label="متن فارسی" name="contentFa" defaultValue={project?.contentFa} required error={getError(state, "contentFa")} /><FieldErrors state={state} field="contentFa" /></div>
      <div><AdminTextarea label="متن انگلیسی" name="contentEn" defaultValue={project?.contentEn} required error={getError(state, "contentEn")} /><FieldErrors state={state} field="contentEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="نشانی تصویر" name="imageUrl" defaultValue={project?.imageUrl} required error={getError(state, "imageUrl")} /><FieldErrors state={state} field="imageUrl" /></div>
      <ImageUpload name="imageFile" label="تصویر پروژه" currentUrl={project?.imageUrl || undefined} />
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="فناوری‌ها با ویرگول" name="technologies" defaultValue={project?.technologies} required error={getError(state, "technologies")} /><FieldErrors state={state} field="technologies" /></div>
      <AdminInput label="تاریخ انجام" name="completedAt" type="date" defaultValue={project?.completedAt?.toISOString().slice(0, 10)} />
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="نسخه زنده" name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} error={getError(state, "liveUrl")} /><FieldErrors state={state} field="liveUrl" /></div>
      <div><AdminInput label="مخزن کد" name="repositoryUrl" type="url" defaultValue={project?.repositoryUrl ?? ""} error={getError(state, "repositoryUrl")} /><FieldErrors state={state} field="repositoryUrl" /></div>
    </div>
    <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" name="featured" value="true" defaultChecked={project?.featured} /> منتخب</label><label className="flex items-center gap-2"><input type="checkbox" name="published" value="true" defaultChecked={project?.published ?? true} /> منتشرشده</label></div>
    <button className="button-primary mt-5" type="submit" disabled={pending}>{pending ? "در حال ذخیره..." : project ? "ذخیره پروژه" : "افزودن پروژه"}</button>
  </form>;
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const [state, action, pending] = useActionState(saveExperience, initial);
  return <form action={action} className="grid gap-5" noValidate>
    <FormToast state={state} />
    {experience && <input type="hidden" name="id" value={experience.id} />}
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminInput label="عنوان فارسی" name="titleFa" defaultValue={experience?.titleFa} required error={getError(state, "titleFa")} /><FieldErrors state={state} field="titleFa" /></div>
      <div><AdminInput label="عنوان انگلیسی" name="titleEn" defaultValue={experience?.titleEn} required error={getError(state, "titleEn")} /><FieldErrors state={state} field="titleEn" /></div>
      <div><AdminInput label="سازمان فارسی" name="organizationFa" defaultValue={experience?.organizationFa} required error={getError(state, "organizationFa")} /><FieldErrors state={state} field="organizationFa" /></div>
      <div><AdminInput label="سازمان انگلیسی" name="organizationEn" defaultValue={experience?.organizationEn} required error={getError(state, "organizationEn")} /><FieldErrors state={state} field="organizationEn" /></div>
      <div><AdminInput label="دوره فارسی" name="periodFa" defaultValue={experience?.periodFa} required error={getError(state, "periodFa")} /><FieldErrors state={state} field="periodFa" /></div>
      <div><AdminInput label="دوره انگلیسی" name="periodEn" defaultValue={experience?.periodEn} required error={getError(state, "periodEn")} /><FieldErrors state={state} field="periodEn" /></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div><AdminTextarea label="توضیح فارسی" name="descriptionFa" defaultValue={experience?.descriptionFa} required error={getError(state, "descriptionFa")} /><FieldErrors state={state} field="descriptionFa" /></div>
      <div><AdminTextarea label="توضیح انگلیسی" name="descriptionEn" defaultValue={experience?.descriptionEn} required error={getError(state, "descriptionEn")} /><FieldErrors state={state} field="descriptionEn" /></div>
    </div>
    <div><AdminInput label="ترتیب" name="sortOrder" type="number" min="0" defaultValue={experience?.sortOrder ?? 0} required error={getError(state, "sortOrder")} /><FieldErrors state={state} field="sortOrder" /></div>
    <button className="button-primary mt-5" type="submit" disabled={pending}>{pending ? "در حال ذخیره..." : experience ? "ذخیره سابقه" : "افزودن سابقه"}</button>
  </form>;
}
