import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import hljs from "highlight.js";

const allowedTags = [
  "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "img", "hr",
  "table", "thead", "tbody", "tr", "th", "td", "span",
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

const highlightExtension = {
  name: "highlight",
  level: "block" as const,
  start(src: string) { return src.match(/```/)?.index; },
  tokenizer(src: string) {
    const match = src.match(/^```(\w*)\n([\s\S]*?)\n```/);
    if (match) {
      return {
        type: "highlight",
        raw: match[0],
        lang: match[1],
        text: match[2],
      };
    }
  },
  renderer(token: { lang: string; text: string }) {
    const lang = token.lang;
    const code = lang && hljs.getLanguage(lang)
      ? hljs.highlight(token.text, { language: lang }).value
      : hljs.highlightAuto(token.text).value;
    const langClass = lang ? ` language-${lang}` : "";
    return `<pre><code class="hljs${langClass}">${code}</code></pre>\n`;
  },
};

marked.use({ extensions: [highlightExtension] });

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
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      pre: ["class"],
      code: ["class"],
      span: ["class"],
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