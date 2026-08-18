import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeArticleContent } from "../src/lib/sanitize-content";
import { loginSchema, postSchema } from "../src/lib/validation";

test("article sanitizer preserves formatting and removes executable content", () => {
  const result = sanitizeArticleContent('<h2>Title</h2><p onclick="alert(1)">Safe</p><script>alert(1)</script><img src="https://example.com/a.jpg" onerror="alert(1)">');
  assert.match(result, /<h2>Title<\/h2>/);
  assert.match(result, /<p>Safe<\/p>/);
  assert.doesNotMatch(result, /script|onclick|onerror/);
});

test("plain article content becomes paragraphs", () => {
  const result = sanitizeArticleContent("First paragraph\n\nSecond paragraph");
  assert.equal(result, "<p>First paragraph</p><p>Second paragraph</p>");
});

test("login accepts username identifiers", () => {
  assert.equal(loginSchema.parse({ identifier: "test-admin", password: "StrongTestPassword!2026" }).identifier, "test-admin");
});

test("post validation normalizes checkbox values", () => {
  const post = postSchema.parse({
    slug: "complete-article",
    titleFa: "عنوان مقاله",
    titleEn: "Article title",
    excerptFa: "خلاصه مناسب برای مقاله آزمایشی",
    excerptEn: "A useful excerpt for the test article",
    contentFa: "<p>محتوای کامل مقاله</p>",
    contentEn: "<p>Complete article content</p>",
    categoryFa: "آموزش وب",
    categoryEn: "Web education",
    tags: "وب,آموزش",
    imageUrl: "/uploads/article.webp",
    imageAltFa: "تصویر مقاله",
    imageAltEn: "Article image",
    seoTitleFa: "عنوان مناسب موتور جست‌وجو",
    seoTitleEn: "Search optimized article title",
    seoDescriptionFa: "این توضیح کامل و مناسب برای نمایش مقاله در نتیجه‌های موتور جست‌وجو نوشته شده است.",
    seoDescriptionEn: "This complete description is written for displaying the article in search engine results.",
    canonicalUrl: "",
    featured: "true",
    allowIndex: "true",
    published: "false",
  });
  assert.equal(post.featured, true);
  assert.equal(post.allowIndex, true);
  assert.equal(post.published, false);
});
