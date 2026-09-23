"use client";

import { Bold, Code2, FileText, ImagePlus, Italic, Link, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { marked } from "marked";
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

turndown.addRule("keepImages", {
  filter: "img",
  replacement: (_content, node) => {
    const el = node as HTMLImageElement;
    const alt = el.getAttribute("alt") ?? "";
    const src = el.getAttribute("src") ?? "";
    return `![${alt}](${src})`;
  },
});

marked.setOptions({ breaks: true, gfm: true });

const tools = [
  ["درشت", Bold, "bold", ""],
  ["مورب", Italic, "italic", ""],
  ["فهرست", List, "insertUnorderedList", ""],
  ["فهرست شماره‌دار", ListOrdered, "insertOrderedList", ""],
  ["نقل‌قول", Quote, "formatBlock", "blockquote"],
  ["کد", Code2, "formatBlock", "pre"],
  ["پیوند", Link, "link", ""],
  ["تصویر", ImagePlus, "image", ""],
  ["بازگشت", Undo2, "undo", ""],
  ["انجام دوباره", Redo2, "redo", ""],
] as const;

function EditorToolbar({ onExecCommand, onToggleMode, mode }: { onExecCommand: (cmd: string, value?: string) => void; onToggleMode: () => void; mode: "visual" | "markdown" }) {
  function handleTool(toolCommand: string, value: string) {
    if (toolCommand === "link") {
      const url = window.prompt("نشانی پیوند را وارد کنید");
      if (url) onExecCommand("createLink", url);
    } else if (toolCommand === "image") {
      const url = window.prompt("نشانی تصویر را وارد کنید");
      if (url) onExecCommand("insertImage", url);
    } else {
      onExecCommand(toolCommand, value);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
      {mode === "visual" && (
        <select className="rounded-lg bg-[#27374d] px-2 text-xs" defaultValue="p" onChange={(event) => onExecCommand("formatBlock", event.target.value)} aria-label="نوع متن">
          <option value="p">متن</option><option value="h2">تیتر اصلی</option><option value="h3">زیرتیتر</option>
        </select>
      )}
      {mode === "visual" && tools.map(([title, Icon, toolCommand, value]) => <button key={title} type="button" title={title} aria-label={title} onMouseDown={(event) => { event.preventDefault(); handleTool(toolCommand, value); }} className="grid size-9 place-items-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"><Icon size={16} /></button>)}
      <button type="button" title="تبدیل به Markdown" aria-label="تبدیل به Markdown" onClick={onToggleMode} className={`ms-auto grid size-9 place-items-center rounded-lg hover:bg-white/10 ${mode === "markdown" ? "text-emerald-400" : "text-gray-300 hover:text-white"}`}><FileText size={16} /></button>
    </div>
  );
}

export function RichTextEditor({ name, label, initialValue = "", direction }: { name: string; label: string; initialValue?: string; direction: "rtl" | "ltr" }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(initialValue);
  const [mode, setMode] = useState<"visual" | "markdown">("visual");
  const [markdownText, setMarkdownText] = useState(() => {
    try { return turndown.turndown(initialValue || ""); } catch { return initialValue || ""; }
  });
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;

  const execCommand = useCallback((cmd: string, value?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, value);
    setHtml(el.innerHTML);
  }, []);

  const toggleMode = useCallback(() => {
    if (mode === "visual") {
      const md = turndown.turndown(editorRef.current?.innerHTML ?? html);
      setMarkdownText(md);
      setMode("markdown");
    } else {
      const rendered = marked.parse(markdownText) as string;
      setHtml(rendered);
      setMode("visual");
      setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = rendered; }, 0);
    }
  }, [mode, html, markdownText]);

  return (
    <div className="min-w-0">
      <span className="form-label">{label}</span>
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a2332]/80 backdrop-blur-sm">
        <EditorToolbar onExecCommand={execCommand} onToggleMode={toggleMode} mode={mode} />
        {mode === "visual" ? (
          <div
            ref={editorRef}
            className="admin-editor min-h-80 w-full min-w-0 p-5 leading-8 text-gray-200 outline-none"
            contentEditable
            dir={direction}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: initialValue }}
            onInput={(event) => setHtml(event.currentTarget.innerHTML)}
          />
        ) : (
          <textarea
            className="admin-editor min-h-80 w-full resize-y border-0 bg-transparent p-5 font-mono text-sm leading-7 text-gray-200 outline-none"
            style={{ overflowWrap: "break-word", wordBreak: "break-word", maxWidth: "100%" }}
            dir={direction}
            value={markdownText}
            onChange={(event) => {
              setMarkdownText(event.target.value);
              const rendered = marked.parse(event.target.value) as string;
              setHtml(rendered);
            }}
            spellCheck={false}
          />
        )}
      </div>
      <input type="hidden" name={name} value={html} />
      <p className="mt-2 text-xs text-gray-500">{wordCount} واژه · حدود {Math.max(1, Math.ceil(wordCount / 220))} دقیقه مطالعه</p>
    </div>
  );
}