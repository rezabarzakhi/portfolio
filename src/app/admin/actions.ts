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

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

async function saveUpload(file: FormDataEntryValue | null, current: string, allowed: string[]) {
  if (!(file instanceof File) || file.size === 0) return current;
  if (file.size > 6 * 1024 * 1024 || !allowed.includes(file.type)) throw new Error("Invalid file");
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

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const values = Object.fromEntries(formData);
  values.heroImage = await saveUpload(formData.get("heroFile"), String(values.heroImage ?? ""), ["image/jpeg", "image/png", "image/webp"]);
  values.aboutImage = await saveUpload(formData.get("aboutFile"), String(values.aboutImage ?? ""), ["image/jpeg", "image/png", "image/webp"]);
  values.resumeUrl = await saveUpload(formData.get("resumeFile"), String(values.resumeUrl ?? ""), ["application/pdf"]);
  const data = settingSchema.parse(values);
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: { ...data, resumeUrl: data.resumeUrl || null },
    create: { id: "main", ...data, resumeUrl: data.resumeUrl || null },
  });
  revalidatePath("/", "layout");
}

export async function saveSkill(formData: FormData) {
  await requireAdmin();
  const data = skillSchema.parse(Object.fromEntries(formData));
  if (data.id) await prisma.skill.update({ where: { id: data.id }, data });
  else await prisma.skill.create({ data });
  revalidatePath("/admin");
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin");
}

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const values = Object.fromEntries(formData);
  values.imageUrl = await saveUpload(formData.get("imageFile"), String(values.imageUrl ?? ""), ["image/jpeg", "image/png", "image/webp"]);
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
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function savePost(formData: FormData) {
  await requireAdmin();
  const values = Object.fromEntries(formData);
  values.imageUrl = await saveUpload(formData.get("imageFile"), String(values.imageUrl ?? ""), ["image/jpeg", "image/png", "image/webp"]);
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
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  await prisma.post.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function saveExperience(formData: FormData) {
  await requireAdmin();
  const data = experienceSchema.parse(Object.fromEntries(formData));
  if (data.id) await prisma.experience.update({ where: { id: data.id }, data });
  else await prisma.experience.create({ data });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function deleteExperience(formData: FormData) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function markMessageRead(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id: String(formData.get("id")) }, data: { read: true } });
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin");
}
