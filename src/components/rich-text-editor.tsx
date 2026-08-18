"use client";

import { Bold, Code2, ImagePlus, Italic, Link, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useRef, useState } from "react";

export function RichTextEditor({ name, label, initialValue = "", direction }: { name: string; label: string; initialValue?: string; direction: "rtl" | "ltr" }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(initialValue);
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;

  function command(name: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    setHtml(editorRef.current?.innerHTML ?? "");
  }

  function addLink() {
    const url = window.prompt("نشانی پیوند را وارد کنید");
    if (url) command("createLink", url);
  }

  function addImage() {
    const url = window.prompt("نشانی تصویر را وارد کنید");
    if (url) command("insertImage", url);
  }

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

  return (
    <div>
      <span className="form-label">{label}</span>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]">
        <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
          <select className="rounded-lg bg-[#1f2937] px-2 text-xs" defaultValue="p" onChange={(event) => command("formatBlock", event.target.value)} aria-label="نوع متن">
            <option value="p">متن</option><option value="h2">تیتر اصلی</option><option value="h3">زیرتیتر</option>
          </select>
          {tools.map(([title, Icon, toolCommand, value]) => <button key={title} type="button" title={title} aria-label={title} onMouseDown={(event) => { event.preventDefault(); if (toolCommand === "link") addLink(); else if (toolCommand === "image") addImage(); else command(toolCommand, value); }} className="grid size-9 place-items-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"><Icon size={16} /></button>)}
        </div>
        <div
          ref={editorRef}
          className="admin-editor min-h-80 p-5 leading-8 text-gray-200 outline-none"
          contentEditable
          dir={direction}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: initialValue }}
          onInput={(event) => setHtml(event.currentTarget.innerHTML)}
        />
      </div>
      <input type="hidden" name={name} value={html} />
      <p className="mt-2 text-xs text-gray-500">{wordCount} واژه · حدود {Math.max(1, Math.ceil(wordCount / 220))} دقیقه مطالعه</p>
    </div>
  );
}
