"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

type UploadState = "idle" | "uploading" | "done" | "error";

export function ImageUpload({
  name,
  label,
  accept = "image/jpeg,image/png,image/webp",
  currentUrl,
  required = false,
}: {
  name: string;
  label: string;
  accept?: string;
  currentUrl?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);

  const handleChange = useCallback(() => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadState("uploading");
    setProgress(0);

    const reader = new FileReader();
    reader.onloadstart = () => setProgress(10);
    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 80));
    };
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setProgress(100);
      setUploadState("done");
    };
    reader.onerror = () => {
      setUploadState("error");
      setFileName("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setPreview(null);
    setFileName("");
    setUploadState("idle");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const displayUrl = preview || currentUrl;
  const hasImage = !!displayUrl;

  return (
    <label className={`image-upload ${hasImage ? "image-upload-has-image" : ""}`}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        className="sr-only"
        onChange={handleChange}
      />
      <div className="image-upload-preview">
        {displayUrl && (
          <Image
            src={displayUrl}
            alt={label}
            width={200}
            height={120}
            className="object-contain"
            unoptimized
          />
        )}
        <div className="image-upload-overlay">
          {uploadState === "uploading" ? (
            <>
              <span>در حال بارگذاری...</span>
              <span className="text-xs opacity-70">{fileName}</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>{hasImage ? "تغییر تصویر" : "انتخاب تصویر"}</span>
              <span className="text-xs opacity-70">{label}</span>
            </>
          )}
        </div>
      </div>
      {uploadState === "uploading" && (
        <div className="px-3 pb-3">
          <div className="upload-progress">
            <div className="upload-progress-bar upload-progress-animate" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-center">{progress}%</p>
        </div>
      )}
      {uploadState === "done" && preview && (
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="text-xs text-emerald-400 truncate">{fileName}</span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleClear(); }}
            className="text-gray-400 hover:text-red-400 transition-colors"
            aria-label="حذف تصویر انتخاب شده"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </label>
  );
}
