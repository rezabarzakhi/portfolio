"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@prisma/client";
import { AdminInput, AdminSection, AdminTextarea } from "@/components/admin-fields";
import { ImageUpload } from "@/components/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { toast } from "@/components/toast";
import { savePost, type FormState } from "@/app/admin/actions";

const initial: FormState = null;

function FieldErrors({ state, field }: { state: FormState; field: string }) {
  if (!state || state.status !== "error" || !state.errors) return null;
  const error = state.errors[field];
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-400">{error}</p>;
}

export function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, initial);
  const router = useRouter();
  const publishedAt = post?.publishedAt?.toISOString().slice(0, 16);

  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      toast.success(state.message);
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error(state.message, { long: true });
    }
  }, [state, router]);

  return (
    <form action={action} className="grid gap-7" noValidate>
      {post && <input type="hidden" name="id" value={post.id} />}
      <AdminSection title="اطلاعات اصلی">
        <div className="grid gap-5 md:grid-cols-2">
          <div><AdminInput label="عنوان فارسی" name="titleFa" defaultValue={post?.titleFa} required /><FieldErrors state={state} field="titleFa" /></div>
          <div><AdminInput label="عنوان انگلیسی" name="titleEn" defaultValue={post?.titleEn} required /><FieldErrors state={state} field="titleEn" /></div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div><AdminInput label="نشانی انگلیسی" name="slug" defaultValue={post?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="article-slug" required /><FieldErrors state={state} field="slug" /></div>
          <div><AdminInput label="دسته فارسی" name="categoryFa" defaultValue={post?.categoryFa} required /><FieldErrors state={state} field="categoryFa" /></div>
          <div><AdminInput label="دسته انگلیسی" name="categoryEn" defaultValue={post?.categoryEn} required /><FieldErrors state={state} field="categoryEn" /></div>
        </div>
        <div className="mt-5"><AdminInput label="برچسب‌ها با ویرگول" name="tags" defaultValue={post?.tags} placeholder="نکست، طراحی وب، آموزش" /></div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div><AdminTextarea label="خلاصه فارسی" name="excerptFa" defaultValue={post?.excerptFa} maxLength={350} required /><FieldErrors state={state} field="excerptFa" /></div>
          <div><AdminTextarea label="خلاصه انگلیسی" name="excerptEn" defaultValue={post?.excerptEn} maxLength={350} required /><FieldErrors state={state} field="excerptEn" /></div>
        </div>
      </AdminSection>

      <AdminSection title="محتوای مقاله">
        <div className="grid gap-7"><RichTextEditor name="contentFa" label="محتوای فارسی" direction="rtl" initialValue={post?.contentFa} /><RichTextEditor name="contentEn" label="محتوای انگلیسی" direction="ltr" initialValue={post?.contentEn} /></div>
      </AdminSection>

      <AdminSection title="تصویر شاخص">
        <div className="grid gap-5 md:grid-cols-2">
          <div><AdminInput label="نشانی تصویر" name="imageUrl" defaultValue={post?.imageUrl} placeholder="یا تصویر را بارگذاری کنید" /><FieldErrors state={state} field="imageUrl" /></div>
          <ImageUpload name="imageFile" label="تصویر شاخص" currentUrl={post?.imageUrl || undefined} />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2"><AdminInput label="متن جایگزین فارسی" name="imageAltFa" defaultValue={post?.imageAltFa} maxLength={180} /><AdminInput label="متن جایگزین انگلیسی" name="imageAltEn" defaultValue={post?.imageAltEn} maxLength={180} /></div>
      </AdminSection>

      <AdminSection title="تنظیمات موتور جست‌وجو">
        <div className="grid gap-5 md:grid-cols-2">
          <div><AdminInput label="عنوان جست‌وجوی فارسی" name="seoTitleFa" defaultValue={post?.seoTitleFa || post?.titleFa} maxLength={70} required /><FieldErrors state={state} field="seoTitleFa" /></div>
          <div><AdminInput label="عنوان جست‌وجوی انگلیسی" name="seoTitleEn" defaultValue={post?.seoTitleEn || post?.titleEn} maxLength={70} required /><FieldErrors state={state} field="seoTitleEn" /></div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div><AdminTextarea label="توضیحات جست‌وجوی فارسی" name="seoDescriptionFa" defaultValue={post?.seoDescriptionFa} minLength={50} maxLength={170} required /><FieldErrors state={state} field="seoDescriptionFa" /></div>
          <div><AdminTextarea label="توضیحات جست‌وجوی انگلیسی" name="seoDescriptionEn" defaultValue={post?.seoDescriptionEn} minLength={50} maxLength={170} required /><FieldErrors state={state} field="seoDescriptionEn" /></div>
        </div>
        <div className="mt-5"><AdminInput label="نشانی مرجع اختیاری" name="canonicalUrl" type="url" defaultValue={post?.canonicalUrl ?? ""} /></div>
        <label className="mt-5 flex items-center gap-2"><input type="checkbox" name="allowIndex" value="true" defaultChecked={post?.allowIndex ?? true} /> اجازه نمایش در موتورهای جست‌وجو</label>
      </AdminSection>

      <AdminSection title="انتشار">
        <div className="grid gap-5 md:grid-cols-2"><AdminInput label="زمان انتشار" name="publishedAt" type="datetime-local" defaultValue={publishedAt} /><div className="flex flex-wrap items-end gap-6 pb-3"><label className="flex items-center gap-2"><input type="checkbox" name="featured" value="true" defaultChecked={post?.featured} /> مقاله منتخب</label><label className="flex items-center gap-2"><input type="checkbox" name="published" value="true" defaultChecked={post?.published} /> منتشر شود</label></div></div>
      </AdminSection>

      <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-white/10 bg-[#1a2332]/95 p-4 shadow-2xl backdrop-blur"><button className="button-primary min-w-40" type="submit" disabled={pending}>{pending ? "در حال ذخیره..." : post ? "ذخیره تغییرات" : "ایجاد مقاله"}</button></div>
    </form>
  );
}
