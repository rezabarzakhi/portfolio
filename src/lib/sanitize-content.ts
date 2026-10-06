import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import hljs from "highlight.js";

const allowedTags = [
  "p", "br", "h1", "h2", "h3", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "img", "hr",
  "table", "thead", "tbody", "tr", "th", "td", "span",
];

function looksLikeMarkdown(content: string): boolean {
  if (/^#{1,3}\s/m.test(content)) return true;
  if (/```/m.test(content)) return true;
  if (/<pre[^>]*class="code"/i.test(content)) return true;
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
  let result = html
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");

  result = result.replace(
    /<pre[^>]*class="code"[^>]*>([\s\S]*?)<\/pre>/gi,
    (_match, code: string) => `\n\`\`\`\n${code.trim()}\n\`\`\`\n`
  );

  result = result.replace(/<\/?pre[^>]*>/gi, "");

  return result;
}

export function sanitizeArticleContent(content: string) {  let source: string;

  if (/<pre[^>]*class="code"/i.test(content)) {
    const stripped = stripCmsHtml(content);
    source = marked.parse(stripped) as string;
  } else if (/<[a-z][\s\S]*>/i.test(content) && !looksLikeMarkdown(content)) {
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
      // Article pages already render the post title as the single <h1>,
      // so headings inside the body copy are demoted to keep one <h1> per page.
      h1: (_tagName, attribs) => ({ tagName: "h2", attribs }),
    },
  });
}

export function toAbsoluteUrl(siteUrl: string, value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

export type FaqPair = { question: string; answer: string };

// Extracts question/answer pairs from the CMS "سوالات پرتکرار" pattern:
// a paragraph whose bold lead ends with a question mark, followed by the answer.
export function extractFaqPairs(html: string): FaqPair[] {
  const pairs: FaqPair[] = [];
  const pattern = /<p>\s*<strong>([^<]{4,300}?)<\/strong>\s*<br\s*\/?>\s*([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null && pairs.length < 20) {
    const question = match[1].trim();
    const answer = match[2]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!/[؟?]/.test(question)) continue;
    if (answer.length < 10) continue;
    pairs.push({ question, answer: answer.slice(0, 1000) });
  }
  return pairs;
}