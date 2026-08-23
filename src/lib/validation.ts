import { z } from "zod";

const requiredText = z.string().trim().min(2).max(10_000);
const optionalUrl = z.union([z.literal(""), z.url()]).optional();
const formBoolean = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");

export const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(160),
  password: z.string().min(8).max(128),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["fa", "en"]),
  website: z.string().max(0).optional(),
});

export const settingSchema = z.object({
  nameFa: requiredText,
  nameEn: requiredText,
  roleFa: requiredText,
  roleEn: requiredText,
  introFa: requiredText,
  introEn: requiredText,
  aboutFa: requiredText,
  aboutEn: requiredText,
  locationFa: requiredText,
  locationEn: requiredText,
  email: z.email(),
  phone: z.string().trim().min(5).max(30),
  availabilityFa: requiredText,
  availabilityEn: requiredText,
  heroImage: z.string().min(1),
  aboutImage: z.string().min(1),
  logoUrl: z.string().max(500).default(""),
  faviconUrl: z.string().max(500).default(""),
  resumeUrl: optionalUrl,
  githubUrl: optionalUrl,
  instagramUrl: optionalUrl,
  telegramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  seoDescriptionFa: requiredText,
  seoDescriptionEn: requiredText,
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(80),
  iconUrl: z.string().max(500).default(""),
  sortOrder: z.coerce.number().int().min(0).max(1000),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titleFa: requiredText,
  titleEn: requiredText,
  summaryFa: requiredText,
  summaryEn: requiredText,
  contentFa: requiredText,
  contentEn: requiredText,
  imageUrl: z.string().min(1),
  technologies: z.string().trim().min(1).max(500),
  liveUrl: optionalUrl,
  repositoryUrl: optionalUrl,
  completedAt: z.string().optional(),
  featured: formBoolean.default(false),
  published: formBoolean.default(false),
});

export const postSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titleFa: requiredText,
  titleEn: requiredText,
  excerptFa: requiredText,
  excerptEn: requiredText,
  contentFa: requiredText,
  contentEn: requiredText,
  categoryFa: requiredText,
  categoryEn: requiredText,
  tags: z.string().trim().max(500).default(""),
  imageUrl: z.string().min(1),
  imageAltFa: z.string().trim().max(180).default(""),
  imageAltEn: z.string().trim().max(180).default(""),
  seoTitleFa: z.string().trim().min(2).max(70),
  seoTitleEn: z.string().trim().min(2).max(70),
  seoDescriptionFa: requiredText,
  seoDescriptionEn: requiredText,
  canonicalUrl: optionalUrl,
  featured: formBoolean.default(false),
  allowIndex: formBoolean.default(true),
  published: formBoolean.default(false),
  publishedAt: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  titleFa: requiredText,
  titleEn: requiredText,
  organizationFa: requiredText,
  organizationEn: requiredText,
  periodFa: requiredText,
  periodEn: requiredText,
  descriptionFa: requiredText,
  descriptionEn: requiredText,
  sortOrder: z.coerce.number().int().min(0).max(1000),
});
