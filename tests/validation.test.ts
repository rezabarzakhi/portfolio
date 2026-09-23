import assert from "node:assert/strict";
import test from "node:test";
import {
  loginSchema,
  contactSchema,
  settingSchema,
  skillSchema,
  projectSchema,
  postSchema,
  experienceSchema,
} from "../src/lib/validation";

// ── loginSchema ──────────────────────────────────────────────

test("loginSchema accepts valid credentials", () => {
  const result = loginSchema.parse({ identifier: "admin", password: "12345678" });
  assert.equal(result.identifier, "admin");
  assert.equal(result.password, "12345678");
});

test("loginSchema trims whitespace from identifier", () => {
  const result = loginSchema.parse({ identifier: "  admin  ", password: "12345678" });
  assert.equal(result.identifier, "admin");
});

test("loginSchema rejects short identifier", () => {
  assert.throws(() => loginSchema.parse({ identifier: "ab", password: "12345678" }));
});

test("loginSchema rejects short password", () => {
  assert.throws(() => loginSchema.parse({ identifier: "admin", password: "1234567" }));
});

test("loginSchema rejects missing fields", () => {
  assert.throws(() => loginSchema.parse({}));
  assert.throws(() => loginSchema.parse({ identifier: "admin" }));
  assert.throws(() => loginSchema.parse({ password: "12345678" }));
});

// ── contactSchema ────────────────────────────────────────────

test("contactSchema accepts valid data", () => {
  const result = contactSchema.parse({
    name: "Ali",
    email: "ali@example.com",
    subject: "Hello",
    message: "This is a test message",
    locale: "fa",
  });
  assert.equal(result.name, "Ali");
  assert.equal(result.locale, "fa");
});

test("contactSchema rejects invalid email", () => {
  assert.throws(() =>
    contactSchema.parse({
      name: "Ali",
      email: "not-an-email",
      subject: "Hello",
      message: "Test message here",
      locale: "fa",
    })
  );
});

test("contactSchema rejects short message", () => {
  assert.throws(() =>
    contactSchema.parse({
      name: "Ali",
      email: "ali@example.com",
      subject: "Hello",
      message: "Short",
      locale: "fa",
    })
  );
});

test("contactSchema rejects invalid locale", () => {
  assert.throws(() =>
    contactSchema.parse({
      name: "Ali",
      email: "ali@example.com",
      subject: "Hello",
      message: "This is a valid message",
      locale: "fr",
    })
  );
});

test("contactSchema accepts honeypot field (should be empty)", () => {
  const result = contactSchema.parse({
    name: "Ali",
    email: "ali@example.com",
    subject: "Hello",
    message: "This is a valid message body",
    locale: "en",
    website: "",
  });
  assert.ok(!result.website || result.website === "");
});

test("contactSchema rejects filled honeypot", () => {
  assert.throws(() =>
    contactSchema.parse({
      name: "Ali",
      email: "ali@example.com",
      subject: "Hello",
      message: "This is a valid message body",
      locale: "en",
      website: "http://spam.com",
    })
  );
});

// ── settingSchema ────────────────────────────────────────────

test("settingSchema accepts valid data", () => {
  const result = settingSchema.parse({
    nameFa: "رضا",
    nameEn: "Reza",
    roleFa: "برنامه‌نویس",
    roleEn: "Developer",
    introFa: "من یک برنامه‌نویسم",
    introEn: "I am a developer",
    aboutFa: "درباره من",
    aboutEn: "About me",
    locationFa: "مشهد",
    locationEn: "Mashhad",
    email: "test@example.com",
    phone: "09151234567",
    availabilityFa: "آماده",
    availabilityEn: "Available",
    heroImage: "/hero.jpg",
    aboutImage: "/about.jpg",
    seoDescriptionFa: "توضیحات سئو فارسی",
    seoDescriptionEn: "Persian SEO description",
  });
  assert.equal(result.nameFa, "رضا");
  assert.equal(result.email, "test@example.com");
});

test("settingSchema rejects empty required fields", () => {
  assert.throws(() =>
    settingSchema.parse({
      nameFa: "",
      nameEn: "Reza",
      roleFa: "برنامه‌نویس",
      roleEn: "Developer",
      introFa: "من یک برنامه‌نویسم",
      introEn: "I am a developer",
      aboutFa: "درباره من",
      aboutEn: "About me",
      locationFa: "مشهد",
      locationEn: "Mashhad",
      email: "test@example.com",
      phone: "09151234567",
      availabilityFa: "آماده",
      availabilityEn: "Available",
      heroImage: "/hero.jpg",
      aboutImage: "/about.jpg",
      seoDescriptionFa: "توضیحات",
      seoDescriptionEn: "Description",
    })
  );
});

test("settingSchema rejects invalid email", () => {
  assert.throws(() =>
    settingSchema.parse({
      nameFa: "رضا",
      nameEn: "Reza",
      roleFa: "برنامه‌نویس",
      roleEn: "Developer",
      introFa: "من",
      introEn: "I",
      aboutFa: "درباره",
      aboutEn: "About",
      locationFa: "مشهد",
      locationEn: "Mashhad",
      email: "bad-email",
      phone: "09151234567",
      availabilityFa: "آماده",
      availabilityEn: "Available",
      heroImage: "/hero.jpg",
      aboutImage: "/about.jpg",
      seoDescriptionFa: "توضیحات",
      seoDescriptionEn: "Description",
    })
  );
});

// ── skillSchema ──────────────────────────────────────────────

test("skillSchema accepts valid data", () => {
  const result = skillSchema.parse({
    name: "React",
    iconUrl: "https://example.com/react.svg",
    sortOrder: 1,
  });
  assert.equal(result.name, "React");
  assert.equal(result.sortOrder, 1);
});

test("skillSchema coerces sortOrder to number", () => {
  const result = skillSchema.parse({ name: "React", sortOrder: "5" });
  assert.equal(result.sortOrder, 5);
});

test("skillSchema rejects empty name", () => {
  assert.throws(() => skillSchema.parse({ name: "", sortOrder: 1 }));
});

test("skillSchema rejects negative sortOrder", () => {
  assert.throws(() => skillSchema.parse({ name: "React", sortOrder: -1 }));
});

test("skillSchema rejects sortOrder > 1000", () => {
  assert.throws(() => skillSchema.parse({ name: "React", sortOrder: 1001 }));
});

// ── projectSchema ────────────────────────────────────────────

test("projectSchema accepts valid data", () => {
  const result = projectSchema.parse({
    slug: "my-project",
    titleFa: "پروژه من",
    titleEn: "My Project",
    summaryFa: "خلاصه پروژه",
    summaryEn: "Project summary",
    contentFa: "محتوا",
    contentEn: "Content",
    imageUrl: "/uploads/project.jpg",
    technologies: "React,Next.js",
  });
  assert.equal(result.slug, "my-project");
  assert.equal(result.featured, false);
  assert.equal(result.published, false);
});

test("projectSchema rejects invalid slug", () => {
  assert.throws(() =>
    projectSchema.parse({
      slug: "My Project!",
      titleFa: "پروژه",
      titleEn: "Project",
      summaryFa: "خلاصه",
      summaryEn: "Summary",
      contentFa: "محتوا",
      contentEn: "Content",
      imageUrl: "/img.jpg",
      technologies: "React",
    })
  );
});

test("projectSchema accepts slug with numbers and hyphens", () => {
  const result = projectSchema.parse({
    slug: "project-123-test",
    titleFa: "پروژه",
    titleEn: "Project",
    summaryFa: "خلاصه",
    summaryEn: "Summary",
    contentFa: "محتوا",
    contentEn: "Content",
    imageUrl: "/img.jpg",
    technologies: "React",
  });
  assert.equal(result.slug, "project-123-test");
});

test("projectSchema normalizes boolean checkboxes", () => {
  const result = projectSchema.parse({
    slug: "test",
    titleFa: "پروژه",
    titleEn: "Project",
    summaryFa: "خلاصه",
    summaryEn: "Summary",
    contentFa: "محتوا",
    contentEn: "Content",
    imageUrl: "/img.jpg",
    technologies: "React",
    featured: "true",
    published: "true",
  });
  assert.equal(result.featured, true);
  assert.equal(result.published, true);
});

test("projectSchema rejects missing required fields", () => {
  assert.throws(() => projectSchema.parse({ slug: "test" }));
});

// ── postSchema ───────────────────────────────────────────────

test("postSchema accepts valid data with defaults", () => {
  const result = postSchema.parse({
    slug: "my-article",
    titleFa: "مقاله من",
    titleEn: "My Article",
    excerptFa: "خلاصه مقاله",
    excerptEn: "Article excerpt",
    contentFa: "<p>محتوا</p>",
    contentEn: "<p>Content</p>",
    categoryFa: "آموزش",
    categoryEn: "Tutorial",
    imageUrl: "/uploads/article.jpg",
    seoTitleFa: "عنوان سئو",
    seoTitleEn: "SEO title",
    seoDescriptionFa: "توضیحات سئو",
    seoDescriptionEn: "SEO description",
  });
  assert.equal(result.featured, false);
  assert.equal(result.allowIndex, true);
  assert.equal(result.published, false);
  assert.equal(result.tags, "");
  assert.equal(result.imageAltFa, "");
  assert.equal(result.imageAltEn, "");
});

test("postSchema rejects slug with uppercase letters", () => {
  assert.throws(() =>
    postSchema.parse({
      slug: "My-Article",
      titleFa: "مقاله",
      titleEn: "Article",
      excerptFa: "خلاصه",
      excerptEn: "Excerpt",
      contentFa: "محتوا",
      contentEn: "Content",
      categoryFa: "آموزش",
      categoryEn: "Tutorial",
      imageUrl: "/img.jpg",
      seoTitleFa: "عنوان",
      seoTitleEn: "Title",
      seoDescriptionFa: "توضیح",
      seoDescriptionEn: "Description",
    })
  );
});

test("postSchema accepts scheduledAt field", () => {
  const result = postSchema.parse({
    slug: "scheduled-post",
    titleFa: "مقاله زمانبندی شده",
    titleEn: "Scheduled post",
    excerptFa: "خلاصه",
    excerptEn: "Excerpt",
    contentFa: "محتوا",
    contentEn: "Content",
    categoryFa: "آموزش",
    categoryEn: "Tutorial",
    imageUrl: "/img.jpg",
    seoTitleFa: "عنوان",
    seoTitleEn: "Title",
    seoDescriptionFa: "توضیح",
    seoDescriptionEn: "Description",
    scheduledAt: "2026-12-01T10:00:00Z",
  });
  assert.equal(result.scheduledAt, "2026-12-01T10:00:00Z");
});

test("postSchema normalizes all boolean checkboxes", () => {
  const result = postSchema.parse({
    slug: "test-booleans",
    titleFa: "مقاله",
    titleEn: "Article",
    excerptFa: "خلاصه",
    excerptEn: "Excerpt",
    contentFa: "محتوا",
    contentEn: "Content",
    categoryFa: "آموزش",
    categoryEn: "Tutorial",
    imageUrl: "/img.jpg",
    seoTitleFa: "عنوان",
    seoTitleEn: "Title",
    seoDescriptionFa: "توضیح",
    seoDescriptionEn: "Description",
    featured: "true",
    allowIndex: "false",
    published: "true",
  });
  assert.equal(result.featured, true);
  assert.equal(result.allowIndex, false);
  assert.equal(result.published, true);
});

// ── experienceSchema ─────────────────────────────────────────

test("experienceSchema accepts valid data", () => {
  const result = experienceSchema.parse({
    titleFa: "توسعه‌دهنده",
    titleEn: "Developer",
    organizationFa: "شرکت X",
    organizationEn: "Company X",
    periodFa: "۱۴۰۰ تا ۱۴۰۲",
    periodEn: "2021-2023",
    descriptionFa: "توضیحات",
    descriptionEn: "Description",
    sortOrder: 1,
  });
  assert.equal(result.titleFa, "توسعه‌دهنده");
  assert.equal(result.sortOrder, 1);
});

test("experienceSchema coerces sortOrder", () => {
  const result = experienceSchema.parse({
    titleFa: "توسعه‌دهنده",
    titleEn: "Developer",
    organizationFa: "شرکت",
    organizationEn: "Company",
    periodFa: "دوره",
    periodEn: "Period",
    descriptionFa: "توضیح",
    descriptionEn: "Description",
    sortOrder: "3",
  });
  assert.equal(result.sortOrder, 3);
});

test("experienceSchema rejects missing required fields", () => {
  assert.throws(() => experienceSchema.parse({ sortOrder: 1 }));
});
