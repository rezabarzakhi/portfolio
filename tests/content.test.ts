import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeArticleContent } from "../src/lib/sanitize-content";
import { loginSchema, postSchema } from "../src/lib/validation";
import { isLocale, locales } from "../src/lib/content";

// ── sanitizeArticleContent ───────────────────────────────────

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

test("sanitize removes disallowed tags like div", () => {
  const result = sanitizeArticleContent("<div>text</div><p>allowed</p>");
  assert.doesNotMatch(result, /<div/);
  assert.match(result, /<p>allowed<\/p>/);
});

test("sanitize allows safe links with rel and target", () => {
  const result = sanitizeArticleContent('<a href="https://example.com">link</a>');
  assert.match(result, /rel="noopener noreferrer"/);
  assert.match(result, /target="_blank"/);
  assert.match(result, /href="https:\/\/example.com"/);
});

test("sanitize strips javascript: URLs", () => {
  const result = sanitizeArticleContent('<a href="javascript:alert(1)">click</a>');
  assert.doesNotMatch(result, /javascript/);
});

test("sanitize preserves allowed attributes on images", () => {
  const result = sanitizeArticleContent('<img src="https://example.com/img.jpg" alt="photo" width="100" height="200">');
  assert.match(result, /src="https:\/\/example.com\/img.jpg"/);
  assert.match(result, /alt="photo"/);
  assert.match(result, /width="100"/);
});

test("sanitize strips event handler attributes", () => {
  const result = sanitizeArticleContent('<img src="x.jpg" onload="alert(1)" onclick="alert(2)">');
  assert.doesNotMatch(result, /onload|onclick/);
});

test("sanitize handles nested tags", () => {
  const result = sanitizeArticleContent("<p><strong>Bold</strong> and <em>italic</em></p>");
  assert.match(result, /<strong>Bold<\/strong>/);
  assert.match(result, /<em>italic<\/em>/);
});

test("sanitize handles empty input", () => {
  const result = sanitizeArticleContent("");
  assert.ok(result === "" || result === "<p></p>");
});

test("sanitize handles list content", () => {
  const result = sanitizeArticleContent("<ul><li>Item 1</li><li>Item 2</li></ul>");
  assert.match(result, /<ul>/);
  assert.match(result, /<li>Item 1<\/li>/);
  assert.match(result, /<li>Item 2<\/li>/);
});

test("sanitize converts Markdown headings to HTML", () => {
  const result = sanitizeArticleContent("## Title\n\nParagraph");
  assert.match(result, /<h2>Title<\/h2>/);
  assert.match(result, /<p>Paragraph<\/p>/);
});

test("sanitize converts Markdown bold and italic", () => {
  const result = sanitizeArticleContent("**bold** and *italic*");
  assert.match(result, /<strong>bold<\/strong>/);
  assert.match(result, /<em>italic<\/em>/);
});

test("sanitize converts Markdown code blocks", () => {
  const result = sanitizeArticleContent("```js\nconst x = 1;\n```");
  assert.match(result, /<pre>/);
  assert.match(result, /hljs/);
});

test("sanitize converts Markdown lists", () => {
  const result = sanitizeArticleContent("- Item 1\n- Item 2\n- Item 3");
  assert.match(result, /<ul>/);
  assert.match(result, /<li>Item 1<\/li>/);
  assert.match(result, /<li>Item 2<\/li>/);
});

test("sanitize converts Markdown links", () => {
  const result = sanitizeArticleContent("[link](https://example.com)");
  assert.match(result, /href="https:\/\/example\.com"/);
  assert.match(result, />link<\/a>/);
});

test("sanitize converts Markdown tables", () => {
  const md = "| Name | Value |\n|---|---|\n| A | 1 |\n| B | 2 |";
  const result = sanitizeArticleContent(md);
  assert.match(result, /<table>/);
  assert.match(result, /<th>Name<\/th>/);
  assert.match(result, /<td>A<\/td>/);
});

// ── loginSchema (existing + more) ────────────────────────────

test("login accepts username identifiers", () => {
  assert.equal(loginSchema.parse({ identifier: "test-admin", password: "StrongTestPassword!2026" }).identifier, "test-admin");
});

test("login rejects short identifier", () => {
  assert.throws(() => loginSchema.parse({ identifier: "ab", password: "12345678" }));
});

test("login rejects short password", () => {
  assert.throws(() => loginSchema.parse({ identifier: "admin", password: "1234567" }));
});

// ── postSchema ───────────────────────────────────────────────

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

// ── isLocale ─────────────────────────────────────────────────

test("isLocale returns true for fa and en", () => {
  assert.equal(isLocale("fa"), true);
  assert.equal(isLocale("en"), true);
});

test("isLocale returns false for other strings", () => {
  assert.equal(isLocale("fr"), false);
  assert.equal(isLocale("de"), false);
  assert.equal(isLocale(""), false);
  assert.equal(isLocale("FA"), false);
  assert.equal(isLocale("English"), false);
});

test("locales array contains exactly fa and en", () => {
  assert.deepEqual([...locales], ["fa", "en"]);
});
