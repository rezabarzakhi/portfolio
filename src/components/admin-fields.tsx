import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminInput({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label><span className="form-label">{label}</span><input className={`form-field${error ? " form-field-invalid" : ""}`} {...props} /></label>;
}

export function AdminTextarea({ label, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return <label><span className="form-label">{label}</span><textarea className={`form-field min-h-28${error ? " form-field-invalid" : ""}`} {...props} /></label>;
}

export function AdminSection({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return <section className="surface rounded-2xl p-5 sm:p-7"><div className="mb-7 flex items-center justify-between"><h2 className="text-xl font-black">{title}</h2>{count !== undefined && <span className="rounded-full bg-[#526d82]/20 px-3 py-1 text-xs text-[#9db2bf]">{count}</span>}</div>{children}</section>;
}
