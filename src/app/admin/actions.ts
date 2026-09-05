"use server";

import { AuthError } from "next-auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { experienceSchema, postSchema, projectSchema, settingSchema, skillSchema } from "@/lib/validation";
import { ZodError } from "zod";

export type FormState = {
  status: "success" | "error";
  message: string;
  errors?: Record<string, string>;
} | null;

function formatZodError(error: ZodError): { message: string; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  const fieldCount = Object.keys(errors).length;
  return {
    message: fieldCount === 1
      ? `یک فیلد اشتباه است: ${Object.values(errors)[0]}`
      : `${fieldCount} فیلد اشتباه هستند. لطفاً فیلدها را بررسی کنید.`,
    errors,
  };
}

function formatUploadError(err: unknown): string {
  if (err instanceof Error && err.message.startsWith("فایل")) return err.message;
  if (err instanceof Error && err.message.startsWith("فرمت")) return err.message;
  return "خطا در بارگذاری فایل. لطفاً دوباره تلاش کنید.";
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

async function saveUpload(file: FormDataEntryValue | null, current: string, allowed: string[], fieldName: string) {
  if (!(file instanceof File) || file.size === 0) return current;
  const maxSize = 6 * 1024 * 1024;
  if (file.size > maxSize) throw new Error(`فایل ${fieldName} بیشتر از ۶ مگابایت است (${(file.size / 1024 / 1024).toFixed(1)} مگابایت)`);
  if (!allowed.includes(file.type)) {
    const allowedNames = allowed.map((t) => t.split("/")[1].toUpperCase()).join(", ");
    throw new Error(`فرمت فایل ${fieldName} مجاز نیست. فرمت‌های مجاز: ${allowedNames}`);
  }
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
  };
  const extension = extensions[file.type];
  const filename = `${randomUUID()}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function loginAction(_state: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", { identifier: formData.get("identifier"), password: formData.get("password"), redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) return "ایمیل یا گذرواژه صحیح نیست.";
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    const values = Object.fromEntries(formData);
    values.heroImage = await saveUpload(formData.get("heroFile"), String(values.heroImage ?? ""), ["image/jpeg", "image/png", "image/webp"], "تصویر اصلی");
    values.aboutImage = await saveUpload(formData.get("aboutFile"), String(values.aboutImage ?? ""), ["image/jpeg", "image/png", "image/webp"], "تصویر درباره");
    values.logoUrl = await saveUpload(formData.get("logoFile"), String(values.logoUrl ?? ""), ["image/jpeg", "image/png", "image/webp"], "لوگو");
    values.faviconUrl = await saveUpload(formData.get("faviconFile"), String(values.faviconUrl ?? ""), ["image/jpeg", "image/png", "image/webp"], "نماد مرورگر");
    values.resumeUrl = await saveUpload(formData.get("resumeFile"), String(values.resumeUrl ?? ""), ["application/pdf"], "فایل رزومه");
    const data = settingSchema.parse(values);
    await prisma.siteSetting.upsert({
      where: { id: "main" },
      update: { ...data, resumeUrl: data.resumeUrl || null },
      create: { id: "main", ...data, resumeUrl: data.resumeUrl || null },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: "اطلاعات اصلی با موفقیت ذخیره شد." };
  } catch (err) {
    if (err instanceof ZodError) {
      const { message, errors } = formatZodError(err);
      return { status: "error", message, errors };
    }
    return { status: "error", message: formatUploadError(err) };
  }
}

export async function saveSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    const values = Object.fromEntries(formData);
    values.iconUrl = await saveUpload(formData.get("iconFile"), String(values.iconUrl ?? ""), ["image/jpeg", "image/png", "image/webp"], "لوگوی فناوری");
    const data = skillSchema.parse(values);
    if (data.id) await prisma.skill.update({ where: { id: data.id }, data });
    else await prisma.skill.create({ data });
    revalidatePath("/admin");
    return { status: "success", message: data.id ? "مهارت ویرایش شد." : "مهارت جدید اضافه شد." };
  } catch (err) {
    if (err instanceof ZodError) {
      const { message, errors } = formatZodError(err);
      return { status: "error", message, errors };
    }
    return { status: "error", message: formatUploadError(err) };
  }
}

export async function deleteSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.skill.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/admin");
    return { status: "success", message: "مهارت حذف شد." };
  } catch {
    return { status: "error", message: "خطا در حذف مهارت. ممکن است مهارت قبلاً حذف شده باشد." };
  }
}

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    const values = Object.fromEntries(formData);
    values.imageUrl = await saveUpload(formData.get("imageFile"), String(values.imageUrl ?? ""), ["image/jpeg", "image/png", "image/webp"], "تصویر پروژه");
    values.featured = formData.has("featured") ? "true" : "false";
    values.published = formData.has("published") ? "true" : "false";
    const data = projectSchema.parse(values);
    const payload = {
      ...data,
      liveUrl: data.liveUrl || null,
      repositoryUrl: data.repositoryUrl || null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    };
    if (data.id) await prisma.project.update({ where: { id: data.id }, data: payload });
    else await prisma.project.create({ data: payload });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: data.id ? "پروژه ویرایش شد." : "پروژه جدید اضافه شد." };
  } catch (err) {
    if (err instanceof ZodError) {
      const { message, errors } = formatZodError(err);
      return { status: "error", message, errors };
    }
    return { status: "error", message: formatUploadError(err) };
  }
}

export async function deleteProject(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: "پروژه حذف شد." };
  } catch {
    return { status: "error", message: "خطا در حذف پروژه. ممکن است پروژه قبلاً حذف شده باشد." };
  }
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    const values = Object.fromEntries(formData);
    values.imageUrl = await saveUpload(formData.get("imageFile"), String(values.imageUrl ?? ""), ["image/jpeg", "image/png", "image/webp"], "تصویر مقاله");
    values.published = formData.has("published") ? "true" : "false";
    values.featured = formData.has("featured") ? "true" : "false";
    values.allowIndex = formData.has("allowIndex") ? "true" : "false";
    const data = postSchema.parse(values);
    const existing = data.id ? await prisma.post.findUnique({ where: { id: data.id } }) : null;
    const payload = {
      ...data,
      canonicalUrl: data.canonicalUrl || null,
      publishedAt: data.published
        ? data.publishedAt ? new Date(data.publishedAt) : existing?.publishedAt ?? new Date()
        : null,
    };
    if (data.id) await prisma.post.update({ where: { id: data.id }, data: payload });
    else await prisma.post.create({ data: payload });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: data.id ? "مقاله ویرایش شد." : "مقاله جدید اضافه شد." };
  } catch (err) {
    if (err instanceof ZodError) {
      const { message, errors } = formatZodError(err);
      return { status: "error", message, errors };
    }
    return { status: "error", message: formatUploadError(err) };
  }
}

export async function deletePost(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.post.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: "مقاله حذف شد." };
  } catch {
    return { status: "error", message: "خطا در حذف مقاله. ممکن است مقاله قبلاً حذف شده باشد." };
  }
}

export async function saveExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    const data = experienceSchema.parse(Object.fromEntries(formData));
    if (data.id) await prisma.experience.update({ where: { id: data.id }, data });
    else await prisma.experience.create({ data });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: data.id ? "سابقه ویرایش شد." : "سابقه جدید اضافه شد." };
  } catch (err) {
    if (err instanceof ZodError) {
      const { message, errors } = formatZodError(err);
      return { status: "error", message, errors };
    }
    return { status: "error", message: "خطا در ذخیره سابقه. لطفاً فیلدها را بررسی کنید." };
  }
}

export async function deleteExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.experience.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    return { status: "success", message: "سابقه حذف شد." };
  } catch {
    return { status: "error", message: "خطا در حذف سابقه. ممکن است سابقه قبلاً حذف شده باشد." };
  }
}

export async function markMessageRead(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.contactMessage.update({ where: { id: String(formData.get("id")) }, data: { read: true } });
    revalidatePath("/admin");
    return { status: "success", message: "پیام خوانده شد." };
  } catch {
    return { status: "error", message: "خطا در به‌روزرسانی پیام. ممکن است پیام وجود نداشته باشد." };
  }
}

export async function deleteMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await requireAdmin();
    await prisma.contactMessage.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/admin");
    return { status: "success", message: "پیام حذف شد." };
  } catch {
    return { status: "error", message: "خطا در حذف پیام. ممکن است پیام قبلاً حذف شده باشد." };
  }
}
