import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "img", "hr",
];

export function sanitizeArticleContent(content: string) {
  const source = /<[a-z][\s\S]*>/i.test(content)
    ? content
    : content
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${sanitizeHtml(paragraph, { allowedTags: [] }).replace(/\n/g, "<br>")}</p>`)
        .join("");

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
