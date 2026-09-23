import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

const allowedTags = [
  "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "img", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
];

function looksLikeMarkdown(content: string): boolean {
  if (/^#{1,3}\s/m.test(content)) return true;
  if (/```/m.test(content)) return true;
  if (/^\s*[-*+]\s/m.test(content)) return true;
  if (/^\s*\d+\.\s/m.test(content)) return true;
  if (/^\|.*\|/m.test(content)) return true;
  if (/\[.+\]\(.+\)/.test(content)) return true;
  if (/\*\*[^*]+\*\*/.test(content)) return true;
  if (/(?<!\w)\*[^*]+\*(?!\w)/.test(content)) return true;
  return false;
}

marked.setOptions({ breaks: true, gfm: true });

function stripCmsHtml(html: string): string {
  return html
    .replace(/<\/?pre[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

export function sanitizeArticleContent(content: string) {
  let source: string;

  if (/<[a-z][\s\S]*>/i.test(content) && !looksLikeMarkdown(content)) {
    source = content;
  } else if (looksLikeMarkdown(content)) {
    const stripped = stripCmsHtml(content);
    source = marked.parse(stripped) as string;
  } else {
    source = content
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${sanitizeHtml(paragraph, { allowedTags: [] }).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  return sanitizeHtml(source, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, rel: "noopener noreferrer", target: attribs.target ?? "_blank" },
      }),
    },
  });
}